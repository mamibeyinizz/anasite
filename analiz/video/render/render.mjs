// Kare kare render: statik sunucu + Playwright (swiftshader) + paralel işçiler.
// Kullanım: node render.mjs --out DIR [--from 0 --to 840 --workers 4 --atla-layout] | --times 0,3.5,10 --out DIR
// ÖNCE yerleşim testi (layout_check.mjs) çalışır; kırmızıysa render DURUR.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module'; import { spawnSync } from 'node:child_process';
import { baslat, CHROME_ARGS } from './sunucu.mjs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const DIR = path.dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const has = (k) => process.argv.includes('--' + k);
const OUT = path.resolve(arg('out', path.join(DIR, 'kare')));
const FPS = 30, N = 840;
if (!has('atla-layout') && !arg('times')) {
  const r = spawnSync('node', [path.join(DIR, 'layout_check.mjs')], { stdio: 'inherit', env: process.env });
  if (r.status !== 0) { console.error('\nYERLEŞİM TESTİ KIRMIZI — render durduruldu.'); process.exit(3); }
}
const sunucu = await baslat(); const URL = sunucu.URL;
fs.mkdirSync(OUT, { recursive: true });
const env = { ...process.env, NO_PROXY: '127.0.0.1,localhost', no_proxy: '127.0.0.1,localhost' };
async function isci(liste, ad) {
  const b = await chromium.launch({ args: CHROME_ARGS, env });
  const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage();
  p.on('pageerror', (e) => console.error('[sayfa hatası]', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.error('[konsol]', m.text()); });
  await p.goto(URL); await p.waitForFunction('window.hazir === true', null, { timeout: 120000 });
  let n = 0;
  for (const [dosya, t] of liste) { await p.evaluate((tt) => window.frame(tt), t); await p.screenshot({ path: path.join(OUT, dosya), type: 'jpeg', quality: 96 }); if (++n % 40 === 0) console.log(ad, n + '/' + liste.length); }
  await b.close();
}
let isler;
if (arg('times')) isler = arg('times').split(',').map((x) => [`t-${x.padStart(5, '0')}.jpg`, parseFloat(x)]);
else { const a = parseInt(arg('from', '0')), z = parseInt(arg('to', String(N))); isler = []; for (let i = a; i < z; i++) isler.push([`kare-${String(i).padStart(5, '0')}.jpg`, i / FPS]); }
const W = Math.min(parseInt(arg('workers', '4')), isler.length);
const parcalar = Array.from({ length: W }, (_, k) => isler.filter((_, i) => i % W === k));
const t0 = Date.now(); await Promise.all(parcalar.map((l, k) => isci(l, 'işçi' + k)));
console.log('bitti', isler.length, 'kare,', ((Date.now() - t0) / 1000).toFixed(0), 'sn'); sunucu.kapat();
