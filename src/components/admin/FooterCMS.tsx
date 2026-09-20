import React, { useState } from "react";
import {
  Link2,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Compass,
  GraduationCap,
  FileText,
  Building,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Globe,
  Users,
  Briefcase,
  Play,
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react";
import { useData, FooterContent, FooterLinkItem, DEFAULT_FOOTER_CONTENT } from "../../context/DataContext";

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedinIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const FacebookIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const TwitterIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function FooterCMS() {
  const { footerContent, updateFooterContent, siteSettings, themeColors } = useData();

  const [form, setForm] = useState<FooterContent>(() => {
    return footerContent ? { ...DEFAULT_FOOTER_CONTENT, ...footerContent } : DEFAULT_FOOTER_CONTENT;
  });

  // Keep local form in sync with context when updated externally
  React.useEffect(() => {
    if (footerContent) {
      setForm({ ...DEFAULT_FOOTER_CONTENT, ...footerContent });
    }
  }, [footerContent]);

  const [activePanel, setActivePanel] = useState<
    "brand" | "quickLinks" | "academics" | "admissions" | "campusLife" | "contact" | "legal" | "preview"
  >("quickLinks");

  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const notify = (message: string, type: "success" | "info" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    updateFooterContent(form);
    notify("Footer configuration & link panels saved successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Reset all footer link panels to university default links?")) {
      setForm(DEFAULT_FOOTER_CONTENT);
      updateFooterContent(DEFAULT_FOOTER_CONTENT);
      notify("Footer reset to default university configuration!", "info");
    }
  };

  // Helper for Link Arrays CRUD
  const handleAddLink = (category: "quickLinks" | "academicsLinks" | "admissionsLinks" | "campusLifeLinks" | "bottomLinks") => {
    const newLink: FooterLinkItem = {
      label: "New Link",
      to: "/"
    };
    setForm((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), newLink]
    }));
  };

  const handleUpdateLink = (
    category: "quickLinks" | "academicsLinks" | "admissionsLinks" | "campusLifeLinks" | "bottomLinks",
    index: number,
    field: "label" | "to",
    value: string
  ) => {
    setForm((prev) => {
      const list = [...(prev[category] || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [category]: list };
    });
  };

  const handleDeleteLink = (
    category: "quickLinks" | "academicsLinks" | "admissionsLinks" | "campusLifeLinks" | "bottomLinks",
    index: number
  ) => {
    setForm((prev) => {
      const list = [...(prev[category] || [])];
      list.splice(index, 1);
      return { ...prev, [category]: list };
    });
  };

  const handleMoveLink = (
    category: "quickLinks" | "academicsLinks" | "admissionsLinks" | "campusLifeLinks" | "bottomLinks",
    index: number,
    direction: "up" | "down"
  ) => {
    setForm((prev) => {
      const list = [...(prev[category] || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, [category]: list };
    });
  };

  // Helper for Brand Socials
  const handleUpdateBrandSocial = (index: number, field: "icon" | "label" | "url", value: string) => {
    setForm((prev) => {
      const list = [...(prev.brandSocials || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, brandSocials: list };
    });
  };

  const panels = [
    { id: "brand", label: "Brand Profile & Media", icon: Sparkles, count: form.brandSocials?.length || 4, color: "text-amber-500" },
    { id: "quickLinks", label: "Quick Links Panel", icon: Compass, count: form.quickLinks?.length || 0, color: "text-blue-500" },
    { id: "academics", label: "Academics Links Panel", icon: GraduationCap, count: form.academicsLinks?.length || 0, color: "text-indigo-500" },
    { id: "admissions", label: "Admissions Links Panel", icon: FileText, count: form.admissionsLinks?.length || 0, color: "text-emerald-500" },
    { id: "campusLife", label: "Campus Life Links Panel", icon: Building, count: form.campusLifeLinks?.length || 0, color: "text-rose-500" },
    { id: "contact", label: "Contact Us & Coordinates", icon: PhoneCall, count: 4, color: "text-cyan-500" },
    { id: "legal", label: "Bottom Legal & Policies", icon: ShieldCheck, count: form.bottomLinks?.length || 0, color: "text-purple-500" },
    { id: "preview", label: "Live Visual Preview", icon: Eye, count: 6, color: "text-[#D4AF37]" },
  ] as const;

  const getBrandIconComponent = (name: string) => {
    switch (name?.toLowerCase()) {
      case "globe": return <Globe size={13} />;
      case "users": return <Users size={13} />;
      case "briefcase": return <Briefcase size={13} />;
      case "play": return <Play size={13} />;
      default: return <Globe size={13} />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#072A6C] text-white flex items-center justify-center font-bold shadow-md shadow-blue-900/20">
              <Link2 size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#072A6C] tracking-tight">Footer & Links Navigation CMS</h1>
              <p className="text-xs text-gray-500 font-medium">
                Dedicated independent management panels for every footer column, category, contact coordinate, and policy link
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {notification && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg animate-in fade-in">
              <CheckCircle2 size={14} />
              {notification.message}
            </div>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#062052] rounded-xl shadow-md transition"
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>

      {/* Panel Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
        {panels.map((p) => {
          const Icon = p.icon;
          const isActive = activePanel === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePanel(p.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition font-semibold text-xs gap-1.5 ${
                isActive
                  ? "bg-[#072A6C] text-white shadow-md font-bold"
                  : "bg-white/80 hover:bg-white text-gray-700 border border-transparent hover:border-gray-200"
              }`}
            >
              <Icon size={16} className={isActive ? "text-amber-300" : p.color} />
              <span className="leading-tight text-[11px] line-clamp-2">{p.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {p.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. BRAND PROFILE & MEDIA PANEL                           */}
      {/* ──────────────────────────────────────────────────────── */}
      {activePanel === "brand" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#072A6C] flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" /> Brand Tagline & Media Profile
              </h2>
              <p className="text-xs text-gray-500">Column 1 brand description and social media quick actions</p>
            </div>
            <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold border border-amber-200">
              Column 1
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Brand Description / About Paragraph</label>
              <textarea
                value={form.brandDescription}
                onChange={(e) => setForm({ ...form, brandDescription: e.target.value })}
                rows={3}
                className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#072A6C] outline-none"
                placeholder="Empowering minds through quality education..."
              />
              <p className="text-[11px] text-gray-400 mt-1">Displayed directly underneath the Chalapathi University logo</p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Brand Quick Action Icons (4 Circular Buttons)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(form.brandSocials || []).map((bs, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#072A6C] flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-[#072A6C] text-white flex items-center justify-center">
                          {getBrandIconComponent(bs.icon)}
                        </div>
                        Icon Button #{idx + 1}
                      </span>
                      <select
                        value={bs.icon}
                        onChange={(e) => handleUpdateBrandSocial(idx, "icon", e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg p-1 bg-white font-medium"
                      >
                        <option value="Globe">Globe (Website)</option>
                        <option value="Users">Users (Community)</option>
                        <option value="Briefcase">Briefcase (Careers)</option>
                        <option value="Play">Play (Media Tour)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600">Tooltip Label</label>
                        <input
                          type="text"
                          value={bs.label}
                          onChange={(e) => handleUpdateBrandSocial(idx, "label", e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600">Target Route or URL</label>
                        <input
                          type="text"
                          value={bs.url}
                          onChange={(e) => handleUpdateBrandSocial(idx, "url", e.target.value)}
                          className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. QUICK LINKS PANEL                                     */}
      {/* ──────────────────────────────────────────────────────── */}
      {activePanel === "quickLinks" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#072A6C] flex items-center gap-2">
                <Compass size={18} className="text-blue-500" /> Quick Links Panel
              </h2>
              <p className="text-xs text-gray-500">Column 2 university discovery navigation links</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-200">
                Column 2
              </span>
              <button
                type="button"
                onClick={() => handleAddLink("quickLinks")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#072A6C] text-white text-xs font-bold rounded-xl hover:bg-[#051d4b] transition shadow-xs"
              >
                <Plus size={14} /> Add Quick Link
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Column Header Title</label>
              <input
                type="text"
                value={form.quickLinksTitle || "Quick Links"}
                onChange={(e) => setForm({ ...form, quickLinksTitle: e.target.value })}
                className="w-full max-w-md text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#072A6C] font-bold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-2 uppercase">
                <span className="w-8">#</span>
                <span className="flex-1">Display Label</span>
                <span className="flex-1">Target Route / URL</span>
                <span className="w-24 text-right">Actions</span>
              </div>

              {(form.quickLinks || []).map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-200 transition">
                  <span className="w-8 text-xs font-bold text-gray-400">{idx + 1}</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateLink("quickLinks", idx, "label", e.target.value)}
                      placeholder="e.g. About Us"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.to}
                      onChange={(e) => handleUpdateLink("quickLinks", idx, "to", e.target.value)}
                      placeholder="e.g. /about"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono text-gray-600"
                    />
                  </div>
                  <div className="flex items-center gap-1 w-24 justify-end">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLink("quickLinks", idx, "up")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (form.quickLinks?.length || 1) - 1}
                      onClick={() => handleMoveLink("quickLinks", idx, "down")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink("quickLinks", idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                      title="Delete Link"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. ACADEMICS LINKS PANEL                                 */}
      {/* ──────────────────────────────────────────────────────── */}
      {activePanel === "academics" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#072A6C] flex items-center gap-2">
                <GraduationCap size={18} className="text-indigo-500" /> Academics Links Panel
              </h2>
              <p className="text-xs text-gray-500">Column 3 academic schools, degrees & departments</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold border border-indigo-200">
                Column 3
              </span>
              <button
                type="button"
                onClick={() => handleAddLink("academicsLinks")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#072A6C] text-white text-xs font-bold rounded-xl hover:bg-[#051d4b] transition shadow-xs"
              >
                <Plus size={14} /> Add Academic Link
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Column Header Title</label>
              <input
                type="text"
                value={form.academicsLinksTitle || "Academics"}
                onChange={(e) => setForm({ ...form, academicsLinksTitle: e.target.value })}
                className="w-full max-w-md text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#072A6C] font-bold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-2 uppercase">
                <span className="w-8">#</span>
                <span className="flex-1">Display Label</span>
                <span className="flex-1">Target Route / URL</span>
                <span className="w-24 text-right">Actions</span>
              </div>

              {(form.academicsLinks || []).map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-200 transition">
                  <span className="w-8 text-xs font-bold text-gray-400">{idx + 1}</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateLink("academicsLinks", idx, "label", e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.to}
                      onChange={(e) => handleUpdateLink("academicsLinks", idx, "to", e.target.value)}
                      placeholder="e.g. /academics/computer-science"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono text-gray-600"
                    />
                  </div>
                  <div className="flex items-center gap-1 w-24 justify-end">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLink("academicsLinks", idx, "up")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (form.academicsLinks?.length || 1) - 1}
                      onClick={() => handleMoveLink("academicsLinks", idx, "down")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink("academicsLinks", idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 4. ADMISSIONS LINKS PANEL                                */}
      {/* ──────────────────────────────────────────────────────── */}
      {activePanel === "admissions" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#072A6C] flex items-center gap-2">
                <FileText size={18} className="text-emerald-500" /> Admissions Links Panel
              </h2>
              <p className="text-xs text-gray-500">Column 4 admissions portal, scholarships & fee charts</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200">
                Column 4
              </span>
              <button
                type="button"
                onClick={() => handleAddLink("admissionsLinks")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#072A6C] text-white text-xs font-bold rounded-xl hover:bg-[#051d4b] transition shadow-xs"
              >
                <Plus size={14} /> Add Admissions Link
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Column Header Title</label>
              <input
                type="text"
                value={form.admissionsLinksTitle || "Admissions"}
                onChange={(e) => setForm({ ...form, admissionsLinksTitle: e.target.value })}
                className="w-full max-w-md text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#072A6C] font-bold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-2 uppercase">
                <span className="w-8">#</span>
                <span className="flex-1">Display Label</span>
                <span className="flex-1">Target Route / URL</span>
                <span className="w-24 text-right">Actions</span>
              </div>

              {(form.admissionsLinks || []).map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-200 transition">
                  <span className="w-8 text-xs font-bold text-gray-400">{idx + 1}</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateLink("admissionsLinks", idx, "label", e.target.value)}
                      placeholder="e.g. Apply Online"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.to}
                      onChange={(e) => handleUpdateLink("admissionsLinks", idx, "to", e.target.value)}
                      placeholder="e.g. /admissions/apply"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono text-gray-600"
                    />
                  </div>
                  <div className="flex items-center gap-1 w-24 justify-end">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLink("admissionsLinks", idx, "up")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (form.admissionsLinks?.length || 1) - 1}
                      onClick={() => handleMoveLink("admissionsLinks", idx, "down")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink("admissionsLinks", idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 5. CAMPUS LIFE LINKS PANEL                               */}
      {/* ──────────────────────────────────────────────────────── */}
      {activePanel === "campusLife" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#072A6C] flex items-center gap-2">
                <Building size={18} className="text-rose-500" /> Campus Life Links Panel
              </h2>
              <p className="text-xs text-gray-500">Column 5 student life, facilities, sports & hostel links</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-bold border border-rose-200">
                Column 5
              </span>
              <button
                type="button"
                onClick={() => handleAddLink("campusLifeLinks")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#072A6C] text-white text-xs font-bold rounded-xl hover:bg-[#051d4b] transition shadow-xs"
              >
                <Plus size={14} /> Add Campus Life Link
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Column Header Title</label>
              <input
                type="text"
                value={form.campusLifeLinksTitle || "Campus Life"}
                onChange={(e) => setForm({ ...form, campusLifeLinksTitle: e.target.value })}
                className="w-full max-w-md text-xs p-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#072A6C] font-bold"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-2 uppercase">
                <span className="w-8">#</span>
                <span className="flex-1">Display Label</span>
                <span className="flex-1">Target Route / URL</span>
                <span className="w-24 text-right">Actions</span>
              </div>

              {(form.campusLifeLinks || []).map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-rose-200 transition">
                  <span className="w-8 text-xs font-bold text-gray-400">{idx + 1}</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateLink("campusLifeLinks", idx, "label", e.target.value)}
                      placeholder="e.g. Hostels & Mess"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.to}
                      onChange={(e) => handleUpdateLink("campusLifeLinks", idx, "to", e.target.value)}
                      placeholder="e.g. /campus-life/hostels"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono text-gray-600"
                    />
                  </div>
                  <div className="flex items-center gap-1 w-24 justify-end">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLink("campusLifeLinks", idx, "up")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (form.campusLifeLinks?.length || 1) - 1}
                      onClick={() => handleMoveLink("campusLifeLinks", idx, "down")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink("campusLifeLinks", idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 6. CONTACT US & COORDINATES PANEL                        */}
      {/* ──────────────────────────────────────────────────────── */}
      {activePanel === "contact" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#072A6C] flex items-center gap-2">
                <PhoneCall size={18} className="text-cyan-500" /> Contact Us & Coordinates Panel
              </h2>
              <p className="text-xs text-gray-500">Column 6 physical address, hotlines, emails & social channels</p>
            </div>
            <span className="text-xs bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full font-bold border border-cyan-200">
              Column 6
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Column Title</label>
                <input
                  type="text"
                  value={form.contactTitle || "Contact Us"}
                  onChange={(e) => setForm({ ...form, contactTitle: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-500" /> Physical Campus Address
                </label>
                <textarea
                  rows={2}
                  value={form.contactAddress || "A.R. Nagar, Mothadaka, Guntur, Andhra Pradesh - 522034"}
                  onChange={(e) => setForm({ ...form, contactAddress: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Phone size={13} className="text-amber-500" /> Contact Phones (Pipe Separated)
                </label>
                <input
                  type="text"
                  value={form.contactPhones || "8886630355 | 8886630356 | 9905505566"}
                  onChange={(e) => setForm({ ...form, contactPhones: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl font-mono text-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail size={13} className="text-amber-500" /> Official Admissions Email
                </label>
                <input
                  type="email"
                  value={form.contactEmail || "admissions@city.ac.in"}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-xl font-mono text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h3 className="text-xs font-bold text-[#072A6C] uppercase tracking-wider">Social Media URL Profiles</h3>
              
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1.5">
                  <InstagramIcon className="w-3.5 h-3.5 text-pink-500" /> Instagram URL
                </label>
                <input
                  type="url"
                  value={form.socialLinks?.instagram || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, instagram: e.target.value }
                    })
                  }
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono"
                  placeholder="https://instagram.com/chalapathiuniversity"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1.5">
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-600" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={form.socialLinks?.linkedin || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, linkedin: e.target.value }
                    })
                  }
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono"
                  placeholder="https://linkedin.com/school/chalapathiuniversity"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1.5">
                  <FacebookIcon className="w-3.5 h-3.5 text-blue-500" /> Facebook URL
                </label>
                <input
                  type="url"
                  value={form.socialLinks?.facebook || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, facebook: e.target.value }
                    })
                  }
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono"
                  placeholder="https://facebook.com/chalapathiuniversity"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1.5">
                  <TwitterIcon className="w-3.5 h-3.5 text-black" /> Twitter / X URL
                </label>
                <input
                  type="url"
                  value={form.socialLinks?.twitter || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      socialLinks: { ...form.socialLinks, twitter: e.target.value }
                    })
                  }
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono"
                  placeholder="https://twitter.com/chalapathi_uni"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 7. BOTTOM LEGAL & POLICIES PANEL                         */}
      {/* ──────────────────────────────────────────────────────── */}
      {activePanel === "legal" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-[#072A6C] flex items-center gap-2">
                <ShieldCheck size={18} className="text-purple-500" /> Bottom Legal & Policies Bar
              </h2>
              <p className="text-xs text-gray-500">Copyright text and bottom legal/utility horizontal links</p>
            </div>
            <button
              type="button"
              onClick={() => handleAddLink("bottomLinks")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#072A6C] text-white text-xs font-bold rounded-xl hover:bg-[#051d4b] transition shadow-xs"
            >
              <Plus size={14} /> Add Legal / Utility Link
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Copyright Line Text</label>
              <input
                type="text"
                value={form.copyrightText}
                onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
                className="w-full text-xs p-2.5 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 px-2 uppercase">
                <span className="w-8">#</span>
                <span className="flex-1">Link Title</span>
                <span className="flex-1">Target Route / URL</span>
                <span className="w-24 text-right">Actions</span>
              </div>

              {(form.bottomLinks || []).map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-purple-200 transition">
                  <span className="w-8 text-xs font-bold text-gray-400">{idx + 1}</span>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => handleUpdateLink("bottomLinks", idx, "label", e.target.value)}
                      placeholder="e.g. Privacy Policy"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-medium"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.to}
                      onChange={(e) => handleUpdateLink("bottomLinks", idx, "to", e.target.value)}
                      placeholder="e.g. /privacy-policy"
                      className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white font-mono text-gray-600"
                    />
                  </div>
                  <div className="flex items-center gap-1 w-24 justify-end">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveLink("bottomLinks", idx, "up")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (form.bottomLinks?.length || 1) - 1}
                      onClick={() => handleMoveLink("bottomLinks", idx, "down")}
                      className="p-1.5 text-gray-500 hover:text-[#072A6C] disabled:opacity-30 rounded hover:bg-gray-200"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink("bottomLinks", idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 8. LIVE VISUAL PREVIEW                                   */}
      {/* ──────────────────────────────────────────────────────── */}
      {(activePanel === "preview" || true) && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={14} /> Real-Time Live Footer Preview
              </h3>
              <p className="text-[11px] text-slate-400">Live reflection of all 6 columns and bottom legal bar</p>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-bold border border-slate-700">
              6-Column Grid Layout
            </span>
          </div>

          <div 
            className="p-8 rounded-2xl border border-white/10"
            style={{
              backgroundColor: themeColors?.footerBg || "#072A6C",
              color: themeColors?.footerText || "#D1D5DB"
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 text-[11px]">
              {/* Col 1: Brand */}
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-2 w-fit">
                  <img src={siteSettings?.logoUrl || "/logo.png"} alt="Logo" className="h-7 w-auto object-contain" />
                </div>
                <p className="text-[10px] leading-relaxed opacity-80">{form.brandDescription}</p>
                <div className="flex items-center gap-1.5 pt-1">
                  {(form.brandSocials || []).map((bs, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white" title={bs.label}>
                      {getBrandIconComponent(bs.icon)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Col 2: Quick Links */}
              <div>
                <h4 className="text-white font-bold text-[12px] mb-3">{form.quickLinksTitle || "Quick Links"}</h4>
                <ul className="space-y-2 font-light opacity-90 text-[11px]">
                  {(form.quickLinks || []).map((l, i) => (
                    <li key={i} className="truncate hover:underline cursor-pointer">{l.label}</li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Academics */}
              <div>
                <h4 className="text-white font-bold text-[12px] mb-3">{form.academicsLinksTitle || "Academics"}</h4>
                <ul className="space-y-2 font-light opacity-90 text-[11px]">
                  {(form.academicsLinks || []).map((l, i) => (
                    <li key={i} className="truncate hover:underline cursor-pointer">{l.label}</li>
                  ))}
                </ul>
              </div>

              {/* Col 4: Admissions */}
              <div>
                <h4 className="text-white font-bold text-[12px] mb-3">{form.admissionsLinksTitle || "Admissions"}</h4>
                <ul className="space-y-2 font-light opacity-90 text-[11px]">
                  {(form.admissionsLinks || []).map((l, i) => (
                    <li key={i} className="truncate hover:underline cursor-pointer">{l.label}</li>
                  ))}
                </ul>
              </div>

              {/* Col 5: Campus Life */}
              <div>
                <h4 className="text-white font-bold text-[12px] mb-3">{form.campusLifeLinksTitle || "Campus Life"}</h4>
                <ul className="space-y-2 font-light opacity-90 text-[11px]">
                  {(form.campusLifeLinks || []).map((l, i) => (
                    <li key={i} className="truncate hover:underline cursor-pointer">{l.label}</li>
                  ))}
                </ul>
              </div>

              {/* Col 6: Contact */}
              <div className="space-y-2">
                <h4 className="text-white font-bold text-[12px] mb-3">{form.contactTitle || "Contact Us"}</h4>
                <p className="text-[10px] leading-tight opacity-80 flex items-start gap-1">
                  <MapPin size={11} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>{form.contactAddress}</span>
                </p>
                <p className="text-[10px] opacity-80 flex items-start gap-1">
                  <Phone size={11} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="font-mono">{form.contactPhones}</span>
                </p>
                <p className="text-[10px] opacity-80 flex items-start gap-1">
                  <Mail size={11} className="text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="font-mono">{form.contactEmail}</span>
                </p>
              </div>
            </div>

            {/* Bottom Bar Preview */}
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-[10px] opacity-80 gap-2">
              <span>{form.copyrightText}</span>
              <div className="flex items-center gap-2 flex-wrap">
                {(form.bottomLinks || []).map((item, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span>|</span>}
                    <span className={item.to === "/admin" ? "text-amber-400 font-bold" : ""}>{item.label}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
