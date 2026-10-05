import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Award, BookOpen, Briefcase, Building, Building2, Calendar, CheckCircle2, 
  ChevronDown, ChevronRight, Clock, Compass, Cpu, Download, ExternalLink, 
  Eye, FileSpreadsheet, FileText, Globe, GraduationCap, Grid, Heart, Info, 
  Layers, Lightbulb, Mail, MapPin, Megaphone, MessageSquare, Newspaper, 
  Phone, PlaySquare, Quote, Search, Send, ShieldCheck, Sparkles, Star, 
  Target, Trophy, Users, X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CmsSection, DynamicTableData } from "../../types/cms";
import { useData } from "../../context/DataContext";

// Dynamic Icon Map for any Lucide icon name stored in CMS
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Award, BookOpen, Briefcase, Building, Building2, Calendar, CheckCircle2,
  Clock, Compass, Cpu, Download, FileSpreadsheet, FileText, Globe,
  GraduationCap, Grid, Heart, Info, Layers, Lightbulb, Mail, MapPin,
  Megaphone, MessageSquare, Newspaper, Phone, PlaySquare, Quote,
  Search, Send, ShieldCheck, Sparkles, Star, Target, Trophy, Users
};

interface DynamicSectionRendererProps {
  section: CmsSection;
  index?: number;
  previewMode?: boolean;
}

