// Capítulo 11 · Infecciones oportunistas y VIH avanzado
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · Oportunistas y la escalera de CD4
  [['oportunistas', 'oportunistas', 1.4], ['sana', 'sana', 1.0], ['orden', 'orden', 1.2], ['n500', '500', 1.0], ['tb', 'tuberculosis', 1.0], ['zoster', 'herpesoster', 1.0], ['cand', 'candidiasis', 1.0], ['n200', '200', 1.0], ['pj', 'neumocistis', 1.2], ['n100', '100', 1.0], ['toxo', 'toxoplasmosis', 1.0], ['crip', 'criptococosis', 1.0], ['n50', '50', 1.0], ['cmv', 'citomegalovirus', 1.0], ['mac', 'avium', 1.0]],
  // 1 · Tuberculosis, con cualquier CD4
  [['tuberculosis', 'tuberculosis', 1.2], ['riesgo', 'riesgo', 1.2], ['enfermedad', 'enfermedad', 1.2], ['cd4', 'cd4#2', 1.2], ['interferon', 'interferon', 1.2], ['granuloma', 'granuloma', 1.4], ['rompe', 'rompe', 1.6], ['menos', 'menos', 1.0], ['extrapulmonar', 'fuera', 1.2], ['diseminada', 'diseminada', 1.4], ['busca', 'busca', 1.0], ['previene', 'previene', 1.0]],
  // 2 · Kaposi y linfoma
  [['tumores', 'tumores', 1.2], ['sarcoma', 'sarcoma', 1.2], ['herpesvirus', 'herpesvirus', 1.2], ['controla', 'controla', 1.2], ['manchas', 'manchas', 1.0], ['nodulos', 'nodulos', 1.0], ['piel', 'piel', 1.0], ['microscopio', 'microscopio', 1.2], ['fusiformes', 'fusiformes', 1.2], ['hendidura', 'hendidura', 1.2], ['globulos', 'globulos', 1.2], ['linfomas', 'linfomas', 1.2], ['linfoma', 'linfoma#2', 1.4], ['cerebro', 'cerebro', 1.2], ['epstein', 'epstein', 1.0]],
  // 3 · Pneumocystis: el hongo y el alvéolo
  [['protagonista', 'protagonista', 1.2], ['hongo', 'hongo', 1.0], ['pegado', 'pegado', 1.2], ['neumocitos', 'neumocitos', 1.2], ['alveolo', 'alveolo', 1.2], ['llenan', 'llenan', 1.0], ['espumoso', 'espumoso', 1.4], ['paredes', 'paredes', 1.2], ['plata', 'plata', 1.0], ['quistes', 'quistes', 1.2], ['pingpong', 'ping', 1.2], ['lavado', 'lavado', 1.2], ['esputo', 'esputo', 1.0], ['radiografia', 'radiografia', 1.2], ['difusos', 'difusos', 1.2]],
  // 4 · Tos seca, disnea e hipoxemia
  [['seca', 'seca', 1.2], ['inflamacion', 'inflamacion', 1.2], ['intersticio', 'intersticio', 1.2], ['vias', 'vias', 1.2], ['falta', 'falta', 1.2], ['engrosado', 'engrosado', 1.4], ['material', 'material', 1.2], ['difunde', 'difunde', 1.2], ['hipoxemia', 'hipoxemia', 1.2], ['saturacion', 'saturacion', 1.2], ['n89', '89', 1.2], ['compensar', 'compensar', 1.2], ['rapido', 'rapido', 1.2], ['n26', '26', 1.0], ['corazon', 'corazon', 1.2], ['n112', '112', 1.2]],
  // 5 · Crepitantes sin consolidación
  [['consolidacion', 'consolidacion', 1.2], ['lobulo', 'lobulo', 1.2], ['bacteriana', 'bacteriana', 1.2], ['pj', 'neumocistis', 1.2], ['difusa', 'difusa', 1.2], ['intersticio', 'intersticio', 1.2], ['oyen', 'oyen', 1.0], ['crepitantes', 'crepitantes', 1.0], ['finos', 'finos', 1.2], ['foco', 'foco', 1.2], ['peso', 'peso', 1.0], ['inflamacion', 'inflamacion', 1.0], ['fiebre', 'fiebre', 1.0], ['gasto', 'gasto', 1.0], ['anorexia', 'anorexia', 1.0], ['n85', '85', 1.2], ['sida', 'sida', 1.0]],
  // 6 · Tratamiento y profilaxis
  [['trata', 'trata', 1.2], ['tmp', 'trimetoprimasulfametoxazol', 1.4], ['n21', '21', 1.6], ['hipoxemia', 'hipoxemia', 1.2], ['n70', '70', 1.4], ['corticoides', 'corticoides', 1.2], ['profilaxis', 'previene', 1.2], ['n200', '200', 1.2], ['misma', 'misma', 1.2], ['suspende', 'suspende', 1.2], ['recupera', 'recupera', 1.8], ['tar', 'antirretroviral', 1.0]],
  // 7 · VIH avanzado y el paquete de la OMS
  [['avanzado', 'avanzado', 1.2], ['n200', '200', 1.0], ['estadio', 'estadio', 1.0], ['e3', '3', 0.8], ['e4', '4', 0.8], ['paquete', 'paquete', 1.2], ['buscar', 'buscar', 1.0], ['tb', 'tuberculosis', 1.0], ['crip', 'criptococo', 1.0], ['antes', 'antes', 1.0], ['profilaxis', 'profilaxis', 1.2], ['iniciar', 'iniciar', 1.2], ['antes2', 'antes#2', 1.0], ['apoyar', 'apoyar', 1.0], ['adherencia', 'adherencia', 1.2], ['idea', 'idea', 1.0], ['tarde', 'tarde', 1.2]],
  // 8 · Síndrome inflamatorio de reconstitución inmune
  [['reconstitucion', 'reconstitucion', 1.4], ['primeras', 'primeras', 1.2], ['escondida', 'escondida', 1.2], ['visible', 'visible', 1.2], ['trataba', 'trataba', 1.0], ['empeora', 'empeora', 1.2], ['suben', 'suben', 1.2], ['baja', 'baja', 1.2], ['reacciona', 'reacciona', 1.4], ['fallo', 'fallo', 1.2], ['caso', 'caso', 1.0], ['subio', 'subio', 1.0], ['bajaron', 'bajaron', 1.2]],
];
