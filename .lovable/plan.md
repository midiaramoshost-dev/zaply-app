# Plan - Redirecionamento Direto para o Painel

O usuário deseja que ao clicar em "Entrar", ele seja direcionado diretamente para o painel, sem passar pela tela de login (`/auth?mode=entrar`). Como já implementamos um "acesso livre" no projeto, vamos ajustar os links de "Entrar" na landing page para apontar diretamente para `/painel`.

## Alterações

### 1. Landing Page (`src/routes/index.tsx`)
- Alterar o link de "Entrar" no cabeçalho (linha 191) para apontar para `/painel`.
- Alterar o link de "Fazer login / Criar conta" no Hero (linha 235) para apontar para `/painel`.
- Alterar o link de "Criar conta grátis" na seção de CTA (linha 465) para apontar para `/painel`.
- Alterar o link de "Entrar" no rodapé (linha 495) para apontar para `/painel`.

## Validação
- Clicar em todos os botões de "Entrar" ou "Criar conta" na página inicial e verificar se o redirecionamento ocorre diretamente para `/painel`.
