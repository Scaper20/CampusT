-- 1. Add missing INSERT policy for profiles
-- This allows the server action to work if the user is somehow in session,
-- though the trigger is the preferred method for signup.
create policy "Users can insert their own profile." 
on public.profiles for insert 
with check (auth.uid() = id);

-- 2. Create Trigger to automate profile creation on auth.users insert
-- This ensures the profile is created even if email confirmation is required.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, campus_id)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'campus_id')::uuid
  );
  return new;
end;
$$;

-- Trigger execution
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Add Admin management policies for other tables
-- Profiles: admins can update any profile (e.g. to ban or verify)
create policy "Admins can update any profile." 
on public.profiles for update 
using (
    exists (select 1 from public.profiles where id = auth.uid() and system_role = 'admin')
);

-- Conversations: admins can view all
create policy "Admins can view all conversations." 
on public.conversations for select 
using (
    exists (select 1 from public.profiles where id = auth.uid() and system_role = 'admin')
);

-- Messages: admins can view all
create policy "Admins can view all messages." 
on public.messages for select 
using (
    exists (select 1 from public.profiles where id = auth.uid() and system_role = 'admin')
);
