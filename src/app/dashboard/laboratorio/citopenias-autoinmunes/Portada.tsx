'use client';
// Portada: a la izquierda, la lámina final del capítulo 0 (las tres preguntas); a la
// derecha, los 10 capítulos con su duración.

import Link from 'next/link';
import type { ParteId } from '@/lib/data/citopenias/tipos';
import type { Contenido } from '@/lib/citopenias/contenido';
import { Candado } from './MuroPago';
import Lienzo from './Lienzo';
import TextoAnimado from '../maduracion-linfocitos/TextoAnimado';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';
import h from '@/styles/hipersensibilidad.module.css';
import cit from '@/styles/citopenias.module.css';

const minutos = (sg: number) => `${Math.max(1, Math.round(sg / 60))} min`;

export default function Portada({ contenido, onParte, onAnticipar }: { contenido: Contenido; onParte: (id: ParteId) => void; onAnticipar: (id: ParteId) => void }) {
  const { indice, completo } = contenido;
  const total = indice.reduce((a, p) => a + p.segundos, 0);
  return (
    <div className={s.portada}>
      <Link href="/dashboard/laboratorio" className={c.volverLab}>
        <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Laboratorio
      </Link>
      <div className={s.portadaEscena}>
        <Lienzo cap={0} paso={3} t={0} tejido={{}} reloj={0} entero />
        <p className={`${s.credito} ${h.credito}`}>Láminas dibujadas con código · Basado en el resumen de la clase AI17 de Patología</p>
      </div>
      <div className={s.menu}>
        <div className={s.menuCab}>
          <p className={`${s.sobretitulo} ${cit.sobretitulo}`}>Patología · Inmunopatología</p>
          <h1><TextoAnimado id="titulo" texto="Citopenias autoinmunes" paso={50} /></h1>
          <p className={s.menuSub}><TextoAnimado id="sub" texto={`anemia hemolítica y púrpura trombocitopénica · ${indice.length} capítulos narrados · ${minutos(total)}`} retraso={500} paso={30} /></p>
        </div>
        <ol className={s.capitulos}>
          {indice.map((p) => {
            const bloqueado = !completo && !p.gratis;
            return (
              <li key={p.id}>
                <button type="button" className={`${s.capitulo} ${bloqueado ? h.capBloqueado : ''}`} style={{ ['--parte' as string]: p.color }} onPointerEnter={() => onAnticipar(p.id)} onClick={() => onParte(p.id)}>
                  <span className={s.capNum}>{p.numero}</span>
                  <span className={s.capTxt}>
                    <strong>
                      {p.nombre}
                      {!completo && p.gratis && <span className={h.etqGratis}>Gratis</span>}
                      {bloqueado && <Candado />}
                    </strong>
                    <span className={s.capLugar}>{p.tipo} · {p.lugar} · {minutos(p.segundos)}</span>
                    <span className={s.capPregunta}>{p.pregunta}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className={s.menuAcciones}>
          <button type="button" className={c.btnPrim} onClick={() => onParte('marca')}>Empezar: {indice[0].nombre}</button>
        </div>
      </div>
    </div>
  );
}
