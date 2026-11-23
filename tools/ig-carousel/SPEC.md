# @qrmenuofficial — Modül carousel'ı (2. gönderi): SABİT TASARIM STANDARDI

Yalnız Instagram @qrmenuofficial için geçerli (web sitesi tipografi kuralları ayrıdır). Her modülün 3'lü sistemi: **1) acı görseli** (`tools/ig-aci/`, krem) · **2) bu carousel (5 slayt, zümrüt)** · **3) Reels**. Referans: `referans-coklu-dil.html` (Çoklu Dil), önizleme `out/`. Üretim: `node tools/ig-carousel/render.mjs [html] [çıktı]`.
Yeni modül = referans dosyadaki `SL` içeriğini (metin) değiştir; aşağıdaki DEĞİŞMEZ değerlere dokunma.

## DEĞİŞMEZ
- **Tuval** 1080×1440 (3:4). Zemin dikey gradyan #1E3D2F → #0D2B22. Metin krem #F4F1E8, vurgu altın #C9A84C, pill üstü koyu yeşil #0D2B22. Renk oranı 60/30/10 (zümrüt/krem/altın). Tek zemin: 5 slaytın hepsi zümrüt.
- **Zemin süsü:** altın ince çerçeve (inset 64, 2 px, %55) + köşe ayraçları (kol 120, 5 px) + silik nokta ızgarası (60 px aralık, r=3, altın %17). Halka motifi KAPALI. Noktalar her metin bloğunun 40 px çevresinden otomatik silinir (tüm slaytlarda aynı kural; script `CLR` listesi); noktanın harf/rakam arasına denk gelmesi hata.
- **Üst etiket** "<MODÜL ADI> MODÜLÜ": 30 px, 800, altın, harf aralığı .42em; ortalı slaytlarda ortalı (S1, S5), sola dayalı slaytlarda sola (S2–S4). Marka adı etikette YOK (logo altta).
- **Marjlar:** yan 120; sola dayalı slaytlarda tek sol eksen x=120; ortalı öğelerin merkezi 540±2. **İlk içeriğin üst ucu S2–S5'te y=276** (ölçülür). Sağ üst 160×160 boş (IG sayacı). Boşluklar 8 px katı.
- **Alt:** CTA/geçiş satırı (28 px, 800, .14em, büyük harf + altın daire ok) bottom 96 px, ortalı; S1'de 232 px (logonun üstünde). Logo (altın, 240 px) yalnız S1 ve S5'te, alt ortada.
- **Metin boyutları:** başlık 66–92 (800, −.04em; otomatik sığdırma, en geniş satır ≤840 px), gövde 36–44 (500), vurgu ifadesi altın 800, rakam 104–112 (800, altın), kahraman rakam (yalnız S3 "20+") 220 px.
- **Vurgu kuralı:** başlıkta en fazla bir altın pill (arka altın, metin koyu yeşil), pill cümleyi bölmez (kelime grubunun tamamı). Gövdede vurgu cümlenin SONUNDA, altın + 800, satır içinde bölünmez (gerekirse `<br>`).
- **Dil:** fayda ve eylem dili, pasif rapor değil; ürünün gerçekten yaptığıyla sınırlı (çeviri elle/CSV; "AI/otomatik çeviri/yapay zeka" YOK).

## SLAYT TİPLERİ (sıra sabit)
1. **Kapak (ortalı):** sonuç vaadi başlığı (3 satır, pill rakamda) + modülü anlatan satır (örn. dil kodları) + tek cümle destek + "Neden? Kaydırın →" + logo. Kapak HEM modülü HEM sonucu söylemeli.
2. **Sorular (sola):** her soru bir KAYIP/ACI cümlesi (evet cevabı acıtır; "etkiliyor mu?" gibi cevabı bariz ya da belirsiz kayıp ifadesi yok), 2–3 satır, acı kısmı altın kalın ve satır sonunda; slayt sonunda acıyı bastıran tek satır ("Birine bile “evet” dediyseniz, kaybediyorsunuz."). Eski tanım: "Bu 3 soruyu kendinize sorun:" + 3 numaralı soru (altın çerçeveli daire, 42 px metin; üst kısım krem, soru kısmı altın kalın, satır sonunda) + ayraçlar + "Çözümü görün →".
3. **Veri (sola):** kahraman rakam ("20+ dil") + 2 kısa cümle + köprü sorusu ("Peki sonuçlar ne oldu?") + "Sonuçları görün →".
4. **Sonuçlar (sola):** pill başlık + TABLO: sol sütun rakam (112 px, 330 px sütun) / sağ sütun açıklama (vurgu sonda); ✓ satırları ikon+metin bitişik (ikon metnin hemen solunda); satır yüksekliği 176/116; "Nasıl başlarsınız? →".
5. **Kapanış (ortalı):** başlık (≤3 satır, pill rakamda) + "DİĞER MODÜLLER" 2×3 çizgili tablo + vurucu kayıp cümlesi ("Bir sonraki turist masasını [kaybetmeyin.]") + altın kazanç cümlesi ("Turistlerin favori mekanı olun.") + logo. Tıklanamayan öğe düğme gibi çizilmez; eylem çağrısı açıklamada/sabit yorumda.

## YASAK
Serif/ikinci font; çerçeveli kutu/pill'i düğme gibi sunmak; her slaytta farklı zemin rengi; halka motifi; slayt başına birden çok vurgu rengi; 38 px altı gövde metni; sağ üst köşede içerik; kanıtsız rakamın kapakta tek başına bırakılması (kanıt dosyası hazır olmadan yayın yok).

## Her slayt öncesi KONTROL (piksel ölçümü, göz değil)
1. S2–S5 ilk içerik üst ucu = 276; sola dayalı slaytlarda sol kenar = 120; ortalı öğe merkezi 538–542.
2. Hiçbir satır çerçeveye 56 px'ten fazla yaklaşmaz (içerik 120–960).
3. Vurgu ifadesi satır sonunda bölünmemiş; yetim tek kelime satırı yok.
4. Gridde ve 330 px küçültmede başlık okunuyor.
5. Aynı rakam iki slaytta yinelenecekse bilinçli (kapak vaadi → S4 teyidi) ve notlanmış.

## Grid sırası (soldan sağa)
krem acı görseli · zümrüt carousel kapağı · Reels kapağı (altın istendi; gerçek render beklemede — kapak sahnesi three.js, altın zeminle yeniden render edilmeli).
