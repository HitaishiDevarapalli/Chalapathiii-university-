import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import prisma from "../prisma";
import { requireAnyPermission, requirePermission } from "../middleware/auth";
import { audit } from "../security/core";
import { uploadsDirectory } from "../middleware/upload";

const router = Router();
const fail = (status: number, message: string): never => { throw Object.assign(new Error(message), { status }); };
const run = (fn: (req: Request, res: Response) => Promise<unknown>) => (req: Request, res: Response, next: NextFunction) => { void fn(req, res).catch(next); };
export const mediaViewPermissions = ["gallery", "pages", "homepage", "about", "academics", "certifications", "admissions", "research", "directories", "campus-life", "placements", "news", "events", "announcements", "contact", "footer", "settings", "popup"].map(module => `${module}.view`);
export const mediaView = (m: any) => ({ ...m, url: `/uploads/${m.filename}` });
const nameValue = (value: unknown) => {
  if (typeof value !== "string" || !value.trim() || value.trim().length > 200 || /[\x00-\x1f/\\]/.test(value)) fail(400, "Use a name of 1–200 characters without slashes.");
  return (value as string).trim();
};
const folderValue = async (value: unknown) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !await prisma.mediaFolder.findUnique({ where: { id: value } })) fail(404, "Folder not found.");
  return value as string;
};

// URLs depend only on immutable UUID filenames; moving folders never moves files.
export async function storeMedia(req: Request, file: Express.Multer.File, folderId: string | null) {
  let bytes: Buffer, mime: string, extension: string;
  let width: number | undefined, height: number | undefined;
  if (["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.mimetype)) {
    try {
      const image = await sharp(file.buffer, { limitInputPixels: 40_000_000 }).rotate()
        .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 88 }).toBuffer({ resolveWithObject: true });
      bytes = image.data; width = image.info.width; height = image.info.height;
      mime = "image/webp"; extension = "webp";
    } catch { return fail(400, "The image could not be decoded. Choose a valid JPG, PNG, WebP or GIF."); }
  } else if (file.mimetype === "application/pdf" && file.buffer.subarray(0, 5).toString() === "%PDF-" &&
    file.buffer.subarray(-1024).includes(Buffer.from("%%EOF")) && !/\/(JavaScript|JS|Launch|EmbeddedFile|OpenAction|AA)\b/.test(file.buffer.toString("latin1"))) {
    bytes = file.buffer; mime = "application/pdf"; extension = "pdf";
  } else { return fail(400, "Choose a valid JPG, PNG, WebP, GIF or passive PDF document."); }
  const filename = `${randomUUID()}.${extension}`;
  const destination = path.join(uploadsDirectory, filename);
  await fs.writeFile(destination, bytes, { flag: "wx" });
  try {
    const media = await prisma.$transaction(async tx => {
      const asset = await tx.builderMedia.create({ data: { filename, originalName: path.basename(file.originalname).slice(0, 200), mime, size: bytes.length,
        width, height, alt: String(req.body.alt || "").slice(0, 500), uploadedBy: req.adminUser.id, folderId } });
      await audit(req, "media_uploaded", true, "File added to Media Storage", undefined, asset.id, tx);
      return asset;
    });
    return mediaView(media);
  } catch (error) { await fs.unlink(destination).catch(() => {}); throw error; }
}

