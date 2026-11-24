# Claude Code promptu — Yorum & Feedback Reels (v1)

Dal: `claude/qr-menu-instagram-strategy-rs76jf` (PR yok, ana dala push yok). Mevcut Çoklu Dil v9 hattını (`analiz/video/render/*-v9.*`, `ses/cue-uret-v4.py`, `ses/kisa-uret-v4.py`, `test-v9.mjs`, `encode-v9.sh`) KOPYALAYIP genelleştir; v1–v9 dosyaları DEĞİŞMEZ. Yeni çıktılar `analiz/yorum-feedback/video/` altında (`render/`, `ses/`, `out/`, `ekran/`).

## Girdiler
- Ses metni: `analiz/yorum-feedback/video/ses-metni-yorum-v6.md` GEÇERLİ sürümdür (v1–v5 kullanılmayacak; sahne planı v6 dosyasındaki 'Sahne eşleşmesi' bölümüdür; ses: Deniz). DEĞİŞTİRME. Ses: kullanıcı üretip `analiz/yorum-feedback/video/ses/anlatim-yorum.mp3` olarak koyacak. Ses yoksa Faz A (anahtar kareler, tahmini zaman) ile DUR.
- Marka/tasarım: `tools/ig-carousel/SPEC.md`, `analiz/yorum-feedback/final/2-carousel-*.jpg` (carousel), `analiz/video/video-v9-prompt.md` ve `video-v9-rapor.md` (bölge sistemi, altyazı, test listesi). Aynı dil: Manrope, altın açılış/kapanış + zümrüt orta, 1080×1920, bölgeler A (270–330 etiket "YORUM & FEEDBACK MODÜLÜ"), B (330–1020 ana görsel), C (1040–1236 altyazı plakası), D (1248+ yalnız dekor), güvenli bölge x65–1015, sağ ray boş.
- Altyazı = ses metninin aynısı; plaka yalnız konuşma varken görünür (sessizlik >0,15 sn → plaka ve metin 120 ms'de söner; boş plaka süresi 0 testi).

## EKRAN GÖRÜNTÜLERİ (kritik, v9'dan farkı bu)
`ekran/` altında bu modülün ekranı YOK. İhtiyaç (hepsi DEMO hesaptan, salt okunur; arayüz YENİDEN ÇİZİLMEZ, yalnız kırpılır):
1. **Müşteri yorum formu** (menü sayfasında puan kriterleri + yorum alanı) — mobil görünüm.
2. **Panel: bekleyen yorumlar listesi** (onay bekleyen durum görünür).
3. **Panel: masa bazlı rapor** (masa tablosu ve/veya saat dağılımı).
4. **Panel: düşüş uyarısı kutusu** (rapor üstü uyarı). Demo hesapta uyarı yoksa üretmeye ÇALIŞMA/uydurma.
Yöntem: `tools/panel-video/` (salt okunur); kimlik bilgisi YALNIZCA `PANEL_HOST/PANEL_USER/PANEL_PASS` ortam değişkenlerinden, sohbet/log/repo'ya YAZMA, çerezleri `tools/panel-video/w/` (gitignore) altında tut ve iş bitince sil. Ortam değişkenleri yoksa ya da bir ekran alınamıyorsa: **UYDURMA, SAHTE ARAYÜZ ÇİZME**; hangi ekranların eksik olduğunu listele ve DUR (kullanıcı ekran görüntüsü verecek).
**Mahremiyet (zorunlu):** Ekranlarda gerçek müşteri adı, telefon, e-posta, IP, yorum metni OLMAMALI. Yalnız demo/örnek veri. İzinli Kişiler (ad/telefon/e-posta) bloğunu HİÇ gösterme. Gerçek veri görünüyorsa bulanıklaştırma YETMEZ: ekranı yeniden al ya da o bölgeyi kırp.

## Sahne planı (süreler `ses/cue-yorum.json`'dan; sabit saniye yazma)
1. **Kanca (ALTIN):** B: "Puanlar düşerken / siz **farkında** / mısınız?" (carousel kapağıyla aynı). D: dekor yok ya da yıldız-puan satırı (5 boş yıldız outline, metinsiz).
2. **Acı (ALTIN):** cümle 2. B: tek soru-kart, 3 satırlık "Şikayet kime ulaşıyor?" benzeri ANAHTAR KART YASAK (altyazıyı tekrarlar). Yerine görsel: 2 sütunlu şema "Size" / "Yeni müşteriye" iki kutu, biri boş-soru işaretsiz nötr; metin ≥40 px. Satış cümlesi yok.
3. **Dönüş (ZÜMRÜT perde):** cümle 3. B: "Yorum & Feedback" altın pill + altında "PUAN · YORUM · RAPOR".
4. **Müşteri tarafı (ZÜMRÜT):** cümle 4. B: ekran 1 (yorum formu) 900 px geniş kırpma; kriterler (yemek/hizmet/temizlik) satırları okunur (etkin ≥28 px, gerekirse formun ilgili bölümünü büyüt).
5. **Önce siz (ZÜMRÜT):** cümle 5. B: ekran 2 (bekleyen yorumlar) 900 px kırpma, "bekleyen" durumu karartma %55 + 3 px altın çerçeve ile vurgulu. Anahtar kart: "Önce siz." (kartın üstünde, y 330–420).
6. **Rapor (ZÜMRÜT):** cümle 6. B: ekran 3 (masa raporu) 900 px kırpma, masa ve saat kolonları vurgulu.
7. **Uyarı (ZÜMRÜT):** cümle 7. B: ekran 4 (uyarı kutusu). Ekran yoksa bu sahneyi ATLAMA: DUR ve kullanıcıya sor (cümle 7'yi çıkarmak ses değişikliği ister).
8. **Kapanış (ALTIN) [v6'da URL/CTA YOK; v6 dosyasındaki kapanışı uygula]:** cümle 8. A: logo (sol, 240 px) + etiket (sağ). B: "Canlı menü" 140 px + URL `qrmenuofficial.com/canli-menu` 56 px tam opak (UTM yazma). Ok/çizgi yok. Son kare→ilk kare 0,7 sn: yalnız zemin çapraz, metin önce söner, sonra yenisi girer.

## v6 GÜNCELLEME (kullanıcı kararı): ses hazır, tam üretim; ekranlar TEST SİTESİNDEN
- **Ses hazır:** `ses/anlatim-yorum.mp3` (30,85 sn, Deniz) repoda; metin `ses-metni-yorum-v6.md`. Faz A'yı ATLA: ekranlar alınınca doğrudan Faz B'ye geç (cue → tam render). Sesi dinleyemiyorsan cümle sayısı eşleşmezse (v6: 6 cümle, ≈11 konuşma parçası) DUR ve parça listesini yaz. Ayrıca KISA sürüm üret: cümle 4 ("İsterseniz Google yorumu yapana küçük bir ödülle teşekkür edersiniz.") çıkarılmış (`kisa-uret` mantığı: 0,25 sn boşluk + 20 ms solma, hız değişmez); hangi cümleyi çıkardığını raporla. Tam ve kısa birlikte teslim, ikisi için de testler.
- **Ekran kaynağı:** Gerçek arayüzü TEST SİTESİNDEN al (`https://test.qrmenuofficial.com/` = Pro demo; yorum modülü Plus paketinde olabilir: yorum formu/ panel görünmüyorsa `https://full.qrmenuofficial.com/` (Plus demo) dene; canlı menü sayfası `qrmenuofficial.com/canli-menu/` bu adresleri listeler).
  1. **Müşteri yorum formu** (mobil, 390×844 viewport, DPR 2): test sitesinin menü sayfasındaki puan + yorum formu. Herkese açık sayfa, kimlik bilgisi GEREKMEZ. Formu doldurmak/göndermek YOK (test sitesine veri yazma); yalnız görünür hâlini yakala.
  2. **Panel ekranları (bekleyen yorumlar, masa raporu, düşüş uyarısı/trend):** `tools/panel-video/` ile, kimlik bilgisi YALNIZCA `PANEL_HOST/PANEL_USER/PANEL_PASS` ortam değişkenlerinden. Tanımlı değilse bu üç ekran için DUR ve kullanıcıya yaz (sahte arayüz yok); form ekranını (1) yine de al ve kaydet.
  Salt okunur: hiçbir ayarı değiştirme, yorum onaylama/silme, kayıt oluşturma YOK.
- **"Gerçek veri" sınırı:** Test sitesindeki verinin gerçek müşteriye ait olmadığını doğrula (ad/telefon/e-posta/IP/yorum metni). Gerçek kişi verisi görünüyorsa kullanma: farklı ekran/kırpma seç ya da DUR. Demo/örnek yorum ve "Masa 1" gibi etiketler serbest. İzinli Kişiler bloğu, gerçek Google yorum linki ve gerçek ödül kodu ekranda OLMAYACAK (maske/kırp).
- Kimlik bilgisi sohbete/log'a/repoya yazılmaz; çerezler `tools/panel-video/w/` altında tutulur ve iş bitince silinir.

## Kısıtlar (katı)
- Ses metnindeki dışında İDDİA YOK: "puan yükselir", rakam/yüzde/süre, "ücretsiz/anında/garanti" kodda ve ekranda taranacak (test ekle).
- v4: Google yönlendirme ve isteğe bağlı ödül ANLATILIYOR (kullanıcı kararı). Ekranda gerçek Google yorum linki, gerçek ödül kodu, indirim oranı/rakamı ve kişisel veri görünmeyecek; ayar ekranı kırpması maskeli ya da boş alanla alınır. Rakamlı sonuç vaadi ve 'garanti' yazma.
- Hareket: yalnız opaklık + 24–48 px kayma + ≤%3 ölçek, ease-out; bounce/elastic/rotasyon YOK. Çocuksu öğe (figür, balon, emoji) YOK. Kiril/Arapça glif yok.
- Süre hedefi ≤30 sn; aşarsa ayrıca "kısa" sürüm üret (en zayıf cümleyi çıkar; `kisa-uret` mantığı: 0,25 sn boşluk + 20 ms solma, hız değişmez) ve hangi cümleyi çıkardığını raporla.

## Testler (v9 testlerini uyarla; hepsi 0 ihlal olmalı)
metin–metin çakışma; alt örtü (y>1248'de işlevsel öğe); plaka opaklığı ≥%95 ve **boş plaka süresi = 0**; güvenli bölge; sağ ray; min yazı ≥36 px (ekran içi UI ayrı raporlanır); kontrast (plaka ≥7:1); kanıt kartı ≥900 px; altyazı = ses metni, başlangıç sapması ≤0,15 sn; CSV vurgu testi YOK (bu videoda geçerli değil); yasak ifade/Google taraması; ekranlarda kişisel veri yok (yeniden alma kanıtı); ses −14 LUFS, tepe ≤ −1,5 dBTP; sessizlik >0,3 sn yok.

## Aşamalar ve karar kapısı
- **Faz 0:** ekran yakalama (veya eksik listesi) → `ekran/` altında 4 görüntü + her birinde kişisel veri kontrolü notu. Eksik varsa DUR.
- **Faz A:** 8 anahtar kare + 4 geçiş karesi (`out/kontrol/`), TAM BOYUTTA aç ve bak; DUR, onay iste.
- **Faz B:** `anlatim-yorum.mp3` gelince `cue-uret-yorum.py` (cümle sayısı 12/… eşleşmezse DUR) → tam (+ gerekirse kısa) render, `.srt`, rapor `analiz/yorum-feedback/video/video-rapor.md` (açıp baktığın kareleri ve başarısız hedefleri dürüstçe yaz).

## Yasak
Kimlik bilgisi/token/çerez commit'i veya sohbete yazma; sahte arayüz; ses üretme/metin değiştirme; v1–v9 dosyalarını değiştirme; PR; ana dala push.
