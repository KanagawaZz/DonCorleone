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
    const pinEnd = isMobile ? "+=220%" : "+=260%";
    const scrubVal = isMobile ? 0.35 : 0.55;

    // Camadas fotográficas e elementos individuais
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
    const shimmer = palco.querySelector('#shimmer-sweep');
    const vapor = palco.querySelector('#camada-vapor');
    const particulas = palco.querySelectorAll('.particula');

    // ESTADO INICIAL: Ingredientes em órbita flutuando suavemente
    gsap.set(pedestal, { scale: 0.95, opacity: 1 });
    gsap.set(massa, { scale: 0.7, rotation: -30, opacity: 0.8, y: -40 });
    gsap.set(molho, { scale: 0.6, opacity: 0 });
    gsap.set(queijo, { scale: 0.8, opacity: 0 });
    gsap.set(pizzaPronta, { scale: 0.96, opacity: 0 });

    // Fatias de calabresa espalhadas em órbita ao redor da pizza
    gsap.set(calabresas, (i) => ({
      x: (i % 2 === 0 ? 170 : -170) + (i * 10),
      y: -110 + (i * 38),
      rotation: -60 + i * 45,
      opacity: 0,
      scale: 0.55
    }));

    // Anéis de cebola espalhados
    gsap.set(cebolas, (i) => ({
      y: -160 + i * 50,
      x: (i % 2 === 0 ? 135 : -135),
      rotation: i * 70,
      opacity: 0,
      scale: 0.6
    }));

    // Azeitonas espalhadas
    gsap.set(azeitonas, (i) => ({
      y: 140 - i * 40,
      x: (i % 2 === 0 ? 140 : -140),
      rotation: i * 50,
      opacity: 0,
      scale: 0.5
    }));

    gsap.set(oregano, { opacity: 0, scale: 0.6 });
    gsap.set(azeite, { opacity: 0 });
    gsap.set(vapor, { opacity: 0 });

    // Loop idle suave de flutuação antes do início da rolagem
    let idleTweens = [];
    if (!ehDispositivoFraco) {
      idleTweens.push(
        gsap.to(massa, { rotation: "+=3", y: "-=6", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" }),
        gsap.to(calabresas, { y: "+=8", rotation: "-=5", duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.15 }),
        gsap.to(cebolas, { y: "-=8", rotation: "+=6", duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.18 }),
        gsap.to(particulas, { y: "-=15", x: "+=6", duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.25 })
      );
    }

    // Timeline Mestre GSAP: ScrollTrigger
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: pinEnd,
        pin: true,
        scrub: scrubVal,
        anticipatePin: 1,
        onUpdate: (self) => {
          if (self.progress > 0.02 && idleTweens.length) {
            idleTweens.forEach(t => t.pause());
          } else if (self.progress <= 0.02 && idleTweens.length) {
            idleTweens.forEach(t => t.play());
          }

          const prog = self.progress;
          legendas.forEach((legenda, idx) => {
            const rangeMin = idx * 0.16;
            const rangeMax = (idx + 1) * 0.16;
            if (prog >= rangeMin && prog < rangeMax) {
              legenda.classList.add('is-active');
            } else {
              legenda.classList.remove('is-active');
            }
          });
        }
      }
    });

    // 1. MASSA: A massa desce girando e se assenta no pedestal
    masterTimeline.to(massa, {
      scale: 1,
      rotation: 0,
      y: 0,
      opacity: 1,
      duration: 1.4,
      ease: "power2.out"
    }, 0);

    // 2. MOLHO: O molho de tomate artesanal se expande do centro para as bordas
    masterTimeline.to(molho, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power2.inOut"
    }, 1.0);

    // 3. QUEIJO: A camada generosa de queijo mussarela derrete e assenta
    masterTimeline.to(queijo, {
      scale: 1,
      opacity: 1,
      duration: 1.3,
      ease: "power2.inOut"
    }, 1.8);

    // 4. CALABRESA: Fatias de calabresa voam em arcos parabólicos e pousam na pizza
    masterTimeline.to(calabresas, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      stagger: 0.06,
      duration: 1.2,
      ease: "back.out(1.35)"
    }, 2.8);

    // 5. CEBOLA: Anéis finos de cebola caem suavemente sobre as calabresas
    masterTimeline.to(cebolas, {
      x: 0,
      y: 0,
      rotation: (i) => (i === 0 ? 15 : i === 1 ? -35 : i === 2 ? 60 : i === 3 ? -20 : 80),
      scale: 1,
      opacity: 0.95,
      stagger: 0.07,
      duration: 1.1,
      ease: "power2.out"
    }, 3.5);

    // 6. AZEITONA: Azeitonas pretas pousam em pontos estratégicos
    masterTimeline.to(azeitonas, {
      x: 0,
      y: 0,
      rotation: (i) => (i === 0 ? -20 : i === 1 ? 35 : i === 2 ? 10 : -50),
      scale: 1,
      opacity: 1,
      stagger: 0.06,
      duration: 1.0,
      ease: "back.out(1.4)"
    }, 4.2);

    // 7. ORÉGANO & AZEITE: Toque final polvilhado com gotas reluzentes
    masterTimeline.to(oregano, {
      scale: 1,
      opacity: 0.95,
      duration: 0.8,
      ease: "power1.out"
    }, 4.8)
    .to(azeite, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, 5.0);

    // 8. FINALIZAÇÃO: Crossfade perfeito para pizza-pronta com brilho e vapor
    masterTimeline.to(pizzaPronta, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power2.inOut"
    }, 5.4);

    if (!ehDispositivoFraco) {
      masterTimeline.to(vapor, {
        opacity: 0.85,
        duration: 0.8,
        ease: "power1.inOut"
      }, 5.8)
      .fromTo(shimmer, {
        x: -250,
        opacity: 0
      }, {
        x: 380,
        opacity: 0.65,
        duration: 1.2,
        ease: "power2.inOut"
      }, 5.8);
    }

    // TRANSIÇÃO PARA O CARDÁPIO
    masterTimeline.to(palco, {
      scale: 0.9,
      rotation: 12,
      y: -30,
      opacity: 0.9,
      duration: 1.0,
      ease: "power2.inOut"
    }, 6.6);

    return () => {
      masterTimeline.kill();
      idleTweens.forEach(t => t.kill());
    };
  });

  return mm;
}
