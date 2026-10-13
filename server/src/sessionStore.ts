import { Store, SessionData } from "express-session";
import prisma from "./prisma";

// Sessions survive restarts and work across backend processes. Never expose these via config APIs.
export const SESSION_PREFIX = "__session:";
export class DatabaseSessionStore extends Store {
  get(sid: string, cb: (err: any, session?: SessionData | null) => void) {
    prisma.siteConfig.findUnique({ where: { key: SESSION_PREFIX + sid } }).then(row => {
      const value = row ? JSON.parse(row.valueJson) : null;
      if (value?.cookie?.expires && Date.parse(value.cookie.expires) <= Date.now()) {
        this.destroy(sid, () => cb(null, null));
      } else cb(null, value);
    }).catch(cb);
  }
  set(sid: string, value: SessionData, cb: (err?: any) => void = () => {}) {
    prisma.siteConfig.upsert({ where: { key: SESSION_PREFIX + sid },
      create: { key: SESSION_PREFIX + sid, valueJson: JSON.stringify(value) },
      update: { valueJson: JSON.stringify(value) } }).then(() => cb()).catch(cb);
  }
  destroy(sid: string, cb: (err?: any) => void = () => {}) {
    prisma.siteConfig.deleteMany({ where: { key: SESSION_PREFIX + sid } }).then(() => cb()).catch(cb);
  }
  touch(sid: string, value: SessionData, cb: (err?: any) => void = () => {}) { this.set(sid, value, cb); }
}
