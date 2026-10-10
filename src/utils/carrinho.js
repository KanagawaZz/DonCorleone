/**
 * Gerenciador de Estado do Carrinho de Compras - Don Corleone
 * 
 * Permite adicionar produtos, alterar quantidades, remover itens e
 * sincronizar o estado em tempo real com todos os componentes da aplicação.
 */

const STORAGE_KEY = 'don_corleone_cart_v1';

class CarrinhoStore {
  constructor() {
    this.itens = [];
    this.modalAberto = false;
    this.itemPreSelecionado = null;
    this.carregarDoStorage();
  }

  carregarDoStorage() {
    try {
      const salvo = sessionStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed)) {
          this.itens = parsed.filter(i => i && i.id && i.quantidade > 0 && typeof i.preco === 'number');
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
        subtotal: this.obterSubtotal(),
        modalAberto: this.modalAberto
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
    return this.itens.reduce((total, item) => total + ((item.preco || 0) * (item.quantidade || 0)), 0);
  }

  adicionarItem(produto, quantidade = 1) {
    if (!produto || !produto.id) return;

    const index = this.itens.findIndex(i => i.id === produto.id);
    if (index >= 0) {
      this.itens[index].quantidade += quantidade;
    } else {
      this.itens.push({
        id: produto.id,
        nome: produto.nome || 'Produto',
        preco: Number(produto.preco) || 0,
        foto: produto.foto || '/images/cardapio/calabresa-artesanal.jpg',
        descricao: produto.descricao || '',
        quantidade: Math.max(1, quantidade)
      });
    }

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

  abrirModal(produtoParaAdicionar = null) {
    if (produtoParaAdicionar) {
      this.adicionarItem(produtoParaAdicionar, 1);
    }
    this.modalAberto = true;
    window.dispatchEvent(new CustomEvent('abrir-modal-pedido', {
      detail: { produto: produtoParaAdicionar }
    }));
  }

  fecharModal() {
    this.modalAberto = false;
    window.dispatchEvent(new CustomEvent('fechar-modal-pedido'));
  }
}

export const carrinho = new CarrinhoStore();
