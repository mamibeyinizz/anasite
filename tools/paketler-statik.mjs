#!/usr/bin/env node
/* =========================================================
   /paketler/ statik özeti: JavaScript çalıştırmayan tarayıcılar ve yapay zekâ
   tarayıcıları için fiyat + özellik tablosu <noscript> içine paket verisinden yazılır.
   Kullanım: node tools/paketler-statik.mjs  (packages-data.js değişince tekrar çalıştırın)
========================================================= */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "paketler/packages-data.js"), "utf8"), ctx);
const P = ctx.window.QRMO_PRICING;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const tl = (n) => n.toLocaleString("tr-TR");
const order = P.packages.map((p) => p.id);
const has = (f, id) => order.indexOf(id) >= order.indexOf(f.from);

const head = `<tr><th scope="col">Özellik</th>${P.packages.map((p) => `<th scope="col">${esc(p.name)}</th>`).join("")}</tr>`;
const price = `<tr><th scope="row">Aylık fiyat</th>${P.packages.map((p) => `<td>${tl(p.price.monthly)} TL</td>`).join("")}</tr>` +
  `<tr><th scope="row">Yıllık fiyat</th>${P.packages.map((p) => `<td>${tl(p.price.annual)} TL</td>`).join("")}</tr>`;
const rows = P.features.map((f) => `<tr><th scope="row">${esc(f.label || f.name)}</th>${P.packages.map((p) => `<td>${has(f, p.id) ? "Var" : "Yok"}</td>`).join("")}</tr>`).join("");

const block = `<!-- QRMO:PAKET-STATIK:START -->
        <div class="qrmo-pricing-fallback">
          <p>Paket kartları JavaScript ile yüklenir. Paketlerin fiyat ve özellik özeti:</p>
          <table><thead>${head}</thead><tbody>${price}${rows}</tbody></table>
          <p>Yıllık ödemede ${P.annual.usedMonths} ay kullanım için ${P.annual.payMonths} aylık ücret ödenir. Sistem online ödeme almaz. Seçim için <a href="../iletisim/">iletişim kanallarını</a> kullanın.</p>
        </div>
        <!-- QRMO:PAKET-STATIK:END -->`;

const file = path.join(root, "paketler/index.html");
let html = fs.readFileSync(file, "utf8");
const marked = /<!-- QRMO:PAKET-STATIK:START -->[\s\S]*?<!-- QRMO:PAKET-STATIK:END -->/;
if (marked.test(html)) html = html.replace(marked, block);
else {
  const old = /(<noscript>\s*)<div class="qrmo-pricing-fallback">[\s\S]*?<\/div>(\s*<\/noscript>)/;
  if (!old.test(html)) throw new Error("noscript özeti bulunamadı");
  html = html.replace(old, `$1${block}$2`);
}
fs.writeFileSync(file, html);
console.log(`paketler/index.html: noscript özeti ${P.features.length} özellik × ${P.packages.length} paket`);
