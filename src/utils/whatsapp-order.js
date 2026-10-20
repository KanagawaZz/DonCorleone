/**
 * Formatador de Mensagens e Links para WhatsApp - Don Corleone
 * 
 * Versão Limpa, Elegante e Direta (sem repetições):
 * - Destaques em negrito padrão WhatsApp (*texto*)
 * - Divisores elegantes (━━━━━━━━━━━━━━━━━━)
 * - Seções bem delimitadas: Cabeçalho, Itens, Entrega/Retirada e Pagamento
 * - Cálculo automático de troco embutido
 */

import { formatarPreco, extrairNumeroMoeda } from './dom.js';

/**
 * Obtém a data e hora formatada no fuso de Cuiabá/MT (ex: 14/10 às 17:32)
 * @returns {string}
 */
function obterDataHoraCuiaba() {
  try {
    const formatador = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Cuiaba',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const partes = formatador.formatToParts(new Date());
    const m = {};
    for (const p of partes) m[p.type] = p.value;
    return `${m.day}/${m.month} às ${m.hour}:${m.minute}`;
  } catch (e) {
    const d = new Date();
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes} às ${hora}:${min}`;
  }
}

/**
 * Monta a mensagem otimizada e limpa para envio ao WhatsApp
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

  const divisor = '━━━━━━━━━━━━━━━━━━';
  const linhas = [];

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
  const totalParcial = temItensSobConsulta || (isEntrega && !taxaDefinida);

  // Troco para dinheiro
  const isDinheiro = pagamento.forma === 'dinheiro';
  const precisaTroco = pagamento.precisaTroco === 'sim';
  const valorPagoInformado = isDinheiro && precisaTroco ? extrairNumeroMoeda(pagamento.trocoPara) : 0;
  const trocoALevar = isDinheiro && precisaTroco && valorPagoInformado > totalNumerico 
    ? valorPagoInformado - totalNumerico 
    : 0;

  // Nome da forma de pagamento para o cabeçalho
  let pagamentoNomeCabecalho = 'Pix';
  if (isDinheiro) {
    pagamentoNomeCabecalho = 'Dinheiro';
  } else if (pagamento.forma === 'cartao_credito') {
    pagamentoNomeCabecalho = 'Cartão de Crédito';
  } else if (pagamento.forma === 'cartao_debito') {
    pagamentoNomeCabecalho = 'Cartão de Débito';
  }

  const modalidadeTexto = isEntrega ? '*Entrega* 🛵' : '*Retirada no balcão* 🏪';
  const dataHoraPedido = obterDataHoraCuiaba();

  // ==========================================
  // CABEÇALHO LIMPO E COMPACTO
  // ==========================================
  linhas.push('🍕 *DON CORLEONE — NOVO PEDIDO*');
  linhas.push('');
  linhas.push(`*Pedido:* #${codigoPedido} · ${dataHoraPedido}`);
  linhas.push(`${modalidadeTexto} · *Pagamento:* ${pagamentoNomeCabecalho}`);
  linhas.push('');

  // ==========================================
  // ITENS DO PEDIDO
  // ==========================================
  linhas.push(divisor);
  linhas.push('🍕 *ITENS DO PEDIDO*');
  linhas.push('');

  itens.forEach((item, index) => {
    const precoUnit = typeof item.precoUnitario === 'number' ? item.precoUnitario : (item.preco || 0);
    const itemSubtotal = precoUnit * (item.quantidade || 1);

    if (item.tipo === 'pizza') {
      const qtdSabores = item.sabores?.length || 1;
      const sufixoSabores = qtdSabores === 1 ? '1 sabor' : `${qtdSabores} sabores`;
      const nomeTamanho = item.tamanho?.nome || 'Pizza Grande';

      linhas.push(`*${item.quantidade}x ${nomeTamanho} — ${sufixoSabores}*`);

      (item.sabores || []).forEach(s => {
        let fracao = '';
        if (qtdSabores === 2) fracao = '½ ';
        else if (qtdSabores === 3) fracao = '⅓ ';
        linhas.push(`• ${fracao}${s.nome}`);
      });

      if (item.borda && item.borda.id !== 'sem-borda') {
        const precoBordaTxt = (typeof item.borda.preco === 'number' && item.borda.preco > 0) 
          ? ` (+${formatarPreco(item.borda.preco)})` 
          : (item.borda.precoTexto ? ` (${item.borda.precoTexto})` : '');
        linhas.push(`• Borda: ${item.borda.nome}${precoBordaTxt}`);
      }

      if (item.observacoes && item.observacoes.trim()) {
        linhas.push(`*Obs:* ${item.observacoes.trim()}`);
      }

      linhas.push(formatarPreco(itemSubtotal));
    } else {
      linhas.push(`*${item.quantidade}x ${item.nome}*`);
      if (typeof precoUnit === 'number' && precoUnit > 0) {
        linhas.push(formatarPreco(itemSubtotal));
      } else {
        linhas.push(`A confirmar (${item.precoTexto || 'Sob consulta'})`);
      }
    }

    if (index < itens.length - 1) {
      linhas.push('');
    }
  });

  if (observacoes && observacoes.trim()) {
    linhas.push('');
    linhas.push(`*Observações:* ${observacoes.trim()}`);
  }

  linhas.push('');

  // ==========================================
  // ENTREGA OU RETIRADA
  // ==========================================
  linhas.push(divisor);
  if (isEntrega) {
    linhas.push('🛵 *ENTREGA*');
    linhas.push('');
    linhas.push(`*Cliente:* ${cliente.nome?.trim() || 'Não informado'}`);
    linhas.push(`*Telefone:* ${cliente.telefone?.trim() || 'Não informado'}`);
    linhas.push('');

    const logradouro = endereco.logradouro?.trim() || '';
    const numero = endereco.numero?.trim() || 'S/N';
    const complemento = endereco.complemento?.trim() ? `, ${endereco.complemento.trim()}` : '';
    linhas.push(`${logradouro}, nº ${numero}${complemento}`);

    const bairro = endereco.bairro?.trim() || entregaInfo.bairro || 'Bairro a confirmar';
    const cidade = endereco.cidade?.trim() || 'Cuiabá';
    const estado = endereco.estado?.trim() || 'MT';
    linhas.push(`Bairro ${bairro} · ${cidade}/${estado}`);

    if (endereco.cep?.trim()) {
      linhas.push(`CEP: ${endereco.cep.trim()}`);
    }
    if (endereco.referencia?.trim()) {
      linhas.push(`*Referência:* ${endereco.referencia.trim()}`);
    }
  } else {
    linhas.push('🏪 *RETIRADA NO BALCÃO*');
    linhas.push('');
    linhas.push(`*Cliente:* ${cliente.nome?.trim() || 'Não informado'}`);
    linhas.push(`*Telefone:* ${cliente.telefone?.trim() || 'Não informado'}`);
    linhas.push('');
    linhas.push(`Unidade Cidade Alta — Av. Brasil, 2055`);
    const tempoRetiradaTxt = retirada.tempoEstimado || '20 a 35 min';
    linhas.push(`*Previsão de retirada:* ${tempoRetiradaTxt}`);
    if (retirada.horarioPretendido?.trim()) {
      linhas.push(`*Horário pretendido:* ${retirada.horarioPretendido.trim()}`);
    }
  }

  linhas.push('');

  // ==========================================
  // RESUMO DO PAGAMENTO
  // ==========================================
  linhas.push(divisor);
  linhas.push('💰 *RESUMO DO PAGAMENTO*');
  linhas.push('');
  linhas.push(`Produtos: ${formatarPreco(subtotal)}`);

  if (desconto > 0) {
    const rotuloPromo = promocaoInfo.titulo ? ` (${promocaoInfo.descontoPercentual}% - ${promocaoInfo.titulo})` : '';
    linhas.push(`Desconto${rotuloPromo}: -${formatarPreco(desconto)}`);
  }

  if (isEntrega) {
    if (taxaDefinida) {
      linhas.push(`Entrega: ${formatarPreco(taxaEntrega)}`);
    } else {
      linhas.push('Entrega: A confirmar');
    }
  } else {
    linhas.push('Entrega: R$ 0,00 (Retirada)');
  }

  linhas.push('');

  if (totalParcial) {
    const sufixo = !taxaDefinida ? ' + entrega' : ' (parcial + itens a confirmar)';
    linhas.push(`*TOTAL PARCIAL: ${formatarPreco(subtotalComDesconto)}${sufixo}*`);
  } else {
    linhas.push(`*TOTAL: ${formatarPreco(totalNumerico)}*`);
  }

  // Detalhe de troco ou instruções de pagamento
  if (isDinheiro) {
    linhas.push('');
    if (precisaTroco) {
      if (valorPagoInformado > totalNumerico) {
        linhas.push(`💵 *Troco para ${formatarPreco(valorPagoInformado)}*`);
        linhas.push(`Levar ${formatarPreco(trocoALevar)} de troco`);
      } else if (valorPagoInformado === totalNumerico) {
        linhas.push(`💵 *Pagamento exato em dinheiro*`);
        linhas.push(`Não precisa de troco (${formatarPreco(valorPagoInformado)})`);
      } else if (valorPagoInformado > 0) {
        linhas.push(`💵 *Troco solicitado para ${formatarPreco(valorPagoInformado)}*`);
        linhas.push(`⚠️ Valor menor que o total (${formatarPreco(totalNumerico)})`);
      } else {
        linhas.push(`💵 *Troco para ${pagamento.trocoPara || 'a confirmar'}*`);
      }
    } else {
      linhas.push(`💵 *Pagamento em Dinheiro (Sem troco)*`);
      linhas.push(`Receber valor exato`);
    }
  } else if (pagamento.forma === 'pix') {
    linhas.push('');
    linhas.push('📱 *Pagamento via Pix*');
    linhas.push('Chave: 65993605364 (Celular)');
    linhas.push('*Aguardando comprovante*');
  } else if (pagamento.forma === 'cartao_credito') {
    linhas.push('');
    linhas.push('💳 *Cartão de Crédito*');
    linhas.push('Levar maquininha na entrega');
  } else if (pagamento.forma === 'cartao_debito') {
    linhas.push('');
    linhas.push('💳 *Cartão de Débito*');
    linhas.push('Levar maquininha na entrega');
  }

  linhas.push('');
  linhas.push(divisor);
  linhas.push('*Don Corleone Pizzaria & Esfiharia*');
  linhas.push('Avenida Brasil, 2055 · Cidade Alta');
  linhas.push('Cuiabá/MT');

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
