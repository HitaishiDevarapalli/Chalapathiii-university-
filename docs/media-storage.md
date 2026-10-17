# Media Storage

Open **Admin → Media Storage**. Create folders and subfolders, open a folder, then select **Upload files** or drop several photos into it. Each uploaded file receives its own UUID filename and public `/uploads/...` link. Duplicate original names never replace earlier uploads. **Copy link** copies the complete link; **Details** allows a display-name change, alternative text, and moving a file to another folder. Those changes preserve the URL and all existing page references.

**All files** searches the entire catalog; **Unfiled** contains files uploaded without a folder. Opening a folder scopes search to that folder. Images and PDF documents are filtered on the server before pagination. Only empty folders can be removed. There is no permanent file deletion action, so a photo already used by a page cannot be accidentally broken through this interface.

The existing gallery/moments editor remains under **Gallery & Moments**. It controls public galleries; Media Storage is the reusable asset catalog. Uploads from the common photo fields are registered in the same catalog. The existing page-builder upload endpoint also shares this catalog. Existing inline/base64 or bundled public images remain valid; they are not automatically rewritten.

## Choose a photo in an editor

Every shared photo field offers **Browse Media Storage**, including page sections, galleries, news, events, branding, faculty, and other content editors. The campus gallery and recruiter-logo controls also use the picker. In the visual page builder, use **Browse Media Storage** on image components, **Add images from Media Storage** on galleries, or **Choose a PDF** for downloads. Navigate to a folder, search if needed, and select a thumbnail. The editor receives the same stored URL and alternative text; save/publish that page through its usual workflow.

Supported uploads: JPG, PNG, WebP, GIF and passive PDF documents, up to 10 MB per file. Images are decoded, rotated as needed, reduced to at most 2400 × 2400 pixels without enlarging, and converted to WebP. Batch uploads run one file per request, report partial failures, and keep successful uploads. GIF uploads use their first frame. PDFs with executable actions are rejected. Media links are public for website use; the folder catalog and upload/edit operations require an administrator session.

## Permissions and storage

The existing `gallery` permissions cover Media Storage: `view` for its sidebar section, `create` for uploads/new folders, `edit` for file details and folder names, and `delete` for removing empty folders. Authorized website content readers can browse the picker without receiving upload/edit rights. The API enforces session, CSRF and action permissions independently of UI controls. Changes produce audit events.

Files stay in the existing `UPLOADS_DIR` and are served through the existing `/uploads` path. PostgreSQL stores metadata in `builder_media`; `media_folders` stores the folder hierarchy. Folder IDs are metadata, not filesystem paths. Folder names cannot introduce traversal paths. Both the PostgreSQL database and the uploads directory must be backed up.

## Deploy on the existing VPS

This feature needs a coordinated API, database and frontend deployment; a frontend-only Vercel deployment does not install its VPS API. Preserve the existing environment, encryption key, PM2 configuration, API port 5004, uploaded files and VPS-specific source changes.

1. Back up PostgreSQL with `pg_dump --format=custom`, the existing server/frontend release, and the source files to be updated.
2. Apply the feature source patch or integrate the matching Git changes. The new files must accompany the edited files.
3. From `server/`, run `./node_modules/.bin/prisma migrate deploy` and `./node_modules/.bin/prisma generate`. Migration `202610170003_media_storage` adds one table and one nullable folder column; existing media records and URLs are preserved. It requires the existing visual-page-builder migration.
4. Build the API with `npm run build`, then restart `chalapathi-api` using its current PM2 configuration and Node runtime. Do not change authentication policies or credentials.
5. Build the frontend from the repository root with `./node_modules/.bin/tsc` and `./node_modules/.bin/vite build`. Copy `dist/assets/.` into `/var/www/chalapathi/assets/`, preserving old assets, then atomically replace `/var/www/chalapathi/index.html`.
6. Optionally run `node scripts/index-existing-media.cjs` from `server/` to register historical raster/PDF files in the uploads directory under **Unfiled**. This preserves file bytes and public URLs and is safe to rerun. Bundled `public/` assets and embedded base64 images are not imported.
7. Reload `/admin`, create a folder, upload a photo, copy its URL, reload the page, and select it in both a normal photo field and a visual-builder image component.

Before exposing the new frontend, confirm the new authenticated `/api/media` and `/api/media/folders` endpoints work. To roll back, restore the compatible previous frontend/API release while retaining the additive tables and all uploaded files. Do not drop the folder column or delete uploaded files as a routine rollback.

## Verification

Build the frontend, then run `cd server` and `npm run test:media`. This uses isolated embedded PostgreSQL, temporary uploads and temporary accounts. It verifies folder hierarchy and sibling-name uniqueness, upload decoding and size/type rejection, unique URLs, public image serving, stable references after moves/renames, search/type filtering before pagination, persistence, session/CSRF/action permissions, and real browser storage/photo-field/page-builder selection flows. Browser screenshots are saved in `work/media-storage-qa/`.
