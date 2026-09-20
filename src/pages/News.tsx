import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowRight, 
  Calendar, 
  X, 
  Clock, 
  MapPin, 
  Share2, 
  Flame, 
  Link2,
  Check,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useData, EventItem } from "../context/DataContext";
import EventRegistrationModal from "../components/common/EventRegistrationModal";

// Social Share Icons Helper Components (Official SVG path logos)
const WhatsAppIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M11.94 0C5.346 0 0 5.346 0 11.94s5.346 11.94 11.94 11.94 11.94-5.346 11.94-11.94S18.534 0 11.94 0zm5.562 8.161l-1.875 8.835c-.142.628-.513.784-1.037.492l-2.85-2.102-1.375 1.325c-.154.154-.282.282-.577.282l.205-2.915 5.306-4.793c.23-.205-.05-.318-.358-.112l-6.56 4.13-2.825-.885c-.615-.192-.628-.615.128-.91l11.04-4.258c.513-.192.96.115.804.838z"/>
  </svg>
);

const RedditIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.29-1.72l1.37-4.3 3.8 1.15c.08.97.87 1.73 1.84 1.73 1.02 0 1.85-.83 1.85-1.85S19.52 1 18.5 1c-.81 0-1.5.52-1.74 1.25l-4.14-1.25c-.12-.03-.25.04-.29.16l-1.53 4.8C8.36 6.04 6.13 6.69 4.49 7.7 3.93 6.94 3.03 6.46 2.07 6.46c-1.65 0-3 1.35-3 3 0 1.07.57 2.01 1.43 2.54-.03.25-.05.51-.05.77 0 3.72 4.45 6.73 9.93 6.73 5.48 0 9.93-3.01 9.93-6.73 0-.26-.02-.52-.05-.77.86-.53 1.43-1.47 1.43-2.54zm-16.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm10.74 3.9c-.83.83-2.4 1.2-4.24 1.2s-3.41-.37-4.24-1.2c-.15-.15-.15-.38 0-.53.15-.15.38-.15.53 0 .68.68 2.03 1 3.71 1 1.68 0 3.03-.32 3.71-1 .15-.15.38-.15.53 0 .15.15.15.38 0 .53zm-.74-2.4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.204 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.164 0 7.397 2.967 7.397 6.93 0 4.136-2.607 7.464-6.22 7.464-1.215 0-2.358-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.36 11.985-11.987C23.97 5.39 18.592 0 12.017 0z"/>
  </svg>
);

const ThreadsIcon = () => (
  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.87 14.883c-.452.483-1.077.724-1.874.724-.627 0-1.182-.162-1.666-.486-.484-.324-.805-.765-.964-1.325a4.774 4.774 0 0 1-.161-1.282v-.942c.075-.417.202-.79.382-1.119.18-.33.435-.583.766-.757.33-.174.733-.261 1.208-.261.597 0 1.084.152 1.46.455.376.303.627.702.753 1.196.126.494.137 1.036.033 1.626h-4.22c.026.483.152.883.376 1.2.224.317.583.476 1.077.476.516 0 .914-.143 1.196-.428a1.725 1.725 0 0 0 .385-.688h1.636a3.298 3.298 0 0 1-.762 1.343l.004-.002zm-.62-4.088c-.027-.376-.145-.69-.356-.94-.21-.252-.53-.378-.96-.378-.456 0-.805.127-1.047.382-.242.254-.393.565-.453.935h2.816v.001z"/>
  </svg>
);

const FEATURED_IMAGES = [
  "/prog_computer.png",
  "/prog_engineering.png",
  "/prog_management.png",
  "/prog_pharmacy.png"
];

