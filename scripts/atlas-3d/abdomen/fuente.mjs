// Abdomen 3D, paso 1: saca de los FBX de Z-Anatomy (CC BY-SA 4.0) las mallas que
// usa la región y las deja en una caché soldada, en metros y con los ejes del atlas.
//
//   node scripts/atlas-3d/abdomen/fuente.mjs <carpeta-con-los-fbx>
//
// Los FBX están en el repo de Z-Anatomy (Resources/Models/FBX, rama PC-Version):
//   VisceralSystem100.fbx · CardioVascular41.fbx · LymphoidOrgans100.fbx ·
//   SkeletalSystem100.fbx · MuscularSystem100.fbx
// Open3DModel aún no publica el abdomen; Z-Anatomy es la base de la que parte
// Open3DModel y comparte sus coordenadas (cadera y sacro coinciden a ≤ 1 mm con
// los miembros del atlas): FBX en cm con +Y arriba y +X a la izquierda del cuerpo
// = atlas en m.
//
// Cada malla se lee con SUS vértices (no los de sus hijos: el FBX es jerárquico,
// p. ej. la aorta abdominal es madre de todas sus ramas) y se suelda por posición:
// el FBXLoader las entrega sin índice, tres vértices por triángulo.
//
// Deja scripts/atlas-3d/salida/abdomen/fuente.json (fuera de git).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FUENTE } from './piezas.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../..');
const DIR = process.argv[2];
if (!DIR) throw new Error('Uso: node scripts/atlas-3d/abdomen/fuente.mjs <carpeta-con-los-fbx>');

globalThis.self = globalThis;
globalThis.window = globalThis;
const THREE = await import(pathToFileURL(path.join(RAIZ, 'node_modules/three/build/three.module.js')).href);
const { FBXLoader } = await import(pathToFileURL(path.join(RAIZ, 'node_modules/three/examples/jsm/loaders/FBXLoader.js')).href);

const salida = {};
const faltan = [];
for (const [archivo, nombres] of Object.entries(FUENTE)) {
  const b = fs.readFileSync(path.join(DIR, archivo));
  const raiz = new FBXLoader().parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength), '');
  raiz.updateMatrixWorld(true);
  const porNombre = new Map();
  raiz.traverse((o) => { if (o.isMesh && o.geometry.attributes.position && !porNombre.has(o.name)) porNombre.set(o.name, o); });
  for (const n of nombres) {
    const o = porNombre.get(n);
    if (!o) { faltan.push(`${archivo}: ${n}`); continue; }
    salida[n] = soldar(o);
  }
  console.log(`${archivo}: ${nombres.length} mallas`);
}
if (faltan.length) throw new Error(`No están en los FBX:\n  ${faltan.join('\n  ')}`);

function soldar(o) {
  const p = o.geometry.attributes.position;
  const idx = o.geometry.index;
  const v = new THREE.Vector3();
  const clave = new Map();
  const pos = [];
  const f = [];
  const n = idx ? idx.count : p.count;
  for (let k = 0; k < n; k++) {
    const i = idx ? idx.getX(k) : k;
    v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld).multiplyScalar(0.01);
    const c = `${v.x.toFixed(6)},${v.y.toFixed(6)},${v.z.toFixed(6)}`;
    let j = clave.get(c);
    if (j === undefined) { j = pos.length / 3; clave.set(c, j); pos.push(+v.x.toFixed(6), +v.y.toFixed(6), +v.z.toFixed(6)); }
    f.push(j);
  }
  // Fuera los triángulos degenerados que deja la soldadura. Las piezas izquierdas
  // son el espejo de las derechas (escala negativa): sin invertir el orden de sus
  // vértices quedarían con las caras hacia dentro (el visor pinta solo la frontal).
  const espejo = o.matrixWorld.determinant() < 0;
  const caras = [];
  for (let t = 0; t < f.length; t += 3) if (f[t] !== f[t + 1] && f[t + 1] !== f[t + 2] && f[t] !== f[t + 2]) caras.push(...(espejo ? [f[t], f[t + 2], f[t + 1]] : [f[t], f[t + 1], f[t + 2]]));
  return { v: pos, f: caras };
}

const dir = path.join(RAIZ, 'scripts/atlas-3d/salida/abdomen');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'fuente.json'), JSON.stringify(salida));
const tri = Object.values(salida).reduce((n, m) => n + m.f.length / 3, 0);
console.log(`✓ ${Object.keys(salida).length} mallas · ${Math.round(tri / 1000)}k triángulos → scripts/atlas-3d/salida/abdomen/fuente.json`);
