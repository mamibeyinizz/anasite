// Gerçek "Bizi Değerlendirin" formunu test sitesinden temiz demo verisiyle yakalar.
// Kullanım: node capture.js   (çıktı: shots/*.png; form GÖNDERİLMEZ)
const { chromium, devices } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, 'shots');
const URL = process.env.REEL_URL || 'https://test.qrmenuofficial.com/';

(async () => {
  const b = await chromium.launch({ args: ['--lang=tr-TR'], env: { ...process.env, LANG: 'tr_TR.UTF-8', LANGUAGE: 'tr' } });
  const ctx = await b.newContext({
    ...devices['iPhone 13'],
    viewport: { width: 344, height: 760 },
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
  });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(4000);
  await p.evaluate(() => document.fonts.ready);
  // Masa oturumu olmadan açıldığı için çıkan sabit "QR kodunu okutun" bandı formun altını kapatıyor; kayıtta gizlenir.
  await p.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if ((cs.position === 'fixed' || cs.position === 'sticky') && /QR kodunu okutarak/.test(el.textContent || '')) el.style.display = 'none';
    }
  });
  await p.locator('.qrm-cf-form').first().evaluate(e => e.scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1200);
  const form = p.locator('.qrm-cf-form').first();
  let i = 0;
  const snap = async (n) => {
    await p.waitForTimeout(300);
    await form.screenshot({ path: `${OUT}/${String(i++).padStart(2, '0')}_${n}.png` });
  };
  const type = async (sel, v) => { const el = p.locator(sel); await el.click(); await el.fill(''); await el.type(v, { delay: 15 }); };

  await snap('start');
  for (let r = 1; r <= 5; r++) {
    for (let s = 1; s <= 5; s++) { await p.click(`label[for="cr_${r}_${s}"]`); await snap(`r${r}s${s}`); }
  }
  await p.click('.qrm-cf-step-next'); await snap('step2');
  await type('#qrmcf3-kisa_metin_2', 'Ayşe');
  await type('#qrmcf3-kisa_metin', 'K.');
  await p.locator('#qrmcf3-tarih').fill('2026-11-08');
  await type('#qrmcf3-kisa_metin_3', '7');
  await snap('step2filled');
  await p.click('.qrm-cf-step-next'); await snap('step3');
  await type('#qrmcf3-e_posta', 'ayse.k@ornek.com');
  await p.locator('#qrmcf3-telefon').evaluate(e => e.blur());
  await snap('step3filled');
  await b.close();
})();
