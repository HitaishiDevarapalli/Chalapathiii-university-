import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronRight, Copy, ExternalLink, FileText, Folder, FolderPlus, HardDrive, Image as ImageIcon, Pencil, Search, Trash2, UploadCloud, X } from "lucide-react";
import { useAdminAccess } from "../../security/adminAccess";
import "../../styles/media-storage.css";

export interface MediaAsset {
  id: string; url: string; originalName: string; mime: string; size: number;
  alt: string; width?: number | null; height?: number | null; folderId?: string | null; createdAt: string;
}
interface MediaFolder { id: string; name: string; parentId: string | null; _count?: { files: number; children: number } }
type MediaType = "all" | "image" | "pdf";
const sizeLabel = (bytes: number) => bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
export async function mediaRequest<T = any>(path = "", method = "GET", body?: unknown): Promise<T> {
  const response = await fetch("/api/media" + path, { method, credentials: "same-origin", cache: "no-store",
    headers: body === undefined || body instanceof FormData ? {} : { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: body instanceof FormData ? body : JSON.stringify(body) }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Media Storage could not complete this request.");
  return data;
}
export function uploadMedia(file: File, folderId?: string | null): Promise<MediaAsset> {
  const form = new FormData(); form.append("file", file);
  if (folderId) form.append("folderId", folderId);
  return mediaRequest("", "POST", form);
}

export function MediaBrowser({ onSelect, type = "all" }: { onSelect?: (asset: MediaAsset) => void; type?: MediaType }) {
  const { can } = useAdminAccess();
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [folder, setFolder] = useState("all");
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState<MediaType>(type);
  const [page, setPage] = useState(1); const [version, setVersion] = useState(0);
  const [assets, setAssets] = useState<MediaAsset[]>([]); const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true); const [busy, setBusy] = useState(false);
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [newFolder, setNewFolder] = useState(false); const [folderName, setFolderName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [detail, setDetail] = useState<MediaAsset | null>(null);
  const [deleting, setDeleting] = useState<MediaAsset | null>(null);
  const [copied, setCopied] = useState(""); const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null); const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const detailPanel = useRef<HTMLElement>(null);
  const selectedFolder = folders.find(item => item.id === folder);
  const isFolder = folder !== "all" && folder !== "unfiled";
  const folderPath = (id: string | null): MediaFolder[] => {
    const path: MediaFolder[] = []; const seen = new Set<string>();
    while (id && !seen.has(id)) { seen.add(id); const item = folders.find(row => row.id === id); if (!item) break; path.unshift(item); id = item.parentId; }
    return path;
  };
  const refresh = () => setVersion(value => value + 1);
  useEffect(() => { if (detail) detailPanel.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, [detail?.id]);
  useEffect(() => () => { if (copyTimer.current) clearTimeout(copyTimer.current); }, []);
  useEffect(() => {
    let active = true;
    mediaRequest<{ folders: MediaFolder[] }>("/folders").then(result => { if (active) setFolders(result.folders); }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [version]);
  useEffect(() => {
    let active = true; setLoading(true); setAssets([]);
    const timer = setTimeout(() => {
      const query = new URLSearchParams({ folder, search, type: filter, page: String(page) });
      mediaRequest<{ items: MediaAsset[]; total: number }>("?" + query).then(result => {
        if (active) { setAssets(result.items); setTotal(result.total); }
      }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    }, 150);
    return () => { active = false; clearTimeout(timer); };
  }, [folder, search, filter, page, version]);
  const openFolder = (id: string) => { setFolder(id); setPage(1); setDetail(null); setSearch(""); setError(""); setNewFolder(false); setRenaming(false); };
  const operation = async (run: () => Promise<unknown>, message: string) => {
    setBusy(true); setError(""); setNotice("");
    try { await run(); setNotice(message); refresh(); return true; }
    catch (err: any) { setError(err.message); return false; }
    finally { setBusy(false); }
  };
  const uploadFiles = async (files: File[]) => {
    if (!files.length || busy || !can("gallery", "create")) return;
    setBusy(true); setError(""); setNotice("");
    let uploaded = 0; const failures: string[] = [];
    for (let i = 0; i < files.length; i++) {
      setNotice(`Uploading ${i + 1} of ${files.length}: ${files[i].name}`);
      try { await uploadMedia(files[i], isFolder ? folder : null); uploaded++; }
      catch (err: any) { failures.push(`${files[i].name}: ${err.message}`); }
    }
    setNotice(`${uploaded} ${uploaded === 1 ? "file" : "files"} added to ${selectedFolder?.name || "Unfiled"}.`);
    if (failures.length) setError(failures.join(" · "));
    setBusy(false); setPage(1); refresh();
  };
  const copyLink = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(new URL(asset.url, location.origin).href); setCopied(asset.id);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(""), 2000);
    } catch { setDetail(asset); setNotice("Select and copy the unique link in File details."); }
  };
  const deleteAsset = async () => {
    if (!deleting || busy || !can("gallery", "delete")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await mediaRequest<{ success: boolean; warning?: string }>("/" + deleting.id, "DELETE");
      if (detail?.id === deleting.id) setDetail(null);
      setAssets(items => items.filter(item => item.id !== deleting.id));
      setTotal(value => Math.max(0, value - 1));
      setPage(value => Math.min(value, Math.max(1, Math.ceil((total - 1) / 40))));
      setDeleting(null); setNotice(result.warning || "File permanently deleted from the database and storage."); refresh();
    } catch (err: any) { setError(err.message); }
    finally { setBusy(false); }
  };
  const requestDelete = (asset: MediaAsset) => { setError(""); setDeleting(asset); };
  const tree = (parentId: string | null, depth = 0): React.ReactNode => folders.filter(item => item.parentId === parentId).map(item =>
    <React.Fragment key={item.id}><button type="button" data-admin-action="view" aria-current={folder === item.id ? "location" : undefined}
      style={{ paddingLeft: 14 + depth * 15 }} onClick={() => openFolder(item.id)} title={folderPath(item.id).map(row => row.name).join(" / ")}>
      <Folder size={17} /><span>{item.name}</span><small>{item._count?.files || 0}</small></button>{depth < 16 && tree(item.id, depth + 1)}</React.Fragment>);
  return <div ref={root} className={"media-storage " + (onSelect ? "is-picker" : "")} onDragOver={event => {
    if (can("gallery", "create") && event.dataTransfer.types.includes("Files")) { event.preventDefault(); setDragging(true); }
  }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }} onDrop={event => {
    event.preventDefault(); setDragging(false); void uploadFiles(Array.from(event.dataTransfer.files));
  }}>
    <div className="media-heading"><div><span className="media-eyebrow"><HardDrive size={15} /> University assets</span>
      {!onSelect && <h1>Media Storage</h1>}<p>{onSelect ? "Choose a stored file to add it to your page." : "Organize college photos in folders and reuse them across your website."}</p></div>
      <div className="media-actions">{can("gallery", "create") && <>
        <button type="button" className="admin-button admin-button-secondary" disabled={busy} onClick={() => { setNewFolder(!newFolder); setRenaming(false); setFolderName(""); }}><FolderPlus size={17} />New folder</button>
        <button type="button" className="admin-button admin-button-primary" disabled={busy} onClick={() => input.current?.click()}><UploadCloud size={17} />{busy ? "Working…" : "Upload files"}</button>
        <input ref={input} type="file" aria-label="Upload to Media Storage" multiple accept={filter === "image" ? "image/png,image/jpeg,image/webp,image/gif" : filter === "pdf" ? "application/pdf" : "image/png,image/jpeg,image/webp,image/gif,application/pdf"} hidden onChange={event => { void uploadFiles(Array.from(event.target.files || [])); event.target.value = ""; }} />
      </>}</div></div>
    {error && <div role="alert" className="media-error">{error}</div>}{notice && <div role="status" className="media-notice">{notice}</div>}
    <div className="media-layout"><aside className="media-folders" aria-label="Media folders">
      <strong>Storage folders</strong><button type="button" data-admin-action="view" aria-current={folder === "all" ? "location" : undefined} onClick={() => openFolder("all")}><HardDrive size={17} /><span>All files</span></button>
      <button type="button" data-admin-action="view" aria-current={folder === "unfiled" ? "location" : undefined} onClick={() => openFolder("unfiled")}><ImageIcon size={17} /><span>Unfiled</span></button>{tree(null)}
      <p>JPG, PNG, WebP, GIF and PDF. Images are optimized for the website.</p></aside>
      <section className="media-main" aria-label="Stored media">
        <div className="media-toolbar"><nav aria-label="Folder location"><button type="button" data-admin-action="view" onClick={() => openFolder("all")}>Media Storage</button>
          {folder === "unfiled" && <><ChevronRight size={14} /><span>Unfiled</span></>}{isFolder && folderPath(folder).map(row => <React.Fragment key={row.id}><ChevronRight size={14} /><button type="button" data-admin-action="view" onClick={() => openFolder(row.id)}>{row.name}</button></React.Fragment>)}</nav>
          {selectedFolder && can("gallery", "edit") && <button type="button" className="media-text-button" onClick={() => { setFolderName(selectedFolder.name); setRenaming(true); setNewFolder(true); }}>Rename folder</button>}
          {selectedFolder && can("gallery", "delete") && selectedFolder._count?.files === 0 && selectedFolder._count?.children === 0 && <button type="button" className="media-text-button" disabled={busy} onClick={async () => {
            const parent = selectedFolder.parentId || "all";
            if (await operation(() => mediaRequest("/folders/" + folder, "DELETE"), "Empty folder removed.")) openFolder(parent);
          }}>Remove empty folder</button>}
        </div>
        {newFolder && <form className="media-folder-form" onSubmit={async event => { event.preventDefault();
          if (await operation(() => renaming ? mediaRequest("/folders/" + folder, "PATCH", { name: folderName }) : mediaRequest("/folders", "POST", { name: folderName, parentId: isFolder ? folder : null }), renaming ? "Folder renamed." : "Folder created.")) { setNewFolder(false); setFolderName(""); }
        }}><label>{renaming ? "Folder name" : `New folder in ${selectedFolder?.name || "Media Storage"}`}<input autoFocus required maxLength={200} value={folderName} onChange={event => setFolderName(event.target.value)} /></label>
          <button type="submit" data-admin-action={renaming ? "edit" : "create"} className="admin-button admin-button-primary" disabled={busy}>{renaming ? "Save name" : "Create folder"}</button><button type="button" className="media-text-button" data-admin-action="view" onClick={() => setNewFolder(false)}>Cancel</button></form>}
        <div className="media-filters" data-admin-filter><label><Search size={17} /><input type="search" aria-label="Search Media Storage" placeholder="Search file names or descriptions…" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} /></label>
          {type === "all" && <select aria-label="Media file type" value={filter} onChange={event => { setFilter(event.target.value as MediaType); setPage(1); }}><option value="all">All file types</option><option value="image">Photos</option><option value="pdf">PDF documents</option></select>}
          <span>{total} {total === 1 ? "file" : "files"}</span></div>
        {!search && folder !== "unfiled" && <div className="media-child-folders">{folders.filter(row => row.parentId === (isFolder ? folder : null)).map(row => <button type="button" key={row.id} data-admin-action="view" onClick={() => openFolder(row.id)}><Folder size={22} /><span>{row.name}<small>{row._count?.files || 0} files</small></span><ChevronRight size={16} /></button>)}</div>}
        {loading ? <div className="media-empty" role="status">Loading Media Storage…</div> : assets.length ? <div className="media-grid">{assets.map(asset => <article className="media-card" key={asset.id}>
          <button type="button" className="media-thumbnail" data-admin-action="view" aria-label={(onSelect ? "Use " : "View ") + asset.originalName} onClick={() => onSelect ? onSelect(asset) : setDetail(asset)}>
            {asset.mime.startsWith("image/") ? <img src={asset.url} alt={asset.alt || asset.originalName} loading="lazy" /> : <FileText size={44} />}{onSelect && <span>Use {asset.mime.startsWith("image/") ? "photo" : "document"}</span>}</button>
          <div className="media-card-info"><strong title={asset.originalName}>{asset.originalName}</strong><small>{asset.width ? `${asset.width} × ${asset.height} · ` : "PDF · "}{sizeLabel(asset.size)}</small>
            <div><button type="button" className="media-text-button" data-admin-action="view" aria-label={"Copy link for " + asset.originalName} onClick={() => void copyLink(asset)}>{copied === asset.id ? <Check size={14} /> : <Copy size={14} />}{copied === asset.id ? "Copied" : "Copy link"}</button>
              <button type="button" className="media-text-button" data-admin-action="view" onClick={() => setDetail(asset)}>Details</button></div>
            <div className="media-card-mutations">{can("gallery", "edit") && <button type="button" className="media-text-button" data-admin-action="edit" disabled={busy} aria-label={"Edit " + asset.originalName} onClick={() => setDetail(asset)}><Pencil size={14} />Edit</button>}
              {can("gallery", "delete") && <button type="button" className="media-text-button media-danger" data-admin-action="delete" disabled={busy} aria-label={"Delete " + asset.originalName} onClick={() => requestDelete(asset)}><Trash2 size={14} />Delete</button>}</div></div>
        </article>)}</div> : <div className="media-empty"><ImageIcon size={36} /><h3>{search ? "No matching files" : "No files here yet"}</h3><p>{search ? "Try a different name or folder." : "Upload college photos here, then choose them from any page editor."}</p></div>}
        {!loading && total > 40 && <div className="media-pagination"><button type="button" data-admin-action="view" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page} of {Math.ceil(total / 40)}</span><button type="button" data-admin-action="view" disabled={page * 40 >= total} onClick={() => setPage(value => value + 1)}>Next</button></div>}
        {detail && <section ref={detailPanel} className="media-detail" aria-label="File details"><div className="media-detail-heading"><h3>File details</h3><button type="button" data-admin-action="view" aria-label="Close file details" onClick={() => setDetail(null)}><X size={18} /></button></div>
          <label>Unique link<input readOnly aria-label="Unique media link" value={new URL(detail.url, location.origin).href} onFocus={event => event.target.select()} /></label>
          <div className="media-actions"><button type="button" className="admin-button admin-button-secondary" data-admin-action="view" onClick={() => void copyLink(detail)}><Copy size={15} />Copy link</button><a href={detail.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} />Open file</a>{onSelect && <button type="button" className="admin-button admin-button-primary" data-admin-action="view" onClick={() => onSelect(detail)}>Use this file</button>}</div>
          {can("gallery", "edit") && <form onSubmit={async event => { event.preventDefault(); if (await operation(() => mediaRequest("/" + detail.id, "PATCH", { originalName: detail.originalName, alt: detail.alt, folderId: detail.folderId || null }), "File details saved. Its link is unchanged.")) setDetail(null); }}>
            <label>File name<input required maxLength={200} value={detail.originalName} onChange={event => setDetail({ ...detail, originalName: event.target.value })} /></label><label>Alternative text<input maxLength={500} value={detail.alt} onChange={event => setDetail({ ...detail, alt: event.target.value })} /></label>
            <label>Folder<select aria-label="Move file to folder" value={detail.folderId || ""} onChange={event => setDetail({ ...detail, folderId: event.target.value || null })}><option value="">Unfiled</option>{folders.map(row => <option key={row.id} value={row.id}>{folderPath(row.id).map(item => item.name).join(" / ")}</option>)}</select></label>
            <button type="submit" data-admin-action="edit" className="admin-button admin-button-primary" disabled={busy}>Save file details</button></form>}
          {can("gallery", "delete") && <button type="button" className="media-text-button media-danger" data-admin-action="delete" disabled={busy} onClick={() => requestDelete(detail)}><Trash2 size={15} />Delete file permanently</button>}
          <p>Added {new Date(detail.createdAt).toLocaleDateString("en-IN")}. Folder and name changes keep the same public link.</p>
        </section>}
      </section></div>{dragging && <div className="media-drop-overlay"><UploadCloud size={40} /><strong>Drop files to upload</strong><span>{selectedFolder?.name || "Unfiled"}</span></div>}
    {deleting && <MediaDeleteDialog asset={deleting} busy={busy} error={error} onCancel={() => setDeleting(null)} onConfirm={() => void deleteAsset()} />}
  </div>;
}

