// UI regression checks use an isolated browser and in-memory API responses.
// No credentials, production data, or live backend writes are involved.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const { default: puppeteer } = await import('puppeteer');
  const { createServer } = await import('vite');
  const vite = await createServer({ server: { host: '127.0.0.1', port: 3107, watch: { ignored: ['**/work/**'] } } });
  await vite.listen();
  const base = 'http://127.0.0.1:' + vite.httpServer.address().port;
  const out = path.resolve(process.env.QA_OUTPUT_DIR || '../admin-design-preview');
  fs.mkdirSync(out, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  const errors = [];
  const writes = [];
  let authenticated = false;
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', dialog => dialog.accept());
  await page.setViewport({ width: 1586, height: 1000, deviceScaleFactor: 1 });
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = new URL(request.url());
    if (!url.pathname.startsWith('/api/')) return request.continue();
    let status = 200;
    let body = {};
    if (url.pathname === '/api/auth/me') { status = authenticated ? 200 : 401; body = { authenticated }; }
    else if (url.pathname === '/api/auth/login') { authenticated = true; body = { success: true }; }
    else if (url.pathname === '/api/auth/logout') { authenticated = false; body = { success: true }; }
    else if (request.method() !== 'GET') { writes.push({ url: url.pathname, body: request.postData() }); body = { success: true }; }
    else if (url.pathname === '/api/cms') body = { success: true, pages: [], settings: {} };
    else if (['/api/news', '/api/events', '/api/announcements'].includes(url.pathname)) body = [];
    return request.respond({ status, contentType: 'application/json', headers: { 'X-Content-Revision': 'ui-test-revision' }, body: JSON.stringify(body) });
  });
  try {
    await page.goto(base + '/admin', { waitUntil: 'networkidle2' });
    await page.addStyleTag({ content: 'html, body { scroll-behavior: auto !important; }' });
    await page.locator('input[placeholder="Enter your username or email"]').fill('ui-test');
    await page.locator('input[placeholder="Enter password"]').fill('isolated-ui-test');
    await page.locator('button[type="submit"]').click();
    await page.waitForSelector('.admin-shell');
    await page.screenshot({ path: path.join(out, 'overview-desktop.png') });
    assert.equal(await page.$eval('.admin-brand-logo img', img => img.getAttribute('src')), '/logo.png?v=3');
    const modules = await page.$$eval('.admin-shell > .admin-sidebar .admin-nav-link', buttons => buttons.map(button => button.title));
    const report = [];
    for (const title of modules) {
      await page.evaluate(title => Array.from(document.querySelectorAll('.admin-shell > .admin-sidebar .admin-nav-link')).find(button => button.title === title).click(), title);
      await new Promise(resolve => setTimeout(resolve, 600));
      assert.equal(await page.$eval('.admin-breadcrumb strong', el => el.textContent), title);
      assert.ok(await page.$eval('.admin-workspace', el => el.textContent.trim().length > 15), title + ' renders editor content');
      const file = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(out, file + '-desktop.png') });
      report.push({ module: title, desktop: 'pass' });
      console.log('Desktop: ' + title);
    }
    // Existing nested editing paths remain reachable through their original handlers.
    const nested = ['Hero Banner Slides', '2. Vision & Mission', '10. Program Details Editor', 'News & Articles CMS'];
    for (const label of nested) {
      await page.locator('.admin-search input').fill(label);
      await page.locator('.admin-search-results button').click();
      assert.ok(await page.$eval('.admin-workspace', el => el.querySelectorAll('input, textarea, select').length > 0), label + ' opens editable controls');
    }
    await page.$$eval('.admin-shell > .admin-sidebar .admin-nav-expand[aria-expanded="false"]', buttons => buttons.forEach(button => button.click()));
    const nestedPages = await page.$$eval('.admin-shell > .admin-sidebar .admin-subnavigation button', buttons => buttons.map(button => button.textContent));
    for (const label of nestedPages) {
      await page.evaluate(label => Array.from(document.querySelectorAll('.admin-shell > .admin-sidebar .admin-subnavigation button')).find(button => button.textContent === label).click(), label);
      await new Promise(resolve => setTimeout(resolve, 550));
      assert.ok(await page.$eval('.admin-workspace', el => el.textContent.trim().length > 15), label + ' renders nested editor');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(out, 'nested-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png') });
    }
    console.log('Nested navigation pages: ' + nestedPages.length);
    await page.locator('.admin-search input').fill('no-such-page-123');
    await page.waitForSelector('.admin-search-results p');
    await page.focus('.admin-search input');
    await page.keyboard.down('Control'); await page.keyboard.press('A'); await page.keyboard.up('Control'); await page.keyboard.press('Backspace');
    await page.keyboard.press('Escape');
    // Verify global backup and publishing controls still call the existing paths.
    await page.locator('.admin-topbar-backup').click();
    await page.waitForSelector('textarea[placeholder^="Paste backup JSON"]');
    await page.evaluate(() => document.querySelector('textarea[placeholder^="Paste backup JSON"]').closest('.fixed').querySelector('button').click());
    await page.locator('.admin-workspace-toolbar .admin-button-primary').click();
    await page.waitForFunction(() => document.body.textContent.includes('successfully synchronized'));
    assert.ok(writes.some(write => write.url === '/api/cms' && JSON.parse(write.body).action === 'saveAll'), 'publishing calls existing CMS saveAll action');
    await page.waitForSelector('.admin-toast', { hidden: true });
    // Every page is also checked in the mobile drawer layout.
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    for (const item of report) {
      await page.locator('.admin-menu-mobile').click();
      await page.waitForSelector('.admin-drawer .admin-nav-link');
      await page.evaluate(title => Array.from(document.querySelectorAll('.admin-drawer .admin-nav-link')).find(button => button.title === title).click(), item.module);
      const close = await page.$('.admin-drawer-close');
      if (close) await close.click();
      await new Promise(resolve => setTimeout(resolve, 600));
      await page.evaluate(() => window.scrollTo(0, 0));
      const width = await page.$eval('.admin-topbar', el => el.getBoundingClientRect().right);
      assert.ok(width <= 391, item.module + ' has a responsive shell');
      await page.screenshot({ path: path.join(out, item.module.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-mobile.png') });
      item.mobile = 'pass';
      console.log('Mobile: ' + item.module);
    }
    assert.deepEqual(errors, [], 'no browser runtime errors across admin modules');
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify({ modules: report, nestedEditors: nestedPages, runtimeErrors: errors, publishing: 'existing handler verified', logo: 'unchanged' }, null, 2));
    console.log(JSON.stringify({ modules: report.length, nestedEditors: nestedPages.length, screenshots: out, errors }));
  } finally { await browser.close(); await vite.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
