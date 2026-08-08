-- Adiciona colunas para limites diários de postagens, mídias e redes sociais
ALTER TABLE public.user_credits 
ADD COLUMN IF NOT EXISTS daily_post_limit integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS daily_media_limit integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS max_social_accounts integer DEFAULT 3;

-- Comentários para documentação
COMMENT ON COLUMN public.user_credits.daily_post_limit IS 'Quantidade máxima de postagens por dia';
COMMENT ON COLUMN public.user_credits.daily_media_limit IS 'Quantidade máxima de mídias (fotos/vídeos) por dia';
COMMENT ON COLUMN public.user_credits.max_social_accounts IS 'Quantidade máxima de contas sociais conectadas';

-- Seeds fictícios para testes se necessário
-- (Assumindo que já existem perfis, vinculamos créditos a eles se não existirem)
INSERT INTO public.user_credits (user_id, tenant_id, balance, daily_post_limit, daily_media_limit, max_social_accounts)
SELECT p.id, p.tenant_id, 100, 5, 10, 3
FROM public.profiles p
ON CONFLICT (user_id) DO UPDATE 
SET 
  daily_post_limit = EXCLUDED.daily_post_limit,
  daily_media_limit = EXCLUDED.daily_media_limit,
  max_social_accounts = EXCLUDED.max_social_accounts;

GRANT ALL ON public.user_credits TO authenticated;
GRANT ALL ON public.user_credits TO service_role;
