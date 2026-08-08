-- Fictitious users seeding script
DO $$
DECLARE
    new_tenant_id uuid;
    user1_id uuid := gen_random_uuid();
    user2_id uuid := gen_random_uuid();
    user3_id uuid := gen_random_uuid();
BEGIN
    -- Create a default tenant for the new users if one doesn't exist
    INSERT INTO public.tenants (name, slug, plan, is_active)
    VALUES ('Agência Beta', 'agencia-beta', 'professional', true)
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO new_tenant_id;

    -- Insert Fictitious Users (Profiles)
    -- We assume auth.users entries might not exist, but profiles table is the one displayed in Admin
    -- For testing purposes, we use random UUIDs for profiles.
    
    INSERT INTO public.profiles (id, tenant_id, full_name, email, approved, is_active, role)
    VALUES 
    (user1_id, new_tenant_id, 'Ricardo Silva', 'ricardo.beta@exemplo.com', true, true, 'user'),
    (user2_id, new_tenant_id, 'Ana Paula Santos', 'ana.social@exemplo.com', true, true, 'user'),
    (user3_id, new_tenant_id, 'Bruno Oliveira', 'bruno.marketing@exemplo.com', false, true, 'user')
    ON CONFLICT (id) DO NOTHING;

    -- Seed credits for these users
    INSERT INTO public.user_credits (user_id, tenant_id, balance, daily_post_limit, daily_media_limit, max_social_accounts)
    VALUES 
    (user1_id, new_tenant_id, 250, 10, 20, 5),
    (user2_id, new_tenant_id, 500, 20, 50, 10),
    (user3_id, new_tenant_id, 50, 2, 5, 1)
    ON CONFLICT (user_id) DO UPDATE SET
        balance = EXCLUDED.balance,
        daily_post_limit = EXCLUDED.daily_post_limit,
        daily_media_limit = EXCLUDED.daily_media_limit,
        max_social_accounts = EXCLUDED.max_social_accounts;

END $$;
