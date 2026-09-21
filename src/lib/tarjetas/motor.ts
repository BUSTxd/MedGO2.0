import { shuffle } from '@/lib/utils/shuffle';
import type { ExamOption, ExamPayload, ExamQuestion, Flashcard } from '@/lib/examen/payload';

/**
 * La verdad de una pregunta, en un solo sitio.
 *
 * El flag `correct` viaja DENTRO de la opción, así que barajar nunca puede
 * cruzar la respuesta con otra alternativa. Los dos modos del runner —tarjeta
 * de memoria y quiz— preguntan aquí; ninguno reimplementa la corrección, y el
 * dorso que se enseña al terminar es el mismo se acierte o se falle: lo único
 * que cambia entre los dos casos es el color.
 */

export function esCorrecta(pregunta: ExamQuestion, opcionId: string): boolean {
  return pregunta.options.find(o => o.id === opcionId)?.correct === true;
}

export interface Dorso {
  /** La respuesta buena. En plural si la pregunta tuviera más de una. */
  respuesta: string;
  justificacion?: string;
}

/** El reverso de la tarjeta: qué era lo correcto y por qué. */
export function dorsoDe(pregunta: ExamQuestion): Dorso {
  const buenas = pregunta.options.filter(o => o.correct).map(o => o.text);
  return {
    respuesta: buenas.join(' · ') || '—',
    justificacion: pregunta.explanation,
  };
}

/**
 * Las tarjetas del modo memoria. Si el banqueo trae las suyas (escritas desde el
 * resumen) mandan ésas; si no, cada pregunta del quiz se vuelve una tarjeta.
 */
export function flashcardsDe(payload: ExamPayload): Flashcard[] {
  if (payload.flashcards) return payload.flashcards;
  return payload.questions.map(q => {
    const d = dorsoDe(q);
    return { id: q.id, frente: q.stem, respuesta: d.respuesta, detalle: d.justificacion, tema: q.tema };
  });
}

/**
 * Las alternativas en el orden en que se muestran. `ordenFijo` sólo lo llevan
 * las preguntas cuya letra vive dentro de la imagen: barajarlas descuadraría la
 * letra del naipe con la de la figura.
 */
export function opcionesDe(pregunta: ExamQuestion): ExamOption[] {
  return pregunta.ordenFijo ? pregunta.options : shuffle(pregunta.options);
}

/**
 * Baraja las preguntas y congela el orden de cada juego de alternativas, para
 * que re-renderizar no reordene los naipes bajo el cursor.
 */
export function prepararRonda(preguntas: ExamQuestion[]): {
  orden: ExamQuestion[];
  opciones: Record<string, ExamOption[]>;
} {
  const orden = shuffle(preguntas);
  const opciones: Record<string, ExamOption[]> = {};
  for (const q of orden) opciones[q.id] = opcionesDe(q);
  return { orden, opciones };
}
