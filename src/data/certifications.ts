export interface Certification {
  id: string;
  name: string;
  description: string;
  images: string[];
  color: string;
  domain: string;
  tagline: string;
  layoutMode: "dashboard" | "pipeline" | "topology" | "journey" | "shield" | "pcb" | "factory" | "code" | "roadmap" | "cloud" | "global" | "database" | "lifecycle" | "funnel";
  duration: string;
  difficulty: string;
  timeline: { milestone: string; desc: string }[];
  features: { icon: string; title: string; desc: string }[];
  skills: string[];
  industries: { name: string; desc: string }[];
  roadmap: { role: string; exp: string }[];
  companies: string[];
  projects: { name: string; duration: string; difficulty: string }[];
  stats: { countries: number; jobs: string; demand: string };
}

export interface GlobalCertificationsPageConfig {
  badgeText: string;
  headline: string;
  description1: string;
  description2: string;
  worldStageHeadline: string;
  worldStageDescription: string;
  worldStageButtonText: string;
  worldStageButtonLink: string;
}

export const DEFAULT_CERTIFICATIONS_PAGE_CONFIG: GlobalCertificationsPageConfig = {
  badgeText: "Global Certifications",
  headline: "Adding Global Value\nTo Your Degree.",
  description1: "At Chalapathi University, we believe a degree alone isn't enough to stand out in today's competitive world — industry-recognized certifications give students the extra edge employers look for.",
  description2: "Students are provided opportunities to earn globally acclaimed certifications alongside their academic curriculum, boosting their skills, credibility, and career readiness.",
  worldStageHeadline: "Ready for the World Stage.",
  worldStageDescription: "These certifications, combined with academic learning, ensure students graduate as globally competent, industry-ready professionals — confident to compete not just in national markets, but anywhere in the world.",
  worldStageButtonText: "View Curriculum",
  worldStageButtonLink: "/academics/programmes"
};

const baseCerts = [
  { id: "sap", name: "SAP", desc: "Enterprise Resource Planning (ERP), business processes, supply chain, finance, and analytics.", img: ["https://www.vectorlogo.zone/logos/sap/sap-ar21.svg"], color: "#0FAFFF", domain: "Enterprise Resource Planning", tagline: "Transforming Enterprise Operations", mode: "dashboard" },
  { id: "servicenow", name: "ServiceNow", desc: "AI-powered workflow automation, IT service management, and digital operations.", img: ["https://upload.wikimedia.org/wikipedia/commons/5/57/ServiceNow_logo.svg"], color: "#81B5A1", domain: "Workflow Automation", tagline: "Mastering the Workflow Pipeline", mode: "pipeline" },
  { id: "juniper-networks", name: "Juniper Networks", desc: "AI-native networking, cloud infrastructure, and cybersecurity.", img: ["https://upload.wikimedia.org/wikipedia/commons/3/31/Juniper_Networks_logo.svg"], color: "#78A22F", domain: "Network Topology", tagline: "Building AI-Native Networks", mode: "topology" },
  { id: "salesforce", name: "Salesforce", desc: "Customer Relationship Management (CRM), sales automation, and business analytics.", img: ["https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg"], color: "#00A1E0", domain: "CRM & Customer Journey", tagline: "Revolutionizing Customer Success", mode: "journey" },
  { id: "zscaler", name: "Zscaler", desc: "Zero Trust Security, SASE, and cloud cybersecurity.", img: ["https://upload.wikimedia.org/wikipedia/en/f/fa/Zscaler_logo.svg"], color: "#0054A6", domain: "Cybersecurity Shield", tagline: "Securing the Cloud with Zero Trust", mode: "shield" },
  { id: "microchip", name: "Microchip", desc: "Embedded systems, IoT, microcontrollers, and Industry 4.0.", img: ["https://upload.wikimedia.org/wikipedia/commons/5/54/Microchip_Technology_logo.svg"], color: "#E42528", domain: "PCB & IoT Ecosystem", tagline: "Powering Smart Embedded Solutions", mode: "pcb" },
  { id: "addverb-robotics", name: "Addverb Robotics", desc: "Robotics, intelligent automation, warehouse automation, and AI-driven manufacturing.", img: ["https://upload.wikimedia.org/wikipedia/commons/8/8b/Addverb_logo.png"], color: "#F97316", domain: "Intelligent Automation", tagline: "Automating the Future Factory", mode: "factory" },
  { id: "codechef", name: "CodeChef", desc: "Competitive programming, coding, and algorithmic problem-solving.", img: ["https://cdn.codechef.com/images/cc-logo.svg"], color: "#5B4638", domain: "Algorithmic Mastery", tagline: "Conquering Complex Algorithms", mode: "code" },
  { id: "nptel", name: "NPTEL", desc: "IIT/IISc-certified courses in engineering, technology, sciences, and management.", img: ["/nptel-logo.png"], color: "#072A6C", domain: "IIT Learning Roadmap", tagline: "Excellence through Elite Institutions", mode: "roadmap" },
  { id: "aws-azure-gcp", name: "AWS, Azure & Google Cloud", desc: "Cloud computing, AI, DevOps, cybersecurity, and data engineering.", img: ["/cloud-providers-v2.png"], color: "#FF9900", domain: "Cloud Architecture", tagline: "Architecting Scalable Cloud Ecosystems", mode: "cloud" },
  { id: "coursera-edx", name: "Coursera & edX", desc: "Advanced specializations from Ivy League universities and global tech giants.", img: ["https://upload.wikimedia.org/wikipedia/commons/5/5f/Coursera_logo_%282020%29.svg", "https://upload.wikimedia.org/wikipedia/commons/8/8f/EdX.svg"], color: "#0056D2", domain: "Global Specializations", tagline: "Learning from the World's Best", mode: "global" },
  { id: "oracle-java", name: "Oracle & Java", desc: "Database management, Java programming, and enterprise application development.", img: ["https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg", "https://www.vectorlogo.zone/logos/java/java-ar21.svg"], color: "#F80000", domain: "Enterprise Systems", tagline: "Mastering Data and Applications", mode: "database" },
  { id: "six-sigma-pmp", name: "Six Sigma & PMP", desc: "Quality management, process improvement, and project management.", img: ["/pmp.png"], color: "#8B5CF6", domain: "Project Lifecycle", tagline: "Driving Quality and Efficiency", mode: "lifecycle" },
  { id: "digital-marketing", name: "Digital Marketing", desc: "SEO, SEM, social media marketing, analytics, and branding (Google, HubSpot & Meta).", img: ["/digital-marketing.png"], color: "#0668E1", domain: "Marketing Funnel", tagline: "Optimizing the Digital Funnel", mode: "funnel" }
];

