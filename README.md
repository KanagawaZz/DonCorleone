# DonCorleone — Pizzaria & Esfiharia | Cidade Alta, Cuiabá

Landing page de alta conversão e web app gastronômico para a **Don Corleone — Pizzaria & Esfiharia** (Cuiabá/MT), com personalização artesanal de pizzas (até 3 sabores), carrinho integrado, verificação de funcionamento em tempo real e checkout direto para WhatsApp.

---

## 🛠️ Tecnologias Utilizadas

- **Vite 6+**: Bundler ultrarrápido e servidor local de desenvolvimento
- **Vanilla JavaScript (ES Modules)**: Sem frameworks pesados (sem React/Vue), carregamento instantâneo
- **Lenis**: Rolagem suave (*smooth scroll*)
- **GSAP & ScrollTrigger**: Animações de entrada e cascata nos cards gastronômicos
- **Design System com CSS Moderno**: Tokens visuais em `src/styles/tokens.css`, paleta noir/ouro envelhecido/brasa de forno (`#0C0A09`, `#B8860B`, `#E26D2B`) e tipografia clássica (*Cinzel*, *Playfair Display*, *Manrope*)

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- **Node.js** (versão 18+ ou LTS)
- **NPM**

### 2. Comandos
```bash
npm install
npm run dev        # Inicia o servidor local (http://localhost:3000)
npm run build      # Valida e compila os arquivos de produção para dist/
npm run preview    # Pré-visualiza o build de produção localmente
```

---

## 🏷️ Como Configurar e Ligar/Desligar Promoções

No arquivo [`src/data/site.config.js`](src/data/site.config.js), localize o bloco `promocao`:

```javascript
promocao: {
  ativa: true,                          // Mude para true para ligar, ou false para desligar
  titulo: "Promoção Dia dos Namorados", // Título da campanha exibido na faixa do topo
  texto: "Ganhe 10% de desconto em todas as pizzas e esfihas!",
  inicio: "2026-06-10",                 // Data de início (formato YYYY-MM-DD)
  fim: "2026-06-12",                    // Data de término (formato YYYY-MM-DD)
  cupom: "AMOR10",                      // Código do cupom (opcional)
  descontoPercentual: 10                // % de desconto aplicado sobre os produtos no carrinho
}
```

### Regras da Promoção:
1. **Ligar uma promoção**: Defina `ativa: true`, preencha as datas no formato `YYYY-MM-DD` e informe o `descontoPercentual` (número entre 1 e 100).
2. **Desligar uma promoção**: Defina `ativa: false`. A faixa do topo desaparece imediatamente e nenhum desconto é aplicado no carrinho nem na mensagem do WhatsApp.
3. **Validade automática**: Mesmo com `ativa: true`, o sistema checa a data no fuso de Cuiabá (`America/Cuiaba`). Se a data atual estiver fora do intervalo `inicio` e `fim`, nada é exibido.

---

## 📍 Como Atualizar as Taxas de Entrega por Bairro

As taxas de entrega ficam no arquivo [`src/data/bairros.json`](src/data/bairros.json):

```json
[
  { "cidade": "Cuiabá", "bairro": "Jardim Cuiabá", "taxa": 8.00 },
  { "cidade": "Cuiabá", "bairro": "Goiabeiras", "taxa": 8.00 },
  { "cidade": "Várzea Grande", "bairro": "Centro (VG)", "taxa": 14.00 }
]
```

- Para alterar o valor de um bairro: basta trocar o número em `taxa` (em reais).
- Para adicionar um novo bairro: inclua um novo objeto com `cidade`, `bairro` e `taxa`.
- O cliente também conta com a opção *"Outro bairro (a confirmar)"*, que envia a taxa como pendente de confirmação com a atendente.
- Na **Retirada no Balcão**, a taxa é automaticamente R$ 0,00 (Grátis).

---

## ⏰ Horário de Funcionamento e Horário de Corte

No arquivo [`src/data/site.config.js`](src/data/site.config.js):

