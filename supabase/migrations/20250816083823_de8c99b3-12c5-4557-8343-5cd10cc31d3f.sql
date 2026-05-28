-- Continue adding comprehensive sample data for remaining tables

-- Class Fees
INSERT INTO public.class_fees (course_name, course_type, board_university, duration, fees_entry, student_cv) VALUES 
('DCA', 'Diploma', 'State Board', '6 Months', '5000', 'Basic computer skills certification'),
('ADCA', 'Advanced Diploma', 'State Board', '1 Year', '8000', 'Advanced computer applications'),
('PGDCA', 'Post Graduate Diploma', 'University', '1 Year', '12000', 'Professional computer applications'),
('CCF', 'Certificate', 'Institute', '3 Months', '3000', 'Computer fundamentals'),
('WDC', 'Professional Course', 'Industry', '8 Months', '10000', 'Web development specialization');

-- Employees
INSERT INTO public.employees (employee_id, full_name, father_name, email_id, contact_no, employee_password, address, city, state, country, pincode, district, salary, registration_date, status) VALUES 
('EMP001', 'Rajesh Kumar Singh', 'Ram Kumar Singh', 'rajesh.singh@bsoft.com', '9876543210', 'emp123456', '123 Main Street, Azamgarh', 'Azamgarh', 'Uttar Pradesh', 'India', '276001', 'Azamgarh', '25000', '2024-01-15', 'active'),
('EMP002', 'Priya Sharma', 'Suresh Sharma', 'priya.sharma@bsoft.com', '9876543211', 'emp123456', '456 Civil Lines, Azamgarh', 'Azamgarh', 'Uttar Pradesh', 'India', '276002', 'Azamgarh', '22000', '2024-02-01', 'active'),
('EMP003', 'Amit Verma', 'Dinesh Verma', 'amit.verma@bsoft.com', '9876543212', 'emp123456', '789 Kotwali Road, Azamgarh', 'Azamgarh', 'Uttar Pradesh', 'India', '276003', 'Azamgarh', '20000', '2024-02-15', 'active'),
('EMP004', 'Sunita Devi', 'Ramlal Yadav', 'sunita.devi@bsoft.com', '9876543213', 'emp123456', '321 Teacher Colony, Azamgarh', 'Azamgarh', 'Uttar Pradesh', 'India', '276004', 'Azamgarh', '18000', '2024-03-01', 'active');

-- Certificate Management
INSERT INTO public.certificate_management (student_id, student_name, course_name, certificate_number, certificate_type, issue_date, completion_date, grade, status) VALUES 
('STU001', 'GUPTESHWAR SINGH', 'ADCA', 'CERT001', 'course_completion', '2024-03-01', '2024-02-28', 'A', 'active'),
('STU002', 'CHOTE LAL KUMAR', 'DCA', 'CERT002', 'course_completion', '2024-03-01', '2024-02-28', 'A', 'active'),
('STU003', 'RAJESH KUMAR', 'PGDCA', 'CERT003', 'course_completion', '2024-03-02', '2024-02-29', 'A', 'active'),
('STU004', 'PRIYA SHARMA', 'DCA', 'CERT004', 'course_completion', '2024-03-02', '2024-02-29', 'A', 'active'),
('STU005', 'AMIT VERMA', 'ADCA', 'CERT005', 'course_completion', '2024-03-03', '2024-03-01', 'A', 'active');

