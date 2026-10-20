/**
 * Modal Amigável de Aviso de Horário de Expediente — Don Corleone
 * 
 * Exibido quando o cliente clica para "Montar Pizza" fora do horário de atendimento.
 * Explica com cordialidade italiana as regras de funcionamento, informa o horário oficial
 * e permite que o cliente prossiga para degustar/simular os sabores no montador visual.
 */

import { icone } from '../utils/icons.js';
import { esc } from '../utils/dom.js';

export function exibirModalAvisoHorarioPizza({ itemData = null, status = {}, onSimular = null }) {
  let modal = document.querySelector('#modal-horario-overlay');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-horario-overlay';
    modal.className = 'modal-horario-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-horario-titulo');
    document.body.appendChild(modal);
  }

  const statusTexto = status.statusTexto || 'Fechado no momento · Abrimos hoje às 17h30';
  const horarioAbertura = status.horarioAberturaStr ? status.horarioAberturaStr.replace(':', 'h') : '17h30';

  const html = `
    <div class="modal-horario-card" id="modal-horario-card">
      <button type="button" class="modal-horario-fechar" id="btn-fechar-modal-horario" aria-label="Fechar">✕</button>

      <!-- Badge de Status -->
      <div class="modal-horario-badge">
        <span class="badge-fire-dot">✦</span>
        <span>FORNO EM PREPARAÇÃO</span>
      </div>

      <!-- Ícone Dourado de Forno e Horário -->
      <div class="modal-horario-icon-wrap" aria-hidden="true">
        <svg class="modal-horario-icon" viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>

      <!-- Título Acolhedor -->
      <h3 id="modal-horario-titulo" class="modal-horario-titulo">
        Nosso Forno Acende a Partir das ${horarioAbertura}
      </h3>

      <!-- Mensagem Amigável -->
      <p class="modal-horario-texto">
        Nossas pizzas artesanais são abertas à mão e assadas na hora em alta temperatura. No momento estamos <strong>fora do horário de atendimento</strong>.
      </p>

      <!-- Card com Informações Transparentes de Horário -->
      <div class="modal-horario-info-box">
        <div class="modal-horario-info-row">
          <span class="info-label">Situação atual:</span>
          <span class="info-status-pill">${esc(statusTexto)}</span>
        </div>
        <div class="modal-horario-info-row">
          <span class="info-label">Atendimento:</span>
          <span class="info-val">Seg a Dom a partir das ${horarioAbertura}</span>
        </div>
        <div class="modal-horario-info-row">
          <span class="info-label">Unidade:</span>
          <span class="info-val">Cidade Alta · Cuiabá/MT (Delivery e Retirada)</span>
        </div>
      </div>

      <p class="modal-horario-dica">
        🛒 <strong>Você pode montar e adicionar ao carrinho normalmente</strong> para ver o valor total, mas o envio do pedido só será liberado a partir das ${horarioAbertura}!
      </p>

      <!-- Botões de Ação -->
      <div class="modal-horario-acoes">
        <button type="button" class="btn btn--primary btn-horario-simular" id="btn-horario-simular">
          ${icone('pizza', 18)}
          <span>Simular Pedido &amp; Adicionar ao Carrinho</span>
        </button>

        <button type="button" class="btn btn--outline" id="btn-horario-entendi">
          <span>Entendi, volto mais tarde</span>
        </button>
      </div>
    </div>
  `;

  modal.innerHTML = html;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  const fechar = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  // Botão fechar (X)
  modal.querySelector('#btn-fechar-modal-horario')?.addEventListener('click', fechar);

  // Botão Entendi
  modal.querySelector('#btn-horario-entendi')?.addEventListener('click', fechar);

  // Botão de Simular
  modal.querySelector('#btn-horario-simular')?.addEventListener('click', () => {
    fechar();
    if (typeof onSimular === 'function') {
      onSimular(itemData);
    }
  });

  // Fechar ao clicar no overlay escuro
  modal.onclick = (e) => {
    if (e.target === modal) {
      fechar();
    }
  };

  // Fechar com ESC
  const handleEsc = (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      fechar();
      window.removeEventListener('keydown', handleEsc);
    }
  };
  window.addEventListener('keydown', handleEsc);
}
