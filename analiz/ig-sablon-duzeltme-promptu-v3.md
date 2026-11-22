# Claude Code promptu — ig-templates v3 (yalnız zayıf kapaklar)

Girdi: `tools/ig-templates/` (RAPOR.md, out/v2/, sprites, templates), `analiz/video/ekran/` (gerçek ekranlar), `CLAUDE.md`. v2'yi EZME; yeni sürümler `out/v3/`. Marka paleti DEĞİŞMEZ (koyu yeşil #0D2B22, altın #C9A84C, krem düz #EADFC1, açık zeminde altın yazı #7F6419). Kanca A, kanıt, tipografi cümle, QR masa kapakları DOKUNULMAZ.

1) GARSON ÇAĞRISI ("Garson gelmedi mi?")
- Zil hâlâ servis kapağı/pankek yığını gibi okunuyor ve tepsiyle örtüşüyor. Yeni sprite: net ZİL formu (yassı yuvarlak altın taban + kubbe + üstte kısa düğme + iki yanda küçük "çınlama" çizgileri), masanın ÖN-ORTASINDA, tepsiden ayrı, genişlik ≥220 px. Tepsi sprite'ı bu kapakta kullanılmasın (örtüşme yok). 330 px küçültmede zil siluet olarak okunmalı.

2) YORUM ("Hangi kriter düşüyor?")
- Figür grubu küçük, masa boş: bu kompozisyonu KALDIR. Yerine soyut kriter çubukları: üç yatay çubuk (yemek, hizmet, temizlik için küçük altın ikon + çubuk), biri belirgin kısa ve aşağı oklu; hiçbir sayı/yüzde yok; yıldızlar çubukların üstünde yay. Altın #C9A84C çubuklar, düşen çubuk krem ile vurgulu. Ağırlık merkezi y %45–60, genişlik ≥760 px, başlık–öğe boşluğu ≤120 px. Figür kullanma.

2b) CHATBOT ("Soruyu kim cevaplıyor?")
- Figür grubuna menü asistanı çağrışımı ekle: stilize telefon sprite'ı içinde 2 sohbet balonu (içinde metin YOK, yalnızca çizgiler), figür grubu ile birlikte ≥760 px. Mevcut figür pozları korunur.

3) CÜMLE / PROP VARYANTI ("Dilleri siz tanımlarsınız.")
- Şu an müşteri tarafı dil açılır listesi gösteriliyor; cümle ise İŞLETME sahibinin panelde dil tanımlamasını anlatıyor. Tabletin içeriğini panel "Diller" kartı ile değiştir (gerçek ekran: panel ekranlarından "Diller · 28 dil etkin" kartı kırpığı; ekran görüntüsü değiştirilmez/yeniden çizilmez). Kırpık ≥28 px ekran-eşdeğeri okunur olsun. Koyu ve krem iki varyant.

4) GRİD RİTMİ
- plan/grid-plan-v2.json'u v3 çıktılarıyla güncelle; dizilim önerisini koru (A → kanıt → prop-koyu → tipografi-krem → chatbot → prop-krem). Mevcut gridle 2 uyarı kalıyorsa raporda hangi hücreler olduğunu yaz.

5) TESTLER VE DOĞRULAMA
- check.mjs tüm yeni çıktılarda yeşil; ölçek/kontrast/palet testleri v2 ile aynı eşikler.
- Yeni test: örtüşme — garson çağrısında zil sprite kutusu ile tepsi/figür kutuları kesişmez; yorumda çubuk metni/ikon kutuları güvenli alan içinde.
- Önizleme sheet'i (9:16 / 3:4 / 330 px) ve grid montajı; yeni çıktılar için ölçüm tablosu; RAPOR.md v3 bölümü. Başarısız/yapılamayanları açıkça yaz. Commit/push (gerekirse fetch+merge), PR açma.
