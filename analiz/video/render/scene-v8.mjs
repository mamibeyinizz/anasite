// Çoklu Dil Reels v8 — tam boy (1080×1920) kurumsal sahne; ALTYAZI plakası, anahtar kart, ürün ekranları büyük. DOM/CSS/SVG; three.js YOK. window.frame(t) deterministik.
// Zamanlar ses/cue-v4.json (CUE_DOSYA) cümle sınırlarından; sabit saniye yok. Hareket: opaklık + 24–48 px kayma + ≤%3 ölçek, ease-out 280–480 ms.
await Promise.all([800, 700, 500].map((w) => document.fonts.load(`${w} 40px Manrope`, 'ÇĞİÖŞÜçğıöşü¿'))); await document.fonts.ready;
const CUE = await (await fetch('/cue.json')).json(); const S = CUE.cumleler; const ODAK = await (await fetch('/tex/odak.json')).json();
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)); const seg = (t, a, b) => clamp((t - a) / (b - a)); const lerp = (a, b, k) => a + (b - a) * k;
const e3 = (x) => 1 - Math.pow(1 - x, 3), e5 = (x) => 1 - Math.pow(1 - x, 5); const eo = (t, a, d, f = e3) => f(seg(t, a, a + d));
const $ = (tag, c, st, p, h) => { const e = document.createElement(tag); if (c) e.className = c; if (st) Object.assign(e.style, st); if (h !== undefined) e.innerHTML = h; if (p) p.appendChild(e); return e; };
const stage = document.getElementById('stage'); const SURE = CUE.konusmaBitis + 0.8; const KARE = Math.round(SURE * 30);
const ROW = { r1: [0], r2: [1], r3: [2], r4: [3, 4], r5: [5], r6: [6, 7, 8], r7: [9], r8: [10, 11] };
const rA = (r) => S[ROW[r][0]].baslangic - 0.08, rB = (r) => S[ROW[r].slice(-1)[0]].bitis + 0.12;
const T = { r1: 0, r2: rA('r2'), r3: rA('r3'), r4: rA('r4'), r6: rA('r6'), r7: rA('r7'), r8: rA('r8') }; T.r5 = rA('r5');
const KAPAN = rB('r8'), LOOP = KAPAN;

/* ───────── katmanlar ───────── */
const HALKA = (kol) => { const ns = 'http://www.w3.org/2000/svg'; const sv = document.createElementNS(ns, 'svg'); sv.setAttribute('class', 'halka'); sv.setAttribute('viewBox', '0 0 1080 1920'); for (let r = 150; r <= 1250; r += 150) { const c = document.createElementNS(ns, 'circle'); c.setAttribute('cx', 540); c.setAttribute('cy', 960); c.setAttribute('r', r); c.setAttribute('fill', 'none'); c.setAttribute('stroke', kol); c.setAttribute('stroke-width', 3); sv.appendChild(c); } return sv; };
const altin = $('div', 'katman', null, stage); altin.id = 'altin'; $('div', 'nokta', null, altin); altin.appendChild(HALKA('rgba(13,43,34,.13)')); $('div', 'vin', null, altin); const ton = $('div', 'ton', null, altin);
const zum = $('div', 'katman', null, stage); zum.id = 'zum'; $('div', 'nokta', null, zum); zum.appendChild(HALKA('rgba(201,168,76,.13)')); $('div', 'vin', null, zum);
const etA = $('div', 'etiket', { left: '96px' }, altin, 'ÇOKLU DİL MODÜLÜ'), etZ = $('div', 'etiket', { left: '96px' }, zum, 'ÇOKLU DİL MODÜLÜ');
const sahne = (kat, ad) => { const d = $('div', 'sahne', null, kat); d.dataset.ad = ad; return d; };
const blok = (par, html, top, fs, left = 96) => { const e = $('div', 'blok', { top: top + 'px', left: left + 'px', fontSize: fs + 'px' }, par, html.map((s) => `<span class="l">${s}</span>`).join('')); return e; };
const fit = (e, mx, mn, W = 888) => { let fs = mx; e.style.fontSize = fs + 'px'; const o = () => Math.max(...[...e.children].map((c) => c.getBoundingClientRect().width)); while (o() > W && fs > mn) { fs -= 2; e.style.fontSize = fs + 'px'; } return fs; };

