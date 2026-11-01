#!/usr/bin/env bash
# One-time setup for a fresh Hostinger VPS running Ubuntu 22.04 / 24.04.
# Run as root:  bash setup-vps.sh
set -euo pipefail

echo "==> System packages"
apt-get update
apt-get install -y curl git nginx postgresql postgresql-contrib ufw certbot python3-certbot-nginx

echo "==> Node.js 22 LTS"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
npm install -g pm2

echo "==> Firewall"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "==> PostgreSQL database"
DB_PASS=$(openssl rand -hex 16)
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
CREATE USER newcoupon WITH PASSWORD '${DB_PASS}';
CREATE DATABASE newcoupon OWNER newcoupon;
SQL

mkdir -p /var/www/new-coupon-uploads

echo
echo "Done. Save this database URL in /var/www/new-coupon/.env:"
echo "DATABASE_URL=\"postgresql://newcoupon:${DB_PASS}@localhost:5432/newcoupon?schema=public\""
echo "DATABASE_URL_UNPOOLED=\"postgresql://newcoupon:${DB_PASS}@localhost:5432/newcoupon?schema=public\""
