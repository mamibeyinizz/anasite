/* Context nav — yalnızca anasayfa modül bölgesi ([data-qrmo-home-mod-zone]). index.html, global/inject.mjs marker bloğunun dışında yükler. */
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

  var activeKey = null;
  var userHorizLock = false;
  var programmaticHoriz = false;
  var zoneObserver = null;
  var sectionObserver = null;

  function ghHeight() {
    var gh = document.querySelector("[data-qrmo-gh]");
    if (gh) {
      return Math.ceil(gh.getBoundingClientRect().height);
    }
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--qrmo-gh-h")) || 76;
  }

  function ctxHeight() {
    return parseFloat(getComputedStyle(document.body).getPropertyValue("--qrmo-mod-ctx-h")) || 42;
  }

  function offsetTop() {
    return ghHeight() + ctxHeight() + 10;
  }

  function syncStickyTop() {
    document.documentElement.style.setProperty("--qrmo-mod-ctx-sticky-top", ghHeight() + "px");
  }

  function setZoneLive(on) {
    nav.classList.toggle("is-zone-live", on);
    nav.setAttribute("aria-hidden", on ? "false" : "true");
  }

  function resolveActiveKey() {
    if (!nav.classList.contains("is-zone-live")) return null;
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
    return best ? best.key : null;
  }

  function linkVisibleInScroller(link) {
    if (!scroller || !link) return true;
    var pad = 8;
    var s = scroller.getBoundingClientRect();
    var l = link.getBoundingClientRect();
    return l.left >= s.left + pad - 0.5 && l.right <= s.right - pad + 0.5;
  }

  function repositionActiveLink() {
    var active = nav.querySelector(".qrmo-mod-ctx-link.is-active");
    if (!active || !scroller) return;
    if (linkVisibleInScroller(active)) return;

    var scrollerRect = scroller.getBoundingClientRect();
    var linkRect = active.getBoundingClientRect();
    var pad = 12;
    var next = scroller.scrollLeft;

    if (linkRect.left < scrollerRect.left + pad) {
      next -= scrollerRect.left + pad - linkRect.left;
    } else if (linkRect.right > scrollerRect.right - pad) {
      next += linkRect.right - (scrollerRect.right - pad);
    } else {
      return;
    }

    programmaticHoriz = true;
    scroller.scrollLeft = Math.max(0, Math.round(next));
    programmaticHoriz = false;
  }

  function applyActiveClasses(key) {
    links.forEach(function (a) {
      var on = Boolean(key) && a.getAttribute("data-qrmo-mod-ctx-link") === key;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }

  function commitActiveKey(key, allowReposition) {
    if (key === activeKey) return;

    var moduleChanged = activeKey !== null && key !== null && key !== activeKey;
    activeKey = key;
    applyActiveClasses(key);

    if (!key) return;

    if (moduleChanged || allowReposition) {
      userHorizLock = false;
    }
    if (!userHorizLock) {
      repositionActiveLink();
    }
  }

  function pickActive() {
    var nextKey = resolveActiveKey();
    if (nextKey === activeKey) return;
    commitActiveKey(nextKey, false);
  }

  function scrollToTarget(el) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  if (scroller) {
    scroller.addEventListener(
      "scroll",
      function () {
        if (programmaticHoriz) return;
        userHorizLock = true;
      },
      { passive: true }
    );
  }

  links.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var el = document.getElementById(href.slice(1));
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      userHorizLock = false;
      commitActiveKey(a.getAttribute("data-qrmo-mod-ctx-link"), true);
      if (typeof history !== "undefined" && history.pushState) {
        history.pushState(null, "", href);
      } else {
        location.hash = href.slice(1);
      }
    });
  });

  function bindSectionObserver() {
    if (sectionObserver) sectionObserver.disconnect();
    if (!("IntersectionObserver" in window)) return;
    sectionObserver = new IntersectionObserver(
      function () {
        pickActive();
      },
      { root: null, rootMargin: "-" + offsetTop() + "px 0px -55% 0px", threshold: [0, 0.12, 0.35] }
    );
    pairs.forEach(function (p) {
      sectionObserver.observe(p.el);
    });
  }

  function bindZoneObserver() {
    if (zoneObserver) zoneObserver.disconnect();
    if (!("IntersectionObserver" in window)) return;
    zoneObserver = new IntersectionObserver(
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
  }

  syncStickyTop();
  bindZoneObserver();
  bindSectionObserver();

  var resizeRaf = 0;
  window.addEventListener(
    "resize",
    function () {
      if (resizeRaf) return;
      resizeRaf = window.requestAnimationFrame(function () {
        resizeRaf = 0;
        syncStickyTop();
        bindZoneObserver();
        bindSectionObserver();
        pickActive();
      });
    },
    { passive: true }
  );

  window.addEventListener("orientationchange", function () {
    window.setTimeout(function () {
      syncStickyTop();
      bindZoneObserver();
      bindSectionObserver();
      pickActive();
    }, 120);
  });

  window.addEventListener("scroll", pickActive, { passive: true });
  nav.setAttribute("aria-hidden", "true");
  pickActive();
})();
