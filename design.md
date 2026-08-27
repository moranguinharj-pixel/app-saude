# Plano de Interface — Registro Pessoal

## Objetivo do produto

O **Registro Pessoal** será um aplicativo Android em orientação retrato, planejado para uso com uma mão e para armazenamento local de dados pessoais. A experiência deve permitir que a pessoa registre métricas de saúde, capture uma observação meteorológica associada à localização atual, organize eventos em um calendário próprio e consulte relatórios simples, sem criar conta e sem depender de servidor.

O aplicativo não interpreta dados de saúde, não emite diagnósticos e não substitui orientação profissional. Ele apenas organiza os valores que a própria pessoa escolher registrar.

## Diretrizes visuais e de interação

O desenho seguirá os padrões de interface mobile contemporâneos, com áreas de toque amplas, texto de alto contraste, navegação inferior e ações principais ao alcance do polegar. A tela inicial priorizará um resumo do dia e um único botão de ação rápida. Formulários abrirão em telas dedicadas ou folhas modais, com campos grandes, rótulos claros e confirmação visual ao salvar.

| Elemento | Decisão de interface |
|---|---|
| Orientação | Retrato 9:16, com conteúdo principal centralizado e margem lateral de 20 px. |
| Navegação | Barra inferior com quatro destinos: Início, Registros, Calendário e Relatórios. |
| Ação primária | Botão flutuante ou botão destacado “Adicionar registro”, dependendo da tela atual. |
| Feedback | Estados de carregamento para clima, confirmação discreta após salvar e mensagens claras para permissões ou ausência de conexão. |
| Acessibilidade | Texto mínimo de 14 px, contraste elevado, ícones acompanhados de rótulos e áreas de toque com pelo menos 44 px. |

## Cores da marca

A marca usa uma paleta serena que associa saúde, ambiente e organização pessoal. O azul petróleo cria confiança, o verde sálvia identifica saúde e o dourado suave destaca condições climáticas e alertas não críticos.

| Token | Cor clara | Cor escura | Aplicação |
|---|---:|---:|---|
| Primária | `#176B87` | `#49A6C4` | Navegação ativa, ações principais e links. |
| Fundo | `#F7FAFC` | `#10191D` | Fundo geral das telas. |
| Superfície | `#FFFFFF` | `#18262C` | Cartões, formulários e folhas. |
| Texto | `#152A33` | `#E7F0F2` | Conteúdo principal. |
| Saúde | `#3F8D72` | `#70C5A6` | Etiquetas, indicadores e gráficos de saúde. |
| Clima | `#D79127` | `#F3BE67` | Temperatura, condição e alertas de clima. |
| Calendário | `#6966B3` | `#A9A7E4` | Eventos e datas selecionadas. |

## Lista de telas

| Tela | Conteúdo principal | Funções |
|---|---|---|
| Início | Saudação, data, resumo do próximo evento, último registro de saúde e clima salvo. | Acessar rapidamente cada área e iniciar um novo registro. |
| Registros | Segmentos de Saúde e Clima, filtros por período e lista cronológica. | Criar, visualizar e excluir registros locais. |
| Novo registro de saúde | Categoria livre, métrica, valor, unidade, data/hora e observação opcional. | Salvar uma informação inserida manualmente sem avaliação clínica. |
| Capturar clima | Status de localização, local aproximado, temperatura, sensação térmica, umidade, condição e data/hora. | Solicitar permissão, consultar o clima atual e salvar um retrato meteorológico local. |
| Calendário | Calendário mensal, agenda do dia e lista de próximos eventos. | Criar, editar e remover eventos próprios com título, data/hora, categoria e nota. |
| Relatórios | Seletor de período, totais, tendências de métricas numéricas e histórico climático. | Consultar sínteses locais e preparar exportação de dados. |
| Configurações | Preferências de unidades, privacidade local, dados do app e opção de limpar dados. | Ajustar o uso, exportar ou apagar dados mediante confirmação explícita. |

## Fluxos principais

### Registrar uma métrica de saúde

1. A pessoa toca em **Adicionar registro** na tela Início ou na aba Registros.
2. Seleciona **Saúde** e preenche o nome da métrica, valor, unidade, data/hora e uma nota opcional.
3. Toca em **Salvar**.
4. O app valida os campos obrigatórios, armazena o registro no dispositivo e atualiza o resumo e os relatórios locais.

### Capturar e salvar o clima atual

1. A pessoa toca em **Capturar clima**.
2. O app solicita permissão de localização apenas quando necessário e explica a finalidade da solicitação.
3. Com a coordenada disponível e conexão ativa, o app consulta o serviço meteorológico gratuito e apresenta os dados retornados.
4. A pessoa confirma **Salvar observação**; o retrato do clima é persistido no aparelho, inclusive para consulta offline posterior.

### Criar um evento pessoal

1. Na aba Calendário, a pessoa escolhe uma data e toca em **Novo evento**.
2. Informa título, horário, categoria e nota opcional.
3. Após salvar, o evento aparece na agenda da data e no resumo da tela Início.

### Consultar relatório

1. Na aba Relatórios, a pessoa escolhe um período — semana, mês ou intervalo personalizado.
2. O app calcula os dados já armazenados no aparelho.
3. São exibidos indicadores, séries temporais e uma lista resumida; a pessoa pode iniciar a exportação local quando essa função estiver disponível.

## Limites da primeira versão

A primeira versão não terá login, conta, sincronização entre aparelhos ou banco de dados remoto. O calendário será interno ao app e não modificará o calendário nativo do Android. A consulta meteorológica depende de localização e conexão no momento da captura; uma vez salvo, o dado permanece disponível offline.


