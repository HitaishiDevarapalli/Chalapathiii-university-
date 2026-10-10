import express, { Request, Response } from "express";
import prisma from "../prisma";

const router = express.Router();

/**
 * GET /api/hero-slides
 * List all hero slides ordered by sortOrder ascending.
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { includeHidden } = req.query;

    const where: { hidden?: boolean } = {};
    if (includeHidden === "false") {
      where.hidden = false;
    }

    const slides = await prisma.heroSlide.findMany({
      where,
      orderBy: {
        sortOrder: "asc",
      },
    });

    return res.status(200).json(slides);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return res.status(500).json({ error: "Failed to fetch hero slides" });
  }
});

/**
 * PUT /api/hero-slides/reorder
 * Bulk update sort orders.
 * Body: Array of { id: number, sortOrder: number } or { items: [...] }
 * NOTE: Defined before PUT /:id to prevent routing collision.
 */
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const items = Array.isArray(req.body) ? req.body : req.body?.items;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Invalid request payload. Expected an array of { id, sortOrder }.",
      });
    }

    const updates = items.map((item: { id: number | string; sortOrder: number | string }) => {
      const id = typeof item.id === "string" ? parseInt(item.id, 10) : item.id;
      const sortOrder =
        typeof item.sortOrder === "string" ? parseInt(item.sortOrder, 10) : item.sortOrder;

      return prisma.heroSlide.update({
        where: { id },
        data: { sortOrder },
      });
    });

    await prisma.$transaction(updates);

    return res.status(200).json({ message: "Hero slides reordered successfully" });
  } catch (error) {
    console.error("Error reordering hero slides:", error);
    return res.status(500).json({ error: "Failed to reorder hero slides" });
  }
});

/**
 * GET /api/hero-slides/:id
 * Retrieve a single hero slide by ID.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid hero slide ID" });
    }

    const slide = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!slide) {
      return res.status(404).json({ error: "Hero slide not found" });
    }

    return res.status(200).json(slide);
  } catch (error) {
    console.error("Error fetching hero slide:", error);
    return res.status(500).json({ error: "Failed to fetch hero slide" });
  }
});

/**
 * POST /api/hero-slides
 * Create a new hero slide.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { image, title, subtitle, hidden, sortOrder } = req.body;

    if (!image || typeof image !== "string" || !image.trim()) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Determine sort order if not explicitly passed
    let computedSortOrder = 0;
    if (sortOrder !== undefined && sortOrder !== null) {
      computedSortOrder = Number(sortOrder) || 0;
    } else {
      const lastSlide = await prisma.heroSlide.findFirst({
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });
      computedSortOrder = lastSlide ? lastSlide.sortOrder + 1 : 0;
    }

    const slide = await prisma.heroSlide.create({
      data: {
        image: image.trim(),
        title: title ? String(title).trim() : "",
        subtitle: subtitle ? String(subtitle).trim() : "",
        hidden: Boolean(hidden),
        sortOrder: computedSortOrder,
      },
    });

    return res.status(201).json(slide);
  } catch (error) {
    console.error("Error creating hero slide:", error);
    return res.status(500).json({ error: "Failed to create hero slide" });
  }
});

/**
 * PUT /api/hero-slides/:id
 * Update a hero slide by ID.
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid hero slide ID" });
    }

    const existing = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Hero slide not found" });
    }

    const { image, title, subtitle, hidden, sortOrder } = req.body;

    const dataToUpdate: {
      image?: string;
      title?: string;
      subtitle?: string;
      hidden?: boolean;
      sortOrder?: number;
    } = {};

    if (image !== undefined) dataToUpdate.image = String(image).trim();
    if (title !== undefined) dataToUpdate.title = String(title).trim();
    if (subtitle !== undefined) dataToUpdate.subtitle = String(subtitle).trim();
    if (hidden !== undefined) dataToUpdate.hidden = Boolean(hidden);
    if (sortOrder !== undefined) dataToUpdate.sortOrder = Number(sortOrder) || 0;

    const updated = await prisma.heroSlide.update({
      where: { id },
      data: dataToUpdate,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating hero slide:", error);
    return res.status(500).json({ error: "Failed to update hero slide" });
  }
});

/**
 * DELETE /api/hero-slides/:id
 * Delete a hero slide by ID.
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid hero slide ID" });
    }

    const existing = await prisma.heroSlide.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Hero slide not found" });
    }

    await prisma.heroSlide.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Hero slide deleted successfully" });
  } catch (error) {
    console.error("Error deleting hero slide:", error);
    return res.status(500).json({ error: "Failed to delete hero slide" });
  }
});

export default router;
