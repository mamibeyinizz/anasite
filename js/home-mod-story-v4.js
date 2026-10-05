/* Story V4 — production scroll authority for homepage modules S3–S8.
   One physical gesture commits at most one scene.
   Desktop: one module = one scene. Mobile (≤767): copy, then demo.
   Hero, S2, and S9+ stay native.
   Kill switch: ?story=off. Debug HUD: ?storydebug=1.

   Gesture rule: wheel/touch input is the only way to commit.
   scroll events produced by our own scrollTo() are never a gesture.
   A committed gesture stays consumed until that finger ends and, for
   wheel/trackpad, until the event stream has been silent. The tail of
   the same flick cannot start the next scene.
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
  var WHEEL_GAP = 520;
  var TOUCH_ARM = 10;
  var TOUCH_COMMIT = 32;
  var DUR = 680;
  var SETTLE = 170;
  var REALIGN = 160;
  var FLING_FRAMES = 6;
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
  var gestureId = 0;
  var gestureCommitted = false;
  var exitLatch = false;
  var acc = 0;
  var accDir = 0;
  var originY = 0;
  var originIndex = -1;
  var inputKind = "";
  var lastInputAt = 0;
  var quietTimer = 0;
  var touchDown = false;
  var touchX = 0;
  var touchY = 0;
  var touchOwned = false;
  var touchHorizontal = false;
  var blockTouch = false;
  var bypassUntil = 0;
  var layoutStamp = 0;
  var measuredStamp = -1;
  var navToken = 0;
  var settleToken = 0;
  var scrollWrite = 0;
  var activeStart = 0;
  var activeTarget = 0;
  var commitReason = "";

  function now() { return Date.now(); }
  function reduced() { return !!(reduceMq && reduceMq.matches); }
  function mobile() { return !!(mobileMq && mobileMq.matches); }
  function y() { return window.pageYOffset || html.scrollTop || 0; }
  function vh() { return window.innerHeight || html.clientHeight || 800; }
  function busy() {
    return state === "COMMITTED" || state === "TRANSITIONING" || state === "SETTLE";
  }

  function setState(next) {
    state = next;
    html.setAttribute("data-qrmo-story-state", next);
    if (debug) html.setAttribute("data-qrmo-story-gesture", String(gestureId));
  }

  /* Our scrollTo must not be readable as user input. Depth is synchronous
     because scroll events fired by scrollTo run before scrollTo returns. */
  function scrollToY(top) {
    scrollWrite++;
    window.scrollTo(0, top);
    scrollWrite--;
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
    if (!scenes.length || state === "TRANSITIONING" || state === "COMMITTED") return;
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

  function cancelQuiet() {
    if (quietTimer) {
      window.clearTimeout(quietTimer);
      quietTimer = 0;
    }
  }

  function releaseLock() {
    html.classList.remove("qrmo-story-v4-lock");
  }

  function paintFx(fromEl, toEl, dir) {
    if (reduced() || !fromEl || !toEl || fromEl === toEl || !dir) return;
    clearFx();
    fromEl.classList.add("is-story-from");
    toEl.classList.add("is-story-to", dir > 0 ? "is-prep-next" : "is-prep-prev");
    void toEl.offsetWidth;
    fromEl.classList.add(dir > 0 ? "is-out-next" : "is-out-prev");
    toEl.classList.remove("is-prep-next", "is-prep-prev");
    toEl.classList.add("is-in");
  }

  /* Overflow hidden across a few frames cancels a compositor fling.
     Restoring it in the same turn lets the fling resume, which is the
     "page moved by itself" bug. After these frames, nothing scrolls. */
  function killFling(top, token, done) {
    var frames = FLING_FRAMES;
    html.classList.add("qrmo-story-v4-lock");
    scrollToY(top);
    function step() {
      if (token !== settleToken) {
        releaseLock();
        return;
      }
      if (y() !== top) scrollToY(top);
      frames--;
      if (frames > 0) {
        raf = window.requestAnimationFrame(step);
        return;
      }
      raf = 0;
      releaseLock();
      if (token === settleToken) scrollToY(top);
      if (done) done();
    }
    raf = window.requestAnimationFrame(step);
  }

  function armWheelSettle() {
    cancelQuiet();
    quietTimer = window.setTimeout(function () {
      quietTimer = 0;
      if (state !== "SETTLE") return;
      if (touchDown || blockTouch) return;
      enterIdle();
    }, WHEEL_GAP);
  }

  /* An uncommitted wheel gesture must die on silence.
     Otherwise its accumulator and edge latch leak into the next flick. */
  function armOpenGesture() {
    if (state !== "GESTURE_STARTED" && state !== "GESTURE_ACCUMULATING") return;
    cancelQuiet();
    quietTimer = window.setTimeout(function () {
      quietTimer = 0;
      if (gestureCommitted) return;
      if (state !== "GESTURE_STARTED" && state !== "GESTURE_ACCUMULATING") return;
      cancelGesture();
    }, WHEEL_GAP);
  }

  function enterIdle() {
    if (state === "TRANSITIONING" || state === "COMMITTED") return;
    cancelQuiet();
    gestureCommitted = false;
    exitLatch = false;
    acc = 0;
    accDir = 0;
    touchOwned = false;
    touchHorizontal = false;
    inputKind = "";
    setState("IDLE");
    clearFx();
    html.classList.remove("qrmo-mod-story-v4--busy");
    hud();
  }

  function cancelGesture() {
    setState("CANCELLED");
    acc = 0;
    accDir = 0;
    gestureCommitted = false;
    touchOwned = false;
    enterIdle();
  }

  function finishMove(toIndex, targetY) {
    var scene = scenes[toIndex];
    var top = targetY;
    clearFx();
    if (scene && scene.el) {
      scene.el.style.transform = "none";
      scene.el.style.transition = "none";
      void scene.el.offsetWidth;
      var measured = Math.round(scene.el.getBoundingClientRect().top + y());
      scene.el.style.transform = "";
      scene.el.style.transition = "";
      if (Math.abs(measured - targetY) <= REALIGN) top = measured;
      scene.top = top;
    }
    index = toIndex;
    activeTarget = top;
    scrollToY(top);
    html.setAttribute("data-qrmo-story-land", String(top));
    html.classList.remove("qrmo-mod-story-v4--busy");
    setState("SETTLE");
    var token = ++settleToken;
    var kind = inputKind;
    killFling(top, token, function () {
      if (token !== settleToken || state !== "SETTLE") return;
      if (kind === "touch") {
        if (touchDown || blockTouch) return;
        enterIdle();
        return;
      }
      if (now() - lastInputAt >= WHEEL_GAP) enterIdle();
      else armWheelSettle();
    });
  }

  function animateTo(toIndex, dir, dur, targetOverride) {
    if (!scenes[toIndex] && targetOverride == null) return;
    settleToken++;
    releaseLock();
    cancelAnim();
    cancelQuiet();
    ensureMeasured();
    var token = ++navToken;
    var start = y();
    var dest = targetOverride != null ? targetOverride : scenes[toIndex].top;
    activeStart = start;
    activeTarget = dest;
    var distance = dest - start;
    gestureCommitted = true;
    if (Math.abs(distance) < 2) {
      finishMove(toIndex, dest);
      return;
    }
    if (!dir) dir = distance > 0 ? 1 : -1;
    setState("TRANSITIONING");
    html.classList.add("qrmo-mod-story-v4--busy");
    var fromScene = scenes[originIndex >= 0 ? originIndex : index];
    if (dur > 0) paintFx(fromScene && fromScene.el, scenes[toIndex] && scenes[toIndex].el, dir);
    else clearFx();
    var t0 = performance.now();
    function frame(ts) {
      if (token !== navToken) return;
      var p = dur <= 0 ? 1 : Math.min(1, (ts - t0) / dur);
      scrollToY(Math.round(start + distance * ease(p)));
      if (p < 1) raf = window.requestAnimationFrame(frame);
      else {
        raf = 0;
        finishMove(toIndex, dest);
      }
    }
    raf = window.requestAnimationFrame(frame);
  }

  function decide(dir) {
    if (!scenes.length) return { type: "native", edge: false };
    var aligned = originIndex;
    if (aligned < 0) aligned = findAligned(originY);
    var last = scenes.length - 1;
    var pos = originY;

    if (aligned >= 0) {
      if ((aligned === 0 && dir < 0) || (aligned === last && dir > 0)) {
        return { type: "native", edge: true };
      }
      return { type: "commit", to: aligned + dir };
    }

    var firstTop = scenes[0].top;
    var lastTop = scenes[last].top;
    if (pos < firstTop - ALIGN) {
      if (dir > 0 && (firstTop - y() < vh() * APPROACH || y() >= firstTop - ALIGN)) {
        return { type: "commit", to: 0 };
      }
      return { type: "native", edge: false };
    }
    if (pos > lastTop + ALIGN) {
      if (dir < 0 && (y() - lastTop < vh() * APPROACH || y() <= lastTop + ALIGN)) {
        return { type: "commit", to: last };
      }
      return { type: "native", edge: false };
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

  function beginGesture(kind) {
    cancelQuiet();
    settleToken++;
    releaseLock();
    gestureId += 1;
    inputKind = kind;
    gestureCommitted = false;
    exitLatch = false;
    acc = 0;
    accDir = 0;
    touchOwned = false;
    touchHorizontal = false;
    originY = y();
    ensureMeasured();
    originIndex = findAligned(originY);
    if (originIndex < 0 && scenes[index] && Math.abs(scenes[index].top - originY) <= ALIGN) {
      originIndex = index;
    }
    if (originIndex >= 0) index = originIndex;
    commitReason = "";
    setState("GESTURE_STARTED");
    hud();
  }

  function commitTo(to, dir, reason) {
    if (gestureCommitted || busy()) return;
    if (!scenes[to]) return;
    commitReason = reason || inputKind;
    setState("COMMITTED");
    animateTo(to, dir, reduced() ? 0 : DUR);
  }

  function settleBack() {
    if (originIndex < 0 || !scenes[originIndex]) {
      cancelGesture();
      return;
    }
    var dest = scenes[originIndex].top;
    if (Math.abs(y() - dest) <= 2) {
      index = originIndex;
      cancelGesture();
      return;
    }
    commitReason = "settle-back";
    inputKind = "touch";
    gestureCommitted = false;
    setState("COMMITTED");
    animateTo(originIndex, y() < dest ? 1 : -1, SETTLE, dest);
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
    if (e.ctrlKey || !scenes.length) return;
    if (e.deltaX && Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    var delta = wheelDelta(e);
    if (!delta) return;

    if (state !== "IDLE" && state !== "GESTURE_STARTED" && state !== "GESTURE_ACCUMULATING") {
      if (e.cancelable) e.preventDefault();
      lastInputAt = now();
      if (state === "SETTLE" && inputKind !== "touch") armWheelSettle();
      return;
    }
    if (state === "GESTURE_STARTED" || state === "GESTURE_ACCUMULATING") {
      if (inputKind !== "wheel") {
        if (e.cancelable) e.preventDefault();
        return;
      }
    }

    var dir = delta > 0 ? 1 : -1;
    if (state === "IDLE") beginGesture("wheel");
    if (state === "GESTURE_STARTED") setState("GESTURE_ACCUMULATING");
    lastInputAt = now();

    if (dir !== accDir) {
      acc = 0;
      accDir = dir;
      exitLatch = false;
    }
    if (exitLatch || gestureCommitted) {
      if (e.cancelable && !exitLatch) e.preventDefault();
      armOpenGesture();
      return;
    }
    acc += Math.abs(delta);

    var decision = decide(dir);
    if (decision.type !== "commit") {
      if (decision.edge) exitLatch = true;
      armOpenGesture();
      return;
    }
    if (e.cancelable) e.preventDefault();
    if (acc < WHEEL_COMMIT) {
      armOpenGesture();
      return;
    }
    commitTo(decision.to, dir, "wheel");
  }

  function onTouchStart(e) {
    if (reduced() || !e.touches || !e.touches.length) return;
    if (now() < bypassUntil) return;
    if (blockTouch || state === "TRANSITIONING" || state === "COMMITTED") {
      blockTouch = true;
      touchDown = true;
      return;
    }
    touchDown = true;
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
    if (state !== "IDLE") {
      cancelQuiet();
      setState("IDLE");
      gestureCommitted = false;
    }
    beginGesture("touch");
  }

  function onTouchMove(e) {
    if (reduced() || !e.touches || !e.touches.length) return;
    if (now() < bypassUntil) {
      if (e.cancelable) e.preventDefault();
      return;
    }
    if (!touchDown) return;
    if (blockTouch || state === "TRANSITIONING" || state === "COMMITTED" || state === "SETTLE" || gestureCommitted) {
      if (e.cancelable) e.preventDefault();
      return;
    }
    if (state !== "GESTURE_STARTED" && state !== "GESTURE_ACCUMULATING") return;

    var cx = e.touches[0].clientX;
    var cy = e.touches[0].clientY;
    var dx = cx - touchX;
    var dy = touchY - cy;
    touchX = cx;
    touchY = cy;

    if (!touchHorizontal && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) touchHorizontal = true;
    if (touchHorizontal) return;

    var dir = dy > 0 ? 1 : dy < 0 ? -1 : 0;
    if (!dir) return;
    if (state === "GESTURE_STARTED") setState("GESTURE_ACCUMULATING");
    if (dir !== accDir) {
      acc = 0;
      accDir = dir;
      exitLatch = false;
    }
    acc += Math.abs(dy);
    if (exitLatch) return;

    var decision = decide(dir);
    if (debug) {
      html.setAttribute(
        "data-qrmo-story-last",
        decision.type + ":" + (decision.to == null ? "-" : decision.to) +
          " g=" + gestureId + " acc=" + Math.round(acc)
      );
    }
    if (decision.type !== "commit") {
      if (decision.edge) exitLatch = true;
      return;
    }
    if (acc < TOUCH_ARM) return;
    touchOwned = true;
    if (e.cancelable) e.preventDefault();
    if (acc < TOUCH_COMMIT || gestureCommitted) return;
    commitTo(decision.to, dir, "touch");
  }

  function onTouchEnd() {
    var blocked = blockTouch;
    touchDown = false;
    blockTouch = false;
    if (reduced()) return;
    if (state === "TRANSITIONING" || state === "COMMITTED") return;
    if (blocked || now() < bypassUntil) {
      if (state === "SETTLE") enterIdle();
      else if (state !== "IDLE") cancelGesture();
      return;
    }
    if (state === "SETTLE") {
      enterIdle();
      return;
    }
    if ((state === "GESTURE_STARTED" || state === "GESTURE_ACCUMULATING") && touchOwned && !touchHorizontal) {
      settleBack();
      return;
    }
    if (state !== "IDLE") cancelGesture();
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
    ensureMeasured();
    var to = sceneForModule(id);
    if (to < 0) return;
    settleToken++;
    releaseLock();
    cancelAnim();
    cancelQuiet();
    clearFx();
    navToken++;
    bypassUntil = now() + (!animate || reduced() ? 80 : DUR + 160);
    originY = y();
    originIndex = index;
    inputKind = "wheel";
    lastInputAt = 0;
    commitReason = "nav";
    gestureCommitted = false;
    if (!animate || reduced()) {
      var dest = scenes[to].top;
      scrollToY(dest);
      index = to;
      activeStart = originY;
      activeTarget = dest;
      html.classList.remove("qrmo-mod-story-v4--busy");
      setState("SETTLE");
      armWheelSettle();
      return;
    }
    setState("COMMITTED");
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

  /* Resize / address-bar: follow the scene already on screen.
     Never animate to a different scene and never move the user
     onto a scene they are not already looking at. */
  function syncSceneToViewport() {
    if (!scenes.length) return;
    var pos = y();
    if (!inZone(pos)) return;
    var aligned = findAligned(pos);
    if (aligned >= 0) {
      index = aligned;
      if (Math.abs(pos - scenes[aligned].top) > 2) scrollToY(scenes[aligned].top);
      return;
    }
    var nearest = nearestIndex(pos);
    if (nearest === index && scenes[index] && Math.abs(pos - scenes[index].top) <= Math.min(vh() * 0.45, 280)) {
      scrollToY(scenes[index].top);
      return;
    }
    index = nearest;
  }

  function onResize() {
    if (touchDown) blockTouch = true;
    if (state === "TRANSITIONING" || state === "COMMITTED" || state === "SETTLE") {
      layoutStamp++;
      return;
    }
    var prev = scenes[index] || null;
    layoutStamp++;
    syncChrome();
    build();
    cancelAnim();
    clearFx();
    acc = 0;
    gestureCommitted = false;
    if (state !== "IDLE") setState("IDLE");
    if (!prev) {
      index = scenes.length ? nearestIndex(y()) : 0;
      return;
    }
    var inside = inZone(y());
    if (!inside) return;
    var next = remap(prev);
    if (next < 0) return;
    index = next;
    syncSceneToViewport();
  }

  function hud() {
    if (!debug) return;
    var box = document.getElementById("qrmo-story-v4-hud");
    if (!box) {
      box = document.createElement("div");
      box.id = "qrmo-story-v4-hud";
      box.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:99999;max-width:320px;padding:8px 10px;border-radius:8px;background:#0D2B22;color:#F4F1E8;font:11px/1.35 ui-monospace,monospace;pointer-events:none;white-space:pre";
      document.body.appendChild(box);
    }
    var cur = scenes[index];
    box.textContent = [
      "STORY V4 g" + gestureId + " " + state,
      "scene " + index + " " + (cur ? cur.id : "-"),
      "dir " + accDir + " " + (commitReason || "-"),
      "start " + Math.round(activeStart) + " target " + Math.round(activeTarget),
      "y " + Math.round(y())
    ].join("\n");
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
    /* Scroll events, including those from scrollToY, never commit a scene. */
    window.addEventListener("scroll", function () {
      if (scrollWrite > 0) return;
      if (state === "TRANSITIONING" || state === "COMMITTED" || state === "SETTLE") return;
    }, { passive: true });
    document.addEventListener("click", onDocClick, true);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", function () {
      bypassUntil = now() + 500;
      settleToken++;
      releaseLock();
      cancelAnim();
      cancelQuiet();
      clearFx();
      cancelGesture();
    });

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(onResize, 90);
    }, { passive: true });
    window.addEventListener("orientationchange", function () {
      if (touchDown) blockTouch = true;
      window.setTimeout(onResize, 140);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        layoutStamp++;
        if (state === "TRANSITIONING" || state === "COMMITTED") return;
        var prev = scenes[index];
        var inside = inZone(y());
        measure();
        if (!inside || !prev) return;
        var next = remap(prev);
        if (next < 0) return;
        index = next;
        syncSceneToViewport();
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
        settleToken++;
        releaseLock();
        cancelAnim();
        cancelQuiet();
        clearFx();
        cancelGesture();
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
      settleToken++;
      releaseLock();
      cancelAnim();
      cancelQuiet();
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