function MediaDeleteDialog({ asset, busy, error, onCancel, onConfirm }: { asset: MediaAsset; busy: boolean; error: string; onCancel: () => void; onConfirm: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const callbacks = useRef({ busy, onCancel }); callbacks.current = { busy, onCancel };
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow; document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); if (!callbacks.current.busy) callbacks.current.onCancel(); }
      if (event.key !== "Tab") return;
      const buttons = Array.from(dialog.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") || []);
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", key, true);
    return () => { document.removeEventListener("keydown", key, true); document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, []);
  return createPortal(<div className="media-picker-backdrop"><div ref={dialog} className="media-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="media-delete-title" aria-describedby="media-delete-description" aria-busy={busy}>
    <h2 id="media-delete-title">Permanently delete this file?</h2><strong>{asset.originalName}</strong>
    <p id="media-delete-description">This removes the database record and stored file. Any website pages using its link will lose this image or download. This cannot be undone.</p>
    {error && <p className="media-error" role="alert">{error}</p>}
    <div className="media-actions"><button type="button" disabled={busy} onClick={onCancel}>Cancel</button><button type="button" className="media-delete-confirm" disabled={busy} onClick={onConfirm}>{busy ? "Deleting…" : "Delete permanently"}</button></div>
  </div></div>, document.body);
}

