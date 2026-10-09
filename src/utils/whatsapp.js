/**
 * Utilitário para geração de links e mensagens do WhatsApp
 * 
 * Se whatsappNumeroComDDD estiver configurado (ex: "5565992650139"),
 * gera link com parâmetro de texto codificado (https://wa.me/5565992650139?text=...).
 * 
 * Se for null, preserva com segurança o link direto da Don Corleone (https://wa.me/message/5MOA5LPC4SEMH1)
 * garantindo que nenhum botão quebre.
 */

export function gerarLinkWhatsApp(config, opcoes = {}) {
  const { modalidade = 'entrega', item = null } = opcoes;
  const contato = config.contato || {};

  // Se houver número de telefone com DDD configurado
  if (contato.whatsappNumeroComDDD) {
    let mensagem = "";
    if (item) {
      const template = contato.mensagens?.item || "Olá! Gostaria de pedir: {item}. Será para {modalidade}.";
      mensagem = template
        .replace('{item}', item)
        .replace('{modalidade}', modalidade === 'retirada' ? 'retirada' : 'entrega');
    } else {
      const template = contato.mensagens?.geral || "Olá! Vim pelo site da Don Corleone e gostaria de fazer um pedido para {modalidade}.";
      mensagem = template
        .replace('{modalidade}', modalidade === 'retirada' ? 'retirada' : 'entrega');
    }

    return `https://wa.me/${contato.whatsappNumeroComDDD}?text=${encodeURIComponent(mensagem)}`;
  }

  // Fallback seguro para o link direto oficial
  return contato.whatsappLinkOriginal || "https://wa.me/message/5MOA5LPC4SEMH1";
}
