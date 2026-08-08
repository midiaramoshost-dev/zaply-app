-- Garantir que a tabela existe (fallback)
CREATE TABLE IF NOT EXISTS public.platform_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir configurações padrão se não existirem
INSERT INTO public.platform_settings (key, value)
VALUES 
('system_config', '{"maintenance_mode": false, "trial_duration_hours": 3, "default_credits": 100}'),
('branding', '{"name": "Zaply", "primary_color": "#00FF00"}'),
('landing_page', '{"hero": {"headline": "Sua próxima ideia em escala", "subheadline": "A plataforma definitiva para criação e automação de conteúdo com IA."}, "seo": {"title": "Zaply - Enterprise AI Content", "description": "Gerenciamento de conteúdo multicanal."}}')
ON CONFLICT (key) DO NOTHING;

-- Garantir permissões para o service_role (usado pelo supabaseAdmin)
GRANT ALL ON public.platform_settings TO service_role;
GRANT SELECT ON public.platform_settings TO authenticated;
