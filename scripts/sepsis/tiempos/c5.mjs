// Capítulo 5 · La señal entra: MyD88, NF-κB e inflamasoma
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · Del receptor al adaptador
  [['tlr4', 'tlr4', 1.4], ['lps', 'lps', 1.2], ['nucleo', 'nucleo', 1.8], ['cola', 'cola', 1.4], ['tir', 'tir', 1.4], ['iman', 'iman', 2.0], ['adaptadores', 'adaptadores', 1.6], ['relevo', 'relevo', 1.0]],
  // 1 · MyD88
  [['adaptador', 'adaptador', 1.4], ['myd88', '88', 1.6], ['todos', 'todos', 1.6], ['il1', 'interleucina', 2.0], ['cinasas', 'cenasas', 1.4], ['irak', 'irak', 1.4], ['irak2', 'irak#2', 1.4], ['autopista', 'autopista', 1.4]],
  // 2 · La cadena de relevos
  [['reveles', 'relevos', 1.4], ['irak', 'irak', 1.2], ['traf6', 'trav6', 1.4], ['tak1', 'attack1', 1.4], ['ikk', 'icaca', 1.4], ['mecha', 'mecha', 2.0], ['tres', '3', 1.4]],
  // 3 · El candado IκB
  [['nfkb', 'kb', 1.4], ['preso', 'preso', 1.4], ['candado', 'candado', 1.4], ['ikb', 'ikb', 1.4], ['ikk', 'icaca', 1.4], ['fosfatos', 'fosfatos', 1.6], ['ub', 'ubiquitina', 1.6], ['proteasoma', 'proteasoma', 1.6], ['destruye', 'destruye', 1.4], ['libre', 'libre', 1.4]],
  // 4 · NF-κB en el núcleo
  [['poro', 'poro', 1.6], ['adn', 'adn', 1.2], ['genes', 'genes', 1.2], ['tnf', 'tnf', 1.4], ['adhesion', 'adhesion', 1.2], ['inos', 'hinos', 1.2], ['tisular', 'tisular', 1.2], ['cuatro', 'cuatro', 1.6]],
  // 5 · La otra puerta: TRIF
  [['solo', 'solo', 1.4], ['segunda', 'segunda', 1.4], ['endosoma', 'endosoma', 1.6], ['trif', 'trif', 1.4], ['tnf', 'tnf', 1.2], ['interferones', 'interferones', 1.6], ['inflamatoria', 'inflamatoria', 1.4], ['antiviral', 'antiviral', 1.4]],
  // 6 · Falta una segunda señal
  [['pro', 'prointerleucina', 1.4], ['nada', 'nada', 1.4], ['precursor', 'precursor', 1.4], ['segunda', 'segunda', 1.4], ['atp', 'atp', 1.2], ['potasio', 'potasio', 1.2], ['toxinas', 'toxinas', 1.2], ['cristales', 'cristales', 1.2], ['llaves', 'llaves', 1.4], ['roce', 'roce', 1.4]],
  // 7 · El inflamasoma
  [['quien', 'quien', 1.2], ['inflamasoma', 'inflamazoma', 1.4], ['nlrp3', 'nlrp3', 2.0], ['rueda', 'rueda', 1.4], ['caspasa', 'caspasa', 1.4], ['corta', 'corta', 2.0], ['il18', '18', 1.2], ['maduras', 'maduras', 1.6]],
  // 8 · Piroptosis
  [['gasdermina', 'gasdermina', 1.4], ['perforan', 'perforan', 1.6], ['globo', 'globo', 1.4], ['salen', 'salen', 1.6], ['estalla', 'estalla', 1.4], ['piroptosis', 'piroptosis', 1.6], ['damps', 'damps', 1.6], ['fuego', 'fuego', 1.4]],
];
