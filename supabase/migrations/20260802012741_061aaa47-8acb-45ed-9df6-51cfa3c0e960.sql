GRANT SELECT ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;
REVOKE ALL ON TABLE public.user_roles FROM anon;