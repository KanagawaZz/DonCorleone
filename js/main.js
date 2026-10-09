/*
 * main.js — Inicialização: aplica o conteúdo, monta o cardápio e carrega a cena 3D e o scroll em módulos separados.
 * Cada etapa falha de forma isolada: se WebGL, GSAP, Lenis ou Three.js falharem, o site continua utilizável
 * com a alternativa estática, e o erro é registrado no console.
 */
import { config } from './config.js';
import { applyContent } from './content.js';
import { initCardapio } from './cardapio.js';
import { detectQuality, prefersReducedMotion } from './device.js';

const root = document.documentElement;
const disposers = [];

function useStaticFallback(reason, error) {
  console.warn(`[doncorleone] Cena 3D desativada: ${reason}`, error ?? '');
  root.classList.remove('is-3d');
  root.classList.add('no-3d');
}

/** Conteúdo e cardápio: síncrono e leve, para o texto aparecer imediatamente (LCP). */
function renderContent() {
  try { applyContent(config); } catch (err) { console.error('[doncorleone] Falha ao aplicar o conteúdo.', err); }
  try { disposers.push(initCardapio(config).destroy); } catch (err) { console.error('[doncorleone] Falha ao montar o cardápio.', err); }
}

/** Animações e cena 3D: carregadas em módulos separados, cada um com falha isolada. */
async function boot() {
  const reducedMotion = prefersReducedMotion();
  const quality = detectQuality(config.animacao.cena3d);
  if (quality === 'baixo' || quality === 'estatico') root.classList.add('low-power');

  // GSAP é necessário para o scroll e para o loop único da cena 3D.
  let gsap;
  try { ({ gsap } = await import('gsap')); } catch (err) { useStaticFallback('GSAP não carregou.', err); return; }

  let pizza = null;
  if (quality === 'estatico') {
    useStaticFallback('desativada por configuração ou perfil do dispositivo.');
  } else {
    try {
      const { createPizzaScene } = await import('./pizza3d.js');
      pizza = createPizzaScene({
        host: document.getElementById('stage-canvas'),
        config,
        quality,
        reducedMotion,
        ticker: gsap.ticker,
        onContextLost: () => { pizza?.destroy(); pizza = null; useStaticFallback('contexto WebGL perdido.'); },
      });
      disposers.push(() => pizza?.destroy());
    } catch (err) {
      pizza = null;
      useStaticFallback('WebGL indisponível ou falha ao criar a cena.', err);
    }
  }

  try {
    const { initScroll } = await import('./scroll.js');
    const scroll = initScroll({ config, pizza, reducedMotion });
    disposers.push(scroll.destroy);
    if (pizza) root.classList.add('is-3d');
  } catch (err) {
    console.error('[doncorleone] Falha ao iniciar animações de scroll; usando rolagem nativa.', err);
    pizza?.destroy();
    pizza = null;
    useStaticFallback('animações de scroll indisponíveis.', err);
  }
}

// Conteúdo primeiro; só depois os módulos de animação e 3D.
const start = () => { renderContent(); boot(); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();

window.addEventListener('pagehide', (e) => {
  if (e.persisted) return; // bfcache: mantém a página restaurável
  disposers.splice(0).forEach((fn) => { try { fn(); } catch (err) { console.warn('[doncorleone] Falha na limpeza.', err); } });
});
