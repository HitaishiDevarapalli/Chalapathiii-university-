import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import QRCode from "qrcode";
import prisma from "../prisma";
import { authenticatedUser, requireAuth } from "../middleware/auth";
import { advanceLogin, pendingUser, rotateSession, saveSession } from "../security/authFlow";
import { audit, constantEqual, consumeRecovery, consumeTotp, createRecoveryCodes, digest, fail, handler, hashPassword,
  loadUser, policy, publicUser, rateLimit, seal, token, totp, unseal, validPassword, verifyPassword } from "../security/core";

const router = Router();
const invalid = () => fail("Authentication could not be completed. Check your credentials or contact an administrator.", 401);
const dummyHash = hashPassword(token() + "Aa1!");
function pendingCsrf(req: any) {
  if (!constantEqual(req.get("x-csrf-token"), req.session.csrfToken)) fail("Request verification failed. Reload and retry.", 403);
}
function googleClient() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) fail("Google authentication has not been configured by the server operator.", 503);
  if (process.env.NODE_ENV === "production" && !process.env.GOOGLE_REDIRECT_URI!.startsWith("https://")) fail("Google authentication requires an HTTPS callback.", 503);
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
}

router.get("/csrf", handler(async (req, res) => {
  req.session.csrfToken ||= token(); await saveSession(req);
  res.json({ csrfToken: req.session.csrfToken });
}));
router.post("/login", handler(async (req, res) => {
  const username = typeof req.body.username === "string" ? req.body.username.trim().toLowerCase().slice(0, 120) : "";
  const password = req.body.password;
  await rateLimit(req, "password", username);
  const user = username ? await prisma.adminUser.findFirst({ where: { OR: [{ username: { equals: username, mode: "insensitive" } }, { email: username }] } }) : null;
  await audit(req, "login_initiated", true, "Administrative authentication initiated", user || { username });
  const correct = typeof password === "string" && password.length <= 256 && await verifyPassword(password, user?.passwordHash || await dummyHash);
  const settings = await policy();
  if (!user || !correct || !["Active", "Pending"].includes(user.status) || user.credentialMode === "legacy" && "transitionCompletedAt" in settings && settings.transitionCompletedAt) {
    await audit(req, "password_verified", false, "Administrative credentials were rejected", user || { username }); return invalid();
  }
  if (!user.passwordHash.startsWith("$argon2id$")) await prisma.adminUser.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password) } });
  await audit(req, "password_verified", true, "Password verification succeeded", user);
  await rotateSession(req);
  req.session.csrfToken = token(); req.session.cookie.maxAge = 10 * 60000;
  req.session.pendingAuth = { userId: user.id, version: user.securityVersion, expiresAt: Date.now() + 10 * 60000, passwordAt: Date.now() };
  const result = await advanceLogin(req); await saveSession(req); res.json(result);
}));
router.get("/status", handler(async (req, res) => {
  const user = await authenticatedUser(req);
  if (user) return res.json({ success: true, next: "complete", user: publicUser(user), csrfToken: req.session.csrfToken });
  if (!req.session.pendingAuth) return res.json({ next: "credentials" });
  res.json(await advanceLogin(req));
}));
router.get("/me", requireAuth, handler(async (req, res) => res.json({ user: publicUser(req.adminUser), csrfToken: req.session.csrfToken })));

router.post("/password", handler(async (req, res) => {
  pendingCsrf(req); const user = await pendingUser(req); await rateLimit(req, "password-change", String(user.id));
  if (!user.mustChangePassword) fail("Password change is not pending");
  if (!validPassword(req.body.password)) fail("Use at least 14 characters with uppercase, lowercase, a number and a symbol.");
  if (await verifyPassword(req.body.password, user.passwordHash)) fail("Choose a different password.");
  await prisma.$transaction(async tx => {
    await tx.adminUser.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(req.body.password), mustChangePassword: false, securityVersion: { increment: 1 } } });
    await tx.adminAuthSession.updateMany({ where: { userId: user.id, id: { not: digest(req.sessionID) } }, data: { revokedAt: new Date() } });
    await audit(req, "password_reset", true, "Required password change completed; other sessions revoked", user, undefined, tx);
  });
  req.session.pendingAuth!.version = user.securityVersion + 1;
  res.json(await advanceLogin(req));
}));

