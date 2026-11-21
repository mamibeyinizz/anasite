// v5 yerleşim (v4 + alt çubuk kırpımı, panel başlık şeridi, dar dil seçici büyüteci, ok yok) sisteminin TEK kaynağı. Sahne (scene.mjs), DOM (index.html), doku hazırlığı (tex-hazirla.py) ve otomatik test (layout_check.mjs) yalnız bunu okur.
// Birim: 1080×1920 tuval pikseli, y aşağı doğru. v3'teki "medya ≤780×530" ve "telefon 330–420 px genişlik" sınırları KALDIRILDI.
export const CANVAS = { W: 1080, H: 1920, FPS: 30, SURE: 28 };

// Güvenli dikdörtgen S (değişmez).
export const S = { x0: 80, x1: 1000, y0: 270, y1: 1248 };
S.w = S.x1 - S.x0; S.h = S.y1 - S.y0;

// Bantlar: BAŞLIK tek metin katmanı (altyazı plakası yok), MEDYA 670 px.
export const BAND = { baslik: { y0: 330, y1: 540 }, medya: { y0: 570, y1: 1240 } };
export const GAP = 24;                  // metin ↔ medya asgari boşluk
export const ROZET_MEDYA_GAP = 16;
export const MEDYA = { cx: (S.x0 + S.x1) / 2, cy: (BAND.medya.y0 + BAND.medya.y1) / 2, w: S.w, h: BAND.medya.y1 - BAND.medya.y0 };   // cy = 905

// Gerçek telefon: tam ekran görüntüsü (860×1800, kırpılmadan). Dış kutu ≈ 308×620, oran ≈ 0,496.
export const EKRAN_TEX = { w: 860, h: 1800 };
export const EKRAN_PENCERE = { x0: 14, y0: 0, x1: 830, y1: 1708 };            // alt çubuk (y ≥ 1712) kırpılır; oran 816:1708 = 0,478 → dış kutu 0,496
EKRAN_PENCERE.w = EKRAN_PENCERE.x1 - EKRAN_PENCERE.x0; EKRAN_PENCERE.h = EKRAN_PENCERE.y1 - EKRAN_PENCERE.y0;
export const TELEFON = { ekranH: 598, cerceve: 8, kose: 44, ekranKose: 36, bevel: 3, cy: MEDYA.cy };
TELEFON.ekranW = +(TELEFON.ekranH * EKRAN_PENCERE.w / EKRAN_PENCERE.h).toFixed(2);        // 285.7
TELEFON.w = TELEFON.ekranW + 2 * TELEFON.cerceve; TELEFON.h = TELEFON.ekranH + 2 * TELEFON.cerceve;
TELEFON.dis = { w: TELEFON.w + 2 * TELEFON.bevel, h: TELEFON.h + 2 * TELEFON.bevel };   // ≈ 317 × 640
TELEFON.cxSol = 238;                    // telefon solda: x ≈ 81–394
TELEFON.cxOrta = MEDYA.cx;
TELEFON.oranAralik = [0.42, 0.50];
TELEFON.ekranOlcek = TELEFON.ekranH / EKRAN_PENCERE.h;                              // ekran px / doku px (≈0,350)

