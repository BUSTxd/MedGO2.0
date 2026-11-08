// Contrato de datos del laboratorio «Vasculitis de vasos medianos y pequeños y ANCA»
// (clase ACP 11 de Patología). Usa el motor de Lupus tal cual (`src/lib/lupus/motor.ts`):
// la voz es el reloj y cada paso dura lo que su frase. El dibujo de cada paso es una
// lámina propia (`laminas/c<capítulo>.tsx`) que lee sus parámetros `tejido`.

import type { Escenario } from '@/lib/data/lupus/tipos';

export type ParteId =
  | 'pacientes' | 'endotelio' | 'pared' | 'ordenar' | 'mecanismos'
  | 'enfermedades' | 'patologo' | 'glomerulo' | 'brillar' | 'organos';

export type Parte = Escenario & {
  id: ParteId;
  numero: number;
  nombreCorto: string;
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};
