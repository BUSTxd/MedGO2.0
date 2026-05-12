'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/laboratorio.module.css';

type Item = { url: string; hongo: string };

// Shuffle minimo: clave aleatoria + sort + extract.
const shuffle = <T,>(a: T[]): T[] =>
  a.map((v) => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

const ZOOMS = [
  { scale: 1,   label: '× 400' },
  { scale: 1.5, label: '× 600' },
  { scale: 2,   label: '× 1000' },
];

export default function AtlasMicologiaPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [zoom, setZoom] = useState(0);

  // Al cambiar de muestra, el zoom vuelve al objetivo base.
  useEffect(() => { setZoom(0); }, [current]);

  // 1 sola peticion al montar; precarga TODAS las imagenes, con prioridad alta para las primeras.
  useEffect(() => {
    fetch('/api/atlas/micologia')
      .then((r) => r.json())
      .then((data: Item[]) => {
        const ordered = shuffle(data);
        setItems(ordered);
        ordered.forEach((d, i) => {
          const img = new Image();
          if (i < 3) (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'high';
          img.src = d.url;
        });
      });
  }, []);

  // Preguntas con opciones aleatorias — se memoriza por sesion, no por cambio de pagina.
  const questions = useMemo(() => {
    if (!items.length) return [];
    const hongos = [...new Set(items.map((i) => i.hongo))];
    return items.map((item) => {
      const wrongs = shuffle(hongos.filter((h) => h !== item.hongo)).slice(0, 4);
      return { item, options: shuffle([item.hongo, ...wrongs]) };
    });
  }, [items]);

  if (!questions.length) {
    return (
      <div className={styles.examPage}>
        <div className={styles.loadingMsg}>Cargando atlas de micología…</div>
      </div>
    );
  }

  const q = questions[current];
  const sel = selected[current];
  const isRevealed = revealed[current];

  const onSel = (h: string) => {
    if (isRevealed) return;
    setSelected((p) => ({ ...p, [current]: h }));
  };
  const reveal = () => sel && setRevealed((p) => ({ ...p, [current]: true }));
  const optClass = (h: string) => {
    if (!isRevealed) return sel === h ? styles.optionSelected : '';
    if (h === q.item.hongo) return styles.optionCorrect;
    if (h === sel) return styles.optionWrong;
    return '';
  };

  return (
    <div className={styles.examPage}>
      <svg className={styles.examPageIcon} width="180" height="180" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" fill="#5445d8" stroke="#5445d8" strokeWidth="2" />
        <path d="m8 12-3-2M16 12l3-2M12 8l2-3M12 16l-2 3" stroke="#5445d8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <div className={styles.topBar}>
        <Link href="/dashboard/laboratorio" className={styles.backLink}>← Laboratorio virtual</Link>
        <span className={styles.counter}>Muestra {current + 1} / {questions.length}</span>
      </div>

      <div className={styles.examBody}>
        <div className={styles.viewerWrap}>
          <div className={styles.microscopeOuter}>
            <div className={styles.crosshair} />
            <div className={styles.specimen}>
              <img
                src={q.item.url}
                alt=""
                className={styles.specimenImg}
                loading="eager"
                decoding="async"
                style={{ transform: `scale(${ZOOMS[zoom].scale})` }}
              />
              <div className={styles.specimenLens} />
            </div>
          </div>

          <div className={styles.zoomRow}>
            <button
              type="button"
              className={styles.zoomKnob}
              onClick={() => setZoom((z) => (z + 1) % ZOOMS.length)}
              aria-label="Girar perilla de aumento"
              style={{ transform: `rotate(${zoom * 120}deg)` }}
            >
              <span className={styles.zoomKnobNotch} />
              <span className={styles.zoomKnobGrip} />
              <span className={styles.zoomKnobGrip} />
              <span className={styles.zoomKnobGrip} />
            </button>
            <div className={styles.zoomMeta}>
              <span className={styles.magnification}>{ZOOMS[zoom].label}</span>
              <span className={styles.zoomHint}>Clic en la perilla para enfocar</span>
            </div>
          </div>
        </div>

        <div className={styles.questionPanel}>
          <span className={styles.questionLabel}>Atlas de Micología</span>
          <p className={styles.questionText}>
            Observe la muestra al microscopio. ¿A qué hongo corresponde esta imagen?
          </p>

          <div className={styles.options}>
            {q.options.map((h, idx) => (
              <button
                key={h}
                className={`${styles.option} ${optClass(h)}`}
                onClick={() => onSel(h)}
              >
                <span className={styles.optionKey}>{String.fromCharCode(65 + idx)}</span>
                <span className={styles.optionText} style={{ fontStyle: 'italic' }}>{h}</span>
              </button>
            ))}
          </div>

          {sel && !isRevealed && (
            <button className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={reveal}>
              Verificar respuesta
            </button>
          )}

          {isRevealed && (
            <p style={{ fontSize: 13, color: sel === q.item.hongo ? '#2DC99A' : '#E85B4A', fontWeight: 600 }}>
              {sel === q.item.hongo
                ? '✓ Correcto'
                : <>✗ Incorrecto — la respuesta es <em>{q.item.hongo}</em></>}
            </p>
          )}
        </div>
      </div>

      <div className={styles.examFooter}>
        <button className={styles.navBtn} onClick={() => setCurrent((c) => c - 1)} disabled={current === 0}>
          <span>←</span><span className={styles.navBtnLabel}>Anterior</span>
        </button>

        <div className={styles.progressDots}>
          {questions.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''} ${revealed[i] ? styles.dotDone : ''}`}
            />
          ))}
        </div>

        <button
          className={`${styles.navBtn} ${styles.navBtnPrimary}`}
          onClick={() => setCurrent((c) => c + 1)}
          disabled={current === questions.length - 1}
        >
          <span className={styles.navBtnLabel}>Siguiente</span><span>→</span>
        </button>
      </div>
    </div>
  );
}
