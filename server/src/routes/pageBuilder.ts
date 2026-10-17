import { Router, Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import sharp from "sharp";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { requirePermission, assertPermission } from "../middleware/auth";
import { audit, digest, permitted } from "../security/core";
import { uploadsDirectory } from "../middleware/upload";
import {
  documentSchema,
  BuilderDocument,
  BuilderNode,
} from "../pageBuilder/schema";
import menus from "../pageBuilder/menus.json";

const router = Router();
type Tx = Prisma.TransactionClient;
const fail = (status: number, message: string): never => {
  throw Object.assign(new Error(message), { status });
};
const run =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    void fn(req, res).catch(next);
  };
const parse = (value: unknown): BuilderDocument => {
  // Bound recursive input before invoking the recursive schema.
  if (JSON.stringify(value).length > 2_000_000)
    fail(413, "Page exceeds the 2 MB content limit");
  let count = 0;
  const walk = (nodes: any, depth = 0) => {
    if (!Array.isArray(nodes)) return;
    if (depth > 8) fail(400, "Nesting is limited to eight levels");
    for (const n of nodes) {
      if (++count > 500) fail(400, "A page may contain up to 500 components");
      walk(n?.children, depth + 1);
    }
  };
  walk((value as any)?.nodes);
  const result = documentSchema.safeParse(value);
  if (!result.success)
    fail(
      400,
      result.error.issues
        .slice(0, 3)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    );
  return result.data!;
};
async function uniqueSlug(tx: Tx, slug: string, id: string) {
  const [page, draft, redirect] = await Promise.all([
    tx.cmsPage.findUnique({ where: { slug } }),
    tx.builderDocument.findUnique({ where: { slug } }),
    tx.builderRedirect.findUnique({ where: { slug } }),
  ]);
  if (
    [page?.id, draft?.pageId, redirect?.pageId].some(
      (owner) => owner && owner !== id,
    )
  )
    fail(409, "This URL is already reserved by another page");
}
async function validateReferences(
  tx: Tx,
  doc: BuilderDocument,
  pageId: string,
) {
  if (
    doc.placement.kind === "navigation" &&
    !menus.some((m) => m.id === doc.placement.parent)
  )
    fail(400, "Select an existing navigation menu");
  if (doc.placement.kind === "navigation" && !doc.placement.label.trim())
    fail(400, "A navigation label is required");
  if (doc.placement.kind === "navigation") {
    const label = doc.placement.label.trim().toLowerCase();
    if (
      doc.placement.parent === "Main Menu" &&
      menus.some((menu) => menu.id.toLowerCase() === label)
    )
      fail(400, "This label belongs to an existing navigation item");
    const entries = await tx.builderNavigation.findMany({
      where: { parentKey: doc.placement.parent, pageId: { not: pageId } },
    });
    if (entries.some((entry) => entry.label.trim().toLowerCase() === label))
      fail(409, "This menu already contains that label");
  }
  const ids = new Set<string>();
  const urls: string[] = [];
  const walk = (nodes: BuilderNode[]) => {
    for (const n of nodes) {
      if (n.props.pageId) ids.add(n.props.pageId);
      urls.push(
        ...([
          n.props.url,
          n.props.pageId ? undefined : n.props.href,
          ...(n.props.images?.map((i) => i.url) || []),
        ].filter(Boolean) as string[]),
      );
      walk(n.children);
    }
  };
  walk(doc.nodes);
  const slugs = [
    ...new Set(
      urls.filter((url) => url.startsWith("/pages/") && url !== doc.slug),
    ),
  ];
  const targets = await tx.cmsPage.findMany({
    where: {
      status: "published",
      OR: [{ id: { in: [...ids] } }, { slug: { in: slugs } }],
    },
    select: { id: true, slug: true },
  });
  if ([...ids].some((id) => !targets.some((p) => p.id === id)))
    fail(400, "An internal page destination is no longer published");
  if (slugs.some((slug) => !targets.some((p) => p.slug === slug)))
    fail(400, "A linked builder page is not published");
  const resolveLinks = (nodes: BuilderNode[]) => {
    for (const node of nodes) {
      if (node.props.pageId)
        node.props.href = targets.find(
          (page) => page.id === node.props.pageId,
        )!.slug;
      resolveLinks(node.children);
    }
  };
  resolveLinks(doc.nodes);
}
const view = (row: any) => ({
  id: row.pageId,
  version: row.version,
  document: JSON.parse(row.draftJson),
  status: row.page.status,
  liveSlug: row.page.status === "published" ? row.page.slug : null,
  updatedAt: row.updatedAt,
  publishedAt: row.publishedAt,
  createdBy: row.createdBy,
  updatedBy: row.updatedBy,
});
const record = async (tx: Tx, id: string) => {
  const row = await tx.builderDocument.findUnique({
    where: { pageId: id },
    include: { page: true },
  });
  if (!row) fail(404, "Page not found");
  return row!;
};
const versionOf = (req: Request) => {
  const value = req.body?.version;
  if (!Number.isInteger(value) || value < 1)
    fail(400, "The current page version is required");
  return value as number;
};
async function claim(
  tx: Tx,
  req: Request,
  id: string,
  version: number,
  extra: any = {},
) {
  const result = await tx.builderDocument.updateMany({
    where: { pageId: id, version },
    data: { version: { increment: 1 }, updatedBy: req.adminUser.id, ...extra },
  });
  if (result.count !== 1)
    fail(409, "This page changed in another session. Reload it before saving.");
}
async function snapshot(
  tx: Tx,
  req: Request,
  row: any,
  doc: BuilderDocument,
  note: string,
) {
  await tx.cmsPageVersion.create({
    data: {
      pageSlug: row.page.slug,
      author: req.adminUser.username,
      note: `${note} · revision ${row.version + 1}`,
      snapshotJson: JSON.stringify({ version: row.version + 1, document: doc }),
    },
  });
}
async function publish(tx: Tx, req: Request, row: any, doc: BuilderDocument) {
  if (row.archivedAt) fail(409, "Restore the archived page before publishing");
  await uniqueSlug(tx, doc.slug, row.pageId);
  await validateReferences(tx, doc, row.pageId);
  if (row.page.slug !== doc.slug && row.publishedAt && doc.redirectOldSlug)
    await tx.builderRedirect.upsert({
      where: { slug: row.page.slug },
      create: { slug: row.page.slug, pageId: row.pageId },
      update: { pageId: row.pageId },
    });
  await tx.builderRedirect.deleteMany({
    where: { slug: doc.slug, pageId: row.pageId },
  });
  await tx.cmsPage.update({
    where: { id: row.pageId },
    data: {
      slug: doc.slug,
      name: doc.title,
      title: doc.title,
      status: "published",
      dataJson: JSON.stringify(doc),
      seoTitle: doc.metaTitle,
      seoDescription: doc.metaDescription,
      showInNav: false,
    },
  });
  if (doc.placement.kind === "navigation") {
    const data = {
      label: doc.placement.label,
      parentKey: doc.placement.parent,
      position: doc.placement.position,
      visible: doc.placement.visible,
    };
    await tx.builderNavigation.upsert({
      where: { pageId: row.pageId },
      create: { pageId: row.pageId, ...data },
      update: data,
    });
  } else
    await tx.builderNavigation.deleteMany({ where: { pageId: row.pageId } });
  await tx.builderDocument.update({
    where: { pageId: row.pageId },
    data: { publishedAt: new Date(), draftJson: JSON.stringify(doc) },
  });
  await audit(
    req,
    "page_published",
    true,
    "Page and automatic placement published atomically",
    undefined,
    row.pageId,
    tx,
  );
}

