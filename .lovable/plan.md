# Plano de Correção: Navegação do Modo Simples

O usuário relatou que os menus do "Modo Simples" no painel (`/painel`) não estão funcionando. A análise do código em `src/routes/painel.tsx` revelou que os cards de ação rápida (Criar Vídeo, Imagem, Post, etc.) e o botão principal de geração de IA não possuem links ou manipuladores de eventos definidos, servindo apenas como elementos visuais.

## Alterações Propostas

### 1. Frontend: `src/routes/painel.tsx`
- **Cards de Ação Rápida:** Adicionar o componente `Link` do `@tanstack/react-router` em cada card para redirecionar o usuário para a ferramenta correspondente.
  - Criar Vídeo -> `/criar`
  - Criar Imagem -> `/imagens`
  - Criar Post -> `/criar`
  - Criar Anúncio -> `/criar`
  - Criar Documento -> `/biblioteca`
  - Criar Site -> `/n8n` (Automação/Infra)
- **Gerador de IA:** Adicionar uma função de clique ao botão "GERAR" que capture o texto da `textarea` e redirecione para a página de criação com o prompt pré-preenchido via search params (ou estado).

## Verificação
- Abrir o preview no `/painel`.
- Alternar para o "Modo Simples".
- Clicar nos cards e verificar se navegam para as rotas corretas.
- Digitar uma ideia no campo de IA e clicar em "GERAR", verificando se a navegação ocorre.
