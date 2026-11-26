// Kullanım: node tools/ig-split/uret.mjs data/<modul>.json <çıktı-dizini>   (DSF=2 → 2160×2880)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const D = path.dirname(fileURLToPath(import.meta.url));
const v = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = path.resolve(process.argv[3] || path.join(D, 'out')); fs.mkdirSync(out, { recursive: true });
const dsf = +(process.env.DSF || 1);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 3240, height: 1440 }, deviceScaleFactor: dsf });
await p.goto(`file://${path.join(D, 'sablon.html')}?v=${encodeURIComponent(JSON.stringify(v))}`);
await p.waitForFunction('document.body.dataset.ready');
await p.screenshot({ path: path.join(out, `${v.id}-serit.png`) });
for (let i = 0; i < 3; i++) await p.screenshot({ path: path.join(out, `${v.id}-${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1440 } });
await b.close(); console.log('yazıldı:', out);
