// Çoklu Dil Reels v9 — v8'in UX düzeltmesi. Bölgeler: A 270–330 etiket · B 330–1020 ana görsel/anahtar kart · C 1040–1236 altyazı plakası (her karede opak) · D 1248–1920 yalnız dekor (.dekor).
// Geçiş kuralı: çıkan metin 160 ms'de söner, gelen metin sonra belirir (çakışma yok). Zamanlar ses/cue-v4.json (CUE_DOSYA). three.js YOK. window.frame(t) deterministik.
await Promise.all([800, 700, 500].map((w) => document.fonts.load(`${w} 40px Manrope`, 'ÇĞİÖŞÜçğıöşü¿'))); await document.fonts.ready;
const CUE = await (await fetch('/cue.json')).json(); const S = CUE.cumleler; const ODAK = await (await fetch('/tex/odak.json')).json();
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)); const seg = (t, a, b) => clamp((t - a) / (b - a));
const e3 = (x) => 1 - Math.pow(1 - x, 3), e5 = (x) => 1 - Math.pow(1 - x, 5); const eo = (t, a, d, f = e3) => f(seg(t, a, a + d));
const $ = (tag, c, st, p, h) => { const e = document.createElement(tag); if (c) e.className = c; if (st) Object.assign(e.style, st); if (h !== undefined) e.innerHTML = h; if (p) p.appendChild(e); return e; };
const stage = document.getElementById('stage'); const SURE = CUE.konusmaBitis + 0.8; const KARE = Math.round(SURE * 30);
const ROW = { r1: [0], r2: [1], r3: [2], r4: [3, 4, 5], r6: [6, 7, 8], r7: [9], r8: [10, 11] };
const Ts = (r) => (r === 'r1' ? 0 : Math.max(0, S[ROW[r][0]].baslangic - 0.05)); const T = { r1: 0, r2: Ts('r2'), r3: Ts('r3'), r4: Ts('r4'), r6: Ts('r6'), r7: Ts('r7'), r8: Ts('r8') };
const KAPAN = SURE - 0.7; const OUT = 0.16;

/* ───────── katmanlar ───────── */
const altin = $('div', 'katman', null, stage); altin.id = 'altin'; $('div', 'nokta', null, altin);
const zum = $('div', 'katman', null, stage); zum.id = 'zum'; $('div', 'nokta', null, zum);
const sahne = (kat) => $('div', 'sahne', null, kat);
const etiket = (p, st) => $('div', 'etiket', Object.assign({ left: '96px' }, st || {}), p, 'ÇOKLU DİL MODÜLÜ');
const blok = (par, html, top, fs, left = 96) => $('div', 'blok', { top: top + 'px', left: left + 'px', fontSize: fs + 'px' }, par, html.map((s) => `<span class="l">${s}</span>`).join(''));
const fit = (e, mx, mn, W = 880) => { let fs = mx; e.style.fontSize = fs + 'px'; const o = () => Math.max(...[...e.children].map((c) => c.getBoundingClientRect().width)); while (o() > W && fs > mn) { fs -= 2; e.style.fontSize = fs + 'px'; } return fs; };
const GH = (p, n, y0) => { for (let i = 0; i < n; i++) $('div', 'gh dekor', { left: (100 + (i % 2) * 450) + 'px', top: (y0 + Math.floor(i / 2) * 240) + 'px' }, p); };
const CARD = (p, i, html, dolu) => $('div', 'masa ' + (dolu ? 'dolu' : 'bos'), { left: (100 + (i % 2) * 450) + 'px', top: (540 + Math.floor(i / 2) * 240) + 'px' }, p, html);

