import React from "react";
import { Mail, Phone, X } from "lucide-react";
import type { FacultyMember } from "../../context/DataContext";
import { facultyProfileFields } from "../../utils/facultyFields";

interface FacultyProfileModalProps {
  member: FacultyMember;
  selectedFields?: string[];
  onClose: () => void;
}

export function FacultyProfileModal({ member, selectedFields, onClose }: FacultyProfileModalProps) {
  const fields = facultyProfileFields(member, selectedFields);
  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="faculty-profile-title" className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <header className="flex items-start gap-4 p-5 sm:p-7 bg-[#072A6C] text-white">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wider text-amber-300 font-bold">{member.department || "Faculty Profile"}</p>
            <h2 id="faculty-profile-title" className="text-xl sm:text-2xl font-black mt-1">{member.name}</h2>
            <p className="text-sm text-blue-100 mt-1">{member.title}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close faculty profile" className="p-2 rounded-lg hover:bg-white/10"><X size={20} /></button>
        </header>
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {fields.length > 0 && <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map(field => <div key={field.key} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <dt className="text-[11px] uppercase tracking-wide font-bold text-slate-500">{field.label}</dt>
              <dd className="text-sm text-slate-800 mt-1 whitespace-pre-wrap break-words">{field.value}</dd>
            </div>)}
          </dl>}
          {(selectedFields === undefined || selectedFields.includes("publicationDetails")) && Boolean(member.publicationDetails?.length) && <section>
            <h3 className="font-bold text-[#072A6C] mb-3">Publications ({member.publicationDetails!.length})</h3>
            <div className="space-y-3">
              {member.publicationDetails!.map((publication, index) => <article key={`${publication.Title || publication["Title of Publication"] || index}-${index}`} className="rounded-xl border border-slate-200 p-4">
                <p className="font-semibold text-sm text-slate-800">{publication["Title of Publication"] || publication["Title of Publication ((Journal / Conference / Book Chapter / Book / Patent)"] || publication.Title || "Publication record"}</p>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3">
                  {Object.entries(publication).filter(([key, value]) => key !== "Faculty Name" && key !== "Title of Publication" && value).map(([key, value]) => <div key={key} className="text-xs"><dt className="font-semibold text-slate-500">{key}</dt><dd className="text-slate-700 break-words">{value}</dd></div>)}
                </dl>
              </article>)}
            </div>
          </section>}
          {(member.email || member.phone) && <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-sm">
            {member.email && <a href={`mailto:${member.email}`} className="inline-flex items-center gap-2 text-[#072A6C]"><Mail size={15} />{member.email}</a>}
            {member.phone && <a href={`tel:${member.phone}`} className="inline-flex items-center gap-2 text-[#072A6C]"><Phone size={15} />{member.phone}</a>}
          </div>}
        </div>
      </section>
    </div>
  );
}
