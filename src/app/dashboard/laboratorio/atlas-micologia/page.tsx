'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/laboratorio.module.css';

type Item = { url: string; hongo: string };
type Mode = 'choice' | 'write';

// Shuffle minimo: clave aleatoria + sort + extract.
const shuffle = <T,>(a: T[]): T[] =>
  a.map((v) => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

// Reordena items de modo que no aparezcan dos imagenes consecutivas del mismo hongo.
// Greedy: en cada paso elige el grupo con mas imagenes restantes que NO sea el hongo
// usado en la posicion anterior. Empates desempatados con Math.random para variar.
// Si max_count > ceil(N/2) es matematicamente imposible y caera al fallback (acepta
// que la ultima quede pegada). En el atlas actual: ~3 imgs por hongo, no llega.
const shuffleNoConsecutive = (items: Item[]): Item[] => {
  if (items.length <= 1) return items.slice();
  const groups = new Map<string, Item[]>();
  for (const it of items) {
    const arr = groups.get(it.hongo);
    if (arr) arr.push(it); else groups.set(it.hongo, [it]);
  }
  // mezcla interna de cada grupo: que rote cual imagen sale primero
  for (const arr of groups.values()) {
    arr.sort(() => Math.random() - 0.5);
  }
  const out: Item[] = [];
  let lastHongo: string | null = null;
  while (groups.size > 0) {
    const entries = [...groups.entries()]
      .map(([k, v]) => ({ k, v, r: Math.random() }))
      .sort((a, b) => b.v.length - a.v.length || a.r - b.r);
    let pick = entries.find((e) => e.k !== lastHongo) ?? entries[0];
    out.push(pick.v.shift()!);
    if (pick.v.length === 0) groups.delete(pick.k);
    lastHongo = pick.k;
  }
  return out;
};

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

// Normalizacion para el modo escritura: minusculas, sin tildes, sin puntuacion,
// sin "spp"/"sp", colapsa espacios. La validacion es tolerante a pequenas
// variaciones tipograficas sin volverse permisiva con generos distintos.
const normalize = (s: string) =>
  s.toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\bspp?\.?\b/g, '')
    .replace(/[.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

// Acepta: nombre completo ("aspergillus flavus"), o abreviado ("a. flavus" → "a flavus"),
// pero exige genero + especie cuando el nombre formal los tiene (para no confundir
// fumigatus/flavus/niger). Para nombres tipo "Alternaria spp." vale solo el genero.
const matchesHongo = (input: string, hongo: string): boolean => {
  const inN = normalize(input);
  if (!inN) return false;
  const hN = normalize(hongo);
  if (inN === hN) return true;
  const hParts = hN.split(' ').filter(Boolean);
  if (hParts.length >= 2) {
    const abbrev = `${hParts[0][0]} ${hParts.slice(1).join(' ')}`;
    if (inN === abbrev) return true;
  }
  return false;
};

export default function AtlasMicologiaPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [writeInput, setWriteInput] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [zoom, setZoom] = useState(0);

  // Al cambiar de muestra, el zoom vuelve al objetivo base.
  useEffect(() => { setZoom(0); }, [current]);

  // Carga diferida: solo cuando el usuario elige un modo se dispara el fetch +
  // preload de imagenes. Asi entrar a la pagina y salir sin examinar no consume
  // banda. Si vuelve al selector (pildora "Cambiar modo") los items se conservan
  // y no se vuelve a pedir. Ademas, la lista se persiste en sessionStorage para
  // que pestañas/recargas dentro de la sesion no repitan ni siquiera la peticion
  // al API (las imagenes a su vez viven en el cache HTTP del browser por 1 año).
  const startExam = (m: Mode) => {
    setMode(m);
    if (items.length || loading) return;

    const preload = (data: Item[]) => {
      const ordered = shuffleNoConsecutive(data);
      setItems(ordered);
      ordered.forEach((d, i) => {
        const img = new Image();
        if (i < 3) (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'high';
        img.src = d.url;
      });
    };

    try {
      const cached = sessionStorage.getItem('atlas-micologia');
      if (cached) {
        const data = JSON.parse(cached) as Item[];
        if (Array.isArray(data) && data.length > 0) {
          preload(data);
          return;
        }
      }
    } catch { /* sessionStorage puede estar deshabilitado */ }

    setLoading(true);
    fetch('/api/atlas/micologia')
      .then((r) => r.json())
      .then((data: Item[]) => {
        try { sessionStorage.setItem('atlas-micologia', JSON.stringify(data)); } catch {}
        preload(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Preguntas con opciones aleatorias — se memoriza por sesion, no por cambio de pagina.
  const questions = useMemo(() => {
    if (!items.length) return [];
    const hongos = [...new Set(items.map((i) => i.hongo))];
    return items.map((item) => {
      const wrongs = shuffle(hongos.filter((h) => h !== item.hongo)).slice(0, 4);
      return { item, options: shuffle([item.hongo, ...wrongs]) };
    });
  }, [items]);

  // ─── PANTALLA DE SELECCION DE MODO ───
  // Se muestra ANTES de cargar nada — la peticion al API y el preload de
  // imagenes solo se disparan tras hacer clic en una card.
  if (!mode) {
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
          {items.length > 0 && (
            <span className={styles.counter}>{items.length} muestras</span>
          )}
        </div>

        <div className={styles.modeWrap}>
          <span className={styles.questionLabel}>Atlas de Micología</span>
          <h2 className={styles.modeTitle}>¿Cómo quieres practicar?</h2>
          <p className={styles.modeSub}>
            Elige el modo de evaluación. Las imágenes se cargarán al iniciar.
          </p>

          <div className={styles.modeCards}>
            <button className={styles.modeCard} onClick={() => startExam('choice')}>
              <span className={styles.modeIcon} aria-hidden="true">
                <span className={styles.modeIconKey}>A</span>
                <span className={styles.modeIconKey}>B</span>
                <span className={styles.modeIconKey}>C</span>
              </span>
              <span className={styles.modeCardTitle}>Con alternativas</span>
              <span className={styles.modeCardDesc}>
                Cinco opciones por muestra. Ideal para reconocer y descartar.
              </span>
            </button>

            <button className={styles.modeCard} onClick={() => startExam('write')}>
              <span className={styles.modeIcon} aria-hidden="true">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21h4l11-11-4-4L3 17v4z" stroke="#3b9edd" strokeWidth="1.7" strokeLinejoin="round"/>
                  <path d="M14 6l4 4" stroke="#3b9edd" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </span>
              <span className={styles.modeCardTitle}>Escribiendo</span>
              <span className={styles.modeCardDesc}>
                Escribe el nombre del hongo. Más exigente — refuerza la memoria activa.
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // mode elegido pero las imagenes aun no llegan: pantalla de carga.
  if (!questions.length) {
    return (
      <div className={styles.examPage}>
        <div className={styles.topBar}>
          <Link href="/dashboard/laboratorio" className={styles.backLink}>← Laboratorio virtual</Link>
        </div>
        <div className={styles.loadingMsg}>Cargando atlas de micología…</div>
      </div>
    );
  }

  const q = questions[current];
  const sel = selected[current];
  const input = writeInput[current] ?? '';
  const isRevealed = revealed[current];
  const writeIsCorrect = mode === 'write' && matchesHongo(input, q.item.hongo);

  const onSel = (h: string) => {
    if (isRevealed) return;
    setSelected((p) => ({ ...p, [current]: h }));
  };
  const reveal = () => {
    if (mode === 'choice' && !sel) return;
    if (mode === 'write' && !input.trim()) return;
    setRevealed((p) => ({ ...p, [current]: true }));
  };
  const optClass = (h: string) => {
    if (!isRevealed) return sel === h ? styles.optionSelected : '';
    if (h === q.item.hongo) return styles.optionCorrect;
    if (h === sel) return styles.optionWrong;
    return '';
  };

  const canReveal = mode === 'choice' ? !!sel : input.trim().length > 0;
  const verdict =
    mode === 'choice'
      ? sel === q.item.hongo
      : writeIsCorrect;

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
        <div className={styles.topBarRight}>
          <button
            type="button"
            className={styles.modePill}
            onClick={() => setMode(null)}
            title="Cambiar modo"
          >
            {mode === 'choice' ? 'Alternativas' : 'Escribir'}
          </button>
          <span className={styles.counter}>Muestra {current + 1} / {questions.length}</span>
        </div>
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

          {mode === 'choice' ? (
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
          ) : (
            <div className={styles.writeWrap}>
              <input
                type="text"
                value={input}
                onChange={(e) => setWriteInput((p) => ({ ...p, [current]: e.target.value }))}
                onKeyDown={(e) => { if (e.key === 'Enter' && canReveal && !isRevealed) reveal(); }}
                disabled={isRevealed}
                placeholder="Escribe el género y especie…"
                className={`${styles.writeInput} ${
                  isRevealed ? (verdict ? styles.writeInputCorrect : styles.writeInputWrong) : ''
                }`}
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <span className={styles.writeHint}>
                Acepta nombre completo o abreviado (ej. <em>A. flavus</em>). No distingue tildes.
              </span>
            </div>
          )}

          {!isRevealed && (
            <button
              className={`${styles.navBtn} ${styles.navBtnPrimary}`}
              onClick={reveal}
              disabled={!canReveal}
              style={{ alignSelf: 'center', opacity: canReveal ? 1 : 0.4 }}
            >
              Verificar respuesta
            </button>
          )}

          {isRevealed && (
            <>
              <p style={{ fontSize: 13, color: verdict ? '#2DC99A' : '#E85B4A', fontWeight: 600 }}>
                {verdict
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
