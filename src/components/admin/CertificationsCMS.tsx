import React, { useState } from "react";
import { 
  Plus, Trash2, Edit3, Copy, Eye, Award, CheckCircle2, 
  Search, ExternalLink, Image as ImageIcon, Zap, Sparkles, Layers,
  Save, RotateCcw, X, Globe, Briefcase, TrendingUp, ChevronRight,
  BookOpen, Building2, Check, ArrowRight, ArrowLeft, Palette, Layout, 
  ShieldCheck, HelpCircle, Code, Server, Cpu, Database, Cloud, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Certification, GlobalCertificationsPageConfig } from "../../data/certifications";
import { useData } from "../../context/DataContext";
import FullscreenModal from "../certifications/FullscreenModal";
import { PageVisibilityBanner } from "./AdminComponents";

interface CertificationsCMSProps {
  notifySave?: (msg?: string) => void;
}

export const CertificationsCMS: React.FC<CertificationsCMSProps> = ({ notifySave }) => {
  const { 
    certificationsData, 
    updateCertificationsData,
    certificationsPageConfig,
    updateCertificationsPageConfig,
    siteSettings,
    updateSiteSettings
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<"certs" | "header" | "worldStage">("certs");
  const [searchQuery, setSearchQuery] = useState("");
  
  // PAGE-BASED EDITOR STATE (No popup modal)
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editorSectionTab, setEditorSectionTab] = useState<
    "overview" | "journey" | "features" | "skills" | "industries" | "roadmap" | "companies" | "projects" | "stats" | "process"
  >("overview");
  const [newCompanyInput, setNewCompanyInput] = useState("");
  
  // Live Preview Modal Toggle
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state for Page Config
  const [pageConfigForm, setPageConfigForm] = useState<GlobalCertificationsPageConfig>(() => {
    return certificationsPageConfig || {
      badgeText: "Global Certifications",
      headline: "Adding Global Value\nTo Your Degree.",
      description1: "At Chalapathi University, we believe a degree alone isn't enough to stand out in today's competitive world — industry-recognized certifications give students the extra edge employers look for.",
      description2: "Students are provided opportunities to earn globally acclaimed certifications alongside their academic curriculum, boosting their skills, credibility, and career readiness.",
      worldStageHeadline: "Ready for the World Stage.",
      worldStageDescription: "These certifications, combined with academic learning, ensure students graduate as globally competent, industry-ready professionals — confident to compete not just in national markets, but anywhere in the world.",
      worldStageButtonText: "View Curriculum",
      worldStageButtonLink: "/academics/programmes"
    };
  });

  React.useEffect(() => {
    if (certificationsPageConfig) {
      setPageConfigForm(certificationsPageConfig);
    }
  }, [certificationsPageConfig]);

  const showToast = (msg?: string) => {
    const text = msg || "Saved successfully!";
    setToastMessage(text);
    if (notifySave) notifySave(text);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSavePageConfig = () => {
    updateCertificationsPageConfig(pageConfigForm);
    showToast("✓ Global Certifications page banners saved live!");
  };

  const filteredCerts = (certificationsData || []).filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveCert = (cert: Certification) => {
    const exists = certificationsData.some(c => c.id === cert.id);
    let updated: Certification[];
    if (exists) {
      updated = certificationsData.map(c => c.id === cert.id ? cert : c);
    } else {
      updated = [...certificationsData, cert];
    }
    updateCertificationsData(updated);
    setEditingCert(null);
    setIsCreatingNew(false);
    showToast(`✓ Certification "${cert.name}" saved live!`);
  };

  const handleDeleteCert = (id: string) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      const updated = certificationsData.filter(c => c.id !== id);
      updateCertificationsData(updated);
      if (editingCert?.id === id) {
        setEditingCert(null);
        setIsCreatingNew(false);
      }
      showToast("✓ Certification deleted successfully");
    }
  };

  const handleDuplicateCert = (cert: Certification) => {
    const copy: Certification = {
      ...JSON.parse(JSON.stringify(cert)),
      id: `${cert.id}-copy-${Date.now().toString().slice(-4)}`,
      name: `${cert.name} (Copy)`
    };
    updateCertificationsData([...certificationsData, copy]);
    showToast(`✓ Duplicated "${cert.name}"`);
  };

  // ──────────────────────────────────────────────────────────────────────────
  // IF IN EDITING MODE -> RENDER FULL DEDICATED EDITING PAGE
  // ──────────────────────────────────────────────────────────────────────────
  if (editingCert) {
    return (
      <div className="space-y-6 text-left font-[var(--font-poppins)] animate-fade-in pb-16">
        {/* Toast */}
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

        {/* Top Breadcrumb & Actions Bar */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingCert(null);
                setIsCreatingNew(false);
              }}
              className="h-9 px-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Certifications</span>
            </button>
            <div className="h-5 w-[1px] bg-gray-200 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3.5 h-3.5 rounded-full ring-2 ring-white shadow-xs" 
                  style={{ backgroundColor: editingCert.color || "#072A6C" }}
                />
                <h2 className="text-base font-black text-[#072A6C]">
                  {isCreatingNew ? "Create New Global Certification" : `Editing: ${editingCert.name}`}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-[#072A6C] rounded-full uppercase tracking-wider hidden sm:inline-block">
                  {editingCert.domain}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="h-9 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Preview Modal as seen on the public website"
            >
              <Eye size={14} />
              <span>Preview Live Modal</span>
            </button>
            <button
              onClick={() => {
                setEditingCert(null);
                setIsCreatingNew(false);
              }}
              className="h-9 px-3.5 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-bold rounded-xl border border-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSaveCert(editingCert)}
              className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Save size={14} />
              <span>Save & Publish Live</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {[
            { id: "overview", label: "1. Overview & Hero Banner", icon: Layout },
            { id: "journey", label: `2. The Journey (${editingCert.timeline?.length || 0} Milestones)`, icon: Award },
            { id: "features", label: `3. Why This Certification (${editingCert.features?.length || 0} Cards)`, icon: Zap },
            { id: "skills", label: `4. Technical Arsenal (${editingCert.skills?.length || 0} Skills)`, icon: Sparkles },
            { id: "industries", label: `5. Industry Applications (${editingCert.industries?.length || 0})`, icon: Building2 },
            { id: "roadmap", label: `6. Career Progression (${editingCert.roadmap?.length || 0} Stages)`, icon: TrendingUp },
            { id: "companies", label: `7. Companies Hiring (${editingCert.companies?.length || 0} Partners)`, icon: Briefcase },
            { id: "projects", label: `8. Student Projects (${editingCert.projects?.length || 0} Labs)`, icon: Code },
            { id: "stats", label: "9. Global Impact & Stats (3 Metrics)", icon: Globe },
            { id: "process", label: "10. Certification Process (Path to Success)", icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = editorSectionTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setEditorSectionTab(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#072A6C] text-white shadow-xs"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 1: OVERVIEW & HERO BANNER                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "overview" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">
                  Partner Overview & Modal Hero Header
                </h3>
                <p className="text-xs text-gray-500">
                  Configures the top hero banner inside the detail modal, partner badges, and course card details.
                </p>
              </div>
              <span className="text-xs font-bold text-gray-400">ID: {editingCert.id}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Partner Name (e.g. SAP, ServiceNow, AWS):
                </label>
                <input
                  type="text"
                  value={editingCert.name}
                  onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Domain / Category (e.g. Enterprise Resource Planning):
                </label>
                <input
                  type="text"
                  value={editingCert.domain}
                  onChange={(e) => setEditingCert({ ...editingCert, domain: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">
                  Modal Hero Headline / Tagline (e.g. Transforming Enterprise Operations):
                </label>
                <input
                  type="text"
                  value={editingCert.tagline}
                  onChange={(e) => setEditingCert({ ...editingCert, tagline: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl font-bold text-base text-[#072A6C]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">
                  Detailed Course Description (Appears on Card & inside Modal Hero):
                </label>
                <textarea
                  rows={3}
                  value={editingCert.description}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Duration (e.g. 3-6 Months):
                </label>
                <input
                  type="text"
                  value={editingCert.duration}
                  onChange={(e) => setEditingCert({ ...editingCert, duration: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Difficulty Level (e.g. Advanced, Intermediate, Foundation):
                </label>
                <input
                  type="text"
                  value={editingCert.difficulty}
                  onChange={(e) => setEditingCert({ ...editingCert, difficulty: e.target.value })}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Brand Theme Color (Accent Hex):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editingCert.color || "#072A6C"}
                    onChange={(e) => setEditingCert({ ...editingCert, color: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={editingCert.color}
                    onChange={(e) => setEditingCert({ ...editingCert, color: e.target.value })}
                    className="flex-1 h-10 px-3 border border-gray-200 rounded-xl font-mono uppercase text-xs"
                  />
                  <div 
                    className="px-3 py-2 rounded-xl text-[10px] font-bold text-white uppercase" 
                    style={{ backgroundColor: editingCert.color }}
                  >
                    Color Preview
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Interactive Layout Mode:
                </label>
                <select
                  value={editingCert.layoutMode}
                  onChange={(e) => setEditingCert({ ...editingCert, layoutMode: e.target.value as any })}
                  className="w-full h-10 px-3 border border-gray-200 rounded-xl bg-white text-xs font-semibold"
                >
                  {["dashboard", "pipeline", "topology", "journey", "shield", "pcb", "factory", "code", "roadmap", "cloud", "global", "database", "lifecycle", "funnel"].map((m) => (
                    <option key={m} value={m}>{m.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">
                  Partner Brand Logos (One URL per line):
                </label>
                <textarea
                  rows={2}
                  value={(editingCert.images || []).join("\n")}
                  onChange={(e) => setEditingCert({
                    ...editingCert,
                    images: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full p-3 border border-gray-200 rounded-xl font-mono text-[11px]"
                  placeholder="https://www.vectorlogo.zone/logos/sap/sap-ar21.svg"
                />
                <div className="flex flex-wrap gap-3 mt-2">
                  {editingCert.images.map((img, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2">
                      <img src={img} alt="Logo" className="h-6 w-auto object-contain max-w-[80px]" />
                      <span className="text-[10px] text-gray-400 font-mono truncate max-w-[120px]">{img}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 2: THE JOURNEY (MILESTONES)                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "journey" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">
                  The Learning Journey — "How You'll Get There"
                </h3>
                <p className="text-xs text-gray-500">
                  Step-by-step milestone progression nodes rendered horizontally across the page.
                </p>
              </div>
              <button
                onClick={() => {
                  const newTimeline = [
                    ...(editingCert.timeline || []),
                    { milestone: `Milestone ${editingCert.timeline.length + 1}`, desc: "Comprehensive step description and lab work." }
                  ];
                  setEditingCert({ ...editingCert, timeline: newTimeline });
                }}
                className="h-8 px-3.5 bg-[#072A6C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={13} /> Add Milestone Step
              </button>
            </div>

            <div className="space-y-3">
              {editingCert.timeline.map((step, sIdx) => (
                <div 
                  key={sIdx} 
                  className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl flex items-start gap-4 hover:border-gray-300 transition-colors"
                >
                  <div 
                    className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs"
                    style={{ backgroundColor: editingCert.color || "#072A6C" }}
                  >
                    {sIdx + 1}
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Milestone Name:</label>
                      <input
                        type="text"
                        value={step.milestone}
                        onChange={(e) => {
                          const tl = [...editingCert.timeline];
                          tl[sIdx].milestone = e.target.value;
                          setEditingCert({ ...editingCert, timeline: tl });
                        }}
                        className="w-full h-9 px-3 bg-white border border-gray-200 rounded-xl font-bold text-[#072A6C] text-xs"
                        placeholder="e.g. Foundation, Core Concepts..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Step Description:</label>
                      <input
                        type="text"
                        value={step.desc}
                        onChange={(e) => {
                          const tl = [...editingCert.timeline];
                          tl[sIdx].desc = e.target.value;
                          setEditingCert({ ...editingCert, timeline: tl });
                        }}
                        className="w-full h-9 px-3 bg-white border border-gray-200 rounded-xl text-gray-700 text-xs"
                        placeholder="Understanding the fundamentals and architectural components"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const tl = editingCert.timeline.filter((_, i) => i !== sIdx);
                      setEditingCert({ ...editingCert, timeline: tl });
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer mt-5"
                    title="Remove step"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 3: WHY THIS CERTIFICATION (FEATURE CARDS)              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "features" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">
                  Why This Certification — "Unlock Your Potential"
                </h3>
                <p className="text-xs text-gray-500">
                  Value proposition cards highlighting employability, industry readiness, salary potential, and global scope.
                </p>
              </div>
              <button
                onClick={() => {
                  const newFeatures = [
                    ...(editingCert.features || []),
                    { icon: "Zap", title: "New Advantage", desc: "Gain unique practical expertise and industry readiness." }
                  ];
                  setEditingCert({ ...editingCert, features: newFeatures });
                }}
                className="h-8 px-3.5 bg-[#072A6C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={13} /> Add Benefit Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editingCert.features.map((feat, fIdx) => (
                <div key={fIdx} className="p-4 bg-gray-50/80 border border-gray-200 rounded-2xl space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400">Card #{fIdx + 1}</span>
                    <button
                      onClick={() => {
                        const updated = editingCert.features.filter((_, i) => i !== fIdx);
                        setEditingCert({ ...editingCert, features: updated });
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Title:</label>
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => {
                          const updated = [...editingCert.features];
                          updated[fIdx].title = e.target.value;
                          setEditingCert({ ...editingCert, features: updated });
                        }}
                        className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C] text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Icon:</label>
                      <select
                        value={feat.icon}
                        onChange={(e) => {
                          const updated = [...editingCert.features];
                          updated[fIdx].icon = e.target.value;
                          setEditingCert({ ...editingCert, features: updated });
                        }}
                        className="w-full h-8 px-2 bg-white border border-gray-200 rounded-lg text-xs"
                      >
                        <option value="Briefcase">Briefcase</option>
                        <option value="Zap">Zap</option>
                        <option value="TrendingUp">TrendingUp</option>
                        <option value="Globe">Globe</option>
                        <option value="Award">Award</option>
                        <option value="ShieldCheck">ShieldCheck</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Description:</label>
                    <textarea
                      rows={2}
                      value={feat.desc}
                      onChange={(e) => {
                        const updated = [...editingCert.features];
                        updated[fIdx].desc = e.target.value;
                        setEditingCert({ ...editingCert, features: updated });
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 4: SKILLS YOU'LL MASTER (TECHNICAL ARSENAL)            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "skills" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">
                Skills You'll Master — "Your Technical Arsenal"
              </h3>
              <p className="text-xs text-gray-500">
                Interactive pill badges displayed in the center of the page.
              </p>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-2 text-xs">
                Skills List (Comma-separated or manage chips below):
              </label>
              <textarea
                rows={3}
                value={(editingCert.skills || []).join(", ")}
                onChange={(e) => setEditingCert({
                  ...editingCert,
                  skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                })}
                className="w-full p-3 border border-gray-200 rounded-xl text-xs"
                placeholder="Cloud Computing, Architecture, Security, DevOps, Networking, Database, Analytics, AI/ML..."
              />
            </div>

            <div className="pt-2">
              <label className="font-bold text-gray-500 block mb-2 text-xs uppercase tracking-wider">
                Active Skill Chips Preview ({editingCert.skills.length}):
              </label>
              <div className="flex flex-wrap gap-2">
                {editingCert.skills.map((skill, sIdx) => (
                  <div 
                    key={sIdx}
                    className="px-3.5 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-bold text-gray-700 flex items-center gap-2 hover:border-[#072A6C] transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => {
                        const updated = editingCert.skills.filter((_, i) => i !== sIdx);
                        setEditingCert({ ...editingCert, skills: updated });
                      }}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 5: WHERE IS IT USED? (INDUSTRY APPLICATIONS)          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "industries" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">
                  Where Is It Used? — "Industry Applications"
                </h3>
                <p className="text-xs text-gray-500">
                  Target industry verticals where this credential has strong commercial application.
                </p>
              </div>
              <button
                onClick={() => {
                  const updated = [
                    ...(editingCert.industries || []),
                    { name: "New Industry", desc: "Automating enterprise and sector workflows" }
                  ];
                  setEditingCert({ ...editingCert, industries: updated });
                }}
                className="h-8 px-3.5 bg-[#072A6C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={13} /> Add Industry
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {editingCert.industries.map((ind, iIdx) => (
                <div key={iIdx} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Industry #{iIdx + 1}</span>
                    <button
                      onClick={() => {
                        const updated = editingCert.industries.filter((_, i) => i !== iIdx);
                        setEditingCert({ ...editingCert, industries: updated });
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Industry Name:</label>
                    <input
                      type="text"
                      value={ind.name}
                      onChange={(e) => {
                        const updated = [...editingCert.industries];
                        updated[iIdx].name = e.target.value;
                        setEditingCert({ ...editingCert, industries: updated });
                      }}
                      className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C] text-xs"
                      placeholder="e.g. Manufacturing, Banking..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block uppercase mb-1">Application Scope:</label>
                    <textarea
                      rows={2}
                      value={ind.desc}
                      onChange={(e) => {
                        const updated = [...editingCert.industries];
                        updated[iIdx].desc = e.target.value;
                        setEditingCert({ ...editingCert, industries: updated });
                      }}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                      placeholder="Automating supply chains"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 6: CAREER PROGRESSION ROADMAP                          */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "roadmap" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">
                  Career Roadmap — "Your Progression"
                </h3>
                <p className="text-xs text-gray-500">
                  Career growth timeline steps from Student to Lead/Architect with experience milestones.
                </p>
              </div>
              <button
                onClick={() => {
                  const updated = [
                    ...(editingCert.roadmap || []),
                    { role: "Senior Consultant", exp: "5-8 Yrs" }
                  ];
                  setEditingCert({ ...editingCert, roadmap: updated });
                }}
                className="h-8 px-3.5 bg-[#072A6C] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={13} /> Add Career Stage
              </button>
            </div>

            <div className="space-y-3">
              {editingCert.roadmap.map((rm, rIdx) => (
                <div key={rIdx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#072A6C] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {rIdx + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={rm.role}
                      onChange={(e) => {
                        const updated = [...editingCert.roadmap];
                        updated[rIdx].role = e.target.value;
                        setEditingCert({ ...editingCert, roadmap: updated });
                      }}
                      className="h-9 px-3 bg-white border border-gray-200 rounded-xl font-bold text-[#072A6C] text-xs"
                      placeholder="Role Title (e.g. Junior Engineer, Architect)"
                    />
                    <input
                      type="text"
                      value={rm.exp}
                      onChange={(e) => {
                        const updated = [...editingCert.roadmap];
                        updated[rIdx].exp = e.target.value;
                        setEditingCert({ ...editingCert, roadmap: updated });
                      }}
                      className="h-9 px-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700"
                      placeholder="Experience (e.g. 0-2 Yrs, 3-5 Yrs)"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const updated = editingCert.roadmap.filter((_, i) => i !== rIdx);
                      setEditingCert({ ...editingCert, roadmap: updated });
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 7: COMPANIES HIRING (HIRING PARTNERS)                  */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "companies" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                  <Briefcase size={16} className="text-[#072A6C]" />
                  Companies Hiring — Top Recruiting Partners
                </h3>
                <p className="text-xs text-gray-500">
                  Manage multinational employers and tech giants actively recruiting candidates certified in {editingCert.name}.
                </p>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 text-[#072A6C] rounded-lg text-xs font-bold shrink-0">
                {editingCert.companies?.length || 0} Companies Added
              </span>
            </div>

            {/* Live Marquee Preview Box */}
            <div className="bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 p-5 rounded-2xl border border-gray-200 text-center space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#072A6C]">
                LIVE WEBSITE PREVIEW: COMPANIES HIRING
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                {(editingCert.companies || []).length > 0 ? (
                  editingCert.companies.map((company, cIdx) => (
                    <span
                      key={cIdx}
                      className="text-base sm:text-lg font-black tracking-wide text-slate-800 px-3 py-1 bg-white rounded-xl shadow-xs border border-gray-100"
                    >
                      {company}
                    </span>
                  ))
                ) : (
                  <span className="text-xs font-medium text-gray-400 italic">
                    No companies added yet. Add companies below to display on the live page marquee.
                  </span>
                )}
              </div>
            </div>

            {/* Quick Add Company Input & Tag Chips */}
            <div className="space-y-4">
              <label className="font-bold text-gray-700 block text-xs">
                Active Hiring Partners List:
              </label>

              {/* Tag Badges with Delete */}
              <div className="flex flex-wrap gap-2 min-h-[44px] p-3 bg-slate-50 rounded-xl border border-gray-200 items-center">
                {(editingCert.companies || []).map((company, cIdx) => (
                  <span
                    key={cIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-slate-800 text-xs font-bold rounded-lg shadow-xs"
                  >
                    <span>{company}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editingCert.companies.filter((_, i) => i !== cIdx);
                        setEditingCert({ ...editingCert, companies: updated });
                      }}
                      className="text-gray-400 hover:text-red-600 rounded cursor-pointer transition-colors"
                      title={`Remove ${company}`}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add New Company Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCompanyInput}
                  onChange={(e) => setNewCompanyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newCompanyInput.trim()) {
                      e.preventDefault();
                      const val = newCompanyInput.trim();
                      if (!editingCert.companies.includes(val)) {
                        setEditingCert({
                          ...editingCert,
                          companies: [...(editingCert.companies || []), val]
                        });
                      }
                      setNewCompanyInput("");
                    }
                  }}
                  placeholder="Enter company name (e.g. IBM, Deloitte, Amazon) and press Add or Enter..."
                  className="flex-1 h-9 px-3 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#072A6C]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCompanyInput.trim()) {
                      const val = newCompanyInput.trim();
                      if (!editingCert.companies.includes(val)) {
                        setEditingCert({
                          ...editingCert,
                          companies: [...(editingCert.companies || []), val]
                        });
                      }
                      setNewCompanyInput("");
                    }
                  }}
                  className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus size={14} /> Add Company
                </button>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider">
                  Quick Add Popular Tech Leaders:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "IBM", "Deloitte", "Capgemini", "Amazon", "Google", 
                    "Microsoft", "TCS", "Infosys", "Accenture", "Cisco", 
                    "Oracle", "Wipro", "Cognizant", "SAP", "ServiceNow"
                  ].map((preset) => {
                    const isAdded = (editingCert.companies || []).includes(preset);
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          if (isAdded) {
                            setEditingCert({
                              ...editingCert,
                              companies: editingCert.companies.filter(c => c !== preset)
                            });
                          } else {
                            setEditingCert({
                              ...editingCert,
                              companies: [...(editingCert.companies || []), preset]
                            });
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          isAdded 
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs" 
                            : "bg-white text-gray-700 hover:bg-gray-100 border-gray-200"
                        }`}
                      >
                        {isAdded ? `✓ ${preset}` : `+ ${preset}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bulk Text Area */}
              <div className="pt-2">
                <label className="font-bold text-gray-700 block mb-1 text-xs">
                  Bulk Comma-Separated Input:
                </label>
                <textarea
                  rows={2}
                  value={(editingCert.companies || []).join(", ")}
                  onChange={(e) => setEditingCert({
                    ...editingCert,
                    companies: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs bg-slate-50 focus:bg-white transition-colors"
                  placeholder="IBM, Deloitte, Capgemini, Amazon, Google, Microsoft, TCS..."
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 8: STUDENT PROJECTS (HANDS-ON EXPERIENCE)              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "projects" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                  <Code size={16} className="text-[#072A6C]" />
                  Student Projects — Hands-on Experience
                </h3>
                <p className="text-xs text-gray-500">
                  Practical capstone projects and lab scenarios built by students to demonstrate mastery in {editingCert.name}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const pj = [
                    ...(editingCert.projects || []),
                    { name: "New Real-World Capstone Project", duration: "3 Weeks", difficulty: "Medium" }
                  ];
                  setEditingCert({ ...editingCert, projects: pj });
                }}
                className="h-9 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors shrink-0"
              >
                <Plus size={14} /> Add Capstone Project
              </button>
            </div>

            {/* Project Cards Grid */}
            <div className="space-y-3">
              {(editingCert.projects || []).map((proj, pIdx) => (
                <div 
                  key={pIdx} 
                  className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#072A6C] text-white text-[10px] flex items-center justify-center font-bold">
                        {pIdx + 1}
                      </span>
                      Project Card {pIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editingCert.projects.filter((_, i) => i !== pIdx);
                        setEditingCert({ ...editingCert, projects: updated });
                      }}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 size={13} />
                      <span>Delete</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                    <div className="md:col-span-6 space-y-1">
                      <label className="font-bold text-gray-600 block text-[10.5px] uppercase">
                        Project Name / Title:
                      </label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => {
                          const updated = [...editingCert.projects];
                          updated[pIdx].name = e.target.value;
                          setEditingCert({ ...editingCert, projects: updated });
                        }}
                        className="w-full h-9 px-3 bg-white border border-gray-200 rounded-xl font-bold text-[#072A6C] text-xs"
                        placeholder="e.g. Enterprise Dashboard, Cloud Infrastructure Setup"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="font-bold text-gray-600 block text-[10.5px] uppercase">
                        Duration:
                      </label>
                      <input
                        type="text"
                        value={proj.duration}
                        onChange={(e) => {
                          const updated = [...editingCert.projects];
                          updated[pIdx].duration = e.target.value;
                          setEditingCert({ ...editingCert, projects: updated });
                        }}
                        className="w-full h-9 px-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700"
                        placeholder="e.g. 4 Weeks, 3 Weeks"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="font-bold text-gray-600 block text-[10.5px] uppercase">
                        Difficulty Level:
                      </label>
                      <select
                        value={proj.difficulty}
                        onChange={(e) => {
                          const updated = [...editingCert.projects];
                          updated[pIdx].difficulty = e.target.value;
                          setEditingCert({ ...editingCert, projects: updated });
                        }}
                        className="w-full h-9 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const pj = [
                    ...(editingCert.projects || []),
                    { name: "New Real-World Capstone Project", duration: "3 Weeks", difficulty: "Medium" }
                  ];
                  setEditingCert({ ...editingCert, projects: pj });
                }}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-[#072A6C] rounded-xl text-xs font-bold text-[#072A6C] flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-slate-50/50 hover:bg-slate-50"
              >
                <Plus size={14} /> Add Another Project Card
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 9: GLOBAL IMPACT & STATS (THE POWER OF THE CREDENTIAL) */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "stats" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                <Globe size={16} className="text-[#072A6C]" />
                Global Impact — The Power of the Credential
              </h3>
              <p className="text-xs text-gray-500">
                Key demand metrics displayed across 3 highlight cards showing global recognition, active hiring, and annual market growth.
              </p>
            </div>

            {/* 3 Metric Cards matching live design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Stat 1: Countries */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-200 shadow-xs space-y-3 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#072A6C]">
                  Metric 1: Countries Adoption
                </span>
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-gray-500 uppercase block text-left">
                    Countries Count (Number):
                  </label>
                  <input
                    type="number"
                    value={editingCert.stats?.countries || 140}
                    onChange={(e) => setEditingCert({
                      ...editingCert,
                      stats: { ...editingCert.stats, countries: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-center text-lg font-black text-sky-500"
                    placeholder="140"
                  />
                </div>
                <div className="text-[11px] font-black tracking-wider text-gray-500 uppercase">
                  COUNTRIES USING IT
                </div>
              </div>

              {/* Stat 2: Jobs Available */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-200 shadow-xs space-y-3 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#072A6C]">
                  Metric 2: Employment Opportunities
                </span>
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-gray-500 uppercase block text-left">
                    Jobs Count (Text):
                  </label>
                  <input
                    type="text"
                    value={editingCert.stats?.jobs || "500K+"}
                    onChange={(e) => setEditingCert({
                      ...editingCert,
                      stats: { ...editingCert.stats, jobs: e.target.value }
                    })}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-center text-lg font-black text-sky-500"
                    placeholder="500K+"
                  />
                </div>
                <div className="text-[11px] font-black tracking-wider text-gray-500 uppercase">
                  JOBS AVAILABLE
                </div>
              </div>

              {/* Stat 3: Demand Growth */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-white border border-blue-200 shadow-xs space-y-3 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#072A6C]">
                  Metric 3: Market Demand
                </span>
                <div className="space-y-1">
                  <label className="text-[10.5px] font-bold text-gray-500 uppercase block text-left">
                    Demand Growth (Text):
                  </label>
                  <input
                    type="text"
                    value={editingCert.stats?.demand || "Growing 25% YoY"}
                    onChange={(e) => setEditingCert({
                      ...editingCert,
                      stats: { ...editingCert.stats, demand: e.target.value }
                    })}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-xl text-center text-lg font-black text-sky-500"
                    placeholder="Growing 25% YoY"
                  />
                </div>
                <div className="text-[11px] font-black tracking-wider text-gray-500 uppercase">
                  MARKET DEMAND
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* SECTION 10: CERTIFICATION PROCESS (YOUR PATH TO SUCCESS)       */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {editorSectionTab === "process" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#072A6C]" />
                Certification Process — Your Path to Success
              </h3>
              <p className="text-xs text-gray-500">
                The standardized 7-step student roadmap rendered at the bottom of the certification detail modal.
              </p>
            </div>

            {/* 7-Step Interactive Flow Preview */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-gray-200 space-y-5">
              <div className="text-center">
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                  CERTIFICATION PROCESS
                </h4>
                <h3 className="text-2xl font-black text-gray-900">
                  Your Path to Success
                </h3>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {[
                  "Enroll in Course",
                  "Master Concepts",
                  "Hands-on Labs",
                  "Capstone Project",
                  "Mock Evaluation",
                  "Global Exam",
                  "Certified!"
                ].map((step, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div
                      className="px-4 py-3 bg-white border border-gray-200 shadow-xs rounded-xl text-center font-bold text-xs text-gray-800 flex items-center gap-2"
                      style={{ borderBottom: `4px solid ${editingCert.color || "#072A6C"}` }}
                    >
                      <span
                        className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                        style={{ backgroundColor: editingCert.color || "#072A6C" }}
                      >
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <span className="text-gray-300 font-black text-sm">➔</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-[#072A6C] font-medium text-center">
                ✨ The process flow highlights the student journey from course induction to global examination and official credential certification.
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4">
          <button
            onClick={() => {
              setEditingCert(null);
              setIsCreatingNew(false);
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            ← Cancel & Back to List
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} />
              <span>Preview Live Modal</span>
            </button>
            <button
              onClick={() => handleSaveCert(editingCert)}
              className="px-6 py-2.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save size={15} />
              <span>Save & Publish Live</span>
            </button>
          </div>
        </div>

        {/* Live Interactive Preview Modal */}
        <AnimatePresence>
          {isPreviewOpen && editingCert && (
            <FullscreenModal
              cert={editingCert}
              onClose={() => setIsPreviewOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAIN CERTIFICATIONS LIST VIEW (When not in full-page editing mode)
  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 text-left font-[var(--font-poppins)] animate-fade-in">
      {/* Toast */}
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

      {/* Header Overview Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37] uppercase tracking-wider mb-1">
            <Award size={16} />
            <span>Industry-Recognized Credentials CMS</span>
          </div>
          <h2 className="text-xl font-black text-[#072A6C]">Global Certifications Management</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage all 14+ global certification courses, inside learning journeys, skills arsenal, roadmap milestones, and page banners.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/academics/certifications"
            target="_blank"
            rel="noreferrer"
            className="h-9 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink size={13} />
            <span>View Live Page</span>
          </a>
        </div>
      </div>

      <PageVisibilityBanner
        pageName="Global Certifications"
        routePath="/academics/certifications"
        isHidden={Boolean(siteSettings.hiddenPages?.["/academics/certifications"])}
        onToggle={() => {
          const nextHidden = !siteSettings.hiddenPages?.["/academics/certifications"];
          updateSiteSettings({
            ...siteSettings,
            hiddenPages: {
              ...(siteSettings.hiddenPages || {}),
              "/academics/certifications": nextHidden
            }
          });
          notifySave?.(nextHidden ? "Global Certifications page hidden from visitors" : "Global Certifications page published & visible");
        }}
      />

      {/* Subtabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "certs", label: `1. All Certification Courses (${certificationsData.length})`, icon: Award },
          { id: "header", label: "2. Page Header & Value Banner", icon: Layout },
          { id: "worldStage", label: "3. Bottom World Stage Banner", icon: Globe }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? "bg-[#072A6C] text-white shadow-xs"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SUBTAB 1: ALL CERTIFICATIONS LIST                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === "certs" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search certifications, domains, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#072A6C]/20 outline-none"
              />
            </div>

            <button
              onClick={() => {
                setEditingCert({
                  id: `cert-${Date.now()}`,
                  name: "New Global Certification",
                  description: "Comprehensive industry curriculum and hands-on laboratory modules.",
                  images: ["https://www.vectorlogo.zone/logos/sap/sap-ar21.svg"],
                  color: "#0FAFFF",
                  domain: "Cloud & Enterprise Tech",
                  tagline: "Empowering Modern Digital Innovation",
                  layoutMode: "dashboard",
                  duration: "3-6 Months",
                  difficulty: "Advanced",
                  timeline: [
                    { milestone: "Foundation", desc: "Understanding fundamental architecture and baseline workflows" },
                    { milestone: "Core Concepts", desc: "In-depth module study and practical system design" },
                    { milestone: "Hands-on Labs", desc: "Live practical scenarios and cloud deployment simulations" },
                    { milestone: "Industry Projects", desc: "Real-world capstone project implementation" },
                    { milestone: "Assessment", desc: "Mock examinations, evaluations, and rubrics" },
                    { milestone: "Certification", desc: "Earning the official global credential" }
                  ],
                  features: [
                    { icon: "Briefcase", title: "Increase Employability", desc: "Gain globally recognized skills valued by top recruiters." },
                    { icon: "Zap", title: "Industry Ready", desc: "Master tools used in real companies." },
                    { icon: "TrendingUp", title: "Higher Salary Potential", desc: "Develop specialized expertise that increases career opportunities." },
                    { icon: "Globe", title: "Global Opportunities", desc: "Recognized across multiple countries and industries." }
                  ],
                  skills: ["Cloud Computing", "Architecture", "Security", "DevOps", "Networking", "Database", "Analytics", "AI/ML"],
                  industries: [
                    { name: "Manufacturing", desc: "Automating supply chains" },
                    { name: "Banking", desc: "Securing financial data" },
                    { name: "Healthcare", desc: "Managing patient systems" },
                    { name: "IT & Tech", desc: "Building scalable platforms" }
                  ],
                  roadmap: [
                    { role: "Student", exp: "0 Yrs" },
                    { role: "Certified Professional", exp: "0-1 Yrs" },
                    { role: "Junior Engineer", exp: "1-3 Yrs" },
                    { role: "Senior Engineer", exp: "3-5 Yrs" },
                    { role: "Architect", exp: "5-8 Yrs" },
                    { role: "Consultant / Lead", exp: "8+ Yrs" }
                  ],
                  companies: ["Amazon", "Google", "Microsoft", "TCS", "Infosys", "Deloitte"],
                  projects: [
                    { name: "Enterprise Systems Deployment", duration: "4 Weeks", difficulty: "Hard" },
                    { name: "Cloud Infrastructure Setup", duration: "3 Weeks", difficulty: "Medium" }
                  ],
                  stats: {
                    countries: 140,
                    jobs: "500K+",
                    demand: "Growing 25% YoY"
                  }
                });
                setIsCreatingNew(true);
                setEditorSectionTab("overview");
              }}
              className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Add Certification</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCerts.map((cert) => (
              <div 
                key={cert.id} 
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Accent top color strip */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1.5" 
                  style={{ backgroundColor: cert.color || "#072A6C" }}
                />

                <div>
                  {/* Top Logos & Action Buttons */}
                  <div className="flex items-start justify-between gap-2 mb-4 pt-1">
                    <div className="h-10 px-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center gap-2 max-w-[140px] overflow-hidden">
                      {cert.images.map((img, idx) => (
                        <img key={idx} src={img} alt={cert.name} className="h-6 w-auto object-contain max-w-[60px]" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCert(cert);
                          setIsCreatingNew(false);
                          setEditorSectionTab("overview");
                        }}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Full Page CMS"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDuplicateCert(cert)}
                        className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <span className="text-[9.5px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                    {cert.domain}
                  </span>
                  <h4 className="text-base font-black text-[#072A6C] tracking-tight mb-1">
                    {cert.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-gray-700 italic mb-2">
                    "{cert.tagline}"
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gray-500">Duration: {cert.duration}</span>
                    <span className="text-[#D4AF37]">{cert.difficulty}</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCert(cert);
                      setIsCreatingNew(false);
                      setEditorSectionTab("overview");
                    }}
                    className="w-full py-2 bg-gray-50 hover:bg-[#072A6C] text-gray-700 hover:text-white text-xs font-bold rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Edit Inside Content & Journey</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SUBTAB 2: PAGE HEADER & VALUE BANNER CMS                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === "header" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">
                Global Certifications Page Header & Value Banner
              </h3>
              <p className="text-xs text-gray-500">Edit the top badge, main headline, and intro paragraphs seen on /academics/certifications</p>
            </div>
            <button
              onClick={handleSavePageConfig}
              className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save size={14} /> Save Header Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Badge Tagline:</label>
              <input
                type="text"
                value={pageConfigForm.badgeText}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, badgeText: e.target.value })}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Main Headline (Support Newlines):</label>
              <textarea
                rows={2}
                value={pageConfigForm.headline}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, headline: e.target.value })}
                className="w-full p-2.5 border border-gray-200 rounded-xl font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">Paragraph 1 (Primary Message):</label>
              <textarea
                rows={3}
                value={pageConfigForm.description1}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, description1: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">Paragraph 2 (Secondary Message):</label>
              <textarea
                rows={3}
                value={pageConfigForm.description2}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, description2: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SUBTAB 3: BOTTOM WORLD STAGE CTA BANNER CMS                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {activeSubTab === "worldStage" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">
                Bottom World Stage Banner CMS
              </h3>
              <p className="text-xs text-gray-500">Edit the concluding CTA banner at the bottom of the certifications page</p>
            </div>
            <button
              onClick={handleSavePageConfig}
              className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save size={14} /> Save World Stage Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Banner Headline:</label>
              <input
                type="text"
                value={pageConfigForm.worldStageHeadline}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, worldStageHeadline: e.target.value })}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Button Text:</label>
              <input
                type="text"
                value={pageConfigForm.worldStageButtonText}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, worldStageButtonText: e.target.value })}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="font-bold text-gray-700 block mb-1">Banner Description:</label>
              <textarea
                rows={3}
                value={pageConfigForm.worldStageDescription}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, worldStageDescription: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Button Target Link (e.g. /academics/programmes):</label>
              <input
                type="text"
                value={pageConfigForm.worldStageButtonLink}
                onChange={(e) => setPageConfigForm({ ...pageConfigForm, worldStageButtonLink: e.target.value })}
                className="w-full h-10 px-3 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsCMS;
