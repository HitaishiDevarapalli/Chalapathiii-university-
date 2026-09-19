import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, ChevronDown, ChevronRight, ArrowRight, Megaphone, Search,
  GraduationCap, Code, Laptop, Cpu, Brain, Database, ShieldAlert, Radio, 
  CircuitBoard, Building, Hammer, Briefcase, Pill, UserPlus, FileSignature, 
  CreditCard, Award, Compass, Home as HomeIcon, BookOpen, Trophy, Bus, 
  Users, Tv, FlaskConical, TrendingUp, Building2, Lightbulb, 
  Info, History, Target, FileText, Globe, CalendarDays, CheckSquare
} from "lucide-react";
import { useData } from "../../context/DataContext";
import { searchIndex, SearchItem } from "../../data/searchIndex";
import { GlobalSearchModal } from "../common/GlobalSearchModal";

const SearchIconMap: Record<string, React.ComponentType<any>> = {
  GraduationCap, Code, Laptop, Cpu, Brain, Database, ShieldAlert, Radio, 
  CircuitBoard, Building, Hammer, Briefcase, Pill, UserPlus, FileSignature, 
  CreditCard, Award, Compass, Home: HomeIcon, BookOpen, Trophy, Bus, 
  Users, Tv, FlaskConical, TrendingUp, Building2, Search, Lightbulb, 
  Megaphone, Calendar: CalendarDays, MapPin: Info, Info, History, Target, FileText, Globe, 
  CalendarDays, CheckSquare
};


export const ACADEMIC_PROGRAMS_STRUCTURE: Record<string, Record<string, { label: string; to: string }[]>> = {
  "School of Computing Sciences": {
    "Computer Science & Engineering": [
      { label: "B.Tech. Computer Science & Engineering", to: "/academics/btech-cse" },
      { label: "M.Tech. Computer Science & Engineering", to: "/academics/mtech-cse" },
      { label: "MCA", to: "/academics/mca" },
      { label: "Ph.D. Computer Science & Engineering", to: "/academics/phd-cse" }
    ],
    "Artificial Intelligence": [
      { label: "B.Tech. CSE (Artificial Intelligence)", to: "/academics/btech-cse-ai-ml" },
      { label: "B.Tech. Artificial Intelligence & Machine Learning", to: "/academics/btech-aiml" },
      { label: "M.Tech. CSE (AI & ML)", to: "/academics/mtech-aiml" }
    ],
    "Data Science": [
      { label: "B.Tech. CSE (Data Science)", to: "/academics/btech-cse-data-science" }
    ],
    "Cyber Security": [
      { label: "B.Tech. CSE (Cyber Security)", to: "/academics/btech-cse-cyber-security" }
    ]
  },
  "School of Engineering": {
    "Electronics and Communication Engineering": [
      { label: "B.Tech. Electronics and Communication Engineering", to: "/academics/btech-ece" },
      { label: "M.Tech. VLSI and Embedded Systems Design", to: "/academics/mtech-vlsi" },
      { label: "Ph.D. Electronics and Communication Engineering", to: "/academics/phd-ece" }
    ],
    "Civil Engineering": [
      { label: "B.Tech. Civil Engineering", to: "/academics/btech-civil" },
      { label: "M.Tech. Structural Engineering", to: "/academics/mtech-structural" },
      { label: "Ph.D. Structural Engineering", to: "/academics/phd-structural" }
    ],
    "Basic Science & Humanities": []
  },
  "School of Business & Management": {
    "Business and Management": [
      { label: "MBA", to: "/academics/mba" }
    ]
  }
};

const CATEGORY_INFO: Record<string, { desc: string; linkText: string; to: string; title: string }> = {
  "Academic Calendar": {
    title: "Academic Calendar",
    desc: "Plan your semester ahead. View critical academic timelines, examination blocks, holidays, and key milestones.",
    linkText: "View Calendar",
    to: "/academics/calendar"
  },
  "Flexibilities": {
    title: "Academic Flexibilities",
    desc: "Customize your learning path. Explore options for minor specializations, honors tracks, and flexible credit transfers.",
    linkText: "Explore Flexibilities",
    to: "/academics/flexibilities"
  },
  "Grading System": {
    title: "Grading System",
    desc: "Understand evaluation metrics. Access information about CGPA/SGPA calculation, credit weightages, and passing criteria.",
    linkText: "View Grading Policy",
    to: "/academics/grading"
  },
  "Award of Degrees": {
    title: "Award of Degrees",
    desc: "Graduation and compliance. Check eligibility criteria for degree awards, convocation schedules, and transcript requests.",
    linkText: "Read Degree Guidelines",
    to: "/academics/degrees"
  },
  "Rules & Regulations": {
    title: "Rules & Regulations",
    desc: "Campus compliance. Learn about attendance requirements, credit minimums, and code of conduct.",
    linkText: "Read Rules Handbook",
    to: "/academics/rules"
  },
  "Teaching & Evaluation": {
    title: "Teaching & Evaluation",
    desc: "Outcome-Based Education. Discover our pedagogy, continuous internal assessment schemes, and evaluation standards.",
    linkText: "View Teaching & Evaluation",
    to: "/academics/teaching"
  },
  "Global Certifications": {
    title: "Global Certifications",
    desc: "Graduate with internationally respected certifications that complement your academic degree and prepare you for leadership.",
    linkText: "View Certifications",
    to: "/academics/certifications"
  }
};

