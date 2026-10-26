# Code-Based Page Builder

Open **Admin Portal → Page Builder → Code-Based Page Builder**. The Visual Page Builder remains available, and switching builders preserves the open workspace.

## Workflow

1. Create a page and upload a ZIP containing `index.html`, styles, scripts and assets. A single enclosing folder is removed automatically. If the archive has exactly one HTML file, that file can be the entry point instead. All source files must use UTF-8.
2. Inspect source and validation results. Text files use an editable, keyboard-accessible source editor; binary assets are listed with size and integrity digest. Save changes as a draft. A replacement ZIP also creates a draft version.
3. Configure the route, placement, shared/standalone layout and SEO fields. The social-sharing image is optional: leave it blank, choose a PNG/JPEG/WebP/GIF/AVIF image from the ZIP, enter an HTTPS image URL, or use a website image path such as `/uploads/banner.webp`. ZIP images are mapped to their published asset URLs automatically. Main menu entries, existing submenus and footer sections use the existing `BuilderNavigation` registry. Replacement and homepage overrides leave the original CMS record or application component intact.
4. Preview the saved revision in desktop, tablet and mobile sizes. Preview links expire after 15 minutes. Missing asset references block approval. Rendering errors appear in the diagnostics panel when the browser can report them.
5. Approve the preview, review the publishing summary and confirm publication. Replacing a page or homepage additionally requires typing the destination path.
6. Source/configuration changes after publishing stay in draft. Version history compares file contents and hashes, restores drafts, or rolls back a previously published release with its original placement. Unpublishing removes the override and menu entry, revealing the original destination.

Saving configuration invalidates approval; preview and approve the saved revision again. Publication and rollback reject stale revisions, conflicting routes and missing/corrupt stored assets. Concurrent publication is protected by a serializable database transaction and a unique live-route constraint.

## Architecture and isolation

This application is a React/Vite SPA with an Express API and the existing Prisma/PostgreSQL database. `CmsPage` remains the shared page identity/public registry. Additive `CodeDocument`, `CodeVersion` and `CodePreview` models hold authoritative draft state, source, asset manifests, immutable releases and expiring preview snapshots. Each publication records its previous release ID. Full source never appears in public CMS JSON.

Text sources are stored in database snapshots. Binary assets use SHA-256 content-addressed files in **`CODE_PAGE_ASSETS_DIR`**, defaulting to `code-page-assets` beside the existing uploads directory. This directory must be durable, writable by the API user, included in backups, and outside the public uploads directory. The API refuses a configuration that places it inside public uploads. Back up the database and assets together. Deleted drafts can leave unreferenced content-addressed assets; retain these until an operator performs reference-aware cleanup, including all version and unexpired preview records.

The SPA checks `/api/code-pages/resolve?route=…` before rendering a public route, including the homepage and existing static routes. A code page renders in an iframe with **only `sandbox="allow-scripts"`**. API-rendered HTML also carries a mandatory CSP `sandbox allow-scripts` response header, including when opened directly. Never add `allow-same-origin`. Uploaded code has no portal DOM, storage or credential access. CSP allows only this package's content URL prefix for scripts, styles, images, fonts, media and local data requests. Forms, workers, nested frames, popups and privileged API/external network requests are blocked. External dependencies should be included in the ZIP; CDN references produce warnings and are blocked. Browser modules use CORS-enabled package responses. The portal accepts bounded diagnostics/height messages only from the expected iframe window and channel.

HTML is parsed and serialized with parse5. Existing base tags, meta http-equiv directives and duplicate configured SEO tags are removed. Root-relative HTML/CSS resource URLs are resolved against the package; normal relative paths keep their directory structure. JavaScript-generated URLs should be relative to the packaged page (for example `fetch('./data.json')`), rather than root-relative privileged API URLs. CSS remains inside the iframe, so it cannot affect the portal or shared layout.

Published HTML/asset URLs are immutable for the life of a publication. Previous published releases remain retrievable while the page is live so requests started before a release switch can finish loading their assets. Unpublishing revokes every public release; draft/restored versions are never served publicly. Preview tokens are random, stored hashed, tied to a revision and requesting administrator, scoped to content reads, and expire after 15 minutes.

