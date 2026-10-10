/* Context nav — yalnızca anasayfa modül bölgesi ([data-qrmo-home-mod-zone]).
   Full-width infinite loop; aktif modül viewport merkezinde.
   Story V4 scroll engine'e dokunmaz. */
(function () {
  var nav = document.querySelector("[data-qrmo-mod-ctx]");
  if (!nav || !document.body.classList.contains("qrmo-home-ctx")) return;

  var zone = document.querySelector("[data-qrmo-home-mod-zone]");
  if (!zone) return;

  var scroller = nav.querySelector("[data-qrmo-mod-ctx-scroll]");
  var list = nav.querySelector(".qrmo-mod-ctx-links");
  if (!scroller || !list) return;

  var originalItems = Array.prototype.slice.call(list.children);
  if (!originalItems.length) return;

  var origLinks = originalItems
    .map(function (li) {
      return li.querySelector("[data-qrmo-mod-ctx-link]");
    })
    .filter(Boolean);
  if (!origLinks.length) return;

  var pairs = origLinks
    .map(function (a) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return null;
      var el = document.getElementById(href.slice(1));
      if (!el) return null;
      return { link: a, el: el, key: a.getAttribute("data-qrmo-mod-ctx-link") };
    })
    .filter(Boolean);
  if (!pairs.length) return;

  var cloned = false;
  var allLinks = origLinks.slice();
  var activeKey = null;
  var tx = 0;
  var animRaf = 0;
  var zoneObserver = null;
  var sectionObserver = null;
  var reduceMq = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  function ghHeight() {
    var gh = document.querySelector("[data-qrmo-gh]");
    if (gh) return Math.ceil(gh.getBoundingClientRect().height);
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

  function cloneSet(append) {
    var frag = document.createDocumentFragment();
    originalItems.forEach(function (li) {
      var copy = li.cloneNode(true);
      copy.setAttribute("data-qrmo-mod-ctx-clone", "1");
      copy.setAttribute("aria-hidden", "true");
      var a = copy.querySelector("[data-qrmo-mod-ctx-link]");
      if (a) {
        a.setAttribute("tabindex", "-1");
        a.removeAttribute("aria-current");
        a.classList.remove("is-active");
      }
      frag.appendChild(copy);
    });
    if (append) list.appendChild(frag);
    else list.insertBefore(frag, list.firstChild);
  }

  function ensureLoop() {
    if (cloned) return;
    cloneSet(false);
    cloneSet(true);
    cloned = true;
    nav.classList.add("qrmo-mod-ctx--loop");
    allLinks = Array.prototype.slice.call(nav.querySelectorAll("[data-qrmo-mod-ctx-link]"));
  }

  function setWidth() {
    var n = originalItems.length;
    if (list.children.length < n * 2) return 0;
    var a = list.children[0];
    var b = list.children[n];
    return b.offsetLeft - a.offsetLeft;
  }

  function applyTx(animate) {
    if (animate) {
      list.style.transition = reduceMq.matches
        ? "none"
        : "transform .52s cubic-bezier(.2, .7, .2, 1)";
    } else {
      list.style.transition = "none";
    }
    list.style.transform = "translate3d(" + tx + "px,0,0)";
  }

  function linksForKey(key) {
    return allLinks.filter(function (a) {
      return a.getAttribute("data-qrmo-mod-ctx-link") === key;
    });
  }

  /* Visual X, not the pending target. Mid-transition getBoundingClientRect
     is already between frames; adding the queued tx double-counts the move. */
  function currentTx() {
    var value = "none";
    try {
      value = window.getComputedStyle(list).transform;
    } catch (err) {
      value = "none";
    }
    if (!value || value === "none") return 0;
    try {
      if (typeof DOMMatrixReadOnly === "function") return new DOMMatrixReadOnly(value).m41 || 0;
      if (typeof DOMMatrix === "function") return new DOMMatrix(value).m41 || 0;
    } catch (err) {}
    var matched = String(value).match(/matrix3d\(([^)]+)\)/);
    if (!matched) matched = String(value).match(/matrix\(([^)]+)\)/);
    if (!matched) return 0;
    var parts = matched[1].split(",");
    var raw = parts.length >= 16 ? parts[12] : parts[4];
    var n = parseFloat(raw);
    return isFinite(n) ? n : 0;
  }

  function txToCenter(link) {
    var s = scroller.getBoundingClientRect();
    var l = link.getBoundingClientRect();
    var delta = s.left + s.width / 2 - (l.left + l.width / 2);
    return currentTx() + delta;
  }

  function pickTargetLink(key) {
    var cands = linksForKey(key);
    if (!cands.length) return null;
    var origin = currentTx();
    var best = cands[0];
    var bestTx = txToCenter(best);
    var bestDist = Math.abs(bestTx - origin);
    var i;
    for (i = 1; i < cands.length; i++) {
      var nextTx = txToCenter(cands[i]);
      var dist = Math.abs(nextTx - origin);
      if (dist < bestDist - 0.5) {
        best = cands[i];
        bestTx = nextTx;
        bestDist = dist;
      }
    }
    return { link: best, nextTx: bestTx };
  }

  function normalizeToMiddle() {
    var n = originalItems.length;
    var active = nav.querySelector(".qrmo-mod-ctx-link.is-active");
    if (!active) return;
    var li = active.closest("li");
    if (!li || !li.parentNode) return;
    var idx = Array.prototype.indexOf.call(list.children, li);
    if (idx < 0) return;
    var cycle = setWidth();
    if (!(cycle > 0)) return;
    if (idx < n) {
      tx -= cycle;
      applyTx(false);
    } else if (idx >= n * 2) {
      tx += cycle;
      applyTx(false);
    }
  }

  function applyActiveClasses(key, preferred) {
    var target = preferred || null;
    allLinks.forEach(function (a) {
      var on = false;
      if (key) {
        if (target) on = a === target;
        else on = a.getAttribute("data-qrmo-mod-ctx-link") === key && !a.closest("[data-qrmo-mod-ctx-clone]");
      }
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "location");
      else a.removeAttribute("aria-current");
    });
  }

  function finishCenter(key) {
    normalizeToMiddle();
    var mid = origLinks.filter(function (a) {
      return a.getAttribute("data-qrmo-mod-ctx-link") === key;
    })[0];
    if (mid) applyActiveClasses(key, mid);
    var again = pickTargetLink(key);
    if (again) {
      tx = again.nextTx;
      applyTx(false);
      applyActiveClasses(key, again.link);
    }
  }

  function centerKey(key, animate) {
    if (!key) return;
    ensureLoop();
    var pick = pickTargetLink(key);
    if (!pick) return;
    applyActiveClasses(key, pick.link);
    pick = pickTargetLink(key) || pick;
    var instant = !animate || reduceMq.matches;
    tx = pick.nextTx;
    applyTx(!instant);
    if (animRaf) {
      window.clearTimeout(animRaf);
      animRaf = 0;
    }
    if (instant) {
      finishCenter(key);
      return;
    }
    animRaf = window.setTimeout(function () {
      animRaf = 0;
      finishCenter(key);
    }, 560);
  }

  function zoneIsInView() {
    var zr = zone.getBoundingClientRect();
    return zr.bottom > ghHeight() && zr.top < window.innerHeight;
  }

  function resolveActiveKey() {
    if (!zoneIsInView()) return null;
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

  function commitActiveKey(key, allowMotion) {
    if (key === activeKey && allowMotion !== true) return;
    var changed = activeKey !== null && key !== null && key !== activeKey;
    var first = activeKey === null && key !== null;
    activeKey = key;
    if (!key) {
      applyActiveClasses(null, null);
      return;
    }
    centerKey(key, changed || allowMotion === true || first);
  }

  function pickActive() {
    var live = zoneIsInView();
    setZoneLive(live);
    var nextKey = live ? resolveActiveKey() : null;
    if (nextKey === activeKey) return;
    commitActiveKey(nextKey, false);
  }

  function scrollToTarget(el) {
    var reduce = reduceMq.matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  origLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      var href = a.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var el = document.getElementById(href.slice(1));
      if (!el) return;
      if (e.defaultPrevented) {
        commitActiveKey(a.getAttribute("data-qrmo-mod-ctx-link"), true);
        return;
      }
      e.preventDefault();
      scrollToTarget(el);
      commitActiveKey(a.getAttribute("data-qrmo-mod-ctx-link"), true);
      if (typeof history !== "undefined" && history.pushState) {
        history.pushState(null, "", href);
      } else {
        location.hash = href.slice(1);
      }
    });
  });

  nav.addEventListener("click", function (e) {
    var a = e.target && e.target.closest && e.target.closest("[data-qrmo-mod-ctx-clone] [data-qrmo-mod-ctx-link]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.charAt(0) !== "#") return;
    var el = document.getElementById(href.slice(1));
    if (!el) return;
    commitActiveKey(a.getAttribute("data-qrmo-mod-ctx-link"), true);
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

  originalItems.forEach(function (li) {
    var label = li.querySelector(".qrmo-mod-ctx-link-t");
    if (!label || label.getAttribute("data-text")) return;
    label.setAttribute("data-text", (label.textContent || "").replace(/\s+/g, " ").trim());
  });

  ensureLoop();
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
        if (activeKey) centerKey(activeKey, false);
        else pickActive();
      });
    },
    { passive: true }
  );

  window.addEventListener("orientationchange", function () {
    window.setTimeout(function () {
      syncStickyTop();
      bindZoneObserver();
      bindSectionObserver();
      if (activeKey) centerKey(activeKey, false);
      else pickActive();
    }, 120);
  });

  window.addEventListener("scroll", pickActive, { passive: true, capture: true });
  nav.setAttribute("aria-hidden", "true");
  window.requestAnimationFrame(function () {
    pickActive();
    if (activeKey) centerKey(activeKey, false);
  });
})();
