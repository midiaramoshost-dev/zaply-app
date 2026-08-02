REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated, anon, public;
REVOKE EXECUTE ON FUNCTION public.owns_company(uuid) FROM authenticated, anon, public;
REVOKE EXECUTE ON FUNCTION public.owns_post(uuid) FROM authenticated, anon, public;