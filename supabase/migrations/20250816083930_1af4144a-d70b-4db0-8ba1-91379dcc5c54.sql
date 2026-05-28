-- Continue adding sample data with correct column names

-- Employees (without city column)
INSERT INTO public.employees (employee_id, full_name, father_name, email_id, contact_no, employee_password, address, state, country, pincode, district, salary, registration_date, status) VALUES 
('EMP001', 'Rajesh Kumar Singh', 'Ram Kumar Singh', 'rajesh.singh@bsoft.com', '9876543210', 'emp123456', '123 Main Street, Azamgarh', 'Uttar Pradesh', 'India', '276001', 'Azamgarh', '25000', '2024-01-15', 'active'),
('EMP002', 'Priya Sharma', 'Suresh Sharma', 'priya.sharma@bsoft.com', '9876543211', 'emp123456', '456 Civil Lines, Azamgarh', 'Uttar Pradesh', 'India', '276002', 'Azamgarh', '22000', '2024-02-01', 'active'),
('EMP003', 'Amit Verma', 'Dinesh Verma', 'amit.verma@bsoft.com', '9876543212', 'emp123456', '789 Kotwali Road, Azamgarh', 'Uttar Pradesh', 'India', '276003', 'Azamgarh', '20000', '2024-02-15', 'active'),
('EMP004', 'Sunita Devi', 'Ramlal Yadav', 'sunita.devi@bsoft.com', '9876543213', 'emp123456', '321 Teacher Colony, Azamgarh', 'Uttar Pradesh', 'India', '276004', 'Azamgarh', '18000', '2024-03-01', 'active');

-- Payment Modes
INSERT INTO public.payment_modes (mode_name, description, processing_fee, is_active, gateway_details) VALUES 
('Cash', 'Direct cash payment at institute', 0, true, '{}'),
('UPI', 'Unified Payments Interface', 0, true, '{"upi_id": "bsoft@paytm"}'),
('Net Banking', 'Online bank transfer', 10, true, '{"supported_banks": ["SBI", "PNB", "HDFC", "ICICI"]}'),
('Credit/Debit Card', 'Card payments', 15, true, '{"accepted_cards": ["Visa", "Mastercard", "RuPay"]}'),
('NEFT/RTGS', 'Bank transfer', 5, true, '{"account_details": "provided_separately"}');

-- Expense Master
INSERT INTO public.expense_master (service_name, description) VALUES 
('Office Supplies', 'Stationery, papers, printer cartridges, etc.'),
('Infrastructure', 'Computer hardware, furniture, equipment'),
('Utilities', 'Electricity, internet, telephone bills'),
('Marketing', 'Advertisements, brochures, promotional materials'),
('Training', 'Faculty development and training programs'),
('Maintenance', 'Computer and equipment maintenance');

-- Expense Entries
INSERT INTO public.expense_entries (expense_name, service_name, expense_date, quantity, given_to, description) VALUES 
('Printer Cartridges', 'Office Supplies', '2024-03-01', '5', 'Office Admin', 'Black and color cartridges for printers'),
('Computer Monitors', 'Infrastructure', '2024-03-02', '10', 'Lab Manager', '24-inch LED monitors for computer lab'),
('Internet Bill', 'Utilities', '2024-03-03', '1', 'Accounts', 'Monthly broadband charges'),
('Advertisement Banner', 'Marketing', '2024-03-04', '3', 'Marketing Team', 'Course promotion banners'),
('Faculty Training', 'Training', '2024-03-05', '1', 'Training Coordinator', 'Advanced programming workshop'),
('AC Servicing', 'Maintenance', '2024-03-06', '1', 'Maintenance Staff', 'Annual maintenance of air conditioners');

-- Day Book Entries
INSERT INTO public.day_book_entries (entry_date, service_name, description, amount, transaction_type) VALUES 
('2024-03-01', 'Course Fees', 'DCA course fee payment from student', 5000, 'income'),
('2024-03-01', 'Office Supplies', 'Purchase of stationery items', 500, 'expense'),
('2024-03-02', 'Course Fees', 'ADCA course fee payment', 8000, 'income'),
('2024-03-02', 'Infrastructure', 'Computer monitor purchase', 15000, 'expense'),
('2024-03-03', 'Course Fees', 'PGDCA course fee payment', 12000, 'income'),
('2024-03-03', 'Utilities', 'Monthly internet bill payment', 2000, 'expense'),
('2024-03-04', 'Course Fees', 'CCF course fee payment', 3000, 'income'),
('2024-03-04', 'Marketing', 'Advertisement banner costs', 1500, 'expense');

