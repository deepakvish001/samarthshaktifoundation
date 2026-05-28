-- Get the student IDs from the inserted students
DO $$
DECLARE
    rahul_id uuid;
    priya_id uuid;
    amit_id uuid;
    sunita_id uuid;
    vikash_id uuid;
BEGIN
    -- Get the student IDs
    SELECT id INTO rahul_id FROM public.student_profiles WHERE email = 'rahul.kumar.sample@bsoft.edu.in';
    SELECT id INTO priya_id FROM public.student_profiles WHERE email = 'priya.sharma.sample@bsoft.edu.in';
    SELECT id INTO amit_id FROM public.student_profiles WHERE email = 'amit.singh.sample@bsoft.edu.in';
    SELECT id INTO sunita_id FROM public.student_profiles WHERE email = 'sunita.gupta.sample@bsoft.edu.in';
    SELECT id INTO vikash_id FROM public.student_profiles WHERE email = 'vikash.yadav.sample@bsoft.edu.in';

    -- Insert marksheet data with actual student IDs
    INSERT INTO public.marksheet_management (student_id, student_name, course_name, roll_number, examination_date, total_marks, obtained_marks, percentage, grade, result_status) 
    VALUES
    (rahul_id::text, 'Rahul Kumar', 'Computer Applications', 'CA2024001', '2024-06-15', 1000, 875, 87.5, 'A+', 'pass'),
    (priya_id::text, 'Priya Sharma', 'Web Development', 'WD2024002', '2024-07-10', 800, 720, 90.0, 'A+', 'pass'),
    (amit_id::text, 'Amit Singh', 'Digital Marketing', 'DM2024003', '2024-06-20', 600, 480, 80.0, 'A', 'pass'),
    (sunita_id::text, 'Sunita Gupta', 'Data Entry Operations', 'DE2024004', '2024-07-05', 500, 425, 85.0, 'A+', 'pass'),
    (vikash_id::text, 'Vikash Yadav', 'Tally ERP 9', 'TE2024005', '2024-06-25', 400, 340, 85.0, 'A+', 'pass');
END $$;

-- Insert sample course subjects
INSERT INTO public.course_subjects (course_name, subject, theory_marks, practical_marks, semester_year, description) 
VALUES
-- Computer Applications subjects
('Computer Applications', 'Computer Fundamentals', '100', '100', '1st Year', 'Basic computer knowledge and operations'),
('Computer Applications', 'MS Office Suite', '100', '150', '1st Year', 'Word, Excel, PowerPoint applications'),
('Computer Applications', 'Internet & Email', '50', '100', '1st Year', 'Internet browsing and email management'),
('Computer Applications', 'Programming Basics', '150', '100', '2nd Year', 'Introduction to programming concepts'),
('Computer Applications', 'Database Management', '100', '150', '2nd Year', 'Database design and management'),

-- Web Development subjects
('Web Development', 'HTML & CSS', '100', '100', '1st Year', 'Web markup and styling languages'),
('Web Development', 'JavaScript', '100', '100', '1st Year', 'Client-side scripting language'),
('Web Development', 'Bootstrap Framework', '50', '100', '1st Year', 'Responsive web design framework'),
('Web Development', 'PHP Programming', '100', '100', '2nd Year', 'Server-side programming language'),
('Web Development', 'MySQL Database', '50', '100', '2nd Year', 'Database management for web applications'),

-- Digital Marketing subjects
('Digital Marketing', 'SEO Fundamentals', '100', '50', '1st Year', 'Search Engine Optimization basics'),
('Digital Marketing', 'Social Media Marketing', '100', '100', '1st Year', 'Marketing through social platforms'),
('Digital Marketing', 'Google Ads', '100', '100', '1st Year', 'Pay-per-click advertising'),

-- Data Entry Operations subjects
('Data Entry Operations', 'Typing Skills', '50', '100', '1st Year', 'Keyboard typing and speed development'),
('Data Entry Operations', 'MS Excel Advanced', '100', '150', '1st Year', 'Advanced Excel functions and formulas'),
('Data Entry Operations', 'Data Processing', '100', '100', '1st Year', 'Data cleaning and processing techniques'),

-- Tally ERP 9 subjects
('Tally ERP 9', 'Accounting Fundamentals', '100', '50', '1st Year', 'Basic accounting principles'),
('Tally ERP 9', 'Tally Installation & Setup', '50', '100', '1st Year', 'Software installation and configuration'),
('Tally ERP 9', 'Voucher Entry', '50', '100', '1st Year', 'Transaction entry in Tally');