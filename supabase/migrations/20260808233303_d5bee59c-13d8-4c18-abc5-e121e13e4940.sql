ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all" ON public.platform_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow service_role full access" ON public.platform_settings
    FOR ALL TO service_role USING (true);