/* ───────── sahneler ───────── */
const s1 = sahne(altin, 'kanca'); const k1 = blok(s1, ['Dil', 'engeli,', 'kayıp masa.'], 350, 150); const fs1 = fit(k1, 150, 120);
const SEL = ['Hello?', 'Hallo?', 'Bonjour?', '¿Hola?']; const sel = SEL.map((t, i) => $('div', 'sel', { top: (1296 + i * 150) + 'px', left: '96px' }, s1, t));
const s2 = sahne(altin, 'aci'); const k2 = blok(s2, ['Diğer masalar', 'bekliyor.'], 380, 128); fit(k2, 128, 100);
const CARD = (kat, i, dolu) => { const col = i % 2, row = Math.floor(i / 2); const e = $('div', 'masa ' + (dolu ? 'dolu' : 'bos'), { left: (80 + col * 450) + 'px', top: (1292 + row * 290) + 'px' }, kat, `<div class="b">MASA ${i + 1}</div><div class="d">${dolu ? 'GARSON<br>yabancı masada' : 'BEKLİYOR'}</div>${dolu ? '' : '<div class="z"><i></i></div>'}`); return e; };
const tm = $('div', 'tmr', { top: '660px' }, s2, '0:12'); $('div', 'tmrc', { top: '930px' }, s2, 'Bekleme süresi');
const mc = [0, 1, 2, 3].map((i) => CARD(s2, i, i === 0));
const s3 = sahne(zum, 'donus'); const k3 = $('div', 'blok', { top: '360px', fontSize: '140px' }, s3, '<span class="l">Çözüm:</span><span class="l" style="margin-top:14px"><b class="pill">Çoklu Dil</b></span>');
const KS3 = [['TR · EN · DE', 740, 100, '#F4F1E8'], ['FR · RU · AR', 870, 100, '#F4F1E8'], ['+20 dil', 1300, 240, '#C9A84C'], ['ES · IT · PT · NL', 1620, 100, '#F4F1E8'], ['PL · SV · CS · EL', 1750, 100, '#F4F1E8']]; const kodlar = KS3.map(([t, y, f, c]) => $('div', 'kod', { left: '96px', top: y + 'px', opacity: 0, fontSize: f + 'px', color: c }, s3, t));
// telefon (r4–r5)
const s4 = sahne(zum, 'telefon'); const EP = { x0: 14, x1: 830 }; const ekW = 760, ps = ekW / (EP.x1 - EP.x0), ekH = Math.round((1707 - 710) * ps); const PX = 148, PY = 390;
const tel = $('div', 'telefon', { left: PX + 'px', top: PY + 'px', width: (ekW + 24) + 'px', height: (ekH + 24) + 'px' }, s4); const ekr = $('div', 'ekr', { left: '12px', top: '12px', width: ekW + 'px', height: ekH + 'px', borderRadius: '44px' }, tel);
const SRC = { '01': '/ekran/01-acilis-tr.png', '02': '/ekran/02-dil-secici.png', tr: '/ekran/03-menu-tr.png', en: '/ekran/04-menu-en.png', de: '/ekran/05-menu-de.png', fr: '/ekran/06-menu-fr.png' }; const Y0 = { '01': 96, '02': 96, tr: 710, en: 710, de: 710, fr: 710 }; const ekrI = {};
for (const [k, u] of Object.entries(SRC)) { const im = $('img', '', { left: (-EP.x0 * ps) + 'px', top: (-Y0[k] * ps) + 'px', width: (860 * ps) + 'px', height: (1800 * ps) + 'px' }, ekr); im.src = u; ekrI[k] = im; }
const dim = $('div', 'dim', null, ekr); const vur = $('div', 'vurgu', null, ekr);
const sirit = $('div', 'sirit', null, s4); const chip = {}; const ADI = { tr: 'Türkçe', en: 'English', de: 'Deutsch', fr: 'Français' }; ['tr', 'en', 'de', 'fr'].forEach((k, i) => { chip[k] = $('div', '', { left: (80 + (i % 2) * 450) + 'px', top: (1370 + Math.floor(i / 2) * 270) + 'px' }, sirit, `<b>${k.toUpperCase()}</b><span>${ADI[k]}</span>`); });
const rozet = $('div', 'rozet', { left: '96px', top: '340px' }, s4, '<i></i>Gerçek demo menü');
// modül (r6)
const s6 = sahne(zum, 'modul'); const k6 = blok(s6, ['20+ dil'], 340, 190); { k6.style.color = '#C9A84C'; }
const HUB = '/ekran/07b-panel-hub.png'; const FW = 930, FH = 283, KS = FW / 332 / 2;                      // css→px 2,8; hub PNG 2× → görüntü ölçeği 1,4
const mkKart = (top, css, hole) => { const f = $('div', 'kes', { left: '75px', top: top + 'px', width: FW + 'px', height: FH + 'px' }, s6); const im = $('img', '', { left: (-css.x0 * 2 * KS) + 'px', top: (-css.y0 * 2 * KS) + 'px', width: (2560 * KS) + 'px' }, f); im.src = HUB; const d = $('div', 'dim', null, f), v = $('div', 'vurgu', null, f);
  const r = { x0: (hole.x0 - css.x0) * 2 * KS - 8, y0: (hole.y0 - css.y0) * 2 * KS - 8, x1: (hole.x1 - css.x0) * 2 * KS + 8, y1: (hole.y1 - css.y0) * 2 * KS + 8 }; return { f, d, v, r }; };
