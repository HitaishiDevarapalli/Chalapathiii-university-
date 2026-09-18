export interface SectionMeta {
  id: string;
  title: string;
  enabled: boolean;
  order: number;
}

export const DEFAULT_PROGRAM_SECTIONS: SectionMeta[] = [
  { id: "about", title: "About Program", enabled: true, order: 1 },
  { id: "hodMessage", title: "HOD / Coordinator Message", enabled: true, order: 2 },
  { id: "visionMission", title: "Vision & Mission", enabled: true, order: 3 },
  { id: "peoPoPso", title: "PEOs, POs & PSOs", enabled: true, order: 4 },
  { id: "faculty", title: "Faculty Directory", enabled: true, order: 5 },
  { id: "placements", title: "Placements & Internships", enabled: true, order: 6 },
  { id: "labs", title: "Infrastructure & Labs", enabled: true, order: 7 },
  { id: "achievements", title: "Key Achievements & Accreditations", enabled: true, order: 8 },
  { id: "syllabus", title: "Syllabus & Academic Calendar", enabled: true, order: 9 },
  { id: "library", title: "Department Library & E-Resources", enabled: true, order: 10 },
  { id: "newsletters", title: "News Letters", enabled: true, order: 11 },
  { id: "magazines", title: "Technical Magazines", enabled: true, order: 12 },
  { id: "mou", title: "Memoranda of Understanding (MoU)", enabled: true, order: 13 },
  { id: "research", title: "Research & Development", enabled: true, order: 14 },
  { id: "societies", title: "Professional Societies & Chapters", enabled: true, order: 15 },
  { id: "rollOfHonour", title: "Roll of Honour & Toppers", enabled: true, order: 16 },
  { id: "fundingProjects", title: "Funding Projects & Grants", enabled: true, order: 17 },
  { id: "teachingInnovations", title: "Teaching Innovations by Faculty", enabled: true, order: 18 },
  { id: "eventsAssociation", title: "Events & Department Association", enabled: true, order: 19 }
];

export interface FacultyMember {
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience: string;
  email: string;
  image?: string;
}

export interface LaboratoryItem {
  name: string;
  labCode?: string;
  area?: string;
  equipment: string[];
  software?: string[];
  capacity: string;
  image?: string;
  inCharge?: string;
}

export interface PlacementStat {
  highestPackage: string;
  averagePackage: string;
  placementRate: string;
  topRecruiters: string[];
  placedStudents: {
    name: string;
    company: string;
    package: string;
    role: string;
    image?: string;
  }[];
}

export interface EventItemData {
  title: string;
  date: string;
  type: string;
  venue: string;
  description: string;
  image?: string;
  reportLink?: string;
}

export interface MOUItem {
  partner: string;
  country: string;
  scope: string;
  signedYear: string;
  validity: string;
  logo?: string;
}

export interface FundingProjectItem {
  title: string;
  fundingAgency: string;
  grantAmount: string;
  principalInvestigator: string;
  duration: string;
  status: "Completed" | "Ongoing" | "Sanctioned";
}

export interface ResearchData {
  thrustAreas: string[];
  publicationsCount: number;
  patentsPublished: number;
  patentsGranted: number;
  activeScholars: number;
  keyPublications: {
    title: string;
    journal: string;
    authors: string;
    year: string;
    doi?: string;
  }[];
}

export interface FullProgramData {
  slug: string;
  title: string;
  shortName: string;
  department: string;
  school: string;
  level: "Undergraduate" | "Postgraduate" | "Doctoral";
  degreeType: string;
  duration: string;
  intake: string;
  eligibility: string;
  careerRoles: string[];
  
  // 19 Sections
  about: {
    summary: string;
    highlights: string[];
    objectives: string[];
  };
  hodMessage: {
    hodName: string;
    designation: string;
    qualification: string;
    message: string;
    image?: string;
    email?: string;
  };
  visionMission: {
    vision: string;
    mission: string[];
    coreValues: string[];
  };
  peoPoPso: {
    peos: { id: string; title: string; desc: string }[];
    pos: { id: string; title: string; desc: string }[];
    psos: { id: string; title: string; desc: string }[];
  };
  facultyList: FacultyMember[];
  placements: PlacementStat;
  laboratories: LaboratoryItem[];
  achievements: {
    title: string;
    category: "Accreditation" | "Student Award" | "Faculty Award" | "Patent" | "Hackathon";
    year: string;
    desc: string;
  }[];
  syllabus: {
    regulation: string;
    curriculumPdfUrl?: string;
    semesters: {
      semNumber: string;
      credits: number;
      subjects: { code: string; name: string; type: "Theory" | "Lab" | "Integrated" | "Project"; credits: number }[];
    }[];
  };
  library: {
    volumesCount: string;
    titlesCount: string;
    nationalJournals: string;
    internationalJournals: string;
    digitalAccess: string[];
    eResources: string[];
  };
  newsletters: {
    title: string;
    volume: string;
    issue: string;
    period: string;
    pdfUrl?: string;
  }[];
  magazines: {
    title: string;
    edition: string;
    theme: string;
    editor: string;
    pdfUrl?: string;
  }[];
  mous: MOUItem[];
  research: ResearchData;
  professionalSocieties: {
    name: string;
    chapterId: string;
    counselor: string;
    membersCount: string;
    recentActivities: string[];
  }[];
  rollOfHonour: {
    studentName: string;
    batch: string;
    rankOrMedal: string;
    cgpa: string;
    achievement: string;
  }[];
  fundingProjects: FundingProjectItem[];
  teachingInnovations: {
    title: string;
    faculty: string;
    methodology: string;
    impact: string;
  }[];
  eventsAndAssociation: {
    associationName: string;
    motto: string;
    president: string;
    facultyAdvisor: string;
    activitiesSummary: string;
    events: EventItemData[];
  };
}

