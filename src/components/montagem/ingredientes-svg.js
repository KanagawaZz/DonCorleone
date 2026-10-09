/**
 * Montagem da Pizza de Calabresa Don Corleone (Opção B - Arquivos WebP com Transparência)
 * 
 * Ordem da montagem: massa → molho → queijo → calabresa → cebola → azeitona → orégano → pizza-pronta
 * Sem tomate e sem manjericão. Fio de azeite em SVG.
 */

export function gerarSvgPizzaMontagem() {
  return `
  <div class="pizza-montagem-canvas">
    <!-- Pedestal / Tábua -->
    <div class="pizza-foto-camada camada-pedestal" id="camada-pedestal-img">
      <img src="/images/ingredientes/pedestal.webp" alt="Tábua rústica de madeira" class="ingrediente-img" />
    </div>

    <!-- Massa -->
    <div class="pizza-foto-camada camada-massa-img" id="camada-massa-img">
      <img src="/images/ingredientes/massa.webp" alt="Massa de pizza artesanal" class="ingrediente-img" />
    </div>

    <!-- Molho de Tomate -->
    <div class="pizza-foto-camada camada-molho-img" id="camada-molho-img">
      <img src="/images/ingredientes/molho.webp" alt="Molho de tomate artesanal" class="ingrediente-img" />
    </div>

    <!-- Queijo (Camada Completa e Pedaços) -->
    <div class="pizza-foto-camada camada-queijo-img" id="camada-queijo-img">
      <img src="/images/ingredientes/queijo-forno.jpg" alt="Queijo derretido" class="ingrediente-img" />
    </div>

    <!-- Pizza Pronta Final -->
    <div class="pizza-foto-camada camada-pizza-completa" id="camada-pizza-pronta-img">
      <img src="/images/ingredientes/pizza-pronta.webp" alt="Pizza de Calabresa Don Corleone Pronta" class="ingrediente-img" />
    </div>

    <!-- Palco SVG com as Camadas Individuais de Calabresa, Cebola, Azeitonas e Orégano -->
    <svg class="pizza-montagem-svg" viewBox="0 0 600 600" width="100%" height="100%" aria-hidden="true">
      <defs>
        <!-- Brilho Dourado de Fundo -->
        <radialGradient id="glowDourado" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#C8A15A" stop-opacity="0.45" />
          <stop offset="55%" stop-color="#C8A15A" stop-opacity="0.15" />
          <stop offset="100%" stop-color="#C8A15A" stop-opacity="0" />
        </radialGradient>

        <linearGradient id="anelDourado" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F7E6C4" />
          <stop offset="50%" stop-color="#C8A15A" />
          <stop offset="100%" stop-color="#7A561D" />
        </linearGradient>

        <radialGradient id="azeiteGotaGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#FFFDEB" />
          <stop offset="40%" stop-color="#FAD95B" />
          <stop offset="80%" stop-color="#C7961A" />
          <stop offset="100%" stop-color="#805C06" />
        </radialGradient>

        <!-- Sombra Projetada por Código (Estática) -->
        <filter id="sombraIngredienteCodigo" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#000000" flood-opacity="0.65" />
        </filter>
      </defs>

      <!-- 0. BRILHO DE FUNDO -->
      <circle id="camada-glow" cx="300" cy="300" r="285" fill="url(#glowDourado)" />

      <!-- Moldura Dourada da Trattoria -->
      <circle cx="300" cy="300" r="275" fill="none" stroke="url(#anelDourado)" stroke-width="1.5" opacity="0.65" />
      <circle cx="300" cy="300" r="268" fill="none" stroke="url(#anelDourado)" stroke-width="0.8" stroke-dasharray="4 3" opacity="0.45" />

      <!-- COBERTURAS FLUTUANTES (CALABRESA, CEBOLA, AZEITONAS, ORÉGANO) -->
      <g id="camada-coberturas" class="ingrediente-camada" style="transform-origin: 300px 300px;">
        
        <!-- CALABRESA 1 A 6: Fatias Reais Isoladas (.webp) com Distribuição Ampla -->
        <g id="calabresa-1" class="item-calabresa" transform="translate(300, 160)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/calabresa-1.webp" x="-42" y="-42" width="84" height="84" />
        </g>

        <g id="calabresa-2" class="item-calabresa" transform="translate(425, 220)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/calabresa-2.webp" x="-40" y="-40" width="80" height="80" />
        </g>

        <g id="calabresa-3" class="item-calabresa" transform="translate(425, 380)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/calabresa-3.webp" x="-42" y="-42" width="84" height="84" />
        </g>

        <g id="calabresa-4" class="item-calabresa" transform="translate(300, 440)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/calabresa-4.webp" x="-44" y="-44" width="88" height="88" />
        </g>

        <g id="calabresa-5" class="item-calabresa" transform="translate(175, 380)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/calabresa-5.webp" x="-42" y="-42" width="84" height="84" />
        </g>

        <g id="calabresa-6" class="item-calabresa" transform="translate(175, 220)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/calabresa-6.webp" x="-42" y="-42" width="84" height="84" />
        </g>

        <!-- FATIAS DE CALABRESA CENTRAIS -->
        <g id="calabresa-7" class="item-calabresa" transform="translate(265, 280)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/calabresa-1.webp" x="-38" y="-38" width="76" height="76" />
        </g>

        <g id="calabresa-8" class="item-calabresa" transform="translate(340, 315)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/calabresa-3.webp" x="-38" y="-38" width="76" height="76" />
        </g>

        <!-- CEBOLA 1 A 5: Anéis de Cebola Reais (.webp) -->
        <g id="cebola-1" class="item-cebola" transform="translate(300, 180) rotate(15)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/cebola-1.webp" x="-50" y="-50" width="100" height="100" />
        </g>

        <g id="cebola-2" class="item-cebola" transform="translate(420, 270) rotate(-35)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/cebola-2.webp" x="-50" y="-50" width="100" height="100" />
        </g>

        <g id="cebola-3" class="item-cebola" transform="translate(340, 420) rotate(60)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/cebola-3.webp" x="-50" y="-50" width="100" height="100" />
        </g>

        <g id="cebola-4" class="item-cebola" transform="translate(180, 320) rotate(-20)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/cebola-4.webp" x="-50" y="-50" width="100" height="100" />
        </g>

        <g id="cebola-5" class="item-cebola" transform="translate(260, 240) rotate(80)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/cebola-5.webp" x="-50" y="-50" width="100" height="100" />
        </g>

        <!-- AZEITONA 1 A 5: Azeitonas Pretas em Fatias (.webp) -->
        <g id="azeitona-1" class="item-azeitona" transform="translate(250, 175)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/azeitona-1.webp" x="-26" y="-26" width="52" height="52" />
        </g>

        <g id="azeitona-2" class="item-azeitona" transform="translate(425, 215)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/azeitona-2.webp" x="-26" y="-26" width="52" height="52" />
        </g>

        <g id="azeitona-3" class="item-azeitona" transform="translate(380, 425)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/azeitona-3.webp" x="-26" y="-26" width="52" height="52" />
        </g>

        <g id="azeitona-4" class="item-azeitona" transform="translate(175, 360)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/azeitona-4.webp" x="-26" y="-26" width="52" height="52" />
        </g>

        <g id="azeitona-5" class="item-azeitona" transform="translate(310, 285)" filter="url(#sombraIngredienteCodigo)">
          <image href="/images/ingredientes/azeitona-5.webp" x="-26" y="-26" width="52" height="52" />
        </g>

        <!-- ORÉGANO (Camada WebP e Partículas) -->
        <g id="camada-oregano" class="item-oregano" transform="translate(50, 50)" opacity="0">
          <image href="/images/ingredientes/oregano.webp" x="0" y="0" width="500" height="500" />
        </g>

        <!-- FIO DE AZEITE EXTRA VIRGEM (Gotas Douradas Reluzentes em SVG) -->
        <g id="camada-azeite" opacity="0">
          <ellipse cx="280" cy="180" rx="9" ry="5" fill="url(#azeiteGotaGrad)" transform="rotate(30 280 180)" />
          <circle cx="278" cy="178" r="1.5" fill="#FFFFFF" opacity="0.9" />
          
          <ellipse cx="410" cy="270" rx="10" ry="5.5" fill="url(#azeiteGotaGrad)" transform="rotate(-20 410 270)" />
          <circle cx="408" cy="268" r="1.6" fill="#FFFFFF" opacity="0.9" />
          
          <ellipse cx="355" cy="390" rx="9" ry="5" fill="url(#azeiteGotaGrad)" transform="rotate(45 355 390)" />
          
          <ellipse cx="215" cy="355" rx="9" ry="5" fill="url(#azeiteGotaGrad)" transform="rotate(-35 215 355)" />
          
          <circle cx="305" cy="310" r="4" fill="url(#azeiteGotaGrad)" />
          <circle cx="304" cy="308" r="1.3" fill="#FFFFFF" opacity="0.9" />
        </g>

        <!-- SHIMMER SWEEP (Brilho Cinematográfico) -->
        <rect id="shimmer-sweep" x="-120" y="30" width="70" height="540" fill="url(#azeiteGotaGrad)" opacity="0" transform="rotate(25 300 300)" />
      </g>

      <!-- VAPOR QUENTE DA PIZZA PRONTA -->
      <g id="camada-vapor" opacity="0" stroke="rgba(243, 235, 221, 0.55)" stroke-width="2.8" stroke-linecap="round" fill="none">
        <path class="traco-vapor v1" d="M 240,160 C 230,120 250,90 235,45" />
        <path class="traco-vapor v2" d="M 300,140 C 290,100 315,70 305,25" />
        <path class="traco-vapor v3" d="M 360,150 C 375,110 350,80 365,35" />
      </g>

      <!-- PARTÍCULAS FLUTUANTES DE FARINHA -->
      <g id="camada-particulas" fill="#FAF0E1" opacity="0.65">
        <circle class="particula p1" cx="75" cy="115" r="1.8" />
        <circle class="particula p2" cx="525" cy="135" r="2.3" />
        <circle class="particula p3" cx="115" cy="485" r="1.5" />
        <circle class="particula p4" cx="495" cy="465" r="2.0" />
        <circle class="particula p5" cx="55" cy="295" r="1.6" />
        <circle class="particula p6" cx="545" cy="275" r="1.8" />
      </g>
    </svg>
  </div>
  `;
}
