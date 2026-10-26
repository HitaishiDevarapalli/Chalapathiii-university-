import { Router, Request, Response, NextFunction } from "express";
import { randomUUID, randomBytes } from "crypto";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { requirePermission, assertPermission } from "../middleware/auth";
import { audit, fail, digest } from "../security/core";
import { settingsSchema, Settings } from "../codePages/schema";
import { resolveSocialImage, socialImageError } from "../codePages/seo";
import {
  Package,
  MAX_ZIP,
  MAX_SOURCE,
  MAX_EXPANDED,
  readPackage,
  validatePackage,
  storeFile,
  assetDirectory,
  renderHtml,
  rewriteCss,
  hash,
} from "../codePages/package";
import menus from "../pageBuilder/menus.json";
import staticRoutes from "../codePages/staticRoutes.json";

const router = Router();
type Document = Settings & {
  package: Package;
  validation: ReturnType<typeof validatePackage>;
};
const validationFor = (doc: Pick<Document, "package" | "seo">) => {
  const validation = validatePackage(doc.package);
  const imageError = socialImageError(doc.seo.image, doc.package.files);
  if (imageError) validation.errors.push(`Social-sharing image: ${imageError}`);
  return validation;
};
const run =
  (fn: (req: Request, res: Response) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    void fn(req, res).catch(next);
  };
const transaction = <T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) =>
  prisma.$transaction(fn, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    timeout: 20000,
  });
const getRow = async (db: Prisma.TransactionClient, id: string) => {
  const row = await db.codeDocument.findUnique({
    where: { pageId: id },
    include: { page: true },
  });
  if (!row) fail("Code page not found", 404);
  return row!;
};
const docOf = (row: { draftJson: string }) =>
  JSON.parse(row.draftJson) as Document;
