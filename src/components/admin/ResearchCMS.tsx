import React, { useEffect, useRef, useState } from "react";
import { Plus, Edit3, Trash2, Eye, EyeOff, Save, X, ArrowUp, ArrowDown } from "lucide-react";
import { ResearchCMSData, ResearchItem, ResearchSection, researchSectionForItem, safeResearchLink } from "../../data/researchData";
import { publishResearch, readPublishedResearch, readResearchDraft } from "../../services/researchPublishing";
import { MediaPicker } from "./MediaStorage";
import "../../styles/research-admin.css";

export { DEFAULT_RESEARCH_DATA } from "../../data/researchData";
export type { ResearchCMSData, ResearchItem } from "../../data/researchData";
export interface ResearchCMSProps { notifySave: (msg: string) => void; }
const blankItem = (sectionId: string): ResearchItem => ({ id: "", title: "", category: "General", sectionId, description: "", badge: "", link: "", linkText: "View document", type: "document", parentId: "", hidden: false });

export const ResearchCMS: React.FC<ResearchCMSProps> = ({ notifySave }) => {
  const [data, setData] = useState<ResearchCMSData>(readResearchDraft);
  const [sectionId, setSectionId] = useState("updates");
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<ResearchItem | null>(null);
  const [newSection, setNewSection] = useState<Pick<ResearchSection, "title" | "description" | "hidden"> | null>(null);
  const [pickingDocument, setPickingDocument] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const sectionDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (form && !pickingDocument && !dialog.current?.open) dialog.current?.showModal(); }, [form, pickingDocument]);
  useEffect(() => { if (newSection && !sectionDialog.current?.open) sectionDialog.current?.showModal(); }, [newSection]);
  const load = async () => {
    setLoading(true); setReady(false); setError("");
    try { const published = await readPublishedResearch(); if (published) setData(published); setReady(true); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to load research content."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const section = data.sections.find(s => s.id === sectionId) || data.sections[0];
  const filtered = section ? data.items.filter(item => researchSectionForItem(item) === section.id) : [];
  const groups = data.items.filter(item => item.type === "accordion" && item.id !== form?.id && researchSectionForItem(item) === form?.sectionId);
  const save = async (next: ResearchCMSData = data) => {
    if (!ready) return false;
    const titles = next.sections.map(item => item.title.trim().toLowerCase());
    if (titles.some(title => !title) || new Set(titles).size !== titles.length) {
      setError("Each sidebar option needs a unique, non-empty title."); return false;
    }
    setSaving(true); setError(""); setMessage("");
    try {
      const published = await publishResearch(next);
      setData(published); setMessage("Research content published. The public page is up to date.");
      notifySave("Research content saved to the server and published!");
      return true;
    } catch (err) { setError(err instanceof Error ? err.message : "Publishing failed. Your changes are still in the editor."); return false; }
    finally { setSaving(false); }
  };
  const editSection = (patch: Partial<ResearchSection>) => {
    if (section) setData({ ...data, sections: data.sections.map(s => s.id === section.id ? { ...s, ...patch } : s) });
  };
  const addSection = async (event: React.FormEvent) => {
    event.preventDefault(); if (!newSection) return;
    const added: ResearchSection = { ...newSection, id: `research-${crypto.randomUUID()}`, title: newSection.title.trim() };
    if (await save({ ...data, sections: [...data.sections, added] })) {
      setSectionId(added.id); setNewSection(null);
    }
  };
  const deleteSection = async () => {
    if (!section) return;
    const count = filtered.length;
    if (!window.confirm(`Delete sidebar option "${section.title}"${count ? ` and its ${count} content entries` : ""}? Uploaded files will stay in Media Storage.`)) return;
    const removedIds = new Set(filtered.map(item => item.id));
    const sections = data.sections.filter(item => item.id !== section.id);
    const items = data.items.filter(item => !removedIds.has(item.id) && !removedIds.has(item.parentId || ""));
    if (await save({ ...data, sections, items })) setSectionId(sections[0]?.id || "");
  };
  const move = (id: string, direction: -1 | 1, kind: "sections" | "items") => {
    const list = [...data[kind]];
    const siblings = kind === "items" ? filtered.filter(item => item.parentId === data.items.find(item => item.id === id)?.parentId) : data.sections;
    const position = siblings.findIndex(item => item.id === id);
    const other = siblings[position + direction];
    if (!other) return;
    const a = list.findIndex(item => item.id === id), b = list.findIndex(item => item.id === other.id);
    [list[a], list[b]] = [list[b], list[a]];
    setData({ ...data, [kind]: list }); setMessage("Order updated. Publish changes to apply it to the public page.");
  };
  const submitItem = async (event: React.FormEvent) => {
    event.preventDefault(); if (!form) return;
    if (form.link && !safeResearchLink(form.link)) { setError("Use a full https:// link or a website path beginning with /."); return; }
    const item = { ...form, id: form.id || crypto.randomUUID(), title: form.title.trim(), link: form.type === "accordion" ? "" : form.link?.trim(), parentId: form.type === "accordion" ? "" : form.parentId };
    if (!item.title) return;
    let items = form.id ? data.items.map(existing => existing.id === form.id ? item : existing) : [...data.items, item];
    // Children follow a group when it is moved; converting a group preserves its documents.
    items = items.map(child => child.parentId === item.id ? { ...child, sectionId: item.sectionId, parentId: item.type === "accordion" ? item.id : "" } : child);
    if (await save({ ...data, items })) setForm(null);
  };
  const remove = async (item: ResearchItem) => {
    if (!window.confirm(`Delete "${item.title}"${item.type === "accordion" ? " and its documents" : ""}?`)) return;
    await save({ ...data, items: data.items.filter(it => it.id !== item.id && it.parentId !== item.id) });
  };
  return <div className="research-admin">
    <div className="research-admin-top"><div><p className="research-admin-kicker">CONTENT MANAGEMENT</p><h2>Research & Innovation</h2><p>Manage every research section, update and document on the public website.</p></div>
      <div className="research-admin-actions"><a href="/research" target="_blank" rel="noreferrer">View public page ↗</a><button type="button" disabled={!ready || loading || saving} onClick={() => void save()}><Save size={15} />{saving ? "Publishing…" : "Publish changes"}</button></div>
    </div>
    {loading && <p role="status">Loading research content from the server…</p>}
    {error && <div className="research-admin-error" role="alert">{error}<button type="button" onClick={() => void load()} disabled={saving}>Reload server content</button></div>}
    {message && <p className="research-admin-message" role="status">{message}</p>}
    <fieldset disabled={!ready || loading || saving} className="research-admin-fields">
      <section className="research-admin-card"><h3>Page settings</h3><div className="research-admin-grid">
        <label>Page title<input value={data.pageTitle} onChange={e => setData({ ...data, pageTitle: e.target.value })} /></label>
        <label>Subtitle<input value={data.pageSubtitle} onChange={e => setData({ ...data, pageSubtitle: e.target.value })} /></label>
        <label>Contact email<input type="email" value={data.contactEmail} onChange={e => setData({ ...data, contactEmail: e.target.value })} /></label>
        <label>Contact phone<input value={data.contactPhone} onChange={e => setData({ ...data, contactPhone: e.target.value })} /></label>
      </div><div className="research-admin-checks">
        <label><input type="checkbox" checked={!!data.hidden} onChange={e => setData({ ...data, hidden: e.target.checked })} /> Hide research page</label>
        <label><input type="checkbox" checked={data.isUnderConstruction} onChange={e => setData({ ...data, isUnderConstruction: e.target.checked })} /> Show maintenance notice</label>
      </div>{data.isUnderConstruction && <label>Maintenance message<textarea value={data.underConstructionMessage} onChange={e => setData({ ...data, underConstructionMessage: e.target.value })} /></label>}</section>
      <section className="research-admin-card"><div className="research-admin-section-title"><div><h3>Sidebar sections & content</h3><p>{data.sections.length} sidebar options · Add and delete options here to update the public menu.</p></div><button type="button" data-admin-action="create" onClick={() => { setError(""); setNewSection({ title: "", description: "", hidden: false }); }}><Plus size={15} />Add sidebar option</button></div>
        {section ? <>
        <div className="research-admin-tabs" data-admin-filter>{data.sections.map(s => <button type="button" data-admin-action="view" key={s.id} aria-pressed={section.id === s.id} onClick={() => setSectionId(s.id)}>{s.title}{s.hidden ? " (hidden)" : ""}</button>)}</div>
        <div className="research-admin-grid"><label>Section title<input value={section.title} onChange={e => editSection({ title: e.target.value })} /></label><label>Section introduction<textarea rows={2} value={section.description} onChange={e => editSection({ description: e.target.value })} /></label></div>
        <div className="research-admin-section-actions"><label><input type="checkbox" checked={!!section.hidden} onChange={e => editSection({ hidden: e.target.checked })} /> Hide this section</label><div className="research-admin-actions"><button type="button" className="secondary" disabled={data.sections[0].id === section.id} onClick={() => move(section.id, -1, "sections")}><ArrowUp size={14} />Move section up</button><button type="button" className="secondary" disabled={data.sections[data.sections.length - 1].id === section.id} onClick={() => move(section.id, 1, "sections")}><ArrowDown size={14} />Move section down</button><button type="button" className="secondary research-admin-danger" data-admin-action="delete" onClick={() => void deleteSection()}><Trash2 size={14} />Delete sidebar option</button></div></div>
        </> : <p className="research-admin-empty">No sidebar options yet. Add an option to start publishing research content.</p>}
      </section>
      {section && <section className="research-admin-card"><div className="research-admin-section-title"><div><h3>{section.title}</h3><p>{filtered.length} entries · Item changes publish when saved. Publish page settings and ordering using the button above.</p></div><button type="button" onClick={() => { setError(""); setForm(blankItem(section.id)); }}><Plus size={15} />Add item</button></div>
        {filtered.length === 0 && <p className="research-admin-empty">Add text, a document link or an expandable document group to this section.</p>}
        <div className="research-admin-items">{filtered.map(item => <article key={item.id} className={`research-admin-item ${item.hidden ? "is-hidden" : ""} ${item.parentId ? "is-child" : ""}`}>
          <div><span className="research-admin-item-meta">{item.parentId ? "Grouped document" : item.type === "accordion" ? "Expandable group" : "Research item"}{item.badge ? ` · ${item.badge}` : ""}{item.hidden ? " · Hidden" : ""}</span><h4>{item.title}</h4>{item.link && <p>{item.link}</p>}</div>
          <div className="research-admin-actions">
            <button className="secondary" type="button" title={`Move up: ${item.title}`} onClick={() => move(item.id, -1, "items")}><ArrowUp size={14} /></button>
            <button className="secondary" type="button" title={`Move down: ${item.title}`} onClick={() => move(item.id, 1, "items")}><ArrowDown size={14} /></button>
            <button className="secondary" type="button" onClick={() => void save({ ...data, items: data.items.map(it => it.id === item.id ? { ...it, hidden: !it.hidden } : it) })}>{item.hidden ? <Eye size={14} /> : <EyeOff size={14} />}{item.hidden ? "Show" : "Hide"}</button>
            <button className="secondary" type="button" onClick={() => { setError(""); setForm({ ...item, sectionId: researchSectionForItem(item), type: item.type || "document" }); }}><Edit3 size={14} />Edit</button>
            <button className="secondary" type="button" onClick={() => void remove(item)}><Trash2 size={14} />Delete</button>
          </div>
        </article>)}</div>
      </section>}
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
    {form && <dialog ref={dialog} className="research-admin-dialog" onCancel={() => setForm(null)} aria-labelledby="research-item-dialog-title"><form onSubmit={submitItem}>
      <div className="research-admin-section-title"><h3 id="research-item-dialog-title">{form.id ? "Edit research item" : "Add research item"}</h3><button type="button" className="secondary" aria-label="Close item editor" disabled={saving} onClick={() => setForm(null)}><X size={18} /></button></div>
      {error && <p role="alert" className="research-admin-error">{error}</p>}
      <fieldset disabled={saving} className="research-admin-fields">
        <label>Title<input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
        <div className="research-admin-grid"><label>Section<select value={form.sectionId} onChange={e => setForm({ ...form, sectionId: e.target.value, parentId: "" })}>{data.sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
          <label>Content type<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as ResearchItem["type"], parentId: "" })}><option value="document">Text / document link</option><option value="accordion">Expandable document group</option></select></label></div>
        <label>Description<textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        {form.type !== "accordion" && <><label>Document group<select value={form.parentId || ""} onChange={e => setForm({ ...form, parentId: e.target.value })}><option value="">None (standalone item)</option>{groups.map(group => <option key={group.id} value={group.id}>{group.title}</option>)}</select></label>
          <label>Document or page URL<input value={form.link || ""} placeholder="https://… or /uploads/document.pdf" onChange={e => setForm({ ...form, link: e.target.value })} /></label>
          <button type="button" data-admin-action="view" className="secondary" onClick={() => { dialog.current?.close(); setPickingDocument(true); }}>Choose document from Media Storage</button></>}
        <div className="research-admin-grid"><label>Badge (optional)<input value={form.badge || ""} placeholder="e.g. NEW" maxLength={30} onChange={e => setForm({ ...form, badge: e.target.value })} /></label><label>Visibility<select value={form.hidden ? "hidden" : "visible"} onChange={e => setForm({ ...form, hidden: e.target.value === "hidden" })}><option value="visible">Visible</option><option value="hidden">Hidden</option></select></label></div>
      </fieldset>
      <div className="research-admin-actions research-admin-modal-actions"><button type="button" className="secondary" disabled={saving} onClick={() => setForm(null)}>Cancel</button><button type="submit" disabled={saving}>{saving ? "Publishing…" : "Save & publish item"}</button></div>
    </form></dialog>}
    {pickingDocument && form && <MediaPicker type="all" onSelect={asset => { setForm({ ...form, link: asset.url }); setPickingDocument(false); }} onClose={() => setPickingDocument(false)} />}
  </div>;
};
