import type { AreaEncib } from '@/lib/data/encib';
import LocomotorIcon from '@/components/icons/LocomotorIcon';
import ReproductiveIcon from '@/components/icons/ReproductiveIcon';
import BiologiaCelularIcon from '@/components/icons/BiologiaCelularIcon';
import QuimicaOrganicaIcon from '@/components/icons/QuimicaOrganicaIcon';
import HeartIcon from '@/components/icons/HeartIcon';
import MicroscopeIcon from '@/components/icons/MicroscopeIcon';

/**
 * Ícono blanco de cada área, para ir sobre su caja de color. Reutiliza los
 * íconos de los cursos; Farmacología y Microbiología no tienen componente
 * propio y van con el mismo dibujo que sus tarjetas del laboratorio.
 */
export default function IconoArea({ area, size = 24 }: { area: AreaEncib; size?: number }) {
  switch (area) {
    case 'ANA':
      return <LocomotorIcon size={size} color="white" colorDark="rgba(255,255,255,0.6)" />;
    case 'EMB':
      return <ReproductiveIcon size={size} white />;
    case 'HIS':
      return <BiologiaCelularIcon size={size} color="white" />;
    case 'BIO':
      return <QuimicaOrganicaIcon size={size} color="white" />;
    case 'FIS':
      return <HeartIcon size={size} white />;
    case 'PAT':
      return <MicroscopeIcon size={size} style={{ color: 'white' }} />;
    case 'FAR':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3.5" y="8.5" width="17" height="7" rx="3.5" transform="rotate(-45 12 12)" stroke="white" strokeWidth="1.9" />
          <path d="m9.3 9.3 5.4 5.4" stroke="white" strokeWidth="1.9" />
          <path d="M8.2 15.8 12 12" stroke="rgba(255,255,255,0.55)" strokeWidth="4.6" strokeLinecap="round" />
        </svg>
      );
    case 'MIC':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4" fill="white" stroke="white" strokeWidth="2" />
          <path d="m8 12-3-2M16 12l3-2M12 8l2-3M12 16l-2 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}
