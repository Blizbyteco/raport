#!/bin/sh
set -e

cd /var/www/html

echo "[entrypoint] Waiting for database..."
php -r '
$dsn = sprintf(
    "mysql:host=%s;port=%s;dbname=%s",
    getenv("DB_HOST") ?: "127.0.0.1",
    getenv("DB_PORT") ?: "3306",
    getenv("DB_DATABASE") ?: "api"
);
for ($i = 0; $i < 60; $i++) {
    try {
        new PDO($dsn, getenv("DB_USERNAME") ?: "root", getenv("DB_PASSWORD") ?: "", [
            PDO::ATTR_TIMEOUT => 3,
        ]);
        echo "[entrypoint] Database is ready.\n";
        exit(0);
    } catch (Exception $e) {
        sleep(2);
    }
}
fwrite(STDERR, "[entrypoint] Database is not reachable.\n");
exit(1);
'

if [ -z "$APP_KEY" ]; then
    unset APP_KEY
    if grep -qE '^APP_KEY=.+' .env 2>/dev/null; then
        echo "[entrypoint] Using APP_KEY from .env"
    else
        echo "[entrypoint] APP_KEY not set, generating one..."
        php artisan key:generate --force
    fi
fi

echo "[entrypoint] Running migrations..."
php artisan migrate --force

echo "[entrypoint] Applying seeders (skipped when already seeded)..."
php artisan db:seed-if-empty

echo "[entrypoint] Starting php-fpm..."
exec php-fpm
