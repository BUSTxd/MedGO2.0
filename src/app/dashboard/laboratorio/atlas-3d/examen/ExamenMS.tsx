'use client';

/**
 * Examen práctico de miembro superior sobre el modelo 3D. Calca el examen real:
 * se señala una estructura (pregunta A, escribir su nombre) y, recién después,
 * se pregunta algo de ella (pregunta B), que solo vale si la A estuvo bien.
 *
 * La escena la mueve el Visor; esto le dice qué señalar, cuándo bloquearla y
 * desenfocarla, y qué nombre revelar al corregir (`onControl`).
 *
 *   cargando → bienvenida → [volteo → esquina ⇄ A → B → corrección] × 10 → resultados
 */

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import NotaFinal from '@/components/examen/NotaFinal';
import { trackEvent } from '@/lib/analytics';
import { corregirA, corregirB, indexarFormas, type CorreccionB, type IndiceFormas, type Veredicto } from '@/lib/examen-ms/corregir';
import { armarExamen, cargarBanco, guardarIntento, leerAvance, type Avance } from '@/lib/examen-ms/sesion';
import type { BancoMS, CategoriaMS, ObjetivoMS, PreguntaMS, TipoB } from '@/lib/examen-ms/tipos';
import r from '@/styles/examRunner.module.css';
import s from '@/styles/examenMS.module.css';

export interface ControlEscena {
  objetivo: ObjetivoMS | null;
  bloqueada: boolean;
  borrosa: boolean;
  /** Nombre que se muestra sobre lo señalado (al corregir). */
  revelar: string | null;
  /** «Quitar músculos»: el modelo sin músculos para ver lo que tapan. */
  sinMusculos: boolean;
}

const BIENVENIDA =
  'Este examen ha sido entrenado con toda la información posible de la anatomía del miembro superior. Si lo completas todo, tendrás un rendimiento destacado en cualquier examen.';

const TIPO_B: Record<TipoB, string> = {
  inervacion: 'Inervación', funcion: 'Función', insercion: 'Inserción', origen: 'Origen',
  musculos_que_inerva: 'Músculos que inerva', territorio_sensitivo: 'Territorio sensitivo',
  articulaciones: 'Articulaciones', inserciones_musculares: 'Inserciones musculares',
  ramas_colaterales: 'Ramas colaterales', ramas_terminales: 'Ramas terminales', formadores: 'Formantes', desemboca: 'Desembocadura',
};
const CATEGORIAS: CategoriaMS[] = ['Huesos', 'Músculos', 'Arterias', 'Nervios', 'Venas'];
/** Veces que se puede usar «Quitar músculos» en un examen de 10. */
const USOS_QUITAR = 2;
const CLAVE_AYUDA = 'medgo:examen-ms:ayuda-musculos';
/** Mínimo de la animación de carga, para que no parpadee si el banco ya estaba en caché. */
const CARGA_MIN = 1300;

/** Clave del banco en `EXAMENES`: con ella la ficha del admin sabe qué examen es y su acceso. */
const EXAM_KEY = 'aparato-locomotor/practico-ms';

type Paso = 'volteo' | 'esquina' | 'A' | 'B' | 'correccion';
interface Respuesta { escritoA: string; veredictoA: Veredicto; escritoB: string; b: CorreccionB }

