import type { CatalogoLab } from './formulas';

/* ───────────────────────────────────────────────────────────────────────────
   Catálogos de fórmulas de las doce clases que el laboratorio cubrió después
   de C6 y C7. Van en un archivo aparte por tamaño, no por naturaleza: el
   contrato es el mismo (`CatalogoLab`) y `formulas.ts` los funde en el mismo
   registro.

   Las mismas dos reglas duras que allí:
   - cada plantilla es EXACTAMENTE la que la escena resuelve, constantes
     incluidas — el número que se muestra sale del estado real de la sim;
   - todo en unidades SI dentro de las plantillas. Lo clínico (mmHg, cm, nm,
     dioptrías) vive en el mando y en el tablero, nunca dentro de la expresión,
     o la aritmética que el alumno rehaga a mano no le daría.
   ─────────────────────────────────────────────────────────────────────────── */

/* ═══ C1 · Leyes de Newton ═══════════════════════════════════════════════════ */

export const PLANO: CatalogoLab = {
  magnitudes: {
    m:    { simbolo: 'm',   nombre: 'Masa',            unidad: 'kg',   decimales: 1 },
    th:   { simbolo: 'θ',   nombre: 'Inclinación',     unidad: '°',    decimales: 0 },
    mu:   { simbolo: 'μ',   nombre: 'Rozamiento',      unidad: '',     decimales: 2 },
    g:    { simbolo: 'g',   nombre: 'Gravedad',        unidad: 'm/s²', decimales: 2 },
    W:    { simbolo: 'W',   nombre: 'Peso',            unidad: 'N',    decimales: 1 },
    N:    { simbolo: 'N',   nombre: 'Normal',          unidad: 'N',    decimales: 1 },
    Wpar: { simbolo: 'W∥',  nombre: 'Peso paralelo',   unidad: 'N',    decimales: 1 },
    fr:   { simbolo: 'f',   nombre: 'Fricción',        unidad: 'N',    decimales: 1 },
    frCin:{ simbolo: 'f_c', nombre: 'Fricción cinética', unidad: 'N',   decimales: 1 },
    frMax:{ simbolo: 'f_e', nombre: 'Fricción estática máx.', unidad: 'N', decimales: 1 },
    Fneta:{ simbolo: 'ΣF',  nombre: 'Fuerza neta',     unidad: 'N',    decimales: 1 },
    a:    { simbolo: 'a',   nombre: 'Aceleración',     unidad: 'm/s²', decimales: 2 },
    thc:  { simbolo: 'θ_c', nombre: 'Ángulo crítico',  unidad: '°',    decimales: 1 },
    t:    { simbolo: 't',   nombre: 'Tiempo',          unidad: 's',    decimales: 1 },
    v:    { simbolo: 'v',   nombre: 'Velocidad',       unidad: 'm/s',  decimales: 2 },
    d:    { simbolo: 'd',   nombre: 'Recorrido',       unidad: 'm',    decimales: 2 },
  },
  formulas: [
    {
      id: 'peso',
      nombre: 'Peso',
      plantilla: 'W = {m} · {g}',
      salida: 'W',
      dice: 'Apunta siempre hacia abajo, gire como gire el plano. Lo que cambia con θ es cómo se reparte.',
    },
    {
      id: 'normal',
      nombre: 'Normal',
      plantilla: 'N = {m} · {g} · cos( {th} )',
      salida: 'N',
      dice: 'La normal NO es el peso: sólo coincide con él en horizontal. Al inclinar, se queda con el coseno.',
    },
    {
      id: 'paralela',
      nombre: 'Peso paralelo al plano',
      plantilla: 'W∥ = {m} · {g} · sen( {th} )',
      salida: 'Wpar',
      dice: 'La mitad del peso que de verdad empuja cuesta abajo. A 30° es exactamente la mitad de W.',
    },
    {
      id: 'friccion',
      nombre: 'Fricción cinética',
      plantilla: 'f_c = {mu} · {N}',
      salida: 'frCin',
      dice: 'Sólo vale mientras desliza. En reposo la fricción no es μN: vale justo lo necesario para empatar a W∥.',
    },
    {
      id: 'neta',
      nombre: 'Segunda ley',
      plantilla: 'ΣF = {Wpar} − {fr}',
      salida: 'Fneta',
      dice: 'El bloque sólo arranca cuando la componente paralela le gana a la fricción.',
    },
    {
      id: 'acel',
      nombre: 'Aceleración',
      plantilla: 'a = {Fneta} / {m}',
      salida: 'a',
      dice: 'Sustituyendo todo queda a = g·(sen θ − μ·cos θ): la masa se cancela y desaparece.',
    },
    {
      id: 'critico',
      nombre: 'Ángulo de deslizamiento',
      plantilla: 'θ_c = arctan( 1,2 · {mu} )',
      salida: 'thc',
      dice: 'El 1,2 es la razón μ_estático/μ_cinético de tabla que usa la escena. Que la masa no aparezca es lo que se pregunta.',
    },
  ],
  // `fr` es la fricción que la escena aplica AHORA —estática o cinética según
  // el régimen—, y por eso es la que va al tablero; `frCin` es sólo el valor
  // que despeja la fórmula.
  tablero: ['N', 'Wpar', 'fr', 'a', 'v', 'd'],
};

/* ═══ C2 · Trabajo, energía y colisiones ═════════════════════════════════════ */

