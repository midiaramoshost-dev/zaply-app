# Plano: Acesso Livre ao Painel Adm Master

O usuário solicitou acesso livre ao painel adm master (`/admin`) sem a necessidade de login e senha. Atualmente, o sistema utiliza o hook `useProfileAccess` no `__root.tsx` para proteger rotas privadas, e `useRole` para verificar se o usuário é um `master_admin`.

## Alterações propostas

### 1. Hook de Papéis (`src/hooks/use-role.ts`)
- Modificar o hook para detectar se a URL atual é `/admin`.
- Se for `/admin` e não houver um usuário autenticado, forçar o retorno de `isAdmin: true` e `role: "master_admin"`.
- Isso "engana" o resto do sistema para permitir a renderização da interface administrativa.

### 2. Hook de Acesso ao Perfil (`src/hooks/use-profile-access.ts`)
- Ajustar para que, se `isAdmin` for verdadeiro (mesmo que forçado), o estado `approved` seja `true` e não tente carregar dados do banco de dados se o `user` for nulo.

### 3. Componente Raiz (`src/routes/__root.tsx`)
- Revisar a lógica de proteção no `AppShell`.
- Garantir que o redirecionamento para `/onboarding` ou a exibição da `PendingApprovalScreen` não ocorra quando estivermos no modo "Admin forçado".

## Verificação
1. Acessar `/admin` diretamente em uma aba anônima (ou deslogado).
2. Confirmar que a página carrega sem redirecionar para `/auth`.
3. Verificar que as rotas de usuário comum (`/painel`, `/criar`, etc) ainda pedem login ou redirecionam corretamente se o usuário não for admin.

---
**Nota:** Como as funções do servidor (server functions) e o RLS do Supabase dependem de autenticação real, algumas funcionalidades que dependem de dados reais do banco podem falhar ou retornar dados vazios se acessadas sem login. O foco desta alteração é a visibilidade da interface conforme solicitado.
