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
export const EXAMENES: Record<string, { free?: boolean; plan?: PlanKey; muestra?: number }> = {
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
  // Epidemiología (curso gratis): el 2022 abierto como muestra, con el aviso de
  // suscripción del runner; el SUSTI, los Kahoots y los PASOS detrás del plan del tramo.
  'epidemiologia/parcial-1-2022': { free: true },
  'epidemiologia/parcial-1-susti': {},
  'epidemiologia/parcial-1-kahoot': {},
  'epidemiologia/parcial-1-pasos': {},
};
