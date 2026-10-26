const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
module.exports = async ({ base, files, zip, directory }) => {
  const external = require("node:http").createServer((_req, res) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
    res.setHeader("Content-Type", "text/html");
    res.end('<h1 id="registration-site">External registration site</h1>');
  });
  await new Promise((resolve) => external.listen(0, "127.0.0.1", resolve));
  const externalUrl = `http://127.0.0.1:${external.address().port}`;
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
      "campaign/index.html": files["campaign/index.html"].replace("<body>", `<body>
        <a id="jump-register" href="#register">Register now</a>
      `).replace("</body>", `
        <a id="zip-link" href="/pages/details.html?from=main#details">ZIP details</a>
        <a id="site-link" href="/about?from=code#team">About university</a>
        <a id="relative-site-link" href="about?from=relative">Relative website route</a>
        <a id="registration-link" href="${externalUrl}/register" target="_self">Register externally</a>
        <a id="explicit-blank" href="${externalUrl}/blank" target="_blank">New tab</a>
        <a id="anchor-link" href="#heading">Jump to heading</a>
        <a id="email-link" href="mailto:admissions@example.com">Email</a>
        <a id="phone-link" href="tel:+919876543210">Call</a>
        <button id="script-link" onclick="window.open('${externalUrl}/script', '_blank')">Script registration</button>
        <button id="helper-link" onclick="window.codePage.navigate('${externalUrl}/helper')">Button redirect</button>
        <button id="helper-site-link" onclick="window.codePage.navigate('/about?from=helper')">Website button</button>
        <button id="top-link" onclick="top.location.href='/about?from=script'">Script top navigation</button>
        <form id="post-registration" method="post" action="${base}/__code-page-test/registration">
          <input required name="student" value="Test Student"><button>Register POST</button>
        </form>
        <form id="get-registration" method="get" action="/__code-page-test/registration">
          <input name="course" value="Engineering"><button>Register GET</button>
        </form>
        <form id="missing-action"><button>Missing destination</button></form>
        <form id="override-registration" action="https://unused.example/" method="post">
          <input name="student" value="Override Student">
          <button formaction="/__code-page-test/registration" formtarget="_self">Override destination</button>
        </form>
        <button id="programmatic-form" onclick="const form=document.createElement('form');form.method='get';form.action='/__code-page-test/registration?source=programmatic';const input=document.createElement('input');input.name='source';input.value='programmatic';form.append(input);document.body.append(form);form.submit();">Submit dynamic form</button>
        <div style="height:4500px" aria-hidden="true"></div>
        <section id="register" style="min-height:1000px;padding:40px">
          <h2 class="registration-reveal" style="opacity:0">How to register</h2>
          <a id="section-form-link" href="${externalUrl}/section-registration">Open registration form</a>
        </section>
        <script>
          new IntersectionObserver(entries=>entries.forEach(entry=>{
            if(entry.isIntersecting)entry.target.style.opacity='1';
          }),{threshold:.12}).observe(document.querySelector('.registration-reveal'));
        </script>
      </body>`),
      "campaign/pages/details.html": '<h1 id="details">Packaged details</h1><a id="back-link" href="../index.html">Back</a>',
      "campaign/scripts/app.js":
        `document.body.dataset.executed='yes';try{parent.document.body.dataset.compromised='yes'}catch(e){document.body.dataset.domBlocked='yes'};try{localStorage.getItem('secret')}catch(e){document.body.dataset.storageBlocked='yes'};fetch('/api/auth/me').then(()=>document.body.dataset.apiBlocked='no').catch(()=>document.body.dataset.apiBlocked='yes');document.body.insertAdjacentHTML('beforeend','<a id="dynamic-link" href="${externalUrl}/dynamic">Dynamic registration</a>');`,
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
      fixture["campaign/index.html"].replace(
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
    const sandbox = await iframe.evaluate((el) => el.getAttribute("sandbox"));
    assert.match(sandbox, /allow-forms/);
    assert.match(sandbox, /allow-popups-to-escape-sandbox/);
    assert.doesNotMatch(sandbox, /allow-same-origin/);
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
    // A real destination that refuses embedding must open successfully outside the frame.
    const popupFrom = async (owner, frame, selector, url) => {
      const destination = browser.waitForTarget((target) => target.url() === url, { timeout: 20000 });
      await frame.click(selector);
      const popup = await (await destination).page();
      await popup.waitForFunction(() => document.readyState === "complete");
      assert.equal(await popup.evaluate(() => window.opener === null), true);
      assert.equal(owner.isClosed(), false);
      return popup;
    };
    for (const [selector, suffix] of [
      ["#registration-link", "/register"], ["#explicit-blank", "/blank"],
      ["#script-link", "/script"], ["#helper-link", "/helper"],
      ["#dynamic-link", "/dynamic"],
    ]) {
      const popup = await popupFrom(page, content, selector, externalUrl + suffix);
      await popup.waitForSelector("#registration-site");
      assert.equal(await popup.evaluate(() => !!document.cookie || localStorage.length >= 0), true,
        "Destination runs normally without inheriting the uploaded page sandbox");
      await popup.close();
    }
    const previewSite = await popupFrom(page, content, "#site-link", base + "/about?from=code#team");
    await previewSite.close();
    assert.match(page.url(), /\/admin/, "Preview links keep the editor open");
    await content.click("#anchor-link");
    await content.waitForFunction(() => location.hash === "#heading");
    await content.click("#zip-link");
    await content.waitForSelector("#details");
    assert.match(content.url(), /\/pages\/details\.html\?from=main#details$/);
    await content.click("#back-link");
    await content.waitForSelector("#heading");
    const student = await content.$('#post-registration input');
    await student.evaluate((input) => input.value = "");
    await content.click("#post-registration button");
    assert.equal(await student.evaluate((input) => input.validity.valueMissing), true);
    await student.type("Test Student");
    const postPopup = await popupFrom(page, content, "#post-registration button", base + "/__code-page-test/registration");
    const submission = await postPopup.$eval("body", (el) => JSON.parse(el.textContent));
    assert.equal(submission.method, "POST");
    assert.equal(submission.body.student, "Test Student");
    await postPopup.close();
    const getPopup = await popupFrom(page, content, "#get-registration button", base + "/__code-page-test/registration?course=Engineering");
    assert.equal((await getPopup.$eval("body", (el) => JSON.parse(el.textContent))).query.course, "Engineering");
    await getPopup.close();
    const overridePopup = await popupFrom(page, content, "#override-registration button", base + "/__code-page-test/registration");
    assert.equal((await overridePopup.$eval("body", (el) => JSON.parse(el.textContent))).body.student, "Override Student");
    await overridePopup.close();
    const dynamicFormPopup = await popupFrom(page, content, "#programmatic-form", base + "/__code-page-test/registration?source=programmatic");
    assert.equal((await dynamicFormPopup.$eval("body", (el) => JSON.parse(el.textContent))).query.source, "programmatic");
    await dynamicFormPopup.close();
    await content.click("#missing-action button");
    assert.match(content.url(), /index\.html/, "Unconfigured forms cannot submit into the content API");
    console.log("PASS: code pages — external/new-tab/dynamic links, script redirects, nested ZIP links, anchors, preview navigation, native form validation and GET/POST submissions; admin DOM/storage/API isolation retained");
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
    // Regression: an auto-height opaque frame has no inner scroll range. A hash
    // changing is insufficient; the outer viewport must reveal the distant section.
    await publicPage.waitForFunction(() => document.querySelector('iframe').getBoundingClientRect().height > 5000);
    await publicPage.evaluate(() => scrollTo({top:0,behavior:'instant'}));
    const liveMapping = await (await fetch(base + '/api/code-pages/resolve?route=/browser-campaign')).json();
    await publishedFrame.evaluate(channel => {
      parent.postMessage({type:'code-page',channel:'wrong-release',kind:'anchor',message:{top:4500}},'*');
      for(const top of ['4500',NaN,Infinity,{}])
        parent.postMessage({type:'code-page',channel,kind:'anchor',message:{top}},'*');
    },liveMapping.versionId);
    await publicPage.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    assert.equal(await publicPage.evaluate(() => scrollY),0,'Stale channels and malformed positions cannot scroll the main page');
    const assertRegistrationVisible = async () => {
      const sectionTop = await publishedFrame.$eval('#register', el => el.getBoundingClientRect().top);
      const expectedScroll = await publicPage.$eval('iframe', (el, sectionTop) => {
        const header = document.querySelector('header');
        return window.scrollY + el.getBoundingClientRect().top + sectionTop - (header?.getBoundingClientRect().height || 0);
      }, sectionTop);
      await publicPage.waitForFunction(expected => Math.abs(window.scrollY - expected) < 4, {}, expectedScroll);
      await publishedFrame.waitForFunction(() => getComputedStyle(document.querySelector('.registration-reveal')).opacity === '1');
      const bounds = await publicPage.$eval('iframe', el => ({top: el.getBoundingClientRect().top}));
      const heading = await publishedFrame.$eval('.registration-reveal', el => ({top: el.getBoundingClientRect().top,bottom:el.getBoundingClientRect().bottom}));
      const viewport = await publicPage.evaluate(() => innerHeight);
      assert.ok(bounds.top + heading.top >= 0 && bounds.top + heading.bottom < viewport,
        'Registration heading is visible in the main browser viewport, not just in the iframe DOM');
    };
    await publishedFrame.click('#jump-register');
    await assertRegistrationVisible();
    await publicPage.screenshot({path:path.join(out,'10-registration-anchor-desktop.png')});
    const sectionPopup = await popupFrom(publicPage, publishedFrame, '#section-form-link', externalUrl + '/section-registration');
    await sectionPopup.waitForSelector('#registration-site');
    await sectionPopup.close();
    // Clicking the same hash again must work even when no hashchange event fires.
    await publicPage.evaluate(() => scrollTo({top:0,behavior:'instant'}));
    await publishedFrame.click('#jump-register');
    await assertRegistrationVisible();
    await publicPage.setViewport({width:390,height:844});
    await publicPage.evaluate(() => scrollTo({top:0,behavior:'instant'}));
    await publishedFrame.click('#jump-register');
    await assertRegistrationVisible();
    await publicPage.screenshot({path:path.join(out,'11-registration-anchor-mobile.png')});
    await publicPage.setViewport({width:1440,height:1000});
    console.log('PASS: code pages — distant Register anchors scroll the outer viewport on desktop/mobile and repeated clicks, reveal animated content and expose the working external registration link');
    for (const [selector, suffix] of [["#registration-link", "/register"], ["#dynamic-link", "/dynamic"]]) {
      const popup = await popupFrom(publicPage, publishedFrame, selector, externalUrl + suffix);
      await popup.waitForSelector("#registration-site");
      await popup.close();
    }
    assert.equal(await publishedFrame.$eval("#email-link", (el) => el.getAttribute("href")), "mailto:admissions@example.com");
    assert.equal(await publishedFrame.$eval("#phone-link", (el) => el.getAttribute("href")), "tel:+919876543210");
    await publishedFrame.click("#site-link");
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
    assert.equal(publicPage.url(), base + "/about?from=code#team");
    await publicPage.goto(base + "/browser-campaign");
    const relativeFrame = await (await publicPage.waitForSelector('iframe[title="Browser campaign"]')).contentFrame();
    await relativeFrame.waitForSelector("#relative-site-link");
    await relativeFrame.click("#relative-site-link");
    await publicPage.waitForFunction(() => location.pathname === "/about" && location.search === "?from=relative");
    await publicPage.goto(base + "/browser-campaign");
    const helperFrame = await (await publicPage.waitForSelector('iframe[title="Browser campaign"]')).contentFrame();
    await helperFrame.waitForSelector("#helper-site-link");
    await helperFrame.click("#helper-site-link");
    await publicPage.waitForFunction(() => location.pathname === "/about" && location.search === "?from=helper");
    await publicPage.goto(base + "/browser-campaign");
    const scriptFrame = await (await publicPage.waitForSelector('iframe[title="Browser campaign"]')).contentFrame();
    await scriptFrame.waitForSelector("#top-link");
    await scriptFrame.click("#top-link");
    await publicPage.waitForFunction(() => location.pathname === "/about" && location.search === "?from=script");
    console.log("PASS: code pages — published site/relative links and clicked top-level script navigation leave the iframe correctly");
    await publicPage.close();
    await page.click(".cp-builder-switch button:first-child");
    await page.waitForSelector(".pb-manager", { visible: true });
    await page.click(".cp-builder-switch button:nth-child(2)");
    await click("Configure Page Integration");
    await page.waitForFunction(() =>
      document
        .querySelector(".cp-statusbar")
        ?.textContent.includes("PUBLISHED"),
    );
    await page.setViewport({ width: 390, height: 844 });
    await page.screenshot({
      path: path.join(out, "08-admin-mobile.png"),
      fullPage: true,
    });
    await click("Delete page");
    await page.waitForFunction(() =>
      document
        .querySelector(".cp-modal")
        ?.textContent.includes("This cannot be undone"),
    );
    await click("Cancel", ".cp-modal button");
    assert.ok(
      await (
        await fetch(base + "/api/code-pages/resolve?route=/browser-campaign")
      ).json(),
      "Cancelling keeps the published page live",
    );
    await click("All pages");
    await page.waitForSelector(
      '.cp-table button[aria-label="Delete Browser campaign"]',
    );
    const published = await (
      await fetch(base + "/api/code-pages/resolve?route=/browser-campaign")
    ).json();
    await page.click('.cp-table button[aria-label="Delete Browser campaign"]');
    await page.waitForSelector(".cp-modal");
    assert.match(
      await page.$eval(".cp-modal", (el) => el.textContent),
      /\/browser-campaign/,
    );
    await page.screenshot({
      path: path.join(out, "09-delete-confirmation.png"),
      fullPage: true,
    });
    await click("Delete permanently", ".cp-modal button");
    await page.waitForFunction(
      () =>
        !document.querySelector(".cp-modal") &&
        !document.querySelector('button[aria-label="Delete Browser campaign"]'),
    );
    assert.equal(
      await (
        await fetch(base + "/api/code-pages/resolve?route=/browser-campaign")
      ).json(),
      null,
    );
    assert.equal((await fetch(base + published.contentUrl)).status, 404);
    assert.equal(
      (
        await (await fetch(base + "/api/page-builder/placements")).json()
      ).navigation.some((page) => page.id === published.id),
      false,
    );
    await click("Create New Code Page");
    await fill(".cp-modal input", "Delete browser draft");
    await click("Create page", ".cp-modal button");
    await page.waitForSelector(".cp-upload");
    await click("Configure Page Integration");
    await fill("#cp-social-image", "unsaved invalid input");
    await click("Delete page");
    await click("Delete permanently", ".cp-modal button");
    await page.waitForFunction(
      () =>
        !document.querySelector(".cp-modal") &&
        !!document.querySelector(".cp-table"),
    );
    assert.equal(
      await page.$$eval(".cp-table tbody tr", (rows) =>
        rows.some((row) => row.textContent.includes("Delete browser draft")),
      ),
      false,
      "Draft deletion works without saving invalid unfinished fields",
    );
    assert.deepEqual(errors, [], "No uncaught portal errors");
    console.log(
      "PASS: code pages — upload/edit/preview/publish, sharing metadata, public mapping, visible delete actions, cancellation, published-page deletion with menu cleanup, and deletion of unfinished drafts",
    );
  } catch (error) {
    await page
      .screenshot({ path: path.join(out, "failure.png"), fullPage: true })
      .catch(() => {});
    throw error;
  } finally {
    await browser.close();
    await new Promise((resolve) => external.close(resolve));
  }
};
