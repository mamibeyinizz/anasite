/* Bir sayfa HTML'ine global header/footer + head bağlantılarını yerleştirir.
   İşaretçiler (<!-- QRMO:…:START/END -->) varsa arasını yeniler, yoksa ekler;
   böylece komut tekrar tekrar çalıştırılabilir. */
import { renderHeader, renderFooter } from "./render.mjs";

const block = (name, body) => `<!-- QRMO:${name}:START -->\n${body}\n<!-- QRMO:${name}:END -->`;
const re = (name) => new RegExp(`<!-- QRMO:${name}:START -->[\\s\\S]*?<!-- QRMO:${name}:END -->`);

export function applyGlobal(html, { rel = "", current = "", skip = "icerik", exact = false } = {}) {
  const head = block(
    "HEAD",
    `<link rel="stylesheet" href="${rel}global/dist/qrmo-global.css">\n<script src="${rel}global/dist/qrmo-conversion-config.js"></script>\n<script defer src="${rel}global/dist/qrmo-global.js"></script>`
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
