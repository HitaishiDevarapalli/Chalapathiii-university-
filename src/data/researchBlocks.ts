import { ResearchCMSData, ResearchItem, researchSectionForItem } from "./researchData";
export { safeResearchUrl, researchBlockSchema, researchContentSchema } from "../../server/src/research/schema";
export type { ResearchBlock, ResearchBullet, ResearchBlockType } from "../../server/src/research/schema";
import type { ResearchBlock, ResearchBlockType } from "../../server/src/research/schema";
import { RESEARCH_MAX_BLOCK_DEPTH } from "../../server/src/research/schema";
import { createResearchTable } from "./researchTable";

export const RESEARCH_COMPONENTS: { type: ResearchBlockType; label: string; hint: string; symbol: string }[] = [
  { type: "heading", label: "Heading", hint: "Section and subheadings", symbol: "H" },
  { type: "text", label: "Text", hint: "Paragraphs and descriptions", symbol: "¶" },
  { type: "bullets", label: "Bullet list", hint: "Text, links and PDF downloads", symbol: "☷" },
  { type: "button", label: "Button", hint: "Link or PDF action", symbol: "↗" },
  { type: "image", label: "Image", hint: "Upload or choose media", symbol: "▧" },
  { type: "table", label: "Table", hint: "Rows, columns and merged cells", symbol: "▦" },
  { type: "accordion", label: "Expandable group", hint: "Components inside a group", symbol: "⌄" },
  { type: "divider", label: "Divider", hint: "Separate content sections", symbol: "—" },
  { type: "spacer", label: "Space", hint: "Adjust vertical spacing", symbol: "↕" },
];
export function makeResearchBlock(type: ResearchBlockType): ResearchBlock {
  const block: ResearchBlock = { id: crypto.randomUUID(), type };
  if (type === "heading") return { ...block, text: "Your heading", level: "h3" };
  if (type === "text") return { ...block, text: "Write your content here." };
  if (type === "bullets") return { ...block, bullets: [{ id: crypto.randomUUID(), text: "New bullet point", targetKind: "none" }] };
  if (type === "button") return { ...block, text: "View document", targetKind: "url", href: "", newTab: true, variant: "primary" };
  if (type === "image") return { ...block, imageUrl: "", alt: "", width: "full", align: "left" };
  if (type === "table") return { ...block, table: createResearchTable() };
  if (type === "accordion") return { ...block, text: "Expandable heading", children: [] };
  if (type === "spacer") return { ...block, space: 32 };
  return block;
}
export function researchBlocksForSection(data: ResearchCMSData, sectionId: string): ResearchBlock[] {
  const section = data.sections.find(item => item.id === sectionId);
  if (Array.isArray(section?.blocks)) return section.blocks;
  const entries = data.items.filter(item => researchSectionForItem(item) === sectionId);
  const convert = (item: ResearchItem): ResearchBlock => item.type === "accordion"
    ? { id: `legacy-${item.id}`, type: "accordion", text: item.title, hidden: item.hidden,
      children: [...(item.description ? [{ id: `legacy-description-${item.id}`, type: "text" as const, text: item.description }] : []),
        ...entries.filter(child => child.parentId === item.id).map(convert)] }
    : { id: `legacy-${item.id}`, type: "bullets", hidden: item.hidden, bullets: [{ id: item.id, text: item.title,
      description: item.description, href: item.link || "", targetKind: item.link ? "url" : "none", badge: item.badge, newTab: !!item.link?.startsWith("http") }] };
  return entries.filter(item => !item.parentId).map(convert);
}
export function findResearchBlock(blocks: ResearchBlock[], id: string): ResearchBlock | undefined {
  for (const block of blocks) { if (block.id === id) return block; const child = findResearchBlock(block.children || [], id); if (child) return child; }
}
export function updateResearchBlock(blocks: ResearchBlock[], id: string, patch: Partial<ResearchBlock>): ResearchBlock[] {
  return blocks.map(block => block.id === id ? { ...block, ...patch } : block.children ? { ...block, children: updateResearchBlock(block.children, id, patch) } : block);
}
export function removeResearchBlock(blocks: ResearchBlock[], id: string): ResearchBlock[] {
  return blocks.filter(block => block.id !== id).map(block => block.children ? { ...block, children: removeResearchBlock(block.children, id) } : block);
}
export function copyResearchBlock(block: ResearchBlock): ResearchBlock {
  return { ...structuredClone(block), id: crypto.randomUUID(), bullets: block.bullets?.map(bullet => ({ ...bullet, id: crypto.randomUUID() })), children: block.children?.map(copyResearchBlock) };
}
export function countResearchBlocks(blocks: ResearchBlock[]): number {
  return blocks.reduce((count, block) => count + 1 + countResearchBlocks(block.children || []), 0);
}

/** Check the whole subtree before moving it, including moves into a deeper group. */
export function researchPlacementFits(blocks: ResearchBlock[], source: ResearchBlock, targetId = "", inside = true): boolean {
  if (targetId === source.id || findResearchBlock(source.children || [], targetId)) return false;
  const depthOf = (list: ResearchBlock[], depth: number): number | undefined => {
    for (const block of list) {
      if (block.id === targetId) return depth;
      const found = depthOf(block.children || [], depth + 1);
      if (found !== undefined) return found;
    }
  };
  const heightOf = (block: ResearchBlock): number => Math.max(0, ...(block.children || []).map(child => 1 + heightOf(child)));
  const targetDepth = targetId ? depthOf(blocks, 0) : -1;
  if (targetDepth === undefined || (inside && targetId && findResearchBlock(blocks, targetId)?.type !== "accordion")) return false;
  return (targetId ? targetDepth + (inside ? 1 : 0) : 0) + heightOf(source) <= RESEARCH_MAX_BLOCK_DEPTH;
}
