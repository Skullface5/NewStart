-- Rosa: add promo "old price" column (STE-style struck-through price)
-- Run ONCE in Supabase Dashboard -> SQL Editor (project dtwciuhwwanwlwpydeko)

alter table public.products
  add column if not exists old_price numeric null;

comment on column public.products.old_price is 'Former price for promo display; shown struck through when > price';
