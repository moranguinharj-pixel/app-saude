# Verificação dos assets anatômicos

As vistas frontal e posterior locais contêm ilustrações anatômicas originais com musculatura superficial, contornos e proporção vertical adequados para o mapa. Os arquivos são PNG verdadeiros, em 832×1248, e não estão vazios. A tela branca observada no preview ocorreu na camada de carregamento/renderização do app, não no conteúdo dos assets. A integração deve continuar usando `require()` estático dos arquivos locais e `resizeMode="contain"`, com o fallback vetorial apenas como camada de segurança.
