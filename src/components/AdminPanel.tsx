'use client';
import { useMemo, useState } from 'react';
import type { AdminData, AdminRow } from '@/lib/admin-data';
import styles from '@/styles/adminPage.module.css';
import accountStyles from '@/styles/accountPage.module.css';

type TabKey = 'activos' | 'free' | 'cancelados' | 'vencidos';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'activos',     label: 'Activos' },
  { key: 'free',        label: 'Free' },
  { key: 'cancelados',  label: 'Cancelados' },
  { key: 'vencidos',    label: 'Vencidos' },
];

function todayLima(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
}

function formatLastVisit(date: string | null): string {
  if (!date) return '—';
  const today = todayLima();
  if (date === today) return 'Hoy';
  const d0 = new Date(today + 'T00:00:00');
  const d1 = new Date(date + 'T00:00:00');
  const diff = Math.round((d0.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 1) return 'Ayer';
  if (diff > 1 && diff <= 30) return `hace ${diff} días`;
  return d1.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

function formatNextPayment(date: string | null): string {
  if (!date) return '—';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function planBadgeClass(plan: AdminRow['plan']): string {
  if (plan === 'interno')   return `${styles.planBadge} ${styles.planInterno}`;
  if (plan === 'residente') return `${styles.planBadge} ${styles.planResidente}`;
  return `${styles.planBadge} ${styles.planFree}`;
}

function planLabel(plan: AdminRow['plan']): string {
  if (plan === 'interno')   return 'Interno';
  if (plan === 'residente') return 'Residente';
  return 'Free';
}

function filterRows(rows: AdminRow[], tab: TabKey): AdminRow[] {
  const now = Date.now();
  switch (tab) {
    case 'activos':
      return rows.filter((r) => r.subStatus === 'authorized');
    case 'free':
      return rows.filter((r) => r.plan === 'free' && r.subStatus !== 'authorized');
    case 'cancelados':
      return rows.filter((r) => r.subStatus === 'cancelled');
    case 'vencidos':
      return rows.filter(
        (r) => r.plan !== 'free' && r.planExpiresAt && new Date(r.planExpiresAt).getTime() < now,
      );
  }
}

function sortRows(rows: AdminRow[], tab: TabKey): AdminRow[] {
  const sorted = [...rows];
  if (tab === 'activos') {
    sorted.sort((a, b) => {
      const da = a.nextPaymentDate ? new Date(a.nextPaymentDate).getTime() : Infinity;
      const db = b.nextPaymentDate ? new Date(b.nextPaymentDate).getTime() : Infinity;
      return da - db;
    });
  } else {
    sorted.sort((a, b) => {
      const da = a.lastVisitDate ? new Date(a.lastVisitDate).getTime() : 0;
      const db = b.lastVisitDate ? new Date(b.lastVisitDate).getTime() : 0;
      return db - da;
    });
  }
  return sorted;
}

export default function AdminPanel({ data }: { data: AdminData }) {
  const [tab, setTab] = useState<TabKey>('activos');

  const counts = useMemo(() => {
    return {
      activos:    filterRows(data.rows, 'activos').length,
      free:       filterRows(data.rows, 'free').length,
      cancelados: filterRows(data.rows, 'cancelados').length,
      vencidos:   filterRows(data.rows, 'vencidos').length,
    };
  }, [data.rows]);

  const visible = useMemo(() => sortRows(filterRows(data.rows, tab), tab), [data.rows, tab]);

  return (
    <>
      <div className={accountStyles.pagePanelIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF">
          <path fillRule="evenodd" d="M10 1l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V4l7-3zm0 5a2 2 0 100 4 2 2 0 000-4zm-3.5 8.5c0-1.8 1.6-3 3.5-3s3.5 1.2 3.5 3v.5h-7v-.5z" clipRule="evenodd"/>
        </svg>
      </div>

      <h1 className={accountStyles.pageTitle}>Panel admin</h1>
      <p className={accountStyles.pageSub}>
        {data.kpis.totalUsers} usuarios registrados
      </p>

      {/* ─── KPIs ─── */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <p className={styles.kpiLabel}>Activos</p>
          <p className={styles.kpiValue}>{data.kpis.activosTotal}</p>
          <p className={styles.kpiHint}>suscripciones pagadas</p>
        </div>
        <div className={styles.kpiCard}>
          <p className={styles.kpiLabel}>MRR estimado</p>
          <p className={styles.kpiValue}>S/{data.kpis.mrrSoles}</p>
          <p className={styles.kpiHint}>ingreso mensual recurrente</p>
        </div>
        <div className={styles.kpiCard}>
          <p className={styles.kpiLabel}>Activos hoy</p>
          <p className={styles.kpiValue}>{data.kpis.activosHoy}</p>
          <p className={styles.kpiHint}>visitaron el dashboard</p>
        </div>
        <div className={styles.kpiCard}>
          <p className={styles.kpiLabel}>Vencen en 7 días</p>
          <p className={styles.kpiValue}>{data.kpis.proximosAVencer}</p>
          <p className={styles.kpiHint}>próximos cobros</p>
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className={styles.tabBar} role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
          >
            {t.label}
            <span className={styles.tabCount}>{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* ─── Tabla ─── */}
      <div className={styles.tableWrap}>
        {visible.length === 0 ? (
          <div className={styles.empty}>No hay usuarios en esta categoría.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Plan</th>
                <th>Última visita</th>
                <th>Próximo pago</th>
                <th>Racha</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className={styles.email}>{r.email}</div>
                    {r.fullName && <div className={styles.name}>{r.fullName}</div>}
                  </td>
                  <td>
                    <span className={planBadgeClass(r.plan)}>{planLabel(r.plan)}</span>
                  </td>
                  <td>
                    {r.lastVisitDate
                      ? formatLastVisit(r.lastVisitDate)
                      : <span className={styles.muted}>—</span>}
                  </td>
                  <td>
                    {r.nextPaymentDate
                      ? formatNextPayment(r.nextPaymentDate)
                      : <span className={styles.muted}>—</span>}
                  </td>
                  <td>
                    {r.currentStreak > 0
                      ? <span className={styles.streak}>{r.currentStreak} 🔥</span>
                      : <span className={styles.muted}>0</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