export const COLISION: CatalogoLab = {
  magnitudes: {
    m1:      { simbolo: 'm₁', nombre: 'Masa A',          unidad: 'kg',   decimales: 1 },
    m2:      { simbolo: 'm₂', nombre: 'Masa B',          unidad: 'kg',   decimales: 1 },
    v1:      { simbolo: 'v₁', nombre: 'v inicial A',     unidad: 'm/s',  decimales: 2 },
    v2:      { simbolo: 'v₂', nombre: 'v inicial B',     unidad: 'm/s',  decimales: 2 },
    e:       { simbolo: 'e',  nombre: 'Restitución',     unidad: '',     decimales: 2 },
    p:       { simbolo: 'p',  nombre: 'Momento total',   unidad: 'kg·m/s', decimales: 2 },
    v1f:     { simbolo: 'v₁′', nombre: 'v final A',      unidad: 'm/s',  decimales: 2 },
    v2f:     { simbolo: 'v₂′', nombre: 'v final B',      unidad: 'm/s',  decimales: 2 },
    Ki:      { simbolo: 'K',  nombre: 'K antes',         unidad: 'J',    decimales: 2 },
    Kf:      { simbolo: 'K′', nombre: 'K después',       unidad: 'J',    decimales: 2 },
    perdida: { simbolo: 'ΔK', nombre: 'Energía perdida', unidad: '%',    decimales: 1 },
    J:       { simbolo: 'J',  nombre: 'Impulso sobre A', unidad: 'N·s',  decimales: 2 },
  },
  formulas: [
    {
      id: 'momento',
      nombre: 'Momento lineal total',
      plantilla: 'p = {m1} · {v1} + {m2} · {v2}',
      salida: 'p',
      dice: 'Se conserva SIEMPRE, sea el choque elástico o no. Es la única cantidad que no negocia.',
    },
    {
      id: 'v1f',
      nombre: 'Velocidad final de A',
      plantilla: "v₁′ = ( {m1}·{v1} + {m2}·{v2} + {m2}·{e}·({v2} − {v1}) ) / ( {m1} + {m2} )",
      salida: 'v1f',
      dice: 'Sale de resolver a la vez conservación del momento y la definición de e.',
    },
    {
      id: 'v2f',
      nombre: 'Velocidad final de B',
      plantilla: "v₂′ = ( {m1}·{v1} + {m2}·{v2} + {m1}·{e}·({v1} − {v2}) ) / ( {m1} + {m2} )",
      salida: 'v2f',
      dice: 'Con e = 0 las dos expresiones dan lo mismo: los cuerpos salen pegados.',
    },
    {
      id: 'cinetica',
      nombre: 'Energía cinética antes',
      plantilla: 'K = ½·{m1}·{v1}² + ½·{m2}·{v2}²',
      salida: 'Ki',
      dice: 'La velocidad va al cuadrado: doblarla cuadruplica la energía que el choque tiene que disipar.',
    },
    {
      id: 'cineticaf',
      nombre: 'Energía cinética después',
      plantilla: "K′ = ½·{m1}·{v1f}² + ½·{m2}·{v2f}²",
      salida: 'Kf',
      dice: 'Sólo iguala a K cuando e = 1. Ésa es la definición operativa de choque elástico.',
    },
    {
      id: 'perdida',
      nombre: 'Energía disipada',
      plantilla: 'ΔK = ( {Ki} − {Kf} ) / {Ki} · 100',
      salida: 'perdida',
      dice: 'Adónde va lo que falta: calor y deformación. En un traumatismo, ese porcentaje es la lesión.',
    },
    {
      id: 'impulso',
      nombre: 'Impulso sobre A',
      plantilla: "J = {m1} · ( {v1f} − {v1} )",
      salida: 'J',
      dice: 'El mismo impulso repartido en más tiempo es menos fuerza: el airbag no cambia J, cambia Δt.',
    },
  ],
  tablero: ['p', 'v1f', 'v2f', 'Ki', 'Kf', 'perdida'],
};

/* ═══ C3 · Dinámica rotacional ═══════════════════════════════════════════════ */

export const ROTACIONAL: CatalogoLab = {
  magnitudes: {
    M:     { simbolo: 'M', nombre: 'Masa',              unidad: 'kg',     decimales: 1 },
    R:     { simbolo: 'R', nombre: 'Radio',             unidad: 'm',      decimales: 2 },
    c:     { simbolo: 'c', nombre: 'Factor de forma',   unidad: '',       decimales: 3 },
    I:     { simbolo: 'I', nombre: 'Momento de inercia', unidad: 'kg·m²', decimales: 3 },
    F:     { simbolo: 'F', nombre: 'Fuerza aplicada',   unidad: 'N',      decimales: 1 },
    tau:   { simbolo: 'τ', nombre: 'Torque',            unidad: 'N·m',    decimales: 2 },
    alpha: { simbolo: 'α', nombre: 'Aceleración ang.',  unidad: 'rad/s²', decimales: 2 },
    om:    { simbolo: 'ω', nombre: 'Velocidad angular', unidad: 'rad/s',  decimales: 2 },
    L:     { simbolo: 'L', nombre: 'Momento angular',   unidad: 'kg·m²/s', decimales: 2 },
    Krot:  { simbolo: 'K', nombre: 'Energía de giro',   unidad: 'J',      decimales: 2 },
    t:     { simbolo: 't', nombre: 'Tiempo',            unidad: 's',      decimales: 1 },
  },
  formulas: [
    {
      id: 'inercia',
      nombre: 'Momento de inercia',
      plantilla: 'I = {c} · {M} · {R}²',
      salida: 'I',
      dice: 'La masa importa menos que DÓNDE está: el radio va al cuadrado, y c dice cuánto se aleja.',
    },
    {
      id: 'torque',
      nombre: 'Torque',
      plantilla: 'τ = {F} · {R}',
      salida: 'tau',
      dice: 'La misma fuerza aplicada más lejos del eje gira más. Ésa es toda la idea de la llave larga.',
    },
    {
      id: 'segunda',
      nombre: 'Segunda ley de la rotación',
      plantilla: 'α = {tau} / {I}',
      salida: 'alpha',
      dice: 'El calco rotacional de a = F/m. La inercia ya no es la masa, es cómo está repartida.',
    },
    {
      id: 'angular',
      nombre: 'Velocidad angular',
      plantilla: 'ω = {alpha} · {t}',
      salida: 'om',
      dice: 'Partiendo del reposo, la rotación crece igual que la velocidad en un MRUV.',
    },
    {
      id: 'momento',
      nombre: 'Momento angular',
      plantilla: 'L = {I} · {om}',
      salida: 'L',
      dice: 'Sin torque externo, L no cambia: encoger los brazos baja I, y ω tiene que subir para compensar.',
    },
    {
      id: 'energia',
      nombre: 'Energía de rotación',
      plantilla: 'K = ½ · {I} · {om}²',
      salida: 'Krot',
      dice: 'La versión angular de ½mv². Un cuerpo que rueda reparte su energía entre trasladarse y girar.',
    },
  ],
  tablero: ['I', 'tau', 'alpha', 'om', 'L', 'Krot'],
};

