/* Section Story V3 — opt-in scene change for S3–S8.
   Query: ?story=v3  enable   |  ?story=off  force disable  |  ?storydebug=1
   Native scroll stays free until a Story transition actually commits.
   preventDefault only from that commit through the animated run.
   Latch: Story may commit only if the gesture STARTED near a section edge
   AND a neighbor exists in that direction. Latch never blocks native scroll.
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

  var PROBE = [
    ".qrmo-translation-v3-eyebrow",
    ".qrmo-smart-filter-kicker",
    ".qrmo-chatbot-feature__kicker",
    ".qrmo-tables-v5__eyebrow",
    ".qrmo-service-v2__eyebrow",
    ".qrmo-analytics-v3__eyebrow"
  ];

  var html = document.documentElement;
  var params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch (e) {
    params = { get: function () { return null; } };
  }

  var storyParam = params.get("story");
  if (storyParam === "v3") html.classList.add("qrmo-mod-story-v3");
  if (storyParam === "off") html.classList.remove("qrmo-mod-story-v3");
  if (!html.classList.contains("qrmo-mod-story-v3")) return;

  var debug = params.get("storydebug") === "1";
  var reduceMq = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false, addEventListener: function () {} };

  var els = [];
  var busy = false;
  var raf = 0;
  var skipUntil = 0;
  var cooldownUntil = 0;
  var gestureAcc = 0;
  var gestureDir = 0;
  var gestureFired = false;
  var latchSet = false;
  var latchNext = false;
  var latchPrev = false;
  var latchIndex = 0;
  var startedDuringBusy = false;
  var pointerDown = false;
  var pinDest = null;
  var touchY = 0;
  var touchAcc = 0;

  var WHEEL_COMMIT = 92;
  var TOUCH_COMMIT = 78;
  var TALL_EXTRA = 350;
  var EDGE = 72;
  var DUR = 700;
  var COOLDOWN = 120;
  var SKIP_MS = 2000;
  var OPTICAL = 12;

  function now() {
    return Date.now();
  }

  function y() {
    return window.pageYOffset || html.scrollTop || 0;
  }

  function vh() {
    return window.innerHeight || html.clientHeight || 800;
  }

  function reduced() {
    return !!(reduceMq && reduceMq.matches);
  }

  function skipping() {
    return now() < skipUntil;
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

  function chromeFor(index) {
    if (index === 0) return 0;
    return Math.round(ghPx() + ctxPx() + 8);
  }

  function collect() {
    els = IDS.map(function (id, index) {
      return { id: id, el: document.getElementById(id), index: index };
    }).filter(function (s) {
      return s.el;
    });
  }

  function alignY() {
    return Math.round(ghPx() + ctxPx());
  }

  function inStoryBand() {
    if (!els.length) return false;
    var line = alignY() + 24;
    var first = els[0].el.getBoundingClientRect();
    var last = els[els.length - 1].el.getBoundingClientRect();
    return first.top <= line && last.bottom > line;
  }

  function probeEl(s) {
    if (!s || !s.el) return null;
    var sel = PROBE[s.index];
    return sel ? s.el.querySelector(sel) : null;
  }

  function currentIndex() {
    var line = alignY() + 24;
    var i;
    for (i = 0; i < els.length; i++) {
      var r = els[i].el.getBoundingClientRect();
      if (r.top <= line && r.bottom > line + 48) return i;
    }
    var best = 0;
    var bestAbs = Infinity;
    for (i = 0; i < els.length; i++) {
      var d = els[i].el.getBoundingClientRect().top - chromeFor(i);
      var ad = d < 0 ? -d : d;
      if (ad < bestAbs) {
        bestAbs = ad;
        best = i;
      }
    }
    return best;
  }

  function isTall(s) {
    return s.el.getBoundingClientRect().height > vh() + TALL_EXTRA;
  }

  function atBottomEdge(s) {
    var r = s.el.getBoundingClientRect();
    return r.bottom - vh() < EDGE;
  }

  function atTopEdge(s) {
    var ch = chromeFor(s.index);
    var probe = probeEl(s);
    var top = (probe || s.el).getBoundingClientRect().top;
    var dist = top - ch;
    /* Optical kicker may sit below the section top; still "start" until
       EDGE px have been read past the sticky align line. */
    return dist < EDGE && dist > -(EDGE + 48);
  }

  function canAdvance(s, dir) {
    if (!s) return false;
    var j = s.index + dir;
    if (j < 0 || j >= els.length) return false;
    if (!isTall(s)) return true;
    return dir > 0 ? atBottomEdge(s) : atTopEdge(s);
  }

  function targetTop(s) {
    var ch = chromeFor(s.index);
    var probe = s.index === 0 ? null : probeEl(s);
    var el = probe || s.el;
    var dest = Math.round(el.getBoundingClientRect().top + y() - ch - (probe ? OPTICAL : 0));
    return dest < 0 ? 0 : dest;
  }

  function ease(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function clearScene() {
    els.forEach(function (s) {
      s.el.classList.remove(
        "qrmo-story-v3-from",
        "qrmo-story-v3-to",
        "is-out-next",
        "is-out-prev",
        "is-prep-next",
        "is-prep-prev",
        "is-in"
      );
    });
    html.classList.remove("qrmo-mod-story-v3--busy");
  }

  function finishIdle() {
    busy = false;
    raf = 0;
    window.scrollTo(0, run.dest);
    pinDest = run.dest;
    clearScene();
    cooldownUntil = now() + COOLDOWN;
    lastHud();
  }

  var run = {
    from: null,
    to: null,
    start: 0,
    dest: 0,
    t0: 0,
    dir: 1
  };

  function frame(ts) {
    if (!busy) return;
    var p = Math.min(1, (ts - run.t0) / DUR);
    var e = ease(p);
    window.scrollTo(0, Math.round(run.start + (run.dest - run.start) * e));
    if (p < 1) {
      raf = window.requestAnimationFrame(frame);
    } else {
      window.scrollTo(0, run.dest);
      finishIdle();
    }
  }

  function cancelRun() {
    if (raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function startRun(from, to, dir) {
    cancelRun();
    clearScene();
    busy = true;
    pinDest = null;
    html.classList.add("qrmo-mod-story-v3--busy");
    run.from = from;
    run.to = to;
    run.dir = dir;
    run.start = y();
    run.dest = targetTop(to);
    run.t0 = window.performance && performance.now ? performance.now() : now();

    from.el.classList.add("qrmo-story-v3-from");
    to.el.classList.add("qrmo-story-v3-to");
    to.el.classList.add(dir > 0 ? "is-prep-next" : "is-prep-prev");
    void to.el.offsetWidth;

    window.requestAnimationFrame(function () {
      if (!busy) return;
      from.el.classList.add(dir > 0 ? "is-out-next" : "is-out-prev");
      to.el.classList.remove("is-prep-next", "is-prep-prev");
      to.el.classList.add("is-in");
      window.setTimeout(function () {
        if (!busy) return;
        run.t0 = window.performance && performance.now ? performance.now() : now();
        raf = window.requestAnimationFrame(frame);
      }, 40);
    });
  }

  function tryCommit(dir) {
    if (reduced()) return false;
    if (skipping()) return false;
    if (busy) return false;
    if (now() < cooldownUntil) return false;
    if (startedDuringBusy) return false;
    if (gestureFired) return false;
    var i = latchSet ? latchIndex : currentIndex();
    var cur = els[i];
    if (!cur) return false;
    if (!canAdvance(cur, dir)) return false;
    var j = i + dir;
    if (j < 0 || j >= els.length) return false;
    gestureFired = true;
    startRun(cur, els[j], dir);
    return true;
  }

  function resetGesture() {
    gestureAcc = 0;
    gestureDir = 0;
    gestureFired = false;
    latchSet = false;
    latchNext = false;
    latchPrev = false;
  }

  function armLatch() {
    if (latchSet) return;
    var i = currentIndex();
    var cur = els[i];
    latchIndex = i;
    latchNext = !!(cur && canAdvance(cur, 1));
    latchPrev = !!(cur && canAdvance(cur, -1));
    latchSet = true;
  }

  function latchAllows(dir) {
    if (!latchSet) return false;
    if (dir > 0) return latchNext;
    if (dir < 0) return latchPrev;
    return false;
  }

  function noteGesture(dir, mag) {
    if (dir && dir !== gestureDir) {
      gestureAcc = 0;
      gestureDir = dir;
    }
    if (!gestureDir) gestureDir = dir;
    gestureAcc += mag;
  }

  function holdPin(e) {
    if (pinDest == null) return false;
    window.scrollTo(0, pinDest);
    if (e && e.cancelable) e.preventDefault();
    return true;
  }

  function wheelDelta(e) {
    var d = e.deltaY;
    if (e.deltaMode === 1) d *= 16;
    if (e.deltaMode === 2) d *= vh();
    return d;
  }

  function onWheel(e) {
    if (reduced()) return;
    if (skipping()) return;
    if (!els.length) return;
    if (busy) {
      e.preventDefault();
      return;
    }
    if (!inStoryBand()) return;
    var d = wheelDelta(e);
    if (!d) return;
    var dir = d > 0 ? 1 : -1;
    if (!pointerDown) {
      pointerDown = true;
      startedDuringBusy = now() < cooldownUntil;
      if (!startedDuringBusy) {
        resetGesture();
        armLatch();
      }
    }
    noteGesture(dir, d < 0 ? -d : d);
    if (startedDuringBusy) {
      holdPin(e);
      return;
    }
    if (!latchAllows(dir)) return;
    if (gestureFired) return;
    if (gestureAcc >= WHEEL_COMMIT) {
      if (tryCommit(dir) && e.cancelable) e.preventDefault();
    }
  }

  function endWheelGesture() {
    pointerDown = false;
    startedDuringBusy = false;
    pinDest = null;
    resetGesture();
  }

  var wheelIdle = 0;
  function onWheelIdleReset() {
    window.clearTimeout(wheelIdle);
    wheelIdle = window.setTimeout(endWheelGesture, 140);
  }

  function onTouchStart(e) {
    if (reduced() || !e.touches || !e.touches.length) return;
    pointerDown = true;
    touchY = e.touches[0].clientY;
    touchAcc = 0;
    if (skipping()) {
      startedDuringBusy = true;
      pinDest = null;
      return;
    }
    resetGesture();
    if (busy) {
      startedDuringBusy = true;
      return;
    }
    startedDuringBusy = false;
    pinDest = null;
    if (!inStoryBand()) return;
    armLatch();
  }

  function onTouchMove(e) {
    if (reduced() || !e.touches || !e.touches.length) return;
    if (skipping()) return;
    if (busy) {
      if (e.cancelable) e.preventDefault();
      return;
    }
    if (!inStoryBand()) return;
    var cy = e.touches[0].clientY;
    var dy = touchY - cy;
    touchY = cy;
    var dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
    if (!dir) return;
    touchAcc += dy < 0 ? -dy : dy;
    noteGesture(dir, dy < 0 ? -dy : dy);

    if (startedDuringBusy) {
      holdPin(e);
      return;
    }
    if (!latchAllows(dir)) return;
    if (gestureFired) return;
    if (gestureAcc >= TOUCH_COMMIT) {
      if (tryCommit(dir) && e.cancelable) e.preventDefault();
    }
  }

  function onTouchEnd() {
    if (
      pointerDown &&
      !busy &&
      !skipping() &&
      !startedDuringBusy &&
      !gestureFired &&
      latchSet &&
      latchAllows(gestureDir) &&
      gestureAcc >= TOUCH_COMMIT
    ) {
      tryCommit(gestureDir);
    }
    pointerDown = false;
    startedDuringBusy = false;
    pinDest = null;
    resetGesture();
  }

  function skipStory() {
    skipUntil = now() + SKIP_MS;
    pointerDown = false;
    startedDuringBusy = true;
    pinDest = null;
    resetGesture();
    if (busy) {
      cancelRun();
      busy = false;
      raf = 0;
      clearScene();
    }
  }

  function lastHud() {
    if (!debug) return;
    hud();
  }

  function hud() {
    if (!debug) return;
    var box = document.getElementById("qrmo-mod-story-v3-hud");
    if (!box) {
      box = document.createElement("div");
      box.id = "qrmo-mod-story-v3-hud";
      box.style.cssText =
        "position:fixed;left:8px;bottom:8px;z-index:99999;max-width:280px;" +
        "padding:8px 10px;border-radius:8px;background:#0D2B22;color:#F4F1E8;" +
        "font:11px/1.35 ui-monospace,monospace;pointer-events:none;" +
        "box-shadow:0 8px 24px rgba(13,43,34,.28);white-space:pre";
      document.body.appendChild(box);
    }
    var i = els.length ? currentIndex() : -1;
    var cur = i >= 0 ? els[i] : null;
    var lines = [
      "STORY V3 " + window.innerWidth + "×" + vh(),
      "busy=" + (busy ? "1" : "0") + " acc=" + Math.round(gestureAcc),
      "idx=" + (i < 0 ? "-" : "S" + (i + 3)) +
        (cur && isTall(cur) ? " TALL" : "") +
        (cur && canAdvance(cur, 1) ? " nextOK" : "") +
        (cur && canAdvance(cur, -1) ? " prevOK" : "")
    ];
    box.textContent = lines.join("\n");
  }

  function onAnchorPointer(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var a = t.closest("[data-qrmo-mod-ctx-link], a[href^='#qrmo-']");
    if (a) skipStory();
  }

  function boot() {
    collect();
    if (!els.length) return;

    window.addEventListener("wheel", function (e) {
      onWheel(e);
      onWheelIdleReset();
    }, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    window.addEventListener("hashchange", skipStory);
    window.addEventListener("popstate", skipStory);
    window.addEventListener(
      "resize",
      function () {
        collect();
      },
      { passive: true }
    );

    document.addEventListener("pointerdown", onAnchorPointer, true);
    document.addEventListener("click", onAnchorPointer, true);

    if (location.hash) skipStory();

    if (debug) {
      window.addEventListener("scroll", hud, { passive: true });
      hud();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
