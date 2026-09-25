-- profiles: el usuario solo LEE su fila. Antes la política «own profile» era
-- FOR ALL, y aunque el trigger profiles_protect_plan_columns frena un UPDATE del
-- plan, no corre en INSERT: bastaba borrar la fila propia y reinsertarla con
-- plan de pago. Toda escritura va por el servidor con service role (webhook MP,
-- subscriptions/create, streak/ping, esfuerzo/invocar) y el alta por el trigger
-- handle_new_user (security definer), así que ninguna necesita esta política.
drop policy if exists "own profile" on public.profiles;
create policy "leer perfil propio" on public.profiles
  for select using ((select auth.uid()) = id);