const view = (row: any, includeSource = true) => {
  const doc = docOf(row);
  return {
    id: row.pageId,
    revision: row.revision,
    stage: row.stage,
    liveRoute: row.liveRoute,
    publishedVersionId: row.publishedVersionId,
    publishedAt: row.publishedAt,
    updatedAt: row.updatedAt,
    createdAt: row.createdAt,
    uploadedBy: row.uploadedBy,
    document: includeSource
      ? doc
      : {
          name: doc.name,
          description: doc.description,
          integration: doc.integration,
          seo: doc.seo,
          package: {
            originalName: doc.package.originalName,
            entry: doc.package.entry,
            totalBytes: doc.package.totalBytes,
            files: doc.package.files.map(({ source, ...file }) => file),
          },
        },
  };
};
const revision = (req: Request) => {
  const n = Number(req.body?.revision);
  if (!Number.isInteger(n) || n < 1) fail("Current revision is required");
  return n;
};
async function claim(
  tx: Prisma.TransactionClient,
  req: Request,
  id: string,
  extra: any = {},
) {
  const result = await tx.codeDocument.updateMany({
    where: { pageId: id, revision: revision(req) },
    data: { revision: { increment: 1 }, updatedBy: req.adminUser.id, ...extra },
  });
  if (result.count !== 1)
    fail("This page changed in another session. Reload before saving.", 409);
}
async function snapshot(
  tx: Prisma.TransactionClient,
  req: Request,
  id: string,
  rev: number,
  kind: string,
  document: Document,
  previousVersionId: string | null = null,
) {
  if ((await tx.codeVersion.count({ where: { pageId: id } })) >= 200)
    fail(
      "Version quota reached (200). Archive this page and create a new one.",
      413,
    );
  const versions = await tx.codeVersion.findMany({
    where: { pageId: id },
    select: { snapshotJson: true },
  });
  if (
    versions.reduce(
      (n, v) => n + (JSON.parse(v.snapshotJson).package?.totalBytes || 0),
      document.package.totalBytes,
    ) >
    200 * 1024 * 1024
  )
    fail("Page version storage quota exceeded (200 MB)", 413);
  return tx.codeVersion.create({
    data: {
      pageId: id,
      revision: rev,
      kind,
      previousVersionId,
      snapshotJson: JSON.stringify(document),
      author: req.adminUser.username,
    },
  });
}
const publicView = (row: any, version: any) => {
  const doc = JSON.parse(version.snapshotJson) as Document;
  return {
    id: row.pageId,
    versionId: version.id,
    name: doc.name,
    route: row.liveRoute,
    integration: doc.integration,
    seo: {
      ...doc.seo,
      image: resolveSocialImage(
        doc.seo.image,
        `https://chalapathiuniversity.edu.in/api/code-pages/content/${row.pageId}/${version.id}/`,
      ),
    },
    contentUrl: `/api/code-pages/content/${row.pageId}/${version.id}/${doc.package.entry.split("/").map(encodeURIComponent).join("/")}`,
  };
};
async function routeCheck(
  tx: Prisma.TransactionClient,
  id: string,
  doc: Document,
) {
  const route = doc.integration.route;
  const [owner, page, visualDraft, redirect] = await Promise.all([
    tx.codeDocument.findUnique({ where: { liveRoute: route } }),
    tx.cmsPage.findUnique({ where: { slug: route } }),
    tx.builderDocument.findUnique({ where: { slug: route } }),
    tx.builderRedirect.findUnique({ where: { slug: route } }),
  ]);
  if (owner && owner.pageId !== id)
    fail("A code page already owns this URL. Edit that page instead.", 409);
  const existing =
    staticRoutes.includes(route) ||
    /^\/(news|events)\/.+/.test(route) ||
    menus.some((m) => m.path === route) ||
    (!!page && page.id !== id) ||
    (!!visualDraft && visualDraft.pageId !== id) ||
    (!!redirect && redirect.pageId !== id);
  if (existing && !["replace", "homepage"].includes(doc.integration.mode))
    fail(
      "This URL already exists. Choose Replace an Existing Page and confirm the replacement.",
      409,
    );
  if (doc.integration.mode === "replace" && !existing && !owner)
    fail("Select an existing destination to replace", 400);
  if (
    doc.integration.mode === "navigation" ||
    doc.integration.mode === "submenu"
  ) {
    const parent =
      doc.integration.mode === "navigation"
        ? "Main Menu"
        : doc.integration.parent;
    if (
      parent === "Main Menu" &&
      menus.some(
        (m) => m.id.toLowerCase() === doc.integration.label.toLowerCase(),
      )
    )
      fail("This label belongs to an existing navigation item", 409);
    const entries = await tx.builderNavigation.findMany({
      where: { parentKey: parent, pageId: { not: id } },
    });
    if (
      entries.some(
        (e) => e.label.toLowerCase() === doc.integration.label.toLowerCase(),
      )
    )
      fail("The menu already has this label", 409);
  }
  {
    const canonicalOf = (value: Document) =>
      new URL(
        value.seo.canonical ||
          `https://chalapathiuniversity.edu.in${value.integration.route}`,
      ).href;
    const canonical = canonicalOf(doc);
    const others = await tx.codeDocument.findMany({
      where: { publishedVersionId: { not: null }, pageId: { not: id } },
    });
    for (const other of others) {
      const release = await tx.codeVersion.findUnique({
        where: { id: other.publishedVersionId! },
      });
      if (
        release &&
        canonicalOf(JSON.parse(release.snapshotJson)) === canonical
      )
        fail("Another published page uses this canonical URL", 409);
    }
  }
  return {
    replacesExisting: existing,
    currentUrl: route,
    proposedName: doc.name,
    placement: doc.integration,
    files: doc.package.files.length,
    bytes: doc.package.totalBytes,
  };
}
async function publish(
  tx: Prisma.TransactionClient,
  req: Request,
  row: any,
  doc: Document,
  kind = "PUBLISHED",
) {
  const validation = validationFor(doc);
  if (validation.errors.length)
    fail("Resolve validation errors before publishing");
  await routeCheck(tx, row.pageId, doc);
  // Check every referenced asset before switching the public pointer.
  for (const file of doc.package.files)
    if (file.source === undefined) {
      const bytes = await fs
        .readFile(path.join(assetDirectory, file.hash))
        .catch(() => fail(`Missing stored asset: ${file.path}`, 409));
      if (hash(bytes) !== file.hash)
        fail(`Stored asset failed integrity check: ${file.path}`, 409);
    }
  await claim(tx, req, row.pageId);
  const release = await snapshot(
    tx,
    req,
    row.pageId,
    row.revision + 1,
    kind,
    doc,
    row.publishedVersionId,
  );
  // CmsPage is still the shared public registry. Its internal slug never takes over an existing CMS row.
  await tx.cmsPage.update({
    where: { id: row.pageId },
    data: {
      name: doc.name,
      title: doc.name,
      status: "published",
      seoTitle: doc.seo.title,
      seoDescription: doc.seo.description,
      dataJson: JSON.stringify({
        codePage: true,
        route: doc.integration.route,
        versionId: release.id,
      }),
    },
  });
  const nav = doc.integration;
  if (["navigation", "submenu", "footer"].includes(nav.mode)) {
    const data = {
      label: nav.label,
      parentKey:
        nav.mode === "footer"
          ? `footer:${nav.parent}`
          : nav.mode === "navigation"
            ? "Main Menu"
            : nav.parent,
      position: nav.position,
      visible: nav.visible,
    };
    await tx.builderNavigation.upsert({
      where: { pageId: row.pageId },
      create: { pageId: row.pageId, ...data },
      update: data,
    });
  } else
    await tx.builderNavigation.deleteMany({ where: { pageId: row.pageId } });
  await tx.codeDocument.update({
    where: { pageId: row.pageId },
    data: {
      stage: "PUBLISHED",
      liveRoute: nav.route,
      publishedVersionId: release.id,
      publishedAt: new Date(),
      draftJson: JSON.stringify(doc),
    },
  });
  await audit(
    req,
    kind === "ROLLBACK" ? "code_page_rollback" : "code_page_published",
    true,
    "Code release, route and navigation switched atomically",
    undefined,
    row.pageId,
    tx,
  );
}

