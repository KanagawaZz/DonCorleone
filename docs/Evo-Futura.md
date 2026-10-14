A ideia é construir um sistema que seu irmão consiga usar no dia a dia sem depender de você para alterar cada preço, cadastrar uma pizza, mudar uma taxa de entrega ou consultar um pedido.
1. O que temos hoje e o que queremos construir
O diagnóstico que você compartilhou descreve uma aplicação em JavaScript modular, com Vite, CSS próprio, GSAP, Lenis e Three.js. Ela já possui uma série de regras comerciais específicas da pizzaria, incluindo personalização de pizzas, cálculo de preços, taxas por bairro, horários, carrinho e encaminhamento de pedidos ao WhatsApp. Texto colado.txt

Camada 1 — Site público e vendas
Preservar
- Identidade visual, animações e experiência atual.
- Cardápio, categorias, busca e personalização de pizzas.
- Carrinho, pedido mínimo, retirada e entrega.
- Cálculo de preços, adicionais, cupons e taxas.
- Checkout e envio formatado pelo WhatsApp.
- Experiência mobile e recursos PWA existentes.

Camada 2 — Painel administrativo Django
Construir
- Cadastro e edição de produtos, preços e tamanhos.
- Gerenciamento de pedidos e clientes.
- Entregas, bairros, taxas e acompanhamento operacional.
- Funcionários, permissões e usuários.
- Promoções, relatórios e indicadores.
- Configurações da pizzaria, horários e pagamentos.

Camada 3 — Backend e dados centralizados
Base do sistema
- Django como aplicação principal.
- API para conectar o site ao backend.
- Banco de dados persistente.
- Autenticação, permissões e auditoria.
- Validação de preços, estoque, pedidos e regras comerciais no servidor.

O ponto mais importante: o site não precisa perder a tecnologia visual que já utiliza para passar a trabalhar com Django. O navegador pode continuar executando JavaScript, CSS, GSAP e Three.js, enquanto o Django fornece os dados e processa as operações.
2. A arquitetura que eu escolheria
Eu seguiria uma arquitetura de frontend independente + backend Django + API REST + banco de dados relacional, preparada para crescer sem precisar reescrever o sistema quando a pizzaria começar a usar mais funcionalidades.
Site público Don Corleone
JavaScript · Vite · CSS · GSAP · Lenis · Three.js
Mantém a experiência atual de compra.

HTTPS · JSON · API REST

Backend Django + Django REST Framework
Autenticação · regras de negócio · permissões · validações

PostgreSQL
Dados persistentes e relacionamentos

Painel administrativo
Operação, cadastros e relatórios


Decisões importantes antes de programar
- Não reescrever o frontend: primeiro auditar o repositório real e reaproveitar os componentes, estilos, imagens e animações existentes.
- Não depender dos arquivos JSON para sempre: catálogo, bairros, preços e configurações passam gradualmente para o banco de dados.
- Manter o WhatsApp: a primeira versão pode continuar recebendo pedidos pelo WhatsApp, agora com a possibilidade de registrar esses pedidos no sistema.
- Centralizar as regras no servidor: o preço final, os descontos, as taxas e as condições do pedido devem ser validados no Django. O JavaScript não deve ser a única fonte confiável.
- Preparar o SaaS sem complicar o MVP: estruturar a aplicação para permitir várias pizzarias no futuro, mas sem implementar cobrança recorrente, planos e uma plataforma comercial completa antes de validar o sistema com seu irmão.
- Não confundir hospedagem: o site atual está em um ambiente Cloudflare Workers. O backend Django precisará de uma hospedagem compatível com Python, banco de dados e processos de aplicação. Não se deve presumir que o Worker atual executará o Django diretamente. 



# PROJETO DON CORLEONE — MIGRAÇÃO ARQUITETURAL PARA DJANGO E CONSTRUÇÃO DE UM SAAS MODULAR

## 1. PAPEL E RESPONSABILIDADES

Atue como um arquiteto de software sênior, engenheiro full-stack especializado em Django e Python, especialista em APIs REST, modelagem de bancos de dados relacionais, sistemas SaaS, segurança de aplicações web, UX/UI e modernização de sistemas legados.

Você também deverá atuar como um desenvolvedor experiente em JavaScript, CSS, Vite, GSAP, Lenis e Three.js, pois o projeto já possui uma identidade visual elaborada e funcionalidades implementadas que precisam ser preservadas.

Não trate este trabalho como a criação de uma nova pizzaria virtual do zero.

O objetivo é evoluir um sistema existente para uma aplicação comercial mais robusta, administrável, modular, segura e preparada para expansão.

Trabalhe com rigor técnico, explique suas decisões e não faça alterações destrutivas sem autorização.

O desenvolvedor responsável pelo projeto está em fase de conclusão de Análise e Desenvolvimento de Sistemas. Portanto, priorize código organizado, explicações claras, documentação, facilidade de manutenção e decisões arquiteturais justificadas.

## 2. CONTEXTO DO PROJETO

Nome do projeto: Don Corleone — Cantina & Pizzaria.

Unidade inicial: Cidade Alta, Cuiabá/MT.

Site público atual:
https://doncorleone.ambiente-preview.workers.dev/

Repositório GitHub:
https://github.com/KanagawaZz/DonCorleone

O repositório e os arquivos locais são a fonte principal para a análise técnica. Não presuma que o código existente corresponde integralmente a uma documentação anterior ou ao comportamento atual da página publicada.

Antes de implementar qualquer coisa, inspecione o projeto real.

### Tecnologias identificadas na documentação existente

