import styles from '@/styles/offerValidation.module.css';

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

const bloques = [
  {
    title: 'Lo que incluye, sin letra chica',
    items: [
      'Acceso desde el primer día — sin esperar setup.',
      'Plan Residente cancelable en cualquier momento.',
      'Pago seguro vía Mercado Pago. No almacenamos datos de tarjeta.',
    ],
  },
  {
    title: 'Contenido real ya disponible',
    items: [
      '29 clases de Microbiología con sílabo UPCH M2058.',
      'Atlas de Micología con identificación microscópica.',
      'Sílabos de Cardiovascular, Excretor y Farmacología.',
      'Laboratorio virtual de microscopía + TBLs activos.',
    ],
  },
  {
    title: 'Garantía de honestidad',
    items: [
      'Si exploras el plan gratuito y no ves valor, no te pedimos que pagues.',
      'Sin trucos de retención: cancelar significa cancelar.',
      'Términos y compromisos publicados de forma clara y visible.',
    ],
  },
];

export default function OfferValidation() {
  return (
    <section id="garantias">
      <div className="section-inner reveal">
        <span className="section-tag" style={{ color: '#2DC99A' }}>Por qué confiar</span>
        <h2 className="section-title">
          Antes de decidir,<br />
          <em style={{ fontStyle: 'normal', color: '#2DC99A' }}>esto es lo que tienes que saber.</em>
        </h2>
        <p className="section-sub">
          No hay promesas vagas ni asteriscos. Estos son los tres frentes en los que MedGO se compromete contigo.
        </p>

        <div className={styles.grid}>
          {bloques.map((b) => (
            <div key={b.title} className={styles.card}>
              <h3 className={styles.title}>{b.title}</h3>
              <ul className={styles.list}>
                {b.items.map((it) => (
                  <li key={it} className={styles.item}>
                    <span className={styles.check}><CheckIcon /></span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