router.get(
  "/resolve",
  run(async (req, res) => {
    const row = await prisma.codeDocument.findUnique({
      where: { liveRoute: String(req.query.route || "") },
    });
    if (!row?.publishedVersionId) return res.json(null);
    const version = await prisma.codeVersion.findUnique({
      where: { id: row.publishedVersionId },
    });
    return res.json(version ? publicView(row, version) : null);
  }),
);
router.get(
  "/sitemap.xml",
  run(async (_req, res) => {
    const rows = await prisma.codeDocument.findMany({
      where: { publishedVersionId: { not: null } },
    });
    const urls: string[] = [];
    for (const row of rows) {
      const version = await prisma.codeVersion.findUnique({
        where: { id: row.publishedVersionId! },
      });
      if (!version) continue;
      const doc = JSON.parse(version.snapshotJson) as Document;
      if (doc.seo.sitemap && !doc.seo.noindex)
        urls.push(
          `<url><loc>${(doc.seo.canonical || `https://chalapathiuniversity.edu.in${row.liveRoute}`).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</loc><lastmod>${row.publishedAt!.toISOString()}</lastmod></url>`,
        );
    }
    res
      .type("application/xml")
      .send(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join("")}</urlset>`,
      );
  }),
);
async function serve(
  req: Request,
  res: Response,
  doc: Document,
  base: string,
  preview: boolean,
  channel = "",
) {
  // Express already decodes wildcard paths once. Never resolve an arbitrary filesystem path.
  let requested = req.params[0] || doc.package.entry;
  if (requested.endsWith("/")) requested += "index.html";
  if (
    !doc.package.files.some((f) => f.path === requested) &&
    doc.package.files.some((f) => f.path === `${requested}/index.html`)
  )
    return res.redirect(307, req.originalUrl.split("?")[0] + "/");
  const file = doc.package.files.find((f) => f.path === requested);
  if (!file) return res.sendStatus(404);
  res.removeHeader("X-Frame-Options");
  res.set({
    "X-Content-Type-Options": "nosniff",
    "Access-Control-Allow-Origin": "*",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Robots-Tag": "noindex, nofollow",
  });
  // CSP sandbox is mandatory even for direct visits; no allow-same-origin or privileged network access.
  const allowed = `${req.protocol}://${req.get("host")}${base}`;
  res.setHeader(
    "Content-Security-Policy",
    `sandbox allow-scripts; default-src 'none'; script-src 'unsafe-inline' ${allowed}; style-src 'unsafe-inline' ${allowed}; img-src data: ${allowed}; font-src data: ${allowed}; media-src ${allowed}; connect-src ${allowed}; frame-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'`,
  );
  let body: Buffer | string =
    file.source ?? (await fs.readFile(path.join(assetDirectory, file.hash)));
  if (file.mime === "text/html")
    body = renderHtml(
      String(body),
      base,
      {
        ...doc.seo,
        image: resolveSocialImage(
          doc.seo.image,
          `${req.protocol}://${req.get("host")}${base}`,
        ),
        title: doc.seo.title || doc.name,
        canonical:
          doc.seo.canonical ||
          `https://chalapathiuniversity.edu.in${doc.integration.route}`,
        noindex: preview || doc.seo.noindex,
      },
      channel,
    );
  if (file.mime === "text/css") body = rewriteCss(String(body), base);
  return res.type(file.mime).send(body);
}
router.get(
  "/content/:id/:version/*",
  run(async (req, res) => {
    const row = await prisma.codeDocument.findUnique({
      where: { pageId: req.params.id },
    });
    // Retain immutable published assets during a release switch so in-flight pages stay coherent.
    // Unpublishing revokes all releases. Drafts and restored source are never served here.
    if (!row?.publishedVersionId) return res.sendStatus(404);
    const version = await prisma.codeVersion.findFirst({
      where: {
        id: req.params.version,
        pageId: row.pageId,
        kind: { in: ["PUBLISHED", "ROLLBACK"] },
      },
    });
    if (!version) return res.sendStatus(404);
    return serve(
      req,
      res,
      JSON.parse(version.snapshotJson),
      `/api/code-pages/content/${row.pageId}/${version.id}/`,
      false,
      version.id,
    );
  }),
);
router.get(
  "/preview/:token/*",
  run(async (req, res) => {
    const row = await prisma.codePreview.findUnique({
      where: { tokenHash: digest(req.params.token) },
    });
    if (!row || row.expiresAt.getTime() < Date.now())
      return res.sendStatus(404);
    const doc = JSON.parse(row.snapshotJson) as Document;
    if (req.params[0] === doc.package.entry && !row.renderedAt)
      await prisma.codePreview.update({
        where: { tokenHash: row.tokenHash },
        data: { renderedAt: new Date() },
      });
    return serve(
      req,
      res,
      doc,
      `/api/code-pages/preview/${req.params.token}/`,
      true,
      req.params.token,
    );
  }),
);

router.use(requirePermission("pages.view"));
router.use((req, _res, next) => {
  void (async () => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return;
    const scope = req.path.endsWith("/upload")
      ? "upload"
      : /\/(publish|rollback|unpublish)$/.test(req.path)
        ? "publish"
        : "edit";
    const key = digest(`code-pages:${req.adminUser.id}:${scope}`);
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
      (scope === "upload" ? 10 : scope === "publish" ? 40 : 180)
    )
      fail("Code page operation limit reached. Try again in ten minutes.", 429);
  })()
    .then(() => next())
    .catch(next);
});

