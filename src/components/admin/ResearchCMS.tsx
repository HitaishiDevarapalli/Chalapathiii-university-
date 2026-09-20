import React, { useState } from "react";
import { 
  Award, Sparkles, BookOpen, Layers, Plus, Trash2, ArrowUp, ArrowDown,
  TrendingUp, FileText, Globe, CheckCircle2, ShieldCheck, Microscope
} from "lucide-react";
import { SectionHeader, ImageField } from "./AdminComponents";

export interface ResearchProjectItem {
  id: string;
  title: string;
  agency: string;
  investigator: string;
  amount: string;
  year: string;
}

export interface ResearchPublicationItem {
  id: string;
  title: string;
  journal: string;
  authors: string;
  year: string;
  link?: string;
}

export interface ResearchThrustArea {
  title: string;
  desc: string;
  icon?: string;
}

export interface ResearchCMSData {
  heroTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  heroImage: string;
  stats: { label: string; value: string }[];
  thrustAreas: ResearchThrustArea[];
  projects: ResearchProjectItem[];
  publications: ResearchPublicationItem[];
}

const DEFAULT_RESEARCH_DATA: ResearchCMSData = {
  heroTitle: "Research & Innovation Ecosystem",
  heroSubtitle: "Fostering cutting-edge research, sponsored projects, and global scientific breakthroughs.",
  heroDesc: "Chalapathi University actively supports doctoral scholars, faculty innovators, and student research teams. Our research centers drive high-impact publications, patent filings, and multidisciplinary technology development in collaboration with national agencies (DST, AICTE, DRDO) and industry leaders.",
  heroImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&fit=crop",
  stats: [
    { label: "Funded Projects", value: "45+" },
    { label: "Scopus / IEEE Papers", value: "350+" },
    { label: "Patents Published", value: "28+" },
    { label: "Specialized Labs", value: "12+" }
  ],
  thrustAreas: [
    { title: "Artificial Intelligence & ML", desc: "Deep neural networks, computer vision, natural language processing, and automated medical diagnostics." },
    { title: "Sustainable Energy & Smart Grids", desc: "Hybrid solar-wind energy harvesting, microgrid optimization, and battery management systems." },
    { title: "IoT, Sensors & Smart Systems", desc: "Decentralized sensor networks, edge compute architectures, and disaster response communication." },
    { title: "Biomedical & Pharmaceutical R&D", desc: "Targeted drug delivery mechanisms, eco-friendly chemical synthesis, and molecular biology assays." },
    { title: "VLSI, Embedded & Microelectronics", desc: "Low-power IC architectures, FPGA hardware accelerators, and wireless telemetry transceivers." }
  ],
  projects: [
    { id: "proj-1", title: "AI-Driven Healthcare Diagnostics Platform for Rural Clinics", agency: "DST - Dept of Science & Technology", investigator: "Dr. K. Chandrasekhar", amount: "₹45 Lakhs", year: "2024 - 2027" },
    { id: "proj-2", title: "Decentralized Self-Healing IoT Mesh for Disaster Early Warning", agency: "AICTE - Research Promotion Scheme", investigator: "Dr. P. V. Ramana", amount: "₹28 Lakhs", year: "2023 - 2025" },
    { id: "proj-3", title: "Hybrid Solar-Wind Microgrid Optimization with Predictive Storage", agency: "MNRE - Ministry of Renewable Energy", investigator: "Dr. M. Srinivasa Rao", amount: "₹36 Lakhs", year: "2024 - 2026" }
  ],
  publications: [
    { id: "pub-1", title: "Optimized Hybrid Solar-Wind Energy Harvesting Models in Islanded Microgrids", journal: "IEEE Transactions on Sustainable Energy (Scopus Q1)", authors: "Dr. M. Srinivasa Rao, et al.", year: "2025", link: "https://doi.org/10.1109/TSTE.2025" },
    { id: "pub-2", title: "Deep Convolutional Neural Networks for Automated Retinal Disease Screening", journal: "Elsevier Computers in Biology and Medicine", authors: "Dr. K. Chandrasekhar, Dr. P. V. Ramana", year: "2024", link: "https://doi.org/10.1016/j.compbiomed.2024" },
    { id: "pub-3", title: "Self-Healing Protocols in Low-Power IoT Mesh Topologies during Crisis Situations", journal: "Springer Wireless Networks", authors: "Dr. P. V. Ramana, Research Scholars Team", year: "2024", link: "https://doi.org/10.1007/s11276-024" }
  ]
};

