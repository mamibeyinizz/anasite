// Kullanım: node tools/ig-split/render-split.mjs <html> <id> <çıktı-dizini>   (DSF=2 → 2160×2880)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs'; import path from 'node:path';
const [html, id, outArg] = process.argv.slice(2); const out = path.resolve(outArg); fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 3240, height: 1440 }, deviceScaleFactor: +(process.env.DSF || 1) });
await p.goto(`file://${path.resolve(html)}`); await p.waitForFunction('document.body.dataset.ready');
await p.screenshot({ path: path.join(out, `${id}-serit.png`) });
for (let i = 0; i < 3; i++) await p.screenshot({ path: path.join(out, `${id}-${i + 1}.png`), clip: { x: i * 1080, y: 0, width: 1080, height: 1440 } });
await b.close();
