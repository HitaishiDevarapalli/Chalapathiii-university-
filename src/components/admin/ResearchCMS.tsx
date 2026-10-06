import React, { useState } from "react";
import { 
  Award, Sparkles, Plus, Trash2, Edit3, Eye, EyeOff, Save, RotateCcw, 
  Wrench, ExternalLink, X, Check, FileText, AlertCircle, Phone, Mail,
  Microscope, Layers, Tag
} from "lucide-react";
import { SectionHeader, PageVisibilityBanner } from "./AdminComponents";
import { useData } from "../../context/DataContext";

export interface ResearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
  badge?: string;
  link?: string;
  linkText?: string;
  hidden?: boolean;
}

// Backwards-compatibility aliases
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
  pageTitle: string;
  pageSubtitle: string;
  isUnderConstruction: boolean;
  underConstructionMessage: string;
  contactEmail: string;
  contactPhone: string;
  hidden?: boolean;
  items: ResearchItem[];
}

export const DEFAULT_RESEARCH_DATA: ResearchCMSData = {
  pageTitle: "Research & Innovation",
  pageSubtitle: "Fostering academic inquiry, scientific research, and technological development.",
  isUnderConstruction: true,
  underConstructionMessage: "This page is currently under construction.",
  contactEmail: "research@chalapathi.ac.in",
  contactPhone: "+91 95055 05566",
  hidden: false,
  items: [] // Blank by default, as requested
};

export interface ResearchCMSProps {
  notifySave: (msg: string) => void;
}

const CATEGORY_OPTIONS = [
  "General",
  "Thrust Area",
  "Sponsored Project",
  "Publication & Paper",
  "Patent & IP",
  "Laboratory & Facility",
  "Doctoral Program (Ph.D.)",
  "Research Fellowship"
];

