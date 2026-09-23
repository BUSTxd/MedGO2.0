'use client';
// Anillo del ciclo celular (G1, S, G2, M + G0 como contexto) con los cinco
// marcadores de checkpoint. Al elegir uno, la «cámara» entra animando el
// viewBox hasta el marcador; al volver, sale desde él. Versión `mini`: el
// mini-mapa de la cabecera del escenario.

import { useEffect, useRef, useState } from 'react';
import type { CheckpointId } from '@/lib/data/ciclo-celular/tipos';
import { CHECKPOINTS, FASES, MARCADORES } from '@/lib/ciclo-celular/registro';
import { arcoAnular, polar, ANILLO } from '@/lib/ciclo-celular/geometria';
import { easeInOut } from '@/lib/ciclo-celular/motor';
import { completado, type Progreso } from '@/lib/ciclo-celular/progreso';
import { precargar } from './precarga';
import { useMovimientoReducido } from './useReproductor';
import s from '@/styles/cicloCelular.module.css';

const COLOR_FASE = Object.fromEntries(FASES.map((f) => [f.id, f.c0])) as Record<string, string>;
const TODO = { x: 0, y: 0, w: 800, h: 800 };
const HUECO = 0.6; // medio hueco de 1,2° entre arcos

function cajaDe(id: CheckpointId) {
  const p = polar(ANILLO.R, MARCADORES[id].angulo);
  return { x: p.x - 70, y: p.y - 70, w: 140, h: 140 };
}

type Props = {
  progreso: Progreso;
  onElegir: (id: CheckpointId) => void;
  /** Al montar, la cámara sale desde este marcador (vuelta desde el escenario). */
  desde?: CheckpointId | null;
  mini?: boolean;
  activo?: CheckpointId;
  onIntro?: () => void;
  onIntegrada?: () => void;
};

