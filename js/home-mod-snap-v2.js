/* Module Scroll Snap V2 — opt-in helper.
   No wheel / touch / pointer hijacking. Native CSS snap does the work.
   Query:
     ?snap=v2            enable
     ?snap=off           force disable
     ?snaptall=on        also snap sections taller than the viewport
                         (default V2 skips those so mobile can scroll through)
     ?snapdebug=1        height / snap HUD (prototype only)
*/
(function () {
  if (document.documentElement.classList.contains("qrmo-mod-story-v4")) return;
  var IDS = [
    "qrmo-translation-v3-root",
    "qrmo-home-filtre",
    "qrmo-home-asistan",
    "qrmo-home-masa",
    "qrmo-home-servis",
    "qrmo-home-icgoru"
  ];

  var html = document.documentElement;
  var params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch (e) {
    params = { get: function () { return null; } };
  }

  var snapParam = params.get("snap");
  if (snapParam === "v2") html.classList.add("qrmo-mod-snap-v2");
  if (snapParam === "off") html.classList.remove("qrmo-mod-snap-v2");

  if (!html.classList.contains("qrmo-mod-snap-v2")) return;

  var skipTall = params.get("snaptall") !== "on";
  var debug = params.get("snapdebug") === "1";
  var OVERSCAN_SLACK = 24;

  function items() {
    return IDS.map(function (id) {
      return document.getElementById(id);
    }).filter(Boolean);
  }

  function markOverscan() {
    var vh = window.innerHeight || html.clientHeight || 0;
    items().forEach(function (el) {
      var tall = el.offsetHeight > vh + OVERSCAN_SLACK;
      el.classList.toggle("qrmo-mod-snap-v2--overscan", skipTall && tall);
      el.setAttribute("data-qrmo-snap-overscan", tall ? "1" : "0");
    });
  }

  function hud() {
    var box = document.getElementById("qrmo-mod-snap-v2-hud");
    if (!box) {
      box = document.createElement("div");
      box.id = "qrmo-mod-snap-v2-hud";
      box.setAttribute("data-qrmo-snap-hud", "");
      box.style.cssText =
        "position:fixed;right:8px;bottom:8px;z-index:99999;max-width:280px;" +
        "padding:8px 10px;border-radius:8px;background:#0D2B22;color:#F4F1E8;" +
        "font:11px/1.35 ui-monospace,monospace;pointer-events:none;" +
        "box-shadow:0 8px 24px rgba(13,43,34,.28)";
      document.body.appendChild(box);
    }
    var vh = window.innerHeight;
    var vw = window.innerWidth;
    var lines = ["SNAP V2 " + vw + "×" + vh];
    items().forEach(function (el, i) {
      var h = Math.round(el.offsetHeight);
      var tall = el.getAttribute("data-qrmo-snap-overscan") === "1";
      var align = window.getComputedStyle(el).scrollSnapAlign;
      lines.push("S" + (i + 3) + " " + h + "px " + (tall ? "TALL" : "fit") + " snap:" + align);
    });
    box.textContent = lines.join("\n");
    box.style.whiteSpace = "pre";
  }

  function sync() {
    markOverscan();
    if (debug) hud();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", sync);
  } else {
    sync();
  }

  var raf = 0;
  window.addEventListener(
    "resize",
    function () {
      if (raf) return;
      raf = window.requestAnimationFrame(function () {
        raf = 0;
        sync();
      });
    },
    { passive: true }
  );
})();
