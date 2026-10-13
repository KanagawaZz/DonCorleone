---
version: "alpha"
name: "Locomotive Infinite Scroll"
description: "Estilo Locomotive Infinite Scroll com smooth scrolling, parallax multicamada e animações scroll-driven. Baseado em Locomotive Scroll v5 e Lenis. Ideal para storytelling imersivo e landing pages premium."
colors:
  primary: "#1A1A2E"
  secondary: "#16213E"
  tertiary: "#FFFFFF"
  neutral: "#6C63FF"
  surface: "#A29BFE"
  accent: "#FF6B6B"
typography:
  h1:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: 700
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
rounded:
  sm: 16px
  md: 32px
  lg: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.sm}"
    padding: 12px
---

## Overview

Estilo Locomotive Infinite Scroll com smooth scrolling, parallax multicamada e animações scroll-driven. Baseado em Locomotive Scroll v5 e Lenis. Ideal para storytelling imersivo e landing pages premium. Locomotive Scroll nasceu no estúdio canadense Locomotive.ca como solução para scroll suave e detecção de viewport. A v5 (2024) é uma reescrita completa baseada em Lenis, com apenas 9.4kB gzipped, dual IntersectionObserver, parallax via data-attributes e progress tracking via CSS variables. Representa a evolução do scroll-hijacking para scroll-enhancement acessível.

- Density: 5/10 — Balanced
- Variance: 4/10 — Moderate
- Motion: 8/10 — Cinematic

- **Style:** Smooth Scroll, Parallax, Kinetic, Immersive, Scroll-Driven
- **Keywords:** smooth scroll, parallax, infinite scroll, locomotive scroll, lenis, scroll-driven animations, viewport detection, kinetic motion, scroll progress, CSS variables, data attributes, lerp interpolation, scroll speed, scroll hijacking, immersive storytelling
- **Era:** 2020s Modern Scroll-Driven
- **Light/Dark:** ✓ Full / ✓ Full

## Colors

