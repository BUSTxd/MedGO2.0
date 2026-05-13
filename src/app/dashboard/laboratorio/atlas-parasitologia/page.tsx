'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/laboratorio.module.css';

type Item = { nombre: string; pista: string };

const shuffle = <T,>(a: T[]): T[] =>
  a.map((v) => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

const ITEMS: Item[] = [
  { nombre: 'Plasmodium falciparum',      pista: 'Anillo delgado en eritrocito de tamaño normal. Posibles infecciones múltiples por eritrocito. Gránulos de Maurer en Giemsa. Sin agrandamiento del eritrocito.' },
  { nombre: 'Plasmodium vivax',           pista: 'Eritrocito agrandado con granulaciones de Schüffner. Trofozoíto ameboide con seudópodos. Esquizonte con 12–24 merozoítos. Causa recidivas por hipnozoítos hepáticos.' },
  { nombre: 'Toxoplasma gondii',          pista: 'Taquizoítos en media luna (6×2 µm) dentro de macrófagos en fase aguda. Quistes con bradizoítos y pared gruesa en tejido cerebral en fase crónica.' },
  { nombre: 'Giardia lamblia',            pista: 'Trofozoíto piriforme (cuerpo de kite) con 2 núcleos simétricos y disco suctor ventral. Quiste ovalado con 4 núcleos. Causa esteatorrea y malabsorción.' },
  { nombre: 'Entamoeba histolytica',      pista: 'Seudópodos hialinos unidireccionales. Eritrocitos fagocitados en citoplasma del trofozoíto (hallazgo patognomónico). Quiste con 4 núcleos y barras cromatoidales.' },
  { nombre: 'Leishmania spp.',            pista: 'Amastigotes intracelulares redondos (2–4 µm) con quinetoplasto visible en Giemsa. Promastigotos flagelados en el vector Phlebotomus. Macrófagos repletos de parásitos.' },
  { nombre: 'Trypanosoma cruzi',          pista: 'Tripomastigoto en forma de C o U en sangre periférica. Kinetoplasto grande subterminal. Amastigotes en pseudoquistes musculares. Vector: chinche Triatoma.' },
  { nombre: 'Trypanosoma brucei',         pista: 'Tripomastigoto delgado con kinetoplasto pequeño. Membrana ondulante prominente. Sin forma de quiste. Vector: mosca tsetsé (Glossina). Causa sueño africano.' },
  { nombre: 'Ascaris lumbricoides',       pista: 'Huevo ovalado con cubierta mamelonada marrón-albuminoide. Larva migra por pulmón (ciclo de Löeffler). Adulto 15–35 cm en intestino delgado. Puede causar obstrucción.' },
  { nombre: 'Taenia solium',              pista: 'Escólex con 4 ventosas y corona doble de ganchos (armada). Proglótide grávida con útero de 7–13 ramas laterales. Cisticerco en músculo y SNC. Causa epilepsia.' },
  { nombre: 'Necator americanus',         pista: 'Boca con placa cortante (anquilostoma). Huevos ovalados de pared delgada con blastómeros. Larva filariforme penetra piel activamente. Causa anemia ferropénica crónica.' },
  { nombre: 'Schistosoma mansoni',        pista: 'Huevo grande con espícula lateral característica. Miracidio penetra Biomphalaria. Cercaria bifurcada penetra piel. Esquistosomula migra a sistema porta. Causa hipertensión portal.' },
  { nombre: 'Trichomonas vaginalis',      pista: 'Flagelado piriforme (10–20 µm) con 4 flagelos anteriores y membrana ondulante. Solo existe como trofozoíto (sin quiste). Movimiento en tirabuzón característico.' },
  { nombre: 'Cryptosporidium parvum',     pista: 'Oocisto redondo (4–6 µm) con 4 esporozoítos. Ácido-resistente en Ziehl-Neelsen modificado (rojo intenso). Intracelular extracitoplasmático en el borde del enterocito.' },
  { nombre: 'Strongyloides stercoralis',  pista: 'Larva rhabditiforme con esófago corto y bulboso. Larva filariforme (infectante) con esófago largo. Único nematodo con ciclo de autoinfección interna. Hembra partenogenética en mucosa.' },
];

const EXPLAIN: Record<string, string> = {
  'Plasmodium falciparum':     'El único Plasmodium que produce múltiples anillos por eritrocito. No agranda el eritrocito. Gránulos de Maurer. Causa malaria grave por roseta eritrocítica y secuestro microvascular en capilares cerebrales.',
  'Plasmodium vivax':          'Invade reticulocitos (eritrocitos jóvenes). Granulaciones de Schüffner características. Hipnozoítos hepáticos producen recidivas meses o años después. Causa malaria terciaria benigna.',
  'Toxoplasma gondii':         'Apicomplexa intracelular obligado. En inmunocompetente suele ser asintomático; en inmunosuprimido (VIH, trasplante) reactiva quistes cerebrales. Hospedero definitivo: felinos. Transmisión: heces de gato, carne cruda, congénita.',
  'Giardia lamblia':           'Flagelado de ciclo directo (fecal-oral). Se adhiere a enterocitos por disco suctor y causa malabsorción sin invasión tisular. Diagnóstico: quistes en heces, trofozoítos en heces diarreicas, ELISA Ag o PCR.',
  'Entamoeba histolytica':     'La presencia de eritrocitos en el citoplasma distingue E. histolytica (invasora) de E. dispar (no patógena). Produce úlceras en botón de camisa en colon. Puede causar absceso hepático amebiano.',
  'Leishmania spp.':           'Dimórfico: promastigoto en vector, amastigoto en macrófago humano. Leishmania donovani → visceral (kala-azar); L. braziliensis → mucocutánea; L. major → cutánea. Diagnóstico: biopsia con tinción Giemsa.',
  'Trypanosoma cruzi':         'Forma americana: enfermedad de Chagas. Fase aguda con tripomastigotes en sangre y chagoma. Fase crónica: cardiomiopatía (megacorazón) y megavísceras. Transmisión: deyecciones de vinchuca sobre piel lesionada.',
  'Trypanosoma brucei':        'Forma africana: tripanosomiasis del sueño. T. brucei gambiense (crónica, África occidental) y T. brucei rhodesiense (aguda, África oriental). Cruce barrera hematoencefálica → encefalitis. Diagnóstico: frotis, CATT.',
  'Ascaris lumbricoides':      'Helminto de mayor tamaño. Las hembras depositan 200 000 huevos/día. Ciclo pulmonar (Löeffler): larva pasa por alvéolos, sube tráquea, se deglute y madura en intestino. Complicaciones: obstrucción intestinal, migración biliar.',
  'Taenia solium':             'Teniasis (adulto intestinal) vs. cisticercosis (larva en tejidos). Neurocisticercosis: causa más frecuente de epilepsia adquirida en Latinoamérica. Diagnóstico: proglótides en heces, Western blot en LCR/suero, neuroimagen.',
  'Necator americanus':        'Anquilostomosis: principal causa de anemia ferropénica por helmintos. Larva filariforme penetra piel descalza → pulmón (ciclo de Löeffler leve) → intestino. Diagnóstico: huevos en examen de heces (sedimentación o flotación).',
  'Schistosoma mansoni':       'Macho y hembra unidos permanentemente. El huevo con espícula lateral es patognomónico de S. mansoni. La reacción granulomatosa hepática a los huevos produce fibrosis periportal de Symmers y hipertensión portal.',
  'Trichomonas vaginalis':     'ETS no viral más frecuente. Sin forma quística → transmisión sexual directa. Diagnóstico: examen directo en fresco (movimiento tirabuzón), Pap (sensibilidad baja), NAAT. Tratar a ambos compañeros con metronidazol.',
  'Cryptosporidium parvum':    'Causa diarrea acuosa autolimitada en inmunocompetentes. En VIH+ con CD4 <200: diarrea coleriforme grave y colangiopatía. Resistente a cloro. Diagnóstico: Ziehl-Neelsen modificado, ELISA Ag, inmunoflurorescencia directa.',
  'Strongyloides stercoralis': 'La autoinfección permite persistencia décadas sin reexposición. En inmunosupresión (corticoides, HTLV-I): síndrome de hiperinfección con larvas en todos los tejidos y bacteriemia por arrastre de gramnegativos intestinales.',
};

export default function AtlasParasitologiaPage() {
  const questions = useMemo(() => {
    const shuffled = shuffle(ITEMS);
    const names = ITEMS.map((i) => i.nombre);
    return shuffled.map((item) => {
      const wrongs = shuffle(names.filter((n) => n !== item.nombre)).slice(0, 4);
      return { item, options: shuffle([item.nombre, ...wrongs]) };
    });
  }, []);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const q = questions[current];
  const sel = selected[current];
  const isRevealed = revealed[current];

  const onSel = (h: string) => { if (!isRevealed) setSelected((p) => ({ ...p, [current]: h })); };
  const reveal = () => sel && setRevealed((p) => ({ ...p, [current]: true }));
  const optClass = (h: string) => {
    if (!isRevealed) return sel === h ? styles.optionSelected : '';
    if (h === q.item.nombre) return styles.optionCorrect;
    if (h === sel) return styles.optionWrong;
    return '';
  };

  return (
    <div className={styles.examPage}>
      <svg className={styles.examPageIcon} width="180" height="180" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="#5445d8" strokeWidth="1.5" fill="none"/>
        <path d="M12 4 Q16 8 12 12 Q8 16 12 20" stroke="#5445d8" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <circle cx="12" cy="12" r="2" fill="#5445d8"/>
        <circle cx="12" cy="4"  r="1.2" fill="#5445d8"/>
        <circle cx="12" cy="20" r="1.2" fill="#5445d8"/>
      </svg>

      <div className={styles.topBar}>
        <Link href="/dashboard/laboratorio" className={styles.backLink}>← Laboratorio virtual</Link>
        <span className={styles.counter}>Muestra {current + 1} / {questions.length}</span>
      </div>

      <div className={styles.examBody}>
        <div className={styles.viewerWrap}>
          <span className={styles.magBadge}>× 400</span>

          <div className={styles.microscopeOuter}>
            <div className={styles.crosshair} />
            <div className={styles.specimen}>
              <div className={styles.specimenPlaceholder}>
                <svg className={styles.specimenIcon} width="52" height="52" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="rgba(59,158,221,0.35)" strokeWidth="1.5"/>
                  <path d="M12 5 Q16 9 12 12 Q8 15 12 19" stroke="rgba(59,158,221,0.45)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  <circle cx="12" cy="12" r="2" fill="rgba(59,158,221,0.3)"/>
                </svg>
                <span className={styles.specimenLabel}>Próximamente</span>
              </div>
              <div className={styles.specimenLens} />
            </div>
          </div>
        </div>

        <div className={styles.questionPanel}>
          <span className={styles.questionLabel}>Atlas de Parasitología</span>
          <p className={styles.questionText}>
            Identifique el parásito con base en las siguientes características morfológicas:
          </p>

          <div style={{
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid rgba(59,158,221,0.2)',
            background: 'rgba(59,158,221,0.05)',
            fontSize: 13,
            lineHeight: 1.6,
            textAlign: 'left',
          }}>
            {q.item.pista}
          </div>

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
              <p style={{ fontSize: 13, color: sel === q.item.nombre ? '#2DC99A' : '#E85B4A', fontWeight: 600 }}>
                {sel === q.item.nombre
                  ? '✓ Correcto'
                  : <><span>✗ Incorrecto — la respuesta es </span><em>{q.item.nombre}</em></>}
              </p>
              {EXPLAIN[q.item.nombre] && (
                <div className={styles.explanation}>
                  <span className={styles.explanationTitle}>
                    <span className={styles.explanationName}>{q.item.nombre}</span> — características clínicas
                  </span>
                  {EXPLAIN[q.item.nombre]}
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
