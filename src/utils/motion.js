import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { prefereMovimentoReduzido } from './dispositivo.js';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function inicializarMotion() {
  // Ignorar resize de barra de navegação no mobile
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
  });

  if (!prefereMovimentoReduzido()) {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  return {
    gsap,
    ScrollTrigger,
    lenis: lenisInstance
  };
}

export function rolarPara(alvo, opcoes = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(alvo, { offset: opcoes.offset || 0, duration: 1.2 });
  } else {
    const el = typeof alvo === 'string' ? document.querySelector(alvo) : alvo;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

export function pararLenis() {
  if (lenisInstance) {
    lenisInstance.stop();
  }
}

export function retomarLenis() {
  if (lenisInstance) {
    lenisInstance.start();
  }
}

export { gsap, ScrollTrigger, lenisInstance };
