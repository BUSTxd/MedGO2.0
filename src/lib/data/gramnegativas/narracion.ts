// GENERADO por scripts/gramnegativas/subir-narracion.mjs — no editar a mano.
// Voz de Cristian Cornejo (Fish Audio, Drama 3, Voz Lab): un audio por capítulo, de un MP3 por paso.
// `marcas` = segundo en que empieza la frase de cada paso (de las
// pausas del audio); `duracion` = largo del audio (s). Cada paso dura lo que su
// frase: marcas[i + 1] − marcas[i], y el último hasta `duracion`.

import type { Narracion } from '@/lib/data/lupus/tipos';

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/gramnegativas/narracion-`;

const CAPITULOS = [
  { cap: 0, version: 'v1', duracion: 86.95, kb: { webm: 345, mp3: 425 }, marcas: [0, 18.82, 38.86, 68.22] },
  { cap: 1, version: 'v1', duracion: 132.7, kb: { webm: 536, mp3: 648 }, marcas: [0, 19.31, 36.07, 49.16, 65.54, 91.2, 108.65] },
  { cap: 2, version: 'v1', duracion: 165.91, kb: { webm: 667, mp3: 810 }, marcas: [0, 9.69, 28.6, 54.43, 69.18, 85.63, 111.56, 126.48, 143.88] },
  { cap: 3, version: 'v1', duracion: 122.81, kb: { webm: 496, mp3: 600 }, marcas: [0, 22.99, 43.78, 58.15, 72.01, 82.84, 95.31, 105.43] },
  { cap: 4, version: 'v1', duracion: 141.14, kb: { webm: 569, mp3: 690 }, marcas: [0, 20.68, 34.02, 46.29, 65.83, 78.21, 98.92, 113.98] },
  { cap: 5, version: 'v1', duracion: 209.81, kb: { webm: 844, mp3: 1025 }, marcas: [0, 13.29, 31.54, 49.33, 67.23, 78.88, 107.08, 139.17, 156.06, 177.8] },
  { cap: 6, version: 'v1', duracion: 180.31, kb: { webm: 721, mp3: 881 }, marcas: [0, 18.63, 27.1, 38.11, 52.84, 68.55, 86.95, 100.51, 121.15, 144.71, 164.35] },
  { cap: 7, version: 'v1', duracion: 128.24, kb: { webm: 522, mp3: 626 }, marcas: [0, 19.89, 43.66, 60.49, 86.1, 106.14] },
  { cap: 8, version: 'v1', duracion: 343.44, kb: { webm: 1376, mp3: 1677 }, marcas: [0, 10.83, 34.06, 49.64, 71.6, 90.4, 109.34, 129.78, 152.27, 167.1, 186.34, 199.13, 222.34, 244.38, 268.3, 284.49, 299.35, 317.8, 325.85] },
  { cap: 9, version: 'v1', duracion: 234.67, kb: { webm: 941, mp3: 1146 }, marcas: [0, 29.75, 48.45, 73.53, 88.26, 104.2, 119.84, 142.11, 158.92, 175.33, 190.97, 211.37] },
] as const;

export const NARRACION: Narracion[] = CAPITULOS.map((c) => ({
  webm: `${BASE}${c.cap}_${c.version}.webm`,
  mp3: `${BASE}${c.cap}_${c.version}.mp3`,
  marcas: [...c.marcas],
  duracion: c.duracion,
  kb: c.kb,
}));
