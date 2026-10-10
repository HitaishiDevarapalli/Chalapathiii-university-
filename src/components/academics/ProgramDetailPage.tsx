"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  Clock,
  ArrowRight,
  Download,
  Mail,
  ChevronRight,
  Search,
  Calendar,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import {
  FullProgramData,
  SectionMeta,
  DEFAULT_PROGRAM_SECTIONS,
  getProgramFullData
} from "../../data/programDetailsData";
import { useData } from "../../context/DataContext";

interface ProgramDetailPageProps {
  slug: string;
  defaultData?: any;
}

export default function ProgramDetailPage({ slug, defaultData }: ProgramDetailPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleParam = searchParams.get("tab") || searchParams.get("module");
  const { programs } = useData();

  // Find base program if available in programsData
  const matchedProgram = useMemo(() => {
    return programs?.find(p => p.slug === slug);
  }, [programs, slug]);

  // Load comprehensive program data
  const programData: FullProgramData = useMemo(() => {
    const customKey = `custom_program_data_${slug}`;
    const saved = localStorage.getItem(customKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return getProgramFullData(
      slug,
      matchedProgram?.title,
      matchedProgram?.department,
      (matchedProgram as any)?.school
    );
  }, [slug, matchedProgram]);

  // Section ordering & configuration
  const [sections] = useState<SectionMeta[]>(() => {
    const saved = localStorage.getItem(`program_sections_order_${slug}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PROGRAM_SECTIONS;
  });

  const enabledSections = useMemo(() => {
    return sections.filter(s => s.enabled);
  }, [sections]);

  // Active Tab: Defaults to first section ("about")
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (moduleParam && enabledSections.some(s => s.id === moduleParam)) {
      return moduleParam;
    }
    return enabledSections[0]?.id || "about";
  });

  // Sync with URL parameter
  useEffect(() => {
    if (moduleParam && enabledSections.some(s => s.id === moduleParam)) {
      setActiveTab(moduleParam);
    }
  }, [moduleParam, enabledSections]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId }, { replace: true });
    // Smooth scroll into content on mobile
    if (window.innerWidth < 768) {
      const contentEl = document.getElementById("academic-content-pane");
      if (contentEl) {
        contentEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Section-specific sub-states
  const [peoTab, setPeoTab] = useState<"peos" | "pos" | "psos">("peos");
  const [syllabusSem, setSyllabusSem] = useState<number>(0);
  const [facultyFilter, setFacultyFilter] = useState<string>("All");
  const [facultySearch, setFacultySearch] = useState<string>("");

  // Filtered faculty list
  const filteredFaculty = useMemo(() => {
    return (programData.facultyList || []).filter(f => {
      const matchesSearch =
        f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
        f.specialization.toLowerCase().includes(facultySearch.toLowerCase()) ||
        f.qualification.toLowerCase().includes(facultySearch.toLowerCase());
      if (!matchesSearch) return false;
      if (facultyFilter === "All") return true;
      if (facultyFilter === "Professor")
        return (
          f.designation.toLowerCase().includes("professor") &&
          !f.designation.toLowerCase().includes("assistant") &&
          !f.designation.toLowerCase().includes("associate")
        );
      if (facultyFilter === "Associate")
        return f.designation.toLowerCase().includes("associate");
      if (facultyFilter === "Assistant")
        return f.designation.toLowerCase().includes("assistant");
      return true;
    });
  }, [programData.facultyList, facultySearch, facultyFilter]);

  // Compute clean tab title for "about"
  const getTabLabel = (sec: SectionMeta) => {
    if (sec.id === "about") {
      const cleanShort = programData.shortName
        ? programData.shortName.replace(/B\.Tech\.?\s*/i, "").replace(/M\.Tech\.?\s*/i, "").trim()
        : "Program";
      return `About ${cleanShort || "Program"}`;
    }
    return sec.title;
  };

  // Active section metadata
  const currentSection = useMemo(() => {
    return enabledSections.find(s => s.id === activeTab) || enabledSections[0];
  }, [enabledSections, activeTab]);

  return (
    <div className="min-h-screen bg-[#072A6C]/5 text-slate-800 font-sans selection:bg-[#D4AF37] selection:text-[#072A6C]">
      
      {/* ═══════════════════════════════════════════════════════════════════
          1. HEADER & HERO BANNER (MATCHING WEBSITE THEME)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-[#072A6C] via-[#093582] to-[#072A6C] text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20 relative overflow-hidden">
        {/* Subtle geometric depth textures */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[600px] h-[160px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-4 text-center relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center justify-center gap-2 text-xs text-blue-200 font-medium overflow-x-auto scrollbar-none pb-1">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <ChevronRight size={12} className="text-blue-300/60 shrink-0" />
            <Link to="/academics" className="hover:text-[#D4AF37] transition-colors">Academics</Link>
            <ChevronRight size={12} className="text-blue-300/60 shrink-0" />
            <span className="text-blue-200">{programData.department}</span>
            <ChevronRight size={12} className="text-[#D4AF37] shrink-0" />
            <span className="text-[#D4AF37] font-semibold truncate">{programData.title}</span>
          </nav>

          {/* Program Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm max-w-4xl mx-auto">
            {programData.title}
          </h1>

          {/* Red/Maroon Underline Accent Bar (Exactly matching user reference) */}
          <div className="flex justify-center pt-1 pb-1">
            <div className="h-1 w-20 sm:w-24 bg-[#8B1D2C] rounded-full shadow-sm" />
          </div>

          {/* Clean Badges (Department & Duration) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20">
              <Building size={13} className="text-[#D4AF37]" />
              <span>{programData.department}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20">
              <Clock size={13} className="text-[#D4AF37]" />
              <span>Duration: {programData.duration}</span>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. TWO-COLUMN VERTICAL LAYOUT (SIDEBAR + CONTENT PANE)
      ═══════════════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
          
          {/* ─────────────────────────────────────────────────────────────
              LEFT COLUMN: VERTICAL TABS SIDEBAR
          ───────────────────────────────────────────────────────────── */}
          <aside className="w-full md:w-72 lg:w-80 shrink-0">
            <div className="bg-transparent md:sticky md:top-24 space-y-2.5">
              
              {/* Vertical Stack of Tabs */}
              {enabledSections.map((sec) => {
                const isActive = activeTab === sec.id;
                const label = getTabLabel(sec);

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => handleTabChange(sec.id)}
                    className={`w-full group flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer text-left ${
                      isActive
                        ? "bg-[#8B1D2C] text-white font-bold shadow-md shadow-[#8B1D2C]/25 border-l-4 border-[#F59E0B]"
                        : "bg-white text-slate-800 font-semibold border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 hover:shadow-xs"
                    }`}
                  >
                    <span className="text-xs sm:text-sm tracking-normal leading-snug flex-1 pr-2">
                      {label}
                    </span>
                    <span
                      className={`text-sm shrink-0 transition-transform duration-200 ${
                        isActive
                          ? "text-white font-bold translate-x-0.5"
                          : "text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1"
                      }`}
                    >
                      →
                    </span>
                  </button>
                );
              })}

            </div>
          </aside>

          {/* ─────────────────────────────────────────────────────────────
              RIGHT COLUMN: ACTIVE SECTION CONTENT CONTAINER
          ───────────────────────────────────────────────────────────── */}
          <div
            id="academic-content-pane"
            className="flex-1 min-w-0 w-full bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm min-h-[620px] text-left relative"
          >
            {/* Top Navy Pill Badge (e.g., "About CSE", "HOD Message") */}
            <div className="mb-6">
              <div className="inline-block bg-[#072A6C] text-white px-5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs">
                {getTabLabel(currentSection)}
              </div>
            </div>

            {/* Dynamic Section Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="space-y-6"
              >
                {renderSectionBody(
                  activeTab,
                  programData,
                  peoTab,
                  setPeoTab,
                  syllabusSem,
                  setSyllabusSem,
                  facultyFilter,
                  setFacultyFilter,
                  facultySearch,
                  setFacultySearch,
                  filteredFaculty
                )}
              </motion.div>
            </AnimatePresence>

          </div>

        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          3. BOTTOM CTA SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#072A6C] text-white py-12 px-4 text-center mt-12 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-3">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black">
            Ready to Enroll in {programData.title}?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto font-normal leading-relaxed">
            Take the first step toward academic excellence and industry-leading career placements.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <Link
              to="/admissions/apply"
              className="h-10 px-6 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#072A6C] text-xs font-black uppercase tracking-wider rounded-xl inline-flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              Apply Online <ArrowRight size={13} />
            </Link>
            <Link
              to="/admissions"
              className="h-10 px-6 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 border border-white/20 transition-colors cursor-pointer"
            >
              Admission Guidelines
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTION: RENDERS CLEAN, PROFESSIONAL, VERTICALLY ALIGNED CONTENT
// ═══════════════════════════════════════════════════════════════════════════
function renderSectionBody(
  sectionId: string,
  programData: FullProgramData,
  peoTab: "peos" | "pos" | "psos",
  setPeoTab: (t: "peos" | "pos" | "psos") => void,
  syllabusSem: number,
  setSyllabusSem: (s: number) => void,
  facultyFilter: string,
  setFacultyFilter: (f: string) => void,
  facultySearch: string,
  setFacultySearch: (s: string) => void,
  filteredFaculty: any[]
) {
  switch (sectionId) {
    
    // ──────────────── 01. ABOUT PROGRAM ────────────────
    case "about":
      return (
        <div className="space-y-6 text-slate-700">
          <div className="text-sm sm:text-base leading-relaxed space-y-4">
            <p>{programData.about.summary}</p>
          </div>

          {/* Highlights */}
          {programData.about.highlights && programData.about.highlights.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#072A6C] uppercase tracking-wide">
                Key Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {programData.about.highlights.map((h, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-700 flex items-start gap-2.5"
                  >
                    <span className="text-[#072A6C] font-bold mt-0.5">•</span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Educational Mission / Objectives */}
          {programData.about.objectives && programData.about.objectives.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#072A6C] uppercase tracking-wide">
                Program Objectives
              </h3>
              <div className="space-y-2">
                {programData.about.objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-700 flex items-start gap-2.5"
                  >
                    <span className="text-[#8B1D2C] font-bold mt-0.5">→</span>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Career Pathways */}
          {programData.careerRoles && programData.careerRoles.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#072A6C] uppercase tracking-wide">
                Career Pathways
              </h3>
              <div className="flex flex-wrap gap-2">
                {programData.careerRoles.map((role, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-[#072A6C] bg-slate-100 px-3.5 py-1.5 rounded-lg border border-slate-200"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    // ──────────────── 02. HOD MESSAGE ────────────────
    case "hodMessage":
      return (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="w-20 h-20 rounded-2xl bg-[#072A6C] text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-sm">
              {programData.hodMessage.hodName
                .split(" ")
                .map(n => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold text-[#072A6C]">
                {programData.hodMessage.hodName}
              </h3>
              <p className="text-xs font-semibold text-[#8B1D2C]">
                {programData.hodMessage.designation}
              </p>
              <p className="text-xs text-slate-600">
                {programData.hodMessage.qualification}
              </p>
              {programData.hodMessage.email && (
                <a
                  href={`mailto:${programData.hodMessage.email}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#072A6C] hover:underline pt-2"
                >
                  <Mail size={13} /> {programData.hodMessage.email}
                </a>
              )}
            </div>
          </div>

          <div className="space-y-3 text-slate-700 text-sm sm:text-base leading-relaxed">
            <p className="italic border-l-4 border-[#072A6C] pl-4 py-1 text-slate-800">
              "{programData.hodMessage.message}"
            </p>
            <p className="text-xs sm:text-sm text-slate-600 pt-2">
              Our department provides continuous guidance, state-of-the-art laboratory infrastructure, and comprehensive training to ensure every student reaches their highest potential.
            </p>
          </div>
        </div>
      );

    // ──────────────── 03. VISION & MISSION ────────────────
    case "visionMission":
      return (
        <div className="space-y-6">
          {/* Vision */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-[#072A6C] uppercase tracking-wide">
              Department Vision
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {programData.visionMission.vision}
            </p>
          </div>

          {/* Mission */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-[#072A6C] uppercase tracking-wide">
              Department Mission
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              {programData.visionMission.mission.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#072A6C] mt-2 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Values */}
          {programData.visionMission.coreValues && programData.visionMission.coreValues.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h3 className="text-sm font-bold text-[#072A6C] uppercase tracking-wide">
                Institutional Core Values
              </h3>
              <div className="flex flex-wrap gap-2">
                {programData.visionMission.coreValues.map((v, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    // ──────────────── 04. PEOS, POS & PSOS ────────────────
    case "peoPoPso":
      return (
        <div className="space-y-6">
          <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
            {[
              { id: "peos", label: "Program Educational Objectives (PEOs)" },
              { id: "pos", label: "Program Outcomes (POs)" },
              { id: "psos", label: "Program Specific Outcomes (PSOs)" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPeoTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  peoTab === tab.id
                    ? "bg-[#072A6C] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {peoTab === "peos" &&
              programData.peoPoPso.peos.map(item => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
                >
                  <span className="text-xs font-bold text-[#072A6C] block font-mono">
                    {item.id}: {item.title}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}

            {peoTab === "pos" &&
              programData.peoPoPso.pos.map(item => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
                >
                  <span className="text-xs font-bold text-[#072A6C] block font-mono">
                    {item.id}: {item.title}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}

            {peoTab === "psos" &&
              programData.peoPoPso.psos.map(item => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1"
                >
                  <span className="text-xs font-bold text-[#072A6C] block font-mono">
                    {item.id}: {item.title}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
          </div>
        </div>
      );

    // ──────────────── 05. FACULTY DIRECTORY ────────────────
    case "faculty":
      return (
        <div className="space-y-6">
          {/* Search and filter controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search faculty by name or area..."
                value={facultySearch}
                onChange={e => setFacultySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#072A6C]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {["All", "Professor", "Associate", "Assistant"].map(flt => (
                <button
                  key={flt}
                  onClick={() => setFacultyFilter(flt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    facultyFilter === flt
                      ? "bg-[#072A6C] text-white shadow-2xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          {/* Faculty Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFaculty.map((f, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#072A6C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {f.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#072A6C] truncate leading-tight">
                        {f.name}
                      </h4>
                      <span className="text-[11px] text-[#8B1D2C] font-semibold block truncate">
                        {f.designation}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p>
                      <strong>Qual:</strong> {f.qualification}
                    </p>
                    <p>
                      <strong>Area:</strong> {f.specialization}
                    </p>
                    <p>
                      <strong>Exp:</strong> {f.experience}
                    </p>
                  </div>
                </div>
                <div className="pt-2.5 border-t border-slate-100 text-xs">
                  <a
                    href={`mailto:${f.email}`}
                    className="text-[#072A6C] hover:underline font-medium flex items-center gap-1.5"
                  >
                    <Mail size={12} /> {f.email}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {filteredFaculty.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
              No faculty members found matching your search.
            </div>
          )}
        </div>
      );

    // ──────────────── 06. PLACEMENTS ────────────────
    case "placements":
      return (
        <div className="space-y-6">
          {/* Metric Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                Highest Package
              </span>
              <span className="text-2xl font-black text-[#072A6C] mt-1 block">
                {programData.placements.highestPackage}
              </span>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                Average Package
              </span>
              <span className="text-2xl font-black text-[#072A6C] mt-1 block">
                {programData.placements.averagePackage}
              </span>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                Placement Rate
              </span>
              <span className="text-2xl font-black text-[#8B1D2C] mt-1 block">
                {programData.placements.placementRate}
              </span>
            </div>
          </div>

          {/* Top Recruiters */}
          {programData.placements.topRecruiters && programData.placements.topRecruiters.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#072A6C] uppercase tracking-wide">
                Key Recruiting Partners
              </h3>
              <div className="flex flex-wrap gap-2">
                {programData.placements.topRecruiters.map((comp, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
                  >
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Placed Students */}
          {programData.placements.placedStudents && programData.placements.placedStudents.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-[#072A6C] uppercase tracking-wide">
                Recent Placement Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {programData.placements.placedStudents.map((s, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1"
                  >
                    <span className="text-xs font-bold text-[#072A6C] block">
                      {s.name}
                    </span>
                    <span className="text-xs font-semibold text-[#8B1D2C] block">
                      {s.company}
                    </span>
                    <span className="text-xs font-bold text-slate-700 block">
                      {s.package}
                    </span>
                    <span className="text-[11px] text-slate-500 block">{s.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    // ──────────────── 07. INFRASTRUCTURE & LABS ────────────────
    case "labs":
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programData.laboratories.map((lab, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-bold text-[#072A6C]">{lab.name}</h3>
                  <span className="text-[10px] bg-[#072A6C]/10 text-[#072A6C] font-bold px-2 py-0.5 rounded font-mono shrink-0">
                    {lab.capacity}
                  </span>
                </div>

                {lab.equipment && lab.equipment.length > 0 && (
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold uppercase block mb-1">
                      Equipment & Workstations
                    </span>
                    <ul className="space-y-1">
                      {lab.equipment.map((eq, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#072A6C]" /> {eq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lab.software && lab.software.length > 0 && (
                  <div>
                    <span className="text-[11px] text-slate-500 font-bold uppercase block mb-1">
                      Software Tools
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {lab.software.map((sw, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded"
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );

    // ──────────────── 08. ACHIEVEMENTS ────────────────
    case "achievements":
      return (
        <div className="space-y-3">
          {programData.achievements.map((ach, i) => (
            <div
              key={i}
              className="p-4 bg-slate-50 border-l-4 border-[#8B1D2C] rounded-r-xl space-y-1"
            >
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#072A6C]">
                  {ach.title}
                </h3>
                <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">
                  {ach.year}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{ach.desc}</p>
            </div>
          ))}
        </div>
      );

    // ──────────────── 09. SYLLABUS & ACADEMIC CALENDAR ────────────────
    case "syllabus":
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs sm:text-sm font-bold text-[#072A6C] block">
                {programData.syllabus.regulation}
              </span>
              <span className="text-[11px] text-slate-500">
                Choice Based Credit System (CBCS) & Outcome-Based Education (OBE)
              </span>
            </div>
            <div className="flex gap-2">
              <a
                href={programData.syllabus.curriculumPdfUrl || "#"}
                onClick={e => {
                  if (
                    !programData.syllabus.curriculumPdfUrl ||
                    programData.syllabus.curriculumPdfUrl === "#"
                  ) {
                    e.preventDefault();
                    alert(`Downloading syllabus structure for ${programData.title}.`);
                  }
                }}
                className="px-3.5 py-2 bg-[#072A6C] hover:bg-[#0B3D91] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download size={13} /> Syllabus PDF
              </a>
              <Link
                to="/academics/calendar"
                className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-[#072A6C] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Calendar size={13} /> Academic Calendar
              </Link>
            </div>
          </div>

          {/* Semester Breakdown */}
          {programData.syllabus.semesters && programData.syllabus.semesters.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {programData.syllabus.semesters.map((sem, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSyllabusSem(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      syllabusSem === idx
                        ? "bg-[#072A6C] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {sem.semNumber} ({sem.credits} Credits)
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#072A6C] text-white uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="py-2.5 px-4">Course Code</th>
                      <th className="py-2.5 px-4">Course Title</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4 text-center">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {programData.syllabus.semesters[syllabusSem]?.subjects.map(
                      (sub, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-mono font-bold text-[#072A6C]">
                            {sub.code}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-slate-800">
                            {sub.name}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {sub.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-center text-[#8B1D2C] font-mono">
                            {sub.credits}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );

    // ──────────────── 10. DEPARTMENT LIBRARY ────────────────
    case "library":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
              Physical Holdings
            </span>
            <div className="space-y-1 text-xs text-slate-700">
              <p>
                Volumes: <strong className="text-[#072A6C]">{programData.library.volumesCount}</strong>
              </p>
              <p>
                Titles: <strong className="text-[#072A6C]">{programData.library.titlesCount}</strong>
              </p>
              <p>
                National Journals: <strong className="text-[#072A6C]">{programData.library.nationalJournals}</strong>
              </p>
              <p>
                International Journals: <strong className="text-[#072A6C]">{programData.library.internationalJournals}</strong>
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
              Digital Subscriptions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {programData.library.digitalAccess.map((d, i) => (
                <span
                  key={i}
                  className="text-[11px] font-semibold bg-white border border-slate-200 text-[#072A6C] px-2.5 py-1 rounded"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
              E-Resources
            </span>
            <ul className="space-y-1 text-xs text-slate-700">
              {programData.library.eResources.map((res, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#072A6C] font-bold">•</span>
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    // ──────────────── 11. BEST PRACTICES ────────────────
    case "bestPractices":
      return (
        <div className="space-y-4">
          {(programData.bestPractices || [
            {
              title: "Industry-Driven Project-Based Pedagogy",
              description: "Mandatory practical project modules each semester in partnership with leading technology corporations.",
              keyPoints: [
                "Continuous project reviews by industry panels",
                "Integration of open-source tooling and version control",
                "Participation in national hackathons and symposiums"
              ],
              outcomes: "Accelerated career preparedness and outstanding campus placements."
            },
            {
              title: "Comprehensive Student Mentorship Framework",
              description: "Dedicated faculty mentorship guiding academic progression, research publications, and career pathways.",
              keyPoints: [
                "1:15 faculty-to-student counseling ratio",
                "Remedial and advanced learning tracks",
                "Alumni guest lecture series each term"
              ],
              outcomes: "Consistently high graduation rates and university ranks."
            }
          ]).map((bp, i) => (
            <div key={i} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <h3 className="text-sm font-bold text-[#072A6C]">{bp.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{bp.description}</p>
              {bp.keyPoints && bp.keyPoints.length > 0 && (
                <ul className="space-y-1 text-xs text-slate-700 pl-2">
                  {bp.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#8B1D2C] font-bold">•</span>
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              )}
              {bp.outcomes && (
                <div className="pt-2 border-t border-slate-200/80 text-xs text-[#072A6C] font-semibold">
                  Key Outcome: {bp.outcomes}
                </div>
              )}
            </div>
          ))}
        </div>
      );

    // ──────────────── 12. NEWS LETTERS ────────────────
    case "newsletters":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {programData.newsletters.length > 0 ? (
            programData.newsletters.map((nl, i) => (
              <div
                key={i}
                className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[10px] text-[#8B1D2C] font-bold uppercase tracking-wider font-mono">
                    {nl.volume} • {nl.issue}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#072A6C] mt-1">
                    {nl.title}
                  </h4>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Period: {nl.period}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Downloading ${nl.title} PDF.`)}
                  className="text-xs font-bold text-[#072A6C] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} /> Download Issue PDF
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 13. MOU ────────────────
    case "mou":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programData.mous.length > 0 ? (
            programData.mous.map((m, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#072A6C] leading-snug">
                    {m.partner}
                  </h4>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded font-mono shrink-0">
                    {m.validity}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{m.scope}</p>
                <span className="text-[10px] text-slate-500 block pt-1 border-t border-slate-200/80 font-mono">
                  Signed: {m.signedYear}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 14. RESEARCH & DEVELOPMENT ────────────────
    case "research":
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">
                Publications
              </span>
              <span className="text-xl font-bold text-[#072A6C] block mt-1">
                {programData.research.publicationsCount}+
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">
                Patents Published
              </span>
              <span className="text-xl font-bold text-[#072A6C] block mt-1">
                {programData.research.patentsPublished}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">
                Patents Granted
              </span>
              <span className="text-xl font-bold text-[#8B1D2C] block mt-1">
                {programData.research.patentsGranted}
              </span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">
                Active Scholars
              </span>
              <span className="text-xl font-bold text-slate-800 block mt-1">
                {programData.research.activeScholars}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-[#072A6C] uppercase tracking-wide block mb-2 font-mono">
              Key Thrust Areas
            </span>
            <div className="flex flex-wrap gap-2">
              {programData.research.thrustAreas.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-200"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {programData.research.keyPublications.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold text-[#072A6C] uppercase tracking-wide block font-mono">
                Featured Publications
              </span>
              {programData.research.keyPublications.map((pub, i) => (
                <div
                  key={i}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                >
                  <h4 className="font-bold text-[#072A6C]">{pub.title}</h4>
                  <p className="text-slate-600">
                    {pub.journal} ({pub.year}) — Authors: {pub.authors}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    // ──────────────── 15. PROFESSIONAL SOCIETIES ────────────────
    case "societies":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programData.professionalSocieties.length > 0 ? (
            programData.professionalSocieties.map((soc, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-2.5"
              >
                <div className="flex justify-between items-start gap-2">
                  <h4 className="text-sm font-bold text-[#072A6C]">{soc.name}</h4>
                  <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded font-mono">
                    {soc.chapterId}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p>
                    <strong>Faculty Counselor:</strong> {soc.counselor}
                  </p>
                  <p>
                    <strong>Members:</strong> {soc.membersCount}
                  </p>
                </div>
                {soc.recentActivities && (
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[11px] text-slate-500 font-bold block mb-1">
                      Recent Activities:
                    </span>
                    <ul className="text-xs text-slate-700 list-disc pl-4 space-y-0.5">
                      {soc.recentActivities.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 16. HIGHER EDUCATION & ENTREPRENEURSHIP ────────────────
    case "higherEducation":
      return (
        <div className="space-y-6">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-[#072A6C]">
              {programData.higherEducation?.title || "Higher Education & Entrepreneurship Ecosystem"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {programData.higherEducation?.description ||
                "Dedicated coaching and institutional support for students aspiring for higher studies (GATE/GRE/CAT) and startup incubation."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-[#072A6C] uppercase tracking-wide">
                Guidance & Training Tracks
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {(programData.higherEducation?.guidancePrograms || [
                  "GATE & Public Sector Coaching",
                  "GRE / TOEFL / IELTS Mentorship",
                  "University Incubation & Angel Support"
                ]).map((gp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#072A6C] font-bold">•</span>
                    <span>{gp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-[#072A6C] uppercase tracking-wide">
                Partner Institutions & Outcomes
              </h4>
              <ul className="space-y-1 text-xs text-slate-700">
                {(programData.higherEducation?.partnerUniversities || [
                  "IITs & NITs (M.Tech / Ph.D.)",
                  "Premier International Research Universities",
                  "IIMs & Top Business Schools"
                ]).map((pu, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#8B1D2C] font-bold">→</span>
                    <span>{pu}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );

    // ──────────────── 17. ROLL OF HONOUR ────────────────
    case "rollOfHonour":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {programData.rollOfHonour.length > 0 ? (
            programData.rollOfHonour.map((r, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1.5"
              >
                <span className="text-[10px] bg-[#072A6C] text-white font-bold px-2 py-0.5 rounded font-mono">
                  {r.rankOrMedal}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#072A6C]">
                  {r.studentName}
                </h4>
                <p className="text-xs text-slate-600 font-mono">
                  Batch: {r.batch} | CGPA: {r.cgpa}
                </p>
                <p className="text-xs text-slate-500">{r.achievement}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 18. FUNDING PROJECTS ────────────────
    case "fundingProjects":
      return (
        <div className="space-y-3">
          {programData.fundingProjects.length > 0 ? (
            programData.fundingProjects.map((p, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
              >
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">
                    {p.status} • {p.fundingAgency}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-[#072A6C]">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-600">
                    PI: {p.principalInvestigator} | Duration: {p.duration}
                  </p>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block font-mono">Grant</span>
                  <span className="text-xs font-bold text-[#072A6C]">{p.grantAmount}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 19. TEACHING INNOVATIONS ────────────────
    case "teachingInnovations":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programData.teachingInnovations.length > 0 ? (
            programData.teachingInnovations.map((ti, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2"
              >
                <span className="text-[10px] text-[#072A6C] font-bold uppercase font-mono">
                  Pedagogy
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-[#072A6C]">{ti.title}</h4>
                <p className="text-xs text-slate-500">
                  <strong>Faculty:</strong> {ti.faculty}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">{ti.methodology}</p>
                <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-700 font-medium">
                  Impact: {ti.impact}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 20. EVENTS & ASSOCIATION ────────────────
    case "eventsAssociation":
      return (
        <div className="space-y-6">
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono">
              Student Department Association
            </span>
            <h3 className="text-base font-bold text-[#072A6C]">
              {programData.eventsAndAssociation.associationName}
            </h3>
            <p className="text-xs text-slate-600 italic">
              "{programData.eventsAndAssociation.motto}"
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {programData.eventsAndAssociation.activitiesSummary}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-[#072A6C] uppercase tracking-wide mb-3 font-mono">
              Department Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {programData.eventsAndAssociation.events.length > 0 ? (
                programData.eventsAndAssociation.events.map((ev, i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {ev.type}
                      </span>
                      <span className="text-xs font-bold text-[#8B1D2C] font-mono">
                        {ev.date}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#072A6C]">{ev.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>
                    <span className="text-[11px] text-slate-500 block">Venue: {ev.venue}</span>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
                  Information will be updated soon.
                </div>
              )}
            </div>
          </div>
        </div>
      );

    // ──────────────── 21. TECHNICAL MAGAZINES ────────────────
    case "magazines":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programData.magazines.length > 0 ? (
            programData.magazines.map((mag, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200 p-5 rounded-xl space-y-2"
              >
                <span className="text-[10px] text-[#8B1D2C] font-bold uppercase font-mono">
                  {mag.edition}
                </span>
                <h4 className="text-sm font-bold text-[#072A6C]">{mag.title}</h4>
                <p className="text-xs text-slate-600">
                  <strong>Theme:</strong> {mag.theme}
                </p>
                <p className="text-xs text-slate-500">
                  <strong>Editor:</strong> {mag.editor}
                </p>
                <button
                  type="button"
                  onClick={() => alert(`Downloading technical magazine: ${mag.title}.`)}
                  className="mt-2 text-xs font-bold text-[#072A6C] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} /> View Magazine Issue
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
