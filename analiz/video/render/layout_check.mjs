// Otomatik yerleşim testi. Her 0,1 sn'de tüm öğelerin sınırlayıcı kutularını out/layout.json'a yazar ve kuralları doğrular.
// Kırmızıysa çıkış kodu ≠ 0 → render.mjs DURUR. (Yapı örneği: insta/src/aura/tools/layout_check.mjs yalnızca fikir; içerik/kod buradan.)
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module'; import { spawnSync } from 'node:child_process';
import { baslat, CHROME_ARGS } from './sunucu.mjs'; import * as L from './layout.js';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const DIR = path.dirname(fileURLToPath(import.meta.url)); const OUT = path.resolve(DIR, '..', 'out');
const sunucu = await baslat(); const env = { ...process.env, NO_PROXY: '127.0.0.1,localhost', no_proxy: '127.0.0.1,localhost' };
const b = await chromium.launch({ args: CHROME_ARGS, env });
const p = await (await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 })).newPage();
p.on('pageerror', (e) => console.error('[sayfa hatası]', e.message));
await p.goto(sunucu.URL); await p.waitForFunction('window.hazir === true', null, { timeout: 120000 });

const ihlal = []; const say = {}; const ornek = [];
const R = (a) => ({ x0: a.x0, x1: a.x1, y0: a.y0, y1: a.y1 });
const bildir = (kural, t, ayrinti) => { ihlal.push({ kural, t: +t.toFixed(2), ...ayrinti }); say[kural] = (say[kural] || 0) + 1; };
const METIN = new Set(['baslik', 'altyazi', 'url']), MEDYA = new Set(['medya', 'sahne', 'balon']), UI = new Set(['rozet', 'cip', 'logo']);
let telefonGenislik = new Set(); const otuz = [];
const zamanlar = []; for (let i = 0; i < 280; i++) zamanlar.push(+(i * 0.1).toFixed(2));
for (let t = 20.8; t < 22.7; t += 0.05) zamanlar.push(+t.toFixed(2));              // "Otuz dile kadar." opaklık süresi için ince örnek
zamanlar.sort((a, c) => a - c);
const kontrastIsleri = [];
for (const t of zamanlar) {
  const d = await p.evaluate((tt) => window.__layout(tt), t);
  const og = d.ogeler.filter((o) => o.alpha > 0.05);
  const kare = (o) => (o.kind === 'altyazi' ? R(o.rect) : R(o.rect));
  if (Math.abs(t * 10 - Math.round(t * 10)) < 1e-6) ornek.push({ t, ogeler: og.map((o) => ({ id: o.id, kind: o.kind, rect: R(o.rect), alpha: +o.alpha.toFixed(3), font: o.font, text: o.text })) });
  // 1) S içinde (metin, medya, rozet, çip, logo, altyazı, sahne nesneleri)
  for (const o of og) if (!L.icinde(kare(o), L.S)) bildir('S-disinda', t, { id: o.id, rect: R(o.rect) });
  // 2) bantlar
  for (const o of og) {
    if (o.kind === 'baslik' && !L.icinde(kare(o), { x0: L.S.x0, x1: L.S.x1, y0: L.BAND.baslik.y0, y1: L.BAND.baslik.y1 })) bildir('baslik-bandi-disinda', t, { id: o.id, rect: R(o.rect) });
    if (o.kind === 'altyazi' && !L.icinde(kare(o), { x0: L.S.x0, x1: L.S.x1, y0: L.BAND.altyazi.y0, y1: L.BAND.altyazi.y1 })) bildir('altyazi-bandi-disinda', t, { id: o.id, rect: R(o.rect) });
    if ((o.kind === 'medya' || o.kind === 'sahne' || o.kind === 'balon') && !L.icinde(kare(o), { x0: L.S.x0, x1: L.S.x1, y0: L.BAND.medya.y0, y1: L.BAND.medya.y1 }, 1)) bildir('medya-bandi-disinda', t, { id: o.id, rect: R(o.rect) });
    if (o.kind === 'medya') { const w = o.rect.x1 - o.rect.x0, h = o.rect.y1 - o.rect.y0; if (w > L.MEDYA.maxW + 1 || h > L.MEDYA.maxH + 1) bildir('medya-kutusu-asimi', t, { id: o.id, w, h }); }
  }
  // 3) metin–medya kesişimi = 0 ve boşluk (altyazı ≥24, başlık ≥24)
  const metin = og.filter((o) => METIN.has(o.kind)), medya = og.filter((o) => MEDYA.has(o.kind)), ui = og.filter((o) => UI.has(o.kind) && o.kind !== 'logo');
  for (const m of metin) for (const q of medya) {
    const bosluk = m.kind === 'altyazi' ? L.MEDYA_ALTYAZI_GAP : L.GAP;
    if (L.kesisim(kare(m), L.genislet(R(q.rect), bosluk)) > 0) bildir('metin-medya-kesisim/bosluk', t, { metin: m.id, medya: q.id, gerekenBosluk: bosluk });
  }
  // rozet/çip ↔ medya çerçevesi ≥ 16 px; rozet/çip ↔ metin kesişimi yok
  for (const u of ui) { for (const q of medya) if (L.kesisim(R(u.rect), L.genislet(R(q.rect), L.ROZET_MEDYA_GAP)) > 0) bildir('rozet-cerceve-temasi(<16px)', t, { rozet: u.id, medya: q.id });
    for (const m of metin) if (L.kesisim(R(u.rect), kare(m)) > 0) bildir('rozet-metin-kesisim', t, { rozet: u.id, metin: m.id }); }
  // logo ↔ başlık ≥ 24
  for (const lg of og.filter((o) => o.kind === 'logo')) for (const m of metin) if (L.kesisim(R(lg.rect), L.genislet(kare(m), L.GAP)) > 0) bildir('logo-baslik-bosluk(<24px)', t, { logo: lg.id, metin: m.id });
  // 4) aynı anda iki metin bloğu kesişmez; ikiden fazla metin bloğu yok (başlık/CTA ve altyazı; URL başlık bloğunun parçasıdır)
  const bloklar = metin.filter((o) => o.kind !== 'url');
  if (bloklar.length > 2) bildir('ikiden-fazla-metin-blogu', t, { bloklar: bloklar.map((x) => x.id) });
  for (let i = 0; i < metin.length; i++) for (let j = i + 1; j < metin.length; j++) if (!((metin[i].id === 'cta' && metin[j].id === 'adres') || (metin[i].id === 'adres' && metin[j].id === 'cta')) && L.kesisim(kare(metin[i]), kare(metin[j])) > 0) bildir('metin-bloklari-kesisiyor', t, { a: metin[i].id, b: metin[j].id });
  const basliklar = og.filter((o) => o.kind === 'baslik'); if (basliklar.length > 1) bildir('birden-cok-baslik', t, { basliklar: basliklar.map((x) => x.id) });
  // 5) yazı boyutları
  for (const o of og) { if (o.font == null) continue; const min = o.kind === 'url' ? L.TIP.minUrl : L.TIP.minMetin; if (o.font < min - 0.01) bildir('yazi-boyu-kucuk', t, { id: o.id, font: o.font, min }); }
  const ek = d.ekranMetin;
  if (ek.vurgulanan === 'telefon_urun_adi' && ek.urun_adi_px < L.TIP.ekranMetinMin) bildir('ekran-ici-metin<28px', t, { metin: 'urun_adi', px: ek.urun_adi_px });
  if (ek.vurgulanan === 'panel_kart_basligi' && Math.min(ek.panel_baslik_yazi_px, ek.panel_baslik_govde_px) < L.TIP.ekranMetinMin) bildir('ekran-ici-metin<28px', t, { metin: 'panel_baslik', px: Math.min(ek.panel_baslik_yazi_px, ek.panel_baslik_govde_px) });
  // 6) telefon genişliği sabit
  for (const o of og.filter((x) => x.id === 'telefon')) { const w = o.rect.x1 - o.rect.x0; telefonGenislik.add(Math.round(w * 2) / 2); if (w < 330 || w > 420) bildir('telefon-genisligi-aralik-disi', t, { w }); }
  // 7) ağırlık merkezi
  const agirlik = og.filter((o) => MEDYA.has(o.kind) && o.kind !== 'balon');
  if (agirlik.length) { let a0 = 1e9, a1 = -1e9; for (const o of agirlik) { a0 = Math.min(a0, o.rect.y0); a1 = Math.max(a1, o.rect.y1); } const cy = (a0 + a1) / 2; if (cy < L.AGIRLIK_Y[0] || cy > L.AGIRLIK_Y[1]) bildir('agirlik-merkezi-disinda', t, { cy: +cy.toFixed(1) }); }
  // 8) figür/balon örtüşmesi (v2 bulgu 11)
  const bul = (id) => og.find((o) => o.id === id);
  for (const bl of og.filter((o) => o.kind === 'balon')) for (const q of og.filter((o) => (o.kind === 'sahne' || o.kind === 'balon') && o.id !== bl.id && o.id !== bl.sahip)) if (L.kesisim(R(bl.rect), R(q.rect)) > 0) bildir('balon-ortusme', t, { balon: bl.id, nesne: q.id });
  for (const f of ['misafir', 'garson']) { const a = bul(f); if (!a) continue; for (const g of [f === 'misafir' ? 'garson' : 'misafir']) { const q = bul(g); if (q && L.kesisim(R(a.rect), R(q.rect)) > 0) bildir('figur-ortusme', t, { figur: f, nesne: g }); } }
  // 9) CTA opaklığı ≥ 0,9 (karartma yok)
  if (t >= 24.4 && t <= 26.5) { const c = bul('cta'); if (c && c.alpha < 0.9) bildir('cta-opaklik<0.9', t, { alpha: c.alpha }); }
  // "Otuz dile kadar." tam opak süresi
  const c0 = og.find((o) => o.id === 'c0'); if (c0 && c0.text === 'Otuz dile kadar.') otuz.push({ t, alpha: c0.alpha });
  // kontrast örnekleme zamanları (0,5 sn)
  if (Math.abs(t * 2 - Math.round(t * 2)) < 1e-6) kontrastIsleri.push({ t, ogeler: og.filter((o) => METIN.has(o.kind) || UI.has(o.kind)) });
}
const tamOpak = otuz.filter((x) => x.alpha >= 0.95); const sure = tamOpak.length ? (tamOpak[tamOpak.length - 1].t - tamOpak[0].t + 0.05) : 0;
if (sure < 1.2) bildir('otuz-dile-kadar-tam-opak<1.2sn', 0, { sure });
if (telefonGenislik.size > 1) bildir('telefon-genisligi-degisiyor', 0, { degerler: [...telefonGenislik] });

