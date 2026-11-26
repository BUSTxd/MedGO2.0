// Contrato de datos del laboratorio «Hepatitis virales» (clase ACP15 de Patología). Usa el motor de
// Lupus tal cual (`src/lib/lupus/motor.ts`): la voz es el reloj y cada paso dura lo que su
// frase. El dibujo de cada paso es una lámina propia (`laminas/c<capítulo>.tsx`) que lee sus
// parámetros `tejido`. Guion: docs/hepatitis-virales/GUION.md.

import type { Escenario } from '@/lib/data/lupus/tipos';

export type ParteId =
  | 'pacientes' | 'cinco' | 'histologia' | 'fisiologia' | 'patrones' | 'laboratorio' | 'ae'
  | 'vhb-particula' | 'vhb-ciclo' | 'vhb-inmuno' | 'vhb-sero' | 'vhb-fases' | 'brote' | 'cancer'
  | 'carcinoma' | 'vhb-tratamiento' | 'vhb-prevenir' | 'delta' | 'vhc-ciclo' | 'vhc-evasion'
  | 'vhc-caso' | 'crioglobulinas' | 'vhc-tratamiento';

export type Parte = Escenario & {
  id: ParteId;
  numero: number;
  nombreCorto: string;
  tipo: string;
  lugar: string;
  color: string;
  pregunta: string;
};