export default function Header({ onToggleAi }: { onToggleAi?: () => void } = {}) {
  const { announcements, showAnnouncementsDrawer, setShowAnnouncementsDrawer, programs, siteSettings, themeColors } = useData();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [academicsOpen, setAcademicsOpen] = useState(false);
  const [mobileAcademicsOpen, setMobileAcademicsOpen] = useState(false);
  const [mobileProgrammesOpen, setMobileProgrammesOpen] = useState(false);
  const [facultyOpen, setFacultyOpen] = useState(false);
  const [mobileFacultyOpen, setMobileFacultyOpen] = useState(false);
  const [campusLifeOpen, setCampusLifeOpen] = useState(false);
  const [mobileCampusLifeOpen, setMobileCampusLifeOpen] = useState(false);
  const [newsEventsOpen, setNewsEventsOpen] = useState(false);
  const [mobileNewsEventsOpen, setMobileNewsEventsOpen] = useState(false);
  const [activeSchool, setActiveSchool] = useState("School of Computing Sciences");
  const [hoveredCategory, setHoveredCategory] = useState("Programmes Offered");
  
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setActiveSuggestionIdx(-1);
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    const queryTokens = query.split(/\s+/).filter(Boolean);
    
    const matches = searchIndex.map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      
      queryTokens.forEach(token => {
        // Exact start match on title
        if (titleLower.startsWith(token)) score += 12;
        else if (titleLower.includes(token)) score += 6;
        
        // Exact category match
        if (item.category.toLowerCase().includes(token)) score += 3;
        
        // Keyword matches (supporting fuzzy prefix/suffix containment)
        item.keywords.forEach(keyword => {
          if (keyword === token) score += 10;
          else if (keyword.startsWith(token) || token.startsWith(keyword)) score += 6;
          else if (keyword.includes(token) || token.includes(keyword)) score += 4;
        });
      });
      
      return { item, score };
    })
    .filter(m => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(m => m.item);
    
    setSuggestions(matches.slice(0, 6));
    setActiveSuggestionIdx(-1);
  }, [searchQuery]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSuggestions([]);
      }
    };
    if (searchOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      // Autofocus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [searchOpen]);

  const handleSearchSubmit = () => {
    const targetItem = activeSuggestionIdx >= 0 && activeSuggestionIdx < suggestions.length
      ? suggestions[activeSuggestionIdx]
      : suggestions[0];
      
    if (targetItem) {
      navigate(targetItem.to);
      setSearchQuery("");
      setSearchOpen(false);
      setSuggestions([]);
    } else if (searchQuery.trim()) {
      // Fallback exact-match redirects
      const q = searchQuery.toLowerCase().trim();
      if (q.includes("computer") || q.includes("cse") || q.includes("software") || q.includes("b.tech")) {
        navigate("/academics/btech-cse");
      } else if (q.includes("ai") || q.includes("ml") || q.includes("aiml")) {
        navigate("/academics/btech-cse-ai-ml");
      } else if (q.includes("fee") || q.includes("cost") || q.includes("tuition")) {
        navigate("/admissions/fees");
      } else if (q.includes("apply") || q.includes("admissions")) {
        navigate("/admissions/apply");
      } else {
        navigate("/academics");
      }
      setSearchQuery("");
      setSearchOpen(false);
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIdx(prev => (prev + 1) % Math.max(1, suggestions.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIdx(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setSuggestions([]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit();
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileAcademicsOpen(false);
    setMobileFacultyOpen(false);
    setMobileProgrammesOpen(false);
    setMobileAboutOpen(false);
    setMobileCampusLifeOpen(false);
    setMobileNewsEventsOpen(false);
  }, [location.pathname]);

  const aboutItems = [
    { label: "Genesis", to: "/about/genesis" },
    { label: "Vision & Mission", to: "/about/vision" },
    { label: "Leadership", to: "/about/leadership" },
    { label: "Chalapathi Advantage", to: "/about/advantage" }
  ];

  const navLinks = [
    "About Us", "Academics", "Admissions", "Research", "Faculty",
    "Campus Life", "Placements", "News & Events", "Contact Us",
  ];

  const navHrefs: Record<string, string> = {
    "About Us": "/about",
    "Academics": "/academics",
    "Admissions": "/admissions",
    "Research": "/research",
    "Faculty": "/management/faculty/computing",
    "Campus Life": "/campus-life",
    "Placements": "/placements",
    "Contact Us": "/contact",
  };

  const newsEventsItems = [
    { label: "News", to: "/news" },
    { label: "Events", to: "/news/events" }
  ];

  const academicsItems = [
    { label: "Programmes Offered", to: "/academics/programmes" },
    { label: "Global Certifications", to: "/academics/certifications" },
    { label: "Academic Calendar", to: "/academics/calendar" },
    { label: "Flexibilities", to: "/academics/flexibilities" },
    { label: "Grading System", to: "/academics/grading" },
    { label: "Award of Degrees", to: "/academics/degrees" },
    { label: "Rules & Regulations", to: "/academics/rules" },
    { label: "Teaching & Evaluation", to: "/academics/teaching" }
  ];

  const facultyItems = [
    { label: "School of Computing Sciences", to: "/management/faculty/computing" },
    { label: "School of Engineering", to: "/management/faculty/engineering" },
    { label: "School of Business & Management", to: "/management/faculty/business" }
  ];

  const campusLifeItems = [
    { label: "Campus Overview", to: "/campus-life" },
    { label: "Central Library", to: "/campus-life/library" },
    { label: "Smart Classrooms", to: "/campus-life/smart-classrooms" },
    { label: "Laboratories", to: "/campus-life/laboratories" },
    { label: "Hostel Facilities", to: "/campus-life/hostels" },
    { label: "Sports & Fitness", to: "/campus-life/sports" },
    { label: "Cafeteria", to: "/campus-life/cafeteria" },
    { label: "Transportation", to: "/campus-life/transportation" },
    { label: "Wi-Fi Campus", to: "/campus-life/wifi" },
    { label: "Health Centre", to: "/campus-life/health-centre" },
    { label: "Student Clubs", to: "/campus-life/clubs" },
    { label: "Events & Festivals", to: "/campus-life/events" },
    { label: "Innovation Hub", to: "/campus-life/innovation-hub" },
    { label: "Campus Safety", to: "/campus-life/safety" },
    { label: "NSS & NCC", to: "/campus-life/nss-ncc" },
    { label: "Grievance Cell", to: "/campus-life/grievance-cell" }
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        } h-[100px]`}
        style={{ borderBottom: "1px solid #E8E8E8" }}
      >
        <div className="max-w-[1440px] mx-auto h-full px-3 min-[1280px]:px-5 flex items-center justify-between gap-2 min-[1280px]:gap-3 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 py-1">
            <img
              src={siteSettings?.logoUrl || "/logo.png?v=3"}
              alt={siteSettings?.universityName || "Chalapathi University"}
              className="h-10 min-[1280px]:h-14 min-[1440px]:h-18 w-auto object-contain no-lift transition-all duration-300"
            />
          </Link>

          {/* Center nav */}
          <nav className="hidden min-[1024px]:flex items-center justify-center gap-0.5 min-[1280px]:gap-1 min-[1440px]:gap-1.5 h-full flex-1 mx-auto">
            {navLinks.map((name) => {
              if (name === "About Us") {
                return (
                  <div
                    key={name}
                    className="relative h-full flex items-center"
                    onMouseEnter={() => setAboutOpen(true)}
                    onMouseLeave={() => setAboutOpen(false)}
                  >
                    <button
                      type="button"
                      className="px-1.5 min-[1280px]:px-2 min-[1440px]:px-2.5 py-2 text-[12.5px] min-[1280px]:text-[13.5px] min-[1440px]:text-[14.5px] font-[600] text-[#072A6C] hover:text-[#D4AF37] transition-colors whitespace-nowrap font-[var(--font-poppins)] inline-flex items-center gap-0.5 cursor-pointer outline-none"
                    >
                      {name} <ChevronDown size={13} className={`transition-transform duration-200 ${aboutOpen ? "rotate-180" : ""}`} />
                    </button>
                    {aboutOpen && (
                      <div className="absolute top-full left-0 mt-0 w-[180px] bg-white border border-gray-200/80 rounded-[12px] shadow-lg py-2.5 z-50 flex flex-col gap-0.5 animate-fade-in font-[var(--font-poppins)]">
                        {aboutItems.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            className="px-4 py-2 text-[13px] font-medium text-[#222222] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all text-left"
                            onClick={() => setAboutOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (name === "Academics") {
                return (
                  <div
                    key={name}
                    className="h-full flex items-center"
                    onMouseEnter={() => {
                      setAcademicsOpen(true);
                      setHoveredCategory("Programmes Offered");
                    }}
                    onMouseLeave={() => setAcademicsOpen(false)}
                  >
                    <button
                      type="button"
                      className="px-1.5 min-[1280px]:px-2 min-[1440px]:px-2.5 py-2 text-[12.5px] min-[1280px]:text-[13.5px] min-[1440px]:text-[14.5px] font-[600] text-[#072A6C] hover:text-[#D4AF37] transition-colors whitespace-nowrap font-[var(--font-poppins)] inline-flex items-center gap-0.5 cursor-pointer outline-none"
                    >
                      {name} <ChevronDown size={13} className={`transition-transform duration-200 ${academicsOpen ? "rotate-180" : ""}`} />
                    </button>
                    {academicsOpen && (
                      <div 
                        className="absolute left-5 right-5 top-full mt-0 w-auto bg-white border border-gray-200/80 rounded-[20px] shadow-2xl p-6 z-50 flex gap-6 animate-fade-in text-left font-[var(--font-poppins)]"
                        onMouseEnter={() => setAcademicsOpen(true)}
                        onMouseLeave={() => setAcademicsOpen(false)}
                      >
                        {/* Column 1: Academic Categories */}
                        <div className="w-[200px] border-r border-gray-100 pr-5 flex flex-col gap-1 shrink-0">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-2">Academics</span>
                          {[
                            { label: "Programmes Offered", to: "/academics/programmes" },
                            { label: "Global Certifications", to: "/academics/certifications" },
                            { label: "Academic Calendar", to: "/academics/calendar" },
                            { label: "Flexibilities", to: "/academics/flexibilities" },
                            { label: "Grading System", to: "/academics/grading" },
                            { label: "Award of Degrees", to: "/academics/degrees" },
                            { label: "Rules & Regulations", to: "/academics/rules" },
                            { label: "Teaching & Evaluation", to: "/academics/teaching" }
                          ].map((item) => (
                            <Link
                              key={item.label}
                              to={item.to}
                              className={`px-3 py-2 text-[12px] font-bold rounded-lg transition-all ${
                                location.pathname === item.to || (item.label === "Grading System" && location.pathname === "/academics/grading")
                                  ? "text-[#D4AF37] bg-[#D4AF37]/5"
                                  : "text-gray-700 hover:text-[#D4AF37] hover:bg-gray-50"
                              }`}
                              onMouseEnter={() => setHoveredCategory(item.label)}
                              onClick={() => setAcademicsOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>

                        {/* Column 2: Schools Selection */}
                        {hoveredCategory === "Programmes Offered" ? (
                          <>
                            <div className="w-[200px] border-r border-gray-100 pr-5 flex flex-col gap-1 shrink-0 bg-[#fbfbfb] -my-6 py-6 pl-4">
                              <span className="text-[10px] text-gray-800 font-extrabold uppercase tracking-wider mb-2">Schools</span>
                              {Object.keys(ACADEMIC_PROGRAMS_STRUCTURE).map((school) => (
                                <button
                                  key={school}
                                  type="button"
                                  onMouseEnter={() => setActiveSchool(school)}
                                  onClick={() => setActiveSchool(school)}
                                  className={`px-3 py-3 text-[12px] font-bold rounded-lg text-left transition-all cursor-pointer outline-none ${
                                    activeSchool === school
                                      ? "text-[#D4AF37] bg-amber-50/50"
                                      : "text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50"
                                  }`}
                                >
                                  {school}
                                </button>
                              ))}
                            </div>

                            {/* Column 3 & 4: Specific Departments and Programs */}
                            <div className="flex-1 pl-4 flex flex-col pt-1">
                              <span className="text-[10px] text-gray-800 font-extrabold uppercase tracking-wider mb-4 block">
                                Departments & Programs
                              </span>
                              
                              <div className="grid grid-cols-2 gap-x-12 gap-y-6 max-h-[360px] overflow-y-auto pr-4">
                                {Object.entries(ACADEMIC_PROGRAMS_STRUCTURE[activeSchool] || {}).map(([dept, courses]) => {
                                  const isPg = (label: string) => {
                                    const l = label.toLowerCase();
                                    return l.startsWith("m.tech") || l.startsWith("mca") || l.startsWith("ph.d") || l.startsWith("mba") || l.startsWith("m.pharm") || l.includes("postgraduate") || l.includes("doctoral");
                                  };
                                  const ugCourses = courses.filter(c => !isPg(c.label));
                                  const pgCourses = courses.filter(c => isPg(c.label));

                                  return (
                                    <div key={dept} className="space-y-2">
                                      <h5 className="text-[12px] font-bold text-[#072A6C] tracking-wide">{dept}</h5>
                                      
                                      {ugCourses.length > 0 && (
                                        <div className="space-y-1">
                                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Undergraduate</span>
                                          <div className="flex flex-col gap-1.5 pl-0.5">
                                            {ugCourses.map((course) => {
                                              const slug = course.to.split("/").pop();
                                              const matched = programs?.find(p => p.slug === slug);
                                              const displayLabel = matched ? matched.title : course.label;
                                              return (
                                                <Link
                                                  key={course.label}
                                                  to={course.to}
                                                  className="text-[12px] font-medium text-gray-500 hover:text-[#D4AF37] transition-colors leading-snug flex items-center gap-1.5 py-0.5 group"
                                                  onClick={() => setAcademicsOpen(false)}
                                                >
                                                  <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-[#D4AF37] transition-colors shrink-0" />
                                                  {displayLabel}
                                                </Link>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}

                                      {pgCourses.length > 0 && (
                                        <div className="space-y-1 mt-2">
                                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Postgraduate</span>
                                          <div className="flex flex-col gap-1.5 pl-0.5">
                                            {pgCourses.map((course) => {
                                              const slug = course.to.split("/").pop();
                                              const matched = programs?.find(p => p.slug === slug);
                                              const displayLabel = matched ? matched.title : course.label;
                                              return (
                                                <Link
                                                  key={course.label}
                                                  to={course.to}
                                                  className="text-[12px] font-medium text-gray-500 hover:text-[#D4AF37] transition-colors leading-snug flex items-center gap-1.5 py-0.5 group"
                                                  onClick={() => setAcademicsOpen(false)}
                                                >
                                                  <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-[#D4AF37] transition-colors shrink-0" />
                                                  {displayLabel}
                                                </Link>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                      </div>
                                    );
                                  })}
                                </div>
                            </div>
                          </>
                        ) : (
                          CATEGORY_INFO[hoveredCategory] && (
                            <div className="flex-1 pl-8 flex flex-col justify-between max-w-xl">
                              <div>
                                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mb-2 block">Quick Info</span>
                                <h4 className="text-[#072A6C] text-lg font-extrabold mb-3">
                                  {CATEGORY_INFO[hoveredCategory].title}
                                </h4>
                                <p className="text-gray-500 text-xs leading-relaxed font-light mb-6">
                                  {CATEGORY_INFO[hoveredCategory].desc}
                                </p>
                              </div>
                              <Link
                                to={CATEGORY_INFO[hoveredCategory].to}
                                onClick={() => setAcademicsOpen(false)}
                                className="w-fit h-9 px-5 bg-[#D4AF37] hover:bg-[#C9A84C] text-white text-[11px] font-bold rounded-[8px] inline-flex items-center justify-center gap-1.5 transition-colors font-[var(--font-poppins)]"
                              >
                                {CATEGORY_INFO[hoveredCategory].linkText} <ArrowRight size={12} />
                              </Link>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              if (name === "Faculty") {
                return (
                  <div
                    key={name}
                    className="relative"
                    onMouseEnter={() => setFacultyOpen(true)}
                    onMouseLeave={() => setFacultyOpen(false)}
                  >
                    <button
                      type="button"
                      className="px-1.5 min-[1280px]:px-2 min-[1440px]:px-2.5 py-2 text-[12.5px] min-[1280px]:text-[13.5px] min-[1440px]:text-[14.5px] font-[600] text-[#072A6C] hover:text-[#D4AF37] transition-colors whitespace-nowrap font-[var(--font-poppins)] inline-flex items-center gap-0.5 cursor-pointer outline-none"
                    >
                      {name} <ChevronDown size={13} className={`transition-transform duration-200 ${facultyOpen ? "rotate-180" : ""}`} />
                    </button>
                    {facultyOpen && (
                      <div className="absolute top-full left-0 mt-0 w-[260px] bg-white border border-gray-200/80 rounded-[12px] shadow-lg py-2.5 z-50 flex flex-col gap-0.5 animate-fade-in font-[var(--font-poppins)]">
                        {facultyItems.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            className="px-4 py-2 text-[13px] font-medium text-[#222222] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all block text-left"
                            onClick={() => setFacultyOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (name === "Campus Life") {
                return (
                  <div
                    key={name}
                    className="relative"
                    onMouseEnter={() => setCampusLifeOpen(true)}
                    onMouseLeave={() => setCampusLifeOpen(false)}
                  >
                    <button
                      type="button"
                      className="px-1.5 min-[1280px]:px-2 min-[1440px]:px-2.5 py-2 text-[12.5px] min-[1280px]:text-[13.5px] min-[1440px]:text-[14.5px] font-[600] text-[#072A6C] hover:text-[#D4AF37] transition-colors whitespace-nowrap font-[var(--font-poppins)] inline-flex items-center gap-0.5 cursor-pointer outline-none"
                    >
                      {name} <ChevronDown size={13} className={`transition-transform duration-200 ${campusLifeOpen ? "rotate-180" : ""}`} />
                    </button>
                    {campusLifeOpen && (
                      <div 
                        className="absolute left-0 mt-0 w-[240px] max-h-[380px] overflow-y-auto bg-white border border-gray-200/80 rounded-[20px] shadow-2xl p-4 z-50 flex flex-col gap-1 animate-fade-in text-left font-[var(--font-poppins)]"
                        style={{ overscrollBehavior: "contain", scrollPaddingTop: "16px", scrollPaddingBottom: "16px" }}
                        onMouseEnter={() => setCampusLifeOpen(true)}
                        onMouseLeave={() => setCampusLifeOpen(false)}
                      >
                        {campusLifeItems.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            className={`px-3 py-2 text-[12px] font-bold rounded-lg transition-all ${
                              location.pathname === item.to
                                ? "text-[#D4AF37] bg-[#D4AF37]/5"
                                : "text-gray-700 hover:text-[#D4AF37] hover:bg-gray-50"
                            }`}
                            onMouseEnter={(e) => {
                              e.currentTarget.scrollIntoView({ block: "nearest", behavior: "smooth" });
                            }}
                            onClick={() => setCampusLifeOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (name === "News & Events") {
                return (
                  <div
                    key={name}
                    className="relative"
                    onMouseEnter={() => setNewsEventsOpen(true)}
                    onMouseLeave={() => setNewsEventsOpen(false)}
                  >
                    <button
                      type="button"
                      className="px-1.5 min-[1280px]:px-2 min-[1440px]:px-2.5 py-2 text-[12.5px] min-[1280px]:text-[13.5px] min-[1440px]:text-[14.5px] font-[600] text-[#072A6C] hover:text-[#D4AF37] transition-colors whitespace-nowrap font-[var(--font-poppins)] inline-flex items-center gap-0.5 cursor-pointer outline-none"
                    >
                      {name} <ChevronDown size={13} className={`transition-transform duration-200 ${newsEventsOpen ? "rotate-180" : ""}`} />
                    </button>
                    {newsEventsOpen && (
                      <div className="absolute top-full left-0 mt-0 w-[150px] bg-white border border-gray-200/80 rounded-[12px] shadow-lg py-2.5 z-50 flex flex-col gap-0.5 animate-fade-in font-[var(--font-poppins)]">
                        {newsEventsItems.map((item) => (
                          <Link
                            key={item.label}
                            to={item.to}
                            className="px-4 py-2 text-[13px] font-medium text-[#222222] hover:text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all"
                            onClick={() => setNewsEventsOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={name}
                  to={navHrefs[name]}
                  className="px-1.5 min-[1280px]:px-2 min-[1440px]:px-2.5 py-2 text-[12.5px] min-[1280px]:text-[13.5px] min-[1440px]:text-[14.5px] font-[600] text-[#072A6C] hover:text-[#D4AF37] transition-colors whitespace-nowrap font-[var(--font-poppins)]"
                >
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* Right CTA */}
          <div className="hidden min-[1024px]:flex items-center gap-2 min-[1280px]:gap-3 shrink-0 z-10 bg-white">
            <Link
              to="/admissions/apply"
              className="h-9 min-[1280px]:h-10 px-3.5 min-[1280px]:px-4 text-xs min-[1280px]:text-xs min-[1440px]:text-sm bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold rounded-[10px] min-[1280px]:rounded-[12px] inline-flex items-center justify-center transition-colors shadow-sm font-[var(--font-poppins)] whitespace-nowrap"
            >
              Apply Now
            </Link>
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#072A6C] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors cursor-pointer relative shrink-0"
              title="Search University (Ctrl+K)"
            >
              <Search size={17} />
            </button>
            <button
              onClick={() => setShowAnnouncementsDrawer(!showAnnouncementsDrawer)}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-[#072A6C] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors cursor-pointer relative shrink-0"
              title="View Announcements"
            >
              <Megaphone size={17} />
              {announcements.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#D4AF37] w-2.5 h-2.5 rounded-full border-2 border-white" />
              )}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex min-[1024px]:hidden items-center gap-1">
            <button
              onClick={() => setIsGlobalSearchOpen(true)}
              className="p-2 text-[#222222] hover:text-[#D4AF37] transition-colors cursor-pointer"
              title="Search"
            >
              <Search size={18} />
            </button>
            <button 
              onClick={() => setShowAnnouncementsDrawer(!showAnnouncementsDrawer)} 
              className="p-2 text-[#222222] relative hover:text-[#D4AF37] transition-colors"
              title="View Announcements"
            >
              <Megaphone size={18} />
              {announcements.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#D4AF37] w-2 h-2 rounded-full border border-white" />
              )}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-[#222222] hover:text-[#D4AF37] transition-colors">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div ref={searchContainerRef} className="absolute top-full left-0 w-full bg-[#072A6C] p-4 shadow-xl z-50 animate-slide-down">
            <div className="max-w-2xl mx-auto relative flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search programs, departments, hostels, faculty, NIRF..."
                  className="flex-1 bg-white/10 text-white border border-white/20 rounded-[12px] px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37] placeholder:text-white/50 font-[var(--font-poppins)]"
                />
                <button 
                  onClick={handleSearchSubmit}
                  className="bg-[#D4AF37] text-white font-bold px-6 py-2.5 rounded-[12px] text-sm hover:bg-[#C9A84C] transition-colors font-[var(--font-poppins)]"
                >
                  Search
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-[16px] shadow-2xl border border-gray-100 overflow-hidden z-50 font-[var(--font-poppins)] text-left">
                  <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Suggestions</span>
                    <span className="text-[9px] text-gray-400">Use arrow keys ↑↓ to navigate</span>
                  </div>
                  <div className="flex flex-col">
                    {suggestions.map((item, idx) => {
                      const IconComponent = SearchIconMap[item.icon] || GraduationCap;
                      const isActive = idx === activeSuggestionIdx;
                      return (
                        <div
                          key={item.to + idx}
                          onClick={() => {
                            navigate(item.to);
                            setSearchQuery("");
                            setSearchOpen(false);
                            setSuggestions([]);
                          }}
                          onMouseEnter={() => setActiveSuggestionIdx(idx)}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all ${
                            isActive 
                              ? "bg-gray-50 border-l-[3px] border-[#D4AF37] pl-3.5 text-[#072A6C]" 
                              : "border-l-[3px] border-transparent text-[#222222] hover:bg-gray-50/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                              isActive ? "bg-[#D4AF37]/10 text-[#D4AF37]" : "bg-gray-100 text-gray-500"
                            }`}>
                              <IconComponent size={15} />
                            </div>
                            <div>
                              <div className="text-[13px] font-bold leading-tight">{item.title}</div>
                              <div className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.category}</div>
                            </div>
                          </div>
                          <span className={`text-[11px] font-bold flex items-center gap-1 ${
                            isActive ? "text-[#D4AF37] translate-x-1" : "text-gray-300"
                          } transition-all`}>
                            Go <ArrowRight size={10} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[90px] z-30 bg-white flex flex-col p-6 overflow-y-auto min-[1024px]:hidden shadow-2xl">
          {navLinks.map((name) => {
            if (name === "About Us") {
              return (
                <div key={name} className="flex flex-col border-b border-gray-100 py-3">
                  <button
                    type="button"
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                    className="w-full flex items-center justify-between text-[15px] font-semibold text-[#222222] hover:text-[#D4AF37] transition-colors font-[var(--font-poppins)] text-left outline-none cursor-pointer"
                  >
                    <span>{name}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${mobileAboutOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAboutOpen && (
                    <div className="pl-4 flex flex-col gap-2 mt-2 pt-2 border-t border-gray-50 text-left">
                      {aboutItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="text-[13px] font-medium text-gray-600 hover:text-[#D4AF37] py-1.5 transition-colors font-[var(--font-poppins)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (name === "Academics") {
              return (
                <div key={name} className="flex flex-col border-b border-gray-100 py-3">
                  <button
                    type="button"
                    onClick={() => setMobileAcademicsOpen(!mobileAcademicsOpen)}
                    className="w-full flex items-center justify-between text-[15px] font-semibold text-[#222222] hover:text-[#D4AF37] transition-colors font-[var(--font-poppins)] text-left outline-none cursor-pointer"
                  >
                    <span>{name}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${mobileAcademicsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileAcademicsOpen && (
                    <div className="pl-4 flex flex-col gap-2 mt-2 pt-2 border-t border-gray-50">
                      {academicsItems.map((item) => {
                        if (item.label === "Programmes Offered") {
                          return (
                            <div key={item.label} className="flex flex-col">
                              <div className="w-full flex items-center justify-between">
                                <Link
                                  to={item.to}
                                  className="text-[13px] font-medium text-gray-600 hover:text-[#D4AF37] py-1.5 transition-colors font-[var(--font-poppins)]"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {item.label}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setMobileProgrammesOpen(!mobileProgrammesOpen)}
                                  className="p-1.5 text-gray-500 hover:text-[#D4AF37] transition-colors cursor-pointer outline-none"
                                >
                                  <ChevronDown size={14} className={`transition-transform duration-200 ${mobileProgrammesOpen ? "rotate-180" : ""}`} />
                                </button>
                              </div>
                              {mobileProgrammesOpen && (
                                <div className="pl-3 flex flex-col gap-3 mt-1.5 pb-2 border-l border-gray-100">
                                  {Object.entries(ACADEMIC_PROGRAMS_STRUCTURE).map(([school, depts]) => (
                                    <div key={school} className="flex flex-col gap-2">
                                      <span className="text-[11px] font-extrabold text-[#072A6C] uppercase tracking-wider">{school}</span>
                                      <div className="flex flex-col gap-3 pl-2 border-l border-gray-50">
                                        {Object.entries(depts).map(([dept, courses]) => (
                                          <div key={dept} className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-gray-500">{dept}</span>
                                            <div className="flex flex-col gap-1 pl-1">
                                              {courses.map((course) => {
                                                 const slug = course.to.split("/").pop();
                                                 const matched = programs?.find(p => p.slug === slug);
                                                 const displayLabel = matched ? matched.title : course.label;
                                                 return (
                                                   <Link
                                                     key={course.label}
                                                     to={course.to}
                                                     className="text-[11px] font-medium text-gray-600 hover:text-[#D4AF37] py-0.5 transition-colors"
                                                     onClick={() => {
                                                       setMobileOpen(false);
                                                       setMobileAcademicsOpen(false);
                                                     }}
                                                   >
                                                     • {displayLabel}
                                                   </Link>
                                                 );
                                              })}
                                            </div>
                                          </div>
                                        ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                              )}
                            </div>
                          );
                        }
                        return (
                          <Link
                            key={item.label}
                            to={item.to}
                            className="text-[13px] font-medium text-gray-600 hover:text-[#D4AF37] py-1.5 transition-colors font-[var(--font-poppins)]"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            if (name === "Faculty") {
              return (
                <div key={name} className="flex flex-col border-b border-gray-100 py-3">
                  <button
                    type="button"
                    onClick={() => setMobileFacultyOpen(!mobileFacultyOpen)}
                    className="w-full flex items-center justify-between text-[15px] font-semibold text-[#222222] hover:text-[#D4AF37] transition-colors font-[var(--font-poppins)] text-left outline-none cursor-pointer"
                  >
                    <span>{name}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${mobileFacultyOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileFacultyOpen && (
                    <div className="pl-4 flex flex-col gap-2 mt-2 pt-2 border-t border-gray-50">
                      {facultyItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="text-[13px] font-medium text-gray-600 hover:text-[#D4AF37] py-1.5 transition-colors font-[var(--font-poppins)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (name === "Campus Life") {
              return (
                <div key={name} className="flex flex-col border-b border-gray-100 py-3">
                  <button
                    type="button"
                    onClick={() => setMobileCampusLifeOpen(!mobileCampusLifeOpen)}
                    className="w-full flex items-center justify-between text-[15px] font-semibold text-[#222222] hover:text-[#D4AF37] transition-colors font-[var(--font-poppins)] text-left outline-none cursor-pointer"
                  >
                    <span>{name}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${mobileCampusLifeOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileCampusLifeOpen && (
                    <div className="pl-4 flex flex-col gap-2 mt-2 pt-2 border-t border-gray-50 max-h-[260px] overflow-y-auto">
                      {campusLifeItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="text-[13px] font-medium text-gray-600 hover:text-[#D4AF37] py-1.5 transition-colors font-[var(--font-poppins)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (name === "News & Events") {
              return (
                <div key={name} className="flex flex-col border-b border-gray-100 py-3">
                  <button
                    type="button"
                    onClick={() => setMobileNewsEventsOpen(!mobileNewsEventsOpen)}
                    className="w-full flex items-center justify-between text-[15px] font-semibold text-[#222222] hover:text-[#D4AF37] transition-colors font-[var(--font-poppins)] text-left outline-none cursor-pointer"
                  >
                    <span>{name}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${mobileNewsEventsOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileNewsEventsOpen && (
                    <div className="pl-4 flex flex-col gap-2 mt-2 pt-2 border-t border-gray-50 text-left">
                      {newsEventsItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          className="text-[13px] font-medium text-gray-600 hover:text-[#D4AF37] py-1.5 transition-colors font-[var(--font-poppins)]"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={name}
                to={navHrefs[name]}
                className="text-[15px] font-semibold text-[#222222] hover:text-[#D4AF37] py-3 border-b border-gray-100 transition-colors font-[var(--font-poppins)]"
              >
                {name}
              </Link>
            );
          })}
          <div className="flex flex-col gap-3 pt-8">
            <Link to="/admissions/apply" className="w-full text-center py-3 bg-[#D4AF37] text-white font-bold text-sm rounded-[12px] font-[var(--font-poppins)]">Apply Now</Link>
          </div>
        </div>
      )}

      {/* Global Smart Search Modal */}
      <GlobalSearchModal 
        isOpen={isGlobalSearchOpen} 
        onClose={() => setIsGlobalSearchOpen(false)} 
      />
    </>
  );
}
