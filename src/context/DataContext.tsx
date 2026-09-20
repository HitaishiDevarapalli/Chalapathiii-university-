import React, { createContext, useContext, useState, useEffect } from "react";
import { PROGRAMS_DATA, ProgramDetail } from "../data/programsData";
import imgComputerScience from "../assets/illustrations/computer_science.png";
import imgMtechCSE from "../assets/illustrations/mtech_cse.png";
import imgMCA from "../assets/illustrations/mca.png";
import imgPhdCSE from "../assets/illustrations/phd_cse.png";
import imgDataScience from "../assets/illustrations/data_science.png";
import imgArtificialIntelligence from "../assets/illustrations/artificial_intelligence.png";
import imgAIMachineLearning from "../assets/illustrations/aiml.png";
import imgCyberSecurity from "../assets/illustrations/cyber_security.png";
import imgElectronicsCommunication from "../assets/illustrations/electronics.png";
import imgVLSIEmbedded from "../assets/illustrations/vlsi.png";
import imgCivilEngineering from "../assets/illustrations/civil.png";
import imgStructuralEngineering from "../assets/illustrations/structural.png";
import imgMBA from "../assets/illustrations/mba.png";

export { PROGRAMS_DATA };
export type { ProgramDetail };

// Hero Slide interface
export interface HeroSlide {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
}

// Announcements interface
export interface Announcement {
  id?: string;
  title: string;
  desc: string;
  date: string;
  iconName: string;
}

// News interface
export interface NewsArticle {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  excerpt: string;
  bodyText: string;
  image: string;
  images?: string[];
  slug: string;
  sourceUrl?: string;
  featured?: boolean;
}

// News Page Hero & Header Configuration interface
export interface NewsPageConfig {
  headerTitle: string;
  headerSubtitle: string;
  featuredBadgeText: string;
  featuredArticleId?: number;
  featuredCarouselImages: string[];
  readStoryButtonText: string;
  highlightsTitle: string;
  highlightsViewAllText: string;
  highlightsViewAllUrl: string;
  eventsStripTitle: string;
  eventsStripViewAllText: string;
  eventsStripCount: number;
  latestNewsTitle: string;
  latestNewsViewAllText: string;
  latestNewsViewAllUrl: string;
  latestNewsCount: number;
  newsDirectoryTitle?: string;
  newsDirectorySubtitle?: string;
}

// Event interface
export interface EventItem {
  id: number;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  images?: string[];
  bodyText: string;
  registrationUrl?: string;
  registrationOpen?: boolean;
}

export interface SuccessStory {
  id: number;
  studentName: string;
  studentImage: string;
  department: string;
  batch: string;
  companyName: string;
  companyLogo: string;
  packageOffered: string;
  description: string;
  skills: string[];
  internshipExp: string;
  achievement: string;
  milestones: {
    learningTitle: string;
    learningDesc: string;
    internshipTitle: string;
    internshipDesc: string;
    placementTitle: string;
    placementDesc: string;
    careerTitle: string;
    careerDesc: string;
  };
}

export interface CalendarEvent {
  day: number;
  eventText: string;
}

export interface MonthCalendarData {
  name: string;
  yearOffset: number;
  startDay: number;
  totalDays: number;
  events: Record<number, string>;
}

export interface MilestoneItem {
  year: string;
  title: string;
  desc: string;
  img?: string;
  height?: string;
  alt?: string;
}

export interface NepNodeItem {
  label: string;
  stat: string;
  desc: string;
}

export interface AcademicSchoolItem {
  title: string;
  tags: string[];
}

export interface InnovationFacilityItem {
  id: string;
  title: string;
  desc: string;
  img?: string;
}

export interface AboutUsContent {
  history: {
    heroTagline?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    introText: string;
    quoteText: string;
    milestones: MilestoneItem[];
    brighterTomorrow?: {
      tagline?: string;
      heading?: string;
      description?: string;
      pillars?: { title: string; desc?: string }[];
    };
    nep2020?: {
      heading: string;
      subheading: string;
      coreBadge: string;
      nodes: NepNodeItem[];
    };
    academicEvolution?: {
      heading: string;
      subheading: string;
      schools: AcademicSchoolItem[];
    };
    innovationEcosystem?: {
      heading: string;
      steps: string[];
    };
    innovationInfrastructure?: {
      heading: string;
      subheading: string;
      items: InnovationFacilityItem[];
    };
    visionForTomorrow?: {
      heading: string;
      paragraph: string;
    };
  };
  vision: {
    visionText: string;
    missionList: string[];
    valuesList: string[];
  };
  leadership: {
    chairmanName: string;
    designation: string;
    chairmanImage?: string;
    messageQuote: string;
    messageParagraphs: string[];
    philosophies: { title: string; desc: string }[];
  };
  advantage: {
    cards: { title: string; desc: string; detail: string }[];
  };
}

export interface FacultyMember {
  name: string;
  title: string;
  edu: string;
  interests: string;
  phone: string;
  email: string;
  avatar: string;
  age: string;
  experience: string;
  idNo: string;
  department: string;
}

export interface DirectoryData {
  hod: FacultyMember;
  others: FacultyMember[];
}

export interface PlacedStudent {
  name: string;
  branch: string;
  company: string;
  ctc: string;
  img: string;
}

export interface Recruiter {
  name: string;
  logo: string;
}

export interface PlacementStatCard {
  value: string;
  label: string;
  icon?: string;
}

export interface IndustryCaterItem {
  name: string;
  img: string;
}

export interface PlacementsContent {
  badgeText?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage?: string;
  enquireButtonText?: string;
  highestPackage: string;
  averagePackage: string;
  placementPercent: string;
  corporatePartnersCount?: string;
  placementAssistance?: string;
  stats?: PlacementStatCard[];
  philosophyTitle?: string;
  philosophyText: string;
  recentPlacementsBadge?: string;
  recentPlacementsTitle?: string;
  industriesTitle?: string;
  industries?: IndustryCaterItem[];
  careerProgramsTitle?: string;
  careerPrograms: string[];
  industryConnectTitle?: string;
  industryConnectDesc: string;
  industryConnectItems: string[];
  placementCellTitle?: string;
  placementCellDesc: string;
  placementCellItems: { t: string; d: string }[];
  recruitersBadge?: string;
  recruitersTitle?: string;
  placedStudents: PlacedStudent[];
  recruiters: Recruiter[];
}

export interface EnquiryLead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  qualification: string;
  yearOfPassing: string;
  program: string;
  query?: string;
  date: string;
  status?: "New" | "Contacted" | "Admitted" | "Closed";
}

export interface SiteSettings {
  universityName: string;
  tagline: string;
  logoUrl: string;
  logoWhiteUrl: string;
  faviconUrl: string;
  splashVideoUrl: string;
  enableSplash: boolean;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  workingHours: string;
  googleMapEmbedUrl: string;
  socialLinks: {
    instagram: string;
    linkedin: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  pageBackground: string;
  textPrimary: string;
  textSecondary: string;
  headerBg: string;
  headerText: string;
  footerBg: string;
  footerText: string;
  statsBg: string;
  whyChooseBg: string;
  chairmanBg: string;
  campusLifeBg: string;
  certificationsBg: string;
  virtualTourBg: string;
}

export interface HomepageSectionConfig {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  bgColor?: string;
  textColor?: string;
  accentColor?: string;
  extraData?: any;
}

export interface NavMenuItem {
  id: string;
  label: string;
  to: string;
  enabled: boolean;
  order: number;
  children?: { label: string; to: string }[];
}

export interface FooterContent {
  brandDescription: string;
  quickLinks: { label: string; to: string }[];
  academicsLinks: { label: string; to: string }[];
  admissionsLinks: { label: string; to: string }[];
  campusLifeLinks: { label: string; to: string }[];
  copyrightText: string;
}

export interface CourseLinkItem {
  label: string;
  to: string;
  desc?: string;
  image?: string;
}

export type AcademicStructure = Record<string, Record<string, CourseLinkItem[]>>;

export interface CampusVideoItem {
  url: string;
  title: string;
  sizeMb?: string;
}

export interface CampusTourConfig {
  badge: string;
  quote: string;
  poster: string;
  heading?: string;
  subtitle?: string;
}

export interface CampusGalleryItem {
  title: string;
  image: string;
}

export interface CampusBannersConfig {
  community: {
    title: string;
    desc: string;
    buttonText: string;
    url: string;
  };
  events: {
    title: string;
    desc: string;
    buttonText: string;
    url: string;
  };
}

export interface CampusLifeHighlight {
  title: string;
  desc: string;
}

export interface CampusLifeStat {
  label: string;
  value: string;
}

export interface CampusLifeSectionItem {
  title: string;
  desc: string;
  image: string;
  items?: string[];
}

export interface CampusLifePageData {
  title: string;
  desc: string;
  heroImage: string;
  hasVideo?: boolean;
  videoTitle?: string;
  videoDesc?: string;
  videoThumbnail?: string;
  videoUrl?: string;
  stats?: CampusLifeStat[];
  highlights?: CampusLifeHighlight[];
  sections?: CampusLifeSectionItem[];
  gallery: string[];
}

export type CampusLifeContent = Record<string, CampusLifePageData>;

// Admissions CMS Interfaces
export interface AdmissionsStep {
  id: number;
  stepNum: string;
  title: string;
  shortTitle?: string;
  desc: string;
  icon: string;
  badge: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
}

export interface AdmissionsGatewayCard {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  link: string;
  icon: string;
}

export interface AdmissionsPortalConfig {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  stats: { label: string; value: string }[];
  gatewayCards: AdmissionsGatewayCard[];
  stepsHeading: string;
  stepsSubheading: string;
  steps: AdmissionsStep[];
}

export interface AdmissionsFeeItem {
  id: string;
  title: string;
  courses: string[];
  duration: string;
  feePerYear: string;
  examFee: string;
  notes?: string;
}

export interface AdmissionsScholarshipsConfig {
  heroTitle: string;
  heroImage: string;
  cmstTitle: string;
  cmstDescription: string;
  cmstHighlights: string[];
  entranceTitle: string;
  entranceDescription: string;
  entranceExams: string[];
  entranceNote: string;
  governmentTitle: string;
  governmentDescription: string;
  governmentSchemes: { title: string; desc: string }[];
  nspTipText: string;
  rewardsTitle: string;
  rewardsDescription: string;
  academicRewards: { title: string; subtitle: string }[];
  excellenceFooterText: string;
}

export interface EnquiryCourseItem {
  level: string; // "UG" | "PG" | "Ph.D" | "Diploma"
  name: string;
}

export interface EnquiryGroupItem {
  name: string;
  courses: EnquiryCourseItem[];
}

export interface EnquirySchoolItem {
  id: string;
  title: string;
  subtitle: string;
  icon?: string;
  groups: EnquiryGroupItem[];
}

export interface EnquiryPopupConfig {
  enabled: boolean;
  tabLabel: string;
  tabBgColor?: string;
  tabTextColor?: string;
  modalTitle: string;
  modalSubtitle: string;
  formBadgeTitle: string;
  formBadgeDesc: string;
  ctaButtonText: string;
  privacyText: string;
  successTitle: string;
  successDesc: string;
  leftPanelTitle: string;
  leftPanelSubtitle: string;
  schools: EnquirySchoolItem[];
  allPrograms: string[];
}

export interface AdmissionsContent {
  portal: AdmissionsPortalConfig;
  feeStructure: AdmissionsFeeItem[];
  scholarships: AdmissionsScholarshipsConfig;
  enquiryPopup: EnquiryPopupConfig;
}

interface DataContextType {
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: SiteSettings) => void;

  admissionsContent: AdmissionsContent;
  updateAdmissionsContent: (content: AdmissionsContent) => void;

  campusLifeContent: CampusLifeContent;
  updateCampusLifeContent: (content: CampusLifeContent) => void;
  updateCampusLifePage: (path: string, pageData: CampusLifePageData) => void;

  themeColors: ThemeColors;
  updateThemeColors: (colors: ThemeColors) => void;

  homepageSections: HomepageSectionConfig[];
  updateHomepageSections: (sections: HomepageSectionConfig[]) => void;

  navigationMenu: NavMenuItem[];
  updateNavigationMenu: (menu: NavMenuItem[]) => void;

  footerContent: FooterContent;
  updateFooterContent: (content: FooterContent) => void;

  enquiries: EnquiryLead[];
  updateEnquiries: (leads: EnquiryLead[]) => void;
  addEnquiry: (lead: Omit<EnquiryLead, "id" | "date">) => void;

  announcements: Announcement[];
  updateAnnouncements: (list: Announcement[]) => void;

  programs: ProgramDetail[];
  updatePrograms: (list: ProgramDetail[]) => void;

  academicStructure: AcademicStructure;
  updateAcademicStructure: (structure: AcademicStructure) => void;

  news: NewsArticle[];
  updateNews: (list: NewsArticle[]) => void;

  newsPageConfig: NewsPageConfig;
  updateNewsPageConfig: (config: NewsPageConfig) => void;

  events: EventItem[];
  updateEvents: (list: EventItem[]) => void;

  campusVideos: CampusVideoItem[];
  updateCampusVideos: (list: CampusVideoItem[]) => void;

  campusTour: CampusTourConfig;
  updateCampusTour: (tour: CampusTourConfig) => void;

  campusGallery: CampusGalleryItem[];
  updateCampusGallery: (list: CampusGalleryItem[]) => void;

  campusBanners: CampusBannersConfig;
  updateCampusBanners: (banners: CampusBannersConfig) => void;

  aboutContent: AboutUsContent;
  updateAboutContent: (content: AboutUsContent) => void;

  calendarData: MonthCalendarData[];
  updateCalendarData: (data: MonthCalendarData[]) => void;

  facultyData: Record<string, DirectoryData>;
  updateFacultyData: (data: Record<string, DirectoryData>) => void;

  boardData: Record<string, DirectoryData>;
  updateBoardData: (data: Record<string, DirectoryData>) => void;

  staffData: Record<string, DirectoryData>;
  updateStaffData: (data: Record<string, DirectoryData>) => void;

  placementsContent: PlacementsContent;
  updatePlacementsContent: (data: PlacementsContent) => void;

  successStories: SuccessStory[];
  updateSuccessStories: (list: SuccessStory[]) => void;

  heroSlides: HeroSlide[];
  updateHeroSlides: (list: HeroSlide[]) => void;

  showAnnouncementsDrawer: boolean;
  setShowAnnouncementsDrawer: (show: boolean) => void;

  resetToDefaults: () => void;
  lastSavedTime: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ==========================================
// INITIAL DEFAULT DATA (Source of Truth)
// ==========================================

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  universityName: "Chalapathi University",
  tagline: "Inspiring Excellence, Integrity & Innovation",
  logoUrl: "/logo.png?v=3",
  logoWhiteUrl: "/logo.png?v=3",
  faviconUrl: "/favicon.ico",
  splashVideoUrl: "/chalapathi_logo_intro.mp4",
  enableSplash: true,
  contactPhone: "8886630355 | 8886630356 9905505566",
  contactEmail: "admissions@city.ac.in",
  contactAddress: "A.R. Nagar, Mothadaka, Guntur, Andhra Pradesh - 522034",
  workingHours: "Monday - Saturday: 9:00 AM - 5:00 PM",
  googleMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3827.4851241772656!2d80.34758507514275!3d16.399946484330836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a75e3a890b0e5%3A0x6b146476bbd92bc7!2sChalapathi%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  socialLinks: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com"
  },
  seoTitle: "Chalapathi University | Best University in Andhra Pradesh",
  seoDescription: "Chalapathi University offers world-class higher education with premium undergraduate, postgraduate, and research programs. Admissions Open for 2026–2027.",
  seoKeywords: "Chalapathi University, Engineering College Guntur, Best University Andhra Pradesh, B.Tech Admissions"
};

