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

export function extrairNumeroMoeda(str) {
  if (typeof str === 'number') return isNaN(str) ? 0 : str;
  if (!str) return 0;
  const limpo = String(str).replace(/[^\d,.-]/g, '').trim();
  if (!limpo) return 0;
  if (limpo.includes(',')) {
    const semPontos = limpo.replace(/\./g, '');
    const comPonto = semPontos.replace(',', '.');
    const num = parseFloat(comPonto);
    return isNaN(num) ? 0 : num;
  }
  const num = parseFloat(limpo);
  return isNaN(num) ? 0 : num;
}

