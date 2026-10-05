import { CmsPage } from "../types/cms";

export const INITIAL_CMS_PAGES: CmsPage[] = [
  {
    id: "page_about_genesis",
    slug: "/about/genesis",
    name: "Genesis & Heritage",
    title: "Our Genesis - 30 Years of Institutional Excellence",
    type: "sections",
    shortDescription: "Discover the 30-year journey of Chalapathi University from vision to multidisciplinary excellence.",
    seoTitle: "Genesis & Heritage | Chalapathi University",
    seoDescription: "Explore the historic 30-year foundation and educational transformation of Chalapathi University in Guntur, Andhra Pradesh.",
    seoKeywords: "Chalapathi genesis, history, foundation, legacy, university milestones",
    status: "published",
    displayOrder: 1,
    showInNav: true,
    parentNav: "About",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-05T12:00:00.000Z",
    sections: [
      {
        id: "sec_gen_hero",
        type: "hero",
        title: "A Journey of Vision, Values & Transformation",
        subtitle: "From a vision rooted in knowledge to a future-ready multidisciplinary university driven by innovation, research, and global excellence.",
        badge: "OUR GENESIS",
        status: "published",
        order: 1,
        settings: {
          layout: "split",
          bgColor: "#072A6C",
          textColor: "#FFFFFF",
          buttonText: "Explore Programs",
          buttonLink: "/academics"
        },
        media: {
          url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop"
        }
      },
      {
        id: "sec_gen_stats",
        type: "statistics",
        title: "Three Decades of Educational Leadership",
        subtitle: "Key figures that define our institutional strength and community impact",
        status: "published",
        order: 2,
        settings: { columns: 4, layout: "grid" },
        items: [
          { id: "stat_1", title: "Years of Academic Excellence", statNumber: "30+", statLabel: "Legacy of Quality", iconName: "Award" },
          { id: "stat_2", title: "Global Alumni Network", statNumber: "25,000+", statLabel: "Alumni Worldwide", iconName: "Users" },
          { id: "stat_3", title: "Doctoral & Senior Faculty", statNumber: "400+", statLabel: "Expert Educators", iconName: "GraduationCap" },
          { id: "stat_4", title: "Recruiting Corporate Partners", statNumber: "350+", statLabel: "Top Companies", iconName: "Briefcase" }
        ]
      },
      {
        id: "sec_gen_timeline",
        type: "timeline",
        title: "Institutional Roadmap & Historic Milestones",
        subtitle: "Key landmark achievements shaping our evolution across three decades",
        status: "published",
        order: 3,
        settings: { layout: "list" },
        items: [
          { id: "time_1", year: "1995", title: "The Foundation Laid", description: "Establishment of Chalapathi Educational Society by visionaries committed to transformative higher education in Andhra Pradesh.", iconName: "Building" },
          { id: "time_2", year: "2004", title: "Engineering & Technology Campus", description: "Inauguration of the state-of-the-art Engineering & Technology complex featuring world-class laboratories.", iconName: "Cpu" },
          { id: "time_3", year: "2012", title: "Autonomous Status & NBA Accreditation", description: "Conferred autonomous institutional status with Tier-1 accreditations from national quality assessment councils.", iconName: "Award" },
          { id: "time_4", year: "2020", title: "Research & Innovation Incubators", description: "Establishment of advanced AI, IoT, and multidisciplinary research centers with high-throughput compute clusters.", iconName: "Sparkles" },
          { id: "time_5", year: "2025", title: "State University Conformation", description: "Elevated to full multidisciplinary State University status, offering global curricula across Engineering, Computing, and Management.", iconName: "GraduationCap" }
        ]
      },
      {
        id: "sec_gen_cta",
        type: "cta",
        title: "Be a Part of the Chalapathi Legacy",
        subtitle: "Admissions open for 2026-27 across Undergraduate, Postgraduate, and Doctoral research programmes.",
        status: "published",
        order: 4,
        settings: {
          bgColor: "#072A6C",
          buttonText: "Apply for Admission",
          buttonLink: "/admissions/apply",
          secondaryButtonText: "Contact Admissions",
          secondaryButtonLink: "/contact"
        }
      }
    ]
  },
  {
    id: "page_about_vision",
    slug: "/about/vision",
    name: "Vision & Mission",
    title: "Vision, Mission & Core Values",
    type: "sections",
    shortDescription: "The guiding principles, core values, and educational philosophy of Chalapathi University.",
    seoTitle: "Vision & Mission | Chalapathi University",
    seoDescription: "Learn about the mission, strategic vision, and institutional values empowering students at Chalapathi University.",
    seoKeywords: "vision, mission, values, chalapathi ethics, quality policy",
    status: "published",
    displayOrder: 2,
    showInNav: true,
    parentNav: "About",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-05T12:00:00.000Z",
    sections: [
      {
        id: "sec_vis_hero",
        type: "hero",
        title: "Guiding Principles for a Sustainable Future",
        subtitle: "Fostering academic rigor, research innovation, ethical leadership, and societal commitment.",
        badge: "OUR PURPOSE",
        status: "published",
        order: 1,
        settings: {
          layout: "split",
          bgColor: "#072A6C",
          textColor: "#FFFFFF"
        },
        media: {
          url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop"
        }
      },
      {
        id: "sec_vis_cards",
        type: "cards",
        title: "Vision & Mission Pillars",
        subtitle: "Our institutional blueprint for academic and societal transformation",
        status: "published",
        order: 2,
        settings: { columns: 2, layout: "grid" },
        items: [
          {
            id: "card_vis",
            title: "Our Vision",
            badge: "Aspiration",
            description: "To emerge as a premier multidisciplinary global university recognized for innovative research, transformative education, and ethical leaders who solve real-world challenges.",
            iconName: "Target"
          },
          {
            id: "card_mis",
            title: "Our Mission",
            badge: "Action",
            description: "To deliver cutting-edge curricula integrated with industry immersion, foster creative inquiry through state-of-the-art laboratories, and nurture socially conscious professionals.",
            iconName: "Compass"
          }
        ]
      },
      {
        id: "sec_val_cards",
        type: "cards",
        title: "Core Values of Chalapathi University",
        subtitle: "The six foundational pillars guiding every student, faculty member, and administrative leader",
        status: "published",
        order: 3,
        settings: { columns: 3, layout: "grid" },
        items: [
          { id: "val_1", title: "Academic Rigor", description: "Commitment to the highest standards of teaching, critical inquiry, and curriculum relevance.", iconName: "BookOpen" },
          { id: "val_2", title: "Integrity & Ethics", description: "Upholding transparency, honesty, and professional ethics in all academic and research endeavors.", iconName: "ShieldCheck" },
          { id: "val_3", title: "Innovation & Discovery", description: "Encouraging original thinking, multidisciplinary research, and entrepreneurial ventures.", iconName: "Sparkles" },
          { id: "val_4", title: "Inclusivity & Diversity", description: "Fostering an equitable campus environment where every learner thrives regardless of background.", iconName: "Users" },
          { id: "val_5", title: "Social Responsibility", description: "Engaging with rural communities, sustainability projects, and societal upliftment programs.", iconName: "Globe" },
          { id: "val_6", title: "Global Citizenship", description: "Preparing students with intercultural competence and globally recognized technical skills.", iconName: "Award" }
        ]
      }
    ]
  },
  {
    id: "page_about_leadership",
    slug: "/about/leadership",
    name: "Leadership & Governance",
    title: "University Leadership & Board of Governors",
    type: "directory",
    shortDescription: "Meet the visionary leadership driving the strategic growth and academic excellence of Chalapathi University.",
    seoTitle: "Leadership & Governance | Chalapathi University",
    seoDescription: "Discover the leadership team, Chancellor, Vice-Chancellor, Deans, and Board of Governors of Chalapathi University.",
    seoKeywords: "leadership, chancellor, vice chancellor, chairman, deans, chalapathi board",
    status: "published",
    displayOrder: 3,
    showInNav: true,
    parentNav: "About",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-05T12:00:00.000Z",
    sections: [
      {
        id: "sec_lead_hero",
        type: "hero",
        title: "Visionary Leadership for a Global Generation",
        subtitle: "Guided by eminent academicians, industry veterans, and researchers shaping modern higher education.",
        badge: "LEADERSHIP & GOVERNANCE",
        status: "published",
        order: 1,
        settings: {
          layout: "split",
          bgColor: "#072A6C",
          textColor: "#FFFFFF"
        }
      },
      {
        id: "sec_lead_chair",
        type: "person-profile",
        title: "Message from the Chairman",
        subtitle: "Sri Y. V. Anjaneyulu, Founder & President",
        badge: "CHAIRMAN'S DESK",
        status: "published",
        order: 2,
        settings: { layout: "split", imagePosition: "left" },
        media: {
          url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
          caption: "Sri Y. V. Anjaneyulu — Chairman"
        },
        content: "Education is not merely the acquisition of technical facts; it is the building of human character, resilience, and creative intellect. At Chalapathi University, our three-decade pursuit has always centered on empowering every aspiring youth with world-standard knowledge, cutting-edge laboratories, and strong ethical foundations. We welcome you to embark on a journey that defines the future of engineering, management, and technology."
      },
      {
        id: "sec_lead_dir",
        type: "leadership-directory",
        title: "Executive Officers & Deans",
        subtitle: "Distinguished academic and administrative leaders at Chalapathi University",
        status: "published",
        order: 3,
        settings: { columns: 3, layout: "grid" },
        items: [
          {
            id: "lead_1",
            title: "Dr. K. Rama Krishna",
            designation: "Vice Chancellor",
            department: "University Administration",
            description: "Ph.D. in Computer Science with over 28 years of academic leadership, former senior researcher at national premier institutions.",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"
          },
          {
            id: "lead_2",
            title: "Dr. M. Srinivasa Rao",
            designation: "Dean - Academics & Curriculum",
            department: "Academic Affairs",
            description: "Pioneered outcome-based learning and interdisciplinary engineering frameworks with 80+ Scopus publications.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop"
          },
          {
            id: "lead_3",
            title: "Dr. P. Venkata Lakshmi",
            designation: "Dean - Research & Development",
            department: "Research Directorate",
            description: "Recipient of prestigious DST grants with 14 international patents in VLSI and embedded intelligence.",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
          }
        ]
      }
    ]
  },
  {
    id: "page_about_advantage",
    slug: "/about/advantage",
    name: "Chalapathi Advantage",
    title: "The Chalapathi Advantage - Why Choose Us",
    type: "sections",
    shortDescription: "Explore what sets Chalapathi University apart: state-of-the-art infrastructure, AI labs, industry tie-ups, and stellar placements.",
    seoTitle: "The Chalapathi Advantage | Chalapathi University",
    seoDescription: "Discover why thousands of engineering and management aspirants choose Chalapathi University for their career transformation.",
    seoKeywords: "why choose chalapathi, advantage, campus facilities, placement record",
    status: "published",
    displayOrder: 4,
    showInNav: true,
    parentNav: "About",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-05T12:00:00.000Z",
    sections: [
      {
        id: "sec_adv_hero",
        type: "hero",
        title: "Distinctive Advantages of Chalapathi Education",
        subtitle: "A modern campus engineered to deliver world-class learning, industry certifications, and rapid career acceleration.",
        badge: "WHY CHALAPATHI",
        status: "published",
        order: 1,
        settings: {
          layout: "split",
          bgColor: "#072A6C",
          textColor: "#FFFFFF"
        }
      },
      {
        id: "sec_adv_cards",
        type: "cards",
        title: "Pillars of Institutional Distinction",
        subtitle: "Key strategic advantages experienced by every enrolled student",
        status: "published",
        order: 2,
        settings: { columns: 3, layout: "grid" },
        items: [
          { id: "adv_1", title: "Next-Gen AI & Tech Compute Labs", description: "Equipped with high-performance GPU clusters for Deep Learning, Data Science, and Robotics.", iconName: "Cpu", badge: "Infrastructure" },
          { id: "adv_2", title: "Global Industry Certifications", description: "Built-in curriculum certifications from AWS, Microsoft, Cisco, Google Cloud, and Oracle.", iconName: "Award", badge: "Curriculum" },
          { id: "adv_3", title: "Record 90%+ Placement Track", description: "Over 350+ MNCs hire on-campus with highest CTC reaching ₹32 LPA in tech domains.", iconName: "TrendingUp", badge: "Placements" },
          { id: "adv_4", title: "100% Doctoral Faculty Mentors", description: "Learn directly from researchers with active Scopus publications, patents, and live grants.", iconName: "GraduationCap", badge: "Mentorship" },
          { id: "adv_5", title: "Flexible Choice-Based Credit System", description: "Freedom to choose interdisciplinary minors, open electives, and honors degrees.", iconName: "BookOpen", badge: "Flexibility" },
          { id: "adv_6", title: "Vibrant Campus & Sports Complex", description: "Olympic-standard sports facilities, Wi-Fi campus, modern hostels, and 30+ student clubs.", iconName: "Building2", badge: "Campus Life" }
        ]
      }
    ]
  },
  {
    id: "page_academics_calendar",
    slug: "/academics/calendar",
    name: "Academic Calendar",
    title: "Academic Calendar & Semester Schedules",
    type: "table",
    shortDescription: "View key academic dates, semester start and end dates, examination schedules, and institutional holidays.",
    seoTitle: "Academic Calendar | Chalapathi University",
    seoDescription: "Official academic calendar and key dates for undergraduate and postgraduate courses at Chalapathi University.",
    seoKeywords: "academic calendar, semester dates, exams, holidays, chalapathi schedule",
    status: "published",
    displayOrder: 5,
    showInNav: true,
    parentNav: "Academics",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-05T12:00:00.000Z",
    sections: [
      {
        id: "sec_cal_hero",
        type: "hero",
        title: "Academic Calendar & Timelines",
        subtitle: "Key dates for the academic year 2026-27 including semester registrations, mid-term examinations, festivals, and end-semester tests.",
        badge: "ACADEMICS",
        status: "published",
        order: 1,
        settings: { layout: "full", bgColor: "#072A6C", textColor: "#FFFFFF" }
      },
      {
        id: "sec_cal_table",
        type: "table",
        title: "Semester Schedule (Odd & Even Semesters 2026-27)",
        subtitle: "Official milestones approved by the Academic Council",
        status: "published",
        order: 2,
        table: {
          name: "Academic Milestones 2026-27",
          columns: [
            { id: "event", label: "Academic Milestone", type: "text" },
            { id: "oddSem", label: "Odd Semester Date", type: "badge" },
            { id: "evenSem", label: "Even Semester Date", type: "badge" },
            { id: "notes", label: "Applicable Cohorts", type: "text" }
          ],
          rows: [
            { id: "r1", enabled: true, order: 1, cells: { event: "Commencement of Classes", oddSem: "July 15, 2026", evenSem: "January 04, 2027", notes: "All UG & PG Batches" } },
            { id: "r2", enabled: true, order: 2, cells: { event: "Mid-Term Examination I", oddSem: "September 07 - 12, 2026", evenSem: "February 22 - 27, 2027", notes: "Continuous Internal Assessment" } },
            { id: "r3", enabled: true, order: 3, cells: { event: "Mid-Term Examination II", oddSem: "November 02 - 07, 2026", evenSem: "April 12 - 17, 2027", notes: "Continuous Internal Assessment" } },
            { id: "r4", enabled: true, order: 4, cells: { event: "Practical & Laboratory Exams", oddSem: "November 16 - 21, 2026", evenSem: "April 26 - May 01, 2027", notes: "Departmental Labs" } },
            { id: "r5", enabled: true, order: 5, cells: { event: "End Semester Theory Exams", oddSem: "November 23 - Dec 10, 2026", evenSem: "May 05 - 22, 2027", notes: "University Board Exams" } },
            { id: "r6", enabled: true, order: 6, cells: { event: "Semester Break / Vacation", oddSem: "December 11 - Jan 03, 2027", evenSem: "May 24 - July 10, 2027", notes: "Internships / Vacations" } }
          ]
        }
      }
    ]
  },
  {
    id: "page_admissions_fees",
    slug: "/admissions/fees",
    name: "Fee Structure",
    title: "University Fee Structure & Payment Policies",
    type: "table",
    shortDescription: "Comprehensive fee structure for B.Tech, M.Tech, MCA, MBA, and Ph.D. programs for the 2026-27 batch.",
    seoTitle: "Fee Structure 2026-27 | Chalapathi University",
    seoDescription: "Check the annual tuition fees, hostel charges, and scholarship concessions for engineering and management degrees.",
    seoKeywords: "chalapathi fees, btech fee, mba fee, hostel fee, tuition payment",
    status: "published",
    displayOrder: 6,
    showInNav: true,
    parentNav: "Admissions",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-05T12:00:00.000Z",
    sections: [
      {
        id: "sec_fee_hero",
        type: "hero",
        title: "Transparent & Affordable Fee Structure",
        subtitle: "Quality global education with merit scholarships, flexible installment options, and zero hidden charges.",
        badge: "FEES & FINANCES",
        status: "published",
        order: 1,
        settings: { layout: "full", bgColor: "#072A6C", textColor: "#FFFFFF" }
      },
      {
        id: "sec_fee_table",
        type: "table",
        title: "Program-wise Tuition & Annual Fees (2026-27)",
        subtitle: "Tuition fees applicable for the complete four-year/two-year degree tracks",
        status: "published",
        order: 2,
        table: {
          name: "Program Fees",
          columns: [
            { id: "program", label: "Degree & Specialization", type: "text" },
            { id: "duration", label: "Duration", type: "badge" },
            { id: "tuition", label: "Annual Tuition Fee", type: "text" },
            { id: "eligibility", label: "Eligibility Criteria", type: "text" },
            { id: "action", label: "Apply Online", type: "link" }
          ],
          rows: [
            { id: "fee_1", enabled: true, order: 1, cells: { program: "B.Tech Computer Science & Engineering", duration: "4 Years", tuition: "₹1,25,000 / Year", eligibility: "10+2 with MPC (Min 50%)", action: "/admissions/apply" } },
            { id: "fee_2", enabled: true, order: 2, cells: { program: "B.Tech CSE (Artificial Intelligence & ML)", duration: "4 Years", tuition: "₹1,30,000 / Year", eligibility: "10+2 with MPC (Min 50%)", action: "/admissions/apply" } },
            { id: "fee_3", enabled: true, order: 3, cells: { program: "B.Tech CSE (Data Science)", duration: "4 Years", tuition: "₹1,25,000 / Year", eligibility: "10+2 with MPC (Min 50%)", action: "/admissions/apply" } },
            { id: "fee_4", enabled: true, order: 4, cells: { program: "B.Tech Electronics & Communication", duration: "4 Years", tuition: "₹1,10,000 / Year", eligibility: "10+2 with MPC (Min 45%)", action: "/admissions/apply" } },
            { id: "fee_5", enabled: true, order: 5, cells: { program: "M.Tech VLSI & Embedded Systems", duration: "2 Years", tuition: "₹90,000 / Year", eligibility: "B.Tech in relevant branch", action: "/admissions/apply" } },
            { id: "fee_6", enabled: true, order: 6, cells: { program: "Master of Business Administration (MBA)", duration: "2 Years", tuition: "₹95,000 / Year", eligibility: "Any UG Degree (Min 50%)", action: "/admissions/apply" } },
            { id: "fee_7", enabled: true, order: 7, cells: { program: "Master of Computer Applications (MCA)", duration: "2 Years", tuition: "₹85,000 / Year", eligibility: "BCA / B.Sc. with Maths", action: "/admissions/apply" } }
          ]
        }
      }
    ]
  },
  {
    id: "page_placements_stats",
    slug: "/placements/statistics",
    name: "Placement Records",
    title: "Placement Statistics & Corporate Partners",
    type: "sections",
    shortDescription: "Explore our outstanding track record of campus placements, top salary packages, and leading recruiters.",
    seoTitle: "Placement Statistics | Chalapathi University",
    seoDescription: "View salary packages, hiring trends, and premier global recruiters hiring engineering graduates from Chalapathi University.",
    seoKeywords: "placements, salary package, recruiters, ctc, hiring companies",
    status: "published",
    displayOrder: 7,
    showInNav: true,
    parentNav: "Placements",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-05T12:00:00.000Z",
    sections: [
      {
        id: "sec_plc_hero",
        type: "hero",
        title: "Unmatched Placement Outcomes",
        subtitle: "Bridging campus talent with global corporate leaders through rigorous pre-placement training and industry immersion.",
        badge: "CAREER LAUNCHPAD",
        status: "published",
        order: 1,
        settings: { layout: "split", bgColor: "#072A6C", textColor: "#FFFFFF" }
      },
      {
        id: "sec_plc_stats",
        type: "statistics",
        title: "Placement Highlights (2025-26)",
        subtitle: "Real numbers reflecting our student career success",
        status: "published",
        order: 2,
        settings: { columns: 4, layout: "grid" },
        items: [
          { id: "pstat_1", title: "Highest Package Offered", statNumber: "₹32 LPA", statLabel: "Top International Tech CTC", iconName: "Trophy" },
          { id: "pstat_2", title: "Average Salary Package", statNumber: "₹6.8 LPA", statLabel: "Across Engineering Cohorts", iconName: "TrendingUp" },
          { id: "pstat_3", title: "Placement Success Ratio", statNumber: "94%", statLabel: "Eligible Students Placed", iconName: "CheckCircle2" },
          { id: "pstat_4", title: "Recruiting Corporates", statNumber: "350+", statLabel: "On-Campus Recruiters", iconName: "Building" }
        ]
      }
    ]
  }
];
