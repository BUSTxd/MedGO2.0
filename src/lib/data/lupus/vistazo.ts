// Vistazo gratis del laboratorio «Lupus»: estos capítulos los ve cualquier
// cuenta; el resto va con el plan del tramo (`LABORATORIOS`, src/lib/data/aportes.ts).
// Lo decide el servidor (`contenidoDelLab` en src/lib/lupus/registro.ts): sin el
// plan, los datos y la voz de los demás capítulos no llegan al navegador.

import type { ParteId } from './tipos';

export const VISTAZO: readonly ParteId[] = ['que-es', 'causas'];