export interface ResearchCMSProps {
  notifySave: (msg: string) => void;
}

export const ResearchCMS: React.FC<ResearchCMSProps> = ({ notifySave }) => {
  const [researchData, setResearchData] = useState<ResearchCMSData>(() => {
    try {
      const saved = localStorage.getItem("chalapathi_research_cms_data");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_RESEARCH_DATA;
  });

  const [activeSubTab, setActiveSubTab] = useState<"overview" | "thrustAreas" | "projects" | "publications" | "homepage">("overview");

  const saveResearch = () => {
    localStorage.setItem("chalapathi_research_cms_data", JSON.stringify(researchData));
    notifySave("Research & Innovation CMS updated and published live!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="Research & Innovation CMS"
        subtitle="Manage research ecosystem overview, thrust areas, sponsored grants, patents, and Scopus publications"
        icon={Award}
        onSave={saveResearch}
        saveSuccess={false}
        onReset={() => {
          setResearchData(DEFAULT_RESEARCH_DATA);
          localStorage.setItem("chalapathi_research_cms_data", JSON.stringify(DEFAULT_RESEARCH_DATA));
          notifySave("Research data reset to default!");
        }}
        resetLabel="Reset Research"
      />

      {/* Subtab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-gray-200">
        {[
          { id: "overview" as const, label: "🌟 1. Overview & Metrics", icon: Sparkles },
          { id: "thrustAreas" as const, label: `🔬 2. Thrust Areas (${researchData.thrustAreas.length})`, icon: Microscope },
          { id: "projects" as const, label: `📑 3. Sponsored Projects (${researchData.projects.length})`, icon: FileText },
          { id: "publications" as const, label: `📜 4. Publications & Patents (${researchData.publications.length})`, icon: BookOpen },
          { id: "homepage" as const, label: "🏠 5. Homepage Research Showcase & Metrics", icon: Award }
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#072A6C] text-white shadow-md shadow-[#072A6C]/20"
                  : "bg-white text-gray-700 hover:bg-slate-50 border border-gray-200/80"
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#D4AF37]" : "text-gray-400"} />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: Overview & Metrics */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Sparkles size={16} className="text-[#D4AF37]" /> Research Hero Banner & Overview
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Hero Title</label>
                <input
                  type="text"
                  value={researchData.heroTitle}
                  onChange={(e) => setResearchData({ ...researchData, heroTitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Hero Tagline</label>
                <input
                  type="text"
                  value={researchData.heroSubtitle}
                  onChange={(e) => setResearchData({ ...researchData, heroSubtitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Research Ecosystem Description</label>
              <textarea
                rows={3}
                value={researchData.heroDesc}
                onChange={(e) => setResearchData({ ...researchData, heroDesc: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800 leading-relaxed focus:bg-white resize-y"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <ImageField
                label="Research Graphic / Laboratory Banner"
                value={researchData.heroImage}
                defaultValue="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&fit=crop"
                aspectRatio="wide"
                recommendedSize="800 × 500 px"
                onChange={(heroImage) => setResearchData({ ...researchData, heroImage })}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2 pb-3 border-b border-gray-100">
              <TrendingUp size={16} className="text-[#072A6C]" /> Research Key Metrics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {researchData.stats.map((st, sIdx) => (
                <div key={sIdx} className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-1.5">
                  <label className="text-[10px] font-bold text-[#072A6C] uppercase">Metric #{sIdx + 1} Label</label>
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => {
                      const updated = [...researchData.stats];
                      updated[sIdx] = { ...updated[sIdx], label: e.target.value };
                      setResearchData({ ...researchData, stats: updated });
                    }}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                  />
                  <label className="text-[10px] font-bold text-[#D4AF37] uppercase">Value</label>
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => {
                      const updated = [...researchData.stats];
                      updated[sIdx] = { ...updated[sIdx], value: e.target.value };
                      setResearchData({ ...researchData, stats: updated });
                    }}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-black text-[#072A6C]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: Thrust Areas */}
      {activeSubTab === "thrustAreas" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Microscope size={16} className="text-[#072A6C]" /> Core Research Thrust Areas ({researchData.thrustAreas.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Specialized disciplinary domains driving interdisciplinary research</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newArea: ResearchThrustArea = {
                    title: "New Research Domain",
                    desc: "Description of focused research activities, key technologies, and target publications."
                  };
                  setResearchData({ ...researchData, thrustAreas: [...researchData.thrustAreas, newArea] });
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Add Thrust Area
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {researchData.thrustAreas.map((area, aIdx) => (
                <div key={aIdx} className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3 relative group hover:border-[#072A6C]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#072A6C] bg-white px-2 py-0.5 rounded border border-gray-200">
                      #{aIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = researchData.thrustAreas.filter((_, i) => i !== aIdx);
                        setResearchData({ ...researchData, thrustAreas: updated });
                      }}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={area.title}
                    onChange={(e) => {
                      const updated = [...researchData.thrustAreas];
                      updated[aIdx] = { ...updated[aIdx], title: e.target.value };
                      setResearchData({ ...researchData, thrustAreas: updated });
                    }}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                    placeholder="Thrust Area Title"
                  />
                  <textarea
                    rows={3}
                    value={area.desc}
                    onChange={(e) => {
                      const updated = [...researchData.thrustAreas];
                      updated[aIdx] = { ...updated[aIdx], desc: e.target.value };
                      setResearchData({ ...researchData, thrustAreas: updated });
                    }}
                    className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-700 leading-relaxed resize-y"
                    placeholder="Domain description..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: Sponsored Projects */}
      {activeSubTab === "projects" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <FileText size={16} className="text-[#072A6C]" /> Sponsored Research Grants & Projects ({researchData.projects.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Externally funded grants by DST, AICTE, DRDO, and private corporate research sponsors</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newProj: ResearchProjectItem = {
                    id: `proj-${Date.now()}`,
                    title: "New Sponsored Project Title",
                    agency: "DST / AICTE / Industry Partner",
                    investigator: "Dr. Faculty Name",
                    amount: "₹25 Lakhs",
                    year: "2025 - 2028"
                  };
                  setResearchData({ ...researchData, projects: [...researchData.projects, newProj] });
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {researchData.projects.map((proj, pIdx) => (
                <div key={proj.id || pIdx} className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#072A6C]">Project #{pIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = researchData.projects.filter((_, i) => i !== pIdx);
                        setResearchData({ ...researchData, projects: updated });
                      }}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => {
                      const updated = [...researchData.projects];
                      updated[pIdx] = { ...updated[pIdx], title: e.target.value };
                      setResearchData({ ...researchData, projects: updated });
                    }}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-gray-800"
                    placeholder="Project Title"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                    <input
                      type="text"
                      value={proj.agency}
                      onChange={(e) => {
                        const updated = [...researchData.projects];
                        updated[pIdx] = { ...updated[pIdx], agency: e.target.value };
                        setResearchData({ ...researchData, projects: updated });
                      }}
                      className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                      placeholder="Funding Agency"
                    />
                    <input
                      type="text"
                      value={proj.investigator}
                      onChange={(e) => {
                        const updated = [...researchData.projects];
                        updated[pIdx] = { ...updated[pIdx], investigator: e.target.value };
                        setResearchData({ ...researchData, projects: updated });
                      }}
                      className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                      placeholder="Principal Investigator"
                    />
                    <input
                      type="text"
                      value={proj.amount}
                      onChange={(e) => {
                        const updated = [...researchData.projects];
                        updated[pIdx] = { ...updated[pIdx], amount: e.target.value };
                        setResearchData({ ...researchData, projects: updated });
                      }}
                      className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#D4AF37]"
                      placeholder="Grant Amount"
                    />
                    <input
                      type="text"
                      value={proj.year}
                      onChange={(e) => {
                        const updated = [...researchData.projects];
                        updated[pIdx] = { ...updated[pIdx], year: e.target.value };
                        setResearchData({ ...researchData, projects: updated });
                      }}
                      className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                      placeholder="Duration (e.g. 2024-2027)"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: Publications */}
      {activeSubTab === "publications" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <BookOpen size={16} className="text-[#072A6C]" /> Indexed Publications & Patents Showcase ({researchData.publications.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Scopus, Web of Science, IEEE Xplore, and published intellectual property archives</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newPub: ResearchPublicationItem = {
                    id: `pub-${Date.now()}`,
                    title: "New Research Publication Title",
                    journal: "International Journal of Engineering (Scopus)",
                    authors: "Faculty Name, Co-Author",
                    year: "2025",
                    link: "https://doi.org/10.1016/sample"
                  };
                  setResearchData({ ...researchData, publications: [...researchData.publications, newPub] });
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Add Publication
              </button>
            </div>

            <div className="space-y-3">
              {researchData.publications.map((pub, uIdx) => (
                <div key={pub.id || uIdx} className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#072A6C]">Publication #{uIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = researchData.publications.filter((_, i) => i !== uIdx);
                        setResearchData({ ...researchData, publications: updated });
                      }}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={pub.title}
                    onChange={(e) => {
                      const updated = [...researchData.publications];
                      updated[uIdx] = { ...updated[uIdx], title: e.target.value };
                      setResearchData({ ...researchData, publications: updated });
                    }}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-gray-800"
                    placeholder="Paper Title"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      value={pub.journal}
                      onChange={(e) => {
                        const updated = [...researchData.publications];
                        updated[uIdx] = { ...updated[uIdx], journal: e.target.value };
                        setResearchData({ ...researchData, publications: updated });
                      }}
                      className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                      placeholder="Journal / Conference Name"
                    />
                    <input
                      type="text"
                      value={pub.authors}
                      onChange={(e) => {
                        const updated = [...researchData.publications];
                        updated[uIdx] = { ...updated[uIdx], authors: e.target.value };
                        setResearchData({ ...researchData, publications: updated });
                      }}
                      className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                      placeholder="Authors (e.g. Dr. Name, et al.)"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={pub.year}
                        onChange={(e) => {
                          const updated = [...researchData.publications];
                          updated[uIdx] = { ...updated[uIdx], year: e.target.value };
                          setResearchData({ ...researchData, publications: updated });
                        }}
                        className="w-20 h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                        placeholder="Year"
                      />
                      <input
                        type="text"
                        value={pub.link || ""}
                        onChange={(e) => {
                          const updated = [...researchData.publications];
                          updated[uIdx] = { ...updated[uIdx], link: e.target.value };
                          setResearchData({ ...researchData, publications: updated });
                        }}
                        className="flex-1 h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                        placeholder="DOI / Paper URL"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: Homepage Research Showcase & Metrics */}
      {activeSubTab === "homepage" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Award size={16} className="text-[#D4AF37]" /> Homepage Research Highlights & Metrics
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Control how research accomplishments, funded grant totals, and patent counters appear on the main website homepage</p>
              </div>
              <button
                onClick={saveResearch}
                className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                Save Research Showcase
              </button>
            </div>

            {/* 4 Homepage Metric Counters */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-700 uppercase block">
                Homepage Research Statistics Counters (4 Live Badges)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {researchData.stats.map((st, sIdx) => (
                  <div key={sIdx} className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl space-y-2">
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase">Metric #{sIdx + 1}</span>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Number Value</label>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const updated = [...researchData.stats];
                          updated[sIdx] = { ...updated[sIdx], value: e.target.value };
                          setResearchData({ ...researchData, stats: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-black text-[#072A6C]"
                        placeholder="e.g. 45+"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Label Text</label>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const updated = [...researchData.stats];
                          updated[sIdx] = { ...updated[sIdx], label: e.target.value };
                          setResearchData({ ...researchData, stats: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-semibold text-gray-700"
                        placeholder="e.g. Funded Projects"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Homepage Thrust Areas Showcase Teaser */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-gray-700 uppercase">
                  Featured Research Thrust Badges on Homepage
                </label>
                <span className="text-[10px] text-gray-400">Pills displayed across homepage showcase</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {researchData.thrustAreas.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/70 border border-blue-200 text-[#072A6C] rounded-xl text-xs font-bold"
                  >
                    🔬 {t.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Grant Spotlight */}
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
              <span className="text-[10px] font-bold text-amber-800 uppercase font-mono tracking-wider block">
                FEATURED HIGH-IMPACT SPONSORED PROJECT SPOTLIGHT
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[#072A6C]">{researchData.projects[0]?.title || "Research Project"}</h4>
                  <p className="text-[11px] text-gray-600">Investigator: {researchData.projects[0]?.investigator} • Agency: {researchData.projects[0]?.agency}</p>
                </div>
                <span className="text-sm font-black text-[#D4AF37] shrink-0 bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-2xs">
                  {researchData.projects[0]?.amount || "₹45 Lakhs"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
