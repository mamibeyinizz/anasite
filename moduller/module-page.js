/* =========================================================
   QR MENU OFFICIAL — /moduller/ ORTAK DAVRANIŞ
   İçerik sunucu tarafında (build.js) üretilir; bu dosya yalnızca
   iki küçük iyileştirme yapar. JS çalışmasa sayfa tam okunur.
   1) Özellik gruplarında "Tümünü aç / kapat" düğmesi.
   2) Bölümlerin alt kısımda görünürken hafifçe belirmesi
      (reduced-motion açıksa hiç çalışmaz).
========================================================= */
(function () {
  "use strict";

  /* 1) Tümünü aç / kapat */
  var wrap = document.querySelector("[data-qrmo-groups]");
  if (wrap) {
    var groups = wrap.querySelectorAll("details.qrmo-mod-group");
    if (groups.length > 2) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "qrmo-mod-toggleall";
      var sync = function () {
        var all = Array.prototype.every.call(groups, function (d) { return d.open; });
        btn.textContent = all ? "Tümünü kapat" : "Tümünü aç";
      };
      btn.addEventListener("click", function () {
        var all = Array.prototype.every.call(groups, function (d) { return d.open; });
        groups.forEach(function (d) { d.open = !all; });
        sync();
      });
      groups.forEach(function (d) { d.addEventListener("toggle", sync); });
      wrap.insertBefore(btn, wrap.firstChild);
      sync();
    }
  }

  /* 2) Belirme (yalnızca ekran altındaki bölümler) */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  var targets = document.querySelectorAll(".qrmo-mod > section:not(.qrmo-mod-hero) > .qrmo-mod-inner");
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });

  targets.forEach(function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.classList.add("qrmo-mod-reveal");
      io.observe(el);
    }
  });
})();
