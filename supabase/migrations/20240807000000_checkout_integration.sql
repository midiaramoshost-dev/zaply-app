-- Adicionar campos de checkout na tabela tenants se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenants' AND column_name = 'stripe_customer_id') THEN
        ALTER TABLE public.tenants ADD COLUMN stripe_customer_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenants' AND column_name = 'subscription_status') THEN
        ALTER TABLE public.tenants ADD COLUMN subscription_status TEXT DEFAULT 'trialing';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tenants' AND column_name = 'plan_id') THEN
        ALTER TABLE public.tenants ADD COLUMN plan_id TEXT;
    END IF;
END $$;

-- Garantir que as organizações herdem o bloqueio se o tenant estiver inadimplente
-- (Isso será tratado via RLS e lógica de aplicação)

-- Atualizar RLS para bloquear acesso se o status da assinatura não for 'active' ou 'trialing'
-- Nota: 'is_active' no profile já é usado, vamos integrá-lo com o status do tenant.

GRANT SELECT, UPDATE ON public.tenants TO authenticated;