router.get("/google/start", handler(async (req, res) => {
  const user = await pendingUser(req);
  if (user.mustChangePassword) fail("Complete the required password change first.", 403);
  await rateLimit(req, "google", String(user.id));
  const client = googleClient();
  const state = token(); const nonce = token(); const codes = await client.generateCodeVerifierAsync();
  await prisma.adminOAuthState.create({ data: { id: digest(state), userId: user.id, sessionHash: digest(req.sessionID), nonceHash: digest(nonce), verifierBox: seal(codes.codeVerifier), expiresAt: new Date(Date.now() + 5 * 60000) } });
  const url = client.generateAuthUrl({ access_type: "online", scope: ["openid", "email"], state, nonce,
    code_challenge: codes.codeChallenge, code_challenge_method: "S256" as any, prompt: "select_account", login_hint: user.email || undefined });
  await saveSession(req); res.redirect(url);
}));
router.get("/google/callback", async (req, res) => {
  let user: any;
  try {
    user = await pendingUser(req);
    const state = typeof req.query.state === "string" ? req.query.state : "";
    const row = await prisma.adminOAuthState.findUnique({ where: { id: digest(state) } });
    if (!row || row.userId !== user.id || row.sessionHash !== digest(req.sessionID) || row.expiresAt < new Date() || row.consumedAt || typeof req.query.code !== "string") invalid();
    const consumed = await prisma.adminOAuthState.updateMany({ where: { id: row!.id, consumedAt: null, expiresAt: { gt: new Date() } }, data: { consumedAt: new Date() } });
    if (consumed.count !== 1) invalid();
    const client = googleClient();
    const { tokens } = await client.getToken({ code: req.query.code as string, codeVerifier: unseal(row!.verifierBox), redirect_uri: process.env.GOOGLE_REDIRECT_URI });
    if (!tokens.id_token) invalid();
    const ticket = await client.verifyIdToken({ idToken: tokens.id_token!, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload?.sub || !payload.email_verified || !payload.email || !["accounts.google.com", "https://accounts.google.com"].includes(payload.iss) ||
      payload.aud !== process.env.GOOGLE_CLIENT_ID || payload.exp * 1000 <= Date.now() || !constantEqual(digest((payload as any).nonce || ""), row!.nonceHash)) invalid();
    const email = payload!.email!.toLowerCase();
    const account = await prisma.authorizedGoogleAccount.findUnique({ where: { email } });
    if (!account || account.userId !== user.id || account.status !== "Active" || (account.subject && account.subject !== payload!.sub)) invalid();
    await prisma.$transaction(async tx => {
      await tx.authorizedGoogleAccount.update({ where: { id: account!.id }, data: { subject: payload!.sub, verifiedAt: account!.verifiedAt || new Date() } });
      await audit(req, "google_verified", true, "Authorized Google identity verified", { ...user, email }, account!.id, tx);
    });
    req.session.pendingAuth!.googleId = account!.id; await saveSession(req);
    res.redirect("/admin?auth=resume");
  } catch {
    try { await audit(req, "google_verified", false, "Google identity or authorization validation failed", user); } catch {}
    res.redirect("/admin?auth=failed");
  }
});

router.post("/totp/enroll", handler(async (req, res) => {
  pendingCsrf(req); const user = await pendingUser(req); await rateLimit(req, "enroll", String(user.id));
  if (user.mustChangePassword || user.requireGoogle && !req.session.pendingAuth!.googleId || user.authenticator?.enabled) fail("Authenticator enrollment is not available at this stage.", 403);
  let factor = user.authenticator;
  if (!factor || !factor.pendingUntil || factor.pendingUntil < new Date()) {
    const generator = totp(undefined, user.email || user.username);
    factor = await prisma.userAuthenticator.upsert({ where: { userId: user.id }, create: { userId: user.id, secretBox: seal(generator.secret.base32), pendingUntil: new Date(req.session.pendingAuth!.expiresAt) },
      update: { secretBox: seal(generator.secret.base32), enabled: false, lastCounter: BigInt(-1), pendingUntil: new Date(req.session.pendingAuth!.expiresAt) } });
    await audit(req, "authenticator_enrollment_started", true, "Time-limited authenticator enrollment initiated", user);
  }
  const generator = totp(unseal(factor.secretBox), user.email || user.username);
  res.json({ qrCode: await QRCode.toDataURL(generator.toString(), { width: 240, margin: 2 }), manualKey: generator.secret.base32 });
}));
router.post("/totp/confirm", handler(async (req, res) => {
  pendingCsrf(req); const user = await pendingUser(req); await rateLimit(req, "totp", String(user.id));
  if (user.mustChangePassword || user.requireGoogle && !req.session.pendingAuth!.googleId) return invalid();
  const codes = await prisma.$transaction(async tx => {
    if (!await consumeTotp(user.id, req.body.code, true, tx)) return null;
    const recovery = await createRecoveryCodes(user.id, tx);
    await audit(req, "authenticator_enrolled", true, "Authenticator enrolled after successful verification", user, undefined, tx);
    return recovery;
  });
  if (!codes) { await audit(req, "totp_verified", false, "Enrollment verification failed", user); return invalid(); }
  req.session.pendingAuth!.totpPassed = true;
  res.json({ ...await advanceLogin(req), recoveryCodes: codes });
}));
router.post("/totp", handler(async (req, res) => {
  pendingCsrf(req); const user = await pendingUser(req); await rateLimit(req, "totp", String(user.id));
  if (user.mustChangePassword || user.requireGoogle && !req.session.pendingAuth!.googleId || !user.authenticator?.enabled) return invalid();
  const recovered = req.body.recovery === true;
  const valid = recovered ? await consumeRecovery(user.id, req.body.code) : await consumeTotp(user.id, req.body.code);
  await audit(req, recovered ? "authenticator_recovery" : "totp_verified", valid, valid ? "Second-factor verification succeeded" : "Second-factor verification failed", user);
  if (!valid) return invalid();
  req.session.pendingAuth!.totpPassed = true; res.json(await advanceLogin(req));
}));
router.post("/reauth", requireAuth, handler(async (req, res) => {
  const user = req.adminUser; await rateLimit(req, "reauth", String(user.id));
  const valid = typeof req.body.password === "string" && await verifyPassword(req.body.password, user.passwordHash) &&
    (!user.authenticator?.enabled || await consumeTotp(user.id, req.body.code));
  await audit(req, "reauthenticated", valid, valid ? "Sensitive-action reauthentication completed" : "Sensitive-action reauthentication rejected", user);
  if (!valid) return invalid();
  req.session.reauthenticatedAt = Date.now(); await saveSession(req); res.json({ success: true });
}));
router.post("/logout", handler(async (req, res) => {
  if (req.session.adminId || req.session.pendingAuth) {
    pendingCsrf(req);
    const user = await loadUser(req.session.adminId || req.session.pendingAuth!.userId);
    await audit(req, "logout", true, "User explicitly signed out", user);
  }
  await new Promise<void>((resolve, reject) => req.session.destroy((error: any) => error ? reject(error) : resolve()));
  res.clearCookie("connect.sid", { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  res.json({ success: true });
}));
export default router;