export const DEFAULT_ADMISSIONS_CONTENT: AdmissionsContent = {
  portal: {
    heroBadge: "Academic Session 2026-27 Open",
    heroTitle: "Shape Your Future at Chalapathi University",
    heroSubtitle: "Empowering next-generation innovators with world-class infrastructure, industry-aligned curricula, 100% placement support, and lucrative merit scholarships.",
    stats: [
      { value: "₹25 LPA", label: "Highest Package" },
      { value: "100%", label: "Placement Assistance" },
      { value: "50+", label: "Global Corporate MOUs" },
      { value: "Up to 100%", label: "Merit Waivers" }
    ],
    gatewayCards: [
      {
        id: "apply",
        title: "Start Application 2026",
        subtitle: "Online Admission Form",
        tag: "Step 1",
        link: "/admissions/apply",
        icon: "GraduationCap"
      },
      {
        id: "fees",
        title: "Academic Fee Structure",
        subtitle: "View Stream Fee Breakdown",
        tag: "Fee Charts",
        link: "/admissions/fees",
        icon: "FileText"
      },
      {
        id: "scholarships",
        title: "Scholarships & Financial Aid",
        subtitle: "Apply for Up to 100% Merit Waivers",
        tag: "Waivers",
        link: "/admissions/scholarships",
        icon: "Award"
      }
    ],
    stepsHeading: "Admissions Process 2026",
    stepsSubheading: "Click any step or watch the automated workflow preview below.",
    steps: [
      {
        id: 0,
        stepNum: "01",
        title: "Register Yourself",
        shortTitle: "Account Creation",
        desc: "Create your official student admission portal account in under 2 minutes with basic contact details.",
        icon: "UserPlus",
        badge: "Quick 2 Mins",
        features: ["No Registration Fee", "Instant Portal Access", "Single Sign-On"],
        ctaText: "Start Account Registration",
        ctaLink: "/admissions/apply"
      },
      {
        id: 1,
        stepNum: "02",
        title: "Verify Contact",
        shortTitle: "OTP Verification",
        desc: "Receive instant 6-digit OTP verification on your mobile and email for secure credentials activation.",
        icon: "ShieldCheck",
        badge: "Instant Verification",
        features: ["Mobile & Email OTP", "256-bit SSL Security", "Auto Account Activation"],
        ctaText: "Verify Mobile & Email",
        ctaLink: "/admissions/apply"
      },
      {
        id: 2,
        stepNum: "03",
        title: "Fill Application Form",
        shortTitle: "Program & Marks",
        desc: "Enter academic marks, choose your preferred program stream (CSE, ECE, MBA), and enter personal details.",
        icon: "FileText",
        badge: "Auto-Save Draft",
        features: ["Multi-Stream Selection", "Auto-Save Progress", "Edit Anytime Before Submit"],
        ctaText: "Fill Online Form",
        ctaLink: "/admissions/apply"
      },
      {
        id: 3,
        stepNum: "04",
        title: "Upload Required Documents",
        shortTitle: "Document Vault",
        desc: "Upload scanned copies of 10th/12th marksheets, ID proof, and passport photo into your encrypted vault.",
        icon: "UploadCloud",
        badge: "Secure Vault",
        features: ["Cloud Document Vault", "PDF & JPG Support", "Instant File Validation"],
        ctaText: "Upload Certificates",
        ctaLink: "/admissions/apply"
      },
      {
        id: 4,
        stepNum: "05",
        title: "Submit & Track Status",
        shortTitle: "Payment & Confirmation",
        desc: "Pay nominal application fee online and receive real-time admission tracking ID with SMS notifications.",
        icon: "CreditCard",
        badge: "Instant Confirmation",
        features: ["UPI / NetBanking / Cards", "Instant Tracking ID", "Counselor Callback"],
        ctaText: "Pay & Complete Application",
        ctaLink: "/admissions/apply"
      }
    ]
  },
  feeStructure: [
    {
      id: "01",
      title: "B.Tech. Computer Science & Engineering (All Specializations)",
      courses: [
        "B.Tech. Computer Science & Eng",
        "B.Tech. CSE (AI & Machine Learning)",
        "B.Tech. CSE (Data Science)",
        "B.Tech. CSE (Cyber Security)",
        "B.Tech. CSE (Internet of Things)",
        "B.Tech. CSE (Cloud Computing)",
        "B.Tech. CSE (Blockchain)",
        "B.Tech. CSE (Software Engineering)"
      ],
      duration: "4 Years",
      feePerYear: "₹90,000 / Year",
      examFee: "₹5,000 / Year"
    },
    {
      id: "02",
      title: "B.Tech. Electronics & Communication Engineering (All Specializations)",
      courses: [
        "B.Tech. Electronics & Comm Eng",
        "B.Tech. ECE (VLSI Design)",
        "B.Tech. ECE (Embedded Systems)",
        "B.Tech. ECE (Robotics & Automation)",
        "B.Tech. ECE (IoT Specialization)"
      ],
      duration: "4 Years",
      feePerYear: "₹80,000 / Year",
      examFee: "₹5,000 / Year"
    },
    {
      id: "03",
      title: "B.Tech. Electrical, Mechanical & Automobile Engineering",
      courses: [
        "B.Tech. Electrical & Electronics Eng",
        "B.Tech. EEE (Electric Vehicles)",
        "B.Tech. EEE (Renewable Energy)",
        "B.Tech. EEE (Smart Grid)",
        "B.Tech. Mechanical Engineering",
        "B.Tech. Mechanical (Mechatronics)",
        "B.Tech. Mechanical (Robotics)",
        "B.Tech. Mechanical (Automobile)",
        "B.Tech. Mechanical (Manufacturing)"
      ],
      duration: "4 Years",
      feePerYear: "₹75,000 / Year",
      examFee: "₹5,000 / Year"
    },
    {
      id: "04",
      title: "B.Tech. Civil, Bio & Agricultural Engineering",
      courses: [
        "B.Tech. Civil Engineering",
        "B.Tech. Civil (Smart Infrastructure)",
        "B.Tech. Civil (Construction Tech)",
        "B.Tech. Emerging (AI)",
        "B.Tech. Emerging (Data Science)",
        "B.Tech. Emerging (Robotics)",
        "B.Tech. Biomedical Engineering",
        "B.Tech. Biotechnology",
        "B.Tech. Agricultural Engineering"
      ],
      duration: "4 Years",
      feePerYear: "₹70,000 / Year",
      examFee: "₹5,000 / Year"
    },
    {
      id: "05",
      title: "Postgraduate M.Tech Programs",
      courses: [
        "M.Tech. Computer Science",
        "M.Tech. Power Systems",
        "M.Tech. VLSI & Embedded Systems"
      ],
      duration: "2 Years",
      feePerYear: "₹60,000 / Year",
      examFee: "₹4,000 / Year"
    },
    {
      id: "06",
      title: "Management & Applications (MBA & MCA)",
      courses: [
        "MBA (Master of Business Administration)",
        "MCA (Master of Computer Applications)"
      ],
      duration: "2 Years",
      feePerYear: "₹65,000 / Year",
      examFee: "₹4,000 / Year"
    },
    {
      id: "07",
      title: "Pharmacy Programs (B.Pharm, M.Pharm, D.Pharm)",
      courses: [
        "B.Pharm. (Bachelor of Pharmacy) - 4 Years - ₹85,000 / Year",
        "M.Pharm. (Master of Pharmacy) - 2 Years - ₹95,000 / Year",
        "D.Pharm. (Diploma in Pharmacy) - 2 Years - ₹45,000 / Year"
      ],
      duration: "Varies",
      feePerYear: "See Details",
      examFee: "₹4,000 / Year"
    },
    {
      id: "08",
      title: "Diploma in Engineering (Polytechnic)",
      courses: [
        "Diploma in Engineering (Polytechnic) - Civil, Mech, EEE, ECE, CSE"
      ],
      duration: "3 Years",
      feePerYear: "₹35,000 / Year",
      examFee: "₹3,000 / Year"
    },
    {
      id: "09",
      title: "Transportation / Bus Fee Details",
      courses: [
        "Guntur City Route - ₹18,000 / Year",
        "Vijayawada Route - ₹22,000 / Year",
        "Mothadaka Local Route - ₹12,000 / Year",
        "Other Intermediate Routes - ₹15,000 to ₹20,000 / Year"
      ],
      duration: "Annual",
      feePerYear: "Varies by Route",
      examFee: "N/A"
    }
  ],
  scholarships: {
    heroTitle: "Scholarships & Merits",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop",
    cmstTitle: "Chalapathi Merit Scholarship Test (CMST)",
    cmstDescription: "The Chalapathi Merit Scholarship Test (CMST) offers deserving students an opportunity to receive substantial tuition fee concessions based on their academic excellence and performance.",
    cmstHighlights: [
      "Tuition fee waiver of up to 100% for top-performing students.",
      "Scholarships awarded based on merit and eligibility.",
      "Recognition for exceptional academic talent.",
      "Encouragement for students to pursue excellence throughout their academic journey."
    ],
    entranceTitle: "Entrance Exam Merit Scholarships",
    entranceDescription: "Students with outstanding performance in national and state-level entrance examinations are eligible for merit-based scholarships during admission.",
    entranceExams: [
      "AP EAPCET",
      "JEE Main",
      "NEET (for eligible programs)",
      "Intermediate / Class XII Academic Merit"
    ],
    entranceNote: "* Scholarship benefits are offered based on rank, score, and institutional eligibility criteria.",
    governmentTitle: "Government Scholarship Support",
    governmentDescription: "The institute facilitates eligible students in availing various Government of Andhra Pradesh and Government of India scholarship schemes.",
    governmentSchemes: [
      {
        title: "Post-Matric Scholarships",
        desc: "State and national scholarship programs for reserved and minority categories."
      },
      {
        title: "AICTE Pragati & Saksham",
        desc: "Support programs for female advancement in technology (Pragati) and differently-abled students (Saksham)."
      }
    ],
    nspTipText: "💡 Our dedicated student support team assists eligible candidates throughout the entire application and documentation process on the National Scholarship Portal (NSP) schemes.",
    rewardsTitle: "Rewards for Academic Excellence",
    rewardsDescription: "Academic excellence is celebrated and encouraged through various recognition programs.",
    academicRewards: [
      { title: "Merit Awards", subtitle: "Cash rewards for toppers" },
      { title: "Academic Excellence Certificates", subtitle: "Official university records" },
      { title: "University Rank Recognition", subtitle: "BOS and senate felicitations" },
      { title: "Performance-Based Incentives", subtitle: "Project grants and waivers" }
    ],
    excellenceFooterText: "★ Special Recognition for Outstanding Achievements in a Unique Way! ★"
  },
  enquiryPopup: {
    enabled: true,
    tabLabel: "Admission Enquiry",
    tabBgColor: "#072A6C",
    tabTextColor: "#FFFFFF",
    modalTitle: "ADMISSIONS OPEN 2026-27",
    modalSubtitle: "Build Your Future. Lead with Innovation.",
    formBadgeTitle: "ENQUIRY FORM",
    formBadgeDesc: "Fill in your details. Our admission team will contact you soon.",
    ctaButtonText: "APPLY ENQUIRY",
    privacyText: "Your information is safe with us. We respect your privacy.",
    successTitle: "Enquiry Submitted Successfully!",
    successDesc: "Our admissions helpdesk representative will contact you on your registered mobile number shortly.",
    leftPanelTitle: "EXPLORE OUR SCHOOLS & PROGRAMS",
    leftPanelSubtitle: "Select a school to view its programs",
    schools: [
      {
        id: "computing",
        title: "SCHOOL OF COMPUTING SCIENCES",
        subtitle: "Engineering Minds for the Digital Future",
        icon: "User",
        groups: [
          {
            name: "Computer Science & Engineering",
            courses: [
              { level: "UG", name: "B.Tech - Computer Science and Engineering" },
              { level: "PG", name: "M.Tech - Computer Science and Engineering" },
              { level: "PG", name: "MCA" },
              { level: "Ph.D", name: "Ph.D - Computer Science and Engineering" }
            ]
          },
          {
            name: "Data Science",
            courses: [
              { level: "UG", name: "B.Tech - CSE (Data Science)" }
            ]
          },
          {
            name: "Artificial Intelligence",
            courses: [
              { level: "UG", name: "B.Tech - CSE (Artificial Intelligence)" },
              { level: "UG", name: "B.Tech - Artificial Intelligence & Machine Learning" },
              { level: "PG", name: "M.Tech - CSE (AI & ML)" }
            ]
          },
          {
            name: "Cyber Security",
            courses: [
              { level: "UG", name: "B.Tech - CSE (Cyber Security)" }
            ]
          }
        ]
      },
      {
        id: "engineering",
        title: "SCHOOL OF ENGINEERING",
        subtitle: "Engineering Solutions for a Smarter, Stronger Tomorrow",
        icon: "GraduationCap",
        groups: [
          {
            name: "Electronics and Communication Engineering",
            courses: [
              { level: "UG", name: "B.Tech - Electronics and Communication Engineering" },
              { level: "PG", name: "M.Tech - VLSI and Embedded Systems Design" },
              { level: "Ph.D", name: "Ph.D - Electronics and Communication Engineering" }
            ]
          },
          {
            name: "Civil Engineering",
            courses: [
              { level: "UG", name: "B.Tech - Civil Engineering" },
              { level: "PG", name: "M.Tech - Structural Engineering" },
              { level: "Ph.D", name: "Ph.D - Structural Engineering" }
            ]
          },
          {
            name: "Basic Science & Humanities",
            courses: []
          }
        ]
      },
      {
        id: "business",
        title: "SCHOOL OF BUSINESS & MANAGEMENT",
        subtitle: "Shaping Visionary Leaders for Tomorrow's Business World",
        icon: "Landmark",
        groups: [
          {
            name: "Business and Management",
            courses: [
              { level: "PG", name: "MBA" }
            ]
          }
        ]
      }
    ],
    allPrograms: [
      "B.Tech - Computer Science and Engineering",
      "B.Tech - CSE (Data Science)",
      "B.Tech - CSE (Artificial Intelligence)",
      "B.Tech - Artificial Intelligence & Machine Learning",
      "B.Tech - CSE (Cyber Security)",
      "M.Tech - Computer Science and Engineering",
      "M.Tech - CSE (AI & ML)",
      "MCA",
      "Ph.D - Computer Science and Engineering",
      "B.Tech - Electronics and Communication Engineering",
      "M.Tech - VLSI and Embedded Systems Design",
      "Ph.D - Electronics and Communication Engineering",
      "B.Tech - Civil Engineering",
      "M.Tech - Structural Engineering",
      "Ph.D - Structural Engineering",
      "Applied Mathematics & Computational Sciences",
      "Engineering Physics & Material Sciences",
      "Engineering Chemistry & Environmental Science",
      "English & Professional Communication",
      "MBA"
    ]
  }
};

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: "#072A6C",
  secondary: "#D4AF37",
  accent: "#D71920",
  pageBackground: "#F7F8FC",
  textPrimary: "#222222",
  textSecondary: "#64748B",
  headerBg: "#072A6C",
  headerText: "#FFFFFF",
  footerBg: "#072A6C",
  footerText: "#D1D5DB",
  statsBg: "#072A6C",
  whyChooseBg: "#F8FAFC",
  chairmanBg: "#FFFFFF",
  campusLifeBg: "#FFFFFF",
  certificationsBg: "#F9FAFB",
  virtualTourBg: "#F9FAFB"
};

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionConfig[] = [
  {
    id: "hero",
    name: "Hero Banner Carousel",
    enabled: true,
    order: 1,
    extraData: {
      height: 720,
      autoPlaySpeed: 5000,
      showOverlay: true
    }
  },
  {
    id: "ticker",
    name: "Admissions Alert Marquee",
    enabled: true,
    order: 2,
    title: "🚨 Admissions Open for Academic Year 2026–27 • Applications Closing Soon • Apply Now • Scholarships Available for Meritorious Students • Limited Seats • Register Today • Highest Placement Opportunities • Admissions Open for 2026–27 •",
    bgColor: "#F4B400",
    textColor: "#0A2D6D"
  },
  {
    id: "stats",
    name: "Key Statistics Bar",
    enabled: true,
    order: 3,
    bgColor: "#072A6C",
    textColor: "#FFFFFF",
    accentColor: "#D4AF37",
    extraData: [
      { n: "25+", label: "Years of Excellence", icon: "Trophy" },
      { n: "150+", label: "Programs Offered", icon: "GraduationCap" },
      { n: "50+", label: "Expert Faculty", icon: "Users" },
      { n: "300+", label: "Industry Partners", icon: "Handshake" },
      { n: "20,000+", label: "Successful Alumni", icon: "Landmark" },
      { n: "95%", label: "Placement Success", icon: "Award" }
    ]
  },
  {
    id: "whyChooseUs",
    name: "Why Choose Chalapathi University",
    enabled: true,
    order: 4,
    title: "Why To Choose Chalapathi University?",
    subtitle: "Experience an education that blends academic excellence, innovation, industry collaboration, research, global exposure, and holistic development—preparing students to become future-ready professionals and responsible global leaders.",
    bgColor: "#F8FAFC",
    extraData: [
      {
        title: "Industry integrated curriculum",
        desc: "Curriculum designed with practical learning and industry collaboration to ensure graduates are career-ready.",
        icon: "Trophy",
        color: "#123A7A"
      },
      {
        title: "Expert Faculty & Research",
        desc: "Learn from accomplished faculty members, researchers, and industry experts who inspire innovation.",
        icon: "Users",
        color: "#1F4FA8"
      },
      {
        title: "Smart Campus Infrastructure",
        desc: "Technology-enabled classrooms, modern laboratories, and collaborative learning spaces designed for excellence.",
        icon: "Building2",
        color: "#123A7A"
      },
      {
        title: "Career & Placement Excellence",
        desc: "Industry partnerships, internships, and placement training help students launch successful careers.",
        icon: "Handshake",
        color: "#1F4FA8"
      },
      {
        title: "Global Learning Opportunities",
        desc: "International certifications, collaborative learning, and global industry exposure.",
        icon: "Globe",
        color: "#123A7A"
      },
      {
        title: "Leadership & Holistic Development",
        desc: "Develop leadership, communication, creativity, and life skills through a vibrant campus ecosystem.",
        icon: "Sparkles",
        color: "#1F4FA8"
      }
    ]
  },
  {
    id: "programs",
    name: "Explore Our Schools & Programs",
    enabled: true,
    order: 5,
    title: "Explore Our Schools & Programs",
    subtitle: "Choose from industry-aligned degrees across cutting-edge disciplines",
    bgColor: "#f8f9fa"
  },
  {
    id: "newsEvents",
    name: "News & Events Highlights",
    enabled: true,
    order: 6,
    title: "News & Events",
    subtitle: "Stay Informed. Stay Ahead. Discover the latest updates and exciting events happening at Chalapathi.",
    bgColor: "#FFFFFF"
  },
  {
    id: "campusLife",
    name: "Campus Life & Video Tour",
    enabled: true,
    order: 7,
    title: "CAMPUS LIFE",
    subtitle: "A vibrant campus where students learn, innovate, explore, compete, and create unforgettable memories.",
    bgColor: "#FFFFFF",
    extraData: {
      cards: [
        { title: "Vibrant Community", desc: "A diverse and inclusive campus with students from across India and the world.", icon: "Users" },
        { title: "Clubs & Activities", desc: "50+ student clubs to explore passions and build leadership skills.", icon: "GraduationCap" },
        { title: "Sports & Fitness", desc: "World-class sports facilities to keep you active, healthy and motivated.", icon: "Trophy" },
        { title: "Arts & Culture", desc: "Celebrate creativity with events, fests, and cultural extravaganzas.", icon: "Sparkles" },
        { title: "Smart Learning Spaces", desc: "Modern classrooms, advanced labs, and digital resources for future-ready learning.", icon: "Building2" },
        { title: "Hostel Life", desc: "Safe, comfortable and modern hostels that feel like a second home.", icon: "Landmark" },
        { title: "Food & Cafeteria", desc: "Hygienic, affordable and variety-rich meals for every taste.", icon: "Coffee" },
        { title: "Transport Facility", desc: "Convenient and reliable transportation across city routes.", icon: "Bus" }
      ],
      videos: [
        { url: "/chalapathi_logo_intro.mp4", title: "Campus Overview" },
        { url: "https://assets.mixkit.co/videos/preview/mixkit-drones-eye-view-of-a-modern-university-campus-41555-large.mp4", title: "Smart Classrooms & Labs" },
        { url: "https://assets.mixkit.co/videos/preview/mixkit-group-of-students-walking-on-college-campus-41553-large.mp4", title: "Student Life & Clubs" }
      ],
      gallery: [
        { title: "Annual Fest", image: "/media__1783770842966.png" },
        { title: "Sports Meet", image: "/media__1783771619196.png" },
        { title: "Tech Events", image: "/media__1783772591375.png" },
        { title: "NSS Activities", image: "/media__1783774201695.png" },
        { title: "Cultural Events", image: "/media__1783775062821.png" },
        { title: "Workshops", image: "/media__1783776081975.png" },
        { title: "Student Clubs", image: "/media__1783776395046.png" },
        { title: "Innovation Expo", image: "/media__1783777762350.png" }
      ]
    }
  },
  {
    id: "chairman",
    name: "Chairman's Vision & Message",
    enabled: true,
    order: 8,
    title: "A Vision. A Commitment. A Legacy.",
    subtitle: "Guiding generations through excellence, innovation, integrity, and student success.",
    bgColor: "#FFFFFF",
    extraData: {
      name: "Dr. Y. V Anjaneyulu",
      designation: "Chairman",
      group: "Chalapathi Group of Institutions",
      message: "At Chalapathi University, we believe education is the most powerful transformer of lives and the key to building a better society. Our mission is to empower young minds with knowledge, values, and innovation to help them lead with purpose and create a lasting impact on the world.\n\nWe are committed to providing a nurturing environment, world-class infrastructure, and industry-oriented education to shape future leaders and responsible citizens.",
      videoUrl: "/chalapathi_logo_intro.mp4",
      image: "/chairman_v4.png",
      buttonText: "Watch Chairman's Message"
    }
  },
  {
    id: "placements",
    name: "Placements & Career Milestones",
    enabled: true,
    order: 9,
    title: "A Step Towards Success!",
    subtitle: "Building Careers. Creating Leaders.",
    bgColor: "#F9FAFB"
  },
  {
    id: "virtualTour",
    name: "Admissions Banner & Visit Us",
    enabled: true,
    order: 10,
    title: "ADMISSIONS OPEN 2026",
    subtitle: "Join a community of innovators and leaders. Shape your future with Chalapathi University.",
    bgColor: "#F9FAFB",
    extraData: {
      bannerTitle: "ADMISSIONS OPEN 2026",
      bannerSubtitle: "Join a community of innovators and leaders. Shape your future with Chalapathi University.",
      bannerImage: "/students_admission.png",
      btn1Text: "Apply Now",
      btn1Url: "/admissions/apply",
      btn2Text: "Download Brochure",
      btn2Url: "/admissions",
      btn3Text: "Talk to Counselor",
      btn3Url: "/contact",
      visitHeading: "VISIT US",
      address: "A.R. Nagar, Mothadaka, Guntur, Andhra Pradesh - 522034",
      phone: "8886630355 | 8886630356 9905505566",
      email: "admissions@city.ac.in",
      website: "www.city.ac.in",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.974950454796!2d80.28581691486445!3d16.375218788685984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a79679802cfad%3A0xe67e2a901bbd33fe!2sChalapathi%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!5m2!1sen!2sin",
      mapLinkUrl: "https://www.google.com/maps/place/Chalapathi+Institute+of+Technology/@16.3752188,80.2858169,17z/data=!3m1!4b1!4m6!3m5!1s0x3a4a79679802cfad:0xe67e2a901bbd33fe!8m2!3d16.3752188!4d80.2858169!16s%2Fg%2F122r446z"
    }
  }
];

