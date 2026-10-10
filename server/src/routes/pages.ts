import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import prisma from "../prisma";

const router = Router();

function safeJsonParse<T = any>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function safeJsonStringify(val: any, fallback = "{}"): string {
  if (val === undefined || val === null) return fallback;
  if (typeof val === "string") {
    try {
      JSON.parse(val);
      return val;
    } catch {
      return JSON.stringify(val);
    }
  }
  try {
    return JSON.stringify(val);
  } catch {
    return fallback;
  }
}

// GET / - list all pages
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;
    const where: any = {};

    if (status && typeof status === "string") {
      where.status = status;
    }
    if (type && typeof type === "string") {
      where.type = type;
    }

    const pages = await prisma.cmsPage.findMany({
      where,
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });

    const parsed = pages.map((page) => ({
      ...page,
      dataJson: safeJsonParse(page.dataJson, {}),
    }));

    return res.json(parsed);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return res.status(500).json({ error: "Failed to fetch pages" });
  }
});

// POST / - create page (auto-generate UUID id, stringify dataJson)
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      id,
      slug,
      name,
      title,
      type,
      status,
      displayOrder,
      showInNav,
      parentNav,
      dataJson,
      seoTitle,
      seoDescription,
      seoKeywords,
      shortDescription,
    } = req.body;

    if (!slug || !name) {
      return res.status(400).json({ error: "Slug and name are required" });
    }

    const existing = await prisma.cmsPage.findUnique({
      where: { slug },
    });
    if (existing) {
      return res.status(409).json({ error: "Page with this slug already exists" });
    }

    const pageId = id || randomUUID();

    const page = await prisma.cmsPage.create({
      data: {
        id: pageId,
        slug,
        name,
        title: title || "",
        type: type || "custom",
        status: status || "draft",
        displayOrder: displayOrder !== undefined ? Number(displayOrder) : 0,
        showInNav: showInNav !== undefined ? Boolean(showInNav) : false,
        parentNav: parentNav ?? null,
        dataJson: safeJsonStringify(dataJson, "{}"),
        seoTitle: seoTitle ?? null,
        seoDescription: seoDescription ?? null,
        seoKeywords: seoKeywords ?? null,
        shortDescription: shortDescription ?? null,
      },
    });

    return res.status(201).json({
      ...page,
      dataJson: safeJsonParse(page.dataJson, {}),
    });
  } catch (error) {
    console.error("Error creating page:", error);
    return res.status(500).json({ error: "Failed to create page" });
  }
});

// POST /:id/duplicate - duplicate a page, generate new id and append '-copy' to slug
router.post("/:id/duplicate", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const page = await prisma.cmsPage.findUnique({
      where: { id },
    });

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    // Determine unique slug with '-copy'
    let baseCopySlug = `${page.slug}-copy`;
    let newSlug = baseCopySlug;
    let counter = 1;

    while (await prisma.cmsPage.findUnique({ where: { slug: newSlug } })) {
      counter++;
      newSlug = `${baseCopySlug}-${counter}`;
    }

    const newPageId = randomUUID();

    const duplicated = await prisma.cmsPage.create({
      data: {
        id: newPageId,
        slug: newSlug,
        name: `${page.name} (Copy)`,
        title: page.title,
        type: page.type,
        status: "draft",
        displayOrder: page.displayOrder + 1,
        showInNav: page.showInNav,
        parentNav: page.parentNav,
        dataJson: page.dataJson,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        seoKeywords: page.seoKeywords,
        shortDescription: page.shortDescription,
      },
    });

    return res.status(201).json({
      ...duplicated,
      dataJson: safeJsonParse(duplicated.dataJson, {}),
    });
  } catch (error) {
    console.error("Error duplicating page:", error);
    return res.status(500).json({ error: "Failed to duplicate page" });
  }
});

// GET /:slug/versions - get all versions for a page
router.get("/:slug/versions", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const versions = await prisma.cmsPageVersion.findMany({
      where: { pageSlug: slug },
      orderBy: { createdAt: "desc" },
    });

    const parsedVersions = versions.map((v) => ({
      ...v,
      snapshotJson: safeJsonParse(v.snapshotJson, {}),
    }));

    return res.json(parsedVersions);
  } catch (error) {
    console.error("Error fetching page versions:", error);
    return res.status(500).json({ error: "Failed to fetch page versions" });
  }
});

// POST /:slug/versions - create a version snapshot
router.post("/:slug/versions", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const page = await prisma.cmsPage.findUnique({
      where: { slug },
    });

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    const { author, note, snapshotJson } = req.body;

    const version = await prisma.cmsPageVersion.create({
      data: {
        id: randomUUID(),
        pageSlug: slug,
        author: author || "admin",
        note: note ?? null,
        snapshotJson: safeJsonStringify(
          snapshotJson !== undefined ? snapshotJson : page.dataJson,
          "{}"
        ),
      },
    });

    return res.status(201).json({
      ...version,
      snapshotJson: safeJsonParse(version.snapshotJson, {}),
    });
  } catch (error) {
    console.error("Error creating page version:", error);
    return res.status(500).json({ error: "Failed to create page version" });
  }
});

// GET /:slug - get page by slug with versions
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const page = await prisma.cmsPage.findUnique({
      where: { slug },
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    return res.json({
      ...page,
      dataJson: safeJsonParse(page.dataJson, {}),
      versions: page.versions.map((v) => ({
        ...v,
        snapshotJson: safeJsonParse(v.snapshotJson, {}),
      })),
    });
  } catch (error) {
    console.error("Error fetching page:", error);
    return res.status(500).json({ error: "Failed to fetch page" });
  }
});

// PUT /:id - update page by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      slug,
      name,
      title,
      type,
      status,
      displayOrder,
      showInNav,
      parentNav,
      dataJson,
      seoTitle,
      seoDescription,
      seoKeywords,
      shortDescription,
    } = req.body;

    const data: any = {};
    if (slug !== undefined) data.slug = slug;
    if (name !== undefined) data.name = name;
    if (title !== undefined) data.title = title;
    if (type !== undefined) data.type = type;
    if (status !== undefined) data.status = status;
    if (displayOrder !== undefined) data.displayOrder = Number(displayOrder);
    if (showInNav !== undefined) data.showInNav = Boolean(showInNav);
    if (parentNav !== undefined) data.parentNav = parentNav;
    if (dataJson !== undefined) {
      data.dataJson = safeJsonStringify(dataJson, "{}");
    }
    if (seoTitle !== undefined) data.seoTitle = seoTitle;
    if (seoDescription !== undefined) data.seoDescription = seoDescription;
    if (seoKeywords !== undefined) data.seoKeywords = seoKeywords;
    if (shortDescription !== undefined) data.shortDescription = shortDescription;

    const page = await prisma.cmsPage.update({
      where: { id },
      data,
    });

    return res.json({
      ...page,
      dataJson: safeJsonParse(page.dataJson, {}),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Page not found" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Page slug already in use" });
    }
    console.error("Error updating page:", error);
    return res.status(500).json({ error: "Failed to update page" });
  }
});

// DELETE /:id - delete page by ID (cascades versions)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const page = await prisma.cmsPage.findUnique({
      where: { id },
    });

    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }

    // Explicitly cascade delete versions for SQLite reliability
    await prisma.cmsPageVersion.deleteMany({
      where: { pageSlug: page.slug },
    });

    await prisma.cmsPage.delete({
      where: { id },
    });

    return res.json({ message: "Page and associated versions deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Page not found" });
    }
    console.error("Error deleting page:", error);
    return res.status(500).json({ error: "Failed to delete page" });
  }
});

export default router;
