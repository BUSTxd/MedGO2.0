/**
 * Modelo de contenido de un solucionario paso a paso.
 *
 * Cada paso resuelve UNA pregunta de la práctica dirigida y se muestra solo
 * (nunca dos a la vez) junto al PDF del enunciado, porque las respuestas
 * referencian dibujos y estructuras que sin el enunciado a la vista no se
 * entienden.
 *
 * Los bloques tienen forma propia según lo que contienen — no todo es un
 * párrafo ni todo es una tarjeta:
 *   parrafo   → razonamiento corrido
 *   mapeo     → «esta marca del dibujo se corresponde con este comentario»
 *   datos     → respuestas etiquetadas (a, b, c…) con su cifra o veredicto
 *   contraste → repartir elementos en dos grupos opuestos (enlazantes vs. no
 *               enlazantes, nucleófilos vs. electrófilos, SN1 vs. SN2…)
 *   tabla     → comparación de varias especies sobre los mismos criterios
 *   opciones  → alternativas a)–e) donde hay que señalar la correcta/falsa
 *   esquema   → un diagrama que el enunciado no trae (mecanismo, estado de
 *               transición); se dibuja inline, ver `SolucionarioEsquema`
 *   clave     → la respuesta final destacada
 *   nota      → el porqué que conviene recordar más allá del ejercicio
 *
 * Regla al redactar: si un apartado de una pregunta usa `datos`, sus apartados
 * hermanos no deberían caer en `parrafo` — se rompe el ritmo visual y el que
 * queda en prosa parece un añadido. Lleva `etiqueta` (a, b, c…) en el bloque
 * que corresponda para que la serie se lea alineada.
 */

export interface MapeoItem {
  /** La letra o marca del dibujo (A, B, C…). */
  marca: string;
  /** Qué está señalando esa marca en la figura del enunciado. */
  senala: string;
  /** El comentario del enunciado que le corresponde. */
  conclusion: string;
}

export interface DatoItem {
  /** Etiqueta corta: «a)», «N», «Enlaces σ»… */
  etiqueta: string;
  /** La respuesta en sí, en grande. */
  valor: string;
  /** Justificación breve. */
  detalle?: string;
}

export interface OpcionItem {
  letra: string;
  texto: string;
  /**
   * `true` marca la opción que responde a la pregunta. Ojo: en preguntas del
   * tipo «señale la FALSA» la opción marcada es justamente la incorrecta
   * químicamente — por eso el rótulo lo pone `veredicto`, no este flag.
   */
  esRespuesta: boolean;
  /**
   * Rótulo mostrado: «Cierto», «Falso», «Sí participa», «Descartada»… El color
   * se deduce del texto (verde afirmativo / rojo negativo / neutro si no es ni
   * una cosa ni otra), así que basta escribirlo bien.
   */
  veredicto?: string;
}

/**
 * Claves del registro de diagramas de `SolucionarioEsquema`. Son dibujos
 * inline (no imágenes) para que hereden el tema claro/oscuro del runner y no
 * dependan de ningún archivo servido aparte.
 */
export type EsquemaId = 'sn1-sn2';

/** Un lado del bloque `contraste`: un grupo con su rótulo y sus elementos. */
export interface LadoContraste {
  titulo: string;
  items: string[];
  /** Cierre del grupo: el porqué de que esos elementos caigan ahí. */
  nota?: string;
}

export type Bloque =
  /**
   * `titulo` existe para cuando un apartado (a, b, c…) es prosa de verdad y sus
   * hermanos son bloques con forma: le da encabezado propio y la serie se sigue
   * leyendo alineada.
   */
  | { tipo: 'parrafo'; titulo?: string; texto: string }
  | { tipo: 'mapeo'; titulo?: string; items: MapeoItem[] }
  | { tipo: 'datos'; titulo?: string; items: DatoItem[] }
  | {
      tipo: 'contraste';
      /** «d)» — mantiene la serie alineada con los bloques `datos` hermanos. */
      etiqueta?: string;
      titulo?: string;
      lados: LadoContraste[];
    }
  | { tipo: 'tabla'; titulo?: string; encabezados: string[]; filas: string[][] }
  | { tipo: 'opciones'; titulo?: string; items: OpcionItem[] }
  /**
   * Diagrama del registro de esquemas. Para cuando la explicación se apoya en
   * una figura que el enunciado no trae (un mecanismo, un estado de
   * transición): el PDF de la izquierda solo tiene el enunciado.
   */
  | { tipo: 'esquema'; titulo?: string; grafico: EsquemaId; pie?: string }
  | { tipo: 'clave'; texto: string }
  | { tipo: 'nota'; titulo?: string; texto: string };

export interface PasoSolucion {
  /** Número de la pregunta en el PDF del enunciado. */
  n: number;
  /**
   * Parte del PDF a la que pertenece la pregunta («Parte 1 · Aldehídos y
   * cetonas»). Solo para las prácticas que se dividen en secciones y reinician
   * la numeración en cada una: sin esto habría varias «Pregunta 1» seguidas
   * sin nada que las distinga.
   */
  parte?: string;
  titulo: string;
  /** Recordatorio de qué pide la pregunta, para no tener que releer el PDF. */
  enunciado?: string;
  bloques: Bloque[];
}

export interface Solucionario {
  id: string;
  /**
   * Id del PDF (clave de `ALLOWED` en `api/resumen/[claseId]`) que se muestra
   * como enunciado al lado de los pasos.
   */
  pdfId: string;
  titulo: string;
  subtitulo?: string;
  pasos: PasoSolucion[];
}
