'use client';
// Portada: la intro (médula → timo → ganglio → plasmática, y las neoplasias)
// se reproduce sola y termina en la ruta. A la derecha, mientras corre, su
// narración en texto animado; al terminar, las cinco partes como capítulos.

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ParteId } from '@/lib/data/linfocitos/tipos';
import { compilado, INTRO, PARTES } from '@/lib/linfocitos/registro';
import Escena from './Escena';
import TextoAnimado from './TextoAnimado';
import BarraTiempo from './BarraTiempo';
import { Controles } from './Explorar';
import { FichaActor } from './Ficha';
import { useReproductor } from './useReproductor';
import { useModo } from './useModo';
import c from '@/styles/cicloCelular.module.css';
import s from '@/styles/linfocitos.module.css';

type Props = { onParte: (id: ParteId) => void; onNeoplasias: () => void; sinIntro?: boolean };

export default function Portada(props: Props) {
  const [intento, setIntento] = useState(0);
  return <Contenido key={intento} {...props} sinIntro={intento === 0 && props.sinIntro} onRepetir={() => setIntento((n) => n + 1)} />;
}

function Contenido({ onParte, onNeoplasias, sinIntro, onRepetir }: Props & { onRepetir: () => void }) {
  const zona = useRef<HTMLDivElement>(null);
  const modo = useModo(zona);
  const cmp = useMemo(() => compilado(INTRO, modo), [modo]);
  const ultimo = cmp.pasos.length - 1;
  const rep = useReproductor(cmp, sinIntro ? ultimo : 0, { autoInicial: !sinIntro });
  const [ficha, setFicha] = useState<string | null>(null);
  const terminado = rep.paso === ultimo && rep.terminado;

  useEffect(() => {
    if (sinIntro) rep.irA(ultimo, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paso = INTRO.pasos[rep.paso];

  return (
    <div className={s.portada}>
      <Link href="/dashboard/laboratorio" className={c.volverLab}>
        <svg viewBox="0 0 16 16" aria-hidden><path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Laboratorio
      </Link>
      <div ref={zona} className={s.portadaEscena}>
        <Escena escenario={INTRO} escena={rep.escena} camaraLibre={terminado} seleccionado={ficha} onActor={terminado ? (k) => setFicha((f) => (f === k ? null : k)) : undefined} />
        {ficha && (
          <div className={c.fichaPanel}>
            <FichaActor escenario={INTRO} actor={ficha} onCerrar={() => setFicha(null)} />
          </div>
        )}
        <p className={s.credito}>Ilustraciones de células y órganos: Servier Medical Art (CC BY-SA 3.0)</p>
      </div>

      <div className={s.menu}>
        <div className={s.menuCab}>
          <p className={s.sobretitulo}>Patología · Hematopatología</p>
          <h1><TextoAnimado id="titulo" texto="Maduración de linfocitos" paso={60} /></h1>
          <p className={s.menuSub}><TextoAnimado id="sub" texto="y el origen de las neoplasias linfoides" retraso={500} paso={45} /></p>
        </div>

        {!terminado ? (
          <div className={s.introNarr}>
            {/* La intro por partes: se puede pausar, volver o saltar a una parte. */}
            <ol className={s.introPartes} aria-label="Partes de la intro">
              {INTRO.pasos.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`${s.introParte} ${i === rep.paso ? s.introParteActiva : ''} ${i < rep.paso ? s.introParteVista : ''}`}
                    aria-current={i === rep.paso ? 'step' : undefined}
                    onClick={() => rep.irA(i)}
                  >
                    <span className={s.introNum}>{i + 1}</span>
                    <span>{p.titulo}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className={s.introTexto} aria-live="polite">
              <TextoAnimado id={`ix-${paso.id}`} texto={paso.texto} retraso={150} />
            </div>
            <BarraTiempo rep={rep} escenario={INTRO} visto={new Set(Array.from({ length: rep.paso + 1 }, (_, i) => i))} />
            <div className={s.introControles}>
              <Controles rep={rep} total={INTRO.pasos.length} />
            </div>
            <button type="button" className={c.btnSec} onClick={() => rep.irA(ultimo, false)}>Saltar intro</button>
          </div>
        ) : (
          <>
            <ol className={s.capitulos}>
              {PARTES.map((p) => (
                <li key={p.id}>
                  <button type="button" className={s.capitulo} style={{ ['--parte' as string]: p.color }} onClick={() => onParte(p.id)}>
                    <span className={s.capNum}>{p.numero}</span>
                    <span className={s.capTxt}>
                      <strong>{p.nombreCorto}</strong>
                      <span className={s.capLugar}>{p.lugar} · {p.pasos.length} pasos</span>
                      <span className={s.capPregunta}>{p.pregunta}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className={s.menuAcciones}>
              <button type="button" className={c.btnPrim} onClick={() => onParte('medula')}>Empezar por la célula madre</button>
              <button type="button" className={c.btnSec} onClick={onNeoplasias}>Tabla de neoplasias</button>
              <button type="button" className={c.enlace} onClick={onRepetir}>Repetir intro</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