export default function ExamenMS({ reducido, onControl, onSalir }: {
  reducido: boolean;
  onControl: (c: ControlEscena) => void;
  onSalir: () => void;
}) {
  const [fase, setFase] = useState<'cargando' | 'error' | 'bienvenida' | 'examen' | 'resultados'>('cargando');
  const [error, setError] = useState<string | null>(null);
  const [banco, setBanco] = useState<BancoMS | null>(null);
  const [avance, setAvance] = useState<Avance>({ vistas: [], intentos: [] });
  const [preguntas, setPreguntas] = useState<PreguntaMS[]>([]);
  const [i, setI] = useState(0);
  const [paso, setPaso] = useState<Paso>('volteo');
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [intento, setIntento] = useState(0);
  const [usosQuitar, setUsosQuitar] = useState(USOS_QUITAR);
  const [sinMusculos, setSinMusculos] = useState(false);
  const [ayuda, setAyuda] = useState(false);
  const indice = useMemo<IndiceFormas | null>(() => (banco ? indexarFormas(banco.formas) : null), [banco]);

  // ── Carga del banco (con la animación de carga) ────────────────────────────
  useEffect(() => {
    const abort = new AbortController();
    setFase('cargando');
    setError(null);
    const t0 = performance.now();
    cargarBanco(abort.signal)
      .then(async (b) => {
        const falta = CARGA_MIN - (performance.now() - t0);
        if (falta > 0 && !reducido) await new Promise((ok) => setTimeout(ok, falta));
        if (abort.signal.aborted) return;
        setBanco(b);
        setAvance(leerAvance());
        setFase('bienvenida');
      })
      .catch((e: unknown) => {
        if (abort.signal.aborted) return;
        setError(e instanceof Error ? e.message : 'No se pudo cargar el examen.');
        setFase('error');
      });
    return () => abort.abort();
  }, [intento, reducido]);

  const actual = fase === 'examen' ? preguntas[i] : null;

  // ── La escena sigue al paso ────────────────────────────────────────────────
  useEffect(() => {
    if (!actual) {
      onControl({ objetivo: null, bloqueada: false, borrosa: false, revelar: null, sinMusculos: false });
      return;
    }
    // Sin rótulo sobre el modelo: el nombre ya está en la tarjeta de corrección
    // (en el modelo tapaba la tarjeta).
    onControl({ objetivo: actual.objetivo, bloqueada: paso === 'B', borrosa: paso === 'B', revelar: null, sinMusculos });
  }, [actual, paso, sinMusculos, onControl]);

  // La primera vez que se ve la tarjeta en la esquina se explica «Quitar músculos».
  useEffect(() => {
    if (paso !== 'esquina' || i !== 0) return;
    let visto = false;
    try { visto = localStorage.getItem(CLAVE_AYUDA) === '1'; } catch {}
    if (!visto) setAyuda(true);
  }, [paso, i]);
  const cerrarAyuda = () => {
    setAyuda(false);
    try { localStorage.setItem(CLAVE_AYUDA, '1'); } catch {}
  };
  const quitarMusculos = () => {
    if (sinMusculos || usosQuitar <= 0) return;
    setUsosQuitar((n) => n - 1);
    setSinMusculos(true);
    setAyuda(false);
    try { localStorage.setItem(CLAVE_AYUDA, '1'); } catch {}
  };

  // Volteo con tensión y, al terminar, la tarjeta se va a la esquina.
  useEffect(() => {
    if (paso !== 'volteo') return;
    const t = setTimeout(() => setPaso('esquina'), reducido ? 250 : 1700);
    return () => clearTimeout(t);
  }, [paso, i, reducido]);

  const comenzar = () => {
    if (!banco) return;
    setPreguntas(armarExamen(banco, new Set(avance.vistas)));
    setRespuestas([]);
    setUsosQuitar(USOS_QUITAR);
    setSinMusculos(false);
    setI(0);
    setPaso('volteo');
    setFase('examen');
    trackEvent('banco_iniciado', { examKey: EXAM_KEY, modo: 'examen3d' });
  };

  const responderA = (escrito: string) => {
    if (!actual || !indice) return;
    const v = corregirA(escrito, actual, indice).veredicto;
    setRespuestas((rs) => {
      const n = [...rs];
      n[i] = { escritoA: escrito, veredictoA: v, escritoB: '', b: { puntaje: 0, acertadas: [], incorrectas: [], faltan: [], necesarias: 0 } };
      return n;
    });
    setPaso('B');
  };
  const responderB = (escrito: string) => {
    if (!actual || !indice) return;
    setRespuestas((rs) => {
      const n = [...rs];
      const aBien = n[i].veredictoA !== 'mal';
      n[i] = { ...n[i], escritoB: escrito, b: corregirB(escrito, actual, aBien, indice) };
      return n;
    });
    setPaso('correccion');
  };
  const siguiente = () => {
    // Los músculos vuelven en cada pregunta; los usos gastados no.
    setSinMusculos(false);
    if (i + 1 < preguntas.length) {
      setI(i + 1);
      setPaso('volteo');
      return;
    }
    const puntos = respuestas.reduce((n, x) => n + (x.veredictoA !== 'mal' ? 1 : 0) + x.b.puntaje, 0);
    setAvance(guardarIntento(preguntas.map((p) => p.id), puntos, preguntas.length * 2));
    trackEvent('examen_completado', { examKey: EXAM_KEY, modo: 'examen3d', score: puntos, total: preguntas.length * 2 });
    setFase('resultados');
  };

  // Esc devuelve la tarjeta a la esquina mientras se responde la A.
  useEffect(() => {
    if (paso !== 'A') return;
    const t = (e: KeyboardEvent) => e.key === 'Escape' && setPaso('esquina');
    window.addEventListener('keydown', t);
    return () => window.removeEventListener('keydown', t);
  }, [paso]);

  return (
    <div className={s.capa}>
      {fase !== 'resultados' && (
        <div className={s.barra}>
          {actual && (paso === 'esquina' || paso === 'A') && (
            <div className={s.quitarAncla}>
              <button
                type="button"
                className={sinMusculos ? `${s.quitar} ${s.quitarActivo}` : s.quitar}
                onClick={quitarMusculos}
                disabled={sinMusculos || usosQuitar <= 0}
                aria-describedby={ayuda ? 'ayuda-quitar' : undefined}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                {sinMusculos ? 'Sin músculos' : 'Quitar músculos'}
                <span className={s.usos} aria-label={`${usosQuitar} usos`}>{usosQuitar}</span>
              </button>
              {ayuda && (
                <div id="ayuda-quitar" className={s.ayudaQuitar} role="note">
                  <div className={s.ayudaDemo} aria-hidden>
                    <span className={s.demoHueso} />
                    <span className={s.demoMusculo} />
                    <span className={s.demoNervio} />
                  </div>
                  <p><b>¿Un músculo tapa lo señalado?</b> Quítalos de la vista para ver lo que hay debajo. Puedes usarlo <b>{USOS_QUITAR} veces</b> en cada examen.</p>
                  <button type="button" className={s.primario} onClick={cerrarAyuda}>Entendido</button>
                </div>
              )}
            </div>
          )}
          {actual && <span className={s.contador}>Pregunta {i + 1} de {preguntas.length}</span>}
          <button type="button" className={s.salir} onClick={onSalir}>Salir del examen</button>
        </div>
      )}

      {fase === 'cargando' && (
        <div className={s.velo}>
          <div className={s.cargando} role="status" aria-live="polite">
            <div className={s.cargandoMazo} aria-hidden>
              <span /><span /><span />
            </div>
            <p>Preparando tu examen…</p>
          </div>
        </div>
      )}

      {fase === 'error' && (
        <div className={s.velo}>
          <section className={s.dialogo} role="alert">
            <h2>No se pudo abrir el examen</h2>
            <p>{error}</p>
            <div className={s.botones}>
              <button type="button" className={s.primario} onClick={() => setIntento((n) => n + 1)}>Reintentar</button>
              <button type="button" className={s.secundario} onClick={onSalir}>Volver al atlas</button>
            </div>
          </section>
        </div>
      )}

      {fase === 'bienvenida' && banco && (
        <div className={s.velo}>
          <section className={s.dialogo} role="dialog" aria-modal="true" aria-labelledby="examen-ms-titulo">
            <span className={s.kicker}>Examen práctico · Miembro superior</span>
            <h2 id="examen-ms-titulo">Antes de empezar</h2>
            <p className={s.bienvenida}>{BIENVENIDA}</p>
            <ul className={s.reglas}>
              <li><b>A:</b> escribe el nombre de la estructura señalada. Puedes girar y acercar el modelo.</li>
              <li><b>B:</b> se desbloquea al responder la A. Solo cuenta si la A está bien, y vale entera o nada.</li>
              <li>Son {Math.min(10, banco.preguntas.length)} preguntas con el mismo reparto que el examen real.</li>
            </ul>
            <Progreso vistas={avance.vistas.length} total={banco.preguntas.length} />
            <div className={s.botones}>
              <button type="button" className={s.primario} onClick={comenzar} autoFocus>Comenzar</button>
            </div>
          </section>
        </div>
      )}

      {actual && (
        <Tarjeta
          key={i}
          pregunta={actual}
          numero={i + 1}
          paso={paso}
          respuesta={respuestas[i]}
          onExpandir={() => setPaso('A')}
          onEsquina={() => setPaso('esquina')}
          onA={responderA}
          onB={responderB}
          onSiguiente={siguiente}
          ultima={i + 1 === preguntas.length}
        />
      )}

      {fase === 'resultados' && (
        <Resultados preguntas={preguntas} respuestas={respuestas} avance={avance} total={banco?.preguntas.length ?? 0} onOtra={comenzar} onSalir={onSalir} />
      )}
    </div>
  );
}

