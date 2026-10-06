import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Award, Sparkles, BookOpen, Layers, Phone, Mail, ArrowRight, 
  ChevronRight, ExternalLink, Wrench, AlertTriangle, Home,
  GraduationCap, Building2, CheckCircle2
} from "lucide-react";
import { 
  DEFAULT_RESEARCH_DATA, 
  ResearchCMSData, 
  ResearchItem 
} from "../admin/ResearchCMS";

interface ResearchViewProps {
  path?: string;
}

export const ResearchView: React.FC<ResearchViewProps> = ({ path = "/research" }) => {
  const [data, setData] = useState<ResearchCMSData>(() => {
    try {
      const saved = localStorage.getItem("chalapathi_research_cms_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_RESEARCH_DATA,
          ...parsed,
          items: Array.isArray(parsed.items) ? parsed.items : []
        };
      }
    } catch (e) {
      console.error("Error reading research CMS data:", e);
    }
    return DEFAULT_RESEARCH_DATA;
  });

  // Listen for real-time updates from AdminPortal
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem("chalapathi_research_cms_data");
        if (saved) {
          const parsed = JSON.parse(saved);
          setData({
            ...DEFAULT_RESEARCH_DATA,
            ...parsed,
            items: Array.isArray(parsed.items) ? parsed.items : []
          });
        }
      } catch (e) {}
    };

    window.addEventListener("chalapathi_cms_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("chalapathi_cms_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const visibleItems = (data.items || []).filter((item) => !item.hidden);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* ── Breadcrumb Bar ────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-[#072A6C] flex items-center gap-1 transition-colors">
            <Home size={13} />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="font-bold text-[#072A6C]">{data.pageTitle || "Research"}</span>
        </div>
      </div>

      {/* ── Hero Banner ───────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-[#072A6C] via-[#0B3A8F] to-[#072A6C] text-white py-14 px-4 overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-wider backdrop-blur-xs animate-pulse">
            <Wrench size={13} />
            <span>Page Under Construction</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            {data.pageTitle || "Research & Innovation"}
          </h1>

          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto font-medium leading-relaxed">
            {data.pageSubtitle || "Fostering academic inquiry, scientific research, and technological development."}
          </p>
        </div>
      </div>

      {/* ── Main Under Construction Card ─────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-20 pb-16 space-y-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center shadow-inner">
            <Wrench size={36} className="animate-bounce" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-[#072A6C] uppercase tracking-wide">
              We are Upgrading Our Research Hub
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {data.underConstructionMessage || 
                "This section is currently under development. Our new Research & Innovation portal featuring doctoral programs, active grants, publications, and patents is coming soon."}
            </p>
          </div>

          {/* Status Progress Indicator */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-2 text-left">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#072A6C] flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#D4AF37]" />
                Portal Modernization Status
              </span>
              <span className="text-amber-600 uppercase text-[10px] font-black tracking-wider bg-amber-100 px-2 py-0.5 rounded-full">
                In Progress
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-500 rounded-full w-2/3 transition-all duration-1000" />
            </div>
            <p className="text-[11px] text-gray-500">
              Doctoral scholar guidelines, central instrumentation facilities, and patent databases are being organized.
            </p>
          </div>

          {/* Quick Helpdesk Coordinates */}
          {(data.contactEmail || data.contactPhone) && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-700">
              {data.contactEmail && (
                <a 
                  href={`mailto:${data.contactEmail}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#072A6C] hover:text-white transition-colors"
                >
                  <Mail size={13} className="text-[#D4AF37]" />
                  <span>{data.contactEmail}</span>
                </a>
              )}
              {data.contactPhone && (
                <a 
                  href={`tel:${data.contactPhone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#072A6C] hover:text-white transition-colors"
                >
                  <Phone size={13} className="text-[#D4AF37]" />
                  <span>{data.contactPhone}</span>
                </a>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="h-10 px-5 rounded-xl bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Home size={14} />
              <span>Back to Homepage</span>
            </Link>
            <Link
              to="/academics"
              className="h-10 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <GraduationCap size={14} className="text-[#072A6C]" />
              <span>Explore Academics</span>
            </Link>
            <Link
              to="/admissions"
              className="h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Admissions 2026</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Optional Visible Items (if added by admin and not hidden) ── */}
        {visibleItems.length > 0 && (
          <div className="space-y-4 pt-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Award size={16} className="text-[#D4AF37]" />
                Published Research Highlights & Announcements
              </h3>
              <span className="text-xs text-gray-500 font-bold">{visibleItems.length} Items</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#072A6C]/10 text-[#072A6C]">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-black text-gray-900">
                    {item.title}
                  </h4>

                  {item.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {item.link && (
                    <div className="pt-1">
                      <a
                        href={item.link}
                        target={item.link.startsWith("http") ? "_blank" : undefined}
                        rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[#072A6C] hover:text-amber-600 transition-colors"
                      >
                        <span>{item.linkText || "Learn More"}</span>
                        <ChevronRight size={13} />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
