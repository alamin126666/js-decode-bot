const $ = _0x2ef0ed => document.getElementById(_0x2ef0ed);
function go(_0x5d0ace) {
  document.querySelectorAll(".page").forEach(_0x1e3d42 => _0x1e3d42.classList.remove("active"));
  $(_0x5d0ace).classList.add("active");
  if (_0x5d0ace === "login") {
    setTimeout(previewSavedKey, 300);
  }
  if (_0x5d0ace === "signal") {
    setTimeout(() => {
      const _0x24e02c = getPlayStatus();
      if (!_0x24e02c.active) {
        _signalAllowed = false;
        $("signalOffBanner").classList.add("show");
        $("predVal").className = "pred-val WAIT";
        $("predVal").textContent = "OFF";
        $("predMeta").textContent = "Signal closed";
        $("predTypeBadge").textContent = "OUTSIDE PLAY WINDOW";
        showPwDlg(true, _0x24e02c);
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
  lastPredPeriod: null
};
const BOOT_MSGS = ["BOOTING SYSTEM...", "CONNECTING API...", "CALIBRATING AI...", "LOADING SIGNALS...", "READY"];
let loadP = 0;
const loadIv = setInterval(() => {
  loadP += 100 / 60;
  if (loadP >= 100) {
    loadP = 100;
    clearInterval(loadIv);
    setTimeout(() => go("landing"), 400);
  }
  $("loadFill").style.width = loadP + "%";
  const _0x3e5c2a = Math.min(4, Math.floor(loadP / 20));
  $("loadStatus").textContent = BOOT_MSGS[_0x3e5c2a];
  $("loadTxt").textContent = "INITIALIZING • " + Math.floor(loadP) + "%";
}, 100);
function updateSlider() {
  const _0x120a20 = document.querySelector(".bnav button.active");
  const _0x115514 = $("bnav");
  if (!_0x120a20 || !_0x115514) {
    return;
  }
  const _0x1f6618 = _0x115514.getBoundingClientRect();
  const _0x425044 = _0x120a20.getBoundingClientRect();
  const _0x3204f2 = $("bnavSlider");
  _0x3204f2.style.left = _0x425044.left - _0x1f6618.left + "px";
  _0x3204f2.style.width = _0x425044.width + "px";
}
setTimeout(updateSlider, 80);
const infos = [{
  i: "ri-flashlight-fill",
  t: "Realtime AI",
  d: "Live market signal engine"
}, {
  i: "ri-crosshair-2-fill",
  t: "3-Num Logic",
  d: "Triple pattern prediction"
}, {
  i: "ri-timer-flash-fill",
  t: "1 Min Mode",
  d: "WinGo 1 Minute period"
}, {
  i: "ri-shield-check-fill",
  t: "Safe Logic",
  d: "Smart recovery system"
}, {
  i: "ri-line-chart-fill",
  t: "Smart Trend",
  d: "Detects zigzag, repeat, double"
}, {
  i: "ri-function-fill",
  t: "300+ Combos",
  d: "Deep pattern matrix"
}, {
  i: "ri-fire-fill",
  t: "Hot Streaks",
  d: "Win streak tracking"
}, {
  i: "ri-bar-chart-box-fill",
  t: "Live Stats",
  d: "Win/Loss counters"
}, {
  i: "ri-history-line",
  t: "Full History",
  d: "Track every prediction"
}, {
  i: "ri-sparkling-2-fill",
  t: "Cyber UI",
  d: "Premium animated interface"
}, {
  i: "ri-lock-password-fill",
  t: "Key System",
  d: "Supabase secured access"
}, {
  i: "ri-telegram-fill",
  t: "24/7 Support",
  d: "Telegram help channel"
}];
const ig = $("infoGrid");
infos.forEach((_0x3cc912, _0x32ae82) => {
  const _0x43f0a3 = document.createElement("div");
  _0x43f0a3.className = "info-card";
  _0x43f0a3.style.animationDelay = _0x32ae82 * 0.06 + "s";
  _0x43f0a3.innerHTML = "<div class=\"ic\"><i class=\"" + _0x3cc912.i + "\"></i></div><h4>" + _0x3cc912.t + "</h4><p>" + _0x3cc912.d + "</p>";
  ig.appendChild(_0x43f0a3);
});
const SB_URL = "https://jmqqfsymvpktynabvgmu.supabase.co";
const SB_KEY = "sb_publishable_dCgDbN7j4CPGy3GfXVL1Eg_xLC1x3Et";
let _sb = null;
try {
  _sb = window.supabase.createClient(SB_URL, SB_KEY);
} catch (_0x2d356a) {}
const DEVICE_ID = (() => {
  let _0x95103a = localStorage.getItem("baw_did");
  if (!_0x95103a) {
    _0x95103a = "D" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
    localStorage.setItem("baw_did", _0x95103a);
  }
  return _0x95103a;
})();
let _activeKey = null;
function fmtMin(_0x2f056f) {
  if (_0x2f056f < 60) {
    return _0x2f056f + "m";
  }
  if (_0x2f056f < 1440) {
    return (_0x2f056f / 60).toFixed(1) + "h";
  }
  return Math.round(_0x2f056f / 1440) + "d";
}
async function doLogin() {
  const _0x23b9d5 = $("passInput").value.trim().toUpperCase();
  if (!_0x23b9d5) {
    $("loginErr").textContent = "Key দিন";
    return;
  }
  const _0xe005b = $("loginBtn");
  _0xe005b.disabled = true;
  _0xe005b.innerHTML = "<i class=\"ri-loader-4-line\"></i> CHECKING...";
  $("loginErr").textContent = "";
  if (!_sb) {
    $("loginErr").textContent = "⚠ Config error";
    _0xe005b.disabled = false;
    _0xe005b.innerHTML = "<i class=\"ri-key-2-fill\"></i> VERIFY & LOGIN";
    return;
  }
  const {
    data: _0x134799,
    error: _0x5d85c0
  } = await _sb.from("baw_keys").select("*").eq("key_code", _0x23b9d5).single();
  _0xe005b.disabled = false;
  _0xe005b.innerHTML = "<i class=\"ri-key-2-fill\"></i> VERIFY & LOGIN";
  if (_0x5d85c0 || !_0x134799) {
    $("loginErr").textContent = "✗ Invalid key!";
    $("passInput").style.borderColor = "var(--red)";
    setTimeout(() => $("passInput").style.borderColor = "", 900);
    return;
  }
  if (!_0x134799.is_active) {
    $("loginErr").textContent = "✗ Key disable করা হয়েছে।";
    return;
  }
  const _0x11484c = new Date();
  let _0x2eefd4;
  if (!_0x134799.first_used_at) {
    _0x2eefd4 = new Date(_0x11484c.getTime() + _0x134799.duration_minutes * 60000);
    await _sb.from("baw_keys").update({
      first_used_at: _0x11484c.toISOString(),
      expires_at: _0x2eefd4.toISOString()
    }).eq("id", _0x134799.id);
  } else {
    _0x2eefd4 = new Date(_0x134799.expires_at);
  }
  if (_0x2eefd4 < _0x11484c) {
    $("loginErr").textContent = "✗ Key expired! নতুন key নিন।";
    return;
  }
  const _0x408a75 = Array.isArray(_0x134799.devices_used) ? _0x134799.devices_used : [];
  if (!_0x408a75.includes(DEVICE_ID)) {
    if (_0x408a75.length >= _0x134799.device_limit) {
      $("loginErr").textContent = "✗ Device limit পূর্ণ! Max " + _0x134799.device_limit + "।";
      return;
    }
    const _0x245fdd = {
      devices_used: [..._0x408a75, DEVICE_ID]
    };
    await _sb.from("baw_keys").update(_0x245fdd).eq("id", _0x134799.id);
  }
  _activeKey = _0x134799;
  localStorage.setItem("baw_saved_key", _0x23b9d5);
  $("keyInfoBar").style.display = "none";
  go("signal");
  startEngine();
  setTimeout(updateSlider, 120);
  startKeyExpireWatcher(_0x2eefd4);
  initPlayWindow();
}
let _keyExpWatcher = null;
function startKeyExpireWatcher(_0x43c86a) {
  if (_keyExpWatcher) {
    clearInterval(_keyExpWatcher);
  }
  _keyExpWatcher = setInterval(() => {
    if (new Date() > _0x43c86a) {
      clearInterval(_keyExpWatcher);
      go("login");
      $("loginErr").textContent = "✗ Key expired!";
      $("passInput").value = "";
      $("keyInfoBar").style.display = "none";
    }
  }, 15000);
}
async function previewSavedKey() {
  const _0x37fc28 = localStorage.getItem("baw_saved_key");
  if (_0x37fc28 && $("passInput")) {
    $("passInput").value = _0x37fc28;
    await fetchKeyPreview(_0x37fc28);
  }
}
async function fetchKeyPreview(_0x58486e) {
  if (!_sb || !_0x58486e) {
    return;
  }
  const {
    data: _0x4e1ecd
  } = await _sb.from("baw_keys").select("*").eq("key_code", _0x58486e.toUpperCase()).single();
  if (!_0x4e1ecd) {
    return;
  }
  const _0x1388f2 = new Date();
  const _0x430162 = !_0x4e1ecd.first_used_at;
  const _0x231775 = new Date(_0x4e1ecd.expires_at);
  const _0x90dc19 = !_0x430162 && _0x231775 < _0x1388f2;
  $("kInfoLabel").textContent = _0x4e1ecd.label || "—";
  $("kInfoDur").textContent = fmtMin(_0x4e1ecd.duration_minutes);
  if (_0x430162) {
    $("kInfoStatus").textContent = "NOT STARTED YET";
    $("kInfoStatus").style.color = "var(--gold)";
  } else if (_0x90dc19) {
    $("kInfoStatus").textContent = "EXPIRED";
    $("kInfoStatus").style.color = "var(--red)";
  } else {
    const _0x1850ba = Math.max(0, Math.round((_0x231775 - _0x1388f2) / 60000));
    $("kInfoStatus").textContent = fmtMin(_0x1850ba) + " LEFT";
    $("kInfoStatus").style.color = "var(--green)";
  }
  $("kInfoDev").textContent = (Array.isArray(_0x4e1ecd.devices_used) ? _0x4e1ecd.devices_used.length : 0) + "/" + _0x4e1ecd.device_limit;
  $("keyInfoBar").style.display = "block";
}
$("passInput")?.addEventListener("keydown", _0x51fd03 => {
  if (_0x51fd03.key === "Enter") {
    doLogin();
  }
});
$("passInput")?.addEventListener("input", _0x4e5d92 => {
  _0x4e5d92.target.value = _0x4e5d92.target.value.toUpperCase();
  $("keyInfoBar").style.display = "none";
  $("loginErr").textContent = "";
});
const PLAY_WINDOWS = [{
  label: "08:00 AM",
  startH: 8,
  startM: 0,
  durationMin: 40
}, {
  label: "11:20 AM",
  startH: 11,
  startM: 20,
  durationMin: 20
}, {
  label: "03:15 PM",
  startH: 15,
  startM: 15,
  durationMin: 35
}, {
  label: "07:30 PM",
  startH: 19,
  startM: 30,
  durationMin: 20
}, {
  label: "09:40 PM",
  startH: 21,
  startM: 40,
  durationMin: 10
}];
function getBDT() {
  const _0x1d4419 = new Date();
  return new Date(_0x1d4419.getTime() + _0x1d4419.getTimezoneOffset() * 60000 + 21600000);
}
function getPlayStatus() {
  const _0x37707a = getBDT();
  const _0x2e1127 = _0x37707a.getHours() * 60 + _0x37707a.getMinutes();
  const _0x68a792 = _0x37707a.getSeconds();
  const _0x434d5f = new Date(_0x37707a);
  _0x434d5f.setHours(0, 0, 0, 0);
  for (let _0x5b0582 = 0; _0x5b0582 < PLAY_WINDOWS.length; _0x5b0582++) {
    const _0x30385f = PLAY_WINDOWS[_0x5b0582];
    const _0x4734ef = _0x30385f.startH * 60 + _0x30385f.startM;
    const _0x386644 = _0x4734ef + _0x30385f.durationMin;
    if (_0x2e1127 >= _0x4734ef && _0x2e1127 < _0x386644) {
      const _0x5f48ea = _0x2e1127 - _0x4734ef + _0x68a792 / 60;
      const _0x2cc049 = _0x30385f.durationMin - _0x5f48ea;
      const _0x15fc0a = new Date(_0x434d5f.getTime() + _0x386644 * 60000);
      const _0x595f2c = PLAY_WINDOWS[(_0x5b0582 + 1) % PLAY_WINDOWS.length];
      let _0x4c4d2e = _0x434d5f.getTime() + (_0x595f2c.startH * 60 + _0x595f2c.startM) * 60000;
      if (_0x5b0582 === PLAY_WINDOWS.length - 1) {
        _0x4c4d2e += 86400000;
      }
      return {
        active: true,
        window: _0x30385f,
        minutesLeft: _0x2cc049,
        windowEnd: _0x15fc0a,
        nextWindow: _0x595f2c,
        msToNext: _0x4c4d2e - Date.now()
      };
    }
  }
  let _0xd71421 = null;
  let _0x34229b = Infinity;
  for (let _0x2eec6f = 0; _0x2eec6f < PLAY_WINDOWS.length; _0x2eec6f++) {
    const _0x362a33 = PLAY_WINDOWS[_0x2eec6f];
    const _0x56b5b7 = _0x362a33.startH * 60 + _0x362a33.startM;
    let _0x2df8bc = _0x434d5f.getTime() + _0x56b5b7 * 60000;
    if (_0x2e1127 >= _0x56b5b7) {
      _0x2df8bc += 86400000;
    }
    const _0x528679 = _0x2df8bc - Date.now();
    if (_0x528679 < _0x34229b) {
      _0x34229b = _0x528679;
      _0xd71421 = _0x362a33;
    }
  }
  const _0x678d12 = {
    active: false,
    window: null,
    minutesLeft: 0,
    windowEnd: null,
    nextWindow: _0xd71421,
    msToNext: _0x34229b
  };
  return _0x678d12;
}
function fmtHHMMSS(_0x19f048) {
  if (_0x19f048 <= 0) {
    return "00:00:00";
  }
  const _0x2a0bcb = Math.floor(_0x19f048 / 1000);
  const _0x348bfd = Math.floor(_0x2a0bcb / 3600);
  const _0x3ec030 = Math.floor(_0x2a0bcb % 3600 / 60);
  const _0x36dbf2 = _0x2a0bcb % 60;
  return String(_0x348bfd).padStart(2, "0") + ":" + String(_0x3ec030).padStart(2, "0") + ":" + String(_0x36dbf2).padStart(2, "0");
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
  const _0xd31a15 = getPlayStatus();
  if (_0xd31a15.active) {
    _signalAllowed = true;
    _sessionEndNotified = false;
    $("signalOffBanner").classList.remove("show");
    $("sobNextTxt").textContent = "";
    if ($("schedDot")) {
      $("schedDot").style.display = "block";
    }
    if (_0xd31a15.minutesLeft > 0) {
      clearTimeout(window._sessionEndTimer);
      window._sessionEndTimer = setTimeout(() => {
        _signalAllowed = false;
        _sessionEndNotified = true;
        showPwDlg(false, getPlayStatus());
        $("signalOffBanner").classList.add("show");
        $("predVal").className = "pred-val WAIT";
        $("predVal").textContent = "OFF";
        $("predMeta").textContent = "Signal closed";
        $("predTypeBadge").textContent = "OUTSIDE PLAY WINDOW";
      }, Math.max(0, (_0xd31a15.minutesLeft - 0.05) * 60000));
    }
  } else {
    _signalAllowed = false;
    $("signalOffBanner").classList.add("show");
    if ($("schedDot")) {
      $("schedDot").style.display = "none";
    }
    const _0xecb96d = _0xd31a15.nextWindow ? "Next: " + _0xd31a15.nextWindow.label + " (" + _0xd31a15.nextWindow.durationMin + "min)" : "No more sessions today";
    $("sobNextTxt").textContent = _0xecb96d;
    if (!_sessionEndNotified && document.getElementById("signal").classList.contains("active")) {
      _sessionEndNotified = true;
      showPwDlg(false, _0xd31a15);
    }
  }
}
function buildScheduleHTML(_0x150b7c) {
  const _0x4c7244 = getBDT();
  const _0x5afef9 = _0x4c7244.getHours() * 60 + _0x4c7244.getMinutes();
  return PLAY_WINDOWS.map(_0xb80d25 => {
    const _0x5177c8 = _0xb80d25.startH * 60 + _0xb80d25.startM;
    const _0x3d06bc = _0x5177c8 + _0xb80d25.durationMin;
    let _0x4b7a33 = "done";
    let _0x19d107 = "DONE";
    if (_0x5afef9 < _0x5177c8) {
      _0x4b7a33 = "upcoming";
      _0x19d107 = "UPCOMING";
    } else if (_0x5afef9 >= _0x5177c8 && _0x5afef9 < _0x3d06bc) {
      _0x4b7a33 = "active";
      _0x19d107 = "ACTIVE";
    }
    const _0x142723 = _0x150b7c.nextWindow && _0x150b7c.nextWindow.label === _0xb80d25.label && !_0x150b7c.active;
    return "<div class=\"pw-row" + (_0x142723 ? " next-session" : "") + "\">\n      <div><div class=\"pr-time\">" + _0xb80d25.label + "</div><div class=\"pr-dur\">" + _0xb80d25.durationMin + " minutes</div></div>\n      <span class=\"pr-badge " + _0x4b7a33 + "\">" + _0x19d107 + "</span>\n    </div>";
  }).join("");
}
let _pwCountdownIv = null;
function showPwDlg(_0x1024d0, _0xd9b8b3) {
  $("pwSchedule").innerHTML = buildScheduleHTML(_0xd9b8b3);
  $("pwTitle").textContent = _0x1024d0 || !_0xd9b8b3.active ? "SIGNAL CLOSED" : "SESSION ENDED";
  $("pwSub").innerHTML = _0x1024d0 || !_0xd9b8b3.active ? "এই সময়ে signal পাওয়া যাবে না।<br>Schedule দেখুন:" : "Play window শেষ। পরবর্তী session এর জন্য অপেক্ষা করুন।";
  $("pwBack").classList.add("show");
  if (_pwCountdownIv) {
    clearInterval(_pwCountdownIv);
  }
  _pwCountdownIv = setInterval(() => {
    const _0xdd28df = getPlayStatus();
    if (_0xdd28df.active) {
      clearInterval(_pwCountdownIv);
      $("pwBack").classList.remove("show");
      initPlayWindow();
      return;
    }
    $("pwCountdownVal").textContent = fmtHHMMSS(_0xdd28df.msToNext);
    $("pwSchedule").innerHTML = buildScheduleHTML(_0xdd28df);
  }, 1000);
}
function showScheduleDialog() {
  const _0x1ff460 = getPlayStatus();
  $("pwTitle").textContent = "PLAY SCHEDULE";
  $("pwSub").innerHTML = "Bangladesh Time (BDT) signal sessions:";
  $("pwSchedule").innerHTML = buildScheduleHTML(_0x1ff460);
  $("pwBack").classList.add("show");
  if (_pwCountdownIv) {
    clearInterval(_pwCountdownIv);
  }
  const _0x4d653a = _0x1ff460.active ? "Session ends in:" : "Next session in:";
  const _0x27812e = _0x1ff460.active ? _0x1ff460.windowEnd - Date.now() : _0x1ff460.msToNext;
  $("pwCountdown").innerHTML = _0x4d653a + " <span id=\"pwCountdownVal\">" + fmtHHMMSS(_0x27812e) + "</span>";
  _pwCountdownIv = setInterval(() => {
    const _0x7d0611 = getPlayStatus();
    $("pwCountdownVal").textContent = fmtHHMMSS(_0x7d0611.active ? _0x7d0611.windowEnd - Date.now() : _0x7d0611.msToNext);
    $("pwSchedule").innerHTML = buildScheduleHTML(_0x7d0611);
  }, 1000);
}
function closePwDlg() {
  $("pwBack").classList.remove("show");
  if (_pwCountdownIv) {
    clearInterval(_pwCountdownIv);
  }
}
function switchView(_0x3f1ff8) {
  $("dashView").style.display = _0x3f1ff8 === "dash" ? "block" : "none";
  $("histView").style.display = _0x3f1ff8 === "hist" ? "block" : "none";
  $("navDash").classList.toggle("active", _0x3f1ff8 === "dash");
  $("navHist").classList.toggle("active", _0x3f1ff8 === "hist");
  updateSlider();
  if (_0x3f1ff8 === "hist") {
    renderHistory();
  }
}
function buildPeriod() {
  const _0x233796 = new Date();
  const _0x3997bc = new Date(_0x233796.getTime() + _0x233796.getTimezoneOffset() * 60000);
  const _0x525ede = _0x3997bc.getFullYear();
  const _0x145db1 = String(_0x3997bc.getMonth() + 1).padStart(2, "0");
  const _0x17d565 = String(_0x3997bc.getDate()).padStart(2, "0");
  const _0x37a6f0 = _0x3997bc.getHours() * 60 + _0x3997bc.getMinutes();
  const _0x28b1ee = _0x3997bc.getSeconds();
  return {
    period: "" + _0x525ede + _0x145db1 + _0x17d565 + "1000" + (10001 + _0x37a6f0),
    remaining: 60 - _0x28b1ee
  };
}
function updatePeriod() {
  const {
    period: _0x3edc7f,
    remaining: _0x927651
  } = buildPeriod();
  $("periodVal").textContent = _0x3edc7f;
  $("timerVal").textContent = "00:" + String(_0x927651).padStart(2, "0");
}
setInterval(updatePeriod, 1000);
function bs(_0x2a425b) {
  if (_0x2a425b >= 5) {
    return "BIG";
  } else {
    return "SMALL";
  }
}
function colorOf(_0x5355dc) {
  if (_0x5355dc === 0 || _0x5355dc === 5) {
    if (_0x5355dc === 0) {
      return "RED";
    } else {
      return "GREEN";
    }
  }
  if (_0x5355dc % 2 === 0) {
    return "RED";
  } else {
    return "GREEN";
  }
}
function build3Map() {
  const _0x29ea88 = {};
  const _0xa4f53f = ["SMALL", "SMALL", "SMALL", "BIG", "SMALL", "GREEN", "BIG", "BIG", "SMALL", "GREEN"];
  for (let _0x1c51bd = 0; _0x1c51bd <= 9; _0x1c51bd++) {
    for (let _0x134b9f = 0; _0x134b9f <= 9; _0x134b9f++) {
      for (let _0x3d299a = 0; _0x3d299a <= 9; _0x3d299a++) {
        const _0x32568b = _0x1c51bd + ":" + _0x134b9f + ":" + _0x3d299a;
        const _0x22e419 = _0x1c51bd + _0x134b9f + _0x3d299a;
        if (_0x22e419 <= 13) {
          _0x29ea88[_0x32568b] = _0x22e419 % 2 === 0 ? "SMALL" : "BIG";
        } else {
          _0x29ea88[_0x32568b] = _0x22e419 % 2 === 0 ? "BIG" : "SMALL";
        }
        const _0x36f1f4 = bs(_0x1c51bd) !== bs(_0x134b9f);
        const _0x19f950 = bs(_0x134b9f) !== bs(_0x3d299a);
        if (_0x36f1f4 && _0x19f950) {
          _0x29ea88[_0x32568b] = bs(_0x1c51bd) === "BIG" ? "SMALL" : "BIG";
        }
        if (_0x1c51bd === _0x134b9f && _0x134b9f === _0x3d299a) {
          _0x29ea88[_0x32568b] = _0x1c51bd <= 4 ? "BIG" : "SMALL";
        }
        if (_0x1c51bd === _0x134b9f && _0x134b9f !== _0x3d299a) {
          _0x29ea88[_0x32568b] = bs(_0x3d299a) === "BIG" ? "SMALL" : "BIG";
        }
        if (_0x134b9f === _0x3d299a && _0x1c51bd !== _0x134b9f) {
          _0x29ea88[_0x32568b] = bs(_0x1c51bd);
        }
        if (_0x134b9f === _0x1c51bd + 1 && _0x3d299a === _0x134b9f + 1) {
          _0x29ea88[_0x32568b] = _0x3d299a >= 5 ? "SMALL" : "BIG";
        }
        if (_0x134b9f === _0x1c51bd - 1 && _0x3d299a === _0x134b9f - 1) {
          _0x29ea88[_0x32568b] = _0x3d299a <= 4 ? "BIG" : "SMALL";
        }
        const _0x39a881 = colorOf(_0x1c51bd);
        const _0x1bd35f = colorOf(_0x134b9f);
        const _0x29eee8 = colorOf(_0x3d299a);
        if (_0x39a881 === "GREEN" && _0x1bd35f === "GREEN") {
          _0x29ea88[_0x32568b] = "BIG";
        }
        if (_0x39a881 === "RED" && _0x1bd35f === "RED" && _0x29eee8 === "RED") {
          _0x29ea88[_0x32568b] = "SMALL";
        }
        if (_0x1c51bd < 5 && _0x134b9f < 5 && _0x3d299a >= 5) {
          _0x29ea88[_0x32568b] = "BIG";
        }
        if (_0x1c51bd >= 5 && _0x134b9f >= 5 && _0x3d299a < 5) {
          _0x29ea88[_0x32568b] = "SMALL";
        }
        const _0x2733ec = {
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
          "8:4:0": "SMALL"
        };
        if (_0x2733ec[_0x32568b]) {
          _0x29ea88[_0x32568b] = _0x2733ec[_0x32568b];
        }
      }
    }
  }
  return _0x29ea88;
}
const PRED3 = build3Map();
function detectPattern(_0x38f73a) {
  const _0x3052a9 = _0x38f73a.map(_0x206421 => +_0x206421.number);
  if (_0x3052a9.length < 3) {
    return null;
  }
  const _0xe2a9bf = _0x3052a9.slice(0, 5).map(_0x3f23e2 => bs(_0x3f23e2));
  if (_0xe2a9bf[0] === _0xe2a9bf[1] && _0xe2a9bf[1] === _0xe2a9bf[2]) {
    return {
      type: "REVERSAL",
      value: _0xe2a9bf[0] === "BIG" ? "SMALL" : "BIG"
    };
  }
  let _0x84fc80 = 0;
  for (let _0x156f60 = 0; _0x156f60 < Math.min(6, _0xe2a9bf.length - 1); _0x156f60++) {
    if (_0xe2a9bf[_0x156f60] !== _0xe2a9bf[_0x156f60 + 1]) {
      _0x84fc80++;
    } else {
      break;
    }
  }
  if (_0x84fc80 >= 4) {
    return {
      type: "ZIGZAG",
      value: _0xe2a9bf[0] === "BIG" ? "SMALL" : "BIG"
    };
  }
  const _0x461ed0 = _0x3052a9.slice(0, 4).map(_0x2804ff => colorOf(_0x2804ff));
  if (_0x461ed0[0] === _0x461ed0[1] && _0x461ed0[1] === _0x461ed0[2] && _0x461ed0[0] !== "GREEN") {
    return {
      type: "COLOR_BREAK",
      value: _0x461ed0[0] === "RED" ? "BIG" : "SMALL"
    };
  }
  if (_0x3052a9[0] === 0) {
    return {
      type: "ZERO",
      value: "BIG"
    };
  }
  if (_0x3052a9[0] === 5) {
    return {
      type: "FIVE",
      value: "GREEN"
    };
  }
  if (_0x3052a9[1] === 0 && _0x3052a9[2] === 0) {
    return {
      type: "DOUBLE_ZERO",
      value: "SMALL"
    };
  }
  if (_0x3052a9[0] >= 8 && _0x3052a9[1] <= 2 && _0x3052a9[2] >= 8) {
    return {
      type: "SWING",
      value: "SMALL"
    };
  }
  if (_0x3052a9[0] <= 2 && _0x3052a9[1] >= 8 && _0x3052a9[2] <= 2) {
    return {
      type: "SWING",
      value: "BIG"
    };
  }
  if (_0x3052a9[0] > _0x3052a9[1] && _0x3052a9[1] > _0x3052a9[2] && _0x3052a9[2] > _0x3052a9[3]) {
    return {
      type: "DOWN_TREND",
      value: "BIG"
    };
  }
  if (_0x3052a9[0] < _0x3052a9[1] && _0x3052a9[1] < _0x3052a9[2] && _0x3052a9[2] < _0x3052a9[3]) {
    return {
      type: "UP_TREND",
      value: "SMALL"
    };
  }
  return null;
}
function recoveryLogic(_0x64a8ca, _0x55a177) {
  const _0x35349a = String(_0x64a8ca);
  const _0x47ab82 = +_0x35349a[_0x35349a.length - 3] || 0;
  const _0x40b7e2 = +_0x35349a[_0x35349a.length - 2] || 0;
  const _0x306f75 = +_0x35349a[_0x35349a.length - 1] || 0;
  const _0x4a173a = _0x47ab82 + _0x40b7e2 + _0x306f75;
  const _0x500868 = +_0x55a177[0]?.number || 0;
  const _0xd8019a = +_0x55a177[1]?.number || 0;
  const _0xfd93ae = _0x500868 + _0xd8019a;
  if (_0xfd93ae === 0) {
    return null;
  }
  const _0x40e47d = _0x4a173a * _0xfd93ae % 100;
  const _0x211768 = _0x40e47d % 10;
  if (_0x211768 === 0) {
    return "SMALL";
  }
  if (_0x211768 === 5) {
    return "BIG";
  }
  if (_0x211768 < 5) {
    return "SMALL";
  } else {
    return "BIG";
  }
}
function predictNext(_0x3b7113, _0x4a609a) {
  if (_0x3b7113.length < 3) {
    return null;
  }
  const _0x29e286 = +_0x3b7113[0].number;
  const _0x451872 = +_0x3b7113[1].number;
  const _0x4dd32e = +_0x3b7113[2].number;
  if (STATE.recovery) {
    const _0x59a731 = detectPattern(_0x3b7113);
    const _0xcfc68a = recoveryLogic(_0x4a609a, _0x3b7113);
    if (_0x59a731 && _0xcfc68a) {
      if (_0x59a731.value === _0xcfc68a) {
        const _0x27d255 = {
          type: "RECOVERY_CONFIRMED",
          value: _0xcfc68a
        };
        return _0x27d255;
      } else {
        return null;
      }
    }
    if (_0xcfc68a) {
      return {
        type: "RECOVERY_MATH",
        value: _0xcfc68a
      };
    }
    if (_0x59a731) {
      return {
        type: _0x59a731.type,
        value: _0x59a731.value
      };
    }
    return null;
  }
  const _0x404b36 = _0x29e286 + ":" + _0x451872 + ":" + _0x4dd32e;
  const _0x41acb4 = PRED3[_0x404b36];
  const _0x4021aa = detectPattern(_0x3b7113);
  if (_0x41acb4 && _0x4021aa) {
    if (_0x41acb4 === _0x4021aa.value) {
      const _0x2327fe = {
        type: "CONFIRMED_3NUM",
        value: _0x41acb4
      };
      return _0x2327fe;
    }
    const _0x10c7db = {
      type: _0x4021aa.type,
      value: _0x4021aa.value
    };
    return _0x10c7db;
  }
  if (_0x41acb4) {
    return {
      type: "3NUM_LOGIC",
      value: _0x41acb4
    };
  }
  if (_0x4021aa) {
    return {
      type: _0x4021aa.type,
      value: _0x4021aa.value
    };
  }
  return {
    type: "TREND",
    value: bs(_0x29e286)
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
  PATTERN: "RECOVERY PATTERN"
};
const API = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json";
let _lastTop = null;
async function fetchMarket() {
  try {
    const _0x1d33bd = await fetch(API + "?t=" + Date.now(), {
      cache: "no-store"
    });
    const _0x26dc2a = await _0x1d33bd.json();
    return _0x26dc2a?.data?.list || [];
  } catch (_0x3eec47) {
    return null;
  }
}
function renderMarket(_0xf7b30b) {
  const _0x1fe26e = $("mktList");
  if (!_0xf7b30b || !_0xf7b30b.length) {
    return;
  }
  const _0x599ad0 = _0xf7b30b[0].issueNumber;
  if (_0x599ad0 === _lastTop) {
    return;
  }
  const _0x1d1220 = _lastTop === null;
  _lastTop = _0x599ad0;
  _0x1fe26e.innerHTML = _0xf7b30b.map((_0x258144, _0x4a209a) => {
    const _0x486347 = +_0x258144.number;
    const _0x196785 = bs(_0x486347);
    const _0x1af528 = colorOf(_0x486347);
    const _0x394dbd = !_0x1d1220 && _0x4a209a === 0 ? " new" : "";
    const _0x2f5c8d = _0x1af528 === "GREEN" ? "var(--green)" : _0x1af528 === "RED" ? "var(--red)" : "var(--gold)";
    const _0xbd40b3 = _0x1af528 === "GREEN" ? "var(--green)" : _0x1af528 === "RED" ? "var(--red)" : "var(--gold)";
    return "<div class=\"mkt-row" + _0x394dbd + "\" style=\"border-left-color:" + _0xbd40b3 + "40\">\n      <span class=\"p\">" + _0x258144.issueNumber + "</span>\n      <span class=\"n\" style=\"color:" + _0x2f5c8d + "\">" + _0x486347 + "</span>\n      <span class=\"bs " + _0x196785 + "\">" + _0x196785 + "</span>\n      <span class=\"cl " + _0x1af528 + "\"></span>\n    </div>";
  }).join("");
}
function renderHistory() {
  const _0x162403 = $("histList");
  if (!STATE.signals.length) {
    _0x162403.innerHTML = "<div class=\"empty\"><i class=\"ri-history-line\"></i>No predictions yet</div>";
    return;
  }
  _0x162403.innerHTML = STATE.signals.slice().reverse().map(_0x16ca9b => {
    const _0x25d6e1 = STATE.results[_0x16ca9b.period];
    const _0x3eab99 = _0x25d6e1 ? _0x25d6e1.number + " • " + bs(+_0x25d6e1.number) : "—";
    const _0x470c08 = _0x16ca9b.status === "SKIP";
    return "<div class=\"hist-row" + (_0x470c08 ? " skip-row" : "") + "\">\n      <div><div class=\"lbl\">PERIOD</div><div class=\"v\">" + _0x16ca9b.period + "</div></div>\n      <div><div class=\"lbl\">SIGNAL</div><div class=\"v\" style=\"color:" + (_0x470c08 ? "var(--muted)" : "var(--gold)") + "\">" + _0x16ca9b.prediction + "</div></div>\n      <div><div class=\"lbl\">RESULT</div><div class=\"v\">" + _0x3eab99 + "</div></div>\n      <div class=\"res " + _0x16ca9b.status + "\">" + _0x16ca9b.status + "</div>\n    </div>";
  }).join("");
}
function spawnConfetti() {
  const _0x6974e6 = ["#FFD400", "#FF2D5E", "#00FF85", "#00EEFF", "#A855F7", "#FF9500"];
  const _0x3f499f = $("dlgBack");
  for (let _0x405a2a = 0; _0x405a2a < 36; _0x405a2a++) {
    const _0x3a6d19 = document.createElement("div");
    _0x3a6d19.className = "cbit";
    _0x3a6d19.style.cssText = "left:" + (5 + Math.random() * 90) + "%;top:5%;background:" + _0x6974e6[Math.floor(Math.random() * _0x6974e6.length)] + ";animation-delay:" + Math.random() * 0.5 + "s;animation-duration:" + (0.8 + Math.random() * 0.9) + "s;";
    _0x3f499f.appendChild(_0x3a6d19);
    setTimeout(() => _0x3a6d19.remove(), 1800);
  }
}
function showResultDialog(_0x8a9d7a, _0x5667bf) {
  const _0x2303f4 = _0x8a9d7a.status === "WIN";
  const _0x742347 = $("dlg");
  _0x742347.classList.remove("win", "loss");
  _0x742347.classList.add(_0x2303f4 ? "win" : "loss");
  $("dlgIcon").className = _0x2303f4 ? "ri-trophy-fill" : "ri-close-circle-fill";
  $("dlgTitle").textContent = _0x2303f4 ? "WIN 🎉" : "LOSS";
  $("dlgSub").textContent = _0x2303f4 ? "Prediction successful!" : "Market moved differently";
  $("dlgPeriod").textContent = _0x8a9d7a.period;
  $("dlgPred").textContent = _0x8a9d7a.prediction;
  $("dlgResult").textContent = _0x5667bf.number + " • " + bs(+_0x5667bf.number) + " • " + colorOf(+_0x5667bf.number);
  $("dlgBack").classList.add("show");
  if (_0x2303f4) {
    spawnConfetti();
  }
}
function closeDlg() {
  $("dlgBack").classList.remove("show");
}
function bumpStat(_0x227edd) {
  const _0x265577 = $(_0x227edd);
  if (!_0x265577) {
    return;
  }
  _0x265577.classList.remove("bump");
  _0x265577.offsetWidth;
  _0x265577.classList.add("bump");
}
function evalSignal(_0x313dc5, _0x579b25) {
  const _0x47f338 = +_0x579b25.number;
  const _0x1ee5d5 = _0x313dc5.prediction;
  if (_0x1ee5d5 === "SKIP") {
    return;
  }
  let _0x545edf = false;
  if (_0x1ee5d5 === "BIG" || _0x1ee5d5 === "SMALL") {
    _0x545edf = bs(_0x47f338) === _0x1ee5d5;
  } else if (_0x1ee5d5 === "RED" || _0x1ee5d5 === "GREEN") {
    _0x545edf = colorOf(_0x47f338) === _0x1ee5d5;
  }
  _0x313dc5.status = _0x545edf ? "WIN" : "LOSS";
  if (_0x545edf) {
    STATE.win++;
    STATE.streak++;
    STATE.recovery = false;
  } else {
    STATE.loss++;
    STATE.streak = 0;
    STATE.recovery = true;
  }
  updateStats();
  showResultDialog(_0x313dc5, _0x579b25);
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
  const _0x4a411f = STATE.win + STATE.loss;
  const _0x737f4d = _0x4a411f > 0 ? Math.round(STATE.win / _0x4a411f * 100) : 0;
  $("accPct").textContent = _0x737f4d + "%";
  $("accFill").style.width = _0x737f4d + "%";
}
function nextPeriodOf(_0x4eddc7) {
  const _0x3f547b = _0x4eddc7.slice(0, -5);
  const _0x153023 = parseInt(_0x4eddc7.slice(-5), 10) + 1;
  return _0x3f547b + String(_0x153023).padStart(5, "0");
}
let _engineRunning = false;
const _evalledPeriods = new Set();
async function engineTick() {
  if (_engineRunning) {
    return;
  }
  _engineRunning = true;
  try {
    const _0x1b54ac = await fetchMarket();
    if (!_0x1b54ac) {
      _engineRunning = false;
      return;
    }
    renderMarket(_0x1b54ac);
    STATE.signals.forEach(_0x45df6d => {
      if (_0x45df6d.status !== "PENDING" || _evalledPeriods.has(_0x45df6d.period)) {
        return;
      }
      const _0x576d30 = _0x1b54ac.find(_0x208778 => _0x208778.issueNumber === _0x45df6d.period);
      if (_0x576d30) {
        _evalledPeriods.add(_0x45df6d.period);
        STATE.results[_0x45df6d.period] = _0x576d30;
        evalSignal(_0x45df6d, _0x576d30);
      }
    });
    if (_signalAllowed) {
      const _0x1fe535 = _0x1b54ac[0];
      if (_0x1fe535) {
        const _0x2cf4ea = nextPeriodOf(_0x1fe535.issueNumber);
        const _0x884602 = STATE.signals.some(_0x5e9272 => _0x5e9272.period === _0x2cf4ea);
        if (!_0x884602 && STATE.lastPredPeriod !== _0x2cf4ea) {
          STATE.lastPredPeriod = _0x2cf4ea;
          const _0x36a513 = predictNext(_0x1b54ac, _0x2cf4ea);
          if (_0x36a513 === null) {
            const _0x548834 = {
              period: _0x2cf4ea,
              prediction: "SKIP",
              type: "RECOVERY_SKIP",
              status: "SKIP"
            };
            STATE.signals.push(_0x548834);
            $("predVal").className = "pred-val WAIT";
            $("predVal").textContent = "WAIT";
            $("predMeta").textContent = "Analyzing " + _0x2cf4ea;
            $("predTypeBadge").textContent = "⏸ RECOVERY ANALYSIS — WAITING";
          } else {
            const _0x43bfb1 = {
              period: _0x2cf4ea,
              prediction: _0x36a513.value,
              type: _0x36a513.type,
              status: "PENDING"
            };
            STATE.signals.push(_0x43bfb1);
            $("predVal").className = "pred-val " + _0x36a513.value;
            $("predVal").textContent = _0x36a513.value;
            $("predMeta").textContent = _0x2cf4ea;
            $("predTypeBadge").textContent = TYPE_LABELS[_0x36a513.type] || _0x36a513.type;
            const _0x2d2ccd = $("predVal");
            _0x2d2ccd.style.transform = "scale(1.18)";
            setTimeout(() => _0x2d2ccd.style.transform = "", 350);
          }
        }
      }
    }
  } catch (_0x58237f) {}
  _engineRunning = false;
}
function startEngine() {
  updatePeriod();
  engineTick();
  setInterval(engineTick, 8000);
  setInterval(() => {
    const _0x5e0ac = new Date().getSeconds();
    if (_0x5e0ac <= 3) {
      engineTick();
    }
  }, 1000);
}
(function initImgAnim() {
  document.querySelectorAll(".hero-core img, .ph-logo img, .admin-logo img").forEach(_0x703f69 => {
    _0x703f69.style.transition = "transform .4s ease,filter .4s ease";
    setInterval(() => {
      _0x703f69.style.transform = "scale(1.07)";
      _0x703f69.style.filter = "brightness(1.2) drop-shadow(0 0 12px rgba(255,212,0,.7))";
      setTimeout(() => {
        _0x703f69.style.transform = "scale(1)";
        _0x703f69.style.filter = "brightness(1) drop-shadow(0 0 4px rgba(255,212,0,.3))";
      }, 700);
    }, 2800);
  });
  const _0x326a0e = document.querySelector(".pred-card");
  if (_0x326a0e) {
    const _0x2ef42f = document.createElement("div");
    _0x2ef42f.style.cssText = "position:absolute;top:0;left:-100%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,212,0,.06),transparent);pointer-events:none;z-index:3;border-radius:inherit";
    _0x326a0e.appendChild(_0x2ef42f);
    setInterval(() => {
      _0x2ef42f.style.transition = "none";
      _0x2ef42f.style.left = "-60%";
      requestAnimationFrame(() => {
        _0x2ef42f.style.transition = "left 1.2s linear";
        _0x2ef42f.style.left = "110%";
      });
    }, 3500);
  }
  document.querySelectorAll(".live-dot,.status-dot,.schedDot").forEach(_0x14cabe => {
    _0x14cabe.style.animation = "blink 1.1s ease-in-out infinite";
  });
})();