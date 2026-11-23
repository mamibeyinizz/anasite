// Çoklu Dil Reels v7 — KURUMSAL tema. DOM/CSS/SVG; three.js YOK. 1080×1920, window.frame(t) deterministik.
// Zamanlar ses/cue.json (ya da CUE_DOSYA ile kısa cue) → timeline.js. Hareket: yalnız opaklık + 24–48 px kayma + ≤%3 ölçek, ease-out cubic/quint, 280–480 ms.
import * as TLm from '/timeline.js';
await Promise.all([800, 700, 500].map((w) => document.fonts.load(`${w} 40px Manrope`, 'ÇĞİÖŞÜçğıöşü'))); await document.fonts.ready;
const CUE = await (await fetch('/cue.json')).json(); const TL = TLm.kur(CUE); const TOPLAM = TL.SURE; const w = TL.W;
const ODAK = await (await fetch('/tex/odak.json')).json();
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)); const seg = (t, a, b) => clamp((t - a) / (b - a)); const lerp = (a, b, k) => a + (b - a) * k;
const easeOut3 = (x) => 1 - Math.pow(1 - x, 3), easeOut5 = (x) => 1 - Math.pow(1 - x, 5);
const eo = (t, a, d, f = easeOut3) => f(seg(t, a, a + d));
const $ = (t, c, st, p, h) => { const e = document.createElement(t); if (c) e.className = c; if (st) Object.assign(e.style, st); if (h !== undefined) e.innerHTML = h; if (p) p.appendChild(e); return e; };
const stage = document.getElementById('stage');
const P = Object.fromEntries(CUE.parcalar.map((p, i) => [p.id, { ...p, i, V: TL.V[i], Ev: TL.Ev[i] }])); const has = (id) => !!P[id]; const vc = (id) => P[id].V;
const V = TL.V;

/* ───────── katmanlar: altın (taban) + zümrüt (perdeyle açılır) ───────── */
const altin = $('div', 'katman', null, stage); altin.id = 'altin'; const ton = $('div', 'ton', null, altin);
const zum = $('div', 'katman', null, stage); zum.id = 'zum'; $('div', 'nokta', null, zum);
const BRK = (renk, op) => `<svg class="brk" width="1080" height="1920" viewBox="0 0 1080 1920" fill="none" stroke="${renk}" stroke-opacity="${op}" stroke-width="5" stroke-linecap="square"><path d="M64 540 V420 H184"/><path d="M1016 540 V420 H896"/><path d="M64 1140 V1260 H184"/><path d="M1016 1140 V1260 H896"/></svg>`;
altin.insertAdjacentHTML('beforeend', BRK('#0D2B22', '.55')); zum.insertAdjacentHTML('beforeend', BRK('#C9A84C', '.8'));
$('div', 'etiket', null, altin, 'ÇOKLU DİL MODÜLÜ'); $('div', 'etiket', null, zum, 'ÇOKLU DİL MODÜLÜ');

/* ───────── başlık blokları (her ses parçası bir blok; ses cümlesi = ekran yazısı) ───────── */
const H = {   // id: [katman, sütun(tam|sag|ust), satırlar]
  c0: ['a', 'tam', ['Yabancı misafir', 'geldi. Menüyü', '<b class="pill">kim anlatacak?</b>']],
  c1: ['a', 'tam', ['Garsonunuz', '<b class="pill">tercümana dönüşüyor,</b>']], c2: ['a', 'tam', ['diğer masalar', '<b class="pill">bekliyor.</b>']], c3: ['a', 'tam', ['Anlamayan misafir de', '<b class="pill">sormaya çekinir.</b>']],
  c4: ['z', 'tam', ['Çözüm menünün', '<b class="pill">kendisinde.</b>']],
  c5: ['z', 'sag', ['Misafir QR’ı', 'okutur,', '<b class="pill">dilini seçer.</b>']], c6: ['z', 'sag', ['Ürün adı,', 'açıklama,', 'kategori,']], c7: ['z', 'sag', ['hepsi', '<b class="pill">kendi dilinde</b>', 'açılır.']],
  c8: ['z', 'ust', ['Bu, <b class="pill">Çoklu Dil modülü.</b>']], c9: ['z', 'ust', ['<b class="pill">Dilleri</b> siz', 'tanımlarsınız.']], c10: ['z', 'ust', ['Çevirileri elle ya da', '<b class="pill">CSV</b> ile girersiniz.']], c11: ['z', 'ust', ['<b class="pill">Otuz dile</b> kadar.']],
  c12: ['a', 'tam', ['Garsonunuz', '<b class="pill">servise dönsün.</b>']],
  c13: ['a', 'alt', ['Aynı menüyü kendi', 'telefonunuzda deneyin,']], c14: ['a', 'alt', ['dil seçiciyi', '<b>siz değiştirin.</b>']], c15: ['a', 'alt', ['Bağlantı', '<b>profilimizde.</b>']] };
