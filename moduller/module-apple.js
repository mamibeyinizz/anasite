/* Modül sayfası "ürün sahnesi" hareketleri: kelime kelime ışıyan giriş cümlesi, bölüm girişleri,
   sabit cihazın kaydırmayla büyümesi. Hareket azaltmada hiçbiri çalışmaz. JS yoksa her şey görünür. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var body = document.body;
  if (!body.classList.contains("qrmo-apple") || reduce) return;
  var vh = function () { return window.innerHeight || document.documentElement.clientHeight; };
  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };

  /* Giriş cümlesi: kelimelere böl, kaydırdıkça yak */
  var intro = document.querySelector(".qrmo-v3-intro .qrmo-v3-p");
  var words = [];
  if (intro) {
    var text = intro.textContent.trim().split(/\s+/);
    intro.setAttribute("aria-label", text.join(" "));
    intro.textContent = "";
    text.forEach(function (w, i) {
      var s = document.createElement("span");
      s.className = "ap-w";
      s.setAttribute("aria-hidden", "true");
      s.textContent = w;
      intro.appendChild(s);
      if (i < text.length - 1) intro.appendChild(document.createTextNode(" "));
      words.push(s);
    });
    body.classList.add("ap-ready");
  }

  var flowDev = document.querySelector(".qrmo-v3-flow-dev");
  var raf = 0;
  function update() {
    raf = 0;
    if (words.length) {
      var r = intro.getBoundingClientRect();
      var p = clamp((vh() * 0.82 - r.top) / (r.height + vh() * 0.32));
      var n = Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle("is-lit", i < n);
    }
    if (flowDev) {
      var f = flowDev.getBoundingClientRect();
      flowDev.style.setProperty("--ap-p", clamp((vh() - f.top) / (vh() * 0.55)).toFixed(3));
    }
  }
  function queue() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  update();

  /* Nasıl çalışır (mobil): noktaya dokununca ilgili adıma kaydır */
  var flowSec = document.querySelector(".qrmo-v3-flow");
  if (flowSec) {
    var fDots = [].slice.call(flowSec.querySelectorAll("[data-v3-dot]"));
    var fSteps = [].slice.call(flowSec.querySelectorAll("[data-v3-step]"));
    fDots.forEach(function (d, i) {
      d.addEventListener("click", function () {
        if (!window.matchMedia("(max-width: 767px)").matches) return;
        var st = fSteps.filter(function (x) { return parseInt(x.getAttribute("data-v3-step"), 10) === i; })[0];
        if (!st) return;
        var r = st.getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - vh() * 0.5, behavior: "smooth" });
      });
    });
  }

  /* Bölüm girişleri */
  if ("IntersectionObserver" in window) {
    var targets = [].slice.call(document.querySelectorAll(".qrmo-v3-head, .qrmo-v3-flow-head, .qrmo-v3-pain, .qrmo-v3-hub, .qrmo-v3-spokes > li, .qrmo-v3-sec-cta, .qrmo-v3-fcard, .qrmo-v3-faqhead, .qrmo-v3-qa, .qrmo-mod-close, .qrmo-ap-cta-panel"));
    var seen = new Map();
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) {
      var p = el.parentElement, n = seen.get(p) || 0;
      seen.set(p, n + 1);
      el.style.setProperty("--ap-d", Math.min(n, 5) * 90 + "ms");
      el.classList.add("ap-r");
      io.observe(el);
    });
  }
})();
