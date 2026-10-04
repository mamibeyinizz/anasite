/* Section Landing V3 — opt-in, one-shot idle align for S3–S8.
   No preventDefault on wheel/touch/pointer. No scroll lock.
   No scrollTop writes while the user is actively scrolling.
   Query:
     ?landing=v3        enable
     ?landing=off       force disable
     ?landingdebug=1    HUD
*/
(function () {
  var IDS = [
    "qrmo-translation-v3-root",
    "qrmo-home-filtre",
    "qrmo-home-asistan",
    "qrmo-home-masa",
    "qrmo-home-servis",
    "qrmo-home-icgoru"
  ];

  var html = document.documentElement;
  var params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch (e) {
    params = { get: function () { return null; } };
  }

  var landingParam = params.get("landing");
  if (landingParam === "v3") html.classList.add("qrmo-mod-landing-v3");
  if (landingParam === "off") html.classList.remove("qrmo-mod-landing-v3");
  if (!html.classList.contains("qrmo-mod-landing-v3")) return;

  var debug = params.get("landingdebug") === "1";
  var reduceMq = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  var els = [];
  var landed = Object.create(null);
  var lastY = 0;
  var dir = 1;
  var gestureStartY = 0;
  var gestureStartT = 0;
  var gestureTravel = 0;
  var lastTickAbs = 0;
  var lastScrollAt = 0;
  var lastIntentAt = 0;
  var ticking = false;
  var idleTimer = 0;
  var landing = false;
  var landRaf = 0;
  var anchorLock = false;
  var cooldownUntil = 0;
  var candidateId = null;
  var io = null;

  var IDLE_MS = 200;
  var MIN_DELTA = 12;
  var MICRO_PX = 64;
  var COOLDOWN_MS = 160;

  function now() {
    return Date.now();
  }

  function y() {
    return window.pageYOffset || html.scrollTop || 0;
  }

  function vh() {
    return window.innerHeight || html.clientHeight || 800;
  }

  function ghPx() {
    var token = parseFloat(
      getComputedStyle(html).getPropertyValue("--qrmo-home-gh-scroll")
    );
    if (token > 0) return token;
    var gh = document.querySelector("[data-qrmo-gh]");
    if (gh) return Math.ceil(gh.getBoundingClientRect().height);
    return parseFloat(getComputedStyle(html).getPropertyValue("--qrmo-gh-h")) || 76;
  }

  function ctxPx() {
    var token = parseFloat(
      getComputedStyle(document.body).getPropertyValue("--qrmo-mod-ctx-h")
    );
    return token > 0 ? token : 42;
  }

  /* S3 is a 100vh stage with internal --qt-chrome padding: align to 0.
     S4–S8 titles sit at the section top: align below header + context-nav. */
  function chromeFor(index) {
    if (index === 0) return 0;
    return Math.round(ghPx() + ctxPx() + 8);
  }

  function band() {
    return MICRO_PX;
  }

  /* Large flick / fast travel must never idle-land.
     Slow section approach (lots of pixels over a long dt) still may. */
  function largeGesture() {
    if (lastTickAbs >= 480) return true;
    var dt = lastScrollAt - gestureStartT;
    if (dt <= 0) return false;
    var speed = gestureTravel / dt;
    if (gestureTravel > 200 && dt < 160 && speed > 2.4) return true;
    if (gestureTravel > Math.max(480, vh() * 0.45) && speed > 3.5) return true;
    return false;
  }

  function reduced() {
    return !!(reduceMq && reduceMq.matches);
  }

  function collect() {
    els = IDS.map(function (id, index) {
      return { id: id, el: document.getElementById(id), index: index };
    }).filter(function (s) {
      return s.el;
    });
  }

  function cancelLanding() {
    landing = false;
    if (landRaf) {
      window.cancelAnimationFrame(landRaf);
      landRaf = 0;
    }
  }

  function landTo(dest, id) {
    var start = y();
    var dist = dest - start;
    if (Math.abs(dist) < MIN_DELTA) {
      if (id) landed[id] = true;
      candidateId = null;
      return;
    }
    cancelLanding();
    landing = true;
    var t0 = window.performance && performance.now ? performance.now() : now();
    var dur = Math.min(260, 90 + Math.abs(dist) * 0.32);
    function step(ts) {
      if (!landing) return;
      var p = Math.min(1, (ts - t0) / dur);
      p = 1 - (1 - p) * (1 - p);
      window.scrollTo(0, Math.round(start + dist * p));
      if (p < 1) {
        landRaf = window.requestAnimationFrame(step);
      } else {
        landing = false;
        landRaf = 0;
        lastY = y();
        lastIntentAt = 0;
        candidateId = null;
      }
    }
    landRaf = window.requestAnimationFrame(step);
  }

  function markAnchor() {
    anchorLock = true;
    candidateId = null;
    cancelLanding();
    els.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh()) landed[s.id] = true;
    });
  }

  function targetTop(s) {
    return Math.round(s.el.getBoundingClientRect().top + y() - chromeFor(s.index));
  }

  /* Near-boundary candidate in the current travel direction.
     Down: section start approaching the align line from below.
     Up: section start approaching the align line from above.
     Never pick a section the user is already reading through. */
  function nearestCandidate() {
    var approach = band();
    var best = null;
    var bestAbs = Infinity;
    for (var i = 0; i < els.length; i++) {
      var s = els[i];
      if (landed[s.id]) continue;
      var dist = s.el.getBoundingClientRect().top - chromeFor(s.index);
      if (dir > 0 && dist < 0) continue;
      if (dir < 0 && dist > 0) continue;
      if (dist > approach || dist < -approach) continue;
      var ad = dist < 0 ? -dist : dist;
      if (ad < bestAbs) {
        bestAbs = ad;
        best = s;
      }
    }
    return best;
  }

  function tryLand() {
    if (reduced()) return;
    if (anchorLock) return;
    if (landing) return;
    if (!lastIntentAt) return;
    if (now() < cooldownUntil) return;
    if (largeGesture()) {
      candidateId = null;
      return;
    }

    var best = null;
    if (candidateId) {
      for (var i = 0; i < els.length; i++) {
        if (els[i].id === candidateId) {
          best = els[i];
          break;
        }
      }
    }
    if (!best) best = nearestCandidate();
    if (!best || landed[best.id]) {
      candidateId = null;
      return;
    }

    var dist = best.el.getBoundingClientRect().top - chromeFor(best.index);
    var approach = band();
    if (dir > 0 && dist < 0) {
      candidateId = null;
      return;
    }
    if (dir < 0 && dist > 0) {
      candidateId = null;
      return;
    }
    if (dist > approach || dist < -approach) {
      candidateId = null;
      return;
    }
    var ad = dist < 0 ? -dist : dist;
    if (ad < MIN_DELTA) {
      landed[best.id] = true;
      candidateId = null;
      return;
    }
    if (ad > MICRO_PX) {
      candidateId = null;
      return;
    }

    var dest = targetTop(best);
    if (dest < 0) dest = 0;
    landed[best.id] = true;
    cooldownUntil = now() + COOLDOWN_MS;
    landTo(dest, best.id);
  }

  function onIdle() {
    idleTimer = 0;
    if (landing) return;
    if (anchorLock) return;
    if (!lastIntentAt) return;
    if (now() - lastIntentAt < IDLE_MS - 20) return;
    if (now() - lastScrollAt < IDLE_MS - 20) return;
    tryLand();
  }

  function scheduleIdle() {
    if (landing) return;
    if (idleTimer) window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(onIdle, IDLE_MS);
  }

  function sample() {
    ticking = false;
    var cur = y();
    if (landing) {
      lastY = cur;
      return;
    }
    var dy = cur - lastY;
    if (dy > 0) dir = 1;
    else if (dy < 0) dir = -1;
    if (now() - lastScrollAt > 220) {
      gestureStartY = lastY;
      gestureStartT = now();
      gestureTravel = 0;
      lastTickAbs = 0;
    }
    gestureTravel = Math.max(gestureTravel, Math.abs(cur - gestureStartY));
    lastY = cur;
    lastScrollAt = now();
    if (lastIntentAt) {
      var near = nearestCandidate();
      if (near) candidateId = near.id;
    }
    scheduleIdle();
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(sample);
  }

  function onScrollIntent() {
    lastIntentAt = now();
    if (anchorLock) anchorLock = false;
    if (landing) cancelLanding();
    lastScrollAt = now();
    if (idleTimer) {
      window.clearTimeout(idleTimer);
      idleTimer = 0;
    }
    scheduleIdle();
  }

  function onPointerCancel() {
    if (landing) cancelLanding();
  }

  function hud() {
    if (!debug) return;
    var box = document.getElementById("qrmo-mod-landing-v3-hud");
    if (!box) {
      box = document.createElement("div");
      box.id = "qrmo-mod-landing-v3-hud";
      box.style.cssText =
        "position:fixed;right:8px;bottom:8px;z-index:99999;max-width:280px;" +
        "padding:8px 10px;border-radius:8px;background:#0D2B22;color:#F4F1E8;" +
        "font:11px/1.35 ui-monospace,monospace;pointer-events:none;" +
        "box-shadow:0 8px 24px rgba(13,43,34,.28);white-space:pre";
      document.body.appendChild(box);
    }
    var lines = [
      "LANDING V3 " + window.innerWidth + "×" + vh(),
      "dir=" + (dir > 0 ? "down" : "up") + " travel=" + Math.round(gestureTravel) +
        (largeGesture() ? " FAST" : ""),
      "lock=" + (anchorLock ? "a" : "-") + " land=" + (landing ? "1" : "0") +
        " cand=" + (candidateId ? candidateId.slice(10, 18) : "-")
    ];
    els.forEach(function (s, i) {
      var r = s.el.getBoundingClientRect();
      lines.push(
        "S" + (i + 3) + " t=" + Math.round(r.top) +
          (landed[s.id] ? " L" : "")
      );
    });
    box.textContent = lines.join("\n");
  }

  function boot() {
    collect();
    if (!els.length) return;
    lastY = y();
    gestureStartY = lastY;
    gestureStartT = now();

    if (location.hash) markAnchor();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", function (e) {
      lastTickAbs = Math.abs(e.deltaY) || 0;
      onScrollIntent();
    }, { passive: true });
    window.addEventListener("touchstart", onScrollIntent, { passive: true });
    window.addEventListener("pointerdown", onPointerCancel, { passive: true });
    if ("onscrollend" in window) {
      window.addEventListener("scrollend", function () {
        if (landing) return;
        if (debug) hud();
        scheduleIdle();
      }, { passive: true });
    }

    window.addEventListener("hashchange", markAnchor);
    window.addEventListener(
      "resize",
      function () {
        collect();
      },
      { passive: true }
    );

    document.addEventListener(
      "click",
      function (e) {
        var a = e.target && e.target.closest
          ? e.target.closest("[data-qrmo-mod-ctx-link], a[href^='#qrmo-']")
          : null;
        if (a) markAnchor();
      },
      true
    );

    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) landed[entry.target.id] = false;
          });
        },
        { root: null, threshold: 0 }
      );
      els.forEach(function (s) {
        io.observe(s.el);
      });
    }

    if (debug) {
      window.addEventListener("scrollend", hud, { passive: true });
      hud();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
