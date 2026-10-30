'use client';
// Vista raíz del laboratorio «Lupus» (copia de la de «Hipersensibilidad»).
//
//   portada (ruta + capítulos) ──capítulo──▶ explorar ──siguiente──▶ …
//                                  └─ de pago y sin plan ─▶ muro (encima)
//
// Una sola ruta; el estado va en la URL (`?parte=que-es&paso=3`). Qué capítulos
// están abiertos lo decide el servidor (`contenido`, ver page.tsx): aquí solo se
// enseña el muro al tocar uno cerrado. Los capítulos aún sin animar salen como
// «Pronto» y no se abren. Al pagar, `SubscribeModal` refresca la página,
// `contenido` llega con todo y se abre el capítulo pedido, sin remontar.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlan } from '@/components/PlanProvider';
import { planUnlocks, type PlanKey } from '@/lib/plans';
import type { Escenario, Parte, ParteId } from '@/lib/data/lupus/tipos';
import type { Contenido, ResumenParte } from '@/lib/lupus/contenido';
import { ContenidoLab } from './ContenidoLab';
import { Rueda } from './Cargando';
import { srcImagen } from '../hipersensibilidad/imagenes';
import Portada from './Portada';
import Explorar from './Explorar';
import MuroPago from './MuroPago';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';
import h from '@/styles/hipersensibilidad.module.css';
import l from '@/styles/lupus.module.css';

type Vista = { v: 'portada' } | { v: 'parte'; id: ParteId; paso: number; n: number };
type Abiertas = Partial<Record<ParteId, Parte>>;

function leerUrl(abiertas: Abiertas, indice: ResumenParte[]): { vista: Vista; muro: ParteId | null } {
  const q = new URLSearchParams(window.location.search);
  const id = q.get('parte') as ParteId | null;
  if (id && abiertas[id]) {
    const paso = Number(q.get('paso'));
    return { vista: { v: 'parte', id, paso: Number.isFinite(paso) && paso > 0 ? paso : 0, n: 0 }, muro: null };
  }
  // Enlace a un capítulo cerrado (y ya animado): la portada con el muro encima.
  if (id && indice.some((p) => p.id === id && p.listo)) return { vista: { v: 'portada' }, muro: id };
  return { vista: { v: 'portada' }, muro: null };
}

function escribirUrl(v: Vista, prueba: boolean) {
  const q = new URLSearchParams();
  if (prueba) q.set('vistazo', '1');
  if (v.v === 'parte') { q.set('parte', v.id); if (v.paso) q.set('paso', String(v.paso)); }
  const url = `${window.location.pathname}${q.size ? `?${q}` : ''}`;
  if (url !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(window.history.state, '', url);
}

/** Las imágenes que pinta un escenario (las láminas del capítulo 0 son todo código). */
function imagenesDe(esc: Escenario): string[] {
  const ids = new Set<string>();
  const ver = (o: unknown) => {
    if (Array.isArray(o)) o.forEach(ver);
    else if (o && typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) {
        if (k === 'img' && typeof v === 'string') ids.add(v);
        else ver(v);
      }
    }
  };
  ver(esc);
  return [...ids].map(srcImagen).filter((src): src is string => !!src);
}

function precargar(srcs: string[], tope = 6000): Promise<void> {
  const todas = Promise.all(srcs.map((src) => {
    const img = new window.Image();
    img.src = src;
    return img.decode().catch(() => undefined);
  }));
  return Promise.race([todas.then(() => undefined), new Promise<void>((r) => setTimeout(r, tope))]);
}

/** `prueba`: el admin mirando el vistazo (`?vistazo=1`); se conserva en la URL y no se refresca solo. */
export default function LupusLab({ contenido, plan, prueba }: { contenido: Contenido; plan: PlanKey; prueba: boolean }) {
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

  useEffect(() => {
    let vigente = true;
    const primera = inicio.vista.v === 'parte' ? abiertas[inicio.vista.id] : undefined;
    precargar(primera ? imagenesDe(primera) : []).then(() => { if (vigente) setListo(true); });
    return () => { vigente = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { escribirUrl(vista, prueba); }, [vista, prueba]);

  const portada = useCallback(() => setVista({ v: 'portada' }), []);
  const abrir = useCallback((id: ParteId, paso = 0) => {
    if (!indiceRef.current.find((p) => p.id === id)?.listo) return;
    if (!abiertasRef.current[id]) { setMuro(id); return; }
    setMuro(null);
    setVista((v) => ({ v: 'parte', id, paso, n: (v.v === 'parte' ? v.n : 0) + 1 }));
  }, []);
  const onPaso = useCallback((i: number) => setVista((v) => (v.v === 'parte' && v.paso !== i ? { ...v, paso: i } : v)), []);

  // Pagó y el servidor ya mandó los capítulos: se abre el que había pedido
  // (cuando cierra el recibo, no encima de él).
  useEffect(() => {
    if (muro && !pagando && abiertas[muro]) abrir(muro);
  }, [muro, pagando, abiertas, abrir]);

  // El plan se activó por otro camino (otra pestaña, «Mi cuenta») y la página
  // sigue con el vistazo: una sola vuelta al servidor.
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
      if (muro) { if (!pagando) setMuro(null); return; }
      if (vista.v === 'portada') return;
      if (document.querySelector('[role="dialog"][data-bloquea-esc]')) return;
      portada();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [vista.v, muro, pagando, portada]);

  if (!listo) return <Rueda />;

  const resumenMuro = muro ? indice.find((p) => p.id === muro) : undefined;
  const capaMuro = resumenMuro && (
    <MuroPago
      parte={resumenMuro}
      plan={plan}
      dePago={indice.filter((p) => !p.gratis).length}
      pagando={pagando}
      onPagar={setPagando}
      onCerrar={() => setMuro(null)}
    />
  );

  const parte = vista.v === 'parte' ? abiertas[vista.id] : undefined;
  if (vista.v === 'portada' || !parte) {
    return (
      <ContenidoLab.Provider value={contenido}>
        <div className={`${c.lab} ${h.aparece}`}>
          <Portada onParte={(id) => abrir(id)} />
          {capaMuro}
        </div>
      </ContenidoLab.Provider>
    );
  }

  const sig = indice[indice.findIndex((p) => p.id === parte.id) + 1];
  const haySig = sig?.listo ? sig : null;
  return (
    <ContenidoLab.Provider value={contenido}>
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
              const cerrado = p.listo && !abiertas[p.id];
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`${p.id === parte.id ? s.parteActiva : ''} ${cerrado ? h.parteBloqueada : ''} ${p.listo ? '' : l.parteProxima}`}
                  style={{ ['--parte' as string]: p.color }}
                  aria-current={p.id === parte.id ? 'page' : undefined}
                  disabled={!p.listo}
                  onClick={() => abrir(p.id)}
                  title={!p.listo ? `${p.nombre} (pronto)` : cerrado ? `${p.nombre} (de pago)` : p.nombre}
                >
                  <span>{p.numero}</span>{p.nombreCorto}
                </button>
              );
            })}
          </nav>
        </header>
        <div key={`${vista.id}-${vista.n}`} className={c.entrada}>
          <Explorar
            parte={parte}
            pasoInicial={vista.paso}
            onPaso={onPaso}
            onSiguiente={haySig ? () => abrir(haySig.id) : null}
            onVolver={portada}
            vozSiguiente={haySig ? abiertas[haySig.id]?.narracion : undefined}
          />
        </div>
        {capaMuro}
      </div>
    </ContenidoLab.Provider>
  );
}
