/* Bir sayfa HTML'ine global header/footer + head bağlantılarını yerleştirir.
   İşaretçiler (<!-- QRMO:…:START/END -->) varsa arasını yeniler, yoksa ekler;
   böylece komut tekrar tekrar çalıştırılabilir. */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { renderHeader, renderFooter } from "./render.mjs";

/* Global CSS/JS adreslerine eklenen sürüm: global/src içeriğinin özeti. Dosyalar değişince adres değişir;
   böylece dağıtımdan sonra tarayıcı/CDN eski header CSS-JS'ini sunmaz. dist'e değil kaynağa bakar
   (dist, sayfalardan sonra üretilse de sürüm aynı çıkar). */
const SRC = path.join(path.dirname(fileURLToPath(import.meta.url)), "src");
export const ASSET_V = crypto
  .createHash("sha1")
  .update(fs.readdirSync(SRC).filter((f) => /\.(css|js)$/.test(f)).sort().map((f) => f + fs.readFileSync(path.join(SRC, f), "utf8")).join("\n"))
  .digest("hex")
  .slice(0, 8);

const block = (name, body) => `<!-- QRMO:${name}:START -->\n${body}\n<!-- QRMO:${name}:END -->`;
const re = (name) => new RegExp(`<!-- QRMO:${name}:START -->[\\s\\S]*?<!-- QRMO:${name}:END -->`);

export const headLinks = (rel) =>
  `<link rel="icon" type="image/svg+xml" href="${rel}assets/brand/favicon.svg?v=4">\n<link rel="icon" type="image/png" sizes="32x32" href="${rel}assets/brand/favicon-32.png?v=4">\n<link rel="icon" type="image/png" sizes="16x16" href="${rel}assets/brand/favicon-16.png?v=4">\n<link rel="apple-touch-icon" href="${rel}assets/brand/apple-touch-icon.png?v=4">\n<link rel="preload" href="${rel}assets/fonts/manrope-var-latin.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="${rel}assets/fonts/manrope-var-latin-ext.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="stylesheet" href="${rel}global/dist/qrmo-global.css?v=${ASSET_V}">\n<script src="${rel}global/dist/qrmo-conversion-config.js?v=${ASSET_V}"></script>\n<script defer src="${rel}global/dist/qrmo-global.js?v=${ASSET_V}"></script>`;

export function applyGlobal(html, { rel = "", current = "", skip = "icerik", exact = false } = {}) {
  const head = block("HEAD", headLinks(rel));
  const header = block("HEADER", renderHeader({ rel, current, skip, exact }));
  const footer = block("FOOTER", renderFooter({ rel, current }));

  const put = (src, name, content, insert) => (re(name).test(src) ? src.replace(re(name), () => content) : insert(src, content));
  let out = html;
  out = put(out, "HEAD", head, (s, c) => s.replace("</head>", () => `${c}\n</head>`));
  out = put(out, "HEADER", header, (s, c) => s.replace(/<body[^>]*>/, (m) => `${m}\n${c}`));
  out = put(out, "FOOTER", footer, (s, c) => s.replace(/<\/body>/, () => `${c}\n</body>`));
  for (const m of ["<head>", "<body", "</body>", "QRMO:HEADER:START", "QRMO:FOOTER:START", "QRMO:HEAD:START"]) {
    if (!out.includes(m)) throw new Error(`applyGlobal: sayfada bulunamadı: ${m}`);
  }
  return out;
}
