// Ficha de una estructura del atlas 3D: lo que se estudia de ella (origen,
// inserción, inervación, acción…). Va por `nombreEn` de la pieza (el nombre
// inglés del manifiesto, estable entre versiones); el visor la enseña al
// seleccionarla. Cada región tiene su archivo, que el visor importa al cargarla.
//
// Textos en español, Terminología Anatómica (nombre clásico entre paréntesis
// cuando en clase se usa otro). Segmentos medulares entre paréntesis: «Nervio
// musculocutáneo (C5–C6)». Frases cortas, sin punto final.

interface Base {
  /** Dato clínico o de examen que vale la pena recordar (opcional). */
  nota?: string;
}

export interface FichaMusculo extends Base {
  tipo: 'musculo';
  origen: string;
  insercion: string;
  inervacion: string;
  accion: string;
  irrigacion?: string;
}

export interface FichaNervio extends Base {
  tipo: 'nervio';
  /** De qué nervio, fascículo, tronco o raíces nace, con sus segmentos. */
  origen: string;
  recorrido?: string;
  /** Músculos que inerva. */
  motor?: string;
  /** Piel o territorio que sensibiliza. */
  sensitivo?: string;
}

export interface FichaHueso extends Base {
  tipo: 'hueso';
  /** Largo, corto, plano, irregular, sesamoideo… */
  clase?: string;
  /** Partes y accidentes que se preguntan. */
  partes: string[];
  /** Con qué huesos articula y en qué articulación. */
  articulaciones?: string;
}

export interface FichaArteria extends Base {
  tipo: 'arteria';
  /** De qué arteria nace o de cuál es continuación. */
  origen: string;
  recorrido?: string;
  ramas?: string;
  irriga?: string;
}

export interface FichaVena extends Base {
  tipo: 'vena';
  /** Dónde empieza (red, venas que la forman). */
  origen: string;
  recorrido?: string;
  /** En qué vena desemboca. */
  desemboca: string;
  drena?: string;
}

export interface FichaConectivo extends Base {
  tipo: 'conectivo';
  /** Qué une o dónde está (ligamento, cápsula, bolsa, fascia, cartílago). */
  une?: string;
  funcion: string;
}

export type Ficha = FichaMusculo | FichaNervio | FichaHueso | FichaArteria | FichaVena | FichaConectivo;

/** `nombreEn` de la pieza → su ficha. */
export type Fichas = Record<string, Ficha>;