function Progreso({ vistas, total }: { vistas: number; total: number }) {
  const pct = total ? Math.round((vistas / total) * 100) : 0;
  return (
    <div className={s.progreso}>
      <div className={s.progresoBarra}><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
      <span>Has visto {vistas} de {total} preguntas del banco</span>
    </div>
  );
}

// ── La tarjeta: se voltea, se va a la esquina, se expande para responder ─────
function Tarjeta({ pregunta, numero, paso, respuesta, onExpandir, onEsquina, onA, onB, onSiguiente, ultima }: {
  pregunta: PreguntaMS;
  numero: number;
  paso: Paso;
  respuesta?: Respuesta;
  onExpandir: () => void;
  onEsquina: () => void;
  onA: (t: string) => void;
  onB: (t: string) => void;
  onSiguiente: () => void;
  ultima: boolean;
}) {
  const enEsquina = paso === 'esquina' || paso === 'volteo';
  const clasePos = paso === 'esquina' ? s.posEsquina : paso === 'volteo' ? s.posVolteo : s.posCentro;
  return (
    <div className={`${s.posicion} ${clasePos}`}>
      <div className={paso === 'esquina' ? `${s.sacude} ${s.sacudeRecordatorio}` : s.sacude}>
        <div className={paso === 'volteo' ? `${s.cara3d} ${s.cara3dVolteo}` : s.cara3d}>
          {enEsquina ? (
            <button
              type="button"
              className={`${s.cara} ${s.frente}`}
              onClick={paso === 'esquina' ? onExpandir : undefined}
              aria-label={`Pregunta ${numero}: ¿qué estructura se señala? Toca para responder.`}
              tabIndex={paso === 'esquina' ? 0 : -1}
            >
              <span className={s.etiqueta}>Pregunta {numero} · A</span>
              <span className={s.pregunta}>¿Qué estructura se señala?</span>
              <span className={s.pista}>{paso === 'esquina' ? 'Toca para responder' : pregunta.categoria}</span>
            </button>
          ) : (
            <div className={`${s.cara} ${s.frente} ${s.expandida}`}>
              {paso === 'A' && <FormA numero={numero} pregunta={pregunta} onEnviar={onA} onEsquina={onEsquina} />}
              {paso === 'B' && respuesta && <FormB numero={numero} pregunta={pregunta} onEnviar={onB} />}
              {paso === 'correccion' && respuesta && <Correccion pregunta={pregunta} r={respuesta} onSiguiente={onSiguiente} ultima={ultima} />}
            </div>
          )}
          <div className={`${s.cara} ${s.dorso}`} aria-hidden>
            <span className={s.dorsoMarca}>MedGO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormA({ numero, pregunta, onEnviar, onEsquina }: { numero: number; pregunta: PreguntaMS; onEnviar: (t: string) => void; onEsquina: () => void }) {
  const [t, setT] = useState('');
  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (t.trim()) onEnviar(t.trim());
  };
  return (
    <form onSubmit={enviar} className={s.form}>
      <span className={s.etiqueta}>Pregunta {numero} · A</span>
      <label htmlFor="resp-a" className={s.enunciado}>{pregunta.preguntaA.enunciado}</label>
      <input id="resp-a" className={s.campo} value={t} onChange={(e) => setT(e.target.value)} autoComplete="off" autoCapitalize="off" spellCheck={false} autoFocus placeholder="Escribe el nombre…" />
      <div className={s.botones}>
        <button type="submit" className={s.primario} disabled={!t.trim()}>Responder</button>
        <button type="button" className={s.secundario} onClick={onEsquina}>Ver el modelo</button>
      </div>
    </form>
  );
}

function FormB({ numero, pregunta, onEnviar }: { numero: number; pregunta: PreguntaMS; onEnviar: (t: string) => void }) {
  const [t, setT] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);
  const b = pregunta.preguntaB;
  const varias = b.pide > 1 || !!b.todas;
  const enviar = (e?: FormEvent) => {
    e?.preventDefault();
    if (t.trim()) onEnviar(t.trim());
  };
  return (
    <form onSubmit={enviar} className={`${s.form} ${s.formB}`}>
      <span className={s.etiqueta}>Pregunta {numero} · B</span>
      <label htmlFor="resp-b" className={s.enunciado}>{b.enunciado}</label>
      {varias && <p className={s.ayudaCampo}>Sepáralas con comas, «y» o un salto de línea.</p>}
      <textarea
        id="resp-b"
        ref={ref}
        className={s.campo}
        rows={varias ? 3 : 2}
        value={t}
        onChange={(e) => setT(e.target.value)}
        onKeyDown={(e) => {
          // Enter responde; Shift+Enter añade una línea.
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
        }}
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus
        placeholder={varias ? 'Escribe tus respuestas…' : 'Escribe tu respuesta…'}
      />
      <div className={s.botones}>
        <button type="submit" className={s.primario} disabled={!t.trim()}>Responder</button>
      </div>
    </form>
  );
}