- `horario.dias`: Um item por dia da semana (`0` = domingo … `6` = sábado), cada um com:
  - `abertura`: início dos atendimentos (ex.: `"17:30"`).
  - `fechamento`: horário em que a casa fecha (ex.: `"23:00"`).
  - `corte`: último horário para aceitar novos pedidos (ex.: `"22:45"`). A partir dele, a finalização no checkout é bloqueada com aviso.
- `horario.textoGeral`: Resumo do horário exibido no site.

---

## 💳 Chave Pix e Pagamentos

No arquivo [`src/data/site.config.js`](src/data/site.config.js) no bloco `pagamento`:

- `pix.chave`: Chave Pix exibida na tela pós-envio com botão de cópia de 1 clique.
- `pix.tipo`: Tipo da chave (ex: `"Celular / WhatsApp"`, `"CNPJ"`, `"Chave Aleatória"`).
- `pix.titular`: Nome da empresa/titular da conta.
- `tempoMedioEspera`: Tempo médio estimado exibido para pedidos em dinheiro ou cartão (ex: `"40 min"`).

---

## 🖼️ Fotos do Cardápio

- O site usa apenas as imagens otimizadas em `public/images/cardapio/` (`.webp`, 1000 px de largura).
- As fotos originais em alta resolução ficam em `originais/` (fora do Git e fora do build), separadas em `combos/`, `esfihas/`, `kit-esfihas/`, `pizzas/` e `refrigerantes/`.
- Para converter uma foto nova:

```bash
node -e "require('sharp')('originais/esfihas/minha-foto.jpg').resize({width:1000}).webp({quality:80}).toFile('public/images/cardapio/esfiha-nova.webp')"
```

Depois, aponte o campo `foto` do item em `src/data/cardapio.json` para o novo arquivo.

---

## 📦 Estrutura de Arquivos

```text
DonCorleone/
├── index.html                   # HTML base, metadados OpenGraph e Schema.org
├── package.json                 # Dependências (Vite, GSAP, Lenis, Sharp)
├── vite.config.js               # Configuração do Vite
├── docs/                        # Guia de edição, pendências e planos futuros
├── originais/                   # Fotos originais em alta (ignoradas pelo Git)
├── public/                      # Arquivos servidos como estão (imagens, PWA, SEO)
├── src/
│   ├── main.js                  # Ponto de entrada da aplicação
│   ├── data/
│   │   ├── site.config.js       # Central de configurações, Pix, horários e promoções
│   │   ├── cardapio.json        # Catálogo de pizzas, esfihas e sobremesas
│   │   ├── bairros.json         # Tabela de bairros e taxas de entrega (Cuiabá e VG)
│   │   └── depoimentos.json     # Avaliações de clientes
│   ├── utils/
│   │   ├── entrega.js           # Cálculo puro de taxa de entrega por modalidade/bairro
│   │   ├── codigo-pedido.js     # Gerador de códigos curtos padronizados (DC-DDMM-XXX)
│   │   ├── whatsapp-order.js    # Formatador de mensagem otimizada para WhatsApp
│   │   ├── horario.js           # Verificação de funcionamento e corte (fuso Cuiabá)
│   │   ├── promocao.js          # Validação e cálculo de campanhas ativas
│   │   ├── carrinho.js          # Store reativa do carrinho com sessionStorage
│   │   └── calculo-pizza.js     # Regras de fatias e maior valor
│   ├── components/
│   │   ├── header.js            # Topo com barra de progresso dourada e carrinho
│   │   ├── banner-promocao.js   # Faixa de destaque para campanhas ativas
│   │   ├── carrinho-modal.js    # Checkout em 5 passos, autopreenchimento e tela pós-envio
│   │   ├── barra-pedido.js      # Barra flutuante inferior para mobile
│   │   └── ...
│   └── styles/
│       ├── tokens.css           # Design tokens e variáveis de cores/sombras
│       ├── base.css             # Estilos globais e componentes base
│       └── components/          # Estilos individuais dos componentes
```
