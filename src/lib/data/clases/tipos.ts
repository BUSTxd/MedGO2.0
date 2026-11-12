// La plantilla de cada clase: sus «Notas» y sus «Casos clínicos». El diseño es uno
// solo (`components/estudio/Notas.tsx` y `CasosClinicos.tsx`); cada clase aporta
// solo el contenido, en `data/clases/<curso>/<clase>.json` (fuera de git: lleva las
// respuestas y el repo es público). `scripts/clases/publicar.mjs` lo valida, lo sube
// al bucket privado `examenes` y regenera `registro.ts`. Formato: docs/clases/PLANTILLA.md.
//
// Con solo tipos: esto sí puede importarlo un componente de cliente.

// ── Notas ────────────────────────────────────────────────────────────────────

/** Lo que va en un lado de la comparación: una frase o una lista corta. */
export type ValorNota = string | string[];

/** Lo que se compara (2 a 4 columnas): un recuadro por fila, con cada columna en su tono. */
export interface SeccionComparacion {
  tipo: 'comparacion';
  titulo: string;
  columnas: string[];
  filas: { nombre: string; valores: ValorNota[]; clave?: string }[];
}

/**
 * Hallazgos que se explican uno a uno. `donde` es su rótulo; `columna`, el tono de
 * la comparación al que pertenece (sin ella, el neutro). `flujo`: una cadena de causas, en orden.
 */
export interface SeccionClaves {
  tipo: 'claves';
  titulo: string;
  filas: { nombre: string; donde?: string; columna?: number; texto?: string; flujo?: string[] }[];
}

export type SeccionNota = SeccionComparacion | SeccionClaves;

/** El resumen práctico de la pestaña «Notas». */
export interface NotaClase {
  titulo: string;
  entrada: string;
  secciones: SeccionNota[];
}

// ── Casos clínicos ───────────────────────────────────────────────────────────

/** Los dibujos que puede llevar un bloque en la portada de los casos. */
export type DibujoBloque = 'hematie' | 'plaqueta';

/** Un grupo de casos que se puede practicar suelto (AHAI, PTI…). */
export interface BloqueCasos {
  id: string;
  nombre: string;
  /** Debajo del nombre, en su tarjeta. */
  dice?: string;
  dibujo?: DibujoBloque;
}

export interface OpcionCaso { t: string; porque: string; correcta?: boolean }

export interface CasoClinico {
  id: string;
  /** El bloque o los bloques a los que pertenece; sin él, solo sale en «Todos». */
  bloque?: string | string[];
  tema: string;
  /** «MIR 2016, pregunta 96» (adaptada de esa pregunta) o «MedGO» (escrita para la clase). */
  origen: string;
  caso: string;
  datos?: { k: string; v: string; alerta?: boolean }[];
  pregunta: string;
  opciones: OpcionCaso[];
  /** El razonamiento que lleva a la respuesta, paso a paso. */
  camino: string[];
  /** El paso del laboratorio de la clase que lo muestra (`?parte=…&paso=…`; los pasos empiezan en 0). */
  lab?: { parte: string; paso?: number };
}

/** Lo que se sube al bucket y entrega `/api/examen/<clave>` (recortado sin el plan). */
export interface BancoCasos {
  titulo?: string;
  entrada?: string;
  bloques?: BloqueCasos[];
  questions: CasoClinico[];
}

// ── Registro (lo genera scripts/clases/publicar.mjs) ─────────────────────────

export interface EntradaRegistro {
  curso: string;
  clase: string;
  notas?: { titulo: string };
  casos?: {
    key: string;
    titulo: string;
    /** La tarjeta de la pestaña «Práctica». */
    desc: string;
    chips: string[];
    total: number;
    /** Los N primeros abiertos sin el plan; `libre`, todos. */
    muestra: number;
    libre?: boolean;
  };
}

/** Por `<curso>/<clase>`. */
export type RegistroClases = Record<string, EntradaRegistro>;
