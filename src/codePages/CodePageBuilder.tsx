import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Plus,
  UploadCloud,
  FileText,
  Eye,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Search,
  Trash2,
  X,
  Settings,
  Undo2,
} from "lucide-react";
import { useAdminAccess, formatIST } from "../security/adminAccess";
import {
  SOCIAL_IMAGE_HELP,
  SOCIAL_IMAGE_MIMES,
  normalizeSocialImage,
  socialImageError,
} from "../../server/src/codePages/seo";
import {
  CodeDocument,
  CodeRecord,
  CodeVersion,
  Integration,
  codeApi,
  uploadCode,
  newSettings,
  bytes,
} from "./model";
import "./codePages.css";

function Dialog({
  title,
  children,
  close,
}: {
  title: string;
  children: React.ReactNode;
  close: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const items = ref.current?.querySelectorAll<HTMLElement>(
          "button:not(:disabled), input:not(:disabled), select, textarea, a[href]",
        );
        if (!items?.length) return;
        if (
          event.shiftKey &&
          (document.activeElement === items[0] ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault();
          items[items.length - 1].focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === items[items.length - 1]
        ) {
          event.preventDefault();
          items[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, []);
  return (
    <div className="cp-modal-backdrop">
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="cp-modal"
      >
        <div className="cp-modal-heading">
          <h2>{title}</h2>
          <button onClick={close} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
type Preview = { token: string; revision: number; url: string };
type Confirm = {
  title: string;
  message: string;
  route?: string;
  label: string;
  action: string;
  run: () => Promise<void>;
};
export default function CodePageBuilder() {
  const { can } = useAdminAccess();
  const [items, setItems] = useState<CodeRecord[]>([]),
    [total, setTotal] = useState(0),
    [page, setPage] = useState(1),
    [filter, setFilter] = useState("all"),
    [search, setSearch] = useState("");
  const [record, setRecord] = useState<CodeRecord | null>(null),
    [doc, setDoc] = useState<CodeDocument | null>(null),
    [edits, setEdits] = useState<Record<string, string>>({});
  const [tab, setTab] = useState("files"),
    [filePath, setFilePath] = useState(""),
    [busy, setBusy] = useState(""),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false),
    [name, setName] = useState(""),
    [refresh, setRefresh] = useState(0),
    [loading, setLoading] = useState(false),
    [progress, setProgress] = useState<number | null>(null);
  const [destinations, setDestinations] = useState<{
    menus: { id: string; label: string; path: string }[];
    routes: string[];
  }>({ menus: [], routes: [] });
  const [preview, setPreview] = useState<Preview | null>(null),
    [frameKey, setFrameKey] = useState(0),
    [device, setDevice] = useState(1280),
    [logs, setLogs] = useState<string[]>([]),
    [rendered, setRendered] = useState(false);
  const [versions, setVersions] = useState<CodeVersion[]>([]),
    [comparison, setComparison] = useState<{
      version: CodeVersion;
      document: CodeDocument;
    } | null>(null);
  const [confirmation, setConfirmation] = useState<Confirm | null>(null),
    [confirmText, setConfirmText] = useState(""),
    [summary, setSummary] = useState<any>(null);
  const frame = useRef<HTMLIFrameElement>(null),
    previewBox = useRef<HTMLDivElement>(null),
    uploadInput = useRef<HTMLInputElement>(null);
  const socialImageInput = useRef<HTMLInputElement>(null);
  const [socialImageTouched, setSocialImageTouched] = useState(false);
  const imageError = doc
    ? socialImageError(doc.seo.image, doc.package.files)
    : undefined;
  const zipImages =
    doc?.package.files.filter((file) => SOCIAL_IMAGE_MIMES.has(file.mime)) ||
    [];
  const dirty =
    !!record &&
    !!doc &&
    (JSON.stringify(record.document) !== JSON.stringify(doc) ||
      Object.keys(edits).length > 0);
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const accept = (value: CodeRecord) => {
    setRecord(value);
    setDoc(structuredClone(value.document));
    setEdits({});
    setSocialImageTouched(false);
    setPreview(null);
    setRendered(false);
    setFilePath((current) =>
      value.document.package.files.some((f) => f.path === current)
        ? current
        : value.document.package.entry,
    );
  };
  const work = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    setError("");
    setNotice("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operation failed");
    } finally {
      setBusy("");
    }
  };
  useEffect(() => {
    let active = true;
    setLoading(true);
    codeApi(
      `?page=${page}&status=${filter}&search=${encodeURIComponent(search)}`,
    )
      .then((data) => {
        if (active) {
          setItems(data.items);
          setTotal(data.total);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, filter, search, refresh]);
  useEffect(() => {
    codeApi("/destinations")
      .then(setDestinations)
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
  useEffect(() => {
    if (!preview || !record) return;
    let marked = false;
    const handler = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        event.origin !== "null" ||
        event.data?.type !== "code-page" ||
        event.data.channel !== preview.token
      )
        return;
      if (event.data.kind === "error")
        setLogs((v) => [
          ...v.slice(-49),
          String(event.data.message).slice(0, 500),
        ]);
      if (event.data.kind === "loaded") {
        if (marked) return;
        marked = true;
        setRendered(true);
        codeApi<CodeRecord>(`/${record.id}/previewed`, "POST", {
          revision: preview.revision,
          token: preview.token,
        })
          .then((value) => {
            setRecord((current) =>
              current?.id === value.id && current.revision === value.revision
                ? { ...current, stage: value.stage }
                : current,
            );
          })
          .catch((e) => setError(e.message));
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [preview, record?.id]);
  useEffect(() => {
    if (tab === "history" && record)
      codeApi<CodeVersion[]>(`/${record.id}/versions`)
        .then(setVersions)
        .catch((e) => setError(e.message));
  }, [tab, record?.id, record?.revision]);
  const save = async () => {
    if (!record || !doc) throw new Error("Open a page first");
    if (!dirty) return record;
    if (imageError) {
      setSocialImageTouched(true);
      setTab("integration");
      requestAnimationFrame(() => {
        socialImageInput.current?.scrollIntoView({ block: "center" });
        socialImageInput.current?.focus({ preventScroll: true });
      });
      throw new Error(`Check the social-sharing image. ${imageError}`);
    }
    const value = await codeApi<CodeRecord>(`/${record.id}`, "PUT", {
      revision: record.revision,
      document: doc,
      files: edits,
      entry: doc.package.entry,
    });
    accept(value);
    setNotice(
      "Draft saved. Preview and approve this revision before publishing.",
    );
    setRefresh((v) => v + 1);
    return value;
  };
  const open = (id: string) =>
    void work("Loading page", async () => {
      accept(await codeApi(`/${id}`));
      setTab("files");
      setComparison(null);
    });
  const closePage = () => {
    const close = async () => {
      setRecord(null);
      setDoc(null);
      setEdits({});
      setRefresh((v) => v + 1);
    };
    if (dirty)
      setConfirmation({
        title: "Discard unsaved changes?",
        message:
          "Your last saved draft and published release will remain available.",
        label: "Discard changes",
        action: "edit",
        run: close,
      });
    else void close();
  };
  const patch = (values: Partial<CodeDocument>) => {
    setDoc((current) => (current ? { ...current, ...values } : current));
  };
  const integration = (values: Partial<Integration>) => {
    if (doc) patch({ integration: { ...doc.integration, ...values } });
  };
  const showPreview = () =>
    void work("Preparing isolated preview", async () => {
      const current = await save();
      const result = await codeApi<Preview>(`/${current.id}/preview`, "POST", {
        revision: current.revision,
      });
      setPreview(result);
      setLogs([]);
      setRendered(false);
      setFrameKey((v) => v + 1);
      setTab("preview");
    });
  const upload = async (file: File) => {
    if (!record) return;
    if (!file.name.toLowerCase().endsWith(".zip")) {
      setError("Choose a ZIP archive");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("The ZIP must be 20 MB or smaller");
      return;
    }
    await work("Uploading and validating archive", async () => {
      const current = await save();
      setProgress(0);
      try {
        accept(
          await uploadCode(current.id, current.revision, file, setProgress),
        );
        setNotice(
          "Archive processed. Review validation results, then preview the draft.",
        );
        setTab("files");
        setRefresh((v) => v + 1);
      } finally {
        setProgress(null);
      }
    });
  };
  const publishSummary = () =>
    void work("Checking publication", async () => {
      if (!record) return;
      if (dirty)
        throw new Error("Save, preview and approve your changed draft first.");
      setSummary(await codeApi(`/${record.id}/summary`));
      setConfirmText("");
    });
  const announce = () => window.dispatchEvent(new Event("builder-published"));
  const confirm = (value: Confirm) => {
    setConfirmText("");
    setConfirmation(value);
  };
  const action = (kind: "unpublish" | "delete") => {
    if (!record) return;
    const current = record;
    confirm({
      title:
        kind === "delete"
          ? "Delete this unpublished draft?"
          : "Unpublish this page?",
      message:
        kind === "delete"
          ? "This deletes the draft and its version history."
          : "The code page and its menu entry will be removed. A replaced original page or homepage will become visible again.",
      label: kind === "delete" ? "Delete Draft" : "Unpublish",
      action: kind === "delete" ? "delete" : "publish",
      run: async () => {
        const value = await codeApi(
          `/${current.id}${kind === "delete" ? "" : "/unpublish"}`,
          kind === "delete" ? "DELETE" : "POST",
          { revision: current.revision, confirm: true },
        );
        if (kind === "delete") {
          setRecord(null);
          setDoc(null);
        } else accept(value);
        setRefresh((v) => v + 1);
        announce();
      },
    });
  };
  const rollback = (version: CodeVersion) => {
    if (!record) return;
    const current = record;
    const replacement = ["replace", "homepage"].includes(
      version.integration.mode,
    );
    confirm({
      title: "Roll back the published page?",
      message: `Restore revision ${version.revision}, including its route, source files and menu placement. Any unsaved edits will be discarded.`,
      route: replacement ? version.integration.route : undefined,
      label: "Roll Back",
      action: "publish",
      run: async () => {
        accept(
          await codeApi(`/${current.id}/rollback`, "POST", {
            revision: current.revision,
            versionId: version.id,
            confirm: true,
            confirmRoute: version.integration.route,
          }),
        );
        setRefresh((v) => v + 1);
        announce();
        setNotice("Previous release and navigation restored.");
      },
    });
  };
  const restore = (version: CodeVersion) => {
    if (!record) return;
    const current = record;
    confirm({
      title: "Restore this version as a draft?",
      message:
        "The current draft and unsaved edits will be replaced. Your published page stays live.",
      label: "Restore draft",
      action: "edit",
      run: async () => {
        accept(
          await codeApi(`/${current.id}/restore`, "POST", {
            revision: current.revision,
            versionId: version.id,
          }),
        );
        setTab("files");
        setComparison(null);
        setNotice("Version restored to draft. Preview before publishing.");
      },
    });
  };
  const field = (
    label: string,
    key: "name" | "description",
    multiline = false,
  ) => (
    <label className="cp-field">
      {label}
      {multiline ? (
        <textarea
          rows={3}
          value={doc?.[key] || ""}
          onChange={(e) => patch({ [key]: e.target.value })}
        />
      ) : (
        <input
          value={doc?.[key] || ""}
          onChange={(e) => patch({ [key]: e.target.value })}
        />
      )}
    </label>
  );
  const currentFile = doc?.package.files.find((f) => f.path === filePath);
  return (
    <section
      className="cp"
      data-admin-module="pages"
      aria-label="Code-Based Page Builder"
      aria-busy={!!busy}
    >
      <header className="cp-heading">
        <div>
          <div className="cp-eyebrow">PAGE BUILDER / CODE STUDIO</div>
          <h1>{record ? doc?.name : "Code-Based Page Builder"}</h1>
          <p>
            {record
              ? `Revision ${record.revision} · ${record.uploadedBy} · ${dirty ? "Unsaved changes" : "All changes saved"}`
              : "Bring your HTML, styles and assets together. Review in isolation, then publish with confidence."}
          </p>
        </div>
        <div className="cp-actions">
          {record ? (
            <>
              <button onClick={closePage} disabled={!!busy}>
                <ArrowLeft size={16} />
                All pages
              </button>
              <button
                data-admin-action="edit"
                onClick={() =>
                  void work("Saving draft", async () => {
                    await save();
                  })
                }
                disabled={!!busy || !dirty || !can("pages", "edit")}
              >
                <Save size={16} />
                Save Draft
              </button>
              <button
                onClick={showPreview}
                disabled={!!busy || !doc?.package.files.length}
              >
                <Eye size={16} />
                Preview Page
              </button>
              <button
                className="cp-primary"
                data-admin-action="publish"
                disabled={
                  !!busy ||
                  record.stage !== "READY" ||
                  dirty ||
                  !can("pages", "publish")
                }
                onClick={publishSummary}
              >
                Publish
              </button>
            </>
          ) : (
            <button
              className="cp-primary"
              data-admin-action="create"
              disabled={!can("pages", "create") || !!busy}
              onClick={() => {
                setName("");
                setCreating(true);
              }}
            >
              <Plus size={18} />
              Create New Code Page
            </button>
          )}
        </div>
      </header>
      {error && (
        <div role="alert" className="cp-alert cp-error">
          {error}
          <button aria-label="Dismiss error" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {notice && (
        <div role="status" className="cp-alert cp-success">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}
      {busy && (
        <div role="status" className="cp-busy">
          <span className="cp-spinner" />
          {busy}…
          {progress !== null && (
            <>
              <progress value={progress} max={100} />
              <span>
                {progress === 100 ? "Processing archive" : `${progress}%`}
              </span>
            </>
          )}
        </div>
      )}
      {!record ? (
        <>
          <div className="cp-workflow">
            <div>
              <span>01</span>
              <strong>Upload a complete page</strong>
              <p>A single ZIP keeps your folder and assets together.</p>
            </div>
            <div>
              <span>02</span>
              <strong>Review and edit</strong>
              <p>Inspect source and test desktop, tablet and mobile.</p>
            </div>
            <div>
              <span>03</span>
              <strong>Choose a destination</strong>
              <p>Publish a route, menu link, footer entry or homepage.</p>
            </div>
          </div>
          <div className="cp-panel">
            <div className="cp-toolbar">
              <div
                className="cp-tabs"
                role="tablist"
                aria-label="Code page status"
              >
                {[
                  ["all", "Manage Uploaded Pages"],
                  ["published", "Published Pages"],
                  ["draft", "Drafts"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    role="tab"
                    aria-selected={filter === value}
                    onClick={() => {
                      setFilter(value);
                      setPage(1);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <label className="cp-search">
                <Search size={16} />
                <input
                  type="search"
                  placeholder="Search code pages"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </label>
            </div>
            <div className="cp-table-scroll">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th>Page name / URL</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Last modified / Uploaded by</th>
                    <th>Published location / Last published</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.document.name}</strong>
                        <small>{item.document.integration.route}</small>
                      </td>
                      <td>r{item.revision}</td>
                      <td>
                        <span
                          className={`cp-badge ${item.publishedVersionId ? "cp-live" : ""}`}
                        >
                          {item.stage.replace("READY", "READY TO PUBLISH")}
                        </span>
                        {item.publishedVersionId &&
                          item.stage !== "PUBLISHED" && (
                            <small>Previous release is live</small>
                          )}
                      </td>
                      <td>
                        {formatIST(item.updatedAt)}
                        <small>{item.uploadedBy}</small>
                      </td>
                      <td>
                        {item.liveRoute ? (
                          <a
                            href={item.liveRoute}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.liveRoute}
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          "Unpublished"
                        )}
                        <small>
                          {item.publishedAt ? formatIST(item.publishedAt) : "—"}
                        </small>
                      </td>
                      <td>
                        <button onClick={() => open(item.id)} disabled={!!busy}>
                          Open page →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!items.length && (
              <div className="cp-empty">
                <FileText size={34} />
                <h2>
                  {loading ? "Loading code pages…" : "No code pages here yet"}
                </h2>
                <p>
                  {search
                    ? "Try a different search."
                    : "Create a code page and upload its complete website ZIP to get started."}
                </p>
                {error && (
                  <button onClick={() => setRefresh((v) => v + 1)}>
                    Retry loading
                  </button>
                )}
              </div>
            )}
            <div className="cp-pagination">
              <span>
                {total} pages · Page {page} of{" "}
                {Math.max(1, Math.ceil(total / 20))}
              </span>
              <div>
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <button
                  disabled={page * 20 >= total || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        doc && (
          <>
            <div className="cp-statusbar">
              <span
                className={`cp-badge ${record.publishedVersionId ? "cp-live" : ""}`}
              >
                {record.stage === "READY" ? "READY TO PUBLISH" : record.stage}
              </span>
              <span>{doc.package.originalName || "Awaiting ZIP upload"}</span>
              <span>
                {doc.package.files.length} files ·{" "}
                {bytes(doc.package.totalBytes)}
              </span>
              {record.liveRoute && (
                <a
                  href={record.liveRoute}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live: {record.liveRoute}
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
            <div
              className="cp-tabs cp-editor-tabs"
              role="tablist"
              aria-label="Code page tools"
            >
              {[
                ["files", "Source & assets"],
                ["preview", "Preview Pages"],
                ["integration", "Configure Page Integration"],
                ["history", "Drafts and Version History"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={tab === value}
                  onClick={() => setTab(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            {tab === "files" && (
              <>
                <div
                  className="cp-upload"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (
                      !busy &&
                      can("pages", "edit") &&
                      e.dataTransfer.files[0]
                    )
                      void upload(e.dataTransfer.files[0]);
                  }}
                >
                  <UploadCloud size={28} />
                  <div>
                    <strong>
                      {doc.package.files.length
                        ? "Upload a replacement ZIP"
                        : "Upload Website Folder / ZIP"}
                    </strong>
                    <p>
                      Drop a ZIP or choose a file. Up to 20 MB compressed, 50 MB
                      expanded, 500 files. HTML, CSS, JavaScript, images, fonts,
                      audio and video.
                    </p>
                  </div>
                  <button
                    data-admin-action="edit"
                    disabled={!!busy || !can("pages", "edit")}
                    onClick={() => uploadInput.current?.click()}
                  >
                    Choose ZIP
                  </button>
                  <input
                    ref={uploadInput}
                    aria-label="Upload website ZIP"
                    type="file"
                    accept=".zip,application/zip"
                    hidden
                    onChange={(e) => {
                      if (e.target.files?.[0]) void upload(e.target.files[0]);
                      e.target.value = "";
                    }}
                  />
                </div>
                {!!doc.package.files.length && (
                  <div className="cp-source-layout">
                    <aside className="cp-explorer">
                      <h3>Website files</h3>
                      {doc.package.files.map((file) => (
                        <button
                          key={file.path}
                          aria-pressed={filePath === file.path}
                          onClick={() => setFilePath(file.path)}
                        >
                          <span>{file.source === undefined ? "◇" : "⌘"}</span>
                          <span>
                            {file.path}
                            <small>{bytes(file.size)}</small>
                          </span>
                        </button>
                      ))}
                    </aside>
                    <div className="cp-source">
                      <div className="cp-source-title">
                        <span>{filePath}</span>
                        <span>
                          {currentFile?.mime}
                          {edits[filePath] !== undefined ? " · Modified" : ""}
                        </span>
                      </div>
                      {currentFile?.source !== undefined ? (
                        <textarea
                          className="cp-code"
                          aria-label={`Source code: ${filePath}`}
                          spellCheck={false}
                          readOnly={!can("pages", "edit") || !!busy}
                          value={edits[filePath] ?? currentFile.source}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEdits((prev) => {
                              const next = { ...prev };
                              if (value === currentFile.source)
                                delete next[filePath];
                              else next[filePath] = value;
                              return next;
                            });
                          }}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Tab" &&
                              !e.shiftKey &&
                              can("pages", "edit")
                            ) {
                              e.preventDefault();
                              const target = e.currentTarget,
                                start = target.selectionStart,
                                end = target.selectionEnd,
                                value =
                                  target.value.slice(0, start) +
                                  "  " +
                                  target.value.slice(end);
                              setEdits((prev) => ({
                                ...prev,
                                [filePath]: value,
                              }));
                              requestAnimationFrame(() => {
                                target.selectionStart = target.selectionEnd =
                                  start + 2;
                              });
                            }
                          }}
                        />
                      ) : (
                        <div className="cp-empty">
                          <FileText size={30} />
                          <h3>Binary asset</h3>
                          <p>
                            {filePath} · {bytes(currentFile?.size || 0)}
                          </p>
                          <p>
                            This asset is preserved with the page and available
                            in its isolated preview.
                          </p>
                          <code>{currentFile?.hash}</code>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {dirty && (
                  <button
                    data-admin-action="edit"
                    disabled={!!busy}
                    onClick={() =>
                      confirm({
                        title: "Discard unsaved changes?",
                        message:
                          "Return to the last saved source and configuration.",
                        label: "Discard changes",
                        action: "edit",
                        run: async () => accept(await codeApi(`/${record.id}`)),
                      })
                    }
                  >
                    Discard unsaved changes
                  </button>
                )}
                <Validation document={doc} />
                <p className="cp-note">
                  Uploaded scripts run only in the isolated page. External
                  network resources and API calls are blocked; include required
                  resources in your ZIP. Source edits stay in draft until you
                  explicitly publish.
                </p>
              </>
            )}
            {tab === "preview" && (
              <>
                <div className="cp-toolbar">
                  <div className="cp-actions">
                    {[
                      [1280, "Desktop", Monitor],
                      [768, "Tablet", Tablet],
                      [390, "Mobile", Smartphone],
                    ].map(([width, label, Icon]) => {
                      const DeviceIcon = Icon as React.ComponentType<any>;
                      return (
                        <button
                          key={String(label)}
                          aria-pressed={device === width}
                          onClick={() => setDevice(Number(width))}
                        >
                          <DeviceIcon size={16} />
                          {String(label)}
                        </button>
                      );
                    })}
                  </div>
                  <div className="cp-actions">
                    <button disabled={!!busy} onClick={showPreview}>
                      <RefreshCw size={16} />
                      Refresh preview
                    </button>
                    <button
                      disabled={!preview}
                      onClick={() => {
                        previewBox.current
                          ?.requestFullscreen()
                          .catch(() =>
                            setError(
                              "Fullscreen is unavailable in this browser.",
                            ),
                          );
                      }}
                    >
                      Full-screen preview
                    </button>
                    <button onClick={() => setTab("files")}>
                      Return to editor
                    </button>
                  </div>
                </div>
                <div ref={previewBox} className="cp-preview-stage">
                  <div style={{ width: device, maxWidth: "100%" }}>
                    {preview ? (
                      <iframe
                        ref={frame}
                        key={frameKey}
                        title="Isolated code page preview"
                        src={preview.url}
                        sandbox="allow-scripts"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="cp-empty">
                        <Eye size={34} />
                        <h2>Preview the latest saved draft</h2>
                        <p>
                          The page runs in an isolated browser frame. Preview
                          links expire after 15 minutes.
                        </p>
                        <button
                          onClick={showPreview}
                          disabled={!!busy || !doc.package.files.length}
                        >
                          Preview Page
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="cp-preview-footer">
                  <span>
                    {rendered
                      ? "Preview rendered. Check every viewport before approving."
                      : "Waiting for a rendered preview"}
                  </span>
                  <button
                    data-admin-action="publish"
                    className="cp-primary"
                    disabled={
                      !rendered ||
                      dirty ||
                      record.stage !== "PREVIEWED" ||
                      doc.validation.errors.length > 0 ||
                      !!busy ||
                      !can("pages", "publish")
                    }
                    onClick={() =>
                      void work("Approving preview", async () => {
                        const approved = await codeApi<CodeRecord>(
                          `/${record.id}/approve`,
                          "POST",
                          { revision: record.revision },
                        );
                        setRecord(approved);
                        setNotice(
                          "Preview approved. Review the publishing summary before going live.",
                        );
                      })
                    }
                  >
                    <CheckCircle2 size={16} />
                    Approve for Publishing
                  </button>
                </div>
                <Validation document={doc} />
                <div className="cp-panel cp-console">
                  <h3>Rendering diagnostics</h3>
                  {logs.length ? (
                    logs.map((log, i) => <p key={i}>{log}</p>)
                  ) : (
                    <p>
                      No rendering errors reported. Browser diagnostics may be
                      limited by isolation.
                    </p>
                  )}
                </div>
              </>
            )}
            {tab === "integration" && (
              <div className="cp-config-grid">
                <div className="cp-panel cp-form">
                  <h2>
                    <Settings size={20} />
                    Configure Page Integration
                  </h2>
                  {field("Page name", "name")}
                  {field("Description", "description", true)}
                  <label className="cp-field">
                    Publish destination
                    <select
                      value={doc.integration.mode}
                      onChange={(e) => {
                        const mode = e.target.value as Integration["mode"];
                        integration({
                          mode,
                          ...(mode === "homepage"
                            ? { route: "/" }
                            : doc.integration.route === "/"
                              ? { route: "/new-page" }
                              : {}),
                          parent:
                            mode === "footer"
                              ? "quickLinks"
                              : mode === "submenu"
                                ? "About Us"
                                : "Main Menu",
                        });
                      }}
                    >
                      {[
                        ["page", "Create a New Page"],
                        ["navigation", "Add to Main Navigation Bar"],
                        ["submenu", "Add to Existing Navigation Submenu"],
                        ["footer", "Add to Footer"],
                        ["replace", "Replace an Existing Page"],
                        ["homepage", "Set as Homepage"],
                      ].map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                  {doc.integration.mode === "replace" ? (
                    <label className="cp-field">
                      Existing page or route
                      <select
                        value={doc.integration.route}
                        onChange={(e) => integration({ route: e.target.value })}
                      >
                        <option value="">Select a destination</option>
                        {destinations.routes
                          .filter((r) => r !== "/")
                          .map((route) => (
                            <option key={route}>{route}</option>
                          ))}
                      </select>
                    </label>
                  ) : (
                    <label className="cp-field">
                      URL path
                      <input
                        aria-label="Published URL path"
                        value={doc.integration.route}
                        disabled={doc.integration.mode === "homepage"}
                        onChange={(e) => integration({ route: e.target.value })}
                      />
                    </label>
                  )}
                  <div className="cp-url-preview">
                    <small>FINAL URL</small>
                    <strong>
                      https://chalapathiuniversity.edu.in{doc.integration.route}
                    </strong>
                  </div>
                  {["navigation", "submenu", "footer"].includes(
                    doc.integration.mode,
                  ) && (
                    <>
                      {doc.integration.mode !== "navigation" && (
                        <label className="cp-field">
                          {doc.integration.mode === "footer"
                            ? "Footer section"
                            : "Parent navigation item"}
                          <select
                            value={doc.integration.parent}
                            onChange={(e) =>
                              integration({ parent: e.target.value })
                            }
                          >
                            {doc.integration.mode === "footer"
                              ? [
                                  ["quickLinks", "Quick Links"],
                                  ["academicsLinks", "Academics"],
                                  ["admissionsLinks", "Admissions"],
                                  ["campusLifeLinks", "Campus Life"],
                                ].map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))
                              : destinations.menus
                                  .filter((m) => m.id !== "Main Menu")
                                  .map((m) => (
                                    <option key={m.id} value={m.id}>
                                      {m.label}
                                    </option>
                                  ))}
                          </select>
                        </label>
                      )}
                      <label className="cp-field">
                        Navigation label
                        <input
                          value={doc.integration.label}
                          onChange={(e) =>
                            integration({ label: e.target.value })
                          }
                        />
                      </label>
                      <label className="cp-field">
                        Menu position (0 = first)
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={doc.integration.position}
                          onChange={(e) =>
                            integration({ position: Number(e.target.value) })
                          }
                        />
                      </label>
                      <label className="cp-check">
                        <input
                          type="checkbox"
                          checked={doc.integration.visible}
                          onChange={(e) =>
                            integration({ visible: e.target.checked })
                          }
                        />
                        Enable navigation entry
                      </label>
                      <div className="cp-placement-preview">
                        <small>PLACEMENT PREVIEW</small>
                        <p>
                          {doc.integration.mode === "navigation"
                            ? "Main navigation"
                            : doc.integration.parent}{" "}
                          →{" "}
                          <strong>
                            {doc.integration.label || "Menu label"}
                          </strong>
                        </p>
                        <span>
                          Position {doc.integration.position} ·{" "}
                          {doc.integration.visible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </>
                  )}
                  <label className="cp-field">
                    Website layout
                    <select
                      value={doc.integration.layout}
                      onChange={(e) =>
                        integration({
                          layout: e.target.value as Integration["layout"],
                        })
                      }
                    >
                      <option value="global">
                        Use global header and footer
                      </option>
                      <option value="standalone">Standalone page</option>
                    </select>
                  </label>
                  <label className="cp-field">
                    HTML entry point
                    <select
                      value={doc.package.entry}
                      onChange={(e) =>
                        patch({
                          package: { ...doc.package, entry: e.target.value },
                        })
                      }
                    >
                      {doc.package.files
                        .filter((f) => f.mime === "text/html")
                        .map((f) => (
                          <option key={f.path}>{f.path}</option>
                        ))}
                    </select>
                  </label>
                  {["replace", "homepage"].includes(doc.integration.mode) && (
                    <div className="cp-alert cp-warning">
                      <strong>This changes a live destination.</strong>
                      <p>
                        The existing page remains stored. You must confirm the
                        exact route before publishing.
                      </p>
                      <a
                        href={doc.integration.route}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View current page <ExternalLink size={13} />
                      </a>
                      <button
                        onClick={showPreview}
                        disabled={!!busy || !doc.package.files.length}
                      >
                        Preview proposed replacement
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <div className="cp-panel cp-form">
                    <h2>SEO & sharing</h2>
                    {[
                      ["title", "SEO title"],
                      ["description", "Meta description"],
                      ["canonical", "Canonical URL"],
                      ["ogTitle", "Open Graph title"],
                      ["ogDescription", "Open Graph description"],
                    ].map(([key, label]) => (
                      <label key={key} className="cp-field">
                        {label}
                        <input
                          value={String(doc.seo[key as keyof typeof doc.seo])}
                          onChange={(e) =>
                            patch({
                              seo: { ...doc.seo, [key]: e.target.value },
                            })
                          }
                          placeholder={
                            ["canonical", "image"].includes(key)
                              ? "https://…"
                              : ""
                          }
                        />
                      </label>
                    ))}
                    <div className="cp-field">
                      <label htmlFor="cp-social-image">
                        Social-sharing image (optional)
                      </label>
                      <input
                        id="cp-social-image"
                        ref={socialImageInput}
                        value={doc.seo.image}
                        placeholder="https://… or /uploads/banner.webp"
                        aria-invalid={socialImageTouched && !!imageError}
                        aria-describedby={
                          socialImageTouched && imageError
                            ? "cp-social-image-hint cp-social-image-error"
                            : "cp-social-image-hint"
                        }
                        onChange={(e) => {
                          patch({ seo: { ...doc.seo, image: e.target.value } });
                          setError("");
                        }}
                        onBlur={() => {
                          setSocialImageTouched(true);
                          patch({
                            seo: {
                              ...doc.seo,
                              image: normalizeSocialImage(doc.seo.image),
                            },
                          });
                        }}
                      />
                      <small
                        id="cp-social-image-hint"
                        className="cp-field-hint"
                      >
                        {SOCIAL_IMAGE_HELP}
                      </small>
                      {socialImageTouched && imageError && (
                        <p
                          id="cp-social-image-error"
                          className="cp-field-error"
                          role="alert"
                        >
                          {imageError}
                        </p>
                      )}
                      {zipImages.length > 0 && (
                        <label className="cp-zip-image-label">
                          Or choose an image from your uploaded ZIP
                          <select
                            aria-label="Choose social-sharing image from ZIP"
                            value={
                              zipImages.some(
                                (file) => file.path === doc.seo.image,
                              )
                                ? doc.seo.image
                                : ""
                            }
                            onChange={(e) => {
                              patch({
                                seo: { ...doc.seo, image: e.target.value },
                              });
                              setSocialImageTouched(true);
                              setError("");
                            }}
                          >
                            <option value="">Choose an uploaded image…</option>
                            {zipImages.map((file) => (
                              <option key={file.path} value={file.path}>
                                {file.path}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      {doc.seo.image && (
                        <button
                          type="button"
                          className="cp-clear-image"
                          data-admin-action="edit"
                          onClick={() => {
                            patch({ seo: { ...doc.seo, image: "" } });
                            setSocialImageTouched(false);
                            setError("");
                          }}
                        >
                          Clear optional image
                        </button>
                      )}
                    </div>
                    <label className="cp-check">
                      <input
                        type="checkbox"
                        checked={doc.seo.noindex}
                        onChange={(e) =>
                          patch({
                            seo: { ...doc.seo, noindex: e.target.checked },
                          })
                        }
                      />
                      Prevent search engines from indexing this page
                    </label>
                    <label className="cp-check">
                      <input
                        type="checkbox"
                        checked={doc.seo.sitemap}
                        onChange={(e) =>
                          patch({
                            seo: { ...doc.seo, sitemap: e.target.checked },
                          })
                        }
                      />
                      Include in sitemap
                    </label>
                    <p className="cp-note">
                      Drafts, previews and content endpoints are always excluded
                      from indexing. Canonical defaults to the published page
                      URL.
                    </p>
                  </div>
                  <div className="cp-panel cp-form">
                    <h2>Publication controls</h2>
                    <p>
                      Save configuration, preview the saved revision, approve
                      it, then review the publishing summary.
                    </p>
                    <button
                      data-admin-action="edit"
                      disabled={!dirty || !!busy || !can("pages", "edit")}
                      onClick={() =>
                        void work("Saving configuration", async () => {
                          await save();
                        })
                      }
                    >
                      Save changes
                    </button>
                    {record.publishedVersionId && (
                      <button
                        data-admin-action="publish"
                        disabled={!!busy || !can("pages", "publish")}
                        onClick={() => action("unpublish")}
                      >
                        Unpublish
                      </button>
                    )}
                    {!record.publishedVersionId && (
                      <button
                        className="cp-danger"
                        data-admin-action="delete"
                        disabled={!!busy || !can("pages", "delete")}
                        onClick={() => action("delete")}
                      >
                        <Trash2 size={16} />
                        Delete Draft
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {tab === "history" && (
              <div className="cp-panel cp-form">
                <h2>Drafts and Version History</h2>
                <p>
                  Every saved draft and publication retains source and asset
                  references. Restoring a draft keeps the live release
                  unchanged. Rollback restores a published release and its
                  navigation.
                </p>
                {!versions.length ? (
                  <div className="cp-empty">
                    Upload an archive to create the first version.
                  </div>
                ) : (
                  <div className="cp-table-scroll">
                    <table className="cp-table">
                      <thead>
                        <tr>
                          <th>Version</th>
                          <th>Saved by</th>
                          <th>Destination</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {versions.map((version) => (
                          <tr key={version.id}>
                            <td>
                              <strong>Revision {version.revision}</strong>
                              <span className="cp-badge">{version.kind}</span>
                              {record.publishedVersionId === version.id && (
                                <small>Current live release</small>
                              )}
                            </td>
                            <td>
                              {version.author}
                              <small>{formatIST(version.createdAt)}</small>
                            </td>
                            <td>
                              {version.integration.route}
                              <small>{version.integration.mode}</small>
                            </td>
                            <td>
                              <div className="cp-actions">
                                <button
                                  onClick={() =>
                                    void work("Comparing source", async () => {
                                      const result = await codeApi(
                                        `/${record.id}/versions/${version.id}`,
                                      );
                                      setComparison({
                                        version,
                                        document: result.document,
                                      });
                                    })
                                  }
                                >
                                  Compare source
                                </button>
                                <button
                                  data-admin-action="edit"
                                  disabled={!!busy || !can("pages", "edit")}
                                  onClick={() => restore(version)}
                                >
                                  Restore draft
                                </button>
                                {["PUBLISHED", "ROLLBACK"].includes(
                                  version.kind,
                                ) &&
                                  version.id !== record.publishedVersionId && (
                                    <button
                                      data-admin-action="publish"
                                      disabled={
                                        !!busy || !can("pages", "publish")
                                      }
                                      onClick={() => rollback(version)}
                                    >
                                      <Undo2 size={14} />
                                      Roll Back
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {comparison && (
                  <div className="cp-comparison">
                    <h3>
                      Revision {comparison.version.revision} compared with
                      current saved draft
                    </h3>
                    {comparison.document.package.files.map((old) => {
                      const current = record.document.package.files.find(
                        (f) => f.path === old.path,
                      );
                      const changed = old.hash !== current?.hash;
                      return (
                        <details key={old.path}>
                          <summary>
                            {changed ? "Changed" : "Unchanged"} · {old.path}
                            {!current ? " (removed from current draft)" : ""}
                          </summary>
                          {old.source !== undefined ? (
                            <div className="cp-diff">
                              <label>
                                Selected version
                                <textarea readOnly value={old.source} />
                              </label>
                              <label>
                                Current saved draft
                                <textarea
                                  readOnly
                                  value={current?.source || "File not present"}
                                />
                              </label>
                            </div>
                          ) : (
                            <p>
                              Asset: {old.hash} → {current?.hash || "missing"}
                            </p>
                          )}
                        </details>
                      );
                    })}
                    {record.document.package.files
                      .filter(
                        (f) =>
                          !comparison.document.package.files.some(
                            (old) => old.path === f.path,
                          ),
                      )
                      .map((f) => (
                        <p key={f.path}>Added in current draft · {f.path}</p>
                      ))}
                  </div>
                )}
              </div>
            )}
          </>
        )
      )}
      {creating && (
        <Dialog
          title="Create New Code Page"
          close={() => {
            if (!busy) setCreating(false);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void work("Creating code page", async () => {
                const value = await codeApi<CodeRecord>(
                  "",
                  "POST",
                  newSettings(name),
                );
                accept(value);
                setCreating(false);
                setTab("files");
                setRefresh((v) => v + 1);
              });
            }}
          >
            <p>
              Create a draft, then upload a ZIP with your complete page folder.
            </p>
            <label className="cp-field">
              Page name
              <input
                required
                maxLength={160}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Summer campaign"
              />
            </label>
            <div className="cp-modal-actions">
              <button
                type="button"
                disabled={!!busy}
                onClick={() => setCreating(false)}
              >
                Cancel
              </button>
              <button
                className="cp-primary"
                data-admin-action="create"
                disabled={!!busy || !name.trim()}
              >
                Create page
              </button>
            </div>
          </form>
        </Dialog>
      )}
      {summary && record && doc && (
        <Dialog
          title="Review publication"
          close={() => {
            if (!busy) setSummary(null);
          }}
        >
          <div className="cp-publish-summary">
            <p>
              <strong>{doc.name}</strong> · Revision {summary.revision}
            </p>
            <dl>
              <dt>Destination</dt>
              <dd>{summary.currentUrl}</dd>
              <dt>Placement</dt>
              <dd>
                {doc.integration.mode}{" "}
                {doc.integration.label && `· ${doc.integration.label}`}{" "}
                {doc.integration.mode === "submenu" ||
                doc.integration.mode === "footer"
                  ? `under ${doc.integration.parent}`
                  : ""}
              </dd>
              <dt>Package</dt>
              <dd>
                {summary.files} files · {bytes(summary.bytes)}
              </dd>
              <dt>Layout</dt>
              <dd>{doc.integration.layout}</dd>
            </dl>
            {summary.replacesExisting && (
              <div className="cp-alert cp-warning">
                This replaces the visible content of an existing route. The
                original is preserved and returns when you unpublish.
              </div>
            )}
            {["replace", "homepage"].includes(doc.integration.mode) && (
              <label className="cp-field">
                Type {doc.integration.route} to confirm this replacement
                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  autoComplete="off"
                />
              </label>
            )}
            <p>
              Publishing makes this release visible immediately. Your previous
              release stays in version history.
            </p>
            <div className="cp-modal-actions">
              <button disabled={!!busy} onClick={() => setSummary(null)}>
                Cancel
              </button>
              <button
                className="cp-primary"
                data-admin-action="publish"
                disabled={
                  !!busy ||
                  summary.stage !== "READY" ||
                  (["replace", "homepage"].includes(doc.integration.mode) &&
                    confirmText !== doc.integration.route)
                }
                onClick={() =>
                  void work("Publishing release", async () => {
                    const value = await codeApi<CodeRecord>(
                      `/${record.id}/publish`,
                      "POST",
                      {
                        revision: summary.revision,
                        confirm: true,
                        confirmRoute: confirmText,
                      },
                    );
                    accept(value);
                    setSummary(null);
                    setRefresh((v) => v + 1);
                    announce();
                    setNotice(`Published successfully at ${value.liveRoute}`);
                  })
                }
              >
                Confirm and Publish
              </button>
            </div>
          </div>
        </Dialog>
      )}
      {confirmation && (
        <Dialog
          title={confirmation.title}
          close={() => {
            if (!busy) setConfirmation(null);
          }}
        >
          <p>{confirmation.message}</p>
          {confirmation.route && (
            <label className="cp-field">
              Type {confirmation.route} to confirm
              <input
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </label>
          )}
          <div className="cp-modal-actions">
            <button disabled={!!busy} onClick={() => setConfirmation(null)}>
              Cancel
            </button>
            <button
              className="cp-primary"
              data-admin-action={confirmation.action}
              disabled={
                !!busy ||
                (!!confirmation.route && confirmText !== confirmation.route)
              }
              onClick={() =>
                void work(confirmation.label, async () => {
                  await confirmation.run();
                  setConfirmation(null);
                })
              }
            >
              {confirmation.label}
            </button>
          </div>
        </Dialog>
      )}
    </section>
  );
}
function Validation({ document }: { document: CodeDocument }) {
  const { errors, warnings } = document.validation;
  return (
    <div className="cp-validation">
      <h3>Validation results</h3>
      {!errors.length ? (
        <p className="cp-valid">
          <CheckCircle2 size={16} />
          No blocking asset or package issues found
        </p>
      ) : (
        <div className="cp-error">
          <strong>
            {errors.length} blocking {errors.length === 1 ? "issue" : "issues"}
          </strong>
          <ul>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {!!warnings.length && (
        <details>
          <summary>
            {warnings.length} {warnings.length === 1 ? "warning" : "warnings"} ·
            Review before publishing
          </summary>
          <ul>
            {warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
