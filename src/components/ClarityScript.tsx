'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { useConsent } from './ConsentProvider';
import { useAuth } from './AuthProvider';

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Carga Microsoft Clarity (mapa de calor + grabaciones de sesión) SOLO si:
 *  - el usuario aceptó las cookies analíticas (consent === 'granted'), y
 *  - existe NEXT_PUBLIC_CLARITY_ID (Project ID de clarity.microsoft.com).
 *
 * El script se inyecta con strategy="afterInteractive" → carga diferida, impacto
 * mínimo en el LCP (mismo principio que el lazy-load del SDK de Mercado Pago).
 *
 * Identidad: en cuanto Clarity está disponible y hay sesión, etiqueta la sesión
 * con el user.id real (NO anónimo). El plan se etiqueta aparte desde el
 * dashboard (ClarityPlanTag), donde sí existe el PlanProvider.
 */
export default function ClarityScript() {
  const { consent } = useConsent();
  const { user } = useAuth();

  useEffect(() => {
    if (consent !== 'granted' || !user) return;
    let tries = 0;
    const id = setInterval(() => {
      if (window.clarity) {
        window.clarity('identify', user.id);
        clearInterval(id);
      } else if (++tries > 20) {
        clearInterval(id);
      }
    }, 250);
    return () => clearInterval(id);
  }, [consent, user]);

  if (consent !== 'granted' || !CLARITY_ID) return null;

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${CLARITY_ID}");`}
    </Script>
  );
}