export const DEFAULT_NAV_MENU: NavMenuItem[] = [
  { id: "home", label: "Home", to: "/", enabled: true, order: 1 },
  { 
    id: "about", 
    label: "About Us", 
    to: "/about", 
    enabled: true, 
    order: 2,
    children: [
      { label: "Overview", to: "/about" },
      { label: "Genesis & Heritage", to: "/about/genesis" },
      { label: "Vision & Mission", to: "/about/vision" },
      { label: "Leadership", to: "/about/leadership" },
      { label: "Chalapathi Advantage", to: "/about/advantage" }
    ]
  },
  { 
    id: "academics", 
    label: "Academics", 
    to: "/academics", 
    enabled: true, 
    order: 3,
    children: [
      { label: "Schools & Programs", to: "/academics" },
      { label: "Academic Calendar", to: "/academics/calendar" },
      { label: "Academic Flexibilities", to: "/academics/flexibilities" },
      { label: "Grading System", to: "/academics/grading" },
      { label: "Rules & Regulations", to: "/academics/rules" }
    ]
  },
  { 
    id: "admissions", 
    label: "Admissions", 
    to: "/admissions", 
    enabled: true, 
    order: 4,
    children: [
      { label: "Undergraduate", to: "/admissions/undergraduate" },
      { label: "Postgraduate", to: "/admissions/postgraduate" },
      { label: "Fee Structure", to: "/admissions/fees" },
      { label: "Scholarships", to: "/admissions/scholarships" },
      { label: "Apply Online", to: "/admissions/apply" }
    ]
  },
  { 
    id: "campus-life", 
    label: "Campus Life", 
    to: "/campus-life", 
    enabled: true, 
    order: 5,
    children: [
      { label: "Hostels", to: "/campus-life/hostels" },
      { label: "Library", to: "/campus-life/library" },
      { label: "Sports", to: "/campus-life/sports" },
      { label: "Clubs", to: "/campus-life/clubs" },
      { label: "Laboratories", to: "/campus-life/laboratories" }
    ]
  },
  { id: "placements", label: "Placements", to: "/placements", enabled: true, order: 6 },
  { id: "news-events", label: "News & Events", to: "/news", enabled: true, order: 7 },
  { id: "contact", label: "Contact Us", to: "/contact", enabled: true, order: 8 }
];

export const DEFAULT_FOOTER_CONTENT: FooterContent = {
  brandDescription: "Empowering minds through quality education, advanced learning and real-world experience. Your future begins here.",
  quickLinks: [
    { label: "About Us", to: "/about" },
    { label: "Vision & Mission", to: "/about/vision" },
    { label: "Leadership", to: "/about/leadership" },
    { label: "Genesis & Heritage", to: "/about/genesis" },
    { label: "Chalapathi Advantage", to: "/about/advantage" },
    { label: "Accreditations", to: "/about" }
  ],
  academicsLinks: [
    { label: "Programs", to: "/academics" },
    { label: "Computer Science", to: "/academics/computer-science" },
    { label: "AI & ML", to: "/academics/artificial-intelligence" },
    { label: "Data Science", to: "/academics/data-science" },
    { label: "Schools", to: "/academics/schools" }
  ],
  admissionsLinks: [
    { label: "Undergraduate", to: "/admissions/undergraduate" },
    { label: "Postgraduate", to: "/admissions/postgraduate" },
    { label: "Fee Structure", to: "/admissions/fees" },
    { label: "Scholarships", to: "/admissions/scholarships" },
    { label: "Apply Online", to: "/admissions/apply" }
  ],
  campusLifeLinks: [
    { label: "Hostels", to: "/campus-life/hostels" },
    { label: "Library", to: "/campus-life/library" },
    { label: "Sports", to: "/campus-life/sports" },
    { label: "Clubs", to: "/campus-life/clubs" },
    { label: "Amenities", to: "/campus-life" }
  ],
  copyrightText: "© 2026 Chalapathi University. All rights reserved."
};

export const getFallbackCourseImage = (label: string): string => {
  const t = (label || "").toLowerCase();
  if (t.includes('m.tech') && t.includes('computer')) return imgMtechCSE;
  if (t.includes('mca') || t.includes('master of computer')) return imgMCA;
  if (t.includes('ph.d') && (t.includes('computer') || t.includes('cse'))) return imgPhdCSE;
  if (t.includes('cse') && t.includes('ai')) return imgArtificialIntelligence;
  if (t.includes('machine learning') || t.includes('aiml')) return imgAIMachineLearning;
  if (t.includes('artificial intelligence') || t.includes('ai')) return imgArtificialIntelligence;
  if (t.includes('data science') || t.includes('data')) return imgDataScience;
  if (t.includes('cyber security') || t.includes('security')) return imgCyberSecurity;
  if (t.includes('electronics') || t.includes('communication') || t.includes('ece')) return imgElectronicsCommunication;
  if (t.includes('vlsi') || t.includes('embedded')) return imgVLSIEmbedded;
  if (t.includes('structural')) return imgStructuralEngineering;
  if (t.includes('civil')) return imgCivilEngineering;
  if (t.includes('mba') || t.includes('business') || t.includes('management')) return imgMBA;
  return imgComputerScience;
};

export const DEFAULT_ACADEMIC_STRUCTURE: AcademicStructure = {
  "School of Computing Sciences": {
    "Computer Science & Engineering": [
      { label: "B.Tech. Computer Science & Engineering", to: "/academics/btech-cse", desc: "Comprehensive engineering curriculum with focus on systems and software.", image: imgComputerScience },
      { label: "M.Tech. Computer Science & Engineering", to: "/academics/mtech-cse", desc: "Advanced systems, algorithms and research focus.", image: imgMtechCSE },
      { label: "MCA", to: "/academics/mca", desc: "Master of Computer Applications industry-oriented program.", image: imgMCA },
      { label: "Ph.D. Computer Science & Engineering", to: "/academics/phd-cse", desc: "Doctoral research in computer science and advanced engineering.", image: imgPhdCSE }
    ],
    "Artificial Intelligence": [
      { label: "B.Tech. CSE (Artificial Intelligence)", to: "/academics/btech-cse-ai-ml", desc: "Specialization in intelligent systems and machine learning algorithms.", image: imgArtificialIntelligence },
      { label: "B.Tech. Artificial Intelligence & Machine Learning", to: "/academics/btech-aiml", desc: "Full-stack AI/ML engineering and neural architectures.", image: imgAIMachineLearning },
      { label: "M.Tech. CSE (AI & ML)", to: "/academics/mtech-aiml", desc: "Postgraduate specialized research in deep learning.", image: imgArtificialIntelligence }
    ],
    "Data Science": [
      { label: "B.Tech. CSE (Data Science)", to: "/academics/btech-cse-data-science", desc: "Big Data processing, statistical analytics and predictive modelling.", image: imgDataScience }
    ],
    "Cyber Security": [
      { label: "B.Tech. CSE (Cyber Security)", to: "/academics/btech-cse-cyber-security", desc: "Information assurance, ethical hacking, and network defense.", image: imgCyberSecurity }
    ]
  },
  "School of Engineering": {
    "Electronics and Communication Engineering": [
      { label: "B.Tech. Electronics and Communication Engineering", to: "/academics/btech-ece", desc: "Hardware systems, signal processing and communication technologies.", image: imgElectronicsCommunication },
      { label: "M.Tech. VLSI and Embedded Systems Design", to: "/academics/mtech-vlsi", desc: "Advanced semiconductor design and microcontroller systems.", image: imgVLSIEmbedded },
      { label: "Ph.D. Electronics and Communication Engineering", to: "/academics/phd-ece", desc: "Doctoral research in microelectronics and communications.", image: imgPhdCSE }
    ],
    "Civil Engineering": [
      { label: "B.Tech. Civil Engineering", to: "/academics/btech-civil", desc: "Infrastructure engineering, sustainable constructions and survey.", image: imgCivilEngineering },
      { label: "M.Tech. Structural Engineering", to: "/academics/mtech-structural", desc: "Structural dynamics, earthquake engineering and materials.", image: imgStructuralEngineering },
      { label: "Ph.D. Structural Engineering", to: "/academics/phd-structural", desc: "Research in advanced structural mechanisms and composites.", image: imgCivilEngineering }
    ],
    "Basic Science & Humanities": []
  },
  "School of Business & Management": {
    "Business and Management": [
      { label: "MBA", to: "/academics/mba", desc: "Master of Business Administration with leadership specializations.", image: imgMBA }
    ]
  }
};

export const DEFAULT_CAMPUS_VIDEOS: CampusVideoItem[] = [
  { url: "/chalapathi_logo_intro.mp4", title: "Campus Overview", sizeMb: "12.4 MB" },
  { url: "https://assets.mixkit.co/videos/preview/mixkit-drones-eye-view-of-a-modern-university-campus-41555-large.mp4", title: "Smart Classrooms & Labs", sizeMb: "24.8 MB" },
  { url: "https://assets.mixkit.co/videos/preview/mixkit-group-of-students-walking-on-college-campus-41553-large.mp4", title: "Student Life & Clubs", sizeMb: "18.2 MB" }
];

export const DEFAULT_CAMPUS_TOUR: CampusTourConfig = {
  badge: "WATCH CAMPUS TOUR",
  quote: "Life at Chalapathi is about learning, growing and celebrating every moment together.",
  poster: "/Chalapathimain.png",
  heading: "CAMPUS LIFE",
  subtitle: "A vibrant campus where students learn, innovate, explore, compete, and create unforgettable memories."
};

