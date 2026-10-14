/**
 * Formatador de Mensagens e Links para WhatsApp - Don Corleone
 * 
 * Otimizado para atendimento ágil e impressão de comanda térmica (80mm/58mm):
 * - 1ª linha compacta para leitura em 3 segundos pela atendente
 * - Bloco da Cozinha / Pizzaiolo (sabores e observações em destaque)
 * - Bloco do Motoboy / Entrega (endereço completo e referências)
 * - Bloco Financeiro / Caixa (cálculo exato de troco para o motoboy levar)
 * - encodeURIComponent com codificação segura para acentos e quebras
 */

import { formatarPreco, extrairNumeroMoeda } from './dom.js';

/**
 * Obtém a data e hora formatada no fuso de Cuiabá/MT
 * @returns {string}
 */
function obterDataHoraCuiaba() {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Cuiaba',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  } catch (e) {
    const d = new Date();
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${hora}:${min}`;
  }
}

/**
 * Monta o texto padronizado do pedido para envio via WhatsApp e impressão térmica.
 * 
 * @param {object} dados
 * @returns {string}
 */
export function montarMensagemWhatsApp(dados = {}) {
  const {
    codigoPedido = 'DC-PEDIDO',
    itens = [],
    cliente = {},
    modalidade = 'entrega', // 'entrega' | 'retirada'
    entregaInfo = {},       // { taxa, statusTaxa, taxaTexto, bairro, cidade }
    endereco = {},          // { logradouro, numero, bairro, complemento, referencia, cep, cidade, estado }
    retirada = {},          // { unidade, horarioPretendido, tempoEstimado }
    pagamento = {},         // { forma, precisaTroco, trocoPara }
    promocaoInfo = {},      // { ativa, titulo, desconto, descontoPercentual }
    observacoes = ''
  } = dados;

  // 1. Cálculo dos totais
  let subtotal = 0;
  itens.forEach(item => {
    const precoUnit = typeof item.precoUnitario === 'number' ? item.precoUnitario : (item.preco || 0);
    subtotal += precoUnit * (item.quantidade || 1);
  });

  const desconto = promocaoInfo.desconto && promocaoInfo.desconto > 0 ? promocaoInfo.desconto : 0;
  const subtotalComDesconto = Math.max(0, subtotal - desconto);

  const isEntrega = modalidade === 'entrega';
  const taxaEntrega = isEntrega ? (typeof entregaInfo.taxa === 'number' ? entregaInfo.taxa : 0) : 0;
  const taxaDefinida = isEntrega && typeof entregaInfo.taxa === 'number';
  const temItensSobConsulta = itens.some(i => {
    const p = typeof i.precoUnitario === 'number' ? i.precoUnitario : (typeof i.preco === 'number' ? i.preco : null);
    return p === null || (p === 0 && i.tipo !== 'pizza');
  });

  const totalNumerico = subtotalComDesconto + taxaEntrega;
  let totalFinalTexto = '';
  let totalCabecalhoTexto = '';

  if (temItensSobConsulta) {
    totalFinalTexto = `${formatarPreco(subtotalComDesconto)} (parcial + itens a confirmar)`;
    totalCabecalhoTexto = `${formatarPreco(subtotalComDesconto)} (+ a confirmar)`;
  } else if (taxaDefinida || !isEntrega) {
    totalFinalTexto = formatarPreco(totalNumerico);
    totalCabecalhoTexto = formatarPreco(totalNumerico);
  } else {
    totalFinalTexto = `${formatarPreco(subtotalComDesconto)} (+ taxa a confirmar)`;
    totalCabecalhoTexto = `${formatarPreco(subtotalComDesconto)} (+ taxa)`;
  }

  // 2. Cálculo inteligente do Troco para Dinheiro
  const isDinheiro = pagamento.forma === 'dinheiro';
  const precisaTroco = pagamento.precisaTroco === 'sim';
  const valorPagoInformado = isDinheiro && precisaTroco ? extrairNumeroMoeda(pagamento.trocoPara) : 0;
  const trocoALevar = isDinheiro && precisaTroco && valorPagoInformado > totalNumerico 
    ? valorPagoInformado - totalNumerico 
    : 0;

  // Badges rápidos para a Linha 1 de 3 segundos
  const modalidadeBadge = isEntrega ? 'ENTREGA' : 'RETIRADA';
  
  let pagamentoBadge = 'PIX';
  if (isDinheiro) {
    if (precisaTroco && valorPagoInformado > totalNumerico) {
      pagamentoBadge = `DINHEIRO (Troco p/ ${formatarPreco(valorPagoInformado)} -> Levar ${formatarPreco(trocoALevar)})`;
    } else if (precisaTroco && valorPagoInformado > 0) {
      pagamentoBadge = `DINHEIRO (Troco p/ ${formatarPreco(valorPagoInformado)})`;
    } else {
      pagamentoBadge = 'DINHEIRO (Sem troco)';
    }
  } else if (pagamento.forma === 'pix') {
    pagamentoBadge = 'PIX (Aguardando comprovante)';
  } else if (pagamento.forma === 'cartao_credito') {
    pagamentoBadge = 'CARTÃO CRÉDITO (Levar maquininha)';
  } else if (pagamento.forma === 'cartao_debito') {
    pagamentoBadge = 'CARTÃO DÉBITO (Levar maquininha)';
  } else {
    pagamentoBadge = (pagamento.forma || 'A COMBINAR').toUpperCase();
  }

  const dataHoraPedido = obterDataHoraCuiaba();
  const linhas = [];

  // ==========================================================================
  // LINHA 1 (ESSENCIAL PARA LEITURA IMEDIATA EM 3 SEGUNDOS)
  // ==========================================================================
  linhas.push(`🍕 #${codigoPedido} | ${modalidadeBadge} | ${pagamentoBadge} | ${totalCabecalhoTexto}`);
  linhas.push('');

  // ==========================================================================
  // CABEÇALHO DA COMANDA TÉRMICA (80mm / 58mm)
  // ==========================================================================
  linhas.push('========================================');
  linhas.push('🍕 DON CORLEONE — COMANDA DE PEDIDO');
  linhas.push(`PEDIDO: #${codigoPedido}`);
  linhas.push(`DATA/HORA: ${dataHoraPedido}`);
  linhas.push(`MODALIDADE: ${isEntrega ? 'ENTREGA (DELIVERY)' : 'RETIRADA NO BALCÃO'}`);
  linhas.push('========================================');
  linhas.push('');

  // ==========================================================================
  // BLOCO 1: COZINHA / PIZZAIOLO (SABORES, BORDAS E ADICIONAIS)
  // ==========================================================================
  linhas.push('👨‍🍳 [BLOCO DA COZINHA / PIZZAIOLO]');
  linhas.push('----------------------------------------');

  itens.forEach((item, index) => {
    const precoUnit = typeof item.precoUnitario === 'number' ? item.precoUnitario : (item.preco || 0);
    const itemSubtotal = precoUnit * (item.quantidade || 1);

    if (item.tipo === 'pizza') {
      const qtdSabores = item.sabores?.length || 1;
      const sufixoSabores = qtdSabores === 1 ? '1 SABOR' : `${qtdSabores} SABORES`;
      const nomeTamanho = (item.tamanho?.nome || 'Pizza Grande').toUpperCase();

      linhas.push(`${item.quantidade}x ${nomeTamanho} — ${sufixoSabores}`);
      
      (item.sabores || []).forEach(s => {
        let fracao = '';
        if (qtdSabores === 2) fracao = '1/2 ';
        else if (qtdSabores === 3) fracao = '1/3 ';
        linhas.push(`  • ${fracao}${s.nome.toUpperCase()}`);
      });

      if (item.borda && item.borda.id !== 'sem-borda') {
        const precoBordaTxt = (typeof item.borda.preco === 'number' && item.borda.preco > 0) 
          ? ` (+${formatarPreco(item.borda.preco)})` 
          : (item.borda.precoTexto ? ` (${item.borda.precoTexto})` : '');
        linhas.push(`  • BORDA RECHEADA: ${item.borda.nome}${precoBordaTxt}`);
      }

      if (item.observacoes && item.observacoes.trim()) {
        linhas.push(`  ⚠️ OBS DO ITEM: ${item.observacoes.trim()}`);
      }

      linhas.push(`  Valor: ${formatarPreco(itemSubtotal)}`);
    } else {
      linhas.push(`${item.quantidade}x ${item.nome.toUpperCase()}`);
      if (typeof precoUnit === 'number' && precoUnit > 0) {
        linhas.push(`  Valor: ${formatarPreco(itemSubtotal)} (${formatarPreco(precoUnit)} cada)`);
      } else {
        linhas.push(`  Valor: A confirmar (${item.precoTexto || 'Sob consulta'})`);
      }
    }

    if (index < itens.length - 1) {
      linhas.push('');
    }
  });

  if (observacoes && observacoes.trim()) {
    linhas.push('----------------------------------------');
    linhas.push('OBSERVAÇÕES GERAIS DA COZINHA:');
    linhas.push(`> ${observacoes.trim()}`);
  }

  linhas.push('');

  // ==========================================================================
  // BLOCO 2: MOTOBOY / ENTREGA (OU RETIRADA NO BALCÃO)
  // ==========================================================================
  if (isEntrega) {
    linhas.push('========================================');
    linhas.push('🛵 [BLOCO DA ENTREGA / MOTOBOY]');
    linhas.push('----------------------------------------');
    linhas.push(`CLIENTE: ${cliente.nome?.trim() || 'Não informado'}`);
    linhas.push(`TELEFONE: ${cliente.telefone?.trim() || 'Não informado'}`);
    linhas.push('');
    linhas.push('ENDEREÇO DE ENTREGA:');
    const ruaNum = `${endereco.logradouro?.trim() || ''}, Nº ${endereco.numero?.trim() || 'S/N'}`;
    linhas.push(`Rua/Av: ${ruaNum}`);
    
    const bairroExibido = (endereco.bairro?.trim() || entregaInfo.bairro || '').toUpperCase();
    linhas.push(`BAIRRO: ${bairroExibido || 'A CONFIRMAR'}`);

    if (endereco.complemento?.trim()) {
      linhas.push(`Complemento: ${endereco.complemento.trim()}`);
    }
    if (endereco.referencia?.trim()) {
      linhas.push(`Ponto de Referência: ${endereco.referencia.trim()}`);
    }
    linhas.push(`Cidade: ${endereco.cidade?.trim() || 'Cuiabá'} — ${endereco.estado?.trim() || 'MT'}`);
    if (endereco.cep?.trim()) {
      linhas.push(`CEP: ${endereco.cep.trim()}`);
    }
  } else {
    linhas.push('========================================');
    linhas.push('🏪 [BLOCO DA RETIRADA / BALCÃO]');
    linhas.push('----------------------------------------');
    linhas.push(`CLIENTE: ${cliente.nome?.trim() || 'Não informado'}`);
    linhas.push(`TELEFONE: ${cliente.telefone?.trim() || 'Não informado'}`);
    linhas.push('');
    linhas.push(`LOCAL: ${retirada.unidade || 'Avenida Brasil, 2055, Cidade Alta, Cuiabá - MT'}`);
    const tempoRetiradaTxt = retirada.tempoEstimado || '20 a 35 min';
    linhas.push(`PREVISÃO DE RETIRADA: ${tempoRetiradaTxt}`);
    if (retirada.horarioPretendido?.trim()) {
      linhas.push(`HORÁRIO PRETENDIDO: ${retirada.horarioPretendido.trim()}`);
    }
  }

  linhas.push('');

  // ==========================================================================
  // BLOCO 3: FINANCEIRO / CAIXA (COM CÁLCULO EXATO DE TROCO)
  // ==========================================================================
  linhas.push('========================================');
  linhas.push('💵 [BLOCO FINANCEIRO / CAIXA]');
  linhas.push('----------------------------------------');
  linhas.push(`Subtotal produtos: ${formatarPreco(subtotal)}`);

  if (temItensSobConsulta) {
    linhas.push('⚠️ Contém itens sob consulta — valores parciais a confirmar.');
  }

  if (desconto > 0) {
    const rotuloPromo = promocaoInfo.titulo ? ` (${promocaoInfo.descontoPercentual}% - ${promocaoInfo.titulo})` : '';
    linhas.push(`Desconto${rotuloPromo}: -${formatarPreco(desconto)}`);
  }

  if (isEntrega) {
    if (taxaDefinida) {
      const bairroNome = entregaInfo.bairro || endereco.bairro || 'Bairro';
      linhas.push(`Taxa de entrega (${bairroNome}): ${formatarPreco(taxaEntrega)}`);
    } else {
      linhas.push('Taxa de entrega: A confirmar com a atendente');
    }
  } else {
    linhas.push('Taxa de entrega: R$ 0,00 (Retirada no balcão)');
  }

  linhas.push('----------------------------------------');
  linhas.push(`VALOR TOTAL: ${totalFinalTexto}`);
  linhas.push('----------------------------------------');

  // Detalhamento do Pagamento e Cálculo do Troco
  if (isDinheiro) {
    linhas.push('💵 FORMA DE PAGAMENTO: DINHEIRO');
    if (precisaTroco) {
      if (valorPagoInformado > totalNumerico) {
        linhas.push(`👉 TROCO PARA ${formatarPreco(valorPagoInformado)} | LEVAR ${formatarPreco(trocoALevar)} DE TROCO`);
      } else if (valorPagoInformado === totalNumerico) {
        linhas.push(`👉 PAGAMENTO EXATO EM DINHEIRO: ${formatarPreco(valorPagoInformado)} (Não precisa de troco)`);
      } else if (valorPagoInformado > 0) {
        linhas.push(`⚠️ ATENÇÃO: Troco solicitado para ${formatarPreco(valorPagoInformado)}, mas o total é ${formatarPreco(totalNumerico)}`);
      } else {
        linhas.push(`👉 TROCO SOLICITADO: Para ${pagamento.trocoPara || 'valor a combinar'}`);
      }
    } else {
      linhas.push(`👉 NÃO PRECISA DE TROCO (Receber valor exato: ${totalFinalTexto})`);
    }
  } else if (pagamento.forma === 'pix') {
    linhas.push('📱 FORMA DE PAGAMENTO: PIX');
    linhas.push('Chave Pix: 65993605364 (Celular / Don Corleone)');
    linhas.push('⚠️ STATUS: AGUARDANDO ENVIO DO COMPROVANTE');
  } else if (pagamento.forma === 'cartao_credito') {
    linhas.push('💳 FORMA DE PAGAMENTO: CARTÃO DE CRÉDITO');
    linhas.push('👉 LEVAR MAQUININHA NA ENTREGA');
    linhas.push('Bandeiras: Visa, Mastercard, American Express e Elo');
  } else if (pagamento.forma === 'cartao_debito') {
    linhas.push('💳 FORMA DE PAGAMENTO: CARTÃO DE DÉBITO');
    linhas.push('👉 LEVAR MAQUININHA NA ENTREGA');
  } else {
    linhas.push(`FORMA DE PAGAMENTO: ${(pagamento.forma || 'A combinar').toUpperCase()}`);
  }

  linhas.push('========================================');
  linhas.push('Don Corleone Cantina & Pizzaria · Cidade Alta');
  linhas.push('Avenida Brasil, 2055 — Cuiabá/MT');
  linhas.push('');
  linhas.push('Aguardo a confirmação do pedido!');

  return linhas.join('\n');
}

/**
 * Cria o link wa.me direto com a mensagem codificada
 * 
 * @param {object} config 
 * @param {object} dados 
 * @returns {string}
 */
export function gerarLinkWhatsAppPedido(config, dados) {
  const mensagem = montarMensagemWhatsApp(dados);
  const contato = config?.contato || {};
  
  const numero = contato.whatsappNumeroComDDD || "5565992650139";
  const textoCodificado = encodeURIComponent(mensagem);

  return `https://wa.me/${numero}?text=${textoCodificado}`;
}
