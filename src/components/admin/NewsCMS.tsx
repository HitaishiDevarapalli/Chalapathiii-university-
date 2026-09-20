import React, { useState } from "react";
import { 
  Newspaper, Plus, Trash2, Edit3, CheckCircle2, Search, 
  Sparkles, RotateCcw, Save, ArrowUp, ArrowDown, ExternalLink,
  Clock, MapPin, Eye, Tag, AlertCircle, X, Check, Image as ImageIcon,
  Bell, Flame, Layers, ChevronRight
} from "lucide-react";
import { 
  useData, 
  NewsArticle, 
  Announcement, 
  NewsPageConfig,
  DEFAULT_NEWS_PAGE_CONFIG, 
  INITIAL_NEWS, 
  INITIAL_ANNOUNCEMENTS 
} from "../../context/DataContext";
import { SectionHeader, ImageField } from "./AdminComponents";

export function NewsCMS({
  notifySave,
  saveSuccess
}: {
  notifySave: (msg?: string) => void;
  saveSuccess?: boolean;
}) {
  const { 
    news, 
    updateNews, 
    newsPageConfig, 
    updateNewsPageConfig,
    announcements, 
    updateAnnouncements,
    homepageSections,
    updateHomepageSections
  } = useData();

  const [newsSubTab, setNewsSubTab] = useState<"pageSettings" | "articlesList" | "announcements" | "homepage">("pageSettings");
  
  // Local state forms
  const [newsList, setNewsList] = useState<NewsArticle[]>(news);
  const [newsPageForm, setNewsPageForm] = useState<NewsPageConfig>(newsPageConfig || DEFAULT_NEWS_PAGE_CONFIG);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(announcements);

  // Search & Filters for articles
  const [articleSearch, setArticleSearch] = useState("");
  const [articleCategoryFilter, setArticleCategoryFilter] = useState("All");

  // Keep local state in sync
  React.useEffect(() => {
    setNewsList(news);
  }, [news]);

  React.useEffect(() => {
    if (newsPageConfig) setNewsPageForm(newsPageConfig);
  }, [newsPageConfig]);

  React.useEffect(() => {
    setAnnouncementsList(announcements);
  }, [announcements]);

  // Save Handlers
  const handleSaveAllNews = () => {
    updateNews(newsList);
    updateNewsPageConfig(newsPageForm);
    updateAnnouncements(announcementsList);
    notifySave("News, Hero Spotlight & Announcements published live!");
  };

  const handleResetAllNews = () => {
    setNewsList(INITIAL_NEWS);
    updateNews(INITIAL_NEWS);
    setNewsPageForm(DEFAULT_NEWS_PAGE_CONFIG);
    updateNewsPageConfig(DEFAULT_NEWS_PAGE_CONFIG);
    setAnnouncementsList(INITIAL_ANNOUNCEMENTS);
    updateAnnouncements(INITIAL_ANNOUNCEMENTS);
    notifySave("News reset to default data!");
  };

  // Categories list
  const categories = Array.from(new Set(newsList.map(n => n.category).filter(Boolean)));

  // Filtered Articles
  const filteredArticles = newsList.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
                        (n.excerpt || "").toLowerCase().includes(articleSearch.toLowerCase()) ||
                        n.category.toLowerCase().includes(articleSearch.toLowerCase());
    const matchCat = articleCategoryFilter === "All" || n.category === articleCategoryFilter;
    return matchSearch && matchCat;
  });

  // Add new article
  const handleAddNewArticle = () => {
    const newId = Date.now();
    const newArticle: NewsArticle = {
      id: newId,
      slug: `news-article-${newId}`,
      title: "New University Research & Innovation Breakthrough",
      category: "Research",
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      time: "10:30 AM",
      location: "Main Campus, Guntur",
      readTime: "3 min read",
      excerpt: "Highlights and academic milestones achieved by faculty and students at Chalapathi University.",
      bodyText: "Full article detailing key milestones, research initiatives, collaborative projects, and future vision.",
      image: "/prog_computer.png",
      images: ["/prog_computer.png", "/prog_engineering.png"],
      featured: false,
      sourceUrl: ""
    };
    const updated = [newArticle, ...newsList];
    setNewsList(updated);
    updateNews(updated);
    notifySave("New article created!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="News, Media & Announcements CMS"
        subtitle="Manage the news portal hero spotlight, carousel slides, university highlights, full articles directory, and side notices"
        icon={Newspaper}
        onSave={handleSaveAllNews}
        saveSuccess={saveSuccess}
        onReset={handleResetAllNews}
        resetLabel="Reset News"
      />

      {/* Subtabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "pageSettings", label: "🌟 1. News Intro, Hero Spotlight & Highlights" },
          { id: "articlesList", label: `📰 2. News Articles Directory & CRUD (${newsList.length})` },
          { id: "announcements", label: `📢 3. Announcements Drawer (${announcementsList.length})` },
          { id: "homepage", label: "🏠 4. Homepage News Slider & Feed" }
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setNewsSubTab(st.id as any)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              newsSubTab === st.id
                ? "bg-[#072A6C] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 1: NEWS INTRO & HERO SPOTLIGHT CMS                  */}
      {/* ────────────────────────────────────────────────────────── */}
      {newsSubTab === "pageSettings" && (
        <div className="space-y-6">
          {/* Header Banner Settings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500" />
                  News Portal Header & Banner Configuration
                </h3>
                <p className="text-xs text-gray-500">
                  Configure top banner title, subtitle, and badge on the <code>/news</code> portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateNewsPageConfig(newsPageForm);
                  notifySave("News page banner settings saved!");
                }}
                className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save size={13} /> Save Banner
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Page Top Header Title</label>
                <input
                  type="text"
                  value={newsPageForm.headerTitle || ""}
                  onChange={(e) => setNewsPageForm({ ...newsPageForm, headerTitle: e.target.value })}
                  placeholder="e.g. News @ City Chalapathi"
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Header Subtitle</label>
                <input
                  type="text"
                  value={newsPageForm.headerSubtitle || ""}
                  onChange={(e) => setNewsPageForm({ ...newsPageForm, headerSubtitle: e.target.value })}
                  placeholder="e.g. Official news, research breakthroughs, campus achievements..."
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Featured Article Spotlight Card & Carousel Slider */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Flame size={16} className="text-orange-500" />
                  Hero Featured News Spotlight & Image Carousel
                </h3>
                <p className="text-xs text-gray-500">
                  Select which article is showcased in the primary hero spot, and configure its multi-slide image carousel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const currentImgs = newsPageForm.featuredCarouselImages || [];
                  setNewsPageForm({
                    ...newsPageForm,
                    featuredCarouselImages: [...currentImgs, "/prog_computer.png"]
                  });
                }}
                className="h-8 px-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus size={13} /> Add Carousel Slide
              </button>
            </div>

            {/* Featured Article Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Select Primary Featured Article</label>
              <select
                value={newsPageForm.featuredArticleId || newsList[0]?.id}
                onChange={(e) => setNewsPageForm({ ...newsPageForm, featuredArticleId: Number(e.target.value) })}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
              >
                {newsList.map((n) => (
                  <option key={n.id} value={n.id}>
                    #{n.id} - {n.title} ({n.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Multi-Slide Carousel Images */}
            <div className="pt-3 space-y-3">
              <h5 className="text-[11px] font-bold text-gray-600 uppercase">
                Featured Hero Carousel Slides ({(newsPageForm.featuredCarouselImages || []).length} Slides)
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(newsPageForm.featuredCarouselImages || [
                  "/prog_computer.png",
                  "/prog_engineering.png",
                  "/prog_management.png",
                  "/prog_pharmacy.png"
                ]).map((imgUrl, sIdx) => (
                  <div key={sIdx} className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400">Slide #{sIdx + 1}</span>
                      {(newsPageForm.featuredCarouselImages?.length || 1) > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const currentImgs = newsPageForm.featuredCarouselImages || [];
                            const filtered = currentImgs.filter((_, i) => i !== sIdx);
                            setNewsPageForm({ ...newsPageForm, featuredCarouselImages: filtered });
                          }}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer"
                        >
                          <Trash2 size={11} /> Remove
                        </button>
                      )}
                    </div>
                    <ImageField
                      label="Hero Slide Photo"
                      value={imgUrl}
                      defaultValue="/prog_computer.png"
                      onChange={(val) => {
                        const currentImgs = [...(newsPageForm.featuredCarouselImages || ["/prog_computer.png"])];
                        currentImgs[sIdx] = val;
                        setNewsPageForm({ ...newsPageForm, featuredCarouselImages: currentImgs });
                      }}
                      onReset={() => {
                        const currentImgs = [...(newsPageForm.featuredCarouselImages || ["/prog_computer.png"])];
                        currentImgs[sIdx] = "/prog_computer.png";
                        setNewsPageForm({ ...newsPageForm, featuredCarouselImages: currentImgs });
                      }}
                      aspectRatio="video"
                      recommendedSize="1200 × 700 px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* University Highlights 01-05 Manager */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Layers size={16} className="text-[#072A6C]" />
                University Highlights 01–05 Ranking Sidebar
              </h3>
              <p className="text-xs text-gray-500">
                The top 5 articles in the news articles list automatically power the numbered ranking list (01 to 05) on the news homepage sidebar.
              </p>
            </div>

            <div className="space-y-2">
              {newsList.slice(0, 5).map((art, idx) => (
                <div key={art.id} className="p-3.5 bg-slate-50 rounded-xl border border-gray-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-[#D4AF37] font-mono">0{idx + 1}</span>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{art.title}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{art.date} • {art.category}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-[#072A6C] border border-gray-200 px-2.5 py-1 rounded-md">
                    Top Highlight #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 2: NEWS ARTICLES DIRECTORY & CRUD                   */}
      {/* ────────────────────────────────────────────────────────── */}
      {newsSubTab === "articlesList" && (
        <div className="space-y-5">
          {/* Top Bar with Actions & Search */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Newspaper size={16} className="text-[#072A6C]" />
                News Articles Directory ({newsList.length} Published)
              </h3>
              <p className="text-xs text-gray-500">
                Create and edit news stories, multi-photo sliders, categories, read times, external source links, and featured flags.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleAddNewArticle}
                className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Plus size={13} /> Add News Article
              </button>
              <button
                type="button"
                onClick={handleSaveAllNews}
                className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Save size={13} /> Save Articles
              </button>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title, category, or keywords..."
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-gray-200 rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Category:</span>
              <select
                value={articleCategoryFilter}
                onChange={(e) => setArticleCategoryFilter(e.target.value)}
                className="h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-700"
              >
                <option value="All">All Categories</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Articles List */}
          <div className="space-y-6">
            {filteredArticles.map((article) => {
              const idx = newsList.findIndex(n => n.id === article.id);

              return (
                <div key={article.id} className="p-5 rounded-2xl border border-gray-200 bg-white shadow-xs space-y-4">
                  {/* Card Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#072A6C] text-white text-xs font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-black text-[#072A6C]">{article.title || "Untitled Article"}</span>
                      <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-200">
                        {article.category || "General"}
                      </span>
                      {article.featured && (
                        <span className="text-[10px] font-bold uppercase bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Flame size={11} /> Featured
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => {
                          if (idx === 0) return;
                          const updated = [...newsList];
                          const temp = updated[idx];
                          updated[idx] = updated[idx - 1];
                          updated[idx - 1] = temp;
                          setNewsList(updated);
                          updateNews(updated);
                        }}
                        className="p-1.5 bg-slate-50 hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        disabled={idx === newsList.length - 1}
                        onClick={() => {
                          if (idx === newsList.length - 1) return;
                          const updated = [...newsList];
                          const temp = updated[idx];
                          updated[idx] = updated[idx + 1];
                          updated[idx + 1] = temp;
                          setNewsList(updated);
                          updateNews(updated);
                        }}
                        className="p-1.5 bg-slate-50 hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete article "${article.title}"?`)) {
                            const updated = newsList.filter((n) => n.id !== article.id);
                            setNewsList(updated);
                            updateNews(updated);
                            notifySave("Article deleted.");
                          }
                        }}
                        className="h-7 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-md flex items-center gap-1 cursor-pointer ml-2"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Title, Category & Read Time */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Article Headline Title</label>
                      <input
                        type="text"
                        value={article.title}
                        onChange={(e) => {
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setNewsList(updated);
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Category</label>
                      <input
                        type="text"
                        value={article.category}
                        onChange={(e) => {
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], category: e.target.value };
                          setNewsList(updated);
                        }}
                        placeholder="e.g. Technology, AI, Placement"
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-semibold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Read Time</label>
                      <input
                        type="text"
                        value={article.readTime || "4 min read"}
                        onChange={(e) => {
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], readTime: e.target.value };
                          setNewsList(updated);
                        }}
                        placeholder="e.g. 3 min read"
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Slug, Date, External Source URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">URL Slug</label>
                      <input
                        type="text"
                        value={article.slug || `article-${article.id}`}
                        onChange={(e) => {
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], slug: e.target.value };
                          setNewsList(updated);
                        }}
                        placeholder="e.g. ai-research-lab"
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Publish Date</label>
                      <input
                        type="text"
                        value={article.date}
                        onChange={(e) => {
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], date: e.target.value };
                          setNewsList(updated);
                        }}
                        placeholder="e.g. 19 Sep 2026"
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">External Source Link (Optional)</label>
                      <input
                        type="text"
                        value={article.sourceUrl || ""}
                        onChange={(e) => {
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], sourceUrl: e.target.value };
                          setNewsList(updated);
                        }}
                        placeholder="e.g. https://timesofindia.indiatimes.com/..."
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Short Summary Excerpt (Shown on cards)</label>
                    <input
                      type="text"
                      value={article.excerpt}
                      onChange={(e) => {
                        const updated = [...newsList];
                        updated[idx] = { ...updated[idx], excerpt: e.target.value };
                        setNewsList(updated);
                      }}
                      placeholder="Brief 1-2 line summary..."
                      className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-800"
                    />
                  </div>

                  {/* Body Story */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Full News Body Story</label>
                    <textarea
                      rows={3}
                      value={article.bodyText}
                      onChange={(e) => {
                        const updated = [...newsList];
                        updated[idx] = { ...updated[idx], bodyText: e.target.value };
                        setNewsList(updated);
                      }}
                      placeholder="Detailed news article body text..."
                      className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg leading-relaxed text-slate-800"
                    />
                  </div>

                  {/* Primary Cover Image */}
                  <ImageField
                    label="Primary Cover Photo"
                    value={article.image || "/prog_computer.png"}
                    defaultValue="/prog_computer.png"
                    onChange={(val) => {
                      const updated = [...newsList];
                      updated[idx] = { ...updated[idx], image: val };
                      setNewsList(updated);
                    }}
                    onReset={() => {
                      const updated = [...newsList];
                      updated[idx] = { ...updated[idx], image: "/prog_computer.png" };
                      setNewsList(updated);
                    }}
                    aspectRatio="video"
                  />

                  {/* Multi-Slide Gallery Images Slider (for News Details page) */}
                  <div className="p-4 rounded-xl border border-blue-200/70 bg-blue-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-black text-blue-950 uppercase tracking-wide">
                          Article Multi-Image Gallery Slider ({article.images?.length || (article.image ? 1 : 0)} Slides)
                        </h5>
                        <p className="text-[11px] text-blue-900/80">
                          Multi-slide carousel shown inside the news detail page with left/right arrows & dot indicators.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentImgs = article.images && article.images.length > 0 ? [...article.images] : [article.image || "/prog_computer.png"];
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], images: [...currentImgs, "/prog_computer.png"] };
                          setNewsList(updated);
                        }}
                        className="h-7 px-2.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Plus size={12} /> Add Article Slide
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {(article.images && article.images.length > 0 ? article.images : [article.image || "/prog_computer.png"]).map((imgUrl, sIdx) => (
                        <div key={sIdx} className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400">Slide #{sIdx + 1}</span>
                            {(article.images?.length || 1) > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const currentImgs = article.images && article.images.length > 0 ? [...article.images] : [article.image || "/prog_computer.png"];
                                  const filtered = currentImgs.filter((_, i) => i !== sIdx);
                                  const updated = [...newsList];
                                  updated[idx] = { ...updated[idx], images: filtered };
                                  setNewsList(updated);
                                }}
                                className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer"
                              >
                                <Trash2 size={11} /> Remove
                              </button>
                            )}
                          </div>
                          <ImageField
                            label="Article Slide Photo"
                            value={imgUrl}
                            defaultValue="/prog_computer.png"
                            onChange={(val) => {
                              const currentImgs = article.images && article.images.length > 0 ? [...article.images] : [article.image || "/prog_computer.png"];
                              currentImgs[sIdx] = val;
                              const updated = [...newsList];
                              updated[idx] = { ...updated[idx], images: currentImgs };
                              setNewsList(updated);
                            }}
                            onReset={() => {
                              const currentImgs = article.images && article.images.length > 0 ? [...article.images] : [article.image || "/prog_computer.png"];
                              currentImgs[sIdx] = "/prog_computer.png";
                              const updated = [...newsList];
                              updated[idx] = { ...updated[idx], images: currentImgs };
                              setNewsList(updated);
                            }}
                            aspectRatio="video"
                            recommendedSize="1200 × 700 px"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!article.featured}
                        onChange={(e) => {
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], featured: e.target.checked };
                          setNewsList(updated);
                        }}
                        className="w-4 h-4 rounded text-[#072A6C] focus:ring-[#072A6C]"
                      />
                      <span className="text-xs font-bold text-gray-700">Display in Featured Hero / Top Spotlight</span>
                    </label>

                    <a
                      href={`/news/${article.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#072A6C] hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Preview Live Page</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 3: ANNOUNCEMENTS DRAWER CMS                         */}
      {/* ────────────────────────────────────────────────────────── */}
      {newsSubTab === "announcements" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Bell size={16} className="text-[#072A6C]" />
                Announcements Drawer Management ({announcementsList.length} Notices)
              </h3>
              <p className="text-xs text-gray-500">
                Manage notices and campus alerts displayed in the sliding announcements side drawer.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newAnn: Announcement = {
                    title: "New Academic Notification",
                    desc: "Details and instructions regarding this notification.",
                    date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
                    iconName: "GraduationCap"
                  };
                  const updated = [newAnn, ...announcementsList];
                  setAnnouncementsList(updated);
                  updateAnnouncements(updated);
                  notifySave("Added announcement!");
                }}
                className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus size={13} /> Add Announcement
              </button>
              <button
                type="button"
                onClick={() => {
                  updateAnnouncements(announcementsList);
                  notifySave("Announcements updated!");
                }}
                className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save size={13} /> Save Announcements
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {announcementsList.map((ann, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-[#072A6C] uppercase">Notice #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = announcementsList.filter((_, i) => i !== idx);
                      setAnnouncementsList(updated);
                      updateAnnouncements(updated);
                      notifySave("Announcement removed.");
                    }}
                    className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
                <input
                  type="text"
                  value={ann.title}
                  onChange={(e) => {
                    const updated = [...announcementsList];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    setAnnouncementsList(updated);
                  }}
                  placeholder="Notice Title"
                  className="w-full h-8 px-2.5 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded-lg"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ann.date}
                    onChange={(e) => {
                      const updated = [...announcementsList];
                      updated[idx] = { ...updated[idx], date: e.target.value };
                      setAnnouncementsList(updated);
                    }}
                    placeholder="Date (e.g. 19 Sep 2026)"
                    className="w-1/2 h-7 px-2 text-[11px] bg-white border border-gray-200 rounded"
                  />
                  <input
                    type="text"
                    value={ann.iconName || "GraduationCap"}
                    onChange={(e) => {
                      const updated = [...announcementsList];
                      updated[idx] = { ...updated[idx], iconName: e.target.value };
                      setAnnouncementsList(updated);
                    }}
                    placeholder="Icon Name (e.g. Bell, Award)"
                    className="w-1/2 h-7 px-2 text-[11px] bg-white border border-gray-200 rounded"
                  />
                </div>
                <textarea
                  rows={2}
                  value={ann.desc}
                  onChange={(e) => {
                    const updated = [...announcementsList];
                    updated[idx] = { ...updated[idx], desc: e.target.value };
                    setAnnouncementsList(updated);
                  }}
                  placeholder="Notice description..."
                  className="w-full p-2 text-[11px] bg-white border border-gray-200 rounded-lg leading-relaxed text-slate-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 4: HOMEPAGE NEWS SLIDER & EVENTS FEED               */}
      {/* ────────────────────────────────────────────────────────── */}
      {newsSubTab === "homepage" && (
        <div className="space-y-6 text-left">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300">
                  Homepage Section Sync
                </span>
                <span className="text-xs text-gray-400 font-mono">Live on Home Page</span>
              </div>
              <h3 className="text-base font-black text-[#072A6C] uppercase">
                🏠 Homepage News & Events Section Sync
              </h3>
              <p className="text-xs text-gray-500">
                Directly configure what appears in the <strong>News & Events</strong> section on the homepage, including the main headline, subtitle, and featured articles in the carousel.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  updateNews(newsList);
                  notifySave("Homepage News carousel and featured headlines saved live!");
                }}
                className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save size={13} /> Save Homepage News
              </button>
            </div>
          </div>

          {/* Section Heading & Subtitle */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Newspaper size={14} className="text-[#072A6C]" />
                  1. Homepage Section Header & Subtitle
                </h4>
                <p className="text-[11px] text-gray-500">The headline text that introduces the news and events grid on the homepage</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Section Main Heading</label>
                <input
                  type="text"
                  value={
                    (homepageSections || []).find((s) => s.id === "newsEvents")?.title ||
                    "News & Events"
                  }
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const updated = (homepageSections || []).map((s) =>
                      s.id === "newsEvents" ? { ...s, title: newTitle } : s
                    );
                    updateHomepageSections(updated);
                  }}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Button CTA Text</label>
                <input
                  type="text"
                  value={
                    (homepageSections || []).find((s) => s.id === "newsEvents")?.buttonText ||
                    "View All News & Events"
                  }
                  onChange={(e) => {
                    const newBtn = e.target.value;
                    const updated = (homepageSections || []).map((s) =>
                      s.id === "newsEvents" ? { ...s, buttonText: newBtn } : s
                    );
                    updateHomepageSections(updated);
                  }}
                  className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Section Subtitle / Description</label>
              <textarea
                rows={2}
                value={
                  (homepageSections || []).find((s) => s.id === "newsEvents")?.subtitle ||
                  "Stay Informed. Stay Ahead. Discover the latest updates and exciting events happening at Chalapathi."
                }
                onChange={(e) => {
                  const newSubtitle = e.target.value;
                  const updated = (homepageSections || []).map((s) =>
                    s.id === "newsEvents" ? { ...s, subtitle: newSubtitle } : s
                  );
                  updateHomepageSections(updated);
                }}
                className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-700 leading-relaxed"
              />
            </div>
          </div>

          {/* Featured Articles on Homepage Carousel */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Flame size={14} className="text-amber-500" />
                  2. Select Featured Articles for Homepage Carousel
                </h4>
                <p className="text-[11px] text-gray-500">Toggle "Featured" on any article to include it in the auto-rotating homepage news carousel</p>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                {newsList.filter((n) => n.featured).length} Featured
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {newsList.map((art) => (
                <div
                  key={art.id}
                  className={`p-4 rounded-xl border transition-all ${
                    art.featured
                      ? "bg-amber-50/40 border-amber-300 shadow-xs ring-1 ring-amber-300"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-[#072A6C] bg-blue-50 px-2 py-0.5 rounded">
                      {art.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = newsList.map((n) =>
                          n.id === art.id ? { ...n, featured: !n.featured } : n
                        );
                        setNewsList(updated);
                        updateNews(updated);
                        notifySave(`Toggled featured status for "${art.title}"`);
                      }}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                        art.featured
                          ? "bg-amber-500 text-white border-amber-600"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {art.featured ? "⭐ Featured" : "+ Feature"}
                    </button>
                  </div>

                  <h5 className="text-xs font-bold text-gray-900 line-clamp-2 mb-1">{art.title}</h5>
                  <p className="text-[10px] text-gray-500 line-clamp-2">{art.excerpt || art.bodyText}</p>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2.5 pt-2 border-t border-gray-100">
                    <span>{art.date}</span>
                    <span>{art.readTime || "3 min read"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default NewsCMS;
