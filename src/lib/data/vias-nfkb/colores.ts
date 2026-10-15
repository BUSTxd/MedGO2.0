// Colores de las piezas, tomados de la figura de Küppers (J Clin Invest 2012,
// fig. 2): elipses pastel que se leen igual sobre el papel claro y sobre el
// campo oscuro. Una pieza tiene el mismo color en las tres vías y en el
// panorama, para que el estudiante la reconozca al cambiar de escena.

export const C = {
  // Receptores y ligandos
  cd30: '#E9A86A',
  rank: '#F3DE84',
  cd40: '#CBE29A',
  bcma: '#86C9C2',
  receptor: '#8FCBE8',
  lmp1: '#7FC29E',
  ligando: '#D9CFEA',
  citocina: '#9FD3EE',
  // Vía clásica
  rip: '#CDB3A6',
  traf: '#EBA27F',
  tak1: '#A9C6EC',
  nemo: '#A8D08F',
  ikka: '#F2D774',
  ikkb: '#86C0B1',
  ikba: '#94CADB',
  p50: '#F5B86C',
  p65: '#DFA0D2',
  crel: '#F4A7B9',
  bcl3: '#AEB6C6',
  a20: '#C7B4EE',
  cyld: '#B4C3EE',
  // Vía alternativa
  traf3: '#DE9878',
  traf2: '#EBB394',
  ciap: '#BBA7E6',
  nik: '#CCE39C',
  p100: '#EFA4A4',
  relb: '#88C892',
  p52: '#D5D39C',
  // JAK/STAT
  jak: '#BAB6DC',
  stat: '#EF907F',
  socs1: '#D9A9D0',
  // Productos
  antiapoptotico: '#A9D9A2',
  proliferacion: '#AFC8F0',
  quimiocina: '#F6CB9C',
  evasion: '#F1AEAE',
  // Microambiente
  linfocito: '#D7E3F4',
  eosinofilo: '#F6C3B5',
} as const;

/** Color de cada vía (rótulos azules de la figura, uno por vía en la app). */
export const COLOR_VIA = {
  clasica: '#2F6FCF',
  alternativa: '#2F8F7A',
  jakstat: '#8A4FCF',
} as const;

/** Rojo de las alteraciones del linfoma de Hodgkin (texto rojo de la figura). */
export const ROJO_ALTERACION = '#E5484D';
