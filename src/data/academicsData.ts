export interface AcademicFlexibilityItem {
  id: string;
  key: string;
  title: string;
  desc: string;
  highlights: string[];
}

export const INITIAL_ACADEMIC_FLEXIBILITIES: AcademicFlexibilityItem[] = [
  {
    id: "flex-1",
    title: "Acceleration and Deceleration",
    key: "acceleration",
    desc: "Allows students to adjust their academic pace. Capable students can accelerate their degree program by taking extra credits (up to 28 per semester) to graduate in 3.5 years or opt for deceleration (fewer credits) to spread the load without failing grades.",
    highlights: ["Fast-track graduation in 3.5 years", "Decelerated paths to manage complex core modules", "Credit load variance between 16 to 28 credits per term"]
  },
  {
    id: "flex-2",
    title: "Change of Branch",
    key: "change-branch",
    desc: "Offers a second chance to slide into a branch of choice. High-performing students (typically top 10% based on first-year CGPA) with no backlogs can apply for branch transfer after completing their second semester.",
    highlights: ["Merit-based allocations after Year 1", "CGPA threshold of 8.5 or above", "Zero pending backlogs constraint"]
  },
  {
    id: "flex-3",
    title: "Choice Based Credit System (CBCS)",
    key: "cbcs",
    desc: "Gives students the freedom to choose their own curriculum paths. Under the Choice Based Credit System, scholars can choose professional core electives, interdisciplinary open electives, and humanities courses across departments.",
    highlights: ["Choice-driven learning framework", "Interdisciplinary open electives basket", "Syllabus aligned with global Credit accumulation systems"]
  },
  {
    id: "flex-4",
    title: "Double Major",
    key: "double-major",
    desc: "Enables students to gain multi-disciplinary expertise. An engineering student can earn a Double Major by acquiring additional credits in a second engineering discipline, broadening career horizons significantly.",
    highlights: ["Degrees in two distinct major categories", "Extended credit scope", "Enhances placement prospects in hybrid sectors"]
  },
  {
    id: "flex-5",
    title: "Dual Degree",
    key: "dual-degree",
    desc: "Fast-tracks higher education. Students can enroll in integrated dual-degree programs to complete a B.Tech + M.Tech in 5 years or BBA + MBA in a structured, accelerated timeline, saving one full academic year.",
    highlights: ["B.Tech + M.Tech in 5 years", "Integrated course structures", "Saves time and fee costs"]
  },
  {
    id: "flex-6",
    title: "Honors Degree",
    key: "honors",
    desc: "Promotes advanced study and research. Outstanding students can opt for an Honors track in their parent department. This requires completing additional advanced theory courses and a minor research dissertation.",
    highlights: ["Awarded as 'B.Tech (Honours)'", "Dedicated advanced research dissertation", "High eligibility threshold (CGPA > 8.0)"]
  },
  {
    id: "flex-7",
    title: "Minor Degree",
    key: "minor",
    desc: "Adds a secondary stream of expertise. Students can take a set of 5-6 courses from another department (e.g. ECE student completing minor in CSE) to gain a minor degree along with their primary branch.",
    highlights: ["Cross-discipline skillset certification", "Prepares students for hybrid jobs (e.g. Bio-informatics)", "Structured credit tracks alongside primary majors"]
  },
  {
    id: "flex-8",
    title: "Special Purpose Semesters",
    key: "special-sem",
    desc: "Dedicated time for out-of-classroom learning. Students can spend a complete semester (typically in Year 4) doing a full-time Industry Internship, a Semester Abroad Program (SAP) at a global university, or incubating a startup on campus.",
    highlights: ["6-Month full-time industrial placement", "Semester Abroad programs (SAP) at partner universities", "Campus startup incubator support credits"]
  },
  {
    id: "flex-9",
    title: "Specialization",
    key: "specialization",
    desc: "Deepens focus in high-demand fields. CSE students can choose targeted specializations (like Cyber Security, Data Science, AI & ML) by taking a set of matching elective courses and lab projects starting in their third year.",
    highlights: ["Focused tracks within parent branch", "Industry-aligned specific curricula", "Prepares for specialized roles directly out of university"]
  },
  {
    id: "flex-10",
    title: "Summer Term Registration",
    key: "summer-term",
    desc: "Provides a credit recovery pathway. Conducted during the summer break, this term allows students with backlogs or missed attendance to re-register for courses, complete examinations, and catch up with their cohorts.",
    highlights: ["Fast-track backlog clearance", "Accelerated credit recovery", "Regular classes and laboratory cycles over 6 weeks"]
  }
];

// ==========================================
// GRADING SYSTEM DATA
// ==========================================

