import { Router, Request, Response } from "express";
import prisma from "../prisma";

import { requireAuth } from "../middleware/auth";
import { SESSION_PREFIX } from "../sessionStore";
import { authenticatedUser } from "../middleware/auth";
import { isInternalConfig, visibleConfig } from "../security/apiPermissions";
import { permitted } from "../security/core";
const router = Router();
const reserved = (key: string) => key.startsWith(SESSION_PREFIX) || isInternalConfig(key) || ["news", "events"].includes(key);


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
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    await authenticatedUser(req);
    const { action, slug } = req.query;

    if (action === "revision") {
      const [latestConfig, latestPage] = await Promise.all([
        prisma.siteConfig.findFirst({ orderBy: { updatedAt: "desc" }, select: { id: true, updatedAt: true } }),
        prisma.cmsPage.findFirst({ orderBy: { updatedAt: "desc" }, select: { id: true, updatedAt: true } }),
      ]);
      return res.json({ success: true, revision: `${latestConfig?.id || 0}:${latestConfig?.updatedAt.toISOString() || ""}|${latestPage?.id || ""}:${latestPage?.updatedAt.toISOString() || ""}` });
    }

    if (action === "getPage" && slug) {
      const pageRecord = await prisma.cmsPage.findUnique({
        where: { slug: String(slug) },
      });
      if (pageRecord) {
        if (pageRecord.status !== "published" && !permitted(req.adminUser, "pages.view")) return res.sendStatus(404);
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
      prisma.cmsPage.findMany({ where: permitted(req.adminUser, "pages.view") ? undefined : { status: "published" }, orderBy: { displayOrder: "asc" } }),
      prisma.siteConfig.findMany(),
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
      if (reserved(c.key) || !visibleConfig(req, c.key)) continue;
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
    return res.status(500).json({ success: false, error: "Unable to load published content" });
  }
});

// POST /api/cms
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { action, page, slug, id } = req.body || {};

    if (action === "savePage" && page && page.slug) {
      const existing = await prisma.cmsPage.findUnique({ where: { slug: page.slug } });
      if (page.type === "visual" || existing?.type === "visual" || page.slug.startsWith("/pages/")) return res.status(409).json({ error: "Use Page Builder to manage this page" });
      const dataToStore = {
        sections: page.sections || [],
        customData: page.customData || {},
        tableData: page.tableData || null,
        navLabel: page.navLabel || page.name || page.title || "",
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
      const target = slug ? await prisma.cmsPage.findUnique({ where: { slug } }) : id ? await prisma.cmsPage.findUnique({ where: { id } }) : null;
      if (target?.type === "visual") return res.status(409).json({ error: "Use Page Builder to archive this page" });
      if (slug) {
        await prisma.cmsPage.delete({ where: { slug } });
      } else if (id) {
        await prisma.cmsPage.delete({ where: { id } });
      }
      return res.json({ success: true });
    }

    if (action === "saveAll") {
      const { pages, settings, collections } = req.body || {};

      await prisma.$transaction(async (prisma) => {
      // Upsert CMS pages
      if (Array.isArray(pages)) {
        for (const p of pages) {
          if (!p.slug) continue;
          if (p.type === "visual" || p.slug.startsWith("/pages/") || (await prisma.cmsPage.findUnique({ where: { slug: p.slug } }))?.type === "visual") continue;
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
          });
        }
      }

      // Upsert all settings & collections into site_configs table
      const combinedConfigs: Record<string, any> = {
        ...(settings || {}),
        ...(collections || {}),
      };

      for (const [k, v] of Object.entries(combinedConfigs)) {
        if (!k || reserved(k) || v === undefined) continue;
        const valStr = typeof v === "string" ? v : JSON.stringify(v);
        await prisma.siteConfig.upsert({
          where: { key: k },
          update: { valueJson: valStr },
          create: { key: k, valueJson: valStr },
        });
      }

      });
      return res.json({ success: true, message: "All CMS pages and site configs saved successfully" });
    }

    return res.json({ success: true });
  } catch (err: any) {
    console.error("Error in /api/cms POST:", err);
    return res.status(500).json({ success: false, error: "Publishing failed; changes were not saved" });
  }
});

export default router;
