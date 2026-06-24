'use client';
// Examen interactivo EVA 2 (anatomía). Flujo por pregunta:
//   1. El alumno nombra la estructura señalada (Pregunta A).
//   2a. Si A es correcta → se revela la descripción de la imagen y la Pregunta B
//       se despliega para que el alumno la responda.
//   2b. Si A es incorrecta → se muestra la corrección de A junto con la Pregunta B
//       ya resuelta (respuesta modelo). Puede reintentar A.
//   3. B se evalúa por conceptos clave (palabras clave + variantes): cada concepto
//      mencionado cuenta como acertado; los no mencionados quedan marcados como mal.
// El progreso de cada pregunta se conserva al navegar entre ellas.

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { QUESTIONS, type Question } from './questions';
import base from '@/styles/laboratorio.module.css';
import styles from '@/styles/eva2.module.css';

/** Normaliza texto: minúsculas, sin tildes, sin puntuación, espacios colapsados. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[().,/;:¿?¡!_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** ¿La respuesta del alumno contiene alguno de los sinónimos/variantes aceptados? */
function matches(input: string, accept: string[]): boolean {
  const n = norm(input);
  if (!n) return false;
  return accept.some((a) => n.includes(norm(a)));
}

type AStatus = 'idle' | 'correct' | 'wrong';

type QProgress = {
  aValue: string;
  aStatus: AStatus;
  bValue: string;
  bChecked: boolean;
};

const emptyProgress = (): QProgress => ({
  aValue: '',
  aStatus: 'idle',
  bValue: '',
  bChecked: false,
});

