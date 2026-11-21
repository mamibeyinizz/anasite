// Salt okunur: hub sayfasındaki kartların konumunu ölçer (vurgu çerçeveleri için). Tıklama yok.
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
const H = process.env.PANEL_HOST; const DURUM = path.resolve(__dirname, 'w', 'state-' + H + '.json');
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '.qrmenuofficial.com' } : undefined;
(async () => {
  const b = await chromium.launch({ proxy });
  const c = await b.newContext({ storageState: DURUM, viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  await p.goto('https://' + H + '/wp-admin/admin.php?page=qrms-module-qr-ceviri', { timeout: 90000 });
  await p.waitForSelector('#qrms-shell', { timeout: 40000 }); await p.waitForTimeout(2500);
  const k = await p.evaluate(() => {
    const out = {}; const ara = (ad, sel) => {
      const el = [...document.querySelectorAll(sel)].filter(e => e.offsetParent).find(e => e.textContent.trim().replace(/\s+/g, ' ').startsWith(ad));
      if (!el) return; const r = el.getBoundingClientRect(); out[ad] = { x: r.x, y: r.y, w: r.width, h: r.height, tag: el.tagName + '.' + (el.className || '').toString().slice(0, 40) };
    };
    ['Diller', 'Kapsam', 'Metin Toplama', 'CSV Dışa Aktar', 'CSV İçe Aktar', 'Sistem Durumu'].forEach(a => ara(a, 'a,div,section'));
    return out;
  });
  console.log(JSON.stringify(k, null, 1));
  fs.writeFileSync(path.resolve(__dirname, '../../analiz/video/render/boxes-raw.json'), JSON.stringify(k, null, 1));
  await b.close();
})();
