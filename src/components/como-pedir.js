import { esc } from '../utils/dom.js';

export function renderComoPedir(config) {
  const dados = config.textos?.comoPedir || {};
  const passos = dados.passos || [];

  const passosHtml = passos.map((passo, idx) => `
    <div class="passo-card" data-step="${idx + 1}">
      <div class="passo-numero-wrap">
        <span class="passo-numero">${esc(passo.numero)}</span>
      </div>
      <div class="passo-conteudo">
        <h3 class="passo-titulo">${esc(passo.titulo)}</h3>
        <p class="passo-desc">${esc(passo.descricao)}</p>
      </div>
    </div>
  `).join('');

  return `
  <section id="como-pedir" class="secao-como-pedir" aria-labelledby="como-pedir-titulo">
    <div class="container">
      <div class="text-center">
        <span class="section-tag">Sem complicações</span>
        <h2 id="como-pedir-titulo" class="section-title">${esc(dados.titulo || 'Como Fazer Seu Pedido')}</h2>
        <p class="section-subtitle mb-8">
          ${esc(dados.subtitulo || 'Três passos simples para saborear o melhor de Cuiabá.')}
        </p>
      </div>

      <div class="passos-grid">
        ${passosHtml}
      </div>
    </div>
  </section>
  `;
}

export function initComoPedir(config) {
  // Passos animados e interativos
}
