#!/usr/bin/env node
/* =========================================================
   Ana sayfa gömülü CSS → css/home-sections.css (önbelleğe alınabilir tek dosya).
   Kullanım: node tools/home-css-extract.mjs   (tekrar çalıştırılabilir)

   Kural sırası korunur: yalnızca <head>'deki son stil dosyasından sonra, gövdede
   ARALARINDA BAŞKA <link rel=stylesheet> BULUNMAYAN ilk ardışık <style> blokları
   taşınır; bunlar <head> sonuna tek <link> olarak bağlanır. Harici dosyaların
   arasına düşen bloklar (sıra bağımlılığı) yerinde kalır.
   Bir bölüm sections/*.html'den yeniden yapıştırılırsa bu komutu tekrar çalıştırın.
========================================================= */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "index.html");
const outRel = "css/home-sections.css";
const outPath = path.join(root, outRel);
let html = fs.readFileSync(indexPath, "utf8");

const LINK_RE = /<link\b[^>]*rel="stylesheet"[^>]*>/g;
const STYLE_RE = /<style(\s[^>]*)?>([\s\S]*?)<\/style>/g;
const marker = /<link rel="stylesheet" href="css\/home-sections\.css\?v=[a-f0-9]+" data-home-sections>\n?/;

/* Daha önce taşınmış içerik: dosyadaki CSS en başta kalır, yeni bloklar sona eklenir. */
let prev = "";
if (marker.test(html) && fs.existsSync(outPath)) prev = fs.readFileSync(outPath, "utf8");
html = html.replace(marker, "");

const headEnd = html.indexOf("</head>");
const links = [...html.matchAll(LINK_RE)].map((m) => m.index);
const firstBodyLink = links.find((i) => i > headEnd) ?? Infinity;

const moved = [];
html = html.replace(STYLE_RE, (all, attrs, css, at) => {
  if (at < headEnd || at > firstBodyLink || (attrs && /media=|nonce=/.test(attrs))) return all;
  if (/url\(\s*['"]?(?!data:|https?:|\/)/.test(css) || /@import/.test(css)) return all;
  moved.push(css.trim());
  return "";
});

if (!moved.length && !prev) {
  console.log("Taşınacak gömülü stil yok.");
  process.exit(0);
}

const css = (prev ? prev.trimEnd() + "\n\n" : "/* Üretilen dosya — elle düzenlemeyin. Kaynak: index.html gömülü stilleri (tools/home-css-extract.mjs). */\n\n") + moved.join("\n\n") + (moved.length ? "\n" : "");
fs.writeFileSync(outPath, css);
const v = crypto.createHash("sha1").update(css).digest("hex").slice(0, 8);
const tag = `<link rel="stylesheet" href="${outRel}?v=${v}" data-home-sections>\n`;
html = html.slice(0, headEnd) + tag + html.slice(headEnd);
fs.writeFileSync(indexPath, html);
console.log(`${moved.length} blok taşındı → ${outRel} (${Math.round(css.length / 1024)} KB), index.html ${Math.round(html.length / 1024)} KB`);
