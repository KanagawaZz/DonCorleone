import { gerarSvgPizzaMontagem } from './ingredientes-svg.js';
import { inicializarTimelineMontagem } from './timeline.js';
import { renderStatusAberto } from '../status-aberto.js';
import { gerarLinkWhatsApp } from '../../utils/whatsapp.js';
import { rolarPara } from '../../utils/motion.js';

export function renderMontagem(config) {
  const hero = config.textos?.hero || {};
  const statusHtml = renderStatusAberto(config);
  const linkWhatsApp = gerarLinkWhatsApp(config, { modalidade: config.modalidades?.padrao || 'entrega' });
  const svgPizza = gerarSvgPizzaMontagem();

  return `
  <section id="montagem" class="secao-montagem" aria-label="Apresentação e montagem da pizza">
    <div class="container montagem-container">
      
      <!-- Coluna de Conteúdo Hero -->
      <div class="montagem-info">
        <div class="montagem-header-top">
          <span class="hero-badge">${hero.badge || 'Cantina &amp; Pizzaria'}</span>
          ${statusHtml}
        </div>

        <h1 class="hero-titulo">
          <span class="hero-titulo-linha">${hero.tituloLinha1 || 'A verdadeira tradição'}</span>
          <span class="hero-titulo-linha text-italic text-gold">${hero.tituloLinha2 || 'na sua mesa.'}</span>
        </h1>

        <p class="hero-subtitulo">
          ${hero.subtitulo || 'Pizzas e esfihas artesanais preparadas com paixão. Peça para entrega ou retire na unidade Arena Cuiabá.'}
        </p>

        <!-- Seletor de Modalidade -->
        <div class="hero-modalidade-wrapper">
          <span class="hero-modalidade-label">Como deseja pedir?</span>
          <div class="modalidade-toggle" role="group" aria-label="Selecione a modalidade de pedido">
            <button type="button" class="modalidade-btn active" data-modalidade="entrega" aria-pressed="true">
              <svg class="modalidade-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>
              Entrega
            </button>
            <button type="button" class="modalidade-btn" data-modalidade="retirada" aria-pressed="false">
              <svg class="modalidade-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Retirada
            </button>
          </div>
        </div>

        <!-- Botões de Ação Imediata -->
        <div class="hero-actions">
          <a href="${linkWhatsApp}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--hero-order" id="btn-hero-order">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.196 8.196 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
            </svg>
            <span>${hero.ctaPedido || 'Pedir no WhatsApp'}</span>
          </a>
          <a href="#cardapio" class="btn btn--outline" id="btn-hero-menu">
            <span>${hero.ctaCardapio || 'Ver cardápio'}</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </a>
        </div>

        <!-- Indicador de Rolagem / Legendas de Montagem -->
        <div class="montagem-progresso-box">
          <div class="scroll-cue">
            <span class="scroll-cue-dot"></span>
            <span class="scroll-cue-text">${hero.indicadorScroll || 'Role para montar a pizza'}</span>
          </div>

          <div class="legendas-lista" aria-live="polite">
            <div class="legenda-item is-active" data-step="1">
              <span class="legenda-num">1</span>
              <span class="legenda-texto">La base · a massa</span>
            </div>
            <div class="legenda-item" data-step="2">
              <span class="legenda-num">2</span>
              <span class="legenda-texto">Il sugo · o molho</span>
            </div>
            <div class="legenda-item" data-step="3">
              <span class="legenda-num">3</span>
              <span class="legenda-texto">Il formaggio · o queijo</span>
            </div>
            <div class="legenda-item" data-step="4">
              <span class="legenda-num">4</span>
              <span class="legenda-texto">Gli ingredienti · as coberturas</span>
            </div>
            <div class="legenda-item" data-step="5">
              <span class="legenda-num">5</span>
              <span class="legenda-texto">Il tocco finale · o toque final</span>
            </div>
            <div class="legenda-item" data-step="6">
              <span class="legenda-num">6</span>
              <span class="legenda-texto">Pronta · Buon appetito</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Palco da Pizza Animada -->
      <div class="montagem-visual">
        <div class="montagem-stage">
          ${svgPizza}
        </div>
      </div>

    </div>
  </section>
  `;
}

export function initMontagem(config) {
  // Inicializa a timeline master GSAP
  inicializarTimelineMontagem();

  // Tratamento do seletor Entrega / Retirada
  const botoesModalidade = document.querySelectorAll('.hero-modalidade-wrapper .modalidade-btn');
  const btnHeroOrder = document.querySelector('#btn-hero-order');

  let modalidadeAtual = config.modalidades?.padrao || 'entrega';

  botoesModalidade.forEach(btn => {
    btn.addEventListener('click', () => {
      botoesModalidade.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      modalidadeAtual = btn.dataset.modalidade;

      // Dispara evento para sincronizar com barra inferior e atualizar links
      window.dispatchEvent(new CustomEvent('modalidade-alterada', { detail: { modalidade: modalidadeAtual } }));

      if (btnHeroOrder) {
        btnHeroOrder.href = gerarLinkWhatsApp(config, { modalidade: modalidadeAtual });
      }
    });
  });

  // Botão "Ver cardápio" pula suavemente a animação para a seção #cardapio
  const btnMenu = document.querySelector('#btn-hero-menu');
  if (btnMenu) {
    btnMenu.addEventListener('click', (e) => {
      e.preventDefault();
      rolarPara('#cardapio', { offset: -20 });
    });
  }
}
