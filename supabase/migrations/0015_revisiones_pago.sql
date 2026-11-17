-- Límite del botón «Ya pagué, revisar» (api/subscriptions/revisar).
--
-- Vive en la base, no en la memoria del servidor: con varias instancias de
-- Vercel un límite en memoria se multiplica por el número de instancias.
-- RLS sin políticas a propósito: solo el service role la toca, y la función
-- solo la puede ejecutar el service role. Un alumno no puede borrar su marca
-- para saltarse el límite.

create table if not exists public.revisiones_pago (
  user_id uuid primary key references auth.users (id) on delete cascade,
  at timestamptz not null default now()
);

alter table public.revisiones_pago enable row level security;
revoke all on public.revisiones_pago from anon, authenticated;

-- true si se concede la revisión (y deja la marca); false si la última fue
-- hace menos de p_segundos. Atómica: dos peticiones a la vez no pasan las dos.
create or replace function public.reclamar_revision_pago(p_user uuid, p_segundos integer)
returns boolean
language sql
security definer
set search_path = public
as $$
  with r as (
    insert into public.revisiones_pago as rp (user_id, at)
    values (p_user, now())
    on conflict (user_id) do update set at = now()
      where rp.at < now() - make_interval(secs => greatest(p_segundos, 1))
    returning 1
  )
  select exists (select 1 from r);
$$;

revoke execute on function public.reclamar_revision_pago(uuid, integer) from public, anon, authenticated;
grant execute on function public.reclamar_revision_pago(uuid, integer) to service_role;
