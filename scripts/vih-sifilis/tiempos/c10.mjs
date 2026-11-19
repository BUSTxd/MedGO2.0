// Capítulo 10 · El diagnóstico
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · Dos preguntas, dos pruebas
  [['preguntas', 'preguntas', 1.2], ['primera', 'primera', 1.2], ['serologicas', 'serologicas', 1.2], ['anticuerpos', 'anticuerpos', 1.0], ['p24', 'p24', 1.0], ['segunda', 'segunda', 1.2], ['virologicas', 'virologicas', 1.2], ['arn', 'arn', 1.0], ['adn', 'adn', 1.0], ['huella', 'huella', 1.0], ['propio', 'propio', 1.0]],
  // 1 · Cinco generaciones
  [['cinco', 'cinco', 1.2], ['ventana', 'ventana', 1.6], ['g1', 'primera', 1.0], ['g2', 'segunda', 1.0], ['g3', 'tercera', 1.2], ['g4', 'cuarta', 1.2], ['p24', 'p24', 1.0], ['aguda', 'aguda', 1.2], ['g5', 'quinta', 1.2], ['vih1', 'vih1', 1.0], ['vih2', 'vih2', 1.0]],
  // 2 · El sándwich de ELISA
  [['elisa', 'elisa', 1.2], ['pocillo', 'pocillo', 1.2], ['antigenos', 'antigenos', 1.0], ['anticuerpos', 'anticuerpos', 1.0], ['capturan', 'capturan', 1.2], ['segundo', 'segundo', 1.2], ['enzima', 'enzima', 1.2], ['sustrato', 'sustrato', 1.0], ['color', 'color', 1.4], ['formo', 'formo', 1.2], ['color2', 'color#2', 1.4]],
  // 3 · El periodo ventana
  [['ventana', 'ventana', 1.2], ['intervalo', 'intervalo', 1.2], ['arn', 'arn', 1.2], ['p24', 'p24', 1.2], ['igm', 'luego', 1.2], ['igg', 'ultimo', 1.2], ['cdc', 'cdc', 1.0], ['nat', 'nucleicos', 1.0], ['r1', '33', 1.4], ['ag', 'antigeno#2', 1.2], ['r2', '45', 1.4]],
  // 4 · El algoritmo actual
  [['algoritmo', 'algoritmo', 1.2], ['cuarta', 'cuarta', 1.2], ['reactiva', 'reactiva', 1.2], ['inmunoensayo', 'inmunoensayo', 1.2], ['vih1', 'vih1', 1.0], ['vih2', 'vih2', 1.0], ['negativo', 'negativo', 1.2], ['nucleicos', 'nucleicos', 1.2], ['duda', 'duda', 1.2], ['western', 'western', 1.2], ['forma', 'forma', 1.0], ['cdc', 'cdc', 1.2]],
  // 5 · Lactantes menores de 18 meses
  [['lactante', 'lactante', 1.2], ['madre', 'madre', 1.0], ['anticuerpos', 'anticuerpos', 1.0], ['atraviesan', 'atraviesan', 1.6], ['placenta', 'placenta', 1.0], ['quedarse', 'quedarse', 1.2], ['meses', '18', 1.2], ['serologia', 'serologia', 1.0], ['positiva', 'positiva', 1.0], ['nucleicos', 'nucleicos', 1.2], ['virus', 'virus', 1.0], ['diagnosticar', 'diagnosticar', 1.2]],
  // 6 · Otros usos de la prueba de ácidos nucleicos
  [['nat', 'nucleicos', 1.2], ['sospecha', 'sospecha', 1.2], ['indeterminada', 'indeterminada', 1.2], ['donantes', 'donantes', 1.2], ['cuantitativa', 'cuantitativa', 1.2], ['recuento', 'recuento', 1.2], ['genotipo', 'genotipo', 1.2]],
  // 7 · El paciente 2 y la ventana
  [['caso', 'caso', 1.0], ['cuarta', 'cuarta', 1.0], ['negativa', 'negativa', 1.0], ['seis', 'seis', 1.0], ['exposicion', 'exposicion', 1.2], ['final', 'final', 1.2], ['descarta', 'descarta', 1.4], ['siempre', 'siempre', 1.2], ['cifilis', 'cifilis', 1.0], ['cdc', 'cdc', 1.0], ['repetir', 'repetir', 1.2], ['meses', 'meses', 1.4]],
];
