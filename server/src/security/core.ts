import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "crypto";
import argon2 from "argon2";
import bcrypt from "bcryptjs";
import * as OTPAuth from "otpauth";
import type { Request } from "express";
import prisma from "../prisma";

export const MODULES: Record<string, string> = {
  dashboard: "Overview", pages: "Website pages", homepage: "Homepage", about: "About Us",
  academics: "Academic programs", certifications: "Certifications", admissions: "Admissions content",
  enquiries: "Admission enquiries", applications: "Student applications", research: "Research",
  directories: "Faculty & directories", "campus-life": "Campus life", placements: "Placements",
  news: "News", events: "Events & registrations", announcements: "Announcements", contact: "Contact page",
  contacts: "Contact submissions", gallery: "Media library", footer: "Footer", settings: "Website settings",
  links: "Navigation links", popup: "Admission popups", backup: "CMS backup & restore",
  users: "User management", roles: "Roles & permissions", google: "Administrative Google accounts",
  audit: "Login activity & audit", security: "Security policies", sessions: "Account sessions", mfa: "Authenticator management",
};
export const ACTIONS = ["view", "create", "edit", "delete", "publish", "export", "manage"] as const;
export const PERMISSIONS = Object.keys(MODULES).flatMap(module => ACTIONS.map(action => `${module}.${action}`));
export const permissionSet = new Set(PERMISSIONS);
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export const token = () => randomBytes(32).toString("base64url");
export function constantEqual(a: unknown, b: unknown) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const left = Buffer.from(a); const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function encryptionKey() {
  const raw = process.env.ADMIN_TOTP_ENCRYPTION_KEY || "";
  const key = Buffer.from(raw, "base64");
  if (key.length === 32) return key;
  throw new Error("Configure ADMIN_TOTP_ENCRYPTION_KEY with a 32-byte base64 key before using Google or authenticator authentication");
}
export function seal(value: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(Buffer.from("chalapathi-admin-v1"));
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), encrypted.toString("base64url")].join(".");
}
export function unseal(value: string) {
  const [version, iv, tag, body] = value.split(".");
  if (version !== "v1" || !iv || !tag || !body) throw new Error("Invalid encrypted credential");
  const cipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(iv, "base64url"));
  cipher.setAAD(Buffer.from("chalapathi-admin-v1")); cipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([cipher.update(Buffer.from(body, "base64url")), cipher.final()]).toString("utf8");
}
export const hashPassword = (password: string) => argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 3, parallelism: 1 });
export async function verifyPassword(password: string, hash: string) {
  try { return hash.startsWith("$argon2id$") ? await argon2.verify(hash, password) : await bcrypt.compare(password, hash); } catch { return false; }
}
export function validPassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= 14 && value.length <= 256 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
}
export const userInclude = { assignedRole: { include: { permissions: true } }, permissions: true, googleAccounts: true, authenticator: true } as const;
export async function loadUser(id: number) { return prisma.adminUser.findUnique({ where: { id }, include: userInclude }); }
export function effectivePermissions(user: any): string[] {
  if (user.role === "superadmin") return PERMISSIONS;
  const keys = new Set<string>((user.assignedRole?.permissions || []).map((item: any) => item.permissionKey));
  for (const override of user.permissions || []) override.allowed ? keys.add(override.permissionKey) : keys.delete(override.permissionKey);
  return [...keys].filter(key => permissionSet.has(key));
}
export function permitted(user: any, key: string) {
  if (!user || !permissionSet.has(key)) return false;
  return user.role === "superadmin" || effectivePermissions(user).includes(key);
}
export function publicUser(user: any) {
  return { id: user.id, username: user.username, email: user.email, role: user.role, roleId: user.roleId,
    roleName: user.role === "superadmin" ? "Super Administrator" : user.assignedRole?.name || "Administrative Admin",
    status: user.status, requireGoogle: user.requireGoogle, requireTotp: user.requireTotp,
    mustChangePassword: user.mustChangePassword, credentialMode: user.credentialMode,
    googleVerified: user.googleAccounts?.some((account: any) => account.status === "Active" && account.verifiedAt) || false,
    totpEnabled: user.authenticator?.enabled || false, createdAt: user.createdAt, updatedAt: user.updatedAt,
    lastLoginAt: user.lastLoginAt, permissions: effectivePermissions(user),
    overrides: (user.permissions || []).map((p: any) => ({ key: p.permissionKey, allowed: p.allowed })) };
}
export const defaultPolicy = { requireGoogle: false, requireTotp: true, idleMinutes: 30, sessionHours: 12, maxAttempts: 8, lockoutMinutes: 15, retentionDays: 365 };
export async function policy() { return await prisma.adminSecurityPolicy.findUnique({ where: { id: 1 } }) || defaultPolicy; }
export async function audit(req: Request | null, event: string, success: boolean, description: string, user?: any, target?: string, db: any = prisma) {
  const identity = user || (req as any)?.adminUser;
  const roleName = identity?.role === "superadmin" ? "superadmin" : identity?.assignedRole?.name ||
    (identity?.roleId ? (await db.adminRole.findUnique({ where: { id: identity.roleId }, select: { name: true } }))?.name : identity?.role);
  // Descriptions are server-written constants; request bodies and credential errors are never logged.
  await db.adminSecurityEvent.create({ data: {
    userId: identity?.id, username: identity?.username?.slice(0, 120), email: identity?.email,
    role: roleName, category: /login|password_verified|google_verified|totp_verified|logout|session_|lockout/.test(event) ? "login" : "security",
    event, success, description, target: target?.slice(0, 180),
    ip: req?.ip?.slice(0, 100), userAgent: req?.get("user-agent")?.slice(0, 300),
    sessionId: req?.sessionID ? digest(req.sessionID) : undefined,
  } });
}
export async function revokeSessions(userId: number, db: any = prisma) {
  await db.adminAuthSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  const legacy = await db.siteConfig.findMany({ where: { key: { startsWith: "__session:" } } });
  const keys = legacy.filter((row: any) => { try { return JSON.parse(row.valueJson).adminId === userId; } catch { return false; } }).map((row: any) => row.key);
  if (keys.length) await db.siteConfig.deleteMany({ where: { key: { in: keys } } });
}
export function totp(secret?: string, label = "Administrator") {
  return new OTPAuth.TOTP({ issuer: "Chalapathi University", label, algorithm: "SHA1", digits: 6, period: 30,
    secret: secret ? OTPAuth.Secret.fromBase32(secret) : new OTPAuth.Secret({ size: 20 }) });
}
export async function consumeTotp(userId: number, code: unknown, allowPending = false, db: any = prisma) {
  if (typeof code !== "string" || !/^\d{6}$/.test(code)) return false;
  const factor = await db.userAuthenticator.findUnique({ where: { userId } });
  if (!factor || (!factor.enabled && (!allowPending || !factor.pendingUntil || factor.pendingUntil < new Date()))) return false;
  const timestamp = Date.now();
  const delta = totp(unseal(factor.secretBox)).validate({ token: code, window: 1, timestamp });
  if (delta === null) return false;
  const counter = BigInt(Math.floor(timestamp / 30000) + delta);
  const changed = await db.userAuthenticator.updateMany({ where: { userId, lastCounter: { lt: counter },
    ...(allowPending ? { enabled: false, pendingUntil: { gt: new Date() } } : { enabled: true }) },
    data: { lastCounter: counter, ...(allowPending ? { enabled: true, enrolledAt: new Date(), pendingUntil: null } : {}) } });
  return changed.count === 1;
}
export async function consumeRecovery(userId: number, code: unknown, db: any = prisma) {
  if (typeof code !== "string" || !/^[a-zA-Z0-9-]{16,80}$/.test(code)) return false;
  const changed = await db.adminRecoveryCode.updateMany({ where: { userId, codeHash: digest(code.trim()), usedAt: null }, data: { usedAt: new Date() } });
  return changed.count === 1;
}
export async function createRecoveryCodes(userId: number, db: any = prisma) {
  const codes = Array.from({ length: 10 }, () => randomBytes(12).toString("hex").match(/.{1,6}/g)!.join("-"));
  await db.adminRecoveryCode.deleteMany({ where: { userId } });
  await db.adminRecoveryCode.createMany({ data: codes.map(code => ({ userId, codeHash: digest(code) })) });
  return codes;
}
export async function rateLimit(req: Request, scope: string, identity = "") {
  const settings = await policy();
  const keys = [`ip:${req.ip}:${scope}`, `identity:${identity.toLowerCase()}:${scope}`];
  for (const raw of keys) {
    const key = digest(raw);
    const now = new Date();
    await prisma.adminLoginThrottle.deleteMany({ where: { key, expiresAt: { lte: now } } });
    const row = await prisma.adminLoginThrottle.upsert({ where: { key }, create: { key, attempts: 1,
      expiresAt: new Date(Date.now() + settings.lockoutMinutes * 60000) }, update: { attempts: { increment: 1 } } });
    if (row.attempts > settings.maxAttempts * (raw.startsWith("ip:") ? 5 : 1)) {
      await audit(req, "account_lockout", false, "Authentication attempts temporarily limited");
      throw Object.assign(new Error("Authentication temporarily unavailable. Try again later."), { status: 429 });
    }
  }
}
export function fail(message: string, status = 400): never { throw Object.assign(new Error(message), { status }); }
export function handler(fn: (req: any, res: any) => Promise<any>) {
  return (req: any, res: any, next: any) => Promise.resolve(fn(req, res)).catch(error => {
    if (error?.status) return res.status(error.status).json({ error: error.message });
    if (error?.name === "ZodError") return res.status(400).json({ error: "Invalid request fields", fields: error.issues.map((i: any) => ({ field: i.path.join("."), message: i.message })) });
    if (error?.code === "P2002") {
      const field = JSON.stringify(error.meta?.target || "").toLowerCase();
      const message = field.includes("username") ? "That username is already registered. Choose a unique username."
        : field.includes("email") ? "That email is already registered."
        : field.includes("name") ? "That role name already exists. Assign the existing role to any number of users."
        : "That username, email or role name is already registered.";
      return res.status(409).json({ error: message });
    }
    return res.status(503).json({ error: "Security service unavailable. Please retry." });
  });
}
