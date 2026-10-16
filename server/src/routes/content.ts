import { Router, Request } from "express";
import { createHash } from "crypto";
import prisma from "../prisma";
import { requireAuth } from "../middleware/auth";
import { assertPermission } from "../middleware/auth";

function revision(items: any[]) {
  return createHash("sha256").update(JSON.stringify(items)).digest("hex");
}
function format(row: any) { return { ...row, images: JSON.parse(row.images || "[]") }; }
function failure(status: number, message: string) { return Object.assign(new Error(message), { status }); }
const validId = (id: any) => Number.isInteger(id) && id > 0 && id <= 2147483647;
function imageUrl(value: any) {
  if (typeof value !== "string" || value.length > 2048 || (value && !/^\/(?!\/)|^https?:\/\//.test(value))) {
    throw failure(400, "Images must use uploaded or public HTTP URLs, not browser data");
  }
  return value;
}
function fields(input: any, kind: "news" | "events", partial = false) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw failure(400, "Invalid content");
  const data: any = {};
  const strings = ["title", "slug", "date", "time", "location", "category", "bodyText",
    ...(kind === "news" ? ["excerpt", "sourceUrl", "readTime"] : ["registrationUrl"])];
  for (const key of strings) {
    if (input[key] === undefined) continue;
    if (input[key] === null && ["sourceUrl", "readTime", "registrationUrl"].includes(key)) { data[key] = null; continue; }
    if (typeof input[key] !== "string" || input[key].length > (key === "bodyText" ? 200000 : 4000)) throw failure(400, `Invalid ${key}`);
    data[key] = input[key];
  }
  if (!partial && (!data.title?.trim() || !data.date?.trim())) throw failure(400, "Title and date are required");
  if (data.title !== undefined && !data.title.trim()) throw failure(400, "Title is required");
  if (data.slug !== undefined && !/^[a-zA-Z0-9_-]+$/.test(data.slug)) throw failure(400, "Invalid slug");
  if (!partial && !data.slug) data.slug = `${kind}-${createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 20)}`;
  if (input.image !== undefined) data.image = imageUrl(input.image);
  if (input.images !== undefined) {
    if (!Array.isArray(input.images) || input.images.length > 200) throw failure(400, "Invalid image list");
    data.images = JSON.stringify(input.images.map(imageUrl));
  }
  for (const key of kind === "news" ? ["hidden", "featured"] : ["hidden", "registrationOpen"]) {
    if (input[key] !== undefined) {
      if (typeof input[key] !== "boolean") throw failure(400, `Invalid ${key}`);
      data[key] = input[key];
    }
  }
  return data;
}

// The existing editor saves lists. Serialize changes and require a revision so a stale
// admin tab cannot overwrite another admin's changes. Every batch is all-or-nothing.
export function contentRouter(kind: "news" | "events") {
  const router = Router();
  const model = (db: any) => kind === "news" ? db.newsArticle : db.event;
  const read = (db: any) => model(db).findMany({ orderBy: [{ sortOrder: "asc" }, { id: "desc" }] });
  const lock = (db: any) => db.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(${kind === "news" ? 724101 : 724102})`);
  const handle = (fn: any) => async (req: any, res: any) => {
    try { await fn(req, res); } catch (err: any) {
      console.error(`Content ${kind}:`, err.message);
      res.status(err.status || (err.code === "P2002" || err.code === "P2003" ? 409 : 500)).json({
        error: err.status ? err.message : "Unable to save or load content. Please retry."
      });
    }
  };
  router.get("/", (req, res, next) => req.query.admin === "true" ? requireAuth(req, res, next) : next(), handle(async (req: Request, res: any) => {
    const rows = await read(prisma);
    const admin = req.query.admin === "true";
    res.setHeader("X-Content-Revision", revision(rows));
    res.json(rows.filter((r: any) => admin || !r.hidden).map(format));
  }));
  router.post("/sync", requireAuth, handle(async (req: Request, res: any) => {
    const items = req.body[kind === "news" ? "articles" : "events"];
    if (!Array.isArray(items) || items.length > 2000) throw failure(400, "Invalid content list");
    const prepared = items.map((item, index) => ({ id: item.id, data: { ...fields(item, kind), sortOrder: index } }));
    const ids = prepared.map(item => item.id);
    if (new Set(ids).size !== ids.length) throw failure(400, "Duplicate content IDs");
    const result = await prisma.$transaction(async (tx: any) => {
      await lock(tx);
      const before = await read(tx);
      const incomingIds = new Set(prepared.map(item => item.id));
      for (const item of prepared) {
        const prior = before.find((row: any) => row.id === item.id);
        if (!prior) await assertPermission(req, kind + ".create");
        else if (Object.entries(item.data).some(([key, value]) => prior[key] !== value)) await assertPermission(req, kind + ".edit");
      }
      if (before.some((row: any) => !incomingIds.has(row.id))) await assertPermission(req, kind + ".delete");
      if (!req.body.revision || revision(before) !== req.body.revision) throw failure(409, "Content changed. Reload this page before saving again.");
      const existing = new Set(before.map((r: any) => r.id));
      const keep = prepared.filter(i => validId(i.id) && existing.has(i.id)).map(i => i.id);
      await model(tx).deleteMany({ where: { id: { notIn: keep } } });
      for (const item of prepared) {
        if (existing.has(item.id)) await model(tx).update({ where: { id: item.id }, data: item.data });
        else await model(tx).create({ data: item.data });
      }
      return read(tx);
    }, { timeout: 30000 });
    res.json({ items: result.map(format), revision: revision(result) });
  }));
  router.get("/:slug", handle(async (req: Request, res: any) => {
    const row = await model(prisma).findUnique({ where: { slug: req.params.slug } });
    if (!row || row.hidden) throw failure(404, "Content not found");
    // Never include attendee registrations in public event output.
    res.json(format(row));
  }));
  for (const method of ["post", "put", "delete"] as const) {
    router[method](method === "post" ? "/" : "/:id", requireAuth, handle(async (req: Request, res: any) => {
      const id = Number(req.params.id);
      if (method !== "post" && !validId(id)) throw failure(400, "Invalid content ID");
      const data = method !== "delete" ? fields(req.body, kind, method === "put") : null;
      const result = await prisma.$transaction(async (tx: any) => {
        await lock(tx);
        if (method !== "post" && !await model(tx).findUnique({ where: { id } })) throw failure(404, "Content not found");
        if (method === "delete") { await model(tx).delete({ where: { id } }); return { success: true }; }
        return format(await (method === "post" ? model(tx).create({ data }) : model(tx).update({ where: { id }, data })));
      });
      res.status(method === "post" ? 201 : 200).json(result);
    }));
  }
  return router;
}
