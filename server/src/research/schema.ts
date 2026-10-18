import { z } from "zod";

export const researchBlockTypes = ["heading", "text", "bullets", "button", "image", "accordion", "divider", "spacer"] as const;
export type ResearchBlockType = typeof researchBlockTypes[number];
export interface ResearchBullet {
  id: string; text: string; description?: string; badge?: string; hidden?: boolean;
  href?: string; targetKind?: "none" | "url" | "pdf"; newTab?: boolean; mediaId?: string;
}
export interface ResearchBlock {
  id: string; type: ResearchBlockType; hidden?: boolean;
  text?: string; level?: "h2" | "h3" | "h4"; bullets?: ResearchBullet[];
  href?: string; targetKind?: "none" | "url" | "pdf"; newTab?: boolean; mediaId?: string;
  imageUrl?: string; alt?: string; caption?: string; width?: "full" | "medium" | "small";
  align?: "left" | "center" | "right"; variant?: "primary" | "outline";
  children?: ResearchBlock[]; space?: number;
}
export function safeResearchUrl(value?: string): string | undefined {
  const url = value?.trim();
  return url && (/^https?:\/\/[^\s\\]+$/i.test(url) || /^\/(?!\/)[^\s\\]*$/.test(url)) && !/[\x00-\x1f\x7f]/.test(url) ? url : undefined;
}
const text = z.string().max(200000);
const url = z.string().max(4096).refine(value => !value || !!safeResearchUrl(value), "Use an HTTP(S) URL or a website path starting with /.");
const destination = {
  href: url.optional(), targetKind: z.enum(["none", "url", "pdf"]).optional(),
  newTab: z.boolean().optional(), mediaId: z.string().max(200).optional(),
};
const bulletSchema = z.object({
  id: z.string().min(1).max(200), text: text.refine(value => !!value.trim(), "Enter bullet text."),
  description: text.optional(), badge: z.string().max(100).optional(), hidden: z.boolean().optional(), ...destination,
}).superRefine((bullet, context) => {
  if (bullet.targetKind && bullet.targetKind !== "none" && !bullet.href) context.addIssue({ code: "custom", path: ["href"], message: "Add the bullet link or upload a PDF." });
});
export const researchBlockSchema: z.ZodType<ResearchBlock> = z.lazy(() => z.object({
  id: z.string().min(1).max(200), type: z.enum(researchBlockTypes), hidden: z.boolean().optional(),
  text: text.optional(), level: z.enum(["h2", "h3", "h4"]).optional(), bullets: z.array(bulletSchema).optional(), ...destination,
  imageUrl: url.optional(), alt: z.string().max(2000).optional(), caption: text.optional(),
  width: z.enum(["full", "medium", "small"]).optional(), align: z.enum(["left", "center", "right"]).optional(),
  variant: z.enum(["primary", "outline"]).optional(), children: z.array(researchBlockSchema).optional(), space: z.number().int().min(8).max(160).optional(),
}).superRefine((block, context) => {
  if (["heading", "text", "button", "accordion"].includes(block.type) && !block.text?.trim()) context.addIssue({ code: "custom", path: ["text"], message: "Enter the component text." });
  if (block.type === "bullets" && !block.bullets?.length) context.addIssue({ code: "custom", path: ["bullets"], message: "Add at least one bullet point." });
  if (block.type === "button" && !block.href) context.addIssue({ code: "custom", path: ["href"], message: "Connect the button to a link or PDF." });
  if (block.type === "image" && !block.imageUrl) context.addIssue({ code: "custom", path: ["imageUrl"], message: "Upload an image or choose one from Media Storage." });
}));

export const researchContentSchema = z.object({
  schemaVersion: z.literal(2).optional(), pageTitle: text, pageSubtitle: text,
  isUnderConstruction: z.boolean(), underConstructionMessage: text, hidden: z.boolean().optional(),
  contactEmail: z.string().optional(), contactPhone: z.string().optional(),
  sections: z.array(z.object({ id: z.string().min(1), title: z.string().trim().min(1).max(200), description: text,
    hidden: z.boolean().optional(), blocks: z.array(researchBlockSchema).optional(),
  }).passthrough()),
  items: z.array(z.object({ id: z.string().min(1), title: text, category: z.string(), description: text,
    sectionId: z.string().optional(), link: url.optional(),
  }).passthrough()),
}).passthrough().superRefine((data, context) => {
  const sectionIds = new Set<string>(), titles = new Set<string>();
  for (const [index, section] of data.sections.entries()) {
    const title = section.title.trim().toLowerCase();
    if (sectionIds.has(section.id) || titles.has(title)) context.addIssue({ code: "custom", path: ["sections", index], message: "Sidebar options need unique IDs and titles." });
    sectionIds.add(section.id); titles.add(title);
    const ids = new Set<string>();
    const visit = (blocks: ResearchBlock[], depth: number) => {
      if (depth > 8) { context.addIssue({ code: "custom", message: "Use no more than eight nested groups." }); return; }
      for (const block of blocks) {
        if (ids.has(block.id)) context.addIssue({ code: "custom", message: "Duplicate component ID." });
        ids.add(block.id);
        if (block.bullets && new Set(block.bullets.map(bullet => bullet.id)).size !== block.bullets.length) context.addIssue({ code: "custom", message: "Duplicate bullet ID." });
        visit(block.children || [], depth + 1);
      }
    };
    visit(section.blocks || [], 0);
  }
});
