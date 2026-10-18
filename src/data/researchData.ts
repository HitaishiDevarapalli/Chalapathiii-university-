import type { ResearchBlock } from "./researchBlocks";
export interface ResearchSection { id: string; title: string; description: string; hidden?: boolean; blocks?: ResearchBlock[]; }
export interface ResearchItem {
  id: string; title: string; category: string; sectionId?: string; description: string;
  badge?: string; link?: string; linkText?: string; hidden?: boolean;
  type?: "document" | "accordion"; parentId?: string;
}
export interface ResearchCMSData {
  schemaVersion?: number; pageTitle: string; pageSubtitle: string;
  isUnderConstruction: boolean; underConstructionMessage: string;
  contactEmail: string; contactPhone: string; hidden?: boolean;
  sections: ResearchSection[]; items: ResearchItem[];
}
export const RESEARCH_SECTIONS: ResearchSection[] = [
  { id: "updates", title: "Research Updates", description: "Notifications, admissions and resources for research scholars." },
  { id: "overview", title: "Overview", description: "Explore research, academic inquiry and innovation at Chalapathi University." },
  { id: "academic", title: "Academic Research", description: "" },
  { id: "downloads", title: "Downloads", description: "" },
  { id: "areas", title: "Area of Research", description: "" },
  { id: "sponsored", title: "Sponsored Research", description: "" },
  { id: "facilities", title: "Central Research Laboratories & Facilities", description: "" },
  { id: "collaboration", title: "Collaboration", description: "" },
  { id: "innovation", title: "Innovation & Incubation", description: "" },
  { id: "edc", title: "Entrepreneurship Development Cell (EDC)", description: "" },
  { id: "happenings", title: "Happenings", description: "" },
  { id: "archives", title: "Archives", description: "" },
];
const updateTitles = [
  "Schedule for RRM – Series 4 for Research Scholars Admitted in Academic Years 2024–25 & 2025–26",
  "List of Candidates Admitted in Ph.D. Programme 2026–27",
  "Provisionally Selected List of Candidates for Ph.D. Admissions – Academic Year 2026–27",
  "Ph.D. Admissions 2026–27 Notification", "Ph.D. Eligibility Criteria", "Offered Ph.D. Programs",
  "Application for Admission into Ph.D. Programs", "Approved Research Supervisors 2026–2027",
  "Research Admission Test & Syllabus 2026–27",
  "Research Notification for 2024–25 admitted batch (05–01–2026)",
  "Research Notification for 2025–26 admitted batch (05–01–2026)",
];
export const DEFAULT_RESEARCH_DATA: ResearchCMSData = {
  schemaVersion: 2, pageTitle: "Research & Innovation", pageSubtitle: "Advancing knowledge. Inspiring discovery.",
  isUnderConstruction: false, underConstructionMessage: "Research information is being updated. Please check back soon.",
  contactEmail: "research@chalapathi.ac.in", contactPhone: "+91 95055 05566", hidden: false,
  sections: RESEARCH_SECTIONS,
  items: [
    ...updateTitles.map((title, i): ResearchItem => ({ id: `research-update-${i + 1}`, title, sectionId: "updates", category: "General", description: "", badge: i === 0 ? "NEW" : "", type: "document" })),
    { id: "pre-phd-syllabus", title: "Pre Ph.D. Syllabus with effect from Academic Year 2025–26", sectionId: "updates", category: "Doctoral Program (Ph.D.)", type: "accordion", description: "The following two subjects are mandatory for scholars of all the departments." },
    { id: "research-methodology", title: "Research Methodology", sectionId: "updates", category: "Doctoral Program (Ph.D.)", parentId: "pre-phd-syllabus", description: "" },
    { id: "publication-ethics", title: "Research and Publication Ethics", sectionId: "updates", category: "Doctoral Program (Ph.D.)", parentId: "pre-phd-syllabus", description: "" },
  ],
};
export function researchSectionForItem(item: ResearchItem): string {
  if (item.sectionId) return item.sectionId;
  return ({ "Thrust Area": "areas", "Sponsored Project": "sponsored", "Publication & Paper": "academic", "Patent & IP": "innovation", "Laboratory & Facility": "facilities", "Doctoral Program (Ph.D.)": "academic", "Research Fellowship": "academic" } as Record<string, string>)[item.category] || "updates";
}
// Preserve existing entries while upgrading the old placeholder to the new layout.
export function normalizeResearchData(value: Partial<ResearchCMSData> | null): ResearchCMSData {
  if (!value || typeof value !== "object") return structuredClone(DEFAULT_RESEARCH_DATA);
  const migrated = value.schemaVersion !== 2;
  return { ...DEFAULT_RESEARCH_DATA, ...value, schemaVersion: 2,
    isUnderConstruction: migrated ? false : !!value.isUnderConstruction,
    sections: Array.isArray(value.sections) ? value.sections : structuredClone(RESEARCH_SECTIONS),
    items: Array.isArray(value.items) && (!migrated || value.items.length) ? value.items : structuredClone(DEFAULT_RESEARCH_DATA.items),
  };
}
export function safeResearchLink(value?: string): string | undefined {
  const link = value?.trim();
  return link && (/^https?:\/\//i.test(link) || /^\/(?!\/)/.test(link)) && !/[\s\\]/.test(link) ? link : undefined;
}
