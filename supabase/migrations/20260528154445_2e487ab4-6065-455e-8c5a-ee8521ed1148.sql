CREATE OR REPLACE FUNCTION public.generate_enrollment_number(_year int)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  max_num int;
  next_num int;
  candidate text;
  exists_row boolean;
BEGIN
  SELECT COALESCE(MAX((regexp_replace(student_id, '^NC/AZM/' || _year || '/', ''))::int), 211)
    INTO max_num
  FROM public.student_profiles
  WHERE student_id ~ ('^NC/AZM/' || _year || '/[0-9]+$');

  next_num := GREATEST(max_num + 1, 212);

  LOOP
    candidate := 'NC/AZM/' || _year || '/' || next_num;
    SELECT EXISTS(SELECT 1 FROM public.student_profiles WHERE student_id = candidate) INTO exists_row;
    EXIT WHEN NOT exists_row;
    next_num := next_num + 1;
  END LOOP;

  RETURN candidate;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS student_profiles_student_id_unique
  ON public.student_profiles (student_id)
  WHERE student_id IS NOT NULL;