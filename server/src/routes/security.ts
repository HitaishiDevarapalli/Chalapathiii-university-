import { Router } from "express";
import { z } from "zod";
import prisma from "../prisma";
import { requireAnyPermission, requirePermission } from "../middleware/auth";
import { ACTIONS, MODULES, PERMISSIONS, audit, defaultPolicy, fail, handler, hashPassword, loadUser, permissionSet,
  permitted, policy, publicUser, revokeSessions, token, userInclude } from "../security/core";

const router = Router();
const permissionKeys = z.array(z.string().refine(key => permissionSet.has(key), "Unknown permission")).max(PERMISSIONS.length);
const overrides = z.array(z.object({ key: z.string().refine(key => permissionSet.has(key)), allowed: z.boolean() })).max(PERMISSIONS.length);
const status = z.enum(["Active", "Disabled", "Suspended", "Pending"]);
const userInput = z.object({ username: z.string().trim().toLowerCase().regex(/^[a-z0-9][a-z0-9._-]{2,79}$/),
  email: z.string().trim().toLowerCase().email().max(254), roleId: z.string().nullable().optional(), superAdmin: z.boolean().optional(),
  status: status.optional(), permissions: overrides.optional(), requireGoogle: z.boolean().optional(), requireTotp: z.boolean().optional() }).strict();
const roleInput = z.object({ name: z.string().trim().min(3).max(80), description: z.string().max(500), permissions: permissionKeys }).strict();
function fresh(req: any) {
  if (!req.session.reauthenticatedAt || Date.now() - req.session.reauthenticatedAt > 5 * 60000) fail("Reauthenticate to make security changes.", 428);
}
async function targetUser(req: any, id: number) {
  if (!Number.isInteger(id) || id < 1) fail("Invalid account");
  const target = await loadUser(id);
  if (!target) fail("Account not found", 404);
  if (target.role === "superadmin" && req.adminUser.role !== "superadmin") fail("Only a Super Administrator can manage this account.", 403);
  return target;
}
function grantable(req: any, keys: string[]) {
  if (req.adminUser.role === "superadmin") return;
  const sensitive = ["users", "roles", "google", "audit", "security", "sessions", "mfa", "backup"];
  if (keys.some(key => sensitive.includes(key.split(".")[0]) || !permitted(req.adminUser, key))) fail("You cannot grant these permissions.", 403);
}
async function assignedRole(req: any, roleId?: string | null) {
  if (!roleId) return null;
  const role = await prisma.adminRole.findUnique({ where: { id: roleId }, include: { permissions: true } });
  if (!role) fail("Role not found");
  grantable(req, role.permissions.map(p => p.permissionKey)); return role;
}
async function uniqueAccountIdentity(input: { username?: string; email?: string }, exceptId?: number) {
  const otherUser = exceptId === undefined ? {} : { id: { not: exceptId } };
  const [username, email, google] = await Promise.all([
    input.username ? prisma.adminUser.findFirst({ where: { ...otherUser, username: { equals: input.username, mode: "insensitive" } }, select: { id: true } }) : null,
    input.email ? prisma.adminUser.findFirst({ where: { ...otherUser, email: { equals: input.email, mode: "insensitive" } }, select: { id: true } }) : null,
    input.email ? prisma.authorizedGoogleAccount.findFirst({ where: { email: { equals: input.email, mode: "insensitive" }, ...(exceptId === undefined ? {} : { userId: { not: exceptId } }) }, select: { id: true } }) : null,
  ]);
  if (username) fail("That username is already registered. Choose a unique username.", 409);
  if (email || google) fail("That email is already registered.", 409);
}
function pager(req: any) { return { page: Math.max(1, Math.min(100000, Number(req.query.page) || 1)), size: Math.max(1, Math.min(100, Number(req.query.size) || 20)) }; }
function searchText(req: any) { return String(req.query.search || "").trim().slice(0, 120); }
async function privilegedLock(tx: any) { await tx.$executeRawUnsafe("SELECT pg_advisory_xact_lock(724150)"); }
async function preserveSuper(tx: any, user: any, next: any) {
  if (user.role === "superadmin" && user.status === "Active" && (next.role && next.role !== "superadmin" || next.status && next.status !== "Active")) {
    if (await tx.adminUser.count({ where: { role: "superadmin", status: "Active", id: { not: user.id } } }) === 0) fail("Keep at least one active Super Administrator.");
  }
}

router.get("/catalog", requirePermission("roles.view"), handler(async (_req, res) => {
  res.json({ modules: MODULES, actions: ACTIONS, permissions: PERMISSIONS });
}));
router.get("/options", requireAnyPermission(["users.view", "roles.view"]), handler(async (_req, res) => {
  const settings = await policy();
  res.json({ modules: MODULES, roles: await prisma.adminRole.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    authenticationDefaults: { requireGoogle: settings.requireGoogle, requireTotp: settings.requireTotp } });
}));
router.get("/authenticators", requirePermission("mfa.view"), handler(async (req, res) => {
  const { page, size } = pager(req); const search = searchText(req);
  const where: any = { ...(req.query.status ? { status: String(req.query.status) } : {}), ...(search ? { OR: [{ username: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } : {}) };
  const [users, total] = await Promise.all([prisma.adminUser.findMany({ where, include: { authenticator: true }, orderBy: { username: "asc" }, take: size, skip: (page - 1) * size }), prisma.adminUser.count({ where })]);
  res.json({ items: users.map(user => ({ id: user.id, username: user.username, email: user.email, status: user.status, requireTotp: user.requireTotp, totpEnabled: !!user.authenticator?.enabled })), total, page, size });
}));
router.get("/summary", requirePermission("security.view"), handler(async (req, res) => {
  const [total, active, disabled, google, enrolled, pending, successful, failed, changes] = await Promise.all([
    prisma.adminUser.count(), prisma.adminUser.count({ where: { status: "Active" } }),
    prisma.adminUser.count({ where: { status: { in: ["Disabled", "Suspended"] } } }),
    prisma.authorizedGoogleAccount.count({ where: { status: "Active" } }),
    prisma.userAuthenticator.count({ where: { enabled: true } }),
    prisma.adminUser.count({ where: { requireTotp: true, status: { in: ["Active", "Pending"] }, OR: [{ authenticator: null }, { authenticator: { enabled: false } }] } }),
    prisma.adminSecurityEvent.count({ where: { event: "login_success", success: true, createdAt: { gte: new Date(Date.now() - 7 * 86400000) } } }),
    prisma.adminSecurityEvent.count({ where: { category: "login", success: false, createdAt: { gte: new Date(Date.now() - 7 * 86400000) } } }),
    permitted(req.adminUser, "audit.view") ? prisma.adminSecurityEvent.findMany({ where: { category: "security" }, take: 8, orderBy: [{ createdAt: "desc" }, { id: "desc" }] }) : [],
  ]);
  res.json({ total, active, disabled, google, enrolled, pending, successful, failed, changes });
}));
router.get("/users", requirePermission("users.view"), handler(async (req, res) => {
  const { page, size } = pager(req); const search = searchText(req);
  const where: any = { ...(req.query.status ? { status: String(req.query.status) } : {}),
    ...(search ? { OR: [{ username: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } : {}) };
  const sort = ["username", "createdAt", "lastLoginAt"].includes(String(req.query.sort)) ? String(req.query.sort) : "createdAt";
  const [rows, total] = await Promise.all([prisma.adminUser.findMany({ where, include: userInclude, orderBy: { [sort]: req.query.order === "asc" ? "asc" : "desc" }, skip: (page - 1) * size, take: size }), prisma.adminUser.count({ where })]);
  res.json({ items: rows.map(publicUser), total, page, size });
}));
router.post("/users", requirePermission("users.create"), handler(async (req, res) => {
  fresh(req); const input = userInput.parse(req.body); const settings = await policy();
  if (input.superAdmin && req.adminUser.role !== "superadmin") fail("Only Super Administrators may provision Super Administrators.", 403);
  if (req.adminUser.role !== "superadmin" && (input.requireGoogle === false || input.requireTotp === false)) fail("Only Super Administrators may change authentication requirements.", 403);
  await uniqueAccountIdentity(input);
  await assignedRole(req, input.roleId); grantable(req, (input.permissions || []).filter(p => p.allowed).map(p => p.key));
  const temporaryPassword = token() + "aA1!";
  const user = await prisma.$transaction(async tx => {
    const account = await tx.adminUser.create({ data: { username: input.username, email: input.email, passwordHash: await hashPassword(temporaryPassword),
      role: input.superAdmin ? "superadmin" : "admin", roleId: input.roleId, status: "Pending", credentialMode: "secured", mustChangePassword: true,
      requireGoogle: input.requireGoogle ?? settings.requireGoogle,
      requireTotp: input.superAdmin ? true : input.requireTotp ?? settings.requireTotp,
      permissions: { create: (input.permissions || []).map(p => ({ permissionKey: p.key, allowed: p.allowed })) },
      googleAccounts: { create: { email: input.email, addedBy: req.adminUser.id, modifiedBy: req.adminUser.id } } } });
    await audit(req, "account_created", true, "Account provisioned with a one-time temporary password", undefined, String(account.id), tx);
    return account;
  });
  res.status(201).json({ user: publicUser(await loadUser(user.id)), temporaryPassword });
}));
router.patch("/users/:id", requirePermission("users.edit"), handler(async (req, res) => {
  fresh(req); const input = userInput.partial().parse(req.body); const target = await targetUser(req, Number(req.params.id));
  if (target.id === req.adminUser.id && (input.roleId !== undefined || input.permissions || input.superAdmin !== undefined || input.status && input.status !== "Active")) fail("Use another authorized administrator to change your own authority or account status.", 403);
  if (input.superAdmin !== undefined && req.adminUser.role !== "superadmin") fail("Only Super Administrators may change Super Administrator authority.", 403);
  if (req.adminUser.role !== "superadmin" && (input.requireGoogle !== undefined || input.requireTotp !== undefined)) fail("Authentication policies require Super Administrator authority.", 403);
  if (target.role === "superadmin" && input.requireTotp === false) fail("Super Administrators require authenticator verification.");
  const settings = await policy();
  if (target.credentialMode === "legacy" && "transitionCompletedAt" in settings && settings.transitionCompletedAt && input.status === "Active") fail("Reset and securely reprovision this obsolete account before reactivation.");
  if (input.email !== undefined && input.email !== target.email && !permitted(req.adminUser, "google.manage")) fail("Google account management permission is required to change the account's email.", 403);
  await uniqueAccountIdentity(input, target.id);
  await assignedRole(req, input.roleId); grantable(req, (input.permissions || []).filter(p => p.allowed).map(p => p.key));
  const data: any = { ...input, securityVersion: { increment: 1 } }; delete data.superAdmin; delete data.permissions;
  if (input.superAdmin !== undefined) data.role = input.superAdmin ? "superadmin" : "admin";
  if (input.superAdmin === true) { data.requireTotp = true; }
  await prisma.$transaction(async tx => {
    await privilegedLock(tx); await preserveSuper(tx, target, data);
    if (input.permissions) { await tx.adminUserPermission.deleteMany({ where: { userId: target.id } }); data.permissions = { create: input.permissions.map(p => ({ permissionKey: p.key, allowed: p.allowed })) }; }
    await tx.adminUser.update({ where: { id: target.id }, data }); await revokeSessions(target.id, tx);
    if (input.email && input.email !== target.email) {
      const google = await tx.authorizedGoogleAccount.findUnique({ where: { email: input.email } });
      if (google && google.userId !== target.id) fail("That Google identity belongs to another staff account.", 409);
      if (!google) await tx.authorizedGoogleAccount.create({ data: { userId: target.id, email: input.email, requireTotp: true, addedBy: req.adminUser.id, modifiedBy: req.adminUser.id } });
      await audit(req, "google_account_added", true, "Updated staff Google address requires ownership verification", undefined, String(target.id), tx);
    }
    await audit(req, input.status ? "account_status_changed" : "permissions_changed", true, "Account details or permissions changed; active sessions revoked", undefined, String(target.id), tx);
  });
  res.json({ user: publicUser(await loadUser(target.id)) });
}));
router.post("/users/:id/reset-password", requirePermission("users.manage"), handler(async (req, res) => {
  fresh(req); const target = await targetUser(req, Number(req.params.id)); const temporaryPassword = token() + "aA1!";
  const settings = await policy();
  await prisma.$transaction(async tx => {
    await tx.adminUser.update({ where: { id: target.id }, data: { passwordHash: await hashPassword(temporaryPassword), mustChangePassword: true, securityVersion: { increment: 1 },
      ...(target.credentialMode === "legacy" ? { credentialMode: "secured", requireGoogle: settings.requireGoogle, requireTotp: true } : {}) } });
    await revokeSessions(target.id, tx);
    await audit(req, "password_reset", true, "Temporary password issued; first-login change required; sessions revoked", undefined, String(target.id), tx);
  });
  res.json({ temporaryPassword });
}));
router.delete("/users/:id", requirePermission("users.delete"), handler(async (req, res) => {
  fresh(req); const target = await targetUser(req, Number(req.params.id));
  if (target.id === req.adminUser.id) fail("You cannot delete your own signed-in account. Ask another authorized administrator.", 403);
  await prisma.$transaction(async tx => {
    await privilegedLock(tx);
    const current = await tx.adminUser.findUnique({ where: { id: target.id } });
    if (!current) fail("Account not found", 404);
    if (current.role === "superadmin" && req.adminUser.role !== "superadmin") fail("Only a Super Administrator can manage this account.", 403);
    await preserveSuper(tx, current, { status: "Disabled" });
    await revokeSessions(current.id, tx);
    await tx.adminOAuthState.deleteMany({ where: { userId: current.id } });
    await tx.adminRecoveryCode.deleteMany({ where: { userId: current.id } });
    await tx.userAuthenticator.deleteMany({ where: { userId: current.id } });
    await tx.authorizedGoogleAccount.deleteMany({ where: { userId: current.id } });
    await tx.adminUser.delete({ where: { id: current.id } });
    await audit(req, "account_deleted", true, "Staff account and Google authorizations deleted; credentials removed and sessions revoked; audit history retained", undefined, String(current.id), tx);
  });
  res.json({ success: true });
}));
router.post("/users/:id/revoke-sessions", requirePermission("sessions.manage"), handler(async (req, res) => {
  fresh(req); const target = await targetUser(req, Number(req.params.id));
  await prisma.$transaction(async tx => {
    await tx.adminUser.update({ where: { id: target.id }, data: { securityVersion: { increment: 1 } } }); await revokeSessions(target.id, tx);
    await audit(req, "session_revoked", true, "Administrator revoked active and pending sessions", undefined, String(target.id), tx);
  });
  res.json({ success: true });
}));
router.get("/users/:id/sessions", requirePermission("sessions.view"), handler(async (req, res) => {
  const target = await targetUser(req, Number(req.params.id));
  const items = await prisma.adminAuthSession.findMany({ where: { userId: target.id }, select: { id: true, createdAt: true, lastSeenAt: true, expiresAt: true, revokedAt: true }, orderBy: { createdAt: "desc" }, take: 100 });
  res.json({ items: items.map(item => ({ ...item, status: item.revokedAt ? "Revoked" : item.expiresAt <= new Date() ? "Expired" : "Active" })) });
}));
router.post("/users/:id/reset-authenticator", requirePermission("mfa.manage"), handler(async (req, res) => {
  fresh(req); const target = await targetUser(req, Number(req.params.id));
  if (req.adminUser.id === target.id) fail("Ask another authorized administrator or use the controlled recovery procedure.", 403);
  await prisma.$transaction(async tx => {
    await tx.userAuthenticator.deleteMany({ where: { userId: target.id } }); await tx.adminRecoveryCode.deleteMany({ where: { userId: target.id } });
    await tx.adminUser.update({ where: { id: target.id }, data: { requireTotp: true, securityVersion: { increment: 1 } } }); await revokeSessions(target.id, tx);
    await audit(req, "authenticator_reset", true, "Administrator-assisted authenticator reset; re-enrollment required", undefined, String(target.id), tx);
  });
  res.json({ success: true });
}));

router.get("/roles", requirePermission("roles.view"), handler(async (_req, res) => {
  const roles = await prisma.adminRole.findMany({ include: { permissions: true, _count: { select: { users: true } } }, orderBy: { name: "asc" } });
  res.json({ items: roles.map(role => ({ ...role, permissions: role.permissions.map(p => p.permissionKey) })) });
}));
router.post("/roles", requirePermission("roles.create"), handler(async (req, res) => {
  fresh(req); const input = roleInput.parse(req.body); grantable(req, input.permissions);
  const role = await prisma.$transaction(async tx => {
    const row = await tx.adminRole.create({ data: { name: input.name, description: input.description, permissions: { create: [...new Set(input.permissions)].map(permissionKey => ({ permissionKey })) } } });
    await audit(req, "role_created", true, "Custom permission role created", undefined, row.id, tx); return row;
  });
  res.status(201).json({ role });
}));
router.put("/roles/:id", requirePermission("roles.edit"), handler(async (req, res) => {
  fresh(req); const input = roleInput.parse(req.body); grantable(req, input.permissions);
  const role = await prisma.adminRole.findUnique({ where: { id: req.params.id }, include: { users: true } });
  if (!role) fail("Role not found", 404);
  if (req.adminUser.role !== "superadmin" && role.users.some(user => user.id === req.adminUser.id || user.role === "superadmin")) fail("You cannot change a role assigned to yourself or a Super Administrator.", 403);
  await prisma.$transaction(async tx => {
    await tx.adminRolePermission.deleteMany({ where: { roleId: role.id } });
    await tx.adminRole.update({ where: { id: role.id }, data: { name: input.name, description: input.description, permissions: { create: [...new Set(input.permissions)].map(permissionKey => ({ permissionKey })) } } });
    for (const user of role.users) { await tx.adminUser.update({ where: { id: user.id }, data: { securityVersion: { increment: 1 } } }); await revokeSessions(user.id, tx); }
    await audit(req, "role_changed", true, "Role permissions changed; affected sessions revoked", undefined, role.id, tx);
  });
  res.json({ success: true });
}));
router.delete("/roles/:id", requirePermission("roles.delete"), handler(async (req, res) => {
  fresh(req); const role = await prisma.adminRole.findUnique({ where: { id: req.params.id }, include: { _count: { select: { users: true } } } });
  if (!role || role.system || role._count.users) fail("Only unused custom roles can be removed.");
  await prisma.$transaction(async tx => { await tx.adminRole.delete({ where: { id: role.id } }); await audit(req, "role_removed", true, "Unused custom role removed", undefined, role.id, tx); });
  res.json({ success: true });
}));

router.get("/google", requirePermission("google.view"), handler(async (req, res) => {
  const { page, size } = pager(req); const search = searchText(req);
  const where: any = { ...(search ? { email: { contains: search, mode: "insensitive" } } : {}), ...(req.query.status ? { status: String(req.query.status) } : {}) };
  const [rows, total] = await Promise.all([prisma.authorizedGoogleAccount.findMany({ where, include: { user: { include: userInclude } }, skip: (page - 1) * size, take: size, orderBy: { createdAt: "desc" } }), prisma.authorizedGoogleAccount.count({ where })]);
  res.json({ items: rows.map(({ subject, user, ...row }) => ({ ...row, user: publicUser(user) })), total, page, size });
}));
router.post("/google", requirePermission("google.create"), handler(async (req, res) => {
  fresh(req); const input = z.object({ email: z.string().trim().toLowerCase().email(), userId: z.number().int().positive(), requireTotp: z.boolean().default(true) }).strict().parse(req.body);
  const target = await targetUser(req, input.userId);
  if (target.role === "superadmin" && !input.requireTotp) fail("Super Administrators require an authenticator.");
  const account = await prisma.$transaction(async tx => {
    const row = await tx.authorizedGoogleAccount.create({ data: { ...input, addedBy: req.adminUser.id, modifiedBy: req.adminUser.id } });
    await tx.adminUser.update({ where: { id: target.id }, data: { requireGoogle: true, securityVersion: { increment: 1 } } }); await revokeSessions(target.id, tx);
    await audit(req, "google_account_added", true, "Google address authorized; identity verification is still required", undefined, row.id, tx); return row;
  });
  res.status(201).json({ account: { id: account.id, email: account.email, status: account.status, verifiedAt: account.verifiedAt } });
}));
router.patch("/google/:id", requirePermission("google.manage"), handler(async (req, res) => {
  fresh(req); const input = z.object({ status: z.enum(["Active", "Disabled", "Revoked"]).optional(), requireTotp: z.boolean().optional() }).strict().parse(req.body);
  const account = await prisma.authorizedGoogleAccount.findUnique({ where: { id: req.params.id } }); if (!account) fail("Google account not found", 404);
  const target = await targetUser(req, account.userId);
  if (target.id === req.adminUser.id || target.role === "superadmin" && input.requireTotp === false) fail("Use another authorized administrator to change this Google identity.", 403);
  await prisma.$transaction(async tx => {
    await tx.authorizedGoogleAccount.update({ where: { id: account.id }, data: { ...input, modifiedBy: req.adminUser.id } });
    await tx.adminUser.update({ where: { id: target.id }, data: { securityVersion: { increment: 1 } } }); await revokeSessions(target.id, tx);
    await audit(req, input.status === "Revoked" ? "google_account_removed" : "google_account_changed", true, "Google account authorization changed; historical records preserved", undefined, account.id, tx);
  });
  res.json({ success: true });
}));
router.delete("/google/:id", requirePermission("google.delete"), handler(async (req, res) => {
  fresh(req);
  await prisma.$transaction(async tx => {
    await privilegedLock(tx);
    const account = await tx.authorizedGoogleAccount.findUnique({ where: { id: req.params.id }, include: { user: true } });
    if (!account) fail("Google account not found", 404);
    if (account.userId === req.adminUser.id) fail("Ask another authorized administrator to remove your own Google access.", 403);
    if (account.user.role === "superadmin" && req.adminUser.role !== "superadmin") fail("Only a Super Administrator can manage this account.", 403);
    if (account.user.role === "superadmin" && account.user.status === "Active" && account.user.requireGoogle) {
      const otherIdentity = await tx.authorizedGoogleAccount.count({ where: { userId: account.userId, id: { not: account.id }, status: "Active", verifiedAt: { not: null } } });
      if (!otherIdentity && await tx.adminUser.count({ where: { role: "superadmin", status: "Active", id: { not: account.userId } } }) === 0) fail("Keep a verified Google identity for the last active Super Administrator.");
    }
    await tx.authorizedGoogleAccount.delete({ where: { id: account.id } });
    await tx.adminOAuthState.deleteMany({ where: { userId: account.userId } });
    await tx.adminUser.update({ where: { id: account.userId }, data: { securityVersion: { increment: 1 } } });
    await revokeSessions(account.userId, tx);
    await audit(req, "google_account_deleted", true, "Google sign-in authorization deleted; staff account retained and sessions revoked", undefined, account.id, tx);
  });
  res.json({ success: true });
}));

router.get("/events", requirePermission("audit.view"), handler(async (req, res) => {
  const { page, size } = pager(req); const search = searchText(req); const where: any = {};
  if (search) where.OR = [{ username: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }];
  if (req.query.userId) where.userId = z.coerce.number().int().positive().parse(req.query.userId);
  if (req.query.event) where.event = String(req.query.event).slice(0, 100);
  if (req.query.role) where.role = String(req.query.role).slice(0, 100);
  if (req.query.success === "true" || req.query.success === "false") where.success = req.query.success === "true";
  if (req.query.category) where.category = String(req.query.category);
  if (req.query.from || req.query.to) {
    where.createdAt = {};
    if (req.query.from) where.createdAt.gte = z.coerce.date().parse(req.query.from);
    if (req.query.to) where.createdAt.lte = z.coerce.date().parse(req.query.to);
  }
  const order = req.query.order === "asc" ? "asc" : "desc";
  const [rows, total] = await Promise.all([prisma.adminSecurityEvent.findMany({ where, orderBy: [{ createdAt: order }, { id: order }], skip: (page - 1) * size, take: size }), prisma.adminSecurityEvent.count({ where })]);
  const sessions = await prisma.adminAuthSession.findMany({ where: { id: { in: rows.map(row => row.sessionId).filter(Boolean) as string[] } }, select: { id: true, expiresAt: true, revokedAt: true } });
  const roleOptions = await prisma.adminSecurityEvent.findMany({ where: { role: { not: null } }, distinct: ["role"], select: { role: true }, orderBy: { role: "asc" } });
  res.json({ items: rows.map(row => { const session = sessions.find(s => s.id === row.sessionId); return { ...row, sessionStatus: !session ? "Unknown" : session.revokedAt ? "Revoked or signed out" : session.expiresAt <= new Date() ? "Expired" : "Active" }; }), total, page, size, timezone: "Asia/Kolkata", roles: roleOptions.map(row => row.role) });
}));
router.get("/policy", requirePermission("security.view"), handler(async (_req, res) => {
  res.json({ policy: await policy(), configuration: { google: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET && !!process.env.GOOGLE_REDIRECT_URI,
    encryption: !!process.env.ADMIN_TOTP_ENCRYPTION_KEY, https: process.env.NODE_ENV === "production" } });
}));
router.get("/events/export", requirePermission("audit.export"), handler(async (req, res) => {
  if (!permitted(req.adminUser, "audit.view")) fail("Audit view permission is required.", 403);
  const where: any = {}; const search = searchText(req);
  if (search) where.OR = [{ username: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }];
  if (req.query.userId) where.userId = z.coerce.number().int().positive().parse(req.query.userId);
  if (req.query.event) where.event = String(req.query.event).slice(0, 100);
  if (req.query.role) where.role = String(req.query.role).slice(0, 100);
  if (req.query.success === "true" || req.query.success === "false") where.success = req.query.success === "true";
  if (req.query.from || req.query.to) {
    where.createdAt = {};
    if (req.query.from) where.createdAt.gte = z.coerce.date().parse(req.query.from);
    if (req.query.to) where.createdAt.lte = z.coerce.date().parse(req.query.to);
  }
  const items = await prisma.adminSecurityEvent.findMany({ where, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 10000 });
  await audit(req, "audit_exported", true, "Authorized filtered audit export generated");
  res.json({ items, timezone: "Asia/Kolkata", limit: 10000 });
}));
router.put("/policy", requirePermission("security.manage"), handler(async (req, res) => {
  fresh(req); if (req.adminUser.role !== "superadmin") fail("Only Super Administrators may change security policies.", 403);
  const input = z.object({ requireGoogle: z.boolean(), requireTotp: z.boolean(), idleMinutes: z.number().int().min(5).max(120),
    sessionHours: z.number().int().min(1).max(24), maxAttempts: z.number().int().min(3).max(20), lockoutMinutes: z.number().int().min(5).max(60), retentionDays: z.number().int().min(90).max(3650) }).strict().parse(req.body);
  await prisma.$transaction(async tx => {
    await tx.adminSecurityPolicy.upsert({ where: { id: 1 }, create: { id: 1, ...defaultPolicy, ...input }, update: input });
    await audit(req, "security_policy_changed", true, "Authentication, session or retention policy changed", undefined, "policy", tx);
  });
  res.json({ success: true });
}));
export default router;
