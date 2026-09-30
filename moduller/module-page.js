/* Context nav — modül detay + anasayfa ([data-qrmo-mod-ctx]). */
(function () {
  var nav = document.querySelector("[data-qrmo-mod-ctx]");
  if (!nav) return;

  var links = Array.prototype.slice.call(nav.querySelectorAll("[data-qrmo-mod-ctx-link]"));
  if (!links.length) return;

  var hero =
    document.querySelector(".qrmo-mod-hero") ||
    document.getElementById("icerik");

  var pairs = links
    .map(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return null;
      var el = document.getElementById(href.slice(1));
      if (!el) return null;
      return { link: a, el: el, key: a.getAttribute("data-qrmo-mod-ctx-link") };
    })
    .filter(Boolean);

  if (!pairs.length) return;

  function offsetTop() {
    var root = document.documentElement;
    var gh = parseFloat(getComputedStyle(root).getPropertyValue("--qrmo-gh-h")) || 76;
    var ctxHost = document.body;
    var ctx = parseFloat(getComputedStyle(ctxHost).getPropertyValue("--qrmo-mod-ctx-h")) || 48;
    return gh + ctx + 10;
  }

  function setActive(key) {
    links.forEach(function (a) {
      var on = Boolean(key) && a.getAttribute("data-qrmo-mod-ctx-link") === key;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }

  function heroCoversNavZone() {
    if (!hero) return false;
    var line = offsetTop();
    var r = hero.getBoundingClientRect();
    return r.bottom > line + 8;
  }

  function pickActive() {
    if (heroCoversNavZone()) {
      setActive(null);
      return;
    }
    var line = offsetTop();
    var best = null;
    var bestTop = -Infinity;
    pairs.forEach(function (p) {
      var top = p.el.getBoundingClientRect().top;
      if (top <= line + 4 && top > bestTop) {
        bestTop = top;
        best = p;
      }
    });
    if (!best) {
      best = pairs.find(function (p) {
        var r = p.el.getBoundingClientRect();
        return r.bottom > line && r.top < window.innerHeight;
      });
    }
    setActive(best ? best.key : null);
  }

  function scrollToTarget(el) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      if (typeof history !== "undefined" && history.pushState) {
        history.pushState(null, "", href);
      } else {
        location.hash = href.slice(1);
      }
    });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function () {
        pickActive();
      },
      { root: null, rootMargin: "-" + offsetTop() + "px 0px -58% 0px", threshold: [0, 0.12, 0.35] }
    );
    pairs.forEach(function (p) {
      observer.observe(p.el);
    });
    if (hero) observer.observe(hero);
    window.addEventListener(
      "resize",
      function () {
        observer.disconnect();
        pairs.forEach(function (p) {
          observer.observe(p.el);
        });
        if (hero) observer.observe(hero);
        pickActive();
      },
      { passive: true }
    );
  }

  window.addEventListener("scroll", pickActive, { passive: true });
  pickActive();
})();
