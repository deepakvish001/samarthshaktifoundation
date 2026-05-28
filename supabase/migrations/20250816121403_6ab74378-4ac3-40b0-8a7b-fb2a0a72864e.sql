-- First, let's see what the current check constraint allows
-- Then update it to allow both 'active' and 'pending' status values

-- Drop the existing check constraint
ALTER TABLE public.student_profiles DROP CONSTRAINT IF EXISTS student_profiles_status_check;

-- Add a new check constraint that allows both 'active' and 'pending' values
ALTER TABLE public.student_profiles 
ADD CONSTRAINT student_profiles_status_check 
CHECK (status IN ('active', 'pending', 'inactive', 'suspended'));

-- Update any existing records that might have NULL status to 'active'
UPDATE public.student_profiles 
SET status = 'active' 
WHERE status IS NULL;