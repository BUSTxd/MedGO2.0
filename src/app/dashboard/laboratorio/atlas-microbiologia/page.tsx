'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import TrackLabVisit from '@/components/TrackLabVisit';
import styles from '@/styles/laboratorio.module.css';

type Item = { nombre: string; pista: string };

const shuffle = <T,>(a: T[]): T[] =>
  a.map((v) => [Math.random(), v] as const).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

const ITEMS: Item[] = [
  { nombre: 'Staphylococcus aureus',       pista: 'Cocos grampositivos en racimos de uvas. Catalasa +, coagulasa +. Beta-hemólisis en agar sangre. Colonias doradas/amarillas en agar sal-manitol (MSA). DNasa +.' },
  { nombre: 'Streptococcus pneumoniae',    pista: 'Diplococos grampositivos lanceolados encapsulados. Alfa-hemólisis (verdosa). Sensible a optoquina (P disc). Soluble en bilis. Antígeno capsular en aglutinación de látex.' },
  { nombre: 'Streptococcus pyogenes',      pista: 'Cocos grampositivos en cadena. Beta-hemólisis completa. Sensible a bacitracina (grupo A). PYR +. Anti-estreptolisina O (ASO) elevada en infección reciente.' },
  { nombre: 'Escherichia coli',            pista: 'Bacilo gramnegativo fermentador de lactosa. Colonias rosadas en MacConkey. Indol +, rojo de metilo +, Voges-Proskauer −, citrato −. Hemólisis con UPEC.' },
  { nombre: 'Klebsiella pneumoniae',       pista: 'Bacilo gramnegativo encapsulado. Colonias mucoides en agar (cápsula abundante). Lactosa +, indol −, VP +, citrato +. Esputo con aspecto en gelatina de grosella. Resistencia por KPC.' },
  { nombre: 'Pseudomonas aeruginosa',      pista: 'Bacilo gramnegativo no fermentador. Pigmento azul-verdoso (piocianina) en agar. Oxidasa +. Olor a uva. Crecimiento a 42 °C. Resistencia intrínseca a múltiples antibióticos.' },
  { nombre: 'Mycobacterium tuberculosis',  pista: 'Bacilo ácido-alcohol resistente (BAAR): rojo sobre fondo azul en Ziehl-Neelsen. Cordón serpentino en cultivo. Crecimiento lento en Löwenstein-Jensen (3–8 semanas). Niacina +, catalasa a 68 °C −.' },
  { nombre: 'Neisseria meningitidis',      pista: 'Diplococos gramnegativos en forma de riñón, intracelulares en PMN. Cápsula polisacárida (serogrupos A, B, C, W, Y). Oxidasa +. Fermenta glucosa y maltosa. Causa meningitis bacteriana fulminante.' },
  { nombre: 'Neisseria gonorrhoeae',       pista: 'Diplococos gramnegativos intracelulares en PMN. Oxidasa +. Fermenta glucosa pero NO maltosa (diferencia de N. meningitidis). Sin cápsula. Requerimiento nutritivo exigente (Thayer-Martin).' },
  { nombre: 'Clostridium difficile',       pista: 'Bacilo grampositivo esporulado anaerobio estricto. Endospora subterminal. Colonias amarillas con olor a estiércol en agar CCFA. Toxinas A (enterotoxina) y B (citotoxina). Causa colitis pseudomembranosa.' },
  { nombre: 'Haemophilus influenzae',      pista: 'Cocobacilo gramnegativo pleomórfico. Requiere factor X (hemina) y factor V (NAD) para crecer. Fenómeno satelit alrededor de S. aureus en agar sangre. Cápsula tipo b → meningitis infantil.' },
  { nombre: 'Vibrio cholerae',             pista: 'Bacilo gramnegativo curvado en coma. Flagelo polar único. "Lluvia de estrellas" en campo oscuro. Oxidasa +. Crece en agar TCBS (colonias amarillas). Toxina del cólera activa adenilato ciclasa.' },
  { nombre: 'Helicobacter pylori',         pista: 'Bacilo gramnegativo helicoidal. Ureasa + (rápida, >95 % sensibilidad). Crece en Campylobacter agar a 37 °C en microaerofilia. Catalasa + y oxidasa +. Asociado a gastritis crónica y úlcera péptica.' },
  { nombre: 'Salmonella typhi',            pista: 'Bacilo gramnegativo no fermentador de lactosa (transparente en MacConkey). H2S + en TSI. Antígeno Vi de virulencia. Colonias negras en agar bismuto sulfito. Causa fiebre tifoidea con rose spots.' },
  { nombre: 'Bacillus anthracis',          pista: 'Bacilo grampositivo grande en cadenas paralelas ("cañas de bambú"). Endospora central. NO hemolítico en agar sangre. Cápsula de poly-D-glutamato. Inmóvil. Colonias en cabeza de medusa. Causa ántrax.' },
];

