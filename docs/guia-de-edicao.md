# Guia de Edição do Site — Don Corleone

Este guia explica como atualizar qualquer informação no site da Don Corleone de forma rápida, sem precisar alterar arquivos de layout ou programação.

---

## 1. Onde Fica Cada Informação?

| O que você quer alterar | Arquivo a editar | O que fazer |
|---|---|---|
| Telefones, WhatsApp, Instagram | `src/data/site.config.js` | Alterar os campos `whatsapp`, `telefone` ou `instagram` |
| Horário de funcionamento | `src/data/site.config.js` | Alterar o objeto `horario` |
| Endereço e localização | `src/data/site.config.js` | Preencher `endereco` e `linkMaps` |
| Textos do site e Sobre | `src/data/site.config.js` | Alterar os textos em `textos` ou `sobre` |
| Cardápio (sabores, preços, itens) | `src/data/cardapio.json` | Adicionar ou editar categorias e itens |
| Depoimentos de clientes | `src/data/depoimentos.json` | Inserir depoimentos reais recebidos |
| Fotos da galeria | Pasta `public/images/galeria/` | Colocar fotos reais (JPG ou WebP) |
| Fotos dos pratos | Pasta `public/images/cardapio/` | Colocar fotos com o nome correspondente |
| Logotipo original | `public/images/brand/` | Colocar o arquivo e ajustar `usarLogoOriginal` em `site.config.js` |

---

## 2. Como Editar o Arquivo `site.config.js`

Abra o arquivo `src/data/site.config.js` em qualquer editor de texto.

### Alterar o link ou número do WhatsApp:
```javascript
whatsapp: {
  // Quando tiver o número direto com DDD (ex: 65992650139):
  numeroComDDD: "65992650139", // Se preenchido, o link gera mensagem automática
  linkDireto: "https://wa.me/message/5MOA5LPC4SEMH1", // Usado caso numeroComDDD seja null
  mensagemPadrao: "Olá! Vim pelo site da Don Corleone e gostaria de fazer um pedido para {modalidade}."
}
```

### Alterar o Horário de Atendimento:
```javascript
horario: {
  diasSemana: "Segunda a domingo",
  horaAbertura: 17, // 17h
  horaFechamento: 23, // 23h
  fusoHorario: "America/Cuiaba"
}
```

### Ativar o Botão "Como Chegar" e Endereço Completo:
```javascript
endereco: {
  unidade: "Arena Cuiabá",
  logradouro: "Rua Exemplo, 123", // Deixe null se ainda não tiver
  bairro: "Verdão", // Deixe null se ainda não tiver
  cidade: "Cuiabá",
  estado: "MT",
  linkMaps: "https://maps.google.com/?q=Don+Corleone+Cuiaba" // Ativa o botão de rota
}
```

---

## 3. Como Editar o Cardápio (`src/data/cardapio.json`)

O arquivo `src/data/cardapio.json` organiza as pizzas e esfihas por categorias. Exemplo:

```json
{
  "categorias": [
    {
      "id": "pizzas-salgadas",
      "nome": "Pizzas Tradicionais",
      "descricao": "Nossas receitas consagradas com massa artesanal.",
      "itens": [
        {
          "id": "margherita",
          "nome": "Margherita Don Corleone",
          "descricao": "Molho de tomate especial, mussarela fatiada, rodelas de tomate fresco, folhas de manjericão e fio de azeite extra virgem.",
          "preco": 68.00,
          "destaque": true,
          "foto": "/images/cardapio/margherita.webp"
        },
        {
          "id": "calabresa",
          "nome": "Calabresa Especial",
          "descricao": "Mussarela, calabresa artesanal fatiada, cebola em rodelas finas e orégano.",
          "preco": 62.00,
          "destaque": false,
          "foto": null
        }
      ]
    }
  ]
}
```

- Se o `preco` for `null`, o cardápio não exibe o valor (ideal se variar por tamanho).
- Se a `foto` for `null`, o cardápio exibe um belo selo ilustrado da casa no lugar.
- Se a lista de `categorias` estiver vazia (`[]`), a seção do site automaticamente convida o cliente a conferir o cardápio atualizado no WhatsApp com um único clique.

---

## 4. Como Adicionar Depoimentos (`src/data/depoimentos.json`)

Quando você receber avaliações reais de clientes no Google ou WhatsApp, adicione-as:

```json
[
  {
    "nome": "Carlos E.",
    "avaliacao": 5,
    "cidade": "Cuiabá / MT",
    "texto": "Melhor pizza da região da Arena! Massa no ponto certo e entrega super rápida."
  }
]
```

Se o arquivo estiver vazio `[]`, a seção de depoimentos fica oculta automaticamente.

---

## 5. Como Adicionar Fotos na Galeria

Coloque suas fotos em formato JPG ou WebP dentro da pasta `public/images/galeria/`.
Quando houver 4 ou mais fotos cadastradas no `site.config.js` (em `galeria.fotos`), a galeria interativa com efeito parallax aparecerá no site.

---

## 6. Publicação e Deploy na Vercel

1. Suba as alterações para o seu repositório Git.
2. Na Vercel, importe o repositório.
3. As configurações padrão são detectadas automaticamente:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Clique em **Deploy**. As atualizações serão publicadas instantaneamente!
