export interface ProgramDetail {
  slug: string;
  title: string;
  desc: string;
  duration: string;
  department: string;
  degreeType: string;
  overview: string;
  curriculum: string[];
  careers: { title: string; desc: string }[];
}

export const PROGRAMS_DATA: ProgramDetail[] = [
  // ────────────────────────────────────────────────────────────
  // 1. SCHOOL OF COMPUTING SCIENCES (9 Programs)
  // ────────────────────────────────────────────────────────────

  // Computer Science & Engineering
  {
    slug: "btech-cse",
    title: "B.Tech. Computer Science & Engineering",
    desc: "Empowering next-generation software architects, programmers, and technology leaders.",
    duration: "4 Years (Undergraduate)",
    department: "Computer Science & Engineering",
    degreeType: "B.Tech",
    overview: "This course offers a solid foundation in computer systems, software architectures, database systems, and networking. Students engage in practical labs and project-driven cycles to build end-to-end applications.",
    curriculum: ["Data Structures & Algorithms", "Operating Systems", "Database Management Systems", "Software Engineering", "Computer Networks", "Web Technologies"],
    careers: [
      { title: "Software Engineer", desc: "Design, develop, and maintain enterprise software applications." },
      { title: "Systems Analyst", desc: "Evaluate and design information systems to solve business problems." },
      { title: "Full Stack Developer", desc: "Build responsive frontend interfaces and robust backend architectures." }
    ]
  },
  {
    slug: "mtech-cse",
    title: "M.Tech. Computer Science & Engineering",
    desc: "Advanced postgraduate study in distributed systems, algorithms, and computing research.",
    duration: "2 Years (Postgraduate)",
    department: "Computer Science & Engineering",
    degreeType: "M.Tech",
    overview: "Focuses on advanced distributed systems, high-performance computing, and deep algorithmic research for specialized tech roles.",
    curriculum: ["Advanced Algorithms", "Distributed Systems", "Cloud Computing Architectures", "Machine Learning Applications", "Advanced Database Systems", "Research Thesis"],
    careers: [
      { title: "Senior Software Engineer", desc: "Design complex, high-scale software architectures." },
      { title: "Research Scientist", desc: "Conduct R&D in core computer science domains." }
    ]
  },
  {
    slug: "mca",
    title: "Master of Computer Applications (MCA)",
    desc: "Professional degree focused on application software development and modern technologies.",
    duration: "2 Years (Postgraduate)",
    department: "Computer Science & Engineering",
    degreeType: "MCA",
    overview: "Develops expertise in enterprise application development, web technologies, and software engineering methodologies.",
    curriculum: ["Java Programming", "Web Application Development", "Software Engineering", "Database Systems", "Cloud Services", "Project Work"],
    careers: [
      { title: "Software Developer", desc: "Develop and deploy robust web and mobile applications." },
      { title: "IT Consultant", desc: "Advise businesses on software and IT solutions." }
    ]
  },
  {
    slug: "phd-cse",
    title: "Ph.D. Computer Science & Engineering",
    desc: "Doctoral research program for aspiring academicians and computing research leaders.",
    duration: "3-5 Years (Doctoral)",
    department: "Computer Science & Engineering",
    degreeType: "Ph.D.",
    overview: "Intensive research-focused program allowing students to contribute novel findings to the field of computer science.",
    curriculum: ["Research Methodology", "Advanced Computing Trends", "Literature Review", "Thesis Work"],
    careers: [
      { title: "Professor / Academician", desc: "Teach and mentor university students while conducting research." },
      { title: "Principal Investigator", desc: "Lead R&D divisions in global technology firms." }
    ]
  },

  // Artificial Intelligence
  {
    slug: "btech-cse-ai-ml",
    title: "B.Tech. CSE (AI & Machine Learning)",
    desc: "Unlocking automation, predictive modeling, and intelligent agent systems.",
    duration: "4 Years (Undergraduate)",
    department: "Artificial Intelligence",
    degreeType: "B.Tech Specialization",
    overview: "Specialized pathway focusing on advanced mathematical modeling, machine learning algorithms, deep learning neural networks, and computer vision systems.",
    curriculum: ["Artificial Intelligence", "Machine Learning Techniques", "Deep Learning & Neural Networks", "Natural Language Processing", "Python for AI", "Reinforcement Learning"],
    careers: [
      { title: "AI Engineer", desc: "Develop and deploy deep learning models for predictive analytics." },
      { title: "ML Ops Specialist", desc: "Manage deployment pipelines and scale machine learning models." },
      { title: "Data Scientist (AI)", desc: "Synthesize large data streams into intelligent decision patterns." }
    ]
  },
  {
    slug: "btech-aiml",
    title: "B.Tech. Artificial Intelligence & Machine Learning",
    desc: "Core degree dedicated entirely to AI, ML, and cognitive computing.",
    duration: "4 Years (Undergraduate)",
    department: "Artificial Intelligence",
    degreeType: "B.Tech",
    overview: "An intensive program diving deep into the mathematics and algorithms powering AI, autonomous systems, and predictive analytics.",
    curriculum: ["Mathematics for AI", "Machine Learning", "Deep Learning", "Cognitive Computing", "Robotics", "AI Ethics"],
    careers: [
      { title: "AI/ML Engineer", desc: "Build state-of-the-art machine learning systems." },
      { title: "Applied Scientist", desc: "Apply AI research to solve complex real-world problems." }
    ]
  },
  {
    slug: "mtech-aiml",
    title: "M.Tech. CSE (AI & ML)",
    desc: "Postgraduate specialization in intelligent systems and advanced machine learning.",
    duration: "2 Years (Postgraduate)",
    department: "Artificial Intelligence",
    degreeType: "M.Tech Specialization",
    overview: "Advanced coursework in AI research, large language models, and scalable machine learning infrastructures.",
    curriculum: ["Advanced Machine Learning", "Deep Neural Networks", "Computer Vision", "NLP & Large Language Models", "AI System Design", "Dissertation"],
    careers: [
      { title: "AI Architect", desc: "Design and orchestrate enterprise AI platforms." },
      { title: "Senior Data Scientist", desc: "Lead data science teams and research initiatives." }
    ]
  },

  // Data Science
  {
    slug: "btech-cse-data-science",
    title: "B.Tech. CSE (Data Science)",
    desc: "Transforming big data into actionable insights and strategic decisions.",
    duration: "4 Years (Undergraduate)",
    department: "Data Science",
    degreeType: "B.Tech Specialization",
    overview: "Curriculum tailored to stats, data visualization, Hadoop pipelines, and predictive analytics modeling using Python, R, and modern database warehouses.",
    curriculum: ["Applied Statistics", "Data Visualization & BI", "Big Data Analytics", "Hadoop & Spark Frameworks", "Data Mining", "Predictive Analytics"],
    careers: [
      { title: "Data Analyst", desc: "Perform statistical analyses and generate actionable business reports." },
      { title: "Data Architect", desc: "Design and maintain high-performance database cluster architectures." },
      { title: "Business Intelligence Developer", desc: "Construct dashboards and visual pipelines for executive decision support." }
    ]
  },

  // Cyber Security
  {
    slug: "btech-cse-cyber-security",
    title: "B.Tech. CSE (Cyber Security)",
    desc: "Securing networks, digital assets, and critical infrastructures against modern cyber threats.",
    duration: "4 Years (Undergraduate)",
    department: "Cyber Security",
    degreeType: "B.Tech Specialization",
    overview: "Designed to prepare scholars in cryptography, secure coding practices, cloud security architectures, and advanced penetration testing frameworks.",
    curriculum: ["Cryptography", "Network Security Protocols", "Ethical Hacking & Penetration Testing", "Digital Forensics", "Secure Software Development", "Cloud Security"],
    careers: [
      { title: "Cyber Security Analyst", desc: "Monitor network traffic and resolve security incidents." },
      { title: "Penetration Tester", desc: "Conduct authorized security audits and vulnerability assessments." },
      { title: "Security Architect", desc: "Design immune enterprise network structures and security guidelines." }
    ]
  },

  // ────────────────────────────────────────────────────────────
  // 2. SCHOOL OF ENGINEERING (6 Programs)
  // ────────────────────────────────────────────────────────────

  // Electronics & Communication Engineering
  {
    slug: "btech-ece",
    title: "B.Tech. Electronics and Communication Engineering",
    desc: "Designing high-performance communication systems, signal processing, and chip architectures.",
    duration: "4 Years (Undergraduate)",
    department: "Electronics and Communication Engineering",
    degreeType: "B.Tech",
    overview: "Covers semiconductor devices, analog/digital circuits, electromagnetic theory, microwave engineering, and satellite/wireless communication networks.",
    curriculum: ["Analog Electronics", "Digital Signal Processing", "Electromagnetic Fields", "Microprocessors & Controllers", "Antenna & Wave Propagation", "Wireless Communication"],
    careers: [
      { title: "Communication Engineer", desc: "Design and optimize cellular networks and satellite links." },
      { title: "Telecom Specialist", desc: "Deploy fiber optic and microwave communication backbones." },
      { title: "Hardware Design Engineer", desc: "Prototype circuit board designs and signal transmitters." }
    ]
  },
  {
    slug: "mtech-vlsi",
    title: "M.Tech. VLSI and Embedded Systems Design",
    desc: "Architecting microchips, integrated circuits (ICs), and semiconductor systems.",
    duration: "2 Years (Postgraduate)",
    department: "Electronics and Communication Engineering",
    degreeType: "M.Tech Specialization",
    overview: "Specialized curriculum focusing on CMOS technology, RTL coding, HDL simulation, ASIC/FPGA layout design, and electronic design automation (EDA) tools.",
    curriculum: ["CMOS Digital Circuits", "Hardware Description Languages (Verilog)", "ASIC Design Flow", "FPGA Prototyping", "Mixed Signal Design", "EDA Tool Laboratory"],
    careers: [
      { title: "VLSI Design Engineer", desc: "Create schematics and layouts for advanced processors and memory chips." },
      { title: "RTL Verification Engineer", desc: "Write verification testbenches to validate silicon logic before manufacturing." },
      { title: "Physical Design Engineer", desc: "Optimize chip power, performance, and area (PPA) layouts." }
    ]
  },
  {
    slug: "phd-ece",
    title: "Ph.D. Electronics and Communication Engineering",
    desc: "Doctoral research program in advanced communications, signal processing, and semiconductor technologies.",
    duration: "3-5 Years (Doctoral)",
    department: "Electronics and Communication Engineering",
    degreeType: "Ph.D.",
    overview: "Advanced doctoral research in wireless communication, 5G/6G networks, RF/microwave design, and photonics.",
    curriculum: ["Advanced Research Methodology", "Advanced Signal Processing", "Electromagnetic Wave Theory", "Doctoral Dissertation"],
    careers: [
      { title: "Professor / Academician", desc: "Teach and mentor university students while conducting funded research." },
      { title: "R&D Principal Engineer", desc: "Lead innovation teams in telecom and semiconductor giants." }
    ]
  },

  // Civil Engineering
  {
    slug: "btech-civil",
    title: "B.Tech. Civil Engineering",
    desc: "Building sustainable infrastructure, smart cities, and modern transportation networks.",
    duration: "4 Years (Undergraduate)",
    department: "Civil Engineering",
    degreeType: "B.Tech",
    overview: "Comprehensive study of structural design, environmental engineering, geotechnical mechanics, construction management, and urban transportation planning.",
    curriculum: ["Structural Analysis", "Fluid Mechanics & Hydraulics", "Geotechnical Engineering", "Transportation Engineering", "Environmental Engineering", "Concrete Technology"],
    careers: [
      { title: "Structural Engineer", desc: "Analyze and design safe, resilient buildings and infrastructure." },
      { title: "Project Manager", desc: "Oversee civil construction schedules, budgets, and quality controls." },
      { title: "Urban Planner", desc: "Design sustainable civic infrastructure and transportation layouts." }
    ]
  },
  {
    slug: "mtech-structural",
    title: "M.Tech. Structural Engineering",
    desc: "Advanced analysis, earthquake engineering, and high-rise structural design.",
    duration: "2 Years (Postgraduate)",
    department: "Civil Engineering",
    degreeType: "M.Tech Specialization",
    overview: "Specialized postgraduate program emphasizing finite element methods, seismic resistant structures, and advanced composite materials.",
    curriculum: ["Advanced Structural Analysis", "Finite Element Method", "Earthquake Resistant Design", "Stability of Structures", "Structural Dynamics", "Thesis Project"],
    careers: [
      { title: "Senior Structural Consultant", desc: "Provide high-level consulting for complex mega-structures." },
      { title: "Bridge & Infrastructure Designer", desc: "Engineer bridges, highways, and public transit structures." }
    ]
  },
  {
    slug: "phd-structural",
    title: "Ph.D. Structural Engineering",
    desc: "Doctoral research focusing on advanced structural mechanics, disaster-resilient building systems, and green materials.",
    duration: "3-5 Years (Doctoral)",
    department: "Civil Engineering",
    degreeType: "Ph.D.",
    overview: "High-impact doctoral research in structural health monitoring, concrete durability, dynamic seismic simulation, and green building technologies.",
    curriculum: ["Research Methodology", "Continuum Mechanics", "Nonlinear Structural Analysis", "Doctoral Thesis"],
    careers: [
      { title: "Research Director", desc: "Lead civil and structural innovation in government and industrial bodies." },
      { title: "University Professor", desc: "Conduct academic research and train civil engineering scholars." }
    ]
  },

  // ────────────────────────────────────────────────────────────
  // 3. SCHOOL OF BUSINESS & MANAGEMENT (1 Program)
  // ────────────────────────────────────────────────────────────

  // Business & Management
  {
    slug: "mba",
    title: "Master of Business Administration (MBA)",
    desc: "Transforming ambitious professionals into strategic corporate leaders and visionary entrepreneurs.",
    duration: "2 Years (Postgraduate)",
    department: "Business and Management",
    degreeType: "MBA",
    overview: "Dual-specialization MBA offering cutting-edge management pedagogy in Finance, Marketing, Human Resources, Business Analytics, and Operations.",
    curriculum: ["Financial Management", "Marketing Strategies & Digital Growth", "Human Resource Analytics", "Operations & Supply Chain Management", "Strategic Management", "Capstone Internship"],
    careers: [
      { title: "Marketing Director", desc: "Lead brand strategy, digital growth, and market penetration." },
      { title: "Financial Analyst / Investment Manager", desc: "Evaluate corporate portfolios, capital budgeting, and investments." },
      { title: "Operations Head", desc: "Optimize enterprise supply chains and operational workflows." }
    ]
  }
];
