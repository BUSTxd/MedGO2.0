/**
 * Recorta las 8 hojas de sprites del laboratorio «Checkpoints del ciclo
 * celular» en una imagen por proteína/estructura, y (sin --dry) las sube al
 * bucket público `laboratorio-img` bajo `ciclo-celular/<id>.avif`.
 *
 *   node scripts/ciclo-celular/recortar.mjs [--dry] [--out <carpeta>]
 *
 * Las hojas llegan con el fondo YA quitado (canal alfa) y sin líneas de
 * rejilla: aquí no se limpia, no se reescala ni se rellena. Lo único que se
 * hace es separar piezas y quitar el rótulo «n · NOMBRE» de cada celda.
 *
 * Por qué no se corta por rejilla: varias piezas invaden la celda vecina (FAS,
 * la horquilla, MRN), y un corte fijo las dejaría mochas. Se trabaja con
 * manchas conectadas de alfa:
 *   1. cada mancha casi negra es una letra del rótulo → se descarta;
 *   2. el resto se asigna a la celda donde cae su centroide, así las partes
 *      sueltas de una misma figura (las tres cinasas de MAPK, las chispas de
 *      la rotura, el citocromo c) viajan juntas;
 *   3. la imagen de la celda es el recorte a la caja de sus manchas, con los
 *      píxeles de otras celdas puestos a transparente.
 *
 * Re-codificar es inevitable (AVIF es lossy y recortar exige decodificar);
 * se hace sin pérdida (`lossless`) para no sumar una segunda generación.
 *
 * Escribe además `src/lib/data/ciclo-celular/imagenes.ts` con medidas y
 * anclajes por defecto de cada imagen (lo único que la app lee de aquí).
 */

import { createClient } from '@supabase/supabase-js';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { config } from '../load-env.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const ROOT = join(AQUI, '..', '..');
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const OUT = args.includes('--out') ? args[args.indexOf('--out') + 1] : join(AQUI, 'salida');
const BUCKET = 'laboratorio-img';
const PREFIX = 'ciclo-celular';

// La posición manda (Apéndice B): celda n = fila floor((n−1)/cols), columna (n−1) mod cols.
const HOJAS = {
  1: { cols: 4, rows: 3, cells: ['ciclina_d', 'ciclina_e', 'ciclina_a', 'ciclina_b', 'cdk4_6', 'cdk2', 'cdk1', 'cdc25', 'wip1', 'proteasoma', 'e3_ligasa_scf', 'ubiquitina'] },
  2: { cols: 4, rows: 3, cells: ['factor_crecimiento', 'receptor_rtk', 'ras_gtp', 'cascada_mapk', 'pi3k', 'akt', 'gsk3b', 'membrana_plasmatica', 'myc_max', 'e2f_dp1', 'rb', 'hdac'] },
  3: { cols: 4, rows: 3, cells: ['p53_monomero', 'p53_tetramero', 'mdm2', 'p14arf', 'p16', 'p21', 'p27', 'gadd45', 'adn_helice', 'gen_activo', null, null] },
  4: { cols: 4, rows: 3, cells: ['mrn', 'atm', 'atr_atrip', 'rpa', 'chk1', 'chk2', 'clamp_911', 'topbp1', 'claspina', 'adn_rotura_doble', 'adn_cadena_simple', 'dimero_timina'] },
  // La celda 11 (ORC) llegó vacía en la hoja: `orc` queda sin imagen y la app
  // pinta su marcador de posición.
  5: { cols: 4, rows: 3, cells: ['mcm_helicasa', 'cdc6', 'cdt1', 'ddk', 'horquilla_replicacion', 'geminina', 'brca1', 'brca2', 'rad51_filamento', 'radiacion', 'orc', null] },
  6: { cols: 4, rows: 3, cells: ['wee1', 'myt1', 'proteina_14_3_3', 'plk1', 'aurora_a', 'bora', 'aurora_b', 'apc_c', 'separasa', 'securina', 'trip13_p31', null] },
  7: { cols: 4, rows: 3, cells: ['cromatidas_cohesina', 'cinetocoro_sin_unir', 'cinetocoro_unido', 'microtubulo', 'mps1', 'knl1', 'bub1_bub3', 'mad1_mad2', 'mad2_abierta', 'mad2_cerrada', 'cdc20', 'mcc'] },
  8: { cols: 4, rows: 2, cells: ['bax', 'puma_noxa', 'fas', 'mitocondria_citocromo_c', 'celula_apoptotica', 'celula_senescente', 'celula_normal', null] },
};