function Sello({ ok, casi, children }: { ok: boolean; casi?: boolean; children: React.ReactNode }) {
  return <span className={ok ? (casi ? s.vCasi : s.vBien) : s.vMal}>{children}</span>;
}

function Correccion({ pregunta, r: x, onSiguiente, ultima }: { pregunta: PreguntaMS; r: Respuesta; onSiguiente: () => void; ultima: boolean }) {
  const aBien = x.veredictoA !== 'mal';
  const b = pregunta.preguntaB;
  const bBien = x.b.puntaje === 1;
  const otras = pregunta.preguntaA.aceptadas.filter((f) => f.toLowerCase() !== pregunta.preguntaA.respuesta.toLowerCase()).slice(0, 8);
  const acertadas = new Set(x.b.acertadas.map((a) => a.indice));
  const erratas = x.b.acertadas.filter((a) => a.errata);
  const siguienteRef = useRef<HTMLButtonElement>(null);
  useEffect(() => siguienteRef.current?.focus(), []);
  return (
    <div className={s.correccion}>
      <section className={s.bloque}>
        <div className={s.bloqueCabeza}>
          <span className={s.etiqueta}>A · Nombre de la estructura</span>
          <Sello ok={aBien} casi={x.veredictoA === 'casi'}>{aBien ? (x.veredictoA === 'casi' ? 'Bien, revisa la ortografía' : 'Correcta') : 'Incorrecta'}</Sello>
        </div>
        <p className={s.tuya}>Escribiste: <i>{x.escritoA}</i></p>
        <p className={s.oficial}>{pregunta.preguntaA.respuesta}</p>
        {otras.length > 0 && <p className={s.otras}>También vale: {otras.join(' · ')}</p>}
      </section>

      <section className={s.bloque}>
        <div className={s.bloqueCabeza}>
          <span className={s.etiqueta}>B · {b.enunciado}</span>
          <Sello ok={bBien}>{bBien ? 'Correcta' : !aBien ? 'No cuenta (la A estuvo mal)' : 'Incorrecta'}</Sello>
        </div>
        <p className={s.tuya}>Escribiste: <i>{x.escritoB}</i></p>
        <p className={s.criterio}>{b.todas ? `Había que escribir las ${b.respuestas.length}.` : b.pide > 1 ? `Había que escribir ${b.pide} de estas, sin ninguna incorrecta:` : 'Respuesta:'}</p>
        <ul className={s.lista}>
          {b.respuestas.map((resp, k) => (
            <li key={k} className={acertadas.has(k) ? s.itemBien : s.item}>
              <span className={s.itemTexto}>{resp.texto}{resp.precision ? <small> ({resp.precision})</small> : null}</span>
              {resp.ref && resp.aceptadas.length > 1 && <small className={s.itemFormas}>{resp.aceptadas.filter((f) => f !== resp.texto).slice(0, 4).join(' · ')}</small>}
              {resp.nota && acertadas.has(k) && <small className={s.itemNota}>{resp.nota}</small>}
            </li>
          ))}
        </ul>
        {x.b.incorrectas.length > 0 && (
          <p className={s.sobran}>No corresponde: {x.b.incorrectas.map((t) => `«${t}»`).join(', ')}</p>
        )}
        {erratas.length > 0 && <p className={s.avisoOrtografia}>Revisa la ortografía de: {erratas.map((a) => `«${a.escrito}»`).join(', ')}</p>}
        {b.nota && <p className={s.nota}>{b.nota}</p>}
      </section>

      <div className={s.botones}>
        <button ref={siguienteRef} type="button" className={s.primario} onClick={onSiguiente}>{ultima ? 'Ver resultados' : 'Siguiente'}</button>
      </div>
    </div>
  );
}

