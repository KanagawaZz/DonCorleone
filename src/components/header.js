import { gerarLinkWhatsApp } from '../utils/whatsapp.js';
import { rolarPara } from '../utils/motion.js';

export function renderHeader(config) {
  const marca = config.marca || {};
  const linkWhatsApp = gerarLinkWhatsApp(config);
  const logoUrl = (marca.usarLogoOriginal && marca.logoOriginalUrl) ? marca.logoOriginalUrl : marca.brasaoUrl;

  return `
  <header class="site-header" id="site-header">
    <div class="container header-container">
      
      <!-- Logotipo & Nome da Marca -->
      <a href="#" class="header-brand" aria-label="Don Corleone - Início">
        <img src="${logoUrl}" alt="Don Corleone Brasão" class="header-logo-img" width="44" height="44" />
        <div class="header-brand-text">
          <span class="header-brand-name">${marca.nome || 'Don Corleone'}</span>
          <span class="header-brand-desc">${marca.descritor || 'Pizzas e Esfihas'}</span>
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
        <a href="${linkWhatsApp}" target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--header-order">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.196 8.196 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
          </svg>
          <span class="btn-text-desktop">Pedir no WhatsApp</span>
          <span class="btn-text-mobile">Pedir</span>
        </a>

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
        <a href="${linkWhatsApp}" target="_blank" rel="noopener noreferrer" class="btn btn--primary w-full">
          Pedir no WhatsApp
        </a>
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

  // Atualiza link de pedido do header quando modalidade mudar
  window.addEventListener('modalidade-alterada', (e) => {
    const modalidade = e.detail?.modalidade || 'entrega';
    const btnOrder = header?.querySelector('.btn--header-order');
    if (btnOrder) {
      btnOrder.href = gerarLinkWhatsApp(config, { modalidade });
    }
  });
}
