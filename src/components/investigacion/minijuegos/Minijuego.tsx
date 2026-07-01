'use client';
import type { MinijuegoConfig } from '@/lib/investigacion/types';
import DragConnect from './DragConnect';
import VerdaderoFalsoTrampa from './VerdaderoFalsoTrampa';
import OrdenarSecuencia from './OrdenarSecuencia';
import CasoClinico from './CasoClinico';
import MapaConceptual from './MapaConceptual';
import ErrorInvestigador from './ErrorInvestigador';
import QuizMultiple from './QuizMultiple';

export interface MinijuegoResult {
  intentos: number;
  sinErrores: boolean;
}

export interface MinijuegoProps<C = MinijuegoConfig> {
  config: C;
  onComplete: (result: MinijuegoResult) => void;
}

/** Despacha al minijuego correcto según `config.tipo`. */
export default function Minijuego({ config, onComplete }: MinijuegoProps) {
  switch (config.tipo) {
    case 'drag':
      return <DragConnect config={config} onComplete={onComplete} />;
    case 'vf':
      return <VerdaderoFalsoTrampa config={config} onComplete={onComplete} />;
    case 'orden':
      return <OrdenarSecuencia config={config} onComplete={onComplete} />;
    case 'caso':
      return <CasoClinico config={config} onComplete={onComplete} />;
    case 'mapa':
      return <MapaConceptual config={config} onComplete={onComplete} />;
    case 'error':
      return <ErrorInvestigador config={config} onComplete={onComplete} />;
    case 'quiz':
      return <QuizMultiple config={config} onComplete={onComplete} />;
    default:
      return null;
  }
}
