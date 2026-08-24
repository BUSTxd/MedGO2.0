/**
 * Módulo interactivo de una clase teórica de Física.
 *
 * El objetivo pedagógico manda sobre el visual: cada sección se recorre en dos
 * fases — primero `logica` (entender POR QUÉ, sin tocar nada) y sólo después la
 * simulación (`sim`), que sirve para comprobar lo que ya se razonó. Por eso los
 * bloques de lógica son un vocabulario cerrado con forma propia y no prosa
 * suelta: el alumno tiene que poder distinguir de un vistazo una idea central
 * de una fórmula desglosada o de un contraste entre dos casos.
 */

/** Claves del registro de simulaciones (`src/components/fisica/sims`). */
export type SimId =
  | 'resorte'
  | 'pendulo'
  | 'ondas'
  | 'sonido'
  /**
   * Balance térmico del cuerpo. Es UNA sim para las cuatro secciones de C7 —a
   * diferencia de C6, que tiene una por sección— porque en termorregulación las
   * cuatro no son fenómenos separados sino sumandos de la misma ecuación: el
   * calor que el metabolismo produce sale por conducción, radiación y
   * evaporación, y lo que sobra o falta mueve la temperatura corporal. Partirla
   * en cuatro escenas escondería justamente eso.
   */
  | 'termico'

  /* ─── Una por clase del sílabo ────────────────────────────────────────────
     El laboratorio cubre las 14 clases de Física para Medicina, y cada una
     aporta la escena del fenómeno que de verdad se pregunta. No hay «cinemática»
     ni «tiro parabólico» sueltos: este curso no los tiene como clase propia, y
     una sim que no case con una actividad del sílabo sería material huérfano. */
  | 'plano'          // C1 · plano inclinado con fricción, con su diagrama de cuerpo libre
  | 'colision'       // C2 · choque 1D: de elástico a perfectamente inelástico
  | 'rotacional'     // C3 · torque, momento de inercia y conservación de L
  | 'palanca'        // C4 · palanca del codo: la de tercer género del cuerpo
  | 'fluidos'        // C5 · continuidad y Bernoulli en un vaso con estenosis
  | 'gas'            // C8 · procesos termodinámicos sobre el diagrama PV
  | 'coulomb'        // C9 · dos cargas, su fuerza y sus líneas de campo
  | 'capacitor'      // C10 · condensador de placas, leído como membrana celular
  | 'circuito'       // C11 · Ohm con resistencias en serie y en paralelo
  | 'magnetico'      // C12 · Lorentz y Faraday en la misma escena
  | 'lente'          // C13 · lente delgada y los defectos de refracción del ojo
  | 'fotoelectrico'; // C14 · efecto fotoeléctrico y la frecuencia umbral

/**
 * Claves del registro de fórmulas vivas (`FormulaViva.tsx`). Es una CLAVE y no
 * la función de cálculo por el mismo motivo que `SimId` e `icono`: el módulo
 * lo carga un Server Component y se lo pasa al runner como prop, y las
 * funciones no cruzan la frontera servidor→cliente (la misma trampa que ya
 * obligó a aplanar `HISTO_CURSOS` en el registro de aportes).
 */
export type CalculoId =
  | 'fuerza-resorte'
  | 'periodo-resorte'
  | 'energia-resorte'
  | 'periodo-pendulo'
  | 'velocidad-onda'
  | 'frecuencia-resolucion'
  | 'nivel-db'
  // C7 · Temperatura y calor
  | 'escala-fahrenheit'
  | 'calor-sensible'
  | 'calor-latente'
  | 'conduccion';

/**
 * Escena 2D que acompaña a una fórmula viva (`FormulaViz.tsx`). Dibuja lo que
 * la fórmula DICE, con los valores que el alumno está arrastrando: la idea es
 * que pueda mirar el número y el dibujo a la vez y ver que son lo mismo.
 */
export type VizId =
  | 'fuerza-resorte'    // el vector F cambiando de sentido con el signo de x
  | 'oscilador-resorte' // masa-resorte oscilando al ritmo que marca T
  | 'energia-resorte'   // parábola E(A): al doblar A la energía se cuadruplica
  | 'pendulo-mini'      // péndulo oscilando al ritmo que marca T
  | 'onda-mini'         // onda viajando, con λ medido sobre ella
  | 'resolucion-eco'    // dos detalles separados d: se resuelven sólo si λ ≤ d
  | 'db-mini'           // la regla logarítmica: ×10 en I ↔ +10 en β
  // C7 · Temperatura y calor
  | 'escala-mini'       // dos termómetros, °C y °F, con las bandas clínicas
  | 'calor-mini'        // el depósito de energía que hay que llenar para subir ΔT
  | 'fase-mini'         // curva de calentamiento: la meseta donde T no sube
  | 'conduccion-mini';  // gradiente por la capa aislante y el flujo que la cruza

/** Una variable manipulable de una fórmula viva. */
export interface VariableViva {
  /** Clave con la que el cálculo la recibe. */
  id: string;
  simbolo: string;
  unidad?: string;
  min: number;
  max: number;
  paso: number;
  inicial: number;
  /** Escala del control: 'log' para rangos de varios órdenes (intensidad). */
  escala?: 'lineal' | 'log';
  /** Decimales al mostrar el valor. */
  decimales?: number;
}

/**
 * Hace la fórmula manipulable: el alumno arrastra cada símbolo y ve el
 * resultado recalcularse. Es el bloque donde se entiende de QUÉ depende una
 * magnitud antes de tocar la simulación completa.
 */
