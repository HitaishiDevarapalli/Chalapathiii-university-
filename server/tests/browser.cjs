const assert = require('node:assert/strict');
const path = require('node:path');
module.exports = async function browserTest(base, png) {
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const { createServer } = await import('../../node_modules/vite/dist/node/index.js');
  const vite = await createServer({ root: path.resolve('..'), configFile: false, plugins: [], esbuild: { jsx: 'automatic' },
    resolve: { alias: { '@': path.resolve('../src'), 'lucide-react': path.resolve('../src/lib/clean-icons.tsx') } },
    server: { host: '127.0.0.1', port: 0, proxy: { '/api': { target: base, changeOrigin: false }, '/uploads': { target: base, changeOrigin: false } } }
  });
  await vite.listen();
  const url = `http://127.0.0.1:${vite.httpServer.address().port}`;
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
  try {
    const admin = await browser.newContext();
    const visitor = await browser.newContext();
    const page = await admin.newPage();
    page.setDefaultTimeout(20000);
    await page.goto(url + '/admin');
    await page.getByPlaceholder('Enter your username or email').fill('test-admin');
    await page.getByPlaceholder('Enter password', { exact: true }).fill('Test-only-password-123');
    await page.getByRole('button', { name: 'Sign In to CMS' }).click();
    await page.getByRole('button', { name: 'Post News/Events →', exact: true }).click();
    await page.getByRole('button', { name: 'Add News Article', exact: true }).click();
    const title = 'Browser E2E shared university announcement';
    await page.getByPlaceholder('e.g. University Signs Historic Research Accord...').first().fill(title);
    await page.getByPlaceholder('Complete article coverage, quotes, achievements, and paragraphs...').first().fill('Text written through the admin editor and shared across accounts.');
    await page.getByPlaceholder('e.g. ai-research-breakthrough').first().fill('browser-e2e-shared');
    const uploadWait = page.waitForResponse(response => response.url().endsWith('/api/upload') && response.request().method() === 'POST');
    await page.locator('input[type=file]').first().setInputFiles({ name: 'browser-photo.png', mimeType: 'image/png', buffer: png });
    assert.equal((await uploadWait).status(), 200);
    const saveWait = page.waitForResponse(response => response.url().endsWith('/api/news/sync') && response.request().method() === 'POST');
    await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
    assert.equal((await saveWait).status(), 200);
    const publicPage = await visitor.newPage();
    await publicPage.goto(url + '/news/browser-e2e-shared');
    await publicPage.getByRole('heading', { name: title, exact: true }).waitFor();
    await publicPage.getByText('Text written through the admin editor and shared across accounts.', { exact: true }).waitFor();
    const photo = publicPage.locator('img[src^="/uploads/"]').first();
    await photo.waitFor();
    await photo.evaluate(img => img.complete ? true : new Promise(resolve => { img.onload = resolve; img.onerror = () => resolve(false); }));
    assert.ok(await photo.evaluate(img => img.naturalWidth > 0), 'another browser context loads the uploaded photo');
    // Independent account cannot write, even with the obsolete browser auth flag.
    await publicPage.evaluate(() => sessionStorage.setItem('chalapathi_admin_auth', 'true'));
    await publicPage.goto(url + '/admin');
    await publicPage.getByRole('heading', { name: 'Admin Login', exact: true }).waitFor();
    await page.getByPlaceholder('e.g. University Signs Historic Research Accord...').first().fill(title + ' edited');
    await page.route('**/api/news/sync', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Test save failure' }) }));
    const dialogPromise = new Promise(resolve => page.once('dialog', async dialog => { resolve(dialog.message()); await dialog.accept(); }));
    await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
    assert.equal(await dialogPromise, 'Test save failure');
    await page.unroute('**/api/news/sync');
    assert.equal((await (await visitor.request.get(url + '/api/news/browser-e2e-shared')).json()).title, title, 'failed save never changes public content');
    console.log('PASS: browser admin login, create, text edit, photo upload, publish, independent visitor read, forged browser login rejection, and failed-save feedback.');
  } finally { await browser.close(); await vite.close(); }
};
