// Tonos del estilo plano (docs/nefron/ESTILO.md): cada forma lleva su color,
// una sombra en media luna (más oscura) y un brillo (más claro). Sin bordes.

function hexARgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function mezclar(a: string, b: string, t: number): string {
  const x = hexARgb(a);
  const y = hexARgb(b);
  const c = x.map((v, i) => Math.round(v + (y[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/** Sombra en media luna: el mismo color hacia un violeta muy oscuro. */
export const sombra = (c: string) => mezclar(c, '#2a0a4a', 0.4);
/** Brillo: el mismo color hacia el blanco. */
export const brillo = (c: string) => mezclar(c, '#ffffff', 0.45);

/** Círculos tenues del fondo (bokeh), en coordenadas de 0 a 1. Fijos: no se mueven. */
export const BOKEH: Array<[number, number, number]> = [
  [0.06, 0.08, 0.022], [0.19, 0.31, 0.012], [0.33, 0.06, 0.016], [0.47, 0.22, 0.03], [0.62, 0.12, 0.011],
  [0.74, 0.34, 0.02], [0.9, 0.18, 0.014], [0.97, 0.46, 0.026], [0.12, 0.55, 0.03], [0.27, 0.72, 0.014],
  [0.41, 0.6, 0.01], [0.56, 0.82, 0.024], [0.69, 0.66, 0.012], [0.83, 0.78, 0.034], [0.95, 0.92, 0.012],
  [0.05, 0.9, 0.016], [0.36, 0.94, 0.02], [0.79, 0.52, 0.009],
];
