/*
 * config.js — ÚNICA fonte de verdade dos dados comerciais e parâmetros ajustáveis.
 * Não contém lógica de DOM nem de animação. Também é lido pelo vite.config.js
 * (SEO estático no build), portanto deve continuar sendo um objeto de dados puro.
 *
 * ATENÇÃO: todos os textos, preços, produtos, endereço, horários e redes sociais abaixo
 * são DEMONSTRATIVOS. O proprietário precisa confirmar/substituir cada um antes de publicar.
 * Cores globais ficam em css/base.css (não aqui).
 */

export const config = {
  /* ───────────────────────── IDENTIDADE ───────────────────────── */
  identidade: {
    nome: 'DonCorleone', // EDITAR AQUI — nome exibido no site
    slogan: 'Pizzaria artesanal', // EDITAR AQUI
    seo: {
      titulo: 'DonCorleone — Pizzaria artesanal | Peça pelo WhatsApp', // EDITAR AQUI
      descricao:
        'Pizzas artesanais com ambiente de cinema clássico italiano. Veja o cardápio e faça seu pedido pelo WhatsApp.', // EDITAR AQUI
      /** Caminho do arquivo de compartilhamento (ideal: JPG/PNG 1200x630). Vazio = sem og:image. */
      imagemCompartilhamento: '', // EDITAR AQUI — ex.: 'assets/img/og.jpg'
      /** URL final do site (necessária para og:url/canonical). Ex.: 'https://doncorleone.com.br/' */
      urlSite: '', // EDITAR AQUI antes de publicar
    },
    logo: 'assets/img/logo.svg', // EDITAR AQUI — troque o arquivo mantendo o caminho
    favicon: 'assets/img/favicon.svg',
    imagens: {
      /** Imagem exibida enquanto a cena 3D carrega ou quando o WebGL não está disponível. */
      hero: 'assets/img/hero-pizza.svg', // EDITAR AQUI — pode ser .webp/.avif (ex.: hero-pizza.webp)
      /** Foto da seção "A casa". Vazio ou ausente = composição gráfica no lugar. */
      historia: '', // EDITAR AQUI (opcional) — ex.: 'assets/img/historia.webp'
    },
    hero: {
      selo: 'Desde sempre, uma oferta que você não recusa', // EDITAR AQUI — texto demonstrativo
      titulo: 'Uma pizza que você não vai recusar.', // EDITAR AQUI
      subtitulo:
        'Massa artesanal, forno quente e ingredientes escolhidos a dedo. Entre na casa e escolha a sua.', // EDITAR AQUI
      ctaPrimario: 'Ver o cardápio',
      ctaSecundario: 'Fazer pedido',
    },
    /** Cena 2 — assinatura da casa */
    assinatura: {
      numero: 'I',
      rotulo: 'A assinatura da casa',
      frase: 'Aqui, a pizza é assunto de família.', // EDITAR AQUI
      texto:
        'Cada pizza sai do forno como um pequeno ritual: massa descansada, molho simples, queijo no ponto e o respeito pelo ingrediente.', // EDITAR AQUI — demonstrativo
    },
    /** Cena 3 — pizza em destaque; um passo por camada (a ordem segue a camada 3D, de baixo para cima) */
    etapas: {
      numero: 'II',
      rotulo: 'Camada por camada',
      titulo: 'Anatomia de uma DonCorleone',
      passos: [
        { titulo: 'A massa', texto: 'Base artesanal de fermentação lenta, borda alta e crocante por fora.' },
        { titulo: 'O molho', texto: 'Tomate maduro, azeite e sal. Simples como deve ser.' },
        { titulo: 'O queijo', texto: 'Mussarela derretida até dourar nas bordas.' },
        { titulo: 'Os ingredientes', texto: 'Calabresa em rodelas finas, escolhida para cada sabor da casa.' },
        { titulo: 'O toque final', texto: 'Manjericão fresco e orégano, só depois que sai do forno.' },
      ],
    },
    cardapio: {
      numero: 'III',
      rotulo: 'O cardápio',
      titulo: 'Escolha a sua',
      aviso: 'Itens e preços demonstrativos — confirme com a casa.', // EDITAR AQUI (ou deixe vazio '')
      todas: 'Todas',
      vazio: 'Nenhuma pizza disponível nesta categoria no momento.',
      botaoPedir: 'Pedir',
    },
    historia: {
      numero: 'IV',
      rotulo: 'A casa',
      titulo: 'Tradição à mesa, sem pressa.', // EDITAR AQUI
      paragrafos: [
        'Texto demonstrativo: conte aqui a história real da DonCorleone — quem começou, de onde vêm as receitas e o que torna a casa única.',
        'Texto demonstrativo: fale do forno, da massa e dos ingredientes que o cliente encontra em cada pizza.',
      ],
      assinatura: 'A Família DonCorleone',
      destaques: [
        { valor: 'Massa', rotulo: 'artesanal' }, // EDITAR AQUI — não use números/prêmios que não sejam reais
        { valor: 'Forno', rotulo: 'sempre quente' },
        { valor: 'Pedido', rotulo: 'direto no WhatsApp' },
      ],
    },
    final: {
      numero: 'V',
      rotulo: 'Faça seu pedido',
      titulo: 'Peça a sua pizza.', // EDITAR AQUI
      texto: 'Escolha a pizza, envie a mensagem e confirme os detalhes direto com a casa.',
      botao: 'Pedir pelo WhatsApp',
      semWhatsapp: 'Pedidos pelo WhatsApp indisponíveis no momento.',
    },
    rodape: 'Imagens e informações demonstrativas — confirme com a casa.', // EDITAR AQUI
  },

  /* ───────────────────────── ANIMAÇÃO ───────────────────────── */
  animacao: {
    scroll: {
      suavidade: 1.1, // EDITAR AQUI — duração do Lenis em segundos (menor = mais direto)
      sensibilidadeRoda: 1, // multiplicador da roda do mouse
      ativarScrollSuave: true, // false = rolagem 100% nativa
    },
    duracao: 1, // EDITAR AQUI — multiplicador geral das animações de entrada (1 = padrão)
    intensidade: 1, // EDITAR AQUI — multiplicador dos deslocamentos (0 = sem movimento)
    parallax: {
      distancia: 60, // EDITAR AQUI — px máximos de deslocamento do parallax
    },
    pizza: {
      escala: 1, // EDITAR AQUI — multiplicador do tamanho da pizza
      rotacaoVoltas: 1.25, // EDITAR AQUI — voltas completas ao longo do scroll
      giroOcioso: 0.12, // EDITAR AQUI — rad/s de giro lento no hero (0 = parado)
      separacao: 1, // EDITAR AQUI — multiplicador da distância entre camadas
      /** Quantidade de rodelas de calabresa no topo da pizza 3D (reduzido automaticamente em qualidade baixa). */
      rodelasCalabresa: 14, // EDITAR AQUI
      folhasManjericao: 7, // EDITAR AQUI
    },
    cena3d: {
      ativar: true, // EDITAR AQUI — false = usa só a alternativa estática
      /**
       * 'auto' | 'alto' | 'medio' | 'baixo' | 'estatico'
       * auto = escolhe pelo dispositivo (CPU, memória, economia de dados, rede, ponteiro).
       */
      qualidade: 'auto', // EDITAR AQUI
      ativarNoMobile: true, // EDITAR AQUI — false = celulares usam alternativa estática
      limiteFpsBaixa: 30,
    },
  },

  /* ───────────────────────── TEMA ───────────────────────── */
  tema: {
    // Cores usadas SOMENTE pela cena 3D (WebGL não lê variáveis CSS).
    cena3d: {
      massa: '#c98c4a',
      massaQueimada: '#5a2f12',
      molho: '#7d1a10',
      queijo: '#f1cf84',
      queijoDourado: '#c9892f',
      calabresa: '#74241a',
      calabresaBorda: '#4a140c',
      manjericao: '#2f5d2a',
      luzPrincipal: '#ffd7a0',
      luzContorno: '#8a1c2b',
    },
  },

  /* ───────────────────────── CONTATO E OPERAÇÃO ───────────────────────── */
  contato: {
    /** Somente dígitos, formato internacional. Ex.: Brasil (55) + DDD (11) + número. Vazio = pedidos desativados. */
    whatsapp: '5511999999999', // EDITAR AQUI — número DEMONSTRATIVO
    mensagemPadrao: 'Olá! Gostaria de fazer um pedido.', // EDITAR AQUI
    /** {pizzaria} e {produto} são substituídos automaticamente. */
    mensagemProduto: 'Olá, {pizzaria}! Gostaria de pedir a pizza {produto}.', // EDITAR AQUI
    endereco: 'Rua Exemplo, 123 — Bairro, Cidade/UF', // EDITAR AQUI — demonstrativo
    linkMapa: '', // EDITAR AQUI — ex.: 'https://maps.google.com/?q=...'
    horarios: [
      { dia: 'Terça a quinta', horas: '18h às 23h' }, // EDITAR AQUI — demonstrativo
      { dia: 'Sexta a domingo', horas: '18h às 00h' },
      { dia: 'Segunda', horas: 'Fechado' },
    ],
    redes: [
      // EDITAR AQUI — remova o que não usar. Só links https:// são aceitos.
      { nome: 'Instagram', url: 'https://www.instagram.com/' },
    ],
    informacoesExtras: ['Informações comerciais (CNPJ, delivery, retirada) — configure aqui.'],
  },

  /* ───────────────────────── CARDÁPIO ─────────────────────────
   * Para adicionar um produto, copie um objeto e troque o `id` (único e estável).
   * Campos: id, nome, descricao, preco (número em reais), categoria,
   *   imagem (opcional — caminho; ausente/quebrada = ilustração automática),
   *   destaque (bool), disponivel (bool),
   *   etiqueta (opcional: 'Destaque' | 'Novidade' | 'Recomendação da casa' ...),
   *   ingredientes (opcional, lista), info (opcional, texto curto),
   *   arte (opcional: estilo da ilustração de fallback: 'calabresa'|'margherita'|'queijos'|'cogumelos'|'presunto'|'doce').
   * Exemplo de imagem: imagem: 'assets/img/cardapio/calabresa.webp'
   */
  categorias: ['Clássicas', 'Especiais', 'Doces'], // ordem dos filtros
  cardapio: [
    {
      id: 'margherita',
      nome: 'Margherita',
      descricao: 'Molho de tomate, mussarela, manjericão fresco e fio de azeite.',
      preco: 52.9,
      categoria: 'Clássicas',
      imagem: '',
      destaque: false,
      disponivel: true,
      ingredientes: ['Tomate', 'Mussarela', 'Manjericão', 'Azeite'],
      arte: 'margherita',
    },
    {
      id: 'calabresa',
      nome: 'Calabresa',
      descricao: 'Calabresa em rodelas finas, cebola roxa, azeitonas pretas e mussarela.',
      preco: 56.9,
      categoria: 'Clássicas',
      imagem: '',
      destaque: true,
      etiqueta: 'Destaque',
      disponivel: true,
      ingredientes: ['Calabresa', 'Cebola', 'Azeitona', 'Mussarela'],
      arte: 'calabresa',
    },
    {
      id: 'quatro-queijos',
      nome: 'Quatro Queijos',
      descricao: 'Mussarela, gorgonzola, parmesão e provolone sobre molho leve.',
      preco: 64.9,
      categoria: 'Especiais',
      imagem: '',
      destaque: false,
      disponivel: true,
      ingredientes: ['Mussarela', 'Gorgonzola', 'Parmesão', 'Provolone'],
      arte: 'queijos',
    },
    {
      id: 'funghi',
      nome: 'Funghi',
      descricao: 'Mix de cogumelos salteados, tomilho e mussarela, finalizada com azeite trufado.',
      preco: 69.9,
      categoria: 'Especiais',
      imagem: '',
      destaque: false,
      etiqueta: 'Novidade',
      disponivel: true,
      ingredientes: ['Cogumelos', 'Tomilho', 'Mussarela'],
      arte: 'cogumelos',
    },
    {
      id: 'prosciutto',
      nome: 'Prosciutto e Rúcula',
      descricao: 'Presunto cru, rúcula fresca, lascas de parmesão e tomate-cereja.',
      preco: 72.9,
      categoria: 'Especiais',
      imagem: '',
      destaque: true,
      etiqueta: 'Recomendação da casa',
      disponivel: true,
      ingredientes: ['Presunto cru', 'Rúcula', 'Parmesão', 'Tomate-cereja'],
      arte: 'presunto',
    },
    {
      id: 'chocolate-morango',
      nome: 'Chocolate com Morango',
      descricao: 'Chocolate meio amargo derretido, morangos frescos e açúcar de confeiteiro.',
      preco: 58.9,
      categoria: 'Doces',
      imagem: '',
      destaque: false,
      disponivel: true,
      ingredientes: ['Chocolate', 'Morango'],
      arte: 'doce',
    },
    {
      id: 'exemplo-indisponivel',
      nome: 'Sabor de exemplo (desativado)',
      descricao: 'Produto com disponivel: false — não aparece no site e não quebra o layout.',
      preco: 0,
      categoria: 'Especiais',
      destaque: false,
      disponivel: false,
    },
  ],
};

export default config;

