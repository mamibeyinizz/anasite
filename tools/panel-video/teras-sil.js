const { chromium } = require('playwright');
const W = require('path').resolve(__dirname, 'w');
(async () => {
  const b = await chromium.launch();
  const c = await b.newContext({ storageState: W + '/state-plus.qrmenuofficial.com.json' });
  const p = await c.newPage();
  p.on('dialog', (d) => d.accept());
  const git = async () => { for (let i = 0; i < 5; i++) { await p.goto('https://plus.qrmenuofficial.com/wp-admin/admin.php?page=qrms-module-qr-masa', { timeout: 90000 }); await p.waitForTimeout(2500); if (await p.$('#qmo-onek')) return; await p.waitForTimeout(9000); } };
  await git();
  const hrefs = await p.$$eval('tr[data-grup="teras"] a[href*="action=delete"]', (a) => a.map((x) => x.href));
  console.log('silinecek', hrefs.length);
  for (const h of hrefs) { await p.goto(h, { timeout: 90000 }); await p.waitForTimeout(1500); }
  await git();
  console.log('kalan teras', await p.$$eval('tr[data-grup="teras"]', (a) => a.length), '| toplam masa', await p.$$eval('tr[data-grup]', (a) => a.length));
  await b.close();
})();
