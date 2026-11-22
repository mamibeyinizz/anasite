// v6 zaman çizelgesi: tüm süreler cue dosyasından (ses/cue.json ya da kısa sürüm için ses/cue-kisa.json) türetilir. Elle zaman yok.
// Başlık parçası cümle başlangıcından 0,08 sn ÖNCE girer, bitişten 0,12 sn SONRA söner. Sahne olayları v4 olaylarının parça içi oranına oturtulur; çıkarılan parçalar (kısa sürüm) için komşu parçalara doğrusal eşlenir.
export const GIRIS_ONCE = 0.08, CIKIS_SONRA = 0.12, VIDEO_SONU_BOSLUK = 0.8;
const A4ID = { c0: 0, c1: 2.65, c2: 4.1, c3: 5.5, c4: 8.0, c5: 10.0, c6: 12.6, c7: 14.8, c8: 17.0, c9: 18.3, c10: 19.5, c11: 20.7, c12: 22.3, c13: 23.5, c14: 24.7, c15: 25.9 };
export function kur(cue) {
  const P = cue.parcalar, N = P.length;
  const V = P.map((p, i) => (i === 0 ? 0 : p.baslangic - GIRIS_ONCE));
  const Ev = P.map((p, i) => { let e = p.bitis + CIKIS_SONRA; if (P[i + 1]) e = Math.min(e, P[i + 1].baslangic - GIRIS_ONCE - 0.02); return e; });
  const SURE = cue.konusmaBitis + VIDEO_SONU_BOSLUK, FPS = 30, KARE = Math.round(SURE * FPS);
  const A4 = [...P.map((p) => A4ID[p.id]), 27.1], A5 = [...V, Ev[N - 1]];
  const W = (t4) => { if (t4 <= 0) return 0; for (let i = 0; i < A4.length - 1; i++) if (t4 < A4[i + 1]) return A5[i] + (t4 - A4[i]) / (A4[i + 1] - A4[i]) * (A5[i + 1] - A5[i]); return A5[N] + (t4 - A4[N]); };
  const ix = (id) => P.findIndex((p) => p.id === id);
  const sunumBasla = ix('c4') >= 0 ? V[ix('c4')] : V[ix('c5')];          // 3B sahne biter, telefon girer
  return { P, V, Ev, SURE, FPS, KARE, W, ix, sunumBasla, kapanis: Ev[N - 1], dongu: Ev[N - 1] + 0.04, kancaGeri: [Ev[N - 1] + 0.08, SURE], ctaKapan: [Ev[N - 1] - 0.3, Ev[N - 1]] };
}
