# Çoklu Dil Reels v5 — rapor

> **Telaffuz kontrolü kullanıcıda.** Sesi dinleyemiyorum; "QR", "CSV" ve diğer okunuşlar benim tarafımdan doğrulanmadı. Altyazıda yalnız `ses-metni.md` düz metni var.

Çıktılar: `out/coklu-dil-reels_v5.mp4`, `kapak/coklu-dil-kapak.png|jpg`, `kapak/onizleme.jpg`, `out/layout.json`, `ses/cue.json`. v1–v4 korundu (v4 kaynakları `*-v4.*`).

## Ölçümler
- ffprobe: 1080x1920, 30/1 fps, 35.767 sn (hedef konuşma bitişi 34.954 + 0,8 = 35.754; fark +0.013), bt709, video 6.53 Mbps, ses aac 48000 Hz 2 kanal.
- Ses: -14.1 LUFS, tepe -1.3 dBTP, 1 sn üstü sessizlik 0. Bed konuşma altında -26.4 dB (ducking dahil).
- Ses analizi: 16 konuşma parçası (silencedetect n=-38dB d=0.18, <30 ms sıçramalar birleştirilerek) = 16 başlık parçası; 14 cümle ile eşleşti. En uzun duraklama 0.402 sn (<0,45 sn) → **sıkıştırma/kırpma yapılmadı**, konuşma hızı değişmedi.
- Yerleşim testi (716 örnek, 0,05 sn): **ihlal 0**. Telefon oranı [0.496, 0.5], ekran içi metin ≈28.4 px, en uzun metinsiz süre 0.35 sn, en düşük kontrast 6.1:1, pencerede kesilen metin/kart kutusu 0, UV pencere 15 adet [0,1] içinde, dil seçici büyütecinde son satır–alt kenar 16.6 px.
- Doluluk: telefon 312×625 px (%93), panel 920×560 + şerit (%99), 3B grup ≥660×624 px.
- Başlık–ses senkronu: en büyük fark **0.05 sn** (sınır 0,15). İlk kare başlığı = kapak başlığı: "Yabancı misafir geldi. Menüyü kim anlatacak?".

## Cümle/parça başına senkron
| Parça | Metin | Ses (sn) | Başlık (sn) | Fark giriş / çıkış |
|---|---|---|---|---|
| c0 | Yabancı misafir geldi. Menüyü kim anlatacak? | 0.00–3.04 | 0.00–3.00 | +0.00 / -0.04 |
| c1 | Garsonunuz tercümana dönüşüyor, | 3.38–5.30 | 3.35–5.25 | -0.03 / -0.05 |
| c2 | diğer masalar bekliyor. | 5.48–6.84 | 5.45–6.80 | -0.03 / -0.04 |
| c3 | Anlamayan misafir de sormaya çekinir. | 7.15–9.45 | 7.10–9.40 | -0.05 / -0.05 |
| c4 | Çözüm menünün kendisinde. | 9.75–11.41 | 9.70–11.40 | -0.05 / -0.01 |
| c5 | Misafir QR’ı okutur, dilini seçer. | 11.71–14.62 | 11.65–14.60 | -0.05 / -0.02 |
| c6 | Ürün adı, açıklama, kategori, | 14.97–17.15 | 14.95–17.10 | -0.02 / -0.05 |
| c7 | hepsi kendi dilinde açılır. | 17.36–18.92 | 17.35–18.90 | -0.01 / -0.02 |
| c8 | Bu, Çoklu Dil modülü. | 19.18–20.58 | 19.15–20.55 | -0.03 / -0.03 |
| c9 | Dilleri siz tanımlarsınız. | 20.98–22.51 | 20.95–22.50 | -0.03 / -0.01 |
| c10 | Çevirileri elle ya da CSV ile girersiniz. | 22.78–26.13 | 22.75–26.10 | -0.03 / -0.03 |
| c11 | Otuz dile kadar. | 26.34–27.28 | 26.30–27.25 | -0.04 / -0.03 |
| c12 | Garsonunuz servise dönsün. | 27.54–29.12 | 27.50–29.10 | -0.04 / -0.02 |
| c13 | Aynı menüyü kendi telefonunuzda deneyin, | 29.36–31.57 | 29.35–31.55 | -0.01 / -0.02 |
| c14 | dil seçiciyi siz değiştirin. | 31.91–33.40 | 31.90–33.35 | -0.01 / -0.05 |
| c15 | Bağlantı profilimizde. | 33.72–34.95 | 33.70–34.95 | -0.02 / +0.00 |

