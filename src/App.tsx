import { resolveEnquiryConfig, INDIAN_STATES, QUALIFICATIONS, YEARS_OF_PASSING, ALL_PROGRAMS, ENQUIRY_SCHOOLS_DATA } from "./data/enquiryPopup";
import { usePublishedPopupConfig, selectActivePopup } from "./services/popupPublishing";
import React, { useEffect, useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link, useNavigate } from "react-router-dom";
import { X, RefreshCw, CheckCircle2, Megaphone, Bell, Calendar, GraduationCap, FileText, Award, BookOpen, User, Phone, Mail, MapPin, Landmark, MessageSquare, ArrowRight, Send, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import DraftPreview from "./pageBuilder/DraftPreview";
import { PublicBuilderPage } from "./pageBuilder/Renderer";
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
import { DataProvider, useData, DEFAULT_ADMISSIONS_CONTENT } from "./context/DataContext";
import { DEFAULT_POPUP_DATA, PopupCMSData, PopupItem } from "./components/admin/PopupCMS";

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


function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isApplyPage = location.pathname.includes("apply");
  const { 
    announcements, 
    showAnnouncementsDrawer, 
    setShowAnnouncementsDrawer, 
    siteSettings, 
    addEnquiry,
    admissionsContent
  } = useData();



  const popupCmsData = usePublishedPopupConfig();
  const activePopup = useMemo(() => selectActivePopup(popupCmsData), [popupCmsData]);
  const enquiryPopupConfig = resolveEnquiryConfig(admissionsContent?.enquiryPopup || DEFAULT_ADMISSIONS_CONTENT.enquiryPopup, activePopup?.enquiryConfig);

  const [showSplash, setShowSplash] = useState(siteSettings?.enableSplash === true);

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
  const [mobilePopupTab, setMobilePopupTab] = useState<"form" | "schools">("form");

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Automatic popup trigger on page load (Public Pages Only, respects Admin popup settings)
  useEffect(() => {
    if (!isAdminPage && !showSplash && activePopup && activePopup.autoOpen !== false) {
      const delayMs = (activePopup.autoOpenDelay ?? 1) * 1000;
      const timer = setTimeout(() => {
        setShowEnquiryModal(true);
      }, delayMs);
      return () => clearTimeout(timer);
    } else if (isAdminPage || !activePopup) {
      setShowEnquiryModal(false);
    }
  }, [showSplash, isAdminPage, activePopup]);

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
              preload="metadata"
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
            <Route path="/admin/page-preview/:id" element={<DraftPreview />} />
            <Route path="/pages/*" element={<PublicBuilderPage />} />
            <Route path="/admin" element={<AdminPortal />} />

            {/* Dynamic CMS Page Wildcard Catch-All Route */}
            <Route path="/*" element={<DynamicPage />} />
          </Routes>

        </main>
        {!isAdminPage && <Footer />}
      </div>

      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* 🌟 SLIMMED NON-OVERLAPPING STACKED RIGHT-SIDE TABS       */}
      {/* ======================================================== */}
      {!isAdminPage && (
        <div className="fixed right-0 top-[90px] sm:top-[100px] md:top-[110px] min-[1280px]:top-[120px] z-40 flex flex-col gap-2 items-end font-[var(--font-poppins)] select-none">
          {/* Announcements Icon Button (Clean icon-only matching navbar symbol) */}
          <button
            onClick={() => setShowAnnouncementsDrawer(true)}
            aria-label="View Announcements"
            title="View Announcements"
            className="w-10 h-10 sm:w-11 sm:h-11 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#072A6C] hover:brightness-105 rounded-l-2xl shadow-xl transition-all duration-300 hover:-translate-x-1 flex items-center justify-center cursor-pointer border border-r-0 border-amber-300/50 outline-none relative group"
          >
            <Megaphone size={20} className="text-[#072A6C] transition-transform duration-200 group-hover:scale-110" />
            {announcements && announcements.length > 0 && (
              <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white animate-pulse" />
            )}
          </button>

          {/* Admission Enquiry Tab (Corrected Orientation, Fits Comfortably - Hidden on Apply page) */}
          {activePopup && !isApplyPage && (
            <button
              onClick={() => setShowEnquiryModal(true)}
              style={{
                backgroundColor: enquiryPopupConfig.tabBgColor,
                color: enquiryPopupConfig.tabTextColor
              }}
              className="w-[34px] sm:w-[38px] h-[175px] sm:h-[190px] py-4 hover:brightness-110 font-black text-[8.5px] sm:text-[9.5px] tracking-[0.5px] rounded-l-xl shadow-lg transition-all duration-300 hover:-translate-x-1 flex items-center justify-center [writing-mode:vertical-rl] whitespace-nowrap cursor-pointer uppercase border border-r-0 border-white/20 outline-none"
            >
              {activePopup.type === "event" ? (activePopup.badge || "Campus Event") : (enquiryPopupConfig.tabLabel)}
            </button>
          )}
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
              {announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <div className="w-12 h-12 rounded-full bg-[#072A6C]/5 flex items-center justify-center mb-3">
                    <Megaphone size={22} className="text-[#072A6C]/40" />
                  </div>
                  <h4 className="text-sm font-bold text-[#072A6C]">No Announcements</h4>
                  <p className="text-xs text-gray-500 font-light mt-1 max-w-[240px]">
                    Official circulars and notifications posted from the administration will appear here.
                  </p>
                </div>
              ) : (
                announcements.map((item, idx) => {
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
                })
              )}
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
      {/* 🌟 ADMISSION ENQUIRY / EVENT / BANNER POPUP MODAL        */}
      {/* ======================================================== */}
      {showEnquiryModal && activePopup && (
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

          {activePopup.type !== "enquiry" ? (
            /* Custom Event / Promo Banner / Announcement Modal */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`bg-white ${activePopup.image ? "w-fit max-w-[94vw]" : "w-full max-w-[880px]"} rounded-[24px] shadow-2xl relative flex flex-col overflow-hidden border border-gray-100 font-[var(--font-poppins)] text-left select-none my-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowEnquiryModal(false)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-md"
                aria-label="Close Modal"
              >
                <X size={17} />
              </button>

              {/* Poster Image */}
              {activePopup.image ? (
                <div className="flex items-center justify-center bg-white">
                  <img
                    src={activePopup.image}
                    alt={activePopup.title}
                    className="block w-auto h-auto max-w-[94vw] max-h-[76dvh] object-contain"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-[#072A6C] to-[#0D47A1] p-6 text-white relative">
                  {activePopup.badge && (
                    <span className="px-3 py-1 rounded-full bg-white/20 text-[#FAB005] text-[11px] font-black uppercase tracking-wider inline-block">
                      {activePopup.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Modal Body */}
              <div className="p-6 sm:p-7 flex flex-col">
                {activePopup.badge && (
                  <div className="mb-2">
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black uppercase tracking-wider inline-block">
                      {activePopup.badge}
                    </span>
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl font-black text-[#072A6C] tracking-tight leading-snug">
                  {activePopup.title}
                </h3>

                {activePopup.subtitle && (
                  <p className="text-xs sm:text-sm font-bold text-[#FAB005] uppercase tracking-wide mt-1">
                    {activePopup.subtitle}
                  </p>
                )}

                {activePopup.description && (
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mt-3">
                    {activePopup.description}
                  </p>
                )}

                {/* Show actions only when the administrator supplies both fields. */}
                {activePopup.redirectUrl?.trim() && activePopup.buttonText?.trim() && (
                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      setShowEnquiryModal(false);
                      if (activePopup.redirectUrl) {
                        if (activePopup.redirectUrl.startsWith("http://") || activePopup.redirectUrl.startsWith("https://")) {
                          window.open(activePopup.redirectUrl, "_blank");
                        } else {
                          navigate(activePopup.redirectUrl);
                        }
                      }
                    }}
                    className="w-full sm:flex-1 h-12 bg-gradient-to-r from-[#072A6C] to-[#0A388D] hover:from-[#062154] hover:to-[#082e75] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer uppercase tracking-wider"
                  >
                    <span>{activePopup.buttonText || ""}</span>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    onClick={() => setShowEnquiryModal(false)}
                    className="w-full sm:w-auto px-5 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="bg-white w-full max-w-[1240px] max-h-[92vh] md:max-h-[90vh] rounded-[20px] md:rounded-[24px] shadow-2xl relative flex flex-col md:flex-row overflow-hidden border border-gray-100 font-[var(--font-poppins)] text-left select-none my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Global Close Button - safely positioned at top-right corner */}
              <button 
                onClick={() => setShowEnquiryModal(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-red-600 border border-gray-200 shadow-md flex items-center justify-center transition-all hover:scale-105 duration-200 cursor-pointer outline-none"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              {/* Mobile Tab Switcher (< md screens only) */}
              <div className="md:hidden flex items-center p-2 bg-slate-100 border-b border-gray-200 shrink-0 pr-14">
                <button
                  type="button"
                  onClick={() => setMobilePopupTab("form")}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                    mobilePopupTab === "form"
                      ? "bg-[#072A6C] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {enquiryPopupConfig.mobileFormLabel}
                </button>
                <button
                  type="button"
                  onClick={() => setMobilePopupTab("schools")}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                    mobilePopupTab === "schools"
                      ? "bg-[#072A6C] text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {enquiryPopupConfig.mobileSchoolsLabel}
                </button>
              </div>

              {/* Left Panel: Schools & Programs */}
              <div className={`w-full md:w-1/2 p-4 sm:p-5 md:p-6 border-r border-gray-100 flex flex-col bg-slate-50/50 overflow-y-auto scrollbar-none ${
                mobilePopupTab === "schools" ? "flex" : "hidden md:flex"
              }`}>
                {/* Logo */}
                <div className="flex items-center justify-center mb-5 mt-1">
                  <img 
                    src={enquiryPopupConfig.logoUrl ?? siteSettings?.logoUrl ?? "/logo.png?v=3"}
                    alt={siteSettings?.universityName || "Chalapathi University"} 
                    width={800}
                    height={359}
                    loading="eager"
                    // @ts-ignore
                    fetchpriority="high"
                    className="h-14 md:h-18 w-auto object-contain" 
                  />
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[12px] font-black uppercase text-[#072A6C] tracking-wide">
                    {enquiryPopupConfig.leftPanelTitle}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMobilePopupTab("form")}
                    className="md:hidden text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    Go to Form →
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-medium mb-3">
                  {enquiryPopupConfig.leftPanelSubtitle}
                </p>

                {/* Accordions */}
                <div className="space-y-2.5">
                  {enquiryPopupConfig.schools.map((school) => {
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
                            {!["computing", "engineering", "business"].includes(school.id) && <GraduationCap size={16} />}
                            <div className="flex flex-col">
                              <span className="text-[10.5px] md:text-[11.5px] font-extrabold uppercase tracking-wider">{school.title}</span>
                              <span className={`text-[8.5px] md:text-[9.5px] ${isOpen ? "text-blue-100" : "text-gray-400"} mt-0.5`}>{school.subtitle}</span>
                            </div>
                          </div>
                          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        {/* Accordion Body */}
                        {isOpen && (
                          <div className="p-3 bg-white border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-fade-in">
                            {(school.groups || []).map((group, groupIdx) => (
                              <div key={groupIdx} className="space-y-2">
                                <h4 className="text-[10.5px] font-extrabold text-[#072A6C] border-b border-gray-100 pb-1">{group.name}</h4>
                                <div className="flex flex-col gap-1.5">
                                  {(group.courses || []).map((course, courseIdx) => {
                                    let badgeColor = "bg-blue-50 text-blue-600 border-blue-100/50";
                                    if (course.level === "PG") badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-100/50";
                                    if (course.level === "Ph.D") badgeColor = "bg-amber-50 text-amber-600 border-amber-100/50";
                                    if (course.level === "Diploma") badgeColor = "bg-purple-50 text-purple-600 border-purple-100/50";
                                    return (
                                      <button
                                        key={courseIdx}
                                        type="button"
                                        onClick={() => {
                                          setFormData({ ...formData, program: course.name });
                                          setMobilePopupTab("form");
                                        }}
                                        className={`flex items-start gap-2 py-1 px-2 rounded-md border border-transparent hover:border-blue-100 hover:bg-blue-50/30 text-left transition-all duration-200 cursor-pointer ${
                                          formData.program === course.name ? "bg-blue-50/70 border-blue-200" : ""
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
              <div className={`w-full md:w-1/2 p-4 sm:p-5 md:p-6 flex flex-col bg-white relative overflow-y-auto scrollbar-none ${
                mobilePopupTab === "form" ? "flex" : "hidden md:flex"
              }`}>
                {/* Mobile-only University Logo */}
                <div className="md:hidden flex items-center justify-center mb-3">
                  <img 
                    src={enquiryPopupConfig.logoUrl ?? siteSettings?.logoUrl ?? "/logo.png?v=3"}
                    alt={siteSettings?.universityName || "Chalapathi University"} 
                    width={800}
                    height={359}
                    className="h-12 w-auto object-contain" 
                  />
                </div>

                <div className="mb-3 pr-8">
                  <h2 className="text-[16px] sm:text-[18px] font-black text-[#072A6C] tracking-tight uppercase leading-snug">
                    {activePopup?.title ?? enquiryPopupConfig.modalTitle}
                  </h2>
                  <p className="text-[10px] sm:text-[10.5px] text-gray-500 font-medium mt-0.5">
                    {activePopup?.subtitle ?? enquiryPopupConfig.modalSubtitle}
                  </p>
                </div>

                {/* Form Title Card */}
                <div className="bg-[#072A6C]/3 border border-[#072A6C]/10 rounded-xl p-2.5 sm:p-3 flex items-center gap-3 mb-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#072A6C]/10 flex items-center justify-center text-[#072A6C] shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="text-[10.5px] font-black text-[#072A6C] uppercase tracking-wider leading-none mb-1">
                      {enquiryPopupConfig.formBadgeTitle}
                    </h4>
                    <p className="text-[9.5px] text-gray-500 font-medium leading-tight">
                      {enquiryPopupConfig.formBadgeDesc}
                    </p>
                  </div>
                  {/* Shortcut to schools tab on mobile */}
                  <button
                    type="button"
                    onClick={() => setMobilePopupTab("schools")}
                    className="md:hidden text-[10px] text-[#072A6C] bg-blue-50 hover:bg-blue-100 font-bold px-2 py-1 rounded-md shrink-0 border border-blue-100"
                  >
                    {enquiryPopupConfig.programsButtonLabel}
                  </button>
                </div>

              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 my-auto">
                  <CheckCircle2 size={56} className="text-emerald-500 animate-bounce" />
                  <h4 className="text-base font-extrabold text-[#072A6C]">
                    {enquiryPopupConfig.successTitle}
                  </h4>
                  <p className="text-xs text-gray-500 text-center max-w-[340px]">
                    {enquiryPopupConfig.successDesc}
                  </p>
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
                      {enquiryPopupConfig.fields.name.visible && (<div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{enquiryPopupConfig.fields.name.label}{enquiryPopupConfig.fields.name.required ? " *" : ""}</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            required={enquiryPopupConfig.fields.name.required}
                            placeholder={enquiryPopupConfig.fields.name.placeholder}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222]"
                          />
                        </div>
                      </div>)}
                      {enquiryPopupConfig.fields.mobile.visible && (<div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{enquiryPopupConfig.fields.mobile.label}{enquiryPopupConfig.fields.mobile.required ? " *" : ""}</label>
                        <div className="relative">
                          <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="tel" 
                            required={enquiryPopupConfig.fields.mobile.required}
                            pattern="[0-9]{10}"
                            placeholder={enquiryPopupConfig.fields.mobile.placeholder}
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222]"
                          />
                        </div>
                      </div>)}
                    </div>

                    {/* Email Address */}
                    {enquiryPopupConfig.fields.email.visible && (<div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{enquiryPopupConfig.fields.email.label}{enquiryPopupConfig.fields.email.required ? " *" : ""}</label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          type="email" 
                          required={enquiryPopupConfig.fields.email.required}
                          placeholder={enquiryPopupConfig.fields.email.placeholder}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222]"
                        />
                      </div>
                    </div>)}

                    {/* City & State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {enquiryPopupConfig.fields.city.visible && (<div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{enquiryPopupConfig.fields.city.label}{enquiryPopupConfig.fields.city.required ? " *" : ""}</label>
                        <div className="relative">
                          <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text" 
                            required={enquiryPopupConfig.fields.city.required}
                            placeholder={enquiryPopupConfig.fields.city.placeholder}
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222]"
                          />
                        </div>
                      </div>)}
                      {enquiryPopupConfig.fields.state.visible && (<div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{enquiryPopupConfig.fields.state.label}{enquiryPopupConfig.fields.state.required ? " *" : ""}</label>
                        <div className="relative">
                          <Landmark size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select 
                            required={enquiryPopupConfig.fields.state.required}
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] bg-white appearance-none cursor-pointer"
                          >
                            <option value="">{enquiryPopupConfig.fields.state.placeholder}</option>
                            {(enquiryPopupConfig.fields.state.options || []).map((state) => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>)}
                    </div>

                    {/* Qualification & Year of Passing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {enquiryPopupConfig.fields.qualification.visible && (<div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{enquiryPopupConfig.fields.qualification.label}{enquiryPopupConfig.fields.qualification.required ? " *" : ""}</label>
                        <div className="relative">
                          <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select 
                            required={enquiryPopupConfig.fields.qualification.required}
                            value={formData.qualification}
                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] bg-white appearance-none cursor-pointer"
                          >
                            <option value="">{enquiryPopupConfig.fields.qualification.placeholder}</option>
                            {(enquiryPopupConfig.fields.qualification.options || []).map((q) => (
                              <option key={q} value={q}>{q}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>)}
                      {enquiryPopupConfig.fields.yearOfPassing.visible && (<div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{enquiryPopupConfig.fields.yearOfPassing.label}{enquiryPopupConfig.fields.yearOfPassing.required ? " *" : ""}</label>
                        <div className="relative">
                          <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <select 
                            required={enquiryPopupConfig.fields.yearOfPassing.required}
                            value={formData.yearOfPassing}
                            onChange={(e) => setFormData({ ...formData, yearOfPassing: e.target.value })}
                            className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] bg-white appearance-none cursor-pointer"
                          >
                            <option value="">{enquiryPopupConfig.fields.yearOfPassing.placeholder}</option>
                            {(enquiryPopupConfig.fields.yearOfPassing.options || []).map((year) => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>)}
                    </div>

                    {/* Interested Program */}
                    {enquiryPopupConfig.fields.program.visible && (<div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{enquiryPopupConfig.fields.program.label}{enquiryPopupConfig.fields.program.required ? " *" : ""}</label>
                      <div className="relative">
                        <BookOpen size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select 
                          required={enquiryPopupConfig.fields.program.required}
                          value={formData.program}
                          onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                          className="w-full h-10 pl-10 pr-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] bg-white appearance-none cursor-pointer"
                        >
                          <option value="">{enquiryPopupConfig.fields.program.placeholder}</option>
                          {enquiryPopupConfig.allPrograms.map((prog) => (
                            <option key={prog} value={prog}>{prog}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>)}

                    {/* Any Query */}
                    {enquiryPopupConfig.fields.query.visible && (<div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{enquiryPopupConfig.fields.query.label}{enquiryPopupConfig.fields.query.required ? " *" : ""}</label>
                      <div className="relative">
                        <textarea required={enquiryPopupConfig.fields.query.required}
                          placeholder={enquiryPopupConfig.fields.query.placeholder}
                          value={formData.query}
                          onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                          rows={2}
                          className="w-full pl-4 pr-3 py-2 border border-[#E2E8F0] rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-[#222222] resize-none"
                        />
                      </div>
                    </div>)}
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Apply Enquiry Button */}
                    <button
                      type="submit"
                      className="w-full h-11 bg-[#FAB005] hover:bg-[#e09e00] text-gray-900 font-extrabold text-[12px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer outline-none"
                    >
                      <Send size={13} className="rotate-45 -translate-y-0.5" />
                      <span>{activePopup?.buttonText ?? enquiryPopupConfig.ctaButtonText}</span>
                    </button>

                    {/* Privacy */}
                    <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-semibold">
                      <ShieldCheck size={12} className="text-gray-400" />
                      <span>{enquiryPopupConfig.privacyText} <Link to={enquiryPopupConfig.privacyUrl} onClick={() => setShowEnquiryModal(false)} className="text-blue-500 hover:underline">{enquiryPopupConfig.privacyLinkLabel}</Link>.</span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
          )}
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
