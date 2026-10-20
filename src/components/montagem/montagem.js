import { renderStatusAberto } from '../status-aberto.js';
import { rolarPara, gsap } from '../../utils/motion.js';
import { carrinho } from '../../utils/carrinho.js';
import { icone } from '../../utils/icons.js';

export function renderMontagem(config) {
  const hero = config.textos?.hero || {};
  const statusHtml = renderStatusAberto(config);

  return `
  <section id="montagem" class="secao-montagem" aria-label="Apresentação da pizza Don Corleone">
    <div class="container montagem-container">
      
      <!-- Coluna de Conteúdo Hero -->
      <div class="montagem-info">
        <div class="montagem-header-top">
          <span class="hero-badge">${hero.badge || 'Pizzaria &amp; Esfiharia · CIDADE ALTA, CUIABÁ'}</span>
          ${statusHtml}
        </div>

        <h1 class="hero-titulo">
          <span class="hero-titulo-linha">${hero.tituloLinha1 || 'Uma noite especial começa'}</span>
          <span class="hero-titulo-linha text-italic text-gold">${hero.tituloLinha2 || 'com uma boa pizza.'}</span>
        </h1>

        <p class="hero-subtitulo">
          ${hero.subtitulo || 'Pizzas artesanais e esfihas feitas para transformar sua fome em um momento especial. Escolha seus sabores e peça para entrega ou retirada na unidade Cidade Alta.'}
        </p>

        <!-- Botões de Ação Imediata -->
        <div class="hero-actions">
          <button type="button" class="btn btn--primary btn--hero-order" id="btn-hero-order">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.196 8.196 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
            </svg>
            <span>${hero.ctaPedido || 'Fazer meu pedido'}</span>
          </button>
          <a href="#cardapio" class="btn btn--outline" id="btn-hero-menu">
            <span>${hero.ctaCardapio || 'Explorar cardápio'}</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <!-- Destaques Verificados com Ícones Vetoriais Gastronômicos -->
        <div class="hero-features-list">
          <div class="feature-tag">
            <svg class="feature-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M2 22l10-10M12 12c1-2 3-3 6-3-1 3-2 5-6 6zm0 0c2 1 3 3 3 6-3-1-5-2-6-6z"/>
            </svg>
            <span>Pizzas &amp; Esfihas</span>
          </div>
          <div class="feature-tag">
            <svg class="feature-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Abre às 17h30 · Todos os dias</span>
          </div>
          <div class="feature-tag">
            <svg class="feature-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M8 22h8M12 15v7M5 3h14l-2 8a5 5 0 0 1-10 0L5 3z"/>
            </svg>
            <span>Cidade Alta · Cuiabá</span>
          </div>
        </div>
      </div>

      <!-- Palco da Fotografia Gastronômica com Efeito Flutuante, Calor de Brasas e Luz Especular -->
      <div class="montagem-visual">
        <div class="hero-pizza-showcase" id="hero-pizza-showcase">
          
          <!-- Efeito de Iluminação e Brilho de Fundo das Brasas do Forno -->
          <div class="pizza-backlight-glow" aria-hidden="true"></div>
          
          <!-- Moldura da Fotografia com Tilt Parallax e Camadas Hiper-realistas -->
          <div class="pizza-hero-card" id="pizza-hero-card">
            <img src="/images/cardapio/calabresa-artesanal.webp" alt="Pizza de Calabresa Artesanal Don Corleone" class="pizza-hero-image" />
            
            <!-- Luz Especular Dinâmica que reflete a brasa e reage ao mouse -->
            <div class="pizza-specular-light" id="pizza-specular-light" aria-hidden="true"></div>

            <!-- Vapor / Fumaça Quente Subindo -->
            <div class="pizza-steam-effect" aria-hidden="true">
              <span class="steam-vap s1"></span>
              <span class="steam-vap s2"></span>
              <span class="steam-vap s3"></span>
            </div>

            <!-- Selo Circular Decorativo Vintage -->
            <div class="vintage-circular-seal" aria-hidden="true">
              <div class="seal-inner-ring">
                <span class="seal-icon-fire">${icone('fogo', 16)}</span>
                <span class="seal-text-top">TRADIÇÃO ITALIANA</span>
                <span class="seal-text-center">DON CORLEONE</span>
                <span class="seal-text-bottom">CIDADE ALTA · CUIABÁ</span>
              </div>
            </div>

            <!-- Selo Gastronômico Flutuante em Latão/Ouro -->
            <div class="pizza-seal-float">
              <div class="seal-badge-stars">★ ★ ★ ★ ★</div>
              <span class="seal-title">Calabresa Don Corleone</span>
              <span class="seal-sub">Receita Secreta de Família · Cidade Alta</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
  `;
}

export function initMontagem(config) {
  const showcase = document.querySelector('#hero-pizza-showcase');
  const card = document.querySelector('#pizza-hero-card');

  const specularLight = document.querySelector('#pizza-specular-light');

  // 1. Animação de Flutuação Suave Contínua
  if (card) {
    gsap.to(card, {
      y: -14,
      rotation: 0.8,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  // 2. Efeito de Tilt 3D Parallax Interativo & Luz Especular Dinâmica
  if (showcase && card) {
    showcase.addEventListener('mousemove', (e) => {
      const rect = showcase.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / rect.width;
      const yNorm = (e.clientY - rect.top) / rect.height;
      const x = xNorm - 0.5;
      const y = yNorm - 0.5;

      gsap.to(card, {
        rotateY: x * 14,
        rotateX: -y * 14,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000
      });

      // Atualiza o ponto de luz especular de brasa sobre a pizza
      if (specularLight) {
        const posX = Math.round(xNorm * 100);
        const posY = Math.round(yNorm * 100);
        specularLight.style.background = `radial-gradient(circle at ${posX}% ${posY}%, rgba(255, 205, 120, 0.42) 0%, rgba(226, 109, 43, 0.2) 30%, transparent 65%)`;
        specularLight.style.opacity = '1';
      }
    });

    showcase.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: "power2.out"
      });

      if (specularLight) {
        specularLight.style.opacity = '0.5';
        specularLight.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 205, 120, 0.25) 0%, rgba(226, 109, 43, 0.1) 40%, transparent 70%)`;
      }
    });
  }

  // 3. Botão "Fazer meu pedido"
  const btnHeroOrder = document.querySelector('#btn-hero-order');
  if (btnHeroOrder) {
    btnHeroOrder.addEventListener('click', (e) => {
      e.preventDefault();
      carrinho.abrirModal();
    });
  }

  // 4. Botão "Explorar cardápio"
  const btnMenu = document.querySelector('#btn-hero-menu');
  if (btnMenu) {
    btnMenu.addEventListener('click', (e) => {
      e.preventDefault();
      rolarPara('#cardapio', { offset: -20 });
    });
  }
}
