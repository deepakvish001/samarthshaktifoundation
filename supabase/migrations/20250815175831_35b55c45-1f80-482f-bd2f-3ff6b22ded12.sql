-- Fix remaining security vulnerabilities for financial and employee data

-- 1. Financial records security
ALTER TABLE fees_receipts ENABLE ROW LEVEL SECURITY;

-- Only admins can manage fees receipts
CREATE POLICY "Only admins can manage fees receipts"
ON fees_receipts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Day book entries security
ALTER TABLE day_book_entries ENABLE ROW LEVEL SECURITY;

-- Only admins can manage day book entries
CREATE POLICY "Only admins can manage day book entries"
ON day_book_entries FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Expense entries security
ALTER TABLE expense_entries ENABLE ROW LEVEL SECURITY;

-- Only admins can manage expense entries
CREATE POLICY "Only admins can manage expense entries"
ON expense_entries FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Opening balances security
ALTER TABLE opening_balances ENABLE ROW LEVEL SECURITY;

-- Only admins can manage opening balances
CREATE POLICY "Only admins can manage opening balances"
ON opening_balances FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Additional financial tables
ALTER TABLE expense_master ENABLE ROW LEVEL SECURITY;

-- Only admins can manage expense master
CREATE POLICY "Only admins can manage expense master"
ON expense_master FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE payment_modes ENABLE ROW LEVEL SECURITY;

-- Only admins can manage payment modes
CREATE POLICY "Only admins can manage payment modes"
ON payment_modes FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Strengthen admin_profiles security
-- Drop the existing less restrictive policies and create admin-only policies
DROP POLICY IF EXISTS "Users can view their own admin profile" ON admin_profiles;
DROP POLICY IF EXISTS "Users can update their own admin profile" ON admin_profiles;
DROP POLICY IF EXISTS "Users can insert their own admin profile" ON admin_profiles;

-- Only admins can manage admin profiles
CREATE POLICY "Only admins can manage admin profiles"
ON admin_profiles FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- 7. Secure additional sensitive tables
ALTER TABLE class_fees ENABLE ROW LEVEL SECURITY;

-- Only admins can manage class fees
CREATE POLICY "Only admins can manage class fees"
ON class_fees FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE certificate_management ENABLE ROW LEVEL SECURITY;

-- Only admins can manage certificates
CREATE POLICY "Only admins can manage certificate management"
ON certificate_management FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE marksheet_management ENABLE ROW LEVEL SECURITY;

-- Only admins can manage marksheets
CREATE POLICY "Only admins can manage marksheet management"
ON marksheet_management FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE attendance_management ENABLE ROW LEVEL SECURITY;

-- Only admins can manage attendance
CREATE POLICY "Only admins can manage attendance management"
ON attendance_management FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));