// Geometría de los tejidos de fondo (en unidades del lienzo, 1600 × 1000).
// La comparten `Fondos.tsx` (que los dibuja) y el motor (que, al animar un
// parámetro del tejido, mete su zona en el encuadre automático: si un paso solo
// dilata la vénula, la cámara mira a la vénula). Los datos colocan sus células
// sobre estas mismas medidas (en celdas de 100 u).

import type { Fondo, ParamTejido } from './tipos';

export type Rect = { x0: number; y0: number; x1: number; y1: number };

export const MUCOSA = {
  luz: 150, // fondo de la luz de la vía aérea (el epitelio empieza aquí)
  epitelio: 262, // membrana basal
  venula: { cx: 700, cy: 560, rx: 330, ry: 66 },
  glandula: { cx: 170, cy: 690 },
  nervio: { x: 1130, y0: 300, y1: 820 },
  musculo: { y0: 850, y1: 960 },
  bronquio: { cx: 1400, cy: 470, r: 125 },
  ganglio: { x0: 1060, y0: 300, x1: 1580, y1: 960 },
};

export const CUERPO = { cx: 470, cabeza: 120, laringe: 232, pulmon: 400, corazon: 430, intestino: 590, monitor: { x0: 900, y0: 120, x1: 1540, y1: 880 } };

export const SANGRE = { y0: 230, y1: 770, placenta: 500 };

export const GLOMERULO = { cx: 600, cy: 520, r: 285, mbg: 18, bowman: 430, alveolo: { cx: 1330, cy: 330, r: 150 } };

export const PLACA = {
  membrana: 560,
  receptores: [118, 214, 316, 418, 520, 616],
  foliculo: { cx: 1210, cy: 520, r: 235 },
};

export const VASO = { cx: 600, cy: 520, luz: 320, intima: 345, media: 400, adventicia: 425 };

export const PIEL = { cornea: 90, basal: 320, venulas: [{ cx: 640, cy: 600, rx: 210, ry: 52 }, { cx: 1220, cy: 770, rx: 170, ry: 44 }] };

export const GRANULOMA = { cx: 760, cy: 520, r: 230 };

const R = (x0: number, y0: number, x1: number, y1: number): Rect => ({ x0, y0, x1, y1 });
const v = MUCOSA.venula;
const venula = R(v.cx - v.rx - 30, v.cy - v.ry - 60, v.cx + v.rx + 30, v.cy + v.ry + 60);

/** Zona de cada parámetro en cada fondo (para el encuadre automático). */
export const ZONAS: Partial<Record<Fondo, Partial<Record<ParamTejido, Rect>>>> = {
  mucosa: {
    ganglio: R(MUCOSA.ganglio.x0, MUCOSA.ganglio.y0, MUCOSA.ganglio.x1, MUCOSA.ganglio.y1),
    dano: R(0, 60, 1060, 300),
    vasodilatacion: venula,
    fuga: venula,
    activacion: venula,
    edema: R(200, 300, 1060, 800),
    espasmo: R(1250, 320, 1560, 620),
    moco: R(40, 100, 1060, 760),
    prurito: R(1040, 300, 1220, 820),
    infiltrado: R(200, 280, 1060, 800),
  },
  cuerpo: {
    piel: R(240, 20, 700, 980),
    laringe: R(330, 150, 610, 320),
    bronquio: R(300, 300, 640, 520),
    intestino: R(330, 500, 610, 700),
    vasos: R(240, 20, 700, 980),
    presion: R(CUERPO.monitor.x0, CUERPO.monitor.y0, CUERPO.monitor.x1, CUERPO.monitor.y1),
    adrenalina: R(240, 600, 1540, 980),
  },
  sangre: { placenta: R(0, 120, 1600, 900), hemolisis: R(0, SANGRE.y0, 1600, SANGRE.y1) },
  glomerulo: {
    lineal: R(280, 200, 920, 840), granular: R(280, 200, 920, 840), complemento: R(280, 200, 920, 840),
    proteinuria: R(150, 80, 1050, 960), hematuria: R(150, 80, 1050, 960), dano: R(280, 200, 920, 840),
    hemorragia: R(1160, 160, 1500, 500),
  },
  placa: {
    ach: R(60, 160, 760, 640), bloqueo: R(60, 480, 760, 640), internalizacion: R(60, 480, 760, 700), contraccion: R(40, 560, 780, 960),
    antiTshr: R(960, 270, 1460, 770), hormona: R(940, 250, 1560, 790),
  },
  vaso: {
    deposito: R(180, 120, 700, 920), necrosis: R(150, 100, 720, 940), trombo: R(220, 200, 640, 840),
    vasculitis: R(150, 100, 720, 940), fuga: R(150, 100, 1050, 940), complemento: R(200, 150, 1000, 900),
  },
  piel: {
    eritema: R(0, 340, 1600, 980), induracion: R(200, 40, 1400, 980), manguito: R(380, 480, 1420, 860),
    vasodilatacion: R(380, 480, 1420, 860), activacion: R(380, 480, 1420, 860), edema: R(0, 340, 1600, 980),
    vesicula: R(200, 60, 1400, 360), acantolisis: R(200, 60, 1400, 360),
  },
  granuloma: {
    macrofagos: R(480, 240, 1040, 800), epitelioides: R(480, 240, 1040, 800), gigantes: R(560, 320, 960, 720),
    corona: R(400, 160, 1120, 880), fibrosis: R(380, 140, 1140, 900), caseosis: R(600, 360, 920, 680),
  },
};
