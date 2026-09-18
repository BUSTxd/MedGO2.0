-- Por alumno y curso: en cuántos días distintos entró, cuántos eventos y cuándo fue la última vez.
-- Sale de analytics_events (la ruta /dashboard/cursos/<slug>/...), sin tabla propia.
create or replace function public.resumen_cursos_usuarios()
returns table (user_id uuid, curso text, dias bigint, eventos bigint, ultimo timestamptz)
language sql
stable
set search_path = public
as $$
  select e.user_id,
         split_part(e.path, '/', 4) as curso,
         count(distinct (e.created_at at time zone 'America/Lima')::date) as dias,
         count(*) as eventos,
         max(e.created_at) as ultimo
  from public.analytics_events e
  where e.user_id is not null
    and e.path like '/dashboard/cursos/_%'
  group by 1, 2;
$$;

revoke execute on function public.resumen_cursos_usuarios() from public, anon, authenticated;
