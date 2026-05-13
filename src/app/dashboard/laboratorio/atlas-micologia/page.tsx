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

// Caracteristicas microscopicas clave para identificacion clinica.
// Los colores se indican siempre con su contexto (tincion o cultivo) para no
// generar conflicto visual con la imagen mostrada — que puede estar teñida con
// lactofenol azul, KOH, tinta china, etc.
const EXPLAIN: Record<string, string> = {
  'Alternaria spp.':
    'Hongo dematiáceo. Conidios grandes, multicelulares, en forma de pera o maza, con septos transversales y longitudinales. Pared con pigmento melánico marrón natural (visible aun en lactofenol azul). En cultivo (Sabouraud): colonias gris-verdosas vellosas.',
  'Aspergillus flavus':
    'Conidióforo con vesícula globosa cubierta de fialides en toda su superficie (uni- o biseriado). Cabezas conidiales radiales con cadenas de conidios. En cultivo (Sabouraud): colonias amarillo-verdosas. Productor de aflatoxinas.',
  'Aspergillus fumigatus':
    'Conidióforo con vesícula en matraz; fialides solo en el tercio superior (uniseriado), formando columnas paralelas al eje. En cultivo (Sabouraud): colonias verde-azuladas. Termotolerante (crece a 50 °C). Causa aspergilosis pulmonar invasiva.',
  'Aspergillus niger':
    'Vesícula globosa biseriada (métulas + fialides) con cabezas radiales muy grandes. Conidios oscuros por melanina natural (se ven negros aun en lactofenol). En cultivo (Sabouraud): colonias color carbón con reverso amarillento. Causa otomicosis y aspergiloma.',
  'Candida albicans':
    'Levadura ovoide gemante (4–6 µm) que forma pseudohifas y verdaderas hifas. Produce tubo germinativo en suero a 37 °C en 2–3 h (Reynold-Braude +). Clamidoconidios terminales en agar harina de maíz con Tween 80.',
  'Cryptococcus neoformans':
    'Levadura redonda con cápsula polisacárida gruesa. En tinción de tinta china se observa un halo claro (la cápsula desplaza la tinta) alrededor de la levadura. No forma pseudohifas. Causa meningitis criptocócica, sobre todo en VIH+.',
  'Fusarium spp.':
    'Macroconidios en forma de canoa o banana, multiseptados, con célula apical alargada. Microconidios ovales en cadenas o falsas cabezas. En cultivo (Sabouraud): colonias algodonosas con reverso rosáceo a violeta.',
  'Histoplasma capsulatum':
    'Hongo dimórfico. En tejido teñido con Giemsa/PAS: levaduras intracelulares (2–4 µm) dentro de macrófagos. En cultivo a 25 °C: hifas con macroconidios tuberculados con proyecciones espinosas características.',
  'Malassezia furfur':
    'Levadura lipofílica con imagen clásica de "spaghetti and meatballs" en escamas con KOH: hifas cortas y curvas junto a cúmulos de blastoconidios redondos. Causa pitiriasis versicolor.',
  'Microsporum canis':
    'Dermatofito zoofílico. Macroconidios fusiformes grandes (6+ septos) con extremo terminal curvado/asimétrico y pared rugosa-espinosa. En cultivo (Sabouraud): anverso amarillo-dorado, reverso amarillo-naranja.',
  'Microsporum gypseum':
    'Dermatofito geofílico. Macroconidios elipsoidales con extremos redondeados, pared delgada y 4–6 septos. En cultivo (Sabouraud): colonias granulosas, anverso color canela.',
  'Penicillium spp.':
    'Conidióforo ramificado en forma de pincel (penicillus): métulas → fialides → cadenas de conidios. En cultivo (Sabouraud): colonias aterciopeladas azul-verdosas con borde blanco.',
  'Trichophyton rubrum':
    'Dermatofito. Microconidios piriformes ("en lágrima") laterales a la hifa; macroconidios escasos en forma de lápiz. En cultivo (Sabouraud): reverso de la colonia rojo intenso característico.',
  'Trichophyton mentagrophytes':
    'Dermatofito. Microconidios redondos agrupados en racimos a lo largo de la hifa. Hifas espiraladas características. Macroconidios cilíndricos delgados con paredes lisas.',
  'Trichophyton tonsurans':
    'Dermatofito antropofílico. Microconidios pleomórficos (formas variadas: lágrima, bastón, globo) sobre fialides laterales. Causa principal de tinea capitis endothrix.',
};

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
        <circle cx="7"  cy="14" r="4" stroke="#5445d8" strokeWidth="1.5"/>
        <circle cx="7"  cy="14" r="1" fill="#5445d8"/>
        <circle cx="17" cy="10" r="4" stroke="#5445d8" strokeWidth="1.5"/>
        <circle cx="17" cy="10" r="1" fill="#5445d8"/>
        <circle cx="13" cy="18" r="4" stroke="#5445d8" strokeWidth="1.5"/>
        <circle cx="13" cy="18" r="1" fill="#5445d8"/>
      </svg>

      <div className={styles.topBar}>
        <Link href="/dashboard/laboratorio" className={styles.backLink}>← Laboratorio virtual</Link>
        <span className={styles.counter}>Muestra {current + 1} / {questions.length}</span>
      </div>

      <div className={styles.examBody}>
        <div className={styles.viewerWrap}>
          <span className={styles.magBadge}>{ZOOMS[zoom].label}</span>

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

          <span
            className={styles.zoomHint}
            style={{ opacity: zoom === 0 ? 1 : 0 }}
            aria-hidden={zoom !== 0}
          >
            Clic en la perilla para enfocar
          </span>
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
            <button
              className={`${styles.navBtn} ${styles.navBtnPrimary}`}
              onClick={reveal}
              style={{ alignSelf: 'center' }}
            >
              Verificar respuesta
            </button>
          )}

          {isRevealed && (
            <>
              <p style={{ fontSize: 13, color: sel === q.item.hongo ? '#2DC99A' : '#E85B4A', fontWeight: 600 }}>
                {sel === q.item.hongo
                  ? '✓ Correcto'
                  : <>✗ Incorrecto — la respuesta es <em>{q.item.hongo}</em></>}
              </p>
              {EXPLAIN[q.item.hongo] && (
                <div className={styles.explanation}>
                  <span className={styles.explanationTitle}>
                    <span className={styles.explanationName}>{q.item.hongo}</span> — características microscópicas
                  </span>
                  {EXPLAIN[q.item.hongo]}
                </div>
              )}
            </>
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
