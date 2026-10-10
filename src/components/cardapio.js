import { gerarLinkWhatsApp } from '../utils/whatsapp.js';
import { formatarPreco, esc } from '../utils/dom.js';

export function renderCardapio(config, dadosCardapio) {
  const cardapioTextos = config.textos?.cardapio || {};
  const categorias = dadosCardapio?.categorias || [];
  const linkWhatsAppGeral = gerarLinkWhatsApp(config);
  const temItens = categorias.some(cat => Array.isArray(cat.itens) && cat.itens.length > 0);

  if (!temItens) {
    return `
    <section id="cardapio" class="secao-cardapio" aria-labelledby="cardapio-titulo">
      <div class="container text-center">
        <span class="section-tag">${cardapioTextos.tituloItaliano || 'La nostra carta'}</span>
        <h2 id="cardapio-titulo" class="section-title">${cardapioTextos.titulo || 'Nosso Cardápio'}</h2>
        <p class="section-subtitle mb-8">
          ${cardapioTextos.subtitulo || 'Pizzas e esfihas artesanais feitas para encantar o seu paladar.'}
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
            <a href="${linkWhatsAppGeral}" target="_blank" rel="noopener noreferrer" class="btn btn--primary">
              <span>${cardapioTextos.botaoFallback || 'Ver Cardápio no WhatsApp'}</span>
            </a>
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
      const linkItem = gerarLinkWhatsApp(config, { item: `${item.nome} (${precoFormatado})` });

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
            <a href="${linkItem}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--item-order" data-item="${esc(item.nome)}">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.196 8.196 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
              </svg>
              <span>Pedir no WhatsApp</span>
            </a>
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
        <h2 id="cardapio-titulo" class="section-title">${cardapioTextos.titulo || 'Cardápio de Criações Artesanais'}</h2>
        <p class="section-subtitle mb-8">
          ${cardapioTextos.subtitulo || 'Fermentação lenta de 48h, ingredientes nobres importados e forno ardente.'}
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
          <p class="banner-text">Prefere personalizar seu sabor com borda recheada ou ingredientes adicionais?</p>
          <a href="${linkWhatsAppGeral}" target="_blank" rel="noopener noreferrer" class="btn btn--outline btn--gold">
            <span>Falar com o Pizzaiolo no WhatsApp</span>
          </a>
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

  // Atualiza os links quando a modalidade mudar (entrega / retirada)
  window.addEventListener('modalidade-alterada', (e) => {
    const modalidade = e.detail?.modalidade || 'entrega';
    const botoesItem = document.querySelectorAll('.btn--item-order');
    botoesItem.forEach(btn => {
      const itemNome = btn.dataset.item;
      if (itemNome) {
        btn.href = gerarLinkWhatsApp(config, { item: itemNome, modalidade });
      }
    });
  });
}
