export function renderGaleria(config) {
  const fotos = config.galeria?.fotos || [];

  // Regra estrita: esconder se houver menos de 4 fotos reais
  if (!Array.isArray(fotos) || fotos.length < 4) {
    return '';
  }

  const fotosHtml = fotos.map((foto, idx) => `
    <div class="galeria-item" data-index="${idx}">
      <img src="${foto}" alt="Ambiente Don Corleone ${idx + 1}" loading="lazy" class="galeria-img" />
    </div>
  `).join('');

  return `
  <section id="galeria" class="secao-galeria" aria-labelledby="galeria-titulo">
    <div class="container">
      <div class="text-center">
        <span class="section-tag">Nossa Casa</span>
        <h2 id="galeria-titulo" class="section-title">Galeria Don Corleone</h2>
        <p class="section-subtitle mb-8">
          Momentos e delícias preparadas especialmente para você.
        </p>
      </div>

      <div class="galeria-grid">
        ${fotosHtml}
      </div>

      ${config.contato?.instagramUrl ? `
        <div class="text-center mt-8">
          <a href="${config.contato.instagramUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--outline">
            <span>Acompanhe no Instagram</span>
          </a>
        </div>
      ` : ''}
    </div>
  </section>
  `;
}

export function initGaleria(config) {
  // Parallax suave nas imagens se a galeria estiver visível
}
