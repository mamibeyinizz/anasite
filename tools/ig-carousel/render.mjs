// Kullanım: node tools/ig-carousel/render.mjs [html] [çıktı-dizini]
// Varsayılan: referans-coklu-dil.html → out/slayt-1..5.png (1080×1440)
import { chromium } from 'playwright';
import path from 'node:path'; import { fileURLToPath } from 'node:url';
const D = path.dirname(fileURLToPath(import.meta.url));
const html = path.resolve(process.argv[2] || path.join(D, 'referans-coklu-dil.html'));
const out = path.resolve(process.argv[3] || path.join(D, 'out'));
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1440 } });
for (let i = 1; i <= 5; i++) {
  await p.goto(`file://${html}?s=${i}`); await p.waitForFunction('document.body.dataset.ready');
  await p.screenshot({ path: path.join(out, `slayt-${i}.png`) });
}
await b.close();
