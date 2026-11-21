// Kare kare render: statik sunucu + Playwright (swiftshader) + paralel işçiler.
// Kullanım: node render.mjs --out DIR [--from 0 --to 840 --workers 4] | --times 0,3.5,10 --out DIR
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const DIR = path.dirname(fileURLToPath(import.meta.url));
const VIDEO = path.resolve(DIR, '..');
const ROOT = path.resolve(VIDEO, '..', '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = path.resolve(arg('out', path.join(DIR, 'kare')));
const FPS = 30, N = 840;
const MIME = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const ROUTES = [['/scene.mjs', path.join(DIR, 'scene.mjs')], ['/render/boxes.json', path.join(DIR, 'boxes.json')], ['/tex/', path.join(DIR, 'tex') + '/'], ['/vendor/', path.join(VIDEO, 'vendor') + '/'], ['/fonts/', path.join(ROOT, 'assets/fonts') + '/'], ['/brand/', path.join(ROOT, 'assets/brand') + '/']];
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let f = u === '/' ? path.join(DIR, 'index.html') : null;
  for (const [pre, dest] of ROUTES) { if (u === pre) f = dest; else if (pre.endsWith('/') && u.startsWith(pre)) f = path.join(dest, u.slice(pre.length)); }
  if (!f || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end('yok'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const URL = 'http://127.0.0.1:' + server.address().port + '/';
fs.mkdirSync(OUT, { recursive: true });
const proxyEnv = { ...process.env, NO_PROXY: '127.0.0.1,localhost', no_proxy: '127.0.0.1,localhost' };
async function isci(liste, ad) {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-vsync'], env: proxyEnv });
  const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage();
  p.on('pageerror', (e) => console.error('[sayfa hatası]', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.error('[konsol]', m.text()); });
  await p.goto(URL); await p.waitForFunction('window.hazir === true', null, { timeout: 120000 });
  let n = 0;
  for (const [dosya, t] of liste) {
    await p.evaluate((tt) => window.frame(tt), t);
    await p.screenshot({ path: path.join(OUT, dosya), type: 'jpeg', quality: 96 });
    if (++n % 40 === 0) console.log(ad, n + '/' + liste.length);
  }
  await b.close();
}
if (arg('olc')) {   // güvenli bölge + en küçük yazı ölçümü (DOM kutuları), görüntü almadan
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'], env: proxyEnv });
  const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 } })).newPage();
  await p.goto(URL); await p.waitForFunction('window.hazir === true', null, { timeout: 120000 });
  const SAFE = { l: 65, r: 1015, t: 270, b: 1248 };
  const ihlal = [], gorunen = {}; let enKucuk = 999;
  for (let i = 0; i < N; i++) {
    const t = i / FPS;
    const r = await p.evaluate((tt) => { window.frame(tt); const out = [];
      document.querySelectorAll('.hero,.cap,.chip,.badge,.lab,.adres,.logo,.ok').forEach((e) => { const o = parseFloat(e.style.opacity || getComputedStyle(e).opacity); if (!(o > 0.35)) return;
        const q = e.getBoundingClientRect(); const fs = parseFloat(getComputedStyle(e).fontSize);
        out.push({ id: e.id, l: q.left, r: q.right, t: q.top, b: q.bottom, fs: e.tagName === 'IMG' || e.id === 'ok' ? null : fs, txt: (e.textContent || '').slice(0, 30) }); });
      return out; }, t);
    for (const e of r) {
      gorunen[e.id] = (gorunen[e.id] || 0) + 1;
      if (e.fs !== null) enKucuk = Math.min(enKucuk, e.fs);
      if (e.l < SAFE.l - 1 || e.r > SAFE.r + 1 || e.t < SAFE.t - 1 || e.b > SAFE.b + 1) ihlal.push({ t: +t.toFixed(2), id: e.id, l: Math.round(e.l), r: Math.round(e.r), t0: Math.round(e.t), b: Math.round(e.b) });
    }
  }
  fs.mkdirSync(OUT, { recursive: true });
  const kaptan = await p.evaluate(() => window.__kaptan);
  fs.writeFileSync(path.join(OUT, 'guvenli-bolge.json'), JSON.stringify({ guvenli: SAFE, enKucukYazi: enKucuk, ihlalSayisi: ihlal.length, ihlaller: ihlal.slice(0, 60), gorunenKareSayisi: gorunen, kaptan }, null, 1));
  console.log('olçüm bitti: ihlal', ihlal.length, '| en küçük yazı', enKucuk, 'px');
  await b.close(); server.close(); process.exit(0);
}
let isler;
if (arg('times')) isler = arg('times').split(',').map((x) => [`t-${x.padStart(5, '0')}.jpg`, parseFloat(x)]);
else { const a = parseInt(arg('from', '0')), z = parseInt(arg('to', String(N))); isler = []; for (let i = a; i < z; i++) isler.push([`kare-${String(i).padStart(5, '0')}.jpg`, i / FPS]); }
const W = Math.min(parseInt(arg('workers', '4')), isler.length);
const parcalar = Array.from({ length: W }, (_, k) => isler.filter((_, i) => i % W === k));
const t0 = Date.now();
await Promise.all(parcalar.map((l, k) => isci(l, 'işçi' + k)));
console.log('bitti', isler.length, 'kare,', ((Date.now() - t0) / 1000).toFixed(0), 'sn');
server.close();
