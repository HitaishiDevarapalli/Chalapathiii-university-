CREATE TABLE "code_documents" (
  "pageId" TEXT PRIMARY KEY REFERENCES "cms_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "draftJson" TEXT NOT NULL,
  "stage" TEXT NOT NULL DEFAULT 'UPLOADED',
  "liveRoute" TEXT UNIQUE,
  "publishedVersionId" TEXT UNIQUE,
  "createdBy" INTEGER NOT NULL,
  "updatedBy" INTEGER NOT NULL,
  "uploadedBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "publishedAt" TIMESTAMP(3)
);
CREATE INDEX "code_documents_updatedAt_idx" ON "code_documents"("updatedAt");
CREATE TABLE "code_versions" (
  "id" TEXT PRIMARY KEY,
  "pageId" TEXT NOT NULL REFERENCES "code_documents"("pageId") ON DELETE CASCADE ON UPDATE CASCADE,
  "revision" INTEGER NOT NULL,
  "kind" TEXT NOT NULL,
  "previousVersionId" TEXT,
  "snapshotJson" TEXT NOT NULL,
  "author" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "code_versions_pageId_createdAt_idx" ON "code_versions"("pageId", "createdAt");
CREATE TABLE "code_previews" (
  "tokenHash" TEXT PRIMARY KEY,
  "pageId" TEXT NOT NULL REFERENCES "code_documents"("pageId") ON DELETE CASCADE ON UPDATE CASCADE,
  "revision" INTEGER NOT NULL,
  "adminId" INTEGER NOT NULL,
  "snapshotJson" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "renderedAt" TIMESTAMP(3)
);
CREATE INDEX "code_previews_expiresAt_idx" ON "code_previews"("expiresAt");
