import type { Checkpoint } from '../tipos';

// Control del huso mitótico (SAC). Fuente de verdad: sección 12.5 del prompt
// maestro. Sin núcleo (la envoltura ya se rompió): el motor dibuja los polos
// del huso en (0.8, 5) y (15.2, 5).
//
// Adaptaciones al contrato:
//   · Los microtúbulos (`mt1`, `mt2`, `mtErr`) son imágenes sueltas entre el
//     polo y el cinetocoro, alargadas con `escala` (no hay tiles).
//   · Mad2 es UN actor (`mad2`) que pasa de abierta a cerrada con
//     `swap_image`; luego se funde con Cdc20 y BubR1–Bub3 en el MCC (`merge`).
//     Al desarmarse (paso 6) sale una Mad2 abierta nueva (`mad2Libre`).
//   · BubR1–Bub3 (`bubr1`) reutiliza la imagen de Bub1–Bub3.

const checkpoint: Checkpoint = {
  id: 'huso',
  nombre: 'Control del huso (SAC)',
  nombreCorto: 'Huso',
  fase: 'M',
  pregunta: '¿Todos los cromosomas están bien unidos al huso? Decide Mad2–APC/C.',
  resumen:
    'Un solo cinetocoro sin unir genera el complejo MCC, que inhibe a APC/C–Cdc20. Mientras tanto, securina y ciclina B no se degradan, la separasa sigue bloqueada y la cohesina mantiene unidas las cromátidas. Cuando todos los cromosomas están biorientados, la señal se apaga, APC/C degrada securina y ciclina B, la separasa corta la cohesina y empieza la anafase.',
  compartimentos: { nucleo: false, polos: true },
  actores: {
    crom:      { img: 'cromatidas_cohesina', label: 'Cromátidas hermanas' },
    cromIzq:   { img: 'cromatidas_cohesina', label: 'Cromátida', escala: 0.6 },
    cromDer:   { img: 'cromatidas_cohesina', label: 'Cromátida', escala: 0.6 },
    kUni:      { img: 'cinetocoro_unido',    label: 'Cinetocoro unido', escala: 0.55, espejo: true },
    // Rótulo neutro: el rótulo no cambia con swap_image y este cinetocoro
    // termina unido (h5). Que está libre lo dicen la nota de h0 y su halo.
    kSin:      { img: 'cinetocoro_sin_unir', label: 'Cinetocoro sin unir', escala: 0.55 },
    // Tiras del polo al cinetocoro: polo izq. en x=95, fibras de kUni hasta
    // x≈654; fibras de kSin (ya unido) desde x≈946 hasta el polo der. x=1505.
    mt1:       { img: 'microtubulo', label: 'Microtúbulo', tira: 5.6, escala: 0.5 },
    mt2:       { img: 'microtubulo', label: 'Microtúbulo', tira: 5.6, escala: 0.5 },
    // Anafase: los microtúbulos ya acortados, del polo a las fibras.
    mt1b:      { img: 'microtubulo', label: 'Microtúbulo', tira: 1.3, escala: 0.5 },
    mt2b:      { img: 'microtubulo', label: 'Microtúbulo', tira: 1.3, escala: 0.5 },
    mtErr:     { img: 'microtubulo', label: 'Unión sintélica', tira: 4.8, escala: 0.45 },
    mps1:      { img: 'mps1',         label: 'Mps1' },
    knl1:      { img: 'knl1',         label: 'Knl1' },
    bub:       { img: 'bub1_bub3',    label: 'Bub1–Bub3' },
    // REVISAR: BubR1–Bub3 no tiene imagen propia; usa la de Bub1–Bub3.
    bubr1:     { img: 'bub1_bub3',    label: 'BubR1–Bub3', escala: 0.85 },
    mad1:      { img: 'mad1_mad2',    label: 'Mad1–Mad2' },
    mad2:      { img: 'mad2_abierta', label: 'Mad2' },
    mad2x1:    { img: 'mad2_abierta', label: 'Mad2', escala: 0.8 },
    mad2x2:    { img: 'mad2_abierta', label: 'Mad2', escala: 0.8 },
    mad2Libre: { img: 'mad2_abierta', label: 'Mad2 abierta' },
    cdc20:     { img: 'cdc20',        label: 'Cdc20' },
    mcc:       { img: 'mcc',          label: 'MCC' },
    apc:       { img: 'apc_c',        label: 'APC/C' },
    sec:       { img: 'securina',     label: 'Securina' },
    sep:       { img: 'separasa',     label: 'Separasa' },
    cicB:      { img: 'ciclina_b',    label: 'Ciclina B' },
    cdk1:      { img: 'cdk1',         label: 'CDK1' },
    auroraB:   { img: 'aurora_b',     label: 'Aurora B', escala: 0.5 },
    trip13:    { img: 'trip13_p31',   label: 'TRIP13 + p31<sup>comet</sup>' },
    prot:      { img: 'proteasoma',   label: 'Proteasoma' },
  },
  pasos: [
    {
      id: 'h0', orden: 0,
      titulo: 'Metafase: un cinetocoro aún libre',
      texto: 'La célula está en mitosis. Las cromátidas hermanas siguen unidas por anillos de cohesina. Cada cromátida tiene un cinetocoro que debe capturar microtúbulos de un polo distinto.',
      profundiza: 'La envoltura nuclear ya se rompió y el huso está armado. Un cinetocoro ya capturó microtúbulos de su polo; el de la cromátida hermana todavía está libre. La securina mantiene inhibida a la separasa y la ciclina B–CDK1 sigue activa.',
      protagonistas: ['crom', 'kSin', 'kUni'],
      acciones: [
        { at: 0,    tipo: 'appear', actor: 'crom', pos: { col: 8, row: 5 }, from: 'fade' },
        { at: 300,  tipo: 'appear', actor: 'kUni', pos: { col: 7.2, row: 5 }, from: 'grow' },
        { at: 600,  tipo: 'appear', actor: 'mt1',  pos: { col: 3.75, row: 5 }, from: 'left' },
        { at: 900,  tipo: 'appear', actor: 'kSin', pos: { col: 8.8, row: 5 }, from: 'grow' },
        { at: 1200, tipo: 'appear', actor: 'sep',  pos: { col: 11.6, row: 8.2 }, from: 'fade' },
        { at: 1500, tipo: 'appear', actor: 'sec',  pos: { col: 12.6, row: 8 }, from: 'grow' },
        { at: 1800, tipo: 'bind',   actor: 'sec', target: 'sep', lado: 'der' },
        { at: 2400, tipo: 'inhibit', inhibitor: 'sec', target: 'sep' },
        { at: 2700, tipo: 'appear', actor: 'cdk1', pos: { col: 4, row: 8.4 }, from: 'grow' },
        { at: 2900, tipo: 'appear', actor: 'cicB', pos: { col: 2.8, row: 8.4 }, from: 'grow' },
        { at: 3200, tipo: 'bind',   actor: 'cicB', target: 'cdk1', lado: 'izq' },
        { at: 3800, tipo: 'note',   text: 'Un cinetocoro sin unir', near: 'kSin', side: 'top' },
      ],
    },
    {
      id: 'h1', orden: 1,
      titulo: 'El cinetocoro libre recluta la maquinaria del SAC',
      tarjeta: 'En un cinetocoro sin unir, Mps1 fosforila Knl1, que recluta Bub1–Bub3 y Mad1–Mad2.',
      texto: 'Un cinetocoro sin microtúbulos queda accesible a la cinasa Mps1, que fosforila a Knl1. Knl1 fosforilado recluta a Bub1–Bub3 y, a través de ellos, al complejo Mad1–Mad2.',
      profundiza: 'Mps1 compite con los microtúbulos por el complejo Ndc80: cuando el cinetocoro no está unido, Mps1 se une y fosforila los motivos MELT de Knl1. Bub3–Bub1 se une a esos fosfo-MELT y recluta a Mad1–Mad2 (con ayuda del complejo RZZ). Mad1 unido a una Mad2 «cerrada» forma el molde catalítico permanente del cinetocoro.',
      protagonistas: ['mps1', 'knl1', 'bub', 'mad1'],
      acciones: [
        { at: 0,    tipo: 'camera', box: { col: 7, row: 1.6, w: 6, h: 4.4 } },
        { at: 200,  tipo: 'appear', actor: 'mps1', pos: { col: 10.2, row: 2.4 }, from: 'grow' },
        { at: 600,  tipo: 'bind',   actor: 'mps1', target: 'kSin', lado: 'arriba', offset: { col: 0.35, row: -1.35 } },
        { at: 1300, tipo: 'appear', actor: 'knl1', pos: { col: 10.3, row: 3.9 }, from: 'fade' },
        { at: 1600, tipo: 'phosphorylate', kinase: 'mps1', target: 'knl1', site: 'p1', label: 'MELT' },
        { at: 2300, tipo: 'appear', actor: 'bub',  pos: { col: 11.6, row: 3.2 }, from: 'grow' },
        { at: 2600, tipo: 'bind',   actor: 'bub', target: 'knl1', lado: 'der', offset: { col: 1.05, row: -0.1 } },
        { at: 3300, tipo: 'appear', actor: 'mad1', pos: { col: 12.4, row: 2.2 }, from: 'grow' },
        { at: 3600, tipo: 'bind',   actor: 'mad1', target: 'bub', lado: 'arriba', offset: { col: 0.35, row: -1.05 } },
      ],
    },
    {
      id: 'h2', orden: 2,
      titulo: 'Amplificación: Mad2 abierta se convierte en Mad2 cerrada',
      tarjeta: 'Mad1–Mad2 actúa como molde: convierte Mad2 abierta en Mad2 cerrada, que se une a Cdc20.',
      texto: 'Mad1–Mad2 funciona como una plantilla: Mad2 libre, en forma «abierta», llega al molde, se pliega a su forma «cerrada» y atrapa a Cdc20.',
      profundiza: 'Modelo de molde: O-Mad2 (abierta, inactiva) dimeriza transitoriamente con la C-Mad2 unida a Mad1; esto cataliza su cambio conformacional a C-Mad2, cuyo «cinturón de seguridad» se cierra alrededor de un motivo de Cdc20. Así, un único cinetocoro puede generar muchas moléculas inhibidoras: por eso basta uno sin unir para detener a toda la célula.',
      protagonistas: ['mad1', 'mad2', 'cdc20'],
      acciones: [
        { at: 0,    tipo: 'appear', actor: 'mad2', pos: { col: 13.8, row: 1.4 }, from: 'right' },
        { at: 400,  tipo: 'move',   actor: 'mad2', to: { col: 12.9, row: 1.9 } },
        { at: 1200, tipo: 'swap_image', actor: 'mad2', img: 'mad2_cerrada' },
        { at: 1700, tipo: 'appear', actor: 'cdc20', pos: { col: 14.3, row: 3.3 }, from: 'grow' },
        { at: 2100, tipo: 'bind',   actor: 'mad2', target: 'cdc20', lado: 'arriba' },
        { at: 2900, tipo: 'feedback_loop', from: 'mad1', to: 'mad2', sign: '+', cycles: 2 },
        { at: 3100, tipo: 'appear', actor: 'mad2x1', pos: { col: 12.9, row: 1.9 }, from: 'right', duration: 300 },
        { at: 3400, tipo: 'swap_image', actor: 'mad2x1', img: 'mad2_cerrada' },
        { at: 3700, tipo: 'appear', actor: 'mad2x2', pos: { col: 11.8, row: 0.9 }, from: 'right', duration: 300 },
        { at: 4000, tipo: 'swap_image', actor: 'mad2x2', img: 'mad2_cerrada' },
        { at: 4300, tipo: 'note',   text: 'Un solo cinetocoro basta', near: 'kSin', side: 'bottom' },
      ],
    },
    {
      id: 'h3', orden: 3,
      titulo: 'Se forma el MCC y APC/C–Cdc20 queda inhibido',
      tarjeta: 'Mad2–Cdc20 se une a BubR1–Bub3 formando el MCC, que inhibe a APC/C–Cdc20.',
      texto: 'Mad2 cerrada con Cdc20 se une a BubR1 y Bub3: es el complejo de control mitótico (MCC). El MCC bloquea a la ubiquitina ligasa APC/C y a su activador Cdc20.',
      profundiza: 'BubR1 actúa como pseudosustrato: ocupa los sitios de reconocimiento de sustrato (cajas D y KEN) de Cdc20 y, en el complejo con APC/C, puede bloquear un segundo Cdc20. Sin APC/C–Cdc20 activo, sus dos sustratos clave, securina y ciclina B, se mantienen estables.',
      clinica: 'Mutaciones bialélicas de BUB1B (BubR1) causan aneuploidía variegada en mosaico (MVA): retraso del crecimiento, microcefalia y predisposición a tumores infantiles.',
      protagonistas: ['mcc', 'apc', 'bubr1'],
      acciones: [
        { at: 0,    tipo: 'camera', box: 'all' },
        { at: 300,  tipo: 'appear', actor: 'bubr1', pos: { col: 13.2, row: 4 }, from: 'grow' },
        { at: 800,  tipo: 'merge',  actors: ['mad2', 'cdc20', 'bubr1'], into: 'mcc', pos: { col: 11.2, row: 6.6 } },
        { at: 1700, tipo: 'appear', actor: 'apc', pos: { col: 9.4, row: 7.4 }, from: 'grow' },
        { at: 2100, tipo: 'sequester', actor: 'mcc', target: 'apc' },
        { at: 3000, tipo: 'inhibit', inhibitor: 'mcc', target: 'apc' },
      ],
    },
    {
      id: 'h4', orden: 4,
      titulo: 'Securina y ciclina B protegen la cohesión',
      tarjeta: 'Securina y ciclina B no se degradan: la separasa sigue bloqueada y la cohesina mantiene unidas las cromátidas.',
      texto: 'Como APC/C está bloqueado, la securina sigue sujetando a la separasa. Sin separasa activa, la cohesina no se corta y las cromátidas hermanas no pueden separarse.',
      profundiza: 'La separasa es una proteasa de cisteína cuya única función clave es cortar la subunidad Rad21 (Scc1) de la cohesina. La securina es su chaperona e inhibidor; la ciclina B–CDK1 la inhibe por una segunda vía (fosforilación y unión directa). La cohesina de los brazos se retira en profase (vía WAPL y PLK1), pero la del centrómero está protegida por shugoshina–PP2A hasta la anafase.',
      protagonistas: ['sec', 'sep', 'crom', 'cicB'],
      acciones: [
        { at: 0,    tipo: 'highlight', actors: ['sec', 'sep', 'crom', 'cicB'], duration: 1500 },
        // `inhibit` sin conector propio + `connect` con id: así el paso 7
        // puede retirar la flecha cuando la ciclina B se degrada.
        { at: 1600, tipo: 'inhibit', inhibitor: 'cdk1', target: 'sep', conector: false },
        { at: 1600, tipo: 'connect', id: 'cdk1-sep', from: 'cdk1', to: 'sep', type: 'inhibe', curve: 0.15 },
        { at: 2200, tipo: 'note',    text: 'Cohesina intacta', near: 'crom', side: 'top' },
        { at: 2500, tipo: 'outcome', kind: 'detencion', pos: { col: 8, row: 9.2 }, texto: 'Metafase sostenida' },
      ],
    },
    {
      id: 'h5', orden: 5,
      titulo: 'Aurora B corrige las uniones incorrectas',
      tarjeta: 'Aurora B detecta uniones sin tensión y las desestabiliza para que se formen uniones correctas.',
      texto: 'No basta con estar unido: cada cromátida debe estar unida a un polo distinto. Aurora B detecta las uniones sin tensión y las suelta para que se vuelvan a formar correctamente.',
      profundiza: 'Aurora B forma parte del complejo pasajero cromosómico (CPC: Aurora B, INCENP, survivina y borealina) en el centrómero interno. Sin tensión (uniones sintélicas —ambas cromátidas al mismo polo— o merotélicas —un cinetocoro a ambos polos—), el cinetocoro externo queda cerca de Aurora B, que fosforila la cola de Ndc80 y reduce su afinidad por los microtúbulos: la unión se suelta y el cinetocoro libre vuelve a activar el SAC. Con biorientación, la tensión aleja el cinetocoro externo de Aurora B y las fosfatasas PP1 y PP2A–B56 estabilizan la unión.',
      protagonistas: ['auroraB', 'kSin', 'mt2'],
      acciones: [
        { at: 0,    tipo: 'appear', actor: 'auroraB', pos: { col: 8, row: 4.55 }, from: 'grow' },
        { at: 500,  tipo: 'appear', actor: 'mtErr', pos: { col: 3.6, row: 3.8 }, from: 'left' },
        { at: 900,  tipo: 'connect', id: 'sintelica', from: 'mtErr', to: 'kSin', type: 'inhibe', label: 'Unión sin tensión', curve: 0.2 },
        { at: 1600, tipo: 'phosphorylate', kinase: 'auroraB', target: 'kSin', site: 'p1', label: 'Ndc80' },
        { at: 2300, tipo: 'disconnect', id: 'sintelica' },
        { at: 2400, tipo: 'hide',   actor: 'mtErr' },
        { at: 2800, tipo: 'appear', actor: 'mt2', pos: { col: 12.25, row: 5 }, from: 'right' },
        { at: 3500, tipo: 'swap_image', actor: 'kSin', img: 'cinetocoro_unido', label: 'Cinetocoro unido' },
        { at: 3900, tipo: 'note',   text: 'Biorientación: tensión', near: 'crom', side: 'bottom' },
      ],
    },
    {
      id: 'h6', orden: 6,
      titulo: 'La señal se apaga',
      tarjeta: 'Con todos los cinetocoros unidos, la dineína retira Mad1–Mad2 y TRIP13 con p31comet desarman el MCC.',
      texto: 'Cuando el último cinetocoro se une correctamente, deja de producirse MCC. La dineína arrastra a Mad1–Mad2 fuera del cinetocoro y TRIP13 con p31comet desarma los MCC que quedaban.',
      profundiza: 'Los microtúbulos desplazan a Mps1 de Ndc80; PP1 desfosforila los MELT de Knl1 y Bub1–Bub3 se libera. La dineína, vía Spindly y RZZ, transporta Mad1–Mad2 hacia los polos («stripping»). p31^comet se une a C-Mad2 y TRIP13 (una ATPasa AAA+) la despliega a O-Mad2, liberando a Cdc20.',
      protagonistas: ['mad1', 'trip13', 'mcc'],
      acciones: [
        { at: 0,    tipo: 'hide',    actor: 'mps1' },
        { at: 300,  tipo: 'release', actor: 'bub', from: 'knl1', to: { col: 10.9, row: 2.4 } },
        { at: 1000, tipo: 'release', actor: 'mad1', from: 'bub', to: { col: 14.2, row: 4.2 }, duration: 1000 },
        { at: 1300, tipo: 'hide',    actor: 'mad2x1' },
        { at: 1500, tipo: 'hide',    actor: 'mad2x2' },
        { at: 2200, tipo: 'appear',  actor: 'trip13', pos: { col: 13.3, row: 6.9 }, from: 'grow' },
        { at: 2600, tipo: 'connect', id: 'trip13-mcc', from: 'trip13', to: 'mcc', type: 'activa' },
        { at: 3200, tipo: 'split',   actor: 'mcc', into: [
          { actor: 'mad2Libre', pos: { col: 11.6, row: 6.1 } },
          { actor: 'cdc20',     pos: { col: 10.3, row: 6.3 } },
          { actor: 'bubr1',     pos: { col: 7.6, row: 6.6 } },
        ] },
        { at: 3900, tipo: 'release_inhibition', actor: 'apc' },
      ],
    },
    {
      id: 'h7', orden: 7,
      titulo: 'APC/C–Cdc20 ubiquitina a securina y ciclina B',
      tarjeta: 'APC/C–Cdc20 activo ubiquitina a securina y ciclina B, que van al proteasoma.',
      texto: 'Libre del MCC, APC/C con Cdc20 marca con ubiquitina a la securina y a la ciclina B, que son destruidas en el proteasoma.',
      profundiza: 'APC/C es una ubiquitina ligasa E3 que, activada por Cdc20, reconoce a la securina y a la ciclina B por sus secuencias de destrucción y las poliubiquitina. El proteasoma 26S las degrada. Sin ciclina B, CDK1 queda sola.',
      protagonistas: ['apc', 'cdc20', 'sec', 'cicB'],
      acciones: [
        { at: 0,    tipo: 'bind',     actor: 'cdc20', target: 'apc', lado: 'arriba' },
        { at: 700,  tipo: 'activate', actor: 'apc' },
        { at: 1100, tipo: 'ubiquitinate', ligase: 'apc', target: 'sec' },
        { at: 1500, tipo: 'ubiquitinate', ligase: 'apc', target: 'cicB' },
        { at: 2200, tipo: 'appear',   actor: 'prot', pos: { col: 14, row: 8.6 }, from: 'fade' },
        { at: 2600, tipo: 'degrade',  target: 'sec' },
        { at: 3000, tipo: 'degrade',  target: 'cicB' },
        { at: 3300, tipo: 'disconnect', id: 'cdk1-sep' },
        // REVISAR: el prompt pide «cdk1 queda sola y desaturada», pero el
        // contrato no tiene primitiva para desaturar sin un inhibidor visible.
        { at: 3600, tipo: 'note',     text: 'CDK1 sin ciclina B', near: 'cdk1', side: 'top' },
      ],
    },
    {
      id: 'h8', orden: 8,
      titulo: 'La separasa corta la cohesina: anafase',
      tarjeta: 'La separasa libre corta la cohesina y las cromátidas hermanas se separan hacia polos opuestos.',
      texto: 'Sin securina, la separasa se activa y corta los anillos de cohesina. Las cromátidas hermanas se separan y los microtúbulos las arrastran a polos opuestos: empieza la anafase.',
      profundiza: 'La separasa corta Rad21/Scc1 y el anillo de cohesina se abre. La caída de la ciclina B apaga CDK1; las fosfatasas PP2A–B55 y PP1 revierten las fosforilaciones mitóticas y la célula sale de mitosis (citocinesis, reensamblaje de la envoltura nuclear). Hacia el final de M, APC/C cambia su activador de Cdc20 a Cdh1, que mantendrá bajas las ciclinas durante la siguiente G1.',
      clinica: 'Si el SAC falla o se debilita, los cromosomas se reparten mal y las hijas son aneuploides (inestabilidad cromosómica, frecuente en tumores). Los taxanos (paclitaxel, estabilizan microtúbulos) y los alcaloides de la vinca (vincristina, los despolimerizan) impiden uniones correctas, activan el SAC de forma sostenida y provocan detención mitótica y muerte celular; las células que «escapan» de esa detención (deslizamiento mitótico) contribuyen a la resistencia.',
      protagonistas: ['sep', 'crom'],
      acciones: [
        // El SAC ya está apagado: su maquinaria sale de escena para que la
        // anafase se lea.
        { at: 0,    tipo: 'release_inhibition', actor: 'sep' },
        { at: 0,    tipo: 'hide',     actor: 'auroraB' },
        { at: 0,    tipo: 'hide',     actor: 'knl1' },
        { at: 150,  tipo: 'hide',     actor: 'bub' },
        { at: 150,  tipo: 'hide',     actor: 'mad1' },
        { at: 150,  tipo: 'hide',     actor: 'mad2Libre' },
        { at: 300,  tipo: 'activate', actor: 'sep' },
        { at: 300,  tipo: 'hide',     actor: 'bubr1' },
        { at: 300,  tipo: 'hide',     actor: 'trip13' },
        // REVISAR: «sep→crom» del prompt como conector «activa»; el rótulo
        // aclara que la separasa corta la cohesina.
        { at: 800,  tipo: 'connect',  id: 'sep-crom', from: 'sep', to: 'crom', type: 'activa', label: 'Corta la cohesina' },
        { at: 1600, tipo: 'split',    actor: 'crom', into: [
          { actor: 'cromIzq', pos: { col: 7.4, row: 5 } },
          { actor: 'cromDer', pos: { col: 8.6, row: 5 } },
        ] },
        { at: 2100, tipo: 'bind',     actor: 'kUni', target: 'cromIzq', lado: 'izq' },
        { at: 2100, tipo: 'bind',     actor: 'kSin', target: 'cromDer', lado: 'der' },
        { at: 2900, tipo: 'move',     actor: 'cromIzq', to: { col: 3.4, row: 5 }, duration: 1200 },
        { at: 2900, tipo: 'move',     actor: 'cromDer', to: { col: 12.6, row: 5 }, duration: 1200 },
        { at: 2900, tipo: 'hide',     actor: 'mt1', duration: 900 },
        { at: 2950, tipo: 'hide',     actor: 'mt2', duration: 900 },
        { at: 3700, tipo: 'appear',   actor: 'mt1b', pos: { col: 1.45, row: 5 }, from: 'fade' },
        { at: 3700, tipo: 'appear',   actor: 'mt2b', pos: { col: 14.55, row: 5 }, from: 'fade' },
        { at: 4400, tipo: 'outcome',  kind: 'mitosis', pos: { col: 8, row: 9.2 }, texto: 'Anafase y salida de mitosis' },
      ],
    },
  ],
  distractores: [
    { id: 'hd1', tarjeta: 'El SAC activa a la separasa mientras haya cinetocoros sin unir.', porQueEsFalso: 'Es al revés: el SAC la mantiene inhibida, porque con APC/C bloqueado la securina se mantiene estable.' },
    { id: 'hd2', tarjeta: 'La separasa degrada a la ciclina B.', porQueEsFalso: 'La separasa corta la cohesina; la ciclina B la degrada el proteasoma tras la ubiquitinación por APC/C.' },
    { id: 'hd3', tarjeta: 'Mad2 cerrada activa a APC/C–Cdc20.', porQueEsFalso: 'C-Mad2 unida a Cdc20 forma parte del MCC, que inhibe a APC/C.' },
  ],
  preguntas: [
    {
      id: 'hq1',
      enunciado: '¿Por qué un solo cinetocoro sin unir detiene a toda la célula?',
      opciones: [
        'Porque degrada la cohesina de las cromátidas',
        'Porque activa a p53 y este detiene a la célula en M',
        'Porque actúa como molde que produce MCC sin parar',
        'Porque fosforila a RB y reprime los genes mitóticos',
      ],
      correcta: 2,
      explicacion: 'El cinetocoro libre con Mad1–Mad2 es un molde catalítico: convierte continuamente Mad2 abierta en cerrada y genera MCC, que inhibe a APC/C–Cdc20 en toda la célula.',
      pasoRelacionado: 'h2',
    },
    {
      id: 'hq2',
      enunciado: '¿Cuál es la diana directa de la separasa?',
      opciones: [
        'Rad21 (Scc1) de la cohesina',
        'La ciclina B unida a CDK1',
        'La securina, su chaperona',
        'Mad2 cerrada unida a Cdc20 en el MCC',
      ],
      correcta: 0,
      explicacion: 'La separasa es una proteasa de cisteína que corta la subunidad Rad21/Scc1 del anillo de cohesina; así se separan las cromátidas hermanas.',
      pasoRelacionado: 'h8',
    },
    {
      id: 'hq3',
      enunciado: 'El paclitaxel produce detención en metafase porque:',
      opciones: [
        'Inhibe a CDK1 y bloquea la fosforilación de las proteínas mitóticas',
        'Degrada la securina y deja a la separasa sin su inhibidor natural',
        'Activa a la separasa antes de que el último cinetocoro se haya unido al huso',
        'Estabiliza los microtúbulos, impide uniones con tensión y deja activo el SAC',
      ],
      correcta: 3,
      explicacion: 'Los taxanos estabilizan los microtúbulos, impiden uniones con la tensión correcta y mantienen activo el SAC de forma sostenida: la célula queda detenida en mitosis.',
      pasoRelacionado: 'h8',
    },
    {
      id: 'hq4',
      enunciado: '¿Qué pasa si el SAC es defectuoso?',
      opciones: [
        'Detención permanente de la célula en la fase G1 del ciclo',
        'Segregación errónea de cromosomas y aneuploidía',
        'Re-replicación del ADN y amplificación génica',
        'Apoptosis inmediata y obligatoria de la célula',
      ],
      correcta: 1,
      explicacion: 'Sin un SAC funcional la anafase empieza con cromosomas mal unidos: se reparten mal y las hijas son aneuploides (inestabilidad cromosómica).',
      pasoRelacionado: 'h8',
    },
    {
      id: 'hq5',
      enunciado: '¿Qué cinasa corrige las uniones sin tensión?',
      opciones: ['PLK1', 'Aurora A', 'Aurora B', 'ATR'],
      correcta: 2,
      explicacion: 'Aurora B, en el centrómero interno, fosforila la cola de Ndc80 de los cinetocoros sin tensión y suelta la unión para que se forme una correcta.',
      pasoRelacionado: 'h5',
    },
  ],
};

export default checkpoint;
