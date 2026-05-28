CREATE POLICY "Public read certificate_management" ON public.certificate_management FOR SELECT USING (true);
GRANT SELECT ON public.certificate_management TO anon, authenticated;