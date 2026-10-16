import "dotenv/config";
import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import prisma from "../prisma";
import { audit, encryptionKey, hashPassword, loadUser, revokeSessions, token } from "./core";

// Run only from a trusted server/operator shell. No password or secret is printed.
const args = process.argv.slice(2);
const command = args[0];
let phase = "configuration";
const option = (key: string) => { const index = args.indexOf("--" + key); return index >= 0 ? args[index + 1] : undefined; };
function privateOutput(contents: Record<string, unknown>) {
  const output = option("output");
  if (!output) throw new Error("An absolute --output path for a protected file is required");
  const destination = path.resolve(output);
  if (!path.isAbsolute(output) || destination.startsWith(path.resolve(process.cwd()) + path.sep) || /[\\/]var[\\/]www[\\/]/.test(destination)) {
    throw new Error("Use an absolute path outside the repository and public website folders");
  }
  fs.writeFileSync(destination, JSON.stringify(contents, null, 2) + "\n", { flag: "wx", mode: 0o600 });
  if (process.platform !== "win32") fs.chmodSync(destination, 0o600);
  return destination;
}
async function main() {
  if (command === "key") {
    const file = privateOutput({ ADMIN_TOTP_ENCRYPTION_KEY: randomBytes(32).toString("base64") });
    console.log("Encryption key saved to protected file: " + file + ". Configure it server-side and keep a secure offline backup.");
    return;
  }
  encryptionKey();
  const username = option("username")?.trim().toLowerCase();
  if (!username || !/^[a-z0-9][a-z0-9._-]{2,79}$/.test(username)) throw new Error("Provide a valid --username");
  if (command === "create-super") {
    phase = "provisioning-configuration";
    const email = option("email")?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Provide --email for the institution-owned Google identity");
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) throw new Error("Configure Google OIDC before provisioning the replacement administrator");
    phase = "account-uniqueness-check";
    if (await prisma.adminUser.findFirst({ where: { OR: [{ username }, { email }] } })) throw new Error("That account already exists; no credentials were changed");
    const password = token() + "aA1!";
    phase = "protected-credential-file";
    const output = privateOutput({ username, email, temporaryPassword: password, changeRequired: true });
    try {
      phase = "provisioning-transaction";
      await prisma.$transaction(async tx => {
        const user = await tx.adminUser.create({ data: { username, email, passwordHash: await hashPassword(password), role: "superadmin",
          credentialMode: "secured", status: "Pending", mustChangePassword: true, requireGoogle: true, requireTotp: true,
          googleAccounts: { create: { email, requireTotp: true } } } });
        await audit(null, "super_administrator_provisioned", true, "Trusted server operator provisioned a replacement Super Administrator", undefined, String(user.id), tx);
      });
    } catch (error) { fs.unlinkSync(output); throw error; }
    console.log("Replacement Super Administrator provisioned. Temporary credentials are in: " + output);
    console.log("Existing administrators remain available. Complete and verify the replacement's sign-in before activation.");
    return;
  }
  const record = await prisma.adminUser.findUnique({ where: { username } });
  const user = record ? await loadUser(record.id) : null;
  if (!user) throw new Error("Account not found");
  if (command === "activate") {
    if (user.role !== "superadmin" || user.credentialMode !== "secured" || user.status !== "Active" || user.mustChangePassword ||
      !user.passwordHash.startsWith("$argon2id$") || !user.lastLoginAt || !user.authenticator?.enabled || !user.requireTotp || !user.requireGoogle ||
      !user.googleAccounts.some(account => account.status === "Active" && account.verifiedAt && account.lastLoginAt)) {
      throw new Error("Complete and verify the replacement administrator's password change, Google identity, authenticator enrollment and full sign-in before activation");
    }
    await prisma.$transaction(async tx => {
      await tx.$executeRawUnsafe("SELECT pg_advisory_xact_lock(724150)");
      const accounts = await tx.adminUser.findMany({ where: { credentialMode: "legacy", id: { not: user.id } } });
      for (const old of accounts) {
        await tx.adminUser.update({ where: { id: old.id }, data: { status: "Disabled", securityVersion: { increment: 1 } } });
        await revokeSessions(old.id, tx);
      }
      await tx.adminUser.update({ where: { id: user.id }, data: { securityVersion: { increment: 1 } } }); await revokeSessions(user.id, tx);
      await tx.siteConfig.deleteMany({ where: { key: { startsWith: "__session:" } } });
      await tx.adminSecurityPolicy.update({ where: { id: 1 }, data: { transitionCompletedAt: new Date() } });
      await audit(null, "credential_transition_completed", true, "Verified replacement activated; obsolete administrator credentials and sessions revoked", user, undefined, tx);
    });
    console.log("Credential transition completed. Sign in again with the verified replacement account.");
    return;
  }
  if (command === "recover") {
    if (option("acknowledge-identity-verification") !== "yes") throw new Error("Complete institutional identity checks, then pass --acknowledge-identity-verification yes");
    const password = token() + "aA1!"; const email = option("email")?.trim().toLowerCase();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Invalid recovery Google address");
    const output = privateOutput({ username, temporaryPassword: password, changeRequired: true });
    try {
      await prisma.$transaction(async tx => {
        await tx.userAuthenticator.deleteMany({ where: { userId: user.id } }); await tx.adminRecoveryCode.deleteMany({ where: { userId: user.id } });
        await tx.adminUser.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password), mustChangePassword: true,
          status: "Pending", credentialMode: "secured", requireTotp: true, requireGoogle: true, securityVersion: { increment: 1 }, ...(email ? { email } : {}) } });
        if (email) {
          await tx.authorizedGoogleAccount.updateMany({ where: { userId: user.id }, data: { status: "Revoked" } });
          const existing = await tx.authorizedGoogleAccount.findUnique({ where: { email } });
          if (existing && existing.userId !== user.id) throw new Error("Recovery Google identity is assigned to another staff account");
          await tx.authorizedGoogleAccount.upsert({ where: { email }, create: { userId: user.id, email, requireTotp: true },
            update: { status: "Active", requireTotp: true, verifiedAt: null, subject: null } });
        }
        await revokeSessions(user.id, tx);
        await audit(null, "operator_account_recovery", true, "Trusted server operator performed identity-verified recovery; password change and factor enrollment required", user, undefined, tx);
      });
    } catch (error) { fs.unlinkSync(output); throw error; }
    console.log("Controlled recovery provisioned. Temporary credentials saved to: " + output);
    return;
  }
  throw new Error("Commands: key, create-super, activate, recover");
}
main().catch(error => { console.error("Security operator command failed at " + phase + ". Check arguments, configuration, identity checks and account eligibility. Diagnostic code: " + String(error?.code || error?.errorCode || error?.name || "configuration_or_account") + ". No credentials are logged."); process.exitCode = 1; }).finally(() => prisma.$disconnect());
