'use client';
// Vista raíz del laboratorio «Citopenias autoinmunes» (misma forma que la de Lupus).
//
//   portada ──capítulo──▶ explorar ──siguiente──▶ …
//                └─ de pago y sin plan ─▶ muro (encima)
//
// El estado va en la URL (`?parte=caliente&paso=3`). Qué capítulos están abiertos lo
// decide el servidor. Al pagar, `SubscribeModal` refresca la página, `contenido` llega
// con todo y se abre el capítulo pedido, sin remontar.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlan } from '@/components/PlanProvider';
import { planUnlocks, type PlanKey } from '@/lib/plans';
import type { Parte, ParteId } from '@/lib/data/citopenias/tipos';
import type { Contenido, ResumenParte } from '@/lib/citopenias/contenido';
import { Rueda } from '../lupus/Cargando';
import { redCorta } from '../lupus/vozCarga';
import { cargarLaminas } from './Lienzo';
import Portada from './Portada';
import Explorar from './Explorar';
import MuroPago from './MuroPago';
import PanelTabla from './Tabla';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';
import h from '@/styles/hipersensibilidad.module.css';

type Vista = { v: 'portada' } | { v: 'parte'; id: ParteId; paso: number; n: number };
type Abiertas = Partial<Record<ParteId, Parte>>;

function leerUrl(abiertas: Abiertas, indice: ResumenParte[]): { vista: Vista; muro: ParteId | null } {
  const q = new URLSearchParams(window.location.search);
  const id = q.get('parte') as ParteId | null;
  if (id && abiertas[id]) {
    const paso = Number(q.get('paso'));
    return { vista: { v: 'parte', id, paso: Number.isFinite(paso) && paso > 0 ? paso : 0, n: 0 }, muro: null };
  }
  if (id && indice.some((p) => p.id === id)) return { vista: { v: 'portada' }, muro: id };
  return { vista: { v: 'portada' }, muro: null };
}

function escribirUrl(v: Vista, prueba: boolean) {
  const q = new URLSearchParams();
  if (prueba) q.set('vistazo', '1');
  if (v.v === 'parte') { q.set('parte', v.id); if (v.paso) q.set('paso', String(v.paso)); }
  const url = `${window.location.pathname}${q.size ? `?${q}` : ''}`;
  if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, '', url);
}

