# DonCorleone — Landing Page Cinematográfica & Gastronômica

Landing page de alta conversão para a pizzaria e cantina artesanal **DonCorleone**, com cena 3D/2.5D imersiva, narrativa cinematográfica no scroll, cardápio interativo e conversão direta para pedidos via WhatsApp.

---

## 🛠️ Tecnologias Utilizadas

- **Vite 6+**: Bundler ultrarrápido e servidor de desenvolvimento
- **Vanilla JavaScript (ES Modules)**: Sem sobrecarga de frameworks, inicialização instantânea
- **Three.js**: Cena 3D procedural com camadas de massa, molho, queijo, calabresa e manjericão, com iluminação quente e renderização otimizada
- **GSAP & ScrollTrigger**: Animações de alto desempenho sincronizadas com a rolagem
- **Lenis**: Rolagem suave (*smooth scroll*) integrada ao GSAP ticker
- **Design System com CSS Moderno**: Tokens visuais em `css/base.css`, paleta noir/dourado/vinho, tipografia editorial e acessibilidade completa

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- **Node.js** (versão 18+ ou LTS)
- **NPM**

### 2. Instalação e Execução
```bash
npm install
npm run dev        # Inicia o servidor local (http://localhost:3000)
npm run build      # Gera o build de produção na pasta dist/
npm run preview    # Pré-visualiza o build de produção localmente
```

> **Atenção:** Não abra o `index.html` diretamente com `file://`. Utilize os scripts acima ou um servidor HTTP estático local.

---

## ⚙️ Onde Editar Cada Informação

| O que deseja alterar? | Onde editar |
|---|---|
| Nome, slogan, títulos, textos, preços e produtos | `js/config.js` |
| WhatsApp, endereço, horários de funcionamento, redes sociais | `js/config.js` → `contato` |
| Cores globais do tema | `css/base.css` → variáveis `:root` |
| Fontes e tipografia | `css/base.css` (`@font-face` ou Google Fonts) |
| Cores e visual da pizza 3D | `js/config.js` → `tema.cena3d` |
| Velocidade e intensidade das animações | `js/config.js` → `animacao` |
| Qualidade gráfica da cena 3D | `js/config.js` → `animacao.cena3d.qualidade` |

---

### 📱 Configuração do WhatsApp
No arquivo `js/config.js`, no campo `contato.whatsapp`:
- Insira apenas os dígitos com DDI e DDD (exemplo: `'5565992650139'`).
- O texto pré-formatado da mensagem pode ser personalizado em `contato.mensagemProduto` (as variáveis `{pizzaria}` e `{produto}` são preenchidas dinamicamente).
- Caso o número não seja informado, os botões de pedido são desativados com elegância para evitar links quebrados.

### 🍕 Gerenciamento do Cardápio
- **Adicionar pizza:** Copie um objeto dentro do array `cardapio` em `js/config.js` e defina um `id` exclusivo.
- **Preço:** Informe o valor numérico em reais (ex.: `58.9`). A formatação `R$ 58,90` é automática.
- **Categorias:** O filtro lê automaticamente a propriedade `categoria` de cada item.
- **Imagens:** Salve as fotos na pasta `assets/img/cardapio/` (formato WebP ou JPG otimizado) e referencie no campo `imagem`. Se a imagem não for encontrada, uma ilustração artística personalizada é gerada automaticamente como fallback.

---

## 📦 Estrutura de Arquivos

```text
DonCorleone/
├── index.html            # Estrutura semântica e pontos de ancoragem da página
├── package.json          # Dependências do projeto
├── vite.config.js        # Configuração do Vite com injeção automática de SEO
├── css/
│   ├── base.css          # Design tokens (cores, fontes, espaçamentos) e reset
│   ├── hero.css          # Estilos do Hero e abertura cinematográfica
│   └── cardapio.css      # Grid, cards, filtros e interações do cardápio
├── js/
│   ├── config.js         # Única fonte de verdade dos dados comerciais
│   ├── main.js           # Inicialização e orquestração dos módulos
│   ├── scroll.js         # GSAP, ScrollTrigger e sincronização do Lenis
│   ├── pizza3d.js        # Cena 3D Three.js e controle de camadas
│   ├── cardapio.js       # Renderização dinâmica e filtros do cardápio
│   ├── content.js        # Injeção de textos configuráveis no DOM
│   ├── device.js         # Detecção de qualidade de GPU e prefers-reduced-motion
│   ├── links.js          # Geração segura de URLs e mensagens WhatsApp
│   └── pizzaArt.js       # Fallback ilustrativo vetorial para produtos
└── assets/
    ├── img/              # Logotipos, ícones e fotografias gastronômicas
    └── fonts/            # Arquivos de fontes locais
```

---

## 🌐 Publicação (Deploy)

A build gera arquivos estáticos com caminhos relativos prontos para:
- **Vercel / Netlify:** Vincule o repositório no painel e configure o comando de build como `npm run build` e diretório de saída como `dist`.
- **GitHub Pages:** Execute `npm run build` e envie a pasta `dist` para a branch `gh-pages`.
