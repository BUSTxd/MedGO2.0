// Datos del visor comparativo del tronco encefálico.
//
// Dos lados: el CADÁVER (vistas reales) y la MAQUETA 3D (anillo de 4 perspectivas).
// Cada vista lleva `markers` opcionales — coordenadas en % sobre la imagen + el nombre
// aceptado de la estructura — para el FUTURO modo examen (poner un punto y preguntar el
// nombre). Hoy están vacíos; cuando BUST arme el examen será solo agregar data, sin tocar
// el componente. La idea de `accept` (sinónimos aceptados) replica `Concept.accept` de
// `AnatExam.tsx`.

const BASE =
  'https://dabrwqwzvvnosdnmvlrp.supabase.co/storage/v1/object/public/examenes-img/neurologia/tronco-encefalico';

/** Punto interactivo para el examen futuro. `x`/`y` en % relativo a la imagen (0–100). */
export type Marker = { id: string; x: number; y: number; label: string; accept: string[] };

export type View = {
  id: string;
  name: string;       // etiqueta de la vista (no debe revelar respuestas en modo examen)
  src: string;
  markers?: Marker[]; // estructuras señaladas (vacío por ahora)
};

export type Side = {
  id: 'cadaver' | 'maqueta';
  title: string;
  /** 'pager': alterna entre vistas (cadáver, 2). 'rotation': anillo de perspectivas (maqueta, 4). */
  mode: 'pager' | 'rotation';
  views: View[];
};

export const CADAVER: Side = {
  id: 'cadaver',
  title: 'Cadáver',
  mode: 'pager',
  views: [
    { id: 'cad-posterior', name: 'Vista posterior', src: `${BASE}/cadaver/posterior.webp`, markers: [] },
    { id: 'cad-lateral',   name: 'Vista lateral',   src: `${BASE}/cadaver/lateral.webp`,   markers: [] },
  ],
};

export const MAQUETA: Side = {
  id: 'maqueta',
  title: 'Maqueta 3D',
  mode: 'rotation',
  // Orden de rotación a la derecha (anillo): frontal → lateral der. → posterior → lateral izq. → frontal.
  views: [
    { id: 'maq-frontal',    name: 'Frontal',           src: `${BASE}/maqueta/frontal.webp`,           markers: [] },
    { id: 'maq-lat-der',    name: 'Lateral derecha',   src: `${BASE}/maqueta/lateral-derecha.webp`,   markers: [] },
    { id: 'maq-posterior',  name: 'Posterior',         src: `${BASE}/maqueta/posterior.webp`,         markers: [] },
    { id: 'maq-lat-izq',    name: 'Lateral izquierda', src: `${BASE}/maqueta/lateral-izquierda.webp`, markers: [] },
  ],
};
