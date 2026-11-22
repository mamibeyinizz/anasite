// v5 otomatik yerleşim + doluluk testi. Her 0,05 sn'de tüm öğelerin sınırlayıcı kutularını ölçer, out/layout.json'a yazar (0,1 sn örnekler) ve kuralları doğrular.
// Kırmızıysa çıkış kodu ≠ 0 → render.mjs DURUR. "İhlal 0" çakışma yok demektir; kompozisyon kalitesi için doluluk/ana nesne boyutları da raporlanır.
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module'; import { spawnSync } from 'node:child_process';
import { baslat, CHROME_ARGS } from './sunucu.mjs'; import * as L from './layout.js'; import { kur } from './timeline.js';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const DIR = path.dirname(fileURLToPath(import.meta.url)); const OUT = path.resolve(DIR, '..', 'out');
const ODAK = JSON.parse(fs.readFileSync(path.join(DIR, 'tex', 'odak.json'), 'utf8'));
const CUE = JSON.parse(fs.readFileSync(process.env.CUE_DOSYA ? path.resolve(process.env.CUE_DOSYA) : path.join(DIR, '..', 'ses', 'cue.json'), 'utf8')); const TL = kur(CUE);
const sunucu = await baslat(); const env = { ...process.env, NO_PROXY: '127.0.0.1,localhost', no_proxy: '127.0.0.1,localhost' };
const b = await chromium.launch({ args: CHROME_ARGS, env });
const ctx = await b.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 }); let p = await ctx.newPage();
p.on('pageerror', (e) => console.error('[sayfa hatası]', e.message));
await p.goto(sunucu.URL); await p.waitForFunction('window.hazir === true', null, { timeout: 120000 });

