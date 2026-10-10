import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// Helper to safely parse JSON strings for images
function parseImages(imagesStr: string | null | undefined): string[] {
  if (!imagesStr) return [];
  try {
    const parsed = JSON.parse(imagesStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Helper to format article output with parsed images
function formatArticle<T extends { images: string }>(article: T) {
  return {
    ...article,
    images: parseImages(article.images),
  };
}

// Helper to create a URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET / - List all news articles with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, featured, search, hidden } = req.query;

    const whereConditions: any = {};

    if (category) {
      whereConditions.category = String(category);
    }

    if (featured !== undefined) {
      whereConditions.featured = featured === "true";
    }

    if (hidden !== undefined) {
      whereConditions.hidden = hidden === "true";
    }

    if (search) {
      const searchStr = String(search);
      whereConditions.OR = [
        { title: { contains: searchStr } },
        { excerpt: { contains: searchStr } },
        { bodyText: { contains: searchStr } },
        { location: { contains: searchStr } },
      ];
    }

    const articles = await prisma.newsArticle.findMany({
      where: whereConditions,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(articles.map(formatArticle));
  } catch (error) {
    console.error("Error fetching news articles:", error);
    return res.status(500).json({ error: "Failed to fetch news articles" });
  }
});

// GET /:slug - Get single news article by slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const article = await prisma.newsArticle.findUnique({
      where: { slug },
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    return res.status(200).json(formatArticle(article));
  } catch (error) {
    console.error("Error fetching news article by slug:", error);
    return res.status(500).json({ error: "Failed to fetch article" });
  }
});

// POST / - Create a new news article
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug: customSlug,
      date,
      time,
      location,
      category,
      excerpt,
      bodyText,
      image,
      images,
      sourceUrl,
      featured,
      readTime,
      hidden,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Generate slug from title if not explicitly provided
    let finalSlug = customSlug ? slugify(customSlug) : slugify(title);
    if (!finalSlug) {
      finalSlug = `news-${Date.now()}`;
    }

    // Ensure unique slug
    const existing = await prisma.newsArticle.findUnique({
      where: { slug: finalSlug },
    });
    if (existing) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    // Stringify images array
    let imagesStr = "[]";
    if (images) {
      if (Array.isArray(images)) {
        imagesStr = JSON.stringify(images);
      } else if (typeof images === "string") {
        try {
          JSON.parse(images);
          imagesStr = images;
        } catch {
          imagesStr = JSON.stringify([images]);
        }
      }
    }

    const createdArticle = await prisma.newsArticle.create({
      data: {
        title,
        slug: finalSlug,
        date: date || new Date().toISOString().split("T")[0],
        time: time ?? "",
        location: location ?? "",
        category: category ?? "General",
        excerpt: excerpt ?? "",
        bodyText: bodyText ?? "",
        image: image ?? "",
        images: imagesStr,
        sourceUrl: sourceUrl ?? null,
        featured: featured !== undefined ? Boolean(featured) : false,
        readTime: readTime ?? null,
        hidden: hidden !== undefined ? Boolean(hidden) : false,
      },
    });

    return res.status(201).json(formatArticle(createdArticle));
  } catch (error) {
    console.error("Error creating news article:", error);
    return res.status(500).json({ error: "Failed to create article" });
  }
});

// PUT /:id - Update news article by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    const existing = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Article not found" });
    }

    const updateData: any = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.slug !== undefined) updateData.slug = slugify(req.body.slug);
    if (req.body.date !== undefined) updateData.date = req.body.date;
    if (req.body.time !== undefined) updateData.time = req.body.time;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.excerpt !== undefined) updateData.excerpt = req.body.excerpt;
    if (req.body.bodyText !== undefined) updateData.bodyText = req.body.bodyText;
    if (req.body.image !== undefined) updateData.image = req.body.image;
    if (req.body.sourceUrl !== undefined) updateData.sourceUrl = req.body.sourceUrl;
    if (req.body.featured !== undefined) updateData.featured = Boolean(req.body.featured);
    if (req.body.readTime !== undefined) updateData.readTime = req.body.readTime;
    if (req.body.hidden !== undefined) updateData.hidden = Boolean(req.body.hidden);

    if (req.body.images !== undefined) {
      if (Array.isArray(req.body.images)) {
        updateData.images = JSON.stringify(req.body.images);
      } else if (typeof req.body.images === "string") {
        try {
          JSON.parse(req.body.images);
          updateData.images = req.body.images;
        } catch {
          updateData.images = JSON.stringify([req.body.images]);
        }
      }
    }

    const updated = await prisma.newsArticle.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(formatArticle(updated));
  } catch (error) {
    console.error("Error updating news article:", error);
    return res.status(500).json({ error: "Failed to update article" });
  }
});

// DELETE /:id - Delete news article by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid article ID" });
    }

    const existing = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Article not found" });
    }

    await prisma.newsArticle.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting news article:", error);
    return res.status(500).json({ error: "Failed to delete article" });
  }
});

export default router;
