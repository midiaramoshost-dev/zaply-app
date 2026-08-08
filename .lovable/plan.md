# Plano de Implementação - Correção e Expansão do Painel Admin Master

O usuário relatou que os menus de "Usuários & Crédito" e "Configurações" não estão funcionando no painel Admin Master. A análise confirmou a ausência desses módulos e funcionalidades incompletas.

## Ações Realizadas

### 1. Serviços de Backend (Server Functions)
- **Arquivo:** `src/modules/admin/services/admin.functions.ts`
- **Alteração:** Adicionadas funções `getUsersList`, `updateUserStatus` e `adjustCredits`.
- **Objetivo:** Permitir a recuperação de perfis com saldo de créditos, bloqueio/desbloqueio de contas e ajuste manual de tokens via RPC `grant_user_credits`.

### 2. Interface de Gestão de Usuários
- **Arquivo:** `src/modules/admin/components/admin-users-credits.tsx`
- **Nova Funcionalidade:** Tabela completa com busca, toggle de status de ativação, e botões de incremento/decremento de créditos (+50 / -50).
- **Design:** Mantém a estética "Dark Tech" com badges e ícones do Lucide.

### 3. Integração no Roteamento Admin
- **Arquivo:** `src/routes/admin.tsx`
- **Alteração:** Adição da aba "Usuários & Créditos" no `TabsList` e `TabsContent`.
- **Aprimoramento:** Renomeação lógica das abas para facilitar a navegação ("Sistema" agora cobre "Configurações").

## Próximos Passos
- Validar o funcionamento das permissões RLS no banco de dados para garantir que o `supabaseAdmin` tenha acesso total às tabelas de créditos.
- Expandir a aba de "Configurações" (Sistema) para incluir edição de planos comerciais.
- Verificar a reatividade do CMS na landing page após salvar as alterações.
