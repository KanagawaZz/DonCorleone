import { esc } from '../utils/dom.js';

export function renderDepoimentos(config, listaDepoimentos) {
  // Regra estrita: se a lista estiver vazia, o componente é ocultado
  if (!Array.isArray(listaDepoimentos) || listaDepoimentos.length === 0) {
    return '';
  }

  const cardsHtml = listaDepoimentos.map(dep => `
    <div class="depoimento-card">
      <div class="depoimento-estrelas" aria-label="Avaliação: ${dep.avaliacao || 5} estrelas">
        ${'★'.repeat(dep.avaliacao || 5)}
      </div>
      <p class="depoimento-texto">"${esc(dep.texto)}"}</p>
      <div class="depoimento-autor">
        <span class="depoimento-nome">${esc(dep.nome)}</span>
        ${dep.cidade ? `<span class="depoimento-cidade">${esc(dep.cidade)}</span>` : ''}
      </div>
    </div>
  `).join('');

  return `
  <section id="depoimentos" class="secao-depoimentos" aria-labelledby="depoimentos-titulo">
    <div class="container">
      <div class="text-center">
        <span class="section-tag">Depoimentos</span>
        <h2 id="depoimentos-titulo" class="section-title">Quem Pede, Volta</h2>
        <p class="section-subtitle mb-8">O que nossos clientes dizem sobre a Don Corleone.</p>
      </div>

      <div class="depoimentos-grid">
        ${cardsHtml}
      </div>
    </div>
  </section>
  `;
}

export function initDepoimentos(config) {
  // Inicialização interativa de depoimentos se presentes
}
