/**
 * Utilitário de Cálculo e Regras de Preço de Pizza - Don Corleone
 * 
 * Suporta as diferentes regras comerciais da pizzaria:
 * 1. "sabor_mais_caro" (Padrão de mercado): Preço definido pelo sabor de maior valor selecionado.
 * 2. "media_proporcional": Preço calculado pela divisão proporcional dos sabores.
 * 3. "preco_fixo": Preço fixo por tamanho.
 */

import { siteConfig } from '../data/site.config.js';

export function calcularPrecoPizza(sabores = [], tamanho = null, borda = null, config = siteConfig) {
  if (!Array.isArray(sabores) || sabores.length === 0) {
    return 0;
  }

  // Compatibilidade caso o 3º argumento seja o objeto de configuração
  let bordaObj = borda;
  let cfg = config;
  if (borda && !borda.id && typeof borda.regrasPizza === 'object') {
    cfg = borda;
    bordaObj = null;
  }

  const regra = cfg?.regrasPizza?.regraPreco || 'sabor_mais_caro';
  let precoBase = 0;

  switch (regra) {
    case 'sabor_mais_caro': {
      const precos = sabores.map(s => Number(s.preco) || 0);
      precoBase = Math.max(...precos);
      break;
    }

    case 'media_proporcional': {
      const soma = sabores.reduce((total, s) => total + (Number(s.preco) || 0), 0);
      const media = soma / sabores.length;
      precoBase = Math.round(media * 100) / 100;
      break;
    }

    case 'preco_fixo': {
      if (tamanho && typeof tamanho.preco === 'number') {
        precoBase = tamanho.preco;
      } else {
        precoBase = Number(sabores[0]?.preco) || 0;
      }
      break;
    }

    default: {
      const precos = sabores.map(s => Number(s.preco) || 0);
      precoBase = Math.max(...precos);
      break;
    }
  }

  // Adiciona o valor da borda se tiver preço numérico (ex: R$ 9,90)
  const precoBorda = (bordaObj && typeof bordaObj.preco === 'number') ? bordaObj.preco : 0;
  return precoBase + precoBorda;
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

/**
 * Retorna a descrição legível da borda selecionada
 */
export function formatarBordaDescricao(borda = null) {
  if (!borda || borda.id === 'sem-borda') return '';
  if (typeof borda.preco === 'number' && borda.preco > 0) {
    return `${borda.nome} (+R$ ${borda.preco.toFixed(2).replace('.', ',')})`;
  }
  if (borda.precoTexto) {
    return `${borda.nome} (${borda.precoTexto})`;
  }
  return borda.nome || '';
}
