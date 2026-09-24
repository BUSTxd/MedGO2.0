'use client';

import { useEffect, useState } from 'react';
import { semaforoDe, type Conteo, type ResumenValoraciones } from '@/lib/valoraciones';
import styles from '@/styles/adminPage.module.css';

const COLOR: Record<'rojo' | 'amarillo' | 'verde', string> = {
  rojo: styles.valRojo,
  amarillo: styles.valAmarillo,
  verde: styles.valVerde,
};

/** Barra apilada: cuánto de cada color, sobre el total de votos. */
function Barra({ c }: { c: Conteo }) {
  const n = c.rojo + c.amarillo + c.verde;
  if (!n) return <span className={styles.valBarra} />;
  return (
    <span className={styles.valBarra} title={`${c.rojo} rojo · ${c.amarillo} amarillo · ${c.verde} verde`}>
      {(['rojo', 'amarillo', 'verde'] as const).map(k =>
        c[k] > 0 ? <span key={k} className={`${styles.valTramo} ${COLOR[k]}`} style={{ width: `${(c[k] / n) * 100}%` }} /> : null,
      )}
    </span>
  );
}

function Nota({ nota }: { nota: number }) {
  const color = semaforoDe(nota) ?? 'amarillo';
  return (
    <span className={styles.valNota}>
      <span className={`${styles.valPunto} ${COLOR[color]}`} aria-hidden="true" />
      <strong>{nota}</strong>
      <span className={styles.muted}>/100</span>
    </span>
  );
}

/**
 * Lo que los alumnos opinan de cada pregunta del quiz (semáforo del pie de la
 * pregunta). Las clases y las preguntas peor valoradas salen primero: son las
 * que hay que reescribir.
 */
export default function ValoracionesAdmin() {
  const [datos, setDatos] = useState<ResumenValoraciones | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch('/api/admin/valoraciones', { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: ResumenValoraciones) => { if (vivo) setDatos(d); })
      .catch(() => { if (vivo) setError(true); });
    return () => { vivo = false; };
  }, []);

  return (
    <section className={styles.cursosSection}>
      <div className={styles.cursosHead}>
        <div>
          <h2 className={styles.cursosTitle}>Valoración de las preguntas</h2>
          <p className={styles.cursosSub}>
            Al terminar cada pregunta del quiz el alumno la marca en rojo, amarillo o verde según qué tan bien armada está.
            La nota es 0 por rojo, 50 por amarillo y 100 por verde, promediada. Las peor valoradas van primero.
          </p>
        </div>
        <a className={styles.descargar} href="/api/admin/valoraciones?formato=csv" download>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v7.59l2.3-2.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.42l2.3 2.3V4a1 1 0 011-1zM4 15a1 1 0 011 1v1h10v-1a1 1 0 112 0v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Descargar valoraciones
        </a>
      </div>

      {error ? (
        <div className={styles.empty}>No se pudieron cargar las valoraciones.</div>
      ) : !datos ? (
        <div className={styles.empty}>Cargando…</div>
      ) : datos.total === 0 ? (
        <div className={styles.empty}>Aún nadie ha valorado una pregunta.</div>
      ) : (
        <>
          <div className={styles.valResumen}>
            <span><strong>{datos.total}</strong> valoraciones</span>
            <span className={styles.valChip}><span className={`${styles.valPunto} ${styles.valVerde}`} />{datos.verde}</span>
            <span className={styles.valChip}><span className={`${styles.valPunto} ${styles.valAmarillo}`} />{datos.amarillo}</span>
            <span className={styles.valChip}><span className={`${styles.valPunto} ${styles.valRojo}`} />{datos.rojo}</span>
          </div>

          <div className={styles.valClases}>
            {datos.clases.map(c => (
              <details key={c.key} className={styles.valClase}>
                <summary className={styles.valClaseHead}>
                  <span className={styles.valClaseNombre}>{c.titulo}</span>
                  <Barra c={c} />
                  <span className={styles.valVotos}>{c.total} {c.total === 1 ? 'voto' : 'votos'}</span>
                  <Nota nota={c.satisfaccion} />
                </summary>
                <ol className={styles.valPreguntas}>
                  {c.preguntas.map(p => (
                    <li key={p.id} className={styles.valPregunta}>
                      <span className={styles.valId}>{p.id}</span>
                      <span className={styles.valEnunciado}>{p.enunciado || 'Pregunta no encontrada en el banqueo'}</span>
                      <Barra c={p} />
                      <span className={styles.valVotos}>
                        <span className={styles.valRojoTxt}>{p.rojo}</span> · <span className={styles.valAmarilloTxt}>{p.amarillo}</span> · <span className={styles.valVerdeTxt}>{p.verde}</span>
                      </span>
                      <Nota nota={p.satisfaccion} />
                    </li>
                  ))}
                </ol>
              </details>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
