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

// GET / - get ALL configs as an object: { key1: parsedJson1, key2: parsedJson2, ... }
router.get("/", async (req: Request, res: Response) => {
  try {
    const configs = await prisma.siteConfig.findMany();
    const result: Record<string, any> = {};

    for (const item of configs) {
      result[item.key] = safeJsonParse(item.valueJson, item.valueJson);
    }

    return res.json(result);
  } catch (error) {
    console.error("Error fetching configs:", error);
    return res.status(500).json({ error: "Failed to fetch configs" });
  }
});

// POST /backup - get all configs as a single JSON backup blob
router.post("/backup", async (req: Request, res: Response) => {
  try {
    const configs = await prisma.siteConfig.findMany();
    const backup: Record<string, any> = {};

    for (const item of configs) {
      backup[item.key] = safeJsonParse(item.valueJson, item.valueJson);
    }

    return res.json(backup);
  } catch (error) {
    console.error("Error generating backup:", error);
    return res.status(500).json({ error: "Failed to generate config backup" });
  }
});

// GET /backup - support GET for backup blob as well
router.get("/backup", async (req: Request, res: Response) => {
  try {
    const configs = await prisma.siteConfig.findMany();
    const backup: Record<string, any> = {};

    for (const item of configs) {
      backup[item.key] = safeJsonParse(item.valueJson, item.valueJson);
    }

    return res.json(backup);
  } catch (error) {
    console.error("Error generating backup:", error);
    return res.status(500).json({ error: "Failed to generate config backup" });
  }
});

// POST /restore - body: full backup JSON. Upsert all keys.
router.post("/restore", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "Invalid backup data. Expected JSON object." });
    }

    const entries: [string, any][] = [];

    if (Array.isArray(body)) {
      for (const item of body) {
        if (item && item.key) {
          const val = item.value !== undefined ? item.value : (item.valueJson !== undefined ? item.valueJson : item);
          entries.push([item.key, val]);
        }
      }
    } else {
      const sourceObj =
        body.configs && typeof body.configs === "object" && !Array.isArray(body.configs)
          ? body.configs
          : body;

      for (const [key, val] of Object.entries(sourceObj)) {
        if (key === "timestamp") continue;
        entries.push([key, val]);
      }
    }

    let restoredCount = 0;
    for (const [key, rawValue] of entries) {
      const stringified = safeJsonStringify(rawValue, "{}");

      await prisma.siteConfig.upsert({
        where: { key },
        create: {
          key,
          valueJson: stringified,
        },
        update: {
          valueJson: stringified,
        },
      });
      restoredCount++;
    }

    return res.json({
      message: "Configs restored successfully",
      count: restoredCount,
    });
  } catch (error) {
    console.error("Error restoring configs:", error);
    return res.status(500).json({ error: "Failed to restore configs" });
  }
});

// GET /:key - get single config by key. Parse valueJson.
router.get("/:key", async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    const config = await prisma.siteConfig.findUnique({
      where: { key },
    });

    if (!config) {
      return res.status(404).json({ error: `Config '${key}' not found` });
    }

    const parsed = safeJsonParse(config.valueJson, config.valueJson);

    if (req.query.raw === "true") {
      return res.json(parsed);
    }

    return res.json({
      id: config.id,
      key: config.key,
      value: parsed,
      valueJson: parsed,
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching config:", error);
    return res.status(500).json({ error: "Failed to fetch config" });
  }
});

// PUT /:key - upsert config by key. Body is the raw JSON value to store. Stringify it.
router.put("/:key", async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const body = req.body;

    const stringified = safeJsonStringify(body, "{}");

    const config = await prisma.siteConfig.upsert({
      where: { key },
      create: {
        key,
        valueJson: stringified,
      },
      update: {
        valueJson: stringified,
      },
    });

    const parsed = safeJsonParse(config.valueJson, config.valueJson);

    return res.json({
      id: config.id,
      key: config.key,
      value: parsed,
      valueJson: parsed,
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    console.error("Error saving config:", error);
    return res.status(500).json({ error: "Failed to save config" });
  }
});

// DELETE /:key - delete config by key
router.delete("/:key", async (req: Request, res: Response) => {
  const { key } = req.params;
  try {
    await prisma.siteConfig.delete({
      where: { key },
    });

    return res.json({ message: `Config '${key}' deleted successfully` });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: `Config '${key}' not found` });
    }
    console.error("Error deleting config:", error);
    return res.status(500).json({ error: "Failed to delete config" });
  }
});

export default router;
