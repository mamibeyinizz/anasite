/* Modül sayfası V3 — cihaz vitrini, kaydırmalı "nasıl çalışır", giriş hareketi.
   JS yoksa: ilk ekran görünür, içerik açık kalır. Hareket azaltma: otomatik oynatma ve giriş hareketi yok. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduceMq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var reduce = reduceMq.matches;
  var DUR = 4200;

  /* ---------- Vitrin ---------- */
  function Show(el) {
    var stage = el.querySelector(".qrmo-v3-stage");
    var screens = [].slice.call(el.querySelectorAll("[data-v3-screen]"));
    var dots = [].slice.call(el.querySelectorAll("[data-v3-dot]"));
    var live = el.querySelector("[data-v3-live]");
    var mode = el.getAttribute("data-v3-show");
    var cur = Math.max(0, screens.findIndex(function (s) { return s.classList.contains("is-active"); })), timer = 0, inView = true, hold = false;

    el.setAttribute("data-count", String(screens.length));
    el.style.setProperty("--v3-dur", DUR + "ms");

    function fit() {
      var W = stage.clientWidth, H = stage.clientHeight;
      if (!W || !H) return;
      screens.forEach(function (sc) {
        var f = sc.firstElementChild;
        var nw = parseFloat(getComputedStyle(sc).getPropertyValue("--w")) || f.offsetWidth;
        var nh = f.offsetHeight;
        if (!nw || !nh) return;
        var s = Math.min(1, W / nw, H / nh);
        f.style.setProperty("--s", s.toFixed(4));
        f.style.top = Math.max(0, (H - nh * s) / 2) + "px";
      });
    }

    function caption(i) {
      var l = dots[i] && dots[i].getAttribute("aria-label");
      var k = l ? l.indexOf(": ") : -1;
      return k > -1 ? l.slice(k + 2) : "";
    }

    function go(i) {
      if (i === cur || !screens[i]) return;
      cur = i;
      screens.forEach(function (sc, n) {
        var on = n === i;
        sc.classList.toggle("is-active", on);
        if (on) sc.removeAttribute("aria-hidden"); else sc.setAttribute("aria-hidden", "true");
      });
      dots.forEach(function (d, n) {
        d.classList.toggle("is-active", n === i);
        d.setAttribute("aria-pressed", String(n === i));
      });
      if (live) live.textContent = caption(i);
    }

    function stop() { clearTimeout(timer); timer = 0; el.setAttribute("data-playing", "0"); }
    function play() {
      stop();
      if (mode !== "auto" || reduce || !inView || hold || document.hidden || screens.length < 2) return;
      el.setAttribute("data-playing", "1");
      timer = setTimeout(function () { go((cur + 1) % screens.length); play(); }, DUR);
    }

    dots.forEach(function (d, n) {
      d.addEventListener("click", function () { go(n); play(); });
    });
    el.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hold = true; stop(); } });
    el.addEventListener("pointerleave", function () { hold = false; play(); });
    el.addEventListener("focusin", function () { hold = true; stop(); });
    el.addEventListener("focusout", function () { hold = false; play(); });
    document.addEventListener("visibilitychange", play);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { inView = en[0].isIntersecting; play(); }, { threshold: 0.25 }).observe(el);
    }
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(stage); else window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

    fit();
    play();
    el.__v3 = { go: go, fit: fit };
  }

  /* ---------- Nasıl çalışır: kaydırma → ekran ---------- */
  function Flow(sec) {
    var steps = [].slice.call(sec.querySelectorAll("[data-v3-step]"));
    var show = sec.querySelector("[data-v3-show]");
    var dev = sec.querySelector(".qrmo-v3-flow-dev");
    if (!steps.length || !show) return;
    var active = -1, raf = 0;

    function set(n, fromUser) {
      if (n === active) return;
      active = n;
      steps.forEach(function (s, i) { s.classList.toggle("is-active", i === n); });
      if (show.__v3) show.__v3.go(parseInt(steps[n].getAttribute("data-v3-step"), 10) || 0);
    }

    function focusY() {
      var vh = window.innerHeight;
      var r = dev.getBoundingClientRect();
      var sticky = getComputedStyle(dev).position === "sticky";
      /* Mobilde cihaz üstte sabit: odak çizgisi cihazın altındaki alanın üst üçte biri.
         Masaüstünde cihaz yanda: odak çizgisi görünümün ortası. */
      return window.matchMedia("(min-width: 768px)").matches || !sticky ? vh * 0.5 : r.bottom + (vh - r.bottom) * 0.33;
    }

    function update() {
      raf = 0;
      var y = focusY(), best = 0, bd = Infinity;
      steps.forEach(function (s, i) {
        var r = s.getBoundingClientRect();
        var d = y >= r.top && y <= r.bottom ? 0 : Math.min(Math.abs(y - r.top), Math.abs(y - r.bottom));
        if (d < bd) { bd = d; best = i; }
      });
      set(best);
    }
    function queue() { if (!raf) raf = requestAnimationFrame(update); }

    steps.forEach(function (s, i) {
      s.addEventListener("click", function () { set(i); });
      s.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(i); } });
      s.addEventListener("focus", function () { set(i); });
    });
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
  }

  /* ---------- Giriş hareketi ---------- */
  function Reveal() {
    if (reduce || !("IntersectionObserver" in window)) return;
    var sel = [
      ".qrmo-mod-sechead", ".qrmo-mod-answer-head", ".qrmo-mod-ans-facts > div", ".qrmo-mod-shift-list > li", ".qrmo-mod-pairs-list > li",
      ".qrmo-mod-caps-list > li", ".qrmo-mod-facts > div", ".qrmo-mod-rel > li", ".qrmo-mod-guides > li", ".qrmo-mod-gaps-cta", ".qrmo-v3-flow-head", ".qrmo-mod-close"
    ].join(",");
    var els = [].slice.call(document.querySelectorAll(sel));
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    var seen = new Map();
    els.forEach(function (el) {
      var p = el.parentElement, n = seen.get(p) || 0;
      seen.set(p, n + 1);
      el.style.setProperty("--v3-d", Math.min(n, 5) * 70 + "ms");
      el.classList.add("v3r");
      io.observe(el);
    });
  }

  function init() {
    [].slice.call(document.querySelectorAll("[data-v3-show]")).forEach(Show);
    [].slice.call(document.querySelectorAll("[data-v3-flow]")).forEach(Flow);
    root.classList.add("v3-ready");
    /* v3-ready sonrası ekranlar yerleşir; ölçümü bir kez daha yap */
    [].slice.call(document.querySelectorAll("[data-v3-show]")).forEach(function (s) { if (s.__v3) s.__v3.fit(); });
    Reveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