const ihlal = []; const say = {}; const ornek = [];
const R = (a) => ({ x0: a.x0, x1: a.x1, y0: a.y0, y1: a.y1 });
const bildir = (kural, t, ayrinti) => { ihlal.push({ kural, t: +t.toFixed(2), ...ayrinti }); say[kural] = (say[kural] || 0) + 1; };
const METIN = new Set(['baslik', 'url']), MEDYA = new Set(['medya', 'sahne', 'balon']), UI = new Set(['rozet', 'cip', 'logo']);
const AD_SINIRLARI = { baslik: { x0: L.S.x0, x1: L.S.x1, y0: L.BAND.baslik.y0, y1: L.BAND.baslik.y1 }, medya: { x0: L.S.x0, x1: L.S.x1, y0: L.BAND.medya.y0, y1: L.BAND.medya.y1 } };
const telefonGenislik = new Set(); const telefonOran = []; const otuz = [];
const zamanlar = []; for (let i = 0; i <= Math.floor(TL.SURE / 0.05); i++) zamanlar.push(+(i * 0.05).toFixed(2));
const kontrastIsleri = [];
const C10 = CUE.parcalar.find((x) => x.id === 'c10'), C11 = CUE.parcalar.find((x) => x.id === 'c11'); const TCSV = C10.kelime ? C10.kelime.csv : C10.baslangic + 0.54 * (C10.bitis - C10.baslangic); let ilkTelefon = null, ilkLens = null; const vurguOrnek = [];
const alfaSeri = {}; const sahne3d = []; const telefonBoy = []; const panelBoy = []; const lensBoy = {}; const baslikVar = []; const baslikFont = {};
const uvBirlesik = await p.evaluate(() => window.__uv());
for (const u of uvBirlesik) if (u.u0 < -1e-9 || u.u1 > 1 + 1e-9 || u.v0 < -1e-9 || u.v1 > 1 + 1e-9) bildir('uv-sinir-disi', 0, u);
const kes = (a, b2) => L.kesisim(a, b2) > 0; const tam = (a, kutu) => a.x0 >= kutu.x0 - 0.01 && a.x1 <= kutu.x1 + 0.01 && a.y0 >= kutu.y0 - 0.01 && a.y1 <= kutu.y1 + 0.01;
let ekranMetinDD = 0; let kartKenar = 0; const kesikRapor = {};
for (const t of zamanlar) {
  const d = await p.evaluate((tt) => window.__layout(tt), t);
  const og = d.ogeler.filter((o) => o.alpha > 0.05);
  if (Math.abs(t * 10 - Math.round(t * 10)) < 1e-6) ornek.push({ t, ogeler: og.map((o) => ({ id: o.id, kind: o.kind, rect: R(o.rect), alpha: +o.alpha.toFixed(3), font: o.font ?? null, text: o.text ?? null })) });
  const metin = og.filter((o) => METIN.has(o.kind)), medya = og.filter((o) => MEDYA.has(o.kind)), ui = og.filter((o) => UI.has(o.kind) && o.kind !== 'logo');
  // 1) S içinde
  for (const o of og) if (!L.icinde(R(o.rect), L.S)) bildir('S-disinda', t, { id: o.id, rect: R(o.rect) });
  // 2) bantlar
  for (const o of og) {
    if (o.kind === 'baslik' && !L.icinde(R(o.rect), AD_SINIRLARI.baslik)) bildir('baslik-bandi-disinda', t, { id: o.id, rect: R(o.rect) });
    if (MEDYA.has(o.kind) && !L.icinde(R(o.rect), AD_SINIRLARI.medya, 1)) bildir('medya-bandi-disinda', t, { id: o.id, rect: R(o.rect) });
    if ((UI.has(o.kind) || o.kind === 'url') && !L.icinde(R(o.rect), AD_SINIRLARI.medya, 1)) bildir('sag-sutun-bant-disinda', t, { id: o.id, rect: R(o.rect) });
  }
  // 3) metin–medya kesişimi = 0 ve ≥ 24 px boşluk
  for (const m of metin) for (const q of medya) if (kes(R(m.rect), L.genislet(R(q.rect), L.GAP))) bildir('metin-medya-kesisim/bosluk', t, { metin: m.id, medya: q.id });
  // rozet/çip ↔ medya ≥ 16; rozet/çip ↔ metin kesişimi yok; logo ↔ metin ≥ 24; logo/ok ↔ lens-cta ≥ 24
  for (const u of ui) { for (const q of medya) if (kes(R(u.rect), L.genislet(R(q.rect), L.ROZET_MEDYA_GAP))) bildir('rozet-cerceve-temasi(<16px)', t, { rozet: u.id, medya: q.id });
    for (const m of metin) if (kes(R(u.rect), R(m.rect))) bildir('rozet-metin-kesisim', t, { rozet: u.id, metin: m.id }); }
  for (const lg of og.filter((o) => o.kind === 'logo')) { for (const m of metin) if (kes(R(lg.rect), L.genislet(R(m.rect), L.GAP))) bildir('logo-metin-bosluk(<24px)', t, { logo: lg.id, metin: m.id });
    for (const q of medya) if (kes(R(lg.rect), L.genislet(R(q.rect), L.GAP))) bildir('logo-medya-bosluk(<24px)', t, { logo: lg.id, medya: q.id }); }
  // 4) aynı anda ≤ 2 metin bloğu (başlık + URL), tek başlık, kesişim yok
  if (metin.length > 2) bildir('ikiden-fazla-metin-blogu', t, { bloklar: metin.map((x) => x.id) });
  const basliklar = og.filter((o) => o.kind === 'baslik'); if (basliklar.length > 1) bildir('birden-cok-baslik', t, { basliklar: basliklar.map((x) => x.id) });
  for (let i = 0; i < metin.length; i++) for (let j = i + 1; j < metin.length; j++) if (kes(R(metin[i].rect), R(metin[j].rect))) bildir('metin-bloklari-kesisiyor', t, { a: metin[i].id, b: metin[j].id });
  // 5) yazı boyutları, taşma/kesme, logo/ok boyu
  for (const o of og) { if (o.font != null) { const min = o.kind === 'url' ? L.TIP.minUrl : L.TIP.minMetin; if (o.font < min - 0.01) bildir('yazi-boyu-kucuk', t, { id: o.id, font: o.font, min }); }
    if (o.tasma) bildir('metin-kesilmesi/tasma', t, { id: o.id, text: o.text });
    if (o.kind === 'baslik' && o.satir > L.TIP.baslikSatir) bildir('baslik-2-satiri-asiyor', t, { id: o.id, satir: o.satir }); }
  for (const o of og.filter((x) => x.id === 'logo')) if (o.rect.x1 - o.rect.x0 < 220 - 0.5) bildir('logo-genislik<220', t, { w: o.rect.x1 - o.rect.x0 });
  // 6) telefon oranı + doluluk; ağırlık merkezi; 3B grup
  for (const o of og.filter((x) => x.id === 'telefon')) { const w = o.rect.x1 - o.rect.x0, h = o.rect.y1 - o.rect.y0, oran = w / h; telefonGenislik.add(Math.round(w * 2) / 2); telefonOran.push(oran);
    if (oran < L.TELEFON.oranAralik[0] || oran > L.TELEFON.oranAralik[1]) bildir('telefon-orani-aralik-disi', t, { oran: +oran.toFixed(3) });
    if (o.alpha > 0.9) telefonBoy.push(h); if (h < L.DOLULUK.anaNesneMin && o.alpha > 0.9) bildir('doluluk-telefon<560', t, { h }); }
  for (const o of og.filter((x) => x.id === 'panel')) { const h = o.rect.y1 - o.rect.y0; if (o.alpha > 0.9) panelBoy.push([o.rect.x1 - o.rect.x0, h]); if (h < L.DOLULUK.anaNesneMin - 0.5 && o.alpha > 0.9) bildir('doluluk-panel<560', t, { h }); }
  for (const o of og.filter((x) => x.id.startsWith('lens-') && x.alpha > 0.9)) (lensBoy[o.id] = lensBoy[o.id] || []).push([o.rect.x1 - o.rect.x0, o.rect.y1 - o.rect.y0]);
  const agirlik = og.filter((o) => MEDYA.has(o.kind) && o.kind !== 'balon' && o.alpha > 0.3);
  if (agirlik.length) { let a0 = 1e9, a1 = -1e9; for (const o of agirlik) { a0 = Math.min(a0, o.rect.y0); a1 = Math.max(a1, o.rect.y1); } const cy = (a0 + a1) / 2; if (cy < L.AGIRLIK_Y[0] || cy > L.AGIRLIK_Y[1]) bildir('agirlik-merkezi-disinda', t, { cy: +cy.toFixed(1) }); }
  const s3 = og.filter((o) => (o.kind === 'sahne' || o.kind === 'balon') && o.alpha > 0.5);
  if (s3.length && t >= 0.3 && t < TL.sunumBasla - 0.1) { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const o of s3) { x0 = Math.min(x0, o.rect.x0); x1 = Math.max(x1, o.rect.x1); y0 = Math.min(y0, o.rect.y0); y1 = Math.max(y1, o.rect.y1); }
    sahne3d.push({ t, w: x1 - x0, h: y1 - y0 }); if (x1 - x0 < L.DOLULUK.grup3dMinW) bildir('doluluk-3b-grup-genislik<640', t, { w: +(x1 - x0).toFixed(1) }); if (y1 - y0 < L.DOLULUK.grup3dMinH) bildir('doluluk-3b-grup-yukseklik<%70', t, { h: +(y1 - y0).toFixed(1) }); }
  // 7) figür/balon örtüşmesi
  const bul = (id) => og.find((o) => o.id === id);
  for (const bl of og.filter((o) => o.kind === 'balon')) for (const q of og.filter((o) => (o.kind === 'sahne' || o.kind === 'balon') && o.id !== bl.id && o.id !== bl.sahip)) if (kes(R(bl.rect), R(q.rect))) bildir('balon-ortusme', t, { balon: bl.id, nesne: q.id });
  { const a = bul('misafir'), g = bul('garson'); if (a && g && kes(R(a.rect), R(g.rect))) bildir('figur-ortusme', t, { figur: 'misafir', nesne: 'garson' }); }
  // 8) pencere bütünlüğü: kırpma penceresinde kısmen kesilen metin/kart kutusu = 0
  for (const w of d.pencereler.filter((x) => x.alpha > 0.3)) {
    const win = w.win; let kutular = [];
    if (w.ekran === 'panel') { const P = ODAK.panel; kutular = [...Object.entries(P.kartlar).map(([k, v]) => ({ ad: k, ...v })), ...Object.entries(P.diger).map(([k, v]) => ({ ad: k, ...v }))];
      if (win.x0 < P.css_x0 || win.x1 > P.css_x1 || win.y0 < P.css_y0 || win.y1 > P.css_y1) bildir('pencere-goruntu-disi', t, { id: w.id, win }); }
    else { if (win.x0 < 0 || win.x1 > L.EKRAN_TEX.w || win.y0 < 0 || win.y1 > L.EKRAN_TEX.h) bildir('pencere-goruntu-disi', t, { id: w.id, win });
      const e = ODAK.ekranlar[w.ekran];
      if (w.ekran === '02') kutular = e.itemler.map((it) => ({ ad: it.ad, x0: it.metin[0], y0: it.metin[1], x1: it.metin[2], y1: it.metin[3] }));
      else kutular = e.metinKutulari.map((k, i) => ({ ad: 'metin' + i, x0: k[0], y0: k[1], x1: k[2], y1: k[3] })); }
    for (const k of kutular) if (kes(win, k) && !tam(k, win)) { bildir('pencerede-kesilen-kutu', t, { id: w.id, ekran: w.ekran, kutu: k.ad }); kesikRapor[w.id] = (kesikRapor[w.id] || 0) + 1; }
    if (w.ekran !== 'panel' && w.ekran !== '02') kartKenar = Math.max(kartKenar, ODAK.ekranlar[w.ekran].kartlar.filter((k) => kes(win, k) && !tam(k, win)).length);
  }
  // 9) mesaj–görsel eşleşmesi: CTA sahnesinde dil seçici görünür (telefonda 02 + büyüteçte dil listesi)
  if (t >= TL.W(24.5) && t <= TL.ctaKapan[0] - 0.05) { const c = bul('lens-cta'); if (!c || c.alpha < 0.9 || d.faz.telefon !== '02') bildir('cta-dil-secici-gorunmuyor', t, { lens: !!c, telefon: d.faz.telefon }); }
  if (t >= TL.W(24.5) && t <= TL.ctaKapan[0] - 0.05) { const lg = bul('logo'); const ur = bul('adres'); if (!lg || !ur || lg.alpha < 0.9 || ur.alpha < 0.9) bildir('cta-logo/url-eksik', t, {}); }
  { const ph = bul('telefon'), pn = bul('panel'); if (ph && pn) bildir('panel-telefon-capraz', t, { telefon: +ph.alpha.toFixed(2), panel: +pn.alpha.toFixed(2) }); }
  // 11) vurgu–cümle eşleşmesi (cue'ya bağlı): "elle" → Diller, "CSV" → CSV İçe Aktar (sağ görünüm), "Otuz dile kadar" → Diller (28 dil etkin); CSV Dışa Aktar hiç vurgulanmaz
  { const vg = d.vurgu; if (vg.kart === 'csvDisa') bildir('vurgu-csv-disa-aktar', t, {});
    if (t >= C10.baslangic + 0.15 && t <= TCSV - 0.45 && !(vg.kart === 'diller' && vg.alfa > 0.5)) bildir('vurgu-elle≠diller', t, { kart: vg.kart });
    if (t >= TCSV + 0.1 && t <= C10.bitis - 0.2) { if (!(vg.kart === 'csvIce' && vg.gorunum === 'sag' && vg.alfa > 0.5)) bildir('vurgu-csv≠csv-ice-aktar', t, { kart: vg.kart, gorunum: vg.gorunum }); }
    if (t >= C11.baslangic + 0.15 && t <= C11.bitis - 0.15 && !(vg.kart === 'diller' && vg.alfa > 0.5)) bildir('vurgu-otuz-dile≠diller', t, { kart: vg.kart });
    if (Math.abs(t * 10 - Math.round(t * 10)) < 1e-6 && t >= C10.baslangic - 0.2 && t <= C11.bitis + 0.2) vurguOrnek.push({ t, kart: vg.kart, gorunum: vg.gorunum, alfa: +vg.alfa.toFixed(2) }); }
  { const ph = bul('telefon'), ln = og.find((o) => o.id.startsWith('lens-')); if (ph && ilkTelefon === null) ilkTelefon = t; if (ln && ilkLens === null) ilkLens = t; }
  // 10) metinsiz süre (başlık alfa)
  const bv = og.some((o) => o.kind === 'baslik' && o.alpha > 0.05); baslikVar.push([t, bv]);
  for (const o of og.filter((x) => x.kind === 'baslik')) { baslikFont[d.aktifBaslik] = o.font; if (t < TL.kancaGeri[0]) (alfaSeri[d.aktifBaslik] = alfaSeri[d.aktifBaslik] || []).push([t, o.alpha]); }
  // "Otuz dile kadar." tam opak süresi
  const bsl = og.find((o) => o.kind === 'baslik'); if (bsl && bsl.text === 'Otuz dile kadar.') otuz.push({ t, alpha: bsl.alpha });
  if (Math.abs(t * 2 - Math.round(t * 2)) < 1e-6) kontrastIsleri.push({ t, ogeler: og.filter((o) => METIN.has(o.kind) || (UI.has(o.kind) && o.kind !== 'logo')) });
}
// metinsiz süre ≤ 0,4 sn (döngü boşluğu son cümle sonu–kanca dönüşü hariç)
let bos0 = null, enUzunBos = 0; const bosAralik = [];
for (const [t, v] of baslikVar) { if (t >= TL.kapanis - 0.02 && t <= TL.kancaGeri[0] + 0.25) { bos0 = null; continue; } if (!v && bos0 === null) bos0 = t; if (v && bos0 !== null) { const u = t - bos0; enUzunBos = Math.max(enUzunBos, u); bosAralik.push([bos0, t]); if (u > 0.4 + 1e-6) bildir('metinsiz-sure>0.4sn', bos0, { sure: +u.toFixed(2) }); bos0 = null; } }
const tamOpak = otuz.filter((x) => x.alpha >= 0.95); const sure = tamOpak.length ? (tamOpak[tamOpak.length - 1].t - tamOpak[0].t + 0.05) : 0;
{ const c11 = CUE.parcalar.find((x) => x.id === 'c11'); const gerek = 0.9 * (c11.bitis - c11.baslangic);   // v3'teki 1,2 sn kuralı sesle çelişir: cümle ≈ 0,94 sn
  if (sure < gerek) bildir('otuz-dile-kadar-tam-opak<cumle%90', 0, { sure, gerek: +gerek.toFixed(2) }); }
{ const g = [...telefonGenislik]; if (g.length && Math.max(...g) - Math.min(...g) > 4) bildir('telefon-genisligi-degisiyor', 0, { degerler: g }); }   // gövde ölçeği sabit; ±2 px = perspektif/eğim
// ekran içi metin ≥ 28 px (kapak yüksekliği 19/23 doku px → yazı ≈ cap/0,72; ölçek: büyüteç s, panel s)
const EK = { aciklama_doku_px: 19 / 0.72, dil_ogesi_doku_px: 19 / 0.72, ad_doku_px: 23 / 0.72, fiyat_doku_px: 24 / 0.72, panel_alt_yazi_css: 13.5 };
const ekranMetin = { satir_aciklama_px: +(EK.aciklama_doku_px * L.LENS.s).toFixed(1), dil_ogesi_px: +(EK.dil_ogesi_doku_px * L.LENS.s).toFixed(1), urun_adi_px: +(EK.ad_doku_px * L.LENS.s).toFixed(1), panel_alt_yazi_px: +(EK.panel_alt_yazi_css * L.PANEL.s).toFixed(1) };
for (const [k, v] of Object.entries(ekranMetin)) if (v < L.TIP.ekranMetinMin) bildir('ekran-ici-metin<28px', 0, { metin: k, px: v });

