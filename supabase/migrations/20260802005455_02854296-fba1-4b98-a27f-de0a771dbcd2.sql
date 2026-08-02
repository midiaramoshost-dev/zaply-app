REVOKE EXECUTE ON FUNCTION public.admin_platform_stats() FROM anon;
REVOKE EXECUTE ON FUNCTION public.grant_user_credits(uuid, integer, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.owns_company(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.owns_post(uuid) FROM anon;