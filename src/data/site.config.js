/**
 * Configuração Central do Site Don Corleone (Cuiabá/MT)
 * 
 * Todas as informações factuais e textos do site vêm deste arquivo.
 * Qualquer alteração feita aqui reflete instantaneamente nos componentes.
 */

export const siteConfig = {
  // Marca e Identidade
  marca: {
    nome: "Don Corleone",
    descritor: "Pizzas e Esfihas",
    slogan: "Sabor incomparável",
    cidade: "Cuiabá",
    estado: "MT",
    usarLogoOriginal: false, // Defina como true caso adicione o logo original em /images/brand/logo-original.png
    logoOriginalUrl: "/images/brand/logo-original.png",
    brasaoUrl: "/images/brand/brasao.svg",
    wordmarkUrl: "/images/brand/wordmark.svg",
    seloUrl: "/images/brand/selo.svg"
  },

  // Modalidades de Atendimento
  modalidades: {
    entrega: {
      id: "entrega",
      rotulo: "Entrega",
      descricao: "Receba quentinha na sua casa"
    },
    retirada: {
      id: "retirada",
      rotulo: "Retirada",
      descricao: "Retire no balcão da Arena Cuiabá"
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
    textoFechadoAmanha: "Fechado agora · abrimos às 17h"
  },

  // Contato e Atendimento
  contato: {
    // Link direto fornecido pelo cliente
    whatsappLinkOriginal: "https://wa.me/message/5MOA5LPC4SEMH1",
    
    // DDD de Cuiabá é 65. Quando confirmado o DDD com o cliente, preencha numeroComDDD (ex: "5565992650139")
    // Se preenchido, os botões usam https://wa.me/5565992650139?text=... para mensagem automática
    // Se null, o sistema utiliza o whatsappLinkOriginal com total segurança
    whatsappNumeroComDDD: null, 
    
    telefoneDelivery: "99265-0139", // Número para exibição e discagem
    telefoneDDD: "65", // DDD padrão de Cuiabá/MT
    telefoneCompleto: "65992650139", // Usado para tel: quando confirmado
    
    instagramUsuario: "@pizzaria_doncorleone",
    instagramUrl: "https://instagram.com/pizzaria_doncorleone",

    mensagens: {
      geral: "Olá! Vim pelo site da Don Corleone e gostaria de fazer um pedido para {modalidade}.",
      item: "Olá! Gostaria de pedir: {item}. Será para {modalidade}."
    }
  },

  // Localização
  localizacao: {
    unidade: "Arena Cuiabá",
    cidade: "Cuiabá",
    estado: "MT",
    // Os campos abaixo estão como null porque o endereço completo e o link do Maps ainda não foram informados
    logradouro: null, // Ex: "Av. Agrícola Paes de Barros" (deixar null se não confirmado)
    bairro: null, // Ex: "Verdão" (deixar null se não confirmado)
    cep: null,
    linkGoogleMaps: null // Link para traçar rota (botão oculta se null)
  },

  // Textos das Seções
  textos: {
    hero: {
      badge: "Cantina & Pizzaria",
      tituloLinha1: "A verdadeira tradição",
      tituloLinha2: "na sua mesa.",
      subtitulo: "Pizzas e esfihas artesanais preparadas com paixão. Peça para entrega ou retire na unidade Arena Cuiabá.",
      ctaPedido: "Pedir no WhatsApp",
      ctaCardapio: "Ver cardápio",
      indicadorScroll: "Role para montar a pizza"
    },
    marquee: [
      "Pizzas Artesanais",
      "Esfihas Quentinhas",
      "Entrega & Retirada",
      "Todos os dias, 17h às 23h",
      "Arena Cuiabá",
      "Sabor Incomparável"
    ],
    comoPedir: {
      titulo: "Como Fazer Seu Pedido",
      subtitulo: "Três passos simples para saborear o melhor de Cuiabá.",
      passos: [
        {
          numero: "01",
          titulo: "Escolha seus sabores",
          descricao: "Navegue pelo nosso cardápio e selecione suas pizzas e esfihas favoritas."
        },
        {
          numero: "02",
          titulo: "Chame no WhatsApp",
          descricao: "Envie sua escolha e selecione a modalidade: entrega rápida ou retirada."
        },
        {
          numero: "03",
          titulo: "Receba ou retire",
          descricao: "Receba quentinho no conforto da sua casa ou retire na unidade Arena Cuiabá."
        }
      ]
    },
    sobre: {
      titulo: "Don Corleone",
      subtitulo: "Pizzas e Esfihas",
      // Apenas fatos confirmados: unidade Arena Cuiabá, entrega e retirada, funcionamento diário
      paragrafos: [
        "Localizada na região da Arena Cuiabá, a Don Corleone combina o amor pela pizza com o cuidado artesanal em cada preparo.",
        "Com atendimento de segunda a domingo das 17h às 23h, oferecemos opções de entrega rápida e retirada no balcão, levando um sabor incomparável para a sua noite."
      ]
    },
    cardapio: {
      tituloItaliano: "La nostra carta",
      titulo: "Nosso Cardápio",
      subtitulo: "Pizzas e esfihas feitas para encantar o seu paladar.",
      fallbackMensagem: "Consulte nosso cardápio completo e as novidades de hoje diretamente no WhatsApp.",
      botaoFallback: "Ver Cardápio no WhatsApp"
    }
  },

  // Galeria de Fotos (Ativa quando houver 4 ou mais fotos reais na pasta /images/galeria/)
  galeria: {
    fotos: [] // Preencha com caminhos como "/images/galeria/foto1.jpg" quando fornecidas
  }
};
