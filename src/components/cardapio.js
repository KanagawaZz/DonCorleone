import { formatarPreco, esc } from '../utils/dom.js';
import { carrinho } from '../utils/carrinho.js';
import { gsap, ScrollTrigger } from '../utils/motion.js';
import { icone } from '../utils/icons.js';

export function renderCardapio(config, dadosCardapio) {
  const cardapioTextos = config.textos?.cardapio || {};
  const categorias = dadosCardapio?.categorias || [];
  const pedidoMinimo = config.pagamento?.pedidoMinimo || 22.00;

  // Extrair itens em destaque (combos e mais pedidos)
  const itensDestaque = [];
  categorias.forEach(cat => {
    (cat.itens || []).forEach(item => {
      if (item.destaque) {
        itensDestaque.push({ ...item, categoriaId: cat.id, categoriaNome: cat.nome });
      }
    });
  });

  // Ícones por categoria para navegação rápida e visual
  const iconesCategorias = {
    'pizzas-salgadas': 'pizza',
    'pizzas-doces': 'doce',
    'combos-pizzas': 'presente',
    'esfihas-unitarias': 'esfiha',
    'kits-esfihas': 'caixa',
    'bebidas': 'bebida',
    'bordas-adicionais': 'borda'
  };

  // 1. CARDS DE DESTAQUES (PRIMEIRO NO CARDÁPIO - INSPIRADO NO LAYOUT MOBILE APP)
  const destaquesHtml = itensDestaque.slice(0, 6).map(item => {
    const isPizza = item.categoriaId === 'pizzas-salgadas' || item.categoriaId === 'pizzas-doces';
    const precoTxt = (typeof item.preco === 'number' && item.preco > 0) 
      ? formatarPreco(item.preco) 
      : (item.precoTexto || 'Sob consulta');
    const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');

    return `
    <div class="destaque-card-mini" data-reveal>
      <div class="destaque-card-img-wrap">
        <img src="${item.foto || '/images/cardapio/calabresa-artesanal.jpg'}" alt="${esc(item.nome)}" loading="lazy" class="destaque-card-img" />
        <span class="destaque-pill-tag">${esc(item.tag || 'Destaque')}</span>
      </div>
      <div class="destaque-card-info">
        <h4 class="destaque-card-title">${esc(item.nome)}</h4>
        <p class="destaque-card-desc">${esc(item.descricao || '')}</p>
        <div class="destaque-card-bottom">
          <span class="destaque-card-price ${!item.preco ? 'preco-consulta-mini' : ''}">${precoTxt}</span>
          ${isPizza ? `
            <button type="button" class="btn-mini-action btn--customizar-pizza" data-item-data="${itemJson}" title="Montar Pizza">
              <span>Montar</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          ` : `
            <button type="button" class="btn-mini-action btn--pedir-simples" data-item-data="${itemJson}" title="Adicionar">
              <span>Pedir</span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          `}
        </div>
      </div>
    </div>
    `;
  }).join('');

  // 2. ABAS DE CATEGORIAS (NAVEGAÇÃO RÁPIDA E INTUITIVA)
  const abasHtml = categorias.map((cat, idx) => {
    const iconeSvg = icone(iconesCategorias[cat.id] || 'estrela', 16);
    const totalItens = (cat.itens || []).length;
    return `
    <button type="button" role="tab" class="tab-btn ${idx === 0 ? 'active' : ''}" id="tab-${idx}" aria-selected="${idx === 0}" aria-controls="panel-${idx}">
      <span class="tab-btn-icon">${iconeSvg}</span>
      <span class="tab-btn-label">${esc(cat.nome)}</span>
      <span class="tab-btn-count">${totalItens}</span>
    </button>
    `;
  }).join('');

  // 3. PAINÉIS DE CATEGORIAS
  const paineisHtml = categorias.map((cat, idx) => {
    const isPizzaCategory = cat.id === 'pizzas-salgadas' || cat.id === 'pizzas-doces';
    const isBordasCategory = cat.id === 'bordas-adicionais';

    const itensGrid = (cat.itens || []).map(item => {
      let precoExibido = '';
      if (typeof item.preco === 'number' && item.preco > 0) {
        precoExibido = formatarPreco(item.preco);
      } else if (item.preco === 0) {
        precoExibido = 'Sem adicional';
      } else {
        precoExibido = item.precoTexto || 'Sob consulta';
      }

      const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');

      return `
      <article class="cardapio-item-card" data-reveal>
        <div class="cardapio-card-frame" aria-hidden="true"></div>

        <div class="cardapio-item-img-wrap">
          <img src="${item.foto || '/images/cardapio/calabresa-artesanal.jpg'}" alt="${esc(item.nome)}" loading="lazy" class="cardapio-item-img" />
          
          ${item.tag ? `
            <span class="cardapio-item-tag">
              <span class="tag-fire-icon">✦</span>
              <span>${esc(item.tag)}</span>
            </span>
          ` : `
            <span class="cardapio-item-tag-subtle">
              <span>Don Corleone</span>
            </span>
          `}
          
          <div class="cardapio-img-overlay"></div>
          <div class="cardapio-ember-glow" aria-hidden="true"></div>
        </div>
        
        <div class="cardapio-item-info">
          <div class="cardapio-item-header">
            <h3 class="cardapio-item-nome">${esc(item.nome)}</h3>
            <span class="cardapio-item-preco ${!item.preco ? 'preco-consulta' : ''}">${precoExibido}</span>
          </div>
          
          <div class="cardapio-ornament-line" aria-hidden="true"></div>

          ${item.descricao ? `
            <p class="cardapio-item-desc">${esc(item.descricao)}</p>
          ` : ''}
          
          ${item.composicao ? `
            <div class="cardapio-badge-composicao">
              <strong>Composição:</strong> ${esc(item.composicao)}
            </div>
          ` : ''}

          ${item.distribuicao ? `
            <div class="cardapio-badge-composicao">
              <strong>Distribuição:</strong> ${esc(item.distribuicao)}
            </div>
          ` : ''}

          <div class="cardapio-item-footer">
            ${isPizzaCategory ? `
              <button type="button" class="btn btn--primary btn--customizar-pizza" data-item-data="${itemJson}">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>Montar Pizza</span>
              </button>
            ` : isBordasCategory ? `
              <button type="button" class="btn btn--outline btn--gold btn--abrir-montador-borda">
                <span>Escolher ao Montar Pizza</span>
              </button>
            ` : `
              <button type="button" class="btn btn--primary btn--pedir-simples" data-item-data="${itemJson}">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>${item.preco ? 'Adicionar ao Carrinho' : 'Adicionar ao Pedido (A Confirmar)'}</span>
              </button>
            `}
          </div>
        </div>
      </article>
      `;
    }).join('');

    return `
    <div role="tabpanel" class="tab-panel ${idx === 0 ? 'active' : ''}" id="panel-${idx}" aria-labelledby="tab-${idx}">
      <p class="cat-descricao text-center mb-6">${esc(cat.descricao || '')}</p>
      <div class="cardapio-grid">
        ${itensGrid}
      </div>
    </div>
    `;
  }).join('');

  return `
  <section id="cardapio" class="secao-cardapio" aria-labelledby="cardapio-titulo">
    <div class="container">
      
      <!-- Cabeçalho da Seção -->
      <div class="text-center section-header-wrap">
        <span class="section-tag">${cardapioTextos.tituloItaliano || 'La Nostra Carta'}</span>
        <h2 id="cardapio-titulo" class="section-title">${cardapioTextos.titulo || 'Nosso Cardápio'}</h2>
        <p class="section-subtitle mb-6">
          ${cardapioTextos.subtitulo || 'Pizzas artesanais, esfihas recheadas, combos e kits especiais em Cuiabá.'}
        </p>
        
        <!-- Guia Oficial de Tamanhos e Regras Comerciais -->
        <div class="cardapio-info-banner">
          <div class="info-banner-item">
            <span class="info-banner-icon">${icone('pizza', 22)}</span>
            <div class="info-banner-text">
              <strong>Regras de Tamanho:</strong>
              <span>Grande (35cm · 8 fatias · até 3 sabores) · Média (30cm · 6 fatias) · Pequena (25cm · 4 fatias)</span>
            </div>
          </div>
          <div class="info-banner-divider" aria-hidden="true"></div>
          <div class="info-banner-item">
            <span class="info-banner-icon">${icone('entrega', 22)}</span>
            <div class="info-banner-text">
              <strong>Pedido Mínimo:</strong>
              <span>${formatarPreco(pedidoMinimo)} para entregas e atendimento</span>
            </div>
          </div>
        </div>
      </div>

      <!-- SEÇÃO DE DESTAQUES & COMBOS (MOSTRAR PRIMEIRO OS DESTAQUES) -->
      <div class="cardapio-destaques-secao mt-10 mb-12">
        <div class="destaques-header">
          <div class="destaques-title-wrap">
            <span class="destaques-badge-fire">${icone('fogo', 13)} Os Favoritos da Casa</span>
            <h3 class="destaques-section-title">Destaques &amp; Mais Pedidos</h3>
            <p class="destaques-section-sub">Combos e sabores imperdíveis preparados para compartilhar.</p>
          </div>
        </div>

        <div class="destaques-horizontal-grid">
          ${destaquesHtml}
        </div>
      </div>

      <!-- NAVEGAÇÃO RÁPIDA POR CATEGORIAS (STICKY NO SCROLL) -->
      <div class="cardapio-tabs-wrapper-sticky" id="cardapio-nav-sticky">
        <div class="cardapio-tabs-scroll-container">
          <div class="cardapio-tabs" role="tablist" aria-label="Categorias do cardápio">
            ${abasHtml}
          </div>
        </div>
      </div>

      <!-- PAINÉIS DO CARDÁPIO COMPLETO -->
      <div class="cardapio-paineis mt-8">
        ${paineisHtml}
      </div>

      <!-- Banner de Fechamento do Cardápio -->
      <div class="cardapio-footer-banner text-center mt-12">
        <div class="banner-inner">
          <p class="banner-text">Deseja revisar seus itens ou enviar o pedido para o WhatsApp?</p>
          <button type="button" class="btn btn--outline btn--gold btn--abrir-checkout">
            <span>Ver Meu Pedido no Carrinho</span>
          </button>
        </div>
      </div>

    </div>
  </section>
  `;
}

