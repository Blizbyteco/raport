# syntax=docker/dockerfile:1

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-scripts \
    --no-autoloader \
    --prefer-dist
COPY . .
RUN composer dump-autoload --optimize --no-dev

FROM php:8.3-fpm-bookworm AS runtime

RUN apt-get update && apt-get install -y --no-install-recommends \
        libzip-dev \
        libpng-dev \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libonig-dev \
        libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && for ext in pdo_mysql mbstring gd zip bcmath intl exif opcache pcntl; do \
           if php -m | grep -qi "$ext"; then \
               echo "ext $ext already available"; \
           else \
               echo "installing ext $ext"; \
               docker-php-ext-install -j"$(nproc)" "$ext"; \
           fi; \
       done \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --from=vendor /app/vendor ./vendor
COPY . .
COPY .env.example .env

RUN php artisan package:discover --ansi

RUN mkdir -p bootstrap/cache storage/framework/{cache/data,sessions,views} storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache

RUN { \
        echo 'upload_max_filesize=20M'; \
        echo 'post_max_size=25M'; \
        echo 'memory_limit=256M'; \
    } > /usr/local/etc/php/conf.d/app.ini

COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["entrypoint.sh"]
