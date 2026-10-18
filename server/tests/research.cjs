// Isolated PostgreSQL, Express and browser verification. Never uses production data.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const { PGlite } = require('@electric-sql/pglite');
const { PGLiteSocketServer } = require('@electric-sql/pglite-socket');

(async () => {
  const uploads = fs.mkdtempSync(path.join(os.tmpdir(), 'university-research-'));
  const output = path.resolve('../work/research-qa'); fs.mkdirSync(output, { recursive: true });
  const db = await PGlite.create();
  for (const name of fs.readdirSync('prisma/migrations').filter(n => /^2026/.test(n)).sort()) await db.exec(fs.readFileSync(`prisma/migrations/${name}/migration.sql`, 'utf8'));
  const socket = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 55448, maxConnections: 5 }); await socket.start();
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:55448/postgres?connection_limit=1';
  process.env.SESSION_SECRET = crypto.randomBytes(40).toString('hex');
  process.env.UPLOADS_DIR = uploads; process.env.NODE_ENV = 'test';
  const prisma = require('../dist/prisma').default;
  const app = require('../dist/index').default;
  const express = require('express');
  app.use(express.static(path.resolve('../work/research-build')));
  app.get('*', (_req, res) => res.sendFile(path.resolve('../work/research-build/index.html')));
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    await prisma.adminUser.create({ data: { username: 'research-admin', passwordHash: await bcrypt.hash('Research-test-password-123!', 10), role: 'superadmin', credentialMode: 'legacy', mustChangePassword: false, requireGoogle: false, requireTotp: false } });
    assert.equal((await fetch(base + '/api/config/researchContent', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 401);
    const { default: puppeteer } = await import('puppeteer-core');
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const admin = await browser.newPage(); const errors = [];
    admin.on('pageerror', error => errors.push(error.message));
    await admin.setViewport({ width: 1440, height: 1000 });
    const click = async (page, text, scope = '') => {
      const element = await page.waitForFunction(({ text, scope }) => [...document.querySelectorAll(scope + ' button')].find(el => (el.textContent.trim() === text || el.querySelector(':scope > span')?.textContent.trim() === text) && el.getBoundingClientRect().width && !el.disabled), {}, { text, scope });
      await element.asElement().click(); await element.dispose();
    };
    await admin.goto(base + '/admin');
    await admin.waitForSelector('input[placeholder="Enter your username or email"]');
    await admin.type('input[placeholder="Enter your username or email"]', 'research-admin');
    await admin.type('input[placeholder="Enter password"]', 'Research-test-password-123!');
    await admin.click('button[type=submit]');
    await click(admin, 'Research & Innovation', '.admin-sidebar');
    await admin.waitForSelector('.research-admin');
    await admin.waitForFunction(() => !document.querySelector('.research-admin-fields').disabled);
    assert.equal(await admin.$$eval('.research-admin-tabs button', els => els.length), 12);
    await click(admin, 'Publish changes', '.research-admin');
    await admin.waitForSelector('.research-admin-message');
    const published = await (await fetch(base + '/api/config/researchContent?raw=true')).json();
    assert.equal(published.schemaVersion, 2); assert.equal(published.items.length, 14);
    console.log('PASS: admin publishes all reference sections and documents to PostgreSQL; anonymous writes denied');

    const visitorContext = await browser.createBrowserContext();
    const visitor = await visitorContext.newPage(); visitor.on('pageerror', error => errors.push(error.message));
    await visitor.setViewport({ width: 1440, height: 1100 });
    await visitor.goto(base + '/research'); await visitor.waitForFunction(() => document.querySelector('.research-content')?.getAttribute('aria-busy') === 'false');
    await visitor.waitForSelector('.research-accordion');
    assert.equal(await visitor.$$eval('.research-sidebar nav button', els => els.length), 12);
    assert.equal(await visitor.$$eval('.research-document', els => els.length), 13);
    assert.equal(await visitor.$eval('.research-sidebar', el => getComputedStyle(el).backgroundColor), 'rgb(7, 42, 108)');
    assert.equal(await visitor.$eval('.research-sidebar [aria-current]', el => getComputedStyle(el).backgroundColor), 'rgb(212, 175, 55)');
    await visitor.screenshot({ path: path.join(output, 'research-desktop.png'), fullPage: true });
    await visitor.click('.research-accordion summary');
    assert.equal(await visitor.$eval('.research-accordion', el => el.open), false);
    await visitor.focus('.research-accordion summary'); await visitor.keyboard.press('Enter');
    assert.equal(await visitor.$eval('.research-accordion', el => el.open), true);
    for (const label of published.sections.map(s => s.title)) { await click(visitor, label, '.research-sidebar'); await visitor.waitForFunction(label => document.querySelector('#research-section-title')?.textContent === label, {}, label); }
    await click(visitor, 'Research Updates', '.research-sidebar');
    await visitor.reload(); await visitor.waitForSelector('.research-accordion');
    console.log('PASS: clean visitor sees server content; all sidebar tabs and keyboard accordion work');

    await click(admin, 'Add item', '.research-admin'); await admin.waitForSelector('.research-admin-dialog[open]');
    await admin.type('.research-admin-dialog input', 'Research server sync verification');
    await admin.type('.research-admin-dialog textarea', 'Published through the research administrator.');
    const fileInput = await admin.$('.research-admin-dialog input[placeholder="https://… or /uploads/document.pdf"]');
    await fileInput.type('/research?section=downloads');
    await click(admin, 'Save & publish item', '.research-admin-dialog');
    await admin.waitForFunction(() => !document.querySelector('.research-admin-dialog'));
    await visitor.reload();
    await visitor.waitForFunction(() => document.querySelector('.research-documents')?.textContent.includes('Research server sync verification'));
    assert.equal(await visitor.$eval('.research-documents a', el => el.getAttribute('href')), '/research?section=downloads');
    const matchingItem = await admin.waitForFunction(() => [...document.querySelectorAll('.research-admin-item')].find(el => el.textContent.includes('Research server sync verification')));
    await (await matchingItem.asElement().$('button:nth-last-child(2)')).click();
    await admin.waitForSelector('.research-admin-dialog[open]');
    await click(admin, 'Choose document from Media Storage', '.research-admin-dialog');
    await admin.waitForSelector('.media-picker-dialog');
    await admin.click('[aria-label="Close Media Storage"]');
    await admin.waitForSelector('.research-admin-dialog[open]');
    await click(admin, 'Cancel', '.research-admin-dialog');
    await (await matchingItem.asElement().$('button:nth-last-child(3)')).click();
    await admin.waitForFunction(() => [...document.querySelectorAll('.research-admin-item')].some(el => el.textContent.includes('Research server sync verification') && el.classList.contains('is-hidden')));
    await visitor.reload(); await visitor.waitForFunction(() => document.querySelector('.research-content')?.getAttribute('aria-busy') === 'false');
    assert.equal(await visitor.$eval('.research-documents', el => el.textContent.includes('Research server sync verification')), false);
    console.log('PASS: add, media picker and hide persist for a separate visitor browser');

    await visitor.setViewport({ width: 390, height: 844 });
    await visitor.screenshot({ path: path.join(output, 'research-mobile.png'), fullPage: true });
    assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await admin.setViewport({ width: 390, height: 844 });
    await admin.screenshot({ path: path.join(output, 'research-admin-mobile.png'), fullPage: true });
    assert.equal(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await admin.setViewport({ width: 1440, height: 1000 });
    await admin.screenshot({ path: path.join(output, 'research-admin-desktop.png'), fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: desktop and mobile layouts fit; no browser runtime errors');
    console.log('Research verification completed. Screenshots: ' + output);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve)); await prisma.$disconnect(); await socket.stop(); await db.close();
    fs.rmSync(uploads, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
