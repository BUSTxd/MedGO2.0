'use client';
// La animación real del laboratorio «Hipersensibilidad» dentro de la landing: el mismo
// motor (`evaluar`), el mismo escenario SVG y los mismos tejidos, en bucle y sin controles.
// Se baja aparte (`next/dynamic` en ExploraHipersensibilidad) y sólo corre mientras se ve.

import { useEffect, useMemo, useRef, useState } from 'react';
import Escena from '@/app/dashboard/laboratorio/hipersensibilidad/Escena';
import { useMovimientoReducido, useReproductor } from '@/app/dashboard/laboratorio/hipersensibilidad/useReproductor';
import { FuentesImagen, srcImagen } from '@/app/dashboard/laboratorio/hipersensibilidad/imagenes';
import { useModo } from '@/app/dashboard/laboratorio/maduracion-linfocitos/useModo';
import { compilado } from '@/lib/hipersensibilidad/contenido';
import type { Escenario } from '@/lib/data/hipersensibilidad/tipos';
import guion from '@/lib/data/hipersensibilidad/landing';
import c from '@/styles/cicloCelular.module.css';
import ls from '@/styles/linfocitos.module.css';
import l from '@/styles/landingNueva.module.css';

/** Los tres recortes de la escena van desde `public/` (caché de un año): la landing no pide nada al bucket del laboratorio. */
const LOCALES: Record<string, string> = {
  mastocito: '/assets/landing/hip-mastocito_v1.avif',
  mastocito_activo: '/assets/landing/hip-mastocito-activo_v1.avif',
  alergeno: '/assets/landing/hip-alergeno_v1.avif',
};

/** Pausa con la escena terminada antes de repetir. */
const REPOSO = 2200;

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
  return [...ids].map((id) => LOCALES[id] ?? srcImagen(id)).filter((src): src is string => !!src);
}

/** Baja y decodifica, con tope: una imagen lenta no debe dejar la escena sin salir. */
function precargar(srcs: string[], tope = 5000): Promise<void> {
  const todas = Promise.all(srcs.map((src) => {
    const img = new window.Image();
    img.src = src;
    return img.decode().catch(() => undefined);
  }));
  return Promise.race([todas.then(() => undefined), new Promise<void>((r) => setTimeout(r, tope))]);
}

function Reproduccion({ activa }: { activa: boolean }) {
  const zona = useRef<HTMLDivElement>(null);
  const modo = useModo(zona);
  const reducido = useMovimientoReducido();
  const comp = useMemo(() => compilado(guion, modo), [modo]);
  const rep = useReproductor(comp, 0, { autoInicial: true });
  const ultimo = comp.pasos.length - 1;

  // Espejo para que los efectos de abajo no dependan de cada fotograma.
  const repRef = useRef(rep);
  repRef.current = rep;

  // Sólo corre mientras se ve (y sin el botón de pausa de la landing).
  useEffect(() => {
    if (reducido) return;
    if (!activa) repRef.current.pausar();
    else if (repRef.current.pausado) repRef.current.alternar();
  }, [activa, reducido]);

  // Con movimiento reducido, el último fotograma y nada más.
  useEffect(() => { if (reducido) repRef.current.irA(ultimo, false); }, [reducido, ultimo]);

  // Al terminar el último paso, un respiro y otra vez desde el principio.
  useEffect(() => {
    if (reducido || !activa || !rep.terminado || rep.paso !== ultimo || rep.pausado) return;
    const id = setTimeout(() => repRef.current.alternar(), REPOSO);
    return () => clearTimeout(id);
  }, [reducido, activa, rep.terminado, rep.paso, rep.pausado, ultimo]);

  return (
    <>
      <div ref={zona} className={`dark-mode ${l.hipEscenaRaiz}`}>
        <div className={`${c.wrapper} ${ls.wrapper} ${l.hipEscena}`}>
          <FuentesImagen.Provider value={LOCALES}>
            <Escena escenario={guion} escena={rep.escena} camaraLibre={false} precargarProcesos={false} />
          </FuentesImagen.Provider>
        </div>
      </div>
      <ol className={l.hipPasos} aria-label="Pasos de la reacción">
        {guion.pasos.map((p, i) => (
          <li key={p.id} className={i === rep.paso ? l.hipPasoOn : i < rep.paso ? l.hipPasoHecho : undefined} aria-current={i === rep.paso ? 'step' : undefined}>
            <span aria-hidden>{i + 1}</span>{p.titulo}
          </li>
        ))}
      </ol>
    </>
  );
}

export default function AnimacionHipersensibilidad({ activa }: { activa: boolean }) {
  const [listo, setListo] = useState(false);
  useEffect(() => {
    let vigente = true;
    precargar(imagenesDe(guion)).then(() => { if (vigente) setListo(true); });
    return () => { vigente = false; };
  }, []);
  if (!listo) return <div className={l.hipCargando} role="status" aria-label="Cargando la animación" />;
  return <Reproduccion activa={activa} />;
}
