// Prueba la regla de acceso de `src/lib/plans.ts` (planes legados × planes nuevos × requisitos).
// Uso: npm run probar:acceso
import { planUnlocks } from '../src/lib/plans.ts';

// Los mismos requisitos que arma `src/lib/acceso.ts`.
const REQ = {
  cursoUfbi: { tramo: 'basico', nivel: 'base' },
  cursoFacultad: { tramo: 'medicina', nivel: 'base' },
  labUfbi: { tramo: 'basico', nivel: 'completo' },
  labFacultad: { tramo: 'medicina', nivel: 'completo' },
  encib: { tramo: 'medicina', nivel: 'completo' },
  preclinicos: { nivel: 'base' },
  // Las claves viejas que siguen declarando las páginas del dashboard.
  'ufbi': 'ufbi',
  'interno': 'interno',
  'residente': 'residente',
};

// plan → lo que debe abrir (lo demás, no).
const ESPERADO = {
  free: [],
  ufbi: ['cursoUfbi', 'labUfbi', 'ufbi'],
  'ufbi-anual': ['cursoUfbi', 'labUfbi', 'ufbi'],
  interno: ['cursoFacultad', 'labFacultad', 'encib', 'interno'],
  residente: ['cursoFacultad', 'labFacultad', 'encib', 'interno', 'residente'],
  visitante: ['cursoUfbi', 'cursoFacultad', 'preclinicos', 'ufbi', 'interno', 'residente'],
  'residente-12': Object.keys(REQ),
  'especialista-24': Object.keys(REQ),
};

let fallos = 0;
for (const [plan, abre] of Object.entries(ESPERADO)) {
  for (const [nombre, req] of Object.entries(REQ)) {
    const debe = abre.includes(nombre);
    const da = planUnlocks(plan, req);
    if (da !== debe) {
      fallos++;
      console.error(`✗ ${plan} → ${nombre}: da ${da}, debería ${debe}`);
    }
  }
}
console.log(fallos ? `${fallos} fallos` : `OK: ${Object.keys(ESPERADO).length} planes × ${Object.keys(REQ).length} requisitos`);
process.exit(fallos ? 1 : 0);