export interface GradingRow {
  perf?: string;
  grade: string;
  gp: string;
  range?: string;
  calc?: string;
}

export interface SchoolGrading {
  title: string;
  absolute: GradingRow[];
  relative: GradingRow[];
}

export type GradingSystemConfig = Record<string, SchoolGrading>;

export const INITIAL_GRADING_SYSTEM: GradingSystemConfig = {
  computing: {
    title: "School of Computing Sciences Grading Schema",
    absolute: [
      { perf: "Outstanding", grade: "O", gp: "10", range: "90 - 100" },
      { perf: "Excellent", grade: "A+", gp: "9", range: "80 - 89" },
      { perf: "Very Good", grade: "A", gp: "8", range: "70 - 79" },
      { perf: "Good", grade: "B+", gp: "7", range: "60 - 69" },
      { perf: "Above Average", grade: "B", gp: "6", range: "50 - 59" },
      { perf: "Average", grade: "C", gp: "5", range: "46 - 49" },
      { perf: "Pass", grade: "P", gp: "4", range: "40 - 45" },
      { perf: "Fail", grade: "F", gp: "0", range: "0 - 39" },
      { perf: "Absent", grade: "AB", gp: "0", range: "Absent" }
    ],
    relative: [
      { grade: "O", gp: "10", calc: "total marks >= 90% and total marks >= mean + 1.50σ" },
      { grade: "A+", gp: "9", calc: "µ+0.50σ <= total marks < µ+1.50σ" },
      { grade: "A", gp: "8", calc: "µ <= total marks < µ+0.50σ" },
      { grade: "B+", gp: "7", calc: "µ-0.50σ <= total marks < µ" },
      { grade: "B", gp: "6", calc: "µ-1.00σ <= total marks < µ-0.50σ" },
      { grade: "C", gp: "5", calc: "µ-1.25σ <= total marks < µ-1.00σ" },
      { grade: "P", gp: "4", calc: "µ-1.50σ <= total marks < µ-1.25σ or >= 40" },
      { grade: "F", gp: "0", calc: "total marks < µ-1.50σ or total marks <= 39" },
      { grade: "AB", gp: "0", calc: "Absent" }
    ]
  },
  engineering: {
    title: "School of Engineering Grading Schema",
    absolute: [
      { perf: "Outstanding", grade: "O", gp: "10", range: "90 - 100" },
      { perf: "Excellent", grade: "A+", gp: "9", range: "80 - 89" },
      { perf: "Very Good", grade: "A", gp: "8", range: "70 - 79" },
      { perf: "Good", grade: "B+", gp: "7", range: "60 - 69" },
      { perf: "Above Average", grade: "B", gp: "6", range: "50 - 59" },
      { perf: "Average", grade: "C", gp: "5", range: "46 - 49" },
      { perf: "Pass", grade: "P", gp: "4", range: "40 - 45" },
      { perf: "Fail", grade: "F", gp: "0", range: "0 - 39" },
      { perf: "Absent", grade: "AB", gp: "0", range: "Absent" }
    ],
    relative: [
      { grade: "O", gp: "10", calc: "total marks >= 90% and total marks >= mean + 1.50σ" },
      { grade: "A+", gp: "9", calc: "µ+0.50σ <= total marks < µ+1.50σ" },
      { grade: "A", gp: "8", calc: "µ <= total marks < µ+0.50σ" },
      { grade: "B+", gp: "7", calc: "µ-0.50σ <= total marks < µ" },
      { grade: "B", gp: "6", calc: "µ-1.00σ <= total marks < µ-0.50σ" },
      { grade: "C", gp: "5", calc: "µ-1.25σ <= total marks < µ-1.00σ" },
      { grade: "P", gp: "4", calc: "µ-1.50σ <= total marks < µ-1.25σ or >= 40" },
      { grade: "F", gp: "0", calc: "total marks < µ-1.50σ or total marks <= 39" },
      { grade: "AB", gp: "0", calc: "Absent" }
    ]
  },
  business: {
    title: "School of Business & Management Grading Schema",
    absolute: [
      { perf: "Outstanding", grade: "O", gp: "10", range: "90 - 100" },
      { perf: "Excellent", grade: "A+", gp: "9", range: "80 - 89" },
      { perf: "Very Good", grade: "A", gp: "8", range: "70 - 79" },
      { perf: "Good", grade: "B+", gp: "7", range: "60 - 69" },
      { perf: "Above Average", grade: "B", gp: "6", range: "50 - 59" },
      { perf: "Fail", grade: "F", gp: "0", range: "0 - 49" },
      { perf: "Absent", grade: "AB", gp: "0", range: "Absent" }
    ],
    relative: [
      { grade: "O", gp: "10", calc: "total marks >= 90% and total marks >= mean + 1.50σ" },
      { grade: "A+", gp: "9", calc: "µ+0.50σ <= total marks < µ+1.50σ" },
      { grade: "A", gp: "8", calc: "µ <= total marks < µ+0.50σ" },
      { grade: "B+", gp: "7", calc: "µ-0.50σ <= total marks < µ" },
      { grade: "B", gp: "6", calc: "µ-1.00σ <= total marks < µ-0.50σ" },
      { grade: "F", gp: "0", calc: "total marks < µ-1.50σ or total marks <= 49" },
      { grade: "AB", gp: "0", calc: "Absent" }
    ]
  }
};

