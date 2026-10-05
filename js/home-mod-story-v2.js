/* Module Scroll Story V2 — opt-in helper.
   No wheel / touch / pointer hijacking. No scrollTop writes.
   Query:
     ?story=v2       enable
     ?story=off      force disable
     ?storydebug=1   HUD (prototype only)
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

  var storyParam = params.get("story");
  if (storyParam === "v2") html.classList.add("qrmo-mod-story-v2");
  if (storyParam === "off") html.classList.remove("qrmo-mod-story-v2");

  if (!html.classList.contains("qrmo-mod-story-v2")) return;

  var debug = params.get("storydebug") === "1";
  var viewOk = false;
  try {
    viewOk = !!(window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()"));
  } catch (e) {
    viewOk = false;
  }
  html.classList.toggle("qrmo-mod-story-v2--view", viewOk);

  if (!debug) return;

  function hud() {
    var box = document.getElementById("qrmo-mod-story-v2-hud");
    if (!box) {
      box = document.createElement("div");
      box.id = "qrmo-mod-story-v2-hud";
      box.setAttribute("data-qrmo-story-hud", "");
      box.style.cssText =
        "position:fixed;right:8px;bottom:8px;z-index:99999;max-width:280px;" +
        "padding:8px 10px;border-radius:8px;background:#0D2B22;color:#F4F1E8;" +
        "font:11px/1.35 ui-monospace,monospace;pointer-events:none;" +
        "box-shadow:0 8px 24px rgba(13,43,34,.28);white-space:pre";
      document.body.appendChild(box);
    }
    var vh = window.innerHeight;
    var lines = [
      "STORY V2 " + window.innerWidth + "×" + vh,
      "view(): " + (viewOk ? "yes" : "no")
    ];
    IDS.forEach(function (id, i) {
      var el = document.getElementById(id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      var mid = r.top + r.height / 2;
      var near = mid > 0 && mid < vh;
      lines.push(
        "S" + (i + 3) + " h=" + Math.round(r.height) +
          " top=" + Math.round(r.top) +
          (near ? " in" : "")
      );
    });
    box.textContent = lines.join("\n");
  }

  function bind() {
    hud();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }

  /* IO only to refresh the debug HUD — no transforms, no scroll writes. */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function () { hud(); }, {
      root: null,
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });
    IDS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) io.observe(el);
    });
  }
})();
