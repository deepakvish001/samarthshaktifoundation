
-- Allow public read for certificate verification via QR
CREATE POLICY "Public read marksheet_management"
ON public.marksheet_management
FOR SELECT
TO public
USING (true);

CREATE POLICY "Public read alot_numbers"
ON public.alot_numbers
FOR SELECT
TO public
USING (true);

-- student_profiles already allows owner-by-email reads; add open public read for verification
CREATE POLICY "Public read student_profiles for verification"
ON public.student_profiles
FOR SELECT
TO public
USING (true);

GRANT SELECT ON public.marksheet_management TO anon;
GRANT SELECT ON public.alot_numbers TO anon;
GRANT SELECT ON public.student_profiles TO anon;
GRANT SELECT ON public.course_subjects TO anon;
