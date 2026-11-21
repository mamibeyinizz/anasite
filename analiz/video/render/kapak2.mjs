// Kapak v2: A/B/C kanca varyantları (aynı görsel, yalnız metin değişir). Çıktı: kapak/_ham-{A,B,C}.png + _olcum2.json
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
import { baslat, CHROME_ARGS } from './sunucu.mjs';
const { chromium } = createRequire(import.meta.url)('playwright'); const DIR = path.dirname(fileURLToPath(import.meta.url)); const OUT = path.resolve(DIR, '..', 'kapak');
const G = (t) => `<span style="color:#C9A84C">${t}</span>`, K = (t) => `<span style="color:#F4F1E8">${t}</span>`;
const V = { A: K('Garsonunuz') + '<br>' + G('tercüman') + K(' mı?'), B: K('Menüyü ') + G('kim') + '<br>' + K('anlatacak?'), C: K('Garson ') + G('tercümanlık') + '<br>' + K('yapmasın.') };
const out = {};
for (const [ad, html] of Object.entries(V)) {
  const s = await baslat(); const b = await chromium.launch({ args: CHROME_ARGS, env: { ...process.env, NO_PROXY: '127.0.0.1,localhost' } });
  const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage(); await p.goto(s.URL); await p.waitForFunction('window.hazir===true');
  out[ad] = await p.evaluate((o) => window.kapakKur2(o), { html, metinY: 548, pilY: 462, logoY: 1552, grupY: [905, 1520], genislik: 1000 });
  await p.screenshot({ path: path.join(OUT, `_ham-${ad}.png`), type: 'png' }); await b.close(); s.kapat();
}
fs.writeFileSync(path.join(OUT, '_olcum2.json'), JSON.stringify(out, null, 1)); for (const [k, v] of Object.entries(out)) console.log(k, 'metinPx', v.metinPx, 'grup', Math.round(v.grup.w), Math.round(v.grup.y0), Math.round(v.grup.y1), 'soru', Math.round(v.soruBalonu.w), 'metin', Math.round(v.metin.x0), Math.round(v.metin.x1), Math.round(v.metin.y0), Math.round(v.metin.y1));
process.exit(0);
