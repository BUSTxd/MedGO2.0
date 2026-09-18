'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

export default function PaginaVistaTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname) trackEvent('pagina_vista');
  }, [pathname]);
  return null;
}
