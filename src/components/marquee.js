export function renderMarquee(config) {
  const itens = config.textos?.marquee || [
    "Pizzas Artesanais",
    "Esfihas Quentinhas",
    "Entrega & Retirada",
    "Todos os dias, 17h às 23h",
    "Arena Cuiabá",
    "Sabor Incomparável"
  ];

  const itensHtml = itens.map(item => `
    <span class="marquee-item">
      <span class="marquee-text">${item}</span>
      <span class="marquee-bullet" aria-hidden="true">✦</span>
    </span>
  `).join('');

  return `
  <section class="secao-marquee" aria-hidden="true">
    <div class="marquee-track">
      <div class="marquee-content">
        ${itensHtml}
        ${itensHtml}
      </div>
      <div class="marquee-content" aria-hidden="true">
        ${itensHtml}
        ${itensHtml}
      </div>
    </div>
  </section>
  `;
}

export function initMarquee(config) {
  // O marquee roda de forma otimizada via CSS transform
}
