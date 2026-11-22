// cumle v2: (a) tipografi odaklı — büyük cümle + ince altın çizgi ornamenti + logo, figür yok; (b) prop'lu — cümleye bağlı kanıt öğesi (tablet sprite + gerçek ekran kırpığı). Koyu ve krem zemin.
import { mk, rect, kancaMetni, hap, logo, ekranYukle } from './lib.mjs';
export async function kur(ctx) {
  const { T, V, F, FM, root } = ctx; if (!V.cumle) throw new Error('cumle (2 satır) zorunlu'); if (!V.etiket) throw new Error('etiket (hap) zorunlu'); const varyant = V.varyant || 'tipografi';
  if (!['tipografi', 'prop'].includes(varyant)) throw new Error('varyant tipografi|prop olmalı');
  const h = hap(ctx, V.etiket, F.hapY, F.hapH, F.hapPx); const k0 = await kancaMetni(ctx, { y: 0, satirlar: V.cumle, vurgu: V.vurgu, px: F.kancaPx }); const Ht = k0.kutular[1].y1 - k0.kutular[0].y0; k0.el.remove();
  let metinY, ornY, ek = {}, propAlt = null;
  if (varyant === 'tipografi') { const blok = Ht + 56 + 20; metinY = Math.round(F.h * F.orta - blok / 2); ornY = metinY + Ht + 56; }
  else { metinY = F.metinY; ornY = null; }
  const k = await kancaMetni(ctx, { y: metinY, satirlar: V.cumle, vurgu: V.vurgu, px: F.kancaPx }); const metinAlt = Math.max(...k.kutular.map((q) => q.y1));
  let orn = null; if (ornY !== null) { const w = F.ornamentGenislik; orn = mk('div', 'orn', { left: (F.w / 2 - w / 2) + 'px', top: ornY + 'px', width: w + 'px' }, root); mk('i', '', null, orn); ek.ornament = rect(orn); }
  if (varyant === 'prop') {
    const p = V.prop || {}; if (p.tur !== 'tablet') throw new Error('prop.tur şimdilik tablet'); const KR = T.ekranKirpik[p.kirpik]; if (!KR) throw new Error('bilinmeyen prop.kirpik: ' + p.kirpik);
    const M = await (await fetch(`/figur/${T.sprite}/manifest.json`)).json(); const tm = M.tablet; const E = await ekranYukle('/' + KR.ekran.replace(/^analiz\/video\//, ''));
    const top = metinAlt + 64, bot = F.logoY - 56, sc = Math.min((bot - top) / tm.yukseklik, F.tabletYuksek / tm.yukseklik); const tw = tm.genislik * sc, th = tm.yukseklik * sc; const tx = F.w / 2 - tw / 2, ty = top + ((bot - top) - th) / 2;
    const ew = (tm.ekran.boyut[0] + 4) * sc, eh = (tm.ekran.boyut[1] + 4) * sc, ex = tx + tm.ekran.merkez[0] * sc - ew / 2, ey = ty + tm.ekran.merkez[1] * sc - eh / 2;
    const cropH = KR.y1 - KR.y0, cropW = cropH * ew / eh, kk = eh / cropH; const sd = mk('div', 'tabletekran', { left: ex + 'px', top: ey + 'px', width: ew + 'px', height: eh + 'px', zIndex: 1, borderRadius: (24 * sc) + 'px' }, root);
    const im = mk('img', '', { left: (-KR.x0 * kk) + 'px', top: (-KR.y0 * kk) + 'px', width: (E.w * kk) + 'px', height: (E.h * kk) + 'px' }, sd); im.src = '/' + KR.ekran.replace(/^analiz\/video\//, '');
    const tb = mk('img', 'sprite', { left: tx + 'px', top: ty + 'px', width: tw + 'px', height: th + 'px', zIndex: 2 }, root); tb.src = '/' + tm.dosya; await Promise.all([im.decode(), tb.decode()]);
    ek.ekran = { src: KR.ekran, hash: E.hash, bayt: E.bayt, w: E.w, h: E.h, satirlar: [], kirpik: { x0: KR.x0, y0: KR.y0, x1: KR.x0 + cropW, y1: KR.y1 } }; ek.tablet = { rect: rect(tb) }; ek.ekranMetinPx = +(26.4 * kk).toFixed(1); propAlt = rect(tb).y1;
  }
  const l = logo(ctx, F.logoY, F.logoW);
  return { hap: { rect: h.rect, px: h.px, metin: V.etiket }, kanca: { fs: k.fs, ls: k.ls, kutular: k.kutular, kelime: k.kelime, satir: k.satir, vurgu: k.vurgu }, varyant, sprites: [], logo: { rect: l.rect, w: F.logoW, src: l.src }, ...ek, propAlt };
}
