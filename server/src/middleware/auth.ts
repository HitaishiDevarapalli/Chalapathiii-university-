import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.session?.adminId;
    const admin = id ? await prisma.adminUser.findUnique({ where: { id } }) : null;
    if (admin && ["admin", "superadmin"].includes(admin.role)) return next();
    return res.status(401).json({ error: "Unauthorized. Please login." });
  } catch { return res.status(503).json({ error: "Authentication unavailable" }); }
}

export function sameOrigin(req: Request, res: Response, next: NextFunction) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  const expected = `${req.protocol}://${req.get("host")}`;
  const allowed = [expected, ...(process.env.PUBLIC_ORIGINS || "").split(",").filter(Boolean)];
  if ((origin && !allowed.includes(origin)) || req.get("sec-fetch-site") === "cross-site") {
    return res.status(403).json({ error: "Cross-origin writes are forbidden" });
  }
  next();
}
