-- Jogpro Affiliator System Schema
-- Run this in Supabase SQL Editor

-- affiliators table
create table if not exists affiliators (
  id uuid default gen_random_uuid() primary key,
  username text unique,
  password_hash text,
  full_name text not null,
  whatsapp text not null,
  city text not null,
  tiktok_username text not null,
  tiktok_followers integer not null,
  tiktok_url text,
  instagram_url text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  notes text,
  created_at timestamptz default now()
);

-- affiliator_samples table
create table if not exists affiliator_samples (
  id uuid default gen_random_uuid() primary key,
  affiliator_id uuid references affiliators(id) on delete cascade,
  product_name text not null,
  status text default 'requested' check (status in ('requested','packed','shipped','delivered')),
  resi text,
  created_at timestamptz default now()
);

-- affiliator_claims table
create table if not exists affiliator_claims (
  id uuid default gen_random_uuid() primary key,
  affiliator_id uuid references affiliators(id) on delete cascade,
  video_url text not null,
  screenshot_url text,
  views_count integer not null,
  status text default 'pending' check (status in ('pending','approved','rejected','paid')),
  commission_amount integer,
  created_at timestamptz default now(),
  reviewed_at timestamptz
);

-- Disable RLS for now (enable later with proper policies)
alter table affiliators disable row level security;
alter table affiliator_samples disable row level security;
alter table affiliator_claims disable row level security;
