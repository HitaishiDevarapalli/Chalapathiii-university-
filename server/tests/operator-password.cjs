// Verify the operator reset against both old and secured schemas, without live credentials.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const bcrypt = require('bcryptjs');
const argon2 = require('argon2');
const { PGlite } = require('@electric-sql/pglite');
const { PGLiteSocketServer } = require('@electric-sql/pglite-socket');
const { resetPassword } = require('../scripts/reset-admin-password.cjs');

(async () => {
  const db = await PGlite.create();
  await db.exec(fs.readFileSync('prisma/migrations/20261010105629_init/migration.sql', 'utf8'));
  await db.query('INSERT INTO admin_users (username, password_hash, role) VALUES ($1,$2,$3)', ['admin', await bcrypt.hash('Old-fixture-password-123!', 10), 'superadmin']);
  await db.query('INSERT INTO site_configs (key, value_json, updated_at) VALUES ($1,$2,CURRENT_TIMESTAMP),($3,$4,CURRENT_TIMESTAMP)', ['__session:fixture', JSON.stringify({ adminId: 1 }), '__session:other', JSON.stringify({ adminId: 999 })]);
  const socket = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 55442 });
  await socket.start();
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:55442/postgres?connection_limit=1';
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  const password = 'operatorfixturepassword123';
  try {
    await resetPassword(prisma, 'admin', password);
    let account = (await db.query('SELECT * FROM admin_users WHERE username = $1', ['admin'])).rows[0];
    assert.ok(await bcrypt.compare(password, account.password_hash));
    assert.equal((await db.query('SELECT key FROM site_configs')).rows.length, 1);
    assert.equal(account.role, 'superadmin');
    console.log('PASS: legacy password reset verifies a bcrypt hash and revokes only the target account sessions.');
    await db.exec(fs.readFileSync('prisma/migrations/202610160001_admin_security/migration.sql', 'utf8'));
    await db.query('UPDATE admin_users SET "requireGoogle" = true, "requireTotp" = true, status = $1 WHERE username = $2', ['Pending', 'admin']);
    await prisma.adminAuthSession.create({ data: { id: 'fixture-session', userId: account.id, dataJson: '{}', expiresAt: new Date(Date.now() + 60000) } });
    await resetPassword(prisma, 'admin', password);
    account = await prisma.adminUser.findUnique({ where: { username: 'admin' } });
    assert.ok(await argon2.verify(account.passwordHash, password));
    assert.equal(account.requireGoogle, true); assert.equal(account.requireTotp, true);
    assert.equal(account.status, 'Pending'); assert.equal(account.role, 'superadmin');
    assert.equal(account.mustChangePassword, false); assert.equal(account.securityVersion, 2);
    assert.ok((await prisma.adminAuthSession.findUnique({ where: { id: 'fixture-session' } })).revokedAt);
    assert.equal(await prisma.adminSecurityEvent.count({ where: { event: 'password_reset' } }), 1);
    await assert.rejects(() => resetPassword(prisma, 'missing-account', password));
    assert.equal(await prisma.adminUser.count(), 1);
    console.log('PASS: secured password reset verifies Argon2id, preserves account status/MFA/authority, revokes sessions, logs the reset, and never creates a missing account.');
  } finally { await prisma.$disconnect(); await socket.stop(); await db.close(); }
})().catch(() => { console.error('Operator password fixture failed. No credentials were logged.'); process.exitCode = 1; });
