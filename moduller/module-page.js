/* Context nav — yalnızca anasayfa modül bölgesi ([data-qrmo-home-mod-zone]). */
(function () {
  var nav = document.querySelector("[data-qrmo-mod-ctx]");
  if (!nav || !document.body.classList.contains("qrmo-home-ctx")) return;

  var zone = document.querySelector("[data-qrmo-home-mod-zone]");
  if (!zone) return;

  var scroller = nav.querySelector("[data-qrmo-mod-ctx-scroll]");
  var links = Array.prototype.slice.call(nav.querySelectorAll("[data-qrmo-mod-ctx-link]"));
  if (!links.length) return;

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

  function ghHeight() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--qrmo-gh-h")) || 76;
  }

  function ctxHeight() {
    return parseFloat(getComputedStyle(document.body).getPropertyValue("--qrmo-mod-ctx-h")) || 42;
  }

  function offsetTop() {
    return ghHeight() + ctxHeight() + 10;
  }

  function setZoneLive(on) {
    nav.hidden = !on;
    nav.classList.toggle("is-zone-live", on);
  }

  function scrollActiveIntoView() {
    var active = nav.querySelector(".qrmo-mod-ctx-link.is-active");
    if (!active || !scroller) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var scrollerRect = scroller.getBoundingClientRect();
    var linkRect = active.getBoundingClientRect();
    var pad = 12;
    if (linkRect.left < scrollerRect.left + pad) {
      scroller.scrollLeft -= scrollerRect.left + pad - linkRect.left;
    } else if (linkRect.right > scrollerRect.right - pad) {
      scroller.scrollLeft += linkRect.right - (scrollerRect.right - pad);
    } else if (typeof active.scrollIntoView === "function") {
      active.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        inline: "center",
        block: "nearest"
      });
    }
  }

  function setActive(key) {
    links.forEach(function (a) {
      var on = Boolean(key) && a.getAttribute("data-qrmo-mod-ctx-link") === key;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
    if (key) scrollActiveIntoView();
  }

  function pickActive() {
    if (nav.hidden) {
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
    var zoneObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          setZoneLive(entry.isIntersecting);
          pickActive();
        });
      },
      {
        root: null,
        rootMargin: "-" + ghHeight() + "px 0px 0px 0px",
        threshold: [0, 0.01]
      }
    );
    zoneObserver.observe(zone);

    var sectionObserver = new IntersectionObserver(
      function () {
        pickActive();
      },
      { root: null, rootMargin: "-" + offsetTop() + "px 0px -55% 0px", threshold: [0, 0.12, 0.35] }
    );
    pairs.forEach(function (p) {
      sectionObserver.observe(p.el);
    });

    window.addEventListener(
      "resize",
      function () {
        sectionObserver.disconnect();
        pairs.forEach(function (p) {
          sectionObserver.observe(p.el);
        });
        pickActive();
      },
      { passive: true }
    );
  }

  window.addEventListener("scroll", pickActive, { passive: true });
  pickActive();
})();
