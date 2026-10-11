'use client';

/**
 * Examen práctico de miembro superior sobre el modelo 3D. Calca el examen real:
 * se señala una estructura (pregunta A, escribir su nombre) y, recién después,
 * se pregunta algo de ella (pregunta B), que solo vale si la A estuvo bien.
 *
 * La escena la mueve el Visor; esto le dice qué señalar, cuándo bloquearla y
 * desenfocarla, y qué nombre revelar al corregir (`onControl`).
 *
 *   cargando → barajas → [volteo → esquina ⇄ A → B → corrección] × 10 → resultados
 *
 * El banco va partido en barajas fijas de 10 (`armarBarajas`), de lo que salió en
 * los exámenes reales a lo menos probable: las hechas llevan un cheque y su nota,
 * y cualquiera se puede repetir.
 */

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import dynamic from 'next/dynamic';
import NotaFinal from '@/components/examen/NotaFinal';
import CortePremium from '@/components/examen/CortePremium';
import { usePlan } from '@/components/PlanProvider';
import { trackEvent } from '@/lib/analytics';
import { PLANS, planUnlocks } from '@/lib/plans';
import { corregirA, corregirB, indexarFormas, type CorreccionB, type IndiceFormas, type Veredicto } from '@/lib/examen-ms/corregir';
import { cargarBanco, guardarIntento, leerAvance, type Avance, type Baraja, type PruebaGratis } from '@/lib/examen-ms/sesion';
import RejillaBarajas from '@/components/examen/RejillaBarajas';
import type { BancoMS, CategoriaMS, ObjetivoMS, PreguntaMS, TipoB } from '@/lib/examen-ms/tipos';
import r from '@/styles/examRunner.module.css';
import s from '@/styles/examenMS.module.css';

// El SDK de Mercado Pago pesa: el modal sólo se baja cuando alguien lo abre.
const SubscribeModal = dynamic(() => import('@/components/SubscribeModal'), { ssr: false });

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
/**
 * Lo que se espera, tras terminar, antes de que baje el corte premium (igual que
 * en ExamRunner): da tiempo a que la nota termine de contar.
 */
const ESPERA_CORTE = 2400;

type Paso = 'volteo' | 'esquina' | 'A' | 'B' | 'correccion';
interface Respuesta { escritoA: string; veredictoA: Veredicto; escritoB: string; b: CorreccionB }

