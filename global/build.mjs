#!/usr/bin/env node
/* =========================================================
   QR MENU OFFICIAL — GLOBAL HEADER / FOOTER ÜRETİCİSİ
   Kullanım:  node global/build.mjs

   GitHub Pages Node çalıştırmaz; bu betik yerelde çalıştırılır ve SONUCU
   repoya commit edilir:
     global/dist/qrmo-global.css   src/header.css + src/footer.css + src/consent.css
     global/dist/qrmo-global.js    src/header.js  + src/footer.js + src/conversion.js + src/analytics.js
     global/dist/qrmo-header.html  başvuru parçası (kök dizin sayfası için)
     global/dist/qrmo-footer.html  başvuru parçası
   ve statik sayfalara header/footer HTML'i doğrudan yazılır:
     index.html · paketler/index.html · iletisim/index.html · canli-menu/index.html
   Modül sayfaları (moduller/build.js) ve SSS (sss/build.mjs) kendi üreticilerinde
   aynı `applyGlobal()` fonksiyonunu çağırır; hepsi tek kaynaktan beslenir.
   İşaretçiler sayesinde komut tekrar çalıştırılabilir (idempotent).
========================================================= */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderHeader, renderFooter } from "./render.mjs";
import { applyGlobal, headLinks } from "./inject.mjs";
import { CONVERSION_PENDING } from "./nav-data.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const read = (p) => fs.readFileSync(path.join(here, p), "utf8");
const write = (p, s) => fs.writeFileSync(path.join(here, p), s);

fs.mkdirSync(path.join(here, "dist"), { recursive: true });
write("dist/qrmo-global.css", `/* Üretilmiştir: node global/build.mjs — düzenlemeyin (kaynak: global/src/*.css) */\n${read("src/header.css")}\n${read("src/footer.css")}\n${read("src/consent.css")}`);
write(
  "dist/qrmo-conversion-config.js",
  `/* Üretilmiştir: node global/build.mjs — kaynak: global/nav-data.mjs */\nwindow.QRMO_CONVERSION=${JSON.stringify({ pending: CONVERSION_PENDING })};\n`
);
write(
  "dist/qrmo-global.js",
  `/* Üretilmiştir: node global/build.mjs — düzenlemeyin (kaynak: global/src/*.js) */\n${read("src/header.js")}\n${read("src/footer.js")}\n${read("src/conversion.js")}\n${read("src/analytics.js")}`
);
write("dist/qrmo-header.html", renderHeader({ rel: "", current: "home" }) + "\n");
write("dist/qrmo-footer.html", renderFooter({ rel: "", current: "home" }) + "\n");

/* PHP blog oluşturucusu (backend/src/Site/BlogView.php) için derinliğe özel parçalar:
   /blog/ → ../ , /blog/<slug>/ → ../../ ; üst menüde "Blog" işaretli. */
fs.mkdirSync(path.join(here, "dist/partials"), { recursive: true });
for (const [d, rel] of [["d1", "../"], ["d2", "../../"]]) {
  write(`dist/partials/head-${d}.html`, headLinks(rel) + "\n");
  write(`dist/partials/header-${d}.html`, renderHeader({ rel, current: "blog", skip: "icerik" }) + "\n");
  write(`dist/partials/footer-${d}.html`, renderFooter({ rel, current: "blog" }) + "\n");
}

const PAGES = [
  { file: "index.html", rel: "", current: "home", skip: "icerik" },
  { file: "paketler/index.html", rel: "../", current: "paketler", skip: "qrmo-pricing" },
  { file: "iletisim/index.html", rel: "../", current: "iletisim", skip: "icerik" },
  { file: "canli-menu/index.html", rel: "../", current: "canli", skip: "icerik" }
];
for (const p of PAGES) {
  const f = path.join(root, p.file);
  const before = fs.readFileSync(f, "utf8");
  const after = applyGlobal(before, p);
  if (after !== before) fs.writeFileSync(f, after);
  console.log(`${after !== before ? "güncellendi" : "değişmedi  "} ${p.file}`);
}
console.log("global/dist üretildi.");
