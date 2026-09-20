import React from "react";
import { 
  Briefcase, Sparkles, GraduationCap, Building, Layers, Handshake, LayoutDashboard,
  Plus, Trash2, ArrowUp, ArrowDown, Trophy, TrendingUp, CheckCircle2, Clock, X,
  Image as ImageIcon, BookOpen, Award, Eye
} from "lucide-react";
import { 
  PlacementsContent, 
  PlacedStudent, 
  Recruiter, 
  SuccessStory, 
  DEFAULT_INDUSTRIES, 
  INITIAL_PLACEMENTS_CONTENT 
} from "../../context/DataContext";
import { SectionHeader, ImageField } from "./AdminComponents";

export interface PlacementsCMSProps {
  placementsForm: PlacementsContent;
  setPlacementsForm: React.Dispatch<React.SetStateAction<PlacementsContent>>;
  placementsSubTab: "pageOverview" | "placedStudents" | "industries" | "programsCell" | "recruiters" | "homepage";
  setPlacementsSubTab: (tab: "pageOverview" | "placedStudents" | "industries" | "programsCell" | "recruiters" | "homepage") => void;
  placementsSectionData: {
    title: string;
    subtitle: string;
    highestPackage: string;
    averagePackage: string;
    placementPercent: string;
    buttonText: string;
    buttonUrl: string;
  };
  setPlacementsSectionData: React.Dispatch<React.SetStateAction<any>>;
  storiesList: SuccessStory[];
  setStoriesList: React.Dispatch<React.SetStateAction<SuccessStory[]>>;
  activeStoryIdx: number;
  setActiveStoryIdx: React.Dispatch<React.SetStateAction<number>>;
  newSkillText: string;
  setNewSkillText: React.Dispatch<React.SetStateAction<string>>;
  savePlacements: () => void;
  saveSuccess: boolean;
  notifySave: (msg: string) => void;
  updatePlacementsContent: (content: PlacementsContent) => void;
}

