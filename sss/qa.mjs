#!/usr/bin/env node
/**
 * SSS kalite kontrolü — build sonrası çalıştırın: node sss/qa.mjs
 */
import fs from "fs";
import path from "path";
import http from "http";
import { spawnSync } from "child_process";
import { fileURLToPath, pathToFileURL } from "url";
import {
  FAQ_ITEMS,
  FAQ_CATEGORIES,
  SITE,
  ALLOWED_LINK_HREFS,
  assertFaqData,
} from "./faq-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "sss.html");

const VIEWPORTS = [1440, 1280, 1024, 900, 768, 600, 430, 390, 375, 320];
const checks = [];
let failCount = 0;

function pass(name) {
  checks.push({ name, ok: true });
}
function fail(name, detail) {
  checks.push({ name, ok: false, detail });
  failCount++;
  console.error(`FAIL: ${name}${detail ? " — " + detail : ""}`);
}

function runBuild() {
  const r = spawnSync(process.execPath, ["sss/build.mjs"], {
    cwd: root,
    encoding: "utf8",
  });
  if (r.status !== 0) {
    fail("build.mjs", r.stderr || r.stdout);
  } else {
    pass("build.mjs");
  }
}

runBuild();
assertFaqData();
pass("faq-data assert (50 items, categories)");

if (!fs.existsSync(htmlPath)) {
  fail("sss.html exists");
  console.log(`\nQA: ${checks.filter((c) => c.ok).length}/${checks.length} (aborted)`);
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");

/* CONTENT */
if (FAQ_ITEMS.length === 50) pass("50 questions in data");
else fail("50 questions in data", String(FAQ_ITEMS.length));

const h1Count = (html.match(/<h1\b/gi) || []).length;
if (h1Count === 1) pass("H1 count = 1");
else fail("H1 count = 1", String(h1Count));

for (const item of FAQ_ITEMS) {
  if (!html.includes(`id="${item.id}"`)) fail(`HTML contains ${item.id}`);
}
pass("All FAQ ids present in HTML");

for (const cat of FAQ_CATEGORIES) {
  if (!html.includes(`id="qrmo-faq-panel-${cat.id}"`)) {
    fail(`Category panel ${cat.id}`);
  }
}
pass("Category panels in HTML");

/* SEO meta */
const needMeta = [
  ["title", /<title>[^<]+<\/title>/],
  ["description", /<meta name="description"/],
  ["canonical", /<link rel="canonical"/],
  ["og:title", /property="og:title"/],
  ["og:description", /property="og:description"/],
  ["og:url", /property="og:url"/],
];
for (const [label, re] of needMeta) {
  if (re.test(html)) pass(`meta ${label}`);
  else fail(`meta ${label}`);
}

const ldMatch = html.match(
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
);
if (!ldMatch) fail("JSON-LD block");
else {
  let ld;
  try {
    ld = JSON.parse(ldMatch[1]);
    pass("JSON-LD valid JSON");
  } catch (e) {
    fail("JSON-LD valid JSON", e.message);
    ld = null;
  }
  if (ld) {
    const entities = ld.mainEntity || [];
    if (entities.length === 50) pass("JSON-LD 50 entities");
    else fail("JSON-LD 50 entities", String(entities.length));

    for (const item of FAQ_ITEMS) {
      const ent = entities.find((e) => e.name === item.question);
      if (!ent) fail(`JSON-LD question: ${item.question}`);
      const plain = item.answer.map((p) => (p.type === "text" ? p.value : p.label)).join("");
      if (ent && ent.acceptedAnswer?.text !== plain) {
        fail(`JSON-LD answer match ${item.id}`);
      }
    }
    if (!checks.some((c) => c.name.startsWith("JSON-LD answer match") && !c.ok)) {
      pass("JSON-LD answers match data");
    }

    const names = entities.map((e) => e.name);
    if (new Set(names).size === names.length) pass("JSON-LD unique questions");
    else fail("JSON-LD unique questions");
  }
}

/* Link allowlist in HTML */
const hrefRe = /href="([^"]+)"/g;
let m;
const badLinks = [];
while ((m = hrefRe.exec(html)) !== null) {
  const href = m[1];
  if (href.startsWith("http") && !href.startsWith(SITE.baseUrl)) badLinks.push(href);
  else if (href.startsWith("/") && !href.startsWith("//")) {
    if (!ALLOWED_LINK_HREFS.has(href) && href !== "/sss/" && !href.startsWith("/sss/")) {
      if (href !== "/" && href !== "/paketler/" && !href.startsWith("/moduller/")) {
        badLinks.push(href);
      } else if (href.startsWith("/moduller/") && !ALLOWED_LINK_HREFS.has(href)) {
        badLinks.push(href);
      }
    }
  }
}
if (badLinks.length === 0) pass("Internal links allowlist");
else fail("Internal links allowlist", badLinks.join(", "));

