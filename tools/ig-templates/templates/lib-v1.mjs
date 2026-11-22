// Ortak yardımcılar: DOM, kanca metni sığdırma (hata verir, taşırmaz), hap, logo, sprite sahnesi, ekran satırı tespiti.
export const mk = (tag, cls, st, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (st) Object.assign(e.style, st); if (html !== undefined) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
export const rect = (e) => { const r = e.getBoundingClientRect(); return { x0: r.left, x1: r.right, y0: r.top, y1: r.bottom }; };
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export async function kancaMetni(ctx, { y, satirlar, vurgu, px }) {
  const { T, F, root, zemin } = ctx; const W = F.w - 2 * F.yanMarj; const FT = T.font;
  if (!Array.isArray(satirlar) || satirlar.length !== T.limitler.satir) throw new Error(`kanca ${T.limitler.satir} satır olmalı (gelen: ${satirlar && satirlar.length})`);
  const kelimeler = satirlar.join(' ').split(/\s+/).filter(Boolean); if (kelimeler.length > T.limitler.kancaKelimeEnCok) throw new Error(`kanca en fazla ${T.limitler.kancaKelimeEnCok} kelime (gelen: ${kelimeler.length})`);
  const tum = satirlar.join('\n'); const say = vurgu ? tum.split(vurgu).length - 1 : 0; if (!vurgu || say !== 1) throw new Error(`vurgu kelimesi metinde tam bir kez geçmeli: "${vurgu}" (${say} kez)`);
  const kutu = mk('div', 'kanca', { top: y + 'px' }, root); const sat = satirlar.map((s) => { const i = s.indexOf(vurgu); const h = i < 0 ? esc(s) : esc(s.slice(0, i)) + '<span class="v">' + esc(vurgu) + '</span>' + esc(s.slice(i + vurgu.length)); return mk('span', 'satir', null, kutu, h); });
  const cv = document.createElement('canvas').getContext('2d');                          // mürekkep genişliği (yan boşluklar hariç): actualBoundingBox
  const olc = () => Math.max(...satirlar.map((t) => { const f = parseFloat(kutu.style.fontSize), l = parseFloat(kutu.style.letterSpacing); cv.font = `800 ${f}px Manrope`; cv.letterSpacing = (l * f) + 'px'; const m = cv.measureText(t); return m.actualBoundingBoxLeft + m.actualBoundingBoxRight; }));
  const [mn, mx] = px; let fs = mx, ls = FT.harfAraligi, ok = false;
  for (fs = mx; fs >= mn; fs -= 2) { kutu.style.fontSize = fs + 'px'; kutu.style.letterSpacing = ls + 'em'; if (olc() <= W - 4) { ok = true; break; } }
  if (!ok) { fs = mn; for (ls = FT.harfAraligi - 0.002; ls >= FT.harfAraligiEnAz - 1e-9; ls -= 0.002) { kutu.style.fontSize = fs + 'px'; kutu.style.letterSpacing = ls + 'em'; if (olc() <= W - 4) { ok = true; break; } } }
  if (!ok) throw new Error(`metin çok uzun: en küçük boyda (${mn}px, harf aralığı ${FT.harfAraligiEnAz}em) ${W}px'e sığmıyor: "${satirlar.join(' / ')}"`);
  satirlar.forEach((t, i) => { const f = parseFloat(kutu.style.fontSize), l = parseFloat(kutu.style.letterSpacing); cv.font = `800 ${f}px Manrope`; cv.letterSpacing = (l * f) + 'px'; const m = cv.measureText(t);   // mürekkebi satır ortasına al (harf aralığı/yan boşluk kayması)
    const delta = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2 - m.width / 2; sat[i].style.transform = `translateX(${(-delta).toFixed(2)}px)`; });
  const kutular = sat.map((s, i) => { const r = document.createRange(); r.selectNodeContents(s); const q = r.getBoundingClientRect(); return { x0: q.left, x1: q.right, y0: s.getBoundingClientRect().top, y1: s.getBoundingClientRect().bottom, metin: satirlar[i] }; });
  return { el: kutu, fs, ls: +ls.toFixed(3), kutular, kelime: kelimeler.length, satir: satirlar.length, vurgu };
}

export function hap(ctx, metin, y, h, px) {
  const { F, root } = ctx; const e = mk('div', 'hap', { top: y + 'px', height: h + 'px', fontSize: px + 'px' }, root, esc(metin.toLocaleUpperCase('tr')));
  const w = e.getBoundingClientRect().width; e.style.left = (F.w / 2 - w / 2) + 'px'; return { el: e, rect: rect(e), px };
}
export function logo(ctx, y, w) {
  const { F, root, zemin } = ctx; const src = zemin === 'krem' ? '/brand/qr-menu-official-logo-v4-dark.svg' : '/brand/qr-menu-official-logo-v4.svg';
  const e = mk('img', 'logo', { left: (F.w / 2 - w / 2) + 'px', top: y + 'px', width: w + 'px' }, root); e.src = src; return { el: e, rect: rect(e), src, w };
}

export async function sahneKur(ctx, liste, kutu) {
  const { root } = ctx; const M = await (await fetch('/figur/manifest.json')).json(); const ad = (s) => s.replace(':', '-');
  const g = (n) => { const m = M[ad(n)]; if (!m) throw new Error('bilinmeyen figür/sprite: ' + n); return m; }; const tur = (s) => s.split(':')[0];
  const gars = liste.filter((s) => tur(s) === 'garson'), misa = liste.filter((s) => tur(s) === 'misafir'), masa = liste.includes('masa');
  const it = []; const put = (n, x0, y0, sc = 1, z = 2, ekstra = {}) => { const m = g(n); const o = { n, m, x0, y0, w: m.genislik * sc, h: m.yukseklik * sc, sc, z, ...ekstra }; it.push(o); return o; };
  let tw = 0, th = 0, surf = 0; if (masa) { const m = g('masa'); tw = m.genislik; th = m.yukseklik; put('masa', -tw / 2, -th, 1, 1); surf = -th + 0.24 * th; }
  let G = null, Mi = null;
  if (gars[0]) { const m = g(gars[0]); const sc = 1; G = put(gars[0], -(tw / 2 + m.genislik * 0.45) , -m.yukseklik * sc, sc, 2); }
  if (misa[0]) { const m = g(misa[0]); Mi = put(misa[0], tw / 2 - m.genislik * 0.05 + 0, -m.yukseklik, 1, 2); }
  for (const n of liste) { const t = tur(n);
    if (n === 'menuKarti') { const m = g(n); if (Mi && Mi.m.anchors.el) { const hx = Mi.x0 + Mi.m.anchors.el[0], hy = Mi.y0 + Mi.m.anchors.el[1]; put(n, hx - m.genislik * 0.5, hy - m.yukseklik * 0.5 - 4, 1, 3); } else put(n, -m.genislik / 2, surf - m.yukseklik * 0.55, 1, 3); }
    else if (n === 'balon:ucNokta') { const m = g(n); const sc = 1.1, bw = m.genislik * sc, bh = m.yukseklik * sc; if (G) put(n, G.x0 + G.w * 0.5 - bw * 0.26, G.y0 - bh - 8, sc, 5); else put(n, -tw * 0.3 - bw * 0.26, (surf - bh - 60), sc, 5); }
    else if (n === 'balon:soru') { const m = g(n); const sc = 1.35, bw = m.genislik * sc, bh = m.yukseklik * sc; if (Mi) put(n, Mi.x0 + Mi.w * 0.5 - bw * 0.74, Mi.y0 - bh - 8, sc, 5); else put(n, tw * 0.3 - bw * 0.74, (surf - bh - 60), sc, 5); }
    else if (n === 'zil') { const m = g(n), sc = 0.6; put(n, -tw * 0.18 - m.genislik * sc / 2, surf + 0.07 * th - m.yukseklik * sc, sc, 3); }
    else if (n === 'qrTabela') { const m = g(n), sc = 0.7; put(n, tw * 0.16 - m.genislik * sc / 2, surf + 0.09 * th - m.yukseklik * sc, sc, 3); }
    else if (n === 'tablet') { const m = g(n), sc = 0.7; put(n, -m.genislik * sc / 2, -m.yukseklik * sc, sc, 1); } }
  const ust = () => Math.min(...it.map((o) => o.y0));
  const sayac = {}; for (const n of liste) if (n === 'yildiz' || n === 'saat') { const m = g(n), sc = n === 'yildiz' ? 0.42 : 0.55; const k = (sayac[n] = (sayac[n] || 0) + 1);
    if (n === 'yildiz') { const adet = liste.filter((q) => q === 'yildiz').length; const gap = m.genislik * sc * 1.08; put(n, (k - 1 - (adet - 1) / 2) * gap - m.genislik * sc / 2, ust() - m.yukseklik * sc - 18, sc, 3); } else put(n, -m.genislik * sc / 2, ust() - m.yukseklik * sc - 24, sc, 3); }
  const ux0 = Math.min(...it.map((o) => o.x0)), ux1 = Math.max(...it.map((o) => o.x0 + o.w)), uy0 = Math.min(...it.map((o) => o.y0)), uy1 = Math.max(...it.map((o) => o.y0 + o.h)); const uw = ux1 - ux0, uh = uy1 - uy0;
  const bw = kutu.x1 - kutu.x0, bh = kutu.y1 - kutu.y0; const s = Math.min(bw / uw, bh / uh, kutu.enCokOlcek || 1.7); const ox = kutu.x0 + (bw - uw * s) / 2, oy = kutu.y0 + (bh - uh * s) / 2;
  const sp = []; for (const o of it.sort((a, b) => a.z - b.z)) { const e = mk('img', 'sprite', { left: (ox + (o.x0 - ux0) * s) + 'px', top: (oy + (o.y0 - uy0) * s) + 'px', width: (o.w * s) + 'px', height: (o.h * s) + 'px', zIndex: o.z }, root); e.src = '/' + o.m.dosya; sp.push({ ad: o.n, el: e }); }
  await Promise.all(sp.map(({ el }) => el.decode()));
  return { olcek: s, grup: { x0: ox, x1: ox + uw * s, y0: oy, y1: oy + uh * s, w: uw * s, h: uh * s }, sprites: sp.map(({ ad, el }) => ({ ad, rect: rect(el) })) };
}

// Gerçek ekran görüntüsünde ürün satırlarını bul (resim değiştirilmez; yalnız okunur). 860×1800 telefon ekranı.
export async function ekranYukle(src) {
  const buf = await (await fetch(src)).arrayBuffer(); const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', buf))).map((b) => b.toString(16).padStart(2, '0')).join('');
  const bmp = await createImageBitmap(new Blob([buf])); const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height; const cx = c.getContext('2d'); cx.drawImage(bmp, 0, 0); const d = cx.getImageData(0, 0, c.width, c.height).data;
  const L = (x, y) => { const i = (y * c.width + x) * 4; return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; };
  return { hash, w: c.width, h: c.height, L, bayt: buf.byteLength };
}
export function satirlariBul(E) {
  const rows = []; let s0 = null;
  for (let y = 0; y < E.h; y++) { let a = 0, b = 0; for (let x = 812; x < 822; x++) a += E.L(x, y); for (let x = 840; x < 855; x++) b += E.L(x, y); const dk = a / 10 - b / 15 > 4;
    if (dk && s0 === null) s0 = y; if (!dk && s0 !== null) { if (y - s0 > 150 && s0 > 800) rows.push([s0, y]); s0 = null; } }
  return rows;
}
