import React, { useEffect, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Copy,
  Eye,
  ExternalLink,
  FileText,
  GripVertical,
  Layers,
  Monitor,
  Plus,
  Redo2,
  Save,
  Search,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  UploadCloud,
  X,
} from "lucide-react";
import { useAdminAccess, formatIST } from "../security/adminAccess";
import {
  BuilderDocument,
  BuilderNode,
  BuilderRecord,
  Device,
  Media,
  blankDocument,
  builderApi,
  cloneNode,
  containers,
  findNode,
  insertNode,
  library,
  locate,
  makeNode,
  mapNode,
  removeNode,
  documentsEqual,
} from "./model";
import { BuilderRenderer, NodeContent, nodeStyle } from "./Renderer";

function Modal({
  title,
  children,
  close,
  wide = false,
  error,
  dismissError,
}: {
  title: string;
  children: React.ReactNode;
  close: () => void;
  wide?: boolean;
  error?: string;
  dismissError?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        const els = ref.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], iframe, [tabindex="0"]',
        );
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", key, true);
    return () => {
      document.removeEventListener("keydown", key, true);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="pb-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={ref}
        tabIndex={-1}
        className={`pb-modal ${wide ? "pb-modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (
            (e.ctrlKey || e.metaKey) &&
            ["z", "y", "s", "d"].includes(e.key.toLowerCase()) &&
            !(e.target as HTMLElement).closest(
              "input, textarea, select, [contenteditable]",
            )
          )
            e.preventDefault();
        }}
      >
        <header>
          <h2>{title}</h2>
          <button aria-label="Close dialog" onClick={close}>
            <X size={20} />
          </button>
        </header>
        {error && (
          <div className="pb-feedback pb-error pb-dialog-feedback" role="alert">
            {error}
            <button aria-label="Dismiss dialog error" onClick={dismissError}>
              <X size={16} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
const Button = ({
  children,
  primary,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) => (
  <button
    type="button"
    className={`admin-button admin-button-${primary ? "primary" : "secondary"}`}
    {...props}
  >
    {children}
  </button>
);
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="pb-field">
    <span>{label}</span>
    {children}
  </label>
);
function LibraryItem({
  definition,
  add,
  disabled,
}: {
  definition: (typeof library)[number];
  add: () => void;
  disabled: boolean;
}) {
  const id = `library:${definition[0]}:${definition.length > 3 ? definition[3] : ""}`;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    data: {
      type: definition[0],
      columns: definition.length > 3 ? definition[3] : undefined,
      label: definition[1],
    },
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      className={`pb-library-item ${isDragging ? "is-dragging" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        disabled={disabled}
        className="pb-library-drag"
        aria-label={`Drag ${definition[1]}`}
      >
        <GripVertical size={14} />
      </button>
      <button disabled={disabled} onClick={add}>
        <span>{definition[1]}</span>
        <Plus size={14} />
      </button>
    </div>
  );
}
function DropZone({
  parent,
  index,
  empty = false,
  disabled,
}: {
  parent: string;
  index: number;
  empty?: boolean;
  disabled: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop:${parent}:${index}`,
    data: { parent, index },
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      className={`pb-drop ${empty ? "pb-drop-empty" : ""} ${isOver ? "is-over" : ""}`}
    >
      {empty ? (
        <>
          <Layers size={24} />
          <strong>Build your page here</strong>
          <span>Drag a component here, or add one from the library.</span>
        </>
      ) : (
        <span>Drop here</span>
      )}
    </div>
  );
}
function Frame({
  node,
  selected,
  select,
  children,
  disabled,
  resize,
  chooseImage,
}: {
  node: BuilderNode;
  selected: boolean;
  select: (id: string) => void;
  children?: React.ReactNode;
  disabled: boolean;
  chooseImage: (id: string) => void;
  resize: (
    id: string,
    dimension: "width" | "height" | "minHeight",
    value: string,
  ) => void;
}) {
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id: `node:${node.id}`,
    data: { nodeId: node.id, label: node.type },
    disabled,
  });
  return (
    <div
      ref={setNodeRef}
      className={`pb-node pb-frame pb-type-${node.type} ${selected ? "is-selected" : ""} ${isDragging ? "is-dragging" : ""}`}
      style={nodeStyle(node)}
      data-node-id={node.id}
      onClick={(e) => {
        e.stopPropagation();
        select(node.id);
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target === e.currentTarget) select(node.id);
      }}
      aria-label={`${node.type} component`}
    >
      <div className="pb-frame-label">
        <button
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label={`Move ${node.type}`}
        >
          <GripVertical size={14} />
        </button>
        <span>{node.type}</span>
      </div>
      {node.type === "image" && !node.props.url ? (
        <Button
          disabled={disabled}
          data-admin-action="edit"
          onClick={(e) => {
            e.stopPropagation();
            select(node.id);
            chooseImage(node.id);
          }}
        >
          <UploadCloud size={18} /> Upload or choose photo
        </Button>
      ) : (
        <NodeContent node={node} editing>
          {children}
        </NodeContent>
      )}
      {selected && !disabled && (
        <button
          className="pb-resize"
          aria-label="Resize component width"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const frame = e.currentTarget.parentElement!,
              parent = frame.parentElement!,
              startX = e.clientX,
              startWidth = frame.getBoundingClientRect().width,
              max = parent.getBoundingClientRect().width;
            e.currentTarget.setPointerCapture(e.pointerId);
            let width = startWidth;
            const handle = (ev: PointerEvent) => {
              width = Math.max(
                Math.min(80, max),
                Math.min(max, startWidth + ev.clientX - startX),
              );
              frame.style.width = `${width}px`;
            };
            const end = () => {
              frame.style.width = "";
              resize(
                node.id,
                "width",
                `${Math.min(100, Math.round((width / max) * 100))}%`,
              );
              window.removeEventListener("pointermove", handle);
              window.removeEventListener("pointerup", end);
            };
            window.addEventListener("pointermove", handle);
            window.addEventListener("pointerup", end, { once: true });
          }}
        />
      )}
      {selected &&
        !disabled &&
        (containers.has(node.type) ||
          node.type === "image" ||
          node.type === "spacer") && (
          <button
            className="pb-resize-height"
            aria-label="Resize component height"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const frame = e.currentTarget.parentElement!,
                startY = e.clientY,
                initial = frame.getBoundingClientRect().height;
              let height = initial;
              e.currentTarget.setPointerCapture(e.pointerId);
              const move = (event: PointerEvent) => {
                height = Math.max(
                  30,
                  Math.min(1200, initial + event.clientY - startY),
                );
                frame.style.minHeight = `${height}px`;
              };
              const end = () => {
                frame.style.minHeight = "";
                resize(
                  node.id,
                  node.type === "image" ? "height" : "minHeight",
                  `${Math.round(height)}px`,
                );
                window.removeEventListener("pointermove", move);
                window.removeEventListener("pointerup", end);
                window.removeEventListener("pointercancel", end);
              };
              window.addEventListener("pointermove", move);
              window.addEventListener("pointerup", end, { once: true });
              window.addEventListener("pointercancel", end, { once: true });
            }}
          />
        )}
    </div>
  );
}

function Properties({
  node,
  device,
  change,
  media,
  openMedia,
  links,
  disabled,
  contentOnly = false,
  uploadImage,
  canUploadPhoto,
}: {
  node: BuilderNode;
  device: Device;
  change: (fn: (node: BuilderNode) => BuilderNode) => void;
  media: Media[];
  openMedia: () => void;
  links: any[];
  disabled: boolean;
  contentOnly?: boolean;
  uploadImage: (file: File) => Promise<void>;
  canUploadPhoto: boolean;
}) {
  const textRef = useRef<HTMLTextAreaElement>(null);
  const p = node.props;
  const style =
    device === "desktop" ? node.style : node.responsive?.[device] || {};
  const prop = (key: string, value: unknown) =>
    change((n) => ({ ...n, props: { ...n.props, [key]: value } }));
  const setStyle = (key: string, value: unknown) =>
    change((n) =>
      device === "desktop"
        ? { ...n, style: { ...n.style, [key]: value } }
        : {
            ...n,
            responsive: {
              ...n.responsive,
              [device]: { ...n.responsive?.[device], [key]: value },
            },
          },
    );
  const input = (
    key: keyof BuilderNode["props"],
    label: string,
    area = false,
  ) => (
    <Field label={label}>
      {area ? (
        <textarea
          ref={key === "text" ? textRef : undefined}
          rows={5}
          value={String(p[key] || "")}
          onChange={(e) => prop(key, e.target.value)}
        />
      ) : (
        <input
          value={String(p[key] || "")}
          onChange={(e) => prop(key, e.target.value)}
        />
      )}
    </Field>
  );
  const select = (
    key: string,
    label: string,
    values: string[],
    styleProp = false,
  ) => (
    <Field label={label}>
      <select
        value={String(
          (styleProp
            ? (style as Record<string, unknown>)
            : (p as Record<string, unknown>))[key] || values[0],
        )}
        onChange={(e) =>
          styleProp ? setStyle(key, e.target.value) : prop(key, e.target.value)
        }
      >
        {values.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </Field>
  );
  const numeric = (
    key: string,
    label: string,
    min: number,
    max: number,
    fallback: number,
    step = 1,
  ) => (
    <Field label={label}>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={(style as any)[key] ?? ""}
        placeholder={String(fallback)}
        onChange={(e) =>
          setStyle(
            key,
            e.target.value === "" ? undefined : Number(e.target.value),
          )
        }
      />
    </Field>
  );
  const hasText = [
    "heading",
    "paragraph",
    "text",
    "button",
    "link",
    "download",
    "notice",
    "icon-text",
  ].includes(node.type);
  const link = ["button", "link", "download", "image"].includes(node.type);
  return (
    <fieldset disabled={disabled} className="pb-properties">
      <div className="pb-panel-title">
        <h3>Properties</h3>
        <span>{node.type}</span>
      </div>
      {hasText && input("text", "Text content", true)}
      {node.type === "paragraph" && (
        <div className="pb-small-actions">
          {[
            ["Bold", "**"],
            ["Italic", "_"],
          ].map(([label, marker]) => (
            <Button
              key={label}
              data-admin-action="edit"
              onClick={() => {
                const input = textRef.current;
                if (!input) return;
                const start = input.selectionStart,
                  end = input.selectionEnd,
                  text = p.text || "";
                prop(
                  "text",
                  text.slice(0, start) +
                    marker +
                    text.slice(start, end) +
                    marker +
                    text.slice(end),
                );
                requestAnimationFrame(() => {
                  input.focus();
                  input.setSelectionRange(
                    start + marker.length,
                    end + marker.length,
                  );
                });
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      )}
      {node.type === "heading" &&
        select("level", "Heading level", ["h1", "h2", "h3", "h4", "h5", "h6"])}
      {node.type === "image" && (
        <>
          {p.url && (
            <img
              className="pb-image-control-preview"
              src={p.url}
              alt={p.alt || "Selected image"}
            />
          )}
          <label className="admin-button admin-button-primary pb-upload">
            <UploadCloud size={17} /> {p.url ? "Replace photo" : "Upload photo"}
            <input
              type="file"
              aria-label="Upload photo"
              accept="image/png,image/jpeg,image/webp,image/gif"
              disabled={disabled || !canUploadPhoto}
              onChange={async (e) => {
                const input = e.currentTarget;
                const file = input.files?.[0];
                if (file) await uploadImage(file);
                input.value = "";
              }}
            />
          </label>
          <p className="pb-hint">
            {canUploadPhoto
              ? "Choose a photo from your computer. It will be added here automatically."
              : "Choose an existing photo below. Uploading new photos requires media upload permission."}
          </p>
          {input("url", "Image URL")}
          <Button data-admin-action="view" onClick={openMedia}>
            Choose from media library
          </Button>
          {input("alt", "Alternative text")}
          {input("caption", "Caption")}
          {select("objectFit", "Image fit", ["cover", "contain"])}
          {select("aspectRatio", "Aspect ratio", [
            "auto",
            "16/9",
            "4/3",
            "1/1",
            "3/4",
          ])}
        </>
      )}
      {node.type === "gallery" && (
        <>
          <Button data-admin-action="view" onClick={openMedia}>
            Add images from media library
          </Button>
          {p.images?.map((image, i) => (
            <div className="pb-gallery-control" key={i}>
              <img src={image.url} alt="" />
              <input
                aria-label={`Image ${i + 1} alt text`}
                value={image.alt}
                onChange={(e) =>
                  prop(
                    "images",
                    p.images!.map((v, index) =>
                      index === i ? { ...v, alt: e.target.value } : v,
                    ),
                  )
                }
              />
              <button
                aria-label="Remove gallery image"
                onClick={() =>
                  prop(
                    "images",
                    p.images!.filter((_, index) => index !== i),
                  )
                }
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </>
      )}
      {node.type === "video" && (
        <>
          {input("url", "YouTube privacy or Vimeo embed URL")}
          {input("caption", "Accessible video title")}
          <p className="pb-hint">
            https://www.youtube-nocookie.com/embed/VIDEO_ID
          </p>
        </>
      )}
      {link && (
        <>
          {input(
            "href",
            node.type === "download" ? "Document URL" : "Destination URL",
          )}
          <Field label="Published internal page">
            <select
              value={p.pageId || ""}
              onChange={(e) => {
                const page = links.find((v) => v.id === e.target.value);
                change((n) => ({
                  ...n,
                  props: {
                    ...n.props,
                    pageId: e.target.value,
                    href: page?.slug || "",
                  },
                }));
              }}
            >
              <option value="">Choose a page…</option>
              {links.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title || v.slug}
                </option>
              ))}
            </select>
          </Field>
          <label className="pb-check">
            <input
              type="checkbox"
              checked={p.newTab || false}
              onChange={(e) => prop("newTab", e.target.checked)}
            />
            Open in a new tab
          </label>
          {node.type === "download" && (
            <Button data-admin-action="view" onClick={openMedia}>
              Choose a PDF
            </Button>
          )}
        </>
      )}
      {node.type === "button" &&
        select("variant", "Button style", ["primary", "secondary", "outline"])}
      {node.type === "icon-text" &&
        select("icon", "Icon", ["info", "book", "award", "calendar"])}
      {node.type === "table" && (
        <>
          {input("caption", "Table caption")}
          <label className="pb-check">
            <input
              type="checkbox"
              checked={p.header || false}
              onChange={(e) => prop("header", e.target.checked)}
            />
            First row is a header
          </label>
          <div className="pb-table-editor">
            {p.rows?.map((row, r) => (
              <div key={r}>
                {row.map((cell, c) => (
                  <input
                    key={c}
                    aria-label={`Row ${r + 1}, column ${c + 1}`}
                    value={cell}
                    onChange={(e) =>
                      prop(
                        "rows",
                        p.rows!.map((v, ri) =>
                          ri === r
                            ? v.map((s, ci) => (ci === c ? e.target.value : s))
                            : v,
                        ),
                      )
                    }
                  />
                ))}
                <button
                  disabled={p.rows!.length <= 1}
                  aria-label={`Remove row ${r + 1}`}
                  onClick={() =>
                    prop(
                      "rows",
                      p.rows!.filter((_, i) => i !== r),
                    )
                  }
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="pb-small-actions">
            <Button
              disabled={(p.rows?.length || 0) >= 100}
              data-admin-action="edit"
              onClick={() =>
                prop("rows", [
                  ...(p.rows || []),
                  Array(p.rows?.[0]?.length || 2).fill(""),
                ])
              }
            >
              Add row
            </Button>
            <Button
              disabled={(p.rows?.[0]?.length || 0) >= 12}
              data-admin-action="edit"
              onClick={() =>
                prop(
                  "rows",
                  p.rows?.map((r) => [...r, ""]),
                )
              }
            >
              Add column
            </Button>
            <Button
              disabled={(p.rows?.[0]?.length || 0) <= 1}
              data-admin-action="edit"
              onClick={() =>
                prop(
                  "rows",
                  p.rows?.map((r) => r.slice(0, -1)),
                )
              }
            >
              Remove last column
            </Button>
          </div>
        </>
      )}
      {node.type === "accordion" && (
        <>
          {p.items?.map((item, i) => (
            <div className="pb-faq-editor" key={i}>
              <Field label={`Question ${i + 1}`}>
                <input
                  value={item.question}
                  onChange={(e) =>
                    prop(
                      "items",
                      p.items!.map((v, index) =>
                        index === i ? { ...v, question: e.target.value } : v,
                      ),
                    )
                  }
                />
              </Field>
              <Field label="Answer">
                <textarea
                  value={item.answer}
                  onChange={(e) =>
                    prop(
                      "items",
                      p.items!.map((v, index) =>
                        index === i ? { ...v, answer: e.target.value } : v,
                      ),
                    )
                  }
                />
              </Field>
              <button
                data-admin-action="edit"
                onClick={() =>
                  prop(
                    "items",
                    p.items!.filter((_, index) => index !== i),
                  )
                }
              >
                Remove question
              </button>
            </div>
          ))}
          <Button
            data-admin-action="edit"
            disabled={(p.items?.length || 0) >= 50}
            onClick={() =>
              prop("items", [
                ...(p.items || []),
                { question: "New question", answer: "" },
              ])
            }
          >
            Add question
          </Button>
        </>
      )}
      {node.type === "reusable" && (
        <Field label="Import a published page as a reusable block">
          <select
            defaultValue=""
            onChange={async (e) => {
              const page = links.find((v) => v.id === e.target.value);
              if (page) {
                const response = await builderApi(
                  `/public?slug=${encodeURIComponent(page.slug)}`,
                ).catch(() => null);
                if (response?.document)
                  change((n) => ({
                    ...n,
                    props: { reusablePageId: page.id },
                    children: response.document.nodes.map(cloneNode),
                  }));
              }
            }}
          >
            <option value="">Choose published builder content…</option>
            {links
              .filter((v) => v.slug.startsWith("/pages/"))
              .map((v) => (
                <option value={v.id} key={v.id}>
                  {v.title}
                </option>
              ))}
          </select>
        </Field>
      )}
      {!contentOnly && (
        <>
          <div className="pb-property-heading">
            {device.charAt(0).toUpperCase() + device.slice(1)} appearance
          </div>
          {device !== "desktop" && (
            <p className="pb-hint">Empty values inherit desktop settings.</p>
          )}
          {hasText && (
            <>
              <div className="pb-field-grid">
                {numeric("fontSize", "Font size (px)", 10, 100, 16)}
                {numeric("lineHeight", "Line height", 1, 3, 1.6, 0.1)}
              </div>
              {select(
                "fontWeight",
                "Font weight",
                ["400", "500", "600", "700", "800"],
                true,
              )}
              {numeric("letterSpacing", "Letter spacing (px)", -2, 10, 0, 0.5)}
            </>
          )}
          {select("textAlign", "Alignment", ["left", "center", "right"], true)}
          <div className="pb-field-grid">
            <Field label="Text color">
              <input
                type="color"
                value={style.color || "#072A6C"}
                onChange={(e) => setStyle("color", e.target.value)}
              />
            </Field>
            <Field label="Background">
              <input
                type="color"
                value={
                  style.backgroundColor &&
                  style.backgroundColor !== "transparent"
                    ? style.backgroundColor
                    : "#ffffff"
                }
                onChange={(e) => setStyle("backgroundColor", e.target.value)}
              />
            </Field>
          </div>
          <div className="pb-property-heading">Dimensions & spacing</div>
          {["width", "height", "minHeight", "maxWidth"].map((key) => (
            <Field
              key={key}
              label={
                (
                  {
                    width: "Width",
                    height: "Height",
                    minHeight: "Minimum height",
                    maxWidth: "Maximum width",
                  } as any
                )[key]
              }
            >
              <input
                value={(style as any)[key] || ""}
                placeholder="auto · px · % · rem"
                onChange={(e) => setStyle(key, e.target.value || undefined)}
              />
            </Field>
          ))}
          <div className="pb-field-grid">
            {numeric("padding", "Padding (px)", 0, 160, 0)}
            {numeric("margin", "Margin (px)", 0, 100, 0)}
            {numeric("gap", "Gap (px)", 0, 100, 16)}
            {numeric("borderRadius", "Radius (px)", 0, 100, 0)}
            {numeric("borderWidth", "Border (px)", 0, 12, 0)}
            <Field label="Border color">
              <input
                type="color"
                value={style.borderColor || "#e7e9ee"}
                onChange={(e) => setStyle("borderColor", e.target.value)}
              />
            </Field>
          </div>
          {["columns", "grid", "card-grid"].includes(node.type) && (
            <>
              {numeric("columns", "Columns", 1, 6, 2)}
              {select(
                "proportions",
                "Column proportions",
                ["equal", "wide-left", "wide-right"],
                true,
              )}
              {select(
                "alignItems",
                "Vertical alignment",
                ["stretch", "start", "center", "end"],
                true,
              )}
            </>
          )}
          {device !== "desktop" && (
            <Button
              data-admin-action="edit"
              onClick={() =>
                change((n) => ({
                  ...n,
                  responsive: { ...n.responsive, [device]: {} },
                }))
              }
            >
              Reset {device} overrides
            </Button>
          )}
        </>
      )}
    </fieldset>
  );
}

export default function PageBuilder({
  initialPageId = "",
  onReturnToPages,
}: {
  initialPageId?: string;
  onReturnToPages?: () => void;
}) {
  const { user } = useAdminAccess();
  const can = (module: string, action = "view") =>
    !!user &&
    (user.role === "superadmin" ||
      user.permissions.includes(`${module}.${action}`));
  const [items, setItems] = useState<BuilderRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const [active, setActive] = useState<BuilderRecord | null>(null);
  const [doc, setDoc] = useState<BuilderDocument | null>(null);
  const [past, setPast] = useState<BuilderDocument[]>([]);
  const [future, setFuture] = useState<BuilderDocument[]>([]);
  const [selected, setSelected] = useState("");
  const [device, setDevice] = useState<Device>("desktop");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState("");
  const [editorMode, setEditorMode] = useState<"content" | "layout">(
    initialPageId ? "content" : "layout",
  );
  const [newTitle, setNewTitle] = useState("");
  const [menus, setMenus] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [mediaPage, setMediaPage] = useState(1);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [revisionPage, setRevisionPage] = useState(1);
  const [revisionPreview, setRevisionPreview] =
    useState<BuilderDocument | null>(null);
  const [dragging, setDragging] = useState("");
  const clipboard = useRef<BuilderNode | null>(null);
  const mediaTarget = useRef("");
  const dirty = React.useMemo(
    () => !!doc && !documentsEqual(doc, active?.document),
    [doc, active?.document],
  );
  const editable =
    can("pages", "edit") && !busy && active?.status !== "archived";
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  useEffect(() => {
    let valid = true;
    setLoading(true);
    const timer = setTimeout(() => {
      builderApi(
        `?page=${page}&status=${filter}&search=${encodeURIComponent(search)}`,
      )
        .then((value) => {
          if (valid) {
            setItems(value.items);
            setTotal(value.total);
          }
        })
        .catch((e) => {
          if (valid) setError(e.message);
        })
        .finally(() => {
          if (valid) setLoading(false);
        });
    }, 200);
    return () => {
      valid = false;
      clearTimeout(timer);
    };
  }, [page, search, filter, reload]);
  useEffect(() => {
    builderApi("/menus")
      .then(setMenus)
      .catch((e) => setError(e.message));
    builderApi("/links")
      .then(setLinks)
      .catch((e) => setError(e.message));
  }, [reload]);
  useEffect(() => {
    const before = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const leave = (e: MouseEvent) => {
      if (
        dirty &&
        (e.target as HTMLElement).closest(
          ".admin-nav-link, .admin-subnavigation button, .admin-brand-logo, .admin-sidebar-footer button",
        ) &&
        !window.confirm("Discard unsaved page changes?")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", before);
    document.addEventListener("click", leave, true);
    return () => {
      window.removeEventListener("beforeunload", before);
      document.removeEventListener("click", leave, true);
    };
  }, [dirty]);
  const change = (next: BuilderDocument) => {
    if (!doc || documentsEqual(doc, next)) return;
    setPast((p) => [...p.slice(-79), doc]);
    setFuture([]);
    setDoc(next);
    setNotice("");
  };
  const open = async (id: string) => {
    setBusy(true);
    setError("");
    try {
      const row = await builderApi<BuilderRecord>(`/${id}`);
      setActive(row);
      setDoc(structuredClone(row.document));
      setPast([]);
      setFuture([]);
      setSelected("");
      setModal("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const apply = (row: BuilderRecord) => {
    setActive(row);
    setDoc(structuredClone(row.document));
    setReload((v) => v + 1);
    setNotice("Changes confirmed by the server");
    window.dispatchEvent(new Event("builder-document-saved"));
  };
  useEffect(() => {
    if (initialPageId) void open(initialPageId);
  }, [initialPageId]);
  const save = async () => {
    if (!active || !doc) throw new Error("No page is open");
    const row = await builderApi<BuilderRecord>(`/${active.id}`, "PUT", {
      version: active.version,
      document: doc,
    });
    apply(row);
    return row;
  };
  const execute = async (action: string, row = active, extra = {}) => {
    if (!row) return;
    setBusy(true);
    setError("");
    try {
      const current =
        row.id === active?.id &&
        dirty &&
        ["publish", "preview"].includes(action)
          ? await save()
          : row;
      if (action === "preview") {
        setModal("preview");
        return;
      }
      const result = await builderApi<BuilderRecord>(
        `/${current.id}/${action}`,
        "POST",
        { version: current.version, ...extra },
      );
      if (row.id === active?.id || action === "duplicate") apply(result);
      setReload((v) => v + 1);
      setModal("");
      setNotice(
        `${action.charAt(0).toUpperCase() + action.slice(1)} confirmed by the server`,
      );
      window.dispatchEvent(new Event("builder-published"));
      window.dispatchEvent(new Event("builder-document-saved"));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const editNode = (id: string, fn: (n: BuilderNode) => BuilderNode) => {
    if (doc && editable) change({ ...doc, nodes: mapNode(doc.nodes, id, fn) });
  };
  const add = (
    definition: (typeof library)[number],
    parent = "",
    index = doc?.nodes.length || 0,
  ) => {
    if (!doc || !editable) return;
    const node = makeNode(
      definition[0],
      definition.length > 3 ? definition[3] : undefined,
    );
    change({ ...doc, nodes: insertNode(doc.nodes, parent, index, node) });
    setSelected(node.id);
  };
  const move = (id: string, parent: string, index: number) => {
    if (!doc || !editable) return;
    const node = findNode(doc.nodes, id),
      source = locate(doc.nodes, id);
    if (!node || !source || parent === id || findNode(node.children, parent))
      return;
    const adjusted =
      source.parent === parent && source.index < index ? index - 1 : index;
    change({
      ...doc,
      nodes: insertNode(removeNode(doc.nodes, id), parent, adjusted, node),
    });
  };
  const duplicate = () => {
    if (!doc || !selected || !editable) return;
    const node = findNode(doc.nodes, selected),
      at = locate(doc.nodes, selected);
    if (node && at) {
      const copy = cloneNode(node);
      change({
        ...doc,
        nodes: insertNode(doc.nodes, at.parent, at.index + 1, copy),
      });
      setSelected(copy.id);
    }
  };
  const undo = () => {
    if (doc && past.length && editable) {
      setNotice("");
      setFuture((f) => [doc, ...f]);
      setDoc(past[past.length - 1]);
      setPast((p) => p.slice(0, -1));
    }
  };
  const redo = () => {
    if (doc && future.length && editable) {
      setNotice("");
      setPast((p) => [...p, doc]);
      setDoc(future[0]);
      setFuture((f) => f.slice(1));
    }
  };
  const paste = () => {
    if (!doc || !clipboard.current || !editable) return;
    const node = cloneNode(clipboard.current);
    const at = selected ? locate(doc.nodes, selected) : null;
    change({
      ...doc,
      nodes: insertNode(
        doc.nodes,
        at?.parent || "",
        at ? at.index + 1 : doc.nodes.length,
        node,
      ),
    });
    setSelected(node.id);
  };
  const remove = () => {
    if (doc && editable) {
      change({ ...doc, nodes: removeNode(doc.nodes, selected) });
      setSelected("");
    }
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (modal || busy) return;
      if (
        (e.target as HTMLElement).closest(
          "input, textarea, select, [contenteditable]",
        )
      )
        return;
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        if (["z", "y", "c", "v", "d", "s"].includes(k)) e.preventDefault();
        if (k === "z") e.shiftKey ? redo() : undo();
        if (k === "y") redo();
        if (k === "d") duplicate();
        if (k === "c" && doc && selected) {
          clipboard.current = findNode(doc.nodes, selected) || null;
          setNotice("Component copied");
        }
        if (k === "v") paste();
        if (k === "s" && dirty && editable) {
          setBusy(true);
          save()
            .catch((e) => setError(e.message))
            .finally(() => setBusy(false));
        }
      }
      if (e.key === "Delete") remove();
    };
    if (active) window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  const showMedia = async (mediaPageNumber = 1, nodeId = selected) => {
    mediaTarget.current = nodeId;
    setModal("media");
    setMediaPage(mediaPageNumber);
    try {
      const values = await builderApi<Media[]>(
        `/media?page=${mediaPageNumber}`,
      );
      setMedia(values);
    } catch (e: any) {
      setError(e.message);
    }
  };
  const history = async (revisionPageNumber = 1) => {
    if (!active) return;
    setNotice("");
    setError("");
    setModal("revisions");
    setRevisionPage(revisionPageNumber);
    setRevisionPreview(null);
    try {
      setRevisions(
        await builderApi(`/${active.id}/revisions?page=${revisionPageNumber}`),
      );
    } catch (e: any) {
      setError(e.message);
    }
  };
  const chooseMedia = (
    asset: Media,
    nodeId = mediaTarget.current || selected,
  ) => {
    if (!doc || !nodeId) return;
    const node = findNode(doc.nodes, nodeId);
    if (!node) return;
    if (
      (node.type === "download" && asset.mime !== "application/pdf") ||
      (node.type !== "download" && !asset.mime.startsWith("image/"))
    )
      throw new Error(
        node.type === "download"
          ? "Choose a PDF document for this download."
          : "Choose an image for this component.",
      );
    editNode(nodeId, (n) => ({
      ...n,
      props:
        n.type === "gallery"
          ? {
              ...n.props,
              images: [
                ...(n.props.images || []),
                { url: asset.url, alt: asset.alt },
              ],
            }
          : n.type === "download"
            ? { ...n.props, href: asset.url }
            : {
                ...n.props,
                url: asset.url,
                alt: asset.alt || n.props.alt || "",
              },
    }));
    setModal("");
  };
  const uploadFile = async (file: File, nodeId: string) => {
    if (!editable || !can("gallery", "create")) return;
    setBusy(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const asset = await builderApi<Media>("/media", "POST", form);
      setMedia((m) => [asset, ...m]);
      chooseMedia(asset, nodeId);
      setNotice(
        asset.mime === "application/pdf"
          ? "Document added. Save your draft or update the live page."
          : "Photo added. Save your draft or update the live page.",
      );
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const renderChildren = (
    nodes: BuilderNode[],
    parent = "",
  ): React.ReactNode => (
    <>
      {!nodes.length && (
        <DropZone parent={parent} index={0} empty disabled={!editable} />
      )}
      {nodes.map((node, i) => (
        <div className="pb-cell" key={node.id}>
          <DropZone parent={parent} index={i} disabled={!editable} />
          <Frame
            node={node}
            selected={selected === node.id}
            select={setSelected}
            chooseImage={(id) => {
              void showMedia(1, id);
            }}
            disabled={!editable}
            resize={(id, dimension, value) =>
              editNode(id, (n) =>
                device === "desktop"
                  ? { ...n, style: { ...n.style, [dimension]: value } }
                  : {
                      ...n,
                      responsive: {
                        ...n.responsive,
                        [device]: {
                          ...n.responsive?.[device],
                          [dimension]: value,
                        },
                      },
                    },
              )
            }
          >
            {containers.has(node.type)
              ? renderChildren(node.children, node.id)
              : undefined}
          </Frame>
        </div>
      ))}
      {nodes.length > 0 && (
        <div className="pb-tail">
          <DropZone parent={parent} index={nodes.length} disabled={!editable} />
        </div>
      )}
    </>
  );
  const contentFields = (nodes: BuilderNode[]): React.ReactNode =>
    nodes.map((node) => (
      <React.Fragment key={node.id}>
        {!containers.has(node.type) &&
          !["spacer", "divider"].includes(node.type) && (
            <section className="pb-content-card" data-node-id={node.id}>
              <h3>
                {library.find((item) => item[0] === node.type)?.[1] ||
                  node.type}
              </h3>
              <Properties
                node={node}
                device="desktop"
                contentOnly
                change={(fn) => editNode(node.id, fn)}
                media={media}
                openMedia={() => {
                  setSelected(node.id);
                  void showMedia(1, node.id);
                }}
                uploadImage={(file) => uploadFile(file, node.id)}
                canUploadPhoto={can("gallery", "create")}
                links={links}
                disabled={!editable}
              />
            </section>
          )}
        {contentFields(node.children)}
      </React.Fragment>
    ));
  const returnToPages = () => {
    setActive(null);
    setDoc(null);
    onReturnToPages?.();
  };
  const selectedNode = doc ? findNode(doc.nodes, selected) : undefined;
  return (
    <div className="pb-app" data-admin-module="pages">
      {error && !modal && (
        <div className="pb-feedback pb-error" role="alert">
          {error}
          <button aria-label="Dismiss error" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {notice && !modal && (
        <div className="pb-feedback pb-success" role="status">
          <CheckCircle2 size={16} />
          {notice}
        </div>
      )}
      {!active || !doc ? (
        <>
          <div className="admin-page-intro">
            <div>
              <h1>Page Builder</h1>
              <p>
                Create, design and publish pages for your university website.
              </p>
            </div>
            <Button
              primary
              data-admin-action="create"
              disabled={!can("pages", "create") || busy}
              onClick={() => {
                setModal("create");
                setNewTitle("");
              }}
            >
              <Plus size={17} />
              Create new page
            </Button>
          </div>
          <section className="admin-panel pb-manager">
            <div className="pb-manager-toolbar">
              <div className="pb-filters" data-admin-filter>
                {["all", "draft", "published", "unpublished", "archived"].map(
                  (s) => (
                    <button
                      key={s}
                      className={filter === s ? "is-active" : ""}
                      data-admin-action="view"
                      onClick={() => {
                        setFilter(s);
                        setPage(1);
                      }}
                    >
                      {s === "all"
                        ? "All pages"
                        : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ),
                )}
              </div>
              <label className="pb-search">
                <Search size={17} />
                <input
                  type="search"
                  placeholder="Search pages…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
              </label>
            </div>
            <div className="pb-manager-table">
              <table>
                <thead>
                  <tr>
                    <th>Page</th>
                    <th>Placement</th>
                    <th>Status</th>
                    <th>Last updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <button
                          className="pb-page-name"
                          data-admin-action="view"
                          onClick={() => open(row.id)}
                        >
                          <FileText size={19} />
                          <span>
                            <strong>{row.document.title}</strong>
                            <small>{row.document.slug}</small>
                          </span>
                        </button>
                      </td>
                      <td>
                        {row.document.placement.kind === "navigation"
                          ? row.document.placement.parent
                          : row.document.placement.kind === "homepage"
                            ? "Homepage"
                            : "Standalone"}
                      </td>
                      <td>
                        <span className={`pb-status pb-status-${row.status}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{formatIST(row.updatedAt)}</td>
                      <td>
                        <div className="pb-row-actions">
                          <button
                            data-admin-action="view"
                            onClick={() => open(row.id)}
                            aria-label={`Edit ${row.document.title}`}
                          >
                            Open
                          </button>
                          <button
                            data-admin-action="create"
                            disabled={!can("pages", "create") || busy}
                            onClick={() => execute("duplicate", row)}
                            aria-label={`Duplicate ${row.document.title}`}
                          >
                            <Copy size={16} />
                          </button>
                          {row.liveSlug && (
                            <a
                              href={row.liveSlug}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`View live ${row.document.title}`}
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {loading ? (
                <div className="pb-empty" role="status">
                  Loading pages…
                </div>
              ) : (
                !items.length && (
                  <div className="pb-empty">
                    <Layers size={34} />
                    <h2>
                      {search || filter !== "all"
                        ? "No matching pages"
                        : "Your next page starts here"}
                    </h2>
                    <p>
                      {search || filter !== "all"
                        ? "Try another search or filter."
                        : "Create a draft, add your content, and decide where it belongs."}
                    </p>
                    <Button
                      data-admin-action="view"
                      onClick={() => setReload((v) => v + 1)}
                    >
                      Refresh pages
                    </Button>
                  </div>
                )
              )}
            </div>
            <footer className="pb-pagination">
              <span>
                {total} pages · Page {page}
              </span>
              <Button
                data-admin-action="view"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                data-admin-action="view"
                disabled={page * 20 >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </footer>
          </section>
        </>
      ) : (
        <>
          <div className="pb-editor-heading">
            <Button
              data-admin-action="view"
              onClick={() => (dirty ? setModal("leave") : returnToPages())}
            >
              <ArrowLeft size={16} />
              All pages
            </Button>
            <div>
              <h1>{doc.title}</h1>
              <span className={`pb-status pb-status-${active.status}`}>
                {active.status}
              </span>
              <span className="pb-save-status">
                {busy
                  ? "Working…"
                  : dirty
                    ? "Unsaved changes"
                    : "Saved on server"}
              </span>
            </div>
            <Button data-admin-action="view" onClick={() => history()}>
              Revision history
            </Button>
          </div>
          <div className="pb-toolbar">
            <div className="pb-mode-controls" aria-label="Page editing mode">
              <Button
                data-admin-action="view"
                aria-pressed={editorMode === "content"}
                onClick={() => setEditorMode("content")}
              >
                Page content
              </Button>
              <Button
                data-admin-action="view"
                aria-pressed={editorMode === "layout"}
                onClick={() => setEditorMode("layout")}
              >
                Layout & components
              </Button>
            </div>
            <div className="pb-toolbar-group">
              <button
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
                data-admin-action="edit"
                disabled={!editable || !past.length}
                onClick={undo}
              >
                <Undo2 size={18} />
              </button>
              <button
                title="Redo (Ctrl+Y)"
                aria-label="Redo"
                data-admin-action="edit"
                disabled={!editable || !future.length}
                onClick={redo}
              >
                <Redo2 size={18} />
              </button>
            </div>
            <div className="pb-device-controls" aria-label="Preview viewport">
              {(
                [
                  ["desktop", Monitor],
                  ["tablet", Tablet],
                  ["mobile", Smartphone],
                ] as const
              ).map(([d, Icon]) => (
                <button
                  key={d}
                  data-admin-action="view"
                  className={device === d ? "is-active" : ""}
                  aria-label={`${d} preview`}
                  aria-pressed={device === d}
                  onClick={() => setDevice(d)}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
            <span className="pb-toolbar-spacer" />
            <Button
              data-admin-action="view"
              disabled={busy || (dirty && !can("pages", "edit"))}
              onClick={() => execute("preview")}
            >
              <Eye size={16} />
              Preview
            </Button>
            <Button
              data-admin-action="edit"
              disabled={!editable}
              onClick={() => setModal("settings")}
            >
              <Settings size={16} />
              Page settings
            </Button>
            <Button
              data-admin-action="edit"
              disabled={!editable || !dirty}
              onClick={async () => {
                setBusy(true);
                setError("");
                try {
                  await save();
                } catch (e: any) {
                  setError(e.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <Save size={16} />
              Save draft
            </Button>
            <Button
              primary
              data-admin-action="publish"
              disabled={
                busy || !can("pages", "publish") || active.status === "archived"
              }
              onClick={() => setModal("publish")}
            >
              <UploadCloud size={16} />
              {active.liveSlug ? "Update live page" : "Publish"}
            </Button>
          </div>
          {editorMode === "content" ? (
            <div className="pb-content-editor">
              <div className="pb-content-intro">
                <h2>Edit page content & photos</h2>
                <p>
                  Fill the fields below, then save your draft or update the live
                  page. Use Layout & components to add sections or change the
                  design.
                </p>
              </div>
              {contentFields(doc.nodes)}
              {!doc.nodes.length && (
                <p className="pb-empty">
                  This page is empty. Add content below or open Layout &
                  components.
                </p>
              )}
              <div className="pb-small-actions">
                {(["heading", "paragraph", "image", "gallery"] as const).map(
                  (type) => (
                    <Button
                      key={type}
                      disabled={!editable}
                      data-admin-action="edit"
                      onClick={() =>
                        add(library.find((item) => item[0] === type)!)
                      }
                    >
                      Add {type === "image" ? "photo" : type}
                    </Button>
                  ),
                )}
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={(args) => {
                const hits = pointerWithin(args);
                return hits.length ? hits : rectIntersection(args);
              }}
              onDragStart={(event) =>
                setDragging(event.active.data.current?.label || "Component")
              }
              onDragCancel={() => setDragging("")}
              onDragEnd={(event) => {
                setDragging("");
                const data = event.active.data.current,
                  target = event.over?.data.current;
                if (!target || !data || !editable) return;
                if (data.nodeId) move(data.nodeId, target.parent, target.index);
                else {
                  const definition = library.find(
                    (d) =>
                      d[0] === data.type &&
                      (d.length > 3 ? d[3] : undefined) === data.columns,
                  );
                  if (definition) add(definition, target.parent, target.index);
                }
              }}
            >
              <div className="pb-editor-layout">
                <aside className="pb-library">
                  <div className="pb-panel-title">
                    <h3>Components</h3>
                    <span>Drag or add</span>
                  </div>
                  <label className="pb-search">
                    <Search size={15} />
                    <input
                      type="search"
                      placeholder="Find a component…"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </label>
                  {["Basic content", "Layout", "Advanced content"].map(
                    (group) => (
                      <div className="pb-library-group" key={group}>
                        <h4>{group}</h4>
                        {library
                          .filter(
                            (d) =>
                              d[2] === group &&
                              d[1].toLowerCase().includes(query.toLowerCase()),
                          )
                          .map((definition, i) => (
                            <LibraryItem
                              key={definition[1]}
                              definition={definition}
                              add={() => add(definition)}
                              disabled={!editable}
                            />
                          ))}
                      </div>
                    ),
                  )}
                </aside>
                <div className="pb-canvas-area">
                  <div className="pb-canvas-caption">
                    <span>
                      {device === "desktop"
                        ? "Desktop · flexible"
                        : device === "tablet"
                          ? "Tablet · 768 px"
                          : "Mobile · 390 px"}
                    </span>
                    <span>{doc.nodes.length} top-level components</span>
                  </div>
                  {selectedNode && (
                    <div className="pb-selection-actions">
                      <span>{selectedNode.type}</span>
                      <button
                        title="Duplicate component"
                        aria-label="Duplicate component"
                        data-admin-action="edit"
                        disabled={!editable}
                        onClick={duplicate}
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        title="Copy component"
                        aria-label="Copy component"
                        data-admin-action="view"
                        onClick={() => {
                          clipboard.current = structuredClone(selectedNode);
                          setNotice("Component copied");
                        }}
                      >
                        Copy
                      </button>
                      <button
                        title="Paste component"
                        data-admin-action="edit"
                        disabled={!editable || !clipboard.current}
                        onClick={paste}
                      >
                        Paste
                      </button>
                      <button
                        aria-label="Move component up"
                        data-admin-action="edit"
                        disabled={!editable}
                        onClick={() => {
                          const at = locate(doc.nodes, selected)!;
                          move(selected, at.parent, Math.max(0, at.index - 1));
                        }}
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        aria-label="Move component down"
                        data-admin-action="edit"
                        disabled={!editable}
                        onClick={() => {
                          const at = locate(doc.nodes, selected)!;
                          move(selected, at.parent, at.index + 2);
                        }}
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        aria-label="Delete component"
                        data-admin-action="edit"
                        disabled={!editable}
                        onClick={remove}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                  <div
                    className="pb-canvas-viewport"
                    style={{
                      maxWidth:
                        device === "mobile"
                          ? 390
                          : device === "tablet"
                            ? 768
                            : "100%",
                    }}
                  >
                    <div className="pb-canvas-sitebar">
                      <img src="/logo.png" alt="Chalapathi University" />
                      <span>Page content</span>
                    </div>
                    <div
                      className="pb-renderer pb-canvas"
                      data-device={device}
                      onClick={() => setSelected("")}
                    >
                      {renderChildren(doc.nodes)}
                    </div>
                  </div>
                  <p className="pb-canvas-note">
                    The public page uses your existing university header and
                    footer.
                  </p>
                </div>
                <aside className="pb-inspector">
                  {selectedNode ? (
                    <Properties
                      node={selectedNode}
                      device={device}
                      change={(fn) => editNode(selected, fn)}
                      media={media}
                      openMedia={() => showMedia()}
                      uploadImage={(file) => uploadFile(file, selected)}
                      canUploadPhoto={can("gallery", "create")}
                      links={links}
                      disabled={!editable}
                    />
                  ) : (
                    <div className="pb-inspector-empty">
                      <Settings size={27} />
                      <h3>Make it yours</h3>
                      <p>
                        Select a component on the canvas to edit its content,
                        style and responsive layout.
                      </p>
                    </div>
                  )}
                </aside>
              </div>
              <DragOverlay>
                {dragging ? (
                  <div className="pb-drag-overlay">
                    <GripVertical size={16} />
                    {dragging}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
          <div className="pb-editor-footer">
            <span>
              {formatIST(active.updatedAt)} · Version {active.version}
            </span>
            <div>
              {active.liveSlug && (
                <>
                  <a href={active.liveSlug} target="_blank" rel="noreferrer">
                    View live page <ExternalLink size={14} />
                  </a>
                  <Button
                    data-admin-action="publish"
                    disabled={busy || !can("pages", "publish")}
                    onClick={() => setModal("unpublish")}
                  >
                    Unpublish
                  </Button>
                </>
              )}
              {active.status === "archived" ? (
                <Button
                  data-admin-action="edit"
                  disabled={busy || !can("pages", "edit")}
                  onClick={() => execute("reopen")}
                >
                  Restore archived page
                </Button>
              ) : (
                <Button
                  data-admin-action="delete"
                  disabled={
                    busy ||
                    !can("pages", "delete") ||
                    (!!active.liveSlug && !can("pages", "publish"))
                  }
                  onClick={() => setModal("archive")}
                >
                  Archive page
                </Button>
              )}
            </div>
          </div>
        </>
      )}
      {modal === "create" && (
        <Modal
          error={error}
          dismissError={() => setError("")}
          title="Create a new page"
          close={() => setModal("")}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setBusy(true);
              setError("");
              try {
                const row = await builderApi<BuilderRecord>("", "POST", {
                  document: blankDocument(newTitle.trim()),
                });
                apply(row);
                setModal("");
                setPast([]);
                setFuture([]);
              } catch (e: any) {
                setError(e.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <p>Start with a private draft. You can publish when it is ready.</p>
            <Field label="Page title">
              <input
                required
                autoFocus
                maxLength={200}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </Field>
            <p className="pb-hint">{blankDocument(newTitle).slug}</p>
            <Button
              primary
              type="submit"
              disabled={busy || !newTitle.trim()}
              data-admin-action="create"
            >
              {busy ? "Creating…" : "Create draft"}
            </Button>
          </form>
        </Modal>
      )}
      {modal === "settings" && doc && (
        <Modal
          error={error}
          dismissError={() => setError("")}
          title="Page settings & placement"
          close={() => setModal("")}
        >
          <div className="pb-settings">
            <Field label="Page title">
              <input
                maxLength={200}
                value={doc.title}
                onChange={(e) => change({ ...doc, title: e.target.value })}
              />
            </Field>
            <Field label="URL slug">
              <input
                value={doc.slug}
                onChange={(e) => change({ ...doc, slug: e.target.value })}
              />
            </Field>
            <p className="pb-hint">
              Use /pages/ followed by lowercase letters, numbers and hyphens.
            </p>
            <label className="pb-check">
              <input
                type="checkbox"
                checked={doc.redirectOldSlug}
                onChange={(e) =>
                  change({ ...doc, redirectOldSlug: e.target.checked })
                }
              />
              Redirect the previous published URL when the slug changes
            </label>
            <Field label="Where should this page appear?">
              <select
                value={doc.placement.kind}
                onChange={(e) =>
                  change({
                    ...doc,
                    placement: {
                      ...doc.placement,
                      kind: e.target.value as any,
                    },
                  })
                }
              >
                <option value="standalone">Standalone page</option>
                <option value="navigation">Existing navigation menu</option>
                <option value="homepage">Homepage</option>
              </select>
            </Field>
            {doc.placement.kind === "navigation" && (
              <Field label="Parent menu">
                <select
                  value={doc.placement.parent}
                  onChange={(e) =>
                    change({
                      ...doc,
                      placement: { ...doc.placement, parent: e.target.value },
                    })
                  }
                >
                  <option value="">Select an existing menu…</option>
                  {menus.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {doc.placement.kind === "homepage" && (
              <Field label="Homepage appearance">
                <select
                  value={doc.placement.homeMode}
                  onChange={(e) =>
                    change({
                      ...doc,
                      placement: {
                        ...doc.placement,
                        homeMode: e.target.value as any,
                      },
                    })
                  }
                >
                  <option value="link">Link</option>
                  <option value="card">Featured card</option>
                  <option value="section">Content section</option>
                </select>
              </Field>
            )}
            {doc.placement.kind !== "standalone" && (
              <>
                <Field label="Navigation / homepage label">
                  <input
                    value={doc.placement.label}
                    onChange={(e) =>
                      change({
                        ...doc,
                        placement: { ...doc.placement, label: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="Position among added pages">
                  <input
                    type="number"
                    min={0}
                    max={10000}
                    value={doc.placement.position}
                    onChange={(e) =>
                      change({
                        ...doc,
                        placement: {
                          ...doc.placement,
                          position: Number(e.target.value),
                        },
                      })
                    }
                  />
                </Field>
                <label className="pb-check">
                  <input
                    type="checkbox"
                    checked={doc.placement.visible}
                    onChange={(e) =>
                      change({
                        ...doc,
                        placement: {
                          ...doc.placement,
                          visible: e.target.checked,
                        },
                      })
                    }
                  />
                  Show the automatic placement
                </label>
              </>
            )}
            <div className="pb-property-heading">Search & sharing</div>
            {(
              [
                ["metaTitle", "Meta title"],
                ["metaDescription", "Meta description"],
                ["socialImage", "Social image URL"],
                ["canonical", "Canonical HTTPS URL (optional)"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                {key === "metaDescription" ? (
                  <textarea
                    value={doc[key]}
                    onChange={(e) => change({ ...doc, [key]: e.target.value })}
                  />
                ) : (
                  <input
                    value={doc[key]}
                    onChange={(e) => change({ ...doc, [key]: e.target.value })}
                  />
                )}
              </Field>
            ))}
            <Button
              primary
              data-admin-action="view"
              onClick={() => setModal("")}
            >
              Done
            </Button>
            <Button
              primary
              data-admin-action="publish"
              disabled={!can("pages", "publish") || busy}
              onClick={() => setModal("publish")}
            >
              {active?.status === "published"
                ? "Save & update live page"
                : "Save & publish"}
            </Button>
            <p className="pb-hint">
              Done closes settings. Save & publish applies these settings to the
              website after confirmation.
              {doc.placement.kind === "navigation" &&
                ` The link will appear under ${doc.placement.parent === "Main Menu" ? "the main navigation" : doc.placement.parent} as “${doc.placement.label || doc.title}”.`}
            </p>
          </div>
        </Modal>
      )}
      {["publish", "unpublish", "archive", "leave"].includes(modal) && (
        <Modal
          error={error}
          dismissError={() => setError("")}
          title={
            modal === "publish"
              ? "Publish this page?"
              : modal === "leave"
                ? "Discard unsaved changes?"
                : `${modal === "archive" ? "Archive" : "Unpublish"} this page?`
          }
          close={() => !busy && setModal("")}
        >
          <div className="pb-confirm">
            <p>
              {modal === "publish"
                ? `The current draft will become publicly available at ${doc?.slug}. Its selected placement will be updated in the same transaction.`
                : modal === "leave"
                  ? "Your changes since the last save will be lost."
                  : "Public access and automatic placement will be removed. Your saved content and revisions will remain available."}
            </p>
            <div>
              <Button
                disabled={busy}
                data-admin-action="view"
                onClick={() => setModal("")}
              >
                Cancel
              </Button>
              <Button
                primary
                disabled={busy}
                data-admin-action={
                  modal === "archive"
                    ? "delete"
                    : modal === "leave"
                      ? "view"
                      : "publish"
                }
                onClick={() =>
                  modal === "leave"
                    ? (setModal(""), returnToPages())
                    : execute(modal)
                }
              >
                {busy
                  ? "Working…"
                  : modal === "leave"
                    ? "Discard changes"
                    : modal === "publish"
                      ? "Confirm publication"
                      : `Confirm ${modal}`}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {modal === "preview" && doc && (
        <Modal
          error={error}
          dismissError={() => setError("")}
          title="Draft preview · visible only to authorized administrators"
          wide
          close={() => setModal("")}
        >
          <div
            className="pb-preview"
            style={{
              maxWidth:
                device === "mobile" ? 390 : device === "tablet" ? 768 : "100%",
              margin: "auto",
            }}
          >
            <a
              className="pb-link"
              href={`/admin/page-preview/${active?.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open full website preview
            </a>
            <h1>{doc.title}</h1>
            <BuilderRenderer document={doc} device={device} />
          </div>
        </Modal>
      )}
      {modal === "media" && (
        <Modal
          error={error}
          dismissError={() => setError("")}
          title="Media library"
          wide
          close={() => setModal("")}
        >
          <div className="pb-media">
            <p>
              Upload a file or choose one below. It will be added to the
              selected component automatically.
            </p>
            {can("gallery", "create") && (
              <label className="admin-button admin-button-primary pb-upload">
                <UploadCloud size={17} />
                {busy
                  ? "Uploading…"
                  : findNode(doc?.nodes || [], mediaTarget.current)?.type ===
                      "download"
                    ? "Upload PDF"
                    : "Upload photo"}
                <input
                  type="file"
                  accept={
                    findNode(doc?.nodes || [], mediaTarget.current)?.type ===
                    "download"
                      ? "application/pdf"
                      : "image/png,image/jpeg,image/webp,image/gif"
                  }
                  disabled={busy}
                  onChange={async (e) => {
                    const input = e.currentTarget;
                    const file = input.files?.[0];
                    if (!file) return;
                    await uploadFile(file, mediaTarget.current || selected);
                    input.value = "";
                  }}
                />
              </label>
            )}
            <p className="pb-hint">
              Maximum 10 MB. Images are optimized and validated on the server.
            </p>
            <div className="pb-media-grid">
              {media
                .filter((asset) =>
                  findNode(doc?.nodes || [], mediaTarget.current)?.type ===
                  "download"
                    ? asset.mime === "application/pdf"
                    : asset.mime.startsWith("image/"),
                )
                .map((asset) => (
                  <button
                    key={asset.id}
                    disabled={!editable}
                    data-admin-action="edit"
                    onClick={() => {
                      try {
                        chooseMedia(asset);
                      } catch (e: any) {
                        setError(e.message);
                      }
                    }}
                  >
                    {asset.mime.startsWith("image/") ? (
                      <img src={asset.url} alt={asset.alt} />
                    ) : (
                      <FileText size={40} />
                    )}
                    <strong>{asset.originalName}</strong>
                    <span>
                      {asset.width
                        ? `${asset.width} × ${asset.height}`
                        : "PDF document"}
                    </span>
                  </button>
                ))}
            </div>
            {!media.length && (
              <div className="pb-empty">
                No media on this page. Upload a file to get started.
              </div>
            )}
            <div className="pb-pagination">
              <Button
                data-admin-action="view"
                disabled={mediaPage <= 1}
                onClick={() => showMedia(mediaPage - 1)}
              >
                Previous
              </Button>
              <span>Page {mediaPage}</span>
              <Button
                data-admin-action="view"
                disabled={media.length < 40}
                onClick={() => showMedia(mediaPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Modal>
      )}
      {modal === "revisions" && (
        <Modal
          error={error}
          dismissError={() => setError("")}
          title="Revision history"
          wide
          close={() => setModal("")}
        >
          <div className="pb-revisions">
            {dirty && (
              <div
                className="pb-feedback pb-error pb-revision-warning"
                role="status"
              >
                <p>
                  Save or discard your current edits before restoring a
                  revision.
                </p>
                <div className="pb-small-actions">
                  <Button
                    data-admin-action="edit"
                    disabled={busy || !can("pages", "edit")}
                    onClick={async () => {
                      setBusy(true);
                      setError("");
                      try {
                        await save();
                        await history(revisionPage);
                      } catch (e: any) {
                        setError(e.message);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    Save draft
                  </Button>
                  <Button
                    data-admin-action="edit"
                    disabled={busy || !active}
                    onClick={() => {
                      if (
                        active &&
                        window.confirm(
                          "Discard your unsaved changes and return to the last saved draft?",
                        )
                      ) {
                        setDoc(structuredClone(active.document));
                        setPast([]);
                        setFuture([]);
                        setSelected("");
                        setRevisionPreview(null);
                        setError("");
                        setNotice("");
                      }
                    }}
                  >
                    Discard unsaved changes
                  </Button>
                </div>
              </div>
            )}
            {revisions.map((r) => (
              <div className="pb-revision" key={r.id}>
                <div>
                  <strong>{r.note}</strong>
                  <span>
                    {r.author} · {formatIST(r.createdAt)}
                  </span>
                </div>
                <Button
                  data-admin-action="view"
                  onClick={() => {
                    try {
                      setRevisionPreview(JSON.parse(r.snapshotJson).document);
                    } catch {
                      setError("This revision is unavailable");
                    }
                  }}
                >
                  Preview
                </Button>
                <Button
                  data-admin-action="edit"
                  disabled={
                    busy ||
                    dirty ||
                    !can("pages", "edit") ||
                    active?.status === "archived"
                  }
                  onClick={() => {
                    if (
                      window.confirm(
                        "Restore this revision as the current draft? The live page will remain unchanged until you publish.",
                      )
                    )
                      execute("restore", active, { revisionId: r.id });
                  }}
                >
                  Restore draft
                </Button>
              </div>
            ))}
            {!revisions.length && <p>No revisions on this page.</p>}
            <div className="pb-pagination">
              <Button
                data-admin-action="view"
                disabled={revisionPage <= 1}
                onClick={() => history(revisionPage - 1)}
              >
                Previous
              </Button>
              <span>Page {revisionPage}</span>
              <Button
                data-admin-action="view"
                disabled={revisions.length < 20}
                onClick={() => history(revisionPage + 1)}
              >
                Next
              </Button>
            </div>
            {revisionPreview && (
              <div className="pb-preview">
                <h2>{revisionPreview.title}</h2>
                <BuilderRenderer document={revisionPreview} />
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
