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
  const beforeSecurity = migrations.filter(name => name !== '202610160001_admin_security');
  for (const name of beforeSecurity) await db.exec(fs.readFileSync('prisma/migrations/' + name + '/migration.sql', 'utf8'));
  await db.query('INSERT INTO admin_users (username, password_hash, role) VALUES ($1,$2,$3)', ['existing-admin', await bcrypt.hash('Existing-test-password-123!', 10), 'superadmin']);
  await db.exec(fs.readFileSync('prisma/migrations/202610160001_admin_security/migration.sql', 'utf8'));
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
    const result = await admin.request('/api/security/users', 'POST', { username, email: username + '@gmail.com', roleId: 'administrative-admin', ...extra });
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
    await prisma.adminSecurityPolicy.update({ where: { id: 1 }, data: { maxAttempts: 20 } });
    assert.equal((await admin.login('existing-admin', 'Existing-test-password-123!')).body.next, 'complete');
    assert.equal((await admin.request('/api/auth/me')).status, 200);
    const legacy = await prisma.adminUser.findUnique({ where: { username: 'existing-admin' } });
    assert.equal(legacy.credentialMode, 'legacy'); assert.match(legacy.passwordHash, /^\$argon2id\$/);
    pass('additive migration preserves existing administrator access and upgrades bcrypt on verified login');
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
    pass('custom roles default-deny unassigned resources; role changes revoke affected sessions');
    const freshClient = new Client(); await freshClient.login('existing-admin', 'Existing-test-password-123!');
    const sid = (await prisma.adminAuthSession.findMany({ where: { userId: legacy.id }, orderBy: { createdAt: 'desc' }, take: 1 }))[0];
    await prisma.adminAuthSession.update({ where: { id: sid.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    assert.equal((await freshClient.request('/api/auth/me')).status, 401);
    pass('server-side session expiry rejects a still-present browser cookie');
    const logs = await admin.request('/api/security/events');
    assert.equal(logs.status, 200); assert.ok(logs.body.total > 20); assert.equal(logs.body.timezone, 'Asia/Kolkata');
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
    await operator(['create-super', '--username', 'replacement-super', '--email', 'replacement-super@gmail.com', '--output', bootstrapFile]);
    await assert.rejects(() => operator(['activate', '--username', 'replacement-super']));
    assert.equal((await prisma.adminUser.findUnique({ where: { id: legacy.id } })).status, 'Active');
    const bootstrap = JSON.parse(fs.readFileSync(bootstrapFile));
    const replacement = new Client(); await replacement.login(bootstrap.username, bootstrap.temporaryPassword);
    await replacement.request('/api/auth/password', 'POST', { password: 'Replacement-password-123!' }); await google(replacement, bootstrap.email); await enroll(replacement);
    if (process.env.BROWSER_TEST === '1') await require('./security-browser.cjs')({ base, adminPassword: 'Existing-test-password-123!', google: () => ({ set: value => { googlePayload = value.payload; expectedChallenge = value.challenge; } }) });
    await operator(['activate', '--username', 'replacement-super']);
    assert.equal((await prisma.adminUser.findUnique({ where: { id: legacy.id } })).status, 'Disabled');
    assert.equal((await admin.request('/api/auth/me')).status, 401);
    pass('trusted credential provisioning refuses premature cutover; verified replacement activation retires old credentials and sessions');
    const recoveryFile = path.join(directory, 'recovery.json');
    await operator(['recover', '--username', 'replacement-super', '--output', recoveryFile, '--acknowledge-identity-verification', 'yes']);
    assert.equal(await prisma.userAuthenticator.count({ where: { userId: (await prisma.adminUser.findUnique({ where: { username: 'replacement-super' } })).id } }), 0);
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
