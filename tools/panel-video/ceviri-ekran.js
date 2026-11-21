// Salt okunur ekran görüntüsü: yalnızca goto + screenshot. Hiçbir düğmeye/forma tıklanmaz.
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const H = process.env.PANEL_HOST;
const DURUM = path.resolve(__dirname, 'w', 'state-' + H + '.json');
const CIKTI = path.resolve(__dirname, '../../analiz/video/ekran');
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '.qrmenuofficial.com' } : undefined;
const SAYFALAR = [
  ['07b-panel-hub', 'qrms-module-qr-ceviri'],
  ['07a-panel-diller', 'qrms-cv-diller'],
  ['07c-panel-csv-ice', 'qrms-cv-ice'],
  ['07d-panel-csv-disa', 'qrms-cv-disa'],
  ['07e-panel-klasik', 'qrms-cv-klasik'],
];
// Yönetici çubuğunu ve kullanıcıya ait her şeyi gizle (görüntüye girmesin).
const GIZLE = '#wpadminbar,#screen-meta-links,#screen-meta,.qrms-user,.qrms-shell-user,[class*="avatar"]{display:none!important}html.wp-toolbar{padding-top:0!important}';
(async () => {
  const b = await chromium.launch({ proxy });
  const c = await b.newContext({ storageState: DURUM, viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  const rapor = {};
  for (const [ad, sl] of SAYFALAR) {
    let ok = false;
    for (let i = 0; i < 3 && !ok; i++) {
      try { await p.goto('https://' + H + '/wp-admin/admin.php?page=' + sl, { timeout: 90000 }); await p.waitForSelector('#qrms-shell', { timeout: 40000 }); ok = true; } catch (e) { await p.waitForTimeout(8000); }
    }
    if (!ok) { rapor[ad] = 'açılmadı'; console.log(ad, 'AÇILMADI'); continue; }
    await p.waitForTimeout(2500);
    await p.addStyleTag({ content: GIZLE });
    await p.waitForTimeout(500);
    const bilgi = await p.evaluate(() => ({ h: document.querySelector('#qrms-shell-content h1,#qrms-shell-content h2')?.textContent.trim().slice(0, 60) || '', yuk: document.documentElement.scrollHeight, kapsam: /Bulunamadı|yetkiniz yok|izin verilmiyor/i.test(document.title) }));
    await p.screenshot({ path: path.join(CIKTI, ad + '.png'), fullPage: false });
    rapor[ad] = bilgi; console.log(ad, JSON.stringify(bilgi));
    await p.waitForTimeout(3000);
  }
  await b.close();
})();
