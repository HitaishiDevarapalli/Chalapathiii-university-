import { createResearchTable, MAX_TABLE_COLUMNS, MAX_TABLE_ROWS, ResearchCellBorder, ResearchTable, ResearchTableCell, researchTableSchema } from "../data/researchTable";
import type * as SheetJS from "xlsx";

interface ExcelWorkbook { book: SheetJS.WorkBook & { files?: Record<string, { content?: Uint8Array | string }>; Directory?: { workbooks?: string[] } }; library: typeof SheetJS; name: string; sheetNames: string[]; }
export interface ExcelTablePreview { table: ResearchTable; warnings: string[]; range: string; }
const children = (element: Element | Document | undefined, name: string): Element[] => element ? Array.from(element instanceof Document ? element.documentElement.children : element.children).filter(node => node.localName === name) : [];
const child = (element: Element | Document | undefined, name: string) => children(element, name)[0];
const descendants = (element: Element | Document | undefined, name: string): Element[] => element ? Array.from(element.getElementsByTagNameNS("*", name)) : [];
const attr = (element: Element | undefined, name: string, fallback = "") => element?.getAttribute(name) ?? fallback;
const number = (element: Element | undefined, name: string, fallback: number) => { const value = Number(attr(element, name, String(fallback))); return Number.isFinite(value) ? value : fallback; };
const on = (element?: Element) => !!element && !["0", "false", "none"].includes(attr(element, "val", "1"));
const xml = (book: ExcelWorkbook["book"], name: string): Document | undefined => {
  const content = book.files?.[name.replace(/^\//, "")]?.content;
  if (!content) return;
  const source = typeof content === "string" ? content : new TextDecoder().decode(content);
  const result = new DOMParser().parseFromString(source, "application/xml");
  if (result.getElementsByTagName("parsererror").length) throw new Error("The Excel file contains invalid worksheet or style XML.");
  return result;
};
const pathJoin = (base: string, target: string) => {
  const parts = (target.startsWith("/") ? target : base.slice(0, base.lastIndexOf("/") + 1) + target).split("/");
  const result: string[] = []; for (const part of parts) { if (part === "..") result.pop(); else if (part && part !== ".") result.push(part); }
  return result.join("/");
};
const indexedColors = ["000000", "FFFFFF", "FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "000000", "FFFFFF", "FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "800000", "008000", "000080", "808000", "800080", "008080", "C0C0C0", "808080", "9999FF", "993366", "FFFFCC", "CCFFFF", "660066", "FF8080", "0066CC", "CCCCFF", "000080", "FF00FF", "FFFF00", "00FFFF", "800080", "800000", "008080", "0000FF", "00CCFF", "CCFFFF", "CCFFCC", "FFFF99", "99CCFF", "FF99CC", "CC99FF", "FFCC99", "3366FF", "33CCCC", "99CC00", "FFCC00", "FF9900", "FF6600", "666699", "969696", "003366", "339966", "003300", "333300", "993300", "993366", "333399", "333333"];

export async function readResearchExcel(file: File): Promise<ExcelWorkbook> {
  if (!/\.xlsx$/i.test(file.name)) throw new Error("Save the workbook as Excel Workbook (.xlsx), then upload it here.");
  if (!file.size || file.size > 10 * 1024 * 1024) throw new Error("Choose an Excel workbook up to 10 MB.");
  const library = await import("xlsx");
  const bytes = new Uint8Array(await file.arrayBuffer());
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) throw new Error("This is not a valid .xlsx workbook. Open it in Excel and save it as .xlsx.");
  let book: ExcelWorkbook["book"];
  try { book = library.read(bytes, { type: "array", cellStyles: true, cellNF: true, cellText: true, cellHTML: false, bookFiles: true }); }
  catch { throw new Error("The Excel workbook could not be opened. Use an unencrypted .xlsx file."); }
  const sheetNames = book.SheetNames.filter((_name, index) => !book.Workbook?.Sheets?.[index]?.Hidden);
  if (!sheetNames.length || !book.files) throw new Error("The workbook has no visible worksheets to import.");
  return { book, library, name: file.name, sheetNames };
}

export function previewResearchExcel(source: ExcelWorkbook, sheetName: string, requestedRange = "", headerRows = 1): ExcelTablePreview {
  const { book, library } = source, worksheet = book.Sheets[sheetName];
  if (!worksheet) throw new Error("Choose a worksheet from this workbook.");
  const workbookPath = (book.Directory?.workbooks?.[0] || "xl/workbook.xml").replace(/^\//, "");
  const workbookXml = xml(book, workbookPath);
  const relationPath = pathJoin(workbookPath, `_rels/${workbookPath.split("/").pop()}.rels`);
  const relationships = descendants(xml(book, relationPath), "Relationship");
  const targetFor = (type: string) => relationships.find(item => attr(item, "Type").endsWith(`/${type}`));
  const sheetNode = descendants(workbookXml, "sheet").find(item => attr(item, "name") === sheetName);
  const relationId = sheetNode?.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id") || attr(sheetNode, "r:id");
  const sheetRelation = relationships.find(item => attr(item, "Id") === relationId);
  if (!sheetRelation) throw new Error("The worksheet could not be located in this workbook.");
  const sheetXml = xml(book, pathJoin(workbookPath, attr(sheetRelation, "Target")));
  const styles = xml(book, pathJoin(workbookPath, attr(targetFor("styles"), "Target", "styles.xml")))?.documentElement;
  const themeXml = xml(book, pathJoin(workbookPath, attr(targetFor("theme"), "Target", "theme/theme1.xml")));
  const scheme = descendants(themeXml, "clrScheme")[0];
  const theme = ["lt1", "dk1", "lt2", "dk2", "accent1", "accent2", "accent3", "accent4", "accent5", "accent6", "hlink", "folHlink"].map(key => {
    const node = child(scheme, key)?.firstElementChild;
    return attr(node || undefined, "lastClr", attr(node || undefined, "val"));
  });
  const warnings = new Set<string>();
  const resolveColor = (node?: Element, fallback = "#000000") => {
    if (!node) return fallback;
    let raw = attr(node, "rgb").slice(-6);
    if (!raw && node.hasAttribute("theme")) raw = theme[number(node, "theme", 0)] || "";
    if (!raw && node.hasAttribute("indexed")) raw = indexedColors[number(node, "indexed", 0)] || "";
    if (!/^[0-9a-f]{6}$/i.test(raw)) return fallback;
    const tint = Math.max(-1, Math.min(1, number(node, "tint", 0)));
    if (tint) raw = [0, 2, 4].map(index => { const channel = parseInt(raw.slice(index, index + 2), 16); return Math.round(tint < 0 ? channel * (1 + tint) : channel + (255 - channel) * tint).toString(16).padStart(2, "0"); }).join("");
    return `#${raw.toLowerCase()}`;
  };
  const fonts = children(child(styles, "fonts"), "font"), fills = children(child(styles, "fills"), "fill"), borders = children(child(styles, "borders"), "border");
  const bases = children(child(styles, "cellStyleXfs"), "xf"), formats = children(child(styles, "cellXfs"), "xf");
  const edge = (node: Element | undefined): ResearchCellBorder => {
    const style = attr(node, "style");
    return { style: !style || style === "none" ? "none" : style === "double" ? "double" : style.toLowerCase().includes("dash") ? "dashed" : style === "dotted" || style === "hair" ? "dotted" : "solid", width: !style || style === "none" ? 0 : style === "double" ? 3 : style === "thick" ? 3 : style.toLowerCase().includes("medium") ? 2 : style === "hair" ? .5 : 1, color: resolveColor(child(node, "color")) };
  };
  const cellStyle = (styleId: number): Omit<ResearchTableCell, "text"> => {
    const format = formats[styleId] || formats[0], base = bases[number(format, "xfId", 0)];
    const font = fonts[number(format, "fontId", number(base, "fontId", 0))], fill = fills[number(format, "fillId", number(base, "fillId", 0))];
    const border = borders[number(format, "borderId", number(base, "borderId", 0))];
    const alignment = child(format, "alignment") || child(base, "alignment");
    const pattern = child(fill, "patternFill"), patternType = attr(pattern, "patternType", "none");
    if (patternType !== "none" && patternType !== "solid" && patternType !== "gray125") warnings.add("Pattern and gradient fills use their nearest solid colour.");
    const name = attr(child(font, "name"), "val", "Calibri");
    const horizontal = attr(alignment, "horizontal"), vertical = attr(alignment, "vertical", "bottom");
    return { bold: on(child(font, "b")), italic: on(child(font, "i")), underline: on(child(font, "u")),
      fontFamily: /^[\p{L}\p{N} ._-]{1,80}$/u.test(name) ? name : "Arial", fontSize: Math.max(6, Math.min(128, number(child(font, "sz"), "val", 11) * 4 / 3)),
      color: resolveColor(child(font, "color")), background: patternType === "none" || patternType === "gray125" ? "#ffffff" : resolveColor(child(pattern, "fgColor"), "#ffffff"),
      align: ["center", "centerContinuous"].includes(horizontal) ? "center" : horizontal === "right" ? "right" : "left", verticalAlign: vertical === "center" ? "middle" : vertical === "top" ? "top" : "bottom", wrapText: attr(alignment, "wrapText") === "1" || attr(alignment, "wrapText") === "true",
      borderTop: edge(child(border, "top")), borderRight: edge(child(border, "right")), borderBottom: edge(child(border, "bottom")), borderLeft: edge(child(border, "left")),
    };
  };
  const cellNodes = new Map(descendants(sheetXml, "c").map(node => [attr(node, "r"), node]));
  const rowNodes = new Map(descendants(sheetXml, "row").map(node => [number(node, "r", 1) - 1, node]));
  const columnNodes = descendants(sheetXml, "col");
  const keys = Object.keys(worksheet).filter(key => !key.startsWith("!") && /[A-Za-z]+\d+/.test(key));
  if (!keys.length || !worksheet["!ref"]) throw new Error("This worksheet has no cells to import.");
  let used = library.utils.decode_range(worksheet["!ref"]);
  if (requestedRange.trim()) {
    if (!/^\$?[A-Za-z]{1,3}\$?[1-9]\d*(?::\$?[A-Za-z]{1,3}\$?[1-9]\d*)?$/.test(requestedRange.trim())) throw new Error("Enter a range such as A1:C20.");
    used = library.utils.decode_range(requestedRange.trim().replace(/\$/g, "").toUpperCase());
  }
  const merges = worksheet["!merges"] || [];
  const height = used.e.r - used.s.r + 1, width = used.e.c - used.s.c + 1;
  if (height < 1 || width < 1 || height > MAX_TABLE_ROWS || width > MAX_TABLE_COLUMNS) throw new Error("Choose a cell range with up to 200 rows and 20 columns, such as A1:C20.");
  const table = createResearchTable(height, width);
  table.headerRows = headerRows; table.padding = 2; table.lineHeight = 1.2; table.borders = "none";
  const widths = Array.from({ length: width }, (_, index) => { const column = worksheet["!cols"]?.[index + used.s.c]; return Math.max(2, column?.wpx || (column?.wch ? column.wch * 7 + 5 : 64)); });
  const totalWidth = widths.reduce((a, b) => a + b, 0);
  table.widthPixels = Math.max(100, totalWidth); table.columnWidths = widths.map(value => value / totalWidth * 100);
  table.rowHeights = Array.from({ length: height }, (_, index) => { const row = rowNodes.get(index + used.s.r); return row?.hasAttribute("ht") ? Math.max(1, number(row, "ht", 15) * 4 / 3) : null; });
  table.rows = Array.from({ length: height }, (_, r) => Array.from({ length: width }, (_, c) => {
    const address = library.utils.encode_cell({ r: r + used.s.r, c: c + used.s.c }), cell = worksheet[address];
    if (cell?.f && (cell.v === undefined || cell.v === null)) throw new Error(`${address} has a formula without a saved result. Recalculate and save the workbook in Excel, then upload it again.`);
    const node = cellNodes.get(address), row = rowNodes.get(r + used.s.r), column = columnNodes.find(node => number(node, "min", 1) <= c + used.s.c + 1 && number(node, "max", 1) >= c + used.s.c + 1);
    const styleId = node?.hasAttribute("s") ? number(node, "s", 0) : row?.hasAttribute("s") ? number(row, "s", 0) : number(column, "style", 0);
    const style = cellStyle(styleId);
    if (cell?.t === "n" && !attr(child(formats[styleId], "alignment"), "horizontal")) style.align = "right";
    return { text: cell ? cell.w ?? (cell.v === undefined || cell.v === null ? "" : library.utils.format_cell(cell)) : "", ...style };
  }));
  for (const merge of merges) {
    if (merge.e.r < used.s.r || merge.s.r > used.e.r || merge.e.c < used.s.c || merge.s.c > used.e.c) continue;
    if (merge.s.r < used.s.r || merge.s.c < used.s.c || merge.e.r > used.e.r || merge.e.c > used.e.c) throw new Error("The chosen range cuts through a merged cell. Include the entire merged area.");
    const top = merge.s.r - used.s.r, left = merge.s.c - used.s.c, bottom = merge.e.r - used.s.r, right = merge.e.c - used.s.c;
    const anchor = table.rows[top][left]!;
    if (!anchor) throw new Error("The worksheet contains overlapping merged cells.");
    for (const [key, row, col] of [["borderBottom", bottom, left], ["borderRight", top, right]] as const) { const edge = table.rows[row][col]?.[key]; if (edge && edge.style !== "none") anchor[key] = edge; }
    anchor.rowSpan = bottom - top + 1; anchor.colSpan = right - left + 1;
    for (let r = top; r <= bottom; r++) for (let c = left; c <= right; c++) if (r !== top || c !== left) table.rows[r][c] = null;
  }
  if (descendants(sheetXml, "conditionalFormatting").length) warnings.add("Conditional formatting rules are not imported; the saved base cell styles are used.");
  if (descendants(sheetXml, "drawing").length) warnings.add("Images and charts are not included in the editable table.");
  if (keys.some(key => worksheet[key]?.f)) warnings.add("Formula cells use their saved display values; formulas are not recalculated on the website.");
  if (descendants(sheetXml, "row").some(row => attr(row, "hidden") === "1") || columnNodes.some(column => attr(column, "hidden") === "1")) warnings.add("Hidden rows and columns are included. Choose a cell range or remove them in the table builder if needed.");
  const checked = researchTableSchema.safeParse(table);
  if (!checked.success) throw new Error(checked.error.issues[0].message + " Adjust the range or header-row setting and try again.");
  return { table, warnings: [...warnings], range: library.utils.encode_range(used) };
}
