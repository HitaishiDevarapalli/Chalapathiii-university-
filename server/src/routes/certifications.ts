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

// GET / - list all certifications
router.get("/", async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { provider: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const certifications = await prisma.certification.findMany({
      where,
      orderBy: { id: "asc" },
    });

    const parsed = certifications.map((c) => ({
      ...c,
      dataJson: safeJsonParse(c.dataJson, {}),
    }));

    return res.json(parsed);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return res.status(500).json({ error: "Failed to fetch certifications" });
  }
});

// GET /:id - get certification by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid certification ID" });
    }

    const certification = await prisma.certification.findUnique({
      where: { id },
    });

    if (!certification) {
      return res.status(404).json({ error: "Certification not found" });
    }

    return res.json({
      ...certification,
      dataJson: safeJsonParse(certification.dataJson, {}),
    });
  } catch (error) {
    console.error("Error fetching certification:", error);
    return res.status(500).json({ error: "Failed to fetch certification" });
  }
});

// POST / - create certification
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, provider, description, image, dataJson } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const certification = await prisma.certification.create({
      data: {
        title,
        provider: provider || "",
        description: description || "",
        image: image || "",
        dataJson: safeJsonStringify(dataJson, "{}"),
      },
    });

    return res.status(201).json({
      ...certification,
      dataJson: safeJsonParse(certification.dataJson, {}),
    });
  } catch (error) {
    console.error("Error creating certification:", error);
    return res.status(500).json({ error: "Failed to create certification" });
  }
});

// PUT /:id - update certification
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid certification ID" });
    }

    const { title, provider, description, image, dataJson } = req.body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (provider !== undefined) data.provider = provider;
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (dataJson !== undefined) {
      data.dataJson = safeJsonStringify(dataJson, "{}");
    }

    const certification = await prisma.certification.update({
      where: { id },
      data,
    });

    return res.json({
      ...certification,
      dataJson: safeJsonParse(certification.dataJson, {}),
    });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Certification not found" });
    }
    console.error("Error updating certification:", error);
    return res.status(500).json({ error: "Failed to update certification" });
  }
});

// DELETE /:id - delete certification
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid certification ID" });
    }

    await prisma.certification.delete({
      where: { id },
    });

    return res.json({ message: "Certification deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Certification not found" });
    }
    console.error("Error deleting certification:", error);
    return res.status(500).json({ error: "Failed to delete certification" });
  }
});

export default router;
