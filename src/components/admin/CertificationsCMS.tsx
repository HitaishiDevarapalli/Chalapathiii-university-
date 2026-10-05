import React, { useState } from "react";
import { 
  Plus, Trash2, Edit3, Copy, Eye, Award, CheckCircle2, 
  Search, ExternalLink, Image as ImageIcon, Zap, Sparkles, Layers,
  Save, RotateCcw, X, Globe, Briefcase, TrendingUp, ChevronRight,
  BookOpen, Building2, Check, ArrowRight, Palette, Layout, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Certification, GlobalCertificationsPageConfig } from "../../data/certifications";
import { useData } from "../../context/DataContext";
import { ImageField, SectionHeader } from "./AdminComponents";

interface CertificationsCMSProps {
  notifySave?: (msg?: string) => void;
}

export const CertificationsCMS: React.FC<CertificationsCMSProps> = ({ notifySave }) => {
  const { 
    certificationsData, 
    updateCertificationsData,
    certificationsPageConfig,
    updateCertificationsPageConfig
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<"certs" | "header" | "worldStage">("certs");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [modalTab, setModalTab] = useState<"general" | "journey" | "skillsCareer" | "projectsStats" | "featuresIndustries">("general");
  const [isAddOpen, setIsAddOpen] = useState(false);
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
    setIsAddOpen(false);
    showToast(`✓ Certification "${cert.name}" saved live!`);
  };

  const handleDeleteCert = (id: string) => {
    if (window.confirm("Are you sure you want to delete this certification?")) {
      const updated = certificationsData.filter(c => c.id !== id);
      updateCertificationsData(updated);
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

  return (
    <div className="space-y-6 text-left font-[var(--font-poppins)]">
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
            <span>Industry-Recognized Credentials</span>
          </div>
          <h2 className="text-xl font-black text-[#072A6C]">Global Certifications CMS</h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage all 14+ global certification cards, inside modal content, partner logos, learning roadmaps, skills, and page banners.
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
      {/* SUBTAB 1: ALL CERTIFICATIONS LIST & FULL INSIDE MODAL CMS      */}
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
                    { milestone: "Foundation", desc: "Core fundamental principles and architecture overview" },
                    { milestone: "Core Concepts", desc: "In-depth module study and practical system administration" },
                    { milestone: "Hands-on Labs", desc: "Live real-world cloud deployment simulations" },
                    { milestone: "Industry Projects", desc: "Full-scale capstone implementation" },
                    { milestone: "Assessment", desc: "Mock testing and validation" },
                    { milestone: "Certification", desc: "Official examination and global credential award" }
                  ],
                  features: [
                    { icon: "Briefcase", title: "Increase Employability", desc: "Gain globally recognized skills valued by top recruiters." },
                    { icon: "Zap", title: "Industry Ready", desc: "Master tools used in real companies." },
                    { icon: "TrendingUp", title: "Higher Salary Potential", desc: "Develop specialized expertise that increases career opportunities." },
                    { icon: "Globe", title: "Global Opportunities", desc: "Recognized across multiple countries and industries." }
                  ],
                  skills: ["Cloud Computing", "Enterprise Systems", "Security", "DevOps"],
                  industries: [
                    { name: "IT & Tech", desc: "Building scalable platforms" },
                    { name: "Banking & Finance", desc: "Securing financial infrastructure" }
                  ],
                  roadmap: [
                    { role: "Student", exp: "0 Yrs" },
                    { role: "Certified Specialist", exp: "0-1 Yrs" },
                    { role: "Senior Engineer", exp: "3-5 Yrs" }
                  ],
                  companies: ["Amazon", "Google", "Microsoft", "TCS", "Infosys", "Deloitte"],
                  projects: [
                    { name: "Enterprise Systems Deployment", duration: "4 Weeks", difficulty: "Hard" }
                  ],
                  stats: {
                    countries: 140,
                    jobs: "500K+",
                    demand: "Growing 25% YoY"
                  }
                });
                setModalTab("general");
                setIsAddOpen(true);
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
                          setModalTab("general");
                        }}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Full Inside Content"
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
                      setModalTab("general");
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FULL INSIDE MODAL & DETAILED CONTENT EDITOR                    */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {(editingCert || isAddOpen) && (
          <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-gray-100 space-y-5 my-8 text-left max-h-[90vh] flex flex-col"
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: editingCert?.color || "#072A6C" }}
                  />
                  <h3 className="text-lg font-black text-[#072A6C]">
                    {editingCert ? `Edit "${editingCert.name}" (Full Content & Modal)` : "Add New Global Certification"}
                  </h3>
                </div>
                <button
                  onClick={() => { setEditingCert(null); setIsAddOpen(false); }}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Subtabs */}
              <div className="flex flex-wrap gap-1.5 border-b border-gray-100 pb-2 shrink-0">
                {[
                  { id: "general", label: "1. General & Hero" },
                  { id: "journey", label: "2. The Journey (Milestones)" },
                  { id: "skillsCareer", label: "3. Skills & Career Roadmap" },
                  { id: "projectsStats", label: "4. Projects & Global Stats" },
                  { id: "featuresIndustries", label: "5. Value Props & Industries" }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setModalTab(t.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      modalTab === t.id
                        ? "bg-[#072A6C] text-white shadow-xs"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Modal Tab Body */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
                {editingCert && (
                  <>
                    {/* TAB 1: GENERAL & HERO */}
                    {modalTab === "general" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="font-bold text-gray-700 block mb-1">Certification Name (e.g. SAP, AWS):</label>
                            <input
                              type="text"
                              value={editingCert.name}
                              onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                              className="w-full h-9 px-3 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-gray-700 block mb-1">Domain (e.g. Workflow Automation):</label>
                            <input
                              type="text"
                              value={editingCert.domain}
                              onChange={(e) => setEditingCert({ ...editingCert, domain: e.target.value })}
                              className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="font-bold text-gray-700 block mb-1">Hero Tagline / Partner Headline (e.g. Transforming Enterprise Operations):</label>
                            <input
                              type="text"
                              value={editingCert.tagline}
                              onChange={(e) => setEditingCert({ ...editingCert, tagline: e.target.value })}
                              className="w-full h-9 px-3 border border-gray-200 rounded-xl font-bold"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="font-bold text-gray-700 block mb-1">Detailed Description:</label>
                            <textarea
                              rows={3}
                              value={editingCert.description}
                              onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                              className="w-full p-3 border border-gray-200 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-gray-700 block mb-1">Duration (e.g. 3-6 Months):</label>
                            <input
                              type="text"
                              value={editingCert.duration}
                              onChange={(e) => setEditingCert({ ...editingCert, duration: e.target.value })}
                              className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-gray-700 block mb-1">Difficulty Level (e.g. Advanced, Intermediate):</label>
                            <input
                              type="text"
                              value={editingCert.difficulty}
                              onChange={(e) => setEditingCert({ ...editingCert, difficulty: e.target.value })}
                              className="w-full h-9 px-3 border border-gray-200 rounded-xl"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-gray-700 block mb-1">Theme Accent Hex Color (e.g. #0FAFFF):</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="color"
                                value={editingCert.color || "#072A6C"}
                                onChange={(e) => setEditingCert({ ...editingCert, color: e.target.value })}
                                className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                              />
                              <input
                                type="text"
                                value={editingCert.color}
                                onChange={(e) => setEditingCert({ ...editingCert, color: e.target.value })}
                                className="flex-1 h-9 px-3 border border-gray-200 rounded-xl uppercase font-mono"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="font-bold text-gray-700 block mb-1">Layout Mode:</label>
                            <select
                              value={editingCert.layoutMode}
                              onChange={(e) => setEditingCert({ ...editingCert, layoutMode: e.target.value as any })}
                              className="w-full h-9 px-3 border border-gray-200 rounded-xl bg-white"
                            >
                              {["dashboard", "pipeline", "topology", "journey", "shield", "pcb", "factory", "code", "roadmap", "cloud", "global", "database", "lifecycle", "funnel"].map((m) => (
                                <option key={m} value={m}>{m.toUpperCase()}</option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="font-bold text-gray-700 block mb-1">Partner Logo URLs (Comma separated):</label>
                            <textarea
                              rows={2}
                              value={(editingCert.images || []).join("\n")}
                              onChange={(e) => setEditingCert({
                                ...editingCert,
                                images: e.target.value.split("\n").map(s => s.trim()).filter(Boolean)
                              })}
                              className="w-full p-2.5 border border-gray-200 rounded-xl font-mono text-[11px]"
                              placeholder="https://www.vectorlogo.zone/logos/sap/sap-ar21.svg"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 2: THE JOURNEY (MILESTONES) */}
                    {modalTab === "journey" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-[#072A6C] uppercase tracking-wider">
                            The Learning Journey Milestones ({editingCert.timeline.length} Steps)
                          </h4>
                          <button
                            onClick={() => {
                              const newTimeline = [
                                ...(editingCert.timeline || []),
                                { milestone: "New Milestone", desc: "Detailed step description" }
                              ];
                              setEditingCert({ ...editingCert, timeline: newTimeline });
                            }}
                            className="h-7 px-3 bg-blue-50 hover:bg-blue-100 text-[#072A6C] text-[11px] font-bold rounded-lg flex items-center gap-1"
                          >
                            <Plus size={12} /> Add Milestone
                          </button>
                        </div>

                        <div className="space-y-3">
                          {editingCert.timeline.map((step, sIdx) => (
                            <div key={sIdx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-[#072A6C] text-white font-bold flex items-center justify-center shrink-0 mt-1 text-[10px]">
                                {sIdx + 1}
                              </span>
                              <div className="flex-1 space-y-2">
                                <input
                                  type="text"
                                  value={step.milestone}
                                  onChange={(e) => {
                                    const tl = [...editingCert.timeline];
                                    tl[sIdx].milestone = e.target.value;
                                    setEditingCert({ ...editingCert, timeline: tl });
                                  }}
                                  className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                                  placeholder="Milestone Title"
                                />
                                <input
                                  type="text"
                                  value={step.desc}
                                  onChange={(e) => {
                                    const tl = [...editingCert.timeline];
                                    tl[sIdx].desc = e.target.value;
                                    setEditingCert({ ...editingCert, timeline: tl });
                                  }}
                                  className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-gray-600"
                                  placeholder="Step Description"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const tl = editingCert.timeline.filter((_, i) => i !== sIdx);
                                  setEditingCert({ ...editingCert, timeline: tl });
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB 3: SKILLS & CAREER ROADMAP */}
                    {modalTab === "skillsCareer" && (
                      <div className="space-y-5">
                        {/* Skills Chips */}
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">
                            Skills Acquired (Comma separated tags):
                          </label>
                          <textarea
                            rows={2}
                            value={(editingCert.skills || []).join(", ")}
                            onChange={(e) => setEditingCert({
                              ...editingCert,
                              skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                            })}
                            className="w-full p-2.5 border border-gray-200 rounded-xl"
                            placeholder="Cloud Computing, Security, DevOps, Architecture..."
                          />
                        </div>

                        {/* Hiring Companies */}
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">
                            Top Hiring Companies (Comma separated):
                          </label>
                          <textarea
                            rows={2}
                            value={(editingCert.companies || []).join(", ")}
                            onChange={(e) => setEditingCert({
                              ...editingCert,
                              companies: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                            })}
                            className="w-full p-2.5 border border-gray-200 rounded-xl"
                            placeholder="Amazon, Google, Microsoft, TCS, Infosys, Deloitte..."
                          />
                        </div>

                        {/* Career Roadmap */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="font-bold text-gray-700">Career Progression Roles:</label>
                            <button
                              onClick={() => {
                                const rm = [...(editingCert.roadmap || []), { role: "New Role", exp: "1-3 Yrs" }];
                                setEditingCert({ ...editingCert, roadmap: rm });
                              }}
                              className="h-6 px-2.5 bg-blue-50 text-[#072A6C] text-[10px] font-bold rounded-lg flex items-center gap-1"
                            >
                              <Plus size={11} /> Add Role
                            </button>
                          </div>
                          <div className="space-y-2">
                            {editingCert.roadmap.map((rm, rIdx) => (
                              <div key={rIdx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={rm.role}
                                  onChange={(e) => {
                                    const updated = [...editingCert.roadmap];
                                    updated[rIdx].role = e.target.value;
                                    setEditingCert({ ...editingCert, roadmap: updated });
                                  }}
                                  className="flex-1 h-8 px-2.5 border border-gray-200 rounded-lg font-bold"
                                  placeholder="Role Title"
                                />
                                <input
                                  type="text"
                                  value={rm.exp}
                                  onChange={(e) => {
                                    const updated = [...editingCert.roadmap];
                                    updated[rIdx].exp = e.target.value;
                                    setEditingCert({ ...editingCert, roadmap: updated });
                                  }}
                                  className="w-28 h-8 px-2.5 border border-gray-200 rounded-lg text-center"
                                  placeholder="0-2 Yrs"
                                />
                                <button
                                  onClick={() => {
                                    const updated = editingCert.roadmap.filter((_, i) => i !== rIdx);
                                    setEditingCert({ ...editingCert, roadmap: updated });
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 4: PROJECTS & GLOBAL STATS */}
                    {modalTab === "projectsStats" && (
                      <div className="space-y-5">
                        {/* Stats */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                          <h4 className="font-bold text-[#072A6C] uppercase text-[11px]">Global Recognition Stats</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="font-bold text-gray-600 block mb-1">Countries Count:</label>
                              <input
                                type="number"
                                value={editingCert.stats?.countries || 140}
                                onChange={(e) => setEditingCert({
                                  ...editingCert,
                                  stats: { ...editingCert.stats, countries: parseInt(e.target.value) || 0 }
                                })}
                                className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-gray-600 block mb-1">Jobs Open (e.g. 500K+):</label>
                              <input
                                type="text"
                                value={editingCert.stats?.jobs || "500K+"}
                                onChange={(e) => setEditingCert({
                                  ...editingCert,
                                  stats: { ...editingCert.stats, jobs: e.target.value }
                                })}
                                className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg"
                              />
                            </div>
                            <div>
                              <label className="font-bold text-gray-600 block mb-1">Demand Growth (e.g. 25% YoY):</label>
                              <input
                                type="text"
                                value={editingCert.stats?.demand || "Growing 25% YoY"}
                                onChange={(e) => setEditingCert({
                                  ...editingCert,
                                  stats: { ...editingCert.stats, demand: e.target.value }
                                })}
                                className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Projects */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="font-bold text-gray-700">Hands-on Capstone Projects:</label>
                            <button
                              onClick={() => {
                                const pj = [...(editingCert.projects || []), { name: "New Capstone Project", duration: "3 Weeks", difficulty: "Medium" }];
                                setEditingCert({ ...editingCert, projects: pj });
                              }}
                              className="h-6 px-2.5 bg-blue-50 text-[#072A6C] text-[10px] font-bold rounded-lg flex items-center gap-1"
                            >
                              <Plus size={11} /> Add Project
                            </button>
                          </div>
                          <div className="space-y-2">
                            {editingCert.projects.map((proj, pIdx) => (
                              <div key={pIdx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={proj.name}
                                  onChange={(e) => {
                                    const updated = [...editingCert.projects];
                                    updated[pIdx].name = e.target.value;
                                    setEditingCert({ ...editingCert, projects: updated });
                                  }}
                                  className="flex-1 h-8 px-2.5 border border-gray-200 rounded-lg font-bold"
                                  placeholder="Project Name"
                                />
                                <input
                                  type="text"
                                  value={proj.duration}
                                  onChange={(e) => {
                                    const updated = [...editingCert.projects];
                                    updated[pIdx].duration = e.target.value;
                                    setEditingCert({ ...editingCert, projects: updated });
                                  }}
                                  className="w-24 h-8 px-2.5 border border-gray-200 rounded-lg text-center"
                                  placeholder="4 Weeks"
                                />
                                <input
                                  type="text"
                                  value={proj.difficulty}
                                  onChange={(e) => {
                                    const updated = [...editingCert.projects];
                                    updated[pIdx].difficulty = e.target.value;
                                    setEditingCert({ ...editingCert, projects: updated });
                                  }}
                                  className="w-24 h-8 px-2.5 border border-gray-200 rounded-lg text-center"
                                  placeholder="Hard"
                                />
                                <button
                                  onClick={() => {
                                    const updated = editingCert.projects.filter((_, i) => i !== pIdx);
                                    setEditingCert({ ...editingCert, projects: updated });
                                  }}
                                  className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB 5: FEATURES & TARGET INDUSTRIES */}
                    {modalTab === "featuresIndustries" && (
                      <div className="space-y-5">
                        {/* Features */}
                        <div>
                          <label className="font-bold text-gray-700 block mb-2">Key Value Props & Benefits:</label>
                          <div className="space-y-2">
                            {editingCert.features.map((feat, fIdx) => (
                              <div key={fIdx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={feat.title}
                                    onChange={(e) => {
                                      const updated = [...editingCert.features];
                                      updated[fIdx].title = e.target.value;
                                      setEditingCert({ ...editingCert, features: updated });
                                    }}
                                    className="flex-1 h-8 px-2.5 bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                                    placeholder="Feature Title"
                                  />
                                  <input
                                    type="text"
                                    value={feat.icon}
                                    onChange={(e) => {
                                      const updated = [...editingCert.features];
                                      updated[fIdx].icon = e.target.value;
                                      setEditingCert({ ...editingCert, features: updated });
                                    }}
                                    className="w-28 h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-center"
                                    placeholder="Icon Name"
                                  />
                                </div>
                                <input
                                  type="text"
                                  value={feat.desc}
                                  onChange={(e) => {
                                    const updated = [...editingCert.features];
                                    updated[fIdx].desc = e.target.value;
                                    setEditingCert({ ...editingCert, features: updated });
                                  }}
                                  className="w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-gray-600"
                                  placeholder="Feature Description"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Industries */}
                        <div>
                          <label className="font-bold text-gray-700 block mb-2">Target Industries & Applications:</label>
                          <div className="space-y-2">
                            {editingCert.industries.map((ind, iIdx) => (
                              <div key={iIdx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={ind.name}
                                  onChange={(e) => {
                                    const updated = [...editingCert.industries];
                                    updated[iIdx].name = e.target.value;
                                    setEditingCert({ ...editingCert, industries: updated });
                                  }}
                                  className="w-1/3 h-8 px-2.5 border border-gray-200 rounded-lg font-bold"
                                  placeholder="Industry"
                                />
                                <input
                                  type="text"
                                  value={ind.desc}
                                  onChange={(e) => {
                                    const updated = [...editingCert.industries];
                                    updated[iIdx].desc = e.target.value;
                                    setEditingCert({ ...editingCert, industries: updated });
                                  }}
                                  className="flex-1 h-8 px-2.5 border border-gray-200 rounded-lg"
                                  placeholder="Application Description"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal Bottom Actions */}
              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2 shrink-0">
                <button
                  onClick={() => { setEditingCert(null); setIsAddOpen(false); }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => editingCert && handleSaveCert(editingCert)}
                  className="px-5 py-2 bg-[#072A6C] hover:bg-[#051c4a] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save size={14} /> Save Certification
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default CertificationsCMS;