export const DEFAULT_CAMPUS_GALLERY: CampusGalleryItem[] = [
  { title: "Annual Fest", image: "/gallery_annual_fest.png" },
  { title: "Sports Meet", image: "/gallery_sports_meet.png" },
  { title: "Tech Events", image: "/gallery_tech_events.png" },
  { title: "NSS Activities", image: "/gallery_nss_activities.png" },
  { title: "Cultural Events", image: "/gallery_cultural_events.png" },
  { title: "Workshops", image: "/gallery_workshops.png" },
  { title: "Student Clubs", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop" },
  { title: "Innovation Expo", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop" }
];

export const DEFAULT_CAMPUS_BANNERS: CampusBannersConfig = {
  community: {
    title: "Be a Part of Our Community",
    desc: "Experience life beyond academics and build a brighter future.",
    buttonText: "Explore Campus Life →",
    url: "/campus-life"
  },
  events: {
    title: "Upcoming Campus Events",
    desc: "There's always something exciting happening.",
    buttonText: "View All Events →",
    url: "/news"
  }
};

export const DEFAULT_CAMPUS_LIFE_CONTENT: CampusLifeContent = {
  "/campus-life": {
    title: "Campus Overview",
    desc: "Experience the vibrant, modern, and green academic ecosystem of Chalapathi University.",
    heroImage: "/campus_hero.png",
    hasVideo: true,
    videoTitle: "EXPERIENCE CHALAPATHI",
    videoDesc: "Take a virtual guided tour of our green campus corridors, advanced pharmacy laboratories, academic buildings, and standard sporting environments that empower ambitious student minds.",
    videoThumbnail: "/campus_life_bg.png",
    videoUrl: "/chalapathi_logo_intro.mp4",
    highlights: [
      { title: "Green Campus", desc: "Eco-friendly infrastructure, solar power grids, and plastic-free zones." },
      { title: "Modern Infrastructure", desc: "State-of-the-art academic wings, research centers, and sports fields." },
      { title: "Digital Learning", desc: "Gigabit fiber internet, smart boards, and virtual computer environments." },
      { title: "Student Experience", desc: "Diverse student-led associations, cultural meets, and development clubs." }
    ],
    gallery: [
      "/gallery_annual_fest.png",
      "/gallery_sports_meet.png",
      "/gallery_tech_events.png",
      "/gallery_nss_activities.png",
      "/gallery_cultural_events.png",
      "/gallery_workshops.png",
      "/campus_hero.png",
      "/campus_placement.png"
    ]
  },
  "/campus-life/library": {
    title: "Central Library",
    desc: "Our Central Library is a sanctuary of knowledge equipped with physical books and digital learning spaces.",
    heroImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80",
    stats: [
      { label: "Physical Books", value: "75,000+" },
      { label: "Journals", value: "350+" },
      { label: "E-Resources", value: "8,500+" },
      { label: "Reading Capacity", value: "1,500+" }
    ],
    sections: [
      { title: "Digital Library & E-Learning", desc: "Access high-speed research databases, IEEE publications, and academic resources through modern terminal workstations.", image: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80" },
      { title: "Discussion & Collaborative Areas", desc: "Dedicated spaces where student groups brainstorm research designs and collaborate on projects.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1495446815901-a7297e63b58d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/smart-classrooms": {
    title: "Smart Classrooms",
    desc: "Our interactive classrooms are designed to maximize engagement and digital content access.",
    heroImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "Interactive Smart Boards", desc: "Multi-touch collaborative screens enabling digital ink, real-time annotations, and cloud content synchronization.", image: "https://images.unsplash.com/photo-1571844307880-751c6d86f3f3?auto=format&fit=crop&w=800&q=80" },
      { title: "Digital Teaching & Webcasting", desc: "Integrated digital cameras and recording nodes to capture lectures and deliver virtual learning feeds.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" },
      { title: "Audio Visual Systems", desc: "Acoustically treated halls containing professional sound networks and high-definition projections.", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80" },
      { title: "Student Collaboration Hubs", desc: "Configurable seating structures allowing teams to interface project modules with personal smart devices.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544535830-9df3f5687760?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/laboratories": {
    title: "Laboratories",
    desc: "Advanced research laboratories for Computer Science, AI, Electronics, and Mechanical Engineering.",
    heroImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "Computer & Software Labs", desc: "Equipped with modern client workstations, enterprise database servers, and industry-standard design tools.", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80" },
      { title: "AI & Deep Learning Labs", desc: "High-compute GPU setups optimized for artificial intelligence frameworks and machine learning training tasks.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" },
      { title: "IoT & Embedded Systems", desc: "Equipped with sensors, development boards, and communication nodes to prototype smart grids.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
      { title: "Mechanical & Civil Labs", desc: "Featuring heavy industrial testing setups, material characterization machinery, and fluid dynamics chambers.", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" },
      { title: "Electronics & VLSI Labs", desc: "Equipped with high-frequency oscilloscopes, signal generators, and software setups for integrated circuit layout designs.", image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/hostels": {
    title: "Hostel Facilities",
    desc: "A secure, cozy, and home-like atmosphere for our boys and girls campus residents.",
    heroImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "Residential Dining", desc: "Hygienic multi-cuisine dining serving fresh meals, catering to diverse dietary choices.", image: "https://images.unsplash.com/photo-1567529854338-fc097b962123?auto=format&fit=crop&w=800&q=80" },
      { title: "Recreation & Lounges", desc: "Common rooms with table tennis, TVs, indoor gym setups, and secure laundry zones.", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1567529854338-fc097b962123?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/sports": {
    title: "Sports & Fitness",
    desc: "Developing physical fitness and team spirit through modern sports infrastructure.",
    heroImage: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "Outdoor Ground Facilities", desc: "A full-sized football pitch, cricket grounds, athletic tracks, and standard basketball fields.", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80" },
      { title: "Indoor Sports Complex", desc: "High-quality badminton courts, table tennis spaces, chess corners, and a fully-equipped gym.", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "/gallery_sports_meet.png",
      "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/cafeteria": {
    title: "Cafeteria & Dining",
    desc: "Our food courts offer diverse dining choices under strict quality and cleanliness guidelines.",
    heroImage: "https://images.unsplash.com/photo-1567529854338-fc097b962123?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "Multi-Cuisine Food Court", desc: "A spacious dining zone offering freshly cooked regional and continental dishes under strict hygiene controls.", image: "https://images.unsplash.com/photo-1567529854338-fc097b962123?auto=format&fit=crop&w=800&q=80" },
      { title: "Healthy Meals & Salads", desc: "Fresh organic salads, juices, and low-calorie options preparing students with active physical energy.", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80" },
      { title: "Coffee & Lounge Corner", desc: "A warm community space to enjoy specialty coffee, tea, and quick snacks with project partners.", image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1567529854338-fc097b962123?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508215885880-4e7d4801a9e0?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/transportation": {
    title: "Transportation",
    desc: "Our GPS-enabled bus network connects the campus to Guntur, Vijayawada, and adjoining communities.",
    heroImage: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "University Bus Fleet", desc: "A large collection of modern buses carrying standard safety measures and comfortable seating arrangements.", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80" },
      { title: "GPS Tracking & Safety", desc: "Real-time satellite GPS updates, Speed controllers, and emergency contact systems inside all transit networks.", image: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80" },
      { title: "Multiple City Routes", desc: "Connecting students across all major points in Guntur, Tenali, Vijayawada, and surrounding towns.", image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1494515426402-f1980ae7a018?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1492664738948-2ec93a547e6d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/wifi": {
    title: "Wi-Fi Campus Network",
    desc: "Gigabit-speed wireless connectivity covering all academic corridors and hostels.",
    heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "High-Speed Fiber Backbone", desc: "Gigabit fiber internet linking computing systems, servers, and visual classrooms seamlessly.", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80" },
      { title: "Wireless Coverage Spots", desc: "High-density access points located across academic corridors, hostels, auditoriums, and open gardens.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/health-centre": {
    title: "Health Centre",
    desc: "Our campus clinic is prepared for student medical consults, first aid, and basic healthcare support.",
    heroImage: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "24/7 First Aid & Ambulance", desc: "A qualified healthcare team and dedicated emergency transport ready on standby.", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1584515901367-f134706efc3c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/clubs": {
    title: "Student Clubs & Societies",
    desc: "Coding challenges, musical events, creative art, and technical clubs to build student leadership.",
    heroImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "Coding, Music & Performing Arts", desc: "Student-run activities spanning technical hackathons, coding tasks, classical music nights, and traditional plays.", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "/gallery_cultural_events.png",
      "/gallery_annual_fest.png",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522158673370-3c1466178877?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/events": {
    title: "Events & Festivals",
    desc: "Highlights from our annual technological symposiums, sporting events, and cultural meets.",
    heroImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "/gallery_annual_fest.png",
      "/gallery_cultural_events.png",
      "/gallery_tech_events.png",
      "/gallery_sports_meet.png",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/innovation-hub": {
    title: "Innovation Hub & Incubation",
    desc: "Nurturing student startups and technological solutions with workspaces and seed funding.",
    heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "/gallery_tech_events.png",
      "/gallery_workshops.png",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-152202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/safety": {
    title: "Campus Safety & Security",
    desc: "Ensuring student safety with 24/7 CCTV surveillance, gate controls, and safety protocols.",
    heroImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "Continuous Patrol & Cameras", desc: "Our campus is mapped with CCTV cameras and has emergency rapid assistance setups.", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1508847154043-be12aee6f22d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/nss-ncc": {
    title: "NSS & NCC Wings",
    desc: "Cultivating discipline, community service, and volunteer leadership among our students.",
    heroImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
    gallery: [
      "/gallery_nss_activities.png",
      "/gallery_annual_fest.png",
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1464979681340-1261d70b083c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80"
    ]
  },
  "/campus-life/grievance-cell": {
    title: "Student Grievance Cell",
    desc: "Dedicated mechanism for responding to queries, academic appeals, and support requests.",
    heroImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1600&q=80",
    sections: [
      { title: "Transparent Grievance Resolution", desc: "Submit and follow academic, facility, or administrative queries directly through online and offline modules.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
    ]
  }
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  { title: "Admissions 2026 Applications Open", desc: "Apply online for all undergraduate and postgraduate engineering, management, and pharmacy streams.", date: "12 May 2026", iconName: "GraduationCap" },
  { title: "Orientation Program 2026 Schedule", desc: "Schedule and venue details released for the incoming freshers orientation week starting next month.", date: "08 May 2026", iconName: "Calendar" },
  { title: "Semester Examination Notification", desc: "The final semester examination timetable has been officially released by the controller of examinations.", date: "02 May 2026", iconName: "FileText" },
  { title: "Merit-Based Scholarship Applications", desc: "Tuition waiver applications open for academic top performers and sports quota achievements.", date: "28 Apr 2026", iconName: "Award" },
  { title: "Mega Campus Placement Drive 2026", desc: "Registrations now open for eligible pre-final year candidates for upcoming on-campus MNC recruitment drives.", date: "22 Apr 2026", iconName: "BookOpen" }
];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
  { id: 1, image: "/Chalapathimain.png", title: "", subtitle: "" }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 1,
    title: "Engineering Students Win Smart Hackathon 2025",
    date: "17 May 2025",
    time: "09:00 AM",
    location: "Tech Exhibition Hub, New Delhi",
    category: "ACHIEVEMENT",
    excerpt: "Our team developed a decentralized IoT mesh network algorithm to win first prize.",
    bodyText: "Our student research team from our Electronics and Computer Science Engineering departments has won the prestigious National Smart Systems Hackathon 2025. Over a grueling 36-hour continuous sprint in New Delhi, the team designed and prototyped a self-healing, decentralized IoT mesh network framework tailored for real-time disaster management communication.",
    image: "/prog_engineering.png",
    images: ["/prog_engineering.png", "/prog_computer.png"],
    slug: "smart-hackathon",
    sourceUrl: "https://timesofindia.indiatimes.com/education/engineering-students-win-national-smart-hackathon-2025/articleshow/1089271.cms",
    featured: true
  },
  {
    id: 2,
    title: "Annual Convocation 2025 Held with Grandeur",
    date: "12 May 2025",
    time: "10:00 AM",
    location: "Main Auditorium Hall",
    category: "Campus Life",
    excerpt: "Graduating students received degrees and medals at the colorful convocation ceremony.",
    bodyText: "The 2025 annual convocation ceremony was celebrated with grand success. Distinguished chief guests from corporate and academic bodies addressed the graduating cohort and distributed gold medals to academic toppers.",
    image: "/prog_pharmacy.png",
    images: ["/prog_pharmacy.png", "/prog_management.png"],
    slug: "annual-convocation",
    sourceUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "Record Placements in 2025 Batch",
    date: "14 May 2025",
    time: "10:00 AM",
    location: "Placements Office",
    category: "Placements",
    excerpt: "Top recruiters from across the globe visited campus. Students secured roles in leading MNCs.",
    bodyText: "Chalapathi University registers outstanding placement results for the 2025 batch. Leading multinationals including tech and core giants participated, offering premium software engineering and core research positions to over 90% of eligible graduates.",
    image: "/prog_management.png",
    images: ["/prog_management.png", "/prog_engineering.png"],
    slug: "record-placements",
    sourceUrl: "https://www.abnandhrajyothy.com/chalapathi-university-record-placements-2025/article/1109"
  },
  {
    id: 4,
    title: "New Study on Renewable Energy Published in Scopus Journal",
    date: "15 May 2025",
    time: "11:00 AM",
    location: "Academic Block 1 Seminar Room",
    category: "Research",
    excerpt: "The research highlights the efficiency of hybrid models in optimizing sustainable energy.",
    bodyText: "A breakthrough research paper on renewable energy harvesting techniques has been published in a top-tier Scopus-indexed journal. The study highlights the implementation of hybrid solar-wind energy conservation models in microgrids.",
    image: "/prog_mtech.png",
    images: ["/prog_mtech.png", "/prog_computer.png"],
    slug: "renewable-energy",
    sourceUrl: "https://www.sakshi.com/renewable-energy-research-study-published-scopus/article/20250515"
  },
  {
    id: 5,
    title: "International Yoga Day Celebrated with Enthusiasm",
    date: "16 May 2025",
    time: "07:00 AM",
    location: "Central Playground Complex",
    category: "Campus Life",
    excerpt: "Students and faculty participated in a special yoga session promoting health and wellness.",
    bodyText: "Students and faculty participated in a special yoga session promoting health, wellness, and mental clarity on International Yoga Day. The event was held in the main campus courtyard with over 500 participants practicing various asanas guided by certified yoga instructors.",
    image: "/prog_diploma.png",
    images: ["/prog_diploma.png", "/prog_pharmacy.png"],
    slug: "yoga-day",
    sourceUrl: "https://www.eenadu.net/yoga-day-celebrations-chalapathi-campus/article/120250516"
  },
  {
    id: 6,
    title: "AI Research Lab Inaugurated on Campus",
    date: "18 May 2025",
    time: "10:30 AM",
    location: "Main Science Block, Room 302",
    category: "Innovation",
    excerpt: "In partnership with global tech giants, the new laboratory features advanced machine learning compute nodes for research projects.",
    bodyText: "Today marks a historic milestone for Chalapathi University as we formally inaugurate our state-of-the-art Artificial Intelligence and Machine Learning Research Laboratory. Developed in close collaboration with global technology leaders, this research center is equipped with high-throughput multi-GPU processing systems and next-generation compute environments designed specifically for heavy workload deep learning and neural network model training. Under the direction of our senior AI research staff, undergraduate and doctoral scholars will collaborate on active research papers, smart industrial solutions, and healthcare diagnostics automation projects.",
    image: "/prog_computer.png",
    images: ["/prog_computer.png", "/prog_engineering.png"],
    slug: "ai-research-lab",
    sourceUrl: "https://www.thehindu.com/sci-tech/technology/internet/artificial-intelligence-research-lab-inaugurated/article671829.ece",
    featured: true
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  { 
    id: 1, 
    slug: "national-sports-meet-2026", 
    title: "National Sports Meet & Athletic Championship", 
    date: "12 Nov 2026", 
    time: "07:00 AM", 
    location: "University Sports Arena & Athletic Track", 
    category: "Sports", 
    image: "/prog_diploma.png", 
    bodyText: "Over 50 universities face off in the annual athletic championship, featuring track events, field sports, inter-college football, cricket leagues, and indoor badminton tournaments with cash prizes." 
  },
  { 
    id: 2, 
    slug: "placements-bootcamp-2026", 
    title: "Annual Placements Boot Camp and Corporate Summit", 
    date: "08 Oct 2026", 
    time: "08:30 AM", 
    location: "Placement Training Center", 
    category: "Placements", 
    image: "/prog_management.png", 
    bodyText: "A comprehensive recruitment readiness workshop featuring mock HR interviews, quantitative aptitude sessions, group discussion prep, and interactive roundtables with hiring heads of Fortune 500 tech partners." 
  },
  { 
    id: 3, 
    slug: "green-chemistry-conference-2026", 
    title: "International Conference on Green Chemistry & Sustainable Biotech", 
    date: "15 Sep 2026", 
    time: "10:00 AM", 
    location: "Saraswathi Auditorium, Block B", 
    category: "Pharmacy", 
    image: "/prog_pharmacy.png", 
    bodyText: "A three-day symposium featuring keynote addresses from global scientists, researchers, and pharmaceutical experts discussing eco-friendly chemical synthesis, biological assay creations, and sustainable manufacturing processes." 
  },
  { 
    id: 4, 
    slug: "smart-india-hackathon-2026", 
    title: "Smart India Hackathon 2026 Campus Edition", 
    date: "24 Aug 2026", 
    time: "09:00 AM", 
    location: "Main Seminar Hall & Central Library Labs", 
    category: "Technology", 
    image: "/prog_computer.png", 
    bodyText: "Join the national-level coding hackathon where students build solutions for real-world government and corporate challenges. The campus round decides the top teams representing the university in the grand finale." 
  },
  { 
    id: 5, 
    slug: "air-taxi-demonstration-aviation-forum", 
    title: "Air Taxi Demonstration & Aviation Forum", 
    date: "17 Jul 2026", 
    time: "09:30 AM", 
    location: "Aeronautics Hangar & Airfield Complex", 
    category: "Aerospace", 
    image: "/prog_engineering.png", 
    bodyText: "In collaboration with global aerospace research institutions and pioneering aviation companies, Chalapathi University is proud to host the Air Taxi Demonstration and Aviation Forum. This event features real-world test flights and static exhibitions of cutting-edge electric Vertical Take-Off and Landing (eVTOL) air taxi models." 
  }
];

export const DEFAULT_NEWS_PAGE_CONFIG: NewsPageConfig = {
  headerTitle: "News @ City Chalapathi",
  headerSubtitle: "Stay updated with the latest happenings, milestones, and achievements from across the university.",
  featuredBadgeText: "Featured News",
  featuredArticleId: 1,
  featuredCarouselImages: [
    "/prog_computer.png",
    "/prog_engineering.png",
    "/prog_management.png",
    "/prog_pharmacy.png"
  ],
  readStoryButtonText: "Read Full Story",
  highlightsTitle: "University Highlights",
  highlightsViewAllText: "View All",
  highlightsViewAllUrl: "/news/latest",
  eventsStripTitle: "Upcoming Events",
  eventsStripViewAllText: "View All",
  eventsStripCount: 3,
  latestNewsTitle: "Latest News",
  latestNewsViewAllText: "View All News",
  latestNewsViewAllUrl: "/news/latest",
  latestNewsCount: 4,
  newsDirectoryTitle: "University Highlights",
  newsDirectorySubtitle: "Stay updated with the latest achievements, innovations, and stories from Chalapathi University."
};

export const INITIAL_ABOUT_CONTENT: AboutUsContent = {
  history: {
    heroTagline: "OUR GENESIS",
    heroTitle: "A Journey of Vision, Values & Transformation",
    heroSubtitle: "From a vision rooted in knowledge to a future-ready multidisciplinary university driven by innovation, research, and global excellence.",
    introText: "A LEGACY OF EXCELLENCE — 30+ YEARS IN EDUCATION\n\nA Strong Society, A Stronger Vision for the Future\nChalapathi University is backed by a highly reputed and visionary educational society, with over three decades of excellence in education, research, and innovation. This deep-rooted legacy reflects a long-term commitment to academic quality, institutional growth, and societal impact.\n\nToday, the society proudly runs six professional and educational institutions, shaping thousands of careers across diverse fields of study. This strong foundation empowers Chalapathi University with stability, credibility, and a forward-looking vision, enabling it to continuously innovate and evolve in line with global educational trends and industry demands.\n\nDriven by decades of experience and an unwavering commitment to excellence, the society stands as a pillar of trust, growth, and opportunity — nurturing generations of students to become confident, capable, and future-ready professionals.\n\nABOUT US\nAt Chalapathi University, we don't just teach — we transform potential into performance. We are building more than degrees; we are building industry-ready innovators, problem-solvers, and leaders of tomorrow. Through cutting-edge infrastructure, mentorship from accomplished faculty, and curricula co-designed with industry demands, every student is equipped not just to enter the workforce — but to lead it.\n\nOur student-first philosophy blends knowledge with real-world application, research with relevance, and creativity with career readiness — through hands-on projects, live industry collaborations, skill labs, and innovation hubs that ensure learning goes beyond the classroom and into impact.",
    quoteText: "To provide value-based quality technical education and produce competent engineers who can contribute to the progress of the society.",
    milestones: [
      { 
        year: "1995", 
        title: "The Beginning", 
        desc: "Chalapathi Educational Society (CES) established with a mission to serve society through quality education.",
        img: "genesis/1995.jpg", 
        height: "30%",
        alt: "Seed of education"
      },
      { 
        year: "1995–2005", 
        title: "Building the Foundation", 
        desc: "Laid the groundwork with schools and junior & degree colleges, nurturing young minds.",
        img: "genesis/2005.jpg", 
        height: "45%",
        alt: "Traditional academic institution"
      },
      { 
        year: "2005–2015", 
        title: "Expanding Horizons", 
        desc: "Ventured into professional and technical education, creating opportunities for future-ready careers.",
        img: "genesis/2015.jpg", 
        height: "60%",
        alt: "Modern engineering campus"
      },
      { 
        year: "2015–2025", 
        title: "Strengthening Excellence", 
        desc: "Chalapathi Institute of Technology at Mothadaka grew into a center for quality technical education and innovation.",
        img: "genesis/2025.jpg", 
        height: "75%",
        alt: "Premium research campus"
      },
      { 
        year: "2026", 
        title: "A New Chapter", 
        desc: "Chalapathi University — a multidisciplinary, research-driven, future-ready institution shaping global leaders.",
        img: "genesis/2026.jpg", 
        height: "90%",
        alt: "Iconic future-ready Chalapathi University"
      }
    ],
    brighterTomorrow: {
      tagline: "Towards a",
      heading: "Brighter Tomorrow",
      description: "Guided by its founding values and inspired by innovation, Chalapathi University continues to evolve into a multidisciplinary institution dedicated to academic excellence, research, entrepreneurship, and global impact.",
      pillars: [
        { title: "Knowledge" },
        { title: "Innovation" },
        { title: "Global Opportunities" },
        { title: "Service to Society" }
      ]
    },
    nep2020: {
      heading: "A University Inspired by NEP 2020",
      subheading: "Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.",
      coreBadge: "NEP 2020",
      nodes: [
        { label: "Holistic Learning", stat: "360°", desc: "Comprehensive physical & emotional growth." },
        { label: "Research", stat: "Tier-1", desc: "Advanced labs & dedicated funding programs." },
        { label: "Innovation", stat: "100+", desc: "Patents filed and ideation centers active." },
        { label: "Skill Development", stat: "95%", desc: "Industry-ready practical curriculum." },
        { label: "Entrepreneurship", stat: "50+", desc: "Startups incubated on campus annually." },
        { label: "Multidisciplinary", stat: "12", desc: "Interconnected disciplines of study." }
      ]
    },
    academicEvolution: {
      heading: "Academic Evolution",
      subheading: "Three schools designed for the future of industry and research.",
      schools: [
        { title: "School of Computing Sciences", tags: ["Computer Science & Engineering", "Artificial Intelligence", "Data Science", "Cyber Security"] },
        { title: "School of Engineering", tags: ["Electronics and Communication Engineering", "Civil Engineering", "Basic Science & Humanities"] },
        { title: "School of Business & Management", tags: ["Business and Management"] }
      ]
    },
    innovationEcosystem: {
      heading: "Innovation Ecosystem",
      steps: ["Student", "Idea", "Innovation Lab", "Prototype", "Research", "Incubation", "Startup", "Industry", "Global Impact"]
    },
    innovationInfrastructure: {
      heading: "Innovation Infrastructure",
      subheading: "State-of-the-art facilities designed to transition students from passive recipients into active innovators.",
      items: [
        { id: "center", title: "Innovation Centre", desc: "Seed-stage mentoring, prototyping support, and startup incubation.", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" },
        { id: "excellence", title: "Centres of Excellence", desc: "AI/ML, IoT & Robotics" },
        { id: "maker", title: "Maker Space", desc: "Hands-on fabrication" },
        { id: "ecell", title: "E-Cell & Industry Interface", desc: "Structured venture-creation training and continuous industry alignment." }
      ]
    },
    visionForTomorrow: {
      heading: "Our Vision for Tomorrow",
      paragraph: "Chalapathi University is envisioned as a multidisciplinary institution where innovation meets purpose, research fuels progress, and every learner is empowered to become a leader capable of creating meaningful impact across the world."
    }
  },
  vision: {
    visionText: "To become a globally respected university that empowers students through excellence in education, innovation, research, and ethical leadership.",
    missionList: [
      "To provide high-quality, industry-relevant education.",
      "To foster innovation, critical thinking, and research culture.",
      "To promote holistic student development and leadership.",
      "To build strong academic and industry collaborations.",
      "To contribute positively to society through knowledge and service."
    ],
    valuesList: [
      "Set academic benchmarks in global learning frameworks.",
      "Fulfill corporate milestones through student placement readiness.",
      "Inspire creative engineering prototypes and patent acquisitions.",
      "Ensure environment sustainability and social upliftment programs."
    ]
  },
  leadership: {
    chairmanName: "Dr. Y. V Anjaneyulu",
    designation: "Founder Chairman & President",
    chairmanImage: "/chairman_v4.png",
    messageQuote: "Inspiring Excellence, Integrity & Innovation",
    messageParagraphs: [
      "Welcome to Chalapathi University, an institution built upon the pillars of academic rigour, social responsibility, and future-centric innovation. From our modest beginnings, we have constantly pushed the boundaries of knowledge, seeking to create an educational ecosystem that nurtures tomorrow's global leaders.",
      "We believe that education must go beyond conventional memorization. Our classrooms, research centers, and digital modules are designed to cultivate critical thinking, design awareness, and technological skills. By prioritizing ethical values, domain specialization, and hands-on exposure, we empower our graduates to lead with integrity in an ever-evolving world.",
      "I invite you to explore our advanced research pathways, engage in collaborative innovation drives, and join us in our continuous pursuit of excellence. Together, let us shape a bright tomorrow."
    ],
    philosophies: [
      { title: "Vision", desc: "Setting benchmarks in global learning systems and digital technology transfers." },
      { title: "Leadership", desc: "Empowering student cohorts to lead academic, corporate, and civil domains." },
      { title: "Innovation", desc: "Fostering active laboratory research, patent designs, and startup projects." },
      { title: "Excellence", desc: "Upholding high standards of quality assurance, accreditations, and placements." }
    ]
  },
  advantage: {
    cards: [
      { title: "Autonomous Curriculum", desc: "Tailored syllabus modules synced directly with current IT and core sector requirements.", detail: "Allows for rapid curriculum updating, ensuring learners study the newest engineering standards." },
      { title: "Industry Immersion", desc: "Mandatory corporate internships, case study reviews, and MNC leadership seminars.", detail: "Direct connection with industry majors to build practical skills before graduation." },
      { title: "Smart Infrastructure", desc: "State-of-the-art laboratories, digital classrooms, and extensive library resources.", detail: "A modern campus designed to foster innovation, collaborative learning, and holistic student development." },
      { title: "Placement Track", desc: "Consistency in recruiting achievements with top MNC software and hardware firms.", detail: "Comprehensive guidance program from pre-final year until successful placement onboarding." }
    ]
  }
};

export const INITIAL_CALENDAR_DATA: MonthCalendarData[] = [
  { name: "July", yearOffset: 0, startDay: 2, totalDays: 31, events: { 15: "Commencement of Classwork" } },
  { name: "August", yearOffset: 0, startDay: 5, totalDays: 31, events: {} },
  { name: "September", yearOffset: 0, startDay: 1, totalDays: 30, events: { 5: "First Mid-Term Examinations" } },
  { name: "October", yearOffset: 0, startDay: 3, totalDays: 31, events: {} },
  { name: "November", yearOffset: 0, startDay: 6, totalDays: 30, events: { 14: "Second Mid-Term Examinations" } },
  { name: "December", yearOffset: 0, startDay: 1, totalDays: 31, events: { 3: "Practical Examinations", 15: "End Semester Theory Exams" } },
  { name: "January", yearOffset: 1, startDay: 4, totalDays: 31, events: { 5: "Commencement of Next Semester" } }
];

export const DEFAULT_INDUSTRIES: IndustryCaterItem[] = [
  { name: "SOFTWARE DEVELOPMENT", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&fit=crop" },
  { name: "CORE ENGINEERING", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&fit=crop" },
  { name: "AI & DATA SCIENCE", img: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=500&fit=crop" },
  { name: "CYBER SECURITY", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500&fit=crop" },
  { name: "EMBEDDED SYSTEMS", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&fit=crop" },
  { name: "MECHANICAL & CIVIL", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&fit=crop" },
  { name: "BUSINESS & MANAGEMENT", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&fit=crop" },
  { name: "RESEARCH & HIGHER ED", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&fit=crop" },
  { name: "STARTUPS & VENTURES", img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&fit=crop" }
];

export const INITIAL_PLACEMENTS_CONTENT: PlacementsContent = {
  badgeText: "Placements & Career Development",
  heroTitle: "A Step Towards Success!",
  heroSubtitle: "Building Careers. Creating Leaders.",
  heroDescription: "At Chalapathi University, placements are more than securing a job—they are about preparing students for lifelong professional success. Our dedicated Training & Placement Cell bridges the gap between academic learning and industry expectations by equipping students with the knowledge, skills, and confidence to excel in today's competitive global workforce.",
  heroImage: "/campus_placement.png",
  enquireButtonText: "Enquire Now",
  highestPackage: "30 LPA",
  averagePackage: "₹5.5 LPA",
  placementPercent: "92%",
  corporatePartnersCount: "116+",
  placementAssistance: "100%",
  stats: [
    { value: "30 LPA", label: "Highest Package", icon: "Trophy" },
    { value: "₹5.5 LPA", label: "Average Package", icon: "TrendingUp" },
    { value: "92%", label: "Placement Record", icon: "CheckCircle2" },
    { value: "116+", label: "Corporate Partners", icon: "Handshake" },
    { value: "100%", label: "Placement Assistance", icon: "GraduationCap" }
  ],
  philosophyTitle: "Our Placement Philosophy",
  philosophyText: "We focus on developing industry-ready professionals through a holistic approach that combines academic excellence, technical expertise, professional skills, and real-world exposure. Students receive continuous support throughout their academic journey, enabling them to confidently transition from campus to career.",
  recentPlacementsBadge: "OUR PLACED STARS",
  recentPlacementsTitle: "RECENT PLACEMENTS",
  industriesTitle: "INDUSTRIES WE CATER",
  industries: DEFAULT_INDUSTRIES,
  careerProgramsTitle: "CAREER DEVELOPMENT PROGRAMS",
  careerPrograms: [
    "Industry-oriented technical training",
    "Aptitude and logical reasoning development",
    "Communication and soft skills enhancement",
    "Coding and programming practice sessions",
    "Resume building and portfolio development",
    "Group discussion and interview preparation",
    "Mock interviews with industry professionals",
    "Personality development workshops",
    "Internship guidance and career mentoring"
  ],
  industryConnectTitle: "INDUSTRY CONNECT",
  industryConnectDesc: "The institute actively collaborates with leading organizations to provide students with meaningful industry exposure through:",
  industryConnectItems: [
    "Campus recruitment drives",
    "Internship opportunities",
    "Industry expert lectures",
    "Corporate mentoring sessions",
    "Technical workshops and certification programs",
    "Industrial visits and experiential learning",
    "Live projects and collaborative initiatives"
  ],
  placementCellTitle: "DEDICATED TRAINING & PLACEMENT CELL",
  placementCellDesc: "Our Placement Cell works closely with students and recruiters to ensure a seamless recruitment process.",
  placementCellItems: [
    { t: "Mentorship", d: "Career counseling and mentoring" },
    { t: "Assessment", d: "Placement readiness assessments" },
    { t: "Recruitment Drives", d: "Organizing campus placement sessions" },
    { t: "Internships", d: "Facilitating internship placements" },
    { t: "Collaborations", d: "Industry-academia partnerships" },
    { t: "Relations", d: "Employer relationship management" },
    { t: "Career Pathing", d: "Higher education guidance" },
    { t: "Alumni Network", d: "Interaction and alumni links" }
  ],
  recruitersBadge: "GLOBAL COLLABORATORS",
  recruitersTitle: "TOP RECRUITERS VISITED",
  placedStudents: [
    { name: "Ch. Sandeep", branch: "Information Technology", company: "Adobe", ctc: "₹14.0 LPA", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face" },
    { name: "M. Sneha Reddy", branch: "Electronics & Comm", company: "Cognizant", ctc: "₹12.0 LPA", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop&crop=face" },
    { name: "V. Sai Teja", branch: "Computer Science", company: "TCS Digital", ctc: "₹9.0 LPA", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face" },
    { name: "A. Lakshmi Prasanna", branch: "Data Science", company: "Infosys", ctc: "₹9.5 LPA", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=face" },
    { name: "G. Rajesh Babu", branch: "Mechanical Eng", company: "L&T Core", ctc: "₹8.0 LPA", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face" },
    { name: "S. Niharika", branch: "Civil Engineering", company: "JMC Projects", ctc: "₹7.5 LPA", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop&crop=face" },
    { name: "P. Vinay Kumar", branch: "Computer Science", company: "Amazon", ctc: "₹18.0 LPA", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop&crop=face" },
    { name: "K. Hari Priya", branch: "Artificial Intelligence", company: "Microsoft", ctc: "₹15.5 LPA", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=face" }
  ],
  recruiters: [
    { name: "Microsoft", logo: "/logos/microsoft.svg" },
    { name: "Amazon", logo: "/logos/amazon.svg" },
    { name: "Adobe", logo: "/logos/adobe.svg" },
    { name: "Intel", logo: "/logos/intel.svg" },
    { name: "Qualcomm", logo: "/logos/qualcomm.svg" },
    { name: "Zoho", logo: "/logos/zoho.svg" },
    { name: "Wipro", logo: "/logos/wipro.svg" },
    { name: "Oracle", logo: "/logos/oracle.svg" },
    { name: "Tech Mahindra", logo: "/logos/techmahindra.svg" },
    { name: "TCS", logo: "/logos/tcs.svg" },
    { name: "Infosys", logo: "/logos/infosys.svg" },
    { name: "LTIMindtree", logo: "/logos/ltimindtree.svg" },
    { name: "L&T", logo: "/logos/larsen.svg" },
    { name: "Accenture", logo: "/logos/accenture.svg" },
    { name: "Cognizant", logo: "/logos/cognizant.svg" },
    { name: "Capgemini", logo: "/logos/capgemini.svg" },
    { name: "Deloitte", logo: "/logos/deloitte.svg" },
    { name: "IBM", logo: "/logos/ibm.svg" },
    { name: "HCLTech", logo: "/logos/hcltech.svg" },
    { name: "Google", logo: "/logos/google.svg" }
  ]
};

export const INITIAL_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 1,
    studentName: "Hitaishi Reddy",
    studentImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=600&fit=crop&crop=face",
    department: "B.Tech - Computer Science & Engineering",
    batch: "2024 Batch",
    companyName: "TCS",
    companyLogo: "/logos/tcs.svg",
    packageOffered: "12 LPA",
    description: "The supportive faculty, career guidance, and hands-on learning experience at Chalapathi University played a crucial role in shaping my skills and confidence. I'm grateful for the opportunities and exposure that helped me secure my dream job at TCS.",
    skills: ["React", "Node.js", "Java", "SQL", "Cloud Computing"],
    internshipExp: "6 Months at TCS Innovation Lab",
    achievement: "Winner of National level Smart India Hackathon",
    milestones: {
      learningTitle: "Strong Academic Foundation",
      learningDesc: "Conceptual clarity through innovative teaching",
      internshipTitle: "Skill Development",
      internshipDesc: "Live projects and industry-relevant skills",
      placementTitle: "Internship",
      placementDesc: "Internship experience boosted my practical knowledge",
      careerTitle: "Dream Career",
      careerDesc: "Campus placement opportunity at TCS"
    }
  },
  {
    id: 2,
    studentName: "Rajesh Kumar",
    studentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop&crop=face",
    department: "B.Tech - Electronics & Communication Engineering",
    batch: "2024 Batch",
    companyName: "Wipro",
    companyLogo: "/logos/wipro.svg",
    packageOffered: "8.5 LPA",
    description: "The placement bootcamp prepares you for exactly what employers look for. The mock HR rounds gave me the confidence to present my projects and crack the final interview with ease.",
    skills: ["IoT Systems", "Embedded C", "Microcontrollers", "Python"],
    internshipExp: "4 Months at Wipro Partner IoT Center",
    achievement: "Best Technical Prototype Project Award",
    milestones: {
      learningTitle: "Core Labs Work",
      learningDesc: "Hands-on chip design and circuit basics",
      internshipTitle: "IoT Prototype",
      internshipDesc: "IoT prototype design & microcontroller coding",
      placementTitle: "Internship Term",
      placementDesc: "Practical training at Wipro partner tech facility",
      careerTitle: "Career Growth",
      careerDesc: "Onboarding as Project Systems Engineer at Wipro"
    }
  },
  {
    id: 3,
    studentName: "S. Niharika",
    studentImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=600&fit=crop&crop=face",
    department: "B.Tech - Civil Engineering",
    batch: "2024 Batch",
    companyName: "Deloitte",
    companyLogo: "/logos/deloitte.svg",
    packageOffered: "7.5 LPA",
    description: "Transitioning from core civil to analytical roles was smooth thanks to the comprehensive programming and logic training provided during the campus placement training weeks.",
    skills: ["SQL Data Analysis", "Tableau", "Project Lifecycle", "AutoCAD"],
    internshipExp: "6 Months Structural Analysis Analyst",
    achievement: "Ranked Top 5% in University Analytics Contest",
    milestones: {
      learningTitle: "Quantitative Logic",
      learningDesc: "Advanced algorithms & quantitative analytics",
      internshipTitle: "SQL & Lifecycle",
      internshipDesc: "SQL databases and project lifecycle tools",
      placementTitle: "Consulting Project",
      placementDesc: "Enterprise Resource Planning analytics project",
      careerTitle: "Analytical Analyst",
      careerDesc: "Consulting role in Deloitte Advisory wing"
    }
  }
];

export const INITIAL_FACULTY_DATA: Record<string, DirectoryData> = {
  "Computer Science & Engineering": {
    hod: { name: "Prof. P. V. Ramana", title: "HOD & Professor", edu: "Ph.D - Indian Institute of Technology Madras, India", interests: "Algorithms, Distributed Networks, Database Optimization", phone: "0863 2345432", email: "hod.cse@city.ac.in", avatar: "PVR", age: "52 Years", experience: "24 Years of Teaching & Research", idNo: "CCIT-CSE-001", department: "Computer Science & Engineering" },
    others: [
      { name: "Dr. A. Kiran Kumar", title: "Professor", edu: "Ph.D - National Institute of Technology Warangal, India", interests: "Cyber Security, Network Architectures & Trust Models", phone: "0863 2345433", email: "kiran.cse@city.ac.in", avatar: "AKK", age: "45 Years", experience: "16 Years", idNo: "CCIT-CSE-002", department: "Computer Science & Engineering" },
      { name: "Mrs. K. Jhansi", title: "Assistant Professor", edu: "M.Tech - JNTU, Kakinada", interests: "Software Engineering & Object Oriented Designs", phone: "0863 2345434", email: "jhansi.cse@city.ac.in", avatar: "KJ", age: "34 Years", experience: "8 Years", idNo: "CCIT-CSE-003", department: "Computer Science & Engineering" },
      { name: "Dr. B. Satyanarayana", title: "Associate Professor", edu: "Ph.D - Osmania University, Hyderabad", interests: "Cloud Computing, Grid Virtualization, Distributing Computing", phone: "0863 2345435", email: "satyanarayana.cse@city.ac.in", avatar: "BS", age: "41 Years", experience: "13 Years", idNo: "CCIT-CSE-004", department: "Computer Science & Engineering" }
    ]
  },
  "Artificial Intelligence & ML": {
    hod: { name: "Dr. S. Mallikharjuna Rao", title: "HOD & Associate Professor", edu: "Ph.D - Andhra University", interests: "Machine Learning, Neural Networks, Natural Language Processing", phone: "0863 2345440", email: "hod.ai@city.ac.in", avatar: "SMR", age: "43 Years", experience: "15 Years", idNo: "CCIT-AI-001", department: "Artificial Intelligence & ML" },
    others: [
      { name: "Dr. K. Swetha", title: "Professor", edu: "Ph.D - University of Hyderabad", interests: "Computer Vision, Cognitive Robotics, Automation", phone: "0863 2345441", email: "swetha.ai@city.ac.in", avatar: "KS", age: "46 Years", experience: "17 Years", idNo: "CCIT-AI-002", department: "Artificial Intelligence & ML" },
      { name: "Mr. P. Ravi", title: "Assistant Professor", edu: "M.Tech - JNTU Hyderabad", interests: "Deep Learning, Python ML frameworks, TensorFlow operations", phone: "0863 2345442", email: "ravi.ai@city.ac.in", avatar: "PR", age: "32 Years", experience: "6 Years", idNo: "CCIT-AI-003", department: "Artificial Intelligence & ML" }
    ]
  },
  "Data Science": {
    hod: { name: "Dr. G. Srinivasa Rao", title: "HOD & Associate Professor", edu: "Ph.D - Acharya Nagarjuna University", interests: "Data Analytics, Big Data ecosystems, Hadoop clusters setup", phone: "0863 2345450", email: "hod.ds@city.ac.in", avatar: "GSR", age: "44 Years", experience: "16 Years", idNo: "CCIT-DS-001", department: "Data Science" },
    others: [
      { name: "Smt. T. Kavitha", title: "Assistant Professor", edu: "M.Tech - JNTU Kakinada", interests: "Statistical Analytics, R programming, data warehousing", phone: "0863 2345451", email: "kavitha.ds@city.ac.in", avatar: "TK", age: "35 Years", experience: "9 Years", idNo: "CCIT-DS-002", department: "Data Science" }
    ]
  },
  "Cyber Security": {
    hod: { name: "Dr. B. Rajesh Kumar", title: "HOD & Professor", edu: "Ph.D - IIT Kharagpur", interests: "Cryptography, Network Security, Cyber Forensics", phone: "0863 2345455", email: "hod.cyber@city.ac.in", avatar: "BRK", age: "47 Years", experience: "18 Years", idNo: "CCIT-CS-001", department: "Cyber Security" },
    others: [
      { name: "Mr. K. V. Satish", title: "Assistant Professor", edu: "M.Tech - JNTU Hyderabad", interests: "Ethical Hacking, Cloud Security, Blockchain", phone: "0863 2345456", email: "satish.cyber@city.ac.in", avatar: "KVS", age: "33 Years", experience: "7 Years", idNo: "CCIT-CS-002", department: "Cyber Security" }
    ]
  },
  "Electronics & Communication Engineering": {
    hod: { name: "Dr. V. Radha Krishna", title: "HOD & Professor", edu: "Ph.D - JNTU Hyderabad", interests: "VLSI Design, Embedded Systems, IoT", phone: "0863 2345460", email: "hod.ece@city.ac.in", avatar: "VRK", age: "48 Years", experience: "20 Years", idNo: "CCIT-ECE-001", department: "Electronics & Communication Engineering" },
    others: [
      { name: "Mr. B. Naveen", title: "Assistant Professor", edu: "M.Tech - NIT Trichy", interests: "Signal Processing, Wireless Communications", phone: "0863 2345461", email: "naveen.ece@city.ac.in", avatar: "BN", age: "35 Years", experience: "10 Years", idNo: "CCIT-ECE-002", department: "Electronics & Communication Engineering" },
      { name: "Dr. P. S. Rao", title: "Associate Professor", edu: "Ph.D - IIT Madras", interests: "Microstrip Antennas, Microwave Circuitry", phone: "0863 2345462", email: "psrao.ece@city.ac.in", avatar: "PSR", age: "42 Years", experience: "14 Years", idNo: "CCIT-ECE-003", department: "Electronics & Communication Engineering" }
    ]
  },
  "Civil Engineering": {
    hod: { name: "Dr. K. Venkateswara Rao", title: "HOD & Professor", edu: "Ph.D - IIT Madras", interests: "Structural Dynamics, Earthquake Resistance, Advanced Concrete Tech", phone: "0863 2345465", email: "hod.civil@city.ac.in", avatar: "KVR", age: "51 Years", experience: "22 Years", idNo: "CCIT-CIVIL-001", department: "Civil Engineering" },
    others: [
      { name: "Dr. M. Ramesh", title: "Associate Professor", edu: "Ph.D - NIT Warangal", interests: "Geotechnical Engineering, Soil Mechanics, Foundation Design", phone: "0863 2345466", email: "ramesh.civil@city.ac.in", avatar: "MR", age: "43 Years", experience: "15 Years", idNo: "CCIT-CIVIL-002", department: "Civil Engineering" },
      { name: "Mr. P. Suresh", title: "Assistant Professor", edu: "M.Tech - JNTU Kakinada", interests: "Transportation Engineering, Structural CAD Modeling", phone: "0863 2345467", email: "suresh.civil@city.ac.in", avatar: "PS", age: "34 Years", experience: "8 Years", idNo: "CCIT-CIVIL-003", department: "Civil Engineering" }
    ]
  },
  "Basic Science & Humanities": {
    hod: { name: "Dr. T. V. Subba Rao", title: "HOD & Professor", edu: "Ph.D - Andhra University", interests: "Applied Mathematics, Fluid Dynamics, Differential Equations", phone: "0863 2345468", email: "hod.bsh@city.ac.in", avatar: "TVS", age: "53 Years", experience: "24 Years", idNo: "CCIT-BSH-001", department: "Basic Science & Humanities" },
    others: [
      { name: "Dr. S. Lakshmi", title: "Professor of English", edu: "Ph.D - Osmania University", interests: "Professional Communication, ELT, Phonetics", phone: "0863 2345469", email: "lakshmi.english@city.ac.in", avatar: "SL", age: "46 Years", experience: "17 Years", idNo: "CCIT-BSH-002", department: "Basic Science & Humanities" },
      { name: "Dr. N. V. Prasad", title: "Associate Professor of Physics", edu: "Ph.D - University of Hyderabad", interests: "Materials Science, Solid State Physics, Nanomaterials", phone: "0863 2345473", email: "prasad.physics@city.ac.in", avatar: "NVP", age: "41 Years", experience: "13 Years", idNo: "CCIT-BSH-003", department: "Basic Science & Humanities" },
      { name: "Dr. Ch. Radhika", title: "Assistant Professor of Chemistry", edu: "Ph.D - Acharya Nagarjuna University", interests: "Polymer Chemistry, Environmental Analysis", phone: "0863 2345474", email: "radhika.chem@city.ac.in", avatar: "CR", age: "36 Years", experience: "10 Years", idNo: "CCIT-BSH-004", department: "Basic Science & Humanities" }
    ]
  },
  "School of Pharmacy": {
    hod: { name: "Prof. Dr. A. Narendra", title: "Principal & Professor", edu: "Ph.D - Indian Institute of Chemical Technology (IICT), Hyderabad", interests: "Pharmaceutics, Target-oriented Drug Delivery Systems, Nano-carriers", phone: "0863 2345470", email: "principal.pharmacy@city.ac.in", avatar: "AN", age: "55 Years", experience: "26 Years of Research", idNo: "CCIT-PH-001", department: "School of Pharmacy" },
    others: [
      { name: "Dr. P. Kavitha", title: "Professor", edu: "Ph.D - JNTU Anantapur", interests: "Pharmacology, clinical drug safety audits, toxicity metrics", phone: "0863 2345471", email: "kavitha.pharmacy@city.ac.in", avatar: "PK", age: "47 Years", experience: "18 Years", idNo: "CCIT-PH-002", department: "School of Pharmacy" },
      { name: "Smt. G. Swathi", title: "Assistant Professor", edu: "M.Pharm - Acharya Nagarjuna University", interests: "Pharmaceutical analysis, quality control procedures", phone: "0863 2345472", email: "swathi.pharmacy@city.ac.in", avatar: "GS", age: "33 Years", experience: "7 Years", idNo: "CCIT-PH-003", department: "School of Pharmacy" }
    ]
  },
  "School of Management": {
    hod: { name: "Dr. K. S. Rao", title: "Principal & Professor", edu: "Ph.D - Andhra University, Visakhapatnam", interests: "Financial Management, Corporate governance, accounting practices", phone: "0863 2345480", email: "director.mba@city.ac.in", avatar: "KSR", age: "50 Years", experience: "22 Years", idNo: "CCIT-MGMT-001", department: "School of Management" },
    others: [
      { name: "Dr. P. S. R. Murthy", title: "Associate Professor", edu: "Ph.D - Andhra University", interests: "Marketing Management, Consumer Behaviour, Digital Retail", phone: "0863 2345482", email: "murthy.mba@city.ac.in", avatar: "PSM", age: "44 Years", experience: "17 Years", idNo: "CCIT-MGMT-003", department: "School of Management" },
      { name: "Mr. G. Ravindra", title: "Assistant Professor", edu: "MBA - Acharya Nagarjuna University", interests: "Operations Management, Supply Chain Logistics, Quality Auditing", phone: "0863 2345483", email: "ravi.mba@city.ac.in", avatar: "GR", age: "33 Years", experience: "8 Years", idNo: "CCIT-MGMT-004", department: "School of Management" }
    ]
  }
};

export const INITIAL_BOARD_DATA: Record<string, DirectoryData> = {
  "Governing Council": {
    hod: { name: "Sri Y. V. Anjaneyulu", title: "Chairman & President", edu: "Graduate in Engineering & Humanities", interests: "Administration, institutional strategy, policy planning, and infrastructure development.", phone: "0863 2345401", email: "chairman@city.ac.in", avatar: "YVA", age: "65 Years", experience: "35 Years of Administrative Leadership", idNo: "CUB-GC-001", department: "Governing Council" },
    others: []
  },
  "Chancellor": {
    hod: { name: "Sri Y. V. Anjaneyulu", title: "Chancellor", edu: "Renowned Educationist & Founder Sponsor Representative", interests: "Strategic leadership, academic governance, public relations, and legal policies.", phone: "0863 2345401", email: "chancellor@city.ac.in", avatar: "YVA", age: "65 Years", experience: "35 Years", idNo: "CUB-CH-001", department: "Office of the Chancellor" },
    others: []
  },
  "Pro Chancellor": {
    hod: { name: "Sri Y. Sujit Kumar", title: "Pro Chancellor", edu: "M.Tech & MBA - Executive Education", interests: "Institutional progress planning, modernization initiatives, and industry collaborations.", phone: "0863 2345402", email: "prochan@city.ac.in", avatar: "YSK", age: "42 Years", experience: "18 Years", idNo: "CUB-PC-001", department: "Office of the Pro Chancellor" },
    others: []
  },
  "Vice Chancellor": {
    hod: { name: "Dr. K. Prasad Rao", title: "Vice Chancellor", edu: "Ph.D., Former Senior Professor - Administration & Research", interests: "Curriculum planning coordination, academic excellence, and international relations.", phone: "0863 2345403", email: "vc@city.ac.in", avatar: "KPR", age: "58 Years", experience: "30 Years", idNo: "CUB-VC-001", department: "Office of the Vice Chancellor" },
    others: []
  },
  "Registrar": {
    hod: { name: "Prof. T. Sivaramaiah", title: "Registrar", edu: "M.Tech, Ph.D. - Computer Networks", interests: "General administration, statutory records management, and legal affairs compliance.", phone: "0863 2345404", email: "registrar@city.ac.in", avatar: "TS", age: "53 Years", experience: "25 Years", idNo: "CUB-RG-001", department: "Registrar Office" },
    others: []
  },
  "Dean – Academic Affairs": {
    hod: { name: "Prof. P. V. Ramana", title: "Dean – Academic Affairs", edu: "Ph.D - Indian Institute of Technology Madras, India", interests: "Academic planning, curriculum development, and examinations coordination.", phone: "0863 2345432", email: "dean.academics@city.ac.in", avatar: "PVR", age: "52 Years", experience: "24 Years", idNo: "CUB-DA-001", department: "Academic Affairs Office" },
    others: []
  },
  "Dean – Research & Innovation": {
    hod: { name: "Dr. K. Chandrasekhar", title: "Dean – Research & Innovation", edu: "Ph.D - Indian Institute of Technology Delhi, India", interests: "Research ecosystem governance, patent filing, sponsored grants, and innovations.", phone: "0863 2345430", email: "dean.research@city.ac.in", avatar: "KC", age: "48 Years", experience: "20 Years", idNo: "CUB-DR-001", department: "Research & Development Cell" },
    others: []
  },
  "Dean – Student Affairs": {
    hod: { name: "Dr. G. Madhavi", title: "Dean – Student Affairs", edu: "Ph.D - Andhra University", interests: "Student welfare guidelines, professional clubs, and hostel supervision.", phone: "0863 2345460", email: "dean.students@city.ac.in", avatar: "GM", age: "42 Years", experience: "15 Years", idNo: "CUB-DS-001", department: "Student Affairs Cell" },
    others: []
  },
  "Dean – Faculty Affairs": {
    hod: { name: "Dr. T. Anuradha", title: "Dean – Faculty Affairs", edu: "Ph.D - BITS Pilani", interests: "Faculty recruitment, performance reviews, and professional development programs.", phone: "0863 2345470", email: "dean.faculty@city.ac.in", avatar: "TA", age: "47 Years", experience: "18 Years", idNo: "CUB-DF-001", department: "Faculty Affairs Office" },
    others: []
  },
  "Dean – Admissions": {
    hod: { name: "Dr. L. Rama Krishna", title: "Dean – Admissions", edu: "Ph.D - Osmania University", interests: "Admissions operations, merit scholarships, and student enrollment support.", phone: "0863 2345480", email: "dean.admissions@city.ac.in", avatar: "LRK", age: "51 Years", experience: "22 Years", idNo: "CUB-DAD-001", department: "Admissions Office" },
    others: []
  },
  "Dean – Placements & Relations": {
    hod: { name: "Dr. R. Karthik", title: "Dean – Placements & Relations", edu: "Ph.D - NIT Trichy", interests: "Industry relations, placements campaigns, and placement coordinates.", phone: "0863 2345461", email: "dean.placements@city.ac.in", avatar: "RK", age: "40 Years", experience: "13 Years", idNo: "CUB-DP-001", department: "Placement Office" },
    others: []
  },
  "Finance Officer": {
    hod: { name: "Sri G. Ravindra", title: "Finance Officer", edu: "MBA & Chartered Accountant", interests: "Finance supervision, budgeting audits, cash logs, and payroll systems.", phone: "0863 2345483", email: "finance@city.ac.in", avatar: "GR", age: "33 Years", experience: "8 Years", idNo: "CUB-FO-001", department: "Finance & Accounts Department" },
    others: []
  },
  "Controller of Examinations": {
    hod: { name: "Dr. V. Satish", title: "Controller of Examinations", edu: "Ph.D - JNTU Hyderabad", interests: "Examinations conduction, grading papers, and degree certification.", phone: "0863 2345471", email: "coe@city.ac.in", avatar: "VS", age: "38 Years", experience: "11 Years", idNo: "CUB-COE-001", department: "Examination Cell" },
    others: []
  }
};

export const INITIAL_STAFF_DATA: Record<string, DirectoryData> = {
  "Registrar Office": {
    hod: { name: "Sri M. Srinivasa Rao", title: "Assistant Registrar", edu: "M.A. in Public Administration - Andhra University", interests: "General administration, statutory records maintenance, legal compliances support.", phone: "0863 2345530", email: "registrar.office@city.ac.in", avatar: "MSR", age: "48 Years", experience: "18 Years", idNo: "CUS-REG-001", department: "Registrar Office" },
    others: [
      { name: "Sri K. Ramu", title: "Section Officer", edu: "B.Com - Acharya Nagarjuna University", interests: "Files registry, letters cataloging, statutory documentation records.", phone: "0863 2345531", email: "ramu.reg@city.ac.in", avatar: "KR", age: "42 Years", experience: "13 Years", idNo: "CUS-REG-002", department: "Registrar Office" },
      { name: "Smt. G. Mary", title: "Senior Assistant", edu: "B.Sc - JNTU Kakinada", interests: "Inward outward dispatch, student data catalog entries.", phone: "0863 2345532", email: "mary.reg@city.ac.in", avatar: "GM", age: "36 Years", experience: "9 Years", idNo: "CUS-REG-003", department: "Registrar Office" }
    ]
  },
  "Academic Affairs": {
    hod: { name: "Sri V. Prasad", title: "Academic Coordinator", edu: "M.Tech in CSE", interests: "Academic registers compilation, class logs allocation support.", phone: "0863 2345540", email: "academic.office@city.ac.in", avatar: "VP", age: "40 Years", experience: "12 Years", idNo: "CUS-ACAD-001", department: "Academic Affairs" },
    others: []
  },
  "Finance & Accounts": {
    hod: { name: "Sri G. Suresh", title: "Accounts Officer", edu: "M.Com & MBA Finance", interests: "Accounts logs entry, financial audits review, cash books.", phone: "0863 2345550", email: "accounts@city.ac.in", avatar: "GS", age: "45 Years", experience: "16 Years", idNo: "CUS-FIN-001", department: "Finance & Accounts" },
    others: [
      { name: "Sri P. Naidu", title: "Senior Accountant", edu: "B.Com - ANU", interests: "Bank reconciliation, audit vouchers compilation.", phone: "0863 2345551", email: "naidu.fin@city.ac.in", avatar: "PN", age: "38 Years", experience: "10 Years", idNo: "CUS-FIN-002", department: "Finance & Accounts" }
    ]
  },
  "General Administration": {
    hod: { name: "Sri T. Satish", title: "Administrative Officer", edu: "M.A. - Public Admin", interests: "Daily campus operations management, logistic arrangements.", phone: "0863 2345560", email: "ao.admin@city.ac.in", avatar: "TS", age: "46 Years", experience: "17 Years", idNo: "CUS-ADM-001", department: "General Administration" },
    others: []
  },
  "Establishment": {
    hod: { name: "Sri K. Subba Rao", title: "Establishment Head", edu: "M.B.A. HR", interests: "Leaves records entry, promotion database, service logs.", phone: "0863 2345570", email: "estab@city.ac.in", avatar: "KSR", age: "52 Years", experience: "22 Years", idNo: "CUS-EST-001", department: "Establishment" },
    others: []
  },
  "Admissions Office": {
    hod: { name: "Smt. K. Aruna", title: "Admission Officer", edu: "MBA - Guntur", interests: "Counseling support, digital portal checks, certificate verification.", phone: "0863 2345580", email: "admissions.office@city.ac.in", avatar: "KA", age: "38 Years", experience: "11 Years", idNo: "CUS-ADM-001", department: "Admissions Office" },
    others: [
      { name: "Sri M. Ravi", title: "Verification Officer", edu: "B.Tech - JNTU", interests: "Academic marks verification and entry verification.", phone: "0863 2345581", email: "ravi.admissions@city.ac.in", avatar: "MR", age: "33 Years", experience: "7 Years", idNo: "CUS-ADM-002", department: "Admissions Office" }
    ]
  },
  "Examination Cell": {
    hod: { name: "Sri D. Srinivasa Rao", title: "Assistant COE", edu: "M.Tech - Andhra University", interests: "Grade books processing, certificate logs, seating layouts.", phone: "0863 2345590", email: "exams.office@city.ac.in", avatar: "DSR", age: "43 Years", experience: "14 Years", idNo: "CUS-EXAM-001", department: "Examination Cell" },
    others: [
      { name: "Smt. P. Kavitha", title: "Evaluation Assistant", edu: "B.Sc - ANU", interests: "Paper marks entries, dispatch queues, certification database.", phone: "0863 2345591", email: "kavitha.exams@city.ac.in", avatar: "PK", age: "34 Years", experience: "8 Years", idNo: "CUS-EXAM-002", department: "Examination Cell" }
    ]
  },
  "Placement Office": {
    hod: { name: "Sri K. Hari Prasad", title: "Placement Officer", edu: "M.B.A. HR & Marketing", interests: "Recruiter relations, coordinate placement schedules, training camps.", phone: "0863 2345600", email: "placements.office@city.ac.in", avatar: "KHP", age: "39 Years", experience: "12 Years", idNo: "CUS-PLC-001", department: "Placement Office" },
    others: [
      { name: "Smt. G. Swathi", title: "Corporate Relations Executive", edu: "M.A. English - Guntur", interests: "Corporate placement communication, resumes collection support.", phone: "0863 2345601", email: "swathi.plc@city.ac.in", avatar: "GS", age: "31 Years", experience: "6 Years", idNo: "CUS-PLC-002", department: "Placement Office" }
    ]
  },
  "Library": {
    hod: { name: "Dr. K. Swathi", title: "Chief Librarian", edu: "Ph.D. in Library Sciences", interests: "Index registries compilation, online journal accesses, purchase catalogs.", phone: "0863 2345610", email: "library@city.ac.in", avatar: "KS", age: "47 Years", experience: "18 Years", idNo: "CUS-LIB-001", department: "Library" },
    others: [
      { name: "Sri T. Kumar", title: "Library Assistant", edu: "M.Lib.Sc - ANU", interests: "Book registry circulation, digital logs tracking.", phone: "0863 2345611", email: "kumar.lib@city.ac.in", avatar: "TK", age: "35 Years", experience: "9 Years", idNo: "CUS-LIB-002", department: "Library" }
    ]
  },
  "Computer Centre": {
    hod: { name: "Sri K. Venkatesh", title: "System Administrator", edu: "M.Tech in Computer Networks", interests: "Laboratory support, LAN firewalls, network monitoring.", phone: "0863 2345620", email: "sysadmin@city.ac.in", avatar: "KV", age: "41 Years", experience: "15 Years", idNo: "CUS-COMP-001", department: "Computer Centre" },
    others: [
      { name: "Sri M. Ravi Kumar", title: "Network Engineer", edu: "B.Tech in CSE", interests: "Fiber router access points configurations, server updates.", phone: "0863 2345621", email: "network@city.ac.in", avatar: "MRK", age: "32 Years", experience: "6 Years", idNo: "CUS-COMP-002", department: "Computer Centre" }
    ]
  },
  "Research Office": {
    hod: { name: "Sri S. Venkatesh", title: "Research Coordinator", edu: "M.Tech - Research Associate", interests: "Filing patent archives, project grants tracker coordination.", phone: "0863 2345630", email: "research.office@city.ac.in", avatar: "SV", age: "37 Years", experience: "10 Years", idNo: "CUS-RES-001", department: "Research Office" },
    others: []
  },
  "Purchase & Stores": {
    hod: { name: "Sri B. Rajesh", title: "Purchase Superintendent", edu: "B.Tech - Mechanical", interests: "Stores ledger tracking, inventory checks, vendor bills log.", phone: "0863 2345640", email: "stores@city.ac.in", avatar: "BR", age: "45 Years", experience: "16 Years", idNo: "CUS-PUR-001", department: "Purchase & Stores" },
    others: []
  },
  "Estate Office": {
    hod: { name: "Sri P. S. Rao", title: "Estate Officer", edu: "B.Tech in Civil Engineering", interests: "Campus utilities, maintenance supervisor, green cover records.", phone: "0863 2345650", email: "estate@city.ac.in", avatar: "PSR", age: "50 Years", experience: "21 Years", idNo: "CUS-EST-001", department: "Estate Office" },
    others: []
  },
  "Public Relations": {
    hod: { name: "Sri K. Naidu", title: "PRO Head", edu: "M.A. in Journalism", interests: "Press drafting, news releases, hospitality services logs.", phone: "0863 2345660", email: "pro@city.ac.in", avatar: "KN", age: "44 Years", experience: "15 Years", idNo: "CUS-PR-001", department: "Public Relations" },
    others: []
  },
  "Student Affairs": {
    hod: { name: "Sri G. Ravindra", title: "Student Welfare Assistant", edu: "MBA - Student Coordinator", interests: "Club registrations support, coordinate sports events, hostel rosters.", phone: "0863 2345670", email: "student.office@city.ac.in", avatar: "GR", age: "36 Years", experience: "8 Years", idNo: "CUS-SA-001", department: "Student Affairs" },
    others: []
  },
  "Transport": {
    hod: { name: "Sri T. Prasad", title: "Transport Supervisor", edu: "Diploma in Mech Engineering", interests: "Bus driver log records, route planning registers, fuel logs.", phone: "0863 2345680", email: "transport@city.ac.in", avatar: "TP", age: "48 Years", experience: "20 Years", idNo: "CUS-TR-001", department: "Transport" },
    others: []
  },
  "Health Centre": {
    hod: { name: "Dr. S. Radha", title: "Medical Officer", edu: "M.B.B.S. - GMC", interests: "First-aid, diagnostics logs, medical inventory support.", phone: "0863 2345690", email: "health@city.ac.in", avatar: "SR", age: "42 Years", experience: "14 Years", idNo: "CUS-MED-001", department: "Health Centre" },
    others: []
  },
  "Guest House": {
    hod: { name: "Sri M. Ravi", title: "Guest House Warden", edu: "B.Sc - Hotel Management", interests: "Room booking entries, inventory audit logs, pantry check.", phone: "0863 2345700", email: "guesthouse@city.ac.in", avatar: "MR", age: "35 Years", experience: "9 Years", idNo: "CUS-GST-001", department: "Guest House" },
    others: []
  }
};

export const INITIAL_ENQUIRIES: EnquiryLead[] = [
  { id: "ENQ-1", name: "Rahul Verma", mobile: "9876543210", email: "rahul@gmail.com", city: "Guntur", state: "Andhra Pradesh", qualification: "Class 12 / Intermediate", yearOfPassing: "2025", program: "B.Tech - Computer Science and Engineering", date: "20 May 2025", status: "New" },
  { id: "ENQ-2", name: "Priya Sen", mobile: "8765432109", email: "priya@gmail.com", city: "Vijayawada", state: "Andhra Pradesh", qualification: "Class 12 / Intermediate", yearOfPassing: "2025", program: "B.Tech - CSE (Data Science)", date: "19 May 2025", status: "Contacted" },
  { id: "ENQ-3", name: "Kiran Dev", mobile: "7654321098", email: "kiran@gmail.com", city: "Hyderabad", state: "Telangana", qualification: "Class 12 / Intermediate", yearOfPassing: "2025", program: "B.Tech - CSE (Artificial Intelligence)", date: "18 May 2025", status: "New" }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showAnnouncementsDrawer, setShowAnnouncementsDrawer] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => localStorage.getItem("chalapathi_last_saved") || null);

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const local = localStorage.getItem("chalapathi_site_settings");
    return local ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(local) } : DEFAULT_SITE_SETTINGS;
  });

  // Theme Colors
  const [themeColors, setThemeColors] = useState<ThemeColors>(() => {
    const local = localStorage.getItem("chalapathi_theme_colors");
    return local ? { ...DEFAULT_THEME_COLORS, ...JSON.parse(local) } : DEFAULT_THEME_COLORS;
  });

  // Homepage Sections (Order & Enabled)
  const [homepageSections, setHomepageSections] = useState<HomepageSectionConfig[]>(() => {
    const local = localStorage.getItem("chalapathi_homepage_sections_v2");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_HOMEPAGE_SECTIONS;
  });

  // Navigation Menu
  const [navigationMenu, setNavigationMenu] = useState<NavMenuItem[]>(() => {
    const local = localStorage.getItem("chalapathi_navigation_menu");
    return local ? JSON.parse(local) : DEFAULT_NAV_MENU;
  });

  // Footer Content
  const [footerContent, setFooterContent] = useState<FooterContent>(() => {
    const local = localStorage.getItem("chalapathi_footer_content");
    return local ? JSON.parse(local) : DEFAULT_FOOTER_CONTENT;
  });

  // Enquiries Leads
  const [enquiries, setEnquiries] = useState<EnquiryLead[]>(() => {
    const local = localStorage.getItem("chalapathi_enquiries");
    return local ? JSON.parse(local) : INITIAL_ENQUIRIES;
  });

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const local = localStorage.getItem("chalapathi_announcements");
    return local ? JSON.parse(local) : INITIAL_ANNOUNCEMENTS;
  });

  // Programs
  const [programs, setPrograms] = useState<ProgramDetail[]>(() => {
    const local = localStorage.getItem("chalapathi_programs");
    const parsed = local ? JSON.parse(local) : null;
    if (!parsed || parsed.length < PROGRAMS_DATA.length) {
      localStorage.setItem("chalapathi_programs", JSON.stringify(PROGRAMS_DATA));
      return PROGRAMS_DATA;
    }
    return parsed;
  });

  // News
  const [news, setNews] = useState<NewsArticle[]>(() => {
    const local = localStorage.getItem("chalapathi_news_v3");
    if (local) return JSON.parse(local);
    localStorage.setItem("chalapathi_news_v3", JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  });

  // News Page Configuration
  const [newsPageConfig, setNewsPageConfig] = useState<NewsPageConfig>(() => {
    const local = localStorage.getItem("chalapathi_news_page_config");
    return local ? { ...DEFAULT_NEWS_PAGE_CONFIG, ...JSON.parse(local) } : DEFAULT_NEWS_PAGE_CONFIG;
  });

  // Events
  const [events, setEvents] = useState<EventItem[]>(() => {
    const local = localStorage.getItem("chalapathi_events_v3");
    if (local) return JSON.parse(local);
    localStorage.setItem("chalapathi_events_v3", JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  });

  // About Content
  const [aboutContent, setAboutContent] = useState<AboutUsContent>(() => {
    const local = localStorage.getItem("chalapathi_about_v2");
    return local ? JSON.parse(local) : INITIAL_ABOUT_CONTENT;
  });

  // Calendar
  const [calendarData, setCalendarData] = useState<MonthCalendarData[]>(() => {
    const local = localStorage.getItem("chalapathi_calendar");
    return local ? JSON.parse(local) : INITIAL_CALENDAR_DATA;
  });

  // Directories
  const [facultyData, setFacultyData] = useState<Record<string, DirectoryData>>(() => {
    const local = localStorage.getItem("chalapathi_faculty_data_v2");
    return local ? JSON.parse(local) : INITIAL_FACULTY_DATA;
  });

  const [boardData, setBoardData] = useState<Record<string, DirectoryData>>(() => {
    const local = localStorage.getItem("chalapathi_board_data");
    return local ? JSON.parse(local) : INITIAL_BOARD_DATA;
  });

  const [staffData, setStaffData] = useState<Record<string, DirectoryData>>(() => {
    const local = localStorage.getItem("chalapathi_staff_data");
    return local ? JSON.parse(local) : INITIAL_STAFF_DATA;
  });

  // Placements
  const [placementsContent, setPlacementsContent] = useState<PlacementsContent>(() => {
    const local = localStorage.getItem("chalapathi_placements");
    return local ? JSON.parse(local) : INITIAL_PLACEMENTS_CONTENT;
  });

  // Success Stories
  const [successStories, setSuccessStories] = useState<SuccessStory[]>(() => {
    const local = localStorage.getItem("chalapathi_success_stories");
    const parsed = local ? JSON.parse(local) : INITIAL_SUCCESS_STORIES;
    if (parsed && parsed.length > 0 && !parsed[0].skills) {
      localStorage.setItem("chalapathi_success_stories", JSON.stringify(INITIAL_SUCCESS_STORIES));
      return INITIAL_SUCCESS_STORIES;
    }
    return parsed;
  });

  // Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    const local = localStorage.getItem("chalapathi_hero_slides");
    if (!local) return INITIAL_HERO_SLIDES;
    try {
      const parsed = JSON.parse(local);
      return parsed.map((s: HeroSlide) => {
        if (s.title === "Chalapathi University" && s.subtitle === "WELCOMES YOU") {
          return { ...s, title: "", subtitle: "" };
        }
        return s;
      });
    } catch {
      return INITIAL_HERO_SLIDES;
    }
  });

  const recordSave = () => {
    const timeStr = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    setLastSavedTime(timeStr);
    localStorage.setItem("chalapathi_last_saved", timeStr);

    // Notify same-window components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("chalapathi_cms_updated", { detail: { timestamp: Date.now() } }));
      try {
        if ("BroadcastChannel" in window) {
          const ch = new BroadcastChannel("chalapathi_sync_channel");
          ch.postMessage({ type: "SYNC", timestamp: Date.now() });
          ch.close();
        }
      } catch (e) {}
    }
  };

  // Real-time synchronization listener across all open tabs and windows
  React.useEffect(() => {
    const handleSync = () => {
      try {
        const localSettings = localStorage.getItem("chalapathi_site_settings");
        if (localSettings) setSiteSettings({ ...DEFAULT_SITE_SETTINGS, ...JSON.parse(localSettings) });

        const localColors = localStorage.getItem("chalapathi_theme_colors");
        if (localColors) setThemeColors({ ...DEFAULT_THEME_COLORS, ...JSON.parse(localColors) });

        const localSections = localStorage.getItem("chalapathi_homepage_sections_v2");
        if (localSections) setHomepageSections(JSON.parse(localSections));

        const localNav = localStorage.getItem("chalapathi_navigation_menu");
        if (localNav) setNavigationMenu(JSON.parse(localNav));

        const localFooter = localStorage.getItem("chalapathi_footer_content");
        if (localFooter) setFooterContent(JSON.parse(localFooter));

        const localEnquiries = localStorage.getItem("chalapathi_enquiries");
        if (localEnquiries) setEnquiries(JSON.parse(localEnquiries));

        const localAnnounce = localStorage.getItem("chalapathi_announcements");
        if (localAnnounce) setAnnouncements(JSON.parse(localAnnounce));

        const localPrograms = localStorage.getItem("chalapathi_programs");
        if (localPrograms) setPrograms(JSON.parse(localPrograms));

        const localNews = localStorage.getItem("chalapathi_news_v3") || localStorage.getItem("chalapathi_news");
        if (localNews) setNews(JSON.parse(localNews));

        const localNewsConfig = localStorage.getItem("chalapathi_news_page_config");
        if (localNewsConfig) setNewsPageConfig(JSON.parse(localNewsConfig));

        const localEvents = localStorage.getItem("chalapathi_events_v3") || localStorage.getItem("chalapathi_events");
        if (localEvents) setEvents(JSON.parse(localEvents));

        const localAbout = localStorage.getItem("chalapathi_about_v2");
        if (localAbout) setAboutContent(JSON.parse(localAbout));

        const localCalendar = localStorage.getItem("chalapathi_calendar");
        if (localCalendar) setCalendarData(JSON.parse(localCalendar));

        const localFaculty = localStorage.getItem("chalapathi_faculty_data_v2");
        if (localFaculty) setFacultyData(JSON.parse(localFaculty));

        const localBoard = localStorage.getItem("chalapathi_board_data");
        if (localBoard) setBoardData(JSON.parse(localBoard));

        const localStaff = localStorage.getItem("chalapathi_staff_data");
        if (localStaff) setStaffData(JSON.parse(localStaff));

        const localPlacements = localStorage.getItem("chalapathi_placements");
        if (localPlacements) setPlacementsContent(JSON.parse(localPlacements));

        const localStories = localStorage.getItem("chalapathi_success_stories");
        if (localStories) setSuccessStories(JSON.parse(localStories));

        const localSlides = localStorage.getItem("chalapathi_hero_slides");
        if (localSlides) setHeroSlides(JSON.parse(localSlides));

        const localAcademic = localStorage.getItem("chalapathi_academic_structure");
        if (localAcademic) setAcademicStructure(JSON.parse(localAcademic));

        const localVideos = localStorage.getItem("chalapathi_campus_videos");
        if (localVideos) setCampusVideos(JSON.parse(localVideos));

        const localGallery = localStorage.getItem("chalapathi_campus_gallery");
        if (localGallery) setCampusGallery(JSON.parse(localGallery));

        const localBanners = localStorage.getItem("chalapathi_campus_banners");
        if (localBanners) setCampusBanners(JSON.parse(localBanners));

        const localCampusLife = localStorage.getItem("chalapathi_campus_life_content");
        if (localCampusLife) setCampusLifeContent(JSON.parse(localCampusLife));

        const lastSaved = localStorage.getItem("chalapathi_last_saved");
        if (lastSaved) setLastSavedTime(lastSaved);
      } catch (err) {
        console.error("Error syncing CMS state:", err);
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("chalapathi_cms_updated", handleSync);

    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        channel = new BroadcastChannel("chalapathi_sync_channel");
        channel.onmessage = () => handleSync();
      }
    } catch (e) {}

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("chalapathi_cms_updated", handleSync);
      if (channel) channel.close();
    };
  }, []);

  const updateSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
    localStorage.setItem("chalapathi_site_settings", JSON.stringify(settings));
    recordSave();
  };

  const updateThemeColors = (colors: ThemeColors) => {
    setThemeColors(colors);
    localStorage.setItem("chalapathi_theme_colors", JSON.stringify(colors));
    recordSave();
  };

  const updateHomepageSections = (sections: HomepageSectionConfig[]) => {
    setHomepageSections(sections);
    localStorage.setItem("chalapathi_homepage_sections_v2", JSON.stringify(sections));
    recordSave();
  };

  const updateNavigationMenu = (menu: NavMenuItem[]) => {
    setNavigationMenu(menu);
    localStorage.setItem("chalapathi_navigation_menu", JSON.stringify(menu));
    recordSave();
  };

  const updateFooterContent = (content: FooterContent) => {
    setFooterContent(content);
    localStorage.setItem("chalapathi_footer_content", JSON.stringify(content));
    recordSave();
  };

  const updateEnquiries = (leads: EnquiryLead[]) => {
    setEnquiries(leads);
    localStorage.setItem("chalapathi_enquiries", JSON.stringify(leads));
    recordSave();
  };

  const addEnquiry = (lead: Omit<EnquiryLead, "id" | "date">) => {
    const newLead: EnquiryLead = {
      ...lead,
      id: "ENQ-" + Date.now(),
      date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
      status: "New"
    };
    const updated = [newLead, ...enquiries];
    setEnquiries(updated);
    localStorage.setItem("chalapathi_enquiries", JSON.stringify(updated));
  };

  const updateAnnouncements = (list: Announcement[]) => {
    setAnnouncements(list);
    localStorage.setItem("chalapathi_announcements", JSON.stringify(list));
    recordSave();
  };

  const updatePrograms = (list: ProgramDetail[]) => {
    setPrograms(list);
    localStorage.setItem("chalapathi_programs", JSON.stringify(list));
    recordSave();
  };

  const updateNews = (list: NewsArticle[]) => {
    setNews(list);
    localStorage.setItem("chalapathi_news_v3", JSON.stringify(list));
    localStorage.setItem("chalapathi_news", JSON.stringify(list));
    recordSave();
  };

  const updateNewsPageConfig = (config: NewsPageConfig) => {
    setNewsPageConfig(config);
    localStorage.setItem("chalapathi_news_page_config", JSON.stringify(config));
    recordSave();
  };

  const updateEvents = (list: EventItem[]) => {
    setEvents(list);
    localStorage.setItem("chalapathi_events_v3", JSON.stringify(list));
    localStorage.setItem("chalapathi_events", JSON.stringify(list));
    recordSave();
  };

  const updateAboutContent = (content: AboutUsContent) => {
    setAboutContent(content);
    localStorage.setItem("chalapathi_about_v2", JSON.stringify(content));
    recordSave();
  };

  const updateCalendarData = (data: MonthCalendarData[]) => {
    setCalendarData(data);
    localStorage.setItem("chalapathi_calendar", JSON.stringify(data));
    recordSave();
  };

  const updateFacultyData = (data: Record<string, DirectoryData>) => {
    setFacultyData(data);
    localStorage.setItem("chalapathi_faculty_data_v2", JSON.stringify(data));
    recordSave();
  };

  const updateBoardData = (data: Record<string, DirectoryData>) => {
    setBoardData(data);
    localStorage.setItem("chalapathi_board_data", JSON.stringify(data));
    recordSave();
  };

  const updateStaffData = (data: Record<string, DirectoryData>) => {
    setStaffData(data);
    localStorage.setItem("chalapathi_staff_data", JSON.stringify(data));
    recordSave();
  };

  const updatePlacementsContent = (data: PlacementsContent) => {
    setPlacementsContent(data);
    localStorage.setItem("chalapathi_placements", JSON.stringify(data));
    recordSave();
  };

  const updateSuccessStories = (list: SuccessStory[]) => {
    setSuccessStories(list);
    localStorage.setItem("chalapathi_success_stories", JSON.stringify(list));
    recordSave();
  };

  // Academic Structure
  const [academicStructure, setAcademicStructure] = useState<AcademicStructure>(() => {
    try {
      const local = localStorage.getItem("chalapathi_academic_structure");
      if (local) {
        const parsed: AcademicStructure = JSON.parse(local);
        let updated = false;
        Object.keys(parsed).forEach(school => {
          Object.keys(parsed[school] || {}).forEach(dept => {
            parsed[school][dept] = (parsed[school][dept] || []).map(card => {
              if (!card.image) {
                updated = true;
                return { ...card, image: getFallbackCourseImage(card.label) };
              }
              return card;
            });
          });
        });
        if (updated) {
          localStorage.setItem("chalapathi_academic_structure", JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {}
    return DEFAULT_ACADEMIC_STRUCTURE;
  });

  // Campus Videos
  const [campusVideos, setCampusVideos] = useState<CampusVideoItem[]>(() => {
    const local = localStorage.getItem("chalapathi_campus_videos");
    return local ? JSON.parse(local) : DEFAULT_CAMPUS_VIDEOS;
  });

  // Campus Tour Config
  const [campusTour, setCampusTour] = useState<CampusTourConfig>(() => {
    const savedPoster = localStorage.getItem("chalapathi_campus_poster");
    const savedBadge = localStorage.getItem("chalapathi_campus_badge");
    const savedQuote = localStorage.getItem("chalapathi_campus_quote");
    const savedHeading = localStorage.getItem("chalapathi_campus_label");
    const savedSubtitle = localStorage.getItem("chalapathi_campus_subtitle");
    return {
      poster: savedPoster || DEFAULT_CAMPUS_TOUR.poster,
      badge: savedBadge || DEFAULT_CAMPUS_TOUR.badge,
      quote: savedQuote || DEFAULT_CAMPUS_TOUR.quote,
      heading: savedHeading || DEFAULT_CAMPUS_TOUR.heading,
      subtitle: savedSubtitle || DEFAULT_CAMPUS_TOUR.subtitle
    };
  });

  // Campus Gallery
  const [campusGallery, setCampusGallery] = useState<CampusGalleryItem[]>(() => {
    const local = localStorage.getItem("chalapathi_campus_gallery");
    return local ? JSON.parse(local) : DEFAULT_CAMPUS_GALLERY;
  });

  // Campus Banners
  const [campusBanners, setCampusBanners] = useState<CampusBannersConfig>(() => {
    const local = localStorage.getItem("chalapathi_campus_banners");
    return local ? JSON.parse(local) : DEFAULT_CAMPUS_BANNERS;
  });

  const updateAcademicStructure = (structure: AcademicStructure) => {
    setAcademicStructure(structure);
    localStorage.setItem("chalapathi_academic_structure", JSON.stringify(structure));
    recordSave();
  };

  const updateCampusVideos = (list: CampusVideoItem[]) => {
    setCampusVideos(list);
    localStorage.setItem("chalapathi_campus_videos", JSON.stringify(list));
    recordSave();
  };

  const updateCampusTour = (tour: CampusTourConfig) => {
    setCampusTour(tour);
    localStorage.setItem("chalapathi_campus_poster", tour.poster);
    localStorage.setItem("chalapathi_campus_badge", tour.badge);
    localStorage.setItem("chalapathi_campus_quote", tour.quote);
    if (tour.heading) localStorage.setItem("chalapathi_campus_label", tour.heading);
    if (tour.subtitle) localStorage.setItem("chalapathi_campus_subtitle", tour.subtitle);
    recordSave();
  };

  const updateCampusGallery = (list: CampusGalleryItem[]) => {
    setCampusGallery(list);
    localStorage.setItem("chalapathi_campus_gallery", JSON.stringify(list));
    recordSave();
  };

  const updateCampusBanners = (banners: CampusBannersConfig) => {
    setCampusBanners(banners);
    localStorage.setItem("chalapathi_campus_banners", JSON.stringify(banners));
    recordSave();
  };

  // Campus Life Pages Content
  const [campusLifeContent, setCampusLifeContent] = useState<CampusLifeContent>(() => {
    try {
      const local = localStorage.getItem("chalapathi_campus_life_content");
      if (local) {
        return { ...DEFAULT_CAMPUS_LIFE_CONTENT, ...JSON.parse(local) };
      }
    } catch (e) {
      console.error("Failed to parse campus life content", e);
    }
    return DEFAULT_CAMPUS_LIFE_CONTENT;
  });

  const updateCampusLifeContent = (content: CampusLifeContent) => {
    setCampusLifeContent(content);
    localStorage.setItem("chalapathi_campus_life_content", JSON.stringify(content));
    recordSave();
  };

  const updateCampusLifePage = (path: string, pageData: CampusLifePageData) => {
    setCampusLifeContent((prev) => {
      const updated = { ...prev, [path]: pageData };
      localStorage.setItem("chalapathi_campus_life_content", JSON.stringify(updated));
      return updated;
    });
    recordSave();
  };

  const updateHeroSlides = (list: HeroSlide[]) => {
    setHeroSlides(list);
    localStorage.setItem("chalapathi_hero_slides", JSON.stringify(list));
    recordSave();
  };

  // Admissions Content
  const [admissionsContent, setAdmissionsContent] = useState<AdmissionsContent>(() => {
    try {
      const local = localStorage.getItem("chalapathi_admissions_content");
      if (local) {
        return { ...DEFAULT_ADMISSIONS_CONTENT, ...JSON.parse(local) };
      }
    } catch (e) {
      console.error("Failed to parse admissions content", e);
    }
    return DEFAULT_ADMISSIONS_CONTENT;
  });

  const updateAdmissionsContent = (content: AdmissionsContent) => {
    setAdmissionsContent(content);
    localStorage.setItem("chalapathi_admissions_content", JSON.stringify(content));
    recordSave();
  };

  const resetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all CMS content to original university defaults? This will restore original website content.")) {
      localStorage.clear();
      setSiteSettings(DEFAULT_SITE_SETTINGS);
      setThemeColors(DEFAULT_THEME_COLORS);
      setHomepageSections(DEFAULT_HOMEPAGE_SECTIONS);
      setNavigationMenu(DEFAULT_NAV_MENU);
      setFooterContent(DEFAULT_FOOTER_CONTENT);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setPrograms(PROGRAMS_DATA);
      setAcademicStructure(DEFAULT_ACADEMIC_STRUCTURE);
      setNews(INITIAL_NEWS);
      setNewsPageConfig(DEFAULT_NEWS_PAGE_CONFIG);
      setEvents(INITIAL_EVENTS);
      setCampusVideos(DEFAULT_CAMPUS_VIDEOS);
      setCampusTour(DEFAULT_CAMPUS_TOUR);
      setCampusGallery(DEFAULT_CAMPUS_GALLERY);
      setCampusBanners(DEFAULT_CAMPUS_BANNERS);
      setCampusLifeContent(DEFAULT_CAMPUS_LIFE_CONTENT);
      setAboutContent(INITIAL_ABOUT_CONTENT);
      setCalendarData(INITIAL_CALENDAR_DATA);
      setFacultyData(INITIAL_FACULTY_DATA);
      setBoardData(INITIAL_BOARD_DATA);
      setStaffData(INITIAL_STAFF_DATA);
      setPlacementsContent(INITIAL_PLACEMENTS_CONTENT);
      setSuccessStories(INITIAL_SUCCESS_STORIES);
      setHeroSlides(INITIAL_HERO_SLIDES);
      setEnquiries(INITIAL_ENQUIRIES);
      setAdmissionsContent(DEFAULT_ADMISSIONS_CONTENT);
      recordSave();
    }
  };

  return (
    <DataContext.Provider value={{
      siteSettings,
      updateSiteSettings,
      admissionsContent,
      updateAdmissionsContent,
      campusLifeContent,
      updateCampusLifeContent,
      updateCampusLifePage,
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
      addEnquiry,
      announcements,
      programs,
      academicStructure,
      updateAcademicStructure,
      news,
      newsPageConfig,
      updateNewsPageConfig,
      events,
      campusVideos,
      updateCampusVideos,
      campusTour,
      updateCampusTour,
      campusGallery,
      updateCampusGallery,
      campusBanners,
      updateCampusBanners,
      aboutContent,
      calendarData,
      facultyData,
      boardData,
      staffData,
      placementsContent,
      successStories,
      heroSlides,
      updateAnnouncements,
      updatePrograms,
      updateNews,
      updateEvents,
      updateAboutContent,
      updateCalendarData,
      updateFacultyData,
      updateBoardData,
      updateStaffData,
      updatePlacementsContent,
      updateSuccessStories,
      updateHeroSlides,
      showAnnouncementsDrawer,
      setShowAnnouncementsDrawer,
      resetToDefaults,
      lastSavedTime
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
