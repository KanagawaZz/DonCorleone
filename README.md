<<<<<<< HEAD
# DonCorleone — Landing page cinematográfica

Landing page de pizzaria premium com cena 3D procedural, scroll narrativo e cardápio gerado por configuração. Conversão principal: **pedido pelo WhatsApp**.

## Tecnologias

Vite 8 · JavaScript (ES Modules) · GSAP + ScrollTrigger · Lenis · Three.js. Todas as versões estão fixadas no `package.json`. Requer **Node.js 18+**.

## Rodar localmente

```bash
npm install
npm run dev        # servidor de desenvolvimento (http://localhost:5173)
npm run build      # build de produção em dist/
npm run preview    # testa a build (http://localhost:4173)
```

> Não abra o `index.html` direto no navegador (`file://`): use sempre os scripts acima.

## Onde editar cada coisa

| Quero… | Edite |
|---|---|
| Nome, slogan, textos, preços, produtos, categorias | `js/config.js` |
| WhatsApp, endereço, horários, redes sociais, mapa | `js/config.js` → `contato` |
| Cores globais | `css/base.css` → variáveis em `:root` |
| Fontes | `css/base.css` (`@font-face` + `--f-serif/--f-sans/--f-accent`) e arquivos em `assets/fonts/` |
| Cores da pizza 3D | `js/config.js` → `tema.cena3d` |
| Velocidade/intensidade das animações | `js/config.js` → `animacao` |
| Qualidade 3D | `js/config.js` → `animacao.cena3d.qualidade` |

### WhatsApp
`contato.whatsapp`: somente dígitos, formato internacional (ex.: `5511987654321`). Se estiver vazio ou inválido, todos os botões de pedido ficam desativados (sem links quebrados). A mensagem de cada pizza usa `contato.mensagemProduto`; `{pizzaria}` e `{produto}` são substituídos automaticamente.

### Cardápio
- **Adicionar:** copie um objeto em `cardapio` e troque o `id` (único e estável).
- **Remover/ocultar:** apague o objeto ou use `disponivel: false`.
- **Categorias:** campo `categoria` do produto; a ordem dos filtros está em `categorias`.
- Preço é um número em reais (`56.9`); a formatação `R$ 56,90` é automática.

### Fotos das pizzas
Coloque o arquivo em `assets/img/cardapio/` (WebP ou AVIF, proporção 4:3, ~800×600, até ~120 KB) e aponte em `imagem`, por exemplo: `imagem: 'assets/img/cardapio/calabresa.webp'`. Enquanto o produto não tiver foto (ou se o arquivo não carregar), o card mostra uma ilustração automática — sem ícone quebrado. Para trocar uma foto, substitua o arquivo mantendo o mesmo nome.

Fotos esperadas (opcionais): `assets/img/hero-pizza.webp` (hero, 1200×1200), `assets/img/historia.webp` (seção "A casa", 900×1100), `assets/img/og.jpg` (compartilhamento, 1200×630), e uma foto por produto em `assets/img/cardapio/`. Depois de adicionar, atualize os caminhos em `config.js` (`identidade.imagens`, `identidade.seo.imagemCompartilhamento`). A foto do hero é usada como imagem de espera/alternativa; o hero normal é a pizza 3D.

### Logotipo
Substitua `assets/img/logo.svg` (e `favicon.svg`) mantendo o nome, ou mude o caminho em `identidade.logo`/`identidade.favicon`.

### Qualidade 3D e movimento
`animacao.cena3d.qualidade`: `'auto'` (recomendado; escolhe por CPU, memória, economia de dados e rede), `'alto'`, `'medio'`, `'baixo'` ou `'estatico'` (sem 3D). Também: `ativar`, `ativarNoMobile`, `animacao.scroll.suavidade`, `animacao.intensidade`, `animacao.pizza.*`. Usuários com "reduzir movimento" no sistema recebem a página sem scrub, pin ou rolagem suave.

## Publicação

O build gera `dist/` com caminhos relativos.

- **Vercel / Netlify:** importe o repositório; comando `npm run build`, pasta de saída `dist`.
- **GitHub Pages:** rode `npm run build` e publique o conteúdo de `dist/` (por exemplo na branch `gh-pages`).

**Antes de publicar:** substitua todos os dados demonstrativos (preços, produtos, textos da história, endereço, horários); configure `contato.whatsapp`; preencha `identidade.seo.urlSite` (URL final) e `imagemCompartilhamento`; confirme redes sociais; troque as imagens ilustrativas por fotos reais.

