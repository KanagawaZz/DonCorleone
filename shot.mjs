// Script temporário de validação visual (não faz parte do projeto entregue).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const out = process.argv[2];
const mode = process.argv[3] || 'desktop';
fs.mkdirSync(out, { recursive: true });
const mobile = mode === 'mobile';
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport(mobile ? { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 1 });
const logs = [];
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => logs.push('pageerror: ' + e.message));
page.on('requestfailed', (r) => logs.push('reqfailed: ' + r.url()));
page.on('response', (r) => { if (r.status() >= 400) logs.push(`http ${r.status()}: ${r.url()}`); });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2500));
const info = await page.evaluate(() => ({ cls: document.documentElement.className, h: document.documentElement.scrollHeight }));
console.log('html class:', info.cls, 'height', info.h);
const shot = async (name) => { await new Promise((r) => setTimeout(r, 1200)); await page.screenshot({ path: `${out}/${name}.png` }); };
await shot('01-hero');
const H = await page.evaluate(() => innerHeight);
const posOf = (sel) => page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top + scrollY, sel);
const go = async (y) => { await page.evaluate((v) => window.scrollTo(0, v), y); };
const sig = await posOf('#assinatura'); const stage = await posOf('#pizza'); const menu = await posOf('#cardapio');
await go(sig + H * 0.15); await shot('02-assinatura');
const pinLen = await page.evaluate(() => document.querySelector('.pin-spacer')?.offsetHeight ?? 0);
console.log({ sig, stage, menu, pinLen });
const pinStart = await page.evaluate(() => { const ps = document.querySelector('.pin-spacer'); return ps ? ps.getBoundingClientRect().top + scrollY : 0; });
for (const [i, f] of [0.12, 0.3, 0.55, 0.8, 0.97].entries()) { await go(pinStart + (pinLen - H) * f); await shot(`03-stage-${i}`); }
await go(menu); await shot('04-menu');
await page.evaluate(() => [...document.querySelectorAll('.chip')][2]?.click());
await shot('04b-menu-filter');
await go(await posOf('#casa')); await shot('05-casa');
await go(await posOf('#pedido')); await shot('06-pedido');
console.log('--- logs ---'); console.log(logs.join('\n') || 'nenhum erro/aviso');
await browser.close();
