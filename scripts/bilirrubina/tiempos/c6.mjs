// Capítulo 6 · El intestino y sus bacterias. (Whisper oye «eses» por heces, «estercovilina», «hemólicis», «glucuronidazas».)
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · Intacta por el delgado
  [['intestino', 'intestino', 1.0], ['duodeno', 'duodeno', 1.2], ['intacta', 'intacta', 1.4], ['grande', 'grande', 0.8], ['polar', 'polar', 0.8], ['transportador', 'transportador', 1.0], ['sales', 'sales', 1.2], ['tunel', 'tunel', 1.0]],
  // 1 · Las bacterias le quitan las colitas
  [['colon', 'colon', 1.0], ['bacterias', 'bacterias', 1.0], ['tijeras', 'quitarle', 1.0], ['quitan', 'tijeras', 3.0], ['enzima', 'glucuronidazas', 1.0], ['vuelve', 'vuelve', 1.2]],
  // 2 · BilR
  [['secreto', 'secreto', 1.0], ['anio', '2024', 1.2], ['bilr', 'bilerre', 1.2], ['firmicutes', 'firmicutes', 1.0], ['urobilinogeno', 'urobilinogeno', 1.4]],
  // 3 · ¿Quién tiene BilR?
  [['todos', 'todos', 1.0], ['adultos', 'adultos', 1.2], ['recien', 'recien', 1.2], ['eii', 'inflamatoria', 1.2], ['guarda', 'guarda', 1.0]],
  // 4 · El marrón de las heces
  [['color', 'color', 1.0], ['cadena', 'cadena', 1.0], ['amarilla', 'amarilla', 0.9], ['incoloro', 'incoloro', 0.9], ['esterco', 'estercovilinogeno', 0.9], ['estercobilina', 'estercovilina#2', 1.0], ['marron', 'marron', 1.4]],
  // 5 · La circulación enterohepática
  [['eses', 'eses', 1.2], ['absorbe', 'absorbe', 1.2], ['porta', 'porta', 1.6], ['excreta', 'excreta', 1.0], ['circulacion', 'circulacion', 1.0], ['vuelta', 'vuelta', 1.0]],
  // 6 · El amarillo de la orina
  [['resto', 'resto', 1.0], ['escapa', 'escapa', 1.0], ['sangre', 'sangre', 1.0], ['rinon', 'rinon', 1.0], ['cinco', '5', 1.2], ['oxida', 'oxida', 1.0], ['urobilina', 'urobilina#2', 1.2], ['amarillo', 'amarillo', 1.0]],
  // 7 · La no conjugada casi no vuelve
  [['duda', 'duda', 1.0], ['casi', 'casi', 1.0], ['transforman', 'transforman', 1.4], ['recien', 'recien', 1.2], ['flora', 'flora', 1.4], ['sangre', 'sangre', 1.0]],
  // 8 · Pistas de color
  [['historia', 'historia', 1.0], ['bilis', 'bilis', 1.0], ['palidas', 'palidas', 1.0], ['acolia', 'acolia', 1.0], ['desaparece', 'desaparece', 1.0], ['antibioticos', 'antibioticos', 1.2], ['matan', 'matan', 1.2], ['hemolisis', 'hemolicis', 1.0], ['sube', 'sube', 1.0], ['laboratorio', 'laboratorio', 1.0]],
];
