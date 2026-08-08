ALTER TABLE public.user_credits DROP CONSTRAINT IF EXISTS user_credits_user_id_fkey;

-- Adicionar colunas se não existirem
ALTER TABLE public.user_credits 
ADD COLUMN IF NOT EXISTS daily_post_limit integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS daily_media_limit integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS max_social_accounts integer DEFAULT 3;

DO $$
DECLARE
    new_tenant_id uuid;
    user4_id uuid := gen_random_uuid();
    user5_id uuid := gen_random_uuid();
    user6_id uuid := gen_random_uuid();
BEGIN
    -- Obter um ID de tenant existente ou criar um novo
    SELECT id INTO new_tenant_id FROM public.tenants LIMIT 1;
    
    IF new_tenant_id IS NULL THEN
        INSERT INTO public.tenants (name)
        VALUES ('Agência Beta Demo')
        RETURNING id INTO new_tenant_id;
    END IF;

    -- Inserir Perfis Fictícios
    INSERT INTO public.profiles (id, tenant_id, full_name, email, approved, is_active)
    VALUES 
    (user4_id, new_tenant_id, 'Carla Mendes', 'carla.mendes@exemplo.com', true, true),
    (user5_id, new_tenant_id, 'Felipe Souza', 'felipe.gestor@exemplo.com', true, true),
    (user6_id, new_tenant_id, 'Mariana Costa', 'mari.social@exemplo.com', false, true)
    ON CONFLICT (id) DO NOTHING;

    -- Inserir Créditos e Limites
    INSERT INTO public.user_credits (user_id, balance, daily_post_limit, daily_media_limit, max_social_accounts)
    VALUES 
    (user4_id, 1000, 50, 100, 20),
    (user5_id, 150, 5, 10, 2),
    (user6_id, 0, 1, 2, 1)
    ON CONFLICT (user_id) DO UPDATE SET
        balance = EXCLUDED.balance,
        daily_post_limit = EXCLUDED.daily_post_limit,
        daily_media_limit = EXCLUDED.daily_media_limit,
        max_social_accounts = EXCLUDED.max_social_accounts;

END $$;