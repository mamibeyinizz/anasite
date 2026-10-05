/* Mobile scroll FX V1 — opt-in, scroll-linked visuals for S3–S8.
   No preventDefault. No scrollTop writes. No scrollIntoView / snap / lock.
   Query:
     ?scrollfx=v1     enable
     ?scrollfx=off    force disable
     ?scrollfxdebug=1 HUD
*/
(function () {
  if (document.documentElement.classList.contains("qrmo-mod-story-v4")) return;
  var SECTION_IDS = [
    "qrmo-translation-v3-root",
    "qrmo-home-filtre",
    "qrmo-home-asistan",
    "qrmo-home-masa",
    "qrmo-home-servis",
    "qrmo-home-icgoru"
  ];

  var COPY_SEL =
    ".qrmo-translation-v3-content, .qrmo-smart-filter-copy, " +
    ".qrmo-chatbot-feature__content, .qrmo-tables-v5__content, " +
    ".qrmo-service-v2__content, .qrmo-analytics-v3__content";

  var DEMO_SEL =
    ".qrmo-translation-v3-demo, .qrmo-real-filter-stage, " +
    ".qrmo-chatbot-feature__demo, .qrmo-tables-v5__demo, " +
    ".qrmo-service-v2__visual, .qrmo-analytics-v3__visual";

  var html = document.documentElement;
  var params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch (e) {
    params = { get: function () { return null; } };
  }

  var fxParam = params.get("scrollfx");
  if (fxParam === "v1") html.classList.add("qrmo-mod-scrollfx-v1");
  if (fxParam === "off") html.classList.remove("qrmo-mod-scrollfx-v1");

  if (!html.classList.contains("qrmo-mod-scrollfx-v1")) return;

  var debug = params.get("scrollfxdebug") === "1";
  var reduceMq = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false, addEventListener: function () {} };

  var viewOk = false;
  try {
    viewOk = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()"));
  } catch (e) {
    viewOk = false;
  }

  html.classList.toggle("qrmo-mod-scrollfx-v1--view", viewOk);

  var layers = [];
  var ticking = false;
  var useJs = false;

  function vh() {
    return window.innerHeight || html.clientHeight || 800;
  }

  function readToken(name, fallback) {
    var v = parseFloat(getComputedStyle(html).getPropertyValue(name));
    return v > 0 || v < 0 ? v : fallback;
  }

  function tokens() {
    return {
      copyY: readToken("--qrmo-sfx-copy-y", 8),
      demoY: readToken("--qrmo-sfx-demo-y", 10),
      copyOp: readToken("--qrmo-sfx-copy-op", 0.95),
      demoOp: readToken("--qrmo-sfx-demo-op", 0.92),
      demoSc: readToken("--qrmo-sfx-demo-sc", 0.994)
    };
  }

  /* Entry progress 0→1 as the block rises into view; clamps so mid-section
     scroll does not reset tall blocks that already settled. */
  function entryProgress(rect, vhPx, leadIn, settle) {
    var start = vhPx * leadIn;
    var end = vhPx * settle;
    if (rect.bottom < 0 || rect.top > vhPx) return rect.top > vhPx ? 0 : 1;
    if (start <= end) return 1;
    var p = 1 - (rect.top - end) / (start - end);
    if (p < 0) return 0;
    if (p > 1) return 1;
    return p;
  }

  function applyLayer(layer, t, vhPx) {
    var rect = layer.el.getBoundingClientRect();
    var lead = layer.kind === "demo" ? 0.94 : 0.9;
    var settle = layer.kind === "demo" ? 0.38 : 0.34;
    var p = entryProgress(rect, vhPx, lead, settle);
    var y = layer.kind === "demo" ? t.demoY : t.copyY;
    var opFrom = layer.kind === "demo" ? t.demoOp : t.copyOp;
    var scFrom = layer.kind === "demo" ? t.demoSc : 1;
    var ty = (1 - p) * y;
    var op = opFrom + (1 - opFrom) * p;
    var sc = scFrom + (1 - scFrom) * p;
    if (layer.kind === "demo") {
      layer.el.style.transform =
        "translate3d(0," + ty.toFixed(2) + "px,0) scale(" + sc.toFixed(4) + ")";
    } else {
      layer.el.style.transform = "translate3d(0," + ty.toFixed(2) + "px,0)";
    }
    layer.el.style.opacity = op.toFixed(4);
  }

  function paint() {
    ticking = false;
    if (!useJs || reduceMq.matches) return;
    var t = tokens();
    var h = vh();
    for (var i = 0; i < layers.length; i++) {
      applyLayer(layers[i], t, h);
    }
    if (debug) hud();
  }

  function onScroll() {
    if (!useJs || ticking) return;
    ticking = true;
    window.requestAnimationFrame(paint);
  }

  function collectLayers() {
    layers.forEach(function (layer) {
      layer.el.style.transform = "";
      layer.el.style.opacity = "";
      layer.el.removeAttribute("data-qrmo-sfx-layer");
    });
    layers = [];
    SECTION_IDS.forEach(function (id) {
      var root = document.getElementById(id);
      if (!root) return;
      root.querySelectorAll(COPY_SEL).forEach(function (el) {
        if (!root.contains(el)) return;
        el.setAttribute("data-qrmo-sfx-layer", "copy");
        layers.push({ el: el, kind: "copy" });
      });
      root.querySelectorAll(DEMO_SEL).forEach(function (el) {
        if (!root.contains(el)) return;
        el.setAttribute("data-qrmo-sfx-layer", "demo");
        layers.push({ el: el, kind: "demo" });
      });
    });
  }

  function clearJsStyles() {
    layers.forEach(function (layer) {
      layer.el.style.transform = "";
      layer.el.style.opacity = "";
      layer.el.removeAttribute("data-qrmo-sfx-layer");
    });
    layers = [];
  }

  function bootJsPath() {
    useJs = true;
    html.classList.add("qrmo-mod-scrollfx-v1--js");
    collectLayers();
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      collectLayers();
      paint();
    }, { passive: true });
  }

  function stopJsPath() {
    useJs = false;
    html.classList.remove("qrmo-mod-scrollfx-v1--js");
    window.removeEventListener("scroll", onScroll);
    clearJsStyles();
  }

  function onMotionChange() {
    if (reduceMq.matches) {
      stopJsPath();
      return;
    }
    if (!viewOk) bootJsPath();
  }

  function hud() {
    if (!debug) return;
    var box = document.getElementById("qrmo-mod-scrollfx-v1-hud");
    if (!box) {
      box = document.createElement("div");
      box.id = "qrmo-mod-scrollfx-v1-hud";
      box.style.cssText =
        "position:fixed;left:8px;bottom:8px;z-index:99999;max-width:300px;" +
        "padding:8px 10px;border-radius:8px;background:#0D2B22;color:#F4F1E8;" +
        "font:11px/1.35 ui-monospace,monospace;pointer-events:none;" +
        "box-shadow:0 8px 24px rgba(13,43,34,.28);white-space:pre";
      document.body.appendChild(box);
    }
    var lines = [
      "SCROLLFX V1 " + window.innerWidth + "×" + vh(),
      "view(): " + (viewOk ? "yes" : "no") + " js=" + (useJs ? "1" : "0"),
      "layers=" + layers.length
    ];
    SECTION_IDS.forEach(function (id, i) {
      var el = document.getElementById(id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      lines.push(
        "S" + (i + 3) + " h=" + Math.round(r.height) + " top=" + Math.round(r.top)
      );
    });
    box.textContent = lines.join("\n");
  }

  function boot() {
    onMotionChange();
    if (typeof reduceMq.addEventListener === "function") {
      reduceMq.addEventListener("change", onMotionChange);
    } else if (typeof reduceMq.addListener === "function") {
      reduceMq.addListener(onMotionChange);
    }
    if (debug) {
      hud();
      window.addEventListener("scroll", hud, { passive: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
