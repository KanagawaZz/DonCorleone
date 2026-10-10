/**
 * Montagem 3D Gastronômica Hiper-Realista — Don Corleone Pizzaria
 * 
 * Estrutura em camadas de perspectiva 3D (Exploded Sandwich Stack) inspirada na referência:
 * Tábua/Pala Rústica → Disco de Massa Artesanal → Camada de Molho San Marzano → 
 * Queijo Fior di Latte → Fatias de Calabresa & Manjericão → Pizza Assada Hiper-Realista.
 */

export function gerarSvgPizzaMontagem() {
  return `
  <div class="pizza-3d-scene" id="pizza-3d-scene">
    
    <!-- Efeitos de Luz e Ambiente Cinematográfico -->
    <div class="scene-ambient-glow" aria-hidden="true"></div>
    <div class="scene-smoke-particle smoke-1" aria-hidden="true"></div>
    <div class="scene-smoke-particle smoke-2" aria-hidden="true"></div>

    <!-- Container 3D em Perspectiva Real -->
    <div class="pizza-exploded-stack" id="pizza-exploded-stack">
      
      <!-- CAMADA 0: Base / Tábua Rústica e Pala de Forno (Fundo do Stack 3D) -->
      <div class="stack-layer layer-0-base" id="layer-peel">
        <div class="layer-content">
          <img src="/images/ingredientes/pedestal.webp" alt="Tábua rústica de madeira nobre" class="layer-img img-peel" />
          <div class="layer-shadow"></div>
        </div>
      </div>

      <!-- CAMADA 1: Disco de Massa Crua de Fermentação Lenta 48h -->
      <div class="stack-layer layer-1-dough" id="layer-dough">
        <div class="layer-content">
          <img src="/images/ingredientes/massa.webp" alt="Disco de massa artesanal aerada" class="layer-img img-dough" />
          <div class="layer-shadow"></div>
        </div>
      </div>

      <!-- CAMADA 2: Molho de Tomate San Marzano Artesanal -->
      <div class="stack-layer layer-2-sauce" id="layer-sauce">
        <div class="layer-content">
          <img src="/images/ingredientes/molho.webp" alt="Molho de tomate San Marzano com textura real" class="layer-img img-sauce" />
          <div class="layer-shadow"></div>
        </div>
      </div>

      <!-- CAMADA 3: Queijo Mozzarella Fior di Latte Derretendo -->
      <div class="stack-layer layer-3-cheese" id="layer-cheese">
        <div class="layer-content">
          <img src="/images/ingredientes/queijo-forno.jpg" alt="Mussarela fior di latte no ponto de forno" class="layer-img img-cheese" />
          <div class="layer-shadow"></div>
        </div>
      </div>

      <!-- CAMADA 4: Ingredientes Nobres em Suspensão 3D (Calabresa, Manjericão, Azeitonas) -->
      <div class="stack-layer layer-4-toppings" id="layer-toppings">
        <div class="layer-content toppings-cluster">
          
          <!-- Fatias de Calabresa Tostadas com Rotação 3D Individual -->
          <div class="float-item slice-1">
            <img src="/images/ingredientes/calabresa-1.webp" alt="Calabresa tostada" />
          </div>
          <div class="float-item slice-2">
            <img src="/images/ingredientes/calabresa-2.webp" alt="Calabresa tostada" />
          </div>
          <div class="float-item slice-3">
            <img src="/images/ingredientes/calabresa-3.webp" alt="Calabresa tostada" />
          </div>
          <div class="float-item slice-4">
            <img src="/images/ingredientes/calabresa-4.webp" alt="Calabresa tostada" />
          </div>
          <div class="float-item slice-5">
            <img src="/images/ingredientes/calabresa-5.webp" alt="Calabresa tostada" />
          </div>

          <!-- Folhas de Manjericão Fresco & Azeitonas -->
          <div class="float-item herb-1">
            <img src="/images/ingredientes/azeitona-1.webp" alt="Azeitona preta" />
          </div>
          <div class="float-item herb-2">
            <img src="/images/ingredientes/azeitona-2.webp" alt="Azeitona preta" />
          </div>
          <div class="float-item herb-3">
            <img src="/images/ingredientes/cebola-1.webp" alt="Anel de cebola fina" />
          </div>
          <div class="float-item herb-4">
            <img src="/images/ingredientes/cebola-2.webp" alt="Anel de cebola fina" />
          </div>

        </div>
      </div>

      <!-- CAMADA 5: A Pizza Pronta Hiper-Realista (Revelação Final / Fusão Perfeita) -->
      <div class="stack-layer layer-5-baked" id="layer-baked">
        <div class="layer-content">
          <img src="/images/cardapio/margherita-especial.jpg" alt="Pizza artesanal Don Corleone assada no forno a lenha" class="layer-img img-baked" />
          <div class="baked-steam-wrap" id="baked-steam" aria-hidden="true">
            <span class="steam-vap s1"></span>
            <span class="steam-vap s2"></span>
            <span class="steam-vap s3"></span>
          </div>
          <div class="baked-highlight-glow"></div>
        </div>
      </div>

    </div>

    <!-- Elementos de Profundidade em Primeiro Plano (Foreground Floating Leaves) -->
    <div class="foreground-floating-elements" aria-hidden="true">
      <div class="fg-item fg-leaf-1">
        <img src="/images/ingredientes/calabresa-6.webp" alt="" />
      </div>
      <div class="fg-item fg-leaf-2">
        <img src="/images/ingredientes/azeitona-3.webp" alt="" />
      </div>
    </div>

  </div>
  `;
}
