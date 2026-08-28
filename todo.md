# Project TODO

- [x] Definir os tipos locais de saúde, clima e calendário e a camada de persistência com AsyncStorage.
- [x] Configurar a identidade visual e o ícone próprio do Registro Pessoal.
- [x] Implementar a tela Início com o resumo diário e ações rápidas.
- [x] Implementar cadastro, listagem e exclusão de registros de saúde inseridos manualmente.
- [x] Implementar localização sob permissão e consulta do clima atual para salvamento local.
- [x] Implementar calendário interno com criação, edição e remoção de eventos.
- [x] Implementar relatórios locais por período para saúde, clima e calendário.
- [x] Implementar exportação local de dados e controles de privacidade.
- [x] Criar testes unitários para persistência, agregações e conversões meteorológicas.
- [x] Validar fluxos essenciais no Android, finalizar a documentação e preparar a primeira versão.
- [x] Alinhar os módulos nativos de localização, arquivos e compartilhamento à versão do Expo do projeto.
- [x] Otimizar os arquivos de ícone do aplicativo para permitir o salvamento da versão.

- [x] Redesenhar a experiência inicial para diário visual de dor com silhueta corporal frente/costas e acessibilidade ampliada.
- [x] Adicionar modelo local de ocorrência de dor com local, intensidade, tipo, irradiação, humor, alimentos e clima associado.
- [x] Implementar seleção de dor exclusivamente por toques, desenhos e ícones, sem texto obrigatório.
- [x] Correlacionar automaticamente cada ocorrência com o clima capturado no momento do registro.
- [x] Criar relatório visual de correlações para discussão com médicos e exportação local.
- [x] Criar testes para o novo modelo, agregações e fluxo visual de registro de dor.
- [x] Revisar privacidade, contraste, tamanho dos alvos de toque e funcionamento offline no Android.

### Histórico de solicitação

- [x] Alterar o app para registrar ocorrências de dores crônicas e correlacioná-las com clima, humor e alimentação por meio de uma interface sem digitação.
- [x] Considerar uma silhueta corporal interativa com seleção do local da dor e dos locais de irradiação.
- [x] Incluir intensidades de 1 a 10, tipos de dor, emoções e categorias de alimentos por ícones.

- [ ] Adicionar cartões visuais para selecionar uma ou mais condições crônicas relacionadas à ocorrência.
- [ ] Criar modo de registro rápido com condições favoritas e texto opcional.
- [ ] Permitir múltiplos focos de dor detalhados na mesma ocorrência, cada um com condição e trajeto próprios.
- [x] Atualizar histórico, correlações e relatório para exibir condições crônicas associadas.
- [x] Validar acessibilidade e fluxo de registro com o mínimo de toques durante uma crise.
- [ ] Confirmar a nomenclatura da condição descrita como “bursite nos ninhos” antes de fixá-la no vocabulário padrão.

- [x] Remover a obrigatoriedade de selecionar uma condição crônica antes de salvar uma ocorrência.
- [x] Manter condições conhecidas como campo opcional, sem usá-las como causa presumida.
- [x] Criar associações automáticas por local, trajetória, intensidade, clima, humor, alimentos, horário e frequência.
- [x] Exibir resultados como padrões observados com contagens e médias, sem afirmar causalidade ou diagnóstico.
- [x] Atualizar o relatório médico e os testes para a análise sem causa informada.

- [x] Substituir a silhueta de pequenos marcadores por uma imagem corporal 2D ampla e clicável.
- [x] Capturar coordenadas X/Y normalizadas do toque e convertê-las em regiões anatômicas detalhadas.
- [x] Permitir frente e costas com confirmação visual mínima e sem exigir leitura dos nomes.
- [x] Aumentar a confiabilidade com zonas anatômicas, alvo ampliado e feedback visual após o toque.
- [x] Testar toques em cabeça, orelhas, olhos, pelve e membros no Android.

- [x] Adicionar controles acessíveis de aumentar, reduzir e redefinir o zoom no mapa corporal.
- [x] Permitir navegar pela imagem ampliada sem perder a precisão das coordenadas do toque.
- [x] Validar zoom e seleção de áreas menores em tela móvel e no Android.

