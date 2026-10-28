'use client';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useChatIA, type PedidoIA } from '@/components/ia/useChatIA';
import { IAProvider } from '@/components/ia/IAContext';

// La mascota trae la hoja de estilos de la landing: baja aparte, cuando ya se pintó la interfaz.
const Grimi = dynamic(() => import('./Grimi'), { ssr: false });

/**
 * MedGO IA en la interfaz de estudio, con la cara de GRIMI. Aquí vive la conversación
 * (`useChatIA`); el lector le pasa lo subrayado con `pedir` y GRIMI lo responde en su
 * globo. `puedeUsar` es sólo la señal de la interfaz (hoy, el admin): quien decide de
 * verdad es `api/ia/chat`, que comprueba sesión, plan y saldo.
 *
 * El valor del contexto es estable (la conversación va por ref), así que una respuesta
 * en curso re-renderiza a GRIMI y no al lector.
 */

export interface GrimiEstado {
  puedeUsar: boolean;
  /** Pregunta sobre el resumen `claseId` (lo subrayado, una figura…). */
  pedir: (p: PedidoIA, claseId: string) => void;
}

const GrimiContext = createContext<GrimiEstado | null>(null);

export function useGrimi(): GrimiEstado | null {
  return useContext(GrimiContext);
}

const nada = () => {};

export default function GrimiIA({ puedeUsar, subir, sobreBarra, children }: {
  puedeUsar: boolean;
  subir: boolean;
  sobreBarra: boolean;
  children: React.ReactNode;
}) {
  const chat = useChatIA(null);
  const chatRef = useRef(chat);
  chatRef.current = chat;
  const claseRef = useRef<string | null>(null);
  // Cada pedido nuevo abre el globo de GRIMI.
  const [llamada, setLlamada] = useState(0);

  const pedir = useCallback((p: PedidoIA, claseId: string) => {
    const c = chatRef.current;
    if (c.enCurso) return;
    // Otro resumen, otra conversación.
    if (claseRef.current !== claseId) { c.nueva(); claseRef.current = claseId; }
    c.pedir({ ...p, claseId });
    setLlamada((n) => n + 1);
  }, []);

  const valor = useMemo(() => ({ puedeUsar, pedir }), [puedeUsar, pedir]);
  // El visor a pantalla completa trae su propio panel de IA: le basta con saber si puede usarse.
  const ia = useMemo(() => ({ puedeUsar, abierto: false, abrir: nada, cerrar: nada }), [puedeUsar]);

  return (
    <GrimiContext.Provider value={valor}>
      <IAProvider value={ia}>
        {children}
        <Grimi subir={subir} sobreBarra={sobreBarra} chat={puedeUsar ? chat : null} llamada={llamada} />
      </IAProvider>
    </GrimiContext.Provider>
  );
}
