-- Add sample data for admin_profiles
INSERT INTO admin_profiles (user_id, full_name, email, phone, department, designation, bio, profile_image_url, permissions, is_active) VALUES
('1ddedb89-19d1-47ba-87fa-97a7a873890f', 'Dr. Rajesh Kumar', 'rajesh.kumar@institution.edu', '+91-9876543210', 'Administration', 'Director', 'Director with 20+ years of experience in educational administration and computer science.', 'https://example.com/rajesh-kumar.jpg', '{"full_access": true, "can_approve": true, "can_delete": true}', true),
('2ddedb89-19d1-47ba-87fa-97a7a873891f', 'Prof. Sunita Sharma', 'sunita.sharma@institution.edu', '+91-9876543211', 'Academic', 'Principal', 'Principal overseeing academic programs and student affairs.', 'https://example.com/sunita-sharma.jpg', '{"academic_access": true, "can_approve": true}', true),
('3ddedb89-19d1-47ba-87fa-97a7a873892f', 'Mr. Amit Patel', 'amit.patel@institution.edu', '+91-9876543212', 'Finance', 'Finance Manager', 'Finance manager handling all financial operations and reporting.', 'https://example.com/amit-patel.jpg', '{"finance_access": true, "can_view_reports": true}', true);

-- Add sample data for visions
INSERT INTO visions (content, image) VALUES
('To become a leading educational institution that empowers students with cutting-edge technology skills and knowledge, preparing them for the digital future while maintaining the highest standards of academic excellence.', 'https://example.com/vision1.jpg'),
('Creating an inclusive learning environment where innovation meets tradition, fostering critical thinking, creativity, and ethical leadership in the field of computer science and technology.', 'https://example.com/vision2.jpg');

-- Add sample data for videos
INSERT INTO videos (title, video_url, description, category, duration, thumbnail_url, is_featured, views_count) VALUES
('Introduction to Computer Science Program', 'https://youtube.com/watch?v=demo1', 'Comprehensive overview of our computer science curriculum and opportunities.', 'Academic', '10:30', 'https://example.com/thumb1.jpg', true, 1250),
('Campus Tour - Modern Computing Labs', 'https://youtube.com/watch?v=demo2', 'Virtual tour of our state-of-the-art computer laboratories and facilities.', 'Campus', '8:45', 'https://example.com/thumb2.jpg', true, 890),
('Student Success Stories', 'https://youtube.com/watch?v=demo3', 'Hear from our alumni about their journey and career achievements.', 'Testimonials', '12:15', 'https://example.com/thumb3.jpg', false, 567),
('Programming Fundamentals Workshop', 'https://youtube.com/watch?v=demo4', 'Learn the basics of programming with our expert instructors.', 'Educational', '25:30', 'https://example.com/thumb4.jpg', false, 789),
('Industry Partnership Programs', 'https://youtube.com/watch?v=demo5', 'Overview of our collaborations with leading tech companies.', 'Corporate', '6:20', 'https://example.com/thumb5.jpg', false, 456);

-- Add more sample data for photo_gallery
INSERT INTO photo_gallery (title, image_url) VALUES
('Annual Tech Fest 2024', 'https://example.com/techfest1.jpg'),
('Graduation Ceremony 2024', 'https://example.com/graduation1.jpg'),
('Coding Competition Winners', 'https://example.com/coding1.jpg'),
('Industry Expert Seminar', 'https://example.com/seminar1.jpg'),
('New Student Orientation', 'https://example.com/orientation1.jpg'),
('Computer Lab Infrastructure', 'https://example.com/lab1.jpg'),
('Faculty Development Program', 'https://example.com/faculty1.jpg'),
('Sports Day Activities', 'https://example.com/sports1.jpg'),
('Cultural Events', 'https://example.com/cultural1.jpg'),
('Research Project Exhibition', 'https://example.com/research1.jpg');