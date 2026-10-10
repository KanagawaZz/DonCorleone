/**
 * Formatador de Mensagens e Links para WhatsApp - Don Corleone
 * 
 * Transforma os dados do formulário de pedidos em uma mensagem
 * estruturada, legível e profissional para o atendimento da pizzaria.
 */

import { formatarPreco } from './dom.js';

export function montarMensagemWhatsApp(dados) {
  const {
    itens = [],
    cliente = {},
    modalidade = 'entrega', // 'entrega' | 'retirada'
    endereco = {},
    retirada = {},
    pagamento = {},
    observacoes = ''
  } = dados;

  const linhas = [];

  // Cabeçalho
  linhas.push('🍕 NOVO PEDIDO — DON CORLEONE');
  linhas.push('Olá! Gostaria de fazer o seguinte pedido.');
  linhas.push('');

  // Cliente
  linhas.push('CLIENTE');
  linhas.push(`Nome: ${cliente.nome?.trim() || 'Não informado'}`);
  linhas.push(`Telefone: ${cliente.telefone?.trim() || 'Não informado'}`);
  linhas.push('');

  // Itens do Pedido
  linhas.push('MEU PEDIDO');
  let subtotal = 0;
  itens.forEach(item => {
    const itemSubtotal = (item.preco || 0) * (item.quantidade || 1);
    subtotal += itemSubtotal;
    linhas.push(`${item.quantidade}x ${item.nome} — ${formatarPreco(itemSubtotal)}`);
  });

  linhas.push(`Subtotal dos produtos: ${formatarPreco(subtotal)}`);

  if (modalidade === 'entrega') {
    linhas.push('Taxa de entrega: a confirmar');
    linhas.push(`Total: ${formatarPreco(subtotal)} + taxa de entrega a confirmar`);
  } else {
    linhas.push(`Total dos produtos: ${formatarPreco(subtotal)}`);
  }
  linhas.push('');

  // Modalidade
  linhas.push('MODALIDADE');
  if (modalidade === 'entrega') {
    linhas.push('Entrega (delivery)');
    linhas.push('');

    linhas.push('ENDEREÇO DE ENTREGA');
    linhas.push(`${endereco.logradouro?.trim() || ''}, ${endereco.numero?.trim() || 'S/N'}`);
    if (endereco.bairro?.trim()) {
      linhas.push(`Bairro: ${endereco.bairro.trim()}`);
    }
    if (endereco.complemento?.trim()) {
      linhas.push(`Complemento: ${endereco.complemento.trim()}`);
    }
    if (endereco.referencia?.trim()) {
      linhas.push(`Referência: ${endereco.referencia.trim()}`);
    }
    linhas.push(`${endereco.cidade?.trim() || 'Cuiabá'} — ${endereco.estado?.trim() || 'MT'}`);
    if (endereco.cep?.trim()) {
      linhas.push(`CEP: ${endereco.cep.trim()}`);
    }
  } else {
    linhas.push('Retirada no balcão — Unidade Arena Cuiabá');
    if (retirada.horarioPretendido?.trim()) {
      linhas.push(`Horário pretendido: ${retirada.horarioPretendido.trim()}`);
    }
  }
  linhas.push('');

  // Pagamento
  linhas.push('PAGAMENTO');
  const nomeFormaPagamento = {
    pix: 'Pix',
    dinheiro: 'Dinheiro',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito'
  }[pagamento.forma] || pagamento.forma || 'A combinar';

  linhas.push(`Forma: ${nomeFormaPagamento}`);

  if (pagamento.forma === 'dinheiro') {
    if (pagamento.precisaTroco === 'sim' && pagamento.trocoPara) {
      linhas.push(`Troco para: ${pagamento.trocoPara}`);
    } else {
      linhas.push('Troco: Não precisa de troco');
    }
  }
  linhas.push('');

  // Observações
  linhas.push('OBSERVAÇÕES');
  if (observacoes && observacoes.trim()) {
    linhas.push(observacoes.trim());
  } else {
    linhas.push('Sem observações.');
  }
  linhas.push('');

  // Fechamento
  linhas.push('Aguardo a confirmação do pedido. Obrigado!');

  return linhas.join('\n');
}

/**
 * Cria o link wa.me direto com a mensagem codificada
 */
export function gerarLinkWhatsAppPedido(config, dados) {
  const mensagem = montarMensagemWhatsApp(dados);
  const contato = config.contato || {};
  
  // Número oficial limpo apenas com dígitos
  const numero = contato.whatsappNumeroComDDD || "5565992650139";
  const textoCodificado = encodeURIComponent(mensagem);

  return `https://wa.me/${numero}?text=${textoCodificado}`;
}
