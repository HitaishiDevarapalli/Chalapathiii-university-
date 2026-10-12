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

// Helper to format event output with parsed images
function formatEvent<T extends { images: string }>(event: T) {
  return {
    ...event,
    images: parseImages(event.images),
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

// POST /sync - Bulk sync from frontend
router.post("/sync", async (req: Request, res: Response) => {
  try {
    const { events } = req.body;
    if (!Array.isArray(events)) return res.status(400).json({ error: "Invalid events array" });

    // 1. Get existing IDs
    const existing = await prisma.event.findMany({ select: { id: true } });
    const existingIds = existing.map(e => e.id);
    const incomingIds = events.filter(e => e.id).map(e => Number(e.id));

    // 2. Delete ones that are no longer in the array
    const toDelete = existingIds.filter(id => !incomingIds.includes(id));
    if (toDelete.length > 0) {
      await prisma.event.deleteMany({ where: { id: { in: toDelete } } });
    }

    // 3. Upsert events
    for (const ev of events) {
      const finalSlug = ev.slug || slugify(ev.title || `event-${Date.now()}`);
      let imagesStr = "[]";
      if (ev.images) {
        imagesStr = Array.isArray(ev.images) ? JSON.stringify(ev.images) : ev.images;
      }

      const data = {
        title: ev.title || "Untitled Event",
        slug: finalSlug,
        date: ev.date || new Date().toISOString().split("T")[0],
        time: ev.time || "",
        location: ev.location || "",
        category: ev.category || "General",
        image: ev.image || "",
        images: imagesStr,
        bodyText: ev.bodyText || "",
        registrationUrl: ev.registrationUrl || null,
        registrationOpen: ev.registrationOpen !== false
      };

      if (ev.id) {
        await prisma.event.upsert({
          where: { id: Number(ev.id) },
          update: data,
          create: { id: Number(ev.id), ...data }
        });
      } else {
        await prisma.event.create({ data });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error syncing events:", error);
    return res.status(500).json({ error: "Failed to sync events" });
  }
});

// GET / - List all events with optional filters (category, search)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const whereConditions: any = {};

    if (category) {
      whereConditions.category = String(category);
    }

    if (search) {
      const searchStr = String(search);
      whereConditions.OR = [
        { title: { contains: searchStr } },
        { location: { contains: searchStr } },
        { bodyText: { contains: searchStr } },
        { category: { contains: searchStr } },
      ];
    }

    const events = await prisma.event.findMany({
      where: whereConditions,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(events.map(formatEvent));
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
});

// GET /:slug - Find single event by slug with registrations included
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        registrations: {
          orderBy: { registeredAt: "desc" },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json(formatEvent(event));
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    return res.status(500).json({ error: "Failed to fetch event" });
  }
});

// POST / - Create a new event
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug: customSlug,
      date,
      time,
      location,
      category,
      image,
      images,
      bodyText,
      registrationUrl,
      registrationOpen,
    } = req.body;

    if (!title || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }

    // Generate slug from title if not explicitly provided
    let finalSlug = customSlug ? slugify(customSlug) : slugify(title);
    if (!finalSlug) {
      finalSlug = `event-${Date.now()}`;
    }

    // Ensure unique slug
    const existing = await prisma.event.findUnique({
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

    const createdEvent = await prisma.event.create({
      data: {
        title,
        slug: finalSlug,
        date,
        time: time ?? "",
        location: location ?? "",
        category: category ?? "General",
        image: image ?? "",
        images: imagesStr,
        bodyText: bodyText ?? "",
        registrationUrl: registrationUrl ?? null,
        registrationOpen:
          registrationOpen !== undefined ? Boolean(registrationOpen) : true,
      },
    });

    return res.status(201).json(formatEvent(createdEvent));
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ error: "Failed to create event" });
  }
});

// PUT /:id - Update event by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const existing = await prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Event not found" });
    }

    const updateData: any = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.slug !== undefined) updateData.slug = slugify(req.body.slug);
    if (req.body.date !== undefined) updateData.date = req.body.date;
    if (req.body.time !== undefined) updateData.time = req.body.time;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.bodyText !== undefined) updateData.bodyText = req.body.bodyText;
    if (req.body.image !== undefined) updateData.image = req.body.image;
    if (req.body.registrationUrl !== undefined)
      updateData.registrationUrl = req.body.registrationUrl;
    if (req.body.registrationOpen !== undefined)
      updateData.registrationOpen = Boolean(req.body.registrationOpen);

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

    const updated = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(formatEvent(updated));
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ error: "Failed to update event" });
  }
});

// DELETE /:id - Delete event by ID (cascades to registrations)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const existing = await prisma.event.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Event not found" });
    }

    await prisma.event.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
