-- Insert sample data for comprehensive testing

-- Course Categories
INSERT INTO public.course_categories (category_id, course_category) VALUES 
(1, 'Computer Courses'),
(2, 'Technical Courses'),
(3, 'Professional Courses'),
(4, 'Certification Courses')
ON CONFLICT (category_id) DO NOTHING;

-- Course Master
INSERT INTO public.course_master (course_name, course_sort_name, duration, fees, category, status) VALUES 
('Diploma in Computer Application', 'DCA', '6 Months', '5000', 'Computer Courses', 'active'),
('Advanced Diploma in Computer Application', 'ADCA', '1 Year', '8000', 'Computer Courses', 'active'),
('Post Graduate Diploma in Computer Application', 'PGDCA', '1 Year', '12000', 'Computer Courses', 'active'),
('Certificate in Computer Fundamentals', 'CCF', '3 Months', '3000', 'Computer Courses', 'active'),
('Web Development Course', 'WDC', '8 Months', '10000', 'Technical Courses', 'active')
ON CONFLICT DO NOTHING;

-- Course Subjects
INSERT INTO public.course_subjects (course_name, semester_year, subject, theory_marks, practical_marks, description) VALUES 
('DCA', 'Semester 1', 'Computer Fundamentals', '100', '50', 'Basic computer concepts and operations'),
('DCA', 'Semester 1', 'MS Office', '100', '100', 'Microsoft Office applications'),
('DCA', 'Semester 2', 'Internet & Email', '100', '50', 'Internet basics and email communication'),
('ADCA', 'Year 1', 'Programming in C', '100', '100', 'C programming language fundamentals'),
('ADCA', 'Year 1', 'Database Management', '100', '100', 'Database concepts and SQL'),
('PGDCA', 'Year 1', 'Advanced Programming', '100', '100', 'Object-oriented programming concepts'),
('PGDCA', 'Year 1', 'System Analysis & Design', '100', '50', 'Software development lifecycle')
ON CONFLICT DO NOTHING;

-- Class Fees
INSERT INTO public.class_fees (course_name, course_type, board_university, duration, fees_entry, student_cv) VALUES 
('DCA', 'Diploma', 'State Board', '6 Months', '5000', 'Basic computer skills certification'),
('ADCA', 'Advanced Diploma', 'State Board', '1 Year', '8000', 'Advanced computer applications'),
('PGDCA', 'Post Graduate Diploma', 'University', '1 Year', '12000', 'Professional computer applications'),
('CCF', 'Certificate', 'Institute', '3 Months', '3000', 'Computer fundamentals'),
('WDC', 'Professional Course', 'Industry', '8 Months', '10000', 'Web development specialization')
ON CONFLICT DO NOTHING;

-- Employees
INSERT INTO public.employees (employee_id, full_name, father_name, email_id, contact_no, employee_password, address, city, state, country, pincode, district, salary, registration_date, status) VALUES 
('EMP001', 'Rajesh Kumar Singh', 'Ram Kumar Singh', 'rajesh.singh@bsoft.com', '9876543210', 'emp123456', '123 Main Street, Azamgarh', 'Azamgarh', 'Uttar Pradesh', 'India', '276001', 'Azamgarh', '25000', '2024-01-15', 'active'),
('EMP002', 'Priya Sharma', 'Suresh Sharma', 'priya.sharma@bsoft.com', '9876543211', 'emp123456', '456 Civil Lines, Azamgarh', 'Azamgarh', 'Uttar Pradesh', 'India', '276002', 'Azamgarh', '22000', '2024-02-01', 'active'),
('EMP003', 'Amit Verma', 'Dinesh Verma', 'amit.verma@bsoft.com', '9876543212', 'emp123456', '789 Kotwali Road, Azamgarh', 'Azamgarh', 'Uttar Pradesh', 'India', '276003', 'Azamgarh', '20000', '2024-02-15', 'active')
ON CONFLICT (employee_id) DO NOTHING;

