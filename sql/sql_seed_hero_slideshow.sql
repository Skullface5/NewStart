insert into public.settings (key, value) values
  ('hero_images', '[
    "https://dtwciuhwwanwlwpydeko.supabase.co/storage/v1/object/public/img/card.jpg",
    "https://dtwciuhwwanwlwpydeko.supabase.co/storage/v1/object/public/img/women.jfif",
    "https://dtwciuhwwanwlwpydeko.supabase.co/storage/v1/object/public/img/man.jfif",
    "https://dtwciuhwwanwlwpydeko.supabase.co/storage/v1/object/public/img/unisexe.jfif",
    "https://dtwciuhwwanwlwpydeko.supabase.co/storage/v1/object/public/img/kids.jfif"
  ]'::jsonb),
  ('hero_autoplay', 'true'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
