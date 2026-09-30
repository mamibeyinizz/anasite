/* QR MENU OFFICIAL — global footer: <600'de kolonlar akordeon (kapalı başlar),
   ≥600'de hepsi açık. JS yoksa HTML'deki `open` ile hepsi açık kalır. */
(function () {
  "use strict";
  var cols = document.querySelectorAll("[data-qrmo-gf] .qrmo-gf-col");
  if (!cols.length) return;
  var wide = window.matchMedia("(min-width: 600px)");
  function sync() {
    for (var i = 0; i < cols.length; i++) {
      if (wide.matches) cols[i].setAttribute("open", "");
      else cols[i].removeAttribute("open");
    }
  }
  sync();
  if (wide.addEventListener) wide.addEventListener("change", sync); else wide.addListener(sync);
})();
