// Las pestañas del panel de tablas del laboratorio «Infecciones bacterianas por
// gramnegativas»: solo su nombre y a qué capítulos acompañan, para enseñarlas aunque
// estén cerradas. Las tablas mismas están en `tablas.ts` y solo salen del servidor con el
// plan (`contenidoDelLab`); la pestaña `gratis` va con el vistazo (capítulos 0 y 1).

import type { MetaGrupo } from './tipos';

const RESUMEN = 'Basado en el resumen de la clase AI18 de Patología (Holmes 2021 · Rogers 2023 · Sepsis-3). Toca una fila para verla animada.';

export const GRUPOS: MetaGrupo[] = [
  { id: 'conceptos', nombre: 'Conceptos y puertas', capitulos: ['pacientes', 'quien'], gratis: true, fuente: RESUMEN },
  { id: 'moco', nombre: 'Moco y uniones', capitulos: ['barrera', 'uniones'], gratis: false, fuente: RESUMEN },
  { id: 'invasion', nombre: 'Invasión y reparación', capitulos: ['invasion', 'reparar'], gratis: false, fuente: RESUMEN },
  { id: 'toxinas', nombre: 'Toxinas y sepsis', capitulos: ['toxinas', 'sepsis'], gratis: false, fuente: RESUMEN },
  { id: 'especies', nombre: 'Especies', capitulos: ['especies'], gratis: false, fuente: RESUMEN },
  { id: 'resistencia', nombre: 'Resistencia y evidencia', capitulos: ['resistencia'], gratis: false, fuente: RESUMEN },
  {
    id: 'farmacos',
    nombre: 'Fármacos',
    capitulos: ['quien', 'barrera', 'uniones', 'invasion', 'toxinas', 'sepsis', 'reparar', 'especies', 'resistencia'],
    gratis: false,
    fuente: 'Repaso de Farmacología que acompaña a cada capítulo: mecanismo, no receta. La elección real es de la guía local y de tu clase de Farmacología. Toca una fila para verla animada.',
  },
];