const KRT = ODAK.panel.kartlar; const c1 = mkKart(640, { x0: 272, y0: 209 }, KRT.diller), c2 = mkKart(1300, { x0: 604, y0: 309 }, KRT.csvIce);
const setHole = (c, a) => { if (a < 0) { c.d.style.clipPath = 'none'; return; } const W = FW, H = FH, r = c.r; c.d.style.opacity = String(a); c.v.style.opacity = String(a); c.d.style.clipPath = `polygon(evenodd, 0 0, ${W}px 0, ${W}px ${H}px, 0 ${H}px, 0 0, ${r.x0}px ${r.y0}px, ${r.x0}px ${r.y1}px, ${r.x1}px ${r.y1}px, ${r.x1}px ${r.y0}px, ${r.x0}px ${r.y0}px)`; Object.assign(c.v.style, { left: r.x0 + 'px', top: r.y0 + 'px', width: (r.x1 - r.x0) + 'px', height: (r.y1 - r.y0) + 'px' }); };
const kodS = $('div', 'kodsira', null, s6); ['TR','EN','DE','FR','RU','AR','ES','IT','PT','NL','PL','+20'].forEach((c) => $('span', c === '+20' ? 'on' : '', null, kodS, c));
// fayda (r7)
const s7 = sahne(altin, 'fayda'); const k7 = blok(s7, ['Dil değil,', '<b class="pill">servis.</b>'], 380, 146); fit(k7, 146, 120); const mc7 = [0, 1, 2, 3].map((i) => { const e = CARD(s7, i, true); e.querySelector('.d').innerHTML = 'SERVİS'; return e; });
// kapanış (r8)
const s8 = sahne(altin, 'kapanis'); const logoK = $('img', 'logo', { left: '65px', top: '262px', width: '200px' }, s8); logoK.src = '/brand/qr-menu-official-logo-v4-dark.svg'; const etK = $('div', 'etiket', { top: '276px', left: '470px' }, s8, 'ÇOKLU DİL MODÜLÜ');
const k8 = blok(s8, ['Canlı menüyü', 'telefonunuzda', 'deneyin'], 380, 118); fit(k8, 118, 100); const adres = $('div', 'adres', { top: '900px' }, s8, 'qrmenuofficial.com/canli-menu');
const logoB = $('img', 'logo', { left: '240px', top: '1420px', width: '600px' }, s8); logoB.src = '/brand/qr-menu-official-logo-v4-dark.svg';
const ok = $('div', '', { position: 'absolute', left: '534px', top: '1700px', width: '12px', height: '200px' }, s8, '<svg width="12" height="200" viewBox="0 0 12 200" fill="none" stroke="#0D2B22" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 194 V10 M-14 36 L6 8 L26 36"/></svg>');

