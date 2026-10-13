---
version: "alpha"
name: "3D & Hyperrealism"
description: "Interface 3D imersiva com texturas realistas, parallax e lighting. WebGL/Three.js integrado. Template para experiências imersivas."
colors:
  primary: "#001F3F"
  secondary: "#228B22"
  tertiary: "#800020"
  neutral: "#FFD700"
  surface: "#C0C0C0"

typography:
  h1:
    fontFamily: -apple-system, sans-serif
    fontSize: 2.25rem
    fontWeight: 700
  body-md:
    fontFamily: -apple-system, sans-serif
    fontSize: 1rem
    fontWeight: 400
  label-caps:
    fontFamily: -apple-system, sans-serif
    fontSize: 0.75rem
    fontWeight: 500
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    padding: 12px
---

## Overview

Interface 3D imersiva com texturas realistas, parallax e lighting. WebGL/Three.js integrado. Template para experiências imersivas. Evolução de Skeuomorphism, potenciada por WebGL e Three.js (2010s). Imersão tátil com texturas realistas e lighting physics-based.

- Density: 5/10 — Balanced
- Variance: 4/10 — Moderate
- Motion: 8/10 — Cinematic

- **Style:** Immersive, Realistic, Tactile, Spatial
- **Keywords:** Depth, realistic textures, 3D models, spatial navigation, tactile, skeuomorphic elements, rich detail, immersive
- **Era:** 2020s Modern
- **Light/Dark:** ◐ Partial / ◐ Partial

## Colors

- **Deep Navy** (#001F3F) — Primary surface or dominant color
- **Forest Green** (#228B22) — Secondary surface or text color
- **Burgundy** (#800020) — Supporting palette color
- **Gold** (#FFD700) — Premium accent, decorative highlights
- **Silver** (#C0C0C0) — Supporting palette color

## Typography

- **Display / Hero:** System UI stack (-apple-system, sans-serif) — Weight 700, tight tracking, used for headline impact
- **Body:** System UI stack (-apple-system, sans-serif) — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** System UI stack (-apple-system, sans-serif) — 0.875rem, weight 500, slight letter-spacing
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

WebGL/Three.js 3D, realistic shadows (layers), physics lighting, parallax (3-5 layers), smooth 3D (300-400ms)

- **Physics:** Spring — stiffness 120, damping 20. Confident, weighted transitions.
- **Entry animations:** Fade + translate-Y (16px → 0) over 540ms ease-out. Staggered cascades for lists: 120ms between items.
- **Hover states:** Scale(1.03) + shadow lift over 200ms.
- **Page transitions:** Fade + slide (300ms).
- **Performance:** Only transform and opacity animated. No layout-triggering properties.



## Shapes

Base corner radius: 4px. See rounded tokens in front matter for the full scale.
## Components

- **Primary Button:** Subtly rounded (0.5rem) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows.
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards:** Subtly rounded (0.5rem) corners. Surface background. Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
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

- Do WebGL/Three.js integrated
- Do 3D models loaded
- Do Parallax 3-5 layers
- Do Realistic lighting verified
- Do Complex shadows rendered
- Do Physics animation smooth 300-400ms

## Use Case

Ecommerce premium, Imóveis, Automotivo, Educação imersiva

transform: translate3d, perspective: 1000px, WebGL canvas, Three.js/Babylon.js library, box-shadow: complex multi-layer, background: complex gradients, filter: drop-shadow()

--perspective: 1000px, --parallax-layers: 5, --lighting-intensity: realistic, --shadow-depth: 20-40%, --animation-duration: 300-400ms

Atue como um Engenheiro Frontend Sênior e UI Designer Especialista.
Sua tarefa é codificar uma Landing Page completa na primeira tentativa.
- Tema da Landing Page: <INSIRA O TEMA>
- Seções a adicionar: <INSIRA AS SEÇÕES>

Gere o código final imediatamente seguindo estas definições:

## Estilo

- **Nome:** 3D & Hyperrealism
- **Tipo:** Immersive, Realistic, Tactile, Spatial
- **Keywords:** Depth, realistic textures, 3D models, spatial navigation, tactile, skeuomorphic elements, rich detail, immersive
- **Era:** 2020s Modern
- **Light/Dark:** ◐ Partial / ◐ Partial

## Paleta de Cores

- **Primárias:** Deep Navy #001F3F, Forest Green #228B22, Burgundy #800020, Gold #FFD700, Silver #C0C0C0
- **Secundárias:** Complex gradients (5-10 stops), realistic lighting, shadow variations (20-40% darker)

## Efeitos Visuais

WebGL/Three.js 3D, realistic shadows (layers), physics lighting, parallax (3-5 layers), smooth 3D (300-400ms)

## Direção Visual para IA

Build an immersive 3D interface using realistic textures, 3D models (Three.js/Babylon.js), complex shadows, realistic lighting, parallax scrolling (3-5 layers), physics-based motion. Include skeuomorphic elements with tactile detail.

## CSS Technical

```css
transform: translate3d, perspective: 1000px, WebGL canvas, Three.js/Babylon.js library, box-shadow: complex multi-layer, background: complex gradients, filter: drop-shadow()
```

## Design System Variables

```css
--perspective: 1000px, --parallax-layers: 5, --lighting-intensity: realistic, --shadow-depth: 20-40%, --animation-duration: 300-400ms
```

## Checklist de Implementação

- ☐ WebGL/Three.js integrated
- ☐ 3D models loaded
- ☐ Parallax 3-5 layers
- ☐ Realistic lighting verified
- ☐ Complex shadows rendered
- ☐ Physics animation smooth 300-400ms

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