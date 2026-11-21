import { createRequire } from 'node:module'; import { baslat, CHROME_ARGS } from './sunucu.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const s = await baslat(); const b = await chromium.launch({ args: CHROME_ARGS, env: { ...process.env, NO_PROXY: '127.0.0.1' } });
const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 } })).newPage(); await p.goto(s.URL); await p.waitForFunction('window.hazir===true');
for (const t of [0.3, 2.0, 3.4, 4.6, 5.5, 6.5, 7.8]) { const d = await p.evaluate((x) => window.__layout(x), t); const o = d.ogeler.filter((q) => q.kind === 'sahne' || q.kind === 'balon');
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const q of o) { x0 = Math.min(x0, q.rect.x0); x1 = Math.max(x1, q.rect.x1); y0 = Math.min(y0, q.rect.y0); y1 = Math.max(y1, q.rect.y1); }
  console.log(t, 'grup', [x0, x1, y0, y1].map((v) => Math.round(v)).join(','), 'w', Math.round(x1 - x0), 'h', Math.round(y1 - y0), o.map((q) => q.id + ':' + [q.rect.x0, q.rect.x1, q.rect.y0, q.rect.y1].map((v) => Math.round(v)).join('/')).join(' ')); }
await b.close(); s.kapat(); process.exit(0);
