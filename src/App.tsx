import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import { X, RefreshCw, CheckCircle2, Megaphone, Bell, Calendar, GraduationCap, FileText, Award, BookOpen, User, Phone, Mail, MapPin, Landmark, MessageSquare, ArrowRight, Send, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import DynamicPage from "./pages/DynamicPage";
import Genesis from "./pages/Genesis";
import Events from "./pages/Events";
import News from "./pages/News";
import NewsDetails from "./pages/NewsDetails";
import EventDetails from "./pages/EventDetails";
import AnnouncementDetails from "./pages/AnnouncementDetails";
import AllEvents from "./pages/AllEvents";
import AdminPortal from "./pages/AdminPortal";
import { DataProvider, useData } from "./context/DataContext";

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const IconMap: Record<string, React.ComponentType<any>> = {
  GraduationCap: GraduationCap,
  Calendar: Calendar,
  FileText: FileText,
  Award: Award,
  BookOpen: BookOpen
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra", 
  "Delhi", "Kerala", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal", 
  "Madhya Pradesh", "Other"
];

const QUALIFICATIONS = [
  "Class 12 / Intermediate", "Graduation / Under Graduate", "Post Graduation", "Diploma", "Other"
];

const YEARS_OF_PASSING = [
  "2030", "2029", "2028", "2027", "2026", "2025", "2024", "2023", "Before 2023"
];

const ALL_PROGRAMS = [
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

const ENQUIRY_SCHOOLS_DATA = [
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

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const { announcements, showAnnouncementsDrawer, setShowAnnouncementsDrawer, siteSettings, addEnquiry } = useData();

  const [showSplash, setShowSplash] = useState(siteSettings?.enableSplash !== false);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const fallbackTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = "hidden";
      
      // Safety fallback: dismiss splash screen after 10s if stuck loading
      fallbackTimerRef.current = setTimeout(() => {
        setShowSplash(false);
      }, 10000);

      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.defaultMuted = true;
        videoRef.current.play().catch((err) => {
          console.log("Autoplay blocked or video error, fallback active:", err);
        });
      }

      return () => {
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      sessionStorage.setItem("chalapathy_visited", "true");
    }
  }, [showSplash]);

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    // Clear safety loading timer once playback starts to avoid cutting video mid-play
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
  };

  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [hasViewedAnnouncements, setHasViewedAnnouncements] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("computing");
  
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    state: "",
    qualification: "",
    yearOfPassing: "",
    program: "",
    query: ""
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Automatic popup trigger on every page load/reload (Public Pages Only)
  useEffect(() => {
    if (!isAdminPage && !showSplash) {
      const timer = setTimeout(() => {
        setShowEnquiryModal(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (isAdminPage) {
      setShowEnquiryModal(false);
    }
  }, [showSplash, isAdminPage]);

  useEffect(() => {
    if (showEnquiryModal) {
      document.body.style.overflow = "hidden";
    } else if (showAnnouncementsDrawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setFormSubmitted(false);
      setFormData({
        name: "",
        mobile: "",
        email: "",
        city: "",
        state: "",
        qualification: "",
        yearOfPassing: "",
        program: "",
        query: ""
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showEnquiryModal, showAnnouncementsDrawer]);

  // Handle escape key listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowEnquiryModal(false);
        setShowAnnouncementsDrawer(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (addEnquiry) {
      addEnquiry(formData);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isAdminPage && showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[999999] bg-black flex items-center justify-center select-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          >
            <video
              ref={(el) => {
                if (el) {
                  el.muted = true;
                  el.defaultMuted = true;
                  // @ts-ignore
                  videoRef.current = el;
                }
              }}
              src={siteSettings?.splashVideoUrl || "/chalapathi_logo_intro.mp4"}
              autoPlay
              muted
              playsInline
              preload="auto"
              onPlay={handleVideoPlay}
              onPlaying={() => setIsVideoPlaying(true)}
              onCanPlay={(e) => {
                const vid = e.target as HTMLVideoElement;
                vid.muted = true;
                vid.play().catch((err) => console.log("Autoplay retry caught:", err));
              }}
              onLoadedMetadata={(e) => {
                const vid = e.target as HTMLVideoElement;
                vid.muted = true;
                vid.play().catch((err) => console.log("Autoplay onLoadedMetadata caught:", err));
              }}
              onLoadedData={(e) => {
                const vid = e.target as HTMLVideoElement;
                vid.muted = true;
                vid.play().catch((err) => console.log("Autoplay onLoadedData caught:", err));
              }}
              onError={(e) => {
                console.log("Video error detected:", e);
                setShowSplash(false);
              }}
              onEnded={() => {
                setTimeout(() => {
                  setShowSplash(false);
                }, 1000);
              }}
              className="w-full h-full object-cover"
            />
            <style dangerouslySetInnerHTML={{__html: `
              .intro-skip-text {
                position: absolute;
                bottom: 48px;
                right: 48px;
                background: transparent;
                border: none;
                font-weight: 800;
                font-size: 13px;
                color: #ffffff;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                text-shadow: 0 2px 5px rgba(0, 0, 0, 0.7);
                cursor: pointer;
                outline: none;
                transition: all 0.2s ease;
                z-index: 1000000;
              }
              .intro-skip-text:hover {
                color: #D4AF37;
                transform: scale(1.05);
              }
              .intro-skip-text:active {
                transform: scale(0.95);
              }
            `}} />
            
            <button
              onClick={() => setShowSplash(false)}
              className="intro-skip-text"
            >
              Skip Intro ➔
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-[#F7F8FC]">
        {!isAdminPage && <Header />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/programs" element={<DynamicPage />} />
            
            {/* About Routes */}
            <Route path="/about" element={<DynamicPage />} />
            <Route path="/about/genesis" element={<Genesis />} />
            <Route path="/about/vision" element={<DynamicPage />} />
            <Route path="/about/leadership" element={<DynamicPage />} />
            <Route path="/about/advantage" element={<DynamicPage />} />

            {/* Academics Routes */}
            <Route path="/academics" element={<DynamicPage />} />
            <Route path="/academics/schools" element={<DynamicPage />} />
            <Route path="/academics/departments" element={<DynamicPage />} />
            <Route path="/academics/computer-science" element={<DynamicPage />} />
            <Route path="/academics/artificial-intelligence" element={<DynamicPage />} />
            <Route path="/academics/data-science" element={<DynamicPage />} />
            <Route path="/academics/calendar" element={<DynamicPage />} />
            <Route path="/academics/flexibilities" element={<DynamicPage />} />
            <Route path="/academics/programmes" element={<DynamicPage />} />
            <Route path="/academics/grading" element={<DynamicPage />} />
            <Route path="/academics/degrees" element={<DynamicPage />} />
            <Route path="/academics/electives" element={<DynamicPage />} />
            <Route path="/academics/rules" element={<DynamicPage />} />
            <Route path="/academics/teaching" element={<DynamicPage />} />
            <Route path="/academics/bos" element={<DynamicPage />} />
            <Route path="/academics/*" element={<DynamicPage />} />

            {/* Admissions Routes */}
            <Route path="/admissions" element={<DynamicPage />} />
            <Route path="/admissions/undergraduate" element={<DynamicPage />} />
            <Route path="/admissions/postgraduate" element={<DynamicPage />} />
            <Route path="/admissions/phd" element={<DynamicPage />} />
            <Route path="/admissions/international" element={<DynamicPage />} />
            <Route path="/admissions/fees" element={<DynamicPage />} />
            <Route path="/admissions/scholarships" element={<DynamicPage />} />
            <Route path="/admissions/apply" element={<DynamicPage />} />

            {/* Research Routes */}
            <Route path="/research" element={<DynamicPage />} />
            <Route path="/research/projects" element={<DynamicPage />} />
            <Route path="/research/publications" element={<DynamicPage />} />
            <Route path="/research/patents" element={<DynamicPage />} />

            {/* Management Routes */}
            <Route path="/management" element={<DynamicPage />} />
            <Route path="/management/board-members" element={<DynamicPage />} />
            <Route path="/management/faculty/*" element={<DynamicPage />} />
            <Route path="/management/staff" element={<DynamicPage />} />

            {/* Campus Life Routes */}
            <Route path="/campus-life" element={<DynamicPage />} />
            <Route path="/campus-life/overview" element={<DynamicPage />} />
            <Route path="/campus-life/library" element={<DynamicPage />} />
            <Route path="/campus-life/smart-classrooms" element={<DynamicPage />} />
            <Route path="/campus-life/laboratories" element={<DynamicPage />} />
            <Route path="/campus-life/hostels" element={<DynamicPage />} />
            <Route path="/campus-life/sports" element={<DynamicPage />} />
            <Route path="/campus-life/cafeteria" element={<DynamicPage />} />
            <Route path="/campus-life/transportation" element={<DynamicPage />} />
            <Route path="/campus-life/wifi" element={<DynamicPage />} />
            <Route path="/campus-life/health-centre" element={<DynamicPage />} />
            <Route path="/campus-life/clubs" element={<DynamicPage />} />
            <Route path="/campus-life/events" element={<Events />} />
            <Route path="/campus-life/innovation-hub" element={<DynamicPage />} />
            <Route path="/campus-life/safety" element={<DynamicPage />} />
            <Route path="/campus-life/nss-ncc" element={<DynamicPage />} />
            <Route path="/campus-life/grievance-cell" element={<DynamicPage />} />
            <Route path="/campus-life/*" element={<DynamicPage />} />

            {/* Placements Routes */}
            <Route path="/placements" element={<DynamicPage />} />
            <Route path="/placements/statistics" element={<DynamicPage />} />
            <Route path="/placements/recruiters" element={<DynamicPage />} />
            <Route path="/placements/training" element={<DynamicPage />} />

            {/* News & Events Routes */}
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetails />} />
            <Route path="/news/latest" element={<DynamicPage />} />
            <Route path="/news/events" element={<Events />} />
            <Route path="/news/events/:slug" element={<EventDetails />} />
            <Route path="/news/events/all" element={<AllEvents />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetails />} />
            <Route path="/events/all" element={<AllEvents />} />
            <Route path="/announcements/:slug" element={<AnnouncementDetails />} />

            {/* Contact Route */}
            <Route path="/contact" element={<DynamicPage />} />

            {/* Legal / Policy Routes */}
            <Route path="/privacy-policy" element={<DynamicPage />} />
            <Route path="/terms-conditions" element={<DynamicPage />} />
            <Route path="/sitemap" element={<DynamicPage />} />
            
            {/* Admin Portal Route */}
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
        </main>
        {!isAdminPage && <Footer />}
      </div>

      {/* ======================================================== */}
      {/* 🌟 SLIMMED NON-OVERLAPPING STACKED RIGHT-SIDE TABS       */}
      {/* ======================================================== */}
      {!isAdminPage && (
        <div className="fixed right-0 top-[40%] -translate-y-1/2 z-40 flex flex-col gap-3 items-end font-[var(--font-poppins)]">
          {/* Admission Enquiry Tab (Navy Blue/White Text) */}
          <button
            onClick={() => setShowEnquiryModal(true)}
            className="w-[48px] h-[220px] bg-[#072A6C] hover:bg-[#051c4a] text-white font-bold text-[10px] tracking-[1.5px] rounded-l-xl shadow-md transition-all duration-300 hover:-translate-x-1 flex items-center justify-center [writing-mode:vertical-lr] rotate-180 whitespace-nowrap cursor-pointer select-none uppercase border border-r-0 border-white/10 outline-none"
          >
            Admission Enquiry
          </button>
        </div>
      )}
      {/* ======================================================== */}
      {showAnnouncementsDrawer && (
        <div 
          className="fixed inset-0 z-50 flex items-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowAnnouncementsDrawer(false)}
        >
          <div 
            className="bg-[#F7F8FC] w-full max-w-[400px] h-full shadow-2xl relative flex flex-col text-left rounded-r-2xl transform transition-transform duration-300 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header (Maroon) */}
            <div className="bg-[#072A6C] text-white p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Megaphone size={18} className="text-[#D4AF37]" />
                <h3 className="font-extrabold text-sm tracking-wide">Chalapathi Announcements</h3>
              </div>
              <button 
                onClick={() => setShowAnnouncementsDrawer(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer outline-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable list items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {announcements.map((item, idx) => {
                const Icon = IconMap[item.iconName] || Megaphone;
                const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                return (
                  <Link 
                    key={idx} 
                    to={`/announcements/${slug}`}
                    onClick={() => setShowAnnouncementsDrawer(false)}
                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow hover:border-gray-200 transition-all flex gap-3.5 items-start cursor-pointer text-left block"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#072A6C]/5 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-[#072A6C]" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-[#D71920] font-extrabold uppercase tracking-wider">Announcement</span>
                        <span className="text-[9px] text-[#D4AF37] font-bold">{item.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#072A6C] line-clamp-1 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 font-light leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-200/60 bg-white flex justify-end">
              <button 
                onClick={() => setShowAnnouncementsDrawer(false)}
                className="h-9 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🌟 ADMISSION ENQUIRY POPUP MODAL (SRM DESIGN)             */}
      {/* ======================================================== */}
      {showEnquiryModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6 overflow-y-auto"
          onClick={() => setShowEnquiryModal(false)}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .scrollbar-none::-webkit-scrollbar {
              display: none !important;
            }
            .scrollbar-none {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
          `}} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white w-full max-w-[1240px] md:h-auto md:max-h-[92vh] rounded-[24px] shadow-2xl relative flex flex-col md:flex-row overflow-hidden border border-gray-100 font-[var(--font-poppins)] text-left select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Panel: Schools & Programs */}
            <div className="w-full md:w-1/2 p-5 md:p-6 border-r border-gray-100 flex flex-col bg-slate-50/30 overflow-y-auto scrollbar-none">
              {/* Logo */}
              <div className="flex items-center justify-center mb-6 mt-2">
                <img 
                  src={siteSettings?.logoUrl || "/logo.png?v=3"} 
                  alt={siteSettings?.universityName || "Chalapathi University"} 
                  loading="eager"
                  // @ts-ignore
                  fetchpriority="high"
                  className="h-20 w-auto object-contain" 
                />
              </div>

              <h3 className="text-[12px] font-black uppercase text-[#072A6C] tracking-wide mb-0.5">
                EXPLORE OUR SCHOOLS & PROGRAMS
              </h3>
              <p className="text-[10px] text-gray-400 font-medium mb-4">
                Select a school to view its programs
              </p>

              {/* Accordions */}
              <div className="space-y-2.5">
                {ENQUIRY_SCHOOLS_DATA.map((school) => {
                  const isOpen = activeAccordion === school.id;
                  return (
                    <div key={school.id} className="border border-gray-150 rounded-[12px] bg-white overflow-hidden shadow-sm transition-all duration-300">
                      {/* Accordion Head */}
                      <button
                        type="button"
                        onClick={() => toggleAccordion(school.id)}
                        className={`w-full flex items-center justify-between py-2.5 px-4 transition-all duration-300 text-left outline-none cursor-pointer ${
                          isOpen ? "bg-[#072A6C] text-white" : "bg-white text-[#072A6C] hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {school.id === "computing" && <User size={16} />}
                          {school.id === "engineering" && <GraduationCap size={16} />}
                          {school.id === "business" && <Landmark size={16} />}
                          <div className="flex flex-col">
                            <span className="text-[10.5px] md:text-[11.5px] font-extrabold uppercase tracking-wider">{school.title}</span>
                            <span className={`text-[8.5px] md:text-[9.5px] ${isOpen ? "text-blue-100" : "text-gray-400"} mt-0.5`}>{school.subtitle}</span>
                          </div>
                        </div>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </button>

                      {/* Accordion Body */}
                      {isOpen && (
                        <div className="p-3.5 bg-white border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                          {school.groups.map((group, groupIdx) => (
                            <div key={groupIdx} className="space-y-2.5">
                              <h4 className="text-[10.5px] font-extrabold text-[#072A6C] border-b border-gray-100 pb-1">{group.name}</h4>
                              <div className="flex flex-col gap-1.5">
                                {group.courses.map((course, courseIdx) => {
                                  let badgeColor = "bg-blue-50 text-blue-600 border-blue-100/50";
                                  if (course.level === "PG") badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-100/50";
                                  if (course.level === "Ph.D") badgeColor = "bg-amber-50 text-amber-600 border-amber-100/50";
                                  return (
                                    <button
                                      key={courseIdx}
                                      type="button"
                                      onClick={() => setFormData({ ...formData, program: course.name })}
                                      className={`flex items-start gap-2 py-1 px-2 rounded-md border border-transparent hover:border-blue-100 hover:bg-blue-50/30 text-left transition-all duration-200 cursor-pointer ${
                                        formData.program === course.name ? "bg-blue-50/55 border-blue-200" : ""
                                      }`}
                                    >
                                      <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-black uppercase tracking-wider border shrink-0 ${badgeColor}`}>
                                        {course.level}
                                      </span>
                                      <span className="text-[9.5px] text-gray-700 font-bold leading-tight group-hover:text-blue-600">
                                        {course.name}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Enquiry Form */}
            <div className="w-full md:w-1/2 p-5 md:p-6 flex flex-col bg-white relative overflow-y-auto scrollbar-none">
              {/* Close Button */}
              <button 
                onClick={() => setShowEnquiryModal(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-155 flex items-center justify-center transition-all hover:scale-105 hover:rotate-90 duration-200 cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="mb-3.5">
                <h2 className="text-[18px] font-black text-[#072A6C] tracking-tight uppercase leading-none">
                  ADMISSIONS OPEN 2026-27
                </h2>
                <p className="text-[10.5px] text-gray-500 font-medium mt-1">
                  Build Your Future. Lead with Innovation.
                </p>
              </div>

              {/* Form Title Card */}
              <div className="bg-[#072A6C]/3 border border-[#072A6C]/10 rounded-xl p-3 flex items-center gap-3 mb-4">
                <div className="w-8.5 h-8.5 rounded-lg bg-[#072A6C]/10 flex items-center justify-center text-[#072A6C] shrink-0">
                  <FileText size={16} />
                </div>
                <div className="text-left">
                  <h4 className="text-[10.5px] font-black text-[#072A6C] uppercase tracking-wider leading-none mb-1">ENQUIRY FORM</h4>
                  <p className="text-[9.5px] text-gray-500 font-medium leading-none">Fill in your details. Our admission team will contact you soon.</p>
                </div>
              </div>

              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 my-auto">
                  <CheckCircle2 size={56} className="text-emerald-500 animate-bounce" />
                  <h4 className="text-base font-extrabold text-[#072A6C]">Enquiry Submitted Successfully!</h4>
                  <p className="text-xs text-gray-500 text-center max-w-[340px]">Our admissions helpdesk representative will contact you on your registered mobile number shortly.</p>
                  <button 
                    onClick={() => setShowEnquiryModal(false)}
                    className="h-10 px-6 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-[var(--font-poppins)]">
                  <div className="space-y-3">
                    {/* Full Name & Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Full Name *</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            required
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Mobile Number *</label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="tel" 
                            required
                            pattern="[0-9]{10}"
                            placeholder="Enter 10 digit mobile number"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Email Address *</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="email" 
                          required
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222]"
                        />
                      </div>
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">City *</label>
                        <div className="relative">
                          <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            required
                            placeholder="Enter your city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222]"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">State *</label>
                        <div className="relative">
                          <Landmark size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select 
                            required
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] bg-white appearance-none cursor-pointer"
                          >
                            <option value="">Select your state</option>
                            {INDIAN_STATES.map((state) => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Qualification & Year of Passing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Qualification *</label>
                        <div className="relative">
                          <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select 
                            required
                            value={formData.qualification}
                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] bg-white appearance-none cursor-pointer"
                          >
                            <option value="">Select qualification</option>
                            {QUALIFICATIONS.map((q) => (
                              <option key={q} value={q}>{q}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Year of Passing *</label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select 
                            required
                            value={formData.yearOfPassing}
                            onChange={(e) => setFormData({ ...formData, yearOfPassing: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] bg-white appearance-none cursor-pointer"
                          >
                            <option value="">Select year</option>
                            {YEARS_OF_PASSING.map((year) => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Interested Program */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Interested Program *</label>
                      <div className="relative">
                        <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                          required
                          value={formData.program}
                          onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                          className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] bg-white appearance-none cursor-pointer"
                        >
                          <option value="">Select a program (Auto-filled)</option>
                          {ALL_PROGRAMS.map((prog) => (
                            <option key={prog} value={prog}>{prog}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Any Query */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Any Query (Optional)</label>
                      <div className="relative">
                        <textarea 
                          placeholder="Write your message..."
                          value={formData.query}
                          onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                          rows={2}
                          className="w-full pl-4 pr-3 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Apply Enquiry Button */}
                    <button
                      type="submit"
                      className="w-full h-11 bg-[#FAB005] hover:bg-[#e09e00] text-gray-900 font-extrabold text-[12px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer outline-none"
                    >
                      <Send size={13} className="rotate-45 -translate-y-0.5" />
                      <span>APPLY ENQUIRY</span>
                    </button>

                    {/* Privacy */}
                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-semibold">
                      <ShieldCheck size={12} className="text-gray-400" />
                      <span>Your information is safe with us. We respect your <Link to="/privacy-policy" onClick={() => setShowEnquiryModal(false)} className="text-blue-500 hover:underline">privacy</Link>.</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}

    </>
  );
}

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </DataProvider>
  );
}
