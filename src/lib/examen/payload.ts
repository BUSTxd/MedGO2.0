import type { PlanKey } from '@/lib/plans';

/**
 * El contrato del JSON del bucket `examenes` y cómo se descarga. Vive aparte
 * porque lo comparten dos motores: la hoja de examen (`ExamRunner`) y las
 * tarjetas de repaso (`TarjetasRunner`). Duplicar la clave de la caché de URLs
 * firmadas entre ambos sería la forma más fácil de que una quedase servida y la
 * otra no.
 */

export interface ExamOption {
  id: string;
  text: string;
  correct: boolean;
  /**
   * Alternativa que ES una imagen (las seis células de la 23 del Final 2023 de
   * Inmunología). Con que una la lleve, la pregunta pinta sus alternativas como
   * fichas: la foto se amplía y la barra de abajo marca la respuesta.
   */
  image?: { src: string; w: number; h: number; alt?: string };
}

/**
 * Otra versión de la MISMA pregunta: en el Final 2023 de Inmunología, la del
 * apunte (alternativas reconstruidas) y la del examen (las originales). No es
 * una pregunta más: comparte número, rastro y nota, y la respuesta vale en la
 * versión en que se dio. Lo que no declara se hereda de la base —la figura y el
 * enunciado suelen ser los mismos—, salvo `reviewNote`, que es de cada versión:
 * heredar «se reconstruyeron las alternativas» sobre las originales mentiría.
 * Los `id` de sus opciones no pueden repetir los de la base.
 */
export interface VariantePregunta {
  /** Rótulo del interruptor para esta versión y para la base. */
  rotulo: string;
  rotuloBase: string;
  stem?: string;
  image?: string;
  imageAlt?: string;
  imageW?: number;
  imageH?: number;
  extraImages?: ExamQuestion['extraImages'];
  options: ExamOption[];
  explanation?: string;
  reviewNote?: string;
}

export interface ExamQuestion {
  id: string;
  stem: string;
  /** URL pública de la micrografía/imagen de referencia (opcional). */
  image?: string;
  imageAlt?: string;
  /** Dimensiones intrínsecas de la imagen (para evitar layout shift). */
  imageW?: number;
  imageH?: number;
  /**
   * Imágenes que acompañan a `image` cuando el enunciado pide ver varias
   * («ver las 2 imágenes»). Van lado a lado, cada una ampliable por separado.
   */
  extraImages?: { src: string; alt?: string; w?: number; h?: number }[];
  options: ExamOption[];
  explanation?: string;
  explanationImage?: string;
  explanationImageAlt?: string;
  explanationImageCaption?: string;
  /**
   * Láminas que acompañan a `explanationImage` cuando la respuesta del PDF trae
   * varias (el repaso de Inmunología 2025 muestra dos en algunas). Van lado a
   * lado como las `extraImages` del enunciado, y el pie es uno para todas.
   */
  explanationExtraImages?: { src: string; alt?: string; w?: number; h?: number }[];
  reviewNote?: string;
  tags?: string[];
  /** Tema del vocabulario del curso. Sin esto la pregunta queda fuera del informe. */
  tema?: string;
  /**
   * Motor de tarjetas: de dónde sale en el resumen HTML de la clase (mismo
   * formato que `Flashcard.seccion`, con «›» para acotar).
   */
  seccion?: string;
  /**
   * Tipo de pregunta dentro del tema («Categoría I-4 y UPSS requeridas»). El
   * informe final lo lista bajo su tema cuando se falla.
   */
  subtema?: string;
  /**
   * Dónde más salió esta pregunta («También en el SUSTI · P12»). Se pinta sobre
   * el enunciado antes de responder: que se repita entre exámenes es justo lo
   * que la vuelve prioritaria.
   */
  repite?: string;
  /** La misma pregunta en otra versión; el alumno elige cuál ver con un interruptor. */
  variante?: VariantePregunta;
  /**
   * No barajar las alternativas: van en el orden del JSON. Sólo para las que
   * traen su letra dentro de la imagen, o la letra del botón y la de la foto
   * dejarían de coincidir.
   */
  ordenFijo?: boolean;
  /**
   * Respuesta múltiple: el alumno marca todas las que crea correctas y pulsa
   * «Comprobar». Acierta sólo si marca EXACTAMENTE las correctas: sin esto, una
   * pregunta con dos correctas se daba por buena al tocar cualquiera de ellas.
   */
  multiple?: boolean;
}

/**
 * Tarjeta de memoria escrita a propósito (sale del resumen, no de una pregunta).
 * Sin alternativas: es para recordar, no para descartar distractores.
 */
