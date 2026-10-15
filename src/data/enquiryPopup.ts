import type { EnquiryPopupConfig } from "../context/DataContext";
export const INDIAN_STATES = [
  "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra", 
  "Delhi", "Kerala", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal", 
  "Madhya Pradesh", "Other"
];

export const QUALIFICATIONS = [
  "Class 12 / Intermediate", "Graduation / Under Graduate", "Post Graduation", "Diploma", "Other"
];

export const YEARS_OF_PASSING = [
  "2030", "2029", "2028", "2027", "2026", "2025", "2024", "2023", "Before 2023"
];

export const ALL_PROGRAMS = [
  "B.Tech - Computer Science and Engineering",
  "B.Tech - CSE (Data Science)",
  "B.Tech - CSE (Artificial Intelligence)",
  "B.Tech - Artificial Intelligence & Machine Learning",
  "B.Tech - CSE (Cyber Security)",
  "M.Tech - Computer Science and Engineering",
  "M.Tech - CSE (AI & ML)",
  "MCA",
  "Ph.D - Computer Science and Engineering",
  "B.Tech - Electronics and Communication Engineering",
  "M.Tech - VLSI and Embedded Systems Design",
  "Ph.D - Electronics and Communication Engineering",
  "B.Tech - Civil Engineering",
  "M.Tech - Structural Engineering",
  "Ph.D - Structural Engineering",
  "Applied Mathematics & Computational Sciences",
  "Engineering Physics & Material Sciences",
  "Engineering Chemistry & Environmental Science",
  "English & Professional Communication",
  "MBA"
];

export const ENQUIRY_SCHOOLS_DATA = [
  {
    id: "computing",
    title: "SCHOOL OF COMPUTING SCIENCES",
    subtitle: "Engineering Minds for the Digital Future",
    groups: [
      {
        name: "Computer Science & Engineering",
        courses: [
          { level: "UG", name: "B.Tech - Computer Science and Engineering" },
          { level: "PG", name: "M.Tech - Computer Science and Engineering" },
          { level: "PG", name: "MCA" },
          { level: "Ph.D", name: "Ph.D - Computer Science and Engineering" }
        ]
      },
      {
        name: "Data Science",
        courses: [
          { level: "UG", name: "B.Tech - CSE (Data Science)" }
        ]
      },
      {
        name: "Artificial Intelligence",
        courses: [
          { level: "UG", name: "B.Tech - CSE (Artificial Intelligence)" },
          { level: "UG", name: "B.Tech - Artificial Intelligence & Machine Learning" },
          { level: "PG", name: "M.Tech - CSE (AI & ML)" }
        ]
      },
      {
        name: "Cyber Security",
        courses: [
          { level: "UG", name: "B.Tech - CSE (Cyber Security)" }
        ]
      }
    ]
  },
  {
    id: "engineering",
    title: "SCHOOL OF ENGINEERING",
    subtitle: "Engineering Solutions for a Smarter, Stronger Tomorrow",
    groups: [
      {
        name: "Electronics and Communication Engineering",
        courses: [
          { level: "UG", name: "B.Tech - Electronics and Communication Engineering" },
          { level: "PG", name: "M.Tech - VLSI and Embedded Systems Design" },
          { level: "Ph.D", name: "Ph.D - Electronics and Communication Engineering" }
        ]
      },
      {
        name: "Civil Engineering",
        courses: [
          { level: "UG", name: "B.Tech - Civil Engineering" },
          { level: "PG", name: "M.Tech - Structural Engineering" },
          { level: "Ph.D", name: "Ph.D - Structural Engineering" }
        ]
      },
      {
        name: "Basic Science & Humanities",
        courses: []
      }
    ]
  },
  {
    id: "business",
    title: "SCHOOL OF BUSINESS & MANAGEMENT",
    subtitle: "Shaping Visionary Leaders for Tomorrow's Business World",
    groups: [
      {
        name: "Business and Management",
        courses: [
          { level: "PG", name: "MBA" }
        ]
      }
    ]
  }
];

export const FIELD_DEFAULTS = {
  name: { label: "Full Name", placeholder: "Enter your full name", required: true, visible: true },
  mobile: { label: "Mobile Number", placeholder: "Enter 10 digit mobile number", required: true, visible: true },
  email: { label: "Email Address", placeholder: "Enter your email address", required: true, visible: true },
  city: { label: "City", placeholder: "Enter your city", required: true, visible: true },
  state: { label: "State", placeholder: "Select your state", required: true, visible: true, options: INDIAN_STATES },
  qualification: { label: "Qualification", placeholder: "Select qualification", required: true, visible: true, options: QUALIFICATIONS },
  yearOfPassing: { label: "Year of Passing", placeholder: "Select year", required: true, visible: true, options: YEARS_OF_PASSING },
  program: { label: "Interested Program", placeholder: "Select a program (Auto-filled)", required: true, visible: true },
  query: { label: "Any Query", placeholder: "Write your message...", required: false, visible: true }
};
export interface EditableEnquiryConfig extends EnquiryPopupConfig {
  fields: Record<string, { label: string; placeholder: string; required: boolean; visible: boolean; options?: string[] }>;
  logoUrl?: string;
  privacyLinkLabel: string;
  privacyUrl: string;
  mobileFormLabel: string;
  mobileSchoolsLabel: string;
  programsButtonLabel: string;
}
export function resolveEnquiryConfig(base: EnquiryPopupConfig, custom?: Partial<EditableEnquiryConfig>): EditableEnquiryConfig {
  const merged = { ...base, ...custom };
  const fields = Object.fromEntries(Object.entries(FIELD_DEFAULTS).map(([key, value]) => [key, { ...value, ...custom?.fields?.[key] }]));
  return { ...merged, schools: merged.schools ?? ENQUIRY_SCHOOLS_DATA,
    allPrograms: merged.allPrograms ?? ALL_PROGRAMS, privacyLinkLabel: "privacy", privacyUrl: "/privacy-policy",
    mobileFormLabel: "Enquiry Form", mobileSchoolsLabel: "Explore Programs", programsButtonLabel: "Programs ➔", ...custom, fields };
}
