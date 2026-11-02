// Edita en Mercado Pago, por API, los tres planes que ya existen para que cobren
// lo que dice `PLANS` (src/lib/plans.ts), sin crear planes ni cambiar sus IDs.
//
//   node --experimental-strip-types --no-warnings scripts/mercadopago/actualizar-planes.mjs [--aplicar]
//
// Usa MP_ACCESS_TOKEN del entorno. Sin `--aplicar` solo muestra lo que cambiaría.
// Encuentra cada plan por su nombre anterior o por el nuevo: se puede repetir.
//
// El cambio cobra efecto al instante: ejecutarlo justo DESPUÉS de desplegar `PLANS`,
// porque al revés un alumno podría ver el precio viejo y pagar el nuevo, que es mayor.

import { PLANS, mesesDe } from '../../src/lib/plans.ts';

const MP = 'https://api.mercadopago.com';
const aplicar = process.argv.includes('--aplicar');
const token = process.env.MP_ACCESS_TOKEN;
if (!token) {
  console.error('Falta MP_ACCESS_TOKEN en el entorno.');
  process.exit(1);
}

async function mp(path, init = {}) {
  const res = await fetch(`${MP}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  const texto = await res.text();
  if (!res.ok) throw new Error(`MP ${res.status} ${path}: ${texto}`);
  return JSON.parse(texto);
}

const CAMBIOS = [
  { clave: 'visitante', antes: 'MedGO Visitante' },
  { clave: 'especialista-24', antes: 'MedGO Especialista · 24 meses' },
  { clave: 'residente-12', antes: 'MedGO Residente · 12 meses' },
];

const motivo = (p) => (mesesDe(p) > 1 ? `MedGO ${p.label} · ${mesesDe(p)} meses` : `MedGO ${p.label}`);

const yo = await mp('/users/me');
console.log(`Cuenta ${yo.id} (${yo.site_id}) · ${yo.test_data?.test_user ? 'USUARIO DE PRUEBA' : 'CUENTA REAL'}${aplicar ? '' : ' · sin --aplicar: no cambia nada'}\n`);

const activos = (await mp('/preapproval_plan/search?status=active&limit=100')).results ?? [];
let faltan = 0;
for (const { clave, antes } of CAMBIOS) {
  const p = PLANS[clave];
  const reason = motivo(p);
  const encontrados = activos.filter((e) => e.reason === antes || e.reason === reason);
  if (encontrados.length !== 1) {
    console.error(`✗ ${clave}: hay ${encontrados.length} planes activos llamados «${antes}» o «${reason}». No se toca.`);
    faltan++;
    continue;
  }
  const plan = encontrados[0];
  const a = plan.auto_recurring;
  const de = `«${plan.reason}» ${a.currency_id} ${a.transaction_amount} cada ${a.frequency} mes(es)`;
  const auto = {
    frequency: mesesDe(p),
    frequency_type: 'months',
    transaction_amount: p.amount,
    currency_id: p.currency,
  };
  if (plan.reason === reason && a.transaction_amount === auto.transaction_amount && a.frequency === auto.frequency) {
    console.log(`= ${clave} (${plan.id}): ya está en ${de}`);
    continue;
  }
  const a_ = `«${reason}» ${auto.currency_id} ${auto.transaction_amount} cada ${auto.frequency} mes(es)`;
  if (!aplicar) {
    console.log(`~ ${clave} (${plan.id}): ${de} → ${a_}`);
    continue;
  }
  await mp(`/preapproval_plan/${plan.id}`, { method: 'PUT', body: JSON.stringify({ reason, auto_recurring: auto }) });
  const leido = await mp(`/preapproval_plan/${plan.id}`);
  const ok = leido.reason === reason
    && leido.auto_recurring?.transaction_amount === auto.transaction_amount
    && leido.auto_recurring?.frequency === auto.frequency;
  console.log(`${ok ? '✓' : '✗ NO QUEDÓ IGUAL:'} ${clave} (${plan.id}): ${de} → «${leido.reason}» ${leido.auto_recurring?.currency_id} ${leido.auto_recurring?.transaction_amount} cada ${leido.auto_recurring?.frequency} mes(es)`);
  if (!ok) faltan++;
}
process.exit(faltan ? 1 : 0);
