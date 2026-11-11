// Capítulo 1 · Quién, desde dónde y en qué fases.
export default [
  // 0 · Por qué importa
  [['mortalidad', 'mortalidad', 1.0], ['estancia', 'hospitalizaciones', 1.0], ['secuelas', 'secuelas', 1.0], ['varian', 'numeros', 1.0], ['pais', 'pais', 0.6], ['ano', 'ano', 0.6], ['foco', 'foco', 0.6], ['cepa', 'sepa', 0.6], ['universal', 'universales', 1.0]],
  // 1 · Vulnerables
  [['mayores', 'mayores', 1.0], ['criticos', 'criticos', 1.0], ['inmuno', 'inmunosuprimidos', 1.0], ['trasplante', 'trasplantados', 1.0], ['cancer', 'cancer', 1.0], ['mucosa', 'mucosa', 1.4]],
  // 2 · Exposición sanitaria
  [['dispositivos', 'dispositivos', 1.0], ['cirugia', 'cirugia', 0.9], ['estancia', 'hospitalizacion', 1.0], ['ventilacion', 'ventilacion', 1.0], ['antibioticos', 'antibioticos', 1.4]],
  // 3 · Reservorios
  [['intestino', 'intestino', 1.0], ['ecoli', 'escherichia', 0.9], ['kleb', 'eclepsiela', 0.9], ['agua', 'agua', 1.0], ['pseudo', 'pseudomonas', 1.0], ['equipos', 'equipos', 1.0], ['acineto', 'asinetobacter', 1.2]],
  // 4 · Tres fases
  [['fase1', 'primero', 0.9], ['adhesion', 'adhiere', 1.2], ['fase2', 'segundo', 0.9], ['cruza', 'atraviesa', 1.2], ['fase3', 'tercero', 0.9], ['sobrevive', 'supervivencia', 1.4]],
  // 5 · Cuatro puertas
  [['intestino', 'intestino', 1.0], ['urinario', 'urinario', 1.0], ['pulmon', 'pulmon', 1.0], ['piel', 'piel', 1.2], ['distinto', 'clave', 1.4]],
  // 6 · Dos membranas
  [['riesgo', 'farmacologia', 1.2], ['envoltura', 'membranas', 1.2], ['externa', 'externa', 1.0], ['porinas', 'porinas', 1.0], ['betalactamico', 'vetalactamicos', 1.6], ['vanco', 'vancomicina', 1.6], ['bloqueada', 'cruzar', 1.0], ['herramienta', 'herramienta', 1.0]],
];
