# QR Servis uygulaması (Android) — kodda doğrulanan özellikler
Kaynak: mamibeyinizz/aiapp → project-source.zip (Kotlin/Compose, Firebase Auth + Firestore + FCM; "QR Servis — Garson & Hesap Çağırma"; site API: full.qrmenuofficial.com). Okunan: Models.kt, AppViewModel.kt, Screens.kt (yalnız başlıklar/etiketler), servisler.

## Veri modeli (koleksiyonlar)
branches (şube: ad, slug, apiKey, konum+yarıçap, GPS kontrol açık/kapalı), users (rol: admin/mudur/garson, şube, fcmToken, aktif), tables, calls (tip: garson/hesap/siparis; durum: bekliyor/onaylandi/iptal; onaylayan ad/uid; createdAt/onaylandiAt; iptal nedeni+iptal eden; sipariş kalemleri; müşteri notu + Türkçe çevirisi + not dili), shifts (+ breaks: vardiya, mola), announcements (duyuru, okundu bilgisi), audit_logs, daily_tasks, shift plans (modeller var; ekranları doğrulanmadı).

## Müşteri tarafı (bu repoda DEĞİL; site/menü üzerinden çağrı kaydı oluşturur)
Garson çağır, hesap iste, sipariş gönder. Sipariş kalemleri müşteri notu içerir; not diline göre Türkçe karşılığı (notTr) ve çeviri hatası işareti tutulur.

## Garson ekranı
Çağrılar (canlı), onayla / iptal (iptal nedeni), İşlem Geçmişim, Vardiyam (başlat/bitir, şube GPS yarıçapı içinde başlatma kontrolü, molaya çık/dön), Duyurular, Profilim. Arka planda foreground servis + FCM push + ses ayarı, cihaz açılışında yeniden başlama (BootReceiver).

## Müdür ekranı
Bildirimler (canlı çağrılar, geçen süre göstergesi), Geçmiş (çağrı geçmişi), Garsonlar (aktif vardiyalar, vardiya ve mola ayrıntısı), Personel (garson ekle/düzenle/şifre, hesap aktif/pasif), Duyuru gönder (tüm garsonlar / belirli kişi / şube), Şube konumu ve GPS yarıçapı ayarı, analitik ekranları (site API'sinden: toplam görüntülenme, tekil ziyaretçi, ürün tıklama, en çok/en az tıklanan ürünler, masalara göre görüntülenme).

## Admin
Şubeler (ekle/sil/düzenle, slug, API anahtarı yenile), kullanıcı yönetimi, denetim kaydı.

## Dikkat (satışta söylenmeyecek ya da doğrulanacak)
- Firestore kuralları: calls, shifts, tables için yazma/okuma çoğunlukla "giriş yapmış herhangi kullanıcı"; şube sınırı kuralda yok → şubeler arası veri sızıntısı/değiştirme riski. Çok şubeli müşteriye satmadan önce kapatılmalı.
- Repo herkese açık ve google-services.json içeriyor (Firebase istemci anahtarları sır değildir ama gevşek kurallarla birlikte risk).
- "Anında" / "%X artış" / bahşiş artışı gibi iddialar kodla desteklenmiyor.
