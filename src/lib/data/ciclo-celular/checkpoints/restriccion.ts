import type { Checkpoint } from '../tipos';

// Punto de restricción (G1 tardío). Traducción del ejemplo 11.3 del prompt
// maestro al contrato de `tipos.ts`: los anclajes nombrados (`bolsillo`,
// `dock`, `top`) pasan a `lado`, y los residuos van en `label`.

const checkpoint: Checkpoint = {
  id: 'restriccion',
  nombre: 'Punto de restricción',
  nombreCorto: 'Restricción',
  fase: 'G1',
  pregunta: '¿Hay señales para dividirse? Decide RB–E2F.',
  resumen:
    'Los mitógenos inducen ciclina D; ciclina D–CDK4/6 y luego ciclina E–CDK2 fosforilan RB, liberan E2F y la célula se compromete a entrar en fase S sin depender ya de los factores de crecimiento.',
  compartimentos: { membrana: true, nucleo: { top: 4.1 } },
  actores: {
    fc: { img: 'factor_crecimiento', label: 'Factor de crecimiento', compartment: 'extracelular' },
    rtk: { img: 'receptor_rtk', label: 'Receptor tirosina cinasa', compartment: 'membrana', escala: 0.85 },
    ras: { img: 'ras_gtp', label: 'RAS-GTP', compartment: 'citoplasma' },
    mapk: { img: 'cascada_mapk', label: 'RAF → MEK → ERK', compartment: 'citoplasma' },
    pi3k: { img: 'pi3k', label: 'PI3K', compartment: 'citoplasma' },
    akt: { img: 'akt', label: 'AKT', compartment: 'citoplasma' },
    gsk3b: { img: 'gsk3b', label: 'GSK3β', compartment: 'citoplasma' },
    myc: { img: 'myc_max', label: 'MYC–MAX', compartment: 'nucleo' },
    genD: { img: 'adn_helice', label: 'Gen de ciclina D (CCND1)', compartment: 'nucleo' },
    cicD: { img: 'ciclina_d', label: 'Ciclina D', compartment: 'citoplasma' },
    cdk4: { img: 'cdk4_6', label: 'CDK4/6', compartment: 'citoplasma' },
    rb: { img: 'rb', label: 'RB', compartment: 'nucleo' },
    e2f: { img: 'e2f_dp1', label: 'E2F–DP1', compartment: 'nucleo' },
    hdac: { img: 'hdac', label: 'HDAC', compartment: 'nucleo' },
    genS: { img: 'adn_helice', label: 'Genes de fase S', compartment: 'nucleo' },
    cicE: { img: 'ciclina_e', label: 'Ciclina E', compartment: 'nucleo' },
    cdk2: { img: 'cdk2', label: 'CDK2', compartment: 'nucleo' },
    p27: { img: 'p27', label: 'p27', compartment: 'nucleo' },
    p16: { img: 'p16', label: 'p16<sup>INK4a</sup>', compartment: 'nucleo' },
    scf: { img: 'e3_ligasa_scf', label: 'SCF–Skp2', compartment: 'nucleo' },
    prot: { img: 'proteasoma', label: 'Proteasoma', compartment: 'nucleo' },
    cicA: { img: 'ciclina_a', label: 'Ciclina A', compartment: 'nucleo' },
    cdc6: { img: 'cdc6', label: 'CDC6', compartment: 'nucleo' },
    cdt1: { img: 'cdt1', label: 'CDT1', compartment: 'nucleo' },
  },
  pasos: [
    {
      id: 'r0',
      orden: 0,
      titulo: 'Estado basal en G1',
      texto:
        'Al inicio de G1, RB sin fosforilar sujeta a E2F sobre el ADN. Los genes que la célula necesita para replicarse están apagados.',
      profundiza:
        'El bolsillo (pocket) de RB se une al dominio de transactivación de los E2F activadores (E2F1–3) unidos a DP1. RB además recluta HDAC, complejos SWI/SNF y metiltransferasas de histonas: la cromatina se compacta y la represión es activa, no solo por bloqueo. p16 y p27 están presentes como frenos de fondo.',
      protagonistas: ['rb', 'e2f', 'hdac'],
      acciones: [
        { at: 0, tipo: 'appear', actor: 'genS', pos: { col: 8, row: 7.4 }, from: 'fade' },
        { at: 150, tipo: 'appear', actor: 'e2f', pos: { col: 8, row: 6.7 }, from: 'grow' },
        { at: 450, tipo: 'appear', actor: 'rb', pos: { col: 7.2, row: 5.9 }, from: 'grow' },
        // Antes `anchor: 'bolsillo'`: RB abraza a E2F desde arriba.
        { at: 800, tipo: 'bind', actor: 'rb', target: 'e2f', lado: 'arriba' },
        { at: 900, tipo: 'appear', actor: 'hdac', pos: { col: 6.1, row: 6.6 }, from: 'fade' },
        { at: 1200, tipo: 'connect', id: 'rb-e2f', from: 'rb', to: 'e2f', type: 'inhibe' },
        { at: 1300, tipo: 'inhibit', inhibitor: 'rb', target: 'genS' },
        { at: 1500, tipo: 'appear', actor: 'p16', pos: { col: 1.8, row: 4.9 }, from: 'left' },
        { at: 1650, tipo: 'appear', actor: 'p27', pos: { col: 1.8, row: 6.8 }, from: 'left' },
        { at: 1900, tipo: 'note', text: 'Genes de fase S apagados', near: 'genS', side: 'bottom' },
      ],
    },
    {
      id: 'r1',
      orden: 1,
      titulo: 'Llega la señal mitogénica',
      tarjeta: 'Un factor de crecimiento se une a su receptor tirosina cinasa, que dimeriza y activa a RAS.',
      texto:
        'Un factor de crecimiento se une a su receptor en la membrana. El receptor se autofosforila y enciende a RAS.',
      profundiza:
        'La unión del ligando dimeriza el receptor tirosina cinasa (RTK); cada monómero fosforila tirosinas del otro. Esas fosfotirosinas reclutan al adaptador GRB2 y al intercambiador SOS, que cambia GDP por GTP en RAS (anclado a la membrana por farnesilación). RAS-GTP es la forma activa.',
      clinica:
        'Mutaciones activadoras de KRAS (páncreas, colon, pulmón) dejan a RAS encendido sin necesidad de factor de crecimiento: la célula recibe una señal proliferativa constante.',
      protagonistas: ['fc', 'rtk', 'ras'],
      acciones: [
        { at: 0, tipo: 'camera', box: { col: 2, row: 0, w: 9, h: 4.5 } },
        { at: 100, tipo: 'appear', actor: 'rtk', pos: { col: 5, row: 1.1 }, from: 'fade' },
        { at: 400, tipo: 'enter', actor: 'fc', from: 'top', to: { col: 5, row: 0.5 } },
        // Antes `targetAnchor: 'top'`.
        { at: 1200, tipo: 'bind', actor: 'fc', target: 'rtk', offset: { col: 0, row: -0.55 } },
        { at: 1900, tipo: 'phosphorylate', kinase: 'rtk', target: 'rtk', site: 'p1', label: 'pY' },
        { at: 2100, tipo: 'activate', actor: 'rtk' },
        { at: 2400, tipo: 'appear', actor: 'ras', pos: { col: 6.4, row: 2.2 }, from: 'grow' },
        { at: 2700, tipo: 'connect', id: 'rtk-ras', from: 'rtk', to: 'ras', type: 'activa' },
        { at: 3000, tipo: 'activate', actor: 'ras' },
      ],
    },
    {
      id: 'r2',
      orden: 2,
      titulo: 'RAS → MAPK → MYC: se transcribe la ciclina D',
      tarjeta: 'RAS activa la cascada RAF–MEK–ERK; ERK induce MYC y se transcribe el gen de la ciclina D.',
      texto:
        'RAS enciende la cascada RAF, MEK y ERK. ERK entra al núcleo, induce a MYC y se transcribe la ciclina D.',
      profundiza:
        'ERK fosforilado se transloca al núcleo y activa factores de genes de respuesta temprana (FOS, JUN/AP-1, ETS) y MYC. MYC dimeriza con MAX y, junto con AP-1, activa la transcripción de CCND1 (ciclina D1). La ciclina D es el sensor de mitógenos: su nivel depende de que la señal persista.',
      clinica:
        'La translocación t(8;14) pone MYC bajo el promotor de las inmunoglobulinas (linfoma de Burkitt): exceso de MYC y proliferación descontrolada.',
      protagonistas: ['mapk', 'myc', 'genD', 'cicD'],
      acciones: [
        { at: 0, tipo: 'camera', box: 'all' },
        { at: 200, tipo: 'appear', actor: 'mapk', pos: { col: 8.6, row: 2.8 }, from: 'grow' },
        { at: 500, tipo: 'connect', id: 'ras-mapk', from: 'ras', to: 'mapk', type: 'activa' },
        { at: 800, tipo: 'pulse_signal', from: 'ras', to: 'mapk' },
        { at: 1100, tipo: 'appear', actor: 'genD', pos: { col: 13.3, row: 6 }, from: 'fade' },
        { at: 1300, tipo: 'appear', actor: 'myc', pos: { col: 13.3, row: 5.2 }, from: 'grow' },
        { at: 1500, tipo: 'connect', id: 'mapk-myc', from: 'mapk', to: 'myc', type: 'activa', label: 'ERK entra al núcleo' },
        { at: 1900, tipo: 'transcribe', tf: 'myc', gene: 'genD', product: 'cicD', productPos: { col: 5.8, row: 3.4 } },
        { at: 3400, tipo: 'note', text: 'El ARNm sale y se traduce en el citoplasma', near: 'cicD', side: 'top' },
      ],
    },
    {
      id: 'r3',
      orden: 3,
      titulo: 'PI3K–AKT estabiliza la ciclina D',
      tarjeta: 'PI3K–AKT inhibe a GSK3β, que dejaría de marcar a la ciclina D para su degradación.',
      texto:
        'En paralelo, PI3K activa a AKT, que apaga a GSK3β. Sin GSK3β activa, la ciclina D no se degrada y se acumula.',
      profundiza:
        'GSK3β fosforila la ciclina D1 en Thr286, lo que provoca su exportación nuclear y ubiquitinación. AKT fosforila e inhibe a GSK3β, de modo que la ciclina D se estabiliza. AKT también activa mTOR (más traducción de ciclina D) y promueve la salida de p27 del núcleo.',
      protagonistas: ['pi3k', 'akt', 'gsk3b', 'cicD'],
      acciones: [
        { at: 0, tipo: 'appear', actor: 'pi3k', pos: { col: 3.1, row: 2.3 }, from: 'grow' },
        { at: 250, tipo: 'connect', id: 'rtk-pi3k', from: 'rtk', to: 'pi3k', type: 'activa' },
        { at: 600, tipo: 'appear', actor: 'akt', pos: { col: 3.1, row: 3.4 }, from: 'grow' },
        { at: 850, tipo: 'connect', id: 'pi3k-akt', from: 'pi3k', to: 'akt', type: 'activa' },
        { at: 1100, tipo: 'appear', actor: 'gsk3b', pos: { col: 1.4, row: 3.1 }, from: 'fade' },
        { at: 1400, tipo: 'phosphorylate', kinase: 'akt', target: 'gsk3b', site: 'p1', label: 'S9' },
        { at: 1800, tipo: 'inhibit', inhibitor: 'akt', target: 'gsk3b' },
        { at: 2200, tipo: 'note', text: 'Ciclina D estable', near: 'cicD', side: 'right' },
        { at: 2300, tipo: 'activate', actor: 'cicD' },
      ],
    },
    {
      id: 'r4',
      orden: 4,
      titulo: 'Se forma ciclina D–CDK4/6',
      tarjeta: 'La ciclina D se une a CDK4/6, el complejo se activa y entra al núcleo.',
      texto: 'La ciclina D encaja en CDK4/6 y forma el primer motor activo del ciclo, que entra al núcleo.',
      profundiza:
        'La unión de la ciclina D abre el sitio activo de CDK4/6; la CAK (CDK7–ciclina H) añade la fosforilación activadora en el bucle T. Paradójicamente, p21 y p27 ayudan a ensamblar e importar al núcleo el complejo ciclina D–CDK4 sin inhibirlo, lo que los retira de CDK2 (efecto de titulación). p16^INK4a compite: se une a CDK4/6 e impide la unión de la ciclina D.',
      clinica:
        'Los inhibidores de CDK4/6 (palbociclib, ribociclib, abemaciclib) se usan en cáncer de mama con receptores hormonales positivos. Amplificación de CDK4 en liposarcoma; sobreexpresión de ciclina D1 por t(11;14) en linfoma de células del manto.',
      protagonistas: ['cicD', 'cdk4', 'p16'],
      acciones: [
        { at: 0, tipo: 'appear', actor: 'cdk4', pos: { col: 7, row: 3.3 }, from: 'grow' },
        // Antes `anchor: 'dock'`: la ciclina entra por la hendidura (izquierda) de la CDK.
        { at: 400, tipo: 'bind', actor: 'cicD', target: 'cdk4', lado: 'izq' },
        { at: 1150, tipo: 'activate', actor: 'cdk4' },
        { at: 1400, tipo: 'translocate', actor: 'cdk4', to: { col: 6.1, row: 4.9 }, compartment: 'nucleo' },
        { at: 2300, tipo: 'connect', id: 'p16-cdk4', from: 'p16', to: 'cdk4', type: 'inhibe' },
        { at: 2400, tipo: 'note', text: 'p16 compite por CDK4/6', near: 'p16', side: 'top' },
      ],
    },
    {
      id: 'r5',
      orden: 5,
      titulo: 'Primera fosforilación de RB',
      tarjeta: 'Ciclina D–CDK4/6 fosforila a RB (primera fosforilación) y E2F se libera parcialmente.',
      texto: 'Ciclina D–CDK4/6 fosforila a RB. RB suelta parcialmente a E2F, que empieza a transcribir algunos genes.',
      profundiza:
        'Ciclina D–CDK4/6 monofosforila RB (una de sus ~14 posiciones posibles). RB monofosforilado aún reprime parte de sus dianas, pero su afinidad por E2F baja lo suficiente para que se transcriban genes clave como CCNE1 (ciclina E), CDC25A y el propio E2F1.',
      protagonistas: ['cdk4', 'rb', 'e2f'],
      acciones: [
        { at: 0, tipo: 'camera', box: { col: 4, row: 4, w: 8, h: 5 } },
        { at: 200, tipo: 'move', actor: 'cdk4', to: { col: 6.4, row: 5.3 } },
        { at: 900, tipo: 'phosphorylate', kinase: 'cdk4', target: 'rb', site: 'p1' },
        { at: 1500, tipo: 'release', actor: 'e2f', from: 'rb', to: { col: 8.6, row: 6.7 }, duration: 500 },
        { at: 2000, tipo: 'disconnect', id: 'rb-e2f' },
        { at: 2000, tipo: 'note', text: 'Liberación parcial de E2F', near: 'e2f', side: 'right' },
      ],
    },
    {
      id: 'r6',
      orden: 6,
      titulo: 'E2F transcribe la ciclina E',
      tarjeta: 'E2F transcribe la ciclina E, que se une a CDK2.',
      texto: 'E2F activa el gen de la ciclina E. La ciclina E se une a CDK2 y forma el segundo motor.',
      profundiza:
        'La ciclina E–CDK2 es inicialmente frenada por p27. A medida que se acumula, supera la inhibición: la ciclina D–CDK4 ha secuestrado parte de p27 y la propia CDK2 comenzará a eliminar el resto.',
      protagonistas: ['e2f', 'cicE', 'cdk2'],
      acciones: [
        { at: 0, tipo: 'transcribe', tf: 'e2f', gene: 'genS', product: 'cicE', productPos: { col: 10.3, row: 6.3 } },
        { at: 1500, tipo: 'appear', actor: 'cdk2', pos: { col: 11.3, row: 7.5 }, from: 'grow' },
        { at: 1800, tipo: 'bind', actor: 'cicE', target: 'cdk2', lado: 'izq' },
        { at: 2400, tipo: 'connect', id: 'p27-cdk2', from: 'p27', to: 'cdk2', type: 'inhibe', curve: 0.45 },
      ],
    },
    {
      id: 'r7',
      orden: 7,
      titulo: 'Bucle de retroalimentación positiva',
      tarjeta: 'Ciclina E–CDK2 hiperfosforila a RB y degrada a p27: bucle positivo e irreversible.',
      texto:
        'Ciclina E–CDK2 hiperfosforila RB, que libera por completo a E2F; E2F produce más ciclina E. Además, CDK2 elimina a p27.',
      profundiza:
        'CDK2 fosforila a p27 en Thr187, lo que permite que la ligasa SCF–Skp2 lo ubiquitine y lo envíe al proteasoma. Así desaparece el freno de CDK2. La hiperfosforilación de RB libera todo el E2F, que induce más ciclina E: un bucle de retroalimentación positiva que convierte una señal gradual en una decisión de todo o nada. CDK2 también contribuye a inactivar APC/C–Cdh1 (junto con Emi1), lo que permite que las ciclinas se acumulen.',
      protagonistas: ['cdk2', 'rb', 'p27', 'scf'],
      acciones: [
        { at: 0, tipo: 'phosphorylate', kinase: 'cdk2', target: 'rb', site: 'p2' },
        { at: 450, tipo: 'phosphorylate', kinase: 'cdk2', target: 'rb', site: 'p3' },
        { at: 900, tipo: 'phosphorylate', kinase: 'cdk2', target: 'rb', site: 'p4' },
        { at: 1300, tipo: 'release_inhibition', actor: 'genS' },
        { at: 1400, tipo: 'feedback_loop', from: 'e2f', to: 'cicE', sign: '+', cycles: 3 },
        { at: 1600, tipo: 'phosphorylate', kinase: 'cdk2', target: 'p27', site: 'p1', label: 'T187' },
        { at: 2100, tipo: 'appear', actor: 'scf', pos: { col: 3.4, row: 8.2 }, from: 'fade' },
        { at: 2300, tipo: 'ubiquitinate', ligase: 'scf', target: 'p27' },
        { at: 2800, tipo: 'appear', actor: 'prot', pos: { col: 14, row: 8.6 }, from: 'fade' },
        { at: 3000, tipo: 'disconnect', id: 'p27-cdk2' },
        { at: 3000, tipo: 'degrade', target: 'p27' },
        { at: 3600, tipo: 'activate', actor: 'cdk2' },
      ],
    },
    {
      id: 'r8',
      orden: 8,
      titulo: 'Punto de no retorno: hacia la fase S',
      tarjeta: 'E2F libre activa los genes de fase S y la célula ya no depende de los mitógenos.',
      texto:
        'E2F libre enciende los genes de la replicación. La célula cruza el punto de restricción: continuará aunque desaparezcan los factores de crecimiento.',
      profundiza:
        'Dianas de E2F: ciclina A, CDC6, CDT1 y componentes del complejo MCM (licencia de orígenes), ADN polimerasa α, PCNA, timidina cinasa, dihidrofolato reductasa y ribonucleótido reductasa. Desde aquí, la ciclina E–CDK2 y luego la ciclina A–CDK2 sostienen la progresión independientemente de la ciclina D.',
      clinica:
        'La pérdida de RB (retinoblastoma hereditario por doble golpe de Knudson, osteosarcoma) o su secuestro por la oncoproteína E7 del VPH elimina este control. La deleción de CDKN2A (p16) es frecuente en melanoma familiar, cáncer de páncreas y glioblastoma.',
      protagonistas: ['e2f', 'cicA', 'cdc6', 'cdt1'],
      acciones: [
        { at: 0, tipo: 'transcribe', tf: 'e2f', gene: 'genS', product: 'cicA', productPos: { col: 5.2, row: 8.3 } },
        { at: 700, tipo: 'appear', actor: 'cdc6', pos: { col: 7.8, row: 8.6 }, from: 'grow' },
        { at: 950, tipo: 'appear', actor: 'cdt1', pos: { col: 9.3, row: 8.55 }, from: 'grow' },
        { at: 1400, tipo: 'outcome', kind: 'fase_s', pos: { col: 11.7, row: 9.35 } },
        { at: 1600, tipo: 'note', text: 'Punto de no retorno', near: 'cdk2', side: 'top', persist: true },
      ],
    },
  ],
  distractores: [
    {
      id: 'rd1',
      tarjeta: 'p14ARF se une a CDK4 e impide la fosforilación de RB.',
      porQueEsFalso:
        'p14ARF no inhibe CDK: secuestra a MDM2 y así estabiliza p53. El inhibidor directo de CDK4/6 es p16INK4a.',
    },
    {
      id: 'rd2',
      tarjeta: 'RB hiperfosforilado se une con más fuerza a E2F y reprime los genes de fase S.',
      porQueEsFalso:
        'Es al revés: RB reprime a E2F cuando está hipofosforilado. La hiperfosforilación lo inactiva y libera a E2F.',
    },
    {
      id: 'rd3',
      tarjeta: 'p53 fosforila a RB para iniciar la fase S.',
      porQueEsFalso:
        'p53 es un factor de transcripción, no una cinasa; su efecto en G1 es frenar el ciclo induciendo p21.',
    },
  ],
  // Mismo contenido que la sección 12.1; las opciones incorrectas se
  // reescribieron para que la correcta no destaque por su longitud.
  preguntas: [
    {
      id: 'rq1',
      enunciado:
        'Un paciente tiene un tumor con deleción homocigota de CDKN2A. ¿Qué complejo queda sin su inhibidor específico?',
      opciones: ['Ciclina A–CDK2', 'Complejo APC/C–Cdc20', 'Ciclina D–CDK4/6', 'Ciclina B–CDK1'],
      correcta: 2,
      explicacion:
        'CDKN2A codifica p16^INK4a, inhibidor específico de CDK4/6; su pérdida deja a RB fosforilado de forma constitutiva. (También se pierde p14^ARF, lo que debilita la vía p53.)',
      pasoRelacionado: 'r4',
    },
    {
      id: 'rq2',
      enunciado: '¿Por qué el punto de restricción es irreversible una vez cruzado?',
      opciones: [
        'Porque p53 se degrada en el proteasoma y deja de frenar el ciclo',
        'Porque la ciclina D deja de sintetizarse y ya no hay vuelta atrás',
        'Por el bucle E2F → ciclina E → CDK2 → RB-P y la degradación de p27',
        'Porque RB se transloca al citoplasma y ya no alcanza a E2F en el núcleo',
      ],
      correcta: 2,
      explicacion:
        'El bucle E2F → ciclina E → CDK2 → RB-P → E2F y la degradación de p27 convierten la decisión en todo o nada.',
      pasoRelacionado: 'r7',
    },
    {
      id: 'rq3',
      enunciado: 'La oncoproteína E7 del VPH de alto riesgo favorece la proliferación porque:',
      opciones: [
        'Degrada a p53 mediante la ligasa E6AP',
        'Se une a RB y libera a E2F',
        'Activa directamente a CDK1',
        'Inhibe a p16 y deja libre a CDK4/6',
      ],
      correcta: 1,
      explicacion: 'E7 ocupa el bolsillo de RB; E6 (no E7) degrada p53.',
      pasoRelacionado: 'r8',
    },
    {
      id: 'rq4',
      enunciado: '¿En qué fase detiene a las células un fármaco inhibidor de CDK4/6 (palbociclib)?',
      opciones: ['En G2', 'En mitosis', 'En fase S', 'En G1'],
      correcta: 3,
      explicacion: 'Sin actividad CDK4/6, RB permanece hipofosforilado y E2F reprimido.',
      pasoRelacionado: 'r4',
    },
    {
      id: 'rq5',
      enunciado: '¿Qué efecto tiene AKT sobre la ciclina D?',
      opciones: [
        'La marca para su degradación en el proteasoma',
        'La transcribe directamente en el núcleo',
        'La exporta al citoplasma',
        'La estabiliza al inhibir a GSK3β',
      ],
      correcta: 3,
      explicacion: 'GSK3β fosforila ciclina D1 en Thr286 marcándola para degradación; AKT inhibe a GSK3β.',
      pasoRelacionado: 'r3',
    },
  ],
};

export default checkpoint;
