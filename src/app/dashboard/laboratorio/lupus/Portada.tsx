'use client';
// Portada del laboratorio «Lupus»: a la izquierda, la lámina de la ruta tal como
// queda al final del capítulo 0 (las cinco paradas del recorrido); a la
// derecha, los 12 capítulos con su duración. Aquí no hay intro que se reproduzca
// sola: «¿Qué es el lupus?» es el capítulo 0, narrado, y se abre como los demás.

import Link from 'next/link';
import { useMemo, useRef } from 'react';
import type { ParteId } from '@/lib/data/lupus/tipos';
import { compilado } from '@/lib/lupus/contenido';
import { useContenido } from './ContenidoLab';
import { Candado } from './MuroPago';
import Escena from './Escena';
import TextoAnimado from '../maduracion-linfocitos/TextoAnimado';
import { useModo } from '../maduracion-linfocitos/useModo';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';
import h from '@/styles/hipersensibilidad.module.css';
import l from '@/styles/lupus.module.css';

const minutos = (sg: number) => `${Math.max(1, Math.round(sg / 60))} min`;

export default function Portada({ onParte }: { onParte: (id: ParteId) => void }) {
  const { indice, partes, completo } = useContenido();
  const zona = useRef<HTMLDivElement>(null);
  const modo = useModo(zona);
  const primero = partes.find((p) => p.id === 'que-es');
  const ruta = useMemo(() => {
    if (!primero) return null;
    const cmp = compilado(primero, modo);
    return cmp.pasos[cmp.pasos.length - 1].final;
  }, [primero, modo]);
  const total = indice.reduce((a, p) => a + p.segundos, 0);

  return (
    <div className={s.portada}>
      <Link href="/dashboard/laboratorio" className={c.volverLab}>
        <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Laboratorio
      </Link>
      <div ref={zona} className={s.portadaEscena}>
        {primero && ruta && <Escena escenario={primero} escena={ruta} camaraLibre={false} precargarProcesos={false} />}
        <p className={`${s.credito} ${h.credito}`}>Láminas dibujadas con código · Basado en el resumen del TBL 5 de Patología</p>
      </div>

      <div className={s.menu}>
        <div className={s.menuCab}>
          <p className={`${s.sobretitulo} ${l.sobretitulo}`}>Patología · Inmunopatología</p>
          <h1><TextoAnimado id="titulo" texto="Lupus eritematoso sistémico" paso={50} /></h1>
          <p className={s.menuSub}><TextoAnimado id="sub" texto={`del núcleo propio al riñón · ${indice.length} capítulos narrados · ${minutos(total)}`} retraso={500} paso={30} /></p>
        </div>
        <ol className={s.capitulos}>
          {indice.map((p) => {
            const bloqueado = p.listo && !completo && !p.gratis;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`${s.capitulo} ${bloqueado ? h.capBloqueado : ''} ${p.listo ? '' : l.capPronto}`}
                  style={{ ['--parte' as string]: p.color }}
                  onClick={() => onParte(p.id)}
                  disabled={!p.listo}
                  aria-disabled={!p.listo}
                >
                  <span className={s.capNum}>{p.numero}</span>
                  <span className={s.capTxt}>
                    <strong>
                      {p.nombreCorto}
                      {p.listo && !completo && p.gratis && <span className={h.etqGratis}>Gratis</span>}
                      {bloqueado && <Candado />}
                      {!p.listo && <span className={l.etqPronto}>Pronto</span>}
                    </strong>
                    <span className={s.capLugar}>{p.tipo} · {p.lugar}{p.segundos ? <> · <span className={l.duracionCap}>{minutos(p.segundos)}</span></> : null}</span>
                    <span className={s.capPregunta}>{p.pregunta}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className={s.menuAcciones}>
          <button type="button" className={c.btnPrim} onClick={() => onParte('que-es')}>Empezar: ¿Qué es el lupus?</button>
        </div>
      </div>
    </div>
  );
}
