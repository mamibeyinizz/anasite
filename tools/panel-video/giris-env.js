// Panel girişi: kimlik bilgisi YALNIZCA ortam değişkenlerinden okunur (PANEL_HOST, PANEL_USER, PANEL_PASS).
// Şifre argv'ye, loga, ekran görüntüsüne ya da dosyaya yazılmaz. Oturum çerezleri w/ (gitignore'da) içine kaydedilir.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const H = process.env.PANEL_HOST, U = process.env.PANEL_USER, P = process.env.PANEL_PASS;
if (!H || !U || !P) { console.error('PANEL_HOST / PANEL_USER / PANEL_PASS ortam değişkenleri gerekli'); process.exit(2); }
const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: '.qrmenuofficial.com' } : undefined;
const DURUM = path.resolve(__dirname, 'w', 'state-' + H + '.json');
(async () => {
  fs.mkdirSync(path.dirname(DURUM), { recursive: true });
  const b = await chromium.launch({ proxy });
  const c = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await c.newPage();
  let form = false;
  for (const yol of ['/wp-login.php', '/qrm']) {
    try { await p.goto('https://' + H + yol, { timeout: 90000 }); await p.waitForTimeout(2500); } catch (e) { console.log(yol, 'açılamadı'); continue; }
    if (await p.$('#user_login')) { form = true; console.log('giriş formu:', yol); break; }
    console.log(yol, '-> form yok (', p.url().replace(/https:\/\/[^/]+/, ''), ')');
  }
  if (!form) { console.error('DUR: giriş formu bulunamadı (bot doğrulaması/engel olabilir)'); await b.close(); process.exit(3); }
  await p.fill('#user_login', U); await p.fill('#user_pass', P);
  await Promise.all([p.waitForNavigation({ timeout: 90000 }).catch(() => {}), p.click('#wp-submit')]);
  await p.waitForTimeout(3500);
  const metin = (await p.evaluate(() => document.body.innerText || '')).toLowerCase();
  if (/captcha|doğrulama kodu|two-factor|2fa|authenticator|kilitlen|çok fazla|too many/.test(metin) && !(await p.$('#adminmenu'))) {
    console.error('DUR: 2FA/captcha/kilit işareti görüldü. Aşılmadı.'); await b.close(); process.exit(4);
  }
  const ok = !!(await p.$('#adminmenu')) || !!(await p.$('#qrms-shell'));
  console.log('giriş:', ok ? 'TAMAM' : 'BAŞARISIZ', '|', p.url().replace(/https:\/\/[^/]+/, ''));
  if (ok) await c.storageState({ path: DURUM });
  await b.close();
  process.exit(ok ? 0 : 5);
})();
