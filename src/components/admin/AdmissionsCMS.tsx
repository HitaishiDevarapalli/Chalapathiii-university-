import React, { useState } from "react";
import { 
  Award, Sparkles, BookOpen, Layers, Plus, Trash2, ArrowUp, ArrowDown,
  TrendingUp, FileText, Globe, CheckCircle2, ShieldCheck, UserPlus,
  CreditCard, UploadCloud, GraduationCap, Zap, Smartphone, Check,
  Search, Download, Edit3, X, ChevronRight, ChevronDown, RefreshCw,
  ExternalLink, DollarSign, Users, Sliders
} from "lucide-react";
import { 
  useData, 
  AdmissionsContent, 
  AdmissionsStep, 
  AdmissionsFeeItem, 
  AdmissionsScholarshipsConfig,
  DEFAULT_ADMISSIONS_CONTENT,
  EnquiryLead,
  INITIAL_ENQUIRIES
} from "../../context/DataContext";
import { SectionHeader, ImageField } from "./AdminComponents";

export interface AdmissionsCMSProps {
  notifySave: (msg: string) => void;
}

export const AdmissionsCMS: React.FC<AdmissionsCMSProps> = ({ notifySave }) => {
  const { 
    admissionsContent, 
    updateAdmissionsContent,
    enquiries,
    updateEnquiries,
    addEnquiry
  } = useData();

  // Local form state cloned from context
  const [formData, setFormData] = useState<AdmissionsContent>(() => {
    return admissionsContent || DEFAULT_ADMISSIONS_CONTENT;
  });

  const [activeTab, setActiveTab] = useState<"portal" | "fees" | "scholarships" | "leads">("portal");
  
  // Subtab 1 (Portal): Active step in the step editor
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [newFeatureText, setNewFeatureText] = useState<string>("");

  // Subtab 2 (Fees): New course tag input for active fee item
  const [newCourseInputs, setNewCourseInputs] = useState<Record<string, string>>({});

  // Subtab 3 (Scholarships): Temporary inputs
  const [newCmstHighlight, setNewCmstHighlight] = useState("");
  const [newEntranceExam, setNewEntranceExam] = useState("");

  // Subtab 4 (Leads): Search and filter
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("All");
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    mobile: "",
    email: "",
    state: "Andhra Pradesh",
    city: "",
    program: "B.Tech Computer Science & Eng",
    qualification: "12th Standard",
    yearOfPassing: "2026"
  });

  // Keep local state synced if context updates externally
  React.useEffect(() => {
    if (admissionsContent) {
      setFormData(admissionsContent);
    }
  }, [admissionsContent]);

  // General Save
  const handleSaveAll = () => {
    updateAdmissionsContent(formData);
    notifySave("Admissions CMS content published live across the portal!");
  };

  // Reset to Defaults
  const handleReset = () => {
    if (window.confirm("Reset all Admissions content (Portal Steps, Fee Structure & Scholarships) to original defaults?")) {
      setFormData(DEFAULT_ADMISSIONS_CONTENT);
      updateAdmissionsContent(DEFAULT_ADMISSIONS_CONTENT);
      notifySave("Admissions content restored to original defaults!");
    }
  };

  // Helper to update portal config
  const updatePortal = (updater: (prev: typeof formData.portal) => typeof formData.portal) => {
    setFormData((prev) => {
      const nextPortal = updater(prev.portal);
      return { ...prev, portal: nextPortal };
    });
  };

  // Helper to update scholarships config
  const updateScholarships = (updater: (prev: typeof formData.scholarships) => typeof formData.scholarships) => {
    setFormData((prev) => {
      const nextScholarships = updater(prev.scholarships);
      return { ...prev, scholarships: nextScholarships };
    });
  };

  // Helper to update fee structure
  const updateFeeStructure = (updater: (prev: typeof formData.feeStructure) => typeof formData.feeStructure) => {
    setFormData((prev) => {
      const nextFees = updater(prev.feeStructure);
      return { ...prev, feeStructure: nextFees };
    });
  };

  // Leads Filter & Export
  const filteredLeads = enquiries.filter((lead) => {
    const q = leadSearch.toLowerCase();
    const matchesSearch = 
      lead.name.toLowerCase().includes(q) ||
      lead.mobile.includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.city.toLowerCase().includes(q) ||
      lead.program.toLowerCase().includes(q);
    const matchesStatus = leadStatusFilter === "All" || (lead.status || "New") === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateLeadStatus = (id: string, newStatus: "New" | "Contacted" | "Admitted" | "Closed") => {
    const updated = enquiries.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    updateEnquiries(updated);
    notifySave(`Enquiry status updated to ${newStatus}`);
  };

  const deleteLead = (id: string) => {
    if (window.confirm("Are you sure you want to delete this enquiry record?")) {
      const updated = enquiries.filter((l) => l.id !== id);
      updateEnquiries(updated);
      notifySave("Enquiry record deleted.");
    }
  };

  const exportLeadsToCSV = () => {
    const headers = ["ID", "Name", "Mobile", "Email", "State", "City", "Program", "Qualification", "Year", "Date", "Status"];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.mobile}"`,
      `"${l.email}"`,
      `"${l.state}"`,
      `"${l.city}"`,
      `"${l.program}"`,
      `"${l.qualification}"`,
      l.yearOfPassing,
      l.date,
      l.status || "New"
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Chalapathi_Admissions_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.mobile) {
      alert("Name and mobile number are required.");
      return;
    }
    addEnquiry(newLeadForm);
    setShowAddLeadModal(false);
    setNewLeadForm({
      name: "",
      mobile: "",
      email: "",
      state: "Andhra Pradesh",
      city: "",
      program: "B.Tech Computer Science & Eng",
      qualification: "12th Standard",
      yearOfPassing: "2026"
    });
    notifySave("New admission enquiry registered successfully!");
  };

  const currentStep = formData.portal.steps[activeStepIdx] || formData.portal.steps[0];

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="Admissions & Enrollment CMS"
        subtitle="Manage admissions portal, interactive 5-step process, fee structure charts, merit scholarships, and student leads"
        icon={UserPlus}
        onSave={handleSaveAll}
        saveSuccess={false}
        onReset={handleReset}
        resetLabel="Reset All Admissions"
      />

      {/* 4 Main Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "portal", label: "Admissions Portal & 5-Step Process", icon: Sparkles, count: `${formData.portal.steps.length} Steps` },
          { id: "fees", label: "Academic Fee Structure", icon: FileText, count: `${formData.feeStructure.length} Streams` },
          { id: "scholarships", label: "Scholarships & Merit Schemes", icon: Award, count: "CMST & Aid" },
          { id: "leads", label: "Enquiries & Lead Management", icon: Users, count: `${enquiries.length} Leads` }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#072A6C] text-white shadow-md shadow-[#072A6C]/20"
                  : "bg-white text-gray-600 hover:bg-slate-100 border border-gray-200"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* SUBTAB 1: ADMISSIONS PORTAL OVERVIEW & 5-STEP WORKFLOW                 */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === "portal" && (
        <div className="space-y-8">
          
          {/* 1. Hero Feature Banner Editor */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#D4AF37]" />
                <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                  Admissions Portal Hero Banner
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                Front-Facing Banner
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Session Badge Text</label>
                <input
                  type="text"
                  value={formData.portal.heroBadge}
                  onChange={(e) => updatePortal((p) => ({ ...p, heroBadge: e.target.value }))}
                  placeholder="e.g. Academic Session 2026-27 Open"
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Hero Main Title</label>
                <input
                  type="text"
                  value={formData.portal.heroTitle}
                  onChange={(e) => updatePortal((p) => ({ ...p, heroTitle: e.target.value }))}
                  placeholder="e.g. Shape Your Future at Chalapathi University"
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-gray-700 block mb-1">Hero Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={formData.portal.heroSubtitle}
                  onChange={(e) => updatePortal((p) => ({ ...p, heroSubtitle: e.target.value }))}
                  placeholder="Empowering next-generation innovators with world-class infrastructure..."
                  className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
                />
              </div>
            </div>

            {/* 4 Stats Ticker Editor */}
            <div className="pt-2">
              <label className="text-xs font-bold text-gray-700 block mb-2">Highlight Statistics Ticker (4 Badges)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {formData.portal.stats.map((st, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Value</span>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const updated = [...formData.portal.stats];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          updatePortal((p) => ({ ...p, stats: updated }));
                        }}
                        className="w-full h-8 px-2 text-xs font-black text-[#072A6C] bg-white border border-gray-200 rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Label</span>
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const updated = [...formData.portal.stats];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          updatePortal((p) => ({ ...p, stats: updated }));
                        }}
                        className="w-full h-8 px-2 text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Three Gateway Cards Editor */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-[#072A6C]" />
                <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                  3 Admissions Gateway Cards
                </h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400">Links to Application, Fees & Scholarships</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.portal.gatewayCards.map((card, idx) => (
                <div key={card.id || idx} className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#072A6C]">Card #{idx + 1}</span>
                    <input
                      type="text"
                      value={card.tag}
                      onChange={(e) => {
                        const updated = [...formData.portal.gatewayCards];
                        updated[idx] = { ...updated[idx], tag: e.target.value };
                        updatePortal((p) => ({ ...p, gatewayCards: updated }));
                      }}
                      placeholder="Tag badge"
                      className="w-24 h-6 px-2 text-[10px] font-bold bg-white border border-gray-200 rounded-md text-right"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...formData.portal.gatewayCards];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        updatePortal((p) => ({ ...p, gatewayCards: updated }));
                      }}
                      className="w-full h-8 px-2 text-xs font-bold text-gray-800 bg-white border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={card.subtitle}
                      onChange={(e) => {
                        const updated = [...formData.portal.gatewayCards];
                        updated[idx] = { ...updated[idx], subtitle: e.target.value };
                        updatePortal((p) => ({ ...p, gatewayCards: updated }));
                      }}
                      className="w-full h-8 px-2 text-[11px] text-gray-600 bg-white border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Destination Route</label>
                    <input
                      type="text"
                      value={card.link}
                      onChange={(e) => {
                        const updated = [...formData.portal.gatewayCards];
                        updated[idx] = { ...updated[idx], link: e.target.value };
                        updatePortal((p) => ({ ...p, gatewayCards: updated }));
                      }}
                      className="w-full h-8 px-2 text-[11px] text-blue-600 bg-white border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Interactive 5-Step Process Editor & Live Phone Preview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                  <Smartphone size={18} className="text-[#10B981]" />
                  Interactive 5-Step Admissions Stepper CMS
                </h3>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  Configure titles, descriptions, feature bullet points, and live phone mockup screen for each step.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const nextId = formData.portal.steps.length;
                    const newStep: AdmissionsStep = {
                      id: nextId,
                      stepNum: `0${nextId + 1}`,
                      title: `New Step ${nextId + 1}`,
                      shortTitle: "Step Title",
                      desc: "Description of the new admission process step.",
                      icon: "Zap",
                      badge: "Quick Step",
                      features: ["Instant Access", "Encrypted Vault", "Verification"],
                      ctaText: "Continue Step",
                      ctaLink: "/admissions/apply"
                    };
                    updatePortal((p) => ({ ...p, steps: [...p.steps, newStep] }));
                    setActiveStepIdx(formData.portal.steps.length);
                    notifySave("New workflow step added!");
                  }}
                  className="px-3 py-1.5 bg-[#072A6C] hover:bg-[#0c409c] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus size={14} /> Add Step
                </button>
              </div>
            </div>

            {/* Stepper Node Switcher */}
            <div className="flex flex-wrap gap-2 bg-slate-50 p-2 rounded-xl border border-gray-200">
              {formData.portal.steps.map((step, idx) => {
                const isSelected = idx === activeStepIdx;
                return (
                  <button
                    key={step.id || idx}
                    onClick={() => setActiveStepIdx(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#10B981] text-white shadow-md shadow-[#10B981]/30"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                      {step.stepNum || `0${idx + 1}`}
                    </span>
                    <span>{step.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Two-Column Editor (Left: Step Form, Right: Live Phone Mockup Preview) */}
            {currentStep && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Column: Step Settings */}
                <div className="lg:col-span-7 space-y-4 bg-slate-50 p-5 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                    <span className="text-xs font-black text-[#072A6C] uppercase">
                      Editing Step {currentStep.stepNum}: {currentStep.title}
                    </span>

                    {formData.portal.steps.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete step "${currentStep.title}"?`)) {
                            const updated = formData.portal.steps.filter((_, i) => i !== activeStepIdx);
                            updatePortal((p) => ({ ...p, steps: updated }));
                            setActiveStepIdx(Math.max(0, activeStepIdx - 1));
                            notifySave("Step removed.");
                          }
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Step Number</label>
                      <input
                        type="text"
                        value={currentStep.stepNum}
                        onChange={(e) => {
                          const updated = [...formData.portal.steps];
                          updated[activeStepIdx] = { ...updated[activeStepIdx], stepNum: e.target.value };
                          updatePortal((p) => ({ ...p, steps: updated }));
                        }}
                        placeholder="01"
                        className="w-full h-8 px-2.5 text-xs font-extrabold text-[#072A6C] bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={currentStep.badge}
                        onChange={(e) => {
                          const updated = [...formData.portal.steps];
                          updated[activeStepIdx] = { ...updated[activeStepIdx], badge: e.target.value };
                          updatePortal((p) => ({ ...p, steps: updated }));
                        }}
                        placeholder="Quick 2 Mins"
                        className="w-full h-8 px-2.5 text-xs font-bold text-emerald-600 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Step Title</label>
                      <input
                        type="text"
                        value={currentStep.title}
                        onChange={(e) => {
                          const updated = [...formData.portal.steps];
                          updated[activeStepIdx] = { ...updated[activeStepIdx], title: e.target.value };
                          updatePortal((p) => ({ ...p, steps: updated }));
                        }}
                        placeholder="Register Yourself"
                        className="w-full h-9 px-3 text-xs font-bold text-gray-900 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={currentStep.desc}
                        onChange={(e) => {
                          const updated = [...formData.portal.steps];
                          updated[activeStepIdx] = { ...updated[activeStepIdx], desc: e.target.value };
                          updatePortal((p) => ({ ...p, steps: updated }));
                        }}
                        placeholder="Create your official student admission portal account..."
                        className="w-full p-2.5 text-xs text-gray-700 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">CTA Button Text</label>
                      <input
                        type="text"
                        value={currentStep.ctaText}
                        onChange={(e) => {
                          const updated = [...formData.portal.steps];
                          updated[activeStepIdx] = { ...updated[activeStepIdx], ctaText: e.target.value };
                          updatePortal((p) => ({ ...p, steps: updated }));
                        }}
                        placeholder="Start Account Registration"
                        className="w-full h-8 px-2.5 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">CTA Target Link</label>
                      <input
                        type="text"
                        value={currentStep.ctaLink}
                        onChange={(e) => {
                          const updated = [...formData.portal.steps];
                          updated[activeStepIdx] = { ...updated[activeStepIdx], ctaLink: e.target.value };
                          updatePortal((p) => ({ ...p, steps: updated }));
                        }}
                        placeholder="/admissions/apply"
                        className="w-full h-8 px-2.5 text-xs text-blue-600 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Feature Bullets Editor */}
                  <div className="pt-2 border-t border-gray-200 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase block">
                      Feature Checklist Items ({currentStep.features.length})
                    </label>

                    <div className="space-y-1.5">
                      {currentStep.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-[#10B981] shrink-0" />
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => {
                              const updatedFeatures = [...currentStep.features];
                              updatedFeatures[fIdx] = e.target.value;
                              const updatedSteps = [...formData.portal.steps];
                              updatedSteps[activeStepIdx] = { ...updatedSteps[activeStepIdx], features: updatedFeatures };
                              updatePortal((p) => ({ ...p, steps: updatedSteps }));
                            }}
                            className="flex-1 h-7 px-2 text-xs bg-white border border-gray-200 rounded-md"
                          />
                          <button
                            onClick={() => {
                              const updatedFeatures = currentStep.features.filter((_, i) => i !== fIdx);
                              const updatedSteps = [...formData.portal.steps];
                              updatedSteps[activeStepIdx] = { ...updatedSteps[activeStepIdx], features: updatedFeatures };
                              updatePortal((p) => ({ ...p, steps: updatedSteps }));
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                            title="Remove feature"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={newFeatureText}
                        onChange={(e) => setNewFeatureText(e.target.value)}
                        placeholder="Add new feature bullet point..."
                        className="flex-1 h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newFeatureText.trim()) {
                            e.preventDefault();
                            const updatedFeatures = [...currentStep.features, newFeatureText.trim()];
                            const updatedSteps = [...formData.portal.steps];
                            updatedSteps[activeStepIdx] = { ...updatedSteps[activeStepIdx], features: updatedFeatures };
                            updatePortal((p) => ({ ...p, steps: updatedSteps }));
                            setNewFeatureText("");
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newFeatureText.trim()) {
                            const updatedFeatures = [...currentStep.features, newFeatureText.trim()];
                            const updatedSteps = [...formData.portal.steps];
                            updatedSteps[activeStepIdx] = { ...updatedSteps[activeStepIdx], features: updatedFeatures };
                            updatePortal((p) => ({ ...p, steps: updatedSteps }));
                            setNewFeatureText("");
                          }
                        }}
                        className="px-3 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} /> Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Interactive Device Mockup Preview */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-900 rounded-2xl text-white">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-3 flex items-center gap-1.5">
                    <Smartphone size={13} /> Live Phone Preview: Step {currentStep.stepNum}
                  </span>

                  {/* Phone Bezel */}
                  <div className="w-full max-w-[280px] bg-slate-950 rounded-[36px] p-2.5 shadow-2xl border-4 border-slate-700 text-left">
                    {/* Notch */}
                    <div className="w-24 h-4 bg-slate-800 rounded-b-xl mx-auto flex items-center justify-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-slate-900" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>

                    {/* Inside Screen */}
                    <div className="bg-white rounded-[24px] p-3 text-gray-800 space-y-2.5 min-h-[360px] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-2 border-b border-gray-100 text-[9px] font-black">
                          <span className="text-[#072A6C]">CU ADMISSIONS</span>
                          <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Live 2026</span>
                        </div>

                        <div className="pt-2">
                          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider block">
                            Step {currentStep.stepNum} of 05
                          </span>
                          <h4 className="text-xs font-black text-[#072A6C] leading-tight mt-0.5">
                            {currentStep.title}
                          </h4>
                          <p className="text-[8.5px] text-gray-500 font-light mt-1 leading-snug">
                            {currentStep.desc}
                          </p>
                        </div>

                        {/* Feature Preview */}
                        <div className="space-y-1 pt-2">
                          {currentStep.features.slice(0, 3).map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[8.5px] font-semibold text-gray-700">
                              <span className="text-[#10B981] font-bold">✓</span>
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mockup Button */}
                      <div className="pt-2 border-t border-gray-100">
                        <div className="w-full py-2 bg-[#072A6C] text-white text-[8px] font-black rounded-lg text-center uppercase tracking-wider shadow-xs">
                          {currentStep.ctaText || "Continue"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* SUBTAB 2: ACADEMIC FEE STRUCTURE (ALL 9 STREAMS)                      */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === "fees" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                <FileText size={18} className="text-[#D4AF37]" />
                Academic Fee Structure CMS ({formData.feeStructure.length} Stream Cards)
              </h3>
              <p className="text-xs text-gray-500 font-light mt-0.5">
                Edit stream fee schedules, applicable courses, annual fees, duration, and exam fees.
              </p>
            </div>

            <button
              onClick={() => {
                const nextNum = String(formData.feeStructure.length + 1).padStart(2, "0");
                const newFeeItem: AdmissionsFeeItem = {
                  id: nextNum,
                  title: `New Degree / Stream Program (${nextNum})`,
                  courses: ["Sample Specialization 1", "Sample Specialization 2"],
                  duration: "4 Years",
                  feePerYear: "₹75,000 / Year",
                  examFee: "₹5,000 / Year"
                };
                updateFeeStructure((fees) => [...fees, newFeeItem]);
                notifySave("New stream fee card added!");
              }}
              className="px-4 py-2 bg-[#072A6C] hover:bg-[#0c409c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
            >
              <Plus size={14} /> Add Stream Card
            </button>
          </div>

          {/* Fee Stream Cards List */}
          <div className="space-y-4">
            {formData.feeStructure.map((feeRow, idx) => (
              <div 
                key={feeRow.id || idx} 
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-[#072A6C]/30 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-[#072A6C] text-white font-black text-sm flex items-center justify-center shrink-0">
                      {feeRow.id}
                    </span>
                    <input
                      type="text"
                      value={feeRow.title}
                      onChange={(e) => {
                        const updated = [...formData.feeStructure];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        updateFeeStructure(() => updated);
                      }}
                      className="text-xs md:text-sm font-extrabold text-[#072A6C] bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-1.5 w-full max-w-xl focus:bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {/* Move Up */}
                    <button
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const updated = [...formData.feeStructure];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        updateFeeStructure(() => updated);
                      }}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>

                    {/* Move Down */}
                    <button
                      disabled={idx === formData.feeStructure.length - 1}
                      onClick={() => {
                        if (idx === formData.feeStructure.length - 1) return;
                        const updated = [...formData.feeStructure];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        updateFeeStructure(() => updated);
                      }}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete fee schedule for "${feeRow.title}"?`)) {
                          const updated = formData.feeStructure.filter((_, i) => i !== idx);
                          updateFeeStructure(() => updated);
                          notifySave("Fee schedule card removed.");
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                      title="Delete Schedule"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Duration & Fee Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Duration</label>
                    <input
                      type="text"
                      value={feeRow.duration}
                      onChange={(e) => {
                        const updated = [...formData.feeStructure];
                        updated[idx] = { ...updated[idx], duration: e.target.value };
                        updateFeeStructure(() => updated);
                      }}
                      placeholder="e.g. 4 Years"
                      className="w-full h-8 px-2.5 text-xs font-bold text-amber-700 bg-slate-50 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Tuition Fee / Year</label>
                    <input
                      type="text"
                      value={feeRow.feePerYear}
                      onChange={(e) => {
                        const updated = [...formData.feeStructure];
                        updated[idx] = { ...updated[idx], feePerYear: e.target.value };
                        updateFeeStructure(() => updated);
                      }}
                      placeholder="e.g. ₹90,000 / Year"
                      className="w-full h-8 px-2.5 text-xs font-extrabold text-gray-900 bg-slate-50 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Mandatory Exam Fee</label>
                    <input
                      type="text"
                      value={feeRow.examFee}
                      onChange={(e) => {
                        const updated = [...formData.feeStructure];
                        updated[idx] = { ...updated[idx], examFee: e.target.value };
                        updateFeeStructure(() => updated);
                      }}
                      placeholder="e.g. ₹5,000 / Year or N/A"
                      className="w-full h-8 px-2.5 text-xs text-gray-700 bg-slate-50 border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Applicable Courses Checklist / Tags */}
                <div className="space-y-2 pt-1 border-t border-gray-50">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">
                    Applicable Programs & Specializations ({feeRow.courses.length})
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {feeRow.courses.map((course, cIdx) => (
                      <div 
                        key={cIdx} 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-xs font-semibold text-[#072A6C]"
                      >
                        <span>{course}</span>
                        <button
                          onClick={() => {
                            const updatedCourses = feeRow.courses.filter((_, i) => i !== cIdx);
                            const updated = [...formData.feeStructure];
                            updated[idx] = { ...updated[idx], courses: updatedCourses };
                            updateFeeStructure(() => updated);
                          }}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Course Input */}
                  <div className="flex gap-2 pt-1 max-w-md">
                    <input
                      type="text"
                      value={newCourseInputs[feeRow.id] || ""}
                      onChange={(e) => setNewCourseInputs({ ...newCourseInputs, [feeRow.id]: e.target.value })}
                      placeholder="Add course (e.g. B.Tech CSE AI & ML)..."
                      className="flex-1 h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                      onKeyDown={(e) => {
                        const val = (newCourseInputs[feeRow.id] || "").trim();
                        if (e.key === "Enter" && val) {
                          e.preventDefault();
                          const updated = [...formData.feeStructure];
                          updated[idx] = { ...updated[idx], courses: [...updated[idx].courses, val] };
                          updateFeeStructure(() => updated);
                          setNewCourseInputs({ ...newCourseInputs, [feeRow.id]: "" });
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const val = (newCourseInputs[feeRow.id] || "").trim();
                        if (val) {
                          const updated = [...formData.feeStructure];
                          updated[idx] = { ...updated[idx], courses: [...updated[idx].courses, val] };
                          updateFeeStructure(() => updated);
                          setNewCourseInputs({ ...newCourseInputs, [feeRow.id]: "" });
                        }
                      }}
                      className="px-3 h-8 bg-[#072A6C] hover:bg-[#0c409c] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={13} /> Add
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* SUBTAB 3: SCHOLARSHIPS & MERIT SCHEMES CMS                            */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === "scholarships" && (
        <div className="space-y-6">
          
          {/* Section 1: CMST Test */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Award size={18} className="text-[#D4AF37]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                1. Chalapathi Merit Scholarship Test (CMST)
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">CMST Title</label>
                <input
                  type="text"
                  value={formData.scholarships.cmstTitle}
                  onChange={(e) => updateScholarships((s) => ({ ...s, cmstTitle: e.target.value }))}
                  className="w-full h-9 px-3 text-xs font-bold text-gray-800 bg-slate-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">CMST Description</label>
                <textarea
                  rows={2}
                  value={formData.scholarships.cmstDescription}
                  onChange={(e) => updateScholarships((s) => ({ ...s, cmstDescription: e.target.value }))}
                  className="w-full p-3 text-xs text-gray-700 bg-slate-50 border border-gray-200 rounded-xl"
                />
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-gray-700 block">
                  CMST Highlights Bullet Points ({formData.scholarships.cmstHighlights.length})
                </label>

                <div className="space-y-2">
                  {formData.scholarships.cmstHighlights.map((hl, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2">
                      <span className="text-[#D4AF37] font-black text-sm">✓</span>
                      <input
                        type="text"
                        value={hl}
                        onChange={(e) => {
                          const updated = [...formData.scholarships.cmstHighlights];
                          updated[hIdx] = e.target.value;
                          updateScholarships((s) => ({ ...s, cmstHighlights: updated }));
                        }}
                        className="flex-1 h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                      />
                      <button
                        onClick={() => {
                          const updated = formData.scholarships.cmstHighlights.filter((_, i) => i !== hIdx);
                          updateScholarships((s) => ({ ...s, cmstHighlights: updated }));
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1 max-w-lg">
                  <input
                    type="text"
                    value={newCmstHighlight}
                    onChange={(e) => setNewCmstHighlight(e.target.value)}
                    placeholder="Add CMST highlight..."
                    className="flex-1 h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newCmstHighlight.trim()) {
                        e.preventDefault();
                        updateScholarships((s) => ({ ...s, cmstHighlights: [...s.cmstHighlights, newCmstHighlight.trim()] }));
                        setNewCmstHighlight("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newCmstHighlight.trim()) {
                        updateScholarships((s) => ({ ...s, cmstHighlights: [...s.cmstHighlights, newCmstHighlight.trim()] }));
                        setNewCmstHighlight("");
                      }
                    }}
                    className="px-3 h-8 bg-[#D4AF37] hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Entrance Exam Merit Scholarships */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <CheckCircle2 size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                2. Entrance Exam Merit Scholarships
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Section Title</label>
                <input
                  type="text"
                  value={formData.scholarships.entranceTitle}
                  onChange={(e) => updateScholarships((s) => ({ ...s, entranceTitle: e.target.value }))}
                  className="w-full h-9 px-3 text-xs font-bold bg-slate-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Section Description</label>
                <textarea
                  rows={2}
                  value={formData.scholarships.entranceDescription}
                  onChange={(e) => updateScholarships((s) => ({ ...s, entranceDescription: e.target.value }))}
                  className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl"
                />
              </div>

              {/* Exam Tags */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-gray-700 block">
                  Recognized Entrance Examinations ({formData.scholarships.entranceExams.length})
                </label>

                <div className="flex flex-wrap gap-2">
                  {formData.scholarships.entranceExams.map((exam, eIdx) => (
                    <div 
                      key={eIdx} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-gray-800 font-bold text-xs rounded-lg border border-amber-200"
                    >
                      <span>{exam}</span>
                      <button
                        onClick={() => {
                          const updated = formData.scholarships.entranceExams.filter((_, i) => i !== eIdx);
                          updateScholarships((s) => ({ ...s, entranceExams: updated }));
                        }}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1 max-w-md">
                  <input
                    type="text"
                    value={newEntranceExam}
                    onChange={(e) => setNewEntranceExam(e.target.value)}
                    placeholder="Add exam (e.g. AP EAPCET)..."
                    className="flex-1 h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newEntranceExam.trim()) {
                        e.preventDefault();
                        updateScholarships((s) => ({ ...s, entranceExams: [...s.entranceExams, newEntranceExam.trim()] }));
                        setNewEntranceExam("");
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (newEntranceExam.trim()) {
                        updateScholarships((s) => ({ ...s, entranceExams: [...s.entranceExams, newEntranceExam.trim()] }));
                        setNewEntranceExam("");
                      }
                    }}
                    className="px-3 h-8 bg-[#072A6C] hover:bg-[#0c409c] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Government Scholarship Support */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShieldCheck size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                3. Government Scholarship Support Schemes
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Section Title</label>
                <input
                  type="text"
                  value={formData.scholarships.governmentTitle}
                  onChange={(e) => updateScholarships((s) => ({ ...s, governmentTitle: e.target.value }))}
                  className="w-full h-9 px-3 text-xs font-bold bg-slate-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Section Description</label>
                <textarea
                  rows={2}
                  value={formData.scholarships.governmentDescription}
                  onChange={(e) => updateScholarships((s) => ({ ...s, governmentDescription: e.target.value }))}
                  className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl"
                />
              </div>

              {/* Supported Schemes Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {formData.scholarships.governmentSchemes.map((scheme, sIdx) => (
                  <div key={sIdx} className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Scheme #{sIdx + 1}</span>
                      <button
                        onClick={() => {
                          const updated = formData.scholarships.governmentSchemes.filter((_, i) => i !== sIdx);
                          updateScholarships((s) => ({ ...s, governmentSchemes: updated }));
                        }}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={scheme.title}
                      onChange={(e) => {
                        const updated = [...formData.scholarships.governmentSchemes];
                        updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                        updateScholarships((s) => ({ ...s, governmentSchemes: updated }));
                      }}
                      className="w-full h-8 px-2.5 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded-lg"
                    />
                    <textarea
                      rows={2}
                      value={scheme.desc}
                      onChange={(e) => {
                        const updated = [...formData.scholarships.governmentSchemes];
                        updated[sIdx] = { ...updated[sIdx], desc: e.target.value };
                        updateScholarships((s) => ({ ...s, governmentSchemes: updated }));
                      }}
                      className="w-full p-2 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg"
                    />
                  </div>
                ))}
              </div>

              {/* NSP Tip Box */}
              <div className="pt-2">
                <label className="text-xs font-bold text-gray-700 block mb-1">NSP / Support Guidance Tip Box</label>
                <textarea
                  rows={2}
                  value={formData.scholarships.nspTipText}
                  onChange={(e) => updateScholarships((s) => ({ ...s, nspTipText: e.target.value }))}
                  className="w-full p-3 text-xs bg-blue-50/50 text-blue-900 border border-blue-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Academic Excellence Rewards */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <BookOpen size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                4. Rewards for Academic Excellence
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {formData.scholarships.academicRewards.map((rew, rIdx) => (
                <div key={rIdx} className="p-3 bg-amber-50/40 rounded-xl border border-amber-200/50 space-y-2">
                  <span className="text-[10px] font-bold text-[#D4AF37] uppercase">Reward #{rIdx + 1}</span>
                  <input
                    type="text"
                    value={rew.title}
                    onChange={(e) => {
                      const updated = [...formData.scholarships.academicRewards];
                      updated[rIdx] = { ...updated[rIdx], title: e.target.value };
                      updateScholarships((s) => ({ ...s, academicRewards: updated }));
                    }}
                    className="w-full h-8 px-2 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded-lg"
                  />
                  <input
                    type="text"
                    value={rew.subtitle}
                    onChange={(e) => {
                      const updated = [...formData.scholarships.academicRewards];
                      updated[rIdx] = { ...updated[rIdx], subtitle: e.target.value };
                      updateScholarships((s) => ({ ...s, academicRewards: updated }));
                    }}
                    className="w-full h-7 px-2 text-[11px] text-gray-500 bg-white border border-gray-200 rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Bottom Recognition Banner Tagline</label>
              <input
                type="text"
                value={formData.scholarships.excellenceFooterText}
                onChange={(e) => updateScholarships((s) => ({ ...s, excellenceFooterText: e.target.value }))}
                className="w-full h-9 px-3 text-xs font-extrabold text-center text-[#D4AF37] bg-slate-50 border border-gray-200 rounded-xl uppercase tracking-wider"
              />
            </div>
          </div>

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* SUBTAB 4: LEADS & ENQUIRIES MANAGEMENT                                */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === "leads" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-1 items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search enquiries by name, phone, city, program..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="h-9 px-3 text-xs font-bold bg-slate-50 border border-gray-200 rounded-xl cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Admitted">Admitted</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowAddLeadModal(true)}
                className="h-9 px-3.5 bg-[#072A6C] hover:bg-[#0c409c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={14} /> Add Lead
              </button>

              <button
                onClick={exportLeadsToCSV}
                className="h-9 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Program</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-gray-500 font-bold">{lead.id}</td>
                      <td className="p-3">
                        <span className="font-bold text-slate-800 block">{lead.name}</span>
                        <span className="text-[10px] text-gray-400">{lead.qualification} ({lead.yearOfPassing})</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-700 block">{lead.mobile}</span>
                        <span className="text-[10px] text-gray-400">{lead.email}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-slate-700 block">{lead.city}</span>
                        <span className="text-[10px] text-gray-400">{lead.state}</span>
                      </td>
                      <td className="p-3 font-bold text-[#072A6C]">{lead.program}</td>
                      <td className="p-3 text-gray-500 whitespace-nowrap">{lead.date}</td>
                      <td className="p-3">
                        <select
                          value={lead.status || "New"}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold cursor-pointer border ${
                            lead.status === "Admitted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : lead.status === "Contacted"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Admitted">Admitted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-gray-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                          title="Delete Lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredLeads.length === 0 && (
              <div className="p-10 text-center text-gray-400 text-xs font-medium">
                No enquiries match the filter criteria.
              </div>
            )}
          </div>

          {/* Add Lead Modal */}
          {showAddLeadModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-scale-up">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h4 className="font-extrabold text-sm text-[#072A6C]">Add Admission Enquiry Lead</h4>
                  <button onClick={() => setShowAddLeadModal(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newLeadForm.name}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full h-8 px-2.5 bg-slate-50 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={newLeadForm.mobile}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, mobile: e.target.value })}
                        placeholder="10-digit mobile"
                        className="w-full h-8 px-2.5 bg-slate-50 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        value={newLeadForm.email}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                        placeholder="email@example.com"
                        className="w-full h-8 px-2.5 bg-slate-50 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">City</label>
                      <input
                        type="text"
                        value={newLeadForm.city}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                        placeholder="e.g. Guntur"
                        className="w-full h-8 px-2.5 bg-slate-50 border border-gray-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">State</label>
                      <input
                        type="text"
                        value={newLeadForm.state}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, state: e.target.value })}
                        className="w-full h-8 px-2.5 bg-slate-50 border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Program of Interest</label>
                    <input
                      type="text"
                      value={newLeadForm.program}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, program: e.target.value })}
                      placeholder="e.g. B.Tech Computer Science & Eng"
                      className="w-full h-8 px-2.5 bg-slate-50 border border-gray-200 rounded-lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowAddLeadModal(false)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#072A6C] hover:bg-[#0c409c] text-white font-bold rounded-xl cursor-pointer"
                    >
                      Save Enquiry
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
