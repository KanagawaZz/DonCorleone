/**
 * Formatador de Mensagens e Links para WhatsApp - Don Corleone
 * 
 * Transforma o carrinho e os dados de finalização em uma mensagem
 * estruturada, legível e profissional para o WhatsApp da Don Corleone.
 */

import { formatarPreco } from './dom.js';
import { formatarTituloPizza } from './calculo-pizza.js';

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

  // 1. Dados do Cliente
  linhas.push('DADOS DO CLIENTE');
  linhas.push(`Nome: ${cliente.nome?.trim() || 'Não informado'}`);
  linhas.push(`Telefone: ${cliente.telefone?.trim() || 'Não informado'}`);
  linhas.push('');

  // 2. Itens do Pedido
  linhas.push('ITENS DO PEDIDO');
  let subtotal = 0;

  itens.forEach((item, index) => {
    const precoUnit = typeof item.precoUnitario === 'number' ? item.precoUnitario : (item.preco || 0);
    const itemSubtotal = precoUnit * (item.quantidade || 1);
    subtotal += itemSubtotal;

    if (item.tipo === 'pizza') {
      const qtdSabores = item.sabores?.length || 1;
      const sufixoSabores = qtdSabores === 1 ? '1 sabor' : `${qtdSabores} sabores`;
      const nomeTamanho = item.tamanho?.nome || 'Pizza Grande';
      
      linhas.push(`${item.quantidade}x ${nomeTamanho} — ${sufixoSabores}`);
      (item.sabores || []).forEach(s => {
        linhas.push(`  • ${s.nome}`);
      });
      linhas.push(`Valor da pizza: ${formatarPreco(precoUnit)}`);
      if (item.observacoes) {
        linhas.push(`Obs: ${item.observacoes}`);
      }
    } else {
      linhas.push(`${item.quantidade}x ${item.nome}`);
      linhas.push(`Valor unitário: ${formatarPreco(precoUnit)}`);
      linhas.push(`Subtotal: ${formatarPreco(itemSubtotal)}`);
    }

    if (index < itens.length - 1) {
      linhas.push('');
    }
  });

  linhas.push('');

  // 3. Resumo Financeiro
  linhas.push('RESUMO FINANCEIRO');
  linhas.push(`Subtotal dos produtos: ${formatarPreco(subtotal)}`);

  if (modalidade === 'entrega') {
    linhas.push('Taxa de entrega: a confirmar');
    linhas.push(`Total: ${formatarPreco(subtotal)} + taxa de entrega a confirmar`);
  } else {
    linhas.push(`Total dos produtos: ${formatarPreco(subtotal)}`);
  }
  linhas.push('');

  // 4. Modalidade
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

  // 5. Pagamento
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
      linhas.push('Troco: Não preciso de troco');
    }
  }
  linhas.push('');

  // 6. Observações
  linhas.push('OBSERVAÇÕES');
  if (observacoes && observacoes.trim()) {
    linhas.push(observacoes.trim());
  } else {
    linhas.push('Sem observações.');
  }
  linhas.push('');

  // 7. Fechamento
  linhas.push('Aguardo a confirmação do pedido. Obrigado!');

  return linhas.join('\n');
}

/**
 * Cria o link wa.me direto com a mensagem codificada
 */
export function gerarLinkWhatsAppPedido(config, dados) {
  const mensagem = montarMensagemWhatsApp(dados);
  const contato = config.contato || {};
  
  const numero = contato.whatsappNumeroComDDD || "5565992650139";
  const textoCodificado = encodeURIComponent(mensagem);

  return `https://wa.me/${numero}?text=${textoCodificado}`;
}
