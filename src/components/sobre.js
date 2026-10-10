import { esc } from '../utils/dom.js';

export function renderSobre(config) {
  const sobre = config.textos?.sobre || {};
  const paragrafos = sobre.paragrafos || [
    "Na Don Corleone, cada pizza é tratada com o devido respeito que a autêntica gastronomia italiana exige.",
    "Nossa massa descansa por 48 horas em fermentação lenta e natural, resultando em uma borda aerada, crocante por fora e incrivelmente macia por dentro. O molho de tomate San Marzano e os ingredientes rigorosamente selecionados completam o espetáculo a cada mordida."
  ];

  const paragrafosHtml = paragrafos.map(p => `
    <p class="sobre-paragrafo">${esc(p)}</p>
  `).join('');

  return `
  <section id="sobre" class="secao-sobre" aria-labelledby="sobre-titulo">
    <div class="container sobre-container-grid">
      
      <!-- Imagem Editorial Gastronômica -->
      <div class="sobre-visual-col" data-reveal>
        <div class="sobre-img-frame">
          <img src="/images/cardapio/margherita-especial.jpg" alt="Preparação artesanal da pizza Don Corleone" class="sobre-img-main" />
          <div class="sobre-img-badge">
            <span class="badge-number">48h</span>
            <span class="badge-text">Fermentação Lenta</span>
          </div>
        </div>
      </div>

      <!-- Conteúdo Editorial -->
      <div class="sobre-content-col" data-reveal>
        <div class="sobre-ornamento-top">
          <img src="${config.marca?.seloUrl || '/images/brand/selo.svg'}" alt="Don Corleone Selo" class="sobre-selo-img" width="48" height="48" />
          <span class="section-tag">La Tradizione di Famiglia</span>
        </div>

        <h2 id="sobre-titulo" class="section-title">${esc(sobre.titulo || 'O Segredo da Nossa Massa')}</h2>
        <p class="sobre-subtitulo-desc text-italic text-gold mb-6">${esc(sobre.subtitulo || 'Artesanal, leve e com sabor inconfundível.')}</p>

        <div class="sobre-conteudo-box">
          ${paragrafosHtml}
        </div>

        <div class="sobre-badges-grid">
          <div class="sobre-badge-item">
            <span class="sobre-badge-val">450°C</span>
            <span class="sobre-badge-label">Forno Ardente</span>
          </div>
          <div class="sobre-badge-item">
            <span class="sobre-badge-val">100%</span>
            <span class="sobre-badge-label">Farinha Especial</span>
          </div>
          <div class="sobre-badge-item">
            <span class="sobre-badge-val">Arena Cuiabá</span>
            <span class="sobre-badge-label">Entrega & Retirada</span>
          </div>
        </div>
      </div>

    </div>
  </section>
  `;
}

export function initSobre(config) {
  // Animações de entrada tratadas pelo motion.js
}
