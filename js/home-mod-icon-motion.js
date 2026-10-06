/* S3–S8 benefit icon micro-motion — once per module per session, Story V4 scene enter. */
(function () {
  var html = document.documentElement;
  if (!html.classList.contains("qrmo-mod-story-v4")) return;

  var MODULE = {
    "qrmo-translation-v3-root": "s3",
    "qrmo-home-filtre": "s4",
    "qrmo-home-asistan": "s5",
    "qrmo-home-masa": "s6",
    "qrmo-home-servis": "s7",
    "qrmo-home-icgoru": "s8"
  };

  var played = Object.create(null);
  var mobileMq = window.matchMedia("(max-width: 767px)");
  var reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

  function mobile() {
    return mobileMq.matches;
  }

  function reduced() {
    return reduceMq.matches;
  }

  function shouldPlay(detail) {
    if (!detail || !detail.moduleId) return false;
    if (reduced()) return false;
    if (mobile()) return detail.role === "copy";
    return detail.role === "module";
  }

  function activate(moduleId, slug) {
    var root = document.getElementById(moduleId);
    if (!root) return;
    root.classList.add("is-mod-icons-active", "is-mod-icons-active--" + slug);
    window.setTimeout(function () {
      root.classList.remove("is-mod-icons-active", "is-mod-icons-active--" + slug);
    }, 980);
  }

  document.addEventListener("qrmo-story-scene-enter", function (e) {
    var detail = e.detail;
    if (!shouldPlay(detail)) return;
    var slug = MODULE[detail.moduleId];
    if (!slug || played[slug]) return;
    played[slug] = true;
    activate(detail.moduleId, slug);
  });
})();