export interface FormulaVivaCfg {
  calculo: CalculoId;
  /** Escena 2D que se dibuja con estos mismos valores. */
  viz: VizId;
  variables: VariableViva[];
  resultado: {
    simbolo: string;
    unidad: string;
    decimales?: number;
    /** Rango esperado, para dibujar la barra de proporción. */
    min: number;
    max: number;
  };
  /** Plantilla de la expresión con los valores sustituidos. `{id}` y `{=}`. */
  sustituida: string;
  /** Qué mirar mientras se arrastra. */
  observa: string;
}

/**
 * Problema tipo examen que se resuelve APOYÁNDOSE en la simulación: el botón
 * de «llevar a la simulación» le pasa los datos del enunciado a los controles,
 * de modo que el alumno ve el caso concreto en movimiento antes de calcular.
 */
export interface Problema {
  enunciado: string;
  datos: { label: string; valor: string }[];
  /**
   * Valores con los que preconfigurar la simulación. Las claves son las del
   * `preset` que acepta cada sim (documentadas en su componente).
   */
  preset?: Record<string, number>;
  pregunta: string;
  respuesta: { valor: number; unidad: string; /** Tolerancia relativa (0.05 = 5 %). */ tolerancia: number };
  /** Resolución paso a paso, revelable tras intentarlo. */
  pasos: string[];
  /** Lo que se ve en la simulación y confirma el resultado. */
  comprueba: string;
}

/**
 * Bloques de la fase «entender». Antes de añadir uno nuevo, comprobar si
 * alguno ya calza — el catálogo existe para que no todo sea la misma tarjeta.
 */
export type BloqueLogica =
  /** La afirmación central de la que cuelga todo lo demás. */
  | { tipo: 'idea'; titulo: string; texto: string }
  /** Un anclaje a algo que el alumno ya conoce fuera de la física. */
  | { tipo: 'analogia'; titulo: string; texto: string }
  /** Una fórmula desmontada término a término, más cómo se lee en voz alta. */
  | {
      tipo: 'formula';
      expresion: string;
      partes: { simbolo: string; significado: string; unidad?: string }[];
      lectura: string;
      /** Con esto, la fórmula se puede arrastrar y recalcula en vivo. */
      viva?: FormulaVivaCfg;
    }
  /** Una cadena de razonamiento donde el orden importa. */
  | { tipo: 'pasos'; titulo: string; pasos: string[] }
  /** Dos casos que se confunden entre sí y hay que separar. */
  | {
      tipo: 'contraste';
      titulo: string;
      a: { titulo: string; items: string[] };
      b: { titulo: string; items: string[] };
    }
  /** Dónde aparece esto en el cuerpo o en la clínica (es Física para Medicina). */
  | { tipo: 'clinico'; titulo: string; texto: string }
  /** El error que casi todos cometen en el examen. */
  | { tipo: 'trampa'; titulo: string; texto: string };

/** Pregunta de comprobación al cerrar una sección. */
export interface Chequeo {
  pregunta: string;
  opciones: string[];
  /** Índice de la opción correcta en `opciones`. */
  correcta: number;
  explicacion: string;
}

/**
 * Reto para explorar CON la simulación: no se responde leyendo, se responde
 * moviendo los controles. Por eso lleva pista en vez de alternativas.
 */
export interface Reto {
  pregunta: string;
  pista: string;
}

export interface Seccion {
  id: string;
  /** Número visible en el índice y en el progreso. */
  titulo: string;
  subtitulo: string;
  /** Acento propio de la sección (hex). Tiñe cabecera, sim y progreso. */
  acento: string;
  /** Clave del registro de íconos del módulo. */
  icono: string;
  /** Qué se lleva el alumno de aquí, en una frase. */
  objetivo: string;
  logica: BloqueLogica[];
  sim: SimId;
  /** Problema guiado que acompaña a la simulación en la fase 2. */
  problema: Problema;
  retos: Reto[];
  chequeo: Chequeo;
}

export interface ModuloTeoria {
  /** Id de la actividad en el sílabo (`fis-c-6`). */
  claseId: string;
  codigo: string;
  titulo: string;
  /** Frase de portada: qué es esta clase en una línea. */
  gancho: string;
  /** Minutos estimados de recorrido completo. */
  duracion: number;
  secciones: Seccion[];
  /** Ideas que el alumno debe poder recitar al terminar. */
  cierre: { titulo: string; texto: string }[];
}


/* ═══════════════════════════════════════════════════════════════════════════
   Laboratorio de una clase

   Doce de las catorce clases de Física tienen laboratorio pero todavía no el
   módulo completo de teoría (lógica → simulación → problema → chequeo), que es
   un trabajo de redacción por clase. Para ésas, la ruta `modulo/{id}` abre un
   MENÚ DE TEMAS y, al elegir uno, la vista de simulación: el mismo recorrido
   que describe el laboratorio, sin fingir un contenido teórico que no existe.

   Cuando una clase gane su `ModuloTeoria`, éste manda y el laboratorio suelto
   deja de usarse — de ahí que `findModulo` se consulte primero.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TemaLab {
  id: string;
  titulo: string;
  subtitulo: string;
  /** Acento propio del tema (hex). Tiñe cabecera y simulación. */
  acento: string;
  /** Clave del registro de íconos del módulo. */
  icono: string;
  /** Qué se lleva el alumno de este tema, en una frase. */
  objetivo: string;
  sim: SimId;
  /** Qué mirar en la simulación. Se responden moviendo, no leyendo. */
  retos: Reto[];
}

export interface LaboratorioClase {
  /** Id de la actividad en el sílabo (`fis-c-1`). */
  claseId: string;
  codigo: string;
  titulo: string;
  /** Frase de portada: qué se puede tocar en esta clase. */
  gancho: string;
  temas: TemaLab[];
}
