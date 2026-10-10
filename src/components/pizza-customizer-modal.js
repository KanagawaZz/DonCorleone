/**
 * Modal de Personalização de Pizza (Até 3 Sabores) - Don Corleone
 * 
 * Permite ao cliente escolher o tamanho da pizza, selecionar de 1 a 3 sabores,
 * visualizar a prévia dos sabores e do preço em tempo real e adicionar/editar no carrinho.
 */

import { carrinho } from '../utils/carrinho.js';
import { formatarPreco, esc } from '../utils/dom.js';
import { calcularPrecoPizza, formatarTituloPizza } from '../utils/calculo-pizza.js';
import dadosCardapio from '../data/cardapio.json';

export function renderPizzaCustomizerModal(config) {
  return `
  <div class="pizza-modal-overlay" id="pizza-modal-overlay" aria-hidden="true">
    <div class="pizza-modal-container" id="pizza-modal-container" role="dialog" aria-modal="true" aria-labelledby="pizza-modal-titulo">
      
      <!-- Cabeçalho do Personalizador -->
      <header class="pizza-modal-header">
        <div class="pizza-modal-title-wrap">
          <span class="pizza-modal-tag">Personalização Artesanal</span>
          <h2 id="pizza-modal-titulo" class="pizza-modal-title">Monte Sua Pizza</h2>
          <p class="pizza-modal-subtitle">Escolha de 1 a 3 sabores em uma única pizza.</p>
        </div>
        <button type="button" class="pizza-modal-close" id="btn-fechar-pizza-modal" aria-label="Fechar janela de montagem">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <!-- Corpo com Scroll -->
      <div class="pizza-modal-body">
        
        <!-- Status de Sabores Escolhidos -->
        <div class="sabores-status-card">
          <div class="sabores-status-header">
            <span class="sabores-status-label">Sabores selecionados:</span>
            <span class="sabores-counter-badge" id="sabores-counter-badge">1 de 3</span>
          </div>

          <div class="sabores-selecionados-tags" id="sabores-selecionados-tags">
            <!-- Injetado dinamicamente -->
          </div>

          <div class="regra-preco-aviso" id="regra-preco-aviso">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>Preço da pizza calculado pelo sabor de maior valor selecionado.</span>
          </div>
        </div>

        <!-- Seletor de Tamanho (Se configurado) -->
        <div class="tamanho-secao" id="tamanho-secao">
          <label class="secao-label-bold">Tamanho da Pizza:</label>
          <div class="tamanho-radios-grid" id="tamanho-radios-grid">
            <div class="tamanho-chip active">
              <span class="tamanho-chip-nome">Pizza Grande</span>
              <span class="tamanho-chip-desc">8 fatias · até 3 sabores</span>
            </div>
          </div>
        </div>

        <!-- Lista de Sabores Disponíveis para Escolha -->
        <div class="lista-sabores-secao">
          <label class="secao-label-bold mb-3">Escolha os Sabores:</label>
          <div class="sabores-grid-selector" id="sabores-grid-selector">
            <!-- Renderizado dinamicamente a partir do catálogo de pizzas -->
          </div>
        </div>

        <!-- Observações da Pizza -->
        <div class="pizza-obs-secao mt-4">
          <label for="pizza-obs-input" class="secao-label-bold">Observações desta pizza (opcional):</label>
          <input type="text" id="pizza-obs-input" class="form-input" placeholder="Ex: Sem cebola em metade da pizza..." />
        </div>

      </div>

      <!-- Rodapé com Quantidade, Preço e Ação -->
      <footer class="pizza-modal-footer">
        <div class="pizza-footer-info">
          <div class="pizza-qty-wrapper">
            <button type="button" class="btn-qty-p" id="btn-pizza-qty-minus" aria-label="Diminuir quantidade">−</button>
            <span class="pizza-qty-display" id="pizza-qty-display">1</span>
            <button type="button" class="btn-qty-p" id="btn-pizza-qty-plus" aria-label="Aumentar quantidade">+</button>
          </div>
          <div class="pizza-preco-total-box">
            <span class="preco-unit-label">Valor da pizza:</span>
            <span class="pizza-preco-total" id="pizza-preco-total">R$ 0,00</span>
          </div>
        </div>

        <button type="button" class="btn btn--primary btn--add-pizza-cart" id="btn-add-pizza-cart">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <span id="btn-add-pizza-label">Adicionar ao Carrinho</span>
        </button>
      </footer>

    </div>
  </div>
  `;
}