- JavaScript Vanilla ES2020+.
- Vite 6.
- CSS3 modular, com design tokens.
- GSAP para animações.
- Lenis para rolagem suave.
- Three.js para recursos visuais 3D.
- Fontsource para tipografia.
- Sharp para processamento de imagens.
- Estrutura modular de componentes e utilitários.
- Persistência local do carrinho e dos dados do cliente.
- Configurações e catálogo armazenados em arquivos JavaScript e JSON.

Confirme no código as versões efetivamente instaladas, a estrutura atual e as dependências antes de propor atualizações.

### Características comerciais identificadas

A aplicação foi concebida para uma pizzaria real, com regras específicas de operação em Cuiabá e Várzea Grande.

Entre os comportamentos documentados estão:

- Cardápio de pizzas, esfihas, sobremesas e bebidas.
- Busca, categorias, destaques e produtos.
- Personalização de pizzas por tamanho e sabor.
- Regra comercial de cobrança pelo sabor mais caro.
- Adicionais de borda recheada.
- Carrinho e checkout em etapas.
- Pedido mínimo documentado de R$ 22,00.
- Entrega por bairro, com taxas específicas.
- Retirada no balcão com taxa de entrega zerada.
- Tratamento para bairros não cadastrados.
- Horários de funcionamento e horário de corte.
- Formas de pagamento como PIX, dinheiro e cartão.
- Campo de troco quando aplicável.
- Geração de código legível de pedido.
- Montagem de mensagem organizada para o WhatsApp.
- Armazenamento local de informações para facilitar novas compras.
- Galeria, depoimentos, informações institucionais e identidade visual própria.
- Recursos de instalação PWA.

Essas informações são hipóteses iniciais de inventário, não uma autorização para presumir que tudo está funcionando corretamente.

Verifique cada regra nos arquivos existentes. Preserve os comportamentos válidos e identifique divergências antes de alterá-los.

## 3. OBJETIVO PRINCIPAL

Transformar o Don Corleone em um sistema de gestão para pizzaria, com arquitetura modular e preparada para evoluir para um SaaS.

O sistema deverá possuir duas experiências distintas, conectadas pelo mesmo backend:

### A. Site público

Uma experiência de compra moderna, visualmente sofisticada, responsiva e rápida.

Deve continuar apresentando a pizzaria, permitindo que o cliente navegue pelo cardápio, personalize produtos, monte seu carrinho, informe seus dados, escolha entrega ou retirada, selecione a forma de pagamento e finalize o pedido pelo fluxo comercial existente.

### B. Painel administrativo

Uma aplicação privada, com autenticação e permissões, para que o proprietário e os funcionários autorizados possam administrar a operação sem editar arquivos de código, JSON ou CSS.

O proprietário deve conseguir realizar operações rotineiras pela interface:

- Cadastrar e editar pizzas.
- Alterar preços.
- Adicionar sabores, bordas e adicionais.
- Cadastrar bebidas, esfihas e sobremesas.
- Alterar fotos e descrições.
- Controlar a disponibilidade dos produtos.
- Consultar pedidos.
- Gerenciar clientes.
- Atualizar taxas de entrega.
- Administrar bairros atendidos.
- Gerenciar funcionários e permissões.
- Alterar horários e configurações comerciais.
- Cadastrar promoções e cupons.
- Consultar relatórios.
- Acompanhar informações relevantes para a tomada de decisões.

O objetivo não é apenas construir um CRUD. O objetivo é criar uma ferramenta de trabalho que reduza tarefas manuais, centralize informações e facilite a operação diária da pizzaria.

## 4. REGRA ABSOLUTA: PRESERVAR A PÁGINA EXISTENTE

Esta é a prioridade número um.

Não substitua o site por um template genérico de pizzaria.

Não elimine funcionalidades apenas porque seria mais fácil reescrever o frontend.

Não substitua Vanilla JavaScript por React, Vue ou outro framework sem uma justificativa técnica concreta e aprovação explícita.

Não remova GSAP, Lenis, Three.js, animações, tipografia, imagens, efeitos visuais ou componentes existentes antes de verificar sua função.

Não simplifique o layout para acelerar a migração.

Não altere arbitrariamente cores, espaçamentos, tipografia, identidade visual, ordem das seções, responsividade ou interações.

### Procedimento obrigatório

Antes de modificar o frontend:

1. Examine a estrutura completa do projeto.
2. Identifique o ponto de entrada da aplicação.
3. Identifique todos os componentes visuais.
4. Identifique todos os arquivos CSS e design tokens.
5. Mapeie os eventos, estados e interações.
6. Localize as regras comerciais existentes.
7. Identifique os assets, imagens, fontes e modelos 3D.
8. Verifique o carrinho, checkout, persistência e integração com WhatsApp.
9. Identifique o funcionamento do PWA e do service worker.
10. Registre os comportamentos que precisam permanecer inalterados.
11. Execute o projeto e registre a situação inicial.
12. Verifique o comportamento em desktop e dispositivos móveis.

Quando possível, crie uma linha de base visual com capturas de tela e testes de navegação antes de implementar mudanças.

O resultado deverá manter a identidade visual e os fluxos atuais. Mudanças visuais somente serão realizadas quando forem necessárias, justificadas e autorizadas.

## 5. ARQUITETURA-ALVO

Adote inicialmente uma arquitetura de frontend independente, backend Django e comunicação por API REST.

### Frontend público

Manter a aplicação JavaScript/Vite existente.

O frontend será responsável por:

- Renderização da interface.
- Animações e efeitos visuais.
- Navegação e interações.
- Personalização visual de produtos.
- Estado temporário do carrinho.
- Comunicação com a API.
- Exibição de validações e mensagens.
- Construção da experiência de compra.

O frontend não será a autoridade final para preços, permissões, descontos, taxas ou confirmação de pedidos.

