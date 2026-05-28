-- Insert sample student admit card data
INSERT INTO public.student_admit_cards (
  student_id, student_name, mothers_name, fathers_name, course_name, 
  roll_number, exam_center_code, exam_center_address, exam_date, 
  batch, reporting_time, gate_closing_time, exam_start_time, 
  exam_duration, student_photo_url, pwd_status, status
) VALUES 
(
  'STU001', 'GUPTESHWAR SINGH', 'SHASHI PRABHA SINGH', 'RAVINDRA SINGH', 
  'ADCA', '20040', 'EC001', 'B. Soft Computer Institute, Azamgarh', 
  '2024-03-15', 'Morning', '09:00 AM', '09:30 AM', '10:00 AM', 
  '2 Hours', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
),
(
  'STU002', 'CHOTE LAL KUMAR', 'DHARMI DEVI', 'VIJAY PRASAD', 
  'DCA', '20043', 'EC002', 'Jiyanpur Center', 
  '2024-03-15', 'Morning', '10:00 AM', '10:30 AM', '11:00 AM', 
  '90 Minutes', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
),
(
  'STU003', 'RAJESH KUMAR', 'SUNITA DEVI', 'RAM PRASAD', 
  'PGDCA', '20045', 'EC003', 'Main Center, Azamgarh', 
  '2024-03-16', 'Evening', '02:00 PM', '02:30 PM', '03:00 PM', 
  '3 Hours', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
),
(
  'STU004', 'PRIYA SHARMA', 'SUNITA SHARMA', 'RAKESH SHARMA', 
  'DCA', '20046', 'EC001', 'B. Soft Computer Institute, Azamgarh', 
  '2024-03-17', 'Morning', '09:00 AM', '09:30 AM', '10:00 AM', 
  '2 Hours', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
),
(
  'STU005', 'AMIT VERMA', 'GEETA VERMA', 'SURESH VERMA', 
  'ADCA', '20047', 'EC002', 'Jiyanpur Center', 
  '2024-03-17', 'Evening', '02:00 PM', '02:30 PM', '03:00 PM', 
  '2.5 Hours', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
),
(
  'STU006', 'NEHA SINGH', 'RITA SINGH', 'MANOJ SINGH', 
  'PGDCA', '20048', 'EC003', 'Main Center, Azamgarh', 
  '2024-03-18', 'Morning', '09:00 AM', '09:30 AM', '10:00 AM', 
  '3 Hours', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
),
(
  'STU007', 'ROHIT KUMAR', 'KAMALA DEVI', 'SHYAM LAL', 
  'DCA', '20049', 'EC001', 'B. Soft Computer Institute, Azamgarh', 
  '2024-03-18', 'Evening', '02:00 PM', '02:30 PM', '03:00 PM', 
  '90 Minutes', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
),
(
  'STU008', 'POOJA GUPTA', 'VANDANA GUPTA', 'RAVI GUPTA', 
  'ADCA', '20050', 'EC002', 'Jiyanpur Center', 
  '2024-03-19', 'Morning', '09:00 AM', '09:30 AM', '10:00 AM', 
  '2 Hours', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
),
(
  'STU009', 'VIKASH YADAV', 'SITA YADAV', 'RAMESH YADAV', 
  'PGDCA', '20051', 'EC003', 'Main Center, Azamgarh', 
  '2024-03-19', 'Evening', '02:00 PM', '02:30 PM', '03:00 PM', 
  '3 Hours', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
),
(
  'STU010', 'ANITA MISHRA', 'LATA MISHRA', 'DINESH MISHRA', 
  'DCA', '20052', 'EC001', 'B. Soft Computer Institute, Azamgarh', 
  '2024-03-20', 'Morning', '09:00 AM', '09:30 AM', '10:00 AM', 
  '90 Minutes', '/lovable-uploads/393bdd79-f1d0-430f-8c0d-c10eb0d72005.png', 
  'No', 'active'
);