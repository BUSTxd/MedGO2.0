// GENERADO por scripts/citopenias/subir-narracion.mjs — no editar a mano.
// Voz de Cristian Cornejo (ElevenLabs v4): un audio por capítulo.
// `marcas` = segundo en que empieza la frase de cada paso (de las
// pausas del audio); `duracion` = largo del audio (s). Cada paso dura lo que su
// frase: marcas[i + 1] − marcas[i], y el último hasta `duracion`.

import type { Narracion } from '@/lib/data/lupus/tipos';

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/citopenias/narracion-`;

const CAPITULOS = [
  { cap: 0, version: 'v1', duracion: 56.81, kb: { webm: 241, mp3: 333 }, marcas: [0, 15, 27.12, 42.27] },
  { cap: 1, version: 'v1', duracion: 76.51, kb: { webm: 330, mp3: 448 }, marcas: [0, 14.61, 31.2, 46.93, 64] },
  { cap: 2, version: 'v1', duracion: 123.41, kb: { webm: 522, mp3: 723 }, marcas: [0, 16.49, 31.3, 47.32, 62.42, 77.44, 92.16, 107.76] },
  { cap: 3, version: 'v1', duracion: 134.41, kb: { webm: 574, mp3: 788 }, marcas: [0, 18.81, 33.21, 49.98, 69.13, 84.96, 102.24, 118.08] },
  { cap: 4, version: 'v1', duracion: 115.21, kb: { webm: 502, mp3: 675 }, marcas: [0, 16.85, 32.46, 48.67, 64.75, 82.15, 99.75] },
  { cap: 5, version: 'v1', duracion: 99.91, kb: { webm: 428, mp3: 586 }, marcas: [0, 16.46, 33.5, 50.53, 67.16, 84.52] },
  { cap: 6, version: 'v1', duracion: 99.81, kb: { webm: 434, mp3: 585 }, marcas: [0, 17.86, 35.52, 50.76, 66.35, 84.47] },
  { cap: 7, version: 'v1', duracion: 103.31, kb: { webm: 444, mp3: 605 }, marcas: [0, 16.93, 35.6, 52.3, 69.34, 88.17] },
  { cap: 8, version: 'v1', duracion: 81.31, kb: { webm: 356, mp3: 476 }, marcas: [0, 16.57, 32.46, 49.09, 66.05] },
  { cap: 9, version: 'v1', duracion: 103.41, kb: { webm: 440, mp3: 606 }, marcas: [0, 18.52, 36.31, 53.92, 69.25, 85.55] },
] as const;

export const NARRACION: Narracion[] = CAPITULOS.map((c) => ({
  webm: `${BASE}${c.cap}_${c.version}.webm`,
  mp3: `${BASE}${c.cap}_${c.version}.mp3`,
  marcas: [...c.marcas],
  duracion: c.duracion,
  kb: c.kb,
}));
