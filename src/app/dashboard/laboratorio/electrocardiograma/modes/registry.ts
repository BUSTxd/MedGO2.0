// Catálogo de modos de aprendizaje. Solo contiene metadata LIGERA (siempre
// cargada). La definición pesada de cada modo se importa de forma diferida con
// loadMode() y se cachea en memoria, de modo que al entrar únicamente se carga
// el modo principal.

import type { ModeDefinition, ModeMeta } from '../engine/types';

export const MODES: ModeMeta[] = [
  {
    id: 'ritmo-sinusal',
    title: 'Ritmo sinusal normal',
    short: 'Ritmo sinusal',
    desc: 'Cada onda P conduce a un QRS estrecho con PR constante.',
    color: '#E6A700',
    ready: true,
  },
  {
    id: 'arritmia-respiratoria',
    title: 'Arritmia sinusal respiratoria',
    short: 'Arritmia respiratoria',
    desc: 'Morfología normal; el intervalo RR varía con la respiración.',
    color: '#3b9edd',
    ready: true,
  },
  {
    id: 'bav-1',
    title: 'Bloqueo AV de primer grado',
    short: 'BAV 1.º grado',
    desc: 'PR prolongado (>200 ms); la conducción se retrasa, no se bloquea.',
    color: '#F5A623',
    ready: true,
  },
  {
    id: 'bav-2-mobitz-1',
    title: 'Bloqueo AV 2.º grado Mobitz I',
    short: 'Mobitz I',
    desc: 'PR cada vez más largo hasta una P bloqueada (Wenckebach).',
    color: '#F5A623',
    ready: true,
  },
  {
    id: 'bav-2-mobitz-2',
    title: 'Bloqueo AV 2.º grado Mobitz II',
    short: 'Mobitz II',
    desc: 'PR constante con caída súbita del QRS (bloqueo infranodal).',
    color: '#E85B4A',
    ready: true,
  },
  {
    id: 'bav-completo',
    title: 'Bloqueo AV completo',
    short: 'BAV completo',
    desc: 'Aurículas y ventrículos laten por separado: no hay relación PR.',
    color: '#E85B4A',
    ready: true,
  },
  {
    id: 'brd',
    title: 'Bloqueo de rama derecha',
    short: 'Rama derecha',
    desc: 'Conducción intraventricular derecha tardía; QRS ancho (rSR′ en V1).',
    color: '#E85B4A',
    ready: true,
  },
  {
    id: 'bri',
    title: 'Bloqueo de rama izquierda',
    short: 'Rama izquierda',
    desc: 'Activación ventricular izquierda retrasada; QRS ancho y mellado.',
    color: '#E85B4A',
    ready: true,
  },
  {
    id: 'ev',
    title: 'Extrasístole ventricular',
    short: 'Extrasístole',
    desc: 'QRS ancho prematuro sin P previa y pausa compensatoria.',
    color: '#F5A623',
    ready: true,
  },
];

export const DEFAULT_MODE = 'ritmo-sinusal';

// Cache en memoria de las definiciones ya cargadas (evita re-importar).
const cache = new Map<string, ModeDefinition>();

/**
 * Carga (diferida) la definición de un modo. Devuelve null si el modo aún no
 * está implementado. Las cargas se memorizan en `cache`.
 */
export async function loadMode(id: string): Promise<ModeDefinition | null> {
  const cached = cache.get(id);
  if (cached) return cached;

  let mod: { default: ModeDefinition } | null = null;
  switch (id) {
    case 'ritmo-sinusal':
      mod = await import('./ritmo-sinusal');
      break;
    case 'arritmia-respiratoria':
      mod = await import('./arritmia-respiratoria');
      break;
    case 'bav-1':
      mod = await import('./bav-1');
      break;
    case 'bav-2-mobitz-1':
      mod = await import('./bav-2-mobitz-1');
      break;
    case 'bav-2-mobitz-2':
      mod = await import('./bav-2-mobitz-2');
      break;
    case 'bav-completo':
      mod = await import('./bav-completo');
      break;
    case 'brd':
      mod = await import('./brd');
      break;
    case 'bri':
      mod = await import('./bri');
      break;
    case 'ev':
      mod = await import('./ev');
      break;
    default:
      return null;
  }

  cache.set(id, mod.default);
  return mod.default;
}

export function getMeta(id: string): ModeMeta | undefined {
  return MODES.find((m) => m.id === id);
}
