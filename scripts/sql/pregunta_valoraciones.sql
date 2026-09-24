-- Valoración de cada pregunta del quiz (rojo / amarillo / verde), una por alumno.
-- RLS activo y sin políticas: todo pasa por la service role (src/lib/valoraciones-server.ts).
create table if not exists public.pregunta_valoraciones (
  user_id uuid not null references auth.users(id) on delete cascade,
  exam_key text not null,
  question_id text not null,
  rating text not null check (rating in ('rojo', 'amarillo', 'verde')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, exam_key, question_id)
);
create index if not exists pregunta_valoraciones_exam_idx on public.pregunta_valoraciones (exam_key, question_id);
alter table public.pregunta_valoraciones enable row level security;
