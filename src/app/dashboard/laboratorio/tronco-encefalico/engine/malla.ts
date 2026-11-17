// De campo de distancias a malla: «surface nets» (un vértice por celda que corta
// la superficie, unido a sus vecinos en cuadriláteros), evaluando el campo solo
// cerca de la superficie. Los vértices se proyectan sobre la superficie, las
// normales salen del gradiente del campo y cada vértice lleva:
//   - su estructura (índice en la lista de etiquetas), para tocar y colorear;
//   - una oclusión ambiental calculada con el propio campo, que oscurece surcos
//     y hendiduras: con una luz tenue se siguen leyendo todos los relieves.
// Sin three.js: devuelve arreglos planos que la escena convierte en geometría.

import type { Campo, Vec } from './sdf.ts';

export interface Malla {
  pos: Float32Array;
  nor: Float32Array;
  /** Oclusión ambiental (1 = expuesto, 0 = metido en un surco). */
  ao: Float32Array;
  /** Índice de la etiqueta de cada vértice. */
  etq: Uint16Array;
  idx: Uint32Array;
  etiquetas: string[];
}

export interface OpcionesMalla {
  /** Lado del vóxel en cm. */
  h: number;
  /** Caja a mallar (si no, los límites del campo). */
  min?: Vec;
  max?: Vec;
  /** Refina la etiqueta de un vértice según su posición (zonas del suelo, etc.). */
  refinar?: (id: string, x: number, y: number, z: number) => string;
  /** Calcula la oclusión ambiental (por defecto, sí). */
  ao?: boolean;
}

const B = 4; // vóxeles por lado de bloque (el relleno a medio paso asume 4)