A interface deverá consumir os dados publicados pelo backend, sem perder a estrutura modular atual.

### Backend

Utilizar:

- Python.
- Django.
- Django REST Framework.
- PostgreSQL como banco de dados preferencial para produção.
- Django ORM e migrations.
- Sistema de autenticação e permissões do Django.
- Testes automatizados.
- Documentação da API.
- Configuração segura por variáveis de ambiente.

Escolha versões estáveis e compatíveis no momento da implementação. Registre as versões selecionadas e suas justificativas.

Não adicione bibliotecas desnecessárias.

Não introduza microserviços, Kubernetes, Redis, Celery ou infraestrutura complexa sem uma necessidade real demonstrada.

### Painel administrativo

Construa uma interface de gestão separada do site público, com identidade visual própria, mas coerente com a marca Don Corleone.

O Django Admin pode ser utilizado inicialmente para tarefas internas e administrativas de configuração.

Entretanto, não considere o Django Admin, isoladamente, como o painel operacional definitivo.

O proprietário deverá contar com uma interface simples e intuitiva para as tarefas frequentes da pizzaria.

A implementação visual do painel pode ser feita em uma etapa posterior à estabilização do backend e dos primeiros módulos.

### Infraestrutura

A hospedagem atual do frontend utiliza Cloudflare Workers.

Não presuma que essa infraestrutura executará diretamente o backend Django.

Avalie opções compatíveis para hospedar o backend Python, banco de dados, arquivos de mídia e tarefas de manutenção.

Mantenha frontend e backend desacoplados o suficiente para que possam ser implantados separadamente.

Não migre o domínio, altere DNS, substitua a publicação atual ou execute mudanças irreversíveis de infraestrutura sem autorização.

## 6. ORGANIZAÇÃO MODULAR DO DJANGO

Organize o backend em aplicativos de domínio independentes, com responsabilidades bem definidas.

A estrutura abaixo é uma proposta inicial que deve ser refinada após a auditoria:

backend/
    manage.py
    config/
        settings/
        urls.py
        asgi.py
        wsgi.py

    apps/
        core/
        accounts/
        tenants/
        catalog/
        pricing/
        customers/
        orders/
        delivery/
        payments/
        promotions/
        inventory/
        employees/
        reporting/
        audit/

    tests/
    requirements/
    docs/

A estrutura final deve ser simples, coerente e compatível com o tamanho real do sistema. Não crie aplicativos vazios apenas para seguir uma estrutura idealizada.

### core

Responsável por funcionalidades compartilhadas, configurações comuns e componentes reutilizáveis do backend.

Não transforme esse aplicativo em um depósito de todas as regras de negócio.

### accounts

Responsável pela autenticação, usuários, grupos, permissões e recuperação de acesso.

Utilize um modelo de usuário customizado desde o início, caso essa seja a decisão adotada após a auditoria. Faça isso antes da criação das primeiras migrations de produção.

### tenants

Preparar a arquitetura para que diferentes estabelecimentos possam utilizar a plataforma futuramente.

Inicialmente, o Don Corleone será o primeiro estabelecimento atendido.

Planeje uma entidade de estabelecimento, com identificação, nome comercial, status e configurações próprias.

Não implemente uma plataforma multiempresa completa antes de validar a primeira operação.

### catalog

Responsável pelo catálogo de produtos:

- Categorias.
- Produtos.
- Sabores.
- Tamanhos.
- Bordas.
- Adicionais.
- Imagens.
- Descrições.
- Preços-base.
- Disponibilidade.
- Destaques.
- Ordenação de exibição.

Modele corretamente as diferenças entre uma pizza personalizável e um produto de adição direta ao carrinho.

Não use um único campo genérico de texto para representar todas as características dos produtos.

### pricing

Responsável pelas regras de precificação:

- Cálculo de pizzas com múltiplos sabores.
- Regra do sabor mais caro, conforme confirmada no sistema atual.
- Adicionais e bordas.
- Preços por tamanho.
- Promoções e descontos aplicáveis.
- Validação de valores.
- Cálculo de subtotais e totais.

Evite duplicar a mesma regra em vários módulos.

Crie funções de domínio testáveis e utilize-as nos fluxos que precisam calcular preços.

### customers

Responsável pelo cadastro e histórico de clientes.

Campos possíveis:

- Nome.
- Telefone.
- Endereços.
- Observações operacionais.
- Data do primeiro pedido.
- Data do último pedido.
- Histórico de pedidos.

Não armazene informações sensíveis desnecessárias.

Considere que pedidos antigos devem preservar seus dados históricos, mesmo quando o cadastro atual do cliente for atualizado.

### orders

Responsável pelos pedidos e seus itens.

Deve contemplar:

- Código legível do pedido.
- Estabelecimento.
- Cliente.
- Origem do pedido.
- Itens e quantidades.
- Tamanho e sabores selecionados.
- Bordas e adicionais.
- Valores unitários e totais.
- Descontos.
- Taxa de entrega.
- Forma de pagamento.
- Modalidade de atendimento.
- Endereço de entrega.
- Observações.
- Datas relevantes.
- Histórico de status.
- Identificação do funcionário responsável quando aplicável.

Os itens devem preservar uma fotografia comercial dos dados utilizados no momento da compra: descrição, composição, preço e adicionais.

Uma alteração posterior no catálogo não pode modificar silenciosamente o conteúdo ou o valor de um pedido já realizado.

Crie estados de pedido explícitos, com transições válidas e registradas.

Não permita que qualquer funcionário altere qualquer pedido sem respeitar suas permissões.

### delivery

Responsável por:

- Cidades atendidas.
- Bairros.
- Taxas.
- Tempo estimado, quando configurado.
- Disponibilidade de entrega.
- Regras de retirada.
- Exceções e bairros sob consulta.
- Configurações de atendimento logístico.

