import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless:'new', args:['--no-sandbox'] });
const p = await b.newPage(); await p.setViewport({width:900,height:420});
await p.goto('http://localhost:4173/');
await p.setContent(`<link rel=stylesheet href="http://localhost:4173/${(await (await fetch('http://localhost:4173/')).text()).match(/assets\/index-[^"]+\.css/)[0]}"><body style="background:#111;color:#eee;font:500 64px 'Cormorant Garamond';padding:10px">
<div>você não (500)</div><div style="font-weight:600">você não (600)</div><div style="font-feature-settings:'ccmp' 0,'mark' 0,'mkmk' 0">você não (nomark)</div><div style="font-feature-settings:'kern' 0;letter-spacing:0">você não (nokern)</div><div style="font-family:Georgia">você não Georgia</div>`);
await new Promise(r=>setTimeout(r,1500)); await p.screenshot({path: process.argv[2]}); await b.close();
