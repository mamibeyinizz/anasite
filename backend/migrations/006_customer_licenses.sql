-- Lisansı müşteri hesabına bağlar (hesabım → Lisans). Bir lisans en fazla bir müşteriye bağlıdır.
-- Ayrı tablo: mevcut licenses şemasına ve lisans doğrulamaya dokunmaz. Tekrar çalıştırılabilir.
-- Bağlantıyı yönetim paneli kurar (Lisans → Müşteri hesabı); müşteri kendi başına lisans bağlayamaz.

CREATE TABLE IF NOT EXISTS customer_licenses (
  license_id BIGINT UNSIGNED NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  linked_at DATETIME NOT NULL,
  PRIMARY KEY (license_id),
  KEY idx_customer_licenses_customer (customer_id),
  CONSTRAINT fk_customer_licenses_license FOREIGN KEY (license_id) REFERENCES licenses (id) ON DELETE CASCADE,
  CONSTRAINT fk_customer_licenses_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
