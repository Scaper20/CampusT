-- 1. Create the storage bucket for avatars
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars', 
  'avatars', 
  true, 
  5242880, -- 5MB limit
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do nothing;

-- 2. Policy: Allow public read access to all avatars
create policy "Public Avatar Access"
on storage.objects for select
using ( bucket_id = 'avatars' );

-- 3. Policy: Allow authenticated users to upload their own avatar
-- Path structure: avatars/{user_id}/{filename}
create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

-- 4. Policy: Allow users to update/overwrite their own avatar
create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

-- 5. Policy: Allow users to delete their own avatar
create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);
