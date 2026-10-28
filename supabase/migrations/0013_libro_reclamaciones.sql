-- Libro de Reclamaciones virtual (Código de Protección y Defensa del Consumidor,
-- D.S. 011-2011-PCM y D.S. 101-2022-PCM). Cada hoja lleva un número correlativo
-- que no se reutiliza. RLS activo y sin políticas: todo pasa por
-- /api/libro-reclamaciones con service role.

CREATE TABLE IF NOT EXISTS public.libro_reclamaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  codigo text GENERATED ALWAYS AS ('LR-' || lpad(numero::text, 6, '0')) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tipo text NOT NULL CHECK (tipo IN ('reclamo','queja')),
  nombre text NOT NULL,
  tipo_documento text NOT NULL CHECK (tipo_documento IN ('DNI','CE','Pasaporte','RUC')),
  numero_documento text NOT NULL,
  domicilio text NOT NULL,
  telefono text,
  email text NOT NULL,
  menor_de_edad boolean NOT NULL DEFAULT false,
  apoderado_nombre text,
  apoderado_documento text,
  bien_tipo text NOT NULL CHECK (bien_tipo IN ('producto','servicio')),
  bien_descripcion text NOT NULL,
  monto_reclamado numeric,
  detalle text NOT NULL,
  pedido text NOT NULL,
  copia_enviada boolean NOT NULL DEFAULT false,
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente','respondido')),
  respuesta text,
  respondido_at timestamptz
);

CREATE INDEX IF NOT EXISTS libro_reclamaciones_email_idx ON public.libro_reclamaciones (email, created_at DESC);

ALTER TABLE public.libro_reclamaciones ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.libro_reclamaciones FROM anon, authenticated;