/* ═══ C4 · Equilibrio y palancas ═════════════════════════════════════════════ */

export const PALANCA: CatalogoLab = {
  magnitudes: {
    mcarga: { simbolo: 'm',   nombre: 'Carga en la mano', unidad: 'kg', decimales: 1 },
    W:      { simbolo: 'W',   nombre: 'Peso de la carga', unidad: 'N',  decimales: 1 },
    d1:     { simbolo: 'd₁',  nombre: 'Inserción bíceps', unidad: 'm',  decimales: 3 },
    d2:     { simbolo: 'd₂',  nombre: 'Codo → mano',      unidad: 'm',  decimales: 2 },
    Wb:     { simbolo: 'W_b', nombre: 'Peso del antebrazo', unidad: 'N', decimales: 1 },
    db:     { simbolo: 'd_b', nombre: 'Centro de masa',   unidad: 'm',  decimales: 2 },
    Fm:     { simbolo: 'F_m', nombre: 'Fuerza del bíceps', unidad: 'N', decimales: 0 },
    Fc:     { simbolo: 'F_c', nombre: 'Carga articular',  unidad: 'N',  decimales: 0 },
    VM:     { simbolo: 'VM',  nombre: 'Ventaja mecánica', unidad: '',   decimales: 3 },
    ratio:  { simbolo: 'n',   nombre: 'F_m / carga',      unidad: '×',  decimales: 1 },
  },
  formulas: [
    {
      id: 'peso',
      nombre: 'Peso de la carga',
      plantilla: 'W = {mcarga} · 9,81',
      salida: 'W',
      dice: 'El kilo de la mancuerna no es una fuerza: hay que pasarlo a newtons antes de tomar torques.',
    },
    {
      id: 'equilibrio',
      nombre: 'Fuerza del bíceps',
      plantilla: 'F_m = ( {W}·{d2} + {Wb}·{db} ) / {d1}',
      salida: 'Fm',
      dice: 'Suma de torques igual a cero respecto al codo. El antebrazo pesa y también cuenta.',
    },
    {
      id: 'ventaja',
      nombre: 'Ventaja mecánica',
      plantilla: 'VM = {d1} / {d2}',
      salida: 'VM',
      dice: 'Menor que 1: el codo es una palanca de tercer género, y pierde fuerza a cambio de recorrido.',
    },
    {
      id: 'ratio',
      nombre: 'Cuántas veces la carga',
      plantilla: 'n = {Fm} / {W}',
      salida: 'ratio',
      dice: 'Sostener 5 kg puede costarle al bíceps más de 350 N: la anatomía paga velocidad con fuerza.',
    },
    {
      id: 'articular',
      nombre: 'Carga sobre la articulación',
      plantilla: 'F_c = {Fm} − {W} − {Wb}',
      salida: 'Fc',
      dice: 'Lo que el húmero aguanta de verdad. Es el número que explica por qué el codo se desgasta.',
    },
  ],
  tablero: ['W', 'Fm', 'Fc', 'VM', 'ratio'],
};

/* ═══ C5 · Mecánica de fluidos ═══════════════════════════════════════════════ */

