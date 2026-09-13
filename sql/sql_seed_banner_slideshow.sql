insert into public.settings (key, value) values
  ('banner_images', '[
    "https://dtwciuhwwanwlwpydeko.supabase.co/storage/v1/object/public/product-images/e4c8ca5c-divine/0.webp",
    "https://dtwciuhwwanwlwpydeko.supabase.co/storage/v1/object/public/product-images/2ec9ac48-le-male-elixir/0.webp",
    "https://dtwciuhwwanwlwpydeko.supabase.co/storage/v1/object/public/img/card.jpg"
  ]'::jsonb),
  ('banner_autoplay', 'true'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
