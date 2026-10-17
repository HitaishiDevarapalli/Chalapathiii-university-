// Trusted operator command. Supply the password on stdin; never in source or command arguments.
require('dotenv').config({ quiet: true });
const fs = require('node:fs');
const { randomUUID } = require('node:crypto');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

async function resetPassword(prisma, username, password) {
  if (!/^[a-z0-9][a-z0-9._-]{2,79}$/.test(username) || password.length < 14 || password.length > 256) {
    throw new Error('Provide an existing username and a password between 14 and 256 characters.');
  }
  return prisma.$transaction(async tx => {
    const accounts = await tx.$queryRaw`SELECT id, username, role FROM admin_users WHERE username = ${username} FOR UPDATE`;
    if (accounts.length !== 1) throw new Error('Administrator account not found; no account was created.');
    const account = accounts[0];
    const columns = await tx.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'admin_users' AND column_name = 'securityVersion'`;
    const securedSchema = columns.length > 0;
    // The older password-only server supports bcrypt. The secured server supports Argon2id.
    const argon2 = securedSchema ? require('argon2') : null;
    const hash = securedSchema
      ? await argon2.hash(password, { type: argon2.argon2id, memoryCost: 19456, timeCost: 3, parallelism: 1 })
      : await bcrypt.hash(password, 12);
    if (securedSchema) {
      await tx.$executeRaw`UPDATE admin_users SET password_hash = ${hash}, "mustChangePassword" = false, "securityVersion" = "securityVersion" + 1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = ${account.id}`;
      await tx.$executeRaw`UPDATE admin_auth_sessions SET "revokedAt" = CURRENT_TIMESTAMP WHERE "userId" = ${account.id} AND "revokedAt" IS NULL`;
      await tx.$executeRaw`INSERT INTO admin_security_events (id, "userId", username, role, category, event, success, description, target) VALUES (${randomUUID()}, ${account.id}, ${account.username}, ${account.role}, 'security', 'password_reset', true, 'Trusted operator set an administrator password and revoked existing sessions', ${String(account.id)})`;
    } else {
      await tx.$executeRaw`UPDATE admin_users SET password_hash = ${hash} WHERE id = ${account.id}`;
    }
    const sessions = await tx.$queryRaw`SELECT key, value_json FROM site_configs WHERE key LIKE '__session:%'`;
    for (const row of sessions) {
      let session; try { session = JSON.parse(row.value_json); } catch { continue; }
      if (session.adminId === account.id || session.pendingAuth?.userId === account.id) {
        await tx.$executeRaw`DELETE FROM site_configs WHERE key = ${row.key}`;
      }
    }
    const saved = await tx.$queryRaw`SELECT password_hash FROM admin_users WHERE id = ${account.id}`;
    const valid = securedSchema ? await argon2.verify(saved[0].password_hash, password) : await bcrypt.compare(password, saved[0].password_hash);
    if (!valid) throw new Error('Password verification failed; transaction rolled back.');
    return account.username;
  }, { timeout: 30000 });
}

if (require.main === module) {
  const username = process.argv[2];
  if (process.stdin.isTTY || !username || process.argv.length !== 3) {
    console.error('Usage: pipe the new password to node scripts/reset-admin-password.cjs <existing-username>');
    process.exitCode = 1;
  } else {
    const prisma = new PrismaClient();
    const password = fs.readFileSync(0, 'utf8').replace(/\r?\n$/, '');
    resetPassword(prisma, username, password)
      .then(name => console.log('Password updated and verified for ' + name + '; existing sessions revoked. Account permissions, status and MFA requirements were preserved.'))
      .catch(() => { console.error('Password reset failed. Check the database connection, installed dependencies and existing account. No password was logged.'); process.exitCode = 1; })
      .finally(() => prisma.$disconnect());
  }
}
module.exports = { resetPassword };
