'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import { trackEvent } from '@/lib/analytics';
import { PLANS, planUnlocks, type PlanKey, type ProfilePlan } from '@/lib/plans';
import LockedContent from './LockedContent';
import { usePlan } from './PlanProvider';
import styles from '@/styles/examRunner.module.css';

// El SDK de Mercado Pago pesa: el modal sólo se monta cuando alguien lo abre.
const SubscribeModal = dynamic(() => import('./SubscribeModal'), { ssr: false });

interface ExamOption {
  id: string;
  text: string;
  correct: boolean;
}

interface ExamQuestion {
  id: string;
  stem: string;
  /** URL pública de la micrografía/imagen de referencia (opcional). */
  image?: string;
  imageAlt?: string;
  /** Dimensiones intrínsecas de la imagen (para evitar layout shift). */
  imageW?: number;
  imageH?: number;
  /**
   * Imágenes que acompañan a `image` cuando el enunciado pide ver varias
   * («ver las 2 imágenes»). Van lado a lado, cada una ampliable por separado.
   */
  extraImages?: { src: string; alt?: string; w?: number; h?: number }[];
  options: ExamOption[];
  explanation?: string;
  explanationImage?: string;
  explanationImageAlt?: string;
  explanationImageCaption?: string;
  /**
   * Láminas que acompañan a `explanationImage` cuando la respuesta del PDF trae
   * varias (el repaso de Inmunología 2025 muestra dos en algunas). Van lado a
   * lado como las `extraImages` del enunciado, y el pie es uno para todas.
   */
  explanationExtraImages?: { src: string; alt?: string; w?: number; h?: number }[];
  reviewNote?: string;
  tags?: string[];
  /** La misma pregunta en otra versión; el alumno elige cuál ver con un interruptor. */
  variante?: VariantePregunta;
}

/**
 * Otra versión de la MISMA pregunta: en el Final 2023 de Inmunología, la del
 * apunte (alternativas reconstruidas) y la del examen (las originales). No es
 * una pregunta más: comparte número, rastro y nota, y la respuesta vale en la
 * versión en que se dio. Lo que no declara se hereda de la base —la figura y el
 * enunciado suelen ser los mismos—, salvo `reviewNote`, que es de cada versión:
 * heredar «se reconstruyeron las alternativas» sobre las originales mentiría.
 * Los `id` de sus opciones no pueden repetir los de la base.
 */
interface VariantePregunta {
  /** Rótulo del interruptor para esta versión y para la base. */
  rotulo: string;
  rotuloBase: string;
  stem?: string;
  image?: string;
  imageAlt?: string;
  imageW?: number;
  imageH?: number;
  extraImages?: ExamQuestion['extraImages'];
  options: ExamOption[];
  explanation?: string;
  reviewNote?: string;
}

/** La pregunta tal como se ve en la versión elegida. Conserva `variante` para el interruptor. */
function vistaDe(q: ExamQuestion, enVariante: boolean): ExamQuestion {
  const v = q.variante;
  if (!enVariante || !v) return q;
  return {
    ...q,
    stem: v.stem ?? q.stem,
    image: v.image ?? q.image,
    imageAlt: v.image ? v.imageAlt : q.imageAlt,
    imageW: v.image ? v.imageW : q.imageW,
    imageH: v.image ? v.imageH : q.imageH,
    extraImages: v.image ? v.extraImages : q.extraImages,
    options: v.options,
    explanation: v.explanation ?? q.explanation,
    reviewNote: v.reviewNote,
  };
}

/** ¿`id` es una alternativa correcta? Busca en las dos versiones: vale donde se respondió. */
function esCorrecta(q: ExamQuestion, id: string): boolean {
  return [...q.options, ...(q.variante?.options ?? [])].find(o => o.id === id)?.correct === true;
}

interface ExamPayload {
  version: number;
  key: string;
  title: string;
  /**
   * Minutos **recomendados** para el examen, no un límite: el cronómetro cuenta
   * hacia arriba desde 0 y sólo cambia de color al pasarse. Con `null` el examen
   * no lleva cronómetro (es el caso de los bancos de histología, que se hacen a
   * ritmo libre); con un número, aparece.
   */
  duration_min: number | null;
  questions: ExamQuestion[];
}

interface SignedUrlEntry { url: string; expiresAt: number }

interface Attempt {
  id: string;
  score: number;
  total: number;
  finishedAt: string;
  /** Segundos que duró el intento. Ausente en los intentos guardados antes del cronómetro. */
  seconds?: number;
}

/**
 * Banqueos de pago y aviso de suscripción. Sin él, el examen se comporta como
 * siempre: nada se bloquea ni se anuncia.
 */
export interface SuscripcionExamen {
  /** El plan que abre los banqueos de pago y el que anuncia el aviso. */
  plan: PlanKey;
  /** Plan leído en el servidor. Con `allAccess` el admin nunca ve candados. */
  estado: { plan: ProfilePlan; isActive: boolean; allAccess?: boolean };
  isAuthed: boolean;
  /** Claves (`examKey` o de `groupKeys`) que sólo abre `plan`. */
  etapasDePago?: string[];
  /** Cada cuántas preguntas respondidas aparece el aviso, a quien no tiene `plan`. */
  avisoCada?: number;
}

interface Props {
  examKey: string;
  fallbackTitle?: string;
  /** Si se pasa, el botón "Volver" navega a esa ruta. Si no, queda visible pero no navega. */
  backHref?: string;
  /** Texto del botón "Volver" — por defecto "Volver a la clase". */
  backLabel?: string;
  /**
   * Grupos ADICIONALES de preguntas (B, C, …) además de `examKey` (Grupo A).
   * Cada grupo es independiente: su JSON e imágenes NO tocan la red hasta que el
   * alumno pulsa su cuadro en el selector. Se rotulan por índice (A, B, C, …).
   */
  groupKeys?: string[];
  /**
   * Rótulo de cada etapa, por su clave (la de `examKey` y las de `groupKeys`).
   * Con rótulos, el runner deja de hablar de «Grupo A/B» y pasa a «Banqueo
   * 2024/2020»: cada JSON es el examen de un año, no una partición del mismo.
   * Va por clave y no por posición para que reordenar `groupKeys` nunca pueda
   * cruzar un año con el JSON de otro. Una clave sin rótulo cae en su letra.
   */
  groupLabels?: Record<string, string>;
  /** Nota de un banqueo, por su clave: tooltip de su cuadro y cola del rótulo en la cabecera. */
  groupHints?: Record<string, string>;
  suscripcion?: SuscripcionExamen;
}

const EXPIRY_BUFFER_MS = 15 * 60 * 1000;
const urlCacheKey = (k: string) => `examen-url-${k}`;
const attemptsKey = (k: string) => `medgo:attempts:${k}`;

/** Letras de las alternativas: rotulan los botones y son su atajo de teclado. */
const LETRAS = 'ABCDEFGHIJ';