export function initCardapio(config) {
  const tabs = document.querySelectorAll('.cardapio-tabs .tab-btn');
  const panels = document.querySelectorAll('.cardapio-paineis .tab-panel');

  const animarCascataCards = (painel) => {
    if (!painel) return;
    const cards = painel.querySelectorAll('.cardapio-item-card');
    if (!cards || cards.length === 0) return;

    gsap.fromTo(cards, 
      { opacity: 0, y: 24, scale: 0.98 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.4, 
        stagger: 0.05, 
        ease: "power2.out",
        overwrite: "auto"
      }
    );
  };

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '#cardapio',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        const painelAtivo = document.querySelector('.cardapio-paineis .tab-panel.active');
        animarCascataCards(painelAtivo);
      }
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => {
        p.classList.remove('active');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Scroll horizontal da aba ativa para ficar no campo visual no mobile
      tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

      if (panels[index]) {
        panels[index].classList.add('active');
        animarCascataCards(panels[index]);
      }
    });
  });

  // Botões de customização de pizza
  document.querySelectorAll('.btn--customizar-pizza').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        const itemData = JSON.parse(btn.dataset.itemData);
        carrinho.abrirModalPizza(itemData);
      } catch (err) {
        carrinho.abrirModalPizza();
      }
    });
  });

  // Botão de abrir modal de pizza a partir da aba de bordas
  document.querySelectorAll('.btn--abrir-montador-borda').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      carrinho.abrirModalPizza();
    });
  });

  // Botões de itens simples (combos, esfihas, kits, bebidas)
  document.querySelectorAll('.btn--pedir-simples').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        const itemData = JSON.parse(btn.dataset.itemData);
        carrinho.adicionarItemSimples(itemData, 1);
        carrinho.abrirModalCheckout();
      } catch (err) {
        console.error('Erro ao adicionar item simples:', err);
      }
    });
  });

  // Botões de abrir checkout
  document.querySelectorAll('.btn--abrir-checkout').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      carrinho.abrirModalCheckout();
    });
  });
}
