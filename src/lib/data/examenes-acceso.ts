import type { PlanKey } from '@/lib/plans';

/**
 * `free` abre el examen a cualquier cuenta. Sin él, hace falta un plan activo
 * que abra `plan` o, si no se declara, el tramo del curso (primer segmento de
 * la clave): un plan de UFBI no abre un examen de la Facultad.
 */
/**
 * `muestra` abre las N primeras preguntas a quien no tiene el plan. El recorte
 * se hace EN EL SERVIDOR y se devuelven las preguntas inline: si sólo se
 * ocultaran en el cliente, el JSON completo —con sus respuestas correctas— ya
 * estaría en el navegador y bastaría con mirar la pestaña Red.
 */
/**
 * `muestraFlash` es el corte de las `flashcards` del motor de tarjetas. Si falta,
 * la muestra no lleva ninguna: el fallo seguro es no regalarlas.
 */
export const EXAMENES: Record<string, { free?: boolean; plan?: PlanKey; muestra?: number; muestraFlash?: number }> = {
  'excretor/tbl-3-asa-henle': { free: true },
  'neurologia/snp-histologia': { free: true },
  'neurologia/snp-histologia-b': { free: true },
  'neurologia/snc-histologia': { free: true },
  'neurologia/snc-histologia-a3': { free: true },
  'neurologia/snc-histologia-c': { free: true },
  'neurologia/piel-histologia': { free: true },
  'neurologia/piel-histologia-a3': { free: true },
  'neurologia/piel-histologia-c': { free: true },
  'neurologia/piel-histologia-b': { free: true },
  'patologia/parcial-1': { free: true },
  // De pago aunque Patología sea un curso gratis: son el reclamo del plan. El
  // 2020 B queda abierto como el 2024, con el aviso de suscripción del runner.
  'patologia/parcial-1-2022': {},
  'patologia/parcial-1-2020': {},
  'patologia/parcial-1-2020-b': { free: true },
  // Inmunología: dos banqueos abiertos como muestra del curso (2025 y 2024-II),
  // con el aviso de suscripción del runner cada pocas preguntas. El 2022 y los
  // dos Extra están detrás del plan del tramo; el 2023 —el más elaborado— se
  // entrega recortado a 34 de sus 68 preguntas.
  'inmunologia/final-2025': { free: true },
  'inmunologia/final-2024-2': { free: true },
  'inmunologia/final-2022': {},
  'inmunologia/extra-hemato': {},
  'inmunologia/extra-pato': {},
  'inmunologia/final-2023': { muestra: 34 },
  // Banqueo de repaso del TBL 3 (motor de tarjetas, no hoja de examen). La
  // clase está abierta y el recorte lo hace el servidor: sin `muestra` el JSON
  // entero viajaría al navegador y las tarjetas de pago se leerían en la
  // pestaña Red.
  'inmunologia/tbl-3-vacunas': { muestra: 10, muestraFlash: 10 },
  // Mismo trato para las tarjetas de T12 → SGP 4 (aún sin quiz: `questions: []`).
  'inmunologia/t-12-regulacion': { muestra: 10, muestraFlash: 10 },
  'inmunologia/t-13-citometria': { muestra: 10, muestraFlash: 10 },
  'inmunologia/l-2-citometria': { muestra: 10, muestraFlash: 10 },
  'inmunologia/t-14-cancer': { muestra: 10, muestraFlash: 10 },
  'inmunologia/sgp-4-melanoma': { muestra: 10, muestraFlash: 10 },
  // Epidemiología (curso gratis): el 2022 abierto como muestra, con el aviso de
  // suscripción del runner; el SUSTI y los Kahoots detrás del plan del tramo;
  // los PASOS, a medias como el 2023 de Inmunología (27 de 54).
  'epidemiologia/parcial-1-2022': { free: true },
  'epidemiologia/parcial-1-susti': {},
  'epidemiologia/parcial-1-kahoot': {},
  'epidemiologia/parcial-1-pasos': { muestra: 27 },
};
