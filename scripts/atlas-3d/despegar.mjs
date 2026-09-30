// Saca un vaso de dentro de un hueso en el que BodyParts3D lo dejó metido
// (p. ej. la arteria supraescapular, 55 % dentro de la escápula).
//
// Cada vértice del vaso que cae dentro del hueso mide cuánto está hundido y
// hacia dónde queda la superficie (normal del vértice del hueso más cercano).
// El empujón no se aplica vértice a vértice, que aplastaría el tubo contra el
// hueso: cada vértice toma el mayor empujón de su vecindad (radio VECINDAD,
// más que el grosor del vaso), así la sección entera se traslada junta y el
// tubo conserva su forma, apoyado sobre la superficie con un margen.

const VECINDAD = 0.006; // m: más que el grosor del vaso, la sección se mueve junta
const TRANSICION = 0.015; // m: tramo en que el empujón se apaga, sin quiebre
const MARGEN = 0.0006; // m sobre la superficie

/** Punto dentro de una malla cerrada: paridad de un rayo casi +X. */
function dentro(P, I, x, y, z) {
  let c = 0;
  const dx = 1, dy = 0.000137, dz = 0.000291;
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, d = I[t + 2] * 3;
    const ax = P[a], ay = P[a + 1], az = P[a + 2];
    const e1x = P[b] - ax, e1y = P[b + 1] - ay, e1z = P[b + 2] - az;
    const e2x = P[d] - ax, e2y = P[d + 1] - ay, e2z = P[d + 2] - az;
    const px = dy * e2z - dz * e2y, py = dz * e2x - dx * e2z, pz = dx * e2y - dy * e2x;
    const det = e1x * px + e1y * py + e1z * pz;
    if (Math.abs(det) < 1e-14) continue;
    const inv = 1 / det, tx = x - ax, ty = y - ay, tz = z - az;
    const u = (tx * px + ty * py + tz * pz) * inv;
    if (u < 0 || u > 1) continue;
    const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x;
    const v = (dx * qx + dy * qy + dz * qz) * inv;
    if (v < 0 || u + v > 1) continue;
    if ((e2x * qx + e2y * qy + e2z * qz) * inv > 0) c++;
  }
  return c % 2 === 1;
}

/**
 * @param vaso  { pos: Float32Array }  se devuelve una copia desplazada
 * @param hueso { pos: Float32Array, nor: Int16Array, idx: Uint32Array }
 * @returns { pos, antes, despues } fracción de vértices dentro antes y después
 */
export function despegar(vaso, hueso) {
  const n = vaso.pos.length / 3;
  const hundido = new Float32Array(n);
  const normal = new Float32Array(n * 3);
  let antes = 0;

  for (let i = 0; i < n; i++) {
    const x = vaso.pos[i * 3], y = vaso.pos[i * 3 + 1], z = vaso.pos[i * 3 + 2];
    if (!dentro(hueso.pos, hueso.idx, x, y, z)) continue;
    antes++;
    let mejor = Infinity, j = -1;
    for (let k = 0; k < hueso.pos.length; k += 3) {
      const d = (hueso.pos[k] - x) ** 2 + (hueso.pos[k + 1] - y) ** 2 + (hueso.pos[k + 2] - z) ** 2;
      if (d < mejor) { mejor = d; j = k; }
    }
    let nx = hueso.nor[j], ny = hueso.nor[j + 1], nz = hueso.nor[j + 2];
    const l = Math.hypot(nx, ny, nz) || 1;
    nx /= l; ny /= l; nz /= l;
    // Profundidad medida sobre la normal (hasta el plano tangente del vértice más cercano).
    const prof = Math.max(0, (hueso.pos[j] - x) * nx + (hueso.pos[j + 1] - y) * ny + (hueso.pos[j + 2] - z) * nz);
    hundido[i] = prof + MARGEN;
    normal.set([nx, ny, nz], i * 3);
  }

  // Cada vértice toma el mayor empujón de su vecindad; luego se suaviza.
  const empuje = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let max = 0, m = -1;
    for (let k = 0; k < n; k++) {
      if (!hundido[k] || hundido[k] <= max) continue;
      const d = Math.hypot(vaso.pos[i * 3] - vaso.pos[k * 3], vaso.pos[i * 3 + 1] - vaso.pos[k * 3 + 1], vaso.pos[i * 3 + 2] - vaso.pos[k * 3 + 2]);
      if (d <= VECINDAD) { max = hundido[k]; m = k; }
    }
    if (m > -1) empuje.set([normal[m * 3] * max, normal[m * 3 + 1] * max, normal[m * 3 + 2] * max], i * 3);
  }
  const suave = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    let sx = 0, sy = 0, sz = 0, c = 0;
    for (let k = 0; k < n; k++) {
      const d = Math.hypot(vaso.pos[i * 3] - vaso.pos[k * 3], vaso.pos[i * 3 + 1] - vaso.pos[k * 3 + 1], vaso.pos[i * 3 + 2] - vaso.pos[k * 3 + 2]);
      if (d > TRANSICION) continue;
      // Peso que cae con la distancia: el empujón se desvanece a lo largo del vaso.
      const w = 1 - d / TRANSICION;
      sx += empuje[k * 3] * w; sy += empuje[k * 3 + 1] * w; sz += empuje[k * 3 + 2] * w; c += w;
    }
    suave.set([sx / c, sy / c, sz / c], i * 3);
  }

  const pos = Float32Array.from(vaso.pos, (v, i) => v + suave[i]);
  let despues = 0;
  for (let i = 0; i < n; i++) if (dentro(hueso.pos, hueso.idx, pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])) despues++;
  return { pos, antes: antes / n, despues: despues / n };
}
