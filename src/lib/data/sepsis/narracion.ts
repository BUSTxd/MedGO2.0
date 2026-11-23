// GENERADO por scripts/sepsis/subir-narracion.mjs — no editar a mano.
// Voz de Cristian Cornejo (Fish Audio, Drama 3, Voz Lab): un audio por capítulo, de un MP3 por paso.
// `marcas` = segundo en que empieza la frase de cada paso (de las
// pausas del audio); `duracion` = largo del audio (s). Cada paso dura lo que su
// frase: marcas[i + 1] − marcas[i], y el último hasta `duracion`.

import type { Narracion } from '@/lib/data/lupus/tipos';

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/sepsis/narracion-`;

const CAPITULOS = [
  { cap: 0, version: 'v1', duracion: 138.35, kb: { webm: 547, mp3: 676 }, marcas: [0, 32.77, 66.2, 92.69, 113.46] },
  { cap: 1, version: 'v1', duracion: 184.68, kb: { webm: 736, mp3: 902 }, marcas: [0, 27.41, 51.63, 78.5, 102.63, 132.56, 157.47] },
  { cap: 2, version: 'v1', duracion: 174.53, kb: { webm: 693, mp3: 853 }, marcas: [0, 22.75, 46.99, 71.96, 99.4, 124.61, 149.72] },
  { cap: 3, version: 'v1', duracion: 157.23, kb: { webm: 625, mp3: 768 }, marcas: [0, 29.38, 58.13, 83.39, 106.39, 132.61] },
  { cap: 4, version: 'v1', duracion: 217.21, kb: { webm: 869, mp3: 1061 }, marcas: [0, 26.64, 54.85, 81.79, 107.76, 132.18, 160.85, 192.56] },
  { cap: 5, version: 'v1', duracion: 226.67, kb: { webm: 890, mp3: 1107 }, marcas: [0, 24.1, 51.9, 75.06, 100.47, 128.02, 150.92, 175.82, 203.25] },
  { cap: 6, version: 'v1', duracion: 203.61, kb: { webm: 801, mp3: 994 }, marcas: [0, 27.49, 50.69, 72.04, 101.16, 126.18, 152.32, 179.79] },
  { cap: 7, version: 'v1', duracion: 142.98, kb: { webm: 567, mp3: 699 }, marcas: [0, 23.27, 50.8, 75.2, 98.36, 119.33] },
  { cap: 8, version: 'v1', duracion: 181.01, kb: { webm: 719, mp3: 884 }, marcas: [0, 24.85, 50.04, 73.39, 96.36, 118.74, 150.84] },
  { cap: 9, version: 'v1', duracion: 127.14, kb: { webm: 504, mp3: 621 }, marcas: [0, 25.51, 44.45, 65.2, 82.84, 101.98] },
  { cap: 10, version: 'v1', duracion: 125.41, kb: { webm: 502, mp3: 613 }, marcas: [0, 21.01, 47.96, 65.57, 83.91, 103.93] },
  { cap: 11, version: 'v1', duracion: 178.53, kb: { webm: 704, mp3: 872 }, marcas: [0, 20.73, 43.62, 63.14, 86.76, 110.58, 132.15, 155.74] },
  { cap: 12, version: 'v1', duracion: 191.78, kb: { webm: 758, mp3: 937 }, marcas: [0, 18.61, 44.57, 71.38, 92.46, 119.24, 148.94, 170.71] },
  { cap: 13, version: 'v1', duracion: 160.3, kb: { webm: 631, mp3: 783 }, marcas: [0, 24.48, 48.71, 69.43, 92.76, 115.1, 139.77] },
  { cap: 14, version: 'v1', duracion: 125.44, kb: { webm: 492, mp3: 613 }, marcas: [0, 22.69, 43.34, 67.36, 87.17, 107.02] },
  { cap: 15, version: 'v1', duracion: 222.32, kb: { webm: 872, mp3: 1086 }, marcas: [0, 28.29, 52.02, 73.61, 95.87, 123.93, 153.75, 174.02, 202.84] },
  { cap: 16, version: 'v1', duracion: 210.11, kb: { webm: 832, mp3: 1026 }, marcas: [0, 24.66, 49.57, 73.79, 99.87, 118.68, 142.66, 178.18] },
] as const;

export const NARRACION: Narracion[] = CAPITULOS.map((c) => ({
  webm: `${BASE}${c.cap}_${c.version}.webm`,
  mp3: `${BASE}${c.cap}_${c.version}.mp3`,
  marcas: [...c.marcas],
  duracion: c.duracion,
  kb: c.kb,
}));
