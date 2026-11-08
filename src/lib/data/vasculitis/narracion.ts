// GENERADO por scripts/vasculitis/subir-narracion.mjs — no editar a mano.
// Voz de Cristian Cornejo (ElevenLabs v4, capítulos 0-5A; Fish Audio, el resto): un audio por capítulo.
// `marcas` = segundo en que empieza la frase de cada paso (de las
// pausas del audio); `duracion` = largo del audio (s). Cada paso dura lo que su
// frase: marcas[i + 1] − marcas[i], y el último hasta `duracion`.

import type { Narracion } from '@/lib/data/lupus/tipos';

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/vasculitis/narracion-`;

const CAPITULOS = [
  { cap: 0, version: 'v1', duracion: 57.31, kb: { webm: 232, mp3: 280 }, marcas: [0, 14.43, 27.21, 44.85] },
  { cap: 1, version: 'v1', duracion: 148.21, kb: { webm: 602, mp3: 724 }, marcas: [0, 17.04, 34.7, 54.23, 75.73, 92.29, 112.87, 131.22] },
  { cap: 2, version: 'v1', duracion: 161.11, kb: { webm: 656, mp3: 787 }, marcas: [0, 18.18, 34.98, 52.73, 70.78, 87.09, 104.96, 124.57, 141.87] },
  { cap: 3, version: 'v1', duracion: 127.31, kb: { webm: 517, mp3: 622 }, marcas: [0, 16.48, 36.78, 51.86, 72.21, 92.85, 114.32] },
  { cap: 4, version: 'v1', duracion: 341.21, kb: { webm: 1394, mp3: 1666 }, marcas: [0, 18.53, 41.01, 60.43, 75.95, 93.72, 118.84, 138.44, 158.98, 173.41, 197.37, 219.39, 240.62, 261.98, 280.66, 302.12, 320.58] },
  { cap: 5, version: 'v1', duracion: 354.01, kb: { webm: 1427, mp3: 1729 }, marcas: [0, 17.96, 40.56, 58.43, 89.01, 109.52, 139.11, 165.19, 191.13, 214.1, 239.27, 264.38, 287.34, 307.52, 329.06] },
  { cap: 6, version: 'v1', duracion: 178.81, kb: { webm: 718, mp3: 874 }, marcas: [0, 17.43, 37.9, 59.51, 77.35, 103.18, 125.37, 142.34, 156.15] },
  { cap: 7, version: 'v1', duracion: 179.02, kb: { webm: 719, mp3: 874 }, marcas: [0, 19.42, 40.93, 55.98, 73.97, 92.43, 110.59, 130.06, 156.85] },
  { cap: 8, version: 'v1', duracion: 156.8, kb: { webm: 627, mp3: 766 }, marcas: [0, 22.97, 49.36, 73.89, 97.18, 118.65, 138.2] },
  { cap: 9, version: 'v1', duracion: 257.14, kb: { webm: 1026, mp3: 1256 }, marcas: [0, 24.55, 51.89, 76.84, 101.67, 124.06, 152.89, 179.43, 203.73, 226.62] },
] as const;

export const NARRACION: Narracion[] = CAPITULOS.map((c) => ({
  webm: `${BASE}${c.cap}_${c.version}.webm`,
  mp3: `${BASE}${c.cap}_${c.version}.mp3`,
  marcas: [...c.marcas],
  duracion: c.duracion,
  kb: c.kb,
}));
