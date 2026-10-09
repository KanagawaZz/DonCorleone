/*
 * scroll.js — Lenis + GSAP + ScrollTrigger. Um único loop (gsap.ticker) move o Lenis e a cena 3D.
 * Cada cena tem seu gatilho; a pizza 3D é guiada por um objeto de estado (`pizza.state`) animado pelas timelines.
 * Respeita prefers-reduced-motion: sem Lenis, sem pin e sem scrub (poses trocam de forma instantânea).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const TAU = Math.PI * 2;

/**
 * @param {object} o
 * @param {object} o.config
 * @param {object|null} o.pizza controlador do pizza3d (ou null quando 3D indisponível)
 * @param {boolean} o.reducedMotion
 */
export function initScroll({ config, pizza, reducedMotion }) {
  const A = config.animacao;
  const dur = A.duracao;
  const mov = A.intensidade;
  const turns = A.pizza.rotacaoVoltas * mov;
  const cleanups = [];
  const stage = document.getElementById('pizza');
  const steps = [...document.querySelectorAll('#stage-steps li')];
  const fab = document.getElementById('fab');

  // ── Lenis (opcional) sincronizado ao ticker do GSAP ──
  let lenis = null;
  if (!reducedMotion && A.scroll.ativarScrollSuave) {
    try {
      lenis = new Lenis({
        autoRaf: false,
        duration: A.scroll.suavidade,
        wheelMultiplier: A.scroll.sensibilidadeRoda,
        anchors: { offset: -68 },
      });
      lenis.on('scroll', ScrollTrigger.update);
      const raf = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => { gsap.ticker.remove(raf); lenis.destroy(); });
    } catch (err) {
      console.error('[scroll] Lenis falhou; usando rolagem nativa.', err);
      lenis = null;
    }
  }

  const render = () => pizza?.requestRender();
  const setPose = (pose) => { if (pizza) { Object.assign(pizza.state, pose); render(); } };

  // ── Entrada do hero (curta, sem bloquear o conteúdo) ──
  const title = document.querySelector('[data-hero-title]');
  if (title && !reducedMotion) {
    const words = title.textContent.trim().split(/\s+/);
    title.setAttribute('aria-label', words.join(' '));
    title.replaceChildren(...words.flatMap((w, i) => {
      const s = document.createElement('span');
      s.className = 'w';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = w;
      return i < words.length - 1 ? [s, document.createTextNode(' ')] : [s];
    }));
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(title.querySelectorAll('.w'), { yPercent: 60, opacity: 0, duration: 0.9 * dur, stagger: 0.07 })
      .from('[data-hero-reveal]', { y: 22 * mov, opacity: 0, duration: 0.8 * dur, stagger: 0.1 }, '-=0.6');
    cleanups.push(() => tl.kill());
  }
  if (pizza) {
    if (reducedMotion) { pizza.state.intro = 1; render(); } else {
      gsap.to(pizza.state, { intro: 1, duration: 1.6 * dur, delay: 0.1, ease: 'power3.out', onUpdate: render });
    }
  }

  // ── Revelação de blocos ao entrar na tela (uma vez) ──
  if (!reducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach((node) => {
      gsap.from(node, { y: 44 * mov, opacity: 0, duration: 0.9 * dur, ease: 'power3.out', scrollTrigger: { trigger: node, start: 'top 88%', once: true } });
    });
  }

  // ── Navegação sólida e botão flutuante ──
  ScrollTrigger.create({ start: 60, end: 'max', onToggle: (self) => document.getElementById('nav')?.classList.toggle('is-solid', self.isActive) });
  if (fab) {
    // Visível depois do hero; escondido sobre o cardápio (cada card tem seu botão) e na seção final (CTA próprio).
    const fabState = { afterHero: false, inMenu: false };
    const updateFab = () => fab.classList.toggle('is-away', !fabState.afterHero || fabState.inMenu);
    updateFab();
    ScrollTrigger.create({
      trigger: '#assinatura', start: 'top 60%', endTrigger: '#pedido', end: 'top 70%',
      onToggle: (self) => { fabState.afterHero = self.isActive; updateFab(); },
    });
    ScrollTrigger.create({
      trigger: '#cardapio', start: 'top 85%', end: 'bottom 15%',
      onToggle: (self) => { fabState.inMenu = self.isActive; updateFab(); },
    });
  }

  // ── Cenas guiadas por scroll (por breakpoint) ──
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899.98px)' }, (ctx) => {
    const desktop = ctx.conditions.desktop;
    const base = { alpha: 1, focus: -1, explode: 0 };
    // Poses por cena. EDITAR AQUI: x/y em fração da meia-tela, scale relativo ao menor lado, tilt em radianos.
    const pose = desktop
      ? {
          hero: { ...base, x: 0.42, y: 0.0, scale: 0.66, tilt: 1.0, spin: 0, idle: 1 },
          sig: { ...base, x: -0.42, y: 0.0, scale: 0.6, tilt: 1.15, spin: 0.4 * turns * TAU, idle: 0 },
          stage: { ...base, x: 0.4, y: -0.12, scale: 0.46, tilt: 0.95, spin: 0.7 * turns * TAU, idle: 0 },
        }
      : {
          hero: { ...base, x: 0, y: 0.4, scale: 0.8, tilt: 1.0, spin: 0, idle: 1 },
          sig: { ...base, x: 0, y: 0.42, scale: 0.62, tilt: 1.2, spin: 0.4 * turns * TAU, idle: 0 },
          stage: { ...base, x: 0, y: 0.18, scale: 0.44, tilt: 0.85, spin: 0.7 * turns * TAU, idle: 0 },
        };
    const useScrub = !reducedMotion;
    const onScene = (id, key) => ScrollTrigger.create({
      trigger: id, start: 'top 55%', end: 'bottom 55%',
      onToggle: (self) => { if (self.isActive) setPose({ ...pose[key], explode: key === 'stage' ? 0.85 : 0, focus: -1, intro: 1 }); },
    });

    if (pizza) {
      pizza.setVisible(true);
      setPose(pose.hero);
    }

    if (pizza && !useScrub) {
      // Movimento reduzido: poses estáticas por seção, sem pin nem scrub.
      onScene('#inicio', 'hero');
      onScene('#assinatura', 'sig');
      onScene('#pizza', 'stage');
      ScrollTrigger.create({ trigger: '#cardapio', start: 'top 70%', onToggle: (s) => setPose({ alpha: s.isActive ? 0 : 1 }) });
      return undefined;
    }

    if (pizza) {
      const scrubOpts = (trigger, start, end) => ({ trigger, start, end, scrub: 0.6, invalidateOnRefresh: true });
      const to = (target, from, vars, st) => gsap.fromTo(target, from, { ...vars, ease: 'none', immediateRender: false, onUpdate: render, scrollTrigger: st });

      // 1) Hero → assinatura (parallax e troca de composição)
      to(pizza.state, pose.hero, pose.sig, scrubOpts('#inicio', 'top top', 'bottom top'));
      // 2) Assinatura → cena das camadas
      to(pizza.state, pose.sig, pose.stage, scrubOpts('#assinatura', 'bottom bottom', 'bottom top'));

      // 3) Camadas: cena fixada; ingredientes ganham foco conforme o scroll
      stage.classList.add('is-scrub');
      const pinLength = () => `+=${Math.round(window.innerHeight * (desktop ? 2.8 : 2.2))}`;
      const s = pizza.state;
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: render,
        scrollTrigger: { trigger: '#pizza', start: 'top top', end: pinLength, pin: '.stage__pin', pinSpacing: true, anticipatePin: 1, scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: () => {
            const idx = Math.max(0, Math.min(steps.length - 1, Math.round(s.focus)));
            steps.forEach((li, i) => li.classList.toggle('is-active', i === idx));
          } },
      });
      tl.fromTo(s, { explode: 0, focus: -1, tilt: pose.stage.tilt, spin: pose.stage.spin }, { explode: 1, focus: 0, tilt: pose.stage.tilt - 0.12, spin: pose.stage.spin + 0.25 * turns * TAU, duration: 1, ease: 'power2.inOut', immediateRender: false })
        .to(s, { focus: steps.length - 1, spin: pose.stage.spin + 0.6 * turns * TAU, duration: 3 })
        .to(s, { explode: 0, focus: -1, tilt: pose.stage.tilt, spin: pose.stage.spin + 0.75 * turns * TAU, duration: 1, ease: 'power2.inOut' });

      // 4) Saída: a cena some quando o cardápio assume a tela
      to(pizza.state, { alpha: 1 }, { alpha: 0 }, scrubOpts('#cardapio', 'top 85%', 'top 35%'));

      // Texto do hero cede espaço ao rolar (parallax discreto)
      gsap.to('.hero__copy', { y: -A.parallax.distancia * mov, opacity: 0.0, ease: 'none', scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom 35%', scrub: true } });
    }
    return () => stage?.classList.remove('is-scrub');
  });
  cleanups.push(() => mm.revert());

  // ── Recalcula gatilhos quando o layout muda ──
  let t;
  const refresh = () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 120); };
  document.addEventListener('doncorleone:menu-rendered', refresh);
  window.addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(refresh);
  cleanups.push(() => { document.removeEventListener('doncorleone:menu-rendered', refresh); clearTimeout(t); });

  return {
    destroy() {
      cleanups.reverse().forEach((fn) => fn());
      ScrollTrigger.getAll().forEach((st) => st.kill());
    },
  };
}