// S1 kanca (altın)
const s1 = sahne(altin); etiket(s1); const k1 = blok(s1, ['Dil', 'engeli,', 'kayıp masa.'], 360, 140); fit(k1, 140, 120);
const SEL = ['Hello?', 'Hallo?', 'Bonjour?', '¿Hola?']; const sel = SEL.map((t, i) => $('div', 'sel dekor', { top: (1296 + i * 150) + 'px', left: '96px' }, s1, t));
// S2 acı (altın)
const s2 = sahne(altin); etiket(s2); const mc = [0, 1, 2, 3].map((i) => CARD(s2, i, i === 0 ? '<div class="b">MASA 1</div><div class="d">SİPARİŞ<br>ALINIYOR</div>' : `<div class="b">MASA ${i + 1}</div><div class="d">BEKLİYOR</div><div class="z"><i></i></div>`, i === 0)); GH(s2, 4, 1300);
// S3 dönüş (zümrüt)
const s3 = sahne(zum); etiket(s3); const k3 = $('div', 'blok', { top: '380px', fontSize: '150px' }, s3, '<span class="l"><b class="pill">Çoklu Dil</b></span>');
const KOD = ['TR · EN · DE · FR', 'ES · IT · RU · AR']; const kodlar = KOD.map((t, i) => $('div', 'kod', { left: '96px', top: (660 + i * 140) + 'px', fontSize: '92px', color: '#F4F1E8' }, s3, t)); GH(s3, 4, 1300);
// S4 çözüm: gerçek ekran kırpma kartı 900×600 (x90–990, y400–1000)
const s4 = sahne(zum); etiket(s4); const KX = 90, KY = 400, KW = 900, KH = 600; const es4 = $('div', 'es', { left: '96px', top: '338px' }, s4, 'TR · Türkçe'); const rz = $('div', 'es s', { right: '90px', top: '344px' }, s4, 'Gerçek demo menü');
const kt = $('div', 'kt', { left: KX + 'px', top: KY + 'px', width: KW + 'px', height: KH + 'px' }, s4);
const SRC = { dd: '/ekran/02-dil-secici.png', tr: '/ekran/03-menu-tr.png', en: '/ekran/04-menu-en.png', de: '/ekran/05-menu-de.png', fr: '/ekran/06-menu-fr.png' };
const KS = { dd: { k: 1.15, x0: 0, y0: 120 }, tr: { k: 1.125, x0: 30, y0: 868 }, en: { k: 1.125, x0: 30, y0: 868 }, de: { k: 1.125, x0: 30, y0: 868 }, fr: { k: 1.125, x0: 30, y0: 868 } }; const kim = {};
for (const [k, u] of Object.entries(SRC)) { const c = KS[k]; const im = $('img', '', { opacity: 0, left: (-c.x0 * c.k) + 'px', top: (-c.y0 * c.k) + 'px', width: (860 * c.k) + 'px', height: (1800 * c.k) + 'px' }, kt); im.src = u; kim[k] = im; }
const ETI = { dd: 'Dil seçici', tr: 'TR · Türkçe', en: 'EN · English', de: 'DE · Deutsch', fr: 'FR · Français' };
const sirit = $('div', 'sirit', null, s4); const chip = {}; ['tr', 'en', 'de', 'fr'].forEach((k, i) => { chip[k] = $('div', 'dekor', { left: (100 + (i % 2) * 430) + 'px', top: (1320 + Math.floor(i / 2) * 250) + 'px' }, sirit, `<b>${k.toUpperCase()}</b>`); });
// S5 modül: Diller + CSV İçe Aktar kırpmaları (hub, css→px ×2, ölçek 1,15)
const s5 = sahne(zum); etiket(s5); const k5 = $('div', 'es', { left: '96px', top: '350px', fontSize: '84px', letterSpacing: '-.03em' }, s5, '20\'den fazla dil');
const HUB = '/ekran/07b-panel-hub.png'; const HK = 1.15; const mkP = (top, cx, cy, ch) => { const f = $('div', 'kt', { left: '90px', top: top + 'px', width: '900px', height: Math.round(ch * 2 * HK) + 'px', background: '#EADFC1' }, s5); const im = $('img', '', { left: (-cx * 2 * HK) + 'px', top: (-cy * 2 * HK) + 'px', width: (2560 * HK) + 'px' }, f); im.src = HUB; const d = $('div', 'dim', { opacity: 0 }, f), c = $('div', 'cer', null, f); return { f, d, c }; };
const pD = mkP(480, 264, 209, 98), pC = mkP(760, 604, 309, 98);
const kod5 = $('div', 'kodsira', null, s5); ['TR', 'EN', 'DE', 'FR', 'ES', 'IT', 'RU', 'AR'].forEach((c) => $('span', 'dekor', null, kod5, c));
// S6 fayda (altın): servis kartları
const s6 = sahne(altin); etiket(s6); const sv = [0, 1, 2, 3].map((i) => CARD(s6, i, `<div class="b">MASA ${i + 1}</div><div class="d">SERVİSTE</div>`, true)); GH(s6, 4, 1300);
// S7 kapanış (altın)
const s7 = sahne(altin); const logoK = $('img', 'logo', { left: '65px', top: '262px', width: '240px' }, s7); logoK.src = '/brand/qr-menu-official-logo-v4-dark.svg'; $('div', 'etiket', { top: '274px', left: '470px' }, s7, 'ÇOKLU DİL MODÜLÜ');
const k7 = blok(s7, ['Canlı menü'], 380, 150); const adres = $('div', 'adres', { top: '640px', left: '96px' }, s7, 'qrmenuofficial.com/canli-menu'); { let fs = 56; while (adres.getBoundingClientRect().width > 880 && fs > 48) { fs -= 2; adres.style.fontSize = fs + 'px'; } }