export const PROGRAM_DETAILS_DATABASE: Record<string, FullProgramData> = {
  // ─── 1. B.TECH. COMPUTER SCIENCE & ENGINEERING ───
  "btech-cse": {
    slug: "btech-cse",
    title: "B.Tech. Computer Science & Engineering",
    shortName: "B.Tech. CSE",
    department: "Computer Science & Engineering",
    school: "School of Computing Sciences",
    level: "Undergraduate",
    degreeType: "B.Tech.",
    duration: "4 Years (8 Semesters)",
    intake: "180 Seats",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics (Min 50% Marks) / Valid EAPCET / JEE Score",
    careerRoles: ["Full Stack Developer", "Cloud Solutions Architect", "Systems Software Engineer", "DevOps Specialist", "Database Administrator"],
    about: {
      summary: "The B.Tech. Computer Science & Engineering program at Chalapathi University is engineered to produce elite software architects, algorithmic researchers, and technology entrepreneurs. The curriculum seamlessly integrates cutting-edge computing paradigms including distributed systems, artificial intelligence, cloud architectures, cybersecurity, and modern full-stack development frameworks.",
      highlights: [
        "Industry-aligned curriculum updated continuously with Board of Studies inputs from TCS, Infosys, and Microsoft veterans",
        "State-of-the-art compute clusters with NVIDIA GPU workstations for deep learning and high-performance computing",
        "Mandatory 6-month capstone industrial internship with direct placement conversion pipelines",
        "100% Outcome Based Education (OBE) model with hands-on coding hackathons and continuous project evaluation",
        "Global certification training integrated in AWS Cloud, Google Cloud, Oracle Java, and Red Hat Linux"
      ],
      objectives: [
        "Provide solid theoretical foundations in discrete structures, automata, algorithms, and computing complexity",
        "Cultivate modern software engineering competencies using Agile methodologies, CI/CD pipelines, and microservices",
        "Empower students to formulate innovative computing solutions for real-world socio-economic and industrial challenges"
      ]
    },
    hodMessage: {
      hodName: "Dr. K. Srinivasa Rao",
      designation: "Professor & Head of the Department",
      qualification: "Ph.D. (Computer Science - IIT Madras), M.Tech., SMIEEE, FIETE",
      message: "Welcome to the Department of Computer Science & Engineering at Chalapathi University. Our mission is to blend intellectual rigor with technological mastery. In this era of rapid AI breakthroughs and cloud revolution, we prepare our scholars not just to adapt to industry changes, but to spearhead them through innovation, research publications, and entrepreneurship.",
      email: "hod.cse@city.ac.in"
    },
    visionMission: {
      vision: "To become a globally recognized center of academic excellence and impactful computing research, cultivating socially responsible software leaders and innovators.",
      mission: [
        "Deliver high-caliber undergraduate education grounded in theoretical principles and practical software engineering mastery.",
        "Foster an innovation-driven research ecosystem in distributed systems, AI, cloud computing, and cybersecurity.",
        "Establish sustainable corporate partnerships for experiential learning, industrial internships, and high-impact placements.",
        "Instill ethical values, leadership mindset, and lifelong learning capabilities in our graduates."
      ],
      coreValues: ["Academic Rigor", "Innovation & Ethics", "Continuous Learning", "Teamwork & Collaboration", "Social Impact"]
    },
    peoPoPso: {
      peos: [
        { id: "PEO-1", title: "Professional Mastery", desc: "Graduates will successfully analyze, design, and implement scalable computing architectures across top-tier multinational corporations." },
        { id: "PEO-2", title: "Higher Research & Innovation", desc: "Graduates will pursue advanced doctoral/master studies, author scholarly research publications, or develop patented software innovations." },
        { id: "PEO-3", title: "Leadership & Ethics", desc: "Graduates will demonstrate exemplary professional ethics, cross-disciplinary leadership, and sustainable engineering practices." }
      ],
      pos: [
        { id: "PO-1", title: "Engineering Knowledge", desc: "Apply mathematical foundations, algorithmic principles, and computing engineering fundamentals to complex software problem-solving." },
        { id: "PO-2", title: "Problem Analysis", desc: "Identify, formulate, and analyze complex computing problems reaching substantiated conclusions using foundational principles." },
        { id: "PO-3", title: "Design & Development of Solutions", desc: "Design system architectures and software modules that satisfy specified user needs with consideration for security and public safety." },
        { id: "PO-4", title: "Conduct Investigations of Complex Problems", desc: "Use research-based knowledge and scientific experimental methods including synthesis of data to provide valid conclusions." },
        { id: "PO-5", title: "Modern Tool Usage", desc: "Create, select, and apply state-of-the-art computing techniques, IDEs, version control systems, and testing frameworks." }
      ],
      psos: [
        { id: "PSO-1", title: "Full-Stack System Engineering", desc: "Ability to design, build, and deploy end-to-end responsive web and enterprise software using modern stack frameworks and cloud platforms." },
        { id: "PSO-2", title: "Algorithmic & AI Problem Solving", desc: "Ability to formulate optimized algorithms and apply data-driven intelligence to solve real-world industrial and societal challenges." }
      ]
    },
    facultyList: [
      { name: "Dr. K. Srinivasa Rao", designation: "Professor & HOD", qualification: "Ph.D. (IIT Madras)", specialization: "Distributed Systems & Cloud Computing", experience: "22 Years", email: "ksrao.cse@city.ac.in" },
      { name: "Dr. P. Venkata Ramana", designation: "Professor", qualification: "Ph.D. (NIT Warangal)", specialization: "Algorithms & Machine Learning", experience: "18 Years", email: "pvramana.cse@city.ac.in" },
      { name: "Dr. M. Lakshmi Prasanna", designation: "Associate Professor", qualification: "Ph.D. (JNTUK)", specialization: "Cyber Security & Cryptography", experience: "14 Years", email: "mlprasanna.cse@city.ac.in" },
      { name: "Prof. S. Raghunath", designation: "Associate Professor", qualification: "M.Tech., (Ph.D.)", specialization: "Database Management & Big Data", experience: "12 Years", email: "sraghu.cse@city.ac.in" },
      { name: "Prof. Anitha Kumari", designation: "Assistant Professor", qualification: "M.Tech. (CSE)", specialization: "Full Stack Web Technologies & DevOps", experience: "8 Years", email: "anitha.cse@city.ac.in" },
      { name: "Prof. Ch. Rajesh Babu", designation: "Assistant Professor", qualification: "M.Tech. (CSE)", specialization: "Computer Networks & Operating Systems", experience: "7 Years", email: "rajesh.cse@city.ac.in" }
    ],
    placements: {
      highestPackage: "₹44.00 LPA",
      averagePackage: "₹7.80 LPA",
      placementRate: "96.4%",
      topRecruiters: ["Amazon", "Microsoft", "TCS Digital", "Infosys", "Wipro", "Cognizant", "Capgemini", "Accenture", "HCL Tech", "Tech Mahindra"],
      placedStudents: [
        { name: "Sai Krishna Varma", company: "Microsoft", package: "₹44.00 LPA", role: "Software Development Engineer" },
        { name: "Harika Chowdary", company: "Amazon AWS", package: "₹32.50 LPA", role: "Cloud Support Associate" },
        { name: "V. Yaswanth Kumar", company: "TCS Digital", package: "₹9.20 LPA", role: "System Engineer Specialist" },
        { name: "P. Meghana Reddy", company: "Cognizant", package: "₹8.00 LPA", role: "GenC Next Developer" }
      ]
    },
    laboratories: [
      { name: "Advanced Computing & Cloud Architecture Lab", capacity: "75 Workstations", equipment: ["Intel Core i9 13th Gen Systems", "64GB DDR5 RAM", "1Gbps Dedicated Fiber Lan", "NVIDIA RTX 4080 GPU"], software: ["Ubuntu Server 22.04", "Docker", "Kubernetes", "AWS CLI", "VMware Workstation"] },
      { name: "Full Stack Web & Mobile App Development Lab", capacity: "65 Workstations", equipment: ["Intel Core i7 Systems", "Dual 27-inch Monitors", "High-Speed SSDs"], software: ["Node.js", "React", "Python 3.11", "PostgreSQL", "Android Studio"] },
      { name: "Database & Information Retrieval Systems Lab", capacity: "60 Workstations", equipment: ["Dell OptiPlex Enterprise Workstations", "Gigabit Managed Switches"], software: ["Oracle 19c Enterprise", "MySQL Workbench", "MongoDB", "Apache Cassandra"] },
      { name: "Network Security & Cryptography Lab", capacity: "60 Workstations", equipment: ["Hardware Firewalls", "Cisco Routers 2900 Series", "Managed Patch Panels"], software: ["Wireshark", "Kali Linux", "Snort IDS", "Metasploit Framework"] }
    ],
    achievements: [
      { title: "NBA Tier-1 Accreditation", category: "Accreditation", year: "2024-2027", desc: "Accredited under National Board of Accreditation Tier-1 outcome-based education parameters for 3 consecutive years." },
      { title: "1st Prize - Smart India Hackathon Grand Finale", category: "Hackathon", year: "2025", desc: "Student team won first prize worth ₹1,00,000 for building an AI-powered disaster relief management decentralized mesh network." },
      { title: "12 Patents Published & 3 Granted", category: "Patent", year: "2024-2025", desc: "Faculty and students collaboratively filed cutting-edge intellectual property patents in distributed consensus and secure cloud data transfer." }
    ],
    syllabus: {
      regulation: "Academic Regulations R26 (Autonomous NEP-Compliant)",
      curriculumPdfUrl: "/academics/curriculum/btech-cse-r26.pdf",
      semesters: [
        {
          semNumber: "Semester 1",
          credits: 20,
          subjects: [
            { code: "26CS101", name: "Matrices, Calculus & Linear Algebra", type: "Theory", credits: 4 },
            { code: "26CS102", name: "Engineering Physics & Semiconductor Devices", type: "Theory", credits: 3 },
            { code: "26CS103", name: "Problem Solving & Python Programming", type: "Integrated", credits: 4 },
            { code: "26CS104", name: "Basic Electrical & Electronics Engineering", type: "Theory", credits: 3 },
            { code: "26CS105", name: "Engineering Physics Laboratory", type: "Lab", credits: 1.5 },
            { code: "26CS106", name: "Python Programming Laboratory", type: "Lab", credits: 1.5 },
            { code: "26CS107", name: "Universal Human Values & Professional Ethics", type: "Theory", credits: 2 },
            { code: "26CS108", name: "Design Thinking & Prototyping Workshop", type: "Lab", credits: 1 }
          ]
        },
        {
          semNumber: "Semester 2",
          credits: 21,
          subjects: [
            { code: "26CS201", name: "Differential Equations & Numerical Methods", type: "Theory", credits: 4 },
            { code: "26CS202", name: "Data Structures & Algorithm Analysis", type: "Integrated", credits: 4 },
            { code: "26CS203", name: "Digital Logic Design & Microarchitectures", type: "Theory", credits: 3 },
            { code: "26CS204", name: "Object Oriented Programming through Java", type: "Integrated", credits: 4 },
            { code: "26CS205", name: "Data Structures Laboratory", type: "Lab", credits: 1.5 },
            { code: "26CS206", name: "Java Programming Laboratory", type: "Lab", credits: 1.5 },
            { code: "26CS207", name: "English for Professional Communication", type: "Theory", credits: 2 },
            { code: "26CS208", name: "Communication Skills Laboratory", type: "Lab", credits: 1 }
          ]
        },
        {
          semNumber: "Semester 3",
          credits: 22,
          subjects: [
            { code: "26CS301", name: "Discrete Mathematical Structures & Graph Theory", type: "Theory", credits: 4 },
            { code: "26CS302", name: "Database Management Systems", type: "Integrated", credits: 4 },
            { code: "26CS303", name: "Computer Organization & Architecture", type: "Theory", credits: 3 },
            { code: "26CS304", name: "Operating Systems Principles", type: "Theory", credits: 3 },
            { code: "26CS305", name: "Formal Languages & Automata Theory", type: "Theory", credits: 3 },
            { code: "26CS306", name: "DBMS Laboratory", type: "Lab", credits: 1.5 },
            { code: "26CS307", name: "Operating Systems & Linux Shell Lab", type: "Lab", credits: 1.5 },
            { code: "26CS308", name: "Social Immersion Project", type: "Project", credits: 2 }
          ]
        },
        {
          semNumber: "Semester 4",
          credits: 22,
          subjects: [
            { code: "26CS401", name: "Design & Analysis of Algorithms", type: "Theory", credits: 4 },
            { code: "26CS402", name: "Computer Networks & Protocols", type: "Integrated", credits: 4 },
            { code: "26CS403", name: "Software Engineering & Agile Methodologies", type: "Theory", credits: 3 },
            { code: "26CS404", name: "Full Stack Web Development", type: "Integrated", credits: 4 },
            { code: "26CS405", name: "Algorithms & Competitive Coding Lab", type: "Lab", credits: 1.5 },
            { code: "26CS406", name: "Web Development Laboratory", type: "Lab", credits: 1.5 },
            { code: "26CS407", name: "Environmental Science & Sustainability", type: "Theory", credits: 2 },
            { code: "26CS408", name: "Community Service Project", type: "Project", credits: 2 }
          ]
        }
      ]
    },
    library: {
      volumesCount: "14,850+ Volumes",
      titlesCount: "3,200+ Titles",
      nationalJournals: "24 Print Journals",
      internationalJournals: "18 International Subscriptions",
      digitalAccess: ["IEEE Xplore Digital Library", "ACM Digital Library", "SpringerLink", "ScienceDirect", "NPTEL Video Server"],
      eResources: ["Over 25,000+ e-books in Computer Science", "DELNET Online Database", "Shodhganga Theses Repository", "NDLI Institutional Membership"]
    },
    newsletters: [
      { title: "BYTE CRAFT - CSE Bi-Annual Digest", volume: "Vol. 12", issue: "Issue 2", period: "Jul - Dec 2025", pdfUrl: "#" },
      { title: "BYTE CRAFT - CSE Bi-Annual Digest", volume: "Vol. 12", issue: "Issue 1", period: "Jan - Jun 2025", pdfUrl: "#" },
      { title: "BYTE CRAFT - CSE Bi-Annual Digest", volume: "Vol. 11", issue: "Issue 2", period: "Jul - Dec 2024", pdfUrl: "#" }
    ],
    magazines: [
      { title: "TECH HORIZON - Annual Computing Magazine", edition: "2025 Annual Edition", theme: "Generative AI and the Future of Cloud Autonomy", editor: "Editorial Board, CSE Association", pdfUrl: "#" },
      { title: "TECH HORIZON - Annual Computing Magazine", edition: "2024 Annual Edition", theme: "Quantum Computing and Distributed Systems", editor: "Editorial Board, CSE Association", pdfUrl: "#" }
    ],
    mous: [
      { partner: "Tata Consultancy Services (TCS)", country: "India / Global", scope: "Curriculum co-design, faculty development, and pre-placement training", signedYear: "2023", validity: "Active (5 Years)" },
      { partner: "Amazon Web Services (AWS) Academy", country: "USA / Global", scope: "Official AWS Cloud Foundation certification programs and compute credits", signedYear: "2024", validity: "Active (3 Years)" },
      { partner: "Red Hat Academy", country: "Global", scope: "Linux enterprise administration, OpenShift containerization courses", signedYear: "2023", validity: "Active (3 Years)" },
      { partner: "Oracle University", country: "Global", scope: "Database architecture and Java enterprise developer certifications", signedYear: "2022", validity: "Active (5 Years)" }
    ],
    research: {
      thrustAreas: ["Distributed Cloud Architectures", "Deep Learning & Neural Vision", "Cybersecurity & Blockchain", "Edge IoT Network Optimization"],
      publicationsCount: 148,
      patentsPublished: 24,
      patentsGranted: 6,
      activeScholars: 32,
      keyPublications: [
        { title: "Self-Healing Distributed Consensus Protocols in Low-Bandwidth Edge Networks", journal: "IEEE Transactions on Cloud Computing", authors: "Dr. K. Srinivasa Rao, Dr. P. Venkata Ramana", year: "2025" },
        { title: "Zero-Trust Architectural Models for Enterprise Multi-Cloud Deployments", journal: "Springer Journal of Supercomputing", authors: "Dr. M. Lakshmi Prasanna", year: "2024" },
        { title: "Privacy-Preserving Federated Learning for Decentralized Medical Diagnostics", journal: "Elsevier Computers & Security", authors: "Dr. P. Venkata Ramana", year: "2025" }
      ]
    },
    professionalSocieties: [
      { name: "IEEE Computer Society Student Branch Chapter", chapterId: "IEEE-SB-6412", counselor: "Dr. K. Srinivasa Rao", membersCount: "140+ Active Members", recentActivities: ["24-Hour National Hackathon", "Workshop on Cloud Microservices", "IEEE Distinguished Lecture Series on AI"] },
      { name: "Computer Society of India (CSI) Institutional Chapter", chapterId: "CSI-AP-088", counselor: "Dr. P. Venkata Ramana", membersCount: "220+ Student Members", recentActivities: ["National Level Coding Olympiad", "Technical Paper Presentation Contest", "Industry Expert Web-Series"] },
      { name: "ACM Student Chapter", chapterId: "ACM-CU-109", counselor: "Prof. S. Raghunath", membersCount: "95+ Student Members", recentActivities: ["Algorithmic Problem Solving Bootcamps", "Women in Computing Meet", "Open Source Contribution Drive"] }
    ],
    rollOfHonour: [
      { studentName: "K. Divya Sri", batch: "2021-2025", rankOrMedal: "University Gold Medalist (1st Rank)", cgpa: "9.84 / 10.0", achievement: "Top Ranker across all engineering disciplines with 4 IEEE publications." },
      { studentName: "M. Sai Tarun", batch: "2021-2025", rankOrMedal: "Silver Medalist (2nd Rank)", cgpa: "9.72 / 10.0", achievement: "Secured placement at Amazon with ₹32.5 LPA package." },
      { studentName: "G. Ananya", batch: "2020-2024", rankOrMedal: "Best Outgoing Student Award", cgpa: "9.68 / 10.0", achievement: "Granted 2 student patents and secured MS admit at Carnegie Mellon University." }
    ],
    fundingProjects: [
      { title: "Development of AI-Powered IoT Framework for Remote Rural Tele-Health Monitoring", fundingAgency: "DST - Department of Science & Technology", grantAmount: "₹38,50,000", principalInvestigator: "Dr. K. Srinivasa Rao", duration: "3 Years (2023-2026)", status: "Ongoing" },
      { title: "MODROBS Modernization of Cloud Computing & Machine Learning Laboratory", fundingAgency: "AICTE - All India Council for Technical Education", grantAmount: "₹18,20,000", principalInvestigator: "Dr. P. Venkata Ramana", duration: "2 Years (2023-2025)", status: "Completed" },
      { title: "Blockchain-Enabled Secure Supply Chain Verification for Agricultural Produce", fundingAgency: "Industry Sponsored Research Grant", grantAmount: "₹12,00,000", principalInvestigator: "Dr. M. Lakshmi Prasanna", duration: "2 Years (2024-2026)", status: "Ongoing" }
    ],
    teachingInnovations: [
      { title: "Flipped Classroom with Real-Time Coding Sandboxes", faculty: "Dr. K. Srinivasa Rao", methodology: "Pre-recorded micro-lectures paired with live collaborative IDE debugging sessions during lecture hours.", impact: "Improved average student coding benchmark scores by 34%." },
      { title: "Peer-Code Review & Git-Flow Evaluation Framework", faculty: "Prof. Anitha Kumari", methodology: "Every programming assignment is evaluated through GitHub pull requests with peer-code reviews and automated CI tests.", impact: "Inculcated industry-standard DevOps habits from 2nd year onwards." },
      { title: "Project-Centric Lab Learning in Cloud Environments", faculty: "Prof. S. Raghunath", methodology: "Replacing traditional static lab programs with incremental full-stack SaaS project deployments.", impact: "92% of students completed live web projects on public cloud URLs." }
    ],
    eventsAndAssociation: {
      associationName: "CESA - Computer Engineering Students Association",
      motto: "Code. Innovate. Transform.",
      president: "V. Yaswanth Kumar (Final Year CSE)",
      facultyAdvisor: "Dr. P. Venkata Ramana",
      activitiesSummary: "CESA is the vibrant student technical body of the CSE department, organizing annual national-level technical symposiums, weekly coding leagues, open-source hackathons, and corporate alumni networking sessions.",
      events: [
        { title: "CYBER QUEST 2025 - National Level Technical Symposium", date: "18-19 March 2025", type: "Technical Fest", venue: "University Main Auditorium", description: "2-Day flagship technical extravaganza featuring Paper Presentations, Hackathons, Blind Coding, Web Designing Contests, and Gaming Tournaments with over 1,200 participants from 45 colleges." },
        { title: "Hands-on Bootcamp on Generative AI & LLM Deployment", date: "10-12 February 2025", type: "Workshop", venue: "Advanced Computing Lab", description: "3-Day intensive workshop led by senior AI architects covering LangChain, OpenAI APIs, vector databases, and retrieval augmented generation (RAG)." },
        { title: "Alumni Tech-Talk: Scaling Distributed Systems in Silicon Valley", date: "24 January 2025", type: "Guest Lecture", venue: "CSE Seminar Hall", description: "Distinguished alumnus Mr. R. Karthik (Principal Architect, San Francisco) interacted with 3rd and 4th-year students on modern cloud engineering." }
      ]
    }
  },

  // ─── 2. M.TECH. COMPUTER SCIENCE & ENGINEERING ───
  "mtech-cse": {
    slug: "mtech-cse",
    title: "M.Tech. Computer Science & Engineering",
    shortName: "M.Tech. CSE",
    department: "Computer Science & Engineering",
    school: "School of Computing Sciences",
    level: "Postgraduate",
    degreeType: "M.Tech.",
    duration: "2 Years (4 Semesters)",
    intake: "18 Seats",
    eligibility: "B.Tech. / B.E. in CSE / IT / ECE / MCA / M.Sc. (Comp Science) with valid GATE / PGECET Score (Min 50% Marks)",
    careerRoles: ["Lead Architect", "Principal Software Scientist", "High-Performance Computing Engineer", "Distributed Systems Engineer", "R&D Specialist"],
    about: {
      summary: "The M.Tech. Computer Science & Engineering program offers advanced research-intensive study in high-performance computing, distributed architectures, neural machine learning, and advanced cloud technologies. It is tailored for engineers seeking deep architectural roles or academic research careers.",
      highlights: [
        "Advanced research thesis embedded across two entire semesters with mandatory Scopus/IEEE journal publications",
        "Direct access to NVIDIA GPU clusters and high-throughput parallel compute laboratories",
        "Comprehensive coverage of distributed consensus, formal methods, quantum algorithms, and deep reinforcement learning",
        "Generous institutional research stipends and teaching assistantships for GATE qualified scholars"
      ],
      objectives: [
        "Develop high-order algorithmic rigor and mastery over distributed parallel computing models",
        "Enable postgraduate scholars to conduct independent scientific investigations and author impactful scholarly research",
        "Prepare visionary technical leads capable of designing fault-tolerant enterprise software systems"
      ]
    },
    hodMessage: {
      hodName: "Dr. K. Srinivasa Rao",
      designation: "Professor & Head of the Department",
      qualification: "Ph.D. (IIT Madras), M.Tech., SMIEEE, FIETE",
      message: "Our M.Tech. CSE program is designed for students with a genuine passion for algorithmic rigor and deep technical investigation. We provide an intellectually stimulating environment with specialized compute facilities, generous research grants, and direct mentorship from experienced doctorate professors.",
      email: "hod.cse@city.ac.in"
    },
    visionMission: {
      vision: "To be a leading center for advanced postgraduate computing education and frontier research in scalable computing systems.",
      mission: [
        "Provide rigorous postgraduate training in advanced algorithmic theories, distributed systems, and computational intelligence.",
        "Promote high-quality doctoral and master research contributing to global scientific advancements.",
        "Bridge the gap between academic research and industrial application through sponsored innovation projects."
      ],
      coreValues: ["Scientific Rigor", "Research Ethics", "Intellectual Autonomy", "Technological Excellence"]
    },
    peoPoPso: {
      peos: [
        { id: "PEO-1", title: "Research & Development Leadership", desc: "Graduates will lead innovative R&D divisions and architect sophisticated computing systems in global organizations." },
        { id: "PEO-2", title: "Doctoral Advancements", desc: "Graduates will excel in premier Ph.D. doctoral programs worldwide and contribute seminal publications." },
        { id: "PEO-3", title: "Technological Entrepreneurship", desc: "Graduates will create high-tech intellectual property and launch venture-backed deep-tech enterprises." }
      ],
      pos: [
        { id: "PO-1", title: "Advanced Theoretical Foundations", desc: "Demonstrate deep understanding of advanced algorithms, theoretical computer science, and parallel systems." },
        { id: "PO-2", title: "Research Methodology", desc: "Formulate research hypotheses, conduct thorough literature surveys, and publish verified experimental data." },
        { id: "PO-3", title: "Critical System Design", desc: "Architect fault-tolerant, high-performance distributed systems addressing real-world enterprise constraints." }
      ],
      psos: [
        { id: "PSO-1", title: "Distributed & Parallel Systems", desc: "Design and implement scalable distributed computing architectures using cluster nodes and containerized microservices." },
        { id: "PSO-2", title: "Advanced Applied AI", desc: "Formulate novel deep neural architectures and optimization algorithms for high-complexity domain problems." }
      ]
    },
    facultyList: [
      { name: "Dr. K. Srinivasa Rao", designation: "Professor & HOD", qualification: "Ph.D. (IIT Madras)", specialization: "Distributed Systems & Cloud Computing", experience: "22 Years", email: "ksrao.cse@city.ac.in" },
      { name: "Dr. P. Venkata Ramana", designation: "Professor", qualification: "Ph.D. (NIT Warangal)", specialization: "Algorithms & Machine Learning", experience: "18 Years", email: "pvramana.cse@city.ac.in" },
      { name: "Dr. M. Lakshmi Prasanna", designation: "Associate Professor", qualification: "Ph.D. (JNTUK)", specialization: "Cyber Security & Cryptography", experience: "14 Years", email: "mlprasanna.cse@city.ac.in" }
    ],
    placements: {
      highestPackage: "₹24.00 LPA",
      averagePackage: "₹9.50 LPA",
      placementRate: "94.0%",
      topRecruiters: ["Microsoft R&D", "Oracle India", "Qualcomm", "TCS R&D", "Infosys Labs", "Synopsys"],
      placedStudents: [
        { name: "R. Naveen Chandra", company: "Oracle India", package: "₹24.00 LPA", role: "Principal Cloud Engineer" },
        { name: "S. Swathi", company: "Microsoft R&D", package: "₹21.00 LPA", role: "Software Engineer - Core Systems" }
      ]
    },
    laboratories: [
      { name: "High-Performance Parallel Computing & GPU Lab", capacity: "30 Specialized Workstations", equipment: ["Dual NVIDIA A100 GPU Workstations", "128GB RAM Nodes", "High-Throughput NVMe Arrays"], software: ["CUDA Toolkit 12.2", "TensorRT", "MPI / OpenMP", "Apache Spark Distributed Cluster"] }
    ],
    achievements: [
      { title: "Best Post-Graduate Thesis Award", category: "Student Award", year: "2025", desc: "M.Tech scholar won national best thesis award for novel federated consensus algorithms." },
      { title: "100% Scopus Publication Record", category: "Accreditation", year: "2024-2025", desc: "100% of graduating M.Tech students published first-author research articles in Scopus-indexed journals." }
    ],
    syllabus: {
      regulation: "Academic Regulations R26 (M.Tech. Autonomous)",
      curriculumPdfUrl: "/academics/curriculum/mtech-cse-r26.pdf",
      semesters: [
        {
          semNumber: "Semester 1",
          credits: 18,
          subjects: [
            { code: "26MCS101", name: "Advanced Data Structures & Algorithms", type: "Theory", credits: 4 },
            { code: "26MCS102", name: "High-Performance Distributed Systems", type: "Theory", credits: 4 },
            { code: "26MCS103", name: "Advanced Machine Learning Techniques", type: "Theory", credits: 3 },
            { code: "26MCS104", name: "Research Methodology & IPR", type: "Theory", credits: 2 },
            { code: "26MCS105", name: "Advanced Computing Laboratory - I", type: "Lab", credits: 2 }
          ]
        },
        {
          semNumber: "Semester 2",
          credits: 18,
          subjects: [
            { code: "26MCS201", name: "Cloud Computing Architectures & Virtualization", type: "Theory", credits: 4 },
            { code: "26MCS202", name: "Deep Learning & Computer Vision", type: "Theory", credits: 4 },
            { code: "26MCS203", name: "Program Elective - II (Advanced Security)", type: "Theory", credits: 3 },
            { code: "26MCS204", name: "Advanced Computing Laboratory - II", type: "Lab", credits: 2 },
            { code: "26MCS205", name: "Mini Project with Seminar", type: "Project", credits: 3 }
          ]
        },
        {
          semNumber: "Semester 3",
          credits: 16,
          subjects: [
            { code: "26MCS301", name: "Program Elective - III / MOOCs", type: "Theory", credits: 3 },
            { code: "26MCS302", name: "Dissertation Phase - I (Literature & Design)", type: "Project", credits: 13 }
          ]
        },
        {
          semNumber: "Semester 4",
          credits: 16,
          subjects: [
            { code: "26MCS401", name: "Dissertation Phase - II & Viva Voce", type: "Project", credits: 16 }
          ]
        }
      ]
    },
    library: {
      volumesCount: "6,200+ PG Volumes",
      titlesCount: "1,400+ PG Titles",
      nationalJournals: "14 Specialised Journals",
      internationalJournals: "12 Subscriptions",
      digitalAccess: ["IEEE Transactions Archive", "ACM Computing Surveys", "Springer Lecture Notes in Computer Science"],
      eResources: ["Over 8,000+ PG specialized monograph texts", "ScienceDirect Full-Text Subscriptions"]
    },
    newsletters: [
      { title: "COMPUTE ADVANCE - PG Research Digest", volume: "Vol. 6", issue: "Issue 1", period: "Jan - Dec 2025", pdfUrl: "#" }
    ],
    magazines: [
      { title: "INSIGHTS - PG Computing Journal", edition: "2025 Edition", theme: "Large Language Models & Distributed Vector Databases", editor: "PG Research Committee", pdfUrl: "#" }
    ],
    mous: [
      { partner: "Tata Consultancy Services (TCS) Innovation Lab", country: "India", scope: "Joint PG research mentorship and sponsored dissertation projects", signedYear: "2024", validity: "Active (3 Years)" }
    ],
    research: {
      thrustAreas: ["High-Performance Computing", "Distributed Ledger Technologies", "Scalable Deep Learning Architectures"],
      publicationsCount: 62,
      patentsPublished: 8,
      patentsGranted: 2,
      activeScholars: 14,
      keyPublications: [
        { title: "Dynamic Task Scheduling in Heterogeneous Cloud Environments", journal: "IEEE Transactions on Services Computing", authors: "Dr. K. Srinivasa Rao, R. Naveen", year: "2025" }
      ]
    },
    professionalSocieties: [
      { name: "IEEE Computer Society PG Research Chapter", chapterId: "IEEE-PG-CSE", counselor: "Dr. K. Srinivasa Rao", membersCount: "35 Members", recentActivities: ["Research Paper Writing Colloquium", "Workshop on LaTeX & Scientific Dissemination"] }
    ],
    rollOfHonour: [
      { studentName: "R. Naveen Chandra", batch: "2023-2025", rankOrMedal: "Gold Medal (Highest CGPA in M.Tech)", cgpa: "9.91 / 10.0", achievement: "Published 3 IEEE Transactions papers during his dissertation." }
    ],
    fundingProjects: [
      { title: "AICTE Post Graduate Research Grant for High Performance Compute Nodes", fundingAgency: "AICTE", grantAmount: "₹14,50,000", principalInvestigator: "Dr. K. Srinivasa Rao", duration: "2 Years", status: "Ongoing" }
    ],
    teachingInnovations: [
      { title: "Research Paper Review Pedagogy", faculty: "Dr. P. Venkata Ramana", methodology: "Postgraduate scholars critically review two top-tier IEEE papers weekly and reproduce experimental benchmarks.", impact: "Doubled student first-author publications." }
    ],
    eventsAndAssociation: {
      associationName: "RESEARCH NEXUS - PG Scholar Forum",
      motto: "Inquire. Formulate. Publish.",
      president: "S. Swathi (Final Year M.Tech)",
      facultyAdvisor: "Dr. K. Srinivasa Rao",
      activitiesSummary: "Monthly doctoral and PG colloquiums, thesis writing bootcamps, and industry research lab visits.",
      events: [
        { title: "PG Colloquium on Scalable Distributed Systems", date: "14 February 2025", type: "Colloquium", venue: "Seminar Hall", description: "Poster and presentation sessions for 2nd-year master scholars presenting interim dissertation benchmarks." }
      ]
    }
  },

  // ─── 3. MASTER OF COMPUTER APPLICATIONS (MCA) ───
  "mca": {
    slug: "mca",
    title: "Master of Computer Applications (MCA)",
    shortName: "MCA",
    department: "Computer Science & Engineering",
    school: "School of Computing Sciences",
    level: "Postgraduate",
    degreeType: "MCA",
    duration: "2 Years (4 Semesters)",
    intake: "120 Seats",
    eligibility: "Passed BCA / Bachelor Degree in Computer Science Engineering or equivalent / B.Sc., B.Com., B.A. with Mathematics at 10+2 Level or at Graduation Level (Min 50% Marks) / Valid APICET Score",
    careerRoles: ["Enterprise Software Developer", "Full Stack Engineer", "Database Administrator", "Mobile Application Developer", "Cloud DevOps Specialist"],
    about: {
      summary: "The Master of Computer Applications (MCA) at Chalapathi University is a flagship 2-year postgraduate professional program designed to mold students into expert enterprise software developers and IT leaders. The curriculum balances practical industry-ready software engineering with modern application design, microservices, cloud deployments, and agile methodologies.",
      highlights: [
        "Intensive project-based training in Java Enterprise, Python full-stack, React, Node.js, and Cloud Infrastructure",
        "Mandatory 4th-semester Full-Time Corporate Internship with top IT firms",
        "Exclusive Pre-Placement Training (PPT) covering algorithmic problem-solving, system design, and soft skills",
        "100% Placement assistance with high recruiter participation from global technology services firms"
      ],
      objectives: [
        "Transform graduates into proficient software developers equipped with modern web, cloud, and mobile application frameworks",
        "Provide thorough practical mastery over enterprise databases, software testing, and secure application engineering",
        "Foster analytical abilities, teamwork, and entrepreneurial mindset for high-growth corporate careers"
      ]
    },
    hodMessage: {
      hodName: "Dr. M. Lakshmi Prasanna",
      designation: "Program Coordinator & Associate Professor",
      qualification: "Ph.D. (Computer Science), M.Tech. (CSE), MCA",
      message: "The MCA program at Chalapathi University is specifically structured for fast-paced professional translation. We bridge the gap between degree education and corporate demands by immersing our scholars in full-stack coding, real-world industry projects, and continuous mock interview drills.",
      email: "mca.coordinator@city.ac.in"
    },
    visionMission: {
      vision: "To be recognized as a premier destination for computer applications education, transforming graduates into dynamic software architects and technopreneurs.",
      mission: [
        "Deliver industry-oriented curriculum empowering students with robust software development and analytical competencies.",
        "Facilitate hands-on laboratory experiences in web technologies, mobile architectures, and enterprise databases.",
        "Partner with IT leaders to offer internships, industrial training, and premier placement opportunities."
      ],
      coreValues: ["Industry Relevance", "Practical Mastery", "Professional Integrity", "Innovation"]
    },
    peoPoPso: {
      peos: [
        { id: "PEO-1", title: "Corporate Software Excellence", desc: "Graduates will excel as enterprise software engineers, full-stack developers, and IT consultants in global technology firms." },
        { id: "PEO-2", title: "Continuous Technical Growth", desc: "Graduates will continuously upskill in emerging technologies like cloud computing, AI tools, and DevOps pipelines." },
        { id: "PEO-3", title: "Leadership & Team Ethics", desc: "Graduates will demonstrate exemplary teamwork, project management capabilities, and ethical professional conduct." }
      ],
      pos: [
        { id: "PO-1", title: "Computational Knowledge", desc: "Apply mathematical and computational principles to practical software design and enterprise problem-solving." },
        { id: "PO-2", title: "Software Development Mastery", desc: "Design, code, test, and deploy end-to-end robust applications meeting customer specifications." },
        { id: "PO-3", title: "Usage of Modern Frameworks", desc: "Leverage modern web, mobile, and cloud frameworks to build high-performance software." }
      ],
      psos: [
        { id: "PSO-1", title: "Enterprise Full-Stack Applications", desc: "Ability to develop scalable client-server applications utilizing enterprise Java, Python, modern frontend libraries, and SQL/NoSQL databases." },
        { id: "PSO-2", title: "Cloud & Mobile Engineering", desc: "Ability to package, containerize, and deploy secure mobile and cloud solutions with integrated automated testing." }
      ]
    },
    facultyList: [
      { name: "Dr. M. Lakshmi Prasanna", designation: "Program Coordinator & Assoc. Prof.", qualification: "Ph.D., MCA, M.Tech.", specialization: "Enterprise Application Security & Web Tech", experience: "14 Years", email: "mlprasanna.cse@city.ac.in" },
      { name: "Prof. S. Raghunath", designation: "Associate Professor", qualification: "M.Tech., MCA, (Ph.D.)", specialization: "Database Management & Java Tech", experience: "12 Years", email: "sraghu.cse@city.ac.in" },
      { name: "Prof. Anitha Kumari", designation: "Assistant Professor", qualification: "M.Tech., MCA", specialization: "React, Node.js & Full Stack", experience: "8 Years", email: "anitha.cse@city.ac.in" },
      { name: "Prof. Ch. Rajesh Babu", designation: "Assistant Professor", qualification: "M.Tech., MCA", specialization: "Software Engineering & Cloud DevOps", experience: "7 Years", email: "rajesh.cse@city.ac.in" }
    ],
    placements: {
      highestPackage: "₹16.50 LPA",
      averagePackage: "₹6.40 LPA",
      placementRate: "93.8%",
      topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "Capgemini", "Accenture", "HCL Tech", "Mindtree", "Tech Mahindra", "Virtusa"],
      placedStudents: [
        { name: "V. Sandeep", company: "Capgemini", package: "₹16.50 LPA", role: "Senior Software Analyst" },
        { name: "B. Divya", company: "TCS", package: "₹9.20 LPA", role: "Digital Software Specialist" },
        { name: "G. Mahesh", company: "Cognizant", package: "₹7.50 LPA", role: "Full Stack Engineer" }
      ]
    },
    laboratories: [
      { name: "Enterprise Java & Full Stack Web Development Lab", capacity: "65 Workstations", equipment: ["Core i7 Systems", "16GB RAM", "SSD Storage"], software: ["Eclipse IDE", "VS Code", "Node.js", "React", "Spring Boot", "MySQL", "PostgreSQL"] },
      { name: "Mobile Application & Cloud Technologies Lab", capacity: "60 Workstations", equipment: ["Dell Core i7 High-Performance Desktop Units"], software: ["Android Studio", "Flutter SDK", "AWS Management Console", "Docker Desktop"] }
    ],
    achievements: [
      { title: "100% Industry Internship Conversions", category: "Accreditation", year: "2025", desc: "Over 85% of 4th-semester internship scholars successfully converted internships into full-time corporate placements." },
      { title: "State-Level IT Quiz & Coding Championship", category: "Student Award", year: "2024", desc: "MCA student team won 1st position in the Inter-University IT Olympiad at Amaravati." }
    ],
    syllabus: {
      regulation: "Academic Regulations R26 (MCA 2-Year Autonomous)",
      curriculumPdfUrl: "/academics/curriculum/mca-r26.pdf",
      semesters: [
        {
          semNumber: "Semester 1",
          credits: 22,
          subjects: [
            { code: "26MCA101", name: "Problem Solving & Data Structures using C++", type: "Integrated", credits: 4 },
            { code: "26MCA102", name: "Object Oriented Programming through Java", type: "Integrated", credits: 4 },
            { code: "26MCA103", name: "Database Management Systems & SQL", type: "Integrated", credits: 4 },
            { code: "26MCA104", name: "Operating Systems & Linux Architecture", type: "Theory", credits: 3 },
            { code: "26MCA105", name: "Mathematical Foundations of Computer Science", type: "Theory", credits: 3 },
            { code: "26MCA106", name: "Communication & Soft Skills Laboratory", type: "Lab", credits: 2 },
            { code: "26MCA107", name: "Java & Data Structures Laboratory", type: "Lab", credits: 2 }
          ]
        },
        {
          semNumber: "Semester 2",
          credits: 22,
          subjects: [
            { code: "26MCA201", name: "Enterprise Java & Spring Boot Microservices", type: "Integrated", credits: 4 },
            { code: "26MCA202", name: "Full Stack Web Technologies (MERN Stack)", type: "Integrated", credits: 4 },
            { code: "26MCA203", name: "Computer Networks & Web Security", type: "Theory", credits: 3 },
            { code: "26MCA204", name: "Software Engineering & Agile Methodologies", type: "Theory", credits: 3 },
            { code: "26MCA205", name: "Python Programming & Data Analytics", type: "Integrated", credits: 4 },
            { code: "26MCA206", name: "Full Stack Web Development Lab", type: "Lab", credits: 2 },
            { code: "26MCA207", name: "Term Paper & Seminar", type: "Project", credits: 2 }
          ]
        },
        {
          semNumber: "Semester 3",
          credits: 20,
          subjects: [
            { code: "26MCA301", name: "Cloud Computing & DevOps CI/CD", type: "Theory", credits: 3 },
            { code: "26MCA302", name: "Mobile Application Development (Flutter/Android)", type: "Integrated", credits: 4 },
            { code: "26MCA303", name: "Machine Learning with Python", type: "Theory", credits: 3 },
            { code: "26MCA304", name: "Program Elective - I (Big Data / AI)", type: "Theory", credits: 3 },
            { code: "26MCA305", name: "Cloud & Mobile App Development Lab", type: "Lab", credits: 2 },
            { code: "26MCA306", name: "Major Project Work Phase - I", type: "Project", credits: 5 }
          ]
        },
        {
          semNumber: "Semester 4",
          credits: 16,
          subjects: [
            { code: "26MCA401", name: "Full-Time Corporate Industrial Internship & Major Project", type: "Project", credits: 16 }
          ]
        }
      ]
    },
    library: {
      volumesCount: "8,400+ MCA Volumes",
      titlesCount: "1,950+ Titles",
      nationalJournals: "16 Subscribed Journals",
      internationalJournals: "10 Subscribed Journals",
      digitalAccess: ["ACM Digital Library", "IEEE Computer Society Online", "EBSCO Computer Database"],
      eResources: ["Over 10,000+ e-books in Application Development", "NPTEL Video Lectures"]
    },
    newsletters: [
      { title: "APP CRAFT - MCA Quarterly Newsletter", volume: "Vol. 8", issue: "Issue 3", period: "Oct - Dec 2025", pdfUrl: "#" }
    ],
    magazines: [
      { title: "APP SPHERE - Annual Application Engineering Magazine", edition: "2025 Edition", theme: "Full-Stack Development and Microservice Scalability", editor: "MCA Association Editorial Board", pdfUrl: "#" }
    ],
    mous: [
      { partner: "Wipro TalentNext Digital Academy", country: "India", scope: "Faculty enablement and student Java Full-Stack certification track", signedYear: "2023", validity: "Active (3 Years)" }
    ],
    research: {
      thrustAreas: ["Enterprise Application Security", "Cloud Database Optimization", "Mobile Computing Interfaces"],
      publicationsCount: 38,
      patentsPublished: 5,
      patentsGranted: 1,
      activeScholars: 0,
      keyPublications: [
        { title: "Performance Evaluation of Microservice Communication Protocols under High Concurrency", journal: "International Journal of Web Information Systems", authors: "Dr. M. Lakshmi Prasanna, Prof. S. Raghunath", year: "2024" }
      ]
    },
    professionalSocieties: [
      { name: "CSI MCA Student Chapter", chapterId: "CSI-MCA-04", counselor: "Dr. M. Lakshmi Prasanna", membersCount: "110 Members", recentActivities: ["State-wide Coding Marathon", "Web-Design Bootcamp", "Resume & Mock Interview Drive"] }
    ],
    rollOfHonour: [
      { studentName: "K. Sowmya", batch: "2023-2025", rankOrMedal: "Gold Medal (1st Rank MCA)", cgpa: "9.88 / 10.0", achievement: "Top scorer in APICET cohort and recruited by Capgemini." }
    ],
    fundingProjects: [],
    teachingInnovations: [
      { title: "Agile Sprint Project Lab Sessions", faculty: "Prof. Anitha Kumari", methodology: "Lab teams work in 2-week Agile sprints with daily stand-ups and sprint reviews.", impact: "Boosted real-time software project delivery competence." }
    ],
    eventsAndAssociation: {
      associationName: "APP-INVENT - MCA Student Association",
      motto: "Think. Code. Deploy.",
      president: "V. Sandeep (Final Year MCA)",
      facultyAdvisor: "Dr. M. Lakshmi Prasanna",
      activitiesSummary: "Conducts bi-weekly hackathons, live app demo battles, and IT industry expert sessions.",
      events: [
        { title: "APP-FEST 2025 - State Level IT Applications Contest", date: "22 February 2025", type: "Technical Fest", venue: "Computer Lab 3", description: "Coding contest, Web sprint, UI/UX prototyping challenge." }
      ]
    }
  },

  // ─── 4. PH.D. COMPUTER SCIENCE & ENGINEERING ───
  "phd-cse": {
    slug: "phd-cse",
    title: "Ph.D. Computer Science & Engineering",
    shortName: "Ph.D. CSE",
    department: "Computer Science & Engineering",
    school: "School of Computing Sciences",
    level: "Doctoral",
    degreeType: "Ph.D.",
    duration: "3-5 Years (Doctoral Research)",
    intake: "10 Research Seats per Cycle",
    eligibility: "Master's Degree in CSE / IT / relevant discipline with minimum 55% aggregate (50% for SC/ST) / Valid UGC-NET / GATE / University Entrance Examination",
    careerRoles: ["Professor / Senior Academician", "Principal Research Scientist", "Chief Technology Officer (CTO)", "Director of R&D", "Postdoctoral Fellow"],
    about: {
      summary: "The Ph.D. in Computer Science & Engineering is a premier doctoral research program empowering researchers to push the frontiers of theoretical computing, artificial intelligence, cryptographic security, quantum information systems, and scalable distributed architectures.",
      highlights: [
        "Full-time university research fellowships and DST/AICTE project research assistantships",
        "Direct access to state-of-the-art high performance compute clusters and dedicated doctoral workstations",
        "Mandatory publication in high-impact factor SCI/Scopus indexed journals and international conferences",
        "Collaborative research opportunities with leading national and international universities"
      ],
      objectives: [
        "Conduct seminal research advancing state-of-the-art computational theories and technological applications",
        "Cultivate intellectual autonomy, scientific rigor, and academic publication excellence",
        "Produce scholars who will guide future generations of engineers and innovate enterprise intellectual property"
      ]
    },
    hodMessage: {
      hodName: "Dr. K. Srinivasa Rao",
      designation: "Professor, HOD & Research Coordinator",
      qualification: "Ph.D. (IIT Madras), Post-Doc",
      message: "Our doctoral program in CSE provides the highest degree of academic and research independence backed by world-class computational facilities, experienced research guides, and generous research funding support.",
      email: "hod.cse@city.ac.in"
    },
    visionMission: {
      vision: "To be an internationally recognized center of doctoral research producing transformative computing breakthroughs.",
      mission: [
        "Nurture doctoral researchers through rigorous methodology and access to advanced computational infrastructure.",
        "Solve grand challenge problems in computing with direct societal, environmental, and industrial impact.",
        "Promote high-standard ethical research, patent generation, and high-impact factor journal publications."
      ],
      coreValues: ["Academic Integrity", "Scientific Originality", "Deep Inquiry", "Global Relevance"]
    },
    peoPoPso: {
      peos: [
        { id: "PEO-1", title: "Scientific Breakthroughs", desc: "Doctoral graduates will formulate original theories and computational frameworks published in world-leading journals." },
        { id: "PEO-2", title: "Academic & Corporate Leadership", desc: "Graduates will assume senior academic chairs, principal investigator roles, and CTO positions." }
      ],
      pos: [
        { id: "PO-1", title: "Original Research Formulation", desc: "Ability to independently formulate original research inquiries and design rigorous experimental validation." },
        { id: "PO-2", title: "Scholarly Dissemination", desc: "Ability to write peer-reviewed scientific papers and present research findings to global academic audiences." }
      ],
      psos: [
        { id: "PSO-1", title: "Frontier Computing Contributions", desc: "Contribute novel algorithmic, structural, or architectural innovations to the global computer science body of knowledge." }
      ]
    },
    facultyList: [
      { name: "Dr. K. Srinivasa Rao", designation: "Professor & Doctoral Supervisor", qualification: "Ph.D. (IIT Madras)", specialization: "Distributed Systems, Cloud Architecture", experience: "22 Years", email: "ksrao.cse@city.ac.in" },
      { name: "Dr. P. Venkata Ramana", designation: "Professor & Doctoral Supervisor", qualification: "Ph.D. (NIT Warangal)", specialization: "Algorithms, Neural Machine Learning", experience: "18 Years", email: "pvramana.cse@city.ac.in" },
      { name: "Dr. M. Lakshmi Prasanna", designation: "Associate Professor & Doctoral Supervisor", qualification: "Ph.D. (JNTUK)", specialization: "Cybersecurity, Cryptographic Systems", experience: "14 Years", email: "mlprasanna.cse@city.ac.in" }
    ],
    placements: {
      highestPackage: "₹38.00 LPA",
      averagePackage: "₹18.50 LPA",
      placementRate: "100%",
      topRecruiters: ["Microsoft Research", "IBM Research India", "ISRO", "DRDO Labs", "Top Central & State Universities"],
      placedStudents: [
        { name: "Dr. K. V. Subramanyam", company: "IBM Research", package: "₹38.00 LPA", role: "Staff Research Scientist" },
        { name: "Dr. S. Bhavani", company: "Central University", package: "₹18.00 LPA", role: "Assistant Professor" }
      ]
    },
    laboratories: [
      { name: "Doctoral Research Scholars Computing Hub", capacity: "25 Dedicated Cubicles", equipment: ["Dedicated Multi-GPU Compute Nodes", "NVIDIA RTX 6000 Ada GPU", "Dual 4K Monitors"], software: ["MATLAB", "OriginLab Pro", "Overleaf Pro", "LaTeX", "TensorFlow", "PyTorch"] }
    ],
    achievements: [
      { title: "DST SERB Research Grant Award", category: "Patent", year: "2024", desc: "Doctoral scholar awarded direct DST-SERB research fellowship grant." }
    ],
    syllabus: {
      regulation: "Academic Regulations R26 (Ph.D. Coursework & Thesis)",
      curriculumPdfUrl: "/academics/curriculum/phd-cse-r26.pdf",
      semesters: [
        {
          semNumber: "Coursework Semester 1",
          credits: 12,
          subjects: [
            { code: "26PHD01", name: "Research Methodology, Quantitative Methods & IPR", type: "Theory", credits: 4 },
            { code: "26PHD02", name: "Advanced Computing Paradigms & Algorithmics", type: "Theory", credits: 4 },
            { code: "26PHD03", name: "Elective - Area of Specialization Paper", type: "Theory", credits: 4 }
          ]
        },
        {
          semNumber: "Comprehensive Viva & Research Semesters 2 to 6",
          credits: 48,
          subjects: [
            { code: "26PHD04", name: "Comprehensive Viva Voce Examination", type: "Project", credits: 4 },
            { code: "26PHD05", name: "Colloquium Presentation & Progress Review", type: "Project", credits: 8 },
            { code: "26PHD06", name: "Pre-Submission Seminar & Final Thesis Defense", type: "Project", credits: 36 }
          ]
        }
      ]
    },
    library: {
      volumesCount: "Full Digital Access to Scopus & Web of Science",
      titlesCount: "Doctoral Dissertations Archive",
      nationalJournals: "Comprehensive Database",
      internationalJournals: "Comprehensive Database",
      digitalAccess: ["IEEE Xplore", "ACM DL", "ScienceDirect", "Springer Nature", "Taylor & Francis"],
      eResources: ["Full-text institutional access to all SCI/SCIE Journals"]
    },
    newsletters: [],
    magazines: [],
    mous: [],
    research: {
      thrustAreas: ["Next-Gen Distributed Consensus", "Deep Geometric Learning", "Post-Quantum Cryptography"],
      publicationsCount: 180,
      patentsPublished: 32,
      patentsGranted: 11,
      activeScholars: 28,
      keyPublications: [
        { title: "Information Theoretic Bounds in Edge Consensus Networks", journal: "IEEE Transactions on Information Theory", authors: "Dr. K. Srinivasa Rao, Scholar Team", year: "2025" }
      ]
    },
    professionalSocieties: [],
    rollOfHonour: [],
    fundingProjects: [],
    teachingInnovations: [],
    eventsAndAssociation: {
      associationName: "DOCTORAL COLLOQUIUM FORUM",
      motto: "Advancing Frontiers of Science",
      president: "Dr. K. V. Subramanyam",
      facultyAdvisor: "Dr. K. Srinivasa Rao",
      activitiesSummary: "Bi-weekly research paper colloquiums, doctoral symposiums, and visiting professor sessions.",
      events: []
    }
  },

  // ─── 5. B.TECH. ELECTRONICS & COMMUNICATION ENGINEERING (ECE) ───
  "btech-ece": {
    slug: "btech-ece",
    title: "B.Tech. Electronics & Communication Engineering",
    shortName: "B.Tech. ECE",
    department: "Electronics and Communication Engineering",
    school: "School of Engineering",
    level: "Undergraduate",
    degreeType: "B.Tech.",
    duration: "4 Years (8 Semesters)",
    intake: "180 Seats",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics (Min 50% Marks) / Valid EAPCET / JEE Score",
    careerRoles: ["VLSI Design Engineer", "Embedded Systems Developer", "Telecom Specialist", "RF Engineer", "IoT Systems Architect"],
    about: {
      summary: "The B.Tech. in Electronics & Communication Engineering (ECE) at Chalapathi University provides comprehensive education in semiconductor microelectronics, VLSI design, signal processing, embedded systems, wireless communications, and IoT technologies.",
      highlights: [
        "Advanced VLSI Design & EDA Tools Lab with Cadence, Synopsys, and Mentor Graphics licenses",
        "Hands-on Embedded Systems and Robotics prototyping with ARM Cortex, FPGA, and DSP kits",
        "5G Wireless Communication & Microwave Antenna testing lab",
        "Active MOUs with semiconductor companies and telecom hardware leaders"
      ],
      objectives: [
        "Equip students with deep knowledge of semiconductor devices, integrated circuits, and communication systems",
        "Train scholars in modern EDA tool flows, RTL Verilog coding, and FPGA hardware implementations",
        "Cultivate creative hardware-software co-design abilities for automotive, aerospace, and biomedical electronics"
      ]
    },
    hodMessage: {
      hodName: "Dr. P. Mallikarjuna Rao",
      designation: "Professor & Head of the Department",
      qualification: "Ph.D. (ECE - IIT Kharagpur), M.Tech., FIE, SMIEEE",
      message: "The semiconductor and communications sector is experiencing explosive growth globally with India's semiconductor mission. At Chalapathi University, our ECE department is at the forefront of this revolution, training students in advanced VLSI, chip layout, and modern 5G communications.",
      email: "hod.ece@city.ac.in"
    },
    visionMission: {
      vision: "To be a premier center of excellence in electronics and communication engineering education, producing industry-ready chip designers and communication engineers.",
      mission: [
        "Provide rigorous education in electronic circuits, semiconductor devices, VLSI, and communication networks.",
        "Establish advanced laboratories and research centers in microelectronics and embedded systems.",
        "Promote industry collaboration, internships, and core placement opportunities in semiconductor firms."
      ],
      coreValues: ["Precision & Innovation", "Technical Excellence", "Ethics", "Continuous Research"]
    },
    peoPoPso: {
      peos: [
        { id: "PEO-1", title: "Core Semiconductor Mastery", desc: "Graduates will excel in VLSI design, semiconductor testing, and embedded hardware development in top electronics MNCs." },
        { id: "PEO-2", title: "Communications & Signal Innovation", desc: "Graduates will engineer wireless systems, signal processing pipelines, and satellite communication networks." },
        { id: "PEO-3", title: "Advanced Research & Leadership", desc: "Graduates will pursue M.Tech/Ph.D. studies or lead electronic hardware product development teams." }
      ],
      pos: [
        { id: "PO-1", title: "Engineering Knowledge", desc: "Apply mathematical and physical principles to electronic circuit design and communication problems." },
        { id: "PO-2", title: "Hardware Design & Verification", desc: "Design analog and digital integrated circuits adhering to industry timing and power standards." }
      ],
      psos: [
        { id: "PSO-1", title: "VLSI & Chip Design", desc: "Ability to write RTL code, simulate, synthesize, and layout ASIC/FPGA designs using industry EDA suites." },
        { id: "PSO-2", title: "Embedded & IoT Networks", desc: "Ability to develop real-time embedded firmware, sensor interfaces, and connected wireless edge systems." }
      ]
    },
    facultyList: [
      { name: "Dr. P. Mallikarjuna Rao", designation: "Professor & HOD", qualification: "Ph.D. (IIT Kharagpur)", specialization: "VLSI Design & Nanoelectronics", experience: "24 Years", email: "pmrao.ece@city.ac.in" },
      { name: "Dr. K. Radha Krishna", designation: "Professor", qualification: "Ph.D. (NIT Trichy)", specialization: "Wireless Communications & 5G Systems", experience: "19 Years", email: "krkrishna.ece@city.ac.in" },
      { name: "Dr. B. V. S. Sailaja", designation: "Associate Professor", qualification: "Ph.D. (JNTUK)", specialization: "Digital Signal & Image Processing", experience: "15 Years", email: "sailaja.ece@city.ac.in" },
      { name: "Prof. N. Srinivasa Rao", designation: "Associate Professor", qualification: "M.Tech., (Ph.D.)", specialization: "Embedded Systems & IoT Architectures", experience: "11 Years", email: "nsrao.ece@city.ac.in" }
    ],
    placements: {
      highestPackage: "₹36.00 LPA",
      averagePackage: "₹7.20 LPA",
      placementRate: "95.2%",
      topRecruiters: ["Qualcomm", "Texas Instruments", "Synopsys", "Intel", "Cadence", "L&T Technology Services", "TCS", "Cognizant", "Tata Elxsi"],
      placedStudents: [
        { name: "M. Vamsi Krishna", company: "Qualcomm", package: "₹36.00 LPA", role: "Silicon Design Engineer" },
        { name: "P. Sneha", company: "Synopsys", package: "₹24.00 LPA", role: "RTL Verification Engineer" },
        { name: "K. Rohit", company: "Texas Instruments", package: "₹18.50 LPA", role: "Analog Layout Engineer" }
      ]
    },
    laboratories: [
      { name: "Cadence VLSI & Chip Design Centre of Excellence", capacity: "60 Workstations", equipment: ["High-End Xeon Workstations", "FPGA Xilinx Vivado Boards", "Altera Cyclone Kits"], software: ["Cadence Virtuoso", "Synopsys Design Compiler", "Xilinx Vivado 2024", "Mentor Graphics ModelSim"] },
      { name: "Embedded Systems & ARM Cortex Laboratory", capacity: "60 Workstations", equipment: ["ARM Cortex M4 Development Kits", "Digital Storage Oscilloscopes (100MHz)", "Logic Analyzers", "Keil uVision"] },
      { name: "Microwave, Optical & 5G Communications Lab", capacity: "50 Workstations", equipment: ["Microwave Benches (X-Band)", "Optical Fiber Trainer Kits", "Spectrum Analyzers (3GHz)", "Antenna Trainers"] }
    ],
    achievements: [
      { title: "Texas Instruments Innovation Challenge Winners", category: "Student Award", year: "2024", desc: "Student team won 1st position for building smart automotive ADAS sensory radar." },
      { title: "Centre of Excellence in VLSI by Cadence", category: "Accreditation", year: "2023", desc: "Recognized as a Premier VLSI Training Hub with 60 licenses of Cadence design suite." }
    ],
    syllabus: {
      regulation: "Academic Regulations R26 (Autonomous NEP-Compliant)",
      curriculumPdfUrl: "/academics/curriculum/btech-ece-r26.pdf",
      semesters: [
        {
          semNumber: "Semester 1",
          credits: 20,
          subjects: [
            { code: "26EC101", name: "Calculus & Linear Algebra", type: "Theory", credits: 4 },
            { code: "26EC102", name: "Engineering Physics & Semiconductor Devices", type: "Theory", credits: 3 },
            { code: "26EC103", name: "C Programming & Data Structures", type: "Integrated", credits: 4 },
            { code: "26EC104", name: "Basic Electrical Circuit Analysis", type: "Theory", credits: 3 },
            { code: "26EC105", name: "Engineering Physics Lab", type: "Lab", credits: 1.5 },
            { code: "26EC106", name: "Programming Laboratory", type: "Lab", credits: 1.5 },
            { code: "26EC107", name: "Engineering Workshop & Electronic Hardware Prototyping", type: "Lab", credits: 2 },
            { code: "26EC108", name: "Universal Human Values", type: "Theory", credits: 1 }
          ]
        },
        {
          semNumber: "Semester 2",
          credits: 21,
          subjects: [
            { code: "26EC201", name: "Differential Equations & Vector Calculus", type: "Theory", credits: 4 },
            { code: "26EC202", name: "Electronic Devices & Circuit Theory", type: "Integrated", credits: 4 },
            { code: "26EC203", name: "Digital Logic Design & Verilog HDL", type: "Integrated", credits: 4 },
            { code: "26EC204", name: "Network Theory & Synthesis", type: "Theory", credits: 3 },
            { code: "26EC205", name: "Electronic Devices Lab", type: "Lab", credits: 1.5 },
            { code: "26EC206", name: "Digital Logic Design Lab", type: "Lab", credits: 1.5 },
            { code: "26EC207", name: "Professional English Communication", type: "Theory", credits: 2 },
            { code: "26EC208", name: "English Language Lab", type: "Lab", credits: 1 }
          ]
        }
      ]
    },
    library: {
      volumesCount: "12,200+ Volumes",
      titlesCount: "2,800+ Titles",
      nationalJournals: "20 Subscriptions",
      internationalJournals: "15 Subscriptions",
      digitalAccess: ["IEEE Xplore", "IETE Journals Online", "ScienceDirect"],
      eResources: ["Over 18,000+ e-books in Electronics, Semiconductor, and Telecommunications"]
    },
    newsletters: [
      { title: "ELECTRO-PULSE - ECE Department Newsletter", volume: "Vol. 10", issue: "Issue 2", period: "Jul - Dec 2025", pdfUrl: "#" }
    ],
    magazines: [
      { title: "SILICON VALLEY - Annual ECE Technical Magazine", edition: "2025 Edition", theme: "Semiconductor Fabrication and 6G Communications", editor: "ECE Association", pdfUrl: "#" }
    ],
    mous: [
      { partner: "Cadence Design Systems", country: "USA", scope: "Official university program for EDA software and physical design certification", signedYear: "2023", validity: "Active (5 Years)" },
      { partner: "Texas Instruments India", country: "India", scope: "Embedded Systems and Analog Lab setups and student design contests", signedYear: "2022", validity: "Active (4 Years)" }
    ],
    research: {
      thrustAreas: ["Low Power VLSI Design", "5G/6G Massive MIMO Antennas", "Embedded AI on Microcontrollers", "Biomedical Signal Processing"],
      publicationsCount: 112,
      patentsPublished: 19,
      patentsGranted: 4,
      activeScholars: 22,
      keyPublications: [
        { title: "Energy-Efficient Sub-Threshold CMOS Logic for Ultra-Low Power IoT Nodes", journal: "IEEE Transactions on VLSI Systems", authors: "Dr. P. Mallikarjuna Rao", year: "2024" }
      ]
    },
    professionalSocieties: [
      { name: "IEEE Signal Processing & ComSoc Joint Chapter", chapterId: "IEEE-ECE-CU", counselor: "Dr. K. Radha Krishna", membersCount: "120 Members", recentActivities: ["Antenna Design Workshop with HFSS", "Hands-on FPGA Bootcamp"] },
      { name: "Institution of Electronics and Telecommunication Engineers (IETE)", chapterId: "IETE-ISF-120", counselor: "Dr. B. V. S. Sailaja", membersCount: "180 Members", recentActivities: ["Technical Paper Contest", "Robotics Line Follower Competition"] }
    ],
    rollOfHonour: [
      { studentName: "P. Sai Pranathi", batch: "2021-2025", rankOrMedal: "Gold Medal (1st Rank in ECE)", cgpa: "9.89 / 10.0", achievement: "Top scorer with Qualcomm placement at ₹36 LPA." }
    ],
    fundingProjects: [
      { title: "Design of Multi-Band Reconfigurable Terahertz Antennas for Next-Gen Space Communications", fundingAgency: "ISRO - RESPOND Research Grant", grantAmount: "₹28,40,000", principalInvestigator: "Dr. K. Radha Krishna", duration: "3 Years", status: "Ongoing" }
    ],
    teachingInnovations: [
      { title: "FPGA-in-the-Loop Laboratory Pedagogy", faculty: "Dr. P. Mallikarjuna Rao", methodology: "Students implement and verify digital circuit theory live on Xilinx FPGA hardware during every lecture.", impact: "95% passing rate in core VLSI design." }
    ],
    eventsAndAssociation: {
      associationName: "SPARKS - Electronics & Communication Association",
      motto: "Igniting Silicon Innovations",
      president: "M. Vamsi Krishna (Final Year ECE)",
      facultyAdvisor: "Dr. B. V. S. Sailaja",
      activitiesSummary: "Conducts annual national electronics fest, circuit debugging competitions, and chip-design bootcamps.",
      events: [
        { title: "ELECTRO-SPARK 2025 - National Technical Symposium", date: "25-26 March 2025", type: "Technical Fest", venue: "Auditorium", description: "Hardware project expo, robotics arena, paper presentations, circuit debugging." }
      ]
    }
  },

  // ─── 6. B.TECH. CIVIL ENGINEERING ───
  "btech-civil": {
    slug: "btech-civil",
    title: "B.Tech. Civil Engineering",
    shortName: "B.Tech. Civil",
    department: "Civil Engineering",
    school: "School of Engineering",
    level: "Undergraduate",
    degreeType: "B.Tech.",
    duration: "4 Years (8 Semesters)",
    intake: "60 Seats",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics (Min 50% Marks) / Valid EAPCET / JEE Score",
    careerRoles: ["Structural Design Engineer", "Geotechnical Specialist", "Construction Project Manager", "Transportation Planner", "Environmental Consultant"],
    about: {
      summary: "The B.Tech. in Civil Engineering at Chalapathi University prepares infrastructure creators, structural engineers, and sustainable town planners. The curriculum covers structural mechanics, geotechnical engineering, concrete technology, environmental sustainability, GIS surveying, and smart city infrastructure design.",
      highlights: [
        "NABL-Accredited Material Testing & Concrete Technology Laboratory",
        "Advanced Total Station and Drone-Based Aerial Surveying Training",
        "Industry standard computational structural design using STAAD.Pro, ETABS, and AutoCAD Civil 3D",
        "Active on-site industrial construction visits and consultancy projects"
      ],
      objectives: [
        "Provide thorough foundations in structural analysis, fluid mechanics, soil engineering, and survey mapping",
        "Train students in sustainable green building design, earthquake-resistant engineering, and environmental management",
        "Develop project leadership, estimation accuracy, and ethical compliance for major infrastructure development"
      ]
    },
    hodMessage: {
      hodName: "Dr. K. Chandrasekhara Rao",
      designation: "Professor & Head of the Department",
      qualification: "Ph.D. (Civil - IIT Roorkee), M.Tech. (Structures), FIE, MIRC",
      message: "Civil Engineering is the timeless mother discipline that builds nations. At Chalapathi University, our civil engineers combine classical structural mastery with cutting-edge BIM modeling, drone surveying, and sustainable geo-materials.",
      email: "hod.civil@city.ac.in"
    },
    visionMission: {
      vision: "To produce world-class civil engineers committed to sustainable infrastructure development, innovative structural research, and nation building.",
      mission: [
        "Impart quality education in core civil engineering domains with extensive laboratory and on-site training.",
        "Advance research in sustainable concrete, earthquake engineering, and environmental preservation.",
        "Foster strong industrial consultancy delivering testing and certification for regional infrastructure works."
      ],
      coreValues: ["Structural Integrity", "Sustainability", "Safety & Ethics", "Practical Competence"]
    },
    peoPoPso: {
      peos: [
        { id: "PEO-1", title: "Infrastructure Engineering Excellence", desc: "Graduates will plan, design, and supervise bridges, highways, high-rise buildings, and environmental systems." },
        { id: "PEO-2", title: "Advanced Consulting & Research", desc: "Graduates will consult on complex structural safety problems or pursue advanced postgraduate research." }
      ],
      pos: [
        { id: "PO-1", title: "Engineering Fundamentals", desc: "Apply knowledge of mathematics, geology, mechanics, and fluid dynamics to civil infrastructure problems." },
        { id: "PO-2", title: "Design of Structures", desc: "Design reinforced concrete and steel structures adhering to National Building Codes (NBC) and IS codes." }
      ],
      psos: [
        { id: "PSO-1", title: "Structural & Geotechnical Design", desc: "Ability to analyze and model complex civil structures using STAAD.Pro and ETABS with geotechnical safety considerations." },
        { id: "PSO-2", title: "Construction Management & Surveying", desc: "Ability to execute modern surveying using Total Stations/Drones and manage construction schedules using BIM tools." }
      ]
    },
    facultyList: [
      { name: "Dr. K. Chandrasekhara Rao", designation: "Professor & HOD", qualification: "Ph.D. (IIT Roorkee)", specialization: "Structural Engineering & Concrete Tech", experience: "26 Years", email: "kcrao.civil@city.ac.in" },
      { name: "Dr. M. Suneel Kumar", designation: "Associate Professor", qualification: "Ph.D. (NIT Warangal)", specialization: "Geotechnical & Foundation Engineering", experience: "16 Years", email: "suneel.civil@city.ac.in" },
      { name: "Prof. G. Ramesh Babu", designation: "Assistant Professor", qualification: "M.Tech. (Structural Engg)", specialization: "Transportation & Highway Engineering", experience: "10 Years", email: "ramesh.civil@city.ac.in" }
    ],
    placements: {
      highestPackage: "₹14.50 LPA",
      averagePackage: "₹5.80 LPA",
      placementRate: "91.5%",
      topRecruiters: ["L&T Construction", "Afcons Infrastructure", "Tata Projects", "GMR Group", "NCC Ltd", "Megha Engineering", "Sobha Developers"],
      placedStudents: [
        { name: "B. Suresh Kumar", company: "L&T Construction", package: "₹14.50 LPA", role: "Graduate Engineer Trainee (Structures)" },
        { name: "K. Haritha", company: "Tata Projects", package: "₹8.50 LPA", role: "Site Planning Engineer" }
      ]
    },
    laboratories: [
      { name: "NABL-Accredited Strength of Materials & Concrete Lab", capacity: "40 Students", equipment: ["2000kN Digital Compression Testing Machine", "Universal Testing Machine (UTM 1000kN)", "Rebound Hammer", "Ultrasonic Pulse Velocity Tester"] },
      { name: "Advanced Surveying & GIS Lab", capacity: "40 Students", equipment: ["Leica Total Stations", "Auto Levels", "Garmin DGPS Units", "ArcGIS 10.8 Software"] },
      { name: "Geotechnical & Soil Mechanics Laboratory", capacity: "40 Students", equipment: ["Triaxial Shear Apparatus", "Direct Shear Test Machines", "Standard Penetration Test Kits"] },
      { name: "Computer Aided Design (CAD) & BIM Lab", capacity: "50 Workstations", equipment: ["Dell Precision Workstations"], software: ["STAAD.Pro Connect", "ETABS v21", "AutoCAD Civil 3D", "Revit BIM"] }
    ],
    achievements: [
      { title: "NABL Quality Certification for Concrete Testing", category: "Accreditation", year: "2024", desc: "Civil department testing laboratory received official NABL accreditation for third-party commercial building material certification." }
    ],
    syllabus: {
      regulation: "Academic Regulations R26 (Autonomous NEP-Compliant)",
      curriculumPdfUrl: "/academics/curriculum/btech-civil-r26.pdf",
      semesters: [
        {
          semNumber: "Semester 1",
          credits: 20,
          subjects: [
            { code: "26CE101", name: "Linear Algebra & Differential Equations", type: "Theory", credits: 4 },
            { code: "26CE102", name: "Engineering Chemistry & Material Science", type: "Theory", credits: 3 },
            { code: "26CE103", name: "Engineering Mechanics", type: "Theory", credits: 4 },
            { code: "26CE104", name: "Computer Programming & Python", type: "Integrated", credits: 4 },
            { code: "26CE105", name: "Engineering Chemistry Lab", type: "Lab", credits: 1.5 },
            { code: "26CE106", name: "Engineering Drawing & CAD Drafting Lab", type: "Lab", credits: 2 },
            { code: "26CE107", name: "Universal Human Values", type: "Theory", credits: 1.5 }
          ]
        }
      ]
    },
    library: {
      volumesCount: "8,900+ Volumes",
      titlesCount: "2,100+ Titles",
      nationalJournals: "18 Subscriptions",
      internationalJournals: "10 Subscriptions",
      digitalAccess: ["ASCE Library", "Springer Civil Engineering", "Indian Concrete Institute Journal"],
      eResources: ["Full IS Code Book Digital Repository", "IRC Standards E-Library"]
    },
    newsletters: [
      { title: "NIRMAAN - Civil Engineering Bulletin", volume: "Vol. 9", issue: "Issue 1", period: "Jan - Jun 2025", pdfUrl: "#" }
    ],
    magazines: [
      { title: "STRUCTURES & BEYOND", edition: "2025 Annual Edition", theme: "Green Concrete and Smart City Geotechnics", editor: "Civil Association", pdfUrl: "#" }
    ],
    mous: [
      { partner: "L&T Construction Skill Academy", country: "India", scope: "Practical formwork, bar-bending, and project execution training", signedYear: "2023", validity: "Active (3 Years)" },
      { partner: "Indian Concrete Institute (ICI)", country: "India", scope: "Student chapters, workshops, and material testing certification", signedYear: "2022", validity: "Active (5 Years)" }
    ],
    research: {
      thrustAreas: ["Geopolymer Eco-Friendly Concrete", "Seismic Retrofitting of Structures", "Ground Improvement Techniques"],
      publicationsCount: 84,
      patentsPublished: 11,
      patentsGranted: 3,
      activeScholars: 16,
      keyPublications: [
        { title: "Durability Properties of Fly Ash and Slag Based Geopolymer Concrete Under Marine Environments", journal: "Elsevier Construction and Building Materials", authors: "Dr. K. Chandrasekhara Rao", year: "2024" }
      ]
    },
    professionalSocieties: [
      { name: "American Society of Civil Engineers (ASCE) Student Chapter", chapterId: "ASCE-CU-01", counselor: "Dr. M. Suneel Kumar", membersCount: "90 Members", recentActivities: ["Bridge Model Prototyping Challenge", "National Structural Design Competition"] },
      { name: "Indian Concrete Institute (ICI) Student Chapter", chapterId: "ICI-AP-14", counselor: "Dr. K. Chandrasekhara Rao", membersCount: "130 Members", recentActivities: ["Concrete Cube Strength Contest", "Green Construction Materials Seminar"] }
    ],
    rollOfHonour: [
      { studentName: "K. Bhanu Prakash", batch: "2021-2025", rankOrMedal: "Gold Medal (1st Rank in Civil)", cgpa: "9.76 / 10.0", achievement: "Top Ranker and joined L&T Construction." }
    ],
    fundingProjects: [
      { title: "Utilization of Industrial Hazardous Waste Slag in High-Strength Pavement Concrete", fundingAgency: "UGC Major Research Project", grantAmount: "₹16,80,000", principalInvestigator: "Dr. K. Chandrasekhara Rao", duration: "3 Years", status: "Ongoing" }
    ],
    teachingInnovations: [
      { title: "Virtual 3D Structural Walkthroughs", faculty: "Prof. G. Ramesh Babu", methodology: "Using Revit BIM models to visualize internal reinforcement detailing before theoretical design lectures.", impact: "98% comprehension in structural design exams." }
    ],
    eventsAndAssociation: {
      associationName: "CEA - Civil Engineering Association",
      motto: "Building Dreams into Reality",
      president: "B. Suresh Kumar",
      facultyAdvisor: "Dr. M. Suneel Kumar",
      activitiesSummary: "Conducts annual civil engineering fest 'NIRMANA', bridge designing contests, and Total Station survey camps.",
      events: [
        { title: "NIRMANA 2025 - National Level Civil Symposium", date: "12-13 March 2025", type: "Technical Fest", venue: "Civil Block & Grounds", description: "Cad drafting war, concrete testing challenge, survey hunt, paper presentations." }
      ]
    }
  },

  // ─── 7. MASTER OF BUSINESS ADMINISTRATION (MBA) ───
  "mba": {
    slug: "mba",
    title: "Master of Business Administration (MBA)",
    shortName: "MBA",
    department: "Business and Management",
    school: "School of Business & Management",
    level: "Postgraduate",
    degreeType: "MBA",
    duration: "2 Years (4 Semesters)",
    intake: "180 Seats",
    eligibility: "Any recognized Bachelor's Degree with minimum 50% marks (45% for reserved categories) / Valid APICET / CAT / MAT / XAT Score",
    careerRoles: ["Financial Analyst", "Marketing Strategist", "Human Resource Manager", "Business Analytics Consultant", "Operations Lead", "Corporate Banker"],
    about: {
      summary: "The Master of Business Administration (MBA) at Chalapathi University is a premier dual-specialization postgraduate management program. We groom visionary business leaders, financial analysts, marketing innovators, and corporate strategists equipped with data-driven decision-making and global business ethics.",
      highlights: [
        "Dual Specializations in Finance, Marketing, Human Resource Management, and Business Analytics",
        "Harvard Business Publishing Case Study Method incorporated into daily classroom pedagogy",
        "Mandatory 8-Week Corporate Summer Internship Program with multinational companies",
        "Live Business Simulation Games, Bloomberg Terminal Access, and Stock Trading Lab",
        "Executive Leadership Web-series with CXOs, IIM Professors, and Startup Founders"
      ],
      objectives: [
        "Cultivate strategic thinking, financial acumen, and marketing prowess for multinational corporate management",
        "Provide thorough practical mastery over business analytics, financial modeling, and supply chain logistics",
        "Instill exemplary ethical leadership, cross-cultural communication, and entrepreneurial competence"
      ]
    },
    hodMessage: {
      hodName: "Dr. S. K. Venkatesh",
      designation: "Professor & Director, School of Business & Management",
      qualification: "Ph.D. (Management - IIM Bangalore), MBA (Finance & Marketing), UGC-NET",
      message: "At Chalapathi School of Business & Management, we do not just teach management theories — we build business leaders who navigate volatility, spark innovation, and lead global teams with ethical conviction and analytical precision.",
      email: "director.mgmt@city.ac.in"
    },
    visionMission: {
      vision: "To be recognized as a premier center for transformative management education, business research, and visionary executive leadership.",
      mission: [
        "Deliver rigorous, case-based management education integrating digital business analytics and strategic leadership.",
        "Facilitate experiential corporate learning through live internships, executive mentoring, and industry consultancy.",
        "Promote high-quality business research addressing global economic challenges and sustainable enterprise creation."
      ],
      coreValues: ["Strategic Leadership", "Integrity & Ethics", "Analytical Rigor", "Social Responsibility"]
    },
    peoPoPso: {
      peos: [
        { id: "PEO-1", title: "Corporate Management Leadership", desc: "Graduates will assume mid-to-senior corporate management, strategic planning, and leadership roles globally." },
        { id: "PEO-2", title: "Data-Driven Business Decisions", desc: "Graduates will leverage financial models, marketing analytics, and operational metrics to drive enterprise growth." },
        { id: "PEO-3", title: "Entrepreneurship & Venture Creation", desc: "Graduates will launch and scale viable business ventures or manage family enterprises successfully." }
      ],
      pos: [
        { id: "PO-1", title: "Managerial Acumen", desc: "Apply comprehensive knowledge of finance, marketing, organizational behavior, and economics to enterprise challenges." },
        { id: "PO-2", title: "Strategic Problem Solving", desc: "Formulate data-backed strategic solutions to complex business problems in fast-changing market conditions." }
      ],
      psos: [
        { id: "PSO-1", title: "Financial & Market Analytics", desc: "Ability to conduct enterprise valuation, investment portfolio management, and consumer market intelligence." },
        { id: "PSO-2", title: "HR & Operational Excellence", desc: "Ability to design organizational talent management frameworks, supply chain networks, and operational optimization strategies." }
      ]
    },
    facultyList: [
      { name: "Dr. S. K. Venkatesh", designation: "Professor & Director", qualification: "Ph.D. (IIM Bangalore), MBA", specialization: "Financial Strategies & Corporate Governance", experience: "25 Years", email: "skvenkatesh.mba@city.ac.in" },
      { name: "Dr. V. Uma Maheswari", designation: "Professor", qualification: "Ph.D. (Andhra University), MBA", specialization: "Marketing Management & Consumer Analytics", experience: "18 Years", email: "uma.mba@city.ac.in" },
      { name: "Dr. P. Kishore Kumar", designation: "Associate Professor", qualification: "Ph.D. (JNTUK), MBA", specialization: "Human Resource Strategy & Organizational Behavior", experience: "14 Years", email: "kishore.mba@city.ac.in" },
      { name: "Prof. K. Swetha", designation: "Assistant Professor", qualification: "MBA, (Ph.D.)", specialization: "Business Analytics & Fintech", experience: "8 Years", email: "swetha.mba@city.ac.in" }
    ],
    placements: {
      highestPackage: "₹18.00 LPA",
      averagePackage: "₹6.80 LPA",
      placementRate: "96.0%",
      topRecruiters: ["HDFC Bank", "ICICI Securities", "Deloitte", "KPMG", "EY India", "Kotak Mahindra", "Asian Paints", "ITC Ltd", "Amazon", "Bain Capability Network"],
      placedStudents: [
        { name: "P. Rajesh Varma", company: "Deloitte India", package: "₹18.00 LPA", role: "Management Consultant" },
        { name: "K. Mounika", company: "HDFC Bank", package: "₹12.50 LPA", role: "Assistant Vice President - Branch Banking" },
        { name: "S. Sai Teja", company: "Asian Paints", package: "₹9.80 LPA", role: "Area Sales Manager" }
      ]
    },
    laboratories: [
      { name: "Financial Analytics & Stock Trading Simulation Lab", capacity: "60 Terminals", equipment: ["Live NSE/BSE Stock Feeds", "Financial Simulation Software", "Tableau & PowerBI Terminals"] },
      { name: "Executive Business Communication & GD Lab", capacity: "40 Seats", equipment: ["Acoustic Soundproofing", "High-Definition Video Recording", "Roundtable Boardroom Setup"] }
    ],
    achievements: [
      { title: "Top-50 B-School Ranking in South India", category: "Accreditation", year: "2024", desc: "Ranked among the premier top-tier business management institutions for corporate placements." }
    ],
    syllabus: {
      regulation: "Academic Regulations R26 (MBA Dual Specialization)",
      curriculumPdfUrl: "/academics/curriculum/mba-r26.pdf",
      semesters: [
        {
          semNumber: "Semester 1",
          credits: 24,
          subjects: [
            { code: "26MBA101", name: "Management Theory & Organizational Behavior", type: "Theory", credits: 4 },
            { code: "26MBA102", name: "Managerial Economics", type: "Theory", credits: 4 },
            { code: "26MBA103", name: "Accounting for Managers & Financial Reporting", type: "Theory", credits: 4 },
            { code: "26MBA104", name: "Quantitative Techniques & Business Statistics", type: "Theory", credits: 4 },
            { code: "26MBA105", name: "Marketing Management", type: "Theory", credits: 4 },
            { code: "26MBA106", name: "Executive Business Communication Lab", type: "Lab", credits: 2 },
            { code: "26MBA107", name: "Business Analytics using Excel & PowerBI Lab", type: "Lab", credits: 2 }
          ]
        },
        {
          semNumber: "Semester 2",
          credits: 24,
          subjects: [
            { code: "26MBA201", name: "Financial Management", type: "Theory", credits: 4 },
            { code: "26MBA202", name: "Human Resource Management", type: "Theory", credits: 4 },
            { code: "26MBA203", name: "Production & Operations Management", type: "Theory", credits: 4 },
            { code: "26MBA204", name: "Business Research Methods & Data Analytics", type: "Theory", credits: 4 },
            { code: "26MBA205", name: "International Business Environment", type: "Theory", credits: 4 },
            { code: "26MBA206", name: "Data Visualization & Tableau Lab", type: "Lab", credits: 2 },
            { code: "26MBA207", name: "Summer Internship Preparation & Seminar", type: "Project", credits: 2 }
          ]
        }
      ]
    },
    library: {
      volumesCount: "16,000+ MBA Volumes",
      titlesCount: "3,800+ Titles",
      nationalJournals: "28 Management Journals",
      internationalJournals: "16 International Subscriptions",
      digitalAccess: ["Harvard Business Review Digital", "EBSCO Business Source Elite", "ProQuest Management Database", "CMIE Prowess Database"],
      eResources: ["Over 20,000+ Management E-Books", "Corporate Case Studies Archive"]
    },
    newsletters: [
      { title: "MANAGEMENT HORIZONS - MBA Quarterly Chronicle", volume: "Vol. 11", issue: "Issue 4", period: "Oct - Dec 2025", pdfUrl: "#" }
    ],
    magazines: [
      { title: "CHALAPATHI BUSINESS REVIEW (CBR)", edition: "2025 Annual Edition", theme: "Fintech Disruption and ESG Leadership", editor: "MBA Faculty & Student Editorial Board", pdfUrl: "#" }
    ],
    mous: [
      { partner: "National Stock Exchange (NSE) Academy", country: "India", scope: "Certified financial market analyst certification programs", signedYear: "2023", validity: "Active (3 Years)" },
      { partner: "CII - Confederation of Indian Industry", country: "India", scope: "Industry visits, corporate executive mentorship, and placement summits", signedYear: "2022", validity: "Active (5 Years)" }
    ],
    research: {
      thrustAreas: ["Behavioral Finance & Fintech", "Digital Consumer Behavior", "Talent Analytics & Agile HR"],
      publicationsCount: 96,
      patentsPublished: 7,
      patentsGranted: 2,
      activeScholars: 18,
      keyPublications: [
        { title: "Impact of Fintech Adoption on Retail Banking Consumer Retention in Emerging Markets", journal: "Journal of Financial Services Marketing", authors: "Dr. S. K. Venkatesh", year: "2025" }
      ]
    },
    professionalSocieties: [
      { name: "Hyderabad Management Association (HMA) Student Chapter", chapterId: "HMA-CU-08", counselor: "Dr. V. Uma Maheswari", membersCount: "160 Members", recentActivities: ["CXO Leadership Summit", "Case Analysis Olympiad"] }
    ],
    rollOfHonour: [
      { studentName: "P. Rajesh Varma", batch: "2023-2025", rankOrMedal: "Gold Medal (1st Rank MBA)", cgpa: "9.94 / 10.0", achievement: "Top placement at Deloitte at ₹18 LPA." }
    ],
    fundingProjects: [],
    teachingInnovations: [
      { title: "Harvard Case Method & Live Simulation Battles", faculty: "Dr. S. K. Venkatesh", methodology: "Classroom debate structured around real-world Harvard Business School cases with simulated financial outcomes.", impact: "97% positive student corporate readiness feedback." }
    ],
    eventsAndAssociation: {
      associationName: "MANAGEMENT GUILD - MBA Association",
      motto: "Lead with Vision. Deliver with Impact.",
      president: "P. Rajesh Varma",
      facultyAdvisor: "Dr. V. Uma Maheswari",
      activitiesSummary: "Organizes the annual flagship national management fest 'TYCOON', Stock Market Wars, Ad-Zap, and Business Plan competitions.",
      events: [
        { title: "TYCOON 2025 - National Management Fest", date: "28-29 January 2025", type: "Management Fest", venue: "MBA Seminar Complex", description: "Young Manager hunt, Brand wars, Finance Quiz, B-Plan Pitch to angel investors." }
      ]
    }
  }
};