Migre a base atual de bairros e taxas sem perder registros.

O valor de uma taxa deve ser calculado ou confirmado pelo servidor. Não confie exclusivamente no valor enviado pelo navegador.

### payments

Responsável por registrar informações relacionadas ao pagamento.

Na primeira versão, priorize o registro do método escolhido e do estado operacional do pagamento.

Não implemente processamento de cartão, armazenamento de dados de cartão ou integração financeira complexa sem requisitos específicos.

A escolha de PIX, dinheiro ou cartão no checkout não significa que o pagamento tenha sido efetivamente recebido.

Diferencie pagamento informado, pagamento pendente, pagamento confirmado, falha e estorno quando esses estados forem aplicáveis.

### promotions

Responsável por:

- Cupons.
- Descontos.
- Vigência.
- Ativação e desativação.
- Regras de elegibilidade.
- Limites de uso.
- Condições de pedido mínimo, se aplicáveis.

Valide todos os cupons no backend.

### inventory

Prepare o módulo para controle de estoque de bebidas, embalagens, ingredientes e outros itens.

Entretanto, não implemente consumo automático de ingredientes por receita sem antes definir como a pizzaria controla suas matérias-primas.

Comece com o inventário realmente necessário à operação e deixe a gestão de fichas técnicas, custos e baixa automática de ingredientes para uma etapa planejada.

### employees

Responsável pela gestão operacional dos funcionários.

Não crie um segundo sistema de autenticação independente.

Utilize os usuários do sistema, relacionando-os a funções e permissões operacionais.

### reporting

Responsável por consultas e indicadores consolidados:

- Pedidos por período.
- Faturamento registrado.
- Ticket médio.
- Produtos mais vendidos.
- Distribuição por forma de pagamento.
- Pedidos por modalidade.
- Cancelamentos.
- Taxas de entrega.
- Clientes recorrentes.

Defina claramente cada indicador.

Diferencie valor dos pedidos, pagamentos efetivamente confirmados e faturamento contábil. Não apresente um como se fosse o outro.

### audit

Responsável pelo histórico de operações importantes:

- Alterações de preços.
- Mudanças nas taxas.
- Alterações de status.
- Cancelamentos.
- Mudanças de permissões.
- Alterações de configurações críticas.

Registre autor, data, objeto afetado e informações necessárias para rastreabilidade, evitando armazenar segredos ou dados sensíveis desnecessários.

## 7. MODELAGEM DO BANCO DE DADOS

Antes de implementar os modelos, produza um diagrama de entidades e relacionamentos.

Considere, no mínimo:

- Estabelecimento.
- Usuário.
- Perfil e permissões.
- Categoria.
- Produto.
- Sabor.
- Tamanho.
- Adicional.
- Borda.
- Produto e composição comercial.
- Cliente.
- Endereço.
- Cidade.
- Bairro.
- Taxa de entrega.
- Pedido.
- Item do pedido.
- Sabores de cada pizza.
- Adicionais de cada item.
- Pagamento.
- Cupom.
- Histórico de status.
- Estoque.
- Movimento de estoque.
- Registro de auditoria.

Não crie todas essas tabelas automaticamente sem avaliar sua necessidade e cardinalidade.

Explique quais entidades serão independentes, quais serão relacionamentos e quais dados deverão ser armazenados como snapshots históricos.

Use chaves estrangeiras, restrições, índices e regras de integridade apropriadas.

Valores monetários devem utilizar tipos decimais adequados, nunca ponto flutuante binário como representação principal de dinheiro.

Defina regras para:

- Exclusão lógica ou inativação de produtos.
- Integridade de pedidos históricos.
- Unicidade dos códigos de pedido.
- Concorrência na geração de códigos.
- Precisão e arredondamento monetário.
- Datas, horários e fuso America/Cuiaba.
- Relacionamentos entre estabelecimentos e seus dados.

Não permita que exclusões de cadastros destruam o histórico comercial.

## 8. PREPARAÇÃO PARA SAAS MULTIEMPRESA

O sistema deve começar atendendo à pizzaria do meu irmão, mas não deve ser arquitetado de forma que uma expansão futura exija reescrever toda a aplicação.

Considere o conceito de tenant ou estabelecimento.

Planeje como produtos, clientes, pedidos, taxas, funcionários e configurações serão vinculados ao estabelecimento correto.

No futuro, diferentes pizzarias poderão ter:

- Catálogos independentes.
- Preços próprios.
- Identidade visual própria.
- Horários próprios.
- Bairros e taxas próprios.
- Funcionários e permissões próprias.
- Pedidos e clientes isolados.
- Domínio ou subdomínio próprio, caso necessário.

Implemente isolamento de dados no backend.

Nunca confie em um identificador de estabelecimento enviado pelo cliente sem verificar a autorização correspondente.

Crie testes que comprovem que um usuário de um estabelecimento não consegue consultar, modificar ou excluir dados de outro.

Não implemente ainda cobrança de assinaturas, planos, trial, marketplace ou faturamento do SaaS sem aprovação.

A prioridade inicial é construir uma arquitetura pronta para crescer, não antecipar toda a complexidade de um produto comercial multiempresa.

## 9. API REST

Utilize Django REST Framework para disponibilizar os recursos necessários ao frontend.

Organize os endpoints sob um prefixo versionado, como /api/v1/.

Planeje endpoints para:

- Catálogo público.
- Categorias e produtos.
- Configurações públicas da unidade.
- Horários e status de atendimento.
- Bairros e taxas.
- Validação de cupons.
- Simulação de preços.
- Criação de pedidos.
- Consulta administrativa de pedidos.
- Atualização de status.
- Clientes.
- Estoque.
- Funcionários e permissões.
- Relatórios.

