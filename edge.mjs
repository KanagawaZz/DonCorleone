// Script temporário de validação de cenários (não faz parte do projeto entregue).
import puppeteer from 'puppeteer-core';

const scenario = process.argv[2];
const out = process.argv[3];
const args = ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
if (scenario === 'nowebgl') args.splice(1, 10, '--disable-3d-apis', '--disable-gpu');
const browser = await puppeteer.launch({ executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: 'new', args });
const page = await browser.newPage();
const width = scenario === 'narrow' ? 320 : 1280;
await page.setViewport({ width, height: scenario === 'narrow' ? 640 : 800 });
if (scenario === 'reduced') await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
if (scenario === 'slow') {
  const c = await page.createCDPSession();
  await c.send('Network.enable');
  await c.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await c.send('Emulation.setCPUThrottlingRate', { rate: 4 });
}
await page.evaluateOnNewDocument(() => {
  window.__m = { lcp: 0, cls: 0 };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__m.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
});
await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await new Promise((r) => setTimeout(r, scenario === 'slow' ? 9000 : 3000));
const r = await page.evaluate(() => {
  const links = [...document.querySelectorAll('[data-order]')].map((a) => a.getAttribute('href'));
  const cards = document.querySelectorAll('.card').length;
  const btn = document.querySelector('.card .btn');
  return {
    cls: document.documentElement.className, overflowX: document.documentElement.scrollWidth > innerWidth,
    cards, firstCardHref: btn?.href, sampleLinks: links.slice(0, 2), metrics: window.__m,
    pinned: !!document.querySelector('.pin-spacer'), canvas: !!document.querySelector('#stage-canvas canvas'),
  };
});
console.log(scenario, JSON.stringify(r, null, 1));
await page.evaluate(() => [...document.querySelectorAll('.chip')].find((c) => c.dataset.cat === 'Doces')?.click());
console.log('cards after Doces filter:', await page.evaluate(() => document.querySelectorAll('.card').length));
if (scenario === 'nowebgl' || scenario === 'reduced') {
  await page.screenshot({ path: `${out}/${scenario}-top.png` });
  await page.evaluate(() => document.querySelector('#pizza').scrollIntoView());
  await new Promise((r2) => setTimeout(r2, 800));
  await page.screenshot({ path: `${out}/${scenario}-stage.png` });
}
if (scenario === 'resize') {
  await page.evaluate(() => scrollTo(0, 2300)); await new Promise((r2) => setTimeout(r2, 500));
  await page.setViewport({ width: 700, height: 900 }); await new Promise((r2) => setTimeout(r2, 1500));
  await page.setViewport({ width: 1400, height: 800 }); await new Promise((r2) => setTimeout(r2, 1500));
  await page.screenshot({ path: `${out}/resize.png` });
}
console.log('logs:', logs.join('\n') || 'nenhum');
await browser.close();
