import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, X, ArrowRight, Sparkles, BookOpen, GraduationCap, Building, Briefcase,
  Shield, Award, FileText, CheckSquare, TrendingUp, Home, Bus, Library, Trophy,
  Microscope, Phone, MapPin, User, Star, CheckCircle2, Globe, Laptop, Cpu, Database,
  Radio, Microchip, Activity, Scale, Utensils, Wifi, Heart, Users, Lock, Flag,
  Lightbulb, Rocket, TestTube, UserCheck, Layers, Calendar, Newspaper, Image, Medal,
  FileCheck, FileEdit, BarChart2, CalendarDays, Eye, ChevronRight, Landmark
} from "lucide-react";

export interface SearchItem {
  id: string;
  title: string;
  category: "Programs" | "Schools" | "Admissions" | "Placements" | "Facilities" | "Research" | "Governance" | "Leadership" | "Contact" | "Media";
  route: string;
  keywords: string[];
  description?: string;
  icon: React.ElementType;
}

export const SEARCH_INDEX: SearchItem[] = [
  // Programs
  {
    id: "btech-cse",
    title: "B.Tech. Computer Science & Engineering (CSE)",
    category: "Programs",
    route: "/academics/btech-cse",
    keywords: ["cse", "computer science", "btech cse", "coding", "software", "engg", "engineering"],
    description: "4-Year Undergraduate Degree in Computer Science & Software Engineering",
    icon: Laptop
  },
  {
    id: "mtech-cse",
    title: "M.Tech. Computer Science & Engineering",
    category: "Programs",
    route: "/academics/mtech-cse",
    keywords: ["mtech cse", "mtech computer science", "postgraduate cse", "pg cse"],
    description: "Advanced Master Degree in Distributed Computing & Systems",
    icon: Laptop
  },
  {
    id: "mca",
    title: "Master of Computer Applications (MCA)",
    category: "Programs",
    route: "/academics/mca",
    keywords: ["mca", "master of computer applications", "computer applications"],
    description: "2-Year Professional Master Degree in Computer Applications",
    icon: CodeIcon
  },
  {
    id: "phd-cse",
    title: "Ph.D. Computer Science & Engineering",
    category: "Programs",
    route: "/academics/phd-cse",
    keywords: ["phd cse", "phd computer science", "doctorate cse", "research cse"],
    description: "Doctoral Research Program in Advanced Computing",
    icon: GraduationCap
  },
  {
    id: "btech-aiml",
    title: "B.Tech. AI & Machine Learning (AIML)",
    category: "Programs",
    route: "/academics/btech-aiml",
    keywords: ["ai", "aiml", "artificial intelligence", "machine learning", "btech ai"],
    description: "Specialized Degree in Artificial Intelligence & Deep Learning",
    icon: Cpu
  },
  {
    id: "btech-data-science",
    title: "B.Tech. CSE (Data Science)",
    category: "Programs",
    route: "/academics/btech-cse-data-science",
    keywords: ["data science", "ds", "btech data science", "big data", "analytics"],
    description: "Data Science, Analytics & Big Data Engineering",
    icon: Database
  },
  {
    id: "btech-cyber-security",
    title: "B.Tech. CSE (Cyber Security)",
    category: "Programs",
    route: "/academics/btech-cse-cyber-security",
    keywords: ["cyber security", "security", "ethical hacking", "infosec"],
    description: "Information Security, Network Protection & Cryptography",
    icon: Shield
  },
  {
    id: "btech-ece",
    title: "B.Tech. Electronics & Communication (ECE)",
    category: "Programs",
    route: "/academics/btech-ece",
    keywords: ["ece", "electronics", "communication", "btech ece", "circuitry"],
    description: "Electronics, Wireless Communications & Signal Processing",
    icon: Radio
  },
  {
    id: "mtech-vlsi",
    title: "M.Tech. VLSI & Embedded Systems Design",
    category: "Programs",
    route: "/academics/mtech-vlsi",
    keywords: ["vlsi", "embedded", "embedded systems", "chip design", "mtech vlsi"],
    description: "VLSI Circuit Design & Embedded Hardware Engineering",
    icon: Microchip
  },
  {
    id: "btech-civil",
    title: "B.Tech. Civil Engineering",
    category: "Programs",
    route: "/academics/btech-civil",
    keywords: ["civil", "civil engineering", "construction", "infrastructure", "btech civil"],
    description: "Infrastructure, Planning & Structural Engineering",
    icon: Building
  },
  {
    id: "mtech-structural",
    title: "M.Tech. Structural Engineering",
    category: "Programs",
    route: "/academics/mtech-structural",
    keywords: ["structural", "structural engineering", "structures", "mtech civil"],
    description: "Advanced Structural Analysis & Earthquake Engineering",
    icon: Building
  },
  {
    id: "applied-sciences",
    title: "Applied Mathematics & Computational Sciences",
    category: "Programs",
    route: "/academics/applied-sciences",
    keywords: ["applied math", "mathematics", "computational sciences", "maths", "engineering math"],
    description: "Mathematical Modeling & Computational Algorithms",
    icon: Lightbulb
  },
  {
    id: "engineering-physics",
    title: "Engineering Physics & Material Sciences",
    category: "Programs",
    route: "/academics/engineering-physics",
    keywords: ["physics", "engineering physics", "materials", "semiconductors", "optics"],
    description: "Quantum Mechanics, Optics & Semiconductor Material Sciences",
    icon: Microscope
  },
  {
    id: "engineering-chemistry",
    title: "Engineering Chemistry & Environmental Science",
    category: "Programs",
    route: "/academics/engineering-chemistry",
    keywords: ["chemistry", "engineering chemistry", "environmental science", "polymers", "batteries"],
    description: "Electrochemistry, Battery Science & Environmental Sustainability",
    icon: TestTube
  },
  {
    id: "humanities-communication",
    title: "English & Professional Communication",
    category: "Programs",
    route: "/academics/humanities-communication",
    keywords: ["english", "humanities", "communication", "soft skills", "corporate presentation"],
    description: "Professional Writing, Communication & Corporate Leadership Skills",
    icon: BookOpen
  },
  {
    id: "mba",
    title: "Master of Business Administration (MBA)",
    category: "Programs",
    route: "/academics/mba",
    keywords: ["mba", "business", "management", "finance", "marketing", "hr"],
    description: "Postgraduate Degree in Strategic Business & Leadership",
    icon: Briefcase
  },

  // Schools
  {
    id: "school-computing",
    title: "School of Computing Sciences",
    category: "Schools",
    route: "/academics/school-of-computing-sciences",
    keywords: ["computing", "computing sciences", "school of computing", "computer department"],
    description: "Department of Computer Science, AI, Data Science & Cyber Security",
    icon: Laptop
  },
  {
    id: "school-engineering",
    title: "School of Engineering",
    category: "Schools",
    route: "/academics/school-of-engineering",
    keywords: ["engineering", "school of engineering", "engg", "ece department", "civil department"],
    description: "Department of ECE, Civil & Structural Engineering",
    icon: Building
  },
  {
    id: "school-business",
    title: "School of Business & Management",
    category: "Schools",
    route: "/academics/school-of-business-management",
    keywords: ["business school", "management school", "school of business", "mba department"],
    description: "Department of Business Administration & Management Studies",
    icon: Briefcase
  },
  {
    id: "school-pharmacy",
    title: "School of Pharmacy",
    category: "Schools",
    route: "/academics/pharmacy",
    keywords: ["pharmacy", "pharma", "b.pharm", "m.pharm", "pharmaceutical"],
    description: "Pharmaceutical Sciences, Pharmacology & Clinical Research",
    icon: Activity
  },
  {
    id: "school-law",
    title: "School of Law",
    category: "Schools",
    route: "/academics/law",
    keywords: ["law", "llb", "legal", "advocate", "school of law"],
    description: "Legal Studies, Constitutional Law & Advocacy",
    icon: Scale
  },

  // Admissions & Fees
  {
    id: "admissions-main",
    title: "Admissions 2026–2027",
    category: "Admissions",
    route: "/admissions",
    keywords: ["admissions", "admission 2026", "admission", "enroll", "intake", "join"],
    description: "Overview of Undergraduate, Postgraduate & Ph.D Admissions",
    icon: CheckSquare
  },
  {
    id: "apply-now",
    title: "Apply Online (Application Form)",
    category: "Admissions",
    route: "/admissions/apply",
    keywords: ["apply", "apply now", "application form", "registration", "register", "apply online"],
    description: "Online Application Portal for 2026–27 Admissions",
    icon: Rocket
  },
  {
    id: "fee-structure",
    title: "Tuition Fee Structure",
    category: "Admissions",
    route: "/academics/fee-structure",
    keywords: ["fees", "fee structure", "fee", "cost", "tuition", "expenses", "payment"],
    description: "Comprehensive Fee Details for All Degree Programs",
    icon: FileText
  },
  {
    id: "scholarships",
    title: "Scholarships & Financial Aid",
    category: "Admissions",
    route: "/admissions/scholarships",
    keywords: ["scholarship", "scholarships", "financial aid", "merit scholarship", "concession"],
    description: "Merit-based & Need-based Scholarship Schemes",
    icon: Award
  },
  {
    id: "eligibility",
    title: "Admission Eligibility Criteria",
    category: "Admissions",
    route: "/admissions/eligibility",
    keywords: ["eligibility", "criteria", "requirements", "marks", "cutoff"],
    description: "Academic Requirements & Qualifying Criteria",
    icon: FileCheck
  },

  // Placements
  {
    id: "placements",
    title: "Training & Placement Cell",
    category: "Placements",
    route: "/academics/placements",
    keywords: ["placements", "placement", "jobs", "careers", "hiring", "salary", "packages"],
    description: "Career Development, Internship & Placement Statistics",
    icon: TrendingUp
  },
  {
    id: "top-recruiters",
    title: "Top Recruiters & Corporate Partners",
    category: "Placements",
    route: "/academics/placements#recruiters",
    keywords: ["recruiters", "top recruiters", "companies", "corporate partners", "employers"],
    description: "300+ Industry Leaders Recruiting from Chalapathi University",
    icon: Building
  },

  // Campus Life & Facilities
  {
    id: "campus-life",
    title: "Campus Life Overview",
    category: "Facilities",
    route: "/campus-life",
    keywords: ["campus", "campus life", "university campus", "facilities", "infrastructure"],
    description: "Vibrant Campus Ecosystem & Student Life",
    icon: Landmark
  },
  {
    id: "hostel-facilities",
    title: "Hostel & Accommodation Facilities",
    category: "Facilities",
    route: "/campus-life/hostels",
    keywords: ["hostel", "hostels", "accommodation", "stay", "mess", "dormitory", "rooms"],
    description: "Safe & Modern In-Campus Boys & Girls Hostels",
    icon: Home
  },
  {
    id: "transportation",
    title: "Bus & Transportation Services",
    category: "Facilities",
    route: "/campus-life/transportation",
    keywords: ["transport", "transportation", "bus", "buses", "travel", "commute"],
    description: "University Fleet Connecting Guntur, Vijayawada & Nearby Regions",
    icon: Bus
  },
  {
    id: "central-library",
    title: "Central Library & E-Resources",
    category: "Facilities",
    route: "/campus-life/library",
    keywords: ["library", "central library", "books", "journals", "digital library", "reading room"],
    description: "50,000+ Books, Digital Journals & Silent Study Zones",
    icon: Library
  },
  {
    id: "sports-fitness",
    title: "Sports, Gym & Fitness Center",
    category: "Facilities",
    route: "/campus-life/sports",
    keywords: ["sports", "gym", "fitness", "playground", "cricket", "volleyball", "athletics"],
    description: "Outdoor Stadiums, Indoor Games & State-of-the-Art Gymnasium",
    icon: Trophy
  },
  {
    id: "cafeteria",
    title: "University Cafeteria & Food Court",
    category: "Facilities",
    route: "/campus-life/cafeteria",
    keywords: ["cafeteria", "canteen", "food", "dining", "snacks"],
    description: "Hygienic Food Court & Multi-Cuisine Dining Options",
    icon: Utensils
  },
  {
    id: "wifi-campus",
    title: "Wi-Fi & Digital Campus Infrastructure",
    category: "Facilities",
    route: "/campus-life/wifi",
    keywords: ["wifi", "internet", "network", "bandwidth", "high speed"],
    description: "1 Gbps High-Speed Campus-Wide Wireless Network",
    icon: Wifi
  },
  {
    id: "health-centre",
    title: "Medical & Health Centre",
    category: "Facilities",
    route: "/campus-life/health-centre",
    keywords: ["health", "health centre", "hospital", "medical", "doctor", "ambulance"],
    description: "24/7 First-Aid, Resident Doctor & Ambulance Support",
    icon: Heart
  },
  {
    id: "student-clubs",
    title: "Student Clubs & Societies",
    category: "Facilities",
    route: "/campus-life/clubs",
    keywords: ["clubs", "student clubs", "activities", "cultural", "technical clubs"],
    description: "Robotics, Coding, Cultural & Leadership Clubs",
    icon: Users
  },
  {
    id: "laboratories",
    title: "Advanced Research Laboratories",
    category: "Facilities",
    route: "/campus-life/laboratories",
    keywords: ["labs", "laboratories", "smart labs", "equipment", "practical"],
    description: "Industry-grade Hardware & Software Labs",
    icon: TestTube
  },

  // Research & Innovation
  {
    id: "research-main",
    title: "Research & Innovation Directorate",
    category: "Research",
    route: "/research",
    keywords: ["research", "innovation", "publications", "patents", "projects"],
    description: "Interdisciplinary Research, Funded Projects & Patents",
    icon: Microscope
  },
  {
    id: "innovation-hub",
    title: "Innovation Hub & Cell",
    category: "Research",
    route: "/campus-life/innovation-hub",
    keywords: ["innovation", "innovation hub", "innovation cell", "ideation"],
    description: "State-of-the-Art Ideation & Prototyping Ecosystem",
    icon: Lightbulb
  },
  {
    id: "incubation-center",
    title: "Startup Incubation Centre",
    category: "Research",
    route: "/research/incubation",
    keywords: ["startups", "incubation", "incubation centre", "entrepreneurship", "ventures"],
    description: "Seed Funding, Mentorship & Startup Acceleration",
    icon: Rocket
  },
  {
    id: "international",
    title: "International Collaborations",
    category: "Research",
    route: "/international",
    keywords: ["international", "global", "partnerships", "foreign universities", "study abroad"],
    description: "Global Academic Partnerships & Exchange Programs",
    icon: Globe
  },

  // Governance & Quality
  {
    id: "naac-accreditation",
    title: "NAAC Accreditation & Quality Ratings",
    category: "Governance",
    route: "/about/naac",
    keywords: ["naac", "accreditation", "quality", "grade", "naac grade"],
    description: "National Assessment & Accreditation Standards",
    icon: CheckCircle2
  },
  {
    id: "nirf-rankings",
    title: "NIRF Rankings & Recognitions",
    category: "Governance",
    route: "/about/rankings",
    keywords: ["nirf", "rankings", "rank", "recognition", "top university"],
    description: "National Institutional Ranking Framework Standing",
    icon: Star
  },
  {
    id: "iqac-cell",
    title: "Internal Quality Assurance Cell (IQAC)",
    category: "Governance",
    route: "/about/iqac",
    keywords: ["iqac", "quality assurance", "internal quality", "audits"],
    description: "Continuous Academic & Administrative Quality Control",
    icon: FileCheck
  },
  {
    id: "academic-calendar",
    title: "Academic Calendar 2026–27",
    category: "Governance",
    route: "/academics/calendar",
    keywords: ["academic calendar", "calendar", "schedule", "holidays", "exams date", "semester start"],
    description: "Semester Timelines, Exam Dates & Official Holidays",
    icon: CalendarDays
  },
  {
    id: "examinations",
    title: "Examinations & Grading System",
    category: "Governance",
    route: "/academics/grading",
    keywords: ["examinations", "examination", "grading", "cgpa", "results", "marksheet"],
    description: "Evaluation Rules, CGPA Calculator & Degree Awards",
    icon: FileEdit
  },

  // University Info & Leadership
  {
    id: "about-university",
    title: "About Chalapathi University",
    category: "Leadership",
    route: "/about",
    keywords: ["about", "about university", "history", "society", "heritage"],
    description: "30+ Years of Educational Legacy & Academic Excellence",
    icon: Landmark
  },
  {
    id: "vision-mission",
    title: "Vision & Mission",
    category: "Leadership",
    route: "/about/vision",
    keywords: ["vision", "mission", "values", "goals", "motto"],
    description: "Institutional Goals, Values & Long-Term Mission",
    icon: Eye
  },
  {
    id: "chairman-message",
    title: "Chairman's Message - Dr. Y. V. Anjaneyulu",
    category: "Leadership",
    route: "/leadership/chairman",
    keywords: ["chairman", "chairman's message", "founder", "anjaneyulu", "president"],
    description: "Leadership Philosophy by Founder Chairman Dr. Y. V. Anjaneyulu",
    icon: User
  },
  {
    id: "vice-chancellor",
    title: "Vice Chancellor's Desk",
    category: "Leadership",
    route: "/leadership/vc",
    keywords: ["vice chancellor", "vc", "vc message", "administration"],
    description: "Executive Academic Leadership & Governance",
    icon: UserCheck
  },
  {
    id: "board-members",
    title: "Board of Governors & Faculty",
    category: "Leadership",
    route: "/management/board-members",
    keywords: ["faculty", "board", "board members", "management", "professors", "teachers"],
    description: "Distinguished Academic Leaders & Governance Board",
    icon: Users
  },

  // Media, News & Events
  {
    id: "latest-news",
    title: "Latest News & Press Releases",
    category: "Media",
    route: "/news",
    keywords: ["news", "latest news", "press", "announcements", "updates"],
    description: "Recent Campus Highlights, Achievements & Updates",
    icon: Newspaper
  },
  {
    id: "campus-events",
    title: "University Events & Annual Fests",
    category: "Media",
    route: "/campus-life/events",
    keywords: ["events", "fest", "annual fest", "workshops", "seminars", "conferences"],
    description: "Technical Symposiums, Cultural Fests & Celebrations",
    icon: Calendar
  },
  {
    id: "photo-gallery",
    title: "Photo & Video Gallery",
    category: "Media",
    route: "/gallery",
    keywords: ["gallery", "photos", "videos", "pictures", "campus photos"],
    description: "High-Resolution Campus Life & Event Memories",
    icon: Image
  },
  {
    id: "achievements",
    title: "University & Student Achievements",
    category: "Media",
    route: "/about/achievements",
    keywords: ["achievements", "awards", "honors", "ranks", "prizes"],
    description: "National Awards, Research Grants & Student Victories",
    icon: Medal
  },

  // Contact & Map
  {
    id: "contact-us",
    title: "Contact Us & Helpline",
    category: "Contact",
    route: "/contact",
    keywords: ["contact", "contact us", "phone", "email", "address", "helpline", "inquiry"],
    description: "Admissions Office Phone Numbers, Email & Contact Details",
    icon: Phone
  },
  {
    id: "campus-location",
    title: "Campus Location & Map Directions",
    category: "Contact",
    route: "/contact#location",
    keywords: ["location", "map", "directions", "where is university", "address", "guntur"],
    description: "Mothadaka, Guntur District, Andhra Pradesh - 522016",
    icon: MapPin
  }
];

