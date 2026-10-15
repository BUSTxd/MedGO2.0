/**
 * Recorta las ilustraciones de Servier Medical Art (CC BY-SA 3.0) para el
 * laboratorio «Maduración de linfocitos».
 *
 *   node scripts/linfocitos/preparar-imagenes.mjs --dir <carpeta con 01.png…>
 *
 * Quita el borde transparente, lleva el lado mayor a 420 px y las deja en
 * `public/lab-linfocitos/<id>.png` (fuera de git) para que BUST las optimice a
 * AVIF con el mismo nombre. Regenera `imagenes.ts` apuntando a esos PNG locales.
 *
 * Paso final: `subir-imagenes.mjs --dir <carpeta con los AVIF>`, que los sube al
 * bucket y vuelve a generar `imagenes.ts` apuntando a él.
 */

import sharp from 'sharp';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const i = process.argv.indexOf('--dir');
if (i === -1) { console.error('Falta --dir <carpeta>'); process.exit(1); }
const DIR = process.argv[i + 1];
const SALIDA = path.join(RAIZ, 'public', 'lab-linfocitos');
mkdirSync(SALIDA, { recursive: true });

// archivo de origen → id. Fuente: Wikimedia Commons, serie «Smart-Servier».
const MAPA = {
  '01': ['hsc', 'Cardiovascular system - Lymphopoiesis - Hematopoietic stem cell'],
  '02': ['pluripotente', 'Cardiovascular system - Lymphopoiesis - Pluripotent stem cell'],
  '03': ['progenitor_linfoide', 'Cardiovascular system - Lymphopoiesis - Lymphoid stem cell'],
  '04': ['nk', 'Cardiovascular system - Lymphopoiesis - NK cell'],
  '05': ['mieloide', 'Cardiovascular system - Myelopoiesis - Myeloid stem cell'],
  '06': ['timo', 'Glands - Thymus'],
  '07': ['ganglio_corte', 'Lymphatic system - Lymph node 1'],
  '08': ['ganglio', 'Lymphatic system - Lymph node 2'],
  '09': ['anticuerpo', 'Immunology and haematology - Antibody 1'],
  '10': ['anticuerpo_2', 'Immunology and haematology - Antibody 3'],
  '11': ['iga', 'Immunology and haematology - Antibodies - IgA'],
  '12': ['eosinofilo', 'Cardiovascular system - Eosinophil granulocyte 1'],
  '13': ['monocito', 'Cardiovascular system - Monocyte 1'],
  '15': ['linfocito_1', 'Cardiovascular system - Lymphocyte 1'],
  '16': ['linfocito_2', 'Cardiovascular system - Lymphocyte 2'],
  '17': ['linfocito_3', 'Cardiovascular system - Lymphocyte 3'],
  '18': ['linfocito_4', 'Cardiovascular system - Lymphocyte 4'],
  '19': ['linfocito_5', 'Cardiovascular system - Lymphocyte 5'],
  '20': ['linfocito_6', 'Cardiovascular system - Lymphocyte 6'],
  '21': ['linfocito_7', 'Cardiovascular system - Lymphocyte 7'],
};

const medidas = {};
const faltan = [];
for (const [archivo, [id, fuente]] of Object.entries(MAPA)) {
  const src = path.join(DIR, `${archivo}.png`);
  if (!existsSync(src)) { faltan.push(`${archivo} (${id})`); continue; }
  try {
    const recorte = await sharp(src).trim({ threshold: 1 }).toBuffer();
    const { data, info } = await sharp(recorte)
      .resize(420, 420, { fit: 'inside', withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toBuffer({ resolveWithObject: true });
    writeFileSync(path.join(SALIDA, `${id}.png`), data);
    medidas[id] = { w: info.width, h: info.height, fuente };
    console.log(`  ${id.padEnd(20)} ${info.width}×${info.height}  ${(data.length / 1024).toFixed(0)} KB`);
  } catch (e) {
    faltan.push(`${archivo} (${id}): ${e.message.split('\n')[0]}`);
  }
}

const filas = Object.entries(medidas).map(([id, m]) => `  ${id}: { w: ${m.w}, h: ${m.h} }, // ${m.fuente} -- Smart-Servier`).join('\n');
writeFileSync(path.join(RAIZ, 'src', 'lib', 'data', 'linfocitos', 'imagenes.ts'), `// GENERADO por scripts/linfocitos/preparar-imagenes.mjs — no editar a mano.
// Ilustraciones de Servier Medical Art (smart.servier.com), CC BY-SA 3.0, vía
// Wikimedia Commons, recortadas. Medidas en px del recorte.
//
// Mientras BUST no las optimice, se sirven en local desde public/lab-linfocitos/
// (fuera de git). Al subirlas al bucket, cambiar BASE y EXT.

export const BASE = '/lab-linfocitos';
export const EXT = 'png';

export const IMAGENES: Record<string, { w: number; h: number }> = {
${filas}
};

export const srcImagen = (id: string) => (IMAGENES[id] ? \`\${BASE}/\${id}.\${EXT}\` : null);
`);

if (faltan.length) console.log(`\nFaltan: ${faltan.join(', ')}`);
console.log(`\n${Object.keys(medidas).length} imágenes en public/lab-linfocitos/ · imagenes.ts regenerado.`);
