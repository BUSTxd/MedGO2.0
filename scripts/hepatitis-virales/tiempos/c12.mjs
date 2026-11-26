// Capítulo 12 · Caso 1: el brote
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · Seis semanas después
  [['semanas', 'semanas', 1.2], ['empeora', 'empeora', 1.2], ['fatiga', 'fatiga', 1.2], ['apetito', 'apetito', 1.0], ['orina', 'orina', 1.0], ['ojos', 'ojos', 1.2], ['alcohol', 'alcohol', 1.0], ['hierbas', 'hierbas', 1.0], ['farmacos', 'farmacos', 1.2], ['alt', 'alt', 1.4], ['ast', 13.66, 1.2], ['bili', 'bilirrubina', 1.4], ['directa', 'directa', 1.2], ['inr', 'inr', 1.2], ['debil', 'debil', 1.2], ['adn', 'adn', 1.4], ['cambio', 'cambio', 0.8]],
  // 1 · Una reagudización, no una hepatitis aguda
  [['pregunta', 'aguda', 1.2], ['no', 2.05, 1.0], ['reagud', 'reagudizacion', 1.4], ['cronica', 'cronica', 1.2], ['brote', 'brote', 1.0], ['inmuno', 'inmunomediado', 1.4], ['igm', 'igm', 1.2], ['debil', 'debil', 1.0], ['adn', 'adn', 1.2], ['sube', 'sube', 1.2], ['carga', 'carga', 1.0], ['antes', 'antes', 1.0], ['pico', 'pico', 1.0], ['nuevo', 22.8, 0.8]],
  // 2 · Citólisis masiva
  [['pregunta', 'ocurre', 1.2], ['linfocitos', 'linfocitos', 1.2], ['matan', 'matan', 1.4], ['perforinas', 'perforinas', 1.0], ['granzimas', 'granzimas', 1.0], ['rompen', 'rompen', 1.2], ['enzimas', 'enzimas', 1.0], ['sinusoides', 'sinusoides', 1.2], ['masa', 'masa', 1.2], ['citosol', 'citosol', 1.0], ['dura', 'dura', 1.0], ['alt2', 'alt#2', 1.0], ['encima', 'encima', 1.0], ['ritis', 'ritis', 1.0], ['r068', '68', 1.0]],
  // 3 · La IgM que reaparece
  [['igm', 'igm', 1.0], ['reaparece', 'reaparece', 1.2], ['destruccion', 'destruccion', 1.0], ['masiva', 'masiva', 1.0], ['antigeno', 'antigenocore', 1.2], ['sangre', 'sangre', 1.0], ['reestimula', 'reestimula', 1.2], ['memoria', 'memoria', 1.0], ['fabrican', 'fabrican', 1.0], ['igm2', 'igm#2', 1.2], ['nueva', 'nueva', 1.0], ['misma', 'misma', 1.0], ['reencendida', 'reencendida', 0.8]],
  // 4 · Bilirrubina, orina y heces
  [['bili', 'bilirruina', 1.2], ['directa', 'directa', 1.2], ['nosale', 'sale', 1.2], ['refluye', 'refluye', 1.2], ['escleras', 'escleras', 1.2], ['orina', 'orina', 1.2], ['rinon', 'rinon', 1.2], ['heces', 'espalidas', 1.2], ['inr', 'inr', 1.0], ['avisa', 'avisa', 1.2], ['senales', 'señales', 1.0], ['solo', 'higado', 0.8]],
  // 5 · ¿Qué enciende un brote?
  [['pregunta', 'enciende', 1.2], ['espontaneo', 'espontaneo', 1.2], ['fase', 'fase', 1.0], ['inmuno', 'inmunosupresion', 1.4], ['retirarla', 'retirarla', 1.2], ['rituximab', 'rituximab', 1.0], ['quimio', 'quimioterapia', 1.0], ['esteroides', 'esteroides', 1.0], ['analogos', 'analogos', 1.2], ['delta', 'delta', 1.0], ['otro', 'otro', 1.2], ['historia', 'historia', 0.8]],
  // 6 · La línea roja
  [['brote', 'brote', 1.0], ['falla', 'falla', 1.2], ['ictericia', 'ictericia', 1.0], ['inr', 'inr', 1.0], ['encef', 'encefalopatia', 1.4], ['paciente', 'paciente', 1.0], ['cerca', 'cerca', 1.0], ['tratar', 'tratarlo', 1.0], ['analogos', 'analogos', 1.2], ['ojo', 'ojo', 1.0], ['grave', 'grave', 1.2], ['mayoria', 'mayoria', 1.2], ['observa', 'observa', 0.8]],
];
