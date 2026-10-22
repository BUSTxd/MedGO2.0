/**
 * Los laboratorios del índice, por curso. Lo leen el índice del dashboard
 * (`dashboard/laboratorio/page.tsx`, que le pone a cada curso su ícono) y la
 * interfaz de estudio (`src/lib/estudio/laboratorios.ts`). Un laboratorio nuevo
 * se añade aquí una sola vez.
 *
 * `prueba`: a dónde lleva la fila a quien NO tiene el plan del panel, cuando el
 * laboratorio tiene una parte gratis (hoy, el examen 3D del miembro superior:
 * `?examen=1` entra sin LabGate). Sin ella, esa persona caería en la pasarela.
 */
export type ExperimentoLab = { name: string; desc: string; color: string; href?: string; prueba?: string };
export type TemaLab = { id: string; title: string; badge: string; diff: string[]; experiments: ExperimentoLab[] };

export const LAB_TOPICS: TemaLab[] = [
  {
    id: 'microbiologia',
    title: 'Microbiología | UPCH',
    badge: 'Microbiología',
    diff: ['easy'],
    experiments: [
      { name: 'Atlas Micología',      desc: 'Identificación microscópica de hongos clínicos',        color: '#2DC99A', href: '/dashboard/laboratorio/atlas-micologia' },
      { name: 'Atlas Parasitología',  desc: 'Identificación de parásitos clínicamente relevantes',   color: '#F5A623', href: '/dashboard/laboratorio/atlas-parasitologia' },
      { name: 'Atlas Microbiología',  desc: 'Identificación de bacterias patógenas frecuentes',      color: '#E85B4A', href: '/dashboard/laboratorio/atlas-microbiologia' },
    ],
  },
  {
    id: 'excretor',
    title: 'Sistema Excretor | UPCH',
    badge: 'Fisiología',
    diff: ['easy'],
    experiments: [
      { name: 'Parámetro: Sangre vs Orina', desc: 'Arrastra los valores normales al compartimento correcto', color: '#E85B4A', href: '/dashboard/laboratorio/parametro-sangre-orina' },
      { name: 'Nefrón INTERACTIVO', desc: 'Explora el trayecto del filtrado, los transportadores y su bloqueo en tiempo real', color: '#3b9edd', href: '/dashboard/laboratorio/nefron-interactivo' },
    ],
  },
  {
    id: 'farmacologia',
    title: 'Farmacología | UPCH',
    badge: 'Farmacología',
    diff: ['medium'],
    experiments: [
      { name: 'Farmacocinética',        desc: 'Absorción, distribución, metabolismo y excreción', color: '#2DC99A' },
      { name: 'Interacciones',          desc: 'Análisis de interacciones entre fármacos',          color: '#F5A623' },
      { name: 'Ensayos de Toxicidad',   desc: 'Evaluación de efectos tóxicos y dosis letal',       color: '#E85B4A' },
      { name: 'Curvas Dosis-Respuesta', desc: 'Análisis de relaciones dosis-efecto',               color: '#2DC99A' },
      { name: 'Biodisponibilidad',      desc: 'Estudios de liberación y absorción de fármacos',    color: '#F5A623' },
      { name: 'Farmacogenómica',        desc: 'Variabilidad genética en respuesta a fármacos',     color: '#E85B4A' },
    ],
  },
  {
    id: 'cardiovascular',
    title: 'Cardiovascular | UPCH',
    badge: 'Cardiovascular',
    diff: ['medium'],
    experiments: [
      { name: 'Ciclo Cardíaco',          desc: 'Fases de sístole y diástole y eventos valvulares',  color: '#2DC99A' },
      { name: 'Electrocardiograma',      desc: 'Del impulso eléctrico a la onda: conducción sincronizada con DII', color: '#F5A623', href: '/dashboard/laboratorio/electrocardiograma' },
      { name: 'Presión Arterial',        desc: 'Regulación y medición de la presión sanguínea',   color: '#E85B4A' },
      { name: 'Gasto Cardíaco',          desc: 'Determinantes del volumen sistólico y frecuencia', color: '#2DC99A' },
      { name: 'Auscultación Cardíaca',   desc: 'Identificación de ruidos y soplos cardíacos',     color: '#F5A623' },
      { name: 'Circulación Coronaria',   desc: 'Perfusión miocárdica e isquemia',                 color: '#E85B4A' },
    ],
  },
  {
    id: 'hematologia',
    title: 'Hematología | UPCH',
    badge: 'Hematología',
    diff: ['easy'],
    experiments: [
      { name: 'Frotis Sanguíneo · Simulación', desc: 'Práctica 1 completa en 3D: extendido, zonas, tinción de Wright, morfología eritrocitaria y recuento plaquetario', color: '#E85B4A', href: '/dashboard/laboratorio/frotis-sanguineo' },
      { name: 'Hemograma Completo',     desc: 'Los 28 parámetros del CBC con rangos reales, 11 escenarios clínicos, comparador y quiz', color: '#2DC99A', href: '/dashboard/laboratorio/hemograma' },
      // Compartido con Patología — sin página todavía (enlace inerte, como el resto de pendientes).
      { name: 'Morfología de Glóbulos Rojos', desc: '19 microfotografías reales para reconocer alteraciones e inclusiones, con lámina de referencia', color: '#8b5cf6', href: '/dashboard/laboratorio/morfologia-globulos-rojos' },
      { name: 'Microscopio: Médula Ósea y Serie Blanca · Simulación', desc: 'Práctica 2: microscopio virtual, identificación de la serie blanca y fórmula diferencial', color: '#F5A623', href: '/dashboard/laboratorio/microscopio-hematologia' },
      { name: 'Vías de la coagulación', desc: 'La cascada completa en un lienzo: mueve los factores, despliega sus avisos y completa cada vía paso a paso', color: '#2CA9BC', href: '/dashboard/laboratorio/cascada-coagulacion' },
      { name: 'Pruebas de Coagulación', desc: 'Estudios de hemostasia y factores de coagulación',  color: '#E85B4A' },
      { name: 'Conteo de Reticulocitos',desc: 'Evaluación de la producción de glóbulos rojos',    color: '#F5A623' },
      { name: 'Electroforesis Hb',      desc: 'Identificación de hemoglobinopatías',               color: '#E85B4A' },
    ],
  },
  {
    id: 'neurologia',
    title: 'Neurología | UPCH',
    badge: 'Neurología',
    diff: ['medium'],
    experiments: [
      { name: 'Polígono de Willis 3D', desc: 'Vascularización de la base del encéfalo: el anillo, sus ramas y el sistema vertebrobasilar en un modelo rotatorio', color: '#c22222', href: '/dashboard/laboratorio/poligono-willis' },
      { name: 'Tronco encefálico', desc: 'Compara las vistas del cadáver con la maqueta 3D rotatoria; colapsa cada panel a tu gusto', color: '#3b9edd', href: '/dashboard/laboratorio/tronco-encefalico' },
      { name: 'Biomecánica extraocular', desc: 'Activa los músculos extraoculares y observa el movimiento del globo, individual y por grupo vectorial', color: '#3b9edd', href: '/dashboard/laboratorio/biomecanica-extraocular' },
      { name: 'Médula Espinal 3D', desc: 'Corte transversal interactivo: láminas de Rexed, tractos, meninges y síndromes clínicos', color: '#2DC99A', href: '/dashboard/laboratorio/medula-espinal' },
      { name: 'EVA 2 · Anatomía', desc: 'Examen interactivo de identificación: nombra la estructura (A) y desbloquea su detalle clínico (B)', color: '#F5A623', href: '/dashboard/laboratorio/eva-2' },
      { name: 'EVA 3 · Anatomía', desc: 'Examen interactivo de identificación: nombra la estructura (A) y desbloquea su detalle clínico (B)', color: '#E85B4A', href: '/dashboard/laboratorio/eva-3' },
    ],
  },
  {
    id: 'inmunologia',
    title: 'Inmunología | UPCH',
    badge: 'Inmunología',
    diff: ['medium'],
    experiments: [
      { name: 'Ensayos ELISA',        desc: 'Detección de anticuerpos y antígenos específicos',    color: '#2DC99A' },
      { name: 'Inmunofluorescencia',  desc: 'Técnicas de marcaje fluorescente para detección',     color: '#F5A623' },
      { name: 'Citometría de Flujo',  desc: 'Análisis de poblaciones celulares y marcadores',      color: '#E85B4A' },
      { name: 'Aglutinación',         desc: 'Detección de antígenos mediante aglutinación',        color: '#2DC99A' },
      { name: 'Western Blot',         desc: 'Identificación de proteínas específicas',             color: '#F5A623' },
      { name: 'PCR en Tiempo Real',   desc: 'Cuantificación de ácidos nucleicos',                  color: '#E85B4A' },
    ],
  },
  {
    id: 'patologia',
    title: 'Patología | UPCH',
    badge: 'Patología',
    diff: ['hard'],
    // Mismo microscopio que Histología usa en la sidebar (monocromo, currentColor:
    // .labIconBox ya lo pinta de blanco).
    experiments: [
      // Compartidos con Hematología — se ven en los dos cursos.
      { name: 'Hemograma Completo',   desc: 'Los 28 parámetros del CBC con rangos reales, 11 escenarios clínicos, comparador y quiz', color: '#2DC99A', href: '/dashboard/laboratorio/hemograma' },
      // Sin página todavía (enlace inerte, como el resto de pendientes).
      { name: 'Morfología de Glóbulos Rojos', desc: '19 microfotografías reales para reconocer alteraciones e inclusiones, con lámina de referencia', color: '#8b5cf6', href: '/dashboard/laboratorio/morfologia-globulos-rojos' },
      { name: 'Checkpoints del ciclo celular', desc: 'Los cinco puntos de control, de RB–E2F al huso: la vía molecular animada paso a paso, para construirla y ponerte a prueba', color: '#2CA9BC', href: '/dashboard/laboratorio/checkpoints-ciclo-celular' },
      { name: 'Vías NF-κB y JAK/STAT', desc: 'Las vías clásica y alternativa de NF-κB y JAK/STAT animadas paso a paso, con las alteraciones del linfoma de Hodgkin clásico y un modo de arrastrar', color: '#2CA9BC', href: '/dashboard/laboratorio/vias-nfkb-jakstat' },
      { name: 'Maduración de linfocitos', desc: 'De la célula madre a la plasmática: recombinación V(D)J, selección en el timo, centro germinal y el origen de cada leucemia y linfoma', color: '#2CA9BC', href: '/dashboard/laboratorio/maduracion-linfocitos' },
      { name: 'Hipersensibilidad', desc: 'Los tipos I a IV animados como fisiología: el mastocito que desgranula, la vénula que se abre, el complemento que perfora, los complejos en el vaso y el granuloma', color: '#2CA9BC', href: '/dashboard/laboratorio/hipersensibilidad' },
    ],
  },
  {
    id: 'aparato-locomotor',
    title: 'Aparato Locomotor | UPCH',
    badge: 'Anatomía',
    diff: ['medium'],
    // Mismo ícono que la tarjeta del curso en cursos/page.tsx, en blanco.
    experiments: [
      // Un solo visor para todo el atlas 3D: cada región es un paquete aparte (?region=).
      { name: 'Miembro superior 3D', desc: 'Hombro, brazo, antebrazo y mano derechos con el plexo braquial completo: huesos, músculos, vasos, nervios y ligamentos', color: '#c9a227', href: '/dashboard/laboratorio/atlas-3d?region=miembro-superior-derecho', prueba: '/dashboard/laboratorio/atlas-3d?region=miembro-superior-derecho&examen=1&desde=laboratorio' },
      { name: 'Miembro inferior 3D', desc: 'Pelvis y región glútea, muslo, rodilla, pierna y pie derechos con los plexos lumbar y sacro: huesos, músculos, vasos, nervios, ligamentos y meniscos', color: '#c9a227', href: '/dashboard/laboratorio/atlas-3d?region=miembro-inferior-derecho' },
    ],
  },
  {
    // Curso de UFBI: 'fisica-medicina' ya está en CURSOS (track 'basico'), así
    // que `requiredPlanDeCurso` lo abre con el plan UFBI sin tocar nada más.
    //
    // Las filas son las 14 clases del sílabo (`src/lib/data/fisica.ts`), con su
    // código visible. Antes eran 8 temas de un temario genérico que NO cuadraba
    // con el curso: «Campo eléctrico y potencial» mezclaba C9 y C10, y C7, C8,
    // C11, C12 y C14 no existían — así que un módulo nuevo de esas clases no
    // tenía dónde colgarse. Que C6 encajara fue casualidad.
    //
    // Todo vive dentro del curso (`modulo/[id]`) y no bajo `laboratorio/`: las
    // simulaciones son los temas de esa clase, no piezas sueltas. El gate real
    // lo pone esa página con `requiredPlan="ufbi"`; el candado del panel es sólo
    // la señal visual.
    //
    // Las catorce llevan `href` desde que cada clase tiene laboratorio: C6 y C7
    // abren su módulo completo de teoría y las otras doce el menú de temas.
    // Ojo al quitar uno: sin `href` la fila deja de ser un enlace y se pinta con
    // la marca de obra (`.labExpObra`), que es lo que las tenía apagadas.
    id: 'fisica-medicina',
    title: 'Física | UPCH',
    badge: 'Física',
    diff: ['easy'],
    experiments: [
      { name: 'C1 · Leyes de Newton',                    desc: 'Bloque en plano inclinado con su diagrama de cuerpo libre en movimiento: normal, fricción y el ángulo al que empieza a deslizar', color: '#3b9edd', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-1' },
      { name: 'C2 · Trabajo y energía',                  desc: 'Choque frontal con la restitución como perilla continua: el momento se conserva siempre, la energía sólo si es elástico', color: '#2DC99A', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-2' },
      { name: 'C3 · Dinámica rotacional',                desc: 'Barra con punto de apoyo que se cae cuando los torques no se empatan, y aro/disco/esfera con la misma masa arrancando distinto', color: '#F5A623', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-3' },
      { name: 'C4 · Equilibrio y elasticidad',           desc: 'La palanca del codo: cuánta fuerza hace el bíceps para sostener una carga y qué aguanta de verdad la articulación', color: '#E85B4A', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-4' },
      { name: 'C5 · Mecánica de fluidos',                desc: 'Vaso con estenosis: continuidad y Bernoulli sobre la misma escena, con el número de Reynolds y el umbral del soplo', color: '#8b5cf6', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-5' },
      { name: 'C6 · Movimiento periódico y ondas',       desc: 'Módulo interactivo: MAS, péndulo y masa-resorte, ondas mecánicas y sonido, con 4 simulaciones y problemas guiados', color: '#3b9edd', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-6' },
      { name: 'C7 · Temperatura y calor',                desc: 'Módulo interactivo: escalas, calor específico, cambios de fase y las tres vías de pérdida, con el balance térmico del cuerpo', color: '#E85B4A', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-7' },
      { name: 'C8 · Termodinámica',                      desc: 'Cilindro con pistón y diagrama PV sincronizados: los cuatro procesos entre los mismos volúmenes, y el trabajo como área', color: '#F5A623', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-8' },
      { name: 'C9 · Campo eléctrico',                    desc: 'Dos cargas con sus líneas de campo trazadas de verdad: el 1/r² de la fuerza frente al 1/r del potencial', color: '#2DC99A', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-9' },
      { name: 'C10 · Potencial y capacitancia',          desc: 'Condensador de placas con dos presets: la membrana celular a 70 mV y el desfibrilador a miles de voltios', color: '#8b5cf6', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-10' },
      { name: 'C11 · Corriente y resistencia',           desc: 'La misma pareja de resistencias en serie y en paralelo, con la escala de efectos fisiológicos en miliamperios', color: '#3b9edd', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-11' },
      { name: 'C12 · Magnetismo e inducción',            desc: 'Lorentz y Faraday conmutables: el periodo de giro que no depende de la velocidad, y la fem desfasada del flujo', color: '#2DC99A', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-12' },
      { name: 'C13 · Óptica geométrica',                 desc: 'Lente delgada con los tres rayos principales y un modo ojo que sitúa la imagen respecto a la retina', color: '#F5A623', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-13' },
      { name: 'C14 · Fotones y átomos',                  desc: 'Efecto fotoeléctrico: por debajo del umbral no sale un electrón por mucha intensidad que eches', color: '#E85B4A', href: '/dashboard/cursos/fisica-medicina/modulo/fis-c-14' },
    ],
  },
];
