// GENERADO por scripts/bilirrubina/subir-narracion.mjs — no editar a mano.
// Voz de Cristian Cornejo (Fish Audio, Drama 3, Voz Lab): un audio por capítulo, de un MP3 por paso.
// `marcas` = segundo en que empieza la frase de cada paso (de las
// pausas del audio); `duracion` = largo del audio (s). Cada paso dura lo que su
// frase: marcas[i + 1] − marcas[i], y el último hasta `duracion`.

import type { Narracion } from '@/lib/data/lupus/tipos';

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/bilirrubina/narracion-`;

const CAPITULOS = [
  { cap: 0, version: 'v1', duracion: 95.57, kb: { webm: 384, mp3: 467 }, marcas: [0, 22.07, 37.93, 60.05, 82.21] },
  { cap: 1, version: 'v1', duracion: 170.52, kb: { webm: 678, mp3: 833 }, marcas: [0, 18.07, 37.51, 57.64, 79.04, 103.12, 123.69, 142.05] },
  { cap: 2, version: 'v1', duracion: 134.69, kb: { webm: 539, mp3: 658 }, marcas: [0, 17.63, 34.31, 60.09, 80.99, 95.87, 121.9] },
  { cap: 3, version: 'v1', duracion: 134.89, kb: { webm: 540, mp3: 659 }, marcas: [0, 19.71, 41.82, 63.42, 76.17, 99.25, 119.07] },
  { cap: 4, version: 'v1', duracion: 128.15, kb: { webm: 502, mp3: 626 }, marcas: [0, 16.55, 31.76, 49.04, 69.11, 93.19, 112.55] },
  { cap: 5, version: 'v1', duracion: 109.76, kb: { webm: 438, mp3: 536 }, marcas: [0, 22.42, 38.59, 51.74, 69.48, 89.03] },
  { cap: 6, version: 'v1', duracion: 149.92, kb: { webm: 596, mp3: 732 }, marcas: [0, 18.27, 30.82, 50.05, 64.92, 80.77, 96.21, 111.31, 127.22] },
  { cap: 7, version: 'v1', duracion: 145.28, kb: { webm: 573, mp3: 710 }, marcas: [0, 19.14, 32.8, 53.83, 64.98, 87.83, 102.97, 124.99] },
  { cap: 8, version: 'v1', duracion: 189.11, kb: { webm: 756, mp3: 924 }, marcas: [0, 17.81, 41.64, 57.22, 81.28, 105.86, 122.75, 139.79, 168.79] },
  { cap: 9, version: 'v1', duracion: 167.65, kb: { webm: 670, mp3: 819 }, marcas: [0, 16.12, 34.3, 50.64, 68.04, 97.98, 126.09, 145.79] },
  { cap: 10, version: 'v1', duracion: 177.83, kb: { webm: 703, mp3: 869 }, marcas: [0, 18.76, 38.16, 56.41, 69.87, 84.95, 101.75, 116.64, 131.62, 153.08] },
  { cap: 11, version: 'v1', duracion: 135.61, kb: { webm: 531, mp3: 662 }, marcas: [0, 17.15, 33.07, 48.51, 59.6, 78.36, 93.85, 112.35] },
] as const;

export const NARRACION: Narracion[] = CAPITULOS.map((c) => ({
  webm: `${BASE}${c.cap}_${c.version}.webm`,
  mp3: `${BASE}${c.cap}_${c.version}.mp3`,
  marcas: [...c.marcas],
  duracion: c.duracion,
  kb: c.kb,
}));
