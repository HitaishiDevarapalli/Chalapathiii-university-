"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, ChevronDown, Home, Calendar, BookOpen, Landmark, Info, Phone, ShieldCheck, UserPlus, FileText, UploadCloud, CreditCard, Clock, ShieldAlert, UserCheck, Scale, CalendarRange, GraduationCap, Mail, User, X, Globe, QrCode, Award, ChevronLeft } from "lucide-react";
import { ACADEMIC_PROGRAMS_STRUCTURE } from "../components/layout/Header";
import { useData, DEFAULT_CONTACT_PAGE_CONTENT } from "../context/DataContext";
import GlobalCertifications from "../components/sections/GlobalCertifications";
import { AdmissionsPortalView } from "../components/admissions/AdmissionsPortalView";
import { ApplyOnlineView } from "../components/admissions/ApplyOnlineView";
import ProgramDetailPage from "../components/academics/ProgramDetailPage";


const getProgramTimeline = (title: string) => {
  const isCse = title.toLowerCase().includes("cse") || title.toLowerCase().includes("computer") || title.toLowerCase().includes("intelligence") || title.toLowerCase().includes("data science");
  const isEce = title.toLowerCase().includes("ece") || title.toLowerCase().includes("electronics") || title.toLowerCase().includes("vlsi") || title.toLowerCase().includes("embedded");
  const isEee = title.toLowerCase().includes("eee") || title.toLowerCase().includes("electrical") || title.toLowerCase().includes("power") || title.toLowerCase().includes("grid");
  const isMech = title.toLowerCase().includes("mechanical") || title.toLowerCase().includes("mechatronics") || title.toLowerCase().includes("automobile") || title.toLowerCase().includes("manufacturing");
  const isCivil = title.toLowerCase().includes("civil") || title.toLowerCase().includes("structure") || title.toLowerCase().includes("construction");
  
  let coreYear1 = ["Engineering Math I & II", "Programming Fundamentals", "Applied Sciences", "Design Thinking & CAD"];
  let coreYear2 = ["Data Structures & Logic", "Circuit Theory & Devices", "Digital Electronics", "Object Oriented Paradigm"];
  let coreYear3 = ["Advanced Database Systems", "Network Communications", "Professional Core Electives", "Mini Project Lab"];
  let coreYear4 = ["Major Capstone Project", "Industrial Internships", "Global Immersion", "Corporate Placement Placement"];

  if (isCse) {
    coreYear1 = ["Python Programming", "Computational Mathematics", "Engineering Physics", "Creative Design thinking"];
    coreYear2 = ["Data Structures & Algorithms", "Computer Organization & Architecture", "Database Systems", "Discrete Mathematics"];
    coreYear3 = ["Operating Systems & Virtualization", "Computer Networks", "Software Engineering & QA", "Artificial Intelligence Core"];
    coreYear4 = ["Capstone Project & Research Thesis", "Full-stack Web Deployment", "Cloud Infrastructure Interfacing", "Secure Coding Practices"];
  } else if (isEce) {
    coreYear1 = ["Electric Circuit Analysis", "Applied Physics", "Differential Equations", "Electronic Workshops"];
    coreYear2 = ["Electronic Devices & Circuits", "Signals & Systems", "Digital Logic Design", "Electromagnetic Fields"];
    coreYear3 = ["Microcontrollers & Interfacing", "Digital Signal Processing", "Analog & Digital Communications", "VLSI Design Basics"];
    coreYear4 = ["Embedded System Design Lab", "Antenna & Microwave Systems", "Optical & Wireless Networks", "Major Industrial Project"];
  } else if (isEee) {
    coreYear1 = ["Fundamentals of Electric Circuits", "Engineering Chemistry", "Matrix Algebra & Calculus", "Basic Workshops"];
    coreYear2 = ["DC & AC Machines", "Power Systems Generation", "Electrical Measurements", "Network Analysis & Synthesis"];
    coreYear3 = ["Power Electronics & Converters", "Control Systems Engineering", "Power System Transmission", "Microprocessors"];
    coreYear4 = ["Smart Grid Systems & Integration", "Renewable Energy Systems", "High Voltage Engineering", "Major Project"];
  } else if (isMech) {
    coreYear1 = ["Engineering Drawing & Graphics", "Basic Thermodynamics", "Calculus & Geometry", "Materials Workshop"];
    coreYear2 = ["Strength of Materials", "Kinematics of Machinery", "Fluid Mechanics & Turbines", "Manufacturing Processes"];
    coreYear3 = ["Design of Machine Elements", "Heat & Mass Transfer", "Dynamics of Machinery", "CAD/CAM Integrated Systems"];
    coreYear4 = ["Mechatronics & Control Lab", "Automobile Engineering Systems", "Production & Operations Management", "Major Capstone Project"];
  } else if (isCivil) {
    coreYear1 = ["Engineering Mechanics", "Applied Geology & Soil", "Surveying & Mapping Basics", "Calculus & Physics"];
    coreYear2 = ["Strength of Materials", "Fluid Mechanics & Hydraulics", "Concrete Technology", "Structural Analysis I"];
    coreYear3 = ["Geotechnical Engineering", "Design of Reinforced Concrete Structures", "Environmental Engineering", "Transportation Infrastructure"];
    coreYear4 = ["Construction Planning & Estimating", "Design of Steel Structures", "Foundation Design & Analysis", "Major Capstone Project"];
  }

  return [
    {
      year: "Year 1",
      focus: "Foundational Skills",
      badges: ["Skill Courses", "Foundations"],
      courses: coreYear1,
      immersions: ["Social Internship", "Design Thinking Workshop", "Creative Communication"]
    },
    {
      year: "Year 2",
      focus: "Core Disciplines",
      badges: ["Major Core", "Minor Electives"],
      courses: coreYear2,
      immersions: ["Community Project", "Corporate Immersion Days", "Industry Internships"]
    },
    {
      year: "Year 3",
      focus: "Advanced Tracks",
      badges: ["Specialization", "Open Electives"],
      courses: coreYear3,
      immersions: ["Research Publications", "Professional Seminars", "Pre-Placement Training"]
    },
    {
      year: "Year 4",
      focus: "Capstone & Placement",
      badges: ["Major Projects", "Thesis / Placement"],
      courses: coreYear4,
      immersions: ["Capstone Project (6 Months)", "Global Immersion Track", "Corporate Placement Preparation"]
    }
  ];
};

