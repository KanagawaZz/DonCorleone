import { carrinho } from '../utils/carrinho.js';
import { formatarPreco, esc } from '../utils/dom.js';
import { obterStatusFuncionamento } from '../utils/horario.js';

export function renderBarraPedido(config) {
  const contato = config.contato || {};
  const telHref = contato.telefoneCompleto 
    ? `tel:+${contato.telefoneCompleto}` 
    : `tel:${contato.telefoneDelivery?.replace(/\D/g, '') || ''}`;
  
  const qtdItens = carrinho.obterQuantidadeTotal();
  const subtotal = carrinho.obterSubtotal();
  const status = obterStatusFuncionamento(new Date(), config.horario || {});

  let labelInicial = 'Fazer Meu Pedido';
  if (!status.podeFazerPedido) {
    labelInicial = qtdItens > 0 ? `Ver Pedido (${qtdItens}) · Fechado` : `Fechado · ${status.statusTexto}`;
  } else if (qtdItens > 0) {
    labelInicial = `Ver Pedido (${qtdItens}) · ${formatarPreco(subtotal)}`;
  }

  return `
  <div class="barra-pedido-fixa" id="barra-pedido-fixa" aria-label="Ações rápidas de pedido">
    <div class="barra-pedido-inner">
      <button type="button" class="btn btn--primary barra-btn-whats ${!status.podeFazerPedido ? 'barra-btn--fechado' : ''}" id="barra-btn-whats">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.196 8.196 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
        </svg>
        <span id="barra-btn-label">${labelInicial}</span>
      </button>
      <a href="${telHref}" class="btn btn--outline barra-btn-tel" aria-label="Ligar para a Don Corleone">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <span>Ligar</span>
      </a>
    </div>
  </div>
  `;
}

export function initBarraPedido(config) {
  const barra = document.querySelector('#barra-pedido-fixa');
  const btnHeroOrder = document.querySelector('#btn-hero-order');
  const barraBtnWhats = document.querySelector('#barra-btn-whats');
  const barraBtnLabel = document.querySelector('#barra-btn-label');

  if (!barra) return;

  // Oculta a barra fixa quando o botão do hero estiver visível na tela
  if (btnHeroOrder) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          barra.classList.add('barra--hidden');
        } else {
          barra.classList.remove('barra--hidden');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(btnHeroOrder);
  }

  // Abertura do modal de pedidos
  barraBtnWhats?.addEventListener('click', () => {
    carrinho.abrirModal();
  });

  const atualizarLabelBarra = () => {
    const status = obterStatusFuncionamento(new Date(), config.horario || {});
    const total = carrinho.obterQuantidadeTotal();
    const subtotal = carrinho.obterSubtotal();

    if (!barraBtnLabel) return;

    if (!status.podeFazerPedido) {
      if (total > 0) {
        barraBtnLabel.textContent = `Ver Pedido (${total}) · Fechado`;
      } else {
        barraBtnLabel.textContent = `Fechado · ${status.statusTexto}`;
      }
    } else {
      if (total > 0) {
        barraBtnLabel.textContent = `Ver Pedido (${total}) · ${formatarPreco(subtotal)}`;
      } else {
        barraBtnLabel.textContent = 'Fazer Meu Pedido';
      }
    }
  };

  // Atualização dinâmica do label da barra com itens do carrinho
  window.addEventListener('carrinho-atualizado', atualizarLabelBarra);
  setInterval(atualizarLabelBarra, 60000);
}
