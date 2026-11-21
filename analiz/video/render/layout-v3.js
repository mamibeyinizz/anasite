// Yerleşim sisteminin TEK kaynağı. Sahne (scene.mjs), DOM (index.html) ve otomatik test (layout_check.mjs) yalnız bunu okur.
// Birim: 1080×1920 tuval pikseli, y aşağı doğru.
export const CANVAS = { W: 1080, H: 1920, FPS: 30, SURE: 28 };

// Güvenli dikdörtgen S (Reels arayüzü: yan 80, üst 270, alt 672). Metin, medya, rozet, çip, logo ve altyazı bunun dışına çıkamaz.
export const S = { x0: 80, x1: 1000, y0: 270, y1: 1248 };
S.w = S.x1 - S.x0; S.h = S.y1 - S.y0;

// Bantlar (y). Bantlar arası en az GAP px boşluk; medya–altyazı arası MEDYA_ALTYAZI_GAP.
export const BAND = {
  baslik: { y0: 330, y1: 560 },
  medya: { y0: 600, y1: 1130 },
  altyazi: { y0: 1140, y1: 1230 },
};
export const GAP = 24;                  // bantlar arası asgari boşluk
export const MEDYA_ALTYAZI_GAP = 24;    // medya ile altyazı plakası arası
export const ROZET_MEDYA_GAP = 16;      // rozet/çip ile medya çerçevesi arası

// Medya kutusu: en çok 780×530; bant 600–1130 içinde ortalı. Altyazıyla boşluk için gerçek yükseklik ≤ 500.
export const MEDYA = { maxW: 780, maxH: 530, cx: (S.x0 + S.x1) / 2 };
MEDYA.cy = 856;                          // telefon (bevel+perspektif dahil) ≈ 603–1109: üstte rozet satırı, altta altyazıyla ≥ 31 px

// Telefon (dikey): genişlik 330–420, tüm sahnelerde AYNI. Ekran penceresi gövde − 2·çerçeve.
export const TELEFON = { w: 400, h: 492, cerceve: 18, kose: 56, ekranKose: 38, bevel: 5, perspektif: 1.01 };
TELEFON.ekranW = TELEFON.w - 2 * TELEFON.cerceve;     // 364
TELEFON.ekranH = TELEFON.h - 2 * TELEFON.cerceve;     // 464
TELEFON.ekranOran = TELEFON.ekranW / TELEFON.ekranH;
TELEFON.zoom = 2.2;                                    // kutu İÇİNDE yakınlaştırma (doku penceresi), gövde boyutu değişmez

// Panel penceresi: 780×500, yuvarlatılmış, içeride dolly (1,6–2×).
export const PANEL = { w: 780, h: 500, kose: 26, cy: 850, zoomKart: 2.0, bazCssGenislik: 870 };

// Rozet + dil çipleri: BAŞLIK–MEDYA arası tek satır, medyaya ≥ 16 px.
export const TELEFON_DIS_YARI = (TELEFON.h + 2 * TELEFON.bevel) / 2 * TELEFON.perspektif;     // ekranda görünen yarım yükseklik
export const ROZET_SATIRI = { h: 52 };
ROZET_SATIRI.y1 = MEDYA.cy - TELEFON_DIS_YARI - ROZET_MEDYA_GAP - 2;                                  // telefon üstünden ≥ 16 px yukarıda
ROZET_SATIRI.y0 = ROZET_SATIRI.y1 - ROZET_SATIRI.h;

// Tipografi (px, 1080 genişlikte). Başlık/altyazı ≥ 40; URL ≥ 44.
export const TIP = { baslikK: 80, baslikM: 68, altyazi: 42, altyaziMin: 40, url: 54, rozet: 40, cip: 40, minMetin: 40, minUrl: 44, ekranMetinMin: 28 };

// Ağırlık merkezi (medya/nesne bloğu) y aralığı
export const AGIRLIK_Y = [640, 960];

// Altyazı plakası: yalnız ALTYAZI bandı, tek satır.
export const ALTYAZI_PLAKA = { x0: S.x0, x1: S.x1, y0: BAND.altyazi.y0, y1: BAND.altyazi.y1 };

// Logo satırı (CTA): S'in içinde, başlık bandının üstünde; başlık bloğu logodan ≥ GAP aşağıda başlar.
export const LOGO = { y0: S.y0 + 4, h: 44 };
LOGO.y1 = LOGO.y0 + LOGO.h;                                                           // 318
export const CTA_BASLIK_Y0 = LOGO.y1 + GAP;                                           // 342

// Yardımcılar
export const kesisim = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
export const icinde = (r, kutu, pay = 0.5) => r.x0 >= kutu.x0 - pay && r.x1 <= kutu.x1 + pay && r.y0 >= kutu.y0 - pay && r.y1 <= kutu.y1 + pay;
export const genislet = (r, p) => ({ x0: r.x0 - p, x1: r.x1 + p, y0: r.y0 - p, y1: r.y1 + p });
export const dunya = (x, y) => ({ x: x - CANVAS.W / 2, y: CANVAS.H / 2 - y });       // piksel → dünya (z=0 düzlemi)
