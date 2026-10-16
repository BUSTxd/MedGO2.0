'use client';
import { Fragment, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import s from '@/styles/temarioEncib.module.css';

export interface TemaTemario {
  codigo: string;
  nombre: string;
  oficial: string;
  /** Veces que salió como tema principal en 2021, 2024 y 2025. */
  salidas: [number, number, number];
}
export interface SubareaTemario {
  codigo: string;
  nombre: string;
  temas: TemaTemario[];
}
export interface AreaTemario {
  codigo: string;
  slug: string;
  nombre: string;
  color: string;
  peso: number;
  lema: string;
  subareas: SubareaTemario[];
}

const ANIOS = [2021, 2024, 2025] as const;

/** Minúsculas y sin tildes, carácter a carácter (la longitud se conserva para resaltar). */
const plano = (t: string) =>
  Array.from(t, (c) => c.normalize('NFD').charAt(0).toLowerCase()).join('');

function Resaltar({ texto, q }: { texto: string; q: string }) {
  if (!q) return <>{texto}</>;
  const base = plano(texto);
  const partes: React.ReactNode[] = [];
  let desde = 0;
  let i = base.indexOf(q);
  while (i !== -1) {
    if (i > desde) partes.push(texto.slice(desde, i));
    partes.push(<mark key={i} className={s.marca}>{texto.slice(i, i + q.length)}</mark>);
    desde = i + q.length;
    i = base.indexOf(q, desde);
  }
  partes.push(texto.slice(desde));
  return <>{partes.map((p, k) => <Fragment key={k}>{p}</Fragment>)}</>;
}

const Flecha = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden width="18" height="18">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function TemarioEncib({
  areas,
  cifras,
}: {
  areas: AreaTemario[];
  cifras: { areas: number; subareas: number; temas: number; preguntas: number };
}) {
  const quieto = useReducedMotion();
  const [area, setArea] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState('');
  const [abiertas, setAbiertas] = useState<Set<string>>(() => new Set());
  const q = plano(busqueda.trim());

  // Filtra por área y por texto; con búsqueda, solo quedan subáreas con coincidencias.
  const visibles = useMemo(() => {
    return areas
      .filter((a) => area === 'todas' || a.codigo === area)
      .map((a) => {
        const subareas = a.subareas
          .map((sa) => {
            if (!q) return sa;
            const subCoincide = plano(sa.nombre).includes(q);
            const temas = subCoincide
              ? sa.temas
              : sa.temas.filter((t) => plano(`${t.codigo} ${t.nombre} ${t.oficial}`).includes(q));
            return temas.length ? { ...sa, temas } : null;
          })
          .filter((x): x is SubareaTemario => !!x);
        return { ...a, subareas };
      })
      .filter((a) => a.subareas.length > 0);
  }, [areas, area, q]);

  const totalTemas = visibles.reduce((n, a) => n + a.subareas.reduce((m, sa) => m + sa.temas.length, 0), 0);
  const estaAbierta = (cod: string) => !!q || abiertas.has(cod);
  const todasCodigos = visibles.flatMap((a) => a.subareas.map((sa) => sa.codigo));
  const todasAbiertas = todasCodigos.length > 0 && todasCodigos.every((c) => abiertas.has(c));

  const alternar = (cod: string) =>
    setAbiertas((prev) => {
      const n = new Set(prev);
      if (n.has(cod)) n.delete(cod);
      else n.add(cod);
      return n;
    });
  const alternarTodas = () => setAbiertas(todasAbiertas ? new Set() : new Set(todasCodigos));

  const trans = quieto ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className={s.raiz}>
      {/* ─── Cabecera ─── */}
      <header className={s.cabecera}>
        <h1 className={s.titulo}>Temario del ENCIB 2026</h1>
        <p className={s.subtitulo}>
          La tabla de especificaciones oficial de ASPEFAM, tema por tema, y cuántas veces salió cada uno en los
          cuadernillos 2021, 2024 y 2025.
        </p>
        <ul className={s.cifras}>
          <li><strong>{cifras.areas}</strong> áreas</li>
          <li><strong>{cifras.subareas}</strong> subáreas</li>
          <li><strong>{cifras.temas}</strong> temas</li>
          <li><strong>{cifras.preguntas}</strong> preguntas por examen</li>
        </ul>
        <div className={s.reparto}>
          <div
            className={s.repartoBarra}
            role="img"
            aria-label={`Preguntas por área: ${areas.map((a) => `${a.nombre} ${a.peso}`).join(', ')}`}
          >
            {areas.map((a) => (
              <motion.span
                key={a.codigo}
                className={s.repartoTramo}
                style={{ flexGrow: a.peso, background: a.color }}
                initial={quieto ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={quieto ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                title={`${a.nombre}: ${a.peso} preguntas`}
              />
            ))}
          </div>
          <ul className={s.repartoLeyenda}>
            {areas.map((a) => (
              <li key={a.codigo}>
                <span className={s.punto} style={{ background: a.color }} aria-hidden />
                {a.nombre} <strong>{a.peso}</strong>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ─── Controles ─── */}
      <div className={s.controles}>
        <div className={s.buscador}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden width="18" height="18">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Busca un tema: nefrona, Staphylococcus, plexo…"
            aria-label="Buscar en el temario"
            className={s.entrada}
          />
          {busqueda && (
            <button type="button" className={s.limpiar} onClick={() => setBusqueda('')} aria-label="Borrar búsqueda">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden width="16" height="16">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <div className={s.chips} role="group" aria-label="Filtrar por área">
          <button
            type="button"
            className={`${s.chip} ${area === 'todas' ? s.chipOn : ''}`}
            aria-pressed={area === 'todas'}
            onClick={() => setArea('todas')}
          >
            Todas
          </button>
          {areas.map((a) => (
            <button
              key={a.codigo}
              type="button"
              className={`${s.chip} ${area === a.codigo ? s.chipOn : ''}`}
              style={{ ['--ac' as string]: a.color }}
              aria-pressed={area === a.codigo}
              onClick={() => setArea(area === a.codigo ? 'todas' : a.codigo)}
            >
              <span className={s.punto} style={{ background: a.color }} aria-hidden />
              {a.nombre}
            </button>
          ))}
        </div>
        <div className={s.estado}>
          <span aria-live="polite">
            {totalTemas === 0 ? 'Ningún tema coincide' : `${totalTemas} ${totalTemas === 1 ? 'tema' : 'temas'}`}
          </span>
          {!q && totalTemas > 0 && (
            <button type="button" className={s.enlaceBtn} onClick={alternarTodas}>
              {todasAbiertas ? 'Plegar todo' : 'Desplegar todo'}
            </button>
          )}
        </div>
      </div>

      {/* ─── Áreas ─── */}
      {totalTemas === 0 && (
        <p className={s.vacio}>
          No hay temas con «{busqueda}». Prueba con otra palabra o quita el filtro de área.
        </p>
      )}
      <div className={s.areas}>
        {visibles.map((a, ia) => (
          <motion.section
            key={a.codigo}
            className={s.area}
            style={{ ['--ac' as string]: a.color }}
            initial={quieto ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={quieto ? { duration: 0 } : { duration: 0.35, delay: Math.min(ia, 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            aria-labelledby={`area-${a.codigo}`}
          >
            <div className={s.areaCab}>
              <span className={s.areaBarra} aria-hidden />
              <div className={s.areaTextos}>
                <h2 id={`area-${a.codigo}`} className={s.areaNombre}>{a.nombre}</h2>
                <p className={s.areaLema}>{a.lema}</p>
              </div>
              <span className={s.areaPeso}><strong>{a.peso}</strong> de 100 preguntas</span>
              <Link href={`/dashboard/cursos/area/${a.slug}`} className={s.areaEnlace}>
                Ver el curso
                <Flecha />
              </Link>
            </div>

            <ul className={s.subareas}>
              {a.subareas.map((sa) => {
                const abierta = estaAbierta(sa.codigo);
                return (
                  <li key={sa.codigo} className={s.sub}>
                    <button
                      type="button"
                      className={s.subBtn}
                      aria-expanded={abierta}
                      aria-controls={`temas-${sa.codigo}`}
                      onClick={() => alternar(sa.codigo)}
                    >
                      <svg className={`${s.chev} ${abierta ? s.chevOn : ''}`} viewBox="0 0 24 24" fill="none" aria-hidden width="18" height="18">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={s.subCodigo}>{sa.codigo}</span>
                      <span className={s.subNombre}><Resaltar texto={sa.nombre} q={q} /></span>
                      <span className={s.subCuenta}>{sa.temas.length} {sa.temas.length === 1 ? 'tema' : 'temas'}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {abierta && (
                        <motion.div
                          key="cuerpo"
                          id={`temas-${sa.codigo}`}
                          className={s.cuerpo}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={trans}
                        >
                          <ul className={s.temas}>
                            {sa.temas.map((t, it) => (
                              <motion.li
                                key={t.codigo}
                                className={s.tema}
                                initial={quieto ? false : { opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={quieto ? { duration: 0 } : { duration: 0.25, delay: Math.min(it, 8) * 0.03 }}
                              >
                                <span className={s.temaCodigo}><Resaltar texto={t.codigo} q={q} /></span>
                                <div className={s.temaTexto}>
                                  <div className={s.temaNombre}><Resaltar texto={t.nombre} q={q} /></div>
                                  <p className={s.temaOficial}><Resaltar texto={t.oficial} q={q} /></p>
                                </div>
                                <ul className={s.salidas} aria-label="Veces que salió en los cuadernillos">
                                  {ANIOS.map((anio, k) => {
                                    const n = t.salidas[k];
                                    return (
                                      <li
                                        key={anio}
                                        className={`${s.salida} ${n ? s.salidaOn : ''}`}
                                        title={n ? `${anio}: salió ${n} ${n === 1 ? 'vez' : 'veces'}` : `${anio}: no salió`}
                                      >
                                        <span className={s.salidaAnio}>{String(anio).slice(2)}</span>
                                        <span className={s.salidaN}>{n || '–'}</span>
                                        <span className={s.sr}>
                                          {n ? `${anio}: ${n} ${n === 1 ? 'vez' : 'veces'}` : `${anio}: no salió`}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        ))}
      </div>

      <p className={s.fuente}>
        Fuente: tabla de especificaciones del ENCIB 2026, ASPEFAM. Las repeticiones que trae el documento original se
        conservan tal cual. Las marcas de 2021, 2024 y 2025 cuentan el tema principal de cada pregunta de los
        cuadernillos oficiales.
      </p>
    </div>
  );
}