// 10) metin/zemin kontrastı ≥ 4,5:1 (piksel örneklemesi): 0,5 sn aralıkla kare al, python ile ölç
const tmp = fs.mkdtemp ? fs.mkdtempSync(path.join(os.tmpdir(), 'lk-')) : '/tmp/lk';
const isler = [];
for (const k of kontrastIsleri) { if (!k.ogeler.length) continue; await p.evaluate((tt) => window.frame(tt), k.t); const f = path.join(tmp, `k-${k.t.toFixed(2)}.jpg`); await p.screenshot({ path: f, type: 'jpeg', quality: 98 }); isler.push({ t: k.t, dosya: f, ogeler: k.ogeler.map((o) => ({ id: o.id, kind: o.kind, rect: o.kind === 'altyazi' && o.rect.metin ? o.rect.metin : R(o.rect), color: o.color, alpha: o.alpha, text: o.text })) }); }
fs.writeFileSync(path.join(tmp, 'isler.json'), JSON.stringify(isler));
const py = spawnSync('python3', [path.join(DIR, 'layout_kontrast.py'), path.join(tmp, 'isler.json')], { encoding: 'utf8' });
let kontrast = { en_dusuk: null, olcum: 0 };
if (py.status === 0) { kontrast = JSON.parse(py.stdout); for (const x of kontrast.dusukler) bildir('kontrast<4.5', x.t, x); } else { console.error(py.stderr); bildir('kontrast-olcumu-calismadi', 0, {}); }
await b.close(); sunucu.kapat();

