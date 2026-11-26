// Capítulo 14 · El carcinoma: imagen, biopsia y vigilancia
// Por paso: [parámetro de la lámina, palabra clave (o segundos), duración en s].
export default [
  // 0 · La ecografía: un nódulo de 2,8 cm
  [['ecografia', 'ecografia', 1.2], ['lesion', 'lesion', 1.0], ['solida', 'solida', 1.0], ['cm', 'centimetros', 1.0], ['heterogenea', 'heterogenea', 1.2], ['contornos', 'contornos', 1.2], ['segmento', 'segmento', 1.4], ['expansion', 'expansion', 1.2], ['desplaza', 'desplaza', 1.2], ['heterogeneo', 15.3, 1.4], ['necrosis', 'necrosis', 1.0], ['grasa', 'grasa', 1.0], ['nota', 'nota', 0.5]],
  // 1 · Cuando entra el contraste
  [['contraste', 'contraste', 1.2], ['sano', 'sano', 1.2], ['porta', 'venaporta', 1.2], ['carcinoma', 'carcinoma', 1.0], ['arteria', 'arteria', 1.2], ['contraste2', 'contraste#2', 1.0], ['realza', 'realza', 1.2], ['arterial', 'arterial#2', 1.0], ['lava', 'lava', 1.0], ['sugiere', 'sugiere', 1.0]],
  // 2 · ¿Por qué se biopsió?
  [['biopsia', 'biopsia', 1.2], ['sin', 'cirrosis', 1.0], ['imagenes', 'imagenes', 1.0], ['seguras', 'seguras', 1.0], ['confirmacion', 'confirmacion', 1.0], ['tejido', 'tejido', 1.2], ['paciente', 'paciente', 1.0], ['signos', 'signos', 1.2], ['hipertension', 'hipertension', 1.2], ['dirigida', 'dirigida', 1.2], ['palabra', 'palabra', 0.7]],
  // 3 · Trabéculas que engordan
  [['patologo', 'patologo', 1.0], ['normal', 'normal', 1.0], ['trabeculas', 'trabeculas', 1.2], ['dos', 4.3, 1.0], ['carcinoma', 'carcinoma', 1.0], ['tres', 'tres', 1.0], ['atipicos', 'atipicos', 1.2], ['nucleos', 'nucleos', 1.0], ['pleomorfismo', 'pleomorfismo', 1.2], ['pierde', 'pierde', 1.0], ['lobulillos', 'lobulillos', 1.2], ['triadas', 'triadas', 1.0], ['engordan', 'engordan', 0.7]],
  // 4 · La reticulina que desaparece
  [['pista', 'pista', 1.0], ['reticulina', 'reticulina', 1.2], ['red', 2.7, 1.0], ['sostiene', 'sostiene', 1.2], ['destruye', 'destruye', 1.2], ['tumor', 'tumor', 1.0], ['tincion', 'tincion', 1.0], ['dudosos', 'dudosos', 1.0], ['inmuno', 'inmunoistoquimica', 1.2], ['glipicano', 'glipicano', 1.2], ['sospechar', 'sospechar', 0.7]],
  // 5 · Vigilar cada seis meses
  [['riesgo', 'riesgo', 1.0], ['cirrosis', 'cirrosis', 1.0], ['hepatitisb', 'hepatitis', 1.2], ['ecografia', 'ecografia', 1.0], ['afp', 'alfafetoproteina', 1.4], ['seis', 'seis', 1.0], ['page', 'page', 1.0], ['edad', 'edad', 0.8], ['sexo', 'sexo', 0.8], ['plaquetas', 'plaquetas', 1.0], ['decidir', 'decidir', 1.0], ['pronostico', 'pronostico', 0.7]],
];