-- Student Profiles
INSERT INTO public.student_profiles (full_name, email, phone, course_name, city, state, status, enrollment_date) VALUES 
('Gupteshwar Singh', 'gupteshwar@email.com', '9876543210', 'ADCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-01-15'),
('Chote Lal Kumar', 'chotelal@email.com', '9876543211', 'DCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-01-20'),
('Rajesh Kumar', 'rajesh@email.com', '9876543212', 'PGDCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-02-01'),
('Priya Sharma', 'priya@email.com', '9876543213', 'DCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-02-05'),
('Amit Verma', 'amit@email.com', '9876543214', 'ADCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-02-10'),
('Neha Singh', 'neha@email.com', '9876543215', 'PGDCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-02-15'),
('Rohit Kumar', 'rohit@email.com', '9876543216', 'DCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-02-20'),
('Pooja Gupta', 'pooja@email.com', '9876543217', 'ADCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-02-25'),
('Vikash Yadav', 'vikash@email.com', '9876543218', 'PGDCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-03-01'),
('Anita Mishra', 'anita@email.com', '9876543219', 'DCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-03-05')
ON CONFLICT DO NOTHING;

-- Attendance Management
INSERT INTO public.attendance_management (student_id, student_name, course_name, attendance_date, status, session_type, marked_by, remarks) VALUES 
('STU001', 'GUPTESHWAR SINGH', 'ADCA', '2024-03-01', 'present', 'theory', 'Rajesh Kumar Singh', 'On time'),
('STU002', 'CHOTE LAL KUMAR', 'DCA', '2024-03-01', 'present', 'theory', 'Priya Sharma', 'Active participation'),
('STU003', 'RAJESH KUMAR', 'PGDCA', '2024-03-01', 'absent', 'theory', 'Rajesh Kumar Singh', 'Medical leave'),
('STU004', 'PRIYA SHARMA', 'DCA', '2024-03-01', 'present', 'practical', 'Amit Verma', 'Good performance'),
('STU005', 'AMIT VERMA', 'ADCA', '2024-03-01', 'present', 'theory', 'Priya Sharma', 'Regular student'),
('STU001', 'GUPTESHWAR SINGH', 'ADCA', '2024-03-02', 'present', 'practical', 'Rajesh Kumar Singh', 'Lab work completed'),
('STU002', 'CHOTE LAL KUMAR', 'DCA', '2024-03-02', 'present', 'practical', 'Amit Verma', 'Good practical skills'),
('STU003', 'RAJESH KUMAR', 'PGDCA', '2024-03-02', 'present', 'theory', 'Priya Sharma', 'Back from leave')
ON CONFLICT DO NOTHING;

-- Marksheet Management
INSERT INTO public.marksheet_management (student_id, student_name, roll_number, course_name, examination_date, total_marks, obtained_marks, percentage, grade, result_status) VALUES 
('STU001', 'GUPTESHWAR SINGH', '20040', 'ADCA', '2024-02-15', 500, 425, 85.00, 'A', 'pass'),
('STU002', 'CHOTE LAL KUMAR', '20043', 'DCA', '2024-02-15', 400, 320, 80.00, 'A', 'pass'),
('STU003', 'RAJESH KUMAR', '20045', 'PGDCA', '2024-02-16', 600, 480, 80.00, 'A', 'pass'),
('STU004', 'PRIYA SHARMA', '20046', 'DCA', '2024-02-17', 400, 340, 85.00, 'A', 'pass'),
('STU005', 'AMIT VERMA', '20047', 'ADCA', '2024-02-17', 500, 400, 80.00, 'A', 'pass')
ON CONFLICT DO NOTHING;

