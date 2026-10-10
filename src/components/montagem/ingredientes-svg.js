/**
 * Montagem Fotográfica Hiper-Realista — Don Corleone Pizzaria
 * 
 * Camadas gastronômicas reais: Tábua Rústica → Massa Artesanal → Molho San Marzano → 
 * Queijo Fior di Latte → Rodelas de Calabresa Tostadas → Anéis de Cebola → 
 * Azeitonas Pretas → Orégano Aromático → Fio de Azeite → Pizza Pronta Dourada.
 */

export function gerarSvgPizzaMontagem() {
  return `
  <div class="pizza-montagem-canvas" id="pizza-montagem-canvas">
    
    <!-- Efeitos de Luz e Ambiente Cinematográfico -->
    <div class="pizza-spotlight-glow" aria-hidden="true"></div>
    <div class="pizza-warm-ember" aria-hidden="true"></div>

    <!-- 0. Tábua Rústica / Pala de Forno -->
    <div class="pizza-foto-camada camada-pedestal" id="camada-pedestal-img">
      <img src="/images/ingredientes/pedestal.webp" alt="Tábua rústica de madeira" class="ingrediente-img img-pedestal" />
    </div>

    <!-- 1. Massa Artesanal Crua de Fermentação Lenta -->
    <div class="pizza-foto-camada camada-massa-img" id="camada-massa-img">
      <img src="/images/ingredientes/massa.webp" alt="Massa de pizza artesanal" class="ingrediente-img img-massa" />
    </div>

    <!-- 2. Molho de Tomate San Marzano -->
    <div class="pizza-foto-camada camada-molho-img" id="camada-molho-img">
      <img src="/images/ingredientes/molho.webp" alt="Molho de tomate San Marzano artesanal" class="ingrediente-img img-molho" />
    </div>

    <!-- 3. Queijo Fior di Latte Derretido -->
    <div class="pizza-foto-camada camada-queijo-img" id="camada-queijo-img">
      <img src="/images/ingredientes/queijo-forno.jpg" alt="Queijo mozzarella derretido no forno a lenha" class="ingrediente-img img-queijo" />
    </div>

    <!-- 4. Coberturas Flutuantes em Alta Resolução (Calabresas, Cebolas, Azeitonas) -->
    <div class="pizza-foto-camada camada-coberturas" id="camada-coberturas">
      
      <!-- Fatias Reais de Calabresa Artesanal Tostada -->
      <div class="item-calabresa cal-1" id="calabresa-1">
        <img src="/images/ingredientes/calabresa-1.webp" alt="Fatia de calabresa artesanal" />
      </div>
      <div class="item-calabresa cal-2" id="calabresa-2">
        <img src="/images/ingredientes/calabresa-2.webp" alt="Fatia de calabresa artesanal" />
      </div>
      <div class="item-calabresa cal-3" id="calabresa-3">
        <img src="/images/ingredientes/calabresa-3.webp" alt="Fatia de calabresa artesanal" />
      </div>
      <div class="item-calabresa cal-4" id="calabresa-4">
        <img src="/images/ingredientes/calabresa-4.webp" alt="Fatia de calabresa artesanal" />
      </div>
      <div class="item-calabresa cal-5" id="calabresa-5">
        <img src="/images/ingredientes/calabresa-5.webp" alt="Fatia de calabresa artesanal" />
      </div>
      <div class="item-calabresa cal-6" id="calabresa-6">
        <img src="/images/ingredientes/calabresa-6.webp" alt="Fatia de calabresa artesanal" />
      </div>

      <!-- Anéis Reais de Cebola Doce -->
      <div class="item-cebola ceb-1" id="cebola-1">
        <img src="/images/ingredientes/cebola-1.webp" alt="Anel de cebola fina" />
      </div>
      <div class="item-cebola ceb-2" id="cebola-2">
        <img src="/images/ingredientes/cebola-2.webp" alt="Anel de cebola fina" />
      </div>
      <div class="item-cebola ceb-3" id="cebola-3">
        <img src="/images/ingredientes/cebola-3.webp" alt="Anel de cebola fina" />
      </div>
      <div class="item-cebola ceb-4" id="cebola-4">
        <img src="/images/ingredientes/cebola-4.webp" alt="Anel de cebola fina" />
      </div>

      <!-- Azeitonas Pretas Inteiras da Sicília -->
      <div class="item-azeitona az-1" id="azeitona-1">
        <img src="/images/ingredientes/azeitona-1.webp" alt="Azeitona preta selecionada" />
      </div>
      <div class="item-azeitona az-2" id="azeitona-2">
        <img src="/images/ingredientes/azeitona-2.webp" alt="Azeitona preta selecionada" />
      </div>
      <div class="item-azeitona az-3" id="azeitona-3">
        <img src="/images/ingredientes/azeitona-3.webp" alt="Azeitona preta selecionada" />
      </div>
      <div class="item-azeitona az-4" id="azeitona-4">
        <img src="/images/ingredientes/azeitona-4.webp" alt="Azeitona preta selecionada" />
      </div>

      <!-- Salpicado de Orégano Aromático -->
      <div class="camada-oregano-box" id="camada-oregano">
        <img src="/images/ingredientes/oregano.webp" alt="Orégano fresco moído" class="img-oregano" />
      </div>

      <!-- Fio de Azeite e Gotas Brilhantes -->
      <div class="camada-azeite-box" id="camada-azeite">
        <svg class="azeite-gotas-svg" viewBox="0 0 400 400" width="100%" height="100%" aria-hidden="true">
          <defs>
            <radialGradient id="azeiteGoldGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#FFFDEB" />
              <stop offset="35%" stop-color="#FAD95B" />
              <stop offset="75%" stop-color="#C7961A" />
              <stop offset="100%" stop-color="#704E04" />
            </radialGradient>
          </defs>
          <ellipse cx="200" cy="130" rx="9" ry="5" fill="url(#azeiteGoldGrad)" transform="rotate(25 200 130)" />
          <ellipse cx="290" cy="200" rx="10" ry="5.5" fill="url(#azeiteGoldGrad)" transform="rotate(-15 290 200)" />
          <ellipse cx="240" cy="280" rx="9" ry="5" fill="url(#azeiteGoldGrad)" transform="rotate(35 240 280)" />
          <ellipse cx="140" cy="250" rx="8" ry="4.5" fill="url(#azeiteGoldGrad)" transform="rotate(-30 140 250)" />
          <circle cx="210" cy="215" r="4.5" fill="url(#azeiteGoldGrad)" />
        </svg>
      </div>

    </div>

    <!-- 5. Pizza Pronta Dourada com Leopard Spotting e Queijo Fumegante -->
    <div class="pizza-foto-camada camada-pizza-completa" id="camada-pizza-pronta-img">
      <img src="/images/ingredientes/pizza-pronta.webp" alt="Pizza de Calabresa Don Corleone Pronta" class="ingrediente-img img-pizza-pronta" />
      
      <!-- Fumaça e Vapor Gastronômico Quente -->
      <div class="vapor-fumaca" id="camada-vapor" aria-hidden="true">
        <span class="plume p1"></span>
        <span class="plume p2"></span>
        <span class="plume p3"></span>
      </div>

      <!-- Brilho Dourado de Forno -->
      <div class="glow-forno-sucesso" id="glow-forno"></div>
    </div>

  </div>
  `;
}
