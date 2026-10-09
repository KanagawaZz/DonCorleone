/*
 * vite.config.js — Build do projeto. Injeta no HTML estático o SEO vindo de js/config.js
 * (título, descrição, Open Graph) e os caminhos de logo/imagem do hero, para que rastreadores
 * sem JavaScript enxerguem os metadados. Também copia assets/img para dist.
 */
import { defineConfig } from 'vite';
import { cpSync, existsSync } from 'node:fs';
import { config } from './js/config.js';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function seoFromConfig() {
  return {
    name: 'doncorleone-seo',
    // 'post': roda depois do processamento do Vite, mantendo os caminhos de imagem como estão no config.
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const { seo, favicon, nome, logo, imagens } = config.identidade;
        const url = seo.urlSite ? new URL(seo.urlSite) : null;
        const abs = (p) => (url && p ? new URL(p, url).href : p);
        const tags = [
          seo.urlSite ? `<link rel="canonical" href="${esc(seo.urlSite)}" />` : '',
          `<meta property="og:type" content="website" />`,
          `<meta property="og:site_name" content="${esc(nome)}" />`,
          `<meta property="og:title" content="${esc(seo.titulo)}" />`,
          `<meta property="og:description" content="${esc(seo.descricao)}" />`,
          `<meta property="og:locale" content="pt_BR" />`,
          seo.urlSite ? `<meta property="og:url" content="${esc(seo.urlSite)}" />` : '',
          seo.imagemCompartilhamento ? `<meta property="og:image" content="${esc(abs(seo.imagemCompartilhamento))}" />` : '',
          `<meta name="twitter:card" content="${seo.imagemCompartilhamento ? 'summary_large_image' : 'summary'}" />`,
          `<link rel="icon" type="image/svg+xml" href="${esc(favicon)}" />`,
        ].filter(Boolean).join('\n    ');
        return html
          .replace('%SEO_TITLE%', esc(seo.titulo))
          .replace('%SEO_DESCRIPTION%', esc(seo.descricao))
          .replace('<!--SEO_TAGS-->', tags)
          .replaceAll('%LOGO%', esc(logo))
          .replaceAll('%HERO_IMG%', esc(imagens.hero));
      },
    },
    // Os caminhos de imagem são lidos de config.js em tempo de execução, então a pasta é copiada como está.
    closeBundle() {
      if (existsSync('assets/img')) cpSync('assets/img', 'dist/assets/img', { recursive: true });
    },
  };
}

export default defineConfig({
  base: './', // caminhos relativos: funciona em Vercel, Netlify e GitHub Pages (subpasta)
  plugins: [seoFromConfig()],
  build: { target: 'es2020', chunkSizeWarningLimit: 700 },
});
