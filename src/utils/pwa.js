/**
 * Gerenciador PWA (Progressive Web App) - Don Corleone
 * 
 * Responsabilidades:
 * 1. Registro do Service Worker (/sw.js)
 * 2. Captura do evento beforeinstallprompt para instalação nativa
 * 3. Orientação visual para iPhone/iOS (Adicionar à Tela de Início)
 * 4. Sincronização dos botões "Instalar App Don Corleone" no rodapé e menu
 */

import { icone } from './icons.js';

let deferredPrompt = null;

// Captura imediatamente no carregamento para nunca perder o evento nativo disparado pelo navegador
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    atualizarEstadoBotoes(true);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    atualizarEstadoBotoes(false, true);
  });
}

export function inicializarPWA() {
  // 1. Registro do Service Worker (só em produção: em dev ele serviria código antigo do cache)
  if ('serviceWorker' in navigator && import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
    caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
  } else if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // SW registrado com sucesso
      }).catch((err) => {
        console.warn('Registro do Service Worker falhou:', err);
      });
    });
  }

  // Conecta os botões existentes
  conectarBotoesInstalacao();
}

function isAppInstalado() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIOS() {
  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
  const isIos = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isIpadOS = /Macintosh/.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1;
  return isIos || isIpadOS;
}

function isInAppBrowser() {
  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';
  return /FBAN|FBAV|Instagram|WhatsApp|Line|Twitter/i.test(ua);
}

function atualizarEstadoBotoes(disponivel = true, instalado = false) {
  const botoes = document.querySelectorAll('.btn-instalar-app, .btn-instalar-app-footer, .btn-instalar-app-drawer');
  botoes.forEach(btn => {
    if (instalado || isAppInstalado()) {
      btn.classList.add('app-ja-instalado');
      const label = btn.querySelector('.btn-instalar-label');
      if (label) label.textContent = 'App Instalado';
      btn.title = 'Don Corleone já está instalado neste aparelho';
    } else {
      btn.classList.remove('app-ja-instalado');
      const label = btn.querySelector('.btn-instalar-label');
      if (label) label.textContent = 'Instalar App Don Corleone';
    }
  });
}

export function conectarBotoesInstalacao() {
  const botoes = document.querySelectorAll('.btn-instalar-app, .btn-instalar-app-footer, .btn-instalar-app-drawer');
  botoes.forEach(btn => {
    btn.removeEventListener('click', tratarCliqueInstalacao);
    btn.addEventListener('click', tratarCliqueInstalacao);
  });

  if (isAppInstalado()) {
    atualizarEstadoBotoes(false, true);
  }
}

async function tratarCliqueInstalacao(e) {
  e.preventDefault();

  // Fecha o menu gaveta mobile se estiver aberto
  const drawer = document.querySelector('#mobile-drawer');
  const toggleBtn = document.querySelector('#mobile-menu-toggle');
  if (drawer?.classList.contains('is-open')) {
    toggleBtn?.classList.remove('is-open');
    toggleBtn?.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (isAppInstalado()) {
    exibirModalInstrucoes('instalado');
    return;
  }

  // Se houver o prompt nativo pronto (Android / Chrome Desktop)
  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        deferredPrompt = null;
        atualizarEstadoBotoes(false, true);
      }
      return;
    } catch (err) {
      console.warn('Erro ao acionar prompt de instalação:', err);
    }
  }

  // Se for iOS / Safari
  if (isIOS()) {
    exibirModalInstrucoes('ios');
    return;
  }

  // Outros navegadores (Chrome / Firefox / Edge sem prompt capturado)
  exibirModalInstrucoes('geral');
}

