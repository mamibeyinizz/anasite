<?php
/**
 * Belge köküne açık ince giriş: /api/*, /blog…, /v1/validate, /wp-json/qmls/v1/validate.
 * Asıl uygulama backend/ altındadır (backend/.htaccess dışarıdan erişimi kapatır).
 */
declare(strict_types=1);

require dirname(__DIR__) . '/backend/public/index.php';
