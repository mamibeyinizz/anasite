/* Bir sayfa HTML'ine global header/footer + head bağlantılarını yerleştirir.
   İşaretçiler (<!-- QRMO:…:START/END -->) varsa arasını yeniler, yoksa ekler;
   böylece komut tekrar tekrar çalıştırılabilir. */
import { renderHeader, renderFooter } from "./render.mjs";

const block = (name, body) => `<!-- QRMO:${name}:START -->\n${body}\n<!-- QRMO:${name}:END -->`;
const re = (name) => new RegExp(`<!-- QRMO:${name}:START -->[\\s\\S]*?<!-- QRMO:${name}:END -->`);

export function applyGlobal(html, { rel = "", current = "", skip = "icerik", exact = false } = {}) {
  const head = block(
    "HEAD",
    `<link rel="icon" type="image/svg+xml" href="${rel}assets/brand/favicon.svg?v=4">\n<link rel="icon" type="image/png" sizes="32x32" href="${rel}assets/brand/favicon-32.png?v=4">\n<link rel="icon" type="image/png" sizes="16x16" href="${rel}assets/brand/favicon-16.png?v=4">\n<link rel="apple-touch-icon" href="${rel}assets/brand/apple-touch-icon.png?v=4">\n<link rel="stylesheet" href="${rel}global/dist/qrmo-global.css">\n<script src="${rel}global/dist/qrmo-conversion-config.js"></script>\n<script defer src="${rel}global/dist/qrmo-global.js"></script>`
  );
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