// Büyüteç (lens): telefonun sağında, doku penceresi = gerçek ekranın büyütülmüş hâli. Ölçek ≥ 1,06 → ekran içi metin ≥ 28 px.
export const LENS = { x0: 419, x1: 1000, s: 1.075 };
LENS.w = LENS.x1 - LENS.x0;
LENS.texW = LENS.w / LENS.s;            // doku piksel genişliği (≈538)
LENS.kose = 28;
LENS.rozetH = 52;                       // rozet / çip satırı yüksekliği
LENS.satirH = 470;                      // ürün satırları penceresi (2 satır) yüksekliği
LENS.ddW = 366;                         // dil seçici büyüteci dar: yalnız liste (x 4–344), arkadaki kategori metni dışarıda
LENS.ddH = 657;                         // dil seçici (7 öğe) + son satırdan alt kenara ≥ 16 px
LENS.ctaH = 365;                        // CTA: 4 öğe (TR EN DE FR)
LENS.ustY = 585;                        // sağ sütun üst kenarı (telefon üstü 585)
LENS.satirY0 = LENS.ustY + LENS.rozetH + GAP;           // 661
LENS.chipY0 = LENS.satirY0 + LENS.satirH + GAP;         // 1150
LENS.ddY0 = 576;                                        // 576 – 1233
LENS.logoH = 71; LENS.logoW = 240;                      // logo ≥220 (ok kaldırıldı)
LENS.ctaLogoY0 = LENS.ustY;                             // 585 – 656
LENS.ctaY0 = LENS.ctaLogoY0 + LENS.logoH + GAP;         // 680 – 1045
LENS.urlY0 = LENS.ctaY0 + LENS.ctaH + GAP;              // 1069
LENS.ekranMetinMin = 28;

// Panel: ince başlık şeridi (ekran görüntüsündeki "Diller & Çeviriler") + 920×560 pencere; toplam 666 px, MEDYA bandına sığar.
export const PANEL = { w: 920, h: 560, kose: 26, cssPencereW: 340 };
PANEL.s = PANEL.w / PANEL.cssPencereW;                  // 2,706 px/css
PANEL.cssPencereH = PANEL.h / PANEL.s;                  // 206,9
PANEL.cssY0 = 204;                                      // banner (≤195) dışarıda, kartlar 217–401 içeride
PANEL.cssSol = 268; PANEL.cssSag = 600;                 // sol: Diller/CSV Dışa; sağ: Kapsam/CSV İçe
PANEL.serit = { h: 90, cssX0: 268, cssX1: 540, cssY0: 8, cssY1: 66 };
PANEL.serit.s = PANEL.serit.h / (PANEL.serit.cssY1 - PANEL.serit.cssY0);          // 1,55 px/css
PANEL.serit.w = Math.round((PANEL.serit.cssX1 - PANEL.serit.cssX0) * PANEL.serit.s);   // 422
PANEL.serit.y0 = 572; PANEL.serit.x0 = S.x0; PANEL.serit.kose = 20;
PANEL.y0 = PANEL.serit.y0 + PANEL.serit.h + 16;         // 678
PANEL.cy = PANEL.y0 + PANEL.h / 2;                      // 958
PANEL.ekranMetinMin = 28;

// Kapak (1080×1920): kritik içerik 3:4 (y 240–1680) ve 1:1 (y 420–1500) kırpımında kesilmez
export const KAPAK = { baslikY: [570, 800], pilY: 470, grupY: [860, 1420], logoY: 1560, logoW: 220, kirpim34: [240, 1680], kirpim11: [420, 1500], kenarPay: 40 };

// Tipografi (px)
export const TIP = { baslikMax: 80, baslikMin: 56, baslikSatir: 2, url: 54, rozet: 40, cip: 40, minMetin: 40, minUrl: 54, ekranMetinMin: 28 };

// Ağırlık merkezi (medya bloğu) y aralığı
export const AGIRLIK_Y = [640, 1000];

// Doluluk eşikleri
export const DOLULUK = { anaNesneMin: 560, grup3dMinW: 640, grup3dMinH: 0.70 * (BAND.medya.y1 - BAND.medya.y0) };

// Sağ sütun (CTA) logo/ok/URL
export const CTA = { logoX0: LENS.x0, urlSatir: 2 };

// Yardımcılar
export const kesisim = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
export const icinde = (r, kutu, pay = 0.5) => r.x0 >= kutu.x0 - pay && r.x1 <= kutu.x1 + pay && r.y0 >= kutu.y0 - pay && r.y1 <= kutu.y1 + pay;
export const genislet = (r, p) => ({ x0: r.x0 - p, x1: r.x1 + p, y0: r.y0 - p, y1: r.y1 + p });
export const dunya = (x, y) => ({ x: x - CANVAS.W / 2, y: CANVAS.H / 2 - y });       // piksel → dünya (z=0 düzlemi)
