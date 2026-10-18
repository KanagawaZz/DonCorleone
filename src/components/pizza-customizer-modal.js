/**
 * Modal de Personalização de Pizza (Até 3 Sabores) - Don Corleone
 * 
 * Regras Oficiais do Anota.ai:
 * - Pizza Grande (35 cm): até 3 sabores, 8 fatias, preços de R$ 76,90 e R$ 86,90, bordas recheadas disponíveis (máx 1).
 * - Pizza Média (30 cm): até 2 sabores, 6 fatias, preço sob consulta.
 * - Pizza Pequena (25 cm): até 2 sabores, 4 fatias, preço sob consulta.
 * - Bordas recheadas associadas à Pizza Grande de 35 cm (máximo 1 borda).
 */

import { carrinho } from '../utils/carrinho.js';
import { formatarPreco, esc } from '../utils/dom.js';
import { icone } from '../utils/icons.js';
import { calcularPrecoPizza } from '../utils/calculo-pizza.js';
import { pararLenis, retomarLenis } from '../utils/motion.js';
import { obterStatusFuncionamento } from '../utils/horario.js';
import dadosCardapio from '../data/cardapio.json';

export function renderPizzaCustomizerModal(config) {
  const tamanhos = config.regrasPizza?.tamanhos || [
    { id: 'pequena', nome: 'Pizza Pequena', diametro: '25 cm', fatias: 4, maxSabores: 2, preco: null, precoInfo: 'Preço sob consulta' },
    { id: 'media', nome: 'Pizza Média', diametro: '30 cm', fatias: 6, maxSabores: 2, preco: null, precoInfo: 'Preço sob consulta' },
    { id: 'grande', nome: 'Pizza Grande', diametro: '35 cm', fatias: 8, maxSabores: 3, preco: 76.90, precoInfo: 'A partir de R$ 76,90', padrao: true }
  ];

  const bordas = config.regrasPizza?.bordas || [
    { id: "sem-borda", nome: "Sem Borda", preco: 0.00, descricao: "Massa crocante tradicional" },
    { id: "borda-catupiry", nome: "Borda de Catupiry", preco: null, precoTexto: "Sob consulta / Inclusa em combos", descricao: "Requeijão tipo catupiry cremoso" },
    { id: "borda-chocolate", nome: "Borda de Chocolate", preco: 9.90, descricao: "Chocolate nobre cremoso" },
    { id: "borda-goiabada", nome: "Borda de Goiabada", preco: 9.90, descricao: "Goiabada cremosa especial" },
    { id: "borda-mussarela", nome: "Borda de Mussarela", preco: 9.90, descricao: "Queijo mussarela derretido" },
    { id: "borda-requeijao-cremoso", nome: "Borda de Requeijão Cremoso", preco: 9.90, descricao: "Requeijão especial cremoso" },
    { id: "borda-cheddar", nome: "Borda de Cheddar", preco: 9.90, descricao: "Cheddar cremoso marcante" }
  ];

  return `
  <div class="pizza-modal-overlay" id="pizza-modal-overlay" data-lenis-prevent="true" aria-hidden="true">
    <div class="pizza-modal-container" id="pizza-modal-container" data-lenis-prevent="true" role="dialog" aria-modal="true" aria-labelledby="pizza-modal-titulo">
      
      <!-- Cabeçalho do Personalizador -->
      <header class="pizza-modal-header">
        <div class="pizza-modal-title-wrap">
          <span class="pizza-modal-tag">Montagem Artesanal</span>
          <h2 id="pizza-modal-titulo" class="pizza-modal-title">Monte Sua Pizza</h2>
          <p class="pizza-modal-subtitle">Escolha o tamanho e os sabores da sua preferência.</p>
        </div>
        <button type="button" class="pizza-modal-close" id="btn-fechar-pizza-modal" aria-label="Fechar janela de montagem">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <!-- Corpo com Scroll -->
      <div class="pizza-modal-body" id="pizza-modal-body" data-lenis-prevent="true" tabindex="0">
        
        <!-- Alerta de Modo Consulta Fora do Horário de Atendimento -->
        <div class="pizza-modal-banner-fechado" id="pizza-banner-fechado" style="display: none;">
          <span class="banner-fechado-icon">🕒</span>
          <div id="pizza-banner-fechado-texto">
            <strong>Forno a lenha fora do expediente:</strong> Modo aberto para consulta dos sabores.
          </div>
        </div>

        <!-- Palco de Prévia Visual das Fatias -->
        <div class="pizza-visual-preview-stage" id="pizza-visual-preview-stage">
          <div class="pizza-stone-plate">
            <div class="pizza-dough-disc">
              <div class="pizza-slices-container" id="pizza-slices-container">
                <!-- Renderizado dinamicamente com 1, 2 ou 3 sabores -->
              </div>
              <div class="pizza-center-cutter-seal" aria-hidden="true">
                <span class="cutter-seal-icon">✦</span>
              </div>
            </div>
          </div>
          <div class="pizza-preview-caption" id="pizza-preview-caption">
            Carregando montagem artesanal...
          </div>
        </div>

        <!-- SEÇÃO 1: Escolha do Tamanho Oficial -->
        <div class="tamanho-secao mb-4" id="tamanho-secao">
          <label class="secao-label-bold">1. Escolha o Tamanho da Pizza:</label>
          <div class="tamanho-radios-grid" id="tamanho-radios-grid">
            ${tamanhos.map(t => {
              const isGrande = t.id === 'grande';
              return `
              <div class="tamanho-chip ${isGrande ? 'active' : ''}" data-tamanho-id="${t.id}" role="button" tabindex="0">
                <div class="tamanho-chip-header">
                  <span class="tamanho-chip-nome">${esc(t.nome)} (${t.diametro})</span>
                  <span class="tamanho-chip-preco-badge">${t.preco ? formatarPreco(t.preco) : 'Sob consulta'}</span>
                </div>
                <span class="tamanho-chip-desc">${t.fatias} fatias · até ${t.maxSabores} sabores</span>
              </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- SEÇÃO 2: Status e Contador de Sabores -->
        <div class="sabores-status-card">
          <div class="sabores-status-header">
            <span class="sabores-status-label">2. Sabores selecionados:</span>
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
            <span id="regra-preco-texto">Preço da pizza grande calculado pelo sabor de maior valor selecionado.</span>
          </div>
        </div>

        <!-- SEÇÃO 3: Filtro e Catálogo de Sabores (Salgadas & Doces) -->
        <div class="lista-sabores-secao">
          <div class="sabores-filtro-bar mb-3">
            <span class="secao-label-bold">Escolha os Sabores:</span>
            <div class="sabores-tabs-chips" role="tablist">
              <button type="button" class="filtro-chip active" data-categoria-filtro="todas">Todos (25)</button>
              <button type="button" class="filtro-chip" data-categoria-filtro="pizzas-salgadas">Salgadas (20)</button>
              <button type="button" class="filtro-chip" data-categoria-filtro="pizzas-doces">Doces (5)</button>
            </div>
          </div>
          <div class="sabores-grid-selector" id="sabores-grid-selector">
            <!-- Renderizado dinamicamente a partir de cardapio.json -->
          </div>
        </div>

        <!-- SEÇÃO 4: Observações da Pizza -->
        <div class="pizza-obs-secao mt-4">
          <label for="pizza-obs-input" class="secao-label-bold">4. Observações desta pizza (opcional):</label>
          <input type="text" id="pizza-obs-input" class="form-input" placeholder="Ex: Sem cebola em metade da pizza, bem assada..." />
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
            <span class="preco-unit-label" id="preco-unit-label">Valor da pizza:</span>
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
  const slicesContainer = document.querySelector('#pizza-slices-container');
  const previewCaption = document.querySelector('#pizza-preview-caption');
  const regraPrecoTexto = document.querySelector('#regra-preco-texto');
  const tamanhoChips = document.querySelectorAll('.tamanho-chip');
  const filtroChips = document.querySelectorAll('.filtro-chip');

  const listaTamanhos = config.regrasPizza?.tamanhos || [
    { id: 'pequena', nome: 'Pizza Pequena', diametro: '25 cm', fatias: 4, maxSabores: 2, preco: null },
    { id: 'media', nome: 'Pizza Média', diametro: '30 cm', fatias: 6, maxSabores: 2, preco: null },
    { id: 'grande', nome: 'Pizza Grande', diametro: '35 cm', fatias: 8, maxSabores: 3, preco: 76.90 }
  ];

  let tamanhoSelecionado = listaTamanhos.find(t => t.id === 'grande') || listaTamanhos[0];
  let maxSabores = tamanhoSelecionado.maxSabores || 3;
  let saboresSelecionados = [];
  let quantidade = 1;
  let itemEditandoId = null;
  let filtroCategoriaAtivo = 'todas';

  // Extrai todos os 25 sabores de pizza de cardapio.json (salgadas + doces)
  const categoriasPizza = (dadosCardapio.categorias || []).filter(c => 
    c.id === 'pizzas-salgadas' || c.id === 'pizzas-doces'
  );

  const todosSaboresPizza = [];
  categoriasPizza.forEach(cat => {
    (cat.itens || []).forEach(item => {
      if (!todosSaboresPizza.some(s => s.id === item.id)) {
        todosSaboresPizza.push({
          id: item.id,
          nome: item.nome,
          descricao: item.descricao,
          preco: typeof item.preco === 'number' ? item.preco : null,
          foto: item.foto || '/images/cardapio/calabresa-artesanal.webp',
          categoriaId: cat.id,
          categoriaNome: cat.nome
        });
      }
    });
  });

  function renderizarListaSabores() {
    if (!gridSabores) return;

    const saboresFiltrados = todosSaboresPizza.filter(s => {
      if (filtroCategoriaAtivo === 'todas') return true;
      return s.categoriaId === filtroCategoriaAtivo;
    });

    gridSabores.innerHTML = saboresFiltrados.map(sabor => {
      const estaSelecionado = saboresSelecionados.some(s => s.id === sabor.id);
      const atingiuLimite = saboresSelecionados.length >= maxSabores;
      const desabilitado = !estaSelecionado && atingiuLimite;
      const precoTxt = sabor.preco ? formatarPreco(sabor.preco) : 'Sob consulta';

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
            <span class="sabor-card-preco">${precoTxt}</span>
          </div>
          <p class="sabor-card-desc">${esc(sabor.descricao || '')}</p>
        </div>
      </div>
      `;
    }).join('');

    // Ouvintes de clique nos cards de sabores
    gridSabores.querySelectorAll('.sabor-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const saborId = card.dataset.saborId;
        const saborObj = todosSaboresPizza.find(s => s.id === saborId);
        if (!saborObj) return;

        const index = saboresSelecionados.findIndex(s => s.id === saborId);
        if (index >= 0) {
          saboresSelecionados.splice(index, 1);
        } else {
          if (saboresSelecionados.length < maxSabores) {
            saboresSelecionados.push(saborObj);
          }
        }

        atualizarInterface();
      });
    });
  }

  function atualizarInterface() {
    maxSabores = tamanhoSelecionado.maxSabores || (tamanhoSelecionado.id === 'grande' ? 3 : 2);

    // Ajusta sabores selecionados se ultrapassar o limite do tamanho atual
    if (saboresSelecionados.length > maxSabores) {
      saboresSelecionados = saboresSelecionados.slice(0, maxSabores);
    }

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
        tagsContainer.innerHTML = `<span class="tag-vazio-aviso">Selecione até ${maxSabores} sabores abaixo</span>`;
      } else {
        tagsContainer.innerHTML = saboresSelecionados.map((s) => `
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
    const isGrande = tamanhoSelecionado.id === 'grande';
    if (regraPrecoTexto) {
      if (isGrande) {
        regraPrecoTexto.textContent = 'Preço da pizza grande calculado pelo sabor de maior valor selecionado.';
      } else {
        regraPrecoTexto.textContent = `Pizzas de tamanho ${tamanhoSelecionado.nome} têm valor sob consulta com a cantina.`;
      }
    }

    if (precoTotalDisplay) {
      if (isGrande) {
        const precoUnitario = calcularPrecoPizza(saboresSelecionados, tamanhoSelecionado, null, config);
        const subtotal = precoUnitario * quantidade;
        precoTotalDisplay.textContent = formatarPreco(subtotal);
      } else {
        precoTotalDisplay.textContent = 'Sob consulta';
      }
    }

    if (qtyDisplay) {
      qtyDisplay.textContent = quantidade;
    }

    // 5. Botão de Adicionar
    if (btnAddCart) {
      if (saboresSelecionados.length === 0) {
        btnAddCart.disabled = true;
        btnAddCart.classList.add('disabled');
      } else {
        btnAddCart.disabled = false;
        btnAddCart.classList.remove('disabled');
      }
    }

    // 6. Prévia Visual
    if (slicesContainer && previewCaption) {
      if (saboresSelecionados.length === 0) {
        slicesContainer.innerHTML = `
          <div class="slice-placeholder-dough">
            <span class="placeholder-dough-icon">${icone('pizza', 36)}</span>
            <span class="placeholder-dough-text">Selecione até ${maxSabores} sabores abaixo</span>
          </div>
        `;
        previewCaption.textContent = `Monte sua ${tamanhoSelecionado.nome} (${tamanhoSelecionado.diametro})`;
      } else if (saboresSelecionados.length === 1) {
        const s1 = saboresSelecionados[0];
        slicesContainer.innerHTML = `
          <div class="pizza-slice-part slice-full">
            <img src="${s1.foto}" alt="${esc(s1.nome)}" class="slice-full-img" />
            <div class="slice-relief-overlay"></div>
          </div>
        `;
        previewCaption.innerHTML = `<strong>${esc(tamanhoSelecionado.nome)}:</strong> ${esc(s1.nome)}`;
      } else if (saboresSelecionados.length === 2) {
        const s1 = saboresSelecionados[0];
        const s2 = saboresSelecionados[1];
        slicesContainer.innerHTML = `
          <div class="pizza-slice-part slice-half slice-left">
            <img src="${s1.foto}" alt="${esc(s1.nome)}" class="slice-half-img" />
            <div class="slice-relief-overlay"></div>
          </div>
          <div class="pizza-slice-part slice-half slice-right">
            <img src="${s2.foto}" alt="${esc(s2.nome)}" class="slice-half-img" />
            <div class="slice-relief-overlay"></div>
          </div>
          <div class="slice-divide-ridge vertical" aria-hidden="true"></div>
        `;
        previewCaption.innerHTML = `<strong>Meio a Meio:</strong> 1/2 ${esc(s1.nome)} + 1/2 ${esc(s2.nome)}`;
      } else {
        const s1 = saboresSelecionados[0];
        const s2 = saboresSelecionados[1];
        const s3 = saboresSelecionados[2];
        slicesContainer.innerHTML = `
          <div class="pizza-slice-part slice-third slice-third-1">
            <img src="${s1.foto}" alt="${esc(s1.nome)}" class="slice-third-img" />
            <div class="slice-relief-overlay"></div>
          </div>
          <div class="pizza-slice-part slice-third slice-third-2">
            <img src="${s2.foto}" alt="${esc(s2.nome)}" class="slice-third-img" />
            <div class="slice-relief-overlay"></div>
          </div>
          <div class="pizza-slice-part slice-third slice-third-3">
            <img src="${s3.foto}" alt="${esc(s3.nome)}" class="slice-third-img" />
            <div class="slice-relief-overlay"></div>
          </div>
          <div class="slice-divide-tri-ridges" aria-hidden="true"></div>
        `;
        previewCaption.innerHTML = `<strong>Trio Artesanal:</strong> 1/3 ${esc(s1.nome)} + 1/3 ${esc(s2.nome)} + 1/3 ${esc(s3.nome)}`;
      }
    }

    renderizarListaSabores();
  }

  // Ouvintes para Seleção de Tamanho
  tamanhoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const tId = chip.dataset.tamanhoId;
      const tObj = listaTamanhos.find(t => t.id === tId);
      if (!tObj) return;

      tamanhoChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      tamanhoSelecionado = tObj;

      atualizarInterface();
    });
  });

  // Ouvintes para Seleção de Borda (Máx 1)
  bordaRadios.forEach(card => {
    card.addEventListener('click', () => {
      if (tamanhoSelecionado.id !== 'grande') return;
      const bId = card.dataset.bordaId;
      const bObj = listaBordas.find(b => b.id === bId);
      if (!bObj) return;

      bordaRadios.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radioInput = card.querySelector('input[type="radio"]');
      if (radioInput) radioInput.checked = true;

      bordaSelecionada = bObj;
      atualizarInterface();
    });
  });

  // Filtro de Categorias (Todas, Salgadas, Doces)
  filtroChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filtroChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filtroCategoriaAtivo = chip.dataset.categoriaFiltro || 'todas';
      renderizarListaSabores();
    });
  });

  function abrir(saborInicial = null, itemParaEditar = null) {
    pararLenis();
    overlay?.classList.add('is-open');
    overlay?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (itemParaEditar) {
      itemEditandoId = itemParaEditar.id;
      saboresSelecionados = [...(itemParaEditar.sabores || [])];
      quantidade = itemParaEditar.quantidade || 1;
      tamanhoSelecionado = itemParaEditar.tamanho || listaTamanhos.find(t => t.id === 'grande') || listaTamanhos[0];
      bordaSelecionada = itemParaEditar.borda || listaBordas[0];
      if (inputObs) inputObs.value = itemParaEditar.observacoes || '';
      if (btnAddLabel) btnAddLabel.textContent = 'Salvar Alterações';

      // Atualiza chips ativos de tamanho
      tamanhoChips.forEach(c => {
        c.classList.toggle('active', c.dataset.tamanhoId === tamanhoSelecionado.id);
      });
    } else {
      itemEditandoId = null;
      quantidade = 1;
      tamanhoSelecionado = listaTamanhos.find(t => t.id === 'grande') || listaTamanhos[0];
      if (inputObs) inputObs.value = '';
      if (btnAddLabel) btnAddLabel.textContent = 'Adicionar ao Carrinho';

      tamanhoChips.forEach(c => {
        c.classList.toggle('active', c.dataset.tamanhoId === tamanhoSelecionado.id);
      });

      if (saborInicial) {
        const saborAchado = todosSaboresPizza.find(s => s.id === saborInicial.id) || saborInicial;
        saboresSelecionados = [saborAchado];
      } else {
        saboresSelecionados = todosSaboresPizza.length > 0 ? [todosSaboresPizza[0]] : [];
      }
    }

    // Verificação de Horário de Expediente no Modal
    const statusAgora = obterStatusFuncionamento(new Date(), config.horario || {});
    const bannerFechado = document.querySelector('#pizza-banner-fechado');
    const bannerTexto = document.querySelector('#pizza-banner-fechado-texto');
    if (bannerFechado) {
      if (!statusAgora.podeFazerPedido) {
        bannerFechado.style.display = 'flex';
        if (bannerTexto) {
          const horaAbertura = statusAgora.horarioAberturaStr ? statusAgora.horarioAberturaStr.replace(':', 'h') : '17h30';
          bannerTexto.innerHTML = `<strong>Forno fora do expediente (${esc(statusAgora.statusTexto)}):</strong> Você pode montar e adicionar ao carrinho normalmente para conferir os valores. O envio do pedido será liberado às ${horaAbertura}.`;
        }
        if (btnAddLabel) {
          btnAddLabel.textContent = itemEditandoId ? 'Salvar Alterações' : 'Adicionar ao Carrinho';
        }
      } else {
        bannerFechado.style.display = 'none';
      }
    }

    atualizarInterface();
  }

  function fechar() {
    overlay?.classList.remove('is-open');
    overlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    itemEditandoId = null;
    retomarLenis();
  }

  // Permite rolagem nativa com o mouse dentro do corpo do modal de pizza
  const modalPizzaBody = document.querySelector('#pizza-modal-body');
  if (modalPizzaBody) {
    modalPizzaBody.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: true });
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
      tamanho: tamanhoSelecionado,
      borda: null,
      quantidade,
      observacoes: inputObs?.value?.trim() || ''
    }, itemEditandoId);

    fechar();
    carrinho.abrirModalCheckout();
  });

  // Evento global para abrir o modal
  window.addEventListener('abrir-modal-pizza', (e) => {
    const { saborInicial, itemParaEditar } = e.detail || {};
    abrir(saborInicial, itemParaEditar);
  });

  window.addEventListener('fechar-modal-pizza', fechar);
}