export const certifications: Certification[] = baseCerts.map((cert) => ({
  id: cert.id,
  name: cert.name,
  description: cert.desc,
  images: cert.img,
  color: cert.color,
  domain: cert.domain,
  tagline: cert.tagline,
  layoutMode: cert.mode as any,
  duration: "3-6 Months",
  difficulty: "Advanced",
  timeline: [
    { milestone: "Foundation", desc: "Understanding the basics of " + cert.name },
    { milestone: "Core Concepts", desc: "Deep dive into architecture and design" },
    { milestone: "Hands-on Labs", desc: "Practical scenarios and deployments" },
    { milestone: "Industry Projects", desc: "Real-world capstone implementation" },
    { milestone: "Assessment", desc: "Mock exams and evaluations" },
    { milestone: "Certification", desc: "Earning the official global credential" }
  ],
  features: [
    { icon: "Briefcase", title: "Increase Employability", desc: "Gain globally recognized skills valued by top recruiters." },
    { icon: "Zap", title: "Industry Ready", desc: "Master tools used in real companies." },
    { icon: "TrendingUp", title: "Higher Salary Potential", desc: "Develop specialized expertise that increases career opportunities." },
    { icon: "Globe", title: "Global Opportunities", desc: "Recognized across multiple countries and industries." }
  ],
  skills: ["Cloud Computing", "Architecture", "Security", "DevOps", "Networking", "Database", "Analytics", "AI/ML"],
  industries: [
    { name: "Manufacturing", desc: "Automating supply chains" },
    { name: "Banking", desc: "Securing financial data" },
    { name: "Healthcare", desc: "Managing patient systems" },
    { name: "IT & Tech", desc: "Building scalable platforms" }
  ],
  roadmap: [
    { role: "Student", exp: "0 Yrs" },
    { role: "Certified Professional", exp: "0-1 Yrs" },
    { role: "Junior Engineer", exp: "1-3 Yrs" },
    { role: "Senior Engineer", exp: "3-5 Yrs" },
    { role: "Architect", exp: "5-8 Yrs" },
    { role: "Consultant / Lead", exp: "8+ Yrs" }
  ],
  companies: ["Amazon", "Google", "Microsoft", "TCS", "Infosys", "Wipro", "Accenture", "IBM", "Deloitte", "Capgemini"],
  projects: [
    { name: "Enterprise Dashboard", duration: "4 Weeks", difficulty: "Hard" },
    { name: "Cloud Infrastructure Setup", duration: "3 Weeks", difficulty: "Medium" },
    { name: "Workflow Automation API", duration: "2 Weeks", difficulty: "Medium" }
  ],
  stats: {
    countries: 140,
    jobs: "500K+",
    demand: "Growing 25% YoY"
  }
}));
