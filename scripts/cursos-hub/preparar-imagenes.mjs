// Fondo y materias del escenario de Cursos (las tarjetas del carrusel salen de
// preparar-tarjetas.mjs; las flechas y los puntos ya son CSS). Las fuentes son las que BUST
// dejó en Descargas; el resultado va a public/assets/cursos/.
//
// Los nombres llevan versión (_v1) porque /assets/cursos/* se sirve como
// immutable (next.config.mjs): si cambias un dibujo, sube la versión aquí y en
// src/lib/data/encib/hub.ts, o los navegadores seguirán con el viejo un año.
//
//   node scripts/cursos-hub/preparar-imagenes.mjs [--origen <carpeta Descargas>] [--solo-fondo | --solo-materias]
//
// Con --png <carpeta> no toca la web: escribe en esa carpeta PNG sin pérdida a
// la resolución completa de la fuente (las materias, sin reducir a 200 px).
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { mkdirSync, statSync } from 'node:fs';
import { homedir } from 'node:os';

const SALIDA = resolve(dirname(fileURLToPath(import.meta.url)), '../../public/assets/cursos');
const i = process.argv.indexOf('--origen');
const ORIGEN = i > 0 ? process.argv[i + 1] : join(homedir(), 'Downloads');
const V = 'v1';
const ip = process.argv.indexOf('--png');
/** Carpeta de exportación en PNG sin pérdida (o null: AVIF para la web). */
const PNG = ip > 0 ? process.argv[ip + 1] : null;

const FONDO = join(ORIGEN, 'fondo.png');
/** Versión propia del fondo (se cambió el dibujo). */
const V_FONDO = 'v2';
/** Los iconos de las materias (solo el dibujo, sin rótulo: el nombre lo pinta la franja). */
const MATERIAS_DIR = join(ORIGEN, 'notion-export (1)');
const MATERIAS = {
  anatomia: 'Calavera anatómica con columna cervical.avif',
  fisiologia: 'Corazón anatómico con electrocardiograma neón.avif',
  bioquimica: 'Imagen de ChatGPT 13 oct 2026, 14_48_40.avif',
  histologia: 'Imagen de ChatGPT 13 oct 2026, 14_50_40.avif',
  embriologia: 'Imagen de ChatGPT 13 oct 2026, 14_52_11.avif',
  genetica: 'Icono de ADN y cromosoma brillantes.avif',
  microbiologia: 'Bacteria púrpura con cocos brillantes.avif',
  parasitologia: 'Tenia parásita segmentada y brillante.avif',
  inmunologia: 'Imagen de ChatGPT 13 oct 2026, 15_04_48.avif',
  farmacologia: 'Cápsula abierta con gránulos y frasco ámbar.avif',
  patologia: 'Hígado enfermo con lupa dorada.avif',
};
/** Versión propia de las materias (v6: iconos sin rótulo, livianos). */
const V_MATERIAS = 'v6';
/** Calidad AVIF por materia: la más baja que deja cada una en ~50 % de lo que
 *  pesaba a calidad 64, sin que se note a su tamaño (BUST las pidió así). */
const CALIDAD_MATERIA = 34;
const CALIDAD_PROPIA = { anatomia: 32, bioquimica: 32, farmacologia: 32, fisiologia: 35, inmunologia: 35, embriologia: 37, histologia: 38, patologia: 38 };
/** Se ven a ~70-110 px: 200 alcanza para pantallas 2×. Todas en la MISMA caja
 *  cuadrada, recortadas a su dibujo y centradas, para que ninguna se vea más
 *  grande que el resto. */
const LADO_MATERIA = 200;

mkdirSync(PNG ?? SALIDA, { recursive: true });
const destino = (nombre) => join(SALIDA, `${nombre}_${V}.avif`);
const informe = (ruta, w, h) => console.log(`  ${ruta.split(/[\\/]/).pop().padEnd(34)} ${w}×${h}  ${(statSync(ruta).size / 1024).toFixed(1)} KB`);

// ── Fondo ─────────────────────────────────────────────────────────────────
// Trae la marca de un iconito arriba a la derecha (≈1560-1597 × 5-40). Se tapa
// con el cielo de su izquierda (antes de la línea vertical de x≈1542),
// difuminado y con el borde fundido.
async function fondo() {
  const img = sharp(FONDO);
  const { width, height } = await img.metadata();
  const L = 44, BORDE = 6;
  const parche = await sharp(FONDO).extract({ left: 1496, top: 3, width: L, height: L }).blur(6).ensureAlpha().raw().toBuffer();
  // Alfa: opaco en el centro, fundido en los BORDE px de cada lado.
  for (let y = 0; y < L; y++) {
    for (let x = 0; x < L; x++) {
      const d = Math.min(x, y, L - 1 - x, L - 1 - y);
      parche[(y * L + x) * 4 + 3] = Math.round(255 * Math.min(1, d / BORDE));
    }
  }
  const ruta = PNG ? join(PNG, 'fondo.png') : join(SALIDA, `fondo_${V_FONDO}.avif`);
  const conParche = img.composite([{ input: parche, raw: { width: L, height: L, channels: 4 }, left: 1558, top: 3 }]);
  await (PNG ? conParche.png({ compressionLevel: 9 }) : conParche.avif({ quality: 60, effort: 9 })).toFile(ruta);
  informe(ruta, width, height);
}

// ── Materias: iconos AVIF de ~400 px → AVIF de 200 px con alfa ──────────
async function materias() {
  for (const [slug, archivo] of Object.entries(MATERIAS)) {
    const recorte = await sharp(join(MATERIAS_DIR, archivo)).trim({ threshold: 1 }).png().toBuffer();
    if (PNG) {
      // Resolución completa: se rellena con transparente hasta el cuadrado, sin remuestrear.
      const { width: w, height: h } = await sharp(recorte).metadata();
      const L = Math.max(w, h);
      const ruta = join(PNG, `materia-${slug}.png`);
      await sharp(recorte)
        .extend({ left: (L - w) >> 1, right: L - w - ((L - w) >> 1), top: (L - h) >> 1, bottom: L - h - ((L - h) >> 1), background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9 })
        .toFile(ruta);
      informe(ruta, L, L);
      continue;
    }
    const ruta = join(SALIDA, `materia-${slug}_${V_MATERIAS}.avif`);
    const info = await sharp(recorte)
      .resize({ width: LADO_MATERIA, height: LADO_MATERIA, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
      .avif({ quality: CALIDAD_PROPIA[slug] ?? CALIDAD_MATERIA, effort: 9 })
      .toFile(ruta);
    informe(ruta, info.width, info.height);
  }
}

console.log(`Origen: ${ORIGEN}\nSalida: ${PNG ?? SALIDA}`);
if (!process.argv.includes('--solo-materias')) await fondo();
if (!process.argv.includes('--solo-fondo')) await materias();