const EXPLAIN: Record<string, string> = {
  'Staphylococcus aureus':       'Gram + agrupado en racimos. La coagulasa es el factor de virulencia diferencial frente a estafilococos coagulasa-negativos. Produce toxinas (TSST-1, exfoliatina, leucocidina Panton-Valentine). Causa ITSB, endocarditis, neumonía necrosante.',
  'Streptococcus pneumoniae':    'Principal causa de neumonía extrahospitalaria, meningitis en adultos y otitis media. La optoquina y la bilis-solubilidad lo distinguen de otros alfa-hemolíticos. Vacunación con PCV13/PPSV23 disponible.',
  'Streptococcus pyogenes':      'Grupo A de Lancefield. Faringitis, impétigo, escarlatina, fascitis necrosante. Complicaciones inmunes: fiebre reumática (anti-estreptolisina M cruzada con miosina cardíaca) y glomerulonefritis postestreptocócica.',
  'Escherichia coli':            'Patógeno oportunista nº 1 en ITU. Patotipos diarreogénicos: EPEC, EHEC (O157:H7 → SHU), ETEC (diarrea del viajero), EIEC. En sepsis neonatal: K1 (mimetismo molecular con neuronas). Diagnóstico: coprocultivo + PCR para toxinas.',
  'Klebsiella pneumoniae':       'Causa neumonía en alcohólicos y diabéticos; neumonía cavitaria con esputo en jalea de grosella. Resistencia por carbapenemasas (KPC, NDM, OXA-48). En hospitales: ITU, bacteriemia, infecciones de herida. Elevada mortalidad en cepas XDR.',
  'Pseudomonas aeruginosa':      'Patógeno oportunista en pacientes con fibrosis quística, quemaduras, neutropenia. Forma biofilm. Piocianina → daño oxidativo. Resistencia intrínseca + adquirida. Tratamiento: carbapenems + aminoglucósidos o piperacilina-tazobactam.',
  'Mycobacterium tuberculosis':  'Bacilo de Koch. Pared rica en ácidos micólicos → resistencia a ácido-alcohol. Virulencia por factor cord (trehalosa-dimicolato). Tuberculina (PPD) detecta exposición. Tratamiento: HRZE 2 meses + HR 4 meses. Resistencia MDR/XDR: combinaciones según antibiograma.',
  'Neisseria meningitidis':      'Serogrupos principales: B (sin vacuna polisacárida eficaz → MenB proteica), C, W, Y. Petequias y púrpura fulminate → coagulación intravascular diseminada. Profilaxis: rifampicina o ciprofloxacino en contactos. Vacuna ACWY disponible.',
  'Neisseria gonorrhoeae':       'ETS causante de uretritis purulenta, cervicitis, EIP, artritis séptica y oftalmía neonatal. Diagnóstico gold: NAAT (PCR). Cultivo en Thayer-Martin para antibiograma. Tratamiento actual: ceftriaxona IM dosis única (resistencia a fluoroquinolonas extendida).',
  'Clostridium difficile':       'CDI: principal causa de diarrea nosocomial. Esporas resisten alcohol, sobreviven en superficies meses. Diagnóstico: GDH antígeno + NAAT o EIA toxinas en heces. Tratamiento: vancomicina oral o fidaxomicina. Recidivas frecuentes → FMT.',
  'Haemophilus influenzae':      'Tipo b encapsulado: meningitis, epiglotitis (antes de vacuna Hib). Tipo no tipificable: EPOC exacerbaciones, otitis media, sinusitis. Crecimiento satelit (V de S. aureus) en agar sangre: diagnóstico en laboratorio. Resistencia: beta-lactamasas.',
  'Vibrio cholerae':             'Serotipos O1 y O139 causan cólera epidémico. Toxina colérica: subunidad A activa AMPc → hipersecreción de cloro → diarrea en "agua de arroz" masiva. Tratamiento: rehidratación oral/IV (prioritaria) + doxiciclina. Reservorio: agua y mariscos.',
  'Helicobacter pylori':         'Presente en ~50 % de la población mundial. Produce ureasa → amoniaco neutraliza ácido gástrico local. CagA y VacA → inflamación crónica → úlcera péptica, linfoma MALT, adenocarcinoma gástrico. Eradicación: triple o cuádruple terapia.',
  'Salmonella typhi':            'Vi-antígeno inhibe fagocitosis. Roseta de Widal (aglutininas H y O). Fiebre en escalera 1ª semana, esplenomegalia, bradicardia relativa, roséola tífica. Hemocultivo + en fase aguda; coprocultivo + en 2ª–3ª semana. Tratamiento: ceftriaxona o fluoroquinolonas.',
  'Bacillus anthracis':          'Agente de bioterrorismo categoría A (CDC). Ántrax cutáneo (más frecuente): pústula maligna → escara negra indolora. Ántrax pulmonar (inhalación de esporas): síndrome mediastinal fulminante. Tratamiento: ciprofloxacino + antitoxina. Vacunación BioThrax en personal de riesgo.',
};

