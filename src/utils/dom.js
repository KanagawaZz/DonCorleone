/**
 * Helpers DOM e formatação
 */

export const $ = (seletor, contexto = document) => contexto.querySelector(seletor);
export const $$ = (seletor, contexto = document) => Array.from(contexto.querySelectorAll(seletor));

export function formatarPreco(valor) {
  if (typeof valor !== 'number' || isNaN(valor)) return '';
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
