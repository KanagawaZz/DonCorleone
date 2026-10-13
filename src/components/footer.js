import { esc } from '../utils/dom.js';

export function renderFooter(config) {
  const anoAtual = new Date().getFullYear();
  const marca = config.marca || {};
  const contato = config.contato || {};

  return `
  <footer class="site-footer" id="site-footer">
    <div class="container footer-container">
      
      <!-- Selo Central do Rodapé -->
      <div class="footer-seal-wrap">
        <img src="${marca.seloUrl || '/images/brand/selo.svg'}" alt="Don Corleone Selo" class="footer-seal-img" width="64" height="64" />
      </div>

      <!-- Links Rápidos e Redes -->
      <div class="footer-links-wrap">
        <a href="#montagem" class="footer-link">Início</a>
        <a href="#cardapio" class="footer-link">Cardápio</a>
        <a href="#como-pedir" class="footer-link">Como Pedir</a>
        <a href="#sobre" class="footer-link">Sobre</a>
        <a href="#contato" class="footer-link">Contato</a>
        ${contato.instagramUrl ? `
          <a href="${contato.instagramUrl}" target="_blank" rel="noopener noreferrer" class="footer-link footer-link-instagram">
            Instagram (${contato.instagramUsuario || '@pizzaria_doncorleone'})
          </a>
        ` : ''}
      </div>

      <!-- Wordmark Gigante Revelado -->
      <div class="footer-wordmark-container" aria-hidden="true">
        <span class="footer-wordmark-text">DON CORLEONE</span>
      </div>

      <!-- Copyright e Cidade -->
      <div class="footer-bottom">
        <p class="footer-copy">
          &copy; ${anoAtual} ${esc(marca.nome || 'Don Corleone')}. Todos os direitos reservados.
        </p>
        <p class="footer-city">
          ${esc(config.localizacao?.enderecoCompleto || 'Avenida Brasil, 2055, Cidade Alta, Cuiabá - MT, CEP 78030-409, Brasil')}
        </p>
      </div>

    </div>
  </footer>
  `;
}

export function initFooter(config) {
  // Inicialização do rodapé
}
