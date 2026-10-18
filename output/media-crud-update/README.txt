Media Storage CRUD update for the existing Hostinger VPS

Adds visible Edit and Delete controls. Confirmed deletion removes the media
database record and its stored file. Pages using that link will lose the file.
Existing uploads and page content are not bulk-deleted by this installer.

Upload media-crud-update.tar.gz into /root on the VPS, then run:

cd /root
tar -xzf media-crud-update.tar.gz
bash /root/media-crud-update/install.sh

The installer expects /root/Chalapathiii-university- and the existing PM2 process
chalapathi-api on port 5004. It verifies the source patch, backs up PostgreSQL
and the affected release files, builds the API/frontend, checks API health,
and publishes frontend assets with Nginx-readable permissions. No database
schema migration is required. Existing credentials and authentication policies
are preserved. On failure after restarting the API, the previous release is
restored. The printed backup directory is retained.

If source verification fails, stop and inspect the differences; do not force
the patch or reset the VPS checkout. No changes are made before verification.

After installation, press Ctrl+Shift+R on /admin. Open Media Storage. Upload a
temporary test photo, edit its name/alt text, reload, and use Delete. Cancel
keeps it; Delete permanently removes its database row and public file. Only
users with gallery.delete permission can delete files.

If the server reports a private storage cleanup warning, inspect its log and
the .media-delete-* directory in UPLOADS_DIR. Previously cached copies may
remain in browsers/CDNs until their cache expires.

Verified locally: frontend TypeScript/Vite build, API TypeScript build,
isolated PostgreSQL CRUD/permission/CSRF/failure-recovery tests, Chrome UI
upload/edit/cancel/delete/reload tests, mobile layout, and installer Bash syntax.
