// Uses an isolated embedded PostgreSQL database and temporary uploads only.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const { PGlite } = require("@electric-sql/pglite");
const { PGLiteSocketServer } = require("@electric-sql/pglite-socket");

(async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "academic-documents-test-"));
  const db = await PGlite.create();
  for (const migration of fs.readdirSync("prisma/migrations").filter(name => /^2026/.test(name)).sort()) {
    await db.exec(fs.readFileSync(`prisma/migrations/${migration}/migration.sql`, "utf8"));
  }
  const socket = new PGLiteSocketServer({ db, host: "127.0.0.1", port: 55447, maxConnections: 5 });
  await socket.start();
  process.env.DATABASE_URL = "postgresql://postgres:postgres@127.0.0.1:55447/postgres?connection_limit=1";
  process.env.UPLOADS_DIR = directory;
  process.env.SESSION_SECRET = crypto.randomBytes(40).toString("hex");
  process.env.NODE_ENV = "test";
  const prisma = require("../dist/prisma").default;
  const app = require("../dist/index").default;
  if (process.env.ACADEMIC_BROWSER_TEST === "1") {
    const express = require("express");
    app.use(express.static(path.resolve("../dist")));
    app.use("/uploads", (_req, res) => res.sendStatus(404));
    app.get("*", (req, res, next) => req.path.startsWith("/api/") ? next() : res.sendFile(path.resolve("../dist/index.html")));
  }
  let server, base;
  const start = async () => {
    server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  };
  await start();
  const pdf = Buffer.from("%PDF-1.7\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF\n");
  const form = (degree = "btech", category = "syllabus", bytes = pdf, title = "R26 curriculum", name = "curriculum.pdf") => {
    const body = new FormData();
    body.set("title", title); body.set("degree", degree); body.set("category", category);
    if (bytes) body.set("file", new Blob([bytes], { type: "application/pdf" }), name);
    return body;
  };
  const publicRequest = (route, options) => fetch(base + route, options);
  const client = cookie => ({ cookie, async request(route, method = "GET", body, csrf = true) {
    const headers = { cookie: this.cookie };
    if (method !== "GET" && csrf) {
      const response = await publicRequest("/api/auth/csrf", { headers });
      headers["X-CSRF-Token"] = (await response.json()).csrfToken;
    }
    return publicRequest(route, { method, headers, ...(body ? { body } : {}) });
  } });
  const login = async username => {
    const response = await publicRequest("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password: "Academic-test-password-123!" }) });
    assert.equal(response.status, 200, await response.clone().text());
    return client(response.headers.get("set-cookie").split(";")[0]);
  };
  const endpoint = "/api/academic-documents";
  const files = () => fs.readdirSync(directory).filter(name => name.endsWith(".pdf"));
  try {
    for (const [username, role, keys] of [
      ["academic-admin", "superadmin", []],
      ["academic-editor", "editor", ["academics.view", "academics.create", "academics.edit", "academics.delete", "academics.publish"]],
      ["academic-viewer", "editor", ["academics.view", "academics.create"]],
    ]) {
      await prisma.adminUser.create({ data: { username, role, passwordHash: await bcrypt.hash("Academic-test-password-123!", 8), credentialMode: "legacy", mustChangePassword: false, requireGoogle: false, requireTotp: false, permissions: { create: keys.map(permissionKey => ({ permissionKey })) } } });
    }
    const admin = await login("academic-admin");
    const editor = await login("academic-editor");
    const viewer = await login("academic-viewer");
    assert.deepEqual(await (await publicRequest(endpoint)).json(), []);
    assert.equal((await publicRequest(endpoint, { method: "POST", body: form() })).status, 401);
    assert.equal((await admin.request(endpoint, "POST", form(), false)).status, 403, "CSRF is required");
    assert.equal((await viewer.request(endpoint, "POST", form())).status, 403, "create without publish is denied");
    const saved = [];
    for (const degree of ["btech", "mtech"]) for (const category of ["syllabus", "regulations"]) {
      const response = await editor.request(endpoint, "POST", form(degree, category));
      assert.equal(response.status, 201, await response.clone().text());
      const document = await response.json(); saved.push(document);
      assert.equal(document.degree, degree); assert.equal(document.category, category);
      assert.deepEqual(Buffer.from(await (await publicRequest(document.url)).arrayBuffer()), pdf);
      const list = await (await publicRequest(`${endpoint}?degree=${degree}&category=${category}`)).json();
      assert.equal(list.length, 1); assert.equal(list[0].id, document.id);
    }
    assert.equal((await (await publicRequest(endpoint)).json()).length, 4);
    assert.equal((await publicRequest(`${endpoint}?degree=mba`)).status, 400);
    assert.equal((await publicRequest(`/api/config/__academic_document:${saved[0].id}`)).status, 404, "storage records cannot be overwritten through generic config");
    const before = files().length;
    for (const body of [form("mba"), form("btech", "syllabus", Buffer.from("not a PDF")), form("btech", "syllabus", pdf, ""), form("btech", "syllabus", pdf, "Bad extension", "bad.exe")]) {
      assert.equal((await admin.request(endpoint, "POST", body)).status, 400);
    }
    assert.equal(files().length, before, "rejected uploads leave no public files");
    const maximum = Buffer.alloc(50 * 1024 * 1024, 32); pdf.copy(maximum);
    let response = await admin.request(endpoint, "POST", form("btech", "syllabus", maximum, "50 MB PDF"));
    assert.equal(response.status, 201, await response.clone().text());
    const large = await response.json();
    assert.equal(large.size, maximum.length);
    response = await admin.request(endpoint, "POST", form("btech", "syllabus", Buffer.concat([maximum, Buffer.from(" ")]), "Oversized"));
    assert.equal(response.status, 201, "PDF uploads above the former 50 MB limit remain supported");
    const aboveFormerLimit = await response.json();
    assert.equal((await admin.request(`${endpoint}/${aboveFormerLimit.id}`, "DELETE")).status, 200);
    assert.equal(fs.readdirSync(path.join(directory, ".academic-document-staging")).length, 0, "processed uploads are cleaned");
    response = await editor.request(`${endpoint}/${saved[0].id}`, "PUT", form("btech", "syllabus", null, "Renamed syllabus"));
    assert.equal(response.status, 200); assert.equal((await response.json()).url, saved[0].url, "renaming retains the existing PDF");
    const replacement = Buffer.from("%PDF-1.7\nReplacement syllabus\n%%EOF\n");
    response = await editor.request(`${endpoint}/${saved[0].id}`, "PUT", form("btech", "syllabus", replacement, "Updated syllabus"));
    assert.equal(response.status, 200);
    const updated = await response.json(); assert.notEqual(updated.url, saved[0].url);
    assert.equal((await publicRequest(saved[0].url)).status, 404, "replacing removes the previous file");
    assert.deepEqual(Buffer.from(await (await publicRequest(updated.url)).arrayBuffer()), replacement);
    await new Promise(resolve => server.close(resolve)); await start();
    const afterRestart = await (await publicRequest(`${endpoint}?degree=btech&category=syllabus`)).json();
    assert.equal(afterRestart.length, 2); assert.ok(afterRestart.some(item => item.title === "Updated syllabus"));
    assert.equal((await publicRequest(large.url)).status, 200, "50 MB PDF survives API restart");
    assert.equal((await viewer.request(`${endpoint}/${updated.id}`, "DELETE")).status, 403);
    assert.equal((await editor.request(`${endpoint}/${updated.id}`, "DELETE")).status, 200);
    assert.equal((await publicRequest(updated.url)).status, 404);
    assert.equal((await editor.request(`${endpoint}/${updated.id}`, "DELETE")).status, 404);
    assert.equal((await (await publicRequest(`${endpoint}?degree=btech&category=syllabus`)).json()).length, 1);
    if (process.env.ACADEMIC_BROWSER_TEST === "1") await require("./academic-documents-browser.cjs")({ base });
    console.log("PASS: all four document sections, authenticated upload/edit/replace/delete, CSRF, permissions, content checks, uploads at and above the former 50 MB limit, cleanup, public download and restart persistence.");
  } finally {
    if (server?.listening) await new Promise(resolve => server.close(resolve));
    await prisma.$disconnect(); await socket.stop(); await db.close();
    fs.rmSync(directory, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
