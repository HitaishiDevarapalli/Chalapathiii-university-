const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
module.exports = async ({ base, files, zip, directory }) => {
  const { default: puppeteer } = await import("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath:
      process.env.CHROME_PATH ||
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const out = path.resolve("../work/code-page-qa");
  fs.mkdirSync(out, { recursive: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  await page.setViewport({ width: 1680, height: 1100 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const click = async (text, selector = ".cp button") => {
    await page.waitForFunction(
      ({ text, selector }) =>
        [...document.querySelectorAll(selector)].some(
          (e) =>
            e.textContent.trim() === text &&
            !e.disabled &&
            e.getBoundingClientRect().width,
        ),
      {},
      { text, selector },
    );
    const button = await page.evaluateHandle(
      ({ text, selector }) =>
        [...document.querySelectorAll(selector)].find(
          (e) =>
            e.textContent.trim() === text &&
            !e.disabled &&
            e.getBoundingClientRect().width,
        ),
      { text, selector },
    );
    await button.asElement().click();
    await button.dispose();
  };
  const fill = async (selector, value) => {
    const el = await page.waitForSelector(selector);
    await el.click();
    await page.keyboard.down("Control");
    await page.keyboard.press("KeyA");
    await page.keyboard.up("Control");
    await el.type(value);
  };
  const selectLabel = async (label, value) => {
    const handle = await page.evaluateHandle(
      (label) =>
        [...document.querySelectorAll(".cp-field")]
          .find((el) => el.firstChild.textContent === label)
          ?.querySelector("select"),
      label,
    );
    assert.ok(handle.asElement(), label);
    await handle.asElement().select(value);
    await handle.dispose();
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
    await page.click(".cp-builder-switch button:nth-child(2)");
    await page.waitForSelector(".cp-table");
    await page.screenshot({
      path: path.join(out, "01-code-pages-dashboard.png"),
      fullPage: true,
    });
    await click("Create New Code Page");
    await fill(".cp-modal input", "Browser campaign");
    await click("Create page", ".cp-modal button");
    await page.waitForSelector(".cp-upload");
    const fixture = {
      ...files,
      "campaign/scripts/app.js":
        "document.body.dataset.executed='yes';try{parent.document.body.dataset.compromised='yes'}catch(e){document.body.dataset.domBlocked='yes'};try{localStorage.getItem('secret')}catch(e){document.body.dataset.storageBlocked='yes'};fetch('/api/auth/me').then(()=>document.body.dataset.apiBlocked='no').catch(()=>document.body.dataset.apiBlocked='yes');",
    };
    const archive = path.join(directory, "browser-campaign.zip");
    fs.writeFileSync(archive, zip(fixture));
    await (
      await page.$('input[type=file][aria-label="Upload website ZIP"]')
    ).uploadFile(archive);
    await page.waitForSelector(".cp-code");
    await page.waitForFunction(() =>
      document.querySelector(".cp-statusbar")?.textContent.includes("DRAFT"),
    );
    await fill(
      ".cp-code",
      files["campaign/index.html"].replace(
        "Code fixture",
        "Browser edited page",
      ),
    );
    await page.screenshot({
      path: path.join(out, "02-source-editor.png"),
      fullPage: true,
    });
    await click("Configure Page Integration");
    await selectLabel("Publish destination", "footer");
    await fill('input[aria-label="Published URL path"]', "/browser-campaign");
    await selectLabel("Footer section", "quickLinks");
    await fill("#cp-social-image", "hello");
    await click("Save changes");
    await page.waitForSelector('#cp-social-image[aria-invalid="true"]');
    assert.match(
      await page.$eval("#cp-social-image-error", (el) => el.textContent),
      /optional field blank/,
    );
    assert.equal(
      await page.$eval("#cp-social-image", (el) => el.value),
      "hello",
      "Invalid input stays available to correct",
    );
    await click("Clear optional image");
    assert.equal(await page.$eval("#cp-social-image", (el) => el.value), "");
    await click("Save changes");
    await page.waitForFunction(
      () =>
        document
          .querySelector(".cp-heading")
          ?.textContent.includes("All changes saved") &&
        !document.querySelector(".cp-busy"),
    );
    await page.select(
      'select[aria-label="Choose social-sharing image from ZIP"]',
      "assets/banner.png",
    );
    await click("Save changes");
    await page.waitForFunction(
      () =>
        document
          .querySelector(".cp-heading")
          ?.textContent.includes("All changes saved") &&
        !document.querySelector(".cp-busy"),
    );
    await page.screenshot({
      path: path.join(out, "03-integration.png"),
      fullPage: true,
    });
    await click("Preview Page");
    await page.waitForFunction(() =>
      document
        .querySelector(".cp-preview-footer")
        ?.textContent.includes("Preview rendered"),
    );
    const iframe = await page.$('iframe[title="Isolated code page preview"]');
    assert.equal(
      await iframe.evaluate((el) => el.getAttribute("sandbox")),
      "allow-scripts",
    );
    const content = await iframe.contentFrame();
    await content.waitForFunction(
      () => document.body.dataset.apiBlocked === "yes",
    );
    const state = await content.evaluate(() => ({
      executed: document.body.dataset.executed,
      domBlocked: document.body.dataset.domBlocked,
      storageBlocked: document.body.dataset.storageBlocked,
      apiBlocked: document.body.dataset.apiBlocked,
      bg: getComputedStyle(document.body).backgroundColor,
      color: getComputedStyle(document.querySelector("h1")).color,
      images: [...document.images].every(
        (img) => img.complete && img.naturalWidth > 0,
      ),
    }));
    assert.equal(state.executed, "yes");
    assert.equal(state.domBlocked, "yes");
    assert.equal(state.storageBlocked, "yes");
    assert.equal(state.apiBlocked, "yes");
    assert.equal(state.bg, "rgb(12, 34, 56)");
    assert.equal(state.color, "rgb(50, 180, 100)");
    assert.ok(state.images);
    assert.equal(
      await page.evaluate(() => document.body.dataset.compromised),
      undefined,
    );
    await page.screenshot({
      path: path.join(out, "04-desktop-preview.png"),
      fullPage: true,
    });
    await click("Tablet");
    await page.waitForFunction(
      () =>
        Math.round(
          document
            .querySelector('iframe[title="Isolated code page preview"]')
            .getBoundingClientRect().width,
        ) === 768,
    );
    await click("Mobile");
    await page.waitForFunction(
      () =>
        Math.round(
          document
            .querySelector('iframe[title="Isolated code page preview"]')
            .getBoundingClientRect().width,
        ) === 390,
    );
    await page.screenshot({
      path: path.join(out, "05-mobile-preview.png"),
      fullPage: true,
    });
    await click("Approve for Publishing");
    await page.waitForFunction(() =>
      document
        .querySelector(".cp-statusbar")
        ?.textContent.includes("READY TO PUBLISH"),
    );
    await click("Publish");
    await page.waitForSelector(".cp-publish-summary");
    assert.match(
      await page.$eval(".cp-publish-summary", (el) => el.textContent),
      /browser-campaign/,
    );
    await click("Confirm and Publish", ".cp-modal button");
    await page.waitForFunction(() =>
      document
        .querySelector(".cp-statusbar")
        ?.textContent.includes("PUBLISHED"),
    );
    await click("Drafts and Version History");
    await page.waitForFunction(() =>
      document.querySelector(".cp-table")?.textContent.includes("PUBLISHED"),
    );
    await click("Compare source");
    await page.waitForSelector(".cp-comparison");
    await page.screenshot({
      path: path.join(out, "06-history.png"),
      fullPage: true,
    });
    const publicPage = await browser.newPage();
    await publicPage.setViewport({ width: 1440, height: 1000 });
    await publicPage.goto(base + "/browser-campaign");
    await publicPage.waitForSelector('iframe[title="Browser campaign"]');
    const publishedFrame = await (
      await publicPage.$('iframe[title="Browser campaign"]')
    ).contentFrame();
    await publishedFrame.waitForSelector("#heading");
    assert.equal(
      await publishedFrame.$eval("#heading", (el) => el.textContent),
      "Browser edited page",
    );
    await publicPage.waitForFunction(() =>
      [...document.querySelectorAll("footer a")].some(
        (a) => a.getAttribute("href") === "/browser-campaign",
      ),
    );
    assert.equal(await publicPage.title(), "Browser campaign");
    assert.match(
      await publicPage.$eval('meta[property="og:image"]', (el) => el.content),
      /^https:\/\/chalapathiuniversity\.edu\.in\/api\/code-pages\/content\/.+\/assets\/banner\.png$/,
    );
    assert.equal(
      await publicPage.$$eval('meta[property="og:image"]', (els) => els.length),
      1,
      "Configured sharing image replaces the static fallback",
    );
    assert.equal(
      await publicPage.$$eval('link[rel="canonical"]', (els) => els.length),
      1,
    );
    assert.match(
      await publicPage.$eval('meta[name="twitter:image"]', (el) => el.content),
      /\/assets\/banner\.png$/,
    );
    await publicPage.screenshot({
      path: path.join(out, "07-published-page.png"),
      fullPage: true,
    });
    await publicPage.click('footer a[href="/about"]');
    await publicPage.waitForFunction(
      () =>
        location.pathname === "/about" &&
        !document.querySelector('iframe[title="Browser campaign"]'),
    );
    await publicPage.waitForFunction(() =>
      [...document.querySelectorAll('meta[property="og:image"]')].some(
        (meta) =>
          meta.content === "https://chalapathiuniversity.edu.in/logo.png",
      ),
    );
    await publicPage.close();
    await page.click(".cp-builder-switch button:first-child");
    await page.waitForSelector(".pb-manager", { visible: true });
    await page.click(".cp-builder-switch button:nth-child(2)");
    await click("Configure Page Integration");
    await click("Unpublish");
    await click("Unpublish", ".cp-modal button");
    await page.waitForFunction(() =>
      document.querySelector(".cp-statusbar")?.textContent.includes("DRAFT"),
    );
    await page.setViewport({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(out, "08-admin-mobile.png"),
      fullPage: true,
    });
    assert.deepEqual(errors, [], "No uncaught portal errors");
    console.log(
      "PASS: code pages — browser upload, editing UI, footer configuration, real isolated JS/CSS/images, blocked DOM/storage/API access, responsive previews, approval, publication, source comparison, public route/footer and Visual Builder preservation",
    );
  } catch (error) {
    await page
      .screenshot({ path: path.join(out, "failure.png"), fullPage: true })
      .catch(() => {});
    throw error;
  } finally {
    await browser.close();
  }
};
