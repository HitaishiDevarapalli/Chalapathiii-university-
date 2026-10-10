import express, { Request, Response } from "express";
import prisma from "../prisma";

const router = express.Router();

/**
 * GET /api/announcements
 * List all announcements ordered by sortOrder ascending.
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });
    return res.status(200).json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

/**
 * PUT /api/announcements/reorder
 * Bulk update sort orders.
 * Body: Array of { id: number, sortOrder: number } or { items: [...] }
 * NOTE: Must be defined before PUT /:id to prevent routing collision.
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

      return prisma.announcement.update({
        where: { id },
        data: { sortOrder },
      });
    });

    await prisma.$transaction(updates);

    return res.status(200).json({ message: "Announcements reordered successfully" });
  } catch (error) {
    console.error("Error reordering announcements:", error);
    return res.status(500).json({ error: "Failed to reorder announcements" });
  }
});

/**
 * GET /api/announcements/:id
 * Retrieve a single announcement by ID.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid announcement ID" });
    }

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    return res.status(200).json(announcement);
  } catch (error) {
    console.error("Error fetching announcement:", error);
    return res.status(500).json({ error: "Failed to fetch announcement" });
  }
});

/**
 * POST /api/announcements
 * Create a new announcement.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, date, iconName, sortOrder } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const formattedDate =
      date && typeof date === "string" && date.trim()
        ? date.trim()
        : new Date().toISOString().split("T")[0];

    // If sortOrder is not provided, calculate max sortOrder + 1
    let computedSortOrder = 0;
    if (sortOrder !== undefined && sortOrder !== null) {
      computedSortOrder = Number(sortOrder) || 0;
    } else {
      const lastItem = await prisma.announcement.findFirst({
        orderBy: { sortOrder: "desc" },
        select: { sortOrder: true },
      });
      computedSortOrder = lastItem ? lastItem.sortOrder + 1 : 0;
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: title.trim(),
        description: description ? String(description).trim() : "",
        date: formattedDate,
        iconName: iconName ? String(iconName).trim() : "Bell",
        sortOrder: computedSortOrder,
      },
    });

    return res.status(201).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({ error: "Failed to create announcement" });
  }
});

/**
 * PUT /api/announcements/:id
 * Update an announcement by ID.
 */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid announcement ID" });
    }

    const existing = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    const { title, description, date, iconName, sortOrder } = req.body;

    const dataToUpdate: {
      title?: string;
      description?: string;
      date?: string;
      iconName?: string;
      sortOrder?: number;
    } = {};

    if (title !== undefined) dataToUpdate.title = String(title).trim();
    if (description !== undefined) dataToUpdate.description = String(description).trim();
    if (date !== undefined) dataToUpdate.date = String(date).trim();
    if (iconName !== undefined) dataToUpdate.iconName = String(iconName).trim();
    if (sortOrder !== undefined) dataToUpdate.sortOrder = Number(sortOrder) || 0;

    const updated = await prisma.announcement.update({
      where: { id },
      data: dataToUpdate,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating announcement:", error);
    return res.status(500).json({ error: "Failed to update announcement" });
  }
});

/**
 * DELETE /api/announcements/:id
 * Delete an announcement by ID.
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid announcement ID" });
    }

    const existing = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return res.status(500).json({ error: "Failed to delete announcement" });
  }
});

export default router;
