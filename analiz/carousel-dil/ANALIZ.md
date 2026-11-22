# Çoklu Dil carousel (5 slayt) — analiz ve yeniden tasarım

Rakamlar DEĞİŞMEDİ: 3 soru · 20'den fazla dil · %40 · %60 · %87 · %150 · 5 slayt.
Yeni sistem: Işık üçlüsünün 2. parçası (altın kapak + krem içerik + altın kapanış), Manrope, tek sol eksen x=96, 96 px marj, sağ üst 160×160 boş (Instagram sayfa göstergesi), modül adı üstte "ÇOKLU DİL MODÜLÜ", logo yalnız 1 ve 5'te.

## Slayt slayt eski durum
| # | Tasarım | Anlatım | Renk |
|---|---|---|---|
| 1 | Başlık "DİL ÇEVİRİ MODÜLÜ" çerçeveye yapışık; üst şeritte aynı ad tekrar; 3 farklı yazı karakteri (serif başlık, sans gövde, serif harf aralıklı alt) | "AI destekli" ürün gerçeğiyle çelişiyor; kanca yok, kaydırma çağrısı yok | İki farklı altın tonu, beyaz+krem karışık |
| 2 | 3 uzun soru ≈24 px, hiyerarşisiz; daire numaralar çok küçük; sola yaslı (diğer slaytlar ortalı) | Başlıkta "Sorun :" boşluk, Title Case; 3. soru "Sadece…" ile başlıyor | Metin ve vurgu aynı krem |
| 3 | Üç aynı ağırlıkta ortalı paragraf; "Sonuçlar ne oldu ?" gövdeyle aynı boy; kaydırma ipucu minik | "Yapay zekanın gücünü arkamıza aldık" yanlış; "devrim oldu" yasaklı kelime; "?" önünde boşluk | Tek ton, vurgu yok |
| 4 | Rakamlar kahraman değil (aynı boy satırlar); ✦ ikonları iki satırlı maddede ortada kalıyor; kalın vurgu rastgele ("%40 Kısaldı." kalın, diğerleri değil) | "Restoranta" yazım hatası; "Yabancı masalardan, %60" virgül hatası; "Sonuçlar :" | Altın vurgu parçalı |
| 5 | Serif, Title Case, tek uzun cümle; saydam hayalet modül listesi okunmuyor | "Arttıracak" yazım hatası; "Ai Chatbot", "Akıllı Analiz", "Ürün İçeriği" ürün adlarıyla tutarsız; CTA'da kanal yok | Hayalet metin neredeyse görünmez |
Ortak: tek bir koyu yeşil zemin (monoton, kapanış vurgusuz), çerçeve+köşe süsü marjı yiyor, sayfa göstergesi köşe süslerini kapatıyor, carousel'a başka hesabın sesi ("haciproductionsplus · Orijinal ses") bağlı.

## Yapılan değişiklikler
1. Zemin: 1 ve 5 altın #C9A84C (yeşil metin 6,6:1; yeşil halka motifi %45 düşük), 2–4 düz krem #EADFC1 (yeşil metin 11,4:1, gold-ink #7F6419 vurgu).
2. 1: modül adı yalnız üstte; başlık "Turistlerle dil problemini ortadan kaldıran [modül.]" (altın üstünde koyu pill vurgu); alt cümle; "Kaydırın →".
3. 2: başlık + 3 büyük numaralı soru (42 px); noktalama düzeltildi, metin korundu.
4. 3: yapay zeka cümlesi çıkarıldı; "devrim oldu" → "fark yarattı"; "20'den fazla dili" vurgulu; "Peki sonuçlar ne oldu?" 104 px gold-ink; "Sonuçlar için kaydırın →".
5. 4: üç rakam kahraman (116 px gold-ink): %40 · %60 · %87; iki niteliksel madde onay işaretiyle; "Restorana" düzeltildi; %87 cümlesi "…turistlerin tekrar gelme oranı" biçimine alındı (büyük rakamla okunur).
6. 5: "arttıracak" → "artıracak" (zaman kipi aynı kaldı); 6 ürün adı rozeti (Garson & Hesap, QR Masa, Yorum & Feedback, Menü Asistanı, Akıllı Filtreleme, Menü Analitiği); "İletişime geçin" düğmesi + kanal: profildeki bağlantı / DM "menü".

