import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Lock, LayoutDashboard, Megaphone, BookOpen, Calendar, FileText, 
  Settings, LogOut, Plus, Trash2, Edit3, CheckCircle, UploadCloud, Info, Users, Briefcase, Globe, Newspaper, Download,
  User, Eye, EyeOff, ArrowRight, ShieldCheck, Shield, BarChart3, Menu, ChevronDown, ChevronRight, ChevronUp,
  Bell, TrendingUp, UserPlus, CheckSquare, FileSpreadsheet, Building, CreditCard, MessageSquare,
  Library, BarChart2, CheckCircle2, Clock, Search, Filter, Image as ImageIcon, Sparkles, Layers, RefreshCw, GraduationCap,
  ArrowUp, ArrowDown, RotateCcw, Sliders, ExternalLink, Compass, MapPin, Phone, Mail, Award, X, Copy, Check, Save,
  Palette, Type, Trophy, Handshake
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useData, 
  Announcement, 
  ProgramDetail, 
  NewsArticle, 
  EventItem, 
  AboutUsContent, 
  MonthCalendarData, 
  PlacementsContent, 
  PlacedStudent, 
  Recruiter, 
  SuccessStory,
  FacultyMember,
  DirectoryData,
  HomepageSectionConfig,
  EnquiryLead,
  SiteSettings,
  ThemeColors,
  NavMenuItem,
  FooterContent,
  CourseLinkItem,
  AcademicStructure,
  CampusVideoItem,
  CampusTourConfig,
  CampusGalleryItem,
  CampusBannersConfig,
  CampusLifeContent,
  CampusLifePageData,
  CampusLifeHighlight,
  CampusLifeStat,
  CampusLifeSectionItem,
  getFallbackCourseImage,
  DEFAULT_ACADEMIC_STRUCTURE,
  DEFAULT_CAMPUS_VIDEOS,
  DEFAULT_CAMPUS_TOUR,
  DEFAULT_CAMPUS_GALLERY,
  DEFAULT_CAMPUS_BANNERS,
  DEFAULT_CAMPUS_LIFE_CONTENT,
  INITIAL_HERO_SLIDES,
  INITIAL_NEWS,
  INITIAL_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PLACEMENTS_CONTENT,
  DEFAULT_INDUSTRIES,
  INITIAL_SUCCESS_STORIES,
  INITIAL_ABOUT_CONTENT,
  INITIAL_CALENDAR_DATA,
  INITIAL_FACULTY_DATA,
  INITIAL_BOARD_DATA,
  INITIAL_STAFF_DATA,
  INITIAL_ENQUIRIES,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_THEME_COLORS,
  DEFAULT_HOMEPAGE_SECTIONS,
  DEFAULT_NAV_MENU,
  DEFAULT_FOOTER_CONTENT,
  DEFAULT_NEWS_PAGE_CONFIG,
  NewsPageConfig,
  PROGRAMS_DATA
} from "../context/DataContext";
import { ImageField, ColorField, SectionHeader, VideoField } from "../components/admin/AdminComponents";
import { PlacementsCMS } from "../components/admin/PlacementsCMS";
import { ResearchCMS } from "../components/admin/ResearchCMS";
import { FacultyCMS } from "../components/admin/FacultyCMS";
import { AdmissionsCMS } from "../components/admin/AdmissionsCMS";
import { ContactCMS } from "../components/admin/ContactCMS";
import { 
  DEFAULT_PROGRAM_SECTIONS, 
  SectionMeta, 
  FullProgramData, 
  getProgramFullData 
} from "../data/programDetailsData";