-- Certificate Management
INSERT INTO public.certificate_management (student_id, student_name, course_name, certificate_number, certificate_type, issue_date, completion_date, grade, status) VALUES 
('STU001', 'GUPTESHWAR SINGH', 'ADCA', 'CERT001', 'course_completion', '2024-03-01', '2024-02-28', 'A', 'active'),
('STU002', 'CHOTE LAL KUMAR', 'DCA', 'CERT002', 'course_completion', '2024-03-01', '2024-02-28', 'A', 'active'),
('STU003', 'RAJESH KUMAR', 'PGDCA', 'CERT003', 'course_completion', '2024-03-02', '2024-02-29', 'A', 'active'),
('STU004', 'PRIYA SHARMA', 'DCA', 'CERT004', 'course_completion', '2024-03-02', '2024-02-29', 'A', 'active'),
('STU005', 'AMIT VERMA', 'ADCA', 'CERT005', 'course_completion', '2024-03-03', '2024-03-01', 'A', 'active')
ON CONFLICT DO NOTHING;

-- Fees Receipts
INSERT INTO public.fees_receipts (student_id, student, course, franchise_id, franchise_name, receipt_no, receipt_date, total_fee, amount_paid, amount_due, payment_details, status) VALUES 
('STU001', 'GUPTESHWAR SINGH', 'ADCA', 'FR001', 'Main Branch Azamgarh', 'REC001', '2024-01-15', 8000, 8000, 0, 'Cash payment', 'paid'),
('STU002', 'CHOTE LAL KUMAR', 'DCA', 'FR001', 'Main Branch Azamgarh', 'REC002', '2024-01-20', 5000, 3000, 2000, 'Partial payment', 'pending'),
('STU003', 'RAJESH KUMAR', 'PGDCA', 'FR001', 'Main Branch Azamgarh', 'REC003', '2024-02-01', 12000, 12000, 0, 'Online payment', 'paid'),
('STU004', 'PRIYA SHARMA', 'DCA', 'FR002', 'Jiyanpur Branch', 'REC004', '2024-02-05', 5000, 5000, 0, 'UPI payment', 'paid'),
('STU005', 'AMIT VERMA', 'ADCA', 'FR002', 'Jiyanpur Branch', 'REC005', '2024-02-10', 8000, 4000, 4000, 'Installment', 'pending')
ON CONFLICT DO NOTHING;

-- Bank Details
INSERT INTO public.bank_details (bank_name, branch_name, account_number, ifsc_code, micr_code) VALUES 
('State Bank of India', 'Azamgarh Main Branch', '12345678901234', 'SBIN0001234', '123456789'),
('Punjab National Bank', 'Civil Lines Azamgarh', '23456789012345', 'PUNB0002345', '234567890'),
('Union Bank of India', 'Kotwali Road Azamgarh', '34567890123456', 'UBIN0003456', '345678901')
ON CONFLICT DO NOTHING;

-- Head Offices
INSERT INTO public.head_offices (name, address, phone, email, city, state, country, postal_code, website, is_primary, status) VALUES 
('B. Soft Computer Institute Head Office', 'Near Union Bank Of India, Vill & Post BILARIYAGAN J', '+91-9876543210', 'info@bsoftinstitute.com', 'Azamgarh', 'Uttar Pradesh', 'India', '276121', 'www.bsoftinstitute.com', true, 'active'),
('Regional Office Lucknow', '123 Hazratganj, Lucknow', '+91-9876543211', 'lucknow@bsoftinstitute.com', 'Lucknow', 'Uttar Pradesh', 'India', '226001', 'www.bsoftinstitute.com', false, 'active')
ON CONFLICT DO NOTHING;

-- State Master
INSERT INTO public.state_master (city_id, city_name) VALUES 
(1, 'Azamgarh'),
(2, 'Lucknow'),
(3, 'Kanpur'),
(4, 'Varanasi'),
(5, 'Allahabad')
ON CONFLICT (city_id) DO NOTHING;

