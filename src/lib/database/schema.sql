-- Zaply Enterprise Multi-Tenant Schema

-- 1. Tenants & Organizations
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subdomain TEXT UNIQUE,
    custom_domain TEXT UNIQUE,
    is_white_label BOOLEAN DEFAULT FALSE,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#3B82F6',
    stripe_customer_id TEXT,
    subscription_status TEXT DEFAULT 'trialing',
    plan_id TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RBAC (User Roles & Permissions)
CREATE TYPE public.user_role AS ENUM ('master_admin', 'org_admin', 'member', 'viewer');

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.tenants(id),
    full_name TEXT,
    avatar_url TEXT,
    email TEXT UNIQUE NOT NULL,
    role public.user_role DEFAULT 'member',
    is_active BOOLEAN DEFAULT TRUE,
    approved BOOLEAN DEFAULT FALSE,
    requested_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. AI Gateway (Providers & Models)
CREATE TABLE public.ai_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE, -- NULL means system-wide
    name TEXT NOT NULL,
    provider_type TEXT NOT NULL, -- 'openai', 'anthropic', etc.
    api_key_secret_name TEXT, -- Reference to Lovable Secrets
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.ai_providers(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL, -- 'gpt-4o', 'claude-3-5-sonnet'
    task_type TEXT NOT NULL, -- 'text', 'image', 'video'
    is_active BOOLEAN DEFAULT TRUE,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Social Media Integrations
CREATE TABLE public.social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    platform TEXT NOT NULL, -- 'instagram', 'linkedin', 'facebook', 'x', 'tiktok', 'youtube'
    account_name TEXT NOT NULL,
    account_id TEXT NOT NULL,
    access_token_secret_name TEXT,
    refresh_token_secret_name TEXT,
    token_expires_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.social_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    content TEXT,
    media_urls TEXT[],
    platform TEXT NOT NULL,
    status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    ai_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Security & Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenants TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_providers TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_models TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_posts TO authenticated;

GRANT ALL ON public.tenants TO service_role;
GRANT ALL ON public.organizations TO service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.ai_providers TO service_role;
GRANT ALL ON public.ai_models TO service_role;
GRANT ALL ON public.social_accounts TO service_role;
GRANT ALL ON public.social_posts TO service_role;

-- RLS Policies (Simplificadas para o prompt)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tenant" ON public.tenants
FOR SELECT TO authenticated USING (id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view their own organization" ON public.organizations
FOR SELECT TO authenticated USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT TO authenticated USING (id = auth.uid());
