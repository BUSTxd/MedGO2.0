import Image from 'next/image';
import type { ReactNode } from 'react';
import { ENCIB } from '@/lib/data/encib';
import { IMG_HUB } from '@/lib/data/encib/hub';
import { diasHasta, fechaLarga } from '@/lib/encib/fechas';
import CarruselExamenes from '@/components/cursos/CarruselExamenes';
import FranjaMaterias from '@/components/cursos/FranjaMaterias';
import BotonCayetano from '@/components/cursos/BotonCayetano';
import s from '@/styles/cursosHubEscena.module.css';

const VENTAJAS: { texto: string; icono: ReactNode }[] = [
  {
    texto: 'Materiales actualizados',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6.5 11.2v4.3c0 1.5 2.5 2.8 5.5 2.8s5.5-1.3 5.5-2.8v-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M21.5 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    texto: 'Preguntas oficiales analizadas',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10V5.6L12 2.8Z" fill="currentColor" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="m8.6 12.2 2.4 2.4 4.4-4.6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    texto: 'Simulacros y estadísticas',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="4" y="12" width="3.6" height="8" rx="1" fill="currentColor" />
        <rect x="10.2" y="7" width="3.6" height="13" rx="1" fill="currentColor" />
        <rect x="16.4" y="3.5" width="3.6" height="16.5" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    texto: 'Prepárate donde quieras',
    icono: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6l1-8Z" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
];

/** Lo que dice el chip del ENCIB: «N días · para el examen», o el día de hoy. */
function cuentaEncib(): { numero?: number; texto: string } {
  const dias = diasHasta(ENCIB.fecha);
  if (dias > 0) return { numero: dias, texto: 'para el examen' };
  if (dias === 0) return { texto: 'El examen es hoy' };
  return { texto: `Se rindió el ${fechaLarga(ENCIB.fecha)}` };
}

/**
 * El escenario de los exámenes (solo el ENCIB tiene página) y las materias
 * básicas, calcado de la imagen de referencia de BUST (1672×941): todo se mide
 * en sus píxeles (`--u`, escalados a la pantalla) y cabe sin scroll. Es la
 * portada de Cursos para quien no es de Cayetano (`cursos/page.tsx`); una
 * cuenta de Cayetano llega desde la franja del ENCIB (`cursos/examen`).
 */
export default function EscenarioExamenes({ deCayetano }: { deCayetano: boolean }) {
  return (
    <div className={s.escenario} data-escenario>
      {/* Fondo a lo ancho, con la luz y la transparencia por zonas de la referencia. */}
      <div className={s.fondo} aria-hidden>
        <Image src={IMG_HUB.fondo} alt="" fill unoptimized priority sizes="100vw" className={s.fondoImg} />
        <span className={s.fondoZonas} />
      </div>

      <BotonCayetano deCayetano={deCayetano} />

      {/* Arriba a la izquierda de la zona visible (fuera del lienzo centrado),
          como el cuadradito de Cayetano a la derecha. */}
      <header className={s.cabecera}>
        <span className={s.cabeceraIcono} aria-hidden>
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="5" y="4" width="14" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9 4.2V3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5v.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="m8.8 12.6 2.2 2.2 4.2-4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <h1 className={s.titulo}>{deCayetano ? 'Exámenes' : 'Cursos'}</h1>
          <p className={s.subtitulo}>Elige una materia o práctica y comienza.</p>
        </div>
      </header>

      <div className={s.lienzo}>
        <CarruselExamenes cuenta={cuentaEncib()} />

        <FranjaMaterias />

        <ul className={s.ventajas}>
          {VENTAJAS.map((v) => (
            <li key={v.texto}>
              <span className={s.ventajaIcono}>{v.icono}</span>
              {v.texto}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
