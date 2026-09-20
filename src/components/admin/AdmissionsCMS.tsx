import React, { useState } from "react";
import { 
  Award, Sparkles, BookOpen, Layers, Plus, Trash2, ArrowUp, ArrowDown,
  TrendingUp, FileText, Globe, CheckCircle2, ShieldCheck, UserPlus,
  CreditCard, UploadCloud, GraduationCap, Zap, Smartphone, Check,
  Search, Download, Edit3, X, ChevronRight, ChevronDown, RefreshCw,
  ExternalLink, DollarSign, Users, Sliders, Eye, Palette, Settings,
  Send, Mail, Phone, MapPin, Landmark, User, Save, RotateCcw
} from "lucide-react";
import { 
  useData, 
  AdmissionsContent, 
  AdmissionsStep, 
  AdmissionsFeeItem, 
  AdmissionsScholarshipsConfig,
  EnquiryPopupConfig,
  EnquirySchoolItem,
  EnquiryGroupItem,
  EnquiryCourseItem,
  DEFAULT_ADMISSIONS_CONTENT,
  EnquiryLead,
  OnlineApplication,
  INITIAL_ENQUIRIES,
  DEFAULT_HOMEPAGE_SECTIONS
} from "../../context/DataContext";
import { SectionHeader, ImageField, ColorField } from "./AdminComponents";
import { ApplyOnlineCMS } from "./ApplyOnlineCMS";

export interface AdmissionsCMSProps {
  notifySave: (msg: string) => void;
}

