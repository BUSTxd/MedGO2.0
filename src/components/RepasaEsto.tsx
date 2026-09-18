'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { desgloseAcumulado, MINIMO_ACUMULADO, UMBRAL_FLOJO, type Desglose } from '@/lib/temas-flojos';
import styles from '@/styles/dashboardPages.module.css';

export default function RepasaEsto() {
  const [items, setItems] = useState<Desglose[]>([]);
  const [cursos, setCursos] = useState(0);

  useEffect(() => {
    const todo = desgloseAcumulado();
    setCursos(new Set(todo.map(d => d.curso)).size);
    // Un tema sin clase mapeada no tiene a dónde llevar: queda fuera del panel.
    setItems(
      todo
        .filter(d => d.total >= MINIMO_ACUMULADO && d.pct < UMBRAL_FLOJO && d.clases.length > 0)
        .slice(0, 3),
    );
  }, []);

  // Sin datos no se pinta nada: un panel vacío prometería algo que sólo se
  // desbloquea terminando un banqueo, y rompería la fila de tres del grid.
  if (items.length === 0) return null;

  return (
    <div className={styles.dashboardPanel}>
      <h3 className={styles.dashboardPanelTitle}>Repasa esto</h3>
      {items.map(d => {
        const clase = d.clases[0];
        return (
          <Link
            key={`${d.curso}-${d.temaId}`}
            href={`/dashboard/cursos/${d.curso}/${clase.claseId}${clase.conResumen ? '?resumen=1' : ''}`}
            className={styles.repasaItem}
          >
            <span className={styles.repasaTema}>{d.label}</span>
            {cursos > 1 && <span className={styles.repasaCurso}>{d.curso}</span>}
            <span className={styles.repasaBarra}>
              <span className={styles.repasaBarraFill} style={{ width: `${d.pct}%` }} />
            </span>
            <span className={styles.repasaClase}>
              <strong>{clase.codigo}</strong> — {clase.titulo}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