export const ResearchCMS: React.FC<ResearchCMSProps> = ({ notifySave }) => {
  const [researchData, setResearchData] = useState<ResearchCMSData>(() => {
    try {
      const saved = localStorage.getItem("chalapathi_research_cms_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_RESEARCH_DATA,
          ...parsed,
          // ensure items exists and defaults to array
          items: Array.isArray(parsed.items) ? parsed.items : []
        };
      }
    } catch (e) {
      console.error("Error reading research CMS data:", e);
    }
    return DEFAULT_RESEARCH_DATA;
  });

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ResearchItem | null>(null);
  const [itemForm, setItemForm] = useState<Partial<ResearchItem>>({
    title: "",
    category: "General",
    description: "",
    badge: "",
    link: "",
    linkText: "Learn More",
    hidden: false
  });

  // Category filter for the items table/list
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const saveResearch = (overrideData?: ResearchCMSData) => {
    const dataToSave = overrideData || researchData;
    localStorage.setItem("chalapathi_research_cms_data", JSON.stringify(dataToSave));
    window.dispatchEvent(new Event("chalapathi_cms_updated"));
    notifySave("Research & Innovation CMS updated and saved!");
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setItemForm({
      title: "",
      category: "General",
      description: "",
      badge: "",
      link: "",
      linkText: "Learn More",
      hidden: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ResearchItem) => {
    setEditingItem(item);
    setItemForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveItemModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemForm.title?.trim()) {
      alert("Please provide a title for this research item.");
      return;
    }

    let updatedItems: ResearchItem[];
    if (editingItem) {
      // Edit existing
      updatedItems = researchData.items.map((it) => 
        it.id === editingItem.id ? ({ ...it, ...itemForm } as ResearchItem) : it
      );
    } else {
      // Add new
      const newItem: ResearchItem = {
        id: `res-${Date.now()}`,
        title: itemForm.title.trim(),
        category: itemForm.category || "General",
        description: itemForm.description || "",
        badge: itemForm.badge || "",
        link: itemForm.link || "",
        linkText: itemForm.linkText || "Learn More",
        hidden: itemForm.hidden || false
      };
      updatedItems = [...researchData.items, newItem];
    }

    const updatedData = { ...researchData, items: updatedItems };
    setResearchData(updatedData);
    saveResearch(updatedData);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const updatedItems = researchData.items.filter((it) => it.id !== id);
    const updatedData = { ...researchData, items: updatedItems };
    setResearchData(updatedData);
    saveResearch(updatedData);
  };

  const handleToggleHideItem = (id: string) => {
    const updatedItems = researchData.items.map((it) => {
      if (it.id === id) {
        const nextState = !it.hidden;
        notifySave(`"${it.title}" is now ${nextState ? "Hidden" : "Visible"}!`);
        return { ...it, hidden: nextState };
      }
      return it;
    });
    const updatedData = { ...researchData, items: updatedItems };
    setResearchData(updatedData);
    saveResearch(updatedData);
  };

  const filteredItems = researchData.items.filter((it) => {
    if (selectedCategory === "All") return true;
    return it.category === selectedCategory;
  });

  const { siteSettings, updateSiteSettings } = useData();
  const isResearchHidden = !!(researchData.hidden || siteSettings?.hiddenPages?.["/research"] || siteSettings?.hiddenPages?.["Research"]);

  const toggleResearchVisibility = () => {
    const nextHidden = !isResearchHidden;
    const updated = { ...researchData, hidden: nextHidden };
    setResearchData(updated);
    saveResearch(updated);

    const currentHiddenPages = { ...(siteSettings?.hiddenPages || {}) };
    if (nextHidden) {
      currentHiddenPages["/research"] = true;
      currentHiddenPages["Research"] = true;
      currentHiddenPages["research"] = true;
    } else {
      delete currentHiddenPages["/research"];
      delete currentHiddenPages["Research"];
      delete currentHiddenPages["research"];
    }
    updateSiteSettings({
      ...(siteSettings || {}),
      universityName: siteSettings?.universityName || "Chalapathi University",
      hiddenPages: currentHiddenPages
    });

    notifySave(`Research page is now ${nextHidden ? "HIDDEN from public website" : "LIVE & VISIBLE on public website"}!`);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* 🌟 STANDARDIZED PAGE VISIBILITY HIDE / SHOW BANNER */}
      <PageVisibilityBanner
        pageName="Research & Innovation"
        routePath="/research"
        isHidden={isResearchHidden}
        onToggle={toggleResearchVisibility}
      />

      {/* Top Header Card with Clean Wrapping Buttons */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-black text-[#072A6C] uppercase flex items-center gap-2">
              <Award size={18} className="text-[#D4AF37]" />
              Research & Innovation CMS
            </h3>
            <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <Wrench size={11} /> Under Construction
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Public Research page is currently set to Under Construction. You can customize the notice and manage research items below with Add, Edit, Delete, and Hide.
          </p>
        </div>

        {/* Global Action Buttons - Perfectly Wrap on all screens */}
        <div className="flex flex-wrap items-center gap-2 pt-2 xl:pt-0">
          {/* Under Construction Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextVal = !researchData.isUnderConstruction;
              const updated = { ...researchData, isUnderConstruction: nextVal };
              setResearchData(updated);
              saveResearch(updated);
              notifySave(`Under Construction mode is now ${nextVal ? "Enabled" : "Disabled"}!`);
            }}
            className={`h-9 px-3 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border shadow-xs ${
              researchData.isUnderConstruction
                ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300"
                : "bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200"
            }`}
            title="Toggle Under Construction mode"
          >
            <Wrench size={13} className={researchData.isUnderConstruction ? "text-amber-600" : "text-blue-600"} />
            <span>Mode: {researchData.isUnderConstruction ? "Under Construction" : "Live Content"}</span>
          </button>

          {/* Add Item Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="h-9 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus size={14} /> Add Research Item
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset Research CMS to default Under Construction state?")) {
                setResearchData(DEFAULT_RESEARCH_DATA);
                saveResearch(DEFAULT_RESEARCH_DATA);
                notifySave("Research CMS reset to blank Under Construction default!");
              }
            }}
            className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            title="Reset to blank under construction state"
          >
            <RotateCcw size={13} /> Reset
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={() => saveResearch()}
            className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Save size={13} /> Save CMS
          </button>
        </div>
      </div>

      {/* Under Construction Notice Settings */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h4 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
            <Wrench size={16} className="text-amber-500" />
            Under Construction Page Banner Settings
          </h4>
          <span className="text-xs text-gray-400 font-semibold">Displayed to public visitors on /research</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 uppercase">Page Header Title</label>
            <input
              type="text"
              value={researchData.pageTitle}
              onChange={(e) => setResearchData({ ...researchData, pageTitle: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800"
              placeholder="e.g. Research & Innovation"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 uppercase">Page Subtitle / Tagline</label>
            <input
              type="text"
              value={researchData.pageSubtitle}
              onChange={(e) => setResearchData({ ...researchData, pageSubtitle: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700"
              placeholder="e.g. Fostering academic inquiry and global breakthroughs."
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-[10px] font-bold text-gray-600 uppercase">Under Construction Description</label>
            <textarea
              rows={2}
              value={researchData.underConstructionMessage}
              onChange={(e) => setResearchData({ ...researchData, underConstructionMessage: e.target.value })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700"
              placeholder="Enter message for public visitors..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1">
              <Mail size={11} /> Contact Email
            </label>
            <input
              type="email"
              value={researchData.contactEmail}
              onChange={(e) => setResearchData({ ...researchData, contactEmail: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1">
              <Phone size={11} /> Contact Phone / Helpdesk
            </label>
            <input
              type="text"
              value={researchData.contactPhone}
              onChange={(e) => setResearchData({ ...researchData, contactPhone: e.target.value })}
              className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Research Categories & Items List */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h4 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
              <Layers size={16} className="text-[#072A6C]" />
              Research Categories & Items ({researchData.items.length})
            </h4>
            <p className="text-xs text-gray-500">
              Manage custom research cards, projects, or categories. Each item has direct Edit, Delete, and Hide options.
            </p>
          </div>

          {/* Category Filter Pills & Add Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-400 font-bold text-[11px]">Filter:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-gray-700"
              >
                <option value="All">All Categories ({researchData.items.length})</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} ({researchData.items.filter((it) => it.category === cat).length})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="h-8 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus size={13} /> Add Item
            </button>
          </div>
        </div>

        {/* Blank state when no items exist */}
        {researchData.items.length === 0 ? (
          <div className="py-12 px-4 rounded-xl border border-dashed border-gray-200 bg-slate-50 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench size={24} />
            </div>
            <div>
              <h5 className="text-sm font-black text-gray-800 uppercase tracking-wide">
                Page is Currently Blank & Under Construction
              </h5>
              <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
                The public research page displays the Under Construction banner. No research items or categories have been published yet.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Plus size={14} /> Add First Research Item
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-400 italic">
            No research items in category "{selectedCategory}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all text-left space-y-2.5 ${
                  item.hidden
                    ? "bg-amber-50/20 border-amber-300 opacity-75"
                    : "bg-slate-50/60 border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Header row with Title & Category */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#072A6C]/10 text-[#072A6C]">
                        {item.category}
                      </span>
                      {item.hidden ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                          Hidden
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Visible
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-black text-gray-900 truncate">
                      {item.title}
                    </h5>
                  </div>

                  {/* Item Actions: Hide / Edit / Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Hide / Show Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleHideItem(item.id)}
                      className={`h-7 px-2 text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors border ${
                        item.hidden
                          ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
                          : "bg-white hover:bg-slate-100 text-slate-700 border-gray-200"
                      }`}
                      title={item.hidden ? "Show on public research page" : "Hide from public research page"}
                    >
                      {item.hidden ? (
                        <>
                          <Eye size={12} className="text-amber-700" />
                          <span>Show</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} className="text-gray-500" />
                          <span>Hide</span>
                        </>
                      )}
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="h-7 px-2 bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 border border-gray-200 hover:border-blue-300 text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit this item"
                    >
                      <Edit3 size={12} />
                      <span>Edit</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, item.title)}
                      className="h-7 px-2 bg-white hover:bg-red-50 text-red-600 hover:text-red-800 border border-gray-200 hover:border-red-300 text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                      title="Delete this item"
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* Optional Link */}
                {item.link && (
                  <div className="pt-1 flex items-center gap-1 text-[10px] font-bold text-[#072A6C]">
                    <ExternalLink size={11} />
                    <span className="truncate">{item.linkText || item.link}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-slate-50">
              <h4 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                {editingItem ? <Edit3 size={15} /> : <Plus size={15} />}
                {editingItem ? "Edit Research Item" : "Add New Research Item"}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveItemModal} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Item Title *</label>
                <input
                  type="text"
                  required
                  value={itemForm.title || ""}
                  onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                  placeholder="e.g. Artificial Intelligence Center of Excellence"
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Category *</label>
                  <select
                    value={itemForm.category || "General"}
                    onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Visibility</label>
                  <select
                    value={itemForm.hidden ? "hidden" : "visible"}
                    onChange={(e) => setItemForm({ ...itemForm, hidden: e.target.value === "hidden" })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
                  >
                    <option value="visible">Visible (Active)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Description / Details</label>
                <textarea
                  rows={3}
                  value={itemForm.description || ""}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Summary of research focus, project scope, or patent info..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Target Link URL (Optional)</label>
                  <input
                    type="text"
                    value={itemForm.link || ""}
                    onChange={(e) => setItemForm({ ...itemForm, link: e.target.value })}
                    placeholder="e.g. /admissions or https://doi.org/..."
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Link Button Label</label>
                  <input
                    type="text"
                    value={itemForm.linkText || ""}
                    onChange={(e) => setItemForm({ ...itemForm, linkText: e.target.value })}
                    placeholder="e.g. Explore / View Paper"
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Check size={14} />
                  <span>{editingItem ? "Update Item" : "Create Item"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
