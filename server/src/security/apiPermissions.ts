import type { Request, Response, NextFunction } from "express";
import { assertPermission, requireAuth } from "../middleware/auth";
import { audit, handler, permitted } from "./core";

export function configModule(key: string): string | null {
  if (/^(__|admin[_:.]|security[_:.]|auth[_:.])/i.test(key)) return null;
  if (/^(siteSettings|themeColors|searchConfig)$/.test(key)) return "settings";
  if (/^navigationMenu|navMenu/i.test(key)) return "links";
  if (/^footer/i.test(key)) return "footer";
  if (/^(enquiries|enquiryLeads)$/i.test(key)) return "enquiries";
  if (/^(onlineApplications|applications)$/i.test(key)) return "applications";
  if (/^(contactSubmissions|contactInquiries)$/i.test(key)) return "contacts";
  if (/^eventRegistrations$/i.test(key)) return "events";
  if (/popup|enquiryPopup/i.test(key)) return "popup";
  if (/^about|^genesis|^vision|^leadership|^advantage/i.test(key)) return "about";
  if (/^research/i.test(key)) return "research";
  if (/^(faculty|board|staff|director)/i.test(key)) return "directories";
  if (/^(placements|successStories|recruiter|industries)/i.test(key)) return "placements";
  if (/^(campusLife|campus_life)/i.test(key)) return "campus-life";
  if (/^(campusVideos|campusTour|campusGallery|campusBanners|gallery)/i.test(key)) return "gallery";
  if (/^contact/i.test(key)) return "contact";
  if (/^admissions/i.test(key)) return "admissions";
  if (/^(hero|homepage|chairman|stats|whyChoose)/i.test(key)) return "homepage";
  if (/^(program|custom_program|academic|calendar|grading|awardOfDegrees|teaching|degree|school|branch|course)/i.test(key)) return "academics";
  if (/^certifications?/i.test(key)) return "certifications";
  if (/^news/i.test(key)) return "news";
  if (/^events?/i.test(key)) return "events";
  if (/^announcements?/i.test(key)) return "announcements";
  return null;
}
export const isInternalConfig = (key: string) => /^(__|admin[_:.]|security[_:.]|auth[_:.])/i.test(key);
export const isPublicConfig = (key: string) => !!configModule(key) && !["enquiries", "applications", "contacts"].includes(configModule(key)!);
export const visibleConfig = (req: Request, key: string) => !isInternalConfig(key) && (isPublicConfig(key) || !!req.adminUser && permitted(req.adminUser, `${configModule(key) || "settings"}.view`));
const modules: Record<string, string> = { news: "news", events: "events", announcements: "announcements", "hero-slides": "homepage",
  enquiries: "enquiries", applications: "applications", faculty: "directories", placements: "placements", "event-registrations": "events",
  contacts: "contact", programs: "academics", certifications: "certifications", pages: "pages", "homepage-sections": "homepage", upload: "gallery" };
const privateReads = new Set(["enquiries", "applications", "event-registrations"]);
const publicCreates = new Set(["enquiries", "applications", "event-registrations"]);

export function adminApiGuard(req: Request, res: Response, next: NextFunction) {
  const [resource, ...rest] = req.path.replace(/^\//, "").split("/");
  // The builder applies session, CSRF and action-specific pages.* checks in its router.
  if (["auth", "security", "health", "page-builder"].includes(resource)) return next();
  const read = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  const root = rest.filter(Boolean).length === 0;
  if (publicCreates.has(resource) && root && req.method === "POST" && !req.session?.adminId) {
    req.body.status = resource === "applications" ? "Submitted" : resource === "event-registrations" ? "Confirmed" : "New";
    if (resource === "applications") { req.body.applicationFeePaid = false; delete req.body.transactionId; }
    return next();
  }
  if (read && !privateReads.has(resource) && req.query.admin !== "true" && !req.path.includes("/versions") && !req.path.includes("/backup")) return next();
  return requireAuth(req, res, () => handler(async () => {
    let keys: string[] = [];
    if (resource === "config") {
      if (rest[0] === "backup") keys = ["backup.export"];
      else if (rest[0] === "restore") keys = ["backup.manage", ...Object.keys(req.body.configs || req.body || {}).map(key => `${configModule(key) || "settings"}.publish`)];
      else {
        const key = decodeURIComponent(rest.join("/"));
        if (isInternalConfig(key)) return res.sendStatus(404);
        keys = [`${configModule(key) || "settings"}.${read ? "view" : req.method === "DELETE" ? "delete" : "edit"}`];
        if (!read && req.method !== "DELETE") keys.push(`${configModule(key) || "settings"}.publish`);
      }
    } else if (resource === "cms") {
      const body = req.body || {};
      if (body.action === "savePage") keys = ["pages.edit", "pages.publish"];
      else if (body.action === "deletePage") keys = ["pages.delete"];
      else if (body.action === "saveAll") {
        if (body.pages?.length) keys.push("pages.edit", "pages.publish");
        for (const key of Object.keys({ ...body.settings, ...body.collections })) {
          if (isInternalConfig(key)) return res.sendStatus(404);
          keys.push(`${configModule(key) || "settings"}.edit`, `${configModule(key) || "settings"}.publish`);
        }
        if (!keys.length) keys = ["pages.edit"];
      } else keys = [`pages.${read ? "view" : "manage"}`];
    } else {
      const module = modules[resource];
      if (!module) return res.status(403).json({ error: "No permission policy exists for this resource" });
      const action = read ? "view" : resource === "upload" ? "create" : req.method === "DELETE" ? "delete" : rest.includes("sync") ? "publish" : rest.includes("bulk") ? "manage" : req.method === "POST" ? "create" : "edit";
      keys = [`${module}.${action}`];
      if (!read && !privateReads.has(resource) && resource !== "upload" && action !== "delete") keys.push(`${module}.publish`);
      if (rest.includes("sync") && resource !== "news" && resource !== "events") keys.push(`${module}.manage`);
    }
    for (const key of new Set(keys)) await assertPermission(req, key);
    if (!read) res.on("finish", () => {
      if (res.statusCode < 400) void audit(req, "content_changed", true, "Authorized content operation completed", undefined, `${req.method} ${req.path}`).catch(() => {});
    });
    next();
  })(req, res, next));
}