export function initPizzaCustomizerModal(config) {
  const overlay = document.querySelector('#pizza-modal-overlay');
  const btnFechar = document.querySelector('#btn-fechar-pizza-modal');
  const gridSabores = document.querySelector('#sabores-grid-selector');
  const tagsContainer = document.querySelector('#sabores-selecionados-tags');
  const counterBadge = document.querySelector('#sabores-counter-badge');
  const precoTotalDisplay = document.querySelector('#pizza-preco-total');
  const inputObs = document.querySelector('#pizza-obs-input');
  const btnQtyMinus = document.querySelector('#btn-pizza-qty-minus');
  const btnQtyPlus = document.querySelector('#btn-pizza-qty-plus');
  const qtyDisplay = document.querySelector('#pizza-qty-display');
  const btnAddCart = document.querySelector('#btn-add-pizza-cart');
  const btnAddLabel = document.querySelector('#btn-add-pizza-label');

  const maxSabores = config.regrasPizza?.maximoSabores || 3;
  let saboresSelecionados = [];
  let quantidade = 1;
  let itemEditandoId = null;

  // Extrai todos os sabores de pizza cadastrados no catálogo
  const categoriasPizza = (dadosCardapio.categorias || []).filter(c => 
    c.id === 'pizzas-especiais' || c.id === 'pizzas-tradicionais' || c.id.includes('pizza')
  );

  const todosSaboresPizza = [];
  categoriasPizza.forEach(cat => {
    (cat.itens || []).forEach(item => {
      if (!todosSaboresPizza.some(s => s.id === item.id)) {
        todosSaboresPizza.push({
          id: item.id,
          nome: item.nome,
          descricao: item.descricao,
          preco: Number(item.preco) || 0,
          foto: item.foto || '/images/cardapio/calabresa-artesanal.png',
          categoriaNome: cat.nome
        });
      }
    });
  });

  function renderizarListaSabores() {
    if (!gridSabores) return;

    gridSabores.innerHTML = todosSaboresPizza.map(sabor => {
      const estaSelecionado = saboresSelecionados.some(s => s.id === sabor.id);
      const atingiuLimite = saboresSelecionados.length >= maxSabores;
      const desabilitado = !estaSelecionado && atingiuLimite;

      return `
      <div class="sabor-item-card ${estaSelecionado ? 'selecionado' : ''} ${desabilitado ? 'desabilitado' : ''}" data-sabor-id="${sabor.id}">
        <div class="sabor-card-img-wrap">
          <img src="${sabor.foto}" alt="${esc(sabor.nome)}" class="sabor-card-img" loading="lazy" />
          <div class="sabor-check-circle">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>
        <div class="sabor-card-content">
          <div class="sabor-card-header">
            <h4 class="sabor-card-nome">${esc(sabor.nome)}</h4>
            <span class="sabor-card-preco">${formatarPreco(sabor.preco)}</span>
          </div>
          <p class="sabor-card-desc">${esc(sabor.descricao || '')}</p>
        </div>
      </div>
      `;
    }).join('');

    // Adiciona ouvintes de clique nos cards de sabores
    gridSabores.querySelectorAll('.sabor-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const saborId = card.dataset.saborId;
        const saborObj = todosSaboresPizza.find(s => s.id === saborId);
        if (!saborObj) return;

        const index = saboresSelecionados.findIndex(s => s.id === saborId);
        if (index >= 0) {
          // Desmarca
          saboresSelecionados.splice(index, 1);
        } else {
          // Marca se não atingiu o limite
          if (saboresSelecionados.length < maxSabores) {
            saboresSelecionados.push(saborObj);
          }
        }

        atualizarInterface();
      });
    });
  }

  function atualizarInterface() {
    // 1. Contador
    if (counterBadge) {
      counterBadge.textContent = `${saboresSelecionados.length} de ${maxSabores}`;
      if (saboresSelecionados.length === 0) {
        counterBadge.classList.add('alerta-zero');
      } else {
        counterBadge.classList.remove('alerta-zero');
      }
    }

    // 2. Tags dos sabores selecionados
    if (tagsContainer) {
      if (saboresSelecionados.length === 0) {
        tagsContainer.innerHTML = `<span class="tag-vazio-aviso">Selecione de 1 a 3 sabores abaixo</span>`;
      } else {
        tagsContainer.innerHTML = saboresSelecionados.map((s, idx) => `
          <div class="sabor-tag-item">
            <span class="sabor-tag-fracao">1/${saboresSelecionados.length}</span>
            <span class="sabor-tag-nome">${esc(s.nome)}</span>
            <button type="button" class="btn-remove-tag" data-sabor-id="${s.id}" aria-label="Remover sabor ${esc(s.nome)}">×</button>
          </div>
        `).join('');

        tagsContainer.querySelectorAll('.btn-remove-tag').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const sId = btn.dataset.saborId;
            saboresSelecionados = saboresSelecionados.filter(s => s.id !== sId);
            atualizarInterface();
          });
        });
      }
    }

    // 3. Preço e Subtotal
    const precoUnitario = calcularPrecoPizza(saboresSelecionados, null, config);
    const subtotal = precoUnitario * quantidade;

    if (precoTotalDisplay) {
      precoTotalDisplay.textContent = formatarPreco(subtotal);
    }

    if (qtyDisplay) {
      qtyDisplay.textContent = quantidade;
    }

    // 4. Estado do botão principal
    if (btnAddCart) {
      if (saboresSelecionados.length === 0) {
        btnAddCart.disabled = true;
        btnAddCart.classList.add('disabled');
      } else {
        btnAddCart.disabled = false;
        btnAddCart.classList.remove('disabled');
      }
    }

    // 5. Re-renderiza o estado ativo/desabilitado dos cards de sabor
    renderizarListaSabores();
  }

  function abrir(saborInicial = null, itemParaEditar = null) {
    overlay?.classList.add('is-open');
    overlay?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (itemParaEditar) {
      // Modo de Edição
      itemEditandoId = itemParaEditar.id;
      saboresSelecionados = [...(itemParaEditar.sabores || [])];
      quantidade = itemParaEditar.quantidade || 1;
      if (inputObs) inputObs.value = itemParaEditar.observacoes || '';
      if (btnAddLabel) btnAddLabel.textContent = 'Salvar Alterações';
    } else {
      // Nova Pizza
      itemEditandoId = null;
      quantidade = 1;
      if (inputObs) inputObs.value = '';
      if (btnAddLabel) btnAddLabel.textContent = 'Adicionar ao Carrinho';

      if (saborInicial) {
        const saborAchado = todosSaboresPizza.find(s => s.id === saborInicial.id) || saborInicial;
        saboresSelecionados = [saborAchado];
      } else {
        saboresSelecionados = todosSaboresPizza.length > 0 ? [todosSaboresPizza[0]] : [];
      }
    }

    atualizarInterface();
  }

  function fechar() {
    overlay?.classList.remove('is-open');
    overlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    itemEditandoId = null;
  }

  // Controles de Quantidade
  btnQtyMinus?.addEventListener('click', () => {
    if (quantidade > 1) {
      quantidade--;
      atualizarInterface();
    }
  });

  btnQtyPlus?.addEventListener('click', () => {
    quantidade++;
    atualizarInterface();
  });

  // Fechar
  btnFechar?.addEventListener('click', fechar);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) fechar();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('is-open')) {
      fechar();
    }
  });

  // Salvar no Carrinho
  btnAddCart?.addEventListener('click', () => {
    if (saboresSelecionados.length === 0) {
      alert('Por favor, selecione pelo menos 1 sabor para sua pizza.');
      return;
    }

    carrinho.salvarPizza({
      sabores: saboresSelecionados,
      tamanho: { id: 'grande', nome: 'Pizza Grande', fatias: 8 },
      quantidade,
      observacoes: inputObs?.value?.trim() || ''
    }, itemEditandoId);

    fechar();

    // Abre o carrinho para visualização imediata
    carrinho.abrirModalCheckout();
  });

  // Evento global para abrir o modal
  window.addEventListener('abrir-modal-pizza', (e) => {
    const { saborInicial, itemParaEditar } = e.detail || {};
    abrir(saborInicial, itemParaEditar);
  });

  window.addEventListener('fechar-modal-pizza', fechar);
}
