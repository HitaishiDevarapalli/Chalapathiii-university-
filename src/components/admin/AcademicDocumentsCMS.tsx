import { useEffect, useRef, useState } from "react";
import { ExternalLink, FileText, Pencil, Trash2, UploadCloud, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminAccess } from "../../security/adminAccess";
import {
  AcademicDegree, AcademicDocument, AcademicDocumentCategory, academicDocumentPath,
  categoryLabels, degreeLabels, deleteAcademicDocument, documentSize,
  MAX_ACADEMIC_DOCUMENT_SIZE, readAcademicDocuments, saveAcademicDocument,
} from "../../services/academicDocuments";

export default function AcademicDocumentsCMS({ initialDegree = "btech", initialCategory = "syllabus" }: {
  initialDegree?: AcademicDegree;
  initialCategory?: AcademicDocumentCategory;
}) {
  const [degree, setDegree] = useState(initialDegree);
  const [category, setCategory] = useState(initialCategory);
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File>();
  const [editing, setEditing] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState<string>();
  const fileInput = useRef<HTMLInputElement>(null);
  const { can } = useAdminAccess();
  const canWrite = can("academics", editing ? "edit" : "create") && can("academics", "publish");
  const visibleDocuments = documents.filter(item => item.degree === degree && item.category === category);

  const resetForm = () => {
    setTitle(""); setFile(undefined); setEditing(undefined); setProgress(0); setConfirmDelete(undefined);
    if (fileInput.current) fileInput.current.value = "";
  };
  const refresh = async () => {
    setLoading(true); setLoadFailed(false); setError("");
    try { setDocuments(await readAcademicDocuments()); }
    catch (error: any) { setError(error.message); setLoadFailed(true); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  useEffect(() => {
    setDegree(initialDegree); setCategory(initialCategory); resetForm(); setMessage("");
  }, [initialDegree, initialCategory]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canWrite || busy) return;
    setError(""); setMessage("");
    if (!title.trim()) { setError("Enter a document title."); return; }
    if (!editing && !file) { setError("Choose a PDF document to upload."); return; }
    setBusy(true); setProgress(0);
    try {
      const saved = await saveAcademicDocument({ title, degree, category, file, id: editing }, setProgress);
      setDocuments(previous => [saved, ...previous.filter(item => item.id !== saved.id)]);
      setMessage(`${degreeLabels[degree]} ${categoryLabels[category]} document ${editing ? "updated" : "published"}.`);
      resetForm();
    } catch (error: any) { setError(error.message); }
    finally { setBusy(false); }
  };
  const remove = async (document: AcademicDocument) => {
    if (!can("academics", "delete") || busy) return;
    setBusy(true); setError(""); setMessage("");
    try {
      await deleteAcademicDocument(document.id);
      setDocuments(previous => previous.filter(item => item.id !== document.id));
      if (editing === document.id) resetForm();
      setConfirmDelete(undefined); setMessage("Document removed from the website.");
    } catch (error: any) { setError(error.message); }
    finally { setBusy(false); }
  };

  return <section data-admin-module="academics" className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-2xl font-bold text-[#072A6C]">Syllabus &amp; Regulations</h1><p className="mt-2 text-sm text-gray-500">Manage the documents students see under BTech and MTech. PDF files up to 50 MB each.</p></div>
      <Link to={academicDocumentPath(degree, category)} target="_blank" rel="noopener noreferrer" className="admin-button admin-button-secondary"><ExternalLink size={16} /> Preview section</Link>
    </div>
    <div className="admin-panel p-5 sm:p-6 space-y-5">
      <div className="flex gap-3" aria-label="Degree">
        {(["btech", "mtech"] as const).map(value => <button key={value} type="button" disabled={busy} aria-pressed={degree === value} onClick={() => { setDegree(value); resetForm(); setMessage(""); }} className={`rounded-lg px-6 py-3 text-sm font-semibold ${degree === value ? "bg-[#072A6C] text-white" : "bg-gray-100 text-gray-600"}`}>{degreeLabels[value]}</button>)}
      </div>
      <div className="flex gap-3 border-b border-gray-100" aria-label="Document section">
        {(["syllabus", "regulations"] as const).map(value => <button key={value} type="button" disabled={busy} aria-pressed={category === value} onClick={() => { setCategory(value); resetForm(); setMessage(""); }} className={`border-b-2 px-4 pb-3 text-sm font-semibold ${category === value ? "border-[#D4AF37] text-[#072A6C]" : "border-transparent text-gray-500"}`}>{categoryLabels[value]}</button>)}
      </div>
      {error && <div role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {message && <div role="status" className="rounded-lg bg-green-50 p-4 text-sm text-green-800">{message}</div>}
      {canWrite && <form onSubmit={save} className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 space-y-4">
        <h2 className="font-semibold text-[#072A6C]">{editing ? "Edit" : "Upload"} {degreeLabels[degree]} {categoryLabels[category]}</h2>
        <label className="block text-sm font-medium text-gray-700">Document title
          <input value={title} onChange={event => setTitle(event.target.value)} disabled={busy} maxLength={200} required placeholder="e.g. R26 Computer Science — Semester 1" className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm" />
        </label>
        <label className="block text-sm font-medium text-gray-700">{editing ? "Replace PDF (optional)" : "PDF document"}
          <input ref={fileInput} type="file" accept=".pdf,application/pdf" disabled={busy} required={!editing} onChange={event => {
            const selected = event.target.files?.[0]; setError("");
            if (selected && (selected.size > MAX_ACADEMIC_DOCUMENT_SIZE || !selected.name.toLowerCase().endsWith(".pdf") || !selected.size)) {
              setError("Choose a non-empty PDF document up to 50 MB."); event.target.value = ""; setFile(undefined); return;
            }
            setFile(selected);
            if (selected && !title) setTitle(selected.name.replace(/\.pdf$/i, ""));
          }} className="mt-2 block w-full rounded-lg border border-dashed border-gray-300 bg-white p-4 text-sm" />
        </label>
        <p className="text-xs text-gray-500">{file ? `${file.name} · ${documentSize(file.size)}` : editing ? "Keep the current PDF, or select a new file to replace it." : "Maximum 50 MB per PDF. You can add multiple documents to each section."}</p>
        {busy && <div role="status" className="space-y-2"><p className="text-sm text-[#072A6C]">{progress < 99 ? `Uploading… ${progress}%` : "Saving document…"}</p><progress value={progress} max={100} className="h-2 w-full" /></div>}
        <div className="flex flex-wrap gap-3"><button type="submit" data-admin-action={editing ? "edit" : "create"} disabled={busy || loading || loadFailed} className="admin-button admin-button-primary disabled:opacity-50"><UploadCloud size={17} />{busy ? "Please wait…" : editing ? "Save document" : "Upload & publish"}</button>{editing && <button type="button" disabled={busy} onClick={resetForm} className="admin-button admin-button-secondary"><X size={16} /> Cancel edit</button>}</div>
      </form>}
      <div className="flex items-center justify-between gap-3"><h2 className="font-semibold text-[#072A6C]">{degreeLabels[degree]} {categoryLabels[category]} <span className="text-sm font-normal text-gray-500">({visibleDocuments.length})</span></h2><button type="button" disabled={busy || loading} onClick={() => void refresh()} className="text-sm font-medium text-[#072A6C]">Reload documents</button></div>
      {loading ? <p role="status" className="py-8 text-center text-sm text-gray-500">Loading documents…</p> : loadFailed ? <p className="py-6 text-sm text-gray-500">Reload documents to try again.</p> : visibleDocuments.length === 0 ? <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-500"><FileText size={30} className="mx-auto mb-3" /><p>No {degreeLabels[degree]} {categoryLabels[category].toLowerCase()} documents yet.</p><p className="mt-1 text-sm">Upload a PDF above to make it available to students.</p></div> :
        <div className="divide-y divide-gray-100">{visibleDocuments.map(document => <article key={document.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="min-w-0 flex-1"><h3 className="break-words font-semibold text-gray-800">{document.title}</h3><p className="mt-1 break-words text-xs text-gray-500">{document.originalName} · {documentSize(document.size)} · Updated {new Date(document.updatedAt).toLocaleDateString("en-IN")}</p></div>
          <div className="flex flex-wrap gap-2"><a href={document.url} target="_blank" rel="noopener noreferrer" className="admin-button admin-button-secondary"><ExternalLink size={15} /> View PDF</a>
            {can("academics", "edit") && can("academics", "publish") && <button type="button" disabled={busy} data-admin-action="edit" onClick={() => { resetForm(); setEditing(document.id); setTitle(document.title); setMessage(""); fileInput.current?.scrollIntoView({ behavior: "smooth", block: "center" }); }} className="admin-button admin-button-secondary"><Pencil size={15} /> Edit / replace</button>}
            {can("academics", "delete") && <button type="button" disabled={busy} data-admin-action="delete" onClick={() => setConfirmDelete(document.id)} className="admin-button admin-button-secondary text-red-600"><Trash2 size={15} /> Remove</button>}
          </div>
          {confirmDelete === document.id && <div role="alert" className="flex w-full flex-wrap items-center gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-800"><span>Remove “{document.title}” from the website?</span><button type="button" data-admin-action="delete" disabled={busy} onClick={() => void remove(document)} className="font-bold underline">Yes, remove</button><button type="button" disabled={busy} onClick={() => setConfirmDelete(undefined)}>Cancel</button></div>}
        </article>)}</div>}
    </div>
  </section>;
}
