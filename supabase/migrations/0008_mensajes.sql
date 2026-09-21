-- Mensajes del equipo a un alumno (tarjeta flotante en el dashboard) y sus respuestas
-- (bandeja del admin). RLS activo y SIN políticas: todo pasa por las routes del servidor
-- con la service role key, como aportes_marcas. Así ningún alumno puede leer mensajes
-- ajenos aunque tenga el anon key.
create table public.mensajes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  titulo      text not null check (char_length(titulo) between 1 and 120),
  cuerpo      text not null check (char_length(cuerpo) between 1 and 2000),
  created_at  timestamptz not null default now(),
  -- La primera vez que la tarjeta se le mostró.
  visto_at    timestamptz,
  -- La cerró con la X: deja de mostrarse.
  cerrado_at  timestamptz
);

create index mensajes_user_idx on public.mensajes (user_id, created_at desc);

create table public.mensajes_respuestas (
  id              uuid primary key default gen_random_uuid(),
  mensaje_id      uuid not null references public.mensajes(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  cuerpo          text not null check (char_length(cuerpo) between 1 and 2000),
  created_at      timestamptz not null default now(),
  leido_admin_at  timestamptz
);

create index mensajes_respuestas_mensaje_idx on public.mensajes_respuestas (mensaje_id, created_at);
create index mensajes_respuestas_fecha_idx on public.mensajes_respuestas (created_at desc);

alter table public.mensajes enable row level security;
alter table public.mensajes_respuestas enable row level security;
