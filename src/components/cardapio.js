import { formatarPreco, esc } from '../utils/dom.js';
import { carrinho } from '../utils/carrinho.js';

export function renderCardapio(config, dadosCardapio) {
  const cardapioTextos = config.textos?.cardapio || {};
  const categorias = dadosCardapio?.categorias || [];
  const temItens = categorias.some(cat => Array.isArray(cat.itens) && cat.itens.length > 0);

  if (!temItens) {
    return `
    <section id="cardapio" class="secao-cardapio" aria-labelledby="cardapio-titulo">
      <div class="container text-center">
        <span class="section-tag">${cardapioTextos.tituloItaliano || 'La nostra carta'}</span>
        <h2 id="cardapio-titulo" class="section-title">${cardapioTextos.titulo || 'Nosso Cardápio'}</h2>
        <p class="section-subtitle mb-8">
          ${cardapioTextos.subtitulo || 'Pizzas e esfihas feitas para encantar o seu paladar.'}
        </p>

        <div class="cardapio-fallback-card">
          <div class="fallback-seal-wrap">
            <img src="${config.marca?.seloUrl || '/images/brand/selo.svg'}" alt="Don Corleone Selo" class="fallback-seal" width="70" height="70" />
          </div>
          <h3 class="fallback-title">Cardápio em Atualização Diária</h3>
          <p class="fallback-desc">
            ${cardapioTextos.fallbackMensagem || 'Consulte nosso cardápio completo e as novidades de hoje diretamente no WhatsApp.'}
          </p>
          <div class="fallback-actions">
            <button type="button" class="btn btn--primary btn--abrir-pedido">
              <span>${cardapioTextos.botaoFallback || 'Ver Cardápio no WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    `;
  }

  // Abas de categorias
  const abasHtml = categorias.map((cat, idx) => `
    <button type="button" role="tab" class="tab-btn ${idx === 0 ? 'active' : ''}" id="tab-${idx}" aria-selected="${idx === 0}" aria-controls="panel-${idx}">
      ${esc(cat.nome)}
    </button>
  `).join('');

  // Painéis com os cards gastronômicos
  const paineisHtml = categorias.map((cat, idx) => {
    const itensGrid = (cat.itens || []).map(item => {
      const precoFormatado = item.preco ? formatarPreco(item.preco) : '';
      const itemJson = JSON.stringify(item).replace(/"/g, '&quot;');

      return `
      <article class="cardapio-item-card" data-reveal>
        <div class="cardapio-item-img-wrap">
          <img src="${item.foto || '/images/cardapio/calabresa-artesanal.jpg'}" alt="${esc(item.nome)}" loading="lazy" class="cardapio-item-img" />
          ${item.tag ? `<span class="cardapio-item-tag">${esc(item.tag)}</span>` : ''}
          <div class="cardapio-img-overlay"></div>
        </div>
        
        <div class="cardapio-item-info">
          <div class="cardapio-item-header">
            <h3 class="cardapio-item-nome">${esc(item.nome)}</h3>
            ${precoFormatado ? `<span class="cardapio-item-preco">${precoFormatado}</span>` : ''}
          </div>
          ${item.descricao ? `<p class="cardapio-item-desc">${esc(item.descricao)}</p>` : ''}
          
          <div class="cardapio-item-footer">
            <button type="button" class="btn btn--primary btn--pedir-item" data-item-data="${itemJson}">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Pedir este sabor</span>
            </button>
          </div>
        </div>
      </article>
      `;
    }).join('');

    return `
    <div role="tabpanel" class="tab-panel ${idx === 0 ? 'active' : ''}" id="panel-${idx}" aria-labelledby="tab-${idx}">
      <p class="cat-descricao text-center mb-8">${esc(cat.descricao || '')}</p>
      <div class="cardapio-grid">
        ${itensGrid}
      </div>
    </div>
    `;
  }).join('');

  return `
  <section id="cardapio" class="secao-cardapio" aria-labelledby="cardapio-titulo">
    <div class="container">
      <div class="text-center section-header-wrap">
        <span class="section-tag">${cardapioTextos.tituloItaliano || 'La Nostra Carta'}</span>
        <h2 id="cardapio-titulo" class="section-title">${cardapioTextos.titulo || 'Nosso Cardápio'}</h2>
        <p class="section-subtitle mb-8">
          ${cardapioTextos.subtitulo || 'Pizzas especiais, tradicionais e esfihas preparadas com todo o carinho.'}
        </p>
      </div>

      <div class="cardapio-tabs-wrapper">
        <div class="cardapio-tabs" role="tablist" aria-label="Categorias do cardápio">
          ${abasHtml}
        </div>
      </div>

      <div class="cardapio-paineis">
        ${paineisHtml}
      </div>

      <div class="cardapio-footer-banner text-center mt-12">
        <div class="banner-inner">
          <p class="banner-text">Gostaria de tirar dúvidas ou fazer um pedido personalizado?</p>
          <button type="button" class="btn btn--outline btn--gold btn--abrir-pedido">
            <span>Iniciar Pedido pelo WhatsApp</span>
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

      if (panels[index]) {
        panels[index].classList.add('active');
      }
    });
  });

  // Botões de pedido por item
  document.querySelectorAll('.btn--pedir-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      try {
        const itemData = JSON.parse(btn.dataset.itemData);
        carrinho.abrirModal(itemData);
      } catch (err) {
        console.error('Erro ao abrir item:', err);
        carrinho.abrirModal();
      }
    });
  });

  // Botões gerais de abrir pedido
  document.querySelectorAll('.btn--abrir-pedido').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      carrinho.abrirModal();
    });
  });
}
