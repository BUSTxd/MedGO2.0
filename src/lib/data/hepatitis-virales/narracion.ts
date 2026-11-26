// GENERADO por scripts/hepatitis-virales/subir-narracion.mjs — no editar a mano.
// Voz de Cristian Cornejo (Fish Audio, Drama 3, Voz Lab): un audio por capítulo, de un MP3 por paso.
// `marcas` = segundo en que empieza la frase de cada paso (de las
// pausas del audio); `duracion` = largo del audio (s). Cada paso dura lo que su
// frase: marcas[i + 1] − marcas[i], y el último hasta `duracion`.

import type { Narracion } from '@/lib/data/lupus/tipos';

const BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/laboratorio-img/hepatitis-virales/narracion-`;

const CAPITULOS = [
  { cap: 0, version: 'v1', duracion: 171.05, kb: { webm: 680, mp3: 836 }, marcas: [0, 30.64, 62.31, 93.29, 122.05, 146.49] },
  { cap: 1, version: 'v1', duracion: 142.81, kb: { webm: 576, mp3: 697 }, marcas: [0, 27.07, 49.41, 73.57, 92.92, 120.75] },
  { cap: 2, version: 'v1', duracion: 160.06, kb: { webm: 635, mp3: 782 }, marcas: [0, 22.16, 47.24, 69.67, 92.64, 114.52, 136.44] },
  { cap: 3, version: 'v1', duracion: 191.31, kb: { webm: 768, mp3: 934 }, marcas: [0, 21.07, 46.74, 74.62, 93.4, 116.83, 138.71, 167.91] },
  { cap: 4, version: 'v1', duracion: 186.67, kb: { webm: 740, mp3: 912 }, marcas: [0, 25.71, 48.08, 71.2, 94.41, 114.42, 136.92, 162.5] },
  { cap: 5, version: 'v1', duracion: 187.31, kb: { webm: 740, mp3: 915 }, marcas: [0, 23.42, 41.78, 64.57, 93.83, 116.64, 142.09, 165.13] },
  { cap: 6, version: 'v1', duracion: 169.51, kb: { webm: 674, mp3: 828 }, marcas: [0, 20.61, 41.54, 61.3, 80.5, 100.11, 123.87, 144.73] },
  { cap: 7, version: 'v1', duracion: 134.8, kb: { webm: 537, mp3: 659 }, marcas: [0, 23.17, 45.46, 71.04, 96.74, 115.94] },
  { cap: 8, version: 'v1', duracion: 181.25, kb: { webm: 721, mp3: 885 }, marcas: [0, 22.93, 43.13, 62.89, 85.38, 103.46, 129.59, 154.96] },
  { cap: 9, version: 'v1', duracion: 184.46, kb: { webm: 731, mp3: 901 }, marcas: [0, 22.01, 46.82, 68.31, 93.05, 112.54, 137.58, 162.5] },
  { cap: 10, version: 'v1', duracion: 187.39, kb: { webm: 736, mp3: 915 }, marcas: [0, 24.34, 50.01, 73.07, 96.63, 119.09, 142.81, 165.54] },
  { cap: 11, version: 'v1', duracion: 163.1, kb: { webm: 649, mp3: 797 }, marcas: [0, 31.02, 51.99, 75.57, 94.18, 117.18, 141.84] },
  { cap: 12, version: 'v1', duracion: 163.47, kb: { webm: 652, mp3: 799 }, marcas: [0, 30.39, 54.8, 80.03, 97.76, 117.93, 139.43] },
  { cap: 13, version: 'v1', duracion: 161.62, kb: { webm: 644, mp3: 789 }, marcas: [0, 19.34, 44.75, 67.7, 91.59, 117.39, 139.97] },
  { cap: 14, version: 'v1', duracion: 126.48, kb: { webm: 504, mp3: 618 }, marcas: [0, 23.87, 43.7, 62.78, 85.77, 105.26] },
  { cap: 15, version: 'v1', duracion: 201.57, kb: { webm: 806, mp3: 985 }, marcas: [0, 21.45, 44.69, 67.62, 95.63, 121.38, 145.34, 168.54] },
  { cap: 16, version: 'v1', duracion: 159.93, kb: { webm: 641, mp3: 781 }, marcas: [0, 24.79, 56.61, 79.87, 108.89, 131.22] },
  { cap: 17, version: 'v1', duracion: 167.48, kb: { webm: 673, mp3: 818 }, marcas: [0, 23.32, 46.65, 71.24, 92.67, 110.55, 136.76] },
  { cap: 18, version: 'v1', duracion: 188.41, kb: { webm: 748, mp3: 920 }, marcas: [0, 25.16, 46.87, 69.74, 93.28, 124.29, 147.24, 164.68] },
  { cap: 19, version: 'v1', duracion: 164.59, kb: { webm: 657, mp3: 804 }, marcas: [0, 32.13, 55.87, 71.73, 100.55, 114.53, 137.84] },
  { cap: 20, version: 'v1', duracion: 205.45, kb: { webm: 814, mp3: 1004 }, marcas: [0, 25.94, 49.02, 78.55, 104.36, 128, 153.83, 176.68] },
  { cap: 21, version: 'v1', duracion: 155.45, kb: { webm: 617, mp3: 759 }, marcas: [0, 24.38, 47.35, 73.62, 97.85, 120.73, 138.55] },
  { cap: 22, version: 'v1', duracion: 176.71, kb: { webm: 709, mp3: 863 }, marcas: [0, 16.41, 40, 67.05, 93.33, 116.55, 146.31] },
] as const;

export const NARRACION: Narracion[] = CAPITULOS.map((c) => ({
  webm: `${BASE}${c.cap}_${c.version}.webm`,
  mp3: `${BASE}${c.cap}_${c.version}.mp3`,
  marcas: [...c.marcas],
  duracion: c.duracion,
  kb: c.kb,
}));
