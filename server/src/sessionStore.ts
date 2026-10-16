import { Store, SessionData } from "express-session";
import prisma from "./prisma";
import { digest, audit } from "./security/core";

// Sessions survive restarts and work across backend processes. Never expose these via config APIs.
export const SESSION_PREFIX = "__session:";
export class DatabaseSessionStore extends Store {
  get(sid: string, cb: (err: any, session?: SessionData | null) => void) {
    (async () => {
      const row = await prisma.adminAuthSession.findUnique({ where: { id: digest(sid) } });
      if (row?.revokedAt) return cb(null, null);
      if (row && row.expiresAt <= new Date()) {
        if (row.userId) await audit(null, "session_expired", true, "Server-side session lifetime elapsed", { id: row.userId });
        await prisma.adminAuthSession.update({ where: { id: row.id }, data: { revokedAt: new Date() } });
        return cb(null, null);
      }
      // Compatibility during credential transition; old SiteConfig records remain private.
      const legacy = !row ? await prisma.siteConfig.findUnique({ where: { key: SESSION_PREFIX + sid } }) : null;
      const value = row ? JSON.parse(row.dataJson) : legacy ? JSON.parse(legacy.valueJson) : null;
      if (value?.cookie?.expires && Date.parse(value.cookie.expires) <= Date.now()) return this.destroy(sid, () => cb(null, null));
      cb(null, value);
    })().catch(cb);
  }
  set(sid: string, value: SessionData, cb: (err?: any) => void = () => {}) {
    const userId = value.adminId || value.pendingAuth?.userId || null;
    const expiresAt = new Date(value.cookie.expires || Date.now() + 86400000);
    prisma.adminAuthSession.upsert({ where: { id: digest(sid) },
      create: { id: digest(sid), userId, dataJson: JSON.stringify(value), expiresAt },
      update: { userId, dataJson: JSON.stringify(value), expiresAt, lastSeenAt: new Date() } }).then(() => cb()).catch(cb);
  }
  destroy(sid: string, cb: (err?: any) => void = () => {}) {
    Promise.all([prisma.adminAuthSession.updateMany({ where: { id: digest(sid) }, data: { revokedAt: new Date() } }),
      prisma.siteConfig.deleteMany({ where: { key: SESSION_PREFIX + sid } })]).then(() => cb()).catch(cb);
  }
  touch(sid: string, value: SessionData, cb: (err?: any) => void = () => {}) { this.set(sid, value, cb); }
}
