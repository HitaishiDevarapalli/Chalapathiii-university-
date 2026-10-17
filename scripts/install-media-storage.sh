#!/usr/bin/env bash
# Run from an extracted media-storage-update bundle on the existing VPS.
set -Eeuo pipefail
umask 077
bundle_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
app_dir=/root/Chalapathiii-university-
web_dir=/var/www/chalapathi
patch_file="$bundle_dir/media-storage.patch"
payload_dir="$bundle_dir/payload"
test -f "$patch_file"
test -f "$bundle_dir/pg-backup.cjs"
export MEDIA_STORAGE_BACKUP_HELPER="$bundle_dir/pg-backup.cjs"
test -d "$payload_dir"
test -f "$web_dir/index.html"
test -f "$app_dir/server/ecosystem.config.js"

if [ -s /root/.nvm/nvm.sh ]; then
  set +u
  . /root/.nvm/nvm.sh
  nvm use 22
  set -u
fi
node -e 'if (+process.versions.node.split(".")[0] < 22) throw new Error("Use the existing Node 22+ API runtime before installing.")'
command -v pg_dump >/dev/null
command -v pm2 >/dev/null
cd "$app_dir"
test -x node_modules/.bin/tsc
test -x node_modules/.bin/vite
test -x server/node_modules/.bin/prisma

apply_patch=0
if git apply --check "$patch_file"; then
  apply_patch=1
elif git apply --reverse --check "$patch_file"; then
  echo "Source patch is already installed. Rebuilding the release."
else
  echo "Stopped before changes: VPS source differs from the expected version. Preserve its customizations and integrate the patch manually."
  exit 1
fi
# New files must not overwrite independently modified VPS files.
while IFS= read -r -d '' source; do
  relative="${source#"$payload_dir/"}"
  if [ -e "$app_dir/$relative" ] && ! cmp -s "$source" "$app_dir/$relative"; then
    echo "Stopped before changes: $relative already exists with different contents."
    exit 1
  fi
done < <(find "$payload_dir" -type f -print0)

backup_dir="$(mktemp -d /root/media-storage-backup.XXXXXX)"
export MEDIA_STORAGE_BACKUP_DIR="$backup_dir"
cd "$app_dir/server"
node <<'NODE'
require('dotenv').config({ quiet: true });
const path = require('path');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing.');
require(process.env.MEDIA_STORAGE_BACKUP_HELPER).backupDatabase(process.env.DATABASE_URL,
  path.join(process.env.MEDIA_STORAGE_BACKUP_DIR, 'database.dump'));
NODE
cd "$app_dir"
git apply --numstat "$patch_file" | cut -f3 > "$backup_dir/source-list.txt"
printf '%s\n' server/dist >> "$backup_dir/source-list.txt"
tar -czf "$backup_dir/source-api.tar.gz" -T "$backup_dir/source-list.txt"
cp "$web_dir/index.html" "$backup_dir/index.html"
echo "Database and release backup: $backup_dir"

api_restarted=0
rollback() {
  trap - ERR
  echo "Install failed. Backup: $backup_dir"
  if [ "$api_restarted" = 1 ]; then
    tar -xzf "$backup_dir/source-api.tar.gz" -C "$app_dir"
    pm2 restart chalapathi-api --update-env || true
    install -m 0644 "$backup_dir/index.html" "$web_dir/index.html.rollback"
    mv "$web_dir/index.html.rollback" "$web_dir/index.html"
    echo "Previous API release and frontend entry point restored. Additive tables and uploads are retained."
  fi
  exit 1
}
trap rollback ERR
if [ "$apply_patch" = 1 ]; then git apply --whitespace=nowarn "$patch_file"; fi
cp -a "$payload_dir/." "$app_dir/"

cd "$app_dir/server"
./node_modules/.bin/prisma migrate deploy
./node_modules/.bin/prisma generate
npm run build
cd "$app_dir"
./node_modules/.bin/tsc
./node_modules/.bin/vite build

api_restarted=1
pm2 restart chalapathi-api --update-env
curl -fsS --retry 6 --retry-connrefused --retry-delay 2 --max-time 10 \
  -H 'X-Forwarded-Proto: https' http://127.0.0.1:5004/api/health
media_status="$(curl -sS --max-time 10 -o /dev/null -w '%{http_code}' -H 'X-Forwarded-Proto: https' http://127.0.0.1:5004/api/media)"
test "$media_status" = 401
cd "$app_dir/server"
node scripts/index-existing-media.cjs

mkdir -p "$web_dir/assets"
cp -a "$app_dir/dist/assets/." "$web_dir/assets/"
# Keep backups private while allowing the Nginx worker to read public assets.
chmod 0755 "$web_dir" "$web_dir/assets"
find "$web_dir/assets" -type d -exec chmod 0755 {} +
find "$web_dir/assets" -type f -exec chmod 0644 {} +
install -m 0644 "$app_dir/dist/index.html" "$web_dir/index.html.new"
mv "$web_dir/index.html.new" "$web_dir/index.html"
trap - ERR
printf '\nMedia Storage deployed. Reload /admin and open Media Storage.\nBackup: %s\n' "$backup_dir"
