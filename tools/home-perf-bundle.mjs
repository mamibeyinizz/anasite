#!/usr/bin/env node
/* =========================================================
   Ana sayfa performans paketleyicisi (görünüm değişmez).
   Kullanım:  npm i --no-save esbuild   (bir kez)  →  node tools/home-perf-bundle.mjs

   Sorun: index.html ~30 ayrı render-engelleyen CSS bağlıyordu; yarısı gövde SONUNDA olduğundan
   ilk boyama eski stille yapılıp sonradan yeniden diziliyordu (mobil CLS 0.41). Çözüm:
   kaynaklar (css/*.css, js/*.js — burada düzenlenir) kaynak sırası KORUNARAK küçültülüp
   birleştirilir, <head>'e yazılır. Kaskad sırası değişmez.

   Çıktı: assets/build/*.<özet>.{css,js}  (assets/build/.htaccess → 1 yıl immutable)
   CSS-A: global CSS'ten önceki dosyalar · global/dist/qrmo-global.css aynen kalır (tüm sayfalarla paylaşılır)
   CSS-B: home-sections.css + global'den sonraki her şey (eski gövde-sonu bağlantıları dahil)
   JS-A : defer ile yüklenen ana sayfa betikleri (sıra aynı) · JS-B: home-reviews.js
   Sıra/kaynak listesi tools/home-perf-manifest.json içindedir; yeni dosya eklerken oraya ekleyin.
========================================================= */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const P = (...a) => path.join(root, ...a);
const manifestPath = P("tools/home-perf-manifest.json");
const indexPath = P("index.html");
const outDir = P("assets/build");

let esbuild;
try {
  esbuild = await import("esbuild");
} catch {
  console.error("esbuild yok: npm i --no-save esbuild");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const read = (rel) => fs.readFileSync(P(rel), "utf8");
const hash = (s) => crypto.createHash("sha1").update(s).digest("hex").slice(0, 8);

async function cssOf(files) {
  const parts = [];
  for (const f of files) {
    const out = await esbuild.transform(read(f), { loader: "css", minify: true, legalComments: "none" });
    /* Çıktı assets/build/ içinde: css/ klasörüne göre yazılmış ../assets/… yolları ../… olur. */
    parts.push(out.code.trim().replace(/url\((["']?)\.\.\/assets\//g, "url($1../"));
  }
  return parts.join("\n");
}
async function jsOf(files) {
  const parts = [];
  for (const f of files) {
    const out = await esbuild.transform(read(f), { loader: "js", minify: true, legalComments: "none", target: "es2019" });
    parts.push(out.code.trim().replace(/;$/, ""));
  }
  return parts.join(";\n") + ";";
}

fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (/^home-.*\.(css|js)$/.test(f)) fs.unlinkSync(path.join(outDir, f));

const built = {};
for (const [key, kind, files] of [
  ["cssA", "css", manifest.cssA],
  ["cssB", "css", manifest.cssB],
  ["jsA", "js", manifest.jsA],
  ["jsB", "js", manifest.jsB],
]) {
  const code = kind === "css" ? await cssOf(files) : await jsOf(files);
  const name = `home-${key.toLowerCase()}.${hash(code)}.${kind}`;
  fs.writeFileSync(path.join(outDir, name), code);
  built[key] = `assets/build/${name}`;
  console.log(key, files.length, "dosya →", name, (code.length / 1024).toFixed(1), "KB");
}

fs.writeFileSync(
  path.join(outDir, ".htaccess"),
  `# Özet adlı üretim dosyaları: içerik değişince ad değişir → 1 yıl immutable güvenli.
<IfModule mod_headers.c>
Header set Cache-Control "public, max-age=31536000, immutable"
</IfModule>
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/css "access plus 1 year"
ExpiresByType text/javascript "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
</IfModule>
`
);

/* index.html: işaretçili bloklar (yoksa ilk çalıştırmada kurulur — bkz. --init). */
let html = fs.readFileSync(indexPath, "utf8");
const block = (n, body) => `<!-- QRMO:PERF:${n}:START -->\n${body}\n<!-- QRMO:PERF:${n}:END -->`;
const re = (n) => new RegExp(`<!-- QRMO:PERF:${n}:START -->[\\s\\S]*?<!-- QRMO:PERF:${n}:END -->`);
const tags = {
  CSSA: `<link rel="stylesheet" href="${built.cssA}">`,
  CSSB: `<link rel="stylesheet" href="${built.cssB}">`,
  JSA: `<script defer src="${built.jsA}"></script>`,
  JSB: `<script defer src="${built.jsB}"></script>`,
};
for (const n of Object.keys(tags)) {
  if (!re(n).test(html)) {
    console.error(`index.html'de QRMO:PERF:${n} işaretçisi yok (ilk kurulum için bkz. git geçmişi: ilk kurulum işaretçileri)`);
    process.exit(1);
  }
  html = html.replace(re(n), () => block(n, tags[n]));
}
fs.writeFileSync(indexPath, html);
console.log("index.html güncellendi");
