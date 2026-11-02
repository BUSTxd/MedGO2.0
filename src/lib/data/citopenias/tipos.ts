// Contrato de datos del laboratorio «Citopenias autoinmunes». Usa el motor de Lupus
// tal cual (`src/lib/lupus/motor.ts`): la voz es el reloj, cada paso dura lo que su
// frase. Aquí no hay actores ni láminas de fondo del motor: el dibujo de cada paso es
// una lámina propia (`laminas/c<capítulo>.tsx`) que lee sus parámetros `tejido`.

import type { Escenario } from '@/lib/data/lupus/tipos';

export type ParteId =
  | 'marca' | 'temperatura' | 'caliente' | 'frias' | 'reconocer-ahai'
  | 'tratar-ahai' | 'marca-pti' | 'destruir-pti' | 'medula-pti' | 'tratar-pti';

export type Parte = Escenario & {
  id: ParteId;
  numero: number;
  nombreCorto: string;
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};
