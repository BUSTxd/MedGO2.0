// Zonas de cada lámina que ocupa un parámetro animado (unidades del lienzo,
// 1600 × 1000): el encuadre automático del motor las mete en cuadro cuando un
// paso anima ese parámetro. Las láminas del capítulo 0 son infografías a
// lienzo completo (sus pasos llevan `encuadre: 'all'`) y no necesitan ninguna.

import type { Fondo } from './tipos';

export type Rect = { x0: number; y0: number; x1: number; y1: number };

export const ZONAS: Partial<Record<Fondo, Record<string, Rect>>> = {};

/** Parámetros que dibuja cada lámina (`Fondos.tsx`): el verificador caza un
 *  `tejido` con un parámetro que su lámina no lee (una errata no se vería). */
export const PARAMETROS: Record<Fondo, readonly string[]> = {
  blanco: [],
  nombre: ['titulo', 'separa', 'lupus', 'eritema', 'sistemico', 'rostro', 'mordida', 'rayos'],
  nucleo: ['deposito', 'inflama'],
  brotes: ['curva', 'brote1', 'brote2', 'brote3', 'brote4', 'remision', 'espectro', 'grave', 'libro', 'su'],
  quien: ['figuras', 'razon', 'edad', 'banda', 'varon', 'pista'],
  imitador: ['cuerpo', 'organos', 'paciente1', 'paciente2', 'paciente3', 'tres', 'pensar'],
  ruta: ['camino', 'causas', 'mecanismo', 'dano', 'rinon', 'final', 'todo', 'aqui'],
  causas: ['panel', 'candado', 'llave1', 'llave2', 'llave3', 'abierta', 'foco', 'anticuerpos', 'salen', 'ninguna', 'tresllaves', 'hla', 'gemelos', 'cien', 'tituloC', 'duda', 'pues', 'faltan', 'riesgoC1q', 'limpieza', 'nueve', 'balanza', 'testo', 'ojo', 'xx', 'sol', 'rayos', 'apoptosisUV', 'antigenosUV', 'playa', 'fps', 'virus', 'mimetismo', 'epitopos', 'tabaco', 'silice', 'comun', 'expuesto', 'tituloF', 'frascos', 'trucos', 'retira', 'receta'],
  epidermis: ['capas', 'apoNormal', 'silencio', 'despues', 'uv', 'apoUV', 'sano', 'zoom', 'empaqueta', 'calma', 'sinAlarma', 'falla', 'apoMas', 'medidor', 'muerte', 'lenta', 'central', 'tolerancia', 'debil', 'chispa'],
  ciudad: ['calle', 'basura', 'camion', 'policia', 'inmune', 'interferon'],
  'espacio': ['nucleasa'],
  'circulo': ['ic1', 'ic2', 'ic3', 'ic4', 'ic5'],
  'endosoma': ['endo', 'complejoEndo', 'tlr7', 'tlr9', 'virus', 'troya', 'senal', 'ifnGen', 'ifnSale', 'estrella', 'efectos', 'ph', 'bloqueo'],
  'firma': ['firma', 'firmaTit', 'viral', 'anifro'],
  'red': ['red', 'fases', 'partes', 'bacterias', 'autoag', 'danoEndo', 'persisten', 'problema'],
  'seleccion': ['medula', 'periferia'],
  'periferia': ['fuente', 'exceso', 'ma1', 'ma2', 'ma3', 'ma4'],
  'efectoras': ['h1', 'h2', 'mi1', 'mi2'],
  'freno': ['il2', 'il2cae', 'frenoV', 'clones'],
  'intersticio': ['inflamaR'],
  'circuito': ['ci1', 'ci2'],
  'puente': ['m3', 'm2'],
  'germinal': ['gc', 'zonas', 'csr', 'afinidad', 'aumentados'],
  'h-vaso': ['deposito', 'necrosis', 'trombo', 'vasculitis', 'fuga', 'complemento', 'consumo', 'recupera', 'termometro', 'aflT', 'aflA', 'aflB', 'aflC', 'aflD', 'aflE1', 'aflE2', 'aflE3', 'aflF', 'aflP', 'aflPL', 'aflG', 'tubo', 'crono', 'cuerp', 'cuerpoL', 'eq1', 'eq2', 'eq3', 'noSang', 'cas1', 'cas2', 'cas3', 'cas4', 'casBrillo', 'quimio', 'frus', 'vuelca', 'hne', 'md1', 'md2', 'sm1', 'sm2', 'sm3', 'sm4'],
  'h-sangre': ['hemolisis', 'quieto', 'capas', 't2', 'noViaja', 'zoomAg', 'b1', 'b2', 'b3', 'opso', 'tTres', 'est1', 'lis1', 'fan3', 'm1', 'm2', 'm3', 'baz', 'hig', 'baja', 'ahai', 'lab1', 'lab2', 'lab3', 'lab4', 'lab5', 'rec', 'labTodo', 'lTromb', 'plaq', 'plaqLow', 's1', 's2', 's3', 'lLeuc', 'leuc', 'leucLow', 'pm', 'pa', 'lPerla'],
  'saf': ['neq', 'pct', 'pic', 'picSaf', 'crit1', 'crit2', 'crit3', 'llave', 'emb'],
  'h-glomerulo': ['lineal', 'granular', 'complemento', 'proteinuria', 'hematuria', 'hemorragia', 'dano'],
  'sintomas': ['f1', 'f1b', 'f2', 'f2b', 'f3', 'f3b', 'f4', 'f5'],
  'cutaneos': ['c0', 'c1', 'c2', 'c3', 'c4', 'c5'],
  'malar': ['rostro', 'eritema', 'pliegueM', 'solM', 'm1', 'm2', 'm3'],
  'neuro': ['cer', 'ne1', 'ne2', 'ne3', 'de1', 'de2', 'de3'],
  'manos': ['mano', 'artic', 'perla', 'comparar', 'jaccoud', 'reduce', 'rx', 'raynaud', 'ot1', 'ot3', 'ot4'],
  'boca': ['boca', 'ulceras', 'mira', 'ind', 'bus', 'abre'],
  'torso': ['torso', 'sol', 'anillos', 'psoriasis', 'cara', 's1', 's2', 's3', 's4', 's5'],
  'discoide': ['placa', 'cicatriz', 'alopecia', 'banda', 'd1', 'd2', 'd3'],
  'valva': ['corazon', 'valva', 'vegetaciones', 'esteril', 'embolo', 'v1', 'v3'],
  'coronaria': ['arteria', 'placaAt', 'kAt', 'c1', 'c2', 'c3', 'c4', 'muj'],
  'torax': ['torax', 'pleuraI', 'derrameP', 'pericardio', 'derrameC', 'tx1', 'tx2', 'tx3', 'tx4', 'tx5'],
  'cebolla': ['bazo', 'capasBazo', 'b1', 'b2', 'b3'],
  'pulmon': ['pulmones', 'intersticio', 'hp', 'q1', 'q2', 'q3'],
  'mecanismos': ['r1', 'r2', 'r3', 'r4'],
  'capas': ['capilar', 'endotelioL', 'mbgL', 'podoL', 'mesangioL', 'pregunta', 'mesangial', 'subendotelial', 'subepitelial', 'lado', 'inflamaG', 'esclerosisG', 'g1', 'g2', 'g3'],
  'fullhouse': ['fh', 'viaClasica', 'piensa'],
  'clinicaN': ['k0', 'kNef', 'kNeo', 'iOri', 'kOri'],
  'clases': ['grande', 'focoClase', 'clase1', 'clase2', 'clase3', 'clase4', 'clase5', 'clase6', 'gMes', 'gDep', 'gSub', 'gEpi', 'gAsas', 'gTrombos', 'gSemiluna', 'gEscl', 'gGruesa', 'spikes', 'c1', 'c1b', 'c2', 'c2b', 'c34', 'c3', 'c4', 'c4b', 'i1', 'c5', 'c5b', 'c6', 'c6b', 'c6c'],
  'txCompl': ['kCom', 'kInf', 'kInfL', 'kBac', 'kVir', 'tFie', 'tDud', 'kBro', 'kIn2', 'kPI', 'kPB', 'kDuda', 'kLin', 'kOst', 'kCad', 'kCadL', 'kPul'],
  'txCircuito': ['cT', 'cA', 'n1', 'n2', 'n3', 'n4', 'n5', 'hcq', 'hcqB', 'pilar'],
  'endosomaTx': ['endo', 'complejoEndo', 'tlr7', 'tlr9', 'virus', 'troya', 'senal', 'ifnGen', 'ifnSale', 'estrella', 'efectos', 'ph', 'bloqueo', 'hx1', 'hx2', 'hx3', 'hx4'],
  'txFarmacos': ['gl', 'gc1', 'gc2', 'gc3', 'gc4', 'lt', 'aza', 'azaB', 'mmf', 'mmfB', 'mmfR', 'mmfE', 'cni', 'cniB', 'cniN', 'csa', 'mab', 'mb1', 'mb2', 'mb3'],
  'txFin': ['fb1', 'fb2', 'fb3', 'fb4', 'fb5', 'fb6', 'tF1', 'tF2', 'tF3'],
  'dxInicio': ['t0', 'kNo', 'k1', 'k2', 'k3', 'kSos', 'kSosL', 'kDif', 'd1', 'd2', 'd3', 'd4', 'kBio', 'kRen', 'kRenL'],
  'pruebas': ['ana', 'anaS', 'anaE', 'kPos', 'kNeg', 'kSolo', 'tTam', 'dsdna', 'dsdnaS', 'dsdnaE', 'kSigue', 'kSigueL', 'sm', 'smS', 'smE', 'kSmP', 'kSmN'],
  'dxAfl': ['af', 'af1', 'af2', 'af3', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6'],
  'eular': ['eularTit', 'entrada', 'regla', 'clinicos', 'inmuno', 'caso', 'artritis', 'mucocutaneo', 'complementoC', 'dsdnaC', 'total', 'soap'],
};
