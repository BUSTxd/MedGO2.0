-- Endurecimiento de permisos (auditoría de seguridad 2026-09-24).
--
-- Hasta ahora sólo RLS separaba al navegador de las tablas: `anon` y
-- `authenticated` conservaban INSERT/UPDATE/DELETE/TRUNCATE sobre todo. Bastaba
-- con que alguien añadiera una política UPDATE (p. ej. para editar el nombre)
-- para que un alumno pudiera borrar su perfil y reinsertarlo con plan de pago,
-- o tocar su racha. Toda escritura de la app pasa por el service role en rutas
-- de servidor; el navegador sólo LEE su propio perfil y su suscripción.

-- 1. profiles / subscriptions: el navegador sólo lee.
revoke insert, update, delete, truncate, references, trigger
  on public.profiles, public.subscriptions
  from anon, authenticated;

-- La política de lectura existía en la base pero no en el repo (la 0003 decía
-- «ALL» en un comentario). Se versiona tal cual está en producción.
do $$
begin
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'profiles'
                   and policyname = 'leer perfil propio') then
    create policy "leer perfil propio" on public.profiles
      for select using ((select auth.uid()) = id);
  end if;
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'subscriptions'
                   and policyname = 'subs_select_own') then
    create policy subs_select_own on public.subscriptions
      for select using (auth.uid() = user_id);
  end if;
end $$;

-- 2. Tablas que sólo usa el servidor (service role): sin políticas ya eran
--    inaccesibles por RLS; sin privilegios lo son aunque alguien añada una.
revoke all on
  public.analytics_events,
  public.mensajes,
  public.mensajes_respuestas,
  public.pregunta_valoraciones,
  public.aportes_marcas
  from anon, authenticated;

-- 3. Esquema antiguo de «contenido de pago» (0 filas, sin uso en el código).
--    Sus políticas miraban `plan IN ('interno','residente')` sin comprobar
--    `plan_expires_at`. No se borran (irreversible): se cierran.
revoke all on
  public.courses,
  public.topics,
  public.questions,
  public.options,
  public.summaries,
  public.summary_images,
  public.user_topic_progress
  from anon, authenticated;

-- 4. Avisos del advisor de Supabase.
--    handle_new_user es SECURITY DEFINER y sólo la usa el trigger de alta.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
--    search_path fijo: sin él, una función podría resolver objetos de otro esquema.
alter function public.set_updated_at() set search_path = '';
