import { esc } from '../utils/dom.js';

export function renderSobre(config) {
  const sobre = config.textos?.sobre || {};
  const paragrafos = sobre.paragrafos || [];

  const paragrafosHtml = paragrafos.map(p => `
    <p class="sobre-paragrafo">${esc(p)}</p>
  `).join('');

  return `
  <section id="sobre" class="secao-sobre" aria-labelledby="sobre-titulo">
    <div class="container container--narrow text-center">
      <div class="sobre-ornamento-top">
        <img src="${config.marca?.seloUrl || '/images/brand/selo.svg'}" alt="Don Corleone Selo" class="sobre-selo-img" width="56" height="56" />
      </div>

      <span class="section-tag">La Tradizione</span>
      <h2 id="sobre-titulo" class="section-title">${esc(sobre.titulo || 'Don Corleone')}</h2>
      <p class="sobre-subtitulo-desc text-italic text-gold mb-6">${esc(sobre.subtitulo || 'Pizzas e Esfihas')}</p>

      <div class="sobre-conteudo-box">
        ${paragrafosHtml}
      </div>

      <div class="sobre-badges-grid">
        <div class="sobre-badge-item">
          <span class="sobre-badge-val">17h às 23h</span>
          <span class="sobre-badge-label">Todos os dias</span>
        </div>
        <div class="sobre-badge-item">
          <span class="sobre-badge-val">Arena Cuiabá</span>
          <span class="sobre-badge-label">Localização</span>
        </div>
        <div class="sobre-badge-item">
          <span class="sobre-badge-val">Entrega &amp; Retirada</span>
          <span class="sobre-badge-label">Modalidades</span>
        </div>
      </div>
    </div>
  </section>
  `;
}

export function initSobre(config) {
  // Animação sutil de reveal dos textos
}
