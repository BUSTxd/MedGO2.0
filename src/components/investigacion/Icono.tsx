import type { ReactNode } from 'react';

/**
 * Registro de íconos SVG (line-art, `currentColor`) para las fichas de
 * Investigación. Reemplaza los emojis del campo `icono` de cada tarjeta.
 * Convención: viewBox 0 0 24 24, trazo heredado del color del contenedor.
 */
const ICONOS: Record<string, ReactNode> = {
  // ── Metas / objetivos ──
  diana: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  iman: (
    <>
      <path d="M7 4v7a5 5 0 0 0 10 0V4" />
      <path d="M7 4h3M14 4h3M7 8.5h3M14 8.5h3" />
    </>
  ),
  niebla: <path d="M4 8h11M7 12h13M4 16h11M8 20h10" />,
  detective: (
    <>
      <ellipse cx="12" cy="16" rx="9" ry="2.2" />
      <path d="M6 16c0-5 1.5-9 6-9s6 4 6 9" />
    </>
  ),
  pregunta: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.3a2.6 2.6 0 1 1 3.8 2.3c-.9.5-1.3 1.1-1.3 2" />
      <circle cx="12" cy="16.6" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  engranaje: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </>
  ),
  columnas: (
    <>
      <path d="M3 20h18" />
      <path d="M12 4L4 9h16z" />
      <path d="M5 20V10M10 20V10M14 20V10M19 20V10" />
    </>
  ),
  puente: (
    <>
      <path d="M3 17h18" />
      <path d="M3 17v-3M21 17v-3" />
      <path d="M3 14a9 9 0 0 1 18 0" />
      <path d="M8 14v3M12 12v5M16 14v3" />
    </>
  ),

  // ── Datos / números ──
  numeros: <path d="M9 4L7 20M17 4l-2 16M4 9h16M3 15h16" />,
  barras: (
    <>
      <path d="M3 21h18" />
      <rect x="5" y="10" width="3" height="8" rx="0.5" />
      <rect x="10.5" y="5" width="3" height="13" rx="0.5" />
      <rect x="16" y="13" width="3" height="5" rx="0.5" />
    </>
  ),
  subida: (
    <>
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M17 7h4v4" />
    </>
  ),
  bajada: (
    <>
      <path d="M3 7l6 6 4-4 8 8" />
      <path d="M17 17h4v-4" />
    </>
  ),
  cuadricula: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
    </>
  ),
  calculo: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <rect x="8" y="6" width="8" height="3" rx="0.5" />
      <path d="M9 13h.01M12 13h.01M15 13h.01M9 17h.01M12 17h.01M15 17h.01" />
    </>
  ),
  division: (
    <>
      <path d="M5 12h14" />
      <circle cx="12" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="16.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  multiplicar: <path d="M7 7l10 10M17 7L7 17" />,
  azar: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9" cy="15" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  etiqueta: (
    <>
      <path d="M11 3H4v7l10 10 7-7L11 3z" />
      <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
    </>
  ),
  archivador: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M4 10h16" />
      <path d="M10 6V4h4v2" />
    </>
  ),

  // ── Mente / conocimiento ──
  cerebro: (
    <>
      <path d="M12 6c-1.5-2-5-2-6 .3-2 .3-2.5 3-.8 4.3-1.2 1-1 3.2.5 4 .3 2 3 2.6 4.5 1.4M12 6v13" />
      <path d="M12 6c1.5-2 5-2 6 .3 2 .3 2.5 3 .8 4.3 1.2 1 1 3.2-.5 4-.3 2-3 2.6-4.5 1.4" />
    </>
  ),
  idea: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.9.8 1 1.6 1 2.5h6c0-.9.1-1.7 1-2.5A6 6 0 0 0 12 3z" />
    </>
  ),
  ojos: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  oculto: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.6A9.6 9.6 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-2.4 3M6.3 7.2C3.7 8.8 2 12 2 12s4 7 10 7a9.7 9.7 0 0 0 3.3-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  espejo: (
    <>
      <ellipse cx="12" cy="9" rx="6" ry="7" />
      <path d="M12 16v4M9 22h6" />
      <path d="M10.5 5.5A3.5 3.5 0 0 0 9 8.5" />
    </>
  ),

  // ── Ciencia / laboratorio ──
  microscopio: (
    <>
      <path d="M6 21h11" />
      <path d="M11 21v-2.5" />
      <path d="M7.5 17.5a5 5 0 0 0 7-2.2" />
      <path d="M11.5 5.5l3.2 1.9-3 5-3.2-1.9z" />
      <path d="M9.3 13l-1.8 3" />
    </>
  ),
  tubo: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v13a2 2 0 0 0 4 0V3" />
      <path d="M10 12h4" />
    </>
  ),
  telescopio: (
    <>
      <path d="M3 15.5l3.5 1.8L15 6.2l-3.5-1.8z" />
      <path d="M11.5 8.3l3.5 1.8" />
      <path d="M7.5 17l1.8 3.8M11 18.6l1.8 3.5" />
    </>
  ),
  adn: (
    <>
      <path d="M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9" />
      <path d="M9.3 6.5h5.4M9.3 17.5h5.4M10.5 4.5h3M10.5 19.5h3" />
    </>
  ),
  escudo: (
    <path d="M11.36 20.68c.2.11.31.16.45.19.11.02.27.02.38 0 .14-.03.25-.08.45-.19C14.54 19.69 20 16.46 20 12V8.22c0-.8 0-1.2-.13-1.54a2 2 0 0 0-.55-.79c-.28-.24-.65-.38-1.4-.66l-5.36-2.01c-.21-.08-.31-.12-.42-.13a1 1 0 0 0-.28 0c-.11.01-.21.05-.42.13L6.08 5.22c-.75.28-1.12.42-1.4.66a2 2 0 0 0-.55.79C4 7.02 4 7.42 4 8.22V12c0 4.46 5.46 7.69 7.36 8.68Z" />
  ),
  alarma: (
    <>
      <path d="M5 20h14" />
      <path d="M7 20v-6a5 5 0 0 1 10 0v6" />
      <path d="M12 3v2" />
      <circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  advertencia: (
    <>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  prohibido: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M6 6l12 12" />
    </>
  ),

  // ── Medición ──
  regla: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1" />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
    </>
  ),
  escuadra: (
    <>
      <path d="M5 4v15h15z" />
      <path d="M8 16h2M8 12h2M11.5 16h2" />
    </>
  ),
  balanza: (
    <>
      <path d="M4 21h16M12 21V7M14 5a2 2 0 0 1-4 0M14 5a2 2 0 0 0-4 0M14 5h6M10 5H4" />
      <path d="M6 17c1.5 0 2.76-.84 2.97-2.25a.9.9 0 0 0-.05-.48L6 9l-2.97 4.97a.9.9 0 0 0-.05.48C3.24 15.86 4.5 17 6 17ZM18 17c1.5 0 2.76-.84 2.97-2.25a.9.9 0 0 0-.05-.48L18 9l-2.97 4.97a.9.9 0 0 0-.05.48C15.24 15.86 16.5 17 18 17Z" />
    </>
  ),
  control: (
    <>
      <path d="M4 8h9M18 8h2M4 16h2M11 16h9" />
      <circle cx="15" cy="8" r="2.2" />
      <circle cx="8" cy="16" r="2.2" />
    </>
  ),
  brujula: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2.2 5-4.8 2.2 2.2-5z" fill="currentColor" stroke="none" />
    </>
  ),
  lupa: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M20 20l-5.3-5.3" />
    </>
  ),

  // ── Tiempo ──
  reloj: (
    <>
      <path d="M6 3h12M6 21h12" />
      <path d="M6 3c0 5 6 6 6 9M18 3c0 5-6 6-6 9M6 21c0-5 6-6 6-9M18 21c0-5-6-6-6-9" />
    </>
  ),
  cronometro: (
    <>
      <circle cx="12" cy="14" r="7" />
      <path d="M12 14V9.5" />
      <path d="M10 3h4M12 3v3.5M18.5 7.5L20 6" />
    </>
  ),

  // ── Mundo / conexión ──
  globo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18" />
    </>
  ),
  estrellas: (
    <>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  cadena: (
    <>
      <path d="M10 14a4 4 0 0 1 0-6l1.2-1.2a4 4 0 0 1 5.6 5.6L15.5 13.5" />
      <path d="M14 10a4 4 0 0 1 0 6l-1.2 1.2a4 4 0 0 1-5.6-5.6L8.5 10.5" />
    </>
  ),
  mezcla: (
    <>
      <path d="M3 7h4c2 0 3 1.2 4 3M3 17h4c2 0 3-1.2 4-3" />
      <path d="M15 7h4m0 0l-2-2m2 2l-2 2" />
      <path d="M11 10c1 2 2 3 4 3h4m0 0l-2-2m2 2l-2 2" />
    </>
  ),
  flechas: (
    <>
      <path d="M4 12h16" />
      <path d="M7 8l-3 4 3 4M17 8l3 4-3 4" />
    </>
  ),
  ciclo: (
    <>
      <path d="M4 12a8 8 0 0 1 13.5-5.8L20 8" />
      <path d="M20 12a8 8 0 0 1-13.5 5.8L4 16" />
      <path d="M20 4v4h-4M4 20v-4h4" />
    </>
  ),
  acuerdo: (
    <>
      <path d="M3 9v5l3.5 3 2.5-2" />
      <path d="M21 9v5l-3.5 3-2.5-2" />
      <path d="M9 8l3-2 3 2 3-1" />
      <path d="M6 9l3-1" />
      <path d="M9 15l1.5 1.5M11.5 13l1.5 1.5M14 11l1.5 1.5" />
    </>
  ),

  // ── Documentos ──
  portapapeles: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <rect x="9" y="2.5" width="6" height="4" rx="1" />
      <path d="M9 11h6M9 15h6" />
    </>
  ),
  documento: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  mapa: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),

  // ── Personas ──
  personas: (
    <>
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <path d="M2.5 20a5.5 5.5 0 0 1 11 0M10.5 20a5.5 5.5 0 0 1 11 0" />
    </>
  ),
  fuerza: <path d="M4 9v6M7 6.5v11M17 6.5v11M20 9v6M7 12h10" />,

  // ── Imagen / medios ──
  sol: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2 2M17.1 17.1l2 2M19.1 4.9l-2 2M6.9 17.1l-2 2" />
    </>
  ),
  camara: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M8 7l1.5-3h5L16 7" />
    </>
  ),
  claqueta: (
    <>
      <rect x="3" y="9" width="18" height="11" rx="1.5" />
      <path d="M3 9L6 5h14l1 4" />
      <path d="M8 9l3-4M14 9l3-4" />
    </>
  ),
  retroceder: <path d="M11 6l-7 6 7 6V6zM20 6l-7 6 7 6V6z" fill="currentColor" stroke="currentColor" />,
  avanzar: <path d="M4 6l7 6-7 6V6zM13 6l7 6-7 6V6z" fill="currentColor" stroke="currentColor" />,

  // ── Varios ──
  puerta: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M5 21h14" />
      <circle cx="15" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  vias: (
    <>
      <path d="M9 3L6 21M15 3l3 18" />
      <path d="M5 8h14M5 13h14M4 18h16" />
    </>
  ),
  trofeo: (
    <>
      <path d="M8 4h8v4a4 4 0 0 1-8 0z" />
      <path d="M8 5H5v1.5a3 3 0 0 0 3 3M16 5h3v1.5a3 3 0 0 1-3 3" />
      <path d="M12 12v4M9 20h6M10 16h4l1 4H9z" />
    </>
  ),
  medalla: (
    <>
      <path d="M8.5 3l3.5 6 3.5-6" />
      <circle cx="12" cy="15" r="5" />
      <path d="M12 12.5l.9 1.8 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9.1 14.6l2-.3z" fill="currentColor" stroke="none" />
    </>
  ),
  gota: <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" />,
  hoyo: (
    <>
      <ellipse cx="12" cy="13" rx="8" ry="5" />
      <path d="M4.5 11a8 5 0 0 0 15 0" />
    </>
  ),
  uno: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.5 8.5L13 7v9" />
      <path d="M10 16h5" />
    </>
  ),
  verter: (
    <>
      <path d="M5 4.5l6.5 3-2.2 4.8-6.5-3z" />
      <path d="M9.3 12.3c2.2 2.8 3.4 5.9 3.4 9.2" />
      <path d="M12.7 21.5a2.2 2.2 0 0 0 .3-4.3" />
    </>
  ),
  pieza: (
    <path d="M10 3a2 2 0 0 0-2 2v1.2H5.5a2 2 0 0 0-2 2V11h1.2a2 2 0 0 1 0 4H3.5v2.5a2 2 0 0 0 2 2H8v-1.2a2 2 0 0 1 4 0V21.5h2.5a2 2 0 0 0 2-2V17h1.2a2 2 0 0 0 0-4H16.5V8.2a2 2 0 0 0-2-2H12V5a2 2 0 0 0-2-2z" />
  ),

  rayo: <path d="M13 2L4 14h6l-1 8 9-12h-6z" fill="currentColor" stroke="currentColor" />,

  chat: (
    <>
      <path d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
      <path d="M7.5 9.5h9M7.5 12.5h6" />
    </>
  ),
  birrete: (
    <>
      <path d="M2 8.5l10-4 10 4-10 4-10-4z" />
      <path d="M6 10.5V15c0 1.3 2.7 2.5 6 2.5s6-1.2 6-2.5v-4.5" />
      <path d="M22 8.5v5" />
    </>
  ),
  chincheta: (
    <>
      <path d="M9 3h6l-1 2v4l3 3H7l3-3V5L9 3z" />
      <path d="M12 15v6" />
    </>
  ),
  guitarra: (
    <>
      <path d="M20 3l-2 2M18.5 4.5l1.8 1.8" />
      <path d="M17.2 6.3l-5 5" />
      <path d="M11.8 10.5a4.2 4.2 0 1 0-2.6 7.6 3.3 3.3 0 0 0 3.3-3.3c1.6-.2 2.6-1.5 2.4-3-.2-1.3-1.4-2.1-3.1-1.3z" />
      <circle cx="9.6" cy="14.4" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  fruta: (
    <>
      <circle cx="12" cy="14" r="7" />
      <path d="M12 7c-.5-2 .5-3.5 2.5-4M12 7c.3-1.4-.3-2.4-1.5-3" />
      <path d="M12 7V4" />
    </>
  ),
  libro: (
    <>
      <path d="M12 6c-1.8-1.2-4-1.5-6-1v12c2-.5 4.2-.2 6 1 1.8-1.2 4-1.5 6-1V5c-2-.5-4.2-.2-6 1z" />
      <path d="M12 6v12" />
    </>
  ),
  destello: (
    <>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </>
  ),

  __fallback: <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />,
};

export default function Icono({ name, className }: { name: string; className?: string }) {
  const contenido = ICONOS[name] ?? ICONOS.__fallback;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {contenido}
    </svg>
  );
}
