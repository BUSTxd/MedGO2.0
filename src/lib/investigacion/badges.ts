import type { Insignia } from './types';

// Insignias desbloqueables. `icono` es una clave del registro <Icono/>.
export const INSIGNIAS: Insignia[] = [
  {
    id: 'ojo-clinico',
    nombre: 'Ojo Clínico',
    descripcion: 'Encontraste todos los errores en un reto de "El error del investigador".',
    icono: 'microscopio',
  },
  {
    id: 'velocista',
    nombre: 'Velocista',
    descripcion: 'Completaste un nivel en menos de 10 minutos.',
    icono: 'rayo',
  },
  {
    id: 'precision-total',
    nombre: 'Precisión Total',
    descripcion: 'Completaste un nivel sin ningún error.',
    icono: 'diana',
  },
  {
    id: 'conector',
    nombre: 'Conector',
    descripcion: 'Completaste 3 minijuegos de arrastrar y conectar sin fallar.',
    icono: 'pieza',
  },
  {
    id: 'estadistico',
    nombre: 'Estadístico',
    descripcion: 'Dominaste el nivel de errores Tipo I y Tipo II sin fallar.',
    icono: 'barras',
  },
  {
    id: 'investigador-completo',
    nombre: 'Investigador Completo',
    descripcion: 'Completaste los 14 niveles del curso de Investigación.',
    icono: 'trofeo',
  },
];

export function getInsignia(id: string): Insignia | undefined {
  return INSIGNIAS.find((b) => b.id === id);
}
