-- Tabla de sesiones por dispositivo. Sirve para limitar el número de devices
-- activos por cuenta paga (3) y mostrar al usuario sus sesiones actuales.
--
-- "Activa" = revoked_at IS NULL AND last_seen > now() - interval '30 days'.

create extension if not exists "pgcrypto";

create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id uuid not null,
  user_agent text,
  ip text,
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, device_id)
);

create index if not exists user_sessions_active_idx
  on public.user_sessions (user_id, revoked_at, last_seen desc);

alter table public.user_sessions enable row level security;

drop policy if exists own_sessions_read on public.user_sessions;
create policy own_sessions_read on public.user_sessions
  for select using (auth.uid() = user_id);
