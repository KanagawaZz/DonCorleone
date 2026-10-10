/**
 * Modal & Drawer de Carrinho e Pedido Integrado - Don Corleone
 * 
 * Permite ao cliente visualizar itens, selecionar quantidade,
 * alternar entre entrega e retirada, preencher endereço/pagamento,
 * revisar o pedido e abrir diretamente no WhatsApp com a mensagem pronta.
 */

import { carrinho } from '../utils/carrinho.js';
import { formatarPreco, esc } from '../utils/dom.js';
import { gerarLinkWhatsAppPedido } from '../utils/whatsapp-order.js';

export function renderCarrinhoModal(config) {
  return `
  <div class="pedido-modal-overlay" id="pedido-modal-overlay" aria-hidden="true">
    <div class="pedido-modal-container" id="pedido-modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
      
      <!-- Cabeçalho do Modal -->
      <header class="pedido-modal-header">
        <div class="pedido-modal-title-group">
          <img src="${config.marca?.brasaoUrl || '/images/brand/brasao.svg'}" alt="Don Corleone" class="pedido-header-brasao" width="28" height="28" />
          <div>
            <h2 id="modal-titulo" class="pedido-modal-title">Monte Seu Pedido</h2>
            <p class="pedido-modal-subtitle">Don Corleone · Unidade Arena Cuiabá</p>
          </div>
        </div>
        <button type="button" class="pedido-modal-close" id="btn-fechar-modal" aria-label="Fechar janela de pedido">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </header>

      <!-- Corpo do Modal com Scroll -->
      <div class="pedido-modal-body">
        
        <!-- Alerta de Carrinho Vazio -->
        <div class="carrinho-vazio-aviso" id="carrinho-vazio-aviso" style="display: none;">
          <div class="vazio-icon-wrap">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
          </div>
          <h3>Seu carrinho está vazio</h3>
          <p>Escolha seus sabores favoritos em nosso cardápio para começar.</p>
          <button type="button" class="btn btn--primary btn--voltar-cardapio" id="btn-ir-cardapio">
            Explorar Cardápio
          </button>
        </div>

        <!-- Conteúdo do Formulário quando há itens -->
        <div id="carrinho-conteudo-ativo">
          
          <!-- SEÇÃO A: Itens Selecionados -->
          <section class="pedido-secao secao-itens">
            <div class="secao-header-flex">
              <h3 class="pedido-secao-titulo">
                <span class="secao-num">1</span>
                Itens Selecionados
              </h3>
              <button type="button" class="btn-link-add-mais" id="btn-add-mais">
                + Adicionar mais sabores
              </button>
            </div>
            
            <div class="pedido-itens-lista" id="pedido-itens-lista">
              <!-- Renderizado dinamicamente -->
            </div>

            <div class="pedido-subtotal-bar">
              <span class="subtotal-label">Subtotal dos produtos:</span>
              <span class="subtotal-valor" id="subtotal-produtos-display">R$ 0,00</span>
            </div>
          </section>

          <!-- SEÇÃO B: Dados do Cliente -->
          <section class="pedido-secao secao-cliente">
            <h3 class="pedido-secao-titulo">
              <span class="secao-num">2</span>
              Seus Dados
            </h3>
            
            <div class="form-grid-2">
              <div class="form-campo">
                <label for="cliente-nome" class="form-label">
                  Nome completo <span class="campo-obrigatorio">*</span>
                </label>
                <input type="text" id="cliente-nome" name="cliente_nome" class="form-input" placeholder="Ex: João Silva" required autocomplete="name" />
                <span class="form-erro" id="erro-cliente-nome"></span>
              </div>

              <div class="form-campo">
                <label for="cliente-telefone" class="form-label">
                  Telefone / WhatsApp <span class="campo-obrigatorio">*</span>
                </label>
                <input type="tel" id="cliente-telefone" name="cliente_telefone" class="form-input" placeholder="(65) 99999-9999" required autocomplete="tel" />
                <span class="form-erro" id="erro-cliente-telefone"></span>
              </div>
            </div>
          </section>

          <!-- SEÇÃO C: Modalidade de Atendimento -->
          <section class="pedido-secao secao-modalidade">
            <h3 class="pedido-secao-titulo">
              <span class="secao-num">3</span>
              Modalidade do Pedido
            </h3>
            
            <div class="modalidade-selector" role="radiogroup" aria-label="Escolha a forma de recebimento">
              <label class="modalidade-card active" id="modalidade-card-entrega">
                <input type="radio" name="modalidade_tipo" value="entrega" checked class="sr-only" />
                <div class="modalidade-card-inner">
                  <div class="modalidade-icon-box">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"/>
                      <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"/>
                      <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
                    </svg>
                  </div>
                  <div class="modalidade-textos">
                    <span class="modalidade-titulo">Entrega (Delivery)</span>
                    <span class="modalidade-desc">Receba quentinha na sua casa</span>
                  </div>
                  <div class="modalidade-check-indicator"></div>
                </div>
              </label>

              <label class="modalidade-card" id="modalidade-card-retirada">
                <input type="radio" name="modalidade_tipo" value="retirada" class="sr-only" />
                <div class="modalidade-card-inner">
                  <div class="modalidade-icon-box">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                      <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                  </div>
                  <div class="modalidade-textos">
                    <span class="modalidade-titulo">Retirada no Balcão</span>
                    <span class="modalidade-desc">Unidade Arena Cuiabá</span>
                  </div>
                  <div class="modalidade-check-indicator"></div>
                </div>
              </label>
            </div>

            <!-- Bloco Condicional: Campos de Endereço para Entrega -->
            <div class="condicional-bloco" id="bloco-endereco-entrega">
              <div class="aviso-taxa-entrega">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span><strong>Taxa de entrega:</strong> a confirmar com a pizzaria após envio do endereço.</span>
              </div>

              <div class="form-grid-3">
                <div class="form-campo grid-col-2">
                  <label for="entrega-rua" class="form-label">
                    Rua / Avenida <span class="campo-obrigatorio">*</span>
                  </label>
                  <input type="text" id="entrega-rua" name="entrega_rua" class="form-input" placeholder="Ex: Av. Agrícola Paes de Barros" required />
                  <span class="form-erro" id="erro-entrega-rua"></span>
                </div>

                <div class="form-campo">
                  <label for="entrega-numero" class="form-label">
                    Número <span class="campo-obrigatorio">*</span>
                  </label>
                  <input type="text" id="entrega-numero" name="entrega_numero" class="form-input" placeholder="Ex: 120" required />
                  <span class="form-erro" id="erro-entrega-numero"></span>
                </div>
              </div>

              <div class="form-grid-2 mt-3">
                <div class="form-campo">
                  <label for="entrega-bairro" class="form-label">
                    Bairro <span class="campo-obrigatorio">*</span>
                  </label>
                  <input type="text" id="entrega-bairro" name="entrega_bairro" class="form-input" placeholder="Ex: Verdão" required />
                  <span class="form-erro" id="erro-entrega-bairro"></span>
                </div>

                <div class="form-campo">
                  <label for="entrega-cidade" class="form-label">Cidade</label>
                  <input type="text" id="entrega-cidade" name="entrega_cidade" class="form-input" value="Cuiabá — MT" readonly />
                </div>
              </div>

              <div class="form-grid-2 mt-3">
                <div class="form-campo">
                  <label for="entrega-complemento" class="form-label">Complemento (opcional)</label>
                  <input type="text" id="entrega-complemento" name="entrega_complemento" class="form-input" placeholder="Ex: Apto 402, Bloco B" />
                </div>

                <div class="form-campo">
                  <label for="entrega-referencia" class="form-label">Ponto de referência (opcional)</label>
                  <input type="text" id="entrega-referencia" name="entrega_referencia" class="form-input" placeholder="Ex: Próximo à praça principal" />
                </div>
              </div>
            </div>

            <!-- Bloco Condicional: Informações de Retirada no Balcão -->
            <div class="condicional-bloco" id="bloco-info-retirada" style="display: none;">
              <div class="balcao-info-box">
                <div class="balcao-badge">Retirada na Loja</div>
                <h4>Unidade Arena Cuiabá</h4>
                <p><strong>Horário de funcionamento:</strong> Todos os dias, das 17h às 23h.</p>
                <div class="form-campo mt-3">
                  <label for="retirada-horario" class="form-label">Horário pretendido para retirada (opcional)</label>
                  <input type="text" id="retirada-horario" name="retirada_horario" class="form-input" placeholder="Ex: Em 30 minutos / Às 20:30" />
                </div>
              </div>
            </div>
          </section>

          <!-- SEÇÃO D: Forma de Pagamento -->
          <section class="pedido-secao secao-pagamento">
            <h3 class="pedido-secao-titulo">
              <span class="secao-num">4</span>
              Forma de Pagamento
            </h3>

            <div class="pagamento-options-grid">
              <label class="pagamento-opcao active">
                <input type="radio" name="forma_pagamento" value="pix" checked class="sr-only" />
                <div class="pagamento-opcao-box">
                  <svg class="pag-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 2 4 10l8 8 8-8-8-8zm0 4.24 3.76 3.76L12 13.76 8.24 10 12 6.24z"/>
                  </svg>
                  <span class="pag-nome">Pix</span>
                </div>
              </label>

              <label class="pagamento-opcao">
                <input type="radio" name="forma_pagamento" value="dinheiro" class="sr-only" />
                <div class="pagamento-opcao-box">
                  <svg class="pag-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                    <circle cx="12" cy="12" r="2"></circle>
                    <path d="M6 12h.01M18 12h.01"></path>
                  </svg>
                  <span class="pag-nome">Dinheiro</span>
                </div>
              </label>

              <label class="pagamento-opcao">
                <input type="radio" name="forma_pagamento" value="cartao_credito" class="sr-only" />
                <div class="pagamento-opcao-box">
                  <svg class="pag-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <span class="pag-nome">Crédito</span>
                </div>
              </label>

              <label class="pagamento-opcao">
                <input type="radio" name="forma_pagamento" value="cartao_debito" class="sr-only" />
                <div class="pagamento-opcao-box">
                  <svg class="pag-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  <span class="pag-nome">Débito</span>
                </div>
              </label>
            </div>

            <!-- Bloco Condicional de Troco para Dinheiro -->
            <div class="condicional-bloco mt-3" id="bloco-troco-dinheiro" style="display: none;">
              <div class="troco-pergunta-wrap">
                <span class="form-label mb-2">Precisa de troco?</span>
                <div class="troco-radios">
                  <label class="troco-radio-item">
                    <input type="radio" name="precisa_troco" value="nao" checked />
                    <span>Não preciso de troco</span>
                  </label>
                  <label class="troco-radio-item">
                    <input type="radio" name="precisa_troco" value="sim" />
                    <span>Sim, preciso de troco</span>
                  </label>
                </div>
              </div>

              <div class="form-campo mt-3" id="campo-valor-troco" style="display: none;">
                <label for="valor-troco" class="form-label">Troco para quanto?</label>
                <input type="text" id="valor-troco" name="valor_troco" class="form-input" placeholder="Ex: R$ 100,00" />
                <span class="form-erro" id="erro-valor-troco"></span>
              </div>
            </div>
          </section>

          <!-- SEÇÃO E: Observações Gerais -->
          <section class="pedido-secao secao-obs">
            <h3 class="pedido-secao-titulo">
              <span class="secao-num">5</span>
              Observações (opcional)
            </h3>
            <textarea id="pedido-observacoes" name="pedido_observacoes" class="form-textarea" rows="2" placeholder="Ex: Tirar cebola, campainha quebrada, ligar ao chegar..."></textarea>
          </section>

          <!-- SEÇÃO F: Resumo e Revisão do Pedido -->
          <section class="pedido-secao secao-revisao">
            <h3 class="pedido-secao-titulo">
              <span class="secao-num">✓</span>
              Resumo do Pedido
            </h3>

            <div class="revisao-card" id="revisao-card-box">
              <!-- Preenchido dinamicamente -->
            </div>
          </section>

        </div>
      </div>

      <!-- Rodapé com Ações de Envio -->
      <footer class="pedido-modal-footer" id="pedido-modal-footer">
        <div class="footer-total-box">
          <span class="footer-total-label">Subtotal dos produtos:</span>
          <span class="footer-total-valor" id="footer-total-valor">R$ 0,00</span>
          <span class="footer-total-taxa-aviso" id="footer-taxa-aviso">+ taxa de entrega a confirmar</span>
        </div>

        <button type="button" class="btn btn--primary btn--enviar-whats" id="btn-enviar-pedido-whats">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.196 8.196 0 0 1-5.82 2.41c-1.47 0-2.91-.39-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.21 8.21 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.42 1.02 2.59.13.17 1.76 2.69 4.27 3.77.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
          </svg>
          <span>Confirmar e Continuar para o WhatsApp</span>
        </button>
      </footer>

    </div>
  </div>
  `;
}

