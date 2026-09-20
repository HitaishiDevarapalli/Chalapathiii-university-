import React, { useState, useRef, useMemo } from "react";
import { 
  Users, Plus, Trash2, Edit3, CheckCircle2, UploadCloud, Download, 
  Search, Filter, GraduationCap, Building2, Briefcase, Phone, Mail, 
  Award, FileSpreadsheet, RotateCcw, Save, Shield, Check, X, AlertCircle, ArrowRight
} from "lucide-react";
import * as XLSX from "xlsx";
import { 
  useData, 
  FacultyMember, 
  DirectoryData, 
  INITIAL_FACULTY_DATA, 
  INITIAL_BOARD_DATA 
} from "../../context/DataContext";
import { ImageField, SectionHeader } from "./AdminComponents";

interface FacultyCMSProps {
  notifySave: (msg: string) => void;
}

export interface SchoolDefinition {
  id: string;
  name: string;
  route: string;
  iconName: string;
  departments: string[];
}

export const SCHOOL_DEFINITIONS: SchoolDefinition[] = [
  {
    id: "computing",
    name: "School of Computing Sciences",
    route: "/management/faculty/computing",
    iconName: "💻",
    departments: [
      "Computer Science & Engineering",
      "Artificial Intelligence",
      "Data Science",
      "Cyber Security"
    ]
  },
  {
    id: "engineering",
    name: "School of Engineering",
    route: "/management/faculty/engineering",
    iconName: "⚙️",
    departments: [
      "Electronics and Communication Engineering",
      "Civil Engineering",
      "Basic Science & Humanities"
    ]
  },
  {
    id: "business",
    name: "School of Business & Management",
    route: "/management/faculty/business",
    iconName: "📊",
    departments: [
      "Business and Management"
    ]
  }
];

export const getDeptData = (deptName: string, source: Record<string, DirectoryData>): DirectoryData | null => {
  if (source[deptName]) return source[deptName];
  if (deptName === "Artificial Intelligence" && source["Artificial Intelligence & ML"]) return source["Artificial Intelligence & ML"];
  if (deptName === "Artificial Intelligence & ML" && source["Artificial Intelligence"]) return source["Artificial Intelligence"];
  if (deptName === "Electronics and Communication Engineering" && source["Electronics & Communication Engineering"]) return source["Electronics & Communication Engineering"];
  if (deptName === "Electronics & Communication Engineering" && source["Electronics and Communication Engineering"]) return source["Electronics and Communication Engineering"];
  if (deptName === "Business and Management" && source["School of Management"]) return source["School of Management"];
  if (deptName === "School of Management" && source["Business and Management"]) return source["Business and Management"];
  return null;
};

