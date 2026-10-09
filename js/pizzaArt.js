/*
 * pizzaArt.js — Ilustração SVG procedural de pizza (vista superior), usada como imagem de fallback
 * dos cards quando o produto não tem foto ou a foto falha. Cada estilo tem ingredientes diferentes.
 * Monta o SVG com createElementNS (sem innerHTML).
 */
const NS = 'http://www.w3.org/2000/svg';

function node(tag, attrs = {}, parent) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
}

function seeded(str) {
  let h = 2166136261;
  for (const c of String(str)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

// Pontos espalhados sem sobreposição forte, dentro do círculo de raio r
function scatter(rand, n, minD, r) {
  const pts = [];
  for (let t = 0; pts.length < n && t < n * 50; t++) {
    const a = rand() * 6.283;
    const d = Math.sqrt(rand()) * r;
    const p = [Math.cos(a) * d, Math.sin(a) * d];
    if (pts.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > minD)) pts.push(p);
  }
  return pts;
}

const PALETTE = {
  crust: '#b8782f', crustDark: '#6b3a14', sauce: '#9c2316', cheese: '#ecc46c', cheeseLight: '#f7e2a5',
};

/** @param {'calabresa'|'margherita'|'queijos'|'cogumelos'|'presunto'|'doce'} style */
export function createPizzaArt(style, seed = style) {
  const rand = seeded(seed + style);
  const svg = node('svg', { viewBox: '-110 -110 220 220', role: 'img', 'aria-hidden': 'true', focusable: 'false', preserveAspectRatio: 'xMidYMid meet' });
  node('ellipse', { cx: 0, cy: 8, rx: 100, ry: 100, fill: '#000', opacity: 0.45 }, svg);
  node('circle', { r: 98, fill: style === 'doce' ? '#a8692a' : PALETTE.crust }, svg);
  node('circle', { r: 98, fill: 'none', stroke: PALETTE.crustDark, 'stroke-width': 3, opacity: 0.55 }, svg);
  for (const [x, y] of scatter(rand, 9, 22, 92)) node('circle', { cx: x, cy: y, r: 3 + rand() * 4, fill: PALETTE.crustDark, opacity: 0.35 }, svg);

  const base = style === 'doce' ? '#3a1d12' : style === 'queijos' ? '#d9a95a' : PALETTE.sauce;
  node('circle', { r: 84, fill: base }, svg);
  if (style !== 'doce') {
    const cheeseBlobs = style === 'margherita' ? 6 : 14;
    const fill = style === 'margherita' ? '#f6efe0' : PALETTE.cheese;
    node('circle', { r: style === 'margherita' ? 0 : 80, fill: PALETTE.cheese }, svg);
    for (const [x, y] of scatter(rand, cheeseBlobs, style === 'margherita' ? 38 : 22, 66)) {
      node('circle', { cx: x, cy: y, r: style === 'margherita' ? 26 : 22 + rand() * 12, fill, opacity: style === 'margherita' ? 0.95 : 0.8 }, svg);
    }
  } else {
    for (const [x, y] of scatter(rand, 8, 26, 64)) node('circle', { cx: x, cy: y, r: 18 + rand() * 10, fill: '#5a2a18', opacity: 0.8 }, svg);
  }

  const add = (pts, draw) => pts.forEach(([x, y]) => draw(x, y, rand()));

  switch (style) {
    case 'calabresa':
      add(scatter(rand, 10, 28, 62), (x, y, r) => {
        const g = node('g', { transform: `translate(${x} ${y}) rotate(${r * 360})` }, svg);
        node('circle', { r: 15, fill: '#8c2a1b' }, g);
        node('circle', { r: 15, fill: 'none', stroke: '#4a140c', 'stroke-width': 2 }, g);
        node('circle', { cx: -4, cy: -4, r: 3, fill: '#d0583a', opacity: 0.6 }, g);
      });
      add(scatter(rand, 6, 22, 66), (x, y) => node('circle', { cx: x, cy: y, r: 6, fill: 'none', stroke: '#1b1511', 'stroke-width': 3 }, svg));
      add(scatter(rand, 7, 24, 66), (x, y, r) => node('path', { d: 'M-14 0 A14 14 0 0 1 14 0', transform: `translate(${x} ${y}) rotate(${r * 360})`, fill: 'none', stroke: '#9b3a5c', 'stroke-width': 2.5, opacity: 0.85 }, svg));
      break;
    case 'margherita':
      add(scatter(rand, 7, 26, 62), (x, y, r) => node('path', { d: 'M0 0 C8 -14 28 -14 34 0 C28 14 8 14 0 0Z', transform: `translate(${x - 14} ${y}) rotate(${r * 360})`, fill: '#2f5d2a', stroke: '#1d3e1a', 'stroke-width': 1.5 }, svg));
      break;
    case 'queijos': {
      const quad = [['#f4ecd6', 0], ['#cfd6e0', 90], ['#e9a24a', 180], ['#fbf6e8', 270]];
      quad.forEach(([c, a]) => node('path', { d: 'M0 0 L0 -78 A78 78 0 0 1 78 0Z', transform: `rotate(${a})`, fill: c, opacity: 0.88 }, svg));
      add(scatter(rand, 8, 14, 40), (x, y) => node('circle', { cx: -Math.abs(x) - 8, cy: -Math.abs(y) - 8, r: 3, fill: '#5d79a3' }, svg));
      break;
    }
    case 'cogumelos':
      add(scatter(rand, 9, 28, 62), (x, y, r) => {
        const g = node('g', { transform: `translate(${x} ${y}) rotate(${r * 360})` }, svg);
        node('path', { d: 'M-14 4 C-14 -14 14 -14 14 4 L5 4 L5 16 L-5 16 L-5 4Z', fill: '#d8c3a0', stroke: '#8b6f47', 'stroke-width': 1.5 }, g);
        node('path', { d: 'M-12 3 C-12 -9 12 -9 12 3Z', fill: '#b99a6c' }, g);
      });
      add(scatter(rand, 16, 10, 70), (x, y) => node('circle', { cx: x, cy: y, r: 2, fill: '#4c7a36' }, svg));
      break;
    case 'presunto':
      add(scatter(rand, 6, 34, 56), (x, y, r) => node('path', { d: 'M-22 0 C-18 -14 -8 4 0 -10 C8 4 18 -14 22 0 C18 14 8 -4 0 10 C-8 -4 -18 14 -22 0Z', transform: `translate(${x} ${y}) rotate(${r * 360})`, fill: '#d98a8a', stroke: '#a85a5a', 'stroke-width': 1.5 }, svg));
      add(scatter(rand, 12, 18, 64), (x, y, r) => node('ellipse', { cx: x, cy: y, rx: 12, ry: 4, transform: `rotate(${r * 360} ${x} ${y})`, fill: '#4a7a30' }, svg));
      add(scatter(rand, 5, 30, 60), (x, y) => node('circle', { cx: x, cy: y, r: 8, fill: '#c0301f', stroke: '#7a1a10', 'stroke-width': 1.5 }, svg));
      break;
    case 'doce':
      add(scatter(rand, 8, 28, 62), (x, y, r) => node('path', { d: 'M0 14 C-18 0 -12 -16 0 -9 C12 -16 18 0 0 14Z', transform: `translate(${x} ${y}) rotate(${r * 360})`, fill: '#c5222d', stroke: '#7a0f16', 'stroke-width': 1.5 }, svg));
      add(scatter(rand, 30, 8, 76), (x, y) => node('circle', { cx: x, cy: y, r: 1.6, fill: '#fff8ea', opacity: 0.85 }, svg));
      break;
    default:
      break;
  }
  return svg;
}
