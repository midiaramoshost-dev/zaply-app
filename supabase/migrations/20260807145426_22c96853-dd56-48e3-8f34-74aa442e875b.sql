-- 1. Padronização da tabela social_accounts
DO $$ 
BEGIN 
    -- Adicionar org_id se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'social_accounts' AND column_name = 'org_id') THEN
        ALTER TABLE public.social_accounts ADD COLUMN org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
    END IF;

    -- Tentar migrar dados de company_id para org_id se necessário (opcional, dependendo do estado anterior)
    -- UPDATE public.social_accounts SET org_id = company_id WHERE org_id IS NULL AND company_id IS NOT NULL;
END $$;

-- 2. Políticas RLS faltantes

-- AI Providers
DROP POLICY IF EXISTS tenant_isolation_ai_providers ON public.ai_providers;
CREATE POLICY tenant_isolation_ai_providers ON public.ai_providers
    FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- AI Models
DROP POLICY IF EXISTS tenant_isolation_ai_models ON public.ai_models;
CREATE POLICY tenant_isolation_ai_models ON public.ai_models
    FOR ALL TO authenticated USING (provider_id IN (SELECT id FROM public.ai_providers));

-- Social Accounts
DROP POLICY IF EXISTS tenant_isolation_social_accounts ON public.social_accounts;
CREATE POLICY tenant_isolation_social_accounts ON public.social_accounts
    FOR ALL TO authenticated USING (org_id IN (SELECT org_id FROM public.organization_members WHERE user_id = auth.uid()));

-- Audit Logs
DROP POLICY IF EXISTS tenant_isolation_audit_logs ON public.audit_logs;
CREATE POLICY tenant_isolation_audit_logs ON public.audit_logs
    FOR ALL TO authenticated USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));
