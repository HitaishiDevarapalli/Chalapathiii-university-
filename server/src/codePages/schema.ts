import { z } from "zod";
import menus from "../pageBuilder/menus.json";
const secureUrl = z
  .string()
  .max(2048)
  .refine(
    (v) =>
      !v ||
      (/^https:\/\/[^\s<>"\\]+$/.test(v) &&
        (() => {
          try {
            const u = new URL(v);
            return !u.username && !u.password;
          } catch {
            return false;
          }
        })()),
    "Use a secure absolute HTTPS URL",
  );
export const integrationSchema = z
  .object({
    mode: z
      .enum(["page", "navigation", "submenu", "footer", "replace", "homepage"])
      .default("page"),
    route: z
      .string()
      .max(180)
      .regex(
        /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/,
        "Use lowercase URL segments separated by hyphens",
      ),
    label: z.string().trim().max(100).default(""),
    parent: z.string().max(100).default("Main Menu"),
    position: z.number().int().min(0).max(100).default(0),
    visible: z.boolean().default(true),
    layout: z.enum(["global", "standalone"]).default("global"),
  })
  .superRefine((v, ctx) => {
    if (/^\/(api|admin|uploads|assets|code|code-drafts)(\/|$)/.test(v.route))
      ctx.addIssue({
        code: "custom",
        message: "This route is reserved",
        path: ["route"],
      });
    if ((v.mode === "homepage") !== (v.route === "/"))
      ctx.addIssue({
        code: "custom",
        message: "Only Set as Homepage may use /",
        path: ["route"],
      });
    if (["navigation", "submenu", "footer"].includes(v.mode) && !v.label)
      ctx.addIssue({
        code: "custom",
        message: "Enter a menu label",
        path: ["label"],
      });
    if (
      v.mode === "submenu" &&
      !menus.some((m) => m.id === v.parent && m.id !== "Main Menu")
    )
      ctx.addIssue({
        code: "custom",
        message: "Select an existing parent menu",
        path: ["parent"],
      });
    if (
      v.mode === "footer" &&
      ![
        "quickLinks",
        "academicsLinks",
        "admissionsLinks",
        "campusLifeLinks",
      ].includes(v.parent)
    )
      ctx.addIssue({
        code: "custom",
        message: "Select a footer section",
        path: ["parent"],
      });
  });
export const seoSchema = z.object({
  title: z.string().max(160).default(""),
  description: z.string().max(500).default(""),
  canonical: secureUrl.default(""),
  ogTitle: z.string().max(160).default(""),
  ogDescription: z.string().max(500).default(""),
  image: secureUrl.default(""),
  noindex: z.boolean().default(false),
  sitemap: z.boolean().default(true),
});
export const settingsSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().max(2000).default(""),
  integration: integrationSchema,
  seo: seoSchema,
});
export type Settings = z.infer<typeof settingsSchema>;
