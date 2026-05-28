ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE;