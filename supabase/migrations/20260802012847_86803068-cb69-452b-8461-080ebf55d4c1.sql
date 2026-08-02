REVOKE ALL ON FUNCTION public.admin_platform_stats() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.admin_platform_stats() TO service_role;
REVOKE ALL ON FUNCTION public.grant_user_credits(uuid, integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_user_credits(uuid, integer, text) TO service_role;