'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { trackEvent } from '@/lib/analytics';
import styles from '@/styles/examRunner.module.css';

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
  options: ExamOption[];
  explanation?: string;
  explanationImage?: string;
  explanationImageAlt?: string;
  explanationImageCaption?: string;
  reviewNote?: string;
  tags?: string[];
}

interface ExamPayload {
  version: number;
  key: string;
  title: string;
  duration_min: number | null;
  questions: ExamQuestion[];
}

interface SignedUrlEntry { url: string; expiresAt: number }

interface Attempt {
  id: string;
  score: number;
  total: number;
  finishedAt: string;
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
}

const EXPIRY_BUFFER_MS = 15 * 60 * 1000;
const urlCacheKey = (k: string) => `examen-url-${k}`;
const attemptsKey = (k: string) => `medgo:attempts:${k}`;

function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function shuffleOptionsAntiRepeat(opts: ExamOption[]): ExamOption[] {
  if (opts.length < 2) return opts.slice();
  let attempt = shuffle(opts);
  let tries = 0;
  while (tries < 8 && opts.every((o, i) => attempt[i].id === o.id)) {
    attempt = shuffle(opts);
    tries++;
  }
  return attempt;
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

export default function ExamRunner({
  examKey,
  fallbackTitle,
  backHref,
  backLabel = 'Volver a la clase',
  groupKeys,
}: Props) {
  // Etapas: Grupo A (examKey) + grupos adicionales. Sin extras → examen simple.
  const stages = useMemo(
    () => [examKey, ...(groupKeys ?? [])].map(key => ({ key })),
    [examKey, groupKeys],
  );
  const isGrouped = stages.length > 1;

  const [stage, setStage] = useState(0);
  const [payload, setPayload] = useState<ExamPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  // Respuestas acumuladas a lo largo de TODAS las etapas resueltas.
  const [answersAll, setAnswersAll] = useState<{ q: string; a: string; ok: boolean }[]>([]);
  const [phase, setPhase] = useState<Phase>('running');

  const stageKey = stages[stage].key;

  // Carga de la etapa actual. El Grupo B solo se pide cuando `stage` pasa a 1.
  useEffect(() => {
    let cancelled = false;
    setError(null);
    setPayload(null);

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
  }, [stageKey, runId]);

  // Shuffle de preguntas + opciones (re-corre al cambiar de etapa o reintentar).
  const deck = useMemo(() => {
    if (!payload) return null;
    return shuffle(payload.questions).map(q => ({
      ...q,
      options: shuffleOptionsAntiRepeat(q.options),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, runId, stage]);

  const current = deck?.[currentIdx];
  const total = deck?.length ?? 0;

  const progressPct = total > 0
    ? Math.round(((currentIdx + (picked ? 1 : 0)) / total) * 100)
    : 0;

  const handlePick = (id: string) => {
    if (picked) return;
    setPicked(id);
  };

  const handleNext = () => {
    if (!current || !picked) return;
    const ok = current.options.find(o => o.id === picked)?.correct === true;
    const nextAll = [...answersAll, { q: current.id, a: picked, ok }];
    setAnswersAll(nextAll);
    setPicked(null);

    if (currentIdx + 1 >= total) {
      // Grupo terminado: cada grupo se califica de forma independiente.
      const score = nextAll.filter(a => a.ok).length;
      saveAttempt(stageKey, {
        id: `att-${Date.now()}`,
        score,
        total: nextAll.length,
        finishedAt: new Date().toISOString(),
      });
      trackEvent('examen_completado', { examKey: stageKey, score, total: nextAll.length });
      setPhase('finished');
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  // Salto directo a un grupo desde el selector (o desde la pantalla de
  // resultados). Reinicia el estado: cada grupo es un intento independiente.
  const handleSwitchStage = (i: number) => {
    if (i === stage && phase === 'running') return;
    setStage(i);
    setCurrentIdx(0);
    setPicked(null);
    setAnswersAll([]);
    setPhase('running');
  };

  const handleRetry = () => {
    // Reintenta el grupo actual (no vuelve al Grupo A).
    setRunId(r => r + 1);
    setCurrentIdx(0);
    setPicked(null);
    setAnswersAll([]);
    setPhase('running');
  };

  const title = payload?.title ?? fallbackTitle ?? 'Examen';

  return (
    <div className={styles.shell}>
      {isGrouped && phase !== 'finished' && (
        <div className={styles.groupSelector}>
          <span className={styles.groupSelectorLabel}>Examen:</span>
          <div className={styles.groupSquares}>
            {stages.map((s, i) => (
              <button
                key={s.key}
                type="button"
                className={`${styles.groupSquare} ${i === stage ? styles.groupSquareActive : ''}`}
                onClick={() => handleSwitchStage(i)}
                aria-pressed={i === stage}
                aria-label={`Ir al Grupo ${String.fromCharCode(65 + i)}`}
              >
                {String.fromCharCode(65 + i)}
              </button>
            ))}
          </div>
        </div>
      )}

      {backHref ? (
        <Link href={backHref} className={styles.backLink}>
          ← {backLabel}
        </Link>
      ) : null}

      <header className={styles.header}>
        <span className={styles.eyebrow}>Banco de preguntas</span>
        <h1 className={styles.title}>{title}</h1>
        {payload && phase === 'running' && (
          <div className={styles.metaLine}>
            {isGrouped && <span>Grupo {String.fromCharCode(65 + stage)}</span>}
            <span>{total} preguntas</span>
            <span>{payload.duration_min ? `${payload.duration_min} min` : 'Sin tiempo límite'}</span>
            <span>Respuestas y opciones aleatorizadas</span>
          </div>
        )}
        {payload && phase === 'running' && isGrouped && (
          <p className={styles.partHint}>
            Este examen tiene <strong>{stages.length} grupos independientes</strong>. Estás en el{' '}
            <strong>Grupo {String.fromCharCode(65 + stage)}</strong>; usa los cuadros{' '}
            <strong>{stages.map((_, i) => String.fromCharCode(65 + i)).join(' / ')}</strong> de arriba a la
            derecha para cambiar de grupo cuando quieras.
          </p>
        )}
      </header>

      {error && (
        <div className={styles.errorBlock}>{error}</div>
      )}

      {!error && !payload && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          {stage > 0 ? `Cargando Grupo ${String.fromCharCode(65 + stage)}…` : 'Cargando examen…'}
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
              {deck.map(q =>
                q.image ? (
                  <Image
                    key={q.id}
                    src={q.image}
                    alt=""
                    width={q.imageW ?? 1000}
                    height={q.imageH ?? 750}
                    sizes="(max-width: 600px) 100vw, 560px"
                    loading="eager"
                  />
                ) : null,
              )}
            </div>
          )}

          <div className={styles.progressWrap}>
            <div className={styles.progressLabels}>
              <span className={styles.progressLabelMain}>
                {isGrouped ? `Grupo ${String.fromCharCode(65 + stage)} · ` : ''}Pregunta {currentIdx + 1} de {total}
              </span>
              <span>{progressPct}% completado</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className={styles.questionCard}>
            {current.reviewNote && (
              <div className={styles.reviewBadge}>
                ⚠ Pendiente a revisión
                <span className={styles.reviewTooltip}>{current.reviewNote}</span>
              </div>
            )}
            <p className={styles.stem}>{current.stem}</p>

            {current.image && (
              <div className={styles.figure}>
                {/* next/image: srcset + AVIF/WebP redimensionado al ancho real del
                    dispositivo (vía `sizes`), para que el móvil no descargue la
                    micrografía a tamaño completo. */}
                <Image
                  src={current.image}
                  alt={current.imageAlt ?? 'Imagen de la pregunta'}
                  width={current.imageW ?? 1000}
                  height={current.imageH ?? 750}
                  sizes="(max-width: 600px) 100vw, 560px"
                  className={styles.figureImg}
                />
              </div>
            )}

            {picked && current.explanation && (
              <div className={styles.explanation}>
                <div className={styles.explanationLabel}>
                  <span>◆</span> Explicación
                </div>
                <ReactMarkdown>{current.explanation}</ReactMarkdown>
                {current.explanationImage && (
                  <div className={styles.explanationFigureWrap}>
                    {current.explanationImageCaption && (
                      <p className={styles.explanationFigureCaption}>{current.explanationImageCaption}</p>
                    )}
                    <div className={styles.explanationFigure}>
                      <Image
                        src={current.explanationImage}
                        alt={current.explanationImageAlt ?? 'Imagen de referencia'}
                        width={800}
                        height={600}
                        sizes="(max-width: 600px) 100vw, 560px"
                        className={styles.explanationFigureImg}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className={styles.options}>
              {current.options.map((opt, i) => {
                const isPicked = picked === opt.id;
                const showFeedback = picked !== null;
                const cls = [styles.option];
                if (showFeedback) {
                  if (opt.correct) cls.push(styles.optionCorrect);
                  else if (isPicked) cls.push(styles.optionWrong);
                  else cls.push(styles.optionDimmed);
                }
                const label = String.fromCharCode(65 + i);
                return (
                  <button
                    key={opt.id}
                    className={cls.join(' ')}
                    onClick={() => handlePick(opt.id)}
                    disabled={showFeedback}
                  >
                    <span className={styles.optionLabel}>{label}</span>
                    <span className={styles.optionText}>{opt.text}</span>
                    {showFeedback && opt.correct && <span className={styles.optionIcon}>✓</span>}
                    {showFeedback && isPicked && !opt.correct && <span className={styles.optionIcon}>✕</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.tagsRow}>
              {picked && current.tags?.map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
            <button
              className={styles.nextBtn}
              onClick={handleNext}
              disabled={!picked}
            >
              {currentIdx + 1 >= total ? 'Terminar examen' : 'Siguiente →'}
            </button>
          </div>
        </>
      )}

      {phase === 'finished' && (() => {
        const score = answersAll.filter(a => a.ok).length;
        const grandTotal = answersAll.length;
        const pct = grandTotal > 0 ? Math.round((score / grandTotal) * 100) : 0;
        const history = loadAttempts(stageKey);
        return (
          <div className={styles.resultShell}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreNum}>{score}/{grandTotal}</span>
              <span className={styles.scorePct}>{pct}% correcto</span>
            </div>
            <h2 className={styles.resultTitle}>
              {pct >= 80 ? '¡Excelente!' : pct >= 60 ? '¡Buen trabajo!' : pct >= 40 ? 'Vas por buen camino' : 'A repasar este tema'}
            </h2>
            <p className={styles.resultSub}>
              {isGrouped && <>Grupo {String.fromCharCode(65 + stage)} · </>}
              Tu intento se guardó en este navegador.
            </p>

            {history.length > 1 && (
              <div className={styles.history}>
                <p className={styles.historyTitle}>Intentos previos</p>
                {history.slice(0, 5).map(att => (
                  <div key={att.id} className={styles.historyRow}>
                    <span>
                      {new Date(att.finishedAt).toLocaleDateString('es-PE', {
                        day: 'numeric', month: 'short',
                      })}
                    </span>
                    <span className={styles.historyScore}>
                      {att.score} / {att.total}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.resultActions}>
              {backHref && (
                <Link href={backHref} className={styles.ghostBtn}>
                  Volver a la clase
                </Link>
              )}
              <button className={styles.primaryBtn} onClick={handleRetry}>
                Reintentar examen
              </button>
              {isGrouped && stages.map((s, i) =>
                i !== stage ? (
                  <button
                    key={s.key}
                    className={styles.ghostBtn}
                    onClick={() => handleSwitchStage(i)}
                  >
                    Ir al Grupo {String.fromCharCode(65 + i)} →
                  </button>
                ) : null,
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