export const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({
  section,
  index = 0,
  previewMode = false
}) => {
  const { news, events, facultyData, boardData, addEnquiry } = useData();

  // If section is hidden or draft and not in preview mode, don't render publicly
  if (section.status === "hidden" && !previewMode) return null;
  if (section.status === "draft" && !previewMode) return null;

  const { type, title, subtitle, badge, content, settings, media, items, table, rawHtml } = section;

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // FAQ search & filter state
  const [faqSearch, setFaqSearch] = useState("");
  const filteredFaqs = useMemo(() => {
    if (!items) return [];
    if (!faqSearch.trim()) return items;
    const q = faqSearch.toLowerCase();
    return items.filter(i => 
      i.title.toLowerCase().includes(q) || 
      (i.description && i.description.toLowerCase().includes(q))
    );
  }, [items, faqSearch]);

  // Gallery modal state
  const [activeGalleryImg, setActiveGalleryImg] = useState<string | null>(null);

  // Directory filter state
  const [directorySearch, setDirectorySearch] = useState("");
  const [directoryDeptFilter, setDirectoryDeptFilter] = useState("All");

  // Dynamic Table search & filter state
  const [tableSearch, setTableSearch] = useState("");

  // Contact form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    mobile: "",
    program: "",
    query: ""
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (addEnquiry) {
      addEnquiry({
        name: contactForm.name,
        email: contactForm.email,
        mobile: contactForm.mobile,
        program: contactForm.program,
        query: contactForm.query,
        city: "",
        state: "",
        qualification: "",
        yearOfPassing: ""
      });
    }
    setFormSubmitted(true);
  };


  // 1. HERO BANNER
  if (type === "hero") {
    const isSplit = settings?.layout === "split";
    const bg = settings?.bgColor || "#072A6C";
    const textColor = settings?.textColor || "#FFFFFF";

    return (
      <section 
        className="relative overflow-hidden py-16 md:py-24"
        style={{ backgroundColor: bg, color: textColor }}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`grid grid-cols-1 ${isSplit && media?.url ? "lg:grid-cols-12 gap-12 items-center" : "text-center max-w-4xl mx-auto"}`}>
            <div className={isSplit && media?.url ? "lg:col-span-7 space-y-6 text-left" : "space-y-6"}>
              {badge && (
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-white/10 backdrop-blur-md text-[#D4AF37] border border-white/20">
                  <Sparkles size={14} />
                  {badge}
                </span>
              )}
              {title && (
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-base sm:text-lg text-white/80 font-light leading-relaxed max-w-2xl">
                  {subtitle}
                </p>
              )}
              {(settings?.buttonText || settings?.secondaryButtonText) && (
                <div className={`flex flex-wrap gap-4 pt-4 ${isSplit && media?.url ? "" : "justify-center"}`}>
                  {settings?.buttonText && (
                    <Link
                      to={settings.buttonLink || "#"}
                      className="px-6 py-3.5 bg-[#D4AF37] hover:bg-[#b5952f] text-[#072A6C] font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                    >
                      {settings.buttonText}
                      <ChevronRight size={16} />
                    </Link>
                  )}
                  {settings?.secondaryButtonText && (
                    <Link
                      to={settings.secondaryButtonLink || "#"}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider rounded-xl backdrop-blur-md border border-white/20 transition-all inline-flex items-center gap-2"
                    >
                      {settings.secondaryButtonText}
                    </Link>
                  )}
                </div>
              )}
            </div>

            {isSplit && media?.url && (
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
                  <img 
                    src={media.url} 
                    alt={media.alt || title || "Banner"} 
                    className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-500" 
                  />
                  {media.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-xs text-white/90">
                      {media.caption}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 2. RICH TEXT
  if (type === "rich-text") {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {badge && (
            <span className="text-xs font-black uppercase tracking-widest text-[#D71920]">{badge}</span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C] tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-base text-gray-500 font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
          {content && (
            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base font-normal">
              {content.split("\n\n").map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // 3. IMAGE SHOWCASE
  if (type === "image") {
    return (
      <section className="py-12 bg-[#F7F8FC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
          {title && <h3 className="text-xl sm:text-2xl font-bold text-[#072A6C]">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 max-w-2xl mx-auto">{subtitle}</p>}
          {media?.url && (
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 mt-6 bg-white p-2">
              <img src={media.url} alt={media.alt || "Showcase"} className="w-full h-auto max-h-[550px] object-cover rounded-xl" />
              {media.caption && <p className="text-xs text-gray-500 mt-2 italic">{media.caption}</p>}
            </div>
          )}
        </div>
      </section>
    );
  }

  // 4. IMAGE + TEXT
  if (type === "image-text") {
    const isImageLeft = settings?.imagePosition === "left";
    return (
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className={`lg:col-span-6 ${isImageLeft ? "lg:order-1" : "lg:order-2"}`}>
              {media?.url && (
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <img src={media.url} alt={media.alt || title || "Image"} className="w-full h-80 sm:h-96 object-cover" />
                </div>
              )}
            </div>
            <div className={`lg:col-span-6 space-y-5 ${isImageLeft ? "lg:order-2" : "lg:order-1"}`}>
              {badge && (
                <span className="text-xs font-black uppercase tracking-widest text-[#D71920] bg-red-50 px-3 py-1 rounded-md">
                  {badge}
                </span>
              )}
              {title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072A6C] leading-snug">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-base text-gray-600 font-normal leading-relaxed">
                  {subtitle}
                </p>
              )}
              {content && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {content}
                </p>
              )}
              {settings?.buttonText && (
                <Link
                  to={settings.buttonLink || "#"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow transition-all"
                >
                  {settings.buttonText}
                  <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 5. CARDS GRID
  if (type === "cards") {
    const cols = settings?.columns || 3;
    const gridCols = cols === 2 ? "sm:grid-cols-2" : cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";

    return (
      <section className="py-14 md:py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {(title || subtitle || badge) && (
            <div className="text-center max-w-3xl mx-auto space-y-3">
              {badge && (
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#D71920]">{badge}</span>
              )}
              {title && (
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#072A6C]">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm sm:text-base text-gray-500 font-light leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
            {(items || []).filter(item => item.enabled !== false).map((item, iIdx) => {
              const IconComp = item.iconName ? ICON_MAP[item.iconName] || Sparkles : Sparkles;
              return (
                <div 
                  key={item.id || iIdx}
                  className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-[#072A6C]/5 flex items-center justify-center text-[#072A6C] group-hover:bg-[#072A6C] group-hover:text-white transition-colors">
                        <IconComp size={24} />
                      </div>
                      {item.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#072A6C]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.image && (
                      <div className="rounded-xl overflow-hidden h-40 w-full mb-3">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-[#072A6C] leading-snug group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed line-clamp-4">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.link && (
                    <Link
                      to={item.link}
                      className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#072A6C] hover:text-blue-700 transition-colors pt-3 border-t border-gray-100"
                    >
                      {item.buttonText || "Learn More"}
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 6. STATISTICS
  if (type === "statistics") {
    return (
      <section className="py-14 md:py-16 bg-[#072A6C] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          {(title || subtitle) && (
            <div className="text-center max-w-3xl mx-auto space-y-2">
              {title && <h2 className="text-2xl sm:text-3xl font-extrabold">{title}</h2>}
              {subtitle && <p className="text-sm text-white/80 font-light">{subtitle}</p>}
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {(items || []).filter(item => item.enabled !== false).map((item, sIdx) => {
              const IconComp = item.iconName ? ICON_MAP[item.iconName] || Trophy : Trophy;
              return (
                <div key={item.id || sIdx} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37] mb-2">
                    <IconComp size={20} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-[#D4AF37] tracking-tight">
                    {item.statNumber || item.title}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                    {item.statLabel || item.subtitle || item.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 7. TIMELINE / MILESTONES
  if (type === "timeline") {
    return (
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {(title || subtitle) && (
            <div className="text-center max-w-3xl mx-auto space-y-2">
              {title && <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C]">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-500 font-light">{subtitle}</p>}
            </div>
          )}
          <div className="relative border-l-2 border-blue-200 ml-4 md:ml-32 space-y-10">
            {(items || []).filter(item => item.enabled !== false).map((item, tIdx) => (
              <div key={item.id || tIdx} className="relative pl-8 md:pl-10 group">
                <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#072A6C] border-4 border-white text-white flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-[#D4AF37] transition-all">
                  <span className="text-[9px] font-black">{tIdx + 1}</span>
                </div>
                {item.year && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-50 text-[#072A6C] mb-2 border border-blue-100">
                    {item.year}
                  </span>
                )}
                <h3 className="text-lg font-bold text-[#072A6C] leading-snug">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 font-light mt-1.5 leading-relaxed">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 8. ACCORDION / COLLAPSIBLE
  if (type === "accordion") {
    return (
      <section className="py-12 md:py-16 bg-[#F7F8FC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {(title || subtitle) && (
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              {title && <h2 className="text-2xl font-extrabold text-[#072A6C]">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-500 font-light">{subtitle}</p>}
            </div>
          )}
          <div className="space-y-3">
            {(items || []).filter(item => item.enabled !== false).map((item, aIdx) => {
              const isOpen = !!openAccordions[item.id || String(aIdx)];
              return (
                <div key={item.id || aIdx} className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(item.id || String(aIdx))}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-[#072A6C] hover:bg-slate-50 transition-colors"
                  >
                    <span>{item.title}</span>
                    <ChevronDown size={18} className={`transition-transform duration-300 text-gray-400 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3"
                      >
                        {item.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // 9. FAQ ACCORDION (With Search)
  if (type === "faq") {
    return (
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            {badge && <span className="text-xs font-black uppercase tracking-widest text-[#D71920]">{badge}</span>}
            {title && <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C]">{title}</h2>}
            {subtitle && <p className="text-sm text-gray-500 font-light">{subtitle}</p>}
            
            {/* FAQ Search Bar */}
            <div className="relative max-w-md mx-auto mt-4">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions (e.g. fees, admissions, hostel)..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 text-xs font-medium border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {faqSearch && (
                <button onClick={() => setFaqSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">No matching questions found.</div>
            ) : (
              filteredFaqs.map((faq, fIdx) => {
                const isOpen = !!openAccordions[faq.id || String(fIdx)];
                return (
                  <div key={faq.id || fIdx} className="bg-[#F7F8FC] rounded-2xl border border-gray-100 overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id || String(fIdx))}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-[#072A6C] hover:bg-slate-100/50 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <MessageSquare size={16} className="text-[#D4AF37] shrink-0" />
                        {faq.title}
                      </span>
                      <ChevronDown size={16} className={`transition-transform duration-300 text-gray-400 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-5 pb-5 pl-11 text-xs text-gray-600 leading-relaxed border-t border-gray-200/50 pt-3"
                        >
                          {faq.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    );
  }

  // 10. GALLERY (With Lightbox)
  if (type === "gallery") {
    return (
      <section className="py-14 md:py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {(title || subtitle) && (
            <div className="text-center max-w-3xl mx-auto space-y-2">
              {title && <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C]">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-500 font-light">{subtitle}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(items || []).filter(item => item.enabled !== false).map((item, gIdx) => (
              <div 
                key={item.id || gIdx}
                onClick={() => setActiveGalleryImg(item.image || "")}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-200 shadow-sm cursor-pointer hover:shadow-xl transition-all"
              >
                {item.image && (
                  <img src={item.image} alt={item.title || "Gallery"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                  <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                  {item.description && <p className="text-[10px] text-white/80 line-clamp-1">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Modal Lightbox */}
          {activeGalleryImg && (
            <div 
              className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
              onClick={() => setActiveGalleryImg(null)}
            >
              <button 
                onClick={() => setActiveGalleryImg(null)}
                className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 rounded-full bg-white/10"
              >
                <X size={24} />
              </button>
              <img src={activeGalleryImg} alt="Enlarged preview" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain" />
            </div>
          )}
        </div>
      </section>
    );
  }

  // 11. PERSON PROFILE
  if (type === "person-profile") {
    return (
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {media?.url && (
              <div className="md:col-span-5 flex flex-col items-center text-center space-y-3">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                  <img src={media.url} alt={title || "Profile"} className="w-full h-full object-cover object-top" />
                </div>
                {media.caption && <span className="text-xs font-bold text-[#072A6C]">{media.caption}</span>}
              </div>
            )}
            <div className={`md:col-span-${media?.url ? "7" : "12"} space-y-4 text-left`}>
              {badge && <span className="text-xs font-black uppercase tracking-widest text-[#D71920]">{badge}</span>}
              {title && <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C]">{title}</h2>}
              {subtitle && <h4 className="text-sm font-bold text-gray-500">{subtitle}</h4>}
              {content && (
                <p className="text-sm text-gray-700 leading-relaxed italic border-l-4 border-[#072A6C] pl-4 py-1">
                  "{content}"
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 12. FACULTY & LEADERSHIP DIRECTORY
  if (type === "faculty-directory" || type === "leadership-directory") {
    // Collect directory items from section items or fallback to DataContext
    const directoryList: any[] = (items && items.length > 0) 
      ? items 
      : type === "leadership-directory"
        ? Object.values(boardData || {}).flatMap((d: any) => [d?.hod, ...(d?.others || [])]).filter(Boolean)
        : Object.values(facultyData || {}).flatMap((d: any) => [d?.hod, ...(d?.others || [])]).filter(Boolean);

    const depts = ["All", ...Array.from(new Set(directoryList.map((p: any) => p.department).filter(Boolean)))];

    const filteredPeople = directoryList.filter((p: any) => {
      const matchDept = directoryDeptFilter === "All" || p.department === directoryDeptFilter;
      const matchSearch = !directorySearch.trim() || 
        (p.name || p.title || "").toLowerCase().includes(directorySearch.toLowerCase()) ||
        (p.designation || "").toLowerCase().includes(directorySearch.toLowerCase());
      return matchDept && matchSearch;
    });


    return (
      <section className="py-14 md:py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              {badge && <span className="text-xs font-black uppercase tracking-widest text-[#D71920]">{badge}</span>}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C]">{title || (type === "leadership-directory" ? "Leadership Directory" : "Faculty Directory")}</h2>
              {subtitle && <p className="text-sm text-gray-500 font-light mt-1">{subtitle}</p>}
            </div>

            {/* Filter and Search */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search name..."
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>
              <select
                value={directoryDeptFilter}
                onChange={(e) => setDirectoryDeptFilter(e.target.value)}
                className="h-9 px-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white font-medium"
              >
                {depts.map((d: any) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {filteredPeople.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">No personnel found matching criteria.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPeople.map((person: any, pIdx: number) => (
                <div key={person.id || pIdx} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg border border-gray-100 flex flex-col items-center text-center transition-all group">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-blue-100 group-hover:border-[#072A6C] transition-colors bg-slate-100">
                    <img 
                      src={person.image || person.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"} 
                      alt={person.name || person.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-[#072A6C] leading-snug">{person.name || person.title}</h3>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">{person.designation}</p>
                  {person.department && <p className="text-[11px] text-gray-400 mt-0.5">{person.department}</p>}
                  {person.qualification && <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] bg-slate-100 text-gray-600 font-medium">{person.qualification}</span>}
                  {person.description && <p className="text-xs text-gray-500 font-light mt-3 line-clamp-3 text-left w-full">{person.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  // 13. DYNAMIC TABLE
  if (type === "table") {
    const tableData: DynamicTableData | undefined = table || (items && items.length > 0 ? {
      name: title || "Data Table",
      columns: [
        { id: "title", label: "Title / Item", type: "text" },
        { id: "subtitle", label: "Category", type: "badge" },
        { id: "description", label: "Details", type: "text" },
        { id: "link", label: "Action Link", type: "link" }
      ],
      rows: items.map((itm, idx) => ({
        id: itm.id || String(idx),
        enabled: itm.enabled !== false,
        order: idx,
        cells: {
          title: itm.title || "",
          subtitle: itm.subtitle || itm.badge || "",
          description: itm.description || "",
          link: itm.link || ""
        }
      }))
    } : undefined);

    if (!tableData || !tableData.columns || tableData.columns.length === 0) {
      return null;
    }

    const filteredRows = (tableData.rows || []).filter(row => {
      if (!row.enabled) return false;
      if (!tableSearch.trim()) return true;
      const q = tableSearch.toLowerCase();
      return Object.values(row.cells).some(c => String(c).toLowerCase().includes(q));
    });

    return (
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              {badge && <span className="text-xs font-black uppercase tracking-widest text-[#D71920]">{badge}</span>}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C]">{title || tableData.name}</h2>
              {subtitle && <p className="text-sm text-gray-500 font-light mt-1">{subtitle}</p>}
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search table rows..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#072A6C] text-white">
                  {tableData.columns.map((col) => (
                    <th key={col.id} className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] border-r border-white/10 last:border-r-0" style={{ width: col.width }}>
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={tableData.columns.length} className="py-8 text-center text-gray-400 text-xs">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, rIdx) => (
                    <tr key={row.id || rIdx} className="hover:bg-slate-50/70 transition-colors">
                      {tableData.columns.map((col) => {
                        const cellVal = row.cells[col.id] || "";
                        return (
                          <td key={col.id} className="py-3.5 px-4 text-gray-700 font-medium">
                            {col.type === "badge" ? (
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#072A6C] border border-blue-100">
                                {cellVal}
                              </span>
                            ) : col.type === "link" && cellVal ? (
                              <Link to={cellVal} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold hover:underline">
                                <span>Apply Now</span>
                                <ExternalLink size={12} />
                              </Link>
                            ) : (
                              cellVal
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }

  // 14. DOWNLOADS
  if (type === "downloads") {
    return (
      <section className="py-12 md:py-16 bg-[#F7F8FC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {(title || subtitle) && (
            <div className="text-center space-y-2">
              {title && <h2 className="text-2xl font-extrabold text-[#072A6C]">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-500 font-light">{subtitle}</p>}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(items || []).filter(item => item.enabled !== false).map((item, dIdx) => (
              <a
                key={item.id || dIdx}
                href={item.fileUrl || item.link || "#"}
                target="_blank"
                rel="noreferrer"
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#072A6C] group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h4>
                    <p className="text-[10px] text-gray-400">{item.fileSize || "PDF Document"}</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors shrink-0 ml-2" />
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 15. CONTACT FORM
  if (type === "contact-form") {
    return (
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F7F8FC] rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-sm">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              {badge && <span className="text-xs font-black uppercase tracking-widest text-[#D71920]">{badge}</span>}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C]">{title || "Admissions & Enquiry Helpdesk"}</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-light">{subtitle || "Leave your query. Our academic counselor will get in touch with you shortly."}</p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-10 space-y-3 bg-white rounded-2xl p-6 border border-green-100">
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-[#072A6C]">Thank You for Reaching Out!</h4>
                <p className="text-xs text-gray-500">Your enquiry has been received. Our team will contact you within 24 hours.</p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 px-5 py-2 bg-[#072A6C] text-white text-xs font-bold rounded-lg"
                >
                  Submit Another Query
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase text-[10px]">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Full Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase text-[10px]">Mobile Number *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="10-digit mobile"
                      value={contactForm.mobile}
                      onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase text-[10px]">Email Address *</label>
                    <input 
                      type="email" 
                      required
                      placeholder="Email Address"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase text-[10px]">Program of Interest</label>
                    <input 
                      type="text" 
                      placeholder="e.g. B.Tech CSE, MBA, MCA"
                      value={contactForm.program}
                      onChange={(e) => setContactForm({ ...contactForm, program: e.target.value })}
                      className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase text-[10px]">Your Message / Question</label>
                  <textarea 
                    rows={4}
                    placeholder="Enter your query details..."
                    value={contactForm.query}
                    onChange={(e) => setContactForm({ ...contactForm, query: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#072A6C] hover:bg-[#051c4a] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  Submit Enquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 16. CALL TO ACTION (CTA)
  if (type === "cta") {
    return (
      <section className="py-14 md:py-20 bg-gradient-to-r from-[#072A6C] via-[#0b388d] to-[#072A6C] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {badge && <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white/10 text-[#D4AF37]">{badge}</span>}
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">{title || "Empower Your Future with Chalapathi University"}</h2>
          {subtitle && <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to={settings?.buttonLink || "/admissions/apply"}
              className="px-7 py-3.5 bg-[#D4AF37] hover:bg-[#b5952f] text-[#072A6C] font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              {settings?.buttonText || "Apply Now 2026-27"}
              <ChevronRight size={16} />
            </Link>
            {settings?.secondaryButtonText && (
              <Link
                to={settings?.secondaryButtonLink || "/contact"}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl backdrop-blur-md border border-white/20 transition-colors inline-flex items-center gap-2"
              >
                {settings.secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </section>
    );
  }

  // 17. TESTIMONIALS
  if (type === "testimonials") {
    return (
      <section className="py-14 md:py-20 bg-[#F7F8FC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {(title || subtitle) && (
            <div className="text-center max-w-3xl mx-auto space-y-2">
              {title && <h2 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C]">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-500 font-light">{subtitle}</p>}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(items || []).filter(item => item.enabled !== false).map((item, tIdx) => (
              <div key={item.id || tIdx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between space-y-4">
                <Quote size={28} className="text-[#072A6C]/20" />
                <p className="text-xs sm:text-sm text-gray-600 font-light italic leading-relaxed">
                  "{item.description || (item as any).content || ''}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden shrink-0">
                    <img src={item.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#072A6C] leading-none">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.designation || item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // 18. CUSTOM RAW HTML
  if (type === "custom" && (rawHtml || content)) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div dangerouslySetInnerHTML={{ __html: rawHtml || content || "" }} />
        </div>
      </section>
    );
  }

  return null;
};
