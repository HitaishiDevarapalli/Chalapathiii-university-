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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

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

  const { key: queryKey } = req.query;
  const targetKey = queryKey ? String(queryKey).replace(/^\//, '') : null;

  try {
    if (req.method === 'GET') {
      if (targetKey) {
        const item = await prisma.cmsSettingRecord.findUnique({
          where: { key: targetKey }
        }).catch(() => null);
        if (item) {
          try {
            return res.status(200).json(JSON.parse(item.valueJson));
          } catch {
            return res.status(200).json(item.valueJson);
          }
        }
        return res.status(200).json(null);
      }

      // Return all configs as a mapped object: { key1: value1, key2: value2, ... }
      const all = await prisma.cmsSettingRecord.findMany().catch(() => []);
      const result: Record<string, any> = {};
      all.forEach((item: any) => {
        try {
          result[item.key] = JSON.parse(item.valueJson);
        } catch {
          result[item.key] = item.valueJson;
        }
      });
      return res.status(200).json(result);
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = req.body;
      if (targetKey) {
        const stringified = typeof body === 'string' ? body : JSON.stringify(body);
        await prisma.cmsSettingRecord.upsert({
          where: { key: targetKey },
          create: { key: targetKey, valueJson: stringified },
          update: { valueJson: stringified }
        });
        return res.status(200).json({ success: true, key: targetKey });
      }

      if (body && typeof body === 'object') {
        for (const [k, v] of Object.entries(body)) {
          const stringified = typeof v === 'string' ? v : JSON.stringify(v);
          await prisma.cmsSettingRecord.upsert({
            where: { key: k },
            create: { key: k, valueJson: stringified },
            update: { valueJson: stringified }
          }).catch(() => {});
        }
        return res.status(200).json({ success: true, message: 'All configs saved' });
      }

      return res.status(400).json({ success: false, error: 'No data provided' });
    }

    if (req.method === 'DELETE' && targetKey) {
      await prisma.cmsSettingRecord.delete({
        where: { key: targetKey }
      }).catch(() => {});
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  } catch (error: any) {
    console.error('Config API Error:', error);
    return res.status(200).json({ success: true, fallback: true, error: error.message });
  }
}
