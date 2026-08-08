CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Basic platform configuration
INSERT INTO public.platform_settings (key, value) VALUES
('branding', '{
    "name": "Zaply",
    "logo_url": null,
    "primary_color": "#d9f99d",
    "accent_color": "#a5f3fc",
    "favicon_url": null
}') ON CONFLICT (key) DO NOTHING;

INSERT INTO public.platform_settings (key, value) VALUES
('landing_page', '{
    "hero": {
        "headline": "Sua próxima ideia em escala.",
        "subheadline": "Do briefing ao post publicado: o Zaply transforma estratégia em um mês inteiro de conteúdo consistente, no ritmo da sua equipe.",
        "cta_primary": "Criar meu primeiro mês",
        "cta_secondary": "Ver em 90 segundos"
    },
    "features_title": "Uma operação de conteúdo inteira, em um único lugar",
    "features_description": "Cada módulo cobre uma etapa do fluxo — agora com editor integrado para revisar cada detalhe antes da publicação.",
    "seo": {
        "title": "Zaply — conteúdo com IA, do briefing à publicação",
        "description": "Gere posts com IA para Instagram, LinkedIn, Facebook e X, aprove com o cliente, agende o mês inteiro e publique automaticamente. Tudo em uma só plataforma."
    }
}') ON CONFLICT (key) DO NOTHING;

INSERT INTO public.platform_settings (key, value) VALUES
('system_config', '{
    "maintenance_mode": false,
    "registration_enabled": true,
    "trial_duration_hours": 3,
    "default_credits": 10
}') ON CONFLICT (key) DO NOTHING;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_settings TO authenticated;
GRANT ALL ON public.platform_settings TO service_role;
GRANT SELECT ON public.platform_settings TO anon;

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- If policy exists, drop it first
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Platform settings are readable by everyone') THEN
        DROP POLICY "Platform settings are readable by everyone" ON public.platform_settings;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Only admins can modify platform settings') THEN
        DROP POLICY "Only admins can modify platform settings" ON public.platform_settings;
    END IF;
END $$;

CREATE POLICY "Platform settings are readable by everyone" ON public.platform_settings
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify platform settings" ON public.platform_settings
    FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));