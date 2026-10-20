/**
 * Utilitário de Cálculo e Regras de Preço de Pizza - Don Corleone
 * 
 * Suporta as diferentes regras comerciais da pizzaria:
 * 1. "sabor_mais_caro" (Padrão de mercado): Preço definido pelo sabor de maior valor selecionado.
 * 2. "media_proporcional": Preço calculado pela divisão proporcional dos sabores.
 * 3. "preco_fixo": Preço fixo por tamanho.
 */

import { siteConfig } from '../data/site.config.js';

/**
 * Tabela Oficial de Preços por Tamanho e Categoria (Cardápio Físico)
 * P: 25 cm (4 fatias, até 2 sabores)
 * M: 30 cm (6 fatias, até 2 sabores)
 * G: 35 cm (8 fatias, até 3 sabores)
 */
const TABELA_PRECOS_PIZZA = {
  tradicional: {
    pequena: 45.90,
    media: 62.90,
    grande: 76.90
  },
  premium: {
    pequena: 61.90,
    media: 72.90,
    grande: 86.90
  }
};

/**
 * Identifica se um sabor é classificado como Premium / Especial
 */
export function isSaborPremium(sabor = {}) {
  if (!sabor) return false;
  if (sabor.categoriaPreco === 'premium' || sabor.isPremium) return true;
  if (sabor.categoriaPreco === 'tradicional') return false;

  const id = (sabor.id || '').toLowerCase();
  const nome = (sabor.nome || '').toLowerCase();

  // Don Corleone e Sertaneja são listados como TRADICIONAIS no cardápio físico
  if (id.includes('don-corleone') || id.includes('sertaneja') || nome.includes('don corleone') || nome.includes('sertaneja')) {
    return false;
  }

  // Sabores explicitamente Premium no cardápio físico:
  // Strogonoff de Frango, Americana, Moda do Chef (Carne Seca), Cuiabana (Pantaneira)
  if (
    id.includes('strogonoff') || nome.includes('strogonoff') ||
    id.includes('americana') || nome.includes('americana') ||
    id.includes('moda-do-chef') || nome.includes('moda do chef') ||
    id.includes('cuiabana') || nome.includes('cuiabana')
  ) {
    return true;
  }

  const tag = (sabor.tag || '').toLowerCase();
  return tag.includes('premium') || tag.includes('chef selection');
}

/**
 * Retorna o preço individual do sabor para o tamanho selecionado
 */
export function obterPrecoSaborTamanho(sabor, tamanhoId = 'grande') {
  const tid = (tamanhoId || 'grande').toLowerCase();
  if (sabor?.precos && typeof sabor.precos[tid] === 'number') {
    return sabor.precos[tid];
  }
  const isPrem = isSaborPremium(sabor);
  const tabela = isPrem ? TABELA_PRECOS_PIZZA.premium : TABELA_PRECOS_PIZZA.tradicional;
  return tabela[tid] || (isPrem ? 86.90 : 76.90);
}

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

  const tamanhoId = (tamanho?.id || 'grande').toLowerCase();
  const regra = cfg?.regrasPizza?.regraPreco || 'sabor_mais_caro';
  let precoBase = 0;

  const precosSabores = sabores.map(s => {
    if (s.precos && typeof s.precos[tamanhoId] === 'number') {
      return s.precos[tamanhoId];
    }
    return obterPrecoSaborTamanho(s, tamanhoId);
  });

  switch (regra) {
    case 'sabor_mais_caro': {
      precoBase = Math.max(...precosSabores);
      break;
    }

    case 'media_proporcional': {
      const soma = precosSabores.reduce((total, p) => total + p, 0);
      const media = soma / precosSabores.length;
      precoBase = Math.round(media * 100) / 100;
      break;
    }

    case 'preco_fixo': {
      if (tamanho && typeof tamanho.preco === 'number') {
        precoBase = tamanho.preco;
      } else {
        precoBase = precosSabores[0] || 76.90;
      }
      break;
    }

    default: {
      precoBase = Math.max(...precosSabores);
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
