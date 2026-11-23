// Capítulo 1 · Sepsis, choque séptico y disfunción multiorgánica
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · No es «una infección grave»
  [['grave', 'grave', 1.4], ['no', 'no', 1.0], ['microbio', 'infeccion', 1.2], ['sepsis3', '3', 1.4], ['disfuncion', 'disfuncion', 1.6], ['desregulada', 'desregulada', 1.6], ['cuerpo', 'huesped', 1.6], ['importa', 'importa', 2.0]],
  // 1 · Cómo se mide una disfunción
  [['sofa', 'sofa', 1.4], ['resp', 'respiratorio', 1.0], ['coag', 'coagulacion', 1.0], ['higado', 'higado', 1.0], ['cardio', 'cardiovascular', 1.0], ['neuro', 'neurologico', 1.0], ['rinon', 'rinon', 1.0], ['sube', 'sube', 2.0], ['numero', 'numero', 1.4], ['termo', 'termometro', 1.4]],
  // 2 · qSOFA
  [['kiu', 'rapida', 1.4], ['fr', 'respirar', 1.2], ['pas', 'sistolica', 1.2], ['mente', 'mental', 1.2], ['dos', 'dos', 1.2], ['treinta', '30', 1.2], ['desor', 'desorientada', 1.2], ['ciento8', '108', 1.4], ['alarma', 'alarma', 1.4]],
  // 3 · Bacteriemia no es sepsis
  [['bacteriemia', 'bacteriemia', 1.4], ['bacterias', 'bacterias', 1.2], ['ninguno', 'ningun', 1.6], ['alreves', 'reves', 1.4], ['negativos', 'negativos', 1.4], ['dato', 'dato', 1.2], ['diagnostico', 'diagnostico', 1.4]],
  // 4 · Choque séptico
  [['peor', 'peor', 1.4], ['choque', 'choque', 1.4], ['mortalidad', 'mortalidad', 1.4], ['cuarenta', '40', 1.4], ['dos', 'condiciones', 1.2], ['vaso', 'vasopresores', 1.4], ['pam', '65', 1.4], ['lactato', 'lactato', 1.2], ['dosmmol', 'milimoles', 1.4], ['liquidos', 'liquidos', 1.4], ['ambas', 'dos#2', 1.6]],
  // 5 · Disfunción multiorgánica
  [['cadena', 'cadena', 1.4], ['pulmon', 'pulmon', 1.2], ['rinon', 'rinon', 1.2], ['cerebro', 'cerebro', 1.2], ['domino', 'domino', 1.4], ['empujon', 'empujon', 3.2]],
  // 6 · Los dos pacientes en la escala
  [['donde', 'caen', 1.2], ['joven', 'joven', 1.2], ['pa', '78', 1.2], ['noradr', 'norepinefrina', 1.2], ['lactato', 'lactato', 1.2], ['choque', 'choc', 1.4], ['abuela', 'abuela', 1.2], ['indice', '180', 1.2], ['creat', 'creatinina', 1.2], ['desor', 'desorientada', 1.2], ['sepsis', 'cepsis', 1.4], ['tres', 'tres', 1.4]],
];
