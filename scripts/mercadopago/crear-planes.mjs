// Crea en Mercado Pago, por API, los preapproval_plan de los planes que están
// en `PLANS` (src/lib/plans.ts) y todavía no existen en la cuenta del token.
//
//   node --experimental-strip-types --no-warnings scripts/mercadopago/crear-planes.mjs [--dry] [--todos]
//
// Usa MP_ACCESS_TOKEN del entorno: con el de `.env.local` (usuario de prueba)
// crea los de TEST; con el de producción, los reales. Son dos juegos de IDs
// distintos: el plan es de la cuenta, no se comparte entre entornos.
//
// Por defecto solo los planes nuevos (no legados). `--todos` incluye los legados.
// Es idempotente: si ya hay un plan activo con el mismo `reason`, importe y
// moneda, no crea otro y devuelve su id.
//
// Nunca crear estos planes desde el panel web de MP: allí quedan bajo otra
// aplicación y `POST /preapproval` con nuestro token los rechaza.

import { PLANS } from '../../src/lib/plans.ts';

const MP = 'https://api.mercadopago.com';
const dry = process.argv.includes('--dry');
const todos = process.argv.includes('--todos');
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

/** «MedGO Residente · 12 meses»: lo que ve el alumno en su resumen de Mercado Pago. */
function motivo(p) {
  return p.commitmentMonths && !p.legado
    ? `MedGO ${p.label} · ${p.commitmentMonths} meses`
    : `MedGO ${p.label}`;
}

/** Cada cuánto cobra: `durationDays` 30 → cada mes; ≥ 365 → cada 12 meses. */
function frecuencia(p) {
  if (p.durationDays === 30) return 1;
  if (p.durationDays >= 365) return 12;
  throw new Error(`${p.key}: durationDays ${p.durationDays} sin frecuencia conocida`);
}

const yo = await mp('/users/me');
const esPrueba = !!yo.test_data?.test_user;
// APP_USR-{application_id}-{ts}-{secreto}-{collector_id}
const appDelToken = token.split('-')[1];
console.log(
  `Cuenta ${yo.id} (${yo.site_id}) · ${esPrueba ? 'USUARIO DE PRUEBA' : 'CUENTA REAL'} · app ${appDelToken}${dry ? ' · --dry' : ''}\n`,
);

const existentes = (await mp('/preapproval_plan/search?status=active&limit=100')).results ?? [];

const lineas = [];
for (const p of Object.values(PLANS)) {
  if (p.legado && !todos) continue;
  const reason = motivo(p);
  const auto = {
    frequency: frecuencia(p),
    frequency_type: 'months',
    transaction_amount: p.amount,
    currency_id: p.currency,
  };
  const ya = existentes.find(
    (e) =>
      e.reason === reason &&
      e.auto_recurring?.transaction_amount === p.amount &&
      e.auto_recurring?.currency_id === p.currency &&
      e.auto_recurring?.frequency === auto.frequency,
  );
  let id = ya?.id;
  if (ya) {
    console.log(`= ${p.key}: ya existe ${ya.id} (app ${ya.application_id})`);
  } else if (dry) {
    console.log(`+ ${p.key}: se crearía «${reason}» ${p.currency} ${p.amount} cada ${auto.frequency} mes(es)`);
  } else {
    const plan = await mp('/preapproval_plan', {
      method: 'POST',
      body: JSON.stringify({
        reason,
        auto_recurring: auto,
        back_url: 'https://www.medgoplus.com/estudio',
        payment_methods_allowed: {
          payment_types: [{ id: 'credit_card' }, { id: 'debit_card' }],
          payment_methods: [],
        },
      }),
    });
    id = plan.id;
    console.log(`+ ${p.key}: creado ${plan.id} (app ${plan.application_id})`);
    if (String(plan.application_id) !== appDelToken) {
      console.warn(`  ⚠ el plan quedó en la app ${plan.application_id}, no en la del token (${appDelToken})`);
    }
  }
  if (id) lineas.push(`${p.mpPlanIdEnv}=${id}`);
}

if (lineas.length) {
  console.log(`\nVariables (${esPrueba ? '.env.local' : 'Vercel, Production'}):\n${lineas.join('\n')}`);
}
