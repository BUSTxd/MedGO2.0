/**
 * Los exámenes prácticos 3D, uno por región del atlas: mismo motor (A → B, la B
 * solo vale con la A bien y entera o nada), distinto banco, textos y escena.
 *
 * - Miembro superior (Evaluación continua 1 de Aparato Locomotor): 420 preguntas
 *   en 42 barajas armadas por probabilidad.
 * - Abdomen (Evaluación práctica 2 de Aparato Digestivo): los dos exámenes reales
 *   del 21-11-2025, una baraja cada uno.
 *
 * Una región nueva con examen: su entrada aquí, su banco en `EXAMENES`
 * (`examenes-acceso.ts`) y el enlace `?region=<id>&examen=1` en su evaluación.
 */

import type { Sistema } from '@/lib/data/atlas-3d/regiones';
import type { VistaExamen } from './tipos';

export interface ConfigExamen3D {
  region: string;
  /** Clave del banco en `EXAMENES` y en el bucket `examenes`. */
  clave: string;
  /** «Examen práctico · Miembro superior». */
  kicker: string;
  /** «práctico de miembro superior», para el corte premium. */
  nombrePractico: string;
  bienvenida: string;
  /** Tercera regla del «Antes de empezar»: cómo están armadas las barajas. */
  reglaBarajas: string;
  /** Avance de este navegador (barajas hechas). */
  claveAvance: string;
  /** El botón de los 2 usos por examen: qué sistema quita y cómo se explica. */
  quitar: { sistema: Sistema; etiqueta: string; activo: string; ayuda: string; claveAyuda: string };
  /** El esqueleto también translúcido (en el abdomen las costillas tapan el hígado). */
  huesosTranslucidos?: boolean;
  /** Vista por defecto de lo señalado; sin ella, se calcula hacia dónde sobresale. */
  vista?: VistaExamen;
  /** Si el banco trae tarjetas de memoria (lo dice el corte premium). */
  conTarjetas: boolean;
  /** Adónde vuelve la prueba gratis sin plan: la evaluación del sílabo o el Laboratorio. */
  volver: { evaluacion: { href: string; etiqueta: string }; laboratorio: { href: string; etiqueta: string } };
}

const LABORATORIO = { href: '/dashboard/laboratorio', etiqueta: 'Volver al laboratorio' };

export const EXAMENES_3D: ConfigExamen3D[] = [
  {
    region: 'miembro-superior-derecho',
    clave: 'aparato-locomotor/practico-ms',
    kicker: 'Examen práctico · Miembro superior',
    nombrePractico: 'práctico de miembro superior',
    bienvenida:
      'Este examen ha sido entrenado con toda la información posible de la anatomía del miembro superior. Si lo completas todo, tendrás un rendimiento destacado en cualquier examen.',
    reglaBarajas: 'Cada baraja son 10 preguntas con el mismo reparto que el examen real. Van de lo que ya salió a lo menos probable.',
    claveAvance: 'medgo:examen-ms:v1',
    quitar: {
      sistema: 'musculo',
      etiqueta: 'Quitar músculos',
      activo: 'Sin músculos',
      ayuda: '¿Un músculo tapa lo señalado? Quítalos de la vista para ver lo que hay debajo.',
      claveAyuda: 'medgo:examen-ms:ayuda-musculos',
    },
    conTarjetas: true,
    volver: {
      evaluacion: { href: '/dashboard/cursos/aparato-locomotor/examen-p1', etiqueta: 'Volver a la Evaluación 1' },
      laboratorio: LABORATORIO,
    },
  },
  {
    region: 'abdomen',
    clave: 'digestivo/practico-abdomen',
    kicker: 'Examen práctico · Abdomen',
    nombrePractico: 'práctico de abdomen',
    bienvenida:
      'Los dos exámenes prácticos de anatomía del 21 de noviembre de 2025, tal como se tomaron, sobre el modelo 3D del abdomen: hígado y vías biliares, páncreas, bazo, intestino y sus vasos.',
    reglaBarajas: 'Cada baraja es uno de los dos exámenes reales, con sus 10 preguntas y su clave.',
    claveAvance: 'medgo:examen-abdomen:v1',
    quitar: {
      sistema: 'organo',
      etiqueta: 'Quitar órganos',
      activo: 'Sin órganos',
      ayuda: '¿Un órgano tapa lo señalado? Quítalos de la vista para ver los vasos y lo que hay detrás.',
      claveAyuda: 'medgo:examen-abdomen:ayuda-organos',
    },
    huesosTranslucidos: true,
    vista: 'anterior',
    conTarjetas: false,
    volver: {
      evaluacion: { href: '/dashboard/cursos/digestivo/examen-p2', etiqueta: 'Volver a la Evaluación 2' },
      laboratorio: LABORATORIO,
    },
  },
];

/** El examen de lo cargado (la primera región que tenga uno). */
export function examenDeRegiones(regiones: string[]): ConfigExamen3D | null {
  for (const r of regiones) {
    const c = EXAMENES_3D.find((e) => e.region === r);
    if (c) return c;
  }
  return null;
}