-- District Master
INSERT INTO public.district_master (city_id, site_id, site_name, created_date) VALUES 
(1, 101, 'Azamgarh District', '2024-01-01'),
(2, 102, 'Lucknow District', '2024-01-01'),
(3, 103, 'Kanpur District', '2024-01-01'),
(4, 104, 'Varanasi District', '2024-01-01'),
(5, 105, 'Allahabad District', '2024-01-01')
ON CONFLICT (site_id) DO NOTHING;

-- Director Messages
INSERT INTO public.director_messages (message, photo) VALUES 
('Welcome to B. Soft Computer Institute. We are committed to providing quality technical education and empowering students with practical skills for the digital age.', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Our mission is to bridge the gap between traditional education and industry requirements through comprehensive computer training programs.', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png')
ON CONFLICT DO NOTHING;

-- Missions
INSERT INTO public.missions (content, image) VALUES 
('To provide quality technical education and training in computer applications, ensuring students are industry-ready with practical skills and knowledge.', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('To establish a network of excellence in computer education across rural and urban areas, making technology accessible to all sections of society.', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png')
ON CONFLICT DO NOTHING;

-- News
INSERT INTO public.news (news_id, news_title, news_description, news_date, photo) VALUES 
(1, 'New Batch Admission Open', 'Admissions are now open for DCA, ADCA, and PGDCA courses. Limited seats available. Apply now!', '2024-03-15', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
(2, 'Annual Technical Fest 2024', 'Join us for our annual technical festival featuring programming competitions, workshops, and industry expert sessions.', '2024-03-10', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
(3, 'Placement Drive Success', '95% of our students got placed in reputed companies. Special thanks to our training faculty and industry partners.', '2024-03-05', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png')
ON CONFLICT (news_id) DO NOTHING;

-- Competition Courses
INSERT INTO public.competition_courses (title, description, date, file) VALUES 
('Programming Competition 2024', 'Annual programming competition for all students. Prizes worth Rs. 50,000. Register now!', '2024-04-15', 'programming-competition-2024.pdf'),
('Web Development Contest', 'Showcase your web development skills. Build innovative websites and win exciting prizes.', '2024-04-20', 'web-dev-contest-2024.pdf'),
('Database Design Challenge', 'Design efficient database solutions for real-world problems. Open for PGDCA students.', '2024-04-25', 'database-challenge-2024.pdf')
ON CONFLICT DO NOTHING;

-- Menu Content (Study Materials)
INSERT INTO public.menu_content (course, upload_file_title, course_file, date, notes) VALUES 
('DCA', 'Computer Fundamentals Notes', 'computer-fundamentals-notes.pdf', '15/03/2024', 'Basic concepts and terminology'),
('DCA', 'MS Office Tutorial', 'ms-office-tutorial.pdf', '16/03/2024', 'Step-by-step guide for Word, Excel, PowerPoint'),
('ADCA', 'C Programming Manual', 'c-programming-manual.pdf', '17/03/2024', 'Complete programming guide with examples'),
('ADCA', 'Database Concepts', 'database-concepts.pdf', '18/03/2024', 'DBMS fundamentals and SQL'),
('PGDCA', 'System Analysis Notes', 'system-analysis-notes.pdf', '19/03/2024', 'Software development lifecycle'),
('PGDCA', 'Advanced Programming', 'advanced-programming.pdf', '20/03/2024', 'Object-oriented programming concepts')
ON CONFLICT DO NOTHING;

-- Photo Gallery
INSERT INTO public.photo_gallery (title, image_url) VALUES 
('Computer Lab', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Classroom Sessions', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Annual Function 2024', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Student Projects Exhibition', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Placement Ceremony', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Faculty Development Program', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png')
ON CONFLICT DO NOTHING;

-- Student Data (Additional content)
INSERT INTO public.student_data (title, course_category, details, publish_date, photo_url) VALUES 
('Student Success Stories', 'Computer Courses', 'Our students have achieved remarkable success in various fields of technology and continue to excel in their careers.', '15/03/2024', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Industry Partnerships', 'Professional Courses', 'We have partnerships with leading IT companies to provide internship and placement opportunities to our students.', '16/03/2024', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Alumni Network', 'All Courses', 'Our strong alumni network spans across various industries and continues to support current students with mentorship.', '17/03/2024', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png')
ON CONFLICT DO NOTHING;

-- Payment Modes
INSERT INTO public.payment_modes (mode_name, description, processing_fee, is_active, gateway_details) VALUES 
('Cash', 'Direct cash payment at institute', 0, true, '{}'),
('UPI', 'Unified Payments Interface', 0, true, '{"upi_id": "bsoft@paytm"}'),
('Net Banking', 'Online bank transfer', 10, true, '{"supported_banks": ["SBI", "PNB", "HDFC", "ICICI"]}'),
('Credit/Debit Card', 'Card payments', 15, true, '{"accepted_cards": ["Visa", "Mastercard", "RuPay"]}'),
('NEFT/RTGS', 'Bank transfer', 5, true, '{"account_details": "provided_separately"}')
ON CONFLICT DO NOTHING;

-- Expense Master
INSERT INTO public.expense_master (service_name, description) VALUES 
('Office Supplies', 'Stationery, papers, printer cartridges, etc.'),
('Infrastructure', 'Computer hardware, furniture, equipment'),
('Utilities', 'Electricity, internet, telephone bills'),
('Marketing', 'Advertisements, brochures, promotional materials'),
('Training', 'Faculty development and training programs'),
('Maintenance', 'Computer and equipment maintenance')
ON CONFLICT DO NOTHING;

-- Expense Entries
INSERT INTO public.expense_entries (expense_name, service_name, expense_date, quantity, given_to, description) VALUES 
('Printer Cartridges', 'Office Supplies', '2024-03-01', '5', 'Office Admin', 'Black and color cartridges for printers'),
('Computer Monitors', 'Infrastructure', '2024-03-02', '10', 'Lab Manager', '24-inch LED monitors for computer lab'),
('Internet Bill', 'Utilities', '2024-03-03', '1', 'Accounts', 'Monthly broadband charges'),
('Advertisement Banner', 'Marketing', '2024-03-04', '3', 'Marketing Team', 'Course promotion banners'),
('Faculty Training', 'Training', '2024-03-05', '1', 'Training Coordinator', 'Advanced programming workshop'),
('AC Servicing', 'Maintenance', '2024-03-06', '1', 'Maintenance Staff', 'Annual maintenance of air conditioners')
ON CONFLICT DO NOTHING;

-- Day Book Entries
INSERT INTO public.day_book_entries (entry_date, service_name, description, amount, transaction_type) VALUES 
('2024-03-01', 'Course Fees', 'DCA course fee payment from student', 5000, 'income'),
('2024-03-01', 'Office Supplies', 'Purchase of stationery items', 500, 'expense'),
('2024-03-02', 'Course Fees', 'ADCA course fee payment', 8000, 'income'),
('2024-03-02', 'Infrastructure', 'Computer monitor purchase', 15000, 'expense'),
('2024-03-03', 'Course Fees', 'PGDCA course fee payment', 12000, 'income'),
('2024-03-03', 'Utilities', 'Monthly internet bill payment', 2000, 'expense')
ON CONFLICT DO NOTHING;

-- Opening Balances
INSERT INTO public.opening_balances (entry_date, description, amount) VALUES 
('2024-01-01', 'Cash in hand - opening balance', 50000),
('2024-01-01', 'Bank balance - SBI Account', 200000),
('2024-01-01', 'Computer equipment value', 500000),
('2024-01-01', 'Furniture and fixtures', 100000)
ON CONFLICT DO NOTHING;

-- Franchise Registrations
INSERT INTO public.franchise_registrations (
  franchise_type, institute_full_name, institute_sort_name, year_of_establishment,
  postal_address, pin_code, city_town_village, state_name, district_name,
  state_sort_name, district_sort_name, mobile_number, email,
  centre_head_name, designation, head_state, head_district,
  head_postal_address, head_pin_code, head_mobile_number, head_email,
  gender, educational_qualification, experience, marital_status, religion,
  internet_connectivity, connectivity_type, internet_speed,
  number_of_servers, operating_system, antivirus, printers_scanner,
  power_backup, type_of_faculties, number_of_faculties,
  date_of_registration, status, approval_status
) VALUES 
(
  'Main Branch', 'B. Soft Computer Institute Main Branch', 'BSOFT-MAIN', '2020',
  'Near Union Bank, Bilariyagan J, Azamgarh', '276121', 'Bilariyagan J', 'Uttar Pradesh', 'Azamgarh',
  'UP', 'AZG', '9876543210', 'main@bsoftinstitute.com',
  'Rajesh Kumar Singh', 'Director', 'Uttar Pradesh', 'Azamgarh',
  'Same as institute address', '276121', '9876543210', 'rajesh@bsoftinstitute.com',
  'Male', 'M.Tech Computer Science', '10+ Years', 'Married', 'Hindu',
  'Yes', 'Broadband', '100 Mbps',
  '2', 'Windows 10/11', 'Quick Heal', 'Yes',
  'UPS + Generator', 'Qualified Faculty', '5',
  '2024-01-01', 'active', 'approved'
),
(
  'Branch', 'B. Soft Jiyanpur Center', 'BSOFT-JIY', '2022',
  'Near Post Office, Jiyanpur, Azamgarh', '276125', 'Jiyanpur', 'Uttar Pradesh', 'Azamgarh',
  'UP', 'AZG', '9876543211', 'jiyanpur@bsoftinstitute.com',
  'Priya Sharma', 'Branch Manager', 'Uttar Pradesh', 'Azamgarh',
  'Jiyanpur Main Road', '276125', '9876543211', 'priya@bsoftinstitute.com',
  'Female', 'MCA', '5+ Years', 'Single', 'Hindu',
  'Yes', 'Broadband', '50 Mbps',
  '1', 'Windows 10', 'Avast', 'Yes',
  'UPS', 'Qualified Faculty', '3',
  '2024-02-01', 'active', 'approved'
)
ON CONFLICT DO NOTHING;

-- Enquiries
INSERT INTO public.enquiries (first_name, last_name, email, phone, organization, address, city, state) VALUES 
('Suresh', 'Kumar', 'suresh.kumar@email.com', '9876543220', 'Self', '123 Main Road', 'Azamgarh', 'Uttar Pradesh'),
('Kavita', 'Singh', 'kavita.singh@email.com', '9876543221', 'College Student', '456 Civil Lines', 'Lucknow', 'Uttar Pradesh'),
('Ravi', 'Gupta', 'ravi.gupta@email.com', '9876543222', 'Software Company', '789 IT Park', 'Noida', 'Uttar Pradesh'),
('Sunita', 'Verma', 'sunita.verma@email.com', '9876543223', 'Housewife', '321 New Colony', 'Varanasi', 'Uttar Pradesh')
ON CONFLICT DO NOTHING;

-- Contact Us submissions
INSERT INTO public.contact_us (name, email, phone, message) VALUES 
('Mahesh Kumar', 'mahesh@email.com', '9876543224', 'I am interested in PGDCA course. Please send me the detailed syllabus and fee structure.'),
('Rekha Sharma', 'rekha@email.com', '9876543225', 'Do you provide placement assistance after course completion? What is the success rate?'),
('Deepak Singh', 'deepak@email.com', '9876543226', 'I want to start a franchise in my city. Please guide me about the process and investment required.'),
('Anita Gupta', 'anita.g@email.com', '9876543227', 'Are there any weekend batches available for working professionals?')
ON CONFLICT DO NOTHING;