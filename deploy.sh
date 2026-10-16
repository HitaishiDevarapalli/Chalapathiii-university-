#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "===================================="
echo " Starting Deployment Process..."
echo "===================================="

echo "[1/4] Pulling latest code from GitHub..."
git reset --hard HEAD
git pull origin main

echo "[2/4] Installing & Building Frontend..."
npm install
npm run build
sudo mkdir -p /var/www/chalapathi
sudo rm -rf /var/www/chalapathi/*
sudo cp -r dist/* /var/www/chalapathi/

echo "[3/4] Installing & Setting up Backend..."
cd server
npm install
npx prisma generate
npm run build
npx prisma migrate deploy

# Run seed script safely (ignores if it fails on existing data)
npm run prisma:seed || true

echo "[4/5] Restarting Node.js Backend with PM2..."
pm2 restart chalapathi-api --update-env || pm2 reload ecosystem.config.js || pm2 restart all
cd ..

echo "[5/5] Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx || true

echo "===================================="
echo " Deployment Complete! 🚀"
echo "===================================="
