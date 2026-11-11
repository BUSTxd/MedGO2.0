// Capítulo 8 · Cuatro especies, cuatro estrategias.
export default [
  // 0 · Cuatro estrategias
  [['ecoli', 'cuatro', 0.9], ['kleb', 'especies', 0.9], ['acineto', 'estrategias', 0.9], ['pseudo', 'apoyan', 0.9], ['tres', 'tres', 1.2], ['una', 'una', 1.2]],
  // 1 · E. coli, la más frecuente
  [['frecuente', 'escherichia', 1.2], ['expec', 'expec', 1.0], ['upec', 'ups', 1.0], ['sepec', 'seps', 1.0], ['epec', 'eps', 1.0], ['ehec', 'ehs', 1.0], ['noEquivale', 'equiparan', 1.4]],
  // 2 · Subtipos
  [['b2', 'b2', 1.0], ['d', 'd', 1.0], ['st131', 'st131', 1.2], ['ctxm', 'txm', 1.2]],
  // 3 · Origen, adhesión y evasión
  [['urinaria', 'urinaria', 1.2], ['transloca', 'translocacion', 1.2], ['capsula', 'capsula', 0.9], ['fimbrias', 'fimbrias', 0.9], ['afa', 'afa', 0.9], ['pic', 'pic', 1.0], ['biopelicula', 'biopelicula', 1.2]],
  // 4 · Nutrientes y evidencia variable
  [['hierro', 'hierro', 1.2], ['tonb', 'tombe', 1.0], ['nana', 'nana', 1.0], ['varia', 'variable', 1.2], ['noRequisito', 'equivale', 1.4]],
  // 5 · Klebsiella: perfiles
  [['clasico', 'clasico', 1.0], ['hiper', 'hipervirulento', 1.2], ['carba', 'carbapenenicos', 1.2], ['conv', 'convergente', 1.2]],
  // 6 · Cápsula y hierro
  [['capsula', 'capsula', 1.0], ['opsono', 'obsonizacion', 1.0], ['fago', 'phagocytosis', 1.0], ['comp', 'complemento', 1.0], ['sidero', 'cideroforos', 1.2], ['hif', 'if1al', 1.2], ['noSinonimo', 'sinonimos', 1.2]],
  // 7 · Especificidad del nicho
  [['gltA', 'glta', 1.2], ['higado', 'higado', 1.2], ['sangre', 'sangre', 1.2], ['sinExo', 'exotoxinas', 1.4]],
  // 8 · Pseudomonas: nichos húmedos
  [['humedo', 'humedos', 1.2], ['neumonia', 'neumonia', 1.2], ['quemadura', 'quemaduras', 1.2], ['ectima', 'ectima', 1.2]],
  // 9 · T3SS
  [['t3ss', 'sistema', 1.2], ['exou', 'exo', 1.0], ['exos', 'exo#2', 1.0], ['rara', 'rara', 1.4]],
  // 10 · Sin T3SS
  [['exla', 'la', 1.0], ['necrosis', 'necrosis', 1.2], ['lasb', 'exportada', 1.2], ['cadherinas', 'caderinas', 1.2]],
  // 11 · Acinetobacter: persistir
  [['superficies', 'superficies', 1.2], ['biopelicula', 'biopeliculas', 1.2], ['sangre', 'sangre', 1.2], ['mltb', 'mltb', 1.4]],
  // 12 · Evadir y adaptarse
  [['capsula', 'capsula', 1.0], ['plasminogeno', 'eplasminogeno', 1.2], ['hierro', 'hierro', 1.2], ['parecido', 'parece', 1.4]],
  // 13 · Otras especies
  [['serratia', 'serracia', 1.0], ['citrobacter', 'citrobacter', 1.0], ['proteus', 'proteus', 1.0], ['enterobacter', 'enterobacter', 1.0], ['kpc', 'neumonia', 1.0], ['acb', 'calcoaceticus', 1.2], ['noTodo', 'atribuir', 1.4]],
  // 14 · E. coli con BLEE
  [['farmaco', 'farmacos', 1.0], ['blee', 'bli', 1.0], ['hidroliza', 'hidroliza', 1.4], ['inhibidor', 'inhibidores', 1.2], ['carbapenem', 'carbapenemicos', 1.2]],
  // 15 · Klebsiella con carbapenemasa
  [['kpc', 'kpc', 1.0], ['avibactam', 'abibactam', 1.2], ['zinc', 'metalovetalactamasas', 1.0], ['ndm', 'ndm', 1.2], ['convergente', 'convergente', 1.2]],
  // 16 · Pseudomonas
  [['betalact', 'betalactamicos', 1.0], ['amino', 'aminoglucosidos', 1.0], ['fluoro', 'fluoroquinolonas', 1.0], ['polimixina', 'polimixinas', 1.0], ['eflujo', 'efflujo', 1.2], ['ampc', 'ampc', 1.0], ['porina', 'porinas', 1.2]],
  // 17 · Acinetobacter
  [['carba', 'carbapenemicos', 1.0], ['sulbactam', 'sulbactam', 1.0], ['oxa', 'oxa', 1.0], ['polimixina', 'polimixinas', 1.2]],
  // 18 · Pregunta de examen
  [['pregunta', 'examen', 1.0], ['toxinas', 'toxinas', 1.2], ['pseudo', 'seudomonas', 1.2], ['otras', 'cuales', 1.0], ['capsula', 'capsula', 0.9], ['hierro', 'hierro', 0.9], ['adaptacion', 'adaptacion', 1.2]],
];
