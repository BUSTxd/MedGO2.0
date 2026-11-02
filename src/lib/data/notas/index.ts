// Notas de cada clase, por id del sílabo. Una clase con notas estrena la pestaña
// «Notas» en /estudio. Solo en el servidor: `cursos.ts` y el registro del laboratorio
// las mandan únicamente a quien tiene el plan, como un resumen.

import 'server-only';
import type { NotaClase } from './tipos';

/** Clase AI17 de Patología. También es la tabla del laboratorio «Citopenias autoinmunes». */
export const HEMOLISIS: NotaClase = {
  titulo: 'Hemólisis intravascular y extravascular',
  entrada: 'Lo que vas a encontrar en cada una, de un vistazo.',
  comparacion: {
    titulo: 'En la sangre',
    columnas: ['Intravascular', 'Extravascular'],
    filas: [
      {
        nombre: 'Haptoglobina',
        a: 'Baja',
        b: 'Baja',
        clave: 'La hemoglobina liberada se une a la haptoglobina: por eso baja.',
      },
      {
        nombre: 'LDH',
        a: 'Muy alta',
        b: 'Elevada, menos que en la intravascular',
        clave: 'Marcador de respuesta al tratamiento.',
      },
      {
        nombre: 'Bilirrubina indirecta',
        a: 'Normal o ligeramente elevada',
        b: 'Elevada',
        clave: 'El hemo se cataboliza a bilirrubina indirecta. Marcador temprano de respuesta al tratamiento.',
      },
      {
        nombre: 'Frotis periférico',
        a: ['Reticulocitos elevados', 'Cuerpos de Heinz (déficit de G6PD)', 'Esquistocitos'],
        b: [
          'Reticulocitos elevados',
          'Esferocitos',
          'Aglutinación',
          'Células diana (hemoglobinopatías, hepatopatía, posesplenectomía)',
          'Dacriocitos (ocasionales; sugieren sobre todo fibrosis medular)',
        ],
      },
    ],
  },
  claves: {
    titulo: 'Evidencia de hemólisis en orina',
    filas: [
      {
        nombre: 'Hemoglobinuria',
        donde: 'Principalmente intravascular',
        columna: 0,
        texto: 'Tira reactiva positiva para hemo, con microscopía negativa.',
      },
      {
        nombre: 'Hemosiderinuria',
        donde: 'Típicamente intravascular',
        columna: 0,
        texto: 'Orina marrón. Las células del túbulo proximal contienen hemosiderina.',
      },
      {
        nombre: 'Urobilinógeno',
        donde: 'Principalmente extravascular',
        columna: 1,
        flujo: ['Más bilirrubina indirecta', 'Más degradación en el intestino', 'Más urobilinógeno en la circulación enterohepática', 'Se excreta en la orina'],
      },
    ],
  },
};

export const NOTAS: Record<string, NotaClase> = {
  'pat-ai-17': HEMOLISIS,
};
