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
  const legendas = document.querySelectorAll('.legenda-item');
  if (!section || !palco) return null;

  const ehDispositivoFraco = detectarDispositivoFraco();

  const mm = gsap.matchMedia();

  mm.add({
    isDesktop: "(min-width: 769px)",
    isMobile: "(max-width: 768px)"
  }, (context) => {
    const { isMobile } = context.conditions;
    const pinEnd = isMobile ? "+=200%" : "+=250%";
    const scrubVal = isMobile ? 0.4 : 0.6;

    // Camadas fotográficas
    const pedestal = palco.querySelector('#camada-pedestal-img');
    const massa = palco.querySelector('#camada-massa-img');
    const molho = palco.querySelector('#camada-molho-img');
    const queijo = palco.querySelector('#camada-queijo-img');
    const pizzaPronta = palco.querySelector('#camada-pizza-pronta-img');

    const calabresas = palco.querySelectorAll('.item-calabresa');
    const cebolas = palco.querySelectorAll('.item-cebola');
    const azeitonas = palco.querySelectorAll('.item-azeitona');
    const oregano = palco.querySelector('#camada-oregano');
    const azeite = palco.querySelector('#camada-azeite');
    const vapor = palco.querySelector('#camada-vapor');
    const glowForno = palco.querySelector('#glow-forno');

    // ESTADO INICIAL (CENA 1 & 2): Ingredientes suspensos no espaço
    gsap.set(pedestal, { scale: 0.95, opacity: 1, y: 0 });
    gsap.set(massa, { scale: 0.85, opacity: 0.9, y: -20, rotation: -10 });
    gsap.set(molho, { scale: 0.6, opacity: 0, y: -60 });
    gsap.set(queijo, { scale: 0.7, opacity: 0, y: -90 });
    gsap.set(pizzaPronta, { scale: 0.95, opacity: 0 });

    // Fatias de calabresa em posições abertas ao redor da pizza
    const posCalabresa = [
      { x: -160, y: -120, r: -45, scale: 0.7 },
      { x: 160, y: -110, r: 40, scale: 0.75 },
      { x: 180, y: 80, r: 70, scale: 0.7 },
      { x: 10, y: 170, r: -20, scale: 0.8 },
      { x: -170, y: 90, r: -60, scale: 0.75 },
      { x: -70, y: -160, r: 15, scale: 0.7 }
    ];

    calabresas.forEach((el, i) => {
      const p = posCalabresa[i] || { x: 0, y: 0, r: 0, scale: 0.7 };
      gsap.set(el, { x: p.x, y: p.y, rotation: p.r, scale: p.scale, opacity: 0.85 });
    });

    // Anéis de cebola
    const posCebola = [
      { x: -110, y: -140, r: 25 },
      { x: 130, y: -60, r: -40 },
      { x: 120, y: 130, r: 50 },
      { x: -130, y: 40, r: -30 }
    ];

    cebolas.forEach((el, i) => {
      const p = posCebola[i] || { x: 0, y: 0, r: 0 };
      gsap.set(el, { x: p.x, y: p.y, rotation: p.r, scale: 0.7, opacity: 0.8 });
    });

    // Azeitonas
    const posAzeitona = [
      { x: -90, y: -80, r: 15 },
      { x: 90, y: -90, r: -25 },
      { x: 90, y: 70, r: 45 },
      { x: -80, y: 80, r: -55 }
    ];

    azeitonas.forEach((el, i) => {
      const p = posAzeitona[i] || { x: 0, y: 0, r: 0 };
      gsap.set(el, { x: p.x, y: p.y, rotation: p.r, scale: 0.65, opacity: 0.85 });
    });

    gsap.set(oregano, { opacity: 0, scale: 0.6 });
    gsap.set(azeite, { opacity: 0, scale: 0.7 });
    if (vapor) gsap.set(vapor, { opacity: 0 });

    // Flutuação Idle suave antes da rolagem
    let idleAnimation = null;
    if (!ehDispositivoFraco) {
      idleAnimation = gsap.timeline({ repeat: -1, yoyo: true });
      idleAnimation.to(massa, { y: "-=8", rotation: "+=3", duration: 3.5, ease: "sine.inOut" }, 0);
      idleAnimation.to(calabresas, { y: "+=10", rotation: "-=4", duration: 3, ease: "sine.inOut", stagger: 0.1 }, 0);
      idleAnimation.to(cebolas, { y: "-=10", rotation: "+=5", duration: 3.2, ease: "sine.inOut", stagger: 0.12 }, 0);
    }

    // Atualização das Legendas Ativas
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
          if (p < 0.15) atualizarLegenda(1);
          else if (p < 0.35) atualizarLegenda(2);
          else if (p < 0.55) atualizarLegenda(3);
          else if (p < 0.75) atualizarLegenda(4);
          else if (p < 0.90) atualizarLegenda(5);
          else atualizarLegenda(6);
        }
      }
    });

    // ETAPA 1 (0 -> 15%): A Massa Assenta no Pedestal
    masterTimeline.to(massa, {
      scale: 1,
      y: 0,
      rotation: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power2.out"
    }, 0);

    // ETAPA 2 (15% -> 35%): O Molho San Marzano se Espalha
    masterTimeline.to(molho, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 2,
      ease: "power2.inOut"
    }, 1.5);

    // ETAPA 3 (35% -> 55%): O Queijo Fior di Latte Derrete
    masterTimeline.to(queijo, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 2,
      ease: "power2.inOut"
    }, 3.5);

    // ETAPA 4 (55% -> 75%): Fatias de Calabresa e Cebola Convergem para a Pizza
    // Posições finais distribuídas naturalmente sobre o queijo
    const posFinaisCalabresa = [
      { x: -50, y: -45, r: 10, scale: 0.95 },
      { x: 55, y: -40, r: -15, scale: 0.95 },
      { x: 60, y: 45, r: 25, scale: 0.95 },
      { x: -5, y: 65, r: -10, scale: 0.95 },
      { x: -65, y: 35, r: 40, scale: 0.95 },
      { x: 0, y: -10, r: -5, scale: 1 }
    ];

    calabresas.forEach((el, i) => {
      const pf = posFinaisCalabresa[i] || { x: 0, y: 0, r: 0, scale: 0.95 };
      masterTimeline.to(el, {
        x: pf.x,
        y: pf.y,
        rotation: pf.r,
        scale: pf.scale,
        opacity: 1,
        duration: 2,
        ease: "power3.out"
      }, 5.5 + (i * 0.1));
    });

    const posFinaisCebola = [
      { x: -35, y: -55, r: -10, scale: 0.9 },
      { x: 45, y: -20, r: 30, scale: 0.9 },
      { x: 30, y: 50, r: -20, scale: 0.9 },
      { x: -45, y: 25, r: 15, scale: 0.9 }
    ];

    cebolas.forEach((el, i) => {
      const pf = posFinaisCebola[i] || { x: 0, y: 0, r: 0, scale: 0.9 };
      masterTimeline.to(el, {
        x: pf.x,
        y: pf.y,
        rotation: pf.r,
        scale: pf.scale,
        opacity: 1,
        duration: 2,
        ease: "power3.out"
      }, 5.8 + (i * 0.1));
    });

    // ETAPA 5 (75% -> 90%): Azeitonas, Orégano e Fio de Azeite
    const posFinaisAzeitona = [
      { x: -25, y: -30, r: 5, scale: 0.85 },
      { x: 35, y: -35, r: -10, scale: 0.85 },
      { x: 35, y: 30, r: 20, scale: 0.85 },
      { x: -30, y: 35, r: -25, scale: 0.85 }
    ];

    azeitonas.forEach((el, i) => {
      const pf = posFinaisAzeitona[i] || { x: 0, y: 0, r: 0, scale: 0.85 };
      masterTimeline.to(el, {
        x: pf.x,
        y: pf.y,
        rotation: pf.r,
        scale: pf.scale,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      }, 7.5 + (i * 0.08));
    });

    masterTimeline.to(oregano, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power2.out"
    }, 8.0);

    masterTimeline.to(azeite, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: "power2.out"
    }, 8.2);

    // ETAPA 6 (90% -> 100%): REVELAÇÃO DA PIZZA PRONTA DOURADA (CENA 4)
    masterTimeline.to(pizzaPronta, {
      opacity: 1,
      scale: 1,
      duration: 1.8,
      ease: "power3.inOut"
    }, 9.0);

    if (vapor) {
      masterTimeline.to(vapor, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      }, 9.5);
    }

    // Leve aproximação cinematográfica no final
    masterTimeline.to(palco, {
      scale: 1.05,
      duration: 1.5,
      ease: "sine.inOut"
    }, 9.8);

    return () => {
      if (idleAnimation) idleAnimation.kill();
      masterTimeline.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });

  return mm;
}