router.use(requireAnyPermission(mediaViewPermissions));
router.get("/folders", run(async (_req, res) => res.json({ folders: await prisma.mediaFolder.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { files: true, children: true } } } }) })));
router.post("/folders", requirePermission("gallery.create"), run(async (req, res) => {
  const folder = await prisma.mediaFolder.create({ data: { name: nameValue(req.body.name), parentId: await folderValue(req.body.parentId) } });
  await audit(req, "media_folder_created", true, "Media folder created", undefined, folder.id);
  return res.status(201).json(folder);
}));
router.patch("/folders/:id", requirePermission("gallery.edit"), run(async (req, res) => {
  const folder = await prisma.mediaFolder.update({ where: { id: req.params.id }, data: { name: nameValue(req.body.name) } });
  await audit(req, "media_folder_renamed", true, "Media folder renamed", undefined, folder.id);
  return res.json(folder);
}));
router.delete("/folders/:id", requirePermission("gallery.delete"), run(async (req, res) => {
  const folder = await prisma.mediaFolder.findUnique({ where: { id: req.params.id }, include: { _count: { select: { files: true, children: true } } } });
  if (!folder) fail(404, "Folder not found.");
  if (folder!._count.files || folder!._count.children) fail(409, "Move this folder's files and subfolders before removing it.");
  // RESTRICT constraints make this safe even if an upload races with deletion.
  await prisma.mediaFolder.delete({ where: { id: req.params.id } });
  await audit(req, "media_folder_deleted", true, "Empty media folder removed", undefined, req.params.id);
  return res.json({ success: true });
}));
router.get("/", run(async (req, res) => {
  const page = Math.max(1, Math.min(100000, Math.trunc(Number(req.query.page) || 1)));
  const search = String(req.query.search || "").trim().slice(0, 200);
  const folder = req.query.folder;
  const type = req.query.type;
  if (folder && folder !== "all" && folder !== "unfiled") await folderValue(folder);
  const where: any = {
    ...(folder && folder !== "all" ? { folderId: folder === "unfiled" ? null : folder } : {}),
    ...(type === "image" ? { mime: { startsWith: "image/" } } : type === "pdf" ? { mime: "application/pdf" } : {}),
    ...(search ? { OR: [{ originalName: { contains: search, mode: "insensitive" } }, { alt: { contains: search, mode: "insensitive" } }] } : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.builderMedia.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], skip: (page - 1) * 40, take: 40 }),
    prisma.builderMedia.count({ where }),
  ]);
  return res.json({ items: items.map(mediaView), total, page, pageSize: 40 });
}));
const mediaUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 3 } });
router.post("/", requirePermission("gallery.create"), mediaUpload.single("file"), run(async (req, res) => {
  if (!req.file) return fail(400, "Choose a photo or PDF to upload.");
  return res.status(201).json(await storeMedia(req, req.file, await folderValue(req.body.folderId)));
}));
router.patch("/:id", requirePermission("gallery.edit"), run(async (req, res) => {
  const data: any = {};
  if (Object.prototype.hasOwnProperty.call(req.body, "folderId")) data.folderId = await folderValue(req.body.folderId);
  if (Object.prototype.hasOwnProperty.call(req.body, "originalName")) data.originalName = nameValue(req.body.originalName);
  if (Object.prototype.hasOwnProperty.call(req.body, "alt")) {
    if (typeof req.body.alt !== "string" || req.body.alt.length > 500) fail(400, "Alternative text may contain up to 500 characters.");
    data.alt = req.body.alt;
  }
  if (!Object.keys(data).length) fail(400, "Choose a name, alternative text or destination folder.");
  const asset = await prisma.builderMedia.update({ where: { id: req.params.id }, data });
  await audit(req, "media_updated", true, "Media details or folder updated; public URL preserved", undefined, asset.id);
  return res.json(mediaView(asset));
}));
router.delete("/:id", requirePermission("gallery.delete"), run(async (req, res) => {
  let staged: { original: string; directory: string; file: string } | undefined;
  try {
    await prisma.$transaction(async tx => {
      // Deleting first locks the row: concurrent requests cannot remove the same file.
      const asset = await tx.builderMedia.delete({ where: { id: req.params.id } });
      if (asset.filename.startsWith(".") || /[/\\]/.test(asset.filename) || path.basename(asset.filename) !== asset.filename)
        fail(409, "This file has an invalid storage path. Contact the administrator.");
      const original = path.join(uploadsDirectory, asset.filename);
      const stat = await fs.lstat(original).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") throw error;
        return null;
      });
      if (stat && !stat.isFile()) fail(409, "The stored asset is not a regular file. Contact the administrator.");
      await audit(req, "media_deleted", true, "Media record permanently deleted and stored file removed", undefined, asset.id, tx);
      if (stat) {
        // Dot directories are not publicly served or imported by the media indexer.
        const directory = await fs.mkdtemp(path.join(uploadsDirectory, ".media-delete-"));
        const file = path.join(directory, "asset");
        try { await fs.rename(original, file); }
        catch (error) { await fs.rmdir(directory).catch(() => {}); throw error; }
        staged = { original, directory, file };
      }
    });
  } catch (error) {
    // Restore the original URL if the database transaction could not commit.
    if (staged) {
      await fs.rename(staged.file, staged.original);
      await fs.rmdir(staged.directory).catch(() => {});
    }
    throw error;
  }
  if (staged) {
    try { await fs.unlink(staged.file); await fs.rmdir(staged.directory); }
    catch (error) {
      console.error("Media deletion committed; private file cleanup failed", req.params.id, error);
      return res.json({ success: true, warning: "The database record and public file were removed. Private storage cleanup failed; contact the server administrator." });
    }
  }
  return res.json({ success: true });
}));
router.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const relationConflict = ["P2003", "P2014"].includes(error.code);
  const status = error.code === "P2002" ? 409 : error.code === "P2025" ? 404 : relationConflict ? 409 : error.code === "LIMIT_FILE_SIZE" ? 413 : error instanceof multer.MulterError ? 400 : error.status || 500;
  const message = error.code === "P2002" ? "A folder with that name already exists here." : error.code === "P2025" ? "The file or folder no longer exists." : relationConflict ? "This folder is not empty or its destination no longer exists. Refresh and retry." : error.code === "LIMIT_FILE_SIZE" ? "Each file must be 10 MB or smaller." : status < 500 ? error.message : "Media Storage is unavailable. Please retry.";
  return res.status(status).json({ error: message });
});
export default router;
