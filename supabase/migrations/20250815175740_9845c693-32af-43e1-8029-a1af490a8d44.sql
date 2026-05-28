-- Fix critical security vulnerabilities by adding proper RLS policies

-- 1. Admin profiles security
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own admin profile
CREATE POLICY "Users can view their own admin profile"
ON admin_profiles FOR SELECT
USING (user_id = auth.uid());

-- Allow users to update their own admin profile
CREATE POLICY "Users can update their own admin profile"
ON admin_profiles FOR UPDATE
USING (user_id = auth.uid());

-- Allow users to insert their own admin profile
CREATE POLICY "Users can insert their own admin profile"
ON admin_profiles FOR INSERT
WITH CHECK (user_id = auth.uid());

-- 2. Student personal data in alot_numbers
ALTER TABLE alot_numbers ENABLE ROW LEVEL SECURITY;

-- Only admins can manage student allotment numbers
CREATE POLICY "Only admins can manage student allotment data"
ON alot_numbers FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Bank details security
ALTER TABLE bank_details ENABLE ROW LEVEL SECURITY;

-- Only admins can view bank details
CREATE POLICY "Only admins can view bank details"
ON bank_details FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can manage bank details
CREATE POLICY "Only admins can manage bank details"
ON bank_details FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update bank details"
ON bank_details FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete bank details"
ON bank_details FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Contact us data security
ALTER TABLE contact_us ENABLE ROW LEVEL SECURITY;

-- Only admins can view contact submissions
CREATE POLICY "Only admins can view contact submissions"
ON contact_us FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit contact forms
CREATE POLICY "Anyone can submit contact forms"
ON contact_us FOR INSERT
WITH CHECK (true);

-- Only admins can update/delete contact submissions
CREATE POLICY "Only admins can manage contact submissions"
ON contact_us FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete contact submissions"
ON contact_us FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Employee data security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Only admins can manage employee data
CREATE POLICY "Only admins can manage employee data"
ON employees FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Enquiry data security
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Only admins can view enquiries
CREATE POLICY "Only admins can view enquiries"
ON enquiries FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit enquiries
CREATE POLICY "Anyone can submit enquiries"
ON enquiries FOR INSERT
WITH CHECK (true);

-- Only admins can manage enquiries
CREATE POLICY "Only admins can manage enquiries"
ON enquiries FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete enquiries"
ON enquiries FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Franchise registration security
ALTER TABLE franchise_registrations ENABLE ROW LEVEL SECURITY;

-- Only admins can manage franchise registrations
CREATE POLICY "Only admins can manage franchise registrations"
ON franchise_registrations FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 8. Student profiles security (additional protection)
-- Note: This table already has some RLS but we need more comprehensive protection

-- Update existing policies to be more restrictive
DROP POLICY IF EXISTS "Users can view their own student profile" ON student_profiles;

-- Only admins can manage student profiles
CREATE POLICY "Only admins can manage student profiles"
ON student_profiles FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Students can view their own profile via email match
CREATE POLICY "Students can view their own profile"
ON student_profiles FOR SELECT
USING (email = auth.email());