/** `prueba`: el admin mirando el vistazo (`?vistazo=1`); se conserva en la URL y no se refresca solo. */
export default function CitopeniasLab({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
  const router = useRouter();
  const vivo = usePlan();
  const { indice } = contenido;
  const abiertas = useMemo(() => Object.fromEntries(contenido.partes.map((p) => [p.id, p])) as Abiertas, [contenido.partes]);
  const abiertasRef = useRef(abiertas);
  abiertasRef.current = abiertas;
  const indiceRef = useRef(indice);
  indiceRef.current = indice;

  const [inicio] = useState(() => leerUrl(abiertas, indice));
  const [vista, setVista] = useState<Vista>(inicio.vista);
  const [muro, setMuro] = useState<ParteId | null>(inicio.muro);
  const [pagando, setPagando] = useState(false);
  const [listo, setListo] = useState(false);
  const [tabla, setTabla] = useState(false);

  useEffect(() => {
    let vigente = true;
    const primera = inicio.vista.v === 'parte' ? abiertas[inicio.vista.id] : undefined;
    const carga = primera ? Promise.race([cargarLaminas(primera.numero), new Promise((r) => setTimeout(r, 6000))]) : Promise.resolve();
    void carga.then(() => { if (vigente) setListo(true); });
    return () => { vigente = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { escribirUrl(vista, prueba); }, [vista, prueba]);

  // Las láminas del capítulo siguiente, sin prisa, para que el paso de capítulo no las espere.
  const abierto = vista.v === 'parte' ? vista.id : null;
  useEffect(() => {
    if (!abierto || redCorta()) return;
    const sig = indiceRef.current[indiceRef.current.findIndex((p) => p.id === abierto) + 1];
    if (!sig || !abiertasRef.current[sig.id]) return;
    const espera = setTimeout(() => { void cargarLaminas(sig.numero); }, 3000);
    return () => clearTimeout(espera);
  }, [abierto]);

  const anticipar = useCallback((id: ParteId) => {
    const parte = abiertasRef.current[id];
    if (parte && !redCorta()) void cargarLaminas(parte.numero);
  }, []);

  const portada = useCallback(() => setVista({ v: 'portada' }), []);
  const abrir = useCallback((id: ParteId, paso = 0) => {
    const elegida = abiertasRef.current[id];
    if (!elegida) { setMuro(id); return; }
    // Sin esperarlas: el audio tiene que arrancar dentro del clic (Safari lo exige).
    void cargarLaminas(elegida.numero);
    setMuro(null);
    setVista((v) => ({ v: 'parte', id, paso, n: (v.v === 'parte' ? v.n : 0) + 1 }));
  }, []);
  const onPaso = useCallback((i: number) => setVista((v) => (v.v === 'parte' && v.paso !== i ? { ...v, paso: i } : v)), []);

  // Pagó y el servidor ya mandó los capítulos: se abre el que había pedido.
  useEffect(() => {
    if (muro && !pagando && abiertas[muro]) abrir(muro);
  }, [muro, pagando, abiertas, abrir]);

  // El plan se activó por otro camino y la página sigue con el vistazo: una sola vuelta al servidor.
  const pagado = vivo.isActive && planUnlocks(vivo.plan, plan);
  const pedido = useRef(false);
  useEffect(() => {
    if (prueba || contenido.completo || !pagado || pedido.current) return;
    pedido.current = true;
    router.refresh();
  }, [prueba, contenido.completo, pagado, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (tabla) { setTabla(false); return; }
      if (muro) { if (!pagando) setMuro(null); return; }
      if (vista.v === 'portada') return;
      if (document.querySelector('[role="dialog"][data-bloquea-esc]')) return;
      portada();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [vista.v, muro, pagando, portada, tabla]);

  if (!listo) return <Rueda />;

  const resumenMuro = muro ? indice.find((p) => p.id === muro) : undefined;
  const capaMuro = resumenMuro && (
    <MuroPago parte={resumenMuro} plan={plan} dePago={indice.filter((p) => !p.gratis).length} pagando={pagando} onPagar={setPagando} onCerrar={() => setMuro(null)} />
  );

  // Sin el plan, la tabla no ha llegado: el botón lleva al muro, como un capítulo de pago.
  const abrirTabla = () => { if (contenido.tabla) setTabla(true); else setMuro('caliente'); };
  const capaTabla = tabla && contenido.tabla && <PanelTabla nota={contenido.tabla} onCerrar={() => setTabla(false)} />;

  const parte = vista.v === 'parte' ? abiertas[vista.id] : undefined;
  if (vista.v === 'portada' || !parte) {
    return (
      <div className={`${c.lab} ${h.aparece}`}>
        <Portada contenido={contenido} onParte={(id) => abrir(id)} onAnticipar={anticipar} onTabla={abrirTabla} />
        {capaMuro}
        {capaTabla}
      </div>
    );
  }

  const sig = indice[indice.findIndex((p) => p.id === parte.id) + 1];
  return (
    <div className={`${c.lab} ${h.aparece}`}>
      <header className={`${c.cabecera} ${s.cabeceraLinf}`}>
        <button type="button" className={c.btnVolver} onClick={portada} aria-label="Volver a los capítulos (Esc)">
          <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div className={c.cabeceraTitulo}>
          <h2>{parte.nombre}</h2>
          <p>{parte.tipo} · {parte.lugar} · {parte.pregunta}</p>
        </div>
        <nav className={s.selectorPartes} aria-label="Capítulo">
          {indice.map((p) => {
            const cerrado = !abiertas[p.id];
            return (
              <button
                key={p.id}
                type="button"
                className={`${p.id === parte.id ? s.parteActiva : ''} ${cerrado ? h.parteBloqueada : ''}`}
                style={{ ['--parte' as string]: p.color }}
                aria-current={p.id === parte.id ? 'page' : undefined}
                onPointerEnter={() => anticipar(p.id)}
                onClick={() => abrir(p.id)}
                title={cerrado ? `${p.nombre} (de pago)` : p.nombre}
              >
                <span>{p.numero}</span>{p.nombreCorto}
              </button>
            );
          })}
        </nav>
        <button type="button" className={c.btnFlot} onClick={abrirTabla}>Tabla</button>
      </header>
      <div key={`${vista.id}-${vista.n}`} className={c.entrada}>
        <Explorar
          parte={parte}
          pasoInicial={vista.paso}
          onPaso={onPaso}
          onSiguiente={sig ? () => abrir(sig.id) : null}
          onVolver={portada}
          vozSiguiente={sig ? abiertas[sig.id]?.narracion : undefined}
          detener={tabla || !!muro}
        />
      </div>
      {capaMuro}
      {capaTabla}
    </div>
  );
}
