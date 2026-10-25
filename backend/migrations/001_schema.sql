-- QR Menu Official lisans API şeması.
-- Tekrar çalıştırılabilir: tablo düşürme ve kayıt silme komutu yoktur.
-- Mevcut lisans satırları ve paket özelleştirmeleri silinmez.
-- INSERT IGNORE yalnızca eksik fabrika satırını ekler.
-- Tarih-saat sütunları UTC olarak yazılır.

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_sessions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  admin_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  csrf_secret CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_sessions_token (token_hash),
  KEY idx_admin_sessions_admin (admin_id),
  KEY idx_admin_sessions_expires (expires_at),
  CONSTRAINT fk_admin_sessions_admin FOREIGN KEY (admin_id) REFERENCES admins (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS licenses (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  company_name VARCHAR(191) NOT NULL,
  api_key_hmac CHAR(64) NOT NULL,
  api_key_encrypted VARBINARY(255) NULL,
  domain VARCHAR(191) NULL,
  status ENUM('aktif', 'pasif') NOT NULL DEFAULT 'aktif',
  starts_on DATE NULL,
  expires_on DATE NULL,
  amount_paid VARCHAR(64) NOT NULL DEFAULT '',
  notes TEXT NULL,
  last_seen_at DATETIME NULL,
  client_version VARCHAR(32) NOT NULL DEFAULT '',
  archived_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_licenses_api_key_hmac (api_key_hmac),
  KEY idx_licenses_status (status),
  KEY idx_licenses_expires (expires_on)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS license_modules (
  license_id BIGINT UNSIGNED NOT NULL,
  module_slug VARCHAR(64) NOT NULL,
  PRIMARY KEY (license_id, module_slug),
  CONSTRAINT fk_license_modules_license FOREIGN KEY (license_id) REFERENCES licenses (id) ON DELETE CASCADE,
  CONSTRAINT chk_license_module_slug CHECK (module_slug IN (
    'restoran-menu',
    'yorum-feedback',
    'qr-masa',
    'qr-analiz',
    'qr-galeri',
    'qr-ceviri',
    'qr-chatbot',
    'qr-calisma-saatleri',
    'qr-masa-oturum-guvenligi',
    'qr-acilis-ekrani',
    'header-footer-builder',
    'qr-menu-muhendisligi',
    'qr-servis-paneli'
  ))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tiers (
  slug VARCHAR(32) NOT NULL,
  label VARCHAR(64) NOT NULL,
  sort_order TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tier_modules (
  tier_slug VARCHAR(32) NOT NULL,
  module_slug VARCHAR(64) NOT NULL,
  PRIMARY KEY (tier_slug, module_slug),
  CONSTRAINT fk_tier_modules_tier FOREIGN KEY (tier_slug) REFERENCES tiers (slug) ON DELETE CASCADE,
  CONSTRAINT chk_tier_module_slug CHECK (module_slug IN (
    'restoran-menu',
    'yorum-feedback',
    'qr-masa',
    'qr-analiz',
    'qr-galeri',
    'qr-ceviri',
    'qr-chatbot',
    'qr-calisma-saatleri',
    'qr-masa-oturum-guvenligi',
    'qr-acilis-ekrani',
    'header-footer-builder',
    'qr-menu-muhendisligi',
    'qr-servis-paneli'
  ))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  license_id BIGINT UNSIGNED NOT NULL,
  occurred_at DATETIME NOT NULL,
  actor VARCHAR(64) NOT NULL,
  action VARCHAR(64) NOT NULL,
  detail VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY (id),
  KEY idx_audit_license_time (license_id, occurred_at),
  CONSTRAINT fk_audit_license FOREIGN KEY (license_id) REFERENCES licenses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rate_buckets (
  bucket VARCHAR(128) NOT NULL,
  hits INT UNSIGNED NOT NULL,
  reset_at DATETIME NOT NULL,
  PRIMARY KEY (bucket)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO tiers (slug, label, sort_order) VALUES
  ('baslangic', 'Başlangıç', 1),
  ('pro', 'Pro', 2),
  ('kurumsal', 'Kurumsal', 3);

INSERT IGNORE INTO tier_modules (tier_slug, module_slug) VALUES
  ('baslangic', 'restoran-menu'),
  ('baslangic', 'qr-masa'),
  ('baslangic', 'yorum-feedback'),
  ('pro', 'restoran-menu'),
  ('pro', 'qr-masa'),
  ('pro', 'yorum-feedback'),
  ('pro', 'qr-analiz'),
  ('pro', 'qr-galeri'),
  ('pro', 'qr-ceviri'),
  ('pro', 'qr-calisma-saatleri'),
  ('pro', 'qr-acilis-ekrani'),
  ('pro', 'header-footer-builder'),
  ('kurumsal', 'restoran-menu'),
  ('kurumsal', 'yorum-feedback'),
  ('kurumsal', 'qr-masa'),
  ('kurumsal', 'qr-analiz'),
  ('kurumsal', 'qr-galeri'),
  ('kurumsal', 'qr-ceviri'),
  ('kurumsal', 'qr-chatbot'),
  ('kurumsal', 'qr-calisma-saatleri'),
  ('kurumsal', 'qr-masa-oturum-guvenligi'),
  ('kurumsal', 'qr-acilis-ekrani'),
  ('kurumsal', 'header-footer-builder'),
  ('kurumsal', 'qr-menu-muhendisligi'),
  ('kurumsal', 'qr-servis-paneli');
