const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path");
const XLSX = require("../../node_modules/xlsx");

// Hand-authored OOXML fixtures exercise features that the basic XLSX writer omits.
function excelFixture(output) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["Choose the Eligibility worksheet"]]), "Notes");
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([["Fixture"]]), "Eligibility");
  const archive = XLSX.CFB.read(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }), { type: "buffer" });
  const add = (name, text) => {
    const index = archive.FullPaths.findIndex(value => value.replace(/^[^/]+\//, "") === name);
    if (index >= 0) { archive.FileIndex[index].content = Buffer.from(text); archive.FileIndex[index].size = Buffer.byteLength(text); }
    else XLSX.CFB.utils.cfb_add(archive, name, Buffer.from(text));
  };
  add("xl/styles.xml", `<?xml version="1.0"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
    <fonts count="4"><font><sz val="11"/><name val="Calibri"/><color theme="1"/></font><font><b/><sz val="12"/><name val="Arial"/><color rgb="FF222222"/></font><font><sz val="11"/><name val="Arial"/><color rgb="FF333333"/></font><font><b/><sz val="12"/><name val="Arial"/><color rgb="FF8A1C24"/></font></fonts>
    <fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFF9EEEE"/><bgColor indexed="64"/></patternFill></fill></fills>
    <borders count="3"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFDDDDDD"/></left><right style="thin"><color rgb="FFDDDDDD"/></right><top style="thin"><color rgb="FFDDDDDD"/></top><bottom style="thin"><color rgb="FFDDDDDD"/></bottom><diagonal/></border><border><left style="thin"><color rgb="FFDDDDDD"/></left><right style="dashed"><color rgb="FF333333"/></right><top style="double"><color rgb="FF0000FF"/></top><bottom style="thin"><color rgb="FFDDDDDD"/></bottom></border></borders>
    <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
    <cellXfs count="5"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0"><alignment horizontal="left" vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0"><alignment horizontal="left" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="1" xfId="0"><alignment horizontal="left" vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="2" xfId="0"><alignment horizontal="center" vertical="center" wrapText="1"/></xf></cellXfs>
    <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`);
  const data = [
    ["Programme-wise Eligibility", "", ""],
    ["School", "Ph.D. Programme", "Minimum Eligibility"],
    ["School of Engineering", "Civil Engineering", "M.E./M.Tech. in the relevant Engineering discipline or equivalent, with a minimum of 55% marks"],
    ["", "Electronics & Communication Engineering", "M.E./M.Tech. in ECE or relevant/allied discipline, or equivalent, with a minimum of 55% marks"],
    ["", "Electrical & Electronics Engineering", "M.E./M.Tech. in EEE or relevant/allied discipline, or equivalent, with a minimum of 55% marks"],
    ["", "Mechanical Engineering", "M.E./M.Tech. in Mechanical Engineering or relevant/allied discipline, or equivalent, with a minimum of 55% marks"],
    ["School of Computing Sciences", "Computer Science & Engineering", "Saved formula result"],
    ["School of Sciences and Humanities", "Mathematics", "Postgraduate degree/M.Phil. in the relevant discipline or equivalent, with a minimum of 55% marks"],
    ["", "Physics", ""],
  ];
  const escape = text => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const rows = data.map((row, index) => `<row r="${index + 1}" ht="${[26, 30, 48, 66, 60, 72, 54, 48, 48][index]}" customHeight="1">${row.map((value, column) => {
    const address = `${String.fromCharCode(65 + column)}${index + 1}`, style = index === 0 ? 1 : index === 1 ? 2 : index === 6 && column === 1 ? 4 : 3;
    return address === "C7" ? `<c r="C7" s="3" t="str"><f>IF(1=1,"Saved formula result","")</f><v>Saved formula result</v></c>` : `<c r="${address}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${escape(value)}</t></is></c>`;
  }).join("")}</row>`).join("");
  add("xl/worksheets/sheet2.xml", `<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="A1:C9"/><sheetViews><sheetView workbookViewId="0"/></sheetViews><cols><col min="1" max="1" width="27" customWidth="1"/><col min="2" max="2" width="30" customWidth="1"/><col min="3" max="3" width="62" customWidth="1"/></cols><sheetData>${rows}</sheetData><mergeCells count="4"><mergeCell ref="A1:C1"/><mergeCell ref="A3:A6"/><mergeCell ref="A8:A9"/><mergeCell ref="C8:C9"/></mergeCells></worksheet>`);
  const filename = path.join(output, "eligibility-formatted.xlsx");
  fs.writeFileSync(filename, XLSX.CFB.write(archive, { type: "buffer", fileType: "zip" }));
  return filename;
}

module.exports = async ({ admin, visitor, base, read, publish, output }) => {
  const filename = excelFixture(output);
  const click = async text => {
    const handle = await admin.waitForFunction(text => [...document.querySelectorAll(".research-table-dialog button")].find(element => element.textContent.trim() === text && !element.matches(":disabled")), {}, text);
    await handle.asElement().evaluate(element => element.scrollIntoView({ block: "center" }));
    await handle.asElement().click(); await handle.dispose();
  };
  const field = async (label, value) => {
    const handle = await admin.waitForFunction(label => [...document.querySelectorAll(".rt-excel-panel label")].find(element => [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join("").trim() === label)?.querySelector("input:not([type=range]),select"), {}, label);
    const input = handle.asElement();
    if (await input.evaluate(element => element.tagName) === "SELECT") await input.select(value);
    else { await input.focus(); await admin.keyboard.down("Control"); await admin.keyboard.press("KeyA"); await admin.keyboard.up("Control"); await admin.keyboard.press("Backspace"); await input.type(value); await admin.keyboard.press("Tab"); }
    await handle.dispose();
  };
  await admin.setViewport({ width: 1640, height: 1100 });
  const open = await admin.waitForFunction(() => [...document.querySelectorAll(".research-component-properties button")].find(element => element.textContent === "Edit table")); await open.asElement().click(); await open.dispose();
  const before = await admin.$$eval(".rt-editor-scroll tr", rows => rows.length);
  await (await admin.$('[aria-label="Upload Excel table"]')).uploadFile(filename);
  await admin.waitForSelector(".rt-excel-preview table");
  await field("Excel worksheet", "Eligibility"); await field("Excel header rows", "2");
  await admin.waitForFunction(() => document.querySelector(".rt-excel-preview table")?.textContent.includes("School of Engineering"));
  assert.equal(await admin.$eval(".rt-excel-preview td[rowspan='4']", element => element.textContent), "School of Engineering");
  await field("Cell range (optional)", "A4:C9"); await admin.waitForFunction(() => document.querySelector(".rt-excel-panel [role=alert]")?.textContent.includes("cuts through a merged cell"));
  assert.equal(await admin.$$eval(".rt-editor-scroll tr", rows => rows.length), before, "invalid Excel ranges do not change the current table");
  await field("Cell range (optional)", "A1:C9"); await admin.waitForSelector(".rt-excel-preview table");
  const preview = await admin.$eval(".rt-excel-preview table", table => ({
    headers: table.querySelectorAll("thead tr").length,
    color: getComputedStyle(table.querySelector("th")).color,
    fill: getComputedStyle(table.querySelectorAll("thead tr")[1].querySelector("th")).backgroundColor,
    family: getComputedStyle(table.querySelector("td")).fontFamily,
    widths: [...table.querySelectorAll("col")].map(element => element.style.width),
  }));
  assert.equal(preview.headers, 2); assert.equal(preview.color, "rgb(138, 28, 36)"); assert.equal(preview.fill, "rgb(249, 238, 238)"); assert.match(preview.family, /Arial/);
  await admin.screenshot({ path: path.join(output, "excel-import-preview.png"), fullPage: true });
  await click("Use this Excel table"); await admin.waitForFunction(() => !document.querySelector(".rt-excel-panel"));
  await click("Undo"); assert.equal(await admin.$$eval(".rt-editor-scroll tr", rows => rows.length), before);
  await click("Redo");
  await click("Insert row below"); await click("Undo");
  await click("Done"); await publish();
  const saved = (await read()).sections[0].blocks[0].table;
  assert.equal(saved.rows[2][0].rowSpan, 4); assert.equal(saved.rows[7][2].rowSpan, 2); assert.equal(saved.rows[0][0].colSpan, 3);
  assert.equal(saved.rows[0][0].color, "#8a1c24"); assert.equal(saved.rows[1][0].background, "#f9eeee");
  assert.equal(saved.rows[6][1].align, "center"); assert.equal(saved.rows[6][1].verticalAlign, "middle");
  assert.equal(saved.rows[6][1].borderTop.style, "double"); assert.equal(saved.rows[6][1].borderRight.style, "dashed");
  assert.equal(saved.rows[6][2].text, "Saved formula result"); assert.equal(saved.rowHeights[3], 88);
  assert.equal(saved.widthPixels > 700, true);
  await visitor.setViewport({ width: 1440, height: 1100 }); await visitor.goto(base + "/research?section=eligibility");
  await visitor.waitForSelector(".research-data-table td[rowspan='4']");
  const publicStyle = await visitor.$eval(".research-data-table", table => ({ width: table.getBoundingClientRect().width, title: getComputedStyle(table.querySelector("th")).color, row: table.querySelectorAll("tr")[3].getBoundingClientRect().height }));
  assert.ok(Math.abs(publicStyle.width - saved.widthPixels) < 2); assert.equal(publicStyle.title, preview.color); assert.ok(publicStyle.row >= 88);
  await visitor.screenshot({ path: path.join(output, "excel-import-public.png"), fullPage: true });
  await visitor.setViewport({ width: 390, height: 844 }); await visitor.reload(); await visitor.waitForSelector(".research-data-table");
  assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await visitor.screenshot({ path: path.join(output, "excel-import-mobile.png"), fullPage: true });
  console.log("PASS Excel: .xlsx upload, worksheet/range preview, merged rows/columns, fonts, colours, custom borders, widths, row heights, cached formulas, undo/redo, structural edits, publication and mobile scrolling.");
};