-- Fees Receipts
INSERT INTO public.fees_receipts (student_id, student, course, franchise_id, franchise_name, receipt_no, receipt_date, total_fee, amount_paid, amount_due, payment_details, status) VALUES 
('STU001', 'GUPTESHWAR SINGH', 'ADCA', 'FR001', 'Main Branch Azamgarh', 'REC001', '2024-01-15', 8000, 8000, 0, 'Cash payment', 'paid'),
('STU002', 'CHOTE LAL KUMAR', 'DCA', 'FR001', 'Main Branch Azamgarh', 'REC002', '2024-01-20', 5000, 3000, 2000, 'Partial payment', 'pending'),
('STU003', 'RAJESH KUMAR', 'PGDCA', 'FR001', 'Main Branch Azamgarh', 'REC003', '2024-02-01', 12000, 12000, 0, 'Online payment', 'paid'),
('STU004', 'PRIYA SHARMA', 'DCA', 'FR002', 'Jiyanpur Branch', 'REC004', '2024-02-05', 5000, 5000, 0, 'UPI payment', 'paid'),
('STU005', 'AMIT VERMA', 'ADCA', 'FR002', 'Jiyanpur Branch', 'REC005', '2024-02-10', 8000, 4000, 4000, 'Installment', 'pending');

-- Bank Details
INSERT INTO public.bank_details (bank_name, branch_name, account_number, ifsc_code, micr_code) VALUES 
('State Bank of India', 'Azamgarh Main Branch', '12345678901234', 'SBIN0001234', '123456789'),
('Punjab National Bank', 'Civil Lines Azamgarh', '23456789012345', 'PUNB0002345', '234567890'),
('Union Bank of India', 'Kotwali Road Azamgarh', '34567890123456', 'UBIN0003456', '345678901');

-- Head Offices
INSERT INTO public.head_offices (name, address, phone, email, city, state, country, postal_code, website, is_primary, status) VALUES 
('B. Soft Computer Institute Head Office', 'Near Union Bank Of India, Vill & Post BILARIYAGAN J', '+91-9876543210', 'info@bsoftinstitute.com', 'Azamgarh', 'Uttar Pradesh', 'India', '276121', 'www.bsoftinstitute.com', true, 'active'),
('Regional Office Lucknow', '123 Hazratganj, Lucknow', '+91-9876543211', 'lucknow@bsoftinstitute.com', 'Lucknow', 'Uttar Pradesh', 'India', '226001', 'www.bsoftinstitute.com', false, 'active');

-- State Master  
INSERT INTO public.state_master (city_id, city_name) 
SELECT 1, 'Azamgarh' WHERE NOT EXISTS (SELECT 1 FROM public.state_master WHERE city_id = 1);
INSERT INTO public.state_master (city_id, city_name) 
SELECT 2, 'Lucknow' WHERE NOT EXISTS (SELECT 1 FROM public.state_master WHERE city_id = 2);
INSERT INTO public.state_master (city_id, city_name) 
SELECT 3, 'Kanpur' WHERE NOT EXISTS (SELECT 1 FROM public.state_master WHERE city_id = 3);
INSERT INTO public.state_master (city_id, city_name) 
SELECT 4, 'Varanasi' WHERE NOT EXISTS (SELECT 1 FROM public.state_master WHERE city_id = 4);
INSERT INTO public.state_master (city_id, city_name) 
SELECT 5, 'Allahabad' WHERE NOT EXISTS (SELECT 1 FROM public.state_master WHERE city_id = 5);

-- District Master
INSERT INTO public.district_master (city_id, site_id, site_name, created_date) 
SELECT 1, 101, 'Azamgarh District', '2024-01-01' WHERE NOT EXISTS (SELECT 1 FROM public.district_master WHERE site_id = 101);
INSERT INTO public.district_master (city_id, site_id, site_name, created_date) 
SELECT 2, 102, 'Lucknow District', '2024-01-01' WHERE NOT EXISTS (SELECT 1 FROM public.district_master WHERE site_id = 102);
INSERT INTO public.district_master (city_id, site_id, site_name, created_date) 
SELECT 3, 103, 'Kanpur District', '2024-01-01' WHERE NOT EXISTS (SELECT 1 FROM public.district_master WHERE site_id = 103);
INSERT INTO public.district_master (city_id, site_id, site_name, created_date) 
SELECT 4, 104, 'Varanasi District', '2024-01-01' WHERE NOT EXISTS (SELECT 1 FROM public.district_master WHERE site_id = 104);
INSERT INTO public.district_master (city_id, site_id, site_name, created_date) 
SELECT 5, 105, 'Allahabad District', '2024-01-01' WHERE NOT EXISTS (SELECT 1 FROM public.district_master WHERE site_id = 105);

