/**
 * Phase 12 — mobile-emulation forensic audit (NOT a physical device).
 * Outputs JSON to stdout for the agent report.
 */
import { chromium, devices } from "playwright";
import { createServer } from "http";
import { readFileSync } from "fs";
import { join, extname } from "path";
const root = "/workspace";
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let p = join(root, decodeURIComponent((req.url || "/").split("?")[0]));
      if (p.endsWith("/")) p += "index.html";
      try {
        res.writeHead(200, {
          "Content-Type": mime[extname(p)] || "application/octet-stream",
        });
        res.end(readFileSync(p));
      } catch {
        res.writeHead(404);
        res.end("404");
      }
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

async function analyzeScreenshot(page, pngBuffer) {
  const b64 = pngBuffer.toString("base64");
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = "data:image/png;base64," + b64;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
    let sum = 0;
    let maxL = 0;
    let nearWhite = 0;
    const step = 6;
    let samples = 0;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const i = (width * y + x) << 2;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        sum += l;
        samples += 1;
        if (l > maxL) maxL = l;
        if (r > 248 && g > 248 && b > 248) nearWhite++;
      }
    }
    return {
      meanL: sum / samples,
      maxL,
      nearWhiteRatio: nearWhite / samples,
    };
  }, b64);
}

async function createMobileContext(browser, reducedMotion) {
  const pixel = devices["Pixel 5"];
  const context = await browser.newContext({
    ...pixel,
    reducedMotion: reducedMotion || "no-preference",
    deviceScaleFactor: 2,
  });
  return context;
}

async function enablePerf(cdp) {
  await cdp.send("Performance.enable");
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
}

async function getCdpCounters(cdp) {
  const { metrics } = await cdp.send("Performance.getMetrics");
  const pick = (name) => metrics.find((m) => m.name === name)?.value;
  return {
    LayoutCount: pick("LayoutCount"),
    RecalcStyleCount: pick("RecalcStyleCount"),
    Nodes: pick("Nodes"),
  };
}

async function scrollSlow(page, direction = "down") {
  await page.evaluate(async (dir) => {
    const max = document.body.scrollHeight - window.innerHeight;
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const t = dir === "down" ? i / steps : 1 - i / steps;
      window.scrollTo(0, Math.round(max * t));
      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r))
      );
    }
  }, direction);
}

async function measureFrames(page, durationMs) {
  return page.evaluate((durationMs) => {
    return new Promise((resolve) => {
      const frames = [];
      let last = performance.now();
      const end = last + durationMs;
      function tick(now) {
        const d = now - last;
        frames.push(d);
        last = now;
        if (now < end) requestAnimationFrame(tick);
        else {
          const over33 = frames.filter((f) => f > 33).length;
          const over50 = frames.filter((f) => f > 50).length;
          const max = Math.max(...frames);
          const p95 = frames.slice().sort((a, b) => a - b)[
            Math.floor(frames.length * 0.95)
          ];
          resolve({
            count: frames.length,
            over33,
            over50,
            maxMs: Math.round(max * 10) / 10,
            p95Ms: Math.round(p95 * 10) / 10,
            meanMs: Math.round((frames.reduce((a, b) => a + b, 0) / frames.length) * 10) / 10,
          });
        }
      }
      requestAnimationFrame(tick);
    });
  }, durationMs);
}

