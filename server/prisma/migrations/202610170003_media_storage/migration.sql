CREATE TABLE "media_folders" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "parent_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "media_folders_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "media_folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "media_folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "media_folders_parent_id_idx" ON "media_folders"("parent_id");
CREATE UNIQUE INDEX "media_folders_sibling_name" ON "media_folders" (COALESCE("parent_id", ''), LOWER("name"));
ALTER TABLE "builder_media" ADD COLUMN "folder_id" TEXT;
CREATE INDEX "builder_media_folder_id_createdAt_idx" ON "builder_media"("folder_id", "createdAt");
ALTER TABLE "builder_media" ADD CONSTRAINT "builder_media_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "media_folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
