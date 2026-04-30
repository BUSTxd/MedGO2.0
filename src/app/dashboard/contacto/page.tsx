import styles from '@/styles/dashboardPages.module.css';

const CONTACTS = [
  {
    id: 'email',
    badge: 'Principal',
    title: 'Correo Principal',
    summary: 'contacto@medgo.pe',
    pill: { label: 'Consultas generales', cls: styles.pillOk },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5445d8" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    id: 'whatsapp',
    badge: 'WhatsApp',
    title: 'WhatsApp',
    summary: '+51 999 123 456',
    pill: { label: 'Atención personalizada', cls: styles.pillWarn },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5445d8" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'support',
    badge: 'Técnico',
    title: 'Soporte Técnico',
    summary: 'soporte@medgo.pe',
    pill: { label: 'Problemas y errores', cls: styles.pillBad },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5445d8" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    id: 'feedback',
    badge: 'Ideas',
    title: 'Sugerencias',
    summary: 'feedback@medgo.pe',
    pill: { label: 'Mejoras y funciones', cls: styles.pillOk },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5445d8" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: 'team',
    badge: 'Equipo',
    title: 'Colaboraciones',
    summary: 'equipo@medgo.pe',
    pill: { label: 'Únete al equipo', cls: styles.pillWarn },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#5445d8" stroke="#5445d8" strokeWidth="0.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
  {
    id: 'admin',
    badge: 'Premium',
    title: 'Administración',
    summary: 'admin@medgo.pe',
    pill: { label: 'Cuenta y facturación', cls: styles.pillBad },
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5445d8" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

export default function ContactoPage() {
  return (
    <>
      <div className={styles.pagePanelIcon}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="#9CA3AF">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
        </svg>
      </div>

      <h2 className={styles.pageTitle}>Contáctanos</h2>
      <p className={styles.pageSub}>Estamos aquí para ayudarte en tu camino hacia la excelencia médica.</p>

      <div className={styles.contactGrid}>
        {CONTACTS.map((c) => (
          <div key={c.id} className={styles.contactCard}>
            <div className={styles.contactCardIcon}>{c.icon}</div>
            <span className={styles.contactBadge}>{c.badge}</span>
            <h3 className={styles.contactTitle}>{c.title}</h3>
            <p className={styles.contactSummary}>{c.summary}</p>
            <div className={styles.contactMeta}>
              <span className={`${styles.contactPill} ${c.pill.cls}`}>{c.pill.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.contactInfoPanel}>
        <div>
          <span className={styles.contactInfoBadge}>Horarios</span>
          <h3 className={styles.contactInfoTitle}>Horarios de Atención</h3>
          <div className={styles.contactSchedule}>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleDay}>Lunes – Viernes</span>
              <span className={styles.scheduleTime}>9:00 AM – 6:00 PM</span>
            </div>
            <div className={styles.scheduleItem}>
              <span className={styles.scheduleDay}>Sábados</span>
              <span className={styles.scheduleTime}>10:00 AM – 2:00 PM</span>
            </div>
            <div className={`${styles.scheduleItem} ${styles.scheduleDimmed}`}>
              <span className={styles.scheduleDay}>Domingos</span>
              <span className={styles.scheduleTime}>Cerrado</span>
            </div>
          </div>
        </div>
        <div>
          <span className={styles.contactInfoBadge}>Ayuda</span>
          <h3 className={styles.contactInfoTitle}>¿Necesitas ayuda inmediata?</h3>
          <p className={styles.contactInfoText}>
            Revisa nuestra sección de <strong>Preguntas Frecuentes</strong> o envíanos un mensaje
            directo por WhatsApp para recibir atención personalizada.
          </p>
          <div className={styles.contactActions}>
            <a href="https://wa.me/51999123456" className={styles.contactActionPrimary} target="_blank" rel="noopener">
              Abrir WhatsApp
            </a>
            <a href="/#FAQ" className={styles.contactActionSecondary}>
              Ver FAQ
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
