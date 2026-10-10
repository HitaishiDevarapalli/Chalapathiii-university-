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

// GET / - list all programs with optional filters
router.get("/", async (req: Request, res: Response) => {
  try {
    const { school, department, level, search } = req.query;
    const where: any = {};

    if (school && typeof school === "string") {
      where.school = school;
    }
    if (department && typeof department === "string") {
      where.department = department;
    }
    if (level && typeof level === "string") {
      where.level = level;
    }
    if (search && typeof search === "string") {
      where.OR = [
        { name: { contains: search } },
        { slug: { contains: search } },
        { department: { contains: search } },
        { school: { contains: search } },
      ];
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: { name: "asc" },
    });

    const parsed = programs.map((p) => ({
      ...p,
      dataJson: safeJsonParse(p.dataJson, {}),
    }));

    return res.json(parsed);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return res.status(500).json({ error: "Failed to fetch programs" });
  }
});

// GET /:slug - get single program by slug (also falls back to id if numeric)
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    let program = await prisma.program.findUnique({
      where: { slug },
    });

    if (!program && /^\d+$/.test(slug)) {
      program = await prisma.program.findUnique({
        where: { id: parseInt(slug, 10) },
      });
    }

    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }

    return res.json({
      ...program,
      dataJson: safeJsonParse(program.dataJson, {}),
    });
  } catch (error) {
    console.error("Error fetching program:", error);
    return res.status(500).json({ error: "Failed to fetch program" });
  }
});

// POST / - create a new program
router.post("/", async (req: Request, res: Response) => {
  try {
    const { slug, name, school, department, level, duration, dataJson } = req.body;

    if (!slug || !name) {
      return res.status(400).json({ error: "Slug and name are required" });
    }

    const existing = await prisma.program.findUnique({
      where: { slug },
    });
    if (existing) {
      return res.status(409).json({ error: "Program with this slug already exists" });
    }

    const program = await prisma.program.create({
      data: {
        slug,
        name,
        school: school || "",
        department: department || "",
        level: level || "",
        duration: duration || "",
        dataJson: safeJsonStringify(dataJson, "{}"),
      },
    });

    return res.status(201).json({
      ...program,
      dataJson: safeJsonParse(program.dataJson, {}),
    });
  } catch (error) {
    console.error("Error creating program:", error);
    return res.status(500).json({ error: "Failed to create program" });
  }
});

// PUT /:id - update program by numeric ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid program ID" });
    }

    const { slug, name, school, department, level, duration, dataJson } = req.body;

    const data: any = {};
    if (slug !== undefined) data.slug = slug;
    if (name !== undefined) data.name = name;
    if (school !== undefined) data.school = school;
    if (department !== undefined) data.department = department;
    if (level !== undefined) data.level = level;
    if (duration !== undefined) data.duration = duration;
    if (dataJson !== undefined) {
      data.dataJson = safeJsonStringify(dataJson, "{}");
    }

    const program = await prisma.program.update({
      where: { id },
      data,
    });

    return res.json({
      ...program,
      dataJson: safeJsonParse(program.dataJson, {}),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Program not found" });
    }
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Program slug already in use" });
    }
    console.error("Error updating program:", error);
    return res.status(500).json({ error: "Failed to update program" });
  }
});

// DELETE /:id - delete program by numeric ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid program ID" });
    }

    await prisma.program.delete({
      where: { id },
    });

    return res.json({ message: "Program deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Program not found" });
    }
    console.error("Error deleting program:", error);
    return res.status(500).json({ error: "Failed to delete program" });
  }
});

export default router;
