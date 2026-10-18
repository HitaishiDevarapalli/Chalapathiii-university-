// Real Express/session/Prisma/PostgreSQL integration; Google transport alone is mocked.
// All databases, account credentials, encryption keys and uploads are isolated fixtures.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { promisify } = require('node:util');
const execFile = promisify(require('node:child_process').execFile);
const { PGlite } = require('@electric-sql/pglite');
const { PGLiteSocketServer } = require('@electric-sql/pglite-socket');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

(async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'university-security-test-'));
  const db = await PGlite.create();
  const migrations = fs.readdirSync('prisma/migrations').filter(name => /^2026/.test(name)).sort();
  const beforeSecurity = migrations.filter(name => name < '202610160001_admin_security');
  for (const name of beforeSecurity) await db.exec(fs.readFileSync('prisma/migrations/' + name + '/migration.sql', 'utf8'));
  await db.query('INSERT INTO admin_users (username, password_hash, role) VALUES ($1,$2,$3)', ['existing-admin', await bcrypt.hash('Existing-test-password-123!', 10), 'superadmin']);
  await db.exec(fs.readFileSync('prisma/migrations/202610160001_admin_security/migration.sql', 'utf8'));
  for (const name of migrations.filter(name => name > '202610160001_admin_security')) await db.exec(fs.readFileSync('prisma/migrations/' + name + '/migration.sql', 'utf8'));
  await db.exec("SET TIME ZONE 'Asia/Kolkata'");
  const socket = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 55441, maxConnections: 5 });
  await socket.start();
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:55441/postgres?connection_limit=1';
  process.env.SESSION_SECRET = crypto.randomBytes(40).toString('hex');
  process.env.ADMIN_TOTP_ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64');
  process.env.GOOGLE_CLIENT_ID = 'isolated-test-client';
  process.env.GOOGLE_CLIENT_SECRET = 'isolated-test-client-secret';
  process.env.GOOGLE_REDIRECT_URI = 'http://localhost/api/auth/google/callback';
  process.env.UPLOADS_DIR = path.join(directory, 'uploads');
  process.env.NODE_ENV = 'test';
  let googlePayload;
  let expectedChallenge;
  const realGetToken = OAuth2Client.prototype.getToken;
  const realVerify = OAuth2Client.prototype.verifyIdToken;
  OAuth2Client.prototype.getToken = async function (options) {
    assert.equal(crypto.createHash('sha256').update(options.codeVerifier).digest('base64url'), expectedChallenge, 'OAuth exchange uses the PKCE verifier');
    return { tokens: { id_token: 'fixture-token' } };
  };
  OAuth2Client.prototype.verifyIdToken = async function (options) {
    assert.equal(options.audience, process.env.GOOGLE_CLIENT_ID);
    return { getPayload: () => googlePayload };
  };
  const prisma = require('../dist/prisma').default;
  const core = require('../dist/security/core');
  const encryptionKey = process.env.ADMIN_TOTP_ENCRYPTION_KEY;
  for (const invalidKey of ['', 'invalid']) {
    process.env.ADMIN_TOTP_ENCRYPTION_KEY = invalidKey;
    assert.throws(() => core.seal('fixture-secret'), /Configure ADMIN_TOTP_ENCRYPTION_KEY/);
  }
  process.env.ADMIN_TOTP_ENCRYPTION_KEY = encryptionKey;
  const sealed = core.seal('fixture-secret');
  assert.equal(core.unseal(sealed), 'fixture-secret');
  process.env.ADMIN_TOTP_ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64');
  assert.throws(() => core.unseal(sealed));
  process.env.ADMIN_TOTP_ENCRYPTION_KEY = encryptionKey;
  assert.equal(core.constantEqual('é', 'a'), false);
  const app = require('../dist/index').default;
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const passed = [];
  const pass = title => { passed.push(title); console.log('PASS: ' + title); };
  class Client {
    cookie = ''; csrf = '';
    async request(url, method = 'GET', body, protect = true) {
      if (!['GET', 'HEAD', 'OPTIONS'].includes(method) && protect) {
        const token = await this.request('/api/auth/csrf'); this.csrf = token.body.csrfToken;
      }
      const response = await fetch(base + url, { method, redirect: 'manual', headers: { ...(this.cookie ? { cookie: this.cookie } : {}),
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(protect && this.csrf ? { 'X-CSRF-Token': this.csrf } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      const cookie = response.headers.get('set-cookie'); if (cookie) this.cookie = cookie.split(';')[0];
      const text = await response.text(); let result; try { result = JSON.parse(text); } catch { result = text; }
      return { status: response.status, body: result, headers: response.headers };
    }
    login(username, password) { return this.request('/api/auth/login', 'POST', { username, password }); }
  }
  const admin = new Client();
  const guest = new Client();
  async function google(client, email, overrides = {}) {
    const start = await client.request('/api/auth/google/start');
    assert.equal(start.status, 302, JSON.stringify(start.body));
    const auth = new URL(start.headers.get('location'));
    googlePayload = { email, email_verified: true, sub: 'google-sub-' + email, iss: 'https://accounts.google.com',
      aud: process.env.GOOGLE_CLIENT_ID, exp: Math.floor(Date.now() / 1000) + 300, nonce: auth.searchParams.get('nonce'), ...overrides };
    expectedChallenge = auth.searchParams.get('code_challenge');
    const url = '/api/auth/google/callback?state=' + encodeURIComponent(auth.searchParams.get('state')) + '&code=isolated-code';
    return { result: await client.request(url), url };
  }
  async function createUser(username, extra = {}) {
    const result = await admin.request('/api/security/users', 'POST', { username, email: username + '@gmail.com', roleId: 'administrative-admin', requireGoogle: true, ...extra });
    assert.equal(result.status, 201, JSON.stringify(result.body));
    return result.body;
  }
  async function enroll(client) {
    const setup = await client.request('/api/auth/totp/enroll', 'POST', {});
    assert.equal(setup.status, 200, JSON.stringify(setup.body));
    assert.match(setup.body.qrCode, /^data:image\/png;base64,/);
    const invalid = await client.request('/api/auth/totp/confirm', 'POST', { code: '000000' });
    assert.equal(invalid.status, 401);
    const correct = core.totp(setup.body.manualKey).generate();
    const result = await client.request('/api/auth/totp/confirm', 'POST', { code: correct });
    assert.equal(result.status, 200, JSON.stringify(result.body)); assert.equal(result.body.next, 'complete');
    assert.equal(result.body.recoveryCodes.length, 10);
    return { secret: setup.body.manualKey, codes: result.body.recoveryCodes, result };
  }
  const operator = async args => {
    // PGlite multiplexes one PostgreSQL connection. Separate Prisma processes need
    // independent prepared-statement namespaces, provided natively by real PostgreSQL.
    await prisma.$disconnect(); await db.exec('DEALLOCATE ALL');
    try { return await execFile(process.execPath, ['dist/security/cli.js', ...args], { cwd: process.cwd(), env: process.env }); }
    finally { await db.exec('DEALLOCATE ALL'); }
  };
  try {
    await prisma.adminSecurityPolicy.update({ where: { id: 1 }, data: { maxAttempts: 20, requireGoogle: false, requireTotp: true } });
    assert.equal((await admin.login('existing-admin', 'Existing-test-password-123!')).body.next, 'complete');
    assert.equal((await admin.request('/api/auth/me')).status, 200);
    const legacy = await prisma.adminUser.findUnique({ where: { username: 'existing-admin' } });
    assert.equal(legacy.credentialMode, 'legacy'); assert.match(legacy.passwordHash, /^\$argon2id\$/);
    pass('additive migration preserves existing administrator access and upgrades bcrypt on verified login');
    const legacyFactorUser = await prisma.adminUser.create({ data: { username: 'legacy-factor-test',
      passwordHash: await core.hashPassword('Legacy-factor-password-123!'), role: 'superadmin', status: 'Active',
      credentialMode: 'legacy', mustChangePassword: false, requireGoogle: false, requireTotp: false } });
    const legacyFactorClient = new Client();
    assert.equal((await legacyFactorClient.login('legacy-factor-test', 'Legacy-factor-password-123!')).body.next, 'complete');
    assert.equal((await legacyFactorClient.request('/api/security/users/' + legacyFactorUser.id, 'PATCH', { requireTotp: true })).status, 200);
    assert.equal((await legacyFactorClient.request('/api/auth/me')).status, 401, 'enabling MFA invalidates the password-only session');
    const googleIdForFactorTest = process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_ID;
    try {
      assert.equal((await legacyFactorClient.login('legacy-factor-test', 'Legacy-factor-password-123!')).body.next, 'enroll');
      const legacyFactor = await enroll(legacyFactorClient);
      const factorIdentity = (await legacyFactorClient.request('/api/auth/me')).body.user;
      assert.equal(factorIdentity.requireTotp, true); assert.equal(factorIdentity.totpEnabled, true);
      assert.equal(factorIdentity.requireGoogle, false, 'Authenticator setup does not enable unconfigured Google sign-in');
      await legacyFactorClient.request('/api/auth/logout', 'POST', {});
      assert.equal((await legacyFactorClient.login('legacy-factor-test', 'Legacy-factor-password-123!')).body.next, 'totp');
      assert.equal((await legacyFactorClient.request('/api/auth/me')).status, 401);
      const nextFactorCode = core.totp(legacyFactor.secret).generate({ timestamp: Date.now() + 30000 });
      assert.equal((await legacyFactorClient.request('/api/auth/totp', 'POST', { code: nextFactorCode })).body.next, 'complete');
      await legacyFactorClient.request('/api/auth/logout', 'POST', {});
    } finally { process.env.GOOGLE_CLIENT_ID = googleIdForFactorTest; }
    await prisma.adminUser.update({ where: { id: legacyFactorUser.id }, data: { status: 'Disabled' } });
    pass('existing administrators can require and enroll Authenticator without Google sign-in; later logins require a code');
    const defaults = await admin.request('/api/security/options');
    assert.deepEqual(defaults.body.authenticationDefaults, { requireGoogle: false, requireTotp: true });
    const defaultStaff = await createUser('default-factor-staff', { requireGoogle: undefined });
    assert.equal(defaultStaff.user.requireGoogle, false); assert.equal(defaultStaff.user.requireTotp, true);
    const defaultStaffClient = new Client();
    assert.equal((await defaultStaffClient.login(defaultStaff.user.email, defaultStaff.temporaryPassword)).body.next, 'password');
    assert.equal((await defaultStaffClient.request('/api/auth/password', 'POST', { password: 'Default-factor-password-123!' })).body.next, 'enroll');
    assert.equal((await defaultStaffClient.request('/api/auth/me')).status, 401);
    await enroll(defaultStaffClient);
    assert.equal((await defaultStaffClient.request('/api/auth/me')).status, 200);
    pass('staff Gmail and one-time password lead to password change, QR enrollment and verified Authenticator access without Google sign-in');
    assert.equal((await guest.login('missing-user', 'wrong')).status, 401);
    assert.equal((await guest.login('existing-admin', 'wrong')).status, 401);
    assert.equal((await guest.request('/api/enquiries')).status, 401);
    pass('unknown credentials, incorrect passwords and unauthenticated private API reads are rejected');
    const staff = await createUser('admissions-test', { roleId: 'admissions-staff' });
    const staffClient = new Client();
    const first = await staffClient.login('admissions-test', staff.temporaryPassword);
    assert.equal(first.body.next, 'password'); assert.equal((await staffClient.request('/api/auth/me')).status, 401);
    const password = 'New-staff-password-123!';
    assert.equal((await staffClient.request('/api/auth/password', 'POST', { password })).body.next, 'google');
    assert.equal((await staffClient.request('/api/auth/totp/enroll', 'POST', {})).status, 403);
    pass('temporary-password users must change their password and cannot bypass Google verification or access admin APIs');
    assert.match((await google(staffClient, 'unknown-address@gmail.com')).result.headers.get('location'), /auth=failed/);
    const other = await createUser('other-google-test');
    assert.match((await google(staffClient, 'other-google-test@gmail.com')).result.headers.get('location'), /auth=failed/);
    for (const claims of [{ email_verified: false }, { aud: 'wrong-audience' }, { iss: 'https://evil.example' }, { exp: 1 }, { nonce: 'wrong-nonce' }]) {
      assert.match((await google(staffClient, 'admissions-test@gmail.com', claims)).result.headers.get('location'), /auth=failed/);
    }
    assert.equal((await staffClient.request('/api/auth/me')).status, 401);
    pass('unknown Gmail, mismatched assigned identities, unverified email, audience, issuer, expiry and nonce failures are rejected');
    const verified = await google(staffClient, 'admissions-test@gmail.com');
    assert.match(verified.result.headers.get('location'), /auth=resume/);
    assert.match((await staffClient.request(verified.url)).headers.get('location'), /auth=failed/);
    assert.equal((await staffClient.request('/api/auth/status')).body.next, 'enroll');
    assert.equal((await staffClient.request('/api/auth/totp', 'POST', { code: '123456' })).status, 401);
    assert.equal((await staffClient.request('/api/auth/me')).status, 401);
    pass('OAuth state is single-use and pending enrollment is distinct from a normal authenticator challenge');
    const factor = await enroll(staffClient);
    const savedFactor = await prisma.userAuthenticator.findUnique({ where: { userId: staff.user.id } });
    assert.equal(savedFactor.enabled, true); assert.ok(!savedFactor.secretBox.includes(factor.secret));
    assert.equal((await staffClient.request('/api/auth/me')).status, 200);
    assert.equal((await staffClient.request('/api/enquiries')).status, 200);
    assert.equal((await staffClient.request('/api/applications')).status, 200);
    pass('unique encrypted TOTP enrollment activates only after a correct code; staff receive assigned module access');
    assert.equal((await staffClient.request('/api/security/users')).status, 403);
    assert.equal((await staffClient.request('/api/security/google', 'POST', { userId: staff.user.id, email: 'attack@gmail.com' })).status, 403);
    assert.equal((await staffClient.request('/api/config/siteSettings', 'PUT', { universityName: 'Attack' })).status, 403);
    assert.equal((await staffClient.request('/api/cms', 'POST', { action: 'savePage', page: { slug: 'attack', title: 'Attack' } })).status, 403);
    assert.equal((await staffClient.request('/api/news?admin=true')).status, 403);
    assert.equal((await staffClient.request('/api/config/backup')).status, 403);
    assert.equal((await staffClient.request('/api/upload', 'POST', {})).status, 403);
    pass('direct API calls cannot bypass module, settings, publishing, file upload, Google management or export permissions');
    await staffClient.request('/api/auth/logout', 'POST', {});
    assert.equal((await staffClient.login('admissions-test', password)).body.next, 'google');
    await google(staffClient, 'admissions-test@gmail.com');
    assert.equal((await staffClient.request('/api/auth/status')).body.next, 'totp');
    assert.equal((await staffClient.request('/api/auth/totp', 'POST', { code: core.totp(factor.secret).generate() })).status, 401);
    const nextCode = core.totp(factor.secret).generate({ timestamp: Date.now() + 30000 });
    assert.equal((await staffClient.request('/api/auth/totp', 'POST', { code: nextCode })).body.next, 'complete');
    await staffClient.request('/api/auth/logout', 'POST', {});
    await staffClient.login('admissions-test', password); await google(staffClient, 'admissions-test@gmail.com');
    assert.equal((await staffClient.request('/api/auth/totp', 'POST', { code: nextCode })).status, 401);
    assert.equal((await staffClient.request('/api/auth/totp', 'POST', { code: '000000' })).status, 401);
    assert.equal((await staffClient.request('/api/auth/totp', 'POST', { code: factor.codes[0], recovery: true })).body.next, 'complete');
    await staffClient.request('/api/auth/logout', 'POST', {});
    await staffClient.login('admissions-test', password); await google(staffClient, 'admissions-test@gmail.com');
    assert.equal((await staffClient.request('/api/auth/totp', 'POST', { code: factor.codes[0], recovery: true })).status, 401);
    pass('subsequent logins require Google plus TOTP; incorrect/replayed codes fail and recovery codes are single-use');
    const manager = await createUser('manager-test', { requireGoogle: false, requireTotp: false,
      permissions: [{ key: 'users.create', allowed: true }, { key: 'users.edit', allowed: true }, { key: 'users.view', allowed: true }, { key: 'roles.view', allowed: true }] });
    const managerClient = new Client(); await managerClient.login('manager-test', manager.temporaryPassword);
    assert.equal((await managerClient.request('/api/auth/password', 'POST', { password: 'Manager-test-password-123!' })).body.next, 'complete');
    assert.equal((await managerClient.request('/api/security/users', 'POST', { username: 'evil-super', email: 'evil-super@gmail.com', superAdmin: true })).status, 403);
    assert.equal((await managerClient.request('/api/security/users/' + manager.user.id, 'PATCH', { permissions: [{ key: 'security.manage', allowed: true }] })).status, 403);
    assert.equal((await managerClient.request('/api/security/users/' + staff.user.id, 'PATCH', { permissions: [{ key: 'settings.publish', allowed: true }] })).status, 403);
    assert.equal((await managerClient.request('/api/security/google')).status, 403);
    pass('delegated ordinary user managers cannot promote Super Administrators, escalate themselves or grant unowned permissions');
    const noCsrf = await admin.request('/api/security/policy', 'PUT', {}, false);
    assert.equal(noCsrf.status, 403);
    pass('authenticated writes require a session-bound CSRF token');
    for (const disabledStatus of ['Disabled', 'Suspended']) {
      assert.equal((await admin.request('/api/security/users/' + manager.user.id, 'PATCH', { status: disabledStatus })).status, 200);
      assert.equal((await managerClient.request('/api/auth/me')).status, 401);
      assert.equal((await new Client().login('manager-test', 'Manager-test-password-123!')).status, 401);
    }
    pass('disabled and suspended users cannot sign in; changing status revokes existing sessions');
    const revoked = await admin.request('/api/security/users/' + staff.user.id + '/revoke-sessions', 'POST', {});
    assert.equal(revoked.status, 200); assert.equal((await staffClient.request('/api/auth/me')).status, 401);
    assert.equal((await staffClient.request('/api/auth/status')).body.next, 'credentials');
    const reset = await admin.request('/api/security/users/' + staff.user.id + '/reset-password', 'POST', {});
    assert.equal(reset.status, 200); assert.ok(reset.body.temporaryPassword.length >= 30);
    assert.equal((await admin.request('/api/security/users/' + staff.user.id + '/reset-authenticator', 'POST', {})).status, 200);
    assert.equal(await prisma.adminRecoveryCode.count({ where: { userId: staff.user.id } }), 0);
    pass('session revocation, secure temporary password reset and controlled authenticator reset work');
    const role = await admin.request('/api/security/roles', 'POST', { name: 'Read-only admissions', description: 'Integration fixture role', permissions: ['enquiries.view'] });
    assert.equal(role.status, 201);
    const viewer = await createUser('viewer-test', { roleId: role.body.role.id, requireGoogle: false, requireTotp: false });
    const secondViewer = await createUser('second-viewer-test', { roleId: role.body.role.id, requireGoogle: false, requireTotp: false });
    const secondViewerClient = new Client(); await secondViewerClient.login('second-viewer-test', secondViewer.temporaryPassword);
    await secondViewerClient.request('/api/auth/password', 'POST', { password: 'Second-viewer-password-123!' });
    assert.equal((await secondViewerClient.request('/api/enquiries')).status, 200);
    assert.equal((await admin.request('/api/security/roles')).body.items.find(r => r.id === role.body.role.id)._count.users, 2);
    const duplicateName = await admin.request('/api/security/users', 'POST', { username: 'VIEWER-TEST', email: 'unique-viewer@gmail.com', roleId: role.body.role.id });
    assert.equal(duplicateName.status, 409); assert.match(duplicateName.body.error, /unique username/);
    const viewerClient = new Client(); await viewerClient.login('viewer-test', viewer.temporaryPassword);
    await viewerClient.request('/api/auth/password', 'POST', { password: 'Viewer-test-password-123!' });
    assert.equal((await viewerClient.request('/api/enquiries')).status, 200);
    assert.equal((await viewerClient.request('/api/applications')).status, 403);
    assert.equal((await viewerClient.request('/api/enquiries/missing', 'DELETE')).status, 403);
    assert.equal((await admin.request('/api/security/users/' + viewer.user.id, 'PATCH', { permissions: [{ key: 'enquiries.view', allowed: false }] })).status, 200);
    await viewerClient.login('viewer-test', 'Viewer-test-password-123!');
    assert.equal((await viewerClient.request('/api/enquiries')).status, 403, 'individual deny overrides inherited role access');
    await admin.request('/api/security/roles/' + role.body.role.id, 'PUT', { name: 'Read-only admissions', description: 'Updated', permissions: [] });
    assert.equal((await viewerClient.request('/api/auth/me')).status, 401);
    assert.equal((await secondViewerClient.request('/api/auth/me')).status, 401);
    pass('one role is reusable across multiple users; usernames remain case-insensitively unique; role changes revoke all affected sessions');

    const allAccess = await createUser('all-permissions-test', { requireGoogle: false, requireTotp: false,
      permissions: core.PERMISSIONS.map(key => ({ key, allowed: true })) });
    assert.equal(allAccess.user.permissions.length, core.PERMISSIONS.length, 'all available permissions may be granted to an ordinary staff account');
    const allRole = await admin.request('/api/security/roles', 'POST', { name: 'All available access', description: 'No artificial permission cap', permissions: core.PERMISSIONS });
    assert.equal(allRole.status, 201);
    assert.equal((await prisma.adminRolePermission.count({ where: { roleId: allRole.body.role.id } })), core.PERMISSIONS.length);
    const authorizedDeleter = await createUser('deletion-manager', { requireGoogle: false, requireTotp: false,
      permissions: ['users.delete', 'google.delete'].map(key => ({ key, allowed: true })) });
    const deleterClient = new Client(); await deleterClient.login('deletion-manager', authorizedDeleter.temporaryPassword);
    await deleterClient.request('/api/auth/password', 'POST', { password: 'Deletion-manager-password-123!' });
    assert.equal((await guest.request('/api/security/users/' + defaultStaff.user.id, 'DELETE')).status, 401);
    await secondViewerClient.login('second-viewer-test', 'Second-viewer-password-123!');
    assert.equal((await secondViewerClient.request('/api/security/users/' + defaultStaff.user.id, 'DELETE')).status, 403);
    assert.equal((await secondViewerClient.request('/api/security/google/missing', 'DELETE')).status, 403);
    assert.equal((await admin.request('/api/security/users/' + legacy.id, 'DELETE')).status, 403, 'self deletion is forbidden');
    assert.equal((await deleterClient.request('/api/security/users/' + legacy.id, 'DELETE')).status, 403, 'delegated deletion cannot remove a Super Administrator');

    const pendingDeletion = await createUser('pending-deletion-test', { roleId: role.body.role.id, requireGoogle: false, requireTotp: false });
    const staleAdmin = new Client(); await staleAdmin.login('existing-admin', 'Existing-test-password-123!');
    const staleSession = await prisma.adminAuthSession.findFirst({ where: { userId: legacy.id, revokedAt: null }, orderBy: { createdAt: 'desc' } });
    const staleData = JSON.parse(staleSession.dataJson); staleData.reauthenticatedAt = Date.now() - 6 * 60000;
    await prisma.adminAuthSession.update({ where: { id: staleSession.id }, data: { dataJson: JSON.stringify(staleData) } });
    assert.equal((await staleAdmin.request('/api/security/users/' + pendingDeletion.user.id, 'DELETE')).status, 428);
    assert(await prisma.adminUser.findUnique({ where: { id: pendingDeletion.user.id } }));
    assert.equal((await staleAdmin.request('/api/auth/reauth', 'POST', { password: 'Existing-test-password-123!' })).status, 200);
    assert.equal((await staleAdmin.request('/api/security/users/' + pendingDeletion.user.id, 'DELETE')).status, 200);
    assert.equal((await new Client().login('pending-deletion-test', pendingDeletion.temporaryPassword)).status, 401);

    const deletedUserId = defaultStaff.user.id;
    const retainedHistory = await prisma.adminSecurityEvent.findMany({ where: { userId: deletedUserId }, orderBy: { id: 'asc' } });
    assert(retainedHistory.length > 0, 'the deletion fixture has real sign-in and enrollment history');
    const deletedSessions = await prisma.adminAuthSession.findMany({ where: { userId: deletedUserId } });
    await prisma.adminOAuthState.create({ data: { id: 'deletion-oauth-fixture', userId: deletedUserId, sessionHash: 'fixture', nonceHash: 'fixture', verifierBox: 'fixture', expiresAt: new Date(Date.now() + 60000) } });
    await prisma.siteConfig.create({ data: { key: '__session:delete-legacy-fixture', valueJson: JSON.stringify({ adminId: deletedUserId }) } });
    assert.equal((await admin.request('/api/security/users/' + deletedUserId, 'DELETE')).status, 200);
    assert.equal(await prisma.adminUser.findUnique({ where: { id: deletedUserId } }), null);
    for (const table of ['authorizedGoogleAccount', 'userAuthenticator', 'adminRecoveryCode', 'adminUserPermission', 'adminOAuthState']) assert.equal(await prisma[table].count({ where: { userId: deletedUserId } }), 0);
    assert.equal(await prisma.siteConfig.count({ where: { key: '__session:delete-legacy-fixture' } }), 0);
    assert.deepEqual(await prisma.adminSecurityEvent.findMany({ where: { userId: deletedUserId }, orderBy: { id: 'asc' } }), retainedHistory, 'deletion does not change even one field in historical events');
    const revokedRows = await prisma.adminAuthSession.findMany({ where: { id: { in: deletedSessions.map(s => s.id) } } });
    assert(revokedRows.every(s => s.revokedAt && s.userId === null));
    assert.equal((await defaultStaffClient.request('/api/auth/me')).status, 401);
    assert.equal((await new Client().login(defaultStaff.user.username, 'Default-factor-password-123!')).status, 401);
    const historyAfterDeletion = await admin.request('/api/security/events?userId=' + deletedUserId);
    assert.equal(historyAfterDeletion.body.total, retainedHistory.length);
    const replacementStaff = await createUser('default-factor-staff', { requireGoogle: false, requireTotp: false });
    assert.notEqual(replacementStaff.user.id, deletedUserId, 'a deleted username and Gmail can be provisioned again with a new identity');
    assert.equal((await admin.request('/api/security/roles')).body.items.find(r => r.id === role.body.role.id)._count.users, 2, 'deleting an account retains shared roles and other assignees');
    assert.equal((await admin.request('/api/security/users/' + deletedUserId, 'DELETE')).status, 404);
    await assert.rejects(() => db.query('UPDATE admin_security_events SET description = $1 WHERE id = $2', ['forbidden', retainedHistory[0].id]), /append-only/);
    pass('all permissions are assignable; confirmed user deletion removes pending or enrolled accounts and credentials, revokes sessions, keeps shared roles and immutable history, and enforces permission/reauth/self/Super Administrator boundaries');

    const googleDeletion = await createUser('gmail-deletion-test', { requireGoogle: false, requireTotp: false });
    const gmailClient = new Client(); await gmailClient.login('gmail-deletion-test', googleDeletion.temporaryPassword);
    await gmailClient.request('/api/auth/password', 'POST', { password: 'Gmail-deletion-password-123!' });
    const primaryGmail = await prisma.authorizedGoogleAccount.findFirst({ where: { userId: googleDeletion.user.id } });
    const extraGmail = await prisma.authorizedGoogleAccount.create({ data: { userId: googleDeletion.user.id, email: 'extra-delete@gmail.com' } });
    assert.equal((await deleterClient.request('/api/security/google/' + extraGmail.id, 'DELETE')).status, 200);
    assert(await prisma.adminUser.findUnique({ where: { id: googleDeletion.user.id } }));
    assert(await prisma.authorizedGoogleAccount.findUnique({ where: { id: primaryGmail.id } }));
    assert.equal(await prisma.authorizedGoogleAccount.findUnique({ where: { id: extraGmail.id } }), null);
    assert.equal((await gmailClient.request('/api/auth/me')).status, 401);
    assert.equal((await deleterClient.request('/api/security/google/' + extraGmail.id, 'DELETE')).status, 404);
    await gmailClient.login('gmail-deletion-test', 'Gmail-deletion-password-123!');
    assert.equal((await gmailClient.request('/api/auth/me')).status, 200, 'removing a Google authorization preserves independent password access when Google was optional');
    await prisma.adminUser.update({ where: { id: googleDeletion.user.id }, data: { requireGoogle: true } });
    assert.equal((await admin.request('/api/security/google/' + primaryGmail.id, 'DELETE')).status, 200);
    assert.equal((await prisma.adminUser.findUnique({ where: { id: googleDeletion.user.id } })).requireGoogle, true, 'removing Gmail must not silently disable a required Google policy');
    const ownGmail = await prisma.authorizedGoogleAccount.create({ data: { userId: legacy.id, email: 'self-removal@gmail.com' } });
    assert.equal((await admin.request('/api/security/google/' + ownGmail.id, 'DELETE')).status, 403);
    assert.equal((await deleterClient.request('/api/security/google/' + ownGmail.id, 'DELETE')).status, 403);
    const googleAudit = await prisma.adminSecurityEvent.findFirst({ where: { event: 'google_account_deleted', target: primaryGmail.id } }); assert(googleAudit);
    pass('Gmail authorization deletion removes only the selected address, preserves staff/history/policies, revokes sessions and blocks unauthorized or self deletion');
    const restorer = await createUser('restore-test', { requireGoogle: false, requireTotp: false,
      permissions: ['backup.manage', 'settings.edit', 'settings.publish'].map(key => ({ key, allowed: true })) });
    const restoreClient = new Client(); await restoreClient.login('restore-test', restorer.temporaryPassword);
    await restoreClient.request('/api/auth/password', 'POST', { password: 'Restore-test-password-123!' });
    assert.equal((await restoreClient.request('/api/config/restore', 'POST', [{ key: 'newsPageConfig', value: { title: 'Denied' } }])).status, 403);
    assert.equal((await restoreClient.request('/api/config/restore', 'POST', { configs: { newsPageConfig: { title: 'Denied' } } })).status, 403);
    assert.equal(await prisma.siteConfig.count({ where: { key: 'newsPageConfig' } }), 0);
    pass('array and object backup restores verify permissions for every target module before writing');
    const freshClient = new Client(); await freshClient.login('existing-admin', 'Existing-test-password-123!');
    const sid = (await prisma.adminAuthSession.findMany({ where: { userId: legacy.id }, orderBy: { createdAt: 'desc' }, take: 1 }))[0];
    await prisma.adminAuthSession.update({ where: { id: sid.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    assert.equal((await freshClient.request('/api/auth/me')).status, 401);
    pass('server-side session expiry rejects a still-present browser cookie');
    const logs = await admin.request('/api/security/events');
    assert.equal(logs.status, 200); assert.ok(logs.body.total > 20); assert.equal(logs.body.timezone, 'Asia/Kolkata');
    assert.ok(logs.body.roles.includes('Admissions Staff'));
    const admissionsHistory = await admin.request('/api/security/events?role=Admissions%20Staff');
    assert.ok(admissionsHistory.body.items.length > 0);
    assert.ok(admissionsHistory.body.items.every(row => row.role === 'Admissions Staff'));
    for (const event of ['login_success', 'password_verified', 'google_verified', 'authenticator_enrolled', 'authenticator_recovery', 'password_reset', 'authenticator_reset', 'permissions_changed', 'role_changed', 'access_rejected', 'logout', 'session_expired']) {
      assert.ok(await prisma.adminSecurityEvent.count({ where: { event } }), 'event persisted: ' + event);
    }
    const all = await prisma.adminSecurityEvent.findMany();
    const serialized = JSON.stringify(all);
    for (const secret of [staff.temporaryPassword, password, factor.secret, factor.codes[0], process.env.ADMIN_TOTP_ENCRYPTION_KEY]) assert.ok(!serialized.includes(secret), 'audit never contains credentials');
    assert.ok(all.every(event => event.createdAt.toISOString().endsWith('Z')));
    const sample = all.find(event => event.event === 'login_success');
    const ist = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(sample.createdAt);
    assert.ok(ist.length > 0);
    await assert.rejects(() => prisma.adminSecurityEvent.deleteMany({ where: { id: sample.id } }), /append-only/);
    pass('successful/failed stages and security changes persist as immutable UTC audit events with IST display support and no credential leakage');
    const keyFile = path.join(directory, 'operator-key.json');
    await operator(['key', '--output', keyFile]); assert.equal(Buffer.from(JSON.parse(fs.readFileSync(keyFile)).ADMIN_TOTP_ENCRYPTION_KEY, 'base64').length, 32);
    const bootstrapFile = path.join(directory, 'replacement.json');
    const savedGoogleId = process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_ID;
    await operator(['create-super', '--username', 'replacement-super', '--email', 'replacement-super@gmail.com', '--output', bootstrapFile]);
    await assert.rejects(() => operator(['activate', '--username', 'replacement-super']));
    assert.equal((await prisma.adminUser.findUnique({ where: { id: legacy.id } })).status, 'Active');
    const bootstrap = JSON.parse(fs.readFileSync(bootstrapFile));
    const replacement = new Client(); await replacement.login(bootstrap.username, bootstrap.temporaryPassword);
    assert.equal((await replacement.request('/api/auth/password', 'POST', { password: 'Replacement-password-123!' })).body.next, 'enroll');
    await enroll(replacement);
    process.env.GOOGLE_CLIENT_ID = savedGoogleId;
    if (process.env.BROWSER_TEST === '1') await require('./security-browser.cjs')({ app, base, adminPassword: 'Existing-test-password-123!', google: value => { googlePayload = value.payload; expectedChallenge = value.challenge; } });
    const { configureAuthenticator } = require('../scripts/configure-authenticator.cjs');
    const priorKey = process.env.ADMIN_TOTP_ENCRYPTION_KEY;
    process.env.ADMIN_TOTP_ENCRYPTION_KEY = crypto.randomBytes(32).toString('base64');
    await assert.rejects(() => configureAuthenticator(prisma));
    assert.equal((await prisma.adminUser.findUnique({ where: { id: staff.user.id } })).requireGoogle, true);
    process.env.ADMIN_TOTP_ENCRYPTION_KEY = priorKey;
    assert.ok(await configureAuthenticator(prisma) > 0);
    assert.equal(await prisma.adminUser.count({ where: { OR: [{ requireGoogle: true }, { requireTotp: false }] } }), 0);
    assert.equal((await prisma.adminUser.findUnique({ where: { id: staff.user.id } })).passwordHash.startsWith('$argon2id$'), true);
    assert.equal((await prisma.userAuthenticator.findUnique({ where: { userId: legacyFactorUser.id } })).enabled, true);
    assert.equal((await admin.request('/api/auth/me')).status, 401);
    assert.equal(await configureAuthenticator(prisma), 0, 'reapplying the same profile does not invalidate more sessions');
    pass('operator profile converts existing accounts, preserves passwords and enrolled factors, revokes old sessions and rejects an incorrect encryption key');
    await operator(['activate', '--username', 'replacement-super']);
    assert.equal((await prisma.adminUser.findUnique({ where: { id: legacy.id } })).status, 'Disabled');
    assert.equal((await admin.request('/api/auth/me')).status, 401);
    pass('trusted credential provisioning refuses premature cutover; verified replacement activation retires old credentials and sessions');
    const recoveryFile = path.join(directory, 'recovery.json');
    await operator(['recover', '--username', 'replacement-super', '--output', recoveryFile, '--acknowledge-identity-verification', 'yes']);
    assert.equal(await prisma.userAuthenticator.count({ where: { userId: (await prisma.adminUser.findUnique({ where: { username: 'replacement-super' } })).id } }), 0);
    assert.equal((await prisma.adminUser.findUnique({ where: { username: 'replacement-super' } })).requireGoogle, false, 'recovery preserves the selected Authenticator-only flow');
    assert.ok(await prisma.adminSecurityEvent.count({ where: { event: 'operator_account_recovery' } }));
    pass('operator-assisted account recovery creates protected one-time credentials and an auditable mandatory re-enrollment path');
    const brute = new Client();
    await prisma.adminLoginThrottle.deleteMany();
    for (let i = 0; i < 20; i++) assert.equal((await brute.login('unknown-throttle', 'wrong')).status, 401);
    assert.equal((await brute.login('unknown-throttle', 'wrong')).status, 429);
    pass('persistent authentication rate limiting temporarily locks repeated invalid attempts');
    fs.writeFileSync(path.join(directory, 'report.json'), JSON.stringify({ passed, count: passed.length }, null, 2));
    console.log('Security integration suite passed: ' + passed.length + ' scenario groups. Isolated report: ' + path.join(directory, 'report.json'));
  } finally {
    OAuth2Client.prototype.getToken = realGetToken; OAuth2Client.prototype.verifyIdToken = realVerify;
    await new Promise(resolve => server.close(resolve)); await prisma.$disconnect(); await socket.stop(); await db.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
