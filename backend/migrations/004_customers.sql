-- Müşteri hesapları (üye ol / giriş / hesabım) ve test siparişleri.
-- Tekrar çalıştırılabilir: tablo düşürme ve kayıt silme komutu yoktur.
-- Tarih-saat sütunları UTC olarak yazılır. Parola yalnız password_hash() çıktısıdır.
-- Oturum belirteci veritabanında yalnız SHA-256 özeti olarak durur.

CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  business VARCHAR(120) NOT NULL DEFAULT '',
  phone VARCHAR(32) NOT NULL DEFAULT '',
  domain VARCHAR(191) NOT NULL DEFAULT '',
  terms_accepted_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  last_login_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customers_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS customer_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  csrf_secret CHAR(64) NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_sessions_token (token_hash),
  KEY idx_customer_sessions_customer (customer_id),
  KEY idx_customer_sessions_expires (expires_at),
  CONSTRAINT fk_customer_sessions_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tutar saklanmaz: fiyat tek kaynaktan (paketler/packages-data.js) okunur.
CREATE TABLE IF NOT EXISTS customer_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  customer_id BIGINT UNSIGNED NOT NULL,
  ref VARCHAR(16) NOT NULL,
  plan VARCHAR(16) NOT NULL,
  period VARCHAR(8) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'test',
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_orders_ref (ref),
  KEY idx_customer_orders_customer (customer_id, created_at),
  CONSTRAINT fk_customer_orders_customer FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