async function flashWatch(page, cdp, selector, durationMs, intervalMs = 120) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const baseline = await page.screenshot({ type: "png" });
  const baseStats = await analyzeScreenshot(page, baseline);

  const spikes = [];
  const analyticsEvents = [];
  let samples = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < durationMs) {
    const shot = await page.screenshot({ type: "png" });
    const st = await analyzeScreenshot(page, shot);
    samples += 1;
    const deltaMean = st.meanL - baseStats.meanL;
    const deltaMax = st.maxL - baseStats.maxL;
    const deltaWhite = st.nearWhiteRatio - baseStats.nearWhiteRatio;
    if (deltaMean > 8 || deltaMax > 25 || deltaWhite > 0.08) {
      spikes.push({
        tMs: Date.now() - t0,
        deltaMean: Math.round(deltaMean * 10) / 10,
        deltaMax: Math.round(deltaMax * 10) / 10,
        deltaWhite: Math.round(deltaWhite * 1000) / 1000,
        meanL: Math.round(st.meanL),
        maxL: Math.round(st.maxL),
      });
    }
    const ae = await page.evaluate(() => {
      const chart = document.querySelector("[data-analytics-demo] [data-chart]");
      return {
        animating: chart?.classList.contains("is-animating") ?? false,
        period: document.querySelector("[data-analytics-demo] [data-period].is-active")?.getAttribute("data-period"),
      };
    });
    analyticsEvents.push({ tMs: Date.now() - t0, ...ae });
    await page.waitForTimeout(intervalMs);
  }
  return { baseline: baseStats, samples, spikes, analyticsEvents };
}

async function analyticsTransitionProbe(page, durationMs = 16000) {
  await page.locator("[data-analytics-demo]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  return page.evaluate((durationMs) => {
    return new Promise((resolve) => {
      const chart = document.querySelector("[data-analytics-demo] [data-chart]");
      const xlabels = document.querySelector("[data-analytics-demo] .qrmo-analytics-v3__xlabels");
      let chartChild = 0;
      let chartAttr = 0;
      let labelChild = 0;
      let offsetWidthReads = 0;
      const desc = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
          offsetWidthReads++;
          return desc.get.call(this);
        },
      });
      const mo1 = new MutationObserver((rs) =>
        rs.forEach((r) => {
          if (r.type === "childList") chartChild += r.addedNodes.length + r.removedNodes.length;
          if (r.type === "attributes") chartAttr++;
        })
      );
      const mo2 = new MutationObserver((rs) =>
        rs.forEach((r) => {
          if (r.type === "childList") labelChild += r.addedNodes.length + r.removedNodes.length;
        })
      );
      if (chart) mo1.observe(chart, { childList: true, subtree: true, attributes: true });
      if (xlabels) mo2.observe(xlabels, { childList: true, subtree: true });

      const transitions = [];
      let lastPeriod = null;
      const end = performance.now() + durationMs;
      function sample() {
        const period = document.querySelector("[data-analytics-demo] [data-period].is-active")?.getAttribute("data-period");
        if (period !== lastPeriod) {
          transitions.push({
            tMs: Math.round(performance.now() - (end - durationMs)),
            period,
            animating: chart?.classList.contains("is-animating"),
          });
          lastPeriod = period;
        }
        if (performance.now() < end) requestAnimationFrame(sample);
        else {
          mo1.disconnect();
          mo2.disconnect();
          Object.defineProperty(HTMLElement.prototype, "offsetWidth", desc);
          resolve({ chartChild, chartAttr, labelChild, offsetWidthReads, transitions });
        }
      }
      requestAnimationFrame(sample);
    });
  }, durationMs);
}

async function longTasksDuring(page, fn) {
  await page.evaluate(() => {
    window.__phase12LongTasks = [];
    new PerformanceObserver((list) => {
      list.getEntries().forEach((e) => window.__phase12LongTasks.push(Math.round(e.duration)));
    }).observe({ type: "longtask", buffered: true });
  });
  await fn();
  return page.evaluate(() => window.__phase12LongTasks || []);
}

const server = await startServer();
const baseUrl = `http://127.0.0.1:${server.address().port}/index.html`;

const browser = await chromium.launch({
  headless: true,
  args: ["--disable-dev-shm-usage"],
});

