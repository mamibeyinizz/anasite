<?php
/**
 * PDO bağlantısı. Sorgu çalıştırmaz; hazırlanmış ifadeyi çağıran sınıflar kurar.
 */
declare(strict_types=1);

namespace QRLicense\Store;

use PDO;
use PDOException;
use RuntimeException;

final class Database
{
	/**
	 * @param array<string, mixed> $config
	 */
	public static function connect(array $config): PDO
	{
		$db = isset($config['db']) && is_array($config['db']) ? $config['db'] : array();
		$dsn = isset($db['dsn']) ? (string) $db['dsn'] : '';
		$user = isset($db['user']) ? (string) $db['user'] : '';
		$password = isset($db['password']) ? (string) $db['password'] : '';

		if ($dsn === '') {
			throw new RuntimeException('Veritabanı ayarı eksik.');
		}

		try {
			return new PDO(
				$dsn,
				$user,
				$password,
				array(
					PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
					PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
					PDO::ATTR_EMULATE_PREPARES => false,
				)
			);
		} catch (PDOException $e) {
			throw new RuntimeException('Veritabanına bağlanılamadı.', 0, $e);
		}
	}
}
