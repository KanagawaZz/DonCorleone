import { rolarPara } from '../utils/motion.js';
import { carrinho } from '../utils/carrinho.js';

export function renderHeader(config) {
  const marca = config.marca || {};
  const logoUrl = (marca.usarLogoOriginal && marca.logoOriginalUrl) ? marca.logoOriginalUrl : marca.brasaoUrl;
  const qtdItens = carrinho.obterQuantidadeTotal();

  return `
  <header class="site-header" id="site-header">
    <div class="container header-container">
      
      <!-- Logotipo & Nome da Marca -->
      <a href="#" class="header-brand" aria-label="Don Corleone - Início">
        <img src="${logoUrl}" alt="Don Corleone Brasão" class="header-logo-img" width="44" height="44" />
        <div class="header-brand-text">
          <span class="header-brand-name">${marca.nome || 'Don Corleone'}</span>
          <span class="header-brand-desc">${marca.slogan || 'Sabor incomparável'}</span>
        </div>
      </a>

      <!-- Navegação Principal Desktop -->
      <nav class="header-nav" aria-label="Navegação principal">
        <ul class="nav-list">
          <li><a href="#montagem" class="nav-link">Início</a></li>
          <li><a href="#cardapio" class="nav-link">Cardápio</a></li>
          <li><a href="#como-pedir" class="nav-link">Como Pedir</a></li>
          <li><a href="#sobre" class="nav-link">Sobre</a></li>
          <li><a href="#contato" class="nav-link">Contato</a></li>
        </ul>
      </nav>

      <!-- Ações do Header -->
      <div class="header-actions">
        <!-- Botão Carrinho com Contador -->
        <button type="button" class="btn-header-cart" id="btn-header-cart" aria-label="Ver carrinho de pedidos">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
          </svg>
          <span class="cart-count-badge ${qtdItens > 0 ? 'visible' : ''}" id="cart-count-badge">${qtdItens}</span>
        </button>

        <button type="button" class="btn btn--primary btn--header-order" id="btn-header-order">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.196 8.196 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
          </svg>
          <span class="btn-text-desktop">Pedir pelo WhatsApp</span>
          <span class="btn-text-mobile">Pedir</span>
        </button>

        <!-- Botão Menu Mobile -->
        <button type="button" class="mobile-menu-toggle" id="mobile-menu-toggle" aria-expanded="false" aria-label="Abrir menu de navegação">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

    </div>

    <!-- Gaveta de Navegação Mobile -->
    <div class="mobile-drawer" id="mobile-drawer" aria-hidden="true">
      <ul class="mobile-nav-list">
        <li><a href="#montagem" class="mobile-nav-link">Início</a></li>
        <li><a href="#cardapio" class="mobile-nav-link">Cardápio</a></li>
        <li><a href="#como-pedir" class="mobile-nav-link">Como Pedir</a></li>
        <li><a href="#sobre" class="mobile-nav-link">Sobre</a></li>
        <li><a href="#contato" class="mobile-nav-link">Contato</a></li>
      </ul>
      <div class="mobile-drawer-footer">
        <button type="button" class="btn btn--primary w-full" id="btn-drawer-order">
          Fazer Pedido no WhatsApp
        </button>
      </div>
    </div>
  </header>
  `;
}

export function initHeader(config) {
  const header = document.querySelector('#site-header');
  const toggleBtn = document.querySelector('#mobile-menu-toggle');
  const drawer = document.querySelector('#mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const btnCart = document.querySelector('#btn-header-cart');
  const cartBadge = document.querySelector('#cart-count-badge');
  const btnOrder = document.querySelector('#btn-header-order');
  const btnDrawerOrder = document.querySelector('#btn-drawer-order');

  // Efeito de sombra e blur no scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('header--scrolled');
    } else {
      header?.classList.remove('header--scrolled');
    }
  }, { passive: true });

  // Toggle Menu Mobile
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!isOpen));
      toggleBtn.classList.toggle('is-open');
      drawer.classList.toggle('is-open');
      drawer.setAttribute('aria-hidden', String(isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }

  // Smooth scroll nos links âncora
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        
        // Fecha drawer se estiver aberta
        if (drawer?.classList.contains('is-open')) {
          toggleBtn?.classList.remove('is-open');
          toggleBtn?.setAttribute('aria-expanded', 'false');
          drawer.classList.remove('is-open');
          drawer.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }

        rolarPara(targetId, { offset: -70 });
      }
    });
  });

  // Abertura do modal de pedidos
  const abrirPedido = () => {
    if (drawer?.classList.contains('is-open')) {
      toggleBtn?.classList.remove('is-open');
      toggleBtn?.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    carrinho.abrirModal();
  };

  btnCart?.addEventListener('click', abrirPedido);
  btnOrder?.addEventListener('click', abrirPedido);
  btnDrawerOrder?.addEventListener('click', abrirPedido);

  // Atualização do badge do carrinho
  window.addEventListener('carrinho-atualizado', (e) => {
    const total = e.detail?.quantidadeTotal || 0;
    if (cartBadge) {
      cartBadge.textContent = total;
      if (total > 0) {
        cartBadge.classList.add('visible');
      } else {
        cartBadge.classList.remove('visible');
      }
    }
  });
}
