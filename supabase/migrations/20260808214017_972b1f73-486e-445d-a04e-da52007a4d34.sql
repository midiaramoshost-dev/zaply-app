-- Dropping policies to recreate them securely
DROP POLICY IF EXISTS "Platform settings are readable by everyone" ON public.platform_settings;
DROP POLICY IF EXISTS "Only admins can modify platform settings" ON public.platform_settings;

-- Public read access for branding and landing page content
CREATE POLICY "Public read access for platform settings" ON public.platform_settings
    FOR SELECT USING (true);

-- Restrict write access to Master Admins only
-- We use a raw role check or the has_role function if defined
CREATE POLICY "Master admins can manage platform settings" ON public.platform_settings
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role::text = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role::text = 'admin'
        )
    );