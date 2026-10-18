// Real Express, Prisma, isolated PostgreSQL, uploads and two independent browser sessions.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const { PGlite } = require('@electric-sql/pglite');
const { PGLiteSocketServer } = require('@electric-sql/pglite-socket');
(async () => {
  const uploads = fs.mkdtempSync(path.join(os.tmpdir(), 'university-research-'));
  const output = path.resolve('../work/research-qa'); fs.mkdirSync(output, { recursive: true });
  const pdfPath = path.join(uploads, 'fixture-handbook.pdf'), imagePath = path.join(uploads, 'fixture-centre.png');
  const pdfBytes = Buffer.from('%PDF-1.7\n1 0 obj << /Type /Catalog >> endobj\n%%EOF');
  fs.writeFileSync(pdfPath, pdfBytes);
  await sharp({ create: { width: 1000, height: 420, channels: 3, background: '#072a6c' } }).png().toFile(imagePath);
  const db = await PGlite.create();
  for (const name of fs.readdirSync('prisma/migrations').filter(n => /^2026/.test(n)).sort()) await db.exec(fs.readFileSync(`prisma/migrations/${name}/migration.sql`, 'utf8'));
  const socket = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 55448, maxConnections: 5 }); await socket.start();
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:55448/postgres?connection_limit=1';
  process.env.SESSION_SECRET = crypto.randomBytes(40).toString('hex'); process.env.UPLOADS_DIR = uploads; process.env.NODE_ENV = 'test';
  const prisma = require('../dist/prisma').default, app = require('../dist/index').default, express = require('express');
  app.use(express.static(path.resolve('../dist')));
  app.use('/uploads', (_req, res) => res.sendStatus(404));
  app.get('*', (_req, res) => res.sendFile(path.resolve('../dist/index.html')));
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    await prisma.adminUser.create({ data: { username: 'research-admin', passwordHash: await bcrypt.hash('Research-test-password-123!', 10), role: 'superadmin', credentialMode: 'legacy', mustChangePassword: false, requireGoogle: false, requireTotp: false } });
    await prisma.adminPermission.upsert({ where: { key: 'research.view' }, create: { key: 'research.view', module: 'research', action: 'view' }, update: {} });
    await prisma.adminUser.create({ data: { username: 'research-viewer', passwordHash: await bcrypt.hash('Research-test-password-123!', 10), role: 'admin', credentialMode: 'legacy', mustChangePassword: false, requireGoogle: false, requireTotp: false, permissions: { create: [{ permissionKey: 'research.view' }] } } });
    assert.equal((await fetch(base + '/api/config/researchContent', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 401);
    const { default: puppeteer } = await import('puppeteer-core');
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const admin = await browser.newPage(), errors = []; admin.on('pageerror', error => errors.push(error.message));
    await admin.setViewport({ width: 1640, height: 1100 });
    const click = async (page, text, scope = '') => {
      const element = await page.waitForFunction(({ text, scope }) => [...document.querySelectorAll(scope + ' button')].find(el => (el.textContent.trim() === text || el.querySelector(':scope > span')?.textContent.trim() === text) && el.getBoundingClientRect().width && !el.matches(':disabled')), {}, { text, scope });
      await element.asElement().click(); await element.dispose();
    };
    const setField = async (label, value, scope = '.research-component-properties') => {
      const handle = await admin.waitForFunction(({ label, scope }) => [...document.querySelectorAll(scope + ' label')].find(el => [...el.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim() === label)?.querySelector('input, textarea, select'), {}, { label, scope });
      const field = handle.asElement(); const tag = await field.evaluate(el => el.tagName);
      if (tag === 'SELECT') await field.select(value);
      else { await field.focus(); await admin.keyboard.down('Control'); await admin.keyboard.press('KeyA'); await admin.keyboard.up('Control'); await admin.keyboard.press('Backspace'); await field.type(value); }
      await handle.dispose();
    };
    const api = (page, route, method = 'GET', body) => page.evaluate(async ({ route, method, body }) => {
      const response = await fetch(route, { method, headers: body === undefined ? {} : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
      return { status: response.status, body: await response.json().catch(() => null) };
    }, { route, method, body });
    const read = async () => (await (await fetch(base + '/api/config/researchContent?raw=true')).json());
    const ready = () => admin.waitForFunction(() => document.querySelector('.research-admin-fields') && !document.querySelector('.research-admin-fields').disabled);
    const publish = async () => { await click(admin, 'Publish changes', '.research-admin-top'); await admin.waitForSelector('.research-admin-message'); await ready(); assert.equal(await admin.$('.research-admin-error'), null); };
    const addBlock = async type => { await admin.click(`[data-component-type="${type}"]`); await admin.waitForSelector('.research-editor-card.is-selected'); };
    const createSection = async title => {
      await click(admin, 'Add sidebar option', '.research-admin'); await admin.waitForSelector('.research-section-dialog[open]');
      await admin.type('.research-section-dialog input', title); await admin.type('.research-section-dialog textarea', 'Resources for research scholars.');
      await click(admin, 'Create & publish option', '.research-section-dialog'); await admin.waitForFunction(() => !document.querySelector('.research-section-dialog')); await ready();
    };
    const login = async (page, username) => {
      await page.goto(base + '/admin'); await page.waitForSelector('input[placeholder="Enter your username or email"]');
      await page.type('input[placeholder="Enter your username or email"]', username); await page.type('input[placeholder="Enter password"]', 'Research-test-password-123!'); await page.click('button[type=submit]');
      await click(page, 'Research & Innovation', '.admin-sidebar'); await page.waitForSelector('.research-admin');
    };
    await login(admin, 'research-admin'); await ready(); await publish();
    const visitorContext = await browser.createBrowserContext(), visitor = await visitorContext.newPage();
    visitor.on('pageerror', error => errors.push(error.message)); await visitor.setViewport({ width: 1440, height: 1000 });
    await visitor.goto(base + '/research'); await visitor.waitForSelector('.research-accordion');
    assert.equal(await visitor.$$eval('.research-sidebar nav button', els => els.length), 12);
    assert.equal(await visitor.$$eval('.research-document', els => els.length), 13);
    assert.equal(await visitor.$('.research-help'), null);
    await visitor.click('.research-accordion summary'); assert.equal(await visitor.$eval('.research-accordion', el => el.open), false);
    await visitor.keyboard.press('Enter'); assert.equal(await visitor.$eval('.research-accordion', el => el.open), true);
    console.log('PASS: legacy research updates, badges, syllabus groups and all sidebar options remain intact');

    await createSection('Research Resources'); let config = await read(); const sectionId = config.sections.at(-1).id;
    await addBlock('heading'); await setField('Heading text', 'Research scholar resources');
    await addBlock('text'); await setField('Paragraph text', 'Find notifications, forms and research facilities below.');
    await addBlock('bullets'); await setField('Bullet text', 'Admissions information', '[data-bullet-index="0"]');
    await setField('Click action', 'url', '[data-bullet-index="0"]'); await setField('Destination URL', '/admissions', '[data-bullet-index="0"]');
    await setField('Badge (optional)', 'NEW', '[data-bullet-index="0"]');
    await click(admin, 'Add bullet point', '.research-component-properties');
    await setField('Bullet text', 'Scholar handbook (PDF)', '[data-bullet-index="1"]'); await setField('Click action', 'pdf', '[data-bullet-index="1"]');
    await (await admin.$('[data-bullet-index="1"] input[type=file]')).uploadFile(pdfPath);
    await admin.waitForSelector('[data-bullet-index="1"] .research-attached-file'); await admin.waitForFunction(() => !document.querySelector('.research-admin-top button').disabled);
    const pdfMedia = await prisma.builderMedia.findFirst({ where: { mime: 'application/pdf' } }); assert(pdfMedia);
    assert.deepEqual(Buffer.from(await (await fetch(base + '/uploads/' + pdfMedia.filename)).arrayBuffer()), pdfBytes);
    await addBlock('button'); await setField('Button label', 'Apply for Ph.D.'); await setField('Destination URL', '/admissions');
    await addBlock('button'); await setField('Button label', 'Open scholar handbook'); await setField('Click action', 'pdf');
    await click(admin, 'Media Storage', '.research-component-properties'); await admin.waitForSelector('.media-picker-dialog .media-thumbnail');
    await admin.click('.media-picker-dialog .media-thumbnail'); await admin.waitForFunction(() => !document.querySelector('.media-picker-dialog'));
    await admin.waitForSelector('.research-component-properties .research-attached-file');
    await addBlock('image'); await (await admin.$('.research-component-properties input[type=file]')).uploadFile(imagePath);
    await admin.waitForSelector('.research-component-properties .research-attached-file');
    await setField('Image description (alt text)', 'Chalapathi University research centre'); await setField('Caption', 'Our research facilities');
    await setField('Image width', 'medium'); await setField('Alignment', 'center');
    await addBlock('accordion'); await setField('Heading text', 'Research guidelines');
    await click(admin, 'Add components inside this group', '.research-component-properties');
    await addBlock('heading'); await setField('Heading text', 'Before you apply');
    await addBlock('bullets'); await setField('Bullet text', 'Read the eligibility criteria', '[data-bullet-index="0"]');
    await setField('Click action', 'url', '[data-bullet-index="0"]'); await setField('Destination URL', '/research?section=academic', '[data-bullet-index="0"]');
    await publish();
    config = await read(); let section = config.sections.find(s => s.id === sectionId);
    assert.equal(section.blocks.length, 7); assert.equal(section.blocks[6].children.length, 2);
    assert.equal(section.blocks[2].bullets.length, 2); assert.equal(section.blocks[2].bullets[1].href, '/uploads/' + pdfMedia.filename);
    assert.equal(section.blocks[4].href, section.blocks[2].bullets[1].href, 'button reuses the same stored PDF');
    assert.equal(await prisma.builderMedia.count(), 2, 'one PDF and one image uploaded to the shared catalog');
    await visitor.goto(base + '/research?section=' + sectionId); await visitor.waitForSelector('.research-figure img');
    assert.equal(await visitor.$eval('.research-block-heading', el => el.textContent), 'Research scholar resources');
    assert.equal(await visitor.$eval('.research-bullet-list a', el => el.getAttribute('href')), '/admissions');
    assert.equal(await visitor.$eval('.research-action-primary', el => el.getAttribute('href')), '/admissions');
    assert.equal(await visitor.$$eval('.research-action', els => els[1].getAttribute('href')), '/uploads/' + pdfMedia.filename);
    assert.equal(await visitor.$eval('.research-figure img', el => el.alt), 'Chalapathi University research centre');
    assert.equal(await visitor.$eval('.research-figure img', el => el.complete && el.naturalWidth > 0), true);
    assert.equal(await visitor.$eval('.research-component-accordion .research-block-heading', el => el.textContent), 'Before you apply');
    await visitor.screenshot({ path: path.join(output, 'research-components-desktop.png'), fullPage: true });
    console.log('PASS: headings, text, linked bullets, directly uploaded PDF, reused PDF button, uploaded image and nested groups publish to a clean visitor');

    const imageId = section.blocks[5].id, textId = section.blocks[1].id, groupId = section.blocks[6].id;
    const checkImageProportions = async checked => {
      const checkbox = await admin.waitForFunction(() => [...document.querySelectorAll('.research-image-properties label')].find(el => el.textContent.includes('Keep original photo proportions'))?.querySelector('input'));
      if (await checkbox.asElement().evaluate(el => el.checked) !== checked) await checkbox.asElement().click(); await checkbox.dispose();
    };
    const photoMetrics = () => visitor.$eval('.research-figure', figure => {
      const image = figure.querySelector('img'), rect = figure.getBoundingClientRect(), content = figure.closest('.research-block-content').getBoundingClientRect();
      const frame = figure.querySelector('.research-image-frame').getBoundingClientRect();
      return { width: rect.width, right: rect.right, left: rect.left, contentWidth: content.width, contentRight: content.right, frameHeight: frame.height,
        fit: getComputedStyle(image).objectFit, focus: getComputedStyle(image).objectPosition, float: getComputedStyle(figure).float, imageRatio: image.getBoundingClientRect().width / image.getBoundingClientRect().height };
    });
    const reloadPhoto = async () => { await visitor.reload(); await visitor.waitForSelector('.research-figure img'); await visitor.waitForFunction(() => { const image = document.querySelector('.research-figure img'); return image?.complete && image.naturalWidth > 0; }); };
    await admin.click(`[data-component-id="${imageId}"] .research-component-name`);
    await setField('Image width', 'custom'); await setField('Width (%)', '50');
    await checkImageProportions(false); await setField('Height (px)', '200'); await setField('Fit inside frame', 'cover');
    await setField('Crop focus left / right (%)', '80'); await setField('Crop focus top / bottom (%)', '20');
    await setField('Space above (px)', '12'); await setField('Space below (px)', '18'); await setField('Alignment', 'right');
    await publish(); await reloadPhoto();
    let metrics = await photoMetrics();
    assert(Math.abs(metrics.width - metrics.contentWidth / 2) < 2); assert.equal(metrics.frameHeight, 200);
    assert(Math.abs(metrics.right - metrics.contentRight) < 2); assert.equal(metrics.fit, 'cover'); assert.equal(metrics.focus, '80% 20%');
    await setField('Fit inside frame', 'contain'); await setField('Width units', 'px'); await setField('Width (px)', '320'); await setField('Alignment', 'center');
    await publish(); await reloadPhoto(); metrics = await photoMetrics(); assert.equal(metrics.width, 320); assert.equal(metrics.fit, 'contain');
    await checkImageProportions(true); await publish(); await reloadPhoto(); metrics = await photoMetrics(); assert(Math.abs(metrics.imageRatio - 1000 / 420) < .02);

    // The real pointer handle resizes the selected photo without distorting its proportions.
    await setField('Width units', '%'); await setField('Width (%)', '60');
    const handle = await admin.$('[aria-label="Resize photo"]'); await handle.scrollIntoView(); const box = await handle.boundingBox();
    await admin.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await admin.mouse.down(); await admin.mouse.move(box.x + box.width / 2 + 35, box.y + box.height / 2, { steps: 5 }); await admin.mouse.up();
    const resized = Number(await admin.$eval('.research-image-number input[type=number]', el => el.value)); assert(resized > 60 && resized <= 100);
    await admin.focus('[aria-label="Resize photo"]'); await admin.keyboard.press('ArrowLeft');
    await admin.waitForFunction(expected => Number(document.querySelector('.research-image-number input[type=number]')?.value) === expected, {}, resized - 5);
    assert.equal(Number(await admin.$eval('.research-image-number input[type=number]', el => el.value)), resized - 5);

    await setField('Photo layout', 'wrap-left'); await setField('Width (%)', '40'); await setField('Gap beside text (px)', '24');
    await setField('Position in section', 'before:' + textId); await publish(); await reloadPhoto();
    metrics = await photoMetrics(); assert.equal(metrics.float, 'left');
    const firstTextPosition = await visitor.$eval('.research-block-text', paragraph => { const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT); let text; while ((text = walker.nextNode()) && !text.textContent.trim()) {} const range = document.createRange(); range.setStart(text, 0); range.setEnd(text, Math.min(10, text.textContent.length)); return range.getBoundingClientRect().left; });
    assert(firstTextPosition >= metrics.right + 20, 'following text actually flows beside the image');
    const positioned = (await read()).sections.find(s => s.id === sectionId).blocks; assert.equal(positioned[1].id, imageId); assert.equal(positioned[2].id, textId);
    await visitor.screenshot({ path: path.join(output, 'research-photo-placement.png'), fullPage: true });
    await setField('Photo layout', 'wrap-right'); await publish(); await reloadPhoto(); assert.equal((await photoMetrics()).float, 'right');
    await visitor.setViewport({ width: 390, height: 844 });
    metrics = await photoMetrics(); assert.equal(metrics.float, 'none'); assert(Math.abs(metrics.width - metrics.contentWidth) < 2);
    assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await visitor.setViewport({ width: 1440, height: 1000 });
    await setField('Photo layout', 'block'); await setField('Position in section', 'before:' + groupId);
    await setField('Width units', 'px'); await setField('Width (px)', '320'); await setField('Alignment', 'center'); await checkImageProportions(false); await setField('Height (px)', '180');
    await publish(); section = (await read()).sections.find(s => s.id === sectionId);
    assert.equal(section.blocks[5].id, imageId); assert.equal(section.blocks[5].imageWidth, 320); assert.equal(section.blocks[5].imageHeight, 180);
    await admin.$eval('.research-component-properties', el => { el.scrollTop = 0; });
    await admin.screenshot({ path: path.join(output, 'research-photo-controls.png'), fullPage: true });
    console.log('PASS: exact photo width/height, percent/pixel sizing, alignment, crop/contain, original proportions, pointer/keyboard resizing, text wrapping, before/after placement and phone stacking');

    // Reload confirms the component model is durable and the same media can be chosen again.
    await admin.reload(); await click(admin, 'Research & Innovation', '.admin-sidebar'); await ready(); await click(admin, 'Research Resources', '.research-admin-tabs');
    const rootCards = '.research-component-canvas > .research-editor-card';
    assert.equal(await admin.$$eval(rootCards, els => els.length), 7);
    await admin.click(`[data-component-id="${section.blocks[5].id}"] .research-component-name`);
    await click(admin, 'Media Storage', '.research-component-properties'); await admin.waitForSelector('.media-picker-dialog .media-thumbnail');
    await admin.click('.media-picker-dialog .media-thumbnail'); await admin.waitForFunction(() => !document.querySelector('.media-picker-dialog'));
    await admin.click(`[data-component-id="${section.blocks[0].id}"] [aria-label="Duplicate component"]`);
    let duplicateId = await admin.$eval('.research-editor-card.is-selected', el => el.dataset.componentId);
    assert.notEqual(duplicateId, section.blocks[0].id);
    await admin.click(`[data-component-id="${duplicateId}"] [aria-label="Remove component"]`);
    const buttonId = section.blocks[3].id;
    await admin.click(`[data-component-id="${buttonId}"] [aria-label="Move component up"]`); await publish();
    section = (await read()).sections.find(s => s.id === sectionId); assert.equal(section.blocks[2].id, buttonId);
    await admin.click(`[data-component-id="${buttonId}"] [aria-label="Hide component"]`); await publish();
    await visitor.reload(); await visitor.waitForSelector('.research-figure img');
    assert.equal(await visitor.$$eval('.research-action', els => els.some(el => el.textContent === 'Apply for Ph.D.')), false);
    await click(admin, 'Preview', '.research-component-editor');
    assert.equal(await admin.$$eval('.research-component-canvas .research-action', els => els.some(el => el.textContent === 'Apply for Ph.D.')), false, 'preview matches published visibility');
    await click(admin, 'Edit components', '.research-component-editor');
    await admin.click(`[data-component-id="${buttonId}"] [aria-label="Show component"]`); await publish();
    await admin.click(`[data-component-id="${section.blocks[6].children[0].id}"] .research-component-name`);
    assert.equal(await admin.$eval('.research-component-properties input', el => el.value), 'Before you apply', 'nested components can be selected');
    await click(admin, 'Preview', '.research-component-editor'); await click(admin, 'Phone', '.research-component-editor');
    await admin.screenshot({ path: path.join(output, 'research-component-preview.png'), fullPage: true });
    await click(admin, 'Edit components', '.research-component-editor');
    console.log('PASS: persisted components reload; media selection, duplication, removal, reordering, visibility, nested selection and phone preview work');

    // Validate on the server as well as in the client, using the real authenticated API.
    const valid = await read(); const malicious = structuredClone(valid);
    malicious.sections.find(s => s.id === sectionId).blocks.push({ id: crypto.randomUUID(), type: 'button', text: 'Unsafe', href: 'javascript:alert(1)' });
    assert.equal((await api(admin, '/api/config/researchContent', 'PUT', malicious)).status, 400);
    assert.deepEqual(await read(), valid, 'invalid component URLs cannot change published content');
    const badSize = structuredClone(valid); const invalidPhoto = badSize.sections.find(s => s.id === sectionId).blocks.find(b => b.type === 'image');
    invalidPhoto.width = 'custom'; invalidPhoto.imageWidthUnit = '%'; invalidPhoto.imageWidth = 200;
    assert.equal((await api(admin, '/api/config/researchContent', 'PUT', badSize)).status, 400, 'server rejects invalid photo dimensions');
    await addBlock('button'); await setField('Button label', 'Needs a destination');
    await click(admin, 'Publish changes', '.research-admin-top');
    await admin.waitForFunction(() => document.querySelector('.research-admin-error')?.textContent.includes('Connect the button'));
    assert.deepEqual(await read(), valid, 'incomplete components cannot silently publish dead buttons');
    await admin.click('.research-editor-card.is-selected [aria-label="Remove component"]');
    await publish();
    await admin.click(`[data-component-id="${valid.sections.find(s => s.id === sectionId).blocks[0].id}"] .research-component-name`);
    await setField('Heading text', 'Updated research resources');
    await admin.setRequestInterception(true);
    const rejectSave = request => request.url().includes('/api/config/researchContent') && request.method() === 'PUT'
      ? request.respond({ status: 500, contentType: 'application/json', body: '{"error":"Fixture publish failure"}' }) : request.continue();
    admin.on('request', rejectSave); await click(admin, 'Publish changes', '.research-admin-top');
    await admin.waitForFunction(() => document.querySelector('.research-admin-error')?.textContent.includes('Fixture publish failure'));
    assert.equal(await admin.$eval('.research-component-properties input', el => el.value), 'Updated research resources');
    assert.equal((await read()).sections.find(s => s.id === sectionId).blocks[0].text, 'Research scholar resources');
    await admin.setRequestInterception(false); admin.off('request', rejectSave); await publish();
    console.log('PASS: server rejects executable links, incomplete actions cannot publish, and a failed save keeps editor changes without changing the public page');

    await setField('Heading text', 'Recovered draft heading');
    await click(admin, 'Overview', '.admin-sidebar'); await click(admin, 'Research & Innovation', '.admin-sidebar'); await ready();
    await admin.waitForSelector('.research-admin-draft');
    assert.equal((await read()).sections.find(s => s.id === sectionId).blocks[0].text, 'Updated research resources', 'browser draft never changes published content');
    await click(admin, 'Restore draft', '.research-admin-draft'); await click(admin, 'Research Resources', '.research-admin-tabs');
    assert.equal(await admin.$eval('.research-component-properties input', el => el.value), 'Recovered draft heading');
    await click(admin, 'Publish changes', '.admin-workspace-toolbar'); await admin.waitForSelector('.research-admin-message'); await ready();
    assert.equal((await read()).sections.find(s => s.id === sectionId).blocks[0].text, 'Recovered draft heading');
    assert.equal(await admin.evaluate(() => localStorage.getItem('chalapathi_research_editor_draft')), null);
    console.log('PASS: browser drafts survive switching admin tabs and the workspace Publish button saves research content');

    const readerContext = await browser.createBrowserContext(), reader = await readerContext.newPage(); await login(reader, 'research-viewer');
    assert.equal((await api(reader, '/api/config/researchContent', 'PUT', await read())).status, 403);
    const uploadDenied = await reader.evaluate(async () => { const form = new FormData(); form.append('file', new Blob(['%PDF-1.7\n%%EOF'], { type: 'application/pdf' }), 'denied.pdf'); return (await fetch('/api/media', { method: 'POST', body: form })).status; });
    assert.equal(uploadDenied, 403);
    assert.equal((await api(reader, '/api/media?type=pdf')).status, 200, 'research readers may browse existing media');
    console.log('PASS: existing research publication and Media Storage upload permissions remain enforced');

    await visitor.reload(); await visitor.waitForSelector('.research-figure img'); await visitor.setViewport({ width: 390, height: 844 });
    await visitor.screenshot({ path: path.join(output, 'research-components-mobile.png'), fullPage: true });
    assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await admin.setViewport({ width: 390, height: 844 }); await admin.screenshot({ path: path.join(output, 'research-editor-mobile.png'), fullPage: true });
    assert.equal(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
    await admin.setViewport({ width: 1640, height: 1100 }); await admin.screenshot({ path: path.join(output, 'research-editor-desktop.png'), fullPage: true });

    // Removing all options must not resurrect old content, and must not delete shared uploaded files.
    let remaining = (await read()).sections.length;
    admin.once('dialog', dialog => void dialog.dismiss()); await click(admin, 'Delete sidebar option', '.research-admin'); assert.equal((await read()).sections.length, remaining);
    while (remaining > 0) {
      admin.once('dialog', dialog => void dialog.accept()); await click(admin, 'Delete sidebar option', '.research-admin');
      remaining--; await admin.waitForFunction(count => document.querySelectorAll('.research-admin-tabs button').length === count, {}, remaining); await ready();
    }
    await admin.reload(); await click(admin, 'Research & Innovation', '.admin-sidebar'); await ready();
    assert.equal(await admin.$$eval('.research-admin-tabs button', els => els.length), 0); assert.equal(await prisma.builderMedia.count(), 2);
    await visitor.reload(); await visitor.waitForFunction(() => document.querySelector('.research-content')?.getAttribute('aria-busy') === 'false');
    assert.equal(await visitor.$('.research-sidebar'), null); assert.match(await visitor.$eval('.research-empty', el => el.textContent), /No research sections/);
    await createSection('Fresh Research Option'); assert.deepEqual((await read()).sections[0].blocks, []);
    assert.deepEqual(errors, []);
    console.log('PASS: mobile layouts, option deletion/cancellation, empty-menu reload, shared media retention and fresh creation; no browser runtime errors');
    console.log('Research component verification completed. Screenshots: ' + output);
  } finally {
    if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); await prisma.$disconnect(); await socket.stop(); await db.close();
    fs.rmSync(uploads, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
