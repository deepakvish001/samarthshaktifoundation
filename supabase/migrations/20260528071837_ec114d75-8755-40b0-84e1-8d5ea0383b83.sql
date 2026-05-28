
ALTER PUBLICATION supabase_realtime DROP TABLE public.employees;
ALTER PUBLICATION supabase_realtime DROP TABLE public.contact_us;
ALTER PUBLICATION supabase_realtime DROP TABLE public.enquiries;
ALTER PUBLICATION supabase_realtime DROP TABLE public.student_profiles;
ALTER PUBLICATION supabase_realtime DROP TABLE public.user_roles;
ALTER PUBLICATION supabase_realtime DROP TABLE public.user_stats;
ALTER PUBLICATION supabase_realtime DROP TABLE public.profiles;
ALTER PUBLICATION supabase_realtime DROP TABLE public.notifications;
ALTER PUBLICATION supabase_realtime DROP TABLE public.certificates;
ALTER PUBLICATION supabase_realtime DROP TABLE public.user_assignments;
ALTER PUBLICATION supabase_realtime DROP TABLE public.user_courses;
ALTER PUBLICATION supabase_realtime DROP TABLE public.bank_details;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
