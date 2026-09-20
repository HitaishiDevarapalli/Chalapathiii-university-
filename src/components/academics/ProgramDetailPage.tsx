"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, BookOpen, Award, Users, Briefcase, Building, FileText,
  Calendar, Layers, CheckCircle2, ArrowRight, Download, Mail, ExternalLink,
  ChevronRight, ChevronLeft, Sparkles, Trophy, Cpu, Network, ShieldCheck, Microscope,
  Library, Lightbulb, Compass, Share2, HelpCircle, FileCheck, Landmark, Check,
  Grid, List, Search, SlidersHorizontal, Eye, Zap, Radio, Globe, Terminal,
  TrendingUp, Star, Award as MedalIcon, Clock, Flame, CheckCircle, ArrowUpRight,
  LayoutGrid
} from "lucide-react";
import {
  FullProgramData,
  SectionMeta,
  DEFAULT_PROGRAM_SECTIONS,
  getProgramFullData
} from "../../data/programDetailsData";
import { useData } from "../../context/DataContext";

// Lucide icon mapping for the 19 sections
const SECTION_ICONS: Record<string, React.ElementType> = {
  about: BookOpen,
  hodMessage: Users,
  visionMission: Compass,
  peoPoPso: CheckCircle2,
  faculty: Users,
  placements: Briefcase,
  labs: Cpu,
  achievements: Trophy,
  syllabus: FileText,
  library: Library,
  newsletters: FileCheck,
  magazines: BookOpen,
  mou: Landmark,
  research: Microscope,
  societies: Network,
  rollOfHonour: Award,
  fundingProjects: Sparkles,
  teachingInnovations: Lightbulb,
  eventsAssociation: Calendar
};

// 6 Cyber Sectors grouping the 19 sections
interface CyberSector {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  icon: React.ElementType;
  sectionIds: string[];
}

const CYBER_SECTORS: CyberSector[] = [
  {
    id: "sector-all",
    title: "All Program Modules",
    shortTitle: "All Modules",
    subtitle: "Complete curriculum, laboratory facilities, faculty directory and career outcomes",
    icon: LayoutGrid,
    sectionIds: []
  },
  {
    id: "sector-overview",
    title: "Overview & Leadership",
    shortTitle: "Overview",
    subtitle: "Program Vision, HOD Message & Educational Objectives",
    icon: Compass,
    sectionIds: ["about", "hodMessage", "visionMission", "peoPoPso"]
  },
  {
    id: "sector-academics",
    title: "Curriculum & Pedagogy",
    shortTitle: "Curriculum",
    subtitle: "Semester-wise Syllabus, Teaching Innovations & Academic Honours",
    icon: BookOpen,
    sectionIds: ["syllabus", "teachingInnovations", "rollOfHonour"]
  },
  {
    id: "sector-labs",
    title: "Laboratories & Research",
    shortTitle: "Labs & R&D",
    subtitle: "Advanced Laboratories, Funded Projects & Department Library",
    icon: Cpu,
    sectionIds: ["labs", "research", "fundingProjects", "library"]
  },
  {
    id: "sector-placements",
    title: "Placements & Industry",
    shortTitle: "Placements",
    subtitle: "Salary Packages, Top Recruiters & Corporate MoUs",
    icon: Briefcase,
    sectionIds: ["placements", "mou", "achievements"]
  },
  {
    id: "sector-community",
    title: "Faculty & Student Life",
    shortTitle: "Faculty & Life",
    subtitle: "Faculty Directory, Student Societies & Technical Events",
    icon: Users,
    sectionIds: ["faculty", "societies", "newsletters", "magazines", "eventsAssociation"]
  }
];

interface ProgramDetailPageProps {
  slug: string;
  defaultData?: any;
}