export function initCarrinhoModal(config) {
  const overlay = document.querySelector('#pedido-modal-overlay');
  const container = document.querySelector('#pedido-modal-container');
  const btnFechar = document.querySelector('#btn-fechar-modal');
  const btnAddMais = document.querySelector('#btn-add-mais');
  const btnIrCardapio = document.querySelector('#btn-ir-cardapio');
  const btnEnviar = document.querySelector('#btn-enviar-pedido-whats');
  
  const listaItens = document.querySelector('#pedido-itens-lista');
  const avisoVazio = document.querySelector('#carrinho-vazio-aviso');
  const conteudoAtivo = document.querySelector('#carrinho-conteudo-ativo');
  const footerModal = document.querySelector('#pedido-modal-footer');
  const subtotalDisplay = document.querySelector('#subtotal-produtos-display');
  const footerTotalValor = document.querySelector('#footer-total-valor');
  const footerTaxaAviso = document.querySelector('#footer-taxa-aviso');
  const revisaoBox = document.querySelector('#revisao-card-box');

  // Campos do formulário
  const inputNome = document.querySelector('#cliente-nome');
  const inputTelefone = document.querySelector('#cliente-telefone');
  const radiosModalidade = document.querySelectorAll('input[name="modalidade_tipo"]');
  const blocoEndereco = document.querySelector('#bloco-endereco-entrega');
  const blocoRetirada = document.querySelector('#bloco-info-retirada');
  const inputRua = document.querySelector('#entrega-rua');
  const inputNumero = document.querySelector('#entrega-numero');
  const inputBairro = document.querySelector('#entrega-bairro');
  const inputComplemento = document.querySelector('#entrega-complemento');
  const inputReferencia = document.querySelector('#entrega-referencia');
  const inputRetiradaHorario = document.querySelector('#retirada-horario');
  const radiosPagamento = document.querySelectorAll('input[name="forma_pagamento"]');
  const blocoTroco = document.querySelector('#bloco-troco-dinheiro');
  const radiosTroco = document.querySelectorAll('input[name="precisa_troco"]');
  const campoValorTroco = document.querySelector('#campo-valor-troco');
  const inputValorTroco = document.querySelector('#valor-troco');
  const inputObs = document.querySelector('#pedido-observacoes');

  // Formatação de Telefone com máscara brasileira (XX) XXXXX-XXXX
  if (inputTelefone) {
    inputTelefone.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);
      if (v.length > 6) {
        v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
      } else if (v.length > 2) {
        v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      } else if (v.length > 0) {
        v = `(${v}`;
      }
      e.target.value = v;
      atualizarRevisao();
    });
  }

  // Formatação de Troco
  if (inputValorTroco) {
    inputValorTroco.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v) {
        v = (Number(v) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      }
      e.target.value = v;
      atualizarRevisao();
    });
  }

  // Ouvintes de alteração nos inputs para atualizar o resumo
  [inputNome, inputRua, inputNumero, inputBairro, inputComplemento, inputReferencia, inputRetiradaHorario, inputObs].forEach(input => {
    input?.addEventListener('input', atualizarRevisao);
  });

  // Modalidade (Entrega vs Retirada)
  radiosModalidade.forEach(radio => {
    radio.addEventListener('change', () => {
      const cardEntrega = document.querySelector('#modalidade-card-entrega');
      const cardRetirada = document.querySelector('#modalidade-card-retirada');
      
      if (radio.value === 'entrega') {
        cardEntrega?.classList.add('active');
        cardRetirada?.classList.remove('active');
        if (blocoEndereco) blocoEndereco.style.display = 'block';
        if (blocoRetirada) blocoRetirada.style.display = 'none';
        if (footerTaxaAviso) footerTaxaAviso.style.display = 'block';
      } else {
        cardRetirada?.classList.add('active');
        cardEntrega?.classList.remove('active');
        if (blocoEndereco) blocoEndereco.style.display = 'none';
        if (blocoRetirada) blocoRetirada.style.display = 'block';
        if (footerTaxaAviso) footerTaxaAviso.style.display = 'none';
      }
      atualizarRevisao();
    });
  });

  // Pagamento
  radiosPagamento.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.pagamento-opcao').forEach(lbl => lbl.classList.remove('active'));
      radio.closest('.pagamento-opcao')?.classList.add('active');

      if (radio.value === 'dinheiro') {
        if (blocoTroco) blocoTroco.style.display = 'block';
      } else {
        if (blocoTroco) blocoTroco.style.display = 'none';
      }
      atualizarRevisao();
    });
  });

  // Troco Radio
  radiosTroco.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'sim') {
        if (campoValorTroco) campoValorTroco.style.display = 'block';
      } else {
        if (campoValorTroco) campoValorTroco.style.display = 'none';
      }
      atualizarRevisao();
    });
  });

  function renderizarItensModal() {
    const itens = carrinho.obterItens();
    const subtotal = carrinho.obterSubtotal();

    if (itens.length === 0) {
      if (avisoVazio) avisoVazio.style.display = 'block';
      if (conteudoAtivo) conteudoAtivo.style.display = 'none';
      if (footerModal) footerModal.style.display = 'none';
      return;
    }

    if (avisoVazio) avisoVazio.style.display = 'none';
    if (conteudoAtivo) conteudoAtivo.style.display = 'block';
    if (footerModal) footerModal.style.display = 'flex';

    if (listaItens) {
      listaItens.innerHTML = itens.map(item => `
        <div class="item-linha" data-item-id="${item.id}">
          <img src="${item.foto}" alt="${esc(item.nome)}" class="item-thumb" />
          <div class="item-detalhes">
            <h4 class="item-nome">${esc(item.nome)}</h4>
            <span class="item-unitario">${formatarPreco(item.preco)} cada</span>
          </div>
          <div class="item-qty-controles">
            <button type="button" class="btn-qty btn-qty-minus" data-action="minus" aria-label="Diminuir quantidade">−</button>
            <span class="item-qty-num">${item.quantidade}</span>
            <button type="button" class="btn-qty btn-qty-plus" data-action="plus" aria-label="Aumentar quantidade">+</button>
          </div>
          <div class="item-total-preco">
            ${formatarPreco(item.preco * item.quantidade)}
          </div>
          <button type="button" class="btn-item-remover" data-action="remove" aria-label="Remover item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `).join('');

      // Ações nos botões de quantidade e remover
      listaItens.querySelectorAll('.item-linha').forEach(linha => {
        const itemId = linha.dataset.itemId;
        linha.querySelector('[data-action="minus"]')?.addEventListener('click', () => {
          carrinho.alterarQuantidadeDelta(itemId, -1);
        });
        linha.querySelector('[data-action="plus"]')?.addEventListener('click', () => {
          carrinho.alterarQuantidadeDelta(itemId, 1);
        });
        linha.querySelector('[data-action="remove"]')?.addEventListener('click', () => {
          carrinho.removerItem(itemId);
        });
      });
    }

    const subtotalFmt = formatarPreco(subtotal);
    if (subtotalDisplay) subtotalDisplay.textContent = subtotalFmt;
    if (footerTotalValor) footerTotalValor.textContent = subtotalFmt;

    atualizarRevisao();
  }

  function obterDadosFormulario() {
    const modalidade = document.querySelector('input[name="modalidade_tipo"]:checked')?.value || 'entrega';
    const formaPag = document.querySelector('input[name="forma_pagamento"]:checked')?.value || 'pix';
    const precisaTroco = document.querySelector('input[name="precisa_troco"]:checked')?.value || 'nao';

    return {
      itens: carrinho.obterItens(),
      cliente: {
        nome: inputNome?.value?.trim() || '',
        telefone: inputTelefone?.value?.trim() || ''
      },
      modalidade,
      endereco: {
        logradouro: inputRua?.value?.trim() || '',
        numero: inputNumero?.value?.trim() || '',
        bairro: inputBairro?.value?.trim() || '',
        complemento: inputComplemento?.value?.trim() || '',
        referencia: inputReferencia?.value?.trim() || '',
        cidade: 'Cuiabá',
        estado: 'MT'
      },
      retirada: {
        unidade: 'Arena Cuiabá',
        horarioPretendido: inputRetiradaHorario?.value?.trim() || ''
      },
      pagamento: {
        forma: formaPag,
        precisaTroco,
        trocoPara: precisaTroco === 'sim' ? inputValorTroco?.value?.trim() : ''
      },
      observacoes: inputObs?.value?.trim() || ''
    };
  }

  function atualizarRevisao() {
    if (!revisaoBox) return;
    const dados = obterDadosFormulario();
    const subtotal = carrinho.obterSubtotal();

    let enderecoOuRetiradaHtml = '';
    if (dados.modalidade === 'entrega') {
      const enderecoTexto = [
        dados.endereco.logradouro ? `${dados.endereco.logradouro}, ${dados.endereco.numero || 'S/N'}` : null,
        dados.endereco.bairro ? `Bairro: ${dados.endereco.bairro}` : null,
        'Cuiabá — MT'
      ].filter(Boolean).join(' · ');

      enderecoOuRetiradaHtml = `
        <div class="rev-linha">
          <span class="rev-label">Entrega em:</span>
          <span class="rev-val">${enderecoTexto || 'Informe o endereço acima'}</span>
        </div>
        <div class="rev-linha">
          <span class="rev-label">Taxa de entrega:</span>
          <span class="rev-val text-gold">A confirmar com a pizzaria</span>
        </div>
      `;
    } else {
      enderecoOuRetiradaHtml = `
        <div class="rev-linha">
          <span class="rev-label">Modalidade:</span>
          <span class="rev-val">Retirada no balcão (Arena Cuiabá)</span>
        </div>
      `;
    }

    const nomesPag = {
      pix: 'Pix',
      dinheiro: dados.pagamento.precisaTroco === 'sim' && dados.pagamento.trocoPara ? `Dinheiro (Troco para ${dados.pagamento.trocoPara})` : 'Dinheiro',
      cartao_credito: 'Cartão de Crédito',
      cartao_debito: 'Cartão de Débito'
    };

    revisaoBox.innerHTML = `
      <div class="rev-linha">
        <span class="rev-label">Cliente:</span>
        <span class="rev-val">${dados.cliente.nome || 'Pendente'} · ${dados.cliente.telefone || 'Pendente'}</span>
      </div>
      ${enderecoOuRetiradaHtml}
      <div class="rev-linha">
        <span class="rev-label">Pagamento:</span>
        <span class="rev-val">${nomesPag[dados.pagamento.forma] || 'Pix'}</span>
      </div>
      <div class="rev-linha total-linha">
        <span class="rev-label">Total dos produtos:</span>
        <span class="rev-val-destaque">${formatarPreco(subtotal)}</span>
      </div>
    `;
  }

  function limparErros() {
    document.querySelectorAll('.form-erro').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-input').forEach(el => el.classList.remove('input-invalido'));
  }

  function validarFormulario() {
    limparErros();
    let valido = true;
    let primeiroElementoInvalido = null;

    const marcarErro = (input, idErro, mensagem) => {
      valido = false;
      if (input) input.classList.add('input-invalido');
      const elErro = document.querySelector(`#${idErro}`);
      if (elErro) elErro.textContent = mensagem;
      if (!primeiroElementoInvalido && input) primeiroElementoInvalido = input;
    };

    // Validar Nome
    if (!inputNome?.value?.trim()) {
      marcarErro(inputNome, 'erro-cliente-nome', 'Por favor, informe seu nome completo.');
    }

    // Validar Telefone (pelo menos 10 dígitos)
    const telDigits = inputTelefone?.value?.replace(/\D/g, '') || '';
    if (telDigits.length < 10) {
      marcarErro(inputTelefone, 'erro-cliente-telefone', 'Informe um telefone válido com DDD (ex: 65 99999-9999).');
    }

    // Validar Endereço se modalidade for Entrega
    const modalidade = document.querySelector('input[name="modalidade_tipo"]:checked')?.value;
    if (modalidade === 'entrega') {
      if (!inputRua?.value?.trim()) {
        marcarErro(inputRua, 'erro-entrega-rua', 'Informe o nome da rua ou avenida.');
      }
      if (!inputNumero?.value?.trim()) {
        marcarErro(inputNumero, 'erro-entrega-numero', 'Informe o número do local.');
      }
      if (!inputBairro?.value?.trim()) {
        marcarErro(inputBairro, 'erro-entrega-bairro', 'Informe o bairro.');
      }
    }

    // Validar Troco se Dinheiro e selecionou precisa de troco
    const formaPag = document.querySelector('input[name="forma_pagamento"]:checked')?.value;
    const precisaTroco = document.querySelector('input[name="precisa_troco"]:checked')?.value;
    if (formaPag === 'dinheiro' && precisaTroco === 'sim') {
      if (!inputValorTroco?.value?.trim()) {
        marcarErro(inputValorTroco, 'erro-valor-troco', 'Informe para quanto precisa de troco.');
      }
    }

    if (!valido && primeiroElementoInvalido) {
      primeiroElementoInvalido.scrollIntoView({ behavior: 'smooth', block: 'center' });
      primeiroElementoInvalido.focus();
    }

    return valido;
  }

  function abrir() {
    overlay?.classList.add('is-open');
    overlay?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderizarItensModal();
  }

  function fechar() {
    overlay?.classList.remove('is-open');
    overlay?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event Listeners
  btnFechar?.addEventListener('click', fechar);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) fechar();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay?.classList.contains('is-open')) {
      fechar();
    }
  });

  btnAddMais?.addEventListener('click', () => {
    fechar();
    const cardapio = document.querySelector('#cardapio');
    if (cardapio) {
      cardapio.scrollIntoView({ behavior: 'smooth' });
    }
  });

  btnIrCardapio?.addEventListener('click', () => {
    fechar();
    const cardapio = document.querySelector('#cardapio');
    if (cardapio) {
      cardapio.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Enviar Pedido para o WhatsApp
  btnEnviar?.addEventListener('click', () => {
    if (carrinho.obterItens().length === 0) {
      alert('Seu carrinho está vazio. Escolha um produto no cardápio!');
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    const dados = obterDadosFormulario();
    const linkWhats = gerarLinkWhatsAppPedido(config, dados);

    // Abre o WhatsApp com a mensagem formatada
    window.open(linkWhats, '_blank', 'noopener,noreferrer');
  });

  // Sincronização com o store do Carrinho
  window.addEventListener('carrinho-atualizado', renderizarItensModal);

  window.addEventListener('abrir-modal-pedido', () => {
    abrir();
  });

  window.addEventListener('fechar-modal-pedido', () => {
    fechar();
  });
}
