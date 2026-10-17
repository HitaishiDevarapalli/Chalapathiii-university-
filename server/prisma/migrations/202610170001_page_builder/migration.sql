CREATE TABLE "builder_documents" (
  "pageId" TEXT PRIMARY KEY, "slug" TEXT NOT NULL UNIQUE, "version" INTEGER NOT NULL DEFAULT 1,
  "schemaVersion" INTEGER NOT NULL DEFAULT 1, "draftJson" TEXT NOT NULL,
  "createdBy" INTEGER NOT NULL, "updatedBy" INTEGER NOT NULL, "publishedAt" TIMESTAMP(3), "archivedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "builder_documents_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "cms_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "builder_documents_updatedAt_idx" ON "builder_documents"("updatedAt");
CREATE TABLE "builder_navigation" (
  "id" TEXT PRIMARY KEY, "pageId" TEXT NOT NULL UNIQUE, "label" TEXT NOT NULL, "parentKey" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0, "visible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "builder_navigation_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "cms_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "builder_navigation_parentKey_position_idx" ON "builder_navigation"("parentKey", "position");
CREATE TABLE "builder_redirects" (
  "slug" TEXT PRIMARY KEY, "pageId" TEXT NOT NULL,
  CONSTRAINT "builder_redirects_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "cms_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE "builder_media" (
  "id" TEXT PRIMARY KEY, "originalName" TEXT NOT NULL, "filename" TEXT NOT NULL UNIQUE,
  "mime" TEXT NOT NULL, "size" INTEGER NOT NULL, "width" INTEGER, "height" INTEGER,
  "alt" TEXT NOT NULL DEFAULT '', "uploadedBy" INTEGER NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "builder_media_createdAt_idx" ON "builder_media"("createdAt");
