// Belirli anların karesini alır: node snap.js 0 1.1 5 ...  (çıktı: out/prev_<t>.png)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(__dirname, 'reel.html')); await p.evaluate(() => window.ready()); await p.waitForTimeout(300);
  for (const t of process.argv.slice(2)) { await p.evaluate(t => render(t), +t); await p.screenshot({ path: path.join(__dirname, 'out', `prev_${t}.png`) }); }
  await b.close();
})();
