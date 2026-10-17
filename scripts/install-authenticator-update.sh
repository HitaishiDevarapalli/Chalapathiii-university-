#!/usr/bin/env bash
set -euo pipefail

bundle_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
app_dir=/root/Chalapathiii-university-
web_dir=/var/www/chalapathi
payload_dir="$bundle_dir/payload"
test -d "$app_dir/server/node_modules"
test -f "$app_dir/server/ecosystem.config.js"
test -f "$payload_dir/dist/index.html"

# nvm reads optional variables that may be unset in a noninteractive shell.
set +u
. /root/.nvm/nvm.sh
nvm use 22
set -u
cd "$app_dir/server"
node <<'NODE'
require('dotenv').config({ quiet: true });
if (Buffer.from(process.env.ADMIN_TOTP_ENCRYPTION_KEY || '', 'base64').length !== 32)
  throw new Error('Keep or configure a valid existing ADMIN_TOTP_ENCRYPTION_KEY before installing.');
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)
  throw new Error('A SESSION_SECRET of at least 32 characters is required before installing.');
const argon2 = require('argon2');
argon2.hash('installer-native-check-only').then(hash => argon2.verify(hash, 'installer-native-check-only'))
  .then(ok => { if (!ok) throw new Error('Native password check failed'); })
  .catch(() => { console.error('Native password dependency is unavailable; stopped before installing.'); process.exitCode = 1; });
NODE

backup_dir="$(mktemp -d /root/chalapathi-authenticator-backup.XXXXXX)"
mkdir -p "$backup_dir/server" "$backup_dir/src" "$backup_dir/web"
for item in dist src ecosystem.config.js start.cjs scripts prisma/seed.ts; do
  if [ -e "$app_dir/server/$item" ]; then
    mkdir -p "$backup_dir/server/$(dirname "$item")"
    cp -a "$app_dir/server/$item" "$backup_dir/server/$item"
  fi
done
for item in components/admin/AdminLoginSteps.tsx components/admin/SecurityCMS.tsx context/DataContext.tsx pages/AdminPortal.tsx security/adminAccess.tsx; do
  mkdir -p "$backup_dir/src/$(dirname "$item")"
  cp -a "$app_dir/src/$item" "$backup_dir/src/$item"
done
cp -a "$web_dir/index.html" "$backup_dir/web/index.html"
echo "Previous files saved in $backup_dir"

cp -a "$payload_dir/server/." "$app_dir/server/"
cp -a "$payload_dir/src/." "$app_dir/src/"
node <<'NODE'
const fs = require('fs');
const config = require('./ecosystem.config.js');
const api = config.apps.find(app => app.name === 'chalapathi-api');
if (!api) throw new Error('chalapathi-api PM2 configuration not found');
api.cwd = process.cwd();
api.script = 'start.cjs';
api.interpreter = process.execPath;
api.env = { ...api.env, NODE_ENV: 'production', PORT: 5004 };
fs.writeFileSync('ecosystem.config.js', 'module.exports = ' + JSON.stringify(config, null, 2) + ';\n');
NODE
PORT=5004 NODE_ENV=production pm2 startOrRestart ecosystem.config.js --only chalapathi-api --update-env
if ! curl -fsS --retry 6 --retry-connrefused --retry-delay 2 --connect-timeout 5 --max-time 10 \
  -H 'X-Forwarded-Proto: https' http://127.0.0.1:5004/api/health; then
  echo "API check failed. Restoring the previous backend files."
  cp -a "$backup_dir/server/." "$app_dir/server/"
  pm2 startOrRestart ecosystem.config.js --only chalapathi-api --update-env
  exit 1
fi
node scripts/configure-authenticator.cjs --all-accounts

mkdir -p "$web_dir/assets"
cp -a "$payload_dir/dist/assets/." "$web_dir/assets/"
cp "$payload_dir/dist/index.html" "$web_dir/index.html.new"
mv "$web_dir/index.html.new" "$web_dir/index.html"
pm2 save
curl -fsS --connect-timeout 5 --max-time 15 https://chalapathiuniversity.edu.in/api/health
printf '\nAuthenticator update complete. Reload /admin and sign in again.\n'
