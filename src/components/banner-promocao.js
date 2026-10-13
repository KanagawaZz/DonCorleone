/**
 * Banner de Destaque Promocional - Don Corleone
 * 
 * Exibido no topo da página quando há uma promoção ativa e vigente
 * configurada no arquivo src/data/site.config.js.
 */

import { obterPromocaoAtiva } from '../utils/promocao.js';
import { esc } from '../utils/dom.js';

export function renderBannerPromocao(config) {
  const promo = obterPromocaoAtiva(config.promocao);
  if (!promo.ativa) return '';

  return `
  <aside class="banner-promocao-topo" id="banner-promocao-topo" aria-label="Campanha Promocional Don Corleone">
    <div class="container banner-promocao-container">
      <div class="banner-promocao-content">
        <span class="banner-promo-badge">
          <span class="banner-promo-icon" aria-hidden="true">✦</span>
          <span>${esc(promo.titulo)}</span>
        </span>
        <p class="banner-promo-texto">
          ${esc(promo.texto)}
          ${promo.cupom ? `<strong class="banner-promo-cupom">Cupom: ${esc(promo.cupom)}</strong>` : ''}
          ${promo.descontoPercentual > 0 ? `<span class="banner-promo-desconto">${promo.descontoPercentual}% OFF no checkout</span>` : ''}
        </p>
      </div>
    </div>
  </aside>
  `;
}

export function initBannerPromocao(config) {
  // Inicialização caso seja necessário fechar ou animar
}
