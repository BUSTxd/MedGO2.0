// GENERADO por scripts/lupus/subir-narracion.mjs — no editar a mano.
// Voz de Cristian Cornejo (ElevenLabs v4): un audio por capítulo, unido de los
// bloques A/B. `marcas` = segundo en que empieza la frase de cada paso (de las
// pausas del audio); `duracion` = largo del audio (s). Cada paso dura lo que su
// frase: marcas[i + 1] − marcas[i], y el último hasta `duracion`.

import type { Narracion } from './tipos';

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/lupus/narracion-`;

const CAPITULOS = [
  { cap: 0, version: 'v1', duracion: 167.21, kb: { webm: 726, mp3: 980 }, marcas: [0, 31.82, 65.78, 94.54, 118.27, 145.85] },
  { cap: 1, version: 'v1', duracion: 225.71, kb: { webm: 970, mp3: 1323 }, marcas: [0, 24.07, 55.32, 92.98, 125.47, 151.92, 175.13, 195.75] },
  { cap: 2, version: 'v1', duracion: 168.11, kb: { webm: 728, mp3: 985 }, marcas: [0, 20.46, 50.02, 73.91, 97.17, 123.54, 147.89] },
  { cap: 3, version: 'v1', duracion: 211.01, kb: { webm: 928, mp3: 1236 }, marcas: [0, 28.31, 57.76, 84.16, 109.27, 134.28, 162.99, 183.51] },
  { cap: 4, version: 'v1', duracion: 228.81, kb: { webm: 1025, mp3: 1341 }, marcas: [0, 21.86, 48.79, 81.91, 114.57, 141.14, 164.09, 184.96, 207.68] },
  { cap: 5, version: 'v1', duracion: 186.11, kb: { webm: 792, mp3: 1091 }, marcas: [0, 23.33, 47.08, 71.31, 97, 120.16, 141.36, 163] },
  { cap: 6, version: 'v1', duracion: 179.41, kb: { webm: 788, mp3: 1052 }, marcas: [0, 20.01, 46.71, 79.55, 102.47, 128.24, 153.62] },
  { cap: 7, version: 'v1', duracion: 207.21, kb: { webm: 877, mp3: 1214 }, marcas: [0, 17.82, 51.95, 70.21, 97.49, 113.44, 139.42, 168.29, 185.1] },
  { cap: 8, version: 'v1', duracion: 136.81, kb: { webm: 585, mp3: 802 }, marcas: [0, 28.17, 50.86, 74.64, 95.25, 119.6] },
  { cap: 9, version: 'v1', duracion: 252.51, kb: { webm: 1093, mp3: 1480 }, marcas: [0, 23.93, 57.6, 81.82, 104.55, 131.89, 154.91, 178.71, 198.68, 218.27] },
  { cap: 10, version: 'v1', duracion: 225.91, kb: { webm: 991, mp3: 1324 }, marcas: [0, 20.29, 41.54, 70.1, 98.41, 118.79, 152.18, 183.99] },
  { cap: 11, version: 'v1', duracion: 274.81, kb: { webm: 1203, mp3: 1610 }, marcas: [0, 29.26, 57.33, 84.29, 104.67, 142.5, 173.05, 202.64, 243.19] },
] as const;

export const NARRACION: Narracion[] = CAPITULOS.map((c) => ({
  webm: `${BASE}${c.cap}_${c.version}.webm`,
  mp3: `${BASE}${c.cap}_${c.version}.mp3`,
  marcas: [...c.marcas],
  duracion: c.duracion,
  kb: c.kb,
}));