/* ───────── altyazı ───────── */
const ANAH = ['yabancı dil', 'bekler', 'Çoklu Dil', 'dilini seçer', 'kendi dilinde', 'kendi dilinde', 'Dilleri', 'dosyadan', 'Yirmiden fazla dil', 'servis', 'kendi telefonunuzda', 'profilimizde'];
const _o = $('span', '', { position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap', fontWeight: 800, fontSize: '64px', letterSpacing: '-.025em' }, stage); const olc = (t) => { _o.textContent = t; return _o.getBoundingClientRect().width; };
const parcala = (i) => { const m = S[i].metin; const kelime = m.split(' '); const anah = ANAH[i].split(' '); const isK = new Array(kelime.length).fill(false); const norm = (w) => w.replace(/[.,]/g, '');
  for (let k = 0; k + anah.length <= kelime.length; k++) if (anah.every((a, j) => norm(kelime[k + j]) === a)) { for (let j = 0; j < anah.length; j++) isK[k + j] = true; break; }
  const satir = []; let cur = []; kelime.forEach((w, k) => { const dene = cur.concat(k); if (olc(dene.map((x) => kelime[x]).join(' ')) > 840 && cur.length) { satir.push(cur); cur = [k]; } else cur = dene; }); if (cur.length) satir.push(cur);
  const chunks = []; for (let k = 0; k < satir.length; k += 2) chunks.push(satir.slice(k, k + 2)); const html = (ln) => ln.map((idx) => idx.map((k) => (isK[k] ? `<b class="k">${kelime[k]}</b>` : kelime[k])).join(' '));
  const chars = chunks.map((c) => c.flat().map((k) => kelime[k].length + 1).reduce((a, b) => a + b, 0)); const tot = chars.reduce((a, b) => a + b, 0); const a0 = Math.max(0, S[i].baslangic - 0.05), b0 = S[i].bitis + 0.1; const dur = b0 - a0; let t = a0; const out = [];
  chunks.forEach((c, j) => { const d = Math.max(0.9, dur * chars[j] / tot); out.push({ a: t, b: Math.min(b0, t + d), satirlar: html(c), cumle: i }); t += d; }); if (out.length) out[out.length - 1].b = b0; return out; };
const CH = S.flatMap((_, i) => parcala(i)); const tpl = (c) => c.satirlar.map((s) => `<span class="l">${s}</span>`).join('');
const plA = $('div', 'plaka', null, altin), plZ = $('div', 'plaka', null, zum); const ptA = $('div', 'pt', null, plA), ptZ = $('div', 'pt', null, plZ);
window.__tl = { T, S, KAPAN, SURE, KARE, CH: CH.map((c) => ({ a: c.a, b: c.b, cumle: c.cumle, metin: c.satirlar.join(' ').replace(/<[^>]+>/g, '') })) };
const tCSV = S[7].baslangic + 0.48 * (S[7].bitis - S[7].baslangic); window.__tl.tCSV = tCSV;

/* ───────── kare ───────── */
const kayma = (e, a, dy) => { e.style.opacity = a.toFixed(3); e.style.transform = `translateY(${(dy * (1 - e3(clamp(a)))).toFixed(1)}px)`; e.style.visibility = a > 0.004 ? 'visible' : 'hidden'; };
const pen = (t, a, b) => Math.min(a <= 0 ? 1 : eo(t, a, 0.3), 1 - seg(t, b - OUT, b));      // giriş 300 ms (a'dan), çıkış 160 ms (b'de biter)
function frame(t) {
  t = clamp(t, 0, SURE); const loop = t >= KAPAN;
  const pin = e5(seg(t, T.r3 - 0.3, T.r3 + 0.15)), pout = e5(seg(t, T.r7 - 0.3, T.r7 + 0.15)); zum.style.clipPath = `inset(${Math.max(1 - pin, pout) * 100}% 0 0 0)`;
  const a1 = t < T.r2 ? 1 : 0; const hook = loop ? eo(t, KAPAN + 0.4, 0.3) : Math.min(1, pen(t, T.r1, T.r2)); kayma(s1, Math.min(1, loop ? hook : (t < T.r2 ? pen(t, 0, T.r2) : 0)), 0);
  kayma(s2, pen(t, T.r2, T.r3), 30); kayma(s3, pen(t, T.r3, T.r4), 30); kayma(s4, pen(t, T.r4, T.r6), 30); kayma(s5, pen(t, T.r6, T.r7), 30); kayma(s6, pen(t, T.r7, T.r8), 30);
  kayma(s7, loop ? 1 - seg(t, KAPAN, KAPAN + OUT) : pen(t, T.r8, 1e9), 30);
  sel.forEach((e, i) => { const a = (loop ? 0 : eo(t, 0.3 + i * 0.5, 0.4)) * 0.62; e.style.opacity = a.toFixed(3); });
  mc.forEach((e, i) => { if (i === 0) return; e.querySelector('.z i').style.width = (seg(t, T.r2 + 0.5 + i * 0.3, S[1].bitis) * 100).toFixed(1) + '%'; });
  // S4 kart durumu
  const tD = T.r4, tTR = S[4].baslangic, tEN = S[4].baslangic + 0.55 * (S[4].bitis - S[4].baslangic), tDE = S[5].baslangic + 0.1, tFR = S[5].baslangic + 0.55 * (S[5].bitis - S[5].baslangic);
  const SIRA = [[tD, 'dd'], [tTR, 'tr'], [tEN, 'en'], [tDE, 'de'], [tFR, 'fr']]; let ki = 0; for (let k = 0; k < SIRA.length; k++) if (t >= SIRA[k][0]) ki = k; const mix = ki > 0 ? clamp((t - SIRA[ki][0]) / 0.16) : 1; const kB = SIRA[ki][1], kA = ki > 0 ? SIRA[ki - 1][1] : kB;
  for (const [k, im] of Object.entries(kim)) im.style.opacity = k === kB ? String(mix) : (k === kA && mix < 1 ? '1' : '0');
  es4.textContent = ETI[kB]; for (const [k, e] of Object.entries(chip)) e.className = 'dekor' + (kB === k ? ' on' : '');
  // S5 vurgu
  const hlC = t >= tCSV - 0.1 && t < S[8].baslangic - 0.05; const kD = t >= S[6].baslangic - 0.05 && t < S[7].bitis ? 1 : 0; const hlD = !hlC && t >= S[6].baslangic - 0.05;
  pD.d.style.opacity = hlD ? '0' : '0.55'; pD.c.style.opacity = hlD ? '1' : '0'; pC.d.style.opacity = hlC ? '0' : '0.55'; pC.c.style.opacity = hlC ? '1' : '0';
  const kk = Math.min(eo(t, S[6].baslangic - 0.05, 0.25), 1 - seg(t, S[6].bitis + 0.05 - OUT, S[6].bitis + 0.05)); kayma(k5, clamp(kk), 16);
  // altyazı: plaka HER karede opak; yalnız metin 60 ms ile değişir
  let ch = null; for (const c of CH) if (t >= c.a && t < c.b) ch = c; let pa = 0; if (ch) { const h = tpl(ch); if (ptA.dataset.h !== h) { ptA.innerHTML = h; ptZ.innerHTML = h; ptA.dataset.h = h; } pa = Math.min(eo(t, ch.a, 0.06, (x) => x), 1 - seg(t, ch.b - 0.06, ch.b)); } if (loop) pa = 0;
  ptA.style.opacity = pa.toFixed(3); ptZ.style.opacity = pa.toFixed(3); plA.style.opacity = '1'; plZ.style.opacity = '1';
  return true;
}
window.frame = frame;
window.__bos = (t) => { frame(t); for (const e of document.querySelectorAll('.sahne,.plaka,.etiket')) e.style.opacity = '0'; return true; };
window.hazir = true;