export const FLUIDOS: CatalogoLab = {
  magnitudes: {
    d1:    { simbolo: 'd₁', nombre: 'Diámetro sano',    unidad: 'm',    decimales: 4 },
    d2:    { simbolo: 'd₂', nombre: 'Diámetro estenosis', unidad: 'm',  decimales: 4 },
    A1:    { simbolo: 'A₁', nombre: 'Área sana',        unidad: 'm²',   formato: 'exp' },
    A2:    { simbolo: 'A₂', nombre: 'Área estenosis',   unidad: 'm²',   formato: 'exp' },
    v1:    { simbolo: 'v₁', nombre: 'Velocidad sana',   unidad: 'm/s',  decimales: 2 },
    v2:    { simbolo: 'v₂', nombre: 'Velocidad estenosis', unidad: 'm/s', decimales: 2 },
    rho:   { simbolo: 'ρ',  nombre: 'Densidad',         unidad: 'kg/m³', decimales: 0 },
    P1:    { simbolo: 'P₁', nombre: 'Presión sana',     unidad: 'Pa',   decimales: 0 },
    P2:    { simbolo: 'P₂', nombre: 'Presión estenosis', unidad: 'Pa',  decimales: 0 },
    dP:    { simbolo: 'ΔP', nombre: 'Caída de presión', unidad: 'Pa',   decimales: 0 },
    P1mm:  { simbolo: 'P₁', nombre: 'Presión sana',     unidad: 'mmHg', decimales: 0 },
    P2mm:  { simbolo: 'P₂', nombre: 'Presión estenosis', unidad: 'mmHg', decimales: 0 },
    Q:     { simbolo: 'Q',  nombre: 'Caudal',           unidad: 'L/min', decimales: 2 },
    Re:    { simbolo: 'Re', nombre: 'Reynolds',         unidad: '',     decimales: 0 },
    eta:   { simbolo: 'η',  nombre: 'Viscosidad',       unidad: 'Pa·s', decimales: 4 },
  },
  formulas: [
    {
      id: 'area',
      nombre: 'Área de la sección',
      plantilla: 'A₁ = π · ( {d1} / 2 )²',
      salida: 'A1',
      dice: 'El diámetro va al cuadrado: estrechar el vaso a la mitad deja un cuarto de área, no la mitad.',
    },
    {
      id: 'continuidad',
      nombre: 'Ecuación de continuidad',
      plantilla: 'v₂ = {A1} · {v1} / {A2}',
      salida: 'v2',
      dice: 'Lo que entra tiene que salir. Si el área cae a un cuarto, la sangre pasa cuatro veces más rápido.',
    },
    {
      id: 'caudal',
      nombre: 'Caudal',
      plantilla: 'Q = {A1} · {v1}',
      salida: 'Q',
      dice: 'El mismo en todo el tubo — es justo lo que la continuidad afirma, escrito al derecho.',
    },
    {
      id: 'bernoulli',
      nombre: 'Bernoulli',
      plantilla: 'P₂ = {P1} + ½·{rho}·( {v1}² − {v2}² )',
      salida: 'P2',
      dice: 'Donde el fluido corre más, la presión baja. En una estenosis, eso tiende a colapsar el vaso.',
    },
    {
      id: 'caida',
      nombre: 'Caída de presión',
      plantilla: 'ΔP = {P1} − {P2}',
      salida: 'dP',
      dice: 'El gradiente que el ecocardiograma mide para graduar una estenosis valvular.',
    },
    {
      id: 'reynolds',
      nombre: 'Número de Reynolds',
      plantilla: 'Re = {rho} · {v2} · {d2} / {eta}',
      salida: 'Re',
      dice: 'Por encima de ~2000 el flujo se vuelve turbulento — y un flujo turbulento suena: es el soplo.',
    },
  ],
  tablero: ['A2', 'v2', 'P1mm', 'P2mm', 'Q', 'Re'],
};

/* ═══ C8 · Termodinámica ═════════════════════════════════════════════════════ */

export const GAS: CatalogoLab = {
  magnitudes: {
    n:     { simbolo: 'n',  nombre: 'Moles',           unidad: 'mol', decimales: 2 },
    T1:    { simbolo: 'T₁', nombre: 'Temperatura inicial', unidad: 'K', decimales: 0 },
    T2:    { simbolo: 'T₂', nombre: 'Temperatura final', unidad: 'K', decimales: 0 },
    V1:    { simbolo: 'V₁', nombre: 'Volumen inicial',  unidad: 'm³', formato: 'exp' },
    V2:    { simbolo: 'V₂', nombre: 'Volumen final',    unidad: 'm³', formato: 'exp' },
    P1:    { simbolo: 'P₁', nombre: 'Presión inicial',  unidad: 'Pa', decimales: 0 },
    P2:    { simbolo: 'P₂', nombre: 'Presión final',    unidad: 'Pa', decimales: 0 },
    W:     { simbolo: 'W',  nombre: 'Trabajo del gas',  unidad: 'J',  decimales: 1 },
    Wiso:  { simbolo: 'W',  nombre: 'W isotermo',       unidad: 'J',  decimales: 1 },
    Wisob: { simbolo: 'W',  nombre: 'W isóbaro',        unidad: 'J',  decimales: 1 },
    Q:     { simbolo: 'Q',  nombre: 'Calor',            unidad: 'J',  decimales: 1 },
    dU:    { simbolo: 'ΔU', nombre: 'Energía interna',  unidad: 'J',  decimales: 1 },
    U2:    { simbolo: 'U',  nombre: 'Energía interna final', unidad: 'J', decimales: 1 },
    dS:    { simbolo: 'ΔS', nombre: 'Entropía',         unidad: 'J/K', decimales: 2 },
    Tfria: { simbolo: 'T_f', nombre: 'Foco frío',        unidad: 'K',   decimales: 0 },
    Tcal:  { simbolo: 'T_c', nombre: 'Foco caliente',    unidad: 'K',   decimales: 0 },
    eta:   { simbolo: 'η',  nombre: 'Rendimiento Carnot', unidad: '%', decimales: 1 },
  },
  formulas: [
    {
      id: 'estado',
      nombre: 'Ecuación de estado',
      plantilla: 'P₁ = {n} · 8,314 · {T1} / {V1}',
      salida: 'P1',
      dice: 'Las tres variables están atadas: fijar dos decide la tercera. De ahí salen todos los procesos.',
    },
    {
      id: 'wiso',
      nombre: 'Trabajo isotermo',
      plantilla: 'W = {n} · 8,314 · {T1} · ln( {V2} / {V1} )',
      salida: 'Wiso',
      dice: 'Sólo vale si T no cambia. Con T constante, ΔU = 0 y todo el calor que entra sale como trabajo.',
    },
    {
      id: 'wisob',
      nombre: 'Trabajo isóbaro',
      plantilla: 'W = {P1} · ( {V2} − {V1} )',
      salida: 'Wisob',
      dice: 'A presión constante el trabajo es un rectángulo en el diagrama PV: base ΔV, altura P.',
    },
    {
      id: 'primera',
      nombre: 'Primera ley',
      plantilla: 'ΔU = {Q} − {W}',
      salida: 'dU',
      dice: 'El calor que entra se reparte entre calentar el gas y dejarle empujar el pistón. No hay tercera salida.',
    },
    {
      id: 'interna',
      nombre: 'Energía interna',
      plantilla: 'U = 3/2 · {n} · 8,314 · {T2}',
      salida: 'U2',
      dice: 'Para un gas ideal monoatómico sólo depende de T. Por eso una isoterma no cambia U.',
    },
    {
      id: 'entropia',
      nombre: 'Entropía',
      plantilla: 'ΔS = {Q} / {T1}',
      salida: 'dS',
      dice: 'Vale tal cual sólo en el isotermo reversible; en los demás es la estimación de clase. El mismo calor desordena más un sistema frío que uno caliente.',
    },
    {
      id: 'carnot',
      nombre: 'Rendimiento de Carnot',
      plantilla: 'η = ( 1 − {Tfria} / {Tcal} ) · 100',
      salida: 'eta',
      dice: 'El techo que ninguna máquina supera. Con los dos focos a la misma temperatura es cero, por bien construida que esté.',
    },
  ],
  tablero: ['P2', 'T2', 'W', 'Q', 'dU', 'dS'],
};

