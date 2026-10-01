# conecta-futuro
Projeto acadêmico de desenvolvimento front-end para a ONG fictícia Conecta Futuro
## Estratégia de versionamento

O projeto utiliza uma estrutura baseada em GitFlow:

- main: versão publicada no GitHub Pages.
- develop: integração das alterações antes de um lançamento.
- feature/navegacao-spa: desenvolvimento da navegação SPA.

Novas funcionalidades partem de develop e retornam por pull request.
Branches release/ serão utilizadas para preparar lançamentos.
Branches hotfix/ partirão de main para correções urgentes e serão
integradas também a develop.

## Padrão de commits e versões

Os próximos commits seguirão Conventional Commits:
- feat: nova funcionalidade.
- fix: correção de falha.
- docs: atualização da documentação.
- refactor: reorganização sem mudança de comportamento.
- test: inclusão ou atualização de testes.

As versões seguirão MAJOR.MINOR.PATCH:
- MAJOR: mudanças incompatíveis.
- MINOR: funcionalidades compatíveis.
- PATCH: correções compatíveis.

Tags e releases serão criadas para entregas revisadas e testadas.
