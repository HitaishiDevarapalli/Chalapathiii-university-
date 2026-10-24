import type { DirectoryData, FacultyMember } from "../context/DataContext";

export type FacultyRosterEntry = Omit<FacultyMember, "phone" | "email" | "avatar" | "age" | "experience" | "idNo"> & {
  isHod: boolean;
};

export const FACULTY_ROSTER: FacultyRosterEntry[] = [
  {
    "department": "Cyber Security",
    "name": "Dr. D Kalyan Kumar",
    "title": "Professor",
    "edu": "M.Tech,PhD",
    "interests": "Cryptography & Networtk Security",
    "teachingSubjects": [
      "Block Chain Technology",
      "ICS Lab"
    ],
    "administrativeDuties": "HOD & General Administrative Duties",
    "publications": {
      "Publications 1 – Journals": "28",
      "Publications 2 – Conferences": "9",
      "Publications 4 – Books": "5",
      "Publications 5 – Patents Published": "6",
      "Publications 6 – Patents Granted": "7"
    },
    "conferencesAttended": "10",
    "conferencesOrganized": "4",
    "additionalDetails": {
      "S.No.": "1",
      "Subject Teaching 1": "Block Chain Technology",
      "Subject Teaching 2": "ICS Lab",
      "Publications 1 – Journals": "28",
      "Publications 2 – Conferences": "9",
      "Publications 4 – Books": "5",
      "Publications 5 – Patents Published": "6",
      "Publications 6 – Patents Granted": "7"
    },
    "isHod": true
  },
  {
    "department": "Cyber Security",
    "name": "Mr. P. PremChand",
    "title": "Assist Professor",
    "edu": "M.Tech",
    "interests": "Machine Learning",
    "teachingSubjects": [
      "CLSP",
      "ICS, ICS Lab"
    ],
    "administrativeDuties": "Time Table, T&P, Website, Decipline committee, NPTEL, Class In-charge(IV Year), Student mentor.",
    "publications": {
      "Publications 1 – Journals": "13",
      "Publications 2 – Conferences": "9",
      "Publications 3 – Book Chapters": "2",
      "Publications 5 – Patents Published": "1"
    },
    "conferencesAttended": "4",
    "conferencesOrganized": "2",
    "additionalDetails": {
      "S.No.": "2",
      "Subject Teaching 1": "CLSP",
      "Subject Teaching 2": "ICS, ICS Lab",
      "Publications 1 – Journals": "13",
      "Publications 2 – Conferences": "9",
      "Publications 3 – Book Chapters": "2",
      "Publications 5 – Patents Published": "1"
    },
    "isHod": false
  },
  {
    "department": "Cyber Security",
    "name": "Mr. P. Murali Krishna",
    "title": "Associate Professor",
    "edu": "M.Tech",
    "interests": "Data Science, Machine Learning, and Data Structures and Algorithm Analysis",
    "teachingSubjects": [
      "EH Lab,  CC Lab",
      "ADS&AA, ADS&AA Lab"
    ],
    "administrativeDuties": "R&D, IQAC, Course Files, Class In-charge(II Year), Student mentor",
    "publications": {
      "Publications 1 – Journals": "6",
      "Publications 5 – Patents Published": "1"
    },
    "conferencesAttended": "3",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "3",
      "Subject Teaching 1": "EH Lab,  CC Lab",
      "Subject Teaching 2": "ADS&AA, ADS&AA Lab",
      "Publications 1 – Journals": "6",
      "Publications 5 – Patents Published": "1"
    },
    "isHod": false
  },
  {
    "department": "Cyber Security",
    "name": "Ms. K. Nalini",
    "title": "Assist Professor",
    "edu": "M.Tech",
    "interests": "Network Security",
    "teachingSubjects": [
      "ATCD",
      "ADS&AA Lab, Python Lab"
    ],
    "administrativeDuties": "Class In-charge(III Year), Student mentor.",
    "publications": {
      "Publications 1 – Journals": "2"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "4",
      "Subject Teaching 1": "ATCD",
      "Subject Teaching 2": "ADS&AA Lab, Python Lab",
      "Publications 1 – Journals": "2"
    },
    "isHod": false
  },
  {
    "department": "Cyber Security",
    "name": "Ms. K Prathyusha",
    "title": "Assist Professor",
    "edu": "M.Tech",
    "interests": "",
    "teachingSubjects": [
      "SADP",
      "CC,and CC Lab"
    ],
    "administrativeDuties": "Student mentor.",
    "publications": {},
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "5",
      "Subject Teaching 1": "SADP",
      "Subject Teaching 2": "CC,and CC Lab"
    },
    "isHod": false
  },
  {
    "department": "Cyber Security",
    "name": "Ms. J. Bhavani",
    "title": "Assist Professor",
    "edu": "MCA,(M.Tech)",
    "interests": "",
    "teachingSubjects": [
      "Java, Java lab"
    ],
    "administrativeDuties": "Student mentor.",
    "publications": {
      "Publications 1 – Journals": "1"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "6",
      "Subject Teaching 2": "Java, Java lab",
      "Publications 1 – Journals": "1"
    },
    "isHod": false
  },
  {
    "department": "Cyber Security",
    "name": "Mr. J. Ashok",
    "title": "Assist Professor",
    "edu": "M.Tech",
    "interests": "",
    "teachingSubjects": [
      "Full Stack, Flutter",
      "EH Lab Lab"
    ],
    "administrativeDuties": "SAP Coordinator, Student mentor.",
    "publications": {},
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "7",
      "Subject Teaching 1": "Full Stack, Flutter",
      "Subject Teaching 2": "EH Lab Lab"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "Dr. Balamuralikrishna Potti",
    "title": "Director IQAC and Professor, Electronics & Communication Engineering",
    "edu": "Ph.D. (Computer Networks); M.Tech. (ICS); B.E. (ECE); AICTE-QIP in AIML; Post-Doctoral Fellow (pursuing)",
    "interests": "Wireless Mesh Networks; Cognitive Radio Networks; IoT and healthcare networks; wireless sensor networks; antenna design; VLSI; signal and image processing; AI/ML; blockchain and security",
    "teachingSubjects": [
      "Electronic Devices and Circuits"
    ],
    "administrativeDuties": "Director IQAC, IIC R&D Coordinator, Chairman Disciplinary  Committee; Chairman Student Griviance Redressal Committee, Member in Academic Council, Member in CR&CD Committee, NBA Coordinator; IEEE Student Branch Faculty Coordinator; IETE Students Forum Secretary; MSME Coordinator",
    "publications": {
      "Publications 1 – Journals": "58",
      "Publications 2 – Conferences": "12",
      "Publications 3 – Book Chapters": "5",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "6",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "50",
    "conferencesOrganized": "18",
    "additionalDetails": {
      "S.No.": "1",
      "Subject Teaching 1": "Electronic Devices and Circuits",
      "Publications 1 – Journals": "58",
      "Publications 2 – Conferences": "12",
      "Publications 3 – Book Chapters": "5",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "6",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "Dr. D.NAGARAVIKIRAN",
    "title": "Professor",
    "edu": "Ph.D",
    "interests": "wireless networks and AI",
    "teachingSubjects": [
      "COA (A)",
      "COA (B)"
    ],
    "administrativeDuties": "HOD",
    "publications": {
      "Publications 1 – Journals": "20",
      "Publications 2 – Conferences": "4",
      "Publications 3 – Book Chapters": "2",
      "Publications 4 – Books": "nil",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "nil"
    },
    "conferencesAttended": "52",
    "conferencesOrganized": "47",
    "additionalDetails": {
      "S.No.": "2",
      "Subject Teaching 1": "COA (A)",
      "Subject Teaching 2": "COA (B)",
      "Publications 1 – Journals": "20",
      "Publications 2 – Conferences": "4",
      "Publications 3 – Book Chapters": "2",
      "Publications 4 – Books": "nil",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "nil"
    },
    "isHod": true
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "A.LALITHA",
    "title": "Associate Professor",
    "edu": "M.Tech(Ph.D)",
    "interests": "Wireless Communications ,Signal Processing.",
    "teachingSubjects": [
      "Digital Communications    For III B.tech ECE(A&B)",
      "Digital Logic & Computer Organisation     For  NIAT AIML"
    ],
    "administrativeDuties": "NPTEL SPOC ,NPTEL Co ordinator , Dept Internship Co ordinator,college Decoration Coordinator",
    "publications": {
      "Publications 1 – Journals": "22 Journal Publications",
      "Publications 2 – Conferences": "8 conference proceedings",
      "Publications 3 – Book Chapters": "1 Book Chapter",
      "Publications 4 – Books": "2 Books",
      "Publications 5 – Patents Published": "3 Patents",
      "Publications 6 – Patents Granted": "Nil"
    },
    "conferencesAttended": "100",
    "conferencesOrganized": "10",
    "additionalDetails": {
      "S.No.": "3",
      "Subject Teaching 1": "Digital Communications    For III B.tech ECE(A&B)",
      "Subject Teaching 2": "Digital Logic & Computer Organisation     For  NIAT AIML",
      "Publications 1 – Journals": "22 Journal Publications",
      "Publications 2 – Conferences": "8 conference proceedings",
      "Publications 3 – Book Chapters": "1 Book Chapter",
      "Publications 4 – Books": "2 Books",
      "Publications 5 – Patents Published": "3 Patents",
      "Publications 6 – Patents Granted": "Nil"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "T.RAJU",
    "title": "Associate Professor",
    "edu": "M.Tech,(Ph.D -Thesis Submitted )",
    "interests": "Wireless Communications",
    "teachingSubjects": [
      "Signals and Systems",
      "Digital Logic & Computer Organization"
    ],
    "administrativeDuties": "department deputy HOD, NBA criteria 6 incharge, Admissions incharge",
    "publications": {
      "Publications 1 – Journals": "25",
      "Publications 2 – Conferences": "15",
      "Publications 3 – Book Chapters": "5",
      "Publications 4 – Books": "2",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "4"
    },
    "conferencesAttended": "58",
    "conferencesOrganized": "15",
    "additionalDetails": {
      "S.No.": "4",
      "Subject Teaching 1": "Signals and Systems",
      "Subject Teaching 2": "Digital Logic & Computer Organization",
      "Publications 1 – Journals": "25",
      "Publications 2 – Conferences": "15",
      "Publications 3 – Book Chapters": "5",
      "Publications 4 – Books": "2",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "4"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "S.SREE CHANDRA",
    "title": "Associate Professor",
    "edu": "Ph.D. Thesis Submitted. (ECE - Communications); M.Tech. (DECS); B.Tech. (ECE); AICTE-QIP in AI & DS",
    "interests": "Cognitive Radio Networks; Wireless Sensor Networks; IoT; Wireless Networks; 5G Communications; AI/ML; Image Processing",
    "teachingSubjects": [
      "1.Soft Computing Techniques for IV B.Tech,ECE(A &B)  2. QNX RTOS ,for IV B.Tech,ECE(A &B)",
      "ADIC for III.B.Tech,(ECE A & B)"
    ],
    "administrativeDuties": "IEEE Student Branch Counsellor; Faculty In-charge, IETE Students Forum; Convener, Girls Hostel; NBA Coordinator (Criteria 2, 3, 5 & 7); Former HoD, ECE",
    "publications": {
      "Publications 1 – Journals": "18",
      "Publications 2 – Conferences": "5",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "44",
    "conferencesOrganized": "4",
    "additionalDetails": {
      "S.No.": "5",
      "Subject Teaching 1": "1.Soft Computing Techniques for IV B.Tech,ECE(A &B)  2. QNX RTOS ,for IV B.Tech,ECE(A &B)",
      "Subject Teaching 2": "ADIC for III.B.Tech,(ECE A & B)",
      "Publications 1 – Journals": "18",
      "Publications 2 – Conferences": "5",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "D.PRABHAKAR",
    "title": "Assistant Professor",
    "edu": "M.Tech. (2012), Sri Vasavi Engineering College, JNTUK; B.Tech. ECE (2007), Siddhartha Engineering College; Intermediate (2002); SSC (1998)",
    "interests": "Wireless Communications; Massive MIMO-OFDM; FPGA Design; Digital Circuits; VLSI; Embedded Systems; IoT; Machine Learning; Image Processing; AI/ML",
    "teachingSubjects": [
      "MPMC; Pulse and Digital Circuits; Radar System; Cellular Mobile Communications",
      "DLD; Optical Communications; VLSI; Embedded Systems"
    ],
    "administrativeDuties": "Lab In-charge; Project Coordinator; Anti-Ragging Committee; Counseling In-charge; NSS Coordinator",
    "publications": {
      "Publications 1 – Journals": "7",
      "Publications 2 – Conferences": "2",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "AICTE-ATAL FDPs; National-level FDPs; webinars on IoT, AI, Machine Learning, Image Processing, Research, Broadcasting trends; IEEE webinars; Electromagnetic Fields and Waves quiz",
    "conferencesOrganized": "NO",
    "additionalDetails": {
      "S.No.": "6",
      "Subject Teaching 1": "MPMC; Pulse and Digital Circuits; Radar System; Cellular Mobile Communications",
      "Subject Teaching 2": "DLD; Optical Communications; VLSI; Embedded Systems",
      "Publications 1 – Journals": "7",
      "Publications 2 – Conferences": "2",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "SK MASTAN BASHA",
    "title": "Associate Professor",
    "edu": "M.Tech",
    "interests": "VLSI & EMBEDDED SYTEMS",
    "teachingSubjects": [
      "Probability Theory and Stochstic Processes",
      "DIGITAL ELECTRONICS"
    ],
    "administrativeDuties": "Member in HOSTEL ,CANTEEN,DISCIPLINE,ERP COMMITTEES AND TIMETABLE COORDINATOR",
    "publications": {
      "Publications 1 – Journals": "17",
      "Publications 2 – Conferences": "2",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "nil",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "nil"
    },
    "conferencesAttended": "42",
    "conferencesOrganized": "10",
    "additionalDetails": {
      "S.No.": "7",
      "Subject Teaching 1": "Probability Theory and Stochstic Processes",
      "Subject Teaching 2": "DIGITAL ELECTRONICS",
      "Publications 1 – Journals": "17",
      "Publications 2 – Conferences": "2",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "nil",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "nil"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "K RAMESH BABU",
    "title": "ASSISTANT PROFESSOR",
    "edu": "M.TECH",
    "interests": "DIGITAL SYSTEMS AND COMPUTER ELECTRONICS",
    "teachingSubjects": [
      "EMBEDDED SYSTEMS",
      "DL & CO"
    ],
    "administrativeDuties": "CANTEEN COMMITTEE,SC ST COMMITTEE",
    "publications": {
      "Publications 1 – Journals": "2",
      "Publications 2 – Conferences": "1"
    },
    "conferencesAttended": "10",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "8",
      "Subject Teaching 1": "EMBEDDED SYSTEMS",
      "Subject Teaching 2": "DL & CO",
      "Publications 1 – Journals": "2",
      "Publications 2 – Conferences": "1"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "Y JOSEPH",
    "title": "Assistant proffesor",
    "edu": "M.Tech",
    "interests": "Wireless Sensor Networks",
    "teachingSubjects": [
      "Electronic Devices AND Circuits for III B.Tech (CSE-A &B)",
      "Computer Networks for    IV B.Tech (ECE-A &B)"
    ],
    "administrativeDuties": "NBA (Criteria 4) and ADMISSIONS",
    "publications": {
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "1",
      "Publications 5 – Patents Published": "1"
    },
    "conferencesAttended": "1 Conference and 4 FDP'S",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "9",
      "Subject Teaching 1": "Electronic Devices AND Circuits for III B.Tech (CSE-A &B)",
      "Subject Teaching 2": "Computer Networks for    IV B.Tech (ECE-A &B)",
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "1",
      "Publications 5 – Patents Published": "1"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "G SUDHEER",
    "title": "Assistant proffessor",
    "edu": "M.tech",
    "interests": "",
    "teachingSubjects": [
      "Celluar mobile Communication",
      "Embedded Systems"
    ],
    "administrativeDuties": "Bus in Charge in Chilakaluripet route",
    "publications": {
      "Publications 1 – Journals": "2"
    },
    "conferencesAttended": "3",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "10",
      "Subject Teaching 1": "Celluar mobile Communication",
      "Subject Teaching 2": "Embedded Systems",
      "Publications 1 – Journals": "2"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "S RAMARAO",
    "title": "ASSISTANT PROFESSOR",
    "edu": "M.TECH(Ph.D)",
    "interests": "EMBEDDED SYSTEMS",
    "teachingSubjects": [
      "EMBEDDED SYSTEMS",
      "DIGITAL ELECTRONICS"
    ],
    "administrativeDuties": "NSS COORDINATOR",
    "publications": {
      "Publications 1 – Journals": "2(Google scholors)"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "11",
      "Subject Teaching 1": "EMBEDDED SYSTEMS",
      "Subject Teaching 2": "DIGITAL ELECTRONICS",
      "Publications 1 – Journals": "2(Google scholors)"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "N NAGESWARA RAO",
    "title": "Assistant proffesor",
    "edu": "M.Tech(phd)",
    "interests": "Cellular Networks 5G/6G",
    "teachingSubjects": [
      "Electronic Devices AND Circuits for III B.Tech (CSE-C&D)",
      "Universal human values for    II B.Tech (ECE)"
    ],
    "administrativeDuties": "Mentor",
    "publications": {
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "4",
      "Publications 3 – Book Chapters": "nil",
      "Publications 4 – Books": "nil",
      "Publications 5 – Patents Published": "nil",
      "Publications 6 – Patents Granted": "nil"
    },
    "conferencesAttended": "20",
    "conferencesOrganized": "5",
    "additionalDetails": {
      "S.No.": "12",
      "Subject Teaching 1": "Electronic Devices AND Circuits for III B.Tech (CSE-C&D)",
      "Subject Teaching 2": "Universal human values for    II B.Tech (ECE)",
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "4",
      "Publications 3 – Book Chapters": "nil",
      "Publications 4 – Books": "nil",
      "Publications 5 – Patents Published": "nil",
      "Publications 6 – Patents Granted": "nil"
    },
    "isHod": false
  },
  {
    "department": "Electronics and Communication Engineering",
    "name": "RAMAIAH",
    "title": "District Resource Person (DRP), PMFME – A.P. Food Processing Society (01/2023–Present); previously Assistant Professor, ECE, PACE Institute of Technology & Sciences (04/2015–07/2020); Lab Assistant, ECE, PACE Institute (06/2010–03/2015); Personal Assistant to Executive Director, Rythu Sadhikara Samstha (01/11/2023–31/07/2025); CFL Counsellor (12/2021–07/2022)",
    "edu": "M.Tech (2015, JNTUK Kakinada, 71%); B.Tech (2010, JNTUK Kakinada, 59%); Intermediate (2001, 58.2%); SSC (1999, 63.1%)",
    "interests": "Digital/VLSI design; FPGA-based signal processing and FFT; digital circuits and shift registers; GABOR filter design; communications engineering; wireless sensor networks; DAS/SAN protocols (based on listed papers and subjects)",
    "teachingSubjects": [
      "Digital Logic Design; Switching Theory and Logic Design; Analog Communications",
      "Wireless Sensor Networks; Computer Networks"
    ],
    "administrativeDuties": "DRP: awareness camps, credit-linked subsidy application facilitation, DPR and bank-loan support for micro-enterprises, regulatory approvals/certifications (FSSAI, Udyam, GST). Personal Assistant: filing/database management, meeting organization and minutes, diary/appointment scheduling, correspondence, calls/emails, report and presentation formatting. CFL Counsellor: financial literacy counselling, savings/borrowing/insurance/pension education, outreach and compliance registers. College duties not specified.",
    "publications": {
      "Publications 1 – Journals": "4 journal papers listed in resume (2013, 2014, 2015, 2016)",
      "Publications 2 – Conferences": "1 conference paper listed as published at ICRITETSM-2023; 1 paper presented at International Conference on Recent Challenges in Science, Engineering and Technology (publication details not specified)",
      "Publications 3 – Book Chapters": "NIL",
      "Publications 4 – Books": "NIL",
      "Publications 5 – Patents Published": "NIL",
      "Publications 6 – Patents Granted": "NIL"
    },
    "conferencesAttended": "10",
    "conferencesOrganized": "NIL",
    "additionalDetails": {
      "S.No.": "13",
      "Subject Teaching 1": "Digital Logic Design; Switching Theory and Logic Design; Analog Communications",
      "Subject Teaching 2": "Wireless Sensor Networks; Computer Networks",
      "Publications 1 – Journals": "4 journal papers listed in resume (2013, 2014, 2015, 2016)",
      "Publications 2 – Conferences": "1 conference paper listed as published at ICRITETSM-2023; 1 paper presented at International Conference on Recent Challenges in Science, Engineering and Technology (publication details not specified)",
      "Publications 3 – Book Chapters": "NIL",
      "Publications 4 – Books": "NIL",
      "Publications 5 – Patents Published": "NIL",
      "Publications 6 – Patents Granted": "NIL"
    },
    "isHod": false
  },
  {
    "department": "Artificial Intelligence",
    "name": "Dr. S.Santhi Priya",
    "title": "Associate Professor",
    "edu": "B.Tech,M.Tech,Ph.D",
    "interests": "Deep Learning",
    "teachingSubjects": [
      "OOPS Through Java"
    ],
    "administrativeDuties": "I/C HOD CSE-AI",
    "publications": {
      "Publications 1 – Journals": "8",
      "Publications 2 – Conferences": "9",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "4",
      "Publications 5 – Patents Published": "7",
      "Publications 6 – Patents Granted": "1"
    },
    "conferencesAttended": "3",
    "conferencesOrganized": "3",
    "additionalDetails": {
      "S.No.": "1",
      "Subject Teaching 1": "OOPS Through Java",
      "Publications 1 – Journals": "8",
      "Publications 2 – Conferences": "9",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "4",
      "Publications 5 – Patents Published": "7",
      "Publications 6 – Patents Granted": "1"
    },
    "isHod": true
  },
  {
    "department": "Artificial Intelligence",
    "name": "Dr P. Sri Vidya",
    "title": "Assistant Professor",
    "edu": "B.Tech,M.Tech,Ph.D",
    "interests": "Big Data Analytice",
    "teachingSubjects": [
      "Computer Networks",
      "Quantum Technologies"
    ],
    "administrativeDuties": "Timetable coordinator & Class Incharge ( 3rd yr sec'A')",
    "publications": {
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "6",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "1",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "1",
    "conferencesOrganized": "1",
    "additionalDetails": {
      "S.No.": "2",
      "Subject Teaching 1": "Computer Networks",
      "Subject Teaching 2": "Quantum Technologies",
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "6",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "1",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Artificial Intelligence",
    "name": "G.Geetha",
    "title": "Assistant Professor",
    "edu": "B.Tech,M.Tech",
    "interests": "",
    "teachingSubjects": [
      "Advanced Data Structures"
    ],
    "administrativeDuties": "IIC Cordinator & Class Incharge ( 2nd Yr sec ' B')",
    "publications": {
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "6",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "1",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "1",
    "conferencesOrganized": "1",
    "additionalDetails": {
      "S.No.": "3",
      "Subject Teaching 1": "Advanced Data Structures",
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "6",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "1",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Artificial Intelligence",
    "name": "A Srinivasa Rao",
    "title": "Assistant Professor",
    "edu": "MCA. M.Tech,(PhD)",
    "interests": "Machine Learning",
    "teachingSubjects": [
      "Operating System",
      "Block Chain Technologies"
    ],
    "administrativeDuties": "",
    "publications": {
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "6",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "1",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "1",
    "conferencesOrganized": "1",
    "additionalDetails": {
      "S.No.": "4",
      "Subject Teaching 1": "Operating System",
      "Subject Teaching 2": "Block Chain Technologies",
      "Publications 1 – Journals": "6",
      "Publications 2 – Conferences": "6",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "1",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Artificial Intelligence",
    "name": "B R Gandhi",
    "title": "Assistant Professor",
    "edu": "B.Tech,M.tech (Ph.D)",
    "interests": "Machine Learning",
    "teachingSubjects": [
      "Deep Learning",
      "OOPS Through Java"
    ],
    "administrativeDuties": "T & P Coordinator & Hostel Committee member",
    "publications": {
      "Publications 1 – Journals": "8",
      "Publications 2 – Conferences": "8",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "2",
    "conferencesOrganized": "1",
    "additionalDetails": {
      "S.No.": "5",
      "Subject Teaching 1": "Deep Learning",
      "Subject Teaching 2": "OOPS Through Java",
      "Publications 1 – Journals": "8",
      "Publications 2 – Conferences": "8",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Artificial Intelligence",
    "name": "A Vamsi Kumar",
    "title": "Assistant Professor",
    "edu": "B.Tech,M.tech (Ph.D)",
    "interests": "Deep Learning",
    "teachingSubjects": [
      "Artificial Intelligence",
      "Natural Language Processing"
    ],
    "administrativeDuties": "Department Research Cordinator & class Incharge (4th yr 'a' & 'b')",
    "publications": {
      "Publications 1 – Journals": "7",
      "Publications 2 – Conferences": "7",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "2",
    "conferencesOrganized": "1",
    "additionalDetails": {
      "S.No.": "6",
      "Subject Teaching 1": "Artificial Intelligence",
      "Subject Teaching 2": "Natural Language Processing",
      "Publications 1 – Journals": "7",
      "Publications 2 – Conferences": "7",
      "Publications 3 – Book Chapters": "1",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "2",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Artificial Intelligence",
    "name": "D Roja Rani",
    "title": "Assistant Professor",
    "edu": "B.Tech(EEE), M.Tech (PE), M.Tech(CSE)",
    "interests": "",
    "teachingSubjects": [
      "Object Oriented Analysis & Design",
      "Web Application Development ( Ist Yr)"
    ],
    "administrativeDuties": "Class Incharge ( 2nd Yr sec ' A')",
    "publications": {
      "Publications 1 – Journals": "0",
      "Publications 2 – Conferences": "0",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "0",
    "conferencesOrganized": "0",
    "additionalDetails": {
      "S.No.": "7",
      "Subject Teaching 1": "Object Oriented Analysis & Design",
      "Subject Teaching 2": "Web Application Development ( Ist Yr)",
      "Publications 1 – Journals": "0",
      "Publications 2 – Conferences": "0",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Artificial Intelligence",
    "name": "Ramya",
    "title": "Teaching Assistant",
    "edu": "MCA",
    "interests": "",
    "teachingSubjects": [],
    "administrativeDuties": "",
    "publications": {
      "Publications 1 – Journals": "0",
      "Publications 2 – Conferences": "0",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "1",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "0",
    "conferencesOrganized": "0",
    "additionalDetails": {
      "S.No.": "8",
      "Publications 1 – Journals": "0",
      "Publications 2 – Conferences": "0",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "1",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Civil Engineering",
    "name": "Mr.N.Srikanth",
    "title": "Assistant Professor & Head of the Departmrnt",
    "edu": "M.Tech(PhD)",
    "interests": "Earthquake Analysis, sustainable materials and advanced construction technologies",
    "teachingSubjects": [
      "CTM(III-CE)",
      "ESC(III-CE)",
      "UHV(II-CE)",
      "ES(II-CE)"
    ],
    "administrativeDuties": "Additional controller of Examinations",
    "publications": {
      "Publications 1 – Journals": "26",
      "Publications 2 – Conferences": "3",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "1",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "1"
    },
    "conferencesAttended": "10",
    "conferencesOrganized": "5",
    "additionalDetails": {
      "S.No.": "1",
      "Subject Teaching 1": "CTM(III-CE)",
      "Subject Teaching 2": "ESC(III-CE)",
      "Subject Teaching 3": "UHV(II-CE)",
      "Subject Teaching 4": "ES(II-CE)",
      "Publications 1 – Journals": "26",
      "Publications 2 – Conferences": "3",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "1",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "1"
    },
    "isHod": true
  },
  {
    "department": "Civil Engineering",
    "name": "Mr.U.Srinivasarao",
    "title": "Assistant Professor",
    "edu": "M.Tech",
    "interests": "",
    "teachingSubjects": [
      "DDRCS(III-CE)",
      "FM(II-CE)",
      "EIA(IV-CSE-DS-A & B)",
      "ES(II-CSE-DS-B)"
    ],
    "administrativeDuties": "",
    "publications": {
      "Publications 1 – Journals": "5",
      "Publications 2 – Conferences": "2",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "1"
    },
    "conferencesAttended": "5",
    "conferencesOrganized": "0",
    "additionalDetails": {
      "S.No.": "2",
      "Subject Teaching 1": "DDRCS(III-CE)",
      "Subject Teaching 2": "FM(II-CE)",
      "Subject Teaching 3": "EIA(IV-CSE-DS-A & B)",
      "Subject Teaching 4": "ES(II-CSE-DS-B)",
      "Publications 1 – Journals": "5",
      "Publications 2 – Conferences": "2",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "1"
    },
    "isHod": false
  },
  {
    "department": "Civil Engineering",
    "name": "Mr.Sk.Abdulkareem",
    "title": "Assistant Professor",
    "edu": "M.Tech",
    "interests": "",
    "teachingSubjects": [
      "GTE-II(IV-CE)",
      "GTE-I(III-CE)",
      "EIA(IV-CSE-AI-A & B)",
      "ES(II-AIML-C)"
    ],
    "administrativeDuties": "",
    "publications": {
      "Publications 1 – Journals": "10",
      "Publications 2 – Conferences": "3",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "1"
    },
    "conferencesAttended": "5",
    "conferencesOrganized": "0",
    "additionalDetails": {
      "S.No.": "3",
      "Subject Teaching 1": "GTE-II(IV-CE)",
      "Subject Teaching 2": "GTE-I(III-CE)",
      "Subject Teaching 3": "EIA(IV-CSE-AI-A & B)",
      "Subject Teaching 4": "ES(II-AIML-C)",
      "Publications 1 – Journals": "10",
      "Publications 2 – Conferences": "3",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "1"
    },
    "isHod": false
  },
  {
    "department": "Civil Engineering",
    "name": "Mr.V.E.S.Mahendrakumar",
    "title": "Assistant Professor",
    "edu": "M.Tech",
    "interests": "",
    "teachingSubjects": [
      "EIA(IV-CE)",
      "EIA(IV-CSE-CS)",
      "ES(II-CSE-AI-A)",
      "ES(II-CSE-AI-B)"
    ],
    "administrativeDuties": "Additional controller of Examinations",
    "publications": {
      "Publications 1 – Journals": "10",
      "Publications 2 – Conferences": "10",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "1"
    },
    "conferencesAttended": "5",
    "conferencesOrganized": "0",
    "additionalDetails": {
      "S.No.": "4",
      "Subject Teaching 1": "EIA(IV-CE)",
      "Subject Teaching 2": "EIA(IV-CSE-CS)",
      "Subject Teaching 3": "ES(II-CSE-AI-A)",
      "Subject Teaching 4": "ES(II-CSE-AI-B)",
      "Publications 1 – Journals": "10",
      "Publications 2 – Conferences": "10",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "3",
      "Publications 6 – Patents Granted": "1"
    },
    "isHod": false
  },
  {
    "department": "Civil Engineering",
    "name": "Mr.M.Ashok",
    "title": "Assistant Professor",
    "edu": "M.Tech",
    "interests": "",
    "teachingSubjects": [
      "EH(III-CE)",
      "SM(II-CE)",
      "EIA(IV-AIML)",
      "ES(II-AIML-A)"
    ],
    "administrativeDuties": "",
    "publications": {
      "Publications 1 – Journals": "2",
      "Publications 2 – Conferences": "3",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "5",
    "conferencesOrganized": "0",
    "additionalDetails": {
      "S.No.": "5",
      "Subject Teaching 1": "EH(III-CE)",
      "Subject Teaching 2": "SM(II-CE)",
      "Subject Teaching 3": "EIA(IV-AIML)",
      "Subject Teaching 4": "ES(II-AIML-A)",
      "Publications 1 – Journals": "2",
      "Publications 2 – Conferences": "3",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Civil Engineering",
    "name": "Smt.Sk.Naheedabanu",
    "title": "Assistant Professor",
    "edu": "M.Tech",
    "interests": "",
    "teachingSubjects": [
      "EIA(IV-CSE-A)",
      "EIA(IV-CSE-B)",
      "ES(II-CSE-A)                               ES(II-CSE-B)",
      "ES(II-CSE-DS-A)"
    ],
    "administrativeDuties": "",
    "publications": {
      "Publications 1 – Journals": "1",
      "Publications 2 – Conferences": "0",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "2",
    "conferencesOrganized": "0",
    "additionalDetails": {
      "S.No.": "6",
      "Subject Teaching 1": "EIA(IV-CSE-A)",
      "Subject Teaching 2": "EIA(IV-CSE-B)",
      "Subject Teaching 3": "ES(II-CSE-A)                               ES(II-CSE-B)",
      "Subject Teaching 4": "ES(II-CSE-DS-A)",
      "Publications 1 – Journals": "1",
      "Publications 2 – Conferences": "0",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Civil Engineering",
    "name": "Mr.V.Pranathkumar",
    "title": "Assistant Professor",
    "edu": "M.Tech",
    "interests": "",
    "teachingSubjects": [
      "Surveying(II-CE)",
      "ACM(IV-CE)",
      "SS(III-DCE)",
      "ES(II-AIML-B)"
    ],
    "administrativeDuties": "",
    "publications": {
      "Publications 1 – Journals": "1",
      "Publications 2 – Conferences": "1",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "conferencesAttended": "2",
    "conferencesOrganized": "0",
    "additionalDetails": {
      "S.No.": "7",
      "Subject Teaching 1": "Surveying(II-CE)",
      "Subject Teaching 2": "ACM(IV-CE)",
      "Subject Teaching 3": "SS(III-DCE)",
      "Subject Teaching 4": "ES(II-AIML-B)",
      "Publications 1 – Journals": "1",
      "Publications 2 – Conferences": "1",
      "Publications 3 – Book Chapters": "0",
      "Publications 4 – Books": "0",
      "Publications 5 – Patents Published": "0",
      "Publications 6 – Patents Granted": "0"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "G.Ramachandra Rao",
    "title": "Assistant Professor  & HOD",
    "edu": "M.Tech.,(Ph.D)",
    "interests": "Cloud Computing & Security,Machine Learning,Artifical Intelligence,DataBases",
    "teachingSubjects": [
      "Computer Networks         III CSE-C                          Computer Networks Lab",
      "Computer Networks         III CSE-D                          Computer Networks Lab"
    ],
    "administrativeDuties": "Department Academic & Adminstrative Activities ,NIRF SPOC, Eduskills Internship SPOC,SIH SPOC, Coordinator for SERVICE NOW and AWS , GOOLGLE  Global certifications,Board of Studies (BoS) Coordinator  for CSE ,Coordinator for Codechef  and smart interviews.",
    "publications": {
      "Publications 1 – Journals": "Scopous-4  UGC:16",
      "Publications 2 – Conferences/Books,Patents": "Patents:4       Books: 3      Conferences: 9"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "Conferences: 2   Workshops: 7    Seminars/Guest Letures:5",
    "additionalDetails": {
      "S.No.": "1",
      "Subject Teaching 1": "Computer Networks         III CSE-C                          Computer Networks Lab",
      "Subject Teaching 2": "Computer Networks         III CSE-D                          Computer Networks Lab",
      "Publications 1 – Journals": "Scopous-4  UGC:16",
      "Publications 2 – Conferences/Books,Patents": "Patents:4       Books: 3      Conferences: 9"
    },
    "isHod": true
  },
  {
    "department": "Computer Science & Engineering",
    "name": "VENKATA RAMAIAH KAVURI",
    "title": "Associate Professor",
    "edu": "M.TECH(Ph.d)",
    "interests": "Cloud Computing",
    "teachingSubjects": [
      "ADS&AA-3 Sections",
      "ADS&AA LAB 2 Sections"
    ],
    "administrativeDuties": "ACE,AICTE,JNTUK, FFC,FRS,AISHE,NIRF,NBA-4,Counseling",
    "publications": {
      "Publications 1 – Journals": "0",
      "Publications 2 – Conferences/Books,Patents": "8"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "2",
    "additionalDetails": {
      "S.No.": "2",
      "Subject Teaching 1": "ADS&AA-3 Sections",
      "Subject Teaching 2": "ADS&AA LAB 2 Sections",
      "Publications 1 – Journals": "0",
      "Publications 2 – Conferences/Books,Patents": "8"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "SUDHIR KUMAR JIDUGI",
    "title": "Assistant Professor",
    "edu": "MS",
    "interests": "AI & Cyber Security",
    "teachingSubjects": [
      "JAVA - 3 Sections",
      "JAVA Lab - 2 Sections"
    ],
    "administrativeDuties": "Website , Intership coordinator ,Class Teacher, Counseling",
    "publications": {
      "Publications 1 – Journals": "8",
      "Publications 2 – Conferences/Books,Patents": "2"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "3",
      "Subject Teaching 1": "JAVA - 3 Sections",
      "Subject Teaching 2": "JAVA Lab - 2 Sections",
      "Publications 1 – Journals": "8",
      "Publications 2 – Conferences/Books,Patents": "2"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "Jonnakuti Rakesh Babu",
    "title": "Assistant Professor",
    "edu": "M.TECH(Ph.d)",
    "interests": "Machine Learning",
    "teachingSubjects": [
      "DL-2 Sections, Python -2 Section, DWDM -1 section",
      "Python Lab-2 Sections, DM Lab-1 Section"
    ],
    "administrativeDuties": "Training & Placements, Website , Discipline  ,NBA Criteria (4.5,7.3), Class Teacher, Counseling",
    "publications": {
      "Publications 1 – Journals": "9",
      "Publications 2 – Conferences/Books,Patents": "5"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "4",
      "Subject Teaching 1": "DL-2 Sections, Python -2 Section, DWDM -1 section",
      "Subject Teaching 2": "Python Lab-2 Sections, DM Lab-1 Section",
      "Publications 1 – Journals": "9",
      "Publications 2 – Conferences/Books,Patents": "5"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "Jada Mrudula",
    "title": "Asst.Professor",
    "edu": "M.Tech",
    "interests": "Machine Learning",
    "teachingSubjects": [
      "GAI-2 Sections,DWDM-1 Section,ADS-1 Section",
      "DM Lab-1 Section"
    ],
    "administrativeDuties": "Class Teacher, Counselling",
    "publications": {
      "Publications 1 – Journals": "2",
      "Publications 2 – Conferences/Books,Patents": "1"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "5",
      "Subject Teaching 1": "GAI-2 Sections,DWDM-1 Section,ADS-1 Section",
      "Subject Teaching 2": "DM Lab-1 Section",
      "Publications 1 – Journals": "2",
      "Publications 2 – Conferences/Books,Patents": "1"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "PASUPULETI NAGENDRA RAO",
    "title": "Assistant professor",
    "edu": "M.Tech",
    "interests": "",
    "teachingSubjects": [
      "FLAT",
      "DWDM"
    ],
    "administrativeDuties": "",
    "publications": {},
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "6",
      "Subject Teaching 1": "FLAT",
      "Subject Teaching 2": "DWDM"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "THEDLA VASAVI KRISHNA",
    "title": "Assistant professor",
    "edu": "MBA",
    "interests": "",
    "teachingSubjects": [
      "UHV -5 sections"
    ],
    "administrativeDuties": "Class teacher, Counselling ,cultural committe member,CITY Women Empowerment member",
    "publications": {
      "Publications 1 – Journals": "1"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "7",
      "Subject Teaching 1": "UHV -5 sections",
      "Publications 1 – Journals": "1"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "NAMBURU VIJAYABHASKAR",
    "title": "Assistant professor",
    "edu": "MBA(PhD)",
    "interests": "private life insurance players comparative with Tata AIG life insurance and Bajaj alliance Life insurance",
    "teachingSubjects": [
      "UHV,EDVC",
      "HRPM"
    ],
    "administrativeDuties": "NCC,NSS COORDINATOR,INTERNSHIP COORDINATOR",
    "publications": {
      "Publications 1 – Journals": "1"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "1",
    "additionalDetails": {
      "S.No.": "8",
      "Subject Teaching 1": "UHV,EDVC",
      "Subject Teaching 2": "HRPM",
      "Publications 1 – Journals": "1"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "P.ANUSHA",
    "title": "Assistant Professor",
    "edu": "M.TECH",
    "interests": "",
    "teachingSubjects": [
      "FLAT- 2 - sections",
      "Full Stack lab - 4- sections"
    ],
    "administrativeDuties": "IQAC member, Decoration committee member, CC Lab Incharge, Class Incharge, Counselling",
    "publications": {
      "Publications 1 – Journals": "2",
      "Publications 2 – Conferences/Books,Patents": "3"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "9",
      "Subject Teaching 1": "FLAT- 2 - sections",
      "Subject Teaching 2": "Full Stack lab - 4- sections",
      "Publications 1 – Journals": "2",
      "Publications 2 – Conferences/Books,Patents": "3"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "P.venkata Lakshmi",
    "title": "Assistant professor",
    "edu": "M.TECH",
    "interests": "",
    "teachingSubjects": [
      "DWDM",
      "DWDM Lab, NPTEL, Perpinsta , SEC lab"
    ],
    "administrativeDuties": "",
    "publications": {
      "Publications 2 – Conferences/Books,Patents": "1"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "",
    "additionalDetails": {
      "S.No.": "10",
      "Subject Teaching 1": "DWDM",
      "Subject Teaching 2": "DWDM Lab, NPTEL, Perpinsta , SEC lab",
      "Publications 2 – Conferences/Books,Patents": "1"
    },
    "isHod": false
  },
  {
    "department": "Computer Science & Engineering",
    "name": "PULIBANDLA VENKATASIVA",
    "title": "Assistant Professor",
    "edu": "M.TECH",
    "interests": "",
    "teachingSubjects": [
      "CN -A&B SECTIONS",
      "CN LAB - A&B SECTIONS OOPS THROUGH JAVA"
    ],
    "administrativeDuties": "CLASS INCHARGE ,COUNSELLING,STUDENT ASSOCIATION CO-ORDINATOR",
    "publications": {
      "Publications 1 – Journals": "PUBLICATIONS -8,PATENTS: 03,BOOKS: 01,NPTEL: 03"
    },
    "conferencesAttended": "",
    "conferencesOrganized": "NO",
    "additionalDetails": {
      "S.No.": "11",
      "Subject Teaching 1": "CN -A&B SECTIONS",
      "Subject Teaching 2": "CN LAB - A&B SECTIONS OOPS THROUGH JAVA",
      "Publications 1 – Journals": "PUBLICATIONS -8,PATENTS: 03,BOOKS: 01,NPTEL: 03"
    },
    "isHod": false
  }
];

const blankFacultyMember = (department: string): FacultyMember => ({
  name: "",
  title: "",
  edu: "",
  interests: "",
  phone: "",
  email: "",
  avatar: "",
  age: "",
  experience: "",
  idNo: "",
  department
});

export const INITIAL_FACULTY_DATA: Record<string, DirectoryData> = FACULTY_ROSTER.reduce((directories, entry) => {
  const directory = directories[entry.department] || {
    hod: blankFacultyMember(entry.department),
    others: []
  };
  const member: FacultyMember = { ...entry, phone: "", email: "", avatar: "", age: "", experience: "", idNo: "" };
  if (entry.isHod) directory.hod = member;
  else directory.others.push(member);
  directories[entry.department] = directory;
  return directories;
}, {} as Record<string, DirectoryData>);
