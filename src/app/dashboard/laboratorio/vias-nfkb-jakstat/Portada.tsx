'use client';
// Portada del laboratorio: la animación de entrada (guion §2.4) se reproduce
// sola y termina en el esquema completo de las tres vías, como la figura de
// Küppers, con sus rótulos rojos. Desde aquí se abre cada vía, el modo
// estudio o el inventario. Tocar una proteína abre su ficha.

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { ViaId } from '@/lib/data/vias-nfkb/tipos';
import { ALTERACIONES_PANORAMA } from '@/lib/data/vias-nfkb/panorama';
import { ROJO_ALTERACION } from '@/lib/data/vias-nfkb/colores';
import { CELDA } from '@/lib/vias-nfkb/motor';
import { compilado, INTRO, VIAS } from '@/lib/vias-nfkb/registro';
import Escena from './Escena';
import { FichaProteina, type Destino } from './Ficha';
import { useReproductor } from './useReproductor';
import PanelVias from './PanelVias';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/viasNfkb.module.css';

type Props = {
  onVia: (id: ViaId) => void;
  onEstudio: () => void;
  onInventario: () => void;
  onDestino: (d: Destino) => void;
  /** Saltar la animación (al volver desde una vía). */
  sinIntro?: boolean;
};

const CAJA_VIA: Record<ViaId, number> = { clasica: 2.5, alternativa: 8.33, jakstat: 13.8 };

export default function Portada(props: Props) {
  // «Repetir intro» remonta la portada: así la animación vuelve a encadenarse entera.
  const [intento, setIntento] = useState(0);
  return <Contenido key={intento} {...props} sinIntro={intento === 0 && props.sinIntro} onRepetir={() => setIntento((n) => n + 1)} />;
}

function Contenido({ onVia, onEstudio, onInventario, onDestino, sinIntro, onRepetir }: Props & { onRepetir: () => void }) {
  const cmp = compilado(INTRO);
  const ultimo = cmp.pasos.length - 1;
  const rep = useReproductor(cmp, sinIntro ? ultimo : 0, { autoInicial: !sinIntro });
  const [alteraciones, setAlteraciones] = useState(true);
  const [ficha, setFicha] = useState<string | null>(null);
  const terminado = rep.paso === ultimo && rep.terminado;

  useEffect(() => {
    if (sinIntro) rep.irA(ultimo, false);
    else rep.setVelocidad(1.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saltar = () => rep.irA(ultimo, false);
  const progreso = rep.duracionTotal ? rep.tGlobal / rep.duracionTotal : 1;

  return (
    <div className={s.portada}>
      <Link href="/dashboard/laboratorio" className={c.volverLab}>
        <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Laboratorio
      </Link>

      <div className={s.portadaEscena}>
        <Escena
          escenario={INTRO}
          escena={rep.escena}
          camaraLibre={terminado}
          seleccionado={ficha}
          onActor={terminado ? (k) => setFicha((f) => (f === k ? null : k)) : undefined}
        >
          {terminado && alteraciones && (
            <g className={s.alteracionesPanorama} pointerEvents="none">
              {ALTERACIONES_PANORAMA.map((al) => (
                <g key={al.texto} transform={`translate(${al.pos.col * CELDA},${al.pos.row * CELDA})`}>
                  <text textAnchor="middle" className={s.altGen} fill={ROJO_ALTERACION}>{al.texto}</text>
                  <text textAnchor="middle" y={16} className={s.altPct} fill={ROJO_ALTERACION}>{al.pct}</text>
                </g>
              ))}
            </g>
          )}
          {terminado && VIAS.map((v) => (
            <rect
              key={v.id}
              x={CAJA_VIA[v.id] * CELDA - 125} y={10} width={250} height={40} rx={8}
              className={s.cajaViaClic}
              role="button"
              tabIndex={0}
              aria-label={`Explorar la ${v.nombre}`}
              onClick={() => onVia(v.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onVia(v.id); } }}
            />
          ))}
        </Escena>

        {ficha && (
          <div className={c.fichaPanel}>
            <FichaProteina escenario={INTRO} actor={ficha} onCerrar={() => setFicha(null)} onIr={(d) => { setFicha(null); onDestino(d); }} />
          </div>
        )}
      </div>

      {/* Columna derecha: durante la intro, su narración (así nada tapa el
          núcleo, donde ocurren las translocaciones); después, el menú. */}
      {!terminado && (
        <div className={s.menu} aria-live="polite">
          <div className={s.menuCab}>
            <h1>Vías NF-κB y JAK/STAT</h1>
            <p>En la célula de Reed-Sternberg del linfoma de Hodgkin clásico</p>
          </div>
          <div className={s.introPaso} key={rep.paso}>
            <strong>{INTRO.pasos[rep.paso].titulo}</strong>
            <span>{INTRO.pasos[rep.paso].texto}</span>
          </div>
          <span className={s.introBarra}><span style={{ transform: `scaleX(${progreso})` }} /></span>
          <button type="button" className={c.btnSec} onClick={saltar}>Saltar intro</button>
        </div>
      )}

      {terminado && (
        <div className={s.menu}>
          <div className={s.menuCab}>
            <h1>Vías NF-κB y JAK/STAT</h1>
            <p>En la célula de Reed-Sternberg del linfoma de Hodgkin clásico · Küppers R. J Clin Invest. 2012</p>
          </div>
          <PanelVias onVia={onVia} />
          <div className={s.menuAcciones}>
            <button type="button" className={c.btnPrim} onClick={onEstudio}>Modo estudio: arrastra las piezas</button>
            <button type="button" className={c.btnSec} onClick={onInventario}>Proteínas y alteraciones</button>
            <label className={c.interruptor}>
              <input type="checkbox" checked={alteraciones} onChange={(e) => setAlteraciones(e.target.checked)} />
              Alteraciones del linfoma de Hodgkin
            </label>
            <button type="button" className={c.enlace} onClick={onRepetir}>Repetir intro</button>
          </div>
        </div>
      )}
    </div>
  );
}
