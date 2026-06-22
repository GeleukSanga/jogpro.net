-- Supabase schema untuk gadai HP - Jogpro Finance
-- Run di Supabase Dashboard > SQL Editor jika tabel belum ada

create table if not exists gadai_applications (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  nomor_wa text not null,
  jenis_hp text not null,
  kondisi text not null,
  harga_pasar integer not null,
  nominal_pinjaman integer not null,
  foto_selfie_url text,
  foto_depan_url text,
  foto_belakang_url text,
  klausul_disetujui boolean default false,
  status text default 'pending',
  created_at timestamptz default now()
);

-- RLS: anyone can insert, anyone can read (filtered by API as needed)
alter table gadai_applications enable row level security;

create policy "public insert" on gadai_applications
  for insert with check (true);

create policy "public read own" on gadai_applications
  for select using (true);

-- Storage bucket (buat via Supabase Dashboard > Storage jika belum ada)
-- Bucket name: gadai-docs
-- Public: true
