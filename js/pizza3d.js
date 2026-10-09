/*
 * pizza3d.js — Cena Three.js: pizza procedural em 5 camadas (massa, molho, queijo, ingredientes, acabamento).
 * Renderização sob demanda (só desenha quando algo mudou ou durante o giro lento do hero),
 * resolução limitada por perfil de qualidade e liberação completa de recursos em destroy().
 * O progresso do scroll NÃO é lido aqui: o scroll.js anima o objeto `state` e chama requestRender().
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Color, HemisphereLight, DirectionalLight,
  CanvasTexture, SRGBColorSpace, MeshStandardMaterial, MeshBasicMaterial, Mesh, InstancedMesh,
  LatheGeometry, BufferGeometry, Float32BufferAttribute, PlaneGeometry, TorusGeometry,
  ShapeGeometry, IcosahedronGeometry, Shape, Vector2, Object3D, ACESFilmicToneMapping, DoubleSide, MathUtils,
} from 'three';

// EDITAR AQUI — perfis de qualidade (dpr máximo, resolução das texturas, segmentos, fração de ingredientes, limite de fps)
const PROFILES = {
  alto: { dpr: 2, tex: 1024, seg: 96, toppings: 1, fps: 0, aa: true },
  medio: { dpr: 1.5, tex: 512, seg: 64, toppings: 1, fps: 0, aa: true },
  baixo: { dpr: 1, tex: 256, seg: 40, toppings: 0.6, fps: 30, aa: false },
};

const CAMERA_Z = 9;
const FOV = 32;
const LAYER_GAP = 0.55; // distância base entre camadas quando separadas

/** Gerador pseudoaleatório determinístico: a pizza sempre sai igual. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTexture(size, paint, track) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  paint(c.getContext('2d'), size);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  track.push(tex);
  return tex;
}

function blob(ctx, x, y, r, color, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

/** Disco com anéis e relevo (usado no molho e no queijo). */
function discGeometry(radius, segs, rings, heightFn, edgeFn) {
  const pos = [0, heightFn(0, 0), 0];
  const uv = [0.5, 0.5];
  for (let k = 1; k <= rings; k++) {
    const t = k / rings;
    for (let s = 0; s < segs; s++) {
      const a = (s / segs) * Math.PI * 2;
      const rr = radius * t * (1 + (edgeFn ? edgeFn(a) - 1 : 0) * t * t);
      const x = Math.cos(a) * rr;
      const z = Math.sin(a) * rr;
      pos.push(x, heightFn(x, z), z);
      uv.push(0.5 + x / (2 * radius), 0.5 + z / (2 * radius));
    }
  }
  const idx = [];
  for (let s = 0; s < segs; s++) idx.push(0, 1 + ((s + 1) % segs), 1 + s);
  for (let k = 1; k < rings; k++) {
    for (let s = 0; s < segs; s++) {
      const i0 = 1 + (k - 1) * segs + s;
      const i1 = 1 + (k - 1) * segs + ((s + 1) % segs);
      const j0 = 1 + k * segs + s;
      const j1 = 1 + k * segs + ((s + 1) % segs);
      idx.push(i0, i1, j0, i1, j1, j0);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function leafGeometry() {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.05, 0.09, 0.2, 0.1, 0.27, 0);
  shape.bezierCurveTo(0.2, -0.1, 0.05, -0.09, 0, 0);
  const g = new ShapeGeometry(shape, 6);
  g.rotateX(-Math.PI / 2);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const z = p.getZ(i);
    p.setY(i, 2.6 * z * z + 0.18 * p.getX(i)); // concavidade e leve elevação da ponta
  }
  g.computeVertexNormals();
  return g;
}

/**
 * @param {object} o
 * @param {HTMLElement} o.host elemento que receberá o canvas
 * @param {object} o.config objeto de js/config.js
 * @param {'alto'|'medio'|'baixo'} o.quality
 * @param {boolean} o.reducedMotion
 * @param {{add:Function, remove:Function}} o.ticker loop único compartilhado (gsap.ticker)
 * @param {Function} [o.onContextLost]
 */
export function createPizzaScene({ host, config, quality, reducedMotion, ticker, onContextLost }) {
  const profile = PROFILES[quality] ?? PROFILES.medio;
  const anim = config.animacao.pizza;
  const colors = config.tema.cena3d;
  const disposables = [];
  const textures = [];

  const renderer = new WebGLRenderer({
    antialias: profile.aa,
    alpha: true,
    powerPreference: quality === 'baixo' ? 'low-power' : 'default',
  });
  renderer.setClearAlpha(0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  host.appendChild(renderer.domElement);
  const canvas = renderer.domElement;

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 40);
  camera.position.set(0, 0, CAMERA_Z);

  // Luz dramática: principal quente lateral + contorno bordô + preenchimento suave
  scene.add(new HemisphereLight(0xffe2bd, 0x180d09, 0.9));
  const key = new DirectionalLight(new Color(colors.luzPrincipal), 2.7);
  key.position.set(-4, 5, 6);
  const rim = new DirectionalLight(new Color(colors.luzContorno), 2.6);
  rim.position.set(5, 2, -3);
  scene.add(key, rim);

  // Hierarquia: root (posição/escala) > tilt (inclinação) > spin (giro) > camadas
  const root = new Group();
  const tilt = new Group();
  const spin = new Group();
  root.add(tilt);
  tilt.add(spin);
  scene.add(root);

  const layers = [new Group(), new Group(), new Group(), new Group(), new Group()];
  const layerMats = layers.map(() => []);
  layers.forEach((l) => spin.add(l));

  const mat = (i, params) => {
    const m = new MeshStandardMaterial({ emissive: new Color('#ffb25a'), emissiveIntensity: 0, ...params });
    layerMats[i].push(m);
    disposables.push(m);
    return m;
  };
  const geo = (g) => (disposables.push(g), g);

  const rand = rng(1969);
  const seg = profile.seg;
  const T = profile.tex;

  // ── Camada 0: massa ──
  const doughTex = canvasTexture(T, (ctx, s) => {
    ctx.fillStyle = colors.massa;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 260; i++) blob(ctx, rand() * s, rand() * s, s * (0.01 + rand() * 0.05), colors.massaQueimada, 0.12 + rand() * 0.3);
    for (let i = 0; i < 400; i++) blob(ctx, rand() * s, rand() * s, s * 0.006, '#fff3d6', 0.2 + rand() * 0.2);
  }, textures);
  const profilePts = [
    [0.001, -0.06], [1.0, -0.06], [1.06, -0.02], [1.09, 0.06], [1.06, 0.14], [0.98, 0.18], [0.9, 0.15], [0.85, 0.07], [0.001, 0.06],
  ].map(([x, y]) => new Vector2(x, y));
  const dough = new Mesh(geo(new LatheGeometry(profilePts, seg)), mat(0, { map: doughTex, bumpMap: doughTex, bumpScale: 2, roughness: 0.9 }));
  layers[0].add(dough);

  // Sombra de contato (blob radial) — fica na base, não acompanha a separação
  const shadowTex = canvasTexture(128, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, s * 0.25, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(0,0,0,0.85)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  }, textures);
  const shadowMat = new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.6 });
  disposables.push(shadowMat);
  const shadow = new Mesh(geo(new PlaneGeometry(3.2, 3.2)), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.2;
  tilt.add(shadow);

  // ── Camada 1: molho ──
  const sauceTex = canvasTexture(T, (ctx, s) => {
    ctx.fillStyle = colors.molho;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 60; i++) {
      ctx.strokeStyle = `rgba(215,70,40,${0.08 + rand() * 0.14})`;
      ctx.lineWidth = s * (0.01 + rand() * 0.03);
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s * (0.05 + rand() * 0.4), rand() * 6, rand() * 6 + 1.5 + rand() * 2);
      ctx.stroke();
    }
    for (let i = 0; i < 120; i++) blob(ctx, rand() * s, rand() * s, s * 0.01, '#2a0603', 0.35);
  }, textures);
  const sauce = new Mesh(
    geo(discGeometry(0.88, seg, 4, (x, z) => 0.075 + 0.006 * Math.sin(x * 11) * Math.cos(z * 9))),
    mat(1, { map: sauceTex, roughness: 0.6 }),
  );
  layers[1].add(sauce);

  // ── Camada 2: queijo ──
  const cheeseTex = canvasTexture(T, (ctx, s) => {
    ctx.fillStyle = colors.queijo;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 70; i++) blob(ctx, rand() * s, rand() * s, s * (0.03 + rand() * 0.08), colors.queijoDourado, 0.25 + rand() * 0.3);
    for (let i = 0; i < 50; i++) blob(ctx, rand() * s, rand() * s, s * (0.02 + rand() * 0.04), '#fff6d8', 0.35);
    // manchas onde o molho aparece entre os queijos
    for (let i = 0; i < 8; i++) blob(ctx, rand() * s, rand() * s, s * 0.04, colors.molho, 0.5);
  }, textures);
  const cheeseH = (x, z) => {
    const d = Math.hypot(x, z);
    return 0.1 + 0.022 * Math.sin(x * 9 + 1) * Math.cos(z * 8) + 0.012 * Math.sin(x * 19 + z * 14) - Math.max(0, d - 0.7) * 0.18;
  };
  const cheese = new Mesh(
    geo(discGeometry(0.87, seg, 14, cheeseH, (a) => 1 + 0.035 * Math.sin(3 * a + 1.2) + 0.02 * Math.sin(7 * a + 0.4))),
    mat(2, { map: cheeseTex, roughness: 0.45, ...(quality === 'baixo' ? {} : { bumpMap: cheeseTex, bumpScale: 1.5 }) }),
  );
  layers[2].add(cheese);

  // ── Camada 3: ingredientes (calabresa em rodelas + azeitonas) ──
  const dummy = new Object3D();
  const scatter = (count, minDist, maxR) => {
    const pts = [];
    let tries = 0;
    while (pts.length < count && tries++ < count * 60) {
      const a = rand() * Math.PI * 2;
      const r = Math.sqrt(rand()) * maxR;
      const p = [Math.cos(a) * r, Math.sin(a) * r];
      if (pts.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > minDist)) pts.push(p);
    }
    return pts;
  };

  const pepCount = Math.max(4, Math.round(anim.rodelasCalabresa * profile.toppings));
  const pepPts = scatter(pepCount, 0.3, 0.68);
  const pepTex = canvasTexture(Math.min(T, 512), (ctx, s) => {
    ctx.fillStyle = colors.calabresa;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 220; i++) blob(ctx, rand() * s, rand() * s, s * (0.008 + rand() * 0.02), '#e2b6a0', 0.5);
    for (let i = 0; i < 60; i++) blob(ctx, rand() * s, rand() * s, s * 0.04, colors.calabresaBorda, 0.4);
    ctx.fillStyle = colors.calabresaBorda; // borda mais escura
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, s, s * 0.08);
    ctx.fillRect(0, s * 0.92, s, s * 0.08);
    ctx.globalAlpha = 1;
  }, textures);
  const sliceProfile = [[0.001, 0.0], [0.15, 0.0], [0.15, 0.016], [0.12, 0.03], [0.06, 0.036], [0.001, 0.034]].map(([x, y]) => new Vector2(x, y));
  const sliceGeo = geo(new LatheGeometry(sliceProfile, 24));
  const pepMesh = new InstancedMesh(sliceGeo, mat(3, { map: pepTex, roughness: 0.5 }), pepPts.length);
  pepPts.forEach(([x, z], i) => {
    dummy.position.set(x, 0.105, z);
    dummy.rotation.set((rand() - 0.5) * 0.15, rand() * 6.28, (rand() - 0.5) * 0.15);
    dummy.scale.setScalar(0.85 + rand() * 0.35);
    dummy.updateMatrix();
    pepMesh.setMatrixAt(i, dummy.matrix);
  });
  layers[3].add(pepMesh);

  const oliveCount = Math.round(7 * profile.toppings);
  const olivePts = scatter(oliveCount, 0.25, 0.7);
  const oliveMesh = new InstancedMesh(geo(new TorusGeometry(0.055, 0.022, 8, 18)), mat(3, { color: '#1b1511', roughness: 0.35 }), olivePts.length);
  olivePts.forEach(([x, z], i) => {
    dummy.position.set(x, 0.125, z);
    dummy.rotation.set(Math.PI / 2, 0, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    oliveMesh.setMatrixAt(i, dummy.matrix);
  });
  layers[3].add(oliveMesh);

  // ── Camada 4: acabamento (manjericão + orégano) ──
  const leafCount = Math.max(3, Math.round(anim.folhasManjericao * profile.toppings));
  const leafMesh = new InstancedMesh(geo(leafGeometry()), mat(4, { roughness: 0.55, side: DoubleSide }), leafCount);
  const leafCol = new Color();
  scatter(leafCount, 0.28, 0.66).forEach(([x, z], i) => {
    dummy.position.set(x, 0.17, z);
    dummy.rotation.set((rand() - 0.5) * 0.4, rand() * 6.28, (rand() - 0.5) * 0.3);
    dummy.scale.setScalar(0.9 + rand() * 0.5);
    dummy.updateMatrix();
    leafMesh.setMatrixAt(i, dummy.matrix);
    leafMesh.setColorAt(i, leafCol.set(colors.manjericao).offsetHSL(0, 0, (rand() - 0.5) * 0.08));
  });
  layers[4].add(leafMesh);

  const fleckCount = Math.round(48 * profile.toppings);
  const fleckMesh = new InstancedMesh(geo(new IcosahedronGeometry(0.012, 0)), mat(4, { color: '#3d5a24', roughness: 0.9 }), fleckCount);
  for (let i = 0; i < fleckCount; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.82;
    dummy.position.set(Math.cos(a) * r, 0.13, Math.sin(a) * r);
    dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    dummy.scale.setScalar(0.7 + rand());
    dummy.updateMatrix();
    fleckMesh.setMatrixAt(i, dummy.matrix);
  }
  layers[4].add(fleckMesh);

  // ── Estado animável (escrito pelo scroll.js) ──
  const state = { x: 0, y: 0, scale: 0.6, tilt: 1, spin: 0, explode: 0, focus: -1, alpha: 1, idle: 1, intro: 0 };
  const view = { w: 1, h: 1 };
  let dirty = true;
  let visible = true;
  let idleSpin = 0;
  let last = 0;
  let destroyed = false;

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Barras de endereço móveis alteram só a altura: ignora variações pequenas para evitar saltos.
    if (w === view.w && Math.abs(h - view.h) < 160 && canvas.width > 0) return;
    view.w = w;
    view.h = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, profile.dpr));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dirty = true;
  }

  function apply() {
    const halfH = Math.tan(MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
    const halfW = halfH * camera.aspect;
    const fit = Math.min(halfW, halfH);
    const intro = state.intro;
    root.position.set(state.x * halfW, state.y * halfH, 0);
    root.scale.setScalar(state.scale * anim.escala * fit * (0.82 + 0.18 * intro));
    tilt.rotation.x = state.tilt;
    spin.rotation.y = state.spin + idleSpin - (1 - intro) * 0.9;
    const gap = LAYER_GAP * anim.separacao;
    layers.forEach((layer, i) => {
      layer.position.y = i * gap * state.explode;
      const f = state.focus < 0 ? 0 : Math.max(0, 1 - Math.abs(state.focus - i));
      layerMats[i].forEach((m) => { m.emissiveIntensity = f * 0.22; });
    });
    shadowMat.opacity = 0.6 * (1 - 0.5 * state.explode);
    canvas.style.opacity = String(Math.max(0, Math.min(1, state.alpha * intro)));
  }

  function tick(time, deltaMs) {
    if (destroyed || !visible || document.hidden || state.alpha * state.intro < 0.01) return;
    if (!reducedMotion && state.idle > 0.01 && anim.giroOcioso > 0) {
      idleSpin += (deltaMs / 1000) * anim.giroOcioso * state.idle;
      dirty = true;
    }
    if (!dirty) return;
    if (profile.fps) {
      if (time - last < 1 / profile.fps - 0.002) return;
      last = time;
    }
    apply();
    renderer.render(scene, camera);
    dirty = false;
  }

  const onLost = (e) => {
    e.preventDefault();
    onContextLost?.();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  const onVis = () => { dirty = true; };
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('resize', resize, { passive: true });
  resize();
  ticker.add(tick);

  return {
    state,
    quality,
    requestRender() { dirty = true; },
    setVisible(v) { visible = v; if (v) dirty = true; },
    resize() { view.w = 0; resize(); },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      ticker.remove(tick);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      disposables.forEach((d) => d.dispose());
      textures.forEach((t) => t.dispose());
      [pepMesh, oliveMesh, leafMesh, fleckMesh].forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}

