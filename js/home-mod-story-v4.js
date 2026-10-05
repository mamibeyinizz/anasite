/* Story V4 — production scroll authority for homepage modules S3–S8.
   One gesture commits at most one scene. Desktop: one module = one scene.
   Mobile (≤767): copy scene then demo scene. Hero, S2, and S9+ stay native.
   Kill switch: ?story=off. Debug HUD: ?storydebug=1.
   Older story/landing/snap/scrollfx controllers no-op while this class is set.
*/
(function () {
  var MODULES = [
    { id: "qrmo-translation-v3-root", key: "S3" },
    { id: "qrmo-home-filtre", key: "S4" },
    { id: "qrmo-home-asistan", key: "S5" },
    { id: "qrmo-home-masa", key: "S6" },
    { id: "qrmo-home-servis", key: "S7" },
    { id: "qrmo-home-icgoru", key: "S8" }
  ];

  var ALIGN = 80;
  var APPROACH = 0.42;
  var WHEEL_COMMIT = 14;
  var WHEEL_QUIET = 130;
  var TOUCH_ARM = 10;
  var TOUCH_COMMIT = 32;
  var DUR = 680;
  var SETTLE = 170;
  var EASE = [0.22, 0.84, 0.28, 1];

  var html = document.documentElement;
  if (!html.classList.contains("qrmo-mod-story-v4")) return;

  var params;
  try {
    params = new URLSearchParams(location.search);
  } catch (e) {
    params = { get: function () { return null; } };
  }
  var debug = params.get("storydebug") === "1";

  var reduceMq = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false, addEventListener: function () {} };
  var mobileMq = window.matchMedia
    ? window.matchMedia("(max-width: 767px)")
    : { matches: false, addEventListener: function () {} };

  var moduleById = {};
  MODULES.forEach(function (m) { moduleById[m.id] = m; });

  var scenes = [];
  var index = 0;
  var state = "IDLE";
  var raf = 0;
  var gestureCommitted = false;
  var exitLatch = false;
  var acc = 0;
  var accDir = 0;
  var originY = 0;
  var inputKind = "";
  var lastInputAt = 0;
  var quietTimer = 0;
  var wheelQuiet = false;
  var touchDown = false;
  var touchX = 0;
  var touchY = 0;
  var touchOwned = false;
  var touchHorizontal = false;
  var bypassUntil = 0;
  var layoutStamp = 0;
  var measuredStamp = -1;
  var navToken = 0;
  var pinRaf = 0;
  var pinUntil = 0;
  var pinTop = 0;

  function now() { return Date.now(); }
  function reduced() { return !!(reduceMq && reduceMq.matches); }
  function mobile() { return !!(mobileMq && mobileMq.matches); }
  function y() { return window.pageYOffset || html.scrollTop || 0; }
  function vh() { return window.innerHeight || html.clientHeight || 800; }
  function bypass() { return now() < bypassUntil || reduced(); }

  function setState(next) {
    state = next;
    html.setAttribute("data-qrmo-story-state", next);
  }

  function syncChrome() {
    var gh = parseFloat(getComputedStyle(html).getPropertyValue("--qrmo-home-gh-scroll"));
    if (!(gh > 0)) {
      var header = document.querySelector("[data-qrmo-gh]");
      gh = header ? header.getBoundingClientRect().height : (parseFloat(getComputedStyle(html).getPropertyValue("--qrmo-gh-h")) || 76);
    }
    var ctx = parseFloat(getComputedStyle(document.body).getPropertyValue("--qrmo-mod-ctx-h"));
    var nav = document.querySelector("[data-qrmo-mod-ctx]");
    if (nav) {
      var nh = nav.getBoundingClientRect().height;
      if (nh > 0) ctx = nh;
    }
    if (!(ctx > 0)) ctx = 42;
    var px = Math.round(gh + ctx);
    html.style.setProperty("--qrmo-story-chrome", px + "px");
    return px;
  }

  function build() {
    var next = [];
    MODULES.forEach(function (mod) {
      var root = document.getElementById(mod.id);
      if (!root) return;
      var copy = root.querySelector('[data-qrmo-scene="copy"]');
      var demo = root.querySelector('[data-qrmo-scene="demo"]');
      if (copy) copy.classList.add("module-scene", "module-scene--copy");
      if (demo) demo.classList.add("module-scene", "module-scene--demo");
      if (mobile()) {
        if (copy) next.push({ id: mod.key + "-copy", key: mod.key, moduleId: mod.id, el: copy, role: "copy" });
        if (demo) next.push({ id: mod.key + "-demo", key: mod.key, moduleId: mod.id, el: demo, role: "demo" });
      } else {
        next.push({ id: mod.key, key: mod.key, moduleId: mod.id, el: root, role: "module" });
      }
    });
    scenes = next;
    measuredStamp = -1;
    measure();
  }

  function measure() {
    if (!scenes.length || state === "TRANSITIONING") return;
    var top = y();
    var i;
    for (i = 0; i < scenes.length; i++) {
      var rect = scenes[i].el.getBoundingClientRect();
      scenes[i].top = Math.round(rect.top + top);
      scenes[i].height = Math.round(rect.height);
    }
    measuredStamp = layoutStamp;
  }

  function ensureMeasured() {
    if (measuredStamp !== layoutStamp) measure();
  }

  function findAligned(pos) {
    var i;
    for (i = 0; i < scenes.length; i++) {
      if (Math.abs(scenes[i].top - pos) <= ALIGN) return i;
    }
    return -1;
  }

  function nearestIndex(pos) {
    var best = 0;
    var bestD = Infinity;
    var i;
    for (i = 0; i < scenes.length; i++) {
      var d = Math.abs(scenes[i].top - pos);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return best;
  }

  function inZone(pos) {
    if (!scenes.length) return false;
    return pos >= scenes[0].top - 90 && pos <= scenes[scenes.length - 1].top + 90;
  }

  function ease(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    var cx = 3 * EASE[0];
    var bx = 3 * (EASE[2] - EASE[0]) - cx;
    var ax = 1 - cx - bx;
    var cy = 3 * EASE[1];
    var by = 3 * (EASE[3] - EASE[1]) - cy;
    var ay = 1 - cy - by;
    var u = t;
    var n;
    for (n = 0; n < 6; n++) {
      var x = ((ax * u + bx) * u + cx) * u - t;
      var dx = (3 * ax * u + 2 * bx) * u + cx;
      if (Math.abs(dx) < 1e-5) break;
      u -= x / dx;
    }
    if (u < 0) u = 0;
    if (u > 1) u = 1;
    return ((ay * u + by) * u + cy) * u;
  }

  function clearFx() {
    var i;
    for (i = 0; i < scenes.length; i++) {
      scenes[i].el.classList.remove(
        "is-story-from",
        "is-story-to",
        "is-out-next",
        "is-out-prev",
        "is-prep-next",
        "is-prep-prev",
        "is-in"
      );
    }
  }

  function cancelAnim() {
    if (raf) {
      window.cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  function paintFx(fromEl, toEl, dir) {
    if (reduced() || !fromEl || !toEl || fromEl === toEl) return;
    clearFx();
    fromEl.classList.add("is-story-from");
    toEl.classList.add("is-story-to", dir > 0 ? "is-prep-next" : "is-prep-prev");
    void toEl.offsetWidth;
    fromEl.classList.add(dir > 0 ? "is-out-next" : "is-out-prev");
    toEl.classList.remove("is-prep-next", "is-prep-prev");
    toEl.classList.add("is-in");
  }

  function finishMove(toIndex) {
    raf = 0;
    clearFx();
    var scene = scenes[toIndex];
    if (scene) {
      scene.el.style.transform = "none";
      scene.el.style.transition = "none";
      void scene.el.offsetWidth;
      var top = Math.round(scene.el.getBoundingClientRect().top + y());
      scene.el.style.transform = "";
      scene.el.style.transition = "";
      scene.top = top;
      killAndPin(top);
      index = toIndex;
      html.setAttribute("data-qrmo-story-land", String(top));
      holdPin(top);
    }
    html.classList.remove("qrmo-mod-story-v4--busy");
    if (inputKind === "touch") {
      setState(touchDown ? "LOCKED" : "IDLE");
      if (!touchDown) unlockGesture();
      return;
    }
    setState("LOCKED");
    if (wheelQuiet || now() - lastInputAt >= WHEEL_QUIET) unlockGesture();
    else armQuiet();
  }

  function animateTo(toIndex, dir, dur) {
    if (!scenes[toIndex]) return;
    stopPin();
    ensureMeasured();
    var token = ++navToken;
    var start = y();
    var dest = scenes[toIndex].top;
    var fromIndex = findAligned(start);
    if (fromIndex < 0) fromIndex = nearestIndex(start);
    var distance = dest - start;
    if (Math.abs(distance) < 2) {
      window.scrollTo(0, dest);
      index = toIndex;
      clearFx();
      html.classList.remove("qrmo-mod-story-v4--busy");
      setState("LOCKED");
      if (inputKind === "touch" && touchDown) return;
      unlockGesture();
      return;
    }
    if (!dir) dir = distance > 0 ? 1 : -1;
    setState("TRANSITIONING");
    html.classList.add("qrmo-mod-story-v4--busy");
    if (dur > 0) paintFx(scenes[fromIndex] && scenes[fromIndex].el, scenes[toIndex].el, dir);
    else clearFx();
    var t0 = performance.now();
    cancelAnim();
    function frame(ts) {
      if (token !== navToken) return;
      var p = dur <= 0 ? 1 : Math.min(1, (ts - t0) / dur);
      window.scrollTo(0, Math.round(start + distance * ease(p)));
      if (p < 1) raf = window.requestAnimationFrame(frame);
      else finishMove(toIndex);
    }
    raf = window.requestAnimationFrame(frame);
  }

  function unlockGesture() {
    if (state === "TRANSITIONING") return;
    gestureCommitted = false;
    exitLatch = false;
    acc = 0;
    accDir = 0;
    touchOwned = false;
    wheelQuiet = false;
    inputKind = "";
    setState("IDLE");
    clearFx();
    html.classList.remove("qrmo-mod-story-v4--busy");
    hud();
  }

  function armQuiet() {
    window.clearTimeout(quietTimer);
    wheelQuiet = false;
    quietTimer = window.setTimeout(function () {
      wheelQuiet = true;
      if (state === "TRANSITIONING") return;
      unlockGesture();
    }, WHEEL_QUIET);
  }

  function noteWheel() {
    lastInputAt = now();
    wheelQuiet = false;
    if (!inputKind) inputKind = "wheel";
    armQuiet();
  }

  /* Gesture began on a scene, or outside/between. Returns commit | native. */
  function decide(dir) {
    if (!scenes.length) return { type: "native", edge: false };
    var pos = y();
    var originAligned = findAligned(originY);
    var last = scenes.length - 1;

    if (originAligned === 0 && dir < 0) return { type: "native", edge: true };
    if (originAligned === last && dir > 0) return { type: "native", edge: true };

    if (originAligned >= 0) {
      var step = originAligned + dir;
      if (step < 0 || step >= scenes.length) return { type: "native", edge: true };
      return { type: "commit", to: step };
    }

    var firstTop = scenes[0].top;
    var lastTop = scenes[last].top;

    if (originY < firstTop - ALIGN) {
      if (dir > 0 && (firstTop - pos < vh() * APPROACH || pos >= firstTop - ALIGN)) {
        return { type: "commit", to: 0 };
      }
      return { type: "native", edge: false };
    }

    if (originY > lastTop + ALIGN) {
      if (dir < 0 && (pos - lastTop < vh() * APPROACH || pos <= lastTop + ALIGN)) {
        return { type: "commit", to: last };
      }
      return { type: "native", edge: false };
    }

    var alignedNow = findAligned(pos);
    if (alignedNow >= 0) {
      var n = alignedNow + dir;
      if (n < 0 || n >= scenes.length) return { type: "native", edge: true };
      return { type: "commit", to: n };
    }

    var i;
    if (dir > 0) {
      for (i = 0; i < scenes.length; i++) {
        if (scenes[i].top > pos + 4) return { type: "commit", to: i };
      }
      return { type: "native", edge: true };
    }
    for (i = last; i >= 0; i--) {
      if (scenes[i].top < pos - 4) return { type: "commit", to: i };
    }
    return { type: "native", edge: true };
  }

  function resetGesture(kind) {
    inputKind = kind;
    gestureCommitted = false;
    exitLatch = false;
    acc = 0;
    accDir = 0;
    touchOwned = false;
    touchHorizontal = false;
    wheelQuiet = false;
    originY = y();
    ensureMeasured();
    setState("GESTURE_STARTED");
  }

  function commitTo(to, dir) {
    gestureCommitted = true;
    setState("COMMIT_PENDING");
    animateTo(to, dir, reduced() ? 0 : DUR);
  }

  function wheelDelta(e) {
    var d = e.deltaY;
    if (e.deltaMode === 1) d *= 16;
    else if (e.deltaMode === 2) d *= vh();
    return d;
  }

  function onWheel(e) {
    if (reduced()) return;
    if (now() < bypassUntil) {
      if (e.cancelable) e.preventDefault();
      return;
    }
    if (e.ctrlKey) return;
    if (!scenes.length) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    var delta = wheelDelta(e);
    if (!delta) return;
    var dir = delta > 0 ? 1 : -1;

    if (state === "TRANSITIONING" || state === "LOCKED" || gestureCommitted) {
      if (e.cancelable) e.preventDefault();
      noteWheel();
      return;
    }

    stopPin();
    if (state === "IDLE" || inputKind !== "wheel") resetGesture("wheel");
    noteWheel();

    if (dir !== accDir) {
      acc = 0;
      accDir = dir;
      exitLatch = false;
    }
    acc += Math.abs(delta);

    if (exitLatch) return;

    var decision = decide(dir);
    if (decision.type !== "commit") {
      if (decision.edge) exitLatch = true;
      return;
    }

    if (e.cancelable) e.preventDefault();
    if (acc < WHEEL_COMMIT) return;
    commitTo(decision.to, dir);
  }

  function stopPin() {
    pinUntil = 0;
    if (pinRaf) {
      window.cancelAnimationFrame(pinRaf);
      pinRaf = 0;
    }
  }

  /* Chrome keeps a touch fling alive after preventDefault. Hold the landed
     scroll offset until that fling decays. A finger still down only pauses
     the correction; the loop stays armed so the fling after touchend is eaten. */
  function holdPin(top) {
    pinTop = top;
    pinUntil = now() + 1200;
    if (pinRaf) return;
    function frame() {
      if (!pinUntil || state === "TRANSITIONING" || now() > pinUntil) {
        pinRaf = 0;
        return;
      }
      if (!touchDown && y() !== pinTop) window.scrollTo(0, pinTop);
      pinRaf = window.requestAnimationFrame(frame);
    }
    pinRaf = window.requestAnimationFrame(frame);
  }

  function killAndPin(top) {
    var root = document.scrollingElement || html;
    root.style.overflow = "hidden";
    window.scrollTo(0, top);
    root.style.overflow = "";
    window.scrollTo(0, top);
  }

  function stopFling() {
    var pos = y();
    ensureMeasured();
    if (!scenes.length) return;
    var last = scenes[scenes.length - 1];
    if (pos < scenes[0].top - 120 || pos > last.top + Math.max(last.height, 0)) return;
    killAndPin(pos);
  }

  function onTouchStart(e) {
    if (reduced() || bypass() || !e.touches || !e.touches.length) return;
    if (state === "TRANSITIONING" || state === "LOCKED" || gestureCommitted) {
      touchDown = true;
      return;
    }
    stopPin();
    stopFling();
    touchDown = true;
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    resetGesture("touch");
  }

  function onTouchMove(e) {
    if (reduced() || !e.touches || !e.touches.length) return;
    if (now() < bypassUntil) {
      if (e.cancelable) e.preventDefault();
      return;
    }
    if (!touchDown) return;
    var cx = e.touches[0].clientX;
    var cy = e.touches[0].clientY;
    var dx = cx - touchX;
    var dy = touchY - cy;
    touchX = cx;
    touchY = cy;

    if (state === "TRANSITIONING" || state === "LOCKED" || gestureCommitted) {
      if (e.cancelable) e.preventDefault();
      return;
    }

    if (!touchHorizontal && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) {
      touchHorizontal = true;
    }
    if (touchHorizontal) return;

    var dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
    if (!dir) return;
    if (dir !== accDir) {
      acc = 0;
      accDir = dir;
      exitLatch = false;
    }
    acc += Math.abs(dy);
    if (exitLatch || gestureCommitted) {
      if (touchOwned && e.cancelable) e.preventDefault();
      return;
    }

    var decision = decide(dir);
    html.setAttribute("data-qrmo-story-last", decision.type + ":" + (decision.to == null ? "-" : decision.to) + " acc=" + Math.round(acc) + " o=" + Math.round(originY) + " y=" + Math.round(y()));
    if (decision.type !== "commit") {
      if (decision.edge) exitLatch = true;
      return;
    }

    if (acc < TOUCH_ARM) return;
    touchOwned = true;
    if (e.cancelable) e.preventDefault();
    if (acc < TOUCH_COMMIT) return;
    commitTo(decision.to, dir);
  }

  function onTouchEnd() {
    var wasDown = touchDown;
    touchDown = false;
    if (wasDown && pinRaf) pinUntil = now() + 1200;
    if (!wasDown || reduced() || bypass()) return;
    if (state === "TRANSITIONING") return;
    if (gestureCommitted || state === "LOCKED") {
      unlockGesture();
      return;
    }
    if (touchOwned && !touchHorizontal) {
      var back = findAligned(originY);
      if (back < 0) back = nearestIndex(originY);
      var drift = Math.abs(y() - (scenes[back] ? scenes[back].top : originY));
      if (drift > 2) {
        inputKind = "touch";
        animateTo(back, 0, SETTLE);
        return;
      }
    }
    unlockGesture();
  }

  function sceneForModule(id) {
    var i;
    for (i = 0; i < scenes.length; i++) {
      if (scenes[i].moduleId === id && (scenes[i].role === "copy" || scenes[i].role === "module")) return i;
    }
    for (i = 0; i < scenes.length; i++) {
      if (scenes[i].moduleId === id) return i;
    }
    return -1;
  }

  function navigateToModule(id, animate) {
    stopPin();
    ensureMeasured();
    var to = sceneForModule(id);
    if (to < 0) return;
    cancelAnim();
    clearFx();
    gestureCommitted = true;
    exitLatch = true;
    inputKind = "wheel";
    bypassUntil = now() + (animate ? DUR + 120 : 80);
    originY = y();
    if (!animate || reduced()) {
      var dest = scenes[to].top;
      window.scrollTo(0, dest);
      index = to;
      html.classList.remove("qrmo-mod-story-v4--busy");
      unlockGesture();
      holdPin(dest);
      bypassUntil = now() + 80;
      return;
    }
    animateTo(to, scenes[to].top >= y() ? 1 : -1, DUR);
  }

  function samePageHash(href) {
    var hashAt = href.indexOf("#");
    if (hashAt < 0) return "";
    var id = href.slice(hashAt + 1);
    if (!moduleById[id]) return "";
    var before = href.slice(0, hashAt);
    if (!before || before === "./" || before === "/" || before === "index.html") return id;
    try {
      var url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) return id;
    } catch (err) {}
    return "";
  }

  function onDocClick(e) {
    if (e.defaultPrevented) return;
    if (e.button && e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var node = e.target;
    if (!node || !node.closest) return;
    var link = node.closest("a[href]");
    if (!link) return;
    var id = samePageHash(link.getAttribute("href") || "");
    if (!id) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (window.history && history.pushState) history.pushState(null, "", "#" + id);
    navigateToModule(id, !reduced());
  }

  function onHashChange() {
    var id = (window.location.hash || "").replace(/^#/, "");
    if (!moduleById[id]) {
      bypassUntil = now() + 700;
      return;
    }
    navigateToModule(id, false);
  }

  function remap(prev) {
    if (!prev) return -1;
    var i;
    if (!mobile()) {
      for (i = 0; i < scenes.length; i++) {
        if (scenes[i].moduleId === prev.moduleId) return i;
      }
      return -1;
    }
    var role = prev.role === "module" ? "copy" : prev.role;
    for (i = 0; i < scenes.length; i++) {
      if (scenes[i].moduleId === prev.moduleId && scenes[i].role === role) return i;
    }
    return -1;
  }

  function onResize() {
    var prev = scenes[index] || null;
    var pos = y();
    var inside = inZone(pos);
    layoutStamp++;
    syncChrome();
    build();
    if (!inside || !prev) {
      index = scenes.length ? nearestIndex(y()) : 0;
      return;
    }
    if (state === "TRANSITIONING") return;
    var next = remap(prev);
    if (next < 0) return;
    cancelAnim();
    clearFx();
    window.scrollTo(0, scenes[next].top);
    index = next;
    setState("IDLE");
    gestureCommitted = false;
  }

  function hud() {
    if (!debug) return;
    var box = document.getElementById("qrmo-story-v4-hud");
    if (!box) {
      box = document.createElement("div");
      box.id = "qrmo-story-v4-hud";
      box.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:99999;max-width:300px;padding:8px 10px;border-radius:8px;background:#0D2B22;color:#F4F1E8;font:11px/1.35 ui-monospace,monospace;pointer-events:none;white-space:pre";
      document.body.appendChild(box);
    }
    var cur = scenes[index];
    box.textContent = [
      "STORY V4 " + window.innerWidth + "×" + vh() + (mobile() ? " M" : " D"),
      state + " acc=" + Math.round(acc) + " exit=" + (exitLatch ? "1" : "0"),
      cur ? cur.id : "-"
    ].join("\n");
  }

  function bindMotion() {
    /* Hijack listeners stay off under reduced motion. Hash landing still aligns. */
  }

  function boot() {
    syncChrome();
    build();
    setState("IDLE");
    if (!scenes.length) return;

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    document.addEventListener("click", onDocClick, true);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", function () {
      bypassUntil = now() + 500;
      cancelAnim();
      clearFx();
      unlockGesture();
    });

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(onResize, 90);
    }, { passive: true });
    window.addEventListener("orientationchange", function () {
      window.setTimeout(onResize, 140);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        layoutStamp++;
        if (state !== "TRANSITIONING") {
          var inside = inZone(y());
          var prev = scenes[index];
          measure();
          if (inside && prev) {
            var next = remap(prev);
            if (next >= 0 && Math.abs(y() - scenes[next].top) > 2 && Math.abs(y() - scenes[next].top) < ALIGN + 8) {
              window.scrollTo(0, scenes[next].top);
              index = next;
            }
          }
        }
      });
    }

    var startId = (window.location.hash || "").replace(/^#/, "");
    if (moduleById[startId]) {
      window.requestAnimationFrame(function () {
        navigateToModule(startId, false);
      });
    }

    if (typeof reduceMq.addEventListener === "function") {
      reduceMq.addEventListener("change", function () {
        cancelAnim();
        clearFx();
        unlockGesture();
        bindMotion();
      });
    }
    if (typeof mobileMq.addEventListener === "function") {
      mobileMq.addEventListener("change", onResize);
    }

    if (debug) {
      window.addEventListener("scroll", hud, { passive: true });
      hud();
    }

    window.addEventListener("pagehide", function () {
      cancelAnim();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
