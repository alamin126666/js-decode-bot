import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { logger } from "./lib/logger.js";
import { decodeJS, decodeHTML } from "./deobfuscate.js";

const WELCOME = `\
🤖 *JS Decoder Bot*

Obfuscated JavaScript কে readable code-এ convert করে দেবো।

*কী পাঠাবেন:*
📄 \`.js\` file — obfuscated JS decode হবে
🌐 \`.html\` file — HTML-এর ভেতরের সব \`<script>\` decode হবে
💬 Text — সরাসরি obfuscated JS code paste করুন

*Powered by:* webcrack + Babel`;

export function startBot(): void {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  if (!token) {
    logger.warn("TELEGRAM_BOT_TOKEN not set — Telegram bot not started");
    return;
  }

  const bot = new Telegraf(token);

  // /start
  bot.start((ctx) =>
    ctx.reply(WELCOME, { parse_mode: "Markdown" }),
  );

  // /help
  bot.help((ctx) =>
    ctx.reply(
      "📁 `.js` বা `.html` file পাঠান, অথবা obfuscated JS code সরাসরি paste করুন।",
      { parse_mode: "Markdown" },
    ),
  );

  // File uploads
  bot.on(message("document"), async (ctx) => {
    const doc = ctx.message.document;
    const fileName = doc.file_name ?? "file";
    const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

    if (!["js", "html", "htm"].includes(ext)) {
      await ctx.reply("⚠️ শুধু `.js` বা `.html` file পাঠান।", {
        parse_mode: "Markdown",
      });
      return;
    }

    const statusMsg = await ctx.reply(`⏳ *${fileName}* decode হচ্ছে...`, {
      parse_mode: "Markdown",
    });

    try {
      // Download the file from Telegram servers
      const fileLink = await ctx.telegram.getFileLink(doc.file_id);
      const res = await fetch(fileLink.href);
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const content = await res.text();

      let decoded: string;
      let outName: string;

      if (ext === "js") {
        decoded = await decodeJS(content);
        outName = fileName.replace(/\.js$/i, "_decoded.js");
      } else {
        decoded = await decodeHTML(content);
        outName = fileName.replace(/\.html?$/i, "_decoded.html");
      }

      await ctx.replyWithDocument(
        { source: Buffer.from(decoded, "utf-8"), filename: outName },
        {
          caption: `✅ *${fileName}* decode সম্পন্ন!\n📥 Decoded file নিচে আছে।`,
          parse_mode: "Markdown",
        },
      );
    } catch (err) {
      logger.error({ err }, "Bot: decode error");
      await ctx.reply(
        "❌ Decode করতে সমস্যা হয়েছে। Valid obfuscated JS/HTML পাঠান।",
      );
    } finally {
      // Delete "processing..." message
      try {
        await ctx.telegram.deleteMessage(
          ctx.chat.id,
          statusMsg.message_id,
        );
      } catch { /* ignore */ }
    }
  });

  // Text: raw pasted JS code
  bot.on(message("text"), async (ctx) => {
    const text = ctx.message.text.trim();
    if (text.startsWith("/")) return;

    const looksObfuscated =
      text.includes("_0x") ||
      (text.includes("0x") && text.includes("function")) ||
      text.includes("parseInt") && text.includes("push") && text.includes("shift");

    if (!looksObfuscated) {
      await ctx.reply(
        "📁 `.js` বা `.html` file পাঠান, অথবা obfuscated JS code paste করুন।",
        { parse_mode: "Markdown" },
      );
      return;
    }

    const statusMsg = await ctx.reply("⏳ Code decode হচ্ছে...");

    try {
      const decoded = await decodeJS(text);

      if (decoded.length > 3800) {
        // Too long for a message — send as file
        await ctx.replyWithDocument(
          {
            source: Buffer.from(decoded, "utf-8"),
            filename: "decoded.js",
          },
          { caption: "✅ Decode সম্পন্ন!" },
        );
      } else {
        await ctx.reply(
          "✅ *Decoded:*\n\n```javascript\n" + decoded + "\n```",
          { parse_mode: "Markdown" },
        );
      }
    } catch (err) {
      logger.error({ err }, "Bot: text decode error");
      await ctx.reply("❌ Decode করতে সমস্যা হয়েছে।");
    } finally {
      try {
        await ctx.telegram.deleteMessage(
          ctx.chat.id,
          statusMsg.message_id,
        );
      } catch { /* ignore */ }
    }
  });

  bot.launch({ dropPendingUpdates: true });
  logger.info("Telegram bot started (long-polling)");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}
