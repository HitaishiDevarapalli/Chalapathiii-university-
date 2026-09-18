export interface SearchItem {
  title: string;
  category: "Programs" | "Admissions" | "Campus Life" | "Placements" | "Research" | "Administration" | "Institutional" | "Information" | "News & Events";
  to: string;
  keywords: string[];
  icon: string;
}

export const searchIndex: SearchItem[] = [
  // Programs
  {
    title: "School of Engineering & Programs",
    category: "Programs",
    to: "/academics/programmes",
    keywords: ["engineering", "engg", "civil", "ece", "eee", "mechanical", "mtech", "btech", "phd", "academics"],
    icon: "GraduationCap"
  },
  {
    title: "B.Tech. Computer Science & Engineering (CSE)",
    category: "Programs",
    to: "/academics/btech-cse",
    keywords: ["cse", "computer science", "software", "programming", "coding", "computers", "btech cse"],
    icon: "Code"
  },
  {
    title: "M.Tech. Computer Science & Engineering",
    category: "Programs",
    to: "/academics/mtech-cse",
    keywords: ["mtech cse", "mtech computer science", "postgraduate computer science"],
    icon: "Code"
  },
  {
    title: "MCA (Master of Computer Applications)",
    category: "Programs",
    to: "/academics/mca",
    keywords: ["mca", "master of computer applications", "mca program", "computer application"],
    icon: "Laptop"
  },
  {
    title: "Ph.D. Computer Science & Engineering",
    category: "Programs",
    to: "/academics/phd-cse",
    keywords: ["phd cse", "doctorate cse", "phd computer science"],
    icon: "SearchCode"
  },
  {
    title: "B.Tech. CSE (Artificial Intelligence)",
    category: "Programs",
    to: "/academics/btech-cse-ai-ml",
    keywords: ["ai", "cse ai", "artificial intelligence", "intelligent systems"],
    icon: "Cpu"
  },
  {
    title: "B.Tech. AI & Machine Learning (AIML)",
    category: "Programs",
    to: "/academics/btech-aiml",
    keywords: ["aiml", "ml", "machine learning", "neural networks", "deep learning"],
    icon: "Brain"
  },
  {
    title: "M.Tech. CSE (AI & ML)",
    category: "Programs",
    to: "/academics/mtech-aiml",
    keywords: ["mtech aiml", "mtech ml", "postgraduate aiml"],
    icon: "BrainCircuit"
  },
  {
    title: "B.Tech. CSE (Data Science)",
    category: "Programs",
    to: "/academics/btech-cse-data-science",
    keywords: ["data science", "data", "ds", "analytics", "big data"],
    icon: "Database"
  },
  {
    title: "B.Tech. CSE (Cyber Security)",
    category: "Programs",
    to: "/academics/btech-cse-cyber-security",
    keywords: ["cyber security", "security", "hacking", "cyber", "network security"],
    icon: "ShieldAlert"
  },
  {
    title: "B.Tech. Electronics and Communication Engineering (ECE)",
    category: "Programs",
    to: "/academics/btech-ece",
    keywords: ["ece", "electronics", "communication", "semiconductor", "hardware"],
    icon: "Radio"
  },
  {
    title: "M.Tech. VLSI and Embedded Systems Design",
    category: "Programs",
    to: "/academics/mtech-vlsi",
    keywords: ["vlsi", "embedded", "chip design", "microcontrollers"],
    icon: "CircuitBoard"
  },
  {
    title: "Ph.D. Electronics and Communication Engineering",
    category: "Programs",
    to: "/academics/phd-ece",
    keywords: ["phd ece", "doctorate ece", "phd electronics"],
    icon: "SearchCode"
  },
  {
    title: "B.Tech. Civil Engineering",
    category: "Programs",
    to: "/academics/btech-civil",
    keywords: ["civil", "construction", "building", "infrastructure", "structural"],
    icon: "Building"
  },
  {
    title: "M.Tech. Structural Engineering",
    category: "Programs",
    to: "/academics/mtech-structural",
    keywords: ["mtech structural", "structural engineering", "concrete design"],
    icon: "Hammer"
  },
  {
    title: "Ph.D. Structural Engineering",
    category: "Programs",
    to: "/academics/phd-structural",
    keywords: ["phd structural", "doctorate structural", "phd civil"],
    icon: "SearchCode"
  },
  {
    title: "Applied Mathematics & Computational Sciences",
    category: "Programs",
    to: "/academics/applied-sciences",
    keywords: ["applied mathematics", "mathematics", "computational sciences", "math", "basic science", "humanities"],
    icon: "Calculator"
  },
  {
    title: "Engineering Physics & Material Sciences",
    category: "Programs",
    to: "/academics/engineering-physics",
    keywords: ["engineering physics", "physics", "material sciences", "semiconductor", "basic science"],
    icon: "Atom"
  },
  {
    title: "Engineering Chemistry & Environmental Science",
    category: "Programs",
    to: "/academics/engineering-chemistry",
    keywords: ["engineering chemistry", "chemistry", "environmental science", "basic science"],
    icon: "FlaskConical"
  },
  {
    title: "English & Professional Communication",
    category: "Programs",
    to: "/academics/humanities-communication",
    keywords: ["english", "humanities", "communication", "professional communication", "soft skills"],
    icon: "BookOpen"
  },
  {
    title: "MBA (Master of Business Administration)",
    category: "Programs",
    to: "/academics/mba",
    keywords: ["mba", "business", "management", "administration", "marketing", "finance", "hr"],
    icon: "Briefcase"
  },
  {
    title: "Pharmacy Programs",
    category: "Programs",
    to: "/academics/programmes",
    keywords: ["pharmacy", "pharma", "b.pharm", "m.pharm", "pharmacology", "medicine", "drugs"],
    icon: "Pill"
  },

  // Admissions
  {
    title: "Admissions Information & Procedures 2026",
    category: "Admissions",
    to: "/admissions",
    keywords: ["admissions", "admission 2026", "enrollment", "apply now", "intake"],
    icon: "UserPlus"
  },
  {
    title: "Online Application Form (Apply Now)",
    category: "Admissions",
    to: "/admissions/apply",
    keywords: ["apply", "registration", "enrol", "fill application", "sign up"],
    icon: "FileSignature"
  },
  {
    title: "Fee Structure",
    category: "Admissions",
    to: "/admissions/fees",
    keywords: ["fees", "fee structure", "tuition cost", "hostel fee", "payment"],
    icon: "CreditCard"
  },
  {
    title: "Scholarship Schemes",
    category: "Admissions",
    to: "/admissions/scholarships",
    keywords: ["scholarship", "scholarships", "waiver", "concession", "financial aid", "merit scholarship"],
    icon: "Award"
  },

  // Campus Life
  {
    title: "Campus Life & Overview",
    category: "Campus Life",
    to: "/campus-life",
    keywords: ["campus", "campus life", "virtual tour", "facilities", "canteen", "cafeteria"],
    icon: "Compass"
  },
  {
    title: "Hostel Facilities",
    category: "Campus Life",
    to: "/campus-life/hostels",
    keywords: ["hostel", "hostels", "dormitory", "accommodation", "room", "mess", "food"],
    icon: "Home"
  },
  {
    title: "Central Library",
    category: "Campus Life",
    to: "/campus-life/library",
    keywords: ["library", "books", "reading room", "digital library", "journals", "study space"],
    icon: "BookOpen"
  },
  {
    title: "Sports Facilities & Gym",
    category: "Campus Life",
    to: "/campus-life/sports",
    keywords: ["sports", "gym", "play", "ground", "cricket", "basketball", "athletics", "fitness"],
    icon: "Trophy"
  },
  {
    title: "Transportation Facilities",
    category: "Campus Life",
    to: "/campus-life/transportation",
    keywords: ["transport", "bus", "transportation", "route", "gps bus", "travel"],
    icon: "Bus"
  },
  {
    title: "Student Clubs & Societies",
    category: "Campus Life",
    to: "/campus-life/clubs",
    keywords: ["club", "clubs", "society", "extracurricular", "cultural", "technical club"],
    icon: "Users"
  },
  {
    title: "Smart Classrooms",
    category: "Campus Life",
    to: "/campus-life/smart-classrooms",
    keywords: ["smart classrooms", "classrooms", "ict", "projector", "lecture hall"],
    icon: "Tv"
  },
  {
    title: "Laboratories & Infrastructure",
    category: "Campus Life",
    to: "/campus-life/laboratories",
    keywords: ["labs", "laboratory", "physics lab", "computer lab", "chemistry lab", "workshop"],
    icon: "FlaskConical"
  },

  // Placements
  {
    title: "Placement Statistics & Records",
    category: "Placements",
    to: "/placements",
    keywords: ["placements", "placement success", "job offers", "packages", "salary", "lpa"],
    icon: "TrendingUp"
  },
  {
    title: "Top Corporate Recruiters",
    category: "Placements",
    to: "/placements",
    keywords: ["recruiters", "corporate partners", "companies", "hiring partners", "tcs", "wipro", "infosys"],
    icon: "Building2"
  },

  // Research
  {
    title: "Research & Innovation",
    category: "Research",
    to: "/research",
    keywords: ["research", "publications", "patents", "journals", "projects", "innovation"],
    icon: "Search"
  },
  {
    title: "Innovation Hub & Incubation Centre",
    category: "Research",
    to: "/campus-life/innovation-hub",
    keywords: ["innovation", "incubation", "startups", "startup cell", "entrepreneurship", "innovation cell"],
    icon: "Lightbulb"
  },

  // Administration
  {
    title: "Governing Board Members",
    category: "Administration",
    to: "/management/board-members",
    keywords: ["board", "governing body", "management", "chancellor", "vice chancellor", "registrar"],
    icon: "ShieldAlert"
  },
  {
    title: "Faculty Profiles",
    category: "Administration",
    to: "/management/faculty",
    keywords: ["faculty", "teachers", "professors", "hod", "teaching staff"],
    icon: "Users"
  },
  {
    title: "Administrative Staff",
    category: "Administration",
    to: "/management/staff",
    keywords: ["staff", "non-teaching staff", "office staff", "administration team"],
    icon: "Contact"
  },

  // News & Events
  {
    title: "Latest News & Ticker Updates",
    category: "News & Events",
    to: "/news",
    keywords: ["news", "announcements", "ticker", "latest updates", "press release"],
    icon: "Megaphone"
  },
  {
    title: "Upcoming Campus Events & Festivals",
    category: "News & Events",
    to: "/news/events",
    keywords: ["events", "festivals", "workshops", "seminars", "cultural meets"],
    icon: "Calendar"
  },

  // Institutional
  {
    title: "Contact Us & Campus Location",
    category: "Institutional",
    to: "/contact",
    keywords: ["contact", "contact us", "location", "address", "phone number", "email", "map"],
    icon: "MapPin"
  },
  {
    title: "About Chalapathi University",
    category: "Institutional",
    to: "/about",
    keywords: ["about", "about university", "history", "accreditation", "rankings", "nirf", "naac"],
    icon: "Info"
  },
  {
    title: "University Genesis & History",
    category: "Institutional",
    to: "/about/genesis",
    keywords: ["genesis", "history", "founders", "educational society", "heritage"],
    icon: "History"
  },
  {
    title: "Vision & Mission",
    category: "Institutional",
    to: "/about/vision",
    keywords: ["vision", "mission", "values", "core principles", "objectives"],
    icon: "Target"
  },
  {
    title: "Leadership Messages",
    category: "Institutional",
    to: "/about/leadership",
    keywords: ["chairman", "vice chancellor", "registrar", "leadership message"],
    icon: "FileText"
  },
  {
    title: "Chalapathi Advantage & Collaborations",
    category: "Institutional",
    to: "/about/advantage",
    keywords: ["advantage", "collaborations", "mous", "international collaborations", "partnerships"],
    icon: "Globe"
  },
  {
    title: "Academic Calendar & Schedules",
    category: "Institutional",
    to: "/academics/calendar",
    keywords: ["academic calendar", "semester plan", "holidays"],
    icon: "CalendarDays"
  },
  {
    title: "Grading System & CGPA Policy",
    category: "Institutional",
    to: "/academics/grading",
    keywords: ["grading system", "results", "examinations", "credits", "cgpa", "sgpa"],
    icon: "CheckSquare"
  }
];