(c0 kanca: t=0'dan görünür, döngü için; sonraki başlıklar cümleden 0,08 sn önce girer, 0,12 sn sonra söner.)

## Bölüm 1 — ses ve zamanlama
1. cue.json: **düzeltildi/yapıldı.** `ses/cue-uret.py`; eşleşme tuttu (14 cümle ↔ 16 parça).
2. Süre = konuşma bitişi + 0,8: **yapıldı** (35,767 sn). Duraklama sıkıştırma: gerekmedi (en uzun 0,40 sn).
3. Süreler sese göre (`timeline.js`): **yapıldı**, yerleşim v4 ile aynı. Sapma: "Otuz dile kadar." cümlesi 0,94 sn; tam opak süre 0.9 sn (v3'teki 1,2 sn kuralı sesle çelişiyor, test cümle süresinin %90'ına çekildi).
4. Miks: **yapıldı** (`encode-v5.sh`): -14.1 LUFS, tepe -1.3 dBTP, 48 kHz stereo AAC.
5. Altyazı yalnız düz metin: **yapıldı** (başlık+altyazı birleşimi `ses-metni.md` ile aynı; "kü ar/si es vi" yok).

## Bölüm 2 — v4 bug'ları
a. Büyüteçte "a Yemek": **düzeltildi.** DD penceresi x 4–344 (kategori metni x≥345 dışarıda); son satır–alt kenar 16.6 px. Kanıt: `out/sheet-v5-9-12.jpg`, once-sonra_dil-secici-buyutec.
b. Panel↔telefon çapraz: **düzeltildi.** Eski sahne 0,2 sn söner, yenisi sonra gelir; testte `panel-telefon-capraz` 0. Kanıt: `out/sheet-v5-17-23.jpg`.
c. "↖" oku: **düzeltildi** (kaldırıldı). Kanıt: `out/sheet-v5-24-son.jpg`.
d. Panel başlık şeridi: **düzeltildi.** Ekran görüntüsünden "Müşteri Deneyimi / Diller & Çeviriler" (422×90 px), pencere 920×560; kartlar bütün. Panel 560 px (v4: 568) — şerit sığsın diye.
e. Alt çubuk: **düzeltildi.** Telefon ekranı x 14–830, y 0–1708 penceresiyle kırpıldı (oran 0,496); ekran yeniden çizilmedi. Sol/sağ 14/30 px kırpım hamburger ve satır kartlarını kesmez. Kanıt: once-sonra_bar-kirpimi-satirlar.
f. v4 değerleri: **korundu** (test yeşil; yukarıdaki ölçümler).

## Bölüm 3 — kapak
- `kapak/coklu-dil-kapak.png` (1080×1920) ve `.jpg` (kalite 92, 0.29 MB), `kapak/onizleme.jpg`; kontrol `kapak/kontrol.json`.
- 3B grup 771 px geniş, y 860–1420 (v4 sahnesinin aynı nesneleri). Hap y 470–546, 48 px. Logo 220 px, y≈1560. Başlık y 558–775.
- Kırpım kenar payı: 3:4 → 65 px, 1:1 → 50 px (≥40). 330 px'te başlık yazı yüksekliği 26.9 px (≥26). Kontrast: krem 12.04:1, altın 5.95:1.
- **Sapmalar:** (1) Başlık **88 px** (≥96 istenmişti): "Menüyü kim anlatacak?" satırı 950 px (yan güvenli bölge 65) içine 88 px'ten büyük sığmıyor. (2) Spec'teki grup (y 860–1420) ve logo (y≈1560) Reels güvenli bölgesinin altından (y>1248) taşıyor; açık koordinatlar izlendi, başlık ve hap güvenli bölge içinde. (3) Hap y 470 (istenen ≈420): 1:1 kırpımında kenara ≥40 px için aşağı alındı.
- Rakam/yüzde, AI, ücretsiz, anında, CTA, URL, altı çizili metin, telefon/ekran görüntüsü yok.

## Sınırlar
- Telaffuz dinlenmedi. Sesin 16 parçasındaki iç duraklar ve parça sınırları yalnız sessizlik eşiğinden türedi; hatalı sessizlik eşiği başlık kaymasına yol açar (senkron ölçümü cue.json'a göredir, kulakla doğrulanmadı).
- Büyüteçte satır kartı kenardan kesik (yalnız metin sütunu); Arapça/Çince öğeleri dil listesine sığmıyor.
- Garson 3B sahnede masayla kısmen örtüşüyor.
