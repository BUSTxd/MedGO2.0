// La tabla del laboratorio «Citopenias autoinmunes»: intravascular frente a
// extravascular. Solo en el servidor (`contenidoDelLab` la manda con el plan). Las
// notas de la clase AI17 dicen lo mismo con la plantilla de clase
// (data/clases/patologia/pat-ai-17.json): si se corrige una, corregir la otra.

import 'server-only';
import type { TablaLab } from './tipos';

export const HEMOLISIS: TablaLab = {
  titulo: 'Hemólisis intravascular y extravascular',
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
