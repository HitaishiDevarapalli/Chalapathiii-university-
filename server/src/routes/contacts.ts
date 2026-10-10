import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

// ============================================================================
// Helpers for JSON Array parsing & stringifying (SQLite compatibility)
// ============================================================================
function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }
}

function stringifyJsonArray(value: any): string {
  if (value === undefined || value === null) return "[]";
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return value;
      return JSON.stringify([parsed]);
    } catch {
      const items = value.split(",").map((s) => s.trim()).filter(Boolean);
      return JSON.stringify(items);
    }
  }
  return JSON.stringify([value]);
}

function formatDepartmentContact(contact: any) {
  return {
    ...contact,
    phones: parseJsonArray(contact.phones),
    emails: parseJsonArray(contact.emails),
  };
}

// ============================================================================
// GET / - List all department contacts (phones & emails parsed as JSON arrays)
// Optional query: ?search=X
// ============================================================================
router.get("/", async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const where: any = {};
    if (search) {
      const q = String(search).trim();
      if (q) {
        where.OR = [
          { name: { contains: q } },
          { contactPerson: { contains: q } },
          { note: { contains: q } },
          { phones: { contains: q } },
          { emails: { contains: q } },
        ];
      }
    }

    const contacts = await prisma.departmentContact.findMany({
      where,
      orderBy: { name: "asc" },
    });

    res.json(contacts.map(formatDepartmentContact));
  } catch (error: any) {
    console.error("Error fetching department contacts:", error);
    res.status(500).json({ error: "Failed to fetch department contacts", details: error.message });
  }
});

// ============================================================================
// GET /:id - Get single department contact by ID (UUID)
// ============================================================================
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const contact = await prisma.departmentContact.findUnique({
      where: { id },
    });

    if (!contact) {
      return res.status(404).json({ error: "Department contact not found" });
    }

    res.json(formatDepartmentContact(contact));
  } catch (error: any) {
    console.error("Error fetching department contact:", error);
    res.status(500).json({ error: "Failed to fetch department contact", details: error.message });
  }
});

// ============================================================================
// POST / - Create a new department contact (phones & emails stringified)
// ============================================================================
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, contactPerson, phones, emails, note } = req.body;

    if (!name || String(name).trim() === "") {
      return res.status(400).json({ error: "Department name is required" });
    }

    const contact = await prisma.departmentContact.create({
      data: {
        name: String(name).trim(),
        contactPerson: contactPerson !== undefined && contactPerson !== null ? String(contactPerson).trim() : null,
        phones: stringifyJsonArray(phones),
        emails: stringifyJsonArray(emails),
        note: note !== undefined && note !== null ? String(note).trim() : null,
      },
    });

    res.status(201).json(formatDepartmentContact(contact));
  } catch (error: any) {
    console.error("Error creating department contact:", error);
    res.status(500).json({ error: "Failed to create department contact", details: error.message });
  }
});

// ============================================================================
// PUT /:id - Update department contact (phones & emails stringified)
// ============================================================================
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.departmentContact.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Department contact not found" });
    }

    const { name, contactPerson, phones, emails, note } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = String(name).trim();
    if (contactPerson !== undefined) {
      data.contactPerson = contactPerson !== null ? String(contactPerson).trim() : null;
    }
    if (phones !== undefined) {
      data.phones = stringifyJsonArray(phones);
    }
    if (emails !== undefined) {
      data.emails = stringifyJsonArray(emails);
    }
    if (note !== undefined) {
      data.note = note !== null ? String(note).trim() : null;
    }

    const updated = await prisma.departmentContact.update({
      where: { id },
      data,
    });

    res.json(formatDepartmentContact(updated));
  } catch (error: any) {
    console.error("Error updating department contact:", error);
    res.status(500).json({ error: "Failed to update department contact", details: error.message });
  }
});

// ============================================================================
// DELETE /:id - Delete department contact
// ============================================================================
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.departmentContact.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: "Department contact not found" });
    }

    await prisma.departmentContact.delete({
      where: { id },
    });

    res.json({ message: "Department contact deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting department contact:", error);
    res.status(500).json({ error: "Failed to delete department contact", details: error.message });
  }
});

export default router;