/**
 * Por encima de este número de preguntas el rastro deja de dibujarse segmento a
 * segmento y vuelve a ser una barra continua: con 100 preguntas cada marca
 * mediría menos de un píxel y dejaría de informar de nada.
 */
const MAX_SEGMENTOS = 60;

/**
 * Fisher-Yates: cada posición recibe un índice al azar entre los que quedan, así
 * que cada orden sale con la misma probabilidad y la correcta cae en cualquier
 * letra por igual. Es lo mismo que `random.shuffle` de Python.
 *
 * Las alternativas se barajan con esto A SECAS, sin descartar ningún orden. Antes
 * se repetía el barajado cuando salía el orden del JSON, y eso filtraba la
 * respuesta: en los banqueos donde la correcta es siempre la primera del PDF
 * (Patología 2020 y 2022), la A pasaba a ser la letra menos probable —en una
 * pregunta de 4 alternativas, 22 % en vez de 25 %— y en una de 2 la correcta
 * salía SIEMPRE en la B.
 */
function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function readUrlCache(k: string): SignedUrlEntry | null {
  try {
    const raw = sessionStorage.getItem(urlCacheKey(k));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SignedUrlEntry;
    if (!parsed.url || typeof parsed.expiresAt !== 'number') return null;
    if (parsed.expiresAt - Date.now() < EXPIRY_BUFFER_MS) return null;
    return parsed;
  } catch { return null; }
}

function writeUrlCache(k: string, entry: SignedUrlEntry) {
  try { sessionStorage.setItem(urlCacheKey(k), JSON.stringify(entry)); } catch {}
}

function loadAttempts(k: string): Attempt[] {
  try {
    const raw = localStorage.getItem(attemptsKey(k));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { attempts?: Attempt[] };
    return parsed.attempts ?? [];
  } catch { return []; }
}

function saveAttempt(k: string, attempt: Attempt) {
  try {
    const prev = loadAttempts(k);
    const next = [attempt, ...prev].slice(0, 20);
    localStorage.setItem(attemptsKey(k), JSON.stringify({ attempts: next }));
  } catch {}
}

async function fetchExam(key: string): Promise<ExamPayload> {
  let entry = readUrlCache(key);
  if (!entry) {
    const r = await fetch(`/api/examen/${key}`);
    if (!r.ok) {
      if (r.status === 401) throw new Error('Necesitas iniciar sesión para ver este examen.');
      if (r.status === 403) throw new Error('Este examen es solo para el plan Interno.');
      if (r.status === 404) throw new Error('Examen no disponible.');
      throw new Error('Error cargando el examen.');
    }
    const data = (await r.json()) as SignedUrlEntry;
    writeUrlCache(key, data);
    entry = data;
  }
  const jsonRes = await fetch(entry.url);
  if (!jsonRes.ok) throw new Error('No se pudo descargar el contenido.');
  return (await jsonRes.json()) as ExamPayload;
}

type Phase = 'running' | 'finished';

const prefiereQuieto = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatoTiempo(seg: number, conHoras: boolean): string {
  const s = Math.max(0, Math.floor(seg));
  const mm = Math.floor(s / 60) % 60;
  const ss = s % 60;
  const dd = (n: number) => String(n).padStart(2, '0');
  if (!conHoras) return `${dd(Math.floor(s / 60))}:${dd(ss)}`;
  return `${Math.floor(s / 3600)}:${dd(mm)}:${dd(ss)}`;
}

/**
 * Cronómetro ascendente **con pausa**. El tiempo de cada tramo sale siempre de
 * la diferencia contra el instante en que ese tramo arrancó —no de sumar 1 en
 * cada tick—, para que no se atrase si la pestaña queda en segundo plano y el
 * navegador estrangula los timers.
 *
 * La pausa cierra el tramo en curso y lo suma a `acumuladoRef`; al reanudar se
 * abre un tramo nuevo. Por eso el total es «acumulado + tramo abierto», y el
 * tiempo en pausa no entra en la cuenta ni en el intento que se guarda.
 *
 * `reinicio` es la identidad del intento (grupo + reintento): al cambiar, el
 * cronómetro vuelve a cero; mientras no cambie, pasar de pregunta no lo toca.
 */
