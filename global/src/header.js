/* QR MENU OFFICIAL — global header davranışı (bağımlılıksız).
   Mega menü (masaüstü) + drawer (<1180): Esc, backdrop, focus trap,
   odak iadesi, kaydırma kilidi. Kaydırma dinleyicisi/gözlemci yok. */
(function () {
  "use strict";
  var root = document.documentElement;
  var hdr = document.querySelector("[data-qrmo-gh]");
  if (!hdr) return;

  var burger = hdr.querySelector(".qrmo-gh-burger");
  var drawer = hdr.querySelector(".qrmo-gh-drawer");
  var backdrop = hdr.querySelector("[data-qrmo-gh-backdrop]");
  var megaBtn = hdr.querySelector(".qrmo-gh-mega-btn");
  var mega = hdr.querySelector(".qrmo-gh-mega");
  var megaItem = hdr.querySelector(".qrmo-gh-has-mega");
  var desktop = window.matchMedia("(min-width: 1180px)");
  var FOCUSABLE = 'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

  /* ---------- drawer ---------- */
  function isOpen() { return hdr.classList.contains("qrmo-gh--open"); }

  function openDrawer() {
    closeMega();
    hdr.classList.add("qrmo-gh--open");
    root.classList.add("qrmo-gh-lock");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Menüyü kapat");
    var first = drawer.querySelector(FOCUSABLE);
    if (first) first.focus({ preventScroll: true });
  }
  function closeDrawer(returnFocus) {
    if (!isOpen()) return;
    hdr.classList.remove("qrmo-gh--open");
    root.classList.remove("qrmo-gh-lock");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Menüyü aç");
    if (returnFocus) burger.focus({ preventScroll: true });
  }

  if (burger && drawer) {
    burger.addEventListener("click", function () { isOpen() ? closeDrawer(true) : openDrawer(); });
    if (backdrop) backdrop.addEventListener("click", function () { closeDrawer(true); });
    drawer.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (a) closeDrawer(false); /* aynı sayfada çapaya gidilirse menü açık kalmasın */
    });
  }

  /* ---------- mega menü ---------- */
  var hoverTimer = 0;
  function megaOpen() { return megaBtn && megaBtn.getAttribute("aria-expanded") === "true"; }
  function openMega() {
    if (!mega || !desktop.matches) return;
    clearTimeout(hoverTimer);
    mega.hidden = false;
    megaBtn.setAttribute("aria-expanded", "true");
  }
  function closeMega() {
    if (!mega) return;
    clearTimeout(hoverTimer);
    mega.hidden = true;
    if (megaBtn) megaBtn.setAttribute("aria-expanded", "false");
  }
  if (megaBtn && mega) {
    megaBtn.addEventListener("click", function () { megaOpen() ? closeMega() : openMega(); });
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      megaItem.addEventListener("mouseenter", function () { clearTimeout(hoverTimer); hoverTimer = setTimeout(openMega, 90); });
      megaItem.addEventListener("mouseleave", function () { clearTimeout(hoverTimer); hoverTimer = setTimeout(closeMega, 160); });
    }
    megaItem.addEventListener("focusout", function (e) {
      if (!megaItem.contains(e.relatedTarget)) closeMega();
    });
    document.addEventListener("click", function (e) { if (megaOpen() && !megaItem.contains(e.target)) closeMega(); });
  }

  /* ---------- klavye: Esc + focus trap ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (isOpen()) { e.preventDefault(); closeDrawer(true); }
      else if (megaOpen()) { e.preventDefault(); closeMega(); megaBtn.focus(); }
      return;
    }
    if (e.key !== "Tab" || !isOpen()) return;
    var items = Array.prototype.filter.call(drawer.querySelectorAll(FOCUSABLE), function (el) { return el.offsetParent !== null; });
    /* döngü: drawer öğeleri + hamburger (kapatma düğmesi) */
    items.unshift(burger);
    var first = items[0], last = items[items.length - 1];
    if (!drawer.contains(document.activeElement) && document.activeElement !== burger) { e.preventDefault(); items[1] ? items[1].focus() : first.focus(); return; }
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* masaüstüne geçilirse drawer'ı kapat, mobile geçilirse mega'yı kapat */
  var onChange = function () { if (desktop.matches) closeDrawer(false); else closeMega(); };
  if (desktop.addEventListener) desktop.addEventListener("change", onChange); else desktop.addListener(onChange);
})();
