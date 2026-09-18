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
    desc: "Professional degree focused on application software development.",
    duration: "2 Years (Postgraduate)",
    department: "Computer Applications",
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
    desc: "Doctoral research program for aspiring academicians and researchers.",
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
  {
    slug: "btech-cse-ai-ml",
    title: "B.Tech. CSE (AI & Machine Learning)",
    desc: "Unlocking automation, predictive modeling, and intelligent agent systems.",
    duration: "4 Years (Undergraduate)",
    department: "Computer Science & Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Specialized pathway focusing on advanced mathematical modeling, machine learning algorithms, deep learning neural networks, and computer vision systems. Highlights hands-on project creation in NLP and robotics.",
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
    department: "Computer Science & Engineering",
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
    department: "Computer Science & Engineering",
    degreeType: "M.Tech Specialization",
    overview: "Advanced coursework in AI research, large language models, and scalable machine learning infrastructures.",
    curriculum: ["Advanced Machine Learning", "Deep Neural Networks", "Computer Vision", "NLP & Large Language Models", "AI System Design", "Dissertation"],
    careers: [
      { title: "AI Architect", desc: "Design and orchestrate enterprise AI platforms." },
      { title: "Senior Data Scientist", desc: "Lead data science teams and research initiatives." }
    ]
  },
  {
    slug: "btech-cse-data-science",
    title: "B.Tech. CSE (Data Science)",
    desc: "Transforming big data into actionable insights and strategic decisions.",
    duration: "4 Years (Undergraduate)",
    department: "Computer Science & Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Curriculum tailored to stats, data visualization, Hadoop pipelines, and predictive analytics modeling using Python, R, and modern database warehouses.",
    curriculum: ["Applied Statistics", "Data Visualization & BI", "Big Data Analytics", "Hadoop & Spark Frameworks", "Data Mining", "Predictive Analytics"],
    careers: [
      { title: "Data Analyst", desc: "Perform statistical analyses and generate actionable business reports." },
      { title: "Data Architect", desc: "Design and maintain high-performance database cluster architectures." },
      { title: "Business Intelligence Developer", desc: "Construct dashboards and visual pipelines for executive decision support." }
    ]
  },
  {
    slug: "btech-cse-cyber-security",
    title: "B.Tech. CSE (Cyber Security)",
    desc: "Securing networks, digital assets, and critical infrastructures against modern cyber threats.",
    duration: "4 Years (Undergraduate)",
    department: "Computer Science & Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Designed to prepare scholars in cryptography, secure coding practices, cloud security architectures, and advanced penetration testing frameworks.",
    curriculum: ["Cryptography", "Network Security Protocols", "Ethical Hacking & Penetration Testing", "Digital Forensics", "Secure Software Development", "Cloud Security"],
    careers: [
      { title: "Cyber Security Analyst", desc: "Monitor network traffic and resolve security incidents." },
      { title: "Penetration Tester", desc: "Conduct authorized security audits and vulnerability assessments." },
      { title: "Security Architect", desc: "Design immune enterprise network structures and security guidelines." }
    ]
  },
  {
    slug: "btech-cse-iot",
    title: "B.Tech. CSE (Internet of Things)",
    desc: "Bridging the gap between software systems and hardware physical interactions.",
    duration: "4 Years (Undergraduate)",
    department: "Computer Science & Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Focuses on sensor integration, wireless communication protocols, microcontroller firmware development, and IoT cloud dashboard integration.",
    curriculum: ["Sensor Networks", "Microcontrollers & Embedded C", "Wireless Communication Protocols", "IoT Architecture & Cloud", "Edge Computing", "Smart Systems Lab"],
    careers: [
      { title: "IoT Firmware Engineer", desc: "Write low-level code for microcontrollers and connected sensors." },
      { title: "Embedded Systems Developer", desc: "Design hardware-software integration protocols." },
      { title: "Smart City Infrastructure Engineer", desc: "Deploy and optimize decentralized IoT networks." }
    ]
  },
  {
    slug: "btech-cse-cloud-computing",
    title: "B.Tech. CSE (Cloud Computing)",
    desc: "Scaling modern internet applications through cloud architectures and virtualization.",
    duration: "4 Years (Undergraduate)",
    department: "Computer Science & Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Teaches virtualization technologies, AWS/Azure/GCP cloud services, serverless computing, and infrastructure as code (Terraform).",
    curriculum: ["Virtualization Technologies", "Cloud Infrastructure Services", "DevOps & CI/CD Pipelines", "Serverless Architectures", "Infrastructure as Code", "Containerization & Kubernetes"],
    careers: [
      { title: "Cloud Solutions Architect", desc: "Design and implement scalable, secure cloud environments." },
      { title: "DevOps Engineer", desc: "Automate build, deployment, and testing infrastructure." },
      { title: "Site Reliability Engineer", desc: "Ensure service uptime and optimal cloud resource usage." }
    ]
  },
  {
    slug: "btech-cse-blockchain",
    title: "B.Tech. CSE (Blockchain)",
    desc: "Designing decentralized networks, smart contracts, and secure consensus models.",
    duration: "4 Years (Undergraduate)",
    department: "Computer Science & Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Prepares students in cryptographic ledger structures, smart contracts (Solidity), decentralized application (DApp) development, and consensus mechanisms.",
    curriculum: ["Cryptography & Hashing", "Consensus Algorithms", "Smart Contract Development", "Ethereum & Hyperledger", "Decentralized Apps (DApps)", "Tokenomics & DeFi Structures"],
    careers: [
      { title: "Blockchain Developer", desc: "Write and optimize secure smart contracts." },
      { title: "Decentralized System Architect", desc: "Design consensus architectures for corporate consortia." },
      { title: "Cryptographic Engineer", desc: "Deploy hashing and digital signature security frameworks." }
    ]
  },
  {
    slug: "btech-cse-software-engineering",
    title: "B.Tech. CSE (Software Engineering)",
    desc: "Applying rigorous engineering methodologies to large-scale software systems.",
    duration: "4 Years (Undergraduate)",
    department: "Computer Science & Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Focuses on software design patterns, Agile project management, software testing paradigms, and continuous integration workflows.",
    curriculum: ["Software Design Patterns", "Agile Methodologies", "Software Testing & QA", "System Architecture & Design", "CI/CD Workflows", "Project Management Tools"],
    careers: [
      { title: "Software Architect", desc: "Design high-level structure and code guidelines for large systems." },
      { title: "QA Automation Engineer", desc: "Write and run automated test suites for continuous verification." },
      { title: "Project Manager", desc: "Guide software development teams through Agile sprint cycles." }
    ]
  },

  // Electronics & Communication
  {
    slug: "btech-ece",
    title: "B.Tech. Electronics & Communication Engineering",
    desc: "Designing high-performance communication systems, signal processing, and chip architectures.",
    duration: "4 Years (Undergraduate)",
    department: "Electronics & Communication Engineering",
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
    slug: "btech-ece-vlsi",
    title: "B.Tech. ECE (VLSI Design)",
    desc: "Architecting microchips, integrated circuits (ICs), and semiconductor systems.",
    duration: "4 Years (Undergraduate)",
    department: "Electronics & Communication Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Specialized curriculum focusing on CMOS technology, RTL coding, HDL simulation, ASIC/FPGA layout design, and electronic design automation (EDA) tools.",
    curriculum: ["CMOS Digital Circuits", "Hardware Description Languages (Verilog)", "ASIC Design Flow", "FPGA Prototyping", "Mixed Signal Design", "EDA Tool Laboratory"],
    careers: [
      { title: "VLSI Design Engineer", desc: "Create schematics and layouts for advanced processors and memory chips." },
      { title: "RTL Verification Engineer", desc: "Write verification testbenches to validate silicon logic before manufacturing." },
      { title: "Physical Design Engineer", desc: "Optimize chip power, performance, and area (PPA) layouts." }
    ]
  },
  {
    slug: "btech-ece-embedded-systems",
    title: "B.Tech. ECE (Embedded Systems)",
    desc: "Engineering dedicated computing architectures inside smart consumer products and medical devices.",
    duration: "4 Years (Undergraduate)",
    department: "Electronics & Communication Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Concentrates on real-time operating systems (RTOS), hardware-software co-design, ARM architectures, and peripheral interfacing.",
    curriculum: ["Real-Time Operating Systems", "ARM Architecture", "Peripheral Interfacing", "Embedded Linux", "Hardware-Software Co-Design", "System on Chip (SoC)"],
    careers: [
      { title: "Embedded Software Developer", desc: "Write RTOS code and firmware for medical or consumer electronics." },
      { title: "Validation Engineer", desc: "Test hardware peripherals and register communications." },
      { title: "Product Prototyper", desc: "Integrate sensory and processing boards for smart appliances." }
    ]
  },
  {
    slug: "btech-ece-robotics-automation",
    title: "B.Tech. ECE (Robotics & Automation)",
    desc: "Developing autonomous robotic controls, industrial manipulators, and automated assembly systems.",
    duration: "4 Years (Undergraduate)",
    department: "Electronics & Communication Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Combines sensor systems, feedback control networks, computer vision navigation, and robotic arm kinematics.",
    curriculum: ["Robotic Kinematics & Dynamics", "Control Systems Engineering", "Robotic Vision Systems", "PLC & SCADA Programming", "Pneumatics & Hydraulics", "Autonomous Navigation"],
    careers: [
      { title: "Robotics Engineer", desc: "Design and implement autonomous robotic arms and navigation algorithms." },
      { title: "Automation Architect", desc: "Deploy PLC/SCADA controllers for industrial manufacturing lines." },
      { title: "Control Systems Designer", desc: "Optimize feedback loop stabilities in aerospace or automotive settings." }
    ]
  },
  {
    slug: "btech-ece-iot",
    title: "B.Tech. ECE (IoT Specialization)",
    desc: "Designing wireless sensory architectures and edge nodes for connected networks.",
    duration: "4 Years (Undergraduate)",
    department: "Electronics & Communication Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Teaches sensor signal conditioning, wireless mesh protocols, low-power system layouts, and IoT gateways.",
    curriculum: ["Signal Conditioning Circuits", "Wireless Sensor Networks", "Low Power VLSI Design", "IoT Gateways", "Edge Node Architectures", "RF Communications"],
    careers: [
      { title: "IoT Hardware Designer", desc: "Design energy-efficient circuit layouts for remote sensors." },
      { title: "RF Engineer", desc: "Optimize wireless frequencies and packet delivery ranges." },
      { title: "Systems Integration Developer", desc: "Connect sensory hardware nodes to corporate databases." }
    ]
  },

  // Electrical Engineering
  {
    slug: "btech-eee",
    title: "B.Tech. Electrical & Electronics Engineering",
    desc: "Powering the world through power transmission, electrical machinery, and electronic control systems.",
    duration: "4 Years (Undergraduate)",
    department: "Electrical & Electronics Engineering",
    degreeType: "B.Tech",
    overview: "Provides thorough knowledge in power systems, electrical machines, power electronics, control theory, and high voltage transmission.",
    curriculum: ["Electrical Machines", "Power Electronics", "Power Systems Engineering", "Control Systems", "High Voltage Engineering", "Electrical Measurements"],
    careers: [
      { title: "Power Systems Engineer", desc: "Design and manage regional electrical grid distribution grids." },
      { title: "Power Electronics Developer", desc: "Create converter systems for solar arrays and electric drives." },
      { title: "Electrical Grid Manager", desc: "Monitor distribution load flows and ensure grid stability." }
    ]
  },
  {
    slug: "btech-eee-electric-vehicles",
    title: "B.Tech. EEE (Electric Vehicles)",
    desc: "Engineering electric powertrains, battery management systems, and smart charging infrastructures.",
    duration: "4 Years (Undergraduate)",
    department: "Electrical & Electronics Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Covers battery chemistry, electric motor drives, regenerative braking systems, vehicle dynamics, and charging station infrastructures.",
    curriculum: ["EV Powertrain Dynamics", "Battery Management Systems (BMS)", "Electric Motor Drives", "EV Charging Technologies", "Automotive Embedded Systems", "Power Electronic Converters"],
    careers: [
      { title: "EV Powertrain Engineer", desc: "Design electric motor controllers and traction drivetrains." },
      { title: "Battery Systems Specialist", desc: "Develop thermal and voltage balancing algorithms for battery packs." },
      { title: "Charging Infrastructure Developer", desc: "Establish high-speed DC charging grids and grid integration networks." }
    ]
  },
  {
    slug: "btech-eee-renewable-energy",
    title: "B.Tech. EEE (Renewable Energy)",
    desc: "Harnessing wind, solar, and green energy sources for micro-grids and eco-friendly distribution.",
    duration: "4 Years (Undergraduate)",
    department: "Electrical & Electronics Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Focuses on photovoltaics, wind energy conversions, fuel cells, bio-energy, micro-grid architectures, and green energy management.",
    curriculum: ["Solar Photovoltaics", "Wind Energy Conversion", "Fuel Cell Technologies", "Micro-Grid Design", "Energy Auditing & Management", "Grid Integration"],
    careers: [
      { title: "Renewable Energy Analyst", desc: "Evaluate feasibility and efficiency profiles of solar and wind installations." },
      { title: "Micro-Grid Integrator", desc: "Synchronize local green energy generation with main grids." },
      { title: "Energy Auditor", desc: "Consult businesses on lowering power footprints and carbon emissions." }
    ]
  },
  {
    slug: "btech-eee-smart-grid",
    title: "B.Tech. EEE (Smart Grid)",
    desc: "Integrating IoT and communication technologies for intelligent power distribution networks.",
    duration: "4 Years (Undergraduate)",
    department: "Electrical & Electronics Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Concentrates on smart metering, wide-area monitoring systems, cybersecurity in utility grids, and distributed generation.",
    curriculum: ["Smart Metering Technologies", "Wide Area Monitoring Systems", "Grid Cybersecurity", "Distributed Generation", "SCADA for Smart Grids", "Demand Response Systems"],
    careers: [
      { title: "Smart Grid Analyst", desc: "Develop load prediction algorithms and peak-load shaving strategies." },
      { title: "Substation Automation Engineer", desc: "Deploy digital relays and automated telemetry grids." },
      { title: "Utility Security Consultant", desc: "Ensure grid control centers are immune to digital hacking attempts." }
    ]
  },

  // Mechanical Engineering
  {
    slug: "btech-mechanical",
    title: "B.Tech. Mechanical Engineering",
    desc: "Designing thermal systems, manufacturing tools, and dynamic machine structures.",
    duration: "4 Years (Undergraduate)",
    department: "Mechanical Engineering",
    degreeType: "B.Tech",
    overview: "Offers foundational training in thermodynamics, solid mechanics, fluid machinery, machine design, and manufacturing technology.",
    curriculum: ["Thermodynamics", "Strength of Materials", "Fluid Mechanics & Machinery", "Kinematics of Machinery", "Design of Machine Elements", "Computer Aided Design (CAD)"],
    careers: [
      { title: "Mechanical Design Engineer", desc: "Create structural CAD blueprints for machine parts." },
      { title: "Thermal Engineer", desc: "Optimize heat exchanger coils and boiler layouts." },
      { title: "Manufacturing Supervisor", desc: "Oversee heavy machinery shops and fabrication processes." }
    ]
  },
  {
    slug: "btech-mechanical-mechatronics",
    title: "B.Tech. Mechanical (Mechatronics)",
    desc: "Fusing mechanical components, electronic sensors, and digital control software.",
    duration: "4 Years (Undergraduate)",
    department: "Mechanical Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Highlights actuator controls, sensor integrations, automated instrumentation, and robotic system controls.",
    curriculum: ["Sensors & Actuators", "Microprocessor Interfacing", "Control Systems", "Opto-electronics", "Industrial Robotics", "Digital Controls Lab"],
    careers: [
      { title: "Mechatronics Engineer", desc: "Integrate mechanical actuators with digital sensor control loops." },
      { title: "Automation Systems Specialist", desc: "Program automated assembly tools and conveyor lines." },
      { title: "Instrumentation Developer", desc: "Design calibration tools for medical or industrial systems." }
    ]
  },
  {
    slug: "btech-mechanical-robotics",
    title: "B.Tech. Mechanical (Robotics)",
    desc: "Engineering structural chassis, linkage kinematics, and servo controls for mechanical robots.",
    duration: "4 Years (Undergraduate)",
    department: "Mechanical Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Studies robotic arms, kinematic equations, path planning, drive gears, and hydraulic/pneumatic actuators.",
    curriculum: ["Robotic Mechanism Design", "Forward & Inverse Kinematics", "Servo & Actuator Controls", "Hydraulic & Pneumatic Systems", "Path Planning & AI", "Robotic Material Science"],
    careers: [
      { title: "Robot Chassis Designer", desc: "Engineer physical robot links and lightweight stress configurations." },
      { title: "Kinematics Programmer", desc: "Write equations determining trajectory angles and tool offsets." },
      { title: "Maintenance Engineer", desc: "Calibrate and repair complex robotic arms in automotive lines." }
    ]
  },
  {
    slug: "btech-mechanical-automobile",
    title: "B.Tech. Mechanical (Automobile)",
    desc: "Designing combustion/electric engines, transmission gearing, and chassis aerodynamics.",
    duration: "4 Years (Undergraduate)",
    department: "Mechanical Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Examines internal combustion engines, gearbox transmissions, suspension systems, brake systems, and wind tunnel aerodynamic shapes.",
    curriculum: ["Combustion Engines", "Transmission Systems", "Chassis & Suspension Design", "Vehicle Aerodynamics", "Automotive NVH (Noise & Vibration)", "Vehicle Safety & Testing"],
    careers: [
      { title: "Automotive Designer", desc: "Develop aerodynamically efficient car profiles and structural frames." },
      { title: "Engine Calibration Engineer", desc: "Tune fuel injection systems and throttle profiles for power and efficiency." },
      { title: "Vibration Test Analyst", desc: "Analyze noise and rattle elements on test tracks." }
    ]
  },
  {
    slug: "btech-mechanical-manufacturing",
    title: "B.Tech. Mechanical (Manufacturing)",
    desc: "Optimizing CNC machining, casting processes, 3D printing, and factory logistics.",
    duration: "4 Years (Undergraduate)",
    department: "Mechanical Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Focuses on computer-aided manufacturing (CAM), metallurgy, casting/molding technologies, subtractive machining, and rapid 3D additive manufacturing.",
    curriculum: ["Computer Aided Manufacturing (CAM)", "Metal Casting & Joining", "CNC Programming", "Additive Manufacturing (3D Printing)", "Operations Research", "Metrology & Quality Control"],
    careers: [
      { title: "CAM Engineer", desc: "Write toolpaths for high-speed CNC mill machines." },
      { title: "Additive Manufacturing Developer", desc: "Optimize structural support prints in metal 3D printers." },
      { title: "Quality Control Manager", desc: "Deploy laser scanners and micrometers to verify physical tolerances." }
    ]
  },

  // Civil Engineering
  {
    slug: "btech-civil",
    title: "B.Tech. Civil Engineering",
    desc: "Designing roads, bridges, dam barriers, and structural concrete buildings.",
    duration: "4 Years (Undergraduate)",
    department: "Civil Engineering",
    degreeType: "B.Tech",
    overview: "Provides comprehensive knowledge in soil mechanics, structural analysis, water resource engineering, surveying, concrete technologies, and structural steel designs.",
    curriculum: ["Strength of Materials", "Surveying & GIS", "Concrete Technology", "Structural Analysis", "Geotechnical Engineering", "Transportation Engineering"],
    careers: [
      { title: "Structural Design Engineer", desc: "Calculate load limits and reinforce concrete frames." },
      { title: "Site Supervisor", desc: "Direct concrete pours and enforce construction site safety guidelines." },
      { title: "Geotechnical Consultant", desc: "Analyze soil core samples to verify foundation stabilities." }
    ]
  },
  {
    slug: "btech-civil-smart-infrastructure",
    title: "B.Tech. Civil (Smart Infrastructure)",
    desc: "Designing smart cities, sensor-embedded bridges, and sustainable concrete structures.",
    duration: "4 Years (Undergraduate)",
    department: "Civil Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Fuses traditional structural design with IoT telemetry, structural health monitoring sensors, smart drainage grids, and green building certifications.",
    curriculum: ["Structural Health Monitoring", "Smart Material Composites", "Urban Water Flow Telemetry", "Building Information Modeling (BIM)", "GIS & Remote Sensing", "Green Building Design"],
    careers: [
      { title: "BIM Manager", desc: "Model 3D virtual blueprints containing structural, electrical, and plumbing data." },
      { title: "Smart City Infrastructure Analyst", desc: "Integrate flow sensors inside municipal water grids." },
      { title: "Structural Telemetry Developer", desc: "Deploy strain gauges on suspension bridges to detect stress fractures." }
    ]
  },
  {
    slug: "btech-civil-construction-technology",
    title: "B.Tech. Civil (Construction Technology)",
    desc: "Managing high-speed concrete construction, project scheduling, and equipment machinery.",
    duration: "4 Years (Undergraduate)",
    department: "Civil Engineering",
    degreeType: "B.Tech Specialization",
    overview: "Concentrates on advanced concrete mixes, heavy machinery logistics, cost estimation, project management software (Primavera/MS Project), and modular construction.",
    curriculum: ["Advanced Concrete Mix Design", "Construction Machinery Logistics", "Cost Estimation & Tendering", "Primavera & MS Project", "Precast Concrete Systems", "Safety & Laws"],
    careers: [
      { title: "Project Planner", desc: "Map critical construction paths and resource milestones." },
      { title: "Precast Design Architect", desc: "Model modular concrete slabs for quick off-site assembly." },
      { title: "Estimating Engineer", desc: "Calculate material volumes and prepare bidding sheets." }
    ]
  },

  // Emerging Technologies
  {
    slug: "btech-emerging-ai",
    title: "B.Tech. Emerging Technologies (Artificial Intelligence)",
    desc: "Dedicated computing program exploring automated cognitive logic and neural networks.",
    duration: "4 Years (Undergraduate)",
    department: "Emerging Technologies",
    degreeType: "B.Tech",
    overview: "An elite program looking beyond classic software engineering. Fuses logic programming, deep reinforcement learning, cognitive computing, and AI hardware accelerators.",
    curriculum: ["Cognitive Computing", "Deep Reinforcement Learning", "AI Hardware Accelerators", "Neural Network Architecture", "Natural Language Generation", "Robotic AI Logic"],
    careers: [
      { title: "AI Researcher", desc: "Draft and test novel machine learning activation layers." },
      { title: "Cognitive Scientist", desc: "Model automated reasoning systems for healthcare diagnosis." },
      { title: "Neuromorphic Hardware Advisor", desc: "Deploy algorithms to custom AI processor chips." }
    ]
  },
  {
    slug: "btech-emerging-ds",
    title: "B.Tech. Emerging Technologies (Data Science)",
    desc: "Advanced data analytics, machine-to-machine telemetry, and high-frequency model loops.",
    duration: "4 Years (Undergraduate)",
    department: "Emerging Technologies",
    degreeType: "B.Tech",
    overview: "Provides skills in stream data processing, high-dimensional stats, predictive model automation, and real-time visualization dashboards.",
    curriculum: ["Real-time Stream Processing", "High-Dimensional Statistics", "Data Warehousing & ETL Pipelines", "Data Monetization Frameworks", "ML Automation (AutoML)", "Data Security Laws"],
    careers: [
      { title: "Data Stream Architect", desc: "Construct Kafka pipelines for real-time sensor streams." },
      { title: "AutoML Specialist", desc: "Deploy algorithms that automatically train and tune ML models." },
      { title: "Privacy Compliance Analyst", desc: "Ensure database records comply with GDPR and local laws." }
    ]
  },
  {
    slug: "btech-emerging-robotics",
    title: "B.Tech. Emerging Technologies (Robotics Engineering)",
    desc: "Engineering autonomous mobile robots, aerial drones, and humanoid systems.",
    duration: "4 Years (Undergraduate)",
    department: "Emerging Technologies",
    degreeType: "B.Tech",
    overview: "Fuses computer vision, autonomous mapping (SLAM), drone flight dynamics, robotic manipulation, and micro-electromechanical sensors.",
    curriculum: ["Simultaneous Localization & Mapping (SLAM)", "Drone Flight Dynamics", "Micro-Sensors (MEMS)", "Robotic Manipulation", "Autonomous Control Systems", "ROS (Robot Operating System)"],
    careers: [
      { title: "Autonomous Navigation Developer", desc: "Write SLAM logic for warehouse transport robots." },
      { title: "Drone Control Programmer", desc: "Optimize flight stabilization loops on quadcopter boards." },
      { title: "ROS Integrator", desc: "Synchronize sensory feeds with actuator controls inside ROS nodes." }
    ]
  },
  {
    slug: "btech-biomedical",
    title: "B.Tech. Biomedical Engineering",
    desc: "Fusing medical diagnostics, biosensors, and prosthetic limbs with modern engineering.",
    duration: "4 Years (Undergraduate)",
    department: "Emerging Technologies",
    degreeType: "B.Tech",
    overview: "Examines human anatomy, biosignal processing (ECG/EEG), medical imaging machines (MRI/X-Ray), wearable biosensors, and artificial heart valves.",
    curriculum: ["Human Physiology for Engineers", "Bio-Signal Processing", "Medical Imaging Instrumentation", "Biomaterials & Prothesis", "Wearable Health Sensors", "Clinical Diagnostics Lab"],
    careers: [
      { title: "Biomedical Equipment Designer", desc: "Develop next-generation ECG monitors and ultrasound probes." },
      { title: "Prosthetic Designer", desc: "Draft mechanical joints and motor control arrays for prosthetic limbs." },
      { title: "Clinical Support Specialist", desc: "Calibrate and manage critical MRI scanners in major hospital networks." }
    ]
  },
  {
    slug: "btech-biotechnology",
    title: "B.Tech. Biotechnology",
    desc: "Synthesizing bio-fuels, genetic therapies, agricultural crops, and industrial enzymes.",
    duration: "4 Years (Undergraduate)",
    department: "Emerging Technologies",
    degreeType: "B.Tech",
    overview: "Prepares students in cell biology, genetic engineering, industrial microbiology, bioreactor design, bio-fuels, and plant tissue cultures.",
    curriculum: ["Cell Biology & Genetics", "Recombinant DNA Technology", "Bioreactor Design & Scaleup", "Industrial Microbiology", "Bioinformatics & Sequence Analysis", "Plant & Animal Tissue Culture"],
    careers: [
      { title: "Genetic Engineer", desc: "Modify bacterial strains to produce insulin or industrial enzymes." },
      { title: "Bioprocess Scientist", desc: "Scale up yeast fermentation runs inside large bioreactors." },
      { title: "Bioinformatics Specialist", desc: "Analyze DNA sequence data using python processing libraries." }
    ]
  },
  {
    slug: "btech-agricultural",
    title: "B.Tech. Agricultural Engineering",
    desc: "Engineering automated irrigation, farm machinery, greenhouse soils, and food processing lines.",
    duration: "4 Years (Undergraduate)",
    department: "Emerging Technologies",
    degreeType: "B.Tech",
    overview: "Fuses soil mechanics, hydrology, automated drip irrigation, solar water pumps, combine harvesting tractors, and food preservation packaging.",
    curriculum: ["Soil Mechanics & Hydrology", "Smart Irrigation & Drip Systems", "Tractor & Farm Machinery Design", "Post-Harvest Food Processing", "Greenhouse Technology", "Soil & Water Conservation"],
    careers: [
      { title: "Irrigation Design Engineer", desc: "Model high-efficiency drip networks and solar water systems." },
      { title: "Farm Machinery Designer", desc: "Draft mechanical linkages and hydraulic systems for tractors." },
      { title: "Food Processing Advisor", desc: "Optimize temperature control loops in food packaging and freeze-drying lines." }
    ]
  },
  {
    slug: "mtech-vlsi",
    title: "M.Tech. VLSI and Embedded Systems Design",
    desc: "Advanced studies in silicon chip design and embedded microcontrollers.",
    duration: "2 Years (Postgraduate)",
    department: "Electronics and Communication Engineering",
    degreeType: "M.Tech",
    overview: "Focuses on semiconductor physics, VLSI design, SoC architectures, and advanced embedded systems programming.",
    curriculum: ["Digital VLSI Design", "Analog IC Design", "Embedded Systems Architecture", "Hardware Description Languages", "SoC Design", "Dissertation"],
    careers: [
      { title: "VLSI Design Engineer", desc: "Design and verify complex integrated circuits." },
      { title: "Embedded Software Engineer", desc: "Develop firmware for specialized microcontrollers." }
    ]
  },
  {
    slug: "phd-ece",
    title: "Ph.D. Electronics and Communication Engineering",
    desc: "Doctoral research in electronics, communications, and signal processing.",
    duration: "3-5 Years (Doctoral)",
    department: "Electronics and Communication Engineering",
    degreeType: "Ph.D.",
    overview: "Intensive research-focused program allowing students to contribute novel findings to the field of electronics and communication.",
    curriculum: ["Research Methodology", "Advanced Signal Processing", "Literature Review", "Thesis Work"],
    careers: [
      { title: "Professor / Academician", desc: "Teach and mentor university students while conducting research." },
      { title: "Research Scientist", desc: "Lead R&D divisions in global technology firms." }
    ]
  },
  {
    slug: "mtech-structural",
    title: "M.Tech. Structural Engineering",
    desc: "Advanced postgraduate study in structural design and mechanics.",
    duration: "2 Years (Postgraduate)",
    department: "Civil Engineering",
    degreeType: "M.Tech",
    overview: "Focuses on the analysis and design of complex structures like bridges, high-rises, and industrial facilities.",
    curriculum: ["Advanced Structural Analysis", "Structural Dynamics", "Earthquake Engineering", "Finite Element Methods", "Bridge Engineering", "Research Thesis"],
    careers: [
      { title: "Senior Structural Engineer", desc: "Design and certify major infrastructure projects." },
      { title: "Structural Consultant", desc: "Advise on complex structural safety and retrofitting." }
    ]
  },
  {
    slug: "phd-structural",
    title: "Ph.D. Structural Engineering",
    desc: "Doctoral research in structural mechanics, materials, and earthquake engineering.",
    duration: "3-5 Years (Doctoral)",
    department: "Civil Engineering",
    degreeType: "Ph.D.",
    overview: "Research program focused on developing new structural materials, seismic resilience methods, and advanced construction techniques.",
    curriculum: ["Research Methodology", "Advanced Solid Mechanics", "Literature Review", "Thesis Work"],
    careers: [
      { title: "Research Scientist", desc: "Conduct R&D in advanced structural materials and methods." },
      { title: "Academic Professor", desc: "Teach and lead research at higher education institutions." }
    ]
  },
  {
    slug: "mba",
    title: "Master of Business Administration (MBA)",
    desc: "Professional degree focused on business management and leadership.",
    duration: "2 Years (Postgraduate)",
    department: "Management",
    degreeType: "MBA",
    overview: "Develops expertise in finance, marketing, human resources, and business analytics for corporate leadership roles.",
    curriculum: ["Managerial Economics", "Financial Management", "Marketing Strategy", "Organizational Behavior", "Business Analytics", "Capstone Project"],
    careers: [
      { title: "Management Consultant", desc: "Advise businesses on strategic growth and operations." },
      { title: "Corporate Manager", desc: "Lead cross-functional teams in multinational corporations." }
    ]
  },

  // Basic Science & Humanities
  {
    slug: "applied-sciences",
    title: "Applied Mathematics & Computational Sciences",
    desc: "Mathematical modeling, computational numerical methods, and quantitative data analysis.",
    duration: "Foundation / Integrated",
    department: "Basic Science & Humanities",
    degreeType: "Undergraduate / Foundation",
    overview: "Provides deep rigor in advanced calculus, differential equations, linear algebra, numerical analysis, and computational statistics essential for high-performance engineering applications.",
    curriculum: ["Linear Algebra & Calculus", "Differential Equations & Transforms", "Numerical Analysis & MATLAB", "Probability & Statistics", "Discrete Mathematical Structures", "Computational Modeling"],
    careers: [
      { title: "Quantitative Analyst", desc: "Build mathematical models for algorithms and statistical forecasting." },
      { title: "Computational Scientist", desc: "Develop numerical algorithms for simulations and engineering analysis." },
      { title: "Data Analyst / Researcher", desc: "Perform statistical testing and quantitative problem-solving." }
    ]
  },
  {
    slug: "engineering-physics",
    title: "Engineering Physics & Material Sciences",
    desc: "Quantum mechanics, semiconductor physics, optics, laser systems, and smart materials.",
    duration: "Foundation / Integrated",
    department: "Basic Science & Humanities",
    degreeType: "Undergraduate / Foundation",
    overview: "Bridges fundamental physics and cutting-edge engineering technologies, exploring quantum mechanics, crystallography, optical fibers, nanophotonics, and modern semiconductor physics.",
    curriculum: ["Quantum Physics & Mechanics", "Semiconductor Device Physics", "Optics & Laser Technology", "Crystallography & Material Science", "Electromagnetic Theory", "Nanotechnology Fundamentals"],
    careers: [
      { title: "Material Science Engineer", desc: "Innovate and test next-generation materials for industrial applications." },
      { title: "Optics & Photonics Specialist", desc: "Design laser and fiber-optic communication devices." },
      { title: "Semiconductor Lab Analyst", desc: "Characterize silicon and compound semiconductor wafers." }
    ]
  },
  {
    slug: "engineering-chemistry",
    title: "Engineering Chemistry & Environmental Science",
    desc: "Polymer chemistry, electrochemistry, energy storage, corrosion science, and sustainability.",
    duration: "Foundation / Integrated",
    department: "Basic Science & Humanities",
    degreeType: "Undergraduate / Foundation",
    overview: "Explores atomic structures, battery electrochemistry, green chemistry, polymer synthesis, corrosion mitigation, and environmental sustainability practices for modern industry.",
    curriculum: ["Electrochemistry & Battery Technologies", "Polymer & Composite Materials", "Corrosion Science & Prevention", "Spectroscopic Techniques", "Green Chemistry & Sustainable Systems", "Water Treatment & Analysis"],
    careers: [
      { title: "Energy Storage Specialist", desc: "Research battery chemistries and energy storage materials." },
      { title: "Environmental Engineer", desc: "Design water purification and emissions management systems." },
      { title: "Chemical Quality Analyst", desc: "Ensure safety, standard compliance, and chemical purity." }
    ]
  },
  {
    slug: "humanities-communication",
    title: "English & Professional Communication",
    desc: "Technical writing, leadership communication, corporate dynamics, and global professional skills.",
    duration: "Foundation / Integrated",
    department: "Basic Science & Humanities",
    degreeType: "Undergraduate / Foundation",
    overview: "Equips engineering students with elite communication, business writing, presentation dynamics, cross-cultural competence, and workplace ethical reasoning.",
    curriculum: ["Technical Writing & Report Drafting", "Professional Oral Communication", "Business Presentation Dynamics", "Cross-Cultural Communication", "Workplace Ethics & Leadership", "Critical Thinking & Debate"],
    careers: [
      { title: "Technical Writer / Editor", desc: "Create enterprise documentation, whitepapers, and API specs." },
      { title: "Corporate Communications Specialist", desc: "Drive brand messaging and internal stakeholder communications." },
      { title: "Public Relations Analyst", desc: "Manage institutional relations and corporate storytelling." }
    ]
  }
];
