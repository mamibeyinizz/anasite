// node render.mjs data/x.json [--bos] [--cikti out] → out/<id>.jpg (+ out/arsiv/<id>.png). Kural ihlalinde (ör. metin çok uzun) HATA verir, çıktı üretmez.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { spawnSync } from 'node:child_process';
import { baslat, CHROME_ARGS, DIR } from './srv.mjs';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
export async function uret(veri, { bos = false, cikti = path.join(DIR, 'out'), tarayici } = {}) {
  const s = await baslat(veri); const b = tarayici || await chromium.launch({ args: CHROME_ARGS, env: { ...process.env, NO_PROXY: '127.0.0.1,localhost' } });
  const T = JSON.parse(fs.readFileSync(path.join(DIR, 'tokens.json'), 'utf8')); const FM = T.formatlar[veri.format]; if (!FM) throw new Error('bilinmeyen format: ' + veri.format);
  const p = await (await b.newContext({ viewport: { width: FM.w, height: FM.h }, deviceScaleFactor: 1 })).newPage(); const istekler = [];
  p.on('request', (r) => istekler.push(r.url())); p.on('pageerror', (e) => { throw e; });
  try {
    await p.goto(s.URL + (bos ? '/?bos=1' : '/')); await p.waitForFunction('window.__hazir===true', null, { timeout: 60000 });
    const hata = await p.evaluate(() => window.__hata); if (hata) throw new Error(hata);
    const olcum = await p.evaluate(() => window.__olcum); olcum.disIstek = istekler.filter((u) => !u.startsWith(s.URL) && !u.startsWith('data:') && !u.startsWith('blob:'));
    fs.mkdirSync(path.join(cikti, 'arsiv'), { recursive: true }); const ad = bos ? veri.id + '.bos' : veri.id; const png = path.join(cikti, 'arsiv', ad + '.png'); await p.screenshot({ path: png, type: 'png' });
    fs.writeFileSync(path.join(cikti, 'arsiv', ad + '.olcum.json'), JSON.stringify(olcum, null, 1)); return { png, olcum, ad };
  } finally { await p.context().close(); if (!tarayici) await b.close(); s.kapat(); }
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const f = process.argv[2]; if (!f) { console.error('kullanım: node render.mjs data/x.json'); process.exit(2); }
  const veri = JSON.parse(fs.readFileSync(f, 'utf8'));
  try { const r = await uret(veri); const py = spawnSync('python3', [path.join(DIR, 'bitir.py'), r.png, path.join(DIR, 'out', veri.id + '.jpg')], { encoding: 'utf8' }); if (py.status) { console.error(py.stderr); process.exit(1); } console.log('tamam', veri.id, py.stdout.trim()); }
  catch (e) { console.error('HATA:', e.message); process.exit(1); }
}
