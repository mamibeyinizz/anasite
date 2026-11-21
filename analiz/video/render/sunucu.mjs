// Statik sunucu (render ve yerleşim testi ortak).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const DIR = path.dirname(fileURLToPath(import.meta.url)); const VIDEO = path.resolve(DIR, '..'); const ROOT = path.resolve(VIDEO, '..', '..');
const MIME = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const ROUTES = [['/scene.mjs', path.join(DIR, 'scene.mjs')], ['/layout.js', path.join(DIR, 'layout.js')], ['/render/boxes.json', path.join(DIR, 'boxes.json')], ['/tex/', path.join(DIR, 'tex') + '/'], ['/vendor/', path.join(VIDEO, 'vendor') + '/'], ['/fonts/', path.join(ROOT, 'assets/fonts') + '/'], ['/brand/', path.join(ROOT, 'assets/brand') + '/']];
export async function baslat() {
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]); let f = u === '/' ? path.join(DIR, 'index.html') : null;
    for (const [pre, dest] of ROUTES) { if (u === pre) f = dest; else if (pre.endsWith('/') && u.startsWith(pre)) f = path.join(dest, u.slice(pre.length)); }
    if (!f || !fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); return res.end('yok'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  return { URL: 'http://127.0.0.1:' + server.address().port + '/', kapat: () => server.close() };
}
export const CHROME_ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-vsync'];
