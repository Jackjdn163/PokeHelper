create table if not exists public.cloud_saves (
  user_id uuid primary key references auth.users on delete cascade,
  email text,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.cloud_saves enable row level security;

drop policy if exists "cloud saves select own" on public.cloud_saves;
create policy "cloud saves select own"
on public.cloud_saves
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "cloud saves insert own" on public.cloud_saves;
create policy "cloud saves insert own"
on public.cloud_saves
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "cloud saves update own" on public.cloud_saves;
create policy "cloud saves update own"
on public.cloud_saves
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "cloud saves delete own" on public.cloud_saves;
create policy "cloud saves delete own"
on public.cloud_saves
for delete
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists cloud_saves_updated_at_idx
on public.cloud_saves using btree (updated_at desc);
