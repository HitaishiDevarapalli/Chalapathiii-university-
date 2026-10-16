import { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { audit, constantEqual, digest, loadUser, permitted, policy, token } from "../security/core";

declare global { namespace Express { interface Request { adminUser?: any; } } }
declare module "express-session" {
  interface SessionData {
    adminId?: number;
    securityVersion?: number;
    authenticatedAt?: number;
    lastActivityAt?: number;
    reauthenticatedAt?: number;
    verifiedGoogleId?: string;
    csrfToken?: string;
    pendingAuth?: { userId: number; version: number; expiresAt: number; passwordAt: number; googleId?: string; totpPassed?: boolean; reauth?: boolean };
  }
}

export async function authenticatedUser(req: Request) {
  if (req.adminUser) return req.adminUser;
  const user = req.session?.adminId ? await loadUser(req.session.adminId) : null;
  if (!user || user.status !== "Active") return null;
  // Preserve old sessions only for the explicitly migrated legacy administrators.
  if (user.credentialMode === "legacy" && req.session.securityVersion === undefined) {
    if (user.securityVersion !== 1) return null;
    req.session.securityVersion = user.securityVersion; req.session.authenticatedAt = Date.now();
  }
  const settings = await policy();
  if ("transitionCompletedAt" in settings && settings.transitionCompletedAt && user.credentialMode === "legacy") return null;
  if (req.session.securityVersion !== user.securityVersion || !req.session.authenticatedAt || user.mustChangePassword ||
    Date.now() - req.session.authenticatedAt > settings.sessionHours * 3600000 ||
    Date.now() - (req.session.lastActivityAt || req.session.authenticatedAt) > settings.idleMinutes * 60000 ||
    (user.requireTotp && !user.authenticator?.enabled) ||
    (user.requireGoogle && !user.googleAccounts.some(account => account.id === req.session.verifiedGoogleId && account.status === "Active" && account.verifiedAt))) {
    await audit(req, "session_expired", false, "Session is no longer eligible for administrative access", user);
    await prisma.adminAuthSession.updateMany({ where: { id: digest(req.sessionID), revokedAt: null }, data: { revokedAt: new Date() } });
    delete req.session.adminId; return null;
  }
  req.session.lastActivityAt = Date.now(); req.session.csrfToken ||= token(); req.adminUser = user;
  return user;
}
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!await authenticatedUser(req)) return res.status(401).json({ error: "Unauthorized. Please login." });
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && !constantEqual(req.get("x-csrf-token"), req.session.csrfToken)) {
      await audit(req, "access_rejected", false, "CSRF validation rejected an administrative write");
      return res.status(403).json({ error: "Request verification failed. Reload and retry." });
    }
    next();
  } catch { res.status(503).json({ error: "Authentication unavailable" }); }
}
export function requirePermission(key: string) {
  return (req: Request, res: Response, next: NextFunction) => requireAuth(req, res, async () => {
    try {
      if (!permitted(req.adminUser, key)) {
        await audit(req, "access_rejected", false, "Permission denied for a protected resource", undefined, key);
        return res.status(403).json({ error: "You do not have permission for this action" });
      }
      next();
    } catch { res.status(503).json({ error: "Authorization unavailable" }); }
  });
}
export function requireAnyPermission(keys: string[]) {
  return (req: Request, res: Response, next: NextFunction) => requireAuth(req, res, async () => {
    if (keys.some(key => permitted(req.adminUser, key))) return next();
    try { await audit(req, "access_rejected", false, "Permission denied for a protected security resource"); } catch {}
    return res.status(403).json({ error: "You do not have permission for this action" });
  });
}
export async function assertPermission(req: Request, key: string) {
  if (!permitted(req.adminUser, key)) {
    await audit(req, "access_rejected", false, "Permission denied for a protected resource", undefined, key);
    throw Object.assign(new Error("You do not have permission for this action"), { status: 403 });
  }
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
