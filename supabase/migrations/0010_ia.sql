-- MedGO IA: créditos, libro contable, conversaciones y caché de respuestas.
--
-- Todo lo usa sólo el servidor (service role) desde `src/lib/ia/`. RLS activo
-- y SIN políticas, y además sin privilegios para anon/authenticated (como la
-- 0009): aunque alguien añadiera una política, el navegador no podría ni leer
-- su saldo ni escribirlo. El saldo se mueve únicamente con las tres funciones
-- de abajo, que sólo puede ejecutar service_role.

-- 1. Saldo por usuario: dos bolsas.
--    plan_creditos     → cuota del ciclo; se REPONE (no se acumula) al vencer.
--    recarga_creditos  → comprada; no caduca. Se gasta después de la del plan.
create table if not exists public.ia_saldos (
  user_id          uuid primary key references auth.users(id) on delete cascade,
  plan_creditos    bigint not null default 0 check (plan_creditos >= 0),
  recarga_creditos bigint not null default 0 check (recarga_creditos >= 0),
  ciclo_inicio     timestamptz,
  -- Reserva abierta: una sola petición en curso por usuario.
  en_curso         uuid,
  en_curso_hasta   timestamptz,
  updated_at       timestamptz not null default now()
);

-- 2. Libro contable. `creditos` con signo (+ abono / devolución, − gasto).
--    Una petición deja dos filas: la 'reserva' (−máximo posible) y su
--    'liquidacion' (+lo que sobró), con el costo real y los tokens.
create table if not exists public.ia_movimientos (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  tipo             text not null check (tipo in ('cuota', 'recarga', 'reserva', 'liquidacion', 'ajuste')),
  creditos         bigint not null,
  de_plan          bigint not null default 0,
  de_recarga       bigint not null default 0,
  cobrado          bigint,
  costo_usd        numeric(12, 6) not null default 0,
  accion           text,
  clase_id         text,
  tokens_in        integer,
  tokens_out       integer,
  tokens_cache_r   integer,
  tokens_cache_w   integer,
  reserva_id       uuid,
  -- Idempotencia de abonos (p. ej. id del pago de Mercado Pago, que reenvía).
  clave            text unique,
  created_at       timestamptz not null default now()
);
create index if not exists ia_movimientos_user_fecha on public.ia_movimientos (user_id, created_at desc);
create index if not exists ia_movimientos_fecha on public.ia_movimientos (created_at);
create unique index if not exists ia_movimientos_una_liquidacion
  on public.ia_movimientos (reserva_id) where tipo = 'liquidacion';

-- 3. Conversaciones: el historial vive aquí, no en el cliente (que sólo manda
--    el id y el texto nuevo, así no puede inyectar un historial gigante).
create table if not exists public.ia_conversaciones (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  clase_id    text,
  created_at  timestamptz not null default now()
);
create index if not exists ia_conversaciones_user on public.ia_conversaciones (user_id, created_at desc);

create table if not exists public.ia_mensajes (
  id               bigserial primary key,
  conversacion_id  uuid not null references public.ia_conversaciones(id) on delete cascade,
  rol              text not null check (rol in ('user', 'assistant')),
  contenido        text not null,
  created_at       timestamptz not null default now()
);
create index if not exists ia_mensajes_conv on public.ia_mensajes (conversacion_id, id);

