import React, { useState, useEffect } from "react";
import { 
  MessageSquare, Plus, Trash2, Edit3, Eye, EyeOff, Save, RotateCcw, 
  ExternalLink, X, Check, Image as ImageIcon, Calendar, Sparkles, 
  ArrowRight, Link2, CheckCircle2, AlertCircle, Clock, Megaphone
} from "lucide-react";
import { ImageField } from "./AdminComponents";

export type PopupType = "enquiry" | "event" | "banner" | "custom";

export interface PopupItem {
  id: string;
  name: string;
  type: PopupType;
  enabled: boolean;
  autoOpen: boolean;
  autoOpenDelay: number; // in seconds
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  image?: string;
  buttonText?: string;
  redirectUrl?: string;
  createdAt?: string;
}

export interface PopupCMSData {
  masterEnabled: boolean;
  activePopupId: string;
  popups: PopupItem[];
}

export const DEFAULT_POPUP_DATA: PopupCMSData = {
  masterEnabled: true,
  activePopupId: "popup-enquiry-default",
  popups: [
    {
      id: "popup-enquiry-default",
      name: "Admissions 2026-27 Lead Form & Schools Explorer",
      type: "enquiry",
      enabled: true,
      autoOpen: true,
      autoOpenDelay: 1,
      title: "ADMISSIONS OPEN 2026-27",
      subtitle: "Build Your Future. Lead with Innovation.",
      description: "Interactive dual-panel popup featuring the Schools & Programs explorer on the left and the direct Student Enquiry lead form on the right.",
      badge: "ADMISSIONS 2026",
      buttonText: "APPLY ENQUIRY",
      redirectUrl: "/admissions"
    },
    {
      id: "popup-event-default",
      name: "Upcoming Campus Events & Tech Fest",
      type: "event",
      enabled: true,
      autoOpen: true,
      autoOpenDelay: 1,
      title: "Annual Tech Fest & Innovation Summit 2026",
      subtitle: "Join India's Brightest Minds at Chalapathi Campus",
      description: "Explore 40+ national events, hackathons, guest lectures, and cultural fests. Registrations closing soon for inter-university competitions.",
      badge: "CAMPUS EVENT",
      image: "/prog_computer.png",
      buttonText: "View Events & Register Now",
      redirectUrl: "/news/events"
    },
    {
      id: "popup-banner-promo",
      name: "Admissions Open Promotional Banner",
      type: "banner",
      enabled: false,
      autoOpen: true,
      autoOpenDelay: 1,
      title: "Admissions Open for Academic Year 2026–27",
      subtitle: "B.Tech • M.Tech • MBA • MCA • Pharmacy",
      description: "Highest placement record, world-class labs, and merit scholarships. Apply online today for priority counseling.",
      badge: "OFFICIAL ANNOUNCEMENT",
      image: "/students_admission.png",
      buttonText: "Apply Online Now",
      redirectUrl: "/admissions/apply"
    }
  ]
};

export interface PopupCMSProps {
  notifySave: (msg: string) => void;
}

