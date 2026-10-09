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
