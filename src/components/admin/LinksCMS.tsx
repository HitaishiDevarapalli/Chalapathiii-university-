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
  ExternalLink,
  Layers,
  Search,
  Check,
  Copy,
  Sliders,
  Award,
  BookOpen,
  Newspaper,
  Calendar,
  CreditCard,
  UserPlus
} from "lucide-react";
import { 
  useData, 
  FooterContent, 
  FooterLinkItem, 
  DEFAULT_FOOTER_CONTENT,
  NavMenuItem,
  DEFAULT_NAV_MENU,
  DEFAULT_SITE_SETTINGS
} from "../../context/DataContext";

// Social Media Icons
const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const ALL_SYSTEM_ROUTES = [
  { path: "/", title: "Homepage (Hero, Stats, Sections)", section: "Core" },
  { path: "/about", title: "About Overview (Vision, Heritage)", section: "About" },
  { path: "/about/genesis", title: "Genesis & 30-Year Heritage", section: "About" },
  { path: "/about/vision", title: "Vision & Mission Statement", section: "About" },
  { path: "/about/leadership", title: "University Leadership & Chairman", section: "About" },
  { path: "/about/advantage", title: "The Chalapathi Advantage", section: "About" },
  { path: "/academics", title: "Academics & Schools Hub", section: "Academics" },
  { path: "/academics/btech-cse", title: "B.Tech CSE Program Page", section: "Academics" },
  { path: "/academics/btech-aiml", title: "B.Tech AI & ML Program Page", section: "Academics" },
  { path: "/academics/btech-cse-data-science", title: "B.Tech CSE Data Science", section: "Academics" },
  { path: "/academics/btech-cse-cyber-security", title: "B.Tech Cyber Security", section: "Academics" },
  { path: "/academics/btech-ece", title: "B.Tech ECE Program Page", section: "Academics" },
  { path: "/academics/btech-civil", title: "B.Tech Civil Engineering", section: "Academics" },
  { path: "/academics/mca", title: "MCA Program Page", section: "Academics" },
  { path: "/academics/mba", title: "MBA Program Page", section: "Academics" },
  { path: "/academics/calendar", title: "Official Academic Calendar", section: "Academics" },
  { path: "/academics/flexibilities", title: "Academic Flexibilities", section: "Academics" },
  { path: "/academics/grading", title: "Grading System & SGPA", section: "Academics" },
  { path: "/academics/degrees", title: "Award of Degrees", section: "Academics" },
  { path: "/academics/rules", title: "Rules & Regulations", section: "Academics" },
  { path: "/academics/teaching", title: "Teaching & Evaluation Pedagogy", section: "Academics" },
  { path: "/admissions", title: "Admissions Hub & Portal", section: "Admissions" },
  { path: "/admissions/apply", title: "Apply Online (5-Step Form)", section: "Admissions" },
  { path: "/admissions/fees", title: "Fee Structure & Scholarships", section: "Admissions" },
  { path: "/admissions/scholarships", title: "Scholarships & Financial Aid", section: "Admissions" },
  { path: "/research", title: "Research & Innovation Hub", section: "Research" },
  { path: "/research/projects", title: "Funded Research Projects", section: "Research" },
  { path: "/research/publications", title: "Scopus & IEEE Publications", section: "Research" },
  { path: "/research/patents", title: "Patents & Innovations", section: "Research" },
  { path: "/placements", title: "Placements & Career Cell", section: "Placements" },
  { path: "/placements/statistics", title: "Placement Statistics & Records", section: "Placements" },
  { path: "/placements/recruiters", title: "Top Corporate Recruiters", section: "Placements" },
  { path: "/placements/training", title: "Training & Career Bootcamp", section: "Placements" },
  { path: "/campus-life", title: "Campus Life Overview", section: "Campus" },
  { path: "/campus-life/library", title: "Central Digital Library", section: "Campus" },
  { path: "/campus-life/smart-classrooms", title: "Smart Digital Classrooms", section: "Campus" },
  { path: "/campus-life/laboratories", title: "State-of-the-Art Laboratories", section: "Campus" },
  { path: "/campus-life/hostels", title: "Hostels & Student Residences", section: "Campus" },
  { path: "/campus-life/sports", title: "Sports Complex & Fitness", section: "Campus" },
  { path: "/campus-life/cafeteria", title: "Cafeteria & Food Court", section: "Campus" },
  { path: "/campus-life/transportation", title: "Transportation & Buses", section: "Campus" },
  { path: "/campus-life/wifi", title: "High-Speed Wi-Fi Campus", section: "Campus" },
  { path: "/campus-life/health-centre", title: "Health & Medical Centre", section: "Campus" },
  { path: "/campus-life/clubs", title: "Student Clubs & Societies", section: "Campus" },
  { path: "/campus-life/innovation-hub", title: "Innovation & Incubation Hub", section: "Campus" },
  { path: "/news", title: "News & Events Center", section: "Media" },
  { path: "/news/latest", title: "University Highlights & All News", section: "Media" },
  { path: "/news/events", title: "Campus Events Carousel", section: "Media" },
  { path: "/news/events/all", title: "Events Archive Directory", section: "Media" },
  { path: "/contact", title: "Contact Us & Campus Map", section: "Contact" },
  { path: "/privacy-policy", title: "Privacy Policy", section: "Legal" },
  { path: "/terms-conditions", title: "Terms & Conditions", section: "Legal" },
  { path: "/sitemap", title: "Website Sitemap", section: "Legal" }
];

