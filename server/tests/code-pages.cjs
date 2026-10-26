const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");
const { digest } = require("../dist/security/core");
const {
  readPackage,
  MAX_ZIP,
  assetDirectory,
} = require("../dist/codePages/package");
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function zip(files, options = {}) {
  const local = [],
    central = [];
  let offset = 0;
  for (const [name, value] of Object.entries(files)) {
    const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value),
      filename = Buffer.from(name),
      compressed = options.deflate ? zlib.deflateRawSync(bytes) : bytes;
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(options.encrypted ? 1 : 0, 6);
    header.writeUInt16LE(options.deflate ? 8 : 0, 8);
    header.writeUInt32LE(options.badCrc ? 0 : crc32(bytes), 14);
    header.writeUInt32LE(compressed.length, 18);
    header.writeUInt32LE(bytes.length, 22);
    header.writeUInt16LE(filename.length, 26);
    local.push(header, filename, compressed);
    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50);
    entry.writeUInt16LE(0x0314, 4);
    entry.writeUInt16LE(20, 6);
    header.copy(entry, 8, 6, 28);
    entry.writeUInt32LE(options.symlink ? 0xa1ff0000 : 0, 38);
    entry.writeUInt32LE(offset, 42);
    central.push(entry, filename);
    offset += header.length + filename.length + compressed.length;
  }
  const directory = Buffer.concat(central),
    end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50);
  end.writeUInt16LE(local.length / 3, 8);
  end.writeUInt16LE(local.length / 3, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}
