#!/usr/bin/env bash
# Merge the rebased VPS builder commit with GitHub, then build and publish.
set -Eeuo pipefail
umask 077
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
app_dir=/root/Chalapathiii-university-
web_dir=/var/www/chalapathi
cd "$app_dir"
target="$(git rev-parse "${1:-origin/feature/visual-page-builder}")"
test -f "$script_dir/resolve-vps-media-merge.py"
test -f "$script_dir/pg-backup.cjs"
export MEDIA_STORAGE_BACKUP_HELPER="$script_dir/pg-backup.cjs"
test -f "$web_dir/index.html"
test -z "$(git diff --name-only --diff-filter=U)"
if git rev-parse --verify MERGE_HEAD >/dev/null 2>&1; then
  echo "An existing Git merge must be finished or aborted first. No changes made."
  exit 1
fi
if [ -s /root/.nvm/nvm.sh ]; then
  set +u
  . /root/.nvm/nvm.sh
  nvm use 22
  set -u
fi
node -e 'if (+process.versions.node.split(".")[0] < 22) throw new Error("Use Node 22+ for the existing API.")'
for command in python3 pg_dump pm2; do
  command -v "$command" >/dev/null || { echo "Missing prerequisite: $command. No changes made."; exit 1; }
done
git cat-file -e "$target:src/components/admin/MediaStorage.tsx"

# Only the generated lock/build files and the already-verified tab hotfix may be
# stashed automatically. Unknown source edits require inspection before merging.
python3 - <<'PY'
from pathlib import Path
import re, subprocess
status = subprocess.check_output(['git', 'status', '--porcelain', '-z']).decode().split('\0')
for row in filter(None, status):
    code, name = row[:2], row[3:]
    if 'R' in code or 'C' in code:
        raise SystemExit('STOP: renamed/copied local files need review before deployment.')
    if name.startswith('dist/') or name in ('package-lock.json', 'server/package-lock.json'):
        continue
    if name == 'src/components/admin/SecurityCMS.tsx':
        previous = subprocess.check_output(['git', 'show', 'HEAD:' + name]).decode().replace('\r\n', '\n')
        current = Path(name).read_text(encoding='utf-8').replace('\r\n', '\n')
        pattern = r'const selectTab = \(id: string\) => \{[^\r\n]*\};'
        replacement = 'const selectTab = (id: string) => { if (id === tab) return; setData(null); setLoading(true); setTab(id); setPage(1); setSearch(""); setFilter(""); setHistoryUser(""); setError(""); };'
        if len(re.findall(pattern, previous)) == 1 and re.sub(pattern, replacement, previous) == current:
            continue
    raise SystemExit('STOP: additional local edit needs review: ' + name)
print('Verified local edits: build outputs, lockfiles and the existing tab hotfix.')
PY

backup_dir="$(mktemp -d /root/media-storage-merge-backup.XXXXXX)"
export MEDIA_STORAGE_BACKUP_DIR="$backup_dir"
before_head="$(git rev-parse HEAD)"
git branch "backup/vps-before-media-$(basename "$backup_dir")" "$before_head"
git status --short --branch > "$backup_dir/git-status.txt"
git diff --binary HEAD > "$backup_dir/local-edits.patch"
cp "$web_dir/index.html" "$backup_dir/index.html"
for item in src server/src server/prisma scripts package.json package-lock.json server/package.json server/package-lock.json server/ecosystem.config.js server/start.cjs server/dist; do
  if [ -e "$item" ]; then printf '%s\n' "$item" >> "$backup_dir/release-list.txt"; fi
done
tar -czf "$backup_dir/source-api.tar.gz" -T "$backup_dir/release-list.txt"
cd server
node <<'NODE'
require('dotenv').config({ quiet: true });
const path = require('path');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing; stopped before merge.');
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)
  throw new Error('Keep/configure the existing strong SESSION_SECRET before deploying. No source was changed.');
if (Buffer.from(process.env.ADMIN_TOTP_ENCRYPTION_KEY || '', 'base64').length !== 32)
  throw new Error('Keep/configure the existing Authenticator encryption key before deploying. Do not rotate enrolled users\' key.');
require(process.env.MEDIA_STORAGE_BACKUP_HELPER).backupDatabase(process.env.DATABASE_URL,
  path.join(process.env.MEDIA_STORAGE_BACKUP_DIR, 'database.dump'));
NODE
cd "$app_dir"
echo "Backup: $backup_dir"
if [ -n "$(git status --porcelain)" ]; then
  git stash push --include-untracked -m "vps-before-media-$(basename "$backup_dir")"
  git rev-parse refs/stash > "$backup_dir/stash-id.txt"
fi

# Keep the VPS commit in history. Only proven, clean source merges are accepted.
if ! git merge --no-commit --no-ff "$target"; then
  if [ -z "$(git diff --name-only --diff-filter=U)" ]; then
    echo "Merge could not start. Live services are unchanged. Backup: $backup_dir"
    exit 1
  fi
  if ! python3 "$script_dir/resolve-vps-media-merge.py" --target "$target" --apply --backup-dir "$backup_dir"; then
    git merge --abort
    echo "Merge aborted. Local edits remain in the retained stash. Live services are unchanged. Backup: $backup_dir"
    exit 1
  fi
fi
test -z "$(git diff --name-only --diff-filter=U)"

api_restarted=0
failed() {
  trap - ERR
  echo "Deployment stopped. Backup: $backup_dir"
  if [ "$api_restarted" = 1 ]; then
    tar -xzf "$backup_dir/source-api.tar.gz" -C "$app_dir"
    pm2 restart chalapathi-api --update-env || true
    install -m 0644 "$backup_dir/index.html" "$web_dir/index.html.rollback"
    mv "$web_dir/index.html.rollback" "$web_dir/index.html"
    echo "Previous API release and frontend entry point restored. Uploaded files and additive tables retained."
  else
    echo "Live services have not been restarted or published. The saved VPS commit and stash remain recoverable."
  fi
  exit 1
}
trap failed ERR
cd server
./node_modules/.bin/prisma generate
npm run build
cd "$app_dir"
./node_modules/.bin/tsc
./node_modules/.bin/vite build
cd server
./node_modules/.bin/prisma migrate deploy
cd "$app_dir"
if git rev-parse --verify MERGE_HEAD >/dev/null 2>&1; then
  git commit -m "Merge Media Storage update while preserving VPS builder changes"
fi
api_restarted=1
pm2 restart chalapathi-api --update-env
curl -fsS --retry 6 --retry-connrefused --retry-delay 2 --max-time 10 \
  -H 'X-Forwarded-Proto: https' http://127.0.0.1:5004/api/health
media_status="$(curl -sS --max-time 10 -o /dev/null -w '%{http_code}' -H 'X-Forwarded-Proto: https' http://127.0.0.1:5004/api/media)"
test "$media_status" = 401
cd server
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
printf '\nMedia Storage deployed. Reload /admin with Ctrl+Shift+R.\nVPS commit and local-edit stash preserved. Backup: %s\n' "$backup_dir"