function CodeIcon(props: any) {
  return <Laptop {...props} />;
}

// Smart Fuzzy Matching Engine
export function searchSmartIndex(query: string): SearchItem[] {
  if (!query || !query.trim()) return [];

  const rawQuery = query.toLowerCase().trim();
  const queryTokens = rawQuery.split(/\s+/);

  const scoredResults = SEARCH_INDEX.map((item) => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const descLower = (item.description || "").toLowerCase();

    // 1. Exact match on title or keywords
    if (titleLower === rawQuery) score += 100;
    if (item.keywords.some((k) => k.toLowerCase() === rawQuery)) score += 95;

    // 2. Exact prefix match
    if (titleLower.startsWith(rawQuery)) score += 80;
    if (item.keywords.some((k) => k.toLowerCase().startsWith(rawQuery))) score += 75;

    // 3. Token match across keywords and title
    queryTokens.forEach((token) => {
      if (token.length < 2) return;
      if (titleLower.includes(token)) score += 30;
      if (descLower.includes(token)) score += 15;
      item.keywords.forEach((k) => {
        const kLower = k.toLowerCase();
        if (kLower.includes(token)) score += 35;
        // Fuzzy abbreviation match (e.g. "engg" -> "engineering", "pharma" -> "pharmacy")
        if (token.startsWith(kLower) || kLower.startsWith(token)) score += 25;
      });
    });

    return { item, score };
  });

  return scoredResults
    .filter((res) => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((res) => res.item);
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = searchSmartIndex(query);

  // Auto focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard Navigation (Ctrl+K, Esc, Arrows, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery("");
          setSelectedIndex(0);
        }
      }

      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results.length > 0) {
          handleSelectRoute(results[selectedIndex]?.route || results[0].route);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelectRoute = (route: string) => {
    onClose();
    if (route.includes("#")) {
      const [path, hash] = route.split("#");
      navigate(path);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      navigate(route);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-md flex items-start justify-center pt-12 md:pt-20 px-3 select-none animate-fade-in font-[var(--font-poppins)]">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh] transition-all transform animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
          <Search size={20} className="text-[#072A6C] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any program, department, facility, admissions, fees..."
            className="w-full bg-transparent text-[#072A6C] placeholder-gray-400 font-semibold text-sm md:text-base outline-none border-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors mr-2 border-none outline-none cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 hover:text-[#072A6C] transition-colors border-none outline-none cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div ref={listRef} className="overflow-y-auto p-3 flex-1 space-y-1 max-h-[420px]">
          {query.trim() === "" ? (
            <div className="py-6 px-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-[#D4AF37]" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Top Quick Navigations</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: "B.Tech CSE", route: "/academics/btech-cse", icon: Laptop },
                  { label: "Apply Now", route: "/admissions/apply", icon: Rocket },
                  { label: "Fee Structure", route: "/academics/fee-structure", icon: FileText },
                  { label: "Placements", route: "/academics/placements", icon: TrendingUp },
                  { label: "Hostels", route: "/campus-life/hostels", icon: Home },
                  { label: "Contact Us", route: "/contact", icon: Phone }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleSelectRoute(item.route)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-[#072A6C] text-[#072A6C] hover:text-white transition-all text-left group border border-slate-100 cursor-pointer outline-none"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white group-hover:bg-white/20 flex items-center justify-center text-[#D4AF37] shrink-0 shadow-xs">
                        <Icon size={14} />
                      </div>
                      <span className="text-xs font-bold truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm font-bold text-gray-500 mb-1">No exact matches found for "{query}"</p>
              <p className="text-xs text-gray-400 mb-4">Try searching for keywords like <span className="font-semibold text-[#072A6C]">CSE</span>, <span className="font-semibold text-[#072A6C]">Fees</span>, <span className="font-semibold text-[#072A6C]">Hostel</span>, <span className="font-semibold text-[#072A6C]">Placements</span> or <span className="font-semibold text-[#072A6C]">Admissions</span>.</p>
              <button
                onClick={() => handleSelectRoute("/academics/programmes")}
                className="px-4 py-2 bg-[#072A6C] text-white text-xs font-bold rounded-xl hover:bg-[#D4AF37] transition-all inline-flex items-center gap-1.5 cursor-pointer border-none"
              >
                <span>Browse All Academic Programs</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-1 mb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <span>Suggestions ({results.length})</span>
                <span className="text-[10px] text-gray-400">Press Enter to select</span>
              </div>
              {results.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectRoute(item.route)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#072A6C] text-white shadow-md transform scale-[1.01]"
                        : "hover:bg-slate-50 text-[#072A6C]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-white/20 text-[#D4AF37]" : "bg-[#072A6C]/5 text-[#072A6C]"
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs md:text-sm font-bold truncate leading-tight">
                            {item.title}
                          </h4>
                          <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shrink-0 ${
                            isSelected ? "bg-[#D4AF37] text-white" : "bg-slate-100 text-slate-600"
                          }`}>
                            {item.category}
                          </span>
                        </div>
                        {item.description && (
                          <p className={`text-[11px] truncate mt-[0.5px] ${
                            isSelected ? "text-gray-200 font-light" : "text-gray-500 font-normal"
                          }`}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} className={`shrink-0 ml-2 ${isSelected ? "text-[#D4AF37]" : "text-gray-300"}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
