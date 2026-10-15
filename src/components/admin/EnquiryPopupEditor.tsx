import React from "react";
import { EditableEnquiryConfig } from "../../data/enquiryPopup";
import { ImageField } from "./AdminComponents";

type Props = { value: EditableEnquiryConfig; onChange: (value: EditableEnquiryConfig) => void; buttonText: string; onButtonTextChange: (text: string) => void; defaultLogo?: string };
const textFields: [keyof EditableEnquiryConfig, string][] = [
  ["tabLabel", "Floating enquiry tab label"], ["tabBgColor", "Floating tab background color"], ["tabTextColor", "Floating tab text color"],
  ["leftPanelTitle", "Schools panel heading"], ["leftPanelSubtitle", "Schools panel description"],
  ["formBadgeTitle", "Form badge heading"], ["formBadgeDesc", "Form introduction"],
  ["mobileFormLabel", "Mobile form tab label"], ["mobileSchoolsLabel", "Mobile schools tab label"], ["programsButtonLabel", "Mobile programs button label"],
  ["privacyText", "Privacy message"], ["privacyLinkLabel", "Privacy link text"], ["privacyUrl", "Privacy link URL"],
  ["successTitle", "Submission success heading"], ["successDesc", "Submission success message"]
];
const inputStyle = "w-full p-2 text-xs bg-white border border-gray-200 rounded-lg text-gray-800";
export function EnquiryPopupEditor({ value, onChange, buttonText, onButtonTextChange, defaultLogo }: Props) {
  const updateSchools = (index: number, patch: any) => onChange({ ...value, schools: value.schools.map((school, i) => i === index ? { ...school, ...patch } : school) });
  const field = (label: string, current: string, change: (text: string) => void) => <label className="block space-y-1 text-xs font-bold text-gray-600">{label}<input className={inputStyle} value={current} onChange={event => change(event.target.value)} /></label>;
  return <div className="space-y-5 border-t pt-4">
    <h4 className="font-bold text-blue-900">Complete enquiry form editor</h4>
    <p className="text-xs text-gray-500">All settings below belong to this popup and publish together when you click Update Popup.</p>
    <ImageField label="Popup university logo" value={value.logoUrl ?? defaultLogo ?? ""} defaultValue={defaultLogo || ""} onChange={logoUrl => onChange({ ...value, logoUrl })} onReset={() => onChange({ ...value, logoUrl: defaultLogo })} />
    <div className="grid sm:grid-cols-2 gap-3">
      {textFields.map(([key, label]) => <React.Fragment key={key}>{field(label, String(value[key] ?? ""), text => onChange({ ...value, [key]: text }))}</React.Fragment>)}
      {field("Submit button label", buttonText, onButtonTextChange)}
    </div>
    <details open className="border rounded-xl p-3 space-y-3"><summary className="font-bold text-blue-900 cursor-pointer">Form fields, labels and dropdown choices</summary>
      {Object.entries(value.fields).map(([key, settings]) => <div key={key} className="p-3 bg-slate-50 rounded-lg space-y-2">
        <div className="flex gap-4 items-center text-xs"><strong>{key}</strong>
          <label><input type="checkbox" checked={settings.visible} onChange={e => onChange({ ...value, fields: { ...value.fields, [key]: { ...settings, visible: e.target.checked } } })} /> Visible</label>
          <label><input type="checkbox" checked={settings.required} onChange={e => onChange({ ...value, fields: { ...value.fields, [key]: { ...settings, required: e.target.checked } } })} /> Required</label>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {field("Field label", settings.label, label => onChange({ ...value, fields: { ...value.fields, [key]: { ...settings, label } } }))}
          {field("Placeholder", settings.placeholder, placeholder => onChange({ ...value, fields: { ...value.fields, [key]: { ...settings, placeholder } } }))}
        </div>
        {(settings.options || key === "program") && <label className="block text-xs font-bold text-gray-600">Choices (one per line)<textarea rows={5} className={inputStyle} value={(key === "program" ? value.allPrograms : settings.options || []).join("\n")} onChange={e => {
          const options = e.target.value.split("\n");
          onChange(key === "program" ? { ...value, allPrograms: options } : { ...value, fields: { ...value.fields, [key]: { ...settings, options } } });
        }} /></label>}
      </div>)}
    </details>
    <details open className="border rounded-xl p-3 space-y-3"><summary className="font-bold text-blue-900 cursor-pointer">Schools, branches and courses</summary>
      {value.schools.map((school, index) => <div key={school.id} className="bg-slate-50 p-3 rounded-lg space-y-3">
        {field("School title", school.title, title => updateSchools(index, { title }))}
        {field("School subtitle", school.subtitle, subtitle => updateSchools(index, { subtitle }))}
        <label className="block text-xs font-bold">School icon<select className={inputStyle} value={school.icon || "GraduationCap"} onChange={e => updateSchools(index, { icon: e.target.value })}>{["GraduationCap", "Calendar", "FileText", "Award", "BookOpen", "User"].map(icon => <option key={icon}>{icon}</option>)}</select></label>
        {school.groups.map((group, groupIndex) => <div key={groupIndex} className="p-3 bg-white border rounded-lg space-y-2">
          {field("Branch / group title", group.name, name => updateSchools(index, { groups: school.groups.map((g, gi) => gi === groupIndex ? { ...g, name } : g) }))}
          {group.courses.map((course, courseIndex) => <div key={courseIndex} className="flex gap-2">
            <input aria-label="Course level" className={`${inputStyle} max-w-20`} value={course.level} onChange={e => updateSchools(index, { groups: school.groups.map((g, gi) => gi === groupIndex ? { ...g, courses: g.courses.map((c, ci) => ci === courseIndex ? { ...c, level: e.target.value } : c) } : g) })} />
            <input aria-label="Course name" className={inputStyle} value={course.name} onChange={e => updateSchools(index, { groups: school.groups.map((g, gi) => gi === groupIndex ? { ...g, courses: g.courses.map((c, ci) => ci === courseIndex ? { ...c, name: e.target.value } : c) } : g) })} />
            <button type="button" className="text-red-600 text-xs" onClick={() => updateSchools(index, { groups: school.groups.map((g, gi) => gi === groupIndex ? { ...g, courses: g.courses.filter((_, ci) => ci !== courseIndex) } : g) })}>Remove</button>
          </div>)}
          <div className="flex gap-4 text-xs"><button type="button" className="text-blue-700" onClick={() => updateSchools(index, { groups: school.groups.map((g, gi) => gi === groupIndex ? { ...g, courses: [...g.courses, { level: "UG", name: "" }] } : g) })}>+ Add course</button>
          <button type="button" className="text-red-600" onClick={() => updateSchools(index, { groups: school.groups.filter((_, gi) => gi !== groupIndex) })}>Remove branch</button></div>
        </div>)}
        <div className="flex gap-4 text-xs"><button type="button" className="text-blue-700" onClick={() => updateSchools(index, { groups: [...school.groups, { name: "", courses: [] }] })}>+ Add branch</button>
        <button type="button" className="text-red-600" onClick={() => onChange({ ...value, schools: value.schools.filter((_, si) => si !== index) })}>Remove school</button></div>
      </div>)}
      <button type="button" className="block text-blue-700 text-xs font-bold" onClick={() => onChange({ ...value, allPrograms: Array.from(new Set(value.schools.flatMap(s => s.groups.flatMap(g => g.courses.map(c => c.name))).filter(name => name.trim()))) })}>Use these courses in the program dropdown</button>
      <button type="button" className="text-blue-700 text-xs font-bold" onClick={() => onChange({ ...value, schools: [...value.schools, { id: `school-${Date.now()}`, title: "", subtitle: "", icon: "GraduationCap", groups: [] }] })}>+ Add school</button>
    </details>
  </div>;
}