/* ═══ C9 · Carga y campo eléctrico ═══════════════════════════════════════════ */

export const COULOMB: CatalogoLab = {
  magnitudes: {
    q1: { simbolo: 'q₁', nombre: 'Carga A',        unidad: 'C',   formato: 'exp' },
    q2: { simbolo: 'q₂', nombre: 'Carga B',        unidad: 'C',   formato: 'exp' },
    r:  { simbolo: 'r',  nombre: 'Separación',     unidad: 'm',   decimales: 3 },
    F:  { simbolo: 'F',  nombre: 'Fuerza',         unidad: 'N',   formato: 'exp' },
    E1: { simbolo: 'E',  nombre: 'Campo de A en B', unidad: 'N/C', formato: 'exp' },
    U:  { simbolo: 'U',  nombre: 'Energía potencial', unidad: 'J', formato: 'exp' },
    V1: { simbolo: 'V',  nombre: 'Potencial de A en B', unidad: 'V', decimales: 1 },
    a1: { simbolo: 'a',  nombre: 'Aceleración de B', unidad: 'm/s²', formato: 'exp' },
    mp: { simbolo: 'm',  nombre: 'Masa de B',      unidad: 'kg',  formato: 'exp' },
  },
  formulas: [
    {
      id: 'coulomb',
      nombre: 'Ley de Coulomb',
      plantilla: 'F = 8,99×10⁹ · | {q1} · {q2} | / {r}²',
      salida: 'F',
      dice: 'Misma forma que la gravedad, pero 10³⁹ veces más fuerte — y con signo, así que puede atraer o repeler.',
    },
    {
      id: 'campo',
      nombre: 'Campo eléctrico',
      plantilla: 'E = 8,99×10⁹ · | {q1} | / {r}²',
      salida: 'E1',
      dice: 'Lo que la carga A deja preparado en el espacio, esté o no B ahí para notarlo.',
    },
    {
      id: 'fuerzacampo',
      nombre: 'Fuerza desde el campo',
      plantilla: 'F = | {q2} | · {E1}',
      salida: 'F',
      dice: 'Da exactamente lo mismo que Coulomb: el campo es sólo otra forma de contar la misma historia.',
    },
    {
      id: 'potencial',
      nombre: 'Potencial',
      plantilla: 'V = 8,99×10⁹ · {q1} / {r}',
      salida: 'V1',
      dice: 'Ojo al exponente: el potencial va con 1/r y el campo con 1/r². No son la misma curva.',
    },
    {
      id: 'energia',
      nombre: 'Energía potencial',
      plantilla: 'U = 8,99×10⁹ · {q1} · {q2} / {r}',
      salida: 'U',
      dice: 'Negativa si se atraen: hace falta trabajo externo para separarlas.',
    },
    {
      id: 'acel',
      nombre: 'Aceleración de B',
      plantilla: 'a = {F} / {mp}',
      salida: 'a1',
      dice: 'Con la masa de un electrón, una fuerza minúscula da aceleraciones enormes.',
    },
  ],
  tablero: ['F', 'E1', 'V1', 'U', 'r'],
};

/* ═══ C10 · Potencial y capacitancia ═════════════════════════════════════════ */

