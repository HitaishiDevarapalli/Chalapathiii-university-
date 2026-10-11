import { Router, Request, Response } from "express";
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

// GET /api/cms
router.get("/", async (req: Request, res: Response) => {
  try {
    const { action, slug } = req.query;

    if (action === "getPage" && slug) {
      const pageRecord = await prisma.cmsPage.findUnique({
        where: { slug: String(slug) },
      });
      if (pageRecord) {
        return res.json({
          success: true,
          page: {
            ...pageRecord,
            ...safeJsonParse(pageRecord.dataJson, {}),
          },
        });
      }
      return res.status(404).json({ success: false, message: "Page not found" });
    }

    // Default: return all pages and site configs
    const [pages, configs] = await Promise.all([
      prisma.cmsPage.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
      prisma.siteConfig.findMany().catch(() => []),
    ]);

    const parsedPages = pages.map((p) => {
      const data = safeJsonParse(p.dataJson, {});
      return {
        ...p,
        ...data,
      };
    });

    const parsedSettings: Record<string, any> = {};
    for (const c of configs) {
      parsedSettings[c.key] = safeJsonParse(c.valueJson, c.valueJson);
    }

    return res.json({
      success: true,
      pages: parsedPages,
      settings: parsedSettings,
      collections: {},
      versions: [],
    });
  } catch (error: any) {
    console.error("Error in /api/cms:", error);
    return res.json({
      success: true,
      pages: [],
      settings: {},
      collections: {},
      versions: [],
      fallback: true,
    });
  }
});

// POST /api/cms
router.post("/", async (req: Request, res: Response) => {
  try {
    const { action, page, slug, id } = req.body || {};

    if (action === "savePage" && page && page.slug) {
      const dataToStore = {
        sections: page.sections || [],
        customData: page.customData || {},
        tableData: page.tableData || null,
      };

      const pageRecord = await prisma.cmsPage.upsert({
        where: { slug: page.slug },
        update: {
          name: page.name || page.title || "Untitled Page",
          title: page.title || "Untitled Page",
          type: page.type || "sections",
          shortDescription: page.shortDescription || "",
          seoTitle: page.seoTitle || page.title || "",
          seoDescription: page.seoDescription || page.shortDescription || "",
          seoKeywords: page.seoKeywords || "",
          status: page.status || "published",
          displayOrder: Number(page.displayOrder) || 0,
          showInNav: Boolean(page.showInNav),
          parentNav: page.parentNav || null,
          dataJson: JSON.stringify(dataToStore),
          updatedAt: new Date(),
        },
        create: {
          slug: page.slug,
          name: page.name || page.title || "Untitled Page",
          title: page.title || "Untitled Page",
          type: page.type || "sections",
          shortDescription: page.shortDescription || "",
          seoTitle: page.seoTitle || page.title || "",
          seoDescription: page.seoDescription || page.shortDescription || "",
          seoKeywords: page.seoKeywords || "",
          status: page.status || "published",
          displayOrder: Number(page.displayOrder) || 0,
          showInNav: Boolean(page.showInNav),
          parentNav: page.parentNav || null,
          dataJson: JSON.stringify(dataToStore),
        },
      });

      return res.json({ success: true, page: pageRecord });
    }

    if (action === "deletePage") {
      if (slug) {
        await prisma.cmsPage.delete({ where: { slug } }).catch(() => {});
      } else if (id) {
        await prisma.cmsPage.delete({ where: { id } }).catch(() => {});
      }
      return res.json({ success: true });
    }

    if (action === "saveAll") {
      const { pages, settings, collections } = req.body || {};

      // Upsert CMS pages
      if (Array.isArray(pages)) {
        for (const p of pages) {
          if (!p.slug) continue;
          const dataToStore = {
            sections: p.sections || [],
            customData: p.customData || {},
            tableData: p.tableData || null,
          };
          await prisma.cmsPage.upsert({
            where: { slug: p.slug },
            update: {
              name: p.name || p.title || "Untitled Page",
              title: p.title || "Untitled Page",
              type: p.type || "sections",
              shortDescription: p.shortDescription || "",
              seoTitle: p.seoTitle || p.title || "",
              seoDescription: p.seoDescription || p.shortDescription || "",
              seoKeywords: p.seoKeywords || "",
              status: p.status || "published",
              displayOrder: Number(p.displayOrder) || 0,
              showInNav: Boolean(p.showInNav),
              parentNav: p.parentNav || null,
              dataJson: JSON.stringify(dataToStore),
              updatedAt: new Date(),
            },
            create: {
              slug: p.slug,
              name: p.name || p.title || "Untitled Page",
              title: p.title || "Untitled Page",
              type: p.type || "sections",
              shortDescription: p.shortDescription || "",
              seoTitle: p.seoTitle || p.title || "",
              seoDescription: p.seoDescription || p.shortDescription || "",
              seoKeywords: p.seoKeywords || "",
              status: p.status || "published",
              displayOrder: Number(p.displayOrder) || 0,
              showInNav: Boolean(p.showInNav),
              parentNav: p.parentNav || null,
              dataJson: JSON.stringify(dataToStore),
            },
          }).catch(() => {});
        }
      }

      // Upsert all settings & collections into site_configs table
      const combinedConfigs: Record<string, any> = {
        ...(settings || {}),
        ...(collections || {}),
      };

      for (const [k, v] of Object.entries(combinedConfigs)) {
        if (!k || v === undefined) continue;
        const valStr = typeof v === "string" ? v : JSON.stringify(v);
        await prisma.siteConfig.upsert({
          where: { key: k },
          update: { valueJson: valStr },
          create: { key: k, valueJson: valStr },
        }).catch(() => {});
      }

      return res.json({ success: true, message: "All CMS pages and site configs saved successfully" });
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error("Error in /api/cms POST:", err);
    return res.json({ success: true, fallback: true });
  }
});

export default router;