// ==========================================
// AWARD OF DEGREES DATA
// ==========================================

export interface DegreeGradeTier {
  min: number;
  max: number;
  class: string;
  color: string;
  glow?: string;
  note?: string;
}

export interface SchoolDegreeAward {
  title: string;
  desc: string;
  grades: DegreeGradeTier[];
}

export type AwardOfDegreesConfig = Record<string, SchoolDegreeAward>;

export const INITIAL_AWARD_OF_DEGREES: AwardOfDegreesConfig = {
  computing: {
    title: "School of Computing Sciences (B.Tech, M.Tech, MCA, Ph.D)",
    desc: "Degree classification requirements for Computing Sciences programs:",
    grades: [
      { min: 5.25, max: 5.75, class: "Pass Class", color: "bg-gray-50 border-gray-200 text-gray-700", glow: "hover:bg-gray-100/50 hover:border-gray-300" },
      { min: 5.75, max: 6.75, class: "Second Class", color: "bg-blue-50/40 border-blue-100 text-blue-800", glow: "hover:bg-blue-50 hover:border-blue-300" },
      { min: 6.75, max: 7.75, class: "First Class", color: "bg-indigo-50/40 border-indigo-100 text-indigo-800", glow: "hover:bg-indigo-50 hover:border-indigo-300" },
      { min: 7.75, max: 10.0, class: "First Class with Distinction", color: "bg-rose-50/40 border-rose-100 text-[#D4AF37]", glow: "hover:bg-rose-50 hover:border-[#D4AF37]", note: "Fulfill all program requirements in specified minimum years duration and pass all courses in first attempt." }
    ]
  },
  engineering: {
    title: "School of Engineering (B.Tech, M.Tech, Ph.D)",
    desc: "Degree classification requirements for Engineering programs:",
    grades: [
      { min: 5.25, max: 5.75, class: "Pass Class", color: "bg-gray-50 border-gray-200 text-gray-700", glow: "hover:bg-gray-100/50 hover:border-gray-300" },
      { min: 5.75, max: 6.75, class: "Second Class", color: "bg-blue-50/40 border-blue-100 text-blue-800", glow: "hover:bg-blue-50 hover:border-blue-300" },
      { min: 6.75, max: 7.75, class: "First Class", color: "bg-indigo-50/40 border-indigo-100 text-indigo-800", glow: "hover:bg-indigo-50 hover:border-indigo-300" },
      { min: 7.75, max: 10.0, class: "First Class with Distinction", color: "bg-rose-50/40 border-rose-100 text-[#D4AF37]", glow: "hover:bg-rose-50 hover:border-[#D4AF37]", note: "Fulfill all program requirements in specified minimum years duration and pass all courses in first attempt." }
    ]
  },
  business: {
    title: "School of Business & Management (MBA)",
    desc: "Degree classification requirements for Business & Management programs:",
    grades: [
      { min: 5.5, max: 5.75, class: "Pass Class", color: "bg-gray-50 border-gray-200 text-gray-700", glow: "hover:bg-gray-100/50 hover:border-gray-300" },
      { min: 5.75, max: 6.75, class: "Second Class", color: "bg-blue-50/40 border-blue-100 text-blue-800", glow: "hover:bg-blue-50 hover:border-blue-300" },
      { min: 6.75, max: 7.75, class: "First Class", color: "bg-indigo-50/40 border-indigo-100 text-indigo-800", glow: "hover:bg-indigo-50 hover:border-indigo-300" },
      { min: 7.75, max: 10.0, class: "First Class with Distinction", color: "bg-rose-50/40 border-rose-100 text-[#D4AF37]", glow: "hover:bg-rose-50 hover:border-[#D4AF37]", note: "Fulfill all program requirements in specified minimum years duration and pass all courses in first attempt." }
    ]
  }
};

// ==========================================
// RULES & REGULATIONS DATA
// ==========================================