// statik: dil seçici büyüteci — kategori metni dışarıda, son satır–alt kenar ≥ 16 px, ≥ 8. öğe metni yok
{ const dd = ODAK.ekranlar['02'], w = dd.pencereDD, it = dd.itemler; const alt = (w.y1 - it[6].y1) * L.LENS.s;
  if (alt < 16) bildir('dd-alt-bosluk<16px', 0, { alt: +alt.toFixed(1) }); if (w.x1 > 345) bildir('dd-kategori-metni-icinde', 0, { x1: w.x1 }); if (w.y1 > it[7].metin[1]) bildir('dd-8-ogenin-metni-icinde', 0, {}); ekranMetinDD = +alt.toFixed(1); }
if (ilkTelefon === null || ilkLens === null || ilkLens - ilkTelefon > 0.8 + 1e-6) bildir('dolgusuz-sure>0.8sn', ilkTelefon ?? 0, { telefon: ilkTelefon, lens: ilkLens });
{ const kt = ODAK.panel.kartlar.csvIce, sg = ODAK.panel.sag; if (!(kt.x0 >= sg.x0 && kt.x1 <= sg.x1 && kt.y0 >= sg.y0 && kt.y1 <= sg.y1)) bildir('csv-ice-karti-sag-pencerede-degil', 0, {}); }
// başlık–ses senkronu: her parça için alfa ≥ 0,5 giriş/çıkış anı − cue.json başlangıç/bitiş (≤ 0,15 sn)
const senkron = [];
for (let i = 0; i < CUE.parcalar.length; i++) { const seri = (alfaSeri[i] || []).filter(([, a]) => a >= 0.5); if (!seri.length) { bildir('senkron-baslik-yok', 0, { parca: i }); continue; }
  const pc = CUE.parcalar[i]; const on = seri[0][0], off = seri[seri.length - 1][0] + 0.05; const dOn = i === 0 ? 0 : on - pc.baslangic, dOff = off - pc.bitis;
  senkron.push({ parca: pc.id, metin: pc.metin, cueBaslangic: pc.baslangic, cueBitis: pc.bitis, baslikGiris: +on.toFixed(2), baslikCikis: +off.toFixed(2), farkGiris: +dOn.toFixed(2), farkCikis: +dOff.toFixed(2) });
  if (Math.abs(dOn) > 0.15) bildir('senkron-giris>0.15sn', on, { parca: pc.id, fark: +dOn.toFixed(2) }); if (i < CUE.parcalar.length - 1 && Math.abs(dOff) > 0.15) bildir('senkron-cikis>0.15sn', off, { parca: pc.id, fark: +dOff.toFixed(2) }); }

