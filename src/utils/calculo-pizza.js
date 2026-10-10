/**
 * Utilitário de Cálculo e Regras de Preço de Pizza - Don Corleone
 * 
 * Suporta as diferentes regras comerciais da pizzaria:
 * 1. "sabor_mais_caro" (Padrão de mercado): Preço definido pelo sabor de maior valor selecionado.
 * 2. "media_proporcional": Preço calculado pela divisão proporcional dos sabores.
 * 3. "preco_fixo": Preço fixo por tamanho.
 */

import { siteConfig } from '../data/site.config.js';

export function calcularPrecoPizza(sabores = [], tamanho = null, config = siteConfig) {
  if (!Array.isArray(sabores) || sabores.length === 0) {
    return 0;
  }

  const regra = config.regrasPizza?.regraPreco || 'sabor_mais_caro';

  switch (regra) {
    case 'sabor_mais_caro': {
      const precos = sabores.map(s => Number(s.preco) || 0);
      return Math.max(...precos);
    }

    case 'media_proporcional': {
      const soma = sabores.reduce((total, s) => total + (Number(s.preco) || 0), 0);
      const media = soma / sabores.length;
      // Arredonda para centavos exatos
      return Math.round(media * 100) / 100;
    }

    case 'preco_fixo': {
      if (tamanho && typeof tamanho.preco === 'number') {
        return tamanho.preco;
      }
      return Number(sabores[0]?.preco) || 0;
    }

    default: {
      const precos = sabores.map(s => Number(s.preco) || 0);
      return Math.max(...precos);
    }
  }
}

/**
 * Retorna o título formatado da pizza com a quantidade de sabores
 * Ex: "Pizza Grande — 2 Sabores" ou "Pizza Grande — 1 Sabor"
 */
export function formatarTituloPizza(pizza, config = siteConfig) {
  const qtdSabores = pizza.sabores?.length || 1;
  const nomeTamanho = pizza.tamanho?.nome || 'Pizza';
  const sufixoSabores = qtdSabores === 1 ? '1 Sabor' : `${qtdSabores} Sabores`;
  return `${nomeTamanho} — ${sufixoSabores}`;
}

/**
 * Retorna a lista legível dos sabores selecionados
 */
export function formatarSaboresDescricao(sabores = []) {
  if (!Array.isArray(sabores) || sabores.length === 0) return '';
  return sabores.map(s => s.nome).join(' + ');
}
