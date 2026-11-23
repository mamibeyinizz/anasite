// Kapak ALTIN: kapak-a2 ile aynı geometri; altın zemin. Çıktı: kapak/_ham-ALTIN.png, _bos-ALTIN.png (yalnız zemin), _olcum-ALTIN.json. Video render dosyalarına dokunmaz.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
import { baslat, CHROME_ARGS } from './sunucu-kapak-altin.mjs';
const { chromium } = createRequire(import.meta.url)('playwright'); const DIR = path.dirname(fileURLToPath(import.meta.url)); const OUT = path.resolve(DIR, '..', 'kapak');
const s = await baslat(); const b = await chromium.launch({ args: CHROME_ARGS, env: { ...process.env, NO_PROXY: '127.0.0.1,localhost' } });
const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage(); p.on('pageerror', (e) => console.error('[sayfa]', e.message)); await p.goto(s.URL); await p.waitForFunction('window.hazir===true', null, { timeout: 120000 });
const o = await p.evaluate((x) => window.kapakAltin(x), { metinY: 428, pilY: 342, logoY: 1415, grupY: [785, 1400], genislik: 1020, ls: '-.064em' });
await p.screenshot({ path: path.join(OUT, '_ham-ALTIN.png'), type: 'png' }); await p.evaluate(() => window.kapakAltinBos()); await p.screenshot({ path: path.join(OUT, '_bos-ALTIN.png'), type: 'png' });
fs.writeFileSync(path.join(OUT, '_olcum-ALTIN.json'), JSON.stringify(o, null, 1)); console.log(JSON.stringify(o)); await b.close(); s.kapat(); process.exit(0);
