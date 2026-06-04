
DROP VIEW IF EXISTS public.alot_numbers_public;

CREATE VIEW public.alot_numbers_public
WITH (security_invoker = on) AS
SELECT
  id,
  student_id,
  course_name,
  course_examination_date,
  theory_max_marks,
  practical_max_marks,
  obtain_theory_marks,
  obtain_practical_marks,
  subjects,
  place,
  issue_date,
  center_code,
  center_name,
  student_photo_url,
  director_signature_url,
  created_at
FROM public.alot_numbers;

GRANT SELECT ON public.alot_numbers_public TO anon, authenticated;
