// Capítulo 10 · La serología del VHB
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · Los marcadores, uno por uno
  [['pregunta', 'mide', 1.4], ['hbsag', 'hbs', 1.2], ['activa', 'activa', 1.2], ['antihbs', 'anti', 1.2], ['inmunidad', 'inmunidad', 1.2], ['hbcag', 10.1, 1.2], ['antihbc', 'anti#2', 1.2], ['total', 'total', 0.9], ['igm', 'higeme', 1.0], ['hbeag', 15.72, 1.0], ['antihbe', 'anti#3', 1.0], ['replicacion', 'replicacion', 1.2], ['adn', 'adn', 1.0], ['cuanto', 'cuanto#2', 0.9]],
  // 1 · La curva de la infección aguda
  [['curva', 'curva', 1.4], ['adn', 'adn', 1.4], ['mes1', 'mes', 1.0], ['hbsag', 'hbs', 1.4], ['hbeag', 8.1, 1.2], ['alt', 'transaminazas', 1.4], ['sintomas', 'sintomas', 1.0], ['igm', 'higm', 1.4], ['mes25', 'medio', 1.0], ['cae', 'cae', 1.2], ['antihbs', 'asoma', 1.4], ['carrera', 'carrera', 1.0]],
  // 2 · El período de ventana
  [['intervalo', 'intervalo', 1.2], ['ventana', 'ventana', 1.2], ['hbsag', 'hbs', 1.4], ['desaparecio', 'desaparecio', 1.0], ['antihbs', 'anti', 1.2], ['todavia', 'todavia', 1.0], ['miras', 'miras', 1.0], ['nada', 'nada', 0.8], ['igm', 'higm', 1.2], ['unico', 'unico', 1.0], ['confirma', 'confirma', 1.0], ['reciente', 'reciente', 1.0], ['siempre', 'siempre', 0.8]],
  // 3 · Vacunado y curado
  [['pregunta', 'vacunado', 1.6], ['vac', 'vacunado#2', 1.0], ['solo', 'solo', 1.0], ['antihbs', 'hbs', 1.0], ['positivo', 'positivo', 1.0], ['curado', 'curado#2', 1.0], ['antihbs2', 'hbs#2', 1.0], ['antihbc', 9.4, 1.0], ['total', 'total', 1.0], ['hbsagneg', 11.7, 1.0], ['igg', 'hig', 1.2], ['vida', 'vida', 1.0], ['cicatriz', 'cicatriz', 1.2], ['mismo', 'mismo', 1.4], ['dos', 'dos', 1.0]],
  // 4 · El patrón de la infección crónica
  [['patron', 'patron', 1.4], ['cronica', 'cronica', 1.2], ['hbsag', 'hbs', 1.2], ['seis', 4.6, 1.2], ['total', 'total', 1.0], ['igm', 'hgm', 1.0], ['antihbs', 'anti#2', 1.2], ['hbeag', 12.85, 1.0], ['fase', 'fase', 1.0], ['consulta', 'consulta', 1.0], ['paciente', 'paciente', 1.0], ['conoces', 'conoces', 0.8]],
  // 5 · Anti-HBc aislado e infección oculta
  [['pregunta', 'significa', 1.4], ['aislado', 'aislado', 1.2], ['todo', 'todo', 1.2], ['ventana', 'ventana', 1.0], ['antigua', 'antigua', 1.0], ['decayo', 'decayo', 1.0], ['falso', 'falso', 1.0], ['oculta', 'oculta', 1.0], ['adn', 'adn', 1.2], ['importa', 'importa', 1.0], ['reactivarse', 'reactivarse', 1.2], ['inmuno', 'inmunosupresion', 1.4], ['ignorar', 'ignorar', 0.8]],
  // 6 · HBsAg cuantitativo y ADN
  [['cuant', 'cuantitativo', 1.2], ['distinguir', 'distinguir', 1.2], ['portador', 'portador', 1.2], ['adn', 'adn', 1.2], ['replicacion', 'replicacion', 1.2], ['oms', 'organizacion', 1.2], ['punto', 'punto', 1.4], ['refleja', 'refleja', 1.2], ['positivo', 'positivo', 1.2], ['viajes', 'viajes', 1.0], ['diagnosticos', 'diagnosticos', 0.9]],
  // 7 · Tamizar con tres marcadores
  [['pruebas', 'pruebas', 1.4], ['adulto', 'adulto', 1.0], ['vida', 'vida', 1.0], ['cdc', 'cdc', 1.2], ['hbsag', 'hbs', 1.2], ['antihbs', 'hbs#2', 1.0], ['antihbc', 9.7, 1.0], ['total', 'total', 1.0], ['infectado', 'infectado', 1.0], ['inmune', 'inmune', 1.0], ['susceptible', 'susceptible', 1.2], ['vacunarlo', 'vacunarlo', 1.0], ['muestra', 'muestra', 1.0], ['respuestas', 'respuestas', 0.9]],
];