export default function ExamenMS({ reducido, onControl, onSalir, etiquetaVolver = 'Volver al atlas' }: {
  reducido: boolean;
  onControl: (c: ControlEscena) => void;
  onSalir: () => void;
  etiquetaVolver?: string;
}) {
  const [fase, setFase] = useState<'cargando' | 'error' | 'barajas' | 'examen' | 'resultados'>('cargando');
  const [error, setError] = useState<string | null>(null);
  const [banco, setBanco] = useState<BancoMS | null>(null);
  const [barajas, setBarajas] = useState<Baraja[]>([]);
  /** Solo sin plan: el banco llegó recortado a las barajas de prueba. */
  const [prueba, setPrueba] = useState<PruebaGratis | null>(null);
  const [pagoAbierto, setPagoAbierto] = useState(false);
  const [avance, setAvance] = useState<Avance>({ vistas: [], intentos: [], barajas: {} });
  const [baraja, setBaraja] = useState<Baraja | null>(null);
  const [preguntas, setPreguntas] = useState<PreguntaMS[]>([]);
  const [i, setI] = useState(0);
  const [paso, setPaso] = useState<Paso>('volteo');
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [intento, setIntento] = useState(0);
  const [usosQuitar, setUsosQuitar] = useState(USOS_QUITAR);
  const [sinMusculos, setSinMusculos] = useState(false);
  const [ayuda, setAyuda] = useState(false);
  const indice = useMemo<IndiceFormas | null>(() => (banco ? indexarFormas(banco.formas) : null), [banco]);
  /** La primera baraja abierta sin hacer a partir de `desde` (y si no, desde el principio). */
  const pendienteDesde = (desde: number, av: Avance) => {
    const pendiente = (b: Baraja) => !b.bloqueada && !av.barajas[b.firma];
    return barajas.find((b) => b.numero > desde && pendiente(b)) ?? barajas.find(pendiente) ?? null;
  };

  const abrirPago = (origen: string) => {
    if (!prueba) return;
    trackEvent('pago_abierto', { plan: prueba.plan, origen, examKey: EXAM_KEY });
    setPagoAbierto(true);
  };

  // Al pagar, el plan vivo cambia al instante: se vuelve a pedir el banco, que
  // ahora llega entero. El modal sigue montado (no depende de la fase) y
  // termina de enseñar el recibo.
  const plan = usePlan();
  const pagado = !!prueba && plan.isActive && planUnlocks(plan.plan, prueba.plan);
  useEffect(() => {
    if (pagado) setIntento((n) => n + 1);
  }, [pagado]);

  // ── Carga del banco (con la animación de carga) ────────────────────────────
  useEffect(() => {
    const abort = new AbortController();
    setFase('cargando');
    setError(null);
    const t0 = performance.now();
    cargarBanco(abort.signal)
      .then(async (c) => {
        const falta = CARGA_MIN - (performance.now() - t0);
        if (falta > 0 && !reducido) await new Promise((ok) => setTimeout(ok, falta));
        if (abort.signal.aborted) return;
        setBanco(c.banco);
        setBarajas(c.barajas);
        setPrueba(c.prueba);
        setAvance(leerAvance());
        setFase('barajas');
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

  const comenzar = (b: Baraja) => {
    // Sus preguntas ni siquiera llegaron: el candado abre la pasarela.
    if (b.bloqueada) { abrirPago('baraja'); return; }
    setBaraja(b);
    // Orden del examen real: mezclado, sin agrupar por categoría (cambia en cada intento).
    setPreguntas([...b.preguntas].sort(() => Math.random() - 0.5));
    setRespuestas([]);
    setUsosQuitar(USOS_QUITAR);
    setSinMusculos(false);
    setI(0);
    setPaso('volteo');
    setFase('examen');
    trackEvent('banco_iniciado', { examKey: EXAM_KEY, modo: 'examen3d', baraja: b.numero });
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
    if (!baraja) return;
    const puntos = respuestas.reduce((n, x) => n + (x.veredictoA !== 'mal' ? 1 : 0) + x.b.puntaje, 0);
    setAvance(guardarIntento(baraja, puntos, preguntas.length * 2));
    trackEvent('examen_completado', { examKey: EXAM_KEY, modo: 'examen3d', baraja: baraja.numero, score: puntos, total: preguntas.length * 2 });
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
          {actual && <span className={s.contador}>Baraja {baraja?.numero} · Pregunta {i + 1} de {preguntas.length}</span>}
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
              <button type="button" className={s.secundario} onClick={onSalir}>{etiquetaVolver}</button>
            </div>
          </section>
        </div>
      )}

      {fase === 'barajas' && banco && (
        <div className={s.velo}>
          <SelectorBarajas
            barajas={barajas}
            avance={avance}
            sugerida={pendienteDesde(0, avance)}
            prueba={prueba}
            onElegir={comenzar}
            onPagar={() => abrirPago('barajas')}
          />
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

      {fase === 'resultados' && baraja && (
        <Resultados
          baraja={baraja}
          preguntas={preguntas}
          respuestas={respuestas}
          hechas={barajas.filter((b) => avance.barajas[b.firma]).length}
          total={barajas.length}
          siguiente={pendienteDesde(baraja.numero, avance)}
          prueba={prueba}
          libres={barajas.filter((b) => !b.bloqueada).length}
          reducido={reducido}
          etiquetaVolver={etiquetaVolver}
          onElegir={comenzar}
          onBarajas={() => setFase('barajas')}
          onPagar={abrirPago}
          onSalir={onSalir}
        />
      )}

      {prueba && pagoAbierto && (
        <SubscribeModal open planKey={prueba.plan} onClose={() => setPagoAbierto(false)} />
      )}
    </div>
  );
}

function Progreso({ hechas, total }: { hechas: number; total: number }) {
  const pct = total ? Math.round((hechas / total) * 100) : 0;
  return (
    <div className={s.progreso}>
      <div className={s.progresoBarra}><span style={{ transform: `scaleX(${pct / 100})` }} /></div>
      <span>Has hecho {hechas} de {total} barajas</span>
    </div>
  );
}

// ── Barajas: las hechas con cheque y nota; cualquiera se puede (re)hacer ─────
function SelectorBarajas({ barajas, avance, sugerida, prueba, onElegir, onPagar }: {
  barajas: Baraja[];
  avance: Avance;
  sugerida: Baraja | null;
  prueba: PruebaGratis | null;
  onElegir: (b: Baraja) => void;
  onPagar: () => void;
}) {
  const hechas = barajas.filter((b) => avance.barajas[b.firma]).length;
  const libres = barajas.filter((b) => !b.bloqueada);
  return (
    <section className={`${s.dialogo} ${s.dialogoBarajas}`} role="dialog" aria-modal="true" aria-labelledby="examen-ms-titulo">
      <span className={s.kicker}>Examen práctico · Miembro superior</span>
      <h2 id="examen-ms-titulo">{hechas ? 'Elige una baraja' : 'Antes de empezar'}</h2>
      {/* Las reglas, solo hasta la primera baraja: después estorban a la lista. */}
      {!hechas && (
        <>
          <p className={s.bienvenida}>{BIENVENIDA}</p>
          <ul className={s.reglas}>
            <li><b>A:</b> escribe el nombre de la estructura señalada. Puedes girar y acercar el modelo.</li>
            <li><b>B:</b> se desbloquea al responder la A. Solo cuenta si la A está bien, y vale entera o nada.</li>
            <li>Cada baraja son 10 preguntas con el mismo reparto que el examen real. Van de lo que ya salió a lo menos probable.</li>
          </ul>
        </>
      )}
      {prueba && (
        <p className={s.pruebaAviso}>
          <b>Prueba gratis:</b> las barajas {libres.map((b) => b.numero).join(' y ')} están abiertas. Las otras{' '}
          {barajas.length - libres.length} se abren con el plan {PLANS[prueba.plan].label}.
        </p>
      )}
      <Progreso hechas={hechas} total={barajas.length} />

      <RejillaBarajas
        items={barajas.map((b) => {
          const res = b.bloqueada ? undefined : avance.barajas[b.firma];
          return { firma: b.firma, numero: b.numero, nivel: b.nivel, bloqueada: b.bloqueada, gratis: !!prueba && !b.bloqueada, nota: res ? `${res.puntos}/${res.total}` : null };
        })}
        sugerida={sugerida?.firma}
        pie="10 preg."
        onElegir={(item) => onElegir(barajas.find((b) => b.firma === item.firma)!)}
      />

      <div className={s.botones}>
        {sugerida ? (
          <button type="button" className={s.primario} onClick={() => onElegir(sugerida)} autoFocus>
            {hechas ? `Seguir con la baraja ${sugerida.numero}` : `Empezar la baraja ${sugerida.numero}`}
          </button>
        ) : prueba ? (
          <button type="button" className={s.primario} onClick={onPagar} autoFocus>Desbloquear las {barajas.length} barajas</button>
        ) : (
          <p className={s.todasHechas}>Hiciste todas las barajas. Toca cualquiera para repetirla.</p>
        )}
      </div>
    </section>
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
function Resultados({ baraja, preguntas, respuestas, hechas, total, siguiente, prueba, libres, reducido, etiquetaVolver, onElegir, onBarajas, onPagar, onSalir }: {
  baraja: Baraja;
  preguntas: PreguntaMS[];
  respuestas: Respuesta[];
  hechas: number;
  total: number;
  /** La próxima baraja abierta sin hacer (null si ya están todas). */
  siguiente: Baraja | null;
  /** Solo sin plan: qué abre el plan que falta. */
  prueba: PruebaGratis | null;
  /** Cuántas barajas están abiertas (las de prueba, sin plan). */
  libres: number;
  reducido: boolean;
  etiquetaVolver: string;
  onElegir: (b: Baraja) => void;
  onBarajas: () => void;
  onPagar: (origen: string) => void;
  onSalir: () => void;
}) {
  // Sin plan, pasados un par de segundos baja el corte premium (la misma pieza y
  // animación que el final de Inmunología). Al abrirse, la capa vuelve al tope:
  // el primer impulso es bajar a leer el análisis y el corte se abriría fuera
  // de la vista.
  const capaRef = useRef<HTMLDivElement>(null);
  const [corteAbierto, setCorteAbierto] = useState(false);
  useEffect(() => {
    if (!prueba) return;
    if (reducido) { setCorteAbierto(true); return; }
    const t = setTimeout(() => setCorteAbierto(true), ESPERA_CORTE);
    return () => clearTimeout(t);
  }, [prueba, reducido]);
  useEffect(() => {
    if (!corteAbierto || !prueba) return;
    trackEvent('contenido_bloqueado', { origen: 'prueba-examen3d', examKey: EXAM_KEY, plan: prueba.plan });
    const behavior = reducido ? 'auto' : 'smooth';
    capaRef.current?.scrollTo({ top: 0, behavior });
    window.scrollTo({ top: 0, behavior });
  }, [corteAbierto, prueba, reducido]);

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
    <div ref={capaRef} className={s.resultadosCapa}>
      <div className={`${r.resultShell} ${s.resultados}`}>
        {prueba && (
          <div className={`${r.corteWrap} ${corteAbierto ? r.corteWrapAbierto : ''}`} inert={!corteAbierto}>
            <div className={r.corteWrapInner}>
              <CortePremium
                plan={prueba.plan}
                titulo="Completa el examen"
                acento={`con las ${total} barajas`}
                cuerpo={<>
                  Hiciste la <strong>baraja {baraja.numero}</strong>, una de las {libres} de prueba. Con el plan{' '}
                  {PLANS[prueba.plan].label} se abren <strong>las {total - libres} que faltan</strong>: las{' '}
                  {prueba.preguntas} preguntas del práctico de miembro superior, de lo que salió en los
                  exámenes reales a lo menos probable, y el resumen de cada estructura que falles.
                </>}
                datos={[
                  { icono: 'barajas', num: total - libres, label: 'barajas más' },
                  { icono: 'modelo', num: prueba.estructuras, label: 'estructuras en el modelo 3D' },
                  { icono: 'explicacion', num: prueba.preguntas, label: 'tarjetas de memoria' },
                  { icono: 'resumen', num: prueba.secciones, label: 'secciones de resumen enlazadas' },
                ]}
                isAuthed
                onVer={() => onPagar('corte')}
              />
            </div>
          </div>
        )}

        <NotaFinal score={puntos} total={max} pct={pct} etiqueta="del puntaje" />
        <h2 className={r.resultTitle}>{titulo}</h2>
        <p className={r.resultSub}>Baraja {baraja.numero}. Cada pregunta vale 2 puntos: 1 la A y 1 la B. Tu intento se guardó en este navegador.</p>

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
                  {prueba ? (
                    // Los resúmenes de Locomotor son de pago (la cerradura es /api/resumen):
                    // sin el plan, el enlace llevaría a un velo. Mejor la pasarela aquí.
                    <button type="button" className={`${s.enlaceResumen} ${s.enlaceResumenBloqueado}`} onClick={() => onPagar('resumen')}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2.4" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                      </svg>
                      Abrir el resumen
                    </button>
                  ) : (
                    <a href={p.resumenRelacionado.href} target="_blank" rel="noopener noreferrer" className={s.enlaceResumen}>
                      Abrir el resumen
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Progreso hechas={hechas} total={total} />

        <div className={s.botones}>
          {siguiente && <button type="button" className={s.primario} onClick={() => onElegir(siguiente)}>Siguiente baraja ({siguiente.numero})</button>}
          {!siguiente && prueba && <button type="button" className={s.primario} onClick={() => onPagar('fin-prueba')}>Desbloquear las {total} barajas</button>}
          <button type="button" className={siguiente || prueba ? s.secundario : s.primario} onClick={() => onElegir(baraja)}>Repetir esta baraja</button>
          <button type="button" className={s.secundario} onClick={onBarajas}>Ver todas las barajas</button>
          <button type="button" className={s.secundario} onClick={onSalir}>{etiquetaVolver}</button>
        </div>
      </div>
    </div>
  );
}