const settings = (name, route) => ({
  name,
  description: "Integration fixture",
  integration: {
    mode: "page",
    route,
    label: name,
    parent: "Main Menu",
    position: 1,
    visible: true,
    layout: "global",
  },
  seo: {
    title: "Code SEO title",
    description: "Code description",
    canonical: "",
    ogTitle: "Social title",
    ogDescription: "Social description",
    image: "",
    noindex: false,
    sitemap: true,
  },
});
module.exports = async function codePagesTest({
  base,
  admin,
  editor,
  viewer,
  visitor,
  prisma,
  directory,
}) {
  const pass = (message) => console.log("PASS: code pages — " + message);
  const { resolveNavigation, CODE_PAGE_SANDBOX } = require("../dist/codePages/navigation");
  const context = {
    base: "https://university.example/api/code-pages/content/page/release/",
    route: "https://university.example/campaign",
    file: "pages/details.html",
    paths: ["index.html", "pages/details.html", "brochure/index.html"],
    preview: false,
  };
  for (const [href, expected, target] of [
    ["#register", "#register", "_self"],
    ["../index.html", context.base + "index.html", "_self"],
    ["../", context.base + "index.html", "_self"],
    ["/pages/details.html?x=1#info", context.base + "pages/details.html?x=1#info", "_self"],
    ["/brochure/", context.base + "brochure/index.html", "_self"],
    ["/admissions?year=2026#apply", "https://university.example/admissions?year=2026#apply", "_top"],
    ["registration", "https://university.example/registration", "_top"],
    ["https://forms.example/apply", "https://forms.example/apply", "_blank"],
    ["//forms.example/apply", "https://forms.example/apply", "_blank"],
    ["mailto:admissions@example.com", "mailto:admissions@example.com", "_blank"],
    ["tel:+919876543210", "tel:+919876543210", "_blank"],
  ]) assert.deepEqual(resolveNavigation(href, context), { href: expected, target });
  assert.equal(resolveNavigation("/admissions", { ...context, preview: true }).target, "_blank");
  assert.equal(resolveNavigation("https://forms.example/submit", context, true).target, "_blank");
  for (const value of ["", "javascript:alert(1)", "data:text/html,hello", "http://forms.example/submit"])
    assert.equal(resolveNavigation(value, context, true), null);
  assert.doesNotMatch(CODE_PAGE_SANDBOX, /allow-same-origin/);
  pass("ZIP paths, site routes, external registration links, query/fragment preservation and safe form destinations");
  const { seoSchema } = require("../dist/codePages/schema");
  const {
    socialImageError,
    resolveSocialImage,
  } = require("../dist/codePages/seo");
  for (const image of [
    "",
    "  ",
    " https://example.com/share.jpg ",
    "/uploads/share.webp",
    "assets/banner.png",
    "./assets/banner.png",
  ]) {
    assert.equal(seoSchema.safeParse({ image }).success, true, image);
  }
  for (const image of [
    "hello",
    "http://example.com/a.png",
    "//example.com/a.png",
    "javascript:alert(1)",
    "data:image/png;base64,abc",
    "../banner.png",
    "/uploads/../banner.png",
    "/uploads/%2e%2e/banner.png",
    "/uploads/%00banner.png",
    "https://user:secret@example.com/a.png",
  ]) {
    assert.equal(seoSchema.safeParse({ image }).success, false, image);
  }
  assert.equal(seoSchema.parse({ image: "  " }).image, "");
  assert.equal(
    seoSchema.parse({ image: " ./assets/banner.png " }).image,
    "assets/banner.png",
  );
  assert.equal(
    seoSchema.safeParse({ canonical: "/local-path" }).success,
    false,
  );
  assert.ok(
    socialImageError("assets/missing.png", [
      { path: "assets/banner.png", mime: "image/png" },
    ]).includes("not in the current ZIP"),
  );
  assert.equal(
    resolveSocialImage(
      "assets/banner one.png",
      "https://example.com/api/code-pages/content/page/version/",
    ),
    "https://example.com/api/code-pages/content/page/version/assets/banner%20one.png",
  );
  assert.equal(
    resolveSocialImage(
      "/uploads/share.webp",
      "https://example.com/api/code-pages/content/page/version/",
    ),
    "https://example.com/uploads/share.webp",
  );
  pass(
    "optional sharing images accept blanks, HTTPS, website paths and ZIP images; unsafe URLs remain blocked",
  );
  const request = (client, route, method = "GET", body, csrf = true) =>
    client.request("/api/code-pages" + route, method, body, csrf);
  const expect = async (promise, status) => {
    const result = await promise;
    assert.equal(result.status, status, JSON.stringify(result.body));
    return result.body;
  };
  const quotaKey = digest(
    `code-pages:${(await prisma.adminUser.findUnique({ where: { username: "builder-admin" } })).id}:upload`,
  );
  const clearUploadBudget = () =>
    prisma.adminLoginThrottle.deleteMany({ where: { key: quotaKey } });
  const put = async (current, document, files = {}) =>
    expect(
      request(admin, `/${current.id}`, "PUT", {
        revision: current.revision,
        document,
        files,
      }),
      200,
    );
  const upload = async (client, current, buffer) => {
    const form = new FormData();
    form.append("revision", String(current.revision));
    form.append(
      "file",
      new Blob([buffer], { type: "application/zip" }),
      "campaign.zip",
    );
    return request(client, `/${current.id}/upload`, "POST", form);
  };
  const create = async (name, route) =>
    expect(request(admin, "", "POST", settings(name, route)), 201);
  async function preview(current) {
    const result = await expect(
      request(admin, `/${current.id}/preview`, "POST", {
        revision: current.revision,
      }),
      200,
    );
    const rendered = await fetch(base + result.url);
    assert.equal(rendered.status, 200);
    const csp = rendered.headers.get("content-security-policy");
    assert.match(csp, /sandbox allow-scripts/);
    assert.doesNotMatch(csp, /allow-same-origin/);
    assert.match(csp, /form-action https:/);
    assert.match(csp, /allow-forms/);
    assert.match(csp, /allow-popups-to-escape-sandbox/);
    assert.match(csp, /allow-top-navigation-by-user-activation/);
    assert.match(csp, /frame-src 'none'/);
    assert.equal(rendered.headers.get("x-frame-options"), null);
    assert.equal(rendered.headers.get("x-robots-tag"), "noindex, nofollow");
    const html = await rendered.text();
    assert.match(html, /noindex, nofollow/);
    assert.match(html, /Code SEO title/);
    current = await expect(
      request(admin, `/${current.id}/previewed`, "POST", {
        revision: current.revision,
        token: result.token,
      }),
      200,
    );
    return { current, preview: result, html };
  }
  async function release(current) {
    current = (await preview(current)).current;
    current = await expect(
      request(admin, `/${current.id}/approve`, "POST", {
        revision: current.revision,
      }),
      200,
    );
    return expect(
      request(admin, `/${current.id}/publish`, "POST", {
        revision: current.revision,
        confirm: true,
        confirmRoute: current.document.integration.route,
      }),
      200,
    );
  }
  await expect(request(visitor, ""), 401);
  await expect(request(visitor, "/destinations"), 401);
  await expect(request(visitor, "/unknown/versions"), 401);
  await expect(
    request(viewer, "", "POST", settings("No create", "/no-create")),
    403,
  );
  await expect(
    request(admin, "", "POST", settings("No csrf", "/no-csrf"), false),
    403,
  );
  let current = await create("Code integration", "/code-integration");
  const id = current.id;
  await expect(
    request(viewer, `/${id}`, "PUT", {
      revision: current.revision,
      document: current.document,
    }),
    403,
  );
  await expect(
    request(editor, `/${id}/publish`, "POST", {
      revision: current.revision,
      confirm: true,
    }),
    403,
  );
  assert.equal(
    await expect(request(visitor, "/resolve?route=/code-integration"), 200),
    null,
  );
  pass("session permissions, CSRF, draft privacy and publication permissions");
  const png = await require("sharp")({
    create: { width: 8, height: 8, channels: 4, background: "#38a372" },
  })
    .png()
    .toBuffer();
  const html =
    '<!doctype html><html><head><title>Uploaded title</title><base href="https://evil.example/"><meta http-equiv="refresh" content="0;url=/admin"><link rel="stylesheet" href="styles.css"></head><body><h1 id="heading">Code fixture</h1><img src="assets/banner.png"><img id="root-image" src="/assets/banner.png"><script src="scripts/app.js"></script></body></html>';
  const files = {
    "campaign/index.html": html,
    "campaign/styles.css":
      "@import './extra.css';body { background: rgb(12, 34, 56) } .banner { background-image: url('/assets/banner.png') }",
    "campaign/extra.css": "h1 { color: rgb(50, 180, 100) }",
    "campaign/scripts/app.js": "document.body.dataset.executed='yes';",
    "campaign/assets/banner.png": png,
    "campaign/data.json": '{"ok":true}',
  };
  current = await expect(upload(admin, current, zip(files)), 200);
  assert.equal(current.stage, "DRAFT");
  assert.equal(current.document.package.entry, "index.html");
  assert.equal(current.document.package.files.length, 6);
  assert.equal(current.document.validation.errors.length, 0);
  const stored = await prisma.codeDocument.findUnique({ where: { pageId: id } });
  const legacyDocument = JSON.parse(stored.draftJson);
  legacyDocument.validation.warnings = ["Legacy policy: forms and popups are blocked"];
  await prisma.codeDocument.update({
    where: { pageId: id }, data: { draftJson: JSON.stringify(legacyDocument) },
  });
  const refreshed = await expect(request(admin, `/${id}`), 200);
  assert.equal(refreshed.revision, current.revision);
  assert.ok(refreshed.document.validation.warnings.some((message) => message.includes("HTTPS form submissions are supported")));
  assert.ok(refreshed.document.validation.warnings.every((message) => !message.includes("Legacy policy")));
  assert.equal(
    current.document.package.files.find((f) => f.path === "assets/banner.png")
      .source,
    undefined,
  );
  assert.equal(
    await expect(request(visitor, "/resolve?route=/code-integration"), 200),
    null,
  );
  assert.ok(
    fs.existsSync(
      path.join(
        assetDirectory,
        current.document.package.files.find(
          (f) => f.path === "assets/banner.png",
        ).hash,
      ),
    ),
  );
  await expect(
    request(admin, `/${id}/publish`, "POST", {
      revision: current.revision,
      confirm: true,
    }),
    409,
  );
  const invalidImage = await request(admin, `/${id}`, "PUT", {
    revision: current.revision,
    document: {
      ...current.document,
      seo: { ...current.document.seo, image: "hello" },
    },
  });
  assert.equal(invalidImage.status, 400);
  assert.match(invalidImage.body.error, /Social-sharing image/);
  assert.doesNotMatch(invalidImage.body.error, /seo\.image:/);
  current = await put(current, {
    ...current.document,
    seo: { ...current.document.seo, image: "  ", canonical: "  " },
  });
  assert.equal(current.document.seo.image, "");
  assert.equal(current.document.seo.canonical, "");
  current = await put(current, {
    ...current.document,
    seo: { ...current.document.seo, image: " /uploads/banner.webp " },
  });
  assert.equal(current.document.seo.image, "/uploads/banner.webp");
  current = await put(current, {
    ...current.document,
    seo: { ...current.document.seo, image: " ./assets/banner.png " },
  });
  assert.equal(current.document.seo.image, "assets/banner.png");
  assert.equal(current.document.validation.errors.length, 0);
  const validRevision = current.revision;
  const badArchives = [
    [Buffer.from("not a zip"), 400],
    [zip({ "../outside.html": "x" }), 400],
    [zip({ "/absolute.html": "x" }), 400],
    [zip({ "a\\b.html": "x" }), 400],
    [zip({ "index.html": "<h1>x</h1>", "shell.php": "<?php" }), 400],
    [zip({ "index.html": "<h1>x</h1>", "fake.png": "executable text" }), 400],
    [zip({ "index.html": "<h1>x</h1>" }, { encrypted: true }), 400],
    [zip({ "index.html": "<h1>x</h1>" }, { symlink: true }), 400],
    [zip({ "index.html": "<h1>x</h1>" }, { badCrc: true }), 400],
    [zip({ "index.html": "x".repeat(2000000) }, { deflate: true }), 413],
    [zip({ "one.html": "x", "two.html": "x" }), 400],
    [zip({ "index.html": "x", "INDEX.HTML": "y" }), 400],
    [
      zip(
        Object.fromEntries(
          Array.from({ length: 501 }, (_, i) => [`f${i}.txt`, "x"]),
        ),
      ),
      413,
    ],
    [Buffer.alloc(MAX_ZIP + 1), 413],
  ];
  for (const [archive, status] of badArchives) {
    await clearUploadBudget();
    await expect(upload(admin, current, archive), status);
  }
  current = await expect(request(admin, `/${id}`), 200);
  assert.equal(current.revision, validRevision);
  pass(
    "folder preservation, MIME checks, ZIP traversal, symlinks, encryption, CRC, duplicates, size, expansion and entry limits",
  );
  await clearUploadBudget();
  const missing = {
    ...files,
    "campaign/index.html": html.replace(
      "assets/banner.png",
      "assets/missing.png",
    ),
  };
  current = await expect(upload(admin, current, zip(missing)), 200);
  assert.equal(current.stage, "VALIDATING");
  assert.ok(
    current.document.validation.errors.some((v) => v.includes("missing.png")),
  );
  current = (await preview(current)).current;
  await expect(
    request(admin, `/${id}/approve`, "POST", { revision: current.revision }),
    400,
  );
  current = await expect(upload(admin, current, zip(files)), 200);
  current = await put(current, {
    ...current.document,
    integration: {
      ...current.document.integration,
      mode: "submenu",
      parent: "Campus Life",
      label: "Code campaign",
      position: 2,
    },
  });
  const inspected = await preview(current);
  current = inspected.current;
  assert.doesNotMatch(inspected.html, /<base|http-equiv/);
  assert.match(
    inspected.html,
    new RegExp(
      `/api/code-pages/preview/${inspected.preview.token}/assets/banner.png`,
    ),
  );
  const previewAsset = await fetch(
    base + inspected.preview.url.replace(/index.html$/, "assets/banner.png"),
  );
  assert.equal(previewAsset.status, 200);
  assert.deepEqual(Buffer.from(await previewAsset.arrayBuffer()), png);
  assert.equal(
    (
      await fetch(
        base +
          "/uploads/" +
          current.document.package.files.find(
            (f) => f.path === "assets/banner.png",
          ).hash,
      )
    ).status,
    404,
  );
  const expired = await request(admin, `/${id}/preview`, "POST", {
    revision: current.revision,
  });
  await prisma.codePreview.update({
    where: { tokenHash: digest(expired.body.token) },
    data: { expiresAt: new Date(0) },
  });
  assert.equal((await fetch(base + expired.body.url)).status, 404);
  pass(
    "missing assets block approval, preview is isolated and noindex, asset URLs work, private storage and preview expiry",
  );
  current = await release(current);
  const originalRelease = current.publishedVersionId;
  const resolved = await expect(
    request(visitor, "/resolve?route=/code-integration"),
    200,
  );
  assert.equal(resolved.versionId, originalRelease);
  const imagePath = `/api/code-pages/content/${id}/${originalRelease}/assets/banner.png`;
  assert.equal(
    resolved.seo.image,
    `https://chalapathiuniversity.edu.in${imagePath}`,
  );
  const sharingImage = await fetch(base + imagePath);
  assert.equal(sharingImage.status, 200);
  assert.equal(sharingImage.headers.get("content-type"), "image/png");
  assert.deepEqual(Buffer.from(await sharingImage.arrayBuffer()), png);
  pass(
    "draft saves normalize optional sharing images and published metadata maps ZIP images to public asset URLs",
  );
  assert.equal(
    (await admin.get("/links")).body.find((p) => p.id === id).slug,
    "/code-integration",
  );
  assert.equal(
    (await expect(admin.request("/api/pages"), 200)).find((p) => p.id === id)
      .slug,
    "/code-integration",
  );
  assert.equal(
    (await expect(admin.request("/api/cms"), 200)).pages.find(
      (p) => p.id === id,
    ).slug,
    "/code-integration",
  );
  const published = await fetch(base + resolved.contentUrl);
  assert.equal(published.status, 200);
  assert.match(await published.text(), /Code fixture/);
  let placement = (await admin.get("/placements")).body.navigation.find(
    (p) => p.id === id,
  );
  assert.equal(placement.slug, "/code-integration");
  assert.equal(placement.parentNav, "Campus Life");
  assert.equal((await request(visitor, `/${id}/versions`)).status, 401);
  const document = current.document;
  current = await put(current, document, {
    "index.html": html.replace("Code fixture", "Revised draft"),
  });
  assert.equal(current.stage, "DRAFT");
  assert.match(
    await (await fetch(base + resolved.contentUrl)).text(),
    /Code fixture/,
  );
  assert.doesNotMatch(
    await (await fetch(base + resolved.contentUrl)).text(),
    /Revised draft/,
  );
  await expect(
    request(admin, `/${id}`, "PUT", {
      revision: current.revision - 1,
      document,
    }),
    409,
  );
  await expect(
    request(admin, `/${id}/publish`, "POST", {
      revision: current.revision,
      confirm: true,
    }),
    409,
  );
  await expect(
    admin.request(`/api/pages/${id}`, "PUT", { name: "Bypass" }),
    409,
  );
  await expect(
    admin.request("/api/cms", "POST", {
      action: "savePage",
      page: { slug: `/code-drafts/${id}`, name: "Bypass", type: "custom" },
    }),
    409,
  );
  current = await release(current);
  assert.notEqual(current.publishedVersionId, originalRelease);
  assert.equal((await fetch(base + resolved.contentUrl)).status, 200);
  assert.equal(
    (
      await prisma.codeVersion.findUnique({
        where: { id: current.publishedVersionId },
      })
    ).previousVersionId,
    originalRelease,
  );
  const newResolved = await expect(
    request(visitor, "/resolve?route=/code-integration"),
    200,
  );
  assert.match(
    await (await fetch(base + newResolved.contentUrl)).text(),
    /Revised draft/,
  );
  pass(
    "atomic publication, shared navigation, draft isolation, stale-write protection and generic CMS bypass protection",
  );
  const other = await create("Conflict", "/code-integration");
  let conflicting = await expect(upload(admin, other, zip(files)), 200);
  conflicting = (await preview(conflicting)).current;
  await expect(
    request(admin, `/${conflicting.id}/approve`, "POST", {
      revision: conflicting.revision,
    }),
    409,
  );
  current = await put(current, {
    ...current.document,
    integration: {
      ...current.document.integration,
      route: "/about",
      mode: "page",
    },
  });
  current = (await preview(current)).current;
  await expect(
    request(admin, `/${id}/approve`, "POST", { revision: current.revision }),
    409,
  );
  const previous = await prisma.codeDocument.findUnique({
    where: { pageId: id },
  });
  assert.equal(previous.liveRoute, "/code-integration");
  current = await put(current, {
    ...current.document,
    integration: {
      ...current.document.integration,
      route: "/code-integration",
      mode: "footer",
      parent: "quickLinks",
      label: "Code footer",
    },
  });
  current = await release(current);
  placement = (await admin.get("/placements")).body.navigation.find(
    (p) => p.id === id,
  );
  assert.equal(placement.parentNav, "footer:quickLinks");
  current = await expect(
    request(admin, `/${id}/rollback`, "POST", {
      revision: current.revision,
      versionId: originalRelease,
      confirm: true,
    }),
    200,
  );
  placement = (await admin.get("/placements")).body.navigation.find(
    (p) => p.id === id,
  );
  assert.equal(placement.parentNav, "Campus Life");
  const rollbackResolved = await expect(
    request(visitor, "/resolve?route=/code-integration"),
    200,
  );
  assert.match(
    await (await fetch(base + rollbackResolved.contentUrl)).text(),
    /Code fixture/,
  );
  pass(
    "route conflicts preserve live release; footer placement and publication rollback restore source and navigation",
  );
  // A failed storage integrity check leaves release, menu and public route untouched.
  current = await put(current, current.document);
  current = (await preview(current)).current;
  current = await expect(
    request(admin, `/${id}/approve`, "POST", { revision: current.revision }),
    200,
  );
  const assetHash = current.document.package.files.find(
    (f) => f.path === "assets/banner.png",
  ).hash;
  const assetPath = path.join(assetDirectory, assetHash),
    assetBytes = fs.readFileSync(assetPath);
  fs.writeFileSync(assetPath, "corrupted");
  await expect(
    request(admin, `/${id}/publish`, "POST", {
      revision: current.revision,
      confirm: true,
    }),
    409,
  );
  fs.writeFileSync(assetPath, assetBytes);
  assert.equal(
    (await prisma.codeDocument.findUnique({ where: { pageId: id } }))
      .publishedVersionId,
    rollbackResolved.versionId,
  );
  current = await expect(request(admin, `/${id}`), 200);
  current = await put(current, {
    ...current.document,
    integration: {
      ...current.document.integration,
      mode: "homepage",
      route: "/",
      layout: "standalone",
    },
  });
  current = (await preview(current)).current;
  current = await expect(
    request(admin, `/${id}/approve`, "POST", { revision: current.revision }),
    200,
  );
  await expect(
    request(admin, `/${id}/publish`, "POST", {
      revision: current.revision,
      confirm: true,
    }),
    400,
  );
  current = await expect(
    request(admin, `/${id}/publish`, "POST", {
      revision: current.revision,
      confirm: true,
      confirmRoute: "/",
    }),
    200,
  );
  assert.equal(
    (await expect(request(visitor, "/resolve?route=/"), 200)).id,
    id,
  );
  await expect(
    request(admin, `/${id}`, "DELETE", { revision: current.revision }),
    400,
  );
  await expect(
    request(editor, `/${id}`, "DELETE", {
      revision: current.revision,
      confirm: true,
    }),
    403,
  );
  await expect(
    request(admin, `/${id}`, "DELETE", {
      revision: current.revision - 1,
      confirm: true,
    }),
    409,
  );
  assert.equal(
    (await expect(request(visitor, "/resolve?route=/"), 200)).id,
    id,
  );
  current = await expect(
    request(admin, `/${id}/unpublish`, "POST", {
      revision: current.revision,
      confirm: true,
    }),
    200,
  );
  assert.equal(await expect(request(visitor, "/resolve?route=/"), 200), null);
  assert.equal(
    (await admin.get("/placements")).body.navigation.some((p) => p.id === id),
    false,
  );
  current = await expect(
    request(admin, `/${id}/restore`, "POST", {
      revision: current.revision,
      versionId: originalRelease,
    }),
    200,
  );
  assert.equal(current.stage, "DRAFT");
  assert.equal(current.publishedVersionId, null);
  assert.equal(current.document.integration.parent, "Campus Life");
  pass(
    "asset integrity failure is atomic, homepage confirmation, unpublishing recovers original routes, historical draft restore",
  );
  if (process.env.CODE_PAGE_BROWSER === "1")
    await require("./code-pages-browser.cjs")({
      base,
      admin,
      current,
      files,
      zip,
      directory,
      request,
      expect,
      put,
      release,
    });
  await prisma.adminLoginThrottle.upsert({
    where: { key: quotaKey },
    create: {
      key: quotaKey,
      attempts: 10,
      expiresAt: new Date(Date.now() + 600000),
    },
    update: { attempts: 10, expiresAt: new Date(Date.now() + 600000) },
  });
  await expect(upload(admin, current, zip(files)), 429);
  await clearUploadBudget();
  const events = await prisma.adminSecurityEvent.findMany({
    where: { target: id },
  });
  for (const event of [
    "code_page_uploaded",
    "code_page_edited",
    "code_page_preview",
    "code_page_published",
    "code_page_rollback",
    "code_page_unpublished",
    "code_page_restored",
  ])
    assert.ok(
      events.some((e) => e.event === event),
      event,
    );
  await expect(
    request(admin, `/${id}`, "DELETE", {
      revision: current.revision,
      confirm: true,
    }),
    200,
  );
  await expect(request(admin, `/${id}`), 404);
  assert.equal(await prisma.codeVersion.count({ where: { pageId: id } }), 0);
  assert.equal(await prisma.codePreview.count({ where: { pageId: id } }), 0);
  let deleteLive = await create(
    "Delete published code fixture",
    "/delete-published-code",
  );
  deleteLive = await expect(upload(admin, deleteLive, zip(files)), 200);
  deleteLive = await put(deleteLive, {
    ...deleteLive.document,
    integration: {
      ...deleteLive.document.integration,
      mode: "footer",
      parent: "quickLinks",
      label: "Delete published code fixture",
    },
  });
  deleteLive = await release(deleteLive);
  const deletedRoute = await expect(
    request(visitor, "/resolve?route=/delete-published-code"),
    200,
  );
  const previewToDelete = await expect(
    request(admin, `/${deleteLive.id}/preview`, "POST", {
      revision: deleteLive.revision,
    }),
    200,
  );
  assert.ok(
    (await admin.get("/placements")).body.navigation.some(
      (page) => page.id === deleteLive.id,
    ),
  );
  await expect(
    request(visitor, `/${deleteLive.id}`, "DELETE", {
      revision: deleteLive.revision,
      confirm: true,
    }),
    401,
  );
  await expect(
    request(viewer, `/${deleteLive.id}`, "DELETE", {
      revision: deleteLive.revision,
      confirm: true,
    }),
    403,
  );
  await expect(
    request(editor, `/${deleteLive.id}`, "DELETE", {
      revision: deleteLive.revision,
      confirm: true,
    }),
    403,
  );
  await expect(
    request(
      admin,
      `/${deleteLive.id}`,
      "DELETE",
      { revision: deleteLive.revision, confirm: true },
      false,
    ),
    403,
  );
  await expect(
    request(admin, `/${deleteLive.id}`, "DELETE", {
      revision: deleteLive.revision,
      confirm: true,
    }),
    200,
  );
  assert.equal(
    await expect(
      request(visitor, "/resolve?route=/delete-published-code"),
      200,
    ),
    null,
  );
  assert.equal((await fetch(base + deletedRoute.contentUrl)).status, 404);
  assert.equal((await fetch(base + previewToDelete.url)).status, 404);
  assert.equal(
    await prisma.codeVersion.count({ where: { pageId: deleteLive.id } }),
    0,
  );
  assert.equal(
    await prisma.builderNavigation.count({ where: { pageId: deleteLive.id } }),
    0,
  );
  assert.equal(
    await prisma.adminSecurityEvent.count({
      where: {
        target: deleteLive.id,
        event: "code_page_deleted",
        success: true,
      },
    }),
    1,
  );
  assert.equal(
    (await request(admin, `/${other.id}`)).status,
    200,
    "Unrelated code drafts remain intact",
  );
  assert.ok(
    fs.existsSync(assetPath),
    "Shared content-addressed assets remain intact",
  );
  pass(
    "deletion checks confirmation, CSRF, permissions and versions, revokes live pages/previews/navigation/history, and preserves audits, shared assets and unrelated drafts",
  );
};
