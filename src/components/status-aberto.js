import { obterStatusFuncionamento } from '../utils/horario.js';

export function renderStatusAberto(config) {
  const status = obterStatusFuncionamento(new Date(), config.horario || {});

  return `
  <div class="status-funcionamento-badge ${status.classeStatus}" id="status-badge" title="Horário de Cuiabá/MT">
    <span class="status-indicador-ponto ${status.estaAberto ? 'anim-status-pulse' : ''}"></span>
    <span class="status-texto-label">${status.statusTexto}</span>
  </div>
  `;
}

export function initStatusAberto(config) {
  const badgeEl = document.querySelector('#status-badge');
  if (!badgeEl) return;

  // Atualiza a cada 60 segundos automaticamente
  setInterval(() => {
    const status = obterStatusFuncionamento(new Date(), config.horario || {});
    badgeEl.className = `status-funcionamento-badge ${status.classeStatus}`;
    const ponto = badgeEl.querySelector('.status-indicador-ponto');
    const texto = badgeEl.querySelector('.status-texto-label');
    if (ponto) {
      ponto.className = `status-indicador-ponto ${status.estaAberto ? 'anim-status-pulse' : ''}`;
    }
    if (texto) {
      texto.textContent = status.statusTexto;
    }
  }, 60000);
}
