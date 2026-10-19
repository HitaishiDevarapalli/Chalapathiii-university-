import type { CSSProperties } from "react";
import type { ResearchTable as TableData, ResearchTableCell, ResearchCellBorder } from "../../data/researchTable";
const borderStyle = (border?: ResearchCellBorder) => border ? `${border.width}px ${border.style} ${border.color}` : undefined;

export const researchCellStyle = (cell: ResearchTableCell): CSSProperties => ({
  textAlign: cell.align || "left", verticalAlign: cell.verticalAlign || "top",
  ...(cell.bold !== undefined ? { fontWeight: cell.bold ? 700 : 400 } : {}), fontStyle: cell.italic ? "italic" : undefined,
  textDecoration: cell.underline ? "underline" : undefined, background: cell.background, color: cell.color,
  fontFamily: cell.fontFamily ? `${cell.fontFamily}, Arial, sans-serif` : undefined, fontSize: cell.fontSize,
  whiteSpace: cell.wrapText === false ? "pre" : "pre-wrap", overflowWrap: cell.wrapText === false ? "normal" : "anywhere", overflow: cell.wrapText === false ? "hidden" : undefined,
  borderTop: borderStyle(cell.borderTop), borderRight: borderStyle(cell.borderRight), borderBottom: borderStyle(cell.borderBottom), borderLeft: borderStyle(cell.borderLeft),
});
export const researchTableStyle = (table: TableData): CSSProperties => ({
  "--rt-header-bg": table.headerBackground || "#f9eeee", "--rt-header-color": table.headerColor || "#222222",
  "--rt-border": table.borderColor || "#e2e2e2", "--rt-padding": `${table.padding ?? 12}px`,
  fontSize: table.fontSize || 15, minWidth: table.minWidth || 640,
  ...(table.widthPixels ? { width: table.widthPixels, minWidth: table.widthPixels } : {}), lineHeight: table.lineHeight,
} as CSSProperties);

export function ResearchTable({ table }: { table: TableData }) {
  const renderRow = (row: TableData["rows"][number], index: number) => <tr key={index} style={table.rowHeights?.[index] ? { height: table.rowHeights[index]! } : undefined}>{row.map((cell, column) => {
    if (!cell) return null;
    const Tag = index < table.headerRows ? "th" : "td";
    return <Tag key={column} rowSpan={cell.rowSpan || 1} colSpan={cell.colSpan || 1} scope={Tag === "th" ? (cell.colSpan || 1) > 1 ? "colgroup" : "col" : undefined} style={researchCellStyle(cell)}>{cell.text || "\u00a0"}</Tag>;
  })}</tr>;
  return <div className="research-table-container"><p className="research-table-hint">Scroll sideways to view all columns.</p><div className="research-table-scroll" role="region" aria-label={table.caption || "Data table"} tabIndex={0}>
    <table className={`research-data-table rt-borders-${table.borders || "grid"}${table.striped ? " rt-striped" : ""}`} style={researchTableStyle(table)}>
      {table.caption && <caption>{table.caption}</caption>}
      <colgroup>{table.columnWidths.map((width, index) => <col key={index} style={{ width: `${width}%` }} />)}</colgroup>
      {table.headerRows > 0 && <thead>{table.rows.slice(0, table.headerRows).map(renderRow)}</thead>}
      <tbody>{table.rows.slice(table.headerRows).map((row, index) => renderRow(row, index + table.headerRows))}</tbody>
    </table>
  </div></div>;
}
