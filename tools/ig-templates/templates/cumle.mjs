// cumle: tek cümle, koyu yeşil ya da krem zemin, büyük tipografi, küçük figür.
import { kancaMetni, hap, logo, sahneKur } from './lib.mjs';
export async function kur(ctx) {
  const { V, F } = ctx; if (!V.cumle) throw new Error('cumle (2 satır) zorunlu'); if (!V.etiket) throw new Error('etiket (hap) zorunlu');
  const h = hap(ctx, V.etiket, F.hapY, F.hapH, F.hapPx); const k = await kancaMetni(ctx, { y: F.metinY, satirlar: V.cumle, vurgu: V.vurgu, px: F.kancaPx });
  const metinAlt = Math.max(...k.kutular.map((q) => q.y1)); let s = null;
  if (V.figur && V.figur.length) s = await sahneKur(ctx, V.figur, { x0: F.yanMarj + 123, x1: F.w - F.yanMarj - 123, y0: Math.max(F.figurY[0], metinAlt + 70), y1: F.figurY[1], enCokOlcek: 1.9 });
  const l = logo(ctx, F.logoY, F.logoW);
  return { hap: { rect: h.rect, px: h.px, metin: V.etiket }, kanca: { fs: k.fs, ls: k.ls, kutular: k.kutular, kelime: k.kelime, satir: k.satir, vurgu: k.vurgu }, grup: s && s.grup, sprites: s ? s.sprites : [], logo: { rect: l.rect, w: F.logoW, src: l.src } };
}