export interface Flashcard {
  id: string;
  frente: string;
  /** Lo que hay que recordar, en una línea. */
  respuesta: string;
  /** El porqué o el matiz, en markdown. */
  detalle?: string;
  tema?: string;
  /**
   * De dónde sale en el resumen HTML de la clase: comienzo de un título o de
   * una celda, con «›» para acotar (`GENÉTICAS › Lugar de acción`).
   */
  seccion?: string;
}

/** Banqueo recortado por el servidor para quien no tiene el plan. */
export interface Muestra {
  mostradas: number;
  total: number;
  /** Lo mismo para `flashcards`, que se recortan aparte de las preguntas. */
  flashMostradas?: number;
  flashTotal?: number;
  plan: PlanKey;
  /** Qué trae el banqueo COMPLETO: lo cuenta la route, que sí lo ve entero. */
  variantes?: number;
  conExplicacion?: number;
  conNota?: number;
  conImagen?: number;
  conLamina?: number;
}

export interface ExamPayload {
  version: number;
  key: string;
  title: string;
  /**
   * Minutos **recomendados** para el examen, no un límite: el cronómetro cuenta
   * hacia arriba desde 0 y sólo cambia de color al pasarse. Con `null` el examen
   * no lleva cronómetro (es el caso de los bancos de histología, que se hacen a
   * ritmo libre); con un número, aparece.
   */
  duration_min: number | null;
  questions: ExamQuestion[];
  /** Sólo el motor de tarjetas: sin ellas, el modo Tarjetas se deriva de `questions`. */
  flashcards?: Flashcard[];
}

/**
 * `premiumDesde`: en un banqueo con muestra, quien tiene el plan lo recibe
 * entero, y las preguntas desde ese índice (orden del JSON) siguen en oro.
 */
export interface SignedUrlEntry { url: string; expiresAt: number; premiumDesde?: number }

const EXPIRY_BUFFER_MS = 15 * 60 * 1000;
// v2: la entrada lleva `premiumDesde`; las cacheadas antes no lo traían.
const urlCacheKey = (k: string) => `examen-url-v2-${k}`;

function readUrlCache(k: string): SignedUrlEntry | null {
  try {
    const raw = sessionStorage.getItem(urlCacheKey(k));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SignedUrlEntry;
    if (!parsed.url || typeof parsed.expiresAt !== 'number') return null;
    if (parsed.expiresAt - Date.now() < EXPIRY_BUFFER_MS) return null;
    return parsed;
  } catch { return null; }
}

function writeUrlCache(k: string, entry: SignedUrlEntry) {
  try { sessionStorage.setItem(urlCacheKey(k), JSON.stringify(entry)); } catch {}
}

// Recortes de la muestra, sólo en memoria: se van al recargar la pestaña y
// `olvidarMuestras()` los tira en cuanto cambia el plan, para que quien acaba
// de pagar reciba el banqueo entero en la siguiente entrada.
const muestras = new Map<string, { payload: ExamPayload; muestra: Muestra }>();

export function olvidarMuestras() {
  muestras.clear();
}

export async function fetchExam(key: string): Promise<{ payload: ExamPayload; muestra?: Muestra; premiumDesde?: number }> {
  const recorte = muestras.get(key);
  // Copia: los runners no deben poder tocar lo guardado.
  if (recorte) return structuredClone(recorte);
  let entry = readUrlCache(key);
  if (!entry) {
    const r = await fetch(`/api/examen/${key}`);
    if (!r.ok) {
      if (r.status === 401) throw new Error('Necesitas iniciar sesión para ver este examen.');
      if (r.status === 403) throw new Error('Este examen es solo para el plan Interno.');
      if (r.status === 404) throw new Error('Examen no disponible.');
      throw new Error('Error cargando el examen.');
    }
    const data = (await r.json()) as SignedUrlEntry | { payload: ExamPayload; muestra: Muestra };
    // Recorte del servidor: llega sin URL, con las preguntas que tocan y nada
    // más. Nunca a `sessionStorage`: sobreviviría a un cambio de plan.
    if ('payload' in data) {
      const r = { payload: data.payload, muestra: data.muestra };
      muestras.set(key, r);
      return structuredClone(r);
    }
    writeUrlCache(key, data);
    entry = data;
  }
  const jsonRes = await fetch(entry.url);
  if (!jsonRes.ok) throw new Error('No se pudo descargar el contenido.');
  return { payload: (await jsonRes.json()) as ExamPayload, premiumDesde: entry.premiumDesde };
}
