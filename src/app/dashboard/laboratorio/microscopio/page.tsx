'use client';
import { useState } from 'react';
import Link from 'next/link';
import TrackLabVisit from '@/components/TrackLabVisit';
import styles from '@/styles/laboratorio.module.css';

const PREGUNTAS = [
  {
    id: 1,
    pregunta: 'Observe la imagen al microscopio. Identifique el tipo de bacteria presente según su morfología y agrupamiento.',
    claves: [
      { letra: 'A', texto: 'Staphylococcus aureus — cocos en racimo gram positivos' },
      { letra: 'B', texto: 'Streptococcus pneumoniae — cocos en cadena gram positivos' },
      { letra: 'C', texto: 'Escherichia coli — bacilos gram negativos' },
      { letra: 'D', texto: 'Mycobacterium tuberculosis — bacilos ácido-alcohol resistentes' },
      { letra: 'E', texto: 'Candida albicans — levadura con pseudohifas' },
    ],
    respuesta: 'A',
  },
  {
    id: 2,
    pregunta: 'En la tinción de Gram observada, ¿qué característica de la pared celular explica la coloración violeta retenida?',
    claves: [
      { letra: 'A', texto: 'Alta concentración de lípidos en la membrana externa' },
      { letra: 'B', texto: 'Capa gruesa de peptidoglicano que retiene el cristal violeta' },
      { letra: 'C', texto: 'Presencia de lipopolisacárido en la pared' },
      { letra: 'D', texto: 'Ausencia de membrana celular' },
      { letra: 'E', texto: 'Cápsula de polisacáridos que fija el colorante' },
    ],
    respuesta: 'B',
  },
  {
    id: 3,
    pregunta: 'La muestra fue obtenida de un cultivo en agar sangre a 37°C por 48h. ¿Qué patrón de hemólisis sugiere Streptococcus pyogenes?',
    claves: [
      { letra: 'A', texto: 'Hemólisis gamma — sin lisis de glóbulos rojos' },
      { letra: 'B', texto: 'Hemólisis alfa — lisis parcial con coloración verdosa' },
      { letra: 'C', texto: 'Hemólisis beta — lisis completa con halo claro' },
      { letra: 'D', texto: 'Hemólisis delta — lisis dependiente de temperatura' },
      { letra: 'E', texto: 'No produce hemólisis en agar sangre' },
    ],
    respuesta: 'C',
  },
  {
    id: 4,
    pregunta: 'Al observar el frotis con objetivo 100× en aceite de inmersión, se identifican estructuras esféricas de ~1 µm en pares. ¿Cuál es el diagnóstico más probable?',
    claves: [
      { letra: 'A', texto: 'Bacillus anthracis en cadenas con esporas' },
      { letra: 'B', texto: 'Clostridium tetani con esporas terminales en raqueta' },
      { letra: 'C', texto: 'Neisseria gonorrhoeae — diplococos intracelulares' },
      { letra: 'D', texto: 'Listeria monocytogenes — bacilos cortos móviles' },
      { letra: 'E', texto: 'Treponema pallidum — espiroqueta con movimiento rotatorio' },
    ],
    respuesta: 'C',
  },
  {
    id: 5,
    pregunta: 'Se realiza tinción de Ziehl-Neelsen en muestra de esputo. Los bacilos se observan de color rojo sobre fondo azul. ¿A qué propiedad corresponde esto?',
    claves: [
      { letra: 'A', texto: 'Gram positividad por peptidoglicano grueso' },
      { letra: 'B', texto: 'Resistencia a la decoloración por ácido-alcohol debido a ácidos micólicos' },
      { letra: 'C', texto: 'Producción de exotoxinas que fijan la fucsina' },
      { letra: 'D', texto: 'Presencia de plásmidos de resistencia a colorantes' },
      { letra: 'E', texto: 'Actividad enzimática de catalasa que oxida el colorante' },
    ],
    respuesta: 'B',
  },
];

