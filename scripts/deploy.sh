#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/eventhub"

echo "==> Deploy EventHub"
cd "$APP_DIR"

echo "==> Git pull"
git fetch origin main
git checkout main
git reset --hard origin/main

echo "==> Backend"
cd back
npm ci --include=dev
npm run build

echo "==> Frontend"
cd ../front
npm ci --include=dev
npm run build

echo "==> PM2"
cd ../back
if pm2 describe eventhub-api >/dev/null 2>&1; then
  pm2 restart eventhub-api
else
  pm2 start dist/index.js --name eventhub-api
fi
pm2 save

echo "==> Nginx"
sudo nginx -t
sudo systemctl reload nginx

echo "==> Deploy terminé"
