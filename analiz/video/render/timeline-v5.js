// v5 zaman çizelgesi: tüm süreler ses/cue.json'dan (anlatım sesinin ölçülmüş konuşma parçaları) türetilir. Elle zaman yok.
// Başlık parçası, cümle başlangıcından 0,08 sn ÖNCE girer; bitişten 0,12 sn SONRA söner (sonraki parça için kısalır). Sahne olayları v4 olaylarının parça içi oranına oturtulur.
export const GIRIS_ONCE = 0.08, CIKIS_SONRA = 0.12, VIDEO_SONU_BOSLUK = 0.8;
export function kur(cue) {
  const P = cue.parcalar, N = P.length;                                   // 16 parça
  const V = P.map((p, i) => (i === 0 ? 0 : p.baslangic - GIRIS_ONCE));    // görünür başlangıç (kanca t=0'dan)
  const Ev = P.map((p, i) => { let e = p.bitis + CIKIS_SONRA; if (P[i + 1]) e = Math.min(e, P[i + 1].baslangic - GIRIS_ONCE - 0.02); return e; });
  const SURE = cue.konusmaBitis + VIDEO_SONU_BOSLUK, FPS = 30, KARE = Math.round(SURE * FPS);
  // v4 parça başlangıçları → v5 (parça içi oransal eşleme; olay ZAMANLARI taşınır, geçiş SÜRELERİ aynı kalır)
  const A4 = [0, 2.65, 4.1, 5.5, 8.0, 10.0, 12.6, 14.8, 17.0, 18.3, 19.5, 20.7, 22.3, 23.5, 24.7, 25.9, 27.1];
  const A5 = [...V, Ev[N - 1]];
  const W = (t4) => { if (t4 <= 0) return 0; for (let i = 0; i < A4.length - 1; i++) if (t4 < A4[i + 1]) return A5[i] + (t4 - A4[i]) / (A4[i + 1] - A4[i]) * (A5[i + 1] - A5[i]); return A5[N] + (t4 - A4[N]); };
  return { P, V, Ev, SURE, FPS, KARE, W, kapanis: Ev[N - 1], dongu: Ev[N - 1] + 0.04, kancaGeri: [Ev[N - 1] + 0.08, SURE], ctaKapan: [Ev[N - 1] - 0.3, Ev[N - 1]] };
}