export interface AcademicRuleItem {
  id: string;
  title: string;
  desc: string;
  iconName: string;
}

export const INITIAL_ACADEMIC_RULES: AcademicRuleItem[] = [
  {
    id: "rule-1",
    title: "Attendance",
    desc: "Minimum 75% attendance is compulsory in each subject to qualify for final theory/laboratory exams.",
    iconName: "Clock"
  },
  {
    id: "rule-2",
    title: "Dress Code",
    desc: "Proper formal attire and mandatory wearing of ID cards at all times inside campus blocks.",
    iconName: "UserCheck"
  },
  {
    id: "rule-3",
    title: "Integrity",
    desc: "Zero tolerance for cheating, plagiarism, copying lab reports, or possessing prohibited devices in test halls.",
    iconName: "ShieldAlert"
  },
  {
    id: "rule-4",
    title: "Conduct",
    desc: "Absolute zero-tolerance ragging policy on campus. Offenders face immediate suspension/legal actions.",
    iconName: "Scale"
  },
  {
    id: "rule-5",
    title: "Deadlines",
    desc: "Course registration and examination enrollments must be completed before the semester commencement deadlines.",
    iconName: "CalendarRange"
  }
];

// ==========================================
// TEACHING & EVALUATION DATA
// ==========================================

export interface EvaluationBreakdownItem {
  id: string;
  title: string;
  weight: string;
  desc: string;
  glow?: string;
}

export interface TeachingEvaluationConfig {
  ciePercentage: number;
  seePercentage: number;
  title: string;
  desc: string;
  items: EvaluationBreakdownItem[];
}

export const INITIAL_TEACHING_EVALUATION: TeachingEvaluationConfig = {
  ciePercentage: 40,
  seePercentage: 60,
  title: "Evaluation Framework (CIE vs SEE)",
  desc: "CCIT follows an Outcome-Based Education (OBE) system with a structured evaluation plan divided into Continuous Internal Evaluation (CIE) and Semester End Examinations (SEE).",
  items: [
    {
      id: "eval-1",
      title: "Mid-Term Examinations",
      weight: "20%",
      desc: "Two centralized internal exams per semester testing core subject knowledge blocks.",
      glow: "hover:border-blue-200"
    },
    {
      id: "eval-2",
      title: "Continuous Assessment",
      weight: "10%",
      desc: "Regular assignments, classroom quizzes, case-studies, and active seminar participations.",
      glow: "hover:border-indigo-200"
    },
    {
      id: "eval-3",
      title: "Laboratory & Internals",
      weight: "10%",
      desc: "Hands-on lab evaluations, project progress reviews, and viva-voce assessments.",
      glow: "hover:border-teal-200"
    },
    {
      id: "eval-4",
      title: "Semester End Examinations",
      weight: "60%",
      desc: "Centralized final examinations testing comprehensive curriculum mastery at the end of each term.",
      glow: "hover:border-amber-200"
    }
  ]
};

// ==========================================
// ACADEMIC CALENDAR DATA
// ==========================================

export interface AcademicCalendarTerm {
  id: string;
  year: string;
  title: string;
  commencementDate: string;
  midTerm1Date: string;
  midTerm2Date: string;
  lastInstructionDay: string;
  practicalExamsDate: string;
  theoryExamsDate: string;
  vacationDate: string;
  pdfUrl?: string;
}

export const INITIAL_ACADEMIC_CALENDAR_TERMS: AcademicCalendarTerm[] = [
  {
    id: "cal-2026-27",
    year: "2026-27",
    title: "Academic Calendar 2026-27 (Odd & Even Semesters)",
    commencementDate: "July 14, 2026",
    midTerm1Date: "September 15 - 20, 2026",
    midTerm2Date: "November 10 - 15, 2026",
    lastInstructionDay: "November 28, 2026",
    practicalExamsDate: "December 01 - 08, 2026",
    theoryExamsDate: "December 10 - 24, 2026",
    vacationDate: "December 25, 2026 - January 05, 2027",
    pdfUrl: "/academic-calendar-2026-27.pdf"
  },
  {
    id: "cal-2025-26",
    year: "2025-26",
    title: "Academic Calendar 2025-26 (Odd & Even Semesters)",
    commencementDate: "July 15, 2025",
    midTerm1Date: "September 16 - 21, 2025",
    midTerm2Date: "November 11 - 16, 2025",
    lastInstructionDay: "November 29, 2025",
    practicalExamsDate: "December 02 - 09, 2025",
    theoryExamsDate: "December 11 - 25, 2025",
    vacationDate: "December 26, 2025 - January 06, 2026",
    pdfUrl: "/academic-calendar-2025-26.pdf"
  }
];
