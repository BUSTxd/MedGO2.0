'use client';

import { useState } from 'react';
import styles from '@/styles/faq.module.css';

const faqs = [
  {
    q: '¿El contenido sigue exactamente mi sílabo universitario?',
    a: 'Sí. Al ingresar tu universidad y carrera, MedGO mapea cada tema del sílabo oficial con nuestras lecciones. Si tu sílabo tiene variaciones, puedes ajustarlo manualmente desde tu perfil.',
  },
  {
    q: '¿Qué pasa si mi universidad no está en la lista?',
    a: 'Puedes ingresar tu sílabo manualmente en formato PDF o texto. Nuestro sistema lo procesa y genera tu ruta de estudio en minutos. También puedes usar los sílabos estándar de UNMSM como referencia.',
  },
  {
    q: '¿Puedo compartir mi cuenta con un compañero?',
    a: 'Cada cuenta es personal ya que el progreso, los quizzes y la ruta son individuales. Sin embargo, con el plan Pro puedes formar grupos de estudio con tus compañeros.',
  },
  {
    q: '¿Los cursos incluyen imágenes histológicas y casos clínicos?',
    a: 'Sí. Los cursos de Microbiología y Cardiología incluyen imágenes de atlas, casos clínicos comentados y videos de procedimientos. El contenido varía según el plan elegido.',
  },
  {
    q: '¿Cómo cancelo mi suscripción?',
    a: 'Puedes cancelar en cualquier momento desde tu panel de cuenta. No hay penalidades ni periodos mínimos. Mantendrás acceso hasta el fin del período pagado.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="contacto">
      <div className="section-inner reveal">
        <span className="section-tag">FAQ</span>
        <h2 className="section-title">Preguntas frecuentes.</h2>
        <p className="section-sub">Todo lo que necesitas saber antes de empezar.</p>
        <div className={styles.list}>
          {faqs.map((f, i) => (
            <div className={`${styles.item} ${open === i ? styles.open : ''}`} key={i}>
              <button className={styles.question} onClick={() => setOpen(open === i ? null : i)}>
                {f.q}
                <span className={styles.chevron}>▾</span>
              </button>
              <div className={styles.answer}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
