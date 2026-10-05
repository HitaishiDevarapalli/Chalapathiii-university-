import React, { useState, useMemo } from "react";
import { 
  Plus, Trash2, Edit3, Copy, Eye, EyeOff, Check, X, ArrowUp, ArrowDown, 
  Search, Filter, Sparkles, Layers, BookOpen, FileSpreadsheet, Users, 
  Image as ImageIcon, Newspaper, Calendar, MessageSquare, Save, Globe, 
  ExternalLink, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle, 
  Clock, RotateCcw, Sliders, Settings, MoveUp, MoveDown, Grid, Download, 
  Video, Send, Megaphone, Quote, Code, Cpu, Award, Trophy, Briefcase, 
  GraduationCap, Building, HelpCircle, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CmsPage, CmsSection, PageType, PageStatus, SectionType, 
  PAGE_TYPE_OPTIONS, SECTION_COMPONENT_DEFINITIONS, DynamicTableData, TableColumn, TableRow 
} from "../../types/cms";
import { useData } from "../../context/DataContext";
import { DynamicSectionRenderer } from "../common/DynamicSectionRenderer";
import { ImageField, ColorField } from "./AdminComponents";

export const PagesCMS: React.FC = () => {
  const { 
    cmsPages, 
    saveCmsPage, 
    deleteCmsPage, 
    duplicateCmsPage, 
    restorePageVersion,
    navigationMenu,
    updateNavigationMenu
  } = useData();

  // Selected page for full builder view (null = page manager table)
  const [activePageId, setActivePageId] = useState<string | null>(null);
  
  // Search & filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Notification feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Page Modal state
  const [isAddPageOpen, setIsAddPageOpen] = useState(false);
  const [newPageData, setNewPageData] = useState<{
    name: string;
    title: string;
    slug: string;
    type: PageType;
    shortDescription: string;
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
    status: PageStatus;
    showInNav: boolean;
    parentNav: string;
  }>({
    name: "",
    title: "",
    slug: "",
    type: "sections",
    shortDescription: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    status: "published",
    showInNav: false,
    parentNav: "Academics"
  });

  // Delete confirmation modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: "page" | "section" | "item" | "column" | "row";
    id: string;
    title: string;
    extraId?: string;
  }>({
    isOpen: false,
    type: "page",
    id: "",
    title: ""
  });

  // Section Add Modal state
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [sectionFilterCat, setSectionFilterCat] = useState<string>("All");

  // Live Preview Modal state
  const [previewModalPage, setPreviewModalPage] = useState<CmsPage | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Version History Drawer state
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);

  // SEO & Settings Drawer state
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);

  // Expanded section editor ID in builder
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);

  // Currently editing page object
  const activePage = useMemo(() => {
    return cmsPages.find(p => p.id === activePageId) || null;
  }, [cmsPages, activePageId]);

  // Filtered pages list
  const filteredPages = useMemo(() => {
    return cmsPages.filter(p => {
      const matchSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchType = typeFilter === "all" || p.type === typeFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [cmsPages, searchQuery, typeFilter, statusFilter]);

  // Auto-generate slug from name
  const handlePageNameChange = (name: string) => {
    const slugGen = "/" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setNewPageData(prev => ({
      ...prev,
      name,
      title: prev.title || name,
      slug: prev.slug || slugGen,
      seoTitle: prev.seoTitle || `${name} | Chalapathi University`
    }));
  };

  // Create Page Handler
  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageData.name.trim() || !newPageData.slug.trim()) {
      alert("Page Name and Slug are required.");
      return;
    }

    let finalSlug = newPageData.slug.trim();
    if (!finalSlug.startsWith("/")) finalSlug = "/" + finalSlug;

    // Check duplicate slug
    if (cmsPages.some(p => p.slug === finalSlug)) {
      alert(`A page with slug "${finalSlug}" already exists. Please choose a unique slug.`);
      return;
    }

    // Generate initial sections based on PageType
    const initialSections: CmsSection[] = [];
    
    // 1. Hero Section for all pages
    initialSections.push({
      id: `sec_hero_${Date.now()}`,
      type: "hero",
      title: newPageData.title || newPageData.name,
      subtitle: newPageData.shortDescription || "Welcome to Chalapathi University.",
      badge: newPageData.name.toUpperCase(),
      status: "published",
      order: 1,
      settings: { layout: "split", bgColor: "#072A6C", textColor: "#FFFFFF" }
    });

    if (newPageData.type === "sections") {
      initialSections.push({
        id: `sec_cards_${Date.now() + 1}`,
        type: "cards",
        title: "Key Highlights & Offerings",
        subtitle: "Explore our institutional advantages and features",
        status: "published",
        order: 2,
        settings: { columns: 3, layout: "grid" },
        items: [
          { id: "c1", title: "Cutting-Edge Infrastructure", description: "Modern AI labs, smart classrooms, and research facilities.", iconName: "Cpu", enabled: true, order: 1 },
          { id: "c2", title: "Global Certifications", description: "Industry-aligned curricula with AWS, Google, and Microsoft credentials.", iconName: "Award", enabled: true, order: 2 },
          { id: "c3", title: "Top Corporate Placements", description: "350+ recruiting partners offering high-tier career opportunities.", iconName: "Briefcase", enabled: true, order: 3 }
        ]
      });
    } else if (newPageData.type === "table") {
      initialSections.push({
        id: `sec_tbl_${Date.now() + 1}`,
        type: "table",
        title: "Data Table",
        subtitle: "Detailed schedule and structured information",
        status: "published",
        order: 2,
        table: {
          name: `${newPageData.name} Table`,
          columns: [
            { id: "col1", label: "Item / Course", type: "text" },
            { id: "col2", label: "Category", type: "badge" },
            { id: "col3", label: "Details", type: "text" },
            { id: "col4", label: "Link / Action", type: "link" }
          ],
          rows: [
            { id: "r1", enabled: true, order: 1, cells: { col1: "Sample Record 1", col2: "Undergraduate", col3: "4-Year Bachelor Degree", col4: "/admissions/apply" } },
            { id: "r2", enabled: true, order: 2, cells: { col1: "Sample Record 2", col2: "Postgraduate", col3: "2-Year Masters Degree", col4: "/admissions/apply" } }
          ]
        }
      });
    } else if (newPageData.type === "directory") {
      initialSections.push({
        id: `sec_dir_${Date.now() + 1}`,
        type: "faculty-directory",
        title: "Faculty & Staff Directory",
        subtitle: "Meet our experienced academic educators and research scholars",
        status: "published",
        order: 2,
        settings: { columns: 4, layout: "grid" }
      });
    } else if (newPageData.type === "faq") {
      initialSections.push({
        id: `sec_faq_${Date.now() + 1}`,
        type: "faq",
        title: "Frequently Asked Questions",
        subtitle: "Answers to common queries regarding admissions, programs, and campus facilities",
        status: "published",
        order: 2,
        items: [
          { id: "f1", title: "What are the eligibility requirements for admission?", description: "Candidates must have completed 10+2 with minimum 50% aggregate in relevant subjects.", enabled: true, order: 1 },
          { id: "f2", title: "Are merit scholarships available for students?", description: "Yes, merit scholarships covering up to 100% of tuition fees are awarded based on entrance exam ranks.", enabled: true, order: 2 },
          { id: "f3", title: "How do I apply online for upcoming sessions?", description: "You can apply directly through the online admission portal on our official website.", enabled: true, order: 3 }
        ]
      });
    } else if (newPageData.type === "gallery") {
      initialSections.push({
        id: `sec_gal_${Date.now() + 1}`,
        type: "gallery",
        title: "Campus Photo Gallery",
        subtitle: "Glimpses of vibrant life, academic complexes, and cultural events",
        status: "published",
        order: 2,
        items: [
          { id: "g1", title: "Academic Building & Quadrangle", image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=800&auto=format&fit=crop", enabled: true, order: 1 },
          { id: "g2", title: "Advanced Computing Research Laboratory", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop", enabled: true, order: 2 },
          { id: "g3", title: "Central Library & Digital Hub", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop", enabled: true, order: 3 }
        ]
      });
    } else {
      initialSections.push({
        id: `sec_txt_${Date.now() + 1}`,
        type: "rich-text",
        title: `About ${newPageData.name}`,
        subtitle: "Comprehensive overview and institutional information",
        content: "Chalapathi University provides multidisciplinary education fostering innovation, critical inquiry, and global leadership skills. Our cutting-edge curriculum is tailored to industry needs and technological advancements.",
        status: "published",
        order: 2
      });
    }

    const newPage: CmsPage = {
      id: `page_${Date.now()}`,
      slug: finalSlug,
      name: newPageData.name,
      title: newPageData.title || newPageData.name,
      type: newPageData.type,
      shortDescription: newPageData.shortDescription,
      seoTitle: newPageData.seoTitle,
      seoDescription: newPageData.seoDescription,
      seoKeywords: newPageData.seoKeywords,
      status: newPageData.status,
      displayOrder: cmsPages.length + 1,
      showInNav: newPageData.showInNav,
      parentNav: newPageData.parentNav,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: initialSections,
      versionHistory: [
        {
          id: `v_${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: "Admin",
          note: "Initial page creation",
          snapshot: { slug: finalSlug, name: newPageData.name }
        }
      ]
    };

    saveCmsPage(newPage, "Initial Page Creation");
    setIsAddPageOpen(false);
    setActivePageId(newPage.id);
    showToast(`✓ Page "${newPage.name}" created successfully!`);
  };

  // Section CRUD inside active page
  const handleAddSection = (sectionType: SectionType) => {
    if (!activePage) return;

    const def = SECTION_COMPONENT_DEFINITIONS.find(d => d.type === sectionType);
    const newOrder = (activePage.sections?.length || 0) + 1;
    
    let newSec: CmsSection = {
      id: `sec_${sectionType}_${Date.now()}`,
      type: sectionType,
      title: def?.label || "New Section",
      subtitle: def?.description || "",
      status: "published",
      order: newOrder,
      settings: { layout: "grid", columns: 3 }
    };

    if (sectionType === "hero") {
      newSec.settings = { layout: "split", bgColor: "#072A6C", textColor: "#FFFFFF" };
      newSec.badge = "ANNOUNCEMENT";
    } else if (sectionType === "table") {
      newSec.table = {
        name: "New Data Table",
        columns: [
          { id: "col1", label: "Column 1", type: "text" },
          { id: "col2", label: "Column 2", type: "badge" },
          { id: "col3", label: "Column 3", type: "text" }
        ],
        rows: [
          { id: "r1", enabled: true, order: 1, cells: { col1: "Row 1 Data", col2: "Active", col3: "Details" } },
          { id: "r2", enabled: true, order: 2, cells: { col1: "Row 2 Data", col2: "Pending", col3: "Details" } }
        ]
      };
    } else if (["cards", "statistics", "timeline", "accordion", "faq", "gallery", "downloads", "testimonials"].includes(sectionType)) {
      newSec.items = [
        { id: `itm_1`, title: "Item 1", description: "Description for item 1", enabled: true, order: 1, statNumber: "100+", statLabel: "Metric Label", iconName: "Sparkles" },
        { id: `itm_2`, title: "Item 2", description: "Description for item 2", enabled: true, order: 2, statNumber: "95%", statLabel: "Success Rate", iconName: "Award" },
        { id: `itm_3`, title: "Item 3", description: "Description for item 3", enabled: true, order: 3, statNumber: "350+", statLabel: "Partners", iconName: "Users" }
      ];
    } else if (sectionType === "cta") {
      newSec.settings = {
        bgColor: "#072A6C",
        buttonText: "Apply Online",
        buttonLink: "/admissions/apply",
        secondaryButtonText: "Contact Admissions",
        secondaryButtonLink: "/contact"
      };
    }

    const updatedSections = [...(activePage.sections || []), newSec];
    const updatedPage: CmsPage = {
      ...activePage,
      sections: updatedSections,
      updatedAt: new Date().toISOString()
    };

    saveCmsPage(updatedPage, `Added ${def?.label || sectionType} section`);
    setIsAddSectionOpen(false);
    setExpandedSectionId(newSec.id);
    showToast(`✓ Added section: ${def?.label || sectionType}`);
  };

  const handleUpdateSection = (updatedSec: CmsSection) => {
    if (!activePage) return;
    const updatedSections = (activePage.sections || []).map(s => s.id === updatedSec.id ? updatedSec : s);
    const updatedPage: CmsPage = {
      ...activePage,
      sections: updatedSections,
      updatedAt: new Date().toISOString()
    };
    saveCmsPage(updatedPage, `Updated section: ${updatedSec.title || updatedSec.type}`);
  };

  const handleDeleteSection = (secId: string) => {
    if (!activePage) return;
    const updatedSections = (activePage.sections || []).filter(s => s.id !== secId).map((s, idx) => ({ ...s, order: idx + 1 }));
    const updatedPage: CmsPage = {
      ...activePage,
      sections: updatedSections,
      updatedAt: new Date().toISOString()
    };
    saveCmsPage(updatedPage, "Deleted section");
    setDeleteConfirm({ isOpen: false, type: "section", id: "", title: "" });
    showToast("✓ Section deleted successfully");
  };

  const handleDuplicateSection = (sec: CmsSection) => {
    if (!activePage) return;
    const dupSec: CmsSection = {
      ...JSON.parse(JSON.stringify(sec)),
      id: `sec_${sec.type}_${Date.now()}`,
      title: `${sec.title || sec.type} (Copy)`,
      order: (activePage.sections?.length || 0) + 1
    };
    const updatedSections = [...(activePage.sections || []), dupSec];
    const updatedPage: CmsPage = {
      ...activePage,
      sections: updatedSections,
      updatedAt: new Date().toISOString()
    };
    saveCmsPage(updatedPage, `Duplicated section: ${sec.title || sec.type}`);
    showToast("✓ Section duplicated");
  };

  const handleMoveSection = (secId: string, direction: "up" | "down") => {
    if (!activePage || !activePage.sections) return;
    const idx = activePage.sections.findIndex(s => s.id === secId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === activePage.sections.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const newSections = [...activePage.sections];
    const temp = newSections[idx];
    newSections[idx] = newSections[targetIdx];
    newSections[targetIdx] = temp;

    const reordered = newSections.map((s, i) => ({ ...s, order: i + 1 }));
    const updatedPage: CmsPage = {
      ...activePage,
      sections: reordered,
      updatedAt: new Date().toISOString()
    };
    saveCmsPage(updatedPage, "Reordered sections");
  };

  // Repeated Item Manager inside section
  const handleAddItemToSection = (sectionId: string) => {
    if (!activePage) return;
    const sec = activePage.sections.find(s => s.id === sectionId);
    if (!sec) return;

    const currentItems = sec.items || [];
    const newItem = {
      id: `itm_${Date.now()}`,
      title: `New Item ${currentItems.length + 1}`,
      description: "Enter detailed content here.",
      enabled: true,
      order: currentItems.length + 1,
      statNumber: "0",
      statLabel: "Label",
      iconName: "Sparkles"
    };

    const updatedSec = { ...sec, items: [...currentItems, newItem] };
    handleUpdateSection(updatedSec);
  };

  // Table Column & Row handlers
  const handleAddTableColumn = (sectionId: string) => {
    if (!activePage) return;
    const sec = activePage.sections.find(s => s.id === sectionId);
    if (!sec || !sec.table) return;

    const colId = `col_${Date.now().toString().slice(-4)}`;
    const newCol: TableColumn = { id: colId, label: `Column ${sec.table.columns.length + 1}`, type: "text" };
    const updatedColumns = [...sec.table.columns, newCol];
    
    // Add empty cell in existing rows
    const updatedRows = (sec.table.rows || []).map(r => ({
      ...r,
      cells: { ...r.cells, [colId]: "" }
    }));

    const updatedTable: DynamicTableData = {
      ...sec.table,
      columns: updatedColumns,
      rows: updatedRows
    };

    handleUpdateSection({ ...sec, table: updatedTable });
  };

  const handleAddTableRow = (sectionId: string) => {
    if (!activePage) return;
    const sec = activePage.sections.find(s => s.id === sectionId);
    if (!sec || !sec.table) return;

    const initialCells: Record<string, string> = {};
    sec.table.columns.forEach(col => { initialCells[col.id] = ""; });

    const newRow: TableRow = {
      id: `r_${Date.now().toString().slice(-4)}`,
      enabled: true,
      order: (sec.table.rows?.length || 0) + 1,
      cells: initialCells
    };

    const updatedTable: DynamicTableData = {
      ...sec.table,
      rows: [...(sec.table.rows || []), newRow]
    };

    handleUpdateSection({ ...sec, table: updatedTable });
  };

  return (
    <div className="space-y-6 font-[var(--font-poppins)] select-none">
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

      {/* ======================================================== */}
      {/* VIEW 1: PAGE MANAGER LISTING TABLE                       */}
      {/* ======================================================== */}
      {!activePageId && (
        <div className="space-y-6">
          {/* Top Statistics & Actions Bar */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#072A6C] tracking-tight uppercase">
                Dynamic Page Manager
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Manage, build, and publish all institutional website pages from a single authoritative database.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAddPageOpen(true)}
                className="px-5 py-2.5 bg-[#072A6C] hover:bg-[#051c4a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Plus size={16} />
                + Add Page
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#072A6C] flex items-center justify-center font-bold">
                <Layers size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pages</span>
                <h4 className="text-lg font-black text-[#072A6C] leading-none mt-0.5">{cmsPages.length}</h4>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Published</span>
                <h4 className="text-lg font-black text-emerald-600 leading-none mt-0.5">
                  {cmsPages.filter(p => p.status === "published").length}
                </h4>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Clock size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drafts</span>
                <h4 className="text-lg font-black text-amber-600 leading-none mt-0.5">
                  {cmsPages.filter(p => p.status === "draft").length}
                </h4>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Globe size={18} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">In Main Nav</span>
                <h4 className="text-lg font-black text-purple-600 leading-none mt-0.5">
                  {cmsPages.filter(p => p.showInNav).length}
                </h4>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search page name, title, or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-xs font-semibold border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 bg-slate-50/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                <Filter size={13} />
                <span>Type:</span>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="h-9 px-2.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Page Types</option>
                  {PAGE_TYPE_OPTIONS.map(opt => (
                    <option key={opt.type} value={opt.type}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 px-2.5 text-xs font-semibold border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pages Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#072A6C]/5 text-[#072A6C] border-b border-gray-100">
                    <th className="py-3.5 px-4 font-black uppercase text-[10px] tracking-wider w-12 text-center">#</th>
                    <th className="py-3.5 px-4 font-black uppercase text-[10px] tracking-wider">Page Name & Title</th>
                    <th className="py-3.5 px-4 font-black uppercase text-[10px] tracking-wider">URL / Slug</th>
                    <th className="py-3.5 px-4 font-black uppercase text-[10px] tracking-wider">Page Type</th>
                    <th className="py-3.5 px-4 font-black uppercase text-[10px] tracking-wider">Sections</th>
                    <th className="py-3.5 px-4 font-black uppercase text-[10px] tracking-wider">Status</th>
                    <th className="py-3.5 px-4 font-black uppercase text-[10px] tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                        No pages match your filter criteria. Click <b>"+ Add Page"</b> to create a new one.
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((page, pIdx) => {
                      const typeObj = PAGE_TYPE_OPTIONS.find(t => t.type === page.type);
                      return (
                        <tr key={page.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="py-3.5 px-4 text-center font-bold text-gray-400">
                            {pIdx + 1}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-extrabold text-[#072A6C] text-sm group-hover:text-blue-600 transition-colors">
                                {page.name}
                              </span>
                              <span className="text-[10.5px] text-gray-400 font-medium truncate max-w-xs">
                                {page.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-gray-600">
                            <a 
                              href={page.slug} 
                              target="_blank" 
                              rel="noreferrer"
                              className="hover:text-blue-600 inline-flex items-center gap-1 hover:underline"
                            >
                              <span>{page.slug}</span>
                              <ExternalLink size={10} className="text-gray-400" />
                            </a>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                              {typeObj?.label || page.type}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-600">
                            {page.sections?.length || 0} sections
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              page.status === "published" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                              page.status === "draft" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                              "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}>
                              {page.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open Builder */}
                              <button
                                onClick={() => setActivePageId(page.id)}
                                className="px-3 py-1.5 bg-[#072A6C] hover:bg-[#051c4a] text-white rounded-lg text-[11px] font-bold shadow-sm flex items-center gap-1 transition-colors cursor-pointer"
                                title="Open Page Builder"
                              >
                                <Edit3 size={12} />
                                <span>Build</span>
                              </button>

                              {/* Preview */}
                              <button
                                onClick={() => setPreviewModalPage(page)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Live Preview"
                              >
                                <Eye size={14} />
                              </button>

                              {/* Duplicate */}
                              <button
                                onClick={() => {
                                  duplicateCmsPage(page.id);
                                  showToast(`✓ Duplicated page: ${page.name}`);
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                title="Duplicate Page"
                              >
                                <Copy size={14} />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => setDeleteConfirm({
                                  isOpen: true,
                                  type: "page",
                                  id: page.id,
                                  title: page.name
                                })}
                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                                title="Delete Page"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* VIEW 2: FULL SECTION-BASED PAGE BUILDER                  */}
      {/* ======================================================== */}
      {activePage && (
        <div className="space-y-6">
          {/* Builder Top Bar Header */}
          <div className="bg-[#072A6C] text-white rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActivePageId(null)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                ← Pages List
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight">{activePage.name}</h2>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    activePage.status === "published" ? "bg-emerald-500 text-white" : "bg-amber-400 text-slate-900"
                  }`}>
                    {activePage.status}
                  </span>
                </div>
                <span className="text-[11px] text-white/70 font-mono">{activePage.slug}</span>
              </div>
            </div>

            {/* Quick Builder Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsSettingsDrawerOpen(true)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings size={14} />
                <span>SEO & Nav</span>
              </button>

              <button
                onClick={() => setPreviewModalPage(activePage)}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye size={14} />
                <span>Preview</span>
              </button>

              <button
                onClick={() => {
                  const updated = { ...activePage, status: "draft" as PageStatus };
                  saveCmsPage(updated, "Saved as draft");
                  showToast("✓ Page saved as Draft");
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Save Draft
              </button>

              <button
                onClick={() => {
                  const updated = { ...activePage, status: "published" as PageStatus };
                  saveCmsPage(updated, "Published to live website");
                  showToast("✓ Page published live to database and public website!");
                }}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Publish Live</span>
              </button>
            </div>
          </div>

          {/* Sections List in Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-[#072A6C] tracking-wide">
                Page Sections ({(activePage.sections || []).length})
              </h3>
              <button
                onClick={() => setIsAddSectionOpen(true)}
                className="px-4 py-2 bg-[#072A6C] hover:bg-[#051c4a] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus size={15} />
                + Add Section
              </button>
            </div>

            {(activePage.sections || []).length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 space-y-4">
                <Sparkles size={40} className="mx-auto text-gray-300" />
                <h4 className="text-base font-extrabold text-[#072A6C]">This page has no sections yet</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Click the button below to add your first dynamic section (Hero, Rich Text, Cards, Table, Faculty Directory, etc.).
                </p>
                <button
                  onClick={() => setIsAddSectionOpen(true)}
                  className="px-5 py-2.5 bg-[#072A6C] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  + Add Section
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {(activePage.sections || []).map((sec, sIdx) => {
                  const isExpanded = expandedSectionId === sec.id;
                  const compDef = SECTION_COMPONENT_DEFINITIONS.find(d => d.type === sec.type);
                  return (
                    <div 
                      key={sec.id}
                      className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden transition-all duration-200"
                    >
                      {/* Section Card Header */}
                      <div className="p-4 bg-slate-50/70 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-[#072A6C] text-white flex items-center justify-center text-xs font-black">
                            {sIdx + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-[#072A6C] uppercase tracking-wider">
                                {compDef?.label || sec.type}
                              </span>
                              {sec.badge && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-[#072A6C]">
                                  {sec.badge}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase ${
                                sec.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-700"
                              }`}>
                                {sec.status}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-gray-600 truncate max-w-sm">
                              {sec.title || "Untitled Section"}
                            </h4>
                          </div>
                        </div>

                        {/* Section Controls */}
                        <div className="flex items-center gap-1.5">
                          {/* Move Up */}
                          <button
                            disabled={sIdx === 0}
                            onClick={() => handleMoveSection(sec.id, "up")}
                            className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-gray-200 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          {/* Move Down */}
                          <button
                            disabled={sIdx === (activePage.sections?.length || 0) - 1}
                            onClick={() => handleMoveSection(sec.id, "down")}
                            className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-gray-200 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicateSection(sec)}
                            className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-gray-200 cursor-pointer"
                            title="Duplicate Section"
                          >
                            <Copy size={13} />
                          </button>
                          {/* Toggle Expand */}
                          <button
                            onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                            className="px-3 py-1.5 bg-[#072A6C] hover:bg-[#051c4a] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit3 size={12} />
                            <span>{isExpanded ? "Close Edit" : "Edit Section"}</span>
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirm({
                              isOpen: true,
                              type: "section",
                              id: sec.id,
                              title: sec.title || sec.type
                            })}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-100 cursor-pointer"
                            title="Delete Section"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Section Editor Drawer / Form */}
                      {isExpanded && (
                        <div className="p-5 space-y-5 bg-white">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Section Title</label>
                              <input
                                type="text"
                                value={sec.title || ""}
                                onChange={(e) => handleUpdateSection({ ...sec, title: e.target.value })}
                                className="w-full h-9 px-3 text-xs font-bold text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Badge / Eyebrow Text</label>
                              <input
                                type="text"
                                value={sec.badge || ""}
                                onChange={(e) => handleUpdateSection({ ...sec, badge: e.target.value })}
                                className="w-full h-9 px-3 text-xs font-bold text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Status</label>
                              <select
                                value={sec.status}
                                onChange={(e) => handleUpdateSection({ ...sec, status: e.target.value as any })}
                                className="w-full h-9 px-3 text-xs font-bold text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                              >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="hidden">Hidden</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Subtitle / Short Summary</label>
                            <input
                              type="text"
                              value={sec.subtitle || ""}
                              onChange={(e) => handleUpdateSection({ ...sec, subtitle: e.target.value })}
                              className="w-full h-9 px-3 text-xs text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                            />
                          </div>

                          {/* Rich Text / Long Content Editor */}
                          {(sec.type === "rich-text" || sec.type === "person-profile" || sec.content) && (
                            <div className="space-y-1">
                              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Main Body Content / Text</label>
                              <textarea
                                rows={5}
                                value={sec.content || ""}
                                onChange={(e) => handleUpdateSection({ ...sec, content: e.target.value })}
                                className="w-full p-3 text-xs text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-normal leading-relaxed"
                              />
                            </div>
                          )}

                          {/* Media URL Editor */}
                          {(sec.type === "hero" || sec.type === "image" || sec.type === "image-text" || sec.type === "person-profile" || sec.media) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-gray-150">
                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Image / Media URL</label>
                                <input
                                  type="text"
                                  placeholder="https://..."
                                  value={sec.media?.url || ""}
                                  onChange={(e) => handleUpdateSection({
                                    ...sec,
                                    media: { ...sec.media, url: e.target.value }
                                  })}
                                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg bg-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Alt Text / Caption</label>
                                <input
                                  type="text"
                                  placeholder="Image description..."
                                  value={sec.media?.caption || sec.media?.alt || ""}
                                  onChange={(e) => handleUpdateSection({
                                    ...sec,
                                    media: { ...sec.media, caption: e.target.value, alt: e.target.value }
                                  })}
                                  className="w-full h-9 px-3 text-xs border border-gray-200 rounded-lg bg-white"
                                />
                              </div>
                            </div>
                          )}

                          {/* DYNAMIC REPEATED ITEMS BUILDER (Cards, Timeline, FAQ, Stats, Downloads, etc.) */}
                          {sec.items && (
                            <div className="space-y-3 pt-3 border-t border-gray-150">
                              <div className="flex items-center justify-between">
                                <h5 className="text-[11px] font-black uppercase text-[#072A6C] tracking-wider">
                                  Repeated Items ({sec.items.length})
                                </h5>
                                <button
                                  type="button"
                                  onClick={() => handleAddItemToSection(sec.id)}
                                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#072A6C] rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                >
                                  <Plus size={12} />
                                  + Add Item
                                </button>
                              </div>

                              <div className="space-y-2.5">
                                {sec.items.map((itm, iIdx) => (
                                  <div key={itm.id || iIdx} className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/50 space-y-2.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[10px] font-black text-gray-400">#{iIdx + 1}</span>
                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                                        <input
                                          type="text"
                                          placeholder="Item Title"
                                          value={itm.title}
                                          onChange={(e) => {
                                            const updated = [...sec.items!];
                                            updated[iIdx] = { ...updated[iIdx], title: e.target.value };
                                            handleUpdateSection({ ...sec, items: updated });
                                          }}
                                          className="h-8 px-2.5 text-xs font-bold border border-gray-200 rounded-lg bg-white"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Stat / Year / Subtitle"
                                          value={itm.statNumber || itm.year || itm.subtitle || ""}
                                          onChange={(e) => {
                                            const updated = [...sec.items!];
                                            updated[iIdx] = { 
                                              ...updated[iIdx], 
                                              statNumber: e.target.value,
                                              year: e.target.value,
                                              subtitle: e.target.value
                                            };
                                            handleUpdateSection({ ...sec, items: updated });
                                          }}
                                          className="h-8 px-2.5 text-xs border border-gray-200 rounded-lg bg-white"
                                        />
                                        <input
                                          type="text"
                                          placeholder="Icon Name (e.g. Award, Cpu, BookOpen)"
                                          value={itm.iconName || ""}
                                          onChange={(e) => {
                                            const updated = [...sec.items!];
                                            updated[iIdx] = { ...updated[iIdx], iconName: e.target.value };
                                            handleUpdateSection({ ...sec, items: updated });
                                          }}
                                          className="h-8 px-2.5 text-xs border border-gray-200 rounded-lg bg-white"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = sec.items!.filter((_, idx) => idx !== iIdx);
                                          handleUpdateSection({ ...sec, items: updated });
                                        }}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                        title="Delete Item"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                    <textarea
                                      rows={2}
                                      placeholder="Item description or details..."
                                      value={itm.description || ""}
                                      onChange={(e) => {
                                        const updated = [...sec.items!];
                                        updated[iIdx] = { ...updated[iIdx], description: e.target.value };
                                        handleUpdateSection({ ...sec, items: updated });
                                      }}
                                      className="w-full p-2 text-xs border border-gray-200 rounded-lg bg-white"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* DYNAMIC TABLE BUILDER (Add Column, Add Row, Edit Cells) */}
                          {sec.type === "table" && sec.table && (
                            <div className="space-y-4 pt-4 border-t border-gray-150">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                  <h5 className="text-[11px] font-black uppercase text-[#072A6C] tracking-wider">
                                    Dynamic Table Builder ({sec.table.columns.length} Columns, {sec.table.rows.length} Rows)
                                  </h5>
                                  <p className="text-[10px] text-gray-400">Add columns and rows dynamically. Public website automatically renders this table.</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleAddTableColumn(sec.id)}
                                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#072A6C] rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus size={12} />
                                    + Add Column
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAddTableRow(sec.id)}
                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus size={12} />
                                    + Add Row
                                  </button>
                                </div>
                              </div>

                              {/* Editable Columns Strip */}
                              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 rounded-xl border border-gray-200">
                                <span className="text-[10px] font-black text-gray-400 uppercase">Columns:</span>
                                {sec.table.columns.map((col, cIdx) => (
                                  <div key={col.id} className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-sm">
                                    <input
                                      type="text"
                                      value={col.label}
                                      onChange={(e) => {
                                        const updatedCols = [...sec.table!.columns];
                                        updatedCols[cIdx] = { ...updatedCols[cIdx], label: e.target.value };
                                        handleUpdateSection({ ...sec, table: { ...sec.table!, columns: updatedCols } });
                                      }}
                                      className="text-xs font-bold text-[#072A6C] w-28 focus:outline-none"
                                    />
                                    <select
                                      value={col.type || "text"}
                                      onChange={(e) => {
                                        const updatedCols = [...sec.table!.columns];
                                        updatedCols[cIdx] = { ...updatedCols[cIdx], type: e.target.value as any };
                                        handleUpdateSection({ ...sec, table: { ...sec.table!, columns: updatedCols } });
                                      }}
                                      className="text-[10px] text-gray-500 font-semibold bg-slate-50 rounded"
                                    >
                                      <option value="text">Text</option>
                                      <option value="badge">Badge</option>
                                      <option value="link">Link</option>
                                      <option value="number">Number</option>
                                    </select>
                                    {sec.table!.columns.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updatedCols = sec.table!.columns.filter((_, idx) => idx !== cIdx);
                                          handleUpdateSection({ ...sec, table: { ...sec.table!, columns: updatedCols } });
                                        }}
                                        className="text-gray-400 hover:text-red-500 ml-1"
                                      >
                                        <X size={12} />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Editable Rows Grid */}
                              <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-[#072A6C] text-white">
                                      <th className="p-2.5 w-10 text-center text-[10px] font-bold">#</th>
                                      {sec.table.columns.map(col => (
                                        <th key={col.id} className="p-2.5 font-bold uppercase text-[10px] border-r border-white/10 last:border-r-0">
                                          {col.label}
                                        </th>
                                      ))}
                                      <th className="p-2.5 w-12 text-center text-[10px] font-bold">Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 bg-white">
                                    {sec.table.rows.map((row, rIdx) => (
                                      <tr key={row.id || rIdx} className="hover:bg-slate-50">
                                        <td className="p-2.5 text-center font-bold text-gray-400">{rIdx + 1}</td>
                                        {sec.table!.columns.map(col => (
                                          <td key={col.id} className="p-2">
                                            <input
                                              type="text"
                                              value={row.cells[col.id] || ""}
                                              onChange={(e) => {
                                                const updatedRows = [...sec.table!.rows];
                                                updatedRows[rIdx] = {
                                                  ...updatedRows[rIdx],
                                                  cells: { ...updatedRows[rIdx].cells, [col.id]: e.target.value }
                                                };
                                                handleUpdateSection({ ...sec, table: { ...sec.table!, rows: updatedRows } });
                                              }}
                                              className="w-full h-8 px-2 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:border-blue-500"
                                            />
                                          </td>
                                        ))}
                                        <td className="p-2.5 text-center">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updatedRows = sec.table!.rows.filter((_, idx) => idx !== rIdx);
                                              handleUpdateSection({ ...sec, table: { ...sec.table!, rows: updatedRows } });
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete Row"
                                          >
                                            <Trash2 size={13} />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end pt-3 border-t border-gray-150">
                            <button
                              type="button"
                              onClick={() => {
                                setExpandedSectionId(null);
                                showToast("✓ Section changes updated");
                              }}
                              className="px-5 py-2 bg-[#072A6C] text-white text-xs font-bold rounded-xl shadow"
                            >
                              Done Editing Section
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD NEW PAGE                                      */}
      {/* ======================================================== */}
      {isAddPageOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsAddPageOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-150 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#072A6C] uppercase tracking-tight">Create New CMS Page</h3>
                <p className="text-xs text-gray-500">Configure page name, slug, type, and navigation structure.</p>
              </div>
              <button onClick={() => setIsAddPageOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase">Page Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI & Robotics Center"
                    value={newPageData.name}
                    onChange={(e) => handlePageNameChange(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-bold border border-gray-200 rounded-xl focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase">Page Slug / URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="/research/ai-robotics"
                    value={newPageData.slug}
                    onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
                    className="w-full h-10 px-3 text-xs font-mono font-bold border border-gray-200 rounded-xl focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Page Type Selection Grid */}
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Choose Page Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {PAGE_TYPE_OPTIONS.map((opt) => {
                    const isSelected = newPageData.type === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setNewPageData({ ...newPageData, type: opt.type })}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected ? "border-[#072A6C] bg-blue-50/60 ring-2 ring-[#072A6C]" : "border-gray-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-[10.5px] font-black text-[#072A6C] leading-tight">{opt.label}</span>
                        <span className="text-[8.5px] text-gray-400 mt-1 line-clamp-2">{opt.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Short Description</label>
                <input
                  type="text"
                  placeholder="Summary of this page's purpose..."
                  value={newPageData.shortDescription}
                  onChange={(e) => setNewPageData({ ...newPageData, shortDescription: e.target.value })}
                  className="w-full h-10 px-3 text-xs border border-gray-200 rounded-xl focus:border-blue-500"
                />
              </div>

              {/* Navigation Placement */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#072A6C]">Add to Website Navigation?</h5>
                    <p className="text-[10px] text-gray-400">Automatically add a link to the main university header menu</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={newPageData.showInNav}
                    onChange={(e) => setNewPageData({ ...newPageData, showInNav: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                </div>

                {newPageData.showInNav && (
                  <div className="space-y-1 pt-2 border-t border-gray-200">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase">Parent Menu</label>
                    <select
                      value={newPageData.parentNav}
                      onChange={(e) => setNewPageData({ ...newPageData, parentNav: e.target.value })}
                      className="w-full h-9 px-3 text-xs border border-gray-200 rounded-xl bg-white"
                    >
                      <option value="Academics">Academics</option>
                      <option value="About">About Us</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Research">Research</option>
                      <option value="Campus Life">Campus Life</option>
                      <option value="Placements">Placements</option>
                      <option value="Contact">Contact</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150">
                <button
                  type="button"
                  onClick={() => setIsAddPageOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow transition-colors cursor-pointer"
                >
                  Create & Build Page
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD SECTION PALETTE (23 Components)               */}
      {/* ======================================================== */}
      {isAddSectionOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsAddSectionOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-150 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#072A6C] uppercase tracking-tight">Add Dynamic Section</h3>
                <p className="text-xs text-gray-500">Choose from 23 production-ready components to insert into your page.</p>
              </div>
              <button onClick={() => setIsAddSectionOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {["All", "Basic", "Media & Layout", "Data & Tables", "People & Directories", "Interactive"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSectionFilterCat(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    sectionFilterCat === cat ? "bg-[#072A6C] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Components Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SECTION_COMPONENT_DEFINITIONS
                .filter(d => sectionFilterCat === "All" || d.category === sectionFilterCat)
                .map((comp) => (
                  <button
                    key={comp.type}
                    type="button"
                    onClick={() => handleAddSection(comp.type)}
                    className="p-4 rounded-2xl border border-gray-200 hover:border-[#072A6C] hover:bg-blue-50/40 transition-all text-left flex flex-col justify-between group shadow-sm hover:shadow cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-[#072A6C] group-hover:text-blue-700">
                          {comp.label}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase bg-slate-100 px-2 py-0.5 rounded">
                          {comp.category}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-gray-500 font-light leading-snug">
                        {comp.description}
                      </p>
                    </div>
                    <span className="mt-3 text-[10px] font-black uppercase tracking-wider text-[#072A6C] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      + Insert Component
                    </span>
                  </button>
                ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: LIVE INTERACTIVE PAGE PREVIEW                     */}
      {/* ======================================================== */}
      {previewModalPage && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex flex-col"
          onClick={() => setPreviewModalPage(null)}
        >
          {/* Preview Control Bar */}
          <div 
            className="bg-[#072A6C] text-white p-3.5 px-6 flex items-center justify-between border-b border-white/10 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#D4AF37] text-[#072A6C] uppercase">
                PREVIEW MODE
              </span>
              <h3 className="font-extrabold text-sm">{previewModalPage.title}</h3>
              <span className="text-xs font-mono text-white/60">{previewModalPage.slug}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1">
                <button
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${previewDevice === "desktop" ? "bg-white text-[#072A6C]" : "text-white"}`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewDevice("tablet")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${previewDevice === "tablet" ? "bg-white text-[#072A6C]" : "text-white"}`}
                >
                  Tablet
                </button>
                <button
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg ${previewDevice === "mobile" ? "bg-white text-[#072A6C]" : "text-white"}`}
                >
                  Mobile
                </button>
              </div>

              <button
                onClick={() => setPreviewModalPage(null)}
                className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Render Area */}
          <div 
            className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-900/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className={`bg-white shadow-2xl transition-all duration-300 overflow-y-auto rounded-2xl ${
                previewDevice === "desktop" ? "w-full max-w-7xl" :
                previewDevice === "tablet" ? "w-[768px]" :
                "w-[390px]"
              }`}
            >
              {(previewModalPage.sections || []).map((sec, idx) => (
                <DynamicSectionRenderer
                  key={sec.id || idx}
                  section={sec}
                  index={idx}
                  previewMode={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DRAWER: SEO & SETTINGS                                   */}
      {/* ======================================================== */}
      {isSettingsDrawerOpen && activePage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex justify-end"
          onClick={() => setIsSettingsDrawerOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-150 pb-4">
              <h3 className="font-extrabold text-[#072A6C] text-base uppercase">SEO & Page Settings</h3>
              <button onClick={() => setIsSettingsDrawerOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Page Name</label>
                <input
                  type="text"
                  value={activePage.name}
                  onChange={(e) => {
                    const updated = { ...activePage, name: e.target.value };
                    saveCmsPage(updated, "Updated page name");
                  }}
                  className="w-full h-10 px-3 text-xs font-bold border border-gray-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">Page URL Slug</label>
                <input
                  type="text"
                  value={activePage.slug}
                  onChange={(e) => {
                    const updated = { ...activePage, slug: e.target.value };
                    saveCmsPage(updated, "Updated page slug");
                  }}
                  className="w-full h-10 px-3 text-xs font-mono font-bold border border-gray-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">SEO Meta Title</label>
                <input
                  type="text"
                  value={activePage.seoTitle || ""}
                  onChange={(e) => {
                    const updated = { ...activePage, seoTitle: e.target.value };
                    saveCmsPage(updated, "Updated SEO title");
                  }}
                  className="w-full h-10 px-3 text-xs border border-gray-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">SEO Meta Description</label>
                <textarea
                  rows={3}
                  value={activePage.seoDescription || ""}
                  onChange={(e) => {
                    const updated = { ...activePage, seoDescription: e.target.value };
                    saveCmsPage(updated, "Updated SEO description");
                  }}
                  className="w-full p-3 text-xs border border-gray-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-500 uppercase">SEO Keywords</label>
                <input
                  type="text"
                  value={activePage.seoKeywords || ""}
                  onChange={(e) => {
                    const updated = { ...activePage, seoKeywords: e.target.value };
                    saveCmsPage(updated, "Updated SEO keywords");
                  }}
                  className="w-full h-10 px-3 text-xs border border-gray-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE CONFIRMATION DIALOG                        */}
      {/* ======================================================== */}
      {deleteConfirm.isOpen && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm({ isOpen: false, type: "page", id: "", title: "" })}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100 space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle size={24} />
              <h3 className="font-extrabold text-base text-[#072A6C]">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete <b>"{deleteConfirm.title}"</b>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, type: "page", id: "", title: "" })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === "page") {
                    deleteCmsPage(deleteConfirm.id);
                    setDeleteConfirm({ isOpen: false, type: "page", id: "", title: "" });
                    showToast("✓ Page deleted permanently");
                  } else if (deleteConfirm.type === "section") {
                    handleDeleteSection(deleteConfirm.id);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase rounded-xl transition-colors cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
