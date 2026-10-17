// Isolated component regression: no production login, database, or account changes.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const esbuild = require('../node_modules/esbuild');

const root = path.resolve(__dirname, '..');
const component = path.join(root, 'src/components/admin/SecurityCMS.tsx');
const source = fs.readFileSync(component, 'utf8');
const oldHandler = 'const selectTab = (id: string) => { setTab(id); setPage(1); setSearch(""); setFilter(""); setHistoryUser(""); setError(""); };';
const tabs = ['User Management', 'Roles & Permissions', 'Administrative Google Accounts',
  'Google Authenticator', 'Login Activity & Audit Logs', 'Security Settings', 'Security Dashboard'];

async function bundle(legacy) {
  const result = await esbuild.build({
    stdin: { contents: `
      import React from 'react';
      import { createRoot } from 'react-dom/client';
      import { SecurityCMS } from './src/components/admin/SecurityCMS';
      import { AdminAccessContext } from './src/security/adminAccess';
      const summary = { total: 0, active: 0, disabled: 0, google: 0, enrolled: 0,
        pending: 0, successful: 0, failed: 0, changes: [] };
      window.fetch = async (input) => {
        const endpoint = new URL(String(input), location.href).pathname.split('/').pop();
        const body = endpoint === 'summary' ? summary : endpoint === 'options' ?
          { modules: {}, roles: [], authenticationDefaults: { requireGoogle: false, requireTotp: true } } :
          endpoint === 'policy' ? { policy: { requireGoogle: false, requireTotp: true,
            idleMinutes: 30, sessionHours: 8, maxAttempts: 5, lockoutMinutes: 15, retentionDays: 365 },
            configuration: { google: false, encryption: true } } : { items: [], total: 0, roles: [] };
        await new Promise(resolve => setTimeout(resolve, 30));
        return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
      };
      createRoot(document.getElementById('root')).render(
        <AdminAccessContext.Provider value={{ id: 1, username: 'fixture', role: 'superadmin', permissions: [] }}>
          <SecurityCMS />
        </AdminAccessContext.Provider>
      );`, resolveDir: root, sourcefile: 'security-tab-fixture.tsx', loader: 'tsx' },
    bundle: true, write: false, format: 'iife', platform: 'browser',
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [{ name: 'tab-version', setup(build) {
      build.onLoad({ filter: /SecurityCMS\.tsx$/ }, () => ({
        contents: legacy ? source.replace(/const selectTab = .*?;\s*$/m, oldHandler) : source,
        loader: 'tsx', resolveDir: path.dirname(component),
      }));
    } }],
  });
  return result.outputFiles[0].text;
}

(async () => {
  const bundles = { '/legacy.js': await bundle(true), '/fixed.js': await bundle(false) };
  const server = http.createServer((req, res) => {
    if (bundles[req.url]) { res.setHeader('Content-Type', 'application/javascript'); res.end(bundles[req.url]); }
    else { res.setHeader('Content-Type', 'text/html'); res.end(`<div id="root"></div><script src="/${req.url.includes('legacy') ? 'legacy' : 'fixed'}.js"></script>`); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { default: puppeteer } = await import('../server/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js');
  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
    const base = 'http://127.0.0.1:' + server.address().port;
    const legacy = await browser.newPage();
    const legacyErrors = [];
    legacy.on('pageerror', error => legacyErrors.push(error.message));
    await legacy.goto(base + '/legacy');
    await legacy.waitForSelector('.security-stat-grid');
    await legacy.evaluate(() => [...document.querySelectorAll('.security-section-tabs button')].find(el => el.textContent === 'User Management').click());
    await legacy.waitForFunction(() => !document.querySelector('.security-cms'));
    assert(legacyErrors.some(message => /undefined.*map|map.*undefined/.test(message)), JSON.stringify(legacyErrors));
    console.log('REPRODUCED live handler: ' + legacyErrors[0]);
    assert.equal(await legacy.$eval('#root', el => el.textContent.trim()), '');
    const fixed = await browser.newPage();
    const fixedErrors = [];
    fixed.on('pageerror', error => fixedErrors.push(error.message));
    await fixed.goto(base + '/fixed');
    await fixed.waitForSelector('.security-stat-grid');
    for (const label of tabs) {
      for (let repeat = 0; repeat < 2; repeat++) {
        await fixed.evaluate(label => [...document.querySelectorAll('.security-section-tabs button')].find(el => el.textContent === label).click(), label);
        await fixed.waitForFunction(label => document.querySelector('.security-section-tabs [aria-current="page"]')?.textContent === label &&
          !document.querySelector('.security-loading') && !!document.querySelector('.security-cms .admin-panel'), {}, label);
        assert.deepEqual(fixedErrors, []);
      }
      console.log('PASS fixed handler: ' + label + ' (including repeated click)');
    }
    await fixed.evaluate(() => [...document.querySelectorAll('button')].find(el => el.textContent.includes('Reauthenticate')).click());
    await fixed.waitForSelector('[role="dialog"]');
    assert.deepEqual(fixedErrors, []);
    console.log('PASS reauthentication dialog opens without a crash; all API responses were local fixtures.');
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