O conjunto definitivo de endpoints deverá refletir os módulos implementados, não uma lista de rotas criadas artificialmente.

Separe as operações públicas das operações administrativas.

O catálogo público poderá permitir leitura dos dados que a pizzaria deseja divulgar.

As rotas administrativas deverão exigir autenticação e autorização.

Não exponha informações de clientes, relatórios internos, dados financeiros privados ou cadastros de funcionários nas rotas públicas.

Implemente validação de entrada, respostas consistentes, paginação quando apropriada e tratamento de erros.

Utilize transações de banco de dados nos processos que exigem consistência entre múltiplas operações.

Documente os endpoints, os parâmetros, os formatos de resposta e os erros esperados.

## 10. MIGRAÇÃO DO FRONTEND PARA A API

Não conecte a interface diretamente aos modelos ou ao banco de dados.

Crie uma camada de serviços no frontend responsável pelas requisições à API.

Organize a comunicação de forma modular, por exemplo:

src/
    api/
        client.js
        catalog.js
        delivery.js
        pricing.js
        orders.js
        settings.js

Adapte a estrutura real existente em vez de impor essa árvore sem necessidade.

O site deve consumir os dados do catálogo e das configurações a partir do backend.

Evite espalhar URLs de API, lógica de requisição e tratamento de erros por todos os componentes.

Centralize configurações de ambiente, estados de carregamento, erros de rede e tratamento de respostas.

Mantenha a estrutura de componentes, o carrinho, os modais, a personalização das pizzas e as animações existentes.

Avalie cuidadosamente como migrar a persistência do carrinho e dos dados do cliente.

O carrinho local poderá continuar sendo usado como estado temporário, mas o servidor deverá validar os produtos, preços, adicionais e regras antes de aceitar o pedido.

Não permita que um preço adulterado no navegador determine o valor final da compra.

Não remova a possibilidade de recompra facilitada sem avaliar o comportamento atual.

## 11. FLUXO DE PEDIDO

O fluxo de compra atual deverá continuar funcional.

Fluxo de referência:

1. Cliente acessa o site.
2. Visualiza o horário e as informações da pizzaria.
3. Navega pelo catálogo.
4. Seleciona produtos.
5. Personaliza pizzas.
6. Adiciona produtos ao carrinho.
7. Confere quantidades e valores.
8. Informa entrega ou retirada.
9. Seleciona bairro quando aplicável.
10. Informa os dados necessários.
11. Escolhe a forma de pagamento.
12. Confirma os dados do pedido.
13. O backend valida o conteúdo, o preço, a taxa, o horário e as demais regras aplicáveis.
14. O pedido é persistido no banco de dados.
15. O sistema devolve um identificador e os dados necessários à confirmação.
16. O frontend apresenta a confirmação e disponibiliza o encaminhamento para o WhatsApp.

A criação do pedido deve ser tratada com cuidado para evitar registros duplicados em tentativas repetidas de envio.

Avalie uma estratégia de idempotência para a criação de pedidos.

Não dependa exclusivamente de um código gerado no navegador.

O backend deve ser responsável por gerar ou validar o código definitivo.

Se a persistência do pedido falhar, não apresente uma confirmação de pedido registrado.

Se o WhatsApp estiver indisponível, o pedido que já foi registrado no servidor não deve desaparecer.

Explique a diferença entre pedido registrado no sistema, mensagem aberta no WhatsApp, pedido aceito pela equipe e pedido efetivamente confirmado para produção.

A primeira versão pode manter o WhatsApp como canal operacional. Não presuma que o cliente precisa criar uma conta ou pagar dentro do site.

## 12. GERENCIAMENTO DE PEDIDOS

O painel administrativo deverá ter uma tela de pedidos clara e operacional.

Avalie uma apresentação em lista ou quadro por status.

Cada pedido deverá exibir, conforme a necessidade:

- Código.
- Data e horário.
- Nome e telefone do cliente.
- Itens e quantidades.
- Sabores, tamanhos e adicionais.
- Modalidade de atendimento.
- Endereço.
- Forma e estado do pagamento.
- Taxa de entrega.
- Total.
- Observações.
- Histórico de alterações.

Planeje estados como:

- Novo.
- Em confirmação.
- Confirmado.
- Em preparação.
- Pronto para retirada ou envio.
- Saiu para entrega.
- Concluído.
- Cancelado.

Esses estados são uma proposta inicial e deverão ser adaptados ao processo real da pizzaria.

Defina transições permitidas e os perfis autorizados a realizá-las.

O sistema deve registrar quem realizou alterações operacionais importantes.

Não exija atualização em tempo real por WebSocket na primeira versão se uma atualização periódica ou manual for suficiente.

Caso seja necessário oferecer atualização instantânea, justifique a tecnologia e sua complexidade operacional.

## 13. MÓDULOS DO PAINEL ADMINISTRATIVO

Planeje uma navegação simples, com sidebar, cabeçalho, indicadores e páginas específicas para cada módulo.

### Dashboard

Apresentar informações úteis para a operação:

- Pedidos de hoje.
- Pedidos pendentes.
- Pedidos em preparação.
- Pedidos concluídos.
- Total registrado no período.
- Ticket médio.
- Produtos em destaque.
- Avisos operacionais.

Os números devem vir do banco de dados e respeitar os filtros de período e as regras de cálculo.

### Cardápio

Permitir criar, visualizar, editar, ativar, inativar e organizar produtos.

Oferecer formulários apropriados para pizzas personalizáveis e produtos simples.

Possibilitar upload de imagens, validação de campos e visualização dos dados antes da publicação.

### Pedidos

