import type { Checkpoint } from '../tipos';

// Control intra-S (sección 12.3 del prompt maestro). Dos actos: licencia de
// los orígenes (pasos 1–3, en G1) y estrés replicativo (pasos 4–9). El modo
// aprendizaje arma un mazo por `secuencia`.

const checkpoint: Checkpoint = {
  id: 'intra_s',
  nombre: 'Control intra-S',
  nombreCorto: 'Intra-S',
  fase: 'S',
  pregunta: '¿La replicación avanza sin problemas? Decide ATR–Chk1.',
  resumen:
    'Los orígenes se "licencian" en G1 y se disparan en S una sola vez. Si una horquilla se detiene, el ADN de cadena simple recubierto de RPA activa ATR–Chk1, que frena el disparo de nuevos orígenes, protege la horquilla y permite repararla y reiniciarla.',
  // Núcleo desde la fila 1,6: deja una franja de citoplasma arriba para que
  // CDC6 salga del núcleo (paso 3) sin quedar cortada por el borde.
  compartimentos: { nucleo: { top: 1.6 } },
  actores: {
    // Un solo ADN largo (tira de las columnas 1 a 15). La horquilla y la
    // cadena simple son cambios de imagen de este mismo actor: la pieza se
    // pinta en el centro y la tira se abre a los lados, que es el «swap de la
    // zona central» del prompt.
    adn:    { img: 'adn_helice',            label: 'ADN', compartment: 'nucleo', tira: 14 },
    // La hoja 5 llegó con la celda de ORC vacía: se pinta el marcador de posición.
    orc:    { img: 'orc',                   label: 'ORC', compartment: 'nucleo' },
    cdc6:   { img: 'cdc6',                  label: 'CDC6', compartment: 'nucleo' },
    cdt1:   { img: 'cdt1',                  label: 'CDT1', compartment: 'nucleo' },
    mcm:    { img: 'mcm_helicasa',          label: 'MCM', compartment: 'nucleo' },
    mcm2:   { img: 'mcm_helicasa',          label: 'MCM (origen tardío)', compartment: 'nucleo' },
    ddk:    { img: 'ddk',                   label: 'DDK (Cdc7–Dbf4)', compartment: 'nucleo' },
    cicE:   { img: 'ciclina_e',             label: 'Ciclina E', compartment: 'nucleo' },
    cdk2:   { img: 'cdk2',                  label: 'CDK2', compartment: 'nucleo' },
    cicA:   { img: 'ciclina_a',             label: 'Ciclina A', compartment: 'nucleo' },
    cdk2b:  { img: 'cdk2',                  label: 'CDK2', compartment: 'nucleo' },
    gem:    { img: 'geminina',              label: 'Geminina', compartment: 'nucleo' },
    // Tres RPA en fila recubriendo el tramo de cadena simple: más chicas para
    // que se lean como una capa sobre el ADN y no como tres proteínas sueltas.
    rpa:    { img: 'rpa',                   label: 'RPA', compartment: 'nucleo', escala: 0.65 },
    rpa2:   { img: 'rpa',                   label: 'RPA', compartment: 'nucleo', escala: 0.65 },
    rpa3:   { img: 'rpa',                   label: 'RPA', compartment: 'nucleo', escala: 0.65 },
    atr:    { img: 'atr_atrip',             label: 'ATR–ATRIP', compartment: 'nucleo' },
    c911:   { img: 'clamp_911',             label: 'Anillo 9-1-1', compartment: 'nucleo' },
    topbp1: { img: 'topbp1',                label: 'TopBP1', compartment: 'nucleo' },
    clasp:  { img: 'claspina',              label: 'Claspina', compartment: 'nucleo' },
    chk1:   { img: 'chk1',                  label: 'Chk1', compartment: 'nucleo' },
    cdc25a: { img: 'cdc25',                 label: 'Cdc25A', compartment: 'nucleo' },
    scfb:   { img: 'e3_ligasa_scf',         label: 'SCF–βTrCP', compartment: 'nucleo' },
    prot:   { img: 'proteasoma',            label: 'Proteasoma', compartment: 'nucleo' },
    rad51:  { img: 'rad51_filamento',       label: 'RAD51', compartment: 'nucleo' },
  },
  pasos: [
    {
      id: 's0', orden: 0,
      titulo: 'Copiar el genoma una sola vez',
      texto: 'Durante la fase S hay que copiar unos 6 000 millones de pares de bases exactamente una vez. Miles de orígenes de replicación se activan en distintos momentos de la fase S.',
      profundiza: 'La escena tiene dos actos: primero la licencia de los orígenes, que ocurre en G1, y después qué pasa cuando una horquilla de replicación se detiene durante la fase S.',
      protagonistas: ['adn'],
      acciones: [
        { at: 0,   tipo: 'appear', actor: 'adn', pos: { col: 8, row: 6.6 }, from: 'fade' },
        { at: 500, tipo: 'note', text: 'Licencia de los orígenes (en G1)', near: 'adn', side: 'top' },
      ],
    },
    {
      id: 's1', orden: 1, secuencia: 'Licencia de los orígenes',
      titulo: 'En G1 se cargan las helicasas (licencia)',
      tarjeta: 'En G1, con CDK baja, ORC, CDC6 y CDT1 cargan la helicasa MCM sobre cada origen.',
      texto: "Durante G1, cuando la actividad CDK es baja, ORC marca los orígenes y CDC6 y CDT1 cargan sobre ellos la helicasa MCM, todavía inactiva. El origen queda 'licenciado'.",
      profundiza: 'Se forma el complejo prerreplicativo (pre-RC): ORC1–6 unido al origen, CDC6 y CDT1 cargan un doble hexámero de MCM2–7 que rodea el ADN bicatenario sin abrirlo. La licencia solo puede ocurrir cuando la actividad CDK es baja y APC/C–Cdh1 está activo (lo que mantiene degradada a la geminina).',
      protagonistas: ['orc', 'cdc6', 'cdt1', 'mcm'],
      acciones: [
        // El origen va en el centro del ADN: ahí mismo se abrirá la horquilla.
        { at: 0,    tipo: 'appear', actor: 'orc', pos: { col: 6, row: 6.6 }, from: 'grow' },
        { at: 350,  tipo: 'appear', actor: 'cdc6', pos: { col: 4.8, row: 4.4 }, from: 'grow' },
        { at: 700,  tipo: 'bind', actor: 'cdc6', target: 'orc', lado: 'arriba' },
        { at: 1300, tipo: 'appear', actor: 'cdt1', pos: { col: 9.8, row: 3.2 }, from: 'grow' },
        { at: 1600, tipo: 'appear', actor: 'mcm', pos: { col: 8.6, row: 3.4 }, from: 'fade' },
        // «MCM entra acompañando a CDT1»: CDT1 se acopla a MCM y viaja con ella.
        { at: 1950, tipo: 'bind', actor: 'cdt1', target: 'mcm', lado: 'der' },
        { at: 2600, tipo: 'move', actor: 'mcm', to: { col: 8, row: 6.6 } },
        { at: 3400, tipo: 'connect', id: 'cdc6-mcm', from: 'cdc6', to: 'mcm', type: 'activa', label: 'carga' },
        { at: 3700, tipo: 'note', text: 'Origen licenciado', near: 'mcm', side: 'bottom' },
      ],
    },
    {
      id: 's2', orden: 2, secuencia: 'Licencia de los orígenes',
      titulo: 'En S, CDK y DDK disparan el origen',
      tarjeta: 'Al entrar en S, CDK2 y DDK (Cdc7–Dbf4) activan MCM: la helicasa abre el ADN y empieza la replicación.',
      texto: 'Al comenzar la fase S, CDK2 y la cinasa DDK fosforilan el complejo del origen. MCM se convierte en una helicasa activa, abre la doble hélice y se forman dos horquillas de replicación.',
      profundiza: 'DDK (Cdc7–Dbf4) fosforila MCM; CDK fosforila Treslin/TICRR y RecQL4 (homólogos de Sld3/Sld2 de levadura), lo que recluta Cdc45 y GINS: se forma la helicasa activa CMG (Cdc45–MCM–GINS). Se reclutan la primasa, las polimerasas ε y δ y PCNA.',
      protagonistas: ['cdk2', 'ddk', 'mcm'],
      acciones: [
        { at: 0,    tipo: 'appear', actor: 'cdk2', pos: { col: 10.4, row: 2.6 }, from: 'grow' },
        { at: 250,  tipo: 'appear', actor: 'cicE', pos: { col: 9.2, row: 2 }, from: 'grow' },
        { at: 550,  tipo: 'bind', actor: 'cicE', target: 'cdk2', lado: 'izq' },
        { at: 1250, tipo: 'activate', actor: 'cdk2' },
        { at: 1500, tipo: 'appear', actor: 'ddk', pos: { col: 12.2, row: 2.6 }, from: 'grow' },
        { at: 1900, tipo: 'phosphorylate', kinase: 'cdk2', target: 'mcm', site: 'p1' },
        { at: 2600, tipo: 'phosphorylate', kinase: 'ddk', target: 'mcm', site: 'p2' },
        { at: 3300, tipo: 'activate', actor: 'mcm' },
        // CDT1 ya cumplió su función de carga y se aparta antes de que el
        // origen se abra (en el paso 3 la geminina la busca ahí).
        { at: 3650, tipo: 'release', actor: 'cdt1', from: 'mcm', to: { col: 9.2, row: 8.4 } },
        // «swap adn (zona central): horquilla»: la MCM activa se funde en la
        // horquilla que se abre en el centro del ADN.
        { at: 4200, tipo: 'swap_image', actor: 'adn', img: 'horquilla_replicacion', duration: 600 },
        { at: 4200, tipo: 'hide', actor: 'mcm', duration: 500 },
        { at: 4900, tipo: 'note', text: 'Origen disparado', near: 'adn', side: 'top' },
      ],
    },
    {
      id: 's3', orden: 3, secuencia: 'Licencia de los orígenes',
      titulo: 'Solo una vez por ciclo: bloqueo de la re-replicación',
      tarjeta: 'Ciclina A–CDK2 fosforila CDC6, CDT1 se degrada y la geminina secuestra a CDT1: no hay nueva licencia.',
      texto: 'Para que ningún tramo se copie dos veces, la célula impide volver a cargar helicasas durante S y G2.',
      profundiza: 'Ciclina A–CDK2 fosforila CDC6 (que es exportado al citoplasma) y ORC1. CDT1 es degradado por CRL4–Cdt2 (acoplado a PCNA en la horquilla) y por SCF–Skp2. La geminina, estable desde que APC/C–Cdh1 se apaga en G1/S, se une a CDT1 y lo bloquea. La licencia solo vuelve a ser posible tras la mitosis, cuando CDK cae y APC/C degrada la geminina.',
      clinica: 'La sobreexpresión de CDT1 o de CDC6, o la pérdida de geminina, causa re-replicación, amplificaciones génicas e inestabilidad genómica en tumores.',
      protagonistas: ['cicA', 'cdk2b', 'cdc6', 'gem', 'cdt1'],
      acciones: [
        { at: 0,    tipo: 'appear', actor: 'cdk2b', pos: { col: 13.4, row: 4.6 }, from: 'grow' },
        { at: 250,  tipo: 'appear', actor: 'cicA', pos: { col: 12.2, row: 4.2 }, from: 'grow' },
        { at: 550,  tipo: 'bind', actor: 'cicA', target: 'cdk2b', lado: 'izq' },
        { at: 1250, tipo: 'phosphorylate', kinase: 'cdk2b', target: 'cdc6', site: 'p1' },
        { at: 1900, tipo: 'release', actor: 'cdc6', from: 'orc' },
        { at: 2400, tipo: 'translocate', actor: 'cdc6', to: { col: 2.4, row: 0.9 }, compartment: 'citoplasma' },
        { at: 3200, tipo: 'appear', actor: 'gem', pos: { col: 7, row: 8.6 }, from: 'left' },
        { at: 3600, tipo: 'sequester', actor: 'gem', target: 'cdt1' },
        { at: 4500, tipo: 'inhibit', inhibitor: 'gem', target: 'cdt1' },
        { at: 5000, tipo: 'appear', actor: 'scfb', pos: { col: 11, row: 8.6 }, from: 'fade' },
        { at: 5300, tipo: 'ubiquitinate', ligase: 'scfb', target: 'cdt1' },
        { at: 5900, tipo: 'appear', actor: 'prot', pos: { col: 14.3, row: 8.7 }, from: 'fade' },
        { at: 6200, tipo: 'degrade', target: 'cdt1' },
        { at: 7300, tipo: 'note', text: 'Una sola ronda por ciclo', near: 'adn', side: 'top' },
      ],
    },
    {
      id: 's4', orden: 4, secuencia: 'Estrés replicativo',
      titulo: 'La horquilla se detiene',
      tarjeta: 'Una lesión o la falta de nucleótidos detiene la polimerasa, pero la helicasa sigue abriendo el ADN.',
      texto: 'La polimerasa choca con una lesión o se queda sin nucleótidos y se detiene. La helicasa, en cambio, sigue abriendo: se acumula un tramo largo de ADN de cadena simple.',
      profundiza: 'Este desacoplamiento helicasa–polimerasa es la señal central del estrés replicativo. Causas: dímeros de pirimidina (UV), aductos, entrecruzamientos, estructuras secundarias, colisiones con la transcripción, depleción de dNTP (hidroxiurea) o activación de oncogenes (ciclina E, MYC, RAS) que fuerzan el disparo de demasiados orígenes.',
      protagonistas: ['adn'],
      acciones: [
        // Cambio de acto: se retiran las piezas de la licencia que ya no
        // intervienen (ciclina E–CDK2 sigue: Chk1 la frena en el paso 8).
        { at: 0,    tipo: 'hide', actor: 'orc' },
        { at: 0,    tipo: 'hide', actor: 'cdc6' },
        { at: 0,    tipo: 'hide', actor: 'gem' },
        { at: 250,  tipo: 'hide', actor: 'cicA' },
        { at: 250,  tipo: 'hide', actor: 'cdk2b' },
        { at: 250,  tipo: 'hide', actor: 'ddk' },
        { at: 600,  tipo: 'camera', box: { col: 4.5, row: 3.8, w: 7, h: 4.6 } },
        // Rótulo de transición entre actos.
        { at: 900,  tipo: 'note', text: 'Estrés replicativo', near: 'adn', side: 'top' },
        { at: 1500, tipo: 'damage', agent: 'horquilla', target: 'adn', kind: 'dimero' },
        { at: 2700, tipo: 'swap_image', actor: 'adn', img: 'adn_cadena_simple' },
        { at: 3300, tipo: 'note', text: 'Desacoplamiento', near: 'adn', side: 'bottom' },
      ],
    },
    {
      id: 's5', orden: 5, secuencia: 'Estrés replicativo',
      titulo: 'RPA recubre el ADN de cadena simple y recluta ATR',
      tarjeta: 'RPA recubre el ADN de cadena simple y recluta al complejo ATR–ATRIP.',
      texto: 'La proteína RPA cubre el ADN de cadena simple expuesto. Esa capa de RPA es la plataforma que recluta a ATR a través de su compañera ATRIP.',
      profundiza: 'La capa de RPA sobre el ADN de cadena simple es la plataforma de reclutamiento: ATRIP, la compañera de ATR, se une a RPA y lleva a la cinasa hasta la horquilla detenida.',
      protagonistas: ['rpa', 'atr'],
      acciones: [
        { at: 0,    tipo: 'camera', box: 'all' },
        // Capa de RPA a lo largo del tramo de cadena simple (unión intencional
        // con el ADN, en diagonal como la cadena expuesta).
        { at: 300,  tipo: 'appear', actor: 'rpa', pos: { col: 7.6, row: 6.9 }, from: 'grow' },
        { at: 600,  tipo: 'appear', actor: 'rpa2', pos: { col: 8.2, row: 6.5 }, from: 'grow' },
        { at: 900,  tipo: 'appear', actor: 'rpa3', pos: { col: 8.8, row: 6.1 }, from: 'grow' },
        { at: 1400, tipo: 'appear', actor: 'atr', pos: { col: 8.4, row: 3.6 }, from: 'top' },
        { at: 1800, tipo: 'bind', actor: 'atr', target: 'rpa2', offset: { col: 0.2, row: -1.6 } },
        { at: 2500, tipo: 'connect', id: 'rpa-atr', from: 'rpa2', to: 'atr', type: 'activa', label: 'recluta' },
      ],
    },
    {
      id: 's6', orden: 6, secuencia: 'Estrés replicativo',
      titulo: '9-1-1 y TopBP1 activan por completo a ATR',
      tarjeta: 'El anillo 9-1-1 se carga en la unión ADN simple/doble y TopBP1 activa plenamente a ATR.',
      texto: 'En el borde entre ADN simple y doble se carga un anillo llamado 9-1-1. Este anillo trae a TopBP1, que enciende por completo a ATR.',
      profundiza: 'RAD17–RFC carga el anillo RAD9–HUS1–RAD1 (9-1-1) en la unión 5′ ss/ds. TopBP1, anclado a 9-1-1, estimula la actividad cinasa de ATR (ETAA1, reclutado por RPA, es un activador alternativo). La doble exigencia (RPA y 9-1-1) asegura que ATR solo se active en estructuras realmente anómalas.',
      clinica: 'Mutaciones hipomórficas de ATR causan el síndrome de Seckel (microcefalia, enanismo proporcionado).',
      protagonistas: ['c911', 'topbp1', 'atr'],
      acciones: [
        // 9-1-1 en el borde izquierdo de la cadena simple (unión simple/doble).
        { at: 0,    tipo: 'appear', actor: 'c911', pos: { col: 6.3, row: 6.6 }, from: 'grow' },
        { at: 400,  tipo: 'appear', actor: 'topbp1', pos: { col: 5.4, row: 4.6 }, from: 'grow' },
        { at: 750,  tipo: 'bind', actor: 'topbp1', target: 'c911', lado: 'arriba' },
        { at: 1450, tipo: 'connect', id: 'topbp1-atr', from: 'topbp1', to: 'atr', type: 'activa' },
        { at: 1950, tipo: 'activate', actor: 'atr' },
      ],
    },
    {
      id: 's7', orden: 7, secuencia: 'Estrés replicativo',
      titulo: 'ATR activa a Chk1 a través de claspina',
      tarjeta: 'ATR fosforila a Chk1 con ayuda del mediador claspina; Chk1 se libera y difunde.',
      texto: 'ATR fosforila a Chk1 con ayuda de claspina. Chk1 activa se separa de la cromatina y lleva la señal al resto del núcleo.',
      profundiza: 'ATR fosforila Chk1 en Ser317 y Ser345; claspina (con Timeless–Tipin, que viajan con la horquilla) actúa como adaptador. Chk1 es esencial incluso sin daño exógeno: cada fase S produce algo de estrés replicativo.',
      protagonistas: ['atr', 'clasp', 'chk1'],
      acciones: [
        { at: 0,    tipo: 'appear', actor: 'clasp', pos: { col: 10.2, row: 5.3 }, from: 'grow' },
        { at: 350,  tipo: 'appear', actor: 'chk1', pos: { col: 11.4, row: 4.4 }, from: 'grow' },
        { at: 700,  tipo: 'bind', actor: 'chk1', target: 'clasp', lado: 'der' },
        { at: 1400, tipo: 'phosphorylate', kinase: 'atr', target: 'chk1', site: 'p1', label: 'S345' },
        { at: 2100, tipo: 'release', actor: 'chk1', from: 'clasp', to: { col: 12.3, row: 3.8 } },
        { at: 2750, tipo: 'activate', actor: 'chk1' },
      ],
    },
    {
      id: 's8', orden: 8, secuencia: 'Estrés replicativo',
      titulo: 'Chk1 frena el disparo de orígenes tardíos',
      tarjeta: 'Chk1 provoca la degradación de Cdc25A: baja CDK2 y se bloquea el disparo de orígenes tardíos.',
      texto: 'Chk1 marca a Cdc25A para su destrucción. Sin Cdc25A, CDK2 pierde actividad y los orígenes que aún no se habían disparado quedan en espera.',
      profundiza: "Degradación de Cdc25A por SCF–βTrCP → CDK2 retiene sus fosfatos inhibidores. Al bajar la actividad CDK (y DDK), no se forman nuevas CMG en orígenes tardíos. Los orígenes cercanos a la horquilla detenida ('latentes') sí pueden dispararse para rescatar la replicación de esa región.",
      protagonistas: ['chk1', 'cdc25a', 'cdk2'],
      acciones: [
        { at: 0,    tipo: 'appear', actor: 'cdc25a', pos: { col: 13.8, row: 5.2 }, from: 'grow' },
        { at: 300,  tipo: 'connect', id: 'cdc25a-cdk2', from: 'cdc25a', to: 'cdk2', type: 'activa' },
        { at: 800,  tipo: 'phosphorylate', kinase: 'chk1', target: 'cdc25a', site: 'p1' },
        { at: 1500, tipo: 'ubiquitinate', ligase: 'scfb', target: 'cdc25a' },
        { at: 2300, tipo: 'degrade', target: 'cdc25a' },
        { at: 3500, tipo: 'inhibit', inhibitor: 'chk1', target: 'cdk2' },
        // Origen tardío: otra MCM cargada sobre el mismo ADN, a la derecha.
        { at: 4100, tipo: 'appear', actor: 'mcm2', pos: { col: 12.6, row: 6.6 }, from: 'fade' },
        // «desaturada»: estado inhibido sin conector propio.
        { at: 4400, tipo: 'inhibit', inhibitor: 'chk1', target: 'mcm2', conector: false },
        { at: 4800, tipo: 'note', text: 'Origen tardío en espera', near: 'mcm2', side: 'top' },
      ],
    },
    {
      id: 's9', orden: 9, secuencia: 'Estrés replicativo',
      titulo: 'Protección y reinicio de la horquilla',
      tarjeta: 'La horquilla se estabiliza, se repara o se sortea la lesión, y la replicación se reinicia.',
      texto: 'ATR y Chk1 mantienen estable la horquilla detenida para que no se rompa. La lesión se sortea o se repara y la replicación continúa.',
      profundiza: 'Mecanismos: estabilización del replisoma, regresión de la horquilla, síntesis translesión (polimerasas especializadas de baja fidelidad), cambio de molde y reinicio por recombinación. Si la horquilla colapsa, se genera una rotura de doble cadena que se repara por recombinación homóloga (RAD51, BRCA1/2) usando la cromátida hermana recién sintetizada. ATR además impide la entrada prematura en mitosis mientras queden regiones sin replicar.',
      clinica: 'Las células tumorales con mucho estrés replicativo (p. ej., por sobreexpresión de ciclina E o MYC) dependen de ATR–Chk1; por eso se investigan inhibidores de ATR y de Chk1. La hidroxiurea activa esta vía depletando dNTP.',
      protagonistas: ['atr', 'chk1', 'adn'],
      acciones: [
        { at: 0,    tipo: 'appear', actor: 'rad51', pos: { col: 8.2, row: 8.5 }, from: 'fade' },
        { at: 400,  tipo: 'note', text: 'Si colapsa: recombinación homóloga', near: 'rad51', side: 'left' },
        { at: 1600, tipo: 'swap_image', actor: 'adn', img: 'horquilla_replicacion' },
        // Reanudada la horquilla, la capa de RPA ya no hace falta.
        { at: 2100, tipo: 'hide', actor: 'rpa' },
        { at: 2100, tipo: 'hide', actor: 'rpa2' },
        { at: 2100, tipo: 'hide', actor: 'rpa3' },
        { at: 2500, tipo: 'release_inhibition', actor: 'mcm2' },
        { at: 3000, tipo: 'outcome', kind: 'fase_s', pos: { col: 3.4, row: 9.2 }, texto: 'La replicación continúa' },
      ],
    },
  ],
  distractores: [
    { id: 'sd1', secuencia: 'Licencia de los orígenes', tarjeta: 'En fase S, CDC6 y CDT1 cargan nuevas helicasas en los orígenes ya replicados.', porQueEsFalso: 'La licencia solo ocurre en G1; en S está bloqueada.' },
    { id: 'sd2', secuencia: 'Estrés replicativo', tarjeta: 'ATM es el principal sensor de las horquillas detenidas.', porQueEsFalso: 'El ADN de cadena simple con RPA activa ATR; ATM responde sobre todo a roturas de doble cadena.' },
    { id: 'sd3', secuencia: 'Estrés replicativo', tarjeta: 'Chk1 activa a Cdc25A para acelerar la replicación.', porQueEsFalso: 'Chk1 provoca su degradación.' },
  ],
  preguntas: [
    {
      id: 'sq1',
      enunciado: '¿Qué estructura activa directamente a ATR?',
      opciones: [
        'Los extremos de una rotura de doble cadena',
        'ADN de cadena simple recubierto por RPA',
        'Cinetocoros todavía no unidos al huso mitótico',
        'Dímeros de ciclina unidos a la CDK',
      ],
      correcta: 1,
      explicacion: 'RPA recubre el ADN de cadena simple expuesto y recluta a ATR a través de ATRIP; las roturas de doble cadena activan sobre todo a ATM.',
      pasoRelacionado: 's5',
    },
    {
      id: 'sq2',
      enunciado: 'La geminina impide la re-replicación porque:',
      opciones: [
        'Degrada la helicasa MCM ya cargada en cada origen',
        'Fosforila a CDC6 y provoca su salida al citoplasma',
        'Inhibe a ATR en las horquillas de replicación',
        'Se une a CDT1 y lo inhibe, impidiendo cargar MCM',
      ],
      correcta: 3,
      explicacion: 'La geminina, estable desde G1/S, se une a CDT1 y lo bloquea; así no se cargan nuevas helicasas hasta después de la mitosis.',
      pasoRelacionado: 's3',
    },
    {
      id: 'sq3',
      enunciado: 'Un fármaco que depleta dNTP (hidroxiurea) activará principalmente:',
      opciones: [
        'El eje ATR–Chk1',
        'El eje ATM–Chk2',
        'El checkpoint del huso (SAC)',
        'La vía de p16 sobre CDK4/6',
      ],
      correcta: 0,
      explicacion: 'La falta de nucleótidos detiene la polimerasa mientras la helicasa sigue abriendo: el ADN de cadena simple con RPA activa ATR–Chk1.',
      pasoRelacionado: 's4',
    },
    {
      id: 'sq4',
      enunciado: 'Una célula con exceso de CDT1 tiene riesgo de:',
      opciones: [
        'Detención permanente en G1',
        'Aneuploidía por falla del checkpoint del huso',
        'Re-replicación y amplificación génica',
        'Apoptosis inmediata inducida por p14ARF',
      ],
      correcta: 2,
      explicacion: 'La sobreexpresión de CDT1 permite volver a licenciar orígenes ya replicados: re-replicación, amplificaciones génicas e inestabilidad genómica.',
      pasoRelacionado: 's3',
    },
  ],
};

export default checkpoint;
