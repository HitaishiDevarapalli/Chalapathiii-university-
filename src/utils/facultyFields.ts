import type { FacultyMember } from "../context/DataContext";

export interface FacultyFieldOption {
  key: string;
  label: string;
}

export interface FacultyFieldSource {
  title?: string;
  designation?: string;
  edu?: string;
  qualification?: string;
  interests?: string;
  specialization?: string;
  phone?: string;
  email?: string;
  experience?: string;
  department?: string;
  administrativeDuties?: string;
  conferencesAttended?: string;
  conferencesOrganized?: string;
  teachingSubjects?: string[];
  publications?: Record<string, string>;
  publicationDetails?: Record<string, string>[];
  additionalDetails?: Record<string, string>;
}

const standardFields: FacultyFieldOption[] = [
  { key: "title", label: "Designation" },
  { key: "edu", label: "Qualification" },
  { key: "interests", label: "Areas of Research" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "experience", label: "Experience" },
  { key: "department", label: "Department" },
  { key: "administrativeDuties", label: "Administrative Duties" },
  { key: "conferencesAttended", label: "Conferences / Workshops Attended" },
  { key: "conferencesOrganized", label: "Conferences / Workshops Organized" },
  { key: "publicationDetails", label: "Detailed Publications" }
];

export const facultyFieldOptions = (members: FacultyFieldSource[]): FacultyFieldOption[] => {
  const options = new Map(standardFields.map(field => [field.key, field]));
  members.forEach(member => {
    (member.teachingSubjects || []).forEach((_, index) => {
      const key = `teaching:${index}`;
      options.set(key, { key, label: `Subject Teaching ${index + 1}` });
    });
    Object.keys(member.publications || {}).forEach(label => {
      const key = `publication:${label}`;
      options.set(key, { key, label });
    });
    Object.keys(member.additionalDetails || {}).filter(label => {
      const normalized = label.toLowerCase().replace(/[^a-z0-9]/g, "");
      return !normalized.startsWith("subjectteaching") && !normalized.startsWith("publications");
    }).forEach(label => {
      const key = `additional:${label}`;
      options.set(key, { key, label });
    });
  });
  return [...options.values()];
};

export const facultyFieldValue = (member: FacultyFieldSource, key: string): string => {
  if (key.startsWith("teaching:")) return member.teachingSubjects?.[Number(key.slice(9))] || "";
  if (key.startsWith("publication:")) return member.publications?.[key.slice(12)] || "";
  if (key.startsWith("additional:")) return member.additionalDetails?.[key.slice(11)] || "";
  if (key === "publicationDetails") return member.publicationDetails?.length ? `${member.publicationDetails.length} publication records` : "";
  const aliases: Record<string, string[]> = {
    title: ["title", "designation"],
    edu: ["edu", "qualification"],
    interests: ["interests", "specialization"]
  };
  const value = (aliases[key] || [key]).map(name => member[name as keyof typeof member]).find(item => typeof item === "string");
  return typeof value === "string" ? value : "";
};

export const facultyProfileFields = (member: FacultyMember, selectedFields?: string[]) => {
  const options = facultyFieldOptions([member]);
  const allowed = selectedFields !== undefined ? new Set(selectedFields) : null;
  const values = new Map<string, { label: string; value: string }>();
  options.forEach(option => {
    if (option.key === "publicationDetails") return;
    const value = facultyFieldValue(member, option.key).trim();
    if (value) values.set(option.label, { label: option.label, value });
  });
  const fields = [...values.entries()].map(([label, field]) => ({ ...field, key: options.find(option => option.label === label)?.key || label }));
  return allowed ? fields.filter(field => allowed.has(field.key)) : fields;
};