export const PlacementsCMS: React.FC<PlacementsCMSProps> = ({
  placementsForm,
  setPlacementsForm,
  placementsSubTab,
  setPlacementsSubTab,
  placementsSectionData,
  setPlacementsSectionData,
  storiesList,
  setStoriesList,
  activeStoryIdx,
  setActiveStoryIdx,
  newSkillText,
  setNewSkillText,
  savePlacements,
  saveSuccess,
  notifySave,
  updatePlacementsContent
}) => {
  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="Placements & Recruiters CMS"
        subtitle="Manage placement page hero, placed students, industries, career programs, recruiters, and homepage stories"
        icon={Briefcase}
        onSave={savePlacements}
        saveSuccess={saveSuccess}
        onReset={() => {
          setPlacementsForm(INITIAL_PLACEMENTS_CONTENT);
          updatePlacementsContent(INITIAL_PLACEMENTS_CONTENT);
          notifySave("Placements content reset to default!");
        }}
        resetLabel="Reset Placements"
      />

      {/* Subtab Navigation - Real Page on Top, Homepage at Bottom */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-gray-200">
        {[
          { id: "pageOverview" as const, label: "🌟 1. Page Hero & Stats (Top)", icon: Sparkles },
          { id: "placedStudents" as const, label: `🎓 2. Placed Students (${placementsForm.placedStudents?.length || 0})`, icon: GraduationCap },
          { id: "industries" as const, label: `🏭 3. Industries We Cater (${(placementsForm.industries || []).length})`, icon: Building },
          { id: "programsCell" as const, label: "📋 4. Programs, Connect & Cell", icon: Layers },
          { id: "recruiters" as const, label: `🏢 5. Recruiters Marquee (${(placementsForm.recruiters || []).length})`, icon: Handshake },
          { id: "homepage" as const, label: "🏠 6. Homepage Placement Content (Bottom)", icon: LayoutDashboard }
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = placementsSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setPlacementsSubTab(sub.id)}
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

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 1: PAGE HERO, STATS & PHILOSOPHY         */}
      {/* ──────────────────────────────────────────────── */}
      {placementsSubTab === "pageOverview" && (
        <div className="space-y-6">
          {/* Hero Banner & Overview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Sparkles size={16} className="text-[#D4AF37]" /> Placement Page Hero Banner & Overview
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Edit hero badge, heading, tagline, description, and enquire button on /placements</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-[10px] font-bold text-amber-700">
                Top Hero Section
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Top Badge Text</label>
                <input
                  type="text"
                  value={placementsForm.badgeText ?? "A STEP TOWARDS SUCCESS!"}
                  onChange={(e) => setPlacementsForm({ ...placementsForm, badgeText: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C] focus:bg-white"
                  placeholder="A STEP TOWARDS SUCCESS!"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Enquire Button Text</label>
                <input
                  type="text"
                  value={placementsForm.enquireButtonText ?? "ENQUIRE NOW"}
                  onChange={(e) => setPlacementsForm({ ...placementsForm, enquireButtonText: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C] focus:bg-white"
                  placeholder="ENQUIRE NOW"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Main Heading (Title)</label>
                <input
                  type="text"
                  value={placementsForm.heroTitle}
                  onChange={(e) => setPlacementsForm({ ...placementsForm, heroTitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                  placeholder="A STEP TOWARDS SUCCESS!"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Subheading (Tagline)</label>
                <input
                  type="text"
                  value={placementsForm.heroSubtitle}
                  onChange={(e) => setPlacementsForm({ ...placementsForm, heroSubtitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                  placeholder="Building Careers. Creating Leaders."
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Hero Overview Description</label>
              <textarea
                rows={3}
                value={placementsForm.heroDescription}
                onChange={(e) => setPlacementsForm({ ...placementsForm, heroDescription: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800 leading-relaxed focus:bg-white resize-y"
                placeholder="Detailed introduction to placement opportunities at Chalapathi University..."
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1.5">
                <ImageIcon size={13} className="text-[#072A6C]" /> Hero Illustration / Graphic Image
              </label>
              <ImageField
                label="Hero Graphic Banner"
                value={placementsForm.heroImage || "/placementhero.png"}
                defaultValue="/placementhero.png"
                aspectRatio="wide"
                recommendedSize="800 × 500 px"
                onChange={(heroImage) => setPlacementsForm({ ...placementsForm, heroImage })}
                onReset={() => setPlacementsForm({ ...placementsForm, heroImage: "/placementhero.png" })}
              />
            </div>
          </div>

          {/* Key Stats Highlights */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Trophy size={16} className="text-[#072A6C]" /> Key Placement Metrics & Stats
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Top stats shown on the Placement Page and Homepage</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-1.5">
                <label className="text-[10px] font-bold text-[#D4AF37] uppercase flex items-center gap-1">
                  <Trophy size={12} /> Highest Package
                </label>
                <input
                  type="text"
                  value={placementsForm.highestPackage}
                  onChange={(e) => {
                    const val = e.target.value;
                    const currentStats = placementsForm.stats || [
                      { value: "92%", label: "Students Placed", icon: "Users" },
                      { value: val, label: "Highest Package", icon: "Trophy" },
                      { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                      { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                    ];
                    const updated = [...currentStats];
                    if (updated[1]) updated[1] = { ...updated[1], value: val };
                    setPlacementsForm({ ...placementsForm, highestPackage: val, stats: updated });
                  }}
                  className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-black text-[#072A6C]"
                  placeholder="30 LPA"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-1.5">
                <label className="text-[10px] font-bold text-[#072A6C] uppercase flex items-center gap-1">
                  <TrendingUp size={12} /> Average Package
                </label>
                <input
                  type="text"
                  value={placementsForm.averagePackage}
                  onChange={(e) => setPlacementsForm({ ...placementsForm, averagePackage: e.target.value })}
                  className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-black text-[#072A6C]"
                  placeholder="₹5.5 LPA"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-1.5">
                <label className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                  <CheckCircle2 size={12} /> Placement Record
                </label>
                <input
                  type="text"
                  value={placementsForm.placementPercent}
                  onChange={(e) => {
                    const val = e.target.value;
                    const currentStats = placementsForm.stats || [
                      { value: val, label: "Students Placed", icon: "Users" },
                      { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                      { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                      { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                    ];
                    const updated = [...currentStats];
                    if (updated[0]) updated[0] = { ...updated[0], value: val };
                    setPlacementsForm({ ...placementsForm, placementPercent: val, stats: updated });
                  }}
                  className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-black text-[#072A6C]"
                  placeholder="92%"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-1.5">
                <label className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                  <Handshake size={12} /> Corporate Partners
                </label>
                <input
                  type="text"
                  value={placementsForm.corporatePartnersCount ?? "116+"}
                  onChange={(e) => {
                    const val = e.target.value;
                    const currentStats = placementsForm.stats || [
                      { value: "92%", label: "Students Placed", icon: "Users" },
                      { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                      { value: val, label: "Corporate Partners", icon: "Handshake" },
                      { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                    ];
                    const updated = [...currentStats];
                    if (updated[2]) updated[2] = { ...updated[2], value: val };
                    setPlacementsForm({ ...placementsForm, corporatePartnersCount: val, stats: updated });
                  }}
                  className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-black text-[#072A6C]"
                  placeholder="116+"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-1.5">
                <label className="text-[10px] font-bold text-purple-600 uppercase flex items-center gap-1">
                  <GraduationCap size={12} /> Assistance
                </label>
                <input
                  type="text"
                  value={placementsForm.placementAssistance ?? "100%"}
                  onChange={(e) => {
                    const val = e.target.value;
                    const currentStats = placementsForm.stats || [
                      { value: "92%", label: "Students Placed", icon: "Users" },
                      { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                      { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                      { value: val, label: "Placement Assistance", icon: "GraduationCap" }
                    ];
                    const updated = [...currentStats];
                    if (updated[3]) updated[3] = { ...updated[3], value: val };
                    setPlacementsForm({ ...placementsForm, placementAssistance: val, stats: updated });
                  }}
                  className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-black text-[#072A6C]"
                  placeholder="100%"
                />
              </div>
            </div>
          </div>

          {/* Placement Philosophy */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Award size={16} className="text-[#D4AF37]" /> Placement Philosophy & Approach
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Narrative statement on Chalapathi University's career vision and methodology</p>
              </div>
            </div>
            <div className="space-y-1.5 max-w-md">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Philosophy Heading</label>
              <input
                type="text"
                value={placementsForm.philosophyTitle ?? "Our Placement Philosophy"}
                onChange={(e) => setPlacementsForm({ ...placementsForm, philosophyTitle: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                placeholder="Our Placement Philosophy"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Philosophy Description</label>
              <textarea
                rows={4}
                value={placementsForm.philosophyText}
                onChange={(e) => setPlacementsForm({ ...placementsForm, philosophyText: e.target.value })}
                className="w-full p-3.5 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800 leading-relaxed focus:bg-white resize-y"
                placeholder="Enter placement philosophy narrative..."
              />
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 2: PLACED STUDENTS GALLERY (Photo 1)      */}
      {/* ──────────────────────────────────────────────── */}
      {placementsSubTab === "placedStudents" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <GraduationCap size={16} className="text-[#072A6C]" /> Placed Students Hall of Fame ({placementsForm.placedStudents?.length || 0} Students)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage placed student cards: Photo, Name, Branch, Company, and CTC Package</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPlacementsForm({
                      ...placementsForm,
                      recentPlacementsBadge: "OUR PLACED STARS",
                      recentPlacementsTitle: "RECENT PLACEMENTS",
                      placedStudents: INITIAL_PLACEMENTS_CONTENT.placedStudents
                    });
                    notifySave("Reset placed students to default!");
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Reset Default Students
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newStudent: PlacedStudent = {
                      name: "New Student",
                      branch: "B.Tech CSE",
                      company: "Tech Giant",
                      ctc: "12 LPA",
                      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop"
                    };
                    setPlacementsForm({
                      ...placementsForm,
                      placedStudents: [newStudent, ...(placementsForm.placedStudents || [])]
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus size={14} /> Add Placed Student
                </button>
              </div>
            </div>

            {/* Section Badge & Heading Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#D4AF37] uppercase">Top Badge Text</label>
                <input
                  type="text"
                  value={placementsForm.recentPlacementsBadge ?? "OUR PLACED STARS"}
                  onChange={(e) => setPlacementsForm({ ...placementsForm, recentPlacementsBadge: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#D4AF37]"
                  placeholder="OUR PLACED STARS"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#072A6C] uppercase">Section Heading (Title)</label>
                <input
                  type="text"
                  value={placementsForm.recentPlacementsTitle ?? "RECENT PLACEMENTS"}
                  onChange={(e) => setPlacementsForm({ ...placementsForm, recentPlacementsTitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-black text-[#072A6C]"
                  placeholder="RECENT PLACEMENTS"
                />
              </div>
            </div>

            {/* Student cards grid with compact ImageField - No overflow */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {placementsForm.placedStudents?.map((student, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group hover:border-[#072A6C]/40 transition-all flex flex-col justify-between min-w-0 overflow-hidden"
                >
                  <div className="space-y-3 min-w-0">
                    {/* Card Top Action Bar */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-[#072A6C] bg-white px-2 py-0.5 rounded-md border border-gray-200">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...placementsForm.placedStudents];
                              const temp = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = temp;
                              setPlacementsForm({ ...placementsForm, placedStudents: updated });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded"
                            title="Move Left/Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                        )}
                        {idx < (placementsForm.placedStudents.length - 1) && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...placementsForm.placedStudents];
                              const temp = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = temp;
                              setPlacementsForm({ ...placementsForm, placedStudents: updated });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded"
                            title="Move Right/Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = placementsForm.placedStudents.filter((_, i) => i !== idx);
                            setPlacementsForm({ ...placementsForm, placedStudents: updated });
                          }}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Student"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Name & Package */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Student Name</label>
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => {
                          const updated = [...placementsForm.placedStudents];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setPlacementsForm({ ...placementsForm, placedStudents: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-gray-800"
                        placeholder="e.g. John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#D4AF37] uppercase">Package CTC</label>
                        <input
                          type="text"
                          value={student.ctc}
                          onChange={(e) => {
                            const updated = [...placementsForm.placedStudents];
                            updated[idx] = { ...updated[idx], ctc: e.target.value };
                            setPlacementsForm({ ...placementsForm, placedStudents: updated });
                          }}
                          className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg font-extrabold text-[#D4AF37]"
                          placeholder="e.g. 12 LPA"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#072A6C] uppercase">Company</label>
                        <input
                          type="text"
                          value={student.company}
                          onChange={(e) => {
                            const updated = [...placementsForm.placedStudents];
                            updated[idx] = { ...updated[idx], company: e.target.value };
                            setPlacementsForm({ ...placementsForm, placedStudents: updated });
                          }}
                          className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                          placeholder="e.g. Microsoft"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Branch / Dept</label>
                      <input
                        type="text"
                        value={student.branch}
                        onChange={(e) => {
                          const updated = [...placementsForm.placedStudents];
                          updated[idx] = { ...updated[idx], branch: e.target.value };
                          setPlacementsForm({ ...placementsForm, placedStudents: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                        placeholder="e.g. B.Tech CSE"
                      />
                    </div>

                    {/* Photo with compact layout */}
                    <div className="pt-2 border-t border-gray-200/60 min-w-0">
                      <ImageField
                        label="Student Photo"
                        compact={true}
                        value={student.img}
                        defaultValue={INITIAL_PLACEMENTS_CONTENT.placedStudents[idx]?.img || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop"}
                        aspectRatio="portrait"
                        recommendedSize="400 × 500 px"
                        onChange={(img) => {
                          const updated = [...placementsForm.placedStudents];
                          updated[idx] = { ...updated[idx], img };
                          setPlacementsForm({ ...placementsForm, placedStudents: updated });
                        }}
                        onReset={() => {
                          const updated = [...placementsForm.placedStudents];
                          updated[idx] = { ...updated[idx], img: INITIAL_PLACEMENTS_CONTENT.placedStudents[idx]?.img || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop" };
                          setPlacementsForm({ ...placementsForm, placedStudents: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 3: INDUSTRIES WE CATER (Photo 4)          */}
      {/* ──────────────────────────────────────────────── */}
      {placementsSubTab === "industries" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Building size={16} className="text-[#072A6C]" /> Industries We Cater Section (Photo 4)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage industry categories, photos, and titles shown on /placements</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPlacementsForm({
                      ...placementsForm,
                      industriesTitle: "INDUSTRIES WE CATER",
                      industries: DEFAULT_INDUSTRIES
                    });
                    notifySave("Reset industries to default 9 categories!");
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Reset Default Industries
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newInd = {
                      name: "NEW INDUSTRY SECTOR",
                      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&fit=crop"
                    };
                    setPlacementsForm({
                      ...placementsForm,
                      industries: [...(placementsForm.industries || DEFAULT_INDUSTRIES), newInd]
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus size={14} /> Add Industry Sector
                </button>
              </div>
            </div>

            {/* Section Title */}
            <div className="space-y-1.5 max-w-md">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Section Heading</label>
              <input
                type="text"
                value={placementsForm.industriesTitle ?? "INDUSTRIES WE CATER"}
                onChange={(e) => setPlacementsForm({ ...placementsForm, industriesTitle: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                placeholder="INDUSTRIES WE CATER"
              />
            </div>

            {/* Industry Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(placementsForm.industries || DEFAULT_INDUSTRIES).map((ind, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group hover:border-[#072A6C]/40 transition-all flex flex-col justify-between min-w-0 overflow-hidden"
                >
                  <div className="space-y-3 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-[#072A6C] bg-white px-2 py-0.5 rounded-md border border-gray-200">
                        #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(placementsForm.industries || DEFAULT_INDUSTRIES)];
                              const temp = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = temp;
                              setPlacementsForm({ ...placementsForm, industries: updated });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                        )}
                        {idx < ((placementsForm.industries || DEFAULT_INDUSTRIES).length - 1) && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(placementsForm.industries || DEFAULT_INDUSTRIES)];
                              const temp = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = temp;
                              setPlacementsForm({ ...placementsForm, industries: updated });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (placementsForm.industries || DEFAULT_INDUSTRIES).filter((_, i) => i !== idx);
                            setPlacementsForm({ ...placementsForm, industries: updated });
                          }}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Industry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Industry Title</label>
                      <input
                        type="text"
                        value={ind.name}
                        onChange={(e) => {
                          const updated = [...(placementsForm.industries || DEFAULT_INDUSTRIES)];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setPlacementsForm({ ...placementsForm, industries: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-gray-800"
                        placeholder="e.g. INFORMATION TECHNOLOGY (IT)"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-200/60 min-w-0">
                      <ImageField
                        label="Card Cover Image"
                        compact={true}
                        value={ind.img}
                        defaultValue={DEFAULT_INDUSTRIES[idx]?.img || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&fit=crop"}
                        aspectRatio="wide"
                        recommendedSize="500 × 350 px"
                        onChange={(img) => {
                          const updated = [...(placementsForm.industries || DEFAULT_INDUSTRIES)];
                          updated[idx] = { ...updated[idx], img };
                          setPlacementsForm({ ...placementsForm, industries: updated });
                        }}
                        onReset={() => {
                          const updated = [...(placementsForm.industries || DEFAULT_INDUSTRIES)];
                          updated[idx] = { ...updated[idx], img: DEFAULT_INDUSTRIES[idx]?.img || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&fit=crop" };
                          setPlacementsForm({ ...placementsForm, industries: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 4: PROGRAMS, CONNECT & CELL (Photo 2)     */}
      {/* ──────────────────────────────────────────────── */}
      {placementsSubTab === "programsCell" && (
        <div className="space-y-6">
          {/* Career Development Programs */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <BookOpen size={16} className="text-[#072A6C]" /> Career Development Programs (Bullet Items)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Edit list of specialized training tracks and certification modules</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(placementsForm.careerPrograms || [])];
                  updated.push("New Career Development Module");
                  setPlacementsForm({ ...placementsForm, careerPrograms: updated });
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Add Program Item
              </button>
            </div>

            <div className="space-y-1.5 max-w-md">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Section Heading</label>
              <input
                type="text"
                value={placementsForm.careerProgramsTitle ?? "CAREER DEVELOPMENT PROGRAMS"}
                onChange={(e) => setPlacementsForm({ ...placementsForm, careerProgramsTitle: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                placeholder="CAREER DEVELOPMENT PROGRAMS"
              />
            </div>

            <div className="space-y-2.5">
              {placementsForm.careerPrograms?.map((prog, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 flex items-center justify-center bg-slate-100 text-[#072A6C] font-black rounded-lg text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={prog}
                    onChange={(e) => {
                      const updated = [...placementsForm.careerPrograms];
                      updated[idx] = e.target.value;
                      setPlacementsForm({ ...placementsForm, careerPrograms: updated });
                    }}
                    className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800 font-medium focus:bg-white"
                    placeholder="e.g. Technical Skill Enhancement: Coding Bootcamps..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = placementsForm.careerPrograms.filter((_, i) => i !== idx);
                      setPlacementsForm({ ...placementsForm, careerPrograms: updated });
                    }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Program Item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Industry Connect */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#D4AF37] uppercase flex items-center gap-2">
                  <Handshake size={16} className="text-[#D4AF37]" /> Industry Connect & Partnerships
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Corporate linkages, guest lectures, internships, and live projects</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(placementsForm.industryConnectItems || [])];
                  updated.push("New Industry Connect Feature");
                  setPlacementsForm({ ...placementsForm, industryConnectItems: updated });
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Add Connect Point
              </button>
            </div>

            <div className="space-y-1.5 max-w-md">
              <label className="text-[11px] font-bold text-[#D4AF37] uppercase">Section Heading</label>
              <input
                type="text"
                value={placementsForm.industryConnectTitle ?? "INDUSTRY CONNECT"}
                onChange={(e) => setPlacementsForm({ ...placementsForm, industryConnectTitle: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                placeholder="INDUSTRY CONNECT"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Industry Connect Description</label>
              <textarea
                rows={3}
                value={placementsForm.industryConnectDesc}
                onChange={(e) => setPlacementsForm({ ...placementsForm, industryConnectDesc: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800 leading-relaxed focus:bg-white resize-y"
                placeholder="Description of Industry Connect initiative..."
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Star Highlights (Key Points)</label>
              {placementsForm.industryConnectItems?.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => {
                      const updated = [...placementsForm.industryConnectItems];
                      updated[idx] = e.target.value;
                      setPlacementsForm({ ...placementsForm, industryConnectItems: updated });
                    }}
                    className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800 font-medium focus:bg-white"
                    placeholder="e.g. Regular interactions with corporate leaders..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = placementsForm.industryConnectItems.filter((_, i) => i !== idx);
                      setPlacementsForm({ ...placementsForm, industryConnectItems: updated });
                    }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Point"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Placement & Training Cell */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Layers size={16} className="text-[#072A6C]" /> Dedicated Training & Placement Cell (8 Pillars)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Core pillars supporting student career placement success</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(placementsForm.placementCellItems || [])];
                  updated.push({ t: "New Pillar", d: "Description of pillar activities and support." });
                  setPlacementsForm({ ...placementsForm, placementCellItems: updated });
                }}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Add Pillar Card
              </button>
            </div>

            <div className="space-y-1.5 max-w-md">
              <label className="text-[11px] font-bold text-[#072A6C] uppercase">Section Heading</label>
              <input
                type="text"
                value={placementsForm.placementCellTitle ?? "DEDICATED TRAINING & PLACEMENT CELL"}
                onChange={(e) => setPlacementsForm({ ...placementsForm, placementCellTitle: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                placeholder="DEDICATED TRAINING & PLACEMENT CELL"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Placement Cell Overview</label>
              <textarea
                rows={2}
                value={placementsForm.placementCellDesc}
                onChange={(e) => setPlacementsForm({ ...placementsForm, placementCellDesc: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800 leading-relaxed focus:bg-white resize-y"
                placeholder="Overview of Dedicated Training & Placement Cell..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {placementsForm.placementCellItems?.map((pillar, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-2 relative group hover:border-[#072A6C]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#072A6C] bg-white px-2 py-0.5 rounded border border-gray-200">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = placementsForm.placementCellItems.filter((_, i) => i !== idx);
                        setPlacementsForm({ ...placementsForm, placementCellItems: updated });
                      }}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete Pillar"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={pillar.t}
                    onChange={(e) => {
                      const updated = [...placementsForm.placementCellItems];
                      updated[idx] = { ...updated[idx], t: e.target.value };
                      setPlacementsForm({ ...placementsForm, placementCellItems: updated });
                    }}
                    className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                    placeholder="Pillar Title"
                  />
                  <textarea
                    rows={3}
                    value={pillar.d}
                    onChange={(e) => {
                      const updated = [...placementsForm.placementCellItems];
                      updated[idx] = { ...updated[idx], d: e.target.value };
                      setPlacementsForm({ ...placementsForm, placementCellItems: updated });
                    }}
                    className="w-full p-2 text-[11px] bg-white border border-gray-200 rounded-lg text-gray-700 resize-y"
                    placeholder="Pillar description..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 5: TOP RECRUITERS MARQUEE                 */}
      {/* ──────────────────────────────────────────────── */}
      {placementsSubTab === "recruiters" && (
        <div className="space-y-6">
          {/* Marquee Visual Preview */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye size={13} /> Live Partner Marquee Banner Preview
                </h4>
                <p className="text-[11px] text-slate-400">Continuously scrolling corporate partner directory</p>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-bold">
                {placementsForm.recruiters?.length || 0} Logos
              </span>
            </div>
            <div className="overflow-hidden py-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
              <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
                {(placementsForm.recruiters || []).concat(placementsForm.recruiters || []).map((r, i) => (
                  <div key={i} className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                    <img src={r.logo} alt={r.name} className="h-6 w-auto max-w-[80px] object-contain rounded" />
                    <span className="text-xs font-bold text-white">{r.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recruiter Directory Management */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Handshake size={16} className="text-[#072A6C]" /> Corporate Recruiters Directory ({placementsForm.recruiters?.length || 0} Companies)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Upload high-res PNG logos and company titles</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPlacementsForm({
                      ...placementsForm,
                      recruitersBadge: "GLOBAL COLLABORATORS",
                      recruitersTitle: "TOP RECRUITERS VISITED",
                      recruiters: INITIAL_PLACEMENTS_CONTENT.recruiters
                    });
                    notifySave("Reset recruiters to default list!");
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Reset Recruiters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newRecruiter: Recruiter = {
                      name: "New Partner",
                      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&fit=crop"
                    };
                    setPlacementsForm({
                      ...placementsForm,
                      recruiters: [...(placementsForm.recruiters || []), newRecruiter]
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus size={14} /> Add Recruiter Logo
                </button>
              </div>
            </div>

            {/* Section Badge & Heading Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#D4AF37] uppercase">Top Badge Text</label>
                <input
                  type="text"
                  value={placementsForm.recruitersBadge ?? "GLOBAL COLLABORATORS"}
                  onChange={(e) => setPlacementsForm({ ...placementsForm, recruitersBadge: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#D4AF37]"
                  placeholder="GLOBAL COLLABORATORS"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#072A6C] uppercase">Section Heading (Title)</label>
                <input
                  type="text"
                  value={placementsForm.recruitersTitle ?? "TOP RECRUITERS VISITED"}
                  onChange={(e) => setPlacementsForm({ ...placementsForm, recruitersTitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-black text-[#072A6C]"
                  placeholder="TOP RECRUITERS VISITED"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {placementsForm.recruiters?.map((recruiter, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-3 rounded-xl border border-gray-200 space-y-2.5 relative group hover:border-[#072A6C]/40 transition-all flex flex-col justify-between min-w-0 overflow-hidden"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400">#{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = placementsForm.recruiters.filter((_, i) => i !== idx);
                          setPlacementsForm({ ...placementsForm, recruiters: updated });
                        }}
                        className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete Recruiter"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={recruiter.name}
                      onChange={(e) => {
                        const updated = [...placementsForm.recruiters];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setPlacementsForm({ ...placementsForm, recruiters: updated });
                      }}
                      className="w-full h-7 px-2 text-xs bg-white border border-gray-200 rounded font-bold text-gray-800"
                      placeholder="Company Name"
                    />
                    <div className="pt-1 border-t border-gray-200/60 min-w-0">
                      <ImageField
                        label="Logo"
                        compact={true}
                        value={recruiter.logo}
                        defaultValue={INITIAL_PLACEMENTS_CONTENT.recruiters[idx]?.logo || "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&fit=crop"}
                        aspectRatio="square"
                        recommendedSize="200 × 200 px"
                        onChange={(logo) => {
                          const updated = [...placementsForm.recruiters];
                          updated[idx] = { ...updated[idx], logo };
                          setPlacementsForm({ ...placementsForm, recruiters: updated });
                        }}
                        onReset={() => {
                          const updated = [...placementsForm.recruiters];
                          updated[idx] = { ...updated[idx], logo: INITIAL_PLACEMENTS_CONTENT.recruiters[idx]?.logo || "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&fit=crop" };
                          setPlacementsForm({ ...placementsForm, recruiters: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 6: HOMEPAGE PLACEMENT CONTENT (Bottom)    */}
      {/* ──────────────────────────────────────────────── */}
      {placementsSubTab === "homepage" && (
        <div className="space-y-6">
          {/* Homepage Placement Banner Settings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <LayoutDashboard size={16} className="text-[#072A6C]" /> Homepage Placement Banner Section
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Control the placement showcase banner that appears on the Home page</p>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-bold text-blue-700">
                Homepage Component
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Banner Title</label>
                <input
                  type="text"
                  value={placementsSectionData.title}
                  onChange={(e) => setPlacementsSectionData({ ...placementsSectionData, title: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Banner Subtitle</label>
                <input
                  type="text"
                  value={placementsSectionData.subtitle}
                  onChange={(e) => setPlacementsSectionData({ ...placementsSectionData, subtitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Button Text</label>
                <input
                  type="text"
                  value={placementsSectionData.buttonText}
                  onChange={(e) => setPlacementsSectionData({ ...placementsSectionData, buttonText: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Button Link Destination</label>
                <input
                  type="text"
                  value={placementsSectionData.buttonUrl}
                  onChange={(e) => setPlacementsSectionData({ ...placementsSectionData, buttonUrl: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Student Success Stories & 4-Step Career Journeys */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Trophy size={16} className="text-[#D4AF37]" /> Student Success Stories & Career Journeys ({storiesList.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Interactive 4-step transformation timelines and testimonial cards</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newStory: SuccessStory = {
                    id: Date.now(),
                    studentName: "New Achiever",
                    batch: "2024 Batch",
                    packageOffered: "14 LPA",
                    companyName: "Amazon AWS",
                    companyLogo: "/logos/amazon.svg",
                    achievement: "Secured premier Cloud Support Engineer offer",
                    internshipExp: "Completed 6-month corporate internship",
                    department: "B.Tech - Computer Science & Engineering",
                    studentImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop",
                    description: "The practical training and campus culture at Chalapathi helped me secure my dream offer.",
                    milestones: {
                      learningTitle: "Foundations & Coding",
                      learningDesc: "Learned data structures and core computer science fundamentals.",
                      internshipTitle: "Industry Projects",
                      internshipDesc: "Built end-to-end fullstack applications and participated in hackathons.",
                      placementTitle: "Corporate Training",
                      placementDesc: "Cracked multiple mock interviews and technical assessments.",
                      careerTitle: "Campus Offer",
                      careerDesc: "Secured top-tier engineering offer during campus placements."
                    },
                    skills: ["Data Structures", "System Design", "Cloud Computing"]
                  };
                  setStoriesList([...storiesList, newStory]);
                  setActiveStoryIdx(storiesList.length);
                  notifySave("New success story added!");
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Add Success Story
              </button>
            </div>

            {/* Story Selection Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {storiesList.map((story, sIdx) => (
                <button
                  key={story.id || sIdx}
                  type="button"
                  onClick={() => setActiveStoryIdx(sIdx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    activeStoryIdx === sIdx
                      ? "bg-[#072A6C] text-white shadow-sm"
                      : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                  }`}
                >
                  {story.studentName || `Story #${sIdx + 1}`} ({story.companyName || "Company"})
                </button>
              ))}
            </div>

            {/* Active Story Editor */}
            {storiesList[activeStoryIdx] && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-gray-200 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <h4 className="text-xs font-black text-[#072A6C] uppercase">
                    Editing Story #{activeStoryIdx + 1}: {storiesList[activeStoryIdx].studentName}
                  </h4>
                  {storiesList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = storiesList.filter((_, i) => i !== activeStoryIdx);
                        setStoriesList(updated);
                        setActiveStoryIdx(Math.max(0, activeStoryIdx - 1));
                        notifySave("Success story removed.");
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={12} /> Delete Story
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Student Name</label>
                    <input
                      type="text"
                      value={storiesList[activeStoryIdx].studentName}
                      onChange={(e) => {
                        const updated = [...storiesList];
                        updated[activeStoryIdx] = { ...updated[activeStoryIdx], studentName: e.target.value };
                        setStoriesList(updated);
                      }}
                      className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#D4AF37] uppercase">Package CTC</label>
                    <input
                      type="text"
                      value={storiesList[activeStoryIdx].packageOffered}
                      onChange={(e) => {
                        const updated = [...storiesList];
                        updated[activeStoryIdx] = { ...updated[activeStoryIdx], packageOffered: e.target.value };
                        setStoriesList(updated);
                      }}
                      className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-black text-[#D4AF37]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#072A6C] uppercase">Company</label>
                    <input
                      type="text"
                      value={storiesList[activeStoryIdx].companyName}
                      onChange={(e) => {
                        const updated = [...storiesList];
                        updated[activeStoryIdx] = { ...updated[activeStoryIdx], companyName: e.target.value };
                        setStoriesList(updated);
                      }}
                      className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Department / Degree</label>
                    <input
                      type="text"
                      value={storiesList[activeStoryIdx].department}
                      onChange={(e) => {
                        const updated = [...storiesList];
                        updated[activeStoryIdx] = { ...updated[activeStoryIdx], department: e.target.value };
                        setStoriesList(updated);
                      }}
                      className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Student Description & Testimonial</label>
                  <textarea
                    rows={3}
                    value={storiesList[activeStoryIdx].description}
                    onChange={(e) => {
                      const updated = [...storiesList];
                      updated[activeStoryIdx] = { ...updated[activeStoryIdx], description: e.target.value };
                      setStoriesList(updated);
                    }}
                    className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-800 leading-relaxed"
                  />
                </div>

                {/* Student Image */}
                <div className="pt-2 border-t border-gray-200 min-w-0">
                  <ImageField
                    label="Student Portrait Photo"
                    compact={true}
                    value={storiesList[activeStoryIdx].studentImage}
                    defaultValue="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop"
                    aspectRatio="portrait"
                    recommendedSize="500 × 600 px"
                    onChange={(studentImage) => {
                      const updated = [...storiesList];
                      updated[activeStoryIdx] = { ...updated[activeStoryIdx], studentImage };
                      setStoriesList(updated);
                    }}
                    onReset={() => {
                      const updated = [...storiesList];
                      updated[activeStoryIdx] = { ...updated[activeStoryIdx], studentImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop" };
                      setStoriesList(updated);
                    }}
                  />
                </div>

                {/* 4-Step Transformation Milestones */}
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  <label className="text-[11px] font-bold text-[#072A6C] uppercase flex items-center gap-1.5">
                    <Clock size={13} /> 4-Year Transformation Journey Milestones
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { tKey: "learningTitle", dKey: "learningDesc", label: "Year 1 - Learning" },
                      { tKey: "internshipTitle", dKey: "internshipDesc", label: "Year 2 - Projects" },
                      { tKey: "placementTitle", dKey: "placementDesc", label: "Year 3 - Training" },
                      { tKey: "careerTitle", dKey: "careerDesc", label: "Year 4 - Placement" }
                    ].map((step, jIdx) => (
                      <div key={jIdx} className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5">
                        <span className="text-[10px] font-black text-[#D4AF37] uppercase">{step.label}</span>
                        <input
                          type="text"
                          value={(storiesList[activeStoryIdx].milestones as any)?.[step.tKey] || ""}
                          onChange={(e) => {
                            const updated = [...storiesList];
                            const milestones = { ...(updated[activeStoryIdx].milestones || {}), [step.tKey]: e.target.value };
                            updated[activeStoryIdx] = { ...updated[activeStoryIdx], milestones: milestones as any };
                            setStoriesList(updated);
                          }}
                          className="w-full h-7 px-2 text-xs bg-slate-50 border border-gray-200 rounded font-bold text-gray-800"
                          placeholder="Milestone Title"
                        />
                        <textarea
                          rows={2}
                          value={(storiesList[activeStoryIdx].milestones as any)?.[step.dKey] || ""}
                          onChange={(e) => {
                            const updated = [...storiesList];
                            const milestones = { ...(updated[activeStoryIdx].milestones || {}), [step.dKey]: e.target.value };
                            updated[activeStoryIdx] = { ...updated[activeStoryIdx], milestones: milestones as any };
                            setStoriesList(updated);
                          }}
                          className="w-full p-1.5 text-[11px] bg-slate-50 border border-gray-200 rounded text-gray-700 resize-y"
                          placeholder="Milestone Description"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Tag Editor */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <label className="text-[11px] font-bold text-[#072A6C] uppercase">Skills Mastered</label>
                  <div className="flex flex-wrap gap-2 items-center">
                    {storiesList[activeStoryIdx].skills?.map((skill, kIdx) => (
                      <span
                        key={kIdx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...storiesList];
                            const skills = (updated[activeStoryIdx].skills || []).filter((_, i) => i !== kIdx);
                            updated[activeStoryIdx] = { ...updated[activeStoryIdx], skills };
                            setStoriesList(updated);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newSkillText}
                        onChange={(e) => setNewSkillText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newSkillText.trim()) {
                            e.preventDefault();
                            const updated = [...storiesList];
                            const skills = [...(updated[activeStoryIdx].skills || []), newSkillText.trim()];
                            updated[activeStoryIdx] = { ...updated[activeStoryIdx], skills };
                            setStoriesList(updated);
                            setNewSkillText("");
                          }
                        }}
                        placeholder="+ Add skill & press enter"
                        className="h-7 px-2 text-xs bg-white border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