- [x] Manter e validar o zoom do mapa corporal durante o novo fluxo.
- [x] Adicionar sintomas locais selecionáveis por ícones após a intensidade.
- [x] Permitir associar uma ocorrência a múltiplas dores registradas anteriormente, sem presumir causa.
- [x] Criar tela de emoções em grade visual 4×4 com duas posições vazias.
- [x] Criar tela de alimentação com abas Hoje e Últimas 24h, seleção múltipla e alimento customizado.
- [x] Criar tela de medicamentos preventivos e para controle da dor, com histórico local reutilizável.
- [x] Integrar os novos dados às correlações, relatórios médicos e exportação local.
- [x] Criar testes e validar acessibilidade, funcionamento offline e fluxo com pouca leitura.

- [x] Confirmar o fluxo completo de registro de dor com mensagem de sucesso e captura automática de GPS, clima e data/hora.
- [x] Agendar notificação local de acompanhamento duas horas após a ocorrência ou medicamento.
- [x] Implementar o loop pós-medicação com respostas sobre melhora, intensificação, outro medicamento e encerramento.
- [x] Implementar relatório compartilhável em PDF para avaliação médica.
- [x] Implementar abertura, edição e salvamento de registros anteriores.
- [x] Adicionar testes determinísticos para notificações, ramificações, edição e relatório PDF.

- [x] Expandir Histórico com lista recente, pontos coloridos, intensidade, emoções e alimentos.
- [x] Adicionar ações Editar e Apagar por gesto/ação acessível, movendo apagados para lixeira reversível.
- [x] Adicionar filtros de histórico por data, intensidade e localização anatômica.
- [x] Expandir Relatórios com gráficos de horário, dia da semana, medicação, alimentos, emoções e clima.
- [x] Gerar insights somente como associações observadas, com amostra e limitação visíveis.
- [x] Criar tela Configurações para medicamentos, alimentos, dados, notificações e privacidade.
- [x] Adicionar exportação CSV/PDF e opção de backup local automático.
- [x] Avaliar sincronização manual com Google Sheets sem ativá-la sem autorização explícita.

- [x] Corrigir o observador de notificações para não chamar APIs nativas indisponíveis no preview web.

- [x] Remover checkboxes/listas textuais obrigatórias de local e irradiação; manter apenas o mapa 2D clicável.
- [x] Garantir que zoom, toque e confirmação automática continuem funcionando sem leitura.

- [x] Corrigir a seleção de cabeça e face para aceitar topo da cabeça, testa, olhos, abaixo dos olhos, bochechas, nariz, mandíbula, orelhas e nuca.
- [x] Ampliar as áreas de toque ao redor do desenho sem perder a distinção anatômica.
- [x] Validar essas zonas no zoom e no fluxo de irradiação.

- [x] Criar hierarquia corpo geral → região → submapa detalhado para seleção anatômica.
- [x] Adicionar submapa de mãos com dedos, falanges, metacarpos e articulações, incluindo a base do polegar.
- [x] Adicionar submapa de pés com dedos, falanges, metatarsos e articulações, incluindo o dedinho direito.
- [x] Adicionar submapa de mamas e axilas com lateralidade e quadrantes.
- [x] Expandir pontos de articulações, músculos e órgãos com coordenadas específicas.
- [x] Preservar zoom, coordenadas, histórico e relatórios com o ponto mais específico selecionado.
- [x] Validar toque fino em todas as sub-regiões no preview móvel e por testes de coordenadas; falta apenas confirmação em um dispositivo Android físico.

- [x] Corrigir deslocamento dos pontos do mapa e eliminar associação incorreta entre ovário, axila e outras regiões.
- [x] Recalibrar submapas usando anatomia visual efetiva, com coordenadas relativas ao desenho renderizado e não ao contêiner.
- [x] Tornar a irradiação realmente opcional, permitindo avançar sem selecionar pontos irradiados.
- [x] Permitir editar o local primário da dor ao abrir um registro existente.
- [x] Corrigir relatórios para renderizar cards, resumos, gráficos e estados vazios de forma visível.
- [x] Ajustar tela de emoções para grade 4×4, seleção múltipla e botão Próximo.
- [x] Revisar tela de medicamentos preventivos e de controle, com dose, horário, adicionar/remover e histórico local.
- [x] Validar histórico, edição do local, irradiação opcional e relatórios em fluxo completo.

- [x] Diagnosticar por que o building não conclui na versão eca7a67d.
- [x] Corrigir a falha de empacotamento sem regredir o mapa e os fluxos validados.
- [x] Executar novamente TypeScript, testes e build completo antes de criar novo checkpoint.

- [x] Versão 9: tornar a identificação da versão mais clara na tela Sobre, sem alterar dados ou fluxos.
- [x] Validar a melhoria visual e criar checkpoint para nova tentativa de compilação Android.