## Dikkat
- "AI destekli" ve "yapay zekanın gücü" ifadeleri kodla uyuşmuyor (çeviri elle/CSV); çıkarıldı. Geri istenirse söylenmeli.
- "%150 artıracak" gelecek zaman vaadi olarak aynen duruyor (rakam korunması istendi); kaynak/kanıt dosyası hazır tutulmalı.
- Instagram carousel'ı düzenlenemez: eski gönderi arşivlenip yenisi yüklenmeli; müziği/orijinal sesi eklemeyin.

---

## v2 (kullanıcı geri bildirimi: renkler uyumsuz, UX hataları sürüyor)
**v1'in gerçek sorunları (kendi tasarımım):**
- Renk: altın düz zemin iki slaytı kaplıyordu (≈%40; vurgu rengi baskın renk oldu, hardal gibi okundu); büyük başlık ve rakamlar gold-ink (#7F6419, kahverengi-zeytin) olduğundan krem üstünde bulanık; altın, krem ve gold-ink aynı sıcak orta tonlar ailesinde yan yana, ayırt edici kontrast yok.
- UX: soru metni hâlâ duvar; vurgu yok; rakam–açıklama hizası kaymış; "modül." kelimesine anlamsız vurgu; slayt 5 aynı anda başlık + 6 rozet + düğme + not yığını.

**v2 renk sistemi (60 / 30 / 10):** baskın zemin krem #EADFC1 (içerik) ve zümrüt gradyan #1E3D2F→#0D2B22 (kapanış); ikincil koyu yeşil metin; altın yalnız vurgu (pill, numara dairesi, ✓, dikey çubuk). Kapak: altın gradyan #E8C766→#C9A84C (yeşil metin 6,6–9:1). Büyük metinde gold-ink YOK (yalnız küçük etiket).
**Sıra:** altın (dikkat) → krem (okuma) → zümrüt (kapanış); kapanış Reels kapağıyla (zümrüt) aynı ailede.
**UX:** vurgu = altın pill (krem üstünde) / koyu pill (altın üstünde); sorularda kilit ifadeler kalın; numara daireleri dolu altın; kaydırma düğmesi tutarlı (metin + daire ok); rakamlar koyu yeşil 120 px + dikey altın çubuk, açıklama dikey ortalı; slayt 5 sade: başlık, rozetler (28 px), altın CTA düğmesi, kanal notu.
Dosyalar: `carousel-v2.html`, `v2-slayt-1..5.jpg`, `sheet-v2.jpg`.

---

## Tek renk karşılaştırması (kullanıcı sorusu: hepsi aynı renk olmaz mıydı?)
Dosyalar: `carousel-v3.html?s=<1-5>&bg=krem|zumrut|altin`, `c3-<renk>-<n>.jpg`, `tek-renk-karsilastirma.jpg`.
- **A · hepsi krem:** en okunur; ama acı gönderi de krem → gridde krem | krem | zümrüt (iki açık tipografik karo yan yana, tek geniş blok gibi okunur); altın pill krem üstünde zayıf.
- **B · hepsi zümrüt:** en yüksek kontrast (krem/zümrüt 10,5:1, altın/zümrüt 5,2:1); altın vurgu parlıyor (60/30/10 doğru oturuyor); hesabın eski koyu carousel'larıyla ve Reels kapağıyla aynı aile; gridde krem | zümrüt | zümrüt (koyu çift, ama biri tipografik biri 3B).
- **C · hepsi altın:** 5 slaytta hardal yorgunluğu; vurgu pill'leri koyu yeşile döner; en zor okunan.
Öneri: B.
