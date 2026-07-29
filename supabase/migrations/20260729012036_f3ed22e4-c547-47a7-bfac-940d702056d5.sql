ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS approved boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS requested_plan text;

UPDATE public.profiles SET approved = true, approved_at = now() WHERE approved = false;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  existing_count integer;
BEGIN
  SELECT count(*) INTO existing_count FROM public.profiles;
  INSERT INTO public.profiles (id, full_name, avatar_url, email, approved, approved_at)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    existing_count = 0,
    CASE WHEN existing_count = 0 THEN now() ELSE NULL END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $function$;

DROP POLICY IF EXISTS "admins manage profiles" ON public.profiles;
CREATE POLICY "admins manage profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));