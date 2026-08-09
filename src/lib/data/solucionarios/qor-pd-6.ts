import type { Solucionario } from './types';

/**
 * PD06 — Reacciones orgánicas. Alquenos y alquinos.
 * El enunciado (con los esquemas de reacción, las tres reacciones numeradas de
 * las preguntas 4-6 y las alternativas) es el PDF: `qor-pd-6`.
 */
export const qorPd6: Solucionario = {
  id: 'qor-pd-6',
  pdfId: 'qor-pd-6',
  titulo: 'PD06 — Reacciones orgánicas. Alquenos y alquinos',
  subtitulo: 'Solucionario paso a paso',
  pasos: [
    {
      n: 1,
      titulo: 'Identificar el tipo de reacción',
      enunciado: 'Indicar de qué tipo de reacción se trata en cada caso.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'Casi todo se decide mirando el sustrato: si hay un enlace π (alqueno o alquino) lo que ocurre es una adición; si hay un carbono unido a un buen grupo saliente, sustitución o eliminación; y si el enlace π pertenece a un anillo aromático, sustitución en vez de adición, porque el anillo no renuncia a su aromaticidad.',
        },
        {
          tipo: 'datos',
          titulo: 'Reacción por reacción',
          items: [
            {
              etiqueta: 'a)',
              valor: 'Adición electrofílica — halogenación',
              detalle:
                '4-metil-2-penteno + Br₂/CCl₄. El Br₂ se polariza al acercarse a la nube π, se forma un ion bromonio cíclico y el Br⁻ ataca por la cara opuesta: la adición es anti',
            },
            {
              etiqueta: 'b)',
              valor: 'Sustitución nucleofílica — SN1',
              detalle:
                'cloruro de terc-butilo + NaOH. Al ser el carbono terciario, primero se rompe el C–Cl formando un carbocatión terciario estable y después el ⁻OH lo captura',
            },
            {
              etiqueta: 'c)',
              valor: 'Adición electrofílica — Markovnikov',
              detalle:
                '2-metil-2-buteno + HBr. El H⁺ entra al carbono con más hidrógenos, dejando el carbocatión terciario en el otro; el Br⁻ lo captura ahí',
            },
            {
              etiqueta: 'd)',
              valor: 'Sustitución electrofílica aromática (SEAr)',
              detalle:
                'benceno + Br₂/Fe. El Fe, ácido de Lewis, polariza el Br₂ y genera el electrófilo; tras el ataque al anillo se pierde un H⁺ para recuperar la aromaticidad',
            },
            {
              etiqueta: 'e)',
              valor: 'Eliminación — E1 (deshidratación ácida)',
              detalle:
                '2-butanol + H₂SO₄/calor. El ácido protona el –OH, que es mal saliente, y lo convierte en H₂O; se forma el carbocatión y se pierde un H⁺ vecino dando el alqueno más sustituido (Zaitsev)',
            },
            {
              etiqueta: 'f)',
              valor: 'Adición electrofílica — doble hidrohalogenación',
              detalle:
                'propino + 2 HBr. Ambas adiciones son Markovnikov y los dos bromos acaban en el mismo carbono: dihaluro geminal',
            },
          ],
        },
        {
          tipo: 'nota',
          texto:
            'El contraste entre (a) y (d) resume el capítulo: los dos son un alqueno o un anillo frente a Br₂, pero el alqueno se adiciona y el benceno sustituye. Adicionarse le costaría al benceno los 36 kcal/mol de energía de resonancia, así que prefiere expulsar un protón y quedarse aromático.',
        },
      ],
    },
    {
      n: 2,
      titulo: 'Clasificar las especies como electrófilos o nucleófilos',
      enunciado: 'Indicar cuáles de las siguientes especies son electrofílicas y cuáles nucleofílicas.',
      bloques: [
        {
          tipo: 'contraste',
          titulo: 'Quién busca electrones y quién los ofrece',
          lados: [
            {
              titulo: 'Electrófilos — buscan densidad electrónica',
              items: [
                'Br⁺ — catión, deficiente en electrones',
                'Cl⁺ — catión, deficiente en electrones',
                'H₃O⁺ — catión; actúa como fuente de H⁺',
                'NH₄⁺ — catión; el N ya gastó su par libre en el cuarto enlace',
              ],
              nota:
                'Todos comparten carga positiva o un octeto incompleto: aceptan el par que otro les ofrezca',
            },
            {
              titulo: 'Nucleófilos — ofrecen un par de electrones',
              items: [
                'HO⁻ — carga negativa y pares libres sobre el O',
                'CH₃O⁻ — carga negativa y pares libres sobre el O',
                'H₂N⁻ (amiduro) — carga negativa sobre N: nucleófilo muy fuerte',
                'H₂O — neutra, pero con dos pares libres disponibles',
                'NH₃ — par libre disponible sobre el N',
                'CH₃–NH₂ — par libre disponible sobre el N',
              ],
              nota:
                'Los aniones son mejores nucleófilos que sus análogos neutros: HO⁻ supera a H₂O y H₂N⁻ supera a NH₃',
            },
          ],
        },
        {
          tipo: 'nota',
          titulo: 'El par que separa a quien entendió del que memorizó',
          texto:
            'NH₃ y NH₄⁺ caen en lados opuestos. El amoniaco tiene un par libre y ataca; el amonio ya lo empleó en formar el cuarto enlace N–H, se quedó sin nada que donar y además lleva carga positiva. Un nucleófilo no se define por el átomo sino por si le queda un par libre disponible.',
        },
      ],
    },
    {
      n: 3,
      titulo: '¿Qué tipo de ataque sufre cada molécula?',
      enunciado:
        'Indicar si cada molécula es susceptible de ataque electrofílico o nucleofílico y en qué posición.',
      bloques: [
        {
          tipo: 'tabla',
          titulo: 'Sitio reactivo y tipo de ataque',
          encabezados: ['Molécula', 'Sitio reactivo', 'Ataque que sufre'],
          filas: [
            [
              '2-metilpropeno, H₂C=C(CH₃)₂',
              'nube π del doble enlace, rica en electrones',
              'Electrofílico',
            ],
            [
              'Acetaldehído, CH₃–CHO',
              'carbono del carbonilo, δ+ porque el O le retira densidad',
              'Nucleofílico',
            ],
            ['1-butino, CH₃CH₂–C≡CH', 'los dos enlaces π del triple enlace', 'Electrofílico'],
            [
              'Cloruro de terc-butilo, (CH₃)₃C–Cl',
              'carbono unido al Cl, δ+ por la polarización del enlace',
              'Nucleofílico',
            ],
            ['Benceno', 'la nube π aromática deslocalizada', 'Electrofílico'],
          ],
        },
        {
          tipo: 'clave',
          texto:
            'Regla práctica: lo que tiene enlaces π ricos en electrones (alquenos, alquinos, aromáticos) atrae electrófilos. Lo que tiene un carbono δ+ (carbonilos, carbono unido a halógeno) atrae nucleófilos.',
        },
      ],
    },
    {
      n: 4,
      titulo: 'Las tres reacciones: señalar la alternativa FALSA',
      enunciado:
        'Sobre las reacciones 1, 2 y 3 del esquema, marcar la proposición falsa.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Qué ocurre en cada una de las tres reacciones',
          items: [
            {
              etiqueta: 'Reacción 1',
              valor: 'Hidratación ácida con transposición → alcoholes A y B',
              detalle:
                'alqueno con un carbono cuaternario contiguo, tipo (CH₃)₃C–CH=CH₂, más H₂O/H₂SO₄. Al protonar aparece un carbocatión secundario que puede capturar agua (alcohol B, secundario, minoritario) o transponerse por desplazamiento 1,2 al carbocatión terciario, mucho más estable, que da el alcohol A (mayoritario)',
            },
            {
              etiqueta: 'Reacción 2',
              valor: 'Adición de HBr en agua → bromuro C y alcohol D',
              detalle:
                'alqueno tipo 2-metil-2-buteno más HBr con agua de disolvente. La protonación Markovnikov da directamente el carbocatión terciario, sin transposición, y en el medio hay dos nucleófilos compitiendo: el Br⁻ da el bromuro C y el H₂O da, tras perder H⁺, el alcohol D',
            },
            {
              etiqueta: 'Reacción 3',
              valor: 'Haluro terciario + NaOH → sustitución (E) o eliminación (F)',
              detalle:
                'las dos vías compiten, como es típico de un sustrato terciario frente a una especie que es a la vez nucleófilo y base fuerte: el alcohol E sale por sustitución y el alqueno F por eliminación',
            },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                'La reacción 1 no se inicia por ataque electrofílico del ion hidronio — sí se inicia así: el H₂SO₄ en medio acuoso genera H₃O⁺, que es el electrófilo que protona la nube π del alqueno',
              esRespuesta: true,
              veredicto: 'Falsa',
            },
            {
              letra: 'b',
              texto: 'La reacción 3 es de sustitución o eliminación, nunca de adición',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'c',
              texto:
                'Las tres no son del mismo tipo — en efecto: 1 y 2 son adiciones, 3 es sustitución/eliminación',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'd',
              texto: 'E se forma por sustitución nucleofílica — el ⁻OH desplaza al Br⁻',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
            {
              letra: 'e',
              texto: 'F se forma por eliminación — ahí el NaOH actúa como base, no como nucleófilo',
              esRespuesta: false,
              veredicto: 'Verdadero',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta (la FALSA): (a)' },
      ],
    },
    {
      n: 5,
      titulo: 'Las tres reacciones: señalar la alternativa VERDADERA',
      enunciado: 'Sobre las mismas tres reacciones, marcar la proposición verdadera.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'La clave está en recordar que la reacción 2 transcurre en agua. El HBr es un ácido fuerte y en medio acuoso se ioniza por completo (HBr + H₂O → H₃O⁺ + Br⁻), así que el electrófilo que realmente protona al alqueno no es el HBr molecular sino el ion hidronio — exactamente el mismo que en la reacción 1.',
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                'Las reacciones 1 y 2 son de diferente tipo — ambas son adiciones electrofílicas vía carbocatión iniciadas por H₃O⁺',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto:
                'En la reacción 2 solo pueden formarse C y D — el carbocatión también puede perder un H⁺ y dar productos de eliminación',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'c',
              texto:
                'El producto C depende del nucleófilo aportado por el disolvente — está invertido: C viene del Br⁻ del propio HBr; el que depende del disolvente es D, el alcohol',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto:
                'La reacción 2 se inicia por ataque electrofílico del ion hidronio — el HBr ionizado en agua entrega H₃O⁺, que protona el alqueno',
              esRespuesta: true,
              veredicto: 'Verdadera',
            },
            {
              letra: 'e',
              texto: 'La reacción 1 no es una adición — sí lo es: es la hidratación del alqueno',
              esRespuesta: false,
              veredicto: 'Falso',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: (d)' },
        {
          tipo: 'nota',
          texto:
            'Las alternativas (a) de esta pregunta y (a) de la anterior son la misma idea vista desde dos ángulos: quien reconoce que las dos adiciones arrancan con H₃O⁺ resuelve ambas de una sola vez.',
        },
      ],
    },
    {
      n: 6,
      titulo: 'Las tres reacciones: señalar la alternativa CORRECTA',
      enunciado: 'Sobre las mismas tres reacciones, marcar la proposición correcta.',
      bloques: [
        {
          tipo: 'contraste',
          titulo: 'Lo que de verdad distingue a la reacción 1 de la 2',
          lados: [
            {
              titulo: 'Reacción 1 — con transposición',
              items: [
                'la protonación da un carbocatión secundario',
                'desplazamiento 1,2 de hidruro o metilo',
                'se llega al carbocatión terciario',
                'el agua lo captura → alcohol A, mayoritario',
              ],
              nota:
                'El producto principal no proviene del carbocatión que se forma primero, sino del que se alcanza tras reordenarse: el más estable posible',
            },
            {
              titulo: 'Reacción 2 — sin transposición',
              items: [
                'la protonación Markovnikov da ya el carbocatión terciario',
                'no hay nada que reordenar',
                'compiten dos nucleófilos por el mismo catión',
                'Br⁻ → producto C · H₂O → producto D',
              ],
              nota:
                'Aquí la variedad de productos no viene del intermediario, que es único, sino de qué nucleófilo lo atrapa',
            },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                'En la reacción 1, el producto A se origina a partir del carbocatión más estable de los posibles — es justo el sentido de la transposición: el secundario inicial se reordena al terciario y de ahí sale A',
              esRespuesta: true,
              veredicto: 'Correcta',
            },
            {
              letra: 'b',
              texto:
                'C y D no cumplen la regla de Markovnikov — sí la cumplen: ambos provienen del mismo carbocatión terciario, el más estable para ese alqueno',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'c',
              texto:
                'D se seguiría formando sin disolvente nucleofílico — sin agua no hay de dónde sacar el OH: D desaparecería',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto:
                'El H₂SO₄ no actúa como catalizador — sí lo hace: se consume al protonar y se regenera al final, sin gastarse netamente',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'e',
              texto:
                'El agua ataca al carbocatión — cierto en cuanto al mecanismo, pero no es lo que la pregunta evalúa: describe un paso común a las dos reacciones y no captura la transposición, que es lo propio de la reacción 1',
              esRespuesta: false,
              veredicto: 'Descartada',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: (a)' },
      ],
    },
    {
      n: 7,
      titulo: 'Completar las reacciones',
      enunciado: 'Escribir el producto (o productos) de cada transformación.',
      bloques: [
        {
          tipo: 'datos',
          titulo: 'Producto de cada reacción',
          items: [
            {
              etiqueta: 'a)',
              valor: '2,3-dibromo-4-metilpentano — (CH₃)₂CH–CHBr–CHBr–CH₃',
              detalle:
                '4-metil-2-penteno + Br₂/CCl₄: adición electrofílica anti vía ion bromonio, igual que en la pregunta 1a',
            },
            {
              etiqueta: 'b)',
              valor: 'Una bromohidrina — CH₃CH₂–C(OH)(CH₃)–CHBr–CH₃',
              detalle:
                'con Br₂/H₂O el ion bromonio no lo abre el Br⁻ sino el agua, que está en gran exceso. El agua entra por el carbono más sustituido (el que soporta más carácter de carbocatión) y el Br queda en el menos sustituido, en disposición anti',
            },
            {
              etiqueta: 'c)',
              valor: '(CH₃)₂CH–CH₂–CHBr–CH(CH₃)₂',
              detalle:
                '2,5-dimetil-3-hexeno + HBr. El alqueno es simétrico —ambos carbonos del doble enlace llevan un isopropilo—, así que da igual a cuál llegue el H⁺: hay un único producto y Markovnikov no plantea ambigüedad',
            },
            {
              etiqueta: 'd)',
              valor: 'A = (CH₃)₂CH–CBr=CH–CH₃ · B = (CH₃)₂CH–CBr₂–CH₂–CH₃',
              detalle:
                '4-metil-2-pentino con dos equivalentes de HBr. La 1.ª adición sigue Markovnikov y deja el Br junto al isopropilo; en la 2.ª el H⁺ entra al carbono sin bromo, porque el catión vecino al Br se estabiliza por resonancia — los dos bromos acaban en el mismo carbono',
            },
            {
              etiqueta: 'e)',
              valor: '2-metil-2-pentanol (mayoritario) + el alcohol secundario (minoritario)',
              detalle:
                'hidratación ácida del 4-metil-2-penteno. El carbocatión secundario inicial puede capturar agua directamente o desplazar un hidruro desde el carbono ramificado vecino y pasar a terciario; esta segunda vía domina y da el alcohol terciario',
            },
            {
              etiqueta: 'f)',
              valor: 'A = diol vecinal · B = acetona · C = ácido acético',
              detalle:
                '2-metil-2-buteno con KMnO₄. En frío y diluido hay dihidroxilación syn hasta A = (CH₃)₂C(OH)–CH(OH)–CH₃; en condiciones fuertes se rompe el C–C: el carbono con dos alquilos da la cetona (acetona) y el que tiene un H pasa por aldehído y termina oxidado a ácido acético',
            },
            {
              etiqueta: 'g)',
              valor: '2-metilpentano',
              detalle:
                '4-metil-2-penteno + H₂ con catalizador de Pt, Pd o Ni: hidrogenación catalítica, adición syn sobre la cara adsorbida al metal',
            },
          ],
        },
        {
          tipo: 'nota',
          titulo: 'Las tres reglas que ejercita esta pregunta',
          texto:
            'Primera, el disolvente puede ser el nucleófilo: cambiar CCl₄ por agua convierte una dibromación (a) en una bromohidrina (b). Segunda, en los alquinos la segunda adición de HX coloca el halógeno sobre el carbono que ya lo tiene —dihaluro geminal—, porque el bromo estabiliza por resonancia al catión vecino. Y tercera, siempre que un carbocatión secundario tenga un carbono ramificado al lado, hay que comprobar si un desplazamiento 1,2 lo lleva a terciario antes de escribir el producto.',
        },
      ],
    },
    {
      n: 8,
      titulo: 'Identificar el compuesto A de fórmula C₅H₁₀',
      enunciado:
        'A (C₅H₁₀), al tratarse con KMnO₄, da como productos una cetona y un aldehído que se oxida a ácido. Identificar A.',
      bloques: [
        {
          tipo: 'parrafo',
          texto:
            'C₅H₁₀ tiene un grado de insaturación, así que en el contexto del capítulo A es un alqueno. La pista está en los productos: si la ruptura oxidativa da una cetona por un lado y un ácido por el otro, el doble enlace tiene que ser asimétrico, con cada carbono sustituido de manera distinta.',
        },
        {
          tipo: 'datos',
          titulo: 'Qué produce cada tipo de carbono al romperse el doble enlace',
          items: [
            {
              etiqueta: '=CR₂',
              valor: 'Cetona',
              detalle: 'dos sustituyentes alquilo y ningún H que oxidar: la oxidación se detiene ahí',
            },
            {
              etiqueta: '=CHR',
              valor: 'Ácido carboxílico',
              detalle: 'un alquilo y un H: pasa por aldehído, que el KMnO₄ en exceso sigue oxidando',
            },
            {
              etiqueta: '=CH₂',
              valor: 'CO₂',
              detalle: 'dos H: se sobreoxida por completo y se pierde como gas, no queda producto aislable',
            },
          ],
        },
        {
          tipo: 'opciones',
          items: [
            {
              letra: 'a',
              texto:
                '2-metil-1-buteno, CH₂=C(CH₃)–CH₂–CH₃ — el carbono =CH₂ terminal se sobreoxida a CO₂, así que no aparecería el aldehído que menciona el enunciado',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'b',
              texto:
                '2-metil-2-buteno, (CH₃)₂C=CH–CH₃ — el carbono (CH₃)₂C= da acetona y el =CH–CH₃ da acetaldehído, que se oxida a ácido acético: encaja exactamente con el enunciado',
              esRespuesta: true,
              veredicto: 'Correcta',
            },
            {
              letra: 'c',
              texto: '2-metilpropeno — su fórmula es C₄H₈, no C₅H₁₀',
              esRespuesta: false,
              veredicto: 'Falso',
            },
            {
              letra: 'd',
              texto:
                '3-metil-2-buteno — el nombre no es válido en IUPAC: los localizadores mínimos para ese esqueleto dan 2-metil-2-buteno, que es la opción (b)',
              esRespuesta: false,
              veredicto: 'Descartada',
            },
            {
              letra: 'e',
              texto:
                '2-penteno, CH₃–CH=CH–CH₂CH₃ — ambos carbonos del doble enlace llevan un H, así que darían dos ácidos y ninguna cetona',
              esRespuesta: false,
              veredicto: 'Falso',
            },
          ],
        },
        { tipo: 'clave', texto: 'Respuesta: (b) — el compuesto A es el 2-metil-2-buteno' },
        {
          tipo: 'nota',
          texto:
            'La ruptura oxidativa funciona como una prueba diagnóstica que se lee al revés: los productos revelan cómo estaba sustituido cada carbono del doble enlace original. Una cetona señala un carbono sin hidrógenos, un ácido señala uno con un H, y la ausencia de producto (CO₂) delata un extremo =CH₂.',
        },
      ],
    },
  ],
};
