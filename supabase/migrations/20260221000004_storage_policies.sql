-- 1. Create the storage bucket for product images
insert into storage.buckets (id, name, public)
values ('campus-trade', 'campus-trade', true)
on conflict (id) do nothing;

-- 2. Policy: Allow public read access to all objects in the campus-trade bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'campus-trade' );

-- 3. Policy: Allow authenticated students to upload images to their own folder
-- Path structure: product-images/{user_id}/{product_id}/{filename}
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'campus-trade' AND
  (auth.uid())::text = (storage.foldername(name))[2]
);

-- 4. Policy: Allow students to delete their own images
create policy "Users can delete their own images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'campus-trade' AND
  (auth.uid())::text = (storage.foldername(name))[2]
);
