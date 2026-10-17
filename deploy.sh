#!/usr/bin/env bash

set -Eeuo pipefail

REPO_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

echo "===================================="
echo " Starting Deployment Process..."
echo "===================================="

echo "[1/5] Syncing the deployment checkout with GitHub..."
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Deployment stopped: the VPS checkout has uncommitted changes."
  echo "Commit or stash those changes, then run this script again."
  exit 1
fi

git fetch origin main
if ! git pull --rebase origin main; then
  echo "Deployment stopped because Git could not rebase the VPS commits onto origin/main."
  echo "Resolve the conflicts, or run 'git rebase --abort' to return to the previous state."
  exit 1
fi

echo "[2/5] Installing & Building Frontend..."
npm install
npm run build
sudo mkdir -p /var/www/chalapathi
sudo rm -rf /var/www/chalapathi/*
sudo cp -r dist/* /var/www/chalapathi/

echo "[3/5] Installing & Setting up Backend..."
cd server
npm install --ignore-scripts
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
