'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import s from '@/styles/juegoEncib.module.css';

export interface TarjetaEncib {
  n: number;
  area: string;
  areaNombre: string;
  color: string;
  subarea: string;
  tema: string;
  concepto: string;
  dificultad: 'menor' | 'mediana' | 'mayor';
  carga: 'memoria' | 'aplicacion' | 'integracion';
  formato: 'caso' | 'problema' | 'directa';
  decorativo: boolean;
  secundarios: { nombre: string; areaNombre: string; color: string }[];
}

const ANIOS = [2025, 2024, 2021] as const;
const DIF = { menor: 'Dificultad menor', mediana: 'Dificultad mediana', mayor: 'Dificultad mayor' } as const;
const CARGA = { memoria: 'Memoria', aplicacion: 'Aplicar un concepto', integracion: 'Integrar 2+ áreas' } as const;
const FORMATO = { caso: 'Caso clínico', problema: 'Problema', directa: 'Pregunta directa' } as const;

const MUELLE = { type: 'spring', stiffness: 260, damping: 24, mass: 0.9 } as const;

export default function JuegoPreguntas({ porAnio }: { porAnio: Record<number, TarjetaEncib[]> }) {
  const reducido = !!useReducedMotion();
  const [anio, setAnio] = useState<(typeof ANIOS)[number]>(2025);
  const [area, setArea] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [volteada, setVolteada] = useState(false);
  const arrastro = useRef(false);

  const delAnio = useMemo(() => porAnio[anio] ?? [], [porAnio, anio]);
  const mazo = useMemo(() => (area ? delAnio.filter((q) => q.area === area) : delAnio), [delAnio, area]);
  const actual = mazo[Math.min(idx, mazo.length - 1)];

  const areas = useMemo(() => {
    const m = new Map<string, { nombre: string; color: string; n: number }>();
    for (const q of delAnio) {
      const a = m.get(q.area) ?? { nombre: q.areaNombre, color: q.color, n: 0 };
      a.n += 1;
      m.set(q.area, a);
    }
    return [...m.entries()];
  }, [delAnio]);

  const dif = useMemo(() => {
    const d = { menor: 0, mediana: 0, mayor: 0 };
    for (const q of delAnio) d[q.dificultad] += 1;
    return d;
  }, [delAnio]);
  const pct = (v: number) => (delAnio.length ? Math.round((100 * v) / delAnio.length) : 0);

  const ir = useCallback((d: 1 | -1) => {
    const j = idx + d;
    if (j < 0 || j >= mazo.length) return;
    setDir(d);
    setVolteada(false);
    setIdx(j);
  }, [idx, mazo.length]);

  const voltear = useCallback(() => setVolteada((v) => !v), []);

  const cambiarAnio = (y: (typeof ANIOS)[number]) => {
    if (y === anio) return;
    setAnio(y); setArea(null); setIdx(0); setDir(1); setVolteada(false);
  };
  const cambiarArea = (a: string | null) => {
    setArea(a); setIdx(0); setDir(1); setVolteada(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); ir(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(-1); }
      else if ((e.key === ' ' || e.key === 'Enter') && (t === document.body || !t)) { e.preventDefault(); voltear(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ir, voltear]);

  const variantes = reducido
    ? { ini: { opacity: 1 }, entra: { opacity: 1 }, sale: { opacity: 1, transition: { duration: 0 } } }
    : {
        // Entra del mazo (abajo, un poco más chica) y la anterior se va de lado.
        ini: (d: number) => ({ opacity: 0, y: 56, scale: 0.86, rotate: d * 5, x: 0 }),
        entra: { opacity: 1, y: 0, scale: 1, rotate: 0, x: 0 },
        sale: (d: number) => ({ opacity: 0, x: d * -420, rotate: d * -14, scale: 0.94, transition: { duration: 0.32, ease: [0.4, 0, 0.8, 0.4] as const } }),
      };

  return (
    <div className={s.raiz}>
      <header className={s.cabecera}>
        <div className={s.cabTexto}>
          <span className={s.kicker}>Banco de preguntas</span>
          <h1 className={s.titulo}>ENCIB 2026</h1>
          <p className={s.sub}>Las preguntas de los exámenes anteriores, una por una. Toca la carta para ver qué se preguntó.</p>
        </div>
        <Link href="/dashboard/cursos/examen/encib/estadisticas" className={s.stats} aria-label={`Ver estadísticas del ENCIB. ${anio}: ${pct(dif.menor)} % de dificultad menor`}>
          <svg className={s.statsIcono} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 20V10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M10 20V4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M16 20v-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M22 20H2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span className={s.statsRotulo}>Estadísticas</span>
          <span className={s.statsBarra} aria-hidden>
            <i className={s.d1} style={{ flexGrow: dif.menor }} />
            <i className={s.d2} style={{ flexGrow: dif.mediana }} />
            <i className={s.d3} style={{ flexGrow: dif.mayor }} />
          </span>
          <span className={s.statsCifra}><strong>{pct(dif.menor)} %</strong> fáciles · {anio}</span>
        </Link>
      </header>

      <div className={s.anios} role="group" aria-label="Examen">
        {ANIOS.map((y) => (
          <button key={y} type="button" className={`${s.anio} ${y === anio ? s.anioOn : ''}`} aria-pressed={y === anio} onClick={() => cambiarAnio(y)}>
            <span className={s.anioNum}>{y}</span>
            <span className={s.anioSub}>{y === 2021 ? 'Piloto' : `${porAnio[y]?.length ?? 0} preguntas`}</span>
          </button>
        ))}
      </div>

      <div className={s.chips} role="group" aria-label="Filtrar por área">
        <button type="button" className={`${s.chip} ${area === null ? s.chipOn : ''}`} aria-pressed={area === null} onClick={() => cambiarArea(null)}>
          Todas <em>{delAnio.length}</em>
        </button>
        {areas.map(([cod, a]) => (
          <button key={cod} type="button" className={`${s.chip} ${area === cod ? s.chipOn : ''}`} aria-pressed={area === cod} onClick={() => cambiarArea(area === cod ? null : cod)} style={{ ['--ac' as string]: a.color }}>
            <i aria-hidden />{a.nombre} <em>{a.n}</em>
          </button>
        ))}
      </div>

      {actual && (
        <>
          <div className={s.escenario} style={{ ['--ac' as string]: actual.color }}>
            {/* El mazo: dos cartas detrás que se reacomodan al cambiar de examen o área. */}
            <motion.div key={`m1-${anio}-${area}`} className={`${s.fantasma} ${s.fantasma1}`} aria-hidden
              initial={reducido ? false : { rotate: -9, x: -60, opacity: 0 }} animate={{ rotate: -3, x: 0, opacity: 1 }} transition={MUELLE} />
            <motion.div key={`m2-${anio}-${area}`} className={`${s.fantasma} ${s.fantasma2}`} aria-hidden
              initial={reducido ? false : { rotate: 9, x: 60, opacity: 0 }} animate={{ rotate: 2.5, x: 0, opacity: 1 }} transition={{ ...MUELLE, delay: 0.06 }} />

            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.div
                key={`${anio}-${actual.n}-${area}`}
                className={s.cartaMarco}
                custom={dir}
                variants={variantes}
                initial="ini"
                animate="entra"
                exit="sale"
                transition={reducido ? { duration: 0 } : MUELLE}
                drag={reducido ? false : 'x'}
                dragSnapToOrigin
                dragElastic={0.5}
                onDragStart={() => { arrastro.current = true; }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) ir(1);
                  else if (info.offset.x > 70) ir(-1);
                  setTimeout(() => { arrastro.current = false; }, 60);
                }}
              >
                <button
                  type="button"
                  className={`${s.carta} ${volteada ? s.cartaVolteada : ''}`}
                  onClick={() => { if (!arrastro.current) voltear(); }}
                  aria-label={volteada ? `Pregunta ${actual.n}, se preguntó: ${actual.concepto}. Tocar para ocultar.` : `Pregunta ${actual.n}, ${actual.areaNombre}, ${actual.tema}. Tocar para ver qué se preguntó.`}
                  aria-pressed={volteada}
                >
                  <span className={s.giro} style={reducido ? undefined : { transform: volteada ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    <span className={`${s.cara} ${s.frente}`} style={reducido && volteada ? { display: 'none' } : undefined}>
                      <span className={s.caraTop}>
                        <span className={s.numero}>Pregunta <strong>{actual.n}</strong></span>
                        <span className={s.areaPill}><i aria-hidden />{actual.areaNombre}</span>
                      </span>
                      <span className={s.caraCentro}>
                        <span className={s.subarea}>{actual.subarea}</span>
                        <span className={s.tema}>{actual.tema}</span>
                      </span>
                      <span className={s.pista}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                          <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                          <path d="M18.5 3v4h-4M5.5 21v-4h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Toca para ver qué se preguntó
                      </span>
                    </span>
                    <span className={`${s.cara} ${s.dorso}`} style={reducido && !volteada ? { display: 'none' } : undefined}>
                      <span className={s.caraTop}>
                        <span className={s.numero}>Pregunta <strong>{actual.n}</strong> · {anio}</span>
                        <span className={s.areaPill}><i aria-hidden />{actual.areaNombre}</span>
                      </span>
                      <span className={s.etiqueta}>Se preguntó</span>
                      <span className={s.concepto}>{actual.concepto}</span>
                      <span className={s.fichas}>
                        <span className={`${s.ficha} ${s['dif_' + actual.dificultad]}`}><i aria-hidden />{DIF[actual.dificultad]}</span>
                        <span className={s.ficha}>{CARGA[actual.carga]}</span>
                        <span className={s.ficha}>{FORMATO[actual.formato]}{actual.decorativo ? ' · el caso sobra' : ''}</span>
                      </span>
                      {actual.secundarios.length > 0 && (
                        <span className={s.tambien}>
                          <span className={s.etiqueta}>También toca</span>
                          <span className={s.tambienLista}>
                            {actual.secundarios.map((x) => (
                              <span key={x.nombre} className={s.mini} style={{ ['--ac' as string]: x.color }} title={x.areaNombre}><i aria-hidden />{x.nombre}</span>
                            ))}
                          </span>
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={s.mando}>
            <button type="button" className={s.flecha} onClick={() => ir(-1)} disabled={idx === 0} aria-label="Pregunta anterior">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div className={s.progreso}>
              <span className={s.contador} aria-live="polite"><strong>{idx + 1}</strong> / {mazo.length}</span>
              <div className={s.rastro} role="progressbar" aria-valuemin={1} aria-valuemax={mazo.length} aria-valuenow={idx + 1} aria-label="Avance del mazo">
                {mazo.map((q, i) => (
                  <i key={q.n} className={i === idx ? s.marcaActual : i < idx ? s.marcaVista : undefined} style={{ ['--ac' as string]: q.color }} />
                ))}
              </div>
            </div>
            <button type="button" className={`${s.flecha} ${s.flechaSig}`} onClick={() => ir(1)} disabled={idx >= mazo.length - 1} aria-label="Pregunta siguiente">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <p className={s.atajos}>Flechas para avanzar · Espacio para voltear · desliza la carta en el celular</p>
        </>
      )}
    </div>
  );
}
