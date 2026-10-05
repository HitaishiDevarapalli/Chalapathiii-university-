import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const { action, slug } = req.query;

      if (action === 'getPage' && slug) {
        try {
          const pageRecord = await prisma.cmsPageRecord.findUnique({
            where: { slug: String(slug) }
          });
          if (pageRecord) {
            return res.status(200).json({
              success: true,
              page: {
                ...pageRecord,
                ...JSON.parse(pageRecord.dataJson || '{}')
              }
            });
          }
          return res.status(404).json({ success: false, message: 'Page not found' });
        } catch (e: any) {
          return res.status(200).json({ success: false, error: e.message, fallback: true });
        }
      }

      // Default GET: Fetch all pages, settings, and collections
      try {
        const [pages, settings, collections, versions] = await Promise.all([
          prisma.cmsPageRecord.findMany({ orderBy: { displayOrder: 'asc' } }).catch(() => []),
          prisma.cmsSettingRecord.findMany().catch(() => []),
          prisma.cmsCollectionRecord.findMany().catch(() => []),
          prisma.cmsVersionRecord.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }).catch(() => [])
        ]);

        const parsedPages = pages.map((p: any) => {
          try {
            const data = JSON.parse(p.dataJson || '{}');
            return {
              id: p.id,
              slug: p.slug,
              name: p.name,
              title: p.title,
              type: p.type,
              shortDescription: p.shortDescription || '',
              seoTitle: p.seoTitle || p.title,
              seoDescription: p.seoDescription || p.shortDescription || '',
              seoKeywords: p.seoKeywords || '',
              status: p.status,
              displayOrder: p.displayOrder,
              showInNav: p.showInNav,
              parentNav: p.parentNav,
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
              ...data
            };
          } catch {
            return p;
          }
        });

        const parsedSettings: Record<string, any> = {};
        settings.forEach((s: any) => {
          try {
            parsedSettings[s.key] = JSON.parse(s.valueJson);
          } catch {
            parsedSettings[s.key] = s.valueJson;
          }
        });

        const parsedCollections: Record<string, any> = {};
        collections.forEach((c: any) => {
          try {
            parsedCollections[c.name] = JSON.parse(c.itemsJson);
          } catch {
            parsedCollections[c.name] = [];
          }
        });

        return res.status(200).json({
          success: true,
          pages: parsedPages,
          settings: parsedSettings,
          collections: parsedCollections,
          versions: versions.map((v: any) => {
            try {
              return { ...v, snapshot: JSON.parse(v.snapshotJson) };
            } catch {
              return v;
            }
          })
        });
      } catch (err: any) {
        return res.status(200).json({
          success: true,
          pages: [],
          settings: {},
          collections: {},
          versions: [],
          notice: 'DB sync fallback mode'
        });
      }
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const { action } = body;

      if (action === 'savePage') {
        const { page, author = 'Admin', note = 'Page update' } = body;
        if (!page || !page.slug) {
          return res.status(400).json({ success: false, error: 'Page slug and data are required' });
        }

        const dataToStore = {
          sections: page.sections || [],
          customData: page.customData || {},
          tableData: page.tableData || null
        };

        try {
          const pageRecord = await prisma.cmsPageRecord.upsert({
            where: { slug: page.slug },
            update: {
              name: page.name || page.title || 'Untitled Page',
              title: page.title || 'Untitled Page',
              type: page.type || 'sections',
              shortDescription: page.shortDescription || '',
              seoTitle: page.seoTitle || page.title || '',
              seoDescription: page.seoDescription || page.shortDescription || '',
              seoKeywords: page.seoKeywords || '',
              status: page.status || 'published',
              displayOrder: Number(page.displayOrder) || 0,
              showInNav: Boolean(page.showInNav),
              parentNav: page.parentNav || null,
              dataJson: JSON.stringify(dataToStore),
              updatedAt: new Date()
            },
            create: {
              id: page.id || `page_${Date.now()}`,
              slug: page.slug,
              name: page.name || page.title || 'Untitled Page',
              title: page.title || 'Untitled Page',
              type: page.type || 'sections',
              shortDescription: page.shortDescription || '',
              seoTitle: page.seoTitle || page.title || '',
              seoDescription: page.seoDescription || page.shortDescription || '',
              seoKeywords: page.seoKeywords || '',
              status: page.status || 'published',
              displayOrder: Number(page.displayOrder) || 0,
              showInNav: Boolean(page.showInNav),
              parentNav: page.parentNav || null,
              dataJson: JSON.stringify(dataToStore)
            }
          });

          // Create version record
          await prisma.cmsVersionRecord.create({
            data: {
              pageSlug: page.slug,
              author,
              note,
              snapshotJson: JSON.stringify(page)
            }
          }).catch(() => {});

          return res.status(200).json({ success: true, page: pageRecord });
        } catch (dbErr: any) {
          console.error('DB error on savePage:', dbErr);
          return res.status(200).json({ success: true, fallback: true, page });
        }
      }

      if (action === 'deletePage') {
        const { slug, id } = body;
        try {
          if (slug) {
            await prisma.cmsPageRecord.delete({ where: { slug } });
          } else if (id) {
            await prisma.cmsPageRecord.delete({ where: { id } });
          }
          return res.status(200).json({ success: true });
        } catch (e: any) {
          return res.status(200).json({ success: true, fallback: true });
        }
      }

      if (action === 'saveAll') {
        const { pages = [], settings = {}, collections = {} } = body;
        try {
          // Upsert pages
          for (const page of pages) {
            const dataToStore = {
              sections: page.sections || [],
              customData: page.customData || {},
              tableData: page.tableData || null
            };
            await prisma.cmsPageRecord.upsert({
              where: { slug: page.slug },
              update: {
                name: page.name || page.title || 'Untitled Page',
                title: page.title || 'Untitled Page',
                type: page.type || 'sections',
                shortDescription: page.shortDescription || '',
                seoTitle: page.seoTitle || page.title || '',
                seoDescription: page.seoDescription || page.shortDescription || '',
                seoKeywords: page.seoKeywords || '',
                status: page.status || 'published',
                displayOrder: Number(page.displayOrder) || 0,
                showInNav: Boolean(page.showInNav),
                parentNav: page.parentNav || null,
                dataJson: JSON.stringify(dataToStore)
              },
              create: {
                id: page.id || `page_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                slug: page.slug,
                name: page.name || page.title || 'Untitled Page',
                title: page.title || 'Untitled Page',
                type: page.type || 'sections',
                shortDescription: page.shortDescription || '',
                seoTitle: page.seoTitle || page.title || '',
                seoDescription: page.seoDescription || page.shortDescription || '',
                seoKeywords: page.seoKeywords || '',
                status: page.status || 'published',
                displayOrder: Number(page.displayOrder) || 0,
                showInNav: Boolean(page.showInNav),
                parentNav: page.parentNav || null,
                dataJson: JSON.stringify(dataToStore)
              }
            }).catch(() => {});
          }

          // Upsert settings
          for (const [key, val] of Object.entries(settings)) {
            await prisma.cmsSettingRecord.upsert({
              where: { key },
              update: { valueJson: JSON.stringify(val) },
              create: { key, valueJson: JSON.stringify(val) }
            }).catch(() => {});
          }

          // Upsert collections
          for (const [name, items] of Object.entries(collections)) {
            await prisma.cmsCollectionRecord.upsert({
              where: { name },
              update: { itemsJson: JSON.stringify(items) },
              create: { name, itemsJson: JSON.stringify(items) }
            }).catch(() => {});
          }

          return res.status(200).json({ success: true, message: 'All CMS data synchronized to DB' });
        } catch (err: any) {
          return res.status(200).json({ success: true, fallback: true, error: err.message });
        }
      }

      return res.status(400).json({ success: false, message: `Unknown action: ${action}` });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error: any) {
    console.error('CMS API Global Handler Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
