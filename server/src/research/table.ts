import { z } from "zod";

export interface ResearchTableCell {
  text: string; rowSpan?: number; colSpan?: number;
  bold?: boolean; italic?: boolean; underline?: boolean;
  align?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  background?: string; color?: string;
  fontFamily?: string; fontSize?: number; wrapText?: boolean;
  borderTop?: ResearchCellBorder; borderRight?: ResearchCellBorder; borderBottom?: ResearchCellBorder; borderLeft?: ResearchCellBorder;
}
export interface ResearchCellBorder { style: "none" | "solid" | "dashed" | "dotted" | "double"; width: number; color: string; }
export interface ResearchTable {
  rows: (ResearchTableCell | null)[][];
  columnWidths: number[];
  headerRows: number;
  caption?: string;
  headerBackground?: string; headerColor?: string; borderColor?: string;
  borders?: "grid" | "horizontal" | "none";
  striped?: boolean; fontSize?: number; padding?: number; minWidth?: number;
  rowHeights?: (number | null)[]; widthPixels?: number; lineHeight?: number;
}
export interface TablePosition { row: number; col: number; }
export interface TableRange { top: number; left: number; bottom: number; right: number; }
interface Anchor extends TablePosition { cell: ResearchTableCell; }
export const MAX_TABLE_ROWS = 200;
export const MAX_TABLE_COLUMNS = 20;
const emptyCell = (): ResearchTableCell => ({ text: "" });
const spanRows = (cell: ResearchTableCell) => cell.rowSpan || 1;
const spanCols = (cell: ResearchTableCell) => cell.colSpan || 1;
const anchors = (table: ResearchTable): Anchor[] => table.rows.flatMap((row, r) => row.flatMap((cell, c) => cell ? [{ row: r, col: c, cell: { ...cell } }] : []));
const evenWidths = (count: number) => Array.from({ length: count }, () => 100 / count);
const normalizedWidths = (widths: number[]) => { const sum = widths.reduce((a, b) => a + b, 0); return widths.map(width => width / sum * 100); };

export function createResearchTable(rowCount = 4, colCount = 3): ResearchTable {
  return { rows: Array.from({ length: rowCount }, (_, row) => Array.from({ length: colCount }, (_, col) => ({ text: row === 0 ? `Column ${col + 1}` : "" }))), columnWidths: evenWidths(colCount), headerRows: 1, caption: "", headerBackground: "#f9eeee", headerColor: "#222222", borderColor: "#e2e2e2", borders: "grid", fontSize: 15, padding: 12, minWidth: 640 };
}