const GENIS = { tam: 888, sag: 520, ust: 888, alt: 888 }; const YPOS = { tam: 480, sag: 500, ust: 470, alt: 900 }; const BOY = { tam: [96, 76], sag: [88, 68], ust: [96, 76], alt: [56, 44] };
const bloklar = {};
for (const p of CUE.parcalar) { const [kat, sut, satirlar] = H[p.id]; const ust = kat === 'a' ? altin : zum; const el = $('div', 'blok' + (sut === 'alt' ? ' ince' : ''), { top: YPOS[sut] + 'px', left: (sut === 'sag' ? 490 : 96) + 'px' }, ust, satirlar.map((s) => `<span class="l">${s}</span>`).join(''));
  const [mx, mn] = BOY[sut]; let fs = mx; el.style.fontSize = fs + 'px'; el.style.opacity = '0'; const olc = () => Math.max(...[...el.children].map((c) => c.getBoundingClientRect().width)); while (olc() > GENIS[sut] && fs > mn) { fs -= 2; el.style.fontSize = fs + 'px'; }
  if (olc() > GENIS[sut]) { fs = mn; while (olc() > GENIS[sut] && fs > 40) { fs -= 2; el.style.fontSize = fs + 'px'; } }
  bloklar[p.id] = { el, fs, sut, kat }; }

/* ───────── sahne öğeleri ───────── */
// 1) kanca: logo (açılış/kapanış)
const logoA = $('img', 'logo', { left: '96px', top: '1150px', width: '260px', opacity: 0 }, altin); logoA.src = '/brand/qr-menu-official-logo-v4-dark.svg';
const logoC = $('img', 'logo', { left: '96px', top: '1130px', width: '260px', opacity: 0 }, altin); logoC.src = '/brand/qr-menu-official-logo-v4-dark.svg';
// 2) acı şeması: dört masa (düz daireler)
const masalar = $('div', 'op', { left: '0', top: '940px', width: '1080px', height: '200px' }, altin); const MX = [0, 1, 2, 3].map((i) => 96 + 84 + i * 240); const masaEl = [];
for (let i = 0; i < 4; i++) { const m = $('div', 'masa', { left: (MX[i] - 84) + 'px', top: '0px', width: '168px', height: '168px' }, masalar);
  m.innerHTML = i === 0 ? `<svg width="168" height="168" viewBox="0 0 168 168"><circle cx="84" cy="84" r="78" fill="#0D2B22"/><circle cx="84" cy="84" r="52" fill="none" stroke="#C9A84C" stroke-width="5"/><circle cx="84" cy="84" r="14" fill="#C9A84C"/></svg>`
    : `<svg width="168" height="168" viewBox="0 0 168 168"><circle cx="84" cy="84" r="76" fill="none" stroke="#0D2B22" stroke-width="6"/><circle cx="84" cy="84" r="52" fill="none" stroke="#0D2B22" stroke-width="3" stroke-opacity=".55"/></svg>`;
  if (i === 2) { const q = $('div', '', { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: '72px', color: '#0D2B22', opacity: 0, lineHeight: 1 }, m, '?'); m.q = q; } masaEl.push(m); }