function useCronometro(activo: boolean, reinicio: string) {
  const [segundos, setSegundos] = useState(0);
  const inicioRef = useRef<number | null>(null);
  const acumuladoRef = useRef(0);

  useEffect(() => {
    inicioRef.current = null;
    acumuladoRef.current = 0;
    setSegundos(0);
  }, [reinicio]);

  useEffect(() => {
    if (!activo) {
      // Cierra el tramo abierto (pausa, fin del examen o desmontaje lógico).
      if (inicioRef.current !== null) {
        acumuladoRef.current += Date.now() - inicioRef.current;
        inicioRef.current = null;
        setSegundos(Math.floor(acumuladoRef.current / 1000));
      }
      return;
    }
    inicioRef.current = Date.now();
    const tick = () => {
      const abierto = inicioRef.current === null ? 0 : Date.now() - inicioRef.current;
      setSegundos(Math.floor((acumuladoRef.current + abierto) / 1000));
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [activo, reinicio]);

  return segundos;
}

/** Cuenta de 0 a `objetivo` para la nota final. Sin animación si el sistema la desactiva. */
function useConteo(objetivo: number, ms = 900) {
  // Arranca ya en el valor final si no va a haber animación; si arrancara en 0
  // se vería un cero durante un frame. (No hay riesgo de desajuste con el HTML
  // del servidor: la nota sólo se monta al terminar el examen.)
  const [valor, setValor] = useState(() => (prefiereQuieto() ? objetivo : 0));

  useEffect(() => {
    if (prefiereQuieto() || objetivo <= 0) {
      setValor(objetivo);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const paso = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      // easeOutCubic: arranca rápido y frena, como un contador que se asienta.
      setValor(objetivo * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [objetivo, ms]);

  return valor;
}

/* ── Iconos ────────────────────────────────────────────────────────────────
   SVG inline con `currentColor`: heredan el color del bloque y se adaptan a
   claro/oscuro sin duplicar reglas. */

function IconoPausa() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6.5" y="5" width="4" height="14" rx="1.4" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.4" />
    </svg>
  );
}

function IconoPlay() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.2c0-.9 1-1.5 1.8-1l9 6.3c.7.5.7 1.5 0 2l-9 6.3c-.8.5-1.8-.1-1.8-1V5.2Z" />
    </svg>
  );
}

function IconoReloj({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 7v5l3.2 1.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoLupa() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.4" stroke="currentColor" strokeWidth="2" />
      <path d="M15.8 15.8 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M11 8.6v4.8M8.6 11h4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconoCheck() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m5 12.5 4.6 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconoCruz() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

function IconoAviso() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4.6 21 20H3l9-15.4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.05" fill="currentColor" />
    </svg>
  );
}

function IconoIdea() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.2a6 6 0 0 0-3.4 10.9c.6.4.9 1 .9 1.7v.4h5v-.4c0-.7.3-1.3.9-1.7A6 6 0 0 0 12 3.2Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path d="M10 19.2h4M10.6 21.2h2.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function IconoCerrar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/** El mismo candado que la rejilla de cursos y el sílabo. */
function IconoCandado({ size = 11 }: { size?: number }) {
  return (
    <svg className={styles.candado} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2.4" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* ── Suscripción ──────────────────────────────────────────────────────────── */

/**
 * Aviso entre pregunta y pregunta. Es una pausa, no un muro: se cierra con la X
 * y la pregunta sigue debajo, sin perder ni el tiempo ni la respuesta.
 */
function AvisoSuscripcion({
  plan,
  dePago,
  onVer,
  onCerrar,
}: {
  plan: PlanKey;
  /** Nombres de los banqueos que abre el plan («Banqueo 2020»). */
  dePago: string[];
  onVer: () => void;
  onCerrar: () => void;
}) {
  const p = PLANS[plan];
  return (
    <aside className={styles.aviso} aria-label={`Suscríbete al plan ${p.label}`}>
      <span className={styles.avisoIcono}>
        <IconoCandado size={18} />
      </span>
      <div className={styles.avisoTexto}>
        <p className={styles.avisoTitulo}>¿Te está sirviendo el banqueo?</p>
        <p className={styles.avisoCuerpo}>
          Con el plan <strong>{p.label}</strong> (S/ {p.amount.toFixed(2)} / {p.durationDays === 30 ? 'mes' : 'año'})
          desbloqueas {dePago.length > 0 && <><strong>el {dePago.join(' y el ')}</strong> y </>}
          {p.track === 'basico' ? 'los cursos del ciclo básico' : 'los cursos de la Facultad de Medicina'}.
        </p>
      </div>
      <button type="button" className={styles.avisoCta} onClick={onVer}>
        Ver plan {p.label}
      </button>
      <button type="button" className={styles.avisoCerrar} onClick={onCerrar} aria-label="Cerrar aviso">
        <IconoCerrar />
      </button>
    </aside>
  );
}

/**
 * Envuelve el cuerpo de un banqueo de pago en el paywall. La decisión final la
 * toma LockedContent, que también mira el plan vivo y mantiene el recibo a la
 * vista tras pagar: si la tomara el runner, el modal se desmontaría en cuanto el
 * plan cambiase, a mitad del recibo.
 */
function PuertaDePago({
  activa,
  suscripcion,
  nombre,
  children,
}: {
  activa: boolean;
  suscripcion?: SuscripcionExamen;
  nombre: string;
  children: React.ReactNode;
}) {
  if (!activa || !suscripcion) return <>{children}</>;
  const p = PLANS[suscripcion.plan];
  return (
    <LockedContent
      requiredPlan={suscripcion.plan}
      planState={suscripcion.estado}
      isAuthed={suscripcion.isAuthed}
      preview={false}
      titulo={`${nombre} bloqueado`}
      descripcion={
        <>
          El <strong>{nombre}</strong> es parte del plan <strong>{p.label}</strong>, junto con el resto de{' '}
          {p.track === 'basico' ? 'los cursos del ciclo básico' : 'los cursos de la Facultad de Medicina'}.
          Los demás banqueos de este examen siguen abiertos.
        </>
      }
    >
      {children}
    </LockedContent>
  );
}

/* ── Visor de imagen a pantalla completa ──────────────────────────────────── */

interface Ampliada {
  src: string;
  alt: string;
  w: number;
  h: number;
}

const ESC_MIN = 1;
const ESC_MAX = 5;

/**
 * Lightbox de las micrografías. Va por **portal a `<body>`**: el examen vive
 * dentro de `.microPage`, que lleva `overflow: hidden`, y montarlo ahí dentro
 * dejaría el visor recortado por la caja del panel.
 *
 * La cáscara es oscura en los dos temas, igual que el visor de PDF: lo que se
 * mira es una micrografía, y un marco claro alrededor le roba contraste.
 */
function VisorImagen({ img, onClose }: { img: Ampliada; onClose: () => void }) {
  const [destino, setDestino] = useState<HTMLElement | null>(null);
  const [escala, setEscala] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [arrastrando, setArrastrando] = useState(false);
  const capaRef = useRef<HTMLDivElement>(null);
  const escalaRef = useRef(1);
  const gestoRef = useRef<{ px: number; py: number; x: number; y: number } | null>(null);

  useEffect(() => { setDestino(document.body); }, []);

  const aplicarEscala = useCallback((n: number) => {
    const v = Math.min(ESC_MAX, Math.max(ESC_MIN, n));
    escalaRef.current = v;
    setEscala(v);
    // A tamaño natural la imagen vuelve al centro: si no, quedaría desplazada
    // fuera del cuadro sin forma de recuperarla salvo volviendo a ampliar.
    if (v === 1) setPos({ x: 0, y: 0 });
  }, []);

  // Esc cierra · +/− amplían · el scroll de la página se bloquea mientras dure.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key === '+' || e.key === '=') aplicarEscala(escalaRef.current * 1.25);
      if (e.key === '-' || e.key === '_') aplicarEscala(escalaRef.current / 1.25);
      if (e.key === '0') aplicarEscala(1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, aplicarEscala]);

  // La rueda se registra a mano con `passive: false`: React adjunta `onWheel`
  // al root como pasivo y ahí `preventDefault()` no surte efecto.
  useEffect(() => {
    const el = capaRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      aplicarEscala(escalaRef.current * (e.deltaY > 0 ? 0.88 : 1.14));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [aplicarEscala]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (escalaRef.current <= 1) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    gestoRef.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y };
    setArrastrando(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const g = gestoRef.current;
    if (!g) return;
    setPos({ x: g.x + (e.clientX - g.px), y: g.y + (e.clientY - g.py) });
  };

  const soltar = () => {
    gestoRef.current = null;
    setArrastrando(false);
  };

  if (!destino) return null;

  const visor = (
    <div
      className={styles.lbCapa}
      ref={capaRef}
      role="dialog"
      aria-modal="true"
      aria-label="Imagen ampliada"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.lbBarra}>
        <div className={styles.lbZoom}>
          <button
            type="button"
            className={styles.lbBtn}
            onClick={() => aplicarEscala(escala / 1.25)}
            disabled={escala <= ESC_MIN}
            aria-label="Reducir"
          >
            −
          </button>
          <button
            type="button"
            className={styles.lbPct}
            onClick={() => aplicarEscala(1)}
            aria-label="Tamaño original"
          >
            {Math.round(escala * 100)}%
          </button>
          <button
            type="button"
            className={styles.lbBtn}
            onClick={() => aplicarEscala(escala * 1.25)}
            disabled={escala >= ESC_MAX}
            aria-label="Ampliar"
          >
            +
          </button>
        </div>
        <button type="button" className={styles.lbCerrar} onClick={onClose} aria-label="Cerrar imagen">
          <IconoCerrar />
        </button>
      </div>

      <div
        className={`${styles.lbLienzo} ${escala > 1 ? styles.lbLienzoMovible : ''} ${arrastrando ? styles.lbLienzoArrastrando : ''}`}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${escala})` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onDoubleClick={() => aplicarEscala(escala > 1 ? 1 : 2)}
      >
        <Image
          src={img.src}
          alt={img.alt}
          width={img.w}
          height={img.h}
          sizes="96vw"
          className={styles.lbImg}
          priority
          draggable={false}
        />
      </div>

      <p className={styles.lbPie}>
        Rueda o <kbd>+</kbd> <kbd>−</kbd> para acercar · doble clic alterna · arrastra para mover ·{' '}
        <kbd>Esc</kbd> cierra
      </p>
    </div>
  );

  return createPortal(visor, destino);
}

/** `sizes` de una figura sola (a todo el bloque) y de las que van de a dos por fila. */
const SIZES_UNA = '(max-width: 600px) 100vw, 620px';
const SIZES_PAR = '(max-width: 600px) 100vw, 310px';

/** Todas las imágenes del enunciado, en orden: `image` primero y luego `extraImages`. */
function figurasDe(q: ExamQuestion): Ampliada[] {
  if (!q.image) return [];
  return [
    { src: q.image, alt: q.imageAlt ?? 'Imagen de la pregunta', w: q.imageW ?? 1000, h: q.imageH ?? 750 },
    ...(q.extraImages ?? []).map((x, i) => ({
      src: x.src,
      alt: x.alt ?? `Imagen ${i + 2} de la pregunta`,
      w: x.w ?? 1000,
      h: x.h ?? 750,
    })),
  ];
}

/** Las láminas de la explicación, en orden: `explanationImage` y luego las extra. */
function figurasExplicacionDe(q: ExamQuestion): Ampliada[] {
  if (!q.explanationImage) return [];
  return [
    { src: q.explanationImage, alt: q.explanationImageAlt ?? 'Imagen de referencia', w: 800, h: 600 },
    ...(q.explanationExtraImages ?? []).map((x, i) => ({
      src: x.src,
      alt: x.alt ?? `Imagen de referencia ${i + 2}`,
      w: x.w ?? 800,
      h: x.h ?? 600,
    })),
  ];
}

/** Figura ampliable: la imagen es el botón, con su chip «Ampliar» en la esquina. */
function FiguraAmpliable({
  src,
  alt,
  w,
  h,
  onAmpliar,
  variante = 'pregunta',
  sizes = SIZES_UNA,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  onAmpliar: (img: Ampliada) => void;
  variante?: 'pregunta' | 'explicacion';
  sizes?: string;
}) {
  return (
    <button
      type="button"
      className={`${styles.figura} ${variante === 'explicacion' ? styles.figuraExplicacion : ''}`}
      onClick={() => onAmpliar({ src, alt, w, h })}
      aria-label="Ampliar imagen"
    >
      {/* next/image: srcset + AVIF/WebP redimensionado al ancho real del
          dispositivo (vía `sizes`), para que el móvil no descargue la
          micrografía a tamaño completo. */}
      <Image
        src={src}
        alt={alt}
        width={w}
        height={h}
        sizes={sizes}
        className={styles.figuraImg}
      />
      <span className={styles.figuraChip}>
        <IconoLupa />
        Ampliar
      </span>
    </button>
  );
}

/**
 * Interruptor entre las dos versiones de una pregunta con `variante`. Un par de
 * botones con un pulgar que se desliza, no una alternativa más: cambiar de
 * versión no suma ni resta nada.
 */
function SelectorVersion({
  rotulos,
  enVariante,
  onCambiar,
  respondidaEnOtra,
}: {
  rotulos: [string, string];
  enVariante: boolean;
  onCambiar: (enVariante: boolean) => void;
  respondidaEnOtra: boolean;
}) {
  return (
    <div className={styles.versiones}>
      <div
        className={styles.versionesPista}
        data-lado={enVariante ? 'variante' : 'base'}
        role="group"
        aria-label="Versión de la pregunta"
      >
        {rotulos.map((r, i) => {
          const activa = (i === 1) === enVariante;
          return (
            <button
              key={r}
              type="button"
              className={`${styles.versionBtn} ${activa ? styles.versionBtnActiva : ''}`}
              aria-pressed={activa}
              onClick={() => onCambiar(i === 1)}
            >
              {r}
            </button>
          );
        })}
      </div>
      <span className={styles.versionesNota}>
        {respondidaEnOtra
          ? 'La respondiste en la otra versión: aquí sólo ves su clave.'
          : 'Misma pregunta, otras alternativas · cuenta una sola vez'}
      </span>
    </div>
  );
}

/** Rastro del examen: una marca por pregunta, pintada según cómo fue. */
type MarcaRastro = 'pendiente' | 'actual' | 'ok' | 'mal';

function Rastro({ marcas, final = false }: { marcas: MarcaRastro[]; final?: boolean }) {
  const claseDe = (m: MarcaRastro) =>
    m === 'ok' ? styles.segOk
      : m === 'mal' ? styles.segMal
      : m === 'actual' ? styles.segActual
      : styles.segPendiente;

  return (
    <div className={`${styles.rastro} ${final ? styles.rastroFinal : ''}`} aria-hidden>
      {marcas.map((m, i) => (
        <span key={i} className={`${styles.seg} ${claseDe(m)}`} style={{ '--i': i } as React.CSSProperties} />
      ))}
    </div>
  );
}

/**
 * Nota final: aro que se dibuja hasta el porcentaje obtenido, con el mismo
 * valor animado alimentando la cifra — así el número y el arco nunca se
 * desincronizan. Va en su propio componente porque el bloque de resultados es
 * una IIFE dentro del JSX y ahí no se pueden llamar hooks.
 */
function NotaFinal({ score, total, pct }: { score: number; total: number; pct: number }) {
  const avance = useConteo(score);
  const vistos = Math.round(avance);
  const fraccion = total > 0 ? avance / total : 0;
  const R = 68;
  const C = 2 * Math.PI * R;
  const tono = pct >= 80 ? '#2EA057' : pct >= 60 ? '#7B72D4' : pct >= 40 ? '#E0932A' : '#D64045';

  return (
    <div className={styles.notaWrap} style={{ '--tono': tono } as React.CSSProperties}>
      <svg className={styles.notaAro} viewBox="0 0 160 160" aria-hidden>
        <circle className={styles.notaPista} cx="80" cy="80" r={R} />
        <circle
          className={styles.notaValor}
          cx="80"
          cy="80"
          r={R}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - fraccion)}
        />
      </svg>
      <div className={styles.notaCentro}>
        <span className={styles.notaNum}>
          {vistos}
          <span className={styles.notaTotal}>/{total}</span>
        </span>
        <span className={styles.notaPct}>{pct}% correcto</span>
      </div>
    </div>
  );
}

export default function ExamRunner({
  examKey,
  fallbackTitle,
  backHref,
  backLabel = 'Volver a la clase',
  groupKeys,
  groupLabels,
  groupHints,
  suscripcion,
}: Props) {
  // Etapas: Grupo A (examKey) + grupos adicionales. Sin extras → examen simple.
  const stages = useMemo(
    () => [examKey, ...(groupKeys ?? [])].map((key, i) => ({
      key,
      rotulo: groupLabels?.[key] ?? String.fromCharCode(65 + i),
      nota: groupHints?.[key],
    })),
    [examKey, groupKeys, groupLabels, groupHints],
  );
  const isGrouped = stages.length > 1;
  // Banqueos de años distintos (con rótulo) o grupos de un mismo examen (letra).
  // Con rótulo, el año se enseña aunque sea el único banqueo: saber de qué año
  // es el examen que estás haciendo informa por sí solo.
  const conRotulos = stages.some(s => groupLabels?.[s.key]);
  const nombreEtapa = (i: number) => `${conRotulos ? 'Banqueo' : 'Grupo'} ${stages[i].rotulo}`;
  const mostrarEtapa = isGrouped || conRotulos;

  // Plan del servidor o plan vivo del Provider: basta con que uno abra, igual que
  // en LockedContent. El vivo es el que cambia sin recargar tras pagar en el modal.
  const planVivo = usePlan();
  const acceso = !suscripcion
    || !!suscripcion.estado.allAccess
    || (suscripcion.estado.isActive && planUnlocks(suscripcion.estado.plan, suscripcion.plan))
    || (planVivo.isActive && planUnlocks(planVivo.plan, suscripcion.plan));
  const esDePago = (key: string) => !!suscripcion?.etapasDePago?.includes(key);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [stage, setStage] = useState(0);
  const [payload, setPayload] = useState<ExamPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  // Respuestas acumuladas a lo largo de TODAS las etapas resueltas.
  const [answersAll, setAnswersAll] = useState<{ q: string; a: string; ok: boolean }[]>([]);
  const [phase, setPhase] = useState<Phase>('running');
  const [pausado, setPausado] = useState(false);
  const [ampliada, setAmpliada] = useState<Ampliada | null>(null);
  // Versión que se ve de la pregunta actual, en las que traen `variante`. Vuelve
  // a la base al pasar de pregunta: es una elección sobre ESTA pregunta.
  const [enVariante, setEnVariante] = useState(false);

  const stageKey = stages[stage].key;
  // Un banqueo de pago sin plan no se pide: la route respondería 403, y lo que
  // toca enseñar es la tarjeta de suscripción, no un error.
  const bloqueada = esDePago(stageKey) && !acceso;
  const shellRef = useRef<HTMLDivElement>(null);

  // Identidad del intento: cambiar de grupo o reintentar arranca un cronómetro
  // nuevo; avanzar de pregunta, no.
  const intentoId = `${stage}-${runId}`;

  // Aviso de suscripción: aparece al entrar en la pregunta que sigue a cada
  // tanda de `avisoCada` respondidas (la 8, la 15…) y se va al avanzar o al
  // cerrarlo. Se recuerda qué tanda se cerró, por intento, para que reintentar
  // no lo deje apagado para siempre.
  const [avisoCerrado, setAvisoCerrado] = useState<string | null>(null);
  const avisoCada = suscripcion?.avisoCada ?? 0;
  const respondidas = answersAll.length;
  const idAviso = `${intentoId}:${respondidas}`;
  const mostrarAviso = avisoCada > 0 && !acceso && phase === 'running'
    && respondidas > 0 && respondidas % avisoCada === 0 && currentIdx === respondidas
    && avisoCerrado !== idAviso;

  // Carga de la etapa actual. El Grupo B solo se pide cuando `stage` pasa a 1.
  useEffect(() => {
    let cancelled = false;
    setError(null);
    setPayload(null);
    if (bloqueada) return;

    (async () => {
      try {
        const json = await fetchExam(stageKey);
        if (cancelled) return;
        setPayload(json);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Error desconocido.');
      }
    })();

    return () => { cancelled = true; };
  }, [stageKey, runId, bloqueada]);

  // Shuffle de preguntas + opciones (re-corre al cambiar de etapa o reintentar).
  const deck = useMemo(() => {
    if (!payload) return null;
    return shuffle(payload.questions).map(q => ({
      ...q,
      options: shuffle(q.options),
      ...(q.variante ? { variante: { ...q.variante, options: shuffle(q.variante.options) } } : {}),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, runId, stage]);

  // `base` es la pregunta con sus dos versiones; `current`, la que se ve. La
  // corrección va siempre contra `base`: la respuesta puede ser de la otra.
  const base = deck?.[currentIdx];
  const current = base ? vistaDe(base, enVariante) : undefined;
  const total = deck?.length ?? 0;

  const aciertoActual = picked && base ? esCorrecta(base, picked) : null;

  // Rastro: una marca por pregunta. La actual ya se pinta con su resultado en
  // cuanto el alumno responde, sin esperar a que pulse «Siguiente».
  const marcas: MarcaRastro[] = useMemo(() => {
    return Array.from({ length: total }, (_, i) => {
      if (i < answersAll.length) return answersAll[i].ok ? 'ok' : 'mal';
      if (i === currentIdx) {
        if (aciertoActual === null) return 'actual';
        return aciertoActual ? 'ok' : 'mal';
      }
      return 'pendiente';
    });
  }, [total, answersAll, currentIdx, aciertoActual]);

  const progressPct = total > 0
    ? Math.round(((currentIdx + (picked ? 1 : 0)) / total) * 100)
    : 0;

  // ── Cronómetro ───────────────────────────────────────────────────────────
  // Sube desde 0 y se pinta azul mientras quepa en el tiempo recomendado que
  // declara el examen; al pasarse vira a rojo. No corta nada: es un aviso, no
  // un límite, porque el banco se usa también para estudiar sin prisa. Se puede
  // pausar: el tiempo detenido no cuenta ni para el aro ni para el intento.
  const recomendadoSeg = (payload?.duration_min ?? 0) * 60;
  const conCronometro = recomendadoSeg > 0;
  const segundos = useCronometro(
    conCronometro && phase === 'running' && !!payload && !pausado,
    intentoId,
  );
  const excedido = conCronometro && segundos > recomendadoSeg;
  const conHoras = recomendadoSeg >= 3600;
  // Fracción recorrida del tiempo recomendado; alimenta el aro del reloj.
  const pctTiempo = conCronometro ? Math.min(1, segundos / recomendadoSeg) : 0;

  // Al pasar de pregunta, volver al enunciado: con micrografía y cinco
  // alternativas, la siguiente empieza fuera de la pantalla.
  //
  // Se mueve la VENTANA, no `scrollIntoView`: el examen vive dentro de
  // `.microPage`, que lleva `overflow: hidden`, y el navegador también
  // desplazaría ese contenedor —recortando el contenido dentro de su caja—.
  useEffect(() => {
    if (currentIdx === 0) return;
    const rect = shellRef.current?.getBoundingClientRect();
    if (!rect || rect.top > -8) return; // ya se ve el inicio: no hay nada que mover
    window.scrollTo({
      top: rect.top + window.scrollY - 12,
      behavior: prefiereQuieto() ? 'auto' : 'smooth',
    });
  }, [currentIdx]);

  // La imagen ampliada se cierra sola al cambiar de pregunta, de grupo o al
  // reintentar: si no, quedaría abierta sobre una pregunta que ya no es la suya.
  useEffect(() => { setAmpliada(null); }, [currentIdx, stage, runId, enVariante]);

  const handlePick = (id: string) => {
    if (picked || pausado) return;
    setPicked(id);
  };

  const handleNext = () => {
    if (!base || !picked || pausado) return;
    const ok = esCorrecta(base, picked);
    const nextAll = [...answersAll, { q: base.id, a: picked, ok }];
    setAnswersAll(nextAll);
    setPicked(null);
    setEnVariante(false);

    if (currentIdx + 1 >= total) {
      // Grupo terminado: cada grupo se califica de forma independiente.
      const score = nextAll.filter(a => a.ok).length;
      saveAttempt(stageKey, {
        id: `att-${Date.now()}`,
        score,
        total: nextAll.length,
        finishedAt: new Date().toISOString(),
        ...(conCronometro ? { seconds: segundos } : {}),
      });
      trackEvent('examen_completado', { examKey: stageKey, score, total: nextAll.length });
      setPhase('finished');
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  // Atajos de teclado: A–E (o 1–5) responden y Enter avanza. En un banco de 40
  // preguntas ahorra el viaje al ratón en cada una. Las acciones viven en una
  // ref para que el listener no se vuelva a montar en cada render.
  const accionesRef = useRef({ handlePick, handleNext });
  useEffect(() => { accionesRef.current = { handlePick, handleNext }; });

  useEffect(() => {
    if (phase !== 'running' || !current || pausado || ampliada || modalAbierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Enter') {
        // Enter sobre un botón o enlace enfocado ya dispara su propio click:
        // atenderlo también aquí avanzaría dos preguntas de una.
        if (tag === 'BUTTON' || tag === 'A') return;
        if (picked) { e.preventDefault(); accionesRef.current.handleNext(); }
        return;
      }
      if (picked) return; // ya respondida: las letras no cambian nada
      const k = e.key.toUpperCase();
      const porLetra = LETRAS.indexOf(k);
      const porNumero = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : -1;
      const idx = porLetra >= 0 ? porLetra : porNumero;
      if (idx < 0 || idx >= current.options.length) return;
      e.preventDefault();
      accionesRef.current.handlePick(current.options[idx].id);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [phase, current, picked, pausado, ampliada, modalAbierto]);

  // Salto directo a un grupo desde el selector (o desde la pantalla de
  // resultados). Reinicia el estado: cada grupo es un intento independiente.
  const handleSwitchStage = (i: number) => {
    if (i === stage && phase === 'running') return;
    setStage(i);
    setCurrentIdx(0);
    setPicked(null);
    setEnVariante(false);
    setAnswersAll([]);
    setPhase('running');
    setPausado(false);
  };

  const handleRetry = () => {
    // Reintenta el grupo actual (no vuelve al Grupo A).
    setRunId(r => r + 1);
    setCurrentIdx(0);
    setPicked(null);
    setEnVariante(false);
    setAnswersAll([]);
    setPhase('running');
    setPausado(false);
  };

  const title = payload?.title ?? fallbackTitle ?? 'Examen';

  return (
    <div className={styles.shell} ref={shellRef}>
      <div className={styles.barraSuperior}>
        {backHref ? (
          <Link href={backHref} className={styles.backLink}>
            <span aria-hidden>←</span> {backLabel}
          </Link>
        ) : <span />}

        {isGrouped && phase !== 'finished' && (
          <div className={styles.groupSelector}>
            <span className={styles.groupSelectorLabel}>{conRotulos ? 'Banqueo' : 'Examen'}</span>
            <div className={styles.groupSquares}>
              {stages.map((s, i) => (
                <button
                  key={s.key}
                  type="button"
                  className={`${styles.groupSquare} ${i === stage ? styles.groupSquareActive : ''}`}
                  onClick={() => handleSwitchStage(i)}
                  aria-pressed={i === stage}
                  aria-label={`Ir al ${nombreEtapa(i)}${s.nota ? ` · ${s.nota}` : ''}${esDePago(s.key) && !acceso ? ` (requiere plan ${PLANS[suscripcion!.plan].label})` : ''}`}
                >
                  {s.rotulo}
                  {esDePago(s.key) && !acceso && <IconoCandado />}
                  {s.nota && <span className={styles.groupTooltip} aria-hidden>{s.nota}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <header className={styles.header}>
        <span className={styles.eyebrow}>Banco de preguntas</span>
        <h1 className={styles.title}>{title}</h1>
        {payload && phase === 'running' && (
          <div className={styles.metaLine}>
            {mostrarEtapa && (
              <span>{nombreEtapa(stage)}{stages[stage].nota && ` · ${stages[stage].nota}`}</span>
            )}
            <span>{total} preguntas</span>
            <span>
              {payload.duration_min
                ? `${payload.duration_min} min recomendados`
                : 'Sin tiempo límite'}
            </span>
            <span>Preguntas y alternativas aleatorizadas</span>
          </div>
        )}
        {payload && phase === 'running' && isGrouped && (
          <p className={styles.partHint}>
            {conRotulos ? (
              <>Este examen tiene <strong>{stages.length} banqueos {stages.some(s => s.nota) ? 'distintos' : 'de años distintos'}</strong>, cada uno con su propia nota.</>
            ) : (
              <>Este examen tiene <strong>{stages.length} grupos independientes</strong>.</>
            )}{' '}
            Estás en el <strong>{nombreEtapa(stage)}</strong>; usa los cuadros{' '}
            <strong>{stages.map(s => s.rotulo).join(' / ')}</strong> de arriba a la
            derecha para cambiar de {conRotulos ? 'banqueo' : 'grupo'} cuando quieras.
          </p>
        )}
      </header>

      <PuertaDePago activa={esDePago(stageKey)} suscripcion={suscripcion} nombre={nombreEtapa(stage)}>
      {error && (
        <div className={styles.errorBlock}>{error}</div>
      )}

      {!error && !payload && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          {stage > 0 ? `Cargando ${nombreEtapa(stage)}…` : 'Cargando examen…'}
        </div>
      )}

      {!error && payload && phase === 'running' && current && (
        <>
          {/* Precarga: monta TODAS las micrografías de la etapa al entrar
              (eager, oculto, mismo `src`/`sizes` que la figura visible) para que
              pasar de pregunta a pregunta sea instantáneo en vez de cargar 1×1.
              El navegador descarga la misma variante optimizada → cache hit. */}
          {deck && (
            <div aria-hidden className={styles.preloadLayer}>
              {deck.flatMap(q => {
                // La variante sólo trae figuras propias si declara `image`. Cada
                // juego lleva el `sizes` con el que se pinta, o no habría cache hit.
                const juegos = [figurasDe(q), q.variante?.image ? figurasDe(vistaDe(q, true)) : []];
                return juegos.flatMap((figuras, j) => figuras.map((f, i) => (
                  <Image
                    key={`${q.id}-${j}-${i}`}
                    src={f.src}
                    alt=""
                    width={f.w}
                    height={f.h}
                    sizes={figuras.length > 1 ? SIZES_PAR : SIZES_UNA}
                    loading="eager"
                  />
                )));
              })}
            </div>
          )}

          {/* ── Mando: contador · rastro · cronómetro ─────────────────────── */}
          <div className={styles.mando}>
            <div className={styles.contador}>
              <span className={styles.contadorNum}>
                {String(currentIdx + 1).padStart(2, '0')}
              </span>
              <span className={styles.contadorTotal}>/{String(total).padStart(2, '0')}</span>
            </div>

            <div className={styles.mandoCentro}>
              {total <= MAX_SEGMENTOS ? (
                <Rastro marcas={marcas} />
              ) : (
                <div className={styles.rastroBarra}>
                  <div className={styles.rastroBarraFill} style={{ width: `${progressPct}%` }} />
                </div>
              )}
              <span className={styles.mandoPie}>
                {mostrarEtapa && <>{nombreEtapa(stage)} · </>}
                {answersAll.filter(a => a.ok).length} correctas de {answersAll.length} respondidas
              </span>
            </div>

            {conCronometro && (
              <div
                className={`${styles.crono} ${excedido ? styles.cronoExcedido : ''} ${pausado ? styles.cronoPausado : ''}`}
                role="timer"
                aria-live="off"
              >
                {/* El aro se llena con el tiempo recomendado; al completarse, el
                    bloque entero vira a rojo y el aro deja de crecer. El centro
                    es el botón de pausa: el icono dice siempre qué va a pasar
                    al pulsarlo. */}
                <button
                  type="button"
                  className={styles.cronoBoton}
                  style={{ '--p': `${pctTiempo * 360}deg` } as React.CSSProperties}
                  onClick={() => setPausado(p => !p)}
                  aria-label={pausado ? 'Reanudar el cronómetro' : 'Pausar el cronómetro'}
                  title={pausado ? 'Reanudar' : 'Pausar'}
                >
                  <span className={styles.cronoBotonCentro}>
                    {pausado ? <IconoPlay /> : <IconoPausa />}
                  </span>
                </button>
                <span className={styles.cronoTextos}>
                  <span className={styles.cronoTiempo}>{formatoTiempo(segundos, conHoras)}</span>
                  <span className={styles.cronoRef}>
                    {pausado
                      ? 'En pausa · toca para seguir'
                      : excedido
                        ? `Pasaste los ${formatoTiempo(recomendadoSeg, conHoras)} recomendados`
                        : `de ${formatoTiempo(recomendadoSeg, conHoras)} recomendados`}
                  </span>
                </span>
              </div>
            )}
          </div>

          {pausado ? (
            /* Con el reloj parado se retira la pregunta: si siguiera a la vista,
               pausar sería la forma cómoda de pensar sin que corra el tiempo. */
            <div className={styles.pausa}>
              <span className={styles.pausaAro}>
                <IconoPausa />
              </span>
              <h2 className={styles.pausaTitulo}>Examen en pausa</h2>
              <p className={styles.pausaTexto}>
                El cronómetro está detenido en <strong>{formatoTiempo(segundos, conHoras)}</strong>.
                La pregunta {currentIdx + 1} vuelve en cuanto reanudes.
              </p>
              <button type="button" className={styles.primaryBtn} onClick={() => setPausado(false)}>
                Reanudar examen
              </button>
            </div>
          ) : (
            <>
              {mostrarAviso && suscripcion && (
                <AvisoSuscripcion
                  plan={suscripcion.plan}
                  dePago={stages.flatMap((st, i) => (esDePago(st.key) ? [nombreEtapa(i)] : []))}
                  onVer={() => {
                    if (suscripcion.isAuthed) setModalAbierto(true);
                    else window.location.href = '/auth/login?next=' + encodeURIComponent(window.location.pathname);
                  }}
                  onCerrar={() => setAvisoCerrado(idAviso)}
                />
              )}

              {/* `key` remonta el bloque en cada pregunta, así su animación de
                  entrada se repite en vez de correr sólo la primera vez. */}
              {/* Cambiar de versión también remonta el bloque: la entrada se
                  repite y deja claro que lo de abajo es otro juego de alternativas. */}
              <article className={styles.pregunta} key={`${intentoId}-${currentIdx}${enVariante ? '-v' : ''}`}>
                <div className={styles.preguntaIndice} aria-hidden>
                  <span className={styles.preguntaNum}>{String(currentIdx + 1).padStart(2, '0')}</span>
                  <span className={styles.preguntaFilete} />
                </div>

                <div className={styles.preguntaCuerpo}>
                  {base?.variante && (
                    <SelectorVersion
                      rotulos={[base.variante.rotuloBase, base.variante.rotulo]}
                      enVariante={enVariante}
                      onCambiar={setEnVariante}
                      // Respondida en la otra versión: ésta sólo enseña su clave.
                      respondidaEnOtra={!!picked && !current.options.some(o => o.id === picked)}
                    />
                  )}

                  {current.reviewNote && (
                    <div className={styles.reviewBadge}>
                      <IconoAviso />
                      Pendiente a revisión
                      <span className={styles.reviewTooltip}>{current.reviewNote}</span>
                    </div>
                  )}

                  <p className={styles.stem}>{current.stem}</p>

                  {(() => {
                    const figuras = figurasDe(current);
                    if (figuras.length === 0) return null;
                    const lista = figuras.map(f => (
                      <FiguraAmpliable
                        key={f.src}
                        {...f}
                        sizes={figuras.length > 1 ? SIZES_PAR : SIZES_UNA}
                        onAmpliar={setAmpliada}
                      />
                    ));
                    return figuras.length > 1 ? <div className={styles.figuras}>{lista}</div> : lista;
                  })()}

                  <div className={styles.opciones}>
                    {current.options.map((opt, i) => {
                      const isPicked = picked === opt.id;
                      const showFeedback = picked !== null;
                      const cls = [styles.opcion];
                      if (showFeedback) {
                        if (opt.correct) cls.push(styles.opcionOk);
                        else if (isPicked) cls.push(styles.opcionMal);
                        else cls.push(styles.opcionApagada);
                      }
                      const label = LETRAS[i] ?? String(i + 1);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className={cls.join(' ')}
                          style={{ '--i': i } as React.CSSProperties}
                          onClick={() => handlePick(opt.id)}
                          disabled={showFeedback}
                        >
                          <span className={styles.opcionLetra}>{label}</span>
                          <span className={styles.opcionTexto}>{opt.text}</span>
                          {showFeedback && opt.correct && (
                            <span className={`${styles.opcionMarca} ${styles.marcaOk}`}><IconoCheck /></span>
                          )}
                          {showFeedback && isPicked && !opt.correct && (
                            <span className={`${styles.opcionMarca} ${styles.marcaMal}`}><IconoCruz /></span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* La explicación va DEBAJO de las alternativas: primero el
                      alumno ve el ✓/✕ sobre la suya y después lee el porqué.
                      Encima empujaba las opciones fuera de vista justo al
                      responder. */}
                  {picked && current.explanation && (
                    <div className={styles.explicacion}>
                      <div className={styles.explicacionRotulo}>
                        <span className={styles.explicacionIcono}><IconoIdea /></span>
                        Por qué
                      </div>
                      <div className={styles.explicacionTexto}>
                        <ReactMarkdown>{current.explanation}</ReactMarkdown>
                      </div>
                      {(() => {
                        const figuras = figurasExplicacionDe(current);
                        if (figuras.length === 0) return null;
                        const lista = figuras.map(f => (
                          <FiguraAmpliable
                            key={f.src}
                            {...f}
                            sizes={figuras.length > 1 ? SIZES_PAR : SIZES_UNA}
                            onAmpliar={setAmpliada}
                            variante="explicacion"
                          />
                        ));
                        return (
                          <div className={styles.explicacionFigura}>
                            {current.explanationImageCaption && (
                              <p className={styles.explicacionCaption}>{current.explanationImageCaption}</p>
                            )}
                            {figuras.length > 1 ? (
                              <div className={`${styles.figuras} ${styles.figurasExplicacion}`}>{lista}</div>
                            ) : lista}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </article>

              <div className={styles.pie}>
                <div className={styles.pieIzq}>
                  {picked && current.tags?.length ? (
                    <div className={styles.tagsRow}>
                      {current.tags.map(t => (
                        <span key={t} className={styles.tag}>{t}</span>
                      ))}
                    </div>
                  ) : null}
                  <p className={styles.atajos}>
                    {picked ? (
                      <><kbd>Enter</kbd> para continuar</>
                    ) : (
                      <>
                        <kbd>{LETRAS[0]}</kbd>–<kbd>{LETRAS[current.options.length - 1]}</kbd> para responder
                      </>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.nextBtn}
                  onClick={handleNext}
                  disabled={!picked}
                >
                  {currentIdx + 1 >= total ? 'Terminar examen' : 'Siguiente'}
                  <span className={styles.nextFlecha} aria-hidden>→</span>
                </button>
              </div>
            </>
          )}
        </>
      )}

      {phase === 'finished' && (() => {
        const score = answersAll.filter(a => a.ok).length;
        const grandTotal = answersAll.length;
        const pct = grandTotal > 0 ? Math.round((score / grandTotal) * 100) : 0;
        const history = loadAttempts(stageKey);
        const marcasFinal: MarcaRastro[] = answersAll.map(a => (a.ok ? 'ok' : 'mal'));
        return (
          <div className={styles.resultShell}>
            <NotaFinal score={score} total={grandTotal} pct={pct} />

            <h2 className={styles.resultTitle}>
              {pct >= 80 ? '¡Excelente!' : pct >= 60 ? '¡Buen trabajo!' : pct >= 40 ? 'Vas por buen camino' : 'A repasar este tema'}
            </h2>
            <p className={styles.resultSub}>
              {mostrarEtapa && <>{nombreEtapa(stage)} · </>}
              Tu intento se guardó en este navegador.
            </p>

            <div className={styles.resultCifras}>
              <span className={styles.cifra}>
                <span className={`${styles.cifraNum} ${styles.cifraOk}`}>{score}</span>
                <span className={styles.cifraLabel}>correctas</span>
              </span>
              <span className={styles.cifraSep} aria-hidden />
              <span className={styles.cifra}>
                <span className={`${styles.cifraNum} ${styles.cifraMal}`}>{grandTotal - score}</span>
                <span className={styles.cifraLabel}>falladas</span>
              </span>
              {conCronometro && (
                <>
                  <span className={styles.cifraSep} aria-hidden />
                  <span className={styles.cifra}>
                    <span className={`${styles.cifraNum} ${excedido ? styles.cifraMal : styles.cifraTiempo}`}>
                      {formatoTiempo(segundos, conHoras)}
                    </span>
                    <span className={styles.cifraLabel}>
                      {excedido
                        ? `sobre ${formatoTiempo(recomendadoSeg, conHoras)}`
                        : `de ${formatoTiempo(recomendadoSeg, conHoras)}`}
                    </span>
                  </span>
                </>
              )}
            </div>

            {marcasFinal.length > 1 && marcasFinal.length <= MAX_SEGMENTOS && (
              <div className={styles.resultRastro}>
                <Rastro marcas={marcasFinal} final />
                <span className={styles.resultRastroPie}>Tu recorrido, pregunta a pregunta</span>
              </div>
            )}

            {history.length > 1 && (
              <div className={styles.history}>
                <p className={styles.historyTitle}>Intentos previos</p>
                {history.slice(0, 5).map(att => (
                  <div key={att.id} className={styles.historyRow}>
                    <span className={styles.historyFecha}>
                      {new Date(att.finishedAt).toLocaleDateString('es-PE', {
                        day: 'numeric', month: 'short',
                      })}
                      {typeof att.seconds === 'number' && (
                        <span className={styles.historyTime}>
                          <IconoReloj size={12} />
                          {formatoTiempo(att.seconds, att.seconds >= 3600)}
                        </span>
                      )}
                    </span>
                    <span className={styles.historyBarra} aria-hidden>
                      <span
                        className={styles.historyBarraFill}
                        style={{ width: `${att.total > 0 ? (att.score / att.total) * 100 : 0}%` }}
                      />
                    </span>
                    <span className={styles.historyScore}>
                      {att.score} / {att.total}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.resultActions}>
              <button type="button" className={styles.primaryBtn} onClick={handleRetry}>
                Reintentar examen
              </button>
              {backHref && (
                <Link href={backHref} className={styles.ghostBtn}>
                  Volver a la clase
                </Link>
              )}
              {isGrouped && stages.map((s, i) =>
                i !== stage ? (
                  <button
                    key={s.key}
                    type="button"
                    className={styles.ghostBtn}
                    onClick={() => handleSwitchStage(i)}
                  >
                    Ir al {nombreEtapa(i)} →
                  </button>
                ) : null,
              )}
            </div>
          </div>
        );
      })()}

      </PuertaDePago>

      {ampliada && <VisorImagen img={ampliada} onClose={() => setAmpliada(null)} />}

      {suscripcion && modalAbierto && (
        <SubscribeModal open planKey={suscripcion.plan} onClose={() => setModalAbierto(false)} />
      )}
    </div>
  );
}
