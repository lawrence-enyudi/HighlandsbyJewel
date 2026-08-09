-- Supabase Storage setup for project images
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

-- Create storage bucket for project images
insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- Storage policies for project-images bucket
-- Allow public read access
create policy "Allow public read on project-images"
  on storage.objects for select
  using (bucket_id = 'project-images');

-- Allow public upload
create policy "Allow public upload on project-images"
  on storage.objects for insert
  with check (bucket_id = 'project-images');

-- Allow public delete
create policy "Allow public delete on project-images"
  on storage.objects for delete
  using (bucket_id = 'project-images');

-- Allow public update
create policy "Allow public update on project-images"
  on storage.objects for update
  using (bucket_id = 'project-images');

comment on storage.buckets 'project-images' is 'Storage bucket for project map and price list images';
