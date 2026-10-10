import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// ============================================================================
// GET / - List all registrations with optional filtering & search
// Query params: ?eventId=X&status=X&search=X
// Order by: registeredAt desc
// ============================================================================
router.get("/", async (req: Request, res: Response) => {
  try {
    const { eventId, status, search } = req.query;

    const where: any = {};

    if (eventId !== undefined && eventId !== "") {
      const parsedEventId = parseInt(String(eventId), 10);
      if (!isNaN(parsedEventId)) {
        where.eventId = parsedEventId;
      }
    }

    if (status !== undefined && status !== "") {
      where.status = String(status);
    }

    if (search) {
      const q = String(search).trim();
      if (q) {
        where.OR = [
          { fullName: { contains: q } },
          { email: { contains: q } },
          { phone: { contains: q } },
          { eventTitle: { contains: q } },
        ];
      }
    }

    const registrations = await prisma.eventRegistration.findMany({
      where,
      orderBy: { registeredAt: "desc" },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            location: true,
            category: true,
          },
        },
      },
    });

    res.json(registrations);
  } catch (error: any) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ error: "Failed to fetch registrations", details: error.message });
  }
});

// ============================================================================
// GET /:id - Get single registration by UUID
// ============================================================================
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const registration = await prisma.eventRegistration.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            location: true,
            category: true,
          },
        },
      },
    });

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    res.json(registration);
  } catch (error: any) {
    console.error("Error fetching registration:", error);
    res.status(500).json({ error: "Failed to fetch registration", details: error.message });
  }
});

// ============================================================================
// POST / - Create a new event registration
// ============================================================================
router.post("/", async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, eventId, eventTitle, status } = req.body;

    if (!fullName || String(fullName).trim() === "") {
      return res.status(400).json({ error: "Full name is required" });
    }

    if (!email || String(email).trim() === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    if (eventId === undefined || eventId === null) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    const parsedEventId = parseInt(String(eventId), 10);
    if (isNaN(parsedEventId)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    // Verify event exists and obtain title if not provided
    const targetEvent = await prisma.event.findUnique({
      where: { id: parsedEventId },
    });

    if (!targetEvent) {
      return res.status(404).json({ error: `Event with ID ${parsedEventId} not found` });
    }

    const resolvedTitle = eventTitle && String(eventTitle).trim() !== ""
      ? String(eventTitle).trim()
      : targetEvent.title;

    const registration = await prisma.eventRegistration.create({
      data: {
        fullName: String(fullName).trim(),
        email: String(email).trim(),
        phone: phone !== undefined ? String(phone).trim() : "",
        eventId: parsedEventId,
        eventTitle: resolvedTitle,
        status: status ? String(status).trim() : "Confirmed",
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            location: true,
          },
        },
      },
    });

    res.status(201).json(registration);
  } catch (error: any) {
    console.error("Error creating event registration:", error);
    res.status(500).json({ error: "Failed to create registration", details: error.message });
  }
});

// ============================================================================
// PUT /:id - Update event registration (status, etc.)
// ============================================================================
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.eventRegistration.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Registration not found" });
    }

    const { status, fullName, email, phone, eventTitle } = req.body;

    const data: any = {};
    if (status !== undefined) data.status = String(status).trim();
    if (fullName !== undefined) data.fullName = String(fullName).trim();
    if (email !== undefined) data.email = String(email).trim();
    if (phone !== undefined) data.phone = String(phone).trim();
    if (eventTitle !== undefined) data.eventTitle = String(eventTitle).trim();

    const updated = await prisma.eventRegistration.update({
      where: { id },
      data,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            time: true,
            location: true,
          },
        },
      },
    });

    res.json(updated);
  } catch (error: any) {
    console.error("Error updating event registration:", error);
    res.status(500).json({ error: "Failed to update registration", details: error.message });
  }
});

// ============================================================================
// DELETE /:id - Delete event registration
// ============================================================================
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.eventRegistration.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Registration not found" });
    }

    await prisma.eventRegistration.delete({
      where: { id },
    });

    res.json({ message: "Registration deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting event registration:", error);
    res.status(500).json({ error: "Failed to delete registration", details: error.message });
  }
});

export default router;
