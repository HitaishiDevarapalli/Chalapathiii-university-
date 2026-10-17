// Translate the Prisma URL into explicit libpq connection settings.
// https://www.postgresql.org/docs/current/libpq-envars.html
// Passwords are stored briefly in a private passfile, never in command arguments.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function connectionSettings(databaseUrl, inherited = process.env) {
  let url;
  try { url = new URL(databaseUrl); } catch { throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.'); }
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('DATABASE_URL must use PostgreSQL.');
  let user, password, database;
  try {
    user = decodeURIComponent(url.username); password = decodeURIComponent(url.password);
    database = decodeURIComponent(url.pathname.slice(1));
  } catch { throw new Error('DATABASE_URL contains invalid URL encoding.'); }
  const host = url.hostname.replace(/^\[|\]$/g, '');
  const port = url.port || '5432';
  if (!host || !user || !database || [host, port, user, password, database].some(value => /[\r\n\0]/.test(value))) {
    throw new Error('DATABASE_URL must explicitly include a host, database and database user, with no line breaks.');
  }
  const env = { ...inherited, PGHOST: host, PGPORT: port, PGUSER: user, PGDATABASE: database, PGCONNECT_TIMEOUT: '15' };
  for (const key of ['DATABASE_URL', 'PGPASSWORD', 'PGPASSFILE', 'PGSERVICE', 'PGSERVICEFILE']) delete env[key];
  const options = { sslmode: 'PGSSLMODE', sslrootcert: 'PGSSLROOTCERT', sslcert: 'PGSSLCERT', sslkey: 'PGSSLKEY', channel_binding: 'PGCHANNELBINDING', connect_timeout: 'PGCONNECT_TIMEOUT' };
  for (const [parameter, variable] of Object.entries(options)) if (url.searchParams.has(parameter)) env[variable] = url.searchParams.get(parameter);
  return { env, password };
}

function backupDatabase(databaseUrl, destination, inherited = process.env, execute = spawnSync) {
  const { env, password } = connectionSettings(databaseUrl, inherited);
  const privateDir = fs.mkdtempSync(path.join(path.dirname(destination), '.pgpass-'));
  fs.chmodSync(privateDir, 0o700);
  const passfile = path.join(privateDir, 'passfile');
  const escape = value => value.replace(/\\/g, '\\\\').replace(/:/g, '\\:');
  try {
    fs.writeFileSync(passfile, [env.PGHOST, env.PGPORT, env.PGDATABASE, env.PGUSER, password].map(escape).join(':') + '\n', { flag: 'wx', mode: 0o600 });
    const result = execute('pg_dump', ['--format=custom', '--no-password', '--file', destination], {
      env: { ...env, PGPASSFILE: passfile }, stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8',
    });
    if (result.error || result.status !== 0) {
      let detail = String(result.stderr || result.error?.code || 'unknown database error');
      for (const secret of [databaseUrl, password, encodeURIComponent(password)].filter(Boolean)) detail = detail.split(secret).join('[redacted]');
      throw new Error('Database backup failed: ' + detail.trim().slice(0, 1500));
    }
    const stat = fs.statSync(destination);
    if (!stat.isFile() || stat.size === 0) throw new Error('Database backup did not produce a nonempty archive.');
    fs.chmodSync(destination, 0o600);
  } finally {
    if (fs.existsSync(passfile)) fs.unlinkSync(passfile);
    fs.rmdirSync(privateDir);
  }
}
module.exports = { connectionSettings, backupDatabase };
