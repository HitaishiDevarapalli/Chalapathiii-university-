import React, { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
import { RESEARCH_COMPONENTS, ResearchBlock, ResearchBlockType, ResearchBullet, copyResearchBlock, findResearchBlock, makeResearchBlock, removeResearchBlock, researchPlacementFits, updateResearchBlock } from "../../data/researchBlocks";
import { ResearchBlockContent, ResearchBlocks } from "../research/ResearchBlocks";
import { MediaAsset, MediaPicker, uploadMedia } from "./MediaStorage";
import { useAdminAccess } from "../../security/adminAccess";
import { ResearchImageProperties } from "./ResearchImageProperties";
import { ResearchNumberField } from "./ResearchNumberField";
import "../../styles/research-editor.css";

type BlocksUpdate = ResearchBlock[] | ((previous: ResearchBlock[]) => ResearchBlock[]);
interface Props {
  blocks: ResearchBlock[]; onChange: (value: BlocksUpdate) => void;
  onPublish: () => void; disabled: boolean; onUploadBusy: (busy: boolean) => void;
}
function insertRelative(blocks: ResearchBlock[], target: string, block: ResearchBlock, after = false): ResearchBlock[] {
  return blocks.flatMap(item => item.id === target ? after ? [item, block] : [block, item] : [{ ...item, ...(item.children ? { children: insertRelative(item.children, target, block, after) } : {}) }]);
}
function moveSibling(blocks: ResearchBlock[], id: string, direction: number): ResearchBlock[] {
  const index = blocks.findIndex(block => block.id === id);
  if (index !== -1) { const next = [...blocks]; if (next[index + direction]) [next[index], next[index + direction]] = [next[index + direction], next[index]]; return next; }
  return blocks.map(block => block.children ? { ...block, children: moveSibling(block.children, id, direction) } : block);
}
function allGroups(blocks: ResearchBlock[], depth = 0): { block: ResearchBlock; depth: number }[] {
  return blocks.flatMap(block => block.type === "accordion" ? [{ block, depth }, ...allGroups(block.children || [], depth + 1)] : []);
}
function MediaField({ kind, value, onSelect, onBrowse, onBusy }: {
  kind: "pdf" | "image"; value?: string; onSelect: (asset: MediaAsset) => void;
  onBrowse: (kind: "pdf" | "image", select: (asset: MediaAsset) => void) => void; onBusy: (busy: boolean) => void;
}) {
  const { can } = useAdminAccess(); const [busy, setBusy] = useState(false), [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const upload = async (file?: File) => {
    if (!file || busy) return;
    setBusy(true); setError(""); onBusy(true);
    try {
      if (kind === "pdf" ? file.type !== "application/pdf" : !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) throw new Error(`Choose a ${kind === "pdf" ? "PDF document" : "JPG, PNG, WebP or GIF image"}.`);
      onSelect(await uploadMedia(file));
    } catch (err) { setError(err instanceof Error ? err.message : "Upload failed. Please retry."); }
    finally { setBusy(false); onBusy(false); if (input.current) input.current.value = ""; }
  };
  return <div className="research-media-field">
    <div className="research-editor-actions"><span data-admin-module="gallery"><button type="button" className="secondary" data-admin-action="create" disabled={busy || !can("gallery", "create")} onClick={() => input.current?.click()}>{busy ? "Uploading…" : kind === "pdf" ? "Upload PDF" : "Upload image"}</button>
      <input ref={input} type="file" hidden accept={kind === "pdf" ? "application/pdf" : "image/png,image/jpeg,image/webp,image/gif"} aria-label={kind === "pdf" ? "Upload PDF file" : "Upload image file"} onChange={event => void upload(event.target.files?.[0])} />
    </span><button type="button" className="secondary" data-admin-action="view" disabled={busy} onClick={() => onBrowse(kind, onSelect)}>Media Storage</button></div>
    {value && <p className="research-attached-file">Attached: {value.split("/").pop()}</p>}
    <small>Uploads are saved in Media Storage. Maximum 10 MB per file.</small>
    {!can("gallery", "create") && <small>Uploading requires Media Storage upload permission.</small>}
    {error && <p role="alert" className="research-editor-error">{error}</p>}
  </div>;
}
function DestinationFields({ value, onChange, onBrowse, onBusy, optional = false }: {
  value: { href?: string; targetKind?: "none" | "url" | "pdf"; newTab?: boolean; mediaId?: string };
  onChange: (patch: { href?: string; targetKind?: "none" | "url" | "pdf"; newTab?: boolean; mediaId?: string }) => void;
  onBrowse: (kind: "pdf" | "image", select: (asset: MediaAsset) => void) => void; onBusy: (busy: boolean) => void; optional?: boolean;
}) {
  const kind = value.targetKind || (value.href ? "url" : optional ? "none" : "url");
  return <div className="research-destination">
    <label>Click action<select value={kind} onChange={event => onChange({ targetKind: event.target.value as "none" | "url" | "pdf", href: "", mediaId: "" })}>
      {optional && <option value="none">No link</option>}<option value="url">Website / redirection link</option><option value="pdf">PDF document</option>
    </select></label>
    {kind === "url" && <label>Destination URL<input value={value.href || ""} placeholder="https://… or /admissions" onChange={event => onChange({ href: event.target.value })} /></label>}
    {kind === "pdf" && <MediaField kind="pdf" value={value.href} onSelect={asset => onChange({ href: asset.url, mediaId: asset.id, targetKind: "pdf", newTab: true })} onBrowse={onBrowse} onBusy={onBusy} />}
    {kind !== "none" && <label className="research-editor-check"><input type="checkbox" checked={!!value.newTab} onChange={event => onChange({ newTab: event.target.checked })} />Open in a new tab</label>}
  </div>;
}

export function ResearchComponentEditor({ blocks, onChange, onPublish, disabled, onUploadBusy }: Props) {
  const [selectedId, setSelectedId] = useState(blocks[0]?.id || "");
  const [insertParentId, setInsertParentId] = useState("");
  const [preview, setPreview] = useState(false), [phone, setPhone] = useState(false);
  const [picker, setPicker] = useState<{ kind: "image" | "pdf"; select: (asset: MediaAsset) => void } | null>(null);
  const [uploads, setUploads] = useState(0);
  const [placementError, setPlacementError] = useState("");
  const resizeSession = useRef<{ id: string; x: number; y: number; width: number; height: number; container: number; fixed: boolean } | null>(null);
  const selected = findResearchBlock(blocks, selectedId) || blocks[0];
  const groups = allGroups(blocks);
  const chooseMedia = (kind: "image" | "pdf", select: (asset: MediaAsset) => void) => setPicker({ kind, select });
  const uploadBusy = (busy: boolean) => { setUploads(count => count + (busy ? 1 : -1)); onUploadBusy(busy); };
  const patch = (value: Partial<ResearchBlock>) => { if (selected) { const id = selected.id; onChange(previous => updateResearchBlock(previous, id, value)); } };
  const patchBullet = (id: string, value: Partial<ResearchBullet>) => {
    if (!selected) return; const blockId = selected.id;
    onChange(previous => { const block = findResearchBlock(previous, blockId); return updateResearchBlock(previous, blockId, { bullets: block?.bullets?.map(bullet => bullet.id === id ? { ...bullet, ...value } : bullet) }); });
  };
  const add = (type: ResearchBlockType) => {
    const added = makeResearchBlock(type);
    if (disabled) return;
    setPlacementError("");
    const parentId = groups.some(group => group.block.id === insertParentId && group.depth < 8) ? insertParentId : "";
    onChange(previous => { const parent = findResearchBlock(previous, parentId); return parent?.type === "accordion"
      ? updateResearchBlock(previous, parent.id, { children: [...(parent.children || []), added] }) : [...previous, added]; });
    setSelectedId(added.id); setPreview(false);
  };
  const remove = (id: string) => { onChange(previous => removeResearchBlock(previous, id)); if (insertParentId === id) setInsertParentId(""); };
  const moveToGroup = (parentId: string) => {
    if (!selected || disabled) return; const id = selected.id;
    if (!researchPlacementFits(blocks, selected, parentId)) { setPlacementError("This move would exceed eight nested groups."); return; }
    setPlacementError("");
    onChange(previous => { const source = findResearchBlock(previous, id); if (!source || !researchPlacementFits(previous, source, parentId)) return previous;
      const remaining = removeResearchBlock(previous, id); const parent = findResearchBlock(remaining, parentId);
      return parent ? updateResearchBlock(remaining, parentId, { children: [...(parent.children || []), source] }) : [...remaining, source]; });
  };
  const placeImage = (targetId: string, after: boolean) => {
    if (!selected) return; const id = selected.id;
    onChange(previous => { const image = findResearchBlock(previous, id); return image && id !== targetId && findResearchBlock(previous, targetId)
      ? insertRelative(removeResearchBlock(previous, id), targetId, image, after) : previous; });
  };
  const resizeHandle = (block: ResearchBlock) => <button type="button" className="research-image-resize-handle" data-admin-action="edit" aria-label="Resize photo" title="Drag to resize; arrow keys adjust width" disabled={disabled}
    onClick={event => event.stopPropagation()}
    onPointerDown={event => {
      event.preventDefault(); event.stopPropagation(); const figure = event.currentTarget.closest("figure"), area = event.currentTarget.closest(".research-editor-card-preview");
      if (!figure || !area) return; const rect = figure.getBoundingClientRect(), padding = getComputedStyle(area);
      resizeSession.current = { id: block.id, x: event.clientX, y: event.clientY, width: rect.width, height: figure.querySelector(".research-image-frame")?.getBoundingClientRect().height || rect.height, container: area.clientWidth - parseFloat(padding.paddingLeft) - parseFloat(padding.paddingRight), fixed: block.imageHeightMode === "fixed" };
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={event => { const session = resizeSession.current; if (!session) return; const width = Math.max(10, Math.min(100, Math.round((session.width + event.clientX - session.x) / session.container * 100)));
      onChange(previous => updateResearchBlock(previous, session.id, { width: "custom", imageWidthUnit: "%", imageWidth: width, ...(session.fixed ? { imageHeight: Math.max(40, Math.min(2000, Math.round(session.height + event.clientY - session.y))) } : {}) }));
    }}
    onPointerUp={event => { resizeSession.current = null; if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
    onPointerCancel={() => { resizeSession.current = null; }}
    onKeyDown={event => { if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return; event.preventDefault(); const width = block.width === "custom" && block.imageWidthUnit !== "px" ? block.imageWidth || 70 : 70;
      onChange(previous => updateResearchBlock(previous, block.id, { width: "custom", imageWidthUnit: "%", imageWidth: Math.max(10, Math.min(100, width + (event.key === "ArrowRight" ? 5 : -5))) }));
    }}>↘</button>;
  const cardList = (list: ResearchBlock[], depth = 0): React.ReactNode => list.map((block, index) => <div key={block.id} className={`research-editor-card${selected?.id === block.id ? " is-selected" : ""}${block.hidden ? " is-hidden" : ""}`} data-component-id={block.id}
    onDragOver={event => event.preventDefault()} onDrop={event => {
      event.preventDefault(); event.stopPropagation(); const id = event.dataTransfer.getData("text/research-component");
      if (!id || id === block.id || disabled) return;
      const source = findResearchBlock(blocks, id);
      if (!source) return;
      if (!researchPlacementFits(blocks, source, block.id, false)) { setPlacementError("A group cannot move inside itself or exceed eight nested groups."); return; }
      setPlacementError("");
      onChange(previous => { const current = findResearchBlock(previous, id); return !current || !researchPlacementFits(previous, current, block.id, false) ? previous : insertRelative(removeResearchBlock(previous, id), block.id, current); });
    }}>
    <div className="research-editor-card-toolbar" onClick={event => event.stopPropagation()}>
      <button type="button" className="secondary research-drag-handle" draggable disabled={disabled} data-admin-action="edit" title="Drag to reorder component" onDragStart={event => { event.dataTransfer.setData("text/research-component", block.id); event.dataTransfer.effectAllowed = "move"; }}><GripVertical size={14} /></button>
      <button type="button" className="research-component-name" data-admin-action="view" onClick={() => setSelectedId(block.id)}>{RESEARCH_COMPONENTS.find(item => item.type === block.type)?.label}{block.hidden ? " · Hidden" : ""}</button>
      <div className="research-editor-actions">
        <button type="button" className="secondary" data-admin-action="edit" aria-label="Move component up" disabled={index === 0 || disabled} onClick={() => onChange(previous => moveSibling(previous, block.id, -1))}><ArrowUp size={13} /></button>
        <button type="button" className="secondary" data-admin-action="edit" aria-label="Move component down" disabled={index === list.length - 1 || disabled} onClick={() => onChange(previous => moveSibling(previous, block.id, 1))}><ArrowDown size={13} /></button>
        <button type="button" className="secondary" data-admin-action="create" aria-label="Duplicate component" disabled={disabled} onClick={() => { const copied = copyResearchBlock(block); onChange(previous => insertRelative(previous, block.id, copied, true)); setSelectedId(copied.id); }}><Copy size={13} /></button>
        <button type="button" className="secondary" data-admin-action="edit" aria-label={block.hidden ? "Show component" : "Hide component"} disabled={disabled} onClick={() => onChange(previous => updateResearchBlock(previous, block.id, { hidden: !block.hidden }))}>{block.hidden ? <Eye size={13} /> : <EyeOff size={13} />}</button>
        <button type="button" className="secondary" data-admin-action="delete" aria-label="Remove component" disabled={disabled} onClick={() => remove(block.id)}><Trash2 size={13} /></button>
      </div>
    </div>
    <div className="research-editor-card-preview" onClick={event => { event.stopPropagation(); setSelectedId(block.id); }}>
      {block.type === "accordion" ? <div className="research-editor-group"><strong>{block.text}</strong>{depth < 8 && cardList(block.children || [], depth + 1)}<button type="button" className="secondary" data-admin-action="view" disabled={depth >= 8 || disabled} onClick={event => { event.stopPropagation(); setSelectedId(block.id); setInsertParentId(block.id); }}>Add inside this group</button></div> : <ResearchBlockContent block={block} editing showHidden resizeHandle={block.type === "image" && selected?.id === block.id && block.imageUrl ? resizeHandle(block) : undefined} />}
    </div>
  </div>);
  const selectedLabel = RESEARCH_COMPONENTS.find(item => item.type === selected?.type)?.label;
  return <section className="research-admin-card research-component-editor">
    <div className="research-admin-section-title"><div><h3>Build this section</h3><p>Add components, arrange them in any order and publish when ready.</p></div><div className="research-editor-actions">
      <button type="button" className="secondary" data-admin-action="view" onClick={() => setPreview(!preview)}>{preview ? "Edit components" : "Preview"}</button>
      <button type="button" data-admin-action="publish" disabled={disabled || uploads > 0} onClick={onPublish}>{uploads > 0 ? "Uploading…" : "Save & publish content"}</button>
    </div></div>
    {placementError && <p role="alert" className="research-editor-error">{placementError}</p>}
    <div className="research-editor-workspace">
      <aside className="research-component-library"><h4>Components</h4><label>Add to<select value={groups.some(group => group.block.id === insertParentId && group.depth < 8) ? insertParentId : ""} onChange={event => setInsertParentId(event.target.value)}><option value="">End of section</option>{groups.filter(group => group.depth < 8).map(({ block }) => <option key={block.id} value={block.id}>Inside: {block.text}</option>)}</select></label>
        {RESEARCH_COMPONENTS.map(item => <button key={item.type} type="button" className="research-library-button" data-admin-action="create" data-component-type={item.type} disabled={disabled} title={item.hint} onClick={() => add(item.type)}><span aria-hidden="true">{item.symbol}</span><span>{item.label}</span></button>)}
      </aside>
      <div className={`research-component-canvas${phone ? " is-phone" : ""}`}>
        <div className="research-editor-canvas-heading"><span>{preview ? "Content preview" : "Content order"}</span><button type="button" className="secondary" data-admin-action="view" onClick={() => setPhone(!phone)}>{phone ? "Desktop" : "Phone"}</button></div>
        {blocks.length === 0 ? <div className="research-editor-empty"><strong>Start building your content</strong><p>Select a heading, bullet list, button or image from Components.</p></div> : preview ? <ResearchBlocks blocks={blocks} editing /> : cardList(blocks)}
      </div>
      {!preview && <aside className="research-component-properties"><h4>{selectedLabel ? `${selectedLabel} properties` : "Component properties"}</h4>
        {selected ? <div key={selected.id} className="research-property-fields">
          {["heading", "text", "button", "accordion"].includes(selected.type) && <label>{selected.type === "button" ? "Button label" : selected.type === "text" ? "Paragraph text" : "Heading text"}{selected.type === "text" ? <textarea rows={5} value={selected.text || ""} onChange={event => patch({ text: event.target.value })} /> : <input value={selected.text || ""} onChange={event => patch({ text: event.target.value })} />}</label>}
          {selected.type === "heading" && <label>Heading size<select value={selected.level || "h3"} onChange={event => patch({ level: event.target.value as ResearchBlock["level"] })}><option value="h2">Large heading</option><option value="h3">Medium heading</option><option value="h4">Small heading</option></select></label>}
          {selected.type === "bullets" && <>
            {(selected.bullets || []).map((bullet, index) => <details key={bullet.id} className="research-bullet-editor" data-bullet-index={index} open><summary>Bullet {index + 1}</summary><label>Bullet text<input value={bullet.text} onChange={event => patchBullet(bullet.id, { text: event.target.value })} /></label>
              <label>Description (optional)<textarea rows={2} value={bullet.description || ""} onChange={event => patchBullet(bullet.id, { description: event.target.value })} /></label>
              <label>Badge (optional)<input value={bullet.badge || ""} maxLength={100} placeholder="e.g. NEW" onChange={event => patchBullet(bullet.id, { badge: event.target.value })} /></label>
              <DestinationFields value={bullet} optional onChange={value => patchBullet(bullet.id, value)} onBrowse={chooseMedia} onBusy={uploadBusy} />
              <label className="research-editor-check"><input type="checkbox" checked={!!bullet.hidden} onChange={event => patchBullet(bullet.id, { hidden: event.target.checked })} />Hide this bullet</label>
              <div className="research-editor-actions"><button type="button" className="secondary" data-admin-action="edit" aria-label={`Move bullet ${index + 1} up`} disabled={index === 0} onClick={() => { const rows = [...(selected.bullets || [])]; [rows[index - 1], rows[index]] = [rows[index], rows[index - 1]]; patch({ bullets: rows }); }}><ArrowUp size={13} /></button>
                <button type="button" className="secondary" data-admin-action="edit" aria-label={`Move bullet ${index + 1} down`} disabled={index === (selected.bullets?.length || 0) - 1} onClick={() => { const rows = [...(selected.bullets || [])]; [rows[index], rows[index + 1]] = [rows[index + 1], rows[index]]; patch({ bullets: rows }); }}><ArrowDown size={13} /></button>
                <button type="button" className="secondary" data-admin-action="delete" onClick={() => patch({ bullets: selected.bullets?.filter(row => row.id !== bullet.id) })}>Remove bullet</button></div>
            </details>)}
            <button type="button" className="secondary" data-admin-action="create" onClick={() => patch({ bullets: [...(selected.bullets || []), { id: crypto.randomUUID(), text: "New bullet point", targetKind: "none" }] })}>Add bullet point</button>
          </>}
          {selected.type === "button" && <><DestinationFields value={selected} onChange={patch} onBrowse={chooseMedia} onBusy={uploadBusy} /><label>Button style<select value={selected.variant || "primary"} onChange={event => patch({ variant: event.target.value as ResearchBlock["variant"] })}><option value="primary">Navy</option><option value="outline">Outline</option></select></label></>}
          {selected.type === "image" && <><MediaField kind="image" value={selected.imageUrl} onSelect={asset => patch({ imageUrl: asset.url, mediaId: asset.id, alt: asset.alt || asset.originalName })} onBrowse={chooseMedia} onBusy={uploadBusy} />
            <label>Image description (alt text)<input value={selected.alt || ""} onChange={event => patch({ alt: event.target.value })} /></label><label>Caption<textarea rows={2} value={selected.caption || ""} onChange={event => patch({ caption: event.target.value })} /></label>
            <ResearchImageProperties block={selected} blocks={blocks} onChange={patch} onPlace={placeImage} />
            <DestinationFields value={selected} optional onChange={patch} onBrowse={chooseMedia} onBusy={uploadBusy} />
          </>}
          {selected.type === "accordion" && <button type="button" className="secondary" data-admin-action="view" disabled={!groups.some(group => group.block.id === selected.id && group.depth < 8)} onClick={() => setInsertParentId(selected.id)}>Add components inside this group</button>}
          {selected.type === "spacer" && <ResearchNumberField label="Height (pixels)" value={selected.space || 32} min={8} max={160} onChange={space => patch({ space })} />}
          <label>Move component to<select value="" onChange={event => { if (event.target.value) moveToGroup(event.target.value === "root" ? "" : event.target.value); }}><option value="">Choose destination…</option><option value="root">End of section</option>{groups.filter(({ block }) => researchPlacementFits(blocks, selected, block.id)).map(({ block }) => <option key={block.id} value={block.id}>Inside: {block.text}</option>)}</select></label>
          <label className="research-editor-check"><input type="checkbox" checked={!!selected.hidden} onChange={event => patch({ hidden: event.target.checked })} />Hide component</label>
        </div> : <p>Select or add a component to edit its properties.</p>}
      </aside>}
    </div>
    {picker && <MediaPicker type={picker.kind} onSelect={asset => { picker.select(asset); setPicker(null); }} onClose={() => setPicker(null)} />}
  </section>;
}