// kontrast ≥ 4,5:1 (piksel örneklemesi, 0,5 sn aralık)
await p.close(); p = await ctx.newPage(); p.setDefaultTimeout(180000); await p.goto(sunucu.URL, { timeout: 180000 }); await p.waitForFunction('window.hazir === true', null, { timeout: 180000 });   // örnekleme sonrası yeni sayfa (GL belleği)
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'lk-')); const isler = [];
for (const k of kontrastIsleri) { if (!k.ogeler.length) continue; await p.evaluate((tt) => window.frame(tt), k.t); const f = path.join(tmp, `k-${k.t.toFixed(2)}.jpg`); await p.screenshot({ path: f, type: 'jpeg', quality: 98, timeout: 120000 }); isler.push({ t: k.t, dosya: f, ogeler: k.ogeler.map((o) => ({ id: o.id, kind: o.kind, rect: R(o.rect), color: o.color, alpha: o.alpha, text: o.text })) }); }
fs.writeFileSync(path.join(tmp, 'isler.json'), JSON.stringify(isler));
const py = spawnSync('python3', [path.join(DIR, 'layout_kontrast.py'), path.join(tmp, 'isler.json')], { encoding: 'utf8' });
let kontrast = { en_dusuk: null, olcum: 0 };
if (py.status === 0) { kontrast = JSON.parse(py.stdout); for (const x of kontrast.dusukler) bildir('kontrast<4.5', x.t, x); } else { console.error(py.stderr); bildir('kontrast-olcumu-calismadi', 0, {}); }
await b.close(); sunucu.kapat();

