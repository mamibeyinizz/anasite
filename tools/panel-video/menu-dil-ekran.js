// Herkese açık müşteri menüsü (giriş/şifre yok): TR / EN / DE / FR menü LİSTESİ ekran görüntüleri, aynı ekran durumunda (üstte, kaydırma yok).
// Yalnızca ziyaretçi tarayıcısının dil seçimi değişir; sunucuda hiçbir ayar yazılmaz.
const { chromium } = require('playwright'); const path = require('path');
const H = process.env.PANEL_HOST || 'plus.qrmenuofficial.com';
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '.qrmenuofficial.com' } : undefined;
const CIKTI = process.env.CIKTI || path.resolve(__dirname, '../../analiz/video/ekran');
const SECILEN = (process.env.DILLER || 'Deutsch').split(',');
const TUM = { 'Türkçe': '03-menu-tr.png', 'English': '04-menu-en.png', 'Deutsch': '05-menu-de.png', 'Français': '06-menu-fr.png' };
const DILLER = SECILEN.map((a) => [a, TUM[a]]);
(async () => {
  const b = await chromium.launch({ proxy });
  for (const [ad, dosya] of DILLER) {
    const c = await b.newContext({ viewport: { width: 430, height: 900 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const p = await c.newPage();
    let ok = false;
    for (let i = 0; i < 3 && !ok; i++) {
      try {
        await p.goto('https://' + H + (process.env.MASA === '0' ? '/' : '/?masa=masa-4'), { timeout: 90000 }); await p.waitForTimeout(3500);
        await p.getByText('Menüye Git').first().click({ timeout: 20000 }).catch(() => {}); await p.waitForTimeout(3000);
        await p.waitForSelector('.rma-card', { state: 'attached', timeout: 30000 }); ok = true;
      } catch (e) { console.log(ad, 'deneme', i + 1, 'başarısız'); await p.waitForTimeout(8000); }
    }
    if (!ok) { console.log('ATLANDI', ad); await c.close(); continue; }
    if (ad !== 'Türkçe') {
      await p.waitForTimeout(9000);   // hız sınırına takılmamak için menü yüklendikten sonra bekle
      await p.locator('.qrmenu-lang-dropdown').first().click(); await p.waitForTimeout(1500);
      await p.locator('.qrmenu-options-panel >> text=' + ad).first().click(); await p.waitForTimeout(9000);
    }
    await p.mouse.move(2, 2); await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(1500);
    await p.screenshot({ path: path.join(CIKTI, dosya) });
    console.log('tamam', ad, '->', dosya);
    await c.close(); await new Promise((r) => setTimeout(r, 6000));
  }
  await b.close();
})();
