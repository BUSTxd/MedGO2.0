// Contrato de datos del laboratorio «Sepsis» (clase ACP13 de Patología). Usa el motor de
// Lupus tal cual (`src/lib/lupus/motor.ts`): la voz es el reloj y cada paso dura lo que su
// frase. El dibujo de cada paso es una lámina propia (`laminas/c<capítulo>.tsx`) que lee sus
// parámetros `tejido`. Guion: docs/sepsis/GUION.md.

import type { Escenario } from '@/lib/data/lupus/tipos';

export type ParteId =
  | 'pacientes' | 'definicion' | 'huesped' | 'hemodinamia' | 'reconocer' | 'senal' | 'mensajeros'
  | 'endotelio' | 'coagulacion' | 'enciende' | 'inmunotrombosis' | 'cid' | 'choque' | 'microcirculacion'
  | 'organos' | 'pulmon' | 'inmunoparalisis';

export type Parte = Escenario & {
  id: ParteId;
  numero: number;
  nombreCorto: string;
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};
