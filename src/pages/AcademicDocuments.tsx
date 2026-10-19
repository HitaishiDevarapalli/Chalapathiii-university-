import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Download, ExternalLink, FileText } from "lucide-react";
import SEO from "../components/SEO";
import { AcademicDocument, categoryLabels, degreeLabels, documentSize, readAcademicDocuments } from "../services/academicDocuments";

export default function AcademicDocuments() {
  const { degree, category } = useParams();
  const [documents, setDocuments] = useState<AcademicDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);
  const validDegree = degree === "btech" || degree === "mtech" ? degree : null;
  const validCategory = category === "syllabus" || category === "regulations" ? category : null;
  const title = validDegree && validCategory ? `${degreeLabels[validDegree]} ${categoryLabels[validCategory]}` : "Documents";

  useEffect(() => {
    let active = true;
    if (!validDegree || !validCategory) { setLoading(false); return; }
    const refresh = async () => {
      try {
        const items = await readAcademicDocuments(validDegree, validCategory);
        if (active) { setDocuments(items); setError(""); }
      } catch (error: any) { if (active) setError(error.message); }
      finally { if (active) setLoading(false); }
    };
    setLoading(true); setDocuments([]); setError(""); void refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("academic-documents-updated", refresh);
    return () => { active = false; window.removeEventListener("focus", refresh); window.removeEventListener("academic-documents-updated", refresh); };
  }, [validDegree, validCategory, reload]);

  return <main className="min-h-[60vh] bg-gray-50/50 pb-16 font-[var(--font-poppins)]">
    <SEO title={title} description={`View and download official ${title.toLowerCase()} documents from Chalapathi University.`} />
    <div className="bg-[#072A6C] px-5 py-12 text-white"><div className="mx-auto max-w-5xl"><nav aria-label="Breadcrumb" className="mb-5 text-sm text-white/70"><Link to="/">Home</Link> / Syllabus &amp; Regulations / {title}</nav><h1 className="text-3xl font-bold sm:text-4xl">{title}</h1><p className="mt-3 text-sm text-white/80">View and download the official academic documents.</p></div></div>
    <div className="mx-auto max-w-5xl px-5 pt-10">
      {!validDegree || !validCategory ? <p>Section not found. <Link to="/" className="underline">Return home</Link></p> : loading ? <p role="status" className="py-12 text-center text-gray-500">Loading documents…</p> : error ? <div role="alert" className="rounded-xl border border-red-100 bg-white p-6"><p className="text-red-700">{error}</p><button type="button" onClick={() => setReload(value => value + 1)} className="mt-4 font-semibold text-[#072A6C] underline">Try again</button></div> : documents.length === 0 ? <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center"><FileText size={36} className="mx-auto mb-4 text-[#D4AF37]" /><h2 className="text-lg font-semibold text-[#072A6C]">Documents will be available soon</h2><p className="mt-2 text-sm text-gray-500">Please check back for {title.toLowerCase()} updates.</p></div> : <div className="space-y-4">{documents.map(document => <article key={document.id} className="flex flex-wrap items-center gap-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"><div className="rounded-xl bg-[#072A6C]/5 p-3 text-[#072A6C]"><FileText size={26} /></div><div className="min-w-0 flex-1"><h2 className="break-words font-semibold text-[#072A6C]">{document.title}</h2><p className="mt-2 text-xs text-gray-500">PDF · {documentSize(document.size)} · Updated {new Date(document.updatedAt).toLocaleDateString("en-IN")}</p></div><div className="flex flex-wrap gap-3"><a href={document.url} target="_blank" rel="noopener noreferrer" aria-label={`View ${document.title}`} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#072A6C]"><ExternalLink size={16} /> View</a><a href={document.url} download={document.originalName} aria-label={`Download ${document.title}`} className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white"><Download size={16} /> Download</a></div></article>)}</div>}
    </div>
  </main>;
}
