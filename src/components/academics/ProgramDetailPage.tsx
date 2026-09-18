"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, BookOpen, Award, Users, Briefcase, Building, FileText,
  Calendar, Layers, CheckCircle2, ArrowRight, Download, Mail, ExternalLink,
  ChevronRight, Sparkles, Trophy, Cpu, Network, ShieldCheck, Microscope,
  Library, Lightbulb, Compass, Share2, HelpCircle, FileCheck, Landmark, Check
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

interface ProgramDetailPageProps {
  slug: string;
  defaultData?: any;
}

export default function ProgramDetailPage({ slug, defaultData }: ProgramDetailPageProps) {
  const navigate = useNavigate();
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
      } catch (e) {
        // fallback
      }
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

  const [activeSection, setActiveSection] = useState<string>("about");
  const [peoTab, setPeoTab] = useState<"peos" | "pos" | "psos">("peos");
  const [syllabusSem, setSyllabusSem] = useState<number>(0);

  // Active section spy on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sec of sections) {
        if (!sec.enabled) continue;
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Visible sections in user's saved order
  const orderedVisibleSections = useMemo(() => {
    return [...sections].sort((a, b) => a.order - b.order).filter(s => s.enabled);
  }, [sections]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-[var(--font-poppins)] text-gray-800">
      {/* ═══ 1. PROGRAM HERO HEADER ═══ */}
      <section className="relative bg-gradient-to-r from-[#072A6C] via-[#0B3D91] to-[#072A6C] text-white pt-10 pb-16 px-5 border-b border-white/10 overflow-hidden">
        {/* Decorative Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/70 mb-6 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={13} className="text-white/40" />
            <Link to="/academics" className="hover:text-white transition-colors">Academics</Link>
            <ChevronRight size={13} className="text-white/40" />
            <Link to="/academics/programmes" className="hover:text-white transition-colors">{programData.department}</Link>
            <ChevronRight size={13} className="text-white/40" />
            <span className="text-[#D4AF37] font-bold">{programData.shortName}</span>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#D4AF37] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {programData.level}
                </span>
                <span className="bg-white/15 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                  {programData.school}
                </span>
                <span className="bg-white/15 text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                  {programData.degreeType}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {programData.title}
              </h1>

              <p className="text-white/80 text-sm leading-relaxed max-w-2xl font-light">
                {programData.about.summary}
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15">
                <div>
                  <span className="block text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">Duration</span>
                  <span className="text-xs sm:text-sm font-bold text-white">{programData.duration}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">Annual Intake</span>
                  <span className="text-xs sm:text-sm font-bold text-white">{programData.intake}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">Highest Package</span>
                  <span className="text-xs sm:text-sm font-bold text-white">{programData.placements.highestPackage}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">Placement Rate</span>
                  <span className="text-xs sm:text-sm font-bold text-white">{programData.placements.placementRate}</span>
                </div>
              </div>
            </div>

            {/* Quick Action CTA Box */}
            <div className="w-full lg:w-auto bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col gap-3.5 shadow-xl shrink-0">
              <span className="text-xs text-white/90 font-medium">Admissions Open for Academic Year 2026-27</span>
              <Link
                to="/admissions/apply"
                className="w-full h-11 bg-[#D4AF37] hover:bg-[#C9A84C] text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                Apply for {programData.shortName} <ArrowRight size={14} />
              </Link>
              <a
                href={programData.syllabus.curriculumPdfUrl || "#"}
                onClick={(e) => {
                  if (!programData.syllabus.curriculumPdfUrl || programData.syllabus.curriculumPdfUrl === "#") {
                    e.preventDefault();
                    alert(`Downloading Syllabus & Curriculum for ${programData.title} (R26 Regulations).`);
                  }
                }}
                className="w-full h-10 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-white/30 cursor-pointer"
              >
                <Download size={14} /> Download Curriculum PDF
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. STICKY QUICK-JUMP SUB-NAVBAR ═══ */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none py-2.5 flex items-center gap-2">
          {orderedVisibleSections.map((sec) => {
            const Icon = SECTION_ICONS[sec.id] || BookOpen;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#072A6C] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-[#072A6C]"
                }`}
              >
                <Icon size={13} className={isActive ? "text-[#D4AF37]" : "text-gray-400"} />
                <span>{sec.title}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ═══ 3. DYNAMIC 19 SECTIONS CONTAINER ═══ */}
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {orderedVisibleSections.map((section) => {
          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 bg-white rounded-3xl border border-gray-100 p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-5 mb-8 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#072A6C]/5 flex items-center justify-center text-[#072A6C]">
                  {React.createElement(SECTION_ICONS[section.id] || BookOpen, { size: 20 })}
                </div>
                <div>
                  <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest block">
                    {programData.shortName} • Overview
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-[#072A6C] tracking-tight">
                    {section.title}
                  </h2>
                </div>
              </div>

              {/* ──────────────── 1. ABOUT PROGRAM ──────────────── */}
              {section.id === "about" && (
                <div className="space-y-6">
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
                    {programData.about.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100">
                      <h3 className="text-sm font-extrabold text-[#072A6C] mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles size={16} className="text-[#D4AF37]" /> Program Highlights
                      </h3>
                      <ul className="space-y-3">
                        {programData.about.highlights.map((h, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2.5 leading-relaxed font-medium">
                            <Check size={14} className="text-[#072A6C] shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100">
                      <h3 className="text-sm font-extrabold text-[#072A6C] mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Compass size={16} className="text-[#D4AF37]" /> Program Objectives
                      </h3>
                      <ul className="space-y-3">
                        {programData.about.objectives.map((obj, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2.5 leading-relaxed font-medium">
                            <ArrowRight size={14} className="text-[#D4AF37] shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Career Horizons */}
                  <div className="pt-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                      Target Career Profiles for Graduates
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {programData.careerRoles.map((role, i) => (
                        <span key={i} className="text-xs font-bold text-[#072A6C] bg-[#072A6C]/5 px-3 py-1.5 rounded-lg border border-[#072A6C]/10">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────── 2. HOD / COORDINATOR MESSAGE ──────────────── */}
              {section.id === "hodMessage" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="bg-gradient-to-br from-[#072A6C] to-[#0B3D91] text-white p-6 rounded-2xl flex flex-col items-center text-center shadow-md">
                    <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-[#D4AF37] flex items-center justify-center text-2xl font-black text-white mb-4 shadow-inner">
                      {programData.hodMessage.hodName.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <h3 className="text-base font-black">{programData.hodMessage.hodName}</h3>
                    <span className="text-[11px] text-[#D4AF37] font-bold mt-0.5">{programData.hodMessage.designation}</span>
                    <span className="text-[10px] text-white/70 font-light mt-1 max-w-[200px] leading-tight">
                      {programData.hodMessage.qualification}
                    </span>
                    {programData.hodMessage.email && (
                      <a href={`mailto:${programData.hodMessage.email}`} className="mt-4 text-[11px] text-white/90 font-medium hover:text-[#D4AF37] flex items-center gap-1.5 transition-colors">
                        <Mail size={12} /> {programData.hodMessage.email}
                      </a>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="relative pl-6 border-l-4 border-[#D4AF37]">
                      <p className="text-sm md:text-base text-gray-700 italic leading-relaxed font-light">
                        "{programData.hodMessage.message}"
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">
                      Our faculty and research mentors maintain an open-door policy to assist every scholar in academic mentoring, conference publications, and career choices.
                    </p>
                  </div>
                </div>
              )}

              {/* ──────────────── 3. VISION & MISSION ──────────────── */}
              {section.id === "visionMission" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#072A6C]/5 p-6 rounded-2xl border border-[#072A6C]/10 space-y-4">
                    <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles size={16} className="text-[#D4AF37]" /> Department Vision
                    </h3>
                    <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-light">
                      {programData.visionMission.vision}
                    </p>
                  </div>

                  <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/50 space-y-4">
                    <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                      <Compass size={16} className="text-[#D4AF37]" /> Department Mission
                    </h3>
                    <ul className="space-y-2.5">
                      {programData.visionMission.mission.map((m, i) => (
                        <li key={i} className="text-xs text-gray-700 flex items-start gap-2 leading-relaxed font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-2">Core Institutional Values</span>
                    <div className="flex flex-wrap gap-2">
                      {programData.visionMission.coreValues.map((v, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                          ⭐ {v}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────── 4. PEOS, POS & PSOS ──────────────── */}
              {section.id === "peoPoPso" && (
                <div className="space-y-6">
                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-gray-200 pb-2">
                    {[
                      { id: "peos", label: "Program Educational Objectives (PEOs)" },
                      { id: "pos", label: "Program Outcomes (POs)" },
                      { id: "psos", label: "Program Specific Outcomes (PSOs)" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setPeoTab(tab.id as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          peoTab === tab.id
                            ? "bg-[#072A6C] text-white shadow-sm"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {peoTab === "peos" && programData.peoPoPso.peos.map((item) => (
                      <div key={item.id} className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1.5">
                        <span className="text-xs font-black text-[#D4AF37]">{item.id}: {item.title}</span>
                        <p className="text-xs text-gray-600 leading-relaxed font-light">{item.desc}</p>
                      </div>
                    ))}

                    {peoTab === "pos" && programData.peoPoPso.pos.map((item) => (
                      <div key={item.id} className="p-5 bg-gray-50/70 rounded-2xl border border-gray-100 space-y-1.5">
                        <span className="text-xs font-black text-[#072A6C]">{item.id}: {item.title}</span>
                        <p className="text-xs text-gray-600 leading-relaxed font-light">{item.desc}</p>
                      </div>
                    ))}

                    {peoTab === "psos" && programData.peoPoPso.psos.map((item) => (
                      <div key={item.id} className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-1.5">
                        <span className="text-xs font-black text-emerald-800">{item.id}: {item.title}</span>
                        <p className="text-xs text-emerald-950/80 leading-relaxed font-light">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ──────────────── 5. FACULTY DIRECTORY ──────────────── */}
              {section.id === "faculty" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programData.facultyList.map((f, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#072A6C]/30 transition-all flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3.5 mb-3">
                            <div className="w-12 h-12 rounded-xl bg-[#072A6C] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                              {f.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-[#072A6C] leading-tight">{f.name}</h4>
                              <span className="text-[11px] text-[#D4AF37] font-bold block">{f.designation}</span>
                            </div>
                          </div>
                          <div className="space-y-1 text-[11px] text-gray-500 font-light">
                            <p><strong className="font-semibold text-gray-700">Qual:</strong> {f.qualification}</p>
                            <p><strong className="font-semibold text-gray-700">Area:</strong> {f.specialization}</p>
                            <p><strong className="font-semibold text-gray-700">Exp:</strong> {f.experience}</p>
                          </div>
                        </div>
                        <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center text-[11px]">
                          <a href={`mailto:${f.email}`} className="text-[#072A6C] hover:text-[#D4AF37] font-semibold flex items-center gap-1 transition-colors">
                            <Mail size={12} /> Contact Email
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ──────────────── 6. PLACEMENTS & INTERNSHIPS ──────────────── */}
              {section.id === "placements" && (
                <div className="space-y-8">
                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-6 bg-gradient-to-br from-[#072A6C] to-[#0B3D91] text-white rounded-2xl text-center shadow-md">
                      <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest block">Highest Package</span>
                      <span className="text-2xl sm:text-3xl font-black mt-1 block">{programData.placements.highestPackage}</span>
                    </div>
                    <div className="p-6 bg-white border border-gray-100 text-gray-800 rounded-2xl text-center shadow-sm">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block">Average Package</span>
                      <span className="text-2xl sm:text-3xl font-black text-[#072A6C] mt-1 block">{programData.placements.averagePackage}</span>
                    </div>
                    <div className="p-6 bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-2xl text-center shadow-sm">
                      <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest block">Placement Rate</span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">{programData.placements.placementRate}</span>
                    </div>
                  </div>

                  {/* Top Recruiters */}
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Top Recruiting Companies</h3>
                    <div className="flex flex-wrap gap-2.5">
                      {programData.placements.topRecruiters.map((comp, i) => (
                        <span key={i} className="px-3.5 py-2 bg-gray-50 border border-gray-100 text-gray-700 text-xs font-bold rounded-xl shadow-2xs">
                          🏢 {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Placed Student Highlights */}
                  {programData.placements.placedStudents.length > 0 && (
                    <div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">Placed Student Spotlights</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {programData.placements.placedStudents.map((s, i) => (
                          <div key={i} className="bg-gray-50/70 border border-gray-100 p-4 rounded-2xl">
                            <span className="text-xs font-black text-[#072A6C] block">{s.name}</span>
                            <span className="text-[11px] font-bold text-[#D4AF37] block mt-0.5">{s.company}</span>
                            <span className="text-[11px] text-emerald-600 font-black mt-1 block">{s.package}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{s.role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 7. INFRASTRUCTURE & LABS ──────────────── */}
              {section.id === "labs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programData.laboratories.map((lab, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 hover:border-[#072A6C]/30 transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-black text-[#072A6C] leading-snug">{lab.name}</h3>
                        <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] font-black px-2.5 py-1 rounded-md shrink-0">
                          {lab.capacity}
                        </span>
                      </div>

                      {lab.equipment && lab.equipment.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-1.5">Hardware & Workstations</span>
                          <ul className="space-y-1">
                            {lab.equipment.map((eq, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-center gap-1.5 font-light">
                                <span className="w-1 h-1 rounded-full bg-[#072A6C]" /> {eq}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {lab.software && lab.software.length > 0 && (
                        <div>
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block mb-1.5">Installed Software & Toolkits</span>
                          <div className="flex flex-wrap gap-1.5">
                            {lab.software.map((sw, idx) => (
                              <span key={idx} className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                                {sw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* ──────────────── 8. ACHIEVEMENTS & ACCREDITATIONS ──────────────── */}
              {section.id === "achievements" && (
                <div className="space-y-4">
                  {programData.achievements.map((ach, i) => (
                    <div key={i} className="p-5 bg-gray-50/70 border-l-4 border-[#D4AF37] rounded-r-2xl space-y-1">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-black text-[#072A6C]">{ach.title}</h3>
                        <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600">{ach.year}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-light leading-relaxed">{ach.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ──────────────── 9. SYLLABUS & ACADEMIC CALENDAR ──────────────── */}
              {section.id === "syllabus" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <span className="text-xs font-black text-[#072A6C] block">{programData.syllabus.regulation}</span>
                      <span className="text-[11px] text-gray-500 font-light">Outcome-Based Education (OBE) Curriculum Model</span>
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
                        className="px-4 py-2 bg-[#072A6C] hover:bg-[#0B3D91] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download size={13} /> Download Syllabus PDF
                      </a>
                      <Link
                        to="/academics/calendar"
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:text-[#072A6C] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Calendar size={13} /> View Academic Calendar
                      </Link>
                    </div>
                  </div>

                  {/* Semester Breakdown Accordion / Tabs */}
                  {programData.syllabus.semesters.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {programData.syllabus.semesters.map((sem, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSyllabusSem(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                              syllabusSem === idx
                                ? "bg-[#D4AF37] text-white shadow-xs"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {sem.semNumber} ({sem.credits} Credits)
                          </button>
                        ))}
                      </div>

                      {/* Current Semester Subject Table */}
                      <div className="overflow-x-auto rounded-xl border border-gray-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#072A6C] text-white uppercase text-[10px] tracking-wider">
                            <tr>
                              <th className="py-2.5 px-4">Subject Code</th>
                              <th className="py-2.5 px-4">Subject Title</th>
                              <th className="py-2.5 px-4">Course Type</th>
                              <th className="py-2.5 px-4 text-center">Credits</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {programData.syllabus.semesters[syllabusSem]?.subjects.map((sub, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/80">
                                <td className="py-2.5 px-4 font-mono font-bold text-[#072A6C]">{sub.code}</td>
                                <td className="py-2.5 px-4 font-medium text-gray-800">{sub.name}</td>
                                <td className="py-2.5 px-4">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                    {sub.type}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 font-bold text-center text-[#D4AF37]">{sub.credits}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 10. DEPARTMENT LIBRARY ──────────────── */}
              {section.id === "library" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-3">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Physical Holdings</span>
                    <div className="space-y-2 text-xs text-gray-700 font-medium">
                      <p>📚 <strong className="text-[#072A6C] font-black">{programData.library.volumesCount}</strong> Volumes</p>
                      <p>📖 <strong className="text-[#072A6C] font-black">{programData.library.titlesCount}</strong> Titles</p>
                      <p>📰 <strong className="text-[#072A6C] font-black">{programData.library.nationalJournals}</strong></p>
                      <p>🌐 <strong className="text-[#072A6C] font-black">{programData.library.internationalJournals}</strong></p>
                    </div>
                  </div>

                  <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-3">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Digital Subscriptions</span>
                    <div className="flex flex-wrap gap-1.5">
                      {programData.library.digitalAccess.map((d, i) => (
                        <span key={i} className="text-[11px] font-bold bg-white border border-gray-200 text-[#072A6C] px-2.5 py-1 rounded-md">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50/70 p-6 rounded-2xl border border-gray-100 space-y-3">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">E-Resources & DELNET</span>
                    <ul className="space-y-1.5 text-xs text-gray-600 font-light">
                      {programData.library.eResources.map((res, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span>{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ──────────────── 11. NEWS LETTERS ──────────────── */}
              {section.id === "newsletters" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {programData.newsletters.length > 0 ? (
                    programData.newsletters.map((nl, i) => (
                      <div key={i} className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-wider">{nl.volume} • {nl.issue}</span>
                          <h4 className="text-xs sm:text-sm font-black text-[#072A6C] mt-1">{nl.title}</h4>
                          <span className="text-[11px] text-gray-500 font-light block mt-1">Period: {nl.period}</span>
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
                    <div className="col-span-3 text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                      Information will be updated soon.
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 12. TECHNICAL MAGAZINES ──────────────── */}
              {section.id === "magazines" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {programData.magazines.length > 0 ? (
                    programData.magazines.map((mag, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-2">
                        <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">{mag.edition}</span>
                        <h4 className="text-base font-black text-[#072A6C]">{mag.title}</h4>
                        <p className="text-xs text-gray-600 font-light"><strong>Theme:</strong> {mag.theme}</p>
                        <p className="text-[11px] text-gray-400"><strong>Editor:</strong> {mag.editor}</p>
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
                    <div className="col-span-2 text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                      Information will be updated soon.
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 13. MEMORANDA OF UNDERSTANDING (MOU) ──────────────── */}
              {section.id === "mou" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {programData.mous.length > 0 ? (
                    programData.mous.map((m, i) => (
                      <div key={i} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-2">
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">{m.validity}</span>
                        <h4 className="text-xs sm:text-sm font-black text-[#072A6C] leading-snug">{m.partner}</h4>
                        <p className="text-[11px] text-gray-500 font-light leading-relaxed">{m.scope}</p>
                        <span className="text-[10px] text-gray-400 block pt-1 border-t border-gray-100">Signed: {m.signedYear}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-4 text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                      Information will be updated soon.
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 14. RESEARCH & DEVELOPMENT ──────────────── */}
              {section.id === "research" && (
                <div className="space-y-6">
                  {/* Research Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-[10px] text-gray-400 font-black uppercase">Publications</span>
                      <span className="text-xl font-black text-[#072A6C] block">{programData.research.publicationsCount}+</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-[10px] text-gray-400 font-black uppercase">Patents Published</span>
                      <span className="text-xl font-black text-[#072A6C] block">{programData.research.patentsPublished}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-[10px] text-gray-400 font-black uppercase">Patents Granted</span>
                      <span className="text-xl font-black text-emerald-600 block">{programData.research.patentsGranted}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-[10px] text-gray-400 font-black uppercase">Active Scholars</span>
                      <span className="text-xl font-black text-[#D4AF37] block">{programData.research.activeScholars}</span>
                    </div>
                  </div>

                  {/* Thrust Areas */}
                  <div>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wider block mb-2">Key Research Thrust Areas</span>
                    <div className="flex flex-wrap gap-2">
                      {programData.research.thrustAreas.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 bg-[#072A6C]/5 text-[#072A6C] text-xs font-bold rounded-xl border border-[#072A6C]/10">
                          🔬 {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Publications */}
                  {programData.research.keyPublications.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <span className="text-xs font-black text-gray-400 uppercase tracking-wider block">Featured Research Articles</span>
                      {programData.research.keyPublications.map((pub, i) => (
                        <div key={i} className="p-4 bg-gray-50/70 rounded-xl border border-gray-100 text-xs space-y-1">
                          <h4 className="font-bold text-[#072A6C]">{pub.title}</h4>
                          <p className="text-gray-500 font-light">{pub.journal} ({pub.year}) — Authors: {pub.authors}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 15. PROFESSIONAL SOCIETIES ──────────────── */}
              {section.id === "societies" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {programData.professionalSocieties.length > 0 ? (
                    programData.professionalSocieties.map((soc, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-3">
                        <span className="text-[10px] text-[#D4AF37] font-black uppercase">{soc.chapterId}</span>
                        <h4 className="text-sm font-black text-[#072A6C]">{soc.name}</h4>
                        <div className="text-[11px] text-gray-500 font-light space-y-1">
                          <p><strong>Counselor:</strong> {soc.counselor}</p>
                          <p><strong>Members:</strong> {soc.membersCount}</p>
                        </div>
                        {soc.recentActivities && (
                          <div className="pt-2 border-t border-gray-100">
                            <span className="text-[10px] text-gray-400 font-bold block mb-1">Recent Activities:</span>
                            <ul className="text-[11px] text-gray-600 list-disc pl-4 space-y-0.5">
                              {soc.recentActivities.map((act, idx) => (
                                <li key={idx}>{act}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                      Information will be updated soon.
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 16. ROLL OF HONOUR ──────────────── */}
              {section.id === "rollOfHonour" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {programData.rollOfHonour.length > 0 ? (
                    programData.rollOfHonour.map((r, i) => (
                      <div key={i} className="bg-amber-50/40 border border-amber-200/50 p-5 rounded-2xl space-y-2">
                        <span className="text-[10px] bg-[#D4AF37] text-white font-black px-2 py-0.5 rounded uppercase">
                          {r.rankOrMedal}
                        </span>
                        <h4 className="text-sm font-black text-[#072A6C]">{r.studentName}</h4>
                        <p className="text-xs text-gray-700"><strong>Batch:</strong> {r.batch} | <strong>CGPA:</strong> {r.cgpa}</p>
                        <p className="text-[11px] text-gray-500 font-light leading-relaxed">{r.achievement}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                      Information will be updated soon.
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 17. FUNDING PROJECTS ──────────────── */}
              {section.id === "fundingProjects" && (
                <div className="space-y-4">
                  {programData.fundingProjects.length > 0 ? (
                    programData.fundingProjects.map((p, i) => (
                      <div key={i} className="p-5 bg-gray-50/70 border border-gray-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-wider">{p.status} • {p.fundingAgency}</span>
                          <h4 className="text-xs sm:text-sm font-black text-[#072A6C]">{p.title}</h4>
                          <p className="text-[11px] text-gray-500 font-light">PI: {p.principalInvestigator} | Duration: {p.duration}</p>
                        </div>
                        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-right shrink-0">
                          <span className="text-[10px] text-gray-400 block uppercase">Sanctioned Grant</span>
                          <span className="text-sm font-black text-[#072A6C]">{p.grantAmount}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                      Information will be updated soon.
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 18. TEACHING INNOVATIONS BY FACULTY ──────────────── */}
              {section.id === "teachingInnovations" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {programData.teachingInnovations.length > 0 ? (
                    programData.teachingInnovations.map((ti, i) => (
                      <div key={i} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-3">
                        <span className="text-[10px] text-[#072A6C] font-black uppercase">Pedagogy Innovation</span>
                        <h4 className="text-sm font-black text-[#072A6C]">{ti.title}</h4>
                        <p className="text-[11px] text-gray-500"><strong>Faculty:</strong> {ti.faculty}</p>
                        <p className="text-xs text-gray-600 font-light leading-relaxed">{ti.methodology}</p>
                        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 font-medium">
                          📈 Impact: {ti.impact}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                      Information will be updated soon.
                    </div>
                  )}
                </div>
              )}

              {/* ──────────────── 19. EVENTS & DEPARTMENT ASSOCIATION ──────────────── */}
              {section.id === "eventsAssociation" && (
                <div className="space-y-8">
                  {/* Association Header */}
                  <div className="p-6 bg-gradient-to-r from-[#072A6C] to-[#0B3D91] text-white rounded-2xl shadow-md space-y-2">
                    <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest block">Student Department Association</span>
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

                  {/* Association Events */}
                  <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Department Technical Events & Fests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {programData.eventsAndAssociation.events.length > 0 ? (
                        programData.eventsAndAssociation.events.map((ev, i) => (
                          <div key={i} className="p-5 bg-gray-50/70 border border-gray-100 rounded-2xl space-y-2">
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-[10px] font-bold bg-[#072A6C]/10 text-[#072A6C] px-2 py-0.5 rounded">
                                {ev.type}
                              </span>
                              <span className="text-[11px] font-bold text-[#D4AF37]">{ev.date}</span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-black text-[#072A6C]">{ev.title}</h4>
                            <p className="text-xs text-gray-600 font-light leading-relaxed">{ev.description}</p>
                            <span className="text-[11px] text-gray-400 font-medium block">📍 Venue: {ev.venue}</span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-xs text-gray-500 italic p-4 bg-gray-50 rounded-xl">
                          Information will be updated soon.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </main>

      {/* ═══ 4. BOTTOM ENQUIRY & ADMISSION BANNER ═══ */}
      <section className="bg-gradient-to-r from-[#072A6C] to-[#0B3D91] text-white py-12 px-5 mt-16 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest">Join Chalapathi University</span>
          <h2 className="text-2xl sm:text-3xl font-black">Begin Your Journey in {programData.shortName}</h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-xl mx-auto font-light">
            Empowering next-generation engineers, creators, and business leaders with world-class curriculum and assured placement pathways.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/admissions/apply"
              className="h-11 px-8 bg-[#D4AF37] hover:bg-[#C9A84C] text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2 shadow-md transition-all active:scale-98"
            >
              Apply Online Now <ArrowRight size={14} />
            </Link>
            <Link
              to="/admissions"
              className="h-11 px-8 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 border border-white/20 transition-colors"
            >
              Admission Guidelines
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
