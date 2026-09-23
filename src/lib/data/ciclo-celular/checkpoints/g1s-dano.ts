import type { Checkpoint } from '../tipos';

// Control G1/S por daño al ADN. Fuente: sección 12.2 del prompt maestro.
//
// Las posiciones sugeridas en la sección chocaban entre sí (ATR encima de RB,
// el tetrámero de p53 sobre E2F…); se redistribuyeron respetando las zonas
// semánticas: RB–E2F y p21 a la izquierda (frenos), ATM/ATR/Chk/p53/MDM2 a la
// derecha (sensores), ciclina E–CDK2 al centro, ADN y desenlaces abajo.
//
// El paso lateral de p14ARF (g5b) es una vía alternativa SIN daño: por eso
// g6 parte del estado de g5 (`base: 'g5'`) y no del final del lateral.

const checkpoint: Checkpoint = {
  id: 'g1s_dano',
  nombre: 'Control G1/S por daño al ADN',
  nombreCorto: 'G1/S',
  fase: 'G1/S',
  pregunta: '¿El ADN está dañado antes de copiarlo? Decide p53–p21.',
  resumen:
    'El daño activa ATM/ATR y Chk2/Chk1. En minutos, la degradación de Cdc25A frena a CDK2; en horas, p53 estabilizado induce p21, que mantiene a RB hipofosforilado. Si el daño se repara, el ciclo continúa; si no, apoptosis o senescencia.',
  compartimentos: { nucleo: { top: 1.8 }, nucleolo: { col: 13.8, row: 2.2 } },
  actores: {
    adn: { img: 'adn_helice', label: 'ADN', compartment: 'nucleo', escala: 1.15, tira: 6.2 },
    rad: { img: 'radiacion', label: 'Radiación ionizante', compartment: 'nucleo' },
    mrn: { img: 'mrn', label: 'MRN', compartment: 'nucleo' },
    atm: { img: 'atm', label: 'ATM', compartment: 'nucleo' },
    rpa: { img: 'rpa', label: 'RPA', compartment: 'nucleo' },
    atr: { img: 'atr_atrip', label: 'ATR–ATRIP', compartment: 'nucleo' },
    chk2: { img: 'chk2', label: 'Chk2', compartment: 'nucleo' },
    chk1: { img: 'chk1', label: 'Chk1', compartment: 'nucleo' },
    cdc25a: { img: 'cdc25', label: 'Cdc25A', compartment: 'nucleo' },
    scfb: { img: 'e3_ligasa_scf', label: 'SCF–βTrCP', compartment: 'nucleo' },
    prot: { img: 'proteasoma', label: 'Proteasoma', compartment: 'nucleo' },
    p53: { img: 'p53_monomero', label: 'p53', compartment: 'nucleo' },
    // Copias que llegan al estabilizarse p53 (se funden en el tetrámero).
    p53b: { img: 'p53_monomero', label: 'p53', info: 'p53_monomero', compartment: 'nucleo' },
    p53c: { img: 'p53_monomero', label: 'p53', info: 'p53_monomero', compartment: 'nucleo' },
    p53d: { img: 'p53_monomero', label: 'p53', info: 'p53_monomero', compartment: 'nucleo' },
    mdm2: { img: 'mdm2', label: 'MDM2', compartment: 'nucleo' },
    // MDM2 recién transcrito por p53 (retroalimentación negativa del paso 9).
    mdm2b: { img: 'mdm2', label: 'MDM2 (nuevo)', info: 'mdm2', compartment: 'nucleo' },
    p21: { img: 'p21', label: 'p21', compartment: 'nucleo' },
    cicE: { img: 'ciclina_e', label: 'Ciclina E', compartment: 'nucleo' },
    cdk2: { img: 'cdk2', label: 'CDK2', compartment: 'nucleo' },
    rb: { img: 'rb', label: 'RB', compartment: 'nucleo' },
    e2f: { img: 'e2f_dp1', label: 'E2F–DP1', compartment: 'nucleo' },
    gadd45: { img: 'gadd45', label: 'GADD45', compartment: 'nucleo' },
    wip1: { img: 'wip1', label: 'Wip1', compartment: 'nucleo' },
    p14: { img: 'p14arf', label: 'p14<sup>ARF</sup>', compartment: 'nucleolo' },
    bax: { img: 'bax', label: 'BAX', compartment: 'mitocondria' },
    puma: { img: 'puma_noxa', label: 'PUMA / NOXA', compartment: 'citoplasma' },
    mito: { img: 'mitocondria_citocromo_c', label: 'Mitocondria · citocromo c', compartment: 'citoplasma' },
    celApo: { img: 'celula_apoptotica', label: 'Apoptosis' },
    celSen: { img: 'celula_senescente', label: 'Senescencia' },
    celNor: { img: 'celula_normal', label: 'El ciclo continúa' },
  },
  pasos: [
    {
      id: 'g0',
      orden: 0,
      titulo: 'La célula está a punto de replicar',
      texto:
        'La célula está al final de G1. Ciclina E–CDK2 está lista para iniciar la fase S. Si el ADN se copiara dañado, el error pasaría a las células hijas.',
      profundiza:
        'En condiciones basales p53 tiene una vida media de minutos: MDM2, una ubiquitina ligasa E3, se une a su dominio de transactivación, lo ubiquitina y lo envía al proteasoma. Por eso casi no hay p53 en una célula sana.',
      protagonistas: ['cdk2', 'p53', 'mdm2'],
      acciones: [
        { at: 0, tipo: 'appear', actor: 'adn', pos: { col: 6.5, row: 7.6 }, from: 'fade' },
        { at: 250, tipo: 'appear', actor: 'cdk2', pos: { col: 5.6, row: 3.6 }, from: 'grow' },
        { at: 500, tipo: 'appear', actor: 'cicE', pos: { col: 4.2, row: 3.4 }, from: 'grow' },
        { at: 850, tipo: 'bind', actor: 'cicE', target: 'cdk2', lado: 'izq' },
        { at: 1500, tipo: 'activate', actor: 'cdk2' },
        { at: 1800, tipo: 'appear', actor: 'e2f', pos: { col: 2.2, row: 7.5 }, from: 'grow' },
        { at: 2050, tipo: 'appear', actor: 'rb', pos: { col: 1.6, row: 6.2 }, from: 'grow' },
        // RB ya parcialmente fosforilado al final de G1.
        { at: 2400, tipo: 'phosphorylate', kinase: 'cdk2', target: 'rb', site: 'p1' },
        { at: 2750, tipo: 'phosphorylate', kinase: 'cdk2', target: 'rb', site: 'p2' },
        { at: 3100, tipo: 'appear', actor: 'p53', pos: { col: 12.6, row: 4.2 }, from: 'grow' },
        { at: 3350, tipo: 'appear', actor: 'mdm2', pos: { col: 13.8, row: 4.2 }, from: 'grow' },
        // Antes `anchor: 'bolsillo'`: p53 encaja en el bolsillo de MDM2.
        { at: 3650, tipo: 'bind', actor: 'mdm2', target: 'p53', lado: 'der' },
        { at: 4300, tipo: 'appear', actor: 'prot', pos: { col: 14, row: 8.6 }, from: 'fade' },
        // REVISAR: «bucle tenue» de ubiquitinación sin degradar. El contrato no
        // tiene primitiva para retirar la ubiquitina, así que la cadena queda
        // visible sobre p53 en los pasos siguientes.
        { at: 4600, tipo: 'ubiquitinate', ligase: 'mdm2', target: 'p53' },
        { at: 5300, tipo: 'note', text: 'p53 casi indetectable', near: 'p53', side: 'top' },
      ],
    },
    {
      id: 'g1',
      orden: 1,
      titulo: 'El ADN se daña',
      tarjeta: 'La radiación ionizante produce roturas de doble cadena en el ADN.',
      texto:
        'La radiación ionizante rompe ambas cadenas del ADN. Es la lesión más peligrosa: si no se repara, se pierden fragmentos de cromosoma.',
      profundiza:
        'La radiación ionizante genera radicales libres (sobre todo por radiólisis del agua) y roturas de doble cadena. La luz UV, en cambio, forma dímeros de pirimidina que bloquean la replicación y exponen ADN de cadena simple (eje ATR). Los agentes alquilantes y el estrés replicativo también activan esta respuesta.',
      clinica:
        'La radioterapia y muchos quimioterápicos funcionan provocando daño que activa esta vía; las células con p53 funcional tienden a detenerse o morir por apoptosis.',
      protagonistas: ['rad', 'adn'],
      acciones: [
        { at: 0, tipo: 'camera', box: { col: 1, row: 4.5, w: 9, h: 5.5 } },
        { at: 200, tipo: 'enter', actor: 'rad', from: 'left', to: { col: 4.2, row: 5.6 } },
        { at: 1100, tipo: 'damage', agent: 'radiacion', target: 'adn', kind: 'doble' },
        { at: 2200, tipo: 'note', text: 'Rotura de doble cadena', near: 'adn', side: 'bottom' },
      ],
    },
    {
      id: 'g2',
      orden: 2,
      titulo: 'Sensores: MRN recluta y activa ATM',
      tarjeta: 'El complejo MRN reconoce los extremos rotos y recluta y activa a ATM.',
      texto: 'El complejo MRN detecta los extremos rotos del ADN y recluta a la cinasa ATM, que se activa.',
      profundiza:
        'MRN = MRE11 (nucleasa), RAD50 (brazos que mantienen juntos los extremos) y NBS1 (recluta ATM). ATM existe como dímero inactivo; al llegar al daño se autofosforila en Ser1981 y se disocia en monómeros activos. ATM fosforila la histona H2AX (γH2AX, Ser139) en megabases alrededor de la rotura; MDC1 se une a γH2AX y recluta más MRN y ATM: amplificación en «focos» de daño. Si el daño expone ADN de cadena simple (UV, horquillas detenidas), RPA lo recubre y recluta ATR–ATRIP (ver checkpoint intra-S).',
      clinica:
        'Mutaciones de ATM causan ataxia-telangiectasia (ataxia cerebelosa, telangiectasias, inmunodeficiencia, gran sensibilidad a la radiación y riesgo de linfoma). Mutaciones de NBS1 causan el síndrome de rotura de Nijmegen.',
      protagonistas: ['mrn', 'atm'],
      acciones: [
        // La radiación ya hizo su trabajo: se retira para despejar la zona.
        { at: 0, tipo: 'hide', actor: 'rad' },
        { at: 200, tipo: 'appear', actor: 'mrn', pos: { col: 6.5, row: 6.4 }, from: 'grow' },
        { at: 550, tipo: 'bind', actor: 'mrn', target: 'adn', lado: 'encima' },
        { at: 1300, tipo: 'appear', actor: 'atm', pos: { col: 7.8, row: 5.8 }, from: 'grow' },
        { at: 1600, tipo: 'connect', id: 'mrn-atm', from: 'mrn', to: 'atm', type: 'activa' },
        { at: 1950, tipo: 'phosphorylate', kinase: 'atm', target: 'atm', site: 'p1', label: 'S1981' },
        { at: 2400, tipo: 'activate', actor: 'atm' },
        // Rama opcional (eje ATR), en segundo plano.
        { at: 2800, tipo: 'appear', actor: 'rpa', pos: { col: 9.95, row: 7.8 }, from: 'fade' },
        { at: 3100, tipo: 'appear', actor: 'atr', pos: { col: 10.9, row: 6.95 }, from: 'fade' },
        { at: 3400, tipo: 'connect', id: 'rpa-atr', from: 'rpa', to: 'atr', type: 'activa' },
        { at: 3700, tipo: 'note', text: 'Si hay ADN de cadena simple: RPA → ATR', near: 'atr', side: 'right' },
      ],
    },
    {
      id: 'g3',
      orden: 3,
      titulo: 'Transductores: ATM activa Chk2 (y ATR a Chk1)',
      tarjeta: 'ATM fosforila y activa a Chk2; ATR activa a Chk1.',
      texto: 'ATM fosforila a la cinasa Chk2, que difunde por el núcleo y lleva la señal de alarma a sus dianas.',
      profundiza:
        'ATM fosforila Chk2 en Thr68, lo que induce su dimerización y autoactivación. Chk2 y Chk1 son cinasas difusibles: no se quedan en el sitio del daño, sino que viajan por el nucleoplasma y fosforilan efectores como Cdc25A y p53.',
      protagonistas: ['atm', 'chk2', 'atr', 'chk1'],
      acciones: [
        { at: 0, tipo: 'appear', actor: 'chk2', pos: { col: 9.4, row: 5 }, from: 'grow' },
        { at: 300, tipo: 'connect', id: 'atm-chk2', from: 'atm', to: 'chk2', type: 'activa' },
        { at: 650, tipo: 'phosphorylate', kinase: 'atm', target: 'chk2', site: 'p1', label: 'T68' },
        { at: 1100, tipo: 'activate', actor: 'chk2' },
        { at: 1400, tipo: 'pulse_signal', from: 'atm', to: 'chk2' },
        { at: 1900, tipo: 'appear', actor: 'chk1', pos: { col: 12.7, row: 6.3 }, from: 'fade' },
        { at: 2200, tipo: 'connect', id: 'atr-chk1', from: 'atr', to: 'chk1', type: 'activa' },
      ],
    },
    {
      id: 'g4',
      orden: 4,
      titulo: 'Frenado inmediato: Cdc25A se degrada',
      tarjeta: 'Chk2/Chk1 fosforilan a Cdc25A, que se degrada: CDK2 queda con sus fosfatos inhibidores.',
      texto:
        'La primera respuesta es inmediata: Chk2 marca a la fosfatasa Cdc25A para su destrucción. Sin Cdc25A, CDK2 no puede activarse del todo y la entrada en S se frena en minutos.',
      profundiza:
        'Cdc25A normalmente retira los fosfatos inhibidores Thr14/Tyr15 de CDK2. Fosforilada por Chk1/Chk2, Cdc25A es reconocida por la ligasa SCF–βTrCP, ubiquitinada y degradada. Esta rama no requiere transcripción, por eso actúa en minutos, pero es transitoria.',
      protagonistas: ['chk2', 'cdc25a', 'scfb', 'cdk2'],
      acciones: [
        { at: 0, tipo: 'appear', actor: 'cdc25a', pos: { col: 8.2, row: 3 }, from: 'grow' },
        // Conector provisional: se retira al degradarse Cdc25A.
        { at: 300, tipo: 'connect', id: 'cdc25a-cdk2', from: 'cdc25a', to: 'cdk2', type: 'activa' },
        { at: 700, tipo: 'phosphorylate', kinase: 'chk2', target: 'cdc25a', site: 'p1' },
        { at: 1100, tipo: 'appear', actor: 'scfb', pos: { col: 10.2, row: 2.6 }, from: 'fade' },
        { at: 1400, tipo: 'ubiquitinate', ligase: 'scfb', target: 'cdc25a' },
        { at: 2100, tipo: 'disconnect', id: 'cdc25a-cdk2' },
        { at: 2100, tipo: 'degrade', target: 'cdc25a' },
        // REVISAR: los fosfatos T14/Y15 los pusieron Wee1/Myt1 (que no están en
        // esta escena); el contrato no tiene «fosfato sin cinasa», así que se
        // pintan como fosforilación de CDK2 sobre sí misma. El motor debería
        // tratarlo como simple aparición del fosfato.
        { at: 3300, tipo: 'phosphorylate', kinase: 'cdk2', target: 'cdk2', site: 'p2', label: 'T14/Y15' },
        // Desaturación de CDK2: la inhibe indirectamente la rama Chk2 → Cdc25A.
        { at: 3700, tipo: 'inhibit', inhibitor: 'chk2', target: 'cdk2', conector: false },
        { at: 4000, tipo: 'note', text: 'Freno rápido (minutos)', near: 'cdk2', side: 'top' },
      ],
    },
    {
      id: 'g5',
      orden: 5,
      titulo: 'p53 se libera de MDM2',
      tarjeta: 'ATM y Chk2 fosforilan a p53 y a MDM2: se rompe su unión y p53 deja de degradarse.',
      texto:
        'ATM y Chk2 fosforilan a p53 y a MDM2. MDM2 ya no puede sujetar a p53, que deja de ser destruido.',
      profundiza:
        'ATM (y ATR) fosforilan p53 en Ser15; Chk2 (y Chk1) en Ser20. Estas fosforilaciones están en el dominio de transactivación, justo donde se une MDM2, y bloquean la interacción. ATM además fosforila MDM2 (Ser395), reduciendo su actividad ligasa. Los coactivadores p300/CBP acetilan a p53, lo que refuerza su estabilidad y su unión al ADN.',
      clinica:
        'La amplificación de MDM2 (frecuente en liposarcomas y otros sarcomas) inactiva p53 sin mutarlo. La oncoproteína E6 del VPH degrada p53 a través de la ligasa E6AP.',
      protagonistas: ['atm', 'chk2', 'p53', 'mdm2'],
      acciones: [
        // Encuadre más ancho que el sugerido (10,3,6,4): ATM quedó al centro.
        { at: 0, tipo: 'camera', box: { col: 6.5, row: 2.5, w: 9.5, h: 5.5 } },
        { at: 400, tipo: 'phosphorylate', kinase: 'atm', target: 'p53', site: 'p1', label: 'S15' },
        { at: 900, tipo: 'phosphorylate', kinase: 'chk2', target: 'p53', site: 'p2', label: 'S20' },
        { at: 1400, tipo: 'phosphorylate', kinase: 'atm', target: 'mdm2', site: 'p1', label: 'S395' },
        { at: 1900, tipo: 'release', actor: 'mdm2', from: 'p53', to: { col: 14.8, row: 6.2 } },
        { at: 2600, tipo: 'inhibit', inhibitor: 'atm', target: 'mdm2', conector: false },
        { at: 3000, tipo: 'camera', box: 'all' },
      ],
    },
    {
      id: 'g5b',
      orden: 5.5,
      lateral: 'Vía alternativa de activación de p53',
      titulo: 'p14ARF y el estrés oncogénico',
      tarjeta: 'Ante oncogenes hiperactivos (MYC, E2F), p14ARF secuestra a MDM2 en el nucléolo y estabiliza p53.',
      texto:
        'p53 también se activa sin daño al ADN: si un oncogén empuja la proliferación en exceso, se induce p14ARF, que secuestra a MDM2 en el nucléolo.',
      profundiza:
        'E2F1 y MYC hiperactivos inducen la transcripción de ARF desde el locus CDKN2A (marco de lectura alternativo al de p16). p14^ARF se une a MDM2 y lo retiene en el nucléolo; p53 queda libre en el nucleoplasma. Es una barrera anticancerosa: por eso la deleción de CDKN2A inactiva a la vez la vía RB (p16) y la vía p53 (ARF).',
      protagonistas: ['p14', 'mdm2'],
      acciones: [
        { at: 0, tipo: 'appear', actor: 'p14', pos: { col: 13.8, row: 2.2 }, from: 'grow' },
        { at: 500, tipo: 'sequester', actor: 'p14', target: 'mdm2', to: { col: 13.8, row: 2.4 } },
        { at: 1600, tipo: 'inhibit', inhibitor: 'p14', target: 'mdm2' },
        { at: 2000, tipo: 'note', text: 'Secuestrado en el nucléolo', near: 'mdm2', side: 'left' },
      ],
    },
    {
      id: 'g6',
      orden: 6,
      base: 'g5',
      titulo: 'p53 se estabiliza y actúa como factor de transcripción',
      tarjeta: 'p53 estabilizado se acumula, forma tetrámeros y se une al ADN como factor de transcripción.',
      texto:
        'Libre de MDM2, p53 se acumula en minutos a horas, se ensambla en tetrámeros y se une al ADN para encender sus genes diana.',
      profundiza:
        'p53 se une como tetrámero a elementos de respuesta en los promotores de sus dianas. Qué genes activa depende de la intensidad y duración del daño, de modificaciones postraduccionales y de cofactores: daño leve favorece detención y reparación; daño intenso o persistente favorece apoptosis.',
      clinica:
        'TP53 es el gen más frecuentemente mutado en el cáncer humano (alrededor de la mitad de los tumores). Su mutación germinal causa el síndrome de Li-Fraumeni (sarcomas, cáncer de mama, tumores cerebrales, leucemias, carcinoma suprarrenal a edad temprana).',
      protagonistas: ['p53'],
      acciones: [
        { at: 0, tipo: 'appear', actor: 'p53b', pos: { col: 14.9, row: 2.8 }, from: 'right' },
        { at: 300, tipo: 'appear', actor: 'p53c', pos: { col: 15, row: 4.6 }, from: 'right' },
        { at: 600, tipo: 'appear', actor: 'p53d', pos: { col: 12.4, row: 2.2 }, from: 'top' },
        { at: 1100, tipo: 'merge', actors: ['p53', 'p53b', 'p53c', 'p53d'], into: 'p53', pos: { col: 12.6, row: 4.2 } },
        { at: 2000, tipo: 'swap_image', actor: 'p53', img: 'p53_tetramero' },
        // «Sobre el ADN»: el tetrámero trae su propia doble hélice y queda en
        // la franja de resultado, junto al ADN dañado.
        { at: 2500, tipo: 'move', actor: 'p53', to: { col: 8.3, row: 7.25 } },
        { at: 3300, tipo: 'activate', actor: 'p53' },
        { at: 3600, tipo: 'note', text: 'Guardián del genoma', near: 'p53', side: 'top' },
      ],
    },
    {
      id: 'g7',
      orden: 7,
      titulo: 'p53 induce p21 y detiene el ciclo en G1',
      tarjeta: 'p53 induce p21, que inhibe a ciclina E–CDK2: RB sigue hipofosforilado y E2F reprimido.',
      texto:
        'p53 activa el gen de p21. p21 bloquea a ciclina E–CDK2, RB no termina de fosforilarse, E2F queda secuestrado y la célula se detiene en G1.',
      profundiza:
        'p21 (CDKN1A) es el efector principal de p53 para la detención del ciclo. Inhibe ciclina E–CDK2 y ciclina A–CDK2 (y también a CDK4), y además se une a PCNA bloqueando la síntesis replicativa sin impedir la reparación. RB, sin nuevas fosforilaciones, vuelve a unirse a E2F: los genes de fase S se apagan.',
      protagonistas: ['p53', 'p21', 'cdk2', 'rb'],
      acciones: [
        { at: 0, tipo: 'transcribe', tf: 'p53', gene: 'adn', product: 'p21', productPos: { col: 2.6, row: 3 } },
        { at: 1600, tipo: 'inhibit', inhibitor: 'p21', target: 'cdk2' },
        // Fosfatos de RB que se pierden sin fosfatasa visible.
        { at: 2100, tipo: 'dephosphorylate', target: 'rb', duration: 400 },
        { at: 2600, tipo: 'bind', actor: 'rb', target: 'e2f', lado: 'arriba' },
        { at: 3300, tipo: 'inhibit', inhibitor: 'rb', target: 'e2f' },
        { at: 3700, tipo: 'outcome', kind: 'detencion', pos: { col: 6, row: 9.35 } },
        { at: 4000, tipo: 'note', text: 'Detención en G1 (horas)', near: 'cdk2', side: 'top' },
      ],
    },
    {
      id: 'g8',
      orden: 8,
      titulo: 'p53 activa la reparación',
      tarjeta: 'p53 induce GADD45 y genes de reparación (NER, BER) mientras la célula está detenida.',
      texto: 'Con el ciclo detenido, p53 activa genes que ayudan a reparar el ADN.',
      profundiza:
        'Dianas de reparación: GADD45 (facilita el acceso a la cromatina dañada), XPC y DDB2 (reconocimiento en la reparación por escisión de nucleótidos, NER), y genes de la reparación por escisión de bases (BER). Las roturas de doble cadena en G1 se reparan principalmente por unión de extremos no homólogos (NHEJ), porque aún no existe cromátida hermana.',
      protagonistas: ['p53', 'gadd45', 'adn'],
      acciones: [
        { at: 0, tipo: 'transcribe', tf: 'p53', gene: 'adn', product: 'gadd45', productPos: { col: 4.3, row: 6.1 } },
        { at: 1600, tipo: 'connect', id: 'gadd45-adn', from: 'gadd45', to: 'adn', type: 'activa' },
        // La rotura se cierra.
        { at: 2100, tipo: 'swap_image', actor: 'adn', img: 'adn_helice' },
        { at: 2600, tipo: 'outcome', kind: 'reparacion', pos: { col: 2.4, row: 9.35 } },
      ],
    },
    {
      id: 'g9',
      orden: 9,
      titulo: 'Desenlace: reanudar, morir o envejecer',
      // Recortada a 18 palabras respecto al texto de la sección («Si el daño se repara…»).
      tarjeta: 'Reparado el daño, MDM2 y Wip1 apagan a p53; si es irreparable, apoptosis (BAX, PUMA, NOXA) o senescencia.',
      texto:
        'Si la reparación tiene éxito, p53 se apaga y el ciclo continúa. Si el daño es irreparable, p53 induce la apoptosis o una detención permanente, la senescencia.',
      profundiza:
        'Apagado: p53 induce a su propio inhibidor MDM2 (retroalimentación negativa) y a la fosfatasa Wip1 (PPM1D), que retira los fosfatos de p53, Chk1, Chk2, ATM y γH2AX. Apoptosis: p53 induce BAX, PUMA (BBC3) y NOXA (PMAIP1) → permeabilización de la membrana mitocondrial externa → citocromo c → apoptosoma → caspasa 9 → caspasa 3; e induce FAS (vía extrínseca). Senescencia: detención permanente sostenida por p21 y luego p16, con secreción de factores inflamatorios (fenotipo secretor asociado a senescencia).',
      protagonistas: ['p53', 'mdm2b', 'wip1', 'bax', 'puma'],
      acciones: [
        // Apagado de p53.
        { at: 0, tipo: 'transcribe', tf: 'p53', gene: 'adn', product: 'mdm2b', productPos: { col: 12.6, row: 4.2 } },
        { at: 1500, tipo: 'feedback_loop', from: 'p53', to: 'mdm2b', sign: '−', cycles: 2 },
        { at: 2800, tipo: 'appear', actor: 'wip1', pos: { col: 14.3, row: 4.4 }, from: 'grow' },
        { at: 3200, tipo: 'dephosphorylate', phosphatase: 'wip1', target: 'p53' },
        // Tres destinos posibles, lado a lado en la franja de resultado.
        // REVISAR: la franja inferior ya está ocupada por el ADN, p53 y el
        // proteasoma; las posiciones de las tres tarjetas dependen de cómo el
        // motor pinte `outcome` (a afinar en el pulido visual).
        { at: 4000, tipo: 'outcome', kind: 'reanuda', pos: { col: 2.4, row: 9.35 }, texto: 'Daño reparado' },
        { at: 4600, tipo: 'appear', actor: 'bax', pos: { col: 3.4, row: 1 }, from: 'grow' },
        { at: 4900, tipo: 'appear', actor: 'puma', pos: { col: 9.6, row: 1 }, from: 'grow' },
        { at: 5200, tipo: 'appear', actor: 'mito', pos: { col: 6.6, row: 0.9 }, from: 'fade' },
        { at: 5600, tipo: 'connect', id: 'bax-mito', from: 'bax', to: 'mito', type: 'activa' },
        { at: 5900, tipo: 'connect', id: 'puma-mito', from: 'puma', to: 'mito', type: 'activa' },
        { at: 6300, tipo: 'outcome', kind: 'apoptosis', pos: { col: 6, row: 9.35 }, texto: 'Daño irreparable' },
        { at: 6900, tipo: 'outcome', kind: 'senescencia', pos: { col: 9.6, row: 9.35 }, texto: 'Detención permanente' },
        { at: 7500, tipo: 'note', text: 'El destino depende de la intensidad y duración del daño', near: 'p53', side: 'bottom', persist: true },
      ],
    },
  ],
  distractores: [
    {
      id: 'gd1',
      tarjeta: 'MDM2 fosforila a p53 para activarlo.',
      porQueEsFalso: 'MDM2 es una ubiquitina ligasa que inhibe y degrada a p53.',
    },
    {
      id: 'gd2',
      tarjeta: 'p21 fosforila a RB para detener el ciclo.',
      porQueEsFalso: 'p21 no es cinasa; inhibe a las CDK que fosforilarían a RB.',
    },
    {
      id: 'gd3',
      tarjeta: 'Cdc25A activa a p53 tras el daño.',
      porQueEsFalso: 'Cdc25A es una fosfatasa de CDK que se degrada tras el daño.',
    },
  ],
  // Mismo contenido que la sección 12.2; las opciones se reescribieron para
  // que la correcta no destaque por su longitud.
  preguntas: [
    {
      id: 'gq1',
      enunciado:
        'Una mujer de 28 años con sarcoma y antecedente familiar de cáncer de mama y tumores cerebrales a edades tempranas. ¿Gen más probable?',
      opciones: ['RB1', 'BRCA2', 'TP53', 'APC'],
      correcta: 2,
      explicacion: 'Síndrome de Li-Fraumeni: mutación germinal de TP53.',
      pasoRelacionado: 'g6',
    },
    {
      id: 'gq2',
      enunciado: 'Tras radiación, ¿qué mecanismo detiene el ciclo más rápido?',
      opciones: [
        'Inducción de p21 por p53 estabilizado',
        'Degradación de Cdc25A vía Chk1/Chk2',
        'Inducción de BAX y salida del citocromo c',
        'Síntesis de ciclina D',
      ],
      correcta: 1,
      explicacion:
        'La rama Cdc25A es postraduccional (minutos); la de p53–p21 requiere transcripción (horas).',
      pasoRelacionado: 'g4',
    },
    {
      id: 'gq3',
      enunciado: 'En condiciones basales, p53 casi no se detecta porque:',
      opciones: [
        'Su gen no se transcribe durante G1',
        'p21 lo mantiene inhibido en el citoplasma',
        'Está secuestrado por RB junto con E2F sobre el ADN',
        'MDM2 lo ubiquitina y el proteasoma lo degrada',
      ],
      correcta: 3,
      explicacion:
        'MDM2, una ubiquitina ligasa E3, se une a p53, lo ubiquitina y lo envía al proteasoma: su vida media es de minutos.',
      pasoRelacionado: 'g0',
    },
    {
      id: 'gq4',
      enunciado: '¿Qué residuo de p53 fosforila ATM?',
      opciones: ['Ser15', 'Thr14', 'Ser216', 'Thr187'],
      correcta: 0,
      explicacion: 'Ser15 (ATM/ATR) y Ser20 (Chk2/Chk1) impiden la unión de MDM2.',
      pasoRelacionado: 'g5',
    },
    {
      id: 'gq5',
      enunciado: 'Un tumor con amplificación de MDM2 y TP53 no mutado se comporta como si:',
      opciones: [
        'p53 estuviera hiperactivo y detuviera el ciclo',
        'RB estuviera ausente',
        'p53 estuviera ausente funcionalmente',
        'p16 estuviera sobreexpresado',
      ],
      correcta: 2,
      explicacion:
        'MDM2 en exceso degrada a p53 aunque el gen esté intacto: la vía p53 queda inactiva sin mutación.',
      pasoRelacionado: 'g5',
    },
  ],
};

export default checkpoint;
