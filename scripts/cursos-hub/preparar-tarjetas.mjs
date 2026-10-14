// Las tres tarjetas del carrusel de Cursos, a partir de los dibujos de BUST
// (Descargas). No se toca el dibujo: solo se recortan las esquinas con alfa
// (los dibujos traen el halo claro de fuera en las esquinas) y se pasa a AVIF.
// El brillo y el giro los pone el CSS.
//
//   node scripts/cursos-hub/preparar-tarjetas.mjs [--dir <carpeta>] [--png <carpeta>]
//   (--png: no toca la web, escribe PNG sin pérdida en esa carpeta)
//
// Salida: public/assets/cursos/tarjeta-<slug>_<V>.avif. Cambiar un dibujo
// obliga a subir `V` aquí y en `src/lib/data/encib/hub.ts` (se sirven `immutable`).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { mkdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';

const SALIDA = resolve(dirname(fileURLToPath(import.meta.url)), '../../public/assets/cursos');
const arg = (k, def) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : def; };
const DIR = arg('--dir', join(homedir(), 'Downloads'));
const V = 'v3';
const PNG = arg('--png', null);

const TARJETAS = {
  encib: 'encib 2026.avif',
  'ciencias-basicas': 'ciencias basicas.avif',
  'examen-ciencias-basicas': 'examen de ciencias basicas.avif',
};
/** Radio de la esquina, medido sobre el filo claro de los dibujos (~620 px de ancho). */
const RADIO = 30;

/** Alfa de un rectángulo redondeado con 1 px de antialias. */
function alfaRedondeado(x, y, W, H, r) {
  const cx = Math.min(Math.max(x, r), W - r);
  const cy = Math.min(Math.max(y, r), H - r);
  const d = Math.hypot(x - cx, y - cy);
  return Math.max(0, Math.min(1, r - d + 0.5));
}

mkdirSync(PNG ?? SALIDA, { recursive: true });
for (const [slug, archivo] of Object.entries(TARJETAS)) {
  const { data, info } = await sharp(join(DIR, archivo)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 4 + 3;
      data[o] = Math.round(data[o] * alfaRedondeado(x + 0.5, y + 0.5, W, H, RADIO));
    }
  }
  const img = sharp(data, { raw: { width: W, height: H, channels: 4 } });
  const ruta = PNG ? join(PNG, `tarjeta-${slug}.png`) : join(SALIDA, `tarjeta-${slug}_${V}.avif`);
  await (PNG ? img.png({ compressionLevel: 9 }) : img.avif({ quality: 58, effort: 9 })).toFile(ruta);
  console.log(`  ${ruta.split(/[\\/]/).pop()}  ${W}×${H}  ${(statSync(ruta).size / 1024).toFixed(1)} KB`);
}
