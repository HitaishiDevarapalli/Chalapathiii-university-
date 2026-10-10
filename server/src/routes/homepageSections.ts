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

function safeJsonStringify(val: any, fallback: string | null = null): string | null {
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

// GET / - list all sections ordered by sortOrder
router.get("/", async (req: Request, res: Response) => {
  try {
    const sections = await prisma.homepageSection.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const parsed = sections.map((s) => ({
      ...s,
      extraData: safeJsonParse(s.extraData, null),
    }));

    return res.json(parsed);
  } catch (error) {
    console.error("Error fetching homepage sections:", error);
    return res.status(500).json({ error: "Failed to fetch homepage sections" });
  }
});

// PUT / - bulk update (body: array of sections)
router.put("/", async (req: Request, res: Response) => {
  try {
    const sections = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json({ error: "Request body must be an array of sections" });
    }

    const results = [];
    for (const item of sections) {
      if (!item || !item.sectionId) continue;

      const extraDataString =
        item.extraData !== undefined ? safeJsonStringify(item.extraData, null) : undefined;

      const upserted = await prisma.homepageSection.upsert({
        where: { sectionId: item.sectionId },
        create: {
          sectionId: item.sectionId,
          name: item.name || item.sectionId,
          enabled: item.enabled !== undefined ? Boolean(item.enabled) : true,
          sortOrder: item.sortOrder !== undefined ? Number(item.sortOrder) : 0,
          title: item.title ?? null,
          subtitle: item.subtitle ?? null,
          description: item.description ?? null,
          buttonText: item.buttonText ?? null,
          buttonUrl: item.buttonUrl ?? null,
          bgColor: item.bgColor ?? null,
          textColor: item.textColor ?? null,
          accentColor: item.accentColor ?? null,
          extraData: extraDataString ?? null,
        },
        update: {
          ...(item.name !== undefined && { name: item.name }),
          ...(item.enabled !== undefined && { enabled: Boolean(item.enabled) }),
          ...(item.sortOrder !== undefined && { sortOrder: Number(item.sortOrder) }),
          ...(item.title !== undefined && { title: item.title }),
          ...(item.subtitle !== undefined && { subtitle: item.subtitle }),
          ...(item.description !== undefined && { description: item.description }),
          ...(item.buttonText !== undefined && { buttonText: item.buttonText }),
          ...(item.buttonUrl !== undefined && { buttonUrl: item.buttonUrl }),
          ...(item.bgColor !== undefined && { bgColor: item.bgColor }),
          ...(item.textColor !== undefined && { textColor: item.textColor }),
          ...(item.accentColor !== undefined && { accentColor: item.accentColor }),
          ...(item.extraData !== undefined && { extraData: extraDataString }),
        },
      });

      results.push({
        ...upserted,
        extraData: safeJsonParse(upserted.extraData, null),
      });
    }

    return res.json(results);
  } catch (error) {
    console.error("Error bulk updating homepage sections:", error);
    return res.status(500).json({ error: "Failed to update homepage sections" });
  }
});

// GET /:sectionId - get section by sectionId
router.get("/:sectionId", async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    const section = await prisma.homepageSection.findUnique({
      where: { sectionId },
    });

    if (!section) {
      return res.status(404).json({ error: "Homepage section not found" });
    }

    return res.json({
      ...section,
      extraData: safeJsonParse(section.extraData, null),
    });
  } catch (error) {
    console.error("Error fetching homepage section:", error);
    return res.status(500).json({ error: "Failed to fetch homepage section" });
  }
});

// POST / - create a single homepage section
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      sectionId,
      name,
      enabled,
      sortOrder,
      title,
      subtitle,
      description,
      buttonText,
      buttonUrl,
      bgColor,
      textColor,
      accentColor,
      extraData,
    } = req.body;

    if (!sectionId) {
      return res.status(400).json({ error: "sectionId is required" });
    }

    const existing = await prisma.homepageSection.findUnique({
      where: { sectionId },
    });
    if (existing) {
      return res.status(409).json({ error: "Section with this sectionId already exists" });
    }

    const section = await prisma.homepageSection.create({
      data: {
        sectionId,
        name: name || sectionId,
        enabled: enabled !== undefined ? Boolean(enabled) : true,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        title: title ?? null,
        subtitle: subtitle ?? null,
        description: description ?? null,
        buttonText: buttonText ?? null,
        buttonUrl: buttonUrl ?? null,
        bgColor: bgColor ?? null,
        textColor: textColor ?? null,
        accentColor: accentColor ?? null,
        extraData: safeJsonStringify(extraData, null),
      },
    });

    return res.status(201).json({
      ...section,
      extraData: safeJsonParse(section.extraData, null),
    });
  } catch (error) {
    console.error("Error creating homepage section:", error);
    return res.status(500).json({ error: "Failed to create homepage section" });
  }
});

// PUT /:sectionId - update or upsert a single homepage section
router.put("/:sectionId", async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;
    const {
      name,
      enabled,
      sortOrder,
      title,
      subtitle,
      description,
      buttonText,
      buttonUrl,
      bgColor,
      textColor,
      accentColor,
      extraData,
    } = req.body;

    const extraDataString =
      extraData !== undefined ? safeJsonStringify(extraData, null) : undefined;

    const section = await prisma.homepageSection.upsert({
      where: { sectionId },
      create: {
        sectionId,
        name: name || sectionId,
        enabled: enabled !== undefined ? Boolean(enabled) : true,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : 0,
        title: title ?? null,
        subtitle: subtitle ?? null,
        description: description ?? null,
        buttonText: buttonText ?? null,
        buttonUrl: buttonUrl ?? null,
        bgColor: bgColor ?? null,
        textColor: textColor ?? null,
        accentColor: accentColor ?? null,
        extraData: extraDataString ?? null,
      },
      update: {
        ...(name !== undefined && { name }),
        ...(enabled !== undefined && { enabled: Boolean(enabled) }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description !== undefined && { description }),
        ...(buttonText !== undefined && { buttonText }),
        ...(buttonUrl !== undefined && { buttonUrl }),
        ...(bgColor !== undefined && { bgColor }),
        ...(textColor !== undefined && { textColor }),
        ...(accentColor !== undefined && { accentColor }),
        ...(extraData !== undefined && { extraData: extraDataString }),
      },
    });

    return res.json({
      ...section,
      extraData: safeJsonParse(section.extraData, null),
    });
  } catch (error) {
    console.error("Error updating homepage section:", error);
    return res.status(500).json({ error: "Failed to update homepage section" });
  }
});

// DELETE /:sectionId - delete homepage section
router.delete("/:sectionId", async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    await prisma.homepageSection.delete({
      where: { sectionId },
    });

    return res.json({ message: "Homepage section deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Homepage section not found" });
    }
    console.error("Error deleting homepage section:", error);
    return res.status(500).json({ error: "Failed to delete homepage section" });
  }
});

export default router;
