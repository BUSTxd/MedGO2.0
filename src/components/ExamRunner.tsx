'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import styles from '@/styles/examRunner.module.css';

interface ExamOption {
  id: string;
  text: string;
  correct: boolean;
}

interface ExamQuestion {
  id: string;
  stem: string;
  options: ExamOption[];
  explanation?: string;
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

export default function ExamRunner({
  examKey,
  fallbackTitle,
  backHref,
  backLabel = 'Volver a la clase',
}: Props) {
  const [payload, setPayload] = useState<ExamPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ q: string; a: string; ok: boolean }[]>([]);
  const [finished, setFinished] = useState(false);

  // Carga: signed URL + JSON
  useEffect(() => {
    let cancelled = false;
    setError(null);
    setPayload(null);

    (async () => {
      try {
        let entry = readUrlCache(examKey);
        if (!entry) {
          const r = await fetch(`/api/examen/${examKey}`);
          if (!r.ok) {
            if (r.status === 401) throw new Error('Necesitas iniciar sesión para ver este examen.');
            if (r.status === 403) throw new Error('Este examen es solo para el plan Interno.');
            if (r.status === 404) throw new Error('Examen no disponible.');
            throw new Error('Error cargando el examen.');
          }
          const data = (await r.json()) as SignedUrlEntry;
          writeUrlCache(examKey, data);
          entry = data;
        }
        const jsonRes = await fetch(entry.url);
        if (!jsonRes.ok) throw new Error('No se pudo descargar el contenido.');
        const json = (await jsonRes.json()) as ExamPayload;
        if (cancelled) return;
        setPayload(json);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Error desconocido.');
      }
    })();

    return () => { cancelled = true; };
  }, [examKey]);

  // Shuffle de preguntas + opciones (re-corre al cambiar runId)
  const deck = useMemo(() => {
    if (!payload) return null;
    return shuffle(payload.questions).map(q => ({
      ...q,
      options: shuffleOptionsAntiRepeat(q.options),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, runId]);

  const current = deck?.[currentIdx];
  const total = deck?.length ?? 0;

  // Progreso: cuántas preguntas respondidas / total. La actual cuenta como "en curso".
  const answeredCount = answers.length + (picked ? 1 : 0);
  const progressPct = total > 0
    ? Math.round(((finished ? total : currentIdx + (picked ? 1 : 0)) / total) * 100)
    : 0;

  const handlePick = (id: string) => {
    if (picked) return;
    setPicked(id);
  };

  const handleNext = () => {
    if (!current || !picked) return;
    const ok = current.options.find(o => o.id === picked)?.correct === true;
    const nextAnswers = [...answers, { q: current.id, a: picked, ok }];
    setAnswers(nextAnswers);
    setPicked(null);

    if (currentIdx + 1 >= total) {
      const score = nextAnswers.filter(a => a.ok).length;
      saveAttempt(examKey, {
        id: `att-${Date.now()}`,
        score,
        total,
        finishedAt: new Date().toISOString(),
      });
      setFinished(true);
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  const handleRetry = () => {
    setRunId(r => r + 1);
    setCurrentIdx(0);
    setPicked(null);
    setAnswers([]);
    setFinished(false);
  };

  const title = payload?.title ?? fallbackTitle ?? 'Examen';

  return (
    <div className={styles.shell}>
      {backHref ? (
        <Link href={backHref} className={styles.backLink}>
          ← {backLabel}
        </Link>
      ) : null}

      <header className={styles.header}>
        <span className={styles.eyebrow}>Banco de preguntas</span>
        <h1 className={styles.title}>{title}</h1>
        {payload && (
          <div className={styles.metaLine}>
            <span>{total} preguntas</span>
            <span>{payload.duration_min ? `${payload.duration_min} min` : 'Sin tiempo límite'}</span>
            <span>Respuestas y opciones aleatorizadas</span>
          </div>
        )}
      </header>

      {error && (
        <div className={styles.errorBlock}>{error}</div>
      )}

      {!error && !payload && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          Cargando examen…
        </div>
      )}

      {!error && payload && !finished && current && (
        <>
          <div className={styles.progressWrap}>
            <div className={styles.progressLabels}>
              <span className={styles.progressLabelMain}>
                Pregunta {currentIdx + 1} de {total}
              </span>
              <span>{progressPct}% completado</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className={styles.questionCard}>
            <p className={styles.stem}>{current.stem}</p>

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

            {picked && current.explanation && (
              <div className={styles.explanation}>
                <div className={styles.explanationLabel}>
                  <span>◆</span> Explicación
                </div>
                <ReactMarkdown>{current.explanation}</ReactMarkdown>
              </div>
            )}
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

      {finished && payload && (() => {
        const score = answers.filter(a => a.ok).length;
        const pct = Math.round((score / total) * 100);
        const history = loadAttempts(examKey);
        return (
          <div className={styles.resultShell}>
            <div className={styles.scoreCircle}>
              <span className={styles.scoreNum}>{score}/{total}</span>
              <span className={styles.scorePct}>{pct}% correcto</span>
            </div>
            <h2 className={styles.resultTitle}>
              {pct >= 80 ? '¡Excelente!' : pct >= 60 ? '¡Buen trabajo!' : pct >= 40 ? 'Vas por buen camino' : 'A repasar este tema'}
            </h2>
            <p className={styles.resultSub}>
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
            </div>
          </div>
        );
      })()}

      {/* answeredCount kept for potential analytics in fase 2 */}
      <span style={{ display: 'none' }} aria-hidden>{answeredCount}</span>
    </div>
  );
}
