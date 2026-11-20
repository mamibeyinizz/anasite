const { chromium } = require('playwright');
const W = require('path').resolve(__dirname, 'w');
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ storageState: W + '/state-plus.qrmenuofficial.com.json' })).newPage();
  for (let i = 0; i < 5; i++) { await p.goto('https://plus.qrmenuofficial.com/wp-admin/post.php?post=77&action=edit', { timeout: 90000 }); await p.waitForTimeout(2500); if (await p.$('#rma_price')) break; await p.waitForTimeout(9000); }
  await p.fill('#rma_price', '320');
  await Promise.all([p.waitForNavigation({ timeout: 90000 }), p.click('#publish')]);
  console.log('fiyat', await p.inputValue('#rma_price'));
  await b.close();
})();