export const PopupCMS: React.FC<PopupCMSProps> = ({ notifySave }) => {
  const [data, setData] = useState<PopupCMSData>(() => {
    try {
      const saved = localStorage.getItem("chalapathi_popup_cms_data");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_POPUP_DATA,
          ...parsed,
          popups: Array.isArray(parsed.popups) ? parsed.popups : DEFAULT_POPUP_DATA.popups
        };
      }
    } catch (e) {
      console.error("Error reading popup CMS data:", e);
    }
    return DEFAULT_POPUP_DATA;
  });

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopupItem | null>(null);
  const [popupForm, setPopupForm] = useState<Partial<PopupItem>>({
    name: "",
    type: "event",
    enabled: true,
    autoOpen: true,
    autoOpenDelay: 1,
    title: "",
    subtitle: "",
    description: "",
    badge: "ANNOUNCEMENT",
    image: "/prog_computer.png",
    buttonText: "Explore More",
    redirectUrl: "/news/events"
  });

  const savePopupData = (updatedData?: PopupCMSData) => {
    const toSave = updatedData || data;
    localStorage.setItem("chalapathi_popup_cms_data", JSON.stringify(toSave));
    window.dispatchEvent(new Event("chalapathi_cms_updated"));
    notifySave("Popup Modal configuration saved!");
  };

  const handleOpenAddModal = () => {
    setEditingPopup(null);
    setPopupForm({
      name: "",
      type: "event",
      enabled: true,
      autoOpen: true,
      autoOpenDelay: 1,
      title: "",
      subtitle: "",
      description: "",
      badge: "ANNOUNCEMENT",
      image: "/prog_computer.png",
      buttonText: "Explore More",
      redirectUrl: "/news/events"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: PopupItem) => {
    setEditingPopup(item);
    setPopupForm({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!popupForm.name?.trim()) {
      alert("Please provide an administrative name for this popup.");
      return;
    }

    let updatedPopups: PopupItem[];
    if (editingPopup) {
      updatedPopups = data.popups.map((p) => 
        p.id === editingPopup.id ? ({ ...p, ...popupForm } as PopupItem) : p
      );
    } else {
      const newPopup: PopupItem = {
        id: `popup-${Date.now()}`,
        name: popupForm.name.trim(),
        type: popupForm.type || "event",
        enabled: popupForm.enabled ?? true,
        autoOpen: popupForm.autoOpen ?? true,
        autoOpenDelay: Number(popupForm.autoOpenDelay) || 1,
        title: popupForm.title?.trim() || "Chalapathi University Notice",
        subtitle: popupForm.subtitle?.trim() || "",
        description: popupForm.description?.trim() || "",
        badge: popupForm.badge?.trim() || "FEATURED",
        image: popupForm.image || "/prog_computer.png",
        buttonText: popupForm.buttonText?.trim() || "Learn More",
        redirectUrl: popupForm.redirectUrl?.trim() || "/news/events",
        createdAt: new Date().toISOString()
      };
      updatedPopups = [...data.popups, newPopup];
    }

    const updatedData = { ...data, popups: updatedPopups };
    setData(updatedData);
    savePopupData(updatedData);
    setIsModalOpen(false);
    setEditingPopup(null);
  };

  const handleDeletePopup = (id: string, name: string) => {
    if (data.popups.length <= 1) {
      alert("You must keep at least one popup template in your list.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete popup "${name}"?`)) return;
    const updatedPopups = data.popups.filter((p) => p.id !== id);
    let newActiveId = data.activePopupId;
    if (data.activePopupId === id) {
      newActiveId = updatedPopups[0]?.id || "";
    }
    const updatedData = { ...data, activePopupId: newActiveId, popups: updatedPopups };
    setData(updatedData);
    savePopupData(updatedData);
  };

  const handleToggleHidePopup = (id: string) => {
    const updatedPopups = data.popups.map((p) => {
      if (p.id === id) {
        const nextState = !p.enabled;
        notifySave(`Popup "${p.name}" is now ${nextState ? "Visible" : "Hidden"}!`);
        return { ...p, enabled: nextState };
      }
      return p;
    });
    const updatedData = { ...data, popups: updatedPopups };
    setData(updatedData);
    savePopupData(updatedData);
  };

  const handleSetActivePopup = (id: string) => {
    const updatedData = { ...data, activePopupId: id };
    setData(updatedData);
    savePopupData(updatedData);
    const item = data.popups.find((p) => p.id === id);
    notifySave(`Active website popup set to: "${item?.name}"!`);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-black text-[#072A6C] uppercase flex items-center gap-2">
              <MessageSquare size={18} className="text-[#D4AF37]" />
              Website Popup Modal Manager
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-blue-100 text-blue-900 border border-blue-200">
              Customizable
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Control the visitor popup on the website. Switch between the Admissions Enquiry form, Event posters, or Promotional image banners that redirect to any page.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Master Enable / Disable Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextMaster = !data.masterEnabled;
              const updated = { ...data, masterEnabled: nextMaster };
              setData(updated);
              savePopupData(updated);
              notifySave(`All website popups are now ${nextMaster ? "Enabled (Visible)" : "Disabled (Hidden)"}!`);
            }}
            className={`h-9 px-3 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors border shadow-xs ${
              data.masterEnabled
                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
                : "bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
            }`}
            title="Master toggle for all popups across the website"
          >
            {data.masterEnabled ? (
              <>
                <Eye size={13} className="text-emerald-600" />
                <span>Popups: Enabled (Visible)</span>
              </>
            ) : (
              <>
                <EyeOff size={13} className="text-red-600" />
                <span>Popups: Disabled (Hidden)</span>
              </>
            )}
          </button>

          {/* Add Popup Button */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="h-9 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus size={14} /> Add New Popup
          </button>

          {/* Reset Defaults Button */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Reset all popups to initial default templates?")) {
                setData(DEFAULT_POPUP_DATA);
                savePopupData(DEFAULT_POPUP_DATA);
                notifySave("Popups reset to defaults!");
              }
            }}
            className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            title="Reset to default popups"
          >
            <RotateCcw size={13} /> Reset
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={() => savePopupData()}
            className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Save size={13} /> Save Popups
          </button>
        </div>
      </div>

      {/* Currently Active Popup Indicator Box */}
      {(() => {
        const active = data.popups.find((p) => p.id === data.activePopupId);
        return (
          <div className="bg-gradient-to-r from-[#072A6C] to-[#0A3D9C] p-5 rounded-2xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-900">
                  Active Live Popup
                </span>
                <span className="text-xs text-blue-200 font-semibold">
                  Type: {active?.type === "enquiry" ? "Admissions Form & Schools" : active?.type === "event" ? "Event / Poster with Redirect" : "Banner Poster"}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-black truncate">
                {active?.name || "No active popup selected"}
              </h4>
              <p className="text-xs text-blue-100 line-clamp-1">
                {active?.type === "enquiry"
                  ? "Displays the dual-panel interactive Admissions Enquiry Form & Schools Explorer."
                  : `Redirects visitors to: "${active?.redirectUrl || '/news/events'}" when clicked.`}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 ${
                data.masterEnabled && active?.enabled
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                  : "bg-red-500/20 text-red-300 border-red-400/30"
              }`}>
                {data.masterEnabled && active?.enabled ? <CheckCircle2 size={13} /> : <EyeOff size={13} />}
                {data.masterEnabled && active?.enabled ? "Currently Visible on Website" : "Hidden from Website"}
              </span>
            </div>
          </div>
        );
      })()}

      {/* Popup Templates Grid */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
          <div>
            <h4 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
              <Sparkles size={16} className="text-[#D4AF37]" />
              Configured Popup Templates ({data.popups.length})
            </h4>
            <p className="text-xs text-gray-500">
              Select which popup is live, edit copy, replace banner images, change redirect URLs, or add brand new popups.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="h-8 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors self-start sm:self-auto"
          >
            <Plus size={13} /> Add Popup
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {data.popups.map((popup) => {
            const isActive = popup.id === data.activePopupId;
            return (
              <div
                key={popup.id}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between space-y-3 relative ${
                  isActive
                    ? "border-[#072A6C] bg-blue-50/30 shadow-md ring-2 ring-[#072A6C]/20"
                    : popup.enabled
                    ? "border-gray-200 bg-slate-50/50 hover:border-gray-300"
                    : "border-gray-200 bg-gray-50/60 opacity-60"
                }`}
              >
                {/* Header Tag & Active Radio */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#072A6C]/10 text-[#072A6C]">
                      {popup.type === "enquiry" ? "Enquiry Form" : popup.type === "event" ? "Event Popup" : "Banner Popup"}
                    </span>
                    <div className="flex items-center gap-1">
                      {popup.enabled ? (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Visible
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                          Hidden
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-600 text-white">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h5 className="text-xs font-black text-gray-900 line-clamp-1">
                      {popup.name}
                    </h5>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                      {popup.description || popup.subtitle || "No description provided."}
                    </p>
                  </div>

                  {/* Image Preview if applicable */}
                  {popup.image && popup.type !== "enquiry" && (
                    <div className="w-full h-28 rounded-xl overflow-hidden bg-white border border-gray-200 relative group">
                      <img
                        src={popup.image}
                        alt={popup.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/prog_computer.png";
                        }}
                      />
                      {popup.badge && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold rounded">
                          {popup.badge}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Redirect Target */}
                  {popup.redirectUrl && popup.type !== "enquiry" && (
                    <div className="text-[10px] text-gray-500 bg-white p-2 rounded-lg border border-gray-200 flex items-center gap-1 truncate">
                      <Link2 size={11} className="text-[#072A6C] shrink-0" />
                      <span className="font-bold text-[#072A6C]">Redirects to:</span>
                      <span className="truncate font-mono">{popup.redirectUrl}</span>
                    </div>
                  )}
                </div>

                {/* Footer Controls: Set Active / Edit / Hide / Delete */}
                <div className="pt-2 border-t border-gray-200/80 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSetActivePopup(popup.id)}
                    className={`w-full py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      isActive
                        ? "bg-[#072A6C] text-white shadow-xs"
                        : "bg-white hover:bg-blue-50 text-[#072A6C] border border-gray-200"
                    }`}
                  >
                    {isActive ? <Check size={13} /> : null}
                    <span>{isActive ? "Currently Active on Website" : "Set as Active Popup"}</span>
                  </button>

                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    {/* Hide / Show Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleHidePopup(popup.id)}
                      className={`px-2 py-1 font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors border ${
                        popup.enabled
                          ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-gray-200"
                          : "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300"
                      }`}
                      title={popup.enabled ? "Hide this popup" : "Show this popup"}
                    >
                      {popup.enabled ? <><EyeOff size={11} /> Hide</> : <><Eye size={11} /> Show</>}
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(popup)}
                      className="px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-900 border border-gray-200 hover:border-blue-300 font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit3 size={11} /> Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeletePopup(popup.id, popup.name)}
                      className="px-2 py-1 bg-white hover:bg-red-50 text-red-600 hover:text-red-800 border border-gray-200 hover:border-red-300 font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Popup Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-xl w-full overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-slate-50">
              <h4 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                {editingPopup ? <Edit3 size={15} /> : <Plus size={15} />}
                {editingPopup ? "Edit Popup Modal" : "Create New Popup Modal"}
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
            <form onSubmit={handleSaveModal} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Popup Name (Admin Reference) *</label>
                <input
                  type="text"
                  required
                  value={popupForm.name || ""}
                  onChange={(e) => setPopupForm({ ...popupForm, name: e.target.value })}
                  placeholder="e.g. National Hackathon 2026 Event Popup"
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Popup Type *</label>
                  <select
                    value={popupForm.type || "event"}
                    onChange={(e) => setPopupForm({ ...popupForm, type: e.target.value as PopupType })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
                  >
                    <option value="event">Event Poster (With Redirect Button)</option>
                    <option value="banner">Promotional Image Banner</option>
                    <option value="enquiry">Admissions Enquiry Lead Form & Schools</option>
                    <option value="custom">Custom Text & Action Notice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Visibility</label>
                  <select
                    value={popupForm.enabled ? "visible" : "hidden"}
                    onChange={(e) => setPopupForm({ ...popupForm, enabled: e.target.value === "visible" })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
                  >
                    <option value="visible">Visible (Enabled)</option>
                    <option value="hidden">Hidden (Disabled)</option>
                  </select>
                </div>
              </div>

              {/* Title & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Modal Heading Title *</label>
                  <input
                    type="text"
                    required
                    value={popupForm.title || ""}
                    onChange={(e) => setPopupForm({ ...popupForm, title: e.target.value })}
                    placeholder="e.g. ANNUAL TECH FEST 2026"
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Top Badge Tag</label>
                  <input
                    type="text"
                    value={popupForm.badge || ""}
                    onChange={(e) => setPopupForm({ ...popupForm, badge: e.target.value })}
                    placeholder="e.g. UPCOMING EVENT"
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800"
                  />
                </div>
              </div>

              {/* Subtitle & Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={popupForm.subtitle || ""}
                  onChange={(e) => setPopupForm({ ...popupForm, subtitle: e.target.value })}
                  placeholder="e.g. Innovate. Compete. Conquer."
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Description Message</label>
                <textarea
                  rows={2}
                  value={popupForm.description || ""}
                  onChange={(e) => setPopupForm({ ...popupForm, description: e.target.value })}
                  placeholder="Short details regarding the event, notice, or registration..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700 focus:bg-white"
                />
              </div>

              {/* Banner Image (for event, banner, custom) */}
              {popupForm.type !== "enquiry" && (
                <div className="space-y-2">
                  <ImageField
                    label="Popup Poster / Banner Image"
                    value={popupForm.image || "/prog_computer.png"}
                    defaultValue="/prog_computer.png"
                    onChange={(val) => setPopupForm({ ...popupForm, image: val })}
                    onReset={() => setPopupForm({ ...popupForm, image: "/prog_computer.png" })}
                    aspectRatio="video"
                    recommendedSize="1200 × 700 px"
                  />
                </div>
              )}

              {/* Redirect Action & Button Text (for event, banner, custom) */}
              {popupForm.type !== "enquiry" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1">
                      <Link2 size={11} /> Redirect URL (Where to send users)
                    </label>
                    <input
                      type="text"
                      value={popupForm.redirectUrl || ""}
                      onChange={(e) => setPopupForm({ ...popupForm, redirectUrl: e.target.value })}
                      placeholder="e.g. /news/events or /admissions"
                      className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg text-gray-800 font-mono"
                    />
                    <p className="text-[9px] text-gray-400">Can be internal (/news/events) or external URL (https://...)</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Button Action Label</label>
                    <input
                      type="text"
                      value={popupForm.buttonText || ""}
                      onChange={(e) => setPopupForm({ ...popupForm, buttonText: e.target.value })}
                      placeholder="e.g. View Events & Register Now"
                      className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg text-gray-800 font-bold"
                    />
                    <p className="text-[9px] text-gray-400">Text displayed on the clickable action button</p>
                  </div>
                </div>
              )}

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
                  <span>{editingPopup ? "Update Popup" : "Save New Popup"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
