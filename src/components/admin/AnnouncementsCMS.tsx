import React, { useState } from "react";
import { 
  Bell, Plus, Trash2, Edit3, Save, RotateCcw, 
  Search, GraduationCap, Calendar, FileText, Award, BookOpen, 
  Megaphone, ArrowUp, ArrowDown, CheckCircle2, Clock, X
} from "lucide-react";
import { useData, Announcement, INITIAL_ANNOUNCEMENTS } from "../../context/DataContext";
import { SectionHeader } from "./AdminComponents";

const ICON_OPTIONS = [
  { label: "Bell / Notification", value: "Bell", icon: Bell },
  { label: "Graduation / Admissions", value: "GraduationCap", icon: GraduationCap },
  { label: "Calendar / Schedule", value: "Calendar", icon: Calendar },
  { label: "Notice / Document", value: "FileText", icon: FileText },
  { label: "Award / Achievement", value: "Award", icon: Award },
  { label: "Academics / Book", value: "BookOpen", icon: BookOpen },
  { label: "Megaphone / Alert", value: "Megaphone", icon: Megaphone }
];

export function AnnouncementsCMS({
  notifySave,
  saveSuccess
}: {
  notifySave: (msg?: string) => void;
  saveSuccess?: boolean;
}) {
  const { announcements, updateAnnouncements } = useData();
  const [list, setList] = useState<Announcement[]>(announcements);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // New announcement form state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formDate, setFormDate] = useState(
    new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  );
  const [formIcon, setFormIcon] = useState("Bell");

  React.useEffect(() => {
    setList(announcements);
  }, [announcements]);

  const handleSave = () => {
    updateAnnouncements(list);
    notifySave("Announcements & Notices published live!");
  };

  const handleReset = () => {
    setList(INITIAL_ANNOUNCEMENTS);
    updateAnnouncements(INITIAL_ANNOUNCEMENTS);
    notifySave("Announcements reset to default!");
  };

  const handleStartCreate = () => {
    setFormTitle("");
    setFormDesc("");
    setFormDate(new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));
    setFormIcon("Bell");
    setIsCreating(true);
    setEditingItem(null);
  };

  const handleStartEdit = (ann: Announcement) => {
    setEditingItem(ann);
    setFormTitle(ann.title);
    setFormDesc(ann.desc);
    setFormDate(ann.date);
    setFormIcon(ann.iconName || "Bell");
    setIsCreating(false);
  };

  const handleCommitForm = () => {
    if (!formTitle.trim()) {
      alert("Please provide an announcement title.");
      return;
    }

    if (editingItem) {
      const updated = list.map(item => 
        (item.id === editingItem.id || item.title === editingItem.title)
          ? { ...item, title: formTitle.trim(), desc: formDesc.trim(), date: formDate, iconName: formIcon }
          : item
      );
      setList(updated);
      updateAnnouncements(updated);
      notifySave("Announcement updated successfully!");
    } else {
      const newItem: Announcement = {
        id: `ann_${Date.now()}`,
        title: formTitle.trim(),
        desc: formDesc.trim(),
        date: formDate,
        iconName: formIcon
      };
      const updated = [newItem, ...list];
      setList(updated);
      updateAnnouncements(updated);
      notifySave("New announcement pushed live!");
    }

    setIsCreating(false);
    setEditingItem(null);
  };

  const handleDelete = (index: number) => {
    const item = list[index];
    if (window.confirm(`Delete announcement "${item.title}"?`)) {
      const updated = list.filter((_, i) => i !== index);
      setList(updated);
      updateAnnouncements(updated);
      notifySave("Announcement deleted!");
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setList(copy);
    updateAnnouncements(copy);
    notifySave("Announcement reordered!");
  };

  const filteredList = list.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.desc.toLowerCase().includes(search.toLowerCase())
  );

  const getIconComponent = (iconName?: string) => {
    const found = ICON_OPTIONS.find(o => o.value === iconName);
    return found ? found.icon : Bell;
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="Announcements & Official Notices CMS"
        subtitle="Manage instant university notices, administrative updates, examination schedules, and alert badges displayed across the portal."
        icon={Bell}
        onSave={handleSave}
        saveSuccess={saveSuccess}
        onReset={handleReset}
        resetLabel="Reset Defaults"
      />

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search announcements by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072A6C]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleStartCreate}
            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-all shrink-0"
          >
            <Plus size={15} />
            <span>+ Push New Announcement</span>
          </button>
        </div>
      </div>

      {/* Create / Edit Form Modal / Card */}
      {(isCreating || editingItem) && (
        <div className="bg-white p-6 rounded-2xl border-2 border-[#072A6C]/30 shadow-lg space-y-4 animate-scale-up">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#072A6C]/10 text-[#072A6C] flex items-center justify-center font-bold">
                <Bell size={16} />
              </div>
              <div>
                <h4 className="text-sm font-black text-[#072A6C]">
                  {isCreating ? "Push New Announcement" : `Edit Announcement`}
                </h4>
                <p className="text-[11px] text-gray-500">
                  Fill in the announcement details to broadcast instantly to all students and visitors.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingItem(null); }}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Title / Headline *
              </label>
              <input
                type="text"
                placeholder="e.g. End Semester Examination Time Table - Nov 2026 Released"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072A6C]/20"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Date Display
              </label>
              <input
                type="text"
                placeholder="e.g. 12 Oct 2026"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072A6C]/20"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Description / Detailed Notice Body
              </label>
              <textarea
                rows={3}
                placeholder="Provide detailed information, eligibility, links, or instructions..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072A6C]/20 leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                Icon Category
              </label>
              <select
                value={formIcon}
                onChange={(e) => setFormIcon(e.target.value)}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#072A6C]/20 cursor-pointer"
              >
                {ICON_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => { setIsCreating(false); setEditingItem(null); }}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCommitForm}
              className="px-5 py-2 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
            >
              <Save size={14} />
              <span>{isCreating ? "Broadcast Announcement" : "Save Changes"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
              Published Announcements ({list.length})
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              Active Feed
            </span>
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <Save size={13} /> Save & Publish Live
          </button>
        </div>

        {filteredList.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
              <Bell size={22} />
            </div>
            <h5 className="text-sm font-bold text-gray-700">No Announcements Found</h5>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
              {search ? "No announcements match your search query." : "No announcements published yet. Click '+ Push New Announcement' above to create one."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredList.map((item, index) => {
              const IconComp = getIconComponent(item.iconName);
              return (
                <div 
                  key={item.id || `${item.title}-${index}`}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#072A6C]/10 text-[#072A6C] flex items-center justify-center shrink-0 mt-0.5">
                      <IconComp size={18} />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                        <h5 className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#072A6C] transition-colors truncate">
                          {item.title}
                        </h5>
                      </div>
                      {item.desc && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {item.desc}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium pt-1">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {item.date}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                          {item.iconName || "Bell"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, "down")}
                      disabled={index === list.length - 1}
                      className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="h-8 px-2.5 rounded-lg border border-blue-200 text-[#072A6C] bg-blue-50/50 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Edit announcement"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(index)}
                      className="h-8 px-2.5 rounded-lg border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Delete announcement"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
