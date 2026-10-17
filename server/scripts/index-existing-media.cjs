// Register existing image/PDF uploads without changing file bytes or public URLs.
// Run from server/ after deploying the Media Storage migration.
require('dotenv').config({ quiet: true });
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const prisma = require('../dist/prisma').default;
const { uploadsDirectory } = require('../dist/middleware/upload');
(async () => {
  const owner = await prisma.adminUser.findFirst({ where: { role: 'superadmin', status: 'Active' }, orderBy: { id: 'asc' } });
  if (!owner) throw new Error('An active Super Administrator must exist before indexing uploads.');
  const known = new Set((await prisma.builderMedia.findMany({ select: { filename: true } })).map(row => row.filename));
  let indexed = 0, skipped = 0;
  for (const entry of await fs.readdir(uploadsDirectory, { withFileTypes: true })) {
    if (!entry.isFile() || known.has(entry.name)) continue;
    const extension = path.extname(entry.name).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf'].includes(extension)) continue;
    const file = path.join(uploadsDirectory, entry.name);
    try {
      const stat = await fs.stat(file);
      let width, height, mime;
      if (extension === '.pdf') {
        if (stat.size > 20 * 1024 * 1024) { skipped++; continue; }
        const bytes = await fs.readFile(file);
        if (bytes.subarray(0, 5).toString() !== '%PDF-' || !bytes.subarray(-1024).includes(Buffer.from('%%EOF')) || /\/(JavaScript|JS|Launch|EmbeddedFile|OpenAction|AA)\b/.test(bytes.toString('latin1'))) { skipped++; continue; }
        mime = 'application/pdf';
      } else {
        const metadata = await sharp(file, { limitInputPixels: 40_000_000 }).metadata();
        mime = ({ png: 'image/png', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' })[metadata.format];
        if (!mime) { skipped++; continue; }
        width = metadata.width; height = metadata.height;
      }
      await prisma.builderMedia.upsert({ where: { filename: entry.name }, update: {}, create: {
        filename: entry.name, originalName: entry.name, mime, width, height, size: stat.size,
        uploadedBy: owner.id, createdAt: stat.birthtime.getFullYear() > 1970 ? stat.birthtime : stat.mtime,
      } });
      indexed++;
    } catch (error) {
      // Invalid historical files are skipped; database failures stop the import.
      if (error.code?.startsWith('P')) throw error;
      skipped++;
    }
  }
  console.log(`Indexed ${indexed} existing files in Unfiled; skipped ${skipped} invalid files. Existing links and file bytes are unchanged.`);
})().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
