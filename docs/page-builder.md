# Visual Page Builder

The builder is an additive extension of Content Studio. Open **Admin → Page Builder**. Existing Website Pages and all other CMS modules remain available.

Placement changes take effect only after publication. In Page Settings, choose the destination (for example **About Us**), leave automatic placement enabled, then use **Save & publish** (or **Save & update live page**) and confirm. **Done** closes settings without publishing. The new link belongs to the selected parent menu; choosing About Us does not add it under News & Events.

Revision dialogs keep feedback inside the dialog and isolate editor shortcuts. Saved-state comparison ignores JSON object key order while preserving real text, placement and component-order edits. Genuine unsaved edits can be saved or explicitly discarded inside revision history before restoring a revision.

## Edit pages from their website section

After saving a draft's placement, the page appears under its matching Content Studio sidebar section, alongside the existing editors. Navigation pages use their parent section (About Us, Academics, Campus Life, and so on); homepage placements use **Homepage**; top-level navigation pages use **Navigation Links**; standalone pages use **Website Pages**. Archived pages leave these section shortcuts and remain available in the builder's archived list. Hidden or unpublished pages remain editable in the admin sidebar. A draft badge distinguishes pages that are not live.

Click a section's new page entry to open **Page content**. Fill text, tables, FAQs and links in the form, or use **Upload photo / Replace photo** to attach an image directly. Existing alternative text is preserved when replacing a photo. **Choose from media library** reuses an existing image. Uploading through the media dialog now also attaches the uploaded image/PDF to the selected component automatically; incompatible file types are filtered out. Server upload validation and existing media permissions remain in force.

Use **Layout & components** when you need additional blocks, nesting, spacing or design changes. Switching editing modes keeps the same unsaved document; both save to the same database draft. The content editor also offers quick additions for headings, paragraphs, photos and galleries. Empty image blocks have an explicit **Upload or choose photo** action.

**Save draft** updates the section shortcut and keeps public content unchanged. **Publish / Update live page**, followed by confirmation, updates the public page and navigation/homepage placement together. Saving a new parent moves the admin shortcut immediately; the public link moves only when that change is published. Section shortcuts require `pages.view`; their content remains subject to `pages.edit`, `pages.publish` and `gallery.create`. Access to a new page does not grant access to the section's existing CMS tools.

## Implemented behavior

- Server-created drafts and stable component identifiers; library insertion, nested drag-and-drop, move controls, copy/paste, duplication/deletion, undo/redo, width/height resizing, and precise property controls.
- Headings, escaped rich text with bold/italic formatting, plain text, images, galleries, approved video embeds, links/buttons, dividers/spacers, nested sections/containers/columns/grids, tables, cards, calls to action, FAQ, notices, downloads, and snapshot imports of published content.
- Desktop/tablet/mobile canvas modes and per-device appearance overrides. Columns stack on phones unless an explicit mobile column count is set. Content is bounded by its parent; text containers grow to fit their content.
- Server-confirmed draft saves, secure draft/revision preview, explicit publication confirmation, published updates, unpublish, archive/reopen, duplication, and paginated revision restore. Draft saves and restores never alter the published snapshot.
- Standalone URLs, links under the actual existing menu parents, and homepage link/card/content-section placements. Existing static navigation is preserved; position controls order added pages. The homepage extension slot follows the existing content. Deeper submenu editing and scheduling are omitted because the existing infrastructure does not support them.
- New URLs use `/pages/<lowercase-kebab-slug>`, avoiding existing university route families. Old published URLs can redirect to a renamed page; redirect ownership is reserved and redirects stop resolving when the page is unpublished.
- Existing university header/footer and SEO component are reused. SEO and redirects follow the existing client-rendered React Router architecture; this change does not introduce server rendering.

## Database and migration

The existing PostgreSQL database and Prisma 5 backend remain authoritative. No browser storage, mock API, source generation on publish, or additional database is used.

`CmsPage` retains the identity and the public snapshot (`type = visual`). `CmsPageVersion` stores server-authored immutable revision snapshots linked through the existing cascading slug relation. Four additive tables hold:

