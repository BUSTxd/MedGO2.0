// Tablas resumen del laboratorio «Infecciones bacterianas por gramnegativas» (clase AI18):
// las tablas del resumen de la clase, más las que salen de sus listas (las cuatro formas de
// romper una unión, las cuatro especies, Sepsis-3), y el repaso de Farmacología que va
// integrado en los capítulos. Cada fila lleva al paso donde se anima (el «#» de las tablas
// de docs/gramnegativas/GUION.md; `verificar:gramnegativas` comprueba que existe).
//
// Solo en el servidor (a través de `src/lib/gramnegativas/registro.ts`): sin el plan, las
// tablas de pago no viajan. Las pestañas que se ven aunque estén cerradas están en
// `tablas-indice.ts`. `*así*` va en cursiva (nombres de género y especie).
//
// Contenido: copiado del resumen AI18 (sección en `fuente`), sin añadir datos. Lo `farmacologia`
// repite lo que dicen los pasos `[F]` del lab: no viene del AI18 y sigue sin revisar.

import type { Destino, ParteId, TablaResumen } from './tipos';

const d = (cap: ParteId, paso: number): Destino => ({ cap, paso });

export const TABLAS: Record<string, TablaResumen[]> = {
  // ─── Capítulos 0 y 1 (vistazo gratis) ────────────────────────────────────────
  conceptos: [
    {
      id: 'cinco-palabras',
      titulo: 'Cinco palabras que no son sinónimos',
      fuente: 'AI18 §1',
      columnas: ['Concepto', 'Significado y distinción'],
      destino: d('pacientes', 2),
      filas: [
        { nombre: 'Colonización', celdas: ['Presencia del microorganismo en un nicho, sin implicar por sí sola enfermedad invasiva. Puede ser un reservorio para una infección posterior.'] },
        { nombre: 'Infección localizada', celdas: ['Interacción patógena en un foco como el intestino, el pulmón, el aparato urinario, una herida o un dispositivo.'] },
        { nombre: 'Bacteriemia', celdas: ['Presencia de bacterias viables en la sangre. Puede ser transitoria, primaria (sin foco evidente) o secundaria a una infección identificable.'] },
        { nombre: 'Toxemia / endotoxemia', celdas: ['Circulación de toxinas / de endotoxina, respectivamente. El daño sistémico por toxinas puede aparecer sin que la bacteria causal invada la sangre.'] },
        { nombre: 'Sepsis', celdas: ['Disfunción orgánica potencialmente mortal causada por una respuesta desregulada del huésped a una infección. Bacteriemia y sepsis no son equivalentes.'] },
      ],
    },
    {
      id: 'tres-fases',
      titulo: 'Las tres fases de una bacteriemia',
      fuente: 'AI18 §3',
      columnas: ['Fase', 'Qué ocurre'],
      destino: d('quien', 4),
      nota: 'Un factor que permite colonizar el pulmón o el intestino no necesariamente permite sobrevivir en la sangre.',
      filas: [
        { nombre: '1 · Colonización o infección inicial', celdas: ['La bacteria se establece: adhesión, obtención de nutrientes y evasión de las defensas locales.'] },
        { nombre: '2 · Diseminación', celdas: ['Atraviesa barreras epiteliales y endoteliales, o accede directamente por un dispositivo o una lesión. Los factores necesarios dependen del foco.'] },
        { nombre: '3 · Supervivencia en sangre y órganos filtradores', celdas: ['Debe resistir el complemento, los fagocitos y la restricción nutricional, ajustando su metabolismo y su superficie.'] },
      ],
    },
    {
      id: 'cuatro-puertas',
      titulo: 'Cuatro puertas de entrada',
      fuente: 'AI18 §3',
      columnas: ['Foco o vía', 'Relación con la bacteriemia', 'Ejemplos destacados'],
      destino: d('quien', 5),
      filas: [
        { nombre: 'Intestino', celdas: ['Reservorio; la translocación se favorece cuando la barrera o la inmunidad están alteradas.', '*E. coli*, *K. pneumoniae*'] },
        { nombre: 'Tracto urinario', celdas: ['Ascenso hasta el riñón y cruce del epitelio tubular y del endotelio capilar.', '*E. coli*, *Proteus mirabilis*, *Klebsiella*'] },
        { nombre: 'Pulmón', celdas: ['Daño de la barrera alveolar y vascular durante la neumonía.', '*K. pneumoniae*, *P. aeruginosa*, *A. baumannii*'] },
        { nombre: 'Piel, tejidos blandos y dispositivos', celdas: ['Brecha física o material colonizado que da acceso a la sangre.', '*Pseudomonas*, *Acinetobacter*, *Serratia*'] },
      ],
    },
  ],

  // ─── Capítulos 2 y 3: el moco y las uniones ──────────────────────────────────
  moco: [
    {
      id: 'ataque-moco',
      titulo: 'Cómo ataca el patógeno al moco',
      fuente: 'AI18 §5',
      columnas: ['Patógeno', 'Qué hace con el moco'],
      destino: d('barrera', 5),
      nota: 'La pérdida del moco expone al enterocito: más acceso a receptores y nutrientes, IL-8 y reclutamiento de neutrófilos. No se sabe con precisión cuánto tarda en reconstruirse un moco y una microbiota plenamente funcionales.',
      filas: [
        { nombre: '*Vibrio cholerae*', celdas: ['Hap, una hemaglutinina/proteasa dependiente de zinc, degrada la mucina y es citotóxica: favorece el desprendimiento y la propagación.'] },
        { nombre: '*E. coli*', celdas: ['SslE degrada mucinas y favorece la penetración y la adhesión; puede estar también en cepas comensales. Importa su combinación con otros factores, no solo detectar el gen.'] },
        { nombre: '*Salmonella* y *Shigella*', celdas: ['Aprovechan los productos de degradación de las mucinas como nutrientes. El consumo y la degradación excesivos rompen el equilibrio con la renovación del moco.'] },
        { nombre: '*C. difficile* (grampositiva)', celdas: ['Se asocia con menos MUC2 y un cambio hacia MUC1, que pueden favorecer su unión. No se debe atribuir toda la degradación a una mucinasa propia identificada.'], destino: d('barrera', 6) },
      ],
    },
    {
      id: 'tipos-union',
      titulo: 'Cinco tipos de unión entre enterocitos',
      fuente: 'AI18 §6',
      columnas: ['Estructura', 'Componentes y función'],
      destino: d('uniones', 0),
      filas: [
        { nombre: 'Uniones estrechas (TJ)', celdas: ['Claudinas, ocludina y tricelulina; ZO-1 enlaza el complejo con la actina. Regulan la selectividad paracelular y contribuyen a la polaridad.'] },
        { nombre: 'Uniones adherentes (AJ)', celdas: ['E-cadherina y cateninas, conectadas con la actina. Dan la adhesión mecánica entre células.'] },
        { nombre: 'Desmosomas', celdas: ['Adhesión robusta, vinculada a filamentos intermedios.'] },
        { nombre: 'Uniones comunicantes', celdas: ['Conexones que permiten la comunicación entre células.'] },
        { nombre: 'Adhesiones focales y hemidesmosomas', celdas: ['Contactos célula-matriz en la base del epitelio, mediados por integrinas.'] },
      ],
    },
    {
      id: 'dos-rutas',
      titulo: 'Dos rutas de cruce',
      fuente: 'AI18 §6',
      columnas: ['Ruta', 'Cómo cruza'],
      destino: d('uniones', 1),
      nota: 'Las células M pueden llevar patógenos hasta las placas de Peyer; algunos microorganismos sobreviven en los fagocitos y aprovechan su tráfico para diseminarse.',
      filas: [
        { nombre: 'Paracelular', celdas: ['Pasa entre las células, generalmente al alterar sus uniones.'] },
        { nombre: 'Transcelular', celdas: ['Cruza una célula, por invasión o por transcitosis.'] },
      ],
    },
    {
      id: 'romper-union',
      titulo: 'Cuatro formas de romper una unión',
      fuente: 'AI18 §6',
      columnas: ['Forma', 'Cómo y quién'],
      nota: 'Un mismo patógeno puede combinar varias formas, y la ruta depende del microorganismo.',
      filas: [
        { nombre: 'Corte proteolítico', celdas: ['HtrA de varios patógenos gramnegativos puede degradar la E-cadherina; la fragilisina de *Bacteroides fragilis* enterotoxigénico también la afecta.'], destino: d('uniones', 2) },
        { nombre: 'Fosforilación o localización anormal', celdas: ['En infecciones por *Campylobacter*, EPEC, *Salmonella* y *Shigella*, la ocludina, ZO-1 y otras proteínas se redistribuyen o cambian su expresión.'], destino: d('uniones', 3) },
        { nombre: 'Reorganización de la actina', celdas: ['Efectores del sistema de secreción tipo III (T3SS), como EspF de EPEC, desestabilizan el soporte intracelular de las uniones.'], destino: d('uniones', 4) },
        { nombre: 'Señalización inflamatoria', celdas: ['IL-1β y la activación de MLCK pueden modificar la miosina y abrir las uniones, como en modelos de *Yersinia pseudotuberculosis*.'], destino: d('uniones', 5) },
      ],
    },
  ],

  // ─── Capítulos 4 y 7: la invasión y la reparación ────────────────────────────
  invasion: [
    {
      id: 'invadir-enterocito',
      titulo: 'Cómo invaden y alteran al enterocito',
      fuente: 'AI18 §7',
      columnas: ['Bacteria', 'Qué hace'],
      filas: [
        { nombre: '*Salmonella* Typhimurium', celdas: ['Usa flagelos para acercarse al epitelio; SopB, SopE y SopE2 inducen ondulaciones de membrana, dependientes de Rho-GTPasas, que facilitan su captación. También puede entrar de forma más discreta, con SipA, en zonas apicolaterales.'], destino: d('invasion', 0) },
        { nombre: '*Shigella*', celdas: ['Entra preferentemente por el polo basolateral; SepA modifica reguladores de la actina y favorece la inflamación y el tránsito paracelular hacia esa superficie.'], destino: d('invasion', 1) },
        { nombre: '*Listeria monocytogenes* (grampositiva)', celdas: ['Invade con internalinas, escapa del compartimento vacuolar con listeriolisina O y se propaga entre células con ActA y colas de actina.'], destino: d('invasion', 2) },
        { nombre: 'EPEC', celdas: ['Forma pedestales ricos en actina y redistribuye proteínas de polaridad como CRB3 y PALS1.'], destino: d('invasion', 3) },
      ],
    },
    {
      id: 'modelos-regeneracion',
      titulo: 'Dos modelos de regeneración',
      fuente: 'AI18 §11',
      columnas: ['Situación', 'Qué sostiene la regeneración'],
      destino: d('reparar', 1),
      nota: 'No son mecanismos excluyentes.',
      filas: [
        { nombre: 'Homeostasis', celdas: ['Células madre columnares LGR5+ de la base de la cripta sostienen el recambio cotidiano, en un nicho regulado por señales como WNT.'] },
        { nombre: 'Respuesta a la lesión', celdas: ['Poblaciones regenerativas, incluidas células CLU+ descritas en modelos experimentales, pueden expandirse mediante YAP1. La plasticidad de las células diferenciadas también puede reponer progenitores.'] },
      ],
    },
    {
      id: 'interferir-reparacion',
      titulo: 'Cómo interfieren los patógenos con la reparación',
      fuente: 'AI18 §11',
      columnas: ['Estrategia', 'Ejemplo y efecto'],
      destino: d('reparar', 3),
      nota: 'Más proliferación no siempre es recuperación: una respuesta moderada elimina células infectadas, el exceso de daño impide reparar y la hiperplasia puede favorecer la persistencia.',
      filas: [
        { nombre: 'Daño de células madre y del nicho', celdas: ['TcdB de *C. difficile* alcanza criptas alteradas, intoxica células madre e interfiere con WNT.'] },
        { nombre: 'Bloqueo del recambio o de la muerte celular', celdas: ['Cif de EPEC detiene el ciclo celular; NleB1 bloquea señales de receptores de muerte; IpaB de *Shigella* altera reguladores del ciclo.'] },
        { nombre: 'Proliferación y supervivencia excesivas', celdas: ['CagA de *H. pylori* favorece la proliferación y la persistencia; AvrA de *Salmonella* estabiliza la β-catenina; *C. rodentium* puede producir hiperplasia de criptas.'] },
        { nombre: 'Arquitectura reparativa anormal', celdas: ['La alteración de ZO-1 y de la polaridad puede comprometer la orientación de las divisiones y la organización del epitelio.'] },
      ],
    },
  ],

  // ─── Capítulos 5 y 6: las toxinas y la sepsis ────────────────────────────────
  toxinas: [
    {
      id: 'endo-exo',
      titulo: 'Endotoxina frente a exotoxinas',
      fuente: 'AI18 §8',
      columnas: ['Característica', 'Endotoxina', 'Exotoxinas'],
      destino: d('toxinas', 6),
      nota: 'Tres errores frecuentes: una gramnegativa puede dañar con endotoxina y con exotoxinas a la vez; una exotoxina puede actuar a distancia; «entero» describe el sitio de acción, no significa «endotoxina».',
      filas: [
        { nombre: 'Naturaleza', celdas: ['LPS o LOS de la membrana externa; el lípido A es la porción endotóxica.', 'Proteínas con actividades específicas.'] },
        { nombre: 'Productores', celdas: ['Bacterias gramnegativas portadoras de LPS/LOS.', 'Determinadas cepas gramnegativas y grampositivas.'] },
        { nombre: 'Salida de la bacteria', celdas: ['Lisis y desprendimiento de membrana, incluidas vesículas liberadas por bacterias vivas.', 'Secreción, liberación o inyección de efectores; depende de la toxina.'] },
        { nombre: 'Acción predominante', celdas: ['Activación de la inmunidad innata y de mediadores inflamatorios.', 'Daño dependiente de receptores y blancos celulares: membrana, citoesqueleto o síntesis proteica.'] },
        { nombre: 'Calor', celdas: ['Relativamente termoestable.', 'Muchas son termolábiles; existen excepciones termoestables.'] },
        { nombre: 'Neutralización', celdas: ['No equivale al modelo clásico de antitoxina/toxoide.', 'Algunas pueden neutralizarse con anticuerpos; algunas permiten desarrollar toxoides.'] },
        { nombre: 'Ejemplos', celdas: ['LPS de enterobacterias; endotoxina de otras gramnegativas.', 'Shiga, ExoU, ExoS, ExoT, ExlA; TcdA/TcdB como comparación grampositiva.'], destino: d('toxinas', 5) },
      ],
    },
    {
      id: 'seis-toxinas',
      titulo: 'Seis toxinas y efectores',
      fuente: 'AI18 §8',
      columnas: ['Toxina o efector', 'Mecanismo y consecuencia'],
      destino: d('toxinas', 5),
      filas: [
        { nombre: 'Shiga (Stx), STEC/EHEC y *S. dysenteriae*', celdas: ['Interacción con Gb3 e inhibición de la síntesis proteica; lesión endotelial y renal al alcanzar sitios extraintestinales.'] },
        { nombre: 'ExoU, *P. aeruginosa*', celdas: ['Fosfolipasa que daña las membranas y favorece la diseminación pulmonar.'] },
        { nombre: 'ExoS y ExoT, *P. aeruginosa*', celdas: ['Efectores del T3SS que alteran el citoesqueleto y la función de las células del huésped, y favorecen la evasión inmunitaria.'] },
        { nombre: 'ExlA y LasB, *P. aeruginosa*', celdas: ['ExlA produce citotoxicidad en cepas sin T3SS; LasB es una proteasa exportada por el T2SS que altera la matriz y las uniones vasculares.'] },
        { nombre: 'ZOT, *V. cholerae*', celdas: ['Modifica la señalización y la actina, y favorece la apertura de las uniones estrechas.'] },
        { nombre: 'TcdA/TcdB, *C. difficile* (grampositiva)', celdas: ['Toxinas glucosilantes; TcdB altera las Rho-GTPasas, el citoesqueleto y la reparación del epitelio.'] },
      ],
    },
    {
      id: 'sepsis-3',
      titulo: 'Sepsis-3 de un vistazo',
      fuente: 'AI18 §10 · Sepsis-3',
      columnas: ['Término', 'Definición'],
      nota: 'La gravedad no depende solo de cuántas bacterias hay: también importan el foco, las toxinas, la reserva del paciente y su respuesta inmunitaria. Puede haber sepsis sin hemocultivos positivos.',
      filas: [
        { nombre: 'Sepsis', celdas: ['Disfunción orgánica potencialmente mortal causada por una respuesta desregulada del huésped a una infección. Se operacionaliza con un aumento del SOFA de al menos 2 puntos atribuible a la infección; el SOFA total no es una escala global de cuatro puntos.'], destino: d('sepsis', 7) },
        { nombre: 'qSOFA', celdas: ['Frecuencia respiratoria ≥ 22/min, presión sistólica ≤ 100 mmHg y alteración mental. Dos o más hallazgos señalan mayor riesgo, pero por sí solos no constituyen el diagnóstico de sepsis.'], destino: d('sepsis', 8) },
        { nombre: 'Choque séptico', celdas: ['Necesidad de vasopresores para mantener una PAM ≥ 65 mmHg, con lactato > 2 mmol/L pese a una reanimación adecuada.'], destino: d('sepsis', 8) },
      ],
    },
  ],

  // ─── Capítulo 8: las cuatro especies ─────────────────────────────────────────
  especies: [
    {
      id: 'cuatro-especies',
      titulo: 'Cuatro especies, cuatro estrategias',
      fuente: 'AI18 §12–15',
      columnas: ['Especie', 'Origen y puerta', 'Armas principales', 'Para recordar'],
      nota: 'Pregunta de examen: ¿cuál usa las toxinas como estrategia principal? *Pseudomonas*. ¿Y cuáles se apoyan en cápsula, adhesión, hierro y adaptación? *E. coli*, *Klebsiella* y *Acinetobacter*.',
      filas: [
        {
          nombre: '*Escherichia coli*',
          celdas: [
            'Reservorio intestinal. Infección urinaria ascendente y translocación desde el intestino; el riesgo intestinal aumenta con el daño mucoso y la inmunosupresión.',
            ['Adhesión y evasión: cápsula, fimbrias tipo 1 y P, adhesinas Afa/Dr; Pic puede reducir la actividad leucocitaria; el polisacárido de pgaABCD favorece la biopelícula.', 'Nutrición: sideróforos y TonB, Hma/ChuA para el hierro; NanA para usar el ácido siálico.'],
            ['La gramnegativa predominante en bacteriemia en las series revisadas.', 'ExPEC agrupa las cepas extraintestinales (UPEC, SEPEC); EPEC y EHEC/STEC son intestinales y no equivalen a UPEC.', 'Filogrupos B2 y D: se asocian con más factores de virulencia. ST131: destaca por su expansión y su asociación con resistencia, incluida la BLEE CTX-M.', 'Hemolisina y fimbrias P: resultados distintos entre cepas, focos y modelos.'],
          ],
          destino: d('especies', 1),
        },
        {
          nombre: '*Klebsiella pneumoniae*',
          celdas: [
            'Reservorio intestinal. Neumonía, infección urinaria, foco biliar y absceso hepático pueden preceder a la bacteriemia.',
            ['Cápsula: dificulta la opsonización, la fagocitosis y la acción del complemento.', 'Sideróforos: captan hierro; en modelos pulmonares, su interacción con HIF-1α se vincula con la diseminación.', 'Fimbrias tipo 3 (mrkCDF), kfu y tonB: adhesión y adquisición de hierro según el foco.'],
            ['Cuatro perfiles: clásico, hipervirulento, resistente a carbapenémicos y convergente.', 'Hipermucoviscosidad e hipervirulencia no son sinónimos absolutos.', 'GltA es relevante para el hígado y el bazo en el modelo estudiado, sin ser imprescindible en la sangre: un ejemplo de especificidad de nicho.', 'Sin un repertorio de exotoxinas potentes que explique su bacteriemia.'],
          ],
          destino: d('especies', 5),
        },
        {
          nombre: '*Pseudomonas aeruginosa*',
          celdas: [
            'Nichos húmedos, infección sanitaria y neumonía; también accede desde quemaduras, heridas y tejidos blandos. Ectima gangrenoso: manifestación clásica, sobre todo en inmunocomprometidos.',
            ['T3SS: ExoU (fosfolipasa que daña las membranas y favorece la salida del pulmón); ExoS y ExoT (alteran la actina y las funciones inmunitarias).', 'Sin T3SS: ExlA (necrosis; rompe barreras vasculares) y LasB (exportada por el T2SS; degrada la matriz y las cadherinas del endotelio).'],
            ['La que usa las toxinas como estrategia principal.', 'ExoU y ExoS rara vez coexisten en la misma cepa.', 'Resistencia: bombas de eflujo como MexAB-OprM, AmpC y carbapenemasas.'],
          ],
          destino: d('especies', 8),
        },
        {
          nombre: '*Acinetobacter baumannii*',
          celdas: [
            'Persiste en superficies y equipos hospitalarios y coloniza a pacientes vulnerables. Neumonía, dispositivos y heridas quirúrgicas pueden preceder a la bacteriemia.',
            ['Biopelícula; en la sangre se han descrito menos señales de adhesión y biopelícula y más genes de dispersión, como pilQ.', 'MltB (transglicosilasa lítica): participa en el remodelado de la pared, la resistencia al estrés, la adhesión y la resistencia sérica.', 'Cápsula y unión de plasminógeno para resistir el complemento; hierro y adaptación: feoB, fepA y pntB.'],
            ['Se parece a *Klebsiella* y a *E. coli* (protección de superficie y adaptación) más que a *Pseudomonas*.', 'Resistencia: β-lactamasas, eflujo y enzimas modificadoras de aminoglucósidos; la magnitud varía por cepa y lugar.'],
          ],
          destino: d('especies', 11),
        },
      ],
    },
    {
      id: 'klebsiella-perfiles',
      titulo: '*Klebsiella pneumoniae*: cuatro perfiles',
      fuente: 'AI18 §13',
      columnas: ['Perfil', 'Rasgos principales'],
      destino: d('especies', 5),
      filas: [
        { nombre: 'Clásico', celdas: ['Frecuente en infecciones oportunistas y sanitarias; puede acumular resistencia.'] },
        { nombre: 'Hipervirulento', celdas: ['Asociado con infección invasiva y absceso hepático, incluso en personas sin comorbilidad evidente; destacan los sideróforos y los rasgos capsulares. Hipermucoviscosidad e hipervirulencia están relacionadas, pero no son sinónimos absolutos.'] },
        { nombre: 'Resistente a carbapenémicos', celdas: ['Carbapenemasas variables por región, incluidas KPC y otras como NDM u OXA-232 en las cohortes revisadas.'] },
        { nombre: 'Convergente', celdas: ['Combina resistencia e hipervirulencia; es la combinación que más preocupa.'] },
      ],
    },
    {
      id: 'otras-especies',
      titulo: 'Otras especies y complejos',
      fuente: 'AI18 §16',
      columnas: ['Microorganismo', 'Origen y contexto', 'Patogenia y resistencia'],
      destino: d('especies', 13),
      filas: [
        { nombre: '*Serratia marcescens*', celdas: ['Ambientes, soluciones y equipos contaminados; brotes sanitarios.', 'Cápsula (wzx, pgm), glucólisis (pfkA) y el sideróforo serratiochelina. AmpC cromosómica y resistencia adquirida; resistencia intrínseca a polimixinas.'] },
        { nombre: '*Citrobacter freundii*', celdas: ['Colonización intestinal; focos urinarios, digestivos, intraabdominales o dispositivos, sobre todo con comorbilidad.', 'Reparación del ADN (RuvABC), glucólisis (pfkA), manitol (mtlD) y transporte TatC. AmpC y posible resistencia adquirida a carbapenémicos.'] },
        { nombre: '*Proteus mirabilis*', celdas: ['Infección urinaria asociada con catéter, sobre todo en mayores; la litiasis y la obstrucción favorecen las complicaciones.', 'Adhesión y movilidad; TatA/TatC, la asimilación de nitrógeno y las poliaminas apoyan la aptitud en la sangre. Pobre susceptibilidad intrínseca a polimixinas.'] },
        { nombre: 'Complejo *Enterobacter cloacae*', celdas: ['Catéteres, intestino y vías urinarias; relación con la atención sanitaria.', 'AmpC cromosómica, BLEE y otros mecanismos adquiridos. Hay poca definición de factores de aptitud específicos de la bacteriemia.'] },
        { nombre: 'Complejo *K. pneumoniae*', celdas: ['Incluye especies relacionadas como *K. variicola* y *K. quasipneumoniae*.', 'Comparten algunos sistemas de hierro y adhesión; identificar la especie importa para estudiar la patogenia y la epidemiología.'] },
        { nombre: 'Complejo *A. calcoaceticus–baumannii*', celdas: ['Incluye *A. baumannii*, *A. nosocomialis*, *A. calcoaceticus* y *A. pittii*.', 'No atribuir automáticamente toda infección del complejo a *A. baumannii*.'] },
      ],
    },
  ],

  // ─── Capítulo 9: comparar, resistencia y leer la evidencia ───────────────────
  resistencia: [
    {
      id: 'entericos',
      titulo: 'Patógenos entéricos, lado a lado',
      fuente: 'AI18 §17–18',
      columnas: ['Patógeno', 'Estrategia destacada', 'Implicación'],
      destino: d('resistencia', 0),
      nota: 'Ejes compartidos: la cápsula reduce la eliminación inmunitaria, las adhesinas ayudan a colonizar y a cruzar barreras, los sideróforos contrarrestan la restricción de hierro y la flexibilidad metabólica permite sobrevivir. Las toxinas pesan distinto según la especie.',
      filas: [
        { nombre: '*Salmonella* Typhi', celdas: ['Invasión y diseminación, con daño intestinal inicial relativamente limitado.', 'La gravedad sistémica no exige una gran destrucción mucosa visible al inicio.'] },
        { nombre: '*Salmonella* Typhimurium', celdas: ['Inflamación, invasión mediada por T3SS y alteración de la actina y las uniones.', 'Gastroenteritis inflamatoria; posible diseminación según el huésped y el contexto.'] },
        { nombre: 'EPEC / EHEC', celdas: ['Lesiones de adhesión y borramiento; efectores que alteran uniones, polaridad y recambio.', 'EHEC/STEC añade el riesgo de lesión sistémica por Stx.'] },
        { nombre: '*Shigella*', celdas: ['Acceso basolateral, SepA, alteración de la actina y del ciclo celular.', 'Daño colónico inflamatorio; algunas cepas producen toxina Shiga.'] },
        { nombre: '*V. cholerae*', celdas: ['Proteólisis del moco y efectos sobre las uniones, incluidos Hap y ZOT.', 'Favorece la colonización, la propagación y la alteración funcional de la barrera.'] },
        { nombre: '*H. pylori*', celdas: ['Alteración de las uniones y de las señales de supervivencia y proliferación mediante CagA.', 'Persistencia e inflamación gástrica; debe distinguirse del nicho colónico.'] },
        { nombre: '*Campylobacter*', celdas: ['Alteraciones de la ocludina y proteólisis; las citocinas pueden afectar la tricelulina.', 'Permeabilidad derivada tanto del patógeno como de la respuesta del huésped.'] },
        { nombre: '*Yersinia*', celdas: ['Transcitosis e invasión, y señalización inflamatoria que modifica MLCK.', 'Cruce de la barrera por rutas diversas.'] },
        { nombre: '*C. difficile* / *C. perfringens* (grampositivas)', celdas: ['Toxinas que dañan el citoesqueleto o las membranas y, en ciertos casos, las células madre.', 'Ejemplos comparativos de lesión de barrera y de efectos sistémicos por toxinas.'] },
      ],
    },
    {
      id: 'cinco-resistencias',
      titulo: 'Resistencia: cinco ideas',
      fuente: 'AI18 §18',
      columnas: ['Mecanismo', 'Idea central'],
      destino: d('resistencia', 2),
      nota: 'Resistencia y virulencia describen propiedades diferentes. Pueden converger, pero detectar resistencia no demuestra mayor capacidad invasiva intrínseca.',
      filas: [
        { nombre: 'BLEE', celdas: ['Enzimas que amplían la hidrólisis de los β-lactámicos; CTX-M es un ejemplo importante en las cepas descritas.'] },
        { nombre: 'AmpC', celdas: ['Cefalosporinasas presentes de forma cromosómica en varias especies; la expresión y otros mecanismos modifican el fenotipo final.'] },
        { nombre: 'Carbapenemasas', celdas: ['KPC, NDM, VIM y determinadas OXA aparecen en las cohortes o especies revisadas; su distribución varía con la geografía y el tiempo.'] },
        { nombre: 'Eflujo, permeabilidad y otras enzimas', celdas: ['Bombas, cambios de porinas y enzimas modificadoras de antibióticos contribuyen a la resistencia combinada.'] },
        { nombre: 'Elementos genéticos móviles', celdas: ['Favorecen la transferencia de genes entre cepas y especies, incluidos los reservorios ambientales.'] },
      ],
    },
    {
      id: 'modelos-experimentales',
      titulo: 'Modelos experimentales y su límite',
      fuente: 'AI18 §19',
      columnas: ['Modelo', 'Qué permite estudiar', 'Limitación principal'],
      destino: d('resistencia', 6),
      nota: 'Para leer un hallazgo: especie y cepa, huésped, foco, fase, inóculo y variable medida. Un cuello de botella elimina al azar parte de la población al pasar entre nichos, y recuperar bacterias de hígado o bazo no equivale a medir la carga en la sangre.',
      filas: [
        { nombre: 'Infección respiratoria', celdas: ['Colonización pulmonar y diseminación secundaria.', 'Un defecto pulmonar puede reducir la bacteriemia sin que exista un defecto específico de cruce o de supervivencia.'] },
        { nombre: 'Infección urinaria', celdas: ['Ascenso y paso desde el aparato urinario a la sangre.', 'Cuellos de botella y diferencias anatómicas o de receptores entre especies.'] },
        { nombre: 'Inyección intravenosa', celdas: ['Aptitud después del acceso directo a la circulación.', 'Omite la colonización y el cruce de barreras; suele usar inóculos altos.'] },
        { nombre: 'Inyección intraperitoneal', celdas: ['Diseminación desde la cavidad y colonización de órganos.', 'Puede mezclar el paso por barreras, el drenaje portal y la filtración hepática.'] },
        { nombre: 'Muerte bacteriana en suero', celdas: ['Susceptibilidad a factores séricos, sobre todo al complemento.', 'No reproduce las células inmunitarias ni la complejidad de la sangre completa.'] },
        { nombre: 'Crecimiento en suero', celdas: ['Necesidades nutricionales y replicación.', 'El suero no contiene todos los nutrientes ni las interacciones de los focos y los órganos.'] },
        { nombre: 'Organoides, imagen y técnicas ómicas', celdas: ['Daño de barrera, reparación y respuestas celulares y moleculares.', 'Requieren validar el contexto fisiológico y su traducción a la enfermedad humana.'] },
      ],
    },
  ],

  // ─── Repaso de Farmacología (los pasos [F] de los capítulos) ─────────────────
  farmacos: [
    {
      id: 'farmaco-obstaculo',
      titulo: 'Un fármaco, un obstáculo, por tema',
      fuente: 'Repaso de Farmacología',
      farmacologia: true,
      columnas: ['Tema', 'Fármaco o clase', 'Qué pasa y por qué'],
      filas: [
        { nombre: 'Dos membranas', celdas: ['β-lactámicos · vancomicina', 'Los β-lactámicos entran por las porinas de la membrana externa. La vancomicina es demasiado grande para cruzar esa membrana y no cubre a las gramnegativas. El antibiótico es factor de riesgo y herramienta.'], destino: d('quien', 6) },
        { nombre: 'Antibióticos y disbiosis', celdas: ['Antibióticos de amplio espectro · vancomicina oral · fidaxomicina', 'Los de amplio espectro, sobre todo los que eliminan anaerobios, borran la resistencia a la colonización y abren la puerta a los oportunistas. *C. difficile* se trata con vancomicina oral o fidaxomicina, que casi no se absorben y actúan en la luz del intestino.'], destino: d('barrera', 8) },
        { nombre: 'Rehidratación oral', celdas: ['Sales de rehidratación oral', 'Aunque las uniones estén abiertas o la secreción activada, el cotransportador SGLT1 sigue funcionando: las sales llevan glucosa y sodio y aprovechan una vía que la diarrea no apaga.'], destino: d('uniones', 7) },
        { nombre: 'El fármaco tiene que llegar adentro', celdas: ['Fluoroquinolonas · macrólidos · aminoglucósidos', 'Las fluoroquinolonas y los macrólidos (como la azitromicina) penetran en las células; los aminoglucósidos penetran mal y fallan dentro de ellas. En STEC/EHEC el antibiótico puede aumentar la liberación de toxina Shiga y el riesgo de síndrome hemolítico urémico: por eso se evita de rutina.'], destino: d('invasion', 7) },
        { nombre: 'Fármacos y endotoxina', celdas: ['Polimixinas (colistina) · eritorán · toxoides y antitoxinas', 'Las polimixinas se unen al lípido A, de carga negativa, y desorganizan la membrana externa; la resistencia modifica el lípido A. Los bactericidas pueden liberar endotoxina al lisar. Bloquear TLR4 con eritorán no mejoró la mortalidad en ensayos de sepsis. Hay toxoides y antitoxinas para algunas exotoxinas; para la endotoxina, no.'], destino: d('toxinas', 9) },
        { nombre: 'La primera hora', celdas: ['Antibiótico empírico · cristaloides · noradrenalina', 'Solo principios: hemocultivos antes del antibiótico empírico; antibiótico lo antes posible si hay choque; cristaloides; noradrenalina como vasopresor de primera línea para una PAM de 65. La dosis y el esquema son de la guía local.'], destino: d('sepsis', 9) },
        { nombre: 'Control del foco', celdas: ['Antibiótico y control del foco', 'Sin control del foco el antibiótico no basta: hay que drenar el absceso o retirar el catéter o el dispositivo infectado, y reajustar según el cultivo.'], destino: d('sepsis', 10) },
        { nombre: 'Fármacos que dañan las criptas', celdas: ['Quimioterapia · radioterapia · trasplante de microbiota fecal', 'La quimioterapia mata células que se dividen, como las de las criptas: mucositis, la puerta de entrada de la primera paciente. La radioterapia hace lo mismo. El trasplante de microbiota fecal en *C. difficile* recurrente intenta recomponer el nicho.'], destino: d('reparar', 5) },
      ],
    },
    {
      id: 'farmaco-especie',
      titulo: 'Ronda de fármacos por especie',
      fuente: 'Repaso de Farmacología',
      farmacologia: true,
      columnas: ['Especie', 'Fármacos', 'Qué ocurre'],
      filas: [
        { nombre: '*E. coli* con BLEE', celdas: ['Penicilinas · cefalosporinas de 3.ª generación · clavulanato y tazobactam · carbapenémicos', 'Hidroliza penicilinas y cefalosporinas de 3.ª generación. Los inhibidores (clavulanato, tazobactam) la frenan con límites, y los carbapenémicos resisten esa hidrólisis.'], destino: d('especies', 14) },
        { nombre: '*Klebsiella* con carbapenemasa', celdas: ['Avibactam · carbapenémicos', 'Las carbapenemasas de serina (como KPC) se inhiben con avibactam; las metalo-β-lactamasas (como NDM y VIM), no. Por eso preocupa el perfil convergente.'], destino: d('especies', 15) },
        { nombre: '*Pseudomonas*', celdas: ['β-lactámicos antipseudomonas · aminoglucósidos · fluoroquinolonas · polimixinas', 'Resiste por tres frentes: bombas de eflujo (como MexAB-OprM), la cefalosporinasa AmpC y la pérdida de porinas.'], destino: d('especies', 16) },
        { nombre: '*Acinetobacter*', celdas: ['Carbapenémicos · sulbactam · polimixinas', 'Carbapenémicos y sulbactam; polimixinas cuando hay carbapenemasas OXA.'], destino: d('especies', 17) },
      ],
    },
    {
      id: 'mecanismo-farmaco',
      titulo: 'Cada mecanismo, un fármaco que falla',
      fuente: 'Repaso de Farmacología',
      farmacologia: true,
      columnas: ['Mecanismo', 'El fármaco que falla'],
      destino: d('resistencia', 4),
      nota: 'Mecanismo, no receta: el cultivo y el antibiograma orientan, se desescala cuando se puede y se controla el foco. La elección real depende de la guía local y de tu clase de Farmacología.',
      filas: [
        { nombre: 'BLEE', celdas: ['Las cefalosporinas de 3.ª generación.'] },
        { nombre: 'AmpC', celdas: ['No la frena el clavulanato.'] },
        { nombre: 'Carbapenemasas', celdas: ['Los carbapenémicos.'] },
        { nombre: 'Eflujo y porinas', celdas: ['Afectan a varias clases a la vez.'] },
      ],
    },
  ],
};