-- 4. Respuestas que se repiten entre alumnos («resumir todo», «¿qué significa X?»).
--    `creditos` = lo que costó la primera vez: el siguiente alumno paga lo
--    mismo (precio estable) y la app no gasta nada.
create table if not exists public.ia_respuestas_cache (
  clave       text primary key,
  respuesta   text not null,
  creditos    bigint not null default 0,
  usos        integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.ia_saldos            enable row level security;
alter table public.ia_movimientos       enable row level security;
alter table public.ia_conversaciones    enable row level security;
alter table public.ia_mensajes          enable row level security;
alter table public.ia_respuestas_cache  enable row level security;

revoke all on
  public.ia_saldos,
  public.ia_movimientos,
  public.ia_conversaciones,
  public.ia_mensajes,
  public.ia_respuestas_cache
  from anon, authenticated;
revoke all on sequence public.ia_mensajes_id_seq from anon, authenticated;

-- 5. Reservar antes de llamar al modelo.
--    Bloquea la fila del saldo (FOR UPDATE): veinte pestañas en paralelo hacen
--    cola aquí y ninguna puede gastar lo que otra ya reservó. Repone la cuota
--    si el ciclo venció, aplica ritmo, una sola petición en curso y el tope
--    global del día, y descuenta el MÁXIMO posible (plan primero).
create or replace function public.ia_reservar(
  p_user        uuid,
  p_creditos    bigint,
  p_cuota       bigint,
  p_ciclo_dias  integer,
  p_max_minuto  integer,
  p_max_dia     integer,
  p_tope_usd    numeric,
  p_accion      text,
  p_clase       text,
  p_ttl_seg     integer default 120
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  s          public.ia_saldos%rowtype;
  v_reserva  uuid := gen_random_uuid();
  v_plan     bigint;
  v_recarga  bigint;
  v_n        integer;
  v_gasto    numeric;
begin
  if p_creditos <= 0 then
    return jsonb_build_object('ok', false, 'motivo', 'invalido');
  end if;

  -- Freno global: gasto real de hoy de toda la app.
  select coalesce(sum(costo_usd), 0) into v_gasto
    from public.ia_movimientos
   where tipo = 'liquidacion' and created_at >= date_trunc('day', now());
  if v_gasto >= p_tope_usd then
    return jsonb_build_object('ok', false, 'motivo', 'tope_global');
  end if;

  insert into public.ia_saldos (user_id) values (p_user) on conflict (user_id) do nothing;
  select * into s from public.ia_saldos where user_id = p_user for update;

  -- Cuota del ciclo: se repone (no se suma) al empezar uno nuevo.
  if s.ciclo_inicio is null or s.ciclo_inicio + make_interval(days => p_ciclo_dias) <= now() then
    update public.ia_saldos
       set plan_creditos = p_cuota, ciclo_inicio = now(), updated_at = now()
     where user_id = p_user;
    insert into public.ia_movimientos (user_id, tipo, creditos, de_plan)
         values (p_user, 'cuota', p_cuota, p_cuota);
    s.plan_creditos := p_cuota;
  end if;

  if s.en_curso is not null and s.en_curso_hasta > now() then
    return jsonb_build_object('ok', false, 'motivo', 'ocupado');
  end if;

  select count(*) into v_n from public.ia_movimientos
   where user_id = p_user and tipo = 'reserva' and created_at > now() - interval '1 minute';
  if v_n >= p_max_minuto then
    return jsonb_build_object('ok', false, 'motivo', 'ritmo');
  end if;

  select count(*) into v_n from public.ia_movimientos
   where user_id = p_user and tipo = 'reserva' and created_at > now() - interval '1 day';
  if v_n >= p_max_dia then
    return jsonb_build_object('ok', false, 'motivo', 'ritmo_dia');
  end if;

  if s.plan_creditos + s.recarga_creditos < p_creditos then
    return jsonb_build_object('ok', false, 'motivo', 'saldo',
      'plan', s.plan_creditos, 'recarga', s.recarga_creditos);
  end if;

  v_plan    := least(s.plan_creditos, p_creditos);
  v_recarga := p_creditos - v_plan;

  update public.ia_saldos
     set plan_creditos    = plan_creditos - v_plan,
         recarga_creditos = recarga_creditos - v_recarga,
         en_curso         = v_reserva,
         en_curso_hasta   = now() + make_interval(secs => p_ttl_seg),
         updated_at       = now()
   where user_id = p_user;

  insert into public.ia_movimientos (user_id, tipo, creditos, de_plan, de_recarga, accion, clase_id, reserva_id)
       values (p_user, 'reserva', -p_creditos, v_plan, v_recarga, p_accion, p_clase, v_reserva);

  return jsonb_build_object('ok', true, 'reserva', v_reserva,
    'plan', s.plan_creditos - v_plan, 'recarga', s.recarga_creditos - v_recarga);
end $$;

-- 6. Liquidar: cobrar lo real (nunca más que lo reservado) y devolver el resto.
--    Idempotente: una segunda llamada con la misma reserva no hace nada.
create or replace function public.ia_liquidar(
  p_reserva    uuid,
  p_cobrado    bigint,
  p_costo_usd  numeric,
  p_tokens_in  integer,
  p_tokens_out integer,
  p_cache_r    integer,
  p_cache_w    integer
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  r          public.ia_movimientos%rowtype;
  v_cobrado  bigint;
  v_devolver bigint;
  v_a_rec    bigint;
  v_a_plan   bigint;
begin
  select * into r from public.ia_movimientos where reserva_id = p_reserva and tipo = 'reserva';
  if not found then
    return jsonb_build_object('ok', false, 'motivo', 'sin_reserva');
  end if;

  perform 1 from public.ia_saldos where user_id = r.user_id for update;

  if exists (select 1 from public.ia_movimientos where reserva_id = p_reserva and tipo = 'liquidacion') then
    return jsonb_build_object('ok', true, 'repetida', true);
  end if;

  v_cobrado  := greatest(0, least(p_cobrado, -r.creditos));
  v_devolver := -r.creditos - v_cobrado;
  -- Lo que sobra vuelve primero a la recarga (lo último que se tomó).
  v_a_rec  := least(v_devolver, r.de_recarga);
  v_a_plan := v_devolver - v_a_rec;

  update public.ia_saldos
     set plan_creditos    = plan_creditos + v_a_plan,
         recarga_creditos = recarga_creditos + v_a_rec,
         en_curso         = case when en_curso = p_reserva then null else en_curso end,
         en_curso_hasta   = case when en_curso = p_reserva then null else en_curso_hasta end,
         updated_at       = now()
   where user_id = r.user_id;

  insert into public.ia_movimientos (user_id, tipo, creditos, de_plan, de_recarga, cobrado, costo_usd,
                                     accion, clase_id, tokens_in, tokens_out, tokens_cache_r, tokens_cache_w, reserva_id)
       values (r.user_id, 'liquidacion', v_devolver, v_a_plan, v_a_rec, v_cobrado, coalesce(p_costo_usd, 0),
               r.accion, r.clase_id, p_tokens_in, p_tokens_out, p_cache_r, p_cache_w, p_reserva);

  return jsonb_build_object('ok', true, 'cobrado', v_cobrado);
end $$;

-- 7. Abonar créditos de recarga (compra o ajuste del admin). Con `p_clave`,
--    el mismo pago no abona dos veces.
create or replace function public.ia_abonar(
  p_user     uuid,
  p_creditos bigint,
  p_tipo     text,
  p_clave    text default null
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_tipo not in ('recarga', 'ajuste') or p_creditos = 0 then
    return jsonb_build_object('ok', false, 'motivo', 'invalido');
  end if;

  begin
    insert into public.ia_movimientos (user_id, tipo, creditos, de_recarga, clave)
         values (p_user, p_tipo, p_creditos, p_creditos, p_clave);
  exception when unique_violation then
    return jsonb_build_object('ok', true, 'repetido', true);
  end;

  insert into public.ia_saldos (user_id) values (p_user) on conflict (user_id) do nothing;
  update public.ia_saldos
     set recarga_creditos = greatest(0, recarga_creditos + p_creditos), updated_at = now()
   where user_id = p_user;

  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.ia_reservar(uuid, bigint, bigint, integer, integer, integer, numeric, text, text, integer) from public, anon, authenticated;
revoke all on function public.ia_liquidar(uuid, bigint, numeric, integer, integer, integer, integer) from public, anon, authenticated;
revoke all on function public.ia_abonar(uuid, bigint, text, text) from public, anon, authenticated;
grant execute on function public.ia_reservar(uuid, bigint, bigint, integer, integer, integer, numeric, text, text, integer) to service_role;
grant execute on function public.ia_liquidar(uuid, bigint, numeric, integer, integer, integer, integer) to service_role;
grant execute on function public.ia_abonar(uuid, bigint, text, text) to service_role;
