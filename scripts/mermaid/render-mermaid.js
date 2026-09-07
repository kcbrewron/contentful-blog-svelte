// Renders Mermaid diagram sources to both .svg (vector, for web) and a 2x
// .png (for anywhere only raster is accepted) using the brand theme in
// mermaid-theme.json. Uses Playwright + the local mermaid.min.js UMD build
// — no CDN dependency, works in network-restricted sandboxes.
//
// Usage: node render-mermaid.js
// Reads every *.mmd file in ./diagrams/, writes matching .svg + .png to ./out/

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const THEME = JSON.parse(fs.readFileSync(path.join(__dirname, 'mermaid-theme.json'), 'utf8'));
const MERMAID_JS = fs.readFileSync(
  path.join(__dirname, 'node_modules/mermaid/dist/mermaid.min.js'),
  'utf8'
);

const DIAGRAMS_DIR = path.join(__dirname, 'diagrams');
const OUT_DIR = path.join(__dirname, 'out');
fs.mkdirSync(OUT_DIR, { recursive: true });

function buildHtml(mermaidSource) {
  const initConfig = JSON.stringify({
    startOnLoad: false,
    theme: THEME.theme,
    themeVariables: THEME.themeVariables,
    flowchart: { htmlLabels: false, curve: 'basis' },
    sequence: { actorFontFamily: THEME.themeVariables.fontFamily, messageFontFamily: THEME.themeVariables.fontFamily },
  });
  return `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  html, body { margin:0; padding:0; background:#FFFFFF; }
  #container { display:inline-block; padding:24px; background:#FFFFFF; }
  * { font-family: ${THEME.themeVariables.fontFamily}; }
</style>
<script>${MERMAID_JS}</script>
</head>
<body>
<div id="container"><div id="graph" class="mermaid"></div></div>
<script>
  window.__renderDone = false;
  window.__renderError = null;
  mermaid.initialize(${initConfig});
  const source = ${JSON.stringify(mermaidSource)};
  mermaid.render('graphSvg', source).then(({ svg }) => {
    document.getElementById('graph').innerHTML = svg;
    window.__renderDone = true;
  }).catch(err => {
    window.__renderError = String(err && err.message || err);
    window.__renderDone = true;
  });
</script>
</body></html>`;
}

async function main() {
  const files = fs.readdirSync(DIAGRAMS_DIR).filter(f => f.endsWith('.mmd'));
  if (files.length === 0) {
    console.log('No .mmd files found in', DIAGRAMS_DIR);
    return;
  }

  const browser = await chromium.launch();
  for (const file of files) {
    const name = file.replace(/\.mmd$/, '');
    const source = fs.readFileSync(path.join(DIAGRAMS_DIR, file), 'utf8');
    const html = buildHtml(source);
    const htmlPath = path.join(OUT_DIR, `${name}.render.html`);
    fs.writeFileSync(htmlPath, html);

    const page = await browser.newPage({ deviceScaleFactor: 2 });
    await page.goto('file://' + htmlPath);
    await page.waitForFunction('window.__renderDone === true', { timeout: 15000 });

    const error = await page.evaluate('window.__renderError');
    if (error) {
      console.error(`FAILED ${file}: ${error}`);
      await page.close();
      continue;
    }

    // Extract the rendered SVG's outerHTML as a standalone .svg file.
    const svgOuter = await page.evaluate(() => document.querySelector('#graph svg').outerHTML);
    fs.writeFileSync(path.join(OUT_DIR, `${name}.svg`), svgOuter);

    // Also grab a 2x PNG screenshot of just the container for raster use.
    const container = await page.$('#container');
    await container.screenshot({ path: path.join(OUT_DIR, `${name}.png`) });

    await page.close();
    console.log(`rendered ${name}.svg + ${name}.png`);
  }
  await browser.close();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
