import React, { useState } from "react";
import { 
  Calendar, Users, Plus, Trash2, Edit3, CheckCircle2, Download, Search, 
  Filter, Sparkles, RotateCcw, Save, ArrowUp, ArrowDown, ExternalLink,
  Clock, MapPin, Eye, Tag, AlertCircle, X, Check, Image as ImageIcon
} from "lucide-react";
import { 
  useData, 
  EventItem, 
  EventRegistration, 
  INITIAL_EVENTS 
} from "../../context/DataContext";
import { SectionHeader, ImageField } from "./AdminComponents";

export function EventsCMS({
  notifySave,
  saveSuccess
}: {
  notifySave: (msg?: string) => void;
  saveSuccess?: boolean;
}) {
  const { 
    events, 
    updateEvents, 
    eventRegistrations, 
    updateEventRegistrations,
    addEventRegistration,
    homepageSections,
    updateHomepageSections
  } = useData();

  const [eventsSubTab, setEventsSubTab] = useState<"eventsList" | "attendeesCRM" | "pageBanner" | "homepage">("eventsList");
  const [eventsList, setEventsList] = useState<EventItem[]>(events);
  
  // Search & Filter for Events List
  const [eventSearch, setEventSearch] = useState("");
  const [eventCategoryFilter, setEventCategoryFilter] = useState("All");

  // Search & Filter for Attendees CRM
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [attendeeStatusFilter, setAttendeeStatusFilter] = useState("All");
  const [attendeeEventFilter, setAttendeeEventFilter] = useState("All");

  // Manual Add Attendee Modal State
  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventId: events[0]?.id || 1,
    status: "Confirmed" as "Confirmed" | "Attended" | "Cancelled"
  });

  // Keep local state in sync when context updates
  React.useEffect(() => {
    setEventsList(events);
  }, [events]);

  // Save handler
  const handleSaveEvents = () => {
    updateEvents(eventsList);
    notifySave("All campus events published live!");
  };

  // Reset handler
  const handleResetEvents = () => {
    setEventsList(INITIAL_EVENTS);
    updateEvents(INITIAL_EVENTS);
    notifySave("Campus events reset to default records!");
  };

  // Categories list
  const categories = Array.from(new Set(eventsList.map(e => e.category).filter(Boolean)));

  // Filtered Events
  const filteredEvents = eventsList.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
                        (e.location || "").toLowerCase().includes(eventSearch.toLowerCase()) ||
                        e.category.toLowerCase().includes(eventSearch.toLowerCase());
    const matchCat = eventCategoryFilter === "All" || e.category === eventCategoryFilter;
    return matchSearch && matchCat;
  });

  // Filtered Attendees
  const registrationsList = eventRegistrations || [];
  const filteredAttendees = registrationsList.filter(r => {
    const q = attendeeSearch.toLowerCase();
    const matchQ = r.fullName.toLowerCase().includes(q) ||
                   r.email.toLowerCase().includes(q) ||
                   r.phone.includes(q) ||
                   r.eventTitle.toLowerCase().includes(q);
    const matchStatus = attendeeStatusFilter === "All" || (r.status || "Confirmed") === attendeeStatusFilter;
    const matchEvent = attendeeEventFilter === "All" || String(r.eventId) === attendeeEventFilter;
    return matchQ && matchStatus && matchEvent;
  });

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ["Registration ID", "Full Name", "Email Address", "Phone Number", "Event ID", "Event Title", "Registered Date", "Status"];
    const rows = registrationsList.map((r) => [
      r.id,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.phone.replace(/"/g, '""')}"`,
      r.eventId,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      r.registeredAt,
      r.status || "Confirmed"
    ]);
    const csv = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const uri = encodeURI(csv);
    const a = document.createElement("a");
    a.href = uri;
    a.download = `Chalapathi_Event_Registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    notifySave("Exported attendee records to CSV!");
  };

  // Add new event handler
  const handleAddNewEvent = () => {
    const newId = Date.now();
    const newEv: EventItem = {
      id: newId,
      slug: `campus-summit-${newId}`,
      title: "New University Technical Summit 2026",
      date: "25 Oct 2026",
      time: "10:00 AM",
      location: "Main Auditorium Hall",
      category: "Technology",
      image: "/prog_engineering.png",
      images: ["/prog_engineering.png", "/prog_computer.png"],
      registrationUrl: "/admissions",
      registrationOpen: true,
      bodyText: "Comprehensive overview, keynotes, technical tracks, and schedule of the upcoming campus event."
    };
    const updated = [newEv, ...eventsList];
    setEventsList(updated);
    updateEvents(updated);
    notifySave("New campus event created!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="Events & Registrations CMS"
        subtitle="Schedule campus summits, manage registration status (Open/Closed), configure galleries, and manage attendee leads"
        icon={Calendar}
        onSave={handleSaveEvents}
        saveSuccess={saveSuccess}
        onReset={handleResetEvents}
        resetLabel="Reset Events"
      />

      {/* Subtabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "eventsList", label: `📅 1. Campus Events Directory & Editor (${eventsList.length})` },
          { id: "attendeesCRM", label: `🎟️ 2. Event Registrations & Attendees CRM (${registrationsList.length})` },
          { id: "pageBanner", label: "🌟 3. Events Page Banner & Overview" },
          { id: "homepage", label: "🏠 4. Homepage Events Feed & Drawer" }
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setEventsSubTab(st.id as any)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              eventsSubTab === st.id
                ? "bg-[#072A6C] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 1: CAMPUS EVENTS DIRECTORY & CRUD                   */}
      {/* ────────────────────────────────────────────────────────── */}
      {eventsSubTab === "eventsList" && (
        <div className="space-y-5">
          {/* Top Bar with Actions & Search */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Calendar size={16} className="text-[#072A6C]" />
                Campus Events Directory ({eventsList.length} Scheduled)
              </h3>
              <p className="text-xs text-gray-500">
                Configure event dates, times, venues, multi-slide photo galleries, and toggle registration status between Active (Open) and Closed.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleAddNewEvent}
                className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Plus size={13} /> Add Campus Event
              </button>
              <button
                type="button"
                onClick={handleSaveEvents}
                className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Save size={13} /> Save Events
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events by title, category, or venue..."
                value={eventSearch}
                onChange={(e) => setEventSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Category:</span>
              <select
                value={eventCategoryFilter}
                onChange={(e) => setEventCategoryFilter(e.target.value)}
                className="h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
              >
                <option value="All">All Categories</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            {filteredEvents.map((event) => {
              const idx = eventsList.findIndex(e => e.id === event.id);
              const isOpen = event.registrationOpen !== false;

              return (
                <div key={event.id} className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs space-y-4">
                  {/* Card Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#072A6C] text-white text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-black text-[#072A6C]">{event.title || "Untitled Event"}</span>
                      <span className="text-[10px] font-extrabold uppercase bg-blue-50 text-[#072A6C] px-2.5 py-0.5 rounded-md border border-blue-100">
                        {event.category || "General"}
                      </span>
                      {isOpen ? (
                        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 size={11} /> Registration Open
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertCircle size={11} /> Registration Closed
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...eventsList];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          setEventsList(updated);
                          updateEvents(updated);
                        }}
                        className="p-1.5 bg-slate-50 hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === eventsList.length - 1}
                        onClick={() => {
                          if (idx === eventsList.length - 1) return;
                          const updated = [...eventsList];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          setEventsList(updated);
                          updateEvents(updated);
                        }}
                        className="p-1.5 bg-slate-50 hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete event "${event.title}"?`)) {
                            const updated = eventsList.filter((e) => e.id !== event.id);
                            setEventsList(updated);
                            updateEvents(updated);
                            notifySave("Event deleted.");
                          }
                        }}
                        className="h-7 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-md flex items-center gap-1 cursor-pointer ml-2"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Title, Category */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Event Title</label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => {
                          const updated = [...eventsList];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setEventsList(updated);
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Category</label>
                      <input
                        type="text"
                        value={event.category}
                        onChange={(e) => {
                          const updated = [...eventsList];
                          updated[idx] = { ...updated[idx], category: e.target.value };
                          setEventsList(updated);
                        }}
                        placeholder="e.g. Technology, Sports, Pharmacy"
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-semibold text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Date, Time, Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Event Date</label>
                      <input
                        type="text"
                        value={event.date}
                        onChange={(e) => {
                          const updated = [...eventsList];
                          updated[idx] = { ...updated[idx], date: e.target.value };
                          setEventsList(updated);
                        }}
                        placeholder="e.g. 17 Jul 2026"
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Event Time</label>
                      <input
                        type="text"
                        value={event.time || ""}
                        onChange={(e) => {
                          const updated = [...eventsList];
                          updated[idx] = { ...updated[idx], time: e.target.value };
                          setEventsList(updated);
                        }}
                        placeholder="e.g. 09:30 AM"
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Location / Venue</label>
                      <input
                        type="text"
                        value={event.location || ""}
                        onChange={(e) => {
                          const updated = [...eventsList];
                          updated[idx] = { ...updated[idx], location: e.target.value };
                          setEventsList(updated);
                        }}
                        placeholder="e.g. Aeronautics Hangar & Airfield"
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Slug, Registration URL & Registration Controls */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
                    <h5 className="text-[11px] font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-1.5">
                      <Tag size={13} className="text-amber-500" />
                      Registration Settings & URL
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Event URL Slug</label>
                        <input
                          type="text"
                          value={event.slug || `event-${event.id}`}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx] = { ...updated[idx], slug: e.target.value };
                            setEventsList(updated);
                          }}
                          placeholder="e.g. campus-summit-2026"
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-mono text-slate-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">External Form Link (Optional)</label>
                        <input
                          type="text"
                          value={event.registrationUrl || ""}
                          onChange={(e) => {
                            const updated = [...eventsList];
                            updated[idx] = { ...updated[idx], registrationUrl: e.target.value };
                            setEventsList(updated);
                          }}
                          placeholder="Leave blank for built-in modal popup"
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-mono text-slate-700"
                        />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none bg-white px-3 py-1.5 rounded-lg border border-gray-200 w-full">
                          <input
                            type="checkbox"
                            checked={event.registrationOpen !== false}
                            onChange={(e) => {
                              const updated = [...eventsList];
                              updated[idx] = { ...updated[idx], registrationOpen: e.target.checked };
                              setEventsList(updated);
                            }}
                            className="w-4 h-4 rounded text-[#072A6C] focus:ring-[#072A6C]"
                          />
                          <span className="text-xs font-bold text-gray-800">
                            {event.registrationOpen !== false ? "🟢 Registration Active (Open)" : "🔴 Registration Closed"}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Full Description / Agenda */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Event Description & Agenda</label>
                    <textarea
                      rows={3}
                      value={event.bodyText}
                      onChange={(e) => {
                        const updated = [...eventsList];
                        updated[idx] = { ...updated[idx], bodyText: e.target.value };
                        setEventsList(updated);
                      }}
                      placeholder="Detailed event description, keynote speakers, and schedule..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg leading-relaxed text-slate-800"
                    />
                  </div>

                  {/* Event Poster / Banner */}
                  <ImageField
                    label="Event Primary Poster & Banner Image"
                    value={event.image || "/prog_engineering.png"}
                    defaultValue="/prog_engineering.png"
                    onChange={(val) => {
                      const updated = [...eventsList];
                      updated[idx] = { ...updated[idx], image: val };
                      setEventsList(updated);
                    }}
                    onReset={() => {
                      const updated = [...eventsList];
                      updated[idx] = { ...updated[idx], image: "/prog_engineering.png" };
                      setEventsList(updated);
                    }}
                    aspectRatio="video"
                  />

                  {/* Multi-Image Carousel Slider / Gallery */}
                  <div className="p-4 rounded-xl border border-orange-200/70 bg-orange-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-black text-orange-950 uppercase tracking-wide">
                          Event Multi-Image Gallery Slider ({event.images?.length || (event.image ? 1 : 0)} Slides)
                        </h5>
                        <p className="text-[11px] text-orange-900/80">
                          Multi-slide carousel shown inside the event detail page with left/right arrows & dot indicators.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentImgs = event.images && event.images.length > 0 ? [...event.images] : [event.image || "/prog_engineering.png"];
                          const updated = [...eventsList];
                          updated[idx] = { ...updated[idx], images: [...currentImgs, "/prog_engineering.png"] };
                          setEventsList(updated);
                        }}
                        className="h-7 px-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Plus size={12} /> Add Event Slide
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(event.images && event.images.length > 0 ? event.images : [event.image || "/prog_engineering.png"]).map((imgUrl, sIdx) => (
                        <div key={sIdx} className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400">Slide #{sIdx + 1}</span>
                            {(event.images?.length || 1) > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const currentImgs = event.images && event.images.length > 0 ? [...event.images] : [event.image || "/prog_engineering.png"];
                                  const filtered = currentImgs.filter((_, i) => i !== sIdx);
                                  const updated = [...eventsList];
                                  updated[idx] = { ...updated[idx], images: filtered };
                                  setEventsList(updated);
                                }}
                                className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer"
                              >
                                <Trash2 size={11} /> Remove
                              </button>
                            )}
                          </div>
                          <ImageField
                            label="Event Slide Photo"
                            value={imgUrl}
                            defaultValue="/prog_engineering.png"
                            onChange={(val) => {
                              const currentImgs = event.images && event.images.length > 0 ? [...event.images] : [event.image || "/prog_engineering.png"];
                              currentImgs[sIdx] = val;
                              const updated = [...eventsList];
                              updated[idx] = { ...updated[idx], images: currentImgs };
                              setEventsList(updated);
                            }}
                            onReset={() => {
                              const currentImgs = event.images && event.images.length > 0 ? [...event.images] : [event.image || "/prog_engineering.png"];
                              currentImgs[sIdx] = "/prog_engineering.png";
                              const updated = [...eventsList];
                              updated[idx] = { ...updated[idx], images: currentImgs };
                              setEventsList(updated);
                            }}
                            aspectRatio="video"
                            recommendedSize="1200 × 700 px"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 2: EVENT REGISTRATIONS & ATTENDEES CRM              */}
      {/* ────────────────────────────────────────────────────────── */}
      {eventsSubTab === "attendeesCRM" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Users size={16} className="text-[#072A6C]" />
                Event Registrations & Attendees ({registrationsList.length} Leads)
              </h3>
              <p className="text-xs text-gray-500">
                Manage all attendee submissions from the popup registration modal. Search, filter, update attendance status, and export to CSV.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddAttendeeModal(true)}
                className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Plus size={13} /> Add Manual Attendee
              </button>
              <button
                type="button"
                onClick={handleExportCSV}
                className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
              >
                <Download size={13} /> Export Attendees CSV
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Total Registrations</span>
              <div className="text-xl font-black text-[#072A6C] mt-1">{registrationsList.length}</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Confirmed</span>
              <div className="text-xl font-black text-emerald-700 mt-1">
                {registrationsList.filter(r => (r.status || "Confirmed") === "Confirmed").length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold text-blue-600 uppercase">Attended</span>
              <div className="text-xl font-black text-blue-700 mt-1">
                {registrationsList.filter(r => r.status === "Attended").length}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
              <span className="text-[10px] font-bold text-rose-600 uppercase">Cancelled</span>
              <div className="text-xl font-black text-rose-700 mt-1">
                {registrationsList.filter(r => r.status === "Cancelled").length}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search attendee by Name, Phone, Email, or Event..."
                value={attendeeSearch}
                onChange={(e) => setAttendeeSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Status:</span>
              <select
                value={attendeeStatusFilter}
                onChange={(e) => setAttendeeStatusFilter(e.target.value)}
                className="h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Attended">Attended</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Event:</span>
              <select
                value={attendeeEventFilter}
                onChange={(e) => setAttendeeEventFilter(e.target.value)}
                className="h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700 max-w-[180px] truncate"
              >
                <option value="All">All Events</option>
                {eventsList.map((ev) => (
                  <option key={ev.id} value={String(ev.id)}>{ev.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Attendees Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            {filteredAttendees.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-xs">
                No attendee registrations match the current search / filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Reg ID</th>
                      <th className="py-3 px-4">Attendee Details</th>
                      <th className="py-3 px-4">Event Registered</th>
                      <th className="py-3 px-4">Registered On</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {filteredAttendees.map((reg) => (
                      <tr key={reg.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-[#072A6C]">
                          #{reg.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{reg.fullName}</div>
                          <div className="text-[11px] text-gray-500 font-mono">+91 {reg.phone}</div>
                          <div className="text-[10px] text-gray-400">{reg.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-800 block max-w-[260px]">{reg.eventTitle}</span>
                          <span className="text-[10px] text-gray-400">Event ID: #{reg.eventId}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                          {reg.registeredAt}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={reg.status || "Confirmed"}
                            onChange={(e) => {
                              const newStatus = e.target.value as any;
                              const updated = registrationsList.map((item) =>
                                item.id === reg.id ? { ...item, status: newStatus } : item
                              );
                              updateEventRegistrations(updated);
                              notifySave(`Attendee status changed to ${newStatus}`);
                            }}
                            className={`text-[11px] font-bold py-1 px-2 rounded-lg border ${
                              reg.status === "Attended" 
                                ? "border-blue-200 bg-blue-50 text-blue-800" 
                                : reg.status === "Cancelled" 
                                ? "border-rose-200 bg-rose-50 text-rose-800" 
                                : "border-emerald-200 bg-emerald-50 text-emerald-800"
                            }`}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Attended">Attended</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete registration for ${reg.fullName}?`)) {
                                const updated = registrationsList.filter((item) => item.id !== reg.id);
                                updateEventRegistrations(updated);
                                notifySave("Attendee record deleted.");
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 3: EVENTS PAGE BANNER & OVERVIEW                     */}
      {/* ────────────────────────────────────────────────────────── */}
      {eventsSubTab === "pageBanner" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              Events Public Page Banner & Overview
            </h3>
            <p className="text-xs text-gray-500">
              Customize the hero banner text and settings for the public <code>/events</code> and <code>/news/events/all</code> pages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Banner Badge Tag</label>
              <input
                type="text"
                defaultValue="Campus Activities"
                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Main Heading Title</label>
              <input
                type="text"
                defaultValue="University Events"
                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-[#072A6C]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600 uppercase">Banner Subtitle / Description</label>
            <textarea
              rows={2}
              defaultValue="Participate in hackathons, expert workshops, alumni gatherings, and regional technology exhibitions."
              className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
            />
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Eye size={16} className="text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white">Direct Public Links</div>
                <div className="text-[10px] text-gray-400">View live events carousel and directory</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/events"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition"
              >
                <span>/events</span>
                <ExternalLink size={12} />
              </a>
              <a
                href="/news/events/all"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-[#D4AF37] hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition"
              >
                <span>/news/events/all</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* MANUAL ADD ATTENDEE MODAL                                  */}
      {/* ────────────────────────────────────────────────────────── */}
      {showAddAttendeeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h4 className="text-sm font-black text-[#072A6C] uppercase">Manual Add Attendee</h4>
              <button onClick={() => setShowAddAttendeeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAttendee.fullName}
                  onChange={(e) => setNewAttendee({ ...newAttendee, fullName: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newAttendee.email}
                  onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                  placeholder="Enter email"
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newAttendee.phone}
                  onChange={(e) => setNewAttendee({ ...newAttendee, phone: e.target.value })}
                  placeholder="Enter 10-digit phone"
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase">Event *</label>
                <select
                  value={newAttendee.eventId}
                  onChange={(e) => setNewAttendee({ ...newAttendee, eventId: Number(e.target.value) })}
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                >
                  {eventsList.map((ev) => (
                    <option key={ev.id} value={ev.id}>{ev.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 uppercase">Status</label>
                <select
                  value={newAttendee.status}
                  onChange={(e) => setNewAttendee({ ...newAttendee, status: e.target.value as any })}
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Attended">Attended</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddAttendeeModal(false)}
                className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newAttendee.fullName || !newAttendee.email || !newAttendee.phone) {
                    alert("Please fill in all required fields.");
                    return;
                  }
                  const ev = eventsList.find(e => e.id === newAttendee.eventId) || eventsList[0];
                  addEventRegistration({
                    fullName: newAttendee.fullName,
                    email: newAttendee.email,
                    phone: newAttendee.phone,
                    eventId: ev.id,
                    eventTitle: ev.title
                  });
                  setShowAddAttendeeModal(false);
                  setNewAttendee({
                    fullName: "",
                    email: "",
                    phone: "",
                    eventId: eventsList[0]?.id || 1,
                    status: "Confirmed"
                  });
                  notifySave("Attendee added successfully!");
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#051c4a] rounded-lg shadow-xs"
              >
                Save Attendee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 4: HOMEPAGE UPCOMING EVENTS FEED & DRAWER           */}
      {/* ────────────────────────────────────────────────────────── */}
      {eventsSubTab === "homepage" && (
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-900 border border-purple-300">
                  Homepage Section Sync
                </span>
                <span className="text-xs text-gray-400 font-mono">Live on Home Page</span>
              </div>
              <h3 className="text-base font-black text-[#072A6C] uppercase">
                🏠 Homepage Events Feed & Interactive Drawer
              </h3>
              <p className="text-xs text-gray-500">
                Manage the live upcoming events feed displayed on the homepage, along with the interactive full-screen event details drawer and RSVP integration.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  updateEvents(eventsList);
                  notifySave("Homepage Events feed and drawer published live!");
                }}
                className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save size={13} /> Save Homepage Events
              </button>
            </div>
          </div>

          {/* Homepage Feed Preview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Calendar size={14} className="text-[#072A6C]" />
                  1. Homepage Upcoming Events Feed (Top 4 Displayed)
                </h4>
                <p className="text-[11px] text-gray-500">The first 4 chronological events are automatically featured in the homepage events feed</p>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {eventsList.length} Total Events
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {eventsList.slice(0, 4).map((ev, idx) => (
                <div key={ev.id} className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#072A6C] bg-white px-2 py-0.5 rounded border border-gray-200">
                      Feed Slot #{idx + 1}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ev.registrationOpen !== false
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}>
                      {ev.registrationOpen !== false ? "Registration Open" : "Registration Closed"}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{ev.title}</h5>
                  <p className="text-[11px] text-gray-500 line-clamp-2">{ev.bodyText}</p>

                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-semibold pt-2 border-t border-gray-200">
                    <span className="flex items-center gap-1 text-[#072A6C] font-bold">
                      <Clock size={11} /> {ev.date} • {ev.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {ev.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Events Drawer Config */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Users size={14} className="text-emerald-600" />
                  2. Interactive Drawer & RSVP Configuration
                </h4>
                <p className="text-[11px] text-gray-500">Settings for the slide-out events drawer when visitors click any event on the homepage</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold text-gray-600 uppercase">RSVP Mode</span>
                <div className="font-bold text-xs text-gray-900">Instant Online Registration</div>
                <p className="text-[10px] text-gray-400">Captures Name, Email, Phone & assigns Ticket ID</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold text-gray-600 uppercase">Notifications</span>
                <div className="font-bold text-xs text-emerald-700">Auto-Confirmation Badge</div>
                <p className="text-[10px] text-gray-400">Shows instant registration pass with ID</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-1">
                <span className="text-[10px] font-bold text-gray-600 uppercase">Attendee CRM Sync</span>
                <div className="font-bold text-xs text-[#072A6C]">Live Lead Capture</div>
                <p className="text-[10px] text-gray-400">Synced directly to Subtab 2 Attendees CRM</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default EventsCMS;
