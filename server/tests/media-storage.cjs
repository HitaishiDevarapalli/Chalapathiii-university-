// Called by the isolated page-builder harness; never uses production data.
const assert = require('node:assert/strict');
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
module.exports = async ({ base, admin, viewer, visitor, prisma, directory, db }) => {
  const send = (route, method = 'GET', body, client = admin, csrf = true) => client.request('/api/media' + route, method, body, csrf);
  const png = await sharp({ create: { width: 120, height: 80, channels: 3, background: '#317d8d' } }).png().toBuffer();
  const form = (folderId, bytes = png, mime = 'image/png', name = 'college-photo.png') => {
    const data = new FormData(); data.append('file', new Blob([bytes], { type: mime }), name);
    if (folderId) data.append('folderId', folderId);
    return data;
  };
  assert.equal((await send('', 'GET', undefined, visitor)).status, 401);
  assert.equal((await send('/folders', 'GET', undefined, visitor)).status, 401);
  assert.equal((await send('', 'GET', undefined, viewer)).status, 200, 'page readers may browse files');
  assert.equal((await send('/folders', 'POST', { name: 'Denied' }, viewer)).status, 403);
  assert.equal((await send('', 'POST', form(), viewer)).status, 403);
  assert.equal((await send('/folders', 'POST', { name: 'CSRF' }, admin, false)).status, 403);
  const campus = await send('/folders', 'POST', { name: 'Campus' });
  assert.equal(campus.status, 201, JSON.stringify(campus.body));
  const child = await send('/folders', 'POST', { name: 'Events', parentId: campus.body.id });
  assert.equal(child.status, 201);
  assert.equal((await send('/folders', 'POST', { name: 'campus' })).status, 409, 'root sibling names are case insensitive');
  assert.equal((await send('/folders', 'POST', { name: 'events', parentId: campus.body.id })).status, 409);
  assert.equal((await send('/folders', 'POST', { name: 'Events' })).status, 201, 'same folder name allowed in a different parent');
  assert.equal((await send('/folders', 'POST', { name: '../bad' })).status, 400);
  assert.equal((await send('/folders', 'POST', { name: 'Missing', parentId: 'missing' })).status, 404);
  const asset = await send('', 'POST', form(child.body.id));
  const duplicate = await send('', 'POST', form(child.body.id));
  assert.equal(asset.status, 201, JSON.stringify(asset.body)); assert.equal(duplicate.status, 201);
  assert.notEqual(asset.body.url, duplicate.body.url, 'duplicate original names receive unique stable URLs');
  assert.equal(asset.body.mime, 'image/webp'); assert.equal(asset.body.width, 120);
  assert.equal(asset.body.folderId, child.body.id);
  const publicImage = await fetch(base + asset.body.url);
  assert.equal(publicImage.status, 200); assert.match(publicImage.headers.get('content-type'), /image\/webp/);
  assert.equal((await sharp(Buffer.from(await publicImage.arrayBuffer())).metadata()).width, 120);
  assert.equal((await send('', 'POST', form(null, Buffer.from('not an image')))).status, 400);
  assert.equal((await send('', 'POST', form('missing'))).status, 404);
  assert.equal((await send('', 'POST', form(null, Buffer.alloc(10 * 1024 * 1024 + 1)))).status, 413);
  assert.equal((await send('', 'POST', form(null, Buffer.from('%PDF-1.7\n/JavaScript bad\n%%EOF'), 'application/pdf', 'bad.pdf'))).status, 400);
  const pdf = await send('', 'POST', form(campus.body.id, Buffer.from('%PDF-1.7\n1 0 obj << /Type /Catalog >> endobj\n%%EOF'), 'application/pdf', 'brochure.pdf'));
  assert.equal(pdf.status, 201);
  const scoped = await send('?folder=' + child.body.id + '&type=image');
  assert.equal(scoped.body.total, 2);
  assert.equal((await send('?type=pdf')).body.items.every(item => item.mime === 'application/pdf'), true);
  assert.equal((await send('?folder=' + campus.body.id + '&search=college')).body.total, 0);
  assert.equal((await send('?folder=missing')).status, 404);
  const moved = await send('/' + asset.body.id, 'PATCH', { folderId: campus.body.id, originalName: 'Convocation.webp', alt: 'Students at convocation' });
  assert.equal(moved.status, 200); assert.equal(moved.body.url, asset.body.url);
  assert.equal((await send('?search=convocation&type=image')).body.items[0].id, asset.body.id);
  assert.equal((await send('/' + asset.body.id, 'PATCH', { folderId: null }, viewer)).status, 403);
  assert.equal((await send('/folders/' + campus.body.id, 'DELETE')).status, 409, 'nonempty folders cannot be removed');
  assert.equal((await send('/folders/' + child.body.id, 'PATCH', { name: 'College Events' })).status, 200);
  assert.equal((await fetch(base + asset.body.url)).status, 200);
  assert.equal((await send('/' + duplicate.body.id, 'PATCH', { folderId: null })).status, 200);
  assert.equal((await send('/folders/' + child.body.id, 'DELETE')).status, 200);
  assert.equal((await send('?folder=unfiled')).body.items.some(row => row.id === duplicate.body.id), true);
  assert.equal((await admin.get('/media')).body.some(row => row.id === asset.body.id), true, 'builder and storage share one catalog');
  const removable = await send('', 'POST', form(campus.body.id, png, 'image/png', 'delete-test.png'));
  const removeId = removable.body.id, removePath = path.join(directory, removable.body.filename);
  assert.equal((await send('/' + removeId, 'DELETE', undefined, visitor)).status, 401);
  assert.equal((await send('/' + removeId, 'DELETE', undefined, viewer)).status, 403);
  assert.equal((await send('/' + removeId, 'DELETE', undefined, admin, false)).status, 403);
  assert(await prisma.builderMedia.findUnique({ where: { id: removeId } }));
  assert(fs.existsSync(removePath), 'denied deletion preserves disk and database');

  const fsp = require('node:fs/promises');
  const rename = fsp.rename;
  try {
    fsp.rename = async (source, destination) => {
      if (source === removePath) throw Object.assign(new Error('Fixture storage denied'), { code: 'EACCES' });
      return rename(source, destination);
    };
    assert.equal((await send('/' + removeId, 'DELETE')).status, 500);
  } finally { fsp.rename = rename; }
  assert(await prisma.builderMedia.findUnique({ where: { id: removeId } }), 'storage failure rolls back database deletion');
  assert(fs.existsSync(removePath));
  assert.equal(await prisma.adminSecurityEvent.count({ where: { event: 'media_deleted', target: removeId } }), 0, 'failed deletion has no success audit');

  // Abort a real database transaction after the callback has staged the file.
  const transaction = prisma.$transaction.bind(prisma);
  try {
    prisma.$transaction = (input, ...options) => typeof input !== 'function' ? transaction(input, ...options) : transaction(async tx => {
      await input(tx);
      assert.equal(fs.existsSync(removePath), false, 'failure is injected after the file moves');
      throw new Error('Fixture transaction failed before commit');
    }, ...options);
    assert.equal((await send('/' + removeId, 'DELETE')).status, 500);
  } finally { prisma.$transaction = transaction; }
  assert(await prisma.builderMedia.findUnique({ where: { id: removeId } }), 'transaction failure restores the database row');
  assert(fs.existsSync(removePath), 'transaction failure restores the original public file');
  assert.equal((await fetch(base + removable.body.url)).status, 200);
  assert.equal(fs.readdirSync(directory).some(name => name.startsWith('.media-delete-')), false, 'failed deletions leave no staged files');

  assert.equal((await send('/' + removeId, 'DELETE')).status, 200);
  assert.equal(await prisma.builderMedia.findUnique({ where: { id: removeId } }), null, 'permanent delete removes the database row');
  assert.equal(fs.existsSync(removePath), false, 'permanent delete removes the stored file');
  assert.equal((await fetch(base + removable.body.url)).status, 404);
  assert.equal((await send('')).body.items.some(row => row.id === removeId), false);
  assert.equal((await admin.get('/media')).body.some(row => row.id === removeId), false, 'builder catalog also drops the deleted record');
  assert.equal(await prisma.adminSecurityEvent.count({ where: { event: 'media_deleted', target: removeId } }), 1);
  assert.equal((await send('/' + removeId, 'DELETE')).status, 404, 'repeated deletion is explicit');

  const stale = await prisma.builderMedia.create({ data: { filename: 'already-missing.webp', originalName: 'Missing file', mime: 'image/webp', size: 1, uploadedBy: 1 } });
  assert.equal((await send('/' + stale.id, 'DELETE')).status, 200, 'missing files do not prevent database cleanup');
  assert.equal(await prisma.builderMedia.findUnique({ where: { id: stale.id } }), null);
  const invalid = await prisma.builderMedia.create({ data: { filename: '../outside.webp', originalName: 'Invalid path', mime: 'image/webp', size: 1, uploadedBy: 1 } });
  assert.equal((await send('/' + invalid.id, 'DELETE')).status, 409, 'stored paths cannot escape uploads');
  assert(await prisma.builderMedia.findUnique({ where: { id: invalid.id } }));
  await prisma.builderMedia.delete({ where: { id: invalid.id } });
  const nonFile = await prisma.builderMedia.create({ data: { filename: 'directory.webp', originalName: 'Directory', mime: 'image/webp', size: 1, uploadedBy: 1 } });
  fs.mkdirSync(path.join(directory, nonFile.filename));
  assert.equal((await send('/' + nonFile.id, 'DELETE')).status, 409);
  assert(fs.statSync(path.join(directory, nonFile.filename)).isDirectory());
  await prisma.builderMedia.delete({ where: { id: nonFile.id } }); fs.rmdirSync(path.join(directory, nonFile.filename));

  const cleanup = await send('', 'POST', form(null, png, 'image/png', 'cleanup-test.png'));
  const unlink = fsp.unlink;
  try {
    fsp.unlink = async file => {
      if (path.basename(file) === 'asset' && path.basename(path.dirname(file)).startsWith('.media-delete-'))
        throw Object.assign(new Error('Fixture cleanup denied'), { code: 'EACCES' });
      return unlink(file);
    };
    const response = await send('/' + cleanup.body.id, 'DELETE');
    assert.equal(response.status, 200); assert.match(response.body.warning, /cleanup failed/);
    assert.equal(await prisma.builderMedia.findUnique({ where: { id: cleanup.body.id } }), null);
    assert.equal((await fetch(base + cleanup.body.url)).status, 404);
    const staged = fs.readdirSync(directory).find(name => name.startsWith('.media-delete-'));
    assert(staged); assert.equal((await fetch(base + '/uploads/' + staged + '/asset')).status, 404, 'staged bytes are private');
    await unlink(path.join(directory, staged, 'asset')); fs.rmdirSync(path.join(directory, staged));
  } finally { fsp.unlink = unlink; }
  for (let i = 0; i < 45; i++) await prisma.builderMedia.create({ data: { filename: `fixture-${i}.webp`, originalName: `pagination-${i}.webp`, mime: 'image/webp', size: 100, uploadedBy: 1 } });
  const first = await send('?search=pagination&page=1'), second = await send('?search=pagination&page=2');
  assert.equal(first.body.items.length, 40); assert.equal(second.body.items.length, 5);
  assert.equal(new Set([...first.body.items, ...second.body.items].map(row => row.id)).size, 45);
  await prisma.builderMedia.deleteMany({ where: { originalName: { startsWith: 'pagination-' } } });
  fs.writeFileSync(path.join(directory, 'historical-campus.png'), png);
  await prisma.$disconnect();
  // The embedded fixture multiplexes one PostgreSQL session across clients.
  await db.exec('DEALLOCATE ALL');
  const execFile = require('node:util').promisify(require('node:child_process').execFile);
  const indexed = await execFile(process.execPath, ['scripts/index-existing-media.cjs']);
  assert.match(indexed.stdout, /Indexed 1 existing files/);
  await db.exec('DEALLOCATE ALL');
  const repeated = await execFile(process.execPath, ['scripts/index-existing-media.cjs']);
  assert.match(repeated.stdout, /Indexed 0 existing files/);
  await db.exec('DEALLOCATE ALL');
  assert.equal((await send('?folder=unfiled&search=historical-campus')).body.items[0].url, '/uploads/historical-campus.png');
  assert.deepEqual(fs.readFileSync(path.join(directory, 'historical-campus.png')), png, 'indexing preserves original bytes and URLs');
  assert.equal((await send('?folder=' + campus.body.id)).body.items.some(row => row.id === asset.body.id), true, 'catalog persists after a new database connection');
  console.log('PASS: Media Storage API: folder and file CRUD, permanent database/disk deletion, audit, storage/commit failure recovery, path validation, permissions/CSRF, pagination and historical indexing.');
  if (process.env.MEDIA_BROWSER === '1') {
    const uploadPath = path.join(directory, 'browser-college.png'); fs.writeFileSync(uploadPath, png);
    await require('./media-storage-browser.cjs')({ base, uploadPath });
  }
};
