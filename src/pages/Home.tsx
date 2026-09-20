"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap, Users, ArrowRight, Play, Trophy, Handshake, Landmark,
  Compass, FileText, Award, Phone, MapPin, Mail, Sparkles, Building2, HelpCircle, Search, Globe,
  UserPlus, ShieldCheck, UploadCloud, CreditCard, Settings, Briefcase, Code, FlaskConical, Wrench, Atom, X, Calendar, Clock, Coffee, Bus,
  Brain, Database, Monitor, Cpu, Shield, CircuitBoard, Network, HardHat,
  Share2, ChevronLeft, ChevronRight, ExternalLink
} from "lucide-react";
import SEO from "../components/SEO";

const FEATURED_IMAGES = [
  "/prog_computer.png",
  "/prog_engineering.png",
  "/prog_management.png",
  "/prog_pharmacy.png"
];
import { useData } from "../context/DataContext";
import { ACADEMIC_PROGRAMS_STRUCTURE } from "../components/layout/Header";
import imgComputerScience from "../assets/illustrations/computer_science.png";
import imgMtechCSE from "../assets/illustrations/mtech_cse.png";
import imgMCA from "../assets/illustrations/mca.png";
import imgPhdCSE from "../assets/illustrations/phd_cse.png";
import imgDataScience from "../assets/illustrations/data_science.png";
import imgArtificialIntelligence from "../assets/illustrations/artificial_intelligence.png";
import imgAIMachineLearning from "../assets/illustrations/aiml.png";
import imgCyberSecurity from "../assets/illustrations/cyber_security.png";
import imgElectronicsCommunication from "../assets/illustrations/electronics.png";
import imgVLSIEmbedded from "../assets/illustrations/vlsi.png";
import imgCivilEngineering from "../assets/illustrations/civil.png";
import imgStructuralEngineering from "../assets/illustrations/structural.png";
import imgMBA from "../assets/illustrations/mba.png";

