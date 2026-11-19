// Las pestañas del panel de tablas del laboratorio «VIH y sífilis»: solo su nombre y a qué
// capítulos acompañan, para enseñarlas aunque estén cerradas. Las tablas mismas están en
// `tablas.ts` y solo salen del servidor con el plan (`contenidoDelLab`); la pestaña
// `gratis` va con el vistazo (capítulos 0 y 1).

import type { MetaGrupo } from './tipos';

const RESUMEN = 'Basado en el resumen y los dos casos de la clase ACP14 de Patología, completado con guías (OMS, HHS, CDC, MINSA). Toca una fila para verla animada.';

export const GRUPOS: MetaGrupo[] = [
  { id: 'conceptos', nombre: 'Pacientes y virus', capitulos: ['pacientes', 'vih'], gratis: true, fuente: RESUMEN },
  { id: 'virion', nombre: 'Virión, genes y células', capitulos: ['virion', 'genes', 'celulas', 'mucosa'], gratis: false, fuente: RESUMEN },
  { id: 'ciclo', nombre: 'Ciclo y fármacos', capitulos: ['ciclo', 'tar', 'nuevo', 'fallo'], gratis: false, fuente: 'Los fármacos y sus esquemas se dicen como los recomiendan las guías citadas (OMS 2021, HHS 2026, NTS 169 del MINSA): son un repaso, no una receta. Toca una fila para verla animada.' },
  { id: 'diagnostico', nombre: 'Diagnóstico y ventana', capitulos: ['diagnostico', 'carga', 'historia'], gratis: false, fuente: RESUMEN },
  { id: 'oportunistas', nombre: 'Oportunistas según CD4', capitulos: ['inmunidad', 'oportunistas'], gratis: false, fuente: RESUMEN },
  { id: 'sifilis', nombre: 'Estadios de la sífilis', capitulos: ['treponema', 'endarteritis', 'chancro', 'estadios'], gratis: false, fuente: RESUMEN },
  { id: 'serologia', nombre: 'Serología y tratamiento', capitulos: ['serologia', 'tratamiento'], gratis: false, fuente: 'Serología según los CDC 2024 y tratamiento según los CDC 2021 y el ensayo de Hook 2025: un repaso, no una receta. Toca una fila para verla animada.' },
];
