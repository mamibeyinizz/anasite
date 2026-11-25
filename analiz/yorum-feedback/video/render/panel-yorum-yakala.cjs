const { chromium } = require('playwright'); const H = process.env.H || 'plus.qrmenuofficial.com';
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '.qrmenuofficial.com' } : undefined;
(async () => { const b = await chromium.launch({ proxy }); const c = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, storageState: '/tmp/claude-0/-home-user/5ab85011-816d-562a-a5f8-3b50f950a4f4/scratchpad/ig/tools/panel-video/w/state-' + H + '.json' }); const p = await c.newPage();
  await p.goto('https://' + H + '/wp-admin/admin.php?page=' + (process.argv[2] || 'qrms-module-yorum-feedback') + (process.argv[3] || ''), { timeout: 90000 }); await p.waitForTimeout(4000);
  await p.screenshot({ path: (process.argv[4] || 'yf0') + '.png' });
  console.log(await p.evaluate(() => document.querySelector('#wpbody-content').innerText.replace(/\n+/g, ' | ').slice(0, 1500)));
  console.log(JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('#wpbody-content a')].map((a) => [a.textContent.trim().replace(/\s+/g, ' ').slice(0, 30), (a.getAttribute('href') || '').replace(/^.*admin.php/, '')]).filter((x) => /qrms-yf|tab=/.test(x[1])).slice(0, 30))));
  await b.close(); })();
