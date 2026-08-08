# Plano de Trabalho - Correção do Painel Administrativo

O usuário relatou que os menus de "Usuários & Créditos" e "Configurações" (Sistema) não estão funcionando conforme o esperado, embora tenham sido implementados estruturalmente.

## Diagnóstico
1. **Usuários & Créditos**: O componente `AdminUsersCredits` foi criado, mas a integração com o componente de "Detalhes" ou ações específicas pode estar incompleta ou falhando no carregamento inicial se o RPC `grant_user_credits` não estiver funcionando corretamente no banco.
2. **Configurações (Sistema)**: A aba "Sistema" em `src/routes/admin.tsx` depende da tabela `platform_settings` e da chave `system_config`. Se essa chave não existir no banco, o código pode falhar silenciosamente ou exibir campos vazios.
3. **Menus Funcionais**: O usuário mencionou falta de menus de gestão. Embora tenhamos Financeiro, Site e IA, precisamos garantir que as mutações de salvamento funcionem para todos os campos.

## Ações Propostas

### 1. Verificação e Refinamento do Módulo de Usuários
- Validar se o RPC `grant_user_credits` existe e é acessível via `supabaseAdmin`.
- Adicionar tratamento de erro visual mais claro no `AdminUsersCredits`.
- Implementar o modal de "Detalhes" para permitir edição fina do perfil do usuário.

### 2. Fortalecimento da Aba de Sistema (Configurações)
- Garantir que as chaves `system_config` sejam inicializadas se não encontradas.
- Adicionar controles para:
    - Valor padrão de créditos para novos usuários.
    - Chaves de API externas (Placeholder para o usuário preencher via ferramenta de segredos).

### 3. Melhoria na Gestão do Site (CMS)
- Adicionar suporte para editar a seção de "Funcionalidades" e "Preços" diretamente pelo admin.
- Validar a aplicação da Cor Primária globalmente (Verificar se o CSS variável está lendo do banco).

### 4. Correção de Mutações
- Verificar se `updatePlatformSetting` está funcionando para objetos aninhados (Deep merge vs Overwrite).

## Validação
- Testar a troca de status de um usuário real no preview.
- Alterar o tempo de Trial e verificar se persiste após recarregar.
- Validar se o Financeiro exibe zeros ou erro se a tabela de faturas estiver vazia.
