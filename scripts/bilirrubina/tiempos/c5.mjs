// Capítulo 5 · La salida a la bilis.
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · La puerta de salida
  [['sale', 'sale', 1.0], ['bomba', 'bomba', 1.2], ['canaliculo', 'canaliculo', 1.2], ['nace', 'nace', 1.0], ['atp', 'atp', 1.0]],
  // 1 · Cuesta arriba
  [['cuesta', 'cuesta', 1.4], ['gradiente', 'gradiente', 1.0], ['lento', 'lento', 1.0], ['dana', 'dana', 1.0], ['acumula', 'acumula', 1.2]],
  // 2 · No es exclusiva
  [['solo', 'saca', 1.0], ['farmacos', 'farmacos', 1.0], ['metabolitos', 'metabolitos', 1.0], ['compartida', 'compartida', 1.0]],
  // 3 · La bilis
  [['sales', 'sales', 0.8], ['colesterol', 'colesterol', 0.8], ['fosfolipidos', 'fosfolipidos', 0.8], ['agua', 'agua', 0.8], ['micelas', 'miselas', 1.4], ['regla', 'regla', 1.0]],
  // 4 · Un tránsito imperfecto
  [['imperfecto', 'imperfecto', 1.0], ['refluye', 'refluye', 1.0], ['albumina', 'albumina', 1.0], ['destinos', 'destinos', 1.0], ['recaptan', 'recaptan', 1.0], ['rinon', 'rinon', 1.0]],
  // 5 · Por los conductos
  [['tramo', 'tramo', 1.0], ['conductos', 'conductos', 1.0], ['coledoco', 'coledoco', 1.0], ['duodeno', 'duodeno', 1.0], ['modifica', 'modifica', 1.0], ['vesicula', 'vesicula', 1.2], ['intestino', 'intestino', 1.2]],
];
