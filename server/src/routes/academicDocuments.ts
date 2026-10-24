import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { z } from "zod";
import prisma from "../prisma";
import { uploadsDirectory } from "../middleware/upload";
import { requireAuth } from "../middleware/auth";

const router = Router();
const handler = (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => { Promise.resolve(fn(req, res)).catch(next); };
const prefix = "__academic_document:";
const staging = path.join(uploadsDirectory, ".academic-document-staging");
const metadata = z.object({
  title: z.string().trim().min(1, "Enter a document title.").max(200),
  degree: z.enum(["btech", "mtech"]),
  category: z.enum(["syllabus", "regulations"]),
});
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => { fs.mkdir(staging, { recursive: true }).then(() => callback(null, staging), error => callback(error, staging)); },
    filename: (_req, _file, callback) => callback(null, randomUUID()),
  }),
  limits: { files: 1, fields: 4, fieldSize: 4096 },
  fileFilter: (_req, file, callback) => {
    if (path.extname(file.originalname).toLowerCase() === ".pdf" && ["application/pdf", "application/octet-stream"].includes(file.mimetype)) callback(null, true);
    else callback(Object.assign(new Error("Choose a PDF document."), { status: 400 }));
  },
});
const fail = (status: number, message: string) => Object.assign(new Error(message), { status });
const view = (record: { valueJson: string }) => {
  const document = JSON.parse(record.valueJson);
  return { ...document, url: `/uploads/${document.filename}` };
};
const validId = z.string().uuid();
const clean = async (filename?: string) => { if (filename) await fs.unlink(filename).catch(() => undefined); };

router.get("/", handler(async (req, res) => {
  const filters = metadata.pick({ degree: true, category: true }).partial().safeParse(req.query);
  if (!filters.success) throw fail(400, "Choose a valid degree and document section.");
  const records = await prisma.siteConfig.findMany({ where: { key: { startsWith: prefix } }, orderBy: { id: "desc" } });
  const documents = records.map(view).filter(item => (!filters.data.degree || item.degree === filters.data.degree) && (!filters.data.category || item.category === filters.data.category));
  res.json(documents);
}));

router.use(requireAuth);

router.post("/", upload.single("file"), handler(async (req, res) => {
  let destination: string | undefined;
  try {
    const checked = metadata.safeParse(req.body);
    if (!checked.success) throw fail(400, checked.error.issues[0].message);
    if (!req.file) throw fail(400, "Choose a PDF document to upload.");
    await validatePdf(req.file.path);
    const filename = `academic-${randomUUID()}.pdf`;
    destination = path.join(uploadsDirectory, filename);
    await fs.rename(req.file.path, destination);
    const now = new Date().toISOString();
    const document = { id: randomUUID(), ...checked.data, filename, originalName: path.basename(req.file.originalname), size: req.file.size, createdAt: now, updatedAt: now };
    const record = await prisma.siteConfig.create({ data: { key: prefix + document.id, valueJson: JSON.stringify(document) } });
    destination = undefined;
    res.status(201).json(view(record));
  } finally {
    await clean(req.file?.path);
    await clean(destination);
  }
}));

router.put("/:id", upload.single("file"), handler(async (req, res) => {
  let destination: string | undefined;
  try {
    if (!validId.safeParse(req.params.id).success) throw fail(404, "Document not found.");
    const checked = metadata.safeParse(req.body);
    if (!checked.success) throw fail(400, checked.error.issues[0].message);
    const key = prefix + req.params.id;
    const existing = await prisma.siteConfig.findUnique({ where: { key } });
    if (!existing) throw fail(404, "Document not found. Reload the list.");
    const previous = view(existing);
    const document = { ...previous, ...checked.data, updatedAt: new Date().toISOString() };
    delete document.url;
    if (req.file) {
      await validatePdf(req.file.path);
      document.filename = `academic-${randomUUID()}.pdf`;
      destination = path.join(uploadsDirectory, document.filename);
      await fs.rename(req.file.path, destination);
      document.size = req.file.size;
      document.originalName = path.basename(req.file.originalname);
    }
    const result = await prisma.siteConfig.updateMany({ where: { key, valueJson: existing.valueJson }, data: { valueJson: JSON.stringify(document) } });
    if (!result.count) throw fail(409, "This document changed. Reload the list and try again.");
    destination = undefined;
    if (req.file) await clean(path.join(uploadsDirectory, previous.filename));
    res.json(view({ valueJson: JSON.stringify(document) }));
  } finally {
    await clean(req.file?.path);
    await clean(destination);
  }
}));

router.delete("/:id", handler(async (req, res) => {
  if (!validId.safeParse(req.params.id).success) throw fail(404, "Document not found.");
  const key = prefix + req.params.id;
  const existing = await prisma.siteConfig.findUnique({ where: { key } });
  if (!existing) throw fail(404, "Document not found. Reload the list.");
  const deleted = await prisma.siteConfig.deleteMany({ where: { key, valueJson: existing.valueJson } });
  if (!deleted.count) throw fail(409, "This document changed. Reload the list and try again.");
  await clean(path.join(uploadsDirectory, view(existing).filename));
  res.json({ success: true });
}));

async function validatePdf(filename: string) {
  const file = await fs.open(filename, "r");
  try {
    const header = Buffer.alloc(5);
    await file.read(header, 0, header.length, 0);
    if (header.toString("ascii") !== "%PDF-") throw fail(400, "This file is not a valid PDF document.");
  } finally { await file.close(); }
}

router.use((error: any, _req: any, res: any, _next: any) => {
  const status = error instanceof multer.MulterError ? 400 : error.status || 500;
  res.status(status).json({ error: status === 500 ? "The document could not be saved. Please retry." : error.message });
});

export default router;
