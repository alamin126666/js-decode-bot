import { webcrack } from "webcrack";
import { parse } from "@babel/parser";
import _traverse from "@babel/traverse";
import _generate from "@babel/generator";

// ESM/CJS interop
const traverse = (_traverse as any).default ?? _traverse;
const generate = (_generate as any).default ?? _generate;

function makeName(n: number): string {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  if (n < 26) return letters[n];
  return letters[n % 26] + Math.floor(n / 26);
}

function isObfuscated(name: string): boolean {
  return /^_0x[0-9a-fA-F]+/.test(name);
}

function renameVars(code: string): string {
  const ast = parse(code, {
    sourceType: "script",
    allowReturnOutsideFunction: true,
    errorRecovery: true,
  });

  const globalMap: Record<string, string> = {};
  let counter = 0;

  traverse(ast, {
    Identifier(path: any) {
      const name = path.node.name;
      if (isObfuscated(name)) {
        if (!globalMap[name]) {
          globalMap[name] = "v_" + makeName(counter++);
        }
        path.node.name = globalMap[name];
      }
    },
  });

  const out = generate(ast, { compact: false, comments: true });
  return out.code;
}

export async function decodeJS(code: string): Promise<string> {
  let decoded = code;

  // Step 1: webcrack — decode string arrays, control flow, etc.
  try {
    const result = await webcrack(code);
    decoded = result.code;
  } catch {
    // keep original on failure
  }

  // Step 2: Babel — rename _0x hex identifiers to readable names
  try {
    decoded = renameVars(decoded);
  } catch {
    // keep webcrack output on failure
  }

  return decoded;
}

export async function decodeHTML(html: string): Promise<string> {
  // Match inline <script> blocks (no src= attribute)
  const scriptRegex =
    /<script(?![^>]*\bsrc\s*=)[^>]*>([\s\S]*?)<\/script>/gi;

  let result = html;
  // Collect all matches first (avoid regex state issues during replace)
  const matches: Array<{ full: string; inner: string; index: number }> = [];

  let m: RegExpExecArray | null;
  while ((m = scriptRegex.exec(html)) !== null) {
    const inner = m[1];
    if (inner && inner.trim().length > 0) {
      matches.push({ full: m[0], inner, index: m.index });
    }
  }

  // Decode each script block
  for (const match of matches) {
    try {
      const decoded = await decodeJS(match.inner);
      const newTag = match.full.replace(
        match.inner,
        "\n" + decoded + "\n",
      );
      result = result.replace(match.full, newTag);
    } catch {
      // keep original block on failure
    }
  }

  return result;
}