| Table                | Purpose                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| `builder_documents`  | Private draft JSON, schema version, optimistic version, authors, and publication/archive timestamps |
| `builder_navigation` | One automatic navigation entry per page, menu parent, label, position, visibility                   |
| `builder_redirects`  | Reserved previous URLs linked to stable page identities                                             |
| `builder_media`      | Filename, MIME, dimensions, size, alternative text, uploader and timestamp                          |

Migration: `server/prisma/migrations/202610170001_page_builder/migration.sql`. It creates tables/indexes/foreign keys only. It does not rewrite or delete existing records. Slug uniqueness and version comparisons protect conflicting URLs and concurrent saves; publication updates content, placement, revisions and audit events in one transaction. Revision history is retained indefinitely and paginated; archive does not purge it.

## API

All endpoints are under `/api/page-builder` and use the existing session/CSRF protection. JSON errors use appropriate 400/401/403/404/409/413/429/500 status codes. Public responses are uncached and never return drafts or revision history.

| Method and path                            | Behavior / permission                                                                         |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `GET /public?slug=…`                       | Published snapshot or redirect; 404 for unavailable pages                                     |
| `GET /placements`                          | Published automatic navigation and homepage content                                           |
| `GET /?search=…&status=…&page=…`           | Paginated drafts/page management; `pages.view`                                                |
| `GET /menus`, `GET /links`                 | Existing menu registry and published internal destinations; `pages.view`                      |
| `GET /section-pages?page=…`                | Paginated saved-draft placement/title summaries for admin sidebar shortcuts; `pages.view`     |
| `POST /`                                   | Create draft; `pages.view` + `pages.create`                                                   |
| `GET /:id`                                 | Secure editing and draft preview; `pages.view`                                                |
| `PUT /:id`                                 | Save validated draft with current `version`; `pages.edit`                                     |
| `GET /:id/revisions?page=…`                | Paginated server-authored snapshots; `pages.view`                                             |
| `POST /:id/restore`                        | Restore a page-owned revision to draft; `pages.edit`                                          |
| `POST /:id/duplicate`                      | Independent standalone draft; `pages.create`                                                  |
| `POST /:id/publish`, `POST /:id/unpublish` | Atomic live content and placement operation; `pages.publish`                                  |
| `POST /:id/archive`                        | Remove public access and retain content; `pages.delete`, plus `pages.publish` for a live page |
| `POST /:id/reopen`                         | Restore archived document as a draft; `pages.edit`                                            |
| `GET /media?page=…`                        | Protected, paginated metadata library; `pages.view`                                           |
| `POST /media`                              | Validated image/PDF upload; `pages.view` + `gallery.create`                                   |

All writes require a session-bound CSRF token. Operations on an existing document require its current integer version. Restore also requires `revisionId`. The server determines actor IDs and revision authors; caller-provided identities are not trusted. Legacy page/CMS writes cannot mutate a visual page or occupy its namespace. Bulk legacy synchronization skips visual pages.

## Security and storage

The server validates a strict versioned component schema, unique component IDs, allowed types, bounded dimensions/styles, a maximum of 500 nodes/eight nesting levels/two MB per document, and accessible table structure. HTML is rendered as escaped text. Rich-text formatting uses only controlled React elements. Unsafe schemes and unapproved iframe hosts are rejected. Internal page references are resolved against currently published database records during publication.

Media uses the **existing** `UPLOADS_DIR` and persistent uploads volume. Images are decoded with pixel limits, stripped/re-encoded to WebP, and bounded to 2400 pixels. Uploads are limited to ten MB; SVG and invalid raster content are rejected. PDF signatures and common active-content markers are checked. Files use random server filenames; metadata writes and audit events are transactional and failed writes clean up the new file. As with existing site media, published/uploaded files are publicly served at unguessable `/uploads/` URLs; the metadata library and upload operations require permission. PDFs should come from trusted university administrators; this is not a general document malware scanner.

Administrative edits, media uploads and publication have separate database-backed ten-minute budgets (240/30/60 operations). Page lifecycle, restoration and upload actions use the existing audit log. The existing HTTPS, session, same-origin and anti-framing policies are preserved. Full website draft preview opens a protected top-level `/admin/page-preview/:id` page; it is deliberately not framed, and carries `noindex` metadata.

## Validation

Run from the repository:

