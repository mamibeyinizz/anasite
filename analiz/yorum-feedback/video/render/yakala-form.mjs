// Herkese açık test sitesinden müşteri yorum formunu (1. adım: puan kriterleri) yakalar. Kimlik bilgisi YOK; form doldurulmaz/gönderilmez. Çıktı: ekran/01-yorum-formu.png (390×844 viewport, DPR 2, yalnız form elemanı).
import { createRequire } from 'node:module'; const { chromium } = createRequire(import.meta.url)('playwright');
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage(); try { await p.goto('https://test.qrmenuofficial.com/', { waitUntil: 'domcontentloaded', timeout: 90000 }); } catch (e) {} await p.waitForTimeout(10000);
const y = await p.evaluate(() => { const h = [...document.querySelectorAll('h3')].find((e) => /Bizi Değerlendirin/.test(e.textContent)); return h.getBoundingClientRect().top + scrollY; });
await p.evaluate((y) => window.scrollTo(0, y - 120), y); await p.waitForTimeout(2000);
const kutu = await p.evaluate(() => { const f = document.querySelector('.qrm-cf-form'); const r = f.getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; });
await p.screenshot({ path: process.argv[2] || 'ekran/01-yorum-formu.png', clip: kutu });
console.log('form metni:', (await p.evaluate(() => document.querySelector('.qrm-cf-form').innerText)).replace(/\s+/g, ' ').slice(0, 300)); await b.close();