// 3) telefon + dil listesi + rozet (zümrüt)
const ekrBase = { '01': '/ekran/01-acilis-tr.png', '02': '/ekran/02-dil-secici.png', tr: '/ekran/03-menu-tr.png', en: '/ekran/04-menu-en.png', de: '/ekran/05-menu-de.png', fr: '/ekran/06-menu-fr.png' };
const EP = { x0: 14, y0: 0, x1: 830, y1: 1708 }; const PH_H = 700, PH_Y = 510, PH_X = 96; const ekH = PH_H - 24, ps = ekH / (EP.y1 - EP.y0), ekW = (EP.x1 - EP.x0) * ps;
const tel = $('div', 'telefon', { left: PH_X + 'px', top: PH_Y + 'px', width: (ekW + 24) + 'px', height: PH_H + 'px', borderRadius: '44px', opacity: 0 }, zum);
const ekr = $('div', 'ekr', { left: '12px', top: '12px', width: ekW + 'px', height: ekH + 'px', borderRadius: '34px' }, tel); const ekrImg = {};
for (const [k, src] of Object.entries(ekrBase)) { const im = $('img', '', { left: (-EP.x0 * ps) + 'px', top: '0px', width: (860 * ps) + 'px', height: (1800 * ps) + 'px' }, ekr); im.src = src; ekrImg[k] = im; }
const dim = $('div', 'dim', { clipPath: 'none' }, ekr); const vur = $('div', 'vurgu', null, ekr);
const telTex = (x, y) => [(x - EP.x0) * ps, y * ps];
const DDRECT = { x0: 16, y0: 126, x1: 342, y1: 722 };
const DIL = [['tr', 'TR', 'Türkçe'], ['en', 'EN', 'English'], ['de', 'DE', 'Deutsch'], ['fr', 'FR', 'Français']]; const dilEl = {};
const rozet = $('div', 'rozet', { left: '490px', top: '832px' }, zum, '<i></i>Gerçek demo menü');
DIL.forEach(([k, kod, ad], i) => { const e = $('div', 'dil', { left: '516px', top: (906 + i * 84) + 'px', height: '64px' }, zum, `<span class="cubuk"></span><span class="kod">${kod}</span><span class="ad">${ad}</span>`); dilEl[k] = e; });
// 4) panel (zümrüt)
const HUB = '/ekran/07b-panel-hub.png'; const WIN = { x0: 268, y0: 204, x1: 940, y1: 414 }; const SER = { x0: 268, y0: 8, x1: 540, y1: 66 }; const k_ = 888 / ((WIN.x1 - WIN.x0) * 2); const PW = 888, PHh = Math.round((WIN.y1 - WIN.y0) * 2 * k_);
const SK = 0.661; const serW = Math.round((SER.x1 - SER.x0) * 2 * SK), serH = Math.round((SER.y1 - SER.y0) * 2 * SK);
const pser = $('div', 'panel op', { left: '96px', top: '700px', width: serW + 'px', height: serH + 'px' }, zum); const pserI = $('img', '', null, pser);
{ const im = pserI; im.src = HUB; im.style.width = (2560 * SK) + 'px'; im.style.left = (-SER.x0 * 2 * SK) + 'px'; im.style.top = (-SER.y0 * 2 * SK) + 'px'; }
const PANY = 700 + serH + 20; const pan = $('div', 'panel op', { left: '96px', top: PANY + 'px', width: PW + 'px', height: PHh + 'px' }, zum); const panI = $('img', '', null, pan); panI.src = HUB; panI.style.width = (2560 * k_) + 'px'; panI.style.left = (-WIN.x0 * 2 * k_) + 'px'; panI.style.top = (-WIN.y0 * 2 * k_) + 'px';
const pdim = $('div', 'dim', null, pan); const pvur = $('div', 'vurgu', null, pan);
const KRT = ODAK.panel.kartlar; const cssPx = (r) => ({ x0: (r.x0 - WIN.x0) * 2 * k_ - 6, y0: (r.y0 - WIN.y0) * 2 * k_ - 6, x1: (r.x1 - WIN.x0) * 2 * k_ + 6, y1: (r.y1 - WIN.y0) * 2 * k_ + 6 });
const tipo = $('div', 'tipo', { top: (PANY + PHh + 40) + 'px' }, zum, 'Elle · CSV · 30 dile kadar');
// 5) CTA (altın)
const ctaB = $('div', 'blok', { top: '500px', left: '96px' }, altin, '<span class="l">Canlı menüyü</span><span class="l"><b class="pill">telefonunuzda</b> deneyin</span>'); { let fs = 92; ctaB.style.fontSize = fs + 'px'; while (Math.max(...[...ctaB.children].map((c) => c.getBoundingClientRect().width)) > 888 && fs > 76) { fs -= 2; ctaB.style.fontSize = fs + 'px'; } ctaB.fs = fs; }
const adres = $('div', 'adres', { top: '780px' }, altin, 'qrmenuofficial.com/canli-menu');