- **Deep Charcoal** (#1A1A2E) — Dark surface, primary background
- **Midnight Blue** (#16213E) — Dark surface, primary background
- **Pure White** (#FFFFFF) — Light surface, card backgrounds
- **Electric Indigo** (#6C63FF) — Accent color, emphasis elements
- **Soft Lavender** (#A29BFE) — Extended palette, decorative use
- **Warm Coral** (#FF6B6B) — Extended palette, decorative use
- **Mint Glow** (#00D2FF) — Extended palette, decorative use
- **Pale Smoke** (#F0F0F5) — Extended palette, decorative use

## Typography

- **Display / Hero:** Inter — Weight 700, tight tracking, used for headline impact
- **Accent:** Space Grotesk — Used for decorative or emphasis text
- **Body:** Inter — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** Inter — 0.875rem, weight 500, slight letter-spacing
- **Monospace:** JetBrains Mono — Used for code, metadata, and technical values

Scale:
- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem

## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Split-screen (text left, visual right).
- **Feature sections:** Zig-zag alternating text+image rows. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).

## Elevation & Depth

Smooth scroll via Lenis (lerp: 0.1, duration: 1.2), parallax layers com data-scroll-speed (0.1 a 0.8), scroll progress como CSS variable (--progress 0-1), viewport detection com IntersectionObserver, fade-in/slide-up on scroll (translate3d + opacity), staggered reveal (delay incremental 100ms), horizontal scroll sections, scroll-triggered counters, kinetic typography com velocidades diferentes, sticky sections com scroll progress, easing customizado (exponential ease-out)

- **Physics:** Spring — stiffness 120, damping 20. Confident, weighted transitions.
- **Entry animations:** Fade + translate-Y (16px → 0) over 540ms ease-out. Staggered cascades for lists: 120ms between items.
- **Hover states:** Scale(1.03) + shadow lift over 200ms.
- **Page transitions:** Fade + slide (300ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.

## Shapes

Base corner radius: 16px. See rounded tokens in front matter for the full scale.

## Components

- **Primary Button:** Rounded (16px) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Rounded (16px) corners. Surface background. Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels.
- **Navigation:** Primary surface background. Active item: accent color indicator. Font weight 500 when active.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Icon-based composition with descriptive text and action button.

## Do's and Don'ts

- No emojis in UI — use icon system only (Lucide, Heroicons)
- No pure black (#000000) — use off-black or charcoal variants
- No oversaturated accent colors (saturation cap: 80%)
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No broken external image links — use picsum.photos or inline SVG
- No generic lorem ipsum in demos

- Do Locomotive Scroll v5 CDN incluído (JS + CSS)
- Do new LocomotiveScroll() inicializado
- Do data-scroll em todos os elementos animados
- Do data-scroll-speed com valores variados (0.1-0.8)
- Do data-scroll-css-progress para barra de progresso
- Do Parallax layers no hero (mínimo 3 camadas)
- Do Reveal animations (fade-in + slide-up) com is-inview
- Do Staggered reveals com delay incremental
- Do Seção horizontal scroll
- Do Sticky section com scroll progress
- Do Kinetic typography com velocidades diferentes
- Do GPU-accelerated transforms (translate3d)
- Do Dark palette #1A1A2E verificada
- Do Contraste WCAG AA 4.5:1
- Do Responsivo mobile (parallax desabilitado em touch)

## Use Case

Landing pages imersivas, Storytelling digital, Portfolios criativos, Sites de agências, Apresentações de produto premium, One-page narrativas

scroll-behavior: smooth; --progress: 0; transform: translate3d(0, var(--y), 0); will-change: transform, opacity; transition: opacity 0.6s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); position: sticky; top: 0; overflow: hidden; backdrop-filter: blur(10px); font-family: 'Inter', sans-serif; background: #1A1A2E; color: #FFFFFF; [data-scroll] { opacity: 0; transform: translateY(60px); } [data-scroll].is-inview { opacity: 1; transform: translateY(0); }

--color-bg: #1A1A2E; --color-bg-alt: #16213E; --color-text: #FFFFFF; --color-text-muted: #A0A0B0; --color-accent: #6C63FF; --color-accent-soft: #A29BFE; --color-coral: #FF6B6B; --color-cyan: #00D2FF; --color-surface: rgba(255,255,255,0.05); --font-body: 'Inter', sans-serif; --font-display: 'Space Grotesk', sans-serif; --lerp: 0.1; --duration: 1.2; --scroll-speed-slow: 0.2; --scroll-speed-medium: 0.5; --scroll-speed-fast: 0.8; --reveal-distance: 60px; --reveal-duration: 0.8s; --reveal-easing: cubic-bezier(0.16, 1, 0.3, 1); --stagger-delay: 100ms; --border-radius: 16px; --glass-bg: rgba(255,255,255,0.05); --glass-border: 1px solid rgba(255,255,255,0.1); --glass-blur: blur(10px);

Atue como um Engenheiro Frontend Sênior e UI Designer Especialista.
Sua tarefa é codificar uma Landing Page completa na primeira tentativa.
- Tema da Landing Page: <INSIRA O TEMA>
- Seções a adicionar: <INSIRA AS SEÇÕES>

Gere o código final imediatamente seguindo estas definições:

## Estilo

- **Nome:** Locomotive Infinite Scroll
- **Tipo:** Smooth Scroll, Parallax, Kinetic, Immersive, Scroll-Driven
- **Keywords:** smooth scroll, parallax, infinite scroll, locomotive scroll, lenis, scroll-driven animations, viewport detection, kinetic motion, scroll progress, CSS variables, data attributes, lerp interpolation, scroll speed, scroll hijacking, immersive storytelling
- **Era:** 2020s Modern Scroll-Driven
- **Light/Dark:** ✓ Full / ✓ Full

## Paleta de Cores

- **Primárias:** Deep Charcoal #1A1A2E, Midnight Blue #16213E, Pure White #FFFFFF
- **Secundárias:** Electric Indigo #6C63FF, Soft Lavender #A29BFE, Warm Coral #FF6B6B, Mint Glow #00D2FF, Pale Smoke #F0F0F5

## Efeitos Visuais

Smooth scroll via Lenis (lerp: 0.1, duration: 1.2), parallax layers com data-scroll-speed (0.1 a 0.8), scroll progress como CSS variable (--progress 0-1), viewport detection com IntersectionObserver, fade-in/slide-up on scroll (translate3d + opacity), staggered reveal (delay incremental 100ms), horizontal scroll sections, scroll-triggered counters, kinetic typography com velocidades diferentes, sticky sections com scroll progress, easing customizado (exponential ease-out)

## Direção Visual para IA

Design an immersive infinite scroll landing page inspired by Locomotive Scroll v5 and Lenis. Use smooth scrolling with lerp interpolation (0.1), parallax layers at different speeds (data-scroll-speed), scroll progress CSS variables (--progress 0 to 1), viewport detection with IntersectionObserver for reveal animations. Include: sticky hero with scroll-driven parallax, sections that fade-in and slide-up on scroll entry, horizontal scroll section for features, kinetic typography with different scroll speeds, staggered card reveals, scroll-triggered number counters, progress bar tied to page scroll. Dark immersive palette with electric indigo accents. Use translate3d for GPU-accelerated transforms. Include Locomotive Scroll CDN (https://cdn.jsdelivr.net/npm/locomotive-scroll/bundled/locomotive-scroll.min.js and locomotive-scroll.css). Initialize with new LocomotiveScroll() and use data-scroll, data-scroll-speed, data-scroll-css-progress, data-scroll-repeat, data-scroll-offset, data-scroll-position attributes.

## CSS Technical

```css
scroll-behavior: smooth; --progress: 0; transform: translate3d(0, var(--y), 0); will-change: transform, opacity; transition: opacity 0.6s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); position: sticky; top: 0; overflow: hidden; backdrop-filter: blur(10px); font-family: 'Inter', sans-serif; background: #1A1A2E; color: #FFFFFF; [data-scroll] { opacity: 0; transform: translateY(60px); } [data-scroll].is-inview { opacity: 1; transform: translateY(0); }
```

## Design System Variables

```css
--color-bg: #1A1A2E; --color-bg-alt: #16213E; --color-text: #FFFFFF; --color-text-muted: #A0A0B0; --color-accent: #6C63FF; --color-accent-soft: #A29BFE; --color-coral: #FF6B6B; --color-cyan: #00D2FF; --color-surface: rgba(255,255,255,0.05); --font-body: 'Inter', sans-serif; --font-display: 'Space Grotesk', sans-serif; --lerp: 0.1; --duration: 1.2; --scroll-speed-slow: 0.2; --scroll-speed-medium: 0.5; --scroll-speed-fast: 0.8; --reveal-distance: 60px; --reveal-duration: 0.8s; --reveal-easing: cubic-bezier(0.16, 1, 0.3, 1); --stagger-delay: 100ms; --border-radius: 16px; --glass-bg: rgba(255,255,255,0.05); --glass-border: 1px solid rgba(255,255,255,0.1); --glass-blur: blur(10px);
```

## Checklist de Implementação

- ☐ Locomotive Scroll v5 CDN incluído (JS + CSS)
- ☐ new LocomotiveScroll() inicializado
- ☐ data-scroll em todos os elementos animados
- ☐ data-scroll-speed com valores variados (0.1-0.8)
- ☐ data-scroll-css-progress para barra de progresso
- ☐ Parallax layers no hero (mínimo 3 camadas)
- ☐ Reveal animations (fade-in + slide-up) com is-inview
- ☐ Staggered reveals com delay incremental
- ☐ Seção horizontal scroll
- ☐ Sticky section com scroll progress
- ☐ Kinetic typography com velocidades diferentes
- ☐ GPU-accelerated transforms (translate3d)
- ☐ Dark palette #1A1A2E verificada
- ☐ Contraste WCAG AA 4.5:1
- ☐ Responsivo mobile (parallax desabilitado em touch)

## Regras de Execução

1. Siga fielmente o estilo visual determinado.
2. Use ícones SVG inline de alta qualidade (estilo Heroicons ou Lucide) — PROIBIDO usar emojis como ícones.
3. Adicione `cursor-pointer` e estados de `hover` suaves (transition-all) em todos os elementos interativos.
4. Estrutura Obrigatória da Página:
   - Navbar (Logo + Links + CTA)
   - Hero Section (Headline impactante + Subtitle + 2 botões + Elemento visual 3D/Abstrato via CSS)
   - Features (3 cards com ícones)
   - Testimonials (3 cards)
   - Pricing (3 tiers, destaque no central)
   - CTA Final
   - Footer completo com redes sociais, política de privacidade, termos de uso, contato e links SEO.
5. Todo o conteúdo textual deve ser em Português Brasileiro (PT-BR).
6. O visual deve ser CLARAMENTE distinto — não crie um design "padrão Bootstrap". Force o uso das variáveis de design system fornecidas.
7. Use tags `<style>` no head para classes personalizadas (especialmente para os efeitos complexos de backdrop-filter e animações) que o Tailwind via CDN não cobrir.
8. Responsividade Total: O layout deve se adaptar perfeitamente a Mobile, Tablet e Desktop (Stack vertical no mobile).
9. Inclua meta tags básicas de SEO, Viewport e Open Graph no `<head>`.
10. Footer deve conter: Copyright 2026, Links de navegação secundária e Ícones de redes sociais.
11. Assuma as decisões criativas necessárias para entregar o resultado completo e funcional agora.