/* ── animation helpers ────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function AnimatedCounter({ value, duration = 2500 }: { value: string; duration?: number }) {
  const [count, setCount] = React.useState(0);
  const elementRef = React.useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  const numericPart = parseInt(value.replace(/,/g, "").replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9,]/g, "");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeProgress * numericPart));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [numericPart, duration, hasAnimated]);

  const formattedCount = numericPart >= 10000 
    ? count.toLocaleString("en-IN") 
    : count;

  return (
    <span 
      ref={elementRef} 
      className={`block text-[22px] font-[800] leading-none text-[#D4AF37] transition-all duration-300 ${
        hasAnimated && count < numericPart ? "scale-[0.95] drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" : "scale-100"
      }`}
    >
      {formattedCount}{suffix}
    </span>
  );
}

export default function Home() {
  const { 
    programs, 
    successStories, 
    placementsContent, 
    news, 
    events, 
    heroSlides,
    academicStructure,
    campusVideos: contextCampusVideos,
    campusTour,
    campusGallery,
    campusBanners,
    homepageSections
  } = useData();
  const navigate = useNavigate();
  const [directionsFrom, setDirectionsFrom] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Active tab state for Schools & Programs
  const structure = academicStructure && Object.keys(academicStructure).length > 0
    ? academicStructure
    : ACADEMIC_PROGRAMS_STRUCTURE;

  const schools = Object.keys(structure);
  const [activeSchoolTab, setActiveSchoolTab] = useState<string>(schools[0] || "School of Engineering");
  const [activeDepartmentTab, setActiveDepartmentTab] = useState<string | null>(null);

  // Sync activeSchoolTab if structure updates
  useEffect(() => {
    if (schools.length > 0 && (!activeSchoolTab || !structure[activeSchoolTab])) {
      setActiveSchoolTab(schools[0]);
    }
  }, [structure, schools, activeSchoolTab]);

  const validDepartments = structure[activeSchoolTab] ? Object.keys(structure[activeSchoolTab]) : [];
  const currentDepartment = (activeDepartmentTab && validDepartments.includes(activeDepartmentTab))
    ? activeDepartmentTab
    : validDepartments[0];

  // Reset states on unmount
  useEffect(() => {
    return () => {
    };
  }, []);

  // Bridge Section Slider & Student Rotation States
  const [activeBridgeSlide, setActiveBridgeSlide] = useState(0);
  const [activeFeaturedStudent, setActiveFeaturedStudent] = useState(0);

  // Video playback states
  const [isEventsDrawerOpen, setIsEventsDrawerOpen] = useState(false);
  const [showChairmanVideo, setShowChairmanVideo] = useState(false);
  const [showHeroIntroModal, setShowHeroIntroModal] = useState(false);
  const drawerScrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll, handle escape key, and scroll to top when Events Drawer opens
  useEffect(() => {
    if (isEventsDrawerOpen) {
      document.body.classList.add("overflow-hidden");
      if (drawerScrollRef.current) {
        drawerScrollRef.current.scrollTop = 0;
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEventsDrawerOpen(false);
      }
    };

    if (isEventsDrawerOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEventsDrawerOpen]);

  // Featured News States
  const [activeNewsSlide, setActiveNewsSlide] = useState(0);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  const featuredSlides = useMemo(() => {
    const featured = news?.filter(item => item.featured) || [];
    return featured.length > 0 ? featured : news?.slice(0, 4) || [];
  }, [news]);

  // Auto-slide effect for the Featured News image carousel
  useEffect(() => {
    if (featuredSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveNewsSlide((prev) => (prev + 1) % featuredSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredSlides]);

  const handleShareFeaturedNews = (e: React.MouseEvent, slug: string) => {
    e.stopPropagation();
    const activeSlide = featuredSlides[activeNewsSlide];
    const url = `${window.location.origin}/news/${slug}`;
    if (navigator.share) {
      navigator.share({
        title: activeSlide?.title || "News @ City Chalapathi",
        text: activeSlide?.excerpt || "",
        url: url
      }).catch((err) => console.log("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShowCopiedTooltip(true);
        setTimeout(() => setShowCopiedTooltip(false), 2000);
      });
    }
  };

  // Campus Life States
  const [activeCampusVideoIdx, setActiveCampusVideoIdx] = useState(0);
  const [isCampusTourMuted, setIsCampusTourMuted] = useState(true);
  const campusVideoRef = useRef<HTMLVideoElement>(null);

  // Load campus videos list
  const campusVideos = (contextCampusVideos && contextCampusVideos.length > 0)
    ? contextCampusVideos
    : [
        { url: "/chalapathi_logo_intro.mp4", title: "Campus Overview" },
        { url: "https://assets.mixkit.co/videos/preview/mixkit-drones-eye-view-of-a-modern-university-campus-41555-large.mp4", title: "Smart Classrooms & Labs" },
        { url: "https://assets.mixkit.co/videos/preview/mixkit-group-of-students-walking-on-college-campus-41553-large.mp4", title: "Student Life & Clubs" }
      ];

  // Autoplay sliding campus tour videos every 8 seconds
  useEffect(() => {
    if (campusVideos.length <= 1) return;
    const timer = setInterval(() => {
      setActiveCampusVideoIdx((prev) => (prev + 1) % campusVideos.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [campusVideos.length]);

  // Auto-scroll for Left Side Hero Slider (5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBridgeSlide((prev) => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-rotate for Student Success Testimonials (6 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeaturedStudent((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const slides = [
    {
      heading: ["SHAPING", "TOMORROW'S", "INNOVATORS"],
      tagline: "Empowering ambitious minds through world-class education, cutting-edge research, industry collaboration, and transformative learning experiences that prepare future leaders."
    },
    {
      heading: ["LEARN", "TODAY.", "LEAD TOMORROW."],
      tagline: "Discover an ecosystem where innovation meets opportunity, guided by expert faculty, modern infrastructure, global exposure, and career-focused education."
    },
    {
      heading: ["CREATE", "YOUR", "FUTURE"],
      tagline: "Transform your ideas into reality through advanced laboratories, startup incubation, interdisciplinary learning, and hands-on industry experience."
    },
    {
      heading: ["YOUR", "SUCCESS", "STARTS HERE"],
      tagline: "Join thousands of successful graduates who built remarkable careers through excellence in academics, innovation, leadership, and professional development."
    }
  ];

  const handleDirections = (e: React.FormEvent) => {
    e.preventDefault();
    if (directionsFrom) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(directionsFrom)}&destination=Chalapathi+Institute+of+Technology+Mothadaka`, "_blank");
    }
  };

  useEffect(() => {
    document.title = "Chalapathi University | Best University in Andhra Pradesh";
  }, []);

  const slidesCount = heroSlides && heroSlides.length > 0 ? heroSlides.length : 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((slide) => (slide + 1) % slidesCount);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [slidesCount]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
      setProgress(0);
    }
    if (distance < -50) {
      setCurrentSlide((prev) => (prev - 1 + slidesCount) % slidesCount);
      setProgress(0);
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FC] text-[#222222] overflow-x-hidden font-[var(--font-poppins)]">
      <SEO 
        title="Best University in andhraPradesh -ChalapathiUniversity" 
        description="Chalapathi University offers world-class higher education with premium undergraduate, postgraduate, and research programs. Admissions Open for 2026–2027." 
      />
      {/* ═══ HERO SECTION (720px height) ═══ */}
      <section 
        className="relative w-full overflow-hidden bg-white select-none" 
        style={{ height: "720px" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideEntrance {
            0% {
              opacity: 0;
              transform: translateY(40px);
              filter: blur(8px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
              filter: blur(0);
            }
          }
          @keyframes letter-fade {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          .animate-letter-fade {
            opacity: 0;
            animation: letter-fade 300ms ease-out forwards;
          }
          @keyframes tagline-fade {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-tagline-fade {
            opacity: 0;
            animation: tagline-fade 500ms ease-out forwards;
          }
          @keyframes scale-width {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
          .animate-scale-width {
            transform: scaleX(0);
            animation: scale-width 600ms cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}} />

        {/* Dynamic slides carousel */}
        {heroSlides && heroSlides.length > 0 && heroSlides.map((slide, index) => {
          const isActive = currentSlide === index;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-top transition-opacity duration-1000 ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{
                backgroundImage: `url('${slide.image}')`,
                backgroundPosition: "center top"
              }}
            >
              {/* Optional text overlay if title/subtitle are provided */}
              {(slide.title || slide.subtitle) && (
                <div className="absolute inset-0 bg-black/35 flex flex-col items-center justify-center text-center p-5 z-20">
                  {slide.title && (
                    <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-wider mb-2 animate-[slideEntrance_0.8s_ease-out]">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-gray-100 text-sm md:text-lg lg:text-xl font-bold uppercase tracking-widest animate-[slideEntrance_1s_ease-out]">
                      {slide.subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Slider Indicator Dots (only show if slides > 1) */}
        {heroSlides && heroSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 border-none outline-none cursor-pointer ${
                  currentSlide === idx ? "bg-[#D4AF37] w-6" : "bg-white/50 w-2.5 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══ ADMISSION ALERT TICKER ═══ */}
      <section className="relative z-10 w-full h-[50px] bg-[#F4B400] text-[#0A2D6D] flex items-center overflow-hidden select-none font-[var(--font-poppins)] font-[700] text-[18px] shadow-[inset_0_4px_6px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.05)] border-none">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .marquee-inner {
            display: flex;
            width: max-content;
            animation: marquee 20s linear infinite;
            will-change: transform;
          }
          .marquee-inner:hover {
            animation-play-state: paused;
          }
        `}} />
        <div className="marquee-inner">
          <span className="px-4 whitespace-nowrap">🚨 Admissions Open for Academic Year 2026–27 • Applications Closing Soon • Apply Now • Scholarships Available for Meritorious Students • Limited Seats • Register Today • Highest Placement Opportunities • Admissions Open for 2026–27 •</span>
          <span className="px-4 whitespace-nowrap" aria-hidden="true">🚨 Admissions Open for Academic Year 2026–27 • Applications Closing Soon • Apply Now • Scholarships Available for Meritorious Students • Limited Seats • Register Today • Highest Placement Opportunities • Admissions Open for 2026–27 •</span>
        </div>
      </section>

      {/* ═══ STATISTICS BAR (Dark Blue - 14px border-radius container) ═══ */}
      <section className="bg-[#072A6C] w-full text-white py-8 select-none relative z-20 overflow-hidden">
        <motion.div
          className="max-w-[1440px] mx-auto px-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-4 justify-items-center text-center">
            {[
              { n: "25+", label: "Years of Excellence", icon: Trophy },
              { n: "150+", label: "Programs Offered", icon: GraduationCap },
              { n: "50+", label: "Expert Faculty", icon: Users },
              { n: "300+", label: "Industry Partners", icon: Handshake },
              { n: "20,000+", label: "Successful Alumni", icon: Landmark },
              { n: "95%", label: "Placement Success", icon: Award },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} className="flex flex-col items-center max-w-[160px] rounded-[14px]" variants={fadeUp}>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 border border-[#D4AF37]/30 shadow-sm relative group overflow-hidden">
                    <Icon size={18} className="text-[#D4AF37] relative z-10 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                    <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <AnimatedCounter value={s.n} />
                  <span className="block text-[11px] text-gray-200 font-[500] mt-2 leading-tight">
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ═══ WHY CHOOSE US SECTION ═══ */}
      <section className="bg-[#F8FAFC] w-full py-10 md:py-12 border-y border-gray-100">
        <div className="max-w-[1440px] mx-auto w-full px-5 text-center">

          <motion.h2
            className="text-[32px] md:text-[40px] font-[800] text-[#0F172A] mb-4"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why To Choose Chalapathi University?
          </motion.h2>
          <motion.p
            className="text-[#64748B] max-w-3xl mx-auto text-[15px] md:text-[17px] leading-relaxed mb-8 font-[500]"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Experience an education that blends academic excellence, innovation, industry collaboration, research, global exposure, and holistic development—preparing students to become future-ready professionals and responsible global leaders.
          </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            {
              title: "Industry integrated curriculum",
              desc: "Curriculum designed with practical learning and industry collaboration to ensure graduates are career-ready.",
              icon: Trophy,
              color: "#123A7A"
            },
            {
              title: "Expert Faculty & Research",
              desc: "Learn from accomplished faculty members, researchers, and industry experts who inspire innovation.",
              icon: Users,
              color: "#1F4FA8"
            },
            {
              title: "Smart Campus Infrastructure",
              desc: "Technology-enabled classrooms, modern laboratories, and collaborative learning spaces designed for excellence.",
              icon: Building2,
              color: "#123A7A"
            },
            {
              title: "Career & Placement Excellence",
              desc: "Industry partnerships, internships, and placement training help students launch successful careers.",
              icon: Handshake,
              color: "#1F4FA8"
            },
            {
              title: "Global Learning Opportunities",
              desc: "International certifications, collaborative learning, and global industry exposure.",
              icon: Globe,
              color: "#123A7A"
            },
            {
              title: "Leadership & Holistic Development",
              desc: "Develop leadership, communication, creativity, and life skills through a vibrant campus ecosystem.",
              icon: Sparkles,
              color: "#1F4FA8"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                className="bg-white border border-[#E7ECF3] rounded-[16px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group"
                variants={fadeUp}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon size={24} />
                </div>
                <h3 className="font-[700] text-[16px] text-[#0F172A] mb-3 leading-snug min-h-[48px] flex items-center justify-center transition-colors duration-300 group-hover:text-[#123A7A]">
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#64748B] leading-relaxed font-[500]">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
        </div>
      </section>

      {/* ═══ OUR PROGRAMS SECTION (Tabbed Layout) ═══ */}
      <section className="bg-[#f8f9fa] border-t border-gray-100 py-10 md:py-12">
        <div className="max-w-[1280px] mx-auto w-full px-5">
          <div className="flex flex-col items-center justify-center mb-6">
            <h2 className="text-[32px] md:text-[38px] font-[800] text-[#072A6C] tracking-tight mb-4">
              Explore Our Schools & Programs
            </h2>
            
            {/* Main Tabs (Schools) */}
            {(() => {
              const schoolIcons: Record<string, string> = {
                "School of Computing Sciences": "💻",
                "School of Engineering": "⚙️",
                "School of Business & Management": "💼",
                "School of Pharmacy": "⚕️",
                "School of Law": "⚖️"
              };
              return (
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-6xl mb-12">
                  {schools.map((school) => {
                    const isActive = activeSchoolTab === school;
                    const icon = schoolIcons[school] || "🏫";
                    return (
                      <button
                        key={school}
                        onClick={() => setActiveSchoolTab(school)}
                        className={`px-5 py-4 rounded-2xl flex items-center justify-center gap-2.5 text-[14px] sm:text-[16px] md:text-[22px] font-[700] tracking-[0.5px] border transition-all duration-300 transform active:scale-98 cursor-pointer relative ${
                          isActive
                            ? "bg-[#0B3D91] text-white border-transparent shadow-lg shadow-[#0B3D91]/25 scale-105 border-b-[3px] border-b-[#D4AF37]"
                            : "bg-white text-[#0B3D91] border-[#0B3D91]/20 hover:bg-[#0B3D91] hover:text-white hover:border-transparent hover:shadow-md"
                        }`}
                      >
                        <span className="text-[1.1em]">{icon}</span>
                        <span>{school}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeSchoolTabIndicator"
                            className="absolute -bottom-1 left-8 right-8 h-[3px] bg-[#D4AF37] rounded-full"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {/* Sub Tabs (Departments) */}
            {activeSchoolTab && structure[activeSchoolTab] && (
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 w-full max-w-5xl mb-6">
                {Object.keys(structure[activeSchoolTab]).map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setActiveDepartmentTab(dept)}
                    className={`text-[13px] md:text-[16px] font-[700] transition-colors ${
                      currentDepartment === dept 
                        ? "text-[#072A6C]" 
                        : "text-gray-400 hover:text-[#072A6C]"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <motion.div
            key={`${activeSchoolTab}-${currentDepartment}`}
            className="flex flex-wrap justify-center gap-8 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeSchoolTab && currentDepartment && structure[activeSchoolTab]?.[currentDepartment]
              ?.map((courseLink: any, idx: number) => {
                
                // Find full program data using the slug if any
                const programSlug = courseLink.to ? courseLink.to.split('/').pop() : "";
                const program = programs.find(p => p.slug === programSlug);

                const cardTitle = courseLink.label || program?.title || "Academic Program";
                const cardDesc = courseLink.description || program?.overview || program?.desc || "Comprehensive curriculum with world-class faculty and hands-on laboratory experience.";
                const cardLink = courseLink.to || (program?.slug ? `/academics/${program.slug}` : "/academics");
                const cardImage = courseLink.image;
                
                // Helper to assign a dynamic image based on title
                const getIllustrationForProgram = (title: string, size = 64) => {
                  if (cardImage) {
                    return (
                      <img 
                        src={cardImage} 
                        alt={cardTitle} 
                        style={{ width: size, height: size, objectFit: "contain" }}
                        className="rounded-lg"
                      />
                    );
                  }
                  const t = title.toLowerCase();
                  let imgSrc = imgComputerScience;
                  
                  if (t.includes('cse') && t.includes('ai') && t.includes('learning')) imgSrc = imgArtificialIntelligence;
                  else if (t.includes('machine learning') || t.includes('aiml')) imgSrc = imgAIMachineLearning;
                  else if (t.includes('artificial intelligence') || t.includes('ai')) imgSrc = imgArtificialIntelligence;
                  else if (t.includes('data science') || t.includes('data')) imgSrc = imgDataScience;
                  else if (t.includes('cyber security') || t.includes('security')) imgSrc = imgCyberSecurity;
                  else if (t.includes('ph.d')) imgSrc = imgPhdCSE;
                  else if (t.includes('electronics') || t.includes('communication') || t.includes('ece')) imgSrc = imgElectronicsCommunication;
                  else if (t.includes('vlsi') || t.includes('embedded')) imgSrc = imgVLSIEmbedded;
                  else if (t.includes('structural')) imgSrc = imgStructuralEngineering;
                  else if (t.includes('civil')) imgSrc = imgCivilEngineering;
                  else if (t.includes('management') || t.includes('mba')) imgSrc = imgMBA;
                  else if (t.includes('m.tech') && t.includes('computer science')) imgSrc = imgArtificialIntelligence;
                  else if (t.includes('master of computer') || t.includes('mca')) imgSrc = imgMCA;
                  else if (t.includes('math') || t.includes('computational')) imgSrc = imgDataScience;
                  else if (t.includes('physics') || t.includes('material')) imgSrc = imgElectronicsCommunication;
                  else if (t.includes('chemistry') || t.includes('environmental')) imgSrc = imgStructuralEngineering;
                  else if (t.includes('english') || t.includes('humanities') || t.includes('communication')) imgSrc = imgMCA;
                  else if (t.includes('cse') || t.includes('computer science') || t.includes('software')) imgSrc = imgComputerScience;
                  
                  return (
                    <img 
                      src={imgSrc} 
                      alt={title} 
                      style={{ width: size, height: size, objectFit: 'contain', clipPath: t.includes('mba') || t.includes('management') ? 'inset(18% 0% 25% 0%)' : 'inset(0% 0% 25% 0%)' }}
                      className="rounded-lg"
                    />
                  );
                };

                 return (
                  <motion.div
                    key={idx}
                    className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden h-[340px] shrink-0 ${
                      structure[activeSchoolTab][currentDepartment]?.length === 4
                        ? "w-full md:w-[calc(50%-16px)] lg:w-[calc(25%-24px)]"
                        : "w-full md:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)]"
                    }`}
                    variants={scaleIn}
                    whileHover="hover"
                    initial="rest"
                  >
                    {/* Default State (Centered) */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center p-5 transition-all duration-300 group-hover:-translate-y-8 group-hover:opacity-0 text-center">
                      <div className="flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-[1.06]">
                        {getIllustrationForProgram(cardTitle, 110)}
                      </div>
                      <h3 className="font-[800] text-[#072A6C] text-[16px] leading-tight max-w-[250px]">
                        {cardTitle}
                      </h3>
                    </div>
                    
                    {/* Hover State (Sliding up) */}
                    <div className="absolute inset-0 flex flex-col justify-start items-center p-5 opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white text-center">
                      <div className="flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-[1.06]">
                        {getIllustrationForProgram(cardTitle, 80)}
                      </div>
                      <h3 className="font-[800] text-[#072A6C] text-[15px] mb-2 leading-tight max-w-[250px]">
                        {cardTitle}
                      </h3>
                      <p className="text-[12px] text-gray-500 line-clamp-3 leading-relaxed mb-4">
                        {cardDesc}
                      </p>
                      
                      <Link 
                        to={cardLink}
                        className="mt-auto bg-[#072A6C] text-white px-6 py-2 rounded-full text-[13px] font-[700] flex items-center gap-2 hover:bg-[#D4AF37] transition-colors shadow-md"
                      >
                        Read More <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══ DYNAMIC CAMPUS VIDEO, LATEST NEWS & UPCOMING EVENTS ═══ */}
      <section className="bg-gray-50 border-y border-gray-100 py-20 relative font-[var(--font-poppins)]">
        <div className="max-w-[1440px] mx-auto px-5">
          {/* Header */}
          <div className="text-left mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-[950] text-[#072A6C] uppercase tracking-tight mb-4 leading-none">
              {(() => {
                const sec = homepageSections?.find((s) => s.id === "newsEvents");
                const title = sec?.title || "News & Events";
                if (title.includes("&")) {
                  const [p1, p2] = title.split("&");
                  return <>{p1}& <span className="text-[#D4AF37]">{p2}</span></>;
                }
                return title;
              })()}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 max-w-2xl font-light leading-relaxed">
              {homepageSections?.find((s) => s.id === "newsEvents")?.subtitle || "Stay Informed. Stay Ahead. Discover the latest updates and exciting events happening at Chalapathi."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT COLUMN: Featured News Card (50% / lg:col-span-6) */}
            <div className="lg:col-span-6 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch select-none">
              
              {/* Left half: Image slider carousel */}
              <div className="w-full md:w-1/2 relative bg-slate-900 group min-h-[300px] md:min-h-auto flex items-stretch">
                {featuredSlides[activeNewsSlide] && (
                  <img 
                    src={featuredSlides[activeNewsSlide].image || "/prog_computer.png"} 
                    alt={featuredSlides[activeNewsSlide].title || "Featured News"} 
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                
                {/* Featured Badge */}
                <span className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm">
                  Featured News
                </span>

                {/* Slider arrows */}
                {featuredSlides.length > 1 && (
                  <>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveNewsSlide((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer border-none outline-none"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveNewsSlide((prev) => (prev + 1) % featuredSlides.length);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer border-none outline-none"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}
              </div>

              {/* Right half: Text Content */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between text-left">
                {featuredSlides[activeNewsSlide] && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                        {featuredSlides[activeNewsSlide].category || "Innovation"}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] text-gray-400 font-semibold font-[var(--font-inter)]">
                        {featuredSlides[activeNewsSlide].date}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-[22px] font-extrabold text-[#072A6C] leading-snug line-clamp-3">
                      {featuredSlides[activeNewsSlide].title}
                    </h2>

                    <p className="text-[12px] text-gray-500 font-light leading-relaxed font-[var(--font-inter)] line-clamp-4">
                      {featuredSlides[activeNewsSlide].excerpt}
                    </p>
                  </div>
                )}

                {/* Actions & Indicator Dots */}
                <div className="pt-6 space-y-4">
                  {featuredSlides[activeNewsSlide] && (
                    <div className="flex items-center gap-3 relative">
                      <button 
                        type="button"
                        onClick={() => navigate(`/news/${featuredSlides[activeNewsSlide].slug}`)}
                        className="h-10 px-6 bg-[#072A6C] hover:bg-[#D4AF37] text-white text-[11px] font-bold rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm border-none outline-none"
                      >
                        <span>Read Full Story</span>
                        <ArrowRight size={12} />
                      </button>
                      
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={(e) => handleShareFeaturedNews(e, featuredSlides[activeNewsSlide].slug || "")}
                          className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-600 flex items-center justify-center transition-colors cursor-pointer outline-none"
                        >
                          <Share2 size={14} />
                        </button>

                        {/* Tooltip confirmation */}
                        <AnimatePresence>
                          {showCopiedTooltip && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#072A6C] text-white text-[10px] font-bold rounded-lg shadow-md whitespace-nowrap z-20 pointer-events-none"
                            >
                              Link Copied!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}

                  {/* Slider Indicator Dots */}
                  {featuredSlides.length > 1 && (
                    <div className="flex items-center gap-1.5">
                      {featuredSlides.map((_, idx) => (
                        <button 
                          key={idx}
                          type="button"
                          onClick={() => setActiveNewsSlide(idx)}
                          className={`h-2.5 rounded-full transition-all duration-300 border-none outline-none cursor-pointer ${
                            activeNewsSlide === idx ? "bg-[#D4AF37] w-6" : "bg-gray-300 w-2.5"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* CENTER COLUMN: Latest News (25% / lg:col-span-3) */}
            <div className="lg:col-span-3 flex flex-col justify-between bg-[#072A6C] text-white border border-[#072A6C]/20 rounded-[24px] p-6 shadow-sm shadow-[#072A6C]/10">
              <div className="w-full text-left">
                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-5">
                  <h3 className="text-[12px] font-[800] uppercase tracking-widest text-[#D4AF37]">
                    Latest News
                  </h3>
                  <Link to="/news" className="text-[10px] font-bold text-white/80 hover:text-[#D4AF37] hover:underline flex items-center gap-0.5">
                    View All
                  </Link>
                </div>

                <div className="space-y-4">
                  {(news.length > 4 ? news.slice(1, 5) : news.slice(0, 4)).map((item, idx) => {
                    const dateParts = (() => {
                      if (!item.date) return { day: "12", month: "MAY" };
                      const parts = item.date.trim().split(" ");
                      return {
                        day: parts[0] || "12",
                        month: (parts[1] || "MAY").toUpperCase().substring(0, 3)
                      };
                    })();
                    return (
                      <div 
                        key={item.id || idx}
                        onClick={() => navigate(`/news/${item.slug}`)}
                        className="flex gap-3.5 items-start cursor-pointer group"
                      >
                        {/* Custom Date Badge */}
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white text-center flex flex-col items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105 border border-white/5">
                          <span className="block text-[12px] font-black leading-none">{dateParts.day}</span>
                          <span className="block text-[7px] font-extrabold tracking-wider mt-0.5">{dateParts.month}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-bold text-white leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          <span className="text-[9.5px] text-white/60 font-medium block mt-0.5 leading-relaxed line-clamp-1">{item.excerpt || item.bodyText}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Upcoming Events (25% / lg:col-span-3) */}
            <div className="lg:col-span-3 flex flex-col justify-between bg-[#072A6C] text-white border border-[#072A6C]/20 rounded-[24px] p-6 shadow-sm shadow-[#072A6C]/10">
              <div className="w-full text-left">
                <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-5">
                  <h3 className="text-[12px] font-[800] uppercase tracking-widest text-[#D4AF37]">
                    Upcoming Events
                  </h3>
                  <button 
                    type="button"
                    onClick={() => setIsEventsDrawerOpen(true)}
                    className="text-[10px] font-bold text-white/80 hover:text-[#D4AF37] hover:underline flex items-center gap-0.5 bg-transparent border-none cursor-pointer outline-none font-[var(--font-poppins)]"
                  >
                    Calendar
                  </button>
                </div>

                <div className="space-y-4">
                  {events.slice(0, 4).map((item, idx) => {
                    const dateParts = (() => {
                      if (!item.date) return { day: "12", month: "MAY" };
                      const parts = item.date.trim().split(" ");
                      return {
                        day: parts[0] || "12",
                        month: (parts[1] || "MAY").toUpperCase().substring(0, 3)
                      };
                    })();
                    return (
                      <div 
                        key={item.id || idx}
                        onClick={() => navigate(`/news/events/${item.slug}`)}
                        className="flex gap-3.5 items-start cursor-pointer group"
                      >
                        {/* Custom Date Badge */}
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white text-center flex flex-col items-center justify-center shadow-sm shrink-0 transition-transform group-hover:scale-105 border border-white/5">
                          <span className="block text-[12px] font-black leading-none">{dateParts.day}</span>
                          <span className="block text-[7px] font-extrabold tracking-wider mt-0.5">{dateParts.month}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-bold text-white leading-snug group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                            {item.title}
                          </h4>
                          <span className="text-[9.5px] text-white/60 font-medium block mt-0.5 leading-none">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ CAMPUS LIFE SECTION ═══ */}
      <section className="bg-white py-20 relative overflow-hidden font-[var(--font-poppins)] border-t border-gray-100">
        {/* Soft Radial Gradients & floating elements */}
        <div className="absolute top-40 left-0 w-96 h-96 rounded-full bg-blue-50/20 blur-3xl -z-10" />
        <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-yellow-50/10 blur-3xl -z-10" />

        <div className="max-w-[1440px] mx-auto px-5">
          
          {/* Section Header */}
          <div className="text-left mb-16">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-[950] text-[#072A6C] uppercase tracking-tight mb-4 leading-none">
              {(() => {
                const label = localStorage.getItem("chalapathi_campus_label") || "CAMPUS LIFE";
                if (label.toLowerCase() === "campus life") {
                  return <>Campus <span className="text-[#D4AF37]">Life</span></>;
                }
                return label;
              })()}
            </h2>
            <p className="text-xs md:text-sm text-gray-500 max-w-2xl font-light leading-relaxed">
              Beyond Classrooms. Beyond Limits. {localStorage.getItem("chalapathi_campus_subtitle") || "A vibrant campus where students learn, innovate, explore, compete, and create unforgettable memories."}
            </p>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
            
            {/* LEFT SIDE: 2x4 Feature Cards Grid (55% / lg:col-span-7) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 select-none">
              {((): any[] => {
                try {
                  const saved = localStorage.getItem("chalapathi_campus_cards");
                  if (saved) return JSON.parse(saved);
                } catch (e) {}
                return [
                  { title: "Vibrant Community", desc: "A diverse and inclusive campus with students from across India and the world.", icon: "Users", border: "border-blue-500" },
                  { title: "Clubs & Activities", desc: "50+ student clubs to explore passions and build leadership skills.", icon: "GraduationCap", border: "border-[#D4AF37]" },
                  { title: "Sports & Fitness", desc: "World-class sports facilities to keep you active, healthy and motivated.", icon: "Trophy", border: "border-green-500" },
                  { title: "Arts & Culture", desc: "Celebrate creativity with events, fests, and cultural extravaganzas.", icon: "Sparkles", border: "border-pink-500" },
                  { title: "Smart Learning Spaces", desc: "Modern classrooms, advanced labs, and digital resources for future-ready learning.", icon: "Building2", border: "border-purple-500" },
                  { title: "Hostel Life", desc: "Safe, comfortable and modern hostels that feel like a second home.", icon: "Landmark", border: "border-orange-500" },
                  { title: "Food & Cafeteria", desc: "Hygienic, affordable and variety-rich meals for every taste.", icon: "Coffee", border: "border-teal-500" },
                  { title: "Transport Facility", desc: "Convenient and reliable transportation across city routes.", icon: "Bus", border: "border-indigo-500" }
                ];
              })().map((card, idx) => {
                const getIcon = (iconName: string) => {
                  switch (iconName) {
                    case "Users": return <Users size={18} className="text-[#072A6C]" />;
                    case "GraduationCap": return <GraduationCap size={18} className="text-[#072A6C]" />;
                    case "Trophy": return <Trophy size={18} className="text-[#072A6C]" />;
                    case "Sparkles": return <Sparkles size={18} className="text-[#072A6C]" />;
                    case "Building2": return <Building2 size={18} className="text-[#072A6C]" />;
                    case "Landmark": return <Landmark size={18} className="text-[#072A6C]" />;
                    case "Coffee": return <Coffee size={18} className="text-[#072A6C]" />;
                    case "Bus": return <Bus size={18} className="text-[#072A6C]" />;
                    default: return <Sparkles size={18} className="text-[#072A6C]" />;
                  }
                };
                const getCardPath = (titleStr: string) => {
                    switch (titleStr) {
                      case "Clubs & Activities": return "/campus-life/clubs";
                      case "Sports & Fitness": return "/campus-life/sports";
                      case "Hostel Life": return "/campus-life/hostels";
                      case "Smart Learning Spaces": return "/campus-life/library";
                      default: return "/campus-life";
                    }
                  };
                return (
                  <div 
                    key={idx}
                    onClick={() => navigate(getCardPath(card.title))}
                    className="bg-white border border-gray-150 rounded-[20px] p-5 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-left flex flex-col justify-between group relative overflow-hidden cursor-pointer"
                  >
                    <div>
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                        {getIcon(card.icon)}
                      </div>
                      {/* Title */}
                      <h4 className="text-xs font-black text-gray-800 mb-1.5 uppercase tracking-wide group-hover:text-[#072A6C] transition-colors">
                        {card.title}
                      </h4>
                      {/* Description */}
                      <p className="text-[10px] text-gray-400 font-light leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                    {/* Color accent line at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#072A6C] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                );
              })}
            </div>

            {/* RIGHT SIDE: Campus Tour Video Card (45% / lg:col-span-5) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#072A6C] text-white rounded-[32px] overflow-hidden shadow-2xl relative min-h-[480px]">
              
              {/* HTML5 Video Player */}
              <div 
                className="relative w-full h-[300px] bg-[#072A6C] cursor-pointer group"
                onClick={() => {
                  if (campusVideoRef.current) {
                    if (campusVideoRef.current.paused) {
                      campusVideoRef.current.play().catch((e) => console.log("Video play error:", e));
                    } else {
                      campusVideoRef.current.pause();
                    }
                  }
                }}
              >
                <video
                  ref={campusVideoRef}
                  src={campusVideos[activeCampusVideoIdx]?.url}
                  poster={campusTour?.poster || "/Chalapathimain.png"}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted={isCampusTourMuted}
                  loop
                  playsInline
                  key={activeCampusVideoIdx}
                  onCanPlay={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                  onLoadedData={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                />
                
                {/* Watch Campus Tour top-left badge */}
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 z-10">
                  <Play size={10} fill="currentColor" className="text-[#D4AF37]" />
                  <span className="text-[9px] font-black uppercase tracking-wider">{campusTour?.badge || "Watch Campus Tour"}</span>
                </div>

                {/* Mute/Unmute top-right control */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCampusTourMuted(!isCampusTourMuted);
                  }}
                  className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 cursor-pointer outline-none z-10"
                >
                  <span className="text-[10px] font-bold">
                    {isCampusTourMuted ? "🔇" : "🔊"}
                  </span>
                </button>

                {/* Center overlay play button */}
                <div className="absolute inset-0 flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                  <div className="w-14 h-14 rounded-full bg-[#072A6C]/90 backdrop-blur-md flex items-center justify-center text-white border border-[#D4AF37]/50 shadow-xl">
                    <Play size={20} fill="currentColor" className="ml-0.5 text-[#D4AF37]" />
                  </div>
                </div>
              </div>

              {/* Quote details block at bottom */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between text-left relative z-10">
                <span className="text-4xl font-serif text-white/10 absolute top-4 left-4 select-none pointer-events-none">“</span>
                <p className="text-xs md:text-sm font-light leading-relaxed max-w-md relative pl-2">
                  "{campusTour?.quote || "Life at Chalapathi is about learning, growing and celebrating every moment together."}"
                </p>

                {/* Slider controls & slide counter */}
                <div className="flex items-center justify-between border-t border-white/10 pt-5 mt-6">
                  {/* Slider counter label */}
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                    {String(activeCampusVideoIdx + 1).padStart(2, "0")} / {String(campusVideos.length).padStart(2, "0")}
                  </span>
                  
                  {/* Previous / Next buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveCampusVideoIdx((prev) => (prev - 1 + campusVideos.length) % campusVideos.length)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border-none text-white flex items-center justify-center cursor-pointer transition-colors"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCampusVideoIdx((prev) => (prev + 1) % campusVideos.length)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border-none text-white flex items-center justify-center cursor-pointer transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ════ PHOTO MEMORIES GALLERY ROW ════ */}
          <div className="space-y-4 mb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block">
                  Campus Life Gallery
                </span>
                <h3 className="text-xl font-black text-[#072A6C] tracking-tight">
                  Moments that make <span className="text-[#D4AF37]">Memories</span>
                </h3>
              </div>
            </div>

            {/* Horizontal infinite gallery grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 select-none">
              {(campusGallery && campusGallery.length > 0 ? campusGallery : [
                { title: "Annual Fest", image: "/gallery_annual_fest.png" },
                { title: "Sports Meet", image: "/gallery_sports_meet.png" },
                { title: "Tech Events", image: "/gallery_tech_events.png" },
                { title: "NSS Activities", image: "/gallery_nss_activities.png" },
                { title: "Cultural Events", image: "/gallery_cultural_events.png" },
                { title: "Workshops", image: "/gallery_workshops.png" },
                { title: "Student Clubs", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop" },
                { title: "Innovation Expo", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop" }
              ]).map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-gray-150 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=300&auto=format&fit=crop";
                      }}
                    />
                    {/* Shine gradient reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  </div>
                  <div className="p-2.5 text-center">
                    <span className="text-[9.5px] font-black text-gray-700 block truncate tracking-wide uppercase">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM CTA: Two Equal Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
            
            {/* LEFT CARD: Blue Gradient */}
            <div 
              onClick={() => navigate(campusBanners?.community?.url || "/campus-life")}
              className="bg-gradient-to-br from-[#072A6C] to-indigo-950 text-white rounded-[24px] p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-left relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-2.5 max-w-[340px]">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Users size={16} className="text-[#D4AF37]" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-wider">{campusBanners?.community?.title || "Be a Part of Our Community"}</h4>
                <p className="text-[10px] text-white/80 font-light leading-relaxed">
                  {campusBanners?.community?.desc || "Experience life beyond academics and build a brighter future."}
                </p>
              </div>
              <button
                type="button"
                className="h-10 px-5 bg-white hover:bg-[#D4AF37] text-[#072A6C] hover:text-white text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer outline-none border-none shrink-0"
              >
                {campusBanners?.community?.buttonText || "Explore Campus Life →"}
              </button>
            </div>

            {/* RIGHT CARD: Red Gradient */}
            <div 
              onClick={() => {
                const link = campusBanners?.events?.url;
                if (link && link !== "#events-drawer") {
                  navigate(link);
                } else {
                  setIsEventsDrawerOpen(true);
                }
              }}
              className="bg-gradient-to-br from-[#D71920] to-red-950 text-white rounded-[24px] p-8 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-left relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div className="space-y-2.5 max-w-[340px]">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Calendar size={16} className="text-[#D4AF37]" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-wider">{campusBanners?.events?.title || "Upcoming Campus Events"}</h4>
                <p className="text-[10px] text-white/80 font-light leading-relaxed">
                  {campusBanners?.events?.desc || "There's always something exciting happening."}
                </p>
              </div>
              <button
                type="button"
                className="h-10 px-5 bg-white hover:bg-[#072A6C] text-[#D4AF37] hover:text-white text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer outline-none border-none shrink-0"
              >
                {campusBanners?.events?.buttonText || "View All Events →"}
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ FROM THE CHAIRMAN SECTION ═══ */}
      <section className="bg-gray-50/50 py-20 relative overflow-hidden font-[var(--font-poppins)] border-t border-gray-100">
        {/* Soft Background Blobs */}
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-blue-50/30 blur-3xl -z-10" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-yellow-50/20 blur-3xl -z-10" />

        <div className="max-w-[1440px] mx-auto px-5">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[11px] font-[800] uppercase tracking-widest text-[#D4AF37] bg-amber-50 py-1.5 px-4 rounded-full inline-block mb-3">
              {localStorage.getItem("chalapathi_chairman_label") || "FROM THE CHAIRMAN"}
            </span>
            <h2 className="text-2xl md:text-4xl font-[900] text-[#072A6C] mb-3">
              A Vision. A Commitment. A Legacy.
            </h2>
            <p className="text-xs text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
              {localStorage.getItem("chalapathi_chairman_subtitle") || "Guiding generations through excellence, innovation, integrity, and student success."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT COLUMN (45% / lg:col-span-5) */}
            <div className="lg:col-span-5 flex justify-center relative select-none">
              {/* Background abstract decorations */}
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-blue-500/10 rounded-full blur-lg animate-pulse" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-500/10 rounded-full blur-xl" />
              
              <div className="relative w-full max-w-[380px] rounded-[32px] overflow-hidden shadow-2xl group border-4 border-white bg-white transition-all duration-500 hover:shadow-3xl">
                {/* Chairman Portrait */}
                <img 
                  src="/chairman_portrait.png" 
                  alt="Chairman Dr. Y. V Anjaneyulu" 
                  className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-700 group-hover:scale-103"
                  style={{ objectPosition: "50% 0%" }}
                />
                
                {/* Light reflection animation overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                {/* Image tint overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                {/* Floating Glass Information Card */}
                <div className="absolute bottom-5 left-5 right-5 bg-[#072A6C]/75 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-white text-left transition-transform duration-300 group-hover:scale-102">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-0.5">Chairman</span>
                  <h4 className="text-base font-extrabold mb-0.5">{localStorage.getItem("chalapathi_chairman_name") || "Dr. Y. V Anjaneyulu"}</h4>
                  <p className="text-[10px] text-gray-200 font-light leading-snug">
                    {localStorage.getItem("chalapathi_chairman_group") || "Chalapathi Educational Society"}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (55% / lg:col-span-7) */}
            <div className="lg:col-span-7">
              <div className="bg-white/90 border border-gray-150 rounded-[32px] p-8 md:p-10 shadow-sm relative overflow-hidden text-left flex flex-col justify-between min-h-[420px] transition-all duration-300 hover:shadow-md">
                
                {/* Campus Building outline in background */}
                <div className="absolute right-0 bottom-0 w-80 h-80 opacity-[0.03] pointer-events-none select-none">
                  <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#072A6C] w-full h-full">
                    {/* Clock tower sketch */}
                    <path d="M70 180 V100 H130 V180 M90 100 V60 H110 V100 M95 60 L100 40 L105 60 M85 180 h30 M60 180 h80 M95 80 h10 M100 70 A 5 5 0 1 0 100 80 A 5 5 0 1 0 100 70" />
                    <rect x="75" y="110" width="12" height="20" rx="2" />
                    <rect x="113" y="110" width="12" height="20" rx="2" />
                    <rect x="75" y="140" width="12" height="25" rx="2" />
                    <rect x="113" y="140" width="12" height="25" rx="2" />
                  </svg>
                </div>

                {/* Quotation Mark */}
                <span className="text-7xl font-serif text-[#072A6C]/10 absolute top-4 left-4 select-none pointer-events-none">“</span>

                {/* Message Content */}
                <div className="space-y-5 z-10 relative">
                  <p className="text-xs md:text-sm text-gray-700 font-light leading-relaxed whitespace-pre-line">
                    {localStorage.getItem("chalapathi_chairman_message") || `At Chalapathi University, we believe education is the most powerful transformer of lives and the key to building a better society. Our mission is to empower young minds with knowledge, values, and innovation to help them lead with purpose and create a lasting impact on the world.\n\nWe are committed to providing a nurturing environment, world-class infrastructure, and industry-oriented education to shape future leaders and responsible citizens.`}
                  </p>
                </div>

                {/* Signature, Name, Designation & Action Button */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 z-10">
                  <div className="space-y-2">
                    {/* Cursive Signature */}
                    <div className="h-12 flex items-center select-none">
                      <svg className="h-9 text-[#072A6C]" viewBox="0 0 160 50" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M15 28c12-6 22-14 26-1s-8 12-4 4 12-16 16-4-4 12 0 4 10-14 12-2-4 10 4 2 10-12 12 0-4 10 4 2 10-12 12 4-4 8 4 2c10 2 15-4 18-9" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-[#072A6C]">{localStorage.getItem("chalapathi_chairman_name") || "Dr. Y. V Anjaneyulu"}</h5>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{localStorage.getItem("chalapathi_chairman_designation") || "Chairman"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Chairman Video Player Fullscreen Modal */}
      <AnimatePresence>
        {showChairmanVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center font-[var(--font-poppins)]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChairmanVideo(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-[800px] aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10 m-5"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowChairmanVideo(false)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white border-none cursor-pointer outline-none transition-colors"
              >
                <X size={18} />
              </button>

              <video
                src={localStorage.getItem("chalapathi_chairman_video") || "/chalapathi_logo_intro.mp4"}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ CHALAPATHI JOURNEY & CAMPUS SECTION (Grouping into White Card containers) ═══ */}
      <section className="max-w-[1440px] mx-auto w-full px-5 py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Journey */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm hover:shadow transition-shadow">
          <div>
            <span className="text-[12px] font-[700] text-[#D4AF37] tracking-wider uppercase block mb-1">THE CHALAPATHI JOURNEY</span>
            <h2 className="text-[26px] font-[800] text-[#072A6C]">
              Your Path to Success
            </h2>
          </div>

          {/* Timeline steps container with absolute positioning for vertical gray line */}
          <motion.div
            className="space-y-6 mt-6 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Vertical timeline connector */}
            <div className="absolute left-[70px] top-6 bottom-6 w-0.5 bg-gray-100 z-0">
              {/* Green animated line overlay */}
              <div 
                className="absolute top-0 left-0 w-full bg-[#10B981] shadow-[0_0_8px_#10B981]" 
                style={{
                  height: '100%',
                  transformOrigin: 'top',
                  animation: 'drawTimelineLine 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                  background: 'linear-gradient(to bottom, #10B981, #10B981 80%, rgba(16, 185, 129, 0.2))'
                }} 
              />
              <style>{`
                @keyframes drawTimelineLine {
                  0% { transform: scaleY(0); opacity: 1; }
                  50% { transform: scaleY(1); opacity: 1; }
                  85% { transform: scaleY(1); opacity: 0; }
                  100% { transform: scaleY(0); opacity: 0; }
                }
              `}</style>
            </div>

            {[
              { step: "01", title: "DISCOVER", desc: "Explore programs and find your passion.", icon: Compass, to: "/academics" },
              { step: "02", title: "APPLY", desc: "Submit your application online.", icon: FileText, to: "/admissions/apply" },
              { step: "03", title: "LEARN", desc: "Gain knowledge & practical exposure.", icon: GraduationCap, to: "/academics/computer-science" },
              { step: "04", title: "GROW", desc: "Build skills & achieve milestones.", icon: Award, to: "/about" },
              { step: "05", title: "SUCCEED", desc: "Launch your dream career", icon: Trophy, to: "/placements" }
            ].map((j) => {
              const Icon = j.icon;
              return (
                <motion.div key={j.step} className="flex gap-4 items-center relative z-10" variants={fadeUp}>
                  {/* Step Flag Pointer badge */}
                  <div className="w-10 h-8 bg-[#D4AF37] text-white font-[700] text-[13px] flex items-center justify-center shrink-0 rounded-l shadow-sm relative mr-2">
                    {j.step}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-l-[#D4AF37]" />
                  </div>

                  {/* Circular Icon Container */}
                  <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-[#072A6C]" />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={j.to} className="block">
                      <h4 className="text-[13px] font-[800] text-[#072A6C] tracking-wide hover:text-[#D4AF37] transition-colors">
                        {j.title}
                      </h4>
                    </Link>
                    <p className="text-[11px] text-[#666666] mt-0.5 leading-normal font-[400] truncate">
                      {j.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Card: Campus & Navigation */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm hover:shadow transition-shadow flex flex-col justify-between gap-6">
          <div>
            <span className="text-[12px] font-[700] text-[#F59E0B] tracking-wider uppercase block mb-1">OUR CAMPUS</span>
            <h2 className="text-[26px] font-[800] text-[#072A6C]">
              A Campus Built for Excellence
            </h2>
          </div>

          <motion.div
            className="rounded-[16px] overflow-hidden shadow-sm bg-gray-100 h-[230px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src="/campus_hero.png" alt="Campus View" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            className="bg-[#072A6C] text-white rounded-[16px] p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="text-center md:text-left min-w-[200px]">
              <h3 className="text-[15px] font-[700]">Find Your Way</h3>
              <p className="text-[11px] text-white font-[300] mt-0.5">Get directions to Chalapathi University</p>
            </div>

            {/* Combined Input Bar */}
            <form onSubmit={handleDirections} className="w-full md:w-auto flex-1 flex max-w-xl bg-white rounded-full p-1 overflow-hidden shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 pl-3 flex-1">
                <Search size={15} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={directionsFrom}
                  onChange={(e) => setDirectionsFrom(e.target.value)}
                  placeholder="Enter your location"
                  className="w-full text-black text-[12px] outline-none bg-transparent"
                />
              </div>
              <button type="submit" className="bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-[700] px-5 py-2 rounded-full text-[12px] flex items-center gap-1 shrink-0 whitespace-nowrap active:scale-95 transition-transform">
                Get Directions <MapPin size={12} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ═══ DYNAMIC PLACEMENT SUCCESS STORIES SHOWCASE ═══ */}
      <section className="bg-white py-10 relative overflow-hidden font-[var(--font-poppins)]">
        {/* Soft Background Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-50/40 blur-3xl -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-yellow-50/30 blur-3xl -z-10" />

        <div className="max-w-[1440px] mx-auto px-5">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[11px] font-[800] uppercase tracking-widest text-[#D4AF37] bg-amber-50 py-1.5 px-4 rounded-full inline-block mb-3">
              PLACEMENT SUCCESS STORIES
            </span>
            <h2 className="text-2xl md:text-3.5xl font-[900] text-[#072A6C] mb-2">
              Our Students. Top Careers. <span className="text-[#D4AF37]">Bright Futures.</span>
            </h2>
            <p className="text-xs text-gray-500 max-w-xl mx-auto font-light leading-relaxed">
              Real stories from Chalapathi students who achieved successful careers through campus placements.
            </p>
          </div>

          {successStories && successStories.length > 0 && (() => {
            const activeStudent = successStories[activeFeaturedStudent % successStories.length];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* LEFT COLUMN: Student Image + Floating Badges (38-40% Width) */}
                <div className="lg:col-span-5 flex justify-center relative">
                  <div className="relative w-full max-w-[340px] h-[370px] rounded-[24px] overflow-hidden shadow-2xl group border border-gray-100 bg-gray-50">
                    <img 
                      src={activeStudent.studentImage} 
                      alt={activeStudent.studentName} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    {/* Image Tint Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                  </div>

                  {/* Floating Placed At badge */}
                  <div className="absolute left-6 top-6 bg-white/85 backdrop-blur-md border border-white/40 rounded-xl p-2.5 flex items-center gap-2.5 shadow-md max-w-[160px] transition-transform duration-300 hover:scale-105">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1 shadow-sm shrink-0">
                      <img 
                        src={activeStudent.companyLogo} 
                        alt={activeStudent.companyName} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-left min-w-0">
                      <span className="text-[8px] text-gray-400 font-bold block uppercase tracking-wider">Placed at</span>
                      <span className="text-[10.5px] font-black text-[#072A6C] block truncate">{activeStudent.companyName}</span>
                    </div>
                  </div>

                  {/* Floating Package Offered badge */}
                  <div className="absolute right-6 bottom-6 bg-white/85 backdrop-blur-md border border-white/40 rounded-xl p-2.5 shadow-md min-w-[120px] text-left transition-transform duration-300 hover:scale-105">
                    <span className="text-[8px] text-gray-400 font-bold block uppercase tracking-wider">Package Offered</span>
                    <span className="text-lg font-black text-[#D4AF37] block leading-none mt-0.5">{activeStudent.packageOffered}</span>
                    <span className="text-[8px] text-gray-400 font-medium tracking-wide">PER ANNUM</span>
                  </div>
                </div>

                {/* RIGHT COLUMN: Testimonial, Timeline, Skills & Achievements (60% Width) */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  {/* Details Meta */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#D4AF37]">Success Story</span>
                    <h3 className="text-2xl font-[900] text-[#072A6C]">{activeStudent.studentName}</h3>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {activeStudent.department} <span className="mx-1.5 text-gray-300">•</span> {activeStudent.batch}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Sub-Column (md:col-span-7): Testimonial Quote & Timeline */}
                    <div className="md:col-span-7 space-y-4">
                      {/* Testimonial Quote */}
                      <div className="relative pl-4 border-l-4 border-[#D4AF37]">
                        <p className="text-[11px] text-gray-600 font-light italic leading-relaxed">
                          "{activeStudent.description}"
                        </p>
                      </div>

                      {/* SUCCESS TIMELINE */}
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Journey Timeline</span>
                        
                        <div className="space-y-2">
                          {/* Milestone 1 */}
                          <div className="flex gap-2.5 bg-gray-50/40 p-2 rounded-xl border border-gray-100 hover:border-[#072A6C]/20 hover:shadow-sm transition-all duration-300">
                            <div className="w-[18px] h-[18px] rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center text-[8.5px] font-bold shrink-0">1</div>
                            <div>
                              <span className="text-[10.5px] font-bold text-[#072A6C] block leading-tight">{activeStudent.milestones.learningTitle}</span>
                              <span className="text-[9px] text-gray-500 font-light leading-normal block">{activeStudent.milestones.learningDesc}</span>
                            </div>
                          </div>

                          {/* Milestone 2 */}
                          <div className="flex gap-2.5 bg-gray-50/40 p-2 rounded-xl border border-gray-100 hover:border-[#072A6C]/20 hover:shadow-sm transition-all duration-300">
                            <div className="w-[18px] h-[18px] rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center text-[8.5px] font-bold shrink-0">2</div>
                            <div>
                              <span className="text-[10.5px] font-bold text-[#072A6C] block leading-tight">{activeStudent.milestones.internshipTitle}</span>
                              <span className="text-[9px] text-gray-500 font-light leading-normal block">{activeStudent.milestones.internshipDesc}</span>
                            </div>
                          </div>

                          {/* Milestone 3 */}
                          <div className="flex gap-2.5 bg-gray-50/40 p-2 rounded-xl border border-gray-100 hover:border-[#072A6C]/20 hover:shadow-sm transition-all duration-300">
                            <div className="w-[18px] h-[18px] rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center text-[8.5px] font-bold shrink-0">3</div>
                            <div>
                              <span className="text-[10.5px] font-bold text-[#072A6C] block leading-tight">{activeStudent.milestones.placementTitle}</span>
                              <span className="text-[9px] text-gray-500 font-light leading-normal block">{activeStudent.milestones.placementDesc}</span>
                            </div>
                          </div>

                          {/* Milestone 4 */}
                          <div className="flex gap-2.5 bg-gray-50/40 p-2 rounded-xl border border-gray-100 hover:border-[#072A6C]/20 hover:shadow-sm transition-all duration-300">
                            <div className="w-[18px] h-[18px] rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center text-[8.5px] font-bold shrink-0">4</div>
                            <div>
                              <span className="text-[10.5px] font-bold text-[#072A6C] block leading-tight">{activeStudent.milestones.careerTitle}</span>
                              <span className="text-[9px] text-gray-500 font-light leading-normal block">{activeStudent.milestones.careerDesc}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Sub-Column (md:col-span-5): Skills, Internship & Achievements */}
                    <div className="md:col-span-5 space-y-4 bg-gray-50/50 border border-gray-100/85 rounded-[20px] p-4 shadow-sm h-fit">
                      {/* Skills Learned */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-sans">Skills Acquired</span>
                        <div className="flex flex-wrap gap-1">
                          {activeStudent.skills?.map((skill, sIdx) => (
                            <span key={sIdx} className="text-[8.5px] font-semibold bg-white text-[#072A6C] px-2 py-0.5 border border-gray-150 rounded-md shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Internship Experience */}
                      <div className="space-y-0.5 pt-2 border-t border-gray-200/60">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-sans">Internship Term</span>
                        <span className="text-[11px] font-bold text-[#072A6C] block leading-tight">{activeStudent.internshipExp}</span>
                      </div>

                      {/* Career Achievement */}
                      <div className="space-y-0.5 pt-2 border-t border-gray-200/60">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block font-sans">Top Achievement</span>
                        <span className="text-[11px] font-bold text-emerald-600 block leading-tight">{activeStudent.achievement}</span>
                      </div>
                    </div>
                  </div>

                  {/* Slider Controls */}
                  <div className="flex items-center justify-between pt-2">
                    {/* Dots */}
                    <div className="flex gap-1">
                      {successStories.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveFeaturedStudent(i)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 border-none outline-none cursor-pointer ${
                            i === (activeFeaturedStudent % successStories.length) ? "bg-[#D4AF37] w-5" : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveFeaturedStudent((prev) => (prev - 1 + successStories.length) % successStories.length)}
                        className="w-7 h-7 rounded-full border border-gray-200 hover:border-[#072A6C] flex items-center justify-center text-gray-400 hover:text-[#072A6C] transition-all bg-white cursor-pointer outline-none"
                        aria-label="Previous story"
                      >
                        <ArrowRight size={12} className="rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveFeaturedStudent((prev) => (prev + 1) % successStories.length)}
                        className="w-7 h-7 rounded-full border border-gray-200 hover:border-[#072A6C] flex items-center justify-center text-gray-400 hover:text-[#072A6C] transition-all bg-white cursor-pointer outline-none"
                        aria-label="Next story"
                      >
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* INFINITE LOGO MARQUEE */}
          {placementsContent.recruiters && placementsContent.recruiters.length > 0 && (
            <div className="mt-20 pt-10 border-t border-gray-100/60 relative">
              <span className="text-[10px] font-bold text-[#072A6C] uppercase tracking-widest text-center block mb-6">
                Our Top Corporate Partners
              </span>
              
              {/* Marquee Wrapper */}
              <div className="relative overflow-hidden w-full select-none py-1 group/marquee">
                <div className="flex gap-8 w-max animate-marquee group-hover/marquee:[animation-play-state:paused]">
                  {/* First iteration */}
                  {placementsContent.recruiters.map((r, i) => (
                    <div 
                      key={i} 
                      onClick={() => navigate("/placements")}
                      className="h-10 px-6 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md hover:border-[#072A6C]/20 transition-all duration-300"
                    >
                      <img src={r.logo} alt={r.name} className="h-6 w-auto object-contain max-w-[85px]" />
                    </div>
                  ))}
                  {/* Duplicate iteration for seamless loop */}
                  {placementsContent.recruiters.map((r, i) => (
                    <div 
                      key={`dup-${i}`} 
                      onClick={() => navigate("/placements")}
                      className="h-10 px-6 bg-white border border-gray-100 rounded-xl flex items-center justify-center shadow-sm cursor-pointer hover:shadow-md hover:border-[#072A6C]/20 transition-all duration-300"
                    >
                      <img src={r.logo} alt={r.name} className="h-6 w-auto object-contain max-w-[85px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM STATISTICS (Dynamic from CMS) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-10 border-t border-gray-100/60">
            {/* Stat Card 1 */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md group">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users size={18} />
              </div>
              <AnimatedCounter value={placementsContent.stats?.[0]?.value || placementsContent.placementPercent || "92%"} />
              <span className="text-[10.5px] text-gray-500 font-medium block mt-1.5">{placementsContent.stats?.[0]?.label || "Students Placed"}</span>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md group">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-[#D4AF37] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Trophy size={18} />
              </div>
              <AnimatedCounter value={placementsContent.stats?.[1]?.value || placementsContent.highestPackage || "30 LPA"} />
              <span className="text-[10.5px] text-gray-500 font-medium block mt-1.5">{placementsContent.stats?.[1]?.label || "Highest Package"}</span>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md group">
              <div className="w-10 h-10 rounded-full bg-yellow-50 text-[#EAB308] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Handshake size={18} />
              </div>
              <AnimatedCounter value={placementsContent.stats?.[2]?.value || placementsContent.corporatePartnersCount || "116+"} />
              <span className="text-[10.5px] text-gray-500 font-medium block mt-1.5">{placementsContent.stats?.[2]?.label || "Corporate Partners"}</span>
            </div>

            {/* Stat Card 4 */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md group">
              <div className="w-10 h-10 rounded-full bg-green-50 text-[#10B981] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap size={18} />
              </div>
              <AnimatedCounter value={placementsContent.stats?.[3]?.value || placementsContent.placementAssistance || "100%"} />
              <span className="text-[10.5px] text-gray-500 font-medium block mt-1.5">{placementsContent.stats?.[3]?.label || "Placement Assistance"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ADMISSIONS OPEN 2026 STRIP ═══ */}
      {(() => {
        const admissionsSection = (homepageSections || []).find((s) => s.id === "virtualTour" || s.id === "admissionsStrip");
        if (admissionsSection && admissionsSection.enabled === false) return null;
        const admissionsData = admissionsSection?.extraData || {};
        const bannerTitle = admissionsData.bannerTitle || admissionsSection?.title || "ADMISSIONS OPEN 2026";
        const bannerSubtitle = admissionsData.bannerSubtitle || admissionsSection?.subtitle || "Join a community of innovators and leaders. Shape your future with Chalapathi University.";
        const bannerImage = admissionsData.bannerImage || "/students_admission.png";
        const btn1Text = admissionsData.btn1Text || "Apply Now";
        const btn1Url = admissionsData.btn1Url || "/admissions/apply";
        const btn2Text = admissionsData.btn2Text || "Download Brochure";
        const btn2Url = admissionsData.btn2Url || "/admissions";
        const btn3Text = admissionsData.btn3Text || "Talk to Counselor";
        const btn3Url = admissionsData.btn3Url || "/contact";
        const visitHeading = admissionsData.visitHeading || "VISIT US";
        const visitAddress = admissionsData.address || "A.R. Nagar, Mothadaka, Guntur, Andhra Pradesh - 522034";
        const visitPhone = admissionsData.phone || "8886630355 | 8886630356 9905505566";
        const visitEmail = admissionsData.email || "admissions@city.ac.in";
        const visitWebsite = admissionsData.website || "www.city.ac.in";
        const mapEmbedUrl = admissionsData.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.974950454796!2d80.28581691486445!3d16.375218788685984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a79679802cfad%3A0xe67e2a901bbd33fe!2sChalapathi%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!5m2!1sen!2sin";
        const mapLinkUrl = admissionsData.mapLinkUrl || "https://www.google.com/maps/place/Chalapathi+Institute+of+Technology/@16.3752188,80.2858169,17z/data=!3m1!4b1!4m6!3m5!1s0x3a4a79679802cfad:0xe67e2a901bbd33fe!8m2!3d16.3752188!4d80.2858169!16s%2Fg%2F122r446z";

        return (
          <section className="bg-gray-50 py-12 border-t border-gray-100">
            <div className="max-w-[1440px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Blue Card */}
              <div className="lg:col-span-8 bg-[#072A6C] text-white rounded-[16px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="space-y-4 relative z-10 w-full md:max-w-[55%]">
                  <h2 className="text-[26px] font-[800] tracking-wide font-[var(--font-poppins)] text-[#D4AF37]">
                    {bannerTitle}
                  </h2>
                  <p className="text-[12px] text-blue-100 leading-relaxed font-[300] font-[var(--font-poppins)]">
                    {bannerSubtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2 font-[var(--font-poppins)]">
                    {btn1Text && (
                      <Link
                        to={btn1Url}
                        className="h-10 px-5 bg-white text-[#072A6C] hover:bg-blue-50 text-[11px] font-[700] rounded-[8px] inline-flex items-center gap-1.5 shadow active:scale-95 transition-transform"
                      >
                        {btn1Text} <ArrowRight size={13} />
                      </Link>
                    )}
                    {btn2Text && (
                      <Link
                        to={btn2Url}
                        className="h-10 px-5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-[11px] font-[700] rounded-[8px] inline-flex items-center gap-1.5 active:scale-95 transition-all duration-200"
                      >
                        {btn2Text}
                      </Link>
                    )}
                    {btn3Text && (
                      <Link
                        to={btn3Url}
                        className="h-10 px-5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-[11px] font-[700] rounded-[8px] inline-flex items-center gap-1.5 active:scale-95 transition-all duration-200"
                      >
                        {btn3Text}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Students Image absolute positioned on the right edge */}
                <motion.div
                  className="absolute right-0 top-0 bottom-0 h-full w-full md:w-[42%] overflow-hidden z-0"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <img src={bannerImage} alt="Students" className="w-full h-full object-cover object-left-top" onError={(e) => { (e.target as HTMLImageElement).src = "/students_admission.png"; }} />
                </motion.div>
              </div>

              {/* Right White Card */}
              <div className="lg:col-span-4 bg-white border border-gray-200/60 rounded-[16px] p-6 flex items-center justify-between gap-4 shadow-sm font-[var(--font-poppins)]">
                <div className="space-y-4 flex-1">
                  <h3 className="text-[13px] font-[800] uppercase tracking-wider text-[#072A6C]">{visitHeading}</h3>
                  <div className="space-y-2.5 text-[11px] text-gray-600 font-[400]">
                    {visitAddress && (
                      <div className="flex items-start gap-1.5">
                        <MapPin size={12} className="shrink-0 mt-0.5 text-gray-400" />
                        <span>{visitAddress}</span>
                      </div>
                    )}
                    {visitPhone && (
                      <div className="flex items-start gap-1.5">
                        <Phone size={12} className="shrink-0 mt-0.5 text-gray-400" />
                        <span>{visitPhone}</span>
                      </div>
                    )}
                    {visitEmail && (
                      <div className="flex items-start gap-1.5">
                        <Mail size={12} className="shrink-0 mt-0.5 text-gray-400" />
                        <span>{visitEmail}</span>
                      </div>
                    )}
                    {visitWebsite && (
                      <div className="flex items-start gap-1.5">
                        <Globe size={12} className="shrink-0 mt-0.5 text-gray-400" />
                        <span>{visitWebsite}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map Frame */}
                {mapLinkUrl && (
                  <a 
                    href={mapLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[130px] h-[130px] rounded-[12px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative block group"
                    title="Open Chalapathi University in Google Maps"
                  >
                    <div className="absolute inset-0 bg-transparent z-10 cursor-pointer" />
                    {mapEmbedUrl && (
                      <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        className="pointer-events-none"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all flex items-center justify-center">
                      <span className="bg-white/90 group-hover:bg-white text-[10px] font-bold px-2 py-1 rounded shadow text-[#072A6C] flex items-center gap-1">
                        Maps <ExternalLink size={10} />
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </section>
        );
      })()}

      {/* ═══ Glassmorphism Modal ═══ */}
      <AnimatePresence>
        {/* Upcoming Events Drawer Overlay */}
        {isEventsDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end font-[var(--font-poppins)]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEventsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            {/* Drawer Sheet */}
            <motion.div
              initial={{ translateX: "100%" }}
              animate={{ translateX: 0 }}
              exit={{ translateX: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[480px] bg-gray-50/95 backdrop-blur-md h-full shadow-2xl flex flex-col z-10 text-left"
            >
              {/* Header */}
              <div className="bg-[#072A6C] text-white px-6 py-5 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-2.5">
                  <Calendar size={20} className="text-[#D4AF37]" />
                  <h2 className="text-base font-extrabold uppercase tracking-wider">Upcoming Events</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEventsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white border-none cursor-pointer outline-none transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Events List */}
              <div ref={drawerScrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
                {events && events.length > 0 ? (
                  [...events].reverse().map((item, idx) => (
                    <div
                      key={item.id || idx}
                      onClick={() => {
                        navigate(`/news/events/${item.slug}`);
                        setIsEventsDrawerOpen(false);
                      }}
                      className="bg-white border border-gray-150 rounded-[20px] p-5 shadow-sm hover:shadow-md hover:border-[#072A6C]/20 transition-all duration-300 relative flex justify-between items-start gap-4 cursor-pointer text-left group"
                    >
                      <div className="flex-1 space-y-3">
                        {/* Category Tag */}
                        {item.category && (
                          <span className="inline-block text-[9px] font-black uppercase tracking-widest text-[#EAB308] bg-yellow-50 px-2.5 py-1 rounded-md border border-yellow-100">
                            {item.category}
                          </span>
                        )}
                        
                        {/* Title */}
                        <h3 className="text-[13.5px] font-black text-[#D4AF37] leading-snug group-hover:underline">
                          {item.title}
                        </h3>

                        {/* Date, Time, Venue Info Rows */}
                        <div className="space-y-1.5 text-[10px] text-gray-500 font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar size={11} className="text-gray-400" />
                            <span>{item.date}</span>
                          </div>
                          {item.time && (
                            <div className="flex items-center gap-2">
                              <Clock size={11} className="text-gray-400" />
                              <span>{item.time}</span>
                            </div>
                          )}
                          {item.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={11} className="text-gray-400" />
                              <span className="line-clamp-1">{item.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Snippet Description */}
                        {item.bodyText && (
                          <p className="text-[10px] text-gray-400 font-light leading-relaxed line-clamp-3">
                            {item.bodyText}
                          </p>
                        )}
                      </div>

                      {/* Thumbnail Image (Right aligned) */}
                      {item.image && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400 text-xs">
                    No upcoming events found.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
