// node sprites/uret.mjs → assets/figur/*.png (2× çözünürlük, şeffaf, alfa kenarı temiz) + assets/figur/manifest.json
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { spawnSync } from 'node:child_process';
import { baslat, CHROME_ARGS, KOK, DIR } from '../srv.mjs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const OUT = path.join(KOK, 'assets/figur'); fs.mkdirSync(OUT, { recursive: true });
const s = await baslat(); const b = await chromium.launch({ args: CHROME_ARGS, env: { ...process.env, NO_PROXY: '127.0.0.1' } });
const p = await (await b.newContext({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 2 })).newPage(); p.on('pageerror', (e) => console.error('[sayfa]', e.message));
await p.goto(s.URL + '/sprite'); await p.waitForFunction('window.hazir===true', null, { timeout: 120000 });
const adlar = await p.evaluate(() => window.adlar); const man = {};
for (const ad of adlar) { const r = await p.evaluate((a) => window.ciz(a), ad); const f = path.join(OUT, ad + '.png'); await p.screenshot({ path: f, omitBackground: true, type: 'png' });
  const py = spawnSync('python3', [path.join(DIR, 'sprites', 'kirp.py'), f], { encoding: 'utf8' }); if (py.status) { console.error(py.stderr); process.exit(1); }
  const k = JSON.parse(py.stdout); man[ad] = { dosya: `figur/${ad}.png`, genislik: k.w / 2, yukseklik: k.h / 2, px2x: [k.w, k.h], bbox: r.bbox, kirpOfs: [k.x0, k.y0], anchors: Object.fromEntries(Object.entries(r.anchors).map(([n, v]) => [n, Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' ? [(1000 + v[0] * 2 - k.x0) / 2, (1000 - v[1] * 2 - k.y0) / 2] : v])) };
  if (r.anchors.ekranBoyut) man[ad].ekran = { merkez: [(1000 - k.x0) / 2, (1000 - k.y0) / 2], boyut: r.anchors.ekranBoyut };
  console.log(ad, k.w + '×' + k.h); }
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(man, null, 1)); await b.close(); s.kapat(); process.exit(0);