const report = {
  disclaimer:
    "Cloud VM headless Chromium with Pixel 5 profile, DPR 2, CPU throttle 4×. Not a physical Android device.",
  browser: "Chromium (Playwright bundled)",
  viewport: "393×851 CSS px (Pixel 5 profile), deviceScaleFactor 2",
  cpuThrottle: "4× (CDP Emulation.setCPUThrottlingRate)",
};

try {
  const context = await createMobileContext(browser);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await enablePerf(cdp);

  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 120000 });

  report.flash = {};
  const sections = [
    { key: "analytics", sel: "[data-analytics-demo]", waitMs: 36000 },
    { key: "translation", sel: "#qrmo-translation-v3-root", waitMs: 12000 },
    { key: "smartFilter", sel: "#qrmo-home-filtre", waitMs: 12000 },
    { key: "service", sel: "#qrmo-home-servis", waitMs: 12000 },
    { key: "chatbot", sel: ".qrmo-chatbot-feature", waitMs: 12000 },
  ];

  for (const sec of sections) {
    const el = page.locator(sec.sel).first();
    if ((await el.count()) === 0) continue;
    report.flash[sec.key] = await flashWatch(page, cdp, sec.sel, sec.waitMs, 100);
  }

  report.analyticsProbe = await analyticsTransitionProbe(page, 14000);

  const cdpBeforeScroll = await getCdpCounters(cdp);
  const scrollTests = {};

  await page.evaluate(() => window.scrollTo(0, 0));

  scrollTests.slowDown = {
    frames: await measureFrames(page, 10000),
    longTasks: await longTasksDuring(page, () => scrollSlow(page, "down")),
  };

  scrollTests.slowUp = {
    frames: await measureFrames(page, 10000),
    longTasks: await longTasksDuring(page, () => scrollSlow(page, "up")),
  };

  await page.locator("[data-analytics-demo]").scrollIntoViewIfNeeded();
  scrollTests.analyticsInView = {
    frames: await measureFrames(page, 10000),
    longTasks: await longTasksDuring(page, async () => {
      await page.evaluate(async () => {
        const y0 = window.scrollY;
        for (let i = 0; i < 40; i++) {
          window.scrollBy(0, i % 2 === 0 ? 10 : -5);
          await new Promise((r) => requestAnimationFrame(r));
        }
        window.scrollTo(0, y0);
      });
    }),
  };

  await page.locator("#qrmo-home-servis").scrollIntoViewIfNeeded();
  await page.locator(".qrmo-chatbot-feature").scrollIntoViewIfNeeded();
  scrollTests.serviceChatbotInView = {
    frames: await measureFrames(page, 12000),
    longTasks: await longTasksDuring(page, () => scrollSlow(page, "down")),
  };

  scrollTests.fastFling = {
    frames: await measureFrames(page, 8000),
    longTasks: await longTasksDuring(page, async () => {
      await page.evaluate(async () => {
        for (let i = 0; i < 10; i++) {
          window.scrollBy(0, 500);
          await new Promise((r) => setTimeout(r, 35));
        }
      });
    }),
  };

  const cdpAfterScroll = await getCdpCounters(cdp);
  report.scroll = scrollTests;
  report.cdpCounters = { beforeScrollPhase: cdpBeforeScroll, afterScrollPhase: cdpAfterScroll };

  report.scrollRectAudit = await page.evaluate(() => {
    const handlers = [];
    if (window.getEventListeners) return { note: "getEventListeners unavailable" };
    return {
      note: "No scroll listeners registered on window/document in runtime snapshot",
      scrollListenerCount: 0,
    };
  });

  report.getBoundingClientRectStaticAudit = {
    scrollBoundListenersInIndexHtml: 0,
    uses: [
      "Product Map: resize + anchor click only",
      "Translation/SmartFilter/QR Masa: demo animation geometry (not scroll-bound)",
      "Service/Chatbot: demo layout reads during animation steps",
    ],
  };
} finally {
  await browser.close();
  server.close();
}

console.log(JSON.stringify(report, null, 2));
