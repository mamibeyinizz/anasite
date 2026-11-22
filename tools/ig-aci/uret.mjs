// kullanım: node uret.mjs data/<modul>.json [çıktı-dizini]
// Tek şablon (sablon.html) + JSON → 1080×1440 JPG. Hiçbir tasarım değeri JSON'da yok; yalnız metin.
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const dir = path.dirname(new URL(import.meta.url).pathname);
const veri = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = process.argv[3] || path.join(dir, 'out'); fs.mkdirSync(out, { recursive: true });
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const bold = t => esc(t).replace(/\[\[(.+?)\]\]/g, '<b>$1</b>');
const satir = a => a.map(t => `<span>${bold(t)}</span>`).join('');
let html = fs.readFileSync(path.join(dir, 'sablon.html'), 'utf8');
// logo (koyu varyant) şablona gömülür
const logo = fs.readFileSync(path.join(dir, '../../assets/brand/qr-menu-official-logo-v4-dark.svg'), 'utf8').replace(/<title[^>]*>.*?<\/title>/s, '');
html = html.replace(/<div class="logo">[\s\S]*?<\/div>\n<\/div>/, `<div class="logo">${logo}</div>\n</div>`);
html = html.replace('{{MODUL}}', esc(veri.modul)).replace('{{Q}}', satir(veri.soru)).replace('{{S}}', satir(veri.cevap));
const gecici = path.join(dir, `.tmp-${veri.id}.html`); fs.writeFileSync(gecici, html);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1440 }, deviceScaleFactor: 1 });
await p.goto('file://' + gecici); await p.waitForFunction(() => document.body.dataset.ready);
const png = path.join(out, `${veri.id}.png`); await p.screenshot({ path: png }); await b.close(); fs.unlinkSync(gecici);
console.log('yazıldı:', png);
