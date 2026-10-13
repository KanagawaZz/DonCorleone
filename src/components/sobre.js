import { esc } from '../utils/dom.js';

export function renderSobre(config) {
  const sobre = config.textos?.sobre || {};
  const paragrafos = sobre.paragrafos || [
    "A Don Corleone reúne pizzas e esfihas em uma experiência pensada para deixar sua noite mais gostosa.",
    "Na nossa unidade na Cidade Alta, você escolhe seus sabores e conta com a praticidade do delivery ou da retirada no balcão."
  ];

  const destaques = sobre.destaques || [
    { rotulo: "Variedade", valor: "Pizzas & Esfihas" },
    { rotulo: "Praticidade", valor: "Delivery & Retirada" },
    { rotulo: "Atendimento", valor: "A partir de 17h30" },
    { rotulo: "Localização", valor: "Cidade Alta" }
  ];

  const paragrafosHtml = paragrafos.map(p => `
    <p class="sobre-paragrafo">${esc(p)}</p>
  `).join('');

  const destaquesHtml = destaques.map(d => `
    <div class="sobre-badge-item">
      <span class="sobre-badge-val">${esc(d.valor)}</span>
      <span class="sobre-badge-label">${esc(d.rotulo)}</span>
    </div>
  `).join('');

  return `
  <section id="sobre" class="secao-sobre" aria-labelledby="sobre-titulo">
    <div class="container sobre-container-grid">
      
      <!-- Imagem Editorial Gastronômica -->
      <div class="sobre-visual-col" data-reveal>
        <div class="sobre-img-frame">
          <img src="/images/cardapio/margherita-especial.jpg" alt="Preparação artesanal da pizza Don Corleone" class="sobre-img-main" />
          <div class="sobre-img-badge">
            <span class="badge-number">Cidade Alta</span>
            <span class="badge-text">Cuiabá — MT</span>
          </div>
        </div>
      </div>

      <!-- Conteúdo Editorial -->
      <div class="sobre-content-col" data-reveal>
        <div class="sobre-ornamento-top">
          <img src="${config.marca?.seloUrl || '/images/brand/selo.svg'}" alt="Don Corleone Selo" class="sobre-selo-img" width="48" height="48" />
          <span class="section-tag">Cantina &amp; Pizzaria</span>
        </div>

        <h2 id="sobre-titulo" class="section-title">${esc(sobre.titulo || 'Mais sabor para os seus momentos.')}</h2>
        <p class="sobre-subtitulo-desc text-italic text-gold mb-6">${esc(sobre.subtitulo || 'Pizzas e esfihas na Cidade Alta, Cuiabá')}</p>

        <div class="sobre-conteudo-box">
          ${paragrafosHtml}
        </div>

        <div class="sobre-badges-grid">
          ${destaquesHtml}
        </div>
      </div>

    </div>
  </section>
  `;
}

export function initSobre(config) {
  // Inicialização de animações
}
