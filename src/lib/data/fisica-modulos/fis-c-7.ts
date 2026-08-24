import type { ModuloTeoria } from './types';

/**
 * C7 — Temperatura y calor. Propiedades térmicas de la materia.
 *
 * Las 4 secciones cubren los 3 subtemas que la clase declara en el sílabo
 * (`src/lib/data/fisica.ts`): escalas y dilatación → calor específico y cambios
 * de fase (partido en dos, porque el calor latente es donde está la trampa de
 * examen y merece sección propia) → conducción, convección y radiación.
 *
 * A diferencia de C6, las cuatro comparten UNA simulación (`termico`): en
 * termorregulación no son fenómenos separados sino sumandos de la misma
 * ecuación de balance, y partirla escondería justamente eso.
 */
export const moduloC7: ModuloTeoria = {
  claseId: 'fis-c-7',
  codigo: 'C7',
  titulo: 'Temperatura y calor',
  gancho:
    'Tu cuerpo lleva toda la vida a 37 °C mientras fuera hace 5 o 35. No es magia: es un balance de potencias que puedes calcular.',
  duracion: 28,

  secciones: [
    // ─── 1 ─────────────────────────────────────────────────────────────────
    {
      id: 'escalas',
      titulo: 'Temperatura y escalas',
      subtitulo: 'Qué mide de verdad un termómetro',
      acento: '#5E9CD3',
      icono: 'termometro',
      objetivo:
        'Separar temperatura de calor, y moverte entre °C, °F y K sin dudar — incluida la lectura clínica de cada cifra.',
      logica: [
        {
          tipo: 'idea',
          titulo: 'Temperatura no es calor',
          texto:
            'La temperatura mide la energía cinética MEDIA de las partículas: cómo de rápido se agitan, en promedio. El calor es energía en tránsito, la que pasa de un cuerpo a otro porque están a distinta temperatura. Una chispa a 1000 °C no te quema porque tiene poquísima masa: mucha temperatura, casi nada de calor.',
        },
        {
          tipo: 'contraste',
          titulo: 'Dos palabras que en la calle son la misma',
          a: {
            titulo: 'TEMPERATURA',
            items: [
              'Es un estado del cuerpo, lo tiene ahora mismo',
              'Se mide en °C, °F o K',
              'No depende de cuánta materia haya',
              'Un termómetro la lee directamente',
            ],
          },
          b: {
            titulo: 'CALOR',
            items: [
              'Es energía EN TRÁNSITO, sólo existe mientras fluye',
              'Se mide en J o cal, como cualquier energía',
              'Depende de la masa: 1 g y 1 kg a 90 °C no queman igual',
              'No se mide, se calcula por lo que le pasa al cuerpo',
            ],
          },
        },
        {
          tipo: 'formula',
          expresion: 'T_F = 9/5 · T_C + 32',
          lectura:
            '«Efe es nueve quintos de ce más treinta y dos». El 9/5 es que un grado Fahrenheit es más pequeño, y el +32 es que sus ceros no coinciden. Por eso NO se puede convertir multiplicando a secas: hay que estirar y además desplazar.',
          partes: [
            { simbolo: 'T_F', significado: 'Temperatura en la escala Fahrenheit', unidad: '°F' },
            { simbolo: 'T_C', significado: 'La misma temperatura en Celsius', unidad: '°C' },
            { simbolo: '9/5', significado: 'Cuántos °F ocupa un °C (el grado F es menor)' },
            { simbolo: '32', significado: 'Dónde cae el 0 °C en la escala Fahrenheit', unidad: '°F' },
          ],
          viva: {
            calculo: 'escala-fahrenheit',
            viz: 'escala-mini',
            variables: [
              { id: 'tc', simbolo: 'T', unidad: '°C', min: 30, max: 43, paso: 0.1, inicial: 37, decimales: 1 },
            ],
            resultado: { simbolo: 'T_F', unidad: '°F', decimales: 1, min: 86, max: 109.4 },
            sustituida: 'T_F = 9/5 × {tc} °C + 32 = {=} °F',
            observa:
              'Busca 37 °C: salen los 98,6 °F que verás en cualquier artículo americano. Ahora sube a 40 — la banda pasa a hipertermia, y ahí el problema ya no es la infección sino que las proteínas empiezan a desnaturalizarse. Y baja a 35: por debajo de ahí es hipotermia aunque el paciente parezca estable.',
          },
        },
        {
          tipo: 'pasos',
          titulo: 'Y el Kelvin, en dos líneas',
          pasos: [
            'K = °C + 273,15. Sólo se desplaza, no se estira: un salto de 1 °C es un salto de 1 K exacto.',
            'Por eso los INCREMENTOS son iguales en las dos: ΔT = 5 °C es ΔT = 5 K, y en cualquier fórmula con ΔT da igual cuál uses.',
            'Donde NO da igual es cuando la temperatura entra sola, sin restar: la ley de radiación va con T⁴ y ahí hay que meter kelvin o el resultado no se parece en nada.',
          ],
        },
        {
          tipo: 'trampa',
          titulo: 'Lo que más se falla en el examen',
          texto:
            'Convertir un INCREMENTO con la fórmula completa. Si un paciente sube 2 °C, eso son 3,6 °F de subida (2 × 9/5), NO 35,6 °F. El +32 sólo sirve para convertir una temperatura, nunca una diferencia — la diferencia ya no arrastra el desfase de los ceros.',
        },
        {
          tipo: 'clinico',
          titulo: 'Dónde te lo vas a encontrar',
          texto:
            'La fiebre es el termostato subido a propósito: el hipotálamo mueve el punto de consigna y el cuerpo trabaja para alcanzarlo — por eso tiritas mientras SUBES de temperatura. La hipertermia es lo contrario: el termostato sigue en 37 pero el cuerpo no logra disipar, y por eso los antipiréticos no la bajan y el enfriamiento físico sí. Distinguirlas cambia el tratamiento entero.',
        },
      ],
      sim: 'termico',
      problema: {
        enunciado:
          'Un artículo americano describe un paciente que ingresa con 103,1 °F y comenta que subió 2,7 °F respecto a su basal.',
        datos: [
          { label: 'T ingreso', valor: '103,1 °F' },
          { label: 'Subida', valor: '2,7 °F' },
        ],
        preset: { ambiente: 22, aislamiento: 60, sudor: 0, metabolismo: 100 },
        pregunta: '¿Cuál es su temperatura de ingreso en °C?',
        respuesta: { valor: 39.5, unidad: '°C', tolerancia: 0.02 },
        pasos: [
          'La fórmula va al revés: de T_F = 9/5·T_C + 32 se despeja T_C = (T_F − 32) · 5/9.',
          'Sustituye: T_C = (103,1 − 32) · 5/9 = 71,1 · 5/9 = 39,5 °C.',
          'Ojo con el segundo dato: la SUBIDA de 2,7 °F no se convierte con la misma fórmula. Es un incremento, así que ΔT_C = 2,7 · 5/9 = 1,5 °C. Si le hubieras restado 32 habrías obtenido −16 °C de subida, que es absurdo.',
          'Lectura clínica: 39,5 °C es fiebre alta, todavía por debajo del umbral de hipertermia (40 °C).',
        ],
        comprueba:
          'Lleva la barra de la fórmula viva a 39,5 y comprueba que marca 103,1 °F y cae en la banda naranja de fiebre. Después bájala a 1,5 y verás que NO da 2,7 — porque una temperatura y un incremento no se convierten igual.',
      },
      retos: [
        {
          pregunta: '¿A qué temperatura marcan lo mismo las escalas Celsius y Fahrenheit?',
          pista: 'Iguala T_C = 9/5·T_C + 32 y despeja. Sale un número negativo y redondo.',
        },
        {
          pregunta: 'En la simulación, sube el ambiente de 22 a 35 °C sin tocar nada más. ¿Qué le pasa a la pérdida seca?',
          pista: 'La pérdida seca va con ΔT. Si el ambiente se acerca a 37, ¿cuánto ΔT queda?',
        },
        {
          pregunta: 'Con ambiente a 37 °C exactos, ¿por qué vía puede el cuerpo seguir perdiendo calor?',
          pista: 'Mira cuál de las tres flechas sigue teniendo grosor cuando las otras se apagan.',
        },
      ],
      chequeo: {
        pregunta:
          'Una chispa de soldadura a 1200 °C te cae en el brazo y apenas la notas; agua a 60 °C te produce una quemadura seria. ¿Por qué?',
        opciones: [
          'El metal de la chispa conduce el calor mucho peor que el agua a esa misma temperatura',
          'La chispa se enfría al cruzar el aire y llega a la piel muy por debajo de 1200 °C',
          'La chispa está mucho más caliente, pero su masa es tan pequeña que apenas cede energía',
          'La piel refleja la radiación del metal incandescente pero absorbe por completo la del agua',
        ],
        correcta: 2,
        explicacion:
          'Es la diferencia entre temperatura y calor. La chispa tiene temperatura altísima pero una masa de miligramos, así que la energía que puede cederte (Q = m·c·ΔT) es ridícula. El agua a 60 °C tiene menos temperatura y muchísima más masa, y además un calor específico alto: cede energía suficiente para desnaturalizar proteínas de la piel.',
      },
    },

    // ─── 2 ─────────────────────────────────────────────────────────────────
    {
      id: 'especifico',
      titulo: 'Calor específico',
      subtitulo: 'Por qué cuesta tanto moverte la temperatura',
      acento: '#F5A623',
      icono: 'llama',
      objetivo:
        'Calcular cuánta energía hay detrás de un cambio de temperatura, y entender por qué el cuerpo humano es térmicamente tan estable.',
      logica: [
        {
          tipo: 'idea',
          titulo: 'El calor específico es una resistencia a cambiar',
          texto:
            'El calor específico c es cuánta energía hay que meterle a un kilo de algo para subirlo un grado. Cuanto mayor es c, más se resiste ese material a cambiar de temperatura. El agua lo tiene altísimo (4186 J/kg·°C) comparado con casi todo, y como somos ~60 % agua, heredamos esa inercia térmica.',
        },
        {
          tipo: 'formula',
          expresion: 'Q = m · c · ΔT',
          lectura:
            '«Cu es masa por ce por delta te». Los tres factores multiplican: el doble de masa, el doble de energía; el doble de salto térmico, el doble de energía. Es la fórmula del calor SENSIBLE — el que sí se nota en el termómetro.',
          partes: [
            { simbolo: 'Q', significado: 'Calor que hay que aportar (o retirar)', unidad: 'J' },
            { simbolo: 'm', significado: 'Masa del cuerpo que cambia de temperatura', unidad: 'kg' },
            { simbolo: 'c', significado: 'Calor específico: cuánto se resiste el material', unidad: 'J/(kg·°C)' },
            { simbolo: 'ΔT', significado: 'Cuánto sube o baja la temperatura', unidad: '°C' },
          ],
          viva: {
            calculo: 'calor-sensible',
            viz: 'calor-mini',
            variables: [
              { id: 'm',  simbolo: 'm',  unidad: 'kg', min: 40,  max: 120, paso: 1,   inicial: 70, decimales: 0 },
              { id: 'dt', simbolo: 'ΔT', unidad: '°C', min: 0.5, max: 5,   paso: 0.1, inicial: 1,  decimales: 1 },
            ],
            resultado: { simbolo: 'Q', unidad: 'kJ', decimales: 0, min: 0, max: 1800 },
            sustituida: 'Q = {m} kg × 3470 J/(kg·°C) × {dt} °C = {=} kJ',
            observa:
              'Con 70 kg, subir UN grado pide 243 kJ — unos 40 minutos de todo tu metabolismo basal dedicados sólo a eso. Por eso la fiebre tarda en instalarse y tiritar cuesta tanto. Ahora mueve la masa: un lactante de 6 kg necesitaría la décima parte, y ése es exactamente el motivo de que se descompense térmicamente en minutos.',
          },
        },
        {
          tipo: 'analogia',
          titulo: 'Para no olvidar qué significa un c alto',
          texto:
            'Piensa en la arena y el agua de una playa al mediodía. El mismo sol lleva horas cayendo sobre las dos, pero la arena quema y el agua está fresca. No es que el agua reciba menos energía: es que su calor específico es cinco veces mayor, así que la misma energía le mueve la temperatura cinco veces menos.',
        },
        {
          tipo: 'clinico',
          titulo: 'Dónde te lo vas a encontrar',
          texto:
            'La hipotermia terapéutica tras una parada cardiaca busca bajar al paciente a 33 °C. Con 70 kg y ΔT de 4 °C hay que retirarle casi 1000 kJ, y por eso no basta con una manta fría: se usan catéteres endovasculares o mantas de circulación de agua. La misma inercia que te protege de la fiebre juega en contra cuando quieres enfriar deprisa.',
        },
        {
          tipo: 'trampa',
          titulo: 'Lo que más se falla en el examen',
          texto:
            'Meter el calor específico del agua (4186) cuando el enunciado habla del cuerpo humano. El cuerpo no es agua pura: hueso, grasa y músculo bajan la media a ≈3470 J/(kg·°C). Usar 4186 infla el resultado un 20 %. Y al revés: si el problema habla de una bolsa de suero, ahí sí va el del agua.',
        },
      ],
      sim: 'termico',
      problema: {
        enunciado:
          'Un paciente de 80 kg entra en fiebre y su temperatura pasa de 36,8 °C a 39,3 °C. El calor específico medio del cuerpo es 3470 J/(kg·°C).',
        datos: [
          { label: 'm', valor: '80 kg' },
          { label: 'ΔT', valor: '39,3 − 36,8 °C' },
          { label: 'c', valor: '3470 J/(kg·°C)' },
        ],
        preset: { ambiente: 22, aislamiento: 60, sudor: 0, metabolismo: 130 },
        pregunta: '¿Cuánta energía ha tenido que acumular, en kJ?',
        respuesta: { valor: 694, unidad: 'kJ', tolerancia: 0.03 },
        pasos: [
          'Primero el salto: ΔT = 39,3 − 36,8 = 2,5 °C. Es una diferencia, así que vale igual en °C que en K.',
          'Aplica Q = m·c·ΔT = 80 × 3470 × 2,5 = 694 000 J.',
          'Pasa a kilojulios: 694 000 J = 694 kJ (unas 166 kcal).',
          'Contexto: son casi dos horas de metabolismo basal íntegro. De ahí que la fiebre consuma tanto y el paciente febril esté agotado.',
        ],
        comprueba:
          'En la simulación sube el metabolismo a 130 W, que es lo que hace la fiebre: el balance se pone en positivo y la deriva de temperatura se vuelve una cifra con signo +. Ese acumular es exactamente el Q que acabas de calcular.',
      },
      retos: [
        {
          pregunta: 'Con el mismo ambiente, ¿cuánto metabolismo hace falta para que el balance se ponga a cero?',
          pista: 'Mueve el metabolismo hasta que la lectura de balance quede entre −12 y +12 W.',
        },
        {
          pregunta: 'Baja la masa mentalmente a la de un lactante. ¿Por qué se enfrían tan rápido?',
          pista: 'La deriva es balance dividido por m·c. Si m baja diez veces y el balance no, ¿qué pasa?',
        },
        {
          pregunta: 'Un paciente tirita: eso multiplica su producción de calor por 4. Simúlalo y mira el balance.',
          pista: 'Tiritar es metabolismo puro: llévalo de 100 a 400 W sin tocar nada más.',
        },
      ],
      chequeo: {
        pregunta:
          '¿Por qué un recién nacido se enfría mucho más rápido que un adulto en la misma habitación?',
        opciones: [
          'Su calor específico es bastante menor que el del adulto por su distinta composición corporal',
          'Tiene poca masa y mucha superficie relativa: pierde deprisa y su reserva térmica es mínima',
          'Su temperatura basal es más baja y por eso arranca ya muy cerca del umbral de hipotermia',
          'Su metabolismo por kilo es menor y genera bastante menos calor del que necesita mantener',
        ],
        correcta: 1,
        explicacion:
          'Son dos cosas a la vez. Por un lado pierde mucho: su relación superficie/masa es enorme, así que por cada kilo tiene mucha más piel por la que escapar. Por otro, su reserva térmica es diminuta: en Q = m·c·ΔT, con m diez veces menor hace falta diez veces menos energía para moverle un grado. El calor específico es prácticamente el mismo que el del adulto.',
      },
    },

    // ─── 3 ─────────────────────────────────────────────────────────────────
    {
      id: 'fase',
      titulo: 'Cambios de fase',
      subtitulo: 'El calor que no sube la temperatura',
      acento: '#2DC99A',
      icono: 'gota',
      objetivo:
        'Reconocer cuándo el calor va a cambiar de estado en vez de a cambiar la temperatura, y calcular la sudoración necesaria para disipar una carga térmica.',
      logica: [
        {
          tipo: 'idea',
          titulo: 'Durante el cambio de fase, el termómetro se para',
          texto:
            'Mientras un material cambia de estado, todo el calor que entra se gasta en romper los enlaces que mantenían la fase anterior — no en agitar más las moléculas. Por eso la temperatura se queda clavada aunque sigas aportando energía. Ese calor se llama LATENTE, que significa escondido: está ahí, pero el termómetro no lo ve.',
        },
        {
          tipo: 'formula',
          expresion: 'Q = m · L',
          lectura:
            '«Cu es masa por ele». Fíjate en lo que NO aparece: no hay ΔT, porque durante el cambio de fase no hay ΔT. Sólo importa cuánta materia cambia de estado.',
          partes: [
            { simbolo: 'Q', significado: 'Calor absorbido (o liberado) en el cambio', unidad: 'J' },
            { simbolo: 'm', significado: 'Masa que cambia de fase', unidad: 'kg' },
            { simbolo: 'L', significado: 'Calor latente: energía por kilo del cambio', unidad: 'J/kg' },
          ],
          viva: {
            calculo: 'calor-latente',
            viz: 'fase-mini',
            variables: [
              { id: 'magua', simbolo: 'm', unidad: 'kg', min: 0.05, max: 1.5, paso: 0.01, inicial: 0.5, decimales: 2 },
            ],
            resultado: { simbolo: 'Q', unidad: 'kJ', decimales: 0, min: 0, max: 3650 },
            sustituida: 'Q = {magua} kg × 2430 kJ/kg = {=} kJ',
            observa:
              'Medio litro de sudor evaporado se lleva 1215 kJ. Compáralo con la sección anterior: subir 70 kg de cuerpo un grado costaba 243 kJ, cinco veces menos. Ahí está la potencia de la evaporación como refrigerante, y por qué media hora de ejercicio intenso te deja medio litro más ligero.',
          },
        },
        {
          tipo: 'contraste',
          titulo: 'Los dos calores, y cómo saber cuál toca',
          a: {
            titulo: 'SENSIBLE  ·  Q = m·c·ΔT',
            items: [
              'La temperatura SÍ cambia',
              'Hay un ΔT en el enunciado',
              'El material sigue en el mismo estado',
              'Ejemplo: calentar el suero de 20 a 37 °C',
            ],
          },
          b: {
            titulo: 'LATENTE  ·  Q = m·L',
            items: [
              'La temperatura NO cambia',
              'No hay ΔT: hay un cambio de estado',
              'Sólido→líquido→gas (o al revés)',
              'Ejemplo: evaporar el sudor de la piel',
            ],
          },
        },
        {
          tipo: 'trampa',
          titulo: 'Lo que más se falla en el examen',
          texto:
            'Usar el calor latente de vaporización del agua hirviendo (2260 kJ/kg) para el sudor. El sudor no se evapora a 100 °C sino a la temperatura de la piel, ~33 °C, y ahí L vale ≈2430 kJ/kg — más alto, no más bajo, porque cuesta más arrancar una molécula cuando el líquido está frío. Coger 2260 no es un error enorme, pero es el que delata que se copió la constante de la tabla equivocada.',
        },
        {
          tipo: 'clinico',
          titulo: 'Dónde te lo vas a encontrar',
          texto:
            'Un gran quemado pierde la barrera epidérmica y con ella el control de la evaporación: puede evaporar varios litros al día sin sudar, y cada litro se lleva 2430 kJ. Eso explica a la vez la hipotermia paradójica del quemado —aunque la lesión sea por calor— y por qué su reposición de líquidos se calcula en litros, no en vasos.',
        },
      ],
      sim: 'termico',
      problema: {
        enunciado:
          'Un corredor produce 700 W durante 40 minutos. El ambiente está a 33 °C, así que la pérdida seca es casi nula y prácticamente todo el calor debe irse evaporando sudor (L = 2430 kJ/kg).',
        datos: [
          { label: 'P', valor: '700 W' },
          { label: 't', valor: '40 min' },
          { label: 'L', valor: '2430 kJ/kg' },
        ],
        preset: { ambiente: 33, aislamiento: 15, sudor: 0.7, metabolismo: 700 },
        pregunta: '¿Cuántos litros de sudor tiene que evaporar?',
        respuesta: { valor: 0.69, unidad: 'L', tolerancia: 0.05 },
        pasos: [
          'Primero la energía total: 700 W durante 40 min = 700 × 2400 s = 1 680 000 J = 1680 kJ.',
          'Ahora despeja la masa de Q = m·L: m = Q / L = 1680 / 2430 = 0,69 kg.',
          'Como el sudor es esencialmente agua, 0,69 kg ≈ 0,69 litros.',
          'Contraste útil: ese mismo calor, si NO se evaporara nada, subiría a un cuerpo de 70 kg unos 6,9 °C — letal. La evaporación no es un lujo, es lo que le mantiene vivo.',
        ],
        comprueba:
          'La simulación está montada con esos 700 W y 33 °C de ambiente. Mira que la pérdida seca casi ha desaparecido y que la flecha de evaporación es la única gruesa. Ahora baja la sudoración a cero y observa la deriva de temperatura dispararse.',
      },
      retos: [
        {
          pregunta: 'Con el ambiente a 33 °C, ¿cuánta sudoración hace falta para que el balance quede a cero?',
          pista: 'Sube la sudoración poco a poco y vigila la lectura de balance, no la de evaporación.',
        },
        {
          pregunta: 'Un día húmedo impide evaporar. Simúlalo dejando el sudor a 0 con 33 °C y 500 W. ¿Cuánto sube por hora?',
          pista: 'La lectura de deriva ya está en °C/h. Compárala con los 3 °C que separan fiebre de golpe de calor.',
        },
        {
          pregunta: '¿Por qué un ventilador ayuda aunque el aire que mueve esté a la misma temperatura que tú?',
          pista: 'Piensa en qué vía de pérdida NO depende del ΔT entre tu piel y el aire.',
        },
      ],
      chequeo: {
        pregunta:
          '¿Por qué una quemadura por vapor de agua a 100 °C es peor que una por agua líquida a 100 °C?',
        opciones: [
          'El vapor penetra en los tejidos profundos mientras el agua líquida se queda en superficie',
          'El calor específico del vapor de agua es muy superior al del agua en estado líquido',
          'El vapor alcanza en realidad bastante más de 100 °C en el momento de tocar la piel',
          'Al condensarse sobre la piel el vapor libera además su calor latente, 2260 kJ/kg extra',
        ],
        correcta: 3,
        explicacion:
          'Las dos están a 100 °C, así que el calor sensible que ceden al enfriarse hasta la temperatura de la piel es el mismo. La diferencia es que el vapor, antes de poder enfriarse, tiene que CONDENSAR, y al hacerlo suelta su calor latente: 2260 kJ por kilo de golpe. Es varias veces la energía del enfriamiento posterior, y por eso la lesión es mucho más profunda.',
      },
    },

    // ─── 4 ─────────────────────────────────────────────────────────────────
    {
      id: 'transferencia',
      titulo: 'Conducción, convección y radiación',
      subtitulo: 'Las tres vías por las que se te escapa el calor',
      acento: '#E85B4A',
      icono: 'flujoCalor',
      objetivo:
        'Saber por qué vía se pierde el calor en cada situación clínica, y calcular la conducción a través de una capa aislante.',
      logica: [
        {
          tipo: 'idea',
          titulo: 'Tres vías, y sólo una necesita contacto',
          texto:
            'La CONDUCCIÓN pasa calor de molécula a molécula sin que nada se desplace: necesita contacto directo. La CONVECCIÓN se lo lleva moviendo el propio fluido: el aire calentado junto a tu piel sube y lo sustituye otro frío. La RADIACIÓN va en ondas electromagnéticas y no necesita medio ninguno — funciona igual en el vacío, y es la que te calienta frente a una estufa sin tocarla.',
        },
        {
          tipo: 'formula',
          expresion: 'H = k · A · ΔT / L',
          lectura:
            '«Hache es ka por a por delta te partido por ele». Es una potencia, no una energía: julios por segundo. Lo que manda es la fracción ΔT/L, el gradiente — no basta con que haya diferencia de temperatura, importa en cuánto espesor se reparte.',
          partes: [
            { simbolo: 'H', significado: 'Potencia que atraviesa la capa', unidad: 'W' },
            { simbolo: 'k', significado: 'Conductividad del material: grasa ≈ 0,20', unidad: 'W/(m·°C)' },
            { simbolo: 'A', significado: 'Superficie por la que pasa: ≈1,8 m² en un adulto', unidad: 'm²' },
            { simbolo: 'ΔT', significado: 'Diferencia de temperatura entre las dos caras', unidad: '°C' },
            { simbolo: 'L', significado: 'Espesor de la capa aislante', unidad: 'm' },
          ],
          viva: {
            calculo: 'conduccion',
            viz: 'conduccion-mini',
            variables: [
              { id: 'dt', simbolo: 'ΔT', unidad: '°C', min: 2, max: 35, paso: 1, inicial: 15, decimales: 0 },
              { id: 'l',  simbolo: 'L',  unidad: 'mm', min: 3, max: 40, paso: 1, inicial: 10, decimales: 0 },
            ],
            resultado: { simbolo: 'H', unidad: 'W', decimales: 0, min: 0, max: 1200 },
            sustituida: 'H = 0,20 × 1,8 m² × {dt} °C ÷ {l} mm = {=} W',
            observa:
              'Fíjate en que el espesor está DIVIDIENDO: doblar la grasa parte la pérdida por la mitad, mientras que doblar el ΔT sólo la duplica. Por eso una capa fina de aislante rinde tantísimo. Compara siempre el resultado con los ~100 W que produces en reposo: por encima de esa cifra estás perdiendo más de lo que fabricas.',
          },
        },
        {
          tipo: 'pasos',
          titulo: 'Qué vía domina en cada escenario',
          pasos: [
            'En reposo y vestido, al aire: gana la RADIACIÓN, con más de la mitad de la pérdida. Es la vía silenciosa y la que casi nadie nombra.',
            'Sumergido en agua fría: gana la CONDUCCIÓN, y por goleada. El agua conduce ~25 veces mejor que el aire, y por eso la hipotermia por inmersión va en minutos y no en horas.',
            'Con calor ambiental o haciendo ejercicio: gana la EVAPORACIÓN, porque las otras dos necesitan ΔT y el ΔT se ha esfumado.',
            'Recién nacido sobre una superficie fría: la CONDUCCIÓN local se dispara, y de ahí que en paritorio se seque y se envuelva de inmediato.',
          ],
        },
        {
          tipo: 'trampa',
          titulo: 'Lo que más se falla en el examen',
          texto:
            'Dar por hecho que a igual temperatura ambiente se pierde igual calor en aire que en agua. La fórmula es la misma, pero la k del agua es unas 25 veces la del aire: a 20 °C puedes estar horas al aire y entrar en hipotermia en el agua en menos de una. La temperatura del enunciado es idéntica; lo que cambia es el medio.',
        },
        {
          tipo: 'clinico',
          titulo: 'Dónde te lo vas a encontrar',
          texto:
            'Un paciente en quirófano pierde calor por las tres vías a la vez: conducción contra la mesa, convección del aire acondicionado, radiación hacia unas paredes más frías que él, y evaporación por la cavidad abierta. Además la anestesia le bloquea las respuestas de defensa (no tirita ni vasoconstriñe). Por eso la hipotermia perioperatoria es la complicación térmica más frecuente que vas a ver, y por eso se usan mantas de aire caliente.',
        },
      ],
      sim: 'termico',
      problema: {
        enunciado:
          'Una persona cae a un lago a 15 °C. Su núcleo está a 37 °C y su panículo adiposo mide 8 mm. Considera k = 0,20 W/(m·°C) y A = 1,8 m².',
        datos: [
          { label: 'ΔT', valor: '37 − 15 °C' },
          { label: 'L', valor: '8 mm' },
          { label: 'k · A', valor: '0,20 · 1,8' },
        ],
        preset: { ambiente: 15, aislamiento: 8, sudor: 0, metabolismo: 100 },
        pregunta: '¿Qué potencia pierde por conducción a través de la grasa?',
        respuesta: { valor: 990, unidad: 'W', tolerancia: 0.03 },
        pasos: [
          'Salto térmico: ΔT = 37 − 15 = 22 °C.',
          'Pasa el espesor a metros — es el paso que más se olvida: L = 8 mm = 0,008 m.',
          'Sustituye: H = 0,20 × 1,8 × 22 / 0,008 = 7,92 / 0,008 = 990 W.',
          'Compáralo con los ~100 W que produce en reposo: pierde casi diez veces lo que fabrica. De ahí que la hipotermia por inmersión se mida en minutos.',
        ],
        comprueba:
          'La simulación arranca en ese escenario. Mira la deriva de temperatura en °C/h y calcula cuánto tardaría en bajar los 2 °C que definen la hipotermia leve. Ahora sube el aislamiento a 40 mm y comprueba que el mismo ambiente deja de ser una urgencia.',
      },
      retos: [
        {
          pregunta: 'Con el ambiente a 15 °C, ¿cuánto aislamiento hace falta para que la deriva sea casi nula?',
          pista: 'Sube el aislamiento y vigila el balance. Recuerda que L divide: los primeros milímetros rinden mucho más que los últimos.',
        },
        {
          pregunta: 'Compara la deriva a 15 °C con la deriva a 5 °C, con el mismo aislamiento. ¿Se duplica?',
          pista: 'ΔT pasa de 22 a 32, o sea ×1,45. Mira si la deriva hace lo mismo o algo distinto.',
        },
        {
          pregunta: '¿Cuál de las tres vías es la mayor en reposo, a 22 °C y vestido?',
          pista: 'Mira el grosor de las tres flechas y la cifra que hay junto a cada una.',
        },
      ],
      chequeo: {
        pregunta:
          'Dos personas idénticas pasan una hora a 18 °C: una al aire y otra sumergida en agua a esa misma temperatura. ¿Qué ocurre?',
        opciones: [
          'La del agua se enfría muchísimo más rápido, porque el agua conduce unas 25 veces mejor',
          'Se enfrían prácticamente igual, ya que la diferencia de temperatura es idéntica en ambos casos',
          'La del aire se enfría más, porque la convección renueva sin parar la capa en contacto',
          'La del agua se enfría menos, porque el agua tiene un calor específico mucho más alto',
        ],
        correcta: 0,
        explicacion:
          'En H = k·A·ΔT/L, el ΔT y la superficie son iguales para las dos: lo único que cambia es k, y la del agua es unas 25 veces la del aire. Por eso la inmersión a 18 °C es una urgencia en menos de una hora mientras que estar al aire a 18 °C sólo resulta incómodo. Que el agua tenga un calor específico alto es cierto, pero eso describe cuánto le cuesta a ella calentarse, no la velocidad a la que te roba calor.',
      },
    },
  ],

  cierre: [
    {
      titulo: 'Temperatura y calor no son lo mismo',
      texto:
        'La temperatura es un estado (energía cinética media) y el calor es energía en tránsito. Una chispa tiene mucha de la primera y casi nada del segundo.',
    },
    {
      titulo: 'Los incrementos no se convierten como las temperaturas',
      texto:
        'T_F = 9/5·T_C + 32 vale para una temperatura. Para una diferencia sólo se aplica el 9/5: el +32 desaparece porque el desfase de los ceros se cancela al restar.',
    },
    {
      titulo: 'Q = m·c·ΔT mientras el termómetro se mueva',
      texto:
        'Y con c = 3470 J/(kg·°C) para el cuerpo humano, no con el 4186 del agua pura. Subirle un grado a un adulto cuesta unos 243 kJ.',
    },
    {
      titulo: 'Q = m·L cuando el termómetro se para',
      texto:
        'Durante un cambio de fase toda la energía va a romper enlaces, no a subir la temperatura. Evaporar un litro de sudor se lleva 2430 kJ: cinco veces lo que cuesta subirte un grado.',
    },
    {
      titulo: 'Tres vías secas y una húmeda',
      texto:
        'Conducción, convección y radiación necesitan ΔT; la evaporación no. Por eso cuando el ambiente llega a tu temperatura corporal, sudar es lo único que te queda.',
    },
    {
      titulo: 'En H = k·A·ΔT/L, el espesor divide',
      texto:
        'Doblar el aislante parte la pérdida por la mitad. Y cambiar aire por agua multiplica k por 25, que es toda la diferencia entre una tarde fresca y una urgencia.',
    },
  ],
};
