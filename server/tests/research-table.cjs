const assert = require("node:assert/strict");
const table = require("../dist/research/table");
const { researchBlockSchema } = require("../dist/research/schema");
const valid = value => {
  const checked = table.researchTableSchema.safeParse(value);
  assert.equal(checked.success, true, JSON.stringify(checked.error?.issues));
  return value;
};
const clone = value => structuredClone(value);
const sample = valid(table.researchEligibilityTable());
assert.equal(sample.rows[1][0].rowSpan, 4);
assert.equal(sample.rows[4][0], null);
assert.equal(sample.rows[6][0].rowSpan, 2);
assert.equal(researchBlockSchema.safeParse({ id: "table-test", type: "table", table: sample }).success, true);
assert.equal(researchBlockSchema.safeParse({ id: "missing-table", type: "table" }).success, false);

let grid = table.createResearchTable(5, 4);
grid.rows.forEach((row, r) => row.forEach((cell, c) => cell.text = `${r}:${c}`));
let merged = valid(table.mergeTableCells(grid, { top: 1, left: 1, bottom: 2, right: 2 }));
assert.equal(merged.rows[1][1].text, "1:1\n1:2\n2:1\n2:2");
assert.equal(merged.rows[1][1].rowSpan, 2);
assert.equal(merged.rows[1][1].colSpan, 2);
assert.equal(merged.rows[2][2], null);
assert.deepEqual(table.tableSelection(merged, { row: 2, col: 2 }, { row: 3, col: 3 }), { top: 1, left: 1, bottom: 3, right: 3 });
let split = valid(table.splitTableCells(merged, { top: 1, left: 1, bottom: 2, right: 2 }));
assert.equal(split.rows[1][1].text, merged.rows[1][1].text);
assert.equal(split.rows[2][2].text, "");
assert.throws(() => table.mergeTableCells(grid, { top: 0, left: 0, bottom: 1, right: 0 }), /header/);

let inserted = valid(table.changeTableLine(merged, "row", 2));
assert.equal(inserted.rows[1][1].rowSpan, 3);
assert.equal(inserted.rows[3][2], null);
inserted = valid(table.changeTableLine(inserted, "column", 2));
assert.equal(inserted.rows[1][1].colSpan, 3);
let removed = valid(table.changeTableLine(inserted, "row", 1, true));
assert.equal(removed.rows[1][1].text, merged.rows[1][1].text, "deleting the anchor row keeps the merged content");
assert.equal(removed.rows[1][1].rowSpan, 2);
removed = valid(table.changeTableLine(removed, "column", 1, true));
assert.equal(removed.rows[1][1].text, merged.rows[1][1].text, "deleting the anchor column keeps merged content");
assert.equal(removed.rows[1][1].colSpan, 2);
const moved = valid(table.moveTableLine(grid, "row", 2, 1));
assert.equal(moved.rows[3][0].text, "2:0");
assert.throws(() => table.moveTableLine(merged, "row", 2, 1), /Split/);
const one = table.createResearchTable(1, 1);
assert.throws(() => table.changeTableLine(one, "row", 0, true), /at least one/);
assert.throws(() => table.changeTableLine(one, "column", 0, true), /at least one/);

const narrow = { ...clone(grid), columnWidths: [97, 1, 1, 1] };
valid(table.changeTableLine(narrow, "column", 1));
const resized = valid(table.setTableColumnWidth(narrow, 0, 40));
assert.equal(resized.columnWidths[0], 40);
assert.ok(Math.abs(resized.columnWidths.slice(1).reduce((a, b) => a + b) - 60) < .001);
assert.deepEqual(table.parseTablePaste('School\tProgramme\tEligibility\r\n"Sciences\nand Humanities"\t"Physics"\t"A, B"\r\n'), [["School", "Programme", "Eligibility"], ["Sciences\nand Humanities", "Physics", "A, B"]]);
assert.deepEqual(table.parseTablePaste('"Name, full",Value\n"a ""quote""",2'), [["Name, full", "Value"], ['a "quote"', "2"]]);
assert.throws(() => table.parseTablePaste('"unfinished'), /incomplete/);
assert.throws(() => table.parseTablePaste(Array.from({ length: 201 }, () => "row").join("\n")), /200 rows/);
for (const breakTable of [
  value => value.rows[0].pop(),
  value => value.rows[1][1] = null,
  value => value.rows[1][1].rowSpan = 200,
  value => value.rows[0][0].rowSpan = 2,
  value => value.columnWidths[0] = 80,
  value => value.rows[1][1].background = "url(javascript:alert(1))",
]) {
  const invalid = clone(grid); breakTable(invalid);
  assert.equal(table.researchTableSchema.safeParse(invalid).success, false);
}

// Deterministic varied edits check span geometry and width invariants after structural changes.
let state = sample, seed = 7919;
const random = max => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed % max; };
for (let index = 0; index < 250; index++) {
  const axis = random(2) ? "row" : "column", count = axis === "row" ? state.rows.length : state.columnWidths.length;
  try {
    const remove = count > 1 && (count > 12 || random(2) === 1);
    const next = table.changeTableLine(state, axis, random(remove ? count : count + 1), remove);
    state = valid(next);
  } catch (error) {
    if (!/header/.test(error.message)) throw error;
  }
}
console.log("PASS: grouped eligibility template, 2D merges and splits, insertion/deletion with merged cells, row moves, width resizing, TSV/CSV imports, hostile/invalid geometry rejection and 250 structural edits.");
