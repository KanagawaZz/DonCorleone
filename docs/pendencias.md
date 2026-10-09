# Checklist de Pendências — Don Corleone (Cuiabá/MT)

Este documento lista as informações e arquivos que ainda precisam ser fornecidos pelo proprietário da Don Corleone para completar todas as seções opcionais do site.

Conforme a diretriz do projeto, **nenhuma informação não confirmada é exibida na página**. Elementos cujos dados ainda não existem ficam automaticamente ocultos até que sejam preenchidos em `src/data/site.config.js`, `src/data/cardapio.json` ou nas pastas de imagens.

---

## 1. Dados de Contato e Localização
- [ ] **DDD do telefone de delivery**: o número informado é `99265-0139`. O DDD de Cuiabá é `65`. Confirmar se o telefone completo para chamadas diretas é `(65) 99265-0139`.
- [ ] **Endereço físico completo**: rua/avenida, número, bairro e CEP da unidade Arena Cuiabá (para inclusão no rodapé e ativação do botão "Como Chegar").
- [ ] **Link do Google Maps / Waze**: link de localização exata para traçar rota.
- [ ] **Bairros atendidos e taxa de entrega**: lista de bairros ou raio de entrega e se a taxa é fixa ou por distância.
- [ ] **Tempo médio de entrega / retirada**: estimativa em minutos para entrega e retirada.

---

## 2. Cardápio e Preços
- [ ] **Itens do cardápio completo**: lista oficial de sabores de pizzas (salgadas e doces), esfihas e bebidas.
- [ ] **Preços e tamanhos**: valores individuais de cada sabor/tamanho (ex.: Broto, Média, Grande, Gigante).
- [ ] **Descrições dos ingredientes**: lista exata de ingredientes de cada item para o cardápio.
- [ ] **Formas de pagamento aceitas**: Pix, cartões de crédito/débito, dinheiro, vales.

---

## 3. Identidade Visual e Mídia
- [ ] **Logotipo oficial em alta resolução** (se desejar usar o original em vez da identidade cantina criada): colocar em `public/images/brand/logo-original.png` e ativar `usarLogoOriginal: true` em `site.config.js`.
- [ ] **Fotos reais da pizzaria e das pizzas** (mínimo de 4 para ativar a seção de galeria): colocar em `public/images/galeria/`.
- [ ] **Fotos dos itens do cardápio**: colocar em `public/images/cardapio/`.
- [ ] **Depoimentos reais de clientes**: adicionar avaliações reais em `src/data/depoimentos.json` (nome, texto e avaliação em estrelas).
- [ ] **História / texto sobre a casa**: detalhes confirmados sobre a tradição e proposta da casa para enriquecer a seção Sobre.

---

*Última atualização: Outubro de 2026*
