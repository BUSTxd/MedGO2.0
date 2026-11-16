// Contrato de datos del laboratorio «Metabolismo de la bilirrubina» (Digestivo, TBL 2).
// Usa el motor de Lupus tal cual (`src/lib/lupus/motor.ts`): la voz es el reloj y cada
// paso dura lo que su frase. El dibujo de cada paso es una lámina propia
// (`laminas/c<capítulo>.tsx`) que lee sus parámetros `tejido`.

import type { Escenario } from '@/lib/data/lupus/tipos';

export type ParteId =
  | 'amarillo' | 'hemo' | 'molecula' | 'entrada' | 'conjugacion' | 'salida'
  | 'intestino' | 'laboratorio' | 'noconjugada' | 'kernicterus' | 'conjugada' | 'calculos';

/** Una celda: texto o lista. */
export type CeldaTabla = string | string[];

/** La tabla resumen del lab (como la de Citopenias): antes, dentro y después del hígado,
 *  y debajo cada causa con su lugar (`columna` colorea el «dónde»: 0 antes, 1 dentro, 2 después). */
export type TablaLab = {
  titulo: string;
  comparacion: {
    titulo: string;
    columnas: [string, string, string];
    filas: { nombre: string; v: [CeldaTabla, CeldaTabla, CeldaTabla]; clave?: string }[];
  };
  claves: {
    titulo: string;
    filas: { nombre: string; donde: string; columna: 0 | 1 | 2; texto: string }[];
  };
};

export type Parte = Escenario & {
  id: ParteId;
  numero: number;
  nombreCorto: string;
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};