const ALFA_MIN = 24;        // por debajo, fondo
const RUIDO = 12;           // manchas de menos píxeles se ignoran
const TINTA = 70;           // una letra: brillo medio (máx. de RGB) por debajo de esto
const HALO = 3;             // píxeles de borde suave que se conservan alrededor

async function manchas(data, W, H) {
  const lab = new Int32Array(W * H).fill(-1);
  const lista = [];
  const cola = new Int32Array(W * H);
  for (let p = 0; p < W * H; p++) {
    if (lab[p] !== -1 || data[p * 4 + 3] <= ALFA_MIN) continue;
    const id = lista.length;
    let ini = 0, fin = 0, n = 0, sx = 0, sy = 0, brillo = 0;
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    cola[fin++] = p; lab[p] = id;
    while (ini < fin) {
      const q = cola[ini++];
      const x = q % W, y = (q - x) / W;
      n++; sx += x; sy += y;
      brillo += Math.max(data[q * 4], data[q * 4 + 1], data[q * 4 + 2]);
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const r = ny * W + nx;
        if (lab[r] === -1 && data[r * 4 + 3] > ALFA_MIN) { lab[r] = id; cola[fin++] = r; }
      }
    }
    lista.push({ id, n, cx: sx / n, cy: sy / n, brillo: brillo / n, x0, y0, x1, y1 });
  }
  return { lab, lista };
}

/** Primer píxel opaco desde arriba en la columna x (normalizado), o null. */
function bordeSuperior(data, W, H, x) {
  for (let y = 0; y < H; y++) if (data[(y * W + x) * 4 + 3] > 128) return y / H;
  return null;
}

const r3 = (v) => Math.round(v * 1000) / 1000;

