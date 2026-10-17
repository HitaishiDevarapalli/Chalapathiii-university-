const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { connectionSettings, backupDatabase } = require('../pg-backup.cjs');
const url = 'postgresql://college_user:fixture%3Apass%5Cword@127.0.0.1:5433/university?schema=public&connection_limit=1&sslmode=require';
const { env, password } = connectionSettings(url, { PGUSER: 'root', PGHOST: '/var/run/postgresql', PGDATABASE: 'root', PGPASSWORD: 'wrong', PGSERVICE: 'wrong', DATABASE_URL: url });
assert.equal(env.PGHOST, '127.0.0.1'); assert.equal(env.PGPORT, '5433'); assert.equal(env.PGUSER, 'college_user');
assert.equal(env.PGDATABASE, 'university'); assert.equal(env.PGSSLMODE, 'require'); assert.equal(password, 'fixture:pass\\word');
for (const key of ['DATABASE_URL', 'PGPASSWORD', 'PGSERVICE']) assert.equal(key in env, false);
assert.equal(connectionSettings('postgres://u:p@[::1]/db', {}).env.PGHOST, '::1');
for (const invalid of ['', 'file:dev.db', 'postgres://localhost/db', 'postgres://u:p@localhost/', 'postgres://u:p%0A@localhost/db']) assert.throws(() => connectionSettings(invalid, {}));
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-backup-test-'));
const destination = path.join(directory, 'database.dump');
let passfile;
try {
  backupDatabase(url, destination, {}, (command, args, options) => {
    assert.equal(command, 'pg_dump'); assert(args.includes('--no-password'));
    assert(!args.join(' ').includes('fixture')); assert(!args.join(' ').includes(url));
    assert.equal(options.env.PGUSER, 'college_user'); assert.equal(options.env.PGDATABASE, 'university');
    passfile = options.env.PGPASSFILE;
    assert.equal(fs.readFileSync(passfile, 'utf8'), '127.0.0.1:5433:university:college_user:fixture\\:pass\\\\word\n');
    fs.writeFileSync(destination, 'PGDMP-fixture');
    return { status: 0 };
  });
  assert.equal(fs.existsSync(passfile), false);
  assert.throws(() => backupDatabase(url, destination, {}, (_command, _args, options) => {
    passfile = options.env.PGPASSFILE;
    return { status: 1, stderr: 'bad password: ' + password + ' URL: ' + url };
  }), error => !error.message.includes(password) && !error.message.includes(url) && error.message.includes('[redacted]'));
  assert.equal(fs.existsSync(passfile), false);
  fs.unlinkSync(destination);
  assert.throws(() => backupDatabase(url, destination, {}, () => ({ status: 0 })), /ENOENT|archive/);
  assert.deepEqual(fs.readdirSync(directory), []);
  console.log('PASS: explicit PostgreSQL account/host/database, URL decoding, SSL options, private temporary password file, cleanup, backup output validation and redacted errors.');
} finally {
  if (fs.existsSync(destination)) fs.unlinkSync(destination);
  fs.rmdirSync(directory);
}
