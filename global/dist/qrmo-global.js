/* Üretilmiştir: node global/build.mjs — düzenlemeyin (kaynak: global/src/*.js) */
/* QR MENU OFFICIAL — global header davranışı (bağımlılıksız).
   V3 off-canvas drawer: Esc, backdrop, focus trap, odak iadesi, kaydırma kilidi. */
(function () {
  "use strict";
  var root = document.documentElement;
  var hdr = document.querySelector("[data-qrmo-gh]");
  if (!hdr) return;

  var burger = hdr.querySelector(".qrmo-gh-burger");
  var drawer = hdr.querySelector(".qrmo-gh-drawer");
  var backdrop = hdr.querySelector("[data-qrmo-gh-backdrop]");
  var closeBtn = hdr.querySelector(".qrmo-gh-drawer-close");
  var desktop = window.matchMedia("(min-width: 961px)");
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var previouslyFocused = null;

  function isOpen() {
    return hdr.classList.contains("qrmo-gh--open");
  }

  function setDrawerA11y(open) {
    if (!drawer) return;
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
  }

  function openDrawer() {
    previouslyFocused = document.activeElement;
    hdr.classList.add("qrmo-gh--open");
    root.classList.add("qrmo-gh-lock");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Menüyü kapat");
    setDrawerA11y(true);
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function closeDrawer(returnFocus) {
    if (!isOpen()) return;
    hdr.classList.remove("qrmo-gh--open");
    root.classList.remove("qrmo-gh-lock");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Menüyü aç");
    setDrawerA11y(false);
    if (returnFocus !== false && previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus({ preventScroll: true });
    } else if (returnFocus !== false) {
      burger.focus({ preventScroll: true });
    }
  }

  if (burger && drawer) {
    burger.addEventListener("click", function () {
      isOpen() ? closeDrawer(true) : openDrawer();
    });
    if (backdrop) backdrop.addEventListener("click", function () { closeDrawer(true); });
    if (closeBtn) closeBtn.addEventListener("click", function () { closeDrawer(true); });
    drawer.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (a) closeDrawer(false);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      e.preventDefault();
      closeDrawer(true);
      return;
    }
    if (e.key !== "Tab" || !isOpen()) return;
    var items = Array.prototype.filter.call(drawer.querySelectorAll(FOCUSABLE), function (el) {
      return el.offsetParent !== null;
    });
    items.unshift(burger);
    var first = items[0];
    var last = items[items.length - 1];
    if (!drawer.contains(document.activeElement) && document.activeElement !== burger) {
      e.preventDefault();
      (items[1] || first).focus();
      return;
    }
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  var onChange = function () {
    if (desktop.matches && isOpen()) closeDrawer(false);
  };
  if (desktop.addEventListener) desktop.addEventListener("change", onChange);
  else desktop.addListener(onChange);
})();

/* QR MENU OFFICIAL — global footer: ≤560px akordeon (ilk kolon açık),
   ≥561px tüm kolonlar açık. JS yoksa HTML'deki `open` ile hepsi açık kalır. */
(function () {
  "use strict";
  var cols = document.querySelectorAll("[data-qrmo-gf] .qrmo-gf-col");
  if (!cols.length) return;
  var wide = window.matchMedia("(min-width: 561px)");
  function sync() {
    for (var i = 0; i < cols.length; i++) {
      if (wide.matches) cols[i].setAttribute("open", "");
      else if (i === 0) cols[i].setAttribute("open", "");
      else cols[i].removeAttribute("open");
    }
  }
  sync();
  if (wide.addEventListener) wide.addEventListener("change", sync);
  else wide.addListener(sync);
})();

/* Pending conversion CTA — href yokken dürüst geri bildirim (sahte yönlendirme yok). */
(function () {
  "use strict";

  var cfg = window.QRMO_CONVERSION || {};
  var notices = cfg.pending || {};

  function noticeFor(slot) {
    if (slot && notices[slot]) return notices[slot];
    return notices.default || "Bu bağlantı henüz etkin değil.";
  }

  function noteHost(btn) {
    return (
      btn.closest(
        ".qrmo-hero-v3-cta-group,.qrmo-transition-v1__action,.qrmo-final-cta-v1__action,.qrmo-gf-cta,.qrmo-gh-drawer-bottom,.qrmo-gh-in"
      ) || btn.parentElement
    );
  }

  function showPending(btn, slot) {
    var host = noteHost(btn);
    if (!host) return;
    var n = host.querySelector(".qrmo-cta-note");
    if (!n) {
      n = document.createElement("p");
      n.className = "qrmo-cta-note";
      n.setAttribute("role", "status");
      host.appendChild(n);
    }
    n.textContent = noticeFor(slot);
  }

  function isPendingButton(el) {
    if (!el || el.tagName !== "BUTTON") return false;
    if (el.hasAttribute("data-qrmo-cta") || el.getAttribute("data-cta-target") === "TBD") {
      return true;
    }
    return el.classList.contains("qrmo-hero-v3-cta");
  }

  document.addEventListener("click", function (e) {
    var btn =
      e.target.closest("[data-qrmo-cta]") ||
      e.target.closest('[data-cta-target="TBD"]') ||
      e.target.closest("button.qrmo-hero-v3-cta");
    if (!btn || !isPendingButton(btn)) return;
    if (btn.tagName === "A") return;

    e.preventDefault();
    var slot = btn.getAttribute("data-qrmo-cta");
    if (!slot && btn.closest(".qrmo-final-cta-v1")) slot = "final";
    else if (!slot && btn.closest(".qrmo-transition-v1")) slot = "transition";
    else if (!slot) slot = "primary";
    showPending(btn, slot);
  });
})();

/* Onaylı ziyaretçi takibi + çerez/depolama onay çubuğu.
   - Onay verilmeden tarayıcıda hiçbir kimlik oluşturulmaz, sunucuya hiçbir şey gönderilmez.
   - "Do Not Track" veya "Global Privacy Control" açıksa çubuk gösterilmez ve takip yapılmaz.
   - Toplananlar: sayfa görüntüleme, tıklanan bağlantı/düğme etiketi, kaydırma derinliği, etkin süre.
     Form alanı içeriği, metin girişi ve tuş vuruşu hiçbir zaman okunmaz.
   Kayıt yeri: /api/collect (backend/src/Site/Collector.php). Metin: /cerez-politikasi/ ve /gizlilik/. */
(function () {
  "use strict";

  var CONSENT_KEY = "qrmo_consent";
  var VID_KEY = "qrmo_vid";
  var SID_KEY = "qrmo_sid";
  var SEEN_KEY = "qrmo_seen";
  var CTX_KEY = "qrmo_ctx";
  var VERSION = 1;
  var SESSION_IDLE_MS = 30 * 60 * 1000;
  var ENDPOINT = (window.QRMO_ANALYTICS && window.QRMO_ANALYTICS.endpoint) || "/api/collect";

  var doc = document;
  var queue = [];
  var timer = null;
  var started = false;
  var ids = null;
  var activeSeconds = 0;
  var lastInput = Date.now();
  var scrollSent = {};
  var lastClick = { el: null, t: 0 };

  function store(kind) {
    try {
      var s = window[kind];
      var k = "__qrmo_t";
      s.setItem(k, "1");
      s.removeItem(k);
      return s;
    } catch (e) {
      return null;
    }
  }
  var ls = store("localStorage");
  var ss = store("sessionStorage");

  function optedOutSignal() {
    return navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
  }

  function readConsent() {
    if (!ls) return null;
    try {
      var c = JSON.parse(ls.getItem(CONSENT_KEY) || "null");
      return c && c.v === VERSION && typeof c.a === "boolean" ? c : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(accepted) {
    if (!ls) return;
    try {
      ls.setItem(CONSENT_KEY, JSON.stringify({ v: VERSION, a: accepted, t: Date.now() }));
    } catch (e) {}
  }

  function hex32() {
    var a = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(a);
    var s = "";
    for (var i = 0; i < a.length; i++) s += (a[i] < 16 ? "0" : "") + a[i].toString(16);
    return s;
  }

  function loadIds() {
    if (!ls || !ss) return null;
    try {
      var vid = ls.getItem(VID_KEY);
      if (!/^[a-f0-9]{32}$/.test(vid || "")) {
        vid = hex32();
        ls.setItem(VID_KEY, vid);
      }
      var sid = ss.getItem(SID_KEY);
      var seen = parseInt(ss.getItem(SEEN_KEY) || "0", 10);
      if (!/^[a-f0-9]{32}$/.test(sid || "") || Date.now() - seen > SESSION_IDLE_MS) {
        sid = hex32();
        ss.setItem(SID_KEY, sid);
        ss.removeItem(CTX_KEY);
      }
      ss.setItem(SEEN_KEY, String(Date.now()));
      return { v: vid, s: sid };
    } catch (e) {
      return null;
    }
  }

  function clip(s, n) {
    s = String(s == null ? "" : s).replace(/\s+/g, " ").trim();
    return s.length > n ? s.slice(0, n) : s;
  }

  function context() {
    if (ss && ss.getItem(CTX_KEY)) return null;
    var ref = "";
    try {
      if (doc.referrer && new URL(doc.referrer).host !== location.host) ref = doc.referrer.split("#")[0];
    } catch (e) {}
    var utm = {};
    try {
      var q = new URLSearchParams(location.search);
      ["source", "medium", "campaign"].forEach(function (k) {
        var v = q.get("utm_" + k);
        if (v) utm[k] = clip(v, 100);
      });
    } catch (e) {}
    if (ss) ss.setItem(CTX_KEY, "1");
    return { ref: ref, utm: utm, scr: screen.width + "x" + screen.height, lang: navigator.language || "" };
  }

  function push(type, extra) {
    if (!started) return;
    var e = { type: type, path: location.pathname };
    for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) e[k] = extra[k];
    queue.push(e);
    if (queue.length >= 20) flush(false);
    else if (!timer) timer = setTimeout(function () { flush(false); }, 3000);
  }

  function flush(final) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!started || !queue.length) return;
    ids = loadIds();
    if (!ids) return;
    var batch = queue.splice(0, 25);
    var body = { v: ids.v, s: ids.s, ev: batch };
    var ctx = context();
    if (ctx) body.ctx = ctx;
    var json = JSON.stringify(body);
    var sent = false;
    if (navigator.sendBeacon) {
      try {
        sent = navigator.sendBeacon(ENDPOINT, new Blob([json], { type: "text/plain" }));
      } catch (e) {}
    }
    if (!sent && window.fetch) {
      fetch(ENDPOINT, { method: "POST", body: json, headers: { "Content-Type": "text/plain" }, keepalive: true, credentials: "omit" }).catch(function () {});
    }
    if (queue.length) flush(final);
  }

  /* ---- tıklama ---- */
  function labelOf(el) {
    var d = el.getAttribute("data-track");
    if (d) return clip(d, 160);
    var a = el.getAttribute("aria-label");
    if (a) return clip(a, 160);
    var t = clip(el.textContent, 80);
    if (t) return t;
    var img = el.querySelector && el.querySelector("img[alt]");
    if (img && img.alt) return clip(img.alt, 80);
    return clip(el.getAttribute("title") || el.id || el.className, 80);
  }

  function sectionOf(el) {
    if (el.closest("header")) return "header";
    if (el.closest("footer")) return "footer";
    var s = el.closest("[data-section],section[id],section[class],main[id]");
    if (!s) return "";
    return clip(s.getAttribute("data-section") || s.id || String(s.className).split(" ")[0], 80);
  }

  function targetOf(el) {
    var a = el.closest("a[href]");
    if (!a) return { target: "", outbound: false };
    var href = a.getAttribute("href") || "";
    if (/^(mailto|tel|whatsapp):/i.test(href)) return { target: clip(href.split("?")[0], 255), outbound: false };
    try {
      var u = new URL(a.href, location.href);
      if (u.host === location.host) return { target: clip(u.pathname + u.hash, 255), outbound: false };
      return { target: clip(u.origin + u.pathname, 255), outbound: true };
    } catch (e) {
      return { target: "", outbound: false };
    }
  }

  function onClick(ev) {
    if (!started || !ev.target || !ev.target.closest) return;
    var el = ev.target.closest("a,button,summary,[role=button],[data-track]");
    if (!el || el.closest("[data-qrmo-consent]")) return;
    var now = Date.now();
    if (lastClick.el === el && now - lastClick.t < 400) return;
    lastClick = { el: el, t: now };
    var t = targetOf(el);
    push(t.outbound ? "outbound" : "click", { label: labelOf(el), target: t.target, section: sectionOf(el) });
    flushSoon(t.outbound || (el.closest("a[href]") && !t.target.startsWith("#")));
  }

  function flushSoon(leaving) {
    if (leaving) flush(true);
  }

  /* ---- kaydırma + etkin süre ---- */
  function onScroll() {
    var h = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight) - window.innerHeight;
    var pct = h <= 0 ? 100 : Math.min(100, Math.round(((window.scrollY || window.pageYOffset) / h) * 100));
    [25, 50, 75, 100].forEach(function (m) {
      if (pct >= m && !scrollSent[m]) {
        scrollSent[m] = true;
        push("scroll", { value: m });
      }
    });
  }
  var scrollTick = false;
  function onScrollThrottled() {
    lastInput = Date.now();
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () {
      scrollTick = false;
      onScroll();
    });
  }

  var engageTimer = null;
  function tickEngage() {
    if (doc.visibilityState === "visible" && Date.now() - lastInput < 30000) activeSeconds += 1;
  }
  function flushEngage() {
    if (activeSeconds > 0) {
      push("engage", { value: activeSeconds });
      activeSeconds = 0;
    }
  }

  function start() {
    if (started) return;
    ids = loadIds();
    if (!ids) return;
    started = true;
    push("pageview", { title: clip(doc.title, 160) });
    doc.addEventListener("click", onClick, true);
    window.addEventListener("scroll", onScrollThrottled, { passive: true });
    ["mousemove", "keydown", "touchstart", "pointerdown"].forEach(function (n) {
      doc.addEventListener(n, function () { lastInput = Date.now(); }, { passive: true });
    });
    engageTimer = setInterval(tickEngage, 1000);
    setInterval(function () {
      flushEngage();
      flush(false);
    }, 15000);
    function leave() {
      flushEngage();
      flush(true);
    }
    doc.addEventListener("visibilitychange", function () {
      if (doc.visibilityState === "hidden") leave();
    });
    window.addEventListener("pagehide", leave);
    setTimeout(onScroll, 800);
  }

  function stop() {
    started = false;
    queue.length = 0;
    if (engageTimer) clearInterval(engageTimer);
    try {
      if (ls) {
        ls.removeItem(VID_KEY);
      }
      if (ss) {
        ss.removeItem(SID_KEY);
        ss.removeItem(SEEN_KEY);
        ss.removeItem(CTX_KEY);
      }
    } catch (e) {}
  }

  /* ---- onay çubuğu ---- */
  var bar = null;

  function closeBar() {
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    bar = null;
  }

  function decide(accepted) {
    var was = readConsent();
    writeConsent(accepted);
    closeBar();
    if (accepted) start();
    else if (was && was.a) {
      stop();
      /* Geri çekilen onay: sayfa yenilenene kadar yeni olay gönderilmez; kimlikler silindi. */
    }
  }

  function policyHref() {
    var depth = location.pathname.split("/").filter(Boolean).length;
    if (/\.html?$/.test(location.pathname)) depth -= 1;
    var up = "";
    for (var i = 0; i < depth; i++) up += "../";
    return (up || "./") + "cerez-politikasi/#tercihler";
  }

  function showBar() {
    if (bar || !doc.body) return;
    bar = doc.createElement("div");
    bar.className = "qrmo-consent";
    bar.setAttribute("data-qrmo-consent", "");
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Çerez ve ziyaret ölçümü tercihi");
    bar.innerHTML =
      '<p class="qrmo-consent__title">Ziyaretinizi ölçelim mi?</p>' +
      '<p class="qrmo-consent__text">Hangi sayfaların ve düğmelerin kullanıldığını anlamak için bu tarayıcıda anonim bir ziyaretçi kimliği saklarız. Reddederseniz hiçbir şey saklanmaz ve gönderilmez; site aynen çalışır.</p>' +
      '<div class="qrmo-consent__actions">' +
      '<button type="button" class="qrmo-consent__btn qrmo-consent__btn--accept" data-act="accept">Kabul Et</button>' +
      '<button type="button" class="qrmo-consent__btn qrmo-consent__btn--reject" data-act="reject">Reddet</button>' +
      "</div>" +
      '<a class="qrmo-consent__more" href="' + policyHref() + '">Çerez Politikası <span aria-hidden="true">→</span></a>';
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-act]");
      if (b) decide(b.getAttribute("data-act") === "accept");
    });
    doc.body.appendChild(bar);
  }

  function init() {
    doc.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("[data-qrmo-consent-open]")) {
        e.preventDefault();
        showBar();
      }
    });
    window.QRMO_CONSENT = {
      open: showBar,
      get: function () { var c = readConsent(); return c ? c.a : null; },
      set: decide
    };
    if (optedOutSignal() || !ls || !ss) return;
    var c = readConsent();
    if (c && c.a) start();
    else if (!c) showBar();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