-- Opening Balances
INSERT INTO public.opening_balances (entry_date, description, amount) VALUES 
('2024-01-01', 'Cash in hand - opening balance', 50000),
('2024-01-01', 'Bank balance - SBI Account', 200000),
('2024-01-01', 'Computer equipment value', 500000),
('2024-01-01', 'Furniture and fixtures', 100000),
('2024-02-01', 'Monthly cash collection', 75000),
('2024-03-01', 'Quarterly assessment', 125000);

-- Enquiries
INSERT INTO public.enquiries (first_name, last_name, email, phone, organization, address, city, state) VALUES 
('Suresh', 'Kumar', 'suresh.kumar@email.com', '9876543220', 'Self', '123 Main Road', 'Azamgarh', 'Uttar Pradesh'),
('Kavita', 'Singh', 'kavita.singh@email.com', '9876543221', 'College Student', '456 Civil Lines', 'Lucknow', 'Uttar Pradesh'),
('Ravi', 'Gupta', 'ravi.gupta@email.com', '9876543222', 'Software Company', '789 IT Park', 'Noida', 'Uttar Pradesh'),
('Sunita', 'Verma', 'sunita.verma@email.com', '9876543223', 'Housewife', '321 New Colony', 'Varanasi', 'Uttar Pradesh'),
('Deepak', 'Yadav', 'deepak.yadav@email.com', '9876543224', 'Business', '654 Market Road', 'Kanpur', 'Uttar Pradesh');

-- Contact Us submissions
INSERT INTO public.contact_us (name, email, phone, message) VALUES 
('Mahesh Kumar', 'mahesh@email.com', '9876543224', 'I am interested in PGDCA course. Please send me the detailed syllabus and fee structure.'),
('Rekha Sharma', 'rekha@email.com', '9876543225', 'Do you provide placement assistance after course completion? What is the success rate?'),
('Deepak Singh', 'deepak@email.com', '9876543226', 'I want to start a franchise in my city. Please guide me about the process and investment required.'),
('Anita Gupta', 'anita.g@email.com', '9876543227', 'Are there any weekend batches available for working professionals?'),
('Ramesh Chand', 'ramesh@email.com', '9876543228', 'What are the computer lab facilities? How many systems are available for students?');

-- Additional Alot Numbers (for marksheet generation)
INSERT INTO public.alot_numbers (student_id, student_name, student_father_name, student_mother_name, course_name, course_examination_date, theory_max_marks, practical_max_marks, obtain_theory_marks, obtain_practical_marks, center_name, center_code, issue_date, place, student_photo_url, director_signature_url) VALUES 
('STU001', 'GUPTESHWAR SINGH', 'RAVINDRA SINGH', 'SHASHI PRABHA SINGH', 'ADCA', '2024-02-15', '500', '200', '425', '175', 'B. Soft Computer Institute', 'EC001', '2024-03-01', 'Azamgarh', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('STU002', 'CHOTE LAL KUMAR', 'VIJAY PRASAD', 'DHARMI DEVI', 'DCA', '2024-02-15', '400', '150', '320', '120', 'B. Soft Computer Institute', 'EC001', '2024-03-01', 'Azamgarh', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('STU003', 'RAJESH KUMAR', 'RAM PRASAD', 'SUNITA DEVI', 'PGDCA', '2024-02-16', '600', '250', '480', '200', 'Main Center', 'EC003', '2024-03-02', 'Azamgarh', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('STU004', 'PRIYA SHARMA', 'RAKESH SHARMA', 'SUNITA SHARMA', 'DCA', '2024-02-17', '400', '150', '340', '130', 'B. Soft Computer Institute', 'EC001', '2024-03-02', 'Azamgarh', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('STU005', 'AMIT VERMA', 'SURESH VERMA', 'GEETA VERMA', 'ADCA', '2024-02-17', '500', '200', '400', '160', 'Jiyanpur Center', 'EC002', '2024-03-03', 'Azamgarh', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png');