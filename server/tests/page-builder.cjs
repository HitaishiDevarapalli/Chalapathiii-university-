// Real Express + Prisma + isolated PostgreSQL. No live database or production accounts.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const { PGlite } = require("@electric-sql/pglite");
const { PGLiteSocketServer } = require("@electric-sql/pglite-socket");

(async () => {
  const directory = fs.mkdtempSync(
    path.join(os.tmpdir(), "university-builder-test-"),
  );
  const db = await PGlite.create();
  for (const migration of fs
    .readdirSync("prisma/migrations")
    .filter((n) => /^2026/.test(n))
    .sort())
    await db.exec(
      fs.readFileSync(`prisma/migrations/${migration}/migration.sql`, "utf8"),
    );
  const socket = new PGLiteSocketServer({
    db,
    host: "127.0.0.1",
    port: 55445,
    maxConnections: 5,
  });
  await socket.start();
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@127.0.0.1:55445/postgres?connection_limit=1";
  process.env.SESSION_SECRET = crypto.randomBytes(40).toString("hex");
  process.env.UPLOADS_DIR = directory;
  process.env.CODE_PAGE_ASSETS_DIR = fs.mkdtempSync(
    path.join(os.tmpdir(), "university-code-assets-test-"),
  );
  process.env.NODE_ENV = "test";
  const prisma = require("../dist/prisma").default;
  const app = require("../dist/index").default;
  const express = require("express");
  app.use(express.static(path.resolve("../dist")));
  // Production proxies /uploads to the API, without the frontend SPA fallback.
  app.use("/uploads", (_req, res) => res.sendStatus(404));
  app.get("*", (_req, res) => res.sendFile(path.resolve("../dist/index.html")));
  let server;
  let base;
  const start = async () => {
    server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  };
  await start();
  class Client {
    cookie = "";
    async request(route, method = "GET", body, csrf = true) {
      const headers = { cookie: this.cookie };
      if (this.cookie && method !== "GET" && csrf) {
        const token = await this.request("/api/auth/csrf");
        headers["X-CSRF-Token"] = token.body.csrfToken;
      }
      if (body !== undefined && !(body instanceof FormData))
        headers["Content-Type"] = "application/json";
      const response = await fetch(base + route, {
        method,
        headers,
        ...(body === undefined
          ? {}
          : { body: body instanceof FormData ? body : JSON.stringify(body) }),
      });
      if (response.headers.get("set-cookie"))
        this.cookie = response.headers.get("set-cookie").split(";")[0];
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
      return { status: response.status, body: data, headers: response.headers };
    }
    async login(username) {
      assert.equal(
        (
          await this.request(
            "/api/auth/login",
            "POST",
            { username, password: "Builder-test-password-123!" },
            false,
          )
        ).status,
        200,
      );
    }
    get(route) {
      return this.request("/api/page-builder" + route);
    }
    post(route, body) {
      return this.request("/api/page-builder" + route, "POST", body);
    }
    put(route, body) {
      return this.request("/api/page-builder" + route, "PUT", body);
    }
  }
  const admin = new Client(),
    editor = new Client(),
    visitor = new Client(),
    viewer = new Client();
  const pass = (message) => console.log("PASS: " + message);
  const node = (type, props = {}, children = [], style = {}) => ({
    id: crypto.randomUUID(),
    type,
    props,
    style,
    children,
  });
  const document = {
    schemaVersion: 1,
    title: "Builder integration",
    slug: "/pages/builder-integration",
    metaTitle: "Builder SEO",
    metaDescription: "Saved server content",
    socialImage: "",
    canonical: "",
    redirectOldSlug: true,
    placement: {
      kind: "navigation",
      parent: "Campus Life",
      label: "Builder integration",
      position: 3,
      visible: true,
      homeMode: "card",
    },
    nodes: [
      node("heading", { text: "Original heading", level: "h2" }),
      node(
        "columns",
        {},
        [
          node("paragraph", { text: "Column text" }),
          node("button", { text: "Contact us", href: "/contact" }),
        ],
        { columns: 2, gap: 20 },
      ),
      node("table", {
        rows: [
          ["Name", "Value"],
          ["Content", "Database"],
        ],
        header: true,
        caption: "Test table",
      }),
      node("accordion", {
        items: [{ question: "Question", answer: "Answer" }],
      }),
    ],
  };
  try {
    for (const key of [
      "pages.view",
      "pages.create",
      "pages.edit",
      "pages.publish",
      "pages.delete",
      "gallery.create",
    ])
      await prisma.adminPermission.upsert({
        where: { key },
        create: { key, module: key.split(".")[0], action: key.split(".")[1] },
        update: {},
      });
    for (const [username, role, keys] of [
      ["builder-admin", "superadmin", []],
      [
        "builder-editor",
        "admin",
        ["pages.view", "pages.create", "pages.edit", "pages.delete"],
      ],
      ["builder-viewer", "admin", ["pages.view"]],
    ]) {
      await prisma.adminUser.create({
        data: {
          username,
          passwordHash: await bcrypt.hash("Builder-test-password-123!", 10),
          role,
          credentialMode: "legacy",
          mustChangePassword: false,
          requireGoogle: false,
          requireTotp: false,
          permissions: {
            create: keys.map((permissionKey) => ({ permissionKey })),
          },
        },
      });
    }
    await admin.login("builder-admin");
    await editor.login("builder-editor");
    await viewer.login("builder-viewer");
    assert.equal((await visitor.get("")).status, 401);
    assert.equal((await visitor.get("/menus")).status, 401);
    assert.equal((await visitor.get("/media")).status, 401);
    assert.equal((await visitor.get("/section-pages")).status, 401);
    assert.equal((await visitor.post("", { document })).status, 401);
    assert.equal((await viewer.post("", { document })).status, 403);
    assert.equal(
      (await admin.request("/api/page-builder", "POST", { document }, false))
        .status,
      403,
    );
    pass("session authentication, read/create permissions and CSRF protection");

    let created = await editor.post("", { document });
    assert.equal(created.status, 201, JSON.stringify(created.body));
    let current = created.body;
    const id = current.id;
    const sectionIndex = await viewer.get("/section-pages");
    assert.equal(sectionIndex.status, 200);
    assert.deepEqual(
      sectionIndex.body.items.find((page) => page.id === id),
      {
        id,
        title: document.title,
        placement: document.placement,
        status: "draft",
      },
    );
    assert.ok(
      !JSON.stringify(sectionIndex.body).includes("Original heading"),
      "Section index returns summaries without private component content",
    );
    assert.equal(
      (await editor.get("/" + id)).body.document.nodes[1].children[1].props
        .href,
      "/contact",
    );
    assert.equal(
      (await visitor.get("/public?slug=" + document.slug)).status,
      404,
    );
    assert.equal(
      (
        await visitor.request(
          "/api/cms?action=getPage&slug=" + encodeURIComponent(document.slug),
        )
      ).status,
      404,
    );
    assert.equal(
      (await visitor.request("/api/pages/" + encodeURIComponent(document.slug)))
        .status,
      404,
    );
    assert.equal(
      (await editor.post(`/${id}/publish`, { version: current.version }))
        .status,
      403,
    );
    assert.equal((await editor.post("", { document })).status, 409);
    assert.equal(
      (await editor.post("", { document: { ...document, slug: "/admin" } }))
        .status,
      400,
    );
    assert.equal(
      (
        await editor.post("", {
          document: { ...document, slug: "/pages/bad%2fpath" },
        })
      ).status,
      400,
    );
    pass(
      "database draft persistence, unique reserved URLs and public draft privacy",
    );

    const badDocs = [
      { ...document, nodes: [node("script", { text: "evil" })] },
      { ...document, nodes: [node("button", { href: "javascript:alert(1)" })] },
      {
        ...document,
        nodes: [node("image", { url: "data:image/svg+xml,evil" })],
      },
      {
        ...document,
        nodes: [node("video", { url: "https://evil.example/embed/x" })],
      },
      { ...document, nodes: [node("heading", {}, [node("paragraph")])] },
      { ...document, nodes: [node("table", { rows: [["A"], ["B", "C"]] })] },
      { ...document, nodes: [document.nodes[0], document.nodes[0]] },
      { ...document, nodes: [node("paragraph", {}, [], { width: "9999px" })] },
      {
        ...document,
        nodes: [node("paragraph", {}, [], { position: "absolute" })],
      },
    ];
    let nested = node("section");
    for (let i = 0; i < 12; i++) nested = node("section", {}, [nested]);
    badDocs.push({ ...document, nodes: [nested] });
    for (const bad of badDocs)
      assert.equal(
        (
          await editor.put("/" + id, {
            version: current.version,
            document: bad,
          })
        ).status,
        400,
      );
    assert.equal(
      (await editor.get("/" + id)).body.version,
      1,
      "invalid changes do not advance versions",
    );
    pass(
      "server schema rejects executable URLs, unsafe embeds/styles, invalid tables, duplicate IDs and deep nesting",
    );

    const png = await sharp({
      create: { width: 40, height: 30, channels: 3, background: "#123456" },
    })
      .png()
      .toBuffer();
    const form = (bytes, mime = "image/png", name = "test.png") => {
      const f = new FormData();
      f.append("file", new Blob([bytes], { type: mime }), name);
      f.append("alt", "Server upload");
      return f;
    };
    assert.equal((await editor.post("/media", form(png))).status, 403);
    assert.equal(
      (await admin.post("/media", form(Buffer.from("<script>bad</script>"))))
        .status,
      400,
    );
    assert.equal(
      (
        await admin.post(
          "/media",
          form(Buffer.from("<svg/>"), "image/svg+xml", "bad.svg"),
        )
      ).status,
      400,
    );
    const uploaded = await admin.post("/media", form(png));
    assert.equal(uploaded.status, 201, JSON.stringify(uploaded.body));
    assert.equal(uploaded.body.mime, "image/webp");
    assert.equal(uploaded.body.width, 40);
    assert.equal(uploaded.body.height, 30);
    assert.equal((await admin.get("/media")).body[0].alt, "Server upload");
    assert.equal(await prisma.builderMedia.count(), 1);
    const badPdf = form(
      Buffer.from("%PDF-1.7\n/JavaScript evil\n%%EOF"),
      "application/pdf",
      "bad.pdf",
    );
    assert.equal((await admin.post("/media", badPdf)).status, 400);
    const pageActionPdf = form(
      Buffer.from(
        "%PDF-1.7\n1 0 obj << /Type /Catalog /OpenAction [3 0 R /XYZ null null 0] >> endobj\n%%EOF",
      ),
      "application/pdf",
      "application-form.pdf",
    );
    assert.equal(
      (await admin.post("/media", pageActionPdf)).status,
      201,
      "ordinary page-opening metadata is not executable PDF content",
    );
    pass(
      "media authorization, decoded image optimization, persistent metadata and invalid file rejection",
    );

    current = (await admin.post(`/${id}/publish`, { version: current.version }))
      .body;
    let live = await visitor.get("/public?slug=" + document.slug);
    assert.equal(live.status, 200);
    assert.equal(live.body.document.title, document.title);
    assert.equal(live.headers.get("cache-control"), "no-store");
    assert.equal(
      (await visitor.get("/placements")).body.navigation[0].parentNav,
      "Campus Life",
    );
    assert.equal(
      (await editor.post(`/${id}/archive`, { version: current.version }))
        .status,
      403,
      "deletion permission alone cannot remove a live page",
    );
    const draft = {
      ...document,
      title: "Changed draft",
      nodes: [
        node("image", { url: uploaded.body.url, alt: "Real uploaded image" }),
        node("paragraph", { text: "<script>alert(1)</script> is inert text" }),
        document.nodes[1],
      ],
    };
    const oldVersion = current.version;
    current = (
      await editor.put("/" + id, { version: oldVersion, document: draft })
    ).body;
    assert.equal(
      (await editor.put("/" + id, { version: oldVersion, document })).status,
      409,
    );
    assert.equal(
      (await admin.post(`/${id}/publish`, { version: oldVersion })).status,
      409,
    );
    live = (await visitor.get("/public?slug=" + document.slug)).body;
    assert.equal(
      live.document.title,
      document.title,
      "saving draft cannot change live metadata or content",
    );
    assert.equal((await visitor.get("/" + id)).status, 401);
    assert.equal((await visitor.get(`/${id}/revisions`)).status, 401);
    const legacyMutations = [
      [
        "/api/cms",
        "POST",
        {
          action: "savePage",
          page: { slug: document.slug, type: "custom", status: "published" },
        },
      ],
      ["/api/cms", "POST", { action: "deletePage", slug: document.slug }],
      ["/api/pages/" + id, "PUT", { status: "published", dataJson: "{}" }],
      ["/api/pages/" + id, "DELETE", {}],
      [
        "/api/pages/" + encodeURIComponent(document.slug) + "/versions",
        "POST",
        {},
      ],
    ];
    for (const [route, method, body] of legacyMutations)
      assert.equal((await admin.request(route, method, body)).status, 409);
    assert.equal(
      (
        await admin.request("/api/cms", "POST", {
          action: "saveAll",
          pages: [
            {
              slug: document.slug,
              type: "custom",
              title: "Bypass",
              status: "published",
            },
          ],
        })
      ).status,
      200,
    );
    assert.equal(
      (await visitor.get("/public?slug=" + document.slug)).body.document.title,
      document.title,
    );
    pass(
      "atomic publication/navigation, optimistic concurrency and legacy-endpoint bypass prevention",
    );

    current = (await admin.post(`/${id}/publish`, { version: current.version }))
      .body;
    assert.equal(
      (await visitor.get("/public?slug=" + document.slug)).body.document.title,
      "Changed draft",
    );
    const revisions = (await admin.get(`/${id}/revisions`)).body;
    assert.ok(revisions.length >= 4);
    assert.ok(revisions.every((r) => r.author.startsWith("builder-")));
    const revision1 = revisions.find(
      (r) => JSON.parse(r.snapshotJson).version === 1,
    );
    const another = await admin.post("", {
      document: { ...document, title: "Other page", slug: "/pages/other-page" },
    });
    assert.equal(another.status, 201);
    assert.equal(
      (
        await admin.post(`/${another.body.id}/restore`, {
          version: 1,
          revisionId: revision1.id,
        })
      ).status,
      404,
      "cannot restore another page revision",
    );
    current = (
      await admin.post(`/${id}/restore`, {
        version: current.version,
        revisionId: revision1.id,
      })
    ).body;
    assert.equal(current.document.title, document.title);
    assert.equal(
      (await visitor.get("/public?slug=" + document.slug)).body.document.title,
      "Changed draft",
      "restoring revision leaves live page unchanged",
    );
    const newDoc = {
      ...current.document,
      slug: "/pages/renamed-page",
      placement: {
        ...document.placement,
        kind: "homepage",
        homeMode: "section",
      },
    };
    current = (
      await editor.put("/" + id, { version: current.version, document: newDoc })
    ).body;
    assert.equal(
      (await visitor.get("/public?slug=" + document.slug)).body.document.title,
      "Changed draft",
    );
    current = (await admin.post(`/${id}/publish`, { version: current.version }))
      .body;
    assert.equal(
      (await visitor.get("/public?slug=" + document.slug)).body.redirect,
      newDoc.slug,
    );
    assert.equal((await visitor.get("/placements")).body.navigation.length, 0);
    assert.equal(
      (await visitor.get("/placements")).body.homepage[0].document.slug,
      newDoc.slug,
    );
    assert.equal(
      (await editor.post("", { document })).status,
      409,
      "old redirect URLs cannot be stolen by another page",
    );
    const duplicate = await editor.post(`/${id}/duplicate`, {
      version: current.version,
    });
    assert.equal(duplicate.status, 200);
    assert.equal(duplicate.body.status, "draft");
    assert.equal(duplicate.body.document.placement.kind, "standalone");
    pass(
      "server-authored revisions, safe draft restoration, redirect ownership, homepage placement and independent duplication",
    );

    current = (
      await admin.post(`/${id}/unpublish`, { version: current.version })
    ).body;
    for (const slug of [document.slug, newDoc.slug])
      assert.equal((await visitor.get("/public?slug=" + slug)).status, 404);
    assert.equal((await visitor.get("/placements")).body.homepage.length, 0);
    assert.ok((await editor.get(`/${id}/revisions`)).body.length > 5);
    const archived = await editor.post(`/${id}/archive`, {
      version: current.version,
    });
    assert.equal(archived.status, 200);
    current = archived.body;
    assert.equal(current.status, "archived");
    assert.equal(
      (await admin.post(`/${id}/publish`, { version: current.version })).status,
      409,
    );
    current = (await editor.post(`/${id}/reopen`, { version: current.version }))
      .body;
    assert.equal(current.status, "draft");
    const fresh = await editor.put("/" + id, {
      version: current.version,
      document: current.document,
    });
    assert.equal(fresh.status, 200);
    current = fresh.body;
    const races = await Promise.all([
      editor.put("/" + id, {
        version: current.version,
        document: current.document,
      }),
      admin.put("/" + id, {
        version: current.version,
        document: current.document,
      }),
    ]);
    assert.deepEqual(races.map((r) => r.status).sort(), [200, 409]);
    assert.ok(
      await prisma.adminSecurityEvent.count({
        where: { target: id, event: "page_published" },
      }),
    );
    pass(
      "unpublication revokes URL/redirect/placement, archive recovery, concurrent-update rejection and transactional audit events",
    );

    await new Promise((resolve) => server.close(resolve));
    await start();
    assert.equal((await editor.get("/" + id)).body.document.slug, newDoc.slug);
    const bytes = Buffer.from(
      await (await fetch(base + uploaded.body.url)).arrayBuffer(),
    );
    assert.equal((await sharp(bytes).metadata()).width, 40);
    assert.equal(
      (await visitor.get("/public?slug=/pages/nonexistent")).status,
      404,
    );
    assert.equal((await visitor.request("/api/auth/me")).status, 401);
    pass(
      "server restart retains drafts, sessions, uploaded files and not-found behavior",
    );
    const deleteVisual = (client, row, options = {}) =>
      client.request(`/api/page-builder/${row.id}`, "DELETE", {
        version: row.version,
        confirm: true,
        ...options,
      });
    const deletionDraft = (
      await editor.post("", {
        document: {
          ...document,
          title: "Delete draft fixture",
          slug: "/pages/delete-draft-fixture",
        },
      })
    ).body;
    assert.equal((await deleteVisual(visitor, deletionDraft)).status, 401);
    assert.equal((await deleteVisual(viewer, deletionDraft)).status, 403);
    assert.equal(
      (
        await admin.request(
          `/api/page-builder/${deletionDraft.id}`,
          "DELETE",
          { version: deletionDraft.version, confirm: true },
          false,
        )
      ).status,
      403,
    );
    assert.equal(
      (await deleteVisual(editor, deletionDraft, { confirm: false })).status,
      400,
    );
    assert.equal(
      (
        await deleteVisual(editor, deletionDraft, {
          version: deletionDraft.version + 1,
        })
      ).status,
      409,
    );
    assert.equal((await editor.get(`/${deletionDraft.id}`)).status, 200);
    assert.equal((await deleteVisual(editor, deletionDraft)).status, 200);
    assert.equal((await editor.get(`/${deletionDraft.id}`)).status, 404);
    assert.equal(
      await prisma.cmsPageVersion.count({
        where: { pageSlug: deletionDraft.document.slug },
      }),
      0,
    );
    let deletionLive = (
      await editor.post("", {
        document: {
          ...document,
          title: "Delete live fixture",
          slug: "/pages/delete-live-fixture",
        },
      })
    ).body;
    deletionLive = (
      await admin.post(`/${deletionLive.id}/publish`, {
        version: deletionLive.version,
      })
    ).body;
    deletionLive = (
      await editor.put(`/${deletionLive.id}`, {
        version: deletionLive.version,
        document: {
          ...deletionLive.document,
          slug: "/pages/delete-live-renamed",
        },
      })
    ).body;
    deletionLive = (
      await admin.post(`/${deletionLive.id}/publish`, {
        version: deletionLive.version,
      })
    ).body;
    assert.equal(
      (await deleteVisual(editor, deletionLive)).status,
      403,
      "Deleting a published visual page also requires publication permission",
    );
    assert.equal(
      (
        await deleteVisual(admin, deletionLive, {
          version: deletionLive.version - 1,
        })
      ).status,
      409,
    );
    assert.equal(
      (await visitor.get("/public?slug=/pages/delete-live-renamed")).status,
      200,
    );
    assert.equal((await deleteVisual(admin, deletionLive)).status, 200);
    for (const slug of [
      "/pages/delete-live-fixture",
      "/pages/delete-live-renamed",
    ])
      assert.equal((await visitor.get(`/public?slug=${slug}`)).status, 404);
    assert.equal(
      await prisma.builderNavigation.count({
        where: { pageId: deletionLive.id },
      }),
      0,
    );
    assert.equal(
      await prisma.builderRedirect.count({
        where: { pageId: deletionLive.id },
      }),
      0,
    );
    assert.equal(
      await prisma.cmsPageVersion.count({
        where: { pageSlug: deletionLive.document.slug },
      }),
      0,
    );
    assert.equal(
      await prisma.adminSecurityEvent.count({
        where: {
          target: deletionLive.id,
          event: "page_deleted",
          success: true,
        },
      }),
      1,
    );
    let deletionArchived = (
      await editor.post("", {
        document: {
          ...document,
          title: "Delete archive fixture",
          slug: "/pages/delete-archive-fixture",
        },
      })
    ).body;
    deletionArchived = (
      await editor.post(`/${deletionArchived.id}/archive`, {
        version: deletionArchived.version,
      })
    ).body;
    assert.equal((await deleteVisual(editor, deletionArchived)).status, 200);
    assert.equal(
      (await editor.get(`/${id}`)).status,
      200,
      "Unrelated visual pages remain intact",
    );
    pass(
      "permanent visual deletion checks confirmation, CSRF, permissions and versions, removes live routes/navigation/redirects/history, preserves audit and unrelated pages, and supports archived pages",
    );
    const editorUser = await prisma.adminUser.findUnique({
      where: { username: "builder-editor" },
    });
    const budgetKey = require("../dist/security/core").digest(
      `page-builder:${editorUser.id}:edit`,
    );
    await prisma.adminLoginThrottle.upsert({
      where: { key: budgetKey },
      create: {
        key: budgetKey,
        attempts: 240,
        expiresAt: new Date(Date.now() + 600000),
      },
      update: { attempts: 240 },
    });
    assert.equal(
      (
        await editor.put("/" + id, {
          version: current.version,
          document: current.document,
        })
      ).status,
      429,
    );
    await prisma.adminLoginThrottle.delete({ where: { key: budgetKey } });
    pass("database-backed edit budgets reject excessive operations");
    if (process.env.CODE_PAGE_TEST === "1")
      await require("./code-pages.cjs")({
        base,
        admin,
        editor,
        viewer,
        visitor,
        prisma,
        directory,
        db,
      });
    if (process.env.BROWSER_TEST === "1")
      await require("./page-builder-browser.cjs")(base);
    if (process.env.MEDIA_TEST === "1")
      await require("./media-storage.cjs")({
        base,
        admin,
        viewer,
        visitor,
        prisma,
        directory,
        db,
      });
    const sectionUser = await prisma.adminUser.findUnique({
      where: { username: "builder-viewer" },
    });
    await prisma.adminUserPermission.deleteMany({
      where: { userId: sectionUser.id },
    });
    assert.equal(
      (await viewer.get("/section-pages")).status,
      403,
      "Section index requires pages.view",
    );
    const indexed = Array.from({ length: 21 }, (_, index) => ({
      id: crypto.randomUUID(),
      slug: `/pages/section-pagination-${index}`,
      title: `Section pagination ${index}`,
    }));
    await prisma.$transaction([
      prisma.cmsPage.createMany({
        data: indexed.map((page) => ({
          ...page,
          name: page.title,
          type: "visual",
          status: "draft",
        })),
      }),
      prisma.builderDocument.createMany({
        data: indexed.map((page) => ({
          pageId: page.id,
          slug: page.slug,
          createdBy: sectionUser.id,
          updatedBy: sectionUser.id,
          draftJson: JSON.stringify({
            ...document,
            title: page.title,
            slug: page.slug,
          }),
        })),
      }),
    ]);
    const summaries = [];
    let sectionPage = 1,
      sectionTotal = Infinity;
    while (summaries.length < sectionTotal) {
      const result = await admin.get(`/section-pages?page=${sectionPage++}`);
      assert.equal(result.status, 200);
      assert.ok(result.body.items.length <= 20);
      summaries.push(...result.body.items);
      sectionTotal = result.body.total;
    }
    assert.equal(new Set(summaries.map((page) => page.id)).size, sectionTotal);
    assert.ok(
      indexed.every((page) => summaries.some((item) => item.id === page.id)),
    );
    assert.ok(summaries.every((page) => page.status !== "archived"));
    pass(
      "protected section summaries include saved drafts, omit component data, and paginate without duplicates",
    );
    console.log(
      "PASS: visual page builder integration suite completed against isolated PostgreSQL.",
    );
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await prisma.$disconnect();
    await socket.stop();
    await db.close();
    for (const target of [directory, process.env.CODE_PAGE_ASSETS_DIR]) {
      assert.equal(
        path.dirname(path.resolve(target)),
        path.resolve(os.tmpdir()),
      );
      assert.match(
        path.basename(target),
        /^university-(builder|code-assets)-test-/,
      );
      try {
        fs.rmSync(target, {
          recursive: true,
          force: true,
          maxRetries: 10,
          retryDelay: 100,
        });
      } catch (error) {
        // Chrome/Windows can retain file handles briefly after all functional assertions pass.
        if (
          process.platform !== "win32" ||
          !["EPERM", "EBUSY"].includes(error.code)
        )
          throw error;
        console.warn(
          "Windows retained isolated test fixtures after browser shutdown:",
          target,
        );
      }
    }
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
