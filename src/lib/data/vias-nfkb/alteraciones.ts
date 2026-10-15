// Alteraciones del linfoma de Hodgkin clásico de la figura de Küppers, para
// el inventario del laboratorio (guion §1.6). `paso` apunta al paso de la vía
// donde se anima.

import type { ViaId } from './tipos';

export type Alteracion = {
  gen: string;
  tipo: 'perdida' | 'ganancia' | 'infeccion';
  descripcion: string;
  pct: string;
  consecuencia: string;
  via: ViaId;
  /** Ficha de la proteína afectada. */
  ficha: string;
  paso: string;
};

export const ALTERACIONES: Alteracion[] = [
  { gen: 'TNFAIP3 (A20)', tipo: 'perdida', descripcion: 'Mutación o deleción', pct: '40 %', consecuencia: 'Las cadenas K63 no se quitan: el complejo IKK sigue activo. Casi excluyente con el VEB.', via: 'clasica', ficha: 'a20', paso: 'cla-h2' },
  { gen: 'CYLD', tipo: 'perdida', descripcion: 'Mutación', pct: 'rara', consecuencia: 'Falla el segundo freno de las cadenas K63.', via: 'clasica', ficha: 'cyld', paso: 'cla-h3' },
  { gen: 'NFKBIA / NFKBIE', tipo: 'perdida', descripcion: 'Mutación (IκB truncado)', pct: '10–20 %', consecuencia: 'p50/p65 queda libre aunque IKK no actúe.', via: 'clasica', ficha: 'ikba', paso: 'cla-h4' },
  { gen: 'REL', tipo: 'ganancia', descripcion: 'Amplificación (2p16)', pct: '40 %', consecuencia: 'Más c-Rel: más dímeros activos en el núcleo.', via: 'clasica', ficha: 'crel', paso: 'cla-h5' },
  { gen: 'BCL3', tipo: 'ganancia', descripcion: 'Ganancias o translocaciones', pct: 'rara', consecuencia: 'Los homodímeros p50/p50 pasan a activar la transcripción.', via: 'clasica', ficha: 'bcl3', paso: 'cla-h6' },
  { gen: 'VEB · LMP1', tipo: 'infeccion', descripcion: 'Infección por el virus de Epstein-Barr', pct: '40 %', consecuencia: 'Señal sin ligando hacia las dos vías NF-κB.', via: 'clasica', ficha: 'lmp1', paso: 'cla-h7' },
  { gen: 'NIK (MAP3K14)', tipo: 'ganancia', descripcion: 'Ganancias', pct: '25 %', consecuencia: 'Tanta NIK que TRAF3–cIAP no da abasto.', via: 'alternativa', ficha: 'nik', paso: 'alt-h1' },
  { gen: 'TRAF3', tipo: 'perdida', descripcion: 'Mutación', pct: 'rara', consecuencia: 'NIK deja de destruirse.', via: 'alternativa', ficha: 'traf3', paso: 'alt-h2' },
  { gen: 'JAK2 (9p24.1)', tipo: 'ganancia', descripcion: 'Ganancias (translocaciones raras)', pct: '30 %', consecuencia: 'Más JAK2 y, en el mismo amplicón, más PD-L1/PD-L2.', via: 'jakstat', ficha: 'jak', paso: 'jak-h2' },
  { gen: 'SOCS1', tipo: 'perdida', descripcion: 'Mutación', pct: '40 %', consecuencia: 'JAK sin freno: STAT siempre fosforilado.', via: 'jakstat', ficha: 'socs1', paso: 'jak-h3' },
];
