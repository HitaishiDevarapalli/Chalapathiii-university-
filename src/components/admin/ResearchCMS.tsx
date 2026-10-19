import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import { DEFAULT_RESEARCH_DATA, ResearchCMSData, ResearchSection, researchSectionForItem } from "../../data/researchData";
import { countResearchBlocks, ResearchBlock, researchBlocksForSection } from "../../data/researchBlocks";
import { publishResearch, readPublishedResearch, readResearchDraft, readResearchEditorDraft, storeResearchEditorDraft, clearResearchEditorDraft } from "../../services/researchPublishing";
import { ResearchComponentEditor } from "./ResearchComponentEditor";
import "../../styles/research-admin.css";

export { DEFAULT_RESEARCH_DATA } from "../../data/researchData";
export type { ResearchCMSData, ResearchItem } from "../../data/researchData";
export interface ResearchCMSProps { notifySave: (msg: string) => void; onPublishReady?: (handler: (() => Promise<boolean>) | null) => void; }
export const ResearchCMS: React.FC<ResearchCMSProps> = ({ notifySave, onPublishReady }) => {
  const [data, setData] = useState<ResearchCMSData>(readResearchDraft);
  const [sectionId, setSectionId] = useState("updates");
  const [loading, setLoading] = useState(true), [ready, setReady] = useState(false), [saving, setSaving] = useState(false);
  const [error, setError] = useState(""), [message, setMessage] = useState(""), [dirty, setDirty] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [recoverableDraft, setRecoverableDraft] = useState(readResearchEditorDraft);
  const [newSection, setNewSection] = useState<Pick<ResearchSection, "title" | "description" | "hidden"> | null>(null);
  const [showSuppliedContent, setShowSuppliedContent] = useState(false);
  const sectionDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (newSection && !sectionDialog.current?.open) sectionDialog.current?.showModal(); }, [newSection]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty || uploads > 0) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, uploads]);
  const load = async () => {
    setLoading(true); setReady(false); setError("");
    try { const published = await readPublishedResearch(); if (published) setData(published); setReady(true); setDirty(false); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to load research content."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  useEffect(() => { if (dirty) storeResearchEditorDraft(data); }, [data, dirty]);
  const section = data.sections.find(s => s.id === sectionId) || data.sections[0];
  const blocks = section ? researchBlocksForSection(data, section.id) : [];
  const editData = (patch: Partial<ResearchCMSData>) => { setData(previous => ({ ...previous, ...patch })); setDirty(true); setMessage(""); };
  const save = async (next: ResearchCMSData = data) => {
    if (!ready || uploads > 0) return false;
    setSaving(true); setError(""); setMessage("");
    try {
      const published = await publishResearch(next);
      setData(published); setDirty(false); clearResearchEditorDraft(); setRecoverableDraft(null); setMessage("Research content published. The public page is up to date.");
      notifySave("Research content saved to the server and published!"); return true;
    } catch (err) { setError(err instanceof Error ? err.message : "Publishing failed. Your changes are still in the editor."); return false; }
    finally { setSaving(false); }
  };
  useEffect(() => { onPublishReady?.(() => save()); return () => onPublishReady?.(null); }, [onPublishReady, save]);
  const editSection = (patch: Partial<ResearchSection>) => {
    if (!section) return; setDirty(true); setMessage("");
    const id = section.id; setData(previous => ({ ...previous, sections: previous.sections.map(item => item.id === id ? { ...item, ...patch } : item) }));
  };
  const editBlocks = (value: ResearchBlock[] | ((previous: ResearchBlock[]) => ResearchBlock[])) => {
    if (!section) return; const id = section.id; setDirty(true); setMessage("");
    setData(previous => ({ ...previous, sections: previous.sections.map(item => item.id === id ? { ...item,
      blocks: typeof value === "function" ? value(researchBlocksForSection(previous, id)) : value } : item) }));
  };
  const addSection = async (event: React.FormEvent) => {
    event.preventDefault(); if (!newSection) return;
    const added: ResearchSection = { ...newSection, id: `research-${crypto.randomUUID()}`, title: newSection.title.trim(), blocks: [] };
    if (await save({ ...data, sections: [...data.sections, added] })) { setSectionId(added.id); setNewSection(null); }
  };
  const deleteSection = async () => {
    if (!section) return;
    const count = countResearchBlocks(blocks);
    if (!window.confirm(`Delete sidebar option "${section.title}"${count ? ` and its ${count} content components` : ""}? Uploaded files will stay in Media Storage.`)) return;
    const removedIds = new Set(data.items.filter(item => researchSectionForItem(item) === section.id).map(item => item.id));
    const sections = data.sections.filter(item => item.id !== section.id);
    const items = data.items.filter(item => !removedIds.has(item.id) && !removedIds.has(item.parentId || ""));
    if (await save({ ...data, sections, items })) setSectionId(sections[0]?.id || "");
  };
  const moveSection = (direction: -1 | 1) => {
    if (!section) return; const sections = [...data.sections], index = sections.findIndex(item => item.id === section.id);
    if (!sections[index + direction]) return;
    [sections[index], sections[index + direction]] = [sections[index + direction], sections[index]]; editData({ sections });
  };
  return <div className="research-admin">
    <div className="research-admin-top"><div><p className="research-admin-kicker">CONTENT MANAGEMENT</p><h2>Research & Innovation</h2><p>Create sidebar options and build each page with reusable content components.</p></div>
      <div className="research-admin-actions"><a href="/research" target="_blank" rel="noreferrer">View public page ↗</a><button type="button" data-admin-action="publish" disabled={!ready || loading || saving || uploads > 0} onClick={() => void save()}><Save size={15} />{uploads > 0 ? "Uploading…" : saving ? "Publishing…" : "Publish changes"}</button></div>
    </div>
    {loading && <p role="status">Loading research content from the server…</p>}
    {error && <div className="research-admin-error" role="alert">{error}<button type="button" data-admin-action="view" onClick={() => { if (!dirty || window.confirm("Reload published content and discard your unsaved edits?")) { clearResearchEditorDraft(); setRecoverableDraft(null); void load(); } }} disabled={saving || uploads > 0}>Reload server content</button></div>}
    {message && <p className="research-admin-message" role="status">{message}</p>}
    {dirty && <p className="research-editor-unsaved" role="status">Unsaved changes — publish when your content is ready.</p>}
    {recoverableDraft && !dirty && ready && <div className="research-admin-draft"><p>Unsaved research edits are available from this browser.</p><div className="research-admin-actions"><button type="button" className="secondary" data-admin-action="edit" onClick={() => { setData(recoverableDraft); setDirty(true); setError(""); }}>Restore draft</button><button type="button" className="secondary" data-admin-action="edit" onClick={() => { clearResearchEditorDraft(); setRecoverableDraft(null); }}>Discard draft</button></div></div>}
    <fieldset disabled={!ready || loading || saving} className="research-admin-fields">
      <section className="research-admin-card"><div className="research-admin-section-title"><div><h3>University research content · 2026–27</h3><p>The supplied research page includes 18 editable sections, eligibility tables, FAQs and six PDF documents.</p></div><button type="button" className="secondary" data-admin-action="edit" disabled={uploads > 0} onClick={() => setShowSuppliedContent(value => !value)}>{showSuppliedContent ? "Close content details" : "Load supplied research content"}</button></div>
        {showSuppliedContent && <div className="research-admin-draft"><p>Load the supplied page into this editor to replace the current draft. Review all sections, then use Publish changes to save them to the website.</p><p>{DEFAULT_RESEARCH_DATA.sections.map(item => item.title).join(" · ")}</p><div className="research-admin-actions"><button type="button" data-admin-action="edit" disabled={uploads > 0} onClick={() => { editData(structuredClone(DEFAULT_RESEARCH_DATA)); setSectionId("overview"); setShowSuppliedContent(false); }}>Use supplied content in editor</button><button type="button" className="secondary" onClick={() => setShowSuppliedContent(false)}>Cancel</button></div></div>}
      </section>
      <section className="research-admin-card"><h3>Page settings</h3><div className="research-admin-grid">
        <label>Page title<input value={data.pageTitle} onChange={e => editData({ pageTitle: e.target.value })} /></label>
        <label>Subtitle<input value={data.pageSubtitle} onChange={e => editData({ pageSubtitle: e.target.value })} /></label>
      </div><div className="research-admin-checks">
        <label><input type="checkbox" checked={!!data.hidden} onChange={e => editData({ hidden: e.target.checked })} /> Hide research page</label>
        <label><input type="checkbox" checked={data.isUnderConstruction} onChange={e => editData({ isUnderConstruction: e.target.checked })} /> Show maintenance notice</label>
      </div>{data.isUnderConstruction && <label>Maintenance message<textarea value={data.underConstructionMessage} onChange={e => editData({ underConstructionMessage: e.target.value })} /></label>}</section>
      <section className="research-admin-card"><div className="research-admin-section-title"><div><h3>Sidebar sections & content</h3><p>{data.sections.length} sidebar options · Add as many options as you need.</p></div><button type="button" data-admin-action="create" disabled={uploads > 0} onClick={() => { setError(""); setNewSection({ title: "", description: "", hidden: false }); }}><Plus size={15} />Add sidebar option</button></div>
        {section ? <>
        <div className="research-admin-tabs" data-admin-filter>{data.sections.map(s => <button type="button" data-admin-action="view" key={s.id} aria-pressed={section.id === s.id} onClick={() => setSectionId(s.id)} disabled={uploads > 0}>{s.title}{s.hidden ? " (hidden)" : ""}</button>)}</div>
        <div className="research-admin-grid"><label>Section title<input value={section.title} onChange={e => editSection({ title: e.target.value })} /></label><label>Section introduction<textarea rows={2} value={section.description} onChange={e => editSection({ description: e.target.value })} /></label></div>
        <div className="research-admin-section-actions"><label><input type="checkbox" checked={!!section.hidden} onChange={e => editSection({ hidden: e.target.checked })} /> Hide this section</label><div className="research-admin-actions"><button type="button" className="secondary" disabled={data.sections[0].id === section.id} onClick={() => moveSection(-1)}><ArrowUp size={14} />Move section up</button><button type="button" className="secondary" disabled={data.sections[data.sections.length - 1].id === section.id} onClick={() => moveSection(1)}><ArrowDown size={14} />Move section down</button><button type="button" className="secondary research-admin-danger" data-admin-action="delete" disabled={uploads > 0} onClick={() => void deleteSection()}><Trash2 size={14} />Delete sidebar option</button></div></div>
        </> : <p className="research-admin-empty">No sidebar options yet. Add an option to start publishing research content.</p>}
      </section>
      {section && <ResearchComponentEditor key={section.id} blocks={blocks} onChange={editBlocks} disabled={saving || loading} onPublish={() => void save()} onUploadBusy={busy => setUploads(count => Math.max(0, count + (busy ? 1 : -1)))} />}
    </fieldset>
    {newSection && <dialog ref={sectionDialog} className="research-admin-dialog research-section-dialog" onCancel={event => { if (saving) event.preventDefault(); else setNewSection(null); }} aria-labelledby="research-section-dialog-title"><form onSubmit={addSection}>
      <div className="research-admin-section-title"><h3 id="research-section-dialog-title">Add sidebar option</h3><button type="button" className="secondary" aria-label="Close sidebar option editor" disabled={saving} onClick={() => setNewSection(null)}><X size={18} /></button></div>
      {error && <p role="alert" className="research-admin-error">{error}</p>}
      <fieldset disabled={saving} className="research-admin-fields">
        <label>Option title<input required maxLength={120} value={newSection.title} placeholder="e.g. Research Centres" onChange={e => setNewSection({ ...newSection, title: e.target.value })} /></label>
        <label>Introduction (optional)<textarea rows={3} value={newSection.description} onChange={e => setNewSection({ ...newSection, description: e.target.value })} /></label>
        <label>Visibility<select value={newSection.hidden ? "hidden" : "visible"} onChange={e => setNewSection({ ...newSection, hidden: e.target.value === "hidden" })}><option value="visible">Visible on public sidebar</option><option value="hidden">Hidden</option></select></label>
      </fieldset>
      <div className="research-admin-actions research-admin-modal-actions"><button type="button" className="secondary" disabled={saving} onClick={() => setNewSection(null)}>Cancel</button><button type="submit" data-admin-action="publish" disabled={saving}>{saving ? "Publishing…" : "Create & publish option"}</button></div>
    </form></dialog>}
  </div>;
};