// Helper to generate dynamic, rich content based on current path
const getPageContent = (path: string, programs: any[], newsPageConfig?: any) => {
  const cleanPath = path.toLowerCase().replace(/\/$/, "");

  if (cleanPath === "/news/latest") {
    return {
      title: newsPageConfig?.newsDirectoryTitle || "University Highlights",
      category: "News & Press",
      desc: newsPageConfig?.newsDirectorySubtitle || "Stay updated with the latest achievements, innovations, and stories from Chalapathi University.",
      body: <LatestNewsView />
    };
  }

  // News Article Pages
  if (cleanPath.startsWith("/news/")) {
    const article = [
      {
        slug: "ai-research-lab",
        title: "AI Research Lab Inaugurated on Campus",
        category: "Innovation",
        desc: "In partnership with global tech giants, the new laboratory features advanced machine learning compute nodes for research projects.",
        bodyText: "Today marks a historic milestone for Chalapathi University as we formally inaugurate our state-of-the-art Artificial Intelligence and Machine Learning Research Laboratory. Developed in close collaboration with global technology leaders, this research center is equipped with high-throughput multi-GPU processing systems and next-generation compute environments designed specifically for heavy workload deep learning and neural network model training. Under the direction of our senior AI research staff, undergraduate and doctoral scholars will collaborate on active research papers, smart industrial solutions, and healthcare diagnostics automation projects. Student cohorts will have access to real-time research fellowships, academic grants, and direct mentoring pipelines to build future computing technologies."
      },
      {
        slug: "smart-hackathon",
        title: "Engineering Students Win Smart Hackathon 2025",
        category: "Achievement",
        desc: "Our team developed a decentralized IoT mesh network algorithm to win first prize at the national technology showcase competition.",
        bodyText: "We are extremely proud to announce that the student research team from our Electronics and Computer Science Engineering departments has won the prestigious National Smart Systems Hackathon 2025. Over a grueling 36-hour continuous sprint in New Delhi, the team designed and prototyped a self-healing, decentralized IoT mesh network framework tailored for real-time disaster management communication. The algorithm maintains high packet-delivery rates even during severe node disruptions. The project won first prize, carrying a gold trophy and a cash reward of ₹1,00,000, standing out among 250 participating institutions nationwide."
      },
      {
        slug: "yoga-day",
        title: "International Yoga Day Celebrated with Great Enthusiasm",
        category: "Campus Life",
        desc: "Students and faculty participated in a special yoga session promoting health and wellness.",
        bodyText: "Students and faculty participated in a special yoga session promoting health, wellness, and mental clarity on International Yoga Day. The event was held in the main campus courtyard with over 500 participants practicing various asanas guided by certified yoga instructors."
      },
      {
        slug: "renewable-energy",
        title: "New Study on Renewable Energy Published in Scopus Journal",
        category: "Research",
        desc: "The research highlights the efficiency of hybrid models in optimizing sustainable energy.",
        bodyText: "A breakthrough research paper on renewable energy harvesting techniques has been published in a top-tier Scopus-indexed journal. The study highlights the implementation of hybrid solar-wind energy conservation models in microgrids."
      },
      {
        slug: "record-placements",
        title: "Record Placements in 2025 Batch",
        category: "Placements",
        desc: "Top recruiters from across the globe visited campus. Students secured roles in leading MNCs.",
        bodyText: "Chalapathi University registers outstanding placement results for the 2025 batch. Leading multinationals including tech and core giants participated, offering premium software engineering and core research positions to over 90% of eligible graduates."
      },
      {
        slug: "annual-convocation",
        title: "Annual Convocation 2025 Held with Grandeur",
        category: "Campus Life",
        desc: "Graduating students received degrees and medals at the colorful convocation ceremony.",
        bodyText: "The 2025 annual convocation ceremony was celebrated with grand success. Distinguished chief guests from corporate and academic bodies addressed the graduating cohort and distributed gold medals to academic toppers."
      },
      {
        slug: "admissions-open",
        title: "Admissions Open for Academic Year 2025-26",
        category: "Admissions",
        desc: "Applications are invited for UG, PG, and Ph.D. courses. Apply online today.",
        bodyText: "Admissions are officially open for the academic term 2025-2026. Prospective candidates can check qualifications, course fees, placement details, and apply online through our official portal."
      },
      {
        slug: "innovation-summit",
        title: "Annual Innovation & Entrepreneurship Summit",
        category: "Events",
        desc: "Empowering student founders, early-stage startups, and venture capitalists to collaborate on product solutions.",
        bodyText: "The Annual Innovation & Entrepreneurship Summit at City Chalapathi stands as our premier event dedicated to building startup ecosystems. Student groups will pitch prototypes directly to angel investors, regional venture capital firms, and incubator heads."
      },
      {
        slug: "mou-signed",
        title: "MoU Signed with Top Global Corporations for Placements",
        category: "Corporate Link",
        desc: "Enabling direct internship allocations, corporate-readiness workshops, and accelerated final semester student placements.",
        bodyText: "Chalapathi University has officially entered into a strategic Memorandum of Understanding (MoU) with leading multinational software and core engineering firms. This collaboration significantly strengthens our training and placement initiatives. Beginning this academic term, corporate mentors will conduct regular guest workshops on enterprise architectures and cloud DevOps technologies. The agreement also establishes a dedicated early-internship pipeline, allowing final-year engineering and management students to undertake structured industrial projects directly at corporate campuses, paving a fast-track pathway for high-compensation final placements."
      },
      {
        slug: "pharmacy-formulations",
        title: "New Pharmacy Research Formulations Published",
        category: "Research",
        desc: "Our department has published groundbreaking formulations on nano-carrier systems in high-impact medical journals.",
        bodyText: "The Department of Pharmaceutics at City Chalapathi has published a research breakthrough regarding target-oriented drug delivery systems. The research details a novel nano-carrier formulation that significantly increases the solubility and bioavailability of therapeutic drugs, offering potential applications for targeted anti-inflammatory treatments. Published in a highly respected international pharmaceutical journal, the research is the culmination of three years of rigorous laboratory analysis led by our postgraduate research scholars and senior faculty. This publication underscores our commitment to advancing pharmaceutical sciences on a global stage."
      },
      {
        slug: "global-education-fair",
        title: "Global Education Fair and Career Expo Hosts 30+ Universities",
        category: "International",
        desc: "Students interacted directly with global admission directors from US, UK, and European universities for postgraduate guidance.",
        bodyText: "We successfully hosted the annual Global Education fair and Career Expo on our central campus yesterday. The event hosted admissions directors and official representatives from over 30 leading universities across the United States, United Kingdom, Australia, and European Union countries. Hundreds of undergraduate students from final and pre-final semesters attended the fair to discuss entry requirements, IELTS/GRE waivers, postgraduate research opportunities, and scholarship applications directly with the university officials, opening new international education horizons for our graduates."
      },
      {
        slug: "annual-sports-meet",
        title: "Annual Sports Meet Kickstarts with Inter-Department Matches",
        category: "Campus Life",
        desc: "The campus cricket and basketball tournaments kicked off with participation from over 500 student athletes.",
        bodyText: "The annual campus sports tournament commenced yesterday with a spectacular torch run and flag hoisting ceremony at the main sports complex. Over 500 student athletes representing all engineering, pharmacy, and science departments are participating in active inter-department tournaments spanning cricket, football, basketball, track & field events, and indoor sports. The opening matches saw high-energy contests, fostering team spirit and sportsmanship across the campus community."
      },
      {
        slug: "sustainable-construction",
        title: "Workshop on Sustainable Construction Materials Conducted",
        category: "Workshop",
        desc: "Civil engineering experts held a hands-on session demonstrating self-healing concrete applications.",
        bodyText: "A comprehensive technical workshop on modern green construction materials was held by our Civil Engineering Department. Industry practitioners and structural engineers attended to demonstrate application techniques for self-healing concrete and fly-ash geopolymer composites. Students participated in concrete casting laboratories and stress testing, gaining valuable insight into eco-friendly engineering practices."
      },
      {
        slug: "alumni-meet",
        title: "Alumni Meet 2025 Welcomes Back Distinguished Graduates",
        category: "Alumni Connect",
        desc: "Over 200 alumni reconnected on campus, sharing industry insights and instituting new scholarship grants.",
        bodyText: "The campus yesterday welcomed back more than 200 distinguished alumni representing graduates from the past two decades. The meet provided a platform for alumni to interact with current student cohorts, share industrial insights, and discuss mentorship opportunities. The alumni association announced the setup of a new student innovation fund to support budding startup projects on campus."
      }
    ].find(x => cleanPath.endsWith(x.slug));

    if (article) {
      return {
        title: article.title,
        category: article.category,
        desc: article.desc,
        body: (
          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <p>{article.bodyText}</p>
            <div className="bg-[#072A6C]/5 border-l-4 border-[#072A6C] p-4 rounded-r-[8px] text-[12px] text-gray-700 italic">
              "We congratulate all participants, sponsors, and faculty members involved in this milestone announcement. Stay tuned for further updates."
            </div>
            <Link to="/news" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:text-[#072A6C] transition-colors mt-6">
              ← Back to News Center
            </Link>
          </div>
        )
      };
    }
  }

  // Event Detail Pages
  if (cleanPath.startsWith("/news/events/")) {
    const eventItem = [
      {
        slug: "air-taxi-demonstration",
        title: "Air Taxi Demonstration & Aviation Forum",
        category: "Aerospace",
        date: "17 Jul 2026",
        time: "09:30 AM Onwards",
        venue: "Aeronautics Hangar & Airfield Complex",
        desc: "An exclusive exhibition showcasing autonomous vertical take-off and landing (eVTOL) systems and the future of urban air mobility.",
        bodyText: "In collaboration with global aerospace research institutions and pioneering aviation companies, Chalapathi University is proud to host the Air Taxi Demonstration and Aviation Forum. This event features real-world test flights and static exhibitions of cutting-edge electric Vertical Take-Off and Landing (eVTOL) air taxi models. Attendees will engage with senior flight control engineers, software architects, and regulators discussing flight path safety, battery technology, and battery charging infrastructure. The afternoon panel sessions will cover career pathways in modern avionics, autonomous navigation algorithms, and smart city infrastructure integration."
      },
      {
        slug: "innovation-summit",
        title: "Annual Innovation & Entrepreneurship Summit",
        category: "Summit",
        date: "05 Aug 2026",
        time: "10:00 AM Onwards",
        venue: "Campus Incubation & Startup Block",
        desc: "Empowering student founders, early-stage startups, and venture capitalists to collaborate on next-generation software and product solutions.",
        bodyText: "The Annual Innovation & Entrepreneurship Summit at City Chalapathi stands as our premier event dedicated to building startup ecosystems. Student groups will pitch prototypes directly to angel investors, regional venture capital firms, and incubator heads. Keynote addresses from successful startup founders will share lessons on scaling, raising capital, and validating target markets. The summit hosts hands-on product design thinking sessions, intellectual property workshops for patent registrations, and networking tables connecting developers with business mentors."
      },
      {
        slug: "research-expo",
        title: "National Research Expo & Patent Showcase",
        category: "Research",
        date: "12 Sep 2026",
        time: "11:00 AM Onwards",
        venue: "Bio-Sciences Laboratory & Exhibition Hall",
        desc: "Showcasing student and faculty scientific publications, patent filings, and industry-sponsored research breakthroughs.",
        bodyText: "The National Research Expo is a celebrate-science event displaying active publications, doctoral research posters, and student innovations. Exhibitions cover structural engineering geopolymer research, target-oriented nano-carrier drug formulations, DST-funded smart irrigation devices, and artificial intelligence diagnostic apps. Senior scientists from national research institutes will evaluate student models and deliver talks on funding applications and research methodology."
      },
      {
        slug: "industry-connect",
        title: "Industry Connect: Corporate Leadership Panel",
        category: "Corporate",
        date: "03 Oct 2026",
        time: "10:00 AM Onwards",
        venue: "MBA Seminar Block Center",
        desc: "A networking panel hosting HR directors and tech executives to discuss recruitment trends and corporate-readiness skills.",
        bodyText: "Connecting student skills with market needs, the Industry Connect hosts executive panels from software, finance, and core manufacturing companies. Panel discussions will cover high-growth career tracks in artificial intelligence, full-stack architectures, and supply chain logistics. Representatives will detail summer internship opportunities and direct corporate placement guidelines."
      },
      {
        slug: "alumni-reunion",
        title: "Global Alumni Reunion & Endowment Gala",
        category: "Alumni Connect",
        date: "14 Nov 2026",
        time: "06:00 PM Onwards",
        venue: "University Grand Lawn Area",
        desc: "A formal dinner hosting alumni from top organizations globally, establishing student incubation and scholarship programs.",
        bodyText: "The Global Alumni Reunion welcomes back our distinguished graduates to campus for a formal evening of networking and celebration. Alumni will interact with faculty members and student groups to share career paths and industry trends. The evening will host the announcement of the Alumni Endowment Fund to support underprivileged student scholarships."
      }
    ].find(x => cleanPath.endsWith(x.slug));

    if (eventItem) {
      return {
        title: eventItem.title,
        category: eventItem.category,
        desc: eventItem.desc,
        body: (
          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <div className="bg-[#072A6C]/5 border-l-4 border-[#072A6C] p-5 rounded-r-[16px] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-[#072A6C] mb-6">
              <div>
                <span className="block text-gray-400 font-semibold uppercase text-[9px] mb-0.5">Date & Time</span>
                <span>{eventItem.date} — {eventItem.time}</span>
              </div>
              <div>
                <span className="block text-gray-400 font-semibold uppercase text-[9px] mb-0.5">Venue</span>
                <span>{eventItem.venue}</span>
              </div>
              <div>
                <span className="block text-gray-400 font-semibold uppercase text-[9px] mb-0.5">Category</span>
                <span className="text-[#F97316]">{eventItem.category}</span>
              </div>
            </div>

            <p>{eventItem.bodyText}</p>

            <div className="pt-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => alert(`Registration details for "${eventItem.title}" sent to counselor office.`)}
                className="h-11 px-8 bg-gradient-to-r from-[#D71920] to-[#b71217] text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 hover:shadow-md transition-all cursor-pointer"
              >
                Register For Event <ArrowRight size={14} />
              </button>
              <Link to="/news/events" className="h-11 px-6 border border-gray-200 hover:border-gray-300 text-gray-600 text-xs font-bold rounded-xl inline-flex items-center transition-all">
                Back to Events
              </Link>
            </div>
          </div>
        )
      };
    }
  }

  // About Pages
  if (cleanPath.startsWith("/about")) {
    if (cleanPath.includes("vision")) {
      return {
        title: "Vision & Mission",
        category: "About Us",
        desc: "Our core beliefs and guiding stars directing our future pathways of excellence.",
        body: <VisionView />
      };
    }
    if (cleanPath.includes("leadership")) {
      return {
        title: "Leadership & Governing Body",
        category: "About Us",
        desc: "Meet the visionary leaders directing the strategic progress of Chalapathi University.",
        body: <LeadershipView />
      };
    }
    if (cleanPath.includes("advantage")) {
      return {
        title: "The Chalapathi Advantage",
        category: "About Us",
        desc: "Discover why Chalapathi University stands out as a leading hub of educational excellence and innovation.",
        body: <ChalapathiAdvantage />
      };
    }
    return {
      title: "About Our Institution",
      category: "About Us",
      desc: "Chalapathi University is a leading autonomous engineering university dedicated to empowering tomorrow's innovators.",
      body: (
        <div className="space-y-6">
          <div className="space-y-6 text-gray-600 text-sm">
            <p className="font-light leading-relaxed">We believe in imparting hands-on, practical knowledge that equips our students to address real-world challenges. Explore our links to learn more about our vision, leadership, and glorious heritage.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
              <Link to="/about/genesis" className="bg-white border border-gray-200/80 rounded-2xl p-5 text-center hover:border-[#072A6C] transition-all shadow-sm block">
                <span className="block font-black text-[#072A6C] text-xs uppercase tracking-wider">Genesis & Heritage</span>
              </Link>
              <Link to="/about/vision" className="bg-white border border-gray-200/80 rounded-2xl p-5 text-center hover:border-[#072A6C] transition-all shadow-sm block">
                <span className="block font-black text-[#072A6C] text-xs uppercase tracking-wider">Vision & Mission</span>
              </Link>
              <Link to="/about/leadership" className="bg-white border border-gray-200/80 rounded-2xl p-5 text-center hover:border-[#072A6C] transition-all shadow-sm block">
                <span className="block font-black text-[#072A6C] text-xs uppercase tracking-wider">Governing Leadership</span>
              </Link>
              <Link to="/about/advantage" className="bg-white border border-gray-200/80 rounded-2xl p-5 text-center hover:border-[#072A6C] transition-all shadow-sm block">
                <span className="block font-black text-[#072A6C] text-xs uppercase tracking-wider">Chalapathi Advantage</span>
              </Link>
            </div>
          </div>
        </div>
      )
    };
  }

  // Academics Pages
  if (cleanPath.startsWith("/academics")) {
    const slug = cleanPath.replace("/academics/", "").replace(/\/$/, "");
    const reservedRoutes = ["schools", "departments", "calendar", "flexibilities", "programmes", "grading", "degrees", "electives", "rules", "teaching", "certifications", "bos", "computer-science", "artificial-intelligence", "data-science"];
    
    // Check if this is a program detail route
    if (slug && !reservedRoutes.includes(slug)) {
      const matchedProgram = programs.find(p => p.slug === slug || cleanPath.endsWith(p.slug));
      return {
        title: matchedProgram ? matchedProgram.title : `About ${slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}`,
        category: "Academics",
        desc: matchedProgram ? matchedProgram.desc : "Academic program information, curriculum, faculty, laboratories, and career prospects.",
        body: <ProgramDetailPage slug={matchedProgram ? matchedProgram.slug : slug} defaultData={matchedProgram} />
      };
    }

    if (cleanPath.includes("calendar")) {
      return {
        title: "Academic Calendar",
        category: "Academics",
        desc: "Schedule of semesters, internal assessments, holidays, and examination blocks for the academic term.",
        body: <AcademicCalendar />
      };
    }
    if (cleanPath.includes("certifications")) {
      return {
        title: "Global Certifications",
        category: "Academics",
        desc: "Graduate with internationally respected certifications that complement your academic degree.",
        body: <GlobalCertifications />
      };
    }
    if (cleanPath.includes("flexibilities")) {
      return {
        title: "Academic Flexibilities",
        category: "Academics",
        desc: "Autonomous credit choices, minor streams, honors degrees, and student transfers.",
        body: <AcademicFlexibilities />
      };
    }
    if (cleanPath.includes("programmes")) {
      return {
        title: "Programmes Offered",
        category: "Academics",
        desc: "List of approved B.Tech, M.Tech, MCA, MBA, and Pharmacy programs.",
        body: (
          <div className="space-y-8 text-gray-600 text-sm font-[var(--font-poppins)]">
            <p className="text-sm font-light leading-relaxed">
              We offer undergraduate and postgraduate courses affiliated and accredited for premium industrial placements.
            </p>
            
            <div className="space-y-6">
              {Object.entries(ACADEMIC_PROGRAMS_STRUCTURE).map(([school, depts]) => (
                <div key={school} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-[#072A6C] mb-4 pb-2 border-b border-gray-100 uppercase tracking-wider">
                    {school}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(depts).map(([dept, courses]) => {
                      const isPg = (label: string) => {
                        const l = label.toLowerCase();
                        return l.startsWith("m.tech") || l.startsWith("mca") || l.startsWith("ph.d") || l.startsWith("mba") || l.startsWith("m.pharm") || l.includes("postgraduate") || l.includes("doctoral");
                      };
                      const ugCourses = courses.filter(c => !isPg(c.label));
                      const pgCourses = courses.filter(c => isPg(c.label));

                      return (
                        <div key={dept} className="space-y-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100/80">
                          <h4 className="text-xs font-black text-[#072A6C] tracking-wider uppercase">{dept}</h4>
                          
                          {ugCourses.length > 0 && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Undergraduate</span>
                              <div className="flex flex-col gap-1.5 pl-1.5">
                                {ugCourses.map((course) => {
                                  const slug = course.to.split("/").pop();
                                  const matched = programs.find(p => p.slug === slug);
                                  const displayLabel = matched ? matched.title : course.label;
                                  return (
                                    <Link
                                      key={course.label}
                                      to={course.to}
                                      className="text-xs font-medium text-gray-600 hover:text-[#D4AF37] transition-colors leading-relaxed flex items-center gap-1.5 group"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#D4AF37] transition-colors" />
                                      {displayLabel}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {pgCourses.length > 0 && (
                            <div className="space-y-1 mt-2">
                              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Postgraduate</span>
                              <div className="flex flex-col gap-1.5 pl-1.5">
                                {pgCourses.map((course) => {
                                  const slug = course.to.split("/").pop();
                                  const matched = programs.find(p => p.slug === slug);
                                  const displayLabel = matched ? matched.title : course.label;
                                  return (
                                    <Link
                                      key={course.label}
                                      to={course.to}
                                      className="text-xs font-medium text-gray-600 hover:text-[#D4AF37] transition-colors leading-relaxed flex items-center gap-1.5 group"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-[#D4AF37] transition-colors" />
                                      {displayLabel}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Global Certifications Section (Full Width Breakout) */}
            <div className="mt-20 w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
              <GlobalCertifications />
            </div>

          </div>
        )
      };
    }
    if (cleanPath.includes("grading")) {
      return {
        title: "Grading System",
        category: "Academics",
        desc: "Cumulative Grade Point Average (CGPA) scale and credit evaluation metrics.",
        body: <AcademicGradingSystem />
      };
    }
    if (cleanPath.includes("degrees")) {
      return {
        title: "Award of Degrees",
        category: "Academics",
        desc: "Eligibility conditions for degree distributions, graduation convocations, and transcripts.",
        body: <AwardOfDegrees />
      };
    }
    if (cleanPath.includes("rules")) {
      return {
        title: "Rules & Regulations",
        category: "Academics",
        desc: "Academic code of conduct, attendance thresholds, and campus compliance standards.",
        body: <AcademicRulesRegulations />
      };
    }
    if (cleanPath.includes("teaching")) {
      return {
        title: "Teaching & Evaluation",
        category: "Academics",
        desc: "Outcome-based education framework, continuous assessment marks, and end exams.",
        body: <TeachingEvaluation />
      };
    }
    if (cleanPath.startsWith("/academics/bos/")) {
      const slug = cleanPath.replace("/academics/bos/", "");
      return {
        title: "Department Faculty List",
        category: "Academics",
        desc: "Department Board of Studies Members and Faculty Directory.",
        body: <DepartmentFacultyView slug={slug} />
      };
    }
    if (cleanPath.includes("bos")) {
      return {
        title: "Board of Studies (BOS)",
        category: "Academics",
        desc: "Academic advisory council consisting of university deans, industry veterans, and subject experts.",
        body: <BOSMembers />
      };
    }

    if (cleanPath.includes("computer-science")) {
      return {
        title: "Computer Science & Engineering",
        category: "Academics",
        desc: "Empowering next-generation developers, software engineers, and technology leaders.",
        body: (
          <div className="space-y-6 text-gray-600 text-sm">
            <p>Our curriculum covers fundamental computation structures, databases, algorithms, web dev, and distributed networks. We feature advanced labs with dedicated high-performance workstations.</p>
            <h4 className="text-[#072A6C] font-extrabold text-sm">Core Focus Areas</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="bg-gray-100 rounded-lg p-3 text-center text-xs font-semibold text-gray-700">Full Stack Dev</div>
              <div className="bg-gray-100 rounded-lg p-3 text-center text-xs font-semibold text-gray-700">Cloud Computing</div>
              <div className="bg-gray-100 rounded-lg p-3 text-center text-xs font-semibold text-gray-700">Cybersecurity</div>
              <div className="bg-gray-100 rounded-lg p-3 text-center text-xs font-semibold text-gray-700">Database Systems</div>
            </div>
          </div>
        )
      };
    }
    if (cleanPath.includes("artificial-intelligence")) {
      return {
        title: "Artificial Intelligence & ML",
        category: "Academics",
        desc: "Unlocking automation, predictive modeling, and intelligent agent systems.",
        body: (
          <div className="space-y-6 text-gray-600 text-sm">
            <p>Learn machine learning, neural networks, natural language processing, and deep learning libraries. Guided research under professors actively published in IEEE conferences.</p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-xs text-blue-800">
              Note: This program requires mathematical aptitude in Linear Algebra and Probability.
            </div>
          </div>
        )
      };
    }
    if (cleanPath.includes("data-science")) {
      return {
        title: "Data Science",
        category: "Academics",
        desc: "Transforming big data into actionable insights and strategic decisions.",
        body: (
          <div className="space-y-6 text-gray-600 text-sm">
            <p>Curriculum structured around statistics, data visualization, Hadoop pipelines, and predictive analytics modeling using Python and R.</p>
          </div>
        )
      };
    }
    return {
      title: "Academics & Schools",
      category: "Academics",
      desc: "Comprehensive engineering, science, and diploma training pathways.",
      body: (
        <div className="space-y-6">
          <p className="text-gray-600 text-sm">Choose from our specialized undergraduate and postgraduate branches of study designed to secure industry placement.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <Link to="/academics/computer-science" className="bg-white border border-gray-100 p-5 rounded-[16px] shadow-sm transition-all block">
              <h4 className="font-extrabold text-[#072A6C] text-sm">Computer Science & Engineering</h4>
              <p className="text-xs text-gray-500 mt-2">Explore algorithms, development, and network systems.</p>
            </Link>
            <Link to="/academics/artificial-intelligence" className="bg-white border border-gray-100 p-5 rounded-[16px] shadow-sm transition-all block">
              <h4 className="font-extrabold text-[#072A6C] text-sm">AI & Machine Learning</h4>
              <p className="text-xs text-gray-500 mt-2">Train intelligent models and predictive automated systems.</p>
            </Link>
            <Link to="/academics/data-science" className="bg-white border border-gray-100 p-5 rounded-[16px] shadow-sm hover:shadow-md transition-all block">
              <h4 className="font-extrabold text-[#072A6C] text-sm">Data Science</h4>
              <p className="text-xs text-gray-500 mt-2">Mine data streams and generate critical business analytics.</p>
            </Link>
          </div>
          
          {/* Global Certifications Section (Full Width Breakout) */}
          <div className="mt-20 w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
            <GlobalCertifications />
          </div>
        </div>
      )
    };
  }

  // Admissions Pages
  if (cleanPath.startsWith("/admissions")) {
    if (cleanPath.includes("undergraduate")) {
      return {
        title: "Undergraduate Admissions (B.Tech / B.Pharm)",
        category: "Admissions",
        desc: "Build a solid engineering or pharmacy foundation with our premium 4-year undergraduate programs.",
        body: (
          <div className="space-y-6 text-gray-600 text-sm mt-4">
            <p>We offer undergraduate programs designed to cultivate critical thinking, technical expertise, and leadership skills.</p>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
              <h4 className="font-extrabold text-[#072A6C] mb-2">Eligibility Criteria</h4>
              <p className="text-xs text-gray-500 leading-relaxed">Candidates must have completed 10+2 with Physics, Chemistry, and Mathematics (or Biology for Pharmacy) with a minimum of 50% marks. Admissions are based on merit ranks in state-level or national engineering/pharmacy entrance exams.</p>
            </div>
            <Link to="/admissions/apply" className="h-10 px-6 bg-[#D4AF37] hover:bg-[#C9A84C] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-sm transition-all w-fit">Apply Online <ArrowRight size={14} /></Link>
          </div>
        )
      };
    }
    if (cleanPath.includes("postgraduate")) {
      return {
        title: "Postgraduate Admissions (M.Tech / MBA / MCA)",
        category: "Admissions",
        desc: "Specialize and accelerate your career with our industry-aligned PG curricula.",
        body: (
          <div className="space-y-6 text-gray-600 text-sm mt-4">
            <p>Advance your professional journey with our tailored postgraduate engineering, computer application, and business management courses.</p>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
              <h4 className="font-extrabold text-[#072A6C] mb-2">Eligibility Criteria</h4>
              <p className="text-xs text-gray-500 leading-relaxed">A Bachelor's degree (B.Tech, BCA, B.Sc, B.Com, or B.A) in relevant streams with at least 50% marks is required. Admission is granted based on qualifying scores in national or university-level PG entrance tests.</p>
            </div>
            <Link to="/admissions/apply" className="h-10 px-6 bg-[#D4AF37] hover:bg-[#C9A84C] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-sm transition-all w-fit">Apply Online <ArrowRight size={14} /></Link>
          </div>
        )
      };
    }
    if (cleanPath.includes("apply")) {
      return {
        title: "Apply Online",
        category: "Admissions",
        desc: "Start your journey today. Fill out our online application form to secure your seat.",
        hideHeader: true,
        body: <ApplyOnlineView />
      };
    }
    if (cleanPath.includes("fees")) {
      return {
        title: "Academic Fee Structure",
        category: "Admissions",
        desc: "Transparent and competitive tuition fee details across all core streams.",
        body: <FeesView />
      };
    }
    if (cleanPath.includes("scholarships")) {
      return {
        title: "Scholarships & Merit Schemes",
        category: "Admissions",
        desc: "Ensuring financial need never deters brilliant academic potential.",
        body: <ScholarshipsView />
      };
    }
    return {
      title: "Admissions Portal",
      category: "Admissions",
      desc: "Enrollment processes, eligibility guidelines, fee charts, and student aids.",
      body: <AdmissionsPortalView />
    };
  }

  // Management Pages
  if (cleanPath.startsWith("/management")) {
    if (cleanPath.includes("board-members")) {
      return {
        title: "Board of Governors",
        category: "Management",
        desc: "Meet the visionary trustees and governing council driving Chalapathi's strategic excellence.",
        body: <BoardDirectory />
      };
    }
    if (cleanPath.includes("faculty")) {
      return {
        title: "Our Esteemed Faculty",
        category: "Management",
        desc: "Experienced professors, industry scholars, and dedicated research guides.",
        body: <FacultyDirectory />
      };
    }
    if (cleanPath.includes("staff")) {
      return {
        title: "Administrative & Technical Staff",
        category: "Management",
        desc: "Our supportive team ensuring smooth administrative operations and advanced laboratory maintenance.",
        body: <StaffDirectory />
      };
    }
    return {
      title: "Management Directory",
      category: "Management",
      desc: "Access details regarding Chalapathi's governing body, faculty members, and campus administrative staff.",
      body: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Link to="/management/board-members" className="bg-white border border-gray-100 p-6 rounded-[16px] shadow-sm flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px] transition-transform text-left">
            <h4 className="font-bold text-[#072A6C] text-sm">Board Members</h4>
            <span className="text-xs text-[#D4AF37] flex items-center gap-1">Governing council trustees <ArrowRight size={12} /></span>
          </Link>
          <Link to="/management/faculty" className="bg-white border border-gray-100 p-6 rounded-[16px] shadow-sm flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px] transition-transform text-left">
            <h4 className="font-bold text-[#072A6C] text-sm">Faculty Members</h4>
            <span className="text-xs text-[#D4AF37] flex items-center gap-1">Professors & researchers <ArrowRight size={12} /></span>
          </Link>
          <Link to="/management/staff" className="bg-white border border-gray-100 p-6 rounded-[16px] shadow-sm flex flex-col justify-between min-h-[140px] hover:translate-y-[-2px] transition-transform text-left">
            <h4 className="font-bold text-[#072A6C] text-sm">Administrative Staff</h4>
            <span className="text-xs text-[#D4AF37] flex items-center gap-1">Technical & office support <ArrowRight size={12} /></span>
          </Link>
        </div>
      )
    };
  }

  // Placements Pages
  if (cleanPath.startsWith("/placements")) {
    return {
      title: "Placements & Career Development",
      category: "Placements",
      desc: "Empowering careers and shaping global leaders through robust industry ecosystems.",
      body: <PlacementsView />,
      hideHeader: true
    };
  }

  // Research Pages
  if (cleanPath.startsWith("/research")) {
    return {
      title: "Research & Innovation",
      category: "Research",
      desc: "Driving patent submissions, research sponsorships, and scientific breakthroughs.",
      body: (
        <div className="space-y-6 text-gray-600 text-sm">
          <p>We support active research communities. Faculty members are currently guiding projects funded by DST, AICTE, and local government departments.</p>
        </div>
      )
    };
  }

  // Campus Life Pages
  if (cleanPath.startsWith("/campus-life")) {
    if (cleanPath.includes("hostels")) {
      return {
        title: "University Hostels & Accommodation",
        category: "Campus Life",
        desc: "Comfortable, safe, and modern residential facilities for students.",
        body: (
          <div className="space-y-6 text-gray-600 text-sm mt-4">
            <p>City Chalapathi University provides excellent residential facilities with home-like comfort, strict security, and nutritious dining options.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                <h4 className="font-extrabold text-[#072A6C] mb-2">Boys Hostel</h4>
                <p className="text-xs text-gray-500 leading-relaxed">Spacious rooms, high-speed Wi-Fi, recreation hall, and dedicated warden. Gym and sports facilities are situated nearby.</p>
              </div>
              <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
                <h4 className="font-extrabold text-[#072A6C] mb-2">Girls Hostel</h4>
                <p className="text-xs text-gray-500 leading-relaxed">24/7 security surveillance, cozy study spaces, laundry services, and healthcare facilities with an on-call doctor.</p>
              </div>
            </div>
          </div>
        )
      };
    }
    if (cleanPath.includes("library")) {
      return {
        title: "Central Library & Information Center",
        category: "Campus Life",
        desc: "A vast repository of knowledge featuring digital archives, journals, and study wings.",
        body: (
          <div className="space-y-6 text-gray-600 text-sm mt-4">
            <p>Our state-of-the-art Central Library spans multiple floors and hosts thousands of print books, national/international journals, and digital research databases.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm text-center">
                <h5 className="font-bold text-[#072A6C] text-lg">50,000+</h5>
                <p className="text-xs text-gray-400">Printed Volumes</p>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm text-center">
                <h5 className="font-bold text-[#072A6C] text-lg">200+</h5>
                <p className="text-xs text-gray-400">Journal Subscriptions</p>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm text-center">
                <h5 className="font-bold text-[#072A6C] text-lg">1,500+</h5>
                <p className="text-xs text-gray-400">E-Journals (IEEE/Elsevier)</p>
              </div>
            </div>
          </div>
        )
      };
    }
    if (cleanPath.includes("sports")) {
      return {
        title: "Sports & Physical Education",
        category: "Campus Life",
        desc: "Nurturing fitness, teamwork, and athletic excellence through state-of-the-art sports facilities.",
        body: (
          <div className="space-y-6 text-gray-600 text-sm mt-4">
            <p>We encourage student fitness with indoor and outdoor complexes, expert coaching staff, and regular inter-university tournaments.</p>
            <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
              <h4 className="font-extrabold text-[#072A6C] mb-2">Our Sports Facilities Include:</h4>
              <ul className="list-disc list-inside space-y-2 text-xs text-gray-500">
                <li>Athletic Track & Football Ground</li>
                <li>Standard Basketball & Tennis Courts</li>
                <li>Cricket Practice Nets</li>
                <li>Indoor Badminton courts & Table Tennis Arena</li>
                <li>Modern Gymnasium with certified trainers</li>
              </ul>
            </div>
          </div>
        )
      };
    }
    if (cleanPath.includes("clubs")) {
      return {
        title: "Student Clubs & Societies",
        category: "Campus Life",
        desc: "Fostering creativity, leadership, and personal growth outside the classroom.",
        body: (
          <div className="space-y-6 text-gray-600 text-sm mt-4">
            <p>From technical coding clubs to vibrant theater and art societies, students have many options to express their passions and develop leadership skills.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <h5 className="font-bold text-[#072A6C] text-xs">Coding & Robotics Club</h5>
                <p className="text-[11px] text-gray-400 mt-1">Hackathons, build competitions, and artificial intelligence workshops.</p>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <h5 className="font-bold text-[#072A6C] text-xs">Cultural & Arts Association</h5>
                <p className="text-[11px] text-gray-400 mt-1">Music bands, traditional dance groups, theater clubs, and annual festival organization.</p>
              </div>
            </div>
          </div>
        )
      };
    }
    if (cleanPath.includes("smart-classrooms")) {
      return {
        title: "Smart Classrooms",
        category: "Campus Life",
        desc: "Interactive learning environments equipped with modern digital tools.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Our classrooms are designed with dynamic display systems, visualizers, and interactive projectors to support immersive learning paradigms.</p>
          </div>
        )
      };
    }
    if (cleanPath.includes("laboratories")) {
      return {
        title: "Laboratories & Research Centres",
        category: "Campus Life",
        desc: "Advanced domain-specific facilities for practical learning and R&D projects.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Explore engineering, pharmacy, and computer labs featuring cutting-edge simulation software, professional instruments, and robust data clusters.</p>
          </div>
        )
      };
    }
    if (cleanPath.includes("cafeteria")) {
      return {
        title: "Cafeteria & Dining Hall",
        category: "Campus Life",
        desc: "Nutritious, hygienic food and popular hangout spaces on campus.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Enjoy a wide variety of vegetarian dining choices prepared under strict quality guidelines to support students' daily nutritional requirements.</p>
          </div>
        )
      };
    }
    if (cleanPath.includes("transportation")) {
      return {
        title: "Transportation Network",
        category: "Campus Life",
        desc: "Excellent connectivity covering Guntur, Vijayawada, and surrounding regions.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Our fleet of GPS-enabled university buses ensures secure and punctual daily transit for all commuting students and staff members.</p>
          </div>
        )
      };
    }
    if (cleanPath.includes("wifi")) {
      return {
        title: "Wi-Fi Campus Network",
        category: "Campus Life",
        desc: "High-speed wireless broadband coverage across the entire campus.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Students enjoy secure, high-bandwidth connection access in all academic blocks, common lounges, residential hostels, and library corridors.</p>
          </div>
        )
      };
    }
    if (cleanPath.includes("health-centre")) {
      return {
        title: "University Health Centre",
        category: "Campus Life",
        desc: "Primary care, emergency medical support, and student wellness counseling.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Our medical center is staffed with resident nurses, on-call physicians, and has critical transport services prepared for emergency situations.</p>
          </div>
        )
      };
    }
    if (cleanPath.includes("innovation-hub")) {
      return {
        title: "Innovation Hub & Incubation Center",
        category: "Campus Life",
        desc: "Nurturing student startups, technology transfers, and intellectual property portfolios.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Providing working desk environments, mentor panels, patent assistance, and seed funding support for promising student ventures.</p>
          </div>
        )
      };
    }
    if (cleanPath.includes("safety")) {
      return {
        title: "Campus Safety & Security",
        category: "Campus Life",
        desc: "24/7 campus surveillance, strict gate policies, and rapid response units.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Creating a safe educational ecosystem with constant patrols, digital access controls, and strict compliance protocols.</p>
          </div>
        )
      };
    }
    if (cleanPath.includes("nss-ncc")) {
      return {
        title: "NSS & NCC Wings",
        category: "Campus Life",
        desc: "Fostering discipline, leadership, patriotism, and social service responsibilities.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Engage in blood donation camps, environmental cleanups, disaster relief drives, and national integration training programs.</p>
          </div>
        )
      };
    }
    if (cleanPath.includes("grievance-cell")) {
      return {
        title: "Student Grievance Cell",
        category: "Campus Life",
        desc: "A transparent mechanism for addressing student feedback, complaints, and requests.",
        body: (
          <div className="space-y-4 text-gray-600 text-sm mt-4">
            <p>Ensuring an unbiased environment where all student queries, academic appeals, or amenity concerns are addressed promptly.</p>
          </div>
        )
      };
    }
    return {
      title: "Campus Life & Amenities",
      category: "Campus Life",
      desc: "Explore details of hostels, libraries, dining halls, and student activity clubs.",
      body: (
        <div className="space-y-6 text-gray-600 text-sm mt-4">
          <p>A balanced academic life requires dynamic extracurricular involvement. We feature hostels, dining amenities, athletic playgrounds, and student association programs.</p>
        </div>
      )
    };
  }

  // Contact Pages
  if (cleanPath.startsWith("/contact")) {
    return {
      title: "Contact Us",
      category: "Support",
      desc: "Connect with admissions, administration, and campus advisors directly.",
      body: <ContactUsView />,
      hideHeader: true
    };
  }

  // Legal / Policy Pages
  if (cleanPath.startsWith("/privacy-policy")) {
    return {
      title: "Privacy Policy",
      category: "Legal & Policies",
      desc: "City Chalapathi University's policies on data protection and student privacy.",
      body: (
        <div className="space-y-4 text-gray-600 text-sm mt-4 leading-relaxed">
          <p>City Chalapathi University is committed to protecting the privacy of its students, faculty, staff, and visitors. This Privacy Policy details how we collect, use, and safeguard personal information.</p>
          <h4 className="font-extrabold text-[#072A6C] text-sm mt-4">1. Data Collection</h4>
          <p className="text-xs">We collect academic, enrollment, contact, and portal login logs strictly to provide university services, admissions counseling, and educational resources.</p>
          <h4 className="font-extrabold text-[#072A6C] text-sm mt-4">2. Security Compliance</h4>
          <p className="text-xs">All database transmissions utilize secure socket layer encryption (SSL/TLS) and are hosted within state-compliant data centers to ensure zero breach vulnerabilities.</p>
        </div>
      )
    };
  }

  if (cleanPath.startsWith("/terms-conditions")) {
    return {
      title: "Terms & Conditions",
      category: "Legal & Policies",
      desc: "Governing terms, codes of conduct, and terms of service for university portals.",
      body: (
        <div className="space-y-4 text-gray-600 text-sm mt-4 leading-relaxed">
          <p>By accessing the portals and digital platforms of City Chalapathi University, users agree to comply with the following regulations.</p>
          <h4 className="font-extrabold text-[#072A6C] text-sm mt-4">1. Academic Conduct</h4>
          <p className="text-xs">All online submissions, grading assessments, and student actions must align with our academic integrity and anti-plagiarism framework.</p>
          <h4 className="font-extrabold text-[#072A6C] text-sm mt-4">2. Usage Limitations</h4>
          <p className="text-xs">University network assets, computing resources, and campus portal access must not be used for unauthorized downloading or third-party credential distribution.</p>
        </div>
      )
    };
  }

  if (cleanPath.startsWith("/sitemap")) {
    return {
      title: "University Sitemap",
      category: "Navigation",
      desc: "An index structure of all accessible academic, administrative, and research directories.",
      body: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-xs font-[var(--font-poppins)]">
          <div className="space-y-2">
            <h4 className="font-extrabold text-[#072A6C] uppercase">About</h4>
            <ul className="space-y-1 text-gray-500 font-medium">
              <li><Link to="/about" className="hover:text-[#D4AF37]">About Us</Link></li>
              <li><Link to="/about/genesis" className="hover:text-[#D4AF37]">Genesis & Heritage</Link></li>
              <li><Link to="/about/vision" className="hover:text-[#D4AF37]">Vision & Mission</Link></li>
              <li><Link to="/about/leadership" className="hover:text-[#D4AF37]">University Leadership</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-extrabold text-[#072A6C] uppercase">Academics</h4>
            <ul className="space-y-1 text-gray-500 font-medium">
              <li><Link to="/academics" className="hover:text-[#D4AF37]">Programs Portal</Link></li>
              <li><Link to="/academics/computer-science" className="hover:text-[#D4AF37]">Computer Science & Eng</Link></li>
              <li><Link to="/academics/artificial-intelligence" className="hover:text-[#D4AF37]">AI & Machine Learning</Link></li>
              <li><Link to="/academics/data-science" className="hover:text-[#D4AF37]">Data Science</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-extrabold text-[#072A6C] uppercase">Admissions</h4>
            <ul className="space-y-1 text-gray-500 font-medium">
              <li><Link to="/admissions" className="hover:text-[#D4AF37]">Admissions Portal</Link></li>
              <li><Link to="/admissions/fees" className="hover:text-[#D4AF37]">Academic Fee Structure</Link></li>
              <li><Link to="/admissions/scholarships" className="hover:text-[#D4AF37]">Scholarships & Waivers</Link></li>
              <li><Link to="/admissions/apply" className="hover:text-[#D4AF37]">Apply Registration Form</Link></li>
            </ul>
          </div>
        </div>
      )
    };
  }

  // Default fallback
  return {
    title: "University Information Page",
    category: "Information",
    desc: "Discover details, academic programs, and announcements from Chalapathi University.",
    body: <p className="text-gray-600 text-sm">Please select a topic from the main navigation menu or search directory.</p>
  };
};

function AcademicCalendar() {
  const [selectedYear, setSelectedYear] = React.useState("2026-27");
  const [activeCourse, setActiveCourse] = React.useState<string | null>(null);

  const years = ["2026-27", "2025-26", "2024-25", "2023-24", "2022-23"];

  const universitysData: Record<string, Record<string, Record<string, { label: string; key: string }[]>>> = {
    "2026-27": {
      "School of Computing Sciences": {
        "Computer Science & Engineering": [
          { label: "B.Tech. Computer Science & Engineering", key: "btech-cse" },
          { label: "M.Tech. Computer Science & Engineering", key: "mtech-cse" },
          { label: "MCA", key: "mca" },
          { label: "Ph.D. Computer Science & Engineering", key: "phd-cse" }
        ],
        "Artificial Intelligence": [
          { label: "B.Tech. CSE (AI & Machine Learning)", key: "btech-cse-ai-ml" },
          { label: "B.Tech. Artificial Intelligence & Machine Learning", key: "btech-aiml" },
          { label: "M.Tech. CSE (AI & ML)", key: "mtech-aiml" }
        ],
        "Data Science": [
          { label: "B.Tech. CSE (Data Science)", key: "btech-cse-data-science" }
        ],
        "Cyber Security": [
          { label: "B.Tech. CSE (Cyber Security)", key: "btech-cse-cyber-security" }
        ]
      },
      "School of Engineering": {
        "Electronics and Communication Engineering": [
          { label: "B.Tech. Electronics and Communication Engineering", key: "btech-ece" },
          { label: "M.Tech. VLSI and Embedded Systems Design", key: "mtech-vlsi" },
          { label: "Ph.D. Electronics and Communication Engineering", key: "phd-ece" }
        ],
        "Civil Engineering": [
          { label: "B.Tech. Civil Engineering", key: "btech-civil" },
          { label: "M.Tech. Structural Engineering", key: "mtech-structural" },
          { label: "Ph.D. Structural Engineering", key: "phd-structural" }
        ],
        "Basic Science & Humanities": []
      },
      "School of Business & Management": {
        "Business and Management": [
          { label: "MBA", key: "mba" }
        ]
      }
    },
    "2025-26": {
      "School of Computing Sciences": {
        "Computer Science & Engineering": [
          { label: "B.Tech. Computer Science & Engineering", key: "btech-cse" },
          { label: "MCA", key: "mca" }
        ]
      },
      "School of Engineering": {
        "Electronics and Communication Engineering": [
          { label: "B.Tech. Electronics and Communication Engineering", key: "btech-ece" }
        ],
        "Civil Engineering": [
          { label: "B.Tech. Civil Engineering", key: "btech-civil" }
        ],
        "Basic Science & Humanities": []
      },
      "School of Business & Management": {
        "Business and Management": [
          { label: "MBA", key: "mba" }
        ]
      }
    }
  };

  // Pre-fill previous years dynamically so we have 5 years covered
  years.forEach(y => {
    if (!universitysData[y]) {
      universitysData[y] = {
        "School of Computing Sciences": {
          "Computer Science & Engineering": [
            { label: `B.Tech, M.Tech, MCA, Ph.D Programs (${y})`, key: `computing-${y}` }
          ]
        },
        "School of Engineering": {
          "Electronics and Communication Engineering": [
            { label: `B.Tech, M.Tech, Ph.D Programs (${y})`, key: `engineering-${y}` }
          ]
        },
        "School of Business & Management": {
          "Business and Management": [
            { label: `MBA Programs (${y})`, key: `business-${y}` }
          ]
        }
      };
    }
  });

function InteractiveCalendarWidget({ year, courseKey }: { year: string; courseKey: string }) {
  const { calendarData } = useData();
  const monthsData = calendarData;

  const [monthIndex, setMonthIndex] = React.useState(0);
  const [selectedDay, setSelectedDay] = React.useState<number | null>(15);

  const currentMonth = monthsData[monthIndex];
  
  const yStart = parseInt(year.split("-")[0]);
  const yEnd = parseInt("20" + year.split("-")[1]);
  const displayYear = currentMonth.yearOffset === 0 ? yStart : yEnd;

  const prevMonth = () => {
    setMonthIndex((prev) => (prev > 0 ? prev - 1 : monthsData.length - 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setMonthIndex((prev) => (prev < monthsData.length - 1 ? prev + 1 : 0));
    setSelectedDay(null);
  };

  // Generate day cells including empty offsets
  const dayCells = [];
  for (let i = 0; i < currentMonth.startDay; i++) {
    dayCells.push(null);
  }
  for (let i = 1; i <= currentMonth.totalDays; i++) {
    dayCells.push(i);
  }

  // Get active event for selected day
  const activeEvent = selectedDay && currentMonth.events[selectedDay as keyof typeof currentMonth.events];

  return (
    <div className="p-4 bg-gray-50/70 border-t border-gray-100 animate-slide-down">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-bold text-[#072A6C] uppercase tracking-wider">Visual Academic Calendar ({year})</span>
        <button 
          onClick={() => alert(`Academic Calendar PDF for ${year} is queued for download.`)}
          className="text-[10px] font-bold text-[#D4AF37] hover:text-[#072A6C] transition-colors"
        >
          📥 Download Calendar PDF
        </button>
      </div>

      {/* Main split box matching reference visual styling */}
      <div className="flex flex-col md:flex-row rounded-3xl border border-gray-200 overflow-hidden shadow-md">
        {/* Left Side: Calendar Grid */}
        <div className="w-full md:w-3/5 bg-gray-50/80 p-6 flex flex-col justify-between min-h-[320px]">
          {/* Header Month/Year Selection */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">{displayYear - 1}</span>
            <h5 className="text-sm font-extrabold text-[#072A6C] uppercase tracking-widest">
              {currentMonth.name}, {displayYear}
            </h5>
            <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest">{displayYear + 1}</span>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold text-[#072A6C]/70 uppercase mb-4 tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thur</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-y-2 text-center items-center relative">
            {/* Left Month navigation arrow */}
            <button 
              onClick={prevMonth}
              className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-100 hover:bg-gray-50 flex items-center justify-center shadow-sm text-[#072A6C] hover:text-[#D4AF37] transition-colors cursor-pointer outline-none"
            >
              ◀
            </button>

            {dayCells.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              
              const hasEvent = currentMonth.events[day as keyof typeof currentMonth.events] !== undefined;
              const isSelected = selectedDay === day;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`w-8 h-8 mx-auto rounded-full flex flex-col items-center justify-center text-[13px] font-bold transition-all relative cursor-pointer outline-none ${
                    isSelected 
                      ? "bg-[#D4AF37] text-white shadow-sm scale-110" 
                      : hasEvent 
                        ? "text-[#072A6C] border-2 border-[#D4AF37] hover:bg-[#D4AF37]/10"
                        : "text-[#072A6C] hover:bg-[#072A6C]/10"
                  }`}
                >
                  <span>{day}</span>
                </button>
              );
            })}

            {/* Right Month navigation arrow */}
            <button 
              onClick={nextMonth}
              className="absolute right-[-16px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-gray-100 hover:bg-gray-50 flex items-center justify-center shadow-sm text-[#072A6C] hover:text-[#D4AF37] transition-colors cursor-pointer outline-none"
            >
              ▶
            </button>
          </div>

          {/* Bottom actions */}
          <div className="flex gap-2 mt-6">
            <button 
              onClick={() => alert(`Full events roster for ${currentMonth.name} is displayed on the sidebar.`)}
              className="flex-1 py-2.5 bg-[#072A6C] hover:bg-[#072A6C]/90 text-white text-[9.5px] font-bold rounded-lg tracking-widest uppercase transition-colors outline-none cursor-pointer"
            >
              See Planned Events
            </button>
            <button 
              onClick={() => alert("Notification reminder has been registered successfully.")}
              className="flex-1 py-2.5 bg-[#D4AF37] hover:bg-[#D4AF37]/95 text-white text-[9.5px] font-bold rounded-lg tracking-widest uppercase transition-colors outline-none cursor-pointer"
            >
              Set Reminder
            </button>
          </div>
        </div>

        {/* Right Side: University Blue Events Panel */}
        <div className="w-full md:w-2/5 bg-[#072A6C] p-6 text-white flex flex-col justify-between min-h-[320px]">
          <div>
            <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest block mb-1">Schedule</span>
            <h5 className="text-xs font-extrabold uppercase tracking-widest pb-2 border-b border-white/10 mb-4">
              Events
            </h5>

            <div className="space-y-4">
              {/* Display specific event if selected date has one */}
              {activeEvent ? (
                <div className="space-y-1.5 animate-slide-down">
                  <div className="text-yellow-300 text-[11px] font-extrabold uppercase tracking-wider leading-snug">
                    {activeEvent}
                  </div>
                  <div className="w-16 h-[2px] bg-[#D4AF37] rounded" />
                  <div className="text-[9.5px] text-gray-300 font-light">
                    Scheduled on {currentMonth.name} {selectedDay}, {displayYear}
                  </div>
                </div>
              ) : selectedDay ? (
                <div className="text-gray-300 text-xs font-light italic">
                  No academic events scheduled on {currentMonth.name} {selectedDay}.
                </div>
              ) : (
                <div className="text-gray-300 text-xs font-light italic">
                  Click a highlighted date in the calendar to view scheduled milestones.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-2">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Month Summary:</span>
            {Object.keys(currentMonth.events).length > 0 ? (
              Object.entries(currentMonth.events).map(([day, evName]) => (
                <div key={day} className="text-[10px] text-gray-200 flex items-center justify-between">
                  <span>• {evName}</span>
                  <span className="text-gray-400 shrink-0 ml-2">{currentMonth.name.substring(0, 3)} {day}</span>
                </div>
              ))
            ) : (
              <div className="text-[10px] text-gray-400 italic">No events scheduled in {currentMonth.name}.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="space-y-6">
      {/* 5-Year Selection Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-100">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => {
              setSelectedYear(year);
              setActiveCourse(null);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer outline-none ${
              selectedYear === year
                ? "bg-[#D4AF37] text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {year} {year === "2026-27" && "(Present)"}
          </button>
        ))}
      </div>

      {/* University Categories & Course Lists */}
      <div className="space-y-6">
        {Object.entries(universitysData[selectedYear] || {}).map(([schoolName, departments]) => (
          <div key={schoolName} className="bg-white border border-gray-200/60 rounded-[16px] p-6 shadow-sm">
            <h4 className="text-sm font-extrabold text-[#072A6C] mb-6 border-l-4 border-[#D4AF37] pl-3 tracking-wide uppercase">
              {schoolName}
            </h4>
            <div className="flex flex-col gap-6">
              {Object.entries(departments).map(([deptName, courses]) => (
                <div key={deptName} className="flex flex-col gap-3">
                  <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{deptName}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-2 border-l border-gray-100">
                    {courses.map((course) => {
                      const uniqueKey = `${selectedYear}-${course.key}`;
                      const isExpanded = activeCourse === uniqueKey;
                      return (
                        <div key={course.key} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 col-span-1 md:col-span-full">
                          <button
                            onClick={() => setActiveCourse(isExpanded ? null : uniqueKey)}
                            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#D4AF37] bg-white transition-colors text-left outline-none cursor-pointer"
                          >
                            <span>• {course.label}</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#D4AF37]" : "text-gray-400"}`} />
                          </button>
                          {isExpanded && <InteractiveCalendarWidget year={selectedYear} courseKey={course.key} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AcademicFlexibilities() {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);

  const flexibilities = [
    {
      title: "Acceleration and Deceleration",
      key: "acceleration",
      desc: "Allows students to adjust their academic pace. Capable students can accelerate their degree program by taking extra credits (up to 28 per semester) to graduate in 3.5 years or opt for deceleration (fewer credits) to spread the load without failing grades.",
      highlights: ["Fast-track graduation in 3.5 years", "Decelerated paths to manage complex core modules", "Credit load variance between 16 to 28 credits per term"]
    },
    {
      title: "Change of Branch",
      key: "change-branch",
      desc: "Offers a second chance to slide into a branch of choice. High-performing students (typically top 10% based on first-year CGPA) with no backlogs can apply for branch transfer after completing their second semester.",
      highlights: ["Merit-based allocations after Year 1", "CGPA threshold of 8.5 or above", "Zero pending backlogs constraint"]
    },
    {
      title: "Choice Based Credit System (CBCS)",
      key: "cbcs",
      desc: "Gives students the freedom to choose their own curriculum paths. Under the Choice Based Credit System, scholars can choose professional core electives, interdisciplinary open electives, and humanities courses across departments.",
      highlights: ["Choice-driven learning framework", "Interdisciplinary open electives basket", "Syllabus aligned with global Credit accumulation systems"]
    },
    {
      title: "Double Major",
      key: "double-major",
      desc: "Enables students to gain multi-disciplinary expertise. An engineering student can earn a Double Major by acquiring additional credits in a second engineering discipline, broadening career horizons significantly.",
      highlights: ["Degrees in two distinct major categories", "Extended credit scope", "Enhances placement prospects in hybrid sectors"]
    },
    {
      title: "Dual Degree",
      key: "dual-degree",
      desc: "Fast-tracks higher education. Students can enroll in integrated dual-degree programs to complete a B.Tech + M.Tech in 5 years or BBA + MBA in a structured, accelerated timeline, saving one full academic year.",
      highlights: ["B.Tech + M.Tech in 5 years", "Integrated course structures", "Saves time and fee costs"]
    },
    {
      title: "Honors Degree",
      key: "honors",
      desc: "Promotes advanced study and research. Outstanding students can opt for an Honors track in their parent department. This requires completing additional advanced theory courses and a minor research dissertation.",
      highlights: ["Awarded as 'B.Tech (Honours)'", "Dedicated advanced research dissertation", "High eligibility threshold (CGPA > 8.0)"]
    },
    {
      title: "Minor Degree",
      key: "minor",
      desc: "Adds a secondary stream of expertise. Students can take a set of 5-6 courses from another department (e.g. ECE student completing minor in CSE) to gain a minor degree along with their primary branch.",
      highlights: ["Cross-discipline skillset certification", "Prepares students for hybrid jobs (e.g. Bio-informatics)", "Structured credit tracks alongside primary majors"]
    },
    {
      title: "Special Purpose Semesters",
      key: "special-sem",
      desc: "Dedicated time for out-of-classroom learning. Students can spend a complete semester (typically in Year 4) doing a full-time Industry Internship, a Semester Abroad Program (SAP) at a global university, or incubating a startup on campus.",
      highlights: ["6-Month full-time industrial placement", "Semester Abroad programs (SAP) at partner universities", "Campus startup incubator support credits"]
    },
    {
      title: "Specialization",
      key: "specialization",
      desc: "Deepens focus in high-demand fields. CSE students can choose targeted specializations (like Cyber Security, Data Science, AI & ML) by taking a set of matching elective courses and lab projects starting in their third year.",
      highlights: ["Focused tracks within parent branch", "Industry-aligned specific curricula", "Prepares for specialized roles directly out of university"]
    },
    {
      title: "Summer Term Registration",
      key: "summer-term",
      desc: "Provides a credit recovery pathway. Conducted during the summer break, this term allows students with backlogs or missed attendance to re-register for courses, complete examinations, and catch up with their cohorts.",
      highlights: ["Fast-track backlog clearance", "Accelerated credit recovery", "Regular classes and laboratory cycles over 6 weeks"]
    }
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-sm leading-relaxed">
        Chalapathi University offers several academic flexibilities for students at both Undergraduate and Postgraduate levels. Click on any of the flexibilities below to view full details:
      </p>

      <div className="space-y-3">
        {flexibilities.map((item) => {
          const isExpanded = activeItem === item.key;
          return (
            <div key={item.key} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#D4AF37]/20 transition-all duration-300">
              <button
                onClick={() => setActiveItem(isExpanded ? null : item.key)}
                className="w-full px-5 py-4 flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#D4AF37] bg-white transition-colors text-left outline-none cursor-pointer"
              >
                <span>• {item.title}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? "rotate-180 text-[#D4AF37]" : "text-gray-400"}`} />
              </button>
              
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 bg-gray-50/50 border-t border-gray-100 animate-slide-down space-y-4">
                  <p className="text-xs text-gray-600 leading-relaxed font-light">
                    {item.desc}
                  </p>
                  
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#072A6C] font-extrabold uppercase tracking-wider block">Key Highlights:</span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-1">
                      {item.highlights.map((h, idx) => (
                        <li key={idx} className="text-[11.5px] text-gray-500 font-medium flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AcademicGradingSystem() {
  const isAdmin = false;
  const [activeTab, setActiveTab] = React.useState("computing");

  const defaultGradingData = {
    computing: {
      title: "School of Computing Sciences Grading Schema",
      absolute: [
        { perf: "Outstanding", grade: "O", gp: "10", range: "90 - 100" },
        { perf: "Excellent", grade: "A+", gp: "9", range: "80 - 89" },
        { perf: "Very Good", grade: "A", gp: "8", range: "70 - 79" },
        { perf: "Good", grade: "B+", gp: "7", range: "60 - 69" },
        { perf: "Above Average", grade: "B", gp: "6", range: "50 - 59" },
        { perf: "Average", grade: "C", gp: "5", range: "46 - 49" },
        { perf: "Pass", grade: "P", gp: "4", range: "40 - 45" },
        { perf: "Fail", grade: "F", gp: "0", range: "0 - 39" },
        { perf: "Absent", grade: "AB", gp: "0", range: "Absent" }
      ],
      relative: [
        { grade: "O", gp: "10", calc: "total marks >= 90% and total marks >= mean + 1.50σ" },
        { grade: "A+", gp: "9", calc: "µ+0.50σ <= total marks < µ+1.50σ" },
        { grade: "A", gp: "8", calc: "µ <= total marks < µ+0.50σ" },
        { grade: "B+", gp: "7", calc: "µ-0.50σ <= total marks < µ" },
        { grade: "B", gp: "6", calc: "µ-1.00σ <= total marks < µ-0.50σ" },
        { grade: "C", gp: "5", calc: "µ-1.25σ <= total marks < µ-1.00σ" },
        { grade: "P", gp: "4", calc: "µ-1.50σ <= total marks < µ-1.25σ or >= 40" },
        { grade: "F", gp: "0", calc: "total marks < µ-1.50σ or total marks <= 39" },
        { grade: "AB", gp: "0", calc: "Absent" }
      ]
    },
    engineering: {
      title: "School of Engineering Grading Schema",
      absolute: [
        { perf: "Outstanding", grade: "O", gp: "10", range: "90 - 100" },
        { perf: "Excellent", grade: "A+", gp: "9", range: "80 - 89" },
        { perf: "Very Good", grade: "A", gp: "8", range: "70 - 79" },
        { perf: "Good", grade: "B+", gp: "7", range: "60 - 69" },
        { perf: "Above Average", grade: "B", gp: "6", range: "50 - 59" },
        { perf: "Average", grade: "C", gp: "5", range: "46 - 49" },
        { perf: "Pass", grade: "P", gp: "4", range: "40 - 45" },
        { perf: "Fail", grade: "F", gp: "0", range: "0 - 39" },
        { perf: "Absent", grade: "AB", gp: "0", range: "Absent" }
      ],
      relative: [
        { grade: "O", gp: "10", calc: "total marks >= 90% and total marks >= mean + 1.50σ" },
        { grade: "A+", gp: "9", calc: "µ+0.50σ <= total marks < µ+1.50σ" },
        { grade: "A", gp: "8", calc: "µ <= total marks < µ+0.50σ" },
        { grade: "B+", gp: "7", calc: "µ-0.50σ <= total marks < µ" },
        { grade: "B", gp: "6", calc: "µ-1.00σ <= total marks < µ-0.50σ" },
        { grade: "C", gp: "5", calc: "µ-1.25σ <= total marks < µ-1.00σ" },
        { grade: "P", gp: "4", calc: "µ-1.50σ <= total marks < µ-1.25σ or >= 40" },
        { grade: "F", gp: "0", calc: "total marks < µ-1.50σ or total marks <= 39" },
        { grade: "AB", gp: "0", calc: "Absent" }
      ]
    },
    business: {
      title: "School of Business & Management Grading Schema",
      absolute: [
        { perf: "Outstanding", grade: "O", gp: "10", range: "90 - 100" },
        { perf: "Excellent", grade: "A+", gp: "9", range: "80 - 89" },
        { perf: "Very Good", grade: "A", gp: "8", range: "70 - 79" },
        { perf: "Good", grade: "B+", gp: "7", range: "60 - 69" },
        { perf: "Above Average", grade: "B", gp: "6", range: "50 - 59" },
        { perf: "Fail", grade: "F", gp: "0", range: "0 - 49" },
        { perf: "Absent", grade: "AB", gp: "0", range: "Absent" }
      ],
      relative: [
        { grade: "O", gp: "10", calc: "total marks >= 90% and total marks >= mean + 1.50σ" },
        { grade: "A+", gp: "9", calc: "µ+0.50σ <= total marks < µ+1.50σ" },
        { grade: "A", gp: "8", calc: "µ <= total marks < µ+0.50σ" },
        { grade: "B+", gp: "7", calc: "µ-0.50σ <= total marks < µ" },
        { grade: "B", gp: "6", calc: "µ-1.00σ <= total marks < µ-0.50σ" },
        { grade: "F", gp: "0", calc: "total marks < µ-1.50σ or total marks <= 49" },
        { grade: "AB", gp: "0", calc: "Absent" }
      ]
    }
  };

  const [gradingData, setGradingData] = React.useState(() => {
    const saved = localStorage.getItem("chalapathy_grading_config");
    return saved ? JSON.parse(saved) : defaultGradingData;
  });
  const currentProgram = gradingData[activeTab];

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex justify-start items-center bg-gray-50 border border-gray-100 p-4 rounded-2xl">
        <div className="flex gap-2">
          {Object.entries(gradingData).map(([key, data]: [string, any]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer outline-none ${
                activeTab === key
                  ? "bg-[#072A6C] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {key === "computing" && "School of Computing Sciences"}
              {key === "engineering" && "School of Engineering"}
              {key === "business" && "School of Business & Management"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-lg font-extrabold text-[#072A6C]">{currentProgram.title}</h3>
        
        {/* Render Absolute Grading if it exists */}
        {currentProgram.absolute && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-wider">Absolute Grading System</span>
              {isAdmin && <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">Click any field to edit</span>}
            </div>
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#072A6C] text-white font-extrabold border-b-2 border-[#D4AF37]">
                    <th className="p-3.5 text-[10px] font-extrabold uppercase tracking-widest text-white/95">Performance</th>
                    <th className="p-3.5 text-[10px] font-extrabold uppercase tracking-widest text-white/95">Letter Grade</th>
                    <th className="p-3.5 text-[10px] font-extrabold uppercase tracking-widest text-white/95">Grade Point</th>
                    <th className="p-3.5 text-[10px] font-extrabold uppercase tracking-widest text-white/95">Percentage of Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProgram.absolute.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#D4AF37]/10 odd:bg-gray-50/40 transition-colors">
                      <td className="p-3.5 font-medium text-gray-800">{row.perf}</td>
                      <td className="p-3.5 font-extrabold text-[#D4AF37] text-sm">{row.grade}</td>
                      <td className="p-3.5 font-bold text-[#072A6C] text-xs">{row.gp}</td>
                      <td className="p-3.5 text-gray-500 font-light">{row.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Render Relative Grading if it exists */}
        {currentProgram.relative && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-extrabold text-[#072A6C] uppercase tracking-wider">Relative Grading System</span>
            </div>
            <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#072A6C] text-white font-extrabold border-b-2 border-[#D4AF37]">
                    <th className="p-3.5 text-[10px] font-extrabold uppercase tracking-widest text-white/95">Letter Grade</th>
                    <th className="p-3.5 text-[10px] font-extrabold uppercase tracking-widest text-white/95">Grade Point</th>
                    <th className="p-3.5 text-[10px] font-extrabold uppercase tracking-widest text-white/95">Grade Calculation Formula</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentProgram.relative.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#D4AF37]/10 odd:bg-gray-50/40 transition-colors">
                      <td className="p-3.5 font-extrabold text-[#D4AF37] text-sm">{row.grade}</td>
                      <td className="p-3.5 font-bold text-[#072A6C] text-xs">{row.gp}</td>
                      <td className="p-3.5 text-gray-600 font-mono text-[11px]">{row.calc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-xl text-[11px] text-yellow-900 font-light leading-relaxed">
        <strong>Definitions:</strong>
        <br />• <strong>Mean (µ):</strong> The average score of all passing students in the specific subject class.
        <br />• <strong>Standard Deviation (σ):</strong> Represents the variance / score distribution of the student cohort.
        <br />• <strong>Relative Grading:</strong> Used selectively for large core classes to ensure a fair normal distribution curve across multiple branches.
      </div>
    </div>
  );
}

function AwardOfDegrees() {
  const [activeCategory, setActiveCategory] = React.useState("computing");
  const [testCgpa, setTestCgpa] = React.useState<number>(7.5);

  const categories = {
    computing: {
      title: "School of Computing Sciences (B.Tech, M.Tech, MCA, Ph.D)",
      desc: "Degree classification requirements for Computing Sciences programs:",
      grades: [
        { min: 5.25, max: 5.75, class: "Pass Class", color: "bg-gray-50 border-gray-200 text-gray-700", glow: "hover:bg-gray-100/50 hover:border-gray-300" },
        { min: 5.75, max: 6.75, class: "Second Class", color: "bg-blue-50/40 border-blue-100 text-blue-800", glow: "hover:bg-blue-50 hover:border-blue-300" },
        { min: 6.75, max: 7.75, class: "First Class", color: "bg-indigo-50/40 border-indigo-100 text-indigo-800", glow: "hover:bg-indigo-50 hover:border-indigo-300" },
        { min: 7.75, max: 10.0, class: "First Class with Distinction", color: "bg-rose-50/40 border-rose-100 text-[#D4AF37]", glow: "hover:bg-rose-50 hover:border-[#D4AF37]", note: "Fulfill all program requirements in specified minimum years duration and pass all courses in first attempt." }
      ]
    },
    engineering: {
      title: "School of Engineering (B.Tech, M.Tech, Ph.D)",
      desc: "Degree classification requirements for Engineering programs:",
      grades: [
        { min: 5.25, max: 5.75, class: "Pass Class", color: "bg-gray-50 border-gray-200 text-gray-700", glow: "hover:bg-gray-100/50 hover:border-gray-300" },
        { min: 5.75, max: 6.75, class: "Second Class", color: "bg-blue-50/40 border-blue-100 text-blue-800", glow: "hover:bg-blue-50 hover:border-blue-300" },
        { min: 6.75, max: 7.75, class: "First Class", color: "bg-indigo-50/40 border-indigo-100 text-indigo-800", glow: "hover:bg-indigo-50 hover:border-indigo-300" },
        { min: 7.75, max: 10.0, class: "First Class with Distinction", color: "bg-rose-50/40 border-rose-100 text-[#D4AF37]", glow: "hover:bg-rose-50 hover:border-[#D4AF37]", note: "Fulfill all program requirements in specified minimum years duration and pass all courses in first attempt." }
      ]
    },
    business: {
      title: "School of Business & Management (MBA)",
      desc: "Degree classification requirements for Business & Management programs:",
      grades: [
        { min: 5.5, max: 5.75, class: "Pass Class", color: "bg-gray-50 border-gray-200 text-gray-700", glow: "hover:bg-gray-100/50 hover:border-gray-300" },
        { min: 5.75, max: 6.75, class: "Second Class", color: "bg-blue-50/40 border-blue-100 text-blue-800", glow: "hover:bg-blue-50 hover:border-blue-300" },
        { min: 6.75, max: 7.75, class: "First Class", color: "bg-indigo-50/40 border-indigo-100 text-indigo-800", glow: "hover:bg-indigo-50 hover:border-indigo-300" },
        { min: 7.75, max: 10.0, class: "First Class with Distinction", color: "bg-rose-50/40 border-rose-100 text-[#D4AF37]", glow: "hover:bg-rose-50 hover:border-[#D4AF37]", note: "Fulfill all program requirements in specified minimum years duration and pass all courses in first attempt." }
      ]
    }
  };

  const selectedData = categories[activeCategory as keyof typeof categories];

  // Helper to determine active range based on slider CGPA value
  const getActiveGradeIndex = () => {
    return selectedData.grades.findIndex(
      (g) => testCgpa >= g.min && testCgpa < g.max
    );
  };

  const activeGradeIndex = getActiveGradeIndex();

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-2 pb-2 border-b border-gray-100">
        {Object.entries(categories).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer outline-none ${
              activeCategory === key
                ? "bg-[#072A6C] text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {key === "computing" && "School of Computing Sciences"}
            {key === "engineering" && "School of Engineering"}
            {key === "business" && "School of Business & Management"}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-[#072A6C] uppercase tracking-wider">
          {selectedData.title}
        </h4>
        <p className="text-xs text-gray-500 font-light leading-relaxed">{selectedData.desc}</p>
      </div>

      {/* Degree Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedData.grades.map((grade, index) => {
          const isActive = index === activeGradeIndex;
          return (
            <div
              key={grade.class}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 select-none hover:shadow-md ${grade.color} ${grade.glow} ${
                isActive
                  ? "ring-4 ring-offset-2 ring-[#072A6C] border-[#072A6C] scale-[1.02] shadow-md"
                  : "scale-100 shadow-sm"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-extrabold tracking-wide block uppercase">
                  {grade.class}
                </span>
                <span className="text-[10px] font-bold bg-white/70 px-2 py-0.5 rounded border border-gray-200">
                  {grade.min} ≤ CGPA &lt; {grade.max === 10.0 ? "10.00" : grade.max}
                </span>
              </div>
              <p className="text-[11.5px] leading-relaxed text-gray-600 font-light">
                Awarded to students finishing all academic credits and clearing modules with a cumulative GPA of {grade.min} to {grade.max}.
              </p>
              {grade.note && (
                <div className="mt-3 pt-3 border-t border-amber-200/50 text-[10px] text-[#C9A84C] font-medium leading-relaxed">
                  ⚠️ <strong>Note:</strong> {grade.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive CGPA Classification Slider */}
      <div className="bg-[#072A6C]/5 border border-[#072A6C]/10 rounded-2xl p-5 shadow-sm space-y-4 mt-6">
        <h5 className="text-xs font-extrabold text-[#072A6C] uppercase tracking-wider">
          🎓 Interactive Degree Classifier
        </h5>
        <p className="text-[11.5px] text-gray-500 font-light">
          Drag the slider to select a target CGPA and view your expected graduation classification.
        </p>
        
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-3/5 space-y-2">
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.05"
              value={testCgpa}
              onChange={(e) => setTestCgpa(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#D71920]"
            />
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span>5.0 CGPA</span>
              <span>7.5 CGPA</span>
              <span>10.0 CGPA</span>
            </div>
          </div>

          <div className="w-full md:w-2/5 bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Target CGPA</span>
            <div className="text-[26px] font-[800] text-[#072A6C] leading-none mb-2">{testCgpa.toFixed(2)}</div>
            <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[10.5px] font-extrabold rounded-full uppercase tracking-wider">
              {activeGradeIndex !== -1 ? selectedData.grades[activeGradeIndex].class : "Does Not Qualify"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AcademicRulesRegulations() {
  const rules = [
    {
      title: "Attendance",
      desc: "Minimum 75% attendance is compulsory in each subject to qualify for final theory/laboratory exams.",
      icon: Clock
    },
    {
      title: "Dress Code",
      desc: "Proper formal attire and mandatory wearing of ID cards at all times inside campus blocks.",
      icon: UserCheck
    },
    {
      title: "Integrity",
      desc: "Zero tolerance for cheating, plagiarism, copying lab reports, or possessing prohibited devices in test halls.",
      icon: ShieldAlert
    },
    {
      title: "Conduct",
      desc: "Absolute zero-tolerance ragging policy on campus. Offenders face immediate suspension/legal actions.",
      icon: Scale
    },
    {
      title: "Deadlines",
      desc: "Course registration and examination enrollments must be completed before the semester commencement deadlines.",
      icon: CalendarRange
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h3 className="text-base font-extrabold text-[#072A6C] uppercase tracking-wider">
          5 Focal Points of Student Compliance
        </h3>
        <p className="text-xs text-gray-500 font-light leading-relaxed">
          Standard academic rules and discipline parameters to be strictly adhered to by all scholars at Chalapathi University.
        </p>
      </div>

      {/* 5-Column Grid with Individual hover-raising cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {rules.map((item, idx) => {
          const IconComponent = item.icon;
          const bgClass = idx % 2 === 1 ? "bg-gray-50/80" : "bg-white";
          
          return (
            <div
              key={item.title}
              className={`flex flex-col items-center p-6 text-center border border-gray-100 rounded-3xl transition-all duration-300 hover:shadow-md hover:border-[#D4AF37]/30 group ${bgClass}`}
            >
              {/* Icon Container with subtle animation */}
              <div className="w-16 h-16 rounded-full bg-blue-50/80 text-[#072A6C] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#072A6C]/10">
                <IconComponent size={24} className="stroke-[1.5]" />
              </div>

              {/* Bold Title */}
              <h4 className="text-xs font-extrabold text-gray-800 mb-2.5 uppercase tracking-widest group-hover:text-[#D4AF37] transition-colors">
                {item.title}
              </h4>

              {/* Description Sentence */}
              <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeachingEvaluation() {
  const evaluations = [
    {
      title: "Mid-Term Examinations",
      weight: "20%",
      desc: "Two centralized internal exams per semester testing core subject knowledge blocks.",
      glow: "hover:border-blue-200"
    },
    {
      title: "Continuous Assessment",
      weight: "10%",
      desc: "Regular assignments, classroom quizzes, case-studies, and active seminar participations.",
      glow: "hover:border-indigo-200"
    },
    {
      title: "Laboratory & Internals",
      weight: "10%",
      desc: "Hands-on lab evaluations, project progress reviews, and viva-voce assessments.",
      glow: "hover:border-teal-200"
    },
    {
      title: "Semester End Examinations",
      weight: "60%",
      desc: "Centralized final examinations testing comprehensive curriculum mastery at the end of each term.",
      glow: "hover:border-amber-200"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h4 className="text-xs font-extrabold text-[#072A6C] mb-3 uppercase tracking-wider">Evaluation Framework (CIE vs SEE)</h4>
        <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
          CCIT follows an Outcome-Based Education (OBE) system with a structured evaluation plan divided into Continuous Internal Evaluation (CIE) and Semester End Examinations (SEE).
        </p>

        {/* Visual Progress split */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] font-bold text-gray-600">
            <span>Continuous Internal Evaluation (CIE) - 40%</span>
            <span>Semester End Exam (SEE) - 60%</span>
          </div>
          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-[#072A6C]" style={{ width: "40%" }} />
            <div className="h-full bg-[#D4AF37]" style={{ width: "60%" }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {evaluations.map((item) => (
          <div
            key={item.title}
            className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between ${item.glow}`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-extrabold text-[#072A6C] uppercase tracking-wider">{item.title}</span>
                <span className="text-xs font-bold text-[#D4AF37] bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">{item.weight} Weight</span>
              </div>
              <p className="text-xs text-gray-500 font-light leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const BOS_DEPARTMENTS = [
  {
    name: "Agriculture",
    faculty: [
      { name: "Dr. B. Ramanjaneyulu", role: "Chairman (BOS)", desc: "M.Sc. (Agri), Ph.D." },
      { name: "Dr. A. Sravani", role: "Subject Expert (Professor)", desc: "Ph.D. in Agronomy" },
      { name: "Mr. K. Sai Kumar", role: "Industry Representative", desc: "Lead Agtech Scientist, AgriSolutions" },
      { name: "Mrs. M. Vasantha", role: "Assistant Professor", desc: "M.Sc. in Soil Science" }
    ]
  },
  {
    name: "Architecture",
    faculty: [
      { name: "Dr. G. Lakshmi Prasanna", role: "Chairman (BOS)", desc: "M.Arch, Ph.D." },
      { name: "Mr. R. Dinesh Kumar", role: "Industry Expert", desc: "Principal Architect, DesignStudio" },
      { name: "Dr. V. Satish", role: "Professor", desc: "Ph.D. in Urban Planning" },
      { name: "Ms. P. Haritha", role: "Assistant Professor", desc: "M.Arch (Landscape)" }
    ]
  },
  {
    name: "Arts & Sciences",
    faculty: [
      { name: "Dr. K. Srinivasa Rao", role: "Chairman (BOS)", desc: "M.A, Ph.D. in English Literature" },
      { name: "Dr. M. Sunitha", role: "Professor", desc: "Ph.D. in Environmental Sciences" },
      { name: "Mr. T. Naveen", role: "Assistant Professor", desc: "M.Sc. in Statistics" },
      { name: "Dr. G. Swetha", role: "Assistant Professor", desc: "Ph.D. in Humanities" }
    ]
  },
  {
    name: "Biotechnology",
    faculty: [
      { name: "Dr. P. V. Ramana", role: "Chairman (BOS)", desc: "M.Tech, Ph.D. in Biotech" },
      { name: "Dr. S. Madhavi", role: "Subject Expert", desc: "Professor of Bioinformatics, JNTU" },
      { name: "Mr. V. Suresh Kumar", role: "Industry Expert", desc: "Senior Researcher, BioPharm Labs" },
      { name: "Mrs. K. Kalyani", role: "Assistant Professor", desc: "M.Tech (Bioprocess Engineering)" }
    ]
  },
  {
    name: "Civil Engineering",
    faculty: [
      { name: "Dr. M. Rajasekhar", role: "Chairman (BOS)", desc: "M.Tech, Ph.D." },
      { name: "Dr. K. R. C. Reddy", role: "Professor", desc: "Ph.D. in Structural Engineering" },
      { name: "Mr. L. Venkat", role: "Industry Representative", desc: "Chief Engineer, L&T Infrastructure" },
      { name: "Mrs. N. Anusha", role: "Assistant Professor", desc: "M.Tech (Geotechnical)" }
    ]
  },
  {
    name: "Chemistry",
    faculty: [
      { name: "Dr. T. Venkatappa Rao", role: "Chairman (BOS)", desc: "M.Sc., Ph.D." },
      { name: "Dr. S. Anuradha", role: "Professor", desc: "Ph.D. in Organic Chemistry" },
      { name: "Dr. P. Rajesh", role: "Assistant Professor", desc: "Ph.D. in Analytical Chemistry" }
    ]
  },
  {
    name: "Computer Science And Application",
    faculty: [
      { name: "Dr. K. Kiran Kumar", role: "Chairman (BOS)", desc: "MCA, Ph.D." },
      { name: "Dr. P. Swathi", role: "Professor", desc: "Ph.D. in Data Analytics" },
      { name: "Mr. G. Ravindra", role: "Industry Representative", desc: "Principal Architect, TechMahindra" },
      { name: "Mrs. B. Kavitha", role: "Assistant Professor", desc: "MCA, M.Tech" }
    ]
  },
  {
    name: "Computer Science And Engineering",
    faculty: [
      { name: "Dr. C. Naga Raju", role: "Chairman (BOS)", desc: "M.Tech, Ph.D." },
      { name: "Dr. T. Sreenivasulu", role: "Professor", desc: "Ph.D. in Cloud Computing" },
      { name: "Mr. S. Karthik", role: "Industry Expert", desc: "Senior Architect, Amazon Web Services" },
      { name: "Mrs. V. Sireesha", role: "Assistant Professor", desc: "M.Tech (AI & ML)" }
    ]
  },
  {
    name: "Electronics And Communication Engineering",
    faculty: [
      { name: "Dr. K. Chandrasekhara Rao", role: "Chairman (BOS)", desc: "M.Tech, Ph.D." },
      { name: "Dr. J. Ravindranath", role: "Professor", desc: "Ph.D. in VLSI Systems" },
      { name: "Mr. P. Praveen Kumar", role: "Industry Expert", desc: "Senior Hardware Engineer, Qualcomm" },
      { name: "Mrs. D. Prasanthi", role: "Assistant Professor", desc: "M.Tech (Embedded Systems)" }
    ]
  },
  {
    name: "Electrical And Electronics Engineering",
    faculty: [
      { name: "Dr. G. Srinivasa Rao", role: "Chairman (BOS)", desc: "M.Tech, Ph.D." },
      { name: "Dr. V. Bala Raju", role: "Professor", desc: "Ph.D. in Power Systems" },
      { name: "Mr. K. Anil Kumar", role: "Industry Representative", desc: "Electrical Grid Manager, APTransco" },
      { name: "Mr. M. Gopi", role: "Assistant Professor", desc: "M.Tech (Power Electronics)" }
    ]
  },
  {
    name: "Business School",
    faculty: [
      { name: "Dr. M. Sreenivasulu", role: "Chairman (BOS)", desc: "MBA, Ph.D. in Marketing" },
      { name: "Dr. B. K. Durga", role: "Professor", desc: "Ph.D. in Finance Management" },
      { name: "Mr. R. Siva Sankar", role: "Industry Expert", desc: "HR Manager, Cognizant Business Services" },
      { name: "Mrs. T. Rajeswari", role: "Assistant Professor", desc: "MBA (Human Resource)" }
    ]
  },
  {
    name: "LAW",
    faculty: [
      { name: "Dr. G. V. R. Prasad", role: "Chairman (BOS)", desc: "LL.M, Ph.D." },
      { name: "Dr. P. Radhika", role: "Professor", desc: "Ph.D. in Constitutional Law" },
      { name: "Mr. D. Hari Prasad", role: "Subject Expert", desc: "Senior Counsel, High Court of AP" }
    ]
  },
  {
    name: "Maths",
    faculty: [
      { name: "Dr. A. S. Ramakrishna", role: "Chairman (BOS)", desc: "M.Sc., Ph.D." },
      { name: "Dr. P. Nagamani", role: "Professor", desc: "Ph.D. in Fluid Dynamics" },
      { name: "Mrs. G. Sunanda", role: "Assistant Professor", desc: "M.Sc. (Mathematics)" }
    ]
  },
  {
    name: "Mechanical Engineering",
    faculty: [
      { name: "Dr. K. Srinivasa Rao", role: "Chairman (BOS)", desc: "M.Tech, Ph.D." },
      { name: "Dr. G. Prasada Rao", role: "Professor", desc: "Ph.D. in Thermal Science" },
      { name: "Mr. T. Shiva Shankar", role: "Industry Representative", desc: "Lead Engineer, Tata Motors" },
      { name: "Mr. B. Rajesh Kumar", role: "Assistant Professor", desc: "M.Tech (CAD/CAM)" }
    ]
  },
  {
    name: "Pharmacy",
    faculty: [
      { name: "Dr. B. Madhava Reddy", role: "Chairman (BOS)", desc: "M.Pharm, Ph.D." },
      { name: "Dr. K. Venkata Ramana", role: "Professor", desc: "Ph.D. in Pharmaceutics" },
      { name: "Mr. G. Sai Krishna", role: "Industry Expert", desc: "Quality Assurance Lead, Aurobindo Pharma" },
      { name: "Mrs. N. Swetha", role: "Assistant Professor", desc: "M.Pharm (Pharmacology)" }
    ]
  },
  {
    name: "Physics",
    faculty: [
      { name: "Dr. S. K. Mastan", role: "Chairman (BOS)", desc: "M.Sc., Ph.D." },
      { name: "Dr. P. Srinivasa Rao", role: "Professor", desc: "Ph.D. in Condensed Matter Physics" },
      { name: "Mr. D. Nagaraju", role: "Assistant Professor", desc: "M.Sc. in Physics" }
    ]
  }
];

function BOSMembers() {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-sm leading-relaxed">
        The Board of Studies (BOS) at City Chalapathi meets annually to review and approve academic curriculum layouts, ensuring modern alignment with industrial needs. Click any department below to view its Board Members and key faculty on their dedicated department directory page:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {BOS_DEPARTMENTS.map((dept) => {
          const slug = dept.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
          return (
            <Link 
              key={dept.name} 
              to={`/academics/bos/${slug}`}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#D4AF37]/20 transition-all duration-300 flex items-center justify-between text-xs font-bold text-gray-700 hover:text-[#D4AF37] cursor-pointer"
            >
              <span>• Department of {dept.name}</span>
              <ChevronRight size={14} className="text-gray-400" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DepartmentFacultyView({ slug }: { slug: string }) {
  const dept = BOS_DEPARTMENTS.find(
    (d) => d.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-") === slug
  );

  if (!dept) {
    return (
      <div className="text-center py-10 space-y-4">
        <p className="text-gray-600 text-sm">Department records not found.</p>
        <Link to="/academics/bos" className="text-xs font-bold text-[#D4AF37] hover:underline">
          Back to BOS Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <Link to="/academics/bos" className="text-xs font-bold text-[#072A6C] hover:text-[#D4AF37] transition-colors flex items-center gap-1">
          ◀ Back to BOS Directory
        </Link>
        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
          Faculty Directory
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-extrabold text-[#072A6C]">
          Department of {dept.name}
        </h3>
        <p className="text-xs text-gray-500 font-light leading-relaxed">
          List of Board of Studies (BOS) members, curriculum advisors, and designated faculty specialists.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dept.faculty.map((member, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#D4AF37]/25 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-extrabold text-[#072A6C]">{member.name}</div>
              <div className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider mt-0.5">{member.role}</div>
              <p className="text-xs text-gray-500 font-light leading-relaxed mt-2.5 pt-2.5 border-t border-gray-50">
                {member.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LatestNewsView() {
  const { news } = useData();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      {news.map((item) => (
        <Link 
          key={item.id}
          to={`/news/${item.slug}`}
          className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow transition-all flex flex-col md:flex-row cursor-pointer group"
        >
          <div className="w-full md:w-1/3 h-40 bg-gray-50 border-r border-gray-100 overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" />
          </div>
          <div className="p-5 flex-1 flex flex-col justify-between text-left">
            <div className="space-y-1.5">
              <div className="text-[9px] text-[#D4AF37] font-black uppercase tracking-wider">{item.category} • {item.date}</div>
              <h4 className="text-xs font-bold text-[#072A6C] leading-snug line-clamp-2 group-hover:text-[#D4AF37] transition-colors">{item.title}</h4>
              <p className="text-[11px] text-gray-500 font-light leading-relaxed line-clamp-2">{item.excerpt}</p>
            </div>
            <span className="text-[10px] font-bold text-[#D4AF37] hover:text-[#072A6C] transition-colors mt-3 inline-block">Read Full Story →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function DynamicPage() {
  const { pathname } = useLocation();
  const { programs, campusLifeContent, newsPageConfig } = useData();
  const content = getPageContent(pathname, programs, newsPageConfig);
  const isManagement = pathname.toLowerCase().startsWith("/management");
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null);

  useEffect(() => {
    document.title = `${content.title} | Chalapathi University`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, content.title]);

  const cleanPath = pathname.toLowerCase().replace(/\/$/, "");
  const isCampusLife = cleanPath.startsWith("/campus-life");

  const campusPage = campusLifeContent ? (campusLifeContent[cleanPath] || campusLifeContent["/campus-life"]) : undefined;

  if (isCampusLife && campusPage) {
    const galleryItems = campusPage.gallery && campusPage.gallery.length > 0 ? campusPage.gallery : [
      "/gallery_annual_fest.png",
      "/gallery_sports_meet.png",
      "/gallery_tech_events.png",
      "/gallery_nss_activities.png",
      "/gallery_cultural_events.png",
      "/gallery_workshops.png",
      "/campus_hero.png",
      "/campus_placement.png"
    ];

    return (
      <div className="flex-grow w-full bg-white font-[var(--font-poppins)] overflow-hidden">
        {/* Hero Banner with University Red Gradient Overlay */}
        <div 
          className="relative h-[360px] md:h-[480px] w-full flex items-center justify-start bg-cover bg-center"
          style={{ backgroundImage: `url(${campusPage.heroImage || "/campus_hero.png"})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#D71920]/90 via-[#072A6C]/85 to-transparent z-10" />
          <div className="max-w-[1440px] mx-auto w-full px-5 relative z-20 text-white flex flex-col justify-center h-full">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#F4B400] mb-2">CAMPUS LIFE</span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight uppercase animate-fade-in">{campusPage.title}</h1>
            <p className="text-sm md:text-lg max-w-2xl text-white/90 leading-relaxed font-medium">{campusPage.desc}</p>
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-5 py-12 md:py-20 space-y-16 md:space-y-24">
          {/* Section 1: Campus Overview Video (if hasVideo is true) */}
          {campusPage.hasVideo && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div 
                onClick={() => setPlayingVideo(campusPage.videoUrl || "/chalapathi_logo_intro.mp4")}
                className="lg:col-span-7 relative group rounded-[20px] overflow-hidden shadow-xl aspect-video bg-gray-900 border border-gray-100 cursor-pointer"
              >
                <img 
                  src={campusPage.videoThumbnail || "/campus_life_bg.png"} 
                  alt="Video Thumbnail"
                  onError={(e) => { e.currentTarget.src = "/campus_life_bg.png"; }}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingVideo(campusPage.videoUrl || "/chalapathi_logo_intro.mp4");
                    }}
                    className="w-16 h-16 rounded-full bg-[#D4AF37] hover:bg-[#C9A84C] text-white flex items-center justify-center shadow-lg transition-transform duration-300 transform group-hover:scale-110 cursor-pointer"
                  >
                    <span className="ml-1 text-2xl">▶</span>
                  </button>
                </div>
              </div>
              <div className="lg:col-span-5 space-y-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#072A6C] tracking-tight uppercase">
                  {campusPage.videoTitle || "EXPERIENCE CHALAPATHI"}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {campusPage.videoDesc || "Take a virtual guided tour of our green campus corridors, advanced pharmacy laboratories, academic buildings, and standard sporting environments that empower ambitious student minds."}
                </p>
              </div>
            </div>
          )}

          {/* Highlights Grid (if highlights are present) */}
          {campusPage.highlights && campusPage.highlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {campusPage.highlights.map((h, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-[20px] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#D4AF37]" />
                  <h3 className="font-extrabold text-[#072A6C] text-sm mb-2 group-hover:text-[#D4AF37] transition-colors">{h.title}</h3>
                  <p className="text-xs text-black font-semibold leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Stats Bar (if statistics are present) */}
          {campusPage.stats && campusPage.stats.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-[#072A6C] text-white p-8 rounded-[20px] shadow-lg">
              {campusPage.stats.map((s, i) => (
                <div key={i} className="text-center space-y-1">
                  <div className="text-2xl md:text-4xl font-black text-[#F4B400]">{s.value}</div>
                  <div className="text-xs text-blue-200 font-bold uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Content Sections */}
          {campusPage.sections && campusPage.sections.map((sect, i) => (
            <div key={i} className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={`lg:col-span-6 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img 
                  src={sect.image} 
                  alt={sect.title}
                  onError={(e) => { e.currentTarget.src = "/campus_hero.png"; }}
                  className="rounded-[20px] shadow-lg w-full h-[280px] md:h-[360px] object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="lg:col-span-6 space-y-4">
                <h3 className="text-xl md:text-2xl font-black text-[#072A6C] uppercase tracking-tight">{sect.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium">{sect.desc}</p>
              </div>
            </div>
          ))}

          {/* Responsive Gallery section with Lightbox */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#072A6C] tracking-tight uppercase">{campusPage.title} GALLERY</h2>
              <p className="text-xs text-gray-400 mt-2 font-medium">Hover to expand and click to view full screen imagery.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryItems.map((imgUrl, i) => (
                <div 
                  key={i} 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedImage(imgUrl);
                  }}
                  className="h-[180px] md:h-[220px] rounded-[20px] overflow-hidden shadow-sm hover:shadow-md cursor-pointer relative group bg-gray-100"
                >
                  <img 
                    src={imgUrl} 
                    alt={`${campusPage.title} Gallery Photo ${i + 1}`} 
                    onError={(e) => { e.currentTarget.src = "/gallery_tech_events.png"; }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-extrabold text-sm">
                    VIEW IMAGE
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Player Modal */}
        {playingVideo && createPortal(
          <div 
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setPlayingVideo(null)}
          >
            <div 
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setPlayingVideo(null)}
                className="absolute top-4 right-4 text-white bg-[#D4AF37] hover:bg-[#C9A84C] w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer z-10 shadow-lg"
              >
                ✕
              </button>
              <video 
                src={playingVideo} 
                controls 
                autoPlay 
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
          </div>,
          document.body
        )}

        {/* Lightbox Modal */}
        {selectedImage && createPortal(
          <div 
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 text-white bg-[#D4AF37] hover:bg-[#C9A84C] w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg cursor-pointer z-10 shadow-lg"
            >
              ✕
            </button>
            <img 
              src={selectedImage} 
              alt="Expanded View" 
              onError={(e) => { e.currentTarget.src = "/campus_hero.png"; }}
              className="max-w-full max-h-[85vh] rounded-[16px] object-contain shadow-2xl animate-fade-in cursor-default" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
      </div>
    );
  }

  // Generate breadcrumb links based on path segments
  const pathSegments = pathname.split("/").filter((x) => x);

  return (
    <div className="flex-1 w-full bg-[#F7F8FC] py-10 font-[var(--font-poppins)]">
      <div className="max-w-[1440px] mx-auto px-5">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 bg-white py-2.5 px-4 rounded-full border border-gray-100 shadow-sm w-fit">
          <Link to="/" className="hover:text-[#D4AF37] flex items-center gap-1 transition-colors">
            <Home size={12} /> Home
          </Link>
          {pathSegments.map((segment, index) => {
            const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const isLast = index === pathSegments.length - 1;
            const cleanLabel = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

            return (
              <React.Fragment key={url}>
                <ChevronRight size={10} className="text-gray-300 shrink-0" />
                {isLast ? (
                  <span className="text-gray-600 font-semibold truncate max-w-[150px]">{cleanLabel}</span>
                ) : (
                  <Link to={url} className="hover:text-[#D4AF37] transition-colors shrink-0">
                    {cleanLabel}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Layout Cards */}
        <div className="space-y-8">
          {/* Main Info */}
          <motion.div
            className="bg-white border border-gray-200/60 rounded-[16px] p-6 md:p-8 shadow-sm w-full"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!content.hideHeader && (
              <>
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">{content.category}</span>
                <h1 className="text-[28px] md:text-[34px] font-[800] text-[#072A6C] leading-snug tracking-tight mb-4">
                  {content.title}
                </h1>
                <p className="text-[14px] text-gray-500 leading-relaxed font-light mb-8 pb-6 border-b border-gray-100">
                  {content.desc}
                </p>
              </>
            )}
            <div>
              {content.body}
            </div>
          </motion.div>

          {/* Horizontal Quick Info box at the bottom of every page */}
          {!isManagement && (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Quick Navigation Card */}
              <div className="bg-[#072A6C] text-white rounded-[16px] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm mb-3 uppercase tracking-wider text-left">Quick Navigation</h3>
                  <ul className="grid grid-cols-2 gap-2.5 text-xs text-blue-200 text-left">
                    <li><Link to="/about/genesis" className="hover:text-white transition-colors flex items-center justify-between">About Institution <ArrowRight size={10} /></Link></li>
                    <li><Link to="/academics/programmes" className="hover:text-white transition-colors flex items-center justify-between">Academic Programs <ArrowRight size={10} /></Link></li>
                    <li><Link to="/admissions/fees" className="hover:text-white transition-colors flex items-center justify-between">Enrollment & Fees <ArrowRight size={10} /></Link></li>
                    <li><Link to="/placements" className="hover:text-white transition-colors flex items-center justify-between">Placements & Statistics <ArrowRight size={10} /></Link></li>
                    <li className="col-span-2"><Link to="/contact" className="hover:text-white transition-colors flex items-center justify-between">Contact Support <ArrowRight size={10} /></Link></li>
                  </ul>
                </div>
              </div>

              {/* Helpdesk Card */}
              <div className="bg-white border border-gray-200/80 rounded-[16px] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
                <div className="space-y-1 sm:max-w-[65%]">
                  <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">Admission Helpdesk</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">Have questions about registration, courses, or hostels? Reach our advisors directly.</p>
                </div>
                <Link to="/contact" className="h-11 px-6 bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 outline-none border-none cursor-pointer">
                  <Phone size={14} /> Call Counselor
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Artificial Intelligence & ML",
  "Data Science",
  "School of Pharmacy",
  "School of Management"
];

interface FacultyMember {
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

const getAvatarUrl = (initials: string): string => {
  if (initials && (initials.startsWith("data:") || initials.startsWith("http") || initials.startsWith("/"))) {
    return initials;
  }
  const avatarMap: Record<string, string> = {
    "YVA": "/chairman_v4.png",
    "YSK": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    "KPR": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "TS": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "PVR": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    "AKK": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    "KJ": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    "BS": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    "DSR": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    "KC": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    "SV": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "PR": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "SK": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    "MH": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    "GM": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    "RK": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    "YVK": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    "TA": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    "VS": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "SKR": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "NL": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    "LRK": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    "SL": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    "PSM": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    "GR": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "MSR": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    "KR": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "VP": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    "GS": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    "PN": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "KSR": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    "KA": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    "MR": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "PK": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    "KHP": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    "KS": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    "TK": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "KV": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "MRK": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    "BR": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    "PSR": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "KN": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "TP": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    "SR": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    "KP": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  };

  return avatarMap[initials] || `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=072A6C&color=fff&size=256&font-size=0.35&bold=true`;
};

// FACULTY_DATA is managed dynamically from DataContext

const BOARD_DEPARTMENTS = [
  "Governing Council",
  "Chancellor",
  "Pro Chancellor",
  "Vice Chancellor",
  "Registrar",
  "Dean – Academic Affairs",
  "Dean – Research & Innovation",
  "Dean – Student Affairs",
  "Dean – Faculty Affairs",
  "Dean – Admissions",
  "Dean – Placements & Relations",
  "Finance Officer",
  "Controller of Examinations"
];

// BOARD_DATA is managed dynamically from DataContext

const BOARD_MODAL_DETAILS: Record<string, {
  office: string;
  specialization: string;
  officeLocation: string;
  leadershipSince: string;
  reportingOffice: string;
  about: string;
  responsibilities: string[];
  initiatives: string[];
}> = {
  "Governing Council": {
    office: "Apex Governance Suite, CCU Admin Block",
    specialization: "Educational Leadership & Strategic Management",
    officeLocation: "Suite 501, 5th Floor, Main Building",
    leadershipSince: "2018",
    reportingOffice: "Supreme Governing Body",
    about: "The Governing Council is the apex policy-making body of City Chalapathi University, responsible for defining the institution's long-term vision, governance framework, academic excellence, financial oversight, and strategic growth. The council ensures that the university maintains the highest standards in education, research, innovation, industry collaboration, and social responsibility while aligning with national and international higher education practices.",
    responsibilities: ["Strategic Planning", "University Governance", "Financial Oversight", "Policy Development", "Institutional Expansion", "Stakeholder Relations", "Regulatory Compliance", "Accreditation Oversight"],
    initiatives: ["Accreditation Milestones", "Infrastructure Modernization", "Financial Sustainability Plan"]
  },
  "Chancellor": {
    office: "Chancellor's Secretariat, CCU Campus",
    specialization: "Corporate Governance & Higher Education Strategy",
    officeLocation: "Executive Wing, Ground Floor, Admin Block",
    leadershipSince: "2018",
    reportingOffice: "Board of Trustees",
    about: "The Chancellor serves as the ceremonial head and guiding authority of City Chalapathi University, providing strategic leadership and preserving the institution's vision and values. The Chancellor inspires academic excellence, innovation, ethical governance, and global collaborations while supporting the university's mission of creating future-ready graduates and advancing impactful research.",
    responsibilities: ["Academic Leadership", "Strategic Visioning", "Preservation of Values", "Global Collaborations", "Ethical Governance", "Honorary Degrees Approval", "Convocation Presiding", "Institutional Advisory"],
    initiatives: ["Global Partnerships Alliance", "Research Endowment Fund", "Green Campus Master Plan"]
  },
  "Pro Chancellor": {
    office: "Office of the Pro Chancellor",
    specialization: "Academic Administration & Institutional Growth",
    officeLocation: "Executive Wing, 1st Floor, Admin Block",
    leadershipSince: "2019",
    reportingOffice: "Chancellor's Office",
    about: "The Pro Chancellor assists the Chancellor in steering the university's long-term development and institutional expansion. Working closely with university leadership, the Pro Chancellor promotes academic innovation, infrastructure growth, industry partnerships, and international collaborations while ensuring that the university continues to achieve excellence in higher education.",
    responsibilities: ["Infrastructure Growth", "Industry Partnerships", "Strategic Expansion Liaison", "Academic Innovation Advocacy", "Leadership Support", "Policy Implementation Coordination", "Development Projects Review"],
    initiatives: ["Smart Classroom Initiative", "Industry-Immersion Labs", "Alumni Connect Drive"]
  },
  "Vice Chancellor": {
    office: "Vice Chancellor's Office",
    specialization: "Institutional Leadership & Research Planning",
    officeLocation: "First Floor, Admin Block",
    leadershipSince: "2020",
    reportingOffice: "Chancellor / Governing Council",
    about: "The Vice Chancellor is the chief executive and academic leader of City Chalapathi University, responsible for the overall administration, academic planning, research initiatives, faculty development, and institutional governance. The Vice Chancellor leads the university toward academic distinction by fostering innovation, interdisciplinary learning, quality assurance, and global engagement.",
    responsibilities: ["Overall Administration", "Academic Planning", "Research Ecosystem Promotion", "Faculty Development", "Institutional Governance Leadership", "Interdisciplinary Learning Advocacy", "Quality Assurance", "Internationalization"],
    initiatives: ["Curriculum Revamp (OBE)", "Center for AI Innovation", "Faculty Research Grant Program"]
  },
  "Registrar": {
    office: "Registrar Secretariat",
    specialization: "Statutory Governance & Compliance Management",
    officeLocation: "Ground Floor, Registrar Wing, Admin Block",
    leadershipSince: "2020",
    reportingOffice: "Vice Chancellor",
    about: "The Registrar oversees the administrative and statutory operations of the university while ensuring compliance with academic regulations and government policies. The office manages institutional records, university communications, legal documentation, governance processes, examinations administration, and student services to maintain efficient and transparent university operations.",
    responsibilities: ["Statutory Compliance Operations", "University Records Custodian", "Legal Affairs Management", "Administrative Coordination", "Academic Registries Oversight", "Communications and Publications", "Official Seal Custody"],
    initiatives: ["Digital Paperless Administration", "Legal Framework Overhaul", "Statutory Archive Portal"]
  },
  "Dean – Academic Affairs": {
    office: "Academic Affairs Cell",
    specialization: "Curriculum Design & Quality Assurance",
    officeLocation: "Academic Wing, 2nd Floor, Main Block",
    leadershipSince: "2021",
    reportingOffice: "Vice Chancellor",
    about: "The Dean of Academic Affairs is responsible for curriculum planning, academic regulations, teaching quality, Outcome-Based Education (OBE), examination coordination, and continuous academic improvement. The office ensures that all academic programs meet national accreditation standards while delivering a modern, industry-oriented learning experience.",
    responsibilities: ["Curriculum Development", "Academic Calendar Management", "Teaching Quality Auditing", "Outcome-Based Education Framework", "Accreditation Alignment (NAAC/NBA)", "Board of Studies Coordination", "Academic Audit Processes"],
    initiatives: ["Outcome-Based Assessment Model", "Multi-Disciplinary Electives Program", "Digital Exam Management Suite"]
  },
  "Dean – Research & Innovation": {
    office: "Research & Development Center",
    specialization: "IPR, Technology Transfer & Sponsored Research",
    officeLocation: "R&D Block, 3rd Floor",
    leadershipSince: "2021",
    reportingOffice: "Vice Chancellor",
    about: "The Dean of Research & Innovation leads the university's research ecosystem by encouraging interdisciplinary research, sponsored projects, patents, technology transfer, entrepreneurship, innovation, and incubation activities. The office actively supports faculty and students in creating impactful research that addresses real-world challenges.",
    responsibilities: ["Research Ecosystem Guidance", "IPR & Patent Filing", "Sponsored Projects Funding", "Start-up Incubation Mentorship", "Seed Grant Approvals", "Ethics Committee Convener", "Journal Indexing Standards"],
    initiatives: ["Patent Incubation Lab", "Interdisciplinary Research Clusters", "Research Incentive Framework"]
  },
  "Dean – Student Affairs": {
    office: "Student Welfare Office",
    specialization: "Student Development & Community Engagement",
    officeLocation: "Student Center, Room 102",
    leadershipSince: "2022",
    reportingOffice: "Vice Chancellor",
    about: "The Dean of Student Affairs oversees student welfare, leadership development, cultural activities, sports, professional societies, clubs, hostels, counselling services, and alumni engagement. The office is committed to creating a vibrant campus environment that supports holistic development beyond academics.",
    responsibilities: ["Student Welfare Coordination", "Cultural and Sports Events Coordination", "Professional Clubs Guidance", "Hostel Management Coordination", "Anti-Ragging Compliance", "Counselling and Support Services", "Alumni Association Engagement"],
    initiatives: ["Annual Tech-Cultural Fest", "Campus Wellness & Fitness Initiative", "Alumni Mentorship Network"]
  },
  "Dean – Faculty Affairs": {
    office: "Faculty Welfare & Development Wing",
    specialization: "Talent Acquisition & Performance Metrics",
    officeLocation: "Admin Block, Suite 203",
    leadershipSince: "2021",
    reportingOffice: "Vice Chancellor",
    about: "The Dean of Faculty Affairs manages faculty recruitment, professional development, performance evaluation, promotions, research support, and academic leadership initiatives. The office works toward building a highly qualified faculty community dedicated to excellence in teaching, research, innovation, and mentorship.",
    responsibilities: ["Faculty Recruitment Drives", "Performance Evaluation Framework", "Professional Development Camps", "Faculty Welfare Schemes", "Research Fellowships Allocation", "Conflict Resolution", "Academic Promotions Advisory"],
    initiatives: ["Faculty Induction Program", "Pedagogical Training Camps", "Dean's Excellence Awards"]
  },
  "Dean – Admissions": {
    office: "Admissions Center",
    specialization: "Enrollment Management & Outreach Campaigns",
    officeLocation: "Ground Floor, Entrance Wing, Admin Block",
    leadershipSince: "2021",
    reportingOffice: "Vice Chancellor",
    about: "The Dean of Admissions supervises the university's admission process, scholarship programs, student enrollment, counseling activities, international admissions, and outreach initiatives. The office ensures a transparent, merit-based admission system while attracting talented students from across India and abroad.",
    responsibilities: ["Admissions Strategy & Campaigns", "Enrollment Processing", "Scholarship Allocation Schemes", "Outreach Program Coordination", "International Applications Counseling", "Merit List Computations", "Helpdesk Operations Support"],
    initiatives: ["National Admissions Expo Tour", "Merit Scholarship Portal", "Instant Verification Desks"]
  },
  "Dean – Placements & Relations": {
    office: "Placement & Corporate Relations Cell",
    specialization: "Corporate Engagement, Placement Drives & Soft Skills Training",
    officeLocation: "Placement Block, 2nd Floor",
    leadershipSince: "2022",
    reportingOffice: "Vice Chancellor",
    about: "The Dean of Placements & Corporate Relations develops strong partnerships with industries, multinational companies, startups, and research organizations. The office coordinates internships, campus recruitment drives, career guidance, skill development programs, industry interactions, and placement training to enhance student employability.",
    responsibilities: ["Placement Campaigns & Recruitment Drive Coordination", "Industry MoUs & Strategic Alliances", "Career Guidance Support", "Soft Skills Training Programs", "Internship Drives Coordination", "Alumni Network Placements Link", "Employability Assessment Tools"],
    initiatives: ["Mega Campus Hiring Fair", "Corporate Advisory Committee", "Pre-Placement Bootcamps"]
  },
  "Finance Officer": {
    office: "Finance Office",
    specialization: "Fiscal Planning, Audits & Regulatory Accounts",
    officeLocation: "Accounts Wing, Ground Floor, Admin Block",
    leadershipSince: "2023",
    reportingOffice: "Vice Chancellor / Registrar",
    about: "The Finance Officer manages the university's financial planning, budgeting, auditing, accounting operations, payroll administration, procurement oversight, and regulatory compliance. The office ensures responsible financial governance while supporting the university's academic, research, and infrastructure development goals.",
    responsibilities: ["Annual Budget Formulation", "Accounting Operations Oversight", "Regulatory Accounts Auditing", "Payroll Processing Coordination", "Procurement Committee Audit", "Fund Management & Investments", "Grant Funding Compliance"],
    initiatives: ["ERP-based Financial Operations", "Online Student Fees Portal", "Energy-Cost Rationalization Audit"]
  },
  "Controller of Examinations": {
    office: "Office of the COE",
    specialization: "Confidential Assessment Systems & Grading Frameworks",
    officeLocation: "COE Block, Secured Wing",
    leadershipSince: "2023",
    reportingOffice: "Vice Chancellor",
    about: "The Controller of Examinations is responsible for conducting examinations, evaluation processes, result publication, academic records, degree certifications, transcripts, and examination policies. The office ensures confidentiality, transparency, fairness, and efficiency throughout the university's assessment and certification system.",
    responsibilities: ["Examinations Conduction Oversight", "Evaluation Coordination & Processing", "Result Publication Framework", "Grade Sheets & Degree Certificates Delivery", "Assessment Standards Control", "Confidential Printing Operations", "Student Evaluation Grievance Desk"],
    initiatives: ["Secure Digital Evaluation Portal", "Quick Grade Card Dispatch", "CCTV Examination Surveillance Suite"]
  }
};

function BoardDirectory() {
  const { boardData } = useData();
  const [selectedFaculty, setSelectedFaculty] = React.useState<FacultyMember | null>(null);

  // Extract all board members from BOARD_DEPARTMENTS
  const allMembers = BOARD_DEPARTMENTS.map(dept => boardData[dept]?.hod).filter(Boolean);

  return (
    <div className="font-[var(--font-poppins)] text-center w-full mt-8">
      {/* Grid Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allMembers.map((member, index) => (
          <div 
            key={index}
            onClick={() => setSelectedFaculty(member)}
            className="flex flex-col bg-[#f8f9fa] shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
          >
            {/* Avatar / Photo */}
            <div className="w-full aspect-[4/5] bg-gray-200 overflow-hidden relative">
              <img 
                src={getAvatarUrl(member.avatar)} 
                alt={member.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>

            {/* Details */}
            <div className="py-5 px-3">
              <h5 className="font-extrabold text-gray-900 text-[16px] leading-tight group-hover:text-[#8B0000] transition-colors">
                {member.name}
              </h5>
              <span className="text-[13px] text-gray-500 mt-1 block">
                {member.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Details Modal */}
      {selectedFaculty && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedFaculty(null)}
        >
          <div 
            className="bg-white w-full max-w-[550px] overflow-hidden shadow-2xl relative flex flex-col text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedFaculty(null)}
              className="absolute top-3 right-3 z-10 text-gray-300 hover:text-gray-500 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="pt-8 pb-5 px-8 bg-[#fafafa] border-b border-gray-100">
              <h3 className="text-xl md:text-2xl font-normal text-[#8B0000] leading-tight">
                {selectedFaculty.name}, {selectedFaculty.title}
              </h3>
            </div>

            <div className="p-8 relative bg-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <div className="w-56 h-auto md:w-64 mx-auto shadow-md border-4 border-white">
                <img 
                  src={getAvatarUrl(selectedFaculty.avatar)} 
                  alt={selectedFaculty.name} 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <p className="text-[14px] md:text-[15px] text-gray-600 mt-8 leading-loose text-justify">
                {selectedFaculty.name}, {selectedFaculty.edu}, is renowned for their focus on {selectedFaculty.interests.toLowerCase()} and educational excellence. With {selectedFaculty.experience} in educational management and leadership, they continue to drive forward the institution's core mission and global footprint.
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

const STAFF_DEPARTMENTS = [
  "Registrar Office",
  "Academic Affairs",
  "Finance & Accounts",
  "General Administration",
  "Establishment",
  "Admissions Office",
  "Examination Cell",
  "Placement Office",
  "Library",
  "Computer Centre",
  "Research Office",
  "Purchase & Stores",
  "Estate Office",
  "Public Relations",
  "Student Affairs",
  "Transport",
  "Health Centre",
  "Guest House",
  "Sports Office"
];

// STAFF_DATA is managed dynamically from DataContext

function StaffDirectory() {
  const { staffData } = useData();
  const [selectedDept, setSelectedDept] = React.useState("Registrar Office");
  const [selectedFaculty, setSelectedFaculty] = React.useState<FacultyMember | null>(null);
  
  const activeDept = staffData[selectedDept] || staffData["Registrar Office"] || { hod: {} as FacultyMember, others: [] };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-[var(--font-poppins)] text-left w-full mt-4">
      {/* Left Sidebar */}
      <div className="lg:col-span-4 flex flex-col border border-gray-200 bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100 p-2 min-h-[580px] justify-between">
        <div>
          <h4 className="text-xs font-black text-[#072A6C] tracking-widest uppercase p-4 border-b border-gray-100">Administrative Staff</h4>
          <div className="flex flex-col gap-1 mt-2">
            {STAFF_DEPARTMENTS.map((dept) => {
              const isActive = dept === selectedDept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`w-full text-left px-5 py-3 text-xs font-extrabold transition-all outline-none cursor-pointer flex items-center justify-between border-l-4 rounded-xl ${
                    isActive 
                      ? "bg-[#D4AF37]/5 text-[#D4AF37] border-[#D4AF37] shadow-sm" 
                      : "text-[#072A6C] hover:bg-gray-50 border-transparent"
                  }`}
                >
                  <span>{dept}</span>
                  <ChevronRight size={14} className={isActive ? "text-[#D4AF37]" : "text-gray-300"} />
                </button>
              );
            })}
          </div>
        </div>
        <div className="p-4 bg-gray-50/50 rounded-xl text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center border-t border-gray-100">
          City Chalapathi Staff Directory
        </div>
      </div>

      {/* Right Content */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Unit Head */}
        {activeDept.hod && (
          <div className="space-y-4 flex flex-col items-center">
            <h4 className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-wider text-center">Unit Head</h4>
            <div 
              onClick={() => setSelectedFaculty(activeDept.hod)}
              className="bg-white border-2 border-[#D4AF37] rounded-[16px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer relative group w-full max-w-[340px] min-h-[300px]"
            >
              <div className="absolute top-3 right-3 bg-[#D4AF37] text-gray-900 font-extrabold text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                Head
              </div>

              <div className="w-48 h-48 rounded-lg border-2 border-gray-100 bg-[#072A6C]/5 flex items-center justify-center font-black text-4xl text-[#072A6C] shadow-inner mb-4 group-hover:border-[#D4AF37] transition-all select-none overflow-hidden">
                <img src={getAvatarUrl(activeDept.hod.avatar)} alt={activeDept.hod.name} className="w-full h-full object-cover" />
              </div>

              <h5 className="font-extrabold text-[#072A6C] text-sm leading-snug tracking-tight">
                {activeDept.hod.name}
              </h5>
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider mt-1 block">
                {activeDept.hod.title}
              </span>
            </div>
          </div>
        )}

        {/* Other Unit Members */}
        {activeDept.others && activeDept.others.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-[#072A6C] uppercase tracking-wider">Unit Staff Members</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {activeDept.others.map((faculty, fIdx) => (
                <div 
                  key={fIdx}
                  onClick={() => setSelectedFaculty(faculty)}
                  className="bg-white border border-gray-200/80 rounded-[16px] p-6 shadow-sm hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer group min-h-[260px]"
                >
                  <div className="w-40 h-40 rounded-lg border-2 border-gray-100 bg-[#072A6C]/5 flex items-center justify-center font-black text-3xl text-[#072A6C] shadow-inner mb-4 group-hover:border-[#D4AF37] transition-all select-none overflow-hidden">
                    <img src={getAvatarUrl(faculty.avatar)} alt={faculty.name} className="w-full h-full object-cover" />
                  </div>

                  <h5 className="font-extrabold text-[#072A6C] text-xs leading-snug tracking-tight">
                    {faculty.name}
                  </h5>
                  <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-wider mt-1 block">
                    {faculty.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Staff Details Modal */}
      {selectedFaculty && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedFaculty(null)}
        >
          <div 
            className="bg-white w-full max-w-[500px] rounded-[24px] overflow-hidden shadow-2xl relative flex flex-col text-left border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedFaculty(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer outline-none border-none"
            >
              <X size={18} />
            </button>

            <div className="bg-[#072A6C] text-white py-8 px-6 text-center relative border-b-4 border-[#D4AF37]">
              <div className="w-20 h-20 rounded-lg border-2 border-[#D4AF37] bg-white text-[#072A6C] flex items-center justify-center font-black text-2xl shadow-md mx-auto mb-3 select-none overflow-hidden">
                <img src={getAvatarUrl(selectedFaculty.avatar)} alt={selectedFaculty.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg md:text-xl font-black tracking-tight">{selectedFaculty.name}</h3>
              <p className="text-[10px] text-[#D4AF37] mt-1 font-black uppercase tracking-widest">{selectedFaculty.title}</p>
            </div>

            <div className="p-6 space-y-4 text-xs text-gray-600">
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-wider block">Employee ID</span>
                  <span className="font-bold text-gray-700">{selectedFaculty.idNo}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-wider block">Office Department</span>
                  <span className="font-bold text-gray-700">{selectedFaculty.department}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-wider block">Experience</span>
                  <span className="font-bold text-gray-700">{selectedFaculty.experience}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-wider block">Qualification</span>
                <p className="font-medium leading-relaxed text-[11px] text-gray-700">
                  {selectedFaculty.edu}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-wider block">Responsibilities</span>
                <p className="font-light leading-relaxed text-[11px] text-gray-700">
                  {selectedFaculty.interests}
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-start items-center text-[11px] text-gray-500 font-semibold">
                <div className="flex items-center gap-2 truncate">
                  <Mail size={13} className="text-[#D4AF37] shrink-0" />
                  <span className="truncate" title={selectedFaculty.email}>{selectedFaculty.email}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedFaculty(null)}
                className="h-9 px-6 bg-[#072A6C] hover:bg-[#072A6C]/90 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function FacultyDirectory() {
  const { facultyData } = useData();
  
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  
  let schoolName = "School of Computing Sciences";
  let departmentsToShow: string[] = [];

  if (path.includes("computing")) {
    schoolName = "School of Computing Sciences";
    departmentsToShow = [
      "Computer Science & Engineering", 
      "Artificial Intelligence", 
      "Artificial Intelligence & ML",
      "Data Science", 
      "Cyber Security"
    ];
  } else if (path.includes("engineering")) {
    schoolName = "School of Engineering";
    departmentsToShow = [
      "Electronics and Communication Engineering", 
      "Electronics & Communication Engineering", 
      "Civil Engineering", 
      "Basic Science & Humanities"
    ]; 
  } else if (path.includes("business")) {
    schoolName = "School of Business & Management";
    departmentsToShow = [
      "Business and Management",
      "School of Management"
    ];
  } else {
    schoolName = "Our Esteemed Faculty";
    departmentsToShow = [
      "Computer Science & Engineering", 
      "Artificial Intelligence", 
      "Artificial Intelligence & ML",
      "Data Science", 
      "Cyber Security",
      "Electronics and Communication Engineering", 
      "Electronics & Communication Engineering", 
      "Civil Engineering", 
      "Basic Science & Humanities",
      "Business and Management",
      "School of Management"
    ];
  }

  // Flatten the faculty lists for the selected departments
  const allFacultyMembers: FacultyMember[] = [];
  const seenNames = new Set<string>();

  departmentsToShow.forEach(dept => {
    const dData = facultyData[dept];
    if (dData) {
      if (dData.hod && dData.hod.name) {
        const key = dData.hod.name.toLowerCase().trim();
        if (!seenNames.has(key)) {
          seenNames.add(key);
          allFacultyMembers.push(dData.hod);
        }
      }
      if (dData.others && Array.isArray(dData.others)) {
        dData.others.forEach(mem => {
          if (mem && mem.name) {
            const key = mem.name.toLowerCase().trim();
            if (!seenNames.has(key)) {
              seenNames.add(key);
              allFacultyMembers.push(mem);
            }
          }
        });
      }
    }
  });

  return (
    <div className="font-[var(--font-poppins)] text-left w-full mt-8">
      {/* Title */}
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-black text-[#072A6C] uppercase tracking-wider">{schoolName}</h3>
      </div>

      {allFacultyMembers.length === 0 ? (
        <div className="text-center py-12 text-gray-500 font-medium bg-gray-50 rounded-xl">
          Faculty records are currently being updated for this school.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allFacultyMembers.map((faculty, fIdx) => (
            <div 
              key={fIdx}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-5 group min-h-[140px]"
            >
              {/* Photo */}
              <div className="w-[100px] h-[110px] shrink-0 rounded-lg overflow-hidden bg-[#072A6C]/5 border border-gray-100 shadow-inner flex items-center justify-center">
                <img 
                  src={getAvatarUrl(faculty.avatar)} 
                  alt={faculty.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              
              {/* Info */}
              <div className="flex flex-col flex-1 justify-center">
                <h4 className="text-[14px] font-black text-[#072A6C] uppercase leading-snug mb-1 group-hover:text-red-800 transition-colors">
                  {faculty.name}
                </h4>
                <p className="text-[12px] font-bold text-red-700/90 uppercase tracking-wider mb-1">
                  {faculty.title.replace("HOD & ", "").replace("Principal & ", "")}
                </p>
                <p className="text-[11px] font-semibold text-red-600/70">
                  {faculty.edu.split('-')[0].trim()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* 🌟 FACULTY DETAILS MODAL POPUP (CENTERED LAYOUT)          */}
      {/* ======================================================== */}
      {/* Modal removed as per user request */}
    </div>
  );
}

const LEADERS = [
  {
    name: "Sri Y. V. Anjaneyulu",
    title: "Chancellor",
    edu: "Renowned Educationist & Founder Sponsor Representative",
    avatar: "YVA",
    interests: "Strategic leadership, academic governance, public relations, and legal policies.",
    bio: "Sri Y. V. Anjaneyulu, a visionary educationist and prominent leader, has been the guiding force behind the establishment and development of Chalapathi University. With over 35 years of experience in administrative leadership, he has spearheaded numerous educational and social initiatives in the Guntur district. As Chancellor, he focuses on strategic growth, long-term policy formulation, infrastructure advancement, and cultivating partnerships with industries and global institutions to ensure academic quality and values-driven education.",
    phone: "+91 863 2345401",
    email: "chancellor@city.ac.in",
    address: "Chalapathi Nagar, Lam, Guntur, Andhra Pradesh - 522034"
  },
  {
    name: "Sri Y. Sujit Kumar",
    title: "Pro Chancellor",
    edu: "M.Tech & MBA - Executive Education",
    avatar: "YSK",
    interests: "Institutional progress planning, modernization initiatives, and industry collaborations.",
    bio: "Sri Y. Sujit Kumar holds a postgraduate degree in engineering and executive education in management. As Pro Chancellor, he works closely with the governing board to implement modernization initiatives, digital transformation of the campus, and strategic expansion projects. With 18 years of experience, he leads university-industry collaborations, global academic partnerships, and entrepreneurship programs, preparing students for dynamic international careers.",
    phone: "+91 863 2345402",
    email: "prochan@city.ac.in",
    address: "Chalapathi Nagar, Lam, Guntur, Andhra Pradesh - 522034"
  },
  {
    name: "Dr. K. Prasad Rao",
    title: "Vice Chancellor",
    edu: "Ph.D., Former Senior Professor - Administration & Research",
    avatar: "KPR",
    interests: "Curriculum planning coordination, academic excellence, and international relations.",
    bio: "Dr. K. Prasad Rao is an eminent academician and researcher with a Ph.D. and over 30 years of teaching, research, and administrative experience. He has published numerous research papers in international journals and overseen critical accreditation achievements. As Vice Chancellor, he heads academic governance, research direction, outcome-based curricula, and student-centric learning frameworks, steering the university towards national and international prominence.",
    phone: "+91 863 2345403",
    email: "vc@city.ac.in",
    address: "Chalapathi Nagar, Lam, Guntur, Andhra Pradesh - 522034"
  },
  {
    name: "Prof. T. Sivaramaiah",
    title: "Registrar",
    edu: "M.Tech, Ph.D. - Computer Networks",
    avatar: "TS",
    phone: "+91 863 2345404",
    email: "registrar@city.ac.in",
    address: "Chalapathi Nagar, Lam, Guntur, Andhra Pradesh - 522034"
  }
];

function LeadershipView() {
  const { aboutContent } = useData();
  const leadership = aboutContent.leadership;

  return (
    <div className="w-full text-left font-[var(--font-poppins)] overflow-hidden relative bg-white -mt-10 -mx-5 px-5">
      
      {/* SECTION 1 – PREMIUM HERO (Full Viewport Height / Rich Gradient Mesh) */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 md:px-12 overflow-hidden bg-radial from-[#072A6C] via-[#081A36] to-[#020B18] text-white rounded-b-[40px] shadow-2xl">
        {/* Animated Mesh Gradients & Floating Blobs */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-10 left-10 w-[300px] h-[300px] rounded-full bg-[#D4AF37] blur-[150px] animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-[#D4AF37] blur-[200px] animate-pulse" />
          <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] rounded-full bg-[#2563EB] blur-[180px]" />
        </div>

        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Side: Portrait & Floating 3D Bezel */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative group">
              {/* Soft Golden Glow Ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#D71920] opacity-40 blur-2xl group-hover:opacity-75 transition-all duration-500 scale-105" />
              
              {/* 3D Glass Frame bezel */}
              <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] rounded-full p-2.5 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl overflow-hidden transition-transform duration-500 hover:rotate-2 hover:scale-[1.02]">
                <img 
                  src={leadership.chairmanImage || "/chairman_v4.png"} 
                  alt="Chairman" 
                  className="w-full h-full object-cover rounded-full filter saturate-110"
                  style={{ mixBlendMode: "normal", objectPosition: "50% 0%" }}
                />
              </div>
            </div>
          </div>

          {/* Right Side: Large Headings & Titles */}
          <div className="lg:col-span-7 space-y-6">
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-[#D4AF37] inline-block">University Leadership</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase bg-gradient-to-r from-white via-gray-100 to-[#D4AF37] bg-clip-text text-transparent">
              {leadership.chairmanName}
            </h1>
            <p className="text-lg md:text-2xl text-blue-200 font-medium italic">
              {leadership.designation}
            </p>
            <div className="h-[3px] w-24 bg-[#D4AF37] rounded-full" />
            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-extrabold text-white">Chairman's Message</h3>
              <p className="text-xs uppercase tracking-wider text-white font-bold">"{leadership.messageQuote}"</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center gap-1.5 opacity-60">
          <span className="text-[10px] uppercase font-bold tracking-widest text-white">Scroll Down</span>
          <div className="w-1 h-6 bg-white/40 rounded-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#D4AF37] rounded-full animate-infinite-scroll" />
          </div>
        </div>
      </section>

      {/* SECTION 2 – THE MESSAGE BODY (Premium Glassmorphic container) */}
      <section className="py-20 md:py-28 max-w-[1000px] mx-auto px-5 relative z-10">
        <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-16 shadow-2xl relative overflow-hidden group">
          {/* Dynamic soft perimeter glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <span className="text-8xl font-serif text-[#D4AF37] opacity-25 absolute -top-4 -left-2 select-none">“</span>
          
          <div className="relative z-10 space-y-6 text-gray-600 text-[15px] md:text-[17px] leading-relaxed font-medium text-justify">
            {leadership.messageParagraphs.map((pText, pIdx) => (
              <p key={pIdx}>{pText}</p>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2.5 – GOVERNING BOARD MEMBERS */}
      <section className="py-16 max-w-[1440px] mx-auto px-5">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-[#072A6C] tracking-tight uppercase">GOVERNING BOARD MEMBERS</h2>
          <div className="h-1 w-16 bg-[#D4AF37] mx-auto mt-3 rounded-full" />
        </div>
        <BoardDirectory />
      </section>
    </div>
  );
}

function HistoryView() {
  const { aboutContent } = useData();
  const history = aboutContent.history;

  return (
    <div className="space-y-10 text-gray-600 text-[15px] leading-relaxed text-left font-[var(--font-poppins)]">
      <div className="text-left font-[var(--font-poppins)]">
        {history.introText.split('\n\n').map((paragraph, i) => {
          if (paragraph.startsWith("A LEGACY OF EXCELLENCE")) {
            return (
              <h2 key={i} className="text-2xl md:text-3xl font-black text-[#072A6C] flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <span>A LEGACY OF EXCELLENCE</span>
                <span className="bg-gradient-to-r from-[#072A6C] to-[#1F4FA8] text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-[0_4px_12px_rgba(7,42,108,0.15)] tracking-widest uppercase">
                  30+ YEARS IN EDUCATION
                </span>
              </h2>
            );
          }
          if (paragraph.startsWith("ABOUT US")) {
            return (
              <div key={i} className="mt-12 mb-6">
                <span className="bg-[#072A6C]/10 text-[#072A6C] px-4 py-1.5 rounded-md text-xs font-black tracking-[2px] uppercase">
                  ABOUT US
                </span>
              </div>
            );
          }
          if (paragraph.startsWith("A Strong Society")) {
            const [strong, ...rest] = paragraph.split('\n');
            return (
              <div key={i} className="mb-6">
                <h3 className="text-lg font-[800] text-[#D4AF37] mb-3">{strong}</h3>
                <p className="text-gray-600 leading-[1.8] font-light text-[15px]">{rest.join('\n')}</p>
              </div>
            );
          }
          return (
            <p key={i} className="text-gray-600 leading-[1.8] font-light text-[15px] mb-6">
              {paragraph}
            </p>
          );
        })}
      </div>
      
      <div className="border-l-4 border-[#072A6C] pl-4 my-6 italic text-gray-700 font-medium bg-gray-50 py-3.5 pr-3 rounded-r-xl">
        "{history.quoteText}"
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-extrabold text-[#072A6C]">Milestones Journey</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {history.milestones.map((milestone, i) => (
            <div key={i} className="bg-slate-50/50 border border-gray-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:bg-white hover:border-[#072A6C]/20 hover:shadow-md transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 group-hover:bg-[#072A6C] transition-colors" />
              <span className="text-[#072A6C] text-xl font-black block mb-2">{milestone.year}</span>
              <h4 className="font-bold text-[#072A6C] text-sm mb-1.5">{milestone.title}</h4>
              <p className="text-xs text-gray-500 font-normal leading-normal">{milestone.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisionView() {
  const { aboutContent } = useData();
  const vision = aboutContent.vision;

  return (
    <div className="space-y-8 text-left font-[var(--font-poppins)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#072A6C]/5 border border-[#072A6C]/15 rounded-[20px] p-8 shadow-sm flex flex-col justify-between hover:bg-white hover:border-[#072A6C]/30 hover:shadow-md transition-all duration-300 group">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#072A6C]/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
              <Info className="text-[#072A6C]" size={20} />
            </div>
            <h3 className="text-lg font-extrabold text-[#072A6C] mb-3">OUR VISION</h3>
            <p className="text-gray-600 text-[14px] leading-relaxed font-light">
              {vision.visionText}
            </p>
          </div>
        </div>
        <div className="bg-[#1F4FA8]/5 border border-[#1F4FA8]/15 rounded-[20px] p-8 shadow-sm flex flex-col justify-between hover:bg-white hover:border-[#1F4FA8]/30 hover:shadow-md transition-all duration-300 group">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[#1F4FA8]/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105">
              <ShieldCheck className="text-[#1F4FA8]" size={20} />
            </div>
            <h3 className="text-lg font-extrabold text-[#072A6C] mb-3">OUR MISSION</h3>
            <ul className="space-y-2.5 text-gray-600 text-[14px] font-light list-disc pl-4 leading-relaxed">
              {vision.missionList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const FEES_DATA = [
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
];

function AdmissionsApplyFlow() {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    mobile: "",
    state: "Andhra Pradesh",
    password: "",
    otp: "",
    dob: "",
    gender: "Male",
    school: "School of Engineering",
    program: "B.Tech. Computer Science & Eng",
    tenthMarks: "",
    twelfthMarks: "",
    photo: null as File | null,
    marksheet10: null as File | null,
    marksheet12: null as File | null,
    paymentMethod: "UPI",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: ""
  });

  const [otpSent, setOtpSent] = React.useState(false);
  const [timer, setTimer] = React.useState(60);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isPaying, setIsPaying] = React.useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleDownloadReceipt = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Chalapathi_University_Admission_Receipt_${formData.name.replace(/\s+/g, "_")}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
              .header { text-align: center; border-bottom: 2px solid #072A6C; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 26px; font-weight: 800; color: #072A6C; text-transform: uppercase; letter-spacing: 0.5px; }
              .subtitle { font-size: 13px; color: #D4AF37; font-weight: 600; margin-top: 5px; text-transform: uppercase; letter-spacing: 1px; }
              .title { font-size: 18px; font-weight: 700; margin-top: 15px; text-transform: uppercase; color: #222; }
              .section { margin-bottom: 25px; }
              .section-title { font-size: 13px; font-weight: 700; color: #072A6C; border-bottom: 1.5px solid #072A6C; padding-bottom: 4px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
              .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; }
              .item { font-size: 13px; }
              .label { font-weight: 600; color: #555; display: inline-block; width: 120px; }
              .value { color: #111; }
              .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #777; border-top: 1px solid #eee; padding-top: 20px; }
              .receipt-badge { background-color: #10B981; color: white; display: inline-block; padding: 5px 14px; font-size: 11px; font-weight: 700; border-radius: 4px; text-transform: uppercase; margin-top: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Chalapathi University</div>
              <div class="subtitle">Accredited & Visionary Institution</div>
              <div class="title">Admission Application Receipt</div>
              <div class="receipt-badge">Payment Successful</div>
            </div>
            
            <div class="section">
              <div class="section-title">Receipt Information</div>
              <div class="grid">
                <div class="item"><span class="label">Application No:</span> <span class="value" style="font-weight: 700; color: #072A6C;">CC-2026-89421</span></div>
                <div class="item"><span class="label">Date/Time:</span> <span class="value">${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</span></div>
                <div class="item"><span class="label">Transaction ID:</span> <span class="value">TXN_${Math.floor(Math.random() * 900000000 + 100000000)}</span></div>
                <div class="item"><span class="label">Status:</span> <span class="value" style="font-weight: 700; color: #10B981;">PAID</span></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Applicant Details</div>
              <div class="grid">
                <div class="item"><span class="label">Name:</span> <span class="value">${formData.name}</span></div>
                <div class="item"><span class="label">Email:</span> <span class="value">${formData.email}</span></div>
                <div class="item"><span class="label">Mobile:</span> <span class="value">${formData.mobile}</span></div>
                <div class="item"><span class="label">Gender:</span> <span class="value">${formData.gender}</span></div>
                <div class="item"><span class="label">DOB:</span> <span class="value">${formData.dob}</span></div>
                <div class="item"><span class="label">State:</span> <span class="value">${formData.state}</span></div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Academic & Payment Summary</div>
              <div class="grid">
                <div class="item"><span class="label">School:</span> <span class="value">${formData.school}</span></div>
                <div class="item"><span class="label">Program:</span> <span class="value">${formData.program}</span></div>
                <div class="item"><span class="label">Registration Fee:</span> <span class="value" style="font-weight: 700;">₹1,000</span></div>
                <div class="item"><span class="label">Mode of Payment:</span> <span class="value">Online (Gateway)</span></div>
              </div>
            </div>

            <div class="footer">
              <p>This is an official system-generated transaction confirmation from Chalapathi University.</p>
              <p style="font-weight: 600; color: #072A6C; margin-top: 5px;">Thank you for your application!</p>
            </div>
            
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const startOtpFlow = () => {
    if (!formData.name || !formData.email || !formData.mobile) {
      alert("Please fill all fields to continue.");
      return;
    }
    setOtpSent(true);
    setTimer(60);
    handleNext();
  };

  const verifyOtp = () => {
    if (formData.otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      handleNext();
    }, 1500);
  };

  const handleFileUpload = (field: "photo" | "marksheet10" | "marksheet12", files: FileList | null) => {
    if (files && files[0]) {
      setFormData({ ...formData, [field]: files[0] });
    }
  };

  const startUpload = () => {
    if (!formData.photo || !formData.marksheet10 || !formData.marksheet12) {
      alert("Please select all required files to continue.");
      return;
    }
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            handleNext();
          }, 500);
          return 100;
        }
        return p + 30;
      });
    }, 300);
  };

  const processPayment = () => {
    if (formData.paymentMethod === "Card" && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv)) {
      alert("Please fill all card details.");
      return;
    }
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      handleNext();
    }, 2500);
  };

  const steps = [
    { num: 1, label: "Register" },
    { num: 2, label: "Verify" },
    { num: 3, label: "Form" },
    { num: 4, label: "Documents" },
    { num: 5, label: "Payment" }
  ];

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-3xl p-8 shadow-md font-[var(--font-poppins)] text-left">
      {step <= 5 && (
        <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1 flex-1 relative">
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step >= s.num 
                    ? "bg-[#D4AF37] text-white" 
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {s.num}
              </div>
              <span className="text-[10px] font-bold text-gray-500 hidden sm:block uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-base font-extrabold text-[#072A6C] uppercase tracking-wide">Register Yourself</h3>
          <p className="text-xs text-gray-500 font-light mb-4">Create your account to start the digital admission journey.</p>
          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Full Name *</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920] focus:border-[#D4AF37]" 
                placeholder="Enter full name" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Email Address *</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920] focus:border-[#D4AF37]" 
                placeholder="name@domain.com" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Mobile Number *</label>
              <input 
                type="tel" 
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920] focus:border-[#D4AF37]" 
                placeholder="10-digit phone number" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">State *</label>
              <select 
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920] focus:border-[#D4AF37]"
              >
                <option>Andhra Pradesh</option>
                <option>Telangana</option>
                <option>Karnataka</option>
                <option>Tamil Nadu</option>
                <option>Other State</option>
              </select>
            </div>
          </div>
          <button 
            type="button" 
            onClick={startOtpFlow} 
            className="w-full py-3 mt-6 bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
          >
            Register & Send Verification Code
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-base font-extrabold text-[#072A6C] uppercase tracking-wide">Verify Mobile / Email</h3>
          <div className="bg-amber-50 border-l-4 border-[#D4AF37] p-3.5 rounded-r-xl text-[11.5px] text-amber-900 font-semibold mb-2 flex items-center justify-between shadow-sm">
            <span>📲 Demo Mode: Use OTP <strong className="text-base text-[#D4AF37] tracking-wider font-extrabold">123456</strong></span>
            <button 
              type="button"
              onClick={() => setFormData({ ...formData, otp: "123456" })}
              className="px-3 py-1 bg-[#D4AF37] hover:bg-[#C9A84C] text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors border-none outline-none"
            >
              Auto-Fill OTP
            </button>
          </div>
          <p className="text-xs text-gray-500 font-light">
            We have sent a mock 6-digit verification code (OTP) to <strong>{formData.email}</strong> and <strong>{formData.mobile}</strong>.
          </p>
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Enter 6-Digit OTP *</label>
              <input 
                type="text" 
                maxLength={6}
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, "") })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-lg font-bold tracking-[8px] outline-none focus:border-[#D4AF37]" 
                placeholder="******" 
              />
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">
                {timer > 0 ? `Resend in ${timer}s` : "Didn't receive code?"}
              </span>
              {timer === 0 && (
                <button 
                  onClick={() => { setOtpSent(true); setTimer(60); }} 
                  className="text-[#D4AF37] font-bold hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={handleBack} 
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
            >
              Back
            </button>
            <button 
              type="button" 
              onClick={verifyOtp} 
              disabled={isVerifying}
              className="flex-2 py-3 bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-base font-extrabold text-[#072A6C] uppercase tracking-wide">Fill Online Application</h3>
          <p className="text-xs text-gray-500 font-light">Provide your basic academic and personal details.</p>
          
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Date of Birth *</label>
                <input 
                  type="date" 
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920]" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Gender *</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920]"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Select School *</label>
              <select 
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920]"
              >
                <option>School of Engineering</option>
                <option>School of Management</option>
                <option>School of Pharmacy</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 mb-1">Selected Program *</label>
              <select 
                value={formData.program}
                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920]"
              >
                <option>B.Tech. Computer Science & Eng</option>
                <option>B.Tech. CSE (AI & Machine Learning)</option>
                <option>B.Tech. CSE (Data Science)</option>
                <option>B.Tech. Electronics & Comm Eng</option>
                <option>MBA (Master of Business Administration)</option>
                <option>MCA (Master of Computer Applications)</option>
                <option>B.Pharm. (Bachelor of Pharmacy)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Class X Marks (%) *</label>
                <input 
                  type="text" 
                  value={formData.tenthMarks}
                  onChange={(e) => setFormData({ ...formData, tenthMarks: e.target.value })}
                  placeholder="e.g. 92.4"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920]" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">Class XII Marks (%) *</label>
                <input 
                  type="text" 
                  value={formData.twelfthMarks}
                  onChange={(e) => setFormData({ ...formData, twelfthMarks: e.target.value })}
                  placeholder="e.g. 95.8"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920]" 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={handleBack} 
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
            >
              Back
            </button>
            <button 
              type="button" 
              onClick={handleNext} 
              className="flex-2 py-3 bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
            >
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-base font-extrabold text-[#072A6C] uppercase tracking-wide">Upload Required Documents</h3>
          <p className="text-xs text-gray-500 font-light">Upload scanned files in PDF or JPEG formats.</p>

          <div className="space-y-4 pt-2">
            <div className="border border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-700">Passport Size Photo *</span>
                <span className="text-[10px] text-gray-400 font-light">{formData.photo ? formData.photo.name : "JPEG, under 2MB"}</span>
              </div>
              <label className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#072A6C] font-bold text-[11px] rounded-xl cursor-pointer select-none">
                {formData.photo ? "Change" : "Browse"}
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload("photo", e.target.files)} className="hidden" />
              </label>
            </div>

            <div className="border border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-700">Class X Marksheet *</span>
                <span className="text-[10px] text-gray-400 font-light">{formData.marksheet10 ? formData.marksheet10.name : "PDF/JPEG, under 5MB"}</span>
              </div>
              <label className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#072A6C] font-bold text-[11px] rounded-xl cursor-pointer select-none">
                {formData.marksheet10 ? "Change" : "Browse"}
                <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload("marksheet10", e.target.files)} className="hidden" />
              </label>
            </div>

            <div className="border border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-gray-700">Class XII Marksheet *</span>
                <span className="text-[10px] text-gray-400 font-light">{formData.marksheet12 ? formData.marksheet12.name : "PDF/JPEG, under 5MB"}</span>
              </div>
              <label className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#072A6C] font-bold text-[11px] rounded-xl cursor-pointer select-none">
                {formData.marksheet12 ? "Change" : "Browse"}
                <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload("marksheet12", e.target.files)} className="hidden" />
              </label>
            </div>

            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                  <span>Uploading files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#D4AF37] transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={handleBack} 
              disabled={isUploading}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
            >
              Back
            </button>
            <button 
              type="button" 
              onClick={startUpload} 
              disabled={isUploading}
              className="flex-2 py-3 bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isUploading ? "Uploading..." : "Upload & Continue"}
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4 animate-fade-in">
          <h3 className="text-base font-extrabold text-[#072A6C] uppercase tracking-wide">Pay Application Fee</h3>
          <p className="text-xs text-gray-500 font-light">Pay the mandatory application processing fee of <strong>₹1,000</strong> to submit your form.</p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, paymentMethod: "UPI" })}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-colors cursor-pointer outline-none border-none ${
                  formData.paymentMethod === "UPI" ? "bg-[#072A6C] text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                UPI / QR Code
              </button>
              <button 
                type="button" 
                onClick={() => setFormData({ ...formData, paymentMethod: "Card" })}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-colors cursor-pointer outline-none border-none ${
                  formData.paymentMethod === "Card" ? "bg-[#072A6C] text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                Credit / Debit Card
              </button>
            </div>

            {formData.paymentMethod === "UPI" ? (
              <div className="flex flex-col items-center p-6 border border-gray-200 rounded-2xl space-y-4">
                <div className="w-40 h-40 bg-white border-2 border-[#072A6C] p-2 rounded-xl flex items-center justify-center shadow-inner">
                  <QrCode size={120} className="text-[#072A6C]" />
                </div>
                <span className="text-[11px] font-bold text-[#072A6C] uppercase tracking-wider text-center">Scan QR code using BHIM, GPay, PhonePe, or Paytm</span>
              </div>
            ) : (
              <div className="space-y-3 p-4 border border-gray-200 rounded-2xl">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Card Number</label>
                  <input 
                    type="text" 
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                    placeholder="4111 2222 3333 4444"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920]" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value.slice(0, 5) })}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920]" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CVV</label>
                    <input 
                      type="password" 
                      maxLength={3}
                      value={formData.cardCvv}
                      onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value.replace(/\D/g, "") })}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#D71920]" 
                    />
                  </div>
                </div>
              </div>
            )}

            {isPaying && (
              <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-500">
                <Clock size={14} className="animate-spin text-[#D4AF37]" /> Processing secure transaction...
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              type="button" 
              onClick={handleBack} 
              disabled={isPaying}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
            >
              Back
            </button>
            <button 
              type="button" 
              onClick={processPayment} 
              disabled={isPaying}
              className="flex-2 py-3 bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {isPaying ? "Paying..." : "Pay ₹1,000 & Submit"}
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="text-center py-6 space-y-6 animate-fade-in">
          <div className="w-16 h-16 bg-[#072A6C]/10 text-[#072A6C] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck size={36} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-[#072A6C] uppercase tracking-wide">Application Submitted!</h3>
            <p className="text-xs text-gray-500 font-light max-w-sm mx-auto leading-relaxed">
              Congratulations, <strong>{formData.name}</strong>! Your application for <strong>{formData.program}</strong> has been received successfully.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 max-w-xs mx-auto text-xs space-y-2 text-left shadow-inner">
            <div className="flex justify-between border-b border-gray-200 pb-1.5">
              <span className="text-gray-400">Application No:</span>
              <span className="font-bold text-[#072A6C]">CC-2026-89421</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1.5">
              <span className="text-gray-400">Stream:</span>
              <span className="font-bold text-[#072A6C]">B.Tech. Program</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Fee Status:</span>
              <span className="font-bold text-[#D4AF37] uppercase tracking-wider">Paid (₹1,000)</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-2 max-w-xs mx-auto">
            <button 
              type="button" 
              onClick={handleDownloadReceipt}
              className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
            >
              📥 Download Receipt PDF
            </button>
            <Link 
              to="/" 
              className="w-full py-2.5 bg-[#072A6C] hover:bg-[#072A6C]/90 text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider block text-center"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function FeesView() {
  const { admissionsContent } = useData();
  const feeList = admissionsContent?.feeStructure && admissionsContent.feeStructure.length > 0
    ? admissionsContent.feeStructure
    : FEES_DATA;

  return (
    <div className="space-y-6 font-[var(--font-poppins)] text-left w-full mt-4">
      <div className="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden bg-[#072A6C] flex items-center justify-center select-none shadow-sm mb-6">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        <h2 className="text-white text-3xl font-extrabold tracking-tight relative z-10">Fee Structure</h2>
      </div>

      <div className="space-y-6">
        {feeList.map((feeRow) => (
          <div key={feeRow.id} className="flex gap-4 md:gap-6 items-start">
            <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-gradient-to-b from-[#072A6C] to-[#0c409c] text-white text-lg md:text-xl font-extrabold flex items-center justify-center rounded-full shadow-md">
              {feeRow.id}
            </div>

            <div className="flex-1 bg-white border border-gray-155 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-b border-gray-100 pb-3 mb-4">
                <h4 className="font-extrabold text-[#072A6C] text-sm md:text-base leading-snug">
                  {feeRow.title}
                </h4>
                
                <div className="flex flex-wrap gap-2">
                  {feeRow.duration && feeRow.duration !== "Varies" && (
                    <span className="px-3 py-1 bg-[#D4AF37]/5 text-[#D4AF37] font-bold text-[10px] uppercase tracking-wider rounded-md border border-[#D4AF37]/15">
                      {feeRow.duration}
                    </span>
                  )}
                  {feeRow.feePerYear && feeRow.feePerYear !== "See Details" && (
                    <span className="px-3 py-1 bg-[#D4AF37]/10 text-gray-900 font-extrabold text-[10px] uppercase tracking-wider rounded-md border border-[#D4AF37]/35">
                      {feeRow.feePerYear}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Applicable Programs</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 font-light">
                  {(feeRow.courses || []).map((course, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 leading-relaxed">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shrink-0" />
                      <span>{course}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-gray-400 font-medium gap-1">
                {feeRow.examFee && feeRow.examFee !== "N/A" ? (
                  <span>* Mandatory Exam Cell Fee: <strong>{feeRow.examFee}</strong></span>
                ) : (
                  <span>* Transportation service is optional and routes vary</span>
                )}
                <span>{feeRow.id === "09" ? "* Transportation fee is payable annually" : "* Semester registration charges extra as applicable"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScholarshipsView() {
  const { admissionsContent } = useData();
  const sc = admissionsContent?.scholarships || {
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
    entranceExams: ["AP EAPCET", "JEE Main", "NEET (for eligible programs)", "Intermediate / Class XII Academic Merit"],
    entranceNote: "* Scholarship benefits are offered based on rank, score, and institutional eligibility criteria.",
    governmentTitle: "Government Scholarship Support",
    governmentDescription: "The institute facilitates eligible students in availing various Government of Andhra Pradesh and Government of India scholarship schemes.",
    governmentSchemes: [
      { title: "Post-Matric Scholarships", desc: "State and national scholarship programs for reserved and minority categories." },
      { title: "AICTE Pragati & Saksham", desc: "Support programs for female advancement in technology (Pragati) and differently-abled students (Saksham)." }
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
  };

  return (
    <div className="space-y-8 text-left font-[var(--font-poppins)] mt-4">
      <div className="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden bg-[#072A6C] flex items-center justify-center select-none shadow-sm mb-6">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url('${sc.heroImage || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop"}')` }} 
        />
        <h2 className="text-white text-3xl font-extrabold tracking-tight relative z-10">{sc.heroTitle || "Scholarships & Merits"}</h2>
      </div>

      <div className="space-y-6">
        <div className="border-b-2 border-[#D4AF37]/80 pb-2 flex items-center gap-2">
          <Award className="text-[#D4AF37] shrink-0" size={24} />
          <h2 className="text-xl md:text-2xl font-extrabold text-[#072A6C] uppercase tracking-tight">
            Merit Scholarships
          </h2>
        </div>

        <div className="bg-white border border-gray-155 border-l-4 border-l-[#D4AF37] rounded-r-2xl rounded-l-md p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#072A6C] uppercase tracking-wide">
              {sc.cmstTitle}
            </h3>
            <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">
              {sc.cmstDescription}
            </p>
          </div>

          <div className="pt-2">
            <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-2">Scholarship Highlights</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600 font-light">
              {(sc.cmstHighlights || []).map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#D4AF37]/5 p-2 rounded-xl border border-[#D4AF37]/10">
                  <span className="text-[#D4AF37] font-black text-sm">✓</span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-155 border-l-4 border-l-[#D4AF37] rounded-r-2xl rounded-l-md p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#072A6C] uppercase tracking-wide">
              {sc.entranceTitle}
            </h3>
            <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">
              {sc.entranceDescription}
            </p>
          </div>

          <div className="pt-2">
            <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-2">Eligible Entrance Examinations</h4>
            <div className="flex flex-wrap gap-2">
              {(sc.entranceExams || []).map((exam, idx) => (
                <span key={idx} className="px-3 py-1 bg-amber-50 text-gray-800 font-extrabold text-[10.5px] uppercase tracking-wider rounded-md border border-amber-200">
                  {exam}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 italic font-light mt-3 leading-normal">
              {sc.entranceNote || "* Scholarship benefits are offered based on rank, score, and institutional eligibility criteria."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6">
        <div className="border-b-2 border-[#D4AF37]/80 pb-2 flex items-center gap-2">
          <ShieldCheck className="text-[#D4AF37] shrink-0" size={24} />
          <h2 className="text-xl md:text-2xl font-extrabold text-[#072A6C] uppercase tracking-tight">
            {sc.governmentTitle || "Government Scholarship Support"}
          </h2>
        </div>

        <div className="bg-white border border-gray-155 border-l-4 border-l-[#072A6C] rounded-r-2xl rounded-l-md p-6 shadow-sm space-y-4">
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            {sc.governmentDescription}
          </p>

          <div>
            <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-3">Supported Schemes Include</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-gray-700">
              {(sc.governmentSchemes || []).map((scheme, idx) => (
                <div key={idx} className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="font-extrabold text-[#072A6C] block mb-1">{scheme.title}</span>
                  <span className="text-[10.5px] text-gray-400 font-light">{scheme.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4.5 rounded-r-xl text-xs text-blue-900 font-medium">
            {sc.nspTipText || "💡 Our dedicated student support team assists eligible candidates throughout the entire application and documentation process on the National Scholarship Portal (NSP) schemes."}
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6">
        <div className="border-b-2 border-[#D4AF37]/80 pb-2 flex items-center gap-2">
          <BookOpen className="text-[#D4AF37] shrink-0" size={24} />
          <h2 className="text-xl md:text-2xl font-extrabold text-[#072A6C] uppercase tracking-tight">
            {sc.rewardsTitle || "Rewards for Academic Excellence"}
          </h2>
        </div>

        <div className="bg-white border border-gray-155 border-l-4 border-l-[#D4AF37] rounded-r-2xl rounded-l-md p-6 shadow-sm space-y-4">
          <p className="text-xs text-gray-500 font-light leading-relaxed">
            {sc.rewardsDescription}
          </p>

          <div>
            <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-2.5">Students are recognized through</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(sc.academicRewards || []).map((reward, i) => (
                <div key={i} className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-3 text-center">
                  <span className="font-extrabold text-[#072A6C] text-xs block">{reward.title}</span>
                  <span className="text-[9.5px] text-gray-400 font-light block mt-0.5">{reward.subtitle}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#D4AF37] italic font-extrabold mt-4 text-center leading-normal uppercase tracking-wider">
              {sc.excellenceFooterText || "★ Special Recognition for Outstanding Achievements in a Unique Way! ★"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecruiterCard({ company }: { company: { name: string; logo: string } }) {
  const [hasError, setHasError] = React.useState(false);
  return (
    <div className="flex flex-col items-center justify-center bg-white border border-gray-200/60 rounded-xl p-4 w-32 h-36 shrink-0 select-none shadow-sm hover:shadow-[0_8px_20px_rgba(37,99,235,0.12)] transition-all duration-300 gap-2 group cursor-pointer">
      {/* Real Corporate Logo */}
      <div className="w-20 h-16 flex items-center justify-center overflow-hidden bg-white p-1 shrink-0">
        {hasError ? (
          <div className="w-12 h-12 rounded-full bg-[#072A6C] text-white flex items-center justify-center font-bold text-xs">
            {company.name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <img 
            src={company.logo} 
            alt={`${company.name} logo`} 
            className="max-w-full max-h-full object-contain w-auto h-auto transition-transform duration-300 group-hover:scale-108"
            onError={() => setHasError(true)}
          />
        )}
      </div>
      <span className="font-extrabold text-[10px] text-gray-500 tracking-wider uppercase text-center">{company.name}</span>
    </div>
  );
}

function PlacementsView() {
  const { placementsContent } = useData();
  const [showEnquiry, setShowEnquiry] = React.useState(false);
  const [enquiryForm, setEnquiryForm] = React.useState({ name: "", email: "", mobile: "", query: "" });
  const sliderRef = React.useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollStart, setScrollStart] = React.useState(0);
  const [lastInteraction, setLastInteraction] = React.useState(0);

  const PLACED_STUDENTS = placementsContent.placedStudents;
  const duplicatedStudents = [...PLACED_STUDENTS, ...PLACED_STUDENTS, ...PLACED_STUDENTS];

  // Manual scroll by one card (card width is 224px + 20px gap = 244px)
  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      setLastInteraction(Date.now());
      const cardWidth = 244;
      const currentScroll = sliderRef.current.scrollLeft;
      const scrollTo = direction === "left" ? currentScroll - cardWidth : currentScroll + cardWidth;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const el = sliderRef.current;
      if (!el) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const timeSinceInteraction = Date.now() - lastInteraction;
      const shouldScroll = !isHovered && !isDragging && timeSinceInteraction > 3000;

      if (shouldScroll) {
        // slow premium speed: about 35-45s per full loop.
        // Scroll 0.65px per frame (approx 40px/sec)
        const speed = 0.65;
        el.scrollLeft += speed;

        // Reset scroll position if we go past the original list width
        const originalWidth = el.scrollWidth / 3;
        if (el.scrollLeft >= originalWidth * 2) {
          el.scrollLeft -= originalWidth;
        }
      }

      lastTime = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging, lastInteraction]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollStart(sliderRef.current.scrollLeft);
    setLastInteraction(Date.now());
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollStart - walk;
    setLastInteraction(Date.now());
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Our Placement Officer will contact you shortly.");
    setShowEnquiry(false);
  };

  const INDUSTRIES = [
    { name: "Software Development", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&fit=crop" },
    { name: "Core Engineering", img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&fit=crop" },
    { name: "AI & Data Science", img: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=400&fit=crop" },
    { name: "Cyber Security", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&fit=crop" },
    { name: "Embedded Systems", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&fit=crop" },
    { name: "Mechanical & Civil", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&fit=crop" },
    { name: "Business & Management", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&fit=crop" },
    { name: "Research & Higher Ed", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&fit=crop" },
    { name: "Startups & Ventures", img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&fit=crop" }
  ];

  const displayIndustries = (placementsContent.industries && placementsContent.industries.length > 0) 
    ? placementsContent.industries 
    : INDUSTRIES;

  const RECRUITERS = placementsContent.recruiters;

  return (
    <div className="space-y-12 text-left font-[var(--font-poppins)] mt-4">
      {/* 0. Hotstar-style sliding list container at the top of the placements page */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] text-[#D4AF37] font-extrabold uppercase tracking-widest">
              {placementsContent.recentPlacementsBadge || "OUR PLACED STARS"}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-[#072A6C] uppercase tracking-wide">
              {placementsContent.recentPlacementsTitle || "RECENT PLACEMENTS"}
            </h2>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm outline-none cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all shadow-sm outline-none cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Slider Area */}
        <div 
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={() => { handleMouseUpOrLeave(); setIsHovered(false); }}
          onMouseEnter={() => setIsHovered(true)}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-none select-none cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none" }}
        >
          {duplicatedStudents.map((student, idx) => (
            <div 
              key={idx} 
              draggable="false"
              className="w-48 md:w-56 shrink-0 aspect-[3/4.2] bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative flex flex-col justify-end cursor-pointer"
            >
              {/* Profile Image */}
              <img 
                src={student.img} 
                alt={student.name} 
                draggable="false"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {/* Bottom Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

              {/* Placed Company Badge */}
              <div className="absolute top-3 left-3 bg-[#072A6C]/90 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm z-10">
                {student.company}
              </div>

              {/* Student details text overlay - default view */}
              <div className="z-10 p-4 space-y-1 group-hover:opacity-0 transition-opacity duration-200">
                <span className="block text-white font-bold text-xs md:text-sm truncate">{student.name}</span>
                <span className="block text-[10px] text-gray-300 font-light truncate">{student.branch}</span>
                <div className="flex items-center justify-between pt-1 border-t border-white/10 mt-1">
                  <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Package</span>
                  <span className="text-xs text-[#D4AF37] font-black">{student.ctc}</span>
                </div>
              </div>

              {/* Hotstar Expanded Popover on Hover */}
              <div className="absolute inset-0 bg-[#0c111b]/95 z-25 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto text-left font-[var(--font-poppins)]">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded font-black uppercase tracking-widest animate-pulse">Placed</span>
                    <span className="text-xs text-[#D4AF37] font-black">{student.ctc}</span>
                  </div>
                  
                  <h4 className="text-xs md:text-sm font-black text-white leading-tight uppercase pt-1">{student.name}</h4>
                  <p className="text-[10px] text-gray-300 font-light">{student.branch}</p>
                  <p className="text-[9.5px] text-gray-400 font-light leading-relaxed italic border-l border-l-[#D4AF37] pl-2 pt-0.5">
                    "Secured placement with CIT Training Cell coordination."
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
                    <span className="font-semibold text-white">Company:</span>
                    <span>{student.company}</span>
                    <span>•</span>
                    <span className="font-semibold text-white">Year:</span>
                    <span>2026 Batch</span>
                  </div>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Inquiry sent for placement profile details of ${student.name}.`);
                    }}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition-colors border-none outline-none flex items-center justify-center gap-1 cursor-pointer"
                  >
                    View Offer Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1. Hero Section (Match Jupiter Placement Screenshot Layout) */}
      <div className="bg-[#072A6C]/5 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border border-gray-100 shadow-sm">
        {/* Soft Wavy background graphic decoration */}
        <div className="absolute inset-y-0 right-0 w-1/2 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-indigo-500 to-transparent pointer-events-none" />

        {/* Text Area */}
        <div className="flex-1 space-y-4 md:space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg font-bold text-xs uppercase tracking-wider">
            {placementsContent.badgeText || "Placements & Career Development"}
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#072A6C] tracking-tight leading-tight uppercase">
            {placementsContent.heroTitle}
          </h1>
          <p className="text-[#D4AF37] font-bold text-sm uppercase tracking-widest mt-[-8px]">
            {placementsContent.heroSubtitle}
          </p>
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-light">
            {placementsContent.heroDescription}
          </p>
          <button
            onClick={() => setShowEnquiry(true)}
            className="px-8 py-3 bg-[#072A6C] hover:bg-[#0c409c] text-white text-xs font-bold rounded-full transition-all uppercase tracking-wider shadow-md hover:shadow-lg cursor-pointer outline-none border-none"
          >
            {placementsContent.enquireButtonText || "Enquire Now"}
          </button>
        </div>

        {/* Hero image matching screenshot portrait/layout */}
        <div className="flex-1 w-full md:w-1/2 z-10">
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white p-2">
            <img 
              src={placementsContent.heroImage || "/campus_placement.png"} 
              alt="Campus Placement Drive Illustration" 
              className="w-full h-auto object-contain rounded-xl" 
            />
          </div>
        </div>
      </div>

      {/* Stats Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-6 rounded-2xl text-center shadow-sm">
          <span className="block text-3xl font-black text-[#072A6C]">{placementsContent.highestPackage}</span>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase mt-1.5 block tracking-wider">Highest Package</span>
        </div>
        <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm">
          <span className="block text-3xl font-black text-[#072A6C]">{placementsContent.averagePackage}</span>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase mt-1.5 block tracking-wider">Average Package</span>
        </div>
        <div className="bg-white border border-gray-150 p-6 rounded-2xl text-center shadow-sm">
          <span className="block text-3xl font-black text-[#D4AF37]">{placementsContent.placementPercent}</span>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase mt-1.5 block tracking-wider">Placement Record</span>
        </div>
      </div>

      {/* Placement Philosophy */}
      <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm border-l-4 border-l-[#D4AF37]">
        <h3 className="font-extrabold text-[#072A6C] text-sm uppercase tracking-wider mb-2">
          {placementsContent.philosophyTitle || "Our Placement Philosophy"}
        </h3>
        <p className="text-xs text-gray-500 font-light leading-relaxed">
          {placementsContent.philosophyText}
        </p>
      </div>

      {/* Industries We Cater (Card grid matching screen structure) */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-[#072A6C] uppercase tracking-wide">
            {placementsContent.industriesTitle || "INDUSTRIES WE CATER"}
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayIndustries.map((ind, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-default">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={ind.img} 
                  alt={ind.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-white font-extrabold text-xs md:text-sm uppercase tracking-wide">
                    {ind.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Development Programs & Industry Connect */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Career Development Card */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#072A6C] text-sm uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
            <Award className="text-[#D4AF37]" size={18} /> {placementsContent.careerProgramsTitle || "CAREER DEVELOPMENT PROGRAMS"}
          </h4>
          <ul className="space-y-2.5 text-xs text-gray-500 font-light">
            {placementsContent.careerPrograms.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Industry Connect Card */}
        <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
          <h4 className="font-extrabold text-[#072A6C] text-sm uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
            <Globe className="text-[#D4AF37]" size={18} /> {placementsContent.industryConnectTitle || "INDUSTRY CONNECT"}
          </h4>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            {placementsContent.industryConnectDesc}
          </p>
          <ul className="space-y-2.5 text-xs text-gray-500 font-light">
            {placementsContent.industryConnectItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-[#D4AF37] font-bold">★</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Placement Cell Responsibilities */}
      <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="font-extrabold text-[#072A6C] text-sm uppercase tracking-wider border-b border-gray-100 pb-2">
          {placementsContent.placementCellTitle || "DEDICATED TRAINING & PLACEMENT CELL"}
        </h4>
        <p className="text-xs text-gray-400 font-light leading-relaxed">
          {placementsContent.placementCellDesc}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 font-light">
          {placementsContent.placementCellItems.map((resp, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl border border-gray-100/50 space-y-1">
              <span className="font-extrabold text-[#072A6C] text-xs block">{resp.t}</span>
              <span className="text-[10px] text-gray-400 leading-normal block">{resp.d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Infinite scrolling company logo marquee visited Chalapathi */}
      <div className="space-y-4 pt-4 border-t border-gray-100 overflow-hidden">
        <div className="text-center">
          <span className="text-[10px] text-[#D4AF37] font-extrabold uppercase tracking-widest">
            {placementsContent.recruitersBadge || "GLOBAL COLLABORATORS"}
          </span>
          <h3 className="text-lg font-black text-[#072A6C] uppercase tracking-wide">
            {placementsContent.recruitersTitle || "TOP RECRUITERS VISITED"}
          </h3>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes companyMarquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-company-marquee {
            display: flex;
            width: max-content;
            animation: companyMarquee 20s linear infinite;
          }
        `}} />

        <div className="relative w-full overflow-hidden bg-gray-50 py-6 rounded-2xl border border-gray-100 flex items-center">
          {/* Fading Gradients at edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
          
          <div className="animate-company-marquee gap-10 md:gap-14 flex items-center">
            {[...RECRUITERS, ...RECRUITERS].map((company, i) => (
              <RecruiterCard key={i} company={company} />
            ))}
          </div>
        </div>
      </div>

      {/* 6. Quick Navigation & Admission Helpdesk (Matching Screenshot 4) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Quick Navigation Card */}
        <div className="bg-[#072A6C] text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-sm mb-4 uppercase tracking-wider text-left text-white">Quick Navigation</h3>
            <ul className="grid grid-cols-2 gap-3 text-xs text-blue-100/90 text-left font-medium">
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center justify-between group">
                  About Institution <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link to="/academics" className="hover:text-white transition-colors flex items-center justify-between group">
                  Academic Programs <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link to="/admissions" className="hover:text-white transition-colors flex items-center justify-between group">
                  Enrollment & Fees <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li>
                <Link to="/placements" className="hover:text-white transition-colors flex items-center justify-between group text-[#D4AF37] font-bold">
                  Placements & Statistics <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
              <li className="col-span-2">
                <Link to="/contact" className="hover:text-white transition-colors flex items-center justify-between group">
                  Contact Support <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Admission Helpdesk Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div className="space-y-1.5 sm:max-w-[65%]">
            <h3 className="font-black text-sm text-[#072A6C] uppercase tracking-wider">Admission Helpdesk</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-light">
              Have questions about registration, courses, or hostels? Reach our advisors directly.
            </p>
          </div>
          <a 
            href="tel:8886630355" 
            className="h-11 px-5 bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 outline-none border-none cursor-pointer shadow-sm uppercase tracking-wider text-decoration-none"
          >
            <Phone size={14} /> Call Counselor
          </a>
        </div>
      </div>

      {/* Enquiry Modal */}
      {showEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative animate-scale-up space-y-4 text-left">
            <button 
              onClick={() => setShowEnquiry(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer outline-none"
            >
              ✕
            </button>
            <h3 className="text-lg font-extrabold text-[#072A6C] uppercase tracking-wide">Placement Enquiry</h3>
            <p className="text-xs text-gray-400 font-light mt-1">Submit your details to connect with the Training & Placement Cell.</p>
            <form onSubmit={handleEnquirySubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                  placeholder="Enter full name" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                  placeholder="name@domain.com" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  required
                  value={enquiryForm.mobile}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, mobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                  placeholder="10-digit number" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Your Query</label>
                <textarea 
                  required
                  rows={3}
                  value={enquiryForm.query}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, query: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C] resize-none" 
                  placeholder="Ask a question..." 
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider mt-4"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactUsView() {
  const { contactPageContent } = useData();
  const content = contactPageContent || DEFAULT_CONTACT_PAGE_CONTENT;

  const [captchaText, setCaptchaText] = React.useState("p s t 5 s");
  const [formData, setFormData] = React.useState({ firstName: "", lastName: "", mobile: "", email: "", message: "", captcha: "" });

  const handleCaptchaRefresh = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
    }
    setCaptchaText(text.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.captcha.replace(/\s+/g, "") !== captchaText.replace(/\s+/g, "")) {
      alert("Invalid captcha text. Please try again.");
      return;
    }
    alert(content.formSuccessMessage || "Message sent successfully! Our representative will contact you shortly.");
    setFormData({ firstName: "", lastName: "", mobile: "", email: "", message: "", captcha: "" });
    handleCaptchaRefresh();
  };

  return (
    <div className="space-y-10 text-left font-[var(--font-poppins)] mt-4">
      {/* Hero Banner header matching Placements page styling but with Contact details */}
      <div className="bg-[#072A6C] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-gray-100 shadow-sm mb-6">
        <div className="absolute inset-y-0 right-0 w-1/3 opacity-15 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
        <div className="z-10 relative space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/10 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider">
            {content.heroBadge || "CONTACT SUPPORT"}
          </div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{content.heroTitle || "CONTACT US"}</h1>
          <p className="text-xs text-blue-100 font-light max-w-xl">
            {content.heroDescription || "Whether you're a prospective student, parent, recruiter, alumnus, or visitor, we're here to help. Reach out to us for admissions, academic inquiries, placements, scholarships, or any assistance regarding campus life."}
          </p>
        </div>
      </div>

      {/* Main Two-Column Block (Matching screenshot layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Get In Touch Cards Grid */}
        <div className="lg:col-span-6 bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#072A6C] text-white py-4 px-6 text-center font-extrabold text-sm uppercase tracking-wider">
            {content.getInTouchTitle || "GET IN TOUCH WITH US NOW!"}
          </div>
          
          <div className="grid grid-cols-2 gap-px bg-gray-100 flex-1">
            
            {/* Phone */}
            <div className="bg-white p-6 flex flex-col items-center text-center justify-center space-y-2.5">
              <span className="p-3 bg-[#072A6C]/5 text-[#072A6C] rounded-full">
                <Phone size={20} />
              </span>
              <span className="font-extrabold text-[#072A6C] text-xs uppercase tracking-wide">{content.phoneTitle || "PHONE NUMBER"}</span>
              <a 
                href={`tel:${(content.phoneNumber || "+91 95055 05566").replace(/[^0-9+]/g, "")}`} 
                className="text-xs font-semibold text-gray-700 hover:text-[#072A6C] hover:underline"
              >
                {content.phoneNumber || "+91 95055 05566"}
              </a>
            </div>

            {/* Email */}
            <div className="bg-white p-6 flex flex-col items-center text-center justify-center space-y-2.5">
              <span className="p-3 bg-[#072A6C]/5 text-[#072A6C] rounded-full">
                <Mail size={20} />
              </span>
              <span className="font-extrabold text-[#072A6C] text-xs uppercase tracking-wide">{content.emailTitle || "EMAIL"}</span>
              <a 
                href={`mailto:${content.emailAddress || "info@city.ac.in"}`} 
                className="text-xs font-semibold text-gray-700 hover:text-[#072A6C] hover:underline truncate max-w-[140px] md:max-w-[200px]"
              >
                {content.emailAddress || "info@city.ac.in"}
              </a>
            </div>

            {/* Location */}
            <div className="bg-white p-6 flex flex-col items-center text-center justify-center space-y-2.5">
              <span className="p-3 bg-[#072A6C]/5 text-[#072A6C] rounded-full">
                <Globe size={20} />
              </span>
              <span className="font-extrabold text-[#072A6C] text-xs uppercase tracking-wide">{content.locationTitle || "LOCATION"}</span>
              <span className="text-[10px] text-gray-500 leading-normal font-light whitespace-pre-line">
                {content.locationAddress || "A.R. Nagar, Mothadaka,\nGuntur, AP – 522016"}
              </span>
            </div>

            {/* Working Hours */}
            <div className="bg-white p-6 flex flex-col items-center text-center justify-center space-y-2.5">
              <span className="p-3 bg-[#072A6C]/5 text-[#072A6C] rounded-full">
                <Clock size={20} />
              </span>
              <span className="font-extrabold text-[#072A6C] text-xs uppercase tracking-wide">{content.workingHoursTitle || "WORKING HOURS"}</span>
              <span className="text-[10px] text-gray-500 font-semibold leading-normal">
                {content.workingHoursDays || "Mon - Sat: 09:00 AM - 05:00 PM"}<br />
                <span className="text-[#D4AF37] font-normal">{content.workingHoursClosed || "Sunday: Closed"}</span>
              </span>
            </div>

          </div>
        </div>

        {/* Right Side: Message Submission Form */}
        <div className="lg:col-span-6 bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#072A6C] text-white py-4 px-6 text-center font-extrabold text-sm uppercase tracking-wider">
            {content.formTitle || "CONTACT US"}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left bg-gray-50/55 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">First Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Mobile No *</label>
                <input 
                  type="tel" 
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Phone number"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Email ID *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Message</label>
              <textarea 
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your message..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C] resize-none" 
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1">Please type the characters *</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="text" 
                  required
                  value={formData.captcha}
                  onChange={(e) => setFormData({ ...formData, captcha: e.target.value })}
                  className="w-1/2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#072A6C]" 
                  placeholder="Characters"
                />
                <div className="w-1/2 bg-white border border-gray-200 rounded-xl py-2 px-4 text-center font-mono font-bold tracking-[6px] select-none select-all relative overflow-hidden flex items-center justify-between">
                  <span className="text-[#072A6C] text-xs">{captchaText}</span>
                  <button 
                    type="button" 
                    onClick={handleCaptchaRefresh}
                    className="text-[9px] font-bold text-gray-400 hover:text-gray-600 outline-none border-none bg-transparent cursor-pointer"
                  >
                    Refresh
                  </button>
                </div>
              </div>
              <p className="text-[9px] text-gray-400 italic">This helps us prevent spam, thank you.</p>
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider flex items-center justify-center gap-2 mt-4 cursor-pointer outline-none border-none"
            >
              {content.formSubmitButtonText || "SUBMIT REQUEST"}
            </button>
          </form>
        </div>

      </div>

      {/* Grid of Department-wise helplines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {content.departments && content.departments.map((dept, idx) => (
          <div key={dept.id || idx} className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="font-extrabold text-[#072A6C] block uppercase tracking-wide text-xs border-b border-gray-100 pb-2 mb-2">
                {dept.name}
              </span>
              {dept.contactPerson && (
                <div className="text-xs font-semibold text-[#D4AF37] mb-1">
                  {dept.contactPerson}
                </div>
              )}
              {dept.phones && dept.phones.length > 0 && (
                <div className="space-y-1 text-xs text-gray-500 font-light">
                  <span className="block font-semibold text-gray-700">Helpline Numbers:</span>
                  {dept.phones.map((phone, pIdx) => (
                    <a key={pIdx} href={`tel:${phone.replace(/[^0-9+]/g, "")}`} className="block text-gray-600 hover:text-[#072A6C] hover:underline">
                      {phone}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1 text-xs text-gray-500 font-light pt-2">
              {dept.emails && dept.emails.length > 0 && (
                <>
                  <span className="block font-semibold text-gray-700">Email:</span>
                  {dept.emails.map((email, eIdx) => (
                    <a key={eIdx} href={`mailto:${email}`} className="block text-[#D4AF37] font-medium hover:underline truncate">
                      {email}
                    </a>
                  ))}
                </>
              )}
              {dept.note && (
                <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 font-light">
                  <span className="block font-semibold text-gray-700">{dept.note}:</span>
                  {dept.additionalPhones && dept.additionalPhones.map((ap, apIdx) => (
                    <a key={apIdx} href={`tel:${ap.replace(/[^0-9+]/g, "")}`} className="block text-gray-600 hover:text-[#072A6C] hover:underline">
                      {ap}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Google Maps Container */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#072A6C] uppercase tracking-wider">
              {content.mapHeading || "FIND US ON THE MAP"}
            </h3>
            <p className="text-xs text-gray-400 font-light leading-normal">
              {content.mapAddress || "Chalapathi University (Autonomous), Abburi Raghavaiah Nagar, Mothadaka, Guntur, AP – 522016, India."}
            </p>
          </div>
          {content.mapExternalUrl && (
            <a 
              href={content.mapExternalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="h-10 px-5 bg-[#072A6C] hover:bg-[#0c409c] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0 outline-none border-none text-center"
            >
              {content.mapButtonText || "Open in Google Maps"}
            </a>
          )}
        </div>
        
        {/* Map iframe */}
        <div className="rounded-xl overflow-hidden border border-gray-200 h-64 md:h-80 shadow-inner">
          <iframe 
            src={content.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.974950454796!2d80.28581691486445!3d16.375218788685984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a79679802cfad%3A0xe67e2a901bbd33fe!2sChalapathi%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1657523129846!5m2!1sen!2sin"} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

function ChalapathiAdvantage() {
  const { aboutContent } = useData();
  
  const Icons = [GraduationCap, BookOpen, Landmark, Award, Globe, UserCheck];
  const Colors = ["#9333EA", "#2563EB", "#D97706", "#0D9488", "#DC2626", "#4F46E5"];
  const BgClasses = ["bg-purple-600", "bg-blue-600", "bg-amber-600", "bg-teal-600", "bg-rose-600", "bg-indigo-600"];
  const TextClasses = ["text-purple-600", "text-blue-600", "text-amber-600", "text-teal-600", "text-rose-600", "text-indigo-600"];
  const BorderClasses = ["border-purple-200", "border-blue-200", "border-amber-200", "border-teal-200", "border-rose-200", "border-indigo-200"];

  const list = aboutContent.advantage.cards;

  return (
    <div className="space-y-8 py-8 font-[var(--font-poppins)] text-center border-t border-gray-100 mt-6">
      <div className="space-y-2">
        <span className="text-[10px] text-[#D4AF37] font-extrabold uppercase tracking-widest">Why Choose Us</span>
        <h2 className="text-xl md:text-2xl font-black text-[#072A6C] uppercase tracking-wide">The Chalapathi Advantage</h2>
        <div className="w-16 h-1 bg-[#D4AF37] mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-10 relative">
        {list.map((adv, idx) => {
          const IconComponent = Icons[idx % Icons.length];
          const bgClass = BgClasses[idx % BgClasses.length];
          const textClass = TextClasses[idx % TextClasses.length];
          const borderClass = BorderClasses[idx % BorderClasses.length];
          const num = String(idx + 1).padStart(2, "0");

          return (
            <div key={idx} className="flex flex-col items-center relative group">
              {/* Top Hexagon Number Badge */}
              <div className="relative z-10 -mb-6 flex flex-col items-center">
                <div 
                  className={`w-14 h-14 ${bgClass} text-white font-black text-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                >
                  {num}
                </div>
                {/* Curved wave accent underneath */}
                <div className={`w-8 h-2 rounded-full opacity-60 mt-1 ${bgClass}`} />
              </div>

              {/* Main Card Body */}
              <div className="bg-white border border-gray-150 rounded-2xl p-6 pt-10 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center space-y-3 w-full h-full relative z-0">
                {/* Custom Icon inside circular badge */}
                <div className={`p-2.5 rounded-full ${bgClass}/10 ${textClass}`}>
                  <IconComponent size={20} />
                </div>
                
                <h4 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">{adv.title}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed max-w-[90%]">{adv.desc}</p>
                <p className="text-[10px] text-gray-400 font-light leading-relaxed max-w-[90%]">{adv.detail}</p>
                
                {/* Bottom Connecting Hex Bullet Decoration */}
                <div className="pt-2 flex justify-center w-full">
                  <div 
                    className={`w-6 h-6 border-2 ${borderClass} bg-white flex items-center justify-center`}
                    style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
                  >
                    <div className={`w-2 h-2 ${bgClass}`} style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