// Public endpoints return only the published snapshot, never drafts or revisions.
router.get(
  "/public",
  run(async (req, res) => {
    const slug = String(req.query.slug || "");
    const row = await prisma.cmsPage.findFirst({
      where: { slug, type: "visual", status: "published" },
    });
    if (!row) {
      const redirect = await prisma.builderRedirect.findUnique({
        where: { slug },
        include: { page: true },
      });
      if (redirect?.page.status === "published")
        return res.json({ redirect: redirect.page.slug });
      return res.status(404).json({ error: "Page not found" });
    }
    let value;
    try {
      value = JSON.parse(row.dataJson);
    } catch {
      return res.status(404).json({ error: "Page unavailable" });
    }
    const parsed = documentSchema.safeParse(value);
    if (!parsed.success)
      return res.status(404).json({ error: "Page unavailable" });
    return res.json({ id: row.id, document: parsed.data });
  }),
);
router.get(
  "/placements",
  run(async (_req, res) => {
    const [nav, pages] = await Promise.all([
      prisma.builderNavigation.findMany({
        where: { visible: true, page: { status: "published" } },
        orderBy: [{ position: "asc" }, { id: "asc" }],
        include: { page: { select: { slug: true } } },
      }),
      prisma.cmsPage.findMany({
        where: { type: "visual", status: "published" },
      }),
    ]);
    const homepage = pages
      .flatMap((p) => {
        try {
          const doc = parse(JSON.parse(p.dataJson));
          return doc.placement.kind === "homepage" && doc.placement.visible
            ? [{ id: p.id, document: doc }]
            : [];
        } catch {
          return [];
        }
      })
      .sort(
        (a, b) => a.document.placement.position - b.document.placement.position,
      );
    return res.json({
      navigation: nav.map((n) => ({
        id: n.pageId,
        name: n.label,
        navLabel: n.label,
        slug: n.page.slug,
        parentNav: n.parentKey,
        displayOrder: n.position,
        showInNav: true,
        status: "published",
      })),
      homepage,
    });
  }),
);
router.use(requirePermission("pages.view"));
router.use((req, _res, next) => {
  void (async () => {
    // A database-backed budget survives API restarts; it is separate from login throttling.
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    const scope =
      req.path === "/media"
        ? "media"
        : /\/(publish|unpublish|archive)$/.test(req.path)
          ? "publication"
          : "edit";
    const key = digest(`page-builder:${req.adminUser.id}:${scope}`);
    await prisma.adminLoginThrottle.deleteMany({
      where: { key, expiresAt: { lte: new Date() } },
    });
    const budget = await prisma.adminLoginThrottle.upsert({
      where: { key },
      create: { key, attempts: 1, expiresAt: new Date(Date.now() + 600000) },
      update: { attempts: { increment: 1 } },
    });
    if (
      budget.attempts >
      (scope === "media" ? 30 : scope === "publication" ? 60 : 240)
    )
      fail(429, "Too many page operations. Please try again in ten minutes.");
    next();
  })().catch(next);
});
router.get("/menus", (_req, res) => res.json(menus));
router.get(
  "/links",
  run(async (_req, res) =>
    res.json(
      await prisma.cmsPage.findMany({
        where: { status: "published" },
        select: { id: true, title: true, slug: true },
        orderBy: { title: "asc" },
        take: 500,
      }),
    ),
  ),
);
router.get(
  "/",
  run(async (req, res) => {
    const page = Math.max(1, Math.min(100000, Number(req.query.page) || 1));
    const search = String(req.query.search || "").slice(0, 200);
    const status = String(req.query.status || "all");
    const where: Prisma.BuilderDocumentWhereInput = {
      ...(status === "all" ? {} : { page: { status } }),
      ...(search
        ? {
            OR: [
              { slug: { contains: search, mode: "insensitive" } },
              { draftJson: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const [rows, total] = await prisma.$transaction([
      prisma.builderDocument.findMany({
        where,
        include: { page: true },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * 20,
        take: 20,
      }),
      prisma.builderDocument.count({ where }),
    ]);
    return res.json({ items: rows.map(view), total, page });
  }),
);
router.post(
  "/",
  requirePermission("pages.create"),
  run(async (req, res) => {
    const doc = parse(req.body?.document);
    const id = randomUUID();
    const row = await prisma.$transaction(async (tx) => {
      await uniqueSlug(tx, doc.slug, id);
      await tx.cmsPage.create({
        data: {
          id,
          slug: doc.slug,
          name: doc.title,
          title: doc.title,
          type: "visual",
          status: "draft",
        },
      });
      await tx.builderDocument.create({
        data: {
          pageId: id,
          slug: doc.slug,
          draftJson: JSON.stringify(doc),
          createdBy: req.adminUser.id,
          updatedBy: req.adminUser.id,
        },
      });
      await tx.cmsPageVersion.create({
        data: {
          pageSlug: doc.slug,
          author: req.adminUser.username,
          note: "Created · revision 1",
          snapshotJson: JSON.stringify({ version: 1, document: doc }),
        },
      });
      await audit(
        req,
        "page_created",
        true,
        "Visual page draft created",
        undefined,
        id,
        tx,
      );
      return record(tx, id);
    });
    return res.status(201).json(view(row));
  }),
);
router.get(
  "/media",
  run(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const items = await prisma.builderMedia.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * 40,
      take: 40,
    });
    return res.json(
      items.map((m) => ({ ...m, url: `/uploads/${m.filename}` })),
    );
  }),
);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 2 },
});
router.post(
  "/media",
  requirePermission("gallery.create"),
  upload.single("file"),
  run(async (req, res) => {
    const file = req.file;
    if (!file) fail(400, "Choose an image or PDF");
    let bytes: Buffer;
    let mime: string;
    let extension: string;
    let width: number | undefined;
    let height: number | undefined;
    if (
      ["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
        file!.mimetype,
      )
    ) {
      try {
        const result = await sharp(file!.buffer, {
          limitInputPixels: 40_000_000,
        })
          .rotate()
          .resize({
            width: 2400,
            height: 2400,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 88 })
          .toBuffer({ resolveWithObject: true });
        bytes = result.data;
        width = result.info.width;
        height = result.info.height;
        mime = "image/webp";
        extension = "webp";
      } catch {
        return fail(400, "The image could not be decoded");
      }
    } else if (
      file!.mimetype === "application/pdf" &&
      file!.buffer.subarray(0, 5).toString() === "%PDF-" &&
      file!.buffer.subarray(-1024).includes(Buffer.from("%%EOF")) &&
      !/\/(JavaScript|JS|Launch|EmbeddedFile|OpenAction|AA)\b/.test(
        file!.buffer.toString("latin1"),
      )
    ) {
      bytes = file!.buffer;
      mime = "application/pdf";
      extension = "pdf";
    } else
      return fail(
        400,
        "Only valid raster images and passive PDF documents are supported",
      );
    const filename = `${randomUUID()}.${extension}`;
    const destination = path.join(uploadsDirectory, filename);
    await fs.writeFile(destination, bytes, { flag: "wx" });
    try {
      const media = await prisma.$transaction(async (tx) => {
        const m = await tx.builderMedia.create({
          data: {
            originalName: path.basename(file!.originalname).slice(0, 200),
            filename,
            mime,
            size: bytes.length,
            width,
            height,
            alt: String(req.body.alt || "").slice(0, 500),
            uploadedBy: req.adminUser.id,
          },
        });
        await audit(
          req,
          "page_media_uploaded",
          true,
          "Validated media stored in the existing durable uploads directory",
          undefined,
          m.id,
          tx,
        );
        return m;
      });
      return res.status(201).json({ ...media, url: `/uploads/${filename}` });
    } catch (e) {
      await fs.unlink(destination).catch(() => {});
      throw e;
    }
  }),
);
router.get(
  "/:id/revisions",
  run(async (req, res) => {
    const row = await record(prisma, req.params.id);
    const page = Math.max(1, Number(req.query.page) || 1);
    return res.json(
      await prisma.cmsPageVersion.findMany({
        where: { pageSlug: row.page.slug },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * 20,
        take: 20,
      }),
    );
  }),
);
router.get(
  "/:id",
  run(async (req, res) => res.json(view(await record(prisma, req.params.id)))),
);
router.put(
  "/:id",
  requirePermission("pages.edit"),
  run(async (req, res) => {
    const doc = parse(req.body?.document);
    const version = versionOf(req);
    const result = await prisma.$transaction(async (tx) => {
      const row = await record(tx, req.params.id);
      if (row.archivedAt) fail(409, "Restore the archived page before editing");
      await uniqueSlug(tx, doc.slug, row.pageId);
      await claim(tx, req, row.pageId, version, {
        draftJson: JSON.stringify(doc),
        slug: doc.slug,
      });
      await snapshot(tx, req, row, doc, "Saved draft");
      await audit(
        req,
        "page_draft_saved",
        true,
        "Draft saved without changing the published snapshot",
        undefined,
        row.pageId,
        tx,
      );
      return record(tx, row.pageId);
    });
    return res.json(view(result));
  }),
);
router.post(
  "/:id/:action",
  run(async (req, res) => {
    const action = req.params.action;
    const version = versionOf(req);
    const key =
      action === "duplicate"
        ? "pages.create"
        : ["publish", "unpublish"].includes(action)
          ? "pages.publish"
          : action === "archive"
            ? "pages.delete"
            : action === "restore" || action === "reopen"
              ? "pages.edit"
              : "";
    if (!key) fail(404, "Unknown page operation");
    await assertPermission(req, key);
    if (
      action === "archive" &&
      (await record(prisma, req.params.id)).page.status === "published"
    )
      await assertPermission(req, "pages.publish");
    const result = await prisma.$transaction(
      async (tx) => {
        const row = await record(tx, req.params.id);
        if (row.version !== version)
          fail(
            409,
            "This page changed in another session. Reload it before continuing.",
          );
        if (row.archivedAt && !["duplicate", "reopen"].includes(action))
          fail(409, "Restore the archived page before making changes");
        if (
          action === "archive" &&
          row.page.status === "published" &&
          !permitted(req.adminUser, "pages.publish")
        )
          fail(
            403,
            "Publication permission is required to archive a live page",
          );
        let doc = parse(JSON.parse(row.draftJson));
        if (action === "duplicate") {
          const id = randomUUID();
          doc = {
            ...doc,
            title: `${doc.title.slice(0, 170)} (copy)`,
            slug: `/pages/copy-${id}`,
            placement: { ...doc.placement, kind: "standalone" },
          };
          await tx.cmsPage.create({
            data: {
              id,
              slug: doc.slug,
              name: doc.title,
              title: doc.title,
              type: "visual",
              status: "draft",
            },
          });
          await tx.builderDocument.create({
            data: {
              pageId: id,
              slug: doc.slug,
              draftJson: JSON.stringify(doc),
              createdBy: req.adminUser.id,
              updatedBy: req.adminUser.id,
            },
          });
          await tx.cmsPageVersion.create({
            data: {
              pageSlug: doc.slug,
              author: req.adminUser.username,
              note: "Duplicated · revision 1",
              snapshotJson: JSON.stringify({ version: 1, document: doc }),
            },
          });
          await audit(
            req,
            "page_duplicated",
            true,
            "Page duplicated as an independent draft",
            undefined,
            id,
            tx,
          );
          return record(tx, id);
        }
        if (action === "restore") {
          const revision = await tx.cmsPageVersion.findFirst({
            where: { id: String(req.body.revisionId), pageSlug: row.page.slug },
          });
          if (!revision) fail(404, "Revision not found");
          doc = parse(JSON.parse(revision!.snapshotJson).document);
          await uniqueSlug(tx, doc.slug, row.pageId);
        }
        await claim(tx, req, row.pageId, version, {
          draftJson: JSON.stringify(doc),
          slug: doc.slug,
          ...(action === "archive"
            ? { archivedAt: new Date() }
            : action === "reopen"
              ? { archivedAt: null }
              : {}),
        });
        if (action === "publish") await publish(tx, req, row, doc);
        if (["unpublish", "archive", "reopen"].includes(action)) {
          await tx.cmsPage.update({
            where: { id: row.pageId },
            data: {
              status:
                action === "archive"
                  ? "archived"
                  : action === "unpublish"
                    ? "unpublished"
                    : "draft",
            },
          });
          await tx.builderNavigation.deleteMany({
            where: { pageId: row.pageId },
          });
        }
        await snapshot(
          tx,
          req,
          {
            ...row,
            page: {
              ...row.page,
              slug: action === "publish" ? doc.slug : row.page.slug,
            },
          },
          doc,
          action,
        );
        await audit(
          req,
          `page_${action}`,
          true,
          "Authorized visual page operation completed",
          undefined,
          row.pageId,
          tx,
        );
        return record(tx, row.pageId);
      },
      { timeout: 15000 },
    );
    return res.json(view(result));
  }),
);
router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status =
    err.code === "P2002" || err.code === "P2034"
      ? 409
      : err.code === "LIMIT_FILE_SIZE"
        ? 413
        : err.status || 500;
  return res.status(status).json({
    error:
      status === 409
        ? "A URL conflict or concurrent update occurred. Reload and retry."
        : status === 500
          ? "The page operation failed. No publication was confirmed."
          : err.message,
  });
});
export default router;