fs.mkdirSync(OUT, { recursive: true });
const ozet = { kurallar: say, ihlalSayisi: ihlal.length, ornekSayisi: zamanlar.length, telefonGenislikPx: [...telefonGenislik], otuzDileKadarTamOpakSn: +sure.toFixed(2), kontrast: { enDusukOran: kontrast.en_dusuk, olcum: kontrast.olcum } };
fs.writeFileSync(path.join(OUT, 'layout.json'), JSON.stringify({ parametreler: { S: L.S, BAND: L.BAND, MEDYA: L.MEDYA, TELEFON: L.TELEFON, PANEL: L.PANEL, ROZET_SATIRI: L.ROZET_SATIRI, GAP: L.GAP, AGIRLIK_Y: L.AGIRLIK_Y }, ozet, ihlaller: ihlal.slice(0, 400), ornekler: ornek }));
console.log('YERLEŞİM TESTİ:', ihlal.length === 0 ? 'YEŞİL' : 'KIRMIZI', JSON.stringify(ozet));
if (ihlal.length) { const g = {}; for (const i of ihlal) (g[i.kural] = g[i.kural] || []).push(i); for (const [k, v] of Object.entries(g)) console.log(' •', k, v.length, 'örnek; ilk:', JSON.stringify(v[0]).slice(0, 220)); }
process.exit(ihlal.length ? 1 : 0);
