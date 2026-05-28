-- Insert sample data for comprehensive testing (simplified approach)

-- Course Categories (only if not exists)
INSERT INTO public.course_categories (category_id, course_category) 
SELECT 1, 'Computer Courses' WHERE NOT EXISTS (SELECT 1 FROM public.course_categories WHERE category_id = 1);
INSERT INTO public.course_categories (category_id, course_category) 
SELECT 2, 'Technical Courses' WHERE NOT EXISTS (SELECT 1 FROM public.course_categories WHERE category_id = 2);
INSERT INTO public.course_categories (category_id, course_category) 
SELECT 3, 'Professional Courses' WHERE NOT EXISTS (SELECT 1 FROM public.course_categories WHERE category_id = 3);
INSERT INTO public.course_categories (category_id, course_category) 
SELECT 4, 'Certification Courses' WHERE NOT EXISTS (SELECT 1 FROM public.course_categories WHERE category_id = 4);

-- Course Master
INSERT INTO public.course_master (course_name, course_sort_name, duration, fees, category, status) VALUES 
('Diploma in Computer Application', 'DCA', '6 Months', '5000', 'Computer Courses', 'active'),
('Advanced Diploma in Computer Application', 'ADCA', '1 Year', '8000', 'Computer Courses', 'active'),
('Post Graduate Diploma in Computer Application', 'PGDCA', '1 Year', '12000', 'Computer Courses', 'active'),
('Certificate in Computer Fundamentals', 'CCF', '3 Months', '3000', 'Computer Courses', 'active'),
('Web Development Course', 'WDC', '8 Months', '10000', 'Technical Courses', 'active');

-- Course Subjects
INSERT INTO public.course_subjects (course_name, semester_year, subject, theory_marks, practical_marks, description) VALUES 
('DCA', 'Semester 1', 'Computer Fundamentals', '100', '50', 'Basic computer concepts and operations'),
('DCA', 'Semester 1', 'MS Office', '100', '100', 'Microsoft Office applications'),
('DCA', 'Semester 2', 'Internet & Email', '100', '50', 'Internet basics and email communication'),
('ADCA', 'Year 1', 'Programming in C', '100', '100', 'C programming language fundamentals'),
('ADCA', 'Year 1', 'Database Management', '100', '100', 'Database concepts and SQL'),
('PGDCA', 'Year 1', 'Advanced Programming', '100', '100', 'Object-oriented programming concepts'),
('PGDCA', 'Year 1', 'System Analysis & Design', '100', '50', 'Software development lifecycle');

-- Student Profiles
INSERT INTO public.student_profiles (full_name, email, phone, course_name, city, state, status, enrollment_date) VALUES 
('Gupteshwar Singh', 'gupteshwar@email.com', '9876543210', 'ADCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-01-15'),
('Chote Lal Kumar', 'chotelal@email.com', '9876543211', 'DCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-01-20'),
('Rajesh Kumar', 'rajesh@email.com', '9876543212', 'PGDCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-02-01'),
('Priya Sharma', 'priya@email.com', '9876543213', 'DCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-02-05'),
('Amit Verma', 'amit@email.com', '9876543214', 'ADCA', 'Azamgarh', 'Uttar Pradesh', 'active', '2024-02-10');

-- Attendance Management
INSERT INTO public.attendance_management (student_id, student_name, course_name, attendance_date, status, session_type, marked_by, remarks) VALUES 
('STU001', 'GUPTESHWAR SINGH', 'ADCA', '2024-03-01', 'present', 'theory', 'Rajesh Kumar Singh', 'On time'),
('STU002', 'CHOTE LAL KUMAR', 'DCA', '2024-03-01', 'present', 'theory', 'Priya Sharma', 'Active participation'),
('STU003', 'RAJESH KUMAR', 'PGDCA', '2024-03-01', 'absent', 'theory', 'Rajesh Kumar Singh', 'Medical leave'),
('STU004', 'PRIYA SHARMA', 'DCA', '2024-03-01', 'present', 'practical', 'Amit Verma', 'Good performance'),
('STU005', 'AMIT VERMA', 'ADCA', '2024-03-01', 'present', 'theory', 'Priya Sharma', 'Regular student');

-- Marksheet Management
INSERT INTO public.marksheet_management (student_id, student_name, roll_number, course_name, examination_date, total_marks, obtained_marks, percentage, grade, result_status) VALUES 
('STU001', 'GUPTESHWAR SINGH', '20040', 'ADCA', '2024-02-15', 500, 425, 85.00, 'A', 'pass'),
('STU002', 'CHOTE LAL KUMAR', '20043', 'DCA', '2024-02-15', 400, 320, 80.00, 'A', 'pass'),
('STU003', 'RAJESH KUMAR', '20045', 'PGDCA', '2024-02-16', 600, 480, 80.00, 'A', 'pass'),
('STU004', 'PRIYA SHARMA', '20046', 'DCA', '2024-02-17', 400, 340, 85.00, 'A', 'pass'),
('STU005', 'AMIT VERMA', '20047', 'ADCA', '2024-02-17', 500, 400, 80.00, 'A', 'pass');

-- News
INSERT INTO public.news (news_id, news_title, news_description, news_date, photo) VALUES 
(1, 'New Batch Admission Open', 'Admissions are now open for DCA, ADCA, and PGDCA courses. Limited seats available. Apply now!', '2024-03-15', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
(2, 'Annual Technical Fest 2024', 'Join us for our annual technical festival featuring programming competitions, workshops, and industry expert sessions.', '2024-03-10', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
(3, 'Placement Drive Success', '95% of our students got placed in reputed companies. Special thanks to our training faculty and industry partners.', '2024-03-05', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png');

-- Photo Gallery
INSERT INTO public.photo_gallery (title, image_url) VALUES 
('Computer Lab', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Classroom Sessions', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Annual Function 2024', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Student Projects Exhibition', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Placement Ceremony', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png');

-- Director Messages
INSERT INTO public.director_messages (message, photo) VALUES 
('Welcome to B. Soft Computer Institute. We are committed to providing quality technical education and empowering students with practical skills for the digital age.', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('Our mission is to bridge the gap between traditional education and industry requirements through comprehensive computer training programs.', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png');

-- Missions
INSERT INTO public.missions (content, image) VALUES 
('To provide quality technical education and training in computer applications, ensuring students are industry-ready with practical skills and knowledge.', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png'),
('To establish a network of excellence in computer education across rural and urban areas, making technology accessible to all sections of society.', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png');