export function FacultyCMS({ notifySave }: FacultyCMSProps) {
  const { facultyData, updateFacultyData, boardData, updateBoardData } = useData();

  // Local state for editing
  const [facultyForm, setFacultyForm] = useState<Record<string, DirectoryData>>(facultyData);
  const [boardForm, setBoardForm] = useState<Record<string, DirectoryData>>(boardData);

  // Active view: "schools" (School-wise Esteemed Faculty) or "board" (Board of Governance)
  const [mainView, setMainView] = useState<"schools" | "board">("schools");

  // Selected School (computing | engineering | business)
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("computing");

  // Active department filter within the school ("all" or department name)
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Edit Modal State
  const [editingFaculty, setEditingFaculty] = useState<{
    member: FacultyMember;
    dept: string;
    isHod: boolean;
    index: number; // -1 if HOD
  } | null>(null);

  // Single Add Form State
  const [showSingleAddForm, setShowSingleAddForm] = useState<boolean>(false);
  const [newFaculty, setNewFaculty] = useState<Partial<FacultyMember> & { targetDept: string; isHod: boolean }>({
    name: "",
    title: "Assistant Professor",
    edu: "",
    interests: "",
    phone: "",
    email: "",
    avatar: "",
    experience: "",
    age: "",
    idNo: "",
    targetDept: SCHOOL_DEFINITIONS[0].departments[0],
    isHod: false
  });

  // Excel Bulk Upload State
  const [showExcelModal, setShowExcelModal] = useState<boolean>(false);
  const [excelRows, setExcelRows] = useState<Array<Partial<FacultyMember> & { isHod?: boolean; rawDept?: string }>>([]);
  const [excelTargetDept, setExcelTargetDept] = useState<string>(SCHOOL_DEFINITIONS[0].departments[0]);
  const [excelImportMode, setExcelImportMode] = useState<"append" | "replace">("append");
  const [excelFileName, setExcelFileName] = useState<string>("");
  const [excelError, setExcelError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active selected school object - strictly based on school definition
  const currentSchool = useMemo(() => {
    return SCHOOL_DEFINITIONS.find((s) => s.id === selectedSchoolId) || SCHOOL_DEFINITIONS[0];
  }, [selectedSchoolId]);

  // Sync state if context changes externally
  const handleSaveAll = () => {
    updateFacultyData(facultyForm);
    updateBoardData(boardForm);
    notifySave("All Faculty & School directories saved successfully!");
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Are you sure you want to reset all faculty and directories to default data?")) {
      setFacultyForm(INITIAL_FACULTY_DATA);
      updateFacultyData(INITIAL_FACULTY_DATA);
      setBoardForm(INITIAL_BOARD_DATA);
      updateBoardData(INITIAL_BOARD_DATA);
      notifySave("Directories reset to original defaults!");
    }
  };

  // Get all faculty for the active school & department filter
  const facultyListForCurrentSchool = useMemo(() => {
    const list: Array<{
      member: FacultyMember;
      dept: string;
      isHod: boolean;
      index: number;
    }> = [];

    const deptsToInclude = selectedDeptFilter === "all"
      ? currentSchool.departments
      : [selectedDeptFilter];

    deptsToInclude.forEach((dept) => {
      const data = getDeptData(dept, facultyForm);
      if (!data) return;

      if (data.hod && data.hod.name) {
        list.push({
          member: data.hod,
          dept,
          isHod: true,
          index: -1
        });
      }

      if (data.others && Array.isArray(data.others)) {
        data.others.forEach((mem, idx) => {
          list.push({
            member: mem,
            dept,
            isHod: false,
            index: idx
          });
        });
      }
    });

    // Apply search query
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.member.name.toLowerCase().includes(q) ||
        item.member.title.toLowerCase().includes(q) ||
        item.member.edu.toLowerCase().includes(q) ||
        item.dept.toLowerCase().includes(q) ||
        (item.member.interests && item.member.interests.toLowerCase().includes(q)) ||
        (item.member.email && item.member.email.toLowerCase().includes(q))
    );
  }, [facultyForm, currentSchool, selectedDeptFilter, searchQuery]);

  // Count total faculty in a school
  const countFacultyInSchool = (school: SchoolDefinition) => {
    let count = 0;
    school.departments.forEach((dept) => {
      const data = getDeptData(dept, facultyForm);
      if (data) {
        if (data.hod && data.hod.name) count += 1;
        if (data.others) count += data.others.length;
      }
    });
    return count;
  };

  // ════════════════════════════════════════════════════════════
  // ➕ SINGLE FACULTY ADDITION HANDLER
  // ════════════════════════════════════════════════════════════
  const handleAddSingleFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.name?.trim()) {
      alert("Please enter the Faculty Member's Name.");
      return;
    }

    const dept = newFaculty.targetDept || currentSchool.departments[0];
    const updated = { ...facultyForm };

    if (!updated[dept]) {
      updated[dept] = {
        hod: {
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
          department: dept
        },
        others: []
      };
    }

    // Auto-generate initials for avatar if empty
    const initials = newFaculty.name
      .split(" ")
      .filter((n) => !["Dr.", "Prof.", "Mr.", "Mrs.", "Smt.", "Sri"].includes(n))
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 3) || "FAC";

    const memberToAdd: FacultyMember = {
      name: newFaculty.name.trim(),
      title: newFaculty.title?.trim() || "Assistant Professor",
      edu: newFaculty.edu?.trim() || "M.Tech / Ph.D",
      interests: newFaculty.interests?.trim() || "",
      phone: newFaculty.phone?.trim() || "0863 2345400",
      email: newFaculty.email?.trim() || "",
      avatar: newFaculty.avatar?.trim() || initials,
      age: newFaculty.age?.trim() || "",
      experience: newFaculty.experience?.trim() || "5+ Years",
      idNo: newFaculty.idNo?.trim() || `CU-${dept.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`,
      department: dept
    };

    if (newFaculty.isHod) {
      if (updated[dept].hod && updated[dept].hod.name) {
        updated[dept].others = [updated[dept].hod, ...(updated[dept].others || [])];
      }
      updated[dept].hod = memberToAdd;
    } else {
      updated[dept].others = [...(updated[dept].others || []), memberToAdd];
    }

    setFacultyForm(updated);
    updateFacultyData(updated);
    notifySave(`Added ${memberToAdd.name} to ${dept}!`);

    // Reset form
    setNewFaculty({
      name: "",
      title: "Assistant Professor",
      edu: "",
      interests: "",
      phone: "",
      email: "",
      avatar: "",
      experience: "",
      age: "",
      idNo: "",
      targetDept: currentSchool.departments[0],
      isHod: false
    });
    setShowSingleAddForm(false);
  };

  // ════════════════════════════════════════════════════════════
  // 🗑️ DELETE FACULTY HANDLER
  // ════════════════════════════════════════════════════════════
  const handleDeleteFaculty = (dept: string, isHod: boolean, index: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from ${dept}?`)) {
      return;
    }

    const updated = { ...facultyForm };
    if (!updated[dept]) return;

    if (isHod) {
      if (updated[dept].others && updated[dept].others.length > 0) {
        const [first, ...rest] = updated[dept].others;
        updated[dept].hod = { ...first, title: `HOD & ${first.title}` };
        updated[dept].others = rest;
      } else {
        updated[dept].hod = {
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
          department: dept
        };
      }
    } else {
      updated[dept].others = updated[dept].others.filter((_, idx) => idx !== index);
    }

    setFacultyForm(updated);
    updateFacultyData(updated);
    notifySave(`Removed ${name} from ${dept}`);
  };

  // ════════════════════════════════════════════════════════════
  // ✏️ SAVE EDITED FACULTY HANDLER
  // ════════════════════════════════════════════════════════════
  const handleSaveEditedFaculty = () => {
    if (!editingFaculty) return;
    const { member, dept, isHod, index } = editingFaculty;

    const updated = { ...facultyForm };
    if (!updated[dept]) return;

    if (isHod) {
      updated[dept].hod = member;
    } else {
      updated[dept].others[index] = member;
    }

    setFacultyForm(updated);
    updateFacultyData(updated);
    notifySave(`Updated details for ${member.name}!`);
    setEditingFaculty(null);
  };

  // ════════════════════════════════════════════════════════════
  // 📥 EXCEL TEMPLATE DOWNLOAD HANDLER
  // ════════════════════════════════════════════════════════════
  const handleDownloadExcelTemplate = () => {
    const templateData = [
      {
        "Full Name": "Dr. Ramesh Kumar",
        "Designation / Title": "Professor",
        "Qualifications": "Ph.D - IIT Madras",
        "Department": currentSchool.departments[0] || "Computer Science & Engineering",
        "Specialization / Research": "Artificial Intelligence, Data Analytics",
        "Email": "ramesh.faculty@chalapathi.ac.in",
        "Phone": "0863 2345432",
        "Experience": "15 Years",
        "Avatar or Initials": "RK",
        "Is Head of Dept (Yes/No)": "No"
      },
      {
        "Full Name": "Mrs. Priya Sharma",
        "Designation / Title": "Assistant Professor",
        "Qualifications": "M.Tech - JNTU Kakinada",
        "Department": currentSchool.departments[0] || "Computer Science & Engineering",
        "Specialization / Research": "Cyber Security, Cloud Computing",
        "Email": "priya.faculty@chalapathi.ac.in",
        "Phone": "0863 2345433",
        "Experience": "8 Years",
        "Avatar or Initials": "PS",
        "Is Head of Dept (Yes/No)": "No"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Faculty_Template");

    // Auto-fit column widths
    const max_width = [25, 22, 25, 32, 35, 30, 15, 12, 18, 25];
    worksheet["!cols"] = max_width.map((w) => ({ wch: w }));

    XLSX.writeFile(workbook, `Chalapathi_Faculty_Import_Template_${currentSchool.id}.xlsx`);
    notifySave("Sample Excel template downloaded!");
  };

  // ════════════════════════════════════════════════════════════
  // 📤 EXCEL FILE PARSER & PREVIEW HANDLER
  // ════════════════════════════════════════════════════════════
  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcelError("");
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (!rawJson || rawJson.length === 0) {
          setExcelError("Uploaded spreadsheet is empty. Please check the file contents.");
          return;
        }

        // Normalize columns (smart match headers)
        const parsedRows: Array<Partial<FacultyMember> & { isHod?: boolean; rawDept?: string }> = rawJson.map((row) => {
          const findVal = (keys: string[]) => {
            for (const k of keys) {
              const matchingKey = Object.keys(row).find(
                (rk) => rk.toLowerCase().trim().replace(/[^a-z0-9]/g, "") === k.toLowerCase().replace(/[^a-z0-9]/g, "")
              );
              if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== "") {
                return String(row[matchingKey]).trim();
              }
            }
            return "";
          };

          const name = findVal(["FullName", "Name", "FacultyName", "ProfessorName", "TeacherName"]);
          const title = findVal(["DesignationTitle", "Designation", "Title", "Position", "Role"]) || "Assistant Professor";
          const edu = findVal(["Qualifications", "Qualification", "Edu", "Degree", "Education"]) || "Ph.D / M.Tech";
          const dept = findVal(["Department", "Dept", "Branch", "School"]);
          const interests = findVal(["SpecializationResearch", "Specialization", "Research", "Interests", "AreaOfExpertise"]);
          const email = findVal(["Email", "EmailID", "Mail", "EmailAddress"]);
          const phone = findVal(["Phone", "Mobile", "Contact", "PhoneNumber"]);
          const experience = findVal(["Experience", "Exp", "YearsOfExp"]) || "5+ Years";
          const avatar = findVal(["AvatarOrInitials", "Avatar", "Photo", "Initials", "Image"]);
          const isHodRaw = findVal(["IsHeadOfDeptYesNo", "IsHOD", "HOD", "Head", "IsHead"]).toLowerCase();
          const isHod = isHodRaw === "yes" || isHodRaw === "true" || isHodRaw === "1" || title.toLowerCase().includes("hod");

          return {
            name,
            title,
            edu,
            rawDept: dept,
            interests,
            email,
            phone,
            experience,
            avatar,
            isHod
          };
        }).filter((r) => r.name && r.name.trim().length > 0);

        if (parsedRows.length === 0) {
          setExcelError("Could not find valid faculty names in the uploaded sheet. Please use the sample template.");
          return;
        }

        setExcelRows(parsedRows);
      } catch (err: any) {
        setExcelError(`Error parsing spreadsheet: ${err.message || "Invalid Excel file format"}`);
      }
    };

    reader.readAsBinaryString(file);
  };

  // ════════════════════════════════════════════════════════════
  // 🚀 CONFIRM BULK EXCEL IMPORT
  // ════════════════════════════════════════════════════════════
  const handleConfirmExcelImport = () => {
    if (excelRows.length === 0) {
      alert("No valid rows to import.");
      return;
    }

    const updated = { ...facultyForm };

    excelRows.forEach((row) => {
      let targetDept = excelTargetDept;
      if (row.rawDept) {
        const matched = currentSchool.departments.find(
          (d) => d.toLowerCase().includes(row.rawDept!.toLowerCase()) || row.rawDept!.toLowerCase().includes(d.toLowerCase())
        );
        if (matched) targetDept = matched;
      }

      if (!updated[targetDept]) {
        updated[targetDept] = {
          hod: {
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
            department: targetDept
          },
          others: []
        };
      }

      const initials = (row.name || "FAC")
        .split(" ")
        .filter((n) => !["Dr.", "Prof.", "Mr.", "Mrs.", "Smt.", "Sri"].includes(n))
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 3) || "FAC";

      const member: FacultyMember = {
        name: row.name || "Faculty Member",
        title: row.title || "Assistant Professor",
        edu: row.edu || "M.Tech / Ph.D",
        interests: row.interests || "",
        phone: row.phone || "0863 2345400",
        email: row.email || "",
        avatar: row.avatar || initials,
        age: "",
        experience: row.experience || "5+ Years",
        idNo: `CU-${targetDept.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        department: targetDept
      };

      if (row.isHod) {
        if (updated[targetDept].hod && updated[targetDept].hod.name) {
          updated[targetDept].others = [updated[targetDept].hod, ...(updated[targetDept].others || [])];
        }
        updated[targetDept].hod = member;
      } else {
        updated[targetDept].others = [...(updated[targetDept].others || []), member];
      }
    });

    setFacultyForm(updated);
    updateFacultyData(updated);
    notifySave(`Successfully imported ${excelRows.length} faculty members into ${currentSchool.name}!`);

    setShowExcelModal(false);
    setExcelRows([]);
    setExcelFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ════════════════════════════════════════════════════════════
  // 📤 EXPORT CURRENT SCHOOL FACULTY TO EXCEL
  // ════════════════════════════════════════════════════════════
  const handleExportCurrentSchoolToExcel = () => {
    const exportData: any[] = [];

    currentSchool.departments.forEach((dept) => {
      const data = facultyForm[dept];
      if (!data) return;

      if (data.hod && data.hod.name) {
        exportData.push({
          "Full Name": data.hod.name,
          "Designation / Title": data.hod.title,
          "Qualifications": data.hod.edu,
          "Department": dept,
          "Specialization / Research": data.hod.interests,
          "Email": data.hod.email,
          "Phone": data.hod.phone,
          "Experience": data.hod.experience,
          "Avatar or Initials": data.hod.avatar,
          "Is Head of Dept (Yes/No)": "Yes"
        });
      }

      if (data.others) {
        data.others.forEach((mem) => {
          exportData.push({
            "Full Name": mem.name,
            "Designation / Title": mem.title,
            "Qualifications": mem.edu,
            "Department": dept,
            "Specialization / Research": mem.interests,
            "Email": mem.email,
            "Phone": mem.phone,
            "Experience": mem.experience,
            "Avatar or Initials": mem.avatar,
            "Is Head of Dept (Yes/No)": "No"
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, currentSchool.name.slice(0, 30));
    XLSX.writeFile(workbook, `Chalapathi_${currentSchool.id}_Faculty_Export.xlsx`);
    notifySave(`Exported ${exportData.length} faculty records to Excel!`);
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      {/* Header */}
      <SectionHeader
        title="Faculty & School Directories CMS"
        subtitle="Manage Esteemed Faculty across all 3 Schools, add single faculty, or bulk upload via Excel / CSV"
        icon={Users}
        onSave={handleSaveAll}
        saveSuccess={false}
        onReset={handleResetToDefaults}
        resetLabel="Reset All Directories"
      />

      {/* Main Mode Toggle: Esteemed Faculty (School-wise) vs Board of Governance */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-gray-200 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setMainView("schools")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mainView === "schools"
                ? "bg-[#072A6C] text-white shadow-xs"
                : "text-gray-600 hover:text-[#072A6C]"
            }`}
          >
            <GraduationCap size={15} />
            <span>School-wise Esteemed Faculty</span>
          </button>
          <button
            type="button"
            onClick={() => setMainView("board")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              mainView === "board"
                ? "bg-[#072A6C] text-white shadow-xs"
                : "text-gray-600 hover:text-[#072A6C]"
            }`}
          >
            <Shield size={15} />
            <span>Board of Governance & Leadership</span>
          </button>
        </div>

        {mainView === "schools" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCurrentSchoolToExcel}
              className="h-8 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export current school faculty to Excel spreadsheet"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export Excel</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowExcelModal(true);
                setExcelTargetDept(currentSchool.departments[0]);
              }}
              className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Bulk import faculty from Excel / CSV"
            >
              <FileSpreadsheet size={14} />
              <span>Bulk Excel Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSingleAddForm(!showSingleAddForm)}
              className="h-8 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus size={14} />
              <span>Add Single Faculty</span>
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 🏫 VIEW 1: SCHOOL-WISE ESTEEMED FACULTY                      */}
      {/* ════════════════════════════════════════════════════════════ */}
      {mainView === "schools" && (
        <div className="space-y-6">
          {/* 🌟 3 PRIMARY SCHOOL TABS (Computing, Engineering, Business) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SCHOOL_DEFINITIONS.map((school) => {
              const isSelected = selectedSchoolId === school.id;
              const count = countFacultyInSchool(school);
              return (
                <button
                  key={school.id}
                  type="button"
                  onClick={() => {
                    setSelectedSchoolId(school.id);
                    setSelectedDeptFilter("all");
                    setNewFaculty((prev) => ({
                      ...prev,
                      targetDept: school.departments[0]
                    }));
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[95px] ${
                    isSelected
                      ? "bg-gradient-to-br from-[#072A6C] to-[#0A388F] text-white border-[#072A6C] shadow-md ring-2 ring-[#D4AF37]/50"
                      : "bg-white text-slate-800 border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl">{school.iconName}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-[#D4AF37] text-slate-900"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {count} Faculty
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider ${isSelected ? "text-white" : "text-[#072A6C]"}`}>
                      {school.name}
                    </h4>
                    <p className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-blue-200" : "text-gray-500"}`}>
                      {school.departments.length} Dept{school.departments.length > 1 ? "s" : ""}: {school.departments.join(", ")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ➕ SINGLE FACULTY ADDITION FORM (COLLAPSIBLE / TOGGLE) */}
          {showSingleAddForm && (
            <form
              onSubmit={handleAddSingleFaculty}
              className="bg-white p-6 rounded-2xl border-2 border-blue-500/40 shadow-lg space-y-4 animate-fade-in"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2 text-[#072A6C]">
                  <Plus size={18} className="text-emerald-600" />
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    Add New Faculty Member to {currentSchool.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSingleAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. A. Kiran Kumar"
                    value={newFaculty.name || ""}
                    onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                    className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-[#072A6C] focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Designation / Title</label>
                  <select
                    value={newFaculty.title}
                    onChange={(e) => setNewFaculty({ ...newFaculty, title: e.target.value })}
                    className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-slate-700"
                  >
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Senior Lecturer">Senior Lecturer</option>
                    <option value="HOD & Professor">HOD & Professor</option>
                    <option value="Principal & Professor">Principal & Professor</option>
                    <option value="Research Scholar & Faculty">Research Scholar & Faculty</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Target Department</label>
                  <select
                    value={newFaculty.targetDept || currentSchool.departments[0]}
                    onChange={(e) => setNewFaculty({ ...newFaculty, targetDept: e.target.value })}
                    className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                  >
                    {currentSchool.departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Qualifications / Education</label>
                  <input
                    type="text"
                    placeholder="e.g. Ph.D - NIT Warangal, India"
                    value={newFaculty.edu || ""}
                    onChange={(e) => setNewFaculty({ ...newFaculty, edu: e.target.value })}
                    className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Specialization / Research</label>
                  <input
                    type="text"
                    placeholder="e.g. Cyber Security, Network Trust"
                    value={newFaculty.interests || ""}
                    onChange={(e) => setNewFaculty({ ...newFaculty, interests: e.target.value })}
                    className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Email ID</label>
                  <input
                    type="email"
                    placeholder="e.g. kiran.cse@city.ac.in"
                    value={newFaculty.email || ""}
                    onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })}
                    className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 0863 2345433"
                    value={newFaculty.phone || ""}
                    onChange={(e) => setNewFaculty({ ...newFaculty, phone: e.target.value })}
                    className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 16 Years"
                    value={newFaculty.experience || ""}
                    onChange={(e) => setNewFaculty({ ...newFaculty, experience: e.target.value })}
                    className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Avatar / Initials</label>
                  <input
                    type="text"
                    placeholder="e.g. AKK or Photo URL"
                    value={newFaculty.avatar || ""}
                    onChange={(e) => setNewFaculty({ ...newFaculty, avatar: e.target.value })}
                    className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newFaculty.isHod}
                    onChange={(e) => setNewFaculty({ ...newFaculty, isHod: e.target.checked })}
                    className="rounded text-[#072A6C] focus:ring-blue-500"
                  />
                  <span>Set as Head of Department (HOD / Principal)</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSingleAddForm(false)}
                    className="h-8.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-8.5 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus size={14} /> Add Faculty Member
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Department Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1">
                <Filter size={13} /> Filter Department:
              </span>
              <button
                type="button"
                onClick={() => setSelectedDeptFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedDeptFilter === "all"
                    ? "bg-[#072A6C] text-white shadow-2xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Departments ({countFacultyInSchool(currentSchool)})
              </button>
              {currentSchool.departments.map((dept) => {
                const dData = getDeptData(dept, facultyForm);
                const count = (dData?.hod?.name ? 1 : 0) + (dData?.others?.length || 0);
                return (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => setSelectedDeptFilter(dept)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedDeptFilter === dept
                        ? "bg-[#072A6C] text-white shadow-2xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {dept} ({count})
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  const newDeptName = prompt(`Enter new department name for ${currentSchool.name}:`);
                  if (newDeptName && newDeptName.trim()) {
                    const nameTrimmed = newDeptName.trim();
                    const updated = { ...facultyForm };
                    if (!updated[nameTrimmed]) {
                      updated[nameTrimmed] = {
                        hod: {
                          name: "",
                          title: "HOD & Professor",
                          edu: "",
                          interests: "",
                          phone: "0863 2345400",
                          email: "",
                          avatar: "",
                          age: "",
                          experience: "10+ Years",
                          idNo: `CU-${nameTrimmed.slice(0, 3).toUpperCase()}-001`,
                          department: nameTrimmed
                        },
                        others: []
                      };
                      setFacultyForm(updated);
                      updateFacultyData(updated);
                    }
                    setSelectedDeptFilter(nameTrimmed);
                    setNewFaculty((prev) => ({ ...prev, targetDept: nameTrimmed }));
                    notifySave(`Added ${nameTrimmed} to ${currentSchool.name}!`);
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-[#072A6C] border border-blue-200 hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-colors"
                title={`Add a new department under ${currentSchool.name}`}
              >
                <Plus size={12} /> Add Department
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search faculty by name, role, edu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8.5 pl-8 pr-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-slate-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 📋 FACULTY CARDS LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-black text-[#072A6C] uppercase tracking-wider">
                {currentSchool.name} Faculty Members ({facultyListForCurrentSchool.length})
              </h3>
              <span className="text-[11px] text-gray-500">
                Displaying on <span className="font-mono font-bold text-blue-800">{currentSchool.route}</span>
              </span>
            </div>

            {facultyListForCurrentSchool.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center space-y-3">
                <Users size={36} className="mx-auto text-gray-400" />
                <h4 className="text-sm font-bold text-gray-700">No faculty members found</h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  {searchQuery
                    ? `No faculty matched "${searchQuery}". Try clearing search.`
                    : `No faculty added yet for this filter. Use "Add Single Faculty" or "Bulk Excel Upload" above.`}
                </p>
                <button
                  type="button"
                  onClick={() => setShowSingleAddForm(true)}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-[#072A6C] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  <Plus size={13} /> Add Faculty Member
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facultyListForCurrentSchool.map(({ member, dept, isHod, index }, fIdx) => {
                  const isInitials = member.avatar && member.avatar.length <= 4 && !member.avatar.includes("/") && !member.avatar.includes(".");
                  return (
                    <div
                      key={`${dept}-${index}-${member.name}-${fIdx}`}
                      className={`bg-white rounded-2xl border p-4 shadow-xs transition-all relative flex flex-col justify-between ${
                        isHod
                          ? "border-amber-400/80 bg-gradient-to-b from-amber-50/20 to-white ring-1 ring-amber-300/40"
                          : "border-gray-200/90 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-3">
                        <span
                          className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isHod
                              ? "bg-amber-500 text-slate-900 font-extrabold"
                              : "bg-blue-50 text-blue-800 border border-blue-100"
                          }`}
                        >
                          {isHod ? "👑 Head of Dept (HOD)" : "Faculty"}
                        </span>
                        <span className="text-[10px] text-gray-500 font-medium truncate max-w-[150px]" title={dept}>
                          {dept}
                        </span>
                      </div>

                      {/* Main Faculty Info Row */}
                      <div className="flex items-start gap-3.5 mb-3">
                        {/* Avatar */}
                        <div className="w-16 h-18 shrink-0 rounded-xl overflow-hidden bg-[#072A6C] border border-gray-200 shadow-inner flex items-center justify-center">
                          {isInitials ? (
                            <span className="text-sm font-black text-[#D4AF37] tracking-wider">
                              {member.avatar}
                            </span>
                          ) : member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=072A6C&color=fff`;
                              }}
                            />
                          ) : (
                            <span className="text-xs font-black text-white">
                              {member.name.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-[#072A6C] uppercase leading-snug truncate" title={member.name}>
                            {member.name}
                          </h4>
                          <p className="text-[11px] font-bold text-red-700 uppercase tracking-wide mt-0.5 truncate">
                            {member.title}
                          </p>
                          <p className="text-[10.5px] text-slate-600 font-medium truncate mt-0.5" title={member.edu}>
                            {member.edu || "Ph.D"}
                          </p>
                          {member.interests && (
                            <p className="text-[10px] text-gray-500 truncate mt-1 italic" title={member.interests}>
                              🔬 {member.interests}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Contact & Experience Footer */}
                      <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-600 space-y-1 mb-3">
                        {member.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail size={11} className="text-gray-400 shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Phone size={11} className="text-gray-400 shrink-0" />
                            <span className="truncate">{member.phone}</span>
                          </div>
                        )}
                        {member.experience && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Briefcase size={11} className="text-gray-400 shrink-0" />
                            <span>{member.experience}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setEditingFaculty({ member: { ...member }, dept, isHod, index })}
                          className="h-7 px-2.5 bg-blue-50 hover:bg-blue-100 text-[#072A6C] text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit3 size={11} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaculty(dept, isHod, index, member.name)}
                          className="h-7 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 🏛️ VIEW 2: BOARD OF GOVERNANCE & LEADERSHIP                 */}
      {/* ════════════════════════════════════════════════════════════ */}
      {mainView === "board" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase">
                Board of Governance, Chancellor, VC & Deans
              </h3>
              <p className="text-xs text-gray-500">
                Administrative leadership displayed on Governance & Management directories
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newRole = prompt("Enter designation / role name (e.g. Dean of Alumni Affairs):");
                if (newRole && newRole.trim()) {
                  const updated = { ...boardForm };
                  updated[newRole.trim()] = {
                    hod: {
                      name: "Officer Name",
                      title: newRole.trim(),
                      edu: "Ph.D",
                      interests: "Institutional Administration",
                      phone: "0863 2345400",
                      email: "admin@city.ac.in",
                      avatar: "OFF",
                      age: "",
                      experience: "15 Years",
                      idNo: `CUB-${Date.now().toString().slice(-3)}`,
                      department: newRole.trim()
                    },
                    others: []
                  };
                  setBoardForm(updated);
                  updateBoardData(updated);
                  notifySave(`Added ${newRole.trim()} role to Governance!`);
                }
              }}
              className="h-8 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} /> Add Leadership Role
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(boardForm).map((roleKey) => {
              const roleData = boardForm[roleKey];
              if (!roleData || !roleData.hod) return null;
              const leader = roleData.hod;

              return (
                <div key={roleKey} className="p-4 rounded-xl border border-gray-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase text-[#072A6C]">{roleKey}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remove ${roleKey}?`)) {
                          const updated = { ...boardForm };
                          delete updated[roleKey];
                          setBoardForm(updated);
                          updateBoardData(updated);
                          notifySave(`Removed ${roleKey}`);
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="text-[9.5px] font-bold text-gray-500 uppercase">Officer Name</label>
                      <input
                        type="text"
                        value={leader.name}
                        onChange={(e) => {
                          const updated = { ...boardForm };
                          updated[roleKey].hod.name = e.target.value;
                          setBoardForm(updated);
                        }}
                        className="w-full h-7.5 px-2 text-xs bg-white border border-gray-200 rounded font-bold"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9.5px] font-bold text-gray-500 uppercase">Title / Designation</label>
                      <input
                        type="text"
                        value={leader.title}
                        onChange={(e) => {
                          const updated = { ...boardForm };
                          updated[roleKey].hod.title = e.target.value;
                          setBoardForm(updated);
                        }}
                        className="w-full h-7.5 px-2 text-xs bg-white border border-gray-200 rounded font-medium"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9.5px] font-bold text-gray-500 uppercase">Qualifications</label>
                      <input
                        type="text"
                        value={leader.edu}
                        onChange={(e) => {
                          const updated = { ...boardForm };
                          updated[roleKey].hod.edu = e.target.value;
                          setBoardForm(updated);
                        }}
                        className="w-full h-7.5 px-2 text-xs bg-white border border-gray-200 rounded text-gray-700"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[9.5px] font-bold text-gray-500 uppercase">Avatar / Initials</label>
                      <input
                        type="text"
                        value={leader.avatar}
                        onChange={(e) => {
                          const updated = { ...boardForm };
                          updated[roleKey].hod.avatar = e.target.value;
                          setBoardForm(updated);
                        }}
                        className="w-full h-7.5 px-2 text-xs bg-white border border-gray-200 rounded font-mono"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ✏️ EDIT FACULTY MODAL                                        */}
      {/* ════════════════════════════════════════════════════════════ */}
      {editingFaculty && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#072A6C]">
                <Edit3 size={18} />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  Edit Faculty: {editingFaculty.member.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingFaculty(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Full Name</label>
                <input
                  type="text"
                  value={editingFaculty.member.name}
                  onChange={(e) =>
                    setEditingFaculty({
                      ...editingFaculty,
                      member: { ...editingFaculty.member, name: e.target.value }
                    })
                  }
                  className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Designation / Title</label>
                <input
                  type="text"
                  value={editingFaculty.member.title}
                  onChange={(e) =>
                    setEditingFaculty({
                      ...editingFaculty,
                      member: { ...editingFaculty.member, title: e.target.value }
                    })
                  }
                  className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg font-medium"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Qualifications / Education</label>
                <input
                  type="text"
                  value={editingFaculty.member.edu}
                  onChange={(e) =>
                    setEditingFaculty({
                      ...editingFaculty,
                      member: { ...editingFaculty.member, edu: e.target.value }
                    })
                  }
                  className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Specialization / Research Area</label>
                <input
                  type="text"
                  value={editingFaculty.member.interests || ""}
                  onChange={(e) =>
                    setEditingFaculty({
                      ...editingFaculty,
                      member: { ...editingFaculty.member, interests: e.target.value }
                    })
                  }
                  className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Email ID</label>
                <input
                  type="email"
                  value={editingFaculty.member.email || ""}
                  onChange={(e) =>
                    setEditingFaculty({
                      ...editingFaculty,
                      member: { ...editingFaculty.member, email: e.target.value }
                    })
                  }
                  className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Phone</label>
                <input
                  type="text"
                  value={editingFaculty.member.phone || ""}
                  onChange={(e) =>
                    setEditingFaculty({
                      ...editingFaculty,
                      member: { ...editingFaculty.member, phone: e.target.value }
                    })
                  }
                  className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Experience</label>
                <input
                  type="text"
                  value={editingFaculty.member.experience || ""}
                  onChange={(e) =>
                    setEditingFaculty({
                      ...editingFaculty,
                      member: { ...editingFaculty.member, experience: e.target.value }
                    })
                  }
                  className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Avatar / Initials</label>
                <input
                  type="text"
                  value={editingFaculty.member.avatar || ""}
                  onChange={(e) =>
                    setEditingFaculty({
                      ...editingFaculty,
                      member: { ...editingFaculty.member, avatar: e.target.value }
                    })
                  }
                  className="w-full h-8.5 px-3 text-xs bg-slate-50 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingFaculty(null)}
                className="h-8.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedFaculty}
                className="h-8.5 px-4 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Save size={13} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 📊 EXCEL / CSV BULK IMPORT MODAL                             */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showExcelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#072A6C]">
                <FileSpreadsheet size={20} className="text-emerald-600" />
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    Bulk Faculty Import ({currentSchool.name})
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Upload an Excel (.xlsx, .xls) or CSV file with faculty data for bulk addition
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowExcelModal(false);
                  setExcelRows([]);
                  setExcelError("");
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Template Download Banner */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet size={16} className="text-[#072A6C]" />
                <span className="text-xs font-bold text-[#072A6C]">
                  Need the Excel format? Download our pre-formatted template:
                </span>
              </div>
              <button
                type="button"
                onClick={handleDownloadExcelTemplate}
                className="h-7.5 px-3 bg-[#072A6C] hover:bg-[#051c4a] text-white text-[11px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download size={12} /> Download Sample Excel Template
              </button>
            </div>

            {/* Target Department Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-gray-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Default Target Department</label>
                <select
                  value={excelTargetDept}
                  onChange={(e) => setExcelTargetDept(e.target.value)}
                  className="w-full h-8.5 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                >
                  {currentSchool.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <span className="text-[9.5px] text-gray-500">
                  Rows without a specified department will be added here
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600 uppercase">Import Mode</label>
                <select
                  value={excelImportMode}
                  onChange={(e) => setExcelImportMode(e.target.value as any)}
                  className="w-full h-8.5 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-slate-800"
                >
                  <option value="append">Append (Add to existing faculty)</option>
                  <option value="replace">Replace (Overwrite current faculty in school)</option>
                </select>
                <span className="text-[9.5px] text-gray-500">
                  Append adds new records safely; Replace overwrites previous data
                </span>
              </div>
            </div>

            {/* File Upload Zone */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Select or Drop Excel / CSV File</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-xl p-6 text-center cursor-pointer transition-all space-y-2 bg-slate-50/50"
              >
                <UploadCloud size={28} className="mx-auto text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {excelFileName ? (
                      <span className="text-emerald-700 font-bold">Selected: {excelFileName}</span>
                    ) : (
                      "Click to choose file or drag & drop here"
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400">Supports .xlsx, .xls, and .csv files</p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleExcelFileUpload}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />
              </div>
            </div>

            {/* Error banner */}
            {excelError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0 text-red-600" />
                <span>{excelError}</span>
              </div>
            )}

            {/* Preview of Parsed Rows */}
            {excelRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-[#072A6C]">
                    Preview Parsed Faculty ({excelRows.length} Rows Ready)
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Validation Passed
                  </span>
                </div>

                <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-white">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-gray-600 uppercase font-bold sticky top-0 border-b border-gray-200">
                      <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">Qualifications</th>
                        <th className="p-2">Department</th>
                        <th className="p-2">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {excelRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-mono text-gray-400">{idx + 1}</td>
                          <td className="p-2 font-bold text-[#072A6C]">{row.name}</td>
                          <td className="p-2 text-red-700">{row.title}</td>
                          <td className="p-2 text-gray-600 truncate max-w-[140px]">{row.edu}</td>
                          <td className="p-2 text-gray-500">{row.rawDept || excelTargetDept}</td>
                          <td className="p-2">
                            {row.isHod ? (
                              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[9.5px] font-bold">
                                HOD
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px]">Faculty</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setShowExcelModal(false);
                  setExcelRows([]);
                  setExcelError("");
                }}
                className="h-8.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={excelRows.length === 0}
                onClick={handleConfirmExcelImport}
                className={`h-8.5 px-5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs ${
                  excelRows.length > 0
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Check size={14} /> Confirm & Import {excelRows.length > 0 ? `(${excelRows.length})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
