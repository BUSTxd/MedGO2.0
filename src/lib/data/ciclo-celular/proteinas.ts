// Fichas educativas del laboratorio «Checkpoints del ciclo celular», una por
// imagen (más `orc`, que es actor de intra-S aunque su celda llegó vacía).
// Fuente única: la sección 12 y el Apéndice C del prompt maestro — nada de
// hechos añadidos. `porCheckpoint` solo lista los checkpoints donde la
// molécula aparece como actor o se menciona en la narración de ese control.

import type { ProteinInfo } from './tipos';

const proteinas: Record<string, ProteinInfo> = {
  // ─── Motor del ciclo: ciclinas y CDK ───────────────────────────────────────
  ciclina_d: {
    id: 'ciclina_d',
    nombre: 'Ciclina D (D1)',
    gen: 'CCND1',
    familia: 'Ciclinas · G1',
    funcionGeneral: 'Sensor de mitógenos: su nivel depende de que la señal de crecimiento persista y activa a CDK4/6.',
    porCheckpoint: {
      restriccion: 'MYC y AP-1 inducen su transcripción; se une a CDK4/6 y el complejo hace la primera fosforilación de RB. AKT la estabiliza al inhibir a GSK3β, que la marcaría en Thr286 para su degradación.',
    },
    clinica: [
      't(11;14) en linfoma de células del manto (sobreexpresión de ciclina D1).',
      'Amplificación en cáncer de mama y de cabeza y cuello.',
    ],
  },
  ciclina_e: {
    id: 'ciclina_e',
    nombre: 'Ciclina E',
    gen: 'CCNE1',
    familia: 'Ciclinas · G1/S',
    funcionGeneral: 'Se une a CDK2 al final de G1 y forma el motor que compromete la entrada en fase S.',
    porCheckpoint: {
      restriccion: 'E2F la transcribe; ciclina E–CDK2 hiperfosforila RB y E2F induce más ciclina E: bucle de retroalimentación positiva.',
      g1s_dano: 'Ciclina E–CDK2 está lista para iniciar la fase S; p21, inducido por p53, la inhibe y la célula se detiene en G1.',
      intra_s: 'Ciclina E–CDK2, junto con DDK, dispara los orígenes licenciados al comenzar la fase S.',
    },
    clinica: [
      'Amplificación en cáncer de ovario y gástrico; causa estrés replicativo.',
      'Su sobreexpresión hace que las células tumorales dependan de ATR–Chk1.',
    ],
  },
  ciclina_a: {
    id: 'ciclina_a',
    nombre: 'Ciclina A',
    familia: 'Ciclinas · S y G2',
    funcionGeneral: 'Se une a CDK2 en fase S y a CDK1 en G2; sostiene la replicación e inicia la preparación de la mitosis.',
    porCheckpoint: {
      restriccion: 'Es una de las dianas de E2F libre; ciclina A–CDK2 sostiene la progresión tras cruzar el punto de restricción.',
      intra_s: 'Ciclina A–CDK2 fosforila CDC6 y ORC1 e impide una nueva licencia: cada tramo se copia una sola vez.',
      g2m: 'Ciclina A–CDK2/CDK1 inicia la preparación de la mitosis antes que la ciclina B y es necesaria para que Bora se una a Aurora A.',
    },
  },
  ciclina_b: {
    id: 'ciclina_b',
    nombre: 'Ciclina B (B1)',
    gen: 'CCNB1',
    familia: 'Ciclinas · M',
    funcionGeneral: 'Se une a CDK1 y forma el complejo que desencadena la mitosis (el antiguo factor promotor de la mitosis, MPF).',
    porCheckpoint: {
      g2m: 'Se acumula en G2 unida a CDK1, sobre todo en el citoplasma; GADD45 la separa de CDK1 y p21, vía DREAM, reprime su gen si hay daño.',
      huso: 'Mientras el MCC inhibe a APC/C–Cdc20 no se degrada; ciclina B–CDK1 inhibe además a la separasa. Su degradación apaga a CDK1 y permite salir de la mitosis.',
    },
  },
  cdk4_6: {
    id: 'cdk4_6',
    nombre: 'CDK4 / CDK6',
    gen: 'CDK4 / CDK6',
    familia: 'Cinasas dependientes de ciclina',
    funcionGeneral: 'Cinasa que, unida a la ciclina D, hace la primera fosforilación de RB en G1.',
    porCheckpoint: {
      restriccion: 'Ciclina D–CDK4/6 monofosforila a RB y E2F se libera parcialmente; p16 compite con la ciclina D por CDK4/6.',
      g1s_dano: 'p21 también inhibe a CDK4, además de a CDK2.',
    },
    clinica: [
      'Amplificación de CDK4 en liposarcoma.',
      'Diana de palbociclib, ribociclib y abemaciclib (cáncer de mama con receptores hormonales positivos).',
    ],
  },
  cdk2: {
    id: 'cdk2',
    nombre: 'CDK2',
    gen: 'CDK2',
    familia: 'Cinasas dependientes de ciclina',
    funcionGeneral: 'Cinasa de G1/S y S: con ciclina E y luego ciclina A impulsa la entrada en fase S y la replicación.',
    porCheckpoint: {
      restriccion: 'Ciclina E–CDK2 hiperfosforila RB y fosforila a p27 en Thr187, lo que lleva a su degradación.',
      g1s_dano: 'Tras el daño queda con sus fosfatos inhibidores Thr14/Tyr15 (Cdc25A se degrada) y p21 la inhibe.',
      intra_s: 'Dispara los orígenes junto con DDK; cuando Chk1 degrada a Cdc25A pierde actividad y los orígenes tardíos quedan en espera.',
      g2m: 'Ciclina A–CDK2 inicia la preparación de la mitosis; p21 la inhibe si hay daño.',
    },
  },
  cdk1: {
    id: 'cdk1',
    nombre: 'CDK1',
    gen: 'CDK1',
    familia: 'Cinasas dependientes de ciclina',
    funcionGeneral: 'Cinasa de la mitosis: unida a la ciclina B desencadena condensación cromosómica, ruptura de la envoltura nuclear y ensamblaje del huso.',
    porCheckpoint: {
      g2m: 'Wee1 y Myt1 la mantienen apagada (Thr14/Tyr15) y la CAK añade el fosfato activador en Thr161; Cdc25 la enciende y dos bucles de retroalimentación hacen la transición brusca.',
      huso: 'Ciclina B–CDK1 inhibe a la separasa; al degradarse la ciclina B, CDK1 se apaga y la célula sale de la mitosis.',
    },
  },

  // ─── Fosfatasas ────────────────────────────────────────────────────────────
  cdc25: {
    id: 'cdc25',
    nombre: 'Cdc25 (A, B y C)',
    gen: 'CDC25A / CDC25B / CDC25C',
    familia: 'Fosfatasas',
    funcionGeneral: 'Fosfatasa que retira los fosfatos inhibidores Thr14/Tyr15 de las CDK y así las activa.',
    porCheckpoint: {
      restriccion: 'CDC25A es una de las dianas de E2F cuando RB se fosforila por primera vez.',
      g1s_dano: 'Chk2/Chk1 fosforilan a Cdc25A, SCF–βTrCP la ubiquitina y se degrada: CDK2 se frena en minutos, sin transcripción.',
      intra_s: 'Chk1 provoca la degradación de Cdc25A: baja CDK2 y se bloquea el disparo de orígenes tardíos.',
      g2m: 'Cdc25B da la activación inicial en el centrosoma y Cdc25C amplifica; si hay daño, Chk1/Chk2 fosforilan a Cdc25C en Ser216 y 14-3-3 la retiene en el citoplasma.',
    },
  },
  wip1: {
    id: 'wip1',
    nombre: 'Wip1',
    gen: 'PPM1D',
    familia: 'Fosfatasas',
    funcionGeneral: 'Fosfatasa inducida por p53 que apaga la señal de daño retirando fosfatos.',
    porCheckpoint: {
      g1s_dano: 'Reparado el daño, desfosforila a p53, Chk1, Chk2, ATM y γH2AX y el ciclo puede reanudarse.',
      g2m: 'Desfosforila Chk1, Chk2, p53 y ATM para que la célula, ya reparada, entre en mitosis.',
    },
  },

  // ─── Degradación ───────────────────────────────────────────────────────────
  proteasoma: {
    id: 'proteasoma',
    nombre: 'Proteasoma 26S',
    familia: 'Degradación · ubiquitina–proteasoma',
    funcionGeneral: 'Complejo proteolítico que destruye las proteínas marcadas con cadenas de ubiquitina.',
    porCheckpoint: {
      restriccion: 'Degrada a p27 tras su ubiquitinación por SCF–Skp2.',
      g1s_dano: 'Destruye a p53 en condiciones basales (vía MDM2) y a Cdc25A tras el daño.',
      intra_s: 'Degrada a Cdc25A y a CDT1.',
      g2m: 'Degrada a Wee1 y, en la recuperación, a claspina.',
      huso: 'Destruye a la securina y a la ciclina B ubiquitinadas por APC/C–Cdc20.',
    },
  },
  e3_ligasa_scf: {
    id: 'e3_ligasa_scf',
    nombre: 'SCF (ubiquitina ligasa E3)',
    familia: 'Degradación · ubiquitina ligasas E3',
    funcionGeneral: 'Ubiquitina ligasa E3 que marca proteínas fosforiladas para su destrucción en el proteasoma; en estas vías actúa como SCF–Skp2 o SCF–βTrCP.',
    porCheckpoint: {
      restriccion: 'SCF–Skp2 ubiquitina a p27 fosforilado en Thr187 y retira así el freno de CDK2.',
      g1s_dano: 'SCF–βTrCP reconoce a Cdc25A fosforilada por Chk1/Chk2 y la envía al proteasoma.',
      intra_s: 'SCF–βTrCP degrada a Cdc25A; SCF–Skp2 (junto con CRL4–Cdt2) degrada a CDT1.',
      g2m: 'SCF–βTrCP degrada a Wee1 fosforilada por PLK1 y, en la recuperación, a claspina.',
    },
  },
  ubiquitina: {
    id: 'ubiquitina',
    nombre: 'Ubiquitina',
    familia: 'Degradación · ubiquitina–proteasoma',
    funcionGeneral: 'Pequeña proteína que, en cadenas, marca a otras proteínas para su degradación en el proteasoma.',
    porCheckpoint: {
      restriccion: 'SCF–Skp2 la añade a p27.',
      g1s_dano: 'MDM2 la añade a p53 en condiciones basales; SCF–βTrCP la añade a Cdc25A tras el daño.',
      intra_s: 'Marca a Cdc25A y a CDT1 para su destrucción.',
      g2m: 'Marca a Wee1 y a claspina para su destrucción.',
      huso: 'APC/C–Cdc20 la añade a securina y ciclina B para iniciar la anafase.',
    },
  },
  apc_c: {
    id: 'apc_c',
    nombre: 'APC/C (complejo promotor de la anafase / ciclosoma)',
    familia: 'Degradación · ubiquitina ligasas E3',
    funcionGeneral: 'Ubiquitina ligasa E3 que, con su activador Cdc20 o Cdh1, degrada a la securina y a las ciclinas mitóticas.',
    porCheckpoint: {
      restriccion: 'CDK2 contribuye a inactivar APC/C–Cdh1 (junto con Emi1), lo que permite que las ciclinas se acumulen.',
      intra_s: 'APC/C–Cdh1 activo en G1 mantiene degradada a la geminina y permite la licencia; tras la mitosis vuelve a degradarla.',
      huso: 'El MCC lo inhibe mientras quede un cinetocoro sin unir; libre, APC/C–Cdc20 ubiquitina a securina y ciclina B y empieza la anafase. Al final de M cambia Cdc20 por Cdh1.',
    },
  },

  // ─── Señal mitogénica ──────────────────────────────────────────────────────
  factor_crecimiento: {
    id: 'factor_crecimiento',
    nombre: 'Factor de crecimiento',
    familia: 'Señal mitogénica',
    funcionGeneral: 'Ligando extracelular que se une a su receptor tirosina cinasa y pone en marcha la señal para dividirse.',
    porCheckpoint: {
      restriccion: 'Su unión dimeriza el receptor tirosina cinasa; tras cruzar el punto de restricción la célula ya no depende de él.',
    },
  },
  receptor_rtk: {
    id: 'receptor_rtk',
    nombre: 'Receptor tirosina cinasa (RTK)',
    familia: 'Señal mitogénica',
    funcionGeneral: 'Receptor de membrana que dimeriza al unir su ligando y fosforila tirosinas del otro monómero.',
    porCheckpoint: {
      restriccion: 'Sus fosfotirosinas reclutan a GRB2 y SOS, que activan a RAS; también activa a PI3K.',
    },
  },
  ras_gtp: {
    id: 'ras_gtp',
    nombre: 'RAS-GTP',
    gen: 'KRAS / HRAS / NRAS',
    familia: 'Señal mitogénica',
    funcionGeneral: 'GTPasa anclada a la membrana (por farnesilación) que, unida a GTP, transmite la señal del receptor.',
    porCheckpoint: {
      restriccion: 'SOS cambia GDP por GTP en RAS; RAS-GTP activa la cascada RAF–MEK–ERK.',
      intra_s: 'Su activación oncogénica fuerza el disparo de demasiados orígenes y causa estrés replicativo.',
    },
    clinica: [
      'Mutaciones activadoras de KRAS (páncreas, colon, pulmón) dejan a RAS encendido sin factor de crecimiento; NRAS en melanoma.',
    ],
  },
  cascada_mapk: {
    id: 'cascada_mapk',
    nombre: 'Cascada MAPK (RAF → MEK → ERK)',
    familia: 'Señal mitogénica',
    funcionGeneral: 'Tres cinasas en serie que llevan la señal de RAS al núcleo.',
    porCheckpoint: {
      restriccion: 'ERK fosforilado entra al núcleo, activa FOS, JUN/AP-1 y ETS e induce a MYC: se transcribe la ciclina D.',
    },
  },
  pi3k: {
    id: 'pi3k',
    nombre: 'PI3K (fosfoinositol 3-cinasa)',
    familia: 'Señal mitogénica',
    funcionGeneral: 'Cinasa activada por el receptor que enciende a AKT.',
    porCheckpoint: {
      restriccion: 'En paralelo a la cascada MAPK, activa a AKT, que estabiliza la ciclina D.',
    },
  },
  akt: {
    id: 'akt',
    nombre: 'AKT',
    familia: 'Señal mitogénica',
    funcionGeneral: 'Cinasa de supervivencia y crecimiento activada por PI3K.',
    porCheckpoint: {
      restriccion: 'Fosforila e inhibe a GSK3β (Ser9), estabilizando la ciclina D; activa mTOR y promueve la salida de p27 del núcleo.',
    },
  },
  gsk3b: {
    id: 'gsk3b',
    nombre: 'GSK3β',
    gen: 'GSK3B',
    familia: 'Señal mitogénica',
    funcionGeneral: 'Cinasa que marca a la ciclina D para su exportación nuclear y degradación.',
    porCheckpoint: {
      restriccion: 'Fosforila la ciclina D1 en Thr286; AKT la inhibe y la ciclina D se acumula.',
    },
  },
  membrana_plasmatica: {
    id: 'membrana_plasmatica',
    nombre: 'Membrana plasmática',
    familia: 'Estructuras celulares',
    funcionGeneral: 'Bicapa lipídica que separa la célula del medio y donde se ancla el receptor tirosina cinasa.',
    porCheckpoint: {
      restriccion: 'Sede de la llegada de la señal mitogénica: el factor de crecimiento se une a su receptor en la membrana.',
    },
  },

  // ─── Factores de transcripción y represión ─────────────────────────────────
  myc_max: {
    id: 'myc_max',
    nombre: 'MYC–MAX',
    gen: 'MYC',
    familia: 'Factores de transcripción',
    funcionGeneral: 'Heterodímero que activa la transcripción de genes de proliferación.',
    porCheckpoint: {
      restriccion: 'Inducido por ERK, activa junto con AP-1 la transcripción de CCND1 (ciclina D1).',
      g1s_dano: 'MYC hiperactivo induce p14ARF (estrés oncogénico), que estabiliza a p53.',
      intra_s: 'Su activación oncogénica fuerza el disparo de demasiados orígenes: estrés replicativo.',
    },
    clinica: [
      't(8;14) pone MYC bajo el promotor de las inmunoglobulinas: linfoma de Burkitt.',
      'Amplificación de N-MYC en neuroblastoma.',
    ],
  },
  e2f_dp1: {
    id: 'e2f_dp1',
    nombre: 'E2F–DP1',
    gen: 'E2F1–3 / DP1',
    familia: 'Factores de transcripción',
    funcionGeneral: 'Factor de transcripción de los genes de fase S; RB hipofosforilado lo mantiene reprimido.',
    porCheckpoint: {
      restriccion: 'Libre de RB transcribe ciclina E, ciclina A, CDC25A, CDC6, CDT1, MCM, PCNA y otros genes de la replicación; induce más ciclina E en un bucle positivo.',
      g1s_dano: 'Cuando p21 frena a CDK2, RB vuelve a unirse a E2F y los genes de fase S se apagan. E2F1 hiperactivo induce p14ARF.',
    },
  },
  rb: {
    id: 'rb',
    nombre: 'RB (proteína del retinoblastoma)',
    gen: 'RB1',
    familia: 'Inhibidores / frenos · proteínas de bolsillo',
    funcionGeneral: 'Freno de G1: hipofosforilado secuestra a E2F en su bolsillo y recluta represores de la cromatina.',
    porCheckpoint: {
      restriccion: 'Ciclina D–CDK4/6 la monofosforila y ciclina E–CDK2 la hiperfosforila: E2F queda libre y la célula cruza el punto de no retorno.',
      g1s_dano: 'Sin nuevas fosforilaciones (p21 inhibe a las CDK) vuelve a unirse a E2F y la célula se detiene en G1.',
    },
    clinica: [
      'Retinoblastoma hereditario (doble golpe de Knudson) y osteosarcoma.',
      'La oncoproteína E7 del VPH ocupa su bolsillo y libera a E2F.',
    ],
  },
  hdac: {
    id: 'hdac',
    nombre: 'HDAC (histona desacetilasa)',
    familia: 'Inhibidores / frenos · represores de la cromatina',
    funcionGeneral: 'Enzima que compacta la cromatina y apaga la transcripción.',
    porCheckpoint: {
      restriccion: 'RB la recluta sobre los genes de fase S: la represión es activa, no solo por bloqueo de E2F.',
    },
  },

  // ─── Eje p53 ───────────────────────────────────────────────────────────────
  p53_monomero: {
    id: 'p53_monomero',
    nombre: 'p53',
    gen: 'TP53',
    familia: 'Factores de transcripción · supresor tumoral',
    funcionGeneral: '«Guardián del genoma»: factor de transcripción que, ante daño o estrés oncogénico, detiene el ciclo, activa la reparación o induce apoptosis o senescencia.',
    porCheckpoint: {
      g1s_dano: 'En la célula sana MDM2 lo degrada; ATM/ATR lo fosforilan en Ser15 y Chk2/Chk1 en Ser20, se libera de MDM2 y se acumula.',
      g2m: 'Si el daño persiste, sostiene la detención en G2 induciendo p21, GADD45 y 14-3-3σ.',
    },
    clinica: [
      'TP53 es el gen más mutado en el cáncer humano (alrededor de la mitad de los tumores).',
      'Su mutación germinal causa el síndrome de Li-Fraumeni.',
      'La oncoproteína E6 del VPH lo degrada a través de la ligasa E6AP.',
    ],
  },
  p53_tetramero: {
    id: 'p53_tetramero',
    nombre: 'p53 (tetrámero unido al ADN)',
    gen: 'TP53',
    familia: 'Factores de transcripción · supresor tumoral',
    funcionGeneral: 'Forma activa de p53: cuatro unidades unidas a elementos de respuesta en los promotores de sus genes diana.',
    porCheckpoint: {
      g1s_dano: 'Activa p21 (detención en G1), GADD45 y genes de reparación, y según el daño MDM2 y Wip1 (apagado), BAX, PUMA, NOXA y FAS (apoptosis) o la senescencia.',
      g2m: 'Induce p21, GADD45 y 14-3-3σ, que mantienen apagada a ciclina B–CDK1 durante horas.',
    },
    clinica: [
      'Síndrome de Li-Fraumeni: sarcomas, cáncer de mama, tumores cerebrales, leucemias y carcinoma suprarrenal a edad temprana.',
      'Las células tumorales sin p53 dependen del control G2/M para sobrevivir al daño.',
    ],
  },
  mdm2: {
    id: 'mdm2',
    nombre: 'MDM2',
    gen: 'MDM2',
    familia: 'Inhibidores / frenos · ubiquitina ligasa E3',
    funcionGeneral: 'Ubiquitina ligasa E3 que se une a p53, lo ubiquitina y lo envía al proteasoma.',
    porCheckpoint: {
      g1s_dano: 'Mantiene p53 casi indetectable; ATM la fosforila (Ser395) y suelta a p53. p53 la induce de nuevo (retroalimentación negativa) y p14ARF la secuestra en el nucléolo.',
    },
    clinica: [
      'Amplificación en liposarcoma y otros sarcomas: inactiva p53 sin mutarlo.',
      'Diana de inhibidores tipo nutlina.',
    ],
  },
  p14arf: {
    id: 'p14arf',
    nombre: 'p14ARF',
    gen: 'CDKN2A (marco de lectura alternativo)',
    familia: 'Inhibidores / frenos · inhibidor de MDM2',
    funcionGeneral: 'Comparte locus con p16 pero no inhibe CDK: secuestra a MDM2 y estabiliza a p53.',
    porCheckpoint: {
      restriccion: 'No inhibe a CDK4: el inhibidor directo de CDK4/6 es p16INK4a.',
      g1s_dano: 'Ante oncogenes hiperactivos (MYC, E2F1) retiene a MDM2 en el nucléolo y p53 queda libre: barrera frente al estrés oncogénico.',
    },
    clinica: [
      'Se pierde junto con p16 en la deleción de CDKN2A, frecuente en múltiples tumores: caen a la vez la vía RB y la vía p53.',
    ],
  },

  // ─── Inhibidores de CDK ────────────────────────────────────────────────────
  p16: {
    id: 'p16',
    nombre: 'p16INK4a',
    gen: 'CDKN2A',
    familia: 'Inhibidores de CDK · INK4',
    funcionGeneral: 'Inhibidor específico de CDK4/6: se une a la cinasa e impide la unión de la ciclina D.',
    porCheckpoint: {
      restriccion: 'Freno de fondo en G1: compite con la ciclina D por CDK4/6 y mantiene a RB hipofosforilado.',
      g1s_dano: 'Sostiene, después de p21, la detención permanente de la senescencia.',
    },
    clinica: [
      'Deleción en melanoma familiar, cáncer de páncreas y glioblastoma.',
      'La misma deleción de CDKN2A elimina p14ARF.',
    ],
  },
  p21: {
    id: 'p21',
    nombre: 'p21 (Cip1/Waf1)',
    gen: 'CDKN1A',
    familia: 'Inhibidores de CDK · Cip/Kip',
    funcionGeneral: 'Inhibidor de complejos ciclina–CDK y efector principal de p53 para detener el ciclo.',
    porCheckpoint: {
      restriccion: 'Ayuda a ensamblar e importar al núcleo ciclina D–CDK4 sin inhibirlo, lo que lo retira de CDK2.',
      g1s_dano: 'Inducido por p53, inhibe ciclina E–CDK2 (y ciclina A–CDK2 y CDK4) y se une a PCNA: RB sigue hipofosforilado y la célula se detiene en G1.',
      g2m: 'Inhibe CDK1 y CDK2 y, vía el complejo DREAM, reprime genes de mitosis como ciclina B, CDK1, CDC25C y PLK1.',
    },
    clinica: [
      'Su inducción es el mecanismo por el que p53 detiene el ciclo tras radioterapia o quimioterapia.',
    ],
  },
  p27: {
    id: 'p27',
    nombre: 'p27 (Kip1)',
    gen: 'CDKN1B',
    familia: 'Inhibidores de CDK · Cip/Kip',
    funcionGeneral: 'Inhibidor de CDK2 que frena la entrada en fase S hasta que ciclina E–CDK2 lo elimina.',
    porCheckpoint: {
      restriccion: 'Frena a ciclina E–CDK2; CDK2 lo fosforila en Thr187, SCF–Skp2 lo ubiquitina y el proteasoma lo degrada.',
    },
    clinica: ['Baja expresión asociada a peor pronóstico en varios carcinomas.'],
  },
  gadd45: {
    id: 'gadd45',
    nombre: 'GADD45',
    familia: 'Reparación',
    funcionGeneral: 'Proteína inducida por p53 que facilita el acceso a la cromatina dañada y frena la mitosis.',
    porCheckpoint: {
      g1s_dano: 'Con el ciclo detenido, p53 la induce junto con genes de reparación (NER, BER).',
      g2m: 'Disocia el complejo ciclina B–CDK1 y sostiene la detención en G2.',
    },
  },

  // ─── ADN y lesiones ────────────────────────────────────────────────────────
  adn_helice: {
    id: 'adn_helice',
    nombre: 'ADN (doble hélice)',
    familia: 'Estructuras · ADN',
    funcionGeneral: 'Material genético; sus genes son el molde de las proteínas de cada vía.',
    porCheckpoint: {
      restriccion: 'Los genes de ciclina D (CCND1) y de fase S, reprimidos por RB y activados por E2F.',
      g1s_dano: 'El ADN que no debe copiarse dañado; sobre él actúa p53 como factor de transcripción.',
      intra_s: 'Unos 6 000 millones de pares de bases que deben copiarse exactamente una vez.',
      g2m: 'Ya replicado: cada cromosoma tiene dos cromátidas hermanas.',
    },
  },
  gen_activo: {
    id: 'gen_activo',
    nombre: 'Gen en transcripción',
    familia: 'Estructuras · ADN',
    funcionGeneral: 'Doble hélice abierta de la que sale el ARNm de un gen activo.',
    porCheckpoint: {
      restriccion: 'MYC transcribe la ciclina D; E2F libre transcribe la ciclina E y los genes de fase S.',
      g1s_dano: 'p53 transcribe p21, GADD45, MDM2 y los genes de apoptosis.',
      g2m: 'p53 transcribe p21, GADD45 y 14-3-3σ.',
    },
  },
  adn_rotura_doble: {
    id: 'adn_rotura_doble',
    nombre: 'Rotura de doble cadena',
    familia: 'Estructuras · daño al ADN',
    funcionGeneral: 'Corte de ambas cadenas del ADN: la lesión más peligrosa, porque sin reparar se pierden fragmentos de cromosoma.',
    porCheckpoint: {
      g1s_dano: 'La radiación ionizante la produce; MRN la reconoce y activa a ATM. En G1 se repara sobre todo por unión de extremos no homólogos (NHEJ).',
      intra_s: 'Aparece si una horquilla detenida colapsa, y se repara por recombinación homóloga.',
      g2m: 'Activa ATM y, tras la resección, ATR; se repara por recombinación homóloga usando la cromátida hermana.',
    },
  },
  adn_cadena_simple: {
    id: 'adn_cadena_simple',
    nombre: 'ADN de cadena simple',
    familia: 'Estructuras · daño al ADN',
    funcionGeneral: 'Tramo de ADN con una sola cadena expuesta, recubierto por RPA: la señal que activa a ATR.',
    porCheckpoint: {
      g1s_dano: 'Lo exponen la luz UV y las horquillas detenidas; RPA lo recubre y recluta ATR–ATRIP.',
      intra_s: 'Se acumula cuando la polimerasa se detiene y la helicasa sigue abriendo (desacoplamiento).',
      g2m: 'La resección de las roturas lo genera y activa el eje ATR–Chk1, el más importante para la detención en G2.',
    },
  },
  dimero_timina: {
    id: 'dimero_timina',
    nombre: 'Dímero de pirimidina (timina)',
    familia: 'Estructuras · daño al ADN',
    funcionGeneral: 'Lesión que produce la luz UV y que bloquea la replicación.',
    porCheckpoint: {
      g1s_dano: 'La luz UV forma dímeros de pirimidina que exponen ADN de cadena simple (eje ATR).',
      intra_s: 'Detiene la polimerasa frente a la lesión y causa estrés replicativo.',
    },
  },
  radiacion: {
    id: 'radiacion',
    nombre: 'Radiación ionizante',
    familia: 'Estructuras · agentes de daño',
    funcionGeneral: 'Genera radicales libres (sobre todo por radiólisis del agua) y roturas de doble cadena en el ADN.',
    porCheckpoint: {
      g1s_dano: 'Rompe ambas cadenas del ADN y activa MRN–ATM–Chk2.',
      g2m: 'Una rotura en G2 activa ATM y ATR, que activan Chk2 y Chk1.',
    },
    clinica: [
      'La radioterapia funciona provocando daño que activa esta vía; las células con p53 funcional tienden a detenerse o morir por apoptosis.',
    ],
  },

  // ─── Sensores y cinasas de daño ────────────────────────────────────────────
  mrn: {
    id: 'mrn',
    nombre: 'Complejo MRN (MRE11–RAD50–NBS1)',
    gen: 'MRE11 / RAD50 / NBN',
    familia: 'Sensores y cinasas de daño',
    funcionGeneral: 'Sensor de roturas de doble cadena: sujeta los extremos rotos y recluta a ATM.',
    porCheckpoint: {
      g1s_dano: 'MRE11 (nucleasa), RAD50 (brazos que mantienen juntos los extremos) y NBS1 (recluta ATM) reconocen la rotura.',
      g2m: 'Activa a ATM en la rotura; con BRCA1 y CtIP participa en la resección de los extremos.',
    },
    clinica: ['Mutaciones de NBS1: síndrome de rotura de Nijmegen (microcefalia, inmunodeficiencia, linfomas).'],
  },
  atm: {
    id: 'atm',
    nombre: 'ATM',
    gen: 'ATM',
    familia: 'Sensores y cinasas de daño',
    funcionGeneral: 'Cinasa que responde sobre todo a roturas de doble cadena y activa a Chk2 y a p53.',
    porCheckpoint: {
      g1s_dano: 'Se autofosforila en Ser1981 y pasa de dímero a monómeros activos; fosforila H2AX (γH2AX), Chk2 (Thr68), p53 (Ser15) y MDM2 (Ser395).',
      intra_s: 'No es el principal sensor de las horquillas detenidas: ese papel es de ATR.',
      g2m: 'Activa a Chk2 tras una rotura en G2 y fosforila a BRCA1.',
    },
    clinica: [
      'Ataxia-telangiectasia: ataxia cerebelosa, telangiectasias, inmunodeficiencia, radiosensibilidad y riesgo de linfoma.',
    ],
  },
  atr_atrip: {
    id: 'atr_atrip',
    nombre: 'ATR–ATRIP',
    gen: 'ATR / ATRIP',
    familia: 'Sensores y cinasas de daño',
    funcionGeneral: 'Cinasa que se activa sobre ADN de cadena simple recubierto por RPA y activa a Chk1.',
    porCheckpoint: {
      g1s_dano: 'Responde al ADN de cadena simple (UV, horquillas detenidas) y fosforila p53 en Ser15.',
      intra_s: 'ATRIP la lleva a la capa de RPA; 9-1-1 y TopBP1 la activan por completo y fosforila Chk1 con ayuda de claspina. Protege la horquilla detenida.',
      g2m: 'La resección de las roturas la activa; es el eje más importante para la detención en G2.',
    },
    clinica: [
      'Mutaciones hipomórficas: síndrome de Seckel (microcefalia, enanismo proporcionado).',
      'Diana de inhibidores de ATR en tumores con estrés replicativo.',
    ],
  },
  rpa: {
    id: 'rpa',
    nombre: 'RPA (proteína de replicación A)',
    familia: 'Sensores y cinasas de daño',
    funcionGeneral: 'Recubre el ADN de cadena simple y sirve de plataforma para reclutar a ATR–ATRIP.',
    porCheckpoint: {
      g1s_dano: 'Recubre el ADN de cadena simple expuesto y recluta ATR–ATRIP.',
      intra_s: 'Cubre el tramo que deja la horquilla detenida; también recluta a ETAA1, activador alternativo de ATR.',
      g2m: 'Recubre los extremos resecados; BRCA2 la desplaza para cargar RAD51.',
    },
  },
  chk1: {
    id: 'chk1',
    nombre: 'Chk1',
    gen: 'CHEK1',
    familia: 'Sensores y cinasas de daño',
    funcionGeneral: 'Cinasa difusible activada por ATR que lleva la señal de daño a sus dianas.',
    porCheckpoint: {
      g1s_dano: 'Fosforila a Cdc25A (que se degrada) y a p53 en Ser20.',
      intra_s: 'ATR la fosforila en Ser317 y Ser345; provoca la degradación de Cdc25A y frena los orígenes tardíos. Es esencial incluso sin daño exógeno.',
      g2m: 'Fosforila Cdc25C en Ser216 y activa a Wee1; PLK1 y Wip1 la apagan en la recuperación.',
    },
    clinica: ['Diana de inhibidores de Chk1 combinados con quimioterapia o radioterapia.'],
  },
  chk2: {
    id: 'chk2',
    nombre: 'Chk2',
    gen: 'CHEK2',
    familia: 'Sensores y cinasas de daño',
    funcionGeneral: 'Cinasa difusible activada por ATM que lleva la señal de rotura a sus dianas.',
    porCheckpoint: {
      g1s_dano: 'ATM la fosforila en Thr68; fosforila a Cdc25A (que se degrada) y a p53 en Ser20.',
      g2m: 'Fosforila a Cdc25C en Ser216 y a BRCA1.',
    },
    clinica: ['Variante 1100delC: mayor riesgo de cáncer de mama; variantes en Li-Fraumeni-like.'],
  },
  clamp_911: {
    id: 'clamp_911',
    nombre: 'Anillo 9-1-1 (RAD9–HUS1–RAD1)',
    gen: 'RAD9 / HUS1 / RAD1',
    familia: 'Sensores y cinasas de daño',
    funcionGeneral: 'Pinza trimérica que RAD17–RFC carga en la unión entre ADN simple y doble.',
    porCheckpoint: {
      intra_s: 'Trae a TopBP1, que activa por completo a ATR: la doble exigencia (RPA y 9-1-1) asegura que ATR solo se active en estructuras anómalas.',
    },
  },
  topbp1: {
    id: 'topbp1',
    nombre: 'TopBP1',
    gen: 'TOPBP1',
    familia: 'Sensores y cinasas de daño',
    funcionGeneral: 'Proteína andamio que estimula la actividad cinasa de ATR.',
    porCheckpoint: {
      intra_s: 'Anclado al anillo 9-1-1, enciende por completo a ATR.',
    },
  },
  claspina: {
    id: 'claspina',
    nombre: 'Claspina',
    familia: 'Sensores y cinasas de daño · mediadores',
    funcionGeneral: 'Adaptador que permite a ATR fosforilar a Chk1.',
    porCheckpoint: {
      intra_s: 'Con Timeless–Tipin, que viajan con la horquilla, actúa de puente entre ATR y Chk1.',
      g2m: 'En la recuperación, PLK1 la fosforila, SCF–βTrCP la degrada y Chk1 deja de activarse.',
    },
  },

  // ─── Replicación ───────────────────────────────────────────────────────────
  orc: {
    id: 'orc',
    nombre: 'ORC (complejo de reconocimiento del origen)',
    gen: 'ORC1–6',
    familia: 'Replicación · licencia de orígenes',
    funcionGeneral: 'Complejo de seis subunidades que marca los orígenes de replicación.',
    porCheckpoint: {
      intra_s: 'Unido al origen en G1, recibe a CDC6 y CDT1, que cargan la helicasa MCM. Ciclina A–CDK2 fosforila ORC1 para impedir una nueva licencia.',
    },
    clinica: ['Síndrome de Meier-Gorlin (mutaciones en genes de licencia: ORC, CDT1, CDC6).'],
  },
  mcm_helicasa: {
    id: 'mcm_helicasa',
    nombre: 'Helicasa MCM (MCM2–7)',
    gen: 'MCM2–7',
    familia: 'Replicación · licencia de orígenes',
    funcionGeneral: 'Helicasa replicativa: doble hexámero que rodea el ADN y, activada, abre la doble hélice.',
    porCheckpoint: {
      restriccion: 'Sus componentes están entre las dianas de E2F (licencia de orígenes).',
      intra_s: 'Se carga inactiva en G1 (origen licenciado); DDK y CDK la activan en S y forma la helicasa CMG. Con Chk1 activa, los orígenes tardíos quedan en espera.',
    },
  },
  cdc6: {
    id: 'cdc6',
    nombre: 'CDC6',
    gen: 'CDC6',
    familia: 'Replicación · licencia de orígenes',
    funcionGeneral: 'Proteína cargadora que, con CDT1, coloca la helicasa MCM sobre los orígenes en G1.',
    porCheckpoint: {
      restriccion: 'Diana de E2F libre: parte de la preparación para la fase S.',
      intra_s: 'Carga MCM en G1; en S, ciclina A–CDK2 la fosforila y es exportada al citoplasma.',
    },
    clinica: [
      'Síndrome de Meier-Gorlin.',
      'Su sobreexpresión causa re-replicación, amplificaciones génicas e inestabilidad genómica en tumores.',
    ],
  },
  cdt1: {
    id: 'cdt1',
    nombre: 'CDT1',
    gen: 'CDT1',
    familia: 'Replicación · licencia de orígenes',
    funcionGeneral: 'Proteína cargadora que, con CDC6, coloca la helicasa MCM sobre los orígenes en G1.',
    porCheckpoint: {
      restriccion: 'Diana de E2F libre: parte de la preparación para la fase S.',
      intra_s: 'En S la degradan CRL4–Cdt2 y SCF–Skp2, y la geminina la bloquea: no hay nueva licencia.',
    },
    clinica: [
      'Síndrome de Meier-Gorlin.',
      'Su exceso causa re-replicación y amplificación génica.',
    ],
  },
  ddk: {
    id: 'ddk',
    nombre: 'DDK (Cdc7–Dbf4)',
    gen: 'CDC7 / DBF4',
    familia: 'Replicación · disparo de orígenes',
    funcionGeneral: 'Cinasa que, junto con CDK, dispara los orígenes licenciados.',
    porCheckpoint: {
      intra_s: 'Fosforila MCM al comenzar la fase S; cuando baja su actividad (y la de CDK) no se forman nuevas CMG en orígenes tardíos.',
    },
  },
  horquilla_replicacion: {
    id: 'horquilla_replicacion',
    nombre: 'Horquilla de replicación',
    familia: 'Estructuras · replicación',
    funcionGeneral: 'Zona en Y donde la helicasa abre el ADN y las polimerasas copian cada cadena.',
    porCheckpoint: {
      intra_s: 'Si choca con una lesión o faltan nucleótidos se detiene; ATR–Chk1 la mantienen estable hasta que se repara o se sortea la lesión y se reinicia.',
    },
  },
  geminina: {
    id: 'geminina',
    nombre: 'Geminina',
    gen: 'GMNN',
    familia: 'Inhibidores / frenos · inhibidor de la licencia',
    funcionGeneral: 'Se une a CDT1 y lo inhibe para impedir la re-replicación.',
    porCheckpoint: {
      intra_s: 'Estable desde que APC/C–Cdh1 se apaga en G1/S, secuestra a CDT1; tras la mitosis APC/C la degrada y la licencia vuelve a ser posible.',
    },
    clinica: ['Su pérdida causa re-replicación e inestabilidad genómica en tumores.'],
  },

  // ─── Reparación ────────────────────────────────────────────────────────────
  brca1: {
    id: 'brca1',
    nombre: 'BRCA1',
    gen: 'BRCA1',
    familia: 'Reparación · recombinación homóloga',
    funcionGeneral: 'Promueve la resección de las roturas y dirige su reparación por recombinación homóloga.',
    porCheckpoint: {
      intra_s: 'Si la horquilla colapsa, participa en la recombinación homóloga con la cromátida hermana.',
      g2m: 'Fosforilado por ATM, ATR y Chk2, favorece la resección con CtIP y MRE11, se opone a 53BP1 y es necesario para activar bien a Chk1 tras radiación.',
    },
    clinica: [
      'Cáncer de mama y ovario hereditario.',
      'Sensibilidad a inhibidores de PARP (olaparib) por letalidad sintética.',
    ],
  },
  brca2: {
    id: 'brca2',
    nombre: 'BRCA2',
    gen: 'BRCA2',
    familia: 'Reparación · recombinación homóloga',
    funcionGeneral: 'Carga RAD51 sobre el ADN de cadena simple para la recombinación homóloga.',
    porCheckpoint: {
      intra_s: 'Si la horquilla colapsa, participa en la recombinación homóloga con la cromátida hermana.',
      g2m: 'Unido a BRCA1 a través de PALB2, desplaza a RPA y carga RAD51.',
    },
    clinica: [
      'Cáncer de mama (incluido el masculino), ovario, próstata y páncreas.',
      'Anemia de Fanconi (grupo FANCD1).',
      'Sensibilidad a inhibidores de PARP por letalidad sintética.',
    ],
  },
  rad51_filamento: {
    id: 'rad51_filamento',
    nombre: 'Filamento de RAD51',
    gen: 'RAD51',
    familia: 'Reparación · recombinación homóloga',
    funcionGeneral: 'Filamento nucleoproteico que busca la secuencia homóloga e invade la cromátida hermana para usarla de molde.',
    porCheckpoint: {
      intra_s: 'Si la horquilla colapsa en una rotura de doble cadena, la repara por recombinación homóloga.',
      g2m: 'Cargado por BRCA2, forma el lazo D, sintetiza la secuencia faltante y repara sin errores.',
    },
  },

  // ─── Control G2/M ──────────────────────────────────────────────────────────
  wee1: {
    id: 'wee1',
    nombre: 'Wee1',
    gen: 'WEE1',
    familia: 'Inhibidores / frenos · cinasas inhibidoras de CDK',
    funcionGeneral: 'Cinasa nuclear que fosforila a CDK1 (Tyr15) y la mantiene apagada.',
    porCheckpoint: {
      g2m: 'Mantiene inactiva a ciclina B–CDK1; PLK1 y CDK1 la marcan para su degradación por SCF–βTrCP. Si hay daño, Chk1 la fosforila y la estabiliza.',
      g1s_dano: 'Sus fosfatos inhibidores en CDK2 quedan puestos cuando Cdc25A se degrada.',
    },
    clinica: ['Diana de adavosertib en tumores con p53 mutado.'],
  },
  myt1: {
    id: 'myt1',
    nombre: 'Myt1',
    familia: 'Inhibidores / frenos · cinasas inhibidoras de CDK',
    funcionGeneral: 'Cinasa de las membranas citoplasmáticas que fosforila a CDK1 (Thr14) y la mantiene apagada.',
    porCheckpoint: {
      g2m: 'Junto con Wee1 añade los fosfatos inhibidores que mantienen un depósito de ciclina B–CDK1 cargado pero inactivo.',
    },
  },
  proteina_14_3_3: {
    id: 'proteina_14_3_3',
    nombre: 'Proteína 14-3-3 (y 14-3-3σ)',
    gen: 'SFN (14-3-3σ)',
    familia: 'Inhibidores / frenos · proteínas de secuestro',
    funcionGeneral: 'Se une a proteínas fosforiladas y las retiene en el citoplasma.',
    porCheckpoint: {
      g2m: 'Reconoce a Cdc25C fosforilada en Ser216 y la saca del núcleo; 14-3-3σ, inducida por p53, secuestra a ciclina B1–CDK1 en el citoplasma.',
    },
  },
  plk1: {
    id: 'plk1',
    nombre: 'PLK1',
    gen: 'PLK1',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Cinasa que acelera la entrada en mitosis: activa a Cdc25 y marca a Wee1 para su destrucción.',
    porCheckpoint: {
      g2m: 'Aurora A la activa (Thr210); enciende a Cdc25 y apaga a Wee1. En la recuperación degrada a claspina.',
      huso: 'Participa en la retirada de la cohesina de los brazos en profase (vía WAPL).',
    },
  },
  aurora_a: {
    id: 'aurora_a',
    nombre: 'Aurora A',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Cinasa del centrosoma que activa a PLK1.',
    porCheckpoint: {
      g2m: 'Con su cofactor Bora fosforila a PLK1 en Thr210.',
    },
  },
  bora: {
    id: 'bora',
    nombre: 'Bora',
    gen: 'BORA',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Cofactor de Aurora A para activar a PLK1.',
    porCheckpoint: {
      g2m: 'Se une a Aurora A (lo que requiere ciclina A–CDK) y permite la activación de PLK1.',
    },
  },

  // ─── Cinetocoro y SAC ──────────────────────────────────────────────────────
  aurora_b: {
    id: 'aurora_b',
    nombre: 'Aurora B',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Cinasa del complejo pasajero cromosómico que corrige las uniones cinetocoro–microtúbulo sin tensión.',
    porCheckpoint: {
      huso: 'Con INCENP, survivina y borealina en el centrómero interno, fosforila Ndc80 en las uniones sintélicas o merotélicas y las suelta.',
    },
  },
  separasa: {
    id: 'separasa',
    nombre: 'Separasa',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Proteasa de cisteína que corta la cohesina y permite separar las cromátidas hermanas.',
    porCheckpoint: {
      huso: 'Bloqueada por la securina y por ciclina B–CDK1; libre, corta Rad21/Scc1 y empieza la anafase.',
    },
  },
  securina: {
    id: 'securina',
    nombre: 'Securina',
    familia: 'Inhibidores / frenos · inhibidor de la separasa',
    funcionGeneral: 'Chaperona e inhibidor de la separasa.',
    porCheckpoint: {
      huso: 'Mientras APC/C está inhibido sujeta a la separasa; APC/C–Cdc20 la ubiquitina y el proteasoma la destruye.',
    },
  },
  trip13_p31: {
    id: 'trip13_p31',
    nombre: 'TRIP13 + p31comet',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'ATPasa AAA+ que, con p31comet, desarma el MCC.',
    porCheckpoint: {
      huso: 'p31comet se une a Mad2 cerrada y TRIP13 la despliega a su forma abierta, liberando a Cdc20.',
    },
  },
  cromatidas_cohesina: {
    id: 'cromatidas_cohesina',
    nombre: 'Cromátidas hermanas unidas por cohesina',
    familia: 'Estructuras · cromosomas',
    funcionGeneral: 'Las dos copias de un cromosoma replicado, mantenidas juntas por anillos de cohesina hasta la anafase.',
    porCheckpoint: {
      g2m: 'La cromátida hermana es el molde de la recombinación homóloga en G2.',
      huso: 'La cohesina del centrómero, protegida por shugoshina–PP2A, se mantiene hasta que la separasa corta Rad21/Scc1.',
    },
  },
  cinetocoro_sin_unir: {
    id: 'cinetocoro_sin_unir',
    nombre: 'Cinetocoro sin unir',
    familia: 'Estructuras · cinetocoro',
    funcionGeneral: 'Cinetocoro sin microtúbulos: plataforma catalítica que genera la señal de espera del SAC.',
    porCheckpoint: {
      huso: 'Queda accesible a Mps1, que recluta la maquinaria del SAC; uno solo basta para detener a toda la célula.',
    },
  },
  cinetocoro_unido: {
    id: 'cinetocoro_unido',
    nombre: 'Cinetocoro unido',
    familia: 'Estructuras · cinetocoro',
    funcionGeneral: 'Cinetocoro con microtúbulos anclados y bajo tensión: ya no genera señal de espera.',
    porCheckpoint: {
      huso: 'Con biorientación, la tensión aleja el cinetocoro externo de Aurora B y PP1 y PP2A–B56 estabilizan la unión.',
    },
  },
  microtubulo: {
    id: 'microtubulo',
    nombre: 'Microtúbulo',
    gen: 'TUBB (tubulina)',
    familia: 'Estructuras · huso',
    funcionGeneral: 'Tubo de tubulina que captura cinetocoros y arrastra las cromátidas a los polos.',
    porCheckpoint: {
      huso: 'Cada cromátida debe capturar microtúbulos de un polo distinto; en la anafase las arrastran a polos opuestos.',
    },
    clinica: [
      'Diana de los taxanos (paclitaxel, estabilizan) y de los alcaloides de la vinca (vincristina, despolimerizan): activan el SAC de forma sostenida.',
    ],
  },
  mps1: {
    id: 'mps1',
    nombre: 'Mps1',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Cinasa que inicia la señal del SAC en los cinetocoros sin unir.',
    porCheckpoint: {
      huso: 'Compite con los microtúbulos por Ndc80 y fosforila los motivos MELT de Knl1; los microtúbulos la desplazan al unirse.',
    },
  },
  knl1: {
    id: 'knl1',
    nombre: 'Knl1',
    gen: 'KNL1',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Proteína andamio del cinetocoro que recluta la maquinaria del SAC.',
    porCheckpoint: {
      huso: 'Fosforilada por Mps1 en sus motivos MELT, recluta a Bub1–Bub3; PP1 la desfosforila cuando el cinetocoro se une.',
    },
  },
  bub1_bub3: {
    id: 'bub1_bub3',
    nombre: 'Bub1–Bub3 (y BubR1)',
    gen: 'BUB1B (BubR1)',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Proteínas del SAC que se unen al cinetocoro sin unir y reclutan a Mad1–Mad2.',
    porCheckpoint: {
      huso: 'Bub3–Bub1 se une a los fosfo-MELT de Knl1; BubR1–Bub3 forma parte del MCC y actúa como pseudosustrato de Cdc20.',
    },
    clinica: ['Mutaciones bialélicas de BUB1B (BubR1): aneuploidía variegada en mosaico.'],
  },
  mad1_mad2: {
    id: 'mad1_mad2',
    nombre: 'Mad1–Mad2',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Molde catalítico del cinetocoro que convierte Mad2 abierta en Mad2 cerrada.',
    porCheckpoint: {
      huso: 'Mad1 unido a Mad2 cerrada forma el molde permanente; al unirse el último cinetocoro, la dineína lo arrastra hacia los polos.',
    },
  },
  mad2_abierta: {
    id: 'mad2_abierta',
    nombre: 'Mad2 abierta (O-Mad2)',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Forma libre e inactiva de Mad2.',
    porCheckpoint: {
      huso: 'Llega al molde Mad1–Mad2, se pliega a Mad2 cerrada y atrapa a Cdc20; TRIP13 la devuelve a esta forma al desarmar el MCC.',
    },
  },
  mad2_cerrada: {
    id: 'mad2_cerrada',
    nombre: 'Mad2 cerrada (C-Mad2)',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Forma de Mad2 cuyo «cinturón de seguridad» se cierra alrededor de Cdc20.',
    porCheckpoint: {
      huso: 'Unida a Cdc20 forma parte del MCC, que inhibe a APC/C–Cdc20: no lo activa.',
    },
  },
  cdc20: {
    id: 'cdc20',
    nombre: 'Cdc20',
    gen: 'CDC20',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Activador de APC/C en la mitosis.',
    porCheckpoint: {
      huso: 'Mad2 cerrada lo atrapa y el MCC lo bloquea; liberado por TRIP13 y p31comet, se une a APC/C y se degradan securina y ciclina B.',
    },
  },
  mcc: {
    id: 'mcc',
    nombre: 'MCC (complejo de control mitótico)',
    gen: 'BUB1B (BubR1)',
    familia: 'Mitosis y SAC',
    funcionGeneral: 'Complejo Mad2 cerrada–Cdc20–BubR1–Bub3 que inhibe a APC/C–Cdc20.',
    porCheckpoint: {
      huso: 'Se produce de forma continua mientras quede un cinetocoro sin unir; TRIP13 con p31comet lo desarma cuando todos están unidos.',
    },
    clinica: ['Mutaciones bialélicas de BUB1B (BubR1): aneuploidía variegada en mosaico.'],
  },

  // ─── Apoptosis y destino celular ───────────────────────────────────────────
  bax: {
    id: 'bax',
    nombre: 'BAX',
    gen: 'BAX',
    familia: 'Apoptosis',
    funcionGeneral: 'Proteína proapoptótica que permeabiliza la membrana mitocondrial externa.',
    porCheckpoint: {
      g1s_dano: 'Inducida por p53 ante daño irreparable: sale el citocromo c y se activan las caspasas.',
    },
    clinica: ['Mediador de la apoptosis inducida por p53 tras daño irreparable.'],
  },
  puma_noxa: {
    id: 'puma_noxa',
    nombre: 'PUMA / NOXA',
    gen: 'BBC3 / PMAIP1',
    familia: 'Apoptosis',
    funcionGeneral: 'Proteínas proapoptóticas inducidas por p53.',
    porCheckpoint: {
      g1s_dano: 'Junto con BAX llevan a la permeabilización mitocondrial cuando el daño es irreparable.',
    },
    clinica: ['Mediadores de la apoptosis inducida por p53 tras daño irreparable.'],
  },
  fas: {
    id: 'fas',
    nombre: 'FAS (receptor de muerte)',
    gen: 'FAS',
    familia: 'Apoptosis',
    funcionGeneral: 'Receptor de membrana de la vía extrínseca de la apoptosis.',
    porCheckpoint: {
      g1s_dano: 'p53 lo induce ante daño irreparable (vía extrínseca).',
    },
  },
  mitocondria_citocromo_c: {
    id: 'mitocondria_citocromo_c',
    nombre: 'Mitocondria liberando citocromo c',
    familia: 'Apoptosis',
    funcionGeneral: 'Al permeabilizarse su membrana externa libera citocromo c, que forma el apoptosoma.',
    porCheckpoint: {
      g1s_dano: 'Citocromo c → apoptosoma → caspasa 9 → caspasa 3: vía intrínseca inducida por p53.',
    },
  },
  celula_apoptotica: {
    id: 'celula_apoptotica',
    nombre: 'Célula apoptótica',
    familia: 'Destino celular',
    funcionGeneral: 'Célula que muere de forma programada, encogida y fragmentada en cuerpos apoptóticos.',
    porCheckpoint: {
      g1s_dano: 'Desenlace cuando el daño es intenso o persistente.',
      g2m: 'Desenlace si el daño en G2 no se puede reparar.',
    },
  },
  celula_senescente: {
    id: 'celula_senescente',
    nombre: 'Célula senescente',
    familia: 'Destino celular',
    funcionGeneral: 'Célula en detención permanente del ciclo, sostenida por p21 y luego p16.',
    porCheckpoint: {
      g1s_dano: 'Desenlace alternativo al daño irreparable; secreta factores inflamatorios (fenotipo secretor asociado a senescencia).',
      g2m: 'Desenlace alternativo si el daño en G2 no se puede reparar.',
    },
  },
  celula_normal: {
    id: 'celula_normal',
    nombre: 'Célula normal',
    familia: 'Destino celular',
    funcionGeneral: 'Célula sana que reanuda el ciclo.',
    porCheckpoint: {
      g1s_dano: 'Desenlace cuando la reparación tiene éxito: MDM2 y Wip1 apagan a p53 y el ciclo continúa.',
    },
  },
};

export default proteinas;
