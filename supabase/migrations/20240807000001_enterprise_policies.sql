-- Políticas de RLS detalhadas para evitar "RLS Enabled No Policy"

-- TENANTS
CREATE POLICY "Tenants are readable by their members" ON public.tenants
    FOR SELECT TO authenticated
    USING (id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Master admins can manage all tenants" ON public.tenants
    FOR ALL TO authenticated
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'master_admin');

-- ORGANIZATIONS
CREATE POLICY "Organizations are readable by tenant members" ON public.organizations
    FOR SELECT TO authenticated
    USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Org admins can manage their organizations" ON public.organizations
    FOR ALL TO authenticated
    USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('master_admin', 'org_admin'));

-- PROFILES
CREATE POLICY "Profiles are readable by tenant members" ON public.profiles
    FOR SELECT TO authenticated
    USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid());

-- AI PROVIDERS
CREATE POLICY "AI providers are readable by tenant members" ON public.ai_providers
    FOR SELECT TO authenticated
    USING (tenant_id IS NULL OR tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- AI MODELS
CREATE POLICY "AI models are readable by tenant members" ON public.ai_models
    FOR SELECT TO authenticated
    USING (true); -- Geralmente modelos são visíveis se o provedor for visível

-- AI AGENTS
CREATE POLICY "AI agents are readable by tenant members" ON public.ai_agents
    FOR SELECT TO authenticated
    USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- SOCIAL ACCOUNTS
CREATE POLICY "Social accounts are readable by tenant members" ON public.social_accounts
    FOR SELECT TO authenticated
    USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- POSTS
CREATE POLICY "Posts are manageable by tenant members" ON public.posts
    FOR ALL TO authenticated
    USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

-- AUDIT LOGS
CREATE POLICY "Audit logs are readable by tenant admins" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (tenant_id IN (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()) AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('master_admin', 'org_admin'));

