REVOKE EXECUTE ON FUNCTION public.owns_company(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.owns_post(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_company(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.owns_post(uuid) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;