export default function LinksCMS({ notifySave }: { notifySave?: (msg: string) => void }) {
  const {
    navigationMenu,
    updateNavigationMenu,
    footerContent,
    updateFooterContent,
    siteSettings,
    updateSiteSettings,
    newsPageConfig,
    updateNewsPageConfig,
    admissionsContent,
    updateAdmissionsContent
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<
    "headerNav" | "quickLinks" | "admissionsLinks" | "mediaLinks" | "footerColumns" | "socialLinks" | "routeTester"
  >("headerNav");

  // State for Navigation Menu
  const [navItems, setNavItems] = useState<NavMenuItem[]>(() => {
    return navigationMenu && navigationMenu.length > 0 ? navigationMenu : DEFAULT_NAV_MENU;
  });

  // State for Footer Content
  const [footerForm, setFooterForm] = useState<FooterContent>(() => {
    return footerContent ? { ...DEFAULT_FOOTER_CONTENT, ...footerContent } : DEFAULT_FOOTER_CONTENT;
  });

  // State for Site Settings (Social Links & Quick Links)
  const [siteSettingsForm, setSiteSettingsForm] = useState(siteSettings || DEFAULT_SITE_SETTINGS);

  // Quick Links Portals Form State
  const [quickPortals, setQuickPortals] = useState([
    { id: "erp", label: "ERP Student/Faculty Portal", url: "https://erp.chalapathi.edu.in", category: "Academic Portal", icon: "GraduationCap" },
    { id: "fee", label: "Online Fee Payment Gateway", url: "/admissions/apply", category: "Finance", icon: "CreditCard" },
    { id: "exam", label: "Examination Results & Hall Tickets", url: "https://exams.chalapathi.edu.in", category: "Examinations", icon: "FileText" },
    { id: "library", label: "Central Digital Library OPAC", url: "/campus-life/library", category: "Learning Resource", icon: "BookOpen" },
    { id: "iqac", label: "Internal Quality Assurance Cell (IQAC)", url: "/about", category: "Compliance", icon: "Award" },
    { id: "naac", label: "NAAC 'A+' & NIRF Reports", url: "/about/genesis", category: "Accreditation", icon: "ShieldCheck" },
    { id: "antiragging", label: "Anti-Ragging Squad & Committee", url: "/campus-life/safety", category: "Student Welfare", icon: "ShieldCheck" },
    { id: "grievance", label: "Online Student Grievance Cell", url: "/campus-life/grievance-cell", category: "Support", icon: "PhoneCall" },
    { id: "alumni", label: "Chalapathi Alumni Network", url: "https://alumni.chalapathi.edu.in", category: "Alumni", icon: "Users" },
    { id: "feedback", label: "Student & Parent Feedback Form", url: "/contact", category: "Quality", icon: "Sparkles" }
  ]);

  // Route tester search & filter
  const [routeSearch, setRouteSearch] = useState("");
  const [routeFilter, setRouteFilter] = useState("All");

  const notify = (msg: string) => {
    if (notifySave) notifySave(msg);
  };

  const handleSaveAllLinks = () => {
    updateNavigationMenu(navItems);
    updateFooterContent(footerForm);
    updateSiteSettings(siteSettingsForm);
    notify("All Navigation Links, Quick Links & Footer URLs published live!");
  };

  const handleResetNav = () => {
    if (window.confirm("Reset main navigation menu to default?")) {
      setNavItems(DEFAULT_NAV_MENU);
      updateNavigationMenu(DEFAULT_NAV_MENU);
      notify("Navigation menu reset to default!");
    }
  };

  const handleResetFooterLinks = () => {
    if (window.confirm("Reset footer link columns to university default?")) {
      setFooterForm(DEFAULT_FOOTER_CONTENT);
      updateFooterContent(DEFAULT_FOOTER_CONTENT);
      notify("Footer links reset to default!");
    }
  };

  // Nav item CRUD
  const moveNavItem = (idx: number, direction: "up" | "down") => {
    const updated = [...navItems];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    updated.forEach((item, i) => (item.order = i + 1));
    setNavItems(updated);
  };

  const toggleNavEnable = (id: string) => {
    const updated = navItems.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item));
    setNavItems(updated);
  };

  const handleAddNavItem = () => {
    const label = prompt("Enter menu item label (e.g. International Admissions):");
    if (!label) return;
    const to = prompt("Enter target URL path (e.g. /admissions/international):", "/");
    if (!to) return;
    const newItem: NavMenuItem = {
      id: "nav-" + Date.now(),
      label,
      to,
      enabled: true,
      order: navItems.length + 1
    };
    const updated = [...navItems, newItem];
    setNavItems(updated);
  };

  const handleDeleteNavItem = (id: string) => {
    if (navItems.length <= 1) {
      alert("You must keep at least one navigation item.");
      return;
    }
    const updated = navItems.filter((i) => i.id !== id);
    setNavItems(updated);
  };

  // Footer Links CRUD
  const handleAddFooterLink = (category: "quickLinks" | "academicsLinks" | "admissionsLinks" | "campusLifeLinks" | "bottomLinks") => {
    const newLink: FooterLinkItem = {
      label: "New Link",
      to: "/"
    };
    setFooterForm({
      ...footerForm,
      [category]: [...(footerForm[category] || []), newLink]
    });
  };

  const handleUpdateFooterLink = (
    category: "quickLinks" | "academicsLinks" | "admissionsLinks" | "campusLifeLinks" | "bottomLinks",
    index: number,
    field: "label" | "to",
    val: string
  ) => {
    const current = [...(footerForm[category] || [])];
    current[index] = { ...current[index], [field]: val };
    setFooterForm({ ...footerForm, [category]: current });
  };

  const handleDeleteFooterLink = (
    category: "quickLinks" | "academicsLinks" | "admissionsLinks" | "campusLifeLinks" | "bottomLinks",
    index: number
  ) => {
    const current = [...(footerForm[category] || [])];
    current.splice(index, 1);
    setFooterForm({ ...footerForm, [category]: current });
  };

  const moveFooterLink = (
    category: "quickLinks" | "academicsLinks" | "admissionsLinks" | "campusLifeLinks" | "bottomLinks",
    index: number,
    direction: "up" | "down"
  ) => {
    const current = [...(footerForm[category] || [])];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIdx];
    current[targetIdx] = temp;
    setFooterForm({ ...footerForm, [category]: current });
  };

  // Filtered routes for testing
  const filteredRoutes = ALL_SYSTEM_ROUTES.filter((r) => {
    const matchesFilter = routeFilter === "All" || r.section === routeFilter;
    const matchesSearch =
      r.path.toLowerCase().includes(routeSearch.toLowerCase()) ||
      r.title.toLowerCase().includes(routeSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in text-left font-[var(--font-poppins)]">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#072A6C] flex items-center justify-center shrink-0">
            <Link2 size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#072A6C] tracking-tight flex items-center gap-2">
              Website Links & Navigation Control Center
            </h2>
            <p className="text-xs text-gray-500">
              Manage all top navigation menus, quick portal links, admission CTA buttons, news/events links, footer columns, social channels, and live URL routing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleSaveAllLinks}
            className="h-9 px-5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Save size={14} /> Save All Links
          </button>
        </div>
      </div>

      {/* Subtabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3 bg-white p-3 rounded-2xl border shadow-2xs">
        {[
          { id: "headerNav", label: "🧭 1. Header Main Navigation Menu", count: navItems.length },
          { id: "quickLinks", label: "⚡ 2. Quick Links & Important Portals", count: quickPortals.length },
          { id: "admissionsLinks", label: "📝 3. Admissions & Action Links" },
          { id: "mediaLinks", label: "📰 4. News & Highlights Links" },
          { id: "footerColumns", label: "👣 5. Footer Link Columns (4 Sets + Legal)" },
          { id: "socialLinks", label: "🌐 6. Social Media & Channels" },
          { id: "routeTester", label: "🔍 7. Universal Route Validator (45+ Pages)" }
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setActiveSubTab(st.id as any)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === st.id
                ? "bg-[#072A6C] text-white shadow-sm"
                : "bg-slate-50 text-gray-700 hover:bg-slate-100 border border-gray-200/80"
            }`}
          >
            <span>{st.label}</span>
            {st.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                activeSubTab === st.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
              }`}>
                {st.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. HEADER MAIN NAVIGATION MENU CMS                         */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeSubTab === "headerNav" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Compass size={16} className="text-[#072A6C]" />
                Main Header Navigation Bar Items ({navItems.length})
              </h3>
              <p className="text-xs text-gray-500">
                Configure primary navbar labels, destination paths, display order, and visibility on desktop and mobile.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetNav}
                className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw size={12} /> Reset Menu
              </button>
              <button
                type="button"
                onClick={handleAddNavItem}
                className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={13} /> Add Menu Item
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {navItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className={`p-4 rounded-xl border transition-all ${
                  item.enabled ? "bg-slate-50/70 border-gray-200 shadow-2xs" : "bg-gray-50/50 border-gray-200 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-[#072A6C] text-white text-xs font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Menu Label</label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...navItems];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setNavItems(updated);
                          }}
                          className="w-full h-8 px-2.5 text-xs font-bold text-slate-800 bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Target Route</label>
                        <input
                          type="text"
                          value={item.to}
                          onChange={(e) => {
                            const updated = [...navItems];
                            updated[idx] = { ...updated[idx], to: e.target.value };
                            setNavItems(updated);
                          }}
                          className="w-full h-8 px-2.5 text-xs font-mono text-slate-700 bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleNavEnable(item.id)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                        item.enabled ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {item.enabled ? "Visible (ON)" : "Hidden (OFF)"}
                    </button>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveNavItem(idx, "up")}
                      className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === navItems.length - 1}
                      onClick={() => moveNavItem(idx, "down")}
                      className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNavItem(item.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-md cursor-pointer ml-1"
                      title="Delete Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. QUICK LINKS & IMPORTANT PORTALS                         */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeSubTab === "quickLinks" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" />
                Quick Links & Student/Staff Portals ({quickPortals.length})
              </h3>
              <p className="text-xs text-gray-500">
                Manage destination URLs for top bar utilities, ERP system, online fee payment, exam results, and compliance disclosures.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const label = prompt("Enter portal label (e.g. Research Portal):");
                if (!label) return;
                const url = prompt("Enter target URL:", "https://...");
                if (!url) return;
                setQuickPortals([
                  ...quickPortals,
                  { id: "portal-" + Date.now(), label, url, category: "Custom Portal", icon: "Globe" }
                ]);
                notify("New portal shortcut added!");
              }}
              className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus size={13} /> Add Portal Link
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickPortals.map((p, idx) => (
              <div key={p.id || idx} className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#072A6C] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {p.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = quickPortals.filter((_, i) => i !== idx);
                      setQuickPortals(updated);
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Portal Title</label>
                  <input
                    type="text"
                    value={p.label}
                    onChange={(e) => {
                      const updated = [...quickPortals];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      setQuickPortals(updated);
                    }}
                    className="w-full h-8 px-2.5 text-xs font-bold text-slate-800 bg-white border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Destination URL / Route</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={p.url}
                      onChange={(e) => {
                        const updated = [...quickPortals];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setQuickPortals(updated);
                      }}
                      className="flex-1 h-8 px-2.5 text-xs font-mono text-slate-700 bg-white border border-gray-200 rounded-lg"
                    />
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center text-xs font-bold"
                      title="Open Live Link"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 3. ADMISSIONS & ACTION CTA LINKS                           */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeSubTab === "admissionsLinks" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
              <UserPlus size={16} className="text-[#072A6C]" />
              Admissions & Direct Action CTA Links
            </h3>
            <p className="text-xs text-gray-500">
              Configure primary action targets for the "Apply Now" buttons, floating drawer helpline numbers, and brochure downloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
              <label className="text-[10px] font-bold text-[#072A6C] uppercase">
                1. "Apply Now" Header Button Target Path
              </label>
              <input
                type="text"
                defaultValue="/admissions/apply"
                className="w-full h-9 px-3 text-xs font-bold text-[#072A6C] bg-white border border-blue-200 rounded-lg"
              />
              <span className="text-[10px] text-gray-500">Routes to the 5-step interactive online admission application portal</span>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
              <label className="text-[10px] font-bold text-[#072A6C] uppercase">
                2. "Download Information Brochure" Link
              </label>
              <input
                type="text"
                defaultValue="/Chalapathi_Brochure_2025.pdf"
                className="w-full h-9 px-3 text-xs font-mono text-gray-700 bg-white border border-blue-200 rounded-lg"
              />
              <span className="text-[10px] text-gray-500">PDF brochure document triggered upon download click</span>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
              <label className="text-[10px] font-bold text-[#072A6C] uppercase">
                3. Admission Fee Structure & Scholarships Page
              </label>
              <input
                type="text"
                defaultValue="/admissions/fees"
                className="w-full h-9 px-3 text-xs font-mono text-gray-700 bg-white border border-blue-200 rounded-lg"
              />
              <span className="text-[10px] text-gray-500">Displays fee breakdown per school & merit scholarship criteria</span>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 space-y-2">
              <label className="text-[10px] font-bold text-[#072A6C] uppercase">
                4. Book Campus Visit & Contact URL
              </label>
              <input
                type="text"
                defaultValue="/contact"
                className="w-full h-9 px-3 text-xs font-mono text-gray-700 bg-white border border-blue-200 rounded-lg"
              />
              <span className="text-[10px] text-gray-500">Opens contact form and campus visit scheduling map</span>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 4. NEWS & HIGHLIGHTS LINKS                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeSubTab === "mediaLinks" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
              <Newspaper size={16} className="text-[#072A6C]" />
              News, Events & Media Action Links
            </h3>
            <p className="text-xs text-gray-500">
              Control destination URLs for all "View All", "Read Full Story", and "Register Now" buttons across media pages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase">
                University Highlights "View All"
              </label>
              <input
                type="text"
                value={newsPageConfig?.highlightsViewAllUrl || "/news/latest"}
                onChange={(e) => updateNewsPageConfig({ ...newsPageConfig, highlightsViewAllUrl: e.target.value })}
                className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase">
                Upcoming Events "View All"
              </label>
              <input
                type="text"
                defaultValue="/news/events/all"
                className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase">
                Latest News Grid "View All News"
              </label>
              <input
                type="text"
                value={newsPageConfig?.latestNewsViewAllUrl || "/news/latest"}
                onChange={(e) => updateNewsPageConfig({ ...newsPageConfig, latestNewsViewAllUrl: e.target.value })}
                className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 5. FOOTER LINK COLUMNS (4 SETS + LEGAL)                    */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeSubTab === "footerColumns" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Layers size={16} className="text-[#072A6C]" />
                Footer 4 Navigation Columns & Legal Links
              </h3>
              <p className="text-xs text-gray-500">
                Full CRUD control over every column in the footer with custom link titles, URLs, and reordering.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFooterLinks}
              className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw size={12} /> Reset Footer Links
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Quick Links */}
            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-black text-[#072A6C] uppercase">
                  Column 1: Quick Links ({footerForm.quickLinks?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => handleAddFooterLink("quickLinks")}
                  className="h-6 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={11} /> Add Link
                </button>
              </div>

              <div className="space-y-2">
                {footerForm.quickLinks?.map((l, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={l.label}
                      onChange={(e) => handleUpdateFooterLink("quickLinks", idx, "label", e.target.value)}
                      className="flex-1 h-7 px-2 text-xs font-bold bg-slate-50 border border-gray-200 rounded"
                    />
                    <input
                      type="text"
                      value={l.to}
                      onChange={(e) => handleUpdateFooterLink("quickLinks", idx, "to", e.target.value)}
                      className="w-28 h-7 px-2 text-xs font-mono bg-slate-50 border border-gray-200 rounded"
                    />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFooterLink("quickLinks", idx, "up")}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (footerForm.quickLinks?.length || 0) - 1}
                      onClick={() => moveFooterLink("quickLinks", idx, "down")}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowDown size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFooterLink("quickLinks", idx)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Academic Programs */}
            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-black text-[#072A6C] uppercase">
                  Column 2: Academics Links ({footerForm.academicsLinks?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => handleAddFooterLink("academicsLinks")}
                  className="h-6 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={11} /> Add Link
                </button>
              </div>

              <div className="space-y-2">
                {footerForm.academicsLinks?.map((l, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={l.label}
                      onChange={(e) => handleUpdateFooterLink("academicsLinks", idx, "label", e.target.value)}
                      className="flex-1 h-7 px-2 text-xs font-bold bg-slate-50 border border-gray-200 rounded"
                    />
                    <input
                      type="text"
                      value={l.to}
                      onChange={(e) => handleUpdateFooterLink("academicsLinks", idx, "to", e.target.value)}
                      className="w-28 h-7 px-2 text-xs font-mono bg-slate-50 border border-gray-200 rounded"
                    />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFooterLink("academicsLinks", idx, "up")}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (footerForm.academicsLinks?.length || 0) - 1}
                      onClick={() => moveFooterLink("academicsLinks", idx, "down")}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowDown size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFooterLink("academicsLinks", idx)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Admissions & Aid */}
            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-black text-[#072A6C] uppercase">
                  Column 3: Admissions Links ({footerForm.admissionsLinks?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => handleAddFooterLink("admissionsLinks")}
                  className="h-6 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={11} /> Add Link
                </button>
              </div>

              <div className="space-y-2">
                {footerForm.admissionsLinks?.map((l, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={l.label}
                      onChange={(e) => handleUpdateFooterLink("admissionsLinks", idx, "label", e.target.value)}
                      className="flex-1 h-7 px-2 text-xs font-bold bg-slate-50 border border-gray-200 rounded"
                    />
                    <input
                      type="text"
                      value={l.to}
                      onChange={(e) => handleUpdateFooterLink("admissionsLinks", idx, "to", e.target.value)}
                      className="w-28 h-7 px-2 text-xs font-mono bg-slate-50 border border-gray-200 rounded"
                    />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFooterLink("admissionsLinks", idx, "up")}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (footerForm.admissionsLinks?.length || 0) - 1}
                      onClick={() => moveFooterLink("admissionsLinks", idx, "down")}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowDown size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFooterLink("admissionsLinks", idx)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 4: Campus Life Links */}
            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-black text-[#072A6C] uppercase">
                  Column 4: Campus Life Links ({footerForm.campusLifeLinks?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => handleAddFooterLink("campusLifeLinks")}
                  className="h-6 px-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={11} /> Add Link
                </button>
              </div>

              <div className="space-y-2">
                {footerForm.campusLifeLinks?.map((l, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200">
                    <input
                      type="text"
                      value={l.label}
                      onChange={(e) => handleUpdateFooterLink("campusLifeLinks", idx, "label", e.target.value)}
                      className="flex-1 h-7 px-2 text-xs font-bold bg-slate-50 border border-gray-200 rounded"
                    />
                    <input
                      type="text"
                      value={l.to}
                      onChange={(e) => handleUpdateFooterLink("campusLifeLinks", idx, "to", e.target.value)}
                      className="w-28 h-7 px-2 text-xs font-mono bg-slate-50 border border-gray-200 rounded"
                    />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveFooterLink("campusLifeLinks", idx, "up")}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === (footerForm.campusLifeLinks?.length || 0) - 1}
                      onClick={() => moveFooterLink("campusLifeLinks", idx, "down")}
                      className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    >
                      <ArrowDown size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFooterLink("campusLifeLinks", idx)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 6. SOCIAL MEDIA & CHANNELS                                 */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeSubTab === "socialLinks" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="pb-3 border-b border-gray-100">
            <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
              <Globe size={16} className="text-[#072A6C]" />
              Official Social Media Profiles & Channels
            </h3>
            <p className="text-xs text-gray-500">
              Provide official direct profile links for icons rendered across top header, footer, and sharing popups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                <InstagramIcon className="w-4 h-4 text-pink-600" />
                Instagram URL
              </label>
              <input
                type="text"
                value={siteSettingsForm.socialLinks?.instagram || ""}
                onChange={(e) =>
                  setSiteSettingsForm({
                    ...siteSettingsForm,
                    socialLinks: { ...siteSettingsForm.socialLinks, instagram: e.target.value }
                  })
                }
                placeholder="https://instagram.com/chalapathiuniversity"
                className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                <LinkedinIcon className="w-4 h-4 text-blue-700" />
                LinkedIn URL
              </label>
              <input
                type="text"
                value={siteSettingsForm.socialLinks?.linkedin || ""}
                onChange={(e) =>
                  setSiteSettingsForm({
                    ...siteSettingsForm,
                    socialLinks: { ...siteSettingsForm.socialLinks, linkedin: e.target.value }
                  })
                }
                placeholder="https://linkedin.com/school/chalapathiuniversity"
                className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                <FacebookIcon className="w-4 h-4 text-blue-600" />
                Facebook URL
              </label>
              <input
                type="text"
                value={siteSettingsForm.socialLinks?.facebook || ""}
                onChange={(e) =>
                  setSiteSettingsForm({
                    ...siteSettingsForm,
                    socialLinks: { ...siteSettingsForm.socialLinks, facebook: e.target.value }
                  })
                }
                placeholder="https://facebook.com/chalapathiuniv"
                className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                <TwitterIcon className="w-4 h-4 text-black" />
                X (Twitter) URL
              </label>
              <input
                type="text"
                value={siteSettingsForm.socialLinks?.twitter || ""}
                onChange={(e) =>
                  setSiteSettingsForm({
                    ...siteSettingsForm,
                    socialLinks: { ...siteSettingsForm.socialLinks, twitter: e.target.value }
                  })
                }
                placeholder="https://twitter.com/chalapathiuniv"
                className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg"
              />
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-red-600" />
                YouTube Official Channel URL
              </label>
              <input
                type="text"
                value={siteSettingsForm.socialLinks?.youtube || ""}
                onChange={(e) =>
                  setSiteSettingsForm({
                    ...siteSettingsForm,
                    socialLinks: { ...siteSettingsForm.socialLinks, youtube: e.target.value }
                  })
                }
                placeholder="https://youtube.com/@chalapathiuniversity"
                className="w-full h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* 7. UNIVERSAL ROUTE VALIDATOR (45+ PAGES)                   */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeSubTab === "routeTester" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Search size={16} className="text-[#072A6C]" />
                Universal Route & Link Directory ({ALL_SYSTEM_ROUTES.length} System Routes)
              </h3>
              <p className="text-xs text-gray-500">
                Click "Test Route" to verify any page in real-time, copy internal URLs, and ensure zero 404 broken links.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Filter routes..."
                value={routeSearch}
                onChange={(e) => setRouteSearch(e.target.value)}
                className="h-8 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium w-48"
              />
              <select
                value={routeFilter}
                onChange={(e) => setRouteFilter(e.target.value)}
                className="h-8 px-2.5 text-xs font-bold bg-slate-50 border border-gray-200 rounded-lg text-slate-800 cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Core">Core</option>
                <option value="About">About</option>
                <option value="Academics">Academics</option>
                <option value="Admissions">Admissions</option>
                <option value="Research">Research</option>
                <option value="Placements">Placements</option>
                <option value="Campus">Campus Life</option>
                <option value="Media">Media</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Page Name / Title</th>
                  <th className="p-3">Section</th>
                  <th className="p-3">Internal Path</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredRoutes.map((r, idx) => (
                  <tr key={r.path} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 text-gray-400 font-mono text-[10px]">{idx + 1}</td>
                    <td className="p-3 font-bold text-slate-800">{r.title}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-100">
                        {r.section}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600 text-[11px]">{r.path}</td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(r.path);
                          notify(`Copied path: ${r.path}`);
                        }}
                        className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md inline-flex items-center gap-1 cursor-pointer"
                        title="Copy Path"
                      >
                        <Copy size={11} />
                      </button>
                      <a
                        href={r.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-[#072A6C] hover:bg-[#051c4a] text-white rounded-md inline-flex items-center gap-1 text-[11px] font-bold"
                      >
                        <ExternalLink size={11} /> Test Route
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