export default function AtlasMicrobiologiaPage() {
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
      <TrackLabVisit labId="atlas-microbiologia" />
      <svg className={styles.examPageIcon} width="180" height="180" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" fill="#5445d8" stroke="#5445d8" strokeWidth="2"/>
        <path d="m8 12-3-2M16 12l3-2M12 8l2-3M12 16l-2 3" stroke="#5445d8" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>

      <div className={styles.topBar}>
        <Link href="/dashboard/laboratorio" className={styles.backLink}>← Laboratorio virtual</Link>
        <span className={styles.counter}>Muestra {current + 1} / {questions.length}</span>
      </div>

      <div className={styles.examBody}>
        <div className={styles.viewerWrap}>
          <span className={styles.magBadge}>× 1000</span>

          <div className={styles.microscopeOuter}>
            <div className={styles.crosshair} />
            <div className={styles.specimen}>
              <div className={styles.specimenPlaceholder}>
                <svg className={styles.specimenIcon} width="52" height="52" viewBox="0 0 24 24" fill="none">
                  <circle cx="8"  cy="12" r="3" stroke="rgba(59,158,221,0.35)" strokeWidth="1.5" fill="none"/>
                  <circle cx="16" cy="9"  r="3" stroke="rgba(59,158,221,0.35)" strokeWidth="1.5" fill="none"/>
                  <circle cx="14" cy="17" r="2.5" stroke="rgba(59,158,221,0.35)" strokeWidth="1.5" fill="none"/>
                  <circle cx="8"  cy="12" r="0.8" fill="rgba(59,158,221,0.3)"/>
                  <circle cx="16" cy="9"  r="0.8" fill="rgba(59,158,221,0.3)"/>
                  <circle cx="14" cy="17" r="0.8" fill="rgba(59,158,221,0.3)"/>
                </svg>
                <span className={styles.specimenLabel}>Próximamente</span>
              </div>
              <div className={styles.specimenLens} />
            </div>
          </div>
        </div>

        <div className={styles.questionPanel}>
          <span className={styles.questionLabel}>Atlas de Microbiología</span>
          <p className={styles.questionText}>
            Identifique la bacteria con base en las siguientes características y pruebas diagnósticas:
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
