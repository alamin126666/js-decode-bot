const $ = (v_a) => document.getElementById(v_a);
function go(v_b) {
  document
    .querySelectorAll(".page")
    .forEach((v_c) => v_c.classList.remove("active"));
  $(v_b).classList.add("active");
  if (v_b === "login") {
    setTimeout(previewSavedKey, 300);
  }
  if (v_b === "signal") {
    setTimeout(() => {
      const v_d = getPlayStatus();
      if (!v_d.active) {
        _signalAllowed = false;
        $("signalOffBanner").classList.add("show");
        $("predVal").className = "pred-val WAIT";
        $("predVal").textContent = "OFF";
        $("predMeta").textContent = "Signal closed";
        $("predTypeBadge").textContent = "OUTSIDE PLAY WINDOW";
        showPwDlg(true, v_d);
      }
    }, 400);
  }
}
const STATE = {
  signals: [],
  results: {},
  recovery: false,
  win: 0,
  loss: 0,
  streak: 0,
  lastPredPeriod: null,
};
const BOOT_MSGS = [
  "BOOTING SYSTEM...",
  "CONNECTING API...",
  "CALIBRATING AI...",
  "LOADING SIGNALS...",
  "READY",
];
let loadP = 0;
const loadIv = setInterval(() => {
  loadP += 100 / 60;
  if (loadP >= 100) {
    loadP = 100;
    clearInterval(loadIv);
    setTimeout(() => go("landing"), 400);
  }
  $("loadFill").style.width = loadP + "%";
  const v_e = Math.min(4, Math.floor(loadP / 20));
  $("loadStatus").textContent = BOOT_MSGS[v_e];
  $("loadTxt").textContent = "INITIALIZING • " + Math.floor(loadP) + "%";
}, 100);
function updateSlider() {
  const v_f = document.querySelector(".bnav button.active");
  const v_g = $("bnav");
  if (!v_f || !v_g) {
    return;
  }
  const v_h = v_g.getBoundingClientRect();
  const v_i = v_f.getBoundingClientRect();
  const v_j = $("bnavSlider");
  v_j.style.left = v_i.left - v_h.left + "px";
  v_j.style.width = v_i.width + "px";
}
setTimeout(updateSlider, 80);
const infos = [
  {
    i: "ri-flashlight-fill",
    t: "Realtime AI",
    d: "Live market signal engine",
  },
  {
    i: "ri-crosshair-2-fill",
    t: "3-Num Logic",
    d: "Triple pattern prediction",
  },
  {
    i: "ri-timer-flash-fill",
    t: "1 Min Mode",
    d: "WinGo 1 Minute period",
  },
  {
    i: "ri-shield-check-fill",
    t: "Safe Logic",
    d: "Smart recovery system",
  },
  {
    i: "ri-line-chart-fill",
    t: "Smart Trend",
    d: "Detects zigzag, repeat, double",
  },
  {
    i: "ri-function-fill",
    t: "300+ Combos",
    d: "Deep pattern matrix",
  },
  {
    i: "ri-fire-fill",
    t: "Hot Streaks",
    d: "Win streak tracking",
  },
  {
    i: "ri-bar-chart-box-fill",
    t: "Live Stats",
    d: "Win/Loss counters",
  },
  {
    i: "ri-history-line",
    t: "Full History",
    d: "Track every prediction",
  },
  {
    i: "ri-sparkling-2-fill",
    t: "Cyber UI",
    d: "Premium animated interface",
  },
  {
    i: "ri-lock-password-fill",
    t: "Key System",
    d: "Supabase secured access",
  },
  {
    i: "ri-telegram-fill",
    t: "24/7 Support",
    d: "Telegram help channel",
  },
];
const ig = $("infoGrid");
infos.forEach((v_k, v_l) => {
  const v_m = document.createElement("div");
  v_m.className = "info-card";
  v_m.style.animationDelay = v_l * 0.06 + "s";
  v_m.innerHTML =
    '<div class="ic"><i class="' +
    v_k.i +
    '"></i></div><h4>' +
    v_k.t +
    "</h4><p>" +
    v_k.d +
    "</p>";
  ig.appendChild(v_m);
});
const SB_URL = "https://jmqqfsymvpktynabvgmu.supabase.co";
const SB_KEY = "sb_publishable_dCgDbN7j4CPGy3GfXVL1Eg_xLC1x3Et";
let _sb = null;
try {
  _sb = window.supabase.createClient(SB_URL, SB_KEY);
} catch (v_n) {}
const DEVICE_ID = (() => {
  let v_o = localStorage.getItem("baw_did");
  if (!v_o) {
    v_o =
      "D" +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).slice(2, 6).toUpperCase();
    localStorage.setItem("baw_did", v_o);
  }
  return v_o;
})();
let _activeKey = null;
function fmtMin(v_p) {
  if (v_p < 60) {
    return v_p + "m";
  }
  if (v_p < 1440) {
    return (v_p / 60).toFixed(1) + "h";
  }
  return Math.round(v_p / 1440) + "d";
}
async function doLogin() {
  const v_q = $("passInput").value.trim().toUpperCase();
  if (!v_q) {
    $("loginErr").textContent = "Key দিন";
    return;
  }
  const v_r = $("loginBtn");
  v_r.disabled = true;
  v_r.innerHTML = '<i class="ri-loader-4-line"></i> CHECKING...';
  $("loginErr").textContent = "";
  if (!_sb) {
    $("loginErr").textContent = "⚠ Config error";
    v_r.disabled = false;
    v_r.innerHTML = '<i class="ri-key-2-fill"></i> VERIFY & LOGIN';
    return;
  }
  const { data: v_s, error: v_t } = await _sb
    .from("baw_keys")
    .select("*")
    .eq("key_code", v_q)
    .single();
  v_r.disabled = false;
  v_r.innerHTML = '<i class="ri-key-2-fill"></i> VERIFY & LOGIN';
  if (v_t || !v_s) {
    $("loginErr").textContent = "✗ Invalid key!";
    $("passInput").style.borderColor = "var(--red)";
    setTimeout(() => ($("passInput").style.borderColor = ""), 900);
    return;
  }
  if (!v_s.is_active) {
    $("loginErr").textContent = "✗ Key disable করা হয়েছে।";
    return;
  }
  const v_u = new Date();
  let v_v;
  if (!v_s.first_used_at) {
    v_v = new Date(v_u.getTime() + v_s.duration_minutes * 60000);
    await _sb
      .from("baw_keys")
      .update({
        first_used_at: v_u.toISOString(),
        expires_at: v_v.toISOString(),
      })
      .eq("id", v_s.id);
  } else {
    v_v = new Date(v_s.expires_at);
  }
  if (v_v < v_u) {
    $("loginErr").textContent = "✗ Key expired! নতুন key নিন।";
    return;
  }
  const v_w = Array.isArray(v_s.devices_used) ? v_s.devices_used : [];
  if (!v_w.includes(DEVICE_ID)) {
    if (v_w.length >= v_s.device_limit) {
      $("loginErr").textContent =
        "✗ Device limit পূর্ণ! Max " + v_s.device_limit + "।";
      return;
    }
    const v_x = {
      devices_used: [...v_w, DEVICE_ID],
    };
    await _sb.from("baw_keys").update(v_x).eq("id", v_s.id);
  }
  _activeKey = v_s;
  localStorage.setItem("baw_saved_key", v_q);
  $("keyInfoBar").style.display = "none";
  go("signal");
  startEngine();
  setTimeout(updateSlider, 120);
  startKeyExpireWatcher(v_v);
  initPlayWindow();
}
let _keyExpWatcher = null;
function startKeyExpireWatcher(v_y) {
  if (_keyExpWatcher) {
    clearInterval(_keyExpWatcher);
  }
  _keyExpWatcher = setInterval(() => {
    if (new Date() > v_y) {
      clearInterval(_keyExpWatcher);
      go("login");
      $("loginErr").textContent = "✗ Key expired!";
      $("passInput").value = "";
      $("keyInfoBar").style.display = "none";
    }
  }, 15000);
}
async function previewSavedKey() {
  const v_z = localStorage.getItem("baw_saved_key");
  if (v_z && $("passInput")) {
    $("passInput").value = v_z;
    await fetchKeyPreview(v_z);
  }
}
async function fetchKeyPreview(v_a1) {
  if (!_sb || !v_a1) {
    return;
  }
  const { data: v_b1 } = await _sb
    .from("baw_keys")
    .select("*")
    .eq("key_code", v_a1.toUpperCase())
    .single();
  if (!v_b1) {
    return;
  }
  const v_c1 = new Date();
  const v_d1 = !v_b1.first_used_at;
  const v_e1 = new Date(v_b1.expires_at);
  const v_f1 = !v_d1 && v_e1 < v_c1;
  $("kInfoLabel").textContent = v_b1.label || "—";
  $("kInfoDur").textContent = fmtMin(v_b1.duration_minutes);
  if (v_d1) {
    $("kInfoStatus").textContent = "NOT STARTED YET";
    $("kInfoStatus").style.color = "var(--gold)";
  } else if (v_f1) {
    $("kInfoStatus").textContent = "EXPIRED";
    $("kInfoStatus").style.color = "var(--red)";
  } else {
    const v_g1 = Math.max(0, Math.round((v_e1 - v_c1) / 60000));
    $("kInfoStatus").textContent = fmtMin(v_g1) + " LEFT";
    $("kInfoStatus").style.color = "var(--green)";
  }
  $("kInfoDev").textContent =
    (Array.isArray(v_b1.devices_used) ? v_b1.devices_used.length : 0) +
    "/" +
    v_b1.device_limit;
  $("keyInfoBar").style.display = "block";
}
$("passInput")?.addEventListener("keydown", (v_h1) => {
  if (v_h1.key === "Enter") {
    doLogin();
  }
});
$("passInput")?.addEventListener("input", (v_i1) => {
  v_i1.target.value = v_i1.target.value.toUpperCase();
  $("keyInfoBar").style.display = "none";
  $("loginErr").textContent = "";
});
const PLAY_WINDOWS = [
  {
    label: "08:00 AM",
    startH: 8,
    startM: 0,
    durationMin: 40,
  },
  {
    label: "11:20 AM",
    startH: 11,
    startM: 20,
    durationMin: 20,
  },
  {
    label: "03:15 PM",
    startH: 15,
    startM: 15,
    durationMin: 35,
  },
  {
    label: "07:30 PM",
    startH: 19,
    startM: 30,
    durationMin: 20,
  },
  {
    label: "09:40 PM",
    startH: 21,
    startM: 40,
    durationMin: 10,
  },
];
function getBDT() {
  const v_j1 = new Date();
  return new Date(v_j1.getTime() + v_j1.getTimezoneOffset() * 60000 + 21600000);
}
function getPlayStatus() {
  const v_k1 = getBDT();
  const v_l1 = v_k1.getHours() * 60 + v_k1.getMinutes();
  const v_m1 = v_k1.getSeconds();
  const v_n1 = new Date(v_k1);
  v_n1.setHours(0, 0, 0, 0);
  for (let v_o1 = 0; v_o1 < PLAY_WINDOWS.length; v_o1++) {
    const v_p1 = PLAY_WINDOWS[v_o1];
    const v_q1 = v_p1.startH * 60 + v_p1.startM;
    const v_r1 = v_q1 + v_p1.durationMin;
    if (v_l1 >= v_q1 && v_l1 < v_r1) {
      const v_s1 = v_l1 - v_q1 + v_m1 / 60;
      const v_t1 = v_p1.durationMin - v_s1;
      const v_u1 = new Date(v_n1.getTime() + v_r1 * 60000);
      const v_v1 = PLAY_WINDOWS[(v_o1 + 1) % PLAY_WINDOWS.length];
      let v_w1 = v_n1.getTime() + (v_v1.startH * 60 + v_v1.startM) * 60000;
      if (v_o1 === PLAY_WINDOWS.length - 1) {
        v_w1 += 86400000;
      }
      return {
        active: true,
        window: v_p1,
        minutesLeft: v_t1,
        windowEnd: v_u1,
        nextWindow: v_v1,
        msToNext: v_w1 - Date.now(),
      };
    }
  }
  let v_x1 = null;
  let v_y1 = Infinity;
  for (let v_z1 = 0; v_z1 < PLAY_WINDOWS.length; v_z1++) {
    const v_a2 = PLAY_WINDOWS[v_z1];
    const v_b2 = v_a2.startH * 60 + v_a2.startM;
    let v_c2 = v_n1.getTime() + v_b2 * 60000;
    if (v_l1 >= v_b2) {
      v_c2 += 86400000;
    }
    const v_d2 = v_c2 - Date.now();
    if (v_d2 < v_y1) {
      v_y1 = v_d2;
      v_x1 = v_a2;
    }
  }
  const v_e2 = {
    active: false,
    window: null,
    minutesLeft: 0,
    windowEnd: null,
    nextWindow: v_x1,
    msToNext: v_y1,
  };
  return v_e2;
}
function fmtHHMMSS(v_f2) {
  if (v_f2 <= 0) {
    return "00:00:00";
  }
  const v_g2 = Math.floor(v_f2 / 1000);
  const v_h2 = Math.floor(v_g2 / 3600);
  const v_i2 = Math.floor((v_g2 % 3600) / 60);
  const v_j2 = v_g2 % 60;
  return (
    String(v_h2).padStart(2, "0") +
    ":" +
    String(v_i2).padStart(2, "0") +
    ":" +
    String(v_j2).padStart(2, "0")
  );
}
let _pwInited = false;
let _pwCheckInterval = null;
let _signalAllowed = false;
let _sessionEndNotified = false;
function initPlayWindow() {
  if (_pwInited) {
    return;
  }
  _pwInited = true;
  checkPlayWindow();
  _pwCheckInterval = setInterval(checkPlayWindow, 5000);
}
function checkPlayWindow() {
  const v_k2 = getPlayStatus();
  if (v_k2.active) {
    _signalAllowed = true;
    _sessionEndNotified = false;
    $("signalOffBanner").classList.remove("show");
    $("sobNextTxt").textContent = "";
    if ($("schedDot")) {
      $("schedDot").style.display = "block";
    }
    if (v_k2.minutesLeft > 0) {
      clearTimeout(window._sessionEndTimer);
      window._sessionEndTimer = setTimeout(
        () => {
          _signalAllowed = false;
          _sessionEndNotified = true;
          showPwDlg(false, getPlayStatus());
          $("signalOffBanner").classList.add("show");
          $("predVal").className = "pred-val WAIT";
          $("predVal").textContent = "OFF";
          $("predMeta").textContent = "Signal closed";
          $("predTypeBadge").textContent = "OUTSIDE PLAY WINDOW";
        },
        Math.max(0, (v_k2.minutesLeft - 0.05) * 60000),
      );
    }
  } else {
    _signalAllowed = false;
    $("signalOffBanner").classList.add("show");
    if ($("schedDot")) {
      $("schedDot").style.display = "none";
    }
    const v_l2 = v_k2.nextWindow
      ? "Next: " +
        v_k2.nextWindow.label +
        " (" +
        v_k2.nextWindow.durationMin +
        "min)"
      : "No more sessions today";
    $("sobNextTxt").textContent = v_l2;
    if (
      !_sessionEndNotified &&
      document.getElementById("signal").classList.contains("active")
    ) {
      _sessionEndNotified = true;
      showPwDlg(false, v_k2);
    }
  }
}
function buildScheduleHTML(v_m2) {
  const v_n2 = getBDT();
  const v_o2 = v_n2.getHours() * 60 + v_n2.getMinutes();
  return PLAY_WINDOWS.map((v_p2) => {
    const v_q2 = v_p2.startH * 60 + v_p2.startM;
    const v_r2 = v_q2 + v_p2.durationMin;
    let v_s2 = "done";
    let v_t2 = "DONE";
    if (v_o2 < v_q2) {
      v_s2 = "upcoming";
      v_t2 = "UPCOMING";
    } else if (v_o2 >= v_q2 && v_o2 < v_r2) {
      v_s2 = "active";
      v_t2 = "ACTIVE";
    }
    const v_u2 =
      v_m2.nextWindow && v_m2.nextWindow.label === v_p2.label && !v_m2.active;
    return (
      '<div class="pw-row' +
      (v_u2 ? " next-session" : "") +
      '">\n      <div><div class="pr-time">' +
      v_p2.label +
      '</div><div class="pr-dur">' +
      v_p2.durationMin +
      ' minutes</div></div>\n      <span class="pr-badge ' +
      v_s2 +
      '">' +
      v_t2 +
      "</span>\n    </div>"
    );
  }).join("");
}
let _pwCountdownIv = null;
function showPwDlg(v_v2, v_w2) {
  $("pwSchedule").innerHTML = buildScheduleHTML(v_w2);
  $("pwTitle").textContent =
    v_v2 || !v_w2.active ? "SIGNAL CLOSED" : "SESSION ENDED";
  $("pwSub").innerHTML =
    v_v2 || !v_w2.active
      ? "এই সময়ে signal পাওয়া যাবে না।<br>Schedule দেখুন:"
      : "Play window শেষ। পরবর্তী session এর জন্য অপেক্ষা করুন।";
  $("pwBack").classList.add("show");
  if (_pwCountdownIv) {
    clearInterval(_pwCountdownIv);
  }
  _pwCountdownIv = setInterval(() => {
    const v_x2 = getPlayStatus();
    if (v_x2.active) {
      clearInterval(_pwCountdownIv);
      $("pwBack").classList.remove("show");
      initPlayWindow();
      return;
    }
    $("pwCountdownVal").textContent = fmtHHMMSS(v_x2.msToNext);
    $("pwSchedule").innerHTML = buildScheduleHTML(v_x2);
  }, 1000);
}
function showScheduleDialog() {
  const v_y2 = getPlayStatus();
  $("pwTitle").textContent = "PLAY SCHEDULE";
  $("pwSub").innerHTML = "Bangladesh Time (BDT) signal sessions:";
  $("pwSchedule").innerHTML = buildScheduleHTML(v_y2);
  $("pwBack").classList.add("show");
  if (_pwCountdownIv) {
    clearInterval(_pwCountdownIv);
  }
  const v_z2 = v_y2.active ? "Session ends in:" : "Next session in:";
  const v_a3 = v_y2.active ? v_y2.windowEnd - Date.now() : v_y2.msToNext;
  $("pwCountdown").innerHTML =
    v_z2 + ' <span id="pwCountdownVal">' + fmtHHMMSS(v_a3) + "</span>";
  _pwCountdownIv = setInterval(() => {
    const v_b3 = getPlayStatus();
    $("pwCountdownVal").textContent = fmtHHMMSS(
      v_b3.active ? v_b3.windowEnd - Date.now() : v_b3.msToNext,
    );
    $("pwSchedule").innerHTML = buildScheduleHTML(v_b3);
  }, 1000);
}
function closePwDlg() {
  $("pwBack").classList.remove("show");
  if (_pwCountdownIv) {
    clearInterval(_pwCountdownIv);
  }
}
function switchView(v_c3) {
  $("dashView").style.display = v_c3 === "dash" ? "block" : "none";
  $("histView").style.display = v_c3 === "hist" ? "block" : "none";
  $("navDash").classList.toggle("active", v_c3 === "dash");
  $("navHist").classList.toggle("active", v_c3 === "hist");
  updateSlider();
  if (v_c3 === "hist") {
    renderHistory();
  }
}
function buildPeriod() {
  const v_d3 = new Date();
  const v_e3 = new Date(v_d3.getTime() + v_d3.getTimezoneOffset() * 60000);
  const v_f3 = v_e3.getFullYear();
  const v_g3 = String(v_e3.getMonth() + 1).padStart(2, "0");
  const v_h3 = String(v_e3.getDate()).padStart(2, "0");
  const v_i3 = v_e3.getHours() * 60 + v_e3.getMinutes();
  const v_j3 = v_e3.getSeconds();
  return {
    period: "" + v_f3 + v_g3 + v_h3 + "1000" + (10001 + v_i3),
    remaining: 60 - v_j3,
  };
}
function updatePeriod() {
  const { period: v_k3, remaining: v_l3 } = buildPeriod();
  $("periodVal").textContent = v_k3;
  $("timerVal").textContent = "00:" + String(v_l3).padStart(2, "0");
}
setInterval(updatePeriod, 1000);
function bs(v_m3) {
  if (v_m3 >= 5) {
    return "BIG";
  } else {
    return "SMALL";
  }
}
function colorOf(v_n3) {
  if (v_n3 === 0 || v_n3 === 5) {
    if (v_n3 === 0) {
      return "RED";
    } else {
      return "GREEN";
    }
  }
  if (v_n3 % 2 === 0) {
    return "RED";
  } else {
    return "GREEN";
  }
}
function build3Map() {
  const v_o3 = {};
  const v_p3 = [
    "SMALL",
    "SMALL",
    "SMALL",
    "BIG",
    "SMALL",
    "GREEN",
    "BIG",
    "BIG",
    "SMALL",
    "GREEN",
  ];
  for (let v_q3 = 0; v_q3 <= 9; v_q3++) {
    for (let v_r3 = 0; v_r3 <= 9; v_r3++) {
      for (let v_s3 = 0; v_s3 <= 9; v_s3++) {
        const v_t3 = v_q3 + ":" + v_r3 + ":" + v_s3;
        const v_u3 = v_q3 + v_r3 + v_s3;
        if (v_u3 <= 13) {
          v_o3[v_t3] = v_u3 % 2 === 0 ? "SMALL" : "BIG";
        } else {
          v_o3[v_t3] = v_u3 % 2 === 0 ? "BIG" : "SMALL";
        }
        const v_v3 = bs(v_q3) !== bs(v_r3);
        const v_w3 = bs(v_r3) !== bs(v_s3);
        if (v_v3 && v_w3) {
          v_o3[v_t3] = bs(v_q3) === "BIG" ? "SMALL" : "BIG";
        }
        if (v_q3 === v_r3 && v_r3 === v_s3) {
          v_o3[v_t3] = v_q3 <= 4 ? "BIG" : "SMALL";
        }
        if (v_q3 === v_r3 && v_r3 !== v_s3) {
          v_o3[v_t3] = bs(v_s3) === "BIG" ? "SMALL" : "BIG";
        }
        if (v_r3 === v_s3 && v_q3 !== v_r3) {
          v_o3[v_t3] = bs(v_q3);
        }
        if (v_r3 === v_q3 + 1 && v_s3 === v_r3 + 1) {
          v_o3[v_t3] = v_s3 >= 5 ? "SMALL" : "BIG";
        }
        if (v_r3 === v_q3 - 1 && v_s3 === v_r3 - 1) {
          v_o3[v_t3] = v_s3 <= 4 ? "BIG" : "SMALL";
        }
        const v_x3 = colorOf(v_q3);
        const v_y3 = colorOf(v_r3);
        const v_z3 = colorOf(v_s3);
        if (v_x3 === "GREEN" && v_y3 === "GREEN") {
          v_o3[v_t3] = "BIG";
        }
        if (v_x3 === "RED" && v_y3 === "RED" && v_z3 === "RED") {
          v_o3[v_t3] = "SMALL";
        }
        if (v_q3 < 5 && v_r3 < 5 && v_s3 >= 5) {
          v_o3[v_t3] = "BIG";
        }
        if (v_q3 >= 5 && v_r3 >= 5 && v_s3 < 5) {
          v_o3[v_t3] = "SMALL";
        }
        const v_a4 = {
          "0:0:0": "SMALL",
          "0:0:1": "BIG",
          "0:1:1": "SMALL",
          "1:1:0": "BIG",
          "0:0:5": "GREEN",
          "5:5:0": "GREEN",
          "5:0:5": "BIG",
          "9:9:9": "BIG",
          "9:8:7": "SMALL",
          "7:8:9": "BIG",
          "0:5:0": "GREEN",
          "5:0:0": "BIG",
          "0:0:9": "SMALL",
          "1:2:3": "BIG",
          "3:2:1": "SMALL",
          "4:5:6": "BIG",
          "6:5:4": "SMALL",
          "2:4:6": "BIG",
          "1:3:5": "SMALL",
          "5:3:1": "BIG",
          "6:4:2": "SMALL",
          "9:0:9": "SMALL",
          "0:9:0": "BIG",
          "8:8:8": "BIG",
          "2:2:2": "SMALL",
          "4:4:4": "BIG",
          "6:6:6": "SMALL",
          "3:3:3": "BIG",
          "7:7:7": "SMALL",
          "1:1:1": "SMALL",
          "5:5:5": "GREEN",
          "0:1:2": "BIG",
          "2:1:0": "SMALL",
          "7:5:3": "SMALL",
          "3:5:7": "BIG",
          "8:6:4": "SMALL",
          "4:6:8": "BIG",
          "9:7:5": "SMALL",
          "5:7:9": "BIG",
          "1:4:7": "BIG",
          "7:4:1": "SMALL",
          "2:5:8": "BIG",
          "8:5:2": "SMALL",
          "0:3:6": "SMALL",
          "6:3:0": "BIG",
          "1:5:9": "BIG",
          "9:5:1": "SMALL",
          "0:4:8": "BIG",
          "8:4:0": "SMALL",
        };
        if (v_a4[v_t3]) {
          v_o3[v_t3] = v_a4[v_t3];
        }
      }
    }
  }
  return v_o3;
}
const PRED3 = build3Map();
function detectPattern(v_b4) {
  const v_c4 = v_b4.map((v_d4) => +v_d4.number);
  if (v_c4.length < 3) {
    return null;
  }
  const v_e4 = v_c4.slice(0, 5).map((v_f4) => bs(v_f4));
  if (v_e4[0] === v_e4[1] && v_e4[1] === v_e4[2]) {
    return {
      type: "REVERSAL",
      value: v_e4[0] === "BIG" ? "SMALL" : "BIG",
    };
  }
  let v_g4 = 0;
  for (let v_h4 = 0; v_h4 < Math.min(6, v_e4.length - 1); v_h4++) {
    if (v_e4[v_h4] !== v_e4[v_h4 + 1]) {
      v_g4++;
    } else {
      break;
    }
  }
  if (v_g4 >= 4) {
    return {
      type: "ZIGZAG",
      value: v_e4[0] === "BIG" ? "SMALL" : "BIG",
    };
  }
  const v_i4 = v_c4.slice(0, 4).map((v_j4) => colorOf(v_j4));
  if (v_i4[0] === v_i4[1] && v_i4[1] === v_i4[2] && v_i4[0] !== "GREEN") {
    return {
      type: "COLOR_BREAK",
      value: v_i4[0] === "RED" ? "BIG" : "SMALL",
    };
  }
  if (v_c4[0] === 0) {
    return {
      type: "ZERO",
      value: "BIG",
    };
  }
  if (v_c4[0] === 5) {
    return {
      type: "FIVE",
      value: "GREEN",
    };
  }
  if (v_c4[1] === 0 && v_c4[2] === 0) {
    return {
      type: "DOUBLE_ZERO",
      value: "SMALL",
    };
  }
  if (v_c4[0] >= 8 && v_c4[1] <= 2 && v_c4[2] >= 8) {
    return {
      type: "SWING",
      value: "SMALL",
    };
  }
  if (v_c4[0] <= 2 && v_c4[1] >= 8 && v_c4[2] <= 2) {
    return {
      type: "SWING",
      value: "BIG",
    };
  }
  if (v_c4[0] > v_c4[1] && v_c4[1] > v_c4[2] && v_c4[2] > v_c4[3]) {
    return {
      type: "DOWN_TREND",
      value: "BIG",
    };
  }
  if (v_c4[0] < v_c4[1] && v_c4[1] < v_c4[2] && v_c4[2] < v_c4[3]) {
    return {
      type: "UP_TREND",
      value: "SMALL",
    };
  }
  return null;
}
function recoveryLogic(v_k4, v_l4) {
  const v_m4 = String(v_k4);
  const v_n4 = +v_m4[v_m4.length - 3] || 0;
  const v_o4 = +v_m4[v_m4.length - 2] || 0;
  const v_p4 = +v_m4[v_m4.length - 1] || 0;
  const v_q4 = v_n4 + v_o4 + v_p4;
  const v_r4 = +v_l4[0]?.number || 0;
  const v_s4 = +v_l4[1]?.number || 0;
  const v_t4 = v_r4 + v_s4;
  if (v_t4 === 0) {
    return null;
  }
  const v_u4 = (v_q4 * v_t4) % 100;
  const v_v4 = v_u4 % 10;
  if (v_v4 === 0) {
    return "SMALL";
  }
  if (v_v4 === 5) {
    return "BIG";
  }
  if (v_v4 < 5) {
    return "SMALL";
  } else {
    return "BIG";
  }
}
function predictNext(v_w4, v_x4) {
  if (v_w4.length < 3) {
    return null;
  }
  const v_y4 = +v_w4[0].number;
  const v_z4 = +v_w4[1].number;
  const v_a5 = +v_w4[2].number;
  if (STATE.recovery) {
    const v_b5 = detectPattern(v_w4);
    const v_c5 = recoveryLogic(v_x4, v_w4);
    if (v_b5 && v_c5) {
      if (v_b5.value === v_c5) {
        const v_d5 = {
          type: "RECOVERY_CONFIRMED",
          value: v_c5,
        };
        return v_d5;
      } else {
        return null;
      }
    }
    if (v_c5) {
      return {
        type: "RECOVERY_MATH",
        value: v_c5,
      };
    }
    if (v_b5) {
      return {
        type: v_b5.type,
        value: v_b5.value,
      };
    }
    return null;
  }
  const v_e5 = v_y4 + ":" + v_z4 + ":" + v_a5;
  const v_f5 = PRED3[v_e5];
  const v_g5 = detectPattern(v_w4);
  if (v_f5 && v_g5) {
    if (v_f5 === v_g5.value) {
      const v_h5 = {
        type: "CONFIRMED_3NUM",
        value: v_f5,
      };
      return v_h5;
    }
    const v_i5 = {
      type: v_g5.type,
      value: v_g5.value,
    };
    return v_i5;
  }
  if (v_f5) {
    return {
      type: "3NUM_LOGIC",
      value: v_f5,
    };
  }
  if (v_g5) {
    return {
      type: v_g5.type,
      value: v_g5.value,
    };
  }
  return {
    type: "TREND",
    value: bs(v_y4),
  };
}
const TYPE_LABELS = {
  CONFIRMED_3NUM: "✦ CONFIRMED SIGNAL",
  "3NUM_LOGIC": "3-NUM PATTERN",
  RECOVERY_CONFIRMED: "✦ RECOVERY CONFIRMED",
  RECOVERY_MATH: "RECOVERY MATH",
  REVERSAL: "REVERSAL PATTERN",
  ZIGZAG: "ZIGZAG PATTERN",
  COLOR_BREAK: "COLOR BREAK",
  ZERO: "ZERO SIGNAL",
  FIVE: "FIVE SIGNAL",
  DOUBLE_ZERO: "DOUBLE ZERO",
  SWING: "SWING PATTERN",
  DOWN_TREND: "DOWN TREND",
  UP_TREND: "UP TREND",
  TREND: "TREND LOGIC",
  PATTERN: "RECOVERY PATTERN",
};
const API =
  "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";
