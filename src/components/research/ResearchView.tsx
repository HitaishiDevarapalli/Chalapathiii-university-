import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Award, Sparkles, BookOpen, Layers, TrendingUp, FileText, Globe, 
  CheckCircle2, ShieldCheck, Microscope, ExternalLink, Search, 
  Phone, Mail, ArrowRight, ChevronRight, Cpu, Zap, Beaker, Brain,
  Download, Filter, Landmark, User, Calendar, MapPin
} from "lucide-react";
import { 
  DEFAULT_RESEARCH_DATA, 
  ResearchCMSData, 
  ResearchProjectItem, 
  ResearchPublicationItem, 
  ResearchThrustArea 
} from "../admin/ResearchCMS";

interface ResearchViewProps {
  path?: string;
}

export const ResearchView: React.FC<ResearchViewProps> = ({ path = "/research" }) => {
  const [data, setData] = useState<ResearchCMSData>(() => {
    try {
      const saved = localStorage.getItem("chalapathi_research_cms_data");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error reading research CMS data:", e);
    }
    return DEFAULT_RESEARCH_DATA;
  });

  const [activeTab, setActiveTab] = useState<"all" | "thrust" | "projects" | "publications" | "labs" | "phd">(() => {
    const clean = path.toLowerCase().replace(/\/$/, "");
    if (clean.includes("project")) return "projects";
    if (clean.includes("publication")) return "publications";
    if (clean.includes("patent")) return "publications";
    if (clean.includes("thrust")) return "thrust";
    return "all";
  });

  const [pubSearch, setPubSearch] = useState("");
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    mobile: "",
    researchArea: "Artificial Intelligence & ML",
    interestType: "Ph.D. Admission",
    message: ""
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Sync dynamically with localStorage changes (e.g. from AdminPortal)
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem("chalapathi_research_cms_data");
        if (saved) {
          setData(JSON.parse(saved));
        } else {
          setData(DEFAULT_RESEARCH_DATA);
        }
      } catch (e) {
        console.error("Error updating research CMS data:", e);
      }
    };

    window.addEventListener("chalapathi_cms_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("chalapathi_cms_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Update active tab if URL path changes
  useEffect(() => {
    const clean = path.toLowerCase().replace(/\/$/, "");
    if (clean.includes("project")) setActiveTab("projects");
    else if (clean.includes("publication") || clean.includes("patent")) setActiveTab("publications");
    else if (clean.includes("thrust")) setActiveTab("thrust");
  }, [path]);

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setShowEnquiryModal(false);
      setEnquiryForm({
        name: "",
        email: "",
        mobile: "",
        researchArea: "Artificial Intelligence & ML",
        interestType: "Ph.D. Admission",
        message: ""
      });
    }, 2500);
  };

  const filteredPublications = data.publications.filter((p) => {
    const q = pubSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.journal.toLowerCase().includes(q) ||
      p.authors.toLowerCase().includes(q) ||
      p.year.includes(q)
    );
  });

  // Thrust area icon mapping
  const getThrustIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("ai") || t.includes("intelligence") || t.includes("machine") || t.includes("data")) {
      return <Brain className="text-[#072A6C]" size={24} />;
    }
    if (t.includes("energy") || t.includes("grid") || t.includes("solar") || t.includes("power")) {
      return <Zap className="text-[#D4AF37]" size={24} />;
    }
    if (t.includes("iot") || t.includes("sensor") || t.includes("network")) {
      return <Cpu className="text-emerald-600" size={24} />;
    }
    if (t.includes("pharma") || t.includes("bio") || t.includes("medical") || t.includes("drug")) {
      return <Beaker className="text-rose-600" size={24} />;
    }
    return <Layers className="text-indigo-600" size={24} />;
  };

  // Modern research labs data
  const CENTRAL_LABS = [
    {
      title: "HPC & AI Supercomputing Center",
      badge: "GPU Compute Cluster",
      specs: "Dual NVIDIA A100 Workstations • 128-core AMD EPYC Nodes • 10 Gbps Interconnect",
      desc: "Dedicated to training high-parameter neural networks, deep learning architectures, and high-resolution medical image diagnostics.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&fit=crop"
    },
    {
      title: "Decentralized IoT & Cyber-Physical Testbed",
      badge: "Edge Telemetry Facility",
      specs: "LoRaWAN Base Stations • Software Defined Radios • Industrial Sensor Test benches",
      desc: "Prototyping self-healing wireless sensor mesh networks, automated smart agriculture monitors, and rapid disaster warning beacons.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&fit=crop"
    },
    {
      title: "Renewable Energy & Smart Microgrid Testbed",
      badge: "Clean Tech & EV Lab",
      specs: "Solar PV Emulators • 10kW Micro-Inverter Test Benches • Battery Management Systems",
      desc: "Investigating hybrid renewable integration, real-time power fluctuation damping algorithms, and electric vehicle battery charging topologies.",
      image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&fit=crop"
    },
    {
      title: "Pharmaceutical Formulation & Analytical Lab",
      badge: "Nanotech & Drug Delivery",
      specs: "High-Performance Liquid Chromatography (HPLC) • UV-Vis Spectrophotometer • Clean Room Class 10,000",
      desc: "Accelerating novel chemical compound synthesis, bioavailability enhancement testing, and phyto-pharmaceutical formulation screening.",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&fit=crop"
    }
  ];

  return (
    <div className="space-y-12 text-left font-[var(--font-poppins)]">
      {/* 1. HERO BANNER: Royal Navy with Gold Accents */}
      <div className="bg-[#072A6C] rounded-3xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden shadow-xl border border-blue-900/40">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Hero Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
              <Microscope size={15} /> Research & Innovation Hub
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              {data.heroTitle}
            </h1>

            <p className="text-sm md:text-base font-semibold text-blue-100 max-w-2xl leading-relaxed">
              {data.heroSubtitle}
            </p>

            <p className="text-xs md:text-sm text-blue-200/90 font-light max-w-2xl leading-relaxed">
              {data.heroDesc}
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => {
                  setActiveTab("projects");
                  document.getElementById("research-content-block")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-5 py-3 bg-[#D4AF37] hover:bg-[#C9A84C] text-[#072A6C] font-black text-xs rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer border-none"
              >
                <FileText size={15} /> Sponsored Projects ({data.projects.length})
              </button>

              <button
                onClick={() => {
                  setActiveTab("publications");
                  document.getElementById("research-content-block")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/25 transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <BookOpen size={15} /> Publications & Patents ({data.publications.length})
              </button>

              <button
                onClick={() => setShowEnquiryModal(true)}
                className="px-5 py-3 bg-transparent hover:bg-blue-900/50 text-[#D4AF37] font-bold text-xs rounded-xl border border-[#D4AF37]/50 transition-all uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <Sparkles size={15} /> Ph.D. Admissions & Grants
              </button>
            </div>
          </div>

          {/* Laboratory Graphic Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 group">
              <img
                src={data.heroImage || "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&fit=crop"}
                alt="Chalapathi Research Laboratory"
                className="w-full h-64 sm:h-72 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#072A6C] via-transparent to-transparent opacity-90 flex flex-col justify-end p-5">
                <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest">
                  ADVANCED RESEARCH FACILITY
                </span>
                <span className="text-white font-black text-sm uppercase tracking-wide">
                  Chalapathi Center for Multidisciplinary Innovations
                </span>
                <span className="text-blue-200 text-[11px] font-light mt-0.5">
                  Supporting 100+ Scholars & 45+ Sponsored Grants
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KEY RESEARCH METRICS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((st, idx) => (
          <div 
            key={idx}
            className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border-l-4 border-l-[#D4AF37] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Metric 0{idx + 1}
              </span>
              <div className="p-2 bg-blue-50 text-[#072A6C] rounded-xl">
                {idx === 0 && <FileText size={18} />}
                {idx === 1 && <BookOpen size={18} />}
                {idx === 2 && <Award size={18} />}
                {idx === 3 && <Microscope size={18} />}
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#072A6C] tracking-tight">
                {st.value}
              </div>
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mt-1">
                {st.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. SUBTAB FILTER NAVIGATION */}
      <div id="research-content-block" className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-gray-200">
          {[
            { id: "all" as const, label: "🏛️ Complete Ecosystem", count: null },
            { id: "thrust" as const, label: "🔬 Thrust Areas", count: data.thrustAreas.length },
            { id: "projects" as const, label: "📑 Sponsored Projects", count: data.projects.length },
            { id: "publications" as const, label: "📜 Publications & Patents", count: data.publications.length },
            { id: "labs" as const, label: "🏢 Central Laboratories", count: CENTRAL_LABS.length },
            { id: "phd" as const, label: "🎓 Ph.D. & Scholar Guidelines", count: null }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-none ${
                  isActive
                    ? "bg-[#072A6C] text-white shadow-md shadow-[#072A6C]/25"
                    : "bg-white text-gray-700 hover:bg-slate-50 border border-gray-200/80"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? "bg-[#D4AF37] text-[#072A6C]" : "bg-gray-100 text-gray-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SECTION: RESEARCH THRUST AREAS */}
      {(activeTab === "all" || activeTab === "thrust") && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200 pb-3">
            <div>
              <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5">
                <Microscope size={14} /> CORE SPECIALIZATIONS
              </span>
              <h2 className="text-xl md:text-2xl font-black text-[#072A6C] uppercase tracking-wide">
                Research Thrust Areas & Centers of Excellence
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Interdisciplinary domains recognized by DST, AICTE & Global Partners
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.thrustAreas.map((area, idx) => (
              <div 
                key={idx}
                className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-[#072A6C]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-slate-50 group-hover:bg-blue-50 rounded-2xl transition-colors">
                      {getThrustIcon(area.title)}
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 bg-blue-50 text-[#072A6C] rounded-full uppercase tracking-wider">
                      Thrust 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#072A6C] group-hover:text-blue-900 transition-colors">
                    {area.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    {area.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 size={13} /> Active Research & Labs
                  </span>
                  <span className="text-[#072A6C] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Explore <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SECTION: SPONSORED RESEARCH PROJECTS & GRANTS */}
      {(activeTab === "all" || activeTab === "projects") && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200 pb-3">
            <div>
              <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5">
                <FileText size={14} /> EXTERNAL RESEARCH GRANTS
              </span>
              <h2 className="text-xl md:text-2xl font-black text-[#072A6C] uppercase tracking-wide">
                Sponsored Research Projects & National Grants
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                ⭐ ₹1.09+ Crores Active Funding
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {data.projects.map((proj, pIdx) => (
              <div 
                key={proj.id || pIdx}
                className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left side details */}
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-[#072A6C] text-white rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {proj.agency}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-gray-600 rounded-md text-[11px] font-semibold">
                      Grant Period: {proj.year}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[11px] font-bold">
                      ● Active Project
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-[#072A6C] leading-snug">
                    {proj.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <User size={14} className="text-[#D4AF37]" />
                    <span className="font-semibold">Principal Investigator:</span>
                    <span className="text-gray-900 font-bold">{proj.investigator}</span>
                  </div>
                </div>

                {/* Right side amount */}
                <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between md:justify-center p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl gap-1">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest">
                    Sanctioned Grant
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#072A6C]">
                    {proj.amount}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    National Funding Agency
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SECTION: HIGH-IMPACT PUBLICATIONS & PATENTS */}
      {(activeTab === "all" || activeTab === "publications") && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-3">
            <div>
              <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen size={14} /> PEER-REVIEWED SCHOLARSHIP
              </span>
              <h2 className="text-xl md:text-2xl font-black text-[#072A6C] uppercase tracking-wide">
                High-Impact Publications & Intellectual Property (Patents)
              </h2>
            </div>

            {/* Publication Search Bar */}
            <div className="relative w-full md:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={pubSearch}
                onChange={(e) => setPubSearch(e.target.value)}
                placeholder="Search title, author, Scopus..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#072A6C] outline-none"
              />
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredPublications.length > 0 ? (
              filteredPublications.map((pub, idx) => (
                <div 
                  key={pub.id || idx}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-[#072A6C] rounded-md text-[10px] font-black uppercase tracking-wider border border-blue-200">
                        {pub.journal}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[11px] font-bold">
                        Year: {pub.year}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-[#072A6C] leading-snug">
                      {pub.title}
                    </h4>

                    <p className="text-xs text-gray-600 font-light">
                      <span className="font-semibold text-gray-800">Authors:</span> {pub.authors}
                    </p>
                  </div>

                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-50 hover:bg-[#072A6C] hover:text-white text-[#072A6C] font-bold text-xs rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>View Paper / DOI</span>
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200 text-gray-500 text-xs">
                No publications found matching "{pubSearch}".
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. SECTION: CENTRAL LABORATORIES & INFRASTRUCTURE */}
      {(activeTab === "all" || activeTab === "labs") && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-gray-200 pb-3">
            <div>
              <span className="text-[11px] font-black text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5">
                <Landmark size={14} /> STATE-OF-THE-ART FACILITIES
              </span>
              <h2 className="text-xl md:text-2xl font-black text-[#072A6C] uppercase tracking-wide">
                Specialized Research Laboratories & Equipment
              </h2>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Open 24/7 for Doctoral Scholars & Faculty Investigators
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CENTRAL_LABS.map((lab, lIdx) => (
              <div 
                key={lIdx}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-44 sm:h-52 relative overflow-hidden">
                  <img
                    src={lab.image}
                    alt={lab.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-[#072A6C]/90 text-white rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-sm">
                    {lab.badge}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-base font-black text-[#072A6C]">
                      {lab.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-light">
                      {lab.desc}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-gray-100 text-[11px] text-gray-600 font-mono">
                    <span className="font-bold text-[#072A6C] block mb-0.5">Key Instrumentation:</span>
                    {lab.specs}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. SECTION: PHD & SCHOLAR GUIDELINES */}
      {(activeTab === "all" || activeTab === "phd") && (
        <div className="space-y-6 animate-fade-in pt-4">
          <div className="bg-gradient-to-br from-[#072A6C] to-blue-900 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-blue-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="px-3 py-1 bg-[#D4AF37] text-[#072A6C] rounded-full text-[10px] font-black uppercase tracking-widest inline-block">
                  DOCTORAL PROGRAMS (Ph.D.) 2026 - 2027
                </span>

                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  Advance Your Scientific Curiosity as a Doctoral Scholar
                </h2>

                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-light">
                  Chalapathi University offers Full-Time and Part-Time Ph.D. programs across Engineering, Pharmacy, Management, and Basic Sciences. Scholars receive University Research Fellowships (URF), seed funding grants, dedicated lab allocations, and full intellectual property patent filing support.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-blue-100">
                    <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                    <span>Monthly Stipend for Qualified Full-Time Scholars</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-100">
                    <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                    <span>100% University Funding for Patent Applications</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-100">
                    <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                    <span>International Conference Travel Grant Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-100">
                    <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                    <span>Direct Access to DST & AICTE Research Labs</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowEnquiryModal(true)}
                    className="px-6 py-3 bg-[#D4AF37] hover:bg-[#C9A84C] text-[#072A6C] font-black text-xs rounded-xl shadow-lg transition-all uppercase tracking-wider cursor-pointer border-none"
                  >
                    Apply for Ph.D. / Research Fellowship
                  </button>

                  <a
                    href="mailto:research@chalapathi.ac.in"
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all uppercase tracking-wider flex items-center gap-2"
                  >
                    <Mail size={14} /> Contact Dean (R&D)
                  </a>
                </div>
              </div>

              {/* Research Directorate Info Card */}
              <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4 text-left">
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest block">
                  OFFICE OF THE DEAN (R&D)
                </span>
                <div>
                  <h4 className="text-sm font-black text-white">Dean - Research & Innovation</h4>
                  <p className="text-xs text-blue-200">Chalapathi University Directorate of R&D</p>
                </div>
                <div className="space-y-2 text-xs text-blue-100 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-[#D4AF37]" />
                    <a href="mailto:research@chalapathi.ac.in" className="hover:underline text-white font-medium">
                      research@chalapathi.ac.in
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#D4AF37]" />
                    <a href="tel:+919505505566" className="hover:underline text-white font-medium">
                      +91 95055 05566 / Ext. 204
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={13} className="text-[#D4AF37]" />
                    <span>Research Block, Level 3, Campus</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. BOTTOM NAVIGATION & RESEARCH HELPDESK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {/* Quick Navigation Card */}
        <div className="bg-[#072A6C] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm mb-4 uppercase tracking-wider text-left text-white">
              University Ecosystem Navigation
            </h3>
            <ul className="grid grid-cols-2 gap-3 text-xs text-blue-100/90 text-left font-medium">
              <li>
                <Link to="/about/genesis" className="hover:text-white transition-colors flex items-center justify-between group">
                  About University <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-white transition-colors flex items-center justify-between group">
                  Academic Programs <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:text-white transition-colors flex items-center justify-between group">
                  Enrollment & Fees <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link to="/placements" className="hover:text-white transition-colors flex items-center justify-between group">
                  Placements & Career <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li className="col-span-2">
                <Link to="/contact" className="hover:text-white transition-colors flex items-center justify-between group text-[#D4AF37] font-bold">
                  Contact Support <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Research Support Helpdesk Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div className="space-y-1.5 sm:max-w-[65%]">
            <h3 className="font-black text-sm text-[#072A6C] uppercase tracking-wider">
              Research & Innovation Helpdesk
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Have questions regarding patent filings, sponsored project proposals, or Ph.D. fellowship admissions?
            </p>
          </div>
          <button 
            onClick={() => setShowEnquiryModal(true)}
            className="h-11 px-5 bg-[#D4AF37] hover:bg-[#C9A84C] text-[#072A6C] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 outline-none border-none cursor-pointer shadow-sm uppercase tracking-wider"
          >
            <Sparkles size={14} /> Scholar Enquiry
          </button>
        </div>
      </div>

      {/* 10. ENQUIRY MODAL */}
      {showEnquiryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative animate-scale-up space-y-4 text-left">
            <button 
              onClick={() => setShowEnquiryModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer outline-none text-base"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest block">
                DIRECTORATE OF RESEARCH & INNOVATION
              </span>
              <h3 className="text-lg font-black text-[#072A6C] uppercase tracking-wide">
                Research & Ph.D. Inquiry
              </h3>
              <p className="text-xs text-gray-400 font-light mt-0.5">
                Submit your research interests to connect with our doctoral advisors and faculty investigators.
              </p>
            </div>

            {enquirySuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black text-emerald-900">Inquiry Submitted Successfully!</h4>
                <p className="text-xs text-emerald-700">
                  Our Dean (R&D) office will review your research profile and get in touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3.5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={enquiryForm.name}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                      placeholder="e.g. Dr. / Scholar Name" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Mobile Number *
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={enquiryForm.mobile}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, mobile: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                      placeholder="10-digit phone number" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    required
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                    placeholder="name@domain.com" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Type of Interest
                    </label>
                    <select
                      value={enquiryForm.interestType}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, interestType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C] bg-white"
                    >
                      <option value="Ph.D. Admission (Full-Time)">Ph.D. Admission (Full-Time)</option>
                      <option value="Ph.D. Admission (Part-Time)">Ph.D. Admission (Part-Time)</option>
                      <option value="Sponsored Research Project">Sponsored Research Project</option>
                      <option value="Industry R&D Collaboration">Industry R&D Collaboration</option>
                      <option value="Patent / Tech Transfer">Patent / Tech Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Primary Thrust Area
                    </label>
                    <select
                      value={enquiryForm.researchArea}
                      onChange={(e) => setEnquiryForm({ ...enquiryForm, researchArea: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C] bg-white"
                    >
                      {data.thrustAreas.map((t, idx) => (
                        <option key={idx} value={t.title}>{t.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Research Brief / Message *
                  </label>
                  <textarea 
                    required
                    rows={3}
                    value={enquiryForm.message}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C] resize-none" 
                    placeholder="Briefly state your academic qualifications, proposed research topic, or sponsorship goals..." 
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#C9A84C] text-[#072A6C] font-black text-xs rounded-xl transition-colors uppercase tracking-wider mt-3 cursor-pointer border-none shadow-md"
                >
                  Submit Research Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResearchView;
