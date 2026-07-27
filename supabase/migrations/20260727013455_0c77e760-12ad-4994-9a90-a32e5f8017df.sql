ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;
ALTER TABLE public.plans ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;

GRANT SELECT ON public.plans TO anon;
GRANT SELECT ON public.plans TO authenticated;
GRANT ALL ON public.plans TO service_role;

DELETE FROM public.plans WHERE code NOT IN ('starter','pro','agency');

INSERT INTO public.plans (code, name, description, price_cents, currency, interval, max_posts, max_clients, features, is_active, sort_order, is_featured)
VALUES
  ('starter', 'Starter', 'Para quem está começando a produzir conteúdo com IA.', 4700, 'BRL', 'month', 100, 1,
   '["1 cliente","100 posts por mês","Gerador de conteúdo por IA","Biblioteca e calendário"]'::jsonb, true, 1, false),
  ('pro', 'Pro', 'Para social medias e pequenas agências em ritmo constante.', 9700, 'BRL', 'month', NULL, 5,
   '["5 clientes","IA ilimitada","Agendamento automático","Geração de imagens por IA","Calendário automático de 30 dias"]'::jsonb, true, 2, true),
  ('agency', 'Agency', 'Para agências com equipe, clientes e relatórios sob a sua marca.', 29700, 'BRL', 'month', NULL, NULL,
   '["Clientes ilimitados","Múltiplos utilizadores","Fluxo de aprovação do cliente","Relatórios PDF e Excel","Marca branca","Automação n8n","Suporte prioritário"]'::jsonb, true, 3, false)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  currency = EXCLUDED.currency,
  interval = EXCLUDED.interval,
  max_posts = EXCLUDED.max_posts,
  max_clients = EXCLUDED.max_clients,
  features = EXCLUDED.features,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  is_featured = EXCLUDED.is_featured;