# Visual Page Builder implementation

## Inspected architecture

The deployed client is React 19 + Vite + React Router, not the unused Next app directory. Content Studio uses `src/styles/admin.css`, `AdminWorkspace`, and `AdminAccessContext`. The Express API uses Prisma 5/PostgreSQL (`server/prisma`), database-backed sessions, CSRF tokens, granular `pages.*` permissions, and security audit events. Vercel forwards `/api` and `/uploads` to the university VPS. Docker persists uploads through the existing mounted uploads directory.

## Additive implementation

1. Reuse `CmsPage` as page identity and the published snapshot, and `CmsPageVersion` for immutable server-authored snapshots. Add draft documents, navigation entries, redirects, and media metadata as related tables. No existing data is migrated or replaced.
2. Add `/api/page-builder` routes with explicit existing session/CSRF/permission checks. Restrict new URLs to the unused `/pages/<slug>` namespace and protect visual pages from legacy CMS writes. Use optimistic versions and database transactions for saves, publication, restore, archive, and navigation.
3. Add a Page Builder tab to the existing portal. Use dnd-kit for insertion and nested movement, a controlled renderer, contextual properties, responsive previews, resizing, history, revision restoration, and server-backed media.
4. Add an explicit public route and merge builder navigation into the existing header without writing over menu configuration. Add a homepage extension slot after existing content. Published snapshots remain unchanged during draft saves.
5. Verify against isolated PostgreSQL with real Prisma and Express routes, run existing security/persistence suites and builds, then attempt the AGENTS.md-required Vercel deployment. Production backend migration/restart requires existing authorized VPS access and is reported separately.

## Constraints and risks

Existing uncommitted security work is preserved. New storage uses the existing persistent uploads volume, which must remain backed up alongside PostgreSQL. Scheduling is omitted because no scheduler exists. Existing navigation supports top-level menu parents; deeper nesting is not introduced. The renderer uses escaped text and explicit formatting controls rather than accepting raw HTML. New tables must be deployed before opening the new builder. Existing permissions are reused; no authentication policies are weakened.
