// Supplied university content: real API persistence, admin editing and public rendering.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const { PGlite } = require('@electric-sql/pglite');
const { PGLiteSocketServer } = require('@electric-sql/pglite-socket');
const content = require('../../src/data/researchContent2026.json');
const { researchContentSchema, safeResearchUrl } = require('../dist/research/schema');

(async () => {
  assert.equal(researchContentSchema.safeParse(content).success, true);
  assert.equal(content.sections.length, 18);
  const eligibility = content.sections.find(section => section.id === 'eligibility').blocks.find(block => block.table).table;
  assert.equal(eligibility.rows.length, 11);
  assert.equal(eligibility.rows[1][0].rowSpan, 4);
  assert.equal(eligibility.rows[6][0].rowSpan, 4);
  assert.equal(eligibility.rows[6][2].rowSpan, 4);
  assert.equal(safeResearchUrl('mailto:research@chalapathiuniversity.edu.in'), 'mailto:research@chalapathiuniversity.edu.in');
  for (const value of ['javascript:alert(1)', 'mailto:a@example.com?bcc=b@example.com', 'mailto:a@example.com\r\nbcc:b@example.com']) assert.equal(safeResearchUrl(value), undefined);
  const pdfs = fs.readdirSync('../public/research/downloads');
  assert.equal(pdfs.length, 6);
  for (const name of pdfs) assert.equal(fs.readFileSync('../public/research/downloads/' + name).subarray(0, 5).toString(), '%PDF-');

  const db = await PGlite.create();
  for (const name of fs.readdirSync('prisma/migrations').filter(name => /^2026/.test(name)).sort()) await db.exec(fs.readFileSync(`prisma/migrations/${name}/migration.sql`, 'utf8'));
  const socket = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 55450, maxConnections: 5 });
  await socket.start();
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:55450/postgres?connection_limit=1';
  process.env.SESSION_SECRET = crypto.randomBytes(40).toString('hex');
  process.env.NODE_ENV = 'test';
  const prisma = require('../dist/prisma').default;
  const app = require('../dist/index').default;
  app.use(require('express').static(path.resolve('../dist')));
  app.get('*', (_req, res) => res.sendFile(path.resolve('../dist/index.html')));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    await prisma.adminUser.create({ data: { username: 'supplied-research-admin', passwordHash: await bcrypt.hash('Research-content-test-123!', 10), role: 'superadmin', credentialMode: 'legacy', mustChangePassword: false, requireGoogle: false, requireTotp: false } });
    assert.equal((await fetch(base + '/api/config/researchContent', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) })).status, 401);
    const { default: puppeteer } = await import('puppeteer-core');
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const visitor = await browser.newPage();
    const errors = [];
    visitor.on('pageerror', error => errors.push(error.message));
    await visitor.setViewport({ width: 1440, height: 1050 });
    const output = path.resolve('../work/research-qa/supplied-content');
    fs.mkdirSync(output, { recursive: true });
    for (const section of content.sections) {
      await visitor.goto(base + '/research?section=' + section.id, { waitUntil: 'domcontentloaded' });
      await visitor.waitForFunction(title => document.querySelector('#research-section-title')?.textContent === title && document.querySelector('.research-content')?.getAttribute('aria-busy') === 'false', {}, section.title);
      assert.equal(await visitor.$$eval('.research-sidebar nav button', elements => elements.length), 18);
      if (section.id === 'eligibility') {
        assert.equal(await visitor.$$eval('td[rowspan="4"]', elements => elements.length), 3);
        assert.equal(await visitor.$$eval('.research-data-table tr', elements => elements.length), 11);
        await visitor.screenshot({ path: path.join(output, 'eligibility-desktop.png'), fullPage: true });
        await visitor.setViewport({ width: 390, height: 844 });
        assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert.equal(await visitor.$eval('.research-table-scroll', element => element.scrollWidth > element.clientWidth), true);
        await visitor.screenshot({ path: path.join(output, 'eligibility-mobile.png'), fullPage: true });
        await visitor.setViewport({ width: 1440, height: 1050 });
      }
      if (section.id === 'faqs') {
        assert.equal(await visitor.$$('.research-accordion').then(items => items.length), 10);
        await visitor.click('.research-accordion summary');
        assert.equal(await visitor.$eval('.research-accordion', element => element.open), false);
      }
      for (const link of await visitor.$$eval('a[href^="/research/downloads/"]', links => links.map(link => link.getAttribute('href')))) {
        const response = await fetch(base + link);
        assert.equal(response.status, 200);
        assert.deepEqual(Buffer.from(await response.arrayBuffer()), fs.readFileSync(path.resolve('../public' + link)));
      }
    }
    console.log('PASS: 18 public sections, merged eligibility, ten FAQs, six PDF downloads and mobile scrolling.');

    const admin = await browser.newPage();
    admin.on('pageerror', error => errors.push(error.message));
    await admin.setViewport({ width: 1640, height: 1100 });
    const click = async text => {
      const handle = await admin.waitForFunction(text => [...document.querySelectorAll('button')].find(button => button.textContent.trim() === text && button.getBoundingClientRect().width && !button.disabled), {}, text);
      await handle.asElement().click(); await handle.dispose();
    };
    const ready = () => admin.waitForFunction(() => document.querySelector('.research-admin-fields') && !document.querySelector('.research-admin-fields').disabled);
    const read = async () => (await fetch(base + '/api/config/researchContent?raw=true')).json();
    await admin.goto(base + '/admin');
    await admin.waitForSelector('input[placeholder="Enter your username or email"]');
    await admin.type('input[placeholder="Enter your username or email"]', 'supplied-research-admin');
    await admin.type('input[placeholder="Enter password"]', 'Research-content-test-123!');
    await admin.click('button[type=submit]');
    await click('Research & Innovation'); await ready();
    const publish = async () => { await click('Publish changes'); await admin.waitForSelector('.research-admin-message'); await ready(); };
    await publish();
    assert.deepEqual(await read(), content);
    await admin.$eval('.research-admin-grid input', element => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(element, 'Custom research title');
      element.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await publish(); assert.equal((await read()).pageTitle, 'Custom research title');
    await admin.reload(); await click('Research & Innovation'); await ready();
    assert.equal(await admin.$eval('.research-admin-grid input', element => element.value), 'Custom research title');
    await click('Load supplied research content');
    assert.equal((await read()).pageTitle, 'Custom research title');
    await click('Use supplied content in editor');
    assert.equal((await read()).pageTitle, 'Custom research title');
    assert.equal(await admin.$eval('.research-admin-grid input', element => element.value), content.pageTitle);
    await publish(); assert.deepEqual(await read(), content);
    await admin.reload(); await click('Research & Innovation'); await ready();
    await admin.screenshot({ path: path.join(output, 'admin-supplied-content.png'), fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: admin publishes supplied content, custom edits survive reload, loading the pack waits for publication, and the complete content persists in PostgreSQL.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
    await prisma.$disconnect(); await socket.stop(); await db.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
