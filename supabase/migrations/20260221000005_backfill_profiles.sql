-- Backfill missing profiles for existing users
-- This fixes the "violates foreign key constraint" error for users who signed up before the trigger was applied.
INSERT INTO public.profiles (id, full_name, campus_id)
SELECT 
  id, 
  raw_user_meta_data->>'full_name',
  (raw_user_meta_data->>'campus_id')::uuid
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Ensure RLS is enabled and policies are correct (Double Check)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- If not already added, ensure users can insert their own profile Fallback
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);