export default function AdminPortal() {
  const {
    siteSettings,
    updateSiteSettings,
    themeColors,
    updateThemeColors,
    homepageSections,
    updateHomepageSections,
    navigationMenu,
    updateNavigationMenu,
    footerContent,
    updateFooterContent,
    enquiries,
    updateEnquiries,
    announcements,
    updateAnnouncements,
    programs,
    updatePrograms,
    academicStructure,
    updateAcademicStructure,
    news,
    updateNews,
    newsPageConfig,
    updateNewsPageConfig,
    events,
    updateEvents,
    campusVideos,
    updateCampusVideos,
    campusTour,
    updateCampusTour,
    campusGallery,
    updateCampusGallery,
    campusBanners,
    updateCampusBanners,
    campusLifeContent,
    updateCampusLifeContent,
    updateCampusLifePage,
    aboutContent,
    updateAboutContent,
    calendarData,
    updateCalendarData,
    facultyData,
    updateFacultyData,
    boardData,
    updateBoardData,
    staffData,
    updateStaffData,
    placementsContent,
    updatePlacementsContent,
    successStories,
    updateSuccessStories,
    heroSlides,
    updateHeroSlides,
    resetToDefaults,
    lastSavedTime
  } = useData();

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("chalapathi_admin_auth") === "true";
  });
  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");

  // Tab navigation & layout states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "homepage" | "about" | "academics" | "admissions" | 
    "research" | "directories" | "campus-life" | "placements" | "news-events" | 
    "contact" | "gallery" | "footer" | "settings"
  >("dashboard");

  // Notification / Save feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("Saved successfully!");

  const notifySave = (msg = "Changes saved and published live!") => {
    setSaveMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123" || passcode === "admin" || (username.trim().toLowerCase() === "admin" && passcode)) {
      setIsAuthenticated(true);
      sessionStorage.setItem("chalapathi_admin_auth", "true");
      setAuthError("");
    } else if (!passcode) {
      setAuthError("Please enter password to sign in.");
    } else {
      setAuthError("Invalid credentials! Default passcode: admin123");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("chalapathi_admin_auth");
  };

  // ----------------------------------------------------
  // 1. HOMEPAGE TAB FORMS
  // ----------------------------------------------------
  const [sectionsList, setSectionsList] = useState<HomepageSectionConfig[]>(homepageSections);
  const [activeHomeSubTab, setActiveHomeSubTab] = useState<
    "ordering" | "hero" | "ticker" | "stats" | "whyChoose" | "programs" | "newsEvents" | "campusLife" | "chairman" | 
    "placements" | "virtualTour" | "styling"
  >("ordering");

  React.useEffect(() => {
    setSectionsList(homepageSections);
  }, [homepageSections]);

  const moveSection = (index: number, direction: "up" | "down") => {
    const updated = [...sectionsList];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    // Reassign order numbers
    updated.forEach((s, idx) => (s.order = idx + 1));
    setSectionsList(updated);
  };

  const toggleSectionEnable = (id: string) => {
    const updated = sectionsList.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s));
    setSectionsList(updated);
  };

  const saveHomepageSections = () => {
    updateHomepageSections(sectionsList);
    notifySave("Homepage section order & visibility saved!");
  };

  // ----------------------------------------------------
  // 2. HERO SLIDES FORM
  // ----------------------------------------------------
  const [slides, setSlides] = useState(heroSlides);
  React.useEffect(() => setSlides(heroSlides), [heroSlides]);

  const handleAddHeroSlide = () => {
    const newSlide = {
      id: Date.now(),
      image: "/Chalapathimain.png",
      title: "",
      subtitle: ""
    };
    const updated = [...slides, newSlide];
    setSlides(updated);
    updateHeroSlides(updated);
    notifySave("New hero banner slide added!");
  };

  const handleRemoveHeroSlide = (id: number) => {
    if (slides.length <= 1) {
      alert("You must keep at least one hero slide.");
      return;
    }
    const updated = slides.filter((s) => s.id !== id);
    setSlides(updated);
    updateHeroSlides(updated);
    notifySave("Hero slide removed!");
  };

  const handleUpdateHeroSlide = (index: number, key: string, val: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [key]: val };
    setSlides(updated);
  };

  const saveHeroSlides = () => {
    updateHeroSlides(slides);
    notifySave("Hero slides published!");
  };

  // ----------------------------------------------------
  // 3. CHAIRMAN FORM
  // ----------------------------------------------------
  const chairmanSection = sectionsList.find((s) => s.id === "chairman");
  const [chairmanData, setChairmanData] = useState(() => chairmanSection?.extraData || {
    name: "Dr. Y. V Anjaneyulu",
    designation: "Chairman",
    group: "Chalapathi Group of Institutions",
    message: "At Chalapathi University, we believe education is the most powerful transformer of lives and the key to building a better society.",
    videoUrl: "/chalapathi_logo_intro.mp4",
    image: "/chairman_v4.png",
    buttonText: "Watch Chairman's Message"
  });

  const saveChairman = () => {
    const updatedSections = sectionsList.map((s) => {
      if (s.id === "chairman") {
        return { ...s, extraData: chairmanData };
      }
      return s;
    });
    setSectionsList(updatedSections);
    updateHomepageSections(updatedSections);
    notifySave("Chairman's message published!");
  };

  // ----------------------------------------------------
  // 4. ACADEMIC SCHOOLS & CATEGORIES CMS STATE
  // ----------------------------------------------------
  const [academicData, setAcademicData] = useState<AcademicStructure>(academicStructure);
  const [activeAdminSchool, setActiveAdminSchool] = useState<string>(() => Object.keys(academicStructure)[0] || "School of Computing Sciences");
  const [activeAdminDept, setActiveAdminDept] = useState<string>(() => {
    const depts = academicStructure[Object.keys(academicStructure)[0]];
    return depts ? Object.keys(depts)[0] || "" : "";
  });

  React.useEffect(() => {
    setAcademicData(academicStructure);
    if (!academicStructure[activeAdminSchool]) {
      const firstSchool = Object.keys(academicStructure)[0];
      if (firstSchool) {
        setActiveAdminSchool(firstSchool);
        const firstDept = Object.keys(academicStructure[firstSchool] || {})[0];
        setActiveAdminDept(firstDept || "");
      }
    }
  }, [academicStructure]);

  const saveAcademicData = () => {
    updateAcademicStructure(academicData);
    notifySave("Schools, Categories & Course Programs published live!");
  };

  // ----------------------------------------------------
  // 5. CAMPUS LIFE CMS STATE
  // ----------------------------------------------------
  const campusLifeSubpages = [
    { path: "/campus-life", label: "Campus Overview", icon: Compass, badge: "Main" },
    { path: "/campus-life/library", label: "Central Library", icon: Library },
    { path: "/campus-life/smart-classrooms", label: "Smart Classrooms", icon: BookOpen },
    { path: "/campus-life/laboratories", label: "Laboratories", icon: Layers },
    { path: "/campus-life/hostels", label: "Hostel Facilities", icon: Building },
    { path: "/campus-life/sports", label: "Sports & Fitness", icon: Trophy },
    { path: "/campus-life/cafeteria", label: "Cafeteria & Dining", icon: Palette },
    { path: "/campus-life/transportation", label: "Transportation", icon: Globe },
    { path: "/campus-life/wifi", label: "Wi-Fi Campus", icon: Sliders },
    { path: "/campus-life/health-centre", label: "Health Centre", icon: ShieldCheck },
    { path: "/campus-life/clubs", label: "Student Clubs", icon: Users },
    { path: "/campus-life/events", label: "Events & Festivals", icon: Calendar },
    { path: "/campus-life/innovation-hub", label: "Innovation Hub", icon: Sparkles },
    { path: "/campus-life/safety", label: "Campus Safety", icon: Shield },
    { path: "/campus-life/nss-ncc", label: "NSS & NCC", icon: Award },
    { path: "/campus-life/grievance-cell", label: "Grievance Cell", icon: MessageSquare }
  ];

  const [selectedCampusSlug, setSelectedCampusSlug] = useState<string>("/campus-life");
  const [campusLifeSubTab, setCampusLifeSubTab] = useState<"subpages" | "homepage-tour">("subpages");
  const [campusLifeForm, setCampusLifeForm] = useState<CampusLifeContent>(() => {
    return campusLifeContent || DEFAULT_CAMPUS_LIFE_CONTENT;
  });
  const [newGalleryInput, setNewGalleryInput] = useState("");
  const [campusTourData, setCampusTourData] = useState<CampusTourConfig>(campusTour);
  const [campusVideosList, setCampusVideosList] = useState<CampusVideoItem[]>(campusVideos);
  const [campusGalleryList, setCampusGalleryList] = useState<CampusGalleryItem[]>(campusGallery);
  const [campusBannersData, setCampusBannersData] = useState<CampusBannersConfig>(campusBanners);
  const [campusCardsList, setCampusCardsList] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("chalapathi_campus_cards");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { title: "Vibrant Community", desc: "A diverse and inclusive campus with students from across India and the world.", icon: "Users" },
      { title: "Clubs & Activities", desc: "50+ student clubs to explore passions and build leadership skills.", icon: "GraduationCap" },
      { title: "Sports & Fitness", desc: "World-class sports facilities to keep you active, healthy and motivated.", icon: "Trophy" },
      { title: "Arts & Culture", desc: "Celebrate creativity with events, fests, and cultural extravaganzas.", icon: "Sparkles" },
      { title: "Smart Learning Spaces", desc: "Modern classrooms, advanced labs, and digital resources for future-ready learning.", icon: "Building2" },
      { title: "Hostel Life", desc: "Safe, comfortable and modern hostels that feel like a second home.", icon: "Landmark" },
      { title: "Food & Cafeteria", desc: "Hygienic, affordable and variety-rich meals for every taste.", icon: "Coffee" },
      { title: "Transport Facility", desc: "Convenient and reliable transportation across city routes.", icon: "Bus" }
    ];
  });

  React.useEffect(() => {
    if (campusLifeContent) setCampusLifeForm(campusLifeContent);
  }, [campusLifeContent]);
  React.useEffect(() => setCampusTourData(campusTour), [campusTour]);
  React.useEffect(() => setCampusVideosList(campusVideos), [campusVideos]);
  React.useEffect(() => setCampusGalleryList(campusGallery), [campusGallery]);
  React.useEffect(() => setCampusBannersData(campusBanners), [campusBanners]);

  const currentCampusPage: CampusLifePageData = campusLifeForm[selectedCampusSlug] || DEFAULT_CAMPUS_LIFE_CONTENT[selectedCampusSlug] || DEFAULT_CAMPUS_LIFE_CONTENT["/campus-life"];

  const updateSelectedPage = (updates: Partial<CampusLifePageData>) => {
    const updated = {
      ...campusLifeForm,
      [selectedCampusSlug]: {
        ...currentCampusPage,
        ...updates
      }
    };
    setCampusLifeForm(updated);
  };

  const saveFullCampusCMS = () => {
    updateCampusLifeContent(campusLifeForm);
    updateCampusTour(campusTourData);
    updateCampusVideos(campusVideosList);
    updateCampusGallery(campusGalleryList);
    updateCampusBanners(campusBannersData);
    localStorage.setItem("chalapathi_campus_cards", JSON.stringify(campusCardsList));
    notifySave(`Campus Life: "${currentCampusPage.title}" & all bottom photos published live!`);
  };

  // ----------------------------------------------------
  // 6. SUCCESS STORIES STATE
  // ----------------------------------------------------
  const [storiesList, setStoriesList] = useState<SuccessStory[]>(successStories);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [newSkillText, setNewSkillText] = useState("");
  React.useEffect(() => setStoriesList(successStories), [successStories]);

  const saveSuccessStoriesData = () => {
    updateSuccessStories(storiesList);
    notifySave("Placement success stories and student journeys published live!");
  };

  // ----------------------------------------------------
  // 7. STATS & WHY CHOOSE US
  // ----------------------------------------------------
  const statsSection = sectionsList.find((s) => s.id === "stats");
  const [statsData, setStatsData] = useState<any[]>(() => statsSection?.extraData || []);

  const saveStats = () => {
    const updatedSections = sectionsList.map((s) => (s.id === "stats" ? { ...s, extraData: statsData } : s));
    setSectionsList(updatedSections);
    updateHomepageSections(updatedSections);
    notifySave("Statistics bar updated!");
  };

  const whyChooseSection = sectionsList.find((s) => s.id === "whyChooseUs");
  const [whyChooseData, setWhyChooseData] = useState<any[]>(() => whyChooseSection?.extraData || []);

  const saveWhyChoose = () => {
    const updatedSections = sectionsList.map((s) => (s.id === "whyChooseUs" ? { ...s, extraData: whyChooseData } : s));
    setSectionsList(updatedSections);
    updateHomepageSections(updatedSections);
    notifySave("Why Choose Us section saved!");
  };

  // Programs Section
  const programsSection = sectionsList.find((s) => s.id === "programs");
  const [programsSectionData, setProgramsSectionData] = useState(() => ({
    title: programsSection?.title || "Explore Our Schools & Programs",
    subtitle: programsSection?.subtitle || "Choose from industry-aligned degrees across cutting-edge disciplines",
    description: programsSection?.description || "Chalapathi University offers diverse undergraduate, postgraduate, and doctoral degree pathways designed with practical learning and industry immersion.",
    buttonText: programsSection?.buttonText || "View All Programs",
    buttonUrl: programsSection?.buttonUrl || "/admissions"
  }));

  const saveProgramsSection = () => {
    const updatedSections = sectionsList.map((s) => (s.id === "programs" ? { ...s, ...programsSectionData } : s));
    setSectionsList(updatedSections);
    updateHomepageSections(updatedSections);
    updateAcademicStructure(academicData);
    notifySave("Schools & Programs section and curriculum saved live!");
  };

  // News & Events Section
  const newsEventsSection = sectionsList.find((s) => s.id === "newsEvents");
  const [newsEventsData, setNewsEventsData] = useState(() => ({
    title: newsEventsSection?.title || "News & Events",
    subtitle: newsEventsSection?.subtitle || "Stay Informed. Stay Ahead. Discover the latest updates and exciting events happening at Chalapathi.",
    buttonText: newsEventsSection?.buttonText || "View All News & Events",
    buttonUrl: newsEventsSection?.buttonUrl || "/news"
  }));

  const saveNewsEventsSection = () => {
    const updatedSections = sectionsList.map((s) => (s.id === "newsEvents" ? { ...s, ...newsEventsData } : s));
    setSectionsList(updatedSections);
    updateHomepageSections(updatedSections);
    updateNews(newsList);
    updateEvents(eventsList);
    notifySave("News & Events highlights, latest articles and upcoming calendar saved live!");
  };

  // Placements Section
  const placementsSection = sectionsList.find((s) => s.id === "placements" || s.id === "certifications");
  const [placementsSectionData, setPlacementsSectionData] = useState(() => ({
    title: placementsSection?.title || "A Step Towards Success!",
    subtitle: placementsSection?.subtitle || "Building Careers. Creating Leaders.",
    highestPackage: placementsContent.highestPackage || "30 LPA",
    averagePackage: placementsContent.averagePackage || "₹5.5 LPA",
    placementPercent: placementsContent.placementPercent || "92%",
    buttonText: placementsSection?.buttonText || "Explore Placements",
    buttonUrl: placementsSection?.buttonUrl || "/placements",
    storiesBadge: placementsSection?.extraData?.storiesBadge || "PLACEMENT SUCCESS STORIES",
    storiesTitle: placementsSection?.extraData?.storiesTitle || "Our Students. Top Careers. Bright Futures.",
    storiesSubtitle: placementsSection?.extraData?.storiesSubtitle || "Real stories from Chalapathi students who achieved successful careers through campus placements.",
    partnersHeading: placementsSection?.extraData?.partnersHeading || "Our Top Corporate Partners"
  }));

  const savePlacementsSection = () => {
    const updatedSections = sectionsList.map((s) => (s.id === "placements" || s.id === "certifications" ? { 
      ...s, 
      ...placementsSectionData,
      extraData: {
        ...(s.extraData || {}),
        storiesBadge: placementsSectionData.storiesBadge,
        storiesTitle: placementsSectionData.storiesTitle,
        storiesSubtitle: placementsSectionData.storiesSubtitle,
        partnersHeading: placementsSectionData.partnersHeading
      }
    } : s));
    setSectionsList(updatedSections);
    updateHomepageSections(updatedSections);
    updatePlacementsContent(placementsForm);
    updateSuccessStories(storiesList);
    notifySave("Placements metrics, corporate partners, and success stories saved live!");
  };

  // 10. Admissions & Visit Us Section
  const tourSection = sectionsList.find((s) => s.id === "virtualTour");
  const [tourData, setTourData] = useState(() => ({
    bannerTitle: tourSection?.extraData?.bannerTitle || tourSection?.title || "ADMISSIONS OPEN 2026",
    bannerSubtitle: tourSection?.extraData?.bannerSubtitle || tourSection?.subtitle || "Join a community of innovators and leaders. Shape your future with Chalapathi University.",
    bannerImage: tourSection?.extraData?.bannerImage || "/students_admission.png",
    btn1Text: tourSection?.extraData?.btn1Text || "Apply Now",
    btn1Url: tourSection?.extraData?.btn1Url || "/admissions/apply",
    btn2Text: tourSection?.extraData?.btn2Text || "Download Brochure",
    btn2Url: tourSection?.extraData?.btn2Url || "/admissions",
    btn3Text: tourSection?.extraData?.btn3Text || "Talk to Counselor",
    btn3Url: tourSection?.extraData?.btn3Url || "/contact",
    visitHeading: tourSection?.extraData?.visitHeading || "VISIT US",
    address: tourSection?.extraData?.address || "A.R. Nagar, Mothadaka, Guntur, Andhra Pradesh - 522034",
    phone: tourSection?.extraData?.phone || "8886630355 | 8886630356 9905505566",
    email: tourSection?.extraData?.email || "admissions@city.ac.in",
    website: tourSection?.extraData?.website || "www.city.ac.in",
    mapEmbedUrl: tourSection?.extraData?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.974950454796!2d80.28581691486445!3d16.375218788685984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a79679802cfad%3A0xe67e2a901bbd33fe!2sChalapathi%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!5m2!1sen!2sin",
    mapLinkUrl: tourSection?.extraData?.mapLinkUrl || "https://www.google.com/maps/place/Chalapathi+Institute+of+Technology/@16.3752188,80.2858169,17z/data=!3m1!4b1!4m6!3m5!1s0x3a4a79679802cfad:0xe67e2a901bbd33fe!8m2!3d16.3752188!4d80.2858169!16s%2Fg%2F122r446z"
  }));

  const saveVirtualTourSection = () => {
    const updatedSections = sectionsList.map((s) => (s.id === "virtualTour" ? { 
      ...s, 
      name: "Admissions Banner & Visit Us",
      title: tourData.bannerTitle, 
      subtitle: tourData.bannerSubtitle, 
      extraData: tourData 
    } : s));
    setSectionsList(updatedSections);
    updateHomepageSections(updatedSections);
    notifySave("Admissions & Visit Us section saved live!");
  };

  // ----------------------------------------------------
  // 6. ABOUT US FORM
  // ----------------------------------------------------
  const [aboutForm, setAboutForm] = useState<AboutUsContent>(aboutContent);
  const [activeAboutSubTab, setActiveAboutSubTab] = useState<"genesis" | "vision" | "leadership" | "advantage">("genesis");
  React.useEffect(() => setAboutForm(aboutContent), [aboutContent]);

  const saveAbout = () => {
    updateAboutContent(aboutForm);
    notifySave("About Us content published!");
  };

  // ----------------------------------------------------
  // 7. ACADEMICS & PROGRAM BUILDER
  // ----------------------------------------------------
  const [programsList, setProgramsList] = useState<ProgramDetail[]>(programs);
  const [selectedProgSlug, setSelectedProgSlug] = useState<string>(programs[0]?.slug || "btech-cse");
  const currentProg = programsList.find((p) => p.slug === selectedProgSlug) || programsList[0];
  const [progSearch, setProgSearch] = useState("");

  React.useEffect(() => setProgramsList(programs), [programs]);

  const [progSectionsOrder, setProgSectionsOrder] = useState<SectionMeta[]>(() => {
    const saved = localStorage.getItem(`program_sections_order_${selectedProgSlug}`);
    return saved ? JSON.parse(saved) : DEFAULT_PROGRAM_SECTIONS;
  });

  const [customFullProgram, setCustomFullProgram] = useState<FullProgramData>(() => {
    const saved = localStorage.getItem(`custom_program_data_${selectedProgSlug}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return getProgramFullData(selectedProgSlug, currentProg?.title, currentProg?.department);
  });

  React.useEffect(() => {
    const savedSecs = localStorage.getItem(`program_sections_order_${selectedProgSlug}`);
    setProgSectionsOrder(savedSecs ? JSON.parse(savedSecs) : DEFAULT_PROGRAM_SECTIONS);

    const savedFull = localStorage.getItem(`custom_program_data_${selectedProgSlug}`);
    setCustomFullProgram(
      savedFull
        ? JSON.parse(savedFull)
        : getProgramFullData(selectedProgSlug, currentProg?.title, currentProg?.department)
    );
  }, [selectedProgSlug, currentProg]);

  const saveProgramDetails = () => {
    localStorage.setItem(`program_sections_order_${selectedProgSlug}`, JSON.stringify(progSectionsOrder));
    localStorage.setItem(`custom_program_data_${selectedProgSlug}`, JSON.stringify(customFullProgram));
    updatePrograms(programsList);
    notifySave(`Program details for ${currentProg?.title} saved!`);
  };

  // ----------------------------------------------------
  // 8. ADMISSION ENQUIRIES / LEADS
  // ----------------------------------------------------
  const [leadsList, setLeadsList] = useState<EnquiryLead[]>(enquiries);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("All");

  React.useEffect(() => setLeadsList(enquiries), [enquiries]);

  const filteredLeads = useMemo(() => {
    return leadsList.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.mobile.includes(leadSearch) ||
        lead.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.city.toLowerCase().includes(leadSearch.toLowerCase()) ||
        lead.program.toLowerCase().includes(leadSearch.toLowerCase());
      const matchesStatus = leadStatusFilter === "All" || lead.status === leadStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leadsList, leadSearch, leadStatusFilter]);

  const updateLeadStatus = (id: string, status: EnquiryLead["status"]) => {
    const updated = leadsList.map((l) => (l.id === id ? { ...l, status } : l));
    setLeadsList(updated);
    updateEnquiries(updated);
    notifySave("Lead status updated!");
  };

  const deleteLead = (id: string) => {
    if (window.confirm("Are you sure you want to delete this enquiry lead?")) {
      const updated = leadsList.filter((l) => l.id !== id);
      setLeadsList(updated);
      updateEnquiries(updated);
      notifySave("Lead deleted.");
    }
  };

  const exportLeadsToCSV = () => {
    if (leadsList.length === 0) {
      alert("No enquiry leads to export.");
      return;
    }
    const headers = ["ID", "Name", "Mobile", "Email", "City", "State", "Qualification", "Year", "Program", "Date", "Status"];
    const rows = leadsList.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.mobile}"`,
      `"${l.email}"`,
      `"${l.city}"`,
      `"${l.state}"`,
      `"${l.qualification}"`,
      `"${l.yearOfPassing}"`,
      `"${l.program}"`,
      `"${l.date}"`,
      `"${l.status || "New"}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `chalapathi_admissions_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ----------------------------------------------------
  // 9. NEWS & EVENTS & ANNOUNCEMENTS
  // ----------------------------------------------------
  const [newsList, setNewsList] = useState<NewsArticle[]>(news);
  const [eventsList, setEventsList] = useState<EventItem[]>(events);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(announcements);
  const [newsPageForm, setNewsPageForm] = useState<NewsPageConfig>(newsPageConfig || DEFAULT_NEWS_PAGE_CONFIG);
  const [editingNews, setEditingNews] = useState<NewsArticle | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [newsEventsSubTab, setNewsEventsSubTab] = useState<"pageSettings" | "news" | "events" | "announcements">("pageSettings");

  React.useEffect(() => setNewsList(news), [news]);
  React.useEffect(() => setEventsList(events), [events]);
  React.useEffect(() => setAnnouncementsList(announcements), [announcements]);
  React.useEffect(() => {
    if (newsPageConfig) setNewsPageForm(newsPageConfig);
  }, [newsPageConfig]);

  const saveNewsList = () => {
    updateNews(newsList);
    notifySave("News articles published!");
  };

  const saveNewsPageForm = () => {
    updateNewsPageConfig(newsPageForm);
    notifySave("News Page Header, Hero Slider & Sections saved!");
  };

  const saveEventsList = () => {
    updateEvents(eventsList);
    notifySave("Events list published!");
  };

  const saveAnnouncementsList = () => {
    updateAnnouncements(announcementsList);
    notifySave("Announcements updated!");
  };

  // ----------------------------------------------------
  // 10. PLACEMENTS & RECRUITERS
  // ----------------------------------------------------
  const [placementsForm, setPlacementsForm] = useState<PlacementsContent>(placementsContent);
  const [placementsSubTab, setPlacementsSubTab] = useState<"pageOverview" | "placedStudents" | "industries" | "programsCell" | "recruiters" | "homepage">("pageOverview");

  React.useEffect(() => setPlacementsForm(placementsContent), [placementsContent]);

  const savePlacements = () => {
    updatePlacementsContent(placementsForm);
    updateSuccessStories(storiesList);
    notifySave("Placements, corporate partners & success stories published!");
  };

  // ----------------------------------------------------
  // 11. DIRECTORIES (Faculty & Board)
  // ----------------------------------------------------
  const [facultyForm, setFacultyForm] = useState(facultyData);
  const [boardForm, setBoardForm] = useState(boardData);
  const [staffForm, setStaffForm] = useState(staffData);
  const [selectedDept, setSelectedDept] = useState(Object.keys(facultyData)[0] || "Computer Science & Engineering");

  React.useEffect(() => setFacultyForm(facultyData), [facultyData]);
  React.useEffect(() => setBoardForm(boardData), [boardData]);
  React.useEffect(() => setStaffForm(staffData), [staffData]);

  const saveDirectories = () => {
    updateFacultyData(facultyForm);
    updateBoardData(boardForm);
    updateStaffData(staffForm);
    notifySave("Directories updated live!");
  };

  // ----------------------------------------------------
  // 12. FOOTER & SETTINGS & COLORS
  // ----------------------------------------------------
  const [footerForm, setFooterForm] = useState<FooterContent>(footerContent);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);
  const [colorsForm, setColorsForm] = useState<ThemeColors>(themeColors);
  const [navForm, setNavForm] = useState<NavMenuItem[]>(navigationMenu);

  React.useEffect(() => setFooterForm(footerContent), [footerContent]);
  React.useEffect(() => setSettingsForm(siteSettings), [siteSettings]);
  React.useEffect(() => setColorsForm(themeColors), [themeColors]);
  React.useEffect(() => setNavForm(navigationMenu), [navigationMenu]);

  const saveFooter = () => {
    updateFooterContent(footerForm);
    notifySave("Footer content published!");
  };

  const saveSettings = () => {
    updateSiteSettings(settingsForm);
    updateThemeColors(colorsForm);
    updateNavigationMenu(navForm);
    notifySave("Website settings & branding updated live!");
  };

  const saveStyling = () => {
    updateThemeColors(colorsForm);
    notifySave("Homepage styling & theme colors updated live!");
  };

  // ====================================================
  // LOGIN SCREEN
  // ====================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F9FD] font-[var(--font-poppins)] overflow-x-hidden selection:bg-[#071A3A] selection:text-white">
        
        {/* LEFT PANEL: Dark Navy Slanted Hero Branding */}
        <div className="w-full lg:w-[50%] xl:w-[52%] relative min-h-[480px] lg:min-h-screen bg-[#071A3A] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
          
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/campus_hero.png" 
              alt="Chalapathi Campus" 
              className="w-full h-full object-cover object-center opacity-25 mix-blend-luminosity scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#030E22] via-[#071A3A]/95 to-[#0B2550]/90" />
          </div>

          {/* Slanted Right Edge Divider with Gold Accent Line */}
          <div className="hidden lg:block absolute -right-1 top-0 bottom-0 w-24 sm:w-32 z-20 pointer-events-none">
            <svg className="w-full h-full text-[#F8F9FD] fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="100,0 100,100 0,100" />
              <line x1="0" y1="100" x2="100" y2="0" stroke="#D4AF37" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Top Logo */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl shadow-md border border-white/20 inline-flex items-center">
              <img 
                src={siteSettings?.logoUrl || "/logo.png?v=3"} 
                alt={siteSettings?.universityName || "Chalapathi University"} 
                className="h-10 sm:h-12 w-auto object-contain" 
              />
            </div>
          </div>

          {/* Center Banner Content */}
          <div className="relative z-10 my-auto pt-10 pb-6 max-w-lg text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.12]">
              <span className="font-serif font-normal block text-2xl sm:text-3xl text-gray-200 mb-1">Welcome to</span>
              Chalapathi University
              <span className="block text-[#D4AF37] mt-1.5 drop-shadow-sm font-black">Admin Portal</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-blue-100/80 font-normal leading-relaxed max-w-md">
              Empowering excellence in education through technology, real-time CMS controls, and innovation.
            </p>
          </div>

          {/* Bottom Feature Badges */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 mt-6 text-left">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Shield size={18} />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-white leading-tight">Secure Access</div>
                <div className="text-[9px] text-gray-400 font-medium">Encrypted System</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Users size={18} />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-white leading-tight">Role Based</div>
                <div className="text-[9px] text-gray-400 font-medium">Custom Control</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <BarChart3 size={18} />
              </div>
              <div>
                <div className="text-[11px] font-extrabold text-white leading-tight">Real-time</div>
                <div className="text-[9px] text-gray-400 font-medium">Live Analytics</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Floating Login Card */}
        <div className="w-full lg:w-[50%] xl:w-[48%] min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 z-10 relative bg-[#F8F9FD]">
          
          {/* Top Right Branding */}
          <div className="flex justify-end items-center">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.png?v=3" 
                alt="Chalapathi University" 
                className="h-10 sm:h-12 w-auto object-contain" 
              />
            </div>
          </div>

          {/* Center Floating White Login Card */}
          <div className="my-auto max-w-[440px] w-full mx-auto bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_20px_60px_rgba(7,26,58,0.07)] border border-gray-100/80 text-left font-[var(--font-poppins)]">
            
            {/* Circular Crest Badge */}
            <div className="w-20 h-20 rounded-full bg-white border border-gray-200/90 shadow-md flex items-center justify-center mx-auto mb-5 p-3">
              <img 
                src="/logo.png?v=3" 
                alt="Chalapathi Crest" 
                className="w-full h-full object-contain" 
              />
            </div>

            {/* Title & Subtitle */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#071A3A] text-center tracking-tight">
              Admin Login
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-1.5 mb-8 font-medium">
              Sign in to access the central university CMS
            </p>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-200">
                  {authError}
                </div>
              )}

              {/* Username / Email */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                  Username / Email
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#071A3A] focus:ring-2 focus:ring-[#071A3A]/10 transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                  Password / Passcode
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password (default: admin123)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full h-12 pl-11 pr-12 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm font-medium focus:bg-white focus:outline-none focus:border-[#071A3A] focus:ring-2 focus:ring-[#071A3A]/10 transition-all placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                className="w-full h-12 bg-[#071A3A] hover:bg-[#05142E] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                Sign In to CMS <ArrowRight size={16} />
              </button>

              <div className="pt-2 text-center">
                <Link to="/" className="text-xs font-semibold text-gray-500 hover:text-[#071A3A] transition-colors">
                  ← Back to Home Page
                </Link>
              </div>
            </form>
          </div>

          <div className="text-center text-xs text-gray-400 font-medium">
            © 2026 Chalapathi University. All rights reserved.
          </div>
        </div>
      </div>
    );
  }

  const navItems: {
    id: "dashboard" | "homepage" | "about" | "academics" | "admissions" | "research" | "directories" | "campus-life" | "placements" | "news-events" | "contact" | "gallery" | "footer" | "settings";
    label: string;
    icon: any;
    badge?: string;
    section?: string;
  }[] = [
    // Administrative Top
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: `${enquiries.length}` },
    { id: "homepage", label: "Home (Homepage CMS)", icon: Sparkles },

    // Main Website Navigation Order (Matches Website Navbar 1:1)
    { id: "about", label: "Genesis & About Us", icon: Building, section: "MAIN WEBSITE PAGES" },
    { id: "academics", label: "Academics", icon: GraduationCap },
    { id: "admissions", label: "Admissions & Leads", icon: UserPlus, badge: `${enquiries.filter(e => e.status === "New").length || ""}` },
    { id: "research", label: "Research & Innovation", icon: Award },
    { id: "directories", label: "Faculty & Directories", icon: Users },
    { id: "campus-life", label: "Campus Life", icon: Library },
    { id: "placements", label: "Placements", icon: Briefcase },
    { id: "news-events", label: "News & Events", icon: Newspaper },
    { id: "contact", label: "Contact Us", icon: Phone },

    // Remaining Extra Sections in the Bottom
    { id: "gallery", label: "Gallery & Media", icon: ImageIcon, section: "REMAINING EXTRA SECTIONS" },
    { id: "footer", label: "Footer", icon: Layers },
    { id: "settings", label: "Website Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-[var(--font-poppins)] text-slate-800 flex flex-col antialiased">
      {/* Save Notification Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-[99999] bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold"
          >
            <CheckCircle2 size={16} />
            {saveMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation Bar */}
      <header className="h-16 bg-[#072A6C] text-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="flex md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-lg p-1 flex items-center justify-center">
              <img src="/logo.png?v=3" alt="Chalapathi" className="h-6 w-auto object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider leading-none">Chalapathi CMS</h1>
              <span className="text-[10px] text-blue-200 font-medium leading-none">Admin Control Center</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastSavedTime && (
            <span className="hidden lg:inline-flex items-center gap-1.5 text-[10px] bg-white/10 px-2.5 py-1 rounded-full text-blue-100 font-medium">
              <Clock size={11} /> Last saved: {lastSavedTime}
            </span>
          )}

          <Link
            to="/"
            target="_blank"
            className="h-8 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">View Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="h-8 px-3 bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Body Layout (Sidebar + Main Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`bg-[#051c4a] text-white flex flex-col shrink-0 transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-18"
          } hidden md:flex border-r border-blue-950/40 select-none`}
        >
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <React.Fragment key={item.id}>
                  {item.section && sidebarOpen && (
                    <div className="pt-3 pb-1 px-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-300/80">
                        {item.section}
                      </span>
                    </div>
                  )}
                  {item.section && !sidebarOpen && (
                    <div className="my-2 border-t border-white/10" />
                  )}
                  <button
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#D4AF37] text-slate-900 shadow-md"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                    title={item.label}
                  >
                    <Icon size={18} className="shrink-0" />
                    {sidebarOpen && <span className="flex-1 truncate">{item.label}</span>}
                    {sidebarOpen && item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold ${
                          isActive ? "bg-slate-900 text-white" : "bg-blue-600 text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <div className="p-3 border-t border-white/10">
            <button
              onClick={resetToDefaults}
              className="w-full h-8 px-2 bg-white/5 hover:bg-red-500/20 text-red-200 hover:text-red-100 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              {sidebarOpen && "Restore Defaults"}
            </button>
          </div>
        </aside>

        {/* Mobile Drawer Sidebar */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 flex md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div
              className="w-64 bg-[#051c4a] text-white h-full p-4 flex flex-col space-y-1 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
                <h3 className="font-bold text-xs uppercase tracking-wider text-blue-200">CMS Menu</h3>
                <button onClick={() => setMobileSidebarOpen(false)} className="text-white">
                  <X size={18} />
                </button>
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <React.Fragment key={item.id}>
                    {item.section && (
                      <div className="pt-3 pb-1 px-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-300/80">
                          {item.section}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                        isActive ? "bg-[#D4AF37] text-slate-900 shadow-md" : "text-blue-100 hover:bg-white/10"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1 truncate">{item.label}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 1: DASHBOARD OVERVIEW                            */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <SectionHeader
                title="CMS Overview & Quick Actions"
                subtitle="Manage and monitor all university website content in real-time"
                icon={LayoutDashboard}
              />

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800">{programs.length}</span>
                    <p className="text-xs text-gray-500 font-medium">Academic Programs</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800">{enquiries.length}</span>
                    <p className="text-xs text-gray-500 font-medium">Enquiry Leads</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Newspaper size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800">{news.length + events.length}</span>
                    <p className="text-xs text-gray-500 font-medium">News & Events</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800">{announcements.length}</span>
                    <p className="text-xs text-gray-500 font-medium">Announcements</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-4">
                <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">Quick Management Shortcuts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button
                    onClick={() => setActiveTab("homepage")}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer"
                  >
                    <Sparkles size={20} className="text-[#072A6C]" />
                    <span className="text-xs font-bold text-slate-700">Homepage Sections</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("homepage"); setActiveHomeSubTab("placements"); }}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer"
                  >
                    <Briefcase size={20} className="text-[#D4AF37]" />
                    <span className="text-xs font-bold text-slate-700">Placement Stories</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab("homepage"); setActiveHomeSubTab("virtualTour"); }}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer"
                  >
                    <MapPin size={20} className="text-blue-600" />
                    <span className="text-xs font-bold text-slate-700">Admissions & Map</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("admissions")}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer"
                  >
                    <UserPlus size={20} className="text-emerald-600" />
                    <span className="text-xs font-bold text-slate-700">Enquiries ({enquiries.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("news-events")}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer"
                  >
                    <Newspaper size={20} className="text-amber-600" />
                    <span className="text-xs font-bold text-slate-700">Post News/Events</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("academics")}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer"
                  >
                    <GraduationCap size={20} className="text-purple-600" />
                    <span className="text-xs font-bold text-slate-700">Edit Programs</span>
                  </button>
                </div>
              </div>

              {/* Recent Enquiries Preview */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">Recent Admission Enquiries</h3>
                  <button
                    onClick={() => setActiveTab("admissions")}
                    className="text-xs text-[#072A6C] font-bold hover:underline cursor-pointer"
                  >
                    View All Enquiries →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-gray-500 uppercase text-[10px] font-bold border-b border-gray-200">
                      <tr>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Mobile</th>
                        <th className="p-2.5">Program</th>
                        <th className="p-2.5">City</th>
                        <th className="p-2.5">Date</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {enquiries.slice(0, 5).map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-bold text-slate-800">{e.name}</td>
                          <td className="p-2.5 text-gray-600">{e.mobile}</td>
                          <td className="p-2.5 text-gray-700 font-medium">{e.program}</td>
                          <td className="p-2.5 text-gray-600">{e.city}</td>
                          <td className="p-2.5 text-gray-500">{e.date}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">
                              {e.status || "New"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 2: HOMEPAGE CMS                                  */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "homepage" && (
            <div className="space-y-6 animate-fade-in">
              <SectionHeader
                title="Homepage CMS & Section Controls"
                subtitle="Control homepage section ordering, visibility, hero slides, chairman message, and styling"
                icon={Sparkles}
                onSave={saveHomepageSections}
                onReset={() => {
                  setSectionsList(DEFAULT_HOMEPAGE_SECTIONS);
                  updateHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
                  setSlides(INITIAL_HERO_SLIDES);
                  updateHeroSlides(INITIAL_HERO_SLIDES);
                  notifySave("Homepage configuration reset to default!");
                }}
                resetLabel="Reset Homepage"
                saveSuccess={saveSuccess}
              />

              {/* Sub-tabs */}
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                {[
                  { id: "ordering", label: "Section Ordering & Visibility" },
                  { id: "hero", label: "1. Hero Carousel" },
                  { id: "ticker", label: "2. Admission Ticker" },
                  { id: "stats", label: "3. Key Statistics" },
                  { id: "whyChoose", label: "4. Why Choose Us" },
                  { id: "programs", label: "5. Schools & Programs" },
                  { id: "newsEvents", label: "6. News & Events" },
                  { id: "campusLife", label: "7. Campus Life & Videos" },
                  { id: "chairman", label: "8. Chairman's Message" },
                  { id: "placements", label: "🌟 9. Placement Success Stories & Partners" },
                  { id: "virtualTour", label: "📍 10. Admissions Open Banner & Visit Us" },
                  { id: "styling", label: "Homepage Colors & Style" }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActiveHomeSubTab(st.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeHomeSubTab === st.id
                        ? "bg-[#072A6C] text-white shadow-xs"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Sub-tab: Ordering & Visibility */}
              {activeHomeSubTab === "ordering" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">Homepage Sections Sequence</h3>
                      <p className="text-xs text-gray-500">Reorder sections up/down, toggle visibility, or click "Edit Content" on any section</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSectionsList(DEFAULT_HOMEPAGE_SECTIONS);
                          updateHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
                          notifySave("Section ordering reset to default!");
                        }}
                        className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={13} /> Reset Order
                      </button>
                      <button
                        onClick={saveHomepageSections}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save Order
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {sectionsList.map((sec, idx) => {
                      const sectionFriendlyNames: Record<string, string> = {
                        hero: "1. Hero Carousel",
                        ticker: "2. Admission Ticker",
                        stats: "3. Key Statistics",
                        whyChooseUs: "4. Why Choose Us",
                        whyChoose: "4. Why Choose Us",
                        programs: "5. Schools & Programs",
                        newsEvents: "6. News & Events",
                        campusLife: "7. Campus Life & Videos",
                        chairman: "8. Chairman's Message",
                        placements: "9. Placements & Corporate Partners",
                        certifications: "9. Placements & Corporate Partners",
                        virtualTour: "10. Admissions Strip & Visit Us",
                        admissionsStrip: "10. Admissions Strip & Visit Us"
                      };

                      const tabMapping: Record<string, string> = {
                        hero: "hero",
                        ticker: "ticker",
                        stats: "stats",
                        whyChooseUs: "whyChoose",
                        whyChoose: "whyChoose",
                        programs: "programs",
                        newsEvents: "newsEvents",
                        campusLife: "campusLife",
                        chairman: "chairman",
                        placements: "placements",
                        virtualTour: "virtualTour"
                      };

                      return (
                        <div
                          key={sec.id}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border gap-3 transition-all ${
                            sec.enabled ? "bg-white border-gray-200 shadow-xs" : "bg-gray-50 border-gray-200 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">{sectionFriendlyNames[sec.id] || sec.name}</h4>
                              <span className="text-[10px] text-gray-400 font-mono">ID: {sec.id}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => {
                                const target = tabMapping[sec.id] || "ordering";
                                setActiveHomeSubTab(target as any);
                              }}
                              className="h-7 px-2.5 bg-blue-50 hover:bg-blue-100 text-[#072A6C] text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-colors border border-blue-200"
                            >
                              <Edit3 size={12} /> Edit Content
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleSectionEnable(sec.id)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                                sec.enabled ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {sec.enabled ? "Visible (ON)" : "Hidden (OFF)"}
                            </button>

                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveSection(idx, "up")}
                              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === sectionsList.length - 1}
                              onClick={() => moveSection(idx, "down")}
                              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sub-tab: Hero Slides */}
              {activeHomeSubTab === "hero" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">Hero Banner Slides Carousel</h3>
                      <p className="text-xs text-gray-500">Add or replace full-width banner slides displayed at top of homepage</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveHomeSubTab("ordering")}
                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ← Back to Ordering
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSlides(INITIAL_HERO_SLIDES);
                          updateHeroSlides(INITIAL_HERO_SLIDES);
                          notifySave("Hero banner slides reset to default!");
                        }}
                        className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        title="Reset to default slides"
                      >
                        <RotateCcw size={13} /> Reset Slides
                      </button>
                      <button
                        onClick={handleAddHeroSlide}
                        className="h-9 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus size={14} /> Add Slide
                      </button>
                      <button
                        onClick={saveHeroSlides}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save Slides
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {slides.map((slide, idx) => (
                      <div key={slide.id} className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-[#072A6C]">Slide #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHeroSlide(slide.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>

                        <ImageField
                          label="Slide Banner Image"
                          value={slide.image || INITIAL_HERO_SLIDES[idx]?.image || "/banner_v2.png"}
                          defaultValue={INITIAL_HERO_SLIDES[idx]?.image || "/banner_v2.png"}
                          onReset={() => {
                            const fallback = INITIAL_HERO_SLIDES[idx]?.image || "/banner_v2.png";
                            handleUpdateHeroSlide(idx, "image", fallback);
                            notifySave("Slide banner image reset to default!");
                          }}
                          onChange={(val) => handleUpdateHeroSlide(idx, "image", val)}
                          aspectRatio="banner"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Heading Title (Optional)</label>
                            <input
                              type="text"
                              value={slide.title || ""}
                              onChange={(e) => handleUpdateHeroSlide(idx, "title", e.target.value)}
                              placeholder="e.g. WELCOME TO CHALAPATHI"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Subtitle (Optional)</label>
                            <input
                              type="text"
                              value={slide.subtitle || ""}
                              onChange={(e) => handleUpdateHeroSlide(idx, "subtitle", e.target.value)}
                              placeholder="e.g. Inspiring Excellence & Innovation"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab: Admission Ticker */}
              {activeHomeSubTab === "ticker" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">Admissions Alert Marquee Ticker</h3>
                      <p className="text-xs text-gray-500">Edit the animated ticker text that scrolls below hero banner</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveHomeSubTab("ordering")}
                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ← Back to Ordering
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const defTicker = DEFAULT_HOMEPAGE_SECTIONS.find((s) => s.id === "ticker");
                          if (defTicker) {
                            const tickerIndex = sectionsList.findIndex((s) => s.id === "ticker");
                            const updated = [...sectionsList];
                            updated[tickerIndex] = { ...updated[tickerIndex], title: defTicker.title, bgColor: defTicker.bgColor, textColor: defTicker.textColor };
                            setSectionsList(updated);
                            updateHomepageSections(updated);
                            notifySave("Ticker content reset to default!");
                          }
                        }}
                        className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={13} /> Reset Ticker
                      </button>
                      <button
                        onClick={saveHomepageSections}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save Ticker
                      </button>
                    </div>
                  </div>

                  {(() => {
                    const tickerIndex = sectionsList.findIndex((s) => s.id === "ticker");
                    const ticker = sectionsList[tickerIndex] || { title: "", bgColor: "#F4B400", textColor: "#0A2D6D" };
                    return (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-gray-700 uppercase">Marquee Text Content</label>
                          <textarea
                            rows={3}
                            value={ticker.title || ""}
                            onChange={(e) => {
                              const updated = [...sectionsList];
                              updated[tickerIndex] = { ...updated[tickerIndex], title: e.target.value };
                              setSectionsList(updated);
                            }}
                            className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <ColorField
                            label="Ticker Background Color"
                            value={ticker.bgColor || "#F4B400"}
                            onChange={(val) => {
                              const updated = [...sectionsList];
                              updated[tickerIndex] = { ...updated[tickerIndex], bgColor: val };
                              setSectionsList(updated);
                            }}
                          />
                          <ColorField
                            label="Ticker Text Color"
                            value={ticker.textColor || "#0A2D6D"}
                            onChange={(val) => {
                              const updated = [...sectionsList];
                              updated[tickerIndex] = { ...updated[tickerIndex], textColor: val };
                              setSectionsList(updated);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Sub-tab: Key Statistics Bar */}
              {activeHomeSubTab === "stats" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">Statistics Bar Counters</h3>
                      <p className="text-xs text-gray-500">Manage the 6 live counters displayed on homepage</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveHomeSubTab("ordering")}
                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ← Back to Ordering
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const defStats = DEFAULT_HOMEPAGE_SECTIONS.find((s) => s.id === "stats")?.extraData || [];
                          setStatsData(defStats);
                          const updated = sectionsList.map((s) => (s.id === "stats" ? { ...s, extraData: defStats } : s));
                          setSectionsList(updated);
                          updateHomepageSections(updated);
                          notifySave("Statistics bar reset to default!");
                        }}
                        className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={13} /> Reset Stats
                      </button>
                      <button
                        onClick={saveStats}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save Stats
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {statsData.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/50 space-y-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Counter #{idx + 1}</span>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Number Value</label>
                          <input
                            type="text"
                            value={item.n || ""}
                            onChange={(e) => {
                              const updated = [...statsData];
                              updated[idx] = { ...updated[idx], n: e.target.value };
                              setStatsData(updated);
                            }}
                            className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#D4AF37]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Label Text</label>
                          <input
                            type="text"
                            value={item.label || ""}
                            onChange={(e) => {
                              const updated = [...statsData];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setStatsData(updated);
                            }}
                            className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-semibold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab: Why Choose Us */}
              {activeHomeSubTab === "whyChoose" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">Why Choose Us Feature Cards</h3>
                      <p className="text-xs text-gray-500">Edit heading, subtext and the 6 key differentiator cards</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveHomeSubTab("ordering")}
                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ← Back to Ordering
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const defWhy = DEFAULT_HOMEPAGE_SECTIONS.find((s) => s.id === "whyChoose")?.extraData || [];
                          setWhyChooseData(defWhy);
                          const updated = sectionsList.map((s) => (s.id === "whyChoose" ? { ...s, extraData: defWhy } : s));
                          setSectionsList(updated);
                          updateHomepageSections(updated);
                          notifySave("Why Choose Us cards reset to default!");
                        }}
                        className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={13} /> Reset Cards
                      </button>
                      <button
                        onClick={saveWhyChoose}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save Cards
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {whyChooseData.map((card, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase">Card #{idx + 1}</span>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Title</label>
                          <input
                            type="text"
                            value={card.title || ""}
                            onChange={(e) => {
                              const updated = [...whyChooseData];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setWhyChooseData(updated);
                            }}
                            className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Description</label>
                          <textarea
                            rows={3}
                            value={card.desc || ""}
                            onChange={(e) => {
                              const updated = [...whyChooseData];
                              updated[idx] = { ...updated[idx], desc: e.target.value };
                              setWhyChooseData(updated);
                            }}
                            className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg font-medium"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab: Schools & Programs */}
              {activeHomeSubTab === "programs" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                        <GraduationCap size={16} className="text-[#072A6C]" />
                        Explore Our Schools & Programs CMS
                      </h3>
                      <p className="text-xs text-gray-500">Configure schools, category/department tabs, and individual degree course cards with photos & target sizes</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveHomeSubTab("ordering")}
                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ← Back to Ordering
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAcademicData(DEFAULT_ACADEMIC_STRUCTURE);
                          updateAcademicStructure(DEFAULT_ACADEMIC_STRUCTURE);
                          notifySave("Reset all schools, categories & program cards to defaults!");
                        }}
                        className="h-9 px-3.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-300 hover:border-red-300 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Revert all programs and photos to defaults"
                      >
                        <RotateCcw size={13} /> Reset All Programs
                      </button>
                      <button
                        onClick={saveProgramsSection}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                      >
                        <Save size={13} /> Save All Programs
                      </button>
                    </div>
                  </div>

                  {/* Section Headings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/70 border border-gray-200/80">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Main Heading</label>
                      <input
                        type="text"
                        value={programsSectionData.title}
                        onChange={(e) => setProgramsSectionData({ ...programsSectionData, title: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-bold text-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Subtitle / Tagline</label>
                      <input
                        type="text"
                        value={programsSectionData.subtitle}
                        onChange={(e) => setProgramsSectionData({ ...programsSectionData, subtitle: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                      />
                    </div>
                  </div>

                  {/* School Selector Tabs */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                        1. Select School / Faculty ({Object.keys(academicData).length})
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const name = prompt("Enter new school name (e.g. School of Pharmacy):");
                          if (!name) return;
                          const updated = { ...academicData, [name]: {} };
                          setAcademicData(updated);
                          setActiveAdminSchool(name);
                          setActiveAdminDept("");
                        }}
                        className="h-7 px-3 bg-blue-50 text-[#072A6C] hover:bg-blue-100 border border-blue-200 text-[10.5px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add School
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl border border-gray-200">
                      {Object.keys(academicData).map((school) => {
                        const isActive = activeAdminSchool === school;
                        return (
                          <div key={school} className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveAdminSchool(school);
                                const depts = Object.keys(academicData[school] || {});
                                setActiveAdminDept(depts[0] || "");
                              }}
                              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isActive
                                  ? "bg-[#072A6C] text-white shadow-sm"
                                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                              }`}
                            >
                              {school}
                            </button>
                            {isActive && (
                              <button
                                type="button"
                                title="Delete School"
                                onClick={() => {
                                  if (Object.keys(academicData).length <= 1) {
                                    alert("At least one school must be kept.");
                                    return;
                                  }
                                  if (window.confirm(`Delete ${school} and all its categories?`)) {
                                    const copy = { ...academicData };
                                    delete copy[school];
                                    setAcademicData(copy);
                                    const remaining = Object.keys(copy);
                                    setActiveAdminSchool(remaining[0] || "");
                                    setActiveAdminDept(Object.keys(copy[remaining[0]] || {})[0] || "");
                                  }
                                }}
                                className="p-1.5 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Department / Category Tabs under Selected School */}
                  {activeAdminSchool && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                          2. Categories / Departments under "{activeAdminSchool}"
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const name = prompt(`Enter new category name under ${activeAdminSchool} (e.g. Artificial Intelligence):`);
                            if (!name) return;
                            const schoolDepts = academicData[activeAdminSchool] || {};
                            const updated = {
                              ...academicData,
                              [activeAdminSchool]: {
                                ...schoolDepts,
                                [name]: []
                              }
                            };
                            setAcademicData(updated);
                            setActiveAdminDept(name);
                          }}
                          className="h-7 px-3 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-[10.5px] font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} /> Add Category
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-xl border border-gray-200">
                        {Object.keys(academicData[activeAdminSchool] || {}).map((dept) => {
                          const isActive = activeAdminDept === dept;
                          return (
                            <div key={dept} className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setActiveAdminDept(dept)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isActive
                                    ? "bg-[#D4AF37] text-slate-900 shadow-sm font-extrabold"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                              >
                                {dept}
                              </button>
                              {isActive && (
                                <button
                                  type="button"
                                  title="Delete Category"
                                  onClick={() => {
                                    if (window.confirm(`Delete category "${dept}"?`)) {
                                      const schoolDepts = { ...academicData[activeAdminSchool] };
                                      delete schoolDepts[dept];
                                      const updated = {
                                        ...academicData,
                                        [activeAdminSchool]: schoolDepts
                                      };
                                      setAcademicData(updated);
                                      setActiveAdminDept(Object.keys(schoolDepts)[0] || "");
                                    }
                                  }}
                                  className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          );
                        })}
                        {Object.keys(academicData[activeAdminSchool] || {}).length === 0 && (
                          <div className="text-xs text-gray-400 p-2 italic">
                            No categories yet. Click "+ Add Category" to create one.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Course Cards under Selected Category */}
                  {activeAdminSchool && activeAdminDept && (
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <div>
                          <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                            3. Degree Programs / Course Cards in "{activeAdminDept}" ({academicData[activeAdminSchool]?.[activeAdminDept]?.length || 0})
                          </h4>
                          <p className="text-[11px] text-gray-400">Each card appears on the homepage with an interactive hover state and illustration/photo</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newCard: CourseLinkItem = {
                              label: "B.Tech. Program Name",
                              to: `/academics/program-${Date.now()}`,
                              desc: "Program curriculum overview and career pathways.",
                              image: ""
                            };
                            const currentCards = academicData[activeAdminSchool]?.[activeAdminDept] || [];
                            const updated = {
                              ...academicData,
                              [activeAdminSchool]: {
                                ...(academicData[activeAdminSchool] || {}),
                                [activeAdminDept]: [...currentCards, newCard]
                              }
                            };
                            setAcademicData(updated);
                          }}
                          className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus size={13} /> Add Course Card
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {(academicData[activeAdminSchool]?.[activeAdminDept] || []).map((course, cIdx) => (
                          <div key={cIdx} className="p-4 rounded-xl border border-gray-200 bg-slate-50/70 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#072A6C]">Course Card #{cIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const currentCards = [...(academicData[activeAdminSchool]?.[activeAdminDept] || [])];
                                  currentCards.splice(cIdx, 1);
                                  const updated = {
                                    ...academicData,
                                    [activeAdminSchool]: {
                                      ...(academicData[activeAdminSchool] || {}),
                                      [activeAdminDept]: currentCards
                                    }
                                  };
                                  setAcademicData(updated);
                                }}
                                className="text-red-500 hover:text-red-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={12} /> Remove
                              </button>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-600 uppercase">Program Degree Title</label>
                              <input
                                type="text"
                                value={course.label}
                                onChange={(e) => {
                                  const currentCards = [...(academicData[activeAdminSchool]?.[activeAdminDept] || [])];
                                  currentCards[cIdx] = { ...currentCards[cIdx], label: e.target.value };
                                  setAcademicData({
                                    ...academicData,
                                    [activeAdminSchool]: {
                                      ...(academicData[activeAdminSchool] || {}),
                                      [activeAdminDept]: currentCards
                                    }
                                  });
                                }}
                                className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-slate-800"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-600 uppercase">Target Page URL / Slug</label>
                              <input
                                type="text"
                                value={course.to}
                                onChange={(e) => {
                                  const currentCards = [...(academicData[activeAdminSchool]?.[activeAdminDept] || [])];
                                  currentCards[cIdx] = { ...currentCards[cIdx], to: e.target.value };
                                  setAcademicData({
                                    ...academicData,
                                    [activeAdminSchool]: {
                                      ...(academicData[activeAdminSchool] || {}),
                                      [activeAdminDept]: currentCards
                                    }
                                  });
                                }}
                                placeholder="/academics/btech-cse"
                                className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-mono text-gray-700"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-600 uppercase">Hover Description</label>
                              <textarea
                                rows={2}
                                value={course.desc || ""}
                                onChange={(e) => {
                                  const currentCards = [...(academicData[activeAdminSchool]?.[activeAdminDept] || [])];
                                  currentCards[cIdx] = { ...currentCards[cIdx], desc: e.target.value };
                                  setAcademicData({
                                    ...academicData,
                                    [activeAdminSchool]: {
                                      ...(academicData[activeAdminSchool] || {}),
                                      [activeAdminDept]: currentCards
                                    }
                                  });
                                }}
                                placeholder="Short summary displayed on hover"
                                className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg"
                              />
                            </div>

                            {/* ImageField with prominent target size & reset button */}
                            <ImageField
                              label="Course Illustration / Photo"
                              value={course.image || getFallbackCourseImage(course.label)}
                              defaultValue={getFallbackCourseImage(course.label)}
                              onReset={() => {
                                const fallback = getFallbackCourseImage(course.label);
                                const currentCards = [...(academicData[activeAdminSchool]?.[activeAdminDept] || [])];
                                currentCards[cIdx] = { ...currentCards[cIdx], image: fallback };
                                setAcademicData({
                                  ...academicData,
                                  [activeAdminSchool]: {
                                    ...(academicData[activeAdminSchool] || {}),
                                    [activeAdminDept]: currentCards
                                  }
                                });
                                notifySave("Course photo reset to default illustration!");
                              }}
                              onChange={(val) => {
                                const currentCards = [...(academicData[activeAdminSchool]?.[activeAdminDept] || [])];
                                currentCards[cIdx] = { ...currentCards[cIdx], image: val };
                                setAcademicData({
                                  ...academicData,
                                  [activeAdminSchool]: {
                                    ...(academicData[activeAdminSchool] || {}),
                                    [activeAdminDept]: currentCards
                                  }
                                });
                              }}
                              aspectRatio="square"
                              recommendedSize="120 × 120 px (Square PNG/SVG)"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab: News & Events Highlights */}
              {activeHomeSubTab === "newsEvents" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                        <Newspaper size={16} className="text-[#072A6C]" />
                        News & Events Highlights CMS
                      </h3>
                      <p className="text-xs text-gray-500">Configure Featured News hero card, Latest News list (4 items), and Upcoming Events list (4 items)</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveHomeSubTab("ordering")}
                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ← Back to Ordering
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewsList(INITIAL_NEWS);
                          setEventsList(INITIAL_EVENTS);
                          updateNews(INITIAL_NEWS);
                          updateEvents(INITIAL_EVENTS);
                          const defNewsEvents = DEFAULT_HOMEPAGE_SECTIONS.find((s) => s.id === "newsEvents");
                          setNewsEventsData({
                            title: defNewsEvents?.title || "News & Events",
                            subtitle: defNewsEvents?.subtitle || "Stay Informed. Stay Ahead. Discover the latest updates and exciting events happening at Chalapathi.",
                            buttonText: defNewsEvents?.buttonText || "View All News & Events",
                            buttonUrl: defNewsEvents?.buttonUrl || "/news"
                          });
                          notifySave("News & Events highlights reset to default!");
                        }}
                        className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={13} /> Reset News & Events
                      </button>
                      <button
                        onClick={saveNewsEventsSection}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                      >
                        <Save size={13} /> Save News & Events
                      </button>
                    </div>
                  </div>

                  {/* Section Headings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/70 border border-gray-200/80">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Main Heading</label>
                      <input
                        type="text"
                        value={newsEventsData.title}
                        onChange={(e) => setNewsEventsData({ ...newsEventsData, title: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-bold text-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Subtitle / Description</label>
                      <input
                        type="text"
                        value={newsEventsData.subtitle}
                        onChange={(e) => setNewsEventsData({ ...newsEventsData, subtitle: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                      />
                    </div>
                  </div>

                  {/* 3 Linearly Aligned Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT COLUMN: Featured News Hero Card (lg:col-span-6) */}
                    <div className="lg:col-span-6 p-5 rounded-2xl border border-blue-200/80 bg-blue-50/30 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                          <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                            Column 1: Featured News Card (50% Width)
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold text-[#D4AF37] bg-amber-100/60 px-2 py-0.5 rounded">
                          Hero Card
                        </span>
                      </div>

                      {newsList.length > 0 && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Article Title</label>
                            <input
                              type="text"
                              value={newsList[0]?.title || ""}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[0] = { ...updated[0], title: e.target.value };
                                setNewsList(updated);
                              }}
                              className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-bold text-slate-800"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-600 uppercase">Category Badge</label>
                              <input
                                type="text"
                                value={newsList[0]?.category || ""}
                                onChange={(e) => {
                                  const updated = [...newsList];
                                  updated[0] = { ...updated[0], category: e.target.value };
                                  setNewsList(updated);
                                }}
                                placeholder="e.g. ACHIEVEMENT"
                                className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#D4AF37]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-600 uppercase">Date</label>
                              <input
                                type="text"
                                value={newsList[0]?.date || ""}
                                onChange={(e) => {
                                  const updated = [...newsList];
                                  updated[0] = { ...updated[0], date: e.target.value };
                                  setNewsList(updated);
                                }}
                                placeholder="17 May 2025"
                                className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-medium"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Summary / Excerpt</label>
                            <textarea
                              rows={3}
                              value={newsList[0]?.excerpt || ""}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[0] = { ...updated[0], excerpt: e.target.value };
                                setNewsList(updated);
                              }}
                              className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-lg leading-relaxed font-medium"
                            />
                          </div>

                          <ImageField
                            label="Featured Cover Photo"
                            value={newsList[0]?.image || INITIAL_NEWS[0]?.image || ""}
                            defaultValue={INITIAL_NEWS[0]?.image || ""}
                            onReset={() => {
                              const fallback = INITIAL_NEWS[0]?.image || "";
                              const updated = [...newsList];
                              if (updated[0]) {
                                updated[0] = { ...updated[0], image: fallback };
                                setNewsList(updated);
                              }
                              notifySave("Featured cover photo reset to default!");
                            }}
                            onChange={(val) => {
                              const updated = [...newsList];
                              if (updated[0]) {
                                updated[0] = { ...updated[0], image: val };
                                setNewsList(updated);
                              }
                            }}
                            aspectRatio="wide"
                            recommendedSize="1200 × 800 px (3:2 Landscape)"
                          />
                        </div>
                      )}
                    </div>

                    {/* CENTER COLUMN: Latest News (lg:col-span-3) */}
                    <div className="lg:col-span-3 p-4 rounded-2xl border border-gray-200 bg-slate-50/70 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                          Column 2: Latest News
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const newNews: NewsArticle = {
                              id: Date.now(),
                              title: "New University Milestone",
                              date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
                              time: "10:00 AM",
                              location: "Campus",
                              category: "Campus Life",
                              excerpt: "Short news snippet description.",
                              bodyText: "Full article text.",
                              image: "/prog_computer.png",
                              slug: "news-" + Date.now()
                            };
                            if (newsList.length > 0) {
                              setNewsList([newsList[0], newNews, ...newsList.slice(1)]);
                            } else {
                              setNewsList([newNews]);
                            }
                          }}
                          className="h-6 px-2 bg-[#072A6C] text-white text-[10px] font-bold rounded cursor-pointer"
                        >
                          <Plus size={11} /> Add
                        </button>
                      </div>

                      <div className="space-y-3">
                        {newsList.slice(1, 5).map((item, sliceIdx) => {
                          const actualIdx = sliceIdx + 1;
                          return (
                            <div key={item.id || actualIdx} className="p-3 bg-white border border-gray-200 rounded-xl space-y-2 shadow-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-[#D4AF37]">Item #{sliceIdx + 1}</span>
                                <input
                                  type="text"
                                  value={item.date}
                                  onChange={(e) => {
                                    const updated = [...newsList];
                                    updated[actualIdx] = { ...updated[actualIdx], date: e.target.value };
                                    setNewsList(updated);
                                  }}
                                  placeholder="12 May 2025"
                                  className="w-24 h-6 px-1.5 text-[10px] bg-slate-50 border border-gray-200 rounded font-bold text-center"
                                />
                              </div>
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...newsList];
                                  updated[actualIdx] = { ...updated[actualIdx], title: e.target.value };
                                  setNewsList(updated);
                                }}
                                placeholder="News headline"
                                className="w-full h-7 px-2 text-[11px] font-bold bg-slate-50 border border-gray-200 rounded text-slate-800"
                              />
                              <textarea
                                rows={2}
                                value={item.excerpt || ""}
                                onChange={(e) => {
                                  const updated = [...newsList];
                                  updated[actualIdx] = { ...updated[actualIdx], excerpt: e.target.value };
                                  setNewsList(updated);
                                }}
                                placeholder="Excerpt"
                                className="w-full p-1.5 text-[10px] bg-slate-50 border border-gray-200 rounded text-gray-600"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Upcoming Events (lg:col-span-3) */}
                    <div className="lg:col-span-3 p-4 rounded-2xl border border-gray-200 bg-slate-50/70 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                          Column 3: Events
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const newEvent: EventItem = {
                              id: Date.now(),
                              slug: "event-" + Date.now(),
                              title: "Campus Conference 2026",
                              date: "20 Jun 2026",
                              time: "10:00 AM",
                              location: "Main Auditorium",
                              category: "Technology",
                              image: "/prog_engineering.png",
                              bodyText: "Full event schedule and details."
                            };
                            setEventsList([newEvent, ...eventsList]);
                          }}
                          className="h-6 px-2 bg-[#072A6C] text-white text-[10px] font-bold rounded cursor-pointer"
                        >
                          <Plus size={11} /> Add
                        </button>
                      </div>

                      <div className="space-y-3">
                        {eventsList.slice(0, 4).map((item, idx) => (
                          <div key={item.id || idx} className="p-3 bg-white border border-gray-200 rounded-xl space-y-2 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-[#D4AF37]">Event #{idx + 1}</span>
                              <input
                                type="text"
                                value={item.date}
                                onChange={(e) => {
                                  const updated = [...eventsList];
                                  updated[idx] = { ...updated[idx], date: e.target.value };
                                  setEventsList(updated);
                                }}
                                placeholder="12 Nov 2026"
                                className="w-24 h-6 px-1.5 text-[10px] bg-slate-50 border border-gray-200 rounded font-bold text-center"
                              />
                            </div>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...eventsList];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setEventsList(updated);
                              }}
                              placeholder="Event name"
                              className="w-full h-7 px-2 text-[11px] font-bold bg-slate-50 border border-gray-200 rounded text-slate-800"
                            />
                            <div className="grid grid-cols-2 gap-1.5">
                              <input
                                type="text"
                                value={item.time}
                                onChange={(e) => {
                                  const updated = [...eventsList];
                                  updated[idx] = { ...updated[idx], time: e.target.value };
                                  setEventsList(updated);
                                }}
                                placeholder="07:00 AM"
                                className="h-6 px-1.5 text-[10px] bg-slate-50 border border-gray-200 rounded"
                              />
                              <input
                                type="text"
                                value={item.location}
                                onChange={(e) => {
                                  const updated = [...eventsList];
                                  updated[idx] = { ...updated[idx], location: e.target.value };
                                  setEventsList(updated);
                                }}
                                placeholder="Location"
                                className="h-6 px-1.5 text-[10px] bg-slate-50 border border-gray-200 rounded"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Sub-tab: Chairman Message */}
              {activeHomeSubTab === "chairman" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">Chairman's Vision & Message</h3>
                      <p className="text-xs text-gray-500">Edit portrait, video URL, quote paragraphs, and titles</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveHomeSubTab("ordering")}
                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ← Back to Ordering
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const defL = INITIAL_ABOUT_CONTENT.leadership;
                          setChairmanData({
                            name: defL.chairmanName,
                            designation: defL.designation,
                            image: defL.chairmanImage,
                            videoUrl: "/chalapathi_logo_intro.mp4",
                            message: defL.messageParagraphs.join("\n\n")
                          });
                          notifySave("Chairman section reset to default!");
                        }}
                        className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={13} /> Reset Chairman
                      </button>
                      <button
                        onClick={saveChairman}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save Chairman
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Chairman Full Name</label>
                      <input
                        type="text"
                        value={chairmanData.name || ""}
                        onChange={(e) => setChairmanData({ ...chairmanData, name: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Designation / Title</label>
                      <input
                        type="text"
                        value={chairmanData.designation || ""}
                        onChange={(e) => setChairmanData({ ...chairmanData, designation: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-semibold"
                      />
                    </div>
                  </div>

                  <ImageField
                    label="Chairman Portrait Photo"
                    value={chairmanData.image || "/chairman_v4.png"}
                    defaultValue="/chairman_v4.png"
                    onReset={() => {
                      setChairmanData({ ...chairmanData, image: "/chairman_v4.png" });
                      notifySave("Chairman portrait reset to default!");
                    }}
                    onChange={(val) => setChairmanData({ ...chairmanData, image: val })}
                    aspectRatio="portrait"
                    recommendedSize="400 × 500 px (Portrait)"
                  />

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Intro Video / Video Message URL</label>
                    <input
                      type="text"
                      value={chairmanData.videoUrl || ""}
                      onChange={(e) => setChairmanData({ ...chairmanData, videoUrl: e.target.value })}
                      placeholder="/chalapathi_logo_intro.mp4"
                      className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Chairman's Message Text</label>
                    <textarea
                      rows={6}
                      value={chairmanData.message || ""}
                      onChange={(e) => setChairmanData({ ...chairmanData, message: e.target.value })}
                      className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl leading-relaxed font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Sub-tab: Campus Life & Media */}
              {activeHomeSubTab === "campusLife" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                        <Library size={16} className="text-[#072A6C]" />
                        Campus Life, Video Player & Media CMS
                      </h3>
                      <p className="text-xs text-gray-500">Edit 8 campus highlight cards, campus tour video player (with file size MB limits), and quotes</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveHomeSubTab("ordering")}
                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ← Back to Ordering
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCampusVideosList(DEFAULT_CAMPUS_VIDEOS);
                          setCampusTourData(DEFAULT_CAMPUS_TOUR);
                          setCampusGalleryList(DEFAULT_CAMPUS_GALLERY);
                          setCampusBannersData(DEFAULT_CAMPUS_BANNERS);
                          updateCampusVideos(DEFAULT_CAMPUS_VIDEOS);
                          updateCampusTour(DEFAULT_CAMPUS_TOUR);
                          updateCampusGallery(DEFAULT_CAMPUS_GALLERY);
                          updateCampusBanners(DEFAULT_CAMPUS_BANNERS);
                          notifySave("Campus life & media reset to default!");
                        }}
                        className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={13} /> Reset Campus Life
                      </button>
                      <button
                        onClick={saveFullCampusCMS}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                      >
                        <Save size={13} /> Save Campus Life & Videos
                      </button>
                    </div>
                  </div>

                  {/* Section Headings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50/70 border border-gray-200/80">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Main Heading</label>
                      <input
                        type="text"
                        value={campusTourData.heading || "CAMPUS LIFE"}
                        onChange={(e) => setCampusTourData({ ...campusTourData, heading: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-bold text-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Subtitle / Description</label>
                      <input
                        type="text"
                        value={campusTourData.subtitle || ""}
                        onChange={(e) => setCampusTourData({ ...campusTourData, subtitle: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                      />
                    </div>
                  </div>

                  {/* 8 Feature Cards Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                        1. Campus Life 8 Highlight Cards
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {campusCardsList.map((card, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400">Card #{idx + 1}</span>
                            <select
                              value={card.icon || "Users"}
                              onChange={(e) => {
                                const updated = [...campusCardsList];
                                updated[idx] = { ...updated[idx], icon: e.target.value };
                                setCampusCardsList(updated);
                              }}
                              className="h-6 px-1 text-[10px] font-bold bg-white border border-gray-200 rounded cursor-pointer"
                            >
                              <option value="Users">Users Icon</option>
                              <option value="GraduationCap">GraduationCap</option>
                              <option value="Trophy">Trophy</option>
                              <option value="Sparkles">Sparkles</option>
                              <option value="Building2">Building2</option>
                              <option value="Landmark">Landmark</option>
                              <option value="Coffee">Coffee</option>
                              <option value="Bus">Bus</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const updated = [...campusCardsList];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setCampusCardsList(updated);
                            }}
                            className="w-full h-7 px-2 text-xs font-bold bg-white border border-gray-200 rounded"
                          />
                          <textarea
                            rows={2}
                            value={card.desc}
                            onChange={(e) => {
                              const updated = [...campusCardsList];
                              updated[idx] = { ...updated[idx], desc: e.target.value };
                              setCampusCardsList(updated);
                            }}
                            className="w-full p-2 text-[11px] bg-white border border-gray-200 rounded leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campus Tour Video Player & Media CMS */}
                  <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                      <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                        🎬 2. Campus Tour Video Player & Media
                      </h4>
                      <span className="text-[10.5px] font-bold text-[#072A6C] bg-white px-2.5 py-0.5 rounded-md border border-blue-200">
                        Max Recommended Limit: 50.0 MB
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Top Badge Text</label>
                        <input
                          type="text"
                          value={campusTourData.badge || "WATCH CAMPUS TOUR"}
                          onChange={(e) => setCampusTourData({ ...campusTourData, badge: e.target.value })}
                          className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#D4AF37]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Video Quote Text</label>
                        <input
                          type="text"
                          value={campusTourData.quote || ""}
                          onChange={(e) => setCampusTourData({ ...campusTourData, quote: e.target.value })}
                          className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg italic text-gray-700"
                        />
                      </div>
                    </div>

                    {/* VideoField with validation, MB calculation, player preview */}
                    <VideoField
                      label="Main Campus Tour Video"
                      value={campusVideosList[0]?.url || "/chalapathi_logo_intro.mp4"}
                      sizeMb={campusVideosList[0]?.sizeMb || "12.4 MB"}
                      maxSizeMb={50}
                      recommendedLimit="Max 50.0 MB (MP4 / WebM)"
                      poster={campusTourData.poster || "/Chalapathimain.png"}
                      onChange={(url, sizeMb) => {
                        const updated = [...campusVideosList];
                        updated[0] = { ...updated[0], url, sizeMb: sizeMb || updated[0]?.sizeMb };
                        setCampusVideosList(updated);
                      }}
                      onSizeChange={(sizeMb) => {
                        const updated = [...campusVideosList];
                        updated[0] = { ...updated[0], sizeMb };
                        setCampusVideosList(updated);
                      }}
                    />

                    {/* Video Thumbnail / Poster with ImageField */}
                    <ImageField
                      label="Video Thumbnail / Poster Frame"
                      value={campusTourData.poster || "/Chalapathimain.png"}
                      defaultValue="/Chalapathimain.png"
                      onReset={() => {
                        setCampusTourData({ ...campusTourData, poster: "/Chalapathimain.png" });
                        notifySave("Video poster frame reset to default!");
                      }}
                      onChange={(val) => setCampusTourData({ ...campusTourData, poster: val })}
                      aspectRatio="video"
                      recommendedSize="1200 × 675 px (16:9 HD)"
                    />
                  </div>
                </div>
              )}

              {/* Sub-tab: Placements Highlights */}
              {activeHomeSubTab === "placements" && (() => {
                const currentStorySafeIdx = (activeStoryIdx >= 0 && activeStoryIdx < storiesList.length) ? activeStoryIdx : 0;
                const currStory = storiesList[currentStorySafeIdx] || INITIAL_SUCCESS_STORIES[0];

                const updateCurrentStory = (fieldUpdates: Partial<SuccessStory>) => {
                  const updated = [...storiesList];
                  updated[currentStorySafeIdx] = { ...updated[currentStorySafeIdx], ...fieldUpdates };
                  setStoriesList(updated);
                };

                const updateMilestone = (milestoneField: string, val: string) => {
                  const updated = [...storiesList];
                  const current = updated[currentStorySafeIdx];
                  updated[currentStorySafeIdx] = {
                    ...current,
                    milestones: {
                      ...current.milestones,
                      [milestoneField]: val
                    }
                  };
                  setStoriesList(updated);
                };

                const handleAddSkill = () => {
                  if (!newSkillText.trim()) return;
                  const currentSkills = currStory.skills || [];
                  if (!currentSkills.includes(newSkillText.trim())) {
                    updateCurrentStory({ skills: [...currentSkills, newSkillText.trim()] });
                  }
                  setNewSkillText("");
                };

                const handleRemoveSkill = (sIdx: number) => {
                  const currentSkills = currStory.skills || [];
                  updateCurrentStory({ skills: currentSkills.filter((_, i) => i !== sIdx) });
                };

                return (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-left space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                      <div>
                        <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                          <Briefcase size={16} className="text-[#072A6C]" />
                          Placement Key Metrics, Success Stories & Corporate Partners CMS
                        </h3>
                        <p className="text-xs text-gray-500">Configure homepage placement stats, full student success story testimonials with 4-step milestones, and corporate partner logos</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveHomeSubTab("ordering")}
                          className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          ← Back to Ordering
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const defPlacements = DEFAULT_HOMEPAGE_SECTIONS.find((s) => s.id === "placements" || s.id === "certifications");
                            setPlacementsSectionData({
                              title: defPlacements?.title || "A Step Towards Success!",
                              subtitle: defPlacements?.subtitle || "Building Careers. Creating Leaders.",
                              highestPackage: INITIAL_PLACEMENTS_CONTENT.highestPackage,
                              averagePackage: INITIAL_PLACEMENTS_CONTENT.averagePackage,
                              placementPercent: INITIAL_PLACEMENTS_CONTENT.placementPercent,
                              buttonText: defPlacements?.buttonText || "Explore Placements",
                              buttonUrl: defPlacements?.buttonUrl || "/placements",
                              storiesBadge: defPlacements?.extraData?.storiesBadge || "PLACEMENT SUCCESS STORIES",
                              storiesTitle: defPlacements?.extraData?.storiesTitle || "Our Students. Top Careers. Bright Futures.",
                              storiesSubtitle: defPlacements?.extraData?.storiesSubtitle || "Real stories from Chalapathi students who achieved successful careers through campus placements.",
                              partnersHeading: defPlacements?.extraData?.partnersHeading || "Our Top Corporate Partners"
                            });
                            setStoriesList(INITIAL_SUCCESS_STORIES);
                            setPlacementsForm(INITIAL_PLACEMENTS_CONTENT);
                            updatePlacementsContent(INITIAL_PLACEMENTS_CONTENT);
                            updateSuccessStories(INITIAL_SUCCESS_STORIES);
                            notifySave("Placements highlights, success stories & partners reset to defaults!");
                          }}
                          className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RotateCcw size={13} /> Reset All Defaults
                        </button>
                        <button
                          onClick={savePlacementsSection}
                          className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                        >
                          <Save size={13} /> Save Placements & Stories
                        </button>
                      </div>
                    </div>

                    {/* 1. Placement Section Main Headline & Subtitle Settings */}
                    <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/70 space-y-3">
                      <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-1.5">
                        <Sparkles size={14} className="text-[#D4AF37]" />
                        Section Headers & Captions
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Top Badge Text</label>
                          <input
                            type="text"
                            value={placementsSectionData.storiesBadge ?? "PLACEMENT SUCCESS STORIES"}
                            onChange={(e) => setPlacementsSectionData({ ...placementsSectionData, storiesBadge: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#D4AF37]"
                            placeholder="PLACEMENT SUCCESS STORIES"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Main Heading Title</label>
                          <input
                            type="text"
                            value={placementsSectionData.storiesTitle ?? "Our Students. Top Careers. Bright Futures."}
                            onChange={(e) => setPlacementsSectionData({ ...placementsSectionData, storiesTitle: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-black text-[#072A6C]"
                            placeholder="Our Students. Top Careers. Bright Futures."
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Section Subtitle / Description</label>
                          <input
                            type="text"
                            value={placementsSectionData.storiesSubtitle ?? "Real stories from Chalapathi students who achieved successful careers through campus placements."}
                            onChange={(e) => setPlacementsSectionData({ ...placementsSectionData, storiesSubtitle: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                            placeholder="Real stories from Chalapathi students..."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Corporate Partners Marquee Heading</label>
                          <input
                            type="text"
                            value={placementsSectionData.partnersHeading ?? "Our Top Corporate Partners"}
                            onChange={(e) => setPlacementsSectionData({ ...placementsSectionData, partnersHeading: e.target.value })}
                            className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                            placeholder="Our Top Corporate Partners"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4 Key Placement Metrics (Matches Website) */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-[#072A6C] uppercase">Placement Key Statistics (4 Highlights)</h4>
                        <span className="text-[10px] text-gray-400">Displayed in 4 cards above footer strip</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div className="p-3 rounded-xl border border-gray-200 bg-white shadow-xs space-y-1.5">
                          <span className="text-[10px] font-bold text-[#072A6C] uppercase flex items-center gap-1">
                            <Users size={12} /> Students Placed
                          </span>
                          <input
                            type="text"
                            value={placementsForm.stats?.[0]?.value ?? placementsForm.placementPercent ?? "92%"}
                            onChange={(e) => {
                              const currentStats = placementsForm.stats || [
                                { value: "92%", label: "Students Placed", icon: "Users" },
                                { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                              ];
                              const updated = [...currentStats];
                              updated[0] = { ...updated[0], value: e.target.value };
                              setPlacementsForm({ ...placementsForm, stats: updated, placementPercent: e.target.value });
                              setPlacementsSectionData({ ...placementsSectionData, placementPercent: e.target.value });
                            }}
                            className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-black text-[#072A6C]"
                            placeholder="e.g. 92%"
                          />
                        </div>

                        <div className="p-3 rounded-xl border border-gray-200 bg-white shadow-xs space-y-1.5">
                          <span className="text-[10px] font-bold text-[#D4AF37] uppercase flex items-center gap-1">
                            <Trophy size={12} /> Highest Package
                          </span>
                          <input
                            type="text"
                            value={placementsForm.stats?.[1]?.value ?? placementsForm.highestPackage ?? "30 LPA"}
                            onChange={(e) => {
                              const currentStats = placementsForm.stats || [
                                { value: "92%", label: "Students Placed", icon: "Users" },
                                { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                              ];
                              const updated = [...currentStats];
                              updated[1] = { ...updated[1], value: e.target.value };
                              setPlacementsForm({ ...placementsForm, stats: updated, highestPackage: e.target.value });
                              setPlacementsSectionData({ ...placementsSectionData, highestPackage: e.target.value });
                            }}
                            className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-black text-[#D4AF37]"
                            placeholder="e.g. 30 LPA"
                          />
                        </div>

                        <div className="p-3 rounded-xl border border-gray-200 bg-white shadow-xs space-y-1.5">
                          <span className="text-[10px] font-bold text-amber-600 uppercase flex items-center gap-1">
                            <Handshake size={12} /> Corporate Partners
                          </span>
                          <input
                            type="text"
                            value={placementsForm.stats?.[2]?.value ?? placementsForm.corporatePartnersCount ?? "116+"}
                            onChange={(e) => {
                              const currentStats = placementsForm.stats || [
                                { value: "92%", label: "Students Placed", icon: "Users" },
                                { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                              ];
                              const updated = [...currentStats];
                              updated[2] = { ...updated[2], value: e.target.value };
                              setPlacementsForm({ ...placementsForm, stats: updated, corporatePartnersCount: e.target.value });
                            }}
                            className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-black text-amber-600"
                            placeholder="e.g. 116+"
                          />
                        </div>

                        <div className="p-3 rounded-xl border border-gray-200 bg-white shadow-xs space-y-1.5">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                            <GraduationCap size={12} /> Placement Assistance
                          </span>
                          <input
                            type="text"
                            value={placementsForm.stats?.[3]?.value ?? placementsForm.placementAssistance ?? "100%"}
                            onChange={(e) => {
                              const currentStats = placementsForm.stats || [
                                { value: "92%", label: "Students Placed", icon: "Users" },
                                { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                              ];
                              const updated = [...currentStats];
                              updated[3] = { ...updated[3], value: e.target.value };
                              setPlacementsForm({ ...placementsForm, stats: updated, placementAssistance: e.target.value });
                            }}
                            className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-black text-emerald-600"
                            placeholder="e.g. 100%"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ══════════════════════════════════════════════════════════ */}
                    {/* PLACEMENT SUCCESS STORIES SHOWCASE CMS                     */}
                    {/* ══════════════════════════════════════════════════════════ */}
                    <div className="pt-6 border-t border-gray-100 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-1.5">
                            <Sparkles size={14} className="text-[#D4AF37]" />
                            Placement Success Stories Showcase ({storiesList.length} Stories)
                          </h4>
                          <p className="text-[11px] text-gray-500">Edit student testimonials, photos, 4-step milestone journeys, skills acquired, and dream packages</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const newStory: SuccessStory = {
                                id: Date.now(),
                                studentName: "New Student Name",
                                studentImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop&crop=face",
                                department: "B.Tech - Computer Science & Engineering",
                                batch: "2024 Batch",
                                companyName: "Google",
                                companyLogo: "/logos/google.svg",
                                packageOffered: "14.5 LPA",
                                description: "The holistic training, expert faculty, and placement bootcamps at Chalapathi University gave me the exact skills and confidence required to crack competitive campus recruitment rounds.",
                                skills: ["React", "TypeScript", "Python", "Data Structures", "System Design"],
                                internshipExp: "6 Months Technology Intern",
                                achievement: "Smart India Hackathon Finalist & Top Performer",
                                milestones: {
                                  learningTitle: "Strong Academic Foundation",
                                  learningDesc: "Conceptual clarity through innovative teaching",
                                  internshipTitle: "Skill Development",
                                  internshipDesc: "Live projects and industry-relevant skills",
                                  placementTitle: "Internship",
                                  placementDesc: "Internship experience boosted my practical knowledge",
                                  careerTitle: "Dream Career",
                                  careerDesc: "Campus placement opportunity secured"
                                }
                              };
                              const updated = [...storiesList, newStory];
                              setStoriesList(updated);
                              setActiveStoryIdx(updated.length - 1);
                              notifySave("New success story added! Customize fields below.");
                            }}
                            className="h-8 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Plus size={13} /> Add Success Story
                          </button>
                          {storiesList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove ${currStory.studentName}'s success story?`)) {
                                  const updated = storiesList.filter((_, i) => i !== currentStorySafeIdx);
                                  setStoriesList(updated);
                                  setActiveStoryIdx(Math.max(0, currentStorySafeIdx - 1));
                                  notifySave("Success story removed.");
                                }
                              }}
                              className="h-8 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 size={12} /> Delete Story
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setStoriesList(INITIAL_SUCCESS_STORIES);
                              setActiveStoryIdx(0);
                              updateSuccessStories(INITIAL_SUCCESS_STORIES);
                              notifySave("Success stories reset to 3 default students!");
                            }}
                            className="h-8 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw size={12} /> Reset Stories
                          </button>
                        </div>
                      </div>

                      {/* Story Switcher Tabs */}
                      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100">
                        {storiesList.map((st, sIdx) => {
                          const isCurrent = sIdx === currentStorySafeIdx;
                          return (
                            <button
                              key={st.id || sIdx}
                              type="button"
                              onClick={() => setActiveStoryIdx(sIdx)}
                              className={`h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                                isCurrent
                                  ? "bg-[#072A6C] text-white shadow-sm ring-2 ring-[#072A6C]/20"
                                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${isCurrent ? "bg-[#D4AF37] text-slate-900" : "bg-gray-300 text-gray-700"}`}>
                                {sIdx + 1}
                              </span>
                              <span>{st.studentName || `Story ${sIdx + 1}`}</span>
                              <span className={`text-[10px] font-semibold opacity-80 ${isCurrent ? "text-amber-200" : "text-gray-500"}`}>
                                ({st.companyName || "Partner"})
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* LIVE VISUAL PREVIEW CARD (Matches media_1789817710723.png) */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="text-[11px] font-black uppercase tracking-widest text-[#072A6C] flex items-center gap-1.5">
                            <Eye size={13} className="text-[#D4AF37]" /> Live Student Success Story Preview (Website Template Layout)
                          </span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                            Story #{currentStorySafeIdx + 1} of {storiesList.length}
                          </span>
                        </div>

                        {/* Interactive Template Card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                            {/* Left Column: Photo + Badges */}
                            <div className="lg:col-span-5 flex justify-center relative">
                              <div className="relative w-full max-w-[280px] h-[330px] rounded-[22px] overflow-hidden shadow-xl border border-gray-100 bg-gray-50">
                                <img 
                                  src={currStory.studentImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=600&fit=crop&crop=face"} 
                                  alt={currStory.studentName} 
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                              </div>

                              {/* Floating Placed At badge */}
                              <div className="absolute left-3 top-4 bg-white/90 backdrop-blur-md border border-white/60 rounded-xl p-2 flex items-center gap-2 shadow-md max-w-[150px]">
                                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center p-1 shadow-xs shrink-0">
                                  <img 
                                    src={currStory.companyLogo || "/logos/tcs.svg"} 
                                    alt={currStory.companyName} 
                                    className="w-full h-full object-contain"
                                    onError={(e) => { (e.target as HTMLImageElement).src = "/logos/tcs.svg"; }}
                                  />
                                </div>
                                <div className="text-left min-w-0">
                                  <span className="text-[7.5px] text-gray-400 font-bold block uppercase tracking-wider">Placed at</span>
                                  <span className="text-[10px] font-black text-[#072A6C] block truncate">{currStory.companyName || "Company"}</span>
                                </div>
                              </div>

                              {/* Floating Package Offered badge */}
                              <div className="absolute right-3 bottom-4 bg-white/90 backdrop-blur-md border border-white/60 rounded-xl p-2.5 shadow-md min-w-[110px] text-left">
                                <span className="text-[7.5px] text-gray-400 font-bold block uppercase tracking-wider">Package Offered</span>
                                <span className="text-base font-black text-[#D4AF37] block leading-none mt-0.5">{currStory.packageOffered || "₹12 LPA"}</span>
                                <span className="text-[7.5px] text-gray-400 font-medium tracking-wide">PER ANNUM</span>
                              </div>
                            </div>

                            {/* Right Column: Meta, Testimonial, Timeline, Skills & Achievements */}
                            <div className="lg:col-span-7 space-y-4 text-left">
                              <div className="space-y-0.5">
                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#D4AF37]">Success Story</span>
                                <h3 className="text-xl font-[900] text-[#072A6C]">{currStory.studentName || "Student Name"}</h3>
                                <p className="text-[11px] text-gray-500 font-medium">
                                  {currStory.department || "Department"} <span className="mx-1 text-gray-300">•</span> {currStory.batch || "2024 Batch"}
                                </p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                {/* Testimonial & 4-Step Timeline */}
                                <div className="md:col-span-7 space-y-3">
                                  <div className="pl-3 border-l-4 border-[#D4AF37]">
                                    <p className="text-[11px] text-gray-600 italic leading-relaxed">
                                      "{currStory.description || "Student testimonial goes here..."}"
                                    </p>
                                  </div>

                                  <div className="space-y-1.5">
                                    <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wider block">Journey Timeline</span>
                                    <div className="space-y-1.5">
                                      <div className="flex gap-2 bg-gray-50/70 p-2 rounded-xl border border-gray-100">
                                        <div className="w-4 h-4 rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center text-[8px] font-bold shrink-0">1</div>
                                        <div>
                                          <span className="text-[10px] font-bold text-[#072A6C] block leading-tight">{currStory.milestones?.learningTitle || "Strong Academic Foundation"}</span>
                                          <span className="text-[8.5px] text-gray-500 block">{currStory.milestones?.learningDesc || "Conceptual clarity through innovative teaching"}</span>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 bg-gray-50/70 p-2 rounded-xl border border-gray-100">
                                        <div className="w-4 h-4 rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center text-[8px] font-bold shrink-0">2</div>
                                        <div>
                                          <span className="text-[10px] font-bold text-[#072A6C] block leading-tight">{currStory.milestones?.internshipTitle || "Skill Development"}</span>
                                          <span className="text-[8.5px] text-gray-500 block">{currStory.milestones?.internshipDesc || "Live projects and industry-relevant skills"}</span>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 bg-gray-50/70 p-2 rounded-xl border border-gray-100">
                                        <div className="w-4 h-4 rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center text-[8px] font-bold shrink-0">3</div>
                                        <div>
                                          <span className="text-[10px] font-bold text-[#072A6C] block leading-tight">{currStory.milestones?.placementTitle || "Internship"}</span>
                                          <span className="text-[8.5px] text-gray-500 block">{currStory.milestones?.placementDesc || "Internship experience boosted my practical knowledge"}</span>
                                        </div>
                                      </div>
                                      <div className="flex gap-2 bg-gray-50/70 p-2 rounded-xl border border-gray-100">
                                        <div className="w-4 h-4 rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center text-[8px] font-bold shrink-0">4</div>
                                        <div>
                                          <span className="text-[10px] font-bold text-[#072A6C] block leading-tight">{currStory.milestones?.careerTitle || "Dream Career"}</span>
                                          <span className="text-[8.5px] text-gray-500 block">{currStory.milestones?.careerDesc || "Campus placement opportunity"}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Skills, Internship & Achievement */}
                                <div className="md:col-span-5 space-y-3 bg-gray-50/80 border border-gray-100 rounded-xl p-3 h-fit">
                                  <div className="space-y-1">
                                    <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wider block">Skills Acquired</span>
                                    <div className="flex flex-wrap gap-1">
                                      {currStory.skills && currStory.skills.length > 0 ? (
                                        currStory.skills.map((skill, sIdx) => (
                                          <span key={sIdx} className="text-[8px] font-semibold bg-white text-[#072A6C] px-1.5 py-0.5 border border-gray-200 rounded">
                                            {skill}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-[8px] text-gray-400 italic">No skills listed</span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-0.5 pt-2 border-t border-gray-200/70">
                                    <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wider block">Internship Term</span>
                                    <span className="text-[10px] font-bold text-[#072A6C] block">{currStory.internshipExp || "6 Months Internship"}</span>
                                  </div>

                                  <div className="space-y-0.5 pt-2 border-t border-gray-200/70">
                                    <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wider block">Top Achievement</span>
                                    <span className="text-[10px] font-bold text-emerald-600 block">{currStory.achievement || "Top Contest Performer"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* EDIT ACTIVE STORY FORM FIELDS */}
                      <div className="p-5 rounded-2xl border border-gray-200 bg-slate-50/40 space-y-5">
                        <h5 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-1.5">
                          <Edit3 size={13} className="text-[#072A6C]" />
                          Edit Story #{currentStorySafeIdx + 1}: {currStory.studentName}
                        </h5>

                        {/* Student Meta Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Student Full Name</label>
                            <input
                              type="text"
                              value={currStory.studentName}
                              onChange={(e) => updateCurrentStory({ studentName: e.target.value })}
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                              placeholder="e.g. Hitaishi Reddy"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Department / Program</label>
                            <input
                              type="text"
                              value={currStory.department}
                              onChange={(e) => updateCurrentStory({ department: e.target.value })}
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg"
                              placeholder="e.g. B.Tech - Computer Science & Engineering"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Batch Year</label>
                            <input
                              type="text"
                              value={currStory.batch}
                              onChange={(e) => updateCurrentStory({ batch: e.target.value })}
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg"
                              placeholder="e.g. 2024 Batch"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Package Offered (CTC)</label>
                            <input
                              type="text"
                              value={currStory.packageOffered}
                              onChange={(e) => updateCurrentStory({ packageOffered: e.target.value })}
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-black text-amber-600"
                              placeholder="e.g. 12 LPA"
                            />
                          </div>
                        </div>

                        {/* Student Photo & Company Logo with ImageField */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-2">
                            <ImageField
                              label="Student Profile Photo"
                              value={currStory.studentImage}
                              defaultValue={INITIAL_SUCCESS_STORIES[currentStorySafeIdx]?.studentImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=600&fit=crop&crop=face"}
                              aspectRatio="portrait"
                              recommendedSize="500 × 600 px (Portrait)"
                              onChange={(val) => updateCurrentStory({ studentImage: val })}
                              onReset={() => {
                                const defImg = INITIAL_SUCCESS_STORIES[currentStorySafeIdx]?.studentImage || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=600&fit=crop&crop=face";
                                updateCurrentStory({ studentImage: defImg });
                                notifySave("Student photo reset to default!");
                              }}
                            />
                          </div>
                          <div className="p-3.5 rounded-xl border border-gray-200 bg-white space-y-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-600 uppercase">Hiring Company Name</label>
                              <input
                                type="text"
                                value={currStory.companyName}
                                onChange={(e) => updateCurrentStory({ companyName: e.target.value })}
                                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                                placeholder="e.g. TCS / Google / Deloitte"
                              />
                            </div>
                            <ImageField
                              label="Company Logo"
                              value={currStory.companyLogo}
                              defaultValue={INITIAL_SUCCESS_STORIES[currentStorySafeIdx]?.companyLogo || "/logos/tcs.svg"}
                              aspectRatio="square"
                              recommendedSize="200 × 200 px (SVG / PNG)"
                              onChange={(val) => updateCurrentStory({ companyLogo: val })}
                              onReset={() => {
                                const defLogo = INITIAL_SUCCESS_STORIES[currentStorySafeIdx]?.companyLogo || "/logos/tcs.svg";
                                updateCurrentStory({ companyLogo: defLogo });
                                notifySave("Company logo reset to default!");
                              }}
                            />
                          </div>
                        </div>

                        {/* Testimonial Quote */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Student Testimonial / Experience Quote</label>
                          <textarea
                            value={currStory.description}
                            onChange={(e) => updateCurrentStory({ description: e.target.value })}
                            rows={3}
                            className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-lg"
                            placeholder="Write the student's testimonial quote about their college experience, faculty support, and placement journey..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* ══════════════════════════════════════════════════════════ */}
                    {/* OUR TOP CORPORATE PARTNERS / RECRUITERS MARQUEE CMS        */}
                    {/* ══════════════════════════════════════════════════════════ */}
                    <div className="pt-6 border-t border-gray-100 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-1.5">
                            <Building size={14} className="text-[#072A6C]" />
                            Our Top Corporate Partners Marquee ({(placementsForm.recruiters || []).length} Companies)
                          </h4>
                          <p className="text-[11px] text-gray-500">Manage all hiring partner logos shown in the homepage auto-scrolling recruiter marquee strip</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPlacementsForm({ ...placementsForm, recruiters: INITIAL_PLACEMENTS_CONTENT.recruiters });
                              notifySave("All 20 corporate partner logos reset to defaults!");
                            }}
                            className="h-8 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw size={12} /> Reset 20 Default Partners
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newPartner: Recruiter = { name: "New Partner", logo: "/logos/ibm.svg" };
                              const updated = [...(placementsForm.recruiters || []), newPartner];
                              setPlacementsForm({ ...placementsForm, recruiters: updated });
                              notifySave("New corporate partner added!");
                            }}
                            className="h-8 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={13} /> Add Company Partner
                          </button>
                        </div>
                      </div>

                      {/* LIVE MARQUEE STRIP PREVIEW (Matches media_1789817622000.png) */}
                      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Eye size={12} /> Website Live Marquee Strip Preview
                          </span>
                          <span className="text-[9.5px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-md font-semibold">
                            {(placementsForm.recruiters || []).length} Logos in Carousel
                          </span>
                        </div>
                        <div className="relative overflow-hidden bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                          <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
                            {(placementsForm.recruiters || []).map((r, i) => (
                              <div key={i} className="h-11 px-5 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-xs shrink-0 min-w-[100px] hover:border-[#072A6C] transition-all">
                                <img src={r.logo} alt={r.name} className="h-6 w-auto object-contain max-w-[85px]" onError={(e) => { (e.target as HTMLImageElement).src = "/logos/wipro.svg"; }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* PARTNER LOGOS DIRECTORY GRID */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Partner Logos Directory (Edit Logos & Names)</label>
                            <p className="text-[10px] text-gray-400">All corporate hiring partners (upload custom logos or use SVG paths)</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPlacementsForm({ ...placementsForm, recruiters: [...INITIAL_PLACEMENTS_CONTENT.recruiters] });
                                notifySave("Reset all 20 partners to defaults!");
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                              title="Reset all partners to default 20 companies"
                            >
                              <RotateCcw size={12} /> Reset All
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(placementsForm.recruiters || []), { name: "New Company", logo: "/logos/wipro.svg" }];
                                setPlacementsForm({ ...placementsForm, recruiters: updated });
                                notifySave("Added new partner company");
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-[#072A6C] bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 border border-blue-200 transition-colors cursor-pointer"
                            >
                              <Plus size={13} /> Add Company
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {(placementsForm.recruiters || []).map((partner, pIdx) => (
                            <div key={pIdx} className="p-3 rounded-xl border border-gray-200 bg-white shadow-xs space-y-2.5 relative group hover:border-[#072A6C]/40 hover:shadow-sm transition-all flex flex-col justify-between">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">#{pIdx + 1} Partner</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = [...(placementsForm.recruiters || [])];
                                      const defLogo = INITIAL_PLACEMENTS_CONTENT.recruiters[pIdx]?.logo || "/logos/wipro.svg";
                                      const defName = INITIAL_PLACEMENTS_CONTENT.recruiters[pIdx]?.name || partner.name;
                                      updated[pIdx] = { ...updated[pIdx], logo: defLogo, name: defName };
                                      setPlacementsForm({ ...placementsForm, recruiters: updated });
                                      notifySave(`${partner.name} reset to default!`);
                                    }}
                                    className="p-1 rounded text-gray-400 hover:text-[#072A6C] hover:bg-gray-100 cursor-pointer transition-colors"
                                    title="Reset logo & name to default"
                                  >
                                    <RotateCcw size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (placementsForm.recruiters || []).filter((_, i) => i !== pIdx);
                                      setPlacementsForm({ ...placementsForm, recruiters: updated });
                                      notifySave(`Removed ${partner.name}`);
                                    }}
                                    className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 cursor-pointer transition-colors"
                                    title="Delete partner"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>

                              <div className="relative group/logo h-14 w-full bg-slate-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center p-2 overflow-hidden">
                                <img
                                  src={partner.logo}
                                  alt={partner.name}
                                  className="h-7 max-h-7 w-auto max-w-[100px] object-contain transition-transform group-hover/logo:scale-105"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "/logos/wipro.svg"; }}
                                />
                                <label className="absolute inset-0 bg-[#072A6C]/85 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center text-white text-[10.5px] font-semibold gap-1.5 cursor-pointer shadow-inner">
                                  <UploadCloud size={13} />
                                  <span>Upload Logo</span>
                                  <input
                                    type="file"
                                    accept="image/*,.svg"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (re) => {
                                          const url = re.target?.result as string;
                                          const updated = [...(placementsForm.recruiters || [])];
                                          updated[pIdx] = { ...updated[pIdx], logo: url };
                                          setPlacementsForm({ ...placementsForm, recruiters: updated });
                                          notifySave(`Updated ${partner.name} logo`);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>

                              <div className="space-y-1.5">
                                <div>
                                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Company Name</label>
                                  <input
                                    type="text"
                                    value={partner.name}
                                    onChange={(e) => {
                                      const updated = [...(placementsForm.recruiters || [])];
                                      updated[pIdx] = { ...updated[pIdx], name: e.target.value };
                                      setPlacementsForm({ ...placementsForm, recruiters: updated });
                                    }}
                                    className="w-full h-7 px-2 text-xs font-bold bg-white border border-gray-200 rounded-md text-gray-800 focus:border-[#072A6C] focus:outline-none"
                                    placeholder="e.g. Google"
                                  />
                                </div>
                                <div>
                                  <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">Logo URL / Path</label>
                                  <input
                                    type="text"
                                    value={partner.logo}
                                    onChange={(e) => {
                                      const updated = [...(placementsForm.recruiters || [])];
                                      updated[pIdx] = { ...updated[pIdx], logo: e.target.value };
                                      setPlacementsForm({ ...placementsForm, recruiters: updated });
                                    }}
                                    className="w-full h-7 px-2 text-[11px] font-mono text-gray-600 bg-white border border-gray-200 rounded-md focus:border-[#072A6C] focus:outline-none"
                                    placeholder="/logos/company.svg"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* ══════════════════════════════════════════════════════════ */}
                      {/* 4 PLACEMENT HIGHLIGHT STATS CARDS (Matches Image 2)         */}
                      {/* ══════════════════════════════════════════════════════════ */}
                      <div className="pt-6 border-t border-gray-100 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-1.5">
                              <BarChart3 size={14} className="text-[#072A6C]" />
                              Placement Key Statistics Cards (4 Highlights)
                            </h4>
                            <p className="text-[11px] text-gray-500">Edit the 4 metric cards displayed below the recruiter logos marquee on the homepage</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPlacementsForm({
                                ...placementsForm,
                                stats: [
                                  { value: "92%", label: "Students Placed", icon: "Users" },
                                  { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                  { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                  { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                                ],
                                placementPercent: "92%",
                                highestPackage: "30 LPA",
                                corporatePartnersCount: "116+",
                                placementAssistance: "100%"
                              });
                              notifySave("Reset 4 placement stats to defaults!");
                            }}
                            className="h-8 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <RotateCcw size={12} /> Reset Stats
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                          {/* Stat 1 */}
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-[#072A6C] uppercase">#1 Students Placed</span>
                              <div className="w-6 h-6 rounded-full bg-blue-50 text-[#072A6C] flex items-center justify-center">
                                <Users size={12} />
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Value / Percent</label>
                              <input
                                type="text"
                                value={placementsForm.stats?.[0]?.value ?? placementsForm.placementPercent ?? "92%"}
                                onChange={(e) => {
                                  const currentStats = placementsForm.stats || [
                                    { value: "92%", label: "Students Placed", icon: "Users" },
                                    { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                    { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                    { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                                  ];
                                  const updated = [...currentStats];
                                  updated[0] = { ...updated[0], value: e.target.value };
                                  setPlacementsForm({ ...placementsForm, stats: updated, placementPercent: e.target.value });
                                }}
                                className="w-full h-8 px-2.5 text-xs font-black bg-slate-50 border border-gray-200 rounded-lg text-[#072A6C]"
                                placeholder="92%"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Label Text</label>
                              <input
                                type="text"
                                value={placementsForm.stats?.[0]?.label ?? "Students Placed"}
                                onChange={(e) => {
                                  const currentStats = placementsForm.stats || [
                                    { value: "92%", label: "Students Placed", icon: "Users" },
                                    { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                    { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                    { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                                  ];
                                  const updated = [...currentStats];
                                  updated[0] = { ...updated[0], label: e.target.value };
                                  setPlacementsForm({ ...placementsForm, stats: updated });
                                }}
                                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700"
                                placeholder="Students Placed"
                              />
                            </div>
                          </div>

                          {/* Stat 2 */}
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-[#D4AF37] uppercase">#2 Highest Package</span>
                              <div className="w-6 h-6 rounded-full bg-amber-50 text-[#D4AF37] flex items-center justify-center">
                                <Trophy size={12} />
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Value / CTC</label>
                              <input
                                type="text"
                                value={placementsForm.stats?.[1]?.value ?? placementsForm.highestPackage ?? "30 LPA"}
                                onChange={(e) => {
                                  const currentStats = placementsForm.stats || [
                                    { value: "92%", label: "Students Placed", icon: "Users" },
                                    { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                    { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                    { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                                  ];
                                  const updated = [...currentStats];
                                  updated[1] = { ...updated[1], value: e.target.value };
                                  setPlacementsForm({ ...placementsForm, stats: updated, highestPackage: e.target.value });
                                }}
                                className="w-full h-8 px-2.5 text-xs font-black bg-slate-50 border border-gray-200 rounded-lg text-[#D4AF37]"
                                placeholder="30 LPA"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Label Text</label>
                              <input
                                type="text"
                                value={placementsForm.stats?.[1]?.label ?? "Highest Package"}
                                onChange={(e) => {
                                  const currentStats = placementsForm.stats || [
                                    { value: "92%", label: "Students Placed", icon: "Users" },
                                    { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                    { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                    { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                                  ];
                                  const updated = [...currentStats];
                                  updated[1] = { ...updated[1], label: e.target.value };
                                  setPlacementsForm({ ...placementsForm, stats: updated });
                                }}
                                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700"
                                placeholder="Highest Package"
                              />
                            </div>
                          </div>

                          {/* Stat 3 */}
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-amber-600 uppercase">#3 Corporate Partners</span>
                              <div className="w-6 h-6 rounded-full bg-yellow-50 text-amber-600 flex items-center justify-center">
                                <Handshake size={12} />
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Value / Count</label>
                              <input
                                type="text"
                                value={placementsForm.stats?.[2]?.value ?? placementsForm.corporatePartnersCount ?? "116+"}
                                onChange={(e) => {
                                  const currentStats = placementsForm.stats || [
                                    { value: "92%", label: "Students Placed", icon: "Users" },
                                    { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                    { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                    { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                                  ];
                                  const updated = [...currentStats];
                                  updated[2] = { ...updated[2], value: e.target.value };
                                  setPlacementsForm({ ...placementsForm, stats: updated, corporatePartnersCount: e.target.value });
                                }}
                                className="w-full h-8 px-2.5 text-xs font-black bg-slate-50 border border-gray-200 rounded-lg text-amber-600"
                                placeholder="116+"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Label Text</label>
                              <input
                                type="text"
                                value={placementsForm.stats?.[2]?.label ?? "Corporate Partners"}
                                onChange={(e) => {
                                  const currentStats = placementsForm.stats || [
                                    { value: "92%", label: "Students Placed", icon: "Users" },
                                    { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                    { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                    { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                                  ];
                                  const updated = [...currentStats];
                                  updated[2] = { ...updated[2], label: e.target.value };
                                  setPlacementsForm({ ...placementsForm, stats: updated });
                                }}
                                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700"
                                placeholder="Corporate Partners"
                              />
                            </div>
                          </div>

                          {/* Stat 4 */}
                          <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-emerald-600 uppercase">#4 Assistance</span>
                              <div className="w-6 h-6 rounded-full bg-green-50 text-emerald-600 flex items-center justify-center">
                                <GraduationCap size={12} />
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Value / Percent</label>
                              <input
                                type="text"
                                value={placementsForm.stats?.[3]?.value ?? placementsForm.placementAssistance ?? "100%"}
                                onChange={(e) => {
                                  const currentStats = placementsForm.stats || [
                                    { value: "92%", label: "Students Placed", icon: "Users" },
                                    { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                    { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                    { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                                  ];
                                  const updated = [...currentStats];
                                  updated[3] = { ...updated[3], value: e.target.value };
                                  setPlacementsForm({ ...placementsForm, stats: updated, placementAssistance: e.target.value });
                                }}
                                className="w-full h-8 px-2.5 text-xs font-black bg-slate-50 border border-gray-200 rounded-lg text-emerald-600"
                                placeholder="100%"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Label Text</label>
                              <input
                                type="text"
                                value={placementsForm.stats?.[3]?.label ?? "Placement Assistance"}
                                onChange={(e) => {
                                  const currentStats = placementsForm.stats || [
                                    { value: "92%", label: "Students Placed", icon: "Users" },
                                    { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
                                    { value: "116+", label: "Corporate Partners", icon: "Handshake" },
                                    { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
                                  ];
                                  const updated = [...currentStats];
                                  updated[3] = { ...updated[3], label: e.target.value };
                                  setPlacementsForm({ ...placementsForm, stats: updated });
                                }}
                                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700"
                                placeholder="Placement Assistance"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#072A6C]">Full Placements & Recruiters Directory</h4>
                        <p className="text-[11px] text-gray-600">You can also manage placed students individual cards, brochures, and statistics in the Placements tab.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab("placements")}
                        className="px-3 py-1.5 bg-[#072A6C] text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-[#051c4a]"
                      >
                        Go to Placements CMS ➔
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Sub-tab: 10. Admissions Open & Visit Us */}
              {activeHomeSubTab === "virtualTour" && (
                <div className="space-y-6 text-left">
                  {/* Top Bar with Title and Actions */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">10. Admissions Banner & Campus Visit Strip</h3>
                      <p className="text-xs text-gray-500">Configure the admissions open promotional card, 3 action buttons, student banner image, contact coordinates, and interactive Google Map location.</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setActiveHomeSubTab("ordering")}
                        className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        ← Back to Ordering
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const defVT = DEFAULT_HOMEPAGE_SECTIONS.find((s) => s.id === "virtualTour");
                          if (defVT && defVT.extraData) {
                            setTourData({
                              bannerTitle: defVT.extraData.bannerTitle || "ADMISSIONS OPEN 2026",
                              bannerSubtitle: defVT.extraData.bannerSubtitle || "Join a community of innovators and leaders. Shape your future with Chalapathi University.",
                              bannerImage: defVT.extraData.bannerImage || "/students_admission.png",
                              btn1Text: defVT.extraData.btn1Text || "Apply Now",
                              btn1Url: defVT.extraData.btn1Url || "/admissions/apply",
                              btn2Text: defVT.extraData.btn2Text || "Download Brochure",
                              btn2Url: defVT.extraData.btn2Url || "/admissions",
                              btn3Text: defVT.extraData.btn3Text || "Talk to Counselor",
                              btn3Url: defVT.extraData.btn3Url || "/contact",
                              visitHeading: defVT.extraData.visitHeading || "VISIT US",
                              address: defVT.extraData.address || "A.R. Nagar, Mothadaka, Guntur, Andhra Pradesh - 522034",
                              phone: defVT.extraData.phone || "8886630355 | 8886630356 9905505566",
                              email: defVT.extraData.email || "admissions@city.ac.in",
                              website: defVT.extraData.website || "www.city.ac.in",
                              mapEmbedUrl: defVT.extraData.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.974950454796!2d80.28581691486445!3d16.375218788685984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a79679802cfad%3A0xe67e2a901bbd33fe!2sChalapathi%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!5m2!1sen!2sin",
                              mapLinkUrl: defVT.extraData.mapLinkUrl || "https://www.google.com/maps/place/Chalapathi+Institute+of+Technology/@16.3752188,80.2858169,17z/data=!3m1!4b1!4m6!3m5!1s0x3a4a79679802cfad:0xe67e2a901bbd33fe!8m2!3d16.3752188!4d80.2858169!16s%2Fg%2F122r446z"
                            });
                            notifySave("Reset Admissions & Visit Us to defaults!");
                          }
                        }}
                        className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={13} /> Reset Defaults
                      </button>
                      <button
                        onClick={saveVirtualTourSection}
                        className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save Section
                      </button>
                    </div>
                  </div>

                  {/* Two Cards Editor Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Card 1: Left Admissions Promotional Banner */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <span className="px-2.5 py-0.5 bg-blue-100 text-[#072A6C] text-[10px] font-black uppercase rounded-full">Left Banner</span>
                        <h4 className="text-xs font-bold text-gray-800">Admissions Open Promotional Card</h4>
                      </div>

                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Banner Headline (Gold Text)</label>
                          <input
                            type="text"
                            value={tourData.bannerTitle}
                            onChange={(e) => setTourData({ ...tourData, bannerTitle: e.target.value })}
                            className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-gray-800"
                            placeholder="e.g. ADMISSIONS OPEN 2026"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Banner Subtitle / Description</label>
                          <textarea
                            value={tourData.bannerSubtitle}
                            onChange={(e) => setTourData({ ...tourData, bannerSubtitle: e.target.value })}
                            rows={3}
                            className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700 resize-none"
                            placeholder="e.g. Join a community of innovators and leaders. Shape your future with Chalapathi University."
                          />
                        </div>

                        <ImageField
                          label="Students Cutout / Campus Image"
                          value={tourData.bannerImage}
                          defaultValue="/students_admission.png"
                          aspectRatio="wide"
                          recommendedSize="800 × 600 px (PNG with transparent or rich background)"
                          onChange={(val) => setTourData({ ...tourData, bannerImage: val })}
                          onReset={() => setTourData({ ...tourData, bannerImage: "/students_admission.png" })}
                        />

                        {/* 3 CTA Buttons */}
                        <div className="space-y-3 pt-2">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Action Buttons (3 Links)</label>
                          
                          {/* Button 1 */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
                            <span className="text-[10px] font-bold text-[#072A6C]">Primary Button 1 (White Solid)</span>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={tourData.btn1Text}
                                onChange={(e) => setTourData({ ...tourData, btn1Text: e.target.value })}
                                placeholder="Button Text (e.g. Apply Now)"
                                className="h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                              />
                              <input
                                type="text"
                                value={tourData.btn1Url}
                                onChange={(e) => setTourData({ ...tourData, btn1Url: e.target.value })}
                                placeholder="Target Link (e.g. /admissions/apply)"
                                className="h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg text-gray-600"
                              />
                            </div>
                          </div>

                          {/* Button 2 */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
                            <span className="text-[10px] font-bold text-[#D4AF37]">Secondary Button 2 (Gold Outline)</span>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={tourData.btn2Text}
                                onChange={(e) => setTourData({ ...tourData, btn2Text: e.target.value })}
                                placeholder="Button Text (e.g. Download Brochure)"
                                className="h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                              />
                              <input
                                type="text"
                                value={tourData.btn2Url}
                                onChange={(e) => setTourData({ ...tourData, btn2Url: e.target.value })}
                                placeholder="Target Link (e.g. /admissions)"
                                className="h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg text-gray-600"
                              />
                            </div>
                          </div>

                          {/* Button 3 */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
                            <span className="text-[10px] font-bold text-[#D4AF37]">Secondary Button 3 (Gold Outline)</span>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={tourData.btn3Text}
                                onChange={(e) => setTourData({ ...tourData, btn3Text: e.target.value })}
                                placeholder="Button Text (e.g. Talk to Counselor)"
                                className="h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                              />
                              <input
                                type="text"
                                value={tourData.btn3Url}
                                onChange={(e) => setTourData({ ...tourData, btn3Url: e.target.value })}
                                placeholder="Target Link (e.g. /contact)"
                                className="h-8 px-2.5 text-xs font-mono bg-white border border-gray-200 rounded-lg text-gray-600"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Right Visit Us & Contact */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase rounded-full">Right Card</span>
                        <h4 className="text-xs font-bold text-gray-800">Visit Us & Location Coordinates</h4>
                      </div>

                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Card Heading</label>
                          <input
                            type="text"
                            value={tourData.visitHeading}
                            onChange={(e) => setTourData({ ...tourData, visitHeading: e.target.value })}
                            className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-gray-800"
                            placeholder="e.g. VISIT US"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Campus Physical Address</label>
                          <input
                            type="text"
                            value={tourData.address}
                            onChange={(e) => setTourData({ ...tourData, address: e.target.value })}
                            className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800"
                            placeholder="e.g. A.R. Nagar, Mothadaka, Guntur, Andhra Pradesh - 522034"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Contact Phone Numbers</label>
                          <input
                            type="text"
                            value={tourData.phone}
                            onChange={(e) => setTourData({ ...tourData, phone: e.target.value })}
                            className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800"
                            placeholder="e.g. 8886630355 | 8886630356 9905505566"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Admissions Email</label>
                          <input
                            type="text"
                            value={tourData.email}
                            onChange={(e) => setTourData({ ...tourData, email: e.target.value })}
                            className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800"
                            placeholder="e.g. admissions@city.ac.in"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Official Website URL</label>
                          <input
                            type="text"
                            value={tourData.website}
                            onChange={(e) => setTourData({ ...tourData, website: e.target.value })}
                            className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800"
                            placeholder="e.g. www.city.ac.in"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Google Maps Embed iframe URL</label>
                          <input
                            type="text"
                            value={tourData.mapEmbedUrl}
                            onChange={(e) => setTourData({ ...tourData, mapEmbedUrl: e.target.value })}
                            className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800 font-mono text-[11px]"
                            placeholder="https://www.google.com/maps/embed?pb=..."
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Google Maps Direct Place Link</label>
                          <input
                            type="text"
                            value={tourData.mapLinkUrl}
                            onChange={(e) => setTourData({ ...tourData, mapLinkUrl: e.target.value })}
                            className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800 font-mono text-[11px]"
                            placeholder="https://www.google.com/maps/place/..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Live Interactive Preview Box */}
                  <div className="bg-slate-900 p-6 rounded-2xl text-white space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Website Section Preview</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Section 10 on live Homepage</span>
                    </div>

                    <div className="bg-gray-100 p-5 rounded-xl text-slate-900">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                        {/* Preview Left Blue Card */}
                        <div className="lg:col-span-8 bg-[#072A6C] text-white rounded-[14px] p-6 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
                          <div className="space-y-3 relative z-10 w-full md:max-w-[55%]">
                            <h3 className="text-xl font-black text-[#D4AF37]">{tourData.bannerTitle}</h3>
                            <p className="text-xs text-blue-100 leading-relaxed font-light">{tourData.bannerSubtitle}</p>
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              {tourData.btn1Text && (
                                <span className="h-8 px-3 bg-white text-[#072A6C] text-[10px] font-bold rounded-md inline-flex items-center gap-1 shadow-xs">
                                  {tourData.btn1Text} ➔
                                </span>
                              )}
                              {tourData.btn2Text && (
                                <span className="h-8 px-3 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold rounded-md inline-flex items-center gap-1">
                                  {tourData.btn2Text}
                                </span>
                              )}
                              {tourData.btn3Text && (
                                <span className="h-8 px-3 border border-[#D4AF37] text-[#D4AF37] text-[10px] font-bold rounded-md inline-flex items-center gap-1">
                                  {tourData.btn3Text}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="absolute right-0 top-0 bottom-0 h-full w-full md:w-[42%] overflow-hidden z-0 opacity-90">
                            <img src={tourData.bannerImage} alt="Students" className="w-full h-full object-cover object-left-top" onError={(e) => { (e.target as HTMLImageElement).src = "/students_admission.png"; }} />
                          </div>
                        </div>

                        {/* Preview Right White Card */}
                        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-[14px] p-4 flex items-center justify-between gap-3 shadow-xs">
                          <div className="space-y-2.5 flex-1">
                            <h4 className="text-xs font-black uppercase tracking-wider text-[#072A6C]">{tourData.visitHeading}</h4>
                            <div className="space-y-1.5 text-[10px] text-gray-600">
                              <div className="flex items-start gap-1">
                                <MapPin size={11} className="shrink-0 mt-0.5 text-gray-400" />
                                <span className="line-clamp-2">{tourData.address}</span>
                              </div>
                              <div className="flex items-start gap-1">
                                <Phone size={11} className="shrink-0 mt-0.5 text-gray-400" />
                                <span>{tourData.phone}</span>
                              </div>
                              <div className="flex items-start gap-1">
                                <Mail size={11} className="shrink-0 mt-0.5 text-gray-400" />
                                <span>{tourData.email}</span>
                              </div>
                              <div className="flex items-start gap-1">
                                <Globe size={11} className="shrink-0 mt-0.5 text-gray-400" />
                                <span>{tourData.website}</span>
                              </div>
                            </div>
                          </div>
                          <div className="w-[85px] h-[85px] rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative flex items-center justify-center text-[10px] font-bold text-[#072A6C]">
                            Maps ↗
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab: Homepage Colors & Style */}
              {activeHomeSubTab === "styling" && (
                <div className="space-y-6 text-left">
                  {/* 1. Theme Presets */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Palette className="text-[#072A6C]" size={18} />
                          <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wide">1-Click Theme Palettes</h3>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">Choose a curated university color scheme or customize individual values below</p>
                      </div>
                      <div className="flex gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setActiveHomeSubTab("ordering")}
                          className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          ← Back to Ordering
                        </button>
                        <button
                          onClick={saveStyling}
                          className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save size={13} /> Save Colors & Style
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        {
                          name: "Chalapathi Classic (Default)",
                          desc: "Navy Blue, Gold & Crimson Accent",
                          primary: "#072A6C",
                          secondary: "#D4AF37",
                          accent: "#D71920",
                          headerBg: "#FFFFFF",
                          footerBg: "#071A3A",
                          statsBg: "#072A6C",
                          whyChooseBg: "#F8FAFC",
                          chairmanBg: "#072A6C",
                          campusLifeBg: "#FFFFFF",
                          certificationsBg: "#F8FAFC",
                          virtualTourBg: "#0B192C"
                        },
                        {
                          name: "Deep Sapphire & Amber",
                          desc: "Deep Sapphire, Warm Amber & Red",
                          primary: "#0A2558",
                          secondary: "#F59E0B",
                          accent: "#DC2626",
                          headerBg: "#FFFFFF",
                          footerBg: "#051329",
                          statsBg: "#0A2558",
                          whyChooseBg: "#F1F5F9",
                          chairmanBg: "#0A2558",
                          campusLifeBg: "#FFFFFF",
                          certificationsBg: "#F1F5F9",
                          virtualTourBg: "#08162F"
                        },
                        {
                          name: "Royal Emerald & Gold",
                          desc: "Emerald Forest, Gold & Crimson",
                          primary: "#064E3B",
                          secondary: "#D97706",
                          accent: "#B91C1C",
                          headerBg: "#FFFFFF",
                          footerBg: "#022c22",
                          statsBg: "#064E3B",
                          whyChooseBg: "#F0FDF4",
                          chairmanBg: "#064E3B",
                          campusLifeBg: "#FFFFFF",
                          certificationsBg: "#F0FDF4",
                          virtualTourBg: "#022018"
                        },
                        {
                          name: "Midnight Obsidian & Gold",
                          desc: "Obsidian Slate, Yellow Gold & Coral",
                          primary: "#0F172A",
                          secondary: "#EAB308",
                          accent: "#E11D48",
                          headerBg: "#FFFFFF",
                          footerBg: "#020617",
                          statsBg: "#0F172A",
                          whyChooseBg: "#F8FAFC",
                          chairmanBg: "#0F172A",
                          campusLifeBg: "#FFFFFF",
                          certificationsBg: "#F8FAFC",
                          virtualTourBg: "#020617"
                        }
                      ].map((preset, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setColorsForm({
                              ...colorsForm,
                              primary: preset.primary,
                              secondary: preset.secondary,
                              accent: preset.accent,
                              headerBg: preset.headerBg,
                              footerBg: preset.footerBg,
                              statsBg: preset.statsBg,
                              whyChooseBg: preset.whyChooseBg,
                              chairmanBg: preset.chairmanBg,
                              campusLifeBg: preset.campusLifeBg,
                              certificationsBg: preset.certificationsBg,
                              virtualTourBg: preset.virtualTourBg
                            });
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                            colorsForm.primary === preset.primary && colorsForm.secondary === preset.secondary
                              ? "border-[#072A6C] bg-blue-50/40 shadow-xs ring-2 ring-[#072A6C]/20"
                              : "border-gray-200 bg-slate-50/50 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-bold text-gray-800">{preset.name}</h4>
                            {colorsForm.primary === preset.primary && colorsForm.secondary === preset.secondary && (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">Active</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: preset.primary }} title={`Primary: ${preset.primary}`} />
                            <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: preset.secondary }} title={`Secondary: ${preset.secondary}`} />
                            <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: preset.accent }} title={`Accent: ${preset.accent}`} />
                            <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: preset.footerBg }} title={`Footer: ${preset.footerBg}`} />
                          </div>
                          <p className="text-[11px] text-gray-500">{preset.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Global University Colors */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wide">Global University Colors</h3>
                      <p className="text-xs text-gray-500">Core palette used across banners, badges, active tabs, buttons, and accents</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <ColorField
                        label="Primary Brand Color (Navy Blue)"
                        value={colorsForm.primary}
                        onChange={(val) => setColorsForm({ ...colorsForm, primary: val })}
                      />
                      <ColorField
                        label="Secondary Accent (Gold / Yellow)"
                        value={colorsForm.secondary}
                        onChange={(val) => setColorsForm({ ...colorsForm, secondary: val })}
                      />
                      <ColorField
                        label="Accent Highlight (Crimson Red)"
                        value={colorsForm.accent}
                        onChange={(val) => setColorsForm({ ...colorsForm, accent: val })}
                      />
                      <ColorField
                        label="Page Background Color"
                        value={colorsForm.pageBackground || "#FFFFFF"}
                        onChange={(val) => setColorsForm({ ...colorsForm, pageBackground: val })}
                      />
                      <ColorField
                        label="Primary Text Color"
                        value={colorsForm.textPrimary || "#0F172A"}
                        onChange={(val) => setColorsForm({ ...colorsForm, textPrimary: val })}
                      />
                      <ColorField
                        label="Secondary / Muted Text Color"
                        value={colorsForm.textSecondary || "#475569"}
                        onChange={(val) => setColorsForm({ ...colorsForm, textSecondary: val })}
                      />
                    </div>
                  </div>

                  {/* 3. Section-Specific Background & Text Color Overrides */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wide">Homepage Section Background & Header/Footer Colors</h3>
                      <p className="text-xs text-gray-500">Override specific section backgrounds and navigation headers independently</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <ColorField
                        label="Top Header Navigation Background"
                        value={colorsForm.headerBg || "#FFFFFF"}
                        onChange={(val) => setColorsForm({ ...colorsForm, headerBg: val })}
                      />
                      <ColorField
                        label="Header Nav Links Text Color"
                        value={colorsForm.headerText || "#072A6C"}
                        onChange={(val) => setColorsForm({ ...colorsForm, headerText: val })}
                      />
                      <ColorField
                        label="Key Statistics Bar Background"
                        value={colorsForm.statsBg || "#072A6C"}
                        onChange={(val) => setColorsForm({ ...colorsForm, statsBg: val })}
                      />
                      <ColorField
                        label="Why Choose Us Section Background"
                        value={colorsForm.whyChooseBg || "#F8FAFC"}
                        onChange={(val) => setColorsForm({ ...colorsForm, whyChooseBg: val })}
                      />
                      <ColorField
                        label="Chairman's Message Section Background"
                        value={colorsForm.chairmanBg || "#072A6C"}
                        onChange={(val) => setColorsForm({ ...colorsForm, chairmanBg: val })}
                      />
                      <ColorField
                        label="Campus Life Section Background"
                        value={colorsForm.campusLifeBg || "#FFFFFF"}
                        onChange={(val) => setColorsForm({ ...colorsForm, campusLifeBg: val })}
                      />
                      <ColorField
                        label="Admissions Strip & Visit Us Background"
                        value={colorsForm.virtualTourBg || "#F9FAFB"}
                        onChange={(val) => setColorsForm({ ...colorsForm, virtualTourBg: val })}
                      />
                      <ColorField
                        label="Footer Main Background"
                        value={colorsForm.footerBg || "#071A3A"}
                        onChange={(val) => setColorsForm({ ...colorsForm, footerBg: val })}
                      />
                      <ColorField
                        label="Footer Text Color"
                        value={colorsForm.footerText || "#FFFFFF"}
                        onChange={(val) => setColorsForm({ ...colorsForm, footerText: val })}
                      />
                    </div>
                  </div>

                  {/* 4. Typography & Font Style Controls */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2">
                      <Type className="text-[#072A6C]" size={18} />
                      <div>
                        <h3 className="text-sm font-black text-[#072A6C] uppercase tracking-wide">Typography & Fonts</h3>
                        <p className="text-xs text-gray-500">Select the typography font styling applied across headers, body content, and UI elements</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Primary Font Family</label>
                        <select
                          defaultValue="Poppins"
                          className="w-full h-10 px-3 text-xs bg-white border border-gray-200 rounded-lg font-medium text-gray-800 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Poppins">Poppins (Official University Font — Modern Sans-Serif)</option>
                          <option value="Inter">Inter (Ultra-clean Digital Sans)</option>
                          <option value="Montserrat">Montserrat (Geometric Classic)</option>
                          <option value="Plus Jakarta Sans">Plus Jakarta Sans (Contemporary Editorial)</option>
                          <option value="Roboto">Roboto (Google Standard Neo-Grotesque)</option>
                        </select>
                        <p className="text-[11px] text-gray-500">Official university typographic standard with complete weight variants (Light 300 to Black 900).</p>
                      </div>

                      <div className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-2">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Heading Font Weight</label>
                        <select
                          defaultValue="Extra Bold (800)"
                          className="w-full h-10 px-3 text-xs bg-white border border-gray-200 rounded-lg font-medium text-gray-800 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Bold (700)">Bold (700) — Standard</option>
                          <option value="Extra Bold (800)">Extra Bold (800) — University Default</option>
                          <option value="Black (900)">Black (900) — High Impact</option>
                        </select>
                        <p className="text-[11px] text-gray-500">Used for section hero titles, announcement headings, and program banners.</p>
                      </div>
                    </div>

                    {/* Live typography & component preview */}
                    <div className="mt-4 p-4 rounded-xl border border-dashed border-gray-300 bg-white space-y-3">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Live Visual Sample with Selected Colors</span>
                      <div className="p-4 rounded-xl flex flex-wrap items-center justify-between gap-4" style={{ backgroundColor: colorsForm.whyChooseBg || "#F8FAFC" }}>
                        <div>
                          <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white inline-block mb-1" style={{ backgroundColor: colorsForm.accent }}>
                            Admissions Open 2026-27
                          </span>
                          <h4 className="text-base font-black" style={{ color: colorsForm.primary }}>
                            Chalapathi University — Empowering Future Leaders
                          </h4>
                          <p className="text-xs font-medium" style={{ color: colorsForm.textSecondary }}>
                            NAAC 'A+' Accredited | UGC Recognised | Approved by AICTE & PCI
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs cursor-pointer"
                            style={{ backgroundColor: colorsForm.primary }}
                          >
                            Explore Programs
                          </button>
                          <button
                            type="button"
                            className="px-4 py-2 text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                            style={{ backgroundColor: colorsForm.secondary, color: "#000000" }}
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Save Bar */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={saveStyling}
                      className="h-10 px-6 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.02]"
                    >
                      <Save size={14} /> Save Homepage Colors & Style
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 3: ABOUT US CMS                                  */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "about" && (
            <div className="space-y-6 animate-fade-in">
              <SectionHeader
                title="About Us CMS"
                subtitle="Manage institutional heritage, vision & mission, leadership & chairman message, and Chalapathi Advantage"
                icon={Building}
                onSave={saveAbout}
                saveSuccess={saveSuccess}
              />

              {/* Sub-tabs */}
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                {[
                  { id: "genesis", label: "1. Genesis & Heritage" },
                  { id: "vision", label: "2. Vision & Mission" },
                  { id: "leadership", label: "3. Leadership & Chairman" },
                  { id: "advantage", label: "4. Chalapathi Advantage" }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActiveAboutSubTab(st.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      activeAboutSubTab === st.id
                        ? "bg-[#072A6C] text-white shadow-xs"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* 1. Sub-tab: Genesis */}
              {activeAboutSubTab === "genesis" && (
                <div className="space-y-6 text-left">
                  {/* Top Bar with Save Button */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <div>
                      <h3 className="text-base font-black text-[#072A6C] tracking-tight">Genesis & Heritage (30-Year Journey)</h3>
                      <p className="text-xs text-gray-500">Edit the hero banners, 3D interactive timeline milestone steps, photos, and institutional narratives</p>
                    </div>
                    <button
                      onClick={saveAbout}
                      className="h-10 px-5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                    >
                      <Save size={14} /> Save Genesis Content
                    </button>
                  </div>

                  {/* Hero & Intro Header */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">Hero Banner & Header</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Tagline / Eyebrow Text</label>
                        <input
                          type="text"
                          value={aboutForm.history.heroTagline || "OUR GENESIS"}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              history: { ...aboutForm.history, heroTagline: e.target.value }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-blue-900"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Main Hero Heading</label>
                        <input
                          type="text"
                          value={aboutForm.history.heroTitle || "A Journey of Vision, Values & Transformation"}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              history: { ...aboutForm.history, heroTitle: e.target.value }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Hero Subtitle & Vision Overview</label>
                      <textarea
                        rows={2}
                        value={aboutForm.history.heroSubtitle || "From a vision rooted in knowledge to a future-ready multidisciplinary university driven by innovation, research, and global excellence."}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            history: { ...aboutForm.history, heroSubtitle: e.target.value }
                          })
                        }
                        className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                      />
                    </div>
                  </div>

                  {/* 3D Milestones Timeline with Photos & Validation */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">3D Milestone Steps & Campus Journey (5 Timeline Eras)</h4>
                        <p className="text-xs text-gray-500">Each step renders with a 3D glass pedestal, year badge, and validated historical photo</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...aboutForm.history.milestones,
                            { 
                              year: "2027", 
                              title: "Global Innovation Hub", 
                              desc: "Next-generation research infrastructure and global campus tie-ups.",
                              img: "genesis/2026.jpg",
                              alt: "New Era"
                            }
                          ];
                          setAboutForm({
                            ...aboutForm,
                            history: { ...aboutForm.history, milestones: updated }
                          });
                        }}
                        className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus size={13} /> Add Timeline Step
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {aboutForm.history.milestones.map((m, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-slate-50/70 space-y-3 flex flex-col justify-between">
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                              <span className="text-[11px] font-black text-[#072A6C] uppercase">Step {idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = aboutForm.history.milestones.filter((_, i) => i !== idx);
                                  setAboutForm({ ...aboutForm, history: { ...aboutForm.history, milestones: updated } });
                                }}
                                className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                                title="Delete Milestone"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Year / Era Label</label>
                              <input
                                type="text"
                                value={m.year}
                                onChange={(e) => {
                                  const updated = [...aboutForm.history.milestones];
                                  updated[idx] = { ...updated[idx], year: e.target.value };
                                  setAboutForm({ ...aboutForm, history: { ...aboutForm.history, milestones: updated } });
                                }}
                                className="w-full h-8 px-2 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Title</label>
                              <input
                                type="text"
                                value={m.title}
                                onChange={(e) => {
                                  const updated = [...aboutForm.history.milestones];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  setAboutForm({ ...aboutForm, history: { ...aboutForm.history, milestones: updated } });
                                }}
                                placeholder="Milestone Title"
                                className="w-full h-8 px-2 text-xs font-bold bg-white border border-gray-200 rounded"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Description</label>
                              <textarea
                                rows={3}
                                value={m.desc}
                                onChange={(e) => {
                                  const updated = [...aboutForm.history.milestones];
                                  updated[idx] = { ...updated[idx], desc: e.target.value };
                                  setAboutForm({ ...aboutForm, history: { ...aboutForm.history, milestones: updated } });
                                }}
                                placeholder="Milestone Description"
                                className="w-full p-2 text-xs bg-white border border-gray-200 rounded font-normal"
                              />
                            </div>

                            <ImageField
                              label="Historical Photo (Validated)"
                              value={m.img || ""}
                              onChange={(newImg) => {
                                const updated = [...aboutForm.history.milestones];
                                updated[idx] = { ...updated[idx], img: newImg };
                                setAboutForm({ ...aboutForm, history: { ...aboutForm.history, milestones: updated } });
                              }}
                              aspectRatio="video"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. NEP 2020 Ecosystem Section */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">NEP 2020 Ecosystem Section</h4>
                        <p className="text-xs text-gray-500">Interactive orbital modules displaying institutional pillars inspired by NEP 2020</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentNodes = aboutForm.history.nep2020?.nodes || [
                            { label: "Holistic Learning", stat: "360°", desc: "Comprehensive physical & emotional growth." },
                            { label: "Research", stat: "Tier-1", desc: "Advanced labs & dedicated funding programs." },
                            { label: "Innovation", stat: "100+", desc: "Patents filed and ideation centers active." },
                            { label: "Skill Development", stat: "95%", desc: "Industry-ready practical curriculum." },
                            { label: "Entrepreneurship", stat: "50+", desc: "Startups incubated on campus annually." },
                            { label: "Multidisciplinary", stat: "12", desc: "Interconnected disciplines of study." }
                          ];
                          const updated = [...currentNodes, { label: "New Pillar", stat: "100%", desc: "Description of institutional capability." }];
                          setAboutForm({
                            ...aboutForm,
                            history: {
                              ...aboutForm.history,
                              nep2020: {
                                ...(aboutForm.history.nep2020 || {
                                  heading: "A University Inspired by NEP 2020",
                                  subheading: "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.",
                                  coreBadge: "NEP 2020"
                                }),
                                nodes: updated
                              }
                            }
                          });
                        }}
                        className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus size={13} /> Add Orbital Node
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Section Heading</label>
                        <input
                          type="text"
                          value={aboutForm.history.nep2020?.heading || "A University Inspired by NEP 2020"}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              history: {
                                ...aboutForm.history,
                                nep2020: {
                                  ...(aboutForm.history.nep2020 || {
                                    heading: "A University Inspired by NEP 2020",
                                    subheading: "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.",
                                    coreBadge: "NEP 2020",
                                    nodes: []
                                  }),
                                  heading: e.target.value
                                }
                              }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Core Sphere Badge Text</label>
                        <input
                          type="text"
                          value={aboutForm.history.nep2020?.coreBadge || "NEP 2020"}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              history: {
                                ...aboutForm.history,
                                nep2020: {
                                  ...(aboutForm.history.nep2020 || {
                                    heading: "A University Inspired by NEP 2020",
                                    subheading: "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.",
                                    coreBadge: "NEP 2020",
                                    nodes: []
                                  }),
                                  coreBadge: e.target.value
                                }
                              }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Subtitle</label>
                      <input
                        type="text"
                        value={aboutForm.history.nep2020?.subheading || "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation."}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            history: {
                              ...aboutForm.history,
                              nep2020: {
                                ...(aboutForm.history.nep2020 || {
                                  heading: "A University Inspired by NEP 2020",
                                  subheading: "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.",
                                  coreBadge: "NEP 2020",
                                  nodes: []
                                }),
                                subheading: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                      />
                    </div>

                    {/* Nodes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                      {(aboutForm.history.nep2020?.nodes || [
                        { label: "Holistic Learning", stat: "360°", desc: "Comprehensive physical & emotional growth." },
                        { label: "Research", stat: "Tier-1", desc: "Advanced labs & dedicated funding programs." },
                        { label: "Innovation", stat: "100+", desc: "Patents filed and ideation centers active." },
                        { label: "Skill Development", stat: "95%", desc: "Industry-ready practical curriculum." },
                        { label: "Entrepreneurship", stat: "50+", desc: "Startups incubated on campus annually." },
                        { label: "Multidisciplinary", stat: "12", desc: "Interconnected disciplines of study." }
                      ]).map((node, nIdx) => (
                        <div key={nIdx} className="p-3.5 rounded-xl border border-gray-200 bg-slate-50 space-y-2">
                          <div className="flex justify-between items-center">
                            <input
                              type="text"
                              value={node.stat}
                              onChange={(e) => {
                                const currentNodes = [...(aboutForm.history.nep2020?.nodes || [
                                  { label: "Holistic Learning", stat: "360°", desc: "Comprehensive physical & emotional growth." },
                                  { label: "Research", stat: "Tier-1", desc: "Advanced labs & dedicated funding programs." },
                                  { label: "Innovation", stat: "100+", desc: "Patents filed and ideation centers active." },
                                  { label: "Skill Development", stat: "95%", desc: "Industry-ready practical curriculum." },
                                  { label: "Entrepreneurship", stat: "50+", desc: "Startups incubated on campus annually." },
                                  { label: "Multidisciplinary", stat: "12", desc: "Interconnected disciplines of study." }
                                ])];
                                currentNodes[nIdx] = { ...currentNodes[nIdx], stat: e.target.value };
                                setAboutForm({
                                  ...aboutForm,
                                  history: {
                                    ...aboutForm.history,
                                    nep2020: {
                                      ...(aboutForm.history.nep2020 || {
                                        heading: "A University Inspired by NEP 2020",
                                        subheading: "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.",
                                        coreBadge: "NEP 2020"
                                      }),
                                      nodes: currentNodes
                                    }
                                  }
                                });
                              }}
                              placeholder="Badge (e.g. 360°)"
                              className="w-20 h-7 px-2 text-xs font-bold text-blue-700 bg-white border border-gray-200 rounded"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const currentNodes = [...(aboutForm.history.nep2020?.nodes || [
                                  { label: "Holistic Learning", stat: "360°", desc: "Comprehensive physical & emotional growth." },
                                  { label: "Research", stat: "Tier-1", desc: "Advanced labs & dedicated funding programs." },
                                  { label: "Innovation", stat: "100+", desc: "Patents filed and ideation centers active." },
                                  { label: "Skill Development", stat: "95%", desc: "Industry-ready practical curriculum." },
                                  { label: "Entrepreneurship", stat: "50+", desc: "Startups incubated on campus annually." },
                                  { label: "Multidisciplinary", stat: "12", desc: "Interconnected disciplines of study." }
                                ])];
                                const updated = currentNodes.filter((_, i) => i !== nIdx);
                                setAboutForm({
                                  ...aboutForm,
                                  history: {
                                    ...aboutForm.history,
                                    nep2020: {
                                      ...(aboutForm.history.nep2020 || {
                                        heading: "A University Inspired by NEP 2020",
                                        subheading: "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.",
                                        coreBadge: "NEP 2020"
                                      }),
                                      nodes: updated
                                    }
                                  }
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete Node"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={node.label}
                            onChange={(e) => {
                              const currentNodes = [...(aboutForm.history.nep2020?.nodes || [
                                { label: "Holistic Learning", stat: "360°", desc: "Comprehensive physical & emotional growth." },
                                { label: "Research", stat: "Tier-1", desc: "Advanced labs & dedicated funding programs." },
                                { label: "Innovation", stat: "100+", desc: "Patents filed and ideation centers active." },
                                { label: "Skill Development", stat: "95%", desc: "Industry-ready practical curriculum." },
                                { label: "Entrepreneurship", stat: "50+", desc: "Startups incubated on campus annually." },
                                { label: "Multidisciplinary", stat: "12", desc: "Interconnected disciplines of study." }
                              ])];
                              currentNodes[nIdx] = { ...currentNodes[nIdx], label: e.target.value };
                              setAboutForm({
                                ...aboutForm,
                                history: {
                                  ...aboutForm.history,
                                  nep2020: {
                                    ...(aboutForm.history.nep2020 || {
                                      heading: "A University Inspired by NEP 2020",
                                      subheading: "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.",
                                      coreBadge: "NEP 2020"
                                    }),
                                    nodes: currentNodes
                                  }
                                }
                              });
                            }}
                            placeholder="Node Title"
                            className="w-full h-8 px-2 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded"
                          />
                          <textarea
                            rows={2}
                            value={node.desc}
                            onChange={(e) => {
                              const currentNodes = [...(aboutForm.history.nep2020?.nodes || [
                                { label: "Holistic Learning", stat: "360°", desc: "Comprehensive physical & emotional growth." },
                                { label: "Research", stat: "Tier-1", desc: "Advanced labs & dedicated funding programs." },
                                { label: "Innovation", stat: "100+", desc: "Patents filed and ideation centers active." },
                                { label: "Skill Development", stat: "95%", desc: "Industry-ready practical curriculum." },
                                { label: "Entrepreneurship", stat: "50+", desc: "Startups incubated on campus annually." },
                                { label: "Multidisciplinary", stat: "12", desc: "Interconnected disciplines of study." }
                              ])];
                              currentNodes[nIdx] = { ...currentNodes[nIdx], desc: e.target.value };
                              setAboutForm({
                                ...aboutForm,
                                history: {
                                  ...aboutForm.history,
                                  nep2020: {
                                    ...(aboutForm.history.nep2020 || {
                                      heading: "A University Inspired by NEP 2020",
                                      subheading: "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.",
                                      coreBadge: "NEP 2020"
                                    }),
                                    nodes: currentNodes
                                  }
                                }
                              });
                            }}
                            placeholder="Description"
                            className="w-full p-2 text-[11px] bg-white border border-gray-200 rounded font-normal"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Academic Evolution & Schools */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">Academic Evolution & Constituent Schools</h4>
                        <p className="text-xs text-gray-500">Edit the 3 core university schools and their academic departments/specializations</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentSchools = aboutForm.history.academicEvolution?.schools || [
                            { title: "School of Computing Sciences", tags: ["Computer Science & Engineering", "Artificial Intelligence", "Data Science", "Cyber Security"] },
                            { title: "School of Engineering", tags: ["Electronics and Communication Engineering", "Civil Engineering", "Basic Science & Humanities"] },
                            { title: "School of Business & Management", tags: ["Business and Management"] }
                          ];
                          const updated = [...currentSchools, { title: "New School of Studies", tags: ["Department 1", "Department 2"] }];
                          setAboutForm({
                            ...aboutForm,
                            history: {
                              ...aboutForm.history,
                              academicEvolution: {
                                ...(aboutForm.history.academicEvolution || {
                                  heading: "Academic Evolution",
                                  subheading: "Three schools designed for the future of industry and research."
                                }),
                                schools: updated
                              }
                            }
                          });
                        }}
                        className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus size={13} /> Add School
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Section Heading</label>
                        <input
                          type="text"
                          value={aboutForm.history.academicEvolution?.heading || "Academic Evolution"}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              history: {
                                ...aboutForm.history,
                                academicEvolution: {
                                  ...(aboutForm.history.academicEvolution || {
                                    heading: "Academic Evolution",
                                    subheading: "Three schools designed for the future of industry and research.",
                                    schools: []
                                  }),
                                  heading: e.target.value
                                }
                              }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Section Subtitle</label>
                        <input
                          type="text"
                          value={aboutForm.history.academicEvolution?.subheading || "Three schools designed for the future of industry and research."}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              history: {
                                ...aboutForm.history,
                                academicEvolution: {
                                  ...(aboutForm.history.academicEvolution || {
                                    heading: "Academic Evolution",
                                    subheading: "Three schools designed for the future of industry and research.",
                                    schools: []
                                  }),
                                  subheading: e.target.value
                                }
                              }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(aboutForm.history.academicEvolution?.schools || [
                        { title: "School of Computing Sciences", tags: ["Computer Science & Engineering", "Artificial Intelligence", "Data Science", "Cyber Security"] },
                        { title: "School of Engineering", tags: ["Electronics and Communication Engineering", "Civil Engineering", "Basic Science & Humanities"] },
                        { title: "School of Business & Management", tags: ["Business and Management"] }
                      ]).map((sch, sIdx) => (
                        <div key={sIdx} className="p-4 rounded-xl border border-gray-200 bg-slate-50 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase text-gray-500">School {sIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentSchools = [...(aboutForm.history.academicEvolution?.schools || [
                                  { title: "School of Computing Sciences", tags: ["Computer Science & Engineering", "Artificial Intelligence", "Data Science", "Cyber Security"] },
                                  { title: "School of Engineering", tags: ["Electronics and Communication Engineering", "Civil Engineering", "Basic Science & Humanities"] },
                                  { title: "School of Business & Management", tags: ["Business and Management"] }
                                ])];
                                const updated = currentSchools.filter((_, i) => i !== sIdx);
                                setAboutForm({
                                  ...aboutForm,
                                  history: {
                                    ...aboutForm.history,
                                    academicEvolution: {
                                      ...(aboutForm.history.academicEvolution || {
                                        heading: "Academic Evolution",
                                        subheading: "Three schools designed for the future of industry and research."
                                      }),
                                      schools: updated
                                    }
                                  }
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete School"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 uppercase">School Title</label>
                            <input
                              type="text"
                              value={sch.title}
                              onChange={(e) => {
                                const currentSchools = [...(aboutForm.history.academicEvolution?.schools || [
                                  { title: "School of Computing Sciences", tags: ["Computer Science & Engineering", "Artificial Intelligence", "Data Science", "Cyber Security"] },
                                  { title: "School of Engineering", tags: ["Electronics and Communication Engineering", "Civil Engineering", "Basic Science & Humanities"] },
                                  { title: "School of Business & Management", tags: ["Business and Management"] }
                                ])];
                                currentSchools[sIdx] = { ...currentSchools[sIdx], title: e.target.value };
                                setAboutForm({
                                  ...aboutForm,
                                  history: {
                                    ...aboutForm.history,
                                    academicEvolution: {
                                      ...(aboutForm.history.academicEvolution || {
                                        heading: "Academic Evolution",
                                        subheading: "Three schools designed for the future of industry and research."
                                      }),
                                      schools: currentSchools
                                    }
                                  }
                                });
                              }}
                              className="w-full h-8 px-2 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 uppercase">Departments / Tags (Comma-separated)</label>
                            <textarea
                              rows={3}
                              value={sch.tags.join(", ")}
                              onChange={(e) => {
                                const tagsArr = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                                const currentSchools = [...(aboutForm.history.academicEvolution?.schools || [
                                  { title: "School of Computing Sciences", tags: ["Computer Science & Engineering", "Artificial Intelligence", "Data Science", "Cyber Security"] },
                                  { title: "School of Engineering", tags: ["Electronics and Communication Engineering", "Civil Engineering", "Basic Science & Humanities"] },
                                  { title: "School of Business & Management", tags: ["Business and Management"] }
                                ])];
                                currentSchools[sIdx] = { ...currentSchools[sIdx], tags: tagsArr };
                                setAboutForm({
                                  ...aboutForm,
                                  history: {
                                    ...aboutForm.history,
                                    academicEvolution: {
                                      ...(aboutForm.history.academicEvolution || {
                                        heading: "Academic Evolution",
                                        subheading: "Three schools designed for the future of industry and research."
                                      }),
                                      schools: currentSchools
                                    }
                                  }
                                });
                              }}
                              className="w-full p-2 text-[11px] bg-white border border-gray-200 rounded font-medium"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Innovation Ecosystem Flowchart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">Innovation Ecosystem Flowchart</h4>
                        <p className="text-xs text-gray-500">Ordered step-by-step pipeline from Student to Global Impact</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const currentSteps = aboutForm.history.innovationEcosystem?.steps || [
                            "Student", "Idea", "Innovation Lab", "Prototype", "Research", "Incubation", "Startup", "Industry", "Global Impact"
                          ];
                          const updated = [...currentSteps, "New Step"];
                          setAboutForm({
                            ...aboutForm,
                            history: {
                              ...aboutForm.history,
                              innovationEcosystem: {
                                ...(aboutForm.history.innovationEcosystem || { heading: "Innovation Ecosystem" }),
                                steps: updated
                              }
                            }
                          });
                        }}
                        className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus size={13} /> Add Flow Step
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Heading</label>
                      <input
                        type="text"
                        value={aboutForm.history.innovationEcosystem?.heading || "Innovation Ecosystem"}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            history: {
                              ...aboutForm.history,
                              innovationEcosystem: {
                                ...(aboutForm.history.innovationEcosystem || { steps: [] }),
                                heading: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {(aboutForm.history.innovationEcosystem?.steps || [
                        "Student", "Idea", "Innovation Lab", "Prototype", "Research", "Incubation", "Startup", "Industry", "Global Impact"
                      ]).map((step, sIdx, arr) => (
                        <div key={sIdx} className="flex items-center gap-1 bg-slate-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                          <span className="text-[10px] font-bold text-gray-400 mr-1">{sIdx + 1}</span>
                          <input
                            type="text"
                            value={step}
                            onChange={(e) => {
                              const currentSteps = [...(aboutForm.history.innovationEcosystem?.steps || [
                                "Student", "Idea", "Innovation Lab", "Prototype", "Research", "Incubation", "Startup", "Industry", "Global Impact"
                              ])];
                              currentSteps[sIdx] = e.target.value;
                              setAboutForm({
                                ...aboutForm,
                                history: {
                                  ...aboutForm.history,
                                  innovationEcosystem: {
                                    ...(aboutForm.history.innovationEcosystem || { heading: "Innovation Ecosystem" }),
                                    steps: currentSteps
                                  }
                                }
                              });
                            }}
                            className="w-28 h-6 px-1 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const currentSteps = [...(aboutForm.history.innovationEcosystem?.steps || [
                                "Student", "Idea", "Innovation Lab", "Prototype", "Research", "Incubation", "Startup", "Industry", "Global Impact"
                              ])];
                              const updated = currentSteps.filter((_, i) => i !== sIdx);
                              setAboutForm({
                                ...aboutForm,
                                history: {
                                  ...aboutForm.history,
                                  innovationEcosystem: {
                                    ...(aboutForm.history.innovationEcosystem || { heading: "Innovation Ecosystem" }),
                                    steps: updated
                                  }
                                }
                              });
                            }}
                            className="text-gray-400 hover:text-red-600 p-0.5 cursor-pointer ml-1"
                            title="Delete Step"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6. Innovation Infrastructure (Bento Facilities) */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">Innovation Infrastructure (4 Facilities Bento)</h4>
                        <p className="text-xs text-gray-500">Manage Innovation Centre, Centres of Excellence, Maker Space, and E-Cell facilities with validated images</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Section Heading</label>
                        <input
                          type="text"
                          value={aboutForm.history.innovationInfrastructure?.heading || "Innovation Infrastructure"}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              history: {
                                ...aboutForm.history,
                                innovationInfrastructure: {
                                  ...(aboutForm.history.innovationInfrastructure || {
                                    heading: "Innovation Infrastructure",
                                    subheading: "State-of-the-art facilities designed to transition students from passive recipients into active innovators.",
                                    items: []
                                  }),
                                  heading: e.target.value
                                }
                              }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Subheading / Description</label>
                        <input
                          type="text"
                          value={aboutForm.history.innovationInfrastructure?.subheading || "State-of-the-art facilities designed to transition students from passive recipients into active innovators."}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              history: {
                                ...aboutForm.history,
                                innovationInfrastructure: {
                                  ...(aboutForm.history.innovationInfrastructure || {
                                    heading: "Innovation Infrastructure",
                                    subheading: "State-of-the-art facilities designed to transition students from passive recipients into active innovators.",
                                    items: []
                                  }),
                                  heading: aboutForm.history.innovationInfrastructure?.heading || "Innovation Infrastructure",
                                  subheading: e.target.value,
                                  items: aboutForm.history.innovationInfrastructure?.items || []
                                }
                              }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                      {(aboutForm.history.innovationInfrastructure?.items || [
                        { id: "center", title: "Innovation Centre", desc: "Seed-stage mentoring, prototyping support, and startup incubation.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" },
                        { id: "excellence", title: "Centres of Excellence", desc: "AI/ML, IoT & Robotics" },
                        { id: "maker", title: "Maker Space", desc: "Hands-on fabrication" },
                        { id: "ecell", title: "E-Cell & Industry Interface", desc: "Structured venture-creation training and continuous industry alignment." }
                      ]).map((item, iIdx) => (
                        <div key={iIdx} className="p-3 bg-slate-50 rounded-xl border border-gray-200 space-y-2">
                          <span className="text-[10px] font-black uppercase text-[#072A6C]">Facility {iIdx + 1}</span>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 uppercase">Facility Name</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const currentItems = [...(aboutForm.history.innovationInfrastructure?.items || [
                                  { id: "center", title: "Innovation Centre", desc: "Seed-stage mentoring, prototyping support, and startup incubation.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" },
                                  { id: "excellence", title: "Centres of Excellence", desc: "AI/ML, IoT & Robotics" },
                                  { id: "maker", title: "Maker Space", desc: "Hands-on fabrication" },
                                  { id: "ecell", title: "E-Cell & Industry Interface", desc: "Structured venture-creation training and continuous industry alignment." }
                                ])];
                                currentItems[iIdx] = { ...currentItems[iIdx], title: e.target.value };
                                setAboutForm({
                                  ...aboutForm,
                                  history: {
                                    ...aboutForm.history,
                                    innovationInfrastructure: {
                                      ...(aboutForm.history.innovationInfrastructure || {
                                        heading: "Innovation Infrastructure",
                                        subheading: "State-of-the-art facilities designed to transition students from passive recipients into active innovators."
                                      }),
                                      items: currentItems
                                    }
                                  }
                                });
                              }}
                              className="w-full h-8 px-2 text-xs font-bold text-[#072A6C] bg-white border border-gray-200 rounded"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-500 uppercase">Description</label>
                            <textarea
                              rows={2}
                              value={item.desc}
                              onChange={(e) => {
                                const currentItems = [...(aboutForm.history.innovationInfrastructure?.items || [
                                  { id: "center", title: "Innovation Centre", desc: "Seed-stage mentoring, prototyping support, and startup incubation.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" },
                                  { id: "excellence", title: "Centres of Excellence", desc: "AI/ML, IoT & Robotics" },
                                  { id: "maker", title: "Maker Space", desc: "Hands-on fabrication" },
                                  { id: "ecell", title: "E-Cell & Industry Interface", desc: "Structured venture-creation training and continuous industry alignment." }
                                ])];
                                currentItems[iIdx] = { ...currentItems[iIdx], desc: e.target.value };
                                setAboutForm({
                                  ...aboutForm,
                                  history: {
                                    ...aboutForm.history,
                                    innovationInfrastructure: {
                                      ...(aboutForm.history.innovationInfrastructure || {
                                        heading: "Innovation Infrastructure",
                                        subheading: "State-of-the-art facilities designed to transition students from passive recipients into active innovators."
                                      }),
                                      items: currentItems
                                    }
                                  }
                                });
                              }}
                              className="w-full p-2 text-[11px] bg-white border border-gray-200 rounded font-medium"
                            />
                          </div>
                          {iIdx === 0 && (
                            <ImageField
                              label="Innovation Centre Background Photo (Validated)"
                              value={item.img || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"}
                              defaultValue="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"
                              onReset={() => {
                                const currentItems = [...(aboutForm.history.innovationInfrastructure?.items || [])];
                                if (currentItems[0]) {
                                  currentItems[0] = { ...currentItems[0], img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" };
                                  setAboutForm({
                                    ...aboutForm,
                                    history: {
                                      ...aboutForm.history,
                                      innovationInfrastructure: {
                                        ...(aboutForm.history.innovationInfrastructure || {
                                          heading: "Innovation Infrastructure",
                                          subheading: "State-of-the-art facilities designed to transition students from passive recipients into active innovators."
                                        }),
                                        items: currentItems
                                      }
                                    }
                                  });
                                  notifySave("Innovation centre photo reset to default!");
                                }
                              }}
                              onChange={(newImg) => {
                                const currentItems = [...(aboutForm.history.innovationInfrastructure?.items || [
                                  { id: "center", title: "Innovation Centre", desc: "Seed-stage mentoring, prototyping support, and startup incubation.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" },
                                  { id: "excellence", title: "Centres of Excellence", desc: "AI/ML, IoT & Robotics" },
                                  { id: "maker", title: "Maker Space", desc: "Hands-on fabrication" },
                                  { id: "ecell", title: "E-Cell & Industry Interface", desc: "Structured venture-creation training and continuous industry alignment." }
                                ])];
                                currentItems[iIdx] = { ...currentItems[iIdx], img: newImg };
                                setAboutForm({
                                  ...aboutForm,
                                  history: {
                                    ...aboutForm.history,
                                    innovationInfrastructure: {
                                      ...(aboutForm.history.innovationInfrastructure || {
                                        heading: "Innovation Infrastructure",
                                        subheading: "State-of-the-art facilities designed to transition students from passive recipients into active innovators."
                                      }),
                                      items: currentItems
                                    }
                                  }
                                });
                              }}
                              aspectRatio="video"
                              recommendedSize="1200 × 700 px (Landscape Facility)"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7. Our Vision for Tomorrow (Finale) */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">Our Vision for Tomorrow (Finale Banner)</h4>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Heading</label>
                      <input
                        type="text"
                        value={aboutForm.history.visionForTomorrow?.heading || "Our Vision for Tomorrow"}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            history: {
                              ...aboutForm.history,
                              visionForTomorrow: {
                                ...(aboutForm.history.visionForTomorrow || {
                                  paragraph: "Chalapathi University is envisioned as a multidisciplinary institution where innovation meets purpose, research fuels progress, and every learner is empowered to become a leader capable of creating meaningful impact across the world."
                                }),
                                heading: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Vision Narrative Statement</label>
                      <textarea
                        rows={3}
                        value={aboutForm.history.visionForTomorrow?.paragraph || "Chalapathi University is envisioned as a multidisciplinary institution where innovation meets purpose, research fuels progress, and every learner is empowered to become a leader capable of creating meaningful impact across the world."}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            history: {
                              ...aboutForm.history,
                              visionForTomorrow: {
                                ...(aboutForm.history.visionForTomorrow || {
                                  heading: "Our Vision for Tomorrow"
                                }),
                                paragraph: e.target.value
                              }
                            }
                          })
                        }
                        className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Sub-tab: Vision & Mission */}
              {activeAboutSubTab === "vision" && (
                <div className="space-y-5 text-left">
                  {/* Vision Statement */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-[#072A6C] uppercase">Official Vision Statement</h3>
                        <p className="text-xs text-gray-500">Core guiding institutional vision for Chalapathi University</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAboutForm({
                              ...aboutForm,
                              vision: INITIAL_ABOUT_CONTENT.vision
                            });
                            notifySave("Vision & Mission reset to default!");
                          }}
                          className="h-9 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RotateCcw size={13} /> Reset Vision & Mission
                        </button>
                        <button
                          onClick={saveAbout}
                          className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save size={13} /> Save Vision & Mission
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Vision Statement Text</label>
                      <textarea
                        rows={3}
                        value={aboutForm.vision.visionText}
                        onChange={(e) =>
                          setAboutForm({
                            ...aboutForm,
                            vision: { ...aboutForm.vision, visionText: e.target.value }
                          })
                        }
                        className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl leading-relaxed font-medium"
                      />
                    </div>
                  </div>

                  {/* Mission Statements */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-[#072A6C] uppercase">Mission Statements</h3>
                        <p className="text-xs text-gray-500">Bullet points defining the university's academic and societal mission</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(aboutForm.vision.missionList || []), "New institutional mission objective."];
                          setAboutForm({
                            ...aboutForm,
                            vision: { ...aboutForm.vision, missionList: updated }
                          });
                        }}
                        className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} /> Add Mission Point
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {aboutForm.vision.missionList?.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-900 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const updated = [...aboutForm.vision.missionList];
                              updated[idx] = e.target.value;
                              setAboutForm({
                                ...aboutForm,
                                vision: { ...aboutForm.vision, missionList: updated }
                              });
                            }}
                            className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-800"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = aboutForm.vision.missionList.filter((_, i) => i !== idx);
                              setAboutForm({
                                ...aboutForm,
                                vision: { ...aboutForm.vision, missionList: updated }
                              });
                            }}
                            className="text-gray-400 hover:text-red-600 p-1.5 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Sub-tab: Leadership & Chairman */}
              {activeAboutSubTab === "leadership" && (
                <div className="space-y-6 text-left">
                  {/* Top Header & Save */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <div>
                      <h3 className="text-base font-black text-[#072A6C] tracking-tight">University Leadership & Governing Board</h3>
                      <p className="text-xs text-gray-500">Manage the Chairman profile, university officers, and governing board members directory with photos and credentials</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAboutForm({
                            ...aboutForm,
                            leadership: INITIAL_ABOUT_CONTENT.leadership
                          });
                          setBoardForm(INITIAL_BOARD_DATA);
                          updateBoardData(INITIAL_BOARD_DATA);
                          notifySave("Leadership & Board reset to default!");
                        }}
                        className="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={14} /> Reset Leadership
                      </button>
                      <button
                        onClick={() => {
                          saveAbout();
                          saveDirectories();
                          notifySave("Leadership & Board Directory published live!");
                        }}
                        className="h-10 px-5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                      >
                        <Save size={14} /> Save Leadership & Board
                      </button>
                    </div>
                  </div>

                  {/* Chairman Profile */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">Chairman & Founder President Profile</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Chairman Full Name</label>
                        <input
                          type="text"
                          value={aboutForm.leadership.chairmanName || ""}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              leadership: { ...aboutForm.leadership, chairmanName: e.target.value }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Designation / Role Title</label>
                        <input
                          type="text"
                          value={aboutForm.leadership.designation || ""}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              leadership: { ...aboutForm.leadership, designation: e.target.value }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Headline Quote / Philosophy Tagline</label>
                        <input
                          type="text"
                          value={aboutForm.leadership.messageQuote || ""}
                          onChange={(e) =>
                            setAboutForm({
                              ...aboutForm,
                              leadership: { ...aboutForm.leadership, messageQuote: e.target.value }
                            })
                          }
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-semibold text-blue-900"
                        />
                      </div>
                      <ImageField
                        label="Chairman Portrait Photo"
                        value={aboutForm.leadership.chairmanImage || "/chairman_v4.png"}
                        defaultValue="/chairman_v4.png"
                        onReset={() => {
                          setAboutForm({
                            ...aboutForm,
                            leadership: { ...aboutForm.leadership, chairmanImage: "/chairman_v4.png" }
                          });
                          notifySave("Chairman portrait reset to default!");
                        }}
                        onChange={(newImg) =>
                          setAboutForm({
                            ...aboutForm,
                            leadership: { ...aboutForm.leadership, chairmanImage: newImg }
                          })
                        }
                        aspectRatio="portrait"
                        recommendedSize="400 × 500 px (Portrait)"
                      />
                    </div>
                  </div>

                  {/* Chairman Message Paragraphs */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">Official Message Narrative</h4>
                        <p className="text-xs text-gray-500">Each paragraph renders in sequence on the leadership message section</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(aboutForm.leadership.messageParagraphs || []), "New paragraph content for chairman message."];
                          setAboutForm({
                            ...aboutForm,
                            leadership: { ...aboutForm.leadership, messageParagraphs: updated }
                          });
                        }}
                        className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={13} /> Add Paragraph
                      </button>
                    </div>

                    <div className="space-y-3">
                      {aboutForm.leadership.messageParagraphs?.map((p, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-gray-200 bg-slate-50/50 space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase text-gray-500">Paragraph {idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = aboutForm.leadership.messageParagraphs.filter((_, i) => i !== idx);
                                setAboutForm({
                                  ...aboutForm,
                                  leadership: { ...aboutForm.leadership, messageParagraphs: updated }
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete Paragraph"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => {
                              const updated = [...aboutForm.leadership.messageParagraphs];
                              updated[idx] = e.target.value;
                              setAboutForm({
                                ...aboutForm,
                                leadership: { ...aboutForm.leadership, messageParagraphs: updated }
                              });
                            }}
                            className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-lg leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Governing Board Members & Officers Directory */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">Governing Board Members & Leadership Council</h4>
                        <p className="text-xs text-gray-500">Edit member photos, names, titles, qualifications, and bios displayed on /about/leadership</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newKey = `Officer_${Date.now()}`;
                          const newMember: FacultyMember = {
                            name: "New Board Member",
                            title: "Member, Governing Council",
                            edu: "Ph.D. / M.Tech",
                            interests: "Institutional planning & research governance",
                            phone: "0863 2345499",
                            email: "member@city.ac.in",
                            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
                            age: "45 Years",
                            experience: "15 Years",
                            idNo: `CUB-M-${Date.now().toString().slice(-4)}`,
                            department: "Governing Council"
                          };
                          const updated = {
                            ...boardForm,
                            [newKey]: { hod: newMember, others: [] }
                          };
                          setBoardForm(updated);
                          updateBoardData(updated);
                        }}
                        className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus size={13} /> Add Board Member
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(boardForm).map(([roleKey, dirData]) => {
                        const member = dirData.hod;
                        if (!member) return null;

                        return (
                          <div key={roleKey} className="p-4 rounded-xl border border-gray-200 bg-slate-50/70 space-y-3 flex flex-col justify-between">
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                <span className="text-[11px] font-black text-[#072A6C] truncate max-w-[200px]">{roleKey}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const copy = { ...boardForm };
                                    delete copy[roleKey];
                                    setBoardForm(copy);
                                    updateBoardData(copy);
                                  }}
                                  className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                                  title="Delete Board Member"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>

                              <ImageField
                                label="Member Photo (Validated)"
                                value={member.avatar || INITIAL_BOARD_DATA[roleKey]?.hod?.avatar || ""}
                                defaultValue={INITIAL_BOARD_DATA[roleKey]?.hod?.avatar || member.avatar || ""}
                                onReset={() => {
                                  const fallback = INITIAL_BOARD_DATA[roleKey]?.hod?.avatar || member.avatar || "";
                                  const updated = {
                                    ...boardForm,
                                    [roleKey]: {
                                      ...dirData,
                                      hod: { ...member, avatar: fallback }
                                    }
                                  };
                                  setBoardForm(updated);
                                  notifySave("Member photo reset to default!");
                                }}
                                onChange={(newAvatar) => {
                                  const updated = {
                                    ...boardForm,
                                    [roleKey]: {
                                      ...dirData,
                                      hod: { ...member, avatar: newAvatar }
                                    }
                                  };
                                  setBoardForm(updated);
                                }}
                                aspectRatio="portrait"
                                recommendedSize="400 × 500 px (Portrait)"
                              />

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Full Name</label>
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => {
                                    const updated = {
                                      ...boardForm,
                                      [roleKey]: {
                                        ...dirData,
                                        hod: { ...member, name: e.target.value }
                                      }
                                    };
                                    setBoardForm(updated);
                                  }}
                                  className="w-full h-8 px-2 text-xs font-bold bg-white border border-gray-200 rounded"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Title / Designation</label>
                                <input
                                  type="text"
                                  value={member.title}
                                  onChange={(e) => {
                                    const updated = {
                                      ...boardForm,
                                      [roleKey]: {
                                        ...dirData,
                                        hod: { ...member, title: e.target.value }
                                      }
                                    };
                                    setBoardForm(updated);
                                  }}
                                  className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Education / Qualifications</label>
                                <input
                                  type="text"
                                  value={member.edu}
                                  onChange={(e) => {
                                    const updated = {
                                      ...boardForm,
                                      [roleKey]: {
                                        ...dirData,
                                        hod: { ...member, edu: e.target.value }
                                      }
                                    };
                                    setBoardForm(updated);
                                  }}
                                  className="w-full h-8 px-2 text-[11px] bg-white border border-gray-200 rounded text-gray-700"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Specialization / Interests</label>
                                <textarea
                                  rows={2}
                                  value={member.interests}
                                  onChange={(e) => {
                                    const updated = {
                                      ...boardForm,
                                      [roleKey]: {
                                        ...dirData,
                                        hod: { ...member, interests: e.target.value }
                                      }
                                    };
                                    setBoardForm(updated);
                                  }}
                                  className="w-full p-2 text-[11px] bg-white border border-gray-200 rounded"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-500 uppercase">Experience</label>
                                  <input
                                    type="text"
                                    value={member.experience}
                                    onChange={(e) => {
                                      const updated = {
                                        ...boardForm,
                                        [roleKey]: {
                                          ...dirData,
                                          hod: { ...member, experience: e.target.value }
                                        }
                                      };
                                      setBoardForm(updated);
                                    }}
                                    className="w-full h-7 px-2 text-[11px] bg-white border border-gray-200 rounded"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-gray-500 uppercase">Email</label>
                                  <input
                                    type="text"
                                    value={member.email}
                                    onChange={(e) => {
                                      const updated = {
                                        ...boardForm,
                                        [roleKey]: {
                                          ...dirData,
                                          hod: { ...member, email: e.target.value }
                                        }
                                      };
                                      setBoardForm(updated);
                                    }}
                                    className="w-full h-7 px-2 text-[11px] bg-white border border-gray-200 rounded"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Sub-tab: Chalapathi Advantage */}
              {activeAboutSubTab === "advantage" && (
                <div className="space-y-5 text-left">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-[#072A6C] uppercase">The Chalapathi Advantage Cards</h3>
                        <p className="text-xs text-gray-500">Manage curriculum, immersion, infrastructure, and placement advantage pillars</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...(aboutForm.advantage.cards || []),
                              { title: "New Advantage Pillar", desc: "Brief summary of institutional benefit.", detail: "Comprehensive description and in-depth details." }
                            ];
                            setAboutForm({
                              ...aboutForm,
                              advantage: { ...aboutForm.advantage, cards: updated }
                            });
                          }}
                          className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={13} /> Add Card
                        </button>
                        <button
                          onClick={saveAbout}
                          className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save size={13} /> Save Advantage
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {aboutForm.advantage.cards?.map((card, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-2.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">Advantage Pillar {idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = aboutForm.advantage.cards.filter((_, i) => i !== idx);
                                setAboutForm({
                                  ...aboutForm,
                                  advantage: { ...aboutForm.advantage, cards: updated }
                                });
                              }}
                              className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              title="Delete Card"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Title</label>
                            <input
                              type="text"
                              value={card.title}
                              onChange={(e) => {
                                const updated = [...aboutForm.advantage.cards];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setAboutForm({
                                  ...aboutForm,
                                  advantage: { ...aboutForm.advantage, cards: updated }
                                });
                              }}
                              className="w-full h-8 px-2.5 text-xs font-bold bg-white border border-gray-200 rounded-lg text-gray-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Short Summary Description</label>
                            <textarea
                              rows={2}
                              value={card.desc}
                              onChange={(e) => {
                                const updated = [...aboutForm.advantage.cards];
                                updated[idx] = { ...updated[idx], desc: e.target.value };
                                setAboutForm({
                                  ...aboutForm,
                                  advantage: { ...aboutForm.advantage, cards: updated }
                                });
                              }}
                              className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">In-Depth Details</label>
                            <textarea
                              rows={3}
                              value={card.detail}
                              onChange={(e) => {
                                const updated = [...aboutForm.advantage.cards];
                                updated[idx] = { ...updated[idx], detail: e.target.value };
                                setAboutForm({
                                  ...aboutForm,
                                  advantage: { ...aboutForm.advantage, cards: updated }
                                });
                              }}
                              className="w-full p-2 text-xs bg-white border border-gray-200 rounded-lg"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 4: ACADEMICS & 19-SECTION PROGRAM BUILDER        */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "academics" && (
            <div className="space-y-6 animate-fade-in text-left">
              <SectionHeader
                title="Academics & 19-Section Program Builder"
                subtitle="Manage program curriculum, syllabus files, year flowcharts, and section visibility"
                icon={GraduationCap}
                onSave={saveProgramDetails}
                saveSuccess={saveSuccess}
                onReset={() => {
                  setProgramsList(PROGRAMS_DATA);
                  updatePrograms(PROGRAMS_DATA);
                  setAcademicData(DEFAULT_ACADEMIC_STRUCTURE);
                  updateAcademicStructure(DEFAULT_ACADEMIC_STRUCTURE);
                  setProgSectionsOrder(DEFAULT_PROGRAM_SECTIONS);
                  notifySave("Academics content reset to default!");
                }}
                resetLabel="Reset Academics"
              />

              {/* Program Selector */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-gray-700 uppercase shrink-0">Select Program:</span>
                  <select
                    value={selectedProgSlug}
                    onChange={(e) => setSelectedProgSlug(e.target.value)}
                    className="flex-1 sm:w-80 h-9 px-3 text-xs font-bold bg-slate-50 border border-gray-200 rounded-xl text-[#072A6C] focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {programsList.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.title} ({p.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const title = prompt("Enter new program title (e.g. B.Tech - Robotics & Automation):");
                      if (!title) return;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                      const newProg: ProgramDetail = {
                        slug,
                        title,
                        department: "School of Engineering",
                        duration: "4 Years (Undergraduate)",
                        degreeType: "B.Tech",
                        overview: "Industry aligned degree program.",
                        desc: "Comprehensive engineering curriculum.",
                        curriculum: ["Semester 1", "Semester 2", "Semester 3", "Semester 4"],
                        careers: [{ title: "Domain Specialist", desc: "Industry professional." }]
                      };
                      const updated = [newProg, ...programsList];
                      setProgramsList(updated);
                      updatePrograms(updated);
                      setSelectedProgSlug(slug);
                      notifySave(`Created new program: ${title}`);
                    }}
                    className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Program
                  </button>
                  <Link
                    to={`/academics/${selectedProgSlug}`}
                    target="_blank"
                    className="h-8 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <ExternalLink size={12} /> View Program Page
                  </Link>
                </div>
              </div>

              {/* 19 Section Order & Visibility */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-[#072A6C] uppercase">
                      19 Program Sections (Order & Visibility for {currentProg?.title})
                    </h3>
                    <p className="text-xs text-gray-500">Reorder and toggle specific sections for this program detail page</p>
                  </div>
                  <button
                    onClick={saveProgramDetails}
                    className="h-8 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Save size={13} /> Save Program
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {progSectionsOrder.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                        sec.enabled ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800 truncate max-w-[150px]">{sec.title}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = progSectionsOrder.map((s) => (s.id === sec.id ? { ...s, enabled: !s.enabled } : s));
                            setProgSectionsOrder(updated);
                          }}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer ${
                            sec.enabled ? "bg-emerald-50 text-emerald-700" : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {sec.enabled ? "ON" : "OFF"}
                        </button>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const updated = [...progSectionsOrder];
                            const temp = updated[idx];
                            updated[idx] = updated[idx - 1];
                            updated[idx - 1] = temp;
                            setProgSectionsOrder(updated);
                          }}
                          className="p-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === progSectionsOrder.length - 1}
                          onClick={() => {
                            const updated = [...progSectionsOrder];
                            const temp = updated[idx];
                            updated[idx] = updated[idx + 1];
                            updated[idx + 1] = temp;
                            setProgSectionsOrder(updated);
                          }}
                          className="p-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 5: ADMISSIONS & LEADS MANAGEMENT                */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "admissions" && (
            <AdmissionsCMS notifySave={notifySave} />
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 4: RESEARCH & INNOVATION CMS                     */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "research" && (
            <ResearchCMS notifySave={notifySave} />
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 5b: CAMPUS LIFE & FACILITIES CMS                 */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "campus-life" && (
            <div className="space-y-6 animate-fade-in text-left">
              <SectionHeader
                title="Campus Life & Facilities CMS"
                subtitle="Manage all 16 Campus Life pages, hero banners, feature cards, video tour player, and bottom photo galleries"
                icon={Library}
                onSave={saveFullCampusCMS}
                saveSuccess={saveSuccess}
                onReset={() => {
                  setCampusLifeForm(DEFAULT_CAMPUS_LIFE_CONTENT);
                  updateCampusLifeContent(DEFAULT_CAMPUS_LIFE_CONTENT);
                  notifySave("Campus life pages reset to defaults!");
                }}
                resetLabel="Reset All Pages"
              />

              {/* Main Subtabs: 1. Subpages CMS | 2. Homepage Tour Video */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCampusLifeSubTab("subpages")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                      campusLifeSubTab === "subpages"
                        ? "bg-[#072A6C] text-white shadow-sm"
                        : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                    }`}
                  >
                    <BookOpen size={14} /> 1. Campus Life Subpages CMS ({Object.keys(DEFAULT_CAMPUS_LIFE_CONTENT).length} Pages)
                  </button>
                  <button
                    onClick={() => setCampusLifeSubTab("homepage-tour")}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                      campusLifeSubTab === "homepage-tour"
                        ? "bg-[#072A6C] text-white shadow-sm"
                        : "bg-slate-100 text-gray-700 hover:bg-slate-200"
                    }`}
                  >
                    <Sparkles size={14} /> 2. Homepage Campus Tour & 8 Highlight Cards
                  </button>
                </div>

                <button
                  onClick={saveFullCampusCMS}
                  className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Save size={14} /> Save All Campus Life
                </button>
              </div>

              {campusLifeSubTab === "subpages" && (
                <div className="space-y-6">
                  {/* Subpage Pill Selector */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase text-[#072A6C] tracking-wider">
                        Select Campus Life Section to Edit:
                      </span>
                      <span className="text-[11px] font-bold text-gray-400">
                        {campusLifeSubpages.findIndex(p => p.path === selectedCampusSlug) + 1} of {campusLifeSubpages.length} sections
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                      {campusLifeSubpages.map((p) => {
                        const Icon = p.icon;
                        const isSelected = selectedCampusSlug === p.path;
                        return (
                          <button
                            key={p.path}
                            onClick={() => setSelectedCampusSlug(p.path)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-start gap-1 cursor-pointer ${
                              isSelected
                                ? "bg-[#072A6C] text-white border-[#072A6C] shadow-md ring-2 ring-[#D4AF37]/50"
                                : "bg-slate-50 text-gray-700 border-gray-200 hover:bg-blue-50/60 hover:border-blue-200"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <Icon size={14} className={isSelected ? "text-[#D4AF37]" : "text-blue-600"} />
                              {p.badge && (
                                <span className={`text-[8px] px-1 py-0.2 rounded font-extrabold ${isSelected ? 'bg-[#D4AF37] text-slate-900' : 'bg-blue-100 text-blue-700'}`}>
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-bold truncate w-full">{p.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Section Top Header & Direct Live Link */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-[#072A6C] text-white">
                          Route: {selectedCampusSlug}
                        </span>
                        <h3 className="text-base font-black text-[#072A6C] tracking-tight">
                          Editing: {currentCampusPage.title}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        All edits below are saved to backend and instantly displayed on the live website.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={selectedCampusSlug}
                        target="_blank"
                        className="h-9 px-3.5 bg-blue-50 hover:bg-blue-100 text-[#072A6C] text-xs font-bold rounded-xl flex items-center gap-1.5 border border-blue-200 transition-colors"
                      >
                        <ExternalLink size={13} /> View Live Page
                      </Link>
                      <button
                        onClick={saveFullCampusCMS}
                        className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                      >
                        <Save size={14} /> Save This Page
                      </button>
                    </div>
                  </div>

                  {/* 1. Hero Banner Editor */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                        <span>🖼️ 1. Hero Banner Header & Background</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Page Title / Heading</label>
                        <input
                          type="text"
                          value={currentCampusPage.title || ""}
                          onChange={(e) => updateSelectedPage({ title: e.target.value })}
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-gray-800 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Description / Subtitle</label>
                        <input
                          type="text"
                          value={currentCampusPage.desc || ""}
                          onChange={(e) => updateSelectedPage({ desc: e.target.value })}
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700 focus:bg-white"
                        />
                      </div>
                    </div>

                    <ImageField
                      label="Hero Background Image"
                      value={currentCampusPage.heroImage || "/campus_hero.png"}
                      defaultValue="/campus_hero.png"
                      recommendedSize="1920 × 600 px (Wide Banner)"
                      aspectRatio="banner"
                      onChange={(heroImage) => updateSelectedPage({ heroImage })}
                      onReset={() => updateSelectedPage({ heroImage: "/campus_hero.png" })}
                    />
                  </div>

                  {/* 2. Video Tour Section (if enabled / overview) */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                        <span>🎬 2. Campus Guided Tour Video Player</span>
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700">
                        <input
                          type="checkbox"
                          checked={Boolean(currentCampusPage.hasVideo)}
                          onChange={(e) => updateSelectedPage({ hasVideo: e.target.checked })}
                          className="rounded text-[#072A6C]"
                        />
                        Enable Video Section on this page
                      </label>
                    </div>

                    {currentCampusPage.hasVideo ? (
                      <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Video Heading</label>
                            <input
                              type="text"
                              value={currentCampusPage.videoTitle || "EXPERIENCE CHALAPATHI"}
                              onChange={(e) => updateSelectedPage({ videoTitle: e.target.value })}
                              className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-gray-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Video Description</label>
                            <textarea
                              rows={2}
                              value={currentCampusPage.videoDesc || ""}
                              onChange={(e) => updateSelectedPage({ videoDesc: e.target.value })}
                              className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Video Source URL (MP4 / WebM / Link)</label>
                          <input
                            type="text"
                            value={currentCampusPage.videoUrl || "/chalapathi_logo_intro.mp4"}
                            onChange={(e) => updateSelectedPage({ videoUrl: e.target.value })}
                            className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700"
                            placeholder="e.g. /chalapathi_logo_intro.mp4"
                          />
                        </div>

                        <ImageField
                          label="Video Thumbnail / Poster Image"
                          value={currentCampusPage.videoThumbnail || "/campus_life_bg.png"}
                          defaultValue="/campus_life_bg.png"
                          recommendedSize="1280 × 720 px (16:9 HD)"
                          aspectRatio="video"
                          onChange={(videoThumbnail) => updateSelectedPage({ videoThumbnail })}
                          onReset={() => updateSelectedPage({ videoThumbnail: "/campus_life_bg.png" })}
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">Video section is currently hidden on this page. Check the box above to enable it.</p>
                    )}
                  </div>

                  {/* 3. Highlight Cards Editor */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                          ✨ 3. Campus Highlight Cards ({currentCampusPage.highlights?.length || 0})
                        </h4>
                        <p className="text-[11px] text-gray-400">Cards shown at the top of the page with gold accent trim</p>
                      </div>
                      <button
                        onClick={() => {
                          const current = currentCampusPage.highlights || [];
                          updateSelectedPage({
                            highlights: [...current, { title: "New Feature", desc: "Description of the facility or feature." }]
                          });
                        }}
                        className="h-7 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus size={12} /> Add Highlight Card
                      </button>
                    </div>

                    {currentCampusPage.highlights && currentCampusPage.highlights.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {currentCampusPage.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/70 space-y-2 relative group">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-gray-400">Card #{hIdx + 1}</span>
                              <button
                                onClick={() => {
                                  const updated = (currentCampusPage.highlights || []).filter((_, i) => i !== hIdx);
                                  updateSelectedPage({ highlights: updated });
                                }}
                                className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                                title="Delete Card"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={h.title}
                              onChange={(e) => {
                                const updated = [...(currentCampusPage.highlights || [])];
                                updated[hIdx] = { ...updated[hIdx], title: e.target.value };
                                updateSelectedPage({ highlights: updated });
                              }}
                              className="w-full h-7 px-2 text-xs font-bold bg-white border border-gray-200 rounded"
                              placeholder="Title"
                            />
                            <textarea
                              rows={2}
                              value={h.desc}
                              onChange={(e) => {
                                const updated = [...(currentCampusPage.highlights || [])];
                                updated[hIdx] = { ...updated[hIdx], desc: e.target.value };
                                updateSelectedPage({ highlights: updated });
                              }}
                              className="w-full p-2 text-[11px] bg-white border border-gray-200 rounded leading-relaxed"
                              placeholder="Description"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-400 text-xs font-medium border border-dashed border-gray-200 rounded-xl">
                        No highlight cards on this page. Click "Add Highlight Card" to create one.
                      </div>
                    )}
                  </div>

                  {/* 4. Stats Counter Bar Editor */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                          📊 4. Numerical Stats Counters ({currentCampusPage.stats?.length || 0})
                        </h4>
                        <p className="text-[11px] text-gray-400">Prominent blue numbers bar with key metrics</p>
                      </div>
                      <button
                        onClick={() => {
                          const current = currentCampusPage.stats || [];
                          updateSelectedPage({
                            stats: [...current, { label: "Metric Name", value: "100+" }]
                          });
                        }}
                        className="h-7 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus size={12} /> Add Stat Counter
                      </button>
                    </div>

                    {currentCampusPage.stats && currentCampusPage.stats.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {currentCampusPage.stats.map((s, sIdx) => (
                          <div key={sIdx} className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 space-y-2 relative">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-blue-600">Stat #{sIdx + 1}</span>
                              <button
                                onClick={() => {
                                  const updated = (currentCampusPage.stats || []).filter((_, i) => i !== sIdx);
                                  updateSelectedPage({ stats: updated });
                                }}
                                className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                                title="Delete Stat"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={s.value}
                              onChange={(e) => {
                                const updated = [...(currentCampusPage.stats || [])];
                                updated[sIdx] = { ...updated[sIdx], value: e.target.value };
                                updateSelectedPage({ stats: updated });
                              }}
                              className="w-full h-8 px-2 text-sm font-black text-[#D4AF37] bg-white border border-gray-200 rounded"
                              placeholder="Value (e.g. 75,000+)"
                            />
                            <input
                              type="text"
                              value={s.label}
                              onChange={(e) => {
                                const updated = [...(currentCampusPage.stats || [])];
                                updated[sIdx] = { ...updated[sIdx], label: e.target.value };
                                updateSelectedPage({ stats: updated });
                              }}
                              className="w-full h-7 px-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded"
                              placeholder="Label (e.g. Physical Books)"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-400 text-xs font-medium border border-dashed border-gray-200 rounded-xl">
                        No stats counters configured on this page. Click "Add Stat Counter" if needed.
                      </div>
                    )}
                  </div>

                  {/* 5. Detailed Feature Sections Editor */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div>
                        <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                          🏛️ 5. Detailed Facility Sections ({currentCampusPage.sections?.length || 0})
                        </h4>
                        <p className="text-[11px] text-gray-400">Large content rows with photography and in-depth descriptions</p>
                      </div>
                      <button
                        onClick={() => {
                          const current = currentCampusPage.sections || [];
                          updateSelectedPage({
                            sections: [
                              ...current,
                              {
                                title: "New Facility Wing",
                                desc: "Detailed information regarding equipment, technology, and learning capabilities.",
                                image: "/campus_hero.png"
                              }
                            ]
                          });
                        }}
                        className="h-7 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus size={12} /> Add Content Section
                      </button>
                    </div>

                    {currentCampusPage.sections && currentCampusPage.sections.length > 0 ? (
                      <div className="space-y-4">
                        {currentCampusPage.sections.map((sec, secIdx) => (
                          <div key={secIdx} className="p-4 rounded-xl border border-gray-200 bg-slate-50/60 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                              <span className="text-xs font-black text-[#072A6C]">Section #{secIdx + 1}: {sec.title || "Untitled"}</span>
                              <button
                                onClick={() => {
                                  const updated = (currentCampusPage.sections || []).filter((_, i) => i !== secIdx);
                                  updateSelectedPage({ sections: updated });
                                }}
                                className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 size={12} /> Delete Section
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-600 uppercase">Section Title</label>
                                  <input
                                    type="text"
                                    value={sec.title}
                                    onChange={(e) => {
                                      const updated = [...(currentCampusPage.sections || [])];
                                      updated[secIdx] = { ...updated[secIdx], title: e.target.value };
                                      updateSelectedPage({ sections: updated });
                                    }}
                                    className="w-full h-8 px-2.5 text-xs font-bold bg-white border border-gray-200 rounded-lg"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-600 uppercase">Description</label>
                                  <textarea
                                    rows={4}
                                    value={sec.desc}
                                    onChange={(e) => {
                                      const updated = [...(currentCampusPage.sections || [])];
                                      updated[secIdx] = { ...updated[secIdx], desc: e.target.value };
                                      updateSelectedPage({ sections: updated });
                                    }}
                                    className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-lg leading-relaxed text-gray-700"
                                  />
                                </div>
                              </div>

                              <div>
                                <ImageField
                                  label={`Section #${secIdx + 1} Photography`}
                                  value={sec.image || "/campus_hero.png"}
                                  defaultValue="/campus_hero.png"
                                  recommendedSize="800 × 500 px (3:2 Landscape)"
                                  aspectRatio="wide"
                                  onChange={(img) => {
                                    const updated = [...(currentCampusPage.sections || [])];
                                    updated[secIdx] = { ...updated[secIdx], image: img };
                                    updateSelectedPage({ sections: updated });
                                  }}
                                  onReset={() => {
                                    const updated = [...(currentCampusPage.sections || [])];
                                    updated[secIdx] = { ...updated[secIdx], image: "/campus_hero.png" };
                                    updateSelectedPage({ sections: updated });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-400 text-xs font-medium border border-dashed border-gray-200 rounded-xl">
                        No detailed feature sections on this page. Click "Add Content Section" to create one.
                      </div>
                    )}
                  </div>

                  {/* 6. BOTTOM PHOTO GALLERY CMS */}
                  <div className="bg-white p-6 rounded-2xl border-2 border-[#072A6C]/20 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-gray-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-[#072A6C] uppercase tracking-wider">
                            📸 6. Bottom Photo Gallery ({currentCampusPage.gallery?.length || 0} Photos)
                          </h4>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Synced Live to Website
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Edit, add, replace, and remove photos displayed in the bottom "{currentCampusPage.title.toUpperCase()} GALLERY" grid.
                        </p>
                      </div>

                      <button
                        onClick={saveFullCampusCMS}
                        className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
                      >
                        <Save size={13} /> Save Gallery
                      </button>
                    </div>

                    {/* Add Photo Tools */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
                      <span className="text-xs font-bold text-gray-700 block">Add New Photo to This Page Gallery:</span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={newGalleryInput}
                          onChange={(e) => setNewGalleryInput(e.target.value)}
                          placeholder="Paste image URL (e.g. /gallery_tech_events.png or https://...)"
                          className="flex-1 h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg text-gray-800"
                        />
                        <button
                          onClick={() => {
                            if (!newGalleryInput.trim()) return;
                            const current = currentCampusPage.gallery || [];
                            updateSelectedPage({ gallery: [...current, newGalleryInput.trim()] });
                            setNewGalleryInput("");
                          }}
                          className="h-9 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus size={14} /> Add by URL
                        </button>
                        <label className="h-9 px-4 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                          <UploadCloud size={14} className="text-blue-600" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (ev) => {
                                  if (ev.target?.result) {
                                    const current = currentCampusPage.gallery || [];
                                    updateSelectedPage({ gallery: [...current, ev.target.result as string] });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Quick Presets for University Campus Photos */}
                      <div className="pt-2 border-t border-gray-200/60">
                        <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1.5">
                          Quick Presets (Click to Add):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { label: "+ Annual Fest", url: "/gallery_annual_fest.png" },
                            { label: "+ Sports Meet", url: "/gallery_sports_meet.png" },
                            { label: "+ Tech Events", url: "/gallery_tech_events.png" },
                            { label: "+ NSS Activities", url: "/gallery_nss_activities.png" },
                            { label: "+ Cultural Events", url: "/gallery_cultural_events.png" },
                            { label: "+ Workshops", url: "/gallery_workshops.png" },
                            { label: "+ Campus Hero", url: "/campus_hero.png" },
                            { label: "+ Campus Life BG", url: "/campus_life_bg.png" },
                            { label: "+ Main Building", url: "/Chalapathimain.png" },
                            { label: "+ Placements", url: "/campus_placement.png" }
                          ].map((pre) => (
                            <button
                              key={pre.label}
                              onClick={() => {
                                const current = currentCampusPage.gallery || [];
                                updateSelectedPage({ gallery: [...current, pre.url] });
                              }}
                              className="px-2 py-1 bg-white hover:bg-blue-50 text-blue-800 text-[10px] font-bold rounded border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
                            >
                              {pre.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Photos Visual Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {(currentCampusPage.gallery || []).map((imgUrl, gIdx) => (
                        <div key={gIdx} className="bg-slate-50 p-2.5 rounded-xl border border-gray-200 space-y-2 relative group hover:border-blue-300 transition-all">
                          <div className="relative h-32 rounded-lg overflow-hidden bg-gray-200 border border-gray-100">
                            <img
                              src={imgUrl}
                              alt={`Gallery ${gIdx}`}
                              onError={(e) => { e.currentTarget.src = "/gallery_tech_events.png"; }}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                              #{gIdx + 1}
                            </div>
                            <button
                              onClick={() => {
                                const updated = (currentCampusPage.gallery || []).filter((_, i) => i !== gIdx);
                                updateSelectedPage({ gallery: updated });
                              }}
                              className="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md cursor-pointer transition-colors shadow-sm"
                              title="Delete Photo"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <div className="space-y-1">
                            <input
                              type="text"
                              value={imgUrl}
                              onChange={(e) => {
                                const updated = [...(currentCampusPage.gallery || [])];
                                updated[gIdx] = e.target.value;
                                updateSelectedPage({ gallery: updated });
                              }}
                              className="w-full h-7 px-2 text-[10px] font-mono bg-white border border-gray-200 rounded text-gray-700"
                              placeholder="Image URL"
                            />
                            <div className="flex items-center justify-between text-[10px] text-gray-500">
                              <label className="text-blue-600 hover:underline font-bold cursor-pointer flex items-center gap-1">
                                <UploadCloud size={11} /> Replace File
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (ev) => {
                                        if (ev.target?.result) {
                                          const updated = [...(currentCampusPage.gallery || [])];
                                          updated[gIdx] = ev.target.result as string;
                                          updateSelectedPage({ gallery: updated });
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>

                              <div className="flex items-center gap-1">
                                {gIdx > 0 && (
                                  <button
                                    onClick={() => {
                                      const updated = [...(currentCampusPage.gallery || [])];
                                      const temp = updated[gIdx - 1];
                                      updated[gIdx - 1] = updated[gIdx];
                                      updated[gIdx] = temp;
                                      updateSelectedPage({ gallery: updated });
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded text-gray-600"
                                    title="Move Left"
                                  >
                                    ←
                                  </button>
                                )}
                                {gIdx < (currentCampusPage.gallery || []).length - 1 && (
                                  <button
                                    onClick={() => {
                                      const updated = [...(currentCampusPage.gallery || [])];
                                      const temp = updated[gIdx + 1];
                                      updated[gIdx + 1] = updated[gIdx];
                                      updated[gIdx] = temp;
                                      updateSelectedPage({ gallery: updated });
                                    }}
                                    className="p-1 hover:bg-gray-200 rounded text-gray-600"
                                    title="Move Right"
                                  >
                                    →
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {(currentCampusPage.gallery || []).length === 0 && (
                      <div className="p-8 text-center text-gray-400 text-xs font-medium border border-dashed border-gray-200 rounded-xl">
                        No photos added to this gallery yet. Use the tools above to add photos.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Homepage Campus Tour Subtab */}
              {campusLifeSubTab === "homepage-tour" && (
                <div className="space-y-6">
                  {/* Section Headings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-gray-200 shadow-xs">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Main Heading</label>
                      <input
                        type="text"
                        value={campusTourData.heading || "CAMPUS LIFE"}
                        onChange={(e) => setCampusTourData({ ...campusTourData, heading: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Section Subtitle / Description</label>
                      <input
                        type="text"
                        value={campusTourData.subtitle || ""}
                        onChange={(e) => setCampusTourData({ ...campusTourData, subtitle: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg text-gray-700"
                      />
                    </div>
                  </div>

                  {/* 8 Feature Cards Grid */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                        1. Homepage Campus 8 Highlight Cards
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {campusCardsList.map((card, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-slate-50/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gray-400">Card #{idx + 1}</span>
                            <select
                              value={card.icon || "Users"}
                              onChange={(e) => {
                                const updated = [...campusCardsList];
                                updated[idx] = { ...updated[idx], icon: e.target.value };
                                setCampusCardsList(updated);
                              }}
                              className="h-6 px-1 text-[10px] font-bold bg-white border border-gray-200 rounded cursor-pointer"
                            >
                              <option value="Users">Users Icon</option>
                              <option value="GraduationCap">GraduationCap</option>
                              <option value="Trophy">Trophy</option>
                              <option value="Sparkles">Sparkles</option>
                              <option value="Building2">Building2</option>
                              <option value="Landmark">Landmark</option>
                              <option value="Coffee">Coffee</option>
                              <option value="Bus">Bus</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const updated = [...campusCardsList];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setCampusCardsList(updated);
                            }}
                            className="w-full h-7 px-2 text-xs font-bold bg-white border border-gray-200 rounded"
                          />
                          <textarea
                            rows={2}
                            value={card.desc}
                            onChange={(e) => {
                              const updated = [...campusCardsList];
                              updated[idx] = { ...updated[idx], desc: e.target.value };
                              setCampusCardsList(updated);
                            }}
                            className="w-full p-2 text-[11px] bg-white border border-gray-200 rounded leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Campus Tour Video Player & Media CMS */}
                  <div className="p-6 rounded-2xl border border-blue-200 bg-blue-50/40 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                      <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                        🎬 2. Campus Tour Video Player & Media
                      </h4>
                      <span className="text-[10.5px] font-bold text-[#072A6C] bg-white px-2.5 py-0.5 rounded-md border border-blue-200">
                        Max Recommended Limit: 50.0 MB
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Top Badge Text</label>
                        <input
                          type="text"
                          value={campusTourData.badge || "WATCH CAMPUS TOUR"}
                          onChange={(e) => setCampusTourData({ ...campusTourData, badge: e.target.value })}
                          className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#D4AF37]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Video Quote Text</label>
                        <input
                          type="text"
                          value={campusTourData.quote || ""}
                          onChange={(e) => setCampusTourData({ ...campusTourData, quote: e.target.value })}
                          className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg italic text-gray-700"
                        />
                      </div>
                    </div>

                    {/* VideoField with validation, MB calculation, player preview */}
                    <VideoField
                      label="Main Campus Tour Video"
                      value={campusVideosList[0]?.url || "/chalapathi_logo_intro.mp4"}
                      sizeMb={campusVideosList[0]?.sizeMb || "12.4 MB"}
                      maxSizeMb={50}
                      recommendedLimit="Max 50.0 MB (MP4 / WebM)"
                      poster={campusTourData.poster || "/Chalapathimain.png"}
                      onChange={(url, sizeMb) => {
                        const updated = [...campusVideosList];
                        updated[0] = { ...updated[0], url, sizeMb: sizeMb || updated[0]?.sizeMb };
                        setCampusVideosList(updated);
                      }}
                      onSizeChange={(sizeMb) => {
                        const updated = [...campusVideosList];
                        updated[0] = { ...updated[0], sizeMb };
                        setCampusVideosList(updated);
                      }}
                    />

                    <ImageField
                      label="Video Poster Image (When Video Not Playing)"
                      value={campusTourData.poster || "/Chalapathimain.png"}
                      defaultValue="/Chalapathimain.png"
                      recommendedSize="1280 × 720 px (16:9 Landscape)"
                      aspectRatio="video"
                      onChange={(poster) => setCampusTourData({ ...campusTourData, poster })}
                      onReset={() => setCampusTourData({ ...campusTourData, poster: "/Chalapathimain.png" })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 6: NEWS, EVENTS & ANNOUNCEMENTS                  */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "news-events" && (
            <div className="space-y-6 animate-fade-in text-left">
              <SectionHeader
                title="News, Events & Announcements CMS"
                subtitle="Publish articles, schedule campus events, and manage the drawer announcements"
                icon={Newspaper}
                onSave={() => {
                  updateNews(newsList);
                  updateNewsPageConfig(newsPageForm);
                  updateEvents(eventsList);
                  updateAnnouncements(announcementsList);
                  notifySave("All News, Events & Announcements saved!");
                }}
                saveSuccess={saveSuccess}
                onReset={() => {
                  setNewsList(INITIAL_NEWS);
                  updateNews(INITIAL_NEWS);
                  setNewsPageForm(DEFAULT_NEWS_PAGE_CONFIG);
                  updateNewsPageConfig(DEFAULT_NEWS_PAGE_CONFIG);
                  setEventsList(INITIAL_EVENTS);
                  updateEvents(INITIAL_EVENTS);
                  setAnnouncementsList(INITIAL_ANNOUNCEMENTS);
                  updateAnnouncements(INITIAL_ANNOUNCEMENTS);
                  notifySave("News, events & announcements reset to default!");
                }}
                resetLabel="Reset News & Events"
              />

              {/* Subtabs Selector for News, Events, and Announcements */}
              <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
                {[
                  { id: "pageSettings", label: "🌟 1. News Intro & Homepage (Photos 1 & 2)" },
                  { id: "news", label: `📰 2. News Articles Directory & Details (${newsList.length})` },
                  { id: "events", label: `📅 3. Campus Events & Details (${eventsList.length})` },
                  { id: "announcements", label: `📢 4. Announcements Drawer (${announcementsList.length})` }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setNewsEventsSubTab(st.id as any)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      newsEventsSubTab === st.id
                        ? "bg-[#072A6C] text-white shadow-xs"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SUBTAB 1: NEWS INTRO & HOMEPAGE (PHOTOS 1 & 2)             */}
              {/* ────────────────────────────────────────────────────────── */}
              {newsEventsSubTab === "pageSettings" && (
                <div className="space-y-6">
                  {/* Top Bar */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-500" />
                        1. News Intro & Homepage Hero CMS (Photos 1 & 2)
                      </h3>
                      <p className="text-xs text-gray-500">
                        Customize the top page banner title/subtitle, featured news spotlight card & carousel slider, university highlights sidebar, upcoming events strip, and latest news grid.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setNewsPageForm(DEFAULT_NEWS_PAGE_CONFIG);
                          updateNewsPageConfig(DEFAULT_NEWS_PAGE_CONFIG);
                          notifySave("News page settings reset to default!");
                        }}
                        className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={12} /> Reset Settings
                      </button>
                      <button
                        type="button"
                        onClick={saveNewsPageForm}
                        className="h-8 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save Page Settings
                      </button>
                    </div>
                  </div>

                  {/* 1. Page Header (Top Banner) */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-[#072A6C] text-xs font-black flex items-center justify-center">1</span>
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Top Page Header & Intro (/news)</h4>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Page Main Title</label>
                        <input
                          type="text"
                          value={newsPageForm.headerTitle}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, headerTitle: e.target.value })}
                          placeholder="e.g. News @ City Chalapathi"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Page Subtitle / Tagline</label>
                        <textarea
                          rows={2}
                          value={newsPageForm.headerSubtitle}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, headerSubtitle: e.target.value })}
                          placeholder="e.g. Stay updated with the latest happenings, milestones, and achievements from across the university."
                          className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Featured News Hero Card & Carousel */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center">2</span>
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Featured News Big Hero Card & Slider (Photo 1)</h4>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">Displayed as large spotlight on /news</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Featured Badge Label</label>
                        <input
                          type="text"
                          value={newsPageForm.featuredBadgeText}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, featuredBadgeText: e.target.value })}
                          placeholder="Featured News"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Select Featured Article</label>
                        <select
                          value={newsPageForm.featuredArticleId || newsList[0]?.id || 1}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, featuredArticleId: Number(e.target.value) })}
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-slate-800"
                        >
                          {newsList.map((article) => (
                            <option key={article.id} value={article.id}>
                              {article.title} ({article.category} • {article.date})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Action Button Text</label>
                        <input
                          type="text"
                          value={newsPageForm.readStoryButtonText}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, readStoryButtonText: e.target.value })}
                          placeholder="Read Full Story"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                    </div>

                    {/* Featured Carousel Slides Manager */}
                    <div className="p-4 rounded-xl border border-amber-200/70 bg-amber-50/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-black text-amber-900 uppercase tracking-wide">
                            Featured Hero Carousel Slides ({newsPageForm.featuredCarouselImages?.length || 0})
                          </h5>
                          <p className="text-[11px] text-amber-800/80">These images rotate automatically in the left half of the featured hero card</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setNewsPageForm({
                              ...newsPageForm,
                              featuredCarouselImages: [
                                ...(newsPageForm.featuredCarouselImages || []),
                                "/prog_computer.png"
                              ]
                            });
                          }}
                          className="h-7 px-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Plus size={12} /> Add Slide Image
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {(newsPageForm.featuredCarouselImages || []).map((imgUrl, sIdx) => (
                          <div key={sIdx} className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-gray-400">Slide #{sIdx + 1}</span>
                              {(newsPageForm.featuredCarouselImages || []).length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (newsPageForm.featuredCarouselImages || []).filter((_, i) => i !== sIdx);
                                    setNewsPageForm({ ...newsPageForm, featuredCarouselImages: updated });
                                  }}
                                  className="text-[10px] text-red-500 hover:text-red-700 font-bold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Trash2 size={11} /> Remove
                                </button>
                              )}
                            </div>

                            <ImageField
                              label={`Slide Photo`}
                              value={imgUrl}
                              defaultValue="/prog_computer.png"
                              onReset={() => {
                                const updated = [...(newsPageForm.featuredCarouselImages || [])];
                                updated[sIdx] = "/prog_computer.png";
                                setNewsPageForm({ ...newsPageForm, featuredCarouselImages: updated });
                              }}
                              onChange={(val) => {
                                const updated = [...(newsPageForm.featuredCarouselImages || [])];
                                updated[sIdx] = val;
                                setNewsPageForm({ ...newsPageForm, featuredCarouselImages: updated });
                              }}
                              aspectRatio="video"
                              recommendedSize="800 × 500 px (Landscape 16:9 / 16:10)"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. University Highlights Right Sidebar */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <span className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-black flex items-center justify-center">3</span>
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">University Highlights (Right Sidebar - Photo 1)</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Section Heading</label>
                        <input
                          type="text"
                          value={newsPageForm.highlightsTitle}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, highlightsTitle: e.target.value })}
                          placeholder="University Highlights"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">View All Link Label</label>
                        <input
                          type="text"
                          value={newsPageForm.highlightsViewAllText}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, highlightsViewAllText: e.target.value })}
                          placeholder="View All"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">View All Target URL</label>
                        <input
                          type="text"
                          value={newsPageForm.highlightsViewAllUrl}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, highlightsViewAllUrl: e.target.value })}
                          placeholder="/news/latest"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Upcoming Events Full Width Strip */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">4</span>
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Upcoming Events Full-Width Bar Strip (Photo 2)</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Strip Title</label>
                        <input
                          type="text"
                          value={newsPageForm.eventsStripTitle}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, eventsStripTitle: e.target.value })}
                          placeholder="Upcoming Events"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">View All Button Label</label>
                        <input
                          type="text"
                          value={newsPageForm.eventsStripViewAllText}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, eventsStripViewAllText: e.target.value })}
                          placeholder="View All"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Number of Events Shown (1-6)</label>
                        <input
                          type="number"
                          min={1}
                          max={6}
                          value={newsPageForm.eventsStripCount || 3}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, eventsStripCount: Number(e.target.value) || 3 })}
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Latest News Section */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center">5</span>
                      <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Latest News Grid Section (Photo 2)</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Section Title</label>
                        <input
                          type="text"
                          value={newsPageForm.latestNewsTitle}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, latestNewsTitle: e.target.value })}
                          placeholder="Latest News"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">View All Label</label>
                        <input
                          type="text"
                          value={newsPageForm.latestNewsViewAllText}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, latestNewsViewAllText: e.target.value })}
                          placeholder="View All News"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">View All URL</label>
                        <input
                          type="text"
                          value={newsPageForm.latestNewsViewAllUrl}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, latestNewsViewAllUrl: e.target.value })}
                          placeholder="/news/latest"
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-gray-700"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Cards Shown in Grid</label>
                        <input
                          type="number"
                          min={1}
                          max={12}
                          value={newsPageForm.latestNewsCount || 4}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, latestNewsCount: Number(e.target.value) || 4 })}
                          className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* SUBTAB 2: NEWS ARTICLES DIRECTORY & DETAILS (PHOTOS 3 & 4) */}
              {/* ────────────────────────────────────────────────────────── */}
              {newsEventsSubTab === "news" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
                  {/* Top Header Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">
                        2. News Articles Directory & Detail Articles CMS (Photos 3 & 4)
                      </h3>
                      <p className="text-xs text-gray-500">
                        Manage all news items, directory header, article stories, dates, categories, covers, and multi-slide photo galleries.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setNewsList(INITIAL_NEWS);
                          updateNews(INITIAL_NEWS);
                          notifySave("News reset to defaults!");
                        }}
                        className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={12} /> Reset News
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newArticle: NewsArticle = {
                            id: Date.now(),
                            title: "New Campus Milestone & Achievement",
                            date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
                            time: "10:00 AM",
                            location: "Main University Campus",
                            category: "Achievement",
                            excerpt: "Brief overview of the recent achievement, milestone, or student event.",
                            bodyText: "Full article story text and comprehensive details regarding the event or announcement.",
                            image: "/prog_computer.png",
                            images: ["/prog_computer.png", "/prog_engineering.png"],
                            slug: "news-" + Date.now(),
                            featured: false
                          };
                          const updated = [newArticle, ...newsList];
                          setNewsList(updated);
                          updateNews(updated);
                          notifySave("New article added!");
                        }}
                        className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus size={13} /> Add News Article
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateNews(newsList);
                          updateNewsPageConfig(newsPageForm);
                          notifySave("News articles & directory settings published!");
                        }}
                        className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save All News
                      </button>
                    </div>
                  </div>

                  {/* Directory Page Header Customizer (Photo 3) */}
                  <div className="p-4 rounded-xl border border-blue-200/70 bg-blue-50/40 space-y-3">
                    <div>
                      <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wide">
                        All News Directory Page Header (/news/latest - Photo 3)
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Banner title & subtitle shown when visitors click "View All" or browse the full news list.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Directory Banner Title</label>
                        <input
                          type="text"
                          value={newsPageForm.newsDirectoryTitle || ""}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, newsDirectoryTitle: e.target.value })}
                          placeholder="University Highlights"
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Directory Banner Subtitle</label>
                        <input
                          type="text"
                          value={newsPageForm.newsDirectorySubtitle || ""}
                          onChange={(e) => setNewsPageForm({ ...newsPageForm, newsDirectorySubtitle: e.target.value })}
                          placeholder="Stay updated with the latest achievements, innovations, and stories from Chalapathi University."
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-700 font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* News Articles List */}
                  <div className="space-y-6">
                    {newsList.map((article, idx) => (
                      <div key={article.id} className="p-5 rounded-2xl border border-gray-200 bg-slate-50/50 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#072A6C] text-white text-xs font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-black text-[#072A6C]">{article.title || "Untitled Article"}</span>
                            {article.featured && (
                              <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                                Featured
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
                              className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
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
                              className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
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

                        {/* Title, Category */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Article Title</label>
                            <input
                              type="text"
                              value={article.title}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[idx] = { ...updated[idx], title: e.target.value };
                                setNewsList(updated);
                              }}
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-slate-800"
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
                              placeholder="e.g. Innovation, Achievement, Research"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-semibold text-slate-700"
                            />
                          </div>
                        </div>

                        {/* Date, Time, Location, Slug */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Publication Date</label>
                            <input
                              type="text"
                              value={article.date}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[idx] = { ...updated[idx], date: e.target.value };
                                setNewsList(updated);
                              }}
                              placeholder="e.g. 18 May 2025"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-700"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Event / Release Time</label>
                            <input
                              type="text"
                              value={article.time || ""}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[idx] = { ...updated[idx], time: e.target.value };
                                setNewsList(updated);
                              }}
                              placeholder="e.g. 10:30 AM"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-700"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Location / Venue</label>
                            <input
                              type="text"
                              value={article.location || ""}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[idx] = { ...updated[idx], location: e.target.value };
                                setNewsList(updated);
                              }}
                              placeholder="e.g. Science Block Room 302"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-700"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">URL Slug</label>
                            <input
                              type="text"
                              value={article.slug}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[idx] = { ...updated[idx], slug: e.target.value };
                                setNewsList(updated);
                              }}
                              placeholder="e.g. ai-research-lab"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-mono text-slate-700"
                            />
                          </div>
                        </div>

                        {/* Article Excerpt & Full Body */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Article Excerpt (Short Card Summary - Photo 3)</label>
                            <input
                              type="text"
                              value={article.excerpt || ""}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[idx] = { ...updated[idx], excerpt: e.target.value };
                                setNewsList(updated);
                              }}
                              placeholder="1-2 sentences summarizing the story on cards"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-700 font-medium"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Full Story Text (Detailed Article Page - Photo 4)</label>
                            <textarea
                              rows={4}
                              value={article.bodyText}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[idx] = { ...updated[idx], bodyText: e.target.value };
                                setNewsList(updated);
                              }}
                              placeholder="Full comprehensive article content..."
                              className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-lg leading-relaxed text-slate-800"
                            />
                          </div>
                        </div>

                        {/* Thumbnail Image */}
                        <ImageField
                          label="Article Cover & Primary Thumbnail Photo"
                          value={article.image || INITIAL_NEWS[idx]?.image || "/prog_computer.png"}
                          defaultValue={INITIAL_NEWS[idx]?.image || "/prog_computer.png"}
                          onChange={(val) => {
                            const updated = [...newsList];
                            updated[idx] = { ...updated[idx], image: val };
                            setNewsList(updated);
                          }}
                          onReset={() => {
                            const updated = [...newsList];
                            updated[idx] = { ...updated[idx], image: INITIAL_NEWS[idx]?.image || "/prog_computer.png" };
                            setNewsList(updated);
                          }}
                          aspectRatio="video"
                        />

                        {/* Multi-Image Carousel Slider / Gallery (for News Detail Article Page - Photo 4) */}
                        <div className="p-4 rounded-xl border border-indigo-200/70 bg-indigo-50/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                                Article Multi-Image Gallery Slider (Photo 4) ({article.images?.length || (article.image ? 1 : 0)})
                              </h5>
                              <p className="text-[11px] text-indigo-900/80">
                                Multi-slide carousel shown inside the article page with left/right arrows & dot indicators.
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
                              className="h-7 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-md flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <Plus size={12} /> Add Gallery Slide
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
                                  label="Gallery Slide Photo"
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

                        {/* Options: Featured flag & Source URL */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-200/60">
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
                            <span className="text-xs font-bold text-gray-700">Display in Featured Carousel / Top Highlights</span>
                          </label>

                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-400 font-bold text-[10px] uppercase">External Source:</span>
                            <input
                              type="text"
                              value={article.sourceUrl || ""}
                              onChange={(e) => {
                                const updated = [...newsList];
                                updated[idx] = { ...updated[idx], sourceUrl: e.target.value };
                                setNewsList(updated);
                              }}
                              placeholder="https://..."
                              className="h-7 px-2 text-xs bg-white border border-gray-200 rounded font-mono w-60"
                            />
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* SUBTAB 3: CAMPUS EVENTS CMS (PHOTOS 3 & 4)                 */}
              {/* ────────────────────────────────────────────────────────── */}
              {newsEventsSubTab === "events" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">
                        3. Campus Events & Event Details CMS (Photos 3 & 4)
                      </h3>
                      <p className="text-xs text-gray-500">
                        Add, edit, or schedule seminars, hackathons, conferences, multi-photo sliders, and online registrations.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEventsList(INITIAL_EVENTS);
                          updateEvents(INITIAL_EVENTS);
                          notifySave("Events reset to defaults!");
                        }}
                        className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={12} /> Reset Events
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newEvent: EventItem = {
                            id: Date.now(),
                            slug: "event-" + Date.now(),
                            title: "New Campus Summit 2026",
                            date: "15 Oct 2026",
                            time: "10:00 AM",
                            location: "Main Auditorium Hall",
                            category: "Technology",
                            image: "/prog_engineering.png",
                            images: ["/prog_engineering.png", "/prog_computer.png"],
                            registrationUrl: "/admissions",
                            registrationOpen: true,
                            bodyText: "Comprehensive overview and schedule of the upcoming campus event."
                          };
                          const updated = [newEvent, ...eventsList];
                          setEventsList(updated);
                          updateEvents(updated);
                          notifySave("New event added!");
                        }}
                        className="h-8 px-3.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus size={13} /> Add Campus Event
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          updateEvents(eventsList);
                          notifySave("Events list published!");
                        }}
                        className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Save size={13} /> Save Events
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {eventsList.map((event, idx) => (
                      <div key={event.id} className="p-5 rounded-2xl border border-gray-200 bg-slate-50/50 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#072A6C] text-white text-xs font-black flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-black text-[#072A6C]">{event.title || "Untitled Event"}</span>
                            <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-[#072A6C] px-2 py-0.5 rounded-md">
                              {event.category || "General"}
                            </span>
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
                              className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
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
                              className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-md text-gray-600 disabled:opacity-30 cursor-pointer"
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
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-slate-800"
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
                              placeholder="e.g. Aerospace, Technology, Sports"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-semibold text-slate-700"
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
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-700"
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
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-700"
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
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-700"
                            />
                          </div>
                        </div>

                        {/* Slug, Registration URL & Registration Status */}
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
                            <label className="text-[10px] font-bold text-gray-600 uppercase">Registration Link / Form URL</label>
                            <input
                              type="text"
                              value={event.registrationUrl || ""}
                              onChange={(e) => {
                                const updated = [...eventsList];
                                updated[idx] = { ...updated[idx], registrationUrl: e.target.value };
                                setEventsList(updated);
                              }}
                              placeholder="e.g. https://forms.gle/... or /admissions"
                              className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-mono text-slate-700"
                            />
                          </div>
                          <div className="flex items-end pb-1.5">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
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
                              <span className="text-xs font-bold text-gray-700">Registration Is Open</span>
                            </label>
                          </div>
                        </div>

                        {/* Full Description / Agenda */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-600 uppercase">Event Highlights & Full Agenda (Photo 4)</label>
                          <textarea
                            rows={3}
                            value={event.bodyText}
                            onChange={(e) => {
                              const updated = [...eventsList];
                              updated[idx] = { ...updated[idx], bodyText: e.target.value };
                              setEventsList(updated);
                            }}
                            placeholder="Detailed event description, keynote speakers, and schedule..."
                            className="w-full p-2.5 text-xs bg-white border border-gray-200 rounded-lg leading-relaxed text-slate-800"
                          />
                        </div>

                        {/* Event Poster / Banner */}
                        <ImageField
                          label="Event Primary Poster & Banner Image"
                          value={event.image || INITIAL_EVENTS[idx]?.image || "/prog_engineering.png"}
                          defaultValue={INITIAL_EVENTS[idx]?.image || "/prog_engineering.png"}
                          onChange={(val) => {
                            const updated = [...eventsList];
                            updated[idx] = { ...updated[idx], image: val };
                            setEventsList(updated);
                          }}
                          onReset={() => {
                            const updated = [...eventsList];
                            updated[idx] = { ...updated[idx], image: INITIAL_EVENTS[idx]?.image || "/prog_engineering.png" };
                            setEventsList(updated);
                          }}
                          aspectRatio="video"
                        />

                        {/* Multi-Image Carousel Slider / Gallery (for Event Details Page - Photo 4) */}
                        <div className="p-4 rounded-xl border border-orange-200/70 bg-orange-50/30 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="text-xs font-black text-orange-950 uppercase tracking-wide">
                                Event Multi-Image Gallery Slider (Photo 4) ({event.images?.length || (event.image ? 1 : 0)})
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
                    ))}
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* SUBTAB 3: ANNOUNCEMENTS DRAWER CMS                         */}
              {/* ────────────────────────────────────────────────────────── */}
              {newsEventsSubTab === "announcements" && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-black text-[#072A6C] uppercase">Announcements Drawer Management ({announcementsList.length})</h3>
                      <p className="text-xs text-gray-500">Manage pop-out side drawer notices and critical campus alerts</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAnnouncementsList(INITIAL_ANNOUNCEMENTS);
                          updateAnnouncements(INITIAL_ANNOUNCEMENTS);
                          notifySave("Announcements reset!");
                        }}
                        className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={12} /> Reset
                      </button>
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

            </div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 7: PLACEMENTS & RECRUITERS                      */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "placements" && (
            <PlacementsCMS
              placementsForm={placementsForm}
              setPlacementsForm={setPlacementsForm}
              placementsSubTab={placementsSubTab}
              setPlacementsSubTab={setPlacementsSubTab}
              placementsSectionData={placementsSectionData}
              setPlacementsSectionData={setPlacementsSectionData}
              storiesList={storiesList}
              setStoriesList={setStoriesList}
              activeStoryIdx={activeStoryIdx}
              setActiveStoryIdx={setActiveStoryIdx}
              newSkillText={newSkillText}
              setNewSkillText={setNewSkillText}
              savePlacements={savePlacements}
              saveSuccess={saveSuccess}
              notifySave={notifySave}
              updatePlacementsContent={updatePlacementsContent}
            />
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 8: DIRECTORIES (Faculty & Board CMS)            */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "directories" && (
            <FacultyCMS notifySave={notifySave} />
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 8b: GALLERY & MEDIA CMS                          */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "gallery" && (
            <div className="space-y-6 animate-fade-in text-left">
              <SectionHeader
                title="Gallery, Moments & Media CMS"
                subtitle="Manage Moments that make Memories photo cards (with exact 600x600 px size validator), video galleries, and CTA banners"
                icon={ImageIcon}
                onSave={saveFullCampusCMS}
                saveSuccess={saveSuccess}
                onReset={() => {
                  setCampusGalleryList(DEFAULT_CAMPUS_GALLERY);
                  updateCampusGallery(DEFAULT_CAMPUS_GALLERY);
                  setCampusBannersData(DEFAULT_CAMPUS_BANNERS);
                  updateCampusBanners(DEFAULT_CAMPUS_BANNERS);
                  notifySave("Gallery & media reset to default!");
                }}
                resetLabel="Reset Gallery"
              />

              {/* Moments that Make Memories Section */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-black text-[#072A6C] uppercase">
                      Moments that Make Memories ({campusGalleryList.length} Cards)
                    </h3>
                    <p className="text-xs text-gray-500">Live square gallery carousel displayed on the home page</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newGalleryItem: CampusGalleryItem = {
                        title: "Campus Highlight",
                        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop"
                      };
                      setCampusGalleryList([...campusGalleryList, newGalleryItem]);
                      notifySave("Added gallery card draft!");
                    }}
                    className="h-8 px-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} /> Add Moments Photo Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {campusGalleryList.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-slate-50/70 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#072A6C]">Photo #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = campusGalleryList.filter((_, i) => i !== idx);
                            setCampusGalleryList(updated);
                            notifySave("Gallery photo card removed.");
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Card Caption / Event Title</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...campusGalleryList];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setCampusGalleryList(updated);
                          }}
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded font-bold"
                        />
                      </div>

                      <ImageField
                        label="Photo Image"
                        value={item.image || DEFAULT_CAMPUS_GALLERY[idx]?.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop"}
                        defaultValue={DEFAULT_CAMPUS_GALLERY[idx]?.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop"}
                        recommendedSize="600 × 600 px (Square 1:1)"
                        aspectRatio="square"
                        onChange={(img) => {
                          const updated = [...campusGalleryList];
                          updated[idx] = { ...updated[idx], image: img };
                          setCampusGalleryList(updated);
                        }}
                        onReset={() => {
                          const updated = [...campusGalleryList];
                          updated[idx] = { ...updated[idx], image: DEFAULT_CAMPUS_GALLERY[idx]?.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop" };
                          setCampusGalleryList(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Banners */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-[#072A6C] uppercase pb-2 border-b border-gray-100">
                  Bottom Call-To-Action Banners
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Banner 1: Community */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
                    <span className="text-[11px] font-black text-[#072A6C] uppercase">Left Banner (Blue Gradient)</span>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Banner Title</label>
                      <input
                        type="text"
                        value={campusBannersData.community.title}
                        onChange={(e) => setCampusBannersData({
                          ...campusBannersData,
                          community: { ...campusBannersData.community, title: e.target.value }
                        })}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Description</label>
                      <input
                        type="text"
                        value={campusBannersData.community.desc}
                        onChange={(e) => setCampusBannersData({
                          ...campusBannersData,
                          community: { ...campusBannersData.community, desc: e.target.value }
                        })}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded text-gray-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Button Text</label>
                        <input
                          type="text"
                          value={campusBannersData.community.buttonText}
                          onChange={(e) => setCampusBannersData({
                            ...campusBannersData,
                            community: { ...campusBannersData.community, buttonText: e.target.value }
                          })}
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded font-bold text-[#072A6C]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Button Link</label>
                        <input
                          type="text"
                          value={campusBannersData.community.url}
                          onChange={(e) => setCampusBannersData({
                            ...campusBannersData,
                            community: { ...campusBannersData.community, url: e.target.value }
                          })}
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded font-mono text-gray-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Banner 2: Events */}
                  <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 space-y-3">
                    <span className="text-[11px] font-black text-[#D71920] uppercase">Right Banner (Red Gradient)</span>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Banner Title</label>
                      <input
                        type="text"
                        value={campusBannersData.events.title}
                        onChange={(e) => setCampusBannersData({
                          ...campusBannersData,
                          events: { ...campusBannersData.events, title: e.target.value }
                        })}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Description</label>
                      <input
                        type="text"
                        value={campusBannersData.events.desc}
                        onChange={(e) => setCampusBannersData({
                          ...campusBannersData,
                          events: { ...campusBannersData.events, desc: e.target.value }
                        })}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded text-gray-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Button Text</label>
                        <input
                          type="text"
                          value={campusBannersData.events.buttonText}
                          onChange={(e) => setCampusBannersData({
                            ...campusBannersData,
                            events: { ...campusBannersData.events, buttonText: e.target.value }
                          })}
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded font-bold text-[#D71920]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Button Link</label>
                        <input
                          type="text"
                          value={campusBannersData.events.url}
                          onChange={(e) => setCampusBannersData({
                            ...campusBannersData,
                            events: { ...campusBannersData.events, url: e.target.value }
                          })}
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded font-mono text-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 9: CONTACT US CMS                                */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "contact" && (
            <ContactCMS notifySave={notifySave} />
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 10: FOOTER CMS                                   */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "footer" && (
            <div className="space-y-6 animate-fade-in text-left">
              <SectionHeader
                title="Footer Content & Navigation CMS"
                subtitle="Edit footer brand summary, quick links columns, social media handles, and copyright"
                icon={Layers}
                onSave={saveFooter}
                saveSuccess={saveSuccess}
                onReset={() => {
                  setFooterForm(DEFAULT_FOOTER_CONTENT);
                  updateFooterContent(DEFAULT_FOOTER_CONTENT);
                  notifySave("Footer content reset to default!");
                }}
                resetLabel="Reset Footer"
              />

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Footer Brand Summary Description</label>
                  <textarea
                    rows={3}
                    value={footerForm.brandDescription}
                    onChange={(e) => setFooterForm({ ...footerForm, brandDescription: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Copyright Notice Text</label>
                  <input
                    type="text"
                    value={footerForm.copyrightText}
                    onChange={(e) => setFooterForm({ ...footerForm, copyrightText: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════ */}
          {/* TAB 11: WEBSITE SETTINGS & BRANDING                  */}
          {/* ════════════════════════════════════════════════════ */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in text-left">
              <SectionHeader
                title="Website Settings & Global Branding"
                subtitle="Configure logos, splash screen intro video, global colors, and SEO metadata"
                icon={Settings}
                onSave={saveSettings}
                saveSuccess={saveSuccess}
                onReset={() => {
                  setSettingsForm(DEFAULT_SITE_SETTINGS);
                  updateSiteSettings(DEFAULT_SITE_SETTINGS);
                  setColorsForm(DEFAULT_THEME_COLORS);
                  updateThemeColors(DEFAULT_THEME_COLORS);
                  notifySave("Site settings and theme reset to default!");
                }}
                resetLabel="Reset Settings"
              />

              {/* Logos & Branding */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-[#072A6C] uppercase">University Identity & Logos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">University Name</label>
                    <input
                      type="text"
                      value={settingsForm.universityName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, universityName: e.target.value })}
                      className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 uppercase">Slogan / Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageField
                    label="Primary University Logo"
                    value={settingsForm.logoUrl || "/chalapathi_logo.png"}
                    defaultValue="/chalapathi_logo.png"
                    onChange={(val) => setSettingsForm({ ...settingsForm, logoUrl: val })}
                    onReset={() => setSettingsForm({ ...settingsForm, logoUrl: "/chalapathi_logo.png" })}
                    aspectRatio="square"
                  />
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Splash Screen Video URL</label>
                      <input
                        type="text"
                        value={settingsForm.splashVideoUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, splashVideoUrl: e.target.value })}
                        className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-gray-600"
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={settingsForm.enableSplash}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableSplash: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-xs font-bold text-gray-700">Enable Splash Screen Video on First Load</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Global Theme Colors */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-[#072A6C] uppercase">Global Theme Colors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ColorField
                    label="Primary Navy Color"
                    value={colorsForm.primary}
                    onChange={(val) => setColorsForm({ ...colorsForm, primary: val })}
                  />
                  <ColorField
                    label="Secondary Gold Color"
                    value={colorsForm.secondary}
                    onChange={(val) => setColorsForm({ ...colorsForm, secondary: val })}
                  />
                  <ColorField
                    label="Accent Maroon/Red"
                    value={colorsForm.accent}
                    onChange={(val) => setColorsForm({ ...colorsForm, accent: val })}
                  />
                </div>
              </div>

              {/* SEO Meta */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-[#072A6C] uppercase">Default SEO Metadata</h3>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">SEO Page Title</label>
                  <input
                    type="text"
                    value={settingsForm.seoTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={settingsForm.seoDescription}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoDescription: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
