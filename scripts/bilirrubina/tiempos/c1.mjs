// Capítulo 1 · Del hemo a la bilirrubina.
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · Cuánta se fabrica
  [['cuanta', 'cuanta', 1.0], ['mg', '250', 1.8], ['kilo', 'kilo', 1.0], ['hemo', 'hemo', 1.0]],
  // 1 · El 80 %
  [['viejos', 'cementerio', 1.0], ['ochenta', '80', 1.4], ['dias', 'dias', 1.0], ['macrofago', 'macrofagos', 1.0], ['bazo', 'vaso', 0.9], ['higado', 'higado', 0.9], ['kupffer', 'celulas', 0.9], ['medula', 'medula', 0.9]],
  // 2 · El otro 20 %
  [['veinte', '20', 1.2], ['mioglobina', 'mioglobina', 1.0], ['citocromos', 'citocromos', 1.0], ['catalasas', 'catalasas', 1.0], ['medula', 'mueren', 1.0], ['ineficaz', 'ineficaz', 1.6]],
  // 3 · Desarmar la hemoglobina
  [['macrofago', 'macrofago', 1.0], ['desarma', 'desarma', 1.4], ['globina', 'globina', 1.2], ['aminoacidos', 'aminoacidos', 1.0], ['hierro', 'hierro', 1.4], ['recicla', 'recicla', 1.0], ['anillo', 'anillo', 1.2]],
  // 4 · La tijera: hemo oxigenasa
  [['tijera', 'tijera', 1.0], ['reticulo', 'reticulo', 1.0], ['oxigeno', 'usa oxigeno', 1.0], ['nadph', 'nadph', 1.0], ['corta', 'corta', 1.6], ['biliverdina', 'biliverdina', 1.0], ['hierro', 'hierro', 1.2], ['co', 'monoxido', 1.2], ['versiones', 'versiones', 1.2]],
  // 5 · La única fábrica de CO
  [['co', 'monoxido', 1.0], ['unica', 'unica', 1.0], ['exhalas', 'exhalas', 1.0], ['recien', 'recien', 1.0], ['hemolisis', 'hemolisis', 1.2]],
  // 6 · Biliverdina reductasa
  [['reductasa', 'reductasa', 1.0], ['nadph', 'nadph', 1.0], ['bilirrubina', 'bilirrubina', 1.4], ['amarillo', 'amarillo', 1.0], ['moreton', 'moreton', 1.4]],
  // 7 · ¿Por qué tomarse la molestia?
  [['pregunta', 0.2, 0.8], ['soluble', 'soluble', 1.0], ['aves', 'aves', 1.0], ['hipotesis', 'hipotesis', 1.0], ['antiox', 'antioxidante', 1.0], ['placenta', 'placenta', 1.0], ['madre', 'madre', 1.0], ['viajar', 'viajar', 1.0]],
];