// doluluk raporu: her sahnenin ana nesne boyutu
const min = (a) => (a.length ? Math.min(...a) : null), max = (a) => (a.length ? Math.max(...a) : null);
const doluluk = {
  '3B grup (0,3–7,9 sn)': { genislik_px_min: min(sahne3d.map((x) => x.w)) && +min(sahne3d.map((x) => x.w)).toFixed(0), yukseklik_px_min: min(sahne3d.map((x) => x.h)) && +min(sahne3d.map((x) => x.h)).toFixed(0), medya_bandi_doluluk_min: min(sahne3d.map((x) => x.h)) && +(min(sahne3d.map((x) => x.h)) / (L.BAND.medya.y1 - L.BAND.medya.y0)).toFixed(2) },
  telefon: { yukseklik_px: telefonBoy.length ? +max(telefonBoy).toFixed(0) : null, genislik_px: [...telefonGenislik], oran: telefonOran.length ? [+min(telefonOran).toFixed(3), +max(telefonOran).toFixed(3)] : null, medya_bandi_doluluk: telefonBoy.length ? +(max(telefonBoy) / (L.BAND.medya.y1 - L.BAND.medya.y0)).toFixed(2) : null },
  panel: { pencere_px: panelBoy.length ? [+panelBoy[0][0].toFixed(0), +panelBoy[0][1].toFixed(0)] : null, medya_bandi_doluluk: +(L.PANEL.h / (L.BAND.medya.y1 - L.BAND.medya.y0)).toFixed(2) },
  lens: Object.fromEntries(Object.entries(lensBoy).map(([k, v]) => [k, [+v[0][0].toFixed(0), +v[0][1].toFixed(0)]])),
};
const ozet = { dolgusuzSn: +((ilkLens ?? 0) - (ilkTelefon ?? 0)).toFixed(2), csvKelimeSn: +TCSV.toFixed(2), vurguOrnekleri: vurguOrnek, video: { sure: +TL.SURE.toFixed(3), kare: TL.KARE, konusmaBitis: CUE.konusmaBitis, enUzunKonusmaBosluguSn: CUE.enUzunBosluk }, senkronEnBuyukFark: +Math.max(...senkron.map((x) => Math.max(Math.abs(x.farkGiris), Math.abs(x.farkCikis)))).toFixed(2), ddAltBoslukPx: ekranMetinDD, kurallar: say, ihlalSayisi: ihlal.length, ornekSayisi: zamanlar.length, telefonGenislikPx: [...telefonGenislik], otuzDileKadarTamOpakSn: +sure.toFixed(2), enUzunMetinsizSnHaric: +enUzunBos.toFixed(2), kontrast: { enDusukOran: kontrast.en_dusuk, olcum: kontrast.olcum }, ekranMetinPx: ekranMetin, doluluk, pencereKesikKutu: kesikRapor, satirKartiBuyutecteKenardanKesik: kartKenar > 0, uvPencereSayisi: uvBirlesik.length };
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, process.env.LAYOUT_CIKTI || 'layout.json'), JSON.stringify({ parametreler: { S: L.S, BAND: L.BAND, MEDYA: L.MEDYA, TELEFON: L.TELEFON, LENS: L.LENS, PANEL: L.PANEL, GAP: L.GAP, AGIRLIK_Y: L.AGIRLIK_Y, DOLULUK: L.DOLULUK }, ozet, uv: uvBirlesik, senkron, baslikFontPx: baslikFont, metinsizAraliklar: bosAralik, ihlaller: ihlal.slice(0, 400), ornekler: ornek }));
console.log('YERLEŞİM TESTİ:', ihlal.length === 0 ? 'YEŞİL' : 'KIRMIZI', JSON.stringify(ozet));
if (ihlal.length) { const g = {}; for (const i of ihlal) (g[i.kural] = g[i.kural] || []).push(i); for (const [k, v] of Object.entries(g)) console.log(' •', k, v.length, 'örnek; ilk:', JSON.stringify(v[0]).slice(0, 240)); }
process.exit(ihlal.length ? 1 : 0);