export default function ProgramDetailPage({ slug, defaultData }: ProgramDetailPageProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleParam = searchParams.get("module");
  const { programs } = useData();

  // Find base program if available in programsData
  const matchedProgram = useMemo(() => {
    return programs?.find(p => p.slug === slug);
  }, [programs, slug]);

  // Load comprehensive 19-section data
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

  // Load section ordering and visibility configuration
  const [sections, setSections] = useState<SectionMeta[]>(() => {
    const saved = localStorage.getItem(`program_sections_order_${slug}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PROGRAM_SECTIONS;
  });

  // Active enabled sections
  const enabledSections = useMemo(() => {
    return sections.filter(s => s.enabled);
  }, [sections]);

  // Integrated Interaction Flow:
  // selectedModuleId === null -> 3D Cyber Matrix (Default Grid of all 19 Dimensions)
  // selectedModuleId === string -> Dedicated Holographic Interactive Module Screen
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(() => {
    return moduleParam || null;
  });
  const [activeSectorId, setActiveSectorId] = useState<string>("sector-all");
  const [matrixSearch, setMatrixSearch] = useState<string>("");

  // Sync module state when URL query parameter changes
  useEffect(() => {
    if (moduleParam && enabledSections.some(s => s.id === moduleParam)) {
      setSelectedModuleId(moduleParam);
    } else if (!moduleParam) {
      setSelectedModuleId(null);
    }
  }, [moduleParam, enabledSections]);

  // Section-specific sub-states
  const [peoTab, setPeoTab] = useState<"peos" | "pos" | "psos">("peos");
  const [syllabusSem, setSyllabusSem] = useState<number>(0);
  const [facultyFilter, setFacultyFilter] = useState<string>("All");
  const [facultySearch, setFacultySearch] = useState<string>("");
  const [activeLabIndex, setActiveLabIndex] = useState<number>(0);

  // Sync active sector when a module is active
  useEffect(() => {
    if (selectedModuleId) {
      const sector = CYBER_SECTORS.find(s => s.sectionIds.includes(selectedModuleId));
      if (sector && sector.id !== activeSectorId) {
        setActiveSectorId(sector.id);
      }
    }
  }, [selectedModuleId]);

  // Active section object when in Holo-Deck view
  const activeSection = useMemo(() => {
    if (!selectedModuleId) return enabledSections[0];
    return enabledSections.find(s => s.id === selectedModuleId) || enabledSections[0];
  }, [enabledSections, selectedModuleId]);

  // Current active section index & navigation helpers
  const currentSectionIndex = useMemo(() => {
    if (!selectedModuleId) return 0;
    return enabledSections.findIndex(s => s.id === selectedModuleId);
  }, [enabledSections, selectedModuleId]);

  const selectModule = (id: string) => {
    setSelectedModuleId(id);
    setSearchParams({ module: id }, { replace: false });
    setTimeout(() => {
      const target = document.getElementById("academic-dimension-screen") || document.getElementById("academic-command-viewport");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 420, behavior: "smooth" });
      }
    }, 50);
  };

  const backToMatrix = () => {
    setSelectedModuleId(null);
    setSearchParams({}, { replace: true });
    setTimeout(() => {
      const target = document.getElementById("academic-modules-overview") || document.getElementById("academic-command-viewport");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 380, behavior: "smooth" });
      }
    }, 50);
  };

  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      const prevId = enabledSections[currentSectionIndex - 1].id;
      selectModule(prevId);
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < enabledSections.length - 1) {
      const nextId = enabledSections[currentSectionIndex + 1].id;
      selectModule(nextId);
    }
  };

  // Keyboard navigation between modules
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (selectedModuleId) {
        if (e.key === "ArrowLeft") {
          goToPrevSection();
        } else if (e.key === "ArrowRight") {
          goToNextSection();
        } else if (e.key === "Escape") {
          backToMatrix();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedModuleId, currentSectionIndex, enabledSections]);

  // Filtered sections for 3D Matrix grid
  const matrixSections = useMemo(() => {
    return enabledSections.filter(sec => {
      // Sector filter
      if (activeSectorId !== "sector-all") {
        const sector = CYBER_SECTORS.find(s => s.id === activeSectorId);
        if (sector && !sector.sectionIds.includes(sec.id)) return false;
      }
      // Search filter
      if (matrixSearch.trim()) {
        const q = matrixSearch.toLowerCase();
        const sector = CYBER_SECTORS.find(s => s.sectionIds.includes(sec.id));
        const matchesTitle = sec.title.toLowerCase().includes(q);
        const matchesSector = sector?.title.toLowerCase().includes(q) || sector?.shortTitle.toLowerCase().includes(q);
        const matchesId = sec.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSector && !matchesId) return false;
      }
      return true;
    });
  }, [enabledSections, activeSectorId, matrixSearch]);

  // Filtered faculty list
  const filteredFaculty = useMemo(() => {
    return programData.facultyList.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
        f.specialization.toLowerCase().includes(facultySearch.toLowerCase()) ||
        f.qualification.toLowerCase().includes(facultySearch.toLowerCase());
      if (!matchesSearch) return false;
      if (facultyFilter === "All") return true;
      if (facultyFilter === "Professor") return f.designation.toLowerCase().includes("professor") && !f.designation.toLowerCase().includes("assistant") && !f.designation.toLowerCase().includes("associate");
      if (facultyFilter === "Associate") return f.designation.toLowerCase().includes("associate");
      if (facultyFilter === "Assistant") return f.designation.toLowerCase().includes("assistant");
      return true;
    });
  }, [programData.facultyList, facultySearch, facultyFilter]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#D4AF37] selection:text-[#072A6C] relative overflow-x-hidden">
      
      {/* ═══════════════════════════════════════════════════════════════════
          1. ACADEMIC PROGRAM HERO (CLEAN, AIRY, LIGHT UNIVERSITY HEADER)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-white border-b border-slate-200 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-left">
          
          {/* Clean Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto scrollbar-none pb-1">
            <Link to="/" className="hover:text-[#072A6C] transition-colors">Home</Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <Link to="/academics" className="hover:text-[#072A6C] transition-colors">Academics</Link>
            <ChevronRight size={12} className="text-slate-400 shrink-0" />
            <Link to="/academics/programmes" className="hover:text-[#072A6C] transition-colors">{programData.department}</Link>
            <ChevronRight size={12} className="text-[#072A6C] shrink-0" />
            <span className="text-[#072A6C] font-semibold truncate">{programData.shortName}</span>
          </nav>

          {/* Simple Clean Badges: Department Name & Duration ONLY */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-[#072A6C] text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200">
              <Building size={13} className="text-[#D4AF37]" />
              <span>{programData.department}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200">
              <Clock size={13} className="text-[#D4AF37]" />
              <span>Duration: {programData.duration}</span>
            </div>
          </div>

          {/* Program Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#072A6C] leading-tight pt-1">
            {programData.title}
          </h1>

          {/* Program Overview Summary */}
          {programData.about?.summary && (
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-4xl font-normal">
              {programData.about.summary}
            </p>
          )}

        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════════
          2. INTEGRATED PROGRAM NAVIGATION (CATEGORY FILTERS & MODULE CONTROLS)
      ═══════════════════════════════════════════════════════════════════ */}
      <div id="academic-command-viewport" className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          
          {/* STATE A: IN DEFAULT MODULES OVERVIEW */}
          {!selectedModuleId ? (
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Category Filter Pills - Flex-wrap ensures no button is ever cut in half on the side! */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {CYBER_SECTORS.map((sector) => {
                  const SectorIcon = sector.icon;
                  const isCurrentSector = activeSectorId === sector.id;
                  const count = sector.id === "sector-all" 
                    ? enabledSections.length 
                    : enabledSections.filter(s => sector.sectionIds.includes(s.id)).length;
                  return (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => setActiveSectorId(sector.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                        isCurrentSector
                          ? "bg-[#072A6C] text-white shadow-sm ring-1 ring-[#072A6C]"
                          : "bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80"
                      }`}
                    >
                      <SectorIcon size={13} className={isCurrentSector ? "text-[#D4AF37]" : "text-slate-500"} />
                      <span>{sector.shortTitle}</span>
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        isCurrentSector ? "bg-white/20 text-[#D4AF37]" : "bg-slate-200 text-slate-600"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Search inside Modules */}
              <div className="relative shrink-0 w-full sm:w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  placeholder="Search modules..."
                  className="w-full pl-8 pr-8 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072A6C] focus:border-transparent transition-all"
                />
                {matrixSearch && (
                  <button
                    onClick={() => setMatrixSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* STATE B: IN DEDICATED MODULE SCREEN */
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={backToMatrix}
                  className="px-3.5 py-1.5 rounded-xl bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm border border-slate-700 cursor-pointer group"
                >
                  <ChevronLeft size={15} className="text-[#D4AF37] group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to All Modules</span>
                  <LayoutGrid size={13} className="text-[#D4AF37]/80" />
                </button>

                <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
                  <span className="text-[10px] font-mono font-bold text-[#072A6C] uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                    MODULE 0{currentSectionIndex + 1}
                  </span>
                  <span className="text-xs font-black text-[#072A6C] truncate max-w-xs">
                    {activeSection.title}
                  </span>
                </div>
              </div>

              {/* Quick Prev / Next Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevSection}
                  disabled={currentSectionIndex === 0}
                  className={`h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentSectionIndex === 0
                      ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-[#072A6C] hover:text-white shadow-xs"
                  }`}
                >
                  <ChevronLeft size={13} /> Prev
                </button>

                <div className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-mono font-black text-[#072A6C]">
                  {currentSectionIndex + 1} / {enabledSections.length}
                </div>

                <button
                  type="button"
                  onClick={goToNextSection}
                  disabled={currentSectionIndex === enabledSections.length - 1}
                  className={`h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentSectionIndex === enabledSections.length - 1
                      ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-[#072A6C] text-white hover:bg-[#0B3D91] shadow-sm"
                  }`}
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>


      {/* ═══════════════════════════════════════════════════════════════════
          3. MAIN INTERACTIVE CONTAINER: 3D MATRIX OR HOLO-DECK
      ═══════════════════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">

        {/* ─────────────────────────────────────────────────────────────
            VIEW A: PROGRAM CURRICULUM & MODULES GRID (DEFAULT VIEW)
        ───────────────────────────────────────────────────────────── */}
        {!selectedModuleId ? (
          <div id="academic-modules-overview" className="space-y-8 scroll-mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
              <div className="space-y-1.5 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-[#072A6C] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/80">
                    ACADEMIC PROGRAM STRUCTURE
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {matrixSections.length} {matrixSections.length === 1 ? "Academic Module" : "Academic Modules"}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#072A6C]">
                  {activeSectorId === "sector-all" 
                    ? "Curriculum & Degree Modules" 
                    : CYBER_SECTORS.find(s => s.id === activeSectorId)?.title || "Degree Modules"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-light">
                  Comprehensive overview of undergraduate engineering coursework, laboratory practicals, academic faculty, and industry career pathways for {programData.title}. Select any module below to view detailed syllabi and learning outcomes.
                </p>
              </div>

              {/* Clear search or category filter pill if active */}
              {(activeSectorId !== "sector-all" || matrixSearch) && (
                <button
                  onClick={() => {
                    setActiveSectorId("sector-all");
                    setMatrixSearch("");
                  }}
                  className="text-xs font-bold text-[#072A6C] hover:text-[#051c4a] flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl transition-all self-start md:self-auto cursor-pointer"
                >
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Modules Cards Grid */}
            {matrixSections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 text-left">
                {matrixSections.map((sec, idx) => {
                  const Icon = SECTION_ICONS[sec.id] || BookOpen;
                  const sector = CYBER_SECTORS.find(s => s.sectionIds.includes(sec.id));
                  const globalIdx = enabledSections.findIndex(s => s.id === sec.id);

                  return (
                    <motion.div
                      key={sec.id}
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => selectModule(sec.id)}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-lg hover:border-[#072A6C]/40 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group"
                    >
                      <div className="space-y-3.5 relative z-10">
                        {/* Card Header: Icon + Category Badge + Module Number */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 text-[#072A6C] group-hover:bg-[#072A6C] group-hover:text-white flex items-center justify-center transition-all duration-200 shadow-xs">
                            <Icon size={20} className="group-hover:scale-105 transition-transform" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-[#072A6C] border border-slate-200/90 group-hover:bg-[#072A6C] group-hover:text-white group-hover:border-[#072A6C] transition-all shadow-2xs">
                              {sector?.shortTitle || "MODULE"}
                            </span>
                            <span className="w-6 h-6 rounded-md bg-slate-50 border border-slate-200 text-slate-700 group-hover:text-[#072A6C] group-hover:border-[#072A6C]/40 text-[11px] font-mono font-bold flex items-center justify-center transition-colors">
                              {globalIdx < 9 ? `0${globalIdx + 1}` : globalIdx + 1}
                            </span>
                          </div>
                        </div>

                        {/* Title & Hint */}
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-[#072A6C] group-hover:text-[#0B3D91] transition-colors leading-snug">
                            {sec.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 font-normal leading-relaxed">
                            {sector?.subtitle || "Explore course details, outcomes and resources."}
                          </p>
                        </div>
                      </div>

                      {/* Card Footer: View Details CTA */}
                      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700 group-hover:text-[#072A6C] font-bold relative z-10">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-600 group-hover:text-[#072A6C] transition-colors">
                          <BookOpen size={13} className="text-[#072A6C]" /> View Details
                        </span>
                        <div className="w-6 h-6 rounded-md bg-slate-100 group-hover:bg-[#072A6C] group-hover:text-white text-slate-600 flex items-center justify-center transition-all">
                          <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-lg mx-auto">
                <Search size={36} className="mx-auto text-slate-300 animate-bounce" />
                <h3 className="text-lg font-black text-[#072A6C]">No Modules Found</h3>
                <p className="text-xs text-slate-500">
                  No modules matched your search filter "{matrixSearch}". Try adjusting your keywords or clearing the filter.
                </p>
                <button
                  onClick={() => {
                    setMatrixSearch("");
                    setActiveSectorId("sector-all");
                  }}
                  className="px-4 py-2 bg-[#072A6C] text-white rounded-xl text-xs font-bold hover:bg-[#0B3D91] transition-all cursor-pointer"
                >
                  Show All Modules
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ─────────────────────────────────────────────────────────────
              VIEW B: DEDICATED MODULE SCREEN
          ───────────────────────────────────────────────────────────── */
          <div id="academic-dimension-screen" className="space-y-6 scroll-mt-24">
            
            {/* Top Module Header Bar */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={backToMatrix}
                  className="w-10 h-10 rounded-xl bg-[#072A6C] hover:bg-[#051c4a] text-white flex items-center justify-center hover:scale-105 transition-all shadow-sm shrink-0 cursor-pointer group"
                  title="Return to All Modules"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform text-[#D4AF37]" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#072A6C] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                      MODULE 0{currentSectionIndex + 1} OF {enabledSections.length}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {CYBER_SECTORS.find(s => s.sectionIds.includes(activeSection.id))?.title || "ACADEMICS"}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#072A6C] tracking-tight flex items-center gap-2">
                    {activeSection.title}
                  </h2>
                </div>
              </div>

              {/* Prev / Next & Back Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevSection}
                  disabled={currentSectionIndex === 0}
                  className={`h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentSectionIndex === 0
                      ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-[#072A6C] hover:text-white shadow-xs"
                  }`}
                >
                  <ChevronLeft size={13} /> Prev
                </button>

                <div className="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-mono font-black text-[#072A6C]">
                  {currentSectionIndex + 1} / {enabledSections.length}
                </div>

                <button
                  type="button"
                  onClick={goToNextSection}
                  disabled={currentSectionIndex === enabledSections.length - 1}
                  className={`h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    currentSectionIndex === enabledSections.length - 1
                      ? "opacity-40 cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-[#072A6C] text-white hover:bg-[#0B3D91] shadow-sm"
                  }`}
                >
                  Next <ChevronRight size={13} />
                </button>

                <button
                  type="button"
                  onClick={backToMatrix}
                  className="h-8 px-3 rounded-xl text-xs font-bold bg-[#072A6C]/10 hover:bg-[#072A6C]/20 text-[#072A6C] border border-[#072A6C]/20 flex items-center gap-1.5 transition-all cursor-pointer ml-1"
                >
                  <LayoutGrid size={13} className="text-[#072A6C]" /> All Modules
                </button>
              </div>
            </div>

            {/* Dedicated Module Screen */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm relative text-left"
              >
                {/* Render the Active Module Content */}
                {renderModuleContent(activeSection.id, programData, peoTab, setPeoTab, syllabusSem, setSyllabusSem, facultyFilter, setFacultyFilter, facultySearch, setFacultySearch, filteredFaculty, activeLabIndex, setActiveLabIndex)}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={goToPrevSection}
                disabled={currentSectionIndex === 0}
                className="text-xs font-bold text-slate-500 hover:text-[#072A6C] flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft size={16} /> 
                {currentSectionIndex > 0 ? `Previous: ${enabledSections[currentSectionIndex - 1].title}` : "First Module"}
              </button>

              <button
                type="button"
                onClick={backToMatrix}
                className="text-xs font-bold text-[#072A6C] hover:text-[#051c4a] bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:border-[#072A6C]"
              >
                <LayoutGrid size={14} className="text-[#072A6C]" /> ← Back to All Modules
              </button>

              <button
                type="button"
                onClick={goToNextSection}
                disabled={currentSectionIndex === enabledSections.length - 1}
                className="text-xs font-bold text-[#072A6C] hover:text-[#0B3D91] flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
              >
                {currentSectionIndex < enabledSections.length - 1 ? `Next: ${enabledSections[currentSectionIndex + 1].title}` : "End of Program"}
                <ChevronRight size={16} />
              </button>
            </div>

          </div>
        )}

      </main>


      {/* ═══════════════════════════════════════════════════════════════════
          4. BOTTOM CALL-TO-ACTION & ENROLMENT
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-[#051C4A] via-[#072A6C] to-[#0B3D91] text-white py-14 px-5 mt-16 border-t border-white/10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest font-mono">
            JOIN CHALAPATHI UNIVERSITY ACADEMIC COMMUNITY
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black">
            Begin Your Academic Journey in {programData.shortName}
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-light leading-relaxed">
            Empowering next-generation engineers, creators, and business leaders with world-class curriculum and comprehensive career mentorship.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3.5">
            <Link
              to="/admissions/apply"
              className="h-11 px-8 bg-gradient-to-r from-[#D4AF37] to-[#E5C158] hover:from-[#C9A84C] hover:to-[#D4AF37] text-[#072A6C] text-xs font-black uppercase tracking-wider rounded-2xl inline-flex items-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer"
            >
              Apply Online Now <ArrowRight size={14} />
            </Link>
            <Link
              to="/admissions"
              className="h-11 px-8 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-2xl inline-flex items-center gap-2 border border-white/20 transition-colors cursor-pointer"
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
// HELPER FUNCTION: RENDERS ULTRA-FUTURISTIC CONTENT FOR ALL 19 MODULES
// ═══════════════════════════════════════════════════════════════════════════
function renderModuleContent(
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
  filteredFaculty: any[],
  activeLabIndex: number,
  setActiveLabIndex: (idx: number) => void
) {
  switch (sectionId) {
    
    // ──────────────── 01. ABOUT PROGRAM ────────────────
    case "about":
      return (
        <div className="space-y-7">
          <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="text-[10px] font-mono font-bold text-[#072A6C] uppercase tracking-wider block">
              PROGRAM OVERVIEW & OBJECTIVES
            </span>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-light">
              {programData.about.summary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Highlights */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl pointer-events-none" />
              <h3 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-[#D4AF37]" /> Core Program Highlights
              </h3>
              <ul className="space-y-3">
                {programData.about.highlights.map((h, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed font-medium">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                      ✓
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Objectives */}
            <motion.div 
              whileHover={{ y: -3 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#072A6C]/10 rounded-full blur-xl pointer-events-none" />
              <h3 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                <Compass size={16} className="text-[#D4AF37]" /> Program Educational Mission
              </h3>
              <ul className="space-y-3">
                {programData.about.objectives.map((obj, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed font-medium">
                    <span className="w-5 h-5 rounded-full bg-[#072A6C]/10 text-[#072A6C] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                      →
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Career Pathways */}
          <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
              TARGET CAREER & INDUSTRY PATHWAYS
            </span>
            <div className="flex flex-wrap gap-2">
              {programData.careerRoles.map((role, i) => (
                <span key={i} className="text-xs font-bold text-[#072A6C] bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs hover:border-[#D4AF37] transition-colors">
                  💼 {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      );

    // ──────────────── 02. HOD MESSAGE ────────────────
    case "hodMessage":
      return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:col-span-4 bg-gradient-to-br from-[#072A6C] via-[#0B3D91] to-[#051C4A] text-white p-7 rounded-3xl flex flex-col items-center text-center shadow-xl relative overflow-hidden border border-white/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-black text-white mb-4 shadow-inner">
              {programData.hodMessage.hodName.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <h3 className="text-base font-black">{programData.hodMessage.hodName}</h3>
            <span className="text-xs text-[#D4AF37] font-bold mt-0.5">{programData.hodMessage.designation}</span>
            <span className="text-[11px] text-white/70 font-light mt-1 max-w-[240px]">
              {programData.hodMessage.qualification}
            </span>
            {programData.hodMessage.email && (
              <a 
                href={`mailto:${programData.hodMessage.email}`} 
                className="mt-4 px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs text-white font-medium flex items-center gap-1.5 transition-colors border border-white/20"
              >
                <Mail size={13} /> {programData.hodMessage.email}
              </a>
            )}
          </motion.div>

          <div className="md:col-span-8 space-y-4">
            <div className="relative pl-6 border-l-4 border-[#D4AF37] space-y-2">
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest block">
                FROM THE HEAD OF DEPARTMENT
              </span>
              <p className="text-sm sm:text-base text-slate-800 italic leading-relaxed font-light">
                "{programData.hodMessage.message}"
              </p>
            </div>
            <p className="text-xs text-slate-500 font-light leading-relaxed pl-6">
              Our department mentorship ecosystem connects scholars with cutting-edge academic labs, tier-1 research publications, and direct industry internships from early semesters.
            </p>
          </div>
        </div>
      );

    // ──────────────── 03. VISION & MISSION ────────────────
    case "visionMission":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
          >
            <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest block">
              HORIZON 2030
            </span>
            <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#D4AF37]" /> Department Vision
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-light">
              {programData.visionMission.vision}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-amber-50/40 to-amber-50/10 p-6 rounded-2xl border border-amber-200/60 shadow-sm space-y-3"
          >
            <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest block">
              EXECUTION PILLARS
            </span>
            <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
              <Compass size={16} className="text-[#D4AF37]" /> Department Mission
            </h3>
            <ul className="space-y-2.5">
              {programData.visionMission.mission.map((m, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="md:col-span-2 pt-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2.5">
              CORE INSTITUTIONAL VALUES
            </span>
            <div className="flex flex-wrap gap-2">
              {programData.visionMission.coreValues.map((v, i) => (
                <span key={i} className="px-4 py-2 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-xs">
                  ⭐ {v}
                </span>
              ))}
            </div>
          </div>
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
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPeoTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  peoTab === tab.id
                    ? "bg-[#072A6C] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {peoTab === "peos" && programData.peoPoPso.peos.map((item) => (
              <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 hover:border-[#D4AF37] transition-colors">
                <span className="text-xs font-black text-[#D4AF37] font-mono">{item.id}: {item.title}</span>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}

            {peoTab === "pos" && programData.peoPoPso.pos.map((item) => (
              <div key={item.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 hover:border-[#072A6C] transition-colors">
                <span className="text-xs font-black text-[#072A6C] font-mono">{item.id}: {item.title}</span>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}

            {peoTab === "psos" && programData.peoPoPso.psos.map((item) => (
              <div key={item.id} className="p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-1.5">
                <span className="text-xs font-black text-emerald-800 font-mono">{item.id}: {item.title}</span>
                <p className="text-xs text-emerald-950/80 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );

    // ──────────────── 05. FACULTY DIRECTORY ────────────────
    case "faculty":
      return (
        <div className="space-y-6">
          {/* Interactive Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search faculty by name, specialization, or qualification..."
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#072A6C]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {["All", "Professor", "Associate", "Assistant"].map((flt) => (
                <button
                  key={flt}
                  onClick={() => setFacultyFilter(flt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    facultyFilter === flt
                      ? "bg-[#072A6C] text-white shadow-xs"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {flt}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Holographic Faculty Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFaculty.map((f, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-[#072A6C]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#072A6C] to-[#0B3D91] text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
                      {f.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-black text-[#072A6C] truncate leading-tight">{f.name}</h4>
                      <span className="text-[11px] text-[#D4AF37] font-bold block truncate">{f.designation}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-500 font-light">
                    <p><strong className="font-semibold text-slate-700">Qual:</strong> {f.qualification}</p>
                    <p><strong className="font-semibold text-slate-700">Area:</strong> {f.specialization}</p>
                    <p><strong className="font-semibold text-slate-700">Exp:</strong> {f.experience}</p>
                  </div>
                </div>
                <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                  <a href={`mailto:${f.email}`} className="text-[#072A6C] hover:text-[#D4AF37] font-semibold flex items-center gap-1 transition-colors">
                    <Mail size={12} /> Contact Email
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredFaculty.length === 0 && (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              No faculty members found matching your search term.
            </div>
          )}
        </div>
      );

    // ──────────────── 06. PLACEMENTS & INTERNSHIPS ────────────────
    case "placements":
      return (
        <div className="space-y-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 bg-gradient-to-br from-[#072A6C] to-[#0B3D91] text-white rounded-3xl text-center shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/20 rounded-full blur-xl pointer-events-none" />
              <span className="text-[10px] text-[#D4AF37] font-mono font-black uppercase tracking-widest block">Highest Package</span>
              <span className="text-2xl sm:text-3xl font-black mt-1 block">{programData.placements.highestPackage}</span>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 bg-white border border-slate-200 text-slate-800 rounded-3xl text-center shadow-sm"
            >
              <span className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-widest block">Average Package</span>
              <span className="text-2xl sm:text-3xl font-black text-[#072A6C] mt-1 block">{programData.placements.averagePackage}</span>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-3xl text-center shadow-sm"
            >
              <span className="text-[10px] text-emerald-600 font-mono font-black uppercase tracking-widest block">Placement Rate</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">{programData.placements.placementRate}</span>
            </motion.div>
          </div>

          {/* Top Recruiters */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
              PREMIER RECRUITING PARTNERS
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {programData.placements.topRecruiters.map((comp, i) => (
                <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-2xs hover:border-[#072A6C] transition-colors">
                  🏢 {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Placed Students */}
          {programData.placements.placedStudents.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                STAR ALUMNI & RECENT PLACEMENT SPOTLIGHTS
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {programData.placements.placedStudents.map((s, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1 hover:border-[#D4AF37] transition-colors">
                    <span className="text-xs font-black text-[#072A6C] block">{s.name}</span>
                    <span className="text-[11px] font-bold text-[#D4AF37] block">{s.company}</span>
                    <span className="text-[11px] text-emerald-600 font-black block">{s.package}</span>
                    <span className="text-[10px] text-slate-400 block">{s.role}</span>
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
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
              SPECIALIZED RESEARCH & COMPUTING LABORATORIES ({programData.laboratories.length} UNITS)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programData.laboratories.map((lab, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 hover:border-[#072A6C]/30 transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-black text-[#072A6C] leading-snug">{lab.name}</h3>
                  <span className="text-[10px] bg-[#D4AF37]/15 text-[#072A6C] font-black px-2.5 py-1 rounded-md shrink-0 font-mono">
                    {lab.capacity}
                  </span>
                </div>

                {lab.equipment && lab.equipment.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5 font-mono">
                      Hardware & Workstations
                    </span>
                    <ul className="space-y-1">
                      {lab.equipment.map((eq, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-center gap-1.5 font-light">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#072A6C]" /> {eq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {lab.software && lab.software.length > 0 && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1.5 font-mono">
                      Software Tools & Simulation Suites
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {lab.software.map((sw, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      );

    // ──────────────── 08. ACHIEVEMENTS & ACCREDITATIONS ────────────────
    case "achievements":
      return (
        <div className="space-y-4">
          {programData.achievements.map((ach, i) => (
            <div key={i} className="p-5 bg-slate-50 border-l-4 border-[#D4AF37] rounded-r-2xl space-y-1 hover:bg-slate-100/80 transition-colors">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black text-[#072A6C]">{ach.title}</h3>
                <span className="text-[10px] font-bold bg-white px-2.5 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">{ach.year}</span>
              </div>
              <p className="text-xs text-slate-600 font-light leading-relaxed">{ach.desc}</p>
            </div>
          ))}
        </div>
      );

    // ──────────────── 09. SYLLABUS & ACADEMIC CALENDAR ────────────────
    case "syllabus":
      return (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-xs font-black text-[#072A6C] block">{programData.syllabus.regulation}</span>
              <span className="text-[11px] text-slate-500 font-light">Outcome-Based Education (OBE) & CBCS Curriculum Framework</span>
            </div>
            <div className="flex gap-2">
              <a
                href={programData.syllabus.curriculumPdfUrl || "#"}
                onClick={(e) => {
                  if (!programData.syllabus.curriculumPdfUrl || programData.syllabus.curriculumPdfUrl === "#") {
                    e.preventDefault();
                    alert(`Downloading complete syllabus structure for ${programData.title}.`);
                  }
                }}
                className="px-4 py-2 bg-[#072A6C] hover:bg-[#0B3D91] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download size={13} /> Download Syllabus PDF
              </a>
              <Link
                to="/academics/calendar"
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-[#072A6C] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Calendar size={13} /> View Academic Calendar
              </Link>
            </div>
          </div>

          {/* Semester Breakdown Tabs */}
          {programData.syllabus.semesters.length > 0 && (
            <div className="space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {programData.syllabus.semesters.map((sem, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSyllabusSem(idx)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                      syllabusSem === idx
                        ? "bg-[#D4AF37] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {sem.semNumber} ({sem.credits} Credits)
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#072A6C] text-white uppercase text-[10px] tracking-wider font-mono">
                    <tr>
                      <th className="py-2.5 px-4">Subject Code</th>
                      <th className="py-2.5 px-4">Subject Title</th>
                      <th className="py-2.5 px-4">Course Type</th>
                      <th className="py-2.5 px-4 text-center">Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {programData.syllabus.semesters[syllabusSem]?.subjects.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-4 font-mono font-bold text-[#072A6C]">{sub.code}</td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">{sub.name}</td>
                        <td className="py-2.5 px-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {sub.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-center text-[#D4AF37] font-mono">{sub.credits}</td>
                      </tr>
                    ))}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-wider block">Physical Holdings</span>
            <div className="space-y-2 text-xs text-slate-700 font-medium">
              <p>📚 <strong className="text-[#072A6C] font-black">{programData.library.volumesCount}</strong></p>
              <p>📖 <strong className="text-[#072A6C] font-black">{programData.library.titlesCount}</strong></p>
              <p>📰 <strong className="text-[#072A6C] font-black">{programData.library.nationalJournals}</strong></p>
              <p>🌐 <strong className="text-[#072A6C] font-black">{programData.library.internationalJournals}</strong></p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-wider block">Digital Subscriptions</span>
            <div className="flex flex-wrap gap-1.5">
              {programData.library.digitalAccess.map((d, i) => (
                <span key={i} className="text-[11px] font-bold bg-white border border-slate-200 text-[#072A6C] px-2.5 py-1 rounded-md">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[10px] text-slate-400 font-mono font-black uppercase tracking-wider block">E-Resources & DELNET</span>
            <ul className="space-y-1.5 text-xs text-slate-600 font-light">
              {programData.library.eResources.map((res, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    // ──────────────── 11. NEWS LETTERS ────────────────
    case "newsletters":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {programData.newsletters.length > 0 ? (
            programData.newsletters.map((nl, i) => (
              <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-[#072A6C]/40 transition-colors">
                <div>
                  <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-wider font-mono">{nl.volume} • {nl.issue}</span>
                  <h4 className="text-xs sm:text-sm font-black text-[#072A6C] mt-1">{nl.title}</h4>
                  <span className="text-[11px] text-slate-500 font-light block mt-1">Period: {nl.period}</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Downloading ${nl.title} (${nl.period}) PDF.`)}
                  className="mt-4 text-xs font-bold text-[#072A6C] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors cursor-pointer"
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

    // ──────────────── 12. TECHNICAL MAGAZINES ────────────────
    case "magazines":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {programData.magazines.length > 0 ? (
            programData.magazines.map((mag, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-2 hover:border-[#D4AF37] transition-colors">
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider font-mono">{mag.edition}</span>
                <h4 className="text-base font-black text-[#072A6C]">{mag.title}</h4>
                <p className="text-xs text-slate-600 font-light"><strong>Theme:</strong> {mag.theme}</p>
                <p className="text-[11px] text-slate-400"><strong>Editor:</strong> {mag.editor}</p>
                <button
                  type="button"
                  onClick={() => alert(`Downloading technical magazine: ${mag.title}.`)}
                  className="mt-3 text-xs font-bold text-[#072A6C] hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors cursor-pointer"
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

    // ──────────────── 13. MEMORANDA OF UNDERSTANDING (MOU) ────────────────
    case "mou":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {programData.mous.length > 0 ? (
            programData.mous.map((m, i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-2 hover:border-[#072A6C] transition-colors">
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider font-mono">{m.validity}</span>
                <h4 className="text-xs sm:text-sm font-black text-[#072A6C] leading-snug">{m.partner}</h4>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">{m.scope}</p>
                <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-100 font-mono">Signed: {m.signedYear}</span>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 14. RESEARCH & DEVELOPMENT ────────────────
    case "research":
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200">
              <span className="text-[10px] text-slate-400 font-black uppercase font-mono">Publications</span>
              <span className="text-xl font-black text-[#072A6C] block mt-1">{programData.research.publicationsCount}+</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200">
              <span className="text-[10px] text-slate-400 font-black uppercase font-mono">Patents Published</span>
              <span className="text-xl font-black text-[#072A6C] block mt-1">{programData.research.patentsPublished}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200">
              <span className="text-[10px] text-slate-400 font-black uppercase font-mono">Patents Granted</span>
              <span className="text-xl font-black text-emerald-600 block mt-1">{programData.research.patentsGranted}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-200">
              <span className="text-[10px] text-slate-400 font-black uppercase font-mono">Active Scholars</span>
              <span className="text-xl font-black text-[#D4AF37] block mt-1">{programData.research.activeScholars}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              Key Research Thrust Areas
            </span>
            <div className="flex flex-wrap gap-2">
              {programData.research.thrustAreas.map((t, i) => (
                <span key={i} className="px-3.5 py-1.5 bg-[#072A6C]/5 text-[#072A6C] text-xs font-bold rounded-xl border border-[#072A6C]/10">
                  🔬 {t}
                </span>
              ))}
            </div>
          </div>

          {programData.research.keyPublications.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block font-mono">
                Featured Peer-Reviewed Publications
              </span>
              {programData.research.keyPublications.map((pub, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <h4 className="font-bold text-[#072A6C]">{pub.title}</h4>
                  <p className="text-slate-500 font-light">{pub.journal} ({pub.year}) — Authors: {pub.authors}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    // ──────────────── 15. PROFESSIONAL SOCIETIES ────────────────
    case "societies":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programData.professionalSocieties.length > 0 ? (
            programData.professionalSocieties.map((soc, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3 hover:border-[#072A6C] transition-colors">
                <span className="text-[10px] text-[#D4AF37] font-black uppercase font-mono">{soc.chapterId}</span>
                <h4 className="text-sm font-black text-[#072A6C]">{soc.name}</h4>
                <div className="text-[11px] text-slate-500 font-light space-y-1">
                  <p><strong>Counselor:</strong> {soc.counselor}</p>
                  <p><strong>Members:</strong> {soc.membersCount}</p>
                </div>
                {soc.recentActivities && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">Recent Activities:</span>
                    <ul className="text-[11px] text-slate-600 list-disc pl-4 space-y-0.5">
                      {soc.recentActivities.map((act, idx) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-3 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 16. ROLL OF HONOUR ────────────────
    case "rollOfHonour":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {programData.rollOfHonour.length > 0 ? (
            programData.rollOfHonour.map((r, i) => (
              <div key={i} className="bg-amber-50/40 border border-amber-200/60 p-5 rounded-2xl space-y-2 hover:border-[#D4AF37] transition-colors">
                <span className="text-[10px] bg-[#D4AF37] text-white font-black px-2.5 py-0.5 rounded-full uppercase font-mono">
                  {r.rankOrMedal}
                </span>
                <h4 className="text-sm font-black text-[#072A6C]">{r.studentName}</h4>
                <p className="text-xs text-slate-700 font-mono"><strong>Batch:</strong> {r.batch} | <strong>CGPA:</strong> {r.cgpa}</p>
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">{r.achievement}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 17. FUNDING PROJECTS ────────────────
    case "fundingProjects":
      return (
        <div className="space-y-4">
          {programData.fundingProjects.length > 0 ? (
            programData.fundingProjects.map((p, i) => (
              <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#072A6C] transition-colors">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider font-mono">{p.status} • {p.fundingAgency}</span>
                  <h4 className="text-xs sm:text-sm font-black text-[#072A6C]">{p.title}</h4>
                  <p className="text-[11px] text-slate-500 font-light">PI: {p.principalInvestigator} | Duration: {p.duration}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Sanctioned Grant</span>
                  <span className="text-sm font-black text-[#072A6C]">{p.grantAmount}</span>
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

    // ──────────────── 18. TEACHING INNOVATIONS ────────────────
    case "teachingInnovations":
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {programData.teachingInnovations.length > 0 ? (
            programData.teachingInnovations.map((ti, i) => (
              <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3 hover:border-[#072A6C] transition-colors">
                <span className="text-[10px] text-[#072A6C] font-black uppercase font-mono">Pedagogy Innovation</span>
                <h4 className="text-sm font-black text-[#072A6C]">{ti.title}</h4>
                <p className="text-[11px] text-slate-500"><strong>Faculty:</strong> {ti.faculty}</p>
                <p className="text-xs text-slate-600 font-light leading-relaxed">{ti.methodology}</p>
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 font-medium">
                  📈 Impact: {ti.impact}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
              Information will be updated soon.
            </div>
          )}
        </div>
      );

    // ──────────────── 19. EVENTS & ASSOCIATION ────────────────
    case "eventsAssociation":
      return (
        <div className="space-y-7">
          <div className="p-6 bg-gradient-to-r from-[#072A6C] to-[#0B3D91] text-white rounded-3xl shadow-lg space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest block font-mono">
              STUDENT DEPARTMENT ASSOCIATION
            </span>
            <h3 className="text-lg md:text-xl font-black">{programData.eventsAndAssociation.associationName}</h3>
            <p className="text-xs text-white/80 italic">"{programData.eventsAndAssociation.motto}"</p>
            <p className="text-xs text-white/70 font-light pt-2 max-w-2xl leading-relaxed">
              {programData.eventsAndAssociation.activitiesSummary}
            </p>
            <div className="pt-3 border-t border-white/15 flex flex-wrap gap-6 text-xs text-white/90">
              <span><strong>President:</strong> {programData.eventsAndAssociation.president}</span>
              <span><strong>Faculty Advisor:</strong> {programData.eventsAndAssociation.facultyAdvisor}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 font-mono">
              DEPARTMENT TECHNICAL EVENTS & FESTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {programData.eventsAndAssociation.events.length > 0 ? (
                programData.eventsAndAssociation.events.map((ev, i) => (
                  <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 hover:border-[#D4AF37] transition-colors">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-[10px] font-bold bg-[#072A6C]/10 text-[#072A6C] px-2 py-0.5 rounded">
                        {ev.type}
                      </span>
                      <span className="text-[11px] font-bold text-[#D4AF37] font-mono">{ev.date}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-[#072A6C]">{ev.title}</h4>
                    <p className="text-xs text-slate-600 font-light leading-relaxed">{ev.description}</p>
                    <span className="text-[11px] text-slate-400 font-medium block">📍 Venue: {ev.venue}</span>
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

    default:
      return null;
  }
}
