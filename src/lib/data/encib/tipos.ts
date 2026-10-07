export type AreaEncib = 'ANA' | 'EMB' | 'HIS' | 'BIO' | 'FIS' | 'PAT' | 'FAR' | 'MIC';
export type Dificultad = 'menor' | 'mediana' | 'mayor';
export type Carga = 'memoria' | 'aplicacion' | 'integracion';

export interface TemaEncib {
  /** `ÁREA-subárea.tema`, p. ej. `FIS-4.5`. */
  codigo: string;
  nombre: string;
}

export interface SubareaEncib {
  /** `ÁREA-subárea`, p. ej. `FIS-4`. */
  codigo: string;
  nombre: string;
  temas: TemaEncib[];
}

/**
 * Una pregunta de un cuadernillo oficial, ya clasificada. Sin enunciado ni
 * alternativas: solo lo que hace falta para el análisis.
 */
export interface PreguntaEncib {
  anio: 2021 | 2024 | 2025;
  n: number;
  codigo: string;
  /** Otros temas que la pregunta también toca. */
  secundarios: string[];
  /** Estimación experta: ASPEFAM no publica el acierto por pregunta. */
  dificultad: Dificultad;
  carga: Carga;
  formato: 'caso' | 'problema' | 'directa';
  /** La viñeta no aporta nada: se responde igual sin leerla. */
  decorativo: boolean;
  patron: string;
  /** Qué se evalúa en concreto dentro del tema. */
  concepto: string;
}
