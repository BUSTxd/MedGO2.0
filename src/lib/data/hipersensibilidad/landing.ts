// Escena corta para la landing: la reexposición del tipo I en tres pasos (el alérgeno
// vuelve, entrecruza dos IgE, el mastocito desgranula y la vénula responde). Es el mismo
// motor y las mismas piezas que el laboratorio, sin texto ni lupas: es un adelanto, no
// el capítulo. Sólo importa de `sensibilizacion` (vistazo gratis), nunca de los capítulos
// de pago, para que sus datos no viajen en el JS de la landing.

import type { Escenario } from './tipos';
import { H } from './colores';
import { DIST_IGE, FCERI, mastocitoConReceptores } from './sensibilizacion';

const IGES = ['ige1', 'ige2', 'ige3', 'ige4'];
const MAST = { col: 3.4, row: 3.9 };
/** Encuadre fijo para los tres pasos: la cámara no se mueve, sólo la fisiología. */
const ENCUADRE = { col: 1.2, row: 0.3, w: 11.2, h: 7 };

const landing: Escenario = {
  id: 'landing-anafilaxia',
  nombre: 'Hipersensibilidad tipo I',
  resumen: 'El alérgeno vuelve, el mastocito desgranula y la vénula responde.',
  fondo: 'mucosa',
  actores: {
    mast: { forma: 'celula', img: 'mastocito', label: 'Mastocito sensibilizado', d: 150, color: H.mastocito, info: 'mastocito' },
    ige1: { forma: 'anticuerpo', ab: 'IgE', label: 'IgE', d: 42, color: H.ige, info: 'ige' },
    ige2: { forma: 'anticuerpo', ab: 'IgE', label: 'IgE', d: 42, color: H.ige, info: 'ige' },
    ige3: { forma: 'anticuerpo', ab: 'IgE', label: 'IgE', d: 42, color: H.ige, info: 'ige' },
    ige4: { forma: 'anticuerpo', ab: 'IgE', label: 'IgE', d: 42, color: H.ige, info: 'ige' },
    alg: { forma: 'celula', img: 'alergeno', label: 'Alérgeno', sub: 'el mismo de antes', d: 58, color: '#E8B21E', info: 'alergeno' },
    venA: { forma: 'ancla', label: 'Vénula', info: 'venula' },
  },
  pasos: [
    {
      id: 'l-0',
      orden: 0,
      titulo: 'El alérgeno vuelve',
      texto: '', profundiza: '', protagonistas: ['mast', 'alg'], encuadre: ENCUADRE,
      acciones: [
        { at: 0, tipo: 'appear', actor: 'mast', pos: MAST },
        ...mastocitoConReceptores('mast', 200),
        ...IGES.flatMap((k, i) => [
          { at: 300 + i * 80, tipo: 'appear' as const, actor: k, pos: { col: MAST.col + Math.cos((FCERI[i] * Math.PI) / 180) * 1.3, row: MAST.row + Math.sin((FCERI[i] * Math.PI) / 180) * 1.3 } },
          { at: 500 + i * 80, tipo: 'bind' as const, actor: k, target: 'mast', ang: FCERI[i], dist: DIST_IGE, apunta: 'fc' as const, duration: 500 },
        ]),
        { at: 0, tipo: 'appear', actor: 'venA', pos: { col: 7, row: 4.9 } },
        { at: 1000, tipo: 'appear', actor: 'alg', pos: { col: 4.9, row: 0.7 }, from: 'top' },
        { at: 1600, tipo: 'move', actor: 'alg', to: { col: 4.9, row: 2.3 }, duration: 1400 },
      ],
    },
    {
      id: 'l-1',
      orden: 1,
      titulo: 'Une dos IgE',
      texto: '', profundiza: '', protagonistas: ['mast', 'alg'], encuadre: ENCUADRE,
      acciones: [
        { at: 0, tipo: 'bind', actor: 'alg', target: 'mast', ang: -20, dist: 165, duration: 1100 },
        { at: 1200, tipo: 'note', text: 'Puente entre dos IgE', near: 'alg', side: 'right' },
      ],
    },
    {
      id: 'l-2',
      orden: 2,
      titulo: 'Desgranula y la vénula responde',
      texto: '', profundiza: '', protagonistas: ['mast', 'venA'], encuadre: ENCUADRE,
      acciones: [
        { at: 0, tipo: 'swap', actor: 'mast', img: 'mastocito_activo', label: 'Mastocito activado' },
        { at: 300, tipo: 'activate', actor: 'mast' },
        { at: 500, tipo: 'degranular', actor: 'mast', kind: 'histamina', duration: 2600 },
        { at: 2300, tipo: 'secretar', actor: 'mast', kind: 'histamina', hacia: 'venA', n: 20, label: 'Histamina → H1', duration: 1800 },
        { at: 3000, tipo: 'tejido', param: 'vasodilatacion', a: 1, duration: 1800 },
        { at: 3600, tipo: 'tejido', param: 'fuga', a: 0.9, duration: 1800 },
        { at: 4400, tipo: 'tejido', param: 'edema', a: 0.7, duration: 2200 },
        { at: 5000, tipo: 'note', text: 'Se abren huecos entre las células endoteliales', near: 'venA', side: 'top' },
      ],
    },
  ],
};

export default landing;
