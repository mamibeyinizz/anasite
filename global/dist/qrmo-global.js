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