async function main() {
  mkdirSync(OUT, { recursive: true });
  const supabase = DRY ? null : createClient(config.NEXT_PUBLIC_SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  if (supabase) {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) {
      const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
      if (error) throw new Error(`No se pudo crear el bucket ${BUCKET}: ${error.message}`);
      console.log(`+ bucket ${BUCKET} (público)`);
    }
  }

  const manifiesto = {};
  const avisos = [];
  for (const [num, hoja] of Object.entries(HOJAS)) {
    const archivo = join(AQUI, 'hojas', `hoja${num}.avif`);
    const { data, info } = await sharp(archivo).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height;
    const { lab, lista } = await manchas(data, W, H);
    const cw = W / hoja.cols, ch = H / hoja.rows;

    // Letras del rótulo: manchas oscuras. Todo lo demás se asigna a su celda.
    const celdaDe = new Int32Array(lista.length).fill(-1);
    for (const m of lista) {
      if (m.n < RUIDO || m.brillo < TINTA) continue;
      const c = Math.min(hoja.cols - 1, Math.floor(m.cx / cw));
      const f = Math.min(hoja.rows - 1, Math.floor(m.cy / ch));
      celdaDe[m.id] = f * hoja.cols + c;
    }

    for (let i = 0; i < hoja.cells.length; i++) {
      const id = hoja.cells[i];
      const propias = lista.filter((m) => celdaDe[m.id] === i);
      if (!id) {
        if (propias.some((m) => m.n > 400)) avisos.push(`hoja${num} celda ${i + 1}: se esperaba vacía y trae contenido`);
        continue;
      }
      const area = propias.reduce((a, m) => a + m.n, 0);
      if (area < cw * ch * 0.005) { avisos.push(`hoja${num} celda ${i + 1} (${id}): vacía → sin imagen`); continue; }

      const x0 = Math.max(0, Math.min(...propias.map((m) => m.x0)) - HALO);
      const y0 = Math.max(0, Math.min(...propias.map((m) => m.y0)) - HALO);
      const x1 = Math.min(W - 1, Math.max(...propias.map((m) => m.x1)) + HALO);
      const y1 = Math.min(H - 1, Math.max(...propias.map((m) => m.y1)) + HALO);
      const w = x1 - x0 + 1, h = y1 - y0 + 1;
      const suyas = new Set(propias.map((m) => m.id));

      // Un píxel se queda si es de una mancha propia, o si es borde suave
      // (alfa ≤ ALFA_MIN, sin mancha) a ≤ HALO px de una mancha propia.
      const buf = Buffer.alloc(w * h * 4);
      for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
        const p = (y + y0) * W + (x + x0);
        let queda = false;
        if (lab[p] !== -1) queda = suyas.has(lab[p]);
        else if (data[p * 4 + 3] > 0) {
          for (let dy = -HALO; dy <= HALO && !queda; dy++) for (let dx = -HALO; dx <= HALO; dx++) {
            const nx = x + x0 + dx, ny = y + y0 + dy;
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            if (suyas.has(lab[ny * W + nx])) { queda = true; break; }
          }
        }
        if (queda) data.copy(buf, (y * w + x) * 4, p * 4, p * 4 + 4);
      }

      // Contacto con el borde de la hoja = posible figura mocha.
      if (x0 === 0 || y0 === 0 || x1 === W - 1 || y1 === H - 1) avisos.push(`${id}: toca el borde de la hoja`);

      const avif = await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).avif({ lossless: true, effort: 6 }).toBuffer();
      writeFileSync(join(OUT, `${id}.avif`), avif);
      await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).png().toFile(join(OUT, `${id}.png`));

      // Anclajes por defecto (normalizados 0–1 sobre la imagen recortada):
      // tres sitios de fosforilación sobre el contorno superior, desplazados
      // un 4 % hacia fuera; el muelle de acoplamiento en el centro del lado
      // izquierdo. Son provisionales: el contenido puede fijar otros.
      const pSites = [0.3, 0.5, 0.7]
        .map((fx) => {
          const x = Math.round(fx * (w - 1));
          const top = bordeSuperior(buf, w, h, x);
          return top === null ? null : [r3(fx), r3(Math.max(0, top - 0.04))];
        })
        .filter(Boolean);

      manifiesto[id] = {
        w, h, bytes: avif.length, hoja: Number(num), celda: i + 1,
        pSites,
      };

      if (!DRY) {
        // `upsert`: relanzar el script entero es seguro. Reintentos por los
        // cortes de red sueltos que ya tumbaron una subida a mitad.
        for (let intento = 1; ; intento++) {
          try {
            const { error } = await supabase.storage.from(BUCKET).upload(`${PREFIX}/${id}.avif`, avif, {
              contentType: 'image/avif', upsert: true, cacheControl: '31536000',
            });
            if (error) throw new Error(error.message);
            break;
          } catch (e) {
            if (intento >= 4) throw new Error(`${id}: ${e.message}`);
            await new Promise((r) => setTimeout(r, 800 * intento));
          }
        }
      }
      console.log(`${DRY ? '·' : '↑'} ${id.padEnd(26)} ${String(w).padStart(4)}×${String(h).padEnd(4)} ${(avif.length / 1024).toFixed(1)} KB`);
    }
  }

  const ids = Object.keys(manifiesto).sort();
  const cuerpo = ids.map((id) => {
    const m = manifiesto[id];
    return `  ${id}: { w: ${m.w}, h: ${m.h}, pSites: ${JSON.stringify(m.pSites)} },`;
  }).join('\n');
  const ts = `// GENERADO por scripts/ciclo-celular/recortar.mjs — no editar a mano.
// Medidas reales de cada recorte (px) y sitios de fosforilación por defecto,
// normalizados 0–1 sobre la imagen. Las imágenes viven en el bucket público
// \`${BUCKET}\` bajo \`${PREFIX}/<id>.avif\`.

export type ImagenCruda = { w: number; h: number; pSites: [number, number][] };

export const IMAGENES_CRUDAS: Record<string, ImagenCruda> = {
${cuerpo}
};
`;
  const destino = join(ROOT, 'src', 'lib', 'data', 'ciclo-celular', 'imagenes.ts');
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, ts);

  console.log(`\n${ids.length} imágenes · ${(ids.reduce((a, id) => a + manifiesto[id].bytes, 0) / 1024).toFixed(0)} KB en total`);
  if (avisos.length) console.log('\nAvisos:\n  ' + avisos.join('\n  '));
}

main().catch((e) => { console.error(e); process.exit(1); });