Oferecer filtros por data, status, modalidade, cliente e forma de pagamento, conforme aplicável.

Permitir consultar detalhes e executar ações autorizadas.

### Clientes

Permitir consulta, edição autorizada, histórico de compras e gerenciamento de endereços.

Respeitar os princípios de necessidade, transparência e segurança no tratamento de dados pessoais.

### Entregas

Permitir cadastrar cidades e bairros, editar taxas e ativar ou desativar áreas atendidas.

### Promoções

Permitir administrar cupons, validade, descontos e condições de uso.

### Estoque

Disponibilizar consultas e movimentações somente depois de definir quais produtos e materiais serão controlados.

### Funcionários

Permitir gerenciar acessos e funções de acordo com permissões definidas.

### Relatórios

Oferecer filtros por período e indicadores comerciais consistentes.

### Configurações

Centralizar:

- Nome e informações da unidade.
- Endereço.
- Telefone e WhatsApp.
- Chave PIX pública, caso a pizzaria deseje divulgá-la.
- Horários.
- Pedido mínimo.
- Taxas e regras comerciais.
- Configurações públicas do site.

A alteração dessas informações deverá refletir no frontend sem exigir uma nova compilação do site.

Não exponha credenciais, chaves privadas ou configurações internas do servidor.

## 14. EXPERIÊNCIA VISUAL DO PAINEL

A identidade visual do painel deve ser profissional, sofisticada e coerente com a marca Don Corleone.

O site público atual é a referência visual da marca. O painel não precisa copiar a composição da landing page.

Priorize:

- Boa hierarquia visual.
- Contraste adequado.
- Tipografia legível.
- Navegação consistente.
- Tabelas funcionais.
- Formulários organizados.
- Feedback claro de sucesso e erro.
- Confirmação para ações destrutivas.
- Estados vazios úteis.
- Indicadores de carregamento.
- Responsividade.
- Acessibilidade por teclado.
- Boa utilização em telas de computador e celular.

Evite interfaces genéricas, excesso de gradientes, animações desnecessárias ou excesso de indicadores sem utilidade operacional.

As tarefas frequentes devem exigir poucos passos.

## 15. SEGURANÇA

A aplicação será responsável por dados de clientes, pedidos e informações operacionais.

Implemente as proteções adequadas desde o início.

Considere:

- HTTPS.
- Proteção de credenciais por variáveis de ambiente.
- Senhas tratadas pelo sistema de autenticação do Django.
- Proteção CSRF conforme o mecanismo de autenticação.
- Validação de permissões em cada operação administrativa.
- Validação e normalização dos dados de entrada.
- Proteção contra SQL injection utilizando o ORM ou consultas parametrizadas.
- Proteção contra XSS.
- Controle de acesso aos arquivos enviados.
- Limites para upload de imagens.
- Rate limiting em endpoints sensíveis, quando necessário.
- Limitação de tentativas de autenticação.
- Logs sem exposição de segredos.
- Backups e procedimentos de restauração.
- Política de retenção de dados.
- Proteção contra acesso indevido entre estabelecimentos.
- Tratamento seguro de erros.

A autenticação do frontend não substitui a autorização no backend.

Não inclua senhas, tokens ou segredos no repositório.

Não utilize dados de produção reais em testes automatizados sem autorização e medidas de proteção.

Considere a LGPD na coleta, utilização, armazenamento e exclusão de dados pessoais.

## 16. TESTES E QUALIDADE

Não considere o projeto concluído apenas porque o servidor inicia sem erros.

Crie testes automatizados para as regras comerciais e os fluxos críticos.

### Testes do catálogo e precificação

- Preços por tamanho.
- Pizzas com um, dois e três sabores, quando permitido.
- Regra do sabor mais caro.
- Bordas e adicionais.
- Produtos indisponíveis.
- Alterações de preço.
- Promoções e cupons.

### Testes de entrega

- Bairros cadastrados.
- Taxas corretas.
- Retirada sem cobrança de frete.
- Bairros não atendidos ou sob consulta.
- Alterações de taxas.
- Horários e fuso horário.

### Testes de pedidos

- Criação válida.
- Dados inválidos.
- Produtos inativos.
- Preço adulterado.
- Pedido mínimo.
- Tentativas duplicadas.
- Atualizações de status.
- Preservação do histórico.
- Falha de banco de dados.
- Permissões de acesso.

### Testes de segurança

- Usuário anônimo não acessa operações privadas.
- Funcionário não executa operações sem permissão.
- Um estabelecimento não acessa dados de outro.
- Dados sensíveis não aparecem nas respostas públicas.

### Testes de frontend

- Carregamento do catálogo pela API.
- Personalização de pizzas.
- Carrinho.
- Checkout.
- Tratamento de erros.
- Persistência local.
- Abertura do WhatsApp.
- Layout mobile.
- Animações.
- PWA, caso permaneça habilitado.

Use testes unitários para regras isoladas, testes de integração para a API e testes de ponta a ponta para os principais fluxos de compra.

Não introduza uma estrutura de testes excessivamente complexa sem necessidade.

## 17. MIGRAÇÃO DOS DADOS EXISTENTES

Identifique os dados presentes nos arquivos atuais:

- cardapio.json.
- bairros.json.
- site.config.js.
- compre-junto.js.
- depoimentos.json.
- Outros arquivos que contenham dados ou configurações comerciais.

Crie um plano de importação para migrar os dados válidos ao banco de dados.

Preserve nomes, descrições, categorias, preços, tamanhos, sabores, imagens, taxas e configurações necessárias.

Antes da importação:

