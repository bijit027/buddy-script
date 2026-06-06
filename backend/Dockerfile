FROM php:8.3-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip \
    libpng-dev libjpeg-dev libfreetype6-dev \
    libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd pdo_mysql zip pcntl \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Install dependencies first (better caching)
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-scripts

# Copy project files
COPY . .

# Optimize autoload
RUN composer dump-autoload --optimize

# Fix storage permissions
RUN mkdir -p storage/framework/{sessions,views,cache} \
    storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Create storage link for serving uploaded files
RUN php artisan storage:link

# Expose port
EXPOSE 8080

# 🚀 IMPORTANT FIX: use real PHP server (NOT artisan serve)
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8080} -t public"]