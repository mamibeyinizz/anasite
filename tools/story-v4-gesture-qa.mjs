#!/usr/bin/env node
/**
 * Story V4 gesture regression — includes idle drift (no input) after transitions.
 */
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PREFIX = "/anasite";
const T = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
};

async function loadPW() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

function serve() {
  return new Promise((res) => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split("?")[0]);
      if (!p.startsWith(PREFIX + "/")) {
        r.writeHead(404);
        return r.end("nf");
      }
      p = p.slice(PREFIX.length);
      if (p === "" || p === "/") p = "/index.html";
      const f = path.join(root, p);
      fs.readFile(f, (e, d) => {
        if (e || !f.startsWith(root)) {
          r.writeHead(404);
          return r.end("nf");
        }
        r.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" });
        r.end(d);
      });
    });
    s.listen(0, "127.0.0.1", () => res({ s, port: s.address().port }));
  });
}

const pw = await loadPW();
if (!pw) {
  console.error("Playwright required");
  process.exit(1);
}

const { s, port } = await serve();
const base = `http://127.0.0.1:${port}${PREFIX}/index.html`;
const browser = await pw.chromium.launch();
const issues = [];
const consoleErrors = [];

async function runViewport(width, height) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(`[${width}x${height}] ${m.text()}`);
  });
  await page.goto(base, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1200);

  const idleDrift = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const y0 = window.scrollY;
    const state0 = document.documentElement.getAttribute("data-qrmo-story-state");
    document.dispatchEvent(
      new CustomEvent("qrmo-story-scene-enter", { detail: { moduleId: "qrmo-home-asistan", role: "module" } })
    );
    const link = document.querySelector('a[href="#qrmo-home-asistan"]');
    if (link) link.click();
    await sleep(900);
    const y1 = window.scrollY;
    await sleep(8000);
    const y2 = window.scrollY;
    const state = document.documentElement.getAttribute("data-qrmo-story-state");
    const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    return { y0, y1, y2, state0, state, overflow, drift: Math.abs(y2 - y1) };
  });

  if (idleDrift.drift > 3) {
    issues.push(`${width}x${height}: idle drift ${idleDrift.drift}px after nav`);
  }
  if (idleDrift.state !== "IDLE" && idleDrift.state !== null) {
    issues.push(`${width}x${height}: state not IDLE after idle wait (${idleDrift.state})`);
  }
  if (idleDrift.overflow > 0) {
    issues.push(`${width}x${height}: horizontal overflow ${idleDrift.overflow}`);
  }

  const wheelOnce = await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const land = () => document.documentElement.getAttribute("data-qrmo-story-land");
    const beforeLand = land();
    const beforeY = window.scrollY;
    for (let i = 0; i < 8; i++) {
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 40, bubbles: true, cancelable: true }));
      await sleep(16);
    }
    await sleep(900);
    const afterLand = land();
    const afterY = window.scrollY;
    await sleep(8000);
    const idleY = window.scrollY;
    return {
      beforeLand,
      afterLand,
      beforeY,
      afterY,
      idleY,
      state: document.documentElement.getAttribute("data-qrmo-story-state"),
      idleDriftAfterWheel: Math.abs(idleY - afterY),
    };
  });

  if (wheelOnce.beforeLand !== wheelOnce.afterLand && wheelOnce.afterLand) {
    const jumped = Math.abs(wheelOnce.afterY - wheelOnce.beforeY);
    if (jumped > 1200) {
      issues.push(`${width}x${height}: wheel gesture jump ${jumped}px`);
    }
  }
  if (wheelOnce.idleDriftAfterWheel > 3) {
    issues.push(`${width}x${height}: idle drift after wheel ${wheelOnce.idleDriftAfterWheel}px`);
  }

  await ctx.close();
}

try {
  for (const [w, h] of [[1440, 900], [1366, 768], [390, 844], [320, 640]]) {
    await runViewport(w, h);
  }
} finally {
  await browser.close();
  s.close();
}

const out = { pass: issues.length === 0 && consoleErrors.length === 0, issues, consoleErrors };
console.log(JSON.stringify(out, null, 2));
process.exit(out.pass ? 0 : 1);