## Estrutura

```text
index.html · vite.config.js · package.json
css/   base.css  hero.css  cardapio.css
js/    config.js  main.js  scroll.js  pizza3d.js  cardapio.js
       content.js (config → HTML) · links.js (WhatsApp/URLs) · device.js (qualidade) · pizzaArt.js (ilustração de fallback)
assets/ img/ (logo, favicon, hero-pizza.svg, cardapio/) · fonts/
```
=======
# Don Corleone — Pizzas e Esfihas (Cuiabá/MT)

Landing page elegante e moderna no estilo cantina italiana contemporânea para a pizzaria **Don Corleone**, desenvolvida com **Vite**, **JavaScript puro (ES Modules)**, **GSAP + ScrollTrigger** e **Lenis**.

Apresenta como destaque visual a **montagem interativa da pizza na rolagem**, além de foco total na experiência mobile para realização rápida de pedidos via WhatsApp.

---

## 🛠️ Tecnologias Utilizadas

- **Vite**: Bundler ultrarrápido e servidor de desenvolvimento
- **Vanilla JavaScript (ES Modules)**: Sem frameworks pesados para máxima performance
- **GSAP & ScrollTrigger**: Animações de alto desempenho controladas pelo scroll
- **Lenis**: Rolagem suave (smooth scroll) perfeitamente sincronizada
- **Vanilla CSS com Tokens**: Design system estruturado com variáveis CSS, layout fluido e contraste AA

---

## 🚀 Como Executar o Projeto Localmente

### 1. Pré-requisitos
- **Node.js** (versão 18+ ou LTS)
- **NPM**

### 2. Instalação das Dependências
```bash
npm install
```

### 3. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```
O projeto estará disponível em `http://localhost:3000`.

### 4. Gerar Build de Produção
```bash
npm run build
```
Os arquivos otimizados serão gerados na pasta `dist/`.

### 5. Pré-visualizar o Build
```bash
npm run preview
```

---

## 🌐 Como Publicar na Vercel

1. Suba este repositório para o seu **GitHub** ou **GitLab**.
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
3. Importe o repositório da Don Corleone.
4. A Vercel detectará automaticamente a configuração do Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **Deploy**. O site estará no ar em poucos segundos!

---

## 📁 Estrutura de Pastas

```
/
├── docs/                      Documentação do projeto
│   ├── pendencias.md          Checklist de dados pendentes do proprietário
│   └── guia-de-edicao.md      Guia passo a passo para alterar informações
├── public/                    Arquivos estáticos servidos diretamente
│   ├── images/
│   │   ├── brand/             Brasão, wordmark, selo e imagem Open Graph (SVG)
│   │   ├── galeria/           Fotos reais do ambiente e forno
│   │   └── cardapio/          Fotos dos pratos e pizzas
│   ├── favicon.svg            Ícone oficial da aba
│   ├── robots.txt             Diretrizes para mecanismos de busca
│   └── sitemap.xml            Mapa do site para indexação
├── src/
│   ├── components/            Componentes modulares de interface
│   │   └── montagem/          Cena da pizza (SVG editorial, timeline GSAP)
│   ├── data/                  Arquivos de dados editáveis (sem tocar no layout)
│   │   ├── site.config.js     Telefones, links, horários, textos e configurações
│   │   ├── cardapio.json      Categorias e itens do cardápio
│   │   └── depoimentos.json   Avaliações reais de clientes
│   ├── styles/                Tokens de design, estilos base e de componentes
│   ├── utils/                 Horário de Cuiabá, gerador de WhatsApp, motion e DOM
│   └── main.js                Orquestrador central da aplicação
├── index.html                 Esqueleto HTML com SEO estático e JSON-LD
├── vite.config.js             Configuração do Vite
└── package.json               Dependências e scripts
```

---

## 📝 Onde Editar as Informações do Site

- **Telefone, WhatsApp, Horário, Localização e Textos**: Edite `src/data/site.config.js`.
- **Cardápio (Sabores e Preços)**: Edite `src/data/cardapio.json`.
- **Depoimentos de Clientes**: Edite `src/data/depoimentos.json`.
- **Fotos e Logotipo**: Adicione na pasta `public/images/`.

Consulte o documento completo em [`docs/guia-de-edicao.md`](docs/guia-de-edicao.md) para detalhes.
>>>>>>> b78a8338662fff7821a3b7b98d627b19063228f6
