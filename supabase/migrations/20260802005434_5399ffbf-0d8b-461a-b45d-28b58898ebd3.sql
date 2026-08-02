GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_credits TO authenticated;
GRANT ALL ON public.user_credits TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;