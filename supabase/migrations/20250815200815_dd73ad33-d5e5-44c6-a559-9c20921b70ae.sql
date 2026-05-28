-- Insert sample student profiles (with unique emails)
INSERT INTO public.student_profiles (id, full_name, email, phone, course_name, status, city, state, enrollment_date) 
SELECT * FROM (VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Rahul Kumar', 'rahul.kumar.sample@bsoft.edu.in', '9876543210', 'Computer Applications', 'active', 'Mumbai', 'Maharashtra', '2024-01-15'),
('550e8400-e29b-41d4-a716-446655440002', 'Priya Sharma', 'priya.sharma.sample@bsoft.edu.in', '9876543211', 'Web Development', 'active', 'Delhi', 'Delhi', '2024-02-10'),
('550e8400-e29b-41d4-a716-446655440003', 'Amit Singh', 'amit.singh.sample@bsoft.edu.in', '9876543212', 'Digital Marketing', 'active', 'Bangalore', 'Karnataka', '2024-01-20'),
('550e8400-e29b-41d4-a716-446655440004', 'Sunita Gupta', 'sunita.gupta.sample@bsoft.edu.in', '9876543213', 'Data Entry Operations', 'active', 'Pune', 'Maharashtra', '2024-03-05'),
('550e8400-e29b-41d4-a716-446655440005', 'Vikash Yadav', 'vikash.yadav.sample@bsoft.edu.in', '9876543214', 'Tally ERP 9', 'active', 'Lucknow', 'Uttar Pradesh', '2024-02-15')
) AS v(id, full_name, email, phone, course_name, status, city, state, enrollment_date)
WHERE NOT EXISTS (SELECT 1 FROM public.student_profiles WHERE email = v.email);

-- Insert sample marksheet data
INSERT INTO public.marksheet_management (id, student_id, student_name, course_name, roll_number, examination_date, total_marks, obtained_marks, percentage, grade, result_status) 
SELECT * FROM (VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Rahul Kumar', 'Computer Applications', 'CA2024001', '2024-06-15', 1000, 875, 87.5, 'A+', 'pass'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Priya Sharma', 'Web Development', 'WD2024002', '2024-07-10', 800, 720, 90.0, 'A+', 'pass'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Amit Singh', 'Digital Marketing', 'DM2024003', '2024-06-20', 600, 480, 80.0, 'A', 'pass'),
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'Sunita Gupta', 'Data Entry Operations', 'DE2024004', '2024-07-05', 500, 425, 85.0, 'A+', 'pass'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'Vikash Yadav', 'Tally ERP 9', 'TE2024005', '2024-06-25', 400, 340, 85.0, 'A+', 'pass')
) AS v(id, student_id, student_name, course_name, roll_number, examination_date, total_marks, obtained_marks, percentage, grade, result_status)
WHERE NOT EXISTS (SELECT 1 FROM public.marksheet_management WHERE student_id = v.student_id);

-- Insert sample course subjects for Computer Applications
INSERT INTO public.course_subjects (id, course_name, subject, theory_marks, practical_marks, semester_year, description) 
SELECT * FROM (VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Computer Applications', 'Computer Fundamentals', '100', '100', '1st Year', 'Basic computer knowledge and operations'),
('750e8400-e29b-41d4-a716-446655440002', 'Computer Applications', 'MS Office Suite', '100', '150', '1st Year', 'Word, Excel, PowerPoint applications'),
('750e8400-e29b-41d4-a716-446655440003', 'Computer Applications', 'Internet & Email', '50', '100', '1st Year', 'Internet browsing and email management'),
('750e8400-e29b-41d4-a716-446655440004', 'Computer Applications', 'Programming Basics', '150', '100', '2nd Year', 'Introduction to programming concepts'),
('750e8400-e29b-41d4-a716-446655440005', 'Computer Applications', 'Database Management', '100', '150', '2nd Year', 'Database design and management')
) AS v(id, course_name, subject, theory_marks, practical_marks, semester_year, description)
WHERE NOT EXISTS (SELECT 1 FROM public.course_subjects WHERE course_name = v.course_name AND subject = v.subject);

-- Insert sample course subjects for Web Development
INSERT INTO public.course_subjects (id, course_name, subject, theory_marks, practical_marks, semester_year, description) 
SELECT * FROM (VALUES
('750e8400-e29b-41d4-a716-446655440006', 'Web Development', 'HTML & CSS', '100', '100', '1st Year', 'Web markup and styling languages'),
('750e8400-e29b-41d4-a716-446655440007', 'Web Development', 'JavaScript', '100', '100', '1st Year', 'Client-side scripting language'),
('750e8400-e29b-41d4-a716-446655440008', 'Web Development', 'Bootstrap Framework', '50', '100', '1st Year', 'Responsive web design framework'),
('750e8400-e29b-41d4-a716-446655440009', 'Web Development', 'PHP Programming', '100', '100', '2nd Year', 'Server-side programming language'),
('750e8400-e29b-41d4-a716-446655440010', 'Web Development', 'MySQL Database', '50', '100', '2nd Year', 'Database management for web applications')
) AS v(id, course_name, subject, theory_marks, practical_marks, semester_year, description)
WHERE NOT EXISTS (SELECT 1 FROM public.course_subjects WHERE course_name = v.course_name AND subject = v.subject);

-- Insert other course subjects
INSERT INTO public.course_subjects (id, course_name, subject, theory_marks, practical_marks, semester_year, description) 
SELECT * FROM (VALUES
('750e8400-e29b-41d4-a716-446655440011', 'Digital Marketing', 'SEO Fundamentals', '100', '50', '1st Year', 'Search Engine Optimization basics'),
('750e8400-e29b-41d4-a716-446655440012', 'Digital Marketing', 'Social Media Marketing', '100', '100', '1st Year', 'Marketing through social platforms'),
('750e8400-e29b-41d4-a716-446655440013', 'Digital Marketing', 'Google Ads', '100', '100', '1st Year', 'Pay-per-click advertising'),
('750e8400-e29b-41d4-a716-446655440016', 'Data Entry Operations', 'Typing Skills', '50', '100', '1st Year', 'Keyboard typing and speed development'),
('750e8400-e29b-41d4-a716-446655440017', 'Data Entry Operations', 'MS Excel Advanced', '100', '150', '1st Year', 'Advanced Excel functions and formulas'),
('750e8400-e29b-41d4-a716-446655440018', 'Data Entry Operations', 'Data Processing', '100', '100', '1st Year', 'Data cleaning and processing techniques'),
('750e8400-e29b-41d4-a716-446655440021', 'Tally ERP 9', 'Accounting Fundamentals', '100', '50', '1st Year', 'Basic accounting principles'),
('750e8400-e29b-41d4-a716-446655440022', 'Tally ERP 9', 'Tally Installation & Setup', '50', '100', '1st Year', 'Software installation and configuration'),
('750e8400-e29b-41d4-a716-446655440023', 'Tally ERP 9', 'Voucher Entry', '50', '100', '1st Year', 'Transaction entry in Tally')
) AS v(id, course_name, subject, theory_marks, practical_marks, semester_year, description)
WHERE NOT EXISTS (SELECT 1 FROM public.course_subjects WHERE course_name = v.course_name AND subject = v.subject);