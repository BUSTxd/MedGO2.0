import type { ModuloTeoria } from './types';

/**
 * C6 — Movimiento periódico. Ondas mecánicas.
 *
 * Las 4 secciones son exactamente los 4 subtemas que la clase declara en el
 * sílabo (`src/lib/data/fisica.ts`), en su mismo orden: MAS → péndulo y
 * masa-resorte → ondas transversales y longitudinales → sonido y oído.
 */
export const moduloC6: ModuloTeoria = {
  claseId: 'fis-c-6',
  codigo: 'C6',
  titulo: 'Movimiento periódico y ondas mecánicas',
  gancho:
    'Un cuerpo que vuelve siempre al mismo sitio, una y otra vez. De ahí salen el latido, la voz, el oído y casi todo lo que vibra dentro de ti.',
  duracion: 25,

  secciones: [
    // ─── 1 ─────────────────────────────────────────────────────────────────
    {
      id: 'mas',
      titulo: 'Movimiento armónico simple',
      subtitulo: 'La oscilación de la que salen todas las demás',
      acento: '#5E9CD3',
      icono: 'resorte',
      objetivo:
        'Reconocer cuándo un movimiento es armónico simple y saber de qué depende (y de qué NO depende) su periodo.',
      logica: [
        {
          tipo: 'idea',
          titulo: 'La condición que lo define',
          texto:
            'Un movimiento es armónico simple cuando la fuerza que devuelve al cuerpo a su posición de equilibrio es proporcional a cuánto se alejó de ella, y apunta siempre hacia ella. Nada más. Si se cumple eso, el movimiento resultante es una cosenoide, aunque el sistema sea un resorte, una molécula o una columna de aire.',
        },
        {
          tipo: 'formula',
          expresion: 'F = −k · x',
          lectura:
            '«La fuerza recuperadora es menos ka equis»: el signo menos es lo importante — dice que la fuerza va SIEMPRE en sentido contrario al desplazamiento.',
          partes: [
            { simbolo: 'F', significado: 'Fuerza recuperadora', unidad: 'N' },
            { simbolo: 'k', significado: 'Constante elástica: cuán duro es el resorte', unidad: 'N/m' },
            { simbolo: 'x', significado: 'Desplazamiento desde el equilibrio', unidad: 'm' },
          ],
          viva: {
            calculo: 'fuerza-resorte',
            viz: 'fuerza-resorte',
            variables: [
              { id: 'x', simbolo: 'x', unidad: 'm',   min: -0.4, max: 0.4, paso: 0.01, inicial: 0.2, decimales: 2 },
              { id: 'k', simbolo: 'k', unidad: 'N/m', min: 5,    max: 120, paso: 1,    inicial: 40,  decimales: 0 },
            ],
            resultado: { simbolo: 'F', unidad: 'N', decimales: 1, min: -48, max: 48 },
            sustituida: 'F = − {k} N/m × ({x} m) = {=} N',
            observa:
              'Arrastra x hasta pasar de positivo a negativo: la flecha roja se da la vuelta sola. Eso es todo lo que dice el signo menos — la fuerza apunta siempre HACIA el equilibrio, nunca en el sentido del desplazamiento.',
          },
        },
        {
          tipo: 'pasos',
          titulo: 'De la fuerza al periodo, en tres saltos',
          pasos: [
            'Si F = −kx y además F = ma, entonces la aceleración es a = −(k/m)·x: proporcional a la posición y de signo opuesto.',
            'La única función cuya segunda derivada es ella misma cambiada de signo es el coseno. Por eso x(t) = A·cos(ωt + φ), con ω = √(k/m).',
            'Como el periodo es T = 2π/ω, queda T = 2π·√(m/k). Aparecen la masa y la rigidez — y NO aparece la amplitud.',
          ],
        },
        {
          tipo: 'formula',
          expresion: 'T = 2π · √(m / k)',
          lectura:
            'Sólo aparecen la masa y la rigidez. Más masa cuesta más de mover, así que tarda más; más rigidez tira más fuerte, así que tarda menos.',
          partes: [
            { simbolo: 'T', significado: 'Periodo: lo que tarda una oscilación completa', unidad: 's' },
            { simbolo: 'm', significado: 'Masa que oscila', unidad: 'kg' },
            { simbolo: 'k', significado: 'Constante elástica del resorte', unidad: 'N/m' },
          ],
          viva: {
            calculo: 'periodo-resorte',
            viz: 'oscilador-resorte',
            variables: [
              { id: 'm', simbolo: 'm', unidad: 'kg',  min: 0.1, max: 5,   paso: 0.1, inicial: 1,  decimales: 1 },
              { id: 'k', simbolo: 'k', unidad: 'N/m', min: 5,   max: 120, paso: 1,   inicial: 30, decimales: 0 },
            ],
            resultado: { simbolo: 'T', unidad: 's', decimales: 2, min: 0.15, max: 6.3 },
            sustituida: 'T = 2π · √( {m} / {k} ) = {=} s',
            observa:
              'Cuadruplica la masa: el periodo NO se hace 4 veces mayor, sino 2 — la masa está dentro de una raíz. Y fíjate en lo que no hay: ningún control de amplitud, porque no entra en la fórmula.',
          },
        },
        {
          tipo: 'trampa',
          titulo: 'Lo que más se falla en el examen',
          texto:
            'El periodo NO depende de la amplitud. Si estiras el resorte al doble, la masa recorre el doble de distancia, pero también lo hace con el doble de fuerza y por tanto más rápido: los dos efectos se cancelan exactamente. Tarda lo mismo. A esto se le llama isocronía.',
        },
        {
          tipo: 'formula',
          expresion: 'E = ½ k A²',
          lectura:
            'La energía total del oscilador depende sólo de la amplitud (y de k), y se mantiene constante: va cambiando de forma entre cinética y potencial, pero la suma no se mueve.',
          partes: [
            { simbolo: 'E', significado: 'Energía mecánica total', unidad: 'J' },
            { simbolo: 'A', significado: 'Amplitud: el desplazamiento máximo', unidad: 'm' },
            { simbolo: 'k', significado: 'Constante elástica del resorte', unidad: 'N/m' },
          ],
          viva: {
            calculo: 'energia-resorte',
            viz: 'energia-resorte',
            variables: [
              { id: 'A', simbolo: 'A', unidad: 'm',   min: 0.05, max: 0.5, paso: 0.01, inicial: 0.3, decimales: 2 },
              { id: 'k', simbolo: 'k', unidad: 'N/m', min: 5,    max: 120, paso: 1,    inicial: 40,  decimales: 0 },
            ],
            resultado: { simbolo: 'E', unidad: 'J', decimales: 2, min: 0, max: 15 },
            sustituida: 'E = ½ × {k} N/m × ({A} m)² = {=} J',
            observa:
              'La curva no es una recta: es una parábola. El punto gris marca la mitad de tu amplitud — comprueba que su energía es la cuarta parte, no la mitad. Ese cuadrado es la diferencia entre A y A².',
          },
        },
        {
          tipo: 'clinico',
          titulo: 'Dónde te lo vas a encontrar',
          texto:
            'La pared torácica durante la ventilación mecánica se modela como un sistema masa-resorte: la «compliancia» pulmonar es el inverso de una constante elástica. Un pulmón fibrótico es un resorte más duro (k alta) — cuesta más inflarlo y su respuesta es más rápida.',
        },
      ],
      sim: 'resorte',
      problema: {
        enunciado:
          'Un bloque de 0,80 kg está unido a un resorte de constante k = 50 N/m sobre una superficie sin rozamiento. Se separa 12 cm del equilibrio y se suelta.',
        datos: [
          { label: 'm', valor: '0,80 kg' },
          { label: 'k', valor: '50 N/m' },
          { label: 'A', valor: '12 cm' },
        ],
        preset: { masa: 0.8, k: 50, amplitud: 0.12 },
        pregunta: '¿Cuánto tarda el bloque en completar una oscilación entera?',
        respuesta: { valor: 0.79, unidad: 's', tolerancia: 0.05 },
        pasos: [
          'Piden el periodo, y para masa-resorte es T = 2π√(m/k). Antes de sustituir, mira qué datos entran: la amplitud de 12 cm NO aparece en la fórmula. Está en el enunciado justamente para ver si la usas.',
          'Divide: m/k = 0,80 / 50 = 0,016 s².',
          'Saca la raíz: √0,016 = 0,1265 s.',
          'Multiplica por 2π: T = 2π × 0,1265 = 0,79 s.',
        ],
        comprueba:
          'Con la simulación configurada, la lectura «Periodo T» marca 0,79 s. Ahora arrastra la amplitud de 12 cm a 50 cm: el bloque recorre mucho más camino y ese número no se mueve ni una centésima.',
      },
      retos: [
        {
          pregunta: '¿Puedes hacer que el periodo cambie SIN tocar la masa ni la constante k?',
          pista: 'Prueba a mover sólo la amplitud y mira el cronómetro del periodo. ¿Se inmuta?',
        },
        {
          pregunta: 'Deja k fija y cuadruplica la masa. ¿Cuánto crees que se hará el periodo? Compruébalo.',
          pista: 'La masa está dentro de una raíz cuadrada: ×4 dentro de la raíz sale como ×2 fuera.',
        },
        {
          pregunta: '¿En qué punto de la trayectoria la velocidad es máxima y en cuál lo es la aceleración?',
          pista: 'Mira las barras de energía: donde toda la energía es cinética, y donde toda es potencial.',
        },
      ],
      chequeo: {
        pregunta:
          'Un sistema masa-resorte oscila con periodo T. Si se duplica la amplitud sin cambiar nada más, el nuevo periodo es:',
        opciones: ['2T', 'T (no cambia)', 'T/2', 'T·√2'],
        correcta: 1,
        explicacion:
          'T = 2π√(m/k) no contiene la amplitud. Al duplicar A, el cuerpo recorre el doble de camino pero con el doble de fuerza recuperadora y por tanto el doble de rapidez media: el tiempo de ida y vuelta es idéntico. Lo que sí se duplica es la velocidad máxima, y la energía se hace 4 veces mayor (E = ½kA²).',
      },
    },

    // ─── 2 ─────────────────────────────────────────────────────────────────
    {
      id: 'pendulo',
      titulo: 'Péndulo y sistemas masa-resorte',
      subtitulo: 'El mismo movimiento con otro disfraz',
      acento: '#9B8EF8',
      icono: 'pendulo',
      objetivo:
        'Entender por qué el péndulo sólo es armónico para ángulos pequeños, y por qué su periodo ignora la masa.',
      logica: [
        {
          tipo: 'idea',
          titulo: 'Aquí la que recupera es la gravedad',
          texto:
            'En el péndulo no hay resorte: lo que devuelve la masa al centro es la componente del peso tangente a la trayectoria, que vale −mg·sen θ. Eso no es proporcional a θ, así que en rigor un péndulo NO es un oscilador armónico simple.',
        },
        {
          tipo: 'pasos',
          titulo: 'Cómo se convierte en armónico (la aproximación clave)',
          pasos: [
            'Para ángulos pequeños, sen θ ≈ θ (con θ en radianes). A 10° el error es del 0,5 %; a 30° ya es del 4,5 %.',
            'Con esa aproximación la fuerza pasa a ser proporcional al desplazamiento, y recuperamos el MAS.',
            'Resolviendo queda T = 2π·√(L/g): sólo la longitud y la gravedad. La masa se cancela porque aparece en la fuerza (mg) y en la inercia (m) a la vez.',
          ],
        },
        {
          tipo: 'formula',
          expresion: 'T = 2π · √(L / g)',
          lectura:
            '«Dos pi por raíz de ele sobre ge». Para cuadruplicar el periodo hay que hacer el hilo 16 veces más largo.',
          partes: [
            { simbolo: 'T', significado: 'Periodo: lo que tarda una oscilación completa', unidad: 's' },
            { simbolo: 'L', significado: 'Longitud del hilo', unidad: 'm' },
            { simbolo: 'g', significado: 'Aceleración de la gravedad', unidad: 'm/s²' },
          ],
          viva: {
            calculo: 'periodo-pendulo',
            viz: 'pendulo-mini',
            variables: [
              { id: 'L', simbolo: 'L', unidad: 'm',    min: 0.1, max: 3,  paso: 0.05, inicial: 1,    decimales: 2 },
              { id: 'g', simbolo: 'g', unidad: 'm/s²', min: 1.6, max: 11, paso: 0.01, inicial: 9.81, decimales: 2 },
            ],
            resultado: { simbolo: 'T', unidad: 's', decimales: 2, min: 0.5, max: 8.7 },
            sustituida: 'T = 2π · √( {L} / {g} ) = {=} s',
            observa:
              'Baja g hasta 1,62 (la Luna) y mira cómo se dispara el periodo. Y busca el control de la masa: no existe, porque no está en la fórmula.',
          },
        },
        {
          tipo: 'contraste',
          titulo: 'Los dos osciladores, lado a lado',
          a: {
            titulo: 'Masa-resorte',
            items: [
              'T = 2π√(m/k)',
              'La masa SÍ importa',
              'Es armónico siempre (mientras el resorte no se deforme)',
              'Funciona en el espacio, sin gravedad',
            ],
          },
          b: {
            titulo: 'Péndulo simple',
            items: [
              'T = 2π√(L/g)',
              'La masa NO importa',
              'Sólo es armónico si θ es pequeño',
              'Sin gravedad no oscila en absoluto',
            ],
          },
        },
        {
          tipo: 'trampa',
          titulo: 'Lo que más se falla en el examen',
          texto:
            'Cambiar la masa del péndulo no cambia nada del periodo. Es el mismo motivo por el que todos los cuerpos caen igual: una masa mayor pesa más, pero también cuesta más acelerarla, y las dos cosas se anulan.',
        },
        {
          tipo: 'clinico',
          titulo: 'Dónde te lo vas a encontrar',
          texto:
            'La marcha humana se modela como dos péndulos acoplados: la pierna en balanceo oscila casi libre. Por eso una persona alta camina con una cadencia más lenta y por eso, al acortar el péndulo flexionando la rodilla, se puede caminar más rápido sin aumentar la zancada.',
        },
      ],
      sim: 'pendulo',
      problema: {
        enunciado:
          'Para calibrar la cadencia de marcha de un paciente se usa un péndulo de 0,60 m de hilo con una pesa de 250 g. Se separa 10° de la vertical y se suelta.',
        datos: [
          { label: 'L', valor: '0,60 m' },
          { label: 'm', valor: '250 g' },
          { label: 'θ₀', valor: '10°' },
          { label: 'g', valor: '9,81 m/s²' },
        ],
        preset: { longitud: 0.6, angulo: 10, g: 9.81 },
        pregunta: '¿Cuál es el periodo de oscilación?',
        respuesta: { valor: 1.55, unidad: 's', tolerancia: 0.05 },
        pasos: [
          'El periodo del péndulo es T = 2π√(L/g). Los 250 g de la pesa no entran: la masa se cancela en la ecuación de movimiento, y está en el enunciado como distractor.',
          'Comprueba primero que la aproximación vale: 10° es un ángulo pequeño (por debajo de ~15°), así que se puede usar sen θ ≈ θ.',
          'Divide: L/g = 0,60 / 9,81 = 0,0612 s².',
          'Raíz y por 2π: √0,0612 = 0,2473 → T = 2π × 0,2473 = 1,55 s.',
        ],
        comprueba:
          'La simulación da «T de la fórmula» 1,554 s y «T real (exacto)» 1,557 s: un error del 0,19 %, despreciable. Ahora sube θ₀ a 60° sin tocar nada más y mira el error saltar por encima del 7 % — ahí la fórmula que acabas de usar ya no serviría.',
      },
      retos: [
        {
          pregunta: 'Pon los dos péndulos con la misma longitud pero masas muy distintas. ¿Se desincronizan?',
          pista: 'Déjalos correr 30 oscilaciones y mira si siguen en fase. La masa no está en la fórmula.',
        },
        {
          pregunta: '¿A partir de qué ángulo empieza a notarse que la fórmula T = 2π√(L/g) falla?',
          pista: 'La simulación resuelve el péndulo REAL y muestra al lado el periodo que predice la fórmula. Sube el ángulo y compara.',
        },
        {
          pregunta: 'Cambia la gravedad a la de la Luna (1,62). ¿El péndulo va más rápido o más lento?',
          pista: 'g está en el denominador, dentro de la raíz.',
        },
      ],
      chequeo: {
        pregunta:
          'Dos péndulos tienen la misma longitud, pero el segundo lleva una masa 4 veces mayor. Comparados sus periodos:',
        opciones: [
          'El segundo tarda el doble',
          'El segundo tarda 4 veces más',
          'Tardan exactamente lo mismo',
          'El segundo tarda la mitad',
        ],
        correcta: 2,
        explicacion:
          'T = 2π√(L/g) no contiene la masa. La fuerza recuperadora es mg·sen θ (crece con m) pero la inercia a vencer también es m, así que la masa se cancela en la ecuación de movimiento. Lo único que cambiaría el periodo aquí sería la longitud o la gravedad.',
      },
    },

    // ─── 3 ─────────────────────────────────────────────────────────────────
    {
      id: 'ondas',
      titulo: 'Ondas transversales y longitudinales',
      subtitulo: 'Cuando la oscilación se propaga',
      acento: '#2DC99A',
      icono: 'onda',
      objetivo:
        'Distinguir los dos tipos de onda por la dirección de vibración, y manejar v = λ·f sabiendo quién manda sobre quién.',
      logica: [
        {
          tipo: 'idea',
          titulo: 'Lo que viaja es la energía, no la materia',
          texto:
            'En una onda mecánica cada partícula del medio sólo oscila alrededor de su sitio: nunca acompaña a la onda. Lo que se propaga es el patrón de perturbación, y con él la energía. El corcho en el agua sube y baja; no llega a la orilla.',
        },
        {
          tipo: 'contraste',
          titulo: 'Los dos tipos, según hacia dónde vibra el medio',
          a: {
            titulo: 'Transversal',
            items: [
              'Las partículas vibran PERPENDICULAR a la propagación',
              'Se ve como crestas y valles',
              'Cuerda de guitarra, ola, luz',
              'Necesita rigidez de cizalla: no viaja por fluidos',
            ],
          },
          b: {
            titulo: 'Longitudinal',
            items: [
              'Las partículas vibran PARALELO a la propagación',
              'Se ve como compresiones y rarefacciones',
              'Sonido, ultrasonido, onda de pulso arterial',
              'Viaja por sólidos, líquidos y gases',
            ],
          },
        },
        {
          tipo: 'formula',
          expresion: 'v = λ · f',
          lectura:
            '«La velocidad es lambda por efe». Se lee de izquierda a derecha, pero se razona al revés: la velocidad la fija el MEDIO, la frecuencia la fija la FUENTE, y la longitud de onda es lo único que se acomoda.',
          partes: [
            { simbolo: 'v', significado: 'Velocidad de propagación: la pone el medio', unidad: 'm/s' },
            { simbolo: 'λ', significado: 'Longitud de onda: distancia entre dos crestas', unidad: 'm' },
            { simbolo: 'f', significado: 'Frecuencia: oscilaciones por segundo, la pone la fuente', unidad: 'Hz' },
          ],
          viva: {
            calculo: 'velocidad-onda',
            viz: 'onda-mini',
            variables: [
              { id: 'lambda', simbolo: 'λ', unidad: 'm',  min: 0.1, max: 8, paso: 0.1, inicial: 3, decimales: 1 },
              { id: 'f',      simbolo: 'f', unidad: 'Hz', min: 0.1, max: 5, paso: 0.1, inicial: 2, decimales: 1 },
            ],
            resultado: { simbolo: 'v', unidad: 'm/s', decimales: 2, min: 0, max: 40 },
            sustituida: 'v = {lambda} m × {f} Hz = {=} m/s',
            observa:
              'Aquí manipulas λ y f porque es la fórmula literal. En el mundo real es al revés: v la fija el medio y f la fuente, así que la que se acomoda es λ. Mantén v mentalmente fija y comprueba que subir f te obliga a bajar λ.',
          },
        },
        {
          tipo: 'formula',
          expresion: 'f = v / d',
          lectura:
            '«La frecuencia mínima es la velocidad del medio entre el tamaño del detalle». No es una fórmula nueva: es v = λ·f despejada, usando que para distinguir algo de tamaño d la longitud de onda tiene que caberle dentro (λ ≤ d). El caso límite, λ = d, da la frecuencia MÍNIMA que sirve.',
          partes: [
            { simbolo: 'f', significado: 'Frecuencia mínima que resuelve ese detalle', unidad: 'Hz' },
            { simbolo: 'v', significado: 'Velocidad del sonido en el medio (tejido blando: 1540)', unidad: 'm/s' },
            { simbolo: 'd', significado: 'Tamaño del detalle más pequeño que quieres ver', unidad: 'm' },
          ],
          viva: {
            calculo: 'frecuencia-resolucion',
            viz: 'resolucion-eco',
            // Arranca en el caso del problema: 0,250 mm en tejido humano.
            variables: [
              { id: 'd', simbolo: 'd', unidad: 'mm',  min: 0.05, max: 2,    paso: 0.005, inicial: 0.25, decimales: 3 },
              { id: 'v', simbolo: 'v', unidad: 'm/s', min: 1450, max: 4080, paso: 10,    inicial: 1540, decimales: 0 },
            ],
            resultado: { simbolo: 'f', unidad: 'MHz', decimales: 2, min: 0, max: 40 },
            sustituida: 'f = {v} m/s ÷ {d} mm = {=} MHz',
            observa:
              'Empieza en 0,250 mm de tejido: salen 6,16 MHz, justo una sonda de las que existen. Ahora baja d a 0,05 mm — pedirías 30 MHz, fuera del rango real, y por eso una ecografía no ve una célula. Sube v a 4080 (hueso) sin tocar d y mira cómo la frecuencia exigida se dispara: la misma nitidez cuesta mucho más ahí.',
          },
        },
        {
          tipo: 'trampa',
          titulo: 'Lo que más se falla en el examen',
          texto:
            'Al pasar una onda de un medio a otro, la frecuencia NO cambia — la sigue imponiendo la fuente. Lo que cambian son la velocidad (nuevo medio) y, en consecuencia, la longitud de onda. Es el error clásico en los problemas de ultrasonido atravesando tejidos.',
        },
        {
          tipo: 'analogia',
          titulo: 'Para no confundir amplitud con longitud de onda',
          texto:
            'Piensa en una fila de gente haciendo la ola en un estadio. La amplitud es cuánto se levanta cada persona (energía). La longitud de onda es cuántos asientos hay entre dos personas de pie a la vez (geometría). La frecuencia es cuántas veces se levanta cada uno por segundo. Son tres cosas independientes.',
        },
        {
          tipo: 'clinico',
          titulo: 'Dónde te lo vas a encontrar',
          texto:
            'La ecografía usa ondas longitudinales de 2–15 MHz. Como v en tejido blando es fija (~1540 m/s), subir la frecuencia acorta λ y mejora la resolución… pero también aumenta la atenuación, así que penetra menos. Ese es exactamente el compromiso que decide qué sonda se elige: 12 MHz para tiroides superficial, 3 MHz para abdomen.',
        },
      ],
      sim: 'ondas',
      problema: {
        enunciado:
          'Una cuerda tensa transmite ondas a 6,0 m/s. El extremo se agita arriba y abajo completando 2,0 oscilaciones cada segundo.',
        datos: [
          { label: 'v', valor: '6,0 m/s' },
          { label: 'f', valor: '2,0 Hz' },
        ],
        preset: { velocidad: 6, frecuencia: 2, amplitud: 0.6, longitudinal: 0 },
        pregunta: '¿Qué distancia hay entre dos crestas consecutivas?',
        respuesta: { valor: 3, unidad: 'm', tolerancia: 0.05 },
        pasos: [
          'La distancia entre dos crestas consecutivas es, por definición, la longitud de onda λ.',
          'De v = λ·f se despeja λ = v/f. Fíjate en el orden lógico: v y f son datos del problema (medio y fuente), λ es lo que sale.',
          'Sustituye: λ = 6,0 / 2,0 = 3,0 m.',
          'Mismo cálculo, contexto clínico: una sonda de ecografía de 3,5 MHz en tejido blando (1540 m/s) da λ = 1540 / 3,5·10⁶ = 0,44 mm. Es la misma división.',
        ],
        comprueba:
          'La regla de λ dibujada sobre la onda mide justo 3,00 m y la lectura lo confirma. Ahora sube la frecuencia a 4 Hz dejando v en 6: la regla se encoge a la mitad sin que la onda viaje más rápido.',
      },
      retos: [
        {
          pregunta: 'Cambia a modo longitudinal. ¿Sigues viendo «crestas»? ¿Qué las sustituye?',
          pista: 'Fíjate en las zonas donde los puntos se apelotonan y donde se separan.',
        },
        {
          pregunta: 'Sube la frecuencia manteniendo la velocidad del medio. ¿Qué le pasa a λ?',
          pista: 'Si v está fijo y f sube, en v = λf sólo queda una variable libre.',
        },
        {
          pregunta: 'Marca una partícula y síguela con la vista durante 10 segundos. ¿Avanza con la onda?',
          pista: 'Activa el rastro de la partícula destacada. Su trayectoria te dice todo.',
        },
      ],
      chequeo: {
        pregunta:
          'Una onda de ultrasonido de 5 MHz pasa de tejido blando (1540 m/s) a hueso (4080 m/s). ¿Qué ocurre?',
        opciones: [
          'Aumentan la frecuencia y la longitud de onda',
          'La frecuencia sigue en 5 MHz y la longitud de onda aumenta',
          'La frecuencia baja y la longitud de onda se mantiene',
          'No cambia nada, es el mismo pulso',
        ],
        correcta: 1,
        explicacion:
          'La frecuencia la impone la fuente y se conserva al cambiar de medio. Como v = λf y la velocidad sube de 1540 a 4080 m/s, λ debe subir en la misma proporción: pasa de ~0,31 mm a ~0,82 mm. Esa pérdida de resolución dentro del hueso es una de las razones por las que la ecografía no sirve para ver a través de él.',
      },
    },

    // ─── 4 ─────────────────────────────────────────────────────────────────
    {
      id: 'sonido',
      titulo: 'Sonido y oído',
      subtitulo: 'De la onda de presión al nervio auditivo',
      acento: '#F5A623',
      icono: 'oido',
      objetivo:
        'Interpretar la escala de decibelios y entender por qué el oído separa las frecuencias por posición dentro de la cóclea.',
      logica: [
        {
          tipo: 'idea',
          titulo: 'El sonido es una onda de presión',
          texto:
            'Lo que llega al tímpano no es «aire moviéndose hacia ti», sino una sucesión de zonas ligeramente más comprimidas y más enrarecidas que la presión atmosférica. Un sonido conversacional altera la presión en apenas 0,02 Pa sobre 101 325 Pa: el tímpano detecta variaciones de una parte en cinco millones.',
        },
        {
          tipo: 'formula',
          expresion: 'β = 10 · log₁₀ (I / I₀)',
          lectura:
            'El nivel en decibelios es logarítmico porque el oído lo es: multiplicar la intensidad por 10 sube sólo 10 dB, y por 100 sube 20 dB.',
          partes: [
            { simbolo: 'β', significado: 'Nivel de intensidad sonora', unidad: 'dB' },
            { simbolo: 'I', significado: 'Intensidad de la onda', unidad: 'W/m²' },
            { simbolo: 'I₀', significado: 'Umbral de audición de referencia: 10⁻¹²', unidad: 'W/m²' },
          ],
          viva: {
            calculo: 'nivel-db',
            viz: 'db-mini',
            variables: [
              {
                id: 'veces', simbolo: 'I/I₀', min: 1, max: 1e14,
                paso: 1, inicial: 1e6, escala: 'log', decimales: 0,
              },
            ],
            resultado: { simbolo: 'β', unidad: 'dB', decimales: 1, min: 0, max: 140 },
            sustituida: 'β = 10 · log₁₀( {veces} ) = {=} dB',
            observa:
              'Este control va en escala logarítmica, como el oído. Arrástralo despacio: cada vez que la intensidad se multiplica por 10, el nivel sube sólo 10 dB. De 1 a 100 000 000 000 000 veces, la escala entera cabe en 140 dB.',
          },
        },
        {
          tipo: 'pasos',
          titulo: 'Las consecuencias de que sea logarítmica',
          pasos: [
            'Duplicar la intensidad sube sólo 3 dB — dos altavoces iguales no suenan «al doble».',
            'Sumar 10 dB multiplica la intensidad por 10, pero la sonoridad percibida sólo se duplica.',
            'Por eso el salto de 80 a 110 dB de un concierto no es «un 37 % más»: es mil veces más intenso.',
          ],
        },
        {
          tipo: 'pasos',
          titulo: 'El camino de la onda dentro del oído',
          pasos: [
            'El pabellón capta y el conducto auditivo amplifica por resonancia las frecuencias del habla (2–5 kHz).',
            'El tímpano convierte presión en movimiento mecánico.',
            'La cadena de huesecillos amplifica ~22 veces la presión, sobre todo porque el tímpano tiene mucha más área que la ventana oval. Sin esa adaptación de impedancia, casi todo el sonido rebotaría al pasar de aire a líquido.',
            'En la cóclea, la membrana basilar vibra en un punto distinto según la frecuencia: los agudos cerca de la base, los graves cerca del ápex. Eso es la tonotopía.',
            'Las células ciliadas de ese punto disparan el nervio auditivo. La frecuencia se codifica por POSICIÓN, no por velocidad de disparo.',
          ],
        },
        {
          tipo: 'trampa',
          titulo: 'Lo que más se falla en el examen',
          texto:
            'Frecuencia no es volumen. La frecuencia (Hz) determina el TONO —grave o agudo— y la amplitud determina la INTENSIDAD —fuerte o débil—. Son ejes independientes: un sonido grave puede ser ensordecedor y uno agudo, casi inaudible.',
        },
        {
          tipo: 'clinico',
          titulo: 'Dónde te lo vas a encontrar',
          texto:
            'La presbiacusia empieza siempre por los agudos, y la tonotopía explica por qué: las células que codifican altas frecuencias están en la base de la cóclea, y toda onda que entra pasa por ahí. Acumulan el desgaste de toda una vida de exposición. El paciente típico dice «oigo pero no entiendo»: las consonantes viven en los 2–4 kHz.',
        },
      ],
      sim: 'sonido',
      problema: {
        enunciado:
          'En un taller, una máquina produce por sí sola un nivel de 85 dB en el puesto del operario. Por un aumento de producción se ponen a funcionar 4 máquinas idénticas a la vez, todas a la misma distancia.',
        datos: [
          { label: 'β de una máquina', valor: '85 dB' },
          { label: 'Nº de máquinas', valor: '4' },
        ],
        preset: { db: 91, frecuencia: 1000 },
        pregunta: '¿Qué nivel de intensidad sonora hay ahora en el puesto?',
        respuesta: { valor: 91, unidad: 'dB', tolerancia: 0.03 },
        pasos: [
          'Lo que se suma son las INTENSIDADES, no los decibelios. Cuatro máquinas iguales dan I_total = 4·I.',
          'Aplica la definición: β = 10·log(4I/I₀). Por la propiedad del logaritmo de un producto, eso es 10·log(I/I₀) + 10·log(4).',
          'El primer término es el nivel de una sola máquina: 85 dB. El segundo es 10·log(4) = 10 × 0,602 = 6,0 dB.',
          'Suma: β = 85 + 6,0 = 91 dB. Comprueba los dos errores clásicos: no son 340 dB (multiplicar por 4) ni 89 dB (sumar 4).',
        ],
        comprueba:
          'Pon el nivel en 85 dB y mira «Veces sobre el umbral»: 3,2·10⁸. Ahora súbelo a 91 dB: marca 1,3·10⁹, exactamente 4 veces más. La barra de la escala apenas se ha movido, y ahí está toda la idea de los decibelios.',
      },
      retos: [
        {
          pregunta: '¿Cuántos dB tienes que subir para que la intensidad se multiplique por 1000?',
          pista: 'Cada ×10 son 10 dB. Y 1000 = 10³.',
        },
        {
          pregunta: 'Mueve la frecuencia por todo el rango y observa dónde resuena la cóclea.',
          pista: 'El punto de máxima vibración se desplaza. Compara 200 Hz con 8000 Hz.',
        },
        {
          pregunta: 'Simula una presbiacusia y comprueba qué parte del habla se pierde primero.',
          pista: 'Activa el modo de pérdida auditiva y mira qué zona de la banda del habla queda apagada.',
        },
      ],
      chequeo: {
        pregunta:
          'Una máquina produce 70 dB. Se encienden 10 máquinas idénticas a la vez. El nivel resultante es aproximadamente:',
        opciones: ['700 dB', '140 dB', '80 dB', '73 dB'],
        correcta: 2,
        explicacion:
          'Las intensidades se suman, no los decibelios. 10 máquinas dan 10·I, y 10·log₁₀(10) = 10 dB adicionales: 70 + 10 = 80 dB. El error clásico es multiplicar los decibelios (700) o duplicarlos (140), y viene de olvidar que la escala es logarítmica.',
      },
    },
  ],

  cierre: [
    {
      titulo: 'El periodo ignora la amplitud',
      texto:
        'Tanto en el resorte (T = 2π√(m/k)) como en el péndulo (T = 2π√(L/g)) la amplitud no aparece. Lo que sí depende de ella es la energía, que va con A².',
    },
    {
      titulo: 'Cada oscilador ignora una cosa distinta',
      texto:
        'El resorte no sabe nada de la gravedad; el péndulo no sabe nada de la masa. Si te preguntan por uno, comprueba primero cuál de las dos variables debe cancelarse.',
    },
    {
      titulo: 'El péndulo sólo es armónico si el ángulo es pequeño',
      texto:
        'La fórmula del periodo nace de aproximar sen θ ≈ θ. Por encima de unos 15° el periodo real empieza a ser mayor que el predicho.',
    },
    {
      titulo: 'En v = λf, la velocidad la pone el medio y la frecuencia la fuente',
      texto:
        'Al cambiar de medio se conserva f, cambia v, y λ se acomoda. Es la clave de todos los problemas de ultrasonido.',
    },
    {
      titulo: 'Transversal vs longitudinal es una pregunta sobre la dirección de vibración',
      texto:
        'No sobre la forma del dibujo. El sonido es longitudinal aunque se grafique como una sinusoide.',
    },
    {
      titulo: 'Los decibelios son logarítmicos',
      texto:
        '×2 en intensidad son +3 dB; ×10 son +10 dB. Nunca se suman decibelios directamente.',
    },
    {
      titulo: 'El oído codifica la frecuencia por posición',
      texto:
        'La tonotopía de la membrana basilar (agudos en la base, graves en el ápex) explica la presbiacusia y la programación de los implantes cocleares.',
    },
  ],
};
