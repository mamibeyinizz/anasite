/* QR MENU OFFICIAL — header hesap bağlantısı.
   Oturum çerezi HttpOnly olduğu için burada okunmaz; giriş/çıkış sayfaları yalnızca
   "oturum var" işaretini (localStorage qrmo_hesap=1, kişisel veri içermez) yazar.
   İşaret yanlış olabilir (oturum süresi dolduysa): /hesabim/ sayfası bunu düzeltir. */
(function () {
  "use strict";
  var on = false;
  try { on = localStorage.getItem("qrmo_hesap") === "1"; } catch (e) {}
  if (!on) return;
  var links = document.querySelectorAll("[data-qrmo-acct]");
  Array.prototype.forEach.call(links, function (a) {
    a.setAttribute("href", a.getAttribute("data-acct-account"));
    var l = a.querySelector("[data-acct-label]"), s = a.querySelector("[data-acct-sub]");
    if (l) l.textContent = "Hesabım";
    if (s) s.textContent = "Siparişleriniz ve profiliniz";
  });
})();
