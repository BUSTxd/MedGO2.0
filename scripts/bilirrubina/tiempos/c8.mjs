// Capítulo 8 · Cuando sube la no conjugada. (Whisper: «urina», «emólicis», «sematíes», «ectericia».)
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · La firma
  [['firma', 'firma', 1.0], ['indirecta', 'indirecta', 1.0], ['orina', 'urina', 1.0], ['tres', 'tres', 2.4], ['grifos', 'grifos', 1.4]],
  // 1 · Producir mucho
  [['produccion', 'produccion', 1.0], ['hemolisis', 'emolicis', 1.4], ['rh', 'rh', 1.0], ['ineficaz', 'ineficaz', 1.0], ['hematoma', 'hematoma', 1.0], ['ldh', 'ldh', 0.8], ['haptoglobina', 'aptoglobina', 0.8], ['uro', 'urobilinogeno', 0.8], ['mas', 'hemorroto', 1.0]],
  // 2 · Captar poco
  [['captacion', 'captacion', 1.0], ['farmacos', 'farmacos', 1.0], ['cardiaca', 'cardiaca', 1.0], ['cortocircuitos', 'cortocircuitos', 1.2], ['poco', 'poco', 1.0]],
  // 3 · Gilbert
  [['gilbert', 'gilbert', 1.0], ['poblacion', 'poblacion', 1.4], ['variante', 'variante', 1.0], ['tata', 'tata', 1.2], ['ta', 'repeticion', 1.2], ['tercio', 'tercio', 1.4]],
  // 4 · Gilbert: benigno y con pistas
  [['nota', 'nota', 1.0], ['ayuno', 'ayuno', 2.0], ['transaminasas', 'transaminazas', 1.0], ['notrata', 'trata', 1.0], ['irinotecan', 'irinotecan', 1.2]],
  // 5 · Crigler-Najjar I
  [['cn1', 'tipo', 1.0], ['ninguna', 'ninguna', 1.0], ['intensa', 'intensa', 1.0], ['kern', 'kernicterus', 1.0], ['feno', 'fenobarbital', 1.0]],
  // 6 · Crigler-Najjar II
  [['algunas', 'quedan', 1.0], ['tipo2', '2', 1.0], ['menor', 'menor', 1.0], ['responde', 'responde', 2.0], ['llave', 'llave', 1.0]],
  // 7 · Ictericia fisiológica del recién nacido
  [['razones', 'razones', 1.0], ['hematies', 'sematies', 1.0], ['ugt', 'inmadura', 1.0], ['flora', 'flora', 1.0], ['entero', 'circulacion', 1.0], ['despues', '24', 2.4], ['pico', 'pico', 1.0], ['antes', '24#2', 1.2]],
  // 8 · Lactancia y leche materna
  [['lactancia', 'lactancia', 1.0], ['insuficiente', 'insuficiente', 1.2], ['materna', 'materna', 1.2], ['benigna', 'benigna', 1.0], ['diferentes', 'diferentes', 1.0]],
];
