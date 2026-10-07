'use client';

import { useEffect } from 'react';
import type { Repaso } from '@/lib/data/atlas-3d/repasos';
import s from '@/styles/atlas3d.module.css';

export type ModoRepaso = 'recorrido' | 'prueba';

export interface EstadoRepaso {
  id: string;
  modo: ModoRepaso;
  paso: number;
}

export interface Pregunta {
  /** Pieza resaltada (nombreEn). */
  en: string;
  opciones: string[];
  /** Lo que eligió el alumno; null mientras no responde. */
  respuesta: string | null;
}

interface Props {
  repaso: Repaso;
  estado: EstadoRepaso;
  pregunta: Pregunta | null;
  marcador: { aciertos: number; total: number };
  /** nombreEn → nombre en español (el del visor). */
  nombreDe: (en: string) => string;
  /** nombreEn de lo seleccionado en la escena, para marcarlo en la lista. */
  elegidaEn: string | null;
  onPaso: (paso: number) => void;
  onModo: (modo: ModoRepaso) => void;
  onElegir: (en: string) => void;
  onResponder: (en: string) => void;
  onSiguiente: () => void;
  onSalir: () => void;
}

export default function PanelRepaso(p: Props) {
  const { repaso, estado, pregunta } = p;
  const paso = repaso.pasos[estado.paso];
  const total = repaso.pasos.length;

  // Prueba: 1-4 responden, Enter pasa a la siguiente. Recorrido: flechas.
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.ctrlKey || e.metaKey || e.altKey) return;
      if (estado.modo === 'prueba' && pregunta) {
        const n = Number(e.key);
        if (!pregunta.respuesta && n >= 1 && n <= pregunta.opciones.length) p.onResponder(pregunta.opciones[n - 1]);
        else if (pregunta.respuesta && e.key === 'Enter') {
          e.preventDefault();
          p.onSiguiente();
        }
      } else if (estado.modo === 'recorrido') {
        if (e.key === 'ArrowRight' && estado.paso < total - 1) p.onPaso(estado.paso + 1);
        if (e.key === 'ArrowLeft' && estado.paso > 0) p.onPaso(estado.paso - 1);
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [estado, pregunta, total, p]);

  return (
    <section className={s.repaso} aria-label={`Repaso: ${repaso.nombre}`}>
      <div className={s.repasoCabecera}>
        <span className={s.kicker}>Repaso</span>
        <button type="button" className={s.repasoSalir} onClick={p.onSalir}>
          Salir
        </button>
      </div>
      <h2 className={s.repasoTitulo}>{repaso.nombre}</h2>

      <div className={s.zonas} role="group" aria-label="Modo">
        {(['recorrido', 'prueba'] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={estado.modo === m ? s.zonaActiva : s.zona}
            aria-pressed={estado.modo === m}
            onClick={() => p.onModo(m)}
          >
            {m === 'recorrido' ? 'Recorrido' : 'Ponerme a prueba'}
          </button>
        ))}
      </div>

      {estado.modo === 'recorrido' ? (
        <>
          <div className={s.pasoNav}>
            <button type="button" className={s.botonSec} onClick={() => p.onPaso(estado.paso - 1)} disabled={estado.paso === 0}>
              Anterior
            </button>
            <span>
              {estado.paso + 1} / {total}
            </span>
            <button type="button" className={s.boton} onClick={() => p.onPaso(estado.paso + 1)} disabled={estado.paso === total - 1}>
              Siguiente
            </button>
          </div>
          <div className={s.pasoPuntos} role="tablist" aria-label="Pasos">
            {repaso.pasos.map((x, i) => (
              <button
                key={x.titulo}
                type="button"
                role="tab"
                aria-selected={i === estado.paso}
                aria-label={x.titulo}
                title={x.titulo}
                className={i === estado.paso ? s.pasoPuntoActivo : i < estado.paso ? s.pasoPuntoHecho : s.pasoPunto}
                onClick={() => p.onPaso(i)}
              />
            ))}
          </div>
          <h3 className={s.pasoTitulo}>{paso.titulo}</h3>
          <p className={s.pasoTexto}>{paso.texto}</p>
          <ul className={s.pasoPiezas}>
            {paso.piezas.map((x) => (
              <li key={x.en}>
                <button type="button" aria-pressed={p.elegidaEn === x.en} onClick={() => p.onElegir(x.en)}>
                  <i />
                  <span>{p.nombreDe(x.en)}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className={s.nota}>Toca una pieza (aquí o en la escena) para ver su ficha. Flechas ← → para avanzar.</p>
        </>
      ) : (
        pregunta && (
          <>
            <div className={s.pasoNav}>
              <span className={s.pregunta}>¿Qué estructura está resaltada?</span>
              <span className={s.marcador} aria-label="Aciertos">
                {p.marcador.aciertos}/{p.marcador.total}
              </span>
            </div>
            <ol className={s.opciones}>
              {pregunta.opciones.map((en, i) => {
                const respondida = pregunta.respuesta !== null;
                const clase = !respondida
                  ? s.opcion
                  : en === pregunta.en
                    ? s.opcionBien
                    : en === pregunta.respuesta
                      ? s.opcionMal
                      : s.opcionApagada;
                return (
                  <li key={en}>
                    <button type="button" className={clase} disabled={respondida} onClick={() => p.onResponder(en)}>
                      <b>{i + 1}</b>
                      <span>{p.nombreDe(en)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {pregunta.respuesta && (
              <div className={s.pruebaPie} aria-live="polite">
                <p className={pregunta.respuesta === pregunta.en ? s.veredictoBien : s.veredictoMal}>
                  {pregunta.respuesta === pregunta.en ? '¡Correcto!' : `Era: ${p.nombreDe(pregunta.en)}`}
                </p>
                <button type="button" className={s.boton} onClick={p.onSiguiente}>
                  Siguiente
                </button>
              </div>
            )}
          </>
        )
      )}
    </section>
  );
}
