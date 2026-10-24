import React, { useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { Download, Plus, Trash2, UploadCloud } from "lucide-react";
import type { DirectoryData, FacultyDisplayFields, FacultyMember } from "../../context/DataContext";
import { facultyFieldOptions } from "../../utils/facultyFields";

interface ProgramFacultyCMSProps {
  department: string;
  facultyData: Record<string, DirectoryData>;
  updateFacultyData: (data: Record<string, DirectoryData>) => void;
}

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export function ProgramFacultyCMS({ department, facultyData, updateFacultyData }: ProgramFacultyCMSProps) {
  const uploadRef = useRef<HTMLInputElement>(null);
  const departmentKey = useMemo(() => {
    const target = normalize(department);
    return Object.keys(facultyData).find(key => normalize(key) === target)
      || Object.keys(facultyData).find(key => normalize(key).includes(target) || target.includes(normalize(key)))
      || department;
  }, [department, facultyData]);
  const directory = facultyData[departmentKey];
  const members = useMemo(() => [directory?.hod, ...(directory?.others || [])]
    .filter((member): member is FacultyMember => Boolean(member?.name?.trim())), [directory]);
  const fieldOptions = facultyFieldOptions(members);
  const displayFields: FacultyDisplayFields = directory?.displayFields || {
    card: ["title", "edu", "interests"], profile: fieldOptions.map(field => field.key)
  };

  const saveMembers = (next: FacultyMember[], fields = displayFields) => {
    const current = facultyData[departmentKey];
    const empty: FacultyMember = {
      name: "", title: "", edu: "", interests: "", phone: "", email: "", avatar: "", age: "", experience: "", idNo: "", department: departmentKey
    };
    updateFacultyData({
      ...facultyData,
      [departmentKey]: {
        ...(current || { hod: empty, others: [] }),
        hod: next[0] || empty,
        others: next.slice(1),
        displayFields: fields
      }
    });
  };

  const patchMember = (index: number, patch: Partial<FacultyMember>) => {
    const next = members.map((member, i) => i === index ? { ...member, ...patch } : member);
    saveMembers(next);
  };

  const importExcel = async (file?: File) => {
    if (!file) return;
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames.find(name => /faculty details|faculty/i.test(name)) || workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
      const text = (row: Record<string, unknown>, patterns: RegExp[]) => {
        const key = Object.keys(row).find(header => patterns.some(pattern => pattern.test(header.trim())));
        return key ? String(row[key] ?? "").trim() : "";
      };
      const imported = rows.map((row, index): FacultyMember | null => {
        const name = text(row, [/^faculty\s*name$/i, /^full\s*name$/i, /^name$/i, /professor\s*name/i]);
        if (!name) return null;
        const title = text(row, [/designation/i, /^title$/i]) || "Faculty";
        const edu = text(row, [/qualification/i, /education/i, /^edu$/i]);
        const departmentValue = text(row, [/^department$/i, /^branch$/i]) || departmentKey;
        const subjects = Object.keys(row).filter(key => /subject\s*teaching/i.test(key)).sort().map(key => String(row[key] ?? "").trim()).filter(Boolean);
        const publications = Object.fromEntries(Object.entries(row).filter(([key, value]) => /publication/i.test(key) && String(value ?? "").trim()).map(([key, value]) => [key, String(value).trim()]));
        const additionalDetails = Object.fromEntries(Object.entries(row).filter(([key, value]) => String(value ?? "").trim() && !/name|designation|title|qualification|education|subject\s*teaching|publication|department|branch|email|phone|experience|avatar|photo|image|research|duties|conference|age|id\s*no/i.test(key)).map(([key, value]) => [key, String(value).trim()]));
        const initials = name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
        return {
          name, title, edu,
          interests: text(row, [/area.*research/i, /specialization/i, /^interests$/i]),
          phone: text(row, [/phone/i, /mobile/i]), email: text(row, [/email/i]),
          avatar: text(row, [/avatar/i, /photo/i, /image/i]) || initials,
          age: text(row, [/^age$/i]), experience: text(row, [/experience/i]),
          idNo: text(row, [/id\s*no/i, /employee\s*id/i]) || `CU-${index + 1}`,
          department: departmentValue, teachingSubjects: subjects,
          administrativeDuties: text(row, [/administrative\s*duties/i]),
          publications, conferencesAttended: text(row, [/conferences?.*attended/i]),
          conferencesOrganized: text(row, [/conferences?.*organized/i]), additionalDetails
        };
      }).filter((member): member is FacultyMember => member !== null);
      if (!imported.length) throw new Error("No faculty names were found. Include a Faculty Name or Name column.");
      saveMembers(imported, { card: displayFields.card, profile: facultyFieldOptions(imported).map(field => field.key) });
      window.alert(`${imported.length} faculty members imported for ${departmentKey}.`);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "The spreadsheet could not be read.");
    } finally {
      if (uploadRef.current) uploadRef.current.value = "";
    }
  };

  const exportExcel = () => {
    const rows = members.map(member => ({
      "Faculty Name": member.name, Designation: member.title, Qualification: member.edu,
      "Areas of Research": member.interests, Email: member.email, Phone: member.phone,
      Department: member.department, Experience: member.experience, Age: member.age,
      "ID No": member.idNo, Avatar: member.avatar,
      "Subject Teaching 1": member.teachingSubjects?.[0] || "",
      "Subject Teaching 2": member.teachingSubjects?.[1] || "",
      "Subject Teaching 3": member.teachingSubjects?.[2] || "",
      "Administrative Duties": member.administrativeDuties || "",
      "Conferences Attended": member.conferencesAttended || "",
      "Conferences Organized": member.conferencesOrganized || "",
      ...Object.fromEntries(Object.entries(member.publications || {})),
      ...Object.fromEntries(Object.entries(member.additionalDetails || {}))
    }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(rows), "Faculty Details");
    XLSX.writeFile(workbook, `${departmentKey.replace(/[^a-z0-9]+/gi, "_")}_Faculty.xlsx`);
  };

  const toggleField = (group: "card" | "profile", key: string) => {
    const current = displayFields[group] || [];
    const updated = current.includes(key) ? current.filter(item => item !== key) : [...current, key];
    saveMembers(members, { ...displayFields, [group]: updated });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div>
          <h4 className="text-sm font-black text-[#072A6C] uppercase">{departmentKey} Faculty Directory ({members.length} Members)</h4>
          <p className="text-xs text-gray-500">This directory is shared with the matching public faculty and program pages.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={exportExcel} className="h-8 px-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1"><Download size={13}/> Download Excel</button>
          <button type="button" onClick={() => uploadRef.current?.click()} className="h-8 px-3 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1"><UploadCloud size={13}/> Bulk Excel Upload</button>
          <input ref={uploadRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={event => void importExcel(event.target.files?.[0])}/>
          <button type="button" onClick={() => saveMembers([{ name: "", title: "", edu: "", interests: "", phone: "", email: "", avatar: "", age: "", experience: "", idNo: `CU-${Date.now()}`, department: departmentKey }, ...members])} className="h-8 px-3 bg-[#072A6C] text-white text-xs font-bold rounded-lg flex items-center gap-1"><Plus size={13}/> Add Faculty Member</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {members.map((member, index) => <div key={`${member.idNo}-${index}`} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex gap-2">
            <input aria-label="Faculty name" value={member.name} onChange={event => patchMember(index, { name: event.target.value })} placeholder="Faculty name" className="flex-1 px-2 py-1 text-xs font-bold bg-white border rounded"/>
            <button type="button" aria-label={`Remove ${member.name || "faculty"}`} onClick={() => { if (window.confirm(`Remove ${member.name || "this faculty member"}?`)) saveMembers(members.filter((_, i) => i !== index)); }} className="p-2 text-red-600"><Trash2 size={14}/></button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {([ ["title", "Designation"], ["edu", "Qualification"], ["interests", "Areas of Research"], ["email", "Email"], ["phone", "Phone"], ["experience", "Experience"] ] as const).map(([key, label]) => <input key={key} aria-label={label} value={member[key] || ""} onChange={event => patchMember(index, { [key]: event.target.value })} placeholder={label} className="px-2 py-1 text-xs bg-white border rounded"/>)}
          </div>
          <textarea aria-label="Teaching subjects" value={(member.teachingSubjects || []).join("\n")} onChange={event => patchMember(index, { teachingSubjects: event.target.value.split("\n").filter(Boolean) })} placeholder="Teaching subjects (one per line)" rows={2} className="w-full px-2 py-1 text-xs bg-white border rounded"/>
          <textarea aria-label="Administrative duties" value={member.administrativeDuties || ""} onChange={event => patchMember(index, { administrativeDuties: event.target.value })} placeholder="Administrative duties" rows={2} className="w-full px-2 py-1 text-xs bg-white border rounded"/>
        </div>)}
      </div>
      <div className="rounded-xl border border-slate-200 p-4 space-y-3">
        <h5 className="text-xs font-black text-[#072A6C]">Public Faculty Display Customization</h5>
        {[{ key: "card" as const, label: "Faculty card fields" }, { key: "profile" as const, label: "Full profile fields" }].map(group => <div key={group.key}>
          <p className="mb-2 text-xs font-bold text-slate-600">{group.label}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">{fieldOptions.map(field => <label key={`${group.key}-${field.key}`} className="flex items-center gap-1.5 text-xs text-slate-700"><input type="checkbox" checked={(displayFields[group.key] || []).includes(field.key)} onChange={() => toggleField(group.key, field.key)}/>{field.label}</label>)}</div>
        </div>)}
      </div>
    </div>
  );
}
