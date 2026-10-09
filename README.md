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