export default function News() {
  const navigate = useNavigate();
  const { news, events, newsPageConfig } = useData();

  // Social sharing states
  const [showShare, setShowShare] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeShareItem, setActiveShareItem] = useState<{ type: "news" | "event"; id: number } | null>(null);
  
  // Track active university highlight (defaults to null so none are active by default)
  const [activeHighlightId, setActiveHighlightId] = useState<number | null>(null);

  // Upcoming Events drawer state
  const [showEventsDrawer, setShowEventsDrawer] = useState(false);
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);
  const newsDrawerScrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll, handle escape key, and scroll to top when Events Drawer opens
  useEffect(() => {
    if (showEventsDrawer) {
      document.body.classList.add("overflow-hidden");
      if (newsDrawerScrollRef.current) {
        newsDrawerScrollRef.current.scrollTop = 0;
      }
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowEventsDrawer(false);
      }
    };

    if (showEventsDrawer) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showEventsDrawer]);

  // Carousel state for the main Featured News
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    document.title = (newsPageConfig?.headerTitle || "News @ City Chalapathi") + " | Chalapathi University";
  }, [newsPageConfig?.headerTitle]);

  // Dynamic carousel images from config or presets
  const baseCarouselImages = (newsPageConfig?.featuredCarouselImages && newsPageConfig.featuredCarouselImages.length > 0)
    ? newsPageConfig.featuredCarouselImages
    : FEATURED_IMAGES;

  // Auto-slide effect for the Featured News image carousel
  useEffect(() => {
    if (baseCarouselImages.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % baseCarouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [baseCarouselImages.length]);

  // Find the Featured news article (via config ID, or featured flag, or ID 1, or first item)
  const featuredArticle = 
    news.find(item => item.id === newsPageConfig?.featuredArticleId) ||
    news.find(item => item.featured) ||
    news.find(item => item.id === 1) ||
    news[0];

  // Dynamic featured images prioritizing the article's own configured image
  const featuredImages = featuredArticle?.image
    ? [featuredArticle.image, ...baseCarouselImages.filter(img => img !== featuredArticle.image)]
    : baseCarouselImages;

  // Handle active slide controls
  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + featuredImages.length) % featuredImages.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % featuredImages.length);
  };

  // Find 5 Trending news articles for University Highlights sidebar
  const trendingArticles = news.slice(0, 5);

  // Filter upcoming events based on config
  const eventsCount = newsPageConfig?.eventsStripCount || 3;
  const upcomingEventsList = events.slice(0, eventsCount);

  // Filter latest news list based on config (excluding featured article)
  const latestCount = newsPageConfig?.latestNewsCount || 4;
  const filteredLatest = news.filter(item => item.id !== featuredArticle?.id);
  const latestNewsArticles = filteredLatest.length >= latestCount 
    ? filteredLatest.slice(0, latestCount) 
    : news.slice(1, 1 + latestCount);

  // Share setup
  const handleShareTrigger = (type: "news" | "event", id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveShareItem({ type, id });
    setShowShare(true);
  };

  const getShareLinks = () => {
    if (!activeShareItem) return {};
    const item = activeShareItem.type === "news" 
      ? news.find(n => n.id === activeShareItem.id)
      : events.find(ev => ev.id === activeShareItem.id);
    if (!item) return {};

    const pageUrl = window.location.origin + (activeShareItem.type === "news" ? `/news/${item.slug}` : `/news/events/${item.slug}`);
    const title = item.title;
    const summary = activeShareItem.type === "news" ? (item as any).excerpt : (item as any).bodyText.substring(0, 150);

    const encUrl = encodeURIComponent(pageUrl);
    const encTitle = encodeURIComponent(title);
    const encSummary = encodeURIComponent(summary);

    return {
      whatsapp: `https://api.whatsapp.com/send?text=${encTitle}%20${encUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encTitle}`,
      linkedin: `https://www.linkedin.com/shareArticle?url=${encUrl}&title=${encTitle}&summary=${encSummary}`,
      telegram: `https://t.me/share/url?url=${encUrl}&text=${encTitle}`,
      email: `mailto:?subject=${encTitle}&body=${encSummary}%20${encUrl}`,
      reddit: `https://reddit.com/submit?url=${encUrl}&title=${encTitle}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encUrl}&description=${encSummary}`,
      threads: `https://threads.net/intent/post?text=${encTitle}%20${encUrl}`
    };
  };

  const handleCopyLink = () => {
    if (!activeShareItem) return;
    const item = activeShareItem.type === "news" 
      ? news.find(n => n.id === activeShareItem.id)
      : events.find(ev => ev.id === activeShareItem.id);
    if (!item) return;

    const pageUrl = window.location.origin + (activeShareItem.type === "news" ? `/news/${item.slug}` : `/news/events/${item.slug}`);
    navigator.clipboard.writeText(pageUrl);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const shareLinks = getShareLinks();

  return (
    <div className="min-h-screen bg-[#F4F7FC] font-[var(--font-poppins)] pb-24 relative select-none text-left">
      
      {/* 🌟 Header Section */}
      <section className="max-w-[1440px] mx-auto px-6 pt-10 pb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#072A6C] tracking-tight">
          {newsPageConfig?.headerTitle || "News @ City Chalapathi"}
        </h1>
        <p className="text-[13px] text-gray-500 font-light mt-1 max-w-xl font-[var(--font-inter)]">
          {newsPageConfig?.headerSubtitle || "Stay updated with the latest happenings, milestones, and achievements from across the university."}
        </p>
      </section>

      {/* 🌟 Main Grid: Featured News & Trending Now */}
      <section className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left: Featured News Card (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch">
          
          {/* Left half: Image slider carousel */}
          <div className="w-full md:w-1/2 relative bg-slate-900 group min-h-[320px] md:min-h-auto flex items-stretch">
            <img 
              src={featuredImages[activeSlide % featuredImages.length]} 
              alt={featuredArticle?.title} 
              onError={(e) => { (e.target as HTMLImageElement).src = "/prog_computer.png"; }}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
            />
            <div className="absolute inset-0 bg-black/10" />
            
            {/* Featured Badge */}
            <span className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm">
              {newsPageConfig?.featuredBadgeText || "Featured News"}
            </span>

            {/* Slider arrows */}
            <button 
              onClick={handlePrevSlide} 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={handleNextSlide} 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Right half: Text Content */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                  {featuredArticle?.category || "Innovation"}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[10px] text-gray-400 font-semibold font-[var(--font-inter)]">
                  {featuredArticle?.date}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-extrabold text-[#072A6C] leading-snug line-clamp-3">
                {featuredArticle?.title}
              </h2>

              <p className="text-[12px] text-gray-500 font-light leading-relaxed font-[var(--font-inter)] line-clamp-4">
                {featuredArticle?.excerpt}
              </p>
            </div>

            {/* Actions Row */}
            <div className="pt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(`/news/${featuredArticle?.slug}`)}
                  className="h-10 px-6 bg-[#072A6C] hover:bg-[#D4AF37] text-white text-[11px] font-bold rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <span>{newsPageConfig?.readStoryButtonText || "Read Full Story"}</span>
                  <ArrowRight size={12} />
                </button>
                
                <button 
                  onClick={(e) => handleShareTrigger("news", featuredArticle.id, e)}
                  className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Share2 size={14} />
                </button>
              </div>

              {/* Slider Indicator Dots */}
              <div className="flex items-center gap-1.5 pt-2">
                {featuredImages.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      (activeSlide % featuredImages.length) === idx ? "bg-[#D4AF37] w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right: University Highlights Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col">
          
          {/* Section Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-1.5 text-[#072A6C]">
              <Flame size={16} className="text-[#D4AF37] fill-current animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider">
                {newsPageConfig?.highlightsTitle || "University Highlights"}
              </h3>
            </div>
            <Link 
              to={newsPageConfig?.highlightsViewAllUrl || "/news/latest"} 
              className="text-[10px] font-bold text-[#072A6C] hover:text-[#D4AF37] transition-colors"
            >
              {newsPageConfig?.highlightsViewAllText || "View All"}
            </Link>
          </div>

          {/* List items */}
          <div className="flex-1 flex flex-col justify-between gap-4">
            {trendingArticles.map((item, idx) => {
              const displayNum = `0${idx + 1}`;
              const isActive = activeHighlightId === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => {
                    setActiveHighlightId(item.id);
                    navigate(`/news/${item.slug}`);
                  }}
                  className={`w-full text-left flex items-start gap-4 group cursor-pointer transition-all duration-300 p-2 rounded-xl border ${
                    isActive 
                      ? "bg-[#EEF5FF] shadow-[0_0_15px_rgba(59,130,246,0.2)] border-l-4 border-l-[#E31E24] border-t-transparent border-b-transparent border-r-transparent" 
                      : "hover:bg-gray-50 border-transparent hover:shadow-xs"
                  }`}
                >
                  {/* Big rank number */}
                  <span className={`tracking-wider pt-0.5 transition-all duration-300 ${
                    isActive 
                      ? "text-base font-black text-[#E31E24]" 
                      : "text-sm font-bold text-[#D4AF37]"
                  }`}>
                    {displayNum}
                  </span>

                  {/* Title & Metadata */}
                  <div className="flex-1 space-y-0.5 min-w-0">
                    <h4 className={`text-xs leading-snug line-clamp-2 transition-all duration-300 ${
                      isActive 
                        ? "text-[#0B2D6B] font-semibold" 
                        : "text-gray-800 font-bold group-hover:text-[#072A6C]"
                    }`}>
                      {item.title}
                    </h4>
                    <span className="text-[9px] text-gray-400 font-medium font-[var(--font-inter)]">
                      {item.date}
                    </span>
                  </div>

                  {/* Tiny Thumbnail */}
                  <div className={`w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100 transition-all duration-300 ${
                    isActive ? "scale-105" : "group-hover:scale-105"
                  }`}>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </section>

      {/* 🌟 Upcoming Events (Full Width Bar) */}
      <section className="max-w-[1440px] mx-auto px-6 mt-10">
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
          
          {/* Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
            <button 
              onClick={() => setShowEventsDrawer(true)}
              className="flex items-center gap-2 text-[#072A6C] hover:text-[#D4AF37] transition-colors cursor-pointer outline-none text-left"
            >
              <Calendar size={16} className="text-[#D4AF37]" />
              <h3 className="text-xs font-black uppercase tracking-wider">
                {newsPageConfig?.eventsStripTitle || "Upcoming Events"}
              </h3>
            </button>
            <button 
              onClick={() => setShowEventsDrawer(true)}
              className="text-[10px] font-bold text-[#072A6C] hover:text-[#D4AF37] transition-colors cursor-pointer outline-none"
            >
              {newsPageConfig?.eventsStripViewAllText || "View All"}
            </button>
          </div>

          {/* Grid layout containing events */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {upcomingEventsList.map((item, idx) => {
              const dateParts = item.date.split(" ");
              const day = dateParts[0] || "20";
              const month = (dateParts[1] || "MAY").toUpperCase();
              
              // alternate background colors for calendar badges
              const badgeBg = idx % 2 === 0 ? "bg-[#D4AF37]" : "bg-[#072A6C]";

              return (
                <button
                  key={item.id}
                  onClick={() => setShowEventsDrawer(true)}
                  className="w-full text-left flex items-start gap-4 pt-4 md:pt-0 md:px-4 first:pl-0 last:pr-0 cursor-pointer outline-none group"
                >
                  {/* Calendar Box Badge */}
                  <div className={`w-12 h-12 rounded-xl ${badgeBg} text-white flex flex-col items-center justify-center shrink-0 shadow-sm`}>
                    <span className="text-base font-black leading-none">{day}</span>
                    <span className="text-[8px] font-extrabold uppercase tracking-wider leading-none mt-1">{month}</span>
                  </div>

                  {/* Metadata & Title */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h4 className="text-[11.5px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#072A6C] transition-colors">
                      {item.title}
                    </h4>
                    
                    <div className="flex flex-col gap-1 text-[9px] text-gray-400 font-semibold font-[var(--font-inter)]">
                      <div className="flex items-center gap-1.5">
                        <Clock size={10} className="text-[#D4AF37]" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={10} className="text-[#D4AF37]" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 🌟 Latest News (Grid) */}
      <section className="max-w-[1440px] mx-auto px-6 mt-10 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#072A6C]">
            {newsPageConfig?.latestNewsTitle || "Latest News"}
          </h3>
          <Link 
            to={newsPageConfig?.latestNewsViewAllUrl || "/news/latest"} 
            className="text-[11px] font-bold text-[#072A6C] hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1"
          >
            <span>{newsPageConfig?.latestNewsViewAllText || "View All News"}</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestNewsArticles.map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate(`/news/${item.slug}`)}
              className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col justify-between text-left cursor-pointer outline-none group"
            >
              <div>
                {/* Image */}
                <div className="h-44 overflow-hidden bg-gray-50 relative w-full border-b border-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    onError={(e) => { (e.target as HTMLImageElement).src = "/prog_computer.png"; }}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" 
                  />
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                    <span className="text-[#D4AF37]">{item.category}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                  
                  <h4 className="text-xs font-bold text-[#072A6C] leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                    {item.title}
                  </h4>
                  
                  <p className="text-[10.5px] text-gray-500 leading-relaxed font-light font-[var(--font-inter)] line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              {/* Read More Footer */}
              <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex items-center justify-between text-[10.5px] font-bold text-[#072A6C] group-hover:text-[#D4AF37] transition-colors">
                <span>Read More</span>
                <ArrowRight size={12} className="text-[#D4AF37] group-hover:translate-x-0.5 transition-transform" />
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* ======================================================== */}
      {/* 🌟 SOCIAL SHARING MENU (Bottom Sheet / Dropdown Modal)   */}
      {/* ======================================================== */}
      {showShare && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-50 transition-opacity duration-300"
            onClick={() => setShowShare(false)}
          />
          
          {/* Circular Button Icons Grid popup */}
          <div className="fixed bottom-0 left-0 right-0 sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 bg-white rounded-t-[24px] sm:rounded-2xl p-6 shadow-2xl z-50 w-full sm:max-w-md max-h-[85vh] overflow-y-auto transform transition-transform duration-300 text-left border border-gray-100 flex flex-col gap-5 font-[var(--font-poppins)]">
            
            {/* Mobile Drag Handle */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-2 sm:hidden" />
            
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h4 className="text-sm font-black text-[#072A6C] tracking-wide uppercase">Share via</h4>
              <button onClick={() => setShowShare(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-y-5 gap-x-4 text-center justify-items-center">
              {/* WhatsApp */}
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#25D366]/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow">
                  <WhatsAppIcon />
                </div>
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700">WhatsApp</span>
              </a>

              {/* Facebook */}
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow">
                  <FacebookIcon />
                </div>
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700">Facebook</span>
              </a>

              {/* X */}
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-black hover:bg-black/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow">
                  <XIcon />
                </div>
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700">X (Twitter)</span>
              </a>

              {/* LinkedIn */}
              <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#0A66C2] hover:bg-[#0A66C2]/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow">
                  <LinkedInIcon />
                </div>
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700">LinkedIn</span>
              </a>

              {/* Telegram */}
              <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#24A1DE] hover:bg-[#24A1DE]/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow">
                  <TelegramIcon />
                </div>
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700">Telegram</span>
              </a>

              {/* Reddit */}
              <a href={shareLinks.reddit} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#FF4500] hover:bg-[#FF4500]/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow">
                  <RedditIcon />
                </div>
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700">Reddit</span>
              </a>

              {/* Pinterest */}
              <a href={shareLinks.pinterest} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#BD081C] hover:bg-[#BD081C]/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow">
                  <PinterestIcon />
                </div>
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700">Pinterest</span>
              </a>

              {/* Threads */}
              <a href={shareLinks.threads} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 group cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-[#000000] hover:bg-[#000000]/90 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow">
                  <ThreadsIcon />
                </div>
                <span className="text-[10px] text-gray-500 font-medium group-hover:text-gray-700">Threads</span>
              </a>
            </div>

            {/* Bottom Actions Row (Email & Copy) */}
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <a 
                href={shareLinks.email} 
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-gray-200"
              >
                <span>Email Details</span>
              </a>
              <button 
                onClick={() => { handleCopyLink(); setShowShare(false); }}
                className="flex-1 py-2.5 bg-[#072A6C]/5 hover:bg-[#072A6C]/10 text-[#072A6C] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-[#072A6C]/10 cursor-pointer outline-none"
              >
                <Link2 size={13} className="text-[#072A6C]" />
                <span>Copy Link</span>
              </button>
            </div>

          </div>
        </>
      )}

      {/* ============================================== */}
      {/* 🌟 TOAST NOTIFICATION                          */}
      {/* ============================================== */}
      {showToast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#072A6C] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-xl z-55 flex items-center gap-2 border border-white/10 animate-bounce">
          <Check size={14} className="text-green-400" />
          <span>Link copied successfully!</span>
        </div>
      )}

      {/* 🌟 Upcoming Events Sliding Drawer (Right Side) */}
      {showEventsDrawer && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 transition-opacity duration-300 pointer-events-auto cursor-pointer"
            onClick={() => setShowEventsDrawer(false)}
          />
          
          {/* Drawer Track Container */}
          <div className="fixed inset-0 z-50 flex justify-start pointer-events-none">
            <div 
              className="bg-[#F7F8FC] w-full max-w-[420px] h-full shadow-2xl relative flex flex-col text-left rounded-r-2xl transform transition-transform duration-300 animate-slide-in pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#072A6C] text-white p-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#F97316]" />
                  <h3 className="font-extrabold text-sm tracking-wide">Upcoming Events</h3>
                </div>
                <button 
                  onClick={() => setShowEventsDrawer(false)}
                  className="text-white/80 hover:text-white transition-colors cursor-pointer outline-none"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable list of events */}
              <div ref={newsDrawerScrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {events.map((item, idx) => {
                  return (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setShowEventsDrawer(false);
                        navigate(`/news/events/${item.slug}`);
                      }}
                      className="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col gap-3.5 cursor-pointer text-left group"
                    >
                      {/* Badge & Image Row */}
                      <div className="flex justify-between items-start gap-3">
                        <span className="bg-[#F97316]/10 text-[#F97316] text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded">
                          {item.category}
                        </span>
                        
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-50 border border-gray-100">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      </div>

                      {/* Event Title */}
                      <h4 className="text-xs font-bold text-[#072A6C] group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h4>

                      {/* Info fields */}
                      <div className="space-y-1.5 border-t border-gray-50 pt-3">
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-semibold font-[var(--font-inter)]">
                          <Calendar size={10} className="text-[#D4AF37] shrink-0" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-semibold font-[var(--font-inter)]">
                          <Clock size={10} className="text-[#D4AF37] shrink-0" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-semibold font-[var(--font-inter)]">
                          <MapPin size={10} className="text-[#D4AF37] shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>

                      {/* Excerpt */}
                      <p className="text-[10.5px] text-gray-400 font-light leading-relaxed line-clamp-3">
                        {item.bodyText}
                      </p>

                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200/60 bg-white flex justify-end">
                <button 
                  onClick={() => setShowEventsDrawer(false)}
                  className="h-9 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Event Registration Modal Popup (Matches Screenshot media_1789894355143.png) */}
      <EventRegistrationModal
        isOpen={!!registeringEvent}
        onClose={() => setRegisteringEvent(null)}
        event={registeringEvent}
      />
    </div>
  );
}
