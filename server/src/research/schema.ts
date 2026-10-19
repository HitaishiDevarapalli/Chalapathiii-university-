import { z } from "zod";
import { researchTableSchema, ResearchTable } from "./table";
export type { ResearchTable, ResearchTableCell } from "./table";

export const researchBlockTypes = ["heading", "text", "bullets", "button", "image", "table", "accordion", "divider", "spacer"] as const;
export const RESEARCH_MAX_BLOCK_DEPTH = 8;
export type ResearchBlockType = typeof researchBlockTypes[number];
export interface ResearchBullet {
  id: string; text: string; description?: string; badge?: string; hidden?: boolean;
  href?: string; targetKind?: "none" | "url" | "pdf"; newTab?: boolean; mediaId?: string;
}
export interface ResearchBlock {
  id: string; type: ResearchBlockType; hidden?: boolean;
  text?: string; level?: "h2" | "h3" | "h4"; bullets?: ResearchBullet[];
  href?: string; targetKind?: "none" | "url" | "pdf"; newTab?: boolean; mediaId?: string;
  imageUrl?: string; alt?: string; caption?: string; width?: "full" | "medium" | "small" | "custom";
  imageWidth?: number; imageWidthUnit?: "%" | "px";
  imageHeightMode?: "auto" | "fixed"; imageHeight?: number;
  imageFit?: "cover" | "contain"; imageFocusX?: number; imageFocusY?: number;
  imagePlacement?: "block" | "wrap-left" | "wrap-right";
  imageSpaceBefore?: number; imageSpaceAfter?: number; imageTextGap?: number;
  align?: "left" | "center" | "right"; variant?: "primary" | "outline";
  children?: ResearchBlock[]; space?: number;
  table?: ResearchTable;
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
  width: z.enum(["full", "medium", "small", "custom"]).optional(), align: z.enum(["left", "center", "right"]).optional(),
  imageWidth: z.number().int().min(10).max(2400).optional(), imageWidthUnit: z.enum(["%", "px"]).optional(),
  imageHeightMode: z.enum(["auto", "fixed"]).optional(), imageHeight: z.number().int().min(40).max(2000).optional(),
  imageFit: z.enum(["cover", "contain"]).optional(), imageFocusX: z.number().min(0).max(100).optional(), imageFocusY: z.number().min(0).max(100).optional(),
  imagePlacement: z.enum(["block", "wrap-left", "wrap-right"]).optional(),
  imageSpaceBefore: z.number().int().min(0).max(160).optional(), imageSpaceAfter: z.number().int().min(0).max(160).optional(), imageTextGap: z.number().int().min(8).max(80).optional(),
  variant: z.enum(["primary", "outline"]).optional(), children: z.array(researchBlockSchema).optional(), space: z.number().int().min(8).max(160).optional(),
  table: researchTableSchema.optional(),
}).superRefine((block, context) => {
  if (["heading", "text", "button", "accordion"].includes(block.type) && !block.text?.trim()) context.addIssue({ code: "custom", path: ["text"], message: "Enter the component text." });
  if (block.type === "bullets" && !block.bullets?.length) context.addIssue({ code: "custom", path: ["bullets"], message: "Add at least one bullet point." });
  if (block.type === "button" && (!block.href || block.targetKind === "none")) context.addIssue({ code: "custom", path: ["href"], message: "Connect the button to a link or PDF." });
  if (block.type === "image" && !block.imageUrl) context.addIssue({ code: "custom", path: ["imageUrl"], message: "Upload an image or choose one from Media Storage." });
  if (block.type === "table" && !block.table) context.addIssue({ code: "custom", path: ["table"], message: "Add the table rows and columns." });
  if (block.type === "image" && block.targetKind && block.targetKind !== "none" && !block.href) context.addIssue({ code: "custom", path: ["href"], message: "Add the image link or upload a PDF, or choose No link." });
  if (block.type !== "accordion" && block.children?.length) context.addIssue({ code: "custom", path: ["children"], message: "Only expandable groups can contain other components." });
  if (block.width === "custom" && (block.imageWidth === undefined || (block.imageWidthUnit !== "px" && block.imageWidth > 100) || (block.imageWidthUnit === "px" && block.imageWidth < 40))) context.addIssue({ code: "custom", path: ["imageWidth"], message: "Image width must be 10–100% or 40–2400 pixels." });
  if (block.imageHeightMode === "fixed" && block.imageHeight === undefined) context.addIssue({ code: "custom", path: ["imageHeight"], message: "Enter the custom image height." });
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
      if (!blocks.length) return;
      if (depth > RESEARCH_MAX_BLOCK_DEPTH) { context.addIssue({ code: "custom", message: "Use no more than eight nested groups." }); return; }
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