/* ───────── yardımcılar: vurgu dikdörtgenleri ───────── */
const setHole = (dimEl, vurEl, r, W, Hh, a) => { if (!r || a <= 0.001) { dimEl.style.opacity = '0'; vurEl.style.opacity = '0'; return; } dimEl.style.opacity = String(a); vurEl.style.opacity = String(a);
  dimEl.style.clipPath = `polygon(evenodd, 0 0, ${W}px 0, ${W}px ${Hh}px, 0 ${Hh}px, 0 0, ${r.x0}px ${r.y0}px, ${r.x0}px ${r.y1}px, ${r.x1}px ${r.y1}px, ${r.x1}px ${r.y0}px, ${r.x0}px ${r.y0}px)`;
  Object.assign(vurEl.style, { left: r.x0 + 'px', top: r.y0 + 'px', width: (r.x1 - r.x0) + 'px', height: (r.y1 - r.y0) + 'px' }); };
const seqRect = (t, seq) => { let i = 0; for (let k = 0; k < seq.length; k++) if (t >= seq[k].t) i = k; const cur = seq[i], prv = seq[Math.max(0, i - 1)]; const p = i === 0 ? 1 : easeOut3(seg(t, cur.t, cur.t + 0.26)); const q = (a, b) => (a && b) ? { x0: lerp(a.x0, b.x0, p), y0: lerp(a.y0, b.y0, p), x1: lerp(a.x1, b.x1, p), y1: lerp(a.y1, b.y1, p) } : b; return { rect: q(prv.rect, cur.rect), on: cur.on !== false && t >= seq[0].t }; };

/* ───────── olay zamanları (cue'dan) ───────── */
const vZ = has('c4') ? vc('c4') : vc('c5');                                           // altın → zümrüt perde
const wipe1 = [vZ - 0.30, vZ + 0.15], wipe2 = [vc('c12') - 0.30, vc('c12') + 0.15];     // 450 ms perde
const tPhoneIn = vc('c5') - 0.05;                                                  // telefon, "Çözüm menünün kendisinde." yazısıyla çakışmasın diye c5'te girer
const tDD = tPhoneIn + 0.9, tTR = w(11.7), tEN = w(13.0), tDE = w(14.5), tFR = w(15.8);
const tCikis = vc('c8') - 0.3;                                                       // telefon sahnesi çıkış
const SIRA = [[0, '01'], [tDD, '02'], [tTR, 'tr'], [tEN, 'en'], [tDE, 'de'], [tFR, 'fr']];
const c9 = P.c9, c10 = P.c10, c11 = P.c11; const tCSV = c10.kelime ? c10.kelime.csv : c10.baslangic + 0.54 * (c10.bitis - c10.baslangic);
const HL = [{ t: c9.baslangic, rect: cssPx(KRT.diller) }, { t: c10.baslangic - 0.05, rect: cssPx(KRT.diller) }, { t: tCSV - 0.12, rect: cssPx(KRT.csvIce) }, { t: c11.baslangic - 0.05, rect: cssPx(KRT.diller) }];
const aktifDil = (t) => (t >= tFR ? 'fr' : t >= tDE ? 'de' : t >= tEN ? 'en' : t >= tTR ? 'tr' : null);
window.__tl = { V, Ev: TL.Ev, SURE: TL.SURE, KARE: TL.KARE, tCSV, tDD, tTR, tEN, tDE, tFR, vZ, wipe1, wipe2, dongu: TL.dongu, kancaGeri: TL.kancaGeri };
window.__baslik = CUE.parcalar.map((p, i) => [TL.V[i], TL.Ev[i], 'bas' + i, p.metin]);
window.__yazi = Object.fromEntries(Object.entries(bloklar).map(([k, b]) => [k, b.fs]));

