import 'server-only';
import type { ProfilePlan } from '@/lib/plans';

/**
 * MedGO IA — todo lo que se decide al configurar vive aquí: modelo, precios,
 * cuánto vale un crédito, la cuota de cada plan, los límites y los topes.
 * Ningún otro archivo lleva números de cobro.
 *
 * ⚠️ La API key NO va aquí ni en ningún archivo del repo: se lee de
 * `process.env.ANTHROPIC_API_KEY` en `cliente.ts` (Vercel / `.env.local`).
 */

export const MODELO = 'claude-haiku-5-5';

/**
 * Precios de Haiku 5.5 en US$ por millón de tokens (API de Anthropic,
 * 2026-10). Por encima de 100K tokens de prompt la tarifa sube; «resumir
 * todo» se recorta para no llegar ahí (`MAX_CHARS_DOCUMENTO`).
 */
export const PRECIO = {
  entrada: 0.1,
  salida: 0.5,
  entradaLarga: 0.5,
  salidaLarga: 2.5,
  umbralLargo: 100_000,
  /** Multiplicadores sobre la entrada: escribir en caché (5 min) y leerla. */
  cacheEscritura: 1.25,
  cacheLectura: 0.1,
} as const;

/**
 * Cuántos créditos vale un dólar de costo real. Con 100.000, 1 crédito =
 * US$ 0,00001: una definición ronda los 50 créditos y «resumir todo» unos
 * cientos. Es pura presentación: subirlo ×10 da números ×10 con la misma
 * proporción. Si se cambia, cambiar también las cuotas de abajo.
 */
export const CREDITOS_POR_USD = 100_000;

/**
 * Cuota de créditos por ciclo según el plan (se repone, no se acumula).
 * `null` = sin acceso a la IA. Pendiente de decidir con la subida a S/ 20.
 */
export const CUOTA_POR_PLAN: Record<ProfilePlan, number | null> = {
  free: null,
  ufbi: 50_000,
  'ufbi-anual': 50_000,
  interno: 50_000,
  residente: 50_000,
  // La IA es de nivel completo: Visitante no la trae.
  visitante: null,
  'residente-12': 50_000,
  'especialista-24': 50_000,
};
/** El admin prueba sin preocuparse del saldo. */
export const CUOTA_ADMIN = 500_000;
export const CICLO_DIAS = 30;

/** Mientras no sea `1`, sólo el admin usa la IA; el resto ve «Próximamente». */
export function iaAbierta(): boolean {
  return process.env.IA_ABIERTA === '1';
}

export const LIMITES = {
  porMinuto: 8,
  porDia: 200,
  /** Gasto real de toda la app en un día; al pasarlo la IA se apaga sola. */
  topeDiarioUsd: Number(process.env.IA_TOPE_DIARIO_USD ?? 5),
  /** Una reserva abierta caduca a los N s (si el proceso murió a mitad). */
  ttlReservaSeg: 120,
  pregunta: 500,
  seleccion: 600,
  /** Mensajes previos que se mandan en el chat libre (3 idas y vueltas). */
  historial: 6,
} as const;

export type Accion = 'definir' | 'explicar' | 'profundizar' | 'figura' | 'resumir' | 'libre';
export const ACCIONES: readonly Accion[] = ['definir', 'explicar', 'profundizar', 'figura', 'resumir', 'libre'];

/**
 * Por acción: tope de salida (incluye el pensamiento, que se cobra como
 * salida), esfuerzo y si la respuesta se guarda para el siguiente alumno.
 * `tipico` = tokens de una petición normal, sólo para el precio orientativo
 * que ve el alumno antes de pulsar.
 */
export const ACCION: Record<Accion, {
  maxTokens: number;
  effort: 'low' | 'medium';
  cacheable: boolean;
  tipico: { entrada: number; salida: number };
}> = {
  // `tipico` medido sobre resúmenes reales (2026-10-15): instrucciones ~500
  // tokens + sección ampliada ~600; la salida pesa más que el contexto (×5).
  definir:  { maxTokens: 700,  effort: 'low',    cacheable: true,  tipico: { entrada: 1_200,  salida: 300 } },
  explicar: { maxTokens: 1600, effort: 'low',    cacheable: true,  tipico: { entrada: 1_500,  salida: 800 } },
  // «A fondo»: lo subrayado solo como ancla (~300 tokens); el detalle sale del
  // conocimiento del modelo, así que la respuesta es más larga y piensa más.
  profundizar: { maxTokens: 2800, effort: 'medium', cacheable: true, tipico: { entrada: 900, salida: 1_500 } },
  figura:   { maxTokens: 1800, effort: 'medium', cacheable: true,  tipico: { entrada: 2_800,  salida: 900 } },
  resumir:  { maxTokens: 4000, effort: 'medium', cacheable: true,  tipico: { entrada: 8_000,  salida: 2_500 } },
  libre:    { maxTokens: 1600, effort: 'low',    cacheable: false, tipico: { entrada: 3_000,  salida: 700 } },
};

/** Recortes del contexto que se manda al modelo (en caracteres). */
export const CONTEXTO = {
  /** Una sección más larga se recorta a una ventana alrededor de lo subrayado. */
  maxCharsSeccion: 12_000,
  /**
   * Las secciones de Notion suelen ser diminutas (~150 tokens): se les suman
   * las vecinas hasta llegar aquí, para que la IA vea de qué se está hablando.
   */
  minCharsSeccion: 2_000,
  /** «A fondo»: solo unas líneas alrededor de lo subrayado, como ancla. */
  ventanaProfundizar: 1_200,
  /** «Resumir todo»: el documento hasta aquí (~80K tokens, bajo el umbral de 100K). */
  maxCharsDocumento: 240_000,
  /** Chat libre en un resumen: secciones halladas por palabras clave, hasta aquí. */
  maxCharsLibre: 8_000,
  /** Cada mensaje viejo del historial se recorta a esto antes de reenviarlo. */
  maxCharsHistorial: 1_500,
  /** Lado mayor de la figura que se manda (≈ 1.600 tokens a 1092×1092). */
  ladoFigura: 1092,
} as const;
