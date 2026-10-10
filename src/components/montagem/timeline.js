import { gsap, ScrollTrigger } from '../../utils/motion.js';
import { detectarDispositivoFraco, prefereMovimentoReduzido } from '../../utils/dispositivo.js';

export function inicializarTimelineMontagem() {
  if (prefereMovimentoReduzido()) {
    const container = document.querySelector('#montagem');
    if (container) {
      container.classList.add('montagem--estatica');
    }
    return null;
  }

  const section = document.querySelector('#montagem');
  const palco = document.querySelector('.montagem-stage');
  const stack = palco?.querySelector('#pizza-exploded-stack');
  const legendas = document.querySelectorAll('.legenda-item');
  if (!section || !palco || !stack) return null;

  const ehDispositivoFraco = detectarDispositivoFraco();

  const mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 769px)",
    isMobile: "(max-width: 768px)"
  }, (context) => {
    const { isMobile } = context.conditions;
    const pinEnd = isMobile ? "+=200%" : "+=260%";
    const scrubVal = isMobile ? 0.4 : 0.6;

    // Elementos do Stack 3D
    const layerPeel = stack.querySelector('#layer-peel');
    const layerDough = stack.querySelector('#layer-dough');
    const layerSauce = stack.querySelector('#layer-sauce');
    const layerCheese = stack.querySelector('#layer-cheese');
    const layerToppings = stack.querySelector('#layer-toppings');
    const layerBaked = stack.querySelector('#layer-baked');
    const steam = stack.querySelector('#baked-steam');
    const highlightGlow = stack.querySelector('.baked-highlight-glow');
    const fgElements = palco.querySelectorAll('.fg-item');

    // ESTADO INICIAL (CENA 1 — ABERTURA CINEMATOGRÁFICA):
    // Stack 3D explodido em perspectiva realista (como na foto de referência)
    const initialTilt = isMobile 
      ? { rotateX: 36, rotateZ: -12, rotateY: 4 }
      : { rotateX: 46, rotateZ: -16, rotateY: 6 };

    gsap.set(stack, {
      transformPerspective: 1200,
      rotateX: initialTilt.rotateX,
      rotateZ: initialTilt.rotateZ,
      rotateY: initialTilt.rotateY,
      scale: isMobile ? 0.9 : 1.05
    });

    // Camadas separadas no espaço com profundidade física (Y e Z)
    gsap.set(layerPeel, { y: 110, z: -40, opacity: 1 });
    gsap.set(layerDough, { y: 55, z: 15, opacity: 0.95 });
    gsap.set(layerSauce, { y: 0, z: 65, opacity: 0.95 });
    gsap.set(layerCheese, { y: -55, z: 115, opacity: 0.95 });
    gsap.set(layerToppings, { y: -110, z: 165, opacity: 1 });
    gsap.set(layerBaked, { opacity: 0, scale: 0.98 });
    if (steam) gsap.set(steam, { opacity: 0 });
    if (highlightGlow) gsap.set(highlightGlow, { opacity: 0 });

    // Fatias individuais com leve elevação orgânica
    const slices = layerToppings.querySelectorAll('.float-item');
    slices.forEach((el, i) => {
      gsap.set(el, {
        z: 10 + (i * 8),
        rotateZ: (i % 2 === 0 ? 15 : -20) * (i + 1),
        opacity: 0.95
      });
    });

    // Animação Idle de flutuação suave antes do scroll
    let idleTimeline = null;
    if (!ehDispositivoFraco) {
      idleTimeline = gsap.timeline({ repeat: -1, yoyo: true });
      idleTimeline.to(stack, {
        y: "-=12",
        rotateX: "+=2",
        rotateZ: "-=1.5",
        duration: 4,
        ease: "sine.inOut"
      }, 0);
      idleTimeline.to(layerToppings, {
        y: "-=8",
        z: "+=15",
        duration: 3.2,
        ease: "sine.inOut"
      }, 0);
      idleTimeline.to(fgElements, {
        y: "+=15",
        x: "-=8",
        rotation: "+=4",
        duration: 3.8,
        ease: "sine.inOut",
        stagger: 0.2
      }, 0);
    }

    // Atualização de legendas numeradas
    function atualizarLegenda(passoAtivo) {
      legendas.forEach(leg => {
        const step = parseInt(leg.dataset.step, 10);
        if (step === passoAtivo) {
          leg.classList.add('is-active');
        } else {
          leg.classList.remove('is-active');
        }
      });
    }

    // TIMELINE MESTRE GSAP SCROLLTRIGGER (CENAS 2, 3, 4)
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: pinEnd,
        pin: true,
        scrub: scrubVal,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.18) atualizarLegenda(1);
          else if (p < 0.38) atualizarLegenda(2);
          else if (p < 0.58) atualizarLegenda(3);
          else if (p < 0.78) atualizarLegenda(4);
          else if (p < 0.90) atualizarLegenda(5);
          else atualizarLegenda(6);
        }
      }
    });

    // ETAPA 1 (0 -> 20%): A Massa assenta perfeitamente na pala de madeira
    masterTimeline.to(layerDough, {
      y: 110,
      z: -30,
      duration: 1.8,
      ease: "power2.out"
    }, 0);

    // ETAPA 2 (20% -> 40%): O Molho San Marzano desce e se espalha sobre a massa
    masterTimeline.to(layerSauce, {
      y: 110,
      z: -20,
      scale: 1.02,
      duration: 2,
      ease: "power2.inOut"
    }, 1.8);

    // ETAPA 3 (40% -> 60%): O Queijo Fior di Latte desce e derrete sobre o molho
    masterTimeline.to(layerCheese, {
      y: 110,
      z: -10,
      duration: 2,
      ease: "power2.inOut"
    }, 3.8);

    // ETAPA 4 (60% -> 80%): As Fatias de Calabresa e Ervas pousam sobre o queijo
    masterTimeline.to(layerToppings, {
      y: 110,
      z: 0,
      duration: 2,
      ease: "power3.out"
    }, 5.8);

    // ETAPA 5 & 6 (80% -> 100%): ROTAÇÃO DA CÂMERA & REVELAÇÃO DA PIZZA PRONTA DOURADA (CENA 4)
    // O stack 3D gira suavemente para a visão frontal/top-down e funde na fotografia hiper-realista
    masterTimeline.to(stack, {
      rotateX: 0,
      rotateZ: 0,
      rotateY: 0,
      scale: 1.08,
      duration: 2.5,
      ease: "power3.inOut"
    }, 7.5);

    // Fusão impecável na pizza assada no forno a lenha
    masterTimeline.to(layerBaked, {
      opacity: 1,
      scale: 1,
      duration: 1.8,
      ease: "power2.inOut"
    }, 8.2);

    // Oculta suavemente as camadas cruas anteriores durante a fusão
    masterTimeline.to([layerPeel, layerDough, layerSauce, layerCheese, layerToppings], {
      opacity: 0,
      duration: 1.2,
      ease: "power1.out"
    }, 8.5);

    // Ativação do vapor quente e do brilho dourado de forno
    if (steam) {
      masterTimeline.to(steam, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      }, 8.8);
    }

    if (highlightGlow) {
      masterTimeline.to(highlightGlow, {
        opacity: 1,
        duration: 1.5,
        ease: "sine.inOut"
      }, 9.0);
    }

    // Parallax suave dos elementos de primeiro plano
    masterTimeline.to(fgElements, {
      y: "-=80",
      opacity: 0.4,
      duration: 4,
      ease: "none"
    }, 5);

    return () => {
      if (idleTimeline) idleTimeline.kill();
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });

  return mm;
}