/* ───────── kare ───────── */
const blokDurum = (el, a, kay) => { el.style.opacity = a.toFixed(3); const e = 1 - a; el.style.transform = `translateY(${(kay * (1 - easeOut3(Math.min(1, a * 1.0)))).toFixed(1)}px) scale(${(0.985 + 0.015 * easeOut3(Math.min(1, a))).toFixed(4)})`; el.style.visibility = a > 0.004 ? 'visible' : 'hidden'; };
function frame(t) {
  t = clamp(t, 0, TOPLAM); const loop = t >= TL.dongu; const fo = 1 - eo(t, TL.ctaKapan[0], 0.3);          // CTA/son katman çıkışı (kancaya dönüş)
  const hookIn = t >= TL.kancaGeri[0] ? eo(t, TL.kancaGeri[0], 0.45) : 0;
  // perde: zümrüt alttan yukarı açılır (wipe1), üstten aşağı kapanır (wipe2)
  const pin = easeOut5(seg(t, wipe1[0], wipe1[1])), pout = easeOut5(seg(t, wipe2[0], wipe2[1])); const top = Math.max(1 - pin, pout) * 100; zum.style.clipPath = `inset(${top}% 0 0 0)`;
  // başlık blokları
  for (const p of Object.values(P)) { const b = bloklar[p.id]; let a; const g = p.i === 0 ? 1 : eo(t, p.V, 0.34); const ç = 1 - easeOut3(seg(t, p.Ev - 0.28, p.Ev)); a = Math.min(g, ç); if (t < p.V) a = p.i === 0 ? 1 : 0;
    if (p.i === 0 && t >= p.Ev) a = Math.min(1, ç) * (loop ? 0 : 1); if (p.i === 0 && t >= TL.kancaGeri[0]) a = hookIn; if (p.id === 'c15' && loop) a = 0; blokDurum(b.el, clamp(a), p.i === 0 ? 0 : 36); if (p.i === 0 && t >= TL.kancaGeri[0]) blokDurum(b.el, hookIn, 36); }
  // logo + hook (açılış ve kapanış)
  const kancaKat = t < P.c0.Ev + 0.2 ? 1 - easeOut3(seg(t, P.c0.Ev - 0.28, P.c0.Ev)) : 0; logoA.style.opacity = String(Math.max(kancaKat, hookIn)); const ctaA = (t >= vc('c13') ? eo(t, vc('c13'), 0.4) : 0) * fo; logoC.style.opacity = String(ctaA); logoC.style.top = '1130px';
  // acı: tonlama + dört masa
  const aci = has('c3') ? 1 : 1; const aBas = vc('c1'), aSon = has('c4') ? vc('c4') : vc('c5'); const tonA = easeOut3(seg(t, aBas, aBas + 0.6)) * (1 - easeOut3(seg(t, aSon - 0.3, aSon + 0.1))); ton.style.opacity = String((0.2 * tonA).toFixed(3));
  const mA = Math.min(eo(t, vc('c1') + 0.1, 0.4), 1 - eo(t, aSon - 0.3, 0.3)); masalar.style.opacity = String(Math.max(0, mA).toFixed(3)); masalar.style.transform = `translateY(${(36 * (1 - easeOut3(clamp(mA)))).toFixed(1)}px)`;
  const c2 = P.c2, bek = (k) => 1 - 0.7 * eo(t, c2.baslangic + 0.2 + k * 0.45, 0.4);   // "bekliyor": masa 2–4 sırayla soluyor
  masaEl[1].style.opacity = String(t >= c2.baslangic ? bek(0).toFixed(3) : 1); masaEl[2].style.opacity = String(t >= c2.baslangic ? bek(1).toFixed(3) : 1); masaEl[3].style.opacity = String(t >= c2.baslangic ? bek(2).toFixed(3) : 1);
  if (has('c3')) { const c3 = P.c3, q = eo(t, c3.baslangic, 0.35); masaEl[2].q.style.opacity = String(q.toFixed(3)); masaEl[2].style.opacity = String((t >= c3.baslangic ? lerp(bek(1), 1, q) : bek(1)).toFixed(3)); }
  // telefon + dil listesi
  const phA = t >= tPhoneIn && t < tCikis + 0.3 ? Math.min(eo(t, tPhoneIn, 0.4), 1 - eo(t, tCikis, 0.3)) : 0; tel.style.opacity = String(phA.toFixed(3)); tel.style.transform = `translateY(${(40 * (1 - easeOut3(clamp(phA)))).toFixed(1)}px)`; tel.style.visibility = phA > 0.004 ? 'visible' : 'hidden';
  let ki = 0; for (let k = 0; k < SIRA.length; k++) if (t >= SIRA[k][0] - 0.1) ki = k; const xf = ki > 0 && t < SIRA[ki][0] + 0.1; const mix = xf ? clamp((t - (SIRA[ki][0] - 0.1)) / 0.2) : 1; const kB = SIRA[ki][1], kA = xf ? SIRA[ki - 1][1] : kB;
  for (const [k, im] of Object.entries(ekrImg)) im.style.opacity = k === kB ? String(mix) : (k === kA && xf ? '1' : '0');
  const dd = kB === '02'; const rowsR = (k) => { const c = ODAK.ekranlar[k] && ODAK.ekranlar[k].telefonCerceve; if (!c) return null; const [x0, y0] = telTex(c.x0 + 6, c.y0), [x1, y1] = telTex(c.x1 - 6, c.y1); return { x0, y0, x1, y1 }; };
  let hr = null, ha = 0; if (dd) { const [x0, y0] = telTex(DDRECT.x0, DDRECT.y0), [x1, y1] = telTex(DDRECT.x1, DDRECT.y1); hr = { x0, y0, x1, y1 }; ha = eo(t, tDD + 0.15, 0.3); } else if (['tr', 'en', 'de', 'fr'].includes(kB)) { hr = rowsR(kB); ha = eo(t, SIRA[ki][0] + 0.05, 0.3); }
  setHole(dim, vur, hr, ekW, ekH, hr ? ha : 0);
  const dl = aktifDil(t); const sa = phA * eo(t, tDD, 0.4); rozet.style.opacity = String((sa).toFixed(3));
  for (const [k, e] of Object.entries(dilEl)) { const act = dl === k; e.style.opacity = String((sa * (act ? 1 : 0.5)).toFixed(3)); e.querySelector('.cubuk').style.opacity = act ? '1' : '0'; e.style.color = act ? '#C9A84C' : '#F4F1E8'; e.style.transform = `translateX(${(act ? 0 : 0)}px)`; }
  // panel
  const pA = t >= vc('c8') ? Math.min(eo(t, vc('c8') + 0.05, 0.45), 1 - eo(t, wipe2[0] - 0.05, 0.25)) : 0; for (const e of [pser, pan, tipo]) { e.style.opacity = String(pA.toFixed(3)); e.style.visibility = pA > 0.004 ? 'visible' : 'hidden'; }
  pan.style.transform = pser.style.transform = `translateY(${(40 * (1 - easeOut3(clamp(pA)))).toFixed(1)}px)`; tipo.style.transform = `translateY(${(24 * (1 - easeOut3(clamp(pA)))).toFixed(1)}px)`;
  const sr = seqRect(t, HL); setHole(pdim, pvur, sr.rect, PW, PHh, sr.on ? eo(t, c9.baslangic, 0.3) : 0);
  // CTA
  const cA = (t >= vc('c13') ? eo(t, vc('c13') - 0.05, 0.4) : 0) * fo; ctaB.style.opacity = String(cA.toFixed(3)); ctaB.style.transform = `translateY(${(36 * (1 - easeOut3(clamp(cA)))).toFixed(1)}px)`; ctaB.style.visibility = cA > 0.004 ? 'visible' : 'hidden'; adres.style.opacity = String((cA * eo(t, vc('c13') + 0.15, 0.4)).toFixed(3));
  for (const id of ['c13', 'c14', 'c15']) bloklar[id].el.style.opacity = String((parseFloat(bloklar[id].el.style.opacity) * fo).toFixed(3));
  return true;
}
const KART_AD = ['diller', 'diller', 'csvIce', 'diller'];
window.__vurgu = (t) => { frame(t); let i = -1; for (let k = 0; k < HL.length; k++) if (t >= HL[k].t) i = k; return { kart: i >= 0 && pA_(t) > 0.5 ? KART_AD[i] : null }; };
const pA_ = (t) => parseFloat(pan.style.opacity || '0');
window.__ol = (t) => { frame(t); const out = []; const goster = (e) => e && parseFloat(e.style.opacity || '0') > 0.05 && e.style.visibility !== 'hidden';
  for (const p of Object.values(P)) { const b = bloklar[p.id]; const a = parseFloat(b.el.style.opacity || '0'); out.push({ id: p.id, a, fs: b.fs, rect: (() => { const r = b.el.getBoundingClientRect(); return { x0: r.left, x1: r.right, y0: r.top, y1: r.bottom }; })(), renk: getComputedStyle(b.el).color, gorunur: goster(b.el) }); }
  const ekle = (id, e, fs) => { if (goster(e)) { const r = e.getBoundingClientRect(); out.push({ id, a: parseFloat(e.style.opacity), fs, rect: { x0: r.left, x1: r.right, y0: r.top, y1: r.bottom }, renk: getComputedStyle(e).color, gorunur: true }); } };
  ekle('adres', adres, 54); ekle('tipo', tipo, 56); ekle('cta', ctaB, ctaB.fs); ekle('rozet', rozet, 36);
  for (const [k, e] of Object.entries(dilEl)) ekle('dil-' + k, e, 40);
  const zumGor = parseFloat((zum.style.clipPath.match(/inset\(([\d.]+)%/) || [0, 100])[1]) < 100;
  return { t, ogeler: out, zumTop: parseFloat((zum.style.clipPath.match(/inset\(([\d.]+)%/) || [0, 100])[1]) }; };
window.frame = frame; window.hazir = true;
