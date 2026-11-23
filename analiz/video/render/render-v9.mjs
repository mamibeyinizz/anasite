// v8 kare kare render (DOM/CSS, three.js yok). Kullanım: node render-v9.mjs --anahtar | --out DIR [--from 0 --to N --workers 4] | --times 1.2,3.4 --out DIR | --bos --out DIR (arka plan, doluluk testi)
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
import { baslat, CHROME_ARGS } from './sunucu-v9.mjs';
const { chromium } = createRequire(import.meta.url)('playwright'); const DIR = path.dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; }; const has = (k) => process.argv.includes('--' + k);
const sunucu = await baslat(); const env = { ...process.env, NO_PROXY: '127.0.0.1,localhost', no_proxy: '127.0.0.1,localhost' };
async function sayfa(b) { const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage(); p.on('pageerror', (e) => console.error('[sayfa hatası]', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.error('[konsol]', m.text()); });
  await p.goto(sunucu.URL); await p.waitForFunction('window.hazir === true', null, { timeout: 120000 }); return p; }
if (has('anahtar')) {
  const OUT = path.resolve(arg('out', path.join(DIR, '..', 'out', 'kontrol-v9'))); fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch({ args: CHROME_ARGS, env }); const p = await sayfa(b); const T = await p.evaluate(() => window.__tl); const S = T.S;
  const ort = (i, k = 0.5) => S[i].baslangic + k * (S[i].bitis - S[i].baslangic);
  const liste = [['1-kanca', S[0].baslangic + 1.9], ['2-aci', ort(1, 0.75)], ['3-donus', T.T.r3 + 1.2], ['4-dil-secici', S[3].baslangic + 0.9], ['5-en-menu', S[4].baslangic + 0.95 * (S[4].bitis - S[4].baslangic)], ['6-diller', ort(6, 0.6)], ['7-csv-vurgusu', T.tCSV + 0.5], ['8-kapanis', ort(11, 0.55)], ['9a-gecis-4.4s', 4.4], ['9b-gecis-4.6s', 4.6], ['9c-loop-gecis', T.KAPAN + 0.25], ['9d-loop-gecis', T.KAPAN + 0.5]];
  for (const [ad, t] of liste) { await p.evaluate((x) => window.frame(x), t); await p.screenshot({ path: path.join(OUT, `${ad}.png`), type: 'png' }); console.log(ad, t.toFixed(2)); }
  await b.close(); sunucu.kapat(); process.exit(0);
}
const OUT = path.resolve(arg('out', path.join(DIR, 'kare9'))); fs.mkdirSync(OUT, { recursive: true }); const FPS = 30;
const T0 = await (async () => { const b = await chromium.launch({ args: CHROME_ARGS, env }); const p = await sayfa(b); const t = await p.evaluate(() => window.__tl); await b.close(); return t; })();
const bos = has('bos'); let isler; if (arg('times')) isler = arg('times').split(',').map((x) => [`t-${x.padStart(5, '0')}.png`, parseFloat(x)]); else { const a = parseInt(arg('from', '0')), z = parseInt(arg('to', String(T0.KARE))); isler = []; for (let i = a; i < z; i++) isler.push([`kare-${String(i).padStart(5, '0')}.${bos ? 'png' : 'jpg'}`, i / FPS]); }
const W = parseInt(arg('workers', '4')); const parca = Array.from({ length: W }, (_, k) => isler.filter((_, i) => i % W === k));
await Promise.all(parca.map(async (liste, k) => { const b = await chromium.launch({ args: CHROME_ARGS, env }); const p = await sayfa(b); let n = 0; for (const [d, t] of liste) { await p.evaluate(([x, bs, dk]) => (bs ? window.__bos(x, dk) : window.frame(x)), [t, bos, has('dekor')]); await p.screenshot(d.endsWith('.png') ? { path: path.join(OUT, d), type: 'png' } : { path: path.join(OUT, d), type: 'jpeg', quality: 96 }); if (++n % 40 === 0) console.log('işçi' + k, n + '/' + liste.length); } await b.close(); }));
console.log('bitti', isler.length, 'kare'); sunucu.kapat(); process.exit(0);