-- Competition Courses
INSERT INTO public.competition_courses (title, description, date, file) VALUES 
('Programming Competition 2024', 'Annual programming competition for all students. Prizes worth Rs. 50,000. Register now!', '2024-04-15', 'programming-competition-2024.pdf'),
('Web Development Contest', 'Showcase your web development skills. Build innovative websites and win exciting prizes.', '2024-04-20', 'web-dev-contest-2024.pdf'),
('Database Design Challenge', 'Design efficient database solutions for real-world problems. Open for PGDCA students.', '2024-04-25', 'database-challenge-2024.pdf'),
('Mobile App Development Workshop', 'Learn to build Android and iOS apps. Industry experts will guide you through the process.', '2024-05-01', 'mobile-app-workshop-2024.pdf');

-- Additional Menu Content (Study Materials)
INSERT INTO public.menu_content (course, upload_file_title, course_file, date, notes) VALUES 
('DCA', 'Computer Fundamentals Notes', 'computer-fundamentals-notes.pdf', '15/03/2024', 'Basic concepts and terminology'),
('DCA', 'MS Office Tutorial', 'ms-office-tutorial.pdf', '16/03/2024', 'Step-by-step guide for Word, Excel, PowerPoint'),
('DCA', 'Internet Basics Guide', 'internet-basics-guide.pdf', '17/03/2024', 'Email, browsing, and online safety'),
('ADCA', 'C Programming Manual', 'c-programming-manual.pdf', '18/03/2024', 'Complete programming guide with examples'),
('ADCA', 'Database Concepts', 'database-concepts.pdf', '19/03/2024', 'DBMS fundamentals and SQL'),
('ADCA', 'Data Structures Notes', 'data-structures-notes.pdf', '20/03/2024', 'Arrays, linked lists, stacks, queues'),
('PGDCA', 'System Analysis Notes', 'system-analysis-notes.pdf', '21/03/2024', 'Software development lifecycle'),
('PGDCA', 'Advanced Programming', 'advanced-programming.pdf', '22/03/2024', 'Object-oriented programming concepts'),
('PGDCA', 'Project Management', 'project-management.pdf', '23/03/2024', 'Agile, Scrum methodologies'),
('CCF', 'Basic Computer Skills', 'basic-computer-skills.pdf', '24/03/2024', 'Introduction to computers'),
('WDC', 'HTML & CSS Guide', 'html-css-guide.pdf', '25/03/2024', 'Frontend development basics'),
('WDC', 'JavaScript Tutorial', 'javascript-tutorial.pdf', '26/03/2024', 'Interactive web development');

-- Student Data (Additional content)
INSERT INTO public.student_data (title, course_category, details, publish_date, photo_url) VALUES 
('Student Success Stories', 'Computer Courses', 'Our students have achieved remarkable success in various fields of technology and continue to excel in their careers.', '15/03/2024', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Industry Partnerships', 'Professional Courses', 'We have partnerships with leading IT companies to provide internship and placement opportunities to our students.', '16/03/2024', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Alumni Network', 'All Courses', 'Our strong alumni network spans across various industries and continues to support current students with mentorship.', '17/03/2024', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Placement Records', 'Computer Courses', '95% placement rate with top companies. Our training methodology ensures industry-ready professionals.', '18/03/2024', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png');

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
('STU003', 'RAJESH KUMAR', 'RAM PRASAD', 'SUNITA DEVI', 'PGDCA', '2024-02-16', '600', '250', '480', '200', 'Main Center', 'EC003', '2024-03-02', 'Azamgarh', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png');