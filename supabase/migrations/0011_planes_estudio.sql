-- Planificador de estudio (/estudio → Mi progreso). Se guarda SOLO lo que el
-- alumno decidió (qué estudiar, para cuándo, con cuánto tiempo): el calendario se
-- recalcula cada vez en el servidor (src/lib/estudio/planificador.ts), así nunca
-- se desincroniza del material ni del avance. El avance de los banqueos sale de
-- analytics_events (examen_completado); aquí van solo las marcas a mano («Ya lo leí»).
--
-- RLS activo y SIN políticas, y sin privilegios para anon/authenticated: todo pasa
-- por /api/estudio/plan con la service role key, como mensajes y aportes_marcas.

create table public.planes_estudio (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  ruta            text not null default 'upch' check (ruta in ('upch', 'encib')),
  curso           text not null check (char_length(curso) between 1 and 60),
  nombre          text not null check (char_length(nombre) between 1 and 80),
  fecha_examen    date not null,
  -- Qué entra: { tipo: 'curso' | 'evaluacion' | 'clases' | 'temas' | 'bloques', ... }
  alcance         jsonb not null,
  -- Días, minutos por día, punto de partida por clase, objetivo.
  respuestas      jsonb not null,
  creado_at       timestamptz not null default now(),
  actualizado_at  timestamptz not null default now(),
  archivado       boolean not null default false,
  check (pg_column_size(alcance) <= 32768),
  check (pg_column_size(respuestas) <= 16384)
);

-- Un plan activo por curso y alumno; los archivados se conservan.
create unique index planes_estudio_activo_idx
  on public.planes_estudio (user_id, ruta, curso) where not archivado;
create index planes_estudio_user_idx on public.planes_estudio (user_id, actualizado_at desc);

create table public.planes_tareas_hechas (
  plan_id   uuid not null references public.planes_estudio(id) on delete cascade,
  -- Id determinista de la tarea (`leer:inm-t-5#complemento`…).
  tarea_id  text not null check (char_length(tarea_id) between 1 and 200),
  hecha_at  timestamptz not null default now(),
  primary key (plan_id, tarea_id)
);

alter table public.planes_estudio enable row level security;
alter table public.planes_tareas_hechas enable row level security;

revoke all on public.planes_estudio from anon, authenticated;
revoke all on public.planes_tareas_hechas from anon, authenticated;