// ── Resultados: mismo diseño que el examen final de Inmunología ─────────────
function Resultados({ preguntas, respuestas, avance, total, onOtra, onSalir }: {
  preguntas: PreguntaMS[];
  respuestas: Respuesta[];
  avance: Avance;
  total: number;
  onOtra: () => void;
  onSalir: () => void;
}) {
  const filas = preguntas.map((p, k) => {
    const x = respuestas[k];
    const a = !!x && x.veredictoA !== 'mal';
    const b = !!x && x.b.puntaje === 1;
    return { p, a, b, puntos: (a ? 1 : 0) + (b ? 1 : 0) };
  });
  const puntos = filas.reduce((n, f) => n + f.puntos, 0);
  const max = filas.length * 2;
  const pct = max ? Math.round((puntos / max) * 100) : 0;
  const porCategoria = CATEGORIAS.map((c) => {
    const l = filas.filter((f) => f.p.categoria === c);
    const ok = l.reduce((n, f) => n + f.puntos, 0);
    return { c, ok, total: l.length * 2, pct: l.length ? Math.round((ok / (l.length * 2)) * 100) : 100, fallos: l.filter((f) => f.puntos < 2) };
  }).filter((x) => x.total > 0);
  const peorCategoria = [...porCategoria].sort((a, b) => a.pct - b.pct)[0];
  const fallosB = new Map<TipoB, number>();
  for (const f of filas) if (!f.b) fallosB.set(f.p.preguntaB.tipoB, (fallosB.get(f.p.preguntaB.tipoB) ?? 0) + 1);
  const peorTipoB = [...fallosB.entries()].sort((a, b) => b[1] - a[1])[0];
  const fallos = filas.filter((f) => f.puntos < 2);
  const titulo = pct >= 80 ? '¡Excelente!' : pct >= 60 ? '¡Buen trabajo!' : pct >= 40 ? 'Vas por buen camino' : 'A repasar este tema';

  return (
    <div className={s.resultadosCapa}>
      <div className={`${r.resultShell} ${s.resultados}`}>
        <NotaFinal score={puntos} total={max} pct={pct} etiqueta="del puntaje" />
        <h2 className={r.resultTitle}>{titulo}</h2>
        <p className={r.resultSub}>Cada pregunta vale 2 puntos: 1 la A y 1 la B. Tu intento se guardó en este navegador.</p>

        {(peorCategoria?.pct < 100 || peorTipoB) && (
          <div className={s.diagnostico}>
            {peorCategoria && peorCategoria.pct < 100 && (
              <p><span>Donde más fallaste</span><b>{peorCategoria.c}</b> ({peorCategoria.ok}/{peorCategoria.total} puntos)</p>
            )}
            {peorTipoB && (
              <p><span>Tipo de pregunta B más fallado</span><b>{TIPO_B[peorTipoB[0]]}</b> ({peorTipoB[1]} {peorTipoB[1] === 1 ? 'vez' : 'veces'})</p>
            )}
          </div>
        )}

        <div className={r.temas}>
          <p className={r.temasTitulo}>Por categoría</p>
          {porCategoria.map((x) => (
            <div key={x.c} className={r.temaRow}>
              <span className={r.temaNombre}>{x.c}</span>
              <span className={r.temaBarra}>
                <span className={`${r.temaBarraFill} ${x.pct < 60 ? r.temaFillMal : x.pct < 80 ? r.temaFillMedio : r.temaFillOk}`} style={{ width: `${x.pct}%` }} />
              </span>
              <span className={r.temaScore}>{x.ok}/{x.total}</span>
            </div>
          ))}
        </div>

        {fallos.length > 0 && (
          <div className={s.fallos}>
            <p className={r.temasTitulo}>Repasa en tus resúmenes</p>
            <ul>
              {fallos.map(({ p, a, b }) => (
                <li key={p.id}>
                  <div>
                    <b>{p.preguntaA.respuesta}</b>
                    <small>{!a ? 'Fallaste el nombre' : `Fallaste la B · ${TIPO_B[p.preguntaB.tipoB]}`} · {p.categoria}</small>
                  </div>
                  <a href={p.resumenRelacionado.href} target="_blank" rel="noopener noreferrer" className={s.enlaceResumen}>
                    Abrir el resumen
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Progreso vistas={avance.vistas.length} total={total} />

        <div className={s.botones}>
          <button type="button" className={s.primario} onClick={onOtra}>Otro examen</button>
          <button type="button" className={s.secundario} onClick={onSalir}>Volver al atlas</button>
        </div>
      </div>
    </div>
  );
}