export default function Anillo({ progreso, onElegir, desde, mini, activo, onIntro, onIntegrada }: Props) {
  const reducido = useMovimientoReducido();
  const [vb, setVb] = useState(desde && !mini ? cajaDe(desde) : TODO);
  const [elegido, setElegido] = useState<CheckpointId | null>(null);
  const [hover, setHover] = useState<CheckpointId | null>(null);
  const bloqueado = useRef(false);

  // Salida: desde el marcador hasta el anillo completo (900 ms).
  useEffect(() => {
    if (!desde || mini) return;
    if (reducido) { setVb(TODO); return; }
    const ini = cajaDe(desde);
    const t0 = performance.now();
    let raf = 0;
    const paso = (now: number) => {
      const k = easeInOut(Math.min(1, (now - t0) / 900));
      setVb({ x: ini.x + (TODO.x - ini.x) * k, y: ini.y + (TODO.y - ini.y) * k, w: ini.w + (TODO.w - ini.w) * k, h: ini.h + (TODO.h - ini.h) * k });
      if (k < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [desde, mini, reducido]);

  const entrar = (id: CheckpointId) => {
    if (mini) { onElegir(id); return; }
    if (bloqueado.current) return;
    bloqueado.current = true;
    setElegido(id);
    const listo = precargar(id, 1500);
    if (reducido) { listo.then(() => onElegir(id)); return; }
    const fin = cajaDe(id);
    const t0 = performance.now();
    const paso = (now: number) => {
      const k = easeInOut(Math.min(1, Math.max(0, (now - t0 - 100) / 700)));
      setVb({ x: TODO.x + (fin.x - TODO.x) * k, y: TODO.y + (fin.y - TODO.y) * k, w: TODO.w + (fin.w - TODO.w) * k, h: TODO.h + (fin.h - TODO.h) * k });
      if (k < 1) requestAnimationFrame(paso);
      else listo.then(() => onElegir(id));
    };
    requestAnimationFrame(paso);
  };

  const cp = hover ? CHECKPOINTS.find((c) => c.id === hover) : null;
  const tip = hover ? polar(ANILLO.R, MARCADORES[hover].angulo) : null;

  return (
    <div className={mini ? s.anilloMini : s.anilloVista}>
      <div className={s.anilloCaja}>
        <svg
          className={s.anilloSvg}
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          role="group"
          aria-label="Ciclo celular con sus cinco puntos de control"
        >
          <defs>
            {FASES.map((f) => (
              <radialGradient key={f.id} id={`fase-${f.id}${mini ? '-m' : ''}`} cx="400" cy="400" r="300" gradientUnits="userSpaceOnUse">
                <stop offset="74%" stopColor={f.c1} />
                <stop offset="100%" stopColor={f.c0} />
              </radialGradient>
            ))}
          </defs>

          {/* G0: salida lateral de G1, solo contexto */}
          {!mini && (() => {
            const a = polar(ANILLO.R + 4, 20), b = polar(ANILLO.R + 4, 45), c = polar(ANILLO.R + 110, 32.5);
            const et = polar(ANILLO.R + 128, 32.5);
            return (
              <g className={s.g0}>
                <path d={`M${a.x},${a.y} Q${c.x},${c.y} ${b.x},${b.y}`} />
                <text x={et.x} y={et.y} textAnchor="start">G₀ (quiescencia)</text>
              </g>
            );
          })()}

          {FASES.map((f) => {
            const faseDeMarcador = (hover && MARCADORES[hover].fase === f.id) || (activo && MARCADORES[activo].fase === f.id);
            const et = polar((ANILLO.R + ANILLO.r) / 2, (f.desde + f.hasta) / 2);
            return (
              <g key={f.id}>
                <path
                  d={arcoAnular(f.desde + HUECO, f.hasta - HUECO)}
                  fill={`url(#fase-${f.id}${mini ? '-m' : ''})`}
                  className={`${s.arcoFase} ${faseDeMarcador ? s.arcoFaseLuz : ''}`}
                  opacity={elegido && MARCADORES[elegido].fase !== f.id ? 0.45 : 1}
                />
                {!mini && (
                  <text x={et.x} y={et.y} textAnchor="middle" dy="0.35em" className={s.etiquetaFase}>{f.etiqueta}</text>
                )}
              </g>
            );
          })}

          {/* Sentido horario */}
          {!mini && [90, 225].map((ang) => {
            const p = polar(ANILLO.R + 14, ang);
            return <path key={ang} d="M-7,-8 L7,0 L-7,8 Z" transform={`translate(${p.x},${p.y}) rotate(${ang})`} className={s.flechaSentido} />;
          })}

          {!mini && (
            <g className={s.anilloCentro}>
              <text x={400} y={352} textAnchor="middle" className={s.anilloTitulo}>Checkpoints del</text>
              <text x={400} y={390} textAnchor="middle" className={s.anilloTitulo}>ciclo celular</text>
              <text x={400} y={428} textAnchor="middle" className={s.anilloInstr}>Elige un punto de control</text>
              <text x={400} y={450} textAnchor="middle" className={s.anilloInstr}>para ver su fisiología</text>
            </g>
          )}

          {CHECKPOINTS.map((c, i) => {
            const m = MARCADORES[c.id];
            const p = polar(ANILLO.R, m.angulo);
            const et = polar(ANILLO.R + 62, m.angulo);
            const hecho = completado(progreso, c.id);
            const anchor = et.x < 380 ? 'end' : et.x > 420 ? 'start' : 'middle';
            const atenuado = (elegido && elegido !== c.id) || (mini && activo && activo !== c.id);
            const r = mini ? 30 : 22;
            return (
              <g
                key={c.id}
                transform={`translate(${p.x},${p.y})`}
                className={`${s.marcador} ${elegido === c.id ? s.marcadorElegido : ''} ${activo === c.id ? s.marcadorActivo : ''}`}
                opacity={atenuado ? 0.3 : 1}
                role="button"
                tabIndex={0}
                aria-label={`${m.numero}. ${c.nombre}. ${c.pregunta}${hecho ? ' Completado.' : ''}`}
                onClick={() => entrar(c.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); entrar(c.id); } }}
                onMouseEnter={() => { setHover(c.id); precargar(c.id); }}
                onMouseLeave={() => setHover(null)}
                onFocus={() => { setHover(c.id); precargar(c.id); }}
                onBlur={() => setHover(null)}
              >
                {!mini && <circle r={r} className={s.marcadorPulso} style={{ animationDelay: `${i * 0.4}s` }} />}
                <g className={s.marcadorCuerpo}>
                  <circle r={r} className={s.marcadorFondo} stroke={COLOR_FASE[m.fase]} />
                  {/* barrera estilizada */}
                  <rect x={-11} y={-9} width={22} height={5} rx={2} className={s.marcadorBarra} />
                  <text y={8} textAnchor="middle" dy="0.35em" className={s.marcadorNum}>{m.numero}</text>
                  {hecho && (
                    <g transform={`translate(${r * 0.72},${-r * 0.72})`}>
                      <circle r={8} className={s.marcadorCheck} />
                      <path d="M-3.5,0 L-1,2.8 L3.8,-2.6" fill="none" stroke="#08130d" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  )}
                </g>
                {!mini && (
                  <text x={et.x - p.x} y={et.y - p.y} textAnchor={anchor} dy="0.35em" className={s.marcadorRotulo}>{c.nombreCorto}</text>
                )}
              </g>
            );
          })}
        </svg>

        {!mini && cp && tip && !elegido && (
          <div
            className={s.tooltip}
            style={{ left: `${(tip.x / 800) * 100}%`, top: `${(tip.y / 800) * 100}%` }}
            role="tooltip"
          >
            <strong>{cp.nombre}</strong>
            <span>{cp.pregunta}</span>
          </div>
        )}
      </div>

      {!mini && (
        <div className={s.anilloEnlaces}>
          <button type="button" className={s.enlace} onClick={onIntro}>Antes de empezar: el motor ciclina–CDK</button>
          <button type="button" className={s.enlace} onClick={onIntegrada}>Prueba integrada</button>
        </div>
      )}
    </div>
  );
}

