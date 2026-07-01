'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getMeta, getContenido } from '@/lib/investigacion/niveles';
import { useInvestigacionProgress } from '@/hooks/useInvestigacionProgress';
import styles from '@/styles/investigacionGame.module.css';

const NivelRunner = dynamic(() => import('@/components/investigacion/NivelRunner'), {
  ssr: false,
  loading: () => <div className={styles.cargando}>Cargando nivel…</div>,
});

function Gate({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className={styles.gate}>
      <div className={styles.gateIcon}>🔒</div>
      <h2 className={styles.gateTitulo}>{titulo}</h2>
      <p className={styles.gateTexto}>{texto}</p>
      <Link href="/dashboard/investigacion" className={styles.gateBtn}>
        ← Volver al mapa
      </Link>
    </div>
  );
}

export default function NivelPage() {
  const params = useParams();
  const nivelId = String(params?.nivel ?? '');
  const meta = getMeta(nivelId);
  const contenido = getContenido(nivelId);
  const { hydrated, isUnlocked } = useInvestigacionProgress();

  if (!meta || !meta.disponible || !contenido) {
    return (
      <Gate
        titulo="Nivel en construcción"
        texto="Este nivel aún no está disponible. Muy pronto podrás jugarlo."
      />
    );
  }

  if (hydrated && !isUnlocked(nivelId)) {
    return (
      <Gate
        titulo="Nivel bloqueado"
        texto="Completa el nivel anterior al 100% para desbloquear este."
      />
    );
  }

  return <NivelRunner meta={meta} contenido={contenido} />;
}
