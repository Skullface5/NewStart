-- Rosa: fix "new row violates row-level security policy" on banner image uploads
-- Run ONCE in Supabase Dashboard → SQL Editor (project dtwciuhwwanwlwpydeko)

-- 0) (optional) inspect what blocks today — copy the output to chat if the fix below doesn't work:
-- select s.schemaname, s.tablename, s.policyname, s.permissive, s.cmds, s.roles, s.qual, s.with_check
-- from pg_policies s where s.schemaname = 'storage';

-- 1) allow the admin account to read/write everything in BOTH public buckets
drop policy if exists "rosa admin all product images" on storage.objects;
create policy "rosa admin all product images"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'product-images' AND (auth.jwt() ->> 'email')::text = 'azmmeli146@gmail.com')
  with check (bucket_id = 'product-images' AND (auth.jwt() ->> 'email')::text = 'azmmeli146@gmail.com');

drop policy if exists "rosa admin all img" on storage.objects;
create policy "rosa admin all img"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'img' AND (auth.jwt() ->> 'email')::text = 'azmmeli146@gmail.com')
  with check (bucket_id = 'img' AND (auth.jwt() ->> 'email')::text = 'azmmeli146@gmail.com');
