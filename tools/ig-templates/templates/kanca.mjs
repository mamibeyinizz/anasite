// kanca: koyu yeşil zemin, 3B figürler, 2 satır büyük soru, hap etiket, logo. v2: ölçek kuralı (grup ≥760 px, başlık–grup ≤120, grup–logo ≥48) şablonda zorlanır.
import { kancaMetni, hap, logo, sahneKur } from './lib.mjs';
export async function kur(ctx) {
  const { V, F, FM } = ctx; if (!V.etiket) throw new Error('etiket (hap) zorunlu'); if (!V.logo) throw new Error('logo zorunlu (true)'); if (!Array.isArray(V.figur) || !V.figur.length) throw new Error('figur listesi zorunlu');
  const h = hap(ctx, V.etiket, F.hapY, F.hapH, F.hapPx); const k = await kancaMetni(ctx, { y: F.metinY, satirlar: V.kanca, vurgu: V.vurgu, px: FM.kancaPx });
  const metinAlt = Math.max(...k.kutular.map((q) => q.y1)); const y0 = metinAlt + F.grupUstBosluk, y1 = F.logoY - F.grupAltBoslukLogo;
  const kutu = { x0: F.yanMarj + 3, x1: F.w - F.yanMarj - 3, y0, y1, enCokOlcek: 2.2, ustHizala: true }; let yay = 1;       // şablon figür aralığını açarak ölçeği büyütür (grup ≥760 px)
  if (V.format === 'reels') { for (const y of [1, 1.3, 1.6, 2.0, 2.5]) { yay = y; const d = await sahneKur(ctx, V.figur, { ...kutu, yayilim: y, dry: true }); if (d.grup.w >= F.grupGenislikMin + 2) break; } }
  const s = await sahneKur(ctx, V.figur, { ...kutu, yayilim: yay });
  if (FM.w === 1080 && V.format === 'reels' && s.grup.w < F.grupGenislikMin) throw new Error(`figür grubu çok dar: ${Math.round(s.grup.w)} px < ${F.grupGenislikMin} px (şablon ölçeği büyütemedi: figür listesini genişlet)`);
  const gap = s.grup.y0 - metinAlt; if (gap > F.baslikGrupBoslukMax) throw new Error(`başlık–grup boşluğu ${Math.round(gap)} px > ${F.baslikGrupBoslukMax}`);
  const logoY = Math.min(F.logoY, Math.round(s.grup.y1 + F.grupAltBoslukLogo)); const l = logo(ctx, logoY, F.logoW);
  return { hap: { rect: h.rect, px: h.px, metin: V.etiket }, kanca: { fs: k.fs, ls: k.ls, kutular: k.kutular, kelime: k.kelime, satir: k.satir, vurgu: k.vurgu }, grup: s.grup, figurGrup: s.figurGrup, yildizlar: s.yildizlar, sprites: s.sprites, logo: { rect: l.rect, w: F.logoW, src: l.src } };
}
