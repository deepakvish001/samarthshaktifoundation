-- Insert course master data
INSERT INTO public.course_master (course_name, course_sort_name, duration, fees, category, status) VALUES
('Diploma in Computer Hardware and Networking', 'DCHN', '12 months', '15000', '12 Month', 'active'),
('Advance Diploma In Computer Application(ADCA)', 'ADCA', '12', '4800', '12 Month', 'active'),
('Typing Hindi and English', 'Typing H&E', '3 Months', '2800', '3 Month', 'active'),
('COC', 'COMPUTER OPRETING COURSE', '90 DAYS', '3000', '3 Month', 'active'),
('OFFICE MANAGEMENT COURSE', 'OMC', '6 MONTH', '3000', '6 Month', 'active'),
('Post Graduate Diploma In Computer Application (PGDCA)', 'PGDCA', '12 Month', '15000', '1 Year', 'active'),
('PGDCA', 'PGDCA', '12 Month', '14500', '12 Month', 'active'),
('INDUSTRIAL SAFETY OFFICER', 'INDUSTRIAL SAFETY OFFICER', '12 Months', '9600', '12 Month', 'active'),
('Autocad', 'Autocad', '6', '8500', '6 Month', 'active'),
('Diploma in Computer Application (DCA)', 'DCA', '1 Year', '4500', '1 Year', 'active'),
('Diploma In Financial Accounting', 'DFA', '6 Months', '3500', '6 Month', 'active'),
('Wireless Technician (Telecom)', 'Wireless Technician', '12 Months', '8200', '12 Month', 'active')
ON CONFLICT (id) DO NOTHING;