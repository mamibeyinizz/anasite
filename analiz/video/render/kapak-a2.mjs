// Kapak A2: A'nın içerik bloğu ~120 px yukarıda; kanca ≥170 px. Çıktı: kapak/_ham-A2.png + _olcum-A2.json
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
import { baslat, CHROME_ARGS } from './sunucu.mjs';
const { chromium } = createRequire(import.meta.url)('playwright'); const DIR = path.dirname(fileURLToPath(import.meta.url)); const OUT = path.resolve(DIR, '..', 'kapak');
const G = (t) => `<span style="color:#C9A84C">${t}</span>`, K = (t) => `<span style="color:#F4F1E8">${t}</span>`;
const s = await baslat(); const b = await chromium.launch({ args: CHROME_ARGS, env: { ...process.env, NO_PROXY: '127.0.0.1,localhost' } });
const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage(); await p.goto(s.URL); await p.waitForFunction('window.hazir===true');
const o = await p.evaluate((x) => window.kapakKur2(x), { html: K('Garsonunuz') + '<br>' + G('tercüman') + K(' mı?'), metinY: 428, pilY: 342, logoY: 1415, grupY: [785, 1400], genislik: 1020, ls: '-.064em' });
await p.screenshot({ path: path.join(OUT, '_ham-A2.png'), type: 'png' }); fs.writeFileSync(path.join(OUT, '_olcum-A2.json'), JSON.stringify(o, null, 1)); console.log(JSON.stringify(o)); await b.close(); s.kapat(); process.exit(0);
