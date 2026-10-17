import { z } from "zod";

export const TYPES = [
  "heading",
  "paragraph",
  "text",
  "image",
  "gallery",
  "video",
  "link",
  "button",
  "divider",
  "spacer",
  "section",
  "container",
  "columns",
  "grid",
  "table",
  "card",
  "card-grid",
  "icon-text",
  "cta",
  "accordion",
  "notice",
  "download",
  "reusable",
] as const;
export const CONTAINERS = new Set([
  "section",
  "container",
  "columns",
  "grid",
  "card",
  "card-grid",
  "cta",
  "reusable",
]);
export const safeUrl = (s: string) =>
  !s ||
  (/^\/(?!\/)/.test(s) && !/[\\\x00-\x20]/.test(s)) ||
  (/^https:\/\/[^\s\\]+$/i.test(s) &&
    (() => {
      try {
        const u = new URL(s);
        return !u.username && !u.password;
      } catch {
        return false;
      }
    })()) ||
  /^mailto:[^\s<>]+@[^\s<>]+$/.test(s) ||
  /^tel:\+?[\d ()-]+$/.test(s);
const url = z
  .string()
  .max(2048)
  .refine(safeUrl, "Use an internal path or a secure HTTPS URL");
const dimension = z
  .string()
  .regex(/^(auto|(?:\d{1,4}(?:\.\d{1,2})?)(?:px|%|rem|vh))$/)
  .refine(
    (s) =>
      s === "auto" ||
      parseFloat(s) <=
        (s.endsWith("%")
          ? 100
          : s.endsWith("rem")
            ? 100
            : s.endsWith("vh")
              ? 100
              : 2400),
    "Dimension is too large",
  );
const color = z.string().regex(/^(#[0-9a-fA-F]{3,8}|transparent)$/);
export const styleSchema = z
  .object({
    width: dimension.optional(),
    height: dimension.optional(),
    minHeight: dimension.optional(),
    maxWidth: dimension.optional(),
    fontSize: z.number().min(10).max(100).optional(),
    fontWeight: z.enum(["400", "500", "600", "700", "800"]).optional(),
    textAlign: z.enum(["left", "center", "right"]).optional(),
    color: color.optional(),
    backgroundColor: color.optional(),
    lineHeight: z.number().min(1).max(3).optional(),
    letterSpacing: z.number().min(-2).max(10).optional(),
    padding: z.number().min(0).max(160).optional(),
    margin: z.number().min(0).max(100).optional(),
    gap: z.number().min(0).max(100).optional(),
    borderRadius: z.number().min(0).max(100).optional(),
    borderWidth: z.number().min(0).max(12).optional(),
    borderColor: color.optional(),
    columns: z.number().int().min(1).max(6).optional(),
    proportions: z.enum(["equal", "wide-left", "wide-right"]).optional(),
    alignItems: z.enum(["start", "center", "end", "stretch"]).optional(),
  })
  .strict();
const propsSchema = z
  .object({
    text: z.string().max(20000).optional(),
    level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).optional(),
    url: url.optional(),
    alt: z.string().max(500).optional(),
    caption: z.string().max(1000).optional(),
    href: url.optional(),
    pageId: z.string().max(100).optional(),
    newTab: z.boolean().optional(),
    variant: z.enum(["primary", "secondary", "outline"]).optional(),
    objectFit: z.enum(["cover", "contain"]).optional(),
    aspectRatio: z.enum(["auto", "16/9", "4/3", "1/1", "3/4"]).optional(),
    images: z
      .array(z.object({ url, alt: z.string().max(500) }).strict())
      .max(40)
      .optional(),
    rows: z
      .array(z.array(z.string().max(2000)).min(1).max(12))
      .min(1)
      .max(100)
      .optional(),
    header: z.boolean().optional(),
    items: z
      .array(
        z
          .object({
            question: z.string().max(1000),
            answer: z.string().max(10000),
          })
          .strict(),
      )
      .max(50)
      .optional(),
    icon: z.enum(["info", "book", "award", "calendar"]).optional(),
    reusablePageId: z.string().max(100).optional(),
  })
  .strict();
export type BuilderNode = {
  id: string;
  type: (typeof TYPES)[number];
  props: z.infer<typeof propsSchema>;
  style: z.infer<typeof styleSchema>;
  responsive?: {
    tablet?: z.infer<typeof styleSchema>;
    mobile?: z.infer<typeof styleSchema>;
  };
  children: BuilderNode[];
};
const nodeSchema: z.ZodType<BuilderNode> = z.lazy(() =>
  z
    .object({
      id: z.string().regex(/^[\w-]{1,100}$/),
      type: z.enum(TYPES),
      props: propsSchema,
      style: styleSchema,
      responsive: z
        .object({
          tablet: styleSchema.optional(),
          mobile: styleSchema.optional(),
        })
        .strict()
        .optional(),
      children: z.array(nodeSchema).max(200),
    })
    .strict(),
);
export const documentSchema = z
  .object({
    schemaVersion: z.literal(1),
    title: z.string().trim().min(1).max(200),
    slug: z
      .string()
      .regex(/^\/pages\/[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .max(160),
    metaTitle: z.string().max(200).default(""),
    metaDescription: z.string().max(500).default(""),
    socialImage: url.default(""),
    canonical: z
      .string()
      .max(2048)
      .refine(
        (s) => !s || /^https:\/\/chalapathiuniversity\.edu\.in\//.test(s),
        "Canonical URL must use the university domain",
      )
      .default(""),
    redirectOldSlug: z.boolean().default(true),
    placement: z
      .object({
        kind: z.enum(["standalone", "navigation", "homepage"]),
        parent: z.string().max(200).default(""),
        label: z.string().max(120).default(""),
        position: z.number().int().min(0).max(10000).default(0),
        visible: z.boolean().default(true),
        homeMode: z.enum(["link", "card", "section"]).default("card"),
      })
      .strict(),
    nodes: z.array(nodeSchema).max(200),
  })
  .strict()
  .superRefine((doc, ctx) => {
    const ids = new Set<string>();
    let count = 0;
    function walk(nodes: BuilderNode[], depth = 0) {
      for (const n of nodes) {
        count++;
        if (
          depth > 8 ||
          count > 500 ||
          ids.has(n.id) ||
          (!CONTAINERS.has(n.type) && n.children.length)
        )
          ctx.addIssue({
            code: "custom",
            message:
              "Invalid nesting, duplicate identifiers, or too many components",
          });
        ids.add(n.id);
        if (
          n.type === "table" &&
          n.props.rows?.some((r) => r.length !== n.props.rows![0].length)
        )
          ctx.addIssue({
            code: "custom",
            message: "Table rows must have equal column counts",
          });
        if (
          n.type === "video" &&
          n.props.url &&
          !/^https:\/\/(www\.youtube-nocookie\.com\/embed\/[\w-]+|player\.vimeo\.com\/video\/\d+)$/.test(
            n.props.url,
          )
        )
          ctx.addIssue({
            code: "custom",
            message:
              "Video must use a YouTube privacy embed or Vimeo player URL",
          });
        walk(n.children, depth + 1);
      }
    }
    walk(doc.nodes);
  });
export type BuilderDocument = z.infer<typeof documentSchema>;
