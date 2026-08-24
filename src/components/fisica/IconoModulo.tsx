/**
 * Íconos de las secciones del módulo. Line-art, `currentColor`, viewBox 24 —
 * mismo criterio que el registro `ICONOS` de Investigación: la clave vive en
 * el archivo de datos y el SVG aquí, para que añadir una sección no obligue a
 * pegar markup en el contenido.
 */
const ICONOS: Record<string, React.ReactNode> = {
  resorte: (
    <>
      <path d="M3 12h2.5l2-6 3 12 3-12 2 6H21" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  pendulo: (
    <>
      <path d="M4 4h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 4l3 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="15.5" cy="17" r="3.2" stroke="currentColor" strokeWidth="2.2" />
    </>
  ),
  onda: (
    <>
      <path d="M2 12c2-6 4-6 6 0s4 6 6 0 4-6 6 0" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  oido: (
    <>
      <path d="M6.5 9a5.5 5.5 0 1 1 11 0c0 3.6-2.8 3.9-2.8 7.4A2.7 2.7 0 0 1 12 19"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.6 9.2a2.6 2.6 0 0 1 5.1.4" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" />
    </>
  ),

  /* ─── C7 · Temperatura y calor ─────────────────────────────────────────── */
  termometro: (
    <>
      <path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4.5 4.5 0 1 1-4 0Z" stroke="currentColor"
        strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M12 9v7.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  llama: (
    <>
      <path d="M12 3c3.5 3.6 5.5 6.3 5.5 9a5.5 5.5 0 0 1-11 0c0-1.6.7-3 2-4.4.3 1.3.9 2 1.8 2.2C10.8 7.5 11.2 5.2 12 3Z"
        stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
    </>
  ),
  gota: (
    <>
      <path d="M12 3.2c3 3.7 5 6.4 5 8.9a5 5 0 0 1-10 0c0-2.5 2-5.2 5-8.9Z"
        stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M9.4 12.6a2.7 2.7 0 0 0 2 2.6" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" />
    </>
  ),
  flujoCalor: (
    <>
      <path d="M4 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 5v14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 9h7M8 15h7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M13 6.5 15.5 9 13 11.5M13 12.5 15.5 15 13 17.5" stroke="currentColor"
        strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  /* ─── Una por clase del sílabo ─────────────────────────────────────────── */
  plano: (
    <>
      <path d="M3 19h18L3 7v12Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M10.5 10.2l3 2.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  choque: (
    <>
      <circle cx="6" cy="12" r="3.4" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="18" cy="12" r="3.4" stroke="currentColor" strokeWidth="2.2" />
      <path d="M10.2 12h3.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 8.6v-2M12 17.4v-2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  giro: (
    <>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 12h5.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
    </>
  ),
  palanca: (
    <>
      <path d="M3.5 15h17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8 15l3-7 3 7" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M18 15v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  vaso: (
    <>
      <path d="M3 7c4 0 5 5 9 5s5-5 9-5" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17c4 0 5-5 9-5s5 5 9 5" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  piston: (
    <>
      <path d="M5 20h14V9H5z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M4 9h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 9V3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  cargas: (
    <>
      <circle cx="7" cy="12" r="3.8" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="17" cy="12" r="3.8" stroke="currentColor" strokeWidth="2.2" />
      <path d="M5.2 12h3.6M15.2 12h3.6M17 10.2v3.6" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" />
    </>
  ),
  condensador: (
    <>
      <path d="M4 9h16M4 15h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M12 3v6M12 15v6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  circuito: (
    <>
      <path d="M3 12h3l2-4 3 8 3-8 2 4h5" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  iman: (
    <>
      <path d="M6 4v9a6 6 0 0 0 12 0V4" stroke="currentColor" strokeWidth="2.2"
        strokeLinecap="round" />
      <path d="M3.5 4H8.5M15.5 4h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  lente: (
    <>
      <path d="M12 3.5c3.8 3.8 3.8 13.2 0 17-3.8-3.8-3.8-13.2 0-17Z" stroke="currentColor"
        strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M2.5 12h19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  foton: (
    <>
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 2.4v3M12 18.6v3M2.4 12h3M18.6 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
};

export default function IconoModulo({ name, size = 24 }: { name: string; size?: number }) {
  const contenido = ICONOS[name];
  if (!contenido) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {contenido}
    </svg>
  );
}