let _lastTop = null;
async function fetchMarket() {
  try {
    const v_j5 = await fetch(API + "?t=" + Date.now(), {
      cache: "no-store",
    });
    const v_k5 = await v_j5.json();
    return v_k5?.data?.list || [];
  } catch (v_l5) {
    return null;
  }
}
function renderMarket(v_m5) {
  const v_n5 = $("mktList");
  if (!v_m5 || !v_m5.length) {
    return;
  }
  const v_o5 = v_m5[0].issueNumber;
  if (v_o5 === _lastTop) {
    return;
  }
  const v_p5 = _lastTop === null;
  _lastTop = v_o5;
  v_n5.innerHTML = v_m5
    .map((v_q5, v_r5) => {
      const v_s5 = +v_q5.number;
      const v_t5 = bs(v_s5);
      const v_u5 = colorOf(v_s5);
      const v_v5 = !v_p5 && v_r5 === 0 ? " new" : "";
      const v_w5 =
        v_u5 === "GREEN"
          ? "var(--green)"
          : v_u5 === "RED"
            ? "var(--red)"
            : "var(--gold)";
      const v_x5 =
        v_u5 === "GREEN"
          ? "var(--green)"
          : v_u5 === "RED"
            ? "var(--red)"
            : "var(--gold)";
      return (
        '<div class="mkt-row' +
        v_v5 +
        '" style="border-left-color:' +
        v_x5 +
        '40">\n      <span class="p">' +
        v_q5.issueNumber +
        '</span>\n      <span class="n" style="color:' +
        v_w5 +
        '">' +
        v_s5 +
        '</span>\n      <span class="bs ' +
        v_t5 +
        '">' +
        v_t5 +
        '</span>\n      <span class="cl ' +
        v_u5 +
        '"></span>\n    </div>'
      );
    })
    .join("");
}
function renderHistory() {
  const v_y5 = $("histList");
  if (!STATE.signals.length) {
    v_y5.innerHTML =
      '<div class="empty"><i class="ri-history-line"></i>No predictions yet</div>';
    return;
  }
  v_y5.innerHTML = STATE.signals
    .slice()
    .reverse()
    .map((v_z5) => {
      const v_a6 = STATE.results[v_z5.period];
      const v_b6 = v_a6 ? v_a6.number + " • " + bs(+v_a6.number) : "—";
      const v_c6 = v_z5.status === "SKIP";
      return (
        '<div class="hist-row' +
        (v_c6 ? " skip-row" : "") +
        '">\n      <div><div class="lbl">PERIOD</div><div class="v">' +
        v_z5.period +
        '</div></div>\n      <div><div class="lbl">SIGNAL</div><div class="v" style="color:' +
        (v_c6 ? "var(--muted)" : "var(--gold)") +
        '">' +
        v_z5.prediction +
        '</div></div>\n      <div><div class="lbl">RESULT</div><div class="v">' +
        v_b6 +
        '</div></div>\n      <div class="res ' +
        v_z5.status +
        '">' +
        v_z5.status +
        "</div>\n    </div>"
      );
    })
    .join("");
}
function spawnConfetti() {
  const v_d6 = [
    "#FFD400",
    "#FF2D5E",
    "#00FF85",
    "#00EEFF",
    "#A855F7",
    "#FF9500",
  ];
  const v_e6 = $("dlgBack");
  for (let v_f6 = 0; v_f6 < 36; v_f6++) {
    const v_g6 = document.createElement("div");
    v_g6.className = "cbit";
    v_g6.style.cssText =
      "left:" +
      (5 + Math.random() * 90) +
      "%;top:5%;background:" +
      v_d6[Math.floor(Math.random() * v_d6.length)] +
      ";animation-delay:" +
      Math.random() * 0.5 +
      "s;animation-duration:" +
      (0.8 + Math.random() * 0.9) +
      "s;";
    v_e6.appendChild(v_g6);
    setTimeout(() => v_g6.remove(), 1800);
  }
}
function showResultDialog(v_h6, v_i6) {
  const v_j6 = v_h6.status === "WIN";
  const v_k6 = $("dlg");
  v_k6.classList.remove("win", "loss");
  v_k6.classList.add(v_j6 ? "win" : "loss");
  $("dlgIcon").className = v_j6 ? "ri-trophy-fill" : "ri-close-circle-fill";
  $("dlgTitle").textContent = v_j6 ? "WIN 🎉" : "LOSS";
  $("dlgSub").textContent = v_j6
    ? "Prediction successful!"
    : "Market moved differently";
  $("dlgPeriod").textContent = v_h6.period;
  $("dlgPred").textContent = v_h6.prediction;
  $("dlgResult").textContent =
    v_i6.number + " • " + bs(+v_i6.number) + " • " + colorOf(+v_i6.number);
  $("dlgBack").classList.add("show");
  if (v_j6) {
    spawnConfetti();
  }
}
function closeDlg() {
  $("dlgBack").classList.remove("show");
}
function bumpStat(v_l6) {
  const v_m6 = $(v_l6);
  if (!v_m6) {
    return;
  }
  v_m6.classList.remove("bump");
  v_m6.offsetWidth;
  v_m6.classList.add("bump");
}
function evalSignal(v_n6, v_o6) {
  const v_p6 = +v_o6.number;
  const v_q6 = v_n6.prediction;
  if (v_q6 === "SKIP") {
    return;
  }
  let v_r6 = false;
  if (v_q6 === "BIG" || v_q6 === "SMALL") {
    v_r6 = bs(v_p6) === v_q6;
  } else if (v_q6 === "RED" || v_q6 === "GREEN") {
    v_r6 = colorOf(v_p6) === v_q6;
  }
  v_n6.status = v_r6 ? "WIN" : "LOSS";
  if (v_r6) {
    STATE.win++;
    STATE.streak++;
    STATE.recovery = false;
  } else {
    STATE.loss++;
    STATE.streak = 0;
    STATE.recovery = true;
  }
  updateStats();
  showResultDialog(v_n6, v_o6);
  renderHistory();
}
function updateStats() {
  $("stTotal").textContent = STATE.win + STATE.loss;
  bumpStat("stTotal");
  $("stWin").textContent = STATE.win;
  bumpStat("stWin");
  $("stLoss").textContent = STATE.loss;
  bumpStat("stLoss");
  $("stStreak").textContent = STATE.streak;
  bumpStat("stStreak");
  const v_s6 = STATE.win + STATE.loss;
  const v_t6 = v_s6 > 0 ? Math.round((STATE.win / v_s6) * 100) : 0;
  $("accPct").textContent = v_t6 + "%";
  $("accFill").style.width = v_t6 + "%";
}
function nextPeriodOf(v_u6) {
  const v_v6 = v_u6.slice(0, -5);
  const v_w6 = parseInt(v_u6.slice(-5), 10) + 1;
  return v_v6 + String(v_w6).padStart(5, "0");
}
let _engineRunning = false;
const _evalledPeriods = new Set();
async function engineTick() {
  if (_engineRunning) {
    return;
  }
  _engineRunning = true;
  try {
    const v_x6 = await fetchMarket();
    if (!v_x6) {
      _engineRunning = false;
      return;
    }
    renderMarket(v_x6);
    STATE.signals.forEach((v_y6) => {
      if (v_y6.status !== "PENDING" || _evalledPeriods.has(v_y6.period)) {
        return;
      }
      const v_z6 = v_x6.find((v_a7) => v_a7.issueNumber === v_y6.period);
      if (v_z6) {
        _evalledPeriods.add(v_y6.period);
        STATE.results[v_y6.period] = v_z6;
        evalSignal(v_y6, v_z6);
      }
    });
    if (_signalAllowed) {
      const v_b7 = v_x6[0];
      if (v_b7) {
        const v_c7 = nextPeriodOf(v_b7.issueNumber);
        const v_d7 = STATE.signals.some((v_e7) => v_e7.period === v_c7);
        if (!v_d7 && STATE.lastPredPeriod !== v_c7) {
          STATE.lastPredPeriod = v_c7;
          const v_f7 = predictNext(v_x6, v_c7);
          if (v_f7 === null) {
            const v_g7 = {
              period: v_c7,
              prediction: "SKIP",
              type: "RECOVERY_SKIP",
              status: "SKIP",
            };
            STATE.signals.push(v_g7);
            $("predVal").className = "pred-val WAIT";
            $("predVal").textContent = "WAIT";
            $("predMeta").textContent = "Analyzing " + v_c7;
            $("predTypeBadge").textContent = "⏸ RECOVERY ANALYSIS — WAITING";
          } else {
            const v_h7 = {
              period: v_c7,
              prediction: v_f7.value,
              type: v_f7.type,
              status: "PENDING",
            };
            STATE.signals.push(v_h7);
            $("predVal").className = "pred-val " + v_f7.value;
            $("predVal").textContent = v_f7.value;
            $("predMeta").textContent = v_c7;
            $("predTypeBadge").textContent =
              TYPE_LABELS[v_f7.type] || v_f7.type;
            const v_i7 = $("predVal");
            v_i7.style.transform = "scale(1.18)";
            setTimeout(() => (v_i7.style.transform = ""), 350);
          }
        }
      }
    }
  } catch (v_j7) {}
  _engineRunning = false;
}
function startEngine() {
  updatePeriod();
  engineTick();
  setInterval(engineTick, 8000);
  setInterval(() => {
    const v_k7 = new Date().getSeconds();
    if (v_k7 <= 3) {
      engineTick();
    }
  }, 1000);
}
(function initImgAnim() {
  document
    .querySelectorAll(".hero-core img, .ph-logo img, .admin-logo img")
    .forEach((v_l7) => {
      v_l7.style.transition = "transform .4s ease,filter .4s ease";
      setInterval(() => {
        v_l7.style.transform = "scale(1.07)";
        v_l7.style.filter =
          "brightness(1.2) drop-shadow(0 0 12px rgba(255,212,0,.7))";
        setTimeout(() => {
          v_l7.style.transform = "scale(1)";
          v_l7.style.filter =
            "brightness(1) drop-shadow(0 0 4px rgba(255,212,0,.3))";
        }, 700);
      }, 2800);
    });
  const v_m7 = document.querySelector(".pred-card");
  if (v_m7) {
    const v_n7 = document.createElement("div");
    v_n7.style.cssText =
      "position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,212,0,.06),transparent);pointer-events:none;z-index:3;border-radius:inherit";
    v_m7.appendChild(v_n7);
    setInterval(() => {
      v_n7.style.transition = "none";
      v_n7.style.left = "-60%";
      requestAnimationFrame(() => {
        v_n7.style.transition = "left 1.2s linear";
        v_n7.style.left = "110%";
      });
    }, 3500);
  }
  document
    .querySelectorAll(".live-dot,.status-dot,.schedDot")
    .forEach((v_o7) => {
      v_o7.style.animation = "blink 1.1s ease-in-out infinite";
    });
})();