1. Faça uma cópia de segurança dos arquivos originais.
2. Analise duplicidades e inconsistências.
3. Identifique campos obrigatórios e opcionais.
4. Defina como tratar dados inválidos.
5. Prepare um comando de importação repetível e documentado.
6. Valide as quantidades de registros importados.
7. Compare amostras do resultado com a fonte.
8. Garanta que uma nova execução não duplique registros indevidamente.

Não invente produtos, preços, taxas ou horários ausentes.

Não substitua dados desconhecidos por valores arbitrários.

Registre os itens que precisam de confirmação do proprietário.

Não remova os arquivos de origem até validar a importação e aprovar a transição.

## 18. REQUISITOS NÃO FUNCIONAIS

O sistema deve priorizar:

- Manutenibilidade.
- Separação de responsabilidades.
- Baixo acoplamento.
- Consistência dos dados.
- Segurança.
- Desempenho.
- Responsividade.
- Observabilidade.
- Facilidade de implantação.
- Facilidade de restauração.
- Documentação.
- Testabilidade.

Evite arquivos excessivamente grandes e funções com muitas responsabilidades.

Evite lógica de negócio dentro de componentes visuais, serializers ou views quando ela merecer uma camada de domínio própria.

Não crie abstrações genéricas sem necessidade.

Não adote arquitetura de microserviços neste estágio.

Monólito modular é a estratégia inicial preferida: uma aplicação Django organizada por domínios, com banco relacional e API bem definida.

## 19. DOCUMENTAÇÃO OBRIGATÓRIA

Mantenha a documentação atualizada conforme o sistema evolui.

Crie ou atualize:

- README principal.
- Visão geral da arquitetura.
- Diagrama de entidades e relacionamentos.
- Descrição dos módulos.
- Regras comerciais.
- Documentação da API.
- Instruções para configurar o ambiente local.
- Instruções para executar testes.
- Processo de migração dos dados.
- Variáveis de ambiente necessárias.
- Guia de implantação.
- Procedimento de backup e restauração.
- Histórico das principais decisões arquiteturais.

Documente as alterações de forma que outro desenvolvedor consiga entender e manter o projeto.

## 20. ESTRATÉGIA DE IMPLEMENTAÇÃO EM FASES

Não implemente todos os módulos de uma só vez.

Divida o trabalho em fases verificáveis.

### Fase 0 — Auditoria e planejamento

- Inspecionar o repositório.
- Confirmar a estrutura real.
- Executar o frontend.
- Registrar as funcionalidades existentes.
- Identificar regras comerciais.
- Identificar riscos e dependências.
- Propor arquitetura.
- Criar diagrama de dados.
- Elaborar plano de migração.
- Apresentar dúvidas e decisões pendentes.

Nenhuma alteração destrutiva nesta fase.

### Fase 1 — Fundação do backend

- Criar o projeto Django.
- Configurar o ambiente.
- Configurar o banco de dados.
- Definir autenticação.
- Definir estrutura modular.
- Configurar variáveis de ambiente.
- Configurar testes.
- Criar documentação inicial.
- Implementar o primeiro conjunto de modelos e migrations.

O frontend existente deverá continuar funcionando sem alterações desnecessárias.

### Fase 2 — Catálogo e configurações

- Modelar categorias e produtos.
- Modelar sabores, tamanhos e adicionais.
- Modelar bairros, taxas e horários.
- Importar os dados existentes.
- Implementar os primeiros endpoints públicos.
- Testar a consistência dos dados importados.

### Fase 3 — Integração com o site

- Criar a camada de comunicação com a API.
- Substituir gradualmente a leitura dos arquivos estáticos.
- Preservar carrinho, personalização e checkout.
- Validar os preços no backend.
- Preservar a geração da mensagem do WhatsApp.
- Testar todos os fluxos.
- Manter um caminho claro de reversão durante a transição.

### Fase 4 — Registro e operação de pedidos

- Implementar persistência dos pedidos.
- Implementar códigos de pedido.
- Criar histórico de status.
- Criar regras de transição.
- Implementar proteção contra duplicidade.
- Criar consultas administrativas.
- Garantir consistência e permissões.

### Fase 5 — Painel administrativo inicial

- Implementar autenticação.
- Criar dashboard operacional.
- Implementar gestão de catálogo.
- Implementar gestão de pedidos.
- Implementar gestão de clientes.
- Implementar gestão de entregas.
- Implementar configurações comerciais.

Priorize as funcionalidades de maior utilidade para o proprietário.

### Fase 6 — Módulos adicionais

- Funcionários e permissões detalhadas.
- Promoções e cupons.
- Relatórios.
- Auditoria.
- Estoque, conforme os requisitos reais.

### Fase 7 — Preparação para produção

- Configurar ambiente de produção.
- Configurar HTTPS.
- Configurar banco de dados e arquivos de mídia.
- Configurar backups.
- Executar testes.
- Validar a checklist de segurança do Django.
- Verificar logs e monitoramento.
- Testar restauração.
- Validar todos os fluxos do site.
- Planejar a publicação e a reversão.

### Fase 8 — Evolução comercial do SaaS

Somente após a primeira operação estar estável, avaliar:

- Múltiplas pizzarias.
- Planos e assinaturas.
- Isolamento multiempresa.
- Domínios personalizados.
- Integrações de pagamento.
- Notificações automáticas.
- Relatórios avançados.
- Aplicativo ou PWA operacional para funcionários.

Esses recursos não devem atrasar a entrega do sistema inicial.

## 21. REGRAS DE TRABALHO PARA A IA DE PROGRAMAÇÃO

Siga rigorosamente estas instruções durante a execução.