export default function MicroscopioPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const pregunta = PREGUNTAS[current];
  const sel = selected[current];
  const isRevealed = revealed[current];

  const handleSelect = (letra: string) => {
    if (isRevealed) return;
    setSelected((prev) => ({ ...prev, [current]: letra }));
  };

  const handleReveal = () => {
    if (!sel) return;
    setRevealed((prev) => ({ ...prev, [current]: true }));
  };

  const optionClass = (letra: string) => {
    if (!isRevealed) return sel === letra ? styles.optionSelected : '';
    if (letra === pregunta.respuesta) return styles.optionCorrect;
    if (letra === sel && letra !== pregunta.respuesta) return styles.optionWrong;
    return '';
  };

  return (
    <div className={styles.examPage}>
      <TrackLabVisit labId="microscopio" />
      {/* Corner icon */}
      <svg className={styles.examPageIcon} width="180" height="180" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" fill="#5445d8" stroke="#5445d8" strokeWidth="2"/>
        <path d="m8 12-3-2M16 12l3-2M12 8l2-3M12 16l-2 3" stroke="#5445d8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      {/* Top bar */}
      <div className={styles.topBar}>
        <Link href="/dashboard/laboratorio" className={styles.backLink}>
          ← Laboratorio virtual
        </Link>
        <span className={styles.counter}>
          Pregunta {current + 1} / {PREGUNTAS.length}
        </span>
      </div>

      {/* Exam body */}
      <div className={styles.examBody}>

        {/* Left — microscope viewer */}
        <div className={styles.viewerWrap}>
          <div className={styles.microscopeOuter}>
            <div className={styles.crosshair} />
            <div className={styles.specimen}>
              <div className={styles.specimenPlaceholder}>
                <svg className={styles.specimenIcon} width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="4" fill="rgba(59,158,221,0.4)" stroke="rgba(59,158,221,0.6)" strokeWidth="1.5"/>
                  <path d="m8 12-3-2M16 12l3-2M12 8l2-3M12 16l-2 3" stroke="rgba(59,158,221,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span className={styles.specimenLabel}>Muestra {current + 1}</span>
              </div>
            </div>
          </div>
          <span className={styles.magnification}>× 100 — Aceite de inmersión</span>
        </div>

        {/* Right — question + options */}
        <div className={styles.questionPanel}>
          <span className={styles.questionLabel}>Pregunta {current + 1}</span>
          <p className={styles.questionText}>{pregunta.pregunta}</p>

          <div className={styles.options}>
            {pregunta.claves.map((clave) => (
              <button
                key={clave.letra}
                className={`${styles.option} ${optionClass(clave.letra)}`}
                onClick={() => handleSelect(clave.letra)}
              >
                <span className={styles.optionKey}>{clave.letra}</span>
                <span className={styles.optionText}>{clave.texto}</span>
              </button>
            ))}
          </div>

          {sel && !isRevealed && (
            <button className={`${styles.navBtn} ${styles.navBtnPrimary}`} onClick={handleReveal}>
              Verificar respuesta
            </button>
          )}

          {isRevealed && (
            <p style={{ fontSize: 13, color: sel === pregunta.respuesta ? '#2DC99A' : '#E85B4A', fontWeight: 600 }}>
              {sel === pregunta.respuesta ? '✓ Correcto' : `✗ Incorrecto — la respuesta es ${pregunta.respuesta}`}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.examFooter}>
        <button
          className={styles.navBtn}
          onClick={() => setCurrent((c) => c - 1)}
          disabled={current === 0}
        >
          ← Anterior
        </button>

        <div className={styles.progressDots}>
          {PREGUNTAS.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''} ${revealed[i] ? styles.dotDone : ''}`}
            />
          ))}
        </div>

        <button
          className={`${styles.navBtn} ${styles.navBtnPrimary}`}
          onClick={() => setCurrent((c) => c + 1)}
          disabled={current === PREGUNTAS.length - 1}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}
