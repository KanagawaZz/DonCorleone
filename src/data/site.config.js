/**
 * Configuração Central do Site Don Corleone (Cuiabá/MT)
 * 
 * Todas as informações factuais, textos e configurações de contato
 * estão centralizadas neste arquivo para fácil manutenção.
 */

export const siteConfig = {
  // Marca e Identidade
  marca: {
    nome: "Don Corleone",
    segmento: "Cantina e pizzaria — pizzas e esfihas",
    slogan: "Sabor incomparável",
    cidade: "Cuiabá",
    estado: "MT",
    usarLogoOriginal: false,
    logoOriginalUrl: "/images/brand/logo-original.png",
    brasaoUrl: "/images/brand/brasao.svg",
    wordmarkUrl: "/images/brand/wordmark.svg",
    seloUrl: "/images/brand/selo.svg"
  },

  // Modalidades de Atendimento
  modalidades: {
    entrega: {
      id: "entrega",
      rotulo: "Entrega (delivery)",
      descricao: "Receba quentinha no conforto da sua casa"
    },
    retirada: {
      id: "retirada",
      rotulo: "Retirada no balcão",
      descricao: "Retire na unidade Arena Cuiabá"
    },
    padrao: "entrega"
  },

  // Horário de Funcionamento (Fuso: America/Cuiaba)
  horario: {
    diasSemana: "Segunda a domingo",
    horaAbertura: 17, // 17:00
    horaFechamento: 23, // 23:00
    fusoHorario: "America/Cuiaba",
    textoAberto: "Aberto agora · recebe pedidos até 23h",
    textoFechadoHoje: "Fechado agora · abrimos hoje às 17h",
    textoFechadoAmanha: "Fechado agora · abrimos às 17h",
    textoGeral: "Todos os dias, das 17h às 23h"
  },

  // Contato e Atendimento
  contato: {
    // Telefone celular padrão Brasil Cuiabá/MT (DDD 65 + 9 dígitos: 99265-0139)
    // NOTA DE DIVERGÊNCIA: Se for necessário alterar para o formato sem o 9º dígito ("556592650139"),
    // basta alterar o valor abaixo em um único lugar.
    whatsappNumeroComDDD: "5565992650139", 
    whatsappNumeroAlternativo: "556592650139",
    
    // Link direto oficial como fallback
    whatsappLinkOriginal: "https://wa.me/message/5MOA5LPC4SEMH1",
    
    telefoneDelivery: "(65) 99265-0139",
    telefoneDDD: "65",
    telefoneCompleto: "5565992650139",
    
    instagramUsuario: "@pizzaria_doncorleone",
    instagramUrl: "https://www.instagram.com/pizzaria_doncorleone/"
  },

  // Localização (Fatos confirmados)
  localizacao: {
    unidade: "Arena Cuiabá",
    cidade: "Cuiabá",
    estado: "MT",
    descricao: "Unidade Arena Cuiabá — Cuiabá/MT",
    logradouro: null,
    bairro: null,
    cep: null,
    linkGoogleMaps: null
  },

  // Regras de Montagem e Personalização de Pizza
  regrasPizza: {
    maximoSabores: 3,
    // Regra de preço para múltiplos sabores:
    // - "sabor_mais_caro": Preço da pizza é igual ao sabor de maior valor (Padrão mais comum em pizzarias)
    // - "media_proporcional": Preço da pizza é a média proporcional dos sabores
    // - "preco_fixo": Preço fixo definido por tamanho
    regraPreco: "sabor_mais_caro",
    tamanhos: [
      {
        id: "grande",
        nome: "Pizza Grande",
        fatias: 8,
        descricao: "8 fatias · até 3 sabores",
        padrao: true
      }
    ]
  },

  // Regras Comerciais e Entrega
  regrasComerciais: {
    // Taxa de entrega não é fixa no momento. Exibimos a mensagem de confirmação.
    taxaEntregaTexto: "A confirmar com a pizzaria",
    cidadePadrao: "Cuiabá",
    estadoPadrao: "MT",
    formasPagamento: [
      { id: "pix", nome: "Pix", descricao: "Chave informada no WhatsApp" },
      { id: "dinheiro", nome: "Dinheiro", descricao: "Pagamento na entrega ou retirada" },
      { id: "cartao_credito", nome: "Cartão de Crédito", descricao: "Maquininha na entrega/retirada" },
      { id: "cartao_debito", nome: "Cartão de Débito", descricao: "Maquininha na entrega/retirada" }
    ]
  },

  // Textos Oficiais da Landing Page
  textos: {
    hero: {
      badge: "CANTINA & PIZZARIA · ARENA CUIABÁ",
      tituloLinha1: "Uma noite especial começa",
      tituloLinha2: "com uma boa pizza.",
      subtitulo: "Pizzas e esfihas para transformar sua fome em um momento especial. Escolha seus sabores e peça para receber em casa ou retirar na unidade Arena Cuiabá.",
      ctaPedido: "Fazer meu pedido",
      ctaCardapio: "Explorar cardápio",
      features: [
        "Pizzas e esfihas",
        "Monte com até 3 sabores",
        "Delivery ou retirada",
        "Todos os dias, 17h às 23h"
      ]
    },
    marquee: [
      "Pizzas & Esfihas",
      "Monte até 3 Sabores",
      "Delivery & Retirada",
      "Arena Cuiabá",
      "Todos os dias das 17h às 23h",
      "Sabor Incomparável",
      "Cuiabá — MT"
    ],
    comoPedir: {
      titulo: "Como Fazer Seu Pedido",
      subtitulo: "Três etapas simples para saborear a Don Corleone.",
      passos: [
        {
          numero: "01",
          titulo: "Escolha seus sabores",
          descricao: "Monte sua pizza com até 3 sabores ou escolha suas esfihas no cardápio."
        },
        {
          numero: "02",
          titulo: "Informe os detalhes",
          descricao: "Escolha entrega ou retirada, preencha seus dados e informe a forma de pagamento."
        },
        {
          numero: "03",
          titulo: "Envie pelo WhatsApp",
          descricao: "Confira o resumo completo e envie o pedido diretamente para a pizzaria."
        }
      ],
      nota: "O pedido será encaminhado pelo WhatsApp e a confirmação final depende do atendimento da pizzaria."
    },
    sobre: {
      titulo: "Mais sabor para os seus momentos.",
      subtitulo: "Don Corleone · Unidade Arena Cuiabá",
      paragrafos: [
        "A Don Corleone reúne pizzas e esfihas em uma experiência pensada para deixar sua noite mais gostosa.",
        "Na unidade Arena Cuiabá, você escolhe seus sabores e conta com a praticidade do delivery ou da retirada no balcão, com atendimento todos os dias das 17h às 23h."
      ],
      destaques: [
        { rotulo: "Variedade", valor: "Pizzas & Esfihas" },
        { rotulo: "Personalização", valor: "Até 3 Sabores" },
        { rotulo: "Praticidade", valor: "Delivery & Retirada" },
        { rotulo: "Atendimento", valor: "17h às 23h" }
      ]
    },
    cardapio: {
      tituloItaliano: "La Nostra Carta",
      titulo: "Nosso Cardápio",
      subtitulo: "Pizzas especiais, tradicionais e esfihas feitas para você.",
      fallbackMensagem: "Consulte nosso cardápio completo e as novidades de hoje diretamente no WhatsApp.",
      botaoFallback: "Ver Cardápio no WhatsApp"
    }
  },

  galeria: {
    fotos: []
  }
};
