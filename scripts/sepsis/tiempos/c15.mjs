// Capítulo 15 · El pulmón: síndrome de dificultad respiratoria aguda (SDRA)
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · La barrera alvéolo-capilar y la batalla que empieza en ella
  [['pulmon', 'pulmon', 1.4], ['sdra', 'sdra', 1.4], ['aire', 'aire', 1.2], ['sangre', 'sangre', 1.2], ['barrera', 'barrera', 1.4], ['neumocitos', 'neumocitos', 1.4], ['endotelio', 'endotelio', 1.4], ['macrofagos', 'macrofagos', 1.4], ['epitelio', 'epitelio', 1.4], ['microbio', 'microbio', 1.4], ['tnf', 'tnf', 1.4], ['interleucinas', 'interleucinas', 2.4], ['neutrofilos', 'neutrofilos', 2.0], ['batalla', 'batalla', 1.2]],
  // 1 · Los neutrófilos descargan sus armas
  [['neutrofilos', 'neutrofilos', 1.4], ['descargan', 'descargan', 1.4], ['ros', 'especies', 1.4], ['proteasas', 'proteasas', 1.4], ['elastasas', 'elastazas', 1.4], ['nets', 'netes', 1.4], ['danan', 'danan', 1.4], ['glucocalix', 'glucocalix', 1.6], ['cadherina', 'caderina', 1.4], ['ocludinas', 'ocludinas', 1.4], ['zo', 'zo', 1.2], ['mismas', 'mismas', 1.4], ['microbio', 'microbio', 1.4], ['propia', 'propia', 1.4]],
  // 2 · El alvéolo se llena de líquido
  [['llena', 'llena', 1.4], ['barrera', 'barrera', 1.4], ['liquido', 'liquido#2', 1.4], ['intersticio', 'intersticio', 1.4], ['linfaticos', 'linfaticos', 1.4], ['abasto', 'abasto', 1.4], ['inunda', 'inunda', 2.0], ['edema', 'edema', 1.4], ['corazon', 'corazon', 1.4], ['cardiogenico', 'cardiogenico', 1.4], ['causa', 'causa', 1.4], ['barrera2', 'barrera#2', 0.6]],
  // 3 · El surfactante se pierde y el alvéolo colapsa
  [['mantiene', 'mantiene', 1.4], ['surfactante', 'surfactante', 1.4], ['pelicula', 'pelicula', 1.4], ['baja', 'baja', 1.4], ['neumocito', 'neumocito', 1.4], ['danado', 'danado', 1.4], ['fabrica', 'fabrica', 1.4], ['exudado', 'exudado', 1.4], ['diluye', 'diluye', 1.4], ['inactiva', 'inactiva', 1.4], ['tension', 'tension#2', 1.4], ['sube', 'sube', 1.4], ['paredes', 'paredes', 1.4], ['pegan', 'pegan', 1.8], ['menos', 'menos#2', 1.4]],
  // 4 · Por qué la sangre sale del pulmón sin oxígeno
  [['sale', 'sale', 1.4], ['tres', 'tres', 1.2], ['liquido', 'liquido', 1.4], ['difunde', 'difunde', 1.4], ['ventilacion', 'ventilacion', 1.4], ['perfusion', 'perfusion', 1.4], ['cortocircuito', 'cortocircuito', 1.4], ['rigido', 'rigido', 1.4], ['distiende', 'distiende', 1.4], ['saturacion', 'saturacion', 1.4], ['c86', '86', 1.4], ['respira', 'respira', 1.2], ['oxigena', 'oxigena#4', 1.2]],
  // 5 · Criterios de Berlín
  [['clasifica', 'clasifica', 1.4], ['berlin', 'berlin', 1.4], ['presion', 'presion', 1.4], ['oxigeno', 'oxigeno', 1.4], ['fraccion', 'fraccion', 1.4], ['pip', 'pip', 1.2], ['c5', '5', 1.2], ['leve', 'leve', 1.4], ['c201', '201', 1.4], ['moderado', 'moderado', 1.4], ['c101', '101', 1.4], ['grave', 'grave#2', 1.4], ['c100', '100', 1.4], ['abuela', 'abuela', 1.4], ['c180', '180', 1.4], ['opacidades', 'opacidades', 1.4], ['radiografia', 'radiografia', 1.4], ['sdr', 'sdr', 1.4]],
  // 6 · El ventilador y la presión positiva al final de la espiración
  [['ventilador', 'ventilador', 1.4], ['colapsados', 'colapsados', 1.4], ['pip', 'pip', 1.2], ['presion', 'presion', 1.4], ['final', 'final', 1.4], ['cierran', 'cierran', 1.4], ['reabren', 'reabren', 1.4], ['reclutan', 'reclutan', 1.4], ['superficie', 'superficie', 1.4], ['gases', 'gases', 1.4], ['puerta', 'puerta', 0.8]],
  // 7 · Lo que se ve al microscopio
  [['microscopio', 'microscopio', 1.4], ['difuso', 'difuso', 1.4], ['exudativa', 'exudativa', 1.4], ['edema', 'edema', 1.4], ['congestion', 'congestion', 1.4], ['hemorragia', 'hemorragia', 1.4], ['necrosis', 'necrosis', 1.4], ['infiltrado', 'infiltrado', 1.4], ['microtrombos', 'microtrombos', 1.4], ['pelicula', 'pelicula', 1.4], ['membranas', 'membranas', 1.4], ['tela', 'tela', 1.4]],
  // 8 · La reparación: salvar el pulmón o cicatrizarlo
  [['despues', 'despues', 1.4], ['reparacion', 'reparacion', 1.4], ['neumocitos', 'neumocitos', 1.4], ['multiplican', 'multiplican', 1.4], ['hiperplasia', 'hiperplacia', 1.4], ['cubrir', 'cubrir', 1.4], ['epitelio', 'epitelio', 1.4], ['cede', 'sede', 1.4], ['recupera', 'recupera', 1.4], ['persiste', 'persiste', 1.4], ['fibrosis', 'fibrosis', 1.4], ['salvar', 'salvar', 1.4], ['cicatrizarlo', 'cicatrizarlo', 0.9]],
];
