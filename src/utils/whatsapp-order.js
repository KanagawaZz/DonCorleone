/**
 * Formatador de Mensagens e Links para WhatsApp - Don Corleone
 * 
 * Otimizado para atendimento ágil:
 * - 1ª linha compacta e legível em 3 segundos pela atendente
 * - Blocos limpos, sem excesso de emojis
 * - encodeURIComponent com codificação segura para acentos e quebras
 */

import { formatarPreco } from './dom.js';

/**
 * Monta o texto padronizado do pedido para envio via WhatsApp.
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
    retirada = {},          // { unidade, horarioPretendido }
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
  const taxaEntrega = isEntrega ? entregaInfo.taxa : 0;
  const taxaDefinida = typeof taxaEntrega === 'number';
  const temItensSobConsulta = itens.some(i => (typeof i.precoUnitario !== 'number' && typeof i.preco !== 'number') || (!i.preco && i.tipo !== 'pizza'));

  let totalFinalTexto = '';
  let totalCabecalhoTexto = '';

  if (temItensSobConsulta) {
    totalFinalTexto = `${formatarPreco(subtotalComDesconto)} (parcial + itens a confirmar)`;
    totalCabecalhoTexto = `${formatarPreco(subtotalComDesconto)} (+ a confirmar)`;
  } else if (taxaDefinida) {
    const totalNumerico = subtotalComDesconto + taxaEntrega;
    totalFinalTexto = formatarPreco(totalNumerico);
    totalCabecalhoTexto = formatarPreco(totalNumerico);
  } else {
    totalFinalTexto = `${formatarPreco(subtotalComDesconto)} (+ taxa a confirmar)`;
    totalCabecalhoTexto = `${formatarPreco(subtotalComDesconto)} (+ taxa)`;
  }

  // Nomes curtos para o cabeçalho de 3 segundos
  const modalidadeBadge = isEntrega ? 'ENTREGA' : 'RETIRADA';
  
  const pagamentoBadge = {
    pix: 'PIX',
    dinheiro: 'DINHEIRO',
    cartao_credito: 'CARTÃO CRÉDITO',
    cartao_debito: 'CARTÃO DÉBITO'
  }[pagamento.forma] || 'PAGAMENTO A COMBINAR';

  const linhas = [];

  // ==========================================
  // LINHA 1 (ESSENCIAL PARA LEITURA EM 3 SEGUNDOS)
  // ==========================================
  linhas.push(`🍕 #${codigoPedido} | ${modalidadeBadge} | ${pagamentoBadge} | ${totalCabecalhoTexto}`);
  linhas.push('');

  // ==========================================
  // CLIENTE
  // ==========================================
  linhas.push('CLIENTE');
  linhas.push(`Nome: ${cliente.nome?.trim() || 'Não informado'}`);
  linhas.push(`Telefone: ${cliente.telefone?.trim() || 'Não informado'}`);
  linhas.push('');

  // ==========================================
  // ITENS DO PEDIDO
  // ==========================================
  linhas.push('ITENS DO PEDIDO');
  itens.forEach((item, index) => {
    const precoUnit = typeof item.precoUnitario === 'number' ? item.precoUnitario : (item.preco || 0);
    const itemSubtotal = precoUnit * (item.quantidade || 1);

    if (item.tipo === 'pizza') {
      const qtdSabores = item.sabores?.length || 1;
      const sufixoSabores = qtdSabores === 1 ? '1 sabor' : `${qtdSabores} sabores`;
      const nomeTamanho = item.tamanho?.nome || 'Pizza Grande';

      linhas.push(`${item.quantidade}x ${nomeTamanho} — ${sufixoSabores}`);
      (item.sabores || []).forEach(s => {
        linhas.push(`  • ${s.nome}`);
      });
      if (item.borda && item.borda.id !== 'sem-borda') {
        const precoBordaTxt = (typeof item.borda.preco === 'number' && item.borda.preco > 0) 
          ? ` (+${formatarPreco(item.borda.preco)})` 
          : (item.borda.precoTexto ? ` (${item.borda.precoTexto})` : '');
        linhas.push(`  • Borda: ${item.borda.nome}${precoBordaTxt}`);
      }
      linhas.push(`Valor: ${formatarPreco(itemSubtotal)}`);
      if (item.observacoes) {
        linhas.push(`Obs: ${item.observacoes}`);
      }
    } else {
      linhas.push(`${item.quantidade}x ${item.nome}`);
      if (typeof precoUnit === 'number' && precoUnit > 0) {
        linhas.push(`Valor: ${formatarPreco(itemSubtotal)} (${formatarPreco(precoUnit)} cada)`);
      } else {
        linhas.push(`Valor: A confirmar com a atendente (${item.precoTexto || 'Sob consulta'})`);
      }
    }

    if (index < itens.length - 1) {
      linhas.push('');
    }
  });
  linhas.push('');

  // ==========================================
  // RESUMO FINANCEIRO
  // ==========================================
  linhas.push('RESUMO FINANCEIRO');
  linhas.push(`Subtotal: ${formatarPreco(subtotal)}`);

  if (temItensSobConsulta) {
    linhas.push('⚠️ Contém itens sob consulta — preços de combos/itens a confirmar com a atendente.');
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
      linhas.push('Taxa de entrega: a confirmar com a atendente');
    }
  } else {
    linhas.push('Taxa de entrega: R$ 0,00 (Retirada no balcão)');
  }

  linhas.push(`TOTAL: ${totalFinalTexto}`);
  linhas.push('');

  // ==========================================
  // ENTREGA OU RETIRADA
  // ==========================================
  if (isEntrega) {
    linhas.push('ENTREGA (DELIVERY)');
    const ruaNum = `${endereco.logradouro?.trim() || ''}, ${endereco.numero?.trim() || 'S/N'}`;
    linhas.push(`Endereço: ${ruaNum}`);
    
    const bairroExibido = endereco.bairro?.trim() || entregaInfo.bairro || '';
    if (bairroExibido) {
      linhas.push(`Bairro: ${bairroExibido}`);
    }
    if (endereco.complemento?.trim()) {
      linhas.push(`Complemento: ${endereco.complemento.trim()}`);
    }
    if (endereco.referencia?.trim()) {
      linhas.push(`Referência: ${endereco.referencia.trim()}`);
    }
    linhas.push(`Cidade: ${endereco.cidade?.trim() || 'Cuiabá'} — ${endereco.estado?.trim() || 'MT'}`);
    if (endereco.cep?.trim()) {
      linhas.push(`CEP: ${endereco.cep.trim()}`);
    }
  } else {
    linhas.push('RETIRADA NO BALCÃO');
    linhas.push(`Local: ${retirada.unidade || 'Avenida Brasil, 2055, Cidade Alta, Cuiabá - MT'}`);
    const tempoRetiradaTxt = retirada.tempoEstimado || '20 a 35 min';
    linhas.push(`Tempo médio de preparo: ${tempoRetiradaTxt}`);
    if (retirada.horarioPretendido?.trim()) {
      linhas.push(`Horário pretendido: ${retirada.horarioPretendido.trim()}`);
    }
  }
  linhas.push('');

  // ==========================================
  // PAGAMENTO
  // ==========================================
  linhas.push('PAGAMENTO');
  if (pagamento.forma === 'pix') {
    linhas.push('Forma: Pix');
    linhas.push('⚠️ AGUARDANDO COMPROVANTE');
  } else if (pagamento.forma === 'dinheiro') {
    linhas.push('Forma: Dinheiro');
    if (pagamento.precisaTroco === 'sim' && pagamento.trocoPara) {
      linhas.push(`Troco: Troco para ${pagamento.trocoPara}`);
    } else {
      linhas.push('Troco: Sem troco');
    }
  } else if (pagamento.forma === 'cartao_credito') {
    linhas.push('Forma: Cartão de Crédito (levar maquininha)');
  } else if (pagamento.forma === 'cartao_debito') {
    linhas.push('Forma: Cartão de Débito (levar maquininha)');
  } else {
    linhas.push(`Forma: ${pagamento.forma || 'A combinar'}`);
  }
  linhas.push('');

  // ==========================================
  // OBSERVAÇÕES
  // ==========================================
  if (observacoes && observacoes.trim()) {
    linhas.push('OBSERVAÇÕES');
    linhas.push(observacoes.trim());
    linhas.push('');
  }

  // ==========================================
  // FECHAMENTO
  // ==========================================
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