export const AdmissionsCMS: React.FC<AdmissionsCMSProps> = ({ notifySave }) => {
  const { 
    admissionsContent, 
    updateAdmissionsContent,
    enquiries,
    updateEnquiries,
    addEnquiry,
    onlineApplications,
    updateOnlineApplications,
    homepageSections,
    updateHomepageSections
  } = useData();

  // Local form state cloned from context
  const [formData, setFormData] = useState<AdmissionsContent>(() => {
    return admissionsContent || DEFAULT_ADMISSIONS_CONTENT;
  });

  const [activeTab, setActiveTab] = useState<"portal" | "apply_online" | "fees" | "scholarships" | "popup" | "leads" | "applications" | "homepage">("portal");
  
  // Subtab 6 (Applications): Search and filter
  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("All");
  
  // Subtab 1 (Portal): Active step in the step editor
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [newFeatureText, setNewFeatureText] = useState<string>("");

  // Subtab 2 (Fees): New course tag input for active fee item
  const [newCourseInputs, setNewCourseInputs] = useState<Record<string, string>>({});

  // Subtab 3 (Scholarships): Temporary inputs
  const [newCmstHighlight, setNewCmstHighlight] = useState("");
  const [newEntranceExam, setNewEntranceExam] = useState("");

  // Subtab 4 (Popup CMS): Temporary inputs & controls
  const [activeSchoolIndex, setActiveSchoolIndex] = useState<number>(0);
  const [newSchoolTitle, setNewSchoolTitle] = useState("");
  const [newSchoolSubtitle, setNewSchoolSubtitle] = useState("");
  const [newGroupInput, setNewGroupInput] = useState("");
  const [newCourseLevel, setNewCourseLevel] = useState("UG");
  const [newCourseName, setNewCourseName] = useState("");
  const [newDropdownProg, setNewDropdownProg] = useState("");
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
  const [previewAccordion, setPreviewAccordion] = useState<string | null>("computing");
  const [previewFormData, setPreviewFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    state: "Andhra Pradesh",
    qualification: "12th Standard",
    yearOfPassing: "2026",
    program: "",
    query: ""
  });
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  // Subtab 5 (Leads): Search and filter
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

  // Helper to update enquiry popup config
  const updateEnquiryPopup = (updater: (prev: EnquiryPopupConfig) => EnquiryPopupConfig) => {
    setFormData((prev) => {
      const currentPopup = prev.enquiryPopup || DEFAULT_ADMISSIONS_CONTENT.enquiryPopup;
      const nextPopup = updater(currentPopup);
      return { ...prev, enquiryPopup: nextPopup };
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
  const popupConfig = formData.enquiryPopup || DEFAULT_ADMISSIONS_CONTENT.enquiryPopup;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="Admissions & Enrollment CMS"
        subtitle="Manage admissions portal, interactive 5-step process, fee structure charts, merit scholarships, admission enquiry popup modal, and student leads"
        icon={UserPlus}
        onSave={handleSaveAll}
        saveSuccess={false}
        onReset={handleReset}
        resetLabel="Reset All Admissions"
      />

      {/* 8 Main Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "portal", label: "Admissions Portal Overview", icon: Sparkles, count: `${formData.portal.steps.length} Steps` },
          { id: "apply_online", label: "📝 Apply Online (5-Step Form CMS)", icon: UserPlus, count: "All 5 Steps" },
          { id: "fees", label: "Academic Fee Structure", icon: FileText, count: `${formData.feeStructure.length} Streams` },
          { id: "scholarships", label: "Scholarships & Merit Schemes", icon: Award, count: "CMST & Aid" },
          { id: "popup", label: "Admission Enquiry Popup & Tab", icon: Sliders, count: "Popup CMS" },
          { id: "leads", label: "Enquiries & Lead Management", icon: Users, count: `${enquiries.length} Leads` },
          { id: "applications", label: "Online Student Applications", icon: GraduationCap, count: `${onlineApplications?.length || 0} Apps` },
          { id: "homepage", label: "🏠 8. Homepage Admissions Strip, Ticker & Visit Us", icon: Sliders, count: "Homepage" }
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
      {/* SUBTAB: APPLY ONLINE 5-STEP PORTAL CMS                                */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === "apply_online" && (
        <ApplyOnlineCMS notifySave={notifySave} />
      )}

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
      {/* SUBTAB 4: ADMISSION ENQUIRY POPUP & RIGHT-SIDE FLOATING TAB CMS       */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === "popup" && (
        <div className="space-y-8">

          {/* Top Action Bar & Live Preview Launcher */}
          <div className="bg-gradient-to-r from-[#072A6C] to-[#0d3b8e] p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                <Sparkles size={13} /> SRM-Design Admission Modal CMS
              </span>
              <h3 className="text-lg font-black tracking-tight">
                Admission Enquiry Modal & Floating Side Tab
              </h3>
              <p className="text-xs text-blue-100 font-light max-w-xl">
                Customize the persistent vertical floating tab on the right edge of all public pages, the 2-column popup modal, schools tree hierarchy, and dropdown courses.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setPreviewSubmitted(false);
                  setShowLivePreviewModal(true);
                }}
                className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#bfa030] text-slate-950 text-xs font-black rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                <Eye size={15} /> Launch Live Preview Modal
              </button>
            </div>
          </div>

          {/* Section 1: Floating Side Tab Customization */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={18} className="text-[#072A6C]" />
                <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                  1. Right-Side Floating Tab Settings
                </h3>
              </div>
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                popupConfig.enabled !== false 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-red-50 text-red-700 border-red-200"
              }`}>
                {popupConfig.enabled !== false ? "● Active On Website" : "○ Disabled"}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Tab Controls */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Enable / Disable Toggle */}
                <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-gray-200">
                  <div>
                    <span className="text-xs font-black text-[#072A6C] block">Enable Floating Side Tab & Auto-Popup</span>
                    <span className="text-[11px] text-gray-500 font-light">Show the vertical tab on the right edge of pages and auto-popup for new visitors</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateEnquiryPopup((p) => ({ ...p, enabled: p.enabled === false ? true : false }))}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      popupConfig.enabled !== false ? "bg-[#10B981]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        popupConfig.enabled !== false ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Tab Label */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 block mb-1">Floating Tab Vertical Label</label>
                  <input
                    type="text"
                    value={popupConfig.tabLabel || "Admission Enquiry"}
                    onChange={(e) => updateEnquiryPopup((p) => ({ ...p, tabLabel: e.target.value }))}
                    placeholder="e.g. ADMISSION ENQUIRY"
                    className="w-full h-10 px-3 text-xs font-bold text-[#072A6C] bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
                  />
                </div>

                {/* Tab Background Color */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Tab Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={popupConfig.tabBgColor || "#072A6C"}
                      onChange={(e) => updateEnquiryPopup((p) => ({ ...p, tabBgColor: e.target.value }))}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={popupConfig.tabBgColor || "#072A6C"}
                      onChange={(e) => updateEnquiryPopup((p) => ({ ...p, tabBgColor: e.target.value }))}
                      className="flex-1 h-10 px-3 text-xs font-mono uppercase bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
                    />
                  </div>
                </div>

                {/* Tab Text Color */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Tab Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={popupConfig.tabTextColor || "#FFFFFF"}
                      onChange={(e) => updateEnquiryPopup((p) => ({ ...p, tabTextColor: e.target.value }))}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 p-0.5"
                    />
                    <input
                      type="text"
                      value={popupConfig.tabTextColor || "#FFFFFF"}
                      onChange={(e) => updateEnquiryPopup((p) => ({ ...p, tabTextColor: e.target.value }))}
                      className="flex-1 h-10 px-3 text-xs font-mono uppercase bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
                    />
                  </div>
                </div>

              </div>

              {/* Live Side-Tab Mockup Preview */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl text-white">
                <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider mb-4">
                  Live Floating Tab Visual
                </span>

                <div className="relative w-48 h-56 bg-slate-950 rounded-xl border border-slate-700 flex items-center justify-end overflow-hidden p-2">
                  <div className="text-[9px] text-slate-500 absolute left-3 top-3">Browser Edge (Right)</div>
                  
                  <div
                    style={{
                      backgroundColor: popupConfig.tabBgColor || "#072A6C",
                      color: popupConfig.tabTextColor || "#FFFFFF"
                    }}
                    className="w-[36px] h-[160px] font-bold text-[8.5px] tracking-[1.5px] rounded-l-lg shadow-lg flex items-center justify-center [writing-mode:vertical-lr] rotate-180 uppercase cursor-pointer select-none"
                  >
                    {popupConfig.tabLabel || "Admission Enquiry"}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 mt-2">Right screen persistent anchor</span>
              </div>
            </div>
          </div>

          {/* Section 2: Popup Modal Header & Form Copywriting */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <FileText size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                2. Modal Header Titles & Form Copywriting
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Modal Main Title</label>
                <input
                  type="text"
                  value={popupConfig.modalTitle || "ADMISSIONS OPEN 2026-27"}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, modalTitle: e.target.value }))}
                  className="w-full h-10 px-3 text-xs font-extrabold text-[#072A6C] bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Modal Subtitle</label>
                <input
                  type="text"
                  value={popupConfig.modalSubtitle || "Build Your Future. Lead with Innovation."}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, modalSubtitle: e.target.value }))}
                  className="w-full h-10 px-3 text-xs text-gray-600 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Form Badge Title</label>
                <input
                  type="text"
                  value={popupConfig.formBadgeTitle || "ENQUIRY FORM"}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, formBadgeTitle: e.target.value }))}
                  className="w-full h-10 px-3 text-xs font-bold text-gray-800 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Form Badge Description</label>
                <input
                  type="text"
                  value={popupConfig.formBadgeDesc || "Fill in your details. Our admission team will contact you soon."}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, formBadgeDesc: e.target.value }))}
                  className="w-full h-10 px-3 text-xs text-gray-600 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Submit CTA Button Text</label>
                <input
                  type="text"
                  value={popupConfig.ctaButtonText || "APPLY ENQUIRY"}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, ctaButtonText: e.target.value }))}
                  className="w-full h-10 px-3 text-xs font-black text-amber-700 bg-amber-50/60 border border-amber-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Privacy Guarantee Note</label>
                <input
                  type="text"
                  value={popupConfig.privacyText || "Your information is safe with us. We respect your privacy."}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, privacyText: e.target.value }))}
                  className="w-full h-10 px-3 text-xs text-gray-600 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Submission Success Title</label>
                <input
                  type="text"
                  value={popupConfig.successTitle || "Enquiry Submitted Successfully!"}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, successTitle: e.target.value }))}
                  className="w-full h-10 px-3 text-xs font-bold text-emerald-700 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Submission Success Description</label>
                <input
                  type="text"
                  value={popupConfig.successDesc || "Our admissions helpdesk representative will contact you on your registered mobile number shortly."}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, successDesc: e.target.value }))}
                  className="w-full h-10 px-3 text-xs text-gray-600 bg-slate-50 border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Left Panel - Schools & Programs Hierarchy CMS */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap size={18} className="text-[#072A6C]" />
                  3. Explore Schools & Programs Accordion Tree
                </h3>
                <p className="text-xs text-gray-500 font-light mt-0.5">
                  Manage schools, department groups, and level badges (UG, PG, Ph.D, Diploma) rendered on the left panel of the modal.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const nextId = `school_${Date.now()}`;
                    const newSchool: EnquirySchoolItem = {
                      id: nextId,
                      title: "NEW SCHOOL OF STUDIES",
                      subtitle: "Empowering Next Generation Scholars",
                      icon: "GraduationCap",
                      groups: [
                        {
                          name: "Core Specializations",
                          courses: [
                            { level: "UG", name: "Sample Undergraduate Degree" },
                            { level: "PG", name: "Sample Postgraduate Degree" }
                          ]
                        }
                      ]
                    };
                    updateEnquiryPopup((p) => ({ ...p, schools: [...(p.schools || []), newSchool] }));
                    setActiveSchoolIndex((popupConfig.schools || []).length);
                    notifySave("New School added to popup hierarchy!");
                  }}
                  className="px-3.5 py-2 bg-[#072A6C] hover:bg-[#0c409c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus size={14} /> Add New School
                </button>
              </div>
            </div>

            {/* Left Panel Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-gray-200">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Left Panel Header Title</label>
                <input
                  type="text"
                  value={popupConfig.leftPanelTitle || "EXPLORE OUR SCHOOLS & PROGRAMS"}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, leftPanelTitle: e.target.value }))}
                  className="w-full h-8 px-2.5 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Left Panel Subtitle</label>
                <input
                  type="text"
                  value={popupConfig.leftPanelSubtitle || "Select a school to view its programs"}
                  onChange={(e) => updateEnquiryPopup((p) => ({ ...p, leftPanelSubtitle: e.target.value }))}
                  className="w-full h-8 px-2.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {/* Schools Accordion Switcher */}
            <div className="flex flex-wrap gap-2">
              {(popupConfig.schools || []).map((school, sIdx) => {
                const isSelected = sIdx === activeSchoolIndex;
                return (
                  <button
                    key={school.id || sIdx}
                    type="button"
                    onClick={() => setActiveSchoolIndex(sIdx)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#072A6C] text-white shadow-md shadow-[#072A6C]/20"
                        : "bg-slate-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px] font-black">
                      {sIdx + 1}
                    </span>
                    <span className="truncate max-w-[200px]">{school.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active School Detailed Tree Editor */}
            {popupConfig.schools && popupConfig.schools[activeSchoolIndex] && (() => {
              const currentSchool = popupConfig.schools[activeSchoolIndex];
              return (
                <div className="bg-slate-50 p-5 rounded-2xl border border-gray-200 space-y-6">
                  {/* School Main Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                    <span className="text-xs font-black text-[#072A6C] uppercase">
                      Editing School #{activeSchoolIndex + 1}: {currentSchool.title}
                    </span>

                    {(popupConfig.schools || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete school "${currentSchool.title}" and all its programs?`)) {
                            const updated = popupConfig.schools.filter((_, i) => i !== activeSchoolIndex);
                            updateEnquiryPopup((p) => ({ ...p, schools: updated }));
                            setActiveSchoolIndex(Math.max(0, activeSchoolIndex - 1));
                            notifySave("School removed from popup.");
                          }
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Delete School
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">School Title</label>
                      <input
                        type="text"
                        value={currentSchool.title}
                        onChange={(e) => {
                          const updated = [...popupConfig.schools];
                          updated[activeSchoolIndex] = { ...updated[activeSchoolIndex], title: e.target.value };
                          updateEnquiryPopup((p) => ({ ...p, schools: updated }));
                        }}
                        className="w-full h-8 px-2.5 text-xs font-extrabold text-[#072A6C] bg-white border border-gray-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">School Subtitle</label>
                      <input
                        type="text"
                        value={currentSchool.subtitle}
                        onChange={(e) => {
                          const updated = [...popupConfig.schools];
                          updated[activeSchoolIndex] = { ...updated[activeSchoolIndex], subtitle: e.target.value };
                          updateEnquiryPopup((p) => ({ ...p, schools: updated }));
                        }}
                        className="w-full h-8 px-2.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Groups & Courses within School */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#072A6C] uppercase">
                        Program Groups & Degrees ({currentSchool.groups.length} Groups)
                      </label>

                      {/* Add Group */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newGroupInput}
                          onChange={(e) => setNewGroupInput(e.target.value)}
                          placeholder="New group name (e.g. Data Science)..."
                          className="h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg w-56"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newGroupInput.trim()) {
                              e.preventDefault();
                              const updatedGroups = [
                                ...currentSchool.groups,
                                { name: newGroupInput.trim(), courses: [] }
                              ];
                              const updatedSchools = [...popupConfig.schools];
                              updatedSchools[activeSchoolIndex] = { ...currentSchool, groups: updatedGroups };
                              updateEnquiryPopup((p) => ({ ...p, schools: updatedSchools }));
                              setNewGroupInput("");
                              notifySave("New program group added!");
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newGroupInput.trim()) {
                              const updatedGroups = [
                                ...currentSchool.groups,
                                { name: newGroupInput.trim(), courses: [] }
                              ];
                              const updatedSchools = [...popupConfig.schools];
                              updatedSchools[activeSchoolIndex] = { ...currentSchool, groups: updatedGroups };
                              updateEnquiryPopup((p) => ({ ...p, schools: updatedSchools }));
                              setNewGroupInput("");
                              notifySave("New program group added!");
                            }
                          }}
                          className="px-3 h-8 bg-[#072A6C] hover:bg-[#0c409c] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                        >
                          <Plus size={13} /> Add Group
                        </button>
                      </div>
                    </div>

                    {/* Groups List */}
                    <div className="space-y-4">
                      {currentSchool.groups.map((group, gIdx) => (
                        <div key={gIdx} className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                            <div className="flex items-center gap-2 flex-1 max-w-md">
                              <span className="text-[10px] font-black text-gray-400">Group #{gIdx + 1}:</span>
                              <input
                                type="text"
                                value={group.name}
                                onChange={(e) => {
                                  const updatedGroups = [...currentSchool.groups];
                                  updatedGroups[gIdx] = { ...updatedGroups[gIdx], name: e.target.value };
                                  const updatedSchools = [...popupConfig.schools];
                                  updatedSchools[activeSchoolIndex] = { ...currentSchool, groups: updatedGroups };
                                  updateEnquiryPopup((p) => ({ ...p, schools: updatedSchools }));
                                }}
                                className="h-7 px-2 text-xs font-extrabold text-[#072A6C] bg-slate-50 border border-gray-200 rounded-md flex-1"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete group "${group.name}"?`)) {
                                  const updatedGroups = currentSchool.groups.filter((_, i) => i !== gIdx);
                                  const updatedSchools = [...popupConfig.schools];
                                  updatedSchools[activeSchoolIndex] = { ...currentSchool, groups: updatedGroups };
                                  updateEnquiryPopup((p) => ({ ...p, schools: updatedSchools }));
                                  notifySave("Group removed.");
                                }
                              }}
                              className="text-gray-400 hover:text-red-500 cursor-pointer p-1"
                              title="Delete Group"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Courses List */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">
                              Degrees & Courses in this Group ({group.courses.length})
                            </span>

                            <div className="flex flex-wrap gap-2">
                              {group.courses.map((course, cIdx) => {
                                let badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                                if (course.level === "PG") badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                if (course.level === "Ph.D") badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                                if (course.level === "Diploma") badgeColor = "bg-purple-50 text-purple-700 border-purple-200";

                                return (
                                  <div
                                    key={cIdx}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-gray-200 text-xs"
                                  >
                                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${badgeColor}`}>
                                      {course.level}
                                    </span>
                                    <span className="font-semibold text-gray-800">{course.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updatedCourses = group.courses.filter((_, i) => i !== cIdx);
                                        const updatedGroups = [...currentSchool.groups];
                                        updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: updatedCourses };
                                        const updatedSchools = [...popupConfig.schools];
                                        updatedSchools[activeSchoolIndex] = { ...currentSchool, groups: updatedGroups };
                                        updateEnquiryPopup((p) => ({ ...p, schools: updatedSchools }));
                                      }}
                                      className="text-gray-400 hover:text-red-500 cursor-pointer ml-1"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Add Course Form */}
                            <div className="flex flex-wrap gap-2 pt-1 items-center">
                              <select
                                value={newCourseLevel}
                                onChange={(e) => setNewCourseLevel(e.target.value)}
                                className="h-8 px-2 text-xs font-black bg-slate-50 border border-gray-200 rounded-lg cursor-pointer"
                              >
                                <option value="UG">UG</option>
                                <option value="PG">PG</option>
                                <option value="Ph.D">Ph.D</option>
                                <option value="Diploma">Diploma</option>
                              </select>

                              <input
                                type="text"
                                value={newCourseName}
                                onChange={(e) => setNewCourseName(e.target.value)}
                                placeholder="Course Name (e.g. B.Tech - CSE AI & ML)..."
                                className="flex-1 min-w-[200px] h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && newCourseName.trim()) {
                                    e.preventDefault();
                                    const updatedCourses = [
                                      ...group.courses,
                                      { level: newCourseLevel, name: newCourseName.trim() }
                                    ];
                                    const updatedGroups = [...currentSchool.groups];
                                    updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: updatedCourses };
                                    const updatedSchools = [...popupConfig.schools];
                                    updatedSchools[activeSchoolIndex] = { ...currentSchool, groups: updatedGroups };
                                    updateEnquiryPopup((p) => ({ ...p, schools: updatedSchools }));
                                    setNewCourseName("");
                                  }
                                }}
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  if (newCourseName.trim()) {
                                    const updatedCourses = [
                                      ...group.courses,
                                      { level: newCourseLevel, name: newCourseName.trim() }
                                    ];
                                    const updatedGroups = [...currentSchool.groups];
                                    updatedGroups[gIdx] = { ...updatedGroups[gIdx], courses: updatedCourses };
                                    const updatedSchools = [...popupConfig.schools];
                                    updatedSchools[activeSchoolIndex] = { ...currentSchool, groups: updatedGroups };
                                    updateEnquiryPopup((p) => ({ ...p, schools: updatedSchools }));
                                    setNewCourseName("");
                                  }
                                }}
                                className="px-3 h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
                              >
                                <Plus size={13} /> Add Course
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section 4: Enquiry Form Program Dropdown Options */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <BookOpen size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                4. Selectable Programs in Enquiry Form Dropdown ({(popupConfig.allPrograms || []).length} Options)
              </h3>
            </div>

            <p className="text-xs text-gray-500 font-light">
              These options populate the "Interested Program *" select dropdown in the admission enquiry popup modal.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {(popupConfig.allPrograms || []).map((prog, pIdx) => (
                <div
                  key={pIdx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50/60 border border-blue-200 text-xs font-bold text-[#072A6C]"
                >
                  <span>{prog}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (popupConfig.allPrograms || []).filter((_, i) => i !== pIdx);
                      updateEnquiryPopup((p) => ({ ...p, allPrograms: updated }));
                    }}
                    className="hover:text-red-500 cursor-pointer ml-1"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 max-w-md">
              <input
                type="text"
                value={newDropdownProg}
                onChange={(e) => setNewDropdownProg(e.target.value)}
                placeholder="Add dropdown program option..."
                className="flex-1 h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newDropdownProg.trim()) {
                    e.preventDefault();
                    updateEnquiryPopup((p) => ({
                      ...p,
                      allPrograms: [...(p.allPrograms || []), newDropdownProg.trim()]
                    }));
                    setNewDropdownProg("");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (newDropdownProg.trim()) {
                    updateEnquiryPopup((p) => ({
                      ...p,
                      allPrograms: [...(p.allPrograms || []), newDropdownProg.trim()]
                    }));
                    setNewDropdownProg("");
                  }
                }}
                className="px-3 h-8 bg-[#072A6C] hover:bg-[#0c409c] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus size={13} /> Add Option
              </button>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════ */}
          {/* INTERACTIVE LIVE PREVIEW MODAL                                   */}
          {/* ═════════════════════════════════════════════════════════════════ */}
          {showLivePreviewModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-6 overflow-y-auto animate-fade-in"
              onClick={() => setShowLivePreviewModal(false)}
            >
              <div
                className="bg-white w-full max-w-[1240px] md:h-auto md:max-h-[92vh] rounded-[24px] shadow-2xl relative flex flex-col md:flex-row overflow-hidden border border-gray-100 text-left select-none animate-scale-up"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Left Panel: Schools & Programs */}
                <div className="w-full md:w-1/2 p-5 md:p-6 border-r border-gray-100 flex flex-col bg-slate-50/30 overflow-y-auto max-h-[85vh]">
                  {/* Logo */}
                  <div className="flex items-center justify-center mb-6 mt-2">
                    <img 
                      src="/logo.png?v=3" 
                      alt="Chalapathi University" 
                      className="h-20 w-auto object-contain" 
                    />
                  </div>

                  <h3 className="text-[12px] font-black uppercase text-[#072A6C] tracking-wide mb-0.5">
                    {popupConfig.leftPanelTitle || "EXPLORE OUR SCHOOLS & PROGRAMS"}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium mb-4">
                    {popupConfig.leftPanelSubtitle || "Select a school to view its programs"}
                  </p>

                  {/* Accordions */}
                  <div className="space-y-2.5">
                    {(popupConfig.schools || []).map((school) => {
                      const isOpen = previewAccordion === school.id;
                      return (
                        <div key={school.id} className="border border-gray-200 rounded-[12px] bg-white overflow-hidden shadow-xs transition-all duration-300">
                          {/* Accordion Head */}
                          <button
                            type="button"
                            onClick={() => setPreviewAccordion(previewAccordion === school.id ? null : school.id)}
                            className={`w-full flex items-center justify-between py-2.5 px-4 transition-all duration-300 text-left cursor-pointer ${
                              isOpen ? "bg-[#072A6C] text-white" : "bg-white text-[#072A6C] hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <GraduationCap size={16} />
                              <div className="flex flex-col">
                                <span className="text-[10.5px] md:text-[11.5px] font-extrabold uppercase tracking-wider">{school.title}</span>
                                <span className={`text-[8.5px] md:text-[9.5px] ${isOpen ? "text-blue-100" : "text-gray-400"} mt-0.5`}>{school.subtitle}</span>
                              </div>
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                          </button>

                          {/* Accordion Body */}
                          {isOpen && (
                            <div className="p-3.5 bg-white border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                              {(school.groups || []).map((group, groupIdx) => (
                                <div key={groupIdx} className="space-y-2.5">
                                  <h4 className="text-[10.5px] font-extrabold text-[#072A6C] border-b border-gray-100 pb-1">{group.name}</h4>
                                  <div className="flex flex-col gap-1.5">
                                    {(group.courses || []).map((course, courseIdx) => {
                                      let badgeColor = "bg-blue-50 text-blue-600 border-blue-100";
                                      if (course.level === "PG") badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-100";
                                      if (course.level === "Ph.D") badgeColor = "bg-amber-50 text-amber-600 border-amber-100";
                                      if (course.level === "Diploma") badgeColor = "bg-purple-50 text-purple-600 border-purple-100";
                                      return (
                                        <button
                                          key={courseIdx}
                                          type="button"
                                          onClick={() => setPreviewFormData({ ...previewFormData, program: course.name })}
                                          className={`flex items-start gap-2 py-1 px-2 rounded-md border border-transparent hover:border-blue-100 hover:bg-blue-50/30 text-left transition-all duration-200 cursor-pointer ${
                                            previewFormData.program === course.name ? "bg-blue-50/80 border-blue-200" : ""
                                          }`}
                                        >
                                          <span className={`px-1.5 py-0.5 rounded text-[7.5px] font-black uppercase tracking-wider border shrink-0 ${badgeColor}`}>
                                            {course.level}
                                          </span>
                                          <span className="text-[9.5px] text-gray-700 font-bold leading-tight">
                                            {course.name}
                                          </span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Form */}
                <div className="w-full md:w-1/2 p-5 md:p-6 flex flex-col bg-white relative overflow-y-auto max-h-[85vh]">
                  {/* Close Button */}
                  <button 
                    type="button"
                    onClick={() => setShowLivePreviewModal(false)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <X size={15} />
                  </button>

                  <div className="mb-3.5">
                    <h2 className="text-[18px] font-black text-[#072A6C] tracking-tight uppercase leading-none">
                      {popupConfig.modalTitle || "ADMISSIONS OPEN 2026-27"}
                    </h2>
                    <p className="text-[10.5px] text-gray-500 font-medium mt-1">
                      {popupConfig.modalSubtitle || "Build Your Future. Lead with Innovation."}
                    </p>
                  </div>

                  {/* Form Title Card */}
                  <div className="bg-[#072A6C]/5 border border-[#072A6C]/10 rounded-xl p-3 flex items-center gap-3 mb-4">
                    <div className="w-8.5 h-8.5 rounded-lg bg-[#072A6C]/10 flex items-center justify-center text-[#072A6C] shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[10.5px] font-black text-[#072A6C] uppercase tracking-wider leading-none mb-1">
                        {popupConfig.formBadgeTitle || "ENQUIRY FORM"}
                      </h4>
                      <p className="text-[9.5px] text-gray-500 font-medium leading-none">
                        {popupConfig.formBadgeDesc || "Fill in your details. Our admission team will contact you soon."}
                      </p>
                    </div>
                  </div>

                  {previewSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 my-auto animate-fade-in">
                      <CheckCircle2 size={56} className="text-emerald-500 animate-bounce" />
                      <h4 className="text-base font-extrabold text-[#072A6C]">
                        {popupConfig.successTitle || "Enquiry Submitted Successfully!"}
                      </h4>
                      <p className="text-xs text-gray-500 text-center max-w-[340px]">
                        {popupConfig.successDesc || "Our admissions helpdesk representative will contact you on your registered mobile number shortly."}
                      </p>
                      <button 
                        type="button"
                        onClick={() => setShowLivePreviewModal(false)}
                        className="h-10 px-6 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Close Preview
                      </button>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        setPreviewSubmitted(true);
                      }} 
                      className="space-y-3.5 text-xs text-left"
                    >
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-extrabold text-gray-500 uppercase">Full Name *</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Enter your full name"
                              value={previewFormData.name}
                              onChange={(e) => setPreviewFormData({ ...previewFormData, name: e.target.value })}
                              className="w-full h-9 px-3 border border-gray-200 rounded-xl mt-1 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-extrabold text-gray-500 uppercase">Mobile Number *</label>
                            <input 
                              type="tel" 
                              required
                              placeholder="10 digit mobile"
                              value={previewFormData.mobile}
                              onChange={(e) => setPreviewFormData({ ...previewFormData, mobile: e.target.value })}
                              className="w-full h-9 px-3 border border-gray-200 rounded-xl mt-1 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-extrabold text-gray-500 uppercase">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            placeholder="Enter your email"
                            value={previewFormData.email}
                            onChange={(e) => setPreviewFormData({ ...previewFormData, email: e.target.value })}
                            className="w-full h-9 px-3 border border-gray-200 rounded-xl mt-1 text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-extrabold text-gray-500 uppercase">Interested Program *</label>
                          <select 
                            required
                            value={previewFormData.program}
                            onChange={(e) => setPreviewFormData({ ...previewFormData, program: e.target.value })}
                            className="w-full h-9 px-3 border border-gray-200 rounded-xl mt-1 text-xs bg-white cursor-pointer"
                          >
                            <option value="">Select a program (or click from left panel)</option>
                            {(popupConfig.allPrograms || []).map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <button
                          type="submit"
                          className="w-full h-11 bg-[#FAB005] hover:bg-[#e09e00] text-gray-900 font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
                        >
                          <Send size={13} />
                          <span>{popupConfig.ctaButtonText || "APPLY ENQUIRY"}</span>
                        </button>

                        <div className="flex items-center justify-center gap-1.5 text-[9px] text-gray-400 font-semibold">
                          <ShieldCheck size={12} />
                          <span>{popupConfig.privacyText || "Your information is safe with us. We respect your privacy."}</span>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* SUBTAB 5: LEADS & ENQUIRIES MANAGEMENT                                */}
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

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 6: ONLINE APPLICATIONS MANAGER                      */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {/* Top Bar with Search & Export */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <GraduationCap size={16} className="text-[#072A6C]" />
                Online Student Admission Applications ({(onlineApplications || []).length})
              </h3>
              <p className="text-xs text-gray-500">
                Track and manage complete online applications submitted through the 5-step /admissions/apply portal
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  const headers = ["Application No", "Full Name", "Program", "Mobile", "Email", "State", "City", "Qualification", "Year", "Parent Name", "Status", "Date"];
                  const rows = (onlineApplications || []).map((app) => [
                    app.applicationNo,
                    `"${app.fullName}"`,
                    `"${app.program}"`,
                    `"${app.mobile}"`,
                    `"${app.email}"`,
                    `"${app.state}"`,
                    `"${app.city || ''}"`,
                    `"${app.qualification}"`,
                    app.yearOfPassing,
                    `"${app.parentName || ''}"`,
                    app.status,
                    app.submittedAt
                  ]);
                  const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                  const uri = encodeURI(csv);
                  const a = document.createElement("a");
                  a.href = uri;
                  a.download = `Chalapathi_Online_Applications_${new Date().toISOString().slice(0, 10)}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  notifySave("Exported applications to CSV!");
                }}
                className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download size={13} /> Export Applications CSV
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Total Applications</span>
              <div className="text-2xl font-black text-[#072A6C] mt-1">{(onlineApplications || []).length}</div>
            </div>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Submitted</span>
              <div className="text-2xl font-black text-emerald-800 mt-1">
                {(onlineApplications || []).filter(a => a.status === "Submitted").length}
              </div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">Under Review</span>
              <div className="text-2xl font-black text-amber-800 mt-1">
                {(onlineApplications || []).filter(a => a.status === "Under Review" || a.status === "Verified").length}
              </div>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Admitted</span>
              <div className="text-2xl font-black text-purple-800 mt-1">
                {(onlineApplications || []).filter(a => a.status === "Admitted").length}
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Applicant Name, App No, Mobile, Program, or City..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Status:</span>
              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Verified">Verified</option>
                <option value="Under Review">Under Review</option>
                <option value="Admitted">Admitted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">App No & Date</th>
                    <th className="py-3 px-4">Applicant Details</th>
                    <th className="py-3 px-4">Program Applied</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Fee Paid</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {(onlineApplications || [])
                    .filter((a) => {
                      const q = appSearch.toLowerCase();
                      const matchQ =
                        a.fullName.toLowerCase().includes(q) ||
                        a.applicationNo.toLowerCase().includes(q) ||
                        a.mobile.includes(q) ||
                        a.program.toLowerCase().includes(q) ||
                        (a.city && a.city.toLowerCase().includes(q));
                      const matchStatus = appStatusFilter === "All" || a.status === appStatusFilter;
                      return matchQ && matchStatus;
                    })
                    .map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <span className="font-mono font-black text-[#072A6C] block">{app.applicationNo}</span>
                          <span className="text-[10px] text-gray-400">{app.submittedAt}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{app.fullName}</div>
                          <div className="text-[11px] text-gray-500 font-mono">+91 {app.mobile}</div>
                          <div className="text-[10px] text-gray-400">{app.email}</div>
                          {app.parentName && (
                            <div className="text-[10px] text-blue-600">Parent: {app.parentName}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-800 block max-w-[220px]">{app.program}</span>
                          <span className="text-[10px] text-gray-500">{app.qualification} • {app.yearOfPassing}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="block font-semibold">{app.city || "Guntur"}</span>
                          <span className="text-[10px] text-gray-400">{app.state}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Check size={11} /> ₹1,000 Paid
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={app.status}
                            onChange={(e) => {
                              const newStatus = e.target.value as any;
                              const updated = (onlineApplications || []).map((item) =>
                                item.id === app.id ? { ...item, status: newStatus } : item
                              );
                              updateOnlineApplications(updated);
                              notifySave(`Application ${app.applicationNo} status changed to ${newStatus}`);
                            }}
                            className="text-[11px] font-bold py-1 px-2 rounded-lg border border-gray-300 bg-white"
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Verified">Verified</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Admitted">Admitted</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete application ${app.applicationNo} for ${app.fullName}?`)) {
                                const updated = (onlineApplications || []).filter((item) => item.id !== app.id);
                                updateOnlineApplications(updated);
                                notifySave(`Application ${app.applicationNo} deleted.`);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash2 size={14} />
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

      {/* ── SUB-TAB 8: HOMEPAGE ADMISSIONS STRIP, TICKER & VISIT US ── */}
      {activeTab === "homepage" && (
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  Homepage Section Sync
                </span>
                <span className="text-xs text-gray-400 font-mono">Live on Home Page</span>
              </div>
              <h3 className="text-base font-black text-[#072A6C] uppercase">
                🏠 Homepage Admissions Strip, Alert Ticker & Visit Card
              </h3>
              <p className="text-xs text-gray-500">
                Directly configure what appears on the Chalapathi University homepage for admissions notices, the marquee alert ticker, and the campus visit block.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const tickerSec = (homepageSections || []).find((s) => s.id === "ticker");
                  const virtualSec = (homepageSections || []).find((s) => s.id === "virtualTour" || s.id === "admissionsStrip");
                  const updated = (homepageSections || []).map((s) => {
                    if (s.id === "ticker") {
                      return {
                        ...s,
                        title: "🚨 Admissions Open for Academic Year 2026–27 • Applications Closing Soon • Apply Now • Scholarships Available for Meritorious Students • Limited Seats • Register Today • Highest Placement Opportunities • Admissions Open for 2026–27 •"
                      };
                    }
                    if (s.id === "virtualTour" || s.id === "admissionsStrip") {
                      return {
                        ...s,
                        title: "Admissions Open for 2026–2027",
                        subtitle: "Experience world-class education with state-of-the-art facilities, expert faculty, and industry-oriented programs at Chalapathi University.",
                        buttonText: "Apply Online Now",
                        buttonUrl: "/apply-online"
                      };
                    }
                    return s;
                  });
                  updateHomepageSections(updated);
                  notifySave("Homepage Admissions sections updated and published live!");
                }}
                className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save size={13} /> Save Homepage Admissions
              </button>
            </div>
          </div>

          {/* Section 1: Alert Marquee Ticker */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Zap size={14} className="text-amber-500" />
                  1. Homepage Top Marquee Ticker
                </h4>
                <p className="text-[11px] text-gray-500">Continuous scrolling alert bar below the main hero header on the homepage</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-50 text-amber-800 text-[10px] font-black rounded-lg border border-amber-200">
                Yellow Marquee #F4B400
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Ticker Running Text</label>
              <textarea
                rows={3}
                value={
                  (homepageSections || []).find((s) => s.id === "ticker")?.title ||
                  "🚨 Admissions Open for Academic Year 2026–27 • Applications Closing Soon • Apply Now • Scholarships Available for Meritorious Students • Limited Seats • Register Today • Highest Placement Opportunities • Admissions Open for 2026–27 •"
                }
                onChange={(e) => {
                  const newText = e.target.value;
                  const exists = (homepageSections || []).some((s) => s.id === "ticker");
                  let updated;
                  if (exists) {
                    updated = (homepageSections || []).map((s) => (s.id === "ticker" ? { ...s, title: newText } : s));
                  } else {
                    updated = [...(homepageSections || []), { id: "ticker", name: "Admission Ticker", title: newText, enabled: true, order: (homepageSections?.length || 0) + 1 }];
                  }
                  updateHomepageSections(updated);
                }}
                className="w-full p-3 text-xs bg-amber-50/50 border border-amber-200 rounded-xl font-bold text-[#0A2D6D] leading-relaxed"
                placeholder="Enter scrolling marquee announcement..."
              />
            </div>

            {/* Live Ticker Preview */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Live Visual Preview</span>
              <div className="h-[42px] bg-[#F4B400] text-[#0A2D6D] rounded-xl flex items-center px-4 overflow-hidden font-bold text-xs shadow-inner">
                <div className="animate-pulse flex items-center gap-2 truncate">
                  {(homepageSections || []).find((s) => s.id === "ticker")?.title ||
                    "🚨 Admissions Open for Academic Year 2026–27 • Applications Closing Soon • Apply Now"}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Admissions Open Strip & Call to Action */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Sparkles size={14} className="text-blue-600" />
                  2. Admissions Strip & CTA Banner
                </h4>
                <p className="text-[11px] text-gray-500">The high-impact admissions call-to-action banner on the homepage</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Main Banner Heading</label>
                <input
                  type="text"
                  value={
                    (homepageSections || []).find((s) => s.id === "virtualTour" || s.id === "admissionsStrip")?.title ||
                    "Admissions Open for 2026–2027"
                  }
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const updated = (homepageSections || []).map((s) =>
                      s.id === "virtualTour" || s.id === "admissionsStrip" ? { ...s, title: newTitle } : s
                    );
                    updateHomepageSections(updated);
                  }}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Primary Button Text</label>
                <input
                  type="text"
                  value={
                    (homepageSections || []).find((s) => s.id === "virtualTour" || s.id === "admissionsStrip")?.buttonText ||
                    "Apply Online Now"
                  }
                  onChange={(e) => {
                    const newBtn = e.target.value;
                    const updated = (homepageSections || []).map((s) =>
                      s.id === "virtualTour" || s.id === "admissionsStrip" ? { ...s, buttonText: newBtn } : s
                    );
                    updateHomepageSections(updated);
                  }}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Banner Subtitle / Description</label>
              <textarea
                rows={2}
                value={
                  (homepageSections || []).find((s) => s.id === "virtualTour" || s.id === "admissionsStrip")?.subtitle ||
                  "Experience world-class education with state-of-the-art facilities, expert faculty, and industry-oriented programs at Chalapathi University."
                }
                onChange={(e) => {
                  const newSubtitle = e.target.value;
                  const updated = (homepageSections || []).map((s) =>
                    s.id === "virtualTour" || s.id === "admissionsStrip" ? { ...s, subtitle: newSubtitle } : s
                  );
                  updateHomepageSections(updated);
                }}
                className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700 leading-relaxed"
              />
            </div>

            {/* Feature Pills */}
            <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
              <span className="text-[10px] font-bold text-[#072A6C] uppercase">Highlight Badges on Banner</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-gray-700">
                <div className="p-2 bg-white rounded-lg border border-gray-200 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                  <span>100% Merit Scholarships</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-blue-600 shrink-0" />
                  <span>95% Placement Record</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-gray-200 flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-purple-600 shrink-0" />
                  <span>150+ Degree Programs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Visit Our Campus & Helpline Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <MapPin size={14} className="text-rose-600" />
                  3. Homepage "Visit Our Campus" Card & Helplines
                </h4>
                <p className="text-[11px] text-gray-500">Contact helplines, visiting hours, and direct navigation links shown to aspiring students</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Admissions Helpline</label>
                <div className="font-bold text-xs text-[#072A6C] flex items-center gap-1.5">
                  <Phone size={12} /> +91 91543 99999
                </div>
                <span className="text-[10px] text-gray-400">Available Mon-Sat 9AM-6PM</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Counseling Email</label>
                <div className="font-bold text-xs text-[#072A6C] flex items-center gap-1.5">
                  <Mail size={12} /> admissions@chalapathi.edu.in
                </div>
                <span className="text-[10px] text-gray-400">24hr response turnaround</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Campus Location</label>
                <div className="font-bold text-xs text-[#072A6C] flex items-center gap-1.5">
                  <Landmark size={12} /> Mothadaka, Guntur, AP
                </div>
                <span className="text-[10px] text-gray-400">Pin: 522016</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
