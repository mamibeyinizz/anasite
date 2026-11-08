/* QR MENU OFFICIAL — header hesap bağlantısı.
   Oturum çerezi HttpOnly olduğu için burada okunmaz; giriş/çıkış sayfaları yalnızca
   "oturum var" işaretini (localStorage qrmo_hesap=1, kişisel veri içermez) yazar.
   İşaret yanlış olabilir (oturum süresi dolduysa): /hesabim/ sayfası bunu düzeltir.
   Oturum yokken: "Giriş Yap / Kayıt Ol". Oturum varken: yalnızca "Hesabım". */
(function () {
  "use strict";
  var on = false;
  try { on = localStorage.getItem("qrmo_hesap") === "1"; } catch (e) {}
  if (!on) return;
  Array.prototype.forEach.call(document.querySelectorAll("[data-qrmo-acct-group]"), function (g) {
    var main = g.querySelector("[data-acct-main]"), l = g.querySelector("[data-acct-label]");
    var sep = g.querySelector("[data-acct-sep]"), sign = g.querySelector("[data-acct-signup]");
    if (main) main.setAttribute("href", g.getAttribute("data-acct-account"));
    if (l) l.textContent = "Hesabım";
    if (sep) sep.hidden = true;
    if (sign) sign.hidden = true;
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-acct-foot]"), function (a) {
    if (a.getAttribute("data-acct-foot") === "login") {
      a.setAttribute("href", a.getAttribute("data-acct-account"));
      a.textContent = "Hesabım";
    } else if (a.parentNode) {
      a.parentNode.hidden = true;
    }
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-qrmo-acct]"), function (a) {
    a.setAttribute("href", a.getAttribute("data-acct-account"));
    var l = a.querySelector("[data-acct-label]"), s = a.querySelector("[data-acct-sub]");
    if (l) l.textContent = "Hesabım";
    if (s) s.textContent = "Siparişleriniz ve profiliniz";
  });
})();