/* Static asset refs */
for (const asset of ["sss/faq.css", "sss/faq.js"]) {
  if (fs.existsSync(path.join(root, asset))) pass(`asset ${asset}`);
  else fail(`asset ${asset}`);
}

async function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent(req.url.split("?")[0]);
      if (urlPath === "/") urlPath = "/sss.html";
      if (urlPath === "/sss" || urlPath === "/sss/") urlPath = "/sss.html";
      const file = path.join(root, urlPath.replace(/^\//, ""));
      if (!file.startsWith(root)) {
        res.writeHead(403);
        return res.end();
      }
      fs.readFile(file, (err, data) => {
        if (err) {
          res.writeHead(404);
          return res.end("Not found");
        }
        const ext = path.extname(file);
        const types = {
          ".html": "text/html; charset=utf-8",
          ".css": "text/css; charset=utf-8",
          ".js": "application/javascript; charset=utf-8",
        };
        res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
        res.end(data);
      });
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
    server.on("error", reject);
  });
}

async function runVisualQa() {
  let puppeteer;
  try {
    puppeteer = await import("puppeteer-core");
  } catch {
    const inst = spawnSync(
      "npm",
      ["install", "puppeteer-core@24", "--no-save", "--prefix", path.join(root, "sss")],
      { cwd: root, encoding: "utf8" }
    );
    if (inst.status !== 0) {
      fail("puppeteer-core install", inst.stderr);
      return;
    }
    puppeteer = await import(
      pathToFileURL(path.join(root, "sss/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js")).href
    );
  }

  const chromePaths = ["/usr/local/bin/google-chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"];
  const executablePath = chromePaths.find((p) => fs.existsSync(p));
  if (!executablePath) {
    fail("Chrome executable for visual QA");
    return;
  }

  const { server, port } = await startServer();
  const base = `http://127.0.0.1:${port}/sss.html`;
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const t = msg.text();
        if (/favicon\.ico/i.test(t)) return;
        if (/404 \(Not Found\)/i.test(t)) return;
        consoleErrors.push(t);
      }
    });
    page.on("pageerror", (err) => consoleErrors.push(String(err)));

    for (const w of VIEWPORTS) {
      await page.setViewport({ width: w, height: 900 });
      await page.goto(base, { waitUntil: "networkidle0" });
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth > doc.clientWidth + 1;
      });
      if (overflow) fail(`horizontal overflow @${w}px`);
      else pass(`no overflow @${w}px`);
    }

    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(base, { waitUntil: "networkidle0" });
    await page.click('.qrmo-faq-nav__btn[data-qrmo-faq-cat="siparis-servis"]');
    await page.waitForSelector("#qrmo-faq-panel-siparis-servis:not([hidden])");
    pass("desktop category switch");

    await page.click("#qrmo-faq-q-online-odeme summary");
    await page.waitForFunction(() => document.getElementById("qrmo-faq-q-online-odeme").open);
    pass("accordion open");

    await page.focus("#qrmo-faq-search");
    await page.keyboard.type("odeme");
    await page.waitForFunction(() => document.body.classList.contains("qrmo-faq--search"));
    pass("search (odeme)");

    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.body.classList.contains("qrmo-faq--search"));
    pass("Escape clears search");

    await page.goto(`${base}#qrmo-faq-q-asistan-limitleri`, { waitUntil: "networkidle0" });
    const deepOpen = await page.evaluate(() => document.getElementById("qrmo-faq-q-asistan-limitleri")?.open);
    if (deepOpen) pass("deep link opens question");
    else fail("deep link opens question");

    await page.setViewport({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: "networkidle0" });
    const chip = await page.$('.qrmo-faq-chips .qrmo-faq-chip[data-qrmo-faq-cat="menu-urun"]');
    if (chip) {
      await chip.click();
      pass("mobile chip click");
    } else fail("mobile chip");

    const shotDir = path.join(root, "sss/.qa-screenshots");
    fs.mkdirSync(shotDir, { recursive: true });
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(base, { waitUntil: "networkidle0" });
    await page.screenshot({ path: path.join(shotDir, "desktop-1440.png"), fullPage: false });
    await page.setViewport({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(shotDir, "mobile-390.png"), fullPage: false });
    pass("screenshots saved");

    if (consoleErrors.length === 0) pass("console clean");
    else fail("console clean", consoleErrors.join("; "));
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

await runVisualQa();

const okCount = checks.filter((c) => c.ok).length;
console.log(`\nQA: ${okCount}/${checks.length} checks passed`);
if (failCount > 0) process.exit(1);
