<?php
/**
 * cPanel belge köküne kopyalanan ince giriş.
 * backend/src bu dosyanın yanında durmaz.
 * QR_LICENSE_HOME, public_html dışında kalan kurulum kökünün mutlak yoludur.
 * Kurulum kökü belge kökünün içindeyse dosya uygulamayı yüklemez.
 */
declare(strict_types=1);

if (PHP_SAPI === 'cli') {
	fwrite(STDERR, "Bu dosya belge kökü girişidir.\n");
	exit(1);
}

$home = getenv('QR_LICENSE_HOME');
$docroot = isset($_SERVER['DOCUMENT_ROOT']) ? (string) $_SERVER['DOCUMENT_ROOT'] : '';
if (!is_string($home) || $home === '' || $home[0] !== '/' || str_contains($home, "\0") || $docroot === '') {
	refuseFront();
}

$realHome = realpath($home);
$realDoc = realpath($docroot);
$realEntry = realpath($home . '/backend/public/index.php');
if ($realHome === false || $realDoc === false || $realEntry === false) {
	refuseFront();
}

$docPrefix = rtrim($realDoc, '/') . '/';
$homeInside = $realHome === $realDoc || str_starts_with($realHome, $docPrefix);
$entryInside = $realEntry === $realDoc || str_starts_with($realEntry, $docPrefix);
$entryInHome = str_starts_with($realEntry, rtrim($realHome, '/') . '/backend/public/index.php');
if ($homeInside || $entryInside || !$entryInHome) {
	refuseFront();
}

$base = getenv('QR_LICENSE_BASE');
if (is_string($base) && $base !== '') {
	if (preg_match('#^/[A-Za-z0-9._/-]+$#', $base) !== 1 || str_contains($base, '..') || str_ends_with($base, '/')) {
		refuseFront();
	}
	$uri = isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '/';
	$path = parse_url($uri, PHP_URL_PATH);
	$query = parse_url($uri, PHP_URL_QUERY);
	if (!is_string($path) || ($path !== $base && !str_starts_with($path, $base . '/'))) {
		refuseFront();
	}
	$rest = substr($path, strlen($base));
	if ($rest === '' || $rest === false) {
		$rest = '/';
	}
	$_SERVER['REQUEST_URI'] = $rest . (is_string($query) && $query !== '' ? '?' . $query : '');
}

require $realEntry;

function refuseFront(): void
{
	http_response_code(500);
	header('Content-Type: application/json; charset=utf-8');
	header('X-Content-Type-Options: nosniff');
	header('Cache-Control: no-store');
	echo '{"status":"error","error":"server_error"}';
	exit;
}