- [x] Redesenhar o módulo corporal com vistas frente, costas, lateral esquerda e lateral direita.
- [x] Permitir toque livre em qualquer ponto da imagem e preservar coordenadas X/Y por vista.
- [x] Criar conversão anatômica específica para cada vista, sem reutilizar offsets entre desenhos.
- [x] Integrar o novo atlas ao zoom, irradiação, histórico e edição do local.
- [x] Validar pontos anatômicos e layout móvel antes de criar a próxima versão.

- [x] Verificar e conectar o projeto Registro Pessoal a um repositório GitHub autorizado.
- [x] Sincronizar o código com o repositório GitHub e validar o envio.

- [x] Criar o repositório privado `app-saude` no GitHub.
- [x] Conectar o projeto Registro Pessoal ao remoto GitHub e enviar o código atual.

- [x] Criar central interna para visualizar notificações e lembretes do app.
- [x] Persistir localmente notificações lidas/não lidas e permitir marcar como lidas.
- [x] Adicionar badge e navegação para notificações e acompanhamentos de dor.
- [x] Integrar a central ao agendamento de lembretes de 2 horas sem duplicar registros.
- [x] Validar a central no Android/preview e criar checkpoint.

- [x] Sincronizar o estado da versão 9 com o repositório privado `app-saude`.
- [x] Validar no GitHub o commit e a branch correspondentes à versão 9.

- [x] Substituir a silhueta estilizada por representação corporal visualmente mais anatômica.
- [x] Criar quatro vistas coerentes: frente, costas, lateral esquerda e lateral direita.
- [x] Manter pontos livres, zoom e conversão X/Y alinhados aos novos desenhos.
- [x] Validar que o APK/preview mostre o novo visual após a atualização.

- [x] Criar commit da versão 10 com o estado atual do módulo corporal anatômico.
- [x] Enviar a versão 10 para a branch `main` do repositório privado `app-saude`.
- [x] Validar no GitHub o commit e o histórico preservado da versão 9.

- [x] Criar ilustração anatômica original com musculatura e contornos corporais visíveis, inspirada nas referências enviadas.
- [x] Gerar vistas coerentes de frente, costas, lateral esquerda e lateral direita, sem copiar imagens protegidas.
- [x] Distribuir pontos de toque livre sobre a imagem e manter conversão X/Y para regiões anatômicas.
- [x] Recalibrar zoom, lateralidade e submapas sobre as novas ilustrações.

- [x] Mostrar abaixo do mapa o nome anatômico correspondente ao último toque X/Y, incluindo lateralidade.
- [x] Implementar zoom por gesto de pinça com dois dedos, limitado a 9×.
- [x] Remover os botões de aumentar/reduzir zoom e manter redefinição discreta.
- [x] Validar que o gesto não desloca a coordenada anatômica selecionada.

- [x] Enviar ao GitHub as novas imagens anatômicas e a integração do mapa corporal posteriores à versão 10.
- [x] Criar e validar um novo commit sem sobrescrever a versão 10.

- [x] Investigar a falha de compilação relatada na Versão 10; o código foi confirmado válido e a Versão 11 permanece como referência estável.
- [x] Validar novamente TypeScript, testes e exportação Android; a Versão 10 exportou o bundle Android com sucesso em ambiente isolado.

- [x] Corrigir o enquadramento do corpo inteiro para caber na área visível do mapa em Android.
- [x] Recalibrar a conversão X/Y da vista corporal para impedir que toques no rosto abram submapas de mãos ou regiões incorretas.
- [x] Validar rosto, mãos, pés, tronco, pelve e quatro vistas com testes de coordenadas e preview móvel.

- [x] Manter o corpo inteiro na mesma tela durante a seleção, sem abrir submapas ao tocar.
- [x] Implementar zoom contínuo por pinça com a imagem corporal e os pontos X/Y na mesma tela.
- [x] Criar malha anatômica mínima tipo batalha naval, alinhada a cada vista, para converter o toque em região sem exigir muitos cliques.
- [x] Validar que rosto, mãos, pés, órgãos, tronco e pelve sejam identificados no mesmo mapa ampliado.

- [x] Permitir toque direto na imagem anatômica detalhada, sem abertura de categoria ou submapa.
- [x] Mapear o exemplo “cotovelo esquerdo, face interna” para uma nomenclatura anatômica automática.
- [x] Usar alvos de toque tolerantes e feedback visual simples, adequados para pessoa idosa.