export function MediaPicker({ onSelect, onClose, type = "image" }: { onSelect: (asset: MediaAsset) => void; onClose: () => void; type?: MediaType }) {
  const dialog = useRef<HTMLDivElement>(null); const closeRef = useRef(onClose); closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null; const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; dialog.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (document.querySelector(".media-delete-dialog")) return;
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); closeRef.current(); }
      if (event.key !== "Tab") return;
      const focusable = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not([hidden]):not(:disabled), select:not(:disabled), a[href]') || []).filter(el => el.getClientRects().length);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", key, true);
    return () => { document.removeEventListener("keydown", key, true); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return createPortal(<div className="media-picker-backdrop"><div ref={dialog} className="media-picker-dialog" tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="media-picker-title">
    <div className="media-picker-header"><h2 id="media-picker-title"><HardDrive size={21} />Choose from Media Storage</h2><button type="button" aria-label="Close Media Storage" onClick={onClose}><X size={22} /></button></div>
    <MediaBrowser type={type} onSelect={asset => { onSelect(asset); onClose(); }} />
  </div></div>, document.body);
}
export function MediaBrowseButton({ onSelect, type = "image", label = "Browse Media Storage" }: { onSelect: (asset: MediaAsset) => void; type?: MediaType; label?: string }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" className="media-browse-button" data-admin-action="view" onClick={() => setOpen(true)}><Folder size={15} />{label}</button>{open && <MediaPicker onSelect={onSelect} type={type} onClose={() => setOpen(false)} />}</>;
}
