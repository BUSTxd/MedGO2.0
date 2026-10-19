// Vistazo gratis del laboratorio «Hipersensibilidad»: la intro y estos
// capítulos los ve cualquier cuenta; el resto va con el plan del tramo
// (`LABORATORIOS`, src/lib/data/aportes.ts). Lo decide el servidor
// (`contenidoDelLab` en src/lib/hipersensibilidad/registro.ts): sin el plan, los
// datos de los demás capítulos no llegan al navegador.
//
// La sensibilización termina con el mastocito cargado de IgE y «sin síntomas
// todavía»: la reexposición, que es donde se anima la fisiología, ya es de pago.

import type { ParteId } from './tipos';

export const VISTAZO: readonly ParteId[] = ['sensibilizacion'];
