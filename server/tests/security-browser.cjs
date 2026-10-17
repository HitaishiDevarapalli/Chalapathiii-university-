// Browser checks use the same isolated database and mocked Google transport as security.cjs.
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const express = require('express');

module.exports = async function ({ app, base, adminPassword, google }) {
  app.use(express.static(path.resolve('../dist')));
  app.get('*', (_req, res) => res.sendFile(path.resolve('../dist/index.html')));
  const { default: puppeteer } = await import('puppeteer-core');
  const executablePath = process.env.CHROME_PATH || (process.platform === 'win32'
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : process.platform === 'darwin' ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : '/usr/bin/google-chrome');
  const browser = await puppeteer.launch({ executablePath, headless: true });
  const artifacts = path.resolve('../work/security-verification');
  fs.mkdirSync(artifacts, { recursive: true });
  const errors = [];
  const newPage = async () => {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    await page.setViewport({ width: 1440, height: 1000 });
    page.on('pageerror', error => errors.push(error.message));
    return page;
  };
  const text = (page, value) => page.waitForFunction(value => document.body.textContent.includes(value), {}, value);
  const click = async (page, value) => {
    await page.waitForFunction(value => [...document.querySelectorAll('button, a')].some(el =>
      el.textContent.trim() === value && el.getBoundingClientRect().width > 0), {}, value);
    await page.evaluate(value => [...document.querySelectorAll('button, a')].find(el =>
      el.textContent.trim() === value && el.getBoundingClientRect().width > 0).click(), value);
  };
  const login = async (page, username, password) => {
    await page.goto(base + '/admin');
    await page.waitForSelector('input[placeholder="Enter your username or email"]');
    await page.type('input[placeholder="Enter your username or email"]', username);
    await page.type('input[placeholder="Enter password"]', password);
    await page.click('button[type="submit"]');
  };
  const api = (page, url, method = 'GET', body) => page.evaluate(async ({ url, method, body }) => {
    const response = await fetch('/api/' + url, { method, headers: { 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: response.status, body: await response.json() };
  }, { url, method, body });
  const googleLogin = async (page, email) => {
    // Intercept only the external Google authorization page; the real server callback still runs.
    await page.setRequestInterception(true);
    const listener = async request => {
      if (request.url().startsWith('https://accounts.google.com/')) {
        const url = new URL(request.url());
        google({ challenge: url.searchParams.get('code_challenge'), payload: {
          email, email_verified: true, sub: 'google-sub-' + email, iss: 'https://accounts.google.com',
          aud: process.env.GOOGLE_CLIENT_ID, exp: Math.floor(Date.now() / 1000) + 300, nonce: url.searchParams.get('nonce') } });
        await request.respond({ status: 302, headers: { location: base + '/api/auth/google/callback?state=' + encodeURIComponent(url.searchParams.get('state')) + '&code=browser-fixture' } });
      } else await request.continue();
    };
    page.on('request', listener);
    try { await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), click(page, 'Continue with Google')]); }
    finally { page.off('request', listener); await page.setRequestInterception(false); }
  };
  try {
    const admin = await newPage();
    const startupFailures = [];
    admin.on('response', response => {
      const url = new URL(response.url());
      if (response.status() === 401 && (url.pathname === '/api/auth/me' ||
        url.searchParams.get('admin') === 'true' && ['/api/news', '/api/events'].includes(url.pathname))) {
        startupFailures.push(url.pathname);
      }
    });
    const privateReads = () => Promise.all(['news', 'events'].map(kind => admin.waitForResponse(response =>
      response.url().endsWith('/api/' + kind + '?admin=true') && response.status() === 200)));
    const firstReads = privateReads();
    await login(admin, 'existing-admin', adminPassword);
    await firstReads;
    await admin.waitForSelector('.admin-shell');
    assert.deepEqual(startupFailures, [], 'guest startup does not request private content before authentication');
    const reloadedReads = privateReads();
    await admin.reload();
    await reloadedReads;
    await admin.waitForSelector('.admin-shell');
    assert.equal((await api(admin, 'auth/me')).status, 200);
    assert.deepEqual(startupFailures, [], 'authenticated reload retains the session and loads private news and events');
    await click(admin, 'Authorization & Security');
    await text(admin, 'Authorized users');
    await admin.screenshot({ path: path.join(artifacts, 'security-desktop.png'), fullPage: true });
    // Each tab uses a different response shape. Switching must discard the previous
    // tab's data before rendering; clicking the active tab must keep its data visible.
    for (const label of ['User Management', 'Roles & Permissions', 'Administrative Google Accounts',
      'Google Authenticator', 'Login Activity & Audit Logs', 'Security Settings', 'Security Dashboard']) {
      for (let repeat = 0; repeat < 2; repeat++) {
        await click(admin, label);
        await admin.waitForFunction(label => {
          const active = document.querySelector('.security-section-tabs [aria-current="page"]');
          return active?.textContent.trim() === label && !document.querySelector('.security-loading') &&
            !!document.querySelector('.security-cms .admin-panel') && !document.querySelector('.security-error');
        }, {}, label);
        assert.deepEqual(errors, [], label + ' renders without a runtime exception');
      }
    }
    await click(admin, 'User Management');
    await click(admin, 'Create user');
    await admin.type('input[pattern="[a-z0-9][a-z0-9._-]{2,79}"]', 'browser-staff');
    await admin.type('.security-modal input[type="email"]', 'browser-staff@gmail.com');
    await admin.select('.security-modal select', 'admissions-staff');
    assert.equal(await admin.evaluate(() => [...document.querySelectorAll('.security-modal label')]
      .find(el => el.textContent.includes('Require Google account sign-in')).querySelector('input').checked), false);
    assert.equal(await admin.evaluate(() => [...document.querySelectorAll('.security-modal label')]
      .find(el => el.textContent.includes('Require Google Authenticator')).querySelector('input').checked), true);
    await click(admin, 'Save account');
    await admin.waitForSelector('.security-temporary-password');
    const temporary = await admin.$eval('.security-temporary-password', el => el.textContent);
    await click(admin, 'I have securely saved it');
    await text(admin, 'browser-staff');
    const reader = await api(admin, 'security/users', 'POST', { username: 'browser-reader', email: 'browser-reader@gmail.com',
      requireGoogle: false, requireTotp: false, permissions: [{ key: 'enquiries.view', allowed: true }] });
    assert.equal(reader.status, 201);

    const staff = await newPage();
    await login(staff, 'browser-staff', temporary);
    await text(staff, 'Choose your new password');
    assert.equal((await api(staff, 'auth/me')).status, 401);
    await staff.type('input[autocomplete="new-password"]', 'Browser-new-password-123!');
    await staff.type('input[autocomplete="new-password"]:not([minlength])', 'Browser-new-password-123!');
    await click(staff, 'Verify and continue');
    await text(staff, 'Set up Google Authenticator');
    assert.equal(await staff.$('a[href="/api/auth/google/start"]'), null, 'password change leads directly to Authenticator setup');
    assert.equal((await api(staff, 'auth/me')).status, 401);
    await click(staff, 'Create my enrollment QR code');
    await staff.waitForSelector('.security-qr img');
    await staff.screenshot({ path: path.join(artifacts, 'authenticator-enrollment.png'), fullPage: true });
    const secret = await staff.$eval('.security-qr code', el => el.textContent);
    const core = require('../dist/security/core');
    await staff.type('input[autocomplete="one-time-code"]', core.totp(secret).generate());
    await click(staff, 'Verify and continue');
    await text(staff, 'Save your recovery codes');
    const recoveryCodes = await staff.$$eval('.security-recovery-codes code', els => els.map(el => el.textContent));
    assert.equal(recoveryCodes.length, 10);
    await click(staff, 'I have saved my codes');
    await staff.waitForSelector('.admin-shell');
    assert.equal((await api(staff, 'security/users')).status, 403);
    assert.equal(await staff.evaluate(() => [...document.querySelectorAll('.admin-sidebar button')].some(el => /Authorization|Website Settings|News &/.test(el.textContent))), false);
    // A second login displays a challenge rather than enrollment.
    const codes = await api(admin, 'security/users?search=browser-staff');
    assert.equal(codes.body.items[0].totpEnabled, true);
    await api(staff, 'auth/logout', 'POST', {});
    await login(staff, 'browser-staff', 'Browser-new-password-123!');
    await text(staff, 'Verify your authenticator');
    assert.equal(await staff.$('.security-qr'), null);
    assert.equal((await api(staff, 'auth/me')).status, 401);
    await staff.screenshot({ path: path.join(artifacts, 'authenticator-challenge.png'), fullPage: true });
    await click(staff, 'Use a recovery code');
    await staff.type('input[autocomplete="one-time-code"]', recoveryCodes[0]);
    await click(staff, 'Verify and continue');
    await staff.waitForSelector('.admin-shell');
    assert.equal((await api(staff, 'auth/me')).status, 200);

    const readOnly = await newPage();
    await login(readOnly, 'browser-reader', reader.body.temporaryPassword);
    await text(readOnly, 'Choose your new password');
    await readOnly.type('input[minlength="14"]', 'Browser-reader-password-123!');
    await readOnly.type('input[autocomplete="new-password"]:not([minlength])', 'Browser-reader-password-123!');
    await click(readOnly, 'Verify and continue');
    await readOnly.waitForSelector('.admin-shell');
    await text(readOnly, 'Admission');
    assert.equal((await api(readOnly, 'enquiries')).status, 200);
    assert.equal((await api(readOnly, 'applications')).status, 403);
    assert.equal((await api(readOnly, 'config/siteSettings', 'PUT', { universityName: 'Denied' })).status, 403);
    assert.equal(await readOnly.evaluate(() => [...document.querySelectorAll('button')].filter(el =>
      el.getBoundingClientRect().width && getComputedStyle(el).display !== 'none').some(el => /Save Changes|Add Lead|Export|Reset|Authorization & Security/.test(el.textContent))), false);
    await readOnly.screenshot({ path: path.join(artifacts, 'staff-permissions.png'), fullPage: true });

    // Explicitly enabled Google account sign-in stays separate from Authenticator.
    // Missing OIDC setup must be explained in the portal, not opened as a JSON page.
    const oauthAccount = await api(admin, 'security/users', 'POST', { username: 'browser-google',
      email: 'browser-google@gmail.com', requireGoogle: true, requireTotp: true });
    assert.equal(oauthAccount.status, 201);
    const oauthPage = await newPage();
    await login(oauthPage, 'browser-google', oauthAccount.body.temporaryPassword);
    await text(oauthPage, 'Choose your new password');
    await oauthPage.type('input[minlength="14"]', 'Browser-google-password-123!');
    await oauthPage.type('input[autocomplete="new-password"]:not([minlength])', 'Browser-google-password-123!');
    const configuredGoogleId = process.env.GOOGLE_CLIENT_ID;
    delete process.env.GOOGLE_CLIENT_ID;
    try {
      await click(oauthPage, 'Verify and continue');
      await text(oauthPage, 'Google account sign-in unavailable');
      await text(oauthPage, 'Ask your administrator');
      assert.equal(new URL(oauthPage.url()).pathname, '/admin');
      assert.equal(await oauthPage.$('a[href="/api/auth/google/start"]'), null);
    } finally { process.env.GOOGLE_CLIENT_ID = configuredGoogleId; }
    await oauthPage.reload();
    await text(oauthPage, 'Verify your Google identity');
    await googleLogin(oauthPage, 'browser-google@gmail.com');
    await text(oauthPage, 'Set up Google Authenticator');

    await click(admin, 'Login Activity & Audit Logs');
    await text(admin, 'Date & time · IST');
    await text(admin, 'IST');
    await admin.setViewport({ width: 390, height: 844 });
    await admin.screenshot({ path: path.join(artifacts, 'security-mobile.png'), fullPage: true });
    assert.equal(await admin.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'mobile viewport does not overflow');
    assert.deepEqual(errors, [], 'no browser runtime exceptions');
    await api(admin, 'auth/logout', 'POST', {});
    await admin.reload();
    await admin.waitForSelector('input[placeholder="Enter your username or email"]');
    assert.deepEqual(startupFailures, [], 'logout and reload return to sign-in without early private requests');
    console.log('PASS: browser security dashboard, staff Gmail and temporary password, direct password-change to QR enrollment without Google sign-in, recovery display, subsequent TOTP challenge, staff navigation/action restrictions, direct API denial, IST history and mobile layout.');
  } catch (error) {
    console.error('Browser runtime errors:', errors);
    for (const [index, page] of (await browser.pages()).entries()) {
      await page.screenshot({ path: path.join(artifacts, 'failure-' + index + '.png'), fullPage: true }).catch(() => {});
    }
    throw error;
  } finally { await browser.close(); }
};
