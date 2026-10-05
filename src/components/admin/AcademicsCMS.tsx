import React, { useState } from "react";
import { 
  GraduationCap, Award, Calendar, Layers, CheckCircle2, Plus, Trash2, 
  Edit3, Save, RotateCcw, Search, ExternalLink, ChevronDown, ChevronUp,
  Clock, ShieldAlert, Scale, UserCheck, CalendarRange, BookOpen, 
  Sparkles, FileText, Check, Copy, ArrowRight, Table, Percent, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useData } from "../../context/DataContext";
import { 
  AcademicFlexibilityItem, 
  GradingRow, 
  SchoolGrading, 
  DegreeGradeTier, 
  AcademicRuleItem, 
  EvaluationBreakdownItem,
  AcademicCalendarTerm
} from "../../data/academicsData";
import { CertificationsCMS } from "./CertificationsCMS";

interface AcademicsCMSProps {
  notifySave?: (msg?: string) => void;
  defaultSubTab?: string;
}

export const AcademicsCMS: React.FC<AcademicsCMSProps> = ({ notifySave, defaultSubTab = "programmes" }) => {
  const { 
    programs,
    updatePrograms,
    academicStructure,
    updateAcademicStructure,
    academicFlexibilities,
    updateAcademicFlexibilities,
    gradingSystemData,
    updateGradingSystemData,
    awardOfDegreesData,
    updateAwardOfDegreesData,
    academicRulesData,
    updateAcademicRulesData,
    teachingEvaluationData,
    updateTeachingEvaluationData,
    academicCalendarTerms,
    updateAcademicCalendarTerms
  } = useData();

  const [activeModule, setActiveModule] = useState<
    "programmes" | "certifications" | "calendar" | "flexibilities" | 
    "grading" | "degrees" | "rules" | "teaching"
  >(defaultSubTab as any);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg?: string) => {
    const text = msg || "Saved successfully!";
    setToastMessage(text);
    if (notifySave) notifySave(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 1. ACADEMIC FLEXIBILITIES STATE & HANDLERS
  // ──────────────────────────────────────────────────────────────────────────
  const [editingFlex, setEditingFlex] = useState<AcademicFlexibilityItem | null>(null);
  const [isAddFlexOpen, setIsAddFlexOpen] = useState(false);
  const [flexSearch, setFlexSearch] = useState("");

  const handleSaveFlex = (item: AcademicFlexibilityItem) => {
    const exists = academicFlexibilities.some(f => f.id === item.id);
    let updated: AcademicFlexibilityItem[];
    if (exists) {
      updated = academicFlexibilities.map(f => f.id === item.id ? item : f);
    } else {
      updated = [...academicFlexibilities, item];
    }
    updateAcademicFlexibilities(updated);
    setEditingFlex(null);
    setIsAddFlexOpen(false);
    showToast(`✓ Flexibility "${item.title}" saved!`);
  };

  const handleDeleteFlex = (id: string) => {
    if (window.confirm("Are you sure you want to delete this academic flexibility?")) {
      const updated = academicFlexibilities.filter(f => f.id !== id);
      updateAcademicFlexibilities(updated);
      showToast("✓ Flexibility removed");
    }
  };

  const filteredFlex = (academicFlexibilities || []).filter(f => 
    f.title.toLowerCase().includes(flexSearch.toLowerCase()) ||
    f.desc.toLowerCase().includes(flexSearch.toLowerCase())
  );

  // ──────────────────────────────────────────────────────────────────────────
  // 2. GRADING SYSTEM STATE & HANDLERS
  // ──────────────────────────────────────────────────────────────────────────
  const [selectedGradingSchool, setSelectedGradingSchool] = useState<string>("computing");
  const currentSchoolGrading = gradingSystemData[selectedGradingSchool] || gradingSystemData.computing;

  const handleUpdateGradingRow = (
    type: "absolute" | "relative",
    idx: number,
    field: string,
    value: string
  ) => {
    const currentSchool = { ...currentSchoolGrading };
    const rows = [...currentSchool[type]];
    rows[idx] = { ...rows[idx], [field]: value };
    const updatedSchool = { ...currentSchool, [type]: rows };
    const updatedSystem = { ...gradingSystemData, [selectedGradingSchool]: updatedSchool };
    updateGradingSystemData(updatedSystem);
    showToast("✓ Grading row updated");
  };

  const handleAddGradingRow = (type: "absolute" | "relative") => {
    const currentSchool = { ...currentSchoolGrading };
    const newRow: GradingRow = type === "absolute" 
      ? { perf: "New Grade", grade: "N", gp: "5", range: "50 - 59" }
      : { grade: "N", gp: "5", calc: "µ - 0.50σ <= total marks < µ" };
    const rows = [...currentSchool[type], newRow];
    const updatedSchool = { ...currentSchool, [type]: rows };
    const updatedSystem = { ...gradingSystemData, [selectedGradingSchool]: updatedSchool };
    updateGradingSystemData(updatedSystem);
    showToast("✓ Added new grading row");
  };

  const handleDeleteGradingRow = (type: "absolute" | "relative", idx: number) => {
    const currentSchool = { ...currentSchoolGrading };
    const rows = currentSchool[type].filter((_, i) => i !== idx);
    const updatedSchool = { ...currentSchool, [type]: rows };
    const updatedSystem = { ...gradingSystemData, [selectedGradingSchool]: updatedSchool };
    updateGradingSystemData(updatedSystem);
    showToast("✓ Grading row removed");
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 3. AWARD OF DEGREES STATE & HANDLERS
  // ──────────────────────────────────────────────────────────────────────────
  const [selectedDegreeSchool, setSelectedDegreeSchool] = useState<string>("computing");
  const currentDegreeSchool = awardOfDegreesData[selectedDegreeSchool] || awardOfDegreesData.computing;

  const handleUpdateDegreeTier = (idx: number, field: string, value: any) => {
    const current = { ...currentDegreeSchool };
    const grades = [...current.grades];
    grades[idx] = { ...grades[idx], [field]: field === "min" || field === "max" ? parseFloat(value) || 0 : value };
    const updatedSchool = { ...current, grades };
    const updatedData = { ...awardOfDegreesData, [selectedDegreeSchool]: updatedSchool };
    updateAwardOfDegreesData(updatedData);
    showToast("✓ Degree award classification updated");
  };

  const handleAddDegreeTier = () => {
    const current = { ...currentDegreeSchool };
    const newTier: DegreeGradeTier = {
      min: 6.0,
      max: 7.0,
      class: "New Classification",
      color: "bg-blue-50/40 border-blue-100 text-blue-800"
    };
    const grades = [...current.grades, newTier];
    const updatedSchool = { ...current, grades };
    const updatedData = { ...awardOfDegreesData, [selectedDegreeSchool]: updatedSchool };
    updateAwardOfDegreesData(updatedData);
    showToast("✓ Added degree classification");
  };

  const handleDeleteDegreeTier = (idx: number) => {
    const current = { ...currentDegreeSchool };
    const grades = current.grades.filter((_, i) => i !== idx);
    const updatedSchool = { ...current, grades };
    const updatedData = { ...awardOfDegreesData, [selectedDegreeSchool]: updatedSchool };
    updateAwardOfDegreesData(updatedData);
    showToast("✓ Degree classification removed");
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 4. RULES & REGULATIONS STATE & HANDLERS
  // ──────────────────────────────────────────────────────────────────────────
  const [editingRule, setEditingRule] = useState<AcademicRuleItem | null>(null);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);

  const handleSaveRule = (rule: AcademicRuleItem) => {
    const exists = academicRulesData.some(r => r.id === rule.id);
    let updated: AcademicRuleItem[];
    if (exists) {
      updated = academicRulesData.map(r => r.id === rule.id ? rule : r);
    } else {
      updated = [...academicRulesData, rule];
    }
    updateAcademicRulesData(updated);
    setEditingRule(null);
    setIsAddRuleOpen(false);
    showToast(`✓ Rule "${rule.title}" saved!`);
  };

  const handleDeleteRule = (id: string) => {
    if (window.confirm("Are you sure you want to delete this compliance rule?")) {
      const updated = academicRulesData.filter(r => r.id !== id);
      updateAcademicRulesData(updated);
      showToast("✓ Compliance rule removed");
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 5. TEACHING & EVALUATION STATE & HANDLERS
  // ──────────────────────────────────────────────────────────────────────────
  const handleUpdateEvaluationSplit = (cie: number) => {
    const see = Math.max(0, 100 - cie);
    const updated = { ...teachingEvaluationData, ciePercentage: cie, seePercentage: see };
    updateTeachingEvaluationData(updated);
    showToast(`✓ Evaluation split updated: CIE ${cie}% / SEE ${see}%`);
  };

  const handleUpdateEvalItem = (idx: number, field: string, value: string) => {
    const items = [...teachingEvaluationData.items];
    items[idx] = { ...items[idx], [field]: value };
    const updated = { ...teachingEvaluationData, items };
    updateTeachingEvaluationData(updated);
    showToast("✓ Evaluation breakdown updated");
  };

  const handleAddEvalItem = () => {
    const newItem: EvaluationBreakdownItem = {
      id: `eval-${Date.now()}`,
      title: "New Evaluation Component",
      weight: "10%",
      desc: "Description of evaluation format and continuous assessment rubrics."
    };
    const updated = { ...teachingEvaluationData, items: [...teachingEvaluationData.items, newItem] };
    updateTeachingEvaluationData(updated);
    showToast("✓ Added evaluation component");
  };

  const handleDeleteEvalItem = (idx: number) => {
    const items = teachingEvaluationData.items.filter((_, i) => i !== idx);
    const updated = { ...teachingEvaluationData, items };
    updateTeachingEvaluationData(updated);
    showToast("✓ Evaluation component removed");
  };

  // ──────────────────────────────────────────────────────────────────────────
  // 6. ACADEMIC CALENDAR STATE & HANDLERS
  // ──────────────────────────────────────────────────────────────────────────
  const [editingCalendarTerm, setEditingCalendarTerm] = useState<AcademicCalendarTerm | null>(null);
  const [isAddCalOpen, setIsAddCalOpen] = useState(false);

  const handleSaveCalendarTerm = (term: AcademicCalendarTerm) => {
    const exists = academicCalendarTerms.some(t => t.id === term.id);
    let updated: AcademicCalendarTerm[];
    if (exists) {
      updated = academicCalendarTerms.map(t => t.id === term.id ? term : t);
    } else {
      updated = [...academicCalendarTerms, term];
    }
    updateAcademicCalendarTerms(updated);
    setEditingCalendarTerm(null);
    setIsAddCalOpen(false);
    showToast(`✓ Calendar Term "${term.year}" saved!`);
  };

  const handleDeleteCalendarTerm = (id: string) => {
    if (window.confirm("Are you sure you want to delete this calendar term?")) {
      const updated = academicCalendarTerms.filter(t => t.id !== id);
      updateAcademicCalendarTerms(updated);
      showToast("✓ Calendar term removed");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left font-[var(--font-poppins)]">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-[99999] bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold"
          >
            <CheckCircle2 size={16} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
            <GraduationCap size={16} />
            <span>Academic CMS & Curriculum Suite</span>
          </div>
          <h2 className="text-xl font-black text-[#072A6C]">Academics Content Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage all 8 sub-modules of the Academics mega-menu with full real-time database synchronization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/academics"
            target="_blank"
            rel="noreferrer"
            className="h-9 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>View Live Academics</span>
          </a>
        </div>
      </div>

      {/* 8-Tab Submenu Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 bg-white p-2 rounded-2xl border border-gray-200 shadow-xs">
        {[
          { id: "programmes", label: "Programmes", icon: GraduationCap, path: "/academics/programmes" },
          { id: "certifications", label: "Global Certs", icon: Award, path: "/academics/certifications" },
          { id: "calendar", label: "Academic Cal", icon: Calendar, path: "/academics/calendar" },
          { id: "flexibilities", label: "Flexibilities", icon: Layers, path: "/academics/flexibilities" },
          { id: "grading", label: "Grading System", icon: Table, path: "/academics/grading" },
          { id: "degrees", label: "Award of Degrees", icon: Award, path: "/academics/degrees" },
          { id: "rules", label: "Rules & Regs", icon: Scale, path: "/academics/rules" },
          { id: "teaching", label: "Teaching & Eval", icon: Percent, path: "/academics/teaching" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id as any)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center gap-1.5 ${
                isActive
                  ? "bg-[#072A6C] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#072A6C]"
              }`}
            >
              <Icon size={16} />
              <span className="truncate w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 1. PROGRAMMES OFFERED CMS                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeModule === "programmes" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">Programmes & Degrees Directory ({programs.length})</h3>
              <p className="text-xs text-gray-500">Edit, add, or customize undergraduate and postgraduate degrees and curriculum highlights</p>
            </div>
            <a
              href="/academics/programmes"
              target="_blank"
              rel="noreferrer"
              className="h-8 px-3.5 bg-blue-50 hover:bg-blue-100 text-[#072A6C] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink size={12} />
              <span>Preview /academics/programmes</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((prog, idx) => (
              <div key={prog.slug || idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-[#072A6C] uppercase">
                      {prog.department || "Engineering"}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">
                      {prog.duration || "4 Years"}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#072A6C] tracking-tight mb-2">{prog.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{(prog as any).shortDesc || (prog as any).description || ""}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-600">Intake: {(prog as any).intake || "60"} seats</span>
                  <a
                    href={`/programs/${prog.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-[#072A6C] hover:text-[#D4AF37] flex items-center gap-1"
                  >
                    View Page <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 2. GLOBAL CERTIFICATIONS CMS                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeModule === "certifications" && (
        <CertificationsCMS notifySave={showToast} />
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 3. ACADEMIC CALENDAR CMS                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeModule === "calendar" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">Academic Calendar Management</h3>
              <p className="text-xs text-gray-500">Configure academic year schedules, assessment dates, instruction timelines, and download links</p>
            </div>
            <button
              onClick={() => {
                setEditingCalendarTerm({
                  id: `cal-${Date.now()}`,
                  year: "2027-28",
                  title: "Academic Calendar 2027-28",
                  commencementDate: "July 15, 2027",
                  midTerm1Date: "September 15 - 20, 2027",
                  midTerm2Date: "November 10 - 15, 2027",
                  lastInstructionDay: "November 28, 2027",
                  practicalExamsDate: "December 01 - 08, 2027",
                  theoryExamsDate: "December 10 - 24, 2027",
                  vacationDate: "December 25, 2027 - January 05, 2028",
                  pdfUrl: "/academic-calendar.pdf"
                });
                setIsAddCalOpen(true);
              }}
              className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>+ Add Calendar Term</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {academicCalendarTerms.map((term) => (
              <div key={term.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full uppercase">
                      Academic Year: {term.year}
                    </span>
                    <h4 className="text-sm font-black text-[#072A6C] mt-2">{term.title}</h4>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingCalendarTerm(term)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCalendarTerm(term.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-100">
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Commencement:</span>
                    <span className="font-semibold text-gray-700">{term.commencementDate}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Mid-Term 1:</span>
                    <span className="font-semibold text-gray-700">{term.midTerm1Date}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Mid-Term 2:</span>
                    <span className="font-semibold text-gray-700">{term.midTerm2Date}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase">Final Exams:</span>
                    <span className="font-semibold text-gray-700">{term.theoryExamsDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 4. ACADEMIC FLEXIBILITIES CMS                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeModule === "flexibilities" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">Academic Flexibilities ({academicFlexibilities.length})</h3>
              <p className="text-xs text-gray-500">Autonomous credit choices, minor streams, double majors, and special semester pathways</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingFlex({
                    id: `flex-${Date.now()}`,
                    key: `custom-flex-${Date.now()}`,
                    title: "New Academic Flexibility",
                    desc: "Detailed description of the academic flexibility option and how scholars can utilize it.",
                    highlights: ["Autonomous credit choice", "Multidisciplinary career advantage", "Industry standard compliance"]
                  });
                  setIsAddFlexOpen(true);
                }}
                className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Plus size={14} />
                <span>+ Add Flexibility</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search academic flexibilities..."
              value={flexSearch}
              onChange={(e) => setFlexSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#072A6C]/20 outline-none"
            />
          </div>

          {/* Flexibilities list */}
          <div className="space-y-3">
            {filteredFlex.map((item, idx) => (
              <div key={item.id || idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-50 text-[#072A6C] font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-black text-[#072A6C]">{item.title}</h4>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingFlex(item)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteFlex(item.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-600 font-light leading-relaxed">{item.desc}</p>

                <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                  {(item.highlights || []).map((h, hIdx) => (
                    <span key={hIdx} className="text-[10.5px] px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg font-medium">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 5. GRADING SYSTEM CMS                                          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeModule === "grading" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">Grading System & Scale Management</h3>
              <p className="text-xs text-gray-500">Configure absolute marks ranges, letter grades, GP weights, and relative statistical formulas</p>
            </div>
            <div className="flex gap-2">
              {Object.keys(gradingSystemData).map((schoolKey) => (
                <button
                  key={schoolKey}
                  onClick={() => setSelectedGradingSchool(schoolKey)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedGradingSchool === schoolKey
                      ? "bg-[#072A6C] text-white shadow-xs"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {schoolKey === "computing" && "Computing Sciences"}
                  {schoolKey === "engineering" && "Engineering"}
                  {schoolKey === "business" && "Business & Mgmt"}
                </button>
              ))}
            </div>
          </div>

          {/* Absolute Grading Table */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                1. Absolute Grading Scale ({currentSchoolGrading.title})
              </h4>
              <button
                onClick={() => handleAddGradingRow("absolute")}
                className="h-7 px-3 bg-blue-50 hover:bg-blue-100 text-[#072A6C] text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus size={12} /> Add Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] border-b border-gray-200">
                  <tr>
                    <th className="p-2.5">Academic Performance</th>
                    <th className="p-2.5">Letter Grade</th>
                    <th className="p-2.5">Grade Points (GP)</th>
                    <th className="p-2.5">Marks Range (%)</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentSchoolGrading.absolute.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-gray-50/60">
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={row.perf || ""}
                          onChange={(e) => handleUpdateGradingRow("absolute", rIdx, "perf", e.target.value)}
                          className="w-full px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={row.grade}
                          onChange={(e) => handleUpdateGradingRow("absolute", rIdx, "grade", e.target.value)}
                          className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg font-black text-[#072A6C] text-xs text-center"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={row.gp}
                          onChange={(e) => handleUpdateGradingRow("absolute", rIdx, "gp", e.target.value)}
                          className="w-16 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-center"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={row.range || ""}
                          onChange={(e) => handleUpdateGradingRow("absolute", rIdx, "range", e.target.value)}
                          className="w-32 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => handleDeleteGradingRow("absolute", rIdx)}
                          className="p-1 text-gray-400 hover:text-red-600 rounded"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 6. AWARD OF DEGREES CMS                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeModule === "degrees" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">Award of Degrees Classifications</h3>
              <p className="text-xs text-gray-500">Degree classification cutoffs, First Class with Distinction criteria, and CGPA thresholds</p>
            </div>
            <div className="flex gap-2">
              {Object.keys(awardOfDegreesData).map((schoolKey) => (
                <button
                  key={schoolKey}
                  onClick={() => setSelectedDegreeSchool(schoolKey)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    selectedDegreeSchool === schoolKey
                      ? "bg-[#072A6C] text-white shadow-xs"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {schoolKey === "computing" && "Computing Sciences"}
                  {schoolKey === "engineering" && "Engineering"}
                  {schoolKey === "business" && "Business & Mgmt"}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                {currentDegreeSchool.title}
              </h4>
              <button
                onClick={handleAddDegreeTier}
                className="h-7 px-3 bg-blue-50 hover:bg-blue-100 text-[#072A6C] text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus size={12} /> Add Classification
              </button>
            </div>

            <div className="space-y-3">
              {currentDegreeSchool.grades.map((tier, tIdx) => (
                <div key={tIdx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block uppercase">Classification Name:</label>
                      <input
                        type="text"
                        value={tier.class}
                        onChange={(e) => handleUpdateDegreeTier(tIdx, "class", e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#072A6C]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block uppercase">Min CGPA:</label>
                      <input
                        type="number"
                        step="0.05"
                        value={tier.min}
                        onChange={(e) => handleUpdateDegreeTier(tIdx, "min", e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block uppercase">Max CGPA:</label>
                      <input
                        type="number"
                        step="0.05"
                        value={tier.max}
                        onChange={(e) => handleUpdateDegreeTier(tIdx, "max", e.target.value)}
                        className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteDegreeTier(tIdx)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 7. RULES & REGULATIONS CMS                                     */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeModule === "rules" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">Rules & Regulations (Focal Points of Compliance)</h3>
              <p className="text-xs text-gray-500">Student attendance thresholds, dress code, academic integrity, and campus discipline codes</p>
            </div>
            <button
              onClick={() => {
                setEditingRule({
                  id: `rule-${Date.now()}`,
                  title: "New Compliance Rule",
                  desc: "Description of the student code of conduct or compliance guideline.",
                  iconName: "Scale"
                });
                setIsAddRuleOpen(true);
              }}
              className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus size={14} />
              <span>+ Add Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicRulesData.map((rule, rIdx) => (
              <div key={rule.id || rIdx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-full bg-blue-50 text-[#072A6C] font-black text-xs flex items-center justify-center">
                      {rIdx + 1}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingRule(rule)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded"
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-[#072A6C]">{rule.title}</h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 8. TEACHING & EVALUATION CMS                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeModule === "teaching" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">Teaching & Evaluation Framework</h3>
              <p className="text-xs text-gray-500">Continuous Internal Evaluation (CIE) vs Semester End Examination (SEE) ratios and component weights</p>
            </div>
            <button
              onClick={handleAddEvalItem}
              className="h-8 px-3.5 bg-blue-50 hover:bg-blue-100 text-[#072A6C] text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus size={13} />
              <span>+ Add Component</span>
            </button>
          </div>

          {/* CIE vs SEE Slider Split */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">1. Assessment Ratio Split</h4>
            <div className="space-y-3 max-w-lg">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>CIE: {teachingEvaluationData.ciePercentage}%</span>
                <span>SEE: {teachingEvaluationData.seePercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={teachingEvaluationData.ciePercentage}
                onChange={(e) => handleUpdateEvaluationSplit(parseInt(e.target.value))}
                className="w-full accent-[#072A6C] cursor-pointer"
              />
            </div>
          </div>

          {/* Components list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teachingEvaluationData.items.map((item, iIdx) => (
              <div key={item.id || iIdx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-1 bg-amber-50 text-amber-900 rounded-lg">
                    Weight: {item.weight}
                  </span>
                  <button
                    onClick={() => handleDeleteEvalItem(iIdx)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateEvalItem(iIdx, "title", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-black text-[#072A6C]"
                  />
                  <textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) => handleUpdateEvalItem(iIdx, "desc", e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT FLEXIBILITY                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(editingFlex || isAddFlexOpen) && (
          <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 space-y-4 my-8 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-black text-[#072A6C]">
                  {editingFlex ? "Edit Flexibility" : "Add New Flexibility"}
                </h3>
                <button
                  onClick={() => { setEditingFlex(null); setIsAddFlexOpen(false); }}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {editingFlex && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Flexibility Title:</label>
                    <input
                      type="text"
                      value={editingFlex.title}
                      onChange={(e) => setEditingFlex({ ...editingFlex, title: e.target.value })}
                      className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Description:</label>
                    <textarea
                      rows={3}
                      value={editingFlex.desc}
                      onChange={(e) => setEditingFlex({ ...editingFlex, desc: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl resize-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Key Highlights (comma separated):</label>
                    <input
                      type="text"
                      value={(editingFlex.highlights || []).join(", ")}
                      onChange={(e) => setEditingFlex({
                        ...editingFlex,
                        highlights: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                      })}
                      className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                    <button
                      onClick={() => { setEditingFlex(null); setIsAddFlexOpen(false); }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveFlex(editingFlex)}
                      className="px-5 py-2 bg-[#072A6C] hover:bg-[#051c4a] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Save size={14} /> Save Flexibility
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: EDIT CALENDAR TERM                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(editingCalendarTerm || isAddCalOpen) && (
          <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 space-y-4 my-8 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-black text-[#072A6C]">
                  {editingCalendarTerm ? "Edit Calendar Term" : "Add Calendar Term"}
                </h3>
                <button
                  onClick={() => { setEditingCalendarTerm(null); setIsAddCalOpen(false); }}
                  className="p-1 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {editingCalendarTerm && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Academic Year:</label>
                      <input
                        type="text"
                        value={editingCalendarTerm.year}
                        onChange={(e) => setEditingCalendarTerm({ ...editingCalendarTerm, year: e.target.value })}
                        className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Term Title:</label>
                      <input
                        type="text"
                        value={editingCalendarTerm.title}
                        onChange={(e) => setEditingCalendarTerm({ ...editingCalendarTerm, title: e.target.value })}
                        className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Commencement Date:</label>
                    <input
                      type="text"
                      value={editingCalendarTerm.commencementDate}
                      onChange={(e) => setEditingCalendarTerm({ ...editingCalendarTerm, commencementDate: e.target.value })}
                      className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Mid-Term 1 Date:</label>
                      <input
                        type="text"
                        value={editingCalendarTerm.midTerm1Date}
                        onChange={(e) => setEditingCalendarTerm({ ...editingCalendarTerm, midTerm1Date: e.target.value })}
                        className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Mid-Term 2 Date:</label>
                      <input
                        type="text"
                        value={editingCalendarTerm.midTerm2Date}
                        onChange={(e) => setEditingCalendarTerm({ ...editingCalendarTerm, midTerm2Date: e.target.value })}
                        className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Theory Examinations:</label>
                    <input
                      type="text"
                      value={editingCalendarTerm.theoryExamsDate}
                      onChange={(e) => setEditingCalendarTerm({ ...editingCalendarTerm, theoryExamsDate: e.target.value })}
                      className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                    <button
                      onClick={() => { setEditingCalendarTerm(null); setIsAddCalOpen(false); }}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveCalendarTerm(editingCalendarTerm)}
                      className="px-5 py-2 bg-[#072A6C] hover:bg-[#051c4a] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                    >
                      <Save size={14} /> Save Calendar Term
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default AcademicsCMS;
