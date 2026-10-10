const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/about/genesis', { waitUntil: 'networkidle0' });
  const svgs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('svg')).map(svg => svg.outerHTML);
  });
  console.log('SVGs found:', svgs.length);
  svgs.forEach((svg, i) => console.log(`SVG ${i}:`, svg.substring(0, 150)));
  await browser.close();
})();
