import { Request } from "express";
import prisma from "../prisma";
import { audit, fail, loadUser, policy, publicUser, token } from "./core";

export const saveSession = (req: Request) => new Promise<void>((resolve, reject) => req.session.save(error => error ? reject(error) : resolve()));
export const rotateSession = (req: Request) => new Promise<void>((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
export async function pendingUser(req: Request) {
  const pending = req.session.pendingAuth;
  if (!pending || pending.expiresAt <= Date.now()) fail("Authentication expired. Start again.", 401);
  const user = await loadUser(pending.userId);
  if (!user || !["Active", "Pending"].includes(user.status) || user.securityVersion !== pending.version) fail("Authentication could not be completed.", 401);
  return user;
}
export async function advanceLogin(req: Request) {
  const user = await pendingUser(req);
  const pending = req.session.pendingAuth!;
  if (user.mustChangePassword) return { success: true, next: "password", csrfToken: req.session.csrfToken };
  if (user.requireGoogle && !pending.googleId) return { success: true, next: "google", configured: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET && !!process.env.GOOGLE_REDIRECT_URI, csrfToken: req.session.csrfToken };
  const google = pending.googleId ? user.googleAccounts.find(g => g.id === pending.googleId && g.status === "Active" && g.verifiedAt) : null;
  if (pending.googleId && !google) fail("Authentication could not be completed.", 401);
  if (user.requireTotp || google?.requireTotp || user.authenticator?.enabled) {
    if (!user.authenticator?.enabled) return { success: true, next: "enroll", csrfToken: req.session.csrfToken };
    if (!pending.totpPassed) return { success: true, next: "totp", csrfToken: req.session.csrfToken };
  }
  const settings = await policy();
  const googleId = pending.googleId;
  const reauth = pending.reauth;
  await rotateSession(req);
  req.session.adminId = user.id; req.session.securityVersion = user.securityVersion;
  req.session.authenticatedAt = Date.now(); req.session.lastActivityAt = Date.now();
  req.session.reauthenticatedAt = Date.now(); req.session.verifiedGoogleId = googleId; req.session.csrfToken = token();
  req.session.cookie.maxAge = settings.sessionHours * 3600000;
  await prisma.$transaction(async tx => {
    await tx.adminUser.update({ where: { id: user.id }, data: { status: "Active", lastLoginAt: new Date() } });
    if (googleId) await tx.authorizedGoogleAccount.update({ where: { id: googleId }, data: { lastLoginAt: new Date() } });
    await audit(req, reauth ? "reauthenticated" : "login_success", true, reauth ? "Sensitive-action reauthentication completed" : "All required authentication stages completed", user, undefined, tx);
  });
  await saveSession(req);
  return { success: true, next: "complete", user: publicUser(await loadUser(user.id)), csrfToken: req.session.csrfToken };
}
