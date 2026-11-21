// Kapak: aynı 3B sahne malzemesiyle tek kare (PNG) + ölçüm. Sonra render/kapak-isle.py dither/JPG/önizleme/kontrolleri yapar.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
import { baslat, CHROME_ARGS } from './sunucu.mjs';
const { chromium } = createRequire(import.meta.url)('playwright'); const DIR = path.dirname(fileURLToPath(import.meta.url)); const OUT = path.resolve(DIR, '..', 'kapak'); fs.mkdirSync(OUT, { recursive: true });
const s = await baslat(); const b = await chromium.launch({ args: CHROME_ARGS, env: { ...process.env, NO_PROXY: '127.0.0.1,localhost' } });
const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage(); await p.goto(s.URL); await p.waitForFunction('window.hazir===true');
const o = await p.evaluate(() => window.kapakKur()); await p.screenshot({ path: path.join(OUT, '_ham.png'), type: 'png' });
fs.writeFileSync(path.join(OUT, '_olcum.json'), JSON.stringify(o, null, 1)); console.log(JSON.stringify(o)); await b.close(); s.kapat(); process.exit(0);
