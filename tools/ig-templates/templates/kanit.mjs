// kanit: krem zemin, koyu yeşil metin, #7F6419 vurgu; gerçek ekran görüntüsü telefon çerçevesinde (kırpma yalnız pencere) + büyüteç kartı + "Gerçek demo menü" rozeti.
import { mk, rect, kancaMetni, hap, logo, ekranYukle, satirlariBul } from './lib.mjs';
export async function kur(ctx) {
  const { T, V, F, FM, root } = ctx; if (!V.ekran) throw new Error('ekran zorunlu'); if (!V.etiket) throw new Error('etiket (hap) zorunlu'); if (!V.rozet) throw new Error('rozet zorunlu ("Gerçek demo menü")');
  const h = hap(ctx, V.etiket, F.hapY, F.hapH, F.hapPx); const k = await kancaMetni(ctx, { y: F.metinY, satirlar: V.kanca, vurgu: V.vurgu, px: FM.kancaPx });
  const E = await ekranYukle('/' + V.ekran.replace(/^\//, '').replace(/^analiz\/video\//, '')); if (E.w !== 860 || E.h !== 1800) throw new Error(`ekran 860×1800 olmalı (gelen ${E.w}×${E.h})`);
  const rows = satirlariBul(E); const n = (V.lens && V.lens.satir) || 0; if (rows.length < n + 2) throw new Error(`ekranda ${n + 2} ürün satırı bulunamadı (bulunan ${rows.length})`);
  const LS = T.lens.s, LW = T.lens.w, LH = T.lens.satirH, EP = T.telefon.ekranPencere, TP = T.telefon; const hTex = LH / LS;
  const lo = rows[n + 1][1] + 2 - hTex; const hi = Math.min(rows[n + 2] ? rows[n + 2][0] - 3 - hTex : 1e9, rows[n][0] - 3); if (lo > hi) throw new Error('lens penceresi satırları kesmeden sığmıyor');
  const wy0 = (lo + hi) / 2; let xmin = 1e9, xmax = -1e9; for (const r of [rows[n], rows[n + 1]]) for (let y = r[0]; y < r[1]; y++) for (let x = 262; x < 815; x++) if (E.L(x, y) > 70) { xmin = Math.min(xmin, x); xmax = Math.max(xmax, x); }
  const wx0 = Math.min(262, xmin - 8), wx1 = wx0 + LW / LS; if (xmax > wx1 - 1) throw new Error('ekran satır metni büyüteç penceresine sığmıyor');
  // telefon: gerçek oran, ekran görüntüsü kırpılmadan (yalnız alt çubuk penceresi dışında)
  const ekH = TP.yukseklik - 2 * TP.cerceve - 2 * TP.bevel, ps = ekH / (EP.y1 - EP.y0), ekW = (EP.x1 - EP.x0) * ps; const bw = ekW + 2 * TP.cerceve, bh = ekH + 2 * TP.cerceve;
  const px0 = F.yanMarj + TP.bevel, py0 = F.telefonY + TP.bevel; const tel = mk('div', 'telefon', { left: px0 + 'px', top: py0 + 'px', width: bw + 'px', height: bh + 'px', borderRadius: TP.kose + 'px' }, root);
  const ekr = mk('div', 'ekran', { left: TP.cerceve + 'px', top: TP.cerceve + 'px', width: ekW + 'px', height: ekH + 'px', borderRadius: '36px' }, tel); const im = mk('img', '', { left: (-EP.x0 * ps) + 'px', top: (-EP.y0 * ps) + 'px', width: (E.w * ps) + 'px', height: (E.h * ps) + 'px' }, ekr); im.src = '/' + V.ekran.replace(/^\//, '').replace(/^analiz\/video\//, '');
  // satır vurgusu telefonda
  const fr = mk('div', 'cerceve', { left: (TP.cerceve + (36 - EP.x0) * ps) + 'px', top: (TP.cerceve + (rows[n][0] - 4 - EP.y0) * ps) + 'px', width: ((822 - 36) * ps) + 'px', height: ((rows[n + 1][1] + 4 - rows[n][0] + 4) * ps) + 'px' }, tel);
  // büyüteç
  const lx0 = Math.round(px0 + bw + 24), lw = F.w - F.yanMarj - lx0; if (lw < LW - 1) throw new Error(`büyüteç sütunu dar (${lw}<${LW})`); const ly0 = F.telefonY + 52 + 24;
  const rz = mk('div', 'rozet', { left: lx0 + 'px', top: F.telefonY + 'px', height: '52px' }, root, `<b>${V.rozet.split(' ')[0]}</b>${V.rozet.split(' ').slice(1).join(' ')}`);
  const ln = mk('div', 'lens', { left: lx0 + 'px', top: ly0 + 'px', width: LW + 'px', height: LH + 'px', borderRadius: T.lens.kose + 'px' }, root); const li = mk('img', '', { left: (-wx0 * LS) + 'px', top: (-wy0 * LS) + 'px', width: (E.w * LS) + 'px', height: (E.h * LS) + 'px' }, ln); li.src = im.src; mk('div', 'rim', null, ln);
  // bağlantı çizgisi (telefon satır vurgusundan karta)
  const a = { x: px0 + TP.cerceve + (822 - EP.x0) * ps + 2, y: py0 + TP.cerceve + ((rows[n][0] + rows[n + 1][1]) / 2 - EP.y0) * ps }, b = { x: lx0, y: ly0 + LH / 2 }; const len = Math.hypot(b.x - a.x, b.y - a.y);
  mk('div', 'hat', { left: a.x + 'px', top: a.y + 'px', width: len + 'px', transform: `rotate(${Math.atan2(b.y - a.y, b.x - a.x)}rad)` }, root);
  // dil çipleri (gerçek ekran dili etkin)
  const dil = ((V.lens && V.lens.dil) || 'EN').toUpperCase(); const chipler = ['TR', 'EN', 'DE', 'FR']; let cx = lx0; const chipY = ly0 + LH + 24;
  for (const c of chipler) { const e = mk('div', 'chip' + (c === dil ? ' on' : ''), { left: cx + 'px', top: chipY + 'px', height: '52px' }, root, c); cx += e.getBoundingClientRect().width + 12; }
  await Promise.all([im.decode(), li.decode()]); const lg = logo(ctx, F.logoY, F.logoW);
  return { hap: { rect: h.rect, px: h.px, metin: V.etiket }, kanca: { fs: k.fs, ls: k.ls, kutular: k.kutular, kelime: k.kelime, satir: k.satir, vurgu: k.vurgu }, logo: { rect: lg.rect, w: F.logoW, src: lg.src }, rozet: { rect: rect(rz), metin: V.rozet, px: 40 },
    telefon: { rect: rect(tel), oran: bw / bh }, lens: { rect: rect(ln), olcek: LS, pencere: { x0: wx0, y0: wy0, x1: wx1, y1: wy0 + hTex }, ekranMetinPx: +(26.4 * LS).toFixed(1) }, ekran: { src: V.ekran, hash: E.hash, bayt: E.bayt, w: E.w, h: E.h, satirlar: rows } };
}