```sh
npm run build
cd server
npx prisma generate
npx prisma validate
npm run build
npm test
npm run test:security
npm run test:page-builder
npm run test:page-builder:browser
node tests/page-builder-client-state.cjs
```

The builder suites use real Express routes, Prisma, sessions and isolated embedded PostgreSQL. They never access the live database. Browser tests use the installed Chrome (`CHROME_PATH` can override its path). Build the frontend before browser tests. The suite covers drag-and-drop, properties, tables, media, resizing, undo/redo, saved reload, device layouts, preview, publishing, navigation, SEO, draft/live separation, republish, revisions, unpublish, mobile overflow, authentication, CSRF, permission bypass attempts, malicious schemas/uploads, unique URLs, concurrent updates and restart persistence. Screenshots and its browser report are written under `work/page-builder-qa/`.

The existing persistence suite passed. The existing security suite passed all 22 scenario groups in the working checkout. Frontend/backend builds and Prisma validation passed. The existing lint command cannot start because `eslint.config.mjs` imports `eslint-config-next`, which is absent from the declared dependencies; this unrelated tooling issue is not changed by this feature.

## Deployment and rollback (not executed)

Per the user's instruction, **do not deploy this work**. Source is pushed to a feature branch for review; no production database migration, server restart, Vercel deployment, or publication of real pages is performed.

For a later authorized release, deploy the existing Express backend first: back up PostgreSQL and the uploads volume, install the updated locked dependencies, generate Prisma, run `prisma migrate deploy`, build, and restart through the existing operator process. Verify the authenticated builder API and public placement response before releasing the frontend. Keep the current database, authentication configuration, domain routing and persistent uploads mount. No new secrets or database reset commands are needed.

For application rollback, first unpublish any newly managed pages using the authorized API, then restore the previous application version. Leave the additive tables and uploads in place to preserve work and permit a forward fix. A database rollback after content has been created requires restoring the matching database/media backup; do not drop tables or reset the database as part of normal deployment.

## Files

### VPS stash-conflict recovery

If applying existing VPS edits conflicts in the six integration files, `scripts/resolve-page-builder-vps.py` reads the saved VPS side from Git's stage 3 and reapplies only the builder integration. It validates every required source anchor before writing anything, rejects unexpected conflicts, backs up both the conflicted files and saved VPS versions, marks the verified files resolved, and retains the stash. It does not install dependencies, migrate data or restart a service. Run without arguments for a dry run, or with `--apply` after fetching the script from this feature branch. Four isolated Git-index tests cover recovery, backups, idempotence and failure without mutation; the generated TypeScript and backend API integration also passed validation.

```sh
python3 scripts/resolve-page-builder-vps.py
python3 scripts/resolve-page-builder-vps.py --apply
python3 -m unittest discover -s scripts/tests -p test_page_builder_vps_resolver.py -v
```

For the section editor update on a VPS that used the earlier conflict resolver, use `scripts/update-page-sections-vps.py`. A context-based Git patch can fail because the earlier resolver preserved different parentheses and surrounding sidebar code. This updater checks individual anchors in the current portal, preserves unrelated security code, validates all changes before writing, saves the original portal under `~/chalapathi-backups/section-portal-*`, and supports repeated runs. It updates only `src/pages/AdminPortal.tsx`; fetch/copy the feature-owned builder files and API route, build both applications, and restart/copy through the existing operator workflow afterward. No database migration is required for this update.

```sh
python3 scripts/update-page-sections-vps.py
python3 scripts/update-page-sections-vps.py --apply
python3 -m unittest discover -s scripts/tests -p test_page_sections_vps_updater.py -v
```

New implementation: `src/pageBuilder/{PageBuilder,Renderer,DraftPreview}.tsx`, `model.ts`, `builder.css`; `server/src/pageBuilder/{schema.ts,menus.json}`; `server/src/routes/pageBuilder.ts`; the additive migration; API/browser tests and their runner; this document and the inspection plan.

Integration changes: portal navigation/permission mapping, existing public header/homepage/router, page model relations, protected legacy page/CMS writes, and the existing icon wrapper. Dependencies: `@dnd-kit/core` in the frontend and `sharp` in the backend. Other pre-existing uncommitted security/deployment edits are intentionally excluded from the feature commit.
