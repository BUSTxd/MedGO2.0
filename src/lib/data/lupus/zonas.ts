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
  causas: ['panel', 'candado', 'llave1', 'llave2', 'llave3', 'abierta', 'foco', 'anticuerpos', 'ninguna', 'tresllaves', 'hla', 'gemelos', 'cien', 'tituloC', 'duda', 'pues', 'faltan', 'riesgoC1q', 'limpieza', 'nueve', 'balanza', 'testo', 'ojo', 'xx', 'sol', 'rayos', 'apoptosisUV', 'antigenosUV', 'playa', 'fps', 'virus', 'mimetismo', 'epitopos', 'tabaco', 'silice', 'comun', 'expuesto', 'tituloF', 'frascos', 'trucos', 'retira', 'receta'],
  epidermis: ['capas', 'apoNormal', 'silencio', 'despues', 'uv', 'apoUV', 'sano', 'zoom', 'empaqueta', 'calma', 'sinAlarma', 'falla', 'apoMas', 'medidor', 'muerte', 'lenta', 'central', 'tolerancia', 'debil', 'chispa'],
  ciudad: ['calle', 'basura', 'camion', 'policia', 'inmune', 'interferon'],
  'endosoma': ['endo', 'complejoEndo', 'tlr7', 'tlr9', 'virus', 'troya', 'senal', 'ifnGen', 'ifnSale', 'estrella', 'efectos', 'ph', 'bloqueo'],
  'firma': ['firma', 'firmaTit', 'viral', 'anifro'],
  'red': ['red', 'partes', 'bacterias', 'autoag', 'danoEndo', 'persisten', 'problema'],
  'seleccion': ['medula', 'periferia'],
  'germinal': ['gc', 'zonas', 'csr', 'afinidad', 'aumentados'],
  'h-vaso': ['deposito', 'necrosis', 'trombo', 'vasculitis', 'fuga', 'complemento', 'consumo', 'recupera', 'termometro', 'tubo'],
  'h-sangre': ['hemolisis', 'placenta'],
  'h-glomerulo': ['lineal', 'granular', 'complemento', 'proteinuria', 'hematuria', 'hemorragia', 'dano'],
  'manos': ['mano', 'artic', 'perla', 'comparar', 'jaccoud', 'reduce', 'rx', 'raynaud'],
  'boca': ['boca', 'ulceras', 'mira'],
  'torso': ['torso', 'sol', 'anillos', 'psoriasis', 'cara'],
  'discoide': ['placa', 'cicatriz', 'alopecia', 'banda'],
  'valva': ['corazon', 'valva', 'vegetaciones', 'esteril', 'embolo'],
  'coronaria': ['arteria', 'placaAt'],
  'torax': ['torax', 'pleuraI', 'derrameP', 'pericardio', 'derrameC'],
  'cebolla': ['bazo', 'capasBazo'],
  'pulmon': ['pulmones', 'intersticio', 'hp'],
  'capas': ['capilar', 'endotelioL', 'mbgL', 'podoL', 'mesangioL', 'pregunta', 'mesangial', 'subendotelial', 'subepitelial', 'lado', 'inflamaG', 'esclerosisG'],
  'fullhouse': ['fh', 'viaClasica', 'piensa'],
  'clases': ['grande', 'focoClase', 'clase1', 'clase2', 'clase3', 'clase4', 'clase5', 'clase6', 'gMes', 'gDep', 'gSub', 'gEpi', 'gAsas', 'gTrombos', 'gSemiluna', 'gEscl', 'gGruesa', 'spikes'],
  'pruebas': ['ana', 'anaS', 'anaE', 'dsdna', 'dsdnaS', 'dsdnaE', 'sm', 'smS', 'smE'],
  'eular': ['eularTit', 'entrada', 'regla', 'clinicos', 'inmuno', 'caso', 'artritis', 'mucocutaneo', 'complementoC', 'dsdnaC', 'total', 'soap'],
};
