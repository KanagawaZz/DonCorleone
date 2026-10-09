/*
 * links.js — Utilidades de links: geração centralizada de URLs do WhatsApp e validação de URLs/caminhos.
 * Não toca no DOM. Usado por content.js e cardapio.js.
 */

/** Mantém só dígitos; devolve '' se o número não parecer válido (10 a 15 dígitos). */
export function normalizePhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15 ? digits : '';
}

export function hasWhatsapp(config) {
  return normalizePhone(config.contato.whatsapp) !== '';
}

/**
 * Link de pedido. Sem `produto`: mensagem padrão geral.
 * Com `produto`: mensagem específica com nome da pizzaria e da pizza.
 * Retorna '' quando não há número válido (o chamador deve desativar o CTA).
 */
export function buildOrderUrl(config, produto) {
  const phone = normalizePhone(config.contato.whatsapp);
  if (!phone) return '';
  const pizzaria = config.identidade.nome;
  const text = produto
    ? config.contato.mensagemProduto.replaceAll('{pizzaria}', pizzaria).replaceAll('{produto}', produto.nome)
    : `${config.contato.mensagemPadrao} — ${pizzaria}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

/** Aceita apenas http(s). Retorna '' para qualquer outra coisa (javascript:, data: etc.). */
export function safeExternalUrl(value) {
  try {
    const url = new URL(String(value ?? ''));
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '';
  } catch {
    return '';
  }
}

/** Valida um caminho de imagem: relativo ao site (sem esquema) ou http(s). */
export function safeImagePath(value) {
  const v = String(value ?? '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return safeExternalUrl(v);
  return /^[\w\-./%@]+$/.test(v) && !v.includes('..') ? v : '';
}
