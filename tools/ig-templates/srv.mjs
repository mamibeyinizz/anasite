// Yerel statik sunucu: şablonlar, tokens, yerel Manrope, logo, figür sprite'ları, gerçek ekran görüntüleri, three.js. Dışarıya istek YOK.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
export const DIR = path.dirname(fileURLToPath(import.meta.url)); export const KOK = path.resolve(DIR, '..', '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.css': 'text/css' };
const ROUTES = [['/three/', path.join(KOK, 'analiz/video/vendor/three') + '/'], ['/fonts/', path.join(KOK, 'assets/fonts') + '/'], ['/brand/', path.join(KOK, 'assets/brand') + '/'], ['/figur/', path.join(KOK, 'assets/figur') + '/'],
  ['/ekran/', path.join(KOK, 'analiz/video/ekran') + '/'], ['/sprites/', path.join(DIR, 'sprites') + '/'], ['/templates/', path.join(DIR, 'templates') + '/'], ['/tokens.json', path.join(DIR, 'tokens.json')]];
export async function baslat(veri = {}) {
  const state = { veri };
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]); let f = null;
    if (u === '/veri.json') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify(state.veri)); }
    if (u === '/') f = path.join(DIR, 'templates', 'sayfa.html'); if (u === '/sprite') f = path.join(DIR, 'sprites', 'sprite.html');
    for (const [pre, dest] of ROUTES) { if (u === pre) f = dest; else if (pre.endsWith('/') && u.startsWith(pre) && !u.includes('..')) f = path.join(dest, u.slice(pre.length)); }
    if (!f || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end('yok'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { URL: 'http://127.0.0.1:' + server.address().port, state, kapat: () => server.close() };
}
export const CHROME_ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-vsync'];
