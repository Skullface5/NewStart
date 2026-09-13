create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.settings enable row level security;
drop policy if exists settings_select_public on public.settings;
create policy settings_select_public on public.settings
  for select to anon, authenticated using (true);
drop policy if exists settings_admin_all on public.settings;
create policy settings_admin_all on public.settings
  for all to authenticated
  using (auth.email() = 'azmmeli146@gmail.com')
  with check (auth.email() = 'azmmeli146@gmail.com');