export const CAPACITOR: CatalogoLab = {
  magnitudes: {
    A:  { simbolo: 'A',  nombre: 'Área de placa',   unidad: 'm²', formato: 'exp' },
    d:  { simbolo: 'd',  nombre: 'Separación',      unidad: 'm',  formato: 'exp' },
    er: { simbolo: 'εr', nombre: 'Dieléctrico',     unidad: '',   decimales: 1 },
    C:  { simbolo: 'C',  nombre: 'Capacitancia',    unidad: 'F',  formato: 'exp' },
    V:  { simbolo: 'V',  nombre: 'Voltaje',         unidad: 'V',  decimales: 0 },
    Q:  { simbolo: 'Q',  nombre: 'Carga',           unidad: 'C',  formato: 'exp' },
    E:  { simbolo: 'E',  nombre: 'Campo entre placas', unidad: 'V/m', formato: 'exp' },
    U:  { simbolo: 'U',  nombre: 'Energía',         unidad: 'J',  decimales: 1 },
    dt: { simbolo: 'Δt', nombre: 'Duración',        unidad: 's',  formato: 'exp' },
    P:  { simbolo: 'P',  nombre: 'Potencia',        unidad: 'W',  decimales: 0 },
  },
  formulas: [
    {
      id: 'capacitancia',
      nombre: 'Capacitancia de placas',
      plantilla: 'C = {er} · 8,85×10⁻¹² · {A} / {d}',
      salida: 'C',
      dice: 'Más área o menos separación, más carga guarda al mismo voltaje. Es geometría pura.',
    },
    {
      id: 'carga',
      nombre: 'Carga almacenada',
      plantilla: 'Q = {C} · {V}',
      salida: 'Q',
      dice: 'La definición de capacitancia leída al derecho: cuánta carga admite por cada voltio.',
    },
    {
      id: 'campo',
      nombre: 'Campo entre las placas',
      plantilla: 'E = {V} / {d}',
      salida: 'E',
      dice: 'La membrana celular son 70 mV sobre 7 nm: 10⁷ V/m, un campo mayor que el de una tormenta.',
    },
    {
      id: 'energia',
      nombre: 'Energía almacenada',
      plantilla: 'U = ½ · {C} · {V}²',
      salida: 'U',
      dice: 'El voltaje va al cuadrado. Por eso un desfibrilador sube a miles de voltios en vez de agrandar C.',
    },
    {
      id: 'potencia',
      nombre: 'Potencia de la descarga',
      plantilla: 'P = {U} / {dt}',
      salida: 'P',
      dice: 'Los 200 J del desfibrilador salen en unos milisegundos: decenas de kilovatios de pico.',
    },
  ],
  tablero: ['C', 'Q', 'E', 'U', 'P'],
};

/* ═══ C11 · Corriente, resistencia y circuitos ═══════════════════════════════ */

export const CIRCUITO: CatalogoLab = {
  magnitudes: {
    V:    { simbolo: 'V',    nombre: 'Fuente',        unidad: 'V', decimales: 1 },
    R1:   { simbolo: 'R₁',   nombre: 'Resistencia 1', unidad: 'Ω', decimales: 0 },
    R2:   { simbolo: 'R₂',   nombre: 'Resistencia 2', unidad: 'Ω', decimales: 0 },
    Req:  { simbolo: 'R_eq', nombre: 'Equivalente',   unidad: 'Ω', decimales: 1 },
    Rs:   { simbolo: 'R_eq', nombre: 'Serie',         unidad: 'Ω', decimales: 1 },
    Rp:   { simbolo: 'R_eq', nombre: 'Paralelo',      unidad: 'Ω', decimales: 1 },
    I:    { simbolo: 'I',    nombre: 'Corriente total', unidad: 'A', decimales: 3 },
    I1:   { simbolo: 'I₁',   nombre: 'Corriente por R₁', unidad: 'A', decimales: 3 },
    I2:   { simbolo: 'I₂',   nombre: 'Corriente por R₂', unidad: 'A', decimales: 3 },
    V1:   { simbolo: 'V₁',   nombre: 'Caída en R₁',   unidad: 'V', decimales: 2 },
    V2:   { simbolo: 'V₂',   nombre: 'Caída en R₂',   unidad: 'V', decimales: 2 },
    P:    { simbolo: 'P',    nombre: 'Potencia',      unidad: 'W', decimales: 2 },
    ImA:  { simbolo: 'I',    nombre: 'Corriente',     unidad: 'mA', decimales: 1 },
  },
  formulas: [
    {
      id: 'serie',
      nombre: 'Equivalente en serie',
      plantilla: 'R_eq = {R1} + {R2}',
      salida: 'Rs',
      dice: 'En serie las resistencias se suman: el equivalente es siempre mayor que la mayor de ellas.',
    },
    {
      id: 'paralelo',
      nombre: 'Equivalente en paralelo',
      plantilla: 'R_eq = ( {R1} · {R2} ) / ( {R1} + {R2} )',
      salida: 'Rp',
      dice: 'En paralelo el equivalente es MENOR que la menor: cada rama nueva es otro camino abierto.',
    },
    {
      id: 'ohm',
      nombre: 'Ley de Ohm',
      plantilla: 'I = {V} / {Req}',
      salida: 'I',
      dice: 'La corriente no se «gasta» al pasar: lo que cambia entre montajes es cuánta arranca de la fuente.',
    },
    {
      id: 'caida',
      nombre: 'Caída de tensión',
      plantilla: 'V₁ = {I1} · {R1}',
      salida: 'V1',
      dice: 'En serie las caídas suman la fuente; en paralelo cada rama ve la fuente entera.',
    },
    {
      id: 'potencia',
      nombre: 'Potencia disipada',
      plantilla: 'P = {V} · {I}',
      salida: 'P',
      dice: 'Toda se va en calor. Es el mismo cálculo que decide si un cable aguanta o se quema.',
    },
    {
      id: 'cuerpo',
      nombre: 'Corriente por el cuerpo',
      plantilla: 'I = {V} / {Req} · 1000',
      salida: 'ImA',
      dice: 'Lo que hace daño son los miliamperios, no los voltios: a 100 mA por el tórax hay fibrilación.',
    },
  ],
  tablero: ['Req', 'I', 'I1', 'I2', 'V1', 'P'],
};

