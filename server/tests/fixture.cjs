// Isolated test environment for manual/automated browser checks.
const { PGlite } = require('@electric-sql/pglite');
const { PGLiteSocketServer } = require('@electric-sql/pglite-socket');
const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');
(async () => {
  const db = await PGlite.create();
  for (const migration of fs.readdirSync('prisma/migrations').filter(name => name.startsWith('2026')).sort()) {
    await db.exec(fs.readFileSync(`prisma/migrations/${migration}/migration.sql`, 'utf8'));
  }
  const socket = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 55439 });
  await socket.start();
  process.env.DATABASE_URL='postgresql://postgres:postgres@127.0.0.1:55439/postgres?connection_limit=1';
  process.env.UPLOADS_DIR=path.resolve('../work/test-uploads');
  process.env.SESSION_SECRET='browser-test-secret-with-at-least-32-characters';
  const prisma = require('../dist/prisma').default;
  await prisma.adminUser.create({ data: { username: 'test-admin', passwordHash: await bcrypt.hash('Test-only-password-123', 10), role: 'superadmin', credentialMode: 'legacy', mustChangePassword: false, requireGoogle: false, requireTotp: false } });
  const app = require('../dist/index').default;
  const express = require('express');
  app.use(express.static(path.resolve('../dist')));
  app.get('*', (_req,res) => res.sendFile(path.resolve('../dist/index.html')));
  const api = app.listen(5501,'127.0.0.1');
  console.log('Browser test site ready: http://127.0.0.1:5501/admin');
  const stop = async () => { await new Promise(resolve => api.close(resolve)); await prisma.$disconnect(); await socket.stop(); await db.close(); process.exit(); };
  process.on('SIGINT',stop);process.on('SIGTERM',stop);
})().catch(e=>{console.error(e);process.exit(1)});