function exibirModalInstrucoes(tipo = 'geral') {
  let modal = document.querySelector('#modal-pwa-instrucoes');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-pwa-instrucoes';
    modal.className = 'modal-pwa-overlay';
    document.body.appendChild(modal);
  }

  let conteudoHtml = '';

  if (tipo === 'instalado') {
    conteudoHtml = `
      <div class="modal-pwa-card">
        <button type="button" class="modal-pwa-fechar" id="btn-fechar-pwa-modal" aria-label="Fechar">✕</button>
        <div class="modal-pwa-icone">${icone('check', 32)}</div>
        <h3 class="modal-pwa-titulo">App Don Corleone Instalado</h3>
        <p class="modal-pwa-texto">
          Você já está com o aplicativo Don Corleone pronto para uso neste aparelho!
        </p>
        <button type="button" class="btn btn--primary w-full mt-3" id="btn-entendi-pwa">Entendi</button>
      </div>
    `;
  } else if (tipo === 'ios') {
    conteudoHtml = `
      <div class="modal-pwa-card">
        <button type="button" class="modal-pwa-fechar" id="btn-fechar-pwa-modal" aria-label="Fechar">✕</button>
        <div class="modal-pwa-icone">${icone('celular', 32)}</div>
        <h3 class="modal-pwa-titulo">Instalar no iPhone / iPad</h3>
        <p class="modal-pwa-subtitulo">Tenha acesso direto com 1 toque na sua tela inicial:</p>
        
        <ol class="modal-pwa-passos">
          <li>
            <span class="passo-numero">1</span>
            <span>
              Toque no botão <strong>Compartilhar</strong>
              <span class="ios-icon-inline" title="Compartilhar">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
              </span>
              (na barra inferior do Safari).
            </span>
          </li>
          <li>
            <span class="passo-numero">2</span>
            <span>
              Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>
              <span class="ios-icon-inline" title="Adicionar à Tela de Início">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2">
                  <rect x="3" y="3" width="18" height="18" rx="4"></rect>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </span>.
            </span>
          </li>
          <li>
            <span class="passo-numero">3</span>
            <span>Toque em <strong>"Adicionar"</strong> no canto superior direito para confirmar.</span>
          </li>
        </ol>

        ${isInAppBrowser() ? `
          <div class="aviso-inapp-ios">
            <strong>Dica:</strong> Se você abriu pelo Instagram ou WhatsApp, toque nos três pontinhos (<strong>...</strong>) no topo e selecione <strong>"Abrir no Safari"</strong> primeiro.
          </div>
        ` : ''}

        <button type="button" class="btn btn--primary w-full mt-4" id="btn-entendi-pwa">Entendi, vou adicionar</button>
        <button type="button" class="btn-trocar-modo-pwa" id="btn-trocar-para-geral">Está no Android ou PC? Ver instruções gerais</button>
      </div>
    `;
  } else {
    conteudoHtml = `
      <div class="modal-pwa-card">
        <button type="button" class="modal-pwa-fechar" id="btn-fechar-pwa-modal" aria-label="Fechar">✕</button>
        <div class="modal-pwa-icone">${icone('download', 32)}</div>
        <h3 class="modal-pwa-titulo">Instalar App Don Corleone</h3>
        <p class="modal-pwa-subtitulo">Acesso rápido ao cardápio e pedidos sem precisar abrir o navegador:</p>
        
        <ol class="modal-pwa-passos">
          <li>
            <span class="passo-numero">1</span>
            <span>Toque no menu do seu navegador (os <strong>três pontinhos</strong> no canto superior ou inferior).</span>
          </li>
          <li>
            <span class="passo-numero">2</span>
            <span>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</span>
          </li>
          <li>
            <span class="passo-numero">3</span>
            <span>Confirme a instalação. O ícone oficial da Don Corleone aparecerá na sua tela.</span>
          </li>
        </ol>

        <button type="button" class="btn btn--primary w-full mt-4" id="btn-entendi-pwa">Fechar</button>
        <button type="button" class="btn-trocar-modo-pwa" id="btn-trocar-para-ios">Está no iPhone / iPad? Ver instruções do iOS</button>
      </div>
    `;
  }

  modal.innerHTML = conteudoHtml;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  const fecharModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  modal.querySelector('#btn-fechar-pwa-modal')?.addEventListener('click', fecharModal);
  modal.querySelector('#btn-entendi-pwa')?.addEventListener('click', fecharModal);
  
  modal.querySelector('#btn-trocar-para-ios')?.addEventListener('click', (e) => {
    e.stopPropagation();
    exibirModalInstrucoes('ios');
  });

  modal.querySelector('#btn-trocar-para-geral')?.addEventListener('click', (e) => {
    e.stopPropagation();
    exibirModalInstrucoes('geral');
  });

  modal.onclick = (e) => {
    if (e.target === modal) {
      fecharModal();
    }
  };
}
