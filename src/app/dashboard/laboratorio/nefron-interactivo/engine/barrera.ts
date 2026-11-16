// Disposición de la barrera de filtración glomerular: capilar arriba,
// endotelio fenestrado, membrana basal, pies de los podocitos y espacio de
// Bowman abajo. Lo que es pequeño pasa; la albúmina rebota en la membrana.

import type { SustanciaId } from '@/lib/data/nefron/tipos.ts';
import type { CapaId } from '@/lib/data/nefron/barrera.ts';
import type { Corriente } from './disposicion.ts';
import type { P } from './geometria.ts';

export interface DisposicionBarrera {
  W: number;
  H: number;
  estrecha: boolean;
  texto: number;
  capilar: { y0: number; y1: number };
  endotelio: { y0: number; y1: number; fenestras: number[] };
  mbg: { y0: number; y1: number };
  pies: { y0: number; y1: number; xs: Array<[number, number]>; hendiduras: number[] };
  cuerpo: { cx: number; cy: number; rx: number; ry: number };
  bowman: { y0: number; y1: number };
  corrientes: Corriente[];
  capas: Record<CapaId, { y: number }>;
}

export function disponerBarrera(estrecha: boolean): DisposicionBarrera {
  const W = estrecha ? 760 : 1200;
  const H = estrecha ? 920 : 800;
  const texto = estrecha ? 22 : 16;
  const capilar = { y0: 0, y1: estrecha ? 330 : 290 };
  const endotelio = { y0: capilar.y1, y1: capilar.y1 + 24, fenestras: [] as number[] };
  const mbg = { y0: endotelio.y1 + 6, y1: endotelio.y1 + 46 };
  const pies = { y0: mbg.y1 + 2, y1: mbg.y1 + 44, xs: [] as Array<[number, number]>, hendiduras: [] as number[] };
  const bowman = { y0: pies.y1, y1: H };
  for (let x = 40; x < W - 30; x += 74) endotelio.fenestras.push(x);
  const anchoPie = estrecha ? 40 : 44;
  const hueco = 12;
  for (let x = 6; x < W - anchoPie; x += anchoPie + hueco) {
    pies.xs.push([x, x + anchoPie]);
    pies.hendiduras.push(x + anchoPie + hueco / 2);
  }
  pies.hendiduras.pop();
  const cuerpo = { cx: W / 2, cy: pies.y1 + (estrecha ? 170 : 130), rx: estrecha ? 120 : 150, ry: estrecha ? 64 : 56 };

  const corrientes: Corriente[] = [];
  const pasan: SustanciaId[] = ['agua', 'na', 'glucosa', 'urea', 'k', 'aa', 'hco3', 'cl', 'agua', 'na'];
  const fen = endotelio.fenestras;
  const hen = pies.hendiduras;
  pasan.forEach((s, i) => {
    const xf = fen[(i * 3 + 1) % fen.length];
    // la hendidura más cercana a la fenestra
    let xh = hen[0];
    for (const h of hen) if (Math.abs(h - xf) < Math.abs(xh - xf)) xh = h;
    const ruta: P[] = [
      [xf, 60 + (i % 3) * 50],
      [xf, endotelio.y0 + 12],
      [xh, mbg.y1 - 4],
      [xh, pies.y1 + 6],
      [xh + ((i % 2) ? 40 : -40), bowman.y0 + (estrecha ? 300 : 240)],
    ];
    corrientes.push({ clave: `pasa-${i}`, t: null, s, ritmo: 0.55, ruta, duracion: 3.2 });
  });
  // La albúmina llega a la membrana basal y vuelve al capilar.
  [0.22, 0.5, 0.78].forEach((f, i) => {
    const x = W * f;
    const ruta: P[] = [[x - 20, 70], [x, mbg.y0 + 8], [x + 34, 110]];
    corrientes.push({ clave: `albumina-${i}`, t: null, s: 'albumina', ritmo: 0.32, ruta, duracion: 3 });
  });

  return {
    W, H, estrecha, texto, capilar, endotelio, mbg, pies, cuerpo, bowman, corrientes,
    capas: { endotelio: { y: endotelio.y0 }, mbg: { y: mbg.y0 }, podocito: { y: pies.y0 } },
  };
}
