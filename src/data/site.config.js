/**
 * Configuração Central do Site Don Corleone (Cuiabá/MT)
 * 
 * Fonte de verdade factual extraída do Anota.ai:
 * - Endereço: Avenida Brasil, 2055, Cidade Alta, Cuiabá - MT, CEP 78030-409
 * - Pedido Mínimo: R$ 22,00
 * - PIX Oficial: 65993605364
 * - Formas de pagamento: Dinheiro, Cartão (Visa, Mastercard, Amex, Elo), PIX
 * - Horários específicos por dia da semana (17h30 até 23h00 / 23h15 / 23h30)
 * - Tamanhos: Pequena (25cm/4 fatias/2 sabores), Média (30cm/6 fatias/2 sabores), Grande (35cm/8 fatias/3 sabores)
 */

export const siteConfig = {
  // Marca e Identidade
  marca: {
    nome: "Don Corleone",
    segmento: "Cantina e pizzaria — pizzas e esfihas artesanais",
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
      descricao: "Receba quentinha na sua casa (Cuiabá e Várzea Grande)"
    },
    retirada: {
      id: "retirada",
      rotulo: "Retirada no balcão",
      descricao: "Retire na nossa unidade (Av. Brasil, 2055, Cidade Alta)"
    },
    padrao: "entrega"
  },

  // Horário de Funcionamento Oficial por Dia da Semana (Fuso: America/Cuiaba)
  horario: {
    fusoHorario: "America/Cuiaba",
    horaAberturaPadrao: "17:30",
    dias: [
      { dia: 0, nome: "Domingo", abertura: "17:30", fechamento: "23:15", corte: "23:00" },
      { dia: 1, nome: "Segunda-feira", abertura: "17:30", fechamento: "23:00", corte: "22:45" },
      { dia: 2, nome: "Terça-feira", abertura: "17:30", fechamento: "23:00", corte: "22:45" },
      { dia: 3, nome: "Quarta-feira", abertura: "17:30", fechamento: "23:00", corte: "22:45" },
      { dia: 4, nome: "Quinta-feira", abertura: "17:30", fechamento: "23:00", corte: "22:45" },
      { dia: 5, nome: "Sexta-feira", abertura: "17:30", fechamento: "23:15", corte: "23:00" },
      { dia: 6, nome: "Sábado", abertura: "17:30", fechamento: "23:30", corte: "23:15" }
    ],
    textoGeral: "Seg a Qui: 17h30 às 23h00 · Sex e Dom: 17h30 às 23h15 · Sáb: 17h30 às 23h30"
  },

  // Contato e Atendimento
  contato: {
    whatsappNumeroComDDD: "5565992650139", 
    whatsappNumeroAlternativo: "556592650139",
    whatsappLinkOriginal: "https://wa.me/message/5MOA5LPC4SEMH1",
    telefoneDelivery: "(65) 99265-0139",
    telefoneDDD: "65",
    telefoneCompleto: "5565992650139",
    instagramUsuario: "@pizzaria_doncorleone",
    instagramUrl: "https://www.instagram.com/pizzaria_doncorleone/"
  },

  // Localização Oficial Confirmada
  localizacao: {
    unidade: "Cidade Alta",
    enderecoCompleto: "Avenida Brasil, 2055, Cidade Alta, Cuiabá - MT, CEP 78030-409, Brasil",
    logradouro: "Avenida Brasil",
    numero: "2055",
    bairro: "Cidade Alta",
    cidade: "Cuiabá",
    estado: "MT",
    cep: "78030-409",
    pais: "Brasil",
    linkGoogleMaps: "https://maps.google.com/?q=Avenida+Brasil,+2055,+Cidade+Alta,+Cuiaba+-+MT"
  },

  // Dados para Pagamento e Cobrança
  pagamento: {
    pedidoMinimo: 22.00,
    pix: {
      chave: "65993605364",
      tipo: "Celular / WhatsApp",
      titular: "Don Corleone Cantina & Pizzaria",
      avisoInstrucao: "Seu pedido entra em preparo assim que enviarmos a confirmação do comprovante. Envie o comprovante no WhatsApp."
    },
    bandeirasCartao: ["Visa", "Mastercard", "American Express", "Elo"],
    tempoMedioEspera: "40 min",
    tempoMedioRetirada: "20 a 35 min"
  },

  // Prazos e Tempos Operacionais
  operacional: {
    tempoRetirada: "20 a 35 min",
    tempoEntrega: "40 a 60 min"
  },

  // Campanhas e Promoções Ativas (Sem promoções fictícias)
  promocao: {
    ativa: false,
    titulo: "",
    texto: "",
    inicio: null,
    fim: null,
    cupom: null,
    descontoPercentual: 0
  },

  // Regras Oficiais de Tamanhos de Pizza
  regrasPizza: {
    regraPreco: "sabor_mais_caro",
    tamanhos: [
      {
        id: "pequena",
        nome: "Pizza Pequena",
        diametro: "25 cm",
        fatias: 4,
        maxSabores: 2,
        preco: null,
        precoInfo: "Preço sob consulta",
        descricao: "25 cm · 4 fatias · até 2 sabores",
        padrao: false
      },
      {
        id: "media",
        nome: "Pizza Média",
        diametro: "30 cm",
        fatias: 6,
        maxSabores: 2,
        preco: null,
        precoInfo: "Preço sob consulta",
        descricao: "30 cm · 6 fatias · até 2 sabores",
        padrao: false
      },
      {
        id: "grande",
        nome: "Pizza Grande",
        diametro: "35 cm",
        fatias: 8,
        maxSabores: 3,
        preco: 76.90,
        precoInfo: "A partir de R$ 76,90",
        descricao: "35 cm · 8 fatias · até 3 sabores",
        padrao: true
      }
    ],
    // Bordas Recheadas
    bordas: []
  },

  // Regras Comerciais e Entrega
  regrasComerciais: {
    pedidoMinimo: 22.00,
    taxaEntregaTexto: "Calculada por bairro (ou a confirmar com a atendente)",
    cidadePadrao: "Cuiabá",
    estadoPadrao: "MT",
    formasPagamento: [
      { id: "pix", nome: "Pix", descricao: "Chave 65993605364 com cópia rápida e envio de comprovante" },
      { id: "dinheiro", nome: "Dinheiro", descricao: "Pagamento na entrega ou retirada (com troco disponível)" },
      { id: "cartao_credito", nome: "Cartão de Crédito", descricao: "Maquininha na entrega/retirada (Visa, Mastercard, Amex, Elo)" },
      { id: "cartao_debito", nome: "Cartão de Débito", descricao: "Maquininha na entrega/retirada" }
    ]
  },

  // Textos Oficiais da Landing Page
  textos: {
    hero: {
      badge: "CANTINA & PIZZARIA · CIDADE ALTA · CUIABÁ",
      tituloLinha1: "Uma noite especial começa",
      tituloLinha2: "com uma boa pizza.",
      subtitulo: "Pizzas e esfihas artesanais preparadas com carinho. Peça para receber na sua casa ou retire no nosso balcão na Cidade Alta.",
      ctaPedido: "Fazer meu pedido",
      ctaCardapio: "Explorar cardápio",
      features: [
        "Pizzas & Esfihas",
        "Até 3 sabores na Grande",
        "Pedido mínimo R$ 22,00",
        "Todos os dias a partir das 17h30"
      ]
    },
    marquee: [
      "Pizzas Salgadas & Doces",
      "Monte até 3 Sabores",
      "Combos & Kits de Esfihas",
      "Pedido Mínimo R$ 22,00",
      "Avenida Brasil, 2055 — Cidade Alta",
      "Aberto a partir das 17h30",
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
          descricao: "Monte sua pizza com até 3 sabores, adicione borda recheada ou escolha suas esfihas e combos no cardápio."
        },
        {
          numero: "02",
          titulo: "Informe os detalhes",
          descricao: "Escolha entrega ou retirada, preencha seu endereço e escolha a forma de pagamento (Pix, Cartão ou Dinheiro)."
        },
        {
          numero: "03",
          titulo: "Envie pelo WhatsApp",
          descricao: "Revise o resumo completo e envie o pedido diretamente para a nossa atendente confirmar."
        }
      ],
      nota: "O pedido será encaminhado pelo WhatsApp e a confirmação final depende do atendimento da pizzaria."
    },
    sobre: {
      titulo: "Tradição e Sabor para os seus Momentos.",
      subtitulo: "Don Corleone · Cidade Alta — Cuiabá/MT",
      paragrafos: [
        "A Don Corleone reúne pizzas e esfihas em uma experiência pensada para transformar a sua noite em um momento especial.",
        "Localizada na Avenida Brasil, 2055 (Cidade Alta), você escolhe seus sabores favoritos e conta com a agilidade do delivery e a praticidade da retirada no balcão, aberto todos os dias a partir das 17h30."
      ],
      destaques: [
        { rotulo: "Variedade", valor: "25+ Sabores de Pizza" },
        { rotulo: "Personalização", valor: "Até 3 Sabores" },
        { rotulo: "Pedido Mínimo", valor: "R$ 22,00" },
        { rotulo: "Atendimento", valor: "A partir das 17h30" }
      ]
    },
    cardapio: {
      tituloItaliano: "La Nostra Carta",
      titulo: "Nosso Cardápio",
      subtitulo: "Pizzas salgadas, pizzas doces, combos, esfihas e bebidas feitas para você.",
      fallbackMensagem: "Consulte nosso cardápio completo diretamente no WhatsApp.",
      botaoFallback: "Ver Cardápio no WhatsApp"
    }
  },

  galeria: {
    fotos: []
  }
};
