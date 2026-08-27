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
