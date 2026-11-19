// Contrato de datos del laboratorio «VIH y sífilis» (clase ACP14 de Patología). Usa el
// motor de Lupus tal cual (`src/lib/lupus/motor.ts`): la voz es el reloj y cada paso dura
// lo que su frase. El dibujo de cada paso es una lámina propia (`laminas/c<capítulo>.tsx`)
// que lee sus parámetros `tejido`. Guion: docs/vih-sifilis/GUION.md.

import type { Escenario } from '@/lib/data/lupus/tipos';

export type ParteId =
  | 'pacientes' | 'vih' | 'virion' | 'genes' | 'celulas' | 'mucosa' | 'ciclo'
  | 'inmunidad' | 'historia' | 'carga' | 'diagnostico' | 'oportunistas' | 'tar' | 'nuevo' | 'fallo'
  | 'treponema' | 'endarteritis' | 'chancro' | 'estadios' | 'serologia' | 'tratamiento';

export type Parte = Escenario & {
  id: ParteId;
  numero: number;
  nombreCorto: string;
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};

// ─── Tablas resumen ──────────────────────────────────────────────────────────
// Como las de Gramnegativas: cada fila lleva al paso donde se anima. Solo tipos: esto sí
// puede importarlo un componente de cliente; el contenido (`tablas.ts`) no.

/** A dónde lleva una fila: el capítulo y el paso (el «#» de las tablas de GUION.md). */
export type Destino = { cap: ParteId; paso: number };

/** Una celda: un texto, o una lista (un renglón por elemento). `*así*` va en cursiva. */
export type Celda = string | string[];

export type FilaTabla = {
  nombre: string;
  /** Una celda por cada columna menos la primera (la del nombre). */
  celdas: Celda[];
  /** Si no se da, hereda el de la tabla. */
  destino?: Destino;
};

export type TablaResumen = {
  id: string;
  titulo: string;
  /** «ACP14 §Ciclo»: de dónde sale en el resumen de la clase. */
  fuente: string;
  /** Los encabezados; el primero es el de la columna del nombre. */
  columnas: string[];
  filas: FilaTabla[];
  /** El paso que anima la tabla entera; cada fila puede tener el suyo. */
  destino?: Destino;
  /** Una idea que acompaña a la tabla. */
  nota?: string;
};

/** Un grupo de tablas = una pestaña del panel. Lo que se ve aunque esté cerrado. */
export type MetaGrupo = {
  id: string;
  nombre: string;
  /** Los capítulos que ilustra (el panel abre en el grupo del capítulo en curso). */
  capitulos: ParteId[];
  /** Del vistazo gratis. */
  gratis: boolean;
  /** Pie del panel cuando esta pestaña está abierta. */
  fuente: string;
};

/** Lo que el servidor manda: las tablas solo si la pestaña está abierta para esa cuenta. */
export type GrupoTablas = MetaGrupo & { tablas?: TablaResumen[] };
