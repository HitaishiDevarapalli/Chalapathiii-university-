// ═══════════════════════════════════════════════
// App-wide Constants — Chalapathi University
// ═══════════════════════════════════════════════

// ── Brand Colors ────────────────────────────────
export const COLORS = {
  navy: "#081A36",
  red: "#D4AF37",
  redHover: "#b71612",
  white: "#FFFFFF",
  lightGray: "#F7F7F7",
  darkGray: "#222222",
  blue: "#0B3D91",
  border: "#E5E7EB",
  borderLight: "#F0F0F0",
  textMuted: "#555555",
  textLight: "#888888",
  textSlate: "#94A3B8",
} as const;

// ── Layout Dimensions ───────────────────────────
export const LAYOUT = {
  maxWidth: "1340px",
  topBarHeight: "40px",
  headerHeight: "85px",
  headerScrolledHeight: "70px",
  heroHeight: "720px",
  statsRadius: "18px",
} as const;

// ── Routes ──────────────────────────────────────
export const ROUTES = {
  home: "/",
  about: "/about",
  admissions: "/admissions",
  apply: "/admissions/apply",
  academics: "/#schools",
  research: "/research",
  schools: "/#schools",
  campusLife: "/campus-life",
  placements: "/placements",
  international: "/international",
  contact: "/contact",
  erp: "/erp",
  news: "/news",
  alumni: "/alumni",
  careers: "/careers",
  studentLogin: "/erp?role=student",
  facultyLogin: "/erp?role=faculty",
} as const;

// ── External Links ──────────────────────────────
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/chalapathiit/",
  instagram: "https://www.instagram.com/chalapathi.university.official/",
  linkedin: "https://www.linkedin.com/school/chalapathi-ciet-lam/",
  youtube: "https://www.youtube.com/channel/UCRoNvDzGs87yXFL6TAIH44A",
} as const;

// ── Contact Details ─────────────────────────────
export const CONTACT = {
  phone: "+91 863-2345678",
  email: "info@cityuniversity.edu.in",
  admissionsEmail: "admissions@chalapathiuniversity.edu.in",
  address: "Guntur, Andhra Pradesh - 522034, India",
  shortAddress: "Guntur, Andhra Pradesh, India",
} as const;

// ── University Info ─────────────────────────────
export const UNIVERSITY = {
  name: "Chalapathi University",
  shortName: "CITY",
  fullName: "CiTY Chalapathi University",
  tagline: "LEARN • INNOVATE • LEAD",
  motto: "Learn Today. Lead Tomorrow.",
  description: "Empowering minds. Inspiring futures. Building a better world through education, research & innovation.",
  year: 2026,
} as const;
