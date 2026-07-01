import type { NivelMeta, NivelContenido } from '../types';
import { TEMA_01 } from './tema-01';
import { TEMA_02 } from './tema-02';
import { TEMA_03 } from './tema-03';
import { TEMA_04 } from './tema-04';
import { TEMA_05 } from './tema-05';
import { TEMA_06 } from './tema-06';
import { TEMA_07 } from './tema-07';
import { TEMA_08 } from './tema-08';
import { TEMA_09 } from './tema-09';
import { TEMA_10 } from './tema-10';
import { TEMA_11 } from './tema-11';
import { TEMA_12 } from './tema-12';
import { TEMA_13 } from './tema-13';
import { TEMA_14 } from './tema-14';

/** Registro de los 14 niveles. Todos con contenido disponible. */
export const NIVELES: NivelMeta[] = [
  { id: 'tema-01', n: 1,  nombre: 'Principios Básicos de la Investigación Médica', banda: 'fundamentos', disponible: true },
  { id: 'tema-02', n: 2,  nombre: 'Diseño Muestral y Gestión de Datos',            banda: 'fundamentos', disponible: true },
  { id: 'tema-03', n: 3,  nombre: 'Validez, Sesgos y Factores de Confusión',       banda: 'fundamentos', disponible: true },
  { id: 'tema-04', n: 4,  nombre: 'Inferencia Estadística y Prueba de Hipótesis',  banda: 'fundamentos', disponible: true },
  { id: 'tema-05', n: 5,  nombre: 'Magnitud de Efecto y Precisión',                banda: 'desarrollo',  disponible: true },
  { id: 'tema-06', n: 6,  nombre: 'Medidas de Frecuencia y Probabilidad',          banda: 'desarrollo',  disponible: true },
  { id: 'tema-07', n: 7,  nombre: 'Diseños de Estudios Observacionales',           banda: 'desarrollo',  disponible: true },
  { id: 'tema-08', n: 8,  nombre: 'Ensayos Clínicos Aleatorizados (ECA)',          banda: 'desarrollo',  disponible: true },
  { id: 'tema-09', n: 9,  nombre: 'Consolidación y Repaso Metodológico',           banda: 'analisis',    disponible: true },
  { id: 'tema-10', n: 10, nombre: 'Introducción a la Estadística Descriptiva',     banda: 'analisis',    disponible: true },
  { id: 'tema-11', n: 11, nombre: 'Análisis Bivariado',                            banda: 'analisis',    disponible: true },
  { id: 'tema-12', n: 12, nombre: 'Investigación Cualitativa',                     banda: 'analisis',    disponible: true },
  { id: 'tema-13', n: 13, nombre: 'Análisis Multivariado',                         banda: 'sintesis',    disponible: true },
  { id: 'tema-14', n: 14, nombre: 'Ciencia de la Implementación',                  banda: 'sintesis',    disponible: true },
];

/** Contenido por id de nivel. */
export const CONTENIDO: Record<string, NivelContenido> = {
  'tema-01': TEMA_01,
  'tema-02': TEMA_02,
  'tema-03': TEMA_03,
  'tema-04': TEMA_04,
  'tema-05': TEMA_05,
  'tema-06': TEMA_06,
  'tema-07': TEMA_07,
  'tema-08': TEMA_08,
  'tema-09': TEMA_09,
  'tema-10': TEMA_10,
  'tema-11': TEMA_11,
  'tema-12': TEMA_12,
  'tema-13': TEMA_13,
  'tema-14': TEMA_14,
};

export function getMeta(id: string): NivelMeta | undefined {
  return NIVELES.find((m) => m.id === id);
}

export function getContenido(id: string): NivelContenido | undefined {
  return CONTENIDO[id];
}
