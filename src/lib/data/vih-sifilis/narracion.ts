// GENERADO por scripts/vih-sifilis/subir-narracion.mjs — no editar a mano.
// Voz de Cristian Cornejo (Fish Audio, Drama 3, Voz Lab): un audio por capítulo, de un MP3 por paso.
// `marcas` = segundo en que empieza la frase de cada paso (de las
// pausas del audio); `duracion` = largo del audio (s). Cada paso dura lo que su
// frase: marcas[i + 1] − marcas[i], y el último hasta `duracion`.

import type { Narracion } from '@/lib/data/lupus/tipos';

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/vih-sifilis/narracion-`;

const CAPITULOS = [
  { cap: 0, version: 'v1', duracion: 185.07, kb: { webm: 748, mp3: 904 }, marcas: [0, 35.05, 66.32, 98.32, 123.33, 154.03] },
  { cap: 1, version: 'v1', duracion: 159.12, kb: { webm: 633, mp3: 777 }, marcas: [0, 26.5, 52.46, 82.91, 108.33, 132.23] },
  { cap: 2, version: 'v1', duracion: 159.21, kb: { webm: 638, mp3: 778 }, marcas: [0, 24.32, 45.95, 68.82, 99.7, 131.56] },
  { cap: 3, version: 'v1', duracion: 228.63, kb: { webm: 918, mp3: 1117 }, marcas: [0, 33.31, 59.99, 85.69, 112.31, 144.49, 169.92, 191.98] },
  { cap: 4, version: 'v1', duracion: 206.53, kb: { webm: 830, mp3: 1009 }, marcas: [0, 25.35, 48.12, 82.48, 117.95, 148.76, 179.33] },
  { cap: 5, version: 'v1', duracion: 205.66, kb: { webm: 823, mp3: 1005 }, marcas: [0, 31.74, 58.09, 86.98, 108.48, 135.32, 172.03] },
  { cap: 6, version: 'v1', duracion: 202.4, kb: { webm: 807, mp3: 989 }, marcas: [0, 27.39, 46.14, 75.09, 95.09, 114.35, 139.13, 157.77, 173.65] },
  { cap: 7, version: 'v1', duracion: 253.57, kb: { webm: 1018, mp3: 1239 }, marcas: [0, 27.02, 60.58, 91.04, 116.16, 139.7, 175.07, 198.85, 228.23] },
  { cap: 8, version: 'v1', duracion: 244.19, kb: { webm: 978, mp3: 1193 }, marcas: [0, 26.41, 59.21, 77.82, 103.28, 125.35, 151.07, 183.29, 214.67] },
  { cap: 9, version: 'v1', duracion: 164.77, kb: { webm: 656, mp3: 805 }, marcas: [0, 26.29, 52.22, 85.69, 109.18, 138.74] },
  { cap: 10, version: 'v1', duracion: 218.84, kb: { webm: 874, mp3: 1069 }, marcas: [0, 30.28, 61.07, 81.28, 117.68, 142.48, 168.84, 196.93] },
  { cap: 11, version: 'v1', duracion: 281.95, kb: { webm: 1129, mp3: 1377 }, marcas: [0, 35.09, 64, 96.05, 127.68, 160.88, 192.09, 220.38, 248.52] },
  { cap: 12, version: 'v1', duracion: 301.97, kb: { webm: 1212, mp3: 1475 }, marcas: [0, 35.72, 68.33, 104.45, 137.91, 166.33, 204.2, 237.77, 266.05] },
  { cap: 13, version: 'v1', duracion: 207.34, kb: { webm: 832, mp3: 1013 }, marcas: [0, 31.39, 64.28, 88.76, 115.68, 148.53, 173.41] },
  { cap: 14, version: 'v1', duracion: 195.91, kb: { webm: 779, mp3: 957 }, marcas: [0, 30.14, 55.81, 79.97, 118.89, 145.48, 167.66] },
  { cap: 15, version: 'v1', duracion: 156.2, kb: { webm: 623, mp3: 763 }, marcas: [0, 29.6, 55.19, 80.03, 109.76, 133.99] },
  { cap: 16, version: 'v1', duracion: 163.51, kb: { webm: 651, mp3: 798 }, marcas: [0, 29.05, 51.1, 71.79, 94.47, 116.01, 140.44] },
  { cap: 17, version: 'v1', duracion: 167.49, kb: { webm: 671, mp3: 818 }, marcas: [0, 30.09, 58.82, 88.56, 112.7, 142.68] },
  { cap: 18, version: 'v1', duracion: 252.01, kb: { webm: 1004, mp3: 1231 }, marcas: [0, 32.26, 67.63, 98, 126.79, 155.98, 185.07, 219.46] },
  { cap: 19, version: 'v1', duracion: 191.1, kb: { webm: 766, mp3: 934 }, marcas: [0, 32.39, 65.4, 97.21, 125.9, 158.69] },
  { cap: 20, version: 'v1', duracion: 198.88, kb: { webm: 799, mp3: 971 }, marcas: [0, 34.93, 68.04, 96.61, 130.71, 166.44] },
] as const;

export const NARRACION: Narracion[] = CAPITULOS.map((c) => ({
  webm: `${BASE}${c.cap}_${c.version}.webm`,
  mp3: `${BASE}${c.cap}_${c.version}.mp3`,
  marcas: [...c.marcas],
  duracion: c.duracion,
  kb: c.kb,
}));
