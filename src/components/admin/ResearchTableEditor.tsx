import { useEffect, useRef, useState } from "react";
import {
  ResearchTable, ResearchTableCell, TablePosition, changeTableLine, createResearchTable,
  mergeTableCells, moveTableLine, parseTablePaste, researchEligibilityTable, researchTableSchema,
  setTableColumnWidth, splitTableCells, tableAnchorAt, tableSelection,
} from "../../data/researchTable";
import { researchCellStyle, researchTableStyle } from "../research/ResearchTable";
import { ResearchNumberField } from "./ResearchNumberField";
import "../../styles/research-table-editor.css";

export function ResearchTableEditor({ value, onChange, onClose }: {
  value: ResearchTable; onChange: (table: ResearchTable) => void; onClose: () => void;
}) {
  const [table, setTable] = useState(value);
  const [start, setStart] = useState<TablePosition>({ row: 0, col: 0 });
  const [end, setEnd] = useState<TablePosition>({ row: 0, col: 0 });
  const [undo, setUndo] = useState<ResearchTable[]>([]), [redo, setRedo] = useState<ResearchTable[]>([]);
  const [error, setError] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false), [pasted, setPasted] = useState("");
  const [delimiter, setDelimiter] = useState("auto"), [pasteHeader, setPasteHeader] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null), textInput = useRef<HTMLTextAreaElement>(null);
  const dragging = useRef(false);
  const active = tableAnchorAt(table, start);
  const range = tableSelection(table, start, end);
  const selected = table.rows.flatMap((row, r) => row.flatMap((cell, c) => cell && r >= range.top && r <= range.bottom && c >= range.left && c <= range.right ? [cell] : []));

  useEffect(() => {
    dialog.current?.showModal();
    const finish = () => { dragging.current = false; };
    window.addEventListener("pointerup", finish); window.addEventListener("pointercancel", finish);
    return () => { window.removeEventListener("pointerup", finish); window.removeEventListener("pointercancel", finish); };
  }, []);
  const commit = (next: ResearchTable) => {
    const checked = researchTableSchema.safeParse(next);
    if (!checked.success) { setError(checked.error.issues[0].message); return false; }
    const clamp = (position: TablePosition) => ({ row: Math.min(position.row, next.rows.length - 1), col: Math.min(position.col, next.columnWidths.length - 1) });
    setStart(clamp(start)); setEnd(clamp(end));
    setTable(next); onChange(next); setError(""); return true;
  };
  const apply = (operation: ResearchTable | (() => ResearchTable)) => {
    try {
      const next = typeof operation === "function" ? operation() : operation;
      if (next === table) return;
      if (commit(next)) { setUndo(previous => [...previous.slice(-39), table]); setRedo([]); }
    } catch (error) { setError(error instanceof Error ? error.message : "This table change could not be applied."); }
  };
  const patchCells = (patch: Partial<ResearchTableCell>, textOnly = false) => apply({ ...table, rows: table.rows.map((row, r) => row.map((cell, c) => {
    const included = textOnly ? r === active.row && c === active.col : r >= range.top && r <= range.bottom && c >= range.left && c <= range.right;
    return cell && included ? { ...cell, ...patch } : cell;
  })) });
  const select = (position: TablePosition, extend: boolean) => {
    if (!extend) setStart(position);
    setEnd(position); setError("");
  };
  const line = (axis: "row" | "column", index: number, remove = false) => apply(() => changeTableLine(table, axis, index, remove));
  const move = (axis: "row" | "column", direction: -1 | 1) => apply(() => moveTableLine(table, axis, axis === "row" ? active.row : active.col, direction));
  const history = (back: boolean) => {
    const stack = back ? undo : redo, previous = stack[stack.length - 1]; if (!previous) return;
    if (commit(previous)) {
      if (back) { setUndo(stack.slice(0, -1)); setRedo(next => [...next, table]); }
      else { setRedo(stack.slice(0, -1)); setUndo(next => [...next, table]); }
    }
  };
  const importData = () => apply(() => {
    if (!pasted.trim()) throw new Error("Paste some spreadsheet cells or CSV data first.");
    const cells = parseTablePaste(pasted, delimiter === "auto" ? undefined : delimiter === "tab" ? "\t" : ",");
    const next = createResearchTable(cells.length, cells[0].length);
    setPasteOpen(false);
    return { ...table, rows: cells.map(row => row.map(text => ({ text }))), columnWidths: next.columnWidths, headerRows: pasteHeader ? 1 : 0 };
  });
  const renderRow = (row: ResearchTable["rows"][number], r: number) => <tr key={r}>{row.map((cell, c) => {
    if (!cell) return null;
    const Tag = r < table.headerRows ? "th" : "td";
    const isSelected = r >= range.top && r <= range.bottom && c >= range.left && c <= range.right;
    return <Tag key={c} rowSpan={cell.rowSpan || 1} colSpan={cell.colSpan || 1} style={researchCellStyle(cell)} className={isSelected ? "rt-selected" : ""} data-table-row={r} data-table-col={c}>
      <button type="button" className="rt-cell-button" data-admin-action="view" aria-label={`Select row ${r + 1}, column ${c + 1}`} aria-pressed={isSelected}
        onPointerDown={event => { select({ row: r, col: c }, event.shiftKey); dragging.current = event.pointerType === "mouse"; }}
        onPointerEnter={event => { if (dragging.current && event.buttons === 1) select({ row: r, col: c }, true); }}
        onClick={event => { if (event.detail === 0) select({ row: r, col: c }, event.shiftKey); }}
        onDoubleClick={() => textInput.current?.focus()}
        onKeyDown={event => {
          const delta: Record<string, [number, number]> = { ArrowUp: [-1, 0], ArrowDown: [cell.rowSpan || 1, 0], ArrowLeft: [0, -1], ArrowRight: [0, cell.colSpan || 1] };
          if (event.key === "Enter") { event.preventDefault(); textInput.current?.focus(); }
          if (delta[event.key]) {
            event.preventDefault(); const [dr, dc] = delta[event.key];
            const target = tableAnchorAt(table, { row: Math.max(0, Math.min(table.rows.length - 1, r + dr)), col: Math.max(0, Math.min(table.columnWidths.length - 1, c + dc)) });
            select(target, event.shiftKey);
            dialog.current?.querySelector<HTMLButtonElement>(`[data-table-row="${target.row}"][data-table-col="${target.col}"] button`)?.focus();
          }
        }}>{cell.text || <span className="rt-empty-cell">Empty cell</span>}</button>
    </Tag>;
  })}</tr>;

  return <dialog ref={dialog} className="research-table-dialog research-admin" aria-labelledby="research-table-editor-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className="rt-dialog-heading"><div><h2 id="research-table-editor-title">Table builder</h2><p>Edit cells, combine rows or columns, and style your table. Changes stay in your research draft until you publish.</p></div><button type="button" data-admin-action="view" onClick={onClose}>Done</button></div>
    <div className="rt-topbar"><div className="research-editor-actions">
      <button type="button" className="secondary" data-admin-action="edit" disabled={!undo.length} onClick={() => history(true)}>Undo</button>
      <button type="button" className="secondary" data-admin-action="edit" disabled={!redo.length} onClick={() => history(false)}>Redo</button>
      <button type="button" className="secondary" data-admin-action="edit" onClick={() => apply(researchEligibilityTable())}>Programme eligibility template</button>
      <button type="button" className="secondary" data-admin-action="edit" onClick={() => setPasteOpen(!pasteOpen)}>Paste spreadsheet / CSV</button>
    </div><p>{table.rows.length} rows × {table.columnWidths.length} columns · {selected.length} {selected.length === 1 ? "cell" : "cells"} selected</p></div>
    {error && <p className="rt-error" role="alert">{error}</p>}
    {pasteOpen && <section className="rt-paste-panel"><label>Spreadsheet / CSV data<textarea rows={5} value={pasted} onChange={event => setPasted(event.target.value)} placeholder="Copy cells from Excel or Google Sheets and paste here." /></label><div className="rt-controls-grid"><label>Separator<select value={delimiter} onChange={event => setDelimiter(event.target.value)}><option value="auto">Detect automatically</option><option value="tab">Tab (spreadsheet)</option><option value="comma">Comma (CSV)</option></select></label><label className="rt-checkbox"><input type="checkbox" checked={pasteHeader} onChange={event => setPasteHeader(event.target.checked)} />First row contains headings</label></div><p>Import replaces the current table contents. Undo restores the previous table.</p><button type="button" data-admin-action="edit" onClick={importData}>Import pasted data</button></section>}
    <div className="rt-editor-layout"><section className="rt-grid-area"><p className="rt-tip">Click a cell, then edit Cell text. Shift-click or drag across cells to select a range, then merge. On mobile, use the selection controls below.</p>
      <div className="research-table-scroll rt-editor-scroll" tabIndex={0} role="region" aria-label="Editable table">
        <table className={`research-data-table rt-borders-${table.borders || "grid"}${table.striped ? " rt-striped" : ""}`} style={researchTableStyle(table)}>
          {table.caption && <caption>{table.caption}</caption>}
          <colgroup>{table.columnWidths.map((width, index) => <col key={index} style={{ width: `${width}%` }} />)}</colgroup>
          {table.headerRows > 0 && <thead>{table.rows.slice(0, table.headerRows).map(renderRow)}</thead>}
          <tbody>{table.rows.slice(table.headerRows).map((row, index) => renderRow(row, index + table.headerRows))}</tbody>
        </table>
      </div>
      <details className="rt-appearance" open><summary>Table appearance</summary>
        <label>Table heading / caption<input value={table.caption || ""} maxLength={1000} onChange={event => apply({ ...table, caption: event.target.value })} /></label>
        <div className="rt-controls-grid">
          <ResearchNumberField label="Header rows" value={table.headerRows} min={0} max={Math.min(5, table.rows.length)} onChange={headerRows => apply({ ...table, headerRows })} />
          <ResearchNumberField label="Font size (px)" value={table.fontSize || 15} min={12} max={24} onChange={fontSize => apply({ ...table, fontSize })} />
          <ResearchNumberField label="Cell padding (px)" value={table.padding ?? 12} min={4} max={24} onChange={padding => apply({ ...table, padding })} />
          <ResearchNumberField label="Minimum table width (px)" value={table.minWidth || 640} min={320} max={2400} onChange={minWidth => apply({ ...table, minWidth })} />
          <label>Header background<input type="color" value={table.headerBackground || "#f9eeee"} onChange={event => apply({ ...table, headerBackground: event.target.value })} /></label>
          <label>Header text colour<input type="color" value={table.headerColor || "#222222"} onChange={event => apply({ ...table, headerColor: event.target.value })} /></label>
          <label>Border colour<input type="color" value={table.borderColor || "#e2e2e2"} onChange={event => apply({ ...table, borderColor: event.target.value })} /></label>
          <label>Borders<select value={table.borders || "grid"} onChange={event => apply({ ...table, borders: event.target.value as ResearchTable["borders"] })}><option value="grid">All borders</option><option value="horizontal">Horizontal only</option><option value="none">No borders</option></select></label>
        </div><label className="rt-checkbox"><input type="checkbox" checked={!!table.striped} onChange={event => apply({ ...table, striped: event.target.checked })} />Alternate row shading</label>
      </details>
    </section><aside className="rt-cell-properties"><h3>Row {active.row + 1}, column {active.col + 1}</h3>
      <label>Cell text<textarea ref={textInput} rows={6} maxLength={20000} value={active.cell.text} onChange={event => patchCells({ text: event.target.value }, true)} placeholder="Type the cell content. Enter adds a new line." /></label>
      <div className="rt-format-buttons">{(["bold", "italic", "underline"] as const).map(format => <button key={format} type="button" className="secondary" data-admin-action="edit" aria-pressed={!!active.cell[format]} onClick={() => patchCells({ [format]: !active.cell[format] })}>{format === "bold" ? "Bold" : format === "italic" ? "Italic" : "Underline"}</button>)}</div>
      <div className="rt-controls-grid"><label>Text alignment<select value={active.cell.align || "left"} onChange={event => patchCells({ align: event.target.value as ResearchTableCell["align"] })}><option value="left">Left</option><option value="center">Centre</option><option value="right">Right</option></select></label><label>Vertical alignment<select value={active.cell.verticalAlign || "top"} onChange={event => patchCells({ verticalAlign: event.target.value as ResearchTableCell["verticalAlign"] })}><option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option></select></label><label>Cell background<input type="color" value={active.cell.background || (active.row < table.headerRows ? table.headerBackground || "#f9eeee" : "#ffffff")} onChange={event => patchCells({ background: event.target.value })} /></label><label>Cell text colour<input type="color" value={active.cell.color || "#333333"} onChange={event => patchCells({ color: event.target.value })} /></label></div>
      <button type="button" className="secondary" data-admin-action="edit" onClick={() => apply({ ...table, rows: table.rows.map((row, r) => row.map((cell, c) => cell && r >= range.top && r <= range.bottom && c >= range.left && c <= range.right ? { text: cell.text, rowSpan: cell.rowSpan, colSpan: cell.colSpan } : cell)) })}>Clear cell formatting</button>
      <h3>Select / merge cells</h3><div className="rt-controls-grid"><ResearchNumberField label="Select through row" value={end.row + 1} min={1} max={table.rows.length} onChange={row => setEnd({ ...end, row: row - 1 })} /><ResearchNumberField label="Select through column" value={end.col + 1} min={1} max={table.columnWidths.length} onChange={col => setEnd({ ...end, col: col - 1 })} /></div>
      <div className="research-editor-actions"><button type="button" className="secondary" data-admin-action="edit" disabled={selected.length < 2} onClick={() => apply(() => mergeTableCells(table, range))}>Merge selected cells</button><button type="button" className="secondary" data-admin-action="edit" disabled={!selected.some(cell => (cell.rowSpan || 1) > 1 || (cell.colSpan || 1) > 1)} onClick={() => apply(splitTableCells(table, range))}>Split merged cells</button><button type="button" className="secondary" data-admin-action="edit" onClick={() => patchCells({ text: "" })}>Clear selected text</button></div>
      <h3>Rows</h3><div className="rt-line-actions"><button type="button" className="secondary" data-admin-action="edit" onClick={() => line("row", active.row)}>Insert row above</button><button type="button" className="secondary" data-admin-action="edit" onClick={() => line("row", active.row + (active.cell.rowSpan || 1))}>Insert row below</button><button type="button" className="secondary" data-admin-action="edit" onClick={() => move("row", -1)} disabled={active.row === 0}>Move row up</button><button type="button" className="secondary" data-admin-action="edit" onClick={() => move("row", 1)} disabled={active.row === table.rows.length - 1}>Move row down</button><button type="button" className="secondary" data-admin-action="delete" onClick={() => line("row", active.row, true)} disabled={table.rows.length === 1}>Delete row</button></div>
      <h3>Columns</h3><ResearchNumberField label="Column width (%)" value={Math.round(table.columnWidths[active.col] * 10) / 10} min={1} max={100 - (table.columnWidths.length - 1)} step={0.1} onChange={width => apply(setTableColumnWidth(table, active.col, width))} />
      <div className="rt-line-actions"><button type="button" className="secondary" data-admin-action="edit" onClick={() => line("column", active.col)}>Insert column left</button><button type="button" className="secondary" data-admin-action="edit" onClick={() => line("column", active.col + (active.cell.colSpan || 1))}>Insert column right</button><button type="button" className="secondary" data-admin-action="edit" onClick={() => move("column", -1)} disabled={active.col === 0}>Move column left</button><button type="button" className="secondary" data-admin-action="edit" onClick={() => move("column", 1)} disabled={active.col === table.columnWidths.length - 1}>Move column right</button><button type="button" className="secondary" data-admin-action="delete" onClick={() => line("column", active.col, true)} disabled={table.columnWidths.length === 1}>Delete column</button></div>
    </aside></div>
    <div className="rt-dialog-footer"><span>Use Done to return to Research, then Publish changes to update the website.</span><button type="button" data-admin-action="view" onClick={onClose}>Done</button></div>
  </dialog>;
}
