// Real browser navigation without a server or database. All requests are intercepted.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { buildSync } = require('esbuild');

(async () => {
  const root = path.resolve(__dirname, '../..');
  const bundle = buildSync({ stdin: { contents: `
    import React,{useEffect,useState} from 'react';
    import {createRoot} from 'react-dom/client';
    import {BrowserRouter} from 'react-router-dom';
    import {ResearchView} from './src/components/research/ResearchView';
    import {ResearchBlocks} from './src/components/research/ResearchBlocks';
    import {DEFAULT_RESEARCH_DATA} from './src/data/researchData';
    window.documentToken=String(Math.random());window.shellMounts=0;
    window.fetch=async()=>new Response(JSON.stringify(DEFAULT_RESEARCH_DATA),{status:200});
    const fixtures=[
      {id:'pdf',type:'button',text:'PDF fixture',href:'/research/downloads/CU_PhD_Regulations_2026-27.pdf',targetKind:'pdf',newTab:true},
      {id:'email',type:'button',text:'Email fixture',href:'mailto:research@chalapathiuniversity.edu.in',targetKind:'url'},
      {id:'external',type:'button',text:'External fixture',href:'https://example.org/research',targetKind:'url'},
      {id:'tab',type:'button',text:'New tab fixture',href:'/research?section=notification',targetKind:'url',newTab:true},
      {id:'modified',type:'button',text:'Modified fixture',href:'/research?section=eligibility',targetKind:'url'},
      {id:'group',type:'accordion',text:'Nested links',children:[{id:'bullet',type:'bullets',bullets:[{id:'b',text:'Bullet section fixture',targetKind:'url',href:'/research?section=eligibility'}]}]},
      {id:'image',type:'image',imageUrl:'/fixture.png',alt:'Image section fixture',targetKind:'url',href:'/research?section=notification'},
    ];
    function Shell(){const [dismissed,setDismissed]=useState(false);useEffect(()=>{window.shellMounts++;},[]);return <>
      <button id='dismiss-overlay' onClick={()=>setDismissed(true)}>{dismissed?'Overlay stays dismissed':'Dismiss overlay'}</button>
      <ResearchView/><div id='link-fixtures'><ResearchBlocks blocks={fixtures}/></div>
      <div id='preview-fixtures'><ResearchBlocks editing blocks={[{id:'preview',type:'button',text:'Preview fixture',href:'/research?section=eligibility',targetKind:'url'}]}/></div>
    </>}
    createRoot(document.getElementById('root')).render(<BrowserRouter><Shell/></BrowserRouter>);
  `, loader: 'tsx', resolveDir: root }, bundle: true, write: false, format: 'iife', jsx: 'automatic', loader: { '.css': 'empty' } }).outputFiles[0].text;
  const { default: puppeteer } = await import('puppeteer-core');
  const output = path.join(root, 'work/research-qa/navigation');
  fs.mkdirSync(output, { recursive: true });
  const profile = fs.mkdtempSync(path.join(output, 'chrome-'));
  const browser = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, userDataDir: profile, args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1000 });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    let documents = 0;
    await page.setRequestInterception(true);
    page.on('request', request => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++;
      void request.respond({ status: 200, contentType: 'text/html', body: '<!doctype html><div id="root"></div>' });
    });
    await page.goto('http://research-navigation.test/research/?section=overview');
    const css = fs.readdirSync(path.join(root, 'dist/assets')).find(name => /^index-.*\.css$/.test(name));
    await page.addStyleTag({ path: path.join(root, 'dist/assets', css) });
    await page.addScriptTag({ content: bundle });
    await page.waitForSelector('.research-content[aria-busy="false"]');
    const token = await page.evaluate(() => window.documentToken);
    await page.click('#dismiss-overlay');
    const waitSection = title => page.waitForFunction(title => document.querySelector('#research-section-title')?.textContent === title, {}, title);
    const overview = async () => { await page.$eval('.research-sidebar nav button', button => button.click()); await waitSection('Overview of Research'); };
    for (const [label, title, id] of [['Download Application', 'Download Application', 'apply'], ['Check Eligibility', 'Eligibility', 'eligibility'], ['View Notification →', 'Admission Notification', 'notification']]) {
      await overview();
      const handle = await page.waitForFunction(label => [...document.querySelectorAll('.research-content a')].find(link => link.textContent === label), {}, label);
      await handle.asElement().click(); await handle.dispose();
      await waitSection(title);
      assert.equal(new URL(page.url()).searchParams.get('section'), id);
      assert.equal(await page.evaluate(() => window.documentToken), token);
      assert.equal(await page.evaluate(() => window.shellMounts), 1);
      assert.equal(await page.$eval('#dismiss-overlay', button => button.textContent), 'Overlay stays dismissed');
      assert.equal(await page.evaluate(() => document.activeElement.id), 'research-section-title');
      assert.equal(await page.$eval('#research-section-title', heading => heading.getBoundingClientRect().top >= 0 && heading.getBoundingClientRect().top < innerHeight), true);
    }
    await page.evaluate(() => history.back()); await waitSection('Overview of Research');
    await page.evaluate(() => history.forward()); await waitSection('Admission Notification');
    await page.$eval('[data-block-id="bullet"] a', link => link.click()); await waitSection('Eligibility');
    await page.$eval('[data-block-id="image"] a', link => link.click()); await waitSection('Admission Notification');
    await page.evaluate(() => {
      document.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link?.closest('#link-fixtures, #preview-fixtures')) return;
        window.lastNativeClick = { prevented: event.defaultPrevented, href: link.getAttribute('href'), target: link.target };
        event.preventDefault(); // Observe native behavior without opening a PDF/email/external tab.
      });
    });
    for (const id of ['pdf', 'email', 'external', 'tab']) {
      await page.$eval('[data-block-id="' + id + '"] a', link => link.click());
      assert.equal(await page.evaluate(() => window.lastNativeClick.prevented), false);
    }
    const urlBeforeModified = page.url();
    await page.$eval('[data-block-id="modified"] a', link => link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true })));
    assert.equal(await page.evaluate(() => window.lastNativeClick.prevented), false);
    assert.equal(page.url(), urlBeforeModified);
    await page.$eval('#preview-fixtures a', link => link.click());
    assert.equal(await page.evaluate(() => window.lastNativeClick.prevented), true);
    assert.equal(page.url(), urlBeforeModified);
    assert.equal(documents, 1, 'Section clicks must not request another document');
    assert.deepEqual(errors, []);
    console.log('PASS: three research actions, nested bullet/image links, history, focused visible headings and shell state persist without reload; PDFs, mail, external/new-tab/modified links and editor previews keep their expected behavior.');
  } finally {
    await browser.close();
    if (path.dirname(profile) !== output) throw new Error('Unexpected browser profile path');
    fs.rmSync(profile, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
