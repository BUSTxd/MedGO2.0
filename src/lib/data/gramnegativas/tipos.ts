// Contrato de datos del laboratorio «Infecciones bacterianas por gramnegativas»
// (clase AI18 de Patología). Usa el motor de Lupus tal cual (`src/lib/lupus/motor.ts`):
// la voz es el reloj y cada paso dura lo que su frase. El dibujo de cada paso es una
// lámina propia (`laminas/c<capítulo>.tsx`) que lee sus parámetros `tejido`.

import type { Escenario } from '@/lib/data/lupus/tipos';

export type ParteId =
  | 'pacientes' | 'quien' | 'barrera' | 'uniones' | 'invasion'
  | 'toxinas' | 'sepsis' | 'reparar' | 'especies' | 'resistencia';

export type Parte = Escenario & {
  id: ParteId;
  numero: number;
  nombreCorto: string;
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};
