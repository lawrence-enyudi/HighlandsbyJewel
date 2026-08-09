-- Projects table for Seller's Portal: project files, inventory, and payment schemes
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

create table if not exists public.projects (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  sort_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists projects_sort_order_idx on public.projects (sort_order);
create index if not exists projects_updated_at_idx on public.projects (updated_at desc);

alter table public.projects enable row level security;

-- Allow anonymous read/write (matches existing site tables pattern for this app)
create policy "Allow public read on projects"
  on public.projects for select
  using (true);

create policy "Allow public insert on projects"
  on public.projects for insert
  with check (true);

create policy "Allow public update on projects"
  on public.projects for update
  using (true);

create policy "Allow public delete on projects"
  on public.projects for delete
  using (true);

-- Optional: enable realtime for live sync across devices
alter publication supabase_realtime add table public.projects;

comment on table public.projects is
  'Seller portal projects — each row stores a ProjectFile JSON blob (maps, inventory, payment schemes).';
