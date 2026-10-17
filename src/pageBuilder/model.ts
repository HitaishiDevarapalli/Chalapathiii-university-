import type {
  BuilderDocument,
  BuilderNode,
} from "../../server/src/pageBuilder/schema";
export type { BuilderDocument, BuilderNode };

// JSON object property order is not an edit; array order remains significant.
export function documentsEqual(left: unknown, right: unknown): boolean {
  const canonical = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(canonical);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value)
          .filter(([, entry]) => entry !== undefined)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, entry]) => [key, canonical(entry)]),
      );
    return value;
  };
  return JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
}
export type BuilderRecord = {
  id: string;
  version: number;
  document: BuilderDocument;
  status: string;
  liveSlug: string | null;
  updatedAt: string;
  publishedAt: string | null;
};
export type Device = "desktop" | "tablet" | "mobile";
export type Media = {
  id: string;
  url: string;
  originalName: string;
  mime: string;
  alt: string;
  width?: number;
  height?: number;
};
export const containers = new Set([
  "section",
  "container",
  "columns",
  "grid",
  "card",
  "card-grid",
  "cta",
  "reusable",
]);
export const library = [
  ["heading", "Heading", "Basic content"],
  ["paragraph", "Paragraph", "Basic content"],
  ["text", "Plain text", "Basic content"],
  ["image", "Image", "Basic content"],
  ["gallery", "Image gallery", "Basic content"],
  ["video", "Video embed", "Basic content"],
  ["link", "Hyperlink", "Basic content"],
  ["button", "Button", "Basic content"],
  ["divider", "Divider", "Basic content"],
  ["spacer", "Spacer", "Basic content"],
  ["section", "Section", "Layout"],
  ["container", "Container", "Layout"],
  ["columns", "One column", "Layout", 1],
  ["columns", "Two columns", "Layout", 2],
  ["columns", "Three columns", "Layout", 3],
  ["columns", "Multi-column layout", "Layout", 4],
  ["grid", "Grid", "Layout"],
  ["table", "Table", "Advanced content"],
  ["card", "Card", "Advanced content"],
  ["card-grid", "Card grid", "Advanced content"],
  ["icon-text", "Icon with text", "Advanced content"],
  ["cta", "Call to action", "Advanced content"],
  ["accordion", "Accordion / FAQ", "Advanced content"],
  ["notice", "Notice", "Advanced content"],
  ["download", "Document download", "Advanced content"],
  ["reusable", "Published content block", "Advanced content"],
] as const;
export const blankDocument = (title: string): BuilderDocument => ({
  schemaVersion: 1,
  title,
  slug:
    "/pages/" +
    (title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 120) || "untitled"),
  metaTitle: "",
  metaDescription: "",
  socialImage: "",
  canonical: "",
  redirectOldSlug: true,
  placement: {
    kind: "standalone",
    parent: "",
    label: title,
    position: 0,
    visible: true,
    homeMode: "card",
  },
  nodes: [],
});
export function makeNode(
  type: BuilderNode["type"],
  columns?: number,
): BuilderNode {
  const node: BuilderNode = {
    id: crypto.randomUUID(),
    type,
    props: {},
    style: {},
    children: [],
  };
  if (
    [
      "heading",
      "paragraph",
      "text",
      "icon-text",
      "notice",
      "button",
      "link",
      "download",
    ].includes(type)
  )
    node.props.text =
      type === "heading"
        ? "Your heading"
        : type === "button"
          ? "Learn more"
          : type === "notice"
            ? "Add an announcement for your visitors."
            : type === "download"
              ? "Download document"
              : "Write your content here.";
  if (type === "heading") {
    node.props.level = "h2";
    node.style.fontSize = 32;
    node.style.fontWeight = "700";
    node.style.color = "#072A6C";
  }
  if (type === "table") {
    node.props.rows = [
      ["Column 1", "Column 2"],
      ["Cell", "Cell"],
    ];
    node.props.header = true;
  }
  if (type === "accordion")
    node.props.items = [
      { question: "Your question", answer: "Write your answer here." },
    ];
  if (type === "gallery") node.props.images = [];
  if (type === "spacer") node.style.minHeight = "40px";
  if (containers.has(type)) {
    node.style.padding = 24;
    node.style.gap = 16;
  }
  if (["columns", "grid", "card-grid"].includes(type))
    node.style.columns = columns || 3;
  if (type === "columns")
    node.children = Array.from({ length: columns || 2 }, () =>
      makeNode("container"),
    );
  if (type === "card") {
    node.style.backgroundColor = "#f7f8fa";
    node.style.borderRadius = 12;
  }
  if (type === "cta") {
    node.style.backgroundColor = "#072A6C";
    node.style.color = "#ffffff";
    node.children = [makeNode("paragraph"), makeNode("button")];
  }
  return node;
}
export const findNode = (
  nodes: BuilderNode[],
  id: string,
): BuilderNode | undefined => {
  for (const n of nodes) {
    if (n.id === id) return n;
    const child = findNode(n.children, id);
    if (child) return child;
  }
};
export function mapNode(
  nodes: BuilderNode[],
  id: string,
  fn: (n: BuilderNode) => BuilderNode,
): BuilderNode[] {
  return nodes.map((n) =>
    n.id === id ? fn(n) : { ...n, children: mapNode(n.children, id, fn) },
  );
}
export const removeNode = (nodes: BuilderNode[], id: string): BuilderNode[] =>
  nodes
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: removeNode(n.children, id) }));
export function insertNode(
  nodes: BuilderNode[],
  parent: string,
  index: number,
  node: BuilderNode,
): BuilderNode[] {
  if (!parent) {
    const next = [...nodes];
    next.splice(index, 0, node);
    return next;
  }
  return mapNode(nodes, parent, (n) => ({
    ...n,
    children: insertNode(n.children, "", index, node),
  }));
}
export const cloneNode = (node: BuilderNode): BuilderNode => ({
  ...structuredClone(node),
  id: crypto.randomUUID(),
  children: node.children.map(cloneNode),
});
export function locate(
  nodes: BuilderNode[],
  id: string,
  parent = "",
): { parent: string; index: number } | undefined {
  for (let index = 0; index < nodes.length; index++) {
    if (nodes[index].id === id) return { parent, index };
    const found = locate(nodes[index].children, id, nodes[index].id);
    if (found) return found;
  }
}
export async function builderApi<T = any>(
  path = "",
  method = "GET",
  body?: unknown,
): Promise<T> {
  const response = await fetch("/api/page-builder" + path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers:
      body === undefined || body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" },
    ...(body === undefined
      ? {}
      : { body: body instanceof FormData ? body : JSON.stringify(body) }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw Object.assign(
      new Error(data.error || "The server could not complete this operation"),
      { status: response.status },
    );
  return data;
}
