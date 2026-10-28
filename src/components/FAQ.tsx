'use client';

import { useState } from 'react';
import { PLANS, type PlanKey } from '@/lib/plans';
import styles from '@/styles/faq.module.css';

/**
 * La respuesta sobre cancelación se compone del catálogo y no se escribe a
 * mano: la permanencia de cada plan (`commitmentMonths`) y si está a la venta
 * salen de `PLANS`.
 *
 * El texto fijo que había aquí ya se desincronizó una vez: decía que sólo
 * Interno tenía compromiso, cuando UFBI mensual también lo tiene — y era
 * justamente el comprador de UFBI el que menos avisos veía antes de pagar.
 */
function respuestaCancelacion(): string {
  const claves = Object.keys(PLANS) as PlanKey[];
  const dePago = claves.filter((k) => PLANS[k].amount > 0 && PLANS[k].aLaVenta);
  const conLock = dePago.filter((k) => (PLANS[k].commitmentMonths ?? 0) > 0);
  const sinLock = dePago.filter((k) => !PLANS[k].commitmentMonths);

  const lista = (nombres: string[]) => {
    if (nombres.length <= 1) return nombres[0] ?? '';
    return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
  };

  const partes: string[] = [];

  if (conLock.length) {
    // Cada plan con su propia permanencia (Residente 12, Especialista 24).
    const conMeses = conLock.map((k) => `${PLANS[k].label} (${PLANS[k].commitmentMonths} meses)`);
    const varios = conLock.length > 1;
    partes.push(
      `${varios ? 'Los planes con permanencia' : 'El plan con permanencia'}, ${lista(conMeses)}, ` +
      'se pueden cancelar desde Mi cuenta una vez cumplida.',
    );
  }

  if (sinLock.length) {
    const varios = sinLock.length > 1;
    partes.push(
      `${lista(sinLock.map((k) => PLANS[k].label))} ${varios ? 'se cancelan' : 'se cancela'} cuando quieras ` +
      'desde Mi cuenta — mantienes el acceso hasta el final del periodo pagado.',
    );
  }

  partes.push('En ningún caso hay devolución del periodo en curso.');
  return partes.join(' ');
}

const faqs = [
  {
    q: '¿Para qué universidad y años está disponible MedGO?',
    a: 'Por ahora MedGO está enfocado 100% en la Universidad Peruana Cayetano Heredia (UPCH), cubriendo los primeros 3 años de la carrera de Medicina. Estamos trabajando para sumar más universidades y años más adelante.',
  },
  {
    q: '¿Tienen todos los cursos?',
    a: 'Sí. Contamos con todos los cursos de los primeros 3 años de Medicina de la UPCH, con su sílabo oficial: subtemas, fechas, docentes y prácticas de cada clase.',
  },
  {
    q: '¿El contenido sigue exactamente el sílabo de Cayetano?',
    a: 'Sí. Cada tema está mapeado con el sílabo oficial de la UPCH para los primeros 3 años de Medicina, así sabes exactamente qué viene cada semana y qué entra en cada evaluación.',
  },
  {
    q: '¿Los cursos incluyen imágenes histológicas y casos clínicos?',
    a: 'Sí. Encontrarás atlas con imágenes microscópicas reales, laboratorios virtuales interactivos y modelos 3D para estudiar cada estructura. El contenido disponible varía según el plan elegido.',
  },
  {
    q: '¿Puedo compartir mi cuenta con un compañero?',
    a: 'Cada cuenta es personal: el progreso, los exámenes y tu ruta de estudio son individuales. Además, cada cuenta tiene un límite de dispositivos por seguridad.',
  },
  {
    q: '¿Cómo cancelo mi suscripción?',
    a: respuestaCancelacion(),
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