export function mallar(campo: Campo, o: OpcionesMalla): Malla {
  const h = o.h;
  const pad = 2 * h;
  const min = (o.min ?? campo.limites.min).map((v) => v - pad) as Vec;
  const max = (o.max ?? campo.limites.max).map((v) => v + pad) as Vec;
  const nx = Math.ceil((max[0] - min[0]) / h) + 1;
  const ny = Math.ceil((max[1] - min[1]) / h) + 1;
  const nz = Math.ceil((max[2] - min[2]) / h) + 1;
  const bx = Math.ceil(nx / B), by = Math.ceil(ny / B), bz = Math.ceil(nz / B);
  const N = nx * ny * nz;
  const at = (i: number, j: number, k: number) => i + nx * (j + ny * k);

  // 1. Rejilla gruesa (esquinas de bloque) con el campo completo.
  const gx = bx + 1, gy = by + 1, gz = bz + 1;
  const grueso = new Float32Array(gx * gy * gz);
  for (let k = 0; k < gz; k++) for (let j = 0; j < gy; j++) for (let i = 0; i < gx; i++) {
    grueso[i + gx * (j + gy * k)] = campo.d(min[0] + i * B * h, min[1] + j * B * h, min[2] + k * B * h);
  }

  // 2. Rejilla fina: solo los bloques cerca de la superficie se evalúan de verdad;
  //    el resto toma el signo de su esquina (no contiene superficie).
  const diag = B * h * Math.sqrt(3);
  const f = new Float32Array(N).fill(diag);
  const activos: number[] = [];
  const minAbs = (i: number, j: number, k: number) => {
    let mn = Infinity;
    for (let c = 0; c < 8; c++) {
      const v = grueso[(i + (c & 1)) + gx * ((j + ((c >> 1) & 1)) + gy * (k + ((c >> 2) & 1)))];
      const a = v < 0 ? -v : v;
      if (a < mn) mn = a;
    }
    return mn;
  };
  //    a) Bloques sin superficie por dentro del tejido: negativos.
  for (let k = 0; k < bz; k++) for (let j = 0; j < by; j++) for (let i = 0; i < bx; i++) {
    if (minAbs(i, j, k) < diag * 1.2) { activos.push(i, j, k); continue; }
    if (grueso[i + gx * (j + gy * k)] > 0) continue;
    const i0 = i * B, j0 = j * B, k0 = k * B;
    const i1 = Math.min(i0 + B, nx - 1), j1 = Math.min(j0 + B, ny - 1), k1 = Math.min(k0 + B, nz - 1);
    for (let kk = k0; kk <= k1; kk++) for (let jj = j0; jj <= j1; jj++) for (let ii = i0; ii <= i1; ii++) f[at(ii, jj, kk)] = -diag;
  }
  //    b) Bloques con superficie: primero a medio paso; los vóxeles intermedios
  //       se interpolan y solo se calculan de verdad los que quedan junto a la
  //       superficie, que son los únicos que deciden por dónde pasa.
  const medio = new Float64Array(27);
  const cerca = 3 * h;
  const hecho = new Uint8Array(N);
  for (let q = 0; q < activos.length; q += 3) {
    const i0 = activos[q] * B, j0 = activos[q + 1] * B, k0 = activos[q + 2] * B;
    const i1 = Math.min(i0 + B, nx - 1), j1 = Math.min(j0 + B, ny - 1), k1 = Math.min(k0 + B, nz - 1);
    for (let c = 0; c < 27; c++) {
      const ii = Math.min(i0 + 2 * (c % 3), nx - 1), jj = Math.min(j0 + 2 * (Math.floor(c / 3) % 3), ny - 1), kk = Math.min(k0 + 2 * Math.floor(c / 9), nz - 1);
      const r = at(ii, jj, kk);
      medio[c] = hecho[r] ? f[r] : campo.d(min[0] + ii * h, min[1] + jj * h, min[2] + kk * h);
    }
    for (let kk = k0; kk <= k1; kk++) for (let jj = j0; jj <= j1; jj++) for (let ii = i0; ii <= i1; ii++) {
      const r = at(ii, jj, kk);
      if (hecho[r]) continue;
      const li = ii - i0, lj = jj - j0, lk = kk - k0;
      let v: number;
      if (!(li & 1) && !(lj & 1) && !(lk & 1)) {
        v = medio[(li >> 1) + 3 * (lj >> 1) + 9 * (lk >> 1)];
      } else {
        // Trilineal sobre la celda de medio paso que lo contiene.
        const a = li >> 1 > 1 ? 1 : li >> 1, b = lj >> 1 > 1 ? 1 : lj >> 1, cc = lk >> 1 > 1 ? 1 : lk >> 1;
        const tx = (li - 2 * a) / 2, ty = (lj - 2 * b) / 2, tz = (lk - 2 * cc) / 2;
        const o0 = a + 3 * b + 9 * cc;
        const m000 = medio[o0], m100 = medio[o0 + 1], m010 = medio[o0 + 3], m110 = medio[o0 + 4];
        const m001 = medio[o0 + 9], m101 = medio[o0 + 10], m011 = medio[o0 + 12], m111 = medio[o0 + 13];
        const x00 = m000 + (m100 - m000) * tx, x10 = m010 + (m110 - m010) * tx;
        const x01 = m001 + (m101 - m001) * tx, x11 = m011 + (m111 - m011) * tx;
        const y0 = x00 + (x10 - x00) * ty, y1 = x01 + (x11 - x01) * ty;
        v = y0 + (y1 - y0) * tz;
        if ((v < 0 ? -v : v) < cerca) v = campo.d(min[0] + ii * h, min[1] + jj * h, min[2] + kk * h);
        else { f[r] = v; continue; } // aproximado: otro bloque puede afinarlo
      }
      f[r] = v;
      hecho[r] = 1;
    }
  }

  // 3. Un vértice por celda con cambio de signo, en la media de los cortes de
  //    sus aristas. Solo hay celdas así dentro de los bloques activos.
  const celda = new Int32Array(N).fill(-1);
  const conVertice: number[] = [];
  const pos: number[] = [];
  const ARISTAS = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const v = new Float32Array(8);
  for (let q = 0; q < activos.length; q += 3) {
    const i0 = activos[q] * B, j0 = activos[q + 1] * B, k0 = activos[q + 2] * B;
    const i1 = Math.min(i0 + B, nx - 1), j1 = Math.min(j0 + B, ny - 1), k1 = Math.min(k0 + B, nz - 1);
    for (let k = k0; k < k1; k++) for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
      let mask = 0;
      for (let c = 0; c < 8; c++) {
        v[c] = f[at(i + (c & 1), j + ((c >> 1) & 1), k + ((c >> 2) & 1))];
        if (v[c] < 0) mask |= 1 << c;
      }
      if (mask === 0 || mask === 255) continue;
      let sx = 0, sy = 0, sz = 0, n = 0;
      for (const [a, b] of ARISTAS) {
        if ((v[a] < 0) === (v[b] < 0)) continue;
        const t = v[a] / (v[a] - v[b]);
        sx += (a & 1) + t * ((b & 1) - (a & 1));
        sy += ((a >> 1) & 1) + t * (((b >> 1) & 1) - ((a >> 1) & 1));
        sz += ((a >> 2) & 1) + t * (((b >> 2) & 1) - ((a >> 2) & 1));
        n++;
      }
      const c0 = at(i, j, k);
      celda[c0] = pos.length / 3;
      conVertice.push(i, j, k);
      pos.push(min[0] + (i + sx / n) * h, min[1] + (j + sy / n) * h, min[2] + (k + sz / n) * h);
    }
  }

  // 4. Caras: cada arista de la rejilla con cambio de signo une las 4 celdas
  //    que la rodean. Se recorren desde la esquina menor de cada celda con vértice.
  const idx: number[] = [];
  const quad = (a: number, b: number, c: number, d: number, invertir: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (invertir) idx.push(a, d, c, a, c, b);
    else idx.push(a, b, c, a, c, d);
  };
  for (let q = 0; q < conVertice.length; q += 3) {
    const i = conVertice[q], j = conVertice[q + 1], k = conVertice[q + 2];
    if (i < 1 || j < 1 || k < 1) continue;
    const dentro = f[at(i, j, k)] < 0;
    if ((f[at(i + 1, j, k)] < 0) !== dentro) {
      quad(celda[at(i, j, k)], celda[at(i, j - 1, k)], celda[at(i, j - 1, k - 1)], celda[at(i, j, k - 1)], !dentro);
    }
    if ((f[at(i, j + 1, k)] < 0) !== dentro) {
      quad(celda[at(i, j, k)], celda[at(i, j, k - 1)], celda[at(i - 1, j, k - 1)], celda[at(i - 1, j, k)], !dentro);
    }
    if ((f[at(i, j, k + 1)] < 0) !== dentro) {
      quad(celda[at(i, j, k)], celda[at(i - 1, j, k)], celda[at(i - 1, j - 1, k)], celda[at(i, j - 1, k)], !dentro);
    }
  }

  // 5. Proyección sobre la superficie, normales por gradiente, etiqueta y oclusión.
  const nv = pos.length / 3;
  const P = new Float32Array(pos);
  const NOR = new Float32Array(nv * 3);
  const AO = new Float32Array(nv).fill(1);
  const ETQ = new Uint16Array(nv);
  const etiquetas: string[] = [];
  const indice = new Map<string, number>();
  const dl = campo.d;
  // Gradiente de la rejilla: diferencias centrales en las 8 esquinas de la
  // celda, mezcladas en trilineal (continuo de una celda a la siguiente).
  const g = [0, 0, 0];
  const fv = (i: number, j: number, k: number) => f[at(
    Math.max(0, Math.min(nx - 1, i)), Math.max(0, Math.min(ny - 1, j)), Math.max(0, Math.min(nz - 1, k)))];
  const gradiente = (x: number, y: number, z: number) => {
    const ux = (x - min[0]) / h, uy = (y - min[1]) / h, uz = (z - min[2]) / h;
    const i = Math.floor(ux), j = Math.floor(uy), k = Math.floor(uz);
    const tx = ux - i, ty = uy - j, tz = uz - k;
    g[0] = 0; g[1] = 0; g[2] = 0;
    for (let c = 0; c < 8; c++) {
      const a = c & 1, b = (c >> 1) & 1, cc = (c >> 2) & 1;
      const w = (a ? tx : 1 - tx) * (b ? ty : 1 - ty) * (cc ? tz : 1 - tz);
      const I = i + a, J = j + b, K = k + cc;
      g[0] += w * (fv(I + 1, J, K) - fv(I - 1, J, K));
      g[1] += w * (fv(I, J + 1, K) - fv(I, J - 1, K));
      g[2] += w * (fv(I, J, K + 1) - fv(I, J, K - 1));
    }
    const l = Math.hypot(g[0], g[1], g[2]) || 1;
    g[0] /= l; g[1] /= l; g[2] /= l;
  };
  for (let q = 0; q < nv; q++) {
    const x = P[q * 3], y = P[q * 3 + 1], z = P[q * 3 + 2];
    gradiente(x, y, z);
    const gxv = g[0], gyv = g[1], gzv = g[2];
    NOR[q * 3] = gxv; NOR[q * 3 + 1] = gyv; NOR[q * 3 + 2] = gzv;

    let id = campo.conEtiqueta(x, y, z).id;
    if (o.refinar) id = o.refinar(id, x, y, z);
    let n = indice.get(id);
    if (n === undefined) { n = etiquetas.length; etiquetas.push(id); indice.set(id, n); }
    ETQ[q] = n;

    if (o.ao !== false) {
      // Oclusión: cuánto «tapa» el propio tejido al alejarse por la normal.
      let oc = 0;
      let peso = 1;
      for (const dist of [0.05, 0.11, 0.19, 0.3]) {
        const dd = dl(x + gxv * dist, y + gyv * dist, z + gzv * dist);
        oc += peso * Math.max(0, dist - dd);
        peso *= 0.62;
      }
      AO[q] = Math.max(0, Math.min(1, 1 - 3.6 * oc));
    }
  }

  return { pos: P, nor: NOR, ao: AO, etq: ETQ, idx: new Uint32Array(idx), etiquetas };
}
