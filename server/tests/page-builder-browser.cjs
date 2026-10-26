const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
module.exports = async function builderBrowserTest(base) {
  const { default: puppeteer } = await import("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const out = path.resolve("../work/page-builder-qa");
  fs.mkdirSync(out, { recursive: true });
  const errors = [];
  const page = await browser.newPage();
  await page.setViewport({ width: 1680, height: 1100 });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("dialog", (d) => d.accept());
  page.setDefaultTimeout(15000);
  const click = async (text, selector = ".pb-app button") => {
    if (selector === ".pb-app button" && (await page.$(".pb-modal")))
      selector = ".pb-modal button";
    await page.waitForFunction(
      ({ text, selector }) =>
        [...document.querySelectorAll(selector)].some(
          (e) =>
            e.textContent.trim() === text &&
            e.getBoundingClientRect().width &&
            !e.disabled,
        ),
      {},
      { text, selector },
    );
    const handle = await page.evaluateHandle(
      ({ text, selector }) =>
        [...document.querySelectorAll(selector)].find(
          (e) =>
            e.textContent.trim() === text &&
            e.getBoundingClientRect().width &&
            !e.disabled,
        ),
      { text, selector },
    );
    await handle.asElement().click();
    await handle.dispose();
  };
  const fill = async (label, value, scope = ".pb-inspector") => {
    const handle = await page.evaluateHandle(
      ({ label, scope }) =>
        [...document.querySelectorAll(scope + " label")]
          .find((e) => e.querySelector("span")?.textContent === label)
          ?.querySelector("input,textarea,select"),
      { label, scope },
    );
    const input = handle.asElement();
    assert.ok(input, "Field exists: " + label);
    await input.click();
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyA");
    await page.keyboard.up("Control");
    await page.keyboard.press("Backspace");
    await input.type(value);
    await handle.dispose();
  };
  const select = async (label, value, scope = ".pb-settings") => {
    const handle = await page.evaluateHandle(
      ({ label, scope }) =>
        [...document.querySelectorAll(scope + " label")]
          .find((e) => e.querySelector("span")?.textContent === label)
          ?.querySelector("select"),
      { label, scope },
    );
    await handle.asElement().select(value);
    await handle.dispose();
  };
  const saved = () =>
    page.waitForFunction(
      () =>
        document.querySelector(".pb-save-status")?.textContent ===
        "Saved on server",
    );
  const api = (url, method = "GET", body) =>
    page.evaluate(
      async ({ url, method, body }) => {
        const r = await fetch("/api/page-builder" + url, {
          method,
          headers: { "Content-Type": "application/json" },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        });
        return { status: r.status, body: await r.json() };
      },
      { url, method, body },
    );
  const drag = async (from, to) => {
    await to.scrollIntoView();
    const frame = await from.evaluateHandle((el) => el.closest(".pb-frame"));
    if (frame.asElement()) await frame.asElement().hover();
    await from.scrollIntoView();
    const a = await from.boundingBox(),
      b = await to.boundingBox();
    assert.ok(a && b);
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(a.x + a.width / 2 + 10, a.y + a.height / 2, {
      steps: 3,
    });
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 16 });
    await page.mouse.up();
    // dnd-kit suppresses the trailing click briefly after a pointer drag.
    await new Promise((resolve) => setTimeout(resolve, 100));
  };
  try {
    await page.goto(base + "/admin");
    await page.waitForSelector(
      'input[placeholder="Enter your username or email"]',
    );
    await page.type(
      'input[placeholder="Enter your username or email"]',
      "builder-admin",
    );
    await page.type(
      'input[placeholder="Enter password"]',
      "Builder-test-password-123!",
    );
    await page.click('button[type="submit"]');
    await click("Page Builder", ".admin-nav-link");
    await page.waitForSelector(".pb-manager");
    await page.screenshot({
      path: path.join(out, "manager-desktop.png"),
      fullPage: true,
    });
    await click("Create new page");
    await fill("Page title", "Visual browser test", ".pb-modal");
    await click("Create draft");
    await page.waitForSelector(".pb-canvas");
    await click("Heading", ".pb-library-item button");
    await fill("Text content", "A page built visually");
    await click("Paragraph", ".pb-library-item button");
    await fill(
      "Text content",
      "This content was created in the visual editor and saved in PostgreSQL.",
    );
    await click("Two columns", ".pb-library-item button");
    const paragraph = await page.$(
      ".pb-type-paragraph > .pb-frame-label button",
    );
    const columnDrop = await page.$(
      ".pb-type-columns .pb-type-container .pb-drop-empty",
    );
    await drag(paragraph, columnDrop);
    await page.waitForFunction(() =>
      document.querySelector(".pb-type-columns .pb-type-paragraph"),
    );
    await click("Table", ".pb-library-item button");
    await click("Add row");
    await click("Add column");
    assert.equal(
      await page.$$eval(".pb-table-editor input", (inputs) => inputs.length),
      9,
    );
    await fill("Table caption", "University information");
    await click("Image", ".pb-library-item button");
    await click("Upload or choose photo");
    await page.waitForSelector(".media-grid img");
    const uploadPath = path.join(out, "photo-upload.webp");
    const existingPhoto = await page.$eval(
      ".media-grid img",
      (image) => image.src,
    );
    fs.writeFileSync(
      uploadPath,
      Buffer.from(await (await fetch(existingPhoto)).arrayBuffer()),
    );
    await (
      await page.$('.media-storage input[type="file"]')
    ).uploadFile(uploadPath);
    await page.waitForFunction(() =>
      document
        .querySelector(".media-notice")
        ?.textContent.includes("1 file added"),
    );
    await page.waitForFunction(
      (existing) =>
        [...document.querySelectorAll(".media-grid img")].some(
          (img) => img.src !== existing,
        ),
      {},
      existingPhoto,
    );
    await page.evaluate(
      (existing) =>
        [...document.querySelectorAll(".media-grid img")]
          .find((img) => img.src !== existing)
          .closest("button")
          .click(),
      existingPhoto,
    );
    await page.waitForFunction(
      () => !document.querySelector(".media-picker-dialog"),
    );
    await page.waitForSelector(".pb-canvas .pb-type-image img");
    assert.notEqual(
      await page.$eval(".pb-canvas .pb-type-image img", (image) => image.src),
      existingPhoto,
      "Selecting the uploaded storage photo attaches it to the page",
    );
    await fill("Alternative text", "Verified server image");
    const heightHandle = await page.$('[aria-label="Resize component height"]');
    await heightHandle.scrollIntoView();
    const heightBox = await heightHandle.boundingBox();
    await page.mouse.move(heightBox.x + 5, heightBox.y + 4);
    await page.mouse.down();
    await page.mouse.move(heightBox.x + 5, heightBox.y + 34, { steps: 8 });
    await page.mouse.up();
    assert.ok(
      await page.$eval(
        ".pb-canvas .pb-type-image",
        (el) => parseInt(el.style.getPropertyValue("--pb-height")) > 30,
      ),
    );
    await click("Accordion / FAQ", ".pb-library-item button");
    await click("Add question");
    await click("Button", ".pb-library-item button");
    await fill("Text content", "Contact the university");
    await fill("Destination URL", "/contact");
    await page.click('[aria-label="Duplicate component"]');
    assert.equal(
      await page.$$eval(".pb-canvas .pb-type-button", (a) => a.length),
      2,
    );
    await page.click('[aria-label="Delete component"]');
    assert.equal(
      await page.$$eval(".pb-canvas .pb-type-button", (a) => a.length),
      1,
    );
    await page.click('[aria-label="Undo"]');
    assert.equal(
      await page.$$eval(".pb-canvas .pb-type-button", (a) => a.length),
      2,
    );
    await page.click('[aria-label="Redo"]');
    assert.equal(
      await page.$$eval(".pb-canvas .pb-type-button", (a) => a.length),
      1,
    );
    await page.click(".pb-canvas .pb-type-heading");
    const handle = await page.$('[aria-label="Resize component width"]');
    const box = await handle.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x - 80, box.y, { steps: 8 });
    await page.mouse.up();
    assert.ok(
      await page.$eval(
        ".pb-canvas .pb-type-heading",
        (e) => parseInt(e.style.getPropertyValue("--pb-width")) < 100,
      ),
    );
    await click("Page settings");
    await fill("Meta title", "Visual editor test SEO", ".pb-settings");
    await fill(
      "Meta description",
      "Visual integration test page.",
      ".pb-settings",
    );
    await select("Where should this page appear?", "navigation");
    await select("Parent menu", "About Us");
    await fill(
      "Navigation / homepage label",
      "Visual browser page",
      ".pb-settings",
    );
    await click("Done");
    await click("Save draft");
    await saved();
    const list = await api("?search=Visual%20browser%20test");
    let current = list.body.items[0];
    assert.ok(current);
    assert.equal(current.document.nodes[1].type, "columns");
    assert.equal(
      current.document.nodes[1].children[0].children[0].type,
      "paragraph",
    );
    assert.equal(
      (
        await fetch(
          base + "/api/page-builder/public?slug=" + current.document.slug,
        )
      ).status,
      404,
    );
    // Saved placement creates a section editor entry before public publication.
    const aboutExpand = await page.$('[aria-label="Expand About Us"]');
    if (aboutExpand) await aboutExpand.click();
    await click("Visual browser test · draft", ".admin-subnavigation button");
    await page.waitForSelector(".pb-content-editor");
    const paragraphId = current.document.nodes[1].children[0].children[0].id;
    await fill(
      "Text content",
      "Paragraph filled from About Us",
      `.pb-content-card[data-node-id="${paragraphId}"]`,
    );
    const imageId = current.document.nodes.find(
      (node) => node.type === "image",
    ).id;
    const photoControl = `.pb-content-card[data-node-id="${imageId}"]`;
    const previousPhoto = await page.$eval(
      photoControl + " img",
      (image) => image.src,
    );
    await (
      await page.$(photoControl + ' input[type="file"]')
    ).uploadFile(uploadPath);
    await page.waitForFunction(
      ({ selector, previous }) =>
        document.querySelector(selector)?.src !== previous,
      {},
      { selector: photoControl + " img", previous: previousPhoto },
    );
    await click("Save draft");
    await saved();
    const sectionSaved = await api("/" + current.id);
    assert.equal(
      sectionSaved.body.document.nodes[1].children[0].children[0].props.text,
      "Paragraph filled from About Us",
    );
    assert.notEqual(
      sectionSaved.body.document.nodes.find((node) => node.type === "image")
        .props.url,
      current.document.nodes.find((node) => node.type === "image").props.url,
    );
    assert.equal(
      sectionSaved.body.document.nodes.find((node) => node.type === "image")
        .props.alt,
      "Verified server image",
    );
    await page.screenshot({
      path: path.join(out, "section-content-editor.png"),
      fullPage: true,
    });
    await click("Layout & components");
    await page.waitForSelector(".pb-canvas");
    await page.screenshot({
      path: path.join(out, "editor-desktop.png"),
      fullPage: true,
    });
    for (const device of ["tablet", "mobile"]) {
      await page.click(`[aria-label="${device} preview"]`);
      const columns = await page.$eval(
        ".pb-type-columns > .pb-grid",
        (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
      );
      assert.equal(columns, device === "mobile" ? 1 : 2);
      await page.screenshot({
        path: path.join(out, "editor-" + device + "-preview.png"),
        fullPage: true,
      });
    }
    await page.click('[aria-label="desktop preview"]');
    await click("Preview");
    await page.waitForSelector(".pb-modal .pb-preview");
    const preview = await browser.newPage();
    await preview.goto(base + "/admin/page-preview/" + current.id);
    await preview.waitForSelector(".pb-draft-banner");
    assert.ok(await preview.$(".pb-public .pb-type-image img"));
    await preview.close();
    await page.click('[aria-label="Close dialog"]');
    await click("Page settings");
    await click("Save & publish");
    await click("Confirm publication");
    await page.waitForFunction(() =>
      document.querySelector(".pb-status-published"),
    );
    const visitor = await browser.createBrowserContext();
    const publicPage = await visitor.newPage();
    publicPage.on("pageerror", (e) => errors.push(e.message));
    await publicPage.setViewport({ width: 1280, height: 900 });
    await publicPage.goto(base + current.document.slug);
    await publicPage.waitForSelector(".pb-public .pb-type-heading");
    assert.ok(
      (await publicPage.$eval(".pb-public", (e) => e.textContent)).includes(
        "A page built visually",
      ),
    );
    assert.equal(await publicPage.title(), "Visual editor test SEO");
    const about = await publicPage.evaluateHandle(() =>
      [...document.querySelectorAll("a,button")].find(
        (el) =>
          el.textContent.trim() === "About Us" &&
          el.getBoundingClientRect().width,
      ),
    );
    await about.asElement().hover();
    await publicPage.waitForSelector('a[href="/pages/visual-browser-test"]');
    await publicPage.setViewport({ width: 390, height: 844 });
    await publicPage.screenshot({
      path: path.join(out, "public-mobile.png"),
      fullPage: true,
    });
    assert.ok(
      await publicPage.$eval(
        ".pb-public",
        (e) => e.scrollWidth <= e.clientWidth + 1,
      ),
      "public content does not overflow at mobile width",
    );
    assert.equal(
      await publicPage.$eval(
        ".pb-public .pb-type-columns > .pb-grid",
        (e) => getComputedStyle(e).gridTemplateColumns.split(" ").length,
      ),
      1,
    );
    await page.click(".pb-canvas .pb-type-heading");
    await fill("Text content", "Edited draft heading");
    await click("Save draft");
    await saved();
    assert.ok(
      (
        await (
          await fetch(
            base + "/api/page-builder/public?slug=" + current.document.slug,
          )
        ).json()
      ).document.nodes[0].props.text.includes("A page built visually"),
    );
    await click("Update live page");
    await click("Confirm publication");
    await saved();
    assert.equal(
      (
        await (
          await fetch(
            base + "/api/page-builder/public?slug=" + current.document.slug,
          )
        ).json()
      ).document.nodes[0].props.text,
      "Edited draft heading",
    );
    await click("Revision history");
    await page.waitForSelector(".pb-revision");
    assert.equal(
      await page.$(".pb-revision-warning"),
      null,
      "Publishing leaves a clean saved draft",
    );
    assert.equal(
      await page.$(".pb-app > .pb-success"),
      null,
      "Background success banner is hidden while the modal is open",
    );
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyZ");
    await page.keyboard.up("Control");
    await page.keyboard.press("Delete");
    assert.equal(
      await page.$(".pb-revision-warning"),
      null,
      "Modal keyboard shortcuts cannot change the background draft",
    );
    assert.equal(
      await page.$eval(".pb-canvas .pb-type-heading", (el) =>
        el.textContent.includes("Edited draft heading"),
      ),
      true,
    );
    assert.ok(
      await page.$$eval(".pb-revision button", (buttons) =>
        buttons.some(
          (b) => b.textContent.trim() === "Restore draft" && !b.disabled,
        ),
      ),
      "Saved revision restoration is enabled",
    );
    await click("Preview");
    await page.waitForSelector(".pb-revisions .pb-preview");
    await page.screenshot({
      path: path.join(out, "revision-history-clean.png"),
      fullPage: true,
    });
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector(".pb-modal"));

    // A real edit remains protected, with recovery actions inside the dialog.
    await page.click('[aria-label="Undo"]');
    assert.equal(
      await page.$(".pb-app > .pb-success"),
      null,
      "Undo clears stale publication feedback",
    );
    await page.click('[aria-label="Redo"]');
    await saved();
    await page.click(".pb-canvas .pb-type-heading");
    await fill("Text content", "Unsaved revision-history edit");
    await click("Revision history");
    await page.waitForSelector(".pb-revision-warning");
    await click("Save draft");
    await page.waitForFunction(
      () => !document.querySelector(".pb-revision-warning"),
    );
    await page.waitForSelector(".pb-revision");
    await page.click('[aria-label="Close dialog"]');
    await page.click(".pb-canvas .pb-type-heading");
    await fill("Text content", "Discard this edit");
    await click("Revision history");
    await page.waitForSelector(".pb-revision-warning");
    await click("Discard unsaved changes");
    await page.waitForFunction(
      () => !document.querySelector(".pb-revision-warning"),
    );
    assert.equal(
      await page.$eval(".pb-canvas .pb-type-heading", (el) =>
        el.textContent.includes("Unsaved revision-history edit"),
      ),
      true,
    );
    await page.click('[aria-label="Close dialog"]');

    // Failed saves stay visible inside the dialog without losing the draft.
    await click("Page settings");
    await fill("URL slug", "/invalid-url", ".pb-settings");
    await click("Done");
    await click("Revision history");
    await click("Save draft");
    await page.waitForSelector('.pb-modal .pb-dialog-feedback[role="alert"]');
    assert.ok(
      await page.$eval(".pb-dialog-feedback", (el) => {
        const a = el.getBoundingClientRect(),
          b = el.closest(".pb-modal").getBoundingClientRect();
        return a.left >= b.left && a.right <= b.right;
      }),
      "Dialog errors stay within the dialog",
    );
    await click("Discard unsaved changes");
    await page.waitForFunction(
      () => !document.querySelector(".pb-revision-warning"),
    );
    await page.click('[aria-label="Close dialog"]');
    await click("Page settings");
    await select("Parent menu", "Campus Life");
    await click("Done");
    await click("Save draft");
    await saved();
    await page.waitForFunction(() => {
      const group = [...document.querySelectorAll(".admin-nav-group")].find(
        (group) =>
          group.querySelector(".admin-nav-link")?.textContent.trim() ===
          "Campus Life",
      );
      return group
        ?.querySelector(".admin-subnavigation")
        ?.textContent.includes("Visual browser test");
    });
    assert.ok(
      (await api("/placements")).body.navigation.some(
        (page) => page.id === current.id && page.parentNav === "About Us",
      ),
      "Draft placement moves the admin entry while the published menu stays unchanged",
    );
    await click("Visual browser test", ".admin-subnavigation button");
    await page.waitForSelector(".pb-content-editor");
    await click("Page settings");
    await select("Parent menu", "About Us");
    await click("Done");
    await click("Save draft");
    await saved();
    await click("Layout & components");
    await click("Unpublish");
    await click("Confirm unpublish");
    await page.waitForFunction(() =>
      document.querySelector(".pb-status-unpublished"),
    );
    assert.equal(
      (
        await fetch(
          base + "/api/page-builder/public?slug=" + current.document.slug,
        )
      ).status,
      404,
    );
    await page.setViewport({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(out, "editor-mobile-screen.png"),
      fullPage: true,
    });
    assert.ok(
      await page.$eval(".pb-app", (e) => e.scrollWidth <= e.clientWidth + 1),
      "editor has no page overflow on mobile",
    );
    await click("All pages");
    await page.reload();
    await page.waitForSelector('[aria-label="Open navigation"]');
    await page.click('[aria-label="Open navigation"]');
    await click("Page Builder", ".admin-nav-link");
    await page.waitForSelector(".pb-manager");
    await page.waitForFunction(() =>
      document
        .querySelector(".pb-manager")
        ?.textContent.includes("Visual browser test"),
    );
    await page.setViewport({ width: 1440, height: 1000 });
    for (const [kind, parent, title, group] of [
      ["homepage", "", "Added homepage feature", "Homepage"],
      [
        "navigation",
        "Main Menu",
        "Added top navigation page",
        "Navigation Links",
      ],
      ["standalone", "", "Added standalone page", "Website Pages"],
    ]) {
      const result = await api("", "POST", {
        document: {
          ...current.document,
          title,
          slug: "/pages/" + title.toLowerCase().replaceAll(" ", "-"),
          nodes: [],
          placement: {
            ...current.document.placement,
            kind,
            parent,
            label: title,
          },
        },
      });
      assert.equal(result.status, 201);
      await page.evaluate(() =>
        window.dispatchEvent(new Event("builder-document-saved")),
      );
      await page.waitForSelector(`[aria-label="Expand ${group}"]`);
      await page.click(`[aria-label="Expand ${group}"]`);
      await page.waitForFunction(
        ({ group, title }) => {
          const item = [...document.querySelectorAll(".admin-nav-group")].find(
            (item) => item.querySelector(".admin-nav-link")?.title === group,
          );
          return item
            ?.querySelector(".admin-subnavigation")
            ?.textContent.includes(title);
        },
        {},
        { group, title },
      );
    }
    const readerContext = await browser.createBrowserContext();
    const reader = await readerContext.newPage();
    reader.on("pageerror", (e) => errors.push(e.message));
    await reader.setViewport({ width: 1440, height: 1000 });
    await reader.goto(base + "/admin");
    await reader.waitForSelector(
      'input[placeholder="Enter your username or email"]',
    );
    await reader.type(
      'input[placeholder="Enter your username or email"]',
      "builder-viewer",
    );
    await reader.type(
      'input[placeholder="Enter password"]',
      "Builder-test-password-123!",
    );
    await reader.click('button[type="submit"]');
    await reader.waitForSelector('[aria-label="Expand About Us"]');
    await reader.click('[aria-label="Expand About Us"]');
    await reader.waitForFunction(() =>
      [...document.querySelectorAll(".admin-subnavigation button")].some(
        (button) => button.textContent.includes("Visual browser test"),
      ),
    );
    assert.equal(
      await reader.$eval(".admin-subnavigation", (nav) =>
        nav.textContent.includes("Genesis"),
      ),
      false,
      "Pages-only access does not expose existing About CMS modules",
    );
    const readerEntry = await reader.evaluateHandle(() =>
      [...document.querySelectorAll(".admin-subnavigation button")].find(
        (button) => button.textContent.includes("Visual browser test"),
      ),
    );
    await readerEntry.asElement().click();
    await reader.waitForSelector(".pb-content-editor");
    assert.equal(
      await reader.$eval(
        ".pb-content-card fieldset",
        (fieldset) => fieldset.disabled,
      ),
      true,
      "View-only section forms cannot edit content",
    );
    assert.equal(
      await reader.$eval(
        '.pb-content-card input[type="file"]',
        (input) => input.disabled,
      ),
      true,
      "View-only users cannot upload photos",
    );
    await readerContext.close();
    assert.ok(
      await page.$(
        '.pb-row-actions button[aria-label="Delete Visual browser test"]',
      ),
      "Delete is visible in the visual page list",
    );
    await page.click('[aria-label="Edit Visual browser test"]');
    await page.waitForSelector(".pb-editor-footer");
    await click("Publish");
    await click("Confirm publication");
    await page.waitForSelector(".pb-status-published");
    await click("Delete page");
    await page.waitForFunction(() =>
      document
        .querySelector(".pb-modal")
        ?.textContent.includes("This cannot be undone"),
    );
    await click("Cancel");
    assert.equal((await api(`/${current.id}`)).status, 200);
    await click("Delete page");
    await page.screenshot({
      path: path.join(out, "delete-page-confirmation.png"),
      fullPage: true,
    });
    await click("Delete permanently");
    await page.waitForSelector(".pb-manager");
    assert.equal((await api(`/${current.id}`)).status, 404);
    await page.waitForFunction(
      () =>
        ![...document.querySelectorAll(".admin-subnavigation button")].some(
          (button) => button.textContent.includes("Visual browser test"),
        ),
    );
    await page.click(
      '.pb-row-actions button[aria-label="Delete Added standalone page"]',
    );
    await click("Cancel");
    assert.ok(
      await page.$(
        '.pb-row-actions button[aria-label="Delete Added standalone page"]',
      ),
    );
    await page.click(
      '.pb-row-actions button[aria-label="Delete Added standalone page"]',
    );
    await click("Delete permanently");
    await page.waitForFunction(
      () =>
        !document.querySelector(
          '.pb-row-actions button[aria-label="Delete Added standalone page"]',
        ),
    );
    assert.deepEqual(errors, [], "no browser runtime errors");
    fs.writeFileSync(
      path.join(out, "report.json"),
      JSON.stringify(
        {
          passed: true,
          errors,
          checks: [
            "UI creation and editing",
            "nested pointer drag",
            "tables",
            "media selection",
            "automatic photo upload and replacement",
            "section sidebar draft discovery and content forms",
            "section moves preserve draft/live separation",
            "homepage, main navigation and standalone section grouping",
            "pages-only read access without legacy module or photo upload access",
            "width resizing",
            "undo/redo",
            "server save",
            "desktop/tablet/mobile canvas",
            "secure full-site preview",
            "publication and public navigation",
            "SEO",
            "mobile public rendering",
            "draft/live separation",
            "republish",
            "revision preview",
            "saved-state and revision dialog recovery",
            "modal keyboard isolation and notification layering",
            "unpublish",
            "confirmed live-page and draft deletion from editor/list with cancellation and sidebar cleanup",
            "mobile editor",
            "reload persistence",
          ],
        },
        null,
        2,
      ),
    );
    console.log(
      "PASS: browser editor/public workflows, nested drag, resizing, responsive layouts and persistence. Screenshots: " +
        out,
    );
  } catch (e) {
    await page
      .screenshot({ path: path.join(out, "failure.png"), fullPage: true })
      .catch(() => {});
    throw e;
  } finally {
    await browser.close();
  }
};
