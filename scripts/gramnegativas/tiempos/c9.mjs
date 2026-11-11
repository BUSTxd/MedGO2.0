// Capítulo 9 · Comparar, resistencia y leer la evidencia.
export default [
  // 0 · Patógenos entéricos lado a lado
  [['typhi', 'tiffy', 0.9], ['typhimurium', 'murion', 0.9], ['epec', 'eps', 0.9], ['shigella', 'shigela', 0.9], ['cholerae', 'vibrio', 0.9], ['hpylori', 'helicobacter', 0.9], ['campy', 'campilobacter', 0.9], ['yersinia', 'yersinia', 0.9], ['clostridios', 'clostridios', 1.2]],
  // 1 · Ejes compartidos
  [['capsula', 'capsula', 1.0], ['adhesion', 'adhesinas', 1.0], ['hierro', 'cideroforos', 1.0], ['metabolismo', 'flexibilidad', 1.0], ['toxinas', 'toxinas', 1.4]],
  // 2 · Resistencia en cinco ideas
  [['blee', 'bli', 1.0], ['ampc', 'ampes', 1.0], ['carbapenemasas', 'carbapenemazas', 1.0], ['eflujo', 'eflujo', 1.0], ['moviles', 'elementos', 1.2]],
  // 3 · Resistencia ≠ virulencia
  [['resistencia', 'resistencia', 1.0], ['virulencia', 'virulencia', 1.0], ['converger', 'converger', 1.2], ['noDemuestra', 'detectar', 1.4], ['terapia', 'terapia', 1.4]],
  // 4 · Cada mecanismo, un fármaco que falla
  [['blee', 'bli', 1.0], ['ampc', 'ampes', 1.0], ['carba', 'carbapenemazas', 1.0], ['eflujo', 'eflujo', 1.0], ['varias', 'varias', 1.2]],
  // 5 · Mecanismo, no receta
  [['cultivo', 'cultivo', 1.0], ['antibiograma', 'antibiograma', 1.0], ['desescalar', 'desescala', 1.2], ['foco', 'foco', 1.0], ['guia', 'guia', 1.4]],
  // 6 · Modelos experimentales
  [['respiratorio', 'respiratorio', 1.0], ['urinario', 'urinario', 1.0], ['intravenoso', 'intravenoso', 1.0], ['intraperitoneal', 'intraperitoneal', 1.0], ['suero', 'suero', 1.0], ['organoides', 'organoides', 1.0]],
  // 7 · Cada modelo omite algo
  [['iv', 'intravenoso', 1.0], ['resp', 'respiratorio', 1.0], ['suero', 'suero', 1.0], ['organoide', 'organoides', 1.0]],
  // 8 · Cuello de botella
  [['embudo', 'botella', 1.0], ['azar', 'azar', 1.4], ['higado', 'higado', 1.2], ['noSangre', 'equivale', 1.4], ['humana', 'sangre', 1.0]],
  // 9 · Cómo leer un hallazgo
  [['especie', 'especie', 0.9], ['huesped', 'wesped', 0.9], ['foco', 'foco', 0.9], ['fase', 'fase', 0.9], ['inoculo', 'inoculo', 0.9], ['variable', 'variable', 0.9], ['raton', 'raton', 1.2], ['humano', 'humanos', 1.4]],
  // 10 · Volver a ella
  [['ella', 'ella', 1.0], ['quimio', 'quimioterapia', 1.0], ['moco', 'moco', 1.0], ['uniones', 'uniones', 1.0], ['cruza', 'cruza', 1.0], ['endotoxina', 'endotoxina', 1.2], ['sofa', 'sofas', 1.2], ['tratamiento', 'antibiotico', 1.4]],
  // 11 · Volver a él
  [['el', 'el', 0.9], ['pulmon', 'pulmon', 1.2], ['t3ss', 'sistema', 1.0], ['lasb', 'lasve', 1.0], ['barrera', 'barrera', 1.2], ['sangre', 'sangre', 1.2], ['cierre', 'pacientes', 1.4], ['foco', 'farmaco', 1.4]],
];
