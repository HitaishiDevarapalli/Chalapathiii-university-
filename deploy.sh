#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "===================================="
echo " Starting Deployment Process..."
echo "===================================="

echo "[1/4] Pulling latest code from GitHub..."
git pull

echo "[2/4] Installing & Building Frontend..."
npm install
npm run build
sudo rm -rf /var/www/chalapathi
sudo cp -r dist /var/www/chalapathi

echo "[3/4] Installing & Setting up Backend..."
cd server
npm install
npx prisma generate
npx prisma migrate deploy

# Run seed script safely (ignores if it fails on existing data)
npm run prisma:seed || true

echo "[4/4] Restarting Node.js Backend with PM2..."
pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js

echo "===================================="
echo " Deployment Complete! 🚀"
echo "===================================="