/* ═══ C12 · Magnetismo e inducción ═══════════════════════════════════════════ */

export const MAGNETICO: CatalogoLab = {
  magnitudes: {
    q:     { simbolo: 'q',  nombre: 'Carga',            unidad: 'C',   formato: 'exp' },
    mp:    { simbolo: 'm',  nombre: 'Masa',             unidad: 'kg',  formato: 'exp' },
    v:     { simbolo: 'v',  nombre: 'Velocidad',        unidad: 'm/s', formato: 'exp' },
    B:     { simbolo: 'B',  nombre: 'Campo magnético',  unidad: 'T',   decimales: 2 },
    F:     { simbolo: 'F',  nombre: 'Fuerza de Lorentz', unidad: 'N',  formato: 'exp' },
    r:     { simbolo: 'r',  nombre: 'Radio de giro',    unidad: 'm',   formato: 'exp' },
    Tc:    { simbolo: 'T',  nombre: 'Periodo',          unidad: 's',   formato: 'exp' },
    fc:    { simbolo: 'f',  nombre: 'Frec. de Larmor',  unidad: 'Hz',  formato: 'exp' },
    fMHz:  { simbolo: 'f',  nombre: 'Frec. de Larmor',  unidad: 'MHz', decimales: 2 },
    Aesp:  { simbolo: 'A',  nombre: 'Área de la espira', unidad: 'm²', decimales: 4 },
    th:    { simbolo: 'θ',  nombre: 'Inclinación',      unidad: '°',   decimales: 0 },
    flujo: { simbolo: 'Φ',  nombre: 'Flujo',            unidad: 'Wb',  formato: 'exp' },
    Nesp:  { simbolo: 'N',  nombre: 'Espiras',          unidad: '',    decimales: 0 },
    om:    { simbolo: 'ω',  nombre: 'Giro de la espira', unidad: 'rad/s', decimales: 2 },
    fem:   { simbolo: 'ε',  nombre: 'FEM inducida',     unidad: 'V',   decimales: 3 },
  },
  formulas: [
    {
      id: 'lorentz',
      nombre: 'Fuerza de Lorentz',
      plantilla: 'F = {q} · {v} · {B}',
      salida: 'F',
      dice: 'Perpendicular a la velocidad, así que no acelera la partícula: sólo la curva.',
    },
    {
      id: 'radio',
      nombre: 'Radio de giro',
      plantilla: 'r = {mp} · {v} / ( {q} · {B} )',
      salida: 'r',
      dice: 'Más campo, círculo más cerrado. Es lo que confina las partículas en un ciclotrón.',
    },
    {
      id: 'periodo',
      nombre: 'Periodo del giro',
      plantilla: 'T = 2π · {mp} / ( {q} · {B} )',
      salida: 'Tc',
      dice: 'No depende de la velocidad: rápida o lenta, la partícula tarda lo mismo en dar la vuelta.',
    },
    {
      id: 'larmor',
      nombre: 'Frecuencia de Larmor',
      plantilla: 'f = {q} · {B} / ( 2π · {mp} )',
      salida: 'fMHz',
      dice: 'La frecuencia a la que hay que excitar los protones. A 1,5 T son 63,9 MHz: eso es una resonancia.',
    },
    {
      id: 'flujo',
      nombre: 'Flujo magnético',
      plantilla: 'Φ = {B} · {Aesp} · cos( {th} )',
      salida: 'flujo',
      dice: 'Cuántas líneas de campo atraviesan la espira. De canto (90°) no la atraviesa ninguna.',
    },
    {
      id: 'faraday',
      nombre: 'Ley de Faraday',
      plantilla: 'ε = {Nesp} · {B} · {Aesp} · {om} · sen( {th} )',
      salida: 'fem',
      dice: 'Lo que induce corriente es el CAMBIO de flujo. Una espira quieta en un campo enorme no genera nada.',
    },
  ],
  tablero: ['F', 'r', 'fMHz', 'flujo', 'fem'],
};

/* ═══ C13 · Óptica geométrica ════════════════════════════════════════════════ */

