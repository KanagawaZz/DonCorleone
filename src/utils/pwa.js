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

export function inicializarPWA() {
  // 1. Registro do Service Worker
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        // SW registrado com sucesso
      }).catch((err) => {
        console.warn('Registro do Service Worker falhou:', err);
      });
    });
  }

  // 2. Ouvinte de instalação nativa (Android, Chrome Desktop, Edge)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    atualizarEstadoBotoes(true);
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    atualizarEstadoBotoes(false, true);
  });

  // Conecta os botões existentes
  conectarBotoesInstalacao();
}

export function isAppInstalado() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
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

export function exibirModalInstrucoes(tipo = 'geral') {
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
            <span>Toque no botão <strong>Compartilhar</strong> (ícone com quadrado e seta para cima na barra inferior do Safari).</span>
          </li>
          <li>
            <span class="passo-numero">2</span>
            <span>Role as opções para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</span>
          </li>
          <li>
            <span class="passo-numero">3</span>
            <span>Toque em <strong>"Adicionar"</strong> no canto superior direito.</span>
          </li>
        </ol>

        <button type="button" class="btn btn--primary w-full mt-4" id="btn-entendi-pwa">Entendi, vou adicionar</button>
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
      </div>
    `;
  }

  modal.innerHTML = conteudoHtml;
  modal.classList.add('is-open');

  modal.querySelector('#btn-fechar-pwa-modal')?.addEventListener('click', () => {
    modal.classList.remove('is-open');
  });
  modal.querySelector('#btn-entendi-pwa')?.addEventListener('click', () => {
    modal.classList.remove('is-open');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('is-open');
    }
  });
}
