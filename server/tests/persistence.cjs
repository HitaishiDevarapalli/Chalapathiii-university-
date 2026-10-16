// Integration test against isolated embedded PostgreSQL. Never touches the live database.
const { PGlite } = require('@electric-sql/pglite');
const { PGLiteSocketServer } = require('@electric-sql/pglite-socket');
const { readFileSync, mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');

(async () => {
  const uploadDir = mkdtempSync(path.join(tmpdir(), 'university-upload-test-'));
  const db = await PGlite.create();
  await db.exec(readFileSync('prisma/migrations/20261010105629_init/migration.sql', 'utf8'));
  await db.exec(readFileSync('prisma/migrations/202610130002_event_visibility/migration.sql', 'utf8'));
  await db.exec(readFileSync('prisma/migrations/202610130003_content_order/migration.sql', 'utf8'));
  await db.exec(readFileSync('prisma/migrations/202610160001_admin_security/migration.sql', 'utf8'));
  const socket = new PGLiteSocketServer({ db, host: '127.0.0.1', port: 55440 });
  await socket.start();
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@127.0.0.1:55440/postgres?connection_limit=1';
  process.env.UPLOADS_DIR = uploadDir;
  process.env.SESSION_SECRET = 'integration-test-secret-with-at-least-32-chars';
  const prisma = require('../dist/prisma').default;
  const app = require('../dist/index').default;
  let server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  let base = `http://127.0.0.1:${server.address().port}`;
  let cookie = '';
  const request = async (url, options = {}, admin = false) => {
    const csrf = admin && !['GET', 'HEAD', 'OPTIONS'].includes(options.method || 'GET') ? (await (await fetch(base + '/api/auth/csrf', { headers: { cookie } })).json()).csrfToken : null;
    return fetch(base + url, { ...options, headers: { ...(admin ? { cookie } : {}), ...(csrf ? { 'X-CSRF-Token': csrf } : {}), ...options.headers } });
  };
  const send = (url, body, method = 'POST', admin = true) => request(url, {
    method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  }, admin);
  const restart = async () => {
    await new Promise(resolve => server.close(resolve));
    server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  };
  try {
    await prisma.adminUser.create({ data: { username: 'test-admin', passwordHash: await bcrypt.hash('Test-only-password-123', 10), role: 'superadmin', credentialMode: 'legacy', mustChangePassword: false, requireGoogle: false, requireTotp: false } });
    assert.equal((await send('/api/auth/login', { username: 'test-admin', password: 'wrong' }, 'POST', false)).status, 401);
    for (const collection of ['news', 'events']) {
      for (const [method, suffix] of [['POST', ''], ['PUT', '/1'], ['DELETE', '/1'], ['POST', '/sync']]) {
        assert.equal((await send(`/api/${collection}${suffix}`, {}, method, false)).status, 401);
      }
      assert.equal((await request(`/api/${collection}?admin=true`)).status, 401);
    }
    assert.equal((await send('/api/config/newsPageConfig', {}, 'PUT', false)).status, 401);
    const login = await send('/api/auth/login', { username: 'test-admin', password: 'Test-only-password-123' }, 'POST', false);
    assert.equal(login.status, 200);
    cookie = login.headers.get('set-cookie').split(';')[0];
    assert.equal((await request('/api/auth/me', {}, true)).status, 200);
    assert.equal((await request('/api/news', { method: 'POST', headers: { cookie, Origin: 'https://evil.example' } })).status, 403);
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5P8AAAAASUVORK5CYII=', 'base64');
    const form = () => { const data = new FormData(); data.append('file', new Blob([png], { type: 'image/png' }), 'test.png'); return data; };
    assert.equal((await request('/api/upload', { method: 'POST', body: form() })).status, 401);
    const upload = await request('/api/upload', { method: 'POST', body: form() }, true);
    assert.equal(upload.status, 200);
    const photo = (await upload.json()).url;
    const revisionBeforePage = (await (await request('/api/cms?action=revision')).json()).revision;
    const cmsSlug = '/builder-workflow-test';
    const builderPage = { id: 'workflow-page', slug: cmsSlug, name: 'Builder Workflow Test', title: 'Builder Workflow Test', type: 'custom', status: 'draft', displayOrder: 901, showInNav: true, navLabel: 'Builder Test', parentNav: 'Campus Life', sections: [
      { id: 'hero-image', type: 'image', title: 'Page image', status: 'published', order: 1, media: { url: photo, alt: 'Workflow test image' }, settings: { imageWidth: '100%', borderRadius: '16px' } },
      { id: 'intro-copy', type: 'rich-text', title: 'Page text', content: 'Text below the image', status: 'published', order: 2 },
      { id: 'photo-carousel', type: 'gallery', title: 'Photo carousel', status: 'published', order: 3, settings: { layout: 'carousel' }, items: [{ id: 'carousel-item', title: 'Uploaded image', image: photo, enabled: true, order: 1 }] }
    ] };
    assert.equal((await send('/api/cms', { action: 'savePage', page: builderPage })).status, 200, 'builder saves a page with ordered image, text and carousel sections');
    const revisionAfterPage = (await (await request('/api/cms?action=revision')).json()).revision;
    assert.notEqual(revisionAfterPage, revisionBeforePage, 'the public revision changes immediately after a page save');
    let publicCms = await (await request('/api/cms?action=getAll')).json();
    assert.ok(!publicCms.pages.some(page => page.slug === cmsSlug), 'draft page is not exposed publicly');
    assert.equal((await send('/api/cms', { action: 'savePage', page: { ...builderPage, status: 'published' }, note: 'Publish and add to navigation' })).status, 200);
    publicCms = await (await request('/api/cms?action=getAll')).json();
    const visibleBuilderPage = publicCms.pages.find(page => page.slug === cmsSlug);
    assert.ok(visibleBuilderPage, 'published builder page appears to public readers');
    assert.equal(visibleBuilderPage.navLabel, 'Builder Test', 'navigation label persists');
    assert.equal(visibleBuilderPage.parentNav, 'Campus Life', 'navigation parent persists');
    assert.equal(visibleBuilderPage.sections[2].settings.layout, 'carousel', 'block order and carousel settings persist');
    assert.equal((await send('/api/cms', { action: 'savePage', page: { ...builderPage, status: 'published', title: 'Edited after publish', sections: builderPage.sections.slice(0, 2) }, note: 'Edit after publish' })).status, 200);
    publicCms = await (await request('/api/cms?action=getAll')).json();
    assert.equal(publicCms.pages.find(page => page.slug === cmsSlug).title, 'Edited after publish', 'published page can be edited and remains available');
    assert.equal((await send('/api/cms', { action: 'deletePage', slug: cmsSlug })).status, 200);
    publicCms = await (await request('/api/cms?action=getAll')).json();
    assert.ok(!publicCms.pages.some(page => page.slug === cmsSlug), 'deleted page disappears from the public navigation source');
    const bad = new FormData(); bad.append('file', new Blob(['<script>alert(1)</script>'], { type: 'image/png' }), 'bad.png');
    assert.equal((await request('/api/upload', { method: 'POST', body: bad }, true)).status, 400);
    for (const kind of ['news', 'events']) {
      const initial = await request(`/api/${kind}?admin=true`, {}, true);
      const revision = initial.headers.get('x-content-revision');
      const item = { id: Date.now(), title: `Published ${kind}`, slug: `published-${kind}`, date: '2026-10-13', bodyText: 'Shared text', image: photo, images: [photo] };
      const sync = await send(`/api/${kind}/sync`, { [kind === 'news' ? 'articles' : 'events']: [item, { ...item, id: Date.now() + 1, slug: `draft-${kind}`, hidden: true }], revision });
      assert.equal(sync.status, 200, await sync.clone().text());
      const saved = await sync.json();
      assert.equal(saved.items.length, 2);
      assert.ok(saved.items[0].id < 2147483647, 'server assigns valid IDs to new editor records');
      assert.equal((await request(`/api/${kind}`)).headers.get('cache-control'), 'no-store');
      const publicItems = await (await request(`/api/${kind}`)).json();
      assert.equal(publicItems.length, 1);
      assert.equal(publicItems[0].bodyText, 'Shared text');
      assert.equal((await request(`/api/${kind}/draft-${kind}`)).status, 404);
      assert.equal((await request(`/api/${kind}?hidden=true`)).status, 200);
      assert.equal((await send(`/api/${kind}/sync`, { [kind === 'news' ? 'articles' : 'events']: [], revision })).status, 409);
      const invalid = await send(`/api/${kind}/sync`, { [kind === 'news' ? 'articles' : 'events']: [{ ...item, image: 'data:image/png;base64,ABC' }], revision: saved.revision });
      assert.equal(invalid.status, 400);
      assert.equal((await (await request(`/api/${kind}?admin=true`, {}, true)).json()).length, 2, 'invalid batch does not delete content');
      const id = publicItems[0].id;
      assert.equal((await send(`/api/${kind}/${id}`, { title: 'Edited shared title' }, 'PUT')).status, 200);
      assert.equal((await (await request(`/api/${kind}/published-${kind}`)).json()).title, 'Edited shared title');
      assert.equal((await send(`/api/${kind}`, { ...item, slug: `create-${kind}` })).status, 201);
      const current = await request(`/api/${kind}?admin=true`, {}, true);
      const before = await current.json();
      const duplicate = before.map(row => ({ ...row, slug: 'duplicate-slug' }));
      assert.equal((await send(`/api/${kind}/sync`, { [kind === 'news' ? 'articles' : 'events']: duplicate, revision: current.headers.get('x-content-revision') })).status, 409);
      assert.deepEqual(await (await request(`/api/${kind}?admin=true`, {}, true)).json(), before, 'failed database batch rolls back');
      assert.equal((await send(`/api/${kind}/${id}`, {}, 'DELETE')).status, 200);
      assert.equal((await request(`/api/${kind}/published-${kind}`)).status, 404);
    }
    await send('/api/config/newsPageConfig', { headerTitle: 'Shared heading' }, 'PUT');
    const config = await (await request('/api/config')).json();
    assert.equal(config.newsPageConfig.headerTitle, 'Shared heading');
    assert.ok(!Object.keys(config).some(k => k.startsWith('__session:')));
    const cms = await (await request('/api/cms')).json();
    assert.ok(!Object.keys(cms.settings).some(k => k.startsWith('__session:')));
    assert.equal((await send('/api/cms', { action: 'saveAll', settings: {} }, 'POST', false)).status, 401);
    assert.equal((await request('/api/config/' + encodeURIComponent('__session:fake'))).status, 404);
    assert.equal((await send('/api/config/news', [], 'PUT')).status, 404);
    const popupConfig = { masterEnabled: true, activePopupId: 'notice', popups: [{ id: 'notice', type: 'banner', title: 'University notice', enabled: true, image: photo }] };
    assert.equal((await send('/api/config/popupConfig', popupConfig, 'PUT', false)).status, 401);
    assert.equal((await send('/api/config/popupConfig', popupConfig, 'PUT')).status, 200);
    assert.deepEqual(await (await request('/api/config/popupConfig?raw=true')).json(), popupConfig, 'independent visitor reads published popup');
    const programSettings = {
      programs: [{ slug: 'test-academics', title: 'Published academic program' }],
      custom_program_data_test: { title: 'Shared detail', facultyList: [], about: { summary: 'Saved across devices' } },
      program_sections_order_test: [{ id: 'about', enabled: true, order: 1 }]
    };
    assert.equal((await send('/api/cms', { action: 'saveAll', settings: programSettings })).status, 200);
    const independentReader = await request('/api/config');
    assert.match(independentReader.headers.get('cache-control'), /no-store/);
    const published = await independentReader.json();
    for (const [key, value] of Object.entries(programSettings)) assert.deepEqual(published[key], value);
    await restart();
    assert.equal((await request('/api/auth/me', {}, true)).status, 200, 'database-backed session survives server recreation');
    assert.deepEqual(Buffer.from(await (await request(photo)).arrayBuffer()), png, 'photo is durable and publicly readable');
    const afterRestart = await (await request('/api/config')).json();
    assert.deepEqual(afterRestart.popupConfig, popupConfig, 'popup publication survives API restart');
    for (const [key, value] of Object.entries(programSettings)) assert.deepEqual(afterRestart[key], value, 'program content survives restart');
    assert.equal((await send('/api/auth/logout', {})).status, 200);
    assert.equal((await request('/api/auth/me', {}, true)).status, 401, 'logout revokes session');
    if (process.env.BROWSER_TEST === '1') await require('./browser.cjs')(base, png);
    console.log('PASS: authenticated CRUD, public reads, photo storage, draft privacy, revisions, atomic rollback, config security, session persistence and logout.');
  } finally {
    await new Promise(resolve => server.close(resolve));
    await prisma.$disconnect();
    await socket.stop(); await db.close();
    rmSync(uploadDir, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
