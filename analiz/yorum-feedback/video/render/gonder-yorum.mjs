// Tek demo yorum gönderir. Kullanım: node gonder.mjs '<json>' ; json: {r:[yemek,hizmet,temizlik,atmosfer,fiyat], ad, soyad, masa, eposta}
import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
const v = JSON.parse(process.argv[2]); const bugun = new Date().toISOString().slice(0, 10);
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage(); let post = null; p.on('response', (r) => { if (r.request().method() === 'POST' && /qrm|admin-ajax|cf|form/i.test(r.url())) post = [r.status(), r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 80)]; });
try { await p.goto('https://test.qrmenuofficial.com/', { waitUntil: 'domcontentloaded', timeout: 90000 }); } catch (e) {} await p.waitForTimeout(10000);
const tikla = (txt) => p.evaluate((t) => [...document.querySelectorAll('.qrm-cf-form button')].find((e) => e.textContent.includes(t)).click(), txt);
await p.evaluate((r) => { r.forEach((n, i) => document.querySelector('#cr_' + (i + 1) + '_' + n).click()); }, v.r); await p.waitForTimeout(400); await tikla('Devam Et'); await p.waitForTimeout(1200);
const yaz = async (sel, t) => { await p.click(sel); await p.keyboard.type(t, { delay: 25 }); };
await yaz('#qrmcf3-kisa_metin_2', v.ad); await yaz('#qrmcf3-kisa_metin', v.soyad); await p.fill('#qrmcf3-tarih', bugun); await yaz('#qrmcf3-kisa_metin_3', v.masa); await tikla('Devam Et'); await p.waitForTimeout(1200);
await yaz('#qrmcf3-e_posta', v.eposta); await tikla('Devam Et'); await p.waitForTimeout(1500);
const durum = await p.evaluate(() => [...document.querySelectorAll('.qrm-cf-form input[type=checkbox]')].map((e) => [e.name, e.checked, (e.closest('label') || {}).textContent ? e.closest('label').textContent.trim().slice(0, 60) : '']));
console.log('görünen düğmeler:', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.qrm-cf-form button,.qrm-cf-form a')].filter((e) => e.getBoundingClientRect().height > 0).map((e) => [e.tagName, e.type, e.textContent.trim().slice(0, 40), e.tagName === 'A' ? (e.href || '').replace(/^https?:\/\/([^/]+).*/, '$1') : '']))));
console.log('onay kutuları (dokunulmadı):', JSON.stringify(durum));
await p.screenshot({ path: 'gonder-oncesi.png' });
if (process.env.KURU === '1') { console.log('KURU çalıştırma: gönderilmedi'); await b.close(); process.exit(0); }
await tikla('Gönder'); await p.waitForTimeout(6000);
console.log('POST:', JSON.stringify(post)); console.log('sonuç metni:', (await p.evaluate(() => document.querySelector('.qrm-cf-form') ? document.querySelector('.qrm-cf-form').innerText : document.body.innerText)).replace(/\s+/g, ' ').slice(0, 400));
await p.screenshot({ path: 'gonder-sonrasi.png' }); await b.close();
