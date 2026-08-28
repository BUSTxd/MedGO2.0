/**
 * Banco de preguntas — modelo de datos.
 *
 * Es el segundo envase de la tarjeta «Banqueo», junto al `ExamRunner` del bucket
 * `examenes`. La diferencia no es de piel sino de recorrido: aquí un tema se
 * divide en **tandas** (intentos alternativos del mismo contenido) y cada tanda
 * en **fases** que se recorren seguidas (pretest → postest), con una pantalla
 * bisagra entre medias. El alumno elige la tanda, no la fase.
 *
 * El contenido vive en git (no en el bucket) porque son pocas preguntas y se
 * reeditan a mano; el precedente es `src/lib/data/solucionarios/`, que también
 * se resuelve por id de actividad y no desde el sílabo.
 */

export interface BancoOpcion {
  id: string;
  texto: string;
  /** Exactamente una por pregunta. Lo verifica `scripts/verificar-banco.mjs`. */
  correcta?: boolean;
}

export interface BancoPregunta {
  id: string;
  enunciado: string;
  /**
   * Chips de contexto sobre el enunciado. **No deben delatar la respuesta**: si
   * la pregunta es «¿qué molécula media el rolling?», la etiqueta no puede ser
   * «Selectinas». Misma regla que el badge `region` de los EVA.
   */
  etiquetas?: string[];
  imagen?: { src: string; alt: string; w: number; h: number };
  opciones: BancoOpcion[];
  /** Markdown. Se revela tras responder, se acierte o se falle. */
  explicacion: string;
  /**
   * Precisión que matiza la respuesta sin cambiar la clave (p. ej. la
   * vasoconstricción transitoria previa a la vasodilatación). Va aparte de
   * `explicacion` para pintarse como nota y no como parte del razonamiento.
   */
  matiz?: string;
}

export interface BancoFase {
  id: 'pretest' | 'postest';
  label: string;
  preguntas: BancoPregunta[];
}

export interface BancoTanda {
  id: string;
  /** Lo que se pinta dentro del cuadro del selector: «1», «2», … */
  label: string;
  fases: BancoFase[];
}

export interface BancoTema {
  /** Clave estable del tema, p. ej. `patologia/acp-1`. */
  id: string;
  /** Id de la actividad del sílabo por la que se descubre (`findBanco`). */
  claseId: string;
  titulo: string;
  subtitulo?: string;
  /** Acento de la sección. Se inyecta como custom property `--acc`. */
  acento: string;
  /** Chips fijos que acompañan a todas las preguntas del tema. */
  etiquetas?: string[];
  tandas: BancoTanda[];
}
