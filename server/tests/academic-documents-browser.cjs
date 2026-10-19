const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

module.exports = async ({ base }) => {
  const { default: puppeteer } = await import("puppeteer-core");
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const output = path.resolve("../work/academic-documents-qa");
  fs.mkdirSync(output, { recursive: true });
  const fixture = path.join(output, "browser-document.pdf");
  fs.writeFileSync(fixture, "%PDF-1.7\nBrowser document fixture\n%%EOF\n");
  const page = await browser.newPage();
  page.setDefaultTimeout(20000);
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const click = async (label, scope = "") => {
    const handle = await page.waitForFunction(({ label, scope }) => [...document.querySelectorAll(`${scope} button`)].find(element => element.textContent.trim() === label && element.getBoundingClientRect().width && !element.disabled), {}, { label, scope });
    await handle.asElement().click(); await handle.dispose();
  };
  const waitTitle = title => page.waitForFunction(title => [...document.querySelectorAll("article h3")].some(element => element.textContent === title), {}, title);
  try {
    await page.setViewport({ width: 1440, height: 1100 });
    await page.goto(base + "/admin", { waitUntil: "domcontentloaded" });
    await page.waitForSelector('input[placeholder="Enter your username or email"]');
    await page.type('input[placeholder="Enter your username or email"]', "academic-admin");
    await page.type('input[placeholder="Enter password"]', "Academic-test-password-123!");
    await page.click('button[type="submit"]');
    await click("Syllabus & Regulations", ".admin-sidebar");
    await page.waitForSelector('[data-admin-module="academics"] input[type="file"]');
    await page.waitForFunction(() => !document.querySelector('[data-admin-module="academics"]')?.textContent.includes("Loading documents…"));
    const input = await page.$('[data-admin-module="academics"] form input:not([type="file"])');
    await input.type("Browser BTech syllabus");
    await (await page.$('[data-admin-module="academics"] input[type="file"]')).uploadFile(fixture);
    await click("Upload & publish", '[data-admin-module="academics"]');
    await waitTitle("Browser BTech syllabus");
    await page.screenshot({ path: path.join(output, "admin-desktop.png"), fullPage: true });
    await page.reload({ waitUntil: "domcontentloaded" });
    await click("Syllabus & Regulations", ".admin-sidebar"); await waitTitle("Browser BTech syllabus");
    const edit = await page.waitForFunction(() => [...document.querySelectorAll("article")].find(article => article.querySelector("h3")?.textContent === "Browser BTech syllabus")?.querySelector('[data-admin-action="edit"]'));
    await edit.asElement().click(); await edit.dispose();
    const titleInput = await page.$('[data-admin-module="academics"] form input:not([type="file"])');
    await titleInput.focus(); await page.keyboard.down("Control"); await page.keyboard.press("KeyA"); await page.keyboard.up("Control"); await titleInput.type("Browser replaced syllabus");
    await (await page.$('[data-admin-module="academics"] input[type="file"]')).uploadFile(fixture);
    await click("Save document", '[data-admin-module="academics"]'); await waitTitle("Browser replaced syllabus");
    await page.setViewport({ width: 390, height: 1000 });
    await page.screenshot({ path: path.join(output, "admin-mobile.png"), fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "admin has no horizontal overflow on mobile");

    const publicContext = await browser.createBrowserContext();
    const student = await publicContext.newPage();
    student.setDefaultTimeout(20000);
    student.on("pageerror", error => errors.push(error.message));
    await student.setViewport({ width: 1440, height: 1000 });
    for (const degree of ["btech", "mtech"]) for (const category of ["syllabus", "regulations"]) {
      await student.goto(`${base}/academics/documents/${degree}/${category}`, { waitUntil: "domcontentloaded" });
      await student.waitForSelector('a[aria-label^="Download "]');
      const heading = await student.$eval("main h1", element => element.textContent);
      assert.equal(heading, `${degree === "btech" ? "BTech" : "MTech"} ${category === "syllabus" ? "Syllabus" : "Regulations"}`);
      assert.equal(await student.$eval('a[aria-label^="Download "]', element => element.hasAttribute("download")), true);
    }
    await student.goto(`${base}/academics/documents/btech/syllabus`, { waitUntil: "domcontentloaded" });
    await student.waitForFunction(() => document.querySelector("main")?.textContent.includes("Browser replaced syllabus"));
    for (const width of [1024, 1280, 1440, 1890]) {
      await student.setViewport({ width, height: 1000 });
      const header = await student.$eval("header", element => {
        const nav = element.querySelector("nav");
        const desktop = nav.getBoundingClientRect().width > 0;
        const cta = element.querySelector('a[href="/admissions/apply"]')?.getBoundingClientRect();
        const links = [...nav.children].map(item => item.getBoundingClientRect());
        return { desktop, right: cta?.right, lastLink: links.at(-1)?.right, ctaLeft: cta?.left, width: innerWidth };
      });
      if (header.desktop) {
        assert.ok(header.right <= width, `Apply Now fits at ${width}px`);
        assert.ok(header.lastLink <= header.ctaLeft, `navigation does not overlap Apply Now at ${width}px`);
      }
    }
    await student.setViewport({ width: 1440, height: 1000 });
    await student.screenshot({ path: path.join(output, "public-desktop.png"), fullPage: true });
    await student.setViewport({ width: 390, height: 844 });
    await student.click('button[aria-label="Toggle mobile menu"]');
    const mobileClick = async name => {
      const handle = await student.waitForFunction(name => [...document.querySelectorAll("button")].find(element => element.textContent.trim() === name && element.getBoundingClientRect().width), {}, name);
      await handle.asElement().click(); await handle.dispose();
    };
    await mobileClick("Syllabus & Regulations"); await mobileClick("MTech");
    const regulations = await student.waitForFunction(() => [...document.querySelectorAll("a")].find(element => element.textContent.trim() === "Regulations" && element.getBoundingClientRect().width));
    await regulations.asElement().click(); await regulations.dispose();
    await student.waitForFunction(() => document.querySelector("main h1")?.textContent === "MTech Regulations");
    await student.waitForSelector('a[aria-label^="Download "]');
    await student.screenshot({ path: path.join(output, "public-mobile.png"), fullPage: true });
    assert.equal(await student.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "document page has no horizontal overflow on mobile");
    assert.deepEqual(errors, [], "no browser runtime errors");
    console.log("PASS browser: real admin sidebar, upload, reload persistence, replace, all four public document pages, downloads, mobile navigation and responsive layout.");
    await publicContext.close();
  } catch (error) {
    await page.screenshot({ path: path.join(output, "failure.png"), fullPage: true }).catch(() => {});
    console.error("Admin diagnostics:", await page.$eval('[data-admin-module="academics"]', element => element.innerText).catch(() => "Admin section unavailable"));
    console.error("Browser errors:", errors);
    throw error;
  } finally { await browser.close(); }
};