1. Antes de editar qualquer arquivo, inspecione o contexto relevante.
2. Não suponha que os arquivos, nomes, caminhos ou funções descritos neste prompt existam exatamente como foram apresentados.
3. Não substitua arquivos inteiros quando uma alteração localizada for suficiente.
4. Não apague código funcional sem demonstrar a necessidade.
5. Não atualize dependências indiscriminadamente.
6. Não exponha credenciais nem dados de clientes.
7. Não execute comandos destrutivos sem autorização.
8. Não altere o ambiente de produção sem autorização explícita.
9. Não faça deploy automaticamente.
10. Não altere o domínio, DNS ou configurações da hospedagem sem autorização.
11. Não considere um teste aprovado sem executá-lo e verificar o resultado.
12. Não declare uma funcionalidade concluída se ela estiver apenas parcialmente implementada.
13. Não esconda erros de implementação.
14. Não invente resultados de testes.
15. Registre os arquivos alterados e o motivo de cada mudança relevante.
16. Faça alterações pequenas, coerentes e verificáveis.
17. Preserve compatibilidade sempre que possível.
18. Explique decisões importantes em linguagem clara.
19. Utilize Git para organizar o trabalho, respeitando as alterações existentes do desenvolvedor.
20. Não execute comandos que descartem modificações locais ou sobrescrevam dados sem autorização.

Ao encontrar ambiguidades, liste-as e diferencie fatos confirmados, hipóteses e decisões pendentes.

Se houver mais de uma alternativa técnica viável, apresente a recomendação principal e explique seus custos, benefícios e consequências de manutenção.

Não faça perguntas sobre detalhes que podem ser descobertos diretamente no código.

## 22. CRITÉRIOS DE ACEITAÇÃO

O sistema não será considerado pronto enquanto os seguintes critérios não forem atendidos:

- A identidade visual do site permanece preservada.
- Os principais fluxos atuais continuam funcionando.
- O catálogo pode ser administrado sem editar JSON.
- As taxas de entrega podem ser administradas pelo painel.
- Os horários e as configurações comerciais podem ser atualizados sem recompilar o frontend.
- Os preços são validados no servidor.
- Os pedidos são persistidos corretamente.
- O WhatsApp continua disponível como canal de atendimento.
- O painel exige autenticação.
- As permissões são verificadas no backend.
- Os dados históricos dos pedidos permanecem consistentes.
- A importação dos dados é verificável.
- Os testes críticos passam.
- A documentação permite executar o projeto localmente.
- A implantação tem um procedimento definido de backup e reversão.
- O sistema está preparado arquiteturalmente para uma futura expansão multiempresa, sem exigir que todos os recursos de SaaS sejam implementados imediatamente.

## 23. SUA PRIMEIRA TAREFA: NÃO CODIFICAR

Neste primeiro momento, NÃO implemente a migração.

Realize apenas a auditoria técnica e o planejamento.

Quero que você entregue um relatório contendo:

1. Diagnóstico da estrutura atual.
2. Funcionalidades encontradas e seu estado aparente.
3. Regras de negócio confirmadas no código.
4. Componentes que devem permanecer intactos.
5. Dados que precisam ser migrados.
6. Riscos técnicos e operacionais.
7. Arquitetura Django recomendada.
8. Diagrama inicial de entidades e relacionamentos.
9. Estratégia de comunicação entre frontend e backend.
10. Estratégia de preservação do carrinho e do checkout.
11. Plano de migração dos dados.
12. Estratégia de testes e reversão.
13. Sugestão de infraestrutura de implantação.
14. Fases de implementação e critérios de conclusão.
15. Lista de dúvidas que realmente dependem do proprietário da pizzaria.

Classifique cada conclusão como:

- CONFIRMADO NO CÓDIGO.
- IDENTIFICADO NA DOCUMENTAÇÃO.
- HIPÓTESE A VALIDAR.
- DECISÃO PENDENTE.

Ao final, apresente uma recomendação técnica objetiva sobre a melhor estratégia de migração.

Aguarde minha aprovação antes de começar a modificar os arquivos.

A prioridade absoluta é construir um sistema robusto e modular sem perder o trabalho já realizado no Don Corleone.



4. O que eu faria depois de executar esse prompt
Eu não começaria tentando construir todos os módulos. Seguiria esta ordem, porque ela reduz o risco de comprometer o site e já entrega valor real ao seu irmão.

Etapa 1 — Auditoria e inventário
A IA lê o código, identifica as regras existentes e monta o plano. Nenhuma mudança funcional ainda.



Etapa 2 — Catálogo administrável
O Django passa a armazenar os produtos, sabores, preços, tamanhos, taxas e configurações. Você já começa a eliminar a dependência de editar JSON.



Etapa 3 — Site conectado ao backend
A página continua visualmente igual, mas os dados passam a vir da API. O carrinho e o checkout são validados pelo servidor.



Etapa 4 — Pedidos e operação
O proprietário começa a consultar os pedidos registrados, acompanhar o andamento e organizar o atendimento.



Etapa 5 — Gestão e expansão
Clientes, funcionários, relatórios, estoque e preparação para atender outras pizzarias.



5. Três decisões que merecem atenção
1. Não transformar o sistema inteiro em Django Templates por obrigação. O Django pode fornecer a API e o frontend atual pode continuar independente. Isso permite aproveitar o trabalho visual já realizado.
2. Não manter o WhatsApp como única fonte dos pedidos. Ao persistir cada pedido no banco antes de oferecer o encaminhamento para o WhatsApp, você abre caminho para relatórios, histórico e gestão operacional. O processo precisa distinguir um pedido registrado de um pedido aceito pela equipe.
3. Não confundir um sistema para uma pizzaria com um SaaS completo. O primeiro estabelecimento deve ser atendido muito bem. O isolamento por estabelecimento precisa ser planejado desde o início, mas assinaturas, cobrança e provisionamento de novas pizzarias podem ficar para depois.