/* ───────── altyazı: ses metninin AYNISI; ≤2 satır, satır ≤26 karakter; parça süresi karakterle orantılı, ≥0,9 sn ───────── */
const ANAH = ['yabancı dil', 'bekler', 'Çoklu Dil', 'dilini seçer', 'kendi dilinde', 'kendi dilinde', 'Dilleri', 'dosyadan', 'Yirmiden fazla dil', 'servis', 'kendi telefonunuzda', 'profilimizde'];
const _o = $('span', '', { position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap', fontWeight: 800, fontSize: '64px', letterSpacing: '-.025em' }, stage); const olc = (t) => { _o.textContent = t; return _o.getBoundingClientRect().width; };
const parcala = (i) => { const m = S[i].metin; const kelime = m.split(' '); const anah = ANAH[i].split(' '); const isK = new Array(kelime.length).fill(false); const norm = (w) => w.replace(/[.,]/g, '');
  for (let k = 0; k + anah.length <= kelime.length; k++) if (anah.every((a, j) => norm(kelime[k + j]) === a)) { for (let j = 0; j < anah.length; j++) isK[k + j] = true; break; }
  const satir = []; let cur = []; kelime.forEach((w, k) => { const dene = cur.concat(k); if (olc(dene.map((x) => kelime[x]).join(' ')) > 840 && cur.length) { satir.push(cur); cur = [k]; } else cur = dene; }); if (cur.length) satir.push(cur);
  const chunks = []; for (let k = 0; k < satir.length; k += 2) chunks.push(satir.slice(k, k + 2)); const html = (ln) => ln.map((idx) => idx.map((k) => (isK[k] ? `<b class="k">${kelime[k]}</b>` : kelime[k])).join(' '));
  const chars = chunks.map((c) => c.flat().map((k) => kelime[k].length + 1).reduce((a, b) => a + b, 0)); const tot = chars.reduce((a, b) => a + b, 0); const a0 = Math.max(0, S[i].baslangic - 0.05), b0 = S[i].bitis + 0.1; const dur = b0 - a0; let t = a0; const out = [];
  chunks.forEach((c, j) => { const d = Math.max(0.9, dur * chars[j] / tot); out.push({ a: t, b: Math.min(b0, t + d), satirlar: html(c), cumle: i }); t += d; }); if (out.length) out[out.length - 1].b = b0; return out; };
const CH = S.flatMap((_, i) => parcala(i)); const tpl = (c) => c.satirlar.map((s) => `<span class="l">${s}</span>`).join('');
const plA = $('div', 'plaka', null, altin), plZ = $('div', 'plaka', null, zum); const zumSahne = new Set(['r3', 'r4', 'r5', 'r6']);
const rowOf = (i) => Object.keys(ROW).find((r) => ROW[r].includes(i));

window.__tl = { T, S, KAPAN, LOOP, SURE, KARE, CH: CH.map((c) => ({ a: c.a, b: c.b, cumle: c.cumle, metin: c.satirlar.join(' ').replace(/<[^>]+>/g, '') })) };
const tCSV = S[7].baslangic + 0.48 * (S[7].bitis - S[7].baslangic); window.__tl.tCSV = tCSV;

/* ───────── kare ───────── */
const kayma = (e, a, dy) => { e.style.opacity = a.toFixed(3); e.style.transform = `translateY(${(dy * (1 - e3(clamp(a)))).toFixed(1)}px) scale(${(0.985 + 0.015 * e3(clamp(a))).toFixed(4)})`; e.style.visibility = a > 0.004 ? 'visible' : 'hidden'; };
const pencere = (t, a, b, iy = 0.4, oy = 0.3) => Math.min(eo(t, a, iy), 1 - eo(t, b - oy, oy));
function frame(t) {
  t = clamp(t, 0, SURE); const loop = t >= LOOP; const hookIn = loop ? seg(t, LOOP, LOOP + 0.69) : 0; const tt = loop ? 0 : t;   // döngü: kancaya geri
  // perde (zümrüt alttan yukarı; altın üstten aşağı)
  const pin = e5(seg(t, T.r3 - 0.3, T.r3 + 0.15)), pout = e5(seg(t, T.r7 - 0.3, T.r7 + 0.15)); zum.style.clipPath = `inset(${Math.max(1 - pin, pout) * 100}% 0 0 0)`;
  const tonA = eo(t, T.r2, 0.6) * (1 - eo(t, T.r3 - 0.3, 0.4)); ton.style.opacity = (0.2 * tonA).toFixed(3);
  // sahne görünürlükleri
  const vis = (a, b) => pencere(t, a - 0.05, b, 0.35, 0.18);
  const a1 = loop ? hookIn : (t < T.r2 ? 1 : Math.max(0, 1 - eo(t, T.r2 - 0.25, 0.2))); kayma(s1, a1, 0); kayma(s2, vis(T.r2, T.r3), 36); kayma(s3, vis(T.r3, T.r4), 36); kayma(s4, vis(T.r4, T.r6), 40); kayma(s6, vis(T.r6, T.r7), 36); kayma(s7, vis(T.r7, T.r8), 36);
  const a8 = pencere(t, T.r8 - 0.05, SURE + 1, 0.35, 0.1) * (t > KAPAN ? 1 - seg(t, KAPAN, KAPAN + 0.69) : 1); kayma(s8, a8, 36);
  etA.style.opacity = String((a8 > 0.05 ? 0 : 1)); etZ.style.opacity = '1';
  // kanca: selamlar
  sel.forEach((e, i) => { const a = (loop ? 0 : eo(tt, 0.3 + i * 0.5, 0.4)) * 0.62; kayma(e, a / 0.62 * 0.62, 24); e.style.opacity = a.toFixed(3); });
  // acı: kartlar
  mc.forEach((e, i) => { if (i === 0) return; const p = seg(t, T.r2 + 0.5 + i * 0.3, S[1].bitis); e.querySelector('.z i').style.width = (p * 100).toFixed(1) + '%'; });
  tm.textContent = (() => { const k = seg(t, T.r2, T.r3); const sn = Math.round(12 + 276 * k); return Math.floor(sn / 60) + ':' + String(sn % 60).padStart(2, '0'); })();
  // dönüş: kodlar
  kodlar.forEach((e, i) => kayma(e, eo(t, T.r3 + 0.45 + i * 0.3, 0.4), 28));
  // telefon durumları
  const tD = S[3].baslangic + 0.55, tTR = S[4].baslangic, tEN = S[4].baslangic + 0.55 * (S[4].bitis - S[4].baslangic), tDE = S[5].baslangic + 0.15, tFR = S[5].baslangic + 0.5 * (S[5].bitis - S[5].baslangic);
  const SIRA = [[0, '01'], [tD, '02'], [tTR, 'tr'], [tEN, 'en'], [tDE, 'de'], [tFR, 'fr']]; let ki = 0; for (let k = 0; k < SIRA.length; k++) if (t >= SIRA[k][0] - 0.1) ki = k; const xf = ki > 0 && t < SIRA[ki][0] + 0.1; const mix = xf ? clamp((t - (SIRA[ki][0] - 0.1)) / 0.2) : 1; const kB = SIRA[ki][1], kA = xf ? SIRA[ki - 1][1] : kB;
  for (const [k, im] of Object.entries(ekrI)) im.style.opacity = k === kB ? String(mix) : (k === kA && xf ? '1' : '0');
  const px = (x, y, k) => [(x - EP.x0) * ps, (y - Y0[k]) * ps]; let hr = null, ha = 0;
  if (kB === '02') { const [x0, y0] = px(16, 126, '02'), [x1, y1] = px(342, 722, '02'); hr = { x0, y0, x1, y1 }; ha = eo(t, tD + 0.2, 0.3); } else if (kB !== '01') { const c = ODAK.ekranlar[kB].telefonCerceve; const [x0, y0] = px(c.x0 + 6, c.y0, kB), [x1, y1] = px(c.x1 - 6, c.y1, kB); hr = { x0, y0, x1, y1 }; ha = eo(t, SIRA[ki][0] + 0.1, 0.3); }
  if (hr) { dim.style.opacity = String(ha); vur.style.opacity = String(ha); dim.style.clipPath = `polygon(evenodd, 0 0, ${ekW}px 0, ${ekW}px ${ekH}px, 0 ${ekH}px, 0 0, ${hr.x0}px ${hr.y0}px, ${hr.x0}px ${hr.y1}px, ${hr.x1}px ${hr.y1}px, ${hr.x1}px ${hr.y0}px, ${hr.x0}px ${hr.y0}px)`; Object.assign(vur.style, { left: hr.x0 + 'px', top: hr.y0 + 'px', width: (hr.x1 - hr.x0) + 'px', height: (hr.y1 - hr.y0) + 'px' }); } else { dim.style.opacity = '0'; vur.style.opacity = '0'; }
  const dl = kB === 'tr' || kB === 'en' || kB === 'de' || kB === 'fr' ? kB : null; for (const [k, e] of Object.entries(chip)) e.className = dl === k ? 'on' : '';
  // panel
  const hlD = (t >= S[6].baslangic - 0.05 && t < tCSV - 0.12) || t >= S[8].baslangic - 0.05; const hlC = t >= tCSV - 0.12 && t < S[8].baslangic - 0.05; const kA_ = (x) => x;
  const pA = t >= S[6].baslangic; const kD = hlD ? eo(t, S[6].baslangic, 0.3) : 0, kC = hlC ? eo(t, tCSV - 0.12, 0.3) : 0;
  for (const [c, on, k] of [[c1, hlD, kD], [c2, hlC, kC]]) { if (on) { setHole(c, 1); c.d.style.opacity = '0'; c.v.style.opacity = k.toFixed(3); } else { setHole(c, -1); c.d.style.opacity = pA ? '0.55' : '0'; c.v.style.opacity = '0'; } }
  // altyazı
  let ch = null; for (const c of CH) if (t >= c.a && t < c.b) ch = c; const cur = ch; let pa = 0; if (cur) pa = Math.min(eo(t, cur.a, 0.22), 1 - eo(t, cur.b - 0.14, 0.14)); if (loop) pa = 0;
  if (cur) { const h = tpl(cur); if (plA.dataset.h !== h) { plA.innerHTML = h; plZ.innerHTML = h; plA.dataset.h = h; } }
  plA.style.opacity = pa.toFixed(3); plZ.style.opacity = pa.toFixed(3); for (const p of [plA, plZ]) p.style.transform = `translateY(${(14 * (1 - e3(clamp(pa)))).toFixed(1)}px)`;
  return true;
}
window.frame = frame;
window.__bos = (t, dekor) => { frame(t); if (dekor) for (const e of document.querySelectorAll('.halka,.vin')) e.style.opacity = '0'; for (const e of document.querySelectorAll('.sahne,.plaka,.etiket')) e.style.opacity = '0'; return true; };
window.hazir = true;
