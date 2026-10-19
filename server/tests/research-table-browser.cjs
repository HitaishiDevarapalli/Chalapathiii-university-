// Real Research CMS, Express, isolated PostgreSQL and independent admin/student browsers.
const assert = require("node:assert/strict");
const fs = require("node:fs"), os = require("node:os"), path = require("node:path"), crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const { PGlite } = require("@electric-sql/pglite");
const { PGLiteSocketServer } = require("@electric-sql/pglite-socket");

(async () => {
  const uploads = fs.mkdtempSync(path.join(os.tmpdir(), "research-table-test-"));
  const output = path.resolve("../work/research-qa/tables"); fs.mkdirSync(output, { recursive: true });
  const db = await PGlite.create();
  for (const name of fs.readdirSync("prisma/migrations").filter(name => /^2026/.test(name)).sort()) await db.exec(fs.readFileSync(`prisma/migrations/${name}/migration.sql`, "utf8"));
  const socket = new PGLiteSocketServer({ db, host: "127.0.0.1", port: 55449, maxConnections: 5 }); await socket.start();
  process.env.DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:55449/postgres?connection_limit=1";
  process.env.UPLOADS_DIR = uploads; process.env.SESSION_SECRET = crypto.randomBytes(40).toString("hex"); process.env.NODE_ENV = "test";
  const prisma = require("../dist/prisma").default, app = require("../dist/index").default;
  const express = require("express"); app.use(express.static(path.resolve("../dist")));
  app.use("/uploads", (_req, res) => res.sendStatus(404));
  app.get("*", (req, res, next) => req.path.startsWith("/api/") ? next() : res.sendFile(path.resolve("../dist/index.html")));
  const server = app.listen(0, "127.0.0.1"); await new Promise(resolve => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser, admin;
  try {
    await prisma.adminUser.create({ data: { username: "table-admin", passwordHash: await bcrypt.hash("Research-table-test-123!", 8), role: "superadmin", credentialMode: "legacy", mustChangePassword: false, requireGoogle: false, requireTotp: false } });
    const initial = { schemaVersion: 2, pageTitle: "Research & Innovation", pageSubtitle: "Research admissions", isUnderConstruction: false, underConstructionMessage: "", sections: [{ id: "eligibility", title: "Eligibility", description: "Programme-wise eligibility information.", blocks: [] }], items: [] };
    await prisma.siteConfig.create({ data: { key: "researchContent", valueJson: JSON.stringify(initial) } });
    const { default: puppeteer } = await import("puppeteer-core");
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
    admin = await browser.newPage(); admin.setDefaultTimeout(15000);
    const errors = []; admin.on("pageerror", error => errors.push(error.message));
    const visitor = await (await browser.createBrowserContext()).newPage(); visitor.on("pageerror", error => errors.push(error.message));
    const click = async (text, scope = ".research-table-dialog") => {
      const handle = await admin.waitForFunction(({ text, scope }) => [...document.querySelectorAll(`${scope} button`)].find(element => element.textContent.trim() === text && element.getBoundingClientRect().width && !element.matches(":disabled")), {}, { text, scope });
      await handle.asElement().click(); await handle.dispose();
    };
    const fill = async (label, value) => {
      const handle = await admin.waitForFunction(label => [...document.querySelectorAll(".research-table-dialog label")].find(element => [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join("").trim() === label)?.querySelector("input:not([type=range]),textarea,select"), {}, label);
      const field = handle.asElement();
      if (await field.evaluate(element => element.tagName) === "SELECT") await field.select(String(value));
      else { await field.focus(); await admin.keyboard.down("Control"); await admin.keyboard.press("KeyA"); await admin.keyboard.up("Control"); await admin.keyboard.press("Backspace"); await field.type(String(value)); await admin.keyboard.press("Tab"); }
      await handle.dispose();
    };
    const cell = (row, col) => admin.$(`.research-table-dialog [data-table-row="${row}"][data-table-col="${col}"] .rt-cell-button`);
    const select = async (row, col, shift = false) => {
      if (shift) await admin.keyboard.down("Shift");
      await (await cell(row, col)).click();
      if (shift) await admin.keyboard.up("Shift");
    };
    const read = async () => (await (await fetch(base + "/api/config/researchContent?raw=true")).json());
    const publish = async () => { await click("Publish changes", ".research-admin-top"); await admin.waitForSelector(".research-admin-message"); assert.equal(await admin.$(".research-admin-error"), null); };

    await admin.setViewport({ width: 1640, height: 1100 });
    await admin.goto(base + "/admin");
    await admin.waitForSelector('input[placeholder="Enter your username or email"]');
    await admin.type('input[placeholder="Enter your username or email"]', "table-admin"); await admin.type('input[placeholder="Enter password"]', "Research-table-test-123!"); await admin.click('button[type="submit"]');
    await click("Research & Innovation", ".admin-sidebar");
    await admin.waitForFunction(() => document.querySelector(".research-admin-fields") && !document.querySelector(".research-admin-fields").disabled);
    await admin.click('[data-component-type="table"]'); await admin.waitForSelector(".research-table-dialog[open]");
    await click("Programme eligibility template");
    assert.equal(await admin.$eval('[data-table-row="1"][data-table-col="0"]', element => element.rowSpan), 4);
    await select(1, 1); await fill("Cell text", "Civil Engineering (Ph.D.)"); await click("Bold"); await fill("Vertical alignment", "middle");
    await click("Clear cell formatting");
    assert.equal(await admin.$eval('.rt-format-buttons button', element => element.getAttribute("aria-pressed")), "false");
    await click("Undo");
    await select(1, 2); await select(2, 2, true); await click("Merge selected cells");
    assert.equal(await admin.$eval('[data-table-row="1"][data-table-col="2"]', element => element.rowSpan), 2);
    await click("Split merged cells");
    assert.equal(await admin.$eval('[data-table-row="2"][data-table-col="2"]', element => element.rowSpan), 1);
    await click("Undo"); await click("Redo");
    await click("Insert row below"); assert.equal(await admin.$$eval(".rt-editor-scroll tr", rows => rows.length), 9); await click("Undo");
    await click("Insert column right"); assert.equal(await admin.$$eval(".rt-editor-scroll col", columns => columns.length), 4); await click("Undo");
    await click("Delete column"); assert.equal(await admin.$$eval(".rt-editor-scroll col", columns => columns.length), 2); await click("Undo");
    await click("Paste spreadsheet / CSV"); await fill("Spreadsheet / CSV data", 'Heading A\tHeading B\n"Text with\na line break"\tValue');
    await click("Import pasted data"); assert.equal(await admin.$$eval(".rt-editor-scroll tr", rows => rows.length), 2); await click("Undo");
    await select(0, 0); await click("Insert row above");
    await select(0, 0); await fill("Cell text", "Programme-wise Eligibility"); await select(0, 2, true); await click("Merge selected cells");
    assert.equal(await admin.$eval('[data-table-row="0"][data-table-col="0"]', element => element.colSpan), 3);
    await fill("Table heading / caption", "Research admission eligibility"); await fill("Font size (px)", 16);
    await select(2, 0); await fill("Column width (%)", 24.7);
    await admin.$eval(".research-table-dialog", element => element.scrollTop = 0);
    await admin.screenshot({ path: path.join(output, "table-editor-desktop.png"), fullPage: true });
    await click("Done");
    assert.equal((await read()).sections[0].blocks.length, 0, "editing does not change the public content before publishing");
    await publish();
    const published = await read(), saved = published.sections[0].blocks[0].table;
    assert.equal(saved.rows[2][0].rowSpan, 4); assert.equal(saved.rows[0][0].colSpan, 3);
    assert.equal(saved.rows[2][1].text, "Civil Engineering (Ph.D.)"); assert.equal(saved.rows[2][1].bold, true);
    assert.ok(Math.abs(saved.columnWidths[0] - 24.7) < .0001); assert.equal(saved.fontSize, 16);
    await visitor.setViewport({ width: 1440, height: 1100 });
    await visitor.goto(base + "/research?section=eligibility"); await visitor.waitForSelector(".research-data-table tbody td[rowspan='4']");
    assert.equal(await visitor.$eval(".research-data-table thead th", element => element.colSpan), 3);
    assert.equal(await visitor.$eval(".research-data-table caption", element => element.textContent), "Research admission eligibility");
    await visitor.screenshot({ path: path.join(output, "table-public-desktop.png"), fullPage: true });
    const bad = structuredClone(published); bad.sections[0].blocks[0].table.rows[2][0].rowSpan = 199;
    const invalid = await admin.evaluate(async body => { const response = await fetch("/api/config/researchContent", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); return response.status; }, bad);
    assert.equal(invalid, 400); assert.deepEqual(await read(), published, "invalid spans do not overwrite published content");
    await admin.reload(); await click("Research & Innovation", ".admin-sidebar"); await click("Edit table", ".research-component-properties");
    assert.equal(await admin.$eval('[data-table-row="2"][data-table-col="0"]', element => element.rowSpan), 4);
    await admin.setViewport({ width: 390, height: 844 });
    await select(2, 1); await fill("Select through row", 4); await click("Merge selected cells");
    assert.equal(await admin.$eval('[data-table-row="2"][data-table-col="1"]', element => element.rowSpan), 2);
    await click("Undo");
    await admin.$eval(".research-table-dialog", element => element.scrollTop = 0);
    await admin.screenshot({ path: path.join(output, "table-editor-mobile.png"), fullPage: true });
    assert.equal(await admin.$eval(".research-table-dialog", element => element.scrollWidth > element.clientWidth), false, "editor fits a phone width");
    await click("Done");
    await visitor.setViewport({ width: 390, height: 844 }); await visitor.reload(); await visitor.waitForSelector(".research-data-table");
    assert.equal(await visitor.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "the table scrolls inside its container, not the entire page");
    assert.equal(await visitor.$eval(".research-table-scroll", element => element.scrollWidth > element.clientWidth), true);
    assert.equal(await visitor.$eval(".research-table-hint", element => getComputedStyle(element).display), "block");
    await visitor.screenshot({ path: path.join(output, "table-public-mobile.png"), fullPage: true });
    assert.deepEqual(errors, []);
    console.log("PASS browser: Research table library, eligibility template, cell editing/formatting, vertical/horizontal merging, split, undo/redo, row/column operations, spreadsheet import, publication, server validation, reload persistence and mobile layout.");
  } catch (error) {
    if (admin) { await admin.screenshot({ path: path.join(output, "table-failure.png"), fullPage: true }).catch(() => {}); console.error(await admin.$eval(".research-table-dialog", element => element.innerText).catch(() => "Table dialog unavailable")); }
    throw error;
  } finally {
    await browser?.close(); await new Promise(resolve => server.close(resolve)); await prisma.$disconnect(); await socket.stop(); await db.close();
    assert.equal(path.dirname(uploads), path.resolve(os.tmpdir())); assert.ok(path.basename(uploads).startsWith("research-table-test-")); fs.rmSync(uploads, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
