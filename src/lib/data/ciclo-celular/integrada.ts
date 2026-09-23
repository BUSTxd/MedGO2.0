// Preguntas puente de la prueba integrada (sección 12.6 del prompt maestro):
// cada una cruza dos checkpoints. Las incorrectas usan solo proteínas que
// aparecen en la sección 12. La prueba integrada las mezcla con los bancos de
// cada checkpoint (mín. 2 puente de 20 ítems).

import type { QuizItem } from './tipos';

const preguntas: QuizItem[] = [
  {
    id: 'iq1',
    enunciado: 'Tras irradiar células con p53 normal, ¿qué proteína inducida por p53 contribuye a detenerlas tanto en G1 como en G2?',
    opciones: ['MDM2', 'BAX', 'p21', 'Wip1'],
    correcta: 2,
    explicacion: 'p21 inhibe a ciclina E–CDK2 en G1 (RB sigue hipofosforilado) y a CDK1 en G2, donde además reprime genes de mitosis vía el complejo DREAM. MDM2 y Wip1 apagan la respuesta de p53; BAX es un mediador de apoptosis.',
    checkpoints: ['g1s_dano', 'g2m'],
  },
  {
    id: 'iq2',
    enunciado: '¿Qué enzima es degradada tras el daño tanto en G1/S como en intra-S, dejando a CDK2 con sus fosfatos inhibidores?',
    opciones: ['Claspina', 'Cdc25A', 'Geminina', 'Wee1'],
    correcta: 1,
    explicacion: 'Chk2/Chk1 (en G1/S) y Chk1 (en intra-S) fosforilan a Cdc25A, que SCF–βTrCP ubiquitina y el proteasoma degrada. Sin Cdc25A, CDK2 conserva sus fosfatos inhibidores Thr14/Tyr15. Claspina y Wee1 se degradan en G2/M; la geminina, tras la mitosis.',
    checkpoints: ['g1s_dano', 'intra_s'],
  },
  {
    id: 'iq3',
    enunciado: 'La deleción de CDKN2A inactiva a la vez dos vías. ¿Cuáles?',
    opciones: [
      'La vía ATM (por pérdida de Chk2) y la vía RB (por pérdida de p21)',
      'La vía p53 (por pérdida de MDM2) y el control del huso (por pérdida de Mad2)',
      'La vía MAPK (por pérdida de RAS) y la vía E2F (por pérdida de DP1)',
      'La vía RB (por pérdida de p16) y la vía p53 (por pérdida de p14ARF)',
    ],
    correcta: 3,
    explicacion: 'CDKN2A codifica p16INK4a (inhibidor específico de CDK4/6: su pérdida deja a RB fosforilado) y, en un marco de lectura alternativo, p14ARF (que secuestra a MDM2: su pérdida debilita la vía p53).',
    checkpoints: ['restriccion', 'g1s_dano'],
  },
  {
    id: 'iq4',
    enunciado: '¿Qué ligasa degrada ciclina B y securina para iniciar la anafase, y qué otra forma de la misma ligasa mantiene bajas las ciclinas en G1?',
    opciones: ['SCF–βTrCP y SCF–Skp2', 'APC/C–Cdh1 y APC/C–Cdc20', 'APC/C–Cdc20 y APC/C–Cdh1', 'La separasa y el proteasoma 26S'],
    correcta: 2,
    explicacion: 'Liberado del MCC, APC/C–Cdc20 ubiquitina a securina y ciclina B e inicia la anafase. Hacia el final de M, APC/C cambia su activador de Cdc20 a Cdh1, que mantiene bajas las ciclinas durante la siguiente G1. La separasa es una proteasa que corta la cohesina, no una ligasa.',
    checkpoints: ['huso', 'intra_s'],
  },
  {
    id: 'iq5',
    enunciado: '¿Por qué la recombinación homóloga no es la vía principal para reparar roturas en G1?',
    opciones: [
      'Porque aún no hay cromátida hermana que sirva de molde; en G1 predomina la unión de extremos no homólogos',
      'Porque BRCA1 y BRCA2 solo se transcriben en la mitosis, cuando APC/C–Cdc20 ya está activo y la cohesina se ha cortado',
      'Porque p53 degrada a RAD51 en G1 y el ADN roto se repara siempre por escisión de nucleótidos',
      'Porque en G1 las roturas activan ATR–Chk1 en lugar de ATM, y ATR impide la resección de los extremos rotos',
    ],
    correcta: 0,
    explicacion: 'La recombinación homóloga usa la cromátida hermana como molde, y esta solo existe en S y G2. En G1 las roturas de doble cadena se reparan principalmente por unión de extremos no homólogos (NHEJ).',
    checkpoints: ['g1s_dano', 'g2m'],
  },
  {
    id: 'iq6',
    enunciado: 'Un tumor sin p53 depende más de un checkpoint para sobrevivir al daño. ¿Cuál, y qué fármacos lo explotan?',
    opciones: [
      'El punto de restricción; inhibidores de CDK4/6',
      'El control G2/M; inhibidores de Wee1 y de Chk1',
      'El control del huso; taxanos y alcaloides de la vinca',
      'El control G1/S; inhibidores de MDM2 tipo nutlina',
    ],
    correcta: 1,
    explicacion: 'Sin p53 falla la detención en G1 (no se induce p21), así que la célula depende del control G2/M para reparar antes de dividirse. Por eso se estudian inhibidores de Wee1 (adavosertib) y de Chk1 combinados con quimioterapia o radioterapia.',
    checkpoints: ['g2m', 'g1s_dano'],
  },
];

export default preguntas;
