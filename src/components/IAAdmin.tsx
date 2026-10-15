'use client';

import { useCallback, useEffect, useState } from 'react';
import styles from '@/styles/adminPage.module.css';

interface Resumen {
  modelo: string;
  configurada: boolean;
  abierta: boolean;
  topeDiarioUsd: number;
  creditosPorUsd: number;
  hoy: { usd: number; consultas: number };
  mes: { usd: number; consultas: number; usuarios: number };
  porAccion: Record<string, { usd: number; consultas: number }>;
  top: { email: string; usd: number; consultas: number; creditos: number }[];
}

const usd = (n: number) => `US$ ${n.toFixed(n < 1 ? 4 : 2)}`;
const ACCIONES: Record<string, string> = {
  definir: '¿Qué significa?', explicar: 'Explícame', figura: 'Figura', resumir: 'Resumir todo', libre: 'Chat libre',
};

/**
 * MedGO IA en el panel admin: cuánto cuesta de verdad (del libro contable
 * `ia_movimientos`), quién consume más y un abono manual de créditos para
 * probar o compensar a alguien.
 */
export default function IAAdmin() {
  const [datos, setDatos] = useState<Resumen | null>(null);
  const [email, setEmail] = useState('');
  const [creditos, setCreditos] = useState('10000');
  const [estado, setEstado] = useState<string | null>(null);

  const cargar = useCallback(() => {
    fetch('/api/admin/ia', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then(setDatos)
      .catch(() => setDatos(null));
  }, []);
  useEffect(cargar, [cargar]);

  const abonar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado('Abonando…');
    const r = await fetch('/api/admin/ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, creditos: Number(creditos) }),
    });
    const j = await r.json().catch(() => ({}));
    setEstado(r.ok ? `Listo: ${Number(creditos).toLocaleString('es-PE')} créditos a ${email}.` : `Error: ${j.error ?? r.status}`);
  };

  return (
    <section className={styles.cursosSection}>
      <div className={styles.cursosHead}>
        <div>
          <h2 className={styles.cursosTitle}>MedGO IA</h2>
          <p className={styles.cursosSub}>
            {datos
              ? <>{datos.modelo} · {datos.abierta ? 'abierta a los planes de pago' : 'solo admin (sin lanzar)'} · {datos.configurada ? 'clave configurada' : <strong>falta ANTHROPIC_API_KEY</strong>} · tope diario {usd(datos.topeDiarioUsd)}</>
              : 'Cargando…'}
          </p>
        </div>
      </div>

      {datos && (
        <>
          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <p className={styles.kpiLabel}>Gasto hoy</p>
              <p className={styles.kpiValue}>{usd(datos.hoy.usd)}</p>
              <p className={styles.kpiHint}>{datos.hoy.consultas} consultas</p>
            </div>
            <div className={styles.kpiCard}>
              <p className={styles.kpiLabel}>Gasto del mes</p>
              <p className={styles.kpiValue}>{usd(datos.mes.usd)}</p>
              <p className={styles.kpiHint}>{datos.mes.consultas} consultas · {datos.mes.usuarios} alumnos</p>
            </div>
            <div className={styles.kpiCard}>
              <p className={styles.kpiLabel}>Costo medio</p>
              <p className={styles.kpiValue}>{usd(datos.mes.consultas ? datos.mes.usd / datos.mes.consultas : 0)}</p>
              <p className={styles.kpiHint}>por consulta este mes</p>
            </div>
          </div>

          {Object.keys(datos.porAccion).length > 0 && (
            <ol className={styles.rankList}>
              {Object.entries(datos.porAccion).map(([a, v]) => (
                <li key={a} className={styles.rankItem}>
                  <span className={styles.rankName}>{ACCIONES[a] ?? a}</span>
                  <span className={styles.rankNum}><strong>{v.consultas}</strong> · {usd(v.usd)}</span>
                </li>
              ))}
            </ol>
          )}

          {datos.top.length === 0 ? (
            <div className={styles.empty}>Aún no hay consultas este mes.</div>
          ) : (
            <ol className={styles.rankList}>
              {datos.top.map((t) => (
                <li key={t.email} className={styles.rankItem}>
                  <span className={styles.rankName}>{t.email}</span>
                  <span className={styles.rankNum}>
                    <strong>{usd(t.usd)}</strong>
                    <span className={styles.muted}> · {t.consultas} consultas · {t.creditos.toLocaleString('es-PE')} créditos</span>
                  </span>
                </li>
              ))}
            </ol>
          )}

          <form onSubmit={abonar} className={styles.iaForm}>
            <input
              type="email" required placeholder="correo del alumno" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.iaInput}
            />
            <input
              type="number" required value={creditos} onChange={(e) => setCreditos(e.target.value)}
              className={`${styles.iaInput} ${styles.iaInputNum}`}
            />
            <button type="submit" className={styles.descargar}>
              Abonar créditos
            </button>
            {estado && <span className={styles.muted}>{estado}</span>}
          </form>
        </>
      )}
    </section>
  );
}
