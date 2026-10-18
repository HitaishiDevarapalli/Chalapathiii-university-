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
  app.use(express.static(path.resolve('../dist')));
  app.get('*', (_req, res) => res.sendFile(path.resolve('../dist/index.html')));
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

    const readPublished = async () => (await fetch(base + '/api/config/researchContent?raw=true')).json();
    const waitSaved = () => admin.waitForFunction(() => !document.querySelector('.research-admin-fields').disabled && !document.querySelector('.research-admin-error'));
    const replaceInput = async (selector, value) => {
      await admin.focus(selector); await admin.keyboard.down('Control'); await admin.keyboard.press('KeyA'); await admin.keyboard.up('Control');
      await admin.keyboard.press('Backspace'); await admin.type(selector, value);
    };
    const createSection = async title => {
      await click(admin, 'Add sidebar option', '.research-admin');
      await admin.waitForSelector('.research-section-dialog[open]');
      await admin.type('.research-section-dialog input', title);
      await admin.type('.research-section-dialog textarea', 'Explore our research centres and their resources.');
      await click(admin, 'Create & publish option', '.research-section-dialog');
      await admin.waitForFunction(() => !document.querySelector('.research-section-dialog'));
      await waitSaved();
    };
    await click(admin, 'Add sidebar option', '.research-admin');
    await admin.waitForSelector('.research-section-dialog[open]');
    await admin.type('.research-section-dialog input', '  research UPDATES  ');
    await click(admin, 'Create & publish option', '.research-section-dialog');
    await admin.waitForFunction(() => document.querySelector('.research-section-dialog [role=alert]')?.textContent.includes('unique'));
    assert.equal((await readPublished()).sections.length, 12, 'duplicate option names cannot publish');
    await click(admin, 'Cancel', '.research-section-dialog');
    await createSection('Research Centres');
    let config = await readPublished();
    const custom = config.sections.find(s => s.title === 'Research Centres');
    assert(custom); assert.equal(config.sections.length, 13);
    assert.equal(await admin.$eval('.research-admin-tabs [aria-pressed=true]', el => el.textContent), custom.title);
    await visitor.goto(base + '/research?section=' + custom.id);
    await visitor.waitForFunction(() => document.querySelector('#research-section-title')?.textContent === 'Research Centres');
    assert.equal(await visitor.$eval('.research-section-description', el => el.textContent), custom.description);
    await admin.reload(); await click(admin, 'Research & Innovation', '.admin-sidebar'); await waitSaved();
    await click(admin, 'Research Centres', '.research-admin-tabs');
    await click(admin, 'Add item', '.research-admin'); await admin.waitForSelector('.research-admin-dialog[open]');
    await admin.type('.research-admin-dialog input', 'Research Centre resource');
    await click(admin, 'Save & publish item', '.research-admin-dialog');
    await admin.waitForFunction(() => !document.querySelector('.research-admin-dialog')); await waitSaved();
    assert((await readPublished()).items.some(item => item.title === 'Research Centre resource' && item.sectionId === custom.id));
    await replaceInput('.research-admin-tabs + .research-admin-grid input', 'Research Centres & Resources');
    await click(admin, 'Move section up', '.research-admin');
    await click(admin, 'Publish changes', '.research-admin'); await waitSaved();
    config = await readPublished();
    assert.equal(config.sections[11].id, custom.id); assert.equal(config.sections[11].title, 'Research Centres & Resources');
    await admin.click('.research-admin-section-actions input[type=checkbox]');
    await click(admin, 'Publish changes', '.research-admin'); await waitSaved();
    await visitor.reload(); await visitor.waitForFunction(() => document.querySelector('.research-content')?.getAttribute('aria-busy') === 'false');
    assert.equal(await visitor.$$eval('.research-sidebar nav button', (els, id) => els.some(el => el.textContent.includes('Research Centres & Resources')), custom.id), false);
    await admin.click('.research-admin-section-actions input[type=checkbox]');
    await click(admin, 'Publish changes', '.research-admin'); await waitSaved();
    await visitor.reload(); await visitor.waitForFunction(() => document.querySelector('#research-section-title')?.textContent === 'Research Centres & Resources');
    assert(await visitor.$eval('.research-documents', el => el.textContent.includes('Research Centre resource')));
    console.log('PASS: custom sidebar options add, reload, hold content, rename, reorder and hide/show for a separate visitor');

    await click(admin, 'Research Updates', '.research-admin-tabs');
    admin.once('dialog', dialog => { assert(dialog.message().includes('15 content entries')); void dialog.dismiss(); });
    await click(admin, 'Delete sidebar option', '.research-admin');
    assert.equal((await readPublished()).sections.length, 13, 'cancel keeps the option');

    // A failed server save must leave the selected section and its entries intact.
    await admin.setRequestInterception(true);
    const rejectPublish = request => request.url().includes('/api/config/researchContent') && request.method() === 'PUT'
      ? request.respond({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Fixture publication failure' }) }) : request.continue();
    admin.on('request', rejectPublish);
    admin.once('dialog', dialog => void dialog.accept());
    await click(admin, 'Delete sidebar option', '.research-admin');
    await admin.waitForFunction(() => document.querySelector('.research-admin-error')?.textContent.includes('Fixture publication failure'));
    assert.equal((await readPublished()).sections.length, 13);
    assert.equal(await admin.$eval('.research-admin-tabs [aria-pressed=true]', el => el.textContent), 'Research Updates');
    await admin.setRequestInterception(false); admin.off('request', rejectPublish);
    admin.once('dialog', dialog => void dialog.accept());
    await click(admin, 'Delete sidebar option', '.research-admin'); await waitSaved();
    config = await readPublished();
    assert.equal(config.sections.some(s => s.id === 'updates'), false);
    assert.equal(config.items.some(item => item.sectionId === 'updates' || item.parentId === 'pre-phd-syllabus'), false);
    assert(config.items.some(item => item.title === 'Research Centre resource'), 'other options keep their entries');
    await visitor.goto(base + '/research?section=updates');
    await visitor.waitForFunction(() => document.querySelector('.research-content')?.getAttribute('aria-busy') === 'false');
    assert.equal(await visitor.$eval('#research-section-title', el => el.textContent), 'Overview', 'deleted deep links select the next visible option');
    console.log('PASS: delete cancellation, failed publication, associated-entry removal and deleted deep links');

    await visitor.setViewport({ width: 390, height: 844 });
    await visitor.screenshot({ path: path.join(output, 'research-mobile.png'), fullPage: true });
    assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await admin.setViewport({ width: 390, height: 844 });
    await admin.screenshot({ path: path.join(output, 'research-admin-mobile.png'), fullPage: true });
    assert.equal(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await admin.setViewport({ width: 1440, height: 1000 });
    await admin.screenshot({ path: path.join(output, 'research-admin-desktop.png'), fullPage: true });

    // Deleting the final option must persist an empty menu instead of restoring defaults.
    let remaining = (await readPublished()).sections.length;
    while (remaining > 0) {
      admin.once('dialog', dialog => void dialog.accept());
      await click(admin, 'Delete sidebar option', '.research-admin'); await waitSaved();
      remaining -= 1;
      assert.equal((await readPublished()).sections.length, remaining);
    }
    await admin.reload(); await click(admin, 'Research & Innovation', '.admin-sidebar'); await waitSaved();
    assert.equal(await admin.$$eval('.research-admin-tabs button', els => els.length), 0);
    await visitor.reload(); await visitor.waitForFunction(() => document.querySelector('.research-content')?.getAttribute('aria-busy') === 'false');
    assert.equal(await visitor.$('.research-sidebar'), null);
    assert.match(await visitor.$eval('.research-empty', el => el.textContent), /No research sections are currently published/);
    assert.deepEqual((await readPublished()).items, []);
    await createSection('New Research Menu');
    assert.equal((await readPublished()).sections.length, 1);
    await visitor.reload(); await visitor.waitForFunction(() => document.querySelector('#research-section-title')?.textContent === 'New Research Menu');
    console.log('PASS: deleting every option persists across reloads; admin can create a fresh menu afterward');
    assert.deepEqual(errors, []);
    console.log('PASS: desktop and mobile layouts fit; no browser runtime errors');
    console.log('Research verification completed. Screenshots: ' + output);
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve)); await prisma.$disconnect(); await socket.stop(); await db.close();
    fs.rmSync(uploads, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
