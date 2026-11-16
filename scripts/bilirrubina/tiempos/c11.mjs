// Capítulo 11 · Cálculos pigmentarios y mapa final. (Whisper: «hemólicis», «transaminazas», «eses».)
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · No todos son de colesterol
  [['colesterol', 'colesterol', 1.0], ['pigmentarios', 'pigmentarios', 1.0], ['calcico', 'calcico', 1.0], ['ingredientes', 'ingredientes', 1.2]],
  // 1 · Cálculos negros
  [['negros', 'negros', 1.0], ['vesicula', 'vesicula', 1.0], ['hemolisis', 'hemolicis', 0.9], ['cirrosis', 'cirrosis', 0.9], ['ileon', 'reseccion', 0.9], ['polimeriza', 'polimeriza', 1.0], ['duros', 'duros', 1.0], ['fin', 'negros#2', 1.0]],
  // 2 · Cálculos pardos
  [['pardos', 'pardos', 1.0], ['conductos', 'conductos', 1.2], ['infeccion', 'infeccion', 1.0], ['bacterias', 'bacterias', 1.0], ['parasitos', 'parasitos', 1.0], ['blandos', 'blandos', 1.0], ['colangitis', 'colangitis', 1.0], ['fin', 'pardos#2', 1.0]],
  // 3 · No se disuelven
  [['disolver', 'disolver', 1.0], ['lipidos', 'lipidos', 1.0], ['solventes', 'solventes', 1.0], ['clinica', 'clinica', 1.0]],
  // 4 · Prehepática
  [['antes', 'antes', 1.0], ['indirecta', 'indirecta', 1.0], ['orina', 'orina', 1.0], ['uro', 'urobilinogeno', 1.0], ['heces', 'oscuras', 1.0], ['abasto', 'abasto', 1.0]],
  // 5 · Hepática
  [['dentro', 'dentro', 1.0], ['mixta', 'mixta', 1.0], ['coluria', 'coluria', 1.0], ['uro', 'urobilinogeno', 1.0], ['transaminasas', 'transaminazas', 1.0], ['etapas', 'etapas', 1.0]],
  // 6 · Posthepática
  [['despues', 'despues', 1.0], ['directa', 'directa', 1.0], ['coluria', 'coluria', 1.0], ['uro', 'urobilinogeno', 1.0], ['acolicas', 'acolicas', 1.0], ['fosfatasa', 'fosfatasa', 1.2]],
  // 7 · El viaje completo
  [['principio', 'principio', 1.2], ['e1', 'macrofago', 0.8], ['e2', 'sangre', 0.8], ['e3', 'higado', 0.8], ['e4', 'intestino', 0.8], ['e5', 'eses', 0.8], ['semaforos', 'semaforos', 2.4], ['pregunta', 'amarillo', 1.2], ['responder', 'responderla', 1.0]],
];
