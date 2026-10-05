export type PageType = 
  | "content"
  | "sections"
  | "listing"
  | "table"
  | "directory"
  | "gallery"
  | "news"
  | "events"
  | "faq"
  | "custom";

export type PageStatus = "published" | "draft" | "hidden";

export type SectionType = 
  | "hero"
  | "rich-text"
  | "image"
  | "image-text"
  | "cards"
  | "statistics"
  | "timeline"
  | "accordion"
  | "faq"
  | "gallery"
  | "person-profile"
  | "faculty-directory"
  | "leadership-directory"
  | "department-listing"
  | "course-listing"
  | "news-listing"
  | "events-listing"
  | "table"
  | "downloads"
  | "video"
  | "contact-form"
  | "cta"
  | "testimonials"
  | "custom";

export interface TableColumn {
  id: string;
  label: string;
  type?: "text" | "link" | "badge" | "number";
  width?: string;
}

export interface TableRow {
  id: string;
  enabled: boolean;
  order: number;
  cells: Record<string, string>;
}

export interface DynamicTableData {
  name: string;
  description?: string;
  columns: TableColumn[];
  rows: TableRow[];
}

export interface DirectoryMember {
  id: string;
  name: string;
  designation: string;
  department?: string;
  qualification?: string;
  email?: string;
  phone?: string;
  photo?: string;
  bio?: string;
  category?: string;
  order: number;
  status: "active" | "inactive";
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    scholar?: string;
  };
}

export interface CmsSection {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  badge?: string;
  content?: string;
  status: "published" | "draft" | "hidden";
  order: number;
  settings?: {
    layout?: "grid" | "list" | "split" | "full" | "cards";
    columns?: 1 | 2 | 3 | 4;
    bgColor?: string;
    textColor?: string;
    align?: "left" | "center" | "right";
    imagePosition?: "left" | "right";
    buttonText?: string;
    buttonLink?: string;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    aspectRatio?: string;
  };
  media?: {
    url?: string;
    poster?: string;
    alt?: string;
    caption?: string;
  };
  items?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    iconName?: string;
    image?: string;
    link?: string;
    buttonText?: string;
    badge?: string;
    statNumber?: string;
    statLabel?: string;
    year?: string;
    author?: string;
    designation?: string;
    department?: string;
    fileUrl?: string;
    fileSize?: string;
    fileType?: string;
    rating?: number;
    tags?: string[];
    enabled?: boolean;
    order?: number;
  }>;
  table?: DynamicTableData;
  rawHtml?: string;
}

export interface CmsVersion {
  id: string;
  timestamp: string;
  author: string;
  note: string;
  snapshot: any;
}

export interface CmsPage {
  id: string;
  slug: string;
  name: string;
  title: string;
  type: PageType;
  shortDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  status: PageStatus;
  displayOrder: number;
  showInNav: boolean;
  parentNav?: string;
  createdAt: string;
  updatedAt: string;
  sections: CmsSection[];
  tableData?: DynamicTableData;
  customData?: any;
  versionHistory?: CmsVersion[];
}

export const PAGE_TYPE_OPTIONS: Array<{
  type: PageType;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    type: "content",
    label: "Content Page",
    description: "Standard editorial page with Hero, rich text, images, and feature callouts.",
    icon: "FileText"
  },
  {
    type: "sections",
    label: "Section-Based Page",
    description: "Modular page built with cards, statistics, timelines, and dynamic grids.",
    icon: "Layers"
  },
  {
    type: "listing",
    label: "Listing Page",
    description: "Grid or card-based catalog for academic programs, departments, or facilities.",
    icon: "BookOpen"
  },
  {
    type: "table",
    label: "Table / Data Page",
    description: "Data-driven page with custom columns, rows, fees, and tabular datasets.",
    icon: "FileSpreadsheet"
  },
  {
    type: "directory",
    label: "Directory Page",
    description: "People directory for faculty, leadership, research scholars, and staff.",
    icon: "Users"
  },
  {
    type: "gallery",
    label: "Gallery Page",
    description: "Interactive visual photo albums, campus videos, and lightbox views.",
    icon: "Image"
  },
  {
    type: "news",
    label: "News Page",
    description: "University press releases, achievements, updates, and featured news feeds.",
    icon: "Newspaper"
  },
  {
    type: "events",
    label: "Events Page",
    description: "Upcoming campus seminars, conferences, workshops, and registrations.",
    icon: "Calendar"
  },
  {
    type: "faq",
    label: "FAQ Page",
    description: "Categorized searchable frequently asked questions with accordion toggles.",
    icon: "MessageSquare"
  },
  {
    type: "custom",
    label: "Custom Page",
    description: "Blank canvas page with full freedom to assemble any components.",
    icon: "Sparkles"
  }
];

