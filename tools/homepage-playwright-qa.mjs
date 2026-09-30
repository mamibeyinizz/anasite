#!/usr/bin/env node
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTHS = [1440, 1280, 1024, 960, 768, 560, 390, 375, 360, 320];
const PREFIX = "/anasite";

async function loadPW() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

function serve() {
  const T = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
  };
  return new Promise((res) => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split("?")[0]);
      if (!p.startsWith(PREFIX + "/")) {
        r.writeHead(404);
        return r.end("nf");
      }
      p = p.slice(PREFIX.length);
      if (p === "" || p === "/") p = "/index.html";
      if (p.endsWith("/")) p += "index.html";
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
  console.error("Playwright not installed; homepage QA skipped.");
  process.exit(1);
}

const exe = ["/opt/pw-browsers/chromium", process.env.CHROME_PATH].find(
  (p) => p && fs.existsSync(p) && fs.statSync(p).isFile()
);
const browser = await pw.chromium.launch(exe ? { executablePath: exe } : {});
const { s, port } = await serve();
const base = `http://127.0.0.1:${port}${PREFIX}/`;

const order = [
  "qrmo-translation-v3-root",
  "qrmo-home-filtre",
  "qrmo-home-asistan",
  "qrmo-home-masa",
  "qrmo-home-servis",
  "qrmo-home-icgoru",
];

let fail = 0;
const rows = [];

try {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(base, { waitUntil: "load" });

    const layout = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const ghOpen = document.querySelector("[data-qrmo-gh]")?.classList.contains("qrmo-gh--open");
      let overflow = 0;
      document.querySelectorAll("body *").forEach((el) => {
        if (el.closest(".qrmo-gh-drawer") && !ghOpen) return;
        const b = el.getBoundingClientRect();
        if (b.width < 2) return;
        overflow = Math.max(overflow, b.right - vw, -b.left);
      });
      const ids = [
        "qrmo-product-map-v1",
        "qrmo-translation-v3-root",
        "qrmo-home-filtre",
        "qrmo-home-asistan",
        "qrmo-home-masa",
        "qrmo-home-servis",
        "qrmo-home-icgoru",
      ];
      const tops = ids.map((id) => {
        const el = document.getElementById(id);
        return el ? Math.round(el.getBoundingClientRect().top + scrollY) : null;
      });
      const chips = document.querySelectorAll(".qrmo-product-map-v1-chip");
      let chipOverflow = false;
      chips.forEach((c) => {
        const b = c.getBoundingClientRect();
        if (b.right > vw + 1 || b.left < -1) chipOverflow = true;
      });
      return { overflow, chipOverflow, tops };
    });

    const orderOk = layout.tops.every((t) => t !== null);
    let mono = true;
    for (let i = 1; i < layout.tops.length; i++) {
      if (layout.tops[i] <= layout.tops[i - 1]) mono = false;
    }

    const ok = layout.overflow <= 0 && !layout.chipOverflow && orderOk && mono;
    if (!ok) fail++;
    rows.push({
      w,
      overflow: layout.overflow,
      chipOverflow: layout.chipOverflow,
      sectionOrder: mono,
      ok,
    });

    /* anchor chip test @ desktop */
    if (w === 1280) {
      await page.click('a.qrmo-product-map-v1-chip[href="#qrmo-home-filtre"]');
      await page.waitForTimeout(900);
      const anchor = await page.evaluate(() => {
        const gh = document.querySelector("[data-qrmo-gh]");
        const t = document.getElementById("qrmo-home-filtre");
        const off = gh ? gh.getBoundingClientRect().height + 16 : 96;
        return Math.abs(t.getBoundingClientRect().top - off) < 28;
      });
      if (!anchor) {
        fail++;
        rows.push({ w: "1280-anchor-filtre", ok: false });
      }
    }

    await ctx.close();
  }
} finally {
  await browser.close();
  s.close();
}

console.log(JSON.stringify({ fail, rows }, null, 2));
process.exit(fail ? 1 : 0);
