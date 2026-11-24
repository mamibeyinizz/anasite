# Ekran yakalama notları (Faz 0)

| # | Ekran | Durum | Kaynak / not |
|---|---|---|---|
| 1 | Müşteri yorum formu (1. adım: Yemek Lezzeti, Hizmet Hızı, Temizlik, Atmosfer, Fiyat / Performans) | ALINDI: `01-yorum-formu.png` (780×1136, DPR 2, 390 px mobil) | Herkese açık `https://test.qrmenuofficial.com/` menü sayfası; form doldurulmadı/gönderilmedi; kimlik bilgisi kullanılmadı. Betik: `render/yakala-form.mjs` |
| 2 | Panel: bekleyen yorumlar | EKSİK | `PANEL_HOST/PANEL_USER/PANEL_PASS` tanımlı değil |
| 3 | Panel: masa/saat/kriter raporu | EKSİK | aynı |
| 4 | Panel: düşüş uyarısı / trend | EKSİK | aynı |

**Kişisel veri kontrolü (ekran 1):** görüntüde yalnız form başlığı, adım göstergesi (adımların etiketleri), kriter adları, boş yıldızlar ve "DEVAM ET" düğmesi var. Ad/telefon/e-posta/IP/yorum metni yok; Google linki, ödül kodu, indirim oranı, İzinli Kişiler bloğu yok. Dördüncü adımın etiketi ("Google'da Bize Puan Ver…") yalnız adım başlığıdır, bağlantı değildir.

## Güncelleme: panel denemesi (plus.qrmenuofficial.com/qrm, salt okunur)
Giriş başarılı, yalnız gezildi; hiçbir kayıt oluşturulmadı/değiştirilmedi. Oturum çerezi iş bitince silindi.
Hesapta **hiç yorum yok**: Onay bekleyen 0 · Toplam yorum 0 · Genel ortalama "Henüz puan yok". Liste "Henüz hiç yorum gelmemiş", rapor sekmesi (Masa / Vardiya / Saat Raporu, Kriter Trendleri) her kriter için "Yeterli veri yok". Düşüş uyarısı yok.
Bu yüzden ekran 2 (bekleyen yorumlar), 3 (masa/saat/kriter raporu) ve 4 (uyarı/trend) için anlamlı görüntü alınamadı; veri üretmek (test yorumu göndermek) yasak olduğundan alınmadı. Boş ekranlar videoda "yeterli veri yok" mesajını gösterir; kullanılmadı.
