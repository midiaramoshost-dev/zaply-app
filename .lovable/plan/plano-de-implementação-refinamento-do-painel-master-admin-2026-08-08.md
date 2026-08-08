# Plano de Implementação - Refinamento do Painel Master Admin

O usuário solicitou melhorias no Painel Administrador Master, especificamente para que ele seja "mais completo", incluindo gestão total do site e menus funcionais. As interações anteriores já estabeleceram a estrutura básica, mas agora vamos consolidar as funcionalidades de gestão de clientes (créditos por postagem, mídias e contas sociais) e garantir que a interface seja profissional e intuitiva.

## 1. Melhorias na Gestão de Usuários e Créditos
- **Objetivo**: Tornar a edição de limites (posts, mídias, contas) mais robusta e visualmente clara.
- **Ações**:
    - Ajustar o layout da tabela de usuários em `src/modules/admin/components/admin-users-credits.tsx` para melhor legibilidade.
    - Adicionar feedback visual (tooltips ou ícones) para cada tipo de limite.
    - Garantir que o `supabaseAdmin` em `admin.functions.ts` trate corretamente os casos de usuários sem registro prévio de créditos.

## 2. Refinamento Visual do Painel Master
- **Objetivo**: Deixar a interface mais "atraente" e "profissional" seguindo o estilo Dark Tech.
- **Ações**:
    - Revisar o `src/routes/admin.tsx` para garantir que os cards de métricas (Financeiro, Usuários) usem os tokens OKLCH e efeitos de glassmorphism.
    - Adicionar animações sutis de entrada nos componentes administrativos.

## 3. Gestão Completa do Site (CMS)
- **Objetivo**: Expandir o menu "Gestão do Site" para cobrir mais elementos da Landing Page.
- **Ações**:
    - Adicionar campos para editar a seção de "Preços" (Pricing) e "FAQ" diretamente no admin.
    - Sincronizar essas configurações com a tabela `platform_settings` no banco de dados.

## 4. Auditoria e Logs (Opcional, mas recomendado para "Admin Master")
- **Objetivo**: Mostrar atividades recentes no sistema.
- **Ações**:
    - Criar uma aba simples de "Auditoria" que lista as últimas ações administrativas (se a tabela de logs existir).

## Validação
- Acessar `/admin` e testar a alteração de limites de um usuário fictício.
- Verificar se a alteração de cor primária ou headline reflete instantaneamente na home page (`/`).
