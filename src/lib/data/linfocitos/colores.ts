// Colores del laboratorio «Maduración de linfocitos». Sobre fondo blanco: cada
// linaje tiene un color (B azul, T verde, centro germinal ámbar, plasmática
// violeta) que se repite en marcadores, rótulos y tarjetas; el rojo es solo
// para las neoplasias.

export const L = {
  madre: '#D9567E',
  linfoide: '#6C7FD8',
  b: '#2F6FD0',
  t: '#1F9A6A',
  nk: '#4F9FC2',
  gc: '#D9881E',
  plasma: '#8A4FCF',
  estroma: '#9AA6B8',
  neoplasia: '#E5484D',
  // Marcadores de membrana
  bcr: '#2F6FD0',
  prebcr: '#86A9EC',
  tcr: '#1F9A6A',
  pretcr: '#7FCBA6',
  cd: '#5B6475',
  mhc1: '#C9792A',
  mhc2: '#A9502A',
  // Moléculas
  quimiocina: '#2CA9BC',
  citocina: '#D9881E',
  antigeno: '#C2410C',
  autoantigeno: '#E5484D',
  // Proteínas (círculo + nombre)
  rag: '#7C5CD6',
  tdt: '#C05FA8',
  aid: '#E0702A',
  tf: '#3D8BD9',
} as const;
