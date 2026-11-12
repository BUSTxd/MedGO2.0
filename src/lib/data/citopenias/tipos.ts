// Contrato de datos del laboratorio «Citopenias autoinmunes». Usa el motor de Lupus
// tal cual (`src/lib/lupus/motor.ts`): la voz es el reloj, cada paso dura lo que su
// frase. Aquí no hay actores ni láminas de fondo del motor: el dibujo de cada paso es
// una lámina propia (`laminas/c<capítulo>.tsx`) que lee sus parámetros `tejido`.

import type { Escenario } from '@/lib/data/lupus/tipos';

export type ParteId =
  | 'marca' | 'temperatura' | 'caliente' | 'frias' | 'reconocer-ahai'
  | 'tratar-ahai' | 'marca-pti' | 'destruir-pti' | 'medula-pti' | 'tratar-pti';

/** Un lado de la tabla del laboratorio: una frase o una lista corta. */
export type LadoTabla = string | string[];

/** La tabla del laboratorio (botón «Tabla»): una comparación de dos columnas y unas claves. */
export type TablaLab = {
  titulo: string;
  comparacion: {
    titulo: string;
    columnas: [string, string];
    filas: { nombre: string; a: LadoTabla; b: LadoTabla; clave?: string }[];
  };
  /** `flujo`: una cadena de causas, en orden. */
  claves: {
    titulo: string;
    filas: { nombre: string; donde: string; columna: 0 | 1; texto?: string; flujo?: string[] }[];
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