export default function Eva2Exam() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState<Record<string, QProgress>>({});
  const bRef = useRef<HTMLTextAreaElement | null>(null);

  const q = QUESTIONS[idx];
  const p = progress[q.id] ?? emptyProgress();

  const update = (patch: Partial<QProgress>) =>
    setProgress((prev) => ({ ...prev, [q.id]: { ...(prev[q.id] ?? emptyProgress()), ...patch } }));

  const aCorrect = p.aStatus === 'correct';
  const aWrong = p.aStatus === 'wrong';
  const solved = p.aStatus !== 'idle';
  // Al revelar la explicación, el contenido crece: dejamos de centrar para subir.
  const showExplanation = aWrong || (aCorrect && p.bChecked);

  // Nº de conceptos necesarios. Sin needB → se exigen todos (rigor: cada
  // palabra clave que falte queda marcada como incorrecta). Con needB →
  // basta acertar esa cantidad (enunciados tipo «indique 04 características»).
  const needB = q.needB ?? q.conceptsB.length;
  const foundB = useMemo(
    () => q.conceptsB.map((c) => matches(p.bValue, c.accept)),
    [q, p.bValue],
  );
  const foundCount = foundB.filter(Boolean).length;
  const bComplete = foundCount >= needB;

  const completedCount = QUESTIONS.filter((qq) => dotDone(progress, qq)).length;

  function verifyA() {
    const correct = matches(p.aValue, q.answerA.accept);
    update({ aStatus: correct ? 'correct' : 'wrong' });
    if (correct) {
      // Deja que el panel B se monte antes de enfocarlo.
      setTimeout(() => bRef.current?.focus(), 380);
    }
  }

  function retryA() {
    update({ aValue: '', aStatus: 'idle', bValue: '', bChecked: false });
  }

  function go(delta: number) {
    setIdx((i) => Math.min(QUESTIONS.length - 1, Math.max(0, i + delta)));
  }

  return (
    <div className={base.examPage}>
      {/* Precarga todas las imágenes del examen al montar — next/image emite
          <link rel="preload"> con las URLs optimizadas, sin pedir los originales. */}
      <div aria-hidden style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        {QUESTIONS.filter((qq) => qq.image).map((qq) => (
          <div key={qq.id} style={{ position: 'relative', width: 1, height: 1 }}>
            <Image src={qq.image!} alt="" fill priority sizes="(max-width: 860px) 100vw, 460px" />
          </div>
        ))}
      </div>

      <div className={base.topBar}>
        <Link href="/dashboard/laboratorio" className={base.backLink}>← Laboratorio virtual</Link>
        <span className={base.counter}>Pregunta {idx + 1} / {QUESTIONS.length}</span>
      </div>

      <div className={styles.intro}>
        <span className={styles.kicker}>EVA 2 · Anatomía</span>
        <h2 className={styles.h2}>Identificación de estructuras — preguntas de examen pasadas</h2>
        <p className={styles.sub}>
          Nombra la estructura señalada (<strong>Pregunta A</strong>). Al acertar se desbloquea la{' '}
          <strong>Pregunta B</strong> con el detalle clínico o funcional.
        </p>
      </div>

      <div className={`${styles.body} ${showExplanation ? styles.bodyTop : ''}`}>
        {/* ─── Columna izquierda: imagen anatómica ─── */}
        <div className={styles.imageCol}>
          <div className={styles.imageBox}>
            {q.image ? (
              <Image
                src={q.image}
                alt={`Estructura — pregunta ${idx + 1}`}
                fill
                sizes="(max-width: 860px) 100vw, 460px"
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="8.5" cy="9.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M21 16l-5-5-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={styles.placeholderLabel}>Imagen anatómica</span>
                <span className={styles.placeholderSub}>{q.region}</span>
              </div>
            )}
            <span className={styles.imageBadge}>{q.region}</span>
          </div>

          {/* El caption revela detalles → solo tras responder A. La cita siempre visible. */}
          {solved && q.imageCaption && (
            <p className={styles.imageCaption}>{q.imageCaption}</p>
          )}
          {q.imageCitation && (
            <p className={styles.imageCitation}>
              <em>{q.imageCitation}</em>
            </p>
          )}
        </div>

        {/* ─── Columna derecha: preguntas A y B ─── */}
        <div className={styles.qaCol}>
          {/* PREGUNTA A */}
          <section className={`${styles.qBlock} ${aCorrect ? styles.qBlockDone : ''} ${aWrong ? styles.qBlockWrong : ''}`}>
            <header className={styles.qHead}>
              <span className={styles.qTag}>Pregunta A</span>
              <p className={styles.qPrompt}>{q.promptA}</p>
            </header>

            <input
              type="text"
              className={`${base.writeInput} ${aCorrect ? base.writeInputCorrect : ''} ${aWrong ? base.writeInputWrong : ''}`}
              placeholder="Escribe el nombre de la estructura…"
              value={p.aValue}
              disabled={solved}
              onChange={(e) => update({ aValue: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter' && !solved) verifyA(); }}
            />

            {!solved && (
              <div className={styles.btnRow}>
                <button className={styles.verifyBtn} onClick={verifyA} disabled={!p.aValue.trim()}>
                  Verificar
                </button>
              </div>
            )}

            {aCorrect && (
              <p className={styles.feedbackOk}>
                <strong>✓ Correcto:</strong> {q.answerA.label}
              </p>
            )}
            {aWrong && (
              <>
                <p className={styles.feedbackWrong}>
                  <strong>✗ Incorrecto.</strong> Respuesta correcta: <em>{q.answerA.label}</em>
                </p>
                <div className={styles.btnRow}>
                  <button className={styles.retryBtn} onClick={retryA}>Intentar de nuevo</button>
                </div>
              </>
            )}
          </section>

          {/* PREGUNTA B — interactiva si acertó A; resuelta si falló A */}
          {aCorrect && (
            <section className={`${styles.qBlock} ${styles.qBlockB}`} key={`b-${q.id}`}>
              <header className={styles.qHead}>
                <span className={`${styles.qTag} ${styles.qTagB}`}>Pregunta B</span>
                <p className={styles.qPrompt}>{q.promptB}</p>
              </header>

              <textarea
                ref={bRef}
                className={`${base.writeInput} ${styles.textarea} ${p.bChecked ? (bComplete ? base.writeInputCorrect : base.writeInputWrong) : ''}`}
                placeholder="Escribe tu respuesta…"
                rows={3}
                value={p.bValue}
                onChange={(e) => update({ bValue: e.target.value, bChecked: false })}
              />

              {q.conceptsB.length > 1 && (
                <p className={styles.needHint}>
                  {q.needB ? `Menciona al menos ${q.needB} de ${q.conceptsB.length}.` : 'Menciona todos los elementos pedidos.'}
                </p>
              )}

              <div className={styles.btnRow}>
                <button className={styles.verifyBtn} onClick={() => update({ bChecked: true })} disabled={!p.bValue.trim()}>
                  Verificar respuesta
                </button>
              </div>

              {p.bChecked && (
                <div className={styles.bResult}>
                  <p className={bComplete ? styles.feedbackOk : styles.feedbackPartial}>
                    {bComplete
                      ? `✓ ¡Bien! Acertaste ${foundCount} de ${q.conceptsB.length} conceptos.`
                      : `Acertaste ${foundCount} de ${needB} necesarios. Revisa los que faltan.`}
                  </p>

                  <ul className={styles.conceptList}>
                    {q.conceptsB.map((c, i) => (
                      <li key={c.label} className={foundB[i] ? styles.conceptOk : styles.conceptMiss}>
                        <span className={styles.conceptMark}>{foundB[i] ? '✓' : '✗'}</span>
                        {c.label}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.modelAnswer}>
                    <span className={styles.modelLabel}>Respuesta modelo</span>
                    {q.modelB}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PREGUNTA B resuelta — cuando falló A se muestra la solución completa */}
          {aWrong && (
            <section className={`${styles.qBlock} ${styles.qBlockSolved}`} key={`bs-${q.id}`}>
              <header className={styles.qHead}>
                <span className={`${styles.qTag} ${styles.qTagSolved}`}>Pregunta B · Resuelta</span>
                <p className={styles.qPrompt}>{q.promptB}</p>
              </header>

              <ul className={styles.conceptList}>
                {q.conceptsB.map((c) => (
                  <li key={c.label} className={styles.conceptOk}>
                    <span className={styles.conceptMark}>•</span>
                    {c.label}
                  </li>
                ))}
              </ul>

              <div className={styles.modelAnswer}>
                <span className={styles.modelLabel}>Respuesta modelo</span>
                {q.modelB}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ─── Footer de navegación ─── */}
      <div className={base.examFooter}>
        <button className={base.navBtn} onClick={() => go(-1)} disabled={idx === 0}>
          <span className={base.navBtnLabel}>← Anterior</span>
        </button>

        <div className={styles.progressInfo}>
          <span className={styles.completeCount}>{completedCount} / {QUESTIONS.length} completas</span>
          <div className={base.progressDots}>
            {QUESTIONS.map((qq, i) => (
              <span
                key={qq.id}
                className={`${base.dot} ${i === idx ? base.dotActive : ''} ${dotDone(progress, qq) ? base.dotDone : ''}`}
              />
            ))}
          </div>
        </div>

        <button className={`${base.navBtn} ${base.navBtnPrimary}`} onClick={() => go(1)} disabled={idx === QUESTIONS.length - 1}>
          <span className={base.navBtnLabel}>Siguiente →</span>
        </button>
      </div>
    </div>
  );
}

/** ¿La pregunta está completa (A correcta + B verificada con todos los conceptos)? */
function dotDone(progress: Record<string, QProgress>, qq: Question): boolean {
  const pp = progress[qq.id];
  if (pp?.aStatus !== 'correct' || !pp.bChecked) return false;
  const need = qq.needB ?? qq.conceptsB.length;
  return qq.conceptsB.filter((c) => matches(pp.bValue, c.accept)).length >= need;
}