## Evolução: diário visual de dor crônica

A tela inicial começa pelo registro de dor, com uma silhueta corporal grande, frente e costas, dividida em áreas táteis amplas. Cada toque em uma região abre um fluxo curto de escolhas visuais. O primeiro toque define o local principal; toques posteriores podem indicar irradiação, sem exigir digitação.

| Etapa | Controle visual | Opções |
|---|---|---|
| Local da dor | Silhueta corporal frente/costas | Cabeça, face, pescoço, ombros, braços, peito, abdômen, costas, quadris, coxas, joelhos, pernas e pés. |
| Intensidade | Dez botões numerados grandes com reforço de cor e rótulo acessível | 1 a 10, sem campo de texto. |
| Tipo/sensação | Cartões com ícone e rótulo | Pulsante, dolorida, pontada, agulhada, choque, queimação, ardência, formigamento, dormência, pressão, peso, aperto, cólica, coceira, rasgando, contínua e intermitente. |
| Irradiação | Silhueta secundária com seleção múltipla | As mesmas regiões corporais, com “não irradia” como opção explícita. |
| Emoção | Emojis grandes e cores de apoio | Calmo, bem, preocupado, irritado, triste, ansioso, cansado, frustrado e sobrecarregado. |
| Alimentação | Ícones de grupos ou itens | Chocolate, álcool, carboidratos, ultraprocessados, frituras, laticínios, glúten, açúcar, cafeína, carne processada, muito sal, alimento novo e “nenhum desses”. |
| Clima | Captura automática no fechamento da ocorrência | Temperatura, sensação térmica, umidade, vento, condição e local aproximado; a localização é solicitada somente durante a ação. |

Todos os passos usam retorno visual, alvos mínimos de 48 px, contraste alto e rótulos acessíveis para leitor de tela. O horário é preenchido automaticamente. O relatório apresenta associações observadas nos registros, nunca causalidade, diagnóstico ou recomendação de tratamento.


## Atualização: localização anatômica detalhada

A seleção corporal será organizada em **frente** e **costas**, com lateralidade explícita quando aplicável. O app não tentará inferir anatomia a partir de um ponto aproximado: cada área tocável terá uma etiqueta descritiva que será exibida antes da confirmação e no relatório.

| Região | Subáreas selecionáveis |
|---|---|
| Cabeça e face | Couro cabeludo esquerdo/direito, testa esquerda/direita, acima do olho esquerdo/direito, atrás do olho esquerdo/direito, têmpora esquerda/direita, bochecha esquerda/direita, mandíbula esquerda/direita, topo da cabeça, nuca esquerda/direita e atrás da cabeça. |
| Pescoço e ombros | Frente do pescoço, nuca, ombro esquerdo/direito, clavícula esquerda/direita e base do pescoço. |
| Tórax | Peito esquerdo/direito, centro do peito, costelas esquerdas/direitas superiores e inferiores, axila esquerda/direita e parte alta das costas esquerda/direita. |
| Abdômen e costas | Abdômen superior/inferior esquerdo/direito, centro do abdômen, flanco esquerdo/direito, lombar esquerda/direita, meio das costas e sacro. |
| Pelve | Região pélvica esquerda/direita, virilha esquerda/direita, baixo ventre esquerdo/direito, região próxima ao ovário esquerdo/direito, quadril esquerdo/direito e nádega esquerda/direita. A nomenclatura é descritiva e não indica diagnóstico ou origem da dor. |
| Membros superiores | Braço esquerdo/direito anterior e posterior, cotovelo esquerdo/direito, antebraço esquerdo/direito, punho esquerdo/direito, mão esquerda/direita e dedos. |
| Membros inferiores | Coxa esquerda/direita anterior e posterior, joelho esquerdo/direito, panturrilha esquerda/direita, canela esquerda/direita, tornozelo esquerdo/direito, pé esquerdo/direito e lateral externa/interna da perna. |

### Fluxo para descrever uma dor irradiada

1. O usuário toca no **ponto principal** da dor, por exemplo, “acima do olho esquerdo”.
2. Na etapa seguinte, toca em um ou mais pontos na ordem em que deseja descrever o caminho da irradiação, por exemplo, “nuca” e “atrás da cabeça”. Cada ponto fica numerado visualmente.
3. Para cada trecho selecionado, o usuário pode tocar em um tipo de sensação, como “queimação” ou “pontada”. Se uma única sensação servir para todo o trajeto, há um botão visual para aplicá-la ao caminho completo.
4. O relatório apresenta a sequência com setas: **acima do olho esquerdo → nuca → atrás da cabeça**, acompanhada das sensações escolhidas. Nenhuma causa é inferida pelo aplicativo.

Todos os alvos corporais terão área de toque ampliada, legenda acessível e estado selecionado com contorno e preenchimento, evitando depender apenas de cor. O registro poderá ser concluído sem digitação; a data e a hora serão preenchidas automaticamente.


## Correção de princípio: descobrir associações sem presumir causa

A etapa de condição crônica é **opcional**. O botão “Pular — ainda não sei a relação” permite salvar a ocorrência apenas com os dados observados. As condições conhecidas aparecem como contexto selecionável, não como explicação obrigatória. O relatório prioriza os padrões derivados de frequência e intensidade por local, irradiação, tipo de dor, humor, alimentação, horário e clima associado. A linguagem da interface usa “observado”, “registrado” e “para investigar com o médico”, evitando “causou”, “provoca” ou qualquer diagnóstico automático.
