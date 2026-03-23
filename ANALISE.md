# Analise: Guerra dos Reinos - Titulos

## Visao Geral

Sistema de gamificacao medieval para liga de Cartola FC. Atribui titulos tematicos (Senhor dos Aneis / Game of Thrones) aos 9 times com base em performance por rodada.

**Estrutura atual:** 2 paginas HTML, 1 CSV de dados, 11 imagens de titulos.

---

## FRONT-END

### Pontos Positivos

1. **Design visual excelente** - Tema medieval com CSS puro (gradientes, animacoes, glow por tier S/A/B/C/D)
2. **Responsivo** - Usa `clamp()`, `auto-fill/minmax`, media queries
3. **Sistema de Tiers** - CSS variables organizadas por tier com cores e sombras distintas
4. **UX** - Loading screen, animacoes, compartilhamento WhatsApp, navegacao entre paginas
5. **Fontes tematicas** - Cinzel Decorative + Crimson Text
6. **Imagens de titulos** - Assets visuais para cada titulo

### Problemas

1. **CSS inline** - ~160 linhas de CSS dentro de `<style>` no HTML. Deveria estar em `.css` separado
2. **JS inline** - ~180 linhas de logica dentro de `<script>`. Deveria estar em `.js` separado
3. **Codigo duplicado** - Constantes (`LORDS`, `TITLES`, `STARS_MAP`, `TITLE_IMAGES`) e funcoes (`parseCSV`, `buildBattles`, `starsHTML`, `imgSlug`) copiadas identicamente em ambos HTMLs
4. **Sem framework/bundler** - Nenhum Vite, webpack, React, Vue, etc.
5. **Sem minificacao** - CSS e JS nao minificados
6. **Sem testes** - Zero testes para logica de pontuacao
7. **Acessibilidade** - Falta aria-labels, alt descritivo, contraste WCAG em textos muted
8. **SEO** - Falta meta description, Open Graph tags

---

## BACK-END (inexistente)

### Situacao Atual

O projeto e **100% front-end estatico**:

- Nenhum servidor (Node.js, Python, PHP)
- Nenhum banco de dados
- Nenhuma API
- Nenhuma autenticacao
- Nenhum CI/CD

### Fonte de Dados

- CSV estatico (`dados.csv`) com 64 linhas (9 times x 7 rodadas)
- Carregado via `fetch('dados.csv')` no browser
- Toda logica de processamento roda no cliente

### O que um Back-End traria

| Funcionalidade | Beneficio |
|---|---|
| **API REST** | Separar dados da apresentacao |
| **Banco de dados** | Persistencia, queries, historico |
| **Atualizacao automatica** | Integrar com API do Cartola FC |
| **Autenticacao** | Painel admin para gerenciar dados |
| **Cache/CDN** | Performance para muitos acessos |
| **WebSocket** | Atualizacoes em tempo real |
| **CI/CD** | Deploy automatico |

---

## Arquitetura Sugerida

```
ATUAL:                          IDEAL:

dados.csv -> fetch() -> JS      API (Node/Express ou FastAPI)
       (tudo no browser)           |
                                   +-- GET /api/times
                                   +-- GET /api/rodadas
                                   +-- GET /api/titulos/:time
                                   +-- POST /api/rodadas (admin)
                                   +-- Banco de Dados (PostgreSQL)

                                Front-End (React/Vue/Svelte)
                                   +-- src/components/
                                   +-- src/services/api.js
                                   +-- src/styles/
                                   +-- src/utils/titulos.js
```

---

## Prioridades

| # | Acao | Esforco |
|---|---|---|
| 1 | Extrair JS/CSS duplicados para arquivos compartilhados | Baixo |
| 2 | Criar `shared.js` com constantes e funcoes comuns | Baixo |
| 3 | Adicionar testes unitarios para logica de pontuacao | Medio |
| 4 | Criar back-end minimo com API e banco | Alto |
| 5 | Migrar front para framework moderno | Alto |
| 6 | Setup CI/CD e deploy automatico | Medio |

---

## Veredicto

Front-end visualmente impressionante com tema criativo e logica de gamificacao sofisticada (6 categorias, tiers progressivos, bonus). Arquitetura fragil: 2 HTMLs monoliticos com codigo duplicado, sem separacao front/back, sem testes. Refatoracao essencial para escalar.