Published parent routes receive configured SEO metadata through the existing React Helmet stack. Content and preview endpoints use `X-Robots-Tag: noindex`; previews additionally inject noindex metadata. `/api/code-pages/sitemap.xml` lists current, indexable, sitemap-enabled routes and is declared in `robots.txt`. As with the existing SPA, parent-route metadata is applied by JavaScript. Full server-rendered, top-level uploaded HTML would require a separate origin and a hosting/SSR architecture change; never serve arbitrary scripts unsandboxed on the admin origin.

## Permissions and limits

- `pages.view`: list/read source, history and isolated preview.
- `pages.create`: create a draft.
- `pages.edit`: upload, save/validate and restore draft versions.
- `pages.publish`: approve, review summary, publish/unpublish and roll back.
- `pages.delete`: delete an unpublished draft.

All administrative writes use the existing session/CSRF policy. The legacy CMS and page endpoints reject code-page mutations. Audit records cover create, upload, edit, preview, approval, publication, restore, rollback, unpublish and delete.

ZIP uploads are capped at 20 MB compressed, 50 MB expanded, 8 MB per file, 2 MB per source file, 500 archive entries and a 200:1 expansion ratio. Absolute/traversing paths, hidden path segments, backslashes, duplicate case-insensitive paths, links, special files, encryption, unsupported types and corrupt CRC/size data are rejected. Type signatures and UTF-8 text are validated before storage. Quotas are 250 pages, 200 saved versions per page, 200 MB cumulative package size per page's history; writes use persistent per-admin rate limits (10 uploads, 40 publication actions, 180 other changes per ten minutes). This feature's limits do not change the existing media/document upload policies.

## Deployment

**Deploy the API and migration before exposing the new frontend.** On the existing API host, from the checked-out project:

```sh
cd server
npm ci
npx prisma generate
npm run build
npx prisma migrate deploy
# Set CODE_PAGE_ASSETS_DIR to a durable private directory if the default is not durable.
pm2 restart chalapathi-api --update-env
```

Then build/deploy the frontend using the existing deployment process. Existing Nginx and Vercel `/api/:path*` proxies already forward the content endpoints, preview files, resolver and sitemap; no per-page rebuild, filesystem HTML extraction, static-host route generation or additional database is required. The production API at the Vercel rewrite destination must contain this release and migration. A frontend-only Vercel deployment cannot install the Express API or migrate PostgreSQL. New paths use the existing SPA fallback.

The repository's `deploy.sh` performs a full VPS update. The code-page migration is additive. Avoid downgrading the API after enabling code-page releases; to return a specific destination to its original behavior, unpublish that code page first.

## API

Public: `GET /api/code-pages/resolve?route=…`, `GET /sitemap.xml`, `GET /content/:pageId/:versionId/*`, `GET /preview/:token/*` under `/api/code-pages`.

Administrative: `GET/POST /`, `GET /destinations`, `GET/PUT/DELETE /:id`, `POST /:id/upload`, `POST /:id/validate`, `POST /:id/preview`, `POST /:id/previewed`, `POST /:id/approve`, `GET /:id/summary`, `POST /:id/publish`, `POST /:id/unpublish`, `GET /:id/versions`, `GET /:id/versions/:versionId`, `POST /:id/restore`, `POST /:id/rollback`. All content-changing requests carry `revision`; upload uses multipart `file` and `revision`. Publication/unpublication/rollback require `confirm: true`; replacement publication/rollback additionally requires `confirmRoute` matching the destination.

## Verification

```sh
npm run build
cd server
npm run test:code-pages
npm run test:code-pages:browser
npm test
npm run test:security
```

Code-page suites run together with the existing Visual Page Builder regression suite against isolated embedded PostgreSQL. The browser suite uses Chrome (`CHROME_PATH` can override its executable), uploads a real ZIP through the UI, edits HTML, configures footer placement, exercises responsive preview and real isolation, publishes a public route, compares versions and unpublishes. Screenshots are saved to `work/code-page-qa/`. Test databases/accounts/assets are isolated from production.