// Fallback generator for other programs ensuring all 19 sections are completely populated
export function getProgramFullData(slug: string, title?: string, department?: string, school?: string): FullProgramData {
  if (PROGRAM_DETAILS_DATABASE[slug]) {
    return PROGRAM_DETAILS_DATABASE[slug];
  }

  const cleanTitle = title || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const cleanDept = department || "Department of " + cleanTitle;
  const cleanSchool = school || "School of Engineering";
  const isPG = slug.includes("mtech") || slug.includes("mca") || slug.includes("mba") || slug.includes("ms");
  const isPhD = slug.includes("phd") || slug.includes("doctoral");
  const level: "Undergraduate" | "Postgraduate" | "Doctoral" = isPhD ? "Doctoral" : isPG ? "Postgraduate" : "Undergraduate";
  const duration = isPhD ? "3-5 Years (Doctoral)" : isPG ? "2 Years (4 Semesters)" : "4 Years (8 Semesters)";

  return {
    slug,
    title: cleanTitle,
    shortName: cleanTitle,
    department: cleanDept,
    school: cleanSchool,
    level,
    degreeType: isPhD ? "Ph.D." : isPG ? "Postgraduate Degree" : "B.Tech. / Degree",
    duration,
    intake: isPhD ? "8 Seats" : isPG ? "30 Seats" : "120 Seats",
    eligibility: isPhD 
      ? "Master's Degree with minimum 55% marks and qualifying entrance exam score" 
      : isPG 
        ? "Bachelor's Degree in relevant discipline with minimum 50% marks" 
        : "10+2 with Physics, Chemistry & Mathematics with minimum 50% marks",
    careerRoles: ["Domain Engineer", "Research Analyst", "System Architect", "Technical Specialist", "Project Consultant"],
    about: {
      summary: `The ${cleanTitle} program at Chalapathi University is engineered to offer comprehensive academic foundations, practical laboratory rigor, and high-impact industrial skills in ${cleanDept}. Students engage in continuous project work and gain mastery over emerging industry frameworks.`,
      highlights: [
        `Outcome-Based Education (OBE) curriculum designed in alignment with Board of Studies and industry partners`,
        `Advanced specialized laboratory infrastructure with modern hardware and software licenses`,
        `Integrated placement and internship training with top national and global recruiters`,
        `Opportunities for student research publications, patents, and technical paper presentations`
      ],
      objectives: [
        `Impart core domain knowledge and practical problem-solving capabilities`,
        `Foster research acumen, ethical values, and professional leadership skills`,
        `Prepare graduates for lucrative industry placements and premier higher education`
      ]
    },
    hodMessage: {
      hodName: `Prof. Coordinator (${cleanDept})`,
      designation: "Program Coordinator",
      qualification: "Ph.D. / M.Tech., Senior Member IEEE",
      message: `Welcome to the ${cleanTitle} program at Chalapathi University. We are dedicated to providing our students with top-tier academic rigor, hands-on laboratory experiences, and continuous mentorship to thrive in dynamic professional careers.`,
      email: `coordinator.${slug}@city.ac.in`
    },
    visionMission: {
      vision: `To be recognized for academic excellence, innovative research, and leadership in ${cleanDept}.`,
      mission: [
        `Deliver high-quality curriculum blending theoretical foundations with practical mastery.`,
        `Establish state-of-the-art laboratory facilities and collaborative research centers.`,
        `Partner with industry leaders for student internships, guest lectures, and placement opportunities.`
      ],
      coreValues: ["Academic Excellence", "Integrity", "Innovation", "Social Responsibility"]
    },
    peoPoPso: {
      peos: [
        { id: "PEO-1", title: "Professional Practice", desc: `Graduates will establish successful professional careers in ${cleanDept} and related multidisciplinary fields.` },
        { id: "PEO-2", title: "Continuous Learning", desc: "Graduates will continuously update their technical knowledge through certifications, research, or higher education." }
      ],
      pos: [
        { id: "PO-1", title: "Domain Knowledge", desc: "Apply foundational and advanced principles to formulate solutions for complex domain problems." },
        { id: "PO-2", title: "Modern Tool Usage", desc: "Select and apply state-of-the-art software and engineering tools to solve real-world problems." }
      ],
      psos: [
        { id: "PSO-1", title: "Technical Competence", desc: `Ability to analyze, design, and execute projects in ${cleanDept} with professional quality.` }
      ]
    },
    facultyList: [
      { name: `Dr. Senior Faculty`, designation: "Professor", qualification: "Ph.D.", specialization: `${cleanDept} Specialization`, experience: "18 Years", email: `faculty1.${slug}@city.ac.in` },
      { name: `Prof. Associate Faculty`, designation: "Associate Professor", qualification: "M.Tech., (Ph.D.)", specialization: `Advanced Core Systems`, experience: "12 Years", email: `faculty2.${slug}@city.ac.in` }
    ],
    placements: {
      highestPackage: "₹18.00 LPA",
      averagePackage: "₹6.50 LPA",
      placementRate: "92.0%",
      topRecruiters: ["TCS", "Infosys", "Wipro", "Cognizant", "Capgemini", "Accenture", "L&T", "Tech Mahindra"],
      placedStudents: [
        { name: "Student Topper", company: "Top Tech Corp", package: "₹18.00 LPA", role: "Software / Domain Engineer" }
      ]
    },
    laboratories: [
      { name: `${cleanDept} Core Laboratory`, capacity: "60 Workstations", equipment: ["High-Performance Computing Terminals", "Domain Specific Hardware Kits"], software: ["Industry Standard Software Suites"] }
    ],
    achievements: [
      { title: "National Level Student Technical Awards", category: "Student Award", year: "2024-2025", desc: "Students secured top honors in national collegiate competitions and project symposiums." }
    ],
    syllabus: {
      regulation: "Academic Regulations R26 (Autonomous NEP-Compliant)",
      curriculumPdfUrl: `/academics/curriculum/${slug}-r26.pdf`,
      semesters: [
        {
          semNumber: "Semester 1",
          credits: 20,
          subjects: [
            { code: "26C101", name: "Core Mathematics & Analytical Methods", type: "Theory", credits: 4 },
            { code: "26C102", name: "Domain Engineering Fundamentals", type: "Theory", credits: 4 },
            { code: "26C103", name: "Programming & Computational Thinking", type: "Integrated", credits: 4 },
            { code: "26C104", name: "Domain Practical Laboratory", type: "Lab", credits: 2 }
          ]
        },
        {
          semNumber: "Semester 2",
          credits: 20,
          subjects: [
            { code: "26C201", name: "Advanced Domain Systems & Applications", type: "Theory", credits: 4 },
            { code: "26C202", name: "Data Structures & Systems Architecture", type: "Integrated", credits: 4 },
            { code: "26C203", name: "Professional Communication & Ethics", type: "Theory", credits: 3 },
            { code: "26C204", name: "Advanced Practical Laboratory", type: "Lab", credits: 2 }
          ]
        }
      ]
    },
    library: {
      volumesCount: "8,500+ Volumes",
      titlesCount: "2,000+ Titles",
      nationalJournals: "14 Journals",
      internationalJournals: "8 Journals",
      digitalAccess: ["IEEE Xplore", "ScienceDirect", "DELNET Online Library"],
      eResources: ["Over 10,000+ domain e-books and research archives"]
    },
    newsletters: [
      { title: `${cleanDept} Newsletter`, volume: "Vol. 5", issue: "Issue 1", period: "Jan - Jun 2025", pdfUrl: "#" }
    ],
    magazines: [
      { title: `${cleanDept} Technical Magazine`, edition: "2025 Annual Edition", theme: `Innovations in ${cleanDept}`, editor: "Editorial Board", pdfUrl: "#" }
    ],
    mous: [
      { partner: "Premier Industry Partner", country: "India", scope: "Training, student internships, and curriculum guidance", signedYear: "2023", validity: "Active (3 Years)" }
    ],
    research: {
      thrustAreas: [`Advanced Topics in ${cleanDept}`, "Computational Intelligence", "System Optimization"],
      publicationsCount: 45,
      patentsPublished: 6,
      patentsGranted: 2,
      activeScholars: 8,
      keyPublications: [
        { title: `Recent Advancements and Industrial Applications in ${cleanDept}`, journal: "Scopus Indexed Journal of Engineering", authors: "Department Faculty Team", year: "2024" }
      ]
    },
    professionalSocieties: [
      { name: "Student Professional Society Chapter", chapterId: "CU-SOC-01", counselor: "Program Coordinator", membersCount: "85 Members", recentActivities: ["Technical Workshop", "Project Exhibition"] }
    ],
    rollOfHonour: [
      { studentName: "Academic Topper", batch: "2021-2025", rankOrMedal: "Gold Medalist (1st Rank)", cgpa: "9.82 / 10.0", achievement: "Top Ranker and high-package placement." }
    ],
    fundingProjects: [
      { title: `Modernization and Research in ${cleanDept}`, fundingAgency: "University & Industry Grant", grantAmount: "₹10,00,000", principalInvestigator: "Program Coordinator", duration: "2 Years", status: "Ongoing" }
    ],
    teachingInnovations: [
      { title: "Project-Based Experiential Learning", faculty: "Program Faculty", methodology: "Continuous project work integrated with theoretical modules.", impact: "High student engagement and project completion rates." }
    ],
    eventsAndAssociation: {
      associationName: `${cleanDept} Student Association`,
      motto: "Learn. Create. Excel.",
      president: "Student President",
      facultyAdvisor: "Faculty Advisor",
      activitiesSummary: "Conducts regular seminars, technical contests, and student development workshops.",
      events: [
        { title: "Annual Technical Symposium & Project Expo", date: "February 2025", type: "Technical Fest", venue: "Department Seminar Hall", description: "Paper presentations, hardware demos, and coding competitions." }
      ]
    }
  };
}