router.get(
  "/destinations",
  run(async (_req, res) => {
    const pages = await prisma.cmsPage.findMany({
      where: { status: "published", type: { not: "code" } },
      select: { id: true, title: true, slug: true },
      take: 1000,
    });
    return res.json({
      menus,
      routes: [
        ...new Set([
          ...staticRoutes.filter((r) => !r.includes(":")),
          ...pages.map((p) => p.slug),
        ]),
      ].filter((r) => !r.startsWith("/admin")),
      pages,
    });
  }),
);
router.get(
  "/",
  run(async (req, res) => {
    const page = Math.max(1, Math.min(10000, Number(req.query.page) || 1));
    const search = String(req.query.search || "").slice(0, 160);
    const status = String(req.query.status || "all");
    const where: Prisma.CodeDocumentWhereInput = {
      ...(search
        ? { page: { name: { contains: search, mode: "insensitive" } } }
        : {}),
      ...(status === "published"
        ? { publishedVersionId: { not: null } }
        : status === "draft"
          ? { stage: { not: "PUBLISHED" } }
          : {}),
    };
    const [rows, total] = await prisma.$transaction([
      prisma.codeDocument.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { pageId: "asc" }],
        skip: (page - 1) * 20,
        take: 20,
        include: { page: true },
      }),
      prisma.codeDocument.count({ where }),
    ]);
    return res.json({
      items: rows.map((row) => view(row, false)),
      total,
      page,
    });
  }),
);
router.post(
  "/",
  requirePermission("pages.create"),
  run(async (req, res) => {
    const settings = settingsSchema.parse(req.body);
    const id = randomUUID();
    const doc: Document = {
      ...settings,
      package: {
        entry: "index.html",
        originalName: "",
        files: [],
        totalBytes: 0,
      },
      validation: { errors: ["Upload a ZIP archive to begin"], warnings: [] },
    };
    const row = await transaction(async (tx) => {
      if ((await tx.codeDocument.count()) >= 250)
        fail("Code page quota reached (250)", 413);
      await tx.cmsPage.create({
        data: {
          id,
          slug: `/code-drafts/${id}`,
          name: settings.name,
          title: settings.name,
          type: "code",
          status: "draft",
        },
      });
      await tx.codeDocument.create({
        data: {
          pageId: id,
          draftJson: JSON.stringify(doc),
          createdBy: req.adminUser.id,
          updatedBy: req.adminUser.id,
          uploadedBy: req.adminUser.username,
        },
      });
      await audit(
        req,
        "code_page_created",
        true,
        "Code page draft created in shared CMS registry",
        undefined,
        id,
        tx,
      );
      return getRow(tx, id);
    });
    return res.status(201).json(view(row));
  }),
);
router.get(
  "/:id",
  run(async (req, res) => res.json(view(await getRow(prisma, req.params.id)))),
);
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_ZIP, files: 1, fields: 2, parts: 3 },
  fileFilter: (_req, file, done) => {
    if (
      !/\.zip$/i.test(file.originalname) ||
      ![
        "application/zip",
        "application/x-zip-compressed",
        "application/octet-stream",
      ].includes(file.mimetype)
    )
      return done(
        Object.assign(new Error("Choose a ZIP archive"), { status: 400 }),
      );
    done(null, true);
  },
});
router.post(
  "/:id/upload",
  requirePermission("pages.edit"),
  upload.single("file"),
  run(async (req, res) => {
    if (!req.file) fail("Choose a ZIP archive");
    const before = await getRow(prisma, req.params.id);
    if (before.revision !== revision(req))
      fail("Reload the current revision before uploading", 409);
    const pkg = await readPackage(req.file!.buffer, req.file!.originalname);
    const row = await transaction(async (tx) => {
      const current = await getRow(tx, req.params.id);
      const versions = await tx.codeVersion.findMany({
        where: { pageId: current.pageId },
        select: { snapshotJson: true },
      });
      if (
        versions.reduce(
          (n, v) => n + (JSON.parse(v.snapshotJson).package?.totalBytes || 0),
          pkg.totalBytes,
        ) >
        200 * 1024 * 1024
      )
        fail("Page version storage quota exceeded (200 MB)", 413);
      const doc = {
        ...docOf(current),
        package: pkg,
        validation: validationFor({ package: pkg, seo: docOf(current).seo }),
      };
      await claim(tx, req, current.pageId, {
        draftJson: JSON.stringify(doc),
        stage: doc.validation.errors.length ? "VALIDATING" : "DRAFT",
      });
      await snapshot(
        tx,
        req,
        current.pageId,
        current.revision + 1,
        "UPLOAD",
        doc,
      );
      await audit(
        req,
        "code_page_uploaded",
        true,
        "Static archive validated and stored as a private draft",
        undefined,
        current.pageId,
        tx,
      );
      return getRow(tx, current.pageId);
    });
    return res.json(view(row));
  }),
);
router.put(
  "/:id",
  requirePermission("pages.edit"),
  run(async (req, res) => {
    const settings = settingsSchema.parse(req.body.document);
    const edits: unknown = req.body.files || {};
    if (
      !edits ||
      typeof edits !== "object" ||
      Array.isArray(edits) ||
      Object.keys(edits).length > 500
    )
      fail("Invalid source changes");
    const row = await transaction(async (tx) => {
      const current = await getRow(tx, req.params.id);
      const previous = docOf(current);
      const pkg: Package = {
        ...previous.package,
        files: previous.package.files.map((f) => ({ ...f })),
      };
      if (req.body.entry !== undefined) pkg.entry = String(req.body.entry);
      for (const [name, source] of Object.entries(edits)) {
        const index = pkg.files.findIndex((f) => f.path === name);
        if (index < 0 || pkg.files[index].source === undefined)
          fail("Only existing source files can be edited");
        if (
          typeof source !== "string" ||
          Buffer.byteLength(source) > MAX_SOURCE
        )
          fail("Source exceeds 2 MB", 413);
        pkg.files[index] = await storeFile(name, Buffer.from(source as string));
      }
      pkg.totalBytes = pkg.files.reduce((n, f) => n + f.size, 0);
      if (pkg.totalBytes > MAX_EXPANDED)
        fail("Page exceeds the expanded size limit", 413);
      const doc: Document = {
        ...settings,
        package: pkg,
        validation: validationFor({ package: pkg, seo: settings.seo }),
      };
      await claim(tx, req, current.pageId, {
        draftJson: JSON.stringify(doc),
        stage: doc.validation.errors.length ? "VALIDATING" : "DRAFT",
      });
      if (!current.publishedVersionId)
        await tx.cmsPage.update({
          where: { id: current.pageId },
          data: { name: doc.name, title: doc.name },
        });
      await snapshot(
        tx,
        req,
        current.pageId,
        current.revision + 1,
        "DRAFT",
        doc,
      );
      await audit(
        req,
        "code_page_edited",
        true,
        "Draft source and integration saved; published release unchanged",
        undefined,
        current.pageId,
        tx,
      );
      return getRow(tx, current.pageId);
    });
    res.json(view(row));
  }),
);
router.post(
  "/:id/validate",
  requirePermission("pages.edit"),
  run(async (req, res) => {
    const row = await transaction(async (tx) => {
      const current = await getRow(tx, req.params.id),
        doc = docOf(current);
      doc.validation = validationFor(doc);
      await claim(tx, req, current.pageId, {
        draftJson: JSON.stringify(doc),
        stage: doc.validation.errors.length ? "VALIDATING" : "DRAFT",
      });
      return getRow(tx, current.pageId);
    });
    res.json(view(row));
  }),
);
router.post(
  "/:id/preview",
  run(async (req, res) => {
    const token = randomBytes(32).toString("hex");
    const result = await transaction(async (tx) => {
      const row = await getRow(tx, req.params.id),
        doc = docOf(row);
      if (row.revision !== revision(req))
        fail("Save and reload the current draft first", 409);
      const validation = validationFor(doc);
      // Missing assets can be inspected in preview, but still block approval/publication.
      if (
        !doc.package.files.some(
          (f) => f.path === doc.package.entry && f.mime === "text/html",
        )
      )
        fail("Upload a valid HTML page before previewing");
      await tx.codePreview.deleteMany({
        where: {
          OR: [
            { expiresAt: { lte: new Date() } },
            { pageId: row.pageId, adminId: req.adminUser.id },
          ],
        },
      });
      await tx.codePreview.create({
        data: {
          tokenHash: digest(token),
          pageId: row.pageId,
          revision: row.revision,
          adminId: req.adminUser.id,
          snapshotJson: JSON.stringify(doc),
          expiresAt: new Date(Date.now() + 15 * 60000),
        },
      });
      await audit(
        req,
        "code_page_preview",
        true,
        "Expiring isolated preview created",
        undefined,
        row.pageId,
        tx,
      );
      return {
        token,
        revision: row.revision,
        url: `/api/code-pages/preview/${token}/${doc.package.entry.split("/").map(encodeURIComponent).join("/")}`,
        validation,
      };
    });
    res.json(result);
  }),
);
router.post(
  "/:id/previewed",
  run(async (req, res) => {
    const row = await transaction(async (tx) => {
      const current = await getRow(tx, req.params.id);
      const preview = await tx.codePreview.findUnique({
        where: { tokenHash: digest(String(req.body.token || "")) },
      });
      if (
        !preview ||
        preview.pageId !== current.pageId ||
        preview.adminId !== req.adminUser.id ||
        preview.revision !== current.revision ||
        preview.expiresAt.getTime() < Date.now() ||
        !preview.renderedAt
      )
        fail("Render the current draft preview first", 409);
      // Viewing does not edit the draft or invalidate other editors' content revisions.
      if (["DRAFT", "UPLOADED", "VALIDATING"].includes(current.stage))
        await tx.codeDocument.update({
          where: { pageId: current.pageId },
          data: { stage: "PREVIEWED" },
        });
      return getRow(tx, current.pageId);
    });
    res.json(view(row));
  }),
);
router.post(
  "/:id/approve",
  requirePermission("pages.publish"),
  run(async (req, res) => {
    const row = await transaction(async (tx) => {
      const current = await getRow(tx, req.params.id),
        doc = docOf(current);
      if (current.revision !== revision(req) || current.stage !== "PREVIEWED")
        fail("Preview the latest saved draft before approving", 409);
      if (validationFor(doc).errors.length)
        fail("Resolve missing assets and validation errors before approving");
      await routeCheck(tx, current.pageId, doc);
      await tx.codeDocument.update({
        where: { pageId: current.pageId },
        data: { stage: "READY" },
      });
      await audit(
        req,
        "code_page_approved",
        true,
        "Current draft preview approved for publication",
        undefined,
        current.pageId,
        tx,
      );
      return getRow(tx, current.pageId);
    });
    res.json(view(row));
  }),
);
router.get(
  "/:id/summary",
  requirePermission("pages.publish"),
  run(async (req, res) => {
    const row = await getRow(prisma, req.params.id);
    res.json({
      ...(await routeCheck(prisma, row.pageId, docOf(row))),
      revision: row.revision,
      stage: row.stage,
      previousVersionId: row.publishedVersionId,
    });
  }),
);
router.post(
  "/:id/publish",
  requirePermission("pages.publish"),
  run(async (req, res) => {
    if (req.body.confirm !== true)
      fail("Explicit publication confirmation is required");
    const row = await transaction(async (tx) => {
      const current = await getRow(tx, req.params.id),
        doc = docOf(current);
      if (current.stage !== "READY")
        fail("Approve the current preview before publishing", 409);
      if (
        ["replace", "homepage"].includes(doc.integration.mode) &&
        req.body.confirmRoute !== doc.integration.route
      )
        fail("Confirm the exact route to replace");
      await publish(tx, req, current, doc);
      return getRow(tx, current.pageId);
    });
    res.json(view(row));
  }),
);
router.post(
  "/:id/unpublish",
  requirePermission("pages.publish"),
  run(async (req, res) => {
    if (req.body.confirm !== true) fail("Confirm unpublishing");
    const row = await transaction(async (tx) => {
      const current = await getRow(tx, req.params.id);
      await claim(tx, req, current.pageId, {
        stage: "DRAFT",
        publishedVersionId: null,
        liveRoute: null,
      });
      await tx.cmsPage.update({
        where: { id: current.pageId },
        data: { status: "draft", dataJson: "{}" },
      });
      await tx.builderNavigation.deleteMany({
        where: { pageId: current.pageId },
      });
      await audit(
        req,
        "code_page_unpublished",
        true,
        "Code override removed; original route and menus remain available",
        undefined,
        current.pageId,
        tx,
      );
      return getRow(tx, current.pageId);
    });
    res.json(view(row));
  }),
);
router.get(
  "/:id/versions",
  run(async (req, res) => {
    await getRow(prisma, req.params.id);
    const rows = await prisma.codeVersion.findMany({
      where: { pageId: req.params.id },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 200,
    });
    res.json(
      rows.map(({ snapshotJson, ...row }) => ({
        ...row,
        name: JSON.parse(snapshotJson).name,
        files: JSON.parse(snapshotJson).package.files.map(
          ({ path, hash, size }: any) => ({ path, hash, size }),
        ),
        integration: JSON.parse(snapshotJson).integration,
      })),
    );
  }),
);
router.get(
  "/:id/versions/:version",
  run(async (req, res) => {
    const version = await prisma.codeVersion.findFirst({
      where: { id: req.params.version, pageId: req.params.id },
    });
    if (!version) fail("Version not found", 404);
    res.json({
      ...version!,
      document: JSON.parse(version!.snapshotJson),
      snapshotJson: undefined,
    });
  }),
);
router.post(
  "/:id/restore",
  requirePermission("pages.edit"),
  run(async (req, res) => {
    const row = await transaction(async (tx) => {
      const current = await getRow(tx, req.params.id);
      const target = await tx.codeVersion.findFirst({
        where: { id: String(req.body.versionId || ""), pageId: current.pageId },
      });
      if (!target) fail("Version not found", 404);
      const doc = JSON.parse(target!.snapshotJson) as Document;
      await claim(tx, req, current.pageId, {
        draftJson: JSON.stringify(doc),
        stage: "DRAFT",
      });
      await snapshot(
        tx,
        req,
        current.pageId,
        current.revision + 1,
        "RESTORED",
        doc,
      );
      await audit(
        req,
        "code_page_restored",
        true,
        "Historical source restored to draft",
        undefined,
        current.pageId,
        tx,
      );
      return getRow(tx, current.pageId);
    });
    res.json(view(row));
  }),
);
router.post(
  "/:id/rollback",
  requirePermission("pages.publish"),
  run(async (req, res) => {
    if (req.body.confirm !== true) fail("Confirm rollback");
    const row = await transaction(async (tx) => {
      const current = await getRow(tx, req.params.id);
      const target = await tx.codeVersion.findFirst({
        where: {
          id: String(req.body.versionId || ""),
          pageId: current.pageId,
          kind: { in: ["PUBLISHED", "ROLLBACK"] },
        },
      });
      if (!target) fail("Published version not found", 404);
      const doc = JSON.parse(target!.snapshotJson) as Document;
      // Same explicit replacement protection applies when a historical release targets a different route.
      if (
        ["replace", "homepage"].includes(doc.integration.mode) &&
        req.body.confirmRoute !== doc.integration.route
      )
        fail("Confirm the historical route to replace");
      await publish(tx, req, current, doc, "ROLLBACK");
      return getRow(tx, current.pageId);
    });
    res.json(view(row));
  }),
);
router.delete(
  "/:id",
  requirePermission("pages.delete"),
  run(async (req, res) => {
    await transaction(async (tx) => {
      const row = await getRow(tx, req.params.id);
      if (row.publishedVersionId)
        fail("Unpublish before deleting a draft", 409);
      await claim(tx, req, row.pageId);
      await audit(
        req,
        "code_page_deleted",
        true,
        "Unpublished code draft deleted",
        undefined,
        row.pageId,
        tx,
      );
      await tx.cmsPage.delete({ where: { id: row.pageId } });
    });
    res.json({ success: true });
  }),
);
router.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  if (error.name === "ZodError")
    return res.status(400).json({
      error: error.issues
        .map(
          (i: any) =>
            `${i.path.join(".") === "seo.image" ? "Social-sharing image" : i.path.join(".")}: ${i.message}`,
        )
        .slice(0, 5)
        .join("; "),
    });
  if (error.code === "P2002" || error.code === "P2034")
    return res.status(409).json({
      error: "This route or page changed in another session. Reload and retry.",
    });
  if (error.code === "LIMIT_FILE_SIZE")
    return res
      .status(413)
      .json({ error: "ZIP exceeds the 20 MB upload limit" });
  if (error.status)
    return res.status(error.status).json({ error: error.message });
  console.error("Code page request failed", error.code || error.name);
  return res.status(500).json({
    error: "Code page operation failed. The current publication was preserved.",
  });
});
export default router;