export const LENTE: CatalogoLab = {
  magnitudes: {
    f:   { simbolo: 'f',  nombre: 'Focal',            unidad: 'm',  decimales: 3 },
    s:   { simbolo: 's',  nombre: 'Distancia objeto', unidad: 'm',  decimales: 3 },
    si:  { simbolo: "s′", nombre: 'Distancia imagen', unidad: 'm',  decimales: 3 },
    h:   { simbolo: 'h',  nombre: 'Altura objeto',    unidad: 'm',  decimales: 3 },
    hi:  { simbolo: "h′", nombre: 'Altura imagen',    unidad: 'm',  decimales: 3 },
    M:   { simbolo: 'M',  nombre: 'Aumento',          unidad: '×',  decimales: 2 },
    P:   { simbolo: 'P',  nombre: 'Potencia',         unidad: 'D',  decimales: 2 },
    n1:  { simbolo: 'n₁', nombre: 'Índice medio 1',   unidad: '',   decimales: 3 },
    n2:  { simbolo: 'n₂', nombre: 'Índice medio 2',   unidad: '',   decimales: 3 },
    th1: { simbolo: 'θ₁', nombre: 'Ángulo incidente', unidad: '°',  decimales: 1 },
    th2: { simbolo: 'θ₂', nombre: 'Ángulo refractado', unidad: '°', decimales: 1 },
    pr:  { simbolo: 'r',  nombre: 'Punto remoto',     unidad: 'm',  decimales: 2 },
    Pc:  { simbolo: 'P_c', nombre: 'Lente correctora', unidad: 'D', decimales: 2 },
  },
  formulas: [
    {
      id: 'lente',
      nombre: 'Ecuación de la lente',
      plantilla: "s′ = ( {f} · {s} ) / ( {s} − {f} )",
      salida: 'si',
      dice: 'La forma despejada de 1/f = 1/s + 1/s′. Con s < f el denominador cambia de signo: imagen virtual.',
    },
    {
      id: 'aumento',
      nombre: 'Aumento',
      plantilla: "M = − {si} / {s}",
      salida: 'M',
      dice: 'Negativo significa invertida — que es exactamente cómo llega la imagen a tu retina ahora mismo.',
    },
    {
      id: 'altura',
      nombre: 'Altura de la imagen',
      plantilla: "h′ = {M} · {h}",
      salida: 'hi',
      dice: 'El aumento no es «cuánto se ve de grande», es la razón entre las dos alturas reales.',
    },
    {
      id: 'potencia',
      nombre: 'Potencia en dioptrías',
      plantilla: 'P = 1 / {f}',
      salida: 'P',
      dice: 'La graduación de unas gafas. El ojo relajado ronda +59 D; la córnea pone dos tercios.',
    },
    {
      id: 'snell',
      nombre: 'Ley de Snell',
      plantilla: 'θ₂ = arcsen( {n1} · sen({th1}) / {n2} )',
      salida: 'th2',
      dice: 'El salto aire→córnea (1,00 → 1,376) es donde el ojo desvía casi toda la luz, no en el cristalino.',
    },
    {
      id: 'correccion',
      nombre: 'Lente correctora del miope',
      plantilla: 'P_c = − 1 / {pr}',
      salida: 'Pc',
      dice: 'Lleva el infinito al punto remoto del ojo. Un punto remoto de 50 cm pide −2,00 dioptrías.',
    },
  ],
  tablero: ['si', 'M', 'hi', 'P', 'Pc'],
};

/* ═══ C14 · Fotones, electrones y átomos ═════════════════════════════════════ */

export const FOTOELECTRICO: CatalogoLab = {
  magnitudes: {
    f:      { simbolo: 'f',    nombre: 'Frecuencia',        unidad: 'Hz', formato: 'exp' },
    lam:    { simbolo: 'λ',    nombre: 'Longitud de onda',  unidad: 'm',  formato: 'exp' },
    lamNm:  { simbolo: 'λ',    nombre: 'Longitud de onda',  unidad: 'nm', decimales: 0 },
    W0:     { simbolo: 'W₀',   nombre: 'Función trabajo',   unidad: 'eV', decimales: 2 },
    E:      { simbolo: 'E',    nombre: 'Energía del fotón', unidad: 'eV', decimales: 2 },
    Kmax:   { simbolo: 'K',    nombre: 'K máxima',          unidad: 'eV', decimales: 2 },
    f0:     { simbolo: 'f₀',   nombre: 'Frecuencia umbral', unidad: 'Hz', formato: 'exp' },
    lam0:   { simbolo: 'λ₀',   nombre: 'λ umbral',          unidad: 'nm', decimales: 0 },
    V0:     { simbolo: 'V₀',   nombre: 'Potencial de frenado', unidad: 'V', decimales: 2 },
    ve:     { simbolo: 'v',    nombre: 'Velocidad electrón', unidad: 'm/s', formato: 'exp' },
    inten:  { simbolo: 'Φ',    nombre: 'Intensidad',        unidad: '%',  decimales: 0 },
    ne:     { simbolo: 'n',    nombre: 'Electrones/s',      unidad: '',   formato: 'exp' },
  },
  formulas: [
    {
      id: 'planck',
      nombre: 'Energía del fotón',
      plantilla: 'E = 4,136×10⁻¹⁵ · {f}',
      salida: 'E',
      dice: 'La luz llega en paquetes. Subir la intensidad manda más paquetes, no paquetes más gordos.',
    },
    {
      id: 'practica',
      nombre: 'La versión práctica',
      plantilla: 'E = 1240 / {lamNm}',
      salida: 'E',
      dice: 'Con λ en nanómetros da eV directamente. Es la que conviene llevarse memorizada al examen.',
    },
    {
      id: 'einstein',
      nombre: 'Ecuación de Einstein',
      plantilla: 'K = {E} − {W0}',
      salida: 'Kmax',
      dice: 'Si el fotón no trae al menos W₀, no sale ningún electrón — por mucha luz que eches.',
    },
    {
      id: 'umbral',
      nombre: 'Frecuencia umbral',
      plantilla: 'f₀ = {W0} / 4,136×10⁻¹⁵',
      salida: 'f0',
      dice: 'El corte es tajante: por debajo, cero electrones; justo por encima, ya salen. Eso mató a la onda clásica.',
    },
    {
      id: 'frenado',
      nombre: 'Potencial de frenado',
      plantilla: 'V₀ = {Kmax}',
      salida: 'V0',
      dice: 'En electronvoltios el número coincide: el voltaje justo que detiene al electrón más rápido.',
    },
    {
      id: 'velocidad',
      nombre: 'Velocidad del electrón',
      plantilla: 'v = √( 2 · {Kmax} · 1,602×10⁻¹⁹ / 9,109×10⁻³¹ )',
      salida: 've',
      dice: 'Pasando los eV a julios y despejando de ½mv². Sale una fracción apreciable de la luz.',
    },
  ],
  tablero: ['E', 'Kmax', 'lam0', 'V0', 've'],
};
