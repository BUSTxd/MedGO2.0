// Capítulo 6 · Cuando la barrera falla: bacteriemia y sepsis.
export default [
  // 0 · Flujo en los dos sentidos
  [['flujo', 'barrera', 1.0], ['haciaLuz', 'salen', 1.4], ['haciaSangre', 'bacterias', 1.6], ['diarrea', 'diarrea', 1.4]],
  // 1 · Escapan también los comensales
  [['escapan', 'escapan', 1.0], ['nicho', 'organismo', 1.0], ['beneficioso', 'beneficioso', 1.2], ['perjudicial', 'perjudicial', 1.0], ['fuera', 'fuera', 1.2]],
  // 2 · Daño sin invasión
  [['toxinas', 'distancia', 1.0], ['circulan', 'circulantes', 1.4], ['organos', 'organos', 1.4], ['sinBacteria', 'bacteria', 1.4]],
  // 3 · El riñón
  [['rinon', 'rinon', 1.0], ['stx', 'sts', 1.2], ['endotelio', 'endotelio', 1.2], ['shu', 'sindrome', 1.4], ['endotoxina', 'cooperacion', 1.4]],
  // 4 · Otros contenidos luminales
  [['glucano', 'glucano', 1.0], ['proteasas', 'proteasas', 1.0], ['cdiff', 'clostridioides', 1.0], ['plasminogeno', 'plasminogeno', 1.0], ['plasmina', 'plasmina', 1.2]],
  // 5 · El círculo
  [['tnf', 'necrosis', 1.0], ['il1', 'interleucina', 0.9], ['il6', 'interleucina#2', 0.9], ['abre', 'alteran', 1.2], ['circulo', 'circulo', 1.4], ['perm', 'permeabilidad', 1.2]],
  // 6 · Gravedad
  [['numero', 'gravedad', 1.0], ['foco', 'foco', 0.9], ['toxinas', 'toxinas', 0.9], ['reserva', 'reserva', 0.9], ['respuesta', 'respuesta', 0.9], ['negativo', 'sinemocultivos', 1.4]],
  // 7 · Sepsis-3
  [['disfuncion', 'cepsis', 1.2], ['sofa', 'sofa', 1.4], ['dos', 'menos', 1.2], ['noEscala', 'escala', 1.4]],
  // 8 · qSOFA y choque séptico
  [['fr', 'frecuencia', 1.0], ['pas', 'presion', 1.0], ['mental', 'mental', 1.0], ['dosOMas', 'riesgo', 1.2], ['choque', 'choque', 1.2], ['pam', 'media', 1.2], ['lactato', 'lactato', 1.2]],
  // 9 · La primera hora
  [['farmaco', 'principios', 1.0], ['hemocultivos', 'emocultivos', 1.0], ['antibiotico', 'antibiotico#2', 1.0], ['cristaloides', 'cristaloides', 1.0], ['noradrenalina', 'noradrenalina', 1.0], ['guia', 'guia', 1.4]],
  // 10 · Sin control del foco
  [['foco', 'control', 1.0], ['drenar', 'drenar', 1.0], ['absceso', 'absceso', 1.0], ['cateter', 'cateter', 1.2], ['ajusta', 'reajusta', 1.2], ['cultivo', 'cultivo', 1.2]],
];
