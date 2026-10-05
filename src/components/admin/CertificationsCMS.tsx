import React, { useState } from "react";
import { 
  Plus, Trash2, Edit3, Copy, Eye, Award, CheckCircle2, 
  Search, ExternalLink, Image as ImageIcon, Zap, Sparkles, Layers,
  Save, RotateCcw, X, Globe, Briefcase, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Certification } from "../../data/certifications";
import { useData } from "../../context/DataContext";
import { ImageField } from "./AdminComponents";

interface CertificationsCMSProps {
  notifySave?: (msg?: string) => void;
}

export const CertificationsCMS: React.FC<CertificationsCMSProps> = ({ notifySave }) => {
  const { 
    certificationsData, 
    updateCertificationsData 
  } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (notifySave) notifySave(msg);
    setTimeout(() => setToastMessage(null), 3000);
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

  const handleCreateNew = () => {
    const newCert: Certification = {
      id: `cert_${Date.now()}`,
      name: "New Global Certification",
      description: "Industry-standard certification preparing students for real-world technologies.",
      images: ["https://www.vectorlogo.zone/logos/oracle/oracle-ar21.svg"],
      color: "#072A6C",
      domain: "Cloud & Software",
      tagline: "Empowering Next-Gen Engineers",
      layoutMode: "dashboard",
      duration: "3-6 Months",
      difficulty: "Advanced",
      timeline: [
        { milestone: "Foundation", desc: "Core fundamentals & setup" },
        { milestone: "Hands-on Labs", desc: "Live project implementation" },
        { milestone: "Certification", desc: "Official exam qualification" }
      ],
      features: [
        { icon: "Briefcase", title: "Boost Employability", desc: "Recognized by top recruiters globally" },
        { icon: "Zap", title: "Practical Exposure", desc: "Live industrial laboratory access" }
      ],
      skills: ["Cloud Architecture", "Security", "DevOps"],
      industries: [
        { name: "Information Technology", desc: "Software & Cloud Systems" },
        { name: "Banking & Finance", desc: "Enterprise Data Security" }
      ],
      roadmap: [
        { role: "Learner", exp: "0 Yrs" },
        { role: "Certified Associate", exp: "1-2 Yrs" },
        { role: "Lead Engineer", exp: "3+ Yrs" }
      ],
      companies: ["Amazon", "Microsoft", "Google", "TCS", "Infosys"],
      projects: [
        { name: "Production Pipeline Setup", duration: "3 Weeks", difficulty: "Medium" }
      ],
      stats: {
        countries: 120,
        jobs: "250K+",
        demand: "Growing 20% YoY"
      }
    };
    setEditingCert(newCert);
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-6 font-[var(--font-poppins)] text-left select-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[99999] bg-[#072A6C] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-white/20 text-xs font-bold"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-[#072A6C]">
              <Award size={20} />
            </span>
            <div>
              <h2 className="text-xl font-black text-[#072A6C] tracking-tight uppercase">
                Global Certifications CMS
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                Manage all industry-accredited certifications (SAP, AWS, GCP, Salesforce, Juniper, Microchip, etc.).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="px-5 py-2.5 bg-[#072A6C] hover:bg-[#051c4a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            + Add Certification
          </button>
        </div>
      </div>

      {/* Search Bar & Stats */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search certifications (e.g. AWS, SAP, ServiceNow)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="text-xs font-bold text-gray-500">
          Total Available Courses: <span className="text-[#072A6C] font-black">{certificationsData.length}</span>
        </div>
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCerts.map((cert) => (
          <div 
            key={cert.id}
            className="bg-white rounded-2xl p-5 border border-gray-150 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
                  style={{ backgroundColor: cert.color || "#072A6C" }}
                >
                  {cert.domain}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleDuplicateCert(cert)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Duplicate"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Logo Previews */}
              <div className="h-12 bg-slate-50 rounded-xl border border-gray-100 p-2 flex items-center justify-center gap-2">
                {(cert.images || []).map((img, i) => (
                  <img key={i} src={img} alt={cert.name} className="h-8 max-w-[80px] object-contain" />
                ))}
              </div>

              <div>
                <h3 className="font-extrabold text-[#072A6C] text-base group-hover:text-blue-600 transition-colors">
                  {cert.name}
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                  {cert.tagline}
                </p>
                <p className="text-xs text-gray-600 font-normal leading-relaxed mt-2 line-clamp-3">
                  {cert.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                {(cert.skills || []).slice(0, 3).map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-gray-600">
                    {s}
                  </span>
                ))}
                {(cert.skills || []).length > 3 && (
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-gray-400">
                    +{cert.skills.length - 3}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-gray-100">
              <button
                onClick={() => setEditingCert(cert)}
                className="w-full py-2 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 size={13} />
                <span>Edit Certification</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT / CREATE MODAL */}
      {editingCert && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setEditingCert(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-150 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#072A6C] uppercase tracking-tight">
                  {isAddOpen ? "Add Global Certification" : `Edit Certification: ${editingCert.name}`}
                </h3>
                <p className="text-xs text-gray-500">Edit curriculum parameters, logos, career milestones, and skills.</p>
              </div>
              <button onClick={() => setEditingCert(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveCert(editingCert); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase">Course / Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.name}
                    onChange={(e) => setEditingCert({ ...editingCert, name: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-bold border border-gray-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase">Domain / Track *</label>
                  <input
                    type="text"
                    required
                    value={editingCert.domain}
                    onChange={(e) => setEditingCert({ ...editingCert, domain: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-bold border border-gray-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase">Theme Accent Color</label>
                  <input
                    type="text"
                    value={editingCert.color}
                    onChange={(e) => setEditingCert({ ...editingCert, color: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-mono font-bold border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Tagline / Mission</label>
                <input
                  type="text"
                  value={editingCert.tagline}
                  onChange={(e) => setEditingCert({ ...editingCert, tagline: e.target.value })}
                  className="w-full h-10 px-3 text-xs border border-gray-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={editingCert.description}
                  onChange={(e) => setEditingCert({ ...editingCert, description: e.target.value })}
                  className="w-full p-3 text-xs border border-gray-200 rounded-xl"
                />
              </div>

              {/* Logo URLs */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Official Logo Image URLs</label>
                {(editingCert.images || []).map((imgUrl, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={imgUrl}
                      onChange={(e) => {
                        const updatedImgs = [...editingCert.images];
                        updatedImgs[idx] = e.target.value;
                        setEditingCert({ ...editingCert, images: updatedImgs });
                      }}
                      className="flex-1 h-9 px-3 text-xs border border-gray-200 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedImgs = editingCert.images.filter((_, i) => i !== idx);
                        setEditingCert({ ...editingCert, images: updatedImgs });
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setEditingCert({ ...editingCert, images: [...editingCert.images, ""] })}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg"
                >
                  + Add Logo URL
                </button>
              </div>

              {/* Skills Editor */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Key Technical Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={(editingCert.skills || []).join(", ")}
                  onChange={(e) => setEditingCert({
                    ...editingCert,
                    skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full h-10 px-3 text-xs border border-gray-200 rounded-xl"
                />
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-gray-200">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase">Countries Recognized</label>
                  <input
                    type="number"
                    value={editingCert.stats?.countries || 100}
                    onChange={(e) => setEditingCert({
                      ...editingCert,
                      stats: { ...editingCert.stats, countries: Number(e.target.value) }
                    })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase">Global Job Openings</label>
                  <input
                    type="text"
                    value={editingCert.stats?.jobs || "500K+"}
                    onChange={(e) => setEditingCert({
                      ...editingCert,
                      stats: { ...editingCert.stats, jobs: e.target.value }
                    })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase">Industry Demand</label>
                  <input
                    type="text"
                    value={editingCert.stats?.demand || "Growing 25% YoY"}
                    onChange={(e) => setEditingCert({
                      ...editingCert,
                      stats: { ...editingCert.stats, demand: e.target.value }
                    })}
                    className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setEditingCert(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-extrabold uppercase rounded-xl shadow cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
