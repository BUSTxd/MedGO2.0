'use client';
// Laboratorio de Patología «Checkpoints del ciclo celular»: el anillo del
// ciclo con sus cinco puntos de control; cada uno abre la vía molecular en
// modo explorar, aprender o prueba. Sin cabecera del dashboard: se entra
// directo al anillo, y la vuelta al laboratorio vive en su esquina.

import dynamic from 'next/dynamic';
import { Newsreader } from 'next/font/google';
import TrackLabVisit from '@/components/TrackLabVisit';
import s from '@/styles/cicloCelular.module.css';

// Serif de lectura solo para narración y títulos (recuerda a un libro de
// texto); la interfaz sigue en Outfit como el resto de la app.
const newsreader = Newsreader({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-newsreader', display: 'swap' });

// Solo en cliente: progreso en localStorage, URL leída al montar y escena
// animada con requestAnimationFrame.
const CicloLab = dynamic(() => import('./CicloLab'), {
  ssr: false,
  loading: () => <div className={s.cargando} aria-busy="true" />,
});

export default function CheckpointsCicloCelularPage() {
  return (
    <div className={`${s.wrapper} ${newsreader.variable}`}>
      <TrackLabVisit labId="checkpoints-ciclo-celular" />
      <CicloLab />
    </div>
  );
}
