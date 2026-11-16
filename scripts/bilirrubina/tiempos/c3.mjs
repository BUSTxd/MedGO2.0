// Capítulo 3 · La entrada al hepatocito.
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · Llegar a la puerta
  [['higado', 'higado', 1.0], ['sinusoides', 'sinusoides', 1.2], ['poros', 'poros', 1.0], ['disse', 'espacio', 1.0], ['albumina', 'albumina', 1.6], ['suelta', 'suelta', 1.4], ['escolta', 'escolta', 1.0]],
  // 1 · ¿Cómo entra?
  [['membrana', 'membrana', 1.0], ['difusion', 'difusion', 1.2], ['discute', 'discute', 1.0], ['oatp', 'transportadores', 1.4], ['conjugada', 'conjugada', 1.0], ['puertas', 'puertas', 1.0]],
  // 2 · Las chaperonas
  [['chaperonas', 'chaperonas', 1.0], ['ligandina', 'ligandina', 1.2], ['fabp', 'grasos', 1.0], ['sujetan', 'sujetan', 1.2], ['reticulo', 'reticulo', 1.6]],
  // 3 · Ida y vuelta
  [['ida', 'ida', 1.0], ['vuelve', 'sangre', 1.0], ['retiene', 'retiene', 1.2], ['citosol', 'citosol', 1.0]],
  // 4 · El salto entre hepatocitos
  [['pasan', 'pasan', 1.0], ['periportales', 'periportales', 1.0], ['mrp3', 'sale', 1.2], ['centro', 'centro', 1.0], ['recapta', 'recapta', 1.2], ['reparte', 'reparte', 1.0]],
  // 5 · Síndrome de Rotor
  [['rotor', 'rotor', 1.0], ['fallan', 'fallan', 1.6], ['sangre', 'sangre', 2.0], ['leve', 'leve', 1.0], ['benigna', 'benigna', 0.8], ['color', 'color', 1.0]],
  // 6 · Fármacos en la puerta
  [['bloquear', 'bloquear', 1.0], ['rifampicina', 'rifampicina', 1.2], ['sube', 'sube', 1.4], ['sano', 'danado', 1.0], ['transformar', 'transformarla', 1.0]],
];
