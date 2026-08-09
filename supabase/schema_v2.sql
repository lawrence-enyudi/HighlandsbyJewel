-- Updated Schema v2: Relational tables instead of JSON blobs
-- This resolves photo reversion issues and provides proper data structure

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Projects table - main project information
create table if not exists public.projects_v2 (
  id text primary key,
  name text not null,
  district text not null,
  category text not null check (category in ('Lot', 'Condo', 'Townhouse')),
  status text not null default 'Active' check (status in ('Active', 'Pre-Selling', 'Sold Out', 'Archived')),
  price_range text,
  lot_sizes text,
  notes text,
  sort_order integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Project images table - for map and price list images
create table if not exists public.project_images (
  id text primary key,
  project_id text not null references public.projects_v2(id) on delete cascade,
  image_type text not null check (image_type in ('map', 'price_list')),
  image_url text not null,
  storage_path text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- Payment terms table - for payment schemes
create table if not exists public.payment_terms (
  id text primary key,
  project_id text not null references public.projects_v2(id) on delete cascade,
  label text not null,
  is_preset boolean default false,
  term_discount_percent numeric default 0,
  extra_discount_percent numeric default 0,
  other_charges_percent numeric default 0,
  spot_percent numeric default 0,
  dp_spread_percent numeric,
  dp_spread_months integer,
  balance_type text not null check (balance_type in ('monthly', 'lumpsum', 'turnover', 'lumpsum_or_turnover')),
  balance_months integer default 0,
  interest_rate numeric default 0,
  reservation_fee numeric default 0,
  notes text,
  conditions text,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Inventory table - for lot/unit inventory
create table if not exists public.inventory (
  id text primary key,
  project_id text not null references public.projects_v2(id) on delete cascade,
  kind text not null check (kind in ('lot', 'unit')),
  block text,
  lot text,
  unit_number text,
  area text not null,
  status text not null default 'Available' check (status in ('Available', 'Reserved', 'Hold', 'Sold', 'Not for Sale')),
  tcp numeric not null default 0,
  remarks text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for better performance
create index if not exists projects_v2_sort_order_idx on public.projects_v2 (sort_order);
create index if not exists projects_v2_district_idx on public.projects_v2 (district);
create index if not exists projects_v2_status_idx on public.projects_v2 (status);
create index if not exists project_images_project_id_idx on public.project_images (project_id);
create index if not exists project_images_type_idx on public.project_images (image_type);
create index if not exists payment_terms_project_id_idx on public.payment_terms (project_id);
create index if not exists inventory_project_id_idx on public.inventory (project_id);
create index if not exists inventory_status_idx on public.inventory (status);

-- Enable Row Level Security
alter table public.projects_v2 enable row level security;
alter table public.project_images enable row level security;
alter table public.payment_terms enable row level security;
alter table public.inventory enable row level security;

-- RLS Policies for projects_v2
create policy "Allow public read on projects_v2"
  on public.projects_v2 for select
  using (true);

create policy "Allow public insert on projects_v2"
  on public.projects_v2 for insert
  with check (true);

create policy "Allow public update on projects_v2"
  on public.projects_v2 for update
  using (true);

create policy "Allow public delete on projects_v2"
  on public.projects_v2 for delete
  using (true);

-- RLS Policies for project_images
create policy "Allow public read on project_images"
  on public.project_images for select
  using (true);

create policy "Allow public insert on project_images"
  on public.project_images for insert
  with check (true);

create policy "Allow public update on project_images"
  on public.project_images for update
  using (true);

create policy "Allow public delete on project_images"
  on public.project_images for delete
  using (true);

-- RLS Policies for payment_terms
create policy "Allow public read on payment_terms"
  on public.payment_terms for select
  using (true);

create policy "Allow public insert on payment_terms"
  on public.payment_terms for insert
  with check (true);

create policy "Allow public update on payment_terms"
  on public.payment_terms for update
  using (true);

create policy "Allow public delete on payment_terms"
  on public.payment_terms for delete
  using (true);

-- RLS Policies for inventory
create policy "Allow public read on inventory"
  on public.inventory for select
  using (true);

create policy "Allow public insert on inventory"
  on public.inventory for insert
  with check (true);

create policy "Allow public update on inventory"
  on public.inventory for update
  using (true);

create policy "Allow public delete on inventory"
  on public.inventory for delete
  using (true);

-- Enable realtime for live sync
alter publication supabase_realtime add table public.projects_v2;
alter publication supabase_realtime add table public.project_images;
alter publication supabase_realtime add table public.payment_terms;
alter publication supabase_realtime add table public.inventory;

-- Add comments
comment on table public.projects_v2 is 'Main projects table with proper relational structure';
comment on table public.project_images is 'Project images stored in Supabase Storage with URLs';
comment on table public.payment_terms is 'Payment schemes and terms for each project';
comment on table public.inventory is 'Lot/unit inventory for each project';
