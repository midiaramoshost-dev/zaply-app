CREATE TABLE public.user_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.user_credits TO authenticated;
GRANT ALL ON public.user_credits TO service_role;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own credits" ON public.user_credits
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage credits" ON public.user_credits
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON public.user_credits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  reason text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.credit_transactions TO authenticated;
GRANT ALL ON public.credit_transactions TO service_role;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read own credit transactions" ON public.credit_transactions
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "admins manage credit transactions" ON public.credit_transactions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX credit_transactions_user_id_idx ON public.credit_transactions(user_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.grant_user_credits(_user_id uuid, _amount integer, _reason text DEFAULT NULL)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance integer;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  IF _amount IS NULL OR _amount = 0 THEN
    RAISE EXCEPTION 'invalid amount';
  END IF;

  INSERT INTO public.user_credits (user_id, balance)
  VALUES (_user_id, GREATEST(0, _amount))
  ON CONFLICT (user_id) DO UPDATE
    SET balance = GREATEST(0, public.user_credits.balance + _amount)
  RETURNING balance INTO new_balance;

  INSERT INTO public.credit_transactions (user_id, amount, reason, created_by)
  VALUES (_user_id, _amount, _reason, auth.uid());

  RETURN new_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.grant_user_credits(uuid, integer, text) FROM public;
GRANT EXECUTE ON FUNCTION public.grant_user_credits(uuid, integer, text) TO authenticated;