/** Every covered slot is null; spans must fit and cannot overlap or cross the header boundary. */
export function tableGeometryError(table: ResearchTable): string | undefined {
  const height = table.rows.length, width = table.columnWidths.length;
  if (!height || height > MAX_TABLE_ROWS || !width || width > MAX_TABLE_COLUMNS || table.rows.some(row => row.length !== width)) return "Use a rectangular table with 1–200 rows and 1–20 columns.";
  if (table.headerRows > height) return "The number of header rows cannot exceed the table height.";
  const occupied = Array.from({ length: height }, () => Array(width).fill(false));
  for (let row = 0; row < height; row++) for (let col = 0; col < width; col++) {
    const cell = table.rows[row][col];
    if (occupied[row][col]) { if (cell !== null) return "Merged cells overlap another cell."; continue; }
    if (!cell) return "A covered cell must belong to a merged cell.";
    const bottom = row + spanRows(cell), right = col + spanCols(cell);
    if (bottom > height || right > width) return "A merged cell extends beyond the table.";
    if (row < table.headerRows && bottom > table.headerRows) return "Merged cells cannot cross from a header row into the table body.";
    for (let r = row; r < bottom; r++) for (let c = col; c < right; c++) {
      if (occupied[r][c]) return "Merged cells overlap another cell.";
      occupied[r][c] = true;
      if ((r !== row || c !== col) && table.rows[r][c] !== null) return "Split or clear cells covered by a merged cell.";
    }
  }
}
const color = z.string().regex(/^#[0-9a-f]{6}$/i, "Use a six-digit hex colour.");
const borderSchema = z.object({ style: z.enum(["none", "solid", "dashed", "dotted", "double"]), width: z.number().min(0).max(5), color });
const cellSchema = z.object({
  text: z.string().max(20000), rowSpan: z.number().int().min(1).max(MAX_TABLE_ROWS).optional(), colSpan: z.number().int().min(1).max(MAX_TABLE_COLUMNS).optional(),
  bold: z.boolean().optional(), italic: z.boolean().optional(), underline: z.boolean().optional(),
  align: z.enum(["left", "center", "right"]).optional(), verticalAlign: z.enum(["top", "middle", "bottom"]).optional(), background: color.optional(), color: color.optional(),
  fontFamily: z.string().regex(/^[\p{L}\p{N} ._-]{1,80}$/u).optional(), fontSize: z.number().min(6).max(128).optional(), wrapText: z.boolean().optional(),
  borderTop: borderSchema.optional(), borderRight: borderSchema.optional(), borderBottom: borderSchema.optional(), borderLeft: borderSchema.optional(),
});
export const researchTableSchema: z.ZodType<ResearchTable> = z.object({
  rows: z.array(z.array(cellSchema.nullable()).min(1).max(MAX_TABLE_COLUMNS)).min(1).max(MAX_TABLE_ROWS),
  columnWidths: z.array(z.number().min(.01).max(100)).min(1).max(MAX_TABLE_COLUMNS), headerRows: z.number().int().min(0).max(5),
  caption: z.string().max(1000).optional(), headerBackground: color.optional(), headerColor: color.optional(), borderColor: color.optional(),
  borders: z.enum(["grid", "horizontal", "none"]).optional(), striped: z.boolean().optional(),
  fontSize: z.number().int().min(12).max(24).optional(), padding: z.number().int().min(0).max(24).optional(), minWidth: z.number().int().min(320).max(2400).optional(),
  rowHeights: z.array(z.number().min(1).max(2000).nullable()).max(MAX_TABLE_ROWS).optional(), widthPixels: z.number().min(100).max(20000).optional(), lineHeight: z.number().min(1).max(3).optional(),
}).superRefine((table, context) => {
  const error = tableGeometryError(table);
  if (error) context.addIssue({ code: "custom", message: error });
  if (table.rowHeights && table.rowHeights.length !== table.rows.length) context.addIssue({ code: "custom", message: "Row heights must match the number of rows." });
  if (Math.abs(table.columnWidths.reduce((a, b) => a + b, 0) - 100) > .01) context.addIssue({ code: "custom", message: "Column widths must total 100%." });
});

export function tableAnchorAt(table: ResearchTable, position: TablePosition): Anchor {
  const found = anchors(table).find(item => item.row <= position.row && item.row + spanRows(item.cell) > position.row && item.col <= position.col && item.col + spanCols(item.cell) > position.col);
  if (!found) throw new Error("Select a cell inside the table.");
  return found;
}
export function tableSelection(table: ResearchTable, start: TablePosition, end: TablePosition): TableRange {
  const range = { top: Math.min(start.row, end.row), bottom: Math.max(start.row, end.row), left: Math.min(start.col, end.col), right: Math.max(start.col, end.col) };
  let changed = true;
  while (changed) {
    changed = false;
    for (const { row, col, cell } of anchors(table)) {
      const bottom = row + spanRows(cell) - 1, right = col + spanCols(cell) - 1;
      if (row <= range.bottom && bottom >= range.top && col <= range.right && right >= range.left) {
        if (row < range.top || col < range.left || bottom > range.bottom || right > range.right) changed = true;
        range.top = Math.min(range.top, row); range.bottom = Math.max(range.bottom, bottom); range.left = Math.min(range.left, col); range.right = Math.max(range.right, right);
      }
    }
  }
  return range;
}
function rebuild(table: ResearchTable, height: number, width: number, items: Anchor[]): ResearchTable {
  const rows: ResearchTable["rows"] = Array.from({ length: height }, () => Array.from({ length: width }, emptyCell));
  for (const { row, col, cell } of items) {
    rows[row][col] = cell;
    for (let r = row; r < row + spanRows(cell); r++) for (let c = col; c < col + spanCols(cell); c++) if (r !== row || c !== col) rows[r][c] = null;
  }
  return { ...table, rows };
}
export function mergeTableCells(table: ResearchTable, range: TableRange): ResearchTable {
  if (range.top < table.headerRows && range.bottom >= table.headerRows) throw new Error("Select cells entirely within the header or entirely within the table body.");
  const rows = table.rows.map(row => row.map(cell => cell ? { ...cell } : null));
  const cell = { ...rows[range.top][range.left]! };
  cell.text = anchors(table).filter(item => item.row >= range.top && item.row <= range.bottom && item.col >= range.left && item.col <= range.right).map(item => item.cell.text).filter(Boolean).join("\n");
  cell.rowSpan = range.bottom - range.top + 1; cell.colSpan = range.right - range.left + 1;
  for (let r = range.top; r <= range.bottom; r++) for (let c = range.left; c <= range.right; c++) rows[r][c] = null;
  rows[range.top][range.left] = cell;
  return { ...table, rows };
}
export function splitTableCells(table: ResearchTable, range: TableRange): ResearchTable {
  const rows = table.rows.map(row => row.map(cell => cell ? { ...cell } : null));
  for (const { row, col, cell } of anchors(table)) if (row >= range.top && row <= range.bottom && col >= range.left && col <= range.right) {
    for (let r = row; r < row + spanRows(cell); r++) for (let c = col; c < col + spanCols(cell); c++) rows[r][c] = { ...cell, text: r === row && c === col ? cell.text : "", rowSpan: 1, colSpan: 1 };
  }
  return { ...table, rows };
}
export function changeTableLine(table: ResearchTable, axis: "row" | "column", index: number, remove = false): ResearchTable {
  const count = axis === "row" ? table.rows.length : table.columnWidths.length;
  if (remove && count === 1) throw new Error("Keep at least one row and one column.");
  if (!remove && count >= (axis === "row" ? MAX_TABLE_ROWS : MAX_TABLE_COLUMNS)) throw new Error(`Maximum ${axis === "row" ? MAX_TABLE_ROWS : MAX_TABLE_COLUMNS} ${axis}s per table.`);
  const key = axis === "row" ? "row" : "col", span = axis === "row" ? "rowSpan" : "colSpan";
  const items = anchors(table).flatMap(item => {
    const first = item[key], length = item.cell[span] || 1;
    if (!remove) {
      if (first >= index) item[key]++;
      else if (first + length > index) item.cell[span] = length + 1;
    } else if (first > index) item[key]--;
    else if (first + length > index) { if (length === 1) return []; item.cell[span] = length - 1; }
    return [item];
  });
  const delta = remove ? -1 : 1;
  const next = rebuild(table, table.rows.length + (axis === "row" ? delta : 0), table.columnWidths.length + (axis === "column" ? delta : 0), items);
  if (axis === "column") {
    let widths = [...table.columnWidths];
    if (remove) widths.splice(index, 1);
    else {
      const added = 100 / (count + 1);
      widths = widths.map(width => .01 + (width - .01) / (100 - count * .01) * (100 - added - count * .01));
      widths.splice(index, 0, added);
    }
    next.columnWidths = normalizedWidths(widths);
  } else {
    next.headerRows = Math.min(5, next.rows.length, table.headerRows + (index < table.headerRows ? delta : 0));
    if (table.rowHeights) { next.rowHeights = [...table.rowHeights]; if (remove) next.rowHeights.splice(index, 1); else next.rowHeights.splice(index, 0, null); }
  }
  return next;
}
export function moveTableLine(table: ResearchTable, axis: "row" | "column", index: number, direction: -1 | 1): ResearchTable {
  const count = axis === "row" ? table.rows.length : table.columnWidths.length, target = index + direction;
  if (target < 0 || target >= count) return table;
  const key = axis === "row" ? "row" : "col", span = axis === "row" ? "rowSpan" : "colSpan";
  const map = (value: number) => value === index ? target : value === target ? index : value;
  const items = anchors(table).map(item => {
    const positions = Array.from({ length: item.cell[span] || 1 }, (_, offset) => map(item[key] + offset)).sort((a, b) => a - b);
    if (positions.some((position, i) => i > 0 && position !== positions[i - 1] + 1)) throw new Error("Split the merged cells before moving this row or column.");
    return { ...item, [key]: positions[0] };
  });
  const next = rebuild(table, table.rows.length, table.columnWidths.length, items);
  if (axis === "column") { next.columnWidths = [...table.columnWidths]; [next.columnWidths[index], next.columnWidths[target]] = [next.columnWidths[target], next.columnWidths[index]]; }
  else if (table.rowHeights) { next.rowHeights = [...table.rowHeights]; [next.rowHeights[index], next.rowHeights[target]] = [next.rowHeights[target], next.rowHeights[index]]; }
  return next;
}
export function setTableColumnWidth(table: ResearchTable, column: number, width: number): ResearchTable {
  if (table.columnWidths.length === 1) return { ...table, columnWidths: [100] };
  const value = Math.max(.01, Math.min(100 - (table.columnWidths.length - 1) * .01, width));
  const remainder = 100 - table.columnWidths[column];
  const extra = remainder - (table.columnWidths.length - 1) * .01;
  const widths = table.columnWidths.map((current, index) => index === column ? value : extra < .00001 ? (100 - value) / (table.columnWidths.length - 1) : .01 + (current - .01) / extra * (100 - value - (table.columnWidths.length - 1) * .01));
  return { ...table, columnWidths: normalizedWidths(widths) };
}
export function researchEligibilityTable(): ResearchTable {
  const table = createResearchTable(8, 3);
  table.caption = "Programme-wise Eligibility"; table.columnWidths = [23, 26, 51]; table.minWidth = 720;
  const values = [
    ["School", "Ph.D. Programme", "Minimum Eligibility"],
    ["School of Engineering", "Civil Engineering", "Enter the approved eligibility criteria."],
    ["", "Electronics & Communication Engineering", "Enter the approved eligibility criteria."],
    ["", "Electrical & Electronics Engineering", "Enter the approved eligibility criteria."],
    ["", "Mechanical Engineering", "Enter the approved eligibility criteria."],
    ["School of Computing Sciences", "Computer Science & Engineering", "Enter the approved eligibility criteria."],
    ["School of Sciences and Humanities", "Mathematics", "Enter the approved eligibility criteria."],
    ["", "Physics", "Enter the approved eligibility criteria."],
  ];
  table.rows = values.map(row => row.map(text => ({ text })));
  return mergeTableCells(mergeTableCells(table, { top: 1, bottom: 4, left: 0, right: 0 }), { top: 6, bottom: 7, left: 0, right: 0 });
}

/** Parses quoted TSV/CSV, including embedded newlines and escaped quote characters. */
export function parseTablePaste(value: string, delimiter = value.includes("\t") ? "\t" : ","): string[][] {
  const result: string[][] = [[]]; let cell = "", quoted = false;
  const text = value.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"' && (quoted || !cell)) { if (quoted && text[index + 1] === '"') { cell += '"'; index++; } else quoted = !quoted; }
    else if (!quoted && (char === delimiter || char === "\n")) { result[result.length - 1].push(cell); cell = ""; if (char === "\n") result.push([]); }
    else cell += char;
  }
  if (quoted) throw new Error("A quoted cell is incomplete. Check the pasted data.");
  result[result.length - 1].push(cell);
  while (result.length > 1 && result[result.length - 1].every(cell => !cell)) result.pop();
  const columns = Math.max(...result.map(row => row.length));
  if (result.length > MAX_TABLE_ROWS || columns > MAX_TABLE_COLUMNS) throw new Error("Paste no more than 200 rows and 20 columns.");
  return result.map(row => Array.from({ length: columns }, (_, index) => row[index] || ""));
}