export const SECTION_COMPONENT_DEFINITIONS: Array<{
  type: SectionType;
  label: string;
  description: string;
  category: "Basic" | "Media & Layout" | "Data & Tables" | "People & Directories" | "Interactive";
  icon: string;
}> = [
  { type: "hero", label: "Hero Banner", description: "Eye-catching banner with headline, subtitle, buttons & background media.", category: "Basic", icon: "Sparkles" },
  { type: "rich-text", label: "Rich Text", description: "Structured body text, headings, quotes, and paragraphs.", category: "Basic", icon: "FileText" },
  { type: "image", label: "Image Showcase", description: "Full-width or framed responsive image with caption & alt text.", category: "Media & Layout", icon: "Image" },
  { type: "image-text", label: "Image + Text", description: "Split 2-column layout with picture and narrative side-by-side.", category: "Media & Layout", icon: "Layers" },
  { type: "cards", label: "Feature Cards Grid", description: "Grid of cards with icons, badges, descriptions, and action links.", category: "Media & Layout", icon: "Grid" },
  { type: "statistics", label: "Statistics / Numbers", description: "Key achievement metrics, placement stats, or counts.", category: "Data & Tables", icon: "BarChart3" },
  { type: "timeline", label: "Timeline / Milestones", description: "Chronological journey, year-by-year university roadmap.", category: "Data & Tables", icon: "Clock" },
  { type: "accordion", label: "Accordion / Collapsible", description: "Expandable content sections for detailed info.", category: "Interactive", icon: "ChevronDown" },
  { type: "faq", label: "FAQ Accordion", description: "Searchable Q&A accordion list for student queries.", category: "Interactive", icon: "MessageSquare" },
  { type: "gallery", label: "Photo / Campus Gallery", description: "Responsive photo grid with modal preview & captions.", category: "Media & Layout", icon: "Image" },
  { type: "person-profile", label: "Person Profile Card", description: "Detailed bio card for Chancellor, Vice Chancellor, or Dean.", category: "People & Directories", icon: "User" },
  { type: "faculty-directory", label: "Faculty Directory", description: "Filterable faculty grid with qualifications, contact & profiles.", category: "People & Directories", icon: "GraduationCap" },
  { type: "leadership-directory", label: "Leadership Directory", description: "Board of governors, trustees, directors & deans directory.", category: "People & Directories", icon: "Award" },
  { type: "department-listing", label: "Department Listing", description: "List of academic departments, head of departments, and links.", category: "People & Directories", icon: "Building" },
  { type: "course-listing", label: "Course / Programs Listing", description: "Programs offered with intake, duration, eligibility, and syllabus.", category: "Data & Tables", icon: "BookOpen" },
  { type: "news-listing", label: "News Feed", description: "Recent university news articles and press announcements.", category: "Basic", icon: "Newspaper" },
  { type: "events-listing", label: "Events Feed", description: "Upcoming conferences, campus festivals, and workshops.", category: "Basic", icon: "Calendar" },
  { type: "table", label: "Dynamic Table", description: "Custom data table with editable columns, rows, links, and badges.", category: "Data & Tables", icon: "FileSpreadsheet" },
  { type: "downloads", label: "Downloads / Resources", description: "Downloadable PDF handbooks, brochures, and application forms.", category: "Data & Tables", icon: "Download" },
  { type: "video", label: "Video Showcase", description: "Embedded campus tour, YouTube video, or HTML5 video player.", category: "Media & Layout", icon: "PlaySquare" },
  { type: "contact-form", label: "Contact & Enquiry Form", description: "Interactive enquiry lead capture form with fields.", category: "Interactive", icon: "Send" },
  { type: "cta", label: "Call to Action (CTA)", description: "High-contrast action banner prompting admissions or visit.", category: "Interactive", icon: "Megaphone" },
  { type: "testimonials", label: "Testimonials / Student Reviews", description: "Student, alumni, and recruiter quote cards.", category: "Basic", icon: "Quote" },
  { type: "custom", label: "Custom HTML / Embed", description: "Custom HTML code, widgets, or third-party embeds.", category: "Basic", icon: "Code" }
];
