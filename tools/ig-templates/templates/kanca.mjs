// kanca: koyu yeşil zemin, 3B figürler, 2 satır büyük soru, hap etiket, logo. Reels kapağı (ve post34 kanca).
import { kancaMetni, hap, logo, sahneKur } from './lib.mjs';
export async function kur(ctx) {
  const { V, F, FM } = ctx; if (!V.etiket) throw new Error('etiket (hap) zorunlu'); if (!V.logo) throw new Error('logo zorunlu (true)'); if (!Array.isArray(V.figur) || !V.figur.length) throw new Error('figur listesi zorunlu');
  const h = hap(ctx, V.etiket, F.hapY, F.hapH, F.hapPx); const k = await kancaMetni(ctx, { y: F.metinY, satirlar: V.kanca, vurgu: V.vurgu, px: FM.kancaPx });
  const s = await sahneKur(ctx, V.figur, { x0: F.yanMarj + 3, x1: F.w - F.yanMarj - 3, y0: F.grupY[0], y1: F.grupY[1], enCokOlcek: 1.7 }); const l = logo(ctx, F.logoY, F.logoW);
  return { hap: { rect: h.rect, px: h.px, metin: V.etiket }, kanca: { fs: k.fs, ls: k.ls, kutular: k.kutular, kelime: k.kelime, satir: k.satir, vurgu: k.vurgu }, grup: s.grup, sprites: s.sprites, logo: { rect: l.rect, w: F.logoW, src: l.src } };
}
