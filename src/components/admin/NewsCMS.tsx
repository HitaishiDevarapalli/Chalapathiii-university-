import React, { useState } from "react";
import { 
  Newspaper, Plus, Trash2, Edit3, CheckCircle2, Search, 
  Sparkles, RotateCcw, Save, ArrowUp, ArrowDown, ExternalLink,
  Clock, MapPin, Eye, EyeOff, Tag, AlertCircle, X, Check, Image as ImageIcon,
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
import { SectionHeader, ImageField, PageVisibilityBanner } from "./AdminComponents";

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
    updateHomepageSections,
    siteSettings,
    updateSiteSettings
  } = useData();

  const [newsSubTab, setNewsSubTab] = useState<"articlesList" | "homepage" | "pageSettings" | "announcements">("articlesList");
  
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
  const handleSaveAllNews = async () => {
    try {
    await updateNews(newsList);
    await updateNewsPageConfig(newsPageForm);
    updateAnnouncements(announcementsList);
    notifySave("News, Hero Spotlight & Announcements published live!");
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  };

  const handleResetAllNews = async () => {
    try {
    setNewsList(INITIAL_NEWS);
    await updateNews(INITIAL_NEWS);
    setNewsPageForm(DEFAULT_NEWS_PAGE_CONFIG);
    await updateNewsPageConfig(DEFAULT_NEWS_PAGE_CONFIG);
    setAnnouncementsList(INITIAL_ANNOUNCEMENTS);
    updateAnnouncements(INITIAL_ANNOUNCEMENTS);
    notifySave("News reset to default data!");
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
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
  const handleAddNewArticle = async () => {
    try {
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
      image: "",
      images: [],
      featured: false,
      sourceUrl: ""
    };
    const updated = [newArticle, ...newsList];
    setNewsList(updated);
    await updateNews(updated);
    notifySave("New article created! Upload your photos and edit details below.");
  
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  };

  // Clear all articles handler
  const handleClearAllArticles = async () => {
    try {
    if (window.confirm("Are you sure you want to delete ALL news articles? This will clear all news from the website and admin panel.")) {
      setNewsList([]);
      await updateNews([]);
      notifySave("All news articles cleared live!");
    }
  
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  };

  const recoverBrowserContent = async () => {
    try {
      const cached = JSON.parse(localStorage.getItem("chalapathi_news_v4") || "[]");
      if (!Array.isArray(cached) || !cached.length) throw new Error("No saved articles found in this browser.");
      const currentSlugs = new Set(newsList.map(item => item.slug));
      const recovered = cached.filter(item => !currentSlugs.has(item.slug)).map((item, index) => ({ ...item, id: Date.now() + index }));
      await updateNews([...newsList, ...recovered]);
      notifySave("Recovered content is now saved on the shared server.");
    } catch (error: any) { alert(error.message || "Recovery failed. Please retry."); }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {localStorage.getItem("chalapathi_news_v4") && (
        <button type="button" onClick={recoverBrowserContent} className="px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 text-slate-700">
          Recover articles saved in this browser
        </button>
      )}

      <SectionHeader
        title="News, Media & Announcements CMS"
        subtitle="Manage the news portal hero spotlight, carousel slides, university highlights, full articles directory, and side notices"
        icon={Newspaper}
        onSave={handleSaveAllNews}
        saveSuccess={saveSuccess}
        onReset={handleResetAllNews}
        resetLabel="Reset News"
      />

      <PageVisibilityBanner
        pageName="News & Articles Portal"
        routePath="/news"
        isHidden={Boolean(siteSettings.hiddenPages?.["/news"])}
        onToggle={() => {
          const nextHidden = !siteSettings.hiddenPages?.["/news"];
          updateSiteSettings({
            ...siteSettings,
            hiddenPages: {
              ...(siteSettings.hiddenPages || {}),
              "/news": nextHidden
            }
          });
          notifySave(nextHidden ? "News page hidden from visitors" : "News page published & visible");
        }}
      />

      {/* Subtabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "articlesList", label: `1. News Articles Directory & Editor (${newsList.length})` },
          { id: "homepage", label: "2. Homepage News & Events Live Feed" },
          { id: "pageSettings", label: "3. News Portal Header & Hero Spotlight" },
          { id: "announcements", label: `4. Announcements & Notices Drawer (${announcementsList.length})` }
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
                onClick={async () => {
    try {
                  await updateNewsPageConfig(newsPageForm);
                  notifySave("News page banner settings saved!");
                
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
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
                    featuredCarouselImages: [...currentImgs, ""]
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
                value={newsPageForm.featuredArticleId || newsList[0]?.id || ""}
                onChange={async (e) => {
    try {
                  const newId = Number(e.target.value);
                  const updatedForm = { ...newsPageForm, featuredArticleId: newId };
                  setNewsPageForm(updatedForm);
                  await updateNewsPageConfig(updatedForm);
                  notifySave("Primary featured article updated live!");
                
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  }}
                className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
              >
                {newsList.length === 0 ? (
                  <option value="">No articles available - Add an article in Tab 1 first</option>
                ) : (
                  newsList.map((n) => (
                    <option key={n.id} value={n.id}>
                      #{n.id} - {n.title} ({n.category})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Multi-Slide Carousel Images */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-[11px] font-black text-gray-700 uppercase tracking-wide">
                    Featured Hero Carousel Slides ({(newsPageForm.featuredCarouselImages || []).length} Slides)
                  </h5>
                  <p className="text-[11px] text-gray-400">
                    Slides displayed in the rotating top hero carousel on the /news portal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const currentImgs = newsPageForm.featuredCarouselImages || [];
                    setNewsPageForm({
                      ...newsPageForm,
                      featuredCarouselImages: [...currentImgs, ""]
                    });
                  }}
                  className="h-7 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Plus size={12} /> Add Hero Slide
                </button>
              </div>

              {(!newsPageForm.featuredCarouselImages || newsPageForm.featuredCarouselImages.length === 0) ? (
                <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-xl bg-slate-50/50">
                  <p className="text-xs font-bold text-gray-500">No Hero Carousel Slides Added</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Click "+ Add Hero Slide" above to upload banner photos for the news portal header.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {(newsPageForm.featuredCarouselImages || []).map((imgUrl, sIdx) => {
                    const isSlideHidden = ((newsPageForm as any).hiddenCarouselSlides || []).includes(sIdx);
                    return (
                      <div 
                        key={sIdx} 
                        className={`p-3 rounded-xl border space-y-2 transition-all ${
                          isSlideHidden 
                            ? "bg-amber-50/30 border-dashed border-amber-300 opacity-70" 
                            : "bg-slate-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-gray-500">Slide #{sIdx + 1}</span>
                            {isSlideHidden && (
                              <span className="px-1.5 py-0.2 text-[8px] font-black bg-amber-100 text-amber-800 rounded uppercase">
                                Hidden
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={async () => {
    try {
                                const currentHidden: number[] = (newsPageForm as any).hiddenCarouselSlides || [];
                                const updatedHidden = currentHidden.includes(sIdx)
                                  ? currentHidden.filter((i: number) => i !== sIdx)
                                  : [...currentHidden, sIdx];
                                const updatedForm = { ...newsPageForm, hiddenCarouselSlides: updatedHidden };
                                setNewsPageForm(updatedForm);
                                await updateNewsPageConfig(updatedForm);
                              
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  }}
                              className="text-[10px] text-gray-500 hover:text-[#072A6C] font-bold flex items-center gap-0.5 cursor-pointer"
                            >
                              {isSlideHidden ? <><EyeOff size={11} className="text-amber-600" /> Hidden</> : <><Eye size={11} /> Hide</>}
                            </button>
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
                          </div>
                        </div>
                        <ImageField
                          label="Hero Slide Photo"
                          value={imgUrl || ""}
                          defaultValue=""
                          onChange={(val) => {
                            const currentImgs = [...(newsPageForm.featuredCarouselImages || [])];
                            currentImgs[sIdx] = val;
                            setNewsPageForm({ ...newsPageForm, featuredCarouselImages: currentImgs });
                          }}
                          onReset={() => {
                            const currentImgs = [...(newsPageForm.featuredCarouselImages || [])];
                            currentImgs[sIdx] = "";
                            setNewsPageForm({ ...newsPageForm, featuredCarouselImages: currentImgs });
                          }}
                          aspectRatio="video"
                          recommendedSize="1200 × 700 px"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
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
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleAddNewArticle}
                className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                <Plus size={13} /> Add News Article
              </button>
              <button
                type="button"
                onClick={handleResetAllNews}
                className="h-8 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all border border-gray-200"
                title="Restore sample Chalapathi University articles"
              >
                <RotateCcw size={12} /> Reset to Sample
              </button>
              {newsList.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllArticles}
                  className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                  title="Remove all news articles completely"
                >
                  <Trash2 size={12} /> Clear All News
                </button>
              )}
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
            {newsList.length === 0 ? (
              <div className="p-12 text-center bg-white border border-dashed border-gray-200 rounded-2xl space-y-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl mx-auto flex items-center justify-center">
                  <Newspaper size={28} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-800">No News Articles Found</h4>
                  <p className="text-xs text-gray-500 max-w-md mx-auto">
                    All news articles have been cleared. You can start fresh by adding a new article or restore the sample Chalapathi University articles.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddNewArticle}
                    className="h-8 px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus size={13} /> + Add First News Article
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAllNews}
                    className="h-8 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer border border-gray-200"
                  >
                    <RotateCcw size={13} /> Restore Sample Articles
                  </button>
                </div>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="p-8 text-center bg-white border border-gray-200 rounded-2xl text-xs text-gray-400">
                No articles matching your search or category filter.
              </div>
            ) : (
              filteredArticles.map((article) => {
              const idx = newsList.findIndex(n => n.id === article.id);

              return (
                <div key={article.id} className="p-6 rounded-2xl border-2 border-slate-200/90 bg-white shadow-sm space-y-6">
                  {/* Top Header Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-[#072A6C] text-white text-xs font-black flex items-center justify-center shadow-xs">
                        #{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-[#072A6C] line-clamp-1">{article.title || "Untitled Article"}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                            {article.category || "General"}
                          </span>
                          {article.featured && (
                            <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-300">
                              <Flame size={11} className="text-amber-600" /> Homepage Featured
                            </span>
                          )}
                          {article.hidden && (
                            <span className="text-[10px] font-bold uppercase bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-200">
                              Hidden from Portal
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-gray-200">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={async () => {
    try {
                            if (idx === 0) return;
                            const updated = [...newsList];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setNewsList(updated);
                            await updateNews(updated);
                          
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  }}
                          className="p-1.5 hover:bg-white rounded-md text-gray-700 disabled:opacity-25 cursor-pointer transition-colors"
                          title="Move Up in order"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === newsList.length - 1}
                          onClick={async () => {
    try {
                            if (idx === newsList.length - 1) return;
                            const updated = [...newsList];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setNewsList(updated);
                            await updateNews(updated);
                          
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  }}
                          className="p-1.5 hover:bg-white rounded-md text-gray-700 disabled:opacity-25 cursor-pointer transition-colors"
                          title="Move Down in order"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={async () => {
    try {
                          const isHidden = !article.hidden;
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], hidden: isHidden };
                          setNewsList(updated);
                          await updateNews(updated);
                          notifySave(`Article "${article.title || 'Untitled'}" is now ${isHidden ? 'Hidden' : 'Visible'}!`);
                        
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  }}
                        className={`h-8 px-3 border text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                          article.hidden 
                            ? "bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300" 
                            : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-gray-200"
                        }`}
                        title={article.hidden ? "Show this article on website" : "Hide this article from website"}
                      >
                        {article.hidden ? <><Eye size={13} /> Unhide</> : <><EyeOff size={13} /> Hide</>}
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
    try {
                          if (window.confirm(`Delete article "${article.title}"?`)) {
                            const updated = newsList.filter((n) => n.id !== article.id);
                            setNewsList(updated);
                            await updateNews(updated);
                            notifySave("Article deleted.");
                          }
                        
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  }}
                        className="h-8 px-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* ── SECTION 1: HEADLINE, METADATA & LINKS ── */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black flex items-center justify-center">1</span>
                      <h5 className="text-xs font-black text-gray-800 uppercase tracking-wide">
                        Article Headline & Metadata
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Article Headline Title *</label>
                        <input
                          type="text"
                          value={article.title}
                          onChange={(e) => {
                            const updated = [...newsList];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setNewsList(updated);
                          }}
                          placeholder="e.g. University Signs Historic Research Accord..."
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-slate-900 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Category *</label>
                        <input
                          type="text"
                          value={article.category}
                          onChange={(e) => {
                            const updated = [...newsList];
                            updated[idx] = { ...updated[idx], category: e.target.value };
                            setNewsList(updated);
                          }}
                          placeholder="e.g. Research, Tech, Placement"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-semibold text-slate-800 focus:bg-white"
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
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-800 focus:bg-white"
                        />
                      </div>
                    </div>

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
                          placeholder="e.g. ai-research-breakthrough"
                          className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-slate-700 focus:bg-white"
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
                          className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-800 focus:bg-white"
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
                          placeholder="e.g. https://timesofindia..."
                          className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-slate-700 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-5 space-y-3">
                    {/* ── SECTION 2: EXCERPT & FULL BODY STORY ── */}
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black flex items-center justify-center">2</span>
                      <h5 className="text-xs font-black text-gray-800 uppercase tracking-wide">
                        Article Summary & Full Story Text
                      </h5>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Short Excerpt (Displayed on Cards & Homepage)</label>
                      <input
                        type="text"
                        value={article.excerpt || ""}
                        onChange={(e) => {
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], excerpt: e.target.value };
                          setNewsList(updated);
                        }}
                        placeholder="Brief 1-2 sentence synopsis shown in news previews..."
                        className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-800 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Full News Body Story</label>
                      <textarea
                        rows={3}
                        value={article.bodyText || ""}
                        onChange={(e) => {
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], bodyText: e.target.value };
                          setNewsList(updated);
                        }}
                        placeholder="Complete article coverage, quotes, achievements, and paragraphs..."
                        className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg leading-relaxed text-slate-800 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-5 space-y-3">
                    {/* ── SECTION 3: PRIMARY COVER PHOTO ── */}
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black flex items-center justify-center">3</span>
                      <div>
                        <h5 className="text-xs font-black text-gray-800 uppercase tracking-wide">
                          Primary Cover Photo
                        </h5>
                        <p className="text-[10px] text-gray-400">Main photo shown on news cards, top banners, and article header.</p>
                      </div>
                    </div>

                    <ImageField
                      label="Primary Cover Photo"
                      value={article.image || ""}
                      defaultValue=""
                      onChange={(val) => {
                        const updated = [...newsList];
                        updated[idx] = { ...updated[idx], image: val };
                        setNewsList(updated);
                      }}
                      onReset={() => {
                        const updated = [...newsList];
                        updated[idx] = { ...updated[idx], image: "" };
                        setNewsList(updated);
                      }}
                      aspectRatio="video"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-5 space-y-3">
                    {/* ── SECTION 4: MULTI-SLIDE PHOTO GALLERY ── */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black flex items-center justify-center">4</span>
                        <div>
                          <h5 className="text-xs font-black text-gray-800 uppercase tracking-wide">
                            Additional Photo Gallery Slider ({article.images?.length || 0} Slides)
                          </h5>
                          <p className="text-[10px] text-gray-400">Optional carousel shown on the article details page. If none added, only the cover photo is used.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentImgs = article.images || [];
                          const updated = [...newsList];
                          updated[idx] = { ...updated[idx], images: [...currentImgs, ""] };
                          setNewsList(updated);
                        }}
                        className="h-7 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-2xs self-start sm:self-auto"
                      >
                        <Plus size={12} /> Add Gallery Slide
                      </button>
                    </div>

                    {!article.images || article.images.length === 0 ? (
                      <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-slate-50/60 text-center">
                        <p className="text-xs text-gray-400">
                          No additional gallery slides attached. Click <strong className="text-[#072A6C]">+ Add Gallery Slide</strong> to attach more photos.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {article.images.map((imgUrl, sIdx) => (
                          <div key={sIdx} className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-gray-500 uppercase">Slide #{sIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const filtered = (article.images || []).filter((_, i) => i !== sIdx);
                                  const updated = [...newsList];
                                  updated[idx] = { ...updated[idx], images: filtered };
                                  setNewsList(updated);
                                }}
                                className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer"
                              >
                                <Trash2 size={11} /> Remove Slide
                              </button>
                            </div>
                            <ImageField
                              label={`Gallery Slide #${sIdx + 1}`}
                              value={imgUrl || ""}
                              defaultValue=""
                              onChange={(val) => {
                                const currentImgs = [...(article.images || [])];
                                currentImgs[sIdx] = val;
                                const updated = [...newsList];
                                updated[idx] = { ...updated[idx], images: currentImgs };
                                setNewsList(updated);
                              }}
                              onReset={() => {
                                const currentImgs = [...(article.images || [])];
                                currentImgs[sIdx] = "";
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
                    )}
                  </div>

                  <div className="border-t border-gray-200 pt-5 space-y-3">
                    {/* ── SECTION 5: HOMEPAGE PLACEMENT & CONTROLS ── */}
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black flex items-center justify-center">5</span>
                      <div>
                        <h5 className="text-xs font-black text-gray-800 uppercase tracking-wide">
                          Homepage Carousel Placement & Live Link
                        </h5>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={!!article.featured}
                          onChange={(e) => {
                            const updated = [...newsList];
                            updated[idx] = { ...updated[idx], featured: e.target.checked };
                            setNewsList(updated);
                          }}
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            <Flame size={13} className="text-amber-600" />
                            Feature in Homepage News Carousel
                          </span>
                          <p className="text-[10px] text-gray-500">
                            Check this to make this story rotate prominently in the News & Events carousel on the front page.
                          </p>
                        </div>
                      </label>

                      <a
                        href={`/news/${article.slug || `article-${article.id}`}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-white border border-gray-300 hover:border-[#072A6C] text-[#072A6C] rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs self-start sm:self-auto transition-colors"
                      >
                        <span>Preview Live Page</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                </div>
              );
            }))}
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

          {announcementsList.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <Bell size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-bold text-gray-600">No Announcements Added</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Click "+ Add Announcement" above to publish your first university notice.</p>
            </div>
          ) : (
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
          )}
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
                Homepage News & Events Section Sync
              </h3>
              <p className="text-xs text-gray-500">
                Directly configure what appears in the <strong>News & Events</strong> section on the homepage, including the main headline, subtitle, and featured articles in the carousel.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={async () => {
    try {
                  await updateNews(newsList);
                  notifySave("Homepage News carousel and featured headlines saved live!");
                
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
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
                      onClick={async () => {
    try {
                        const updated = newsList.map((n) =>
                          n.id === art.id ? { ...n, featured: !n.featured } : n
                        );
                        setNewsList(updated);
                        await updateNews(updated);
                        notifySave(`Toggled featured status for "${art.title}"`);
                      
    } catch (error: any) { alert(error.message || "Unable to publish. Please retry."); }
  }}
                      className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                        art.featured
                          ? "bg-amber-500 text-white border-amber-600"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {art.featured ? "Featured" : "+ Feature"}
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
