-- Materi Kelas — NIM-only authentication
-- Password dan email TIDAK digunakan.
-- Admin cukup memasukkan daftar NIM ke tabel allowed_users.

create table public.allowed_users (
  nim text primary key,
  name text,
  role text not null default 'student'
    check (role in ('student', 'admin')),
  active boolean not null default true
);

create index if not exists allowed_users_role_idx
on public.allowed_users(role);

create index if not exists allowed_users_active_idx
on public.allowed_users(active);

insert into public.allowed_users (nim, name, role, active)
values
  ('23010002', 'Mahasiswa Test', 'student', true),
  ('23019001', 'Admin Test', 'admin', true)
on conflict (nim) do update
set
  name = excluded.name,
  role = excluded.role,
  active = excluded.active;

select nim, name, role, active
from public.allowed_users
order by role, nim;

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject text not null,
  file_name text not null,
  file_path text not null unique,
  file_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

alter table public.allowed_users enable row level security;
alter table public.materials enable row level security;

-- Aplikasi menggunakan SUPABASE_SERVICE_ROLE_KEY di server, sehingga
-- tabel di bawah sengaja tidak diberi akses publik melalui anon/authenticated.
-- Jangan tambahkan policy publik untuk tabel ini.

-- Storage: buat bucket PRIVATE bernama 'materials' di Dashboard Supabase.
-- Karena file diakses lewat server + signed URL, tidak perlu policy publik.

-- =========================
-- CONTOH DAFTAR NIM
-- =========================
-- Student:
-- insert into public.allowed_users (nim, name, role) values
-- ('23010001', 'Mahasiswa 1', 'student'),
-- ('23010002', 'Mahasiswa 2', 'student');
--
-- Admin:
-- insert into public.allowed_users (nim, name, role) values
-- ('23019901', 'Admin 1', 'admin');
--
-- Menonaktifkan akses tanpa menghapus data:
-- update public.allowed_users set active = false where nim = '23010001';
