/**
 * Utilitário de Cálculo e Gestão de Taxas de Entrega - Don Corleone
 * 
 * Função pura e testável para regras de entrega por bairro em Cuiabá e Várzea Grande.
 */

import { formatarPreco } from './dom.js';

/**
 * Calcula a taxa de entrega baseada na modalidade e no bairro escolhido.
 * 
 * @param {'entrega' | 'retirada'} modalidade 
 * @param {string} bairroEscolhido 
 * @param {Array<{ cidade: string, bairro: string, taxa: number }>} bairrosLista 
 * @returns {{
 *   taxa: number | null,
 *   statusTaxa: 'definida' | 'a_confirmar' | 'gratis',
 *   taxaTexto: string,
 *   bairro: string,
 *   cidade: string
 * }}
 */
export function calcularTaxaEntrega(modalidade = 'entrega', bairroEscolhido = '', bairrosLista = []) {
  if (modalidade === 'retirada') {
    return {
      taxa: 0,
      statusTaxa: 'gratis',
      taxaTexto: 'Grátis (Retirada)',
      bairro: 'Cidade Alta',
      cidade: 'Cuiabá'
    };
  }

  // Se modalidade for entrega
  const bairroLimpo = (bairroEscolhido || '').trim();

  if (!bairroLimpo || bairroLimpo.toLowerCase() === 'outro') {
    return {
      taxa: null,
      statusTaxa: 'a_confirmar',
      taxaTexto: 'A confirmar com a atendente',
      bairro: 'Outro bairro (a confirmar)',
      cidade: 'Cuiabá / Várzea Grande'
    };
  }

  const encontrado = bairrosLista.find(b => 
    b.bairro.toLowerCase() === bairroLimpo.toLowerCase()
  );

  if (encontrado && typeof encontrado.taxa === 'number') {
    return {
      taxa: encontrado.taxa,
      statusTaxa: 'definida',
      taxaTexto: formatarPreco(encontrado.taxa),
      bairro: encontrado.bairro,
      cidade: encontrado.cidade
    };
  }

  return {
    taxa: null,
    statusTaxa: 'a_confirmar',
    taxaTexto: 'A confirmar com a atendente',
    bairro: bairroLimpo || 'Outro bairro (a confirmar)',
    cidade: 'Cuiabá / Várzea Grande'
  };
}
