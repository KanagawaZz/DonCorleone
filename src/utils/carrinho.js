/**
 * Gerenciador de Estado do Carrinho de Compras - Don Corleone
 * 
 * Suporta:
 * - Produtos simples (esfihas, sobremesas, bebidas)
 * - Pizzas personalizadas com até 3 sabores e tamanhos
 * - Edição de pizzas existentes no carrinho
 * - Recálculo de subtotais e persistência
 */

import { calcularPrecoPizza } from './calculo-pizza.js';

const STORAGE_KEY = 'don_corleone_cart_v2';

class CarrinhoStore {
  constructor() {
    this.itens = [];
    this.modalCheckoutAberto = false;
    this.modalPizzaAberto = false;
    this.pizzaEmEdicao = null;
    this.carregarDoStorage();
  }

  carregarDoStorage() {
    try {
      const salvo = sessionStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed)) {
          this.itens = parsed.filter(i => i && i.id && i.quantidade > 0);
        }
      }
    } catch (e) {
      console.warn('Não foi possível restaurar o carrinho da sessão:', e);
      this.itens = [];
    }
  }

  salvarNoStorage() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.itens));
    } catch (e) {
      console.warn('Não foi possível persistir o carrinho:', e);
    }
  }

  notificar() {
    this.salvarNoStorage();
    const evento = new CustomEvent('carrinho-atualizado', {
      detail: {
        itens: this.obterItens(),
        quantidadeTotal: this.obterQuantidadeTotal(),
        subtotal: this.obterSubtotal()
      }
    });
    window.dispatchEvent(evento);
  }

  obterItens() {
    return [...this.itens];
  }

  obterQuantidadeTotal() {
    return this.itens.reduce((total, item) => total + (item.quantidade || 0), 0);
  }

  obterSubtotal() {
    return this.itens.reduce((total, item) => {
      const precoUnit = typeof item.precoUnitario === 'number' ? item.precoUnitario : (item.preco || 0);
      return total + (precoUnit * (item.quantidade || 0));
    }, 0);
  }

  /**
   * Adiciona um produto simples ao carrinho (ex: Esfiha ou Sobremesa)
   */
  adicionarItemSimples(produto, quantidade = 1) {
    if (!produto || !produto.id) return;

    const index = this.itens.findIndex(i => i.tipo !== 'pizza' && i.idProduto === produto.id);
    if (index >= 0) {
      this.itens[index].quantidade += quantidade;
    } else {
      this.itens.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        idProduto: produto.id,
        tipo: 'simples',
        nome: produto.nome || 'Produto',
        precoUnitario: Number(produto.preco) || 0,
        foto: produto.foto || '/images/cardapio/calabresa-artesanal.jpg',
        descricao: produto.descricao || '',
        quantidade: Math.max(1, quantidade)
      });
    }

    this.notificar();
  }

  /**
   * Adiciona ou atualiza uma pizza personalizada no carrinho
   */
  salvarPizza(dadosPizza, idExistente = null) {
    const { sabores = [], tamanho = null, borda = null, quantidade = 1, observacoes = '' } = dadosPizza;
    if (sabores.length === 0) return;

    const precoUnitario = calcularPrecoPizza(sabores, tamanho, borda);
    const fotoCapa = sabores[0]?.foto || '/images/cardapio/calabresa-artesanal.png';

    if (idExistente) {
      const index = this.itens.findIndex(i => i.id === idExistente);
      if (index >= 0) {
        this.itens[index] = {
          ...this.itens[index],
          sabores: [...sabores],
          tamanho: tamanho || this.itens[index].tamanho,
          borda: borda !== undefined ? borda : this.itens[index].borda,
          precoUnitario,
          foto: fotoCapa,
          quantidade: Math.max(1, quantidade),
          observacoes: observacoes.trim()
        };
        this.notificar();
        return;
      }
    }

    // Cria nova pizza no carrinho
    this.itens.push({
      id: `pizza_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      tipo: 'pizza',
      tamanho: tamanho || { id: 'grande', nome: 'Pizza Grande', fatias: 8 },
      borda: borda || null,
      sabores: [...sabores],
      precoUnitario,
      foto: fotoCapa,
      quantidade: Math.max(1, quantidade),
      observacoes: observacoes.trim()
    });

    this.notificar();
  }

  atualizarQuantidade(id, quantidade) {
    const index = this.itens.findIndex(i => i.id === id);
    if (index >= 0) {
      if (quantidade <= 0) {
        this.itens.splice(index, 1);
      } else {
        this.itens[index].quantidade = quantidade;
      }
      this.notificar();
    }
  }

  alterarQuantidadeDelta(id, delta) {
    const item = this.itens.find(i => i.id === id);
    if (item) {
      this.atualizarQuantidade(id, item.quantidade + delta);
    }
  }

  removerItem(id) {
    this.itens = this.itens.filter(i => i.id !== id);
    this.notificar();
  }

  limparCarrinho() {
    this.itens = [];
    this.notificar();
  }

  // Controle do Modal de Montagem de Pizza
  abrirModalPizza(saborInicial = null, itemPizzaParaEditar = null) {
    this.pizzaEmEdicao = itemPizzaParaEditar || null;
    this.modalPizzaAberto = true;
    window.dispatchEvent(new CustomEvent('abrir-modal-pizza', {
      detail: { saborInicial, itemParaEditar: itemPizzaParaEditar }
    }));
  }

  fecharModalPizza() {
    this.modalPizzaAberto = false;
    this.pizzaEmEdicao = null;
    window.dispatchEvent(new CustomEvent('fechar-modal-pizza'));
  }

  // Controle do Modal de Finalização do Pedido
  abrirModalCheckout() {
    this.modalCheckoutAberto = true;
    window.dispatchEvent(new CustomEvent('abrir-modal-checkout'));
  }

  abrirModal() {
    this.abrirModalCheckout();
  }

  fecharModalCheckout() {
    this.modalCheckoutAberto = false;
    window.dispatchEvent(new CustomEvent('fechar-modal-checkout'));
  }

  fecharModal() {
    this.fecharModalCheckout();
  }
}

export const carrinho = new CarrinhoStore();
