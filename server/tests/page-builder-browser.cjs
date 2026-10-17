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
    await click("Choose from media library");
    await page.waitForSelector(".pb-media-grid img");
    await page.click(".pb-media-grid button");
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
    await click("Publish");
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
    await click("Preview");
    await page.waitForSelector(".pb-revisions .pb-preview");
    await page.click('[aria-label="Close dialog"]');
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
            "unpublish",
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
