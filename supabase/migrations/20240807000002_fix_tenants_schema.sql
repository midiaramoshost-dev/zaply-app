-- Ajustando a tabela tenants para garantir compatibilidade com o repositório e os requisitos Enterprise
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS is_white_label BOOLEAN DEFAULT false;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#1E293B';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS custom_settings JSONB DEFAULT '{}';

-- Garantir que a coluna slug seja preenchida se houver dados (gerar a partir do nome se necessário)
UPDATE public.tenants SET slug = lower(replace(name, ' ', '-')) WHERE slug IS NULL;
ALTER TABLE public.tenants ALTER COLUMN slug SET NOT NULL;

-- GRANTs
GRANT SELECT ON public.tenants TO authenticated;
GRANT SELECT ON public.tenants TO anon; -- Necessário para identificar o tenant pelo slug antes do